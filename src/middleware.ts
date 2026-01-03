import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Debug logging (remove after fixing)
  if (pathname.startsWith('/admin')) {
    console.log('=== ADMIN ACCESS DEBUG ===')
    console.log('Path:', pathname)
    console.log('Has session:', !!session)
    console.log('User role:', session?.user?.role)
    console.log('User isActive:', session?.user?.isActive)
    console.log('========================')
  }

  // Define protected routes
  const isAdminRoute = pathname.startsWith('/admin')
  const isAuthRoute = pathname.startsWith('/auth')
  const isApiAdminRoute = pathname.startsWith('/api/admin')

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && session) {
    if (session.user?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Protect admin routes
  if (isAdminRoute || isApiAdminRoute) {
    if (!session) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    if (session.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (!session.user?.isActive) {
      return NextResponse.redirect(new URL('/account-inactive', req.url))
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    if (!session.user?.isActive) {
      return NextResponse.redirect(new URL('/account-inactive', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
}
