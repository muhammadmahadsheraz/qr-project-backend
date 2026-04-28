const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...\n');
console.log('Connection String:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));
console.log('');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log('✅ Database is reachable');
    console.log('✅ Credentials are correct');
    console.log('\n🎉 You can now run your application!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed\n');
    console.error('Error:', error.message);
    console.error('\n📋 Troubleshooting Steps:');
    console.error('1. Go to MongoDB Atlas → Network Access');
    console.error('2. Click "ADD IP ADDRESS"');
    console.error('3. Click "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)');
    console.error('4. Wait 1-2 minutes');
    console.error('5. Run this test again: node test-connection.js');
    console.error('\n📖 See MONGODB_SETUP.md for detailed instructions');
    process.exit(1);
  });
