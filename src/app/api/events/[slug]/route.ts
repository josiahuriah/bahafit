import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { getUserEventBySlug } from '@/lib/db/models/event'

/**
 * Shape a MongoDB user-created event to match the interface the event
 * detail and checkout pages expect from Sanity events.
 */
function shapeUserEvent(e: NonNullable<Awaited<ReturnType<typeof getUserEventBySlug>>>) {
  return {
    _id: e._id,
    title: e.title,
    slug: { current: e.slug },
    eventType: e.eventType,
    shortDescription: e.shortDescription,
    description: e.shortDescription,
    startDate: e.startDate,
    endDate: e.endDate,
    isMultiDay: e.isMultiDay || false,
    registrationDeadline: e.registrationDeadline,
    earlyBirdDeadline: e.earlyBirdDeadline,
    isVirtual: e.isVirtual,
    virtualEventLink: e.virtualEventLink,
    location: e.location,
    capacity: e.capacity,
    currentRegistrations: 0,
    requiresRegistration: e.requiresRegistration,
    isFree: e.isFree,
    pricing: e.pricing,
    requirements: e.requirements,
    amenities: e.amenities,
    contactInfo: e.contactInfo,
    organizer: { name: e.userName },
    featured: false,
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const query = `*[_type == "fitnessEvent" && slug.current == $slug && status == "published"][0] {
      _id,
      title,
      slug,
      eventType,
      description,
      shortDescription,
      startDate,
      endDate,
      "isMultiDay": coalesce(isMultiDay, false),
      registrationStartDate,
      registrationDeadline,
      earlyBirdDeadline,
      "isVirtual": coalesce(isVirtual, false),
      virtualEventLink,
      virtualEventPlatform,
      location {
        venueName,
        address,
        city,
        island,
        country,
        latitude,
        longitude,
        mapUrl,
        directions
      },
      capacity,
      "currentRegistrations": coalesce(currentRegistrations, 0),
      "waitlistEnabled": coalesce(waitlistEnabled, false),
      "requiresRegistration": coalesce(requiresRegistration, true),
      "isFree": coalesce(isFree, false),
      price,
      pricing[] {
        tierName,
        description,
        price,
        earlyBirdPrice,
        currency,
        capacity,
        includes
      },
      raceCategories[] {
        name,
        distance,
        startTime,
        ageGroups
      },
      "organizer": organizer-> {
        _id,
        name,
        slug,
        profileImage,
        userType
      },
      contactInfo {
        email,
        phone,
        whatsapp
      },
      sponsors[] {
        name,
        tier,
        website,
        "logo": logo.asset->url
      },
      requirements,
      amenities,
      ageRestriction {
        minAge,
        maxAge,
        allowMinorsWithGuardian
      },
      schedule[] {
        time,
        activity,
        description,
        location
      },
      faqs[] {
        question,
        answer
      },
      externalRegistrationUrl,
      websiteUrl,
      socialLinks {
        facebook,
        instagram,
        twitter
      },
      tags,
      "featuredImage": featuredImage.asset->url,
      "images": images[].asset->url,
      "featured": coalesce(featured, false)
    }`

    let event = null
    try {
      event = await client.fetch(query, { slug })
    } catch {
      // Sanity may not be configured — fall through to user events
    }

    if (!event) {
      // Fall back to user-created events stored in MongoDB so hosted
      // events have a working public page.
      const userEvent = await getUserEventBySlug(slug)
      if (userEvent) {
        return NextResponse.json({ event: shapeUserEvent(userEvent), relatedEvents: [] })
      }
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Get related events
    const relatedQuery = `*[_type == "fitnessEvent" && status == "published" && defined(slug.current) && slug.current != $slug && eventType == $eventType] | order(startDate asc) [0...4] {
      _id,
      title,
      slug,
      eventType,
      startDate,
      "location": location.city,
      "featuredImage": featuredImage.asset->url,
      "isFree": coalesce(isFree, false),
      "pricing": pricing[0] {
        price,
        currency
      }
    }`

    const relatedEvents = await client.fetch(relatedQuery, { slug, eventType: event.eventType })

    return NextResponse.json({ event, relatedEvents })
  } catch (error: any) {
    console.error('Failed to fetch event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}
