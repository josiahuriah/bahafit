import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createUserEvent, getUserEventsByUser } from '@/lib/db/models/event'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const events = await getUserEventsByUser(session.user.id)
    return NextResponse.json({ events })
  } catch (error: any) {
    console.error('Failed to fetch user events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await req.json()

    const {
      title,
      eventType,
      shortDescription,
      startDate,
      endDate,
      isMultiDay,
      registrationDeadline,
      earlyBirdDeadline,
      isVirtual,
      virtualEventLink,
      location,
      capacity,
      requiresRegistration,
      isFree,
      pricing,
      requirements,
      amenities,
      contactInfo,
    } = body

    if (!title || !eventType || !startDate) {
      return NextResponse.json(
        { error: 'Title, event type, and start date are required' },
        { status: 400 }
      )
    }

    const event = await createUserEvent({
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
      title,
      eventType,
      shortDescription,
      startDate,
      endDate,
      isMultiDay: isMultiDay || false,
      registrationDeadline,
      earlyBirdDeadline,
      isVirtual: isVirtual || false,
      virtualEventLink,
      location,
      capacity: capacity ? Number(capacity) : undefined,
      requiresRegistration: requiresRegistration ?? true,
      isFree: isFree ?? true,
      pricing: isFree ? [] : pricing || [],
      requirements: requirements || [],
      amenities: amenities || [],
      contactInfo,
      status: 'published',
      featured: false,
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
