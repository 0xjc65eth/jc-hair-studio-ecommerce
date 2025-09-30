import { MongoClient } from 'mongodb'

const MONGODB_URI = "mongodb+srv://juliocesar62:juliocesar65@jchaircluster.o078ehn.mongodb.net/jc-hair-studio-ecommerce?retryWrites=true&w=majority&appName=JCHairCluster"

const referralTiersData = [
  {
    name: 'Iniciante',
    description: 'Para quem está começando a indicar',
    minReferrals: 0,
    minTotalSales: 0,
    referrerRewardBonus: 0,
    refereeRewardBonus: 0,
    cashbackMultiplier: 1.0,
    freeShipping: false,
    prioritySupport: false,
    exclusiveProducts: false,
    badgeIcon: '🥉',
    badgeColor: '#CD7F32',
    displayOrder: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Bronze',
    description: 'Para indicadores ativos',
    minReferrals: 3,
    minTotalSales: 150,
    referrerRewardBonus: 0.02, // +2% bonus
    refereeRewardBonus: 0.01, // +1% bonus
    cashbackMultiplier: 1.1,
    freeShipping: false,
    prioritySupport: false,
    exclusiveProducts: false,
    badgeIcon: '🥉',
    badgeColor: '#CD7F32',
    displayOrder: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Prata',
    description: 'Para grandes indicadores',
    minReferrals: 10,
    minTotalSales: 500,
    referrerRewardBonus: 0.05, // +5% bonus
    refereeRewardBonus: 0.025, // +2.5% bonus
    cashbackMultiplier: 1.25,
    freeShipping: true,
    prioritySupport: false,
    exclusiveProducts: false,
    badgeIcon: '🥈',
    badgeColor: '#C0C0C0',
    displayOrder: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Ouro',
    description: 'Para embaixadores da marca',
    minReferrals: 25,
    minTotalSales: 1500,
    referrerRewardBonus: 0.08, // +8% bonus
    refereeRewardBonus: 0.04, // +4% bonus
    cashbackMultiplier: 1.5,
    freeShipping: true,
    prioritySupport: true,
    exclusiveProducts: true,
    badgeIcon: '🥇',
    badgeColor: '#FFD700',
    displayOrder: 4,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Platina',
    description: 'Para parceiros exclusivos',
    minReferrals: 50,
    minTotalSales: 3000,
    referrerRewardBonus: 0.12, // +12% bonus
    refereeRewardBonus: 0.06, // +6% bonus
    cashbackMultiplier: 1.75,
    freeShipping: true,
    prioritySupport: true,
    exclusiveProducts: true,
    badgeIcon: '💎',
    badgeColor: '#E5E4E2',
    displayOrder: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Diamante',
    description: 'Elite dos indicadores',
    minReferrals: 100,
    minTotalSales: 6000,
    referrerRewardBonus: 0.15, // +15% bonus
    refereeRewardBonus: 0.08, // +8% bonus
    cashbackMultiplier: 2.0,
    freeShipping: true,
    prioritySupport: true,
    exclusiveProducts: true,
    badgeIcon: '💎',
    badgeColor: '#B9F2FF',
    displayOrder: 6,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedReferralTiers() {
  console.log('🎯 Seeding referral tiers...')

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db('jc-hair-studio-ecommerce')
    const collection = db.collection('referral_tiers')

    // Clear existing tiers
    await collection.deleteMany({})
    console.log('🗑️ Cleared existing referral tiers')

    // Insert new tiers
    const result = await collection.insertMany(referralTiersData)
    console.log(`✅ Created ${result.insertedCount} referral tiers`)

    // Display created tiers
    const tiers = await collection.find({}).sort({ displayOrder: 1 }).toArray()

    console.log('\n📊 Referral Tiers Created:')
    tiers.forEach(tier => {
      console.log(`  ${tier.badgeIcon} ${tier.name}:`)
      console.log(`    - Min Referrals: ${tier.minReferrals}`)
      console.log(`    - Min Sales: €${tier.minTotalSales}`)
      console.log(`    - Referrer Bonus: +${(tier.referrerRewardBonus * 100).toFixed(1)}%`)
      console.log(`    - Referee Bonus: +${(tier.refereeRewardBonus * 100).toFixed(1)}%`)
      console.log(`    - Cashback Multiplier: ${tier.cashbackMultiplier}x`)
      console.log(`    - Benefits: ${[
        tier.freeShipping && 'Free Shipping',
        tier.prioritySupport && 'Priority Support',
        tier.exclusiveProducts && 'Exclusive Products'
      ].filter(Boolean).join(', ') || 'None'}`)
      console.log()
    })

    return tiers

  } catch (error) {
    console.error('❌ Error seeding referral tiers:', error)
    throw error
  } finally {
    await client.close()
    console.log('📦 Database connection closed')
  }
}

// Run seed if called directly
if (require.main === module) {
  seedReferralTiers()
    .then(() => {
      console.log('✅ Referral tiers seed completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Referral tiers seed failed:', error)
      process.exit(1)
    })
}

export { seedReferralTiers }