'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { SearchEventResult, SearchListingResult } from '@/app/api/search/route'

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function EventResultCard({ event }: { event: SearchEventResult }) {
  return (
    <Link
      href={event.href}
      className="group block overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:bg-[#1a1e26]"
    >
      <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-white/5">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full bg-[#0dd5b5] px-2 py-1 text-xs font-semibold text-black">
          {event.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-[#0dd5b5] dark:text-white">
          {event.title}
        </h3>
        <div className="mb-1 flex items-center gap-1.5 text-sm text-gray-600 dark:text-white/60">
          <PinIcon className="h-4 w-4 text-[#0dd5b5]" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
        <div className="mb-2 text-sm text-gray-600 dark:text-white/60">{event.date}</div>
        <span className="font-bold text-[#0dd5b5]">{event.price}</span>
      </div>
    </Link>
  )
}

function ListingResultCard({ listing }: { listing: SearchListingResult }) {
  return (
    <Link
      href={listing.href}
      className="group block overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:bg-[#1a1e26]"
    >
      <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-white/5">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full bg-[#0dd5b5] px-2 py-1 text-xs font-semibold text-black">
          {listing.category}
        </span>
        {listing.verified && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Verified
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-[#0dd5b5] dark:text-white">
          {listing.title}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-white/60">
          <PinIcon className="h-4 w-4 text-[#0dd5b5]" />
          <span className="line-clamp-1">{listing.location}</span>
        </div>
      </div>
    </Link>
  )
}

function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [input, setInput] = useState(query)
  const [events, setEvents] = useState<SearchEventResult[]>([])
  const [listings, setListings] = useState<SearchListingResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setInput(query)
  }, [query])

  useEffect(() => {
    if (!query.trim()) {
      setEvents([])
      setListings([])
      return
    }
    let cancelled = false
    setLoading(true)
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        setEvents(data.events || [])
        setListings(data.listings || [])
      })
      .catch(() => {
        if (cancelled) return
        setEvents([])
        setListings([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
  }

  const total = events.length + listings.length

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
      <Header />

      {/* Search hero */}
      <section className="bg-gradient-to-br from-[#0dd5b5] to-[#0bc4a6] px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-center text-2xl font-bold text-white md:text-4xl">
            Search Bahafit
          </h1>
          <p className="mb-6 text-center text-white/90">
            Find events and businesses by name, category, or location.
          </p>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              autoFocus
              placeholder="Search events, gyms, trainers, locations…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded-full border-0 px-5 py-4 pr-14 text-gray-900 shadow-lg outline-none focus:ring-2 focus:ring-white/60"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#0dd5b5] text-white transition-colors hover:bg-[#0bc4a6]"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {!query.trim() ? (
          <p className="py-16 text-center text-gray-500 dark:text-white/50">
            Start typing above to search across every event and listing.
          </p>
        ) : loading ? (
          <p className="py-16 text-center text-gray-500 dark:text-white/50">Searching…</p>
        ) : total === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              No results for “{query}”
            </p>
            <p className="mt-2 text-gray-500 dark:text-white/50">
              Try a different keyword, category, or location.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <p className="text-sm text-gray-500 dark:text-white/50">
              {total} result{total === 1 ? '' : 's'} for “{query}”
            </p>

            {events.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  Events <span className="text-gray-400 dark:text-white/40">({events.length})</span>
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {events.map((event) => (
                    <EventResultCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}

            {listings.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  Listings <span className="text-gray-400 dark:text-white/40">({listings.length})</span>
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {listings.map((listing) => (
                    <ListingResultCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  )
}
