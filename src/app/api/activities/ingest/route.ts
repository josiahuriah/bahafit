import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { getUsersCollection } from '@/lib/db/models/user'
import { createActivity, SPORT_TYPES, SportType } from '@/lib/db/models/activity'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Apple Shortcuts / automation ingest endpoint.
 *
 * An iOS Shortcut (which CAN read Apple Health workout data) posts here
 * with the user's personal token. Example Shortcut setup:
 *
 *   1. On Bahafit → Community → Log Workout → "Connect Apple Watch",
 *      generate your personal token.
 *   2. In the iOS Shortcuts app create a shortcut with
 *      "Find Workouts" (latest) → "Get Contents of URL":
 *        URL:    https://<site>/api/activities/ingest
 *        Method: POST, Header: Authorization: Bearer <token>
 *        Body (JSON): { "sportType": "run", "title": "Morning Run",
 *          "durationSec": <Workout Duration in seconds>,
 *          "distanceKm": <Workout Distance in km>,
 *          "calories": <Active Energy>, "startedAt": <Start Date ISO> }
 *   3. Optionally add an Automation: "When any workout ends → run shortcut".
 *
 * Rate limited per user to 30 posts/hour via a simple in-memory window.
 */

const windowByUser = new Map<string, number[]>()
const RATE_LIMIT = 30
const HOUR_MS = 60 * 60 * 1000

function rateLimited(userId: string): boolean {
  const now = Date.now()
  const hits = (windowByUser.get(userId) || []).filter((t) => now - t < HOUR_MS)
  if (hits.length >= RATE_LIMIT) return true
  hits.push(now)
  windowByUser.set(userId, hits)
  return false
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''

    if (!token || !token.startsWith('bfit_')) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 })
    }

    const hash = createHash('sha256').update(token).digest('hex')
    const users = await getUsersCollection()
    const user = await users.findOne({ ingestTokenHash: hash } as never)

    if (!user || user.isActive === false) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = user._id?.toString() || ''
    if (rateLimited(userId)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'JSON body required' }, { status: 400 })
    }

    const durationSec = Math.round(Number(body.durationSec ?? Number(body.durationMin) * 60))
    if (!Number.isFinite(durationSec) || durationSec <= 0 || durationSec > 60 * 60 * 24) {
      return NextResponse.json({ error: 'durationSec (or durationMin) is required' }, { status: 400 })
    }

    const sportTypeRaw = String(body.sportType || 'gym').toLowerCase()
    // Map common Apple Health workout names to our sport types
    const appleMap: Record<string, SportType> = {
      running: 'run', 'outdoor run': 'run', 'indoor run': 'run',
      cycling: 'ride', 'outdoor cycle': 'ride', 'indoor cycle': 'ride',
      swimming: 'swim', 'pool swim': 'swim', 'open water swim': 'swim',
      walking: 'walk', 'outdoor walk': 'walk', hiking: 'hike',
      'functional strength training': 'gym', 'traditional strength training': 'gym',
      'high intensity interval training': 'hiit', yoga: 'yoga',
    }
    const sportType: SportType = SPORT_TYPES.includes(sportTypeRaw as SportType)
      ? (sportTypeRaw as SportType)
      : appleMap[sportTypeRaw] || 'other'

    const startedAt = body.startedAt ? new Date(body.startedAt) : new Date()

    const clampNum = (v: unknown, max: number) => {
      const n = Number(v)
      return Number.isFinite(n) && n > 0 && n <= max ? n : undefined
    }

    const activity = await createActivity({
      userId,
      userName: user.name,
      userImage: user.image ?? undefined,
      title:
        String(body.title || '').trim().slice(0, 120) ||
        `${sportType.charAt(0).toUpperCase() + sportType.slice(1)} (Apple Watch)`,
      description: typeof body.description === 'string' ? body.description.trim().slice(0, 2000) : undefined,
      sportType,
      startedAt: Number.isNaN(startedAt.getTime()) ? new Date() : startedAt,
      durationSec,
      distanceKm: clampNum(body.distanceKm ?? (body.distanceM ? Number(body.distanceM) / 1000 : undefined), 1000),
      elevationGainM: clampNum(body.elevationGainM, 10000),
      avgHeartRate: clampNum(body.avgHeartRate, 250),
      calories: clampNum(body.calories, 20000),
      visibility: ['public', 'followers', 'private'].includes(body.visibility) ? body.visibility : 'followers',
      source: 'apple-shortcut',
    })

    return NextResponse.json({ ok: true, activityId: activity._id }, { status: 201 })
  } catch (error: unknown) {
    console.error('Ingest failed:', error)
    return NextResponse.json({ error: 'Failed to log workout' }, { status: 500 })
  }
}
