import { Collection, ObjectId } from 'mongodb'
import { getDatabase } from '../mongodb'

export interface UserListing {
  _id?: string
  userId: string
  userEmail: string
  userName: string

  // Core
  title: string
  slug: string
  listingType: string
  category?: string
  shortDescription?: string

  // Location
  hasPhysicalLocation: boolean
  offersOnlineServices: boolean
  location?: {
    venueName?: string
    address?: string
    city?: string
    island?: string
    country?: string
  }
  serviceAreas?: string[]

  // Contact
  contact?: {
    email?: string
    phone?: string
    whatsapp?: string
    website?: string
  }

  // Hours
  byAppointmentOnly: boolean
  operatingHours?: string

  // Details
  amenities?: string[]
  specializations?: string[]
  features?: string[]

  // Status
  status: 'draft' | 'pending' | 'published' | 'suspended' | 'archived'
  featured: boolean
  verified: boolean

  createdAt: Date
  updatedAt: Date
}

const COLLECTION_NAME = 'user_listings'

export async function getUserListingsCollection(): Promise<Collection<UserListing>> {
  const db = await getDatabase()
  return db.collection<UserListing>(COLLECTION_NAME)
}

function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() +
    '-' +
    Date.now().toString(36)
  )
}

export async function createUserListing(
  data: Omit<UserListing, '_id' | 'slug' | 'createdAt' | 'updatedAt'>
): Promise<UserListing> {
  const collection = await getUserListingsCollection()

  const listing: UserListing = {
    ...data,
    slug: generateSlug(data.title),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await collection.insertOne(listing as any)

  return {
    ...listing,
    _id: result.insertedId.toString(),
  }
}

export async function getUserListingsByUser(userId: string): Promise<UserListing[]> {
  const collection = await getUserListingsCollection()
  const listings = await collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()
  return listings.map((l) => ({ ...l, _id: l._id?.toString() }))
}

export async function getUserListingById(id: string): Promise<UserListing | null> {
  const collection = await getUserListingsCollection()
  const listing = await collection.findOne({ _id: new ObjectId(id) } as any)
  if (!listing) return null
  return { ...listing, _id: listing._id?.toString() }
}

export async function updateUserListing(
  id: string,
  userId: string,
  data: Partial<UserListing>
): Promise<UserListing | null> {
  const collection = await getUserListingsCollection()
  const updateData = { ...data, updatedAt: new Date() }
  delete updateData._id

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id), userId } as any,
    { $set: updateData },
    { returnDocument: 'after' }
  )

  if (!result) return null
  return { ...result, _id: result._id?.toString() }
}
