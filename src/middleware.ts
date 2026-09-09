import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { GATE_COOKIE, getGateMode, verifyAccessToken } from './lib/siteGate'

// Framework internals and static assets always load, whatever the gate does,
// so the coming-soon page and the /enter page can render their own styling.
function isAssetPath(pathname: string) {
  if (pathname.startsWith('/_next/')) return true
  if (pathname === '/favicon.ico' || pathname === '/robots.txt') return true
  if (/\.(?:png|jpe?g|svg|gif|webp|ico|css|js|woff2?|ttf|otf|map)$/i.test(pathname)) return true
  return false
}

// The site gate. Returns a response to short-circuit the request, or null to
// let it continue to the normal auth checks below.
//
//   coming-soon → everyone is redirected to /coming-soon (the public block)
//   password    → visitors must unlock the site on /enter with the shared
//                 password (used on the developer build / preview deploys)
//   off         → site is live, nothing is gated
async function applyGate(request: NextRequest): Promise<NextResponse | null> {
  const mode = getGateMode()
  if (mode === 'off') return null

  const { pathname } = request.nextUrl
  if (isAssetPath(pathname)) return null

  if (mode === 'coming-soon') {
    // Pure public block: everyone lands on the marketing page, no bypass.
    if (pathname === '/coming-soon' || pathname.startsWith('/coming-soon/')) {
      return null
    }
    const url = request.nextUrl.clone()
    url.pathname = '/coming-soon'
    url.search = ''
    return NextResponse.redirect(url)
  }

  // mode === 'password' — the developer build. Let test users open the real
  // site by entering the shared password on the dedicated /enter page.
  if (pathname === '/enter' || pathname === '/api/enter') return null

  const unlocked = await verifyAccessToken(request.cookies.get(GATE_COOKIE)?.value)
  if (unlocked) return null

  const enterUrl = new URL('/enter', request.url)
  const target = pathname + request.nextUrl.search
  if (target && target !== '/') {
    enterUrl.searchParams.set('callbackUrl', target)
  }
  return NextResponse.redirect(enterUrl)
}

export async function middleware(request: NextRequest) {
  const gateResponse = await applyGate(request)
  if (gateResponse) return gateResponse

  const { pathname } = request.nextUrl

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
