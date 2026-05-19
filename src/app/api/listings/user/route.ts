import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createUserListing, getUserListingsByUser } from '@/lib/db/models/listing'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const listings = await getUserListingsByUser(session.user.id)
    return NextResponse.json({ listings })
  } catch (error: any) {
    console.error('Failed to fetch user listings:', error)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      listingType,
      category,
      shortDescription,
      hasPhysicalLocation,
      offersOnlineServices,
      location,
      serviceAreas,
      contact,
      byAppointmentOnly,
      operatingHours,
      amenities,
      specializations,
      features,
    } = body

    if (!title || !listingType) {
      return NextResponse.json(
        { error: 'Title and listing type are required' },
        { status: 400 }
      )
    }

    const listing = await createUserListing({
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
      title,
      listingType,
      category,
      shortDescription,
      hasPhysicalLocation: hasPhysicalLocation ?? true,
      offersOnlineServices: offersOnlineServices ?? false,
      location,
      serviceAreas: serviceAreas || [],
      contact,
      byAppointmentOnly: byAppointmentOnly ?? false,
      operatingHours,
      amenities: amenities || [],
      specializations: specializations || [],
      features: features || [],
      status: 'published',
      featured: false,
      verified: false,
    })

    return NextResponse.json({ listing }, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create listing:', error)
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}
