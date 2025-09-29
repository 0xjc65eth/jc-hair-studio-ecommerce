#!/usr/bin/env node

/**
 * Script para remover produtos JC Hair Studio do sistema
 * ATENÇÃO: Execute um backup completo antes de usar este script!
 */

import { PrismaClient } from '../lib/generated/prisma';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

interface BackupData {
  timestamp: string;
  totalProducts: number;
  products: any[];
  relatedData: {
    cartItems: any[];
    wishlistItems: any[];
    reviews: any[];
  };
}

async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
    if (!uri) {
      throw new Error('MongoDB connection string not found');
    }
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function findJCProducts() {
  console.log('\n🔍 Searching for JC Hair Studio products...');

  const jcProducts = await prisma.product.findMany({
    where: {
      OR: [
        { brand: { contains: 'JC Hair Studio', mode: 'insensitive' } },
        { brand: { contains: 'JC', mode: 'insensitive' } },
        { name: { contains: 'JC Hair Studio', mode: 'insensitive' } },
        { name: { startsWith: 'JC:', mode: 'insensitive' } },
      ]
    }
  });

  console.log(`📦 Found ${jcProducts.length} JC Hair Studio products`);
  return jcProducts;
}

async function createBackup(products: any[]): Promise<BackupData> {
  console.log('\n💾 Creating backup...');

  const productIds = products.map(p => p.id);

  // Find related data
  const cartItems = await prisma.cartItem.findMany({
    where: { productId: { in: productIds } }
  });

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { productId: { in: productIds } }
  });

  const reviews = await prisma.review.findMany({
    where: { productId: { in: productIds } }
  });

  const backupData: BackupData = {
    timestamp: new Date().toISOString(),
    totalProducts: products.length,
    products: products,
    relatedData: {
      cartItems,
      wishlistItems,
      reviews
    }
  };

  // Save backup to file
  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupFile = path.join(backupDir, `jc-products-backup-${Date.now()}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));

  console.log(`✅ Backup saved to: ${backupFile}`);
  console.log(`   - Products: ${products.length}`);
  console.log(`   - Cart items: ${cartItems.length}`);
  console.log(`   - Wishlist items: ${wishlistItems.length}`);
  console.log(`   - Reviews: ${reviews.length}`);

  return backupData;
}

async function removeProducts(products: any[], dryRun = true) {
  if (dryRun) {
    console.log('\n🔍 DRY RUN MODE - No changes will be made');
  } else {
    console.log('\n⚠️  REMOVAL MODE - Products will be deleted');
  }

  const productIds = products.map(p => p.id);

  console.log('\n📋 Products to remove:');
  products.slice(0, 10).forEach(p => {
    console.log(`   - ${p.name} (${p.brand || 'No brand'}) - SKU: ${p.sku}`);
  });
  if (products.length > 10) {
    console.log(`   ... and ${products.length - 10} more`);
  }

  if (!dryRun) {
    console.log('\n🗑️  Removing related data...');

    // Remove from carts
    const cartResult = await prisma.cartItem.deleteMany({
      where: { productId: { in: productIds } }
    });
    console.log(`   ✅ Removed ${cartResult.count} cart items`);

    // Remove from wishlists
    const wishlistResult = await prisma.wishlistItem.deleteMany({
      where: { productId: { in: productIds } }
    });
    console.log(`   ✅ Removed ${wishlistResult.count} wishlist items`);

    // Remove reviews
    const reviewResult = await prisma.review.deleteMany({
      where: { productId: { in: productIds } }
    });
    console.log(`   ✅ Removed ${reviewResult.count} reviews`);

    // Remove products
    const productResult = await prisma.product.deleteMany({
      where: { id: { in: productIds } }
    });
    console.log(`   ✅ Removed ${productResult.count} products`);

    console.log('\n✅ All JC Hair Studio products have been removed');
  }
}

async function listProductImages(products: any[]) {
  console.log('\n🖼️  Associated images:');

  const imagePaths = new Set<string>();

  products.forEach(product => {
    // Check embedded images
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img: any) => {
        if (img.url) {
          imagePaths.add(img.url);
        }
      });
    }
  });

  console.log(`   Found ${imagePaths.size} unique image paths`);

  // Check if images exist in public folder
  const publicDir = path.join(process.cwd(), 'public');
  const existingImages: string[] = [];

  imagePaths.forEach(imgPath => {
    const fullPath = path.join(publicDir, imgPath.replace(/^\//, ''));
    if (fs.existsSync(fullPath)) {
      existingImages.push(fullPath);
    }
  });

  console.log(`   ${existingImages.length} images exist in public folder`);

  return Array.from(imagePaths);
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = !args.includes('--execute');
  const shouldRemoveImages = args.includes('--remove-images');

  console.log('========================================');
  console.log('JC Hair Studio Product Removal Tool');
  console.log('========================================');

  if (isDryRun) {
    console.log('🔍 Running in DRY RUN mode');
    console.log('   Add --execute flag to actually remove products');
  } else {
    console.log('⚠️  EXECUTE MODE - Products will be removed!');
    console.log('   Press Ctrl+C within 5 seconds to cancel...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  try {
    await connectDB();

    // Find JC products
    const products = await findJCProducts();

    if (products.length === 0) {
      console.log('\n✅ No JC Hair Studio products found');
      process.exit(0);
    }

    // Create backup
    const backup = await createBackup(products);

    // List images
    const images = await listProductImages(products);

    // Remove products
    await removeProducts(products, isDryRun);

    if (!isDryRun && shouldRemoveImages) {
      console.log('\n🗑️  Removing associated images...');
      // Image removal logic would go here
      console.log('   ⚠️  Image removal not implemented for safety');
    }

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await mongoose.disconnect();
  }
}

// Run the script
main().catch(console.error);