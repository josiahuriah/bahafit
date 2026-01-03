/**
 * Debug User Script - Check what's stored in the database
 */

const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

const USER_EMAIL = 'josh.duncanson@gmail.com'

async function debugUser() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('Error: MONGODB_URI not found')
    process.exit(1)
  }

  console.log('MONGODB_URI:', uri.replace(/\/\/.*@/, '//***:***@')) // Hide credentials

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('\n✓ Connected to MongoDB\n')

    const db = client.db()
    console.log('Database name:', db.databaseName)

    // List all collections
    const collections = await db.listCollections().toArray()
    console.log('\nCollections:', collections.map(c => c.name).join(', '))

    // Check users collection
    const usersCollection = db.collection('users')
    const userCount = await usersCollection.countDocuments()
    console.log(`\nTotal users in 'users' collection: ${userCount}`)

    // Find the specific user
    const user = await usersCollection.findOne({ email: USER_EMAIL })

    if (user) {
      console.log('\n--- User Found ---')
      console.log('_id:', user._id)
      console.log('name:', user.name)
      console.log('email:', user.email)
      console.log('role:', user.role)
      console.log('isActive:', user.isActive)
      console.log('createdAt:', user.createdAt)
      console.log('updatedAt:', user.updatedAt)
      console.log('\nFull document:')
      console.log(JSON.stringify(user, null, 2))
    } else {
      console.log(`\n❌ No user found with email: ${USER_EMAIL}`)

      // Show all users
      console.log('\nAll users in database:')
      const allUsers = await usersCollection.find({}).toArray()
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (role: ${u.role})`)
      })
    }

    // Also check if there's a separate 'accounts' collection (NextAuth adapter)
    const accountsCollection = db.collection('accounts')
    const accountCount = await accountsCollection.countDocuments()
    console.log(`\nTotal accounts in 'accounts' collection: ${accountCount}`)

  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await client.close()
    console.log('\nDisconnected')
  }
}

debugUser()
