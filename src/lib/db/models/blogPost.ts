import { Collection, ObjectId } from 'mongodb'
import { getDatabase } from '../mongodb'

export interface BlogPost {
  _id?: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage?: string
  category: string
  authorId: string
  authorName: string
  authorAvatar?: string
  featured: boolean
  likes: string[]
  views: number
  status: 'published' | 'draft'
  createdAt: Date
  updatedAt: Date
}

const COLLECTION_NAME = 'blogPosts'

async function getCollection(): Promise<Collection<BlogPost>> {
  const db = await getDatabase()
  return db.collection<BlogPost>(COLLECTION_NAME)
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function createBlogPost(data: {
  title: string
  content: string
  excerpt: string
  coverImage?: string
  category: string
  authorId: string
  authorName: string
  authorAvatar?: string
  status?: 'published' | 'draft'
}): Promise<BlogPost> {
  const collection = await getCollection()

  let slug = generateSlug(data.title)
  const existing = await collection.findOne({ slug })
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  const post: BlogPost = {
    title: data.title,
    slug,
    content: data.content,
    excerpt: data.excerpt,
    coverImage: data.coverImage || '',
    category: data.category,
    authorId: data.authorId,
    authorName: data.authorName,
    authorAvatar: data.authorAvatar || '',
    featured: false,
    likes: [],
    views: 0,
    status: data.status || 'published',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await collection.insertOne(post as any)

  return { ...post, _id: result.insertedId.toString() }
}

export async function getBlogPosts(filters?: {
  category?: string
  authorId?: string
  featured?: boolean
  status?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ posts: BlogPost[]; total: number }> {
  const collection = await getCollection()
  const query: any = {}

  if (filters?.category && filters.category !== 'All') {
    query.category = filters.category
  }

  if (filters?.authorId) {
    query.authorId = filters.authorId
  }

  if (filters?.featured) {
    query.featured = true
  }

  if (filters?.status) {
    query.status = filters.status
  } else {
    query.status = 'published'
  }

  if (filters?.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { excerpt: { $regex: filters.search, $options: 'i' } },
      { content: { $regex: filters.search, $options: 'i' } },
    ]
  }

  const page = filters?.page || 1
  const limit = filters?.limit || 12
  const skip = (page - 1) * limit

  const [posts, total] = await Promise.all([
    collection
      .find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    collection.countDocuments(query),
  ])

  return {
    posts: posts.map((p) => ({ ...p, _id: p._id?.toString() })),
    total,
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const collection = await getCollection()
  const post = await collection.findOne({ slug })
  if (!post) return null
  return { ...post, _id: post._id?.toString() }
}

export async function incrementViews(slug: string): Promise<void> {
  const collection = await getCollection()
  await collection.updateOne({ slug }, { $inc: { views: 1 } })
}

export async function toggleLike(slug: string, userId: string): Promise<{ liked: boolean; count: number }> {
  const collection = await getCollection()
  const post = await collection.findOne({ slug })
  if (!post) throw new Error('Post not found')

  const alreadyLiked = post.likes.includes(userId)

  if (alreadyLiked) {
    await collection.updateOne({ slug }, { $pull: { likes: userId } })
    return { liked: false, count: post.likes.length - 1 }
  } else {
    await collection.updateOne({ slug }, { $push: { likes: userId } })
    return { liked: true, count: post.likes.length + 1 }
  }
}

export async function updateBlogPost(
  slug: string,
  data: Partial<BlogPost>
): Promise<BlogPost | null> {
  const collection = await getCollection()
  const updateData = { ...data, updatedAt: new Date() }
  delete updateData._id
  delete updateData.slug

  const result = await collection.findOneAndUpdate(
    { slug },
    { $set: updateData },
    { returnDocument: 'after' }
  )
  if (!result) return null
  return { ...result, _id: result._id?.toString() }
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  const collection = await getCollection()
  const result = await collection.deleteOne({ slug })
  return result.deletedCount === 1
}

export async function setFeaturedPost(slug: string): Promise<void> {
  const collection = await getCollection()
  // Unfeature all posts first
  await collection.updateMany({}, { $set: { featured: false } })
  // Feature the selected post
  await collection.updateOne({ slug }, { $set: { featured: true } })
}

export async function getFeaturedPost(): Promise<BlogPost | null> {
  const collection = await getCollection()
  const post = await collection.findOne({ featured: true, status: 'published' })
  if (!post) return null
  return { ...post, _id: post._id?.toString() }
}
