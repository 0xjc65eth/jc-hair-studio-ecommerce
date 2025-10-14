#!/usr/bin/env node

/**
 * Verify the tratamentos-capilares page loads correctly with 24 products and all images
 */

import { tratamentosCapilaresProducts } from '../lib/data/categories.ts';

console.log('🔍 Verificando página de Tratamentos Capilares...\n');

console.log(`Total de produtos carregados: ${tratamentosCapilaresProducts.length}`);

if (tratamentosCapilaresProducts.length === 24) {
  console.log('✅ Quantidade correta de produtos (24)!\n');
} else {
  console.log(`❌ ERRO: Esperado 24 produtos, mas encontrou ${tratamentosCapilaresProducts.length}!\n`);
}

console.log('Verificando imagens:');
let withImages = 0;
let withoutImages = 0;

tratamentosCapilaresProducts.forEach((p, i) => {
  if (p.image && p.image !== '/images/products/placeholder.jpg') {
    withImages++;
  } else {
    console.log(`  ❌ ${i + 1}. ${p.name} - SEM IMAGEM ou usando placeholder`);
    withoutImages++;
  }
});

console.log(`\n📊 Resumo:`);
console.log(`   ✅ Com imagens: ${withImages}`);
console.log(`   ❌ Sem imagens: ${withoutImages}`);

if (withoutImages === 0) {
  console.log('\n✅ Todos os produtos têm imagens!');
} else {
  console.log(`\n❌ ${withoutImages} produtos sem imagens!`);
}

// List HairLife products
const hairlife = tratamentosCapilaresProducts.filter(p => p.brand === 'HairLife');
console.log(`\n🔹 Produtos HairLife: ${hairlife.length}`);
hairlife.forEach((p, i) => {
  console.log(`   ${i + 1}. ${p.name} - €${p.price}`);
});
