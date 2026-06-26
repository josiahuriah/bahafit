'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PinIcon, ArrowRightIcon } from '@/components/home/icons'

/**
 * Location-first explore control shown beneath the category icons.
 * The city options come from events that are currently upcoming, so the
 * selector only ever offers places where something is actually happening.
 * Selecting a city sends the visitor to the events page filtered by that city.
 */
export default function CityExplore({ cities }: { cities: string[] }) {
  const router = useRouter()
  const [city, setCity] = useState(cities[0] ?? '')

  const explore = () => {
    const href = city ? `/events?city=${encodeURIComponent(city)}` : '/events'
    router.push(href)
  }

  // No upcoming events anywhere — fall back to a plain explore prompt.
  if (cities.length === 0) {
    return (
      <div className="mt-8 flex justify-center">
        <button
          onClick={explore}
          className="inline-flex items-center gap-2 rounded-full bg-[#0dd5b5] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#0bc4a6]"
        >
          Explore events &amp; listings
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex w-full max-w-xl items-stretch gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1e26] p-1.5 shadow-sm">
        <label className="flex flex-1 items-center gap-2 pl-3 pr-1">
          <PinIcon className="h-4 w-4 shrink-0 text-[#0dd5b5]" />
          <span className="shrink-0 text-sm text-black/55 dark:text-white/50">
            Explore events &amp; listings in
          </span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-sm font-bold text-[#13191f] dark:text-white outline-none"
            aria-label="Choose a city"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={explore}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0dd5b5] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#0bc4a6]"
        >
          Explore
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
