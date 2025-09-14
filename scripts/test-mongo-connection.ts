import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Testing MongoDB connection...');
  
  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // Test a simple query
    const result = await prisma.$runCommandRaw({
      ping: 1
    });
    console.log('✅ MongoDB ping successful:', result);
    
    // List existing collections
    const collections = await prisma.$runCommandRaw({
      listCollections: 1
    });
    console.log('📂 Existing collections:', collections);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  } finally {
    await prisma.$disconnect();
    console.log('📴 Disconnected from MongoDB');
  }
}

testConnection();