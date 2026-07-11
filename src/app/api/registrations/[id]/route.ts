import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import { getRegistrationById } from '@/lib/db/models/registration'

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

