import { NextRequest, NextResponse } from 'next/server'
import { auth, requireAuth } from '@/lib/auth'
import {
  getSanityWriteClient,
  MediaStorageConfigurationError,
} from '@/sanity/lib/writeClient'

/**
 * Upload a photo or short video for a workout post.
 * Files are stored as Sanity assets and served from Sanity's CDN, so
 * media bandwidth doesn't count against Vercel data transfer.
 *
 * NOTE: Vercel serverless functions cap request bodies at ~4.5MB, so
 * that's the hard per-file limit here. Videos should be short clips.
 */

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
const VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime', 'video/webm'])
const TYPES_BY_EXTENSION: Record<string, { type: string; kind: 'image' | 'video' }> = {
  jpg: { type: 'image/jpeg', kind: 'image' },
  jpeg: { type: 'image/jpeg', kind: 'image' },
  png: { type: 'image/png', kind: 'image' },
  gif: { type: 'image/gif', kind: 'image' },
  webp: { type: 'image/webp', kind: 'image' },
  mp4: { type: 'video/mp4', kind: 'video' },
  mov: { type: 'video/quicktime', kind: 'video' },
  webm: { type: 'video/webm', kind: 'video' },
}
const MAX_BYTES = 4 * 1024 * 1024 // 4MB — under Vercel's 4.5MB body limit

function getMediaDetails(file: File) {
  const declaredType = file.type.toLowerCase()
  if (IMAGE_TYPES.has(declaredType)) return { type: declaredType, kind: 'image' as const }
  if (VIDEO_TYPES.has(declaredType)) return { type: declaredType, kind: 'video' as const }

  // Some mobile browsers leave File.type blank. Only fall back to the extension
  // in that case; a conflicting, declared MIME type should still be rejected.
  if (!declaredType) {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    return TYPES_BY_EXTENSION[extension] ?? null
  }

  return null
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    await requireAuth(session)

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const mediaDetails = getMediaDetails(file)

    if (!mediaDetails) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use JPEG, PNG, GIF, WebP, MP4, MOV, or WebM. HEIC photos must be converted to JPEG first.' },
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
    const writeClient = getSanityWriteClient()

    const asset = mediaDetails.kind === 'image'
      ? await writeClient.assets.upload('image', buffer, { filename: file.name, contentType: mediaDetails.type })
      : await writeClient.assets.upload('file', buffer, { filename: file.name, contentType: mediaDetails.type })

    return NextResponse.json({
      type: mediaDetails.kind,
      url: asset.url,
      assetId: asset._id,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Unauthorized' || message === 'Account is inactive') {
      return NextResponse.json({ error: message }, { status: 401 })
    }

    if (error instanceof MediaStorageConfigurationError) {
      console.error('Media storage is not configured:', error.message)
      return NextResponse.json(
        { error: 'Media uploads are temporarily unavailable. Please contact support.' },
        { status: 503 }
      )
    }

    const statusCode =
      typeof error === 'object' && error !== null && 'statusCode' in error
        ? Number(error.statusCode)
        : undefined
    if (statusCode === 401 || statusCode === 403) {
      console.error('Sanity rejected the media upload:', error)
      return NextResponse.json(
        { error: 'Media storage is not configured correctly. Please contact support.' },
        { status: 503 }
      )
    }

    console.error('Failed to upload media:', error)
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 })
  }
}
