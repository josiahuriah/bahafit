import NextAuth from 'next-auth'
import type { Session } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import type { Adapter, AdapterUser } from 'next-auth/adapters'
import { getMongoClient } from './db/mongodb'
import { getUserByEmail, verifyPassword } from './db/models/user'
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

// Passing a function keeps the connection lazy while ensuring Auth.js receives
// a MongoClient directly, with no thenable object at the adapter boundary.
// The adapter currently resolves a patch-newer @auth/core than next-auth does.
// Their Adapter shapes are runtime-compatible, so normalize the duplicate type.
const adapter = MongoDBAdapter(getMongoClient) as unknown as Adapter
const createAdapterUser = adapter.createUser

if (!createAdapterUser) {
  throw new Error('MongoDB adapter is missing createUser')
}

// Persist application-specific defaults when Auth.js creates an OAuth user.
const customAdapter: Adapter = {
  ...adapter,
  createUser: async (user: AdapterUser) => {
    const now = new Date()
    const userWithDefaults = {
      ...user,
      role: user.role ?? ('user' as UserRole),
      isActive: user.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    }

    return createAdapterUser(userWithDefaults)
  },
}

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

        // Use a single generic message for "no user", "OAuth-only account",
        // and "wrong password" so attackers can't enumerate which emails
        // have accounts.
        if (!user || !user.password) {
          throw new Error('Invalid email or password')
        }

        const isValid = await verifyPassword(credentials.password as string, user.password)

        if (!isValid) {
          throw new Error('Invalid email or password')
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
      // Google verifies the email in its OIDC identity. This lets an existing
      // password account sign in with Google without creating a duplicate user.
      allowDangerousEmailAccountLinking: true,
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
    async signIn({ user, account, profile }) {
      // Only permit automatic Google account linking for identities whose email
      // Google explicitly marks as verified.
      if (account?.provider === 'google' && profile?.email_verified !== true) {
        return false
      }

      // Auth.js owns OAuth user creation and account linking. This callback only
      // prevents an inactive existing user from bypassing that status via OAuth.
      if (account?.provider !== 'credentials' && user.email) {
        const existingUser = await getUserByEmail(user.email)
        if (existingUser?.isActive === false) return false
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id || ''
        token.role = user.role ?? 'user'
        token.isActive = user.isActive ?? true
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
          token.isActive = dbUser.isActive ?? true
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

  return session.user as unknown as User
}

export async function requireRole(session: Session | null, allowedRoles: UserRole[]): Promise<User> {
  const user = await requireAuth(session)

  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden: Insufficient permissions')
  }

  return user
}
