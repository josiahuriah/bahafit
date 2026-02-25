'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { formatDate, formatCurrency } from '@/lib/utils'

interface CheckoutEvent {
  _id: string
  title: string
  slug: { current: string }
  eventType: string
  startDate: string
  endDate?: string
  location?: {
    venueName?: string
    address?: string
    city?: string
    island?: string
  }
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
  earlyBirdDeadline?: string
  featuredImage?: string
  requiresRegistration: boolean
  capacity?: number
  currentRegistrations: number
  contactInfo?: {
    email?: string
    phone?: string
    whatsapp?: string
  }
  organizer?: {
    name: string
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

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()

  const [event, setEvent] = useState<CheckoutEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [selectedTierIndex, setSelectedTierIndex] = useState(0)

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=/events/${params.slug}/checkout`)
    }
  }, [sessionStatus, router, params.slug])

  // Fetch event data
  useEffect(() => {
    if (params.slug && sessionStatus === 'authenticated') {
      fetchEvent()
    }
  }, [params.slug, sessionStatus])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data.event)
      } else if (response.status === 404) {
        router.push('/events')
      }
    } catch (err) {
      console.error('Failed to fetch event:', err)
      setError('Failed to load event details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Pricing logic
  const isEarlyBird = event?.earlyBirdDeadline
    ? new Date(event.earlyBirdDeadline) > new Date()
    : false

  const hasTiers = event?.pricing && event.pricing.length > 0
  const selectedTier = hasTiers ? event!.pricing![selectedTierIndex] : null

  const getPrice = (): number => {
    if (event?.isFree) return 0
    if (selectedTier) {
      return isEarlyBird && selectedTier.earlyBirdPrice
        ? selectedTier.earlyBirdPrice
        : selectedTier.price
    }
    return event?.price || 0
  }

  const getCurrency = (): string => {
    if (selectedTier) return selectedTier.currency
    return 'BSD'
  }

  const price = getPrice()
  const currency = getCurrency()

  const handleCheckout = async () => {
    if (!agreedToTerms || !event || !session) return

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event._id,
          eventTitle: event.title,
          ticketType: selectedTier?.tierName,
          price,
          currency,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create registration')
      }

      if (event.isFree) {
        // For free events, go straight to a confirmation
        router.push(`/events/${event.slug.current}/checkout/confirmation?registrationId=${data.registration._id}`)
        return
      }

      if (data.paymentUrl) {
        // Redirect to Fygaro payment link
        window.location.href = data.paymentUrl
      } else {
        setError(
          'Payment processing is not yet configured for this event. Your registration has been recorded and you will be contacted with payment instructions.'
        )
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Loading / auth states
  if (sessionStatus === 'loading' || (sessionStatus === 'unauthenticated')) {
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

  if (loading) {
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

  if (!event) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
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

  const spotsLeft = event.capacity ? event.capacity - (event.currentRegistrations || 0) : null
  const isSoldOut = spotsLeft !== null && spotsLeft <= 0

  if (isSoldOut) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sold Out</h1>
          <p className="text-gray-600 mb-6">This event has reached its maximum capacity.</p>
          <Link
            href={`/events/${event.slug.current}`}
            className="bg-[#0dd5b5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors"
          >
            Back to Event
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <Link
              href={`/events/${event.slug.current}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to event
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Checkout</h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

            {/* Left Column — Order Summary */}
            <div className="lg:col-span-3 space-y-6">
              {/* Event Details Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Order Summary
                  </h2>

                  <div className="flex gap-4">
                    {/* Event Image */}
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      {event.featuredImage ? (
                        <Image
                          src={event.featuredImage}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5]" />
                      )}
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <span className="inline-block bg-[#0dd5b5]/10 text-[#0dd5b5] px-2 py-0.5 rounded text-xs font-medium mb-1">
                        {eventTypeLabels[event.eventType] || event.eventType}
                      </span>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600 flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(event.startDate)}
                        </p>
                        {event.location?.venueName && (
                          <p className="text-sm text-gray-600 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {event.location.venueName}
                            {event.location.city && `, ${event.location.city}`}
                          </p>
                        )}
                        {event.organizer && (
                          <p className="text-sm text-gray-500">
                            Organized by {event.organizer.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tier Selection (if multiple tiers) */}
                {hasTiers && (
                  <div className="border-t px-5 sm:px-6 py-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Ticket Type</h3>
                    <div className="space-y-2">
                      {event.pricing!.map((tier, i) => {
                        const tierPrice = isEarlyBird && tier.earlyBirdPrice
                          ? tier.earlyBirdPrice
                          : tier.price
                        return (
                          <label
                            key={i}
                            className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                              selectedTierIndex === i
                                ? 'border-[#0dd5b5] bg-[#0dd5b5]/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="tier"
                                checked={selectedTierIndex === i}
                                onChange={() => setSelectedTierIndex(i)}
                                className="w-4 h-4 text-[#0dd5b5] accent-[#0dd5b5]"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{tier.tierName}</p>
                                {tier.description && (
                                  <p className="text-sm text-gray-500">{tier.description}</p>
                                )}
                                {tier.includes && tier.includes.length > 0 && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    Includes: {tier.includes.join(', ')}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                              <span className="font-bold text-gray-900">
                                {tier.currency} {tierPrice.toFixed(2)}
                              </span>
                              {isEarlyBird && tier.earlyBirdPrice && (
                                <span className="block text-xs text-gray-400 line-through">
                                  {tier.currency} {tier.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </label>
                        )
                      })}
                    </div>
                    {isEarlyBird && event.earlyBirdDeadline && (
                      <p className="text-xs text-green-600 mt-2">
                        Early bird pricing available until {formatDate(event.earlyBirdDeadline)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Info */}
              {event.contactInfo && (event.contactInfo.email || event.contactInfo.phone) && (
                <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Event Contact
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {event.contactInfo.email && (
                      <a href={`mailto:${event.contactInfo.email}`} className="flex items-center gap-1.5 hover:text-[#0dd5b5] transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {event.contactInfo.email}
                      </a>
                    )}
                    {event.contactInfo.phone && (
                      <a href={`tel:${event.contactInfo.phone}`} className="flex items-center gap-1.5 hover:text-[#0dd5b5] transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {event.contactInfo.phone}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column — Payment */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 lg:sticky lg:top-24">
                {/* Registered User Info */}
                <div className="mb-5 pb-5 border-b">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Registering As
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#0dd5b5] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {session?.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{session?.user?.name}</p>
                      <p className="text-sm text-gray-500 truncate">{session?.user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mb-5 pb-5 border-b">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Payment Summary
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {event.isFree
                          ? 'Registration'
                          : selectedTier
                            ? selectedTier.tierName
                            : 'Event Registration'}
                      </span>
                      <span className="text-gray-900">
                        {event.isFree ? 'Free' : `${currency} ${price.toFixed(2)}`}
                      </span>
                    </div>
                    {isEarlyBird && selectedTier?.earlyBirdPrice && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Early bird discount</span>
                        <span className="text-green-600">
                          -{currency} {(selectedTier.price - selectedTier.earlyBirdPrice).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between mt-3 pt-3 border-t border-dashed">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-gray-900">
                      {event.isFree ? 'Free' : `${currency} ${price.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-5">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#0dd5b5] accent-[#0dd5b5] flex-shrink-0"
                    />
                    <span className="text-sm text-gray-600 leading-snug">
                      I have read and agree to the{' '}
                      <Link
                        href="/terms"
                        target="_blank"
                        className="text-[#0dd5b5] hover:underline font-medium"
                      >
                        Terms and Conditions
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Pay Button */}
                <button
                  onClick={handleCheckout}
                  disabled={!agreedToTerms || submitting}
                  className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
                    agreedToTerms && !submitting
                      ? 'bg-[#0dd5b5] text-white hover:bg-[#0bc5a5]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : event.isFree ? (
                    'Complete Registration'
                  ) : (
                    `Pay ${currency} ${price.toFixed(2)}`
                  )}
                </button>

                {!event.isFree && (
                  <p className="text-xs text-gray-400 text-center mt-3">
                    You will be redirected to Fygaro to complete payment securely.
                  </p>
                )}

                {/* Capacity Notice */}
                {spotsLeft !== null && spotsLeft <= 10 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-700 font-medium text-center">
                      Only {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} remaining!
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
