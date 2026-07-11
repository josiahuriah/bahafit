'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
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

type DashboardTab = 'attending' | 'hosting'

function DashboardContent() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const justCreated = searchParams.get('created') === '1'
  const [activeTab, setActiveTab] = useState<DashboardTab>(justCreated ? 'hosting' : 'attending')
  const [attending, setAttending] = useState<AttendingEvent[]>([])
  const [hosting, setHosting] = useState<EventSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreatedBanner, setShowCreatedBanner] = useState(justCreated)

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard')
    }
  }, [authStatus, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const data = await response.json()
        setAttending(data.attending || [])
        setHosting(data.hosting || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
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
    }
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
        {status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
      </span>
    )
  }

  const upcomingAttending = attending.filter(
    (a) => a.event.startDate && new Date(a.event.startDate) >= new Date()
  )
  const pastAttending = attending.filter(
    (a) => a.event.startDate && new Date(a.event.startDate) < new Date()
  )

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
                <p className="text-gray-500 mt-1">Manage your events and registrations</p>
              </div>
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

            {/* Tabs */}
            <div className="flex gap-1 mt-6 border-b -mb-px">
              <button
                onClick={() => setActiveTab('attending')}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'attending'
                    ? 'border-[#0dd5b5] text-[#0dd5b5]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Attending
                {attending.length > 0 && (
                  <span className="ml-2 bg-[#0dd5b5]/10 text-[#0dd5b5] text-xs font-semibold px-2 py-0.5 rounded-full">
                    {attending.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('hosting')}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'hosting'
                    ? 'border-[#0dd5b5] text-[#0dd5b5]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Hosting
                {hosting.length > 0 && (
                  <span className="ml-2 bg-[#0dd5b5]/10 text-[#0dd5b5] text-xs font-semibold px-2 py-0.5 rounded-full">
                    {hosting.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Attending Tab */}
          {activeTab === 'attending' && (
            <div>
              {attending.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No events yet</h3>
                  <p className="text-gray-500 mb-6">Browse upcoming events and register for ones that interest you.</p>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 bg-[#0dd5b5] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors"
                  >
                    Browse Events
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Upcoming */}
                  {upcomingAttending.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingAttending.map((item) => (
                          <AttendingCard key={item.registrationId} item={item} statusBadge={statusBadge} />
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
                          <AttendingCard key={item.registrationId} item={item} statusBadge={statusBadge} past />
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
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No events hosted</h3>
                  <p className="text-gray-500 mb-6">Ready to host your own fitness event? Get started today.</p>
                  <Link
                    href="/events/new"
                    className="inline-flex items-center gap-2 bg-[#0dd5b5] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First Event
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hosting.map((event) => (
                    <HostingCard key={event._id} event={event} />
                  ))}
                </div>
              )}
            </div>
          )}
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

function AttendingCard({
  item,
  statusBadge,
  past,
}: {
  item: AttendingEvent
  statusBadge: (status: string) => React.ReactNode
  past?: boolean
}) {
  const event = item.event
  const href = event.slug ? `/events/${event.slug.current}` : '#'

  return (
    <Link href={href} className={`block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden ${past ? 'opacity-70' : ''}`}>
      <div className="flex">
        {/* Image */}
        <div className="relative w-28 sm:w-36 flex-shrink-0">
          {event.featuredImage ? (
            <Image src={event.featuredImage} alt={event.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5] min-h-[120px]" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{event.title}</h3>
            {statusBadge(item.status)}
          </div>

          {event.startDate && (
            <p className="text-xs text-gray-500 mb-2">{formatDate(event.startDate)}</p>
          )}

          {event.location?.city && (
            <p className="text-xs text-gray-400 mb-2">
              {event.location.city}{event.location.island && `, ${event.location.island}`}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs">
            {item.ticketType && (
              <span className="text-gray-500">{item.ticketType}</span>
            )}
            <span className="font-medium text-[#0dd5b5]">
              {item.price === 0 ? 'Free' : `${item.currency} ${item.price}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function HostingCard({ event }: { event: EventSummary }) {
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
