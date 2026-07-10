import React from 'react'

export const SPORT_LABELS: Record<string, string> = {
  run: 'Run',
  ride: 'Ride',
  swim: 'Swim',
  walk: 'Walk',
  hike: 'Hike',
  gym: 'Gym Workout',
  hiit: 'HIIT',
  yoga: 'Yoga',
  crossfit: 'CrossFit',
  other: 'Workout',
}

export const SPORT_EMOJI_PATHS: Record<string, string> = {
  // simple line-icon paths (24x24)
  run: 'M13 4a2 2 0 104 0 2 2 0 00-4 0zM6 20l3.5-6M10 9l3 2 2.5-1.5M13 11l-1.5 4.5L15 18l1 3',
  ride: 'M5 17a3 3 0 106 0 3 3 0 00-6 0zm8 0a3 3 0 106 0 3 3 0 00-6 0zM8 17l3-7h4l2 4M12 6h3',
  swim: 'M3 16c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0M3 20c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0M14 7a2 2 0 104 0 2 2 0 00-4 0zM5 12l6-3 3 2',
  walk: 'M13 4a2 2 0 104 0 2 2 0 00-4 0zM9 20l2.5-5M13 8l-1 5 2.5 2.5L15 21M11 13l-2-1',
  hike: 'M13 4a2 2 0 104 0 2 2 0 00-4 0zM9 21l3-8 2 2 1 6M17 8l2 13M6 13l3-2',
  gym: 'M4 12h16M6 8v8M18 8v8M3 10v4M21 10v4M9 12h6',
  hiit: 'M13 2L4 14h6l-1 8 9-12h-6l1-8z',
  yoga: 'M12 4a2 2 0 100 4 2 2 0 000-4zM12 8v6M6 21c2-3 4-4 6-4s4 1 6 4M8 12l4 2 4-2',
  crossfit: 'M4 12h16M6 8v8M18 8v8M12 6v12',
  other: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
}

export function SportIcon({ sport, className = 'w-5 h-5' }: { sport: string; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={SPORT_EMOJI_PATHS[sport] || SPORT_EMOJI_PATHS.other} />
    </svg>
  )
}

export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.round(sec % 60)
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`
  return `${s}s`
}

export function formatPace(durationSec: number, distanceKm?: number): string | null {
  if (!distanceKm || distanceKm <= 0) return null
  const secPerKm = durationSec / distanceKm
  const m = Math.floor(secPerKm / 60)
  const s = Math.round(secPerKm % 60)
  return `${m}:${String(s).padStart(2, '0')} /km`
}

export function timeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined })
}

/** Render a GPX route as a simple SVG polyline (Strava-style route outline). */
export function RouteMap({ route, className = '' }: { route: Array<[number, number]>; className?: string }) {
  if (!route || route.length < 2) return null

  const lats = route.map((p) => p[0])
  const lngs = route.map((p) => p[1])
  const minLat = Math.min(...lats), maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs)

  const W = 400, H = 200, PAD = 14
  // Correct longitude scale for latitude so the shape isn't stretched
  const latMid = (minLat + maxLat) / 2
  const lngScale = Math.cos((latMid * Math.PI) / 180)
  const spanLat = Math.max(maxLat - minLat, 1e-6)
  const spanLng = Math.max((maxLng - minLng) * lngScale, 1e-6)
  const scale = Math.min((W - PAD * 2) / spanLng, (H - PAD * 2) / spanLat)

  const offsetX = (W - spanLng * scale) / 2
  const offsetY = (H - spanLat * scale) / 2

  const pts = route
    .map((p) => {
      const x = offsetX + (p[1] - minLng) * lngScale * scale
      const y = H - (offsetY + (p[0] - minLat) * scale)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const [sx, sy] = pts.split(' ')[0].split(',').map(Number)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label="Workout route">
      <rect width={W} height={H} rx="12" fill="#f0fdfa" />
      <polyline points={pts} fill="none" stroke="#0dd5b5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={sx} cy={sy} r="5" fill="#0dd5b5" stroke="white" strokeWidth="2" />
    </svg>
  )
}
