import { NextRequest, NextResponse } from 'next/server'
import { auth, requireRole } from '@/lib/auth'
import { client } from '@/sanity/lib/client'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    await requireRole(session, ['admin'])

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const listingType = searchParams.get('listingType')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const verified = searchParams.get('verified')

    let filter = '_type == "fitnessListing"'
    const params: Record<string, string> = {}

    if (status && status !== 'all') {
      filter += ' && status == $status'
      params.status = status
    }

    if (listingType && listingType !== 'all') {
      filter += ' && listingType == $listingType'
      params.listingType = listingType
    }

    if (featured === 'true') {
      filter += ' && featured == true'
    }

    if (verified === 'true') {
      filter += ' && verified == true'
    }

    if (search) {
      filter += ' && (title match $search || shortDescription match $search)'
      params.search = `*${search}*`
    }

    const query = `*[${filter}] | order(_createdAt desc) {
      _id,
      title,
      slug,
      listingType,
      category,
      status,
      featured,
      verified,
      priceRange,
      hasPhysicalLocation,
      offersOnlineServices,
      "location": location.city,
      "island": location.island,
      "ownerName": owner->name,
      "ownerType": owner->userType,
      "featuredImage": featuredImage.asset->url,
      totalReviews,
      viewCount,
      _createdAt,
      _updatedAt
    }`

    const listings = await client.fetch(query, params)

    return NextResponse.json({ listings })
  } catch (error: any) {
    console.error('Failed to fetch listings:', error)

    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}
