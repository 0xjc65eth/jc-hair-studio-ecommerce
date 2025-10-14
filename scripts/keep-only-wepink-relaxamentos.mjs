#!/usr/bin/env node

/**
 * Remove all products from tratamentos-capilares except:
 * - WePink products (use wepink-tratamentos images)
 * - HairLife Relaxamentos
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../lib/data/products-with-european-pricing.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('🔧 Filtrando produtos em tratamentos-capilares...\n');

// Find tratamentos-capilares category
const tratamentosCategory = data.categories.find(c => c.id === 'tratamentos-capilares');

if (!tratamentosCategory) {
  console.error('❌ Categoria tratamentos-capilares não encontrada!');
  process.exit(1);
}

const originalCount = tratamentosCategory.products.length;
console.log(`📊 Produtos originais: ${originalCount}\n`);

// WePink products (use wepink-tratamentos images)
const wepinkIds = [
  'oleo-capilar-7',
  'creme-leave-in-8',
  'tonico-crescimento-10'
];

// HairLife Relaxamentos
const relaxamentosIds = [
  'hairlife-super-cachos-solto-natural',
  'hairlife-liso-laminado-bondplex',
  'hairlife-cacho-natural-relaxamento-ondulamento',
  'hairlife-liso-natural-creme-alisamento',
  'hairlife-relaxin-natural-creme-relaxamento',
  'hairlife-mel-amendoas-sem-amonia',
  'hairlife-relaxin-natural-girassol',
  'hairlife-cacho-natural-encacheamento'
];

// Keep only WePink and Relaxamentos
const productsToKeep = [...wepinkIds, ...relaxamentosIds];

console.log('✅ Mantendo:');
console.log(`   • ${wepinkIds.length} produtos WePink`);
console.log(`   • ${relaxamentosIds.length} produtos HairLife Relaxamentos`);
console.log(`   • Total: ${productsToKeep.length} produtos\n`);

// Filter products
const filteredProducts = tratamentosCategory.products.filter(p => productsToKeep.includes(p.id));
const removedProducts = tratamentosCategory.products.filter(p => !productsToKeep.includes(p.id));

console.log('❌ Removendo:');
removedProducts.forEach(p => {
  console.log(`   • ${p.id} - ${p.name} (${p.brand})`);
});

// Update category
tratamentosCategory.products = filteredProducts;

console.log(`\n📊 Resultado:`);
console.log(`   • Produtos removidos: ${removedProducts.length}`);
console.log(`   • Produtos mantidos: ${filteredProducts.length}`);

// Backup original file
const backupPath = jsonPath + '.backup-wepink-' + Date.now();
fs.writeFileSync(backupPath, fs.readFileSync(jsonPath, 'utf8'));
console.log(`\n📦 Backup criado: ${path.basename(backupPath)}`);

// Write updated data
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
console.log(`✅ Arquivo atualizado: ${jsonPath}`);

console.log('\n✨ Concluído! Apenas produtos WePink e Relaxamentos permanecem.');
