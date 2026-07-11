import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import { createRegistration, getExistingRegistration } from '@/lib/db/models/registration'
import { generateFygaroPaymentLink } from '@/lib/fygaro'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const user = await requireAuth(session)

    const body = await req.json()
    const {
      eventId,
      eventSlug,
      eventTitle,
      ticketType,
      price,
      subtotal,
      vendorFee,
      processingFee,
      currency,
    } = body

    if (!eventId || !eventSlug || !eventTitle || price == null || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, eventSlug, eventTitle, price, currency' },
        { status: 400 }
      )
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: 'Price must be a non-negative number' },
        { status: 400 }
      )
    }

    const userId = user.id || user._id || ''

    // If the user already has a non-cancelled registration for this event,
    // there are three cases:
    //   - paid / confirmed → block with 409 (genuinely already registered).
    //   - pending payment   → reuse the same registration and re-issue a
    //                          fresh signed payment link so they can resume
    //                          their checkout.
    //   - any other status  → reuse and continue.
    const existing = await getExistingRegistration(eventId, userId)

    if (existing && existing.paymentStatus === 'paid') {
      return NextResponse.json(
        { error: 'already_registered', registration: existing },
        { status: 409 }
      )
    }

    const registration =
      existing ??
      (await createRegistration({
        eventId,
        eventTitle,
        userId,
        userName: user.name,
        userEmail: user.email,
        ticketType,
        price,
        subtotal: typeof subtotal === 'number' ? subtotal : undefined,
        vendorFee: typeof vendorFee === 'number' ? vendorFee : undefined,
        processingFee: typeof processingFee === 'number' ? processingFee : undefined,
        currency,
        status: 'pending',
        paymentStatus: 'pending',
      }))

    const paymentUrl =
      price > 0
        ? generateFygaroPaymentLink({
            registrationId: registration._id || '',
            amount: price,
            currency,
            eventTitle,
            eventSlug,
            customerEmail: user.email,
            customerName: user.name,
          })
        : null

    return NextResponse.json({
      registration,
      paymentUrl,
      resumed: Boolean(existing),
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Account is inactive') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Failed to create registration:', error)
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    )
  }
}
