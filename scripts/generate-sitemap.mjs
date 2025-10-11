/**
 * Generate comprehensive sitemap with all products for Google indexation
 * Run: node scripts/generate-sitemap.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://jchairstudios62.xyz';
const currentDate = new Date().toISOString();

// Load products from JSON
const productsPath = path.join(__dirname, '../lib/data/products-with-european-pricing.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

// Extract all products from all categories
const allProducts = [];
if (productsData.categories && Array.isArray(productsData.categories)) {
  productsData.categories.forEach((category) => {
    if (category.products && Array.isArray(category.products)) {
      allProducts.push(...category.products);
    }
  });
}

console.log(`✅ Loaded ${allProducts.length} products from JSON`);

// Generate sitemap XML
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

// Static pages
const staticPages = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: '/produtos', priority: '0.9', changefreq: 'daily' },
  { url: '/produtos-capilares', priority: '0.9', changefreq: 'daily' },
  { url: '/progressiva', priority: '0.9', changefreq: 'daily' },
  { url: '/mega-hair', priority: '0.9', changefreq: 'weekly' },
  { url: '/maquiagens', priority: '0.8', changefreq: 'weekly' },
  { url: '/cosmeticos', priority: '0.8', changefreq: 'weekly' },
  { url: '/tratamentos-capilares', priority: '0.85', changefreq: 'weekly' },
  { url: '/shampoos-condicionadores', priority: '0.8', changefreq: 'weekly' },
  { url: '/progressiva-vogue-portugal', priority: '0.9', changefreq: 'weekly' },
  { url: '/esmaltes-impala-portugal', priority: '0.85', changefreq: 'weekly' },
  { url: '/mari-maria-makeup-portugal', priority: '0.85', changefreq: 'weekly' },
  { url: '/progressiva-brasileira', priority: '0.9', changefreq: 'weekly' },
  { url: '/mega-hair-brasileiro', priority: '0.9', changefreq: 'weekly' },
  { url: '/perfumes-brasileiros', priority: '0.8', changefreq: 'weekly' },
  { url: '/sobre', priority: '0.6', changefreq: 'monthly' },
  { url: '/contato', priority: '0.6', changefreq: 'monthly' },
  { url: '/faq', priority: '0.5', changefreq: 'monthly' },
  { url: '/nossa-historia', priority: '0.5', changefreq: 'monthly' },
  { url: '/legal/termos', priority: '0.3', changefreq: 'yearly' },
  { url: '/legal/privacidade', priority: '0.3', changefreq: 'yearly' },
  { url: '/legal/cookies', priority: '0.3', changefreq: 'yearly' },
];

// Add static pages
staticPages.forEach(page => {
  sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
});

// Add multi-language pages
const languages = ['pt', 'en', 'es', 'fr'];
languages.forEach(lang => {
  sitemap += `  <url>
    <loc>${baseUrl}/${lang}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;
  sitemap += `  <url>
    <loc>${baseUrl}/${lang}/produtos</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
`;
});

// Add product pages
allProducts.forEach(product => {
  if (product.id) {
    sitemap += `  <url>
    <loc>${baseUrl}/produto/${product.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }
});

sitemap += `</urlset>`;

// Write sitemap to public folder
const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap);

const totalUrls = staticPages.length + (languages.length * 2) + allProducts.length;
console.log(`✅ Sitemap generated with ${totalUrls} URLs`);
console.log(`   - ${staticPages.length} static pages`);
console.log(`   - ${languages.length * 2} language pages`);
console.log(`   - ${allProducts.length} product pages`);
console.log(`   - Saved to: public/sitemap.xml`);
