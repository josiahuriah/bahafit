import { client } from '@/sanity/lib/client'
import { getUserEventsCollection } from '@/lib/db/models/event'
import { getUserListingsCollection } from '@/lib/db/models/listing'
import {
  seedEvents,
  seedListings,
  type SeedEvent,
  type SeedListing,
  type EventTagTone,
} from './seed'

const FEATURED_EVENT_COUNT = 8
const FEATURED_LISTING_COUNT = 8

interface SanityEvent {
  _id: string
  title: string
  slug: { current: string }
  startDate: string
  isFree: boolean
  price?: number
  pricing?: Array<{ price?: number; currency?: string }>
  location?: { venueName?: string; city?: string; island?: string }
  featuredImage?: string
  featured?: boolean
  _createdAt?: string
}

interface SanityListing {
  _id: string
  title: string
  slug: { current: string }
  category?: string
  listingType?: string
  verified?: boolean
  totalReviews?: number
  rating?: number
  priceRange?: string
  featuredImage?: string
  location?: { city?: string; island?: string }
}

function formatLocation(loc?: { venueName?: string; city?: string; island?: string }): string {
  if (!loc) return 'Bahamas'
  const parts = [loc.venueName, loc.city, loc.island].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Bahamas'
}

function formatEventDate(iso: string): string {
  const d = new Date(iso)
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${date} · ${time}`
}

function formatEventPrice(event: SanityEvent): string {
  if (event.isFree) return 'Free'
  const tierPrice = event.pricing?.[0]?.price
  const currency = event.pricing?.[0]?.currency || 'BSD'
  const price = tierPrice ?? event.price
  if (price == null) return 'TBA'
  return `${currency} ${price.toFixed(2)}`
}

function pickTagTone(index: number, isFeatured?: boolean): { tag: string; tagTone: EventTagTone } {
  if (isFeatured) return { tag: 'Trending', tagTone: 'trending' }
  if (index === 0) return { tag: 'Popular', tagTone: 'popular' }
  return { tag: 'New', tagTone: 'new' }
}

function mapEvent(event: SanityEvent, index: number): SeedEvent {
  const { tag, tagTone } = pickTagTone(index, event.featured)
  return {
    id: event._id,
    title: event.title,
    location: formatLocation(event.location),
    date: formatEventDate(event.startDate),
    price: formatEventPrice(event),
    tag,
    tagTone,
    image: event.featuredImage || '/images/seed2.jpg',
    href: `/events/${event.slug.current}`,
  }
}

function priceLevelFromRange(range?: string): string {
  switch (range) {
    case 'budget':
      return '$'
    case 'moderate':
      return '$$'
    case 'premium':
      return '$$$'
    case 'luxury':
      return '$$$$'
    default:
      return '$$'
  }
}

function mapListing(listing: SanityListing): SeedListing {
  const category = listing.category || listing.listingType || 'Listing'
  return {
    id: listing._id,
    name: listing.title,
    category: category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    distance: '—',
    rating: listing.rating ?? 0,
    reviews: listing.totalReviews ?? 0,
    priceLevel: priceLevelFromRange(listing.priceRange),
    verified: Boolean(listing.verified),
    image: listing.featuredImage || '/images/seed6.jpg',
    href: `/listings/${listing.slug.current}`,
  }
}

function padWithSeeds<T extends { id: string }>(real: T[], seeds: T[], target: number): T[] {
  if (real.length >= target) return real.slice(0, target)
  const taken = new Set(real.map((r) => r.id))
  const padding = seeds.filter((s) => !taken.has(s.id)).slice(0, target - real.length)
  return [...real, ...padding]
}

async function fetchSanityEvents(): Promise<SeedEvent[]> {
  try {
    const query = `*[_type == "fitnessEvent" && status == "published" && defined(slug.current) && startDate > now()] | order(featured desc, startDate asc) [0...${FEATURED_EVENT_COUNT}] {
      _id,
      title,
      slug,
      startDate,
      "isFree": coalesce(isFree, false),
      "featured": coalesce(featured, false),
      price,
      "pricing": pricing[] { price, currency },
      "location": location { venueName, city, island },
      "featuredImage": featuredImage.asset->url,
      _createdAt
    }`
    const events: SanityEvent[] = await client.fetch(query)
    return events.map(mapEvent)
  } catch (err) {
    console.error('Failed to load Sanity events:', err)
    return []
  }
}

async function fetchUserEvents(): Promise<SeedEvent[]> {
  try {
    const collection = await getUserEventsCollection()
    const docs = await collection
      .find({ status: 'published', startDate: { $gt: new Date().toISOString() } } as any)
      .sort({ featured: -1, startDate: 1 })
      .limit(FEATURED_EVENT_COUNT)
      .toArray()

    return docs.map((doc, i): SeedEvent => {
      const tone = pickTagTone(i, doc.featured)
      const tier = doc.pricing?.[0]
      const currency = tier?.currency || 'BSD'
      const price = doc.isFree
        ? 'Free'
        : tier?.price != null
          ? `${currency} ${tier.price.toFixed(2)}`
          : 'TBA'
      return {
        id: doc._id?.toString() || doc.slug,
        title: doc.title,
        location: formatLocation(doc.location),
        date: formatEventDate(doc.startDate),
        price,
        tag: tone.tag,
        tagTone: tone.tagTone,
        image: '/images/seed2.jpg',
        href: `/events/${doc.slug}`,
      }
    })
  } catch (err) {
    console.error('Failed to load user events:', err)
    return []
  }
}

async function fetchSanityListings(): Promise<SeedListing[]> {
  try {
    const query = `*[_type == "fitnessListing" && status == "published" && defined(slug.current)] | order(featured desc, _createdAt desc) [0...${FEATURED_LISTING_COUNT}] {
      _id,
      title,
      slug,
      category,
      listingType,
      verified,
      totalReviews,
      rating,
      priceRange,
      "featuredImage": featuredImage.asset->url,
      "location": location { city, island }
    }`
    const listings: SanityListing[] = await client.fetch(query)
    return listings.map(mapListing)
  } catch (err) {
    console.error('Failed to load Sanity listings:', err)
    return []
  }
}

async function fetchUserListings(): Promise<SeedListing[]> {
  try {
    const collection = await getUserListingsCollection()
    const docs = await collection
      .find({ status: 'published' } as any)
      .sort({ featured: -1, createdAt: -1 })
      .limit(FEATURED_LISTING_COUNT)
      .toArray()

    return docs.map((doc): SeedListing => {
      const category = doc.category || doc.listingType || 'Listing'
      return {
        id: doc._id?.toString() || doc.slug,
        name: doc.title,
        category: category.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
        distance: '—',
        rating: 0,
        reviews: 0,
        priceLevel: '$$',
        verified: Boolean(doc.verified),
        image: '/images/seed6.jpg',
        href: `/listings/${doc.slug}`,
      }
    })
  } catch (err) {
    console.error('Failed to load user listings:', err)
    return []
  }
}

function dedupe<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>()
  return items.filter((i) => (seen.has(i.id) ? false : seen.add(i.id) && true))
}

export async function getHomepageEvents(): Promise<SeedEvent[]> {
  const [sanity, user] = await Promise.all([fetchSanityEvents(), fetchUserEvents()])
  const merged = dedupe([...user, ...sanity]).slice(0, FEATURED_EVENT_COUNT)
  return padWithSeeds(merged, seedEvents, FEATURED_EVENT_COUNT)
}

export async function getHomepageListings(): Promise<SeedListing[]> {
  const [sanity, user] = await Promise.all([fetchSanityListings(), fetchUserListings()])
  const merged = dedupe([...user, ...sanity]).slice(0, FEATURED_LISTING_COUNT)
  return padWithSeeds(merged, seedListings, FEATURED_LISTING_COUNT)
}

async function fetchSanityUpcomingCities(): Promise<string[]> {
  try {
    const query = `*[_type == "fitnessEvent" && status == "published" && defined(slug.current) && startDate > now() && defined(location.city)].location.city`
    const cities: string[] = await client.fetch(query)
    return cities
  } catch (err) {
    console.error('Failed to load Sanity event cities:', err)
    return []
  }
}

async function fetchUserUpcomingCities(): Promise<string[]> {
  try {
    const collection = await getUserEventsCollection()
    const docs = await collection
      .find({ status: 'published', startDate: { $gt: new Date().toISOString() } } as any)
      .toArray()
    return docs
      .map((doc) => doc.location?.city)
      .filter((city): city is string => typeof city === 'string')
  } catch (err) {
    console.error('Failed to load user event cities:', err)
    return []
  }
}

/**
 * Distinct cities that currently have upcoming events, used to power the
 * homepage "explore events & listings in …" selector. The city is the main
 * location differentiator, so we collapse on a case-insensitive trimmed key
 * while preserving the first-seen display spelling.
 */
export async function getUpcomingCities(): Promise<string[]> {
  const [sanity, user] = await Promise.all([
    fetchSanityUpcomingCities(),
    fetchUserUpcomingCities(),
  ])
  const seen = new Map<string, string>()
  for (const raw of [...user, ...sanity]) {
    const city = raw?.trim()
    if (!city) continue
    const key = city.toLowerCase()
    if (!seen.has(key)) seen.set(key, city)
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b))
}
