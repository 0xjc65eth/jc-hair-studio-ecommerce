const fs = require('fs');
const path = require('path');

console.log('🚀 CONSOLIDANDO TODOS OS CATÁLOGOS...\n');

// Estrutura do catálogo completo consolidado
const consolidatedCatalog = {
  metadata: {
    version: "2.0.0",
    lastUpdated: new Date().toISOString(),
    totalCategories: 0,
    totalProducts: 0,
    totalImages: 0,
    description: "Catálogo completo consolidado com TODOS os produtos importados"
  },
  categories: {}
};

// Função para contar imagens em um diretório
function countImages(dir) {
  try {
    if (!fs.existsSync(dir)) return 0;
    const files = fs.readdirSync(dir);
    return files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file)).length;
  } catch (e) {
    return 0;
  }
}

// Função para listar todas as imagens em um diretório
function listImages(dir, category) {
  try {
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir);
    return files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => `/images/products/${category}/${file}`);
  } catch (e) {
    return [];
  }
}

// Mapeamento de diretórios para categorias
const categoryMapping = {
  'hidratacao': {
    name: 'Produtos de Hidratação',
    icon: '💧',
    dir: 'hidratacao'
  },
  'tinta-loreal': {
    name: 'Tintas L\'Oréal',
    icon: '🎨',
    dir: 'tinta-loreal'
  },
  'tinta-amend': {
    name: 'Tintas Amend',
    icon: '🌿',
    dir: 'tinta-amend'
  },
  'tinta-beauty-color': {
    name: 'Tintas Beauty Color',
    icon: '💎',
    dir: 'tinta-beauty-color'
  },
  'tinta-biocolor': {
    name: 'Tintas Biocolor',
    icon: '🌱',
    dir: 'tinta-biocolor'
  },
  'tinta-wella': {
    name: 'Tintas Wella',
    icon: '⭐',
    dir: 'tinta-wella'
  },
  'tinta-nutrisse': {
    name: 'Tintas Nutrisse Garnier',
    icon: '🥑',
    dir: 'tinta-nutrisse'
  },
  'tinta-ecllusiv': {
    name: 'Tintas Ecllusiv',
    icon: '💜',
    dir: 'tinta-ecllusiv'
  },
  'tinta-alta-moda': {
    name: 'Tintas Alta Moda',
    icon: '👑',
    dir: 'tinta-alta-moda'
  },
  'progressivas': {
    name: 'Progressivas e Alisamentos',
    icon: '✨',
    dir: 'progressivas'
  },
  'relaxamentos': {
    name: 'Relaxamentos',
    icon: '🌊',
    dir: 'relaxamentos'
  },
  'esmaltes': {
    name: 'Esmaltes e Unhas',
    icon: '💅',
    dir: 'esmaltes'
  },
  'maquiagem-mari-maria': {
    name: 'Maquiagem Mari Maria',
    icon: '💄',
    dir: 'mari-maria'
  },
  'maquiagem-boca-rosa': {
    name: 'Maquiagem Boca Rosa',
    icon: '🌹',
    dir: 'boca-rosa'
  },
  'produtos-profissionais': {
    name: 'Produtos Profissionais',
    icon: '🏆',
    dir: 'cadiveu'
  }
};

// Carregar catálogo atual se existir
let currentCatalog = {};
try {
  const currentData = fs.readFileSync('./lib/data/complete-product-catalog.json', 'utf8');
  currentCatalog = JSON.parse(currentData);
  console.log('✅ Catálogo atual carregado');
} catch (e) {
  console.log('⚠️ Criando novo catálogo...');
}

// Consolidar produtos do catálogo atual
if (currentCatalog.categories) {
  Object.keys(currentCatalog.categories).forEach(key => {
    const category = currentCatalog.categories[key];
    consolidatedCatalog.categories[key] = {
      name: category.name,
      icon: category.icon,
      products: category.products || []
    };

    console.log(`📂 ${category.name}: ${category.products?.length || 0} produtos`);
  });
}

// Processar todos os diretórios de imagens
const imageBasePath = './public/images/products';
const imageDirs = fs.readdirSync(imageBasePath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

console.log('\n🖼️ PROCESSANDO DIRETÓRIOS DE IMAGENS:');
imageDirs.forEach(dir => {
  const fullPath = path.join(imageBasePath, dir);
  const imageCount = countImages(fullPath);
  console.log(`📁 ${dir}: ${imageCount} imagens`);

  // Se não existir categoria para este diretório, criar uma
  const categoryKey = dir.replace(/-/g, '-');
  if (!consolidatedCatalog.categories[categoryKey]) {
    const mapping = categoryMapping[categoryKey] || {
      name: dir.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      icon: '🎯',
      dir: dir
    };

    consolidatedCatalog.categories[categoryKey] = {
      name: mapping.name,
      icon: mapping.icon,
      products: []
    };

    console.log(`🆕 Nova categoria criada: ${mapping.name}`);
  }
});

// Adicionar produtos para categorias sem produtos baseado nas imagens
console.log('\n🔄 GERANDO PRODUTOS BASEADOS NAS IMAGENS:');

Object.keys(consolidatedCatalog.categories).forEach(categoryKey => {
  const category = consolidatedCatalog.categories[categoryKey];
  const dirName = categoryMapping[categoryKey]?.dir || categoryKey;
  const fullPath = path.join(imageBasePath, dirName);

  if (category.products.length === 0 && fs.existsSync(fullPath)) {
    const images = listImages(fullPath, dirName);

    if (images.length > 0) {
      // Agrupar imagens por produto (assumindo padrão nome_numero)
      const productGroups = {};
      images.forEach(img => {
        const filename = path.basename(img, path.extname(img));
        const productName = filename.split('_')[0] || filename.split('-')[0] || filename;

        if (!productGroups[productName]) {
          productGroups[productName] = [];
        }
        productGroups[productName].push(img);
      });

      // Criar produtos baseados nos grupos de imagens
      Object.keys(productGroups).forEach((productName, index) => {
        const productImages = productGroups[productName];
        const basePrice = 15 + (index * 5) + Math.random() * 20; // Preço base aleatório

        const product = {
          id: `${categoryKey}-${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: productName.split(/[-_]/).map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ') + ` - ${category.name}`,
          brand: getBrandFromCategory(categoryKey),
          description: `Produto premium da categoria ${category.name} com qualidade excepcional.`,
          price: Math.round(basePrice * 100) / 100,
          originalPrice: productImages.length > 3 ? Math.round((basePrice + 10) * 100) / 100 : undefined,
          images: productImages,
          features: getFeaturesByCategory(categoryKey),
          stock: Math.floor(Math.random() * 50) + 10,
          rating: Math.round((4.0 + Math.random() * 1.0) * 10) / 10,
          reviews: Math.floor(Math.random() * 200) + 50
        };

        category.products.push(product);
      });

      console.log(`✨ ${category.name}: ${category.products.length} produtos gerados`);
    }
  }
});

// Funções auxiliares
function getBrandFromCategory(categoryKey) {
  const brands = {
    'hidratacao': 'Bio Extratus',
    'tinta-loreal': 'L\'Oréal Paris',
    'tinta-amend': 'Amend',
    'tinta-beauty-color': 'Beauty Color',
    'tinta-biocolor': 'Biocolor',
    'tinta-wella': 'Wella Professionals',
    'tinta-nutrisse': 'Garnier',
    'tinta-ecllusiv': 'Ecllusiv',
    'tinta-alta-moda': 'Alta Moda',
    'progressivas': 'Professional Line',
    'relaxamentos': 'Relax Pro',
    'esmaltes': 'Nail Pro',
    'maquiagem-mari-maria': 'Mari Maria',
    'maquiagem-boca-rosa': 'Boca Rosa',
    'produtos-profissionais': 'Professional'
  };

  return brands[categoryKey] || 'Premium Brand';
}

function getFeaturesByCategory(categoryKey) {
  const features = {
    'hidratacao': ['Hidratação Profunda', 'Nutrição', 'Brilho Natural', 'Reparação'],
    'tinta-loreal': ['Cobertura Total', 'Longa Duração', 'Proteção da Cor', 'Fácil Aplicação'],
    'tinta-amend': ['Natural', 'Orgânico', 'Suave', 'Sem Químicos Agressivos'],
    'tinta-beauty-color': ['Kit Completo', 'Fácil Aplicação', 'Resultado Profissional', 'Preço Acessível'],
    'tinta-biocolor': ['Natural', 'Extratos Vegetais', 'Suave', 'Hipoalergênico'],
    'tinta-wella': ['Profissional', 'Tecnologia Avançada', 'Resultado Superior', 'Qualidade Premium'],
    'tinta-nutrisse': ['Nutritiva', 'Óleos Naturais', 'Hidratação', 'Cor Duradoura'],
    'progressivas': ['Sem Formol', 'Duradouro', 'Profissional', 'Resultado Natural'],
    'relaxamentos': ['Ação Profunda', 'Suavidade', 'Controle', 'Hidratação'],
    'esmaltes': ['Longa Duração', 'Brilho Intenso', 'Secagem Rápida', 'Cores Vibrantes'],
    'maquiagem-mari-maria': ['Pigmentação Intensa', 'Longa Duração', 'Vegano', 'Brasileiro'],
    'maquiagem-boca-rosa': ['Qualidade Premium', 'Cores Exclusivas', 'Textura Sedosa', 'Resultado Profissional']
  };

  return features[categoryKey] || ['Qualidade Premium', 'Resultado Profissional', 'Fácil Aplicação', 'Duradouro'];
}

// Calcular estatísticas finais
consolidatedCatalog.metadata.totalCategories = Object.keys(consolidatedCatalog.categories).length;
consolidatedCatalog.metadata.totalProducts = Object.values(consolidatedCatalog.categories)
  .reduce((total, cat) => total + cat.products.length, 0);
consolidatedCatalog.metadata.totalImages = Object.values(consolidatedCatalog.categories)
  .reduce((total, cat) => {
    return total + cat.products.reduce((imgTotal, product) => {
      return imgTotal + (product.images ? product.images.length : 0);
    }, 0);
  }, 0);

// Salvar o catálogo consolidado
fs.writeFileSync('./lib/data/complete-product-catalog-consolidated.json',
  JSON.stringify(consolidatedCatalog, null, 2));

console.log('\n📊 ESTATÍSTICAS FINAIS:');
console.log(`📂 Total de categorias: ${consolidatedCatalog.metadata.totalCategories}`);
console.log(`🛍️ Total de produtos: ${consolidatedCatalog.metadata.totalProducts}`);
console.log(`🖼️ Total de imagens: ${consolidatedCatalog.metadata.totalImages}`);

console.log('\n🎉 CATÁLOGO CONSOLIDADO SALVO EM:');
console.log('📄 lib/data/complete-product-catalog-consolidated.json');

// Listar resumo por categoria
console.log('\n📋 RESUMO POR CATEGORIA:');
Object.entries(consolidatedCatalog.categories).forEach(([key, category]) => {
  console.log(`${category.icon} ${category.name}: ${category.products.length} produtos`);
});

console.log('\n✅ CONSOLIDAÇÃO COMPLETA!');