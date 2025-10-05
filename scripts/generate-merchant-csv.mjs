#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://jchairstudios62.xyz';

function escapeCSV(text) {
  if (!text) return '';
  const str = String(text);
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function loadProducts() {
  const productsPath = path.join(process.cwd(), 'lib/data/products-with-european-pricing.json');
  const data = fs.readFileSync(productsPath, 'utf-8');
  const catalog = JSON.parse(data);

  if (catalog.categories && Array.isArray(catalog.categories)) {
    const allProducts = [];
    catalog.categories.forEach(category => {
      if (category.products && Array.isArray(category.products)) {
        category.products.forEach(product => {
          allProducts.push({
            ...product,
            category: category.slug || category.id
          });
        });
      }
    });
    return allProducts;
  }
  return [];
}

function mapToGoogleCategory(category) {
  const mapping = {
    'mega-hair': 'Health & Beauty > Personal Care > Hair Care > Hair Extensions',
    'progressivas-alisamentos': 'Health & Beauty > Personal Care > Hair Care > Hair Treatments',
    'progressivas-btx': 'Health & Beauty > Personal Care > Hair Care > Hair Treatments',
    'shampoos-condicionadores': 'Health & Beauty > Personal Care > Hair Care > Shampoo & Conditioner',
    'tratamentos-capilares': 'Health & Beauty > Personal Care > Hair Care > Hair Treatments',
    'coloracao-tintas': 'Health & Beauty > Personal Care > Hair Care > Hair Color',
    'maquiagem': 'Health & Beauty > Personal Care > Cosmetics > Makeup',
    'cosmeticos': 'Health & Beauty > Personal Care > Cosmetics',
  };
  return mapping[category] || 'Health & Beauty > Personal Care';
}

// Main execution
const products = loadProducts();
const filtered = products.filter(p => p.id && p.name && (p.price || p.pricing?.ourPrice));

console.log('🔄 Generating Google Merchant CSV...\n');

// CSV Header (Google Merchant Center required fields)
const headers = [
  'id',
  'title',
  'description',
  'link',
  'image_link',
  'availability',
  'price',
  'brand',
  'condition',
  'google_product_category',
  'product_type',
  'shipping',
  'mpn'
];

let csv = headers.join(',') + '\n';

filtered.forEach(product => {
  const productUrl = `${SITE_URL}/produto/${product.slug || product.id}`;
  const imageUrl = product.images && product.images[0]
    ? (product.images[0].startsWith('http') ? product.images[0] : `${SITE_URL}${product.images[0]}`)
    : `${SITE_URL}/images/placeholder.jpg`;

  // Use discountPrice (promotional) if available, otherwise ourPrice
  const regularPrice = product.pricing?.ourPrice || product.price;
  const salePrice = product.pricing?.discountPrice;
  const finalPrice = salePrice || regularPrice;

  const availability = (product.inStock || product.stock > 0 || product.stockQuantity > 0) ? 'in stock' : 'out of stock';
  const description = (product.description || product.shortDesc || product.name).substring(0, 5000);

  const row = [
    escapeCSV(product.id),
    escapeCSV(product.name),
    escapeCSV(description),
    escapeCSV(productUrl),
    escapeCSV(imageUrl),
    escapeCSV(availability),
    escapeCSV(`${finalPrice} EUR`),
    escapeCSV(product.brand || 'JC Hair Studio'),
    'new',
    escapeCSV(mapToGoogleCategory(product.category)),
    escapeCSV(product.category),
    'PT::Standard:4.90 EUR',
    escapeCSV(product.mpn || product.sku || product.id)
  ];

  csv += row.join(',') + '\n';
});

// Save CSV
const outputPath = path.join(process.cwd(), 'public', 'google-merchant-feed.csv');
fs.writeFileSync(outputPath, csv, 'utf-8');

console.log(`✅ CSV feed generated: ${outputPath}`);
console.log(`📊 Total products: ${filtered.length}`);
console.log(`\n📋 Next Steps:`);
console.log(`1. Faça upload do arquivo em: ${outputPath}`);
console.log(`2. Ou importe para Google Sheets`);
console.log(`3. Configure no Google Merchant Center\n`);
