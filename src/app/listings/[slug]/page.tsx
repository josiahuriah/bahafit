'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  serviceAreas?: string[]
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
  byAppointmentOnly: boolean
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
  classSchedule?: Array<{
    className: string
    instructor?: string
    day: string
    time: string
    duration?: string
    level?: string
    capacity?: number
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
    slug?: { current: string }
    profileImage?: string
    userType: string
    bio?: any
  }
  faqs?: Array<{
    question: string
    answer: string
  }>
  policies?: {
    cancellationPolicy?: string
    refundPolicy?: string
    termsAndConditions?: string
  }
  tags?: string[]
  verified: boolean
  featured: boolean
  averageRating?: number
  totalReviews: number
  featuredImage?: string
  images?: string[]
}

interface RelatedListing {
  _id: string
  title: string
  slug: { current: string }
  listingType: string
  location?: string
  featuredImage?: string
  priceRange?: string
  averageRating?: number
  verified: boolean
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
  sports_medicine: 'Sports Medicine/Physiotherapy',
  massage: 'Massage Therapy',
  pt_services: 'Personal Training Services',
  group_training: 'Group Training',
  online_coaching: 'Online Coaching',
  fitness_retreat: 'Fitness Retreat',
  facility_rental: 'Sports Facility Rental',
  other: 'Other',
}

const amenityLabels: Record<string, string> = {
  free_weights: 'Free Weights',
  cardio: 'Cardio Equipment',
  weight_machines: 'Weight Machines',
  pool: 'Swimming Pool',
  sauna: 'Sauna',
  steam_room: 'Steam Room',
  jacuzzi: 'Jacuzzi/Hot Tub',
  lockers: 'Locker Rooms',
  showers: 'Showers',
  towel_service: 'Towel Service',
  parking: 'Parking',
  free_parking: 'Free Parking',
  wifi: 'WiFi',
  ac: 'Air Conditioning',
  juice_bar: 'Juice Bar',
  pro_shop: 'Pro Shop',
  childcare: 'Child Care',
  personal_training: 'Personal Training',
  group_classes: 'Group Classes',
  nutrition: 'Nutrition Counseling',
  massage: 'Massage Services',
  physical_therapy: 'Physical Therapy',
  basketball: 'Basketball Court',
  tennis: 'Tennis Court',
  racquetball: 'Racquetball Court',
  boxing_ring: 'Boxing Ring',
  crossfit_equipment: 'CrossFit Equipment',
  yoga_studio: 'Yoga Studio',
  spinning_studio: 'Spinning Studio',
  outdoor_training: 'Outdoor Training Area',
  beach_access: 'Beach Access',
  wheelchair_accessible: 'Wheelchair Accessible',
}

const priceRangeLabels: Record<string, string> = {
  free: 'Free',
  budget: '$',
  moderate: '$$',
  premium: '$$$',
  luxury: '$$$$',
  contact: 'Contact for pricing',
}

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [relatedListings, setRelatedListings] = useState<RelatedListing[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'schedule' | 'faq'>('about')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (params.slug) {
      fetchListing()
    }
  }, [params.slug])

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/listings/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setListing(data.listing)
        setRelatedListings(data.relatedListings || [])
      } else if (response.status === 404) {
        router.push('/listings')
      }
    } catch (error) {
      console.error('Failed to fetch listing:', error)
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

  if (!listing) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h1>
          <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
          <Link href="/listings" className="bg-[#0dd5b5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors">
            Browse Listings
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  // Get today's hours
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todayHours = listing.operatingHours?.find(h => h.day === today)

  // Determine available tabs
  const tabs = ['about']
  if (listing.servicesOffered && listing.servicesOffered.length > 0) tabs.push('services')
  if (listing.classSchedule && listing.classSchedule.length > 0) tabs.push('schedule')
  if (listing.faqs && listing.faqs.length > 0) tabs.push('faq')

  return (
    <>
      <Header />

      {/* Hero Image */}
      <section className="relative h-[40vh] sm:h-[50vh] bg-gray-900">
        {listing.featuredImage ? (
          <Image
            src={listing.featuredImage}
            alt={listing.title}
            fill
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back Button */}
        <Link
          href="/listings"
          className="absolute top-20 left-4 sm:left-8 flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </Link>

        {/* Listing Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {listingTypeLabels[listing.listingType] || listing.listingType}
              </span>
              {listing.verified && (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
              {listing.featured && (
                <span className="bg-[#f7d656] text-black px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
              {listing.title}
            </h1>
            {listing.averageRating !== undefined && listing.averageRating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(listing.averageRating!) ? 'text-yellow-400' : 'text-white/30'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white font-medium">{listing.averageRating.toFixed(1)}</span>
                <span className="text-white/60">({listing.totalReviews} reviews)</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="bg-gray-50">
        {/* Quick Info Bar */}
        <section className="bg-white border-b sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              <div className="flex items-center gap-4 flex-shrink-0 text-sm">
                {todayHours && (
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${todayHours.closed ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    <span className="font-medium">
                      {todayHours.closed ? 'Closed today' : todayHours.is24Hours ? 'Open 24h' : `${todayHours.open} - ${todayHours.close}`}
                    </span>
                  </div>
                )}
                {listing.location?.city && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{listing.location.city}</span>
                  </div>
                )}
                {listing.priceRange && (
                  <span className="font-bold text-[#0dd5b5]">
                    {priceRangeLabels[listing.priceRange] || listing.priceRange}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {listing.contact?.phone && (
                  <a
                    href={`tel:${listing.contact.phone}`}
                    className="bg-[#0dd5b5] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#0bc5a5] transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="hidden sm:inline">Call</span>
                  </a>
                )}
                {listing.contact?.whatsapp && (
                  <a
                    href={`https://wa.me/${listing.contact.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
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
                <div className="flex border-b overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`flex-1 min-w-[80px] px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
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
                  {activeTab === 'about' && (
                    <div className="space-y-6">
                      {listing.shortDescription && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                          <p className="text-gray-600 leading-relaxed">{listing.shortDescription}</p>
                        </div>
                      )}

                      {listing.specializations && listing.specializations.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Specializations</h3>
                          <div className="flex flex-wrap gap-2">
                            {listing.specializations.map((spec, i) => (
                              <span key={i} className="bg-[#0dd5b5]/10 text-[#0dd5b5] px-3 py-1 rounded-full text-sm">
                                {spec.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {listing.amenities && listing.amenities.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {listing.amenities.map((amenity, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-[#0dd5b5] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {amenityLabels[amenity] || amenity.replace(/_/g, ' ')}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {listing.features && listing.features.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {listing.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-[#0dd5b5] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {listing.certifications && listing.certifications.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Certifications</h3>
                          <div className="space-y-2">
                            {listing.certifications.map((cert, i) => (
                              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                                <div className="w-10 h-10 bg-[#0dd5b5]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <svg className="w-5 h-5 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 012.812 2.812 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-2.812 2.812 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-2.812-2.812 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 012.812-2.812z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{cert.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {cert.organization}{cert.year && ` (${cert.year})`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'services' && listing.servicesOffered && (
                    <div className="space-y-4">
                      {listing.servicesOffered.map((service, i) => (
                        <div key={i} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{service.name}</h4>
                              {service.description && (
                                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                              )}
                              {service.duration && (
                                <p className="text-xs text-gray-500 mt-1">Duration: {service.duration}</p>
                              )}
                            </div>
                            {service.price && (
                              <span className="font-bold text-[#0dd5b5]">
                                From ${service.price}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'schedule' && listing.classSchedule && (
                    <div className="space-y-4">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                        const dayClasses = listing.classSchedule?.filter(c => c.day === day) || []
                        if (dayClasses.length === 0) return null
                        return (
                          <div key={day}>
                            <h4 className="font-medium text-gray-900 mb-2">{day}</h4>
                            <div className="space-y-2">
                              {dayClasses.map((cls, i) => (
                                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                  <div>
                                    <p className="font-medium text-gray-900">{cls.className}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      <span>{cls.time}</span>
                                      {cls.duration && <span>({cls.duration})</span>}
                                      {cls.instructor && <span>with {cls.instructor}</span>}
                                    </div>
                                  </div>
                                  {cls.level && (
                                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                      {cls.level}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {activeTab === 'faq' && listing.faqs && (
                    <div className="space-y-4">
                      {listing.faqs.map((faq, i) => (
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
                  )}
                </div>
              </div>

              {/* Pricing */}
              {listing.pricing && listing.pricing.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Pricing</h3>
                  <div className="space-y-3">
                    {listing.pricing.map((tier, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{tier.name}</p>
                            {tier.description && (
                              <p className="text-sm text-gray-500">{tier.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            {tier.discountedPrice ? (
                              <>
                                <p className="text-lg font-bold text-[#0dd5b5]">
                                  {tier.currency} {tier.discountedPrice}
                                  {tier.period && tier.period !== 'one_time' && (
                                    <span className="text-xs font-normal text-gray-500">/{tier.period.replace('per_', '')}</span>
                                  )}
                                </p>
                                <p className="text-sm text-gray-400 line-through">
                                  {tier.currency} {tier.price}
                                </p>
                              </>
                            ) : (
                              <p className="text-lg font-bold text-gray-900">
                                {tier.currency} {tier.price}
                                {tier.period && tier.period !== 'one_time' && (
                                  <span className="text-xs font-normal text-gray-500">/{tier.period.replace('per_', '')}</span>
                                )}
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

              {/* Image Gallery */}
              {listing.images && listing.images.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Gallery</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {listing.images.slice(0, 6).map((image, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(image)}
                        className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <Image src={image} alt={`${listing.title} ${i + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
                <div className="space-y-3">
                  {listing.contact?.phone && (
                    <a href={`tel:${listing.contact.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-[#0dd5b5] transition-colors">
                      <div className="w-10 h-10 bg-[#0dd5b5]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-sm">{listing.contact.phone}</span>
                    </a>
                  )}
                  {listing.contact?.email && (
                    <a href={`mailto:${listing.contact.email}`} className="flex items-center gap-3 text-gray-600 hover:text-[#0dd5b5] transition-colors">
                      <div className="w-10 h-10 bg-[#0dd5b5]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm truncate">{listing.contact.email}</span>
                    </a>
                  )}
                  {listing.contact?.website && (
                    <a href={listing.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-[#0dd5b5] transition-colors">
                      <div className="w-10 h-10 bg-[#0dd5b5]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <span className="text-sm">Visit Website</span>
                    </a>
                  )}
                </div>

                {/* Social Links */}
                {listing.socialLinks && Object.values(listing.socialLinks).some(v => v) && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-3">
                      {listing.socialLinks.facebook && (
                        <a href={listing.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                      )}
                      {listing.socialLinks.instagram && (
                        <a href={listing.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>
                        </a>
                      )}
                      {listing.socialLinks.twitter && (
                        <a href={listing.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                      )}
                      {listing.socialLinks.youtube && (
                        <a href={listing.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Hours Card */}
              {listing.operatingHours && listing.operatingHours.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Hours</h3>
                  {listing.byAppointmentOnly && (
                    <p className="text-sm text-blue-600 mb-3">By Appointment Only</p>
                  )}
                  <div className="space-y-2">
                    {listing.operatingHours.map((hours, i) => (
                      <div key={i} className={`flex justify-between text-sm ${hours.day === today ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                        <span>{hours.day}</span>
                        <span>
                          {hours.closed ? 'Closed' : hours.is24Hours ? '24 Hours' : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Card */}
              {listing.hasPhysicalLocation && listing.location && (
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {listing.location.name && (
                      <p className="font-medium text-gray-900">{listing.location.name}</p>
                    )}
                    {listing.location.address && <p>{listing.location.address}</p>}
                    <p>
                      {listing.location.city}
                      {listing.location.island && `, ${listing.location.island}`}
                      {listing.location.country && `, ${listing.location.country}`}
                    </p>
                    {listing.location.directions && (
                      <p className="text-xs text-gray-500 mt-2">{listing.location.directions}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Owner Card */}
              {listing.owner && (
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Owner</h3>
                  <div className="flex items-center gap-3">
                    {listing.owner.profileImage ? (
                      <Image
                        src={listing.owner.profileImage}
                        alt={listing.owner.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-400">{listing.owner.name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{listing.owner.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{listing.owner.userType}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Listings */}
          {relatedListings.length > 0 && (
            <section className="mt-12">
              <Carousel title="Similar Listings" showDots={false}>
                {relatedListings.map((relListing) => (
                  <Link
                    key={relListing._id}
                    href={`/listings/${relListing.slug.current}`}
                    className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden w-[280px]"
                  >
                    <div className="relative h-32 overflow-hidden">
                      {relListing.featuredImage ? (
                        <Image src={relListing.featuredImage} alt={relListing.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                      )}
                      {relListing.verified && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 line-clamp-1">{relListing.title}</h4>
                      {relListing.location && (
                        <p className="text-sm text-gray-500">{relListing.location}</p>
                      )}
                      {relListing.averageRating && (
                        <div className="flex items-center gap-1 mt-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm text-gray-600">{relListing.averageRating.toFixed(1)}</span>
                        </div>
                      )}
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
            alt="Listing image"
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
