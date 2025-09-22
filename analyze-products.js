const fs = require('fs');
const path = require('path');

console.log('🔍 INVENTÁRIO COMPLETO DE PRODUTOS DISPONÍVEIS');
console.log('='.repeat(60));

const catalogs = [
  // Catálogos principais
  { file: './lib/data/products-advanced-catalog.json', name: 'Catálogo Avançado Principal' },
  { file: './lib/data/complete-product-catalog-consolidated.json', name: 'Catálogo Completo Consolidado' },
  { file: './lib/data/products-mega-consolidated.json', name: 'Catálogo Mega Consolidado' },

  // Catálogos específicos
  { file: './lib/data/botox-products-catalog.json', name: 'Produtos de Botox' },
  { file: './lib/data/hydration-products-catalog.json', name: 'Produtos de Hidratação' },
  { file: './lib/data/catalog_bio_extratus_produtos__advanced.json', name: 'Bio Extratus Avançado' },
  { file: './lib/data/bruna-tavares-bt-skin-catalog.json', name: 'Bruna Tavares BT Skin' },

  // Catálogos de tratamentos em scripts/data
  { file: './scripts/data/progressive-treatments-catalog-COMPLETE.json', name: 'Tratamentos Progressivos Completo' },
  { file: './scripts/data/hair-relaxers-catalog.json', name: 'Relaxantes Capilares' },
  { file: './scripts/data/hair-sealing-catalog.json', name: 'Selagem Capilar' },
  { file: './scripts/data/botox-products-catalog.json', name: 'Botox (Scripts)' },
  { file: './scripts/data/hydration-products-catalog.json', name: 'Hidratação (Scripts)' },

  // Catálogos de coloração
  { file: './scripts/data/catalog_tinta_beauty_color_advanced.json', name: 'Coloração Beauty Color' },
  { file: './scripts/data/catalog_tinta_wella_advanced.json', name: 'Coloração Wella' },
  { file: './scripts/data/catalog_tinta_alta_moda__advanced.json', name: 'Coloração Alta Moda' },
  { file: './scripts/data/catalog_tinta_excllusiv_advanced.json', name: 'Coloração Excllusiv' },
  { file: './scripts/data/catalog_tinta_biocolor_advanced.json', name: 'Coloração Biocolor' },
  { file: './scripts/data/catalog_tinta_loreal_advanced.json', name: 'Coloração L\'Oréal' },
  { file: './scripts/data/catalog_tinta_nutrisse_advanced.json', name: 'Coloração Nutrisse' },
  { file: './scripts/data/catalog_tinta_amend_advanced.json', name: 'Coloração Amend' }
];

let totalProductsFound = 0;
const availableCategories = [];

catalogs.forEach(catalog => {
  if (fs.existsSync(catalog.file)) {
    try {
      const data = JSON.parse(fs.readFileSync(catalog.file, 'utf8'));
      let productCount = 0;
      let categories = [];

      // Verificar diferentes estruturas de dados
      if (data.products && Array.isArray(data.products)) {
        productCount = data.products.length;
        categories.push('produtos diretos');
      } else if (data.categories) {
        if (typeof data.categories === 'object' && !Array.isArray(data.categories)) {
          // Formato: { categories: { key1: {products: []}, key2: {products: []} } }
          Object.keys(data.categories).forEach(key => {
            const cat = data.categories[key];
            if (cat.products && Array.isArray(cat.products)) {
              productCount += cat.products.length;
              categories.push(key);
            }
          });
        } else if (Array.isArray(data.categories)) {
          // Formato: { categories: [{products: []}] }
          data.categories.forEach(cat => {
            if (cat.products && Array.isArray(cat.products)) {
              productCount += cat.products.length;
              categories.push(cat.name || 'categoria');
            }
          });
        }
      } else if (Array.isArray(data)) {
        productCount = data.length;
        categories.push('array direto');
      }

      if (productCount > 0) {
        console.log(`✅ ${catalog.name}: ${productCount} produtos`);
        categories.forEach(cat => console.log(`   └─ ${cat}`));
        totalProductsFound += productCount;
        availableCategories.push({ name: catalog.name, count: productCount, categories, file: catalog.file });
      } else {
        console.log(`⚠️  ${catalog.name}: 0 produtos (vazio)`);
      }
    } catch (error) {
      console.log(`❌ ${catalog.name}: Erro ao ler arquivo`);
    }
  } else {
    console.log(`❌ ${catalog.name}: Arquivo não encontrado`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`📊 RESUMO TOTAL: ${totalProductsFound} produtos encontrados`);
console.log('\n🎯 CATÁLOGOS COM PRODUTOS:');
availableCategories.forEach(cat => {
  console.log(`  • ${cat.name}: ${cat.count} produtos`);
});

// Lista detalhada dos 5 maiores catálogos
console.log('\n📋 DETALHES DOS PRINCIPAIS CATÁLOGOS:');
availableCategories
  .sort((a, b) => b.count - a.count)
  .slice(0, 5)
  .forEach((cat, index) => {
    console.log(`\n${index + 1}. ${cat.name} (${cat.count} produtos)`);
    console.log(`   Arquivo: ${cat.file}`);
    console.log(`   Categorias: ${cat.categories.join(', ')}`);
  });