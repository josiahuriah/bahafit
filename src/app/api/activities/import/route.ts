import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import { createActivity, SPORT_TYPES, SportType, ActivityVisibility } from '@/lib/db/models/activity'
import { parseGpx } from '@/lib/gpx'

/**
 * POST /api/activities/import — multipart form with a GPX file.
 * Fields: file (GPX), title, sportType, visibility, description?
 * Distance, duration, elevation, start time, and the route come from the file.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const userId = user.id || user._id || ''

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No GPX file provided' }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }
    if (!/\.gpx$/i.test(file.name) && !file.type.includes('gpx') && !file.type.includes('xml')) {
      return NextResponse.json({ error: 'Please upload a .gpx file' }, { status: 400 })
    }

    const xml = await file.text()
    const parsed = parseGpx(xml)
    if (!parsed) {
      return NextResponse.json(
        { error: 'Could not read track points from this file. Make sure it is a GPX export with GPS data.' },
        { status: 400 }
      )
    }

    const sportTypeRaw = String(formData.get('sportType') || 'run')
    const sportType: SportType = SPORT_TYPES.includes(sportTypeRaw as SportType)
      ? (sportTypeRaw as SportType)
      : 'run'
    const visibilityRaw = String(formData.get('visibility') || 'public')
    const visibility: ActivityVisibility = ['public', 'followers', 'private'].includes(visibilityRaw)
      ? (visibilityRaw as ActivityVisibility)
      : 'public'
    const title =
      String(formData.get('title') || '').trim().slice(0, 120) ||
      `${sportType.charAt(0).toUpperCase() + sportType.slice(1)} — ${parsed.distanceKm.toFixed(1)} km`
    const description = String(formData.get('description') || '').trim().slice(0, 2000) || undefined

    const durationOverride = Number(formData.get('durationSec'))

    const activity = await createActivity({
      userId,
      userName: user.name,
      userImage: user.image ?? undefined,
      title,
      description,
      sportType,
      startedAt: parsed.startedAt || new Date(),
      durationSec:
        parsed.durationSec ||
        (Number.isFinite(durationOverride) && durationOverride > 0 ? Math.round(durationOverride) : 0),
      distanceKm: parsed.distanceKm,
      elevationGainM: parsed.elevationGainM,
      route: parsed.route,
      visibility,
      source: 'gpx',
    })

    return NextResponse.json({ activity }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to import GPX:', error)
    return NextResponse.json({ error: 'Failed to import GPX file' }, { status: 500 })
  }
}
