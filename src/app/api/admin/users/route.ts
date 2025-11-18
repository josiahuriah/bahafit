import { NextRequest, NextResponse } from 'next/server'
import { auth, requireRole } from '@/lib/auth'
import { getAllUsers } from '@/lib/db/models/user'
import { UserRole } from '@/types/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    // Only admins can access this endpoint
    await requireRole(session, ['admin'])

    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role') as UserRole | null
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search')

    const filters: any = {}

    if (role) {
      filters.role = role
    }

    if (isActive !== null) {
      filters.isActive = isActive === 'true'
    }

    if (search) {
      filters.search = search
    }

    const users = await getAllUsers(filters)

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('Failed to fetch users:', error)

    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
