import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import { createRegistration, getExistingRegistration, updateRegistration, getRegistrationsByEvent } from '@/lib/db/models/registration'
import { getUserEventById } from '@/lib/db/models/event'
import { generateFygaroPaymentLink } from '@/lib/fygaro'
import { client } from '@/sanity/lib/client'
import { computeCheckoutFees } from '@/lib/utils'

interface SanityPricingTier {
  tierName?: string
  price?: number
  earlyBirdPrice?: number
  currency?: string
}

interface SanityCheckoutEvent {
  _id: string
  title: string
  slug?: { current?: string }
  isFree?: boolean
  price?: number
  pricing?: SanityPricingTier[]
  earlyBirdDeadline?: string
  registrationDeadline?: string
  capacity?: number
  currentRegistrations?: number
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const user = await requireAuth(session)

    const body = await req.json()
    const { eventId, ticketType } = body as {
      eventId?: string
      ticketType?: string
    }

    if (!eventId || typeof eventId !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: eventId' },
        { status: 400 }
      )
    }

    // ── Load the event from Sanity (the source of truth for pricing). ──
    // SECURITY: the price is computed entirely server-side from the
    // event's published pricing. Client-supplied price fields are ignored
    // so the amount signed into the Fygaro payment JWT can't be tampered
    // with from the browser.
    let event: SanityCheckoutEvent | null = null
    try {
      event = await client.fetch<SanityCheckoutEvent | null>(
        `*[_type == "fitnessEvent" && _id == $eventId && status == "published"][0] {
          _id,
          title,
          slug,
          "isFree": coalesce(isFree, false),
          price,
          pricing[] { tierName, price, earlyBirdPrice, currency },
          earlyBirdDeadline,
          registrationDeadline,
          capacity,
          "currentRegistrations": coalesce(currentRegistrations, 0)
        }`,
        { eventId }
      )
    } catch {
      // Sanity not configured/reachable — fall through to user events
    }

    // Fall back to user-created (MongoDB) events
    if (!event) {
      const userEvent = await getUserEventById(eventId)
      if (userEvent && userEvent.status === 'published') {
        const existingRegs = await getRegistrationsByEvent(eventId)
        event = {
          _id: userEvent._id || eventId,
          title: userEvent.title,
          slug: { current: userEvent.slug },
          isFree: userEvent.isFree,
          pricing: userEvent.pricing,
          earlyBirdDeadline: userEvent.earlyBirdDeadline,
          registrationDeadline: userEvent.registrationDeadline,
          capacity: userEvent.capacity,
          currentRegistrations: existingRegs.filter(r => r.status !== 'cancelled').length,
        }
      }
    }

    if (!event || !event.slug?.current) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Registration deadline check
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      return NextResponse.json(
        { error: 'Registration for this event has closed' },
        { status: 400 }
      )
    }

    // Capacity check
    if (
      typeof event.capacity === 'number' &&
      event.capacity > 0 &&
      (event.currentRegistrations || 0) >= event.capacity
    ) {
      return NextResponse.json(
        { error: 'This event is sold out' },
        { status: 409 }
      )
    }

    // ── Compute the authoritative price ──
    let basePrice = 0
    let currency = 'BSD'
    let resolvedTicketType: string | undefined

    if (!event.isFree) {
      const tiers = event.pricing || []
      if (tiers.length > 0) {
        const tier =
          (ticketType && tiers.find(t => t.tierName === ticketType)) || tiers[0]
        const earlyBirdActive =
          !!event.earlyBirdDeadline && new Date(event.earlyBirdDeadline) > new Date()
        basePrice =
          earlyBirdActive && typeof tier.earlyBirdPrice === 'number'
            ? tier.earlyBirdPrice
            : tier.price || 0
        currency = tier.currency || 'BSD'
        resolvedTicketType = tier.tierName
      } else {
        basePrice = event.price || 0
      }
    }

    const fees = computeCheckoutFees(basePrice)

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

    // If we're resuming a pending registration and pricing has changed
    // since it was created (e.g. early-bird expired), sync the stored
    // amounts to what we're actually charging now.
    if (existing && existing._id && existing.price !== fees.total) {
      await updateRegistration(existing._id, {
        price: fees.total,
        subtotal: fees.subtotal,
        vendorFee: fees.vendorFee,
        processingFee: fees.processingFee,
        currency,
        ticketType: resolvedTicketType,
      })
      existing.price = fees.total
      existing.currency = currency
    }

    const registration =
      existing ??
      (await createRegistration({
        eventId,
        eventTitle: event.title,
        userId,
        userName: user.name,
        userEmail: user.email,
        ticketType: resolvedTicketType,
        price: fees.total,
        subtotal: fees.subtotal,
        vendorFee: fees.vendorFee,
        processingFee: fees.processingFee,
        currency,
        status: 'pending',
        paymentStatus: 'pending',
      }))

    const paymentUrl =
      fees.total > 0
        ? generateFygaroPaymentLink({
            registrationId: registration._id || '',
            amount: fees.total,
            currency,
            eventTitle: event.title,
            eventSlug: event.slug.current,
            customerEmail: user.email,
            customerName: user.name,
          })
        : null

    return NextResponse.json({
      registration,
      paymentUrl,
      resumed: Boolean(existing),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to create registration:', error)
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    )
  }
}
