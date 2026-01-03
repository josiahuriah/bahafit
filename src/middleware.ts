import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get session token from cookies
  const sessionToken = request.cookies.get('authjs.session-token')?.value
    || request.cookies.get('__Secure-authjs.session-token')?.value

  // Debug logging
  if (pathname.startsWith('/admin')) {
    console.log('=== ADMIN ACCESS DEBUG ===')
    console.log('Path:', pathname)
    console.log('Has session token:', !!sessionToken)
    console.log('========================')
  }

  // Define protected routes
  const isAdminRoute = pathname.startsWith('/admin')
  const isApiAdminRoute = pathname.startsWith('/api/admin')

  // For admin routes, check if user has a session token
  // The actual role check will happen in the page/API route
  if (isAdminRoute || isApiAdminRoute) {
    if (!sessionToken) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!sessionToken) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
}
