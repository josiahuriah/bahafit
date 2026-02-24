import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getRegistrationsByUser } from '@/lib/db/models/registration'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const registrations = await getRegistrationsByUser(session.user.id)

    return NextResponse.json({ registrations })
  } catch (error: any) {
    console.error('Failed to fetch user registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}
