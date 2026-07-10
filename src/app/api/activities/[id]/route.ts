import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import {
  getActivityById,
  updateActivity,
  deleteActivity,
  SPORT_TYPES,
} from '@/lib/db/models/activity'
import { isFollowing } from '@/lib/db/models/follow'

async function canView(activity: NonNullable<Awaited<ReturnType<typeof getActivityById>>>, viewerId: string, isAdmin: boolean) {
  if (activity.userId === viewerId || isAdmin) return true
  if (activity.visibility === 'public') return true
  if (activity.visibility === 'followers') {
    return isFollowing(viewerId, activity.userId)
  }
  return false
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const viewerId = user.id || user._id || ''

    const { id } = await context.params
    const activity = await getActivityById(id)
    if (!activity) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    if (!(await canView(activity, viewerId, user.role === 'admin'))) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      activity: { ...activity, hasKudos: activity.kudos?.includes(viewerId), kudos: undefined },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to fetch activity:', error)
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const userId = user.id || user._id || ''

    const { id } = await context.params
    const body = await req.json()

    const updates: Record<string, unknown> = {}
    if (typeof body.title === 'string' && body.title.trim()) updates.title = body.title.trim().slice(0, 120)
    if (typeof body.description === 'string') updates.description = body.description.trim().slice(0, 2000)
    if (SPORT_TYPES.includes(body.sportType)) updates.sportType = body.sportType
    if (['public', 'followers', 'private'].includes(body.visibility)) updates.visibility = body.visibility
    if (Number.isFinite(Number(body.effort)) && body.effort >= 0 && body.effort <= 10) updates.effort = Number(body.effort)

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const activity = await updateActivity(id, userId, updates)
    if (!activity) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    return NextResponse.json({ activity })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to update activity:', error)
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const userId = user.id || user._id || ''

    const { id } = await context.params

    // Admins can delete any activity (moderation)
    let success = false
    if (user.role === 'admin') {
      const activity = await getActivityById(id)
      if (activity) success = await deleteActivity(id, activity.userId)
    } else {
      success = await deleteActivity(id, userId)
    }

    if (!success) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to delete activity:', error)
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 })
  }
}
