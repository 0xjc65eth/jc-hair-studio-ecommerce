#!/usr/bin/env node

// Test if tratamentosCapilaresProducts loads correctly from europeanPricingProducts

import { tratamentosCapilaresProducts } from '../lib/data/categories.ts';

console.log('🔍 Testing tratamentosCapilaresProducts loading...\n');

console.log(`Total de produtos: ${tratamentosCapilaresProducts.length}`);

const hairlifeProducts = tratamentosCapilaresProducts.filter(p => p.brand === 'HairLife');
console.log(`Produtos HairLife: ${hairlifeProducts.length}\n`);

console.log('Produtos HairLife:');
hairlifeProducts.forEach((p, i) => {
  console.log(`  ${i + 1}. ${p.name}`);
  console.log(`     Preço: €${p.price}`);
  console.log(`     Imagem: ${p.image}`);
});

console.log('\n✅ Teste concluído!');
