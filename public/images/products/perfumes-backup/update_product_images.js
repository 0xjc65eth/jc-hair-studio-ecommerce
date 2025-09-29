#!/usr/bin/env node

/**
 * Script para atualizar dados de produtos com as novas imagens organizadas
 * JC Hair Studio 62 - E-commerce System
 */

const fs = require('fs');
const path = require('path');

// Configurações
const IMAGES_DIR = './public/images/products';
const PRODUCTS_DATA_FILE = './lib/data/products-reorganized.json';

// Mapeamento das pastas para categorias de produtos
const CATEGORY_MAPPING = {
  'bio_extratus_produtos_': 'bio-extratus',
  'botox': 'tratamento-capilar',
  'esmaltes': 'esmaltes',
  'produtos_de_hidratacao': 'hidratacao',
  'progressivas_diversas': 'progressiva',
  'relaxamentos_': 'relaxamento',
  'selagem': 'selagem',
  'tinta_alta_moda_': 'coloracao',
  'tinta_amend': 'coloracao',
  'tinta_beauty_color': 'coloracao',
  'tinta_biocolor': 'coloracao',
  'tinta_excllusiv': 'coloracao',
  'tinta_loreal': 'coloracao',
  'tinta_nutrisse': 'coloracao',
  'tinta_wella': 'coloracao'
};

// Função para obter todas as imagens de uma pasta
function getImagesFromFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.log(`❌ Pasta não encontrada: ${folderPath}`);
    return [];
  }

  const files = fs.readdirSync(folderPath);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

  return files
    .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
    .sort((a, b) => {
      // Extrair números dos nomes dos arquivos para ordenação correta
      const aNum = parseInt(a.match(/_(\d+)\./)?.[1] || '0');
      const bNum = parseInt(b.match(/_(\d+)\./)?.[1] || '0');
      return aNum - bNum;
    });
}

// Função para criar dados de produto baseado nas imagens
function createProductFromImages(folderName, images, category) {
  const baseName = folderName.replace(/_$/, ''); // Remove _ no final se existir
  const displayName = baseName
    .replace(/_/g, ' ')
    .replace(/tinta /g, '')
    .replace(/produtos /g, '')
    .toUpperCase();

  return {
    id: `${baseName}_collection`,
    name: `Linha ${displayName}`,
    category: category,
    brand: getBrandFromName(displayName),
    description: `Coleção completa de produtos ${displayName} - ${images.length} itens disponíveis`,
    images: images.map(img => `/images/products/${folderName}/${img}`),
    price: calculateBasePrice(category, images.length),
    inStock: true,
    featured: false,
    variants: images.map((img, index) => ({
      id: `${baseName}_${index + 1}`,
      name: `${displayName} - Item ${index + 1}`,
      image: `/images/products/${folderName}/${img}`,
      price: calculateVariantPrice(category),
      inStock: true
    }))
  };
}

// Função para determinar marca baseada no nome
function getBrandFromName(name) {
  if (name.includes('LOREAL')) return 'L\'Oréal';
  if (name.includes('WELLA')) return 'Wella';
  if (name.includes('BEAUTY COLOR')) return 'Beauty Color';
  if (name.includes('BIOCOLOR')) return 'Biocolor';
  if (name.includes('EXCLLUSIV')) return 'Excllusiv';
  if (name.includes('NUTRISSE')) return 'Nutrisse';
  if (name.includes('ALTA MODA')) return 'Alta Moda';
  if (name.includes('AMEND')) return 'Amend';
  if (name.includes('BIO EXTRATUS')) return 'Bio Extratus';
  return 'JC Hair Studio';
}

// Função para calcular preço base por categoria
function calculateBasePrice(category, itemCount) {
  const basePrices = {
    'coloracao': 25.90,
    'tratamento-capilar': 45.90,
    'esmaltes': 12.90,
    'hidratacao': 35.90,
    'progressiva': 89.90,
    'relaxamento': 39.90,
    'selagem': 65.90,
    'bio-extratus': 55.90
  };

  const basePrice = basePrices[category] || 29.90;

  // Desconto por quantidade
  if (itemCount > 20) return basePrice * 0.85; // 15% desconto
  if (itemCount > 10) return basePrice * 0.90; // 10% desconto
  if (itemCount > 5) return basePrice * 0.95;  // 5% desconto

  return basePrice;
}

// Função para calcular preço de variante
function calculateVariantPrice(category) {
  const variantPrices = {
    'coloracao': 25.90,
    'tratamento-capilar': 45.90,
    'esmaltes': 12.90,
    'hidratacao': 35.90,
    'progressiva': 89.90,
    'relaxamento': 39.90,
    'selagem': 65.90,
    'bio-extratus': 55.90
  };

  return variantPrices[category] || 29.90;
}

// Função principal
function updateProductImages() {
  console.log('🚀 Iniciando atualização de dados de produtos...\n');

  // Verificar se o diretório de imagens existe
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Diretório de imagens não encontrado: ${IMAGES_DIR}`);
    process.exit(1);
  }

  // Ler dados de produtos existentes
  let existingData = { categories: {} };
  if (fs.existsSync(PRODUCTS_DATA_FILE)) {
    try {
      const data = fs.readFileSync(PRODUCTS_DATA_FILE, 'utf8');
      existingData = JSON.parse(data);
      console.log(`📄 Carregados dados de produtos existentes com ${Object.keys(existingData.categories || {}).length} categorias`);
    } catch (error) {
      console.error('❌ Erro ao ler arquivo de produtos existente:', error.message);
    }
  }

  // Processar cada pasta de imagens
  const imageFolders = fs.readdirSync(IMAGES_DIR)
    .filter(item => fs.statSync(path.join(IMAGES_DIR, item)).isDirectory())
    .filter(folder => Object.keys(CATEGORY_MAPPING).includes(folder));

  console.log(`📁 Encontradas ${imageFolders.length} pastas de produtos para processar\n`);

  const newProducts = [];
  let totalImagesProcessed = 0;

  imageFolders.forEach(folder => {
    console.log(`📦 Processando: ${folder}`);

    const folderPath = path.join(IMAGES_DIR, folder);
    const images = getImagesFromFolder(folderPath);
    const category = CATEGORY_MAPPING[folder];

    if (images.length === 0) {
      console.log(`⚠️  Nenhuma imagem encontrada em ${folder}`);
      return;
    }

    const product = createProductFromImages(folder, images, category);
    newProducts.push(product);
    totalImagesProcessed += images.length;

    console.log(`✅ ${images.length} imagens processadas para ${product.name}`);
  });

  // Adicionar novos produtos às categorias existentes
  const updatedData = { ...existingData };

  // Garantir que metadata existe
  if (!updatedData.metadata) {
    updatedData.metadata = {
      version: "2.0.1",
      lastUpdated: new Date().toISOString(),
      totalCategories: 0,
      totalProducts: 0,
      totalImages: 0,
      description: "Catálogo atualizado com novas imagens organizadas"
    };
  }

  // Garantir que categories existe
  if (!updatedData.categories) {
    updatedData.categories = {};
  }

  // Adicionar novos produtos por categoria
  let totalNewProducts = 0;
  newProducts.forEach(product => {
    const categoryKey = product.category;

    if (!updatedData.categories[categoryKey]) {
      updatedData.categories[categoryKey] = {
        name: getCategoryDisplayName(categoryKey),
        icon: getCategoryIcon(categoryKey),
        products: []
      };
    }

    // Verificar se produto já existe
    const existingProduct = updatedData.categories[categoryKey].products.find(p => p.id === product.id);
    if (!existingProduct) {
      updatedData.categories[categoryKey].products.push(product);
      totalNewProducts++;
    }
  });

  // Atualizar metadata
  const totalCategories = Object.keys(updatedData.categories).length;
  const totalProducts = Object.values(updatedData.categories).reduce((sum, cat) => sum + cat.products.length, 0);

  updatedData.metadata.lastUpdated = new Date().toISOString();
  updatedData.metadata.totalCategories = totalCategories;
  updatedData.metadata.totalProducts = totalProducts;
  updatedData.metadata.totalImages = totalProducts + totalImagesProcessed;

  // Salvar dados atualizados
  try {
    fs.writeFileSync(PRODUCTS_DATA_FILE, JSON.stringify(updatedData, null, 2));
    console.log(`\n✅ Dados de produtos atualizados com sucesso!`);
    console.log(`📊 Resumo:`);
    console.log(`   - Categorias totais: ${totalCategories}`);
    console.log(`   - Novos produtos adicionados: ${totalNewProducts}`);
    console.log(`   - Total de produtos: ${totalProducts}`);
    console.log(`   - Total de imagens processadas: ${totalImagesProcessed}`);
    console.log(`   - Arquivo salvo em: ${PRODUCTS_DATA_FILE}`);
  } catch (error) {
    console.error('❌ Erro ao salvar arquivo de produtos:', error.message);
    process.exit(1);
  }

  console.log('\n🎯 Próximos passos:');
  console.log('   1. Verificar o arquivo de produtos atualizado');
  console.log('   2. Testar a exibição no catálogo');
  console.log('   3. Ajustar preços se necessário');
  console.log('   4. Configurar produtos em destaque');
}

// Função para obter nome de exibição da categoria
function getCategoryDisplayName(categoryKey) {
  const displayNames = {
    'bio-extratus': 'Bio Extratus',
    'tratamento-capilar': 'Tratamento Capilar',
    'esmaltes': 'Esmaltes',
    'hidratacao': 'Produtos de Hidratação',
    'progressiva': 'Progressivas',
    'relaxamento': 'Relaxamentos',
    'selagem': 'Selagem',
    'coloracao': 'Coloração'
  };
  return displayNames[categoryKey] || categoryKey;
}

// Função para obter ícone da categoria
function getCategoryIcon(categoryKey) {
  const icons = {
    'bio-extratus': '🌿',
    'tratamento-capilar': '💆‍♀️',
    'esmaltes': '💅',
    'hidratacao': '💧',
    'progressiva': '✨',
    'relaxamento': '🌟',
    'selagem': '🔒',
    'coloracao': '🎨'
  };
  return icons[categoryKey] || '📦';
}

// Executar script
updateProductImages();