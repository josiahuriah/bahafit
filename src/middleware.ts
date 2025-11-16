import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token to check authentication
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Define protected routes
  const isAdminRoute = pathname.startsWith('/admin')
  const isAuthRoute = pathname.startsWith('/auth')
  const isApiAdminRoute = pathname.startsWith('/api/admin')

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    // If user is already logged in, redirect to dashboard based on role
    if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect admin routes
  if (isAdminRoute || isApiAdminRoute) {
    if (!token) {
      // Not authenticated - redirect to signin
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    if (token.role !== 'admin') {
      // Not an admin - redirect to unauthorized page
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    if (!token.isActive) {
      // Account is inactive
      return NextResponse.redirect(new URL('/account-inactive', request.url))
    }
  }

  // Protect dashboard routes (for all authenticated users)
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    if (!token.isActive) {
      return NextResponse.redirect(new URL('/account-inactive', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (NextAuth API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
}
