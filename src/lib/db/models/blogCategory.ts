import { Collection, ObjectId } from 'mongodb'
import { getDatabase } from '../mongodb'

export interface BlogCategory {
  _id?: string
  name: string
  slug: string
  createdAt: Date
}

const COLLECTION_NAME = 'blogCategories'

async function getCollection(): Promise<Collection<BlogCategory>> {
  const db = await getDatabase()
  return db.collection<BlogCategory>(COLLECTION_NAME)
}

export async function seedDefaultCategories(): Promise<void> {
  const collection = await getCollection()
  const count = await collection.countDocuments()
  if (count > 0) return

  const defaults = [
    { name: 'Fitness Tips', slug: 'fitness-tips', createdAt: new Date() },
    { name: 'Wellness', slug: 'wellness', createdAt: new Date() },
    { name: 'Nutrition', slug: 'nutrition', createdAt: new Date() },
    { name: 'Equipment', slug: 'equipment', createdAt: new Date() },
    { name: 'Community', slug: 'community', createdAt: new Date() },
  ]

  await collection.insertMany(defaults as any)
}

export async function getAllCategories(): Promise<BlogCategory[]> {
  const collection = await getCollection()
  await seedDefaultCategories()
  const categories = await collection.find().sort({ name: 1 }).toArray()
  return categories.map((c) => ({ ...c, _id: c._id?.toString() }))
}

export async function createCategory(name: string): Promise<BlogCategory> {
  const collection = await getCollection()

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')

  const existing = await collection.findOne({ slug })
  if (existing) throw new Error('Category already exists')

  const category: BlogCategory = {
    name,
    slug,
    createdAt: new Date(),
  }

  const result = await collection.insertOne(category as any)
  return { ...category, _id: result.insertedId.toString() }
}

export async function deleteCategory(id: string): Promise<boolean> {
  const collection = await getCollection()
  const result = await collection.deleteOne({ _id: new ObjectId(id) } as any)
  return result.deletedCount === 1
}
