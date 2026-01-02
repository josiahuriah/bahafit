import { NextRequest, NextResponse } from 'next/server'
import { auth, requireRole } from '@/lib/auth'
import { client } from '@/sanity/lib/client'

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
      "coOrganizers": coOrganizers[]->{_id, name, email},
      "approvedBy": approvedBy->{_id, name, email},
      "featuredImage": featuredImage.asset->url,
      "images": images[].asset->url
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

    // If approving, set approvedAt and approvedBy
    if (body.status === 'published' && !body.approvedAt) {
      updates.approvedAt = new Date().toISOString()
      // Note: approvedBy would need the Sanity user reference
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
