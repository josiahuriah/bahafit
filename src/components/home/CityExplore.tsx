'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PinIcon, ArrowRightIcon } from '@/components/home/icons'

/**
 * Location-first explore control shown beneath the category icons.
 * Visitors search by city — the free-text field is seeded with autocomplete
 * suggestions drawn from events that are currently upcoming, so the places
 * where something is actually happening surface first. Submitting sends the
 * visitor to the events page filtered by the chosen city.
 */
export default function CityExplore({ cities }: { cities: string[] }) {
  const router = useRouter()
  const [city, setCity] = useState('')

  const explore = (e: React.FormEvent) => {
    e.preventDefault()
    const value = city.trim()
    router.push(value ? `/events?city=${encodeURIComponent(value)}` : '/events')
  }

  return (
    <div className="mt-8 flex flex-col items-center">
      <h2 className="mb-3 text-center text-lg font-bold tracking-tight text-[#13191f] dark:text-white md:text-xl">
        Explore events &amp; listings in
      </h2>
      <form
        onSubmit={explore}
        className="flex w-full max-w-xl items-stretch gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1e26] p-1.5 shadow-sm"
      >
        <label className="flex flex-1 items-center gap-2 pl-3 pr-1">
          <PinIcon className="h-4 w-4 shrink-0 text-[#0dd5b5]" />
          <input
            type="text"
            list="upcoming-cities"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="E.g Nassau"
            aria-label="Search by city"
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#13191f] dark:text-white placeholder:font-normal placeholder:text-black/40 dark:placeholder:text-white/40 outline-none"
          />
          <datalist id="upcoming-cities">
            {cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
        <button
          type="submit"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0dd5b5] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#0bc4a6]"
        >
          Search
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
