const mongoose = require('mongoose');
require('dotenv').config();

const dropDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const dbName = mongoose.connection.db.databaseName;
    console.log('🗄️  Database name:', dbName);
    console.log('\n⚠️  WARNING: This will DROP the entire database!');
    console.log('⏳ Proceeding in 3 seconds...\n');

    await new Promise(resolve => setTimeout(resolve, 3000));

    await mongoose.connection.db.dropDatabase();
    
    console.log('✅ Database dropped successfully!');
    console.log('🎯 All collections and data have been removed\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error dropping database:', error.message);
    process.exit(1);
  }
};

dropDatabase();
