import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import { getAllUsers } from '@/lib/db/models/user'
import { getRecentlyActiveUserIds } from '@/lib/db/models/activity'
import { getFollowingIds } from '@/lib/db/models/follow'

// GET /api/athletes?search=  — find athletes to follow
// GET /api/athletes?suggested=true — recently active athletes you don't follow
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const viewerId = user.id || user._id || ''

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.trim()
    const suggested = searchParams.get('suggested') === 'true'

    const followingIds = await getFollowingIds(viewerId)

    if (suggested) {
      const active = await getRecentlyActiveUserIds([viewerId, ...followingIds], 6)
      return NextResponse.json({ athletes: active })
    }

    if (!search || search.length < 2) {
      return NextResponse.json({ athletes: [] })
    }

    const users = await getAllUsers({ isActive: true, search })
    const athletes = users
      .filter((u) => u._id !== viewerId)
      .slice(0, 10)
      .map((u) => ({
        userId: u._id,
        userName: u.name,
        userImage: u.image,
        isFollowing: followingIds.includes(u._id || ''),
      }))

    return NextResponse.json({ athletes })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to search athletes:', error)
    return NextResponse.json({ error: 'Failed to search athletes' }, { status: 500 })
  }
}
