#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../lib/data/products-with-european-pricing.json');
const backupPath = path.join(__dirname, `../lib/data/products-european-pricing-backup-${Date.now()}.json`);

console.log('🔧 Fixing Relaxamentos category...');

// Read JSON
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Create backup
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`✅ Backup created: ${path.basename(backupPath)}`);

let updatedCount = 0;

// Update all products in "relaxamentos" category
data.categories.forEach(cat => {
  if (cat.id === 'relaxamentos') {
    console.log(`\n📦 Found category: ${cat.name} with ${cat.products.length} products`);

    cat.products.forEach(product => {
      const oldCategory = product.category;
      product.category = 'Relaxamentos';

      if (oldCategory !== 'Relaxamentos') {
        console.log(`  ✓ ${product.id}: "${oldCategory}" → "Relaxamentos"`);
        updatedCount++;
      }
    });
  }
});

// Save updated JSON
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ Done! Updated ${updatedCount} products`);
console.log(`📝 Backup: ${path.basename(backupPath)}`);
