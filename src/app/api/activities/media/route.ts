import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import { client } from '@/sanity/lib/client'

/**
 * Upload a photo or short video for a workout post.
 * Files are stored as Sanity assets and served from Sanity's CDN, so
 * media bandwidth doesn't count against Vercel data transfer.
 *
 * NOTE: Vercel serverless functions cap request bodies at ~4.5MB, so
 * that's the hard per-file limit here. Videos should be short clips.
 */

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']
const MAX_BYTES = 4 * 1024 * 1024 // 4MB — under Vercel's 4.5MB body limit

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    await requireAuth(session)

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const isImage = IMAGE_TYPES.includes(file.type)
    const isVideo = VIDEO_TYPES.includes(file.type)

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Unsupported file type. Photos: JPEG/PNG/GIF/WebP. Videos: MP4/MOV/WebM.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 4MB — try a shorter clip or smaller photo.' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const asset = isImage
      ? await client.assets.upload('image', buffer, { filename: file.name, contentType: file.type })
      : await client.assets.upload('file', buffer, { filename: file.name, contentType: file.type })

    return NextResponse.json({
      type: isImage ? 'image' : 'video',
      url: asset.url,
      assetId: asset._id,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    console.error('Failed to upload media:', error)
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 })
  }
}
