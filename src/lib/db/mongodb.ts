import { MongoClient, Db } from 'mongodb'

const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 10000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient> | null = null

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

export function getClientPromise(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MONGODB_URI to .env.local')
  }

  if (clientPromise) {
    return clientPromise
  }

  const uri = process.env.MONGODB_URI

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the connection
    // across hot reloads in Next.js
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    // In production mode, create a new client for each connection
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }

  return clientPromise
}

export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise()
  return client.db(process.env.MONGODB_DB || 'bahafit')
}
