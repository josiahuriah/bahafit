import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { toggleLike } from '@/lib/db/models/blogPost'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const result = await toggleLike(slug, session.user.id)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Failed to toggle like:', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}
