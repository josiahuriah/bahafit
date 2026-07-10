'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SPORT_LABELS } from '@/components/community/helpers'

type LogTab = 'manual' | 'gpx' | 'connect'

const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0dd5b5] bg-white'
const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

function LogWorkoutContent() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') === 'connect' ? 'connect' : 'manual'
  const [tab, setTab] = useState<LogTab>(initialTab as LogTab)

  // Manual form state
  const [title, setTitle] = useState('')
  const [sportType, setSportType] = useState('run')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState('07:00')
  const [hours, setHours] = useState('0')
  const [minutes, setMinutes] = useState('30')
  const [distanceKm, setDistanceKm] = useState('')
  const [elevation, setElevation] = useState('')
  const [heartRate, setHeartRate] = useState('')
  const [calories, setCalories] = useState('')
  const [effort, setEffort] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState('public')

  // GPX state
  const [gpxFile, setGpxFile] = useState<File | null>(null)
  const [gpxTitle, setGpxTitle] = useState('')
  const [gpxSport, setGpxSport] = useState('run')
  const [gpxVisibility, setGpxVisibility] = useState('public')

  // Connect (Apple Shortcuts) state
  const [hasToken, setHasToken] = useState<boolean | null>(null)
  const [newToken, setNewToken] = useState<string | null>(null)
  const [tokenBusy, setTokenBusy] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/community/log')
    }
  }, [authStatus, router])

  useEffect(() => {
    if (tab === 'connect' && hasToken === null && session) {
      fetch('/api/me/ingest-token')
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d && setHasToken(d.hasToken))
        .catch(() => {})
    }
  }, [tab, hasToken, session])

  const submitManual = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const durationSec = (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60
    if (!title.trim()) return setError('Give your workout a title.')
    if (durationSec <= 0) return setError('Duration must be greater than zero.')

    setSubmitting(true)
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          sportType,
          startedAt: new Date(`${date}T${time}:00`).toISOString(),
          durationSec,
          distanceKm: distanceKm ? Number(distanceKm) : undefined,
          elevationGainM: elevation ? Number(elevation) : undefined,
          avgHeartRate: heartRate ? Number(heartRate) : undefined,
          calories: calories ? Number(calories) : undefined,
          effort: effort ? Number(effort) : undefined,
          description: description.trim() || undefined,
          visibility,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to log workout')
      router.push(`/community/activity/${data.activity._id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  const submitGpx = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!gpxFile) return setError('Choose a GPX file first.')

    setSubmitting(true)
    try {
      const form = new FormData()
      form.append('file', gpxFile)
      form.append('title', gpxTitle)
      form.append('sportType', gpxSport)
      form.append('visibility', gpxVisibility)

      const res = await fetch('/api/activities/import', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to import file')
      router.push(`/community/activity/${data.activity._id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  const generateToken = async () => {
    setTokenBusy(true)
    try {
      const res = await fetch('/api/me/ingest-token', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setNewToken(data.token)
        setHasToken(true)
      }
    } finally {
      setTokenBusy(false)
    }
  }

  if (authStatus === 'loading' || !session) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0dd5b5] border-t-transparent" />
        </div>
        <Footer />
      </>
    )
  }

  const tabs: Array<{ id: LogTab; label: string }> = [
    { id: 'manual', label: 'Manual Entry' },
    { id: 'gpx', label: 'Upload GPX' },
    { id: 'connect', label: 'Apple Watch / Auto' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <Link href="/community" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Community
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">Log a Workout</h1>
            <div className="flex gap-1 mt-5 border-b -mb-px overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setError(null) }}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    tab === t.id
                      ? 'border-[#0dd5b5] text-[#0dd5b5]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* ─── Manual entry ─── */}
          {tab === 'manual' && (
            <form onSubmit={submitManual} className="bg-white rounded-xl shadow-sm p-5 sm:p-6 space-y-4">
              <div>
                <label className={labelCls}>Title *</label>
                <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Morning Run around Montagu" maxLength={120} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Sport *</label>
                  <select className={inputCls} value={sportType} onChange={(e) => setSportType(e.target.value)}>
                    {Object.entries(SPORT_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Date</label>
                  <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Start time</label>
                  <input type="time" className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className={labelCls}>Hours</label>
                  <input type="number" min="0" max="24" className={inputCls} value={hours} onChange={(e) => setHours(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Minutes</label>
                  <input type="number" min="0" max="59" className={inputCls} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Distance (km)</label>
                  <input type="number" min="0" step="0.01" className={inputCls} value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} placeholder="5.0" />
                </div>
                <div>
                  <label className={labelCls}>Elevation (m)</label>
                  <input type="number" min="0" className={inputCls} value={elevation} onChange={(e) => setElevation(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Avg heart rate</label>
                  <input type="number" min="0" max="250" className={inputCls} value={heartRate} onChange={(e) => setHeartRate(e.target.value)} placeholder="bpm" />
                </div>
                <div>
                  <label className={labelCls}>Calories</label>
                  <input type="number" min="0" className={inputCls} value={calories} onChange={(e) => setCalories(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Effort (1–10)</label>
                  <input type="number" min="1" max="10" className={inputCls} value={effort} onChange={(e) => setEffort(e.target.value)} />
                </div>
              </div>

              <div>
                <label className={labelCls}>How did it go?</label>
                <textarea className={inputCls} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} placeholder="Notes about your workout…" />
              </div>

              <div>
                <label className={labelCls}>Who can see this?</label>
                <select className={inputCls} value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                  <option value="public">Everyone</option>
                  <option value="followers">Followers only</option>
                  <option value="private">Only me</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0dd5b5] text-white py-3 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving…' : 'Post Workout'}
              </button>
            </form>
          )}

          {/* ─── GPX upload ─── */}
          {tab === 'gpx' && (
            <form onSubmit={submitGpx} className="bg-white rounded-xl shadow-sm p-5 sm:p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Upload a GPX file from your watch or app (Apple Watch via the Health export or apps like
                HealthFit, Garmin Connect, Strava, etc.). Distance, time, elevation, and the route map are
                read automatically.
              </p>
              <div>
                <label className={labelCls}>GPX file *</label>
                <input
                  type="file"
                  accept=".gpx,application/gpx+xml,application/xml"
                  onChange={(e) => setGpxFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-[#0dd5b5]/10 file:text-[#0dd5b5] file:font-semibold hover:file:bg-[#0dd5b5]/20"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Title (optional)</label>
                  <input className={inputCls} value={gpxTitle} onChange={(e) => setGpxTitle(e.target.value)} placeholder="Auto-named if left blank" maxLength={120} />
                </div>
                <div>
                  <label className={labelCls}>Sport</label>
                  <select className={inputCls} value={gpxSport} onChange={(e) => setGpxSport(e.target.value)}>
                    {Object.entries(SPORT_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Who can see this?</label>
                <select className={inputCls} value={gpxVisibility} onChange={(e) => setGpxVisibility(e.target.value)}>
                  <option value="public">Everyone</option>
                  <option value="followers">Followers only</option>
                  <option value="private">Only me</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={submitting || !gpxFile}
                className="w-full bg-[#0dd5b5] text-white py-3 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Importing…' : 'Import & Post'}
              </button>
            </form>
          )}

          {/* ─── Apple Watch / automation ─── */}
          {tab === 'connect' && (
            <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 space-y-5">
              <div>
                <h2 className="font-bold text-gray-900 mb-1">Auto-post workouts from your iPhone or Apple Watch</h2>
                <p className="text-sm text-gray-600">
                  Apple Health data can&apos;t be read by websites — but the iOS <strong>Shortcuts</strong> app can
                  read your workouts and send them to Bahafit automatically. Set it up once and every workout
                  you finish can post itself to your feed.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Step 1 — Get your personal token</p>
                {newToken ? (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">
                      Copy this now — it is shown only once. Generating a new one replaces it.
                    </p>
                    <code className="block bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs break-all select-all">
                      {newToken}
                    </code>
                  </div>
                ) : (
                  <button
                    onClick={generateToken}
                    disabled={tokenBusy}
                    className="bg-[#0dd5b5] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0bc5a5] transition-colors disabled:opacity-50"
                  >
                    {tokenBusy ? 'Generating…' : hasToken ? 'Regenerate token' : 'Generate token'}
                  </button>
                )}
                {hasToken && !newToken && (
                  <p className="text-xs text-gray-500 mt-2">You already have an active token. Regenerating replaces it.</p>
                )}
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Step 2 — Create the Shortcut (on iPhone)</p>
                <ol className="list-decimal ml-5 space-y-1.5 text-sm text-gray-600">
                  <li>Open the <strong>Shortcuts</strong> app → New Shortcut.</li>
                  <li>Add <strong>Find Workouts</strong> (limit 1, sort by newest).</li>
                  <li>Add <strong>Get Contents of URL</strong> and set:
                    <div className="mt-1.5 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-1">
                      <p><strong>URL:</strong> <code>https://your-site.com/api/activities/ingest</code></p>
                      <p><strong>Method:</strong> POST · <strong>Header:</strong> <code>Authorization: Bearer YOUR_TOKEN</code></p>
                      <p><strong>JSON body:</strong> <code>{'{"sportType": Workout Type, "durationSec": Duration, "distanceKm": Distance, "calories": Active Energy, "startedAt": Start Date}'}</code></p>
                    </div>
                  </li>
                  <li>Run it after a workout — or add an <strong>Automation</strong>: &quot;When any workout ends → run this shortcut&quot; for fully automatic posting.</li>
                </ol>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-1">Other ways to get workouts in</p>
                <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
                  <li><strong>GPX upload</strong> (tab above) — works with exports from Apple Health, Garmin, Strava, and most watches.</li>
                  <li>Workouts posted this way default to <em>followers-only</em> visibility; you can edit any activity afterwards.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function LogWorkoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0dd5b5] border-t-transparent" />
        </div>
      }
    >
      <LogWorkoutContent />
    </Suspense>
  )
}
