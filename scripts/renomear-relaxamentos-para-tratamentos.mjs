#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../lib/data/products-with-european-pricing.json');
const backupPath = path.join(__dirname, `../lib/data/products-european-pricing-backup-${Date.now()}.json`);

console.log('🔄 Renomeando categoria "relaxamentos" → "tratamentos-capilares"...\n');

// Read JSON
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Create backup
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`✅ Backup criado: ${path.basename(backupPath)}\n`);

let categoryUpdated = false;
let productsUpdated = 0;

// 1. Renomear a categoria
data.categories = data.categories.map(cat => {
  if (cat.id === 'relaxamentos') {
    console.log(`📦 Renomeando categoria:`);
    console.log(`   ID: "${cat.id}" → "tratamentos-capilares"`);
    console.log(`   Nome: "${cat.name}" → "Tratamentos Capilares"`);

    categoryUpdated = true;

    // 2. Atualizar todos os produtos dentro da categoria
    cat.products.forEach(product => {
      const oldCategory = product.category;
      product.category = 'Tratamentos Capilares';

      if (oldCategory !== 'Tratamentos Capilares') {
        productsUpdated++;
      }
    });

    return {
      ...cat,
      id: 'tratamentos-capilares',
      name: 'Tratamentos Capilares',
      slug: 'tratamentos-capilares',
      description: 'Tratamentos capilares intensivos: hidratação, nutrição, reconstrução e controle de volume'
    };
  }
  return cat;
});

// Save updated JSON
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ Concluído!`);
console.log(`   Categoria renomeada: ${categoryUpdated ? 'Sim' : 'Não'}`);
console.log(`   Produtos atualizados: ${productsUpdated}`);
console.log(`\n📝 Backup: ${path.basename(backupPath)}`);
