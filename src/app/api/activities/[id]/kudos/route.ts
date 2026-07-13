import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import { toggleKudos } from '@/lib/db/models/activity'

// POST /api/activities/:id/kudos — toggle kudos
export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const userId = user.id || user._id || ''

    const { id } = await context.params
    const result = await toggleKudos(id, userId)
    if (!result) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to toggle kudos:', error)
    return NextResponse.json({ error: 'Failed to toggle kudos' }, { status: 500 })
  }
}
