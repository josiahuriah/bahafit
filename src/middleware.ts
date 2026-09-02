import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that stay reachable without the password prompt so framework
// internals and static assets keep working. Everything else is gated when
// COMING_SOON_MODE is on.
function isPasswordExempt(pathname: string) {
  if (pathname.startsWith('/_next/')) return true
  if (pathname === '/favicon.ico' || pathname === '/robots.txt') return true
  if (/\.(?:png|jpe?g|svg|gif|webp|ico|css|js|woff2?|ttf|otf|map)$/i.test(pathname)) return true
  return false
}

// Simple HTTP Basic Auth check. Credentials default to admin / Fit4it! and
// can be overridden with COMING_SOON_USER / COMING_SOON_PASSWORD.
function hasValidPassword(request: NextRequest) {
  const header = request.headers.get('authorization')
  if (!header?.startsWith('Basic ')) return false

  let decoded: string
  try {
    decoded = atob(header.slice('Basic '.length))
  } catch {
    return false
  }

  const separator = decoded.indexOf(':')
  if (separator === -1) return false

  const user = decoded.slice(0, separator)
  const password = decoded.slice(separator + 1)

  const expectedUser = process.env.COMING_SOON_USER ?? 'admin'
  const expectedPassword = process.env.COMING_SOON_PASSWORD ?? 'Fit4it!'

  return user === expectedUser && password === expectedPassword
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    process.env.COMING_SOON_MODE === 'true' &&
    !isPasswordExempt(pathname) &&
    !hasValidPassword(request)
  ) {
    return new NextResponse('Authentication required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Bahafit", charset="UTF-8"',
      },
    })
  }

  const sessionToken =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value

  const isAdminRoute = pathname.startsWith('/admin')
  const isApiAdminRoute = pathname.startsWith('/api/admin')

  if (isAdminRoute || isApiAdminRoute) {
    if (!sessionToken) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  if (pathname.startsWith('/community')) {
    if (!sessionToken) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  if (pathname.startsWith('/dashboard')) {
    if (!sessionToken) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  if (pathname.startsWith('/blog/create')) {
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
