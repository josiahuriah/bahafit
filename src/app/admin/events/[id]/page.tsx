'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatDateTime } from '@/lib/utils'

interface FitnessEvent {
  _id: string
  title: string
  slug: { current: string }
  eventType: string
  description: any
  shortDescription?: string
  startDate: string
  endDate?: string
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
  pricing?: Array<{
    tierName: string
    description?: string
    price: number
    earlyBirdPrice?: number
    currency: string
    capacity?: number
    includes?: string[]
  }>
  contactInfo?: {
    email?: string
    phone?: string
    whatsapp?: string
  }
  organizer?: {
    _id: string
    name: string
    email: string
    userType: string
  }
  sponsors?: Array<{
    name: string
    tier: string
    website?: string
  }>
  amenities?: string[]
  tags?: string[]
  status: string
  featured: boolean
  featuredImage?: string
  images?: string[]
  _createdAt: string
  _updatedAt: string
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

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  postponed: 'bg-orange-100 text-orange-800',
  completed: 'bg-blue-100 text-blue-800',
  archived: 'bg-purple-100 text-purple-800',
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<FitnessEvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/admin/events/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data.event)
      } else if (response.status === 404) {
        router.push('/admin/events')
      }
    } catch (error) {
      console.error('Failed to fetch event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/events/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchEvent()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleToggleFeatured = async () => {
    if (!event) return
    try {
      const response = await fetch(`/api/admin/events/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !event.featured }),
      })

      if (response.ok) {
        fetchEvent()
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/events/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/events')
      }
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-500">Loading event...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Event not found</p>
        <Link href="/admin/events" className="mt-4 text-indigo-600 hover:text-indigo-500">
          Back to Events
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/events"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
          Back to Events
        </Link>

        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {event.featuredImage && (
              <Image
                src={event.featuredImage}
                alt={event.title}
                width={80}
                height={80}
                className="h-20 w-20 rounded-lg object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {eventTypeLabels[event.eventType] || event.eventType}
                {event.isVirtual && ' (Virtual)'}
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <button
              onClick={handleToggleFeatured}
              className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
                event.featured
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {event.featured ? 'Remove Featured' : 'Make Featured'}
            </button>
            <a
              href={`/studio/structure/fitnessEvent;${event._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Edit in Studio
            </a>
            <button
              onClick={handleDelete}
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status & Visibility</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={event.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border ${statusColors[event.status]}`}
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="postponed">Postponed</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
                <p className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  event.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {event.featured ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDateTime(event.startDate)}</dd>
              </div>
              {event.endDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDateTime(event.endDate)}</dd>
                </div>
              )}
              {event.registrationDeadline && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Registration Deadline</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDateTime(event.registrationDeadline)}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Capacity</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {event.currentRegistrations || 0} / {event.capacity || 'Unlimited'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Price</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {event.isFree ? 'Free' : (event.pricing?.length ? 'Multiple tiers' : 'Not set')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Registration Required</dt>
                <dd className="mt-1 text-sm text-gray-900">{event.requiresRegistration ? 'Yes' : 'No'}</dd>
              </div>
            </dl>
          </div>

          {/* Location */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            {event.isVirtual ? (
              <div>
                <p className="text-sm text-gray-600">This is a virtual event</p>
                {event.virtualEventPlatform && (
                  <p className="mt-2 text-sm text-gray-900">Platform: {event.virtualEventPlatform}</p>
                )}
                {event.virtualEventLink && (
                  <a href={event.virtualEventLink} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 block">
                    Event Link
                  </a>
                )}
              </div>
            ) : event.location ? (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.location.venueName && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Venue</dt>
                    <dd className="mt-1 text-sm text-gray-900">{event.location.venueName}</dd>
                  </div>
                )}
                {event.location.address && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{event.location.address}</dd>
                  </div>
                )}
                {event.location.city && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">City</dt>
                    <dd className="mt-1 text-sm text-gray-900">{event.location.city}</dd>
                  </div>
                )}
                {event.location.island && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Island</dt>
                    <dd className="mt-1 text-sm text-gray-900">{event.location.island}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-sm text-gray-500">No location information provided</p>
            )}
          </div>

          {/* Pricing Tiers */}
          {event.pricing && event.pricing.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing Tiers</h2>
              <div className="space-y-4">
                {event.pricing.map((tier, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{tier.tierName}</h3>
                        {tier.description && (
                          <p className="text-sm text-gray-500 mt-1">{tier.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {tier.currency} {tier.price}
                        </p>
                        {tier.earlyBirdPrice && (
                          <p className="text-sm text-green-600">
                            Early Bird: {tier.currency} {tier.earlyBirdPrice}
                          </p>
                        )}
                      </div>
                    </div>
                    {tier.includes && tier.includes.length > 0 && (
                      <ul className="mt-3 text-sm text-gray-600">
                        {tier.includes.map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {event.shortDescription && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-sm text-gray-700">{event.shortDescription}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organizer */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Organizer</h2>
            {event.organizer ? (
              <div>
                <p className="font-medium text-gray-900">{event.organizer.name}</p>
                <p className="text-sm text-gray-500">{event.organizer.email}</p>
                <p className="text-sm text-gray-500 capitalize">{event.organizer.userType}</p>
                <Link
                  href={`/admin/users/${event.organizer._id}`}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 inline-block"
                >
                  View Profile
                </Link>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No organizer assigned</p>
            )}
          </div>

          {/* Contact Info */}
          {event.contactInfo && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <dl className="space-y-2">
                {event.contactInfo.email && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{event.contactInfo.email}</dd>
                  </div>
                )}
                {event.contactInfo.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900">{event.contactInfo.phone}</dd>
                  </div>
                )}
                {event.contactInfo.whatsapp && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">WhatsApp</dt>
                    <dd className="text-sm text-gray-900">{event.contactInfo.whatsapp}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Amenities */}
          {event.amenities && event.amenities.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {event.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {amenity.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(event._createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(event._updatedAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">ID</dt>
                <dd className="text-sm text-gray-900 font-mono text-xs">{event._id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
