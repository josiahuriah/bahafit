/**
 * Minimal GPX parser — no dependencies.
 *
 * Extracts track points from a GPX file (exported by Apple Watch apps,
 * Garmin, Strava, etc.), then derives distance, duration, elevation gain,
 * and a downsampled route polyline for rendering.
 */

export interface GpxResult {
  distanceKm: number
  durationSec: number
  elevationGainM: number
  startedAt?: Date
  /** Downsampled [lat, lng] pairs (≤ 300 points). */
  route: Array<[number, number]>
}

interface TrackPoint {
  lat: number
  lng: number
  ele?: number
  time?: Date
}

const EARTH_RADIUS_M = 6371000

function haversineM(a: TrackPoint, b: TrackPoint): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h))
}

export function parseGpx(xml: string): GpxResult | null {
  // Match <trkpt lat="..." lon="..."> ... </trkpt> blocks.
  const points: TrackPoint[] = []
  const trkptRegex = /<trkpt[^>]*lat="([-\d.]+)"[^>]*lon="([-\d.]+)"[^>]*>([\s\S]*?)<\/trkpt>|<trkpt[^>]*lon="([-\d.]+)"[^>]*lat="([-\d.]+)"[^>]*>([\s\S]*?)<\/trkpt>/g

  let match: RegExpExecArray | null
  while ((match = trkptRegex.exec(xml)) !== null && points.length < 100000) {
    const lat = parseFloat(match[1] ?? match[5])
    const lng = parseFloat(match[2] ?? match[4])
    if (Number.isNaN(lat) || Number.isNaN(lng)) continue
    const body = match[3] ?? match[6] ?? ''

    const eleMatch = /<ele>([-\d.]+)<\/ele>/.exec(body)
    const timeMatch = /<time>([^<]+)<\/time>/.exec(body)

    points.push({
      lat,
      lng,
      ele: eleMatch ? parseFloat(eleMatch[1]) : undefined,
      time: timeMatch ? new Date(timeMatch[1]) : undefined,
    })
  }

  if (points.length < 2) return null

  let distanceM = 0
  let elevationGainM = 0
  for (let i = 1; i < points.length; i++) {
    distanceM += haversineM(points[i - 1], points[i])
    const prevEle = points[i - 1].ele
    const ele = points[i].ele
    if (prevEle !== undefined && ele !== undefined && ele > prevEle) {
      elevationGainM += ele - prevEle
    }
  }

  const timed = points.filter((p) => p.time && !Number.isNaN(p.time.getTime()))
  const durationSec =
    timed.length >= 2
      ? Math.max(0, Math.round((timed[timed.length - 1].time!.getTime() - timed[0].time!.getTime()) / 1000))
      : 0

  // Downsample the route to at most 300 points.
  const MAX_POINTS = 300
  const step = Math.max(1, Math.ceil(points.length / MAX_POINTS))
  const route: Array<[number, number]> = []
  for (let i = 0; i < points.length; i += step) {
    route.push([Number(points[i].lat.toFixed(6)), Number(points[i].lng.toFixed(6))])
  }
  const last = points[points.length - 1]
  if (route[route.length - 1][0] !== Number(last.lat.toFixed(6))) {
    route.push([Number(last.lat.toFixed(6)), Number(last.lng.toFixed(6))])
  }

  return {
    distanceKm: Math.round((distanceM / 1000) * 100) / 100,
    durationSec,
    elevationGainM: Math.round(elevationGainM),
    startedAt: timed[0]?.time,
    route,
  }
}
