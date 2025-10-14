#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MARKUP = 1.51; // 51% markup

// Ler arquivo de relaxamentos HairLife
const relaxersPath = path.join(__dirname, 'data/hair-relaxers-catalog.json');
const relaxersData = JSON.parse(fs.readFileSync(relaxersPath, 'utf8'));

// Ler arquivo de produtos europeus
const europeanPath = path.join(__dirname, '../lib/data/products-with-european-pricing.json');
const europeanData = JSON.parse(fs.readFileSync(europeanPath, 'utf8'));

// Criar backup
const backupPath = path.join(__dirname, `../lib/data/products-european-pricing-backup-${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(europeanData, null, 2));
console.log(`✅ Backup criado: ${path.basename(backupPath)}\n`);

// Filtrar produtos HairLife
const hairlifeProducts = relaxersData.relaxamentos.products.filter(p => p.brand === 'HairLife');

console.log(`🔍 Encontrados ${hairlifeProducts.length} produtos HairLife\n`);

// Converter produtos HairLife para formato europeu
const convertedProducts = hairlifeProducts.map((product, index) => {
  const basePrice = product.price_eur;
  const priceWithMarkup = parseFloat((basePrice * MARKUP).toFixed(2));
  const discountPrice = parseFloat((priceWithMarkup * 0.90).toFixed(2)); // 10% desconto
  const savings = parseFloat((priceWithMarkup - discountPrice).toFixed(2));

  return {
    id: product.id,
    name: product.name,
    slug: product.id,
    brand: product.brand,
    shortDesc: product.description.substring(0, 100) + '...',
    description: product.description,
    sku: `HL-${String(index + 1).padStart(3, '0')}`,
    category: 'Tratamentos Capilares',
    subcategory: 'Relaxamentos',
    finalidade: product.features[0] || 'Tratamento capilar',
    volume: product.features.find(f => f.includes('Kit')) || 'Kit Completo',
    pricing: {
      basePrice: priceWithMarkup,
      ourPrice: priceWithMarkup,
      discountPrice: discountPrice,
      savings: savings,
      margin: '51%',
      competitive: 'Preço competitivo para produtos de relaxamento premium'
    },
    tags: product.features.map(f => f.toLowerCase().replace(/\s+/g, '-')),
    rating: product.rating,
    reviewsCount: product.reviews,
    inStock: true,
    stockQuantity: product.stock,
    weight: 400,
    labels: product.rating >= 4.5 ? ['POPULAR'] : [],
    images: product.images,
    image: product.images[0]
  };
});

// Encontrar categoria tratamentos-capilares
const tratamentosCategory = europeanData.categories.find(c => c.id === 'tratamentos-capilares');

if (!tratamentosCategory) {
  console.error('❌ Categoria "tratamentos-capilares" não encontrada!');
  process.exit(1);
}

console.log(`📦 Categoria encontrada: ${tratamentosCategory.name}`);
console.log(`📊 Produtos atuais: ${tratamentosCategory.products.length}`);
console.log(`\n🔧 Adicionando ${convertedProducts.length} produtos HairLife com markup de 51%...\n`);

// Adicionar produtos convertidos
convertedProducts.forEach((product, index) => {
  console.log(`  ${index + 1}. ${product.name}`);
  console.log(`     Preço base: €${product.pricing.basePrice}`);
  console.log(`     Preço com desconto: €${product.pricing.discountPrice}`);
  console.log(`     Economia: €${product.pricing.savings}`);
  console.log(`     Imagem: ${product.image}`);
  console.log('');
});

tratamentosCategory.products.push(...convertedProducts);

// Salvar arquivo atualizado
fs.writeFileSync(europeanPath, JSON.stringify(europeanData, null, 2));

console.log(`\n✅ Concluído!`);
console.log(`   Total de produtos na categoria: ${tratamentosCategory.products.length}`);
console.log(`   Produtos HairLife adicionados: ${convertedProducts.length}`);
console.log(`   Markup aplicado: 51%`);
console.log(`\n📝 Backup salvo em: ${path.basename(backupPath)}`);
