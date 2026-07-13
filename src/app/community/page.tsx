'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ActivityCard, { Avatar, FeedActivity } from '@/components/community/ActivityCard'
import { formatDuration } from '@/components/community/helpers'

type FeedScope = 'following' | 'all' | 'me'

interface MyStats {
  totalActivities: number
  week: { activities: number; distanceKm: number; durationSec: number; elevationGainM: number }
  allTime: { distanceKm: number; durationSec: number }
  bests: Array<{ sportType: string; label: string; value: string }>
}

interface SuggestedAthlete {
  userId: string
  userName: string
  userImage?: string
  count?: number
  isFollowing?: boolean
}

export default function CommunityPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()

  const [scope, setScope] = useState<FeedScope>('following')
  const [activities, setActivities] = useState<FeedActivity[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loadedScope, setLoadedScope] = useState<FeedScope | null>(null)
  const loading = loadedScope !== scope
  const [loadingMore, setLoadingMore] = useState(false)
  const [stats, setStats] = useState<MyStats | null>(null)
  const [counts, setCounts] = useState<{ followers: number; following: number } | null>(null)
  const [suggested, setSuggested] = useState<SuggestedAthlete[]>([])
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<SuggestedAthlete[]>([])

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/community')
    }
  }, [authStatus, router])

  const fetchFeed = useCallback(async (feedScope: FeedScope, cursor?: string) => {
    const params = new URLSearchParams({ scope: feedScope })
    if (cursor) params.set('before', cursor)
    const res = await fetch(`/api/activities?${params}`)
    if (!res.ok) return { activities: [], nextCursor: null }
    return res.json()
  }, [])

  useEffect(() => {
    if (!session?.user?.id) return
    let alive = true
    fetchFeed(scope).then((data) => {
      if (!alive) return
      setActivities(data.activities || [])
      setNextCursor(data.nextCursor)
      setLoadedScope(scope)
    })
    return () => {
      alive = false
    }
  }, [session, scope, fetchFeed])

  useEffect(() => {
    if (!session?.user?.id) return
    fetch('/api/me/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setStats(d.stats)
          setCounts(d.counts)
        }
      })
      .catch(() => {})
    fetch('/api/athletes?suggested=true')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setSuggested(d.athletes || []))
      .catch(() => {})
  }, [session])

  // Athlete search (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      const q = search.trim()
      if (q.length < 2) {
        setSearchResults([])
        return
      }
      fetch(`/api/athletes?search=${encodeURIComponent(q)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d && setSearchResults(d.athletes || []))
        .catch(() => {})
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return
    setLoadingMore(true)
    const data = await fetchFeed(scope, nextCursor)
    setActivities((prev) => [...prev, ...(data.activities || [])])
    setNextCursor(data.nextCursor)
    setLoadingMore(false)
  }

  const follow = async (userId: string) => {
    await fetch('/api/follows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    setSuggested((s) => s.filter((a) => a.userId !== userId))
    setSearchResults((s) => s.map((a) => (a.userId === userId ? { ...a, isFollowing: true } : a)))
    setCounts((c) => (c ? { ...c, following: c.following + 1 } : c))
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

  const tabs: Array<{ id: FeedScope; label: string }> = [
    { id: 'following', label: 'Following' },
    { id: 'all', label: 'Everyone' },
    { id: 'me', label: 'You' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page header */}
        <section className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Community</h1>
                <p className="text-gray-500 mt-1">See what the Bahafit community is training on</p>
              </div>
              <Link
                href="/community/log"
                className="inline-flex items-center gap-2 bg-[#0dd5b5] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors text-sm w-fit"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Log Workout
              </Link>
            </div>

            <div className="flex gap-1 mt-5 border-b -mb-px">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setScope(t.id)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    scope === t.id
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

        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left sidebar — my stats */}
            <aside className="hidden lg:block space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={session.user.name || ''} image={session.user.image} />
                  <div className="min-w-0">
                    <Link
                      href={`/community/athletes/${session.user.id}`}
                      className="font-semibold text-gray-900 text-sm hover:text-[#0dd5b5] truncate block"
                    >
                      {session.user.name}
                    </Link>
                    {counts && (
                      <p className="text-xs text-gray-500">
                        {counts.followers} followers · {counts.following} following
                      </p>
                    )}
                  </div>
                </div>
                {stats && (
                  <>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">This week</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{stats.week.activities}</p>
                        <p className="text-[11px] text-gray-500">workouts</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{stats.week.distanceKm}</p>
                        <p className="text-[11px] text-gray-500">km</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{formatDuration(stats.week.durationSec)}</p>
                        <p className="text-[11px] text-gray-500">time</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {stats && stats.bests.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">Personal records</p>
                  <ul className="space-y-2">
                    {stats.bests.slice(0, 5).map((b) => (
                      <li key={b.label} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{b.label}</span>
                        <span className="font-semibold text-gray-900">{b.value}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/community/athletes/${session.user.id}`}
                    className="block text-xs font-medium text-[#0dd5b5] hover:underline mt-3"
                  >
                    View all stats →
                  </Link>
                </div>
              )}
            </aside>

            {/* Feed */}
            <div className="lg:col-span-2 space-y-4">
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#0dd5b5] border-t-transparent" />
                </div>
              ) : activities.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm text-center py-14 px-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {scope === 'following' ? 'Nothing here yet' : scope === 'me' ? 'No workouts logged' : 'No activity yet'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {scope === 'following'
                      ? 'Follow athletes to fill your feed — or check the Everyone tab.'
                      : 'Log your first workout to get things moving.'}
                  </p>
                  <Link
                    href="/community/log"
                    className="inline-flex items-center gap-2 bg-[#0dd5b5] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors"
                  >
                    Log a Workout
                  </Link>
                </div>
              ) : (
                <>
                  {activities.map((a) => (
                    <ActivityCard key={a._id} activity={a} />
                  ))}
                  {nextCursor && (
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="w-full py-3 bg-white rounded-xl shadow-sm text-sm font-medium text-gray-600 hover:text-[#0dd5b5] transition-colors disabled:opacity-50"
                    >
                      {loadingMore ? 'Loading…' : 'Load more'}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Right sidebar — find athletes */}
            <aside className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">Find athletes</p>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0dd5b5]"
                />
                {searchResults.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {searchResults.map((a) => (
                      <li key={a.userId} className="flex items-center gap-2">
                        <Link href={`/community/athletes/${a.userId}`} className="flex items-center gap-2 flex-1 min-w-0">
                          <Avatar name={a.userName} image={a.userImage} size={8} />
                          <span className="text-sm text-gray-800 truncate hover:text-[#0dd5b5]">{a.userName}</span>
                        </Link>
                        {a.isFollowing ? (
                          <span className="text-xs text-gray-400">Following</span>
                        ) : (
                          <button
                            onClick={() => follow(a.userId)}
                            className="text-xs font-semibold text-[#0dd5b5] hover:underline"
                          >
                            Follow
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {suggested.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-3">Suggested athletes</p>
                  <ul className="space-y-3">
                    {suggested.map((a) => (
                      <li key={a.userId} className="flex items-center gap-2">
                        <Link href={`/community/athletes/${a.userId}`} className="flex items-center gap-2 flex-1 min-w-0">
                          <Avatar name={a.userName} image={a.userImage} size={8} />
                          <div className="min-w-0">
                            <p className="text-sm text-gray-800 truncate hover:text-[#0dd5b5]">{a.userName}</p>
                            {a.count ? <p className="text-[11px] text-gray-400">{a.count} recent workouts</p> : null}
                          </div>
                        </Link>
                        <button
                          onClick={() => follow(a.userId)}
                          className="text-xs font-semibold text-[#0dd5b5] hover:underline flex-shrink-0"
                        >
                          Follow
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-[#0dd5b5]/5 border border-[#0dd5b5]/20 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900 mb-1">Show off your training</p>
                <p className="text-xs text-gray-600 mb-2">
                  Add photos or short video clips when you log a workout — they show up right in the feed.
                </p>
                <Link href="/community/log" className="text-xs font-semibold text-[#0dd5b5] hover:underline">
                  Log a workout →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
