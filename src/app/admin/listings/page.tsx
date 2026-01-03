'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDateTime } from '@/lib/utils'

interface FitnessListing {
  _id: string
  title: string
  slug: { current: string }
  listingType: string
  category: string
  status: string
  featured: boolean
  verified: boolean
  priceRange?: string
  hasPhysicalLocation: boolean
  offersOnlineServices: boolean
  location?: string
  island?: string
  ownerName?: string
  ownerType?: string
  featuredImage?: string
  totalReviews: number
  viewCount: number
  _createdAt: string
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

const priceRangeLabels: Record<string, string> = {
  free: 'Free',
  budget: '$',
  moderate: '$$',
  premium: '$$$',
  luxury: '$$$$',
  contact: 'Contact',
}

export default function ListingsPage() {
  const [listings, setListings] = useState<FitnessListing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [listingTypeFilter, setListingTypeFilter] = useState<string>('all')
  const [featuredFilter, setFeaturedFilter] = useState<string>('all')
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all')

  useEffect(() => {
    fetchListings()
  }, [statusFilter, listingTypeFilter, featuredFilter, verifiedFilter, search])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (listingTypeFilter !== 'all') params.append('listingType', listingTypeFilter)
      if (featuredFilter === 'featured') params.append('featured', 'true')
      if (verifiedFilter === 'verified') params.append('verified', 'true')
      if (search) params.append('search', search)

      const response = await fetch(`/api/admin/listings?${params}`)
      if (response.ok) {
        const data = await response.json()
        setListings(data.listings)
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (listingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchListings()
      }
    } catch (error) {
      console.error('Failed to update listing status:', error)
    }
  }

  const handleToggleFeatured = async (listingId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      })

      if (response.ok) {
        fetchListings()
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error)
    }
  }

  const handleToggleVerified = async (listingId: string, currentVerified: boolean) => {
    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !currentVerified }),
      })

      if (response.ok) {
        fetchListings()
      }
    } catch (error) {
      console.error('Failed to toggle verified:', error)
    }
  }

  const handleDelete = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchListings()
      }
    } catch (error) {
      console.error('Failed to delete listing:', error)
    }
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fitness Listings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all fitness listings including gyms, trainers, equipment, and services.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <a
            href="/studio/structure/fitnessListing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Add Listing
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Listings</dt>
                  <dd className="text-lg font-semibold text-gray-900">{listings.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Published</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {listings.filter(l => l.status === 'published').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {listings.filter(l => l.status === 'pending').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Verified</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {listings.filter(l => l.verified).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Featured</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {listings.filter(l => l.featured).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending Review</option>
            <option value="published">Published</option>
            <option value="suspended">Suspended</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label htmlFor="listingType" className="block text-sm font-medium text-gray-700">
            Listing Type
          </label>
          <select
            id="listingType"
            value={listingTypeFilter}
            onChange={(e) => setListingTypeFilter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          >
            <option value="all">All Types</option>
            {Object.entries(listingTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="featured" className="block text-sm font-medium text-gray-700">
            Featured
          </label>
          <select
            id="featured"
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          >
            <option value="all">All</option>
            <option value="featured">Featured Only</option>
          </select>
        </div>

        <div>
          <label htmlFor="verified" className="block text-sm font-medium text-gray-700">
            Verified
          </label>
          <select
            id="verified"
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          >
            <option value="all">All</option>
            <option value="verified">Verified Only</option>
          </select>
        </div>
      </div>

      {/* Listings Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {loading ? (
                <div className="text-center py-12 bg-white">
                  <p className="text-gray-500">Loading listings...</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Listing
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Type
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Owner
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Location
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Badges
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Stats
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {listings.map((listing) => (
                      <tr key={listing._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {listing.featuredImage ? (
                                <Image
                                  src={listing.featuredImage}
                                  alt={listing.title}
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{listing.title}</div>
                              <div className="text-sm text-gray-500">
                                {listing.priceRange && priceRangeLabels[listing.priceRange]}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>
                            <span>{listingTypeLabels[listing.listingType] || listing.listingType}</span>
                            {listing.offersOnlineServices && (
                              <span className="ml-1 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                Online
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>
                            <p className="font-medium text-gray-900">{listing.ownerName || 'N/A'}</p>
                            <p className="text-xs text-gray-500 capitalize">{listing.ownerType}</p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {listing.hasPhysicalLocation ? (listing.location || listing.island || 'N/A') : 'Online Only'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <select
                            value={listing.status}
                            onChange={(e) => handleStatusChange(listing._id, e.target.value)}
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[listing.status]} border-0 cursor-pointer`}
                          >
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                            <option value="published">Published</option>
                            <option value="suspended">Suspended</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleVerified(listing._id, listing.verified)}
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                listing.verified
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                              title={listing.verified ? 'Remove verification' : 'Verify listing'}
                            >
                              {listing.verified ? 'Verified' : 'Unverified'}
                            </button>
                            <button
                              onClick={() => handleToggleFeatured(listing._id, listing.featured)}
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                listing.featured
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                              title={listing.featured ? 'Remove from featured' : 'Make featured'}
                            >
                              {listing.featured ? 'Featured' : 'Not Featured'}
                            </button>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1" title="Views">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {listing.viewCount || 0}
                            </span>
                          </div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            href={`/admin/listings/${listing._id}`}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            View
                          </Link>
                          <a
                            href={`/studio/structure/fitnessListing;${listing._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </a>
                          <button
                            onClick={() => handleDelete(listing._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {!loading && listings.length === 0 && (
                <div className="text-center py-12 bg-white">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No listings found</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new fitness listing.</p>
                  <div className="mt-6">
                    <a
                      href="/studio/structure/fitnessListing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                      </svg>
                      Add Listing
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
