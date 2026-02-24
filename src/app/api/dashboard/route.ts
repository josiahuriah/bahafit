import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getRegistrationsByUser } from '@/lib/db/models/registration'
import { client } from '@/sanity/lib/client'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get user's registrations
    const registrations = await getRegistrationsByUser(session.user.id)

    // Fetch event details from Sanity for each registration
    const eventIds = [...new Set(registrations.map((r) => r.eventId))]

    let events: any[] = []
    if (eventIds.length > 0) {
      const eventsQuery = `*[_type == "fitnessEvent" && _id in $eventIds] {
        _id,
        title,
        slug,
        eventType,
        startDate,
        endDate,
        isFree,
        isVirtual,
        "location": location { venueName, city, island },
        "featuredImage": featuredImage.asset->url,
        "pricing": pricing[] { tierName, price, currency }
      }`
      events = await client.fetch(eventsQuery, { eventIds })
    }

    // Map events by ID for quick lookup
    const eventMap = new Map(events.map((e: any) => [e._id, e]))

    // Enrich registrations with event data
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
        },
      }))

    // Fetch events where this user is the organizer
    // Match by email since organizer in Sanity references a sanity user doc
    const hostingQuery = `*[_type == "fitnessEvent" && status == "published" && organizer->email == $email] | order(startDate desc) {
      _id,
      title,
      slug,
      eventType,
      startDate,
      endDate,
      isFree,
      isVirtual,
      capacity,
      currentRegistrations,
      "location": location { venueName, city, island },
      "featuredImage": featuredImage.asset->url,
      "pricing": pricing[] { tierName, price, currency }
    }`

    const hostingEvents = await client.fetch(hostingQuery, { email: session.user.email })

    return NextResponse.json({
      attending: attendingEvents,
      hosting: hostingEvents || [],
    })
  } catch (error: any) {
    console.error('Dashboard data error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
