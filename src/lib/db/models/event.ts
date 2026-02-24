import { Collection, ObjectId } from 'mongodb'
import { getDatabase } from '../mongodb'

export interface UserEvent {
  _id?: string
  userId: string
  userEmail: string
  userName: string

  // Core
  title: string
  slug: string
  eventType: string
  shortDescription?: string

  // Dates
  startDate: string
  endDate?: string
  isMultiDay?: boolean
  registrationDeadline?: string
  earlyBirdDeadline?: string

  // Location
  isVirtual: boolean
  virtualEventLink?: string
  location?: {
    venueName?: string
    address?: string
    city?: string
    island?: string
    country?: string
  }

  // Capacity & registration
  capacity?: number
  requiresRegistration: boolean

  // Pricing
  isFree: boolean
  pricing?: Array<{
    tierName: string
    description?: string
    price: number
    currency: string
    earlyBirdPrice?: number
    includes?: string[]
  }>

  // Details
  requirements?: string[]
  amenities?: string[]

  // Contact
  contactInfo?: {
    email?: string
    phone?: string
    whatsapp?: string
  }

  // Status
  status: 'draft' | 'published' | 'cancelled'
  featured: boolean

  createdAt: Date
  updatedAt: Date
}

const COLLECTION_NAME = 'user_events'

export async function getUserEventsCollection(): Promise<Collection<UserEvent>> {
  const db = await getDatabase()
  return db.collection<UserEvent>(COLLECTION_NAME)
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

export async function createUserEvent(
  data: Omit<UserEvent, '_id' | 'slug' | 'createdAt' | 'updatedAt'>
): Promise<UserEvent> {
  const collection = await getUserEventsCollection()

  const event: UserEvent = {
    ...data,
    slug: generateSlug(data.title),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await collection.insertOne(event as any)

  return {
    ...event,
    _id: result.insertedId.toString(),
  }
}

export async function getUserEventsByUser(userId: string): Promise<UserEvent[]> {
  const collection = await getUserEventsCollection()
  const events = await collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()

  return events.map((e) => ({ ...e, _id: e._id?.toString() }))
}

export async function getUserEventById(id: string): Promise<UserEvent | null> {
  const collection = await getUserEventsCollection()
  const event = await collection.findOne({ _id: new ObjectId(id) } as any)
  if (!event) return null
  return { ...event, _id: event._id?.toString() }
}

export async function updateUserEvent(
  id: string,
  userId: string,
  data: Partial<UserEvent>
): Promise<UserEvent | null> {
  const collection = await getUserEventsCollection()

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
