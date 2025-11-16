import { NextRequest, NextResponse } from 'next/server'
import { auth, requireRole } from '@/lib/auth'
import {
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  toggleUserStatus,
} from '@/lib/db/models/user'
import { UserRole } from '@/types/auth'

// GET /api/admin/users/:id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    await requireRole(session, ['admin'])

    const { id } = await params
    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Failed to fetch user:', error)

    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }

    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// PATCH /api/admin/users/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    await requireRole(session, ['admin'])

    const body = await req.json()
    const { id } = await params

    // Don't allow updating password through this endpoint
    delete body.password

    const user = await updateUser(id, body)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Failed to update user:', error)

    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }

    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE /api/admin/users/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    await requireRole(session, ['admin'])

    const { id } = await params

    // Don't allow deleting yourself
    if (session?.user?.id === id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    const success = await deleteUser(id)

    if (!success) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error: any) {
    console.error('Failed to delete user:', error)

    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }

    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
