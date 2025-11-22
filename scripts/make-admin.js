// Script to promote a user to admin role
// Usage: node scripts/make-admin.js your-email@example.com

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function makeAdmin(email) {
  if (!email) {
    console.error('❌ Please provide an email address');
    console.log('Usage: node scripts/make-admin.js your-email@example.com');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db(process.env.MONGODB_DB || 'bahafit');
    const users = db.collection('users');

    // Find the user
    const user = await users.findOne({ email });

    if (!user) {
      console.error(`❌ User not found with email: ${email}`);
      process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user.email})`);
    console.log(`Current role: ${user.role}`);

    // Update to admin
    const result = await users.updateOne(
      { email },
      { $set: { role: 'admin', updatedAt: new Date() } }
    );

    if (result.modifiedCount === 1) {
      console.log('✓ Successfully updated user to admin role!');
      console.log(`\nYou can now access the admin dashboard at:`);
      console.log(`http://localhost:3000/admin`);
    } else {
      console.log('⚠️  User was already an admin');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Get email from command line arguments
const email = process.argv[2];
makeAdmin(email);
