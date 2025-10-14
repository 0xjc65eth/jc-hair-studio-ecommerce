#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../lib/data/products-with-european-pricing.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const cat = data.categories.find(c => c.id === 'tratamentos-capilares');

console.log('Verificando imagens dos 24 produtos:\n');

let missing = 0;
let found = 0;

cat.products.forEach((p, index) => {
  const img = p.image || (p.images && p.images[0]);
  const fullPath = path.join(__dirname, '../public', img);
  const exists = fs.existsSync(fullPath);

  if (!exists) {
    console.log(`❌ ${index + 1}. ${p.name} (${p.brand})`);
    console.log(`   Path: ${img}`);
    console.log(`   Full: ${fullPath}\n`);
    missing++;
  } else {
    found++;
  }
});

console.log(`\n📊 Resumo:`);
console.log(`   ✅ Imagens encontradas: ${found}`);
console.log(`   ❌ Imagens faltando: ${missing}`);
