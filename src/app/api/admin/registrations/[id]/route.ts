import { NextRequest, NextResponse } from 'next/server'
import { auth, requireRole } from '@/lib/auth'
import {
  getRegistrationById,
  checkInRegistration,
  cancelRegistration,
  updateRegistration,
} from '@/lib/db/models/registration'

// PATCH /api/admin/registrations/:id  { action: 'check_in' | 'cancel' | 'mark_refunded' }
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    await requireRole(session, ['admin'])

    const { id } = await context.params
    const body = await req.json().catch(() => ({}))

    const registration = await getRegistrationById(id)
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    let updated
    switch (body.action) {
      case 'check_in':
        updated = await checkInRegistration(id)
        break
      case 'cancel':
        updated = await cancelRegistration(id)
        break
      case 'mark_refunded':
        updated = await updateRegistration(id, { paymentStatus: 'refunded' })
        break
      default:
        return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
    }

    return NextResponse.json({ registration: updated })
  } catch (error: unknown) {
    console.error('Failed to update registration:', error)

    const message = error instanceof Error ? error.message : ''
    if (message.includes('Unauthorized') || message.includes('Forbidden')) {
      return NextResponse.json(
        { error: message },
        { status: message.includes('Unauthorized') ? 401 : 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    )
  }
}
