#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../lib/data/products-with-european-pricing.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Backup
const backupPath = path.join(__dirname, `../lib/data/products-european-pricing-backup-fix-extensions-${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`✅ Backup criado: ${path.basename(backupPath)}\n`);

// Find tratamentos-capilares category
const cat = data.categories.find(c => c.id === 'tratamentos-capilares');

let fixed = 0;
cat.products.forEach(product => {
  const oldImage = product.image;
  const oldImages = JSON.stringify(product.images);

  // Fix image field - lowercase extensions
  if (product.image) {
    product.image = product.image.replace(/\.PNG$/, '.png')
                                 .replace(/\.WEBP$/, '.webp')
                                 .replace(/\.JPG$/, '.jpg');
  }

  // Fix images array
  if (product.images && Array.isArray(product.images)) {
    product.images = product.images.map(img =>
      img.replace(/\.PNG$/, '.png')
         .replace(/\.WEBP$/, '.webp')
         .replace(/\.JPG$/, '.jpg')
    );
  }

  if (oldImage !== product.image || oldImages !== JSON.stringify(product.images)) {
    console.log(`🔧 Corrigido: ${product.name}`);
    console.log(`   Antes: ${oldImage}`);
    console.log(`   Depois: ${product.image}\n`);
    fixed++;
  }
});

// Save
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ Total de produtos corrigidos: ${fixed}`);
console.log(`📝 Backup: ${path.basename(backupPath)}`);
