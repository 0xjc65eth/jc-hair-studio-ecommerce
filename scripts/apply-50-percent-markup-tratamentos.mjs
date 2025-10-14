#!/usr/bin/env node

/**
 * Apply 50% markup to all products in tratamentos-capilares category
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../lib/data/products-with-european-pricing.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('💰 Aplicando 50% markup aos produtos de tratamentos-capilares...\n');

// Find tratamentos-capilares category
const tratamentosCategory = data.categories.find(c => c.id === 'tratamentos-capilares');

if (!tratamentosCategory) {
  console.error('❌ Categoria tratamentos-capilares não encontrada!');
  process.exit(1);
}

const MARKUP = 1.50; // 50% markup

console.log(`📊 Total de produtos: ${tratamentosCategory.products.length}\n`);
console.log('Aplicando markup de 50%:\n');

tratamentosCategory.products.forEach((product, index) => {
  const oldBasePrice = product.pricing.basePrice;
  const oldOurPrice = product.pricing.ourPrice;
  const oldDiscountPrice = product.pricing.discountPrice;

  // Apply 50% markup to all prices
  const newBasePrice = Math.round(oldBasePrice * MARKUP * 100) / 100;
  const newOurPrice = Math.round(oldOurPrice * MARKUP * 100) / 100;
  const newDiscountPrice = Math.round(oldDiscountPrice * MARKUP * 100) / 100;

  // Calculate new savings
  const newSavings = Math.round((newBasePrice - newDiscountPrice) * 100) / 100;

  product.pricing.basePrice = newBasePrice;
  product.pricing.ourPrice = newOurPrice;
  product.pricing.discountPrice = newDiscountPrice;
  product.pricing.savings = newSavings;
  product.pricing.margin = "50%";
  product.pricing.competitive = "Markup 50% aplicado para margem premium";

  console.log(`${index + 1}. ${product.name}`);
  console.log(`   Marca: ${product.brand}`);
  console.log(`   Preço anterior: €${oldDiscountPrice.toFixed(2)}`);
  console.log(`   Preço novo: €${newDiscountPrice.toFixed(2)}`);
  console.log(`   Aumento: €${(newDiscountPrice - oldDiscountPrice).toFixed(2)} (+50%)\n`);
});

// Backup original file
const backupPath = jsonPath + '.backup-markup-' + Date.now();
fs.writeFileSync(backupPath, fs.readFileSync(jsonPath, 'utf8'));
console.log(`📦 Backup criado: ${path.basename(backupPath)}\n`);

// Write updated data
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
console.log(`✅ Arquivo atualizado: ${jsonPath}`);
console.log('\n✨ Markup de 50% aplicado com sucesso a todos os produtos!');
