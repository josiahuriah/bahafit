import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import { followUser, unfollowUser, getFollowingIds } from '@/lib/db/models/follow'
import { getUserById } from '@/lib/db/models/user'

// GET /api/follows — IDs the signed-in user follows
export async function GET() {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const following = await getFollowingIds(user.id || user._id || '')
    return NextResponse.json({ following })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch follows' }, { status: 500 })
  }
}

// POST /api/follows { userId } — follow
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const followerId = user.id || user._id || ''

    const body = await req.json()
    const followingId = typeof body.userId === 'string' ? body.userId : ''
    if (!followingId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }
    if (followingId === followerId) {
      return NextResponse.json({ error: 'You cannot follow yourself' }, { status: 400 })
    }

    const target = await getUserById(followingId)
    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await followUser(followerId, followingId)
    return NextResponse.json({ following: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to follow:', error)
    return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 })
  }
}

// DELETE /api/follows?userId= — unfollow
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const followerId = user.id || user._id || ''

    const { searchParams } = new URL(req.url)
    const followingId = searchParams.get('userId') || ''
    if (!followingId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    await unfollowUser(followerId, followingId)
    return NextResponse.json({ following: false })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to unfollow:', error)
    return NextResponse.json({ error: 'Failed to unfollow user' }, { status: 500 })
  }
}
