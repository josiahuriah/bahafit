import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { getUserEventsCollection } from '@/lib/db/models/event'

/**
 * Normalized shape consumed by the shared <EventCalendar /> component. Both
 * Sanity-managed events and user-created (MongoDB) events are reduced to this
 * so the calendar can render every upcoming, registerable event in one grid.
 */
export interface CalendarEvent {
  _id: string
  title: string
  slug: string
  eventType?: string
  startDate: string
  endDate?: string
  isFree: boolean
  isVirtual: boolean
  city?: string
  island?: string
  venueName?: string
  price?: number | null
  currency?: string
  capacity?: number | null
  currentRegistrations?: number
  featuredImage?: string | null
}

type PricingTier = { price?: number; earlyBirdPrice?: number; currency?: string }

// The cheapest listed tier price (pre-fees) so the calendar can show a
// "From $X" hint. Free events and events without pricing return null.
function lowestTier(pricing?: PricingTier[]): { price: number | null; currency: string } {
  if (!pricing || pricing.length === 0) return { price: null, currency: 'BSD' }
  let best: { price: number; currency: string } | null = null
  for (const tier of pricing) {
    const p = tier.earlyBirdPrice ?? tier.price
    if (typeof p !== 'number') continue
    if (!best || p < best.price) best = { price: p, currency: tier.currency || 'BSD' }
  }
  return best ?? { price: null, currency: 'BSD' }
}

async function fetchSanityEvents(): Promise<CalendarEvent[]> {
  try {
    const query = `*[_type == "fitnessEvent" && status == "published" && defined(slug.current) && startDate > now()] | order(startDate asc) [0...150] {
      _id,
      title,
      "slug": slug.current,
      eventType,
      startDate,
      endDate,
      "isVirtual": coalesce(isVirtual, false),
      "isFree": coalesce(isFree, false),
      "city": location.city,
      "island": location.island,
      "venueName": location.venueName,
      capacity,
      "currentRegistrations": coalesce(currentRegistrations, 0),
      "pricing": pricing[] { price, earlyBirdPrice, currency },
      "featuredImage": featuredImage.asset->url
    }`
    const rows: Array<Record<string, unknown>> = await client.fetch(query)
    return rows.map((e) => {
      const tier = lowestTier(e.pricing as PricingTier[] | undefined)
      return {
        _id: String(e._id),
        title: String(e.title),
        slug: String(e.slug),
        eventType: e.eventType as string | undefined,
        startDate: String(e.startDate),
        endDate: e.endDate as string | undefined,
        isFree: Boolean(e.isFree),
        isVirtual: Boolean(e.isVirtual),
        city: e.city as string | undefined,
        island: e.island as string | undefined,
        venueName: e.venueName as string | undefined,
        price: e.isFree ? null : tier.price,
        currency: tier.currency,
        capacity: (e.capacity as number | undefined) ?? null,
        currentRegistrations: (e.currentRegistrations as number | undefined) ?? 0,
        featuredImage: (e.featuredImage as string | undefined) ?? null,
      }
    })
  } catch (err) {
    console.error('Calendar: failed to load Sanity events:', err)
    return []
  }
}

async function fetchUserEvents(): Promise<CalendarEvent[]> {
  try {
    const collection = await getUserEventsCollection()
    const docs = await collection
      .find({ status: 'published', startDate: { $gt: new Date().toISOString() } } as never)
      .sort({ startDate: 1 })
      .limit(150)
      .toArray()

    return docs.map((doc): CalendarEvent => {
      const tier = lowestTier(doc.pricing as PricingTier[] | undefined)
      return {
        _id: doc._id?.toString() || doc.slug,
        title: doc.title,
        slug: doc.slug,
        eventType: doc.eventType,
        startDate: doc.startDate,
        endDate: doc.endDate,
        isFree: Boolean(doc.isFree),
        isVirtual: Boolean(doc.isVirtual),
        city: doc.location?.city,
        island: doc.location?.island,
        venueName: doc.location?.venueName,
        price: doc.isFree ? null : tier.price,
        currency: tier.currency,
        capacity: doc.capacity ?? null,
        currentRegistrations: 0,
        featuredImage: null,
      }
    })
  } catch (err) {
    console.error('Calendar: failed to load user events:', err)
    return []
  }
}

export async function GET() {
  const [sanity, user] = await Promise.all([fetchSanityEvents(), fetchUserEvents()])

  // Merge both sources, drop duplicate slugs, and keep the calendar ordered
  // by start date so day cells fill chronologically.
  const seen = new Set<string>()
  const events = [...user, ...sanity]
    .filter((e) => {
      if (!e.slug || seen.has(e.slug)) return false
      seen.add(e.slug)
      return true
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  return NextResponse.json({ events })
}
