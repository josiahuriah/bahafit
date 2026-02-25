'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Carousel from '@/components/ui/Carousel'
import { formatDate, formatDateTime } from '@/lib/utils'

interface Event {
  _id: string
  title: string
  slug: { current: string }
  eventType: string
  description: any
  shortDescription?: string
  startDate: string
  endDate?: string
  isMultiDay: boolean
  registrationStartDate?: string
  registrationDeadline?: string
  earlyBirdDeadline?: string
  isVirtual: boolean
  virtualEventLink?: string
  virtualEventPlatform?: string
  location?: {
    venueName?: string
    address?: string
    city?: string
    island?: string
    country?: string
    latitude?: number
    longitude?: number
    directions?: string
  }
  capacity?: number
  currentRegistrations: number
  waitlistEnabled: boolean
  requiresRegistration: boolean
  isFree: boolean
  price?: number
  pricing?: Array<{
    tierName: string
    description?: string
    price: number
    earlyBirdPrice?: number
    currency: string
    capacity?: number
    includes?: string[]
  }>
  raceCategories?: Array<{
    name: string
    distance: string
    startTime?: string
    ageGroups?: string[]
  }>
  organizer?: {
    _id: string
    name: string
    slug?: { current: string }
    profileImage?: string
    userType: string
  }
  contactInfo?: {
    email?: string
    phone?: string
    whatsapp?: string
  }
  sponsors?: Array<{
    name: string
    tier: string
    website?: string
    logo?: string
  }>
  requirements?: string[]
  amenities?: string[]
  ageRestriction?: {
    minAge?: number
    maxAge?: number
    allowMinorsWithGuardian?: boolean
  }
  schedule?: Array<{
    time: string
    activity: string
    description?: string
    location?: string
  }>
  faqs?: Array<{
    question: string
    answer: string
  }>
  externalRegistrationUrl?: string
  websiteUrl?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  tags?: string[]
  featuredImage?: string
  images?: string[]
  featured: boolean
}

interface RelatedEvent {
  _id: string
  title: string
  slug: { current: string }
  eventType: string
  startDate: string
  location?: string
  featuredImage?: string
  isFree: boolean
  pricing?: {
    price: number
    currency: string
  }
}

const eventTypeLabels: Record<string, string> = {
  race: 'Race/Run',
  marathon: 'Marathon',
  triathlon: 'Triathlon',
  cycling: 'Cycling Event',
  swimming: 'Swimming Event',
  competition: 'Fitness Competition',
  crossfit: 'CrossFit Competition',
  bodybuilding: 'Bodybuilding Show',
  challenge: 'Fitness Challenge',
  bootcamp: 'Bootcamp',
  yoga_retreat: 'Yoga Retreat',
  wellness_expo: 'Wellness Expo',
  workshop: 'Fitness Workshop',
  charity: 'Charity Event',
  beach_workout: 'Beach Workout',
  group_class: 'Group Fitness Class',
  tournament: 'Sports Tournament',
  outdoor_adventure: 'Outdoor Adventure',
  virtual: 'Virtual Event',
  other: 'Other',
}

const amenityLabels: Record<string, string> = {
  water_stations: 'Water Stations',
  refreshments: 'Refreshments',
  tshirt: 'T-Shirt',
  medal: 'Medal/Trophy',
  goodie_bag: 'Goodie Bag',
  parking: 'Parking',
  changing_rooms: 'Changing Rooms',
  first_aid: 'First Aid',
  photography: 'Photography',
  live_timing: 'Live Timing',
  results_online: 'Results Online',
  certificate: 'Certificate',
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [relatedEvents, setRelatedEvents] = useState<RelatedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'schedule' | 'faq'>('details')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (params.slug) {
      fetchEvent()
    }
  }, [params.slug])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data.event)
        setRelatedEvents(data.relatedEvents || [])
      } else if (response.status === 404) {
        router.push('/events')
      }
    } catch (error) {
      console.error('Failed to fetch event:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0dd5b5] border-t-transparent"></div>
        </div>
        <Footer />
      </>
    )
  }

  if (!event) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link href="/events" className="bg-[#0dd5b5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors">
            Browse Events
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const isRegistrationOpen = event.registrationDeadline
    ? new Date(event.registrationDeadline) > new Date()
    : true
  const isEarlyBird = event.earlyBirdDeadline
    ? new Date(event.earlyBirdDeadline) > new Date()
    : false
  const spotsLeft = event.capacity ? event.capacity - (event.currentRegistrations || 0) : null
  const isSoldOut = spotsLeft !== null && spotsLeft <= 0

  const lowestPrice = event.pricing?.reduce((min, p) => {
    const price = isEarlyBird && p.earlyBirdPrice ? p.earlyBirdPrice : p.price
    return price < min.price ? { price, currency: p.currency } : min
  }, { price: Infinity, currency: 'BSD' })

  return (
    <>
      <Header />

      {/* Hero Image */}
      <section className="relative h-[50vh] sm:h-[60vh] bg-gray-900">
        {event.featuredImage ? (
          <Image
            src={event.featuredImage}
            alt={event.title}
            fill
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back Button */}
        <Link
          href="/events"
          className="absolute top-20 left-4 sm:left-8 flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </Link>

        {/* Event Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-[#0dd5b5] text-white px-3 py-1 rounded-full text-sm font-medium">
                {eventTypeLabels[event.eventType] || event.eventType}
              </span>
              {event.isVirtual && (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Virtual
                </span>
              )}
              {event.featured && (
                <span className="bg-[#f7d656] text-black px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
              {event.title}
            </h1>
            {event.organizer && (
              <p className="text-white/80 text-sm sm:text-base">
                Organized by {event.organizer.name}
              </p>
            )}
          </div>
        </div>
      </section>

      <main className="bg-gray-50">
        {/* Quick Info Bar */}
        <section className="bg-white border-b sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{formatDate(event.startDate)}</span>
                </div>
                {!event.isVirtual && event.location?.city && (
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{event.location.city}{event.location.island && `, ${event.location.island}`}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-lg font-bold text-[#0dd5b5]">
                  {event.isFree ? 'Free' : lowestPrice && lowestPrice.price !== Infinity
                    ? `From ${lowestPrice.currency} ${lowestPrice.price}`
                    : ''}
                </span>
                {event.requiresRegistration && (
                  event.externalRegistrationUrl ? (
                    <a
                      href={event.externalRegistrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 sm:px-6 py-2 rounded-full font-semibold text-sm transition-colors ${
                        isSoldOut
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#0dd5b5] text-white hover:bg-[#0bc5a5]'
                      }`}
                    >
                      {isSoldOut ? 'Sold Out' : 'Register Now'}
                    </a>
                  ) : isSoldOut ? (
                    <span className="px-4 sm:px-6 py-2 rounded-full font-semibold text-sm bg-gray-300 text-gray-500 cursor-not-allowed">
                      Sold Out
                    </span>
                  ) : (
                    <Link
                      href={`/events/${event.slug.current}/checkout`}
                      className="px-4 sm:px-6 py-2 rounded-full font-semibold text-sm transition-colors bg-[#0dd5b5] text-white hover:bg-[#0bc5a5]"
                    >
                      Register Now
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex border-b">
                  {['details', 'schedule', 'faq'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'text-[#0dd5b5] border-b-2 border-[#0dd5b5] bg-[#0dd5b5]/5'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="p-4 sm:p-6">
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      {/* Description */}
                      {event.shortDescription && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">About This Event</h3>
                          <p className="text-gray-600 leading-relaxed">{event.shortDescription}</p>
                        </div>
                      )}

                      {/* Race Categories */}
                      {event.raceCategories && event.raceCategories.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Race Categories</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {event.raceCategories.map((cat, i) => (
                              <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
                                <p className="font-bold text-[#0dd5b5]">{cat.distance}</p>
                                <p className="text-sm text-gray-600">{cat.name}</p>
                                {cat.startTime && (
                                  <p className="text-xs text-gray-500 mt-1">Starts: {cat.startTime}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Requirements */}
                      {event.requirements && event.requirements.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">What to Bring</h3>
                          <ul className="space-y-1">
                            {event.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-600">
                                <svg className="w-5 h-5 text-[#0dd5b5] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Amenities */}
                      {event.amenities && event.amenities.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">What's Included</h3>
                          <div className="flex flex-wrap gap-2">
                            {event.amenities.map((amenity, i) => (
                              <span key={i} className="bg-[#0dd5b5]/10 text-[#0dd5b5] px-3 py-1 rounded-full text-sm">
                                {amenityLabels[amenity] || amenity.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Age Restriction */}
                      {event.ageRestriction && (event.ageRestriction.minAge || event.ageRestriction.maxAge) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h3 className="font-semibold text-yellow-800 mb-1">Age Requirements</h3>
                          <p className="text-yellow-700 text-sm">
                            {event.ageRestriction.minAge && `Minimum age: ${event.ageRestriction.minAge} years`}
                            {event.ageRestriction.minAge && event.ageRestriction.maxAge && ' | '}
                            {event.ageRestriction.maxAge && `Maximum age: ${event.ageRestriction.maxAge} years`}
                            {event.ageRestriction.allowMinorsWithGuardian && ' (Minors allowed with guardian)'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'schedule' && (
                    <div>
                      {event.schedule && event.schedule.length > 0 ? (
                        <div className="space-y-4">
                          {event.schedule.map((item, i) => (
                            <div key={i} className="flex gap-4 pb-4 border-b last:border-0">
                              <div className="text-[#0dd5b5] font-bold text-sm w-16 flex-shrink-0">
                                {item.time}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{item.activity}</p>
                                {item.description && (
                                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                )}
                                {item.location && (
                                  <p className="text-xs text-gray-500 mt-1">📍 {item.location}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">Schedule will be announced soon.</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'faq' && (
                    <div>
                      {event.faqs && event.faqs.length > 0 ? (
                        <div className="space-y-4">
                          {event.faqs.map((faq, i) => (
                            <details key={i} className="group">
                              <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </summary>
                              <div className="px-4 py-3 text-gray-600">
                                {faq.answer}
                              </div>
                            </details>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No FAQs available yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Image Gallery */}
              {event.images && event.images.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Gallery</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {event.images.slice(0, 6).map((image, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(image)}
                        className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <Image src={image} alt={`${event.title} ${i + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              {!event.isFree && event.pricing && event.pricing.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Pricing</h3>
                  {isEarlyBird && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <p className="text-green-800 text-sm font-medium">
                        🎉 Early Bird pricing available until {formatDate(event.earlyBirdDeadline!)}
                      </p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {event.pricing.map((tier, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{tier.tierName}</p>
                            {tier.description && (
                              <p className="text-sm text-gray-500">{tier.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            {isEarlyBird && tier.earlyBirdPrice ? (
                              <>
                                <p className="text-lg font-bold text-[#0dd5b5]">
                                  {tier.currency} {tier.earlyBirdPrice}
                                </p>
                                <p className="text-sm text-gray-400 line-through">
                                  {tier.currency} {tier.price}
                                </p>
                              </>
                            ) : (
                              <p className="text-lg font-bold text-gray-900">
                                {tier.currency} {tier.price}
                              </p>
                            )}
                          </div>
                        </div>
                        {tier.includes && tier.includes.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {tier.includes.map((inc, j) => (
                              <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#0dd5b5]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {inc}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Info Card */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Event Info</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#0dd5b5]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium text-gray-900">{formatDateTime(event.startDate)}</p>
                      {event.endDate && (
                        <p className="text-sm text-gray-600">to {formatDateTime(event.endDate)}</p>
                      )}
                    </div>
                  </div>

                  {!event.isVirtual && event.location && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#0dd5b5]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">{event.location.venueName || event.location.city}</p>
                        {event.location.address && (
                          <p className="text-sm text-gray-600">{event.location.address}</p>
                        )}
                        {event.location.city && event.location.island && (
                          <p className="text-sm text-gray-600">{event.location.city}, {event.location.island}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {spotsLeft !== null && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#0dd5b5]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="font-medium text-gray-900">
                          {spotsLeft} spots remaining
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-[#0dd5b5] h-2 rounded-full"
                            style={{ width: `${Math.min(((event.currentRegistrations || 0) / event.capacity!) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {event.registrationDeadline && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#0dd5b5]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Registration Deadline</p>
                        <p className="font-medium text-gray-900">{formatDate(event.registrationDeadline)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Card */}
              {event.contactInfo && (
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
                  <div className="space-y-3">
                    {event.contactInfo.email && (
                      <a href={`mailto:${event.contactInfo.email}`} className="flex items-center gap-3 text-gray-600 hover:text-[#0dd5b5] transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{event.contactInfo.email}</span>
                      </a>
                    )}
                    {event.contactInfo.phone && (
                      <a href={`tel:${event.contactInfo.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-[#0dd5b5] transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm">{event.contactInfo.phone}</span>
                      </a>
                    )}
                    {event.contactInfo.whatsapp && (
                      <a href={`https://wa.me/${event.contactInfo.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <span className="text-sm">WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Sponsors */}
              {event.sponsors && event.sponsors.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Sponsors</h3>
                  <div className="space-y-3">
                    {event.sponsors.map((sponsor, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {sponsor.logo ? (
                          <Image src={sponsor.logo} alt={sponsor.name} width={40} height={40} className="w-10 h-10 object-contain" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-400">{sponsor.name.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{sponsor.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{sponsor.tier} Sponsor</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <section className="mt-12">
              <Carousel title="Similar Events" showDots={false}>
                {relatedEvents.map((relEvent) => (
                  <Link
                    key={relEvent._id}
                    href={`/events/${relEvent.slug.current}`}
                    className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden w-[280px]"
                  >
                    <div className="relative h-32 overflow-hidden">
                      {relEvent.featuredImage ? (
                        <Image src={relEvent.featuredImage} alt={relEvent.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5]" />
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 line-clamp-1">{relEvent.title}</h4>
                      <p className="text-sm text-gray-500">{formatDate(relEvent.startDate)}</p>
                      <p className="text-sm text-[#0dd5b5] font-medium mt-1">
                        {relEvent.isFree ? 'Free' : relEvent.pricing
                          ? `${relEvent.pricing.currency} ${relEvent.pricing.price}`
                          : 'See pricing'}
                      </p>
                    </div>
                  </Link>
                ))}
              </Carousel>
            </section>
          )}
        </div>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <Image
            src={selectedImage}
            alt="Event image"
            width={1200}
            height={800}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}

      <Footer />
    </>
  )
}
