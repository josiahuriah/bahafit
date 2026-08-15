import 'server-only'

import { createClient } from '@sanity/client'

export class MediaStorageConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MediaStorageConfigurationError'
  }
}

export function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_API_TOKEN

  const missing = [
    !projectId && 'NEXT_PUBLIC_SANITY_PROJECT_ID',
    !dataset && 'NEXT_PUBLIC_SANITY_DATASET',
    !token && 'SANITY_API_TOKEN',
  ].filter(Boolean)

  if (!projectId || !dataset || !token) {
    throw new MediaStorageConfigurationError(
      `Missing media storage configuration: ${missing.join(', ')}`
    )
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  })
}
