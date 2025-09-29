const fs = require('fs');

console.log('📋 LISTAGEM DETALHADA DE TODOS OS PRODUTOS DISPONÍVEIS');
console.log('='.repeat(80));

// Function to extract products from different data structures
function extractProducts(data, sourceName) {
  const products = [];

  if (data.categories) {
    if (Array.isArray(data.categories)) {
      // Handle array structure
      data.categories.forEach(category => {
        if (category.products && Array.isArray(category.products)) {
          category.products.forEach(product => {
            products.push({
              ...product,
              categoryName: category.name,
              categoryId: category.id,
              source: sourceName
            });
          });
        }
      });
    } else if (typeof data.categories === 'object') {
      // Handle object structure
      Object.entries(data.categories).forEach(([key, category]) => {
        if (category.products && Array.isArray(category.products)) {
          category.products.forEach(product => {
            products.push({
              ...product,
              categoryName: category.name || key,
              categoryId: key,
              source: sourceName
            });
          });
        }
      });
    }
  } else if (Array.isArray(data)) {
    // Handle direct array
    data.forEach(product => {
      products.push({
        ...product,
        source: sourceName
      });
    });
  } else if (data.products && Array.isArray(data.products)) {
    // Handle direct products array
    data.products.forEach(product => {
      products.push({
        ...product,
        source: sourceName
      });
    });
  }

  return products;
}

// Load and analyze all catalogs
const catalogs = [
  { file: './lib/data/products-reorganized.json', name: 'Produtos Reorganizados' },
  { file: './lib/data/products-advanced-catalog.json', name: 'Catálogo Avançado' },
  { file: './lib/data/products-mega-consolidated.json', name: 'Catálogo Mega Consolidado' },
  { file: './lib/data/complete-product-catalog-consolidated.json', name: 'Catálogo Completo Consolidado' },
];

let allProducts = [];
let catalogSummary = [];

catalogs.forEach(catalog => {
  if (fs.existsSync(catalog.file)) {
    try {
      const data = JSON.parse(fs.readFileSync(catalog.file, 'utf8'));
      const products = extractProducts(data, catalog.name);

      if (products.length > 0) {
        allProducts.push(...products);
        catalogSummary.push({
          name: catalog.name,
          count: products.length,
          file: catalog.file
        });

        console.log(`\n🎯 ${catalog.name}: ${products.length} produtos`);

        // Group by category
        const categoryGroups = {};
        products.forEach(product => {
          const catName = product.categoryName || product.category || 'Sem categoria';
          if (!categoryGroups[catName]) {
            categoryGroups[catName] = [];
          }
          categoryGroups[catName].push(product);
        });

        Object.entries(categoryGroups).forEach(([catName, catProducts]) => {
          console.log(`   📁 ${catName}: ${catProducts.length} produtos`);
          catProducts.slice(0, 3).forEach(product => {
            console.log(`      • ${product.name} (${product.brand || 'Sem marca'})`);
          });
          if (catProducts.length > 3) {
            console.log(`      ... e mais ${catProducts.length - 3} produtos`);
          }
        });
      }
    } catch (error) {
      console.log(`❌ Erro ao ler ${catalog.name}: ${error.message}`);
    }
  } else {
    console.log(`❌ Arquivo não encontrado: ${catalog.file}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`📊 RESUMO GERAL: ${allProducts.length} produtos encontrados`);

catalogSummary.forEach(cat => {
  console.log(`  • ${cat.name}: ${cat.count} produtos`);
});

// Categorize all products by type
console.log('\n🗂️  PRODUTOS POR CATEGORIA:');
const allCategories = {};
allProducts.forEach(product => {
  const catName = product.categoryName || product.category || 'Sem categoria';
  if (!allCategories[catName]) {
    allCategories[catName] = [];
  }
  allCategories[catName].push(product);
});

Object.entries(allCategories)
  .sort(([,a], [,b]) => b.length - a.length)
  .forEach(([catName, products]) => {
    console.log(`\n📁 ${catName} (${products.length} produtos):`);
    products.forEach(product => {
      console.log(`   • ${product.name}`);
      console.log(`     Marca: ${product.brand || 'Não informado'}`);
      console.log(`     Preço: R$ ${product.priceBRL || product.price_brl || product.price || 'N/A'}`);
      console.log(`     ID: ${product.id}`);
      console.log(`     Fonte: ${product.source}`);
      console.log('     ---');
    });
  });

console.log('\n✅ Listagem completa finalizada!');