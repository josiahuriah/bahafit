// Shared helpers for the "coming soon" / password gate that sits in front of
// the whole site. This runs in both the Edge middleware runtime and Node route
// handlers, so it sticks to the Web Crypto API and standard globals only.

export type GateMode = 'off' | 'coming-soon' | 'password'

// Cookie that marks a visitor as having entered the developer-build password.
export const GATE_COOKIE = 'bahafit-gate'

// How long an unlock lasts before the password must be entered again.
export const GATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

// Decide what the gate should do for the current deployment.
//
// `SITE_GATE` is the explicit control — set it per-environment in Vercel:
//   off          → site is live, no gate at all
//   coming-soon  → every visitor lands on /coming-soon (the public block)
//   password     → visitors must enter the shared password to reach the site
//
// When `SITE_GATE` is unset we fall back to sensible defaults per Vercel
// environment: the Production deployment is blocked with the coming-soon page,
// Preview deployments (the "developer build") ask for the password, and
// anything else (local dev, self-hosted) is left open.
export function getGateMode(): GateMode {
  const explicit = process.env.SITE_GATE?.toLowerCase().trim()
  if (explicit === 'off' || explicit === 'coming-soon' || explicit === 'password') {
    return explicit
  }

  // Back-compat with the previous COMING_SOON_MODE flag.
  if (process.env.COMING_SOON_MODE === 'true') return 'coming-soon'

  switch (process.env.VERCEL_ENV) {
    case 'production':
      return 'coming-soon'
    case 'preview':
      return 'password'
    default:
      return 'off'
  }
}

// The password test users type on the /enter page. Falls back to the older
// COMING_SOON_PASSWORD name, then a built-in default so the gate works out of
// the box.
export function getGatePassword(): string {
  return (
    process.env.SITE_GATE_PASSWORD ??
    process.env.COMING_SOON_PASSWORD ??
    'Fit4it!'
  )
}

// Key used to sign the unlock cookie. AUTH_SECRET is already required by
// NextAuth; we fall back to the gate password only so local setups without a
// secret still function.
function getSecret(): string {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? getGatePassword()
}

const encoder = new TextEncoder()

function toBase64Url(bytes: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return toBase64Url(signature)
}

// Length-safe comparison so a wrong signature can't be probed byte by byte.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

// Build the signed cookie value that proves the password was entered. The
// value is `<expires>.<hmac(expires)>` so it can't be forged without the
// secret and stops working on its own once it expires.
export async function createAccessToken(): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + GATE_COOKIE_MAX_AGE
  const signature = await sign(String(expires))
  return `${expires}.${signature}`
}

// Verify a cookie value produced by createAccessToken().
export async function verifyAccessToken(token: string | undefined): Promise<boolean> {
  if (!token) return false

  const dot = token.indexOf('.')
  if (dot === -1) return false

  const expiresPart = token.slice(0, dot)
  const signaturePart = token.slice(dot + 1)

  const expires = Number(expiresPart)
  if (!Number.isFinite(expires) || expires * 1000 < Date.now()) return false

  const expected = await sign(expiresPart)
  return safeEqual(expected, signaturePart)
}
