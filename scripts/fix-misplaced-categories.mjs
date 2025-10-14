#!/usr/bin/env node

/**
 * Fix the 5 products in coloracao-capilar that have incorrect category field
 * Change their category from "Tratamentos Capilares" to "Coloração Capilar"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../lib/data/products-with-european-pricing.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const productsToFix = [
  'advanced-treatment-system-16',
  'intensive-repair-therapy-17',
  'professional-nutrition-complex-18',
  'ultra-hydration-therapy-19',
  'regenerative-treatment-premium-20'
];

console.log('🔧 Fixing misplaced product categories...\n');

// Find coloracao-capilar category
const coloracaoCategory = data.categories.find(c => c.id === 'coloracao-capilar');

if (!coloracaoCategory) {
  console.error('❌ Categoria coloracao-capilar não encontrada!');
  process.exit(1);
}

let fixedCount = 0;

coloracaoCategory.products.forEach(product => {
  if (productsToFix.includes(product.id)) {
    if (product.category === 'Tratamentos Capilares') {
      console.log(`✏️  Fixing ${product.id}:`);
      console.log(`   Old: "${product.category}"`);
      product.category = 'Coloração Capilar';
      console.log(`   New: "${product.category}"\n`);
      fixedCount++;
    }
  }
});

if (fixedCount > 0) {
  // Backup original file
  const backupPath = jsonPath + '.backup-' + Date.now();
  fs.writeFileSync(backupPath, fs.readFileSync(jsonPath, 'utf8'));
  console.log(`📦 Backup criado: ${path.basename(backupPath)}\n`);

  // Write updated data
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  console.log(`✅ Fixed ${fixedCount} products successfully!`);
  console.log(`📝 Updated: ${jsonPath}`);
} else {
  console.log('ℹ️  No products needed fixing.');
}
