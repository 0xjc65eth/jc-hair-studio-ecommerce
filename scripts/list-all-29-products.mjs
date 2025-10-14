#!/usr/bin/env node

import { tratamentosCapilaresProducts } from '../lib/data/categories.ts';

console.log(`Total de produtos carregados: ${tratamentosCapilaresProducts.length}\n`);

console.log('Todos os produtos:');
tratamentosCapilaresProducts.forEach((p, i) => {
  console.log(`${i + 1}. ${p.id} - ${p.name} (${p.brand})`);
});
