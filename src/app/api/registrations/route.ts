import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createRegistration, getExistingRegistration } from '@/lib/db/models/registration'
import { getUserById } from '@/lib/db/models/user'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await req.json()
    const { eventId, eventTitle, ticketType, price, currency } = body

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    // Check if user is already registered for this event
    const alreadyRegistered = await getExistingRegistration(eventId, session.user.id)

    if (alreadyRegistered) {
      return NextResponse.json(
        { error: 'already_registered', registration: alreadyRegistered },
        { status: 409 }
      )
    }

    // Get user details
    const user = await getUserById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isFree = !price || price === 0

    const registration = await createRegistration({
      eventId,
      userId: session.user.id,
      userName: user.name,
      userEmail: user.email,
      ticketType: ticketType || 'General',
      price: price || 0,
      currency: currency || 'BSD',
      status: 'confirmed',
      paymentStatus: isFree ? 'paid' : 'paid', // Dummy payment always succeeds
      paymentId: isFree ? undefined : `dummy_${Date.now()}`,
      metadata: {
        eventTitle,
      },
    })

    return NextResponse.json({ registration }, { status: 201 })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    )
  }
}
