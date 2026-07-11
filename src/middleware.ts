import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const COMING_SOON_MODE = process.env.COMING_SOON_MODE === 'true'

function isComingSoonAllowed(pathname: string) {
  if (pathname === '/coming-soon') return true
  if (pathname.startsWith('/coming-soon/')) return true
  if (pathname.startsWith('/auth/')) return true
  if (pathname.startsWith('/api/auth/')) return true
  if (pathname.startsWith('/_next/')) return true
  if (pathname.startsWith('/images/')) return true
  if (pathname.startsWith('/videos/')) return true
  if (pathname === '/favicon.ico' || pathname === '/robots.txt') return true
  if (/\.(?:png|jpe?g|svg|gif|webp|ico|css|js|woff2?|ttf|otf|map)$/i.test(pathname)) return true
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (COMING_SOON_MODE && !isComingSoonAllowed(pathname)) {
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
    const token = secret
      ? await getToken({
          req: request,
          secret,
          secureCookie: request.nextUrl.protocol === 'https:',
        })
      : null

    if (token?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/coming-soon'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  const sessionToken =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value

  if (pathname.startsWith('/admin')) {
    console.log('=== ADMIN ACCESS DEBUG ===')
    console.log('Path:', pathname)
    console.log('Has session token:', !!sessionToken)
    console.log('========================')
  }

  const isAdminRoute = pathname.startsWith('/admin')
  const isApiAdminRoute = pathname.startsWith('/api/admin')

  if (isAdminRoute || isApiAdminRoute) {
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
