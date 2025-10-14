#!/usr/bin/env node

/**
 * List all WePink and Relaxamentos products in tratamentos-capilares
 */

import { tratamentosCapilaresProducts } from '../lib/data/categories.ts';

console.log('🔍 Produtos em Tratamentos Capilares:\n');
console.log(`Total: ${tratamentosCapilaresProducts.length} produtos\n`);

// Group by type
const wepink = tratamentosCapilaresProducts.filter(p =>
  p.image && p.image.includes('wepink-tratamentos')
);
const relaxamentos = tratamentosCapilaresProducts.filter(p =>
  p.brand === 'HairLife' && p.subcategory === 'Relaxamentos'
);

console.log('🔹 Produtos WePink (3):');
wepink.forEach((p, i) => {
  console.log(`   ${i + 1}. ${p.name} - €${p.price}`);
  console.log(`      Marca: ${p.brand}`);
  console.log(`      Imagem: ${p.image}`);
});

console.log('\n🔹 Produtos HairLife Relaxamentos (8):');
relaxamentos.forEach((p, i) => {
  console.log(`   ${i + 1}. ${p.name} - €${p.price}`);
});

console.log(`\n✅ Total: ${wepink.length + relaxamentos.length} produtos (${wepink.length} WePink + ${relaxamentos.length} Relaxamentos)`);
