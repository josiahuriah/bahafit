import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { setFeaturedPost } from '@/lib/db/models/blogPost'

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { slug } = await req.json()
    if (!slug) {
      return NextResponse.json({ error: 'Post slug is required' }, { status: 400 })
    }

    await setFeaturedPost(slug)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to set featured post:', error)
    return NextResponse.json({ error: 'Failed to set featured post' }, { status: 500 })
  }
}
