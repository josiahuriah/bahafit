import { NextRequest, NextResponse } from 'next/server'
import { auth, requireRole } from '@/lib/auth'
import { client } from '@/sanity/lib/client'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    await requireRole(session, ['admin'])

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const eventType = searchParams.get('eventType')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    let filter = '_type == "fitnessEvent"'
    const params: Record<string, string> = {}

    if (status && status !== 'all') {
      filter += ' && status == $status'
      params.status = status
    }

    if (eventType && eventType !== 'all') {
      filter += ' && eventType == $eventType'
      params.eventType = eventType
    }

    if (featured === 'true') {
      filter += ' && featured == true'
    }

    if (search) {
      filter += ' && (title match $search || shortDescription match $search)'
      params.search = `*${search}*`
    }

    const query = `*[${filter}] | order(_createdAt desc) {
      _id,
      title,
      slug,
      eventType,
      startDate,
      endDate,
      status,
      featured,
      isVirtual,
      capacity,
      currentRegistrations,
      isFree,
      "location": location.city,
      "island": location.island,
      "organizerName": organizer->name,
      "featuredImage": featuredImage.asset->url,
      _createdAt,
      _updatedAt
    }`

    const events = await client.fetch(query, params)

    return NextResponse.json({ events })
  } catch (error: any) {
    console.error('Failed to fetch events:', error)

    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
