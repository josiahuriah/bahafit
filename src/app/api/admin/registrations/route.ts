import { NextRequest, NextResponse } from 'next/server'
import { auth, requireRole } from '@/lib/auth'
import { getAllRegistrations, getRegistrationStats } from '@/lib/db/models/registration'
import { Registration } from '@/types/auth'

// GET /api/admin/registrations?status=&paymentStatus=&eventId=
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    await requireRole(session, ['admin'])

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const eventId = searchParams.get('eventId')

    const filters: {
      status?: Registration['status']
      paymentStatus?: Registration['paymentStatus']
      eventId?: string
    } = {}

    if (status && status !== 'all') filters.status = status as Registration['status']
    if (paymentStatus && paymentStatus !== 'all') {
      filters.paymentStatus = paymentStatus as Registration['paymentStatus']
    }
    if (eventId) filters.eventId = eventId

    const [registrations, stats] = await Promise.all([
      getAllRegistrations(filters),
      getRegistrationStats(),
    ])

    return NextResponse.json({ registrations, stats })
  } catch (error: unknown) {
    console.error('Failed to fetch registrations:', error)

    const message = error instanceof Error ? error.message : ''
    if (message.includes('Unauthorized') || message.includes('Forbidden')) {
      return NextResponse.json(
        { error: message },
        { status: message.includes('Unauthorized') ? 401 : 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}
