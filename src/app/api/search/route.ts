import { NextRequest, NextResponse } from 'next/server'
import type { Filter } from 'mongodb'
import { client } from '@/sanity/lib/client'
import { getUserEventsCollection, type UserEvent } from '@/lib/db/models/event'
import { getUserListingsCollection, type UserListing } from '@/lib/db/models/listing'
import { grossPrice } from '@/lib/utils'

// Unified, location-aware search across both events and listings, pulling from
// Sanity (published CMS content) and MongoDB (user-created content). Results are
// normalized into simple shapes the /search page can render directly.

export interface SearchEventResult {
  type: 'event'
  id: string
  title: string
  href: string
  image: string
  location: string
  date: string
  price: string
  category: string
}

export interface SearchListingResult {
  type: 'listing'
  id: string
  title: string
  href: string
  image: string
  location: string
  category: string
  verified: boolean
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function formatLocation(loc?: { venueName?: string; address?: string; city?: string; island?: string }): string {
  if (!loc) return 'Bahamas'
  const parts = [loc.venueName, loc.city, loc.island].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Bahamas'
}

function formatEventDate(iso?: string): string {
  if (!iso) return 'Date TBA'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return 'Date TBA'
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${date} · ${time}`
}

function formatEventPrice(isFree: boolean, pricing?: Array<{ price?: number; currency?: string }>): string {
  if (isFree) return 'Free'
  const tier = pricing?.[0]
  const currency = tier?.currency || 'BSD'
  if (tier?.price == null) return 'See pricing'
  return `${currency} ${grossPrice(tier.price).toFixed(2)}`
}

function humanize(value?: string): string {
  if (!value) return 'Listing'
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

interface SanityEventHit {
  _id: string
  title: string
  slug?: { current?: string }
  eventType?: string
  startDate?: string
  isFree?: boolean
  location?: { venueName?: string; city?: string; island?: string }
  pricing?: Array<{ price?: number; currency?: string }>
  featuredImage?: string
}

interface SanityListingHit {
  _id: string
  title: string
  slug?: { current?: string }
  listingType?: string
  category?: string
  verified?: boolean
  location?: { venueName?: string; city?: string; island?: string }
  featuredImage?: string
}

async function searchSanityEvents(match: string): Promise<SearchEventResult[]> {
  try {
    const query = `*[_type == "fitnessEvent" && status == "published" && defined(slug.current) && (
      title match $q ||
      shortDescription match $q ||
      description match $q ||
      eventType match $q ||
      location.venueName match $q ||
      location.address match $q ||
      location.city match $q ||
      location.island match $q ||
      tags[] match $q ||
      organizer->name match $q
    )] | order(startDate asc) [0...40] {
      _id,
      title,
      slug,
      eventType,
      startDate,
      "isFree": coalesce(isFree, false),
      "location": location { venueName, city, island },
      "pricing": pricing[] { price, currency },
      "featuredImage": featuredImage.asset->url
    }`
    const hits: SanityEventHit[] = await client.fetch(query, { q: match })
    return hits
      .filter((e) => e.slug?.current)
      .map((e) => ({
        type: 'event' as const,
        id: e._id,
        title: e.title,
        href: `/events/${e.slug!.current}`,
        image: e.featuredImage || '/images/seed2.jpg',
        location: formatLocation(e.location),
        date: formatEventDate(e.startDate),
        price: formatEventPrice(Boolean(e.isFree), e.pricing),
        category: humanize(e.eventType),
      }))
  } catch (err) {
    console.error('Sanity event search failed:', err)
    return []
  }
}

async function searchSanityListings(match: string): Promise<SearchListingResult[]> {
  try {
    const query = `*[_type == "fitnessListing" && status == "published" && defined(slug.current) && (
      title match $q ||
      shortDescription match $q ||
      description match $q ||
      listingType match $q ||
      category match $q ||
      location.venueName match $q ||
      location.address match $q ||
      location.city match $q ||
      location.island match $q ||
      tags[] match $q
    )] | order(featured desc, _createdAt desc) [0...40] {
      _id,
      title,
      slug,
      listingType,
      category,
      "verified": coalesce(verified, false),
      "location": location { venueName, city, island },
      "featuredImage": featuredImage.asset->url
    }`
    const hits: SanityListingHit[] = await client.fetch(query, { q: match })
    return hits
      .filter((l) => l.slug?.current)
      .map((l) => ({
        type: 'listing' as const,
        id: l._id,
        title: l.title,
        href: `/listings/${l.slug!.current}`,
        image: l.featuredImage || '/images/seed6.jpg',
        location: formatLocation(l.location),
        category: humanize(l.category || l.listingType),
        verified: Boolean(l.verified),
      }))
  } catch (err) {
    console.error('Sanity listing search failed:', err)
    return []
  }
}

async function searchUserEvents(regex: RegExp): Promise<SearchEventResult[]> {
  try {
    const collection = await getUserEventsCollection()
    const query: Filter<UserEvent> = {
      status: 'published',
      $or: [
        { title: regex },
        { shortDescription: regex },
        { eventType: regex },
        { 'location.venueName': regex },
        { 'location.address': regex },
        { 'location.city': regex },
        { 'location.island': regex },
        { 'location.country': regex },
      ],
    }
    const docs = await collection
      .find(query)
      .sort({ startDate: 1 })
      .limit(40)
      .toArray()

    return docs.map((doc) => ({
      type: 'event' as const,
      id: doc._id?.toString() || doc.slug,
      title: doc.title,
      href: `/events/${doc.slug}`,
      image: '/images/seed2.jpg',
      location: formatLocation(doc.location),
      date: formatEventDate(doc.startDate),
      price: formatEventPrice(Boolean(doc.isFree), doc.pricing),
      category: humanize(doc.eventType),
    }))
  } catch (err) {
    console.error('User event search failed:', err)
    return []
  }
}

async function searchUserListings(regex: RegExp): Promise<SearchListingResult[]> {
  try {
    const collection = await getUserListingsCollection()
    const query: Filter<UserListing> = {
      status: 'published',
      $or: [
        { title: regex },
        { shortDescription: regex },
        { listingType: regex },
        { category: regex },
        { 'location.venueName': regex },
        { 'location.address': regex },
        { 'location.city': regex },
        { 'location.island': regex },
        { 'location.country': regex },
        { serviceAreas: regex },
        { specializations: regex },
        { amenities: regex },
        { features: regex },
      ],
    }
    const docs = await collection
      .find(query)
      .sort({ featured: -1, createdAt: -1 })
      .limit(40)
      .toArray()

    return docs.map((doc) => ({
      type: 'listing' as const,
      id: doc._id?.toString() || doc.slug,
      title: doc.title,
      href: `/listings/${doc.slug}`,
      image: '/images/seed6.jpg',
      location: formatLocation(doc.location),
      category: humanize(doc.category || doc.listingType),
      verified: Boolean(doc.verified),
    }))
  } catch (err) {
    console.error('User listing search failed:', err)
    return []
  }
}

function dedupe<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>()
  return items.filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)))
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()

  if (!q) {
    return NextResponse.json({ events: [], listings: [], query: '' })
  }

  const match = `*${q}*`
  const regex = new RegExp(escapeRegex(q), 'i')

  const [sanityEvents, sanityListings, userEvents, userListings] = await Promise.all([
    searchSanityEvents(match),
    searchSanityListings(match),
    searchUserEvents(regex),
    searchUserListings(regex),
  ])

  const events = dedupe([...userEvents, ...sanityEvents])
  const listings = dedupe([...userListings, ...sanityListings])

  return NextResponse.json({ events, listings, query: q })
}
