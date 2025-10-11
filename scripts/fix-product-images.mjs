#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../lib/data/products-with-european-pricing.json');

console.log('🔧 Fixing product images in products-with-european-pricing.json...\n');

// Read JSON file
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let fixedCount = 0;
let totalProducts = 0;

// Iterate through all categories and products
data.categories.forEach((category) => {
  category.products.forEach((product) => {
    totalProducts++;
    
    // If product has both 'image' and 'images' fields, remove 'image'
    if (product.image && product.images) {
      console.log(`❌ WRONG: Product "${product.id}" has both 'image' and 'images' fields`);
      console.log(`   'image': ${product.image}`);
      console.log(`   'images': ${product.images.join(', ')}`);
      
      // Keep 'images' array, remove 'image'
      delete product.image;
      fixedCount++;
      
      console.log(`✅ FIXED: Removed 'image' field, kept 'images' array\n`);
    }
    // If product only has 'image' but not 'images', convert to array
    else if (product.image && !product.images) {
      console.log(`⚠️  Product "${product.id}" only has 'image' field, converting to 'images' array`);
      product.images = [product.image];
      delete product.image;
      fixedCount++;
      console.log(`✅ FIXED: Converted to 'images' array\n`);
    }
  });
});

// Write back to file
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log('\n📊 SUMMARY:');
console.log(`   Total products: ${totalProducts}`);
console.log(`   Fixed products: ${fixedCount}`);
console.log(`   ✅ Done! File updated successfully.\n`);
