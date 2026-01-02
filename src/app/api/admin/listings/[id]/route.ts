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

    const query = `*[_type == "fitnessListing" && _id == $id][0] {
      ...,
      "owner": owner->{_id, name, email, userType, phone},
      "approvedBy": approvedBy->{_id, name, email},
      "featuredImage": featuredImage.asset->url,
      "images": images[].asset->url
    }`

    const listing = await client.fetch(query, { id })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    return NextResponse.json({ listing })
  } catch (error: any) {
    console.error('Failed to fetch listing:', error)

    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch listing' },
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

    const allowedFields = ['status', 'featured', 'verified', 'approvedAt']
    const updates: Record<string, any> = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    // If publishing, set approvedAt
    if (body.status === 'published' && !body.approvedAt) {
      updates.approvedAt = new Date().toISOString()
      updates.publishedAt = new Date().toISOString()
    }

    const result = await client
      .patch(id)
      .set(updates)
      .commit()

    return NextResponse.json({ listing: result })
  } catch (error: any) {
    console.error('Failed to update listing:', error)

    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update listing' },
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
    console.error('Failed to delete listing:', error)

    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
}
