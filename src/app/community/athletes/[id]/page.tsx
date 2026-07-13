'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ActivityCard, { Avatar, FeedActivity } from '@/components/community/ActivityCard'
import { formatDuration } from '@/components/community/helpers'

interface AthleteProfile {
  athlete: { _id: string; name: string; image?: string; createdAt?: string }
  stats: {
    totalActivities: number
    week: { activities: number; distanceKm: number; durationSec: number; elevationGainM: number }
    allTime: { distanceKm: number; durationSec: number }
    bests: Array<{ sportType: string; label: string; value: string }>
  }
  counts: { followers: number; following: number }
  isFollowing: boolean
  isSelf: boolean
  activities: FeedActivity[]
}

export default function AthletePage() {
  const { data: session, status: authStatus } = useSession()
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [profile, setProfile] = useState<AthleteProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [followBusy, setFollowBusy] = useState(false)

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=/community/athletes/${id}`)
    }
  }, [authStatus, router, id])

  const load = useCallback(async () => {
    const res = await fetch(`/api/athletes/${id}`)
    if (res.ok) {
      setProfile(await res.json())
    } else {
      setNotFound(true)
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    if (session?.user?.id && id) load()
  }, [session, id, load])

  const toggleFollow = async () => {
    if (!profile || followBusy) return
    setFollowBusy(true)
    try {
      if (profile.isFollowing) {
        await fetch(`/api/follows?userId=${id}`, { method: 'DELETE' })
        setProfile({
          ...profile,
          isFollowing: false,
          counts: { ...profile.counts, followers: profile.counts.followers - 1 },
        })
      } else {
        await fetch('/api/follows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: id }),
        })
        setProfile({
          ...profile,
          isFollowing: true,
          counts: { ...profile.counts, followers: profile.counts.followers + 1 },
        })
      }
    } finally {
      setFollowBusy(false)
    }
  }

  if (authStatus === 'loading' || !session || loading) {
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

  if (notFound || !profile) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Athlete Not Found</h1>
          <Link href="/community" className="bg-[#0dd5b5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors mt-4">
            Back to Community
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const { athlete, stats, counts } = profile

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Profile header */}
        <section className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <Link href="/community" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Community
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar name={athlete.name} image={athlete.image} size={18} />
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{athlete.name}</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {counts.followers} followers · {counts.following} following · {stats.totalActivities} workouts
                </p>
              </div>
              {profile.isSelf ? (
                <Link
                  href="/community/log"
                  className="bg-[#0dd5b5] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors text-sm w-fit"
                >
                  Log Workout
                </Link>
              ) : (
                <button
                  onClick={toggleFollow}
                  disabled={followBusy}
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors w-fit disabled:opacity-50 ${
                    profile.isFollowing
                      ? 'border border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-600'
                      : 'bg-[#0dd5b5] text-white hover:bg-[#0bc5a5]'
                  }`}
                >
                  {profile.isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>

            {/* Stat strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-500">This week</p>
                <p className="text-xl font-bold text-gray-900">{stats.week.activities} workouts</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-500">Week distance</p>
                <p className="text-xl font-bold text-gray-900">{stats.week.distanceKm} km</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-500">All-time distance</p>
                <p className="text-xl font-bold text-gray-900">{stats.allTime.distanceKm} km</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-500">All-time time</p>
                <p className="text-xl font-bold text-gray-900">{formatDuration(stats.allTime.durationSec)}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PRs */}
            <aside className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-3">Personal records</p>
                {stats.bests.length === 0 ? (
                  <p className="text-sm text-gray-400">No records yet.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {stats.bests.map((b) => (
                      <li key={b.label} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 1l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 13.4l-4.8 2.5.9-5.4L2.2 6.7l5.4-.8L10 1z" />
                          </svg>
                          {b.label}
                        </span>
                        <span className="font-semibold text-gray-900">{b.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>

            {/* Activities */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent activity</h2>
              {profile.activities.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm text-center py-12 px-6">
                  <p className="text-gray-500">No visible activities yet.</p>
                </div>
              ) : (
                profile.activities.map((a) => <ActivityCard key={a._id} activity={a} />)
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
