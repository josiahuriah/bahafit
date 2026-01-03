/**
 * Password Reset Script
 *
 * Usage: node scripts/reset-password.js
 *
 * Make sure to set your MONGODB_URI in .env.local
 */

const bcrypt = require('bcryptjs')
const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

// ============================================
// CONFIGURE THESE VALUES
// ============================================
const USER_EMAIL = 'josh.duncanson@gmail.com'  
const NEW_PASSWORD = 'past@Monkey4' 
// ============================================

async function resetPassword() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('Error: MONGODB_URI not found in .env.local')
    process.exit(1)
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db() // Uses database from connection string
    const usersCollection = db.collection('users')

    // Find the user
    const user = await usersCollection.findOne({ email: USER_EMAIL })

    if (!user) {
      console.error(`Error: No user found with email: ${USER_EMAIL}`)
      process.exit(1)
    }

    console.log(`Found user: ${user.name} (${user.email})`)

    // Hash the new password
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10)

    // Update the password
    const result = await usersCollection.updateOne(
      { email: USER_EMAIL },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    )

    if (result.modifiedCount === 1) {
      console.log('\n✅ Password updated successfully!')
      console.log(`   Email: ${USER_EMAIL}`)
      console.log(`   New Password: ${NEW_PASSWORD}`)
      console.log('\nYou can now log in with your new password.')
    } else {
      console.error('Failed to update password')
    }

  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await client.close()
    console.log('\nDisconnected from MongoDB')
  }
}

resetPassword()
