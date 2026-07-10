import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import { getUserById } from '@/lib/db/models/user'
import { getAthleteStats, getActivitiesForProfile } from '@/lib/db/models/activity'
import { getFollowCounts, isFollowing } from '@/lib/db/models/follow'

// GET /api/athletes/:id — public athlete profile
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const viewer = await requireAuth(session)
    const viewerId = viewer.id || viewer._id || ''

    const { id } = await context.params
    const athlete = await getUserById(id)
    if (!athlete || athlete.isActive === false) {
      return NextResponse.json({ error: 'Athlete not found' }, { status: 404 })
    }

    const [stats, counts, viewerFollows] = await Promise.all([
      getAthleteStats(id),
      getFollowCounts(id),
      isFollowing(viewerId, id),
    ])

    const activities = await getActivitiesForProfile(id, viewerId, viewerFollows, 20)

    return NextResponse.json({
      athlete: {
        _id: athlete._id,
        name: athlete.name,
        image: athlete.image,
        createdAt: athlete.createdAt,
      },
      stats,
      counts,
      isFollowing: viewerFollows,
      isSelf: viewerId === id,
      activities: activities.map((a) => ({
        ...a,
        hasKudos: a.kudos?.includes(viewerId),
        kudos: undefined,
      })),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to fetch athlete:', error)
    return NextResponse.json({ error: 'Failed to fetch athlete' }, { status: 500 })
  }
}
