import { MongoClient, Db } from 'mongodb'

const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 10000,
}

let client: MongoClient | undefined

declare global {
  var _mongoClient: MongoClient | undefined
}

export function getMongoClient(): MongoClient {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MONGODB_URI to .env.local')
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the connection
    // across hot reloads in Next.js
    if (!global._mongoClient) {
      global._mongoClient = new MongoClient(process.env.MONGODB_URI, options)
    }
    return global._mongoClient
  }

  // Reuse the client while a production server instance remains warm. The
  // MongoDB driver connects lazily when the first operation is executed.
  client ??= new MongoClient(process.env.MONGODB_URI, options)
  return client
}

export async function getDatabase(): Promise<Db> {
  return getMongoClient().db(process.env.MONGODB_DB || 'bahafit')
}
