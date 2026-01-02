import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const query = `*[_type == "fitnessListing" && slug.current == $slug && status == "published"][0] {
      _id,
      title,
      slug,
      listingType,
      category,
      description,
      shortDescription,
      hasPhysicalLocation,
      offersOnlineServices,
      location,
      serviceAreas,
      contact,
      socialLinks,
      operatingHours,
      byAppointmentOnly,
      priceRange,
      pricing,
      amenities,
      features,
      servicesOffered,
      classSchedule,
      specializations,
      certifications,
      "owner": owner->{
        _id,
        name,
        slug,
        "profileImage": profileImage.asset->url,
        userType,
        bio
      },
      faqs,
      policies,
      tags,
      verified,
      featured,
      averageRating,
      totalReviews,
      "featuredImage": featuredImage.asset->url,
      "images": images[].asset->url
    }`

    const listing = await client.fetch(query, { slug })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Fetch related listings (same type or category)
    const relatedQuery = `*[
      _type == "fitnessListing" &&
      status == "published" &&
      _id != $currentId &&
      (listingType == $listingType || category == $category)
    ] | order(_createdAt desc) [0...6] {
      _id,
      title,
      slug,
      listingType,
      "location": location.city,
      "featuredImage": featuredImage.asset->url,
      priceRange,
      averageRating,
      verified
    }`

    const relatedListings = await client.fetch(relatedQuery, {
      currentId: listing._id,
      listingType: listing.listingType,
      category: listing.category
    })

    // Increment view count (fire and forget)
    client
      .patch(listing._id)
      .setIfMissing({ viewCount: 0 })
      .inc({ viewCount: 1 })
      .commit()
      .catch(() => {}) // Ignore errors for view count

    return NextResponse.json({ listing, relatedListings })
  } catch (error: any) {
    console.error('Failed to fetch listing:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    )
  }
}
