'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SPORT_LABELS } from '@/components/community/helpers'

const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0dd5b5] bg-white'
const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

const MAX_MEDIA = 3
const MAX_BYTES = 4 * 1024 * 1024

interface PendingMedia {
  file: File
  previewUrl: string
  isVideo: boolean
}

export default function LogWorkoutPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()

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
  const [media, setMedia] = useState<PendingMedia[]>([])

  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/community/log')
    }
  }, [authStatus, router])

  useEffect(() => {
    // Clean up object URLs when unmounting
    return () => media.forEach((m) => URL.revokeObjectURL(m.previewUrl))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addFiles = (files: FileList | null) => {
    if (!files) return
    setError(null)
    const next: PendingMedia[] = []
    for (const file of Array.from(files)) {
      if (media.length + next.length >= MAX_MEDIA) break
      const isVideo = file.type.startsWith('video/')
      const isImage = file.type.startsWith('image/')
      if (!isVideo && !isImage) continue
      if (file.size > MAX_BYTES) {
        setError(`"${file.name}" is over 4MB — use a smaller photo or shorter clip.`)
        continue
      }
      next.push({ file, previewUrl: URL.createObjectURL(file), isVideo })
    }
    if (next.length > 0) setMedia((m) => [...m, ...next])
  }

  const removeMedia = (index: number) => {
    setMedia((m) => {
      URL.revokeObjectURL(m[index].previewUrl)
      return m.filter((_, i) => i !== index)
    })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const durationSec = (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60
    if (!title.trim()) return setError('Give your workout a title.')
    if (durationSec <= 0) return setError('Duration must be greater than zero.')

    setSubmitting(true)
    try {
      // 1) Upload media files (if any)
      const uploaded: Array<{ type: string; url: string; assetId?: string }> = []
      for (let i = 0; i < media.length; i++) {
        setProgress(`Uploading ${media[i].isVideo ? 'video' : 'photo'} ${i + 1} of ${media.length}…`)
        const form = new FormData()
        form.append('file', media[i].file)
        const res = await fetch('/api/activities/media', { method: 'POST', body: form })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Media upload failed')
        uploaded.push(data)
      }

      // 2) Create the activity
      setProgress('Posting workout…')
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
          media: uploaded,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to log workout')
      router.push(`/community/activity/${data.activity._id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
      setProgress(null)
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
            <p className="text-gray-500 mt-1">Share your training with the community</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="bg-white rounded-xl shadow-sm p-5 sm:p-6 space-y-4">
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

            {/* Photos & videos */}
            <div>
              <label className={labelCls}>Photos & videos <span className="text-gray-400 font-normal">(up to {MAX_MEDIA}, max 4MB each)</span></label>
              <div className="flex flex-wrap gap-3">
                {media.map((m, i) => (
                  <div key={m.previewUrl} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    {m.isVideo ? (
                      <video src={m.previewUrl} muted playsInline className="w-full h-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.previewUrl} alt="preview" className="w-full h-full object-cover" />
                    )}
                    {m.isVideo && (
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">video</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {media.length < MAX_MEDIA && (
                  <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#0dd5b5] flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-[#0dd5b5] transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[11px] mt-1">Add</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm"
                      multiple
                      className="hidden"
                      onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
                    />
                  </label>
                )}
              </div>
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
              {submitting ? (progress || 'Saving…') : 'Post Workout'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
