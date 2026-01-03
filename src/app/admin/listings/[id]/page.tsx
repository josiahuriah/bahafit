'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatDateTime } from '@/lib/utils'

interface FitnessListing {
  _id: string
  title: string
  slug: { current: string }
  listingType: string
  category: string
  description: any
  shortDescription?: string
  hasPhysicalLocation: boolean
  offersOnlineServices: boolean
  location?: {
    name?: string
    address?: string
    city?: string
    island?: string
    country?: string
    latitude?: number
    longitude?: number
    directions?: string
  }
  contact?: {
    phone?: string
    alternatePhone?: string
    email?: string
    whatsapp?: string
    website?: string
  }
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
    tiktok?: string
    linkedin?: string
  }
  operatingHours?: Array<{
    day: string
    open: string
    close: string
    closed: boolean
    is24Hours: boolean
  }>
  priceRange?: string
  pricing?: Array<{
    name: string
    description?: string
    price: number
    currency: string
    period: string
    discountedPrice?: number
    includes?: string[]
  }>
  amenities?: string[]
  features?: string[]
  servicesOffered?: Array<{
    name: string
    description?: string
    duration?: string
    price?: number
  }>
  specializations?: string[]
  certifications?: Array<{
    name: string
    organization?: string
    year?: number
  }>
  owner?: {
    _id: string
    name: string
    email: string
    userType: string
    phone?: string
  }
  tags?: string[]
  status: string
  featured: boolean
  verified: boolean
  totalReviews: number
  viewCount: number
  contactClicks: number
  featuredImage?: string
  images?: string[]
  _createdAt: string
  _updatedAt: string
  publishedAt?: string
}

const listingTypeLabels: Record<string, string> = {
  gym: 'Gym/Fitness Center',
  trainer: 'Personal Trainer',
  fitness_class: 'Fitness Class',
  wellness_center: 'Wellness Center/Spa',
  yoga_studio: 'Yoga/Pilates Studio',
  crossfit_box: 'CrossFit Box',
  martial_arts: 'Martial Arts Academy',
  dance_studio: 'Dance Studio',
  aquatics: 'Swimming/Aquatics',
  sports_club: 'Sports Club',
  equipment_sale: 'Fitness Equipment (Sale)',
  equipment_rental: 'Fitness Equipment (Rental)',
  apparel: 'Fitness Apparel',
  supplements: 'Supplements/Nutrition',
  nutrition_coaching: 'Nutrition Coaching',
  sports_medicine: 'Sports Medicine',
  massage: 'Massage Therapy',
  pt_services: 'Personal Training Services',
  group_training: 'Group Training',
  online_coaching: 'Online Coaching',
  fitness_retreat: 'Fitness Retreat',
  facility_rental: 'Sports Facility Rental',
  other: 'Other',
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  archived: 'bg-purple-100 text-purple-800',
}

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<FitnessListing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchListing()
    }
  }, [params.id])

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/admin/listings/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setListing(data.listing)
      } else if (response.status === 404) {
        router.push('/admin/listings')
      }
    } catch (error) {
      console.error('Failed to fetch listing:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/listings/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchListing()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleToggleFeatured = async () => {
    if (!listing) return
    try {
      const response = await fetch(`/api/admin/listings/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !listing.featured }),
      })

      if (response.ok) {
        fetchListing()
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error)
    }
  }

  const handleToggleVerified = async () => {
    if (!listing) return
    try {
      const response = await fetch(`/api/admin/listings/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !listing.verified }),
      })

      if (response.ok) {
        fetchListing()
      }
    } catch (error) {
      console.error('Failed to toggle verified:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/listings/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/listings')
      }
    } catch (error) {
      console.error('Failed to delete listing:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-500">Loading listing...</p>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Listing not found</p>
        <Link href="/admin/listings" className="mt-4 text-indigo-600 hover:text-indigo-500">
          Back to Listings
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/listings"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
          Back to Listings
        </Link>

        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {listing.featuredImage && (
              <Image
                src={listing.featuredImage}
                alt={listing.title}
                width={80}
                height={80}
                className="h-20 w-20 rounded-lg object-cover"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
                {listing.verified && (
                  <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {listingTypeLabels[listing.listingType] || listing.listingType}
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <button
              onClick={handleToggleVerified}
              className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
                listing.verified
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {listing.verified ? 'Remove Verification' : 'Verify Listing'}
            </button>
            <button
              onClick={handleToggleFeatured}
              className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
                listing.featured
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {listing.featured ? 'Remove Featured' : 'Make Featured'}
            </button>
            <a
              href={`/studio/structure/fitnessListing;${listing._id}`}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={listing.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border ${statusColors[listing.status]}`}
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="published">Published</option>
                  <option value="suspended">Suspended</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verified</label>
                <p className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  listing.verified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {listing.verified ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
                <p className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  listing.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {listing.featured ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <p className="text-sm text-gray-900">{listing.priceRange || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{listing.viewCount || 0}</p>
                <p className="text-sm text-gray-500">Views</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{listing.contactClicks || 0}</p>
                <p className="text-sm text-gray-500">Contact Clicks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{listing.totalReviews || 0}</p>
                <p className="text-sm text-gray-500">Reviews</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            {listing.hasPhysicalLocation && listing.location ? (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listing.location.name && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{listing.location.name}</dd>
                  </div>
                )}
                {listing.location.address && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{listing.location.address}</dd>
                  </div>
                )}
                {listing.location.city && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">City</dt>
                    <dd className="mt-1 text-sm text-gray-900">{listing.location.city}</dd>
                  </div>
                )}
                {listing.location.island && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Island</dt>
                    <dd className="mt-1 text-sm text-gray-900">{listing.location.island}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-sm text-gray-500">
                {listing.offersOnlineServices ? 'Online services only' : 'No location information'}
              </p>
            )}
            {listing.offersOnlineServices && (
              <p className="mt-4 text-sm text-blue-600">This listing offers online services</p>
            )}
          </div>

          {/* Pricing */}
          {listing.pricing && listing.pricing.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
              <div className="space-y-4">
                {listing.pricing.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {item.currency} {item.price}
                          {item.period && <span className="text-sm font-normal text-gray-500"> / {item.period.replace('_', ' ')}</span>}
                        </p>
                        {item.discountedPrice && (
                          <p className="text-sm text-green-600">
                            Sale: {item.currency} {item.discountedPrice}
                          </p>
                        )}
                      </div>
                    </div>
                    {item.includes && item.includes.length > 0 && (
                      <ul className="mt-3 text-sm text-gray-600">
                        {item.includes.map((inc, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
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

          {/* Operating Hours */}
          {listing.operatingHours && listing.operatingHours.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h2>
              <div className="space-y-2">
                {listing.operatingHours.map((hours, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{hours.day}</span>
                    <span className="text-gray-600">
                      {hours.closed ? 'Closed' : hours.is24Hours ? '24 Hours' : `${hours.open} - ${hours.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {listing.shortDescription && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-sm text-gray-700">{listing.shortDescription}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Owner</h2>
            {listing.owner ? (
              <div>
                <p className="font-medium text-gray-900">{listing.owner.name}</p>
                <p className="text-sm text-gray-500">{listing.owner.email}</p>
                {listing.owner.phone && (
                  <p className="text-sm text-gray-500">{listing.owner.phone}</p>
                )}
                <p className="text-sm text-gray-500 capitalize">{listing.owner.userType}</p>
                <Link
                  href={`/admin/users/${listing.owner._id}`}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 inline-block"
                >
                  View Profile
                </Link>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No owner assigned</p>
            )}
          </div>

          {/* Contact Info */}
          {listing.contact && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <dl className="space-y-2">
                {listing.contact.email && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{listing.contact.email}</dd>
                  </div>
                )}
                {listing.contact.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900">{listing.contact.phone}</dd>
                  </div>
                )}
                {listing.contact.whatsapp && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">WhatsApp</dt>
                    <dd className="text-sm text-gray-900">{listing.contact.whatsapp}</dd>
                  </div>
                )}
                {listing.contact.website && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Website</dt>
                    <dd className="text-sm">
                      <a href={listing.contact.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                        {listing.contact.website}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity, index) => (
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

          {/* Specializations */}
          {listing.specializations && listing.specializations.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Specializations</h2>
              <div className="flex flex-wrap gap-2">
                {listing.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
                  >
                    {spec.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
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
                <dd className="text-sm text-gray-900">{formatDateTime(listing._createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(listing._updatedAt)}</dd>
              </div>
              {listing.publishedAt && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Published</dt>
                  <dd className="text-sm text-gray-900">{formatDateTime(listing.publishedAt)}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">ID</dt>
                <dd className="text-sm text-gray-900 font-mono text-xs">{listing._id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
