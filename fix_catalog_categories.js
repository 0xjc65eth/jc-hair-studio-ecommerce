const fs = require('fs');

console.log('🔧 CRIANDO FUNÇÃO DE CATEGORIA DINÂMICA...\n');

// Função para determinar categoria baseada na chave do catálogo
const getCategoryFunction = `
// Função para mapear categoria correta baseada na seção do catálogo
const getCategoryForProduct = (categoryKey, productName) => {
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

  // Usar mapeamento direto se disponível
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
};
`;

// Ler o arquivo atual
const filePath = 'components/catalog/CompleteCatalogWithCarousel.tsx';
let fileContent = fs.readFileSync(filePath, 'utf8');

// 1. Adicionar a função helper no início do componente
const insertPoint = "const CompleteCatalogWithCarousel = () => {";
const functionInsert = insertPoint + `

  // Função para mapear categoria correta baseada na seção do catálogo
  const getCategoryForProduct = (categoryKey, productName) => {
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

    if (categoryMap[categoryKey]) {
      return categoryMap[categoryKey];
    }

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

    return 'cabelo';
  };
`;

fileContent = fileContent.replace(insertPoint, functionInsert);

// 2. Função para encontrar a chave da categoria do produto
const addCategoryKeyFunction = `
  // Função para encontrar a chave da categoria de um produto
  const findCategoryKeyForProduct = (productId) => {
    for (const [categoryKey, category] of Object.entries(categories)) {
      if (category.products.some(p => p.id === productId)) {
        return categoryKey;
      }
    }
    return 'hidratacao'; // fallback
  };
`;

// Inserir após getCategoryForProduct
fileContent = fileContent.replace(
  '  };',
  `  };

  // Função para encontrar a chave da categoria de um produto
  const findCategoryKeyForProduct = (productId) => {
    for (const [categoryKey, category] of Object.entries(categories)) {
      if (category.products.some(p => p.id === productId)) {
        return categoryKey;
      }
    }
    return 'hidratacao'; // fallback
  };`
);

// Salvar arquivo atualizado
fs.writeFileSync(filePath, fileContent);

console.log('✅ Função getCategoryForProduct adicionada ao CompleteCatalogWithCarousel.tsx');
console.log('🔧 PRÓXIMO PASSO: Substituir todas as ocorrências de category="cabelo"');

// Lista de substituições necessárias
const replacements = [
  {
    old: 'category="cabelo"',
    new: 'category={getCategoryForProduct(findCategoryKeyForProduct(product.id), product.name)}'
  }
];

console.log('\n📋 SUBSTITUIÇÕES NECESSÁRIAS:');
replacements.forEach((replacement, index) => {
  console.log(`${index + 1}. "${replacement.old}" -> "${replacement.new}"`);
});

console.log('\n⚠️  Agora vou aplicar essas substituições...');