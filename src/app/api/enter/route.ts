import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  GATE_COOKIE,
  GATE_COOKIE_MAX_AGE,
  createAccessToken,
  getGatePassword,
} from '@/lib/siteGate'

// Verifies the shared developer-build password and, on success, drops a signed
// cookie that unlocks the site for this browser.
export async function POST(request: NextRequest) {
  let password = ''
  try {
    const body = await request.json()
    password = typeof body?.password === 'string' ? body.password : ''
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (password !== getGatePassword()) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(GATE_COOKIE, await createAccessToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: GATE_COOKIE_MAX_AGE,
  })
  return response
}
