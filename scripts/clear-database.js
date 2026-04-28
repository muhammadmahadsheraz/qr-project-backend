const mongoose = require('mongoose');
require('dotenv').config();

const clearDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log('📭 Database is already empty');
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log('📋 Found collections:', collections.map(c => c.name).join(', '));
    console.log('\n🗑️  Deleting all data...\n');

    for (const collection of collections) {
      const result = await db.collection(collection.name).deleteMany({});
      console.log(`✅ Deleted ${result.deletedCount} documents from "${collection.name}"`);
    }

    console.log('\n✨ Database cleared successfully!');
    console.log('🎯 You can now test with fresh data\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    process.exit(1);
  }
};

clearDatabase();
