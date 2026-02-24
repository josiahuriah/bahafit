import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

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
        directions
      },
      capacity,
      "currentRegistrations": coalesce(currentRegistrations, 0),
      "waitlistEnabled": coalesce(waitlistEnabled, false),
      "requiresRegistration": coalesce(requiresRegistration, true),
      "isFree": coalesce(isFree, true),
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

    const event = await client.fetch(query, { slug })

    if (!event) {
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
      "isFree": coalesce(isFree, true),
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
