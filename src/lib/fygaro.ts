/**
 * Fygaro Payment Link Generator + Webhook Verifier
 *
 * Uses Fygaro's signed (JWT, HS256) Payment Button flow.
 * The JWT is appended to the Payment Button URL as ?jwt=...; Fygaro reads
 * the signed amount/currency/reference from it, so the user can't tamper
 * with the price by editing the URL.
 *
 * Env (server-only — DO NOT add NEXT_PUBLIC_ to any of these):
 *   FYGARO_API_KEY              — JWT `kid` header value
 *   FYGARO_API_SECRET           — HMAC-SHA256 signing key
 *   FYGARO_PAYMENT_BUTTON_URL   — Public URL of the payment button you
 *                                 created in the Fygaro dashboard, e.g.
 *                                 https://www.fygaro.com/en/pb/<uuid>
 *   FYGARO_WEBHOOK_SECRET       — Optional override for webhook HMAC.
 *                                 Defaults to FYGARO_API_SECRET.
 *   NEXT_PUBLIC_APP_URL         — Used to build success/cancel return URLs.
 *
 * Docs:
 *   https://help.fygaro.com/en-us/article/fygaro-links-integration-api-h78p9y/
 *   https://help.fygaro.com/en-us/article/payment-button-hook-1wkui1k/
 */

import { createHmac, timingSafeEqual } from 'crypto'

// ---------- helpers ----------

function base64UrlEncode(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function fygaroEnv() {
  return {
    apiKey: process.env.FYGARO_API_KEY,
    apiSecret: process.env.FYGARO_API_SECRET,
    buttonUrl: process.env.FYGARO_PAYMENT_BUTTON_URL,
    webhookSecret:
      process.env.FYGARO_WEBHOOK_SECRET || process.env.FYGARO_API_SECRET,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  }
}

// ---------- payment link generation ----------

interface FygaroPaymentParams {
  registrationId: string
  amount: number
  currency: string
  eventTitle: string
  customerEmail: string
  customerName: string
  /** Used to build per-event return URLs. */
  eventSlug: string
  /** Optional: tax included in amount, in same currency. */
  taxAmount?: number
  /** Seconds until link expires. Defaults to 30 minutes. */
  expiresInSeconds?: number
}

/**
 * Build a signed Fygaro payment URL the user can be redirected to.
 * Returns null if Fygaro isn't configured (lets the caller fall through
 * to a manual-payment flow instead of crashing).
 */
export function generateFygaroPaymentLink(
  params: FygaroPaymentParams
): string | null {
  const { apiKey, apiSecret, buttonUrl, appUrl } = fygaroEnv()

  if (!apiKey || !apiSecret || !buttonUrl) {
    return null
  }

  const now = Math.floor(Date.now() / 1000)
  const ttl = params.expiresInSeconds ?? 60 * 30 // 30 minutes

  const header = {
    alg: 'HS256',
    typ: 'JWT',
    kid: apiKey,
  }

  // Per Fygaro docs, payload supports: amount, tax_amount, currency,
  // custom_reference, exp, nbf. We use custom_reference for our
  // registration ID so the webhook can map back to it.
  const payload: Record<string, unknown> = {
    amount: Number(params.amount.toFixed(2)),
    currency: params.currency,
    custom_reference: params.registrationId,
    nbf: now - 5, // small clock-skew buffer
    exp: now + ttl,
  }

  if (params.taxAmount != null) {
    payload.tax_amount = Number(params.taxAmount.toFixed(2))
  }

  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const payloadB64 = base64UrlEncode(JSON.stringify(payload))
  const signingInput = `${headerB64}.${payloadB64}`
  const signature = base64UrlEncode(
    createHmac('sha256', apiSecret).update(signingInput).digest()
  )
  const jwt = `${signingInput}.${signature}`

  // Fygaro's button URL accepts the JWT as a query param. We also pass
  // a return URL so the customer lands back on our confirmation page.
  const url = new URL(buttonUrl)
  url.searchParams.set('jwt', jwt)

  // Return URLs are nice-to-have — Fygaro buttons can also have these
  // configured in the dashboard. We pass them anyway so local dev works
  // without needing to edit the button settings each time.
  const slug = encodeURIComponent(params.eventSlug)
  const returnUrl = new URL(
    `/events/${slug}/checkout/confirmation`,
    appUrl
  )
  returnUrl.searchParams.set('registrationId', params.registrationId)
  url.searchParams.set('return_url', returnUrl.toString())

  const cancelUrl = new URL(
    `/events/${slug}/checkout/cancelled`,
    appUrl
  )
  cancelUrl.searchParams.set('registrationId', params.registrationId)
  url.searchParams.set('cancel_url', cancelUrl.toString())

  return url.toString()
}

export function isFygaroConfigured(): boolean {
  const { apiKey, apiSecret, buttonUrl } = fygaroEnv()
  return !!(apiKey && apiSecret && buttonUrl)
}

// ---------- webhook verification ----------

export interface FygaroWebhookEvent {
  /** "payment.succeeded", "payment.failed", "payment.refunded", etc. */
  event?: string
  /** Fygaro's own transaction id. */
  transaction_id?: string
  /** Echoed back from the JWT we signed. */
  custom_reference?: string
  amount?: number
  currency?: string
  status?: string
  [key: string]: unknown
}

interface VerifyResult {
  ok: boolean
  reason?: string
  /** Parsed JSON body when verification succeeded. */
  event?: FygaroWebhookEvent
}

/**
 * Verify a Fygaro webhook delivery.
 *
 * Fygaro sends:
 *   Fygaro-Signature: t=<unix-ts>,v1=<hmac-sha256-hex>[,v1=<rotated-secret-hex>]
 *   Fygaro-Key-ID:    <api-key-that-signed-it>   (used when keys are rotated)
 *
 * We:
 *   1. Reject if the timestamp is more than `toleranceSeconds` from now (replay defense)
 *   2. Compute HMAC-SHA256(secret, "<t>.<rawBody>") and compare to each v1=
 *      using timingSafeEqual.
 *
 * `rawBody` MUST be the unparsed request body (string or Buffer). Don't pass
 * a re-stringified JSON object — whitespace differences will break the hash.
 */
export function verifyFygaroWebhook(
  rawBody: string,
  signatureHeader: string | null | undefined,
  options: {
    secret?: string
    toleranceSeconds?: number
    keyId?: string | null
  } = {}
): VerifyResult {
  const { webhookSecret } = fygaroEnv()
  const secret = options.secret || webhookSecret

  if (!secret) {
    return { ok: false, reason: 'webhook secret not configured' }
  }

  if (!signatureHeader) {
    return { ok: false, reason: 'missing Fygaro-Signature header' }
  }

  // Parse "t=...,v1=...,v1=..."
  const parts = signatureHeader.split(',').map(s => s.trim())
  let timestamp: number | null = null
  const signatures: string[] = []
  for (const part of parts) {
    const eq = part.indexOf('=')
    if (eq < 0) continue
    const k = part.slice(0, eq).trim()
    const v = part.slice(eq + 1).trim()
    if (k === 't') timestamp = Number(v)
    else if (k === 'v1') signatures.push(v)
  }

  if (!timestamp || Number.isNaN(timestamp)) {
    return { ok: false, reason: 'malformed Fygaro-Signature (no t=)' }
  }

  if (signatures.length === 0) {
    return { ok: false, reason: 'malformed Fygaro-Signature (no v1=)' }
  }

  const tolerance = options.toleranceSeconds ?? 300
  const nowSec = Math.floor(Date.now() / 1000)
  if (Math.abs(nowSec - timestamp) > tolerance) {
    return { ok: false, reason: 'signature timestamp outside tolerance' }
  }

  // Fygaro signs `<timestamp>.<rawBody>`.
  const expected = createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex')

  const expectedBuf = Buffer.from(expected, 'utf8')
  const matched = signatures.some(sig => {
    const sigBuf = Buffer.from(sig, 'utf8')
    if (sigBuf.length !== expectedBuf.length) return false
    return timingSafeEqual(sigBuf, expectedBuf)
  })

  if (!matched) {
    return { ok: false, reason: 'signature mismatch' }
  }

  let parsed: FygaroWebhookEvent
  try {
    parsed = JSON.parse(rawBody) as FygaroWebhookEvent
  } catch {
    return { ok: false, reason: 'webhook body is not valid JSON' }
  }

  return { ok: true, event: parsed }
}

/**
 * Build the headers a webhook sender would attach to a request, using
 * the configured API secret and key. Useful for re-driving a delivery
 * or for any internal tooling that needs to call our webhook endpoint
 * with a valid signature.
 */
export function signFygaroWebhook(rawBody: string, secret?: string) {
  const { webhookSecret, apiKey } = fygaroEnv()
  const useSecret = secret || webhookSecret
  if (!useSecret) {
    throw new Error('Cannot sign webhook: no secret configured')
  }
  const ts = Math.floor(Date.now() / 1000)
  const sig = createHmac('sha256', useSecret)
    .update(`${ts}.${rawBody}`)
    .digest('hex')
  return {
    'Fygaro-Signature': `t=${ts},v1=${sig}`,
    'Fygaro-Key-ID': apiKey || '',
  }
}

