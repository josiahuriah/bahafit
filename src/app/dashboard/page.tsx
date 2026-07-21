'use client'

import { useCallback, useEffect, useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import EventCalendar from '@/components/EventCalendar'
import { formatDate } from '@/lib/utils'

interface EventSummary {
  _id: string
  title: string
  slug?: { current: string }
  eventType?: string
  startDate?: string
  endDate?: string
  isFree?: boolean
  isVirtual?: boolean
  capacity?: number
  currentRegistrations?: number
  location?: {
    venueName?: string
    city?: string
    island?: string
  }
  featuredImage?: string
  pricing?: Array<{ tierName: string; price: number; currency: string }>
  status?: string
}

interface AttendingEvent {
  registrationId: string
  status: string
  paymentStatus: string
  ticketType?: string
  price: number
  currency: string
  registeredAt: string
  event: EventSummary
}

interface ListingSummary {
  _id: string
  title: string
  slug?: string
  listingType?: string
  category?: string
  status?: string
  verified?: boolean
  location?: { city?: string; island?: string }
  createdAt?: string
}

interface DashboardStats {
  ticketsPurchased: number
  totalSpentByCurrency: Record<string, number>
  eventsHosting: number
  listingsOwned: number
}

type DashboardTab = 'attending' | 'hosting' | 'listings'

function DashboardContent() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const justCreated = searchParams.get('created') === '1'
  const [activeTab, setActiveTab] = useState<DashboardTab>(justCreated ? 'hosting' : 'attending')
  const [attending, setAttending] = useState<AttendingEvent[]>([])
  const [hosting, setHosting] = useState<EventSummary[]>([])
  const [listings, setListings] = useState<ListingSummary[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreatedBanner, setShowCreatedBanner] = useState(justCreated)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard')
    }
  }, [authStatus, router])

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const data = await response.json()
        setAttending(data.attending || [])
        setHosting(data.hosting || [])
        setListings(data.listings || [])
        setStats(data.stats || null)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardData()
    }
  }, [session, fetchDashboardData])

  const cancelRegistration = async (registrationId: string) => {
    if (!window.confirm('Cancel this registration?')) return
    setCancellingId(registrationId)
    try {
      const res = await fetch(`/api/registrations/${registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      })
      if (res.ok) {
        await fetchDashboardData()
      } else {
        const data = await res.json().catch(() => ({}))
        window.alert(data.error || 'Failed to cancel registration.')
      }
    } catch {
      window.alert('Failed to cancel registration.')
    } finally {
      setCancellingId(null)
    }
  }

  if (authStatus === 'loading' || (authStatus === 'authenticated' && loading)) {
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

  if (!session) return null

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700',
      checked_in: 'bg-blue-100 text-blue-700',
      published: 'bg-green-100 text-green-700',
      draft: 'bg-gray-100 text-gray-600',
      suspended: 'bg-red-100 text-red-700',
    }
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
        {status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
      </span>
    )
  }

  const paymentBadge = (paymentStatus: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      refunded: 'bg-red-100 text-red-700',
    }
    const labels: Record<string, string> = {
      paid: 'Paid',
      pending: 'Payment pending',
      refunded: 'Refunded',
    }
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
        {labels[paymentStatus] || paymentStatus}
      </span>
    )
  }

  const upcomingAttending = attending.filter(
    (a) => a.event.startDate && new Date(a.event.startDate) >= new Date()
  )
  const pastAttending = attending.filter(
    (a) => a.event.startDate && new Date(a.event.startDate) < new Date()
  )

  const totalSpent = stats
    ? Object.entries(stats.totalSpentByCurrency || {})
        .map(([cur, amt]) => `${cur} ${amt.toFixed(2)}`)
        .join(' + ')
    : ''

  const tabs: Array<{ id: DashboardTab; label: string; count: number }> = [
    { id: 'attending', label: 'Attending', count: attending.length },
    { id: 'hosting', label: 'Hosting', count: hosting.length },
    { id: 'listings', label: 'My Listings', count: listings.length },
  ]

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Dashboard Header */}
        <section className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Welcome, {session.user.name?.split(' ')[0]}
                </h1>
                <p className="text-gray-500 mt-1">Manage your events, tickets, and listings</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/community"
                  className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-semibold hover:border-[#0dd5b5] hover:text-[#0dd5b5] transition-colors text-sm"
                >
                  Community Feed
                </Link>
                <Link
                  href="/listings/new"
                  className="inline-flex items-center gap-2 border border-[#0dd5b5] text-[#0dd5b5] px-4 py-2.5 rounded-lg font-semibold hover:bg-[#0dd5b5]/5 transition-colors text-sm"
                >
                  Add Listing
                </Link>
                <Link
                  href="/events/new"
                  className="inline-flex items-center gap-2 bg-[#0dd5b5] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors text-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Event
                </Link>
              </div>
            </div>

            {/* Success banner after event creation */}
            {showCreatedBanner && (
              <div className="mt-5 flex items-center justify-between gap-3 bg-[#0dd5b5]/10 border border-[#0dd5b5]/30 text-[#0a8a76] rounded-xl px-4 py-3 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Your event has been published successfully!
                </div>
                <button onClick={() => setShowCreatedBanner(false)} className="text-[#0a8a76]/60 hover:text-[#0a8a76]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Stats row */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-500">Upcoming events</p>
                  <p className="text-xl font-bold text-gray-900">{upcomingAttending.length}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-500">Tickets purchased</p>
                  <p className="text-xl font-bold text-gray-900">{stats.ticketsPurchased}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-500">Total spent</p>
                  <p className="text-xl font-bold text-gray-900">{totalSpent || '—'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-500">Hosting &amp; listings</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.eventsHosting + stats.listingsOwned}
                  </p>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mt-6 border-b -mb-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#0dd5b5] text-[#0dd5b5]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-[#0dd5b5]/10 text-[#0dd5b5] text-xs font-semibold px-2 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Attending Tab */}
          {activeTab === 'attending' && (
            <div>
              {attending.length === 0 ? (
                <EmptyState
                  title="No events yet"
                  message="Browse upcoming events and register for ones that interest you."
                  ctaHref="/events"
                  ctaLabel="Browse Events"
                />
              ) : (
                <div className="space-y-8">
                  {/* Upcoming */}
                  {upcomingAttending.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingAttending.map((item) => (
                          <AttendingCard
                            key={item.registrationId}
                            item={item}
                            statusBadge={statusBadge}
                            paymentBadge={paymentBadge}
                            onCancel={cancelRegistration}
                            cancelling={cancellingId === item.registrationId}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Past */}
                  {pastAttending.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-500 mb-4">Past Events</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pastAttending.map((item) => (
                          <AttendingCard
                            key={item.registrationId}
                            item={item}
                            statusBadge={statusBadge}
                            paymentBadge={paymentBadge}
                            past
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Hosting Tab */}
          {activeTab === 'hosting' && (
            <div>
              {hosting.length === 0 ? (
                <EmptyState
                  title="No events hosted"
                  message="Ready to host your own fitness event? Get started today."
                  ctaHref="/events/new"
                  ctaLabel="Create Your First Event"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hosting.map((event) => (
                    <HostingCard key={event._id} event={event} statusBadge={statusBadge} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div>
              {listings.length === 0 ? (
                <EmptyState
                  title="No listings yet"
                  message="List your gym, coaching service, or wellness business on Bahafit."
                  ctaHref="/listings/new"
                  ctaLabel="Add Your Business"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {listings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} statusBadge={statusBadge} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-10">
          <EventCalendar
            title="Upcoming Events"
            subtitle="Discover and register for what’s coming up."
          />
        </div>
      </main>

      <Footer />
    </>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0dd5b5] border-t-transparent" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}

function EmptyState({
  title,
  message,
  ctaHref,
  ctaLabel,
}: {
  title: string
  message: string
  ctaHref: string
  ctaLabel: string
}) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-6">{message}</p>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 bg-[#0dd5b5] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors"
      >
        {ctaLabel}
      </Link>
    </div>
  )
}

function AttendingCard({
  item,
  statusBadge,
  paymentBadge,
  past,
  onCancel,
  cancelling,
}: {
  item: AttendingEvent
  statusBadge: (status: string) => React.ReactNode
  paymentBadge: (paymentStatus: string) => React.ReactNode
  past?: boolean
  onCancel?: (registrationId: string) => void
  cancelling?: boolean
}) {
  const event = item.event
  const href = event.slug ? `/events/${event.slug.current}` : '#'
  const canCancel = !past && onCancel && item.status !== 'cancelled' && item.paymentStatus !== 'paid'
  const receiptHref = event.slug
    ? `/events/${event.slug.current}/checkout/confirmation?registrationId=${item.registrationId}`
    : null

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden ${past ? 'opacity-70' : ''}`}>
      <div className="flex">
        {/* Image */}
        <Link href={href} className="relative w-28 sm:w-36 flex-shrink-0 block">
          {event.featuredImage ? (
            <Image src={event.featuredImage} alt={event.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5] min-h-[120px]" />
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link href={href} className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 hover:text-[#0dd5b5] transition-colors">
                {event.title}
              </h3>
            </Link>
            {statusBadge(item.status)}
          </div>

          {event.startDate && (
            <p className="text-xs text-gray-500 mb-1">{formatDate(event.startDate)}</p>
          )}

          {event.location?.city && (
            <p className="text-xs text-gray-400 mb-2">
              {event.location.city}{event.location.island && `, ${event.location.island}`}
            </p>
          )}

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {item.ticketType && (
              <span className="text-gray-500">{item.ticketType}</span>
            )}
            <span className="font-medium text-[#0dd5b5]">
              {item.price === 0 ? 'Free' : `${item.currency} ${item.price.toFixed(2)}`}
            </span>
            {item.price > 0 && paymentBadge(item.paymentStatus)}
          </div>

          <div className="flex items-center gap-3 mt-2">
            {receiptHref && item.paymentStatus === 'paid' && (
              <Link
                href={receiptHref}
                className="text-xs font-medium text-gray-500 hover:text-[#0dd5b5] transition-colors"
              >
                View receipt
              </Link>
            )}
            {canCancel && (
              <button
                onClick={() => onCancel(item.registrationId)}
                disabled={cancelling}
                className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
              >
                {cancelling ? 'Cancelling…' : 'Cancel registration'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function HostingCard({
  event,
  statusBadge,
}: {
  event: EventSummary
  statusBadge: (status: string) => React.ReactNode
}) {
  const href = event.slug ? `/events/${event.slug.current}` : '#'
  const spotsLeft = event.capacity
    ? event.capacity - (event.currentRegistrations || 0)
    : null

  return (
    <Link href={href} className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Image */}
      <div className="relative h-36">
        {event.featuredImage ? (
          <Image src={event.featuredImage} alt={event.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5]" />
        )}
        {event.eventType && (
          <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
            {event.eventType.replace(/_/g, ' ')}
          </span>
        )}
        {event.status && (
          <span className="absolute top-2 right-2">{statusBadge(event.status)}</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">{event.title}</h3>

        {event.startDate && (
          <p className="text-xs text-gray-500 mb-2">{formatDate(event.startDate)}</p>
        )}

        {event.location?.city && (
          <p className="text-xs text-gray-400 mb-3">
            {event.location.city}{event.location.island && `, ${event.location.island}`}
          </p>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#0dd5b5]">
            {event.isFree ? 'Free' : event.pricing?.[0]
              ? `${event.pricing[0].currency} ${event.pricing[0].price}`
              : ''}
          </span>
          {spotsLeft !== null && (
            <span className="text-gray-400">
              {event.currentRegistrations || 0}/{event.capacity} registered
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function ListingCard({
  listing,
  statusBadge,
}: {
  listing: ListingSummary
  statusBadge: (status: string) => React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative h-24 bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5]">
        {listing.listingType && (
          <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
            {listing.listingType.replace(/_/g, ' ')}
          </span>
        )}
        {listing.status && (
          <span className="absolute top-2 right-2">{statusBadge(listing.status)}</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{listing.title}</h3>
          {listing.verified && (
            <svg className="w-4 h-4 text-[#0dd5b5] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        {listing.category && (
          <p className="text-xs text-gray-500 mb-1 capitalize">{listing.category.replace(/_/g, ' ')}</p>
        )}
        {listing.location?.city && (
          <p className="text-xs text-gray-400">
            {listing.location.city}{listing.location.island && `, ${listing.location.island}`}
          </p>
        )}
        {listing.createdAt && (
          <p className="text-xs text-gray-400 mt-2">Listed {formatDate(listing.createdAt)}</p>
        )}
      </div>
    </div>
  )
}
