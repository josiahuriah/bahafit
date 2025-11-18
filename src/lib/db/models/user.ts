import { Collection, ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'
import { getDatabase } from '../mongodb'
import { User, UserRole } from '@/types/auth'

const COLLECTION_NAME = 'users'

export async function getUsersCollection(): Promise<Collection<User>> {
  const db = await getDatabase()
  return db.collection<User>(COLLECTION_NAME)
}

export async function createUser(data: {
  name: string
  email: string
  password: string
  role?: UserRole
}): Promise<User> {
  const collection = await getUsersCollection()

  // Check if user already exists
  const existingUser = await collection.findOne({ email: data.email })
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10)

  const user: User = {
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || 'user',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await collection.insertOne(user as any)

  return {
    ...user,
    _id: result.insertedId.toString(),
    password: undefined, // Don't return password
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const collection = await getUsersCollection()
  const user = await collection.findOne({ email })

  if (!user) return null

  return {
    ...user,
    _id: user._id?.toString(),
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const collection = await getUsersCollection()
  const user = await collection.findOne({ _id: new ObjectId(id) })

  if (!user) return null

  return {
    ...user,
    _id: user._id?.toString(),
    password: undefined, // Don't return password
  }
}

export async function updateUser(
  id: string,
  data: Partial<User>
): Promise<User | null> {
  const collection = await getUsersCollection()

  const updateData = {
    ...data,
    updatedAt: new Date(),
  }

  // Remove _id and password from update data if present
  delete updateData._id
  delete updateData.password

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: 'after' }
  )

  if (!result) return null

  return {
    ...result,
    _id: result._id?.toString(),
    password: undefined,
  }
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

export async function getAllUsers(filters?: {
  role?: UserRole
  isActive?: boolean
  search?: string
}): Promise<User[]> {
  const collection = await getUsersCollection()

  const query: any = {}

  if (filters?.role) {
    query.role = filters.role
  }

  if (filters?.isActive !== undefined) {
    query.isActive = filters.isActive
  }

  if (filters?.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } },
    ]
  }

  const users = await collection.find(query).sort({ createdAt: -1 }).toArray()

  return users.map(user => ({
    ...user,
    _id: user._id?.toString(),
    password: undefined,
  }))
}

export async function deleteUser(id: string): Promise<boolean> {
  const collection = await getUsersCollection()
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}

export async function updateUserRole(
  id: string,
  role: UserRole
): Promise<User | null> {
  return updateUser(id, { role })
}

export async function toggleUserStatus(id: string): Promise<User | null> {
  const user = await getUserById(id)
  if (!user) return null

  return updateUser(id, { isActive: !user.isActive })
}
