#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../lib/data/products-with-european-pricing.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const cat = data.categories.find(c => c.id === 'tratamentos-capilares');

console.log('Total de produtos no JSON:', cat.products.length);

const hairlife = cat.products.filter(p => p.brand === 'HairLife');
console.log('Produtos HairLife:', hairlife.length);

// Check for duplicates by ID
const idCounts = {};
cat.products.forEach(p => {
  idCounts[p.id] = (idCounts[p.id] || 0) + 1;
});

const duplicateIds = Object.entries(idCounts).filter(([id, count]) => count > 1);

if (duplicateIds.length > 0) {
  console.log('\n❌ Duplicados encontrados:');
  duplicateIds.forEach(([id, count]) => {
    const product = cat.products.find(p => p.id === id);
    console.log(`  ${id} (${count}x) - ${product.name}`);
  });
} else {
  console.log('\n✅ Nenhum duplicado encontrado');
}

// List all products
console.log('\n📋 Todos os produtos:');
cat.products.forEach((p, i) => {
  console.log(`${i + 1}. ${p.id} - ${p.name} (${p.brand})`);
});
