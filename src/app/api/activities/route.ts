import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import { createActivity, getFeed, SPORT_TYPES, SportType, ActivityVisibility, ActivityMedia } from '@/lib/db/models/activity'
import { getFollowingIds } from '@/lib/db/models/follow'

// GET /api/activities?scope=following|all|me&before=<ISO>&userId=
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const viewerId = user.id || user._id || ''

    const { searchParams } = new URL(req.url)
    const scopeParam = searchParams.get('scope')
    const scope = scopeParam === 'all' || scopeParam === 'me' ? scopeParam : 'following'
    const beforeParam = searchParams.get('before')
    const before = beforeParam ? new Date(beforeParam) : undefined

    const followingIds = await getFollowingIds(viewerId)

    const activities = await getFeed({
      viewerId,
      followingIds,
      scope,
      before: before && !Number.isNaN(before.getTime()) ? before : undefined,
      limit: 20,
    })

    return NextResponse.json({
      activities: activities.map((a) => ({ ...a, hasKudos: a.kudos?.includes(viewerId), kudos: undefined })),
      nextCursor: activities.length === 20 ? activities[activities.length - 1].createdAt : null,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to fetch feed:', error)
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 })
  }
}

// POST /api/activities — log a workout manually
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const userId = user.id || user._id || ''

    const body = await req.json()

    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 120) : ''
    const sportType = SPORT_TYPES.includes(body.sportType) ? (body.sportType as SportType) : null
    const durationSec = Number(body.durationSec)

    if (!title || !sportType || !Number.isFinite(durationSec) || durationSec <= 0 || durationSec > 60 * 60 * 24) {
      return NextResponse.json(
        { error: 'Title, sport type, and a valid duration are required' },
        { status: 400 }
      )
    }

    const startedAt = body.startedAt ? new Date(body.startedAt) : new Date()
    if (Number.isNaN(startedAt.getTime()) || startedAt > new Date(Date.now() + 60_000)) {
      return NextResponse.json({ error: 'Invalid start time' }, { status: 400 })
    }

    const clampNum = (v: unknown, max: number) => {
      const n = Number(v)
      return Number.isFinite(n) && n >= 0 && n <= max ? n : undefined
    }

    const visibility: ActivityVisibility = ['public', 'followers', 'private'].includes(body.visibility)
      ? body.visibility
      : 'public'

    // Media: only accept items that point at our Sanity CDN (set by the
    // media upload endpoint) — never arbitrary URLs.
    const media: ActivityMedia[] = Array.isArray(body.media)
      ? (body.media as ActivityMedia[])
          .filter(
            (m) =>
              m &&
              (m.type === 'image' || m.type === 'video') &&
              typeof m.url === 'string' &&
              m.url.startsWith('https://cdn.sanity.io/')
          )
          .slice(0, 3)
          .map((m) => ({ type: m.type, url: m.url, assetId: typeof m.assetId === 'string' ? m.assetId : undefined }))
      : []

    const activity = await createActivity({
      userId,
      userName: user.name,
      userImage: user.image ?? undefined,
      title,
      description: typeof body.description === 'string' ? body.description.trim().slice(0, 2000) : undefined,
      sportType,
      startedAt,
      durationSec: Math.round(durationSec),
      distanceKm: clampNum(body.distanceKm, 1000),
      elevationGainM: clampNum(body.elevationGainM, 10000),
      avgHeartRate: clampNum(body.avgHeartRate, 250),
      calories: clampNum(body.calories, 20000),
      effort: clampNum(body.effort, 10),
      media: media.length > 0 ? media : undefined,
      visibility,
    })

    return NextResponse.json({ activity }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to create activity:', error)
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
  }
}
