import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFile = path.join(__dirname, '../lib/data/products-with-european-pricing.json');
const jsonData = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

// Extrair todos os produtos de todas as categorias
const allProducts = [];
if (jsonData.categories) {
  jsonData.categories.forEach(category => {
    if (category.products) {
      allProducts.push(...category.products);
    }
  });
}

console.log('=== ANÁLISE DE IMAGENS AUSENTES ===\n');
console.log(`Total de produtos: ${allProducts.length}`);

const productsWithoutImages = allProducts.filter(p =>
  !p.image ||
  p.image === '' ||
  p.image.includes('placeholder') ||
  p.image === '/images/placeholder-product.jpg'
);

console.log(`Produtos SEM imagens válidas: ${productsWithoutImages.length}\n`);

if (productsWithoutImages.length > 0) {
  console.log('=== PRODUTOS SEM IMAGENS ===\n');
  productsWithoutImages.forEach((p, i) => {
    console.log(`${i+1}. ${p.name}`);
    console.log(`   ID: ${p.id}`);
    console.log(`   Categoria: ${p.category || 'N/A'}`);
    console.log(`   Imagem atual: ${p.image || 'VAZIO'}`);
    console.log('');
  });
}

// Verificar se as imagens referenciadas existem fisicamente
console.log('\n=== VERIFICAÇÃO DE IMAGENS FÍSICAS ===\n');

const productsWithImages = allProducts.filter(p =>
  p.image &&
  p.image !== '' &&
  !p.image.includes('placeholder')
);

let missingFiles = [];
productsWithImages.forEach(p => {
  const imagePath = path.join(__dirname, '../public', p.image);
  if (!fs.existsSync(imagePath)) {
    missingFiles.push({
      product: p.name,
      expectedPath: p.image,
      fullPath: imagePath
    });
  }
});

if (missingFiles.length > 0) {
  console.log(`Produtos com imagens referenciadas mas ARQUIVOS AUSENTES: ${missingFiles.length}\n`);
  missingFiles.forEach((item, i) => {
    console.log(`${i+1}. ${item.product}`);
    console.log(`   Caminho esperado: ${item.expectedPath}`);
    console.log('');
  });
} else {
  console.log('✅ Todas as imagens referenciadas existem fisicamente!');
}

console.log('\n=== RESUMO ===');
console.log(`Total de produtos: ${allProducts.length}`);
console.log(`Produtos sem imagem: ${productsWithoutImages.length}`);
console.log(`Produtos com imagem: ${productsWithImages.length}`);
console.log(`Arquivos de imagem ausentes: ${missingFiles.length}`);
console.log(`\n=== DISTRIBUIÇÃO POR CATEGORIA ===`);
jsonData.categories.forEach(cat => {
  const categoryProducts = cat.products || [];
  const withoutImg = categoryProducts.filter(p =>
    !p.image || p.image === '' || p.image.includes('placeholder')
  ).length;
  console.log(`${cat.name}: ${categoryProducts.length} produtos, ${withoutImg} sem imagem`);
});
