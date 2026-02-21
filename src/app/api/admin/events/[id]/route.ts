import { NextRequest, NextResponse } from 'next/server'
import { auth, requireRole } from '@/lib/auth'
import { client } from '@/sanity/lib/client'

function generateSlug(title: string, id: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
  // Append short suffix from the document ID to ensure uniqueness
  const suffix = id.replace(/[^a-z0-9]/gi, '').slice(-6).toLowerCase()
  return `${base}-${suffix}`
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    await requireRole(session, ['admin'])

    const { id } = await params

    const query = `*[_type == "fitnessEvent" && _id == $id][0] {
      ...,
      "organizer": organizer->{_id, name, email, userType},
      "approvedBy": approvedBy->{_id, name, email},
      "featuredImage": featuredImage.asset->url
    }`

    const event = await client.fetch(query, { id })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ event })
  } catch (error: any) {
    console.error('Failed to fetch event:', error)

    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    await requireRole(session, ['admin'])

    const { id } = await params
    const body = await req.json()

    const allowedFields = ['status', 'featured', 'approvedAt']
    const updates: Record<string, any> = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    // When publishing, auto-generate slug (if not already set) and record approval timestamp
    if (body.status === 'published') {
      if (!body.approvedAt) {
        updates.approvedAt = new Date().toISOString()
      }

      // Fetch current event to check if slug already exists
      const current = await client.fetch(
        `*[_type == "fitnessEvent" && _id == $id][0]{ title, slug }`,
        { id }
      )

      if (current && !current.slug?.current) {
        updates.slug = { _type: 'slug', current: generateSlug(current.title, id) }
      }
    }

    const result = await client
      .patch(id)
      .set(updates)
      .commit()

    return NextResponse.json({ event: result })
  } catch (error: any) {
    console.error('Failed to update event:', error)

    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    await requireRole(session, ['admin'])

    const { id } = await params

    await client.delete(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to delete event:', error)

    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
