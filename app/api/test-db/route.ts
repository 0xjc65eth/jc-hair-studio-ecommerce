import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGODB_URI = "mongodb+srv://juliocesar62:juliocesar65@jchaircluster.o078ehn.mongodb.net/jc-hair-studio-ecommerce?retryWrites=true&w=majority&appName=JCHairCluster";

export async function GET() {
  try {
    console.log('🔗 Testing MongoDB connection...');

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db('jc-hair-studio-ecommerce');

    // Test collections
    const collections = await db.listCollections().toArray();
    const referralCodesCount = await db.collection('referral_codes').countDocuments();
    const referralTiersCount = await db.collection('referral_tiers').countDocuments();
    const pointsTransactionsCount = await db.collection('points_transactions').countDocuments();

    await client.close();

    return NextResponse.json({
      status: 'success',
      message: 'MongoDB connection working',
      collections: collections.map(c => c.name),
      counts: {
        referralCodes: referralCodesCount,
        referralTiers: referralTiersCount,
        pointsTransactions: pointsTransactionsCount
      }
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);

    return NextResponse.json({
      status: 'error',
      message: 'MongoDB connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}