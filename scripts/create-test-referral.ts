import { MongoClient } from 'mongodb';

const MONGODB_URI = "mongodb+srv://juliocesar62:juliocesar65@jchaircluster.o078ehn.mongodb.net/jc-hair-studio-ecommerce?retryWrites=true&w=majority&appName=JCHairCluster";
const DB_NAME = "jc-hair-studio-ecommerce";

const TEST_USER_ID = 'test-user-1';
const TEST_USER_EMAIL = 'juliocesarurss62@gmail.com';

async function createTestReferralData() {
  console.log('🎯 Creating test referral data...');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);

    // 1. Create a referral code for the test user
    const referralCodesCollection = db.collection('referral_codes');
    const existingCode = await referralCodesCollection.findOne({ referrerId: TEST_USER_ID });

    let referralCode;
    if (existingCode) {
      console.log(`📋 Using existing referral code: ${existingCode.code}`);
      referralCode = existingCode;
    } else {
      referralCode = {
        code: 'JULIO2024',
        referrerId: TEST_USER_ID,
        referrerRewardType: 'PERCENTAGE',
        referrerRewardValue: 0.05, // 5%
        refereeRewardType: 'PERCENTAGE',
        refereeRewardValue: 0.10, // 10%
        maxUses: 100,
        currentUses: 0,
        isActive: true,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await referralCodesCollection.insertOne(referralCode);
      console.log(`✅ Created referral code: ${referralCode.code}`);
    }

    // 2. Create or update user referral stats
    const userStatsCollection = db.collection('user_referral_stats');
    const existingStats = await userStatsCollection.findOne({ userId: TEST_USER_ID });

    let userStats;
    if (existingStats) {
      console.log('📊 Using existing user stats');
      userStats = existingStats;
    } else {
      userStats = {
        userId: TEST_USER_ID,
        totalReferrals: 0,
        successfulReferrals: 0,
        totalReferralSales: 0,
        totalEarnings: 0,
        availableCashback: 0,
        tierLevel: 'Iniciante',
        tierProgress: 0,
        nextTierRequirements: {
          minReferrals: 3,
          minSales: 150,
          currentReferrals: 0,
          currentSales: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await userStatsCollection.insertOne(userStats);
      console.log('✅ Created user referral stats');
    }

    // 3. Add some sample points transactions
    const pointsTransactionsCollection = db.collection('points_transactions');
    const existingTransactions = await pointsTransactionsCollection.find({ userId: TEST_USER_ID }).toArray();

    if (existingTransactions.length === 0) {
      const transactions = [
        {
          userId: TEST_USER_ID,
          type: 'EARNED',
          points: 500,
          description: 'Pontos de boas-vindas',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          userId: TEST_USER_ID,
          type: 'EARNED',
          points: 250,
          description: 'Compra de produtos - €50.00',
          orderId: 'order_123',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          userId: TEST_USER_ID,
          type: 'BONUS',
          points: 100,
          description: 'Bônus de primeira compra',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      await pointsTransactionsCollection.insertMany(transactions);
      console.log('✅ Created sample points transactions (850 points total)');
    } else {
      console.log(`📊 Found ${existingTransactions.length} existing transactions`);
    }

    // 4. Display summary
    console.log('\n📊 Test User Summary:');
    console.log(`User ID: ${TEST_USER_ID}`);
    console.log(`Email: ${TEST_USER_EMAIL}`);
    console.log(`Referral Code: ${referralCode.code}`);
    console.log(`Tier: ${userStats.tierLevel}`);
    console.log(`Total Referrals: ${userStats.totalReferrals}`);
    console.log(`Available Cashback: €${userStats.availableCashback}`);

    const totalPoints = await pointsTransactionsCollection.aggregate([
      {
        $match: {
          userId: TEST_USER_ID,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$points' }
        }
      }
    ]).toArray();

    console.log('\nPoints Summary:');
    totalPoints.forEach(p => {
      console.log(`${p._id}: ${p.total} points`);
    });

    const overallTotal = totalPoints.reduce((sum, p) => {
      return sum + (p._id === 'REDEEMED' ? -p.total : p.total);
    }, 0);
    console.log(`Total Available: ${overallTotal} points`);

    console.log('\n🎉 Test referral data created successfully!');
    console.log('\n🔗 Test the system:');
    console.log('1. Login with Google at http://localhost:3001/auth/signin');
    console.log('2. Visit http://localhost:3001/conta/referrals');
    console.log('3. Visit http://localhost:3001/conta/pontos');
    console.log(`4. Test referral link: http://localhost:3001/ref/${referralCode.code}`);

  } catch (error) {
    console.error('❌ Error creating test referral data:', error);
    throw error;
  } finally {
    await client.close();
    console.log('📦 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  createTestReferralData()
    .then(() => {
      console.log('✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { createTestReferralData };