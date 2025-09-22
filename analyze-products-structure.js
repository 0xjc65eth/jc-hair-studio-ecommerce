#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 ANÁLISE COMPLETA DOS PRODUTOS - CRIAÇÃO DE FILTROS PROFISSIONAIS');
console.log('==================================================================');

const catalog = JSON.parse(fs.readFileSync('./lib/data/products-advanced-catalog.json', 'utf8'));

// Estruturas para análise
const analysis = {
  brands: new Set(),
  priceRanges: [],
  features: new Set(),
  colors: new Set(),
  categories: new Map(),
  productTypes: new Set(),
  treatments: new Set(),
  hairTypes: new Set(),
  formulas: new Set()
};

let totalProducts = 0;

// Analisa cada categoria e produto
Object.keys(catalog.categories).forEach(categoryKey => {
  const category = catalog.categories[categoryKey];
  const products = category.products || [];

  totalProducts += products.length;

  // Analisa metadados da categoria
  const metadata = category.metadata || {};
  analysis.categories.set(categoryKey, {
    name: metadata.type || categoryKey,
    brand: metadata.brand || 'Diversos',
    count: products.length,
    type: categorizeProductType(categoryKey)
  });

  // Analisa cada produto
  products.forEach(product => {
    // Marcas
    if (product.brand) analysis.brands.add(product.brand);

    // Preços
    const price = product.price || product.priceBRL || product.price_brl || 0;
    if (price > 0) analysis.priceRanges.push(price);

    // Features
    if (product.features) {
      product.features.forEach(feature => analysis.features.add(feature));
    }

    // Cores
    if (product.colors) {
      product.colors.forEach(color => analysis.colors.add(color));
    }

    // Análise inteligente baseada no nome e descrição
    const text = (product.name + ' ' + (product.description || '')).toLowerCase();

    // Tipos de tratamento
    if (text.includes('progressiv') || text.includes('keratin')) analysis.treatments.add('Progressiva');
    if (text.includes('botox')) analysis.treatments.add('Botox Capilar');
    if (text.includes('selagem')) analysis.treatments.add('Selagem');
    if (text.includes('relaxament')) analysis.treatments.add('Relaxamento');
    if (text.includes('hidrat') || text.includes('moistur')) analysis.treatments.add('Hidratação');
    if (text.includes('reconstru') || text.includes('repair')) analysis.treatments.add('Reconstrução');

    // Tipos de cabelo
    if (text.includes('cacheado') || text.includes('cachos') || text.includes('curly')) analysis.hairTypes.add('Cacheado');
    if (text.includes('liso') || text.includes('straight')) analysis.hairTypes.add('Liso');
    if (text.includes('ondulado') || text.includes('wavy')) analysis.hairTypes.add('Ondulado');
    if (text.includes('crespo') || text.includes('afro')) analysis.hairTypes.add('Crespo');
    if (text.includes('todos os tipos') || text.includes('all hair types')) analysis.hairTypes.add('Todos os tipos');

    // Fórmulas especiais
    if (text.includes('sem formol') || text.includes('0% formol') || text.includes('formol free')) analysis.formulas.add('Livre de Formol');
    if (text.includes('orgânic') || text.includes('organic')) analysis.formulas.add('Orgânico');
    if (text.includes('vegan') || text.includes('vegano')) analysis.formulas.add('Vegano');
    if (text.includes('natural') || text.includes('extratos')) analysis.formulas.add('Natural');
    if (text.includes('profissional') || text.includes('professional')) analysis.formulas.add('Profissional');
  });
});

// Processa dados de preço
analysis.priceRanges.sort((a, b) => a - b);
const minPrice = Math.min(...analysis.priceRanges);
const maxPrice = Math.max(...analysis.priceRanges);

console.log(`📊 RESUMO GERAL:`);
console.log(`   Total de produtos analisados: ${totalProducts}`);
console.log(`   Total de categorias: ${analysis.categories.size}`);
console.log(`   Faixa de preços: R$ ${minPrice.toFixed(2)} - R$ ${maxPrice.toFixed(2)}`);
console.log('');

console.log('🏷️  MARCAS IDENTIFICADAS:');
console.log(`   Total: ${analysis.brands.size} marcas`);
Array.from(analysis.brands).sort().forEach(brand => {
  console.log(`   • ${brand}`);
});
console.log('');

console.log('🎨 CATEGORIAS POR TIPO:');
const categoryTypes = {
  'Coloração': [],
  'Tratamentos': [],
  'Cuidados': []
};

analysis.categories.forEach((data, key) => {
  categoryTypes[data.type].push(`${data.name} (${data.count} produtos)`);
});

Object.keys(categoryTypes).forEach(type => {
  console.log(`   ${type}:`);
  categoryTypes[type].forEach(cat => {
    console.log(`   • ${cat}`);
  });
  console.log('');
});

console.log('💅 TRATAMENTOS DISPONÍVEIS:');
Array.from(analysis.treatments).sort().forEach(treatment => {
  console.log(`   • ${treatment}`);
});
console.log('');

console.log('💇 TIPOS DE CABELO:');
Array.from(analysis.hairTypes).sort().forEach(hairType => {
  console.log(`   • ${hairType}`);
});
console.log('');

console.log('🧪 FÓRMULAS ESPECIAIS:');
Array.from(analysis.formulas).sort().forEach(formula => {
  console.log(`   • ${formula}`);
});
console.log('');

console.log('🌈 CORES DISPONÍVEIS:');
console.log(`   Total: ${analysis.colors.size} cores`);
Array.from(analysis.colors).sort().slice(0, 20).forEach(color => {
  console.log(`   • ${color}`);
});
if (analysis.colors.size > 20) {
  console.log(`   ... e mais ${analysis.colors.size - 20} cores`);
}
console.log('');

// Gera estrutura de filtros recomendada
const filterStructure = {
  metadata: {
    totalProducts,
    totalCategories: analysis.categories.size,
    totalBrands: analysis.brands.size,
    priceRange: { min: minPrice, max: maxPrice },
    generated: new Date().toISOString()
  },
  categories: {
    'Coloração': Array.from(analysis.categories.entries())
      .filter(([key, data]) => data.type === 'Coloração')
      .map(([key, data]) => ({ key, name: data.name, count: data.count })),
    'Tratamentos': Array.from(analysis.categories.entries())
      .filter(([key, data]) => data.type === 'Tratamentos')
      .map(([key, data]) => ({ key, name: data.name, count: data.count })),
    'Cuidados': Array.from(analysis.categories.entries())
      .filter(([key, data]) => data.type === 'Cuidados')
      .map(([key, data]) => ({ key, name: data.name, count: data.count }))
  },
  filters: {
    brands: Array.from(analysis.brands).sort(),
    treatments: Array.from(analysis.treatments).sort(),
    hairTypes: Array.from(analysis.hairTypes).sort(),
    formulas: Array.from(analysis.formulas).sort(),
    priceRanges: [
      { min: 0, max: 50, label: 'Até R$ 50' },
      { min: 50, max: 100, label: 'R$ 50 - R$ 100' },
      { min: 100, max: 200, label: 'R$ 100 - R$ 200' },
      { min: 200, max: 500, label: 'R$ 200 - R$ 500' },
      { min: 500, max: Infinity, label: 'Acima de R$ 500' }
    ]
  }
};

// Salva estrutura de filtros
fs.writeFileSync('./lib/data/filter-structure.json', JSON.stringify(filterStructure, null, 2));

console.log('💾 ESTRUTURA DE FILTROS SALVA EM: ./lib/data/filter-structure.json');
console.log('');
console.log('🎯 PRÓXIMOS PASSOS:');
console.log('   1. Implementar componente de filtros avançados');
console.log('   2. Criar UI profissional para seleção');
console.log('   3. Otimizar performance de filtragem');
console.log('   4. Adicionar busca inteligente');

function categorizeProductType(categoryKey) {
  if (categoryKey.includes('tinta') || categoryKey.includes('color')) return 'Coloração';
  if (categoryKey.includes('progressiv') || categoryKey.includes('botox') ||
      categoryKey.includes('selagem') || categoryKey.includes('relaxament')) return 'Tratamentos';
  return 'Cuidados';
}