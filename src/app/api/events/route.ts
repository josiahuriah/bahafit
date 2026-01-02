import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const eventType = searchParams.get('eventType')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const upcoming = searchParams.get('upcoming')
    const limit = searchParams.get('limit')

    let filter = '_type == "fitnessEvent" && status == "published"'
    const params: Record<string, string> = {}

    if (eventType && eventType !== 'all') {
      filter += ' && eventType == $eventType'
      params.eventType = eventType
    }

    if (featured === 'true') {
      filter += ' && featured == true'
    }

    if (upcoming === 'true') {
      filter += ' && startDate > now()'
    }

    if (search) {
      filter += ' && (title match $search || shortDescription match $search)'
      params.search = `*${search}*`
    }

    const limitClause = limit ? `[0...${limit}]` : ''

    const query = `*[${filter}] | order(startDate asc) ${limitClause} {
      _id,
      title,
      slug,
      eventType,
      shortDescription,
      startDate,
      endDate,
      isVirtual,
      isFree,
      featured,
      capacity,
      currentRegistrations,
      "location": location {
        venueName,
        city,
        island
      },
      "pricing": pricing[] {
        tierName,
        price,
        earlyBirdPrice,
        currency
      },
      "featuredImage": featuredImage.asset->url,
      "organizerName": organizer->name,
      tags
    }`

    const events = await client.fetch(query, params)

    // Get event type counts for filters
    const typesQuery = `{
      "types": *[_type == "fitnessEvent" && status == "published"] {
        eventType
      }
    }`
    const typesResult = await client.fetch(typesQuery)
    const eventTypeCounts = typesResult.types.reduce((acc: Record<string, number>, item: { eventType: string }) => {
      acc[item.eventType] = (acc[item.eventType] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({ events, eventTypeCounts })
  } catch (error: any) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
