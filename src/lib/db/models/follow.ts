import { Collection } from 'mongodb'
import { getDatabase } from '../mongodb'

export interface Follow {
  _id?: string
  followerId: string
  followingId: string
  createdAt: Date
}

const COLLECTION = 'follows'

export async function getFollowsCollection(): Promise<Collection<Follow>> {
  const db = await getDatabase()
  return db.collection<Follow>(COLLECTION)
}

export async function followUser(followerId: string, followingId: string): Promise<boolean> {
  if (followerId === followingId) return false
  const collection = await getFollowsCollection()
  await collection.updateOne(
    { followerId, followingId },
    { $setOnInsert: { followerId, followingId, createdAt: new Date() } },
    { upsert: true }
  )
  return true
}

export async function unfollowUser(followerId: string, followingId: string): Promise<boolean> {
  const collection = await getFollowsCollection()
  const result = await collection.deleteOne({ followerId, followingId })
  return result.deletedCount === 1
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const collection = await getFollowsCollection()
  const doc = await collection.findOne({ followerId, followingId })
  return !!doc
}

/** IDs of everyone `userId` follows. */
export async function getFollowingIds(userId: string): Promise<string[]> {
  const collection = await getFollowsCollection()
  const docs = await collection.find({ followerId: userId }).project({ followingId: 1 }).limit(5000).toArray()
  return docs.map((d) => d.followingId as string)
}

export async function getFollowerIds(userId: string): Promise<string[]> {
  const collection = await getFollowsCollection()
  const docs = await collection.find({ followingId: userId }).project({ followerId: 1 }).limit(5000).toArray()
  return docs.map((d) => d.followerId as string)
}

export async function getFollowCounts(userId: string): Promise<{ followers: number; following: number }> {
  const collection = await getFollowsCollection()
  const [followers, following] = await Promise.all([
    collection.countDocuments({ followingId: userId }),
    collection.countDocuments({ followerId: userId }),
  ])
  return { followers, following }
}
