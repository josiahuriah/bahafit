'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Carousel from '@/components/ui/Carousel'

interface Listing {
  _id: string
  title: string
  slug: { current: string }
  listingType: string
  category: string
  shortDescription?: string
  priceRange?: string
  hasPhysicalLocation: boolean
  offersOnlineServices: boolean
  verified: boolean
  featured: boolean
  location?: {
    city?: string
    island?: string
  }
  pricing?: {
    name: string
    price: number
    currency: string
    period: string
  }
  featuredImage?: string
  totalReviews: number
  tags?: string[]
}

const listingTypeLabels: Record<string, string> = {
  gym: 'Gym',
  trainer: 'Trainer',
  fitness_class: 'Class',
  wellness_center: 'Wellness',
  yoga_studio: 'Yoga',
  crossfit_box: 'CrossFit',
  martial_arts: 'Martial Arts',
  dance_studio: 'Dance',
  aquatics: 'Aquatics',
  sports_club: 'Sports Club',
  equipment_sale: 'Equipment',
  equipment_rental: 'Rental',
  apparel: 'Apparel',
  supplements: 'Supplements',
  nutrition_coaching: 'Nutrition',
  sports_medicine: 'Sports Med',
  massage: 'Massage',
  pt_services: 'PT Services',
  group_training: 'Group',
  online_coaching: 'Online',
  fitness_retreat: 'Retreat',
  facility_rental: 'Facility',
  other: 'Other',
}

const listingTypeIcons: Record<string, string> = {
  gym: '🏋️',
  trainer: '💪',
  fitness_class: '👥',
  wellness_center: '🌿',
  yoga_studio: '🧘',
  crossfit_box: '⚡',
  martial_arts: '🥋',
  dance_studio: '💃',
  aquatics: '🏊',
  sports_club: '⚽',
  equipment_sale: '🎽',
  equipment_rental: '📦',
  apparel: '👕',
  supplements: '💊',
  nutrition_coaching: '🥗',
  sports_medicine: '🩺',
  massage: '💆',
  pt_services: '🏃',
  group_training: '👯',
  online_coaching: '💻',
  fitness_retreat: '🏝️',
  facility_rental: '🏟️',
  other: '📍',
}

const priceRangeLabels: Record<string, { label: string; color: string }> = {
  free: { label: 'Free', color: 'text-green-600' },
  budget: { label: '$', color: 'text-gray-600' },
  moderate: { label: '$$', color: 'text-gray-700' },
  premium: { label: '$$$', color: 'text-gray-800' },
  luxury: { label: '$$$$', color: 'text-gray-900' },
  contact: { label: 'Contact', color: 'text-blue-600' },
}

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.slug.current}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group w-[280px] sm:w-[320px]"
    >
      <div className="relative h-40 sm:h-48 overflow-hidden">
        {listing.featuredImage ? (
          <Image
            src={listing.featuredImage}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-5xl">{listingTypeIcons[listing.listingType] || '📍'}</span>
          </div>
        )}
        {listing.featured && (
          <div className="absolute top-2 left-2 bg-[#f7d656] text-black px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        {listing.verified && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white p-1.5 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {listing.offersOnlineServices && !listing.hasPhysicalLocation && (
          <div className="absolute bottom-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Online
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-600">
            {listingTypeLabels[listing.listingType] || listing.listingType}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-[#0dd5b5] transition-colors">
          {listing.title}
        </h3>
        {listing.location?.city && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>{listing.location.city}{listing.location.island && `, ${listing.location.island}`}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          {listing.priceRange && priceRangeLabels[listing.priceRange] ? (
            <span className={`font-bold ${priceRangeLabels[listing.priceRange].color}`}>
              {priceRangeLabels[listing.priceRange].label}
            </span>
          ) : listing.pricing ? (
            <span className="text-[#0dd5b5] font-bold">
              From {listing.pricing.currency} {listing.pricing.price}
              {listing.pricing.period && listing.pricing.period !== 'one_time' && (
                <span className="text-xs font-normal text-gray-500">/{listing.pricing.period.replace('per_', '')}</span>
              )}
            </span>
          ) : (
            <span className="text-gray-500 text-sm">Contact for pricing</span>
          )}
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
      <span>{listingTypeIcons[type] || '📍'}</span>
      <span>{listingTypeLabels[type] || type}</span>
      <span className={`text-xs ${active ? 'text-white/80' : 'text-gray-400'}`}>({count})</span>
    </button>
  )
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])
  const [listingTypeCounts, setListingTypeCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchListings()
  }, [selectedType, searchQuery])

  useEffect(() => {
    // Fetch featured listings separately
    fetch('/api/listings?featured=true&limit=6')
      .then(res => res.json())
      .then(data => setFeaturedListings(data.listings || []))
      .catch(console.error)
  }, [])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedType !== 'all') params.append('listingType', selectedType)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/listings?${params}`)
      const data = await response.json()
      setListings(data.listings || [])
      setListingTypeCounts(data.listingTypeCounts || {})
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group listings by type for carousels
  const listingsByType = listings.reduce((acc: Record<string, Listing[]>, listing) => {
    const type = listing.listingType
    if (!acc[type]) acc[type] = []
    acc[type].push(listing)
    return acc
  }, {})

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center">
            Fitness Directory
          </h1>
          <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            Find gyms, trainers, studios, and everything you need for your fitness journey in the Caribbean.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search gyms, trainers, studios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 pr-12 rounded-full border-0 shadow-lg focus:ring-2 focus:ring-[#0dd5b5] outline-none text-gray-900"
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
              All Listings
            </button>
            {Object.entries(listingTypeCounts)
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
          {/* Featured Listings Carousel */}
          {featuredListings.length > 0 && selectedType === 'all' && !searchQuery && (
            <section className="py-8">
              <Carousel title="Featured Listings" showDots>
                {featuredListings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </Carousel>
            </section>
          )}

          {/* Verified Listings */}
          {selectedType === 'all' && !searchQuery && (
            <section className="py-6">
              <Carousel title="Verified Businesses" showDots={false}>
                {listings.filter(l => l.verified).slice(0, 10).map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </Carousel>
            </section>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0dd5b5] border-t-transparent"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `No listings match "${searchQuery}"`
                  : 'Check back soon for new listings!'}
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
            // Show listings grouped by type in carousels
            <>
              {Object.entries(listingsByType)
                .sort((a, b) => b[1].length - a[1].length)
                .map(([type, typeListings]) => (
                  <section key={type} className="py-6">
                    <Carousel
                      title={`${listingTypeIcons[type] || '📍'} ${listingTypeLabels[type] || type}`}
                      showDots={false}
                    >
                      {typeListings.map((listing) => (
                        <ListingCard key={listing._id} listing={listing} />
                      ))}
                    </Carousel>
                  </section>
                ))}
            </>
          ) : (
            // Show filtered listings in grid
            <section className="py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : `${listingTypeLabels[selectedType] || selectedType}`}
                <span className="text-gray-500 font-normal ml-2">({listings.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((listing) => (
                  <div key={listing._id} className="flex justify-center">
                    <ListingCard listing={listing} />
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
