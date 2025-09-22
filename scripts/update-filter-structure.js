const fs = require('fs');
const path = require('path');

// Carregar produtos existentes - usar o arquivo com mais produtos
const productsPath = path.join(__dirname, '../lib/data/products-advanced-catalog.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Extrair todos os produtos de todas as categorias
let products = [];
if (productsData.products) {
  // Formato: { products: [...] }
  products = productsData.products;
} else if (productsData.categories && typeof productsData.categories === 'object' && !Array.isArray(productsData.categories)) {
  // Formato: { categories: { key1: {products: [...]}, key2: {products: [...]} } }
  Object.keys(productsData.categories).forEach(categoryKey => {
    const categoryData = productsData.categories[categoryKey];
    if (categoryData && categoryData.products && Array.isArray(categoryData.products)) {
      // Adicionar a categoria aos produtos para referência
      categoryData.products.forEach(product => {
        products.push({ ...product, category: categoryKey });
      });
    } else if (Array.isArray(categoryData)) {
      // Caso seja array direto
      categoryData.forEach(product => {
        products.push({ ...product, category: categoryKey });
      });
    }
  });
} else if (productsData.categories && Array.isArray(productsData.categories)) {
  // Formato: { categories: [{products: [...]}] }
  productsData.categories.forEach(category => {
    if (category.products) {
      products.push(...category.products);
    }
  });
} else if (Array.isArray(productsData)) {
  // Formato: array direto
  products = productsData;
} else {
  console.error('Unknown data format');
  process.exit(1);
}

console.log(`📦 Found ${products.length} products to process`);

// Reorganizar categorias
const categorizedProducts = {
  'Coloração': {},
  'Tratamentos': {},
  'Cuidados': {},
  'Bio Extratus': {} // Categoria separada para Bio Extratus
};

// Marcas únicas
const brands = new Set();
const treatments = new Set();
const hairTypes = new Set(['Todos os tipos', 'Cacheado', 'Liso', 'Ondulado', 'Crespo']);
const formulas = new Set(['Livre de Formol', 'Orgânico', 'Vegano', 'Natural', 'Profissional']);
const priceRanges = [
  { min: 0, max: 25, label: 'Até R$ 25' },
  { min: 25, max: 50, label: 'R$ 25 - R$ 50' },
  { min: 50, max: 100, label: 'R$ 50 - R$ 100' },
  { min: 100, max: 200, label: 'R$ 100 - R$ 200' },
  { min: 200, max: Infinity, label: 'Acima de R$ 200' }
];

// Processar produtos
products.forEach(product => {
  const categoryKey = product.category || '';
  const productName = (product.name || '').toLowerCase();
  const brandName = product.brand || 'Sem Marca';

  brands.add(brandName);

  // Separar Bio Extratus em sua própria categoria
  if (brandName.toLowerCase().includes('bio') && brandName.toLowerCase().includes('extratus')) {
    // Determinar subcategoria Bio Extratus
    let subCategory = 'bio_extratus_outros';
    if (productName.includes('color') || productName.includes('tint')) {
      subCategory = 'bio_extratus_coloracao';
    } else if (productName.includes('shampoo') || productName.includes('condicion')) {
      subCategory = 'bio_extratus_cuidados';
    } else if (productName.includes('tratamento') || productName.includes('máscara')) {
      subCategory = 'bio_extratus_tratamentos';
    }

    if (!categorizedProducts['Bio Extratus'][subCategory]) {
      categorizedProducts['Bio Extratus'][subCategory] = {
        key: subCategory,
        name: getSubCategoryName(subCategory),
        count: 0
      };
    }
    categorizedProducts['Bio Extratus'][subCategory].count++;
  } else {
    // Categorizar outros produtos normalmente
    let mainCategory = 'Cuidados';

    if (categoryKey.includes('tinta') || productName.includes('coloração')) {
      mainCategory = 'Coloração';
    } else if (categoryKey.includes('progressiv') || categoryKey.includes('botox') ||
               categoryKey.includes('selagem') || categoryKey.includes('relaxamento')) {
      mainCategory = 'Tratamentos';

      // Adicionar tratamentos específicos
      if (categoryKey.includes('progressiv')) treatments.add('Progressiva');
      if (categoryKey.includes('botox')) treatments.add('Botox Capilar');
      if (categoryKey.includes('selagem')) treatments.add('Selagem');
      if (categoryKey.includes('relaxamento')) treatments.add('Relaxamento');
    } else if (categoryKey.includes('hidrata')) {
      mainCategory = 'Cuidados';
      treatments.add('Hidratação');
    }

    // Criar entrada para subcategoria se não existir
    if (!categorizedProducts[mainCategory][categoryKey]) {
      categorizedProducts[mainCategory][categoryKey] = {
        key: categoryKey,
        name: getCategoryName(categoryKey),
        count: 0
      };
    }
    categorizedProducts[mainCategory][categoryKey].count++;
  }
});

function getCategoryName(key) {
  const names = {
    'tinta_amend': 'Coloração Amend',
    'tinta_nutrisse': 'Coloração Nutrisse',
    'tinta_alta_moda_': 'Coloração Alta Moda',
    'tinta_beauty_color': 'Coloração Beauty Color',
    'tinta_excllusiv': 'Coloração Excllusiv',
    'tinta_biocolor': 'Coloração Biocolor',
    'tinta_wella': 'Coloração Wella',
    'tinta_loreal': 'Coloração L\'Oréal',
    'progressivas_diversas_': 'Progressivas Profissionais',
    'selagem': 'Selagem Capilar',
    'botox': 'Botox Capilar',
    'relaxamentos_': 'Relaxamentos',
    'hidratacao': 'Hidratação Intensiva',
    'produtos_de_hidratacao': 'Produtos de Hidratação'
  };
  return names[key] || key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
}

function getSubCategoryName(key) {
  const names = {
    'bio_extratus_coloracao': 'Bio Extratus - Coloração',
    'bio_extratus_cuidados': 'Bio Extratus - Cuidados Diários',
    'bio_extratus_tratamentos': 'Bio Extratus - Tratamentos',
    'bio_extratus_outros': 'Bio Extratus - Outros Produtos'
  };
  return names[key] || key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
}

// Converter para formato de array
const categoriesFormatted = {};
Object.keys(categorizedProducts).forEach(category => {
  const items = Object.values(categorizedProducts[category]);
  if (items.length > 0) {
    categoriesFormatted[category] = items.sort((a, b) => b.count - a.count);
  }
});

// Criar estrutura final
const filterStructure = {
  metadata: {
    totalProducts: products.length,
    totalCategories: Object.keys(categoriesFormatted).length,
    totalBrands: brands.size,
    priceRange: {
      min: Math.min(...products.map(p => p.price || p.price_brl || 0).filter(p => p > 0)),
      max: Math.max(...products.map(p => p.price || p.price_brl || 0))
    },
    generated: new Date().toISOString()
  },
  categories: categoriesFormatted,
  filters: {
    brands: Array.from(brands).sort(),
    treatments: Array.from(treatments).sort(),
    hairTypes: Array.from(hairTypes),
    formulas: Array.from(formulas),
    priceRanges: priceRanges
  }
};

// Salvar arquivo
const outputPath = path.join(__dirname, '../public/filter-structure.json');
fs.writeFileSync(outputPath, JSON.stringify(filterStructure, null, 2));

console.log('✅ Filter structure updated successfully!');
console.log('📊 Summary:');
console.log(`  - Total Products: ${filterStructure.metadata.totalProducts}`);
console.log(`  - Categories: ${Object.keys(categoriesFormatted).join(', ')}`);
console.log(`  - Total Brands: ${filterStructure.metadata.totalBrands}`);
console.log(`  - Treatments: ${Array.from(treatments).join(', ')}`);

// Mostrar contagem por categoria
console.log('\n📦 Products per category:');
Object.entries(categoriesFormatted).forEach(([category, items]) => {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  console.log(`  ${category}: ${total} products (${items.length} subcategories)`);
});