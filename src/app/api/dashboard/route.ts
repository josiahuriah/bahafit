import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getRegistrationsByUser } from '@/lib/db/models/registration'
import { getUserEventsByUser } from '@/lib/db/models/event'
import { client } from '@/sanity/lib/client'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Run all fetches in parallel
    const [registrations, mongoHostingEvents] = await Promise.all([
      getRegistrationsByUser(session.user.id),
      getUserEventsByUser(session.user.id),
    ])

    // Fetch Sanity event details for each registration
    const eventIds = [...new Set(registrations.map((r) => r.eventId))]

    let sanityEvents: any[] = []
    if (eventIds.length > 0) {
      try {
        const eventsQuery = `*[_type == "fitnessEvent" && _id in $eventIds] {
          _id,
          title,
          "slug": slug,
          eventType,
          startDate,
          endDate,
          "isFree": coalesce(isFree, true),
          "isVirtual": coalesce(isVirtual, false),
          "location": location { venueName, city, island },
          "featuredImage": featuredImage.asset->url,
          "pricing": pricing[] { tierName, price, currency }
        }`
        sanityEvents = await client.fetch(eventsQuery, { eventIds })
      } catch {
        // Sanity may not be configured in dev — fall back to metadata
      }
    }

    const eventMap = new Map(sanityEvents.map((e: any) => [e._id, e]))

    // Enrich registrations with Sanity event data (or metadata fallback)
    const attendingEvents = registrations
      .filter((r) => r.status !== 'cancelled')
      .map((r) => ({
        registrationId: r._id,
        status: r.status,
        paymentStatus: r.paymentStatus,
        ticketType: r.ticketType,
        price: r.price,
        currency: r.currency,
        registeredAt: r.registeredAt,
        event: eventMap.get(r.eventId) || {
          _id: r.eventId,
          title: r.metadata?.eventTitle || 'Unknown Event',
          startDate: r.metadata?.startDate,
        },
      }))

    // Shape MongoDB user-created events to match the EventSummary interface
    const hosting = mongoHostingEvents.map((e) => ({
      _id: e._id,
      title: e.title,
      slug: e.slug ? { current: e.slug } : undefined,
      eventType: e.eventType,
      startDate: e.startDate,
      endDate: e.endDate,
      isFree: e.isFree,
      isVirtual: e.isVirtual,
      capacity: e.capacity,
      currentRegistrations: 0, // will wire up later
      location: e.location,
      pricing: e.pricing?.map((p) => ({
        tierName: p.tierName,
        price: p.price,
        currency: p.currency,
      })),
      status: e.status,
    }))

    return NextResponse.json({
      attending: attendingEvents,
      hosting,
    })
  } catch (error: any) {
    console.error('Dashboard data error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
