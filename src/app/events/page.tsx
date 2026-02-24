'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Carousel from '@/components/ui/Carousel'
import { formatDate } from '@/lib/utils'

interface Event {
  _id: string
  title: string
  slug?: { current: string } | null
  eventType: string
  shortDescription?: string
  startDate: string
  endDate?: string
  isVirtual?: boolean
  isFree?: boolean
  featured?: boolean
  capacity?: number
  currentRegistrations?: number
  location?: {
    venueName?: string
    city?: string
    island?: string
  }
  pricing?: Array<{
    tierName: string
    price: number
    earlyBirdPrice?: number
    currency: string
  }>
  featuredImage?: string
  organizerName?: string
  tags?: string[]
}

const eventTypeLabels: Record<string, string> = {
  race: 'Race/Run',
  marathon: 'Marathon',
  triathlon: 'Triathlon',
  cycling: 'Cycling',
  swimming: 'Swimming',
  competition: 'Competition',
  crossfit: 'CrossFit',
  bodybuilding: 'Bodybuilding',
  challenge: 'Challenge',
  bootcamp: 'Bootcamp',
  yoga_retreat: 'Yoga Retreat',
  wellness_expo: 'Wellness Expo',
  workshop: 'Workshop',
  charity: 'Charity',
  beach_workout: 'Beach Workout',
  group_class: 'Group Class',
  tournament: 'Tournament',
  outdoor_adventure: 'Adventure',
  virtual: 'Virtual',
  other: 'Other',
}

const eventTypeIcons: Record<string, string> = {
  race: '🏃',
  marathon: '🏅',
  triathlon: '🏊',
  cycling: '🚴',
  swimming: '🏊',
  competition: '🏆',
  crossfit: '💪',
  bodybuilding: '🏋️',
  challenge: '🎯',
  bootcamp: '⚡',
  yoga_retreat: '🧘',
  wellness_expo: '🌿',
  workshop: '📚',
  charity: '❤️',
  beach_workout: '🏖️',
  group_class: '👥',
  tournament: '🏆',
  outdoor_adventure: '🏔️',
  virtual: '💻',
  other: '📅',
}

function EventCard({ event }: { event: Event }) {
  const lowestPrice = event.pricing?.reduce((min, p) => {
    const price = p.earlyBirdPrice || p.price
    return price < min.price ? { price, currency: p.currency } : min
  }, { price: Infinity, currency: 'BSD' })

  const slug = event.slug?.current
  if (!slug) return null

  return (
    <Link
      href={`/events/${slug}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group w-[280px] sm:w-[320px]"
    >
      <div className="relative h-40 sm:h-48 overflow-hidden">
        {event.featuredImage ? (
          <Image
            src={event.featuredImage}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5] flex items-center justify-center">
            <span className="text-5xl">{eventTypeIcons[event.eventType] || '📅'}</span>
          </div>
        )}
        {event.featured && (
          <div className="absolute top-2 left-2 bg-[#f7d656] text-black px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        {event.isVirtual && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Virtual
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span className="bg-gray-100 px-2 py-0.5 rounded-full">
            {eventTypeLabels[event.eventType] || event.eventType}
          </span>
          {event.location?.city && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location.city}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-[#0dd5b5] transition-colors">
          {event.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <svg className="w-4 h-4 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(event.startDate)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#0dd5b5] font-bold">
            {event.isFree !== false ? 'Free' : lowestPrice && lowestPrice.price !== Infinity
              ? `From ${lowestPrice.currency} ${lowestPrice.price}`
              : 'See pricing'}
          </span>
          {event.capacity ? (
            <span className="text-xs text-gray-500">
              {event.currentRegistrations ?? 0}/{event.capacity} spots
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

function CategoryPill({
  type,
  count,
  active,
  onClick
}: {
  type: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-[#0dd5b5] text-white'
          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
      }`}
    >
      <span>{eventTypeIcons[type] || '📅'}</span>
      <span>{eventTypeLabels[type] || type}</span>
      <span className={`text-xs ${active ? 'text-white/80' : 'text-gray-400'}`}>({count})</span>
    </button>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [eventTypeCounts, setEventTypeCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [selectedType, searchQuery])

  useEffect(() => {
    // Fetch featured events separately
    fetch('/api/events?featured=true&limit=6')
      .then(res => res.json())
      .then(data => setFeaturedEvents(data.events || []))
      .catch(console.error)
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedType !== 'all') params.append('eventType', selectedType)
      if (searchQuery) params.append('search', searchQuery)
      params.append('upcoming', 'true')

      const response = await fetch(`/api/events?${params}`)
      const data = await response.json()
      setEvents(data.events || [])
      setEventTypeCounts(data.eventTypeCounts || {})
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group events by type for carousels
  const eventsByType = events.reduce((acc: Record<string, Event[]>, event) => {
    const type = event.eventType
    if (!acc[type]) acc[type] = []
    acc[type].push(event)
    return acc
  }, {})

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5] pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center">
            Fitness Events
          </h1>
          <p className="text-white/90 text-center mb-8 max-w-2xl mx-auto">
            Discover races, competitions, workshops, and more. Join the Caribbean's most exciting fitness events.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 pr-12 rounded-full border-0 shadow-lg focus:ring-2 focus:ring-white/50 outline-none text-gray-900"
              />
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="bg-gray-50 py-4 px-4 sticky top-16 z-40 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setSelectedType('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-[#0dd5b5] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Events
            </button>
            {Object.entries(eventTypeCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => (
                <CategoryPill
                  key={type}
                  type={type}
                  count={count}
                  active={selectedType === type}
                  onClick={() => setSelectedType(type)}
                />
              ))}
          </div>
        </div>
      </section>

      <main className="bg-gray-50 min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Featured Events Carousel */}
          {featuredEvents.length > 0 && selectedType === 'all' && !searchQuery && (
            <section className="py-8">
              <Carousel title="Featured Events" showDots>
                {featuredEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </Carousel>
            </section>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0dd5b5] border-t-transparent"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `No events match "${searchQuery}"`
                  : 'Check back soon for upcoming events!'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#0dd5b5] font-semibold hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : selectedType === 'all' && !searchQuery ? (
            // Show events grouped by type in carousels
            <>
              {Object.entries(eventsByType)
                .sort((a, b) => b[1].length - a[1].length)
                .map(([type, typeEvents]) => (
                  <section key={type} className="py-6">
                    <Carousel
                      title={`${eventTypeIcons[type] || '📅'} ${eventTypeLabels[type] || type} Events`}
                      showDots={false}
                    >
                      {typeEvents.map((event) => (
                        <EventCard key={event._id} event={event} />
                      ))}
                    </Carousel>
                  </section>
                ))}
            </>
          ) : (
            // Show filtered events in grid
            <section className="py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : `${eventTypeLabels[selectedType] || selectedType} Events`}
                <span className="text-gray-500 font-normal ml-2">({events.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map((event) => (
                  <div key={event._id} className="flex justify-center">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
