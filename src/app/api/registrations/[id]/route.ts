import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import { getRegistrationById, cancelRegistration } from '@/lib/db/models/registration'

/**
 * Fetch a single registration. Used by the confirmation page to poll
 * for the payment status flipping to "paid" after the webhook lands.
 *
 * Only the registration owner (or an admin) can read.
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const user = await requireAuth(session)

    const { id } = await context.params

    const registration = await getRegistrationById(id)
    if (!registration) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    const isOwner = registration.userId === (user.id || user._id)
    const isAdmin = user.role === 'admin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    return NextResponse.json({ registration })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to fetch registration:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registration' },
      { status: 500 }
    )
  }
}

/**
 * Cancel a registration. Only the owner (or an admin) can cancel, and
 * only while it hasn't been paid — paid registrations must go through a
 * refund with the organizer/admin.
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const user = await requireAuth(session)

    const { id } = await context.params
    const body = await req.json().catch(() => ({}))

    if (body.action !== 'cancel') {
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
    }

    const registration = await getRegistrationById(id)
    if (!registration) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    const isOwner = registration.userId === (user.id || user._id)
    const isAdmin = user.role === 'admin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    if (registration.status === 'cancelled') {
      return NextResponse.json({ registration })
    }

    if (registration.paymentStatus === 'paid' && !isAdmin) {
      return NextResponse.json(
        { error: 'Paid registrations cannot be self-cancelled. Please contact support for a refund.' },
        { status: 400 }
      )
    }

    const updated = await cancelRegistration(id)
    return NextResponse.json({ registration: updated })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to cancel registration:', error)
    return NextResponse.json(
      { error: 'Failed to cancel registration' },
      { status: 500 }
    )
  }
}

