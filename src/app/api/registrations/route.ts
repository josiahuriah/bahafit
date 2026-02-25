import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import { createRegistration } from '@/lib/db/models/registration'
import { generateFygaroPaymentLink } from '@/lib/fygaro'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const user = await requireAuth(session)

    const body = await req.json()
    const { eventId, eventTitle, ticketType, price, currency } = body

    if (!eventId || !eventTitle || price == null || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, eventTitle, price, currency' },
        { status: 400 }
      )
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: 'Price must be a non-negative number' },
        { status: 400 }
      )
    }

    const registration = await createRegistration({
      eventId,
      eventTitle,
      userId: user.id || (user as any)._id || '',
      userName: user.name,
      userEmail: user.email,
      ticketType,
      price,
      currency,
      status: 'pending',
      paymentStatus: 'pending',
    })

    const paymentUrl = generateFygaroPaymentLink({
      registrationId: registration._id || '',
      amount: price,
      currency,
      eventTitle,
      customerEmail: user.email,
      customerName: user.name,
    })

    return NextResponse.json({
      registration,
      paymentUrl,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Account is inactive') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Failed to create registration:', error)
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    )
  }
}
