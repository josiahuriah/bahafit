// Test MongoDB connection
// Usage: node scripts/test-mongo-connection.js

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('Error: MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  console.log('Testing MongoDB connection...');
  console.log('Connection string format:', uri.substring(0, 20) + '...' + uri.substring(uri.lastIndexOf('@')));

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Successfully connected to MongoDB!');

    const db = client.db(process.env.MONGODB_DB || 'bahafit');
    const collections = await db.listCollections().toArray();

    console.log(`Database "${db.databaseName}" is accessible`);
    console.log(`Collections: ${collections.length > 0 ? collections.map(c => c.name).join(', ') : 'none yet'}`);

  } catch (error) {
    console.error('Connection failed:', error.message);

    if (error.message.includes('bad auth')) {
      console.log('\nTroubleshooting tips:');
      console.log('1. Check your username and password in MongoDB Atlas > Database Access');
      console.log('2. Make sure special characters in password are URL-encoded');
      console.log('3. Verify the user has "Read and write to any database" permissions');
    }

    process.exit(1);
  } finally {
    await client.close();
  }
}

testConnection();
