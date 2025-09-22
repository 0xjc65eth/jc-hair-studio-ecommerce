#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 Integrando categorias faltantes ao catálogo principal...');

// Carregue o catálogo principal atual
const mainCatalogPath = './lib/data/products-advanced-catalog.json';
const mainCatalog = JSON.parse(fs.readFileSync(mainCatalogPath, 'utf8'));

// Arquivos das categorias faltantes
const missingCategories = [
  {
    file: './scripts/data/progressive-treatments-catalog-COMPLETE.json',
    categoryKey: 'progressivas'
  },
  {
    file: './scripts/data/hair-sealing-catalog.json',
    categoryKey: 'selagem'
  },
  {
    file: './scripts/data/botox-products-catalog.json',
    categoryKey: 'botox'
  },
  {
    file: './scripts/data/hair-relaxers-catalog.json',
    categoryKey: 'relaxamentos'
  },
  {
    file: './scripts/data/hydration-products-catalog.json',
    categoryKey: 'hidratacao'
  }
];

let totalNewProducts = 0;

// Integre cada categoria faltante
missingCategories.forEach(({ file, categoryKey }) => {
  if (fs.existsSync(file)) {
    console.log(`📂 Processando: ${categoryKey}`);

    const categoryData = JSON.parse(fs.readFileSync(file, 'utf8'));
    const categoryInfo = categoryData[categoryKey];

    if (categoryInfo && categoryInfo.products) {
      // Converta os produtos para o formato do catálogo principal
      const convertedProducts = categoryInfo.products.map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price_brl || product.price || 0,
        priceBRL: product.price_brl,
        category: categoryKey,
        image: product.images && product.images[0] ? product.images[0] : '/placeholder-product.jpg',
        images: product.images || [],
        rating: 4.5, // Rating padrão
        reviews: Math.floor(Math.random() * 100) + 10, // Reviews aleatórias
        description: product.description,
        features: product.features || [],
        colors: product.colors || [],
        inStock: true,
        featured: false,
        isNew: true,
        specifications: {
          brand: product.brand,
          features: product.features || []
        }
      }));

      // Adicione a categoria ao catálogo principal
      mainCatalog.categories[categoryKey] = {
        metadata: {
          category: categoryKey,
          brand: "Diversos",
          type: categoryInfo.name,
          analyzed: new Date().toISOString(),
          totalProducts: convertedProducts.length,
          description: categoryInfo.name
        },
        products: convertedProducts
      };

      totalNewProducts += convertedProducts.length;
      console.log(`✅ ${categoryKey}: ${convertedProducts.length} produtos adicionados`);
    } else {
      console.log(`⚠️  ${categoryKey}: Formato inválido ou sem produtos`);
    }
  } else {
    console.log(`❌ Arquivo não encontrado: ${file}`);
  }
});

// Atualize os metadados
const totalCategories = Object.keys(mainCatalog.categories).length;
const totalProducts = Object.values(mainCatalog.categories).reduce(
  (sum, cat) => sum + (cat.products ? cat.products.length : 0), 0
);

mainCatalog.metadata = {
  ...mainCatalog.metadata,
  totalCategories,
  totalProducts,
  totalImages: totalProducts,
  lastUpdated: new Date().toISOString()
};

// Salve o catálogo atualizado
fs.writeFileSync(mainCatalogPath, JSON.stringify(mainCatalog, null, 2));

console.log('\n🎯 INTEGRAÇÃO CONCLUÍDA:');
console.log(`📊 Total de categorias: ${totalCategories}`);
console.log(`📦 Total de produtos: ${totalProducts}`);
console.log(`🆕 Novos produtos adicionados: ${totalNewProducts}`);
console.log(`💾 Catálogo salvo em: ${mainCatalogPath}`);

// Liste todas as categorias
console.log('\n📁 CATEGORIAS DISPONÍVEIS:');
Object.keys(mainCatalog.categories).forEach((cat, index) => {
  const productCount = mainCatalog.categories[cat].products ? mainCatalog.categories[cat].products.length : 0;
  console.log(`${index + 1}. ${cat}: ${productCount} produtos`);
});