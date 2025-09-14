#!/usr/bin/env npx ts-node

/**
 * Cosmetics Products Seeder Script
 * JC Hair Studio's 62 E-commerce
 *
 * This script imports all cosmetic products from batches 2, 3, and 4 into the database
 * Run: npx ts-node scripts/seed-cosmetics.ts
 */

import { seedAllCosmeticsProducts } from '../lib/seeders/cosmetics-unified-seeder';

async function main() {
  console.log('🎨 Starting JC Hair Studio\'s 62 Cosmetics Import');
  console.log('=' .repeat(60));

  try {
    const startTime = Date.now();

    // Run the unified seeder
    const result = await seedAllCosmeticsProducts();

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log('=' .repeat(60));
    console.log('🎉 COSMETICS IMPORT COMPLETED SUCCESSFULLY!');
    console.log('=' .repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   Total products processed: ${result.total}`);
    console.log(`   Successfully imported: ${result.success}`);
    console.log(`   Errors encountered: ${result.errors}`);
    console.log(`   Categories created/updated: ${result.categories}`);
    console.log(`   Execution time: ${duration}s`);
    console.log('');
    console.log('✅ Your cosmetics catalog is now ready!');
    console.log('');
    console.log('🔗 Next steps:');
    console.log('   1. Visit http://localhost:3000/cosmeticos to see your products');
    console.log('   2. Test the category filtering at http://localhost:3000/categoria/cosmeticos');
    console.log('   3. Check individual product pages at http://localhost:3000/produto/[slug]');
    console.log('   4. Verify the navigation menu includes cosmetics properly');
    console.log('');
    console.log('🛒 Shopping features:');
    console.log('   • Real product data from 3 batches (Brazilian + International)');
    console.log('   • EUR pricing with professional markups');
    console.log('   • SEO-optimized product pages');
    console.log('   • Category filtering and search');
    console.log('   • Mobile-responsive design');
    console.log('   • Cart integration ready');
    console.log('');

    process.exit(0);

  } catch (error) {
    console.error('💥 Fatal error during cosmetics import:');
    console.error(error);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check your MongoDB connection');
    console.log('   2. Ensure Prisma schema is up to date');
    console.log('   3. Verify environment variables are set');
    console.log('   4. Run: npx prisma generate');
    console.log('   5. Run: npx prisma db push');

    process.exit(1);
  }
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the script
main();