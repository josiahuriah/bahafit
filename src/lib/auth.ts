import NextAuth from 'next-auth'
import type { Session } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from './db/mongodb'
import { getUserByEmail, verifyPassword, createUser } from './db/models/user'
import { User, UserRole } from '@/types/auth'

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: UserRole
      isActive: boolean
    }
  }

  interface User {
    role: UserRole
    isActive: boolean
  }

  interface JWT {
    id: string
    role: UserRole
    isActive: boolean
  }
}

// Create a custom adapter that wraps MongoDB adapter and ensures proper typing
const adapter = MongoDBAdapter(clientPromise)
const customAdapter = {
  ...adapter,
  createUser: async (user: any) => {
    const newUser = await adapter.createUser?.(user)
    return {
      ...newUser,
      role: 'user' as UserRole,
      isActive: true,
    }
  },
} as any

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: customAdapter,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password')
        }

        const user = await getUserByEmail(credentials.email as string)

        if (!user) {
          throw new Error('No user found with this email')
        }

        if (!user.password) {
          throw new Error('Please use social login')
        }

        const isValid = await verifyPassword(credentials.password as string, user.password)

        if (!isValid) {
          throw new Error('Invalid password')
        }

        if (!user.isActive) {
          throw new Error('Account is inactive. Please contact support.')
        }

        return {
          id: user._id || user.id || '',
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          isActive: user.isActive,
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, ensure user has a role
      if (account?.provider !== 'credentials') {
        const existingUser = await getUserByEmail(user.email || '')
        if (!existingUser && user.email && user.name) {
          // Create new user with default role
          await createUser({
            name: user.name,
            email: user.email,
            password: '', // OAuth users don't need password
          })
        }
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id || ''
        token.role = user.role
        token.isActive = user.isActive
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.role = session.role || token.role
        token.isActive = session.isActive ?? token.isActive
      }

      // Always fetch fresh user data to check if account is still active
      if (token.email) {
        const dbUser = await getUserByEmail(token.email)
        if (dbUser) {
          // Normalize legacy roles: anything that isn't 'admin' becomes 'user'
          token.role = dbUser.role === 'admin' ? 'admin' : 'user'
          token.isActive = dbUser.isActive
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.isActive = token.isActive as boolean
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === 'development',
})

// Helper functions for authorization
export async function checkRole(session: Session | null, allowedRoles: UserRole[]): Promise<boolean> {
  if (!session?.user) return false
  return allowedRoles.includes(session.user.role)
}

export async function requireAuth(session: Session | null): Promise<User> {
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  if (!session.user.isActive) {
    throw new Error('Account is inactive')
  }

  return session.user as any
}

export async function requireRole(session: Session | null, allowedRoles: UserRole[]): Promise<User> {
  const user = await requireAuth(session)

  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden: Insufficient permissions')
  }

  return user
}
