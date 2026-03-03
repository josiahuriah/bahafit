import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createBlogPost, getBlogPosts } from '@/lib/db/models/blogPost'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || undefined
    const featured = searchParams.get('featured') === 'true'
    const authorId = searchParams.get('authorId') || undefined
    const search = searchParams.get('search') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const result = await getBlogPosts({
      category,
      featured: featured || undefined,
      authorId,
      search,
      page,
      limit,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Failed to fetch blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, excerpt, coverImage, category, status } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      )
    }

    const post = await createBlogPost({
      title,
      content,
      excerpt: excerpt || content.replace(/<[^>]*>/g, '').slice(0, 160),
      coverImage,
      category,
      authorId: session.user.id,
      authorName: session.user.name,
      authorAvatar: session.user.image || '',
      status: status || 'published',
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create blog post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
