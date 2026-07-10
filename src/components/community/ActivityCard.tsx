'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SportIcon, SPORT_LABELS, formatDuration, formatPace, timeAgo, RouteMap } from './helpers'

export interface FeedActivity {
  _id: string
  userId: string
  userName: string
  userImage?: string
  title: string
  description?: string
  sportType: string
  startedAt: string
  durationSec: number
  distanceKm?: number
  elevationGainM?: number
  avgHeartRate?: number
  calories?: number
  effort?: number
  route?: Array<[number, number]>
  visibility: string
  source: string
  kudosCount: number
  commentCount: number
  achievements?: string[]
  hasKudos?: boolean
  createdAt: string
}

export function Avatar({ name, image, size = 10 }: { name: string; image?: string; size?: number }) {
  const px = size * 4
  return image ? (
    <Image src={image} alt={name} width={px} height={px} className={`rounded-full object-cover`} style={{ width: px, height: px }} />
  ) : (
    <div
      className="rounded-full bg-[#0dd5b5] flex items-center justify-center flex-shrink-0"
      style={{ width: px, height: px }}
    >
      <span className="text-white font-semibold" style={{ fontSize: px * 0.42 }}>
        {name?.charAt(0).toUpperCase() || '?'}
      </span>
    </div>
  )
}

export default function ActivityCard({
  activity,
  detailed = false,
}: {
  activity: FeedActivity
  detailed?: boolean
}) {
  const [kudosCount, setKudosCount] = useState(activity.kudosCount)
  const [hasKudos, setHasKudos] = useState(!!activity.hasKudos)
  const [busy, setBusy] = useState(false)

  const toggleKudos = async () => {
    if (busy) return
    setBusy(true)
    // optimistic
    setHasKudos(!hasKudos)
    setKudosCount((c) => c + (hasKudos ? -1 : 1))
    try {
      const res = await fetch(`/api/activities/${activity._id}/kudos`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setKudosCount(data.kudosCount)
        setHasKudos(data.hasKudos)
      } else {
        setHasKudos(hasKudos)
        setKudosCount(activity.kudosCount)
      }
    } catch {
      setHasKudos(hasKudos)
      setKudosCount(activity.kudosCount)
    } finally {
      setBusy(false)
    }
  }

  const pace = formatPace(activity.durationSec, activity.distanceKm)

  const stats: Array<{ label: string; value: string }> = []
  if (activity.distanceKm) stats.push({ label: 'Distance', value: `${activity.distanceKm.toFixed(2)} km` })
  stats.push({ label: 'Time', value: formatDuration(activity.durationSec) })
  if (pace) stats.push({ label: 'Pace', value: pace })
  if (activity.elevationGainM) stats.push({ label: 'Elevation', value: `${activity.elevationGainM} m` })
  if (activity.avgHeartRate) stats.push({ label: 'Avg HR', value: `${activity.avgHeartRate} bpm` })
  if (activity.calories) stats.push({ label: 'Calories', value: `${activity.calories}` })

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <Link href={`/community/athletes/${activity.userId}`}>
            <Avatar name={activity.userName} image={activity.userImage} />
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              href={`/community/athletes/${activity.userId}`}
              className="font-semibold text-gray-900 text-sm hover:text-[#0dd5b5] transition-colors"
            >
              {activity.userName}
            </Link>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <span>{timeAgo(activity.startedAt)}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#0dd5b5]">
                <SportIcon sport={activity.sportType} className="w-3.5 h-3.5" />
                {SPORT_LABELS[activity.sportType] || activity.sportType}
              </span>
              {activity.source === 'apple-shortcut' && (
                <span className="text-gray-400" title="Logged automatically from Apple Watch">· Watch</span>
              )}
            </p>
          </div>
          {activity.visibility !== 'public' && (
            <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2 py-0.5 capitalize">
              {activity.visibility}
            </span>
          )}
        </div>

        {/* Title + achievements */}
        <Link href={`/community/activity/${activity._id}`} className="block">
          <h3 className="font-bold text-gray-900 hover:text-[#0dd5b5] transition-colors">
            {activity.title}
          </h3>
        </Link>
        {activity.achievements && activity.achievements.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {activity.achievements.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-2 py-0.5 rounded-full"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 1l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 13.4l-4.8 2.5.9-5.4L2.2 6.7l5.4-.8L10 1z" />
                </svg>
                {a}
              </span>
            ))}
          </div>
        )}
        {activity.description && (
          <p className={`text-sm text-gray-600 mt-2 ${detailed ? '' : 'line-clamp-2'}`}>{activity.description}</p>
        )}

        {/* Stats */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 pt-3 border-t border-gray-100">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-[11px] uppercase tracking-wide text-gray-400">{s.label}</p>
              <p className="text-base font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
          {activity.effort ? (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-400">Effort</p>
              <p className="text-base font-bold text-gray-900">{activity.effort}/10</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Route */}
      {activity.route && activity.route.length > 1 && (
        <Link href={`/community/activity/${activity._id}`} className="block px-4 sm:px-5 pb-2">
          <RouteMap route={activity.route} className="w-full h-auto" />
        </Link>
      )}

      {/* Actions */}
      <div className="px-4 sm:px-5 py-2.5 border-t border-gray-100 flex items-center gap-4">
        <button
          onClick={toggleKudos}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            hasKudos ? 'text-[#0dd5b5]' : 'text-gray-500 hover:text-[#0dd5b5]'
          }`}
        >
          <svg className="w-5 h-5" fill={hasKudos ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M6.633 10.5H4.126A1.125 1.125 0 003 11.625v7.5c0 .621.504 1.125 1.126 1.125h2.507" />
          </svg>
          {kudosCount > 0 ? kudosCount : ''} Kudos
        </button>
        <Link
          href={`/community/activity/${activity._id}`}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#0dd5b5] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.84L3 20l1.13-3.39A7.36 7.36 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {activity.commentCount > 0 ? activity.commentCount : ''} Comments
        </Link>
      </div>
    </div>
  )
}
