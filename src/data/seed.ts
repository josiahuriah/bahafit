// Seeded homepage content for events and listings.
// Images resolve from /public — seed1.jpg, seed2.jpg, … will be added later.

export type EventTagTone = 'trending' | 'popular' | 'new'

export interface SeedEvent {
  id: string
  title: string
  location: string
  date: string
  price: string
  tag: string
  tagTone: EventTagTone
  image: string
  href: string
}

export interface SeedListing {
  id: string
  name: string
  category: string
  distance: string
  rating: number
  reviews: number
  priceLevel: string
  verified: boolean
  image: string
  href: string
}

export const heroImage = '/seed1.jpg'

export const seedEvents: SeedEvent[] = [
  {
    id: 'sunrise-bootcamp',
    title: 'Sunrise Bootcamp',
    location: 'Nassau, Bahamas',
    date: 'May 25, 2026 · 7:00 AM',
    price: '$20.00',
    tag: 'Trending',
    tagTone: 'trending',
    image: '/seed2.jpg',
    href: '/events',
  },
  {
    id: 'bahamas-5k-run',
    title: 'Bahamas 5K Run',
    location: 'Paradise Island, Bahamas',
    date: 'Jun 8, 2026 · 6:30 AM',
    price: '$30.00',
    tag: 'Popular',
    tagTone: 'popular',
    image: '/seed3.jpg',
    href: '/events',
  },
  {
    id: 'beach-yoga-flow',
    title: 'Beach Yoga Flow',
    location: 'Cable Beach, Bahamas',
    date: 'Jun 15, 2026 · 8:00 AM',
    price: '$25.00',
    tag: 'New',
    tagTone: 'new',
    image: '/seed4.jpg',
    href: '/events',
  },
  {
    id: 'sunset-spin-ride',
    title: 'Sunset Spin Ride',
    location: 'Cable Beach, Bahamas',
    date: 'Jul 2, 2026 · 6:00 PM',
    price: '$18.00',
    tag: 'New',
    tagTone: 'new',
    image: '/seed5.jpg',
    href: '/events',
  },
]

export const seedListings: SeedListing[] = [
  {
    id: 'island-strength-gym',
    name: 'Island Strength Gym',
    category: 'Gym',
    distance: '1.2 mi',
    rating: 4.6,
    reviews: 120,
    priceLevel: '$$',
    verified: true,
    image: '/seed6.jpg',
    href: '/listings/gyms',
  },
  {
    id: 'fit-caribbean-trainer',
    name: 'Fit Caribbean Trainer',
    category: 'Personal Trainer',
    distance: '0.8 mi',
    rating: 4.9,
    reviews: 85,
    priceLevel: '$$$',
    verified: true,
    image: '/seed7.jpg',
    href: '/listings',
  },
  {
    id: 'zen-wellness-studio',
    name: 'Zen Wellness Studio',
    category: 'Wellness Studio',
    distance: '1.1 mi',
    rating: 4.7,
    reviews: 60,
    priceLevel: '$$',
    verified: true,
    image: '/seed8.jpg',
    href: '/listings/wellness',
  },
  {
    id: 'pure-nutrition-cafe',
    name: 'Pure Nutrition Cafe',
    category: 'Healthy Eats',
    distance: '0.6 mi',
    rating: 4.6,
    reviews: 40,
    priceLevel: '$$',
    verified: false,
    image: '/seed9.jpg',
    href: '/listings',
  },
]
