import { NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import { getAthleteStats } from '@/lib/db/models/activity'
import { getFollowCounts } from '@/lib/db/models/follow'

// GET /api/me/stats — weekly totals, all-time totals, PRs, follow counts
export async function GET() {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const userId = user.id || user._id || ''

    const [stats, counts] = await Promise.all([
      getAthleteStats(userId),
      getFollowCounts(userId),
    ])

    return NextResponse.json({ stats, counts })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to fetch stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
