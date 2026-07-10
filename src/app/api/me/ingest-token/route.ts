import { NextResponse } from 'next/server'
import { createHash, randomBytes } from 'crypto'
import { auth, requireAuth } from '@/lib/auth'
import { getUsersCollection } from '@/lib/db/models/user'
import { ObjectId } from 'mongodb'

/**
 * Personal ingest token for the Apple Shortcuts integration.
 * The token is shown ONCE at generation; only its SHA-256 hash is stored.
 */

// GET — do I have a token?
export async function GET() {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const users = await getUsersCollection()
    const doc = await users.findOne(
      { _id: new ObjectId(user.id || user._id) } as never,
      { projection: { ingestTokenHash: 1 } }
    )
    return NextResponse.json({ hasToken: !!(doc as { ingestTokenHash?: string } | null)?.ingestTokenHash })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

// POST — generate (or rotate) the token
export async function POST() {
  try {
    const session = await auth()
    const user = await requireAuth(session)

    const token = `bfit_${randomBytes(24).toString('hex')}`
    const hash = createHash('sha256').update(token).digest('hex')

    const users = await getUsersCollection()
    await users.updateOne(
      { _id: new ObjectId(user.id || user._id) } as never,
      { $set: { ingestTokenHash: hash, updatedAt: new Date() } }
    )

    return NextResponse.json({ token })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to generate ingest token:', error)
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 })
  }
}

// DELETE — revoke
export async function DELETE() {
  try {
    const session = await auth()
    const user = await requireAuth(session)
    const users = await getUsersCollection()
    await users.updateOne(
      { _id: new ObjectId(user.id || user._id) } as never,
      { $unset: { ingestTokenHash: '' } }
    )
    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to revoke token' }, { status: 500 })
  }
}
