#!/usr/bin/env tsx

import { getAllAvailableProducts } from '../../lib/services/productResolver';
import { amazonMarketplaceService } from '../../lib/amazon/marketplace-service';
import { AmazonProductMapper } from '../../lib/amazon/product-mapper';

interface SyncOptions {
  dryRun?: boolean;
  category?: string;
  limit?: number;
  validateOnly?: boolean;
}

async function syncProductsToAmazon(options: SyncOptions = {}) {
  console.log('🚀 JC Hair Studio - Amazon Marketplace Sync');
  console.log('=' .repeat(50));

  try {
    // Get all available products from the system
    const allProducts = getAllAvailableProducts();

    // Filter products by category if specified
    let productsToSync = allProducts;

    if (options.category) {
      productsToSync = allProducts.filter(p =>
        p.category?.includes(options.category || '')
      );
      console.log(`📂 Filtering by category: ${options.category}`);
    }

    if (options.limit) {
      productsToSync = productsToSync.slice(0, options.limit);
      console.log(`📊 Limiting to ${options.limit} products`);
    }

    console.log(`📦 Total products to process: ${productsToSync.length}`);
    console.log('');

    // Validate products
    console.log('🔍 Validating products for Amazon requirements...');
    const { validProducts, invalidProducts } = amazonMarketplaceService.prepareProductsForSync(productsToSync);

    console.log(`✅ Valid products: ${validProducts.length}`);
    console.log(`❌ Invalid products: ${invalidProducts.length}`);
    console.log('');

    // Show validation results
    if (invalidProducts.length > 0) {
      console.log('❌ INVALID PRODUCTS:');
      invalidProducts.forEach(({ product, errors }) => {
        console.log(`  • ${product.name} (${product.id})`);
        errors.forEach(error => console.log(`    - ${error}`));
      });
      console.log('');
    }

    if (options.validateOnly) {
      console.log('✅ Validation complete (validate-only mode)');
      return;
    }

    if (validProducts.length === 0) {
      console.log('⚠️  No valid products to sync');
      return;
    }

    // Show sample of what will be synced
    console.log('📋 SAMPLE PRODUCT MAPPING:');
    const sampleProduct = validProducts[0];
    const amazonListing = AmazonProductMapper.mapProductToAmazonListing(sampleProduct);
    console.log(`  Product: ${sampleProduct.name}`);
    console.log(`  Amazon SKU: ${amazonListing.sku}`);
    console.log(`  Category: ${amazonListing.attributes.product_category[0].value}`);
    console.log(`  Price: R$ ${amazonListing.attributes.list_price[0].Amount}`);
    console.log('');

    if (options.dryRun) {
      console.log('🔄 DRY RUN - No actual sync performed');
      console.log('Products that would be synced:');
      validProducts.forEach(p => {
        console.log(`  • ${p.name} (${p.id}) - R$ ${p.price}`);
      });
      return;
    }

    // Perform actual sync
    console.log('🔄 Starting sync to Amazon Marketplace...');

    // Test connection first
    console.log('🔗 Testing Amazon connection...');
    const status = await amazonMarketplaceService.getMarketplaceStatus();

    if (!status.connected) {
      console.error('❌ Failed to connect to Amazon:', status.error);
      console.log('');
      console.log('📝 To configure Amazon credentials:');
      console.log('1. Set environment variables in .env:');
      console.log('   AMAZON_CLIENT_ID=your_client_id');
      console.log('   AMAZON_CLIENT_SECRET=your_client_secret');
      console.log('   AMAZON_REFRESH_TOKEN=your_refresh_token');
      console.log('   AMAZON_ACCESS_KEY_ID=your_access_key');
      console.log('   AMAZON_SECRET_ACCESS_KEY=your_secret_key');
      console.log('   AMAZON_ROLE=your_role_arn');
      console.log('   AMAZON_SELLER_ID=your_seller_id');
      return;
    }

    console.log('✅ Amazon connection successful');
    console.log('');

    // Sync products
    const productSyncResult = await amazonMarketplaceService.syncProducts(validProducts);

    if (productSyncResult.success) {
      console.log('✅ Product sync completed successfully!');
      console.log(`📦 Products processed: ${productSyncResult.processed}`);
      if (productSyncResult.feedId) {
        console.log(`🆔 Feed ID: ${productSyncResult.feedId}`);
      }
    } else {
      console.log('❌ Product sync failed:');
      productSyncResult.errors.forEach(error => console.log(`  • ${error}`));
    }

    console.log('');

    // Sync inventory
    console.log('📊 Syncing inventory...');
    const inventorySyncResult = await amazonMarketplaceService.syncInventory(validProducts);

    if (inventorySyncResult.success) {
      console.log('✅ Inventory sync completed successfully!');
      console.log(`📦 Products processed: ${inventorySyncResult.processed}`);
      if (inventorySyncResult.feedId) {
        console.log(`🆔 Feed ID: ${inventorySyncResult.feedId}`);
      }
    } else {
      console.log('❌ Inventory sync failed:');
      inventorySyncResult.errors.forEach(error => console.log(`  • ${error}`));
    }

    console.log('');
    console.log('🎉 Amazon sync process completed!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Monitor feed processing status in Amazon Seller Central');
    console.log('2. Check for any product approval requirements');
    console.log('3. Set up automated inventory sync');

  } catch (error) {
    console.error('💥 Sync failed:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: SyncOptions = {};

args.forEach(arg => {
  if (arg === '--dry-run') options.dryRun = true;
  if (arg === '--validate-only') options.validateOnly = true;
  if (arg.startsWith('--category=')) options.category = arg.split('=')[1];
  if (arg.startsWith('--limit=')) options.limit = parseInt(arg.split('=')[1]);
});

// Show help
if (args.includes('--help') || args.includes('-h')) {
  console.log('🚀 JC Hair Studio - Amazon Marketplace Sync');
  console.log('');
  console.log('Usage: npx tsx scripts/amazon/sync-to-amazon.ts [options]');
  console.log('');
  console.log('Options:');
  console.log('  --dry-run          Show what would be synced without actually syncing');
  console.log('  --validate-only    Only validate products, don\'t sync');
  console.log('  --category=NAME    Only sync products from specific category');
  console.log('  --limit=N          Limit to N products');
  console.log('  --help, -h         Show this help');
  console.log('');
  console.log('Examples:');
  console.log('  npx tsx scripts/amazon/sync-to-amazon.ts --dry-run');
  console.log('  npx tsx scripts/amazon/sync-to-amazon.ts --category=mega-hair --limit=10');
  console.log('  npx tsx scripts/amazon/sync-to-amazon.ts --validate-only');
  process.exit(0);
}

// Run the sync
syncProductsToAmazon(options);