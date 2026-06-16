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

export const heroImage = '/images/hero.png'

export const seedEvents: SeedEvent[] = [
  {
    id: 'sunrise-bootcamp',
    title: 'Sunrise Bootcamp',
    location: 'Nassau, Bahamas',
    date: 'May 25, 2026 · 7:00 AM',
    price: '$20.00',
    tag: 'Trending',
    tagTone: 'trending',
    image: '/images/seed2.jpg',
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
    image: '/images/seed3.jpg',
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
    image: '/images/seed4.jpg',
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
    image: '/images/seed5.jpg',
    href: '/events',
  },
  {
    id: 'island-hiit-challenge',
    title: 'Island HIIT Challenge',
    location: 'Exuma, Bahamas',
    date: 'Jul 12, 2026 · 9:00 AM',
    price: '$22.00',
    tag: 'Trending',
    tagTone: 'trending',
    image: '/images/seed2.jpg',
    href: '/events',
  },
  {
    id: 'reef-swim-meet',
    title: 'Reef Swim Meet',
    location: 'Grand Bahama',
    date: 'Jul 20, 2026 · 7:30 AM',
    price: '$15.00',
    tag: 'Popular',
    tagTone: 'popular',
    image: '/images/seed3.jpg',
    href: '/events',
  },
  {
    id: 'beachfront-pilates',
    title: 'Beachfront Pilates',
    location: 'Eleuthera, Bahamas',
    date: 'Aug 3, 2026 · 8:30 AM',
    price: '$28.00',
    tag: 'New',
    tagTone: 'new',
    image: '/images/seed4.jpg',
    href: '/events',
  },
  {
    id: 'coastal-trail-race',
    title: 'Coastal Trail Race',
    location: 'Andros, Bahamas',
    date: 'Aug 15, 2026 · 6:00 AM',
    price: '$35.00',
    tag: 'Trending',
    tagTone: 'trending',
    image: '/images/seed5.jpg',
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
    image: '/images/seed6.jpg',
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
    image: '/images/seed7.jpg',
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
    image: '/images/seed8.jpg',
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
    image: '/images/seed9.jpg',
    href: '/listings',
  },
  {
    id: 'coral-crossfit',
    name: 'Coral CrossFit',
    category: 'Gym',
    distance: '2.0 mi',
    rating: 4.8,
    reviews: 95,
    priceLevel: '$$$',
    verified: true,
    image: '/images/seed6.jpg',
    href: '/listings/gyms',
  },
  {
    id: 'palm-yoga-collective',
    name: 'Palm Yoga Collective',
    category: 'Yoga Studio',
    distance: '0.4 mi',
    rating: 4.9,
    reviews: 152,
    priceLevel: '$$',
    verified: true,
    image: '/images/seed8.jpg',
    href: '/listings/wellness',
  },
  {
    id: 'atlantic-running-club',
    name: 'Atlantic Running Club',
    category: 'Run Club',
    distance: '1.5 mi',
    rating: 4.7,
    reviews: 78,
    priceLevel: '$',
    verified: false,
    image: '/images/seed7.jpg',
    href: '/listings/clubs',
  },
  {
    id: 'salt-smoothie-bar',
    name: 'Salt Smoothie Bar',
    category: 'Healthy Eats',
    distance: '0.9 mi',
    rating: 4.5,
    reviews: 64,
    priceLevel: '$',
    verified: true,
    image: '/images/seed9.jpg',
    href: '/listings',
  },
]
