import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import { addComment, getComments, deleteComment, getActivityById } from '@/lib/db/models/activity'

// GET /api/activities/:id/comments
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    await requireAuth(session)

    const { id } = await context.params
    const comments = await getComments(id)
    return NextResponse.json({ comments })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to fetch comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

// POST /api/activities/:id/comments  { text }
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const userId = user.id || user._id || ''

    const { id } = await context.params
    const body = await req.json()
    const text = typeof body.text === 'string' ? body.text.trim().slice(0, 1000) : ''

    if (!text) {
      return NextResponse.json({ error: 'Comment text is required' }, { status: 400 })
    }

    const activity = await getActivityById(id)
    if (!activity) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    const comment = await addComment({
      activityId: id,
      userId,
      userName: user.name,
      userImage: user.image ?? undefined,
      text,
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to add comment:', error)
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}

// DELETE /api/activities/:id/comments?commentId=
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const userId = user.id || user._id || ''

    const { searchParams } = new URL(req.url)
    const commentId = searchParams.get('commentId')
    if (!commentId) {
      return NextResponse.json({ error: 'commentId required' }, { status: 400 })
    }

    const ok = await deleteComment(commentId, userId, user.role === 'admin')
    if (!ok) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to delete comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
