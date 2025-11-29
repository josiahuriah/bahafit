import { MongoClient, Db } from 'mongodb'

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient> | null = null

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise(): Promise<MongoClient> {
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

// Create a proxy that delays connection until actually needed
const clientPromiseProxy = new Proxy({} as Promise<MongoClient>, {
  get(target, prop) {
    const promise = getClientPromise()
    return (promise as any)[prop]
  },
  apply(target, thisArg, args) {
    const promise = getClientPromise()
    return (promise as any).apply(thisArg, args)
  }
})

export default clientPromiseProxy as Promise<MongoClient>

export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise()
  return client.db(process.env.MONGODB_DB || 'bahafit')
}
