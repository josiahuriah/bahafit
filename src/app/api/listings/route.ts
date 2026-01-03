import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const listingType = searchParams.get('listingType')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const verified = searchParams.get('verified')
    const limit = searchParams.get('limit')

    let filter = '_type == "fitnessListing" && status == "published"'
    const params: Record<string, string> = {}

    if (listingType && listingType !== 'all') {
      filter += ' && listingType == $listingType'
      params.listingType = listingType
    }

    if (category && category !== 'all') {
      filter += ' && category == $category'
      params.category = category
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

    const limitClause = limit ? `[0...${limit}]` : ''

    const query = `*[${filter}] | order(_createdAt desc) ${limitClause} {
      _id,
      title,
      slug,
      listingType,
      category,
      shortDescription,
      priceRange,
      hasPhysicalLocation,
      offersOnlineServices,
      verified,
      featured,
      "location": location {
        city,
        island
      },
      "pricing": pricing[0] {
        name,
        price,
        currency,
        period
      },
      "featuredImage": featuredImage.asset->url,
      totalReviews,
      tags
    }`

    const listings = await client.fetch(query, params)

    // Get listing type counts for filters
    const typesQuery = `{
      "types": *[_type == "fitnessListing" && status == "published"] {
        listingType,
        category
      }
    }`
    const typesResult = await client.fetch(typesQuery)

    const listingTypeCounts = typesResult.types.reduce((acc: Record<string, number>, item: { listingType: string }) => {
      acc[item.listingType] = (acc[item.listingType] || 0) + 1
      return acc
    }, {})

    const categoryCounts = typesResult.types.reduce((acc: Record<string, number>, item: { category: string }) => {
      if (item.category) {
        acc[item.category] = (acc[item.category] || 0) + 1
      }
      return acc
    }, {})

    return NextResponse.json({ listings, listingTypeCounts, categoryCounts })
  } catch (error: any) {
    console.error('Failed to fetch listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}
