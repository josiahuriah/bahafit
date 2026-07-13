import { NextRequest, NextResponse } from 'next/server'
import { signFygaroWebhook } from '@/lib/fygaro'
import { getRegistrationById } from '@/lib/db/models/registration'

/**
 * DEV-ONLY: simulate a Fygaro webhook for a registration.
 *
 * Posts a properly-signed webhook to /api/webhooks/fygaro internally so
 * you can test the full payment-confirmation loop without standing up a
 * tunnel to Fygaro's servers.
 *
 * Disabled outside of NODE_ENV=development.
 *
 * Usage:
 *   POST /api/dev/fygaro-simulate
 *   Body: { "registrationId": "<id>", "status"?: "succeeded"|"failed"|"refunded" }
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'not available in production' }, { status: 404 })
  }

  const body = await req.json().catch(() => ({}))
  const registrationId: string | undefined = body.registrationId
  const status: string = body.status || 'succeeded'

  if (!registrationId) {
    return NextResponse.json({ error: 'registrationId required' }, { status: 400 })
  }

  const registration = await getRegistrationById(registrationId)
  if (!registration) {
    return NextResponse.json({ error: 'registration not found' }, { status: 404 })
  }

  const eventName =
    status === 'refunded'
      ? 'payment.refunded'
      : status === 'failed'
        ? 'payment.failed'
        : 'payment.succeeded'

  const fakePayload = {
    event: eventName,
    transaction_id: `dev_tx_${Date.now()}`,
    custom_reference: registrationId,
    amount: registration.price,
    currency: registration.currency,
    status,
  }

  const rawBody = JSON.stringify(fakePayload)
  const headers = signFygaroWebhook(rawBody)

  // Resolve our own webhook URL. Use the request's origin so this works
  // regardless of port.
  const origin = new URL(req.url).origin
  const webhookUrl = `${origin}/api/webhooks/fygaro`

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: rawBody,
  })

  const responseBody = await res.json().catch(() => ({}))

  return NextResponse.json({
    ok: res.ok,
    status: res.status,
    forwardedTo: webhookUrl,
    payload: fakePayload,
    webhookResponse: responseBody,
  })
}
