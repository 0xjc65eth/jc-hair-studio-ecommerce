#!/usr/bin/env node

/**
 * Google Merchant Feed Generator - JC Hair Studio
 *
 * WHY: Generate product feed for Google Shopping / Merchant Center
 * HOW: Convert product catalog to Google Shopping XML format
 *
 * Features:
 * - Google Shopping XML format
 * - All required fields (id, title, description, price, etc)
 * - Image URLs, availability, categories
 * - GTIN/MPN when available
 *
 * @see https://support.google.com/merchants/answer/7052112
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://jchairstudios62.xyz';

/**
 * WHY: Load products from catalog
 * HOW: Read JSON file and parse, extract products from categories
 */
function loadProducts() {
  const productsPath = path.join(process.cwd(), 'lib/data/products-with-european-pricing.json');
  const data = fs.readFileSync(productsPath, 'utf-8');
  const catalog = JSON.parse(data);

  // Extract products from categories structure
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

  // Fallback: if it's already an array
  return Array.isArray(catalog) ? catalog : [];
}

/**
 * WHY: Escape XML special characters
 * HOW: Replace <, >, &, ', " with entities
 */
function escapeXml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * WHY: Map product category to Google category
 * HOW: Use Google Product Taxonomy
 *
 * @see https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
 */
function mapToGoogleCategory(category) {
  const mapping = {
    'mega-hair': '469 > Health & Beauty > Personal Care > Hair Care > Hair Extensions',
    'progressivas-alisamentos': '469 > Health & Beauty > Personal Care > Hair Care > Hair Treatments',
    'shampoos-condicionadores': '469 > Health & Beauty > Personal Care > Hair Care > Shampoo & Conditioner',
    'tratamentos-capilares': '469 > Health & Beauty > Personal Care > Hair Care > Hair Treatments',
    'coloracao-tintas': '469 > Health & Beauty > Personal Care > Hair Care > Hair Color',
    'maquiagem': '469 > Health & Beauty > Personal Care > Cosmetics > Makeup',
    'cosmeticos': '469 > Health & Beauty > Personal Care > Cosmetics',
  };

  return mapping[category] || '469 > Health & Beauty > Personal Care';
}

/**
 * WHY: Generate product XML entry for Google Shopping
 * HOW: Create <item> with all required Google Shopping fields
 */
function generateProductXml(product) {
  const productUrl = `${SITE_URL}/produto/${product.slug || product.id}`;
  const imageUrl = product.images && product.images[0]
    ? (product.images[0].startsWith('http') ? product.images[0] : `${SITE_URL}${product.images[0]}`)
    : `${SITE_URL}/images/placeholder.jpg`;

  // Calculate availability
  const availability = (product.stock && product.stock > 0) ? 'in stock' : 'out of stock';

  // Get condition (new for all products)
  const condition = 'new';

  // Generate description (max 5000 chars for Google)
  let description = product.description || product.name;
  if (description.length > 5000) {
    description = description.substring(0, 4997) + '...';
  }

  return `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      ${product.images && product.images.length > 1 ? product.images.slice(1, 11).map(img => {
        const imgUrl = img.startsWith('http') ? img : `${SITE_URL}${img}`;
        return `<g:additional_image_link>${escapeXml(imgUrl)}</g:additional_image_link>`;
      }).join('\n      ') : ''}
      <g:availability>${availability}</g:availability>
      <g:price>${product.price} EUR</g:price>
      ${product.compareAtPrice ? `<g:sale_price>${product.price} EUR</g:sale_price>` : ''}
      <g:brand>${escapeXml(product.brand || 'JC Hair Studio')}</g:brand>
      <g:condition>${condition}</g:condition>
      <g:google_product_category>${escapeXml(mapToGoogleCategory(product.category))}</g:google_product_category>
      <g:product_type>${escapeXml(product.category)}</g:product_type>
      ${product.gtin ? `<g:gtin>${escapeXml(product.gtin)}</g:gtin>` : ''}
      ${product.mpn ? `<g:mpn>${escapeXml(product.mpn)}</g:mpn>` : ''}
      <g:item_group_id>${escapeXml(product.category)}</g:item_group_id>
      ${product.color ? `<g:color>${escapeXml(product.color)}</g:color>` : ''}
      ${product.size ? `<g:size>${escapeXml(product.size)}</g:size>` : ''}
      <g:shipping>
        <g:country>PT</g:country>
        <g:service>Standard</g:service>
        <g:price>4.90 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>PT</g:country>
        <g:service>Free Shipping</g:service>
        <g:price>0.00 EUR</g:price>
        <g:min_order_value>50.00 EUR</g:min_order_value>
      </g:shipping>
    </item>`;
}

/**
 * WHY: Generate complete Google Shopping feed
 * HOW: Wrap all products in RSS/Atom feed format
 */
function generateFeed(products) {
  const currentDate = new Date().toISOString();

  const header = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>JC Hair Studio's 62 - Premium Hair Extensions & Brazilian Cosmetics</title>
    <link>${SITE_URL}</link>
    <description>Premium Brazilian hair extensions, straightening treatments, and authentic Brazilian cosmetics. 100% human hair, professional salon quality.</description>
    <language>pt-PT</language>
    <lastBuildDate>${currentDate}</lastBuildDate>`;

  const footer = `
  </channel>
</rss>`;

  const items = products
    .filter(p => p.id && p.name && p.price)
    .map(generateProductXml)
    .join('\n');

  return header + items + footer;
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Generating Google Merchant product feed...\n');

  // Load products
  const products = loadProducts();
  console.log(`✅ Loaded ${products.length} products from catalog`);

  // Generate feed
  const feedXml = generateFeed(products);

  // Save to public directory
  const outputPath = path.join(process.cwd(), 'public', 'product-feed.xml');
  const publicDir = path.join(process.cwd(), 'public');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, feedXml, 'utf-8');

  console.log(`✅ Product feed generated: public/product-feed.xml`);
  console.log(`📊 Total products in feed: ${products.length}`);
  console.log(`🌐 Feed URL: ${SITE_URL}/product-feed.xml\n`);

  console.log('📋 Next Steps:');
  console.log('1. Upload feed to your site (already done)');
  console.log('2. Go to Google Merchant Center: https://merchants.google.com/');
  console.log('3. Click "Products" → "Feeds" → "Add feed"');
  console.log(`4. Enter feed URL: ${SITE_URL}/product-feed.xml`);
  console.log('5. Set schedule to fetch daily');
  console.log('6. Products will appear in Google Shopping within 24-48 hours\n');

  console.log('💡 TIP: Re-run this script when products change');
  console.log('    npm run seo:generate-feed\n');
}

main();
