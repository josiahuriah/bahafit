import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getRegistrationsByUser } from '@/lib/db/models/registration'
import { getUserEventsByUser } from '@/lib/db/models/event'
import { getUserListingsByUser } from '@/lib/db/models/listing'
import { client } from '@/sanity/lib/client'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Run all fetches in parallel
    const [registrations, mongoHostingEvents, userListings] = await Promise.all([
      getRegistrationsByUser(session.user.id),
      getUserEventsByUser(session.user.id),
      getUserListingsByUser(session.user.id),
    ])

    // Fetch Sanity event details for each registration
    const eventIds = [...new Set(registrations.map((r) => r.eventId))]

    interface SanityDashboardEvent {
      _id: string
      title?: string
      startDate?: string
      [key: string]: unknown
    }

    let sanityEvents: SanityDashboardEvent[] = []
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

    const eventMap = new Map(sanityEvents.map((e) => [e._id, e]))

    // Enrich registrations with Sanity event data (or metadata fallback)
    const shapeRegistration = (r: (typeof registrations)[number]) => ({
      registrationId: r._id,
      status: r.status,
      paymentStatus: r.paymentStatus,
      ticketType: r.ticketType,
      price: r.price,
      currency: r.currency,
      registeredAt: r.registeredAt,
      event: eventMap.get(r.eventId) || {
        _id: r.eventId,
        title: r.eventTitle || r.metadata?.eventTitle || 'Unknown Event',
        startDate: r.metadata?.startDate,
      },
    })

    const attendingEvents = registrations
      .filter((r) => r.status !== 'cancelled')
      .map(shapeRegistration)

    const cancelledEvents = registrations
      .filter((r) => r.status === 'cancelled')
      .map(shapeRegistration)

    // Purchase stats — everything the user has actually paid for
    const paid = registrations.filter((r) => r.paymentStatus === 'paid')
    const totalSpentByCurrency: Record<string, number> = {}
    for (const r of paid) {
      const cur = r.currency || 'BSD'
      totalSpentByCurrency[cur] = (totalSpentByCurrency[cur] || 0) + (r.price || 0)
    }

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

    // Shape user listings for the dashboard
    const listings = userListings.map((l) => ({
      _id: l._id,
      title: l.title,
      slug: l.slug,
      listingType: l.listingType,
      category: l.category,
      status: l.status,
      verified: l.verified,
      location: l.location,
      createdAt: l.createdAt,
    }))

    return NextResponse.json({
      attending: attendingEvents,
      cancelled: cancelledEvents,
      hosting,
      listings,
      stats: {
        ticketsPurchased: paid.length,
        totalSpentByCurrency,
        eventsHosting: hosting.length,
        listingsOwned: listings.length,
      },
    })
  } catch (error: unknown) {
    console.error('Dashboard data error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
