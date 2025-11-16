import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN // For write operations
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Example queries
export const queries = {
  // Get all published events
  allEvents: `*[_type in ['raceEvent', 'wellnessExpo', 'competition', 'fitnessChallenge'] && status == 'published'] | order(date asc)`,

  // Get event by ID
  eventById: `*[_id == $id][0]`,

  // Get events by type
  eventsByType: `*[_type == $type && status == 'published'] | order(date asc)`,

  // Get upcoming events
  upcomingEvents: `*[_type in ['raceEvent', 'wellnessExpo', 'competition', 'fitnessChallenge'] && status == 'published' && date > now()] | order(date asc)`,

  // Get all gyms
  allGyms: `*[_type == 'gym' && status == 'published'] | order(name asc)`,

  // Get featured listings
  featuredListings: `*[featured == true && status == 'published']`,

  // Search query
  search: `*[_type in ['raceEvent', 'wellnessExpo', 'competition', 'fitnessChallenge', 'gym', 'coach', 'wellnessCenter'] &&
    [name, title, description] match $query] | order(_score desc)`
}
