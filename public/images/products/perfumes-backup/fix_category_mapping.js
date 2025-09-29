const fs = require('fs');

console.log('🔧 CORRIGINDO MAPEAMENTO DE CATEGORIAS...\n');

// Função para mapear categoria correta baseada na chave do JSON
function getCategoryFromKey(categoryKey, productName) {
  const categoryMap = {
    'hidratacao': 'cabelo',
    'tintas-loreal': 'tintas',
    'tintas-amend': 'tintas',
    'tintas-beauty-color': 'tintas',
    'tintas-biocolor': 'tintas',
    'tintas-wella': 'tintas',
    'tintas-nutrisse': 'tintas',
    'progressivas': 'progressivas',
    'relaxamentos': 'relaxamentos'
  };

  // Se encontrar categoria específica
  if (categoryMap[categoryKey]) {
    return categoryMap[categoryKey];
  }

  // Fallback baseado no nome do produto
  const productLower = productName.toLowerCase();

  if (productLower.includes('tinta') || productLower.includes('coloração') || productLower.includes('color')) {
    return 'tintas';
  }

  if (productLower.includes('progressiva') || productLower.includes('alisamento')) {
    return 'progressivas';
  }

  if (productLower.includes('relaxamento') || productLower.includes('relaxador')) {
    return 'relaxamentos';
  }

  if (productLower.includes('hidrat') || productLower.includes('máscara') || productLower.includes('óleo')) {
    return 'cabelo';
  }

  // Default para produtos capilares
  return 'cabelo';
}

// Criar arquivo de mapeamento de categorias
const categoryMapping = {};

try {
  const catalogData = JSON.parse(fs.readFileSync('lib/data/complete-product-catalog.json', 'utf8'));

  if (catalogData.categories) {
    Object.keys(catalogData.categories).forEach(categoryKey => {
      const category = catalogData.categories[categoryKey];

      categoryMapping[categoryKey] = {
        name: category.name,
        mappedCategory: getCategoryFromKey(categoryKey, category.name),
        icon: category.icon,
        products: category.products.map(product => ({
          id: product.id,
          name: product.name,
          mappedCategory: getCategoryFromKey(categoryKey, product.name)
        }))
      };
    });
  }

  // Salvar mapeamento
  fs.writeFileSync('category-mapping.json', JSON.stringify(categoryMapping, null, 2));

  console.log('📋 MAPEAMENTO DE CATEGORIAS:');
  Object.keys(categoryMapping).forEach(key => {
    console.log(`• ${key} -> ${categoryMapping[key].mappedCategory}`);
    console.log(`  Produtos: ${categoryMapping[key].products.length}`);
  });

  console.log('\n✅ Arquivo category-mapping.json criado!');
  console.log('\n🔧 PRÓXIMO PASSO: Atualizar CompleteCatalogWithCarousel.tsx');

} catch (error) {
  console.error('❌ Erro:', error.message);
}