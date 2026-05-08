import { NextRequest, NextResponse } from 'next/server'
import { verifyFygaroWebhook, type FygaroWebhookEvent } from '@/lib/fygaro'
import { getRegistrationById, updateRegistration } from '@/lib/db/models/registration'

// We need the raw body for HMAC verification. Disable Next.js's
// automatic parsing by reading req.text() ourselves.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Map a Fygaro event/status string to our internal payment status.
 * Fygaro's exact wording can vary by event source (button hook,
 * link hook, dashboard webhook). We're lenient and look at both
 * `event` and `status`.
 */
function mapPaymentStatus(event: FygaroWebhookEvent): 'paid' | 'refunded' | 'pending' | null {
  const e = (event.event || '').toLowerCase()
  const s = (event.status || '').toLowerCase()

  if (e.includes('refund') || s === 'refunded') return 'refunded'
  if (e.includes('succeed') || e.includes('paid') || e.includes('captured') || s === 'paid' || s === 'succeeded' || s === 'captured') return 'paid'
  if (e.includes('fail') || s === 'failed' || s === 'cancelled' || s === 'canceled') return 'pending'
  return null
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signatureHeader = req.headers.get('fygaro-signature')

  const result = verifyFygaroWebhook(rawBody, signatureHeader)

  if (!result.ok || !result.event) {
    console.warn('[fygaro-webhook] verification failed:', result.reason)
    return NextResponse.json(
      { error: 'invalid signature', reason: result.reason },
      { status: 400 }
    )
  }

  const event = result.event
  const registrationId = event.custom_reference

  if (!registrationId || typeof registrationId !== 'string') {
    console.warn('[fygaro-webhook] missing custom_reference in payload')
    // 200 because the payload is authentic — we just can't act on it.
    return NextResponse.json({ ok: true, ignored: 'no custom_reference' })
  }

  const registration = await getRegistrationById(registrationId)
  if (!registration) {
    console.warn(`[fygaro-webhook] no registration for id=${registrationId}`)
    return NextResponse.json({ ok: true, ignored: 'unknown registration' })
  }

  const newPaymentStatus = mapPaymentStatus(event)
  if (!newPaymentStatus) {
    console.info(`[fygaro-webhook] unhandled event type, skipping`, {
      event: event.event,
      status: event.status,
    })
    return NextResponse.json({ ok: true, ignored: 'unhandled event' })
  }

  // Idempotency: if we've already recorded this transaction id, do nothing.
  const txId = event.transaction_id || (event.id as string | undefined)
  if (txId && registration.paymentId === txId && registration.paymentStatus === newPaymentStatus) {
    return NextResponse.json({ ok: true, idempotent: true })
  }

  await updateRegistration(registrationId, {
    paymentStatus: newPaymentStatus,
    status: newPaymentStatus === 'paid' ? 'confirmed' : registration.status,
    paymentId: txId || registration.paymentId,
    metadata: {
      ...(registration.metadata || {}),
      lastWebhookEvent: event.event,
      lastWebhookAt: new Date().toISOString(),
    },
  })

  return NextResponse.json({ ok: true })
}

// GET is only useful for a quick "is this endpoint live?" probe.
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'fygaro-webhook',
    note: 'POST signed payloads from Fygaro to this URL.',
  })
}
