import { Collection, ObjectId } from 'mongodb'
import { getDatabase } from '../mongodb'
import { Registration } from '@/types/auth'

const COLLECTION_NAME = 'registrations'

export async function getRegistrationsCollection(): Promise<Collection<Registration>> {
  const db = await getDatabase()
  return db.collection<Registration>(COLLECTION_NAME)
}

export async function createRegistration(
  data: Omit<Registration, '_id' | 'registeredAt'>
): Promise<Registration> {
  const collection = await getRegistrationsCollection()

  const registration: Registration = {
    ...data,
    registeredAt: new Date(),
  }

  const result = await collection.insertOne(registration as any)

  return {
    ...registration,
    _id: result.insertedId.toString(),
  }
}

export async function getRegistrationById(id: string): Promise<Registration | null> {
  const collection = await getRegistrationsCollection()
  const registration = await collection.findOne({ _id: new ObjectId(id) } as any)

  if (!registration) return null

  return {
    ...registration,
    _id: registration._id?.toString(),
  }
}

export async function getRegistrationsByEvent(eventId: string): Promise<Registration[]> {
  const collection = await getRegistrationsCollection()
  const registrations = await collection
    .find({ eventId })
    .sort({ registeredAt: -1 })
    .toArray()

  return registrations.map(reg => ({
    ...reg,
    _id: reg._id?.toString(),
  }))
}

export async function getRegistrationsByUser(userId: string): Promise<Registration[]> {
  const collection = await getRegistrationsCollection()
  const registrations = await collection
    .find({ userId })
    .sort({ registeredAt: -1 })
    .toArray()

  return registrations.map(reg => ({
    ...reg,
    _id: reg._id?.toString(),
  }))
}

export async function getAllRegistrations(filters?: {
  status?: Registration['status']
  paymentStatus?: Registration['paymentStatus']
  eventId?: string
}): Promise<Registration[]> {
  const collection = await getRegistrationsCollection()

  const query: any = {}

  if (filters?.status) {
    query.status = filters.status
  }

  if (filters?.paymentStatus) {
    query.paymentStatus = filters.paymentStatus
  }

  if (filters?.eventId) {
    query.eventId = filters.eventId
  }

  const registrations = await collection
    .find(query)
    .sort({ registeredAt: -1 })
    .toArray()

  return registrations.map(reg => ({
    ...reg,
    _id: reg._id?.toString(),
  }))
}

export async function updateRegistration(
  id: string,
  data: Partial<Registration>
): Promise<Registration | null> {
  const collection = await getRegistrationsCollection()

  const updateData = { ...data }
  delete updateData._id

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) } as any,
    { $set: updateData },
    { returnDocument: 'after' }
  )

  if (!result) return null

  return {
    ...result,
    _id: result._id?.toString(),
  }
}

export async function checkInRegistration(id: string): Promise<Registration | null> {
  return updateRegistration(id, {
    status: 'checked_in',
    checkedInAt: new Date(),
  })
}

export async function cancelRegistration(id: string): Promise<Registration | null> {
  return updateRegistration(id, {
    status: 'cancelled',
  })
}

export async function getRegistrationStats() {
  const collection = await getRegistrationsCollection()

  const [totalCount, statusStats, paymentStats] = await Promise.all([
    collection.countDocuments(),
    collection.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]).toArray(),
    collection.aggregate([
      { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
    ]).toArray(),
  ])

  return {
    total: totalCount,
    byStatus: Object.fromEntries(statusStats.map(s => [s._id, s.count])),
    byPayment: Object.fromEntries(paymentStats.map(p => [p._id, p.count])),
  }
}
