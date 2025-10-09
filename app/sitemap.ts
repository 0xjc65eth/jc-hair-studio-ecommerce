/**
 * Dynamic Sitemap Generator - JC Hair Studio
 *
 * WHY: Generate comprehensive sitemap for Google/Bing indexing
 * HOW: Dynamically load all products and pages from database/catalog
 *
 * Features:
 * - All static pages with proper priorities
 * - Dynamic product pages from catalog
 * - Category pages
 * - Multi-language support
 * - Proper change frequencies for better crawling
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://jchairstudios62.xyz';

/**
 * WHY: Load products from catalog for dynamic sitemap generation
 * HOW: Read JSON file and parse product data
 */
function getProducts() {
  try {
    const productsPath = path.join(process.cwd(), 'lib/data/products-with-european-pricing.json');
    const productsData = fs.readFileSync(productsPath, 'utf-8');
    const products = JSON.parse(productsData);
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error loading products for sitemap:', error);
    return [];
  }
}

/**
 * WHY: Generate sitemap with all indexable URLs
 * HOW: Combine static pages + dynamic product pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const products = getProducts();
  const currentDate = new Date();

  // Static pages with SEO priorities
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0, // Homepage - highest priority
    },
    {
      url: `${baseUrl}/produtos`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9, // All products page
    },
    {
      url: `${baseUrl}/mega-hair`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9, // Main category
    },
    {
      url: `${baseUrl}/maquiagem`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cosmeticos`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/progressiva-vogue-portugal`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85, // Popular product page
    },
    {
      url: `${baseUrl}/tintas-wella-portugal`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/esmaltes-impala-portugal`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/mari-maria-makeup-portugal`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/legal/termos`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/privacidade`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/cookies`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Multi-language pages (Portuguese, English, Spanish, French)
  const languages = ['pt', 'en', 'es', 'fr'];
  const languagePages: MetadataRoute.Sitemap = languages.flatMap(lang => [
    {
      url: `${baseUrl}/${lang}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${lang}/produtos`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/${lang}/sobre`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]);

  // Category pages
  const categories = [
    'mega-hair',
    'progressivas-alisamentos',
    'shampoos-condicionadores',
    'tratamentos-capilares',
    'coloracao-tintas',
    'maquiagem',
    'cosmeticos',
  ];

  const categoryPages: MetadataRoute.Sitemap = languages.flatMap(lang =>
    categories.map(category => ({
      url: `${baseUrl}/${lang}/produtos/${category}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }))
  );

  // Dynamic product pages
  const productPages: MetadataRoute.Sitemap = products
    .filter((product: any) => product.id && product.slug)
    .map((product: any) => ({
      url: `${baseUrl}/produto/${product.slug || product.id}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  // Multi-language product pages
  const multiLangProductPages: MetadataRoute.Sitemap = languages.flatMap(lang =>
    products
      .filter((product: any) => product.id && product.slug)
      .map((product: any) => ({
        url: `${baseUrl}/${lang}/produto/${product.slug || product.id}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      }))
  );

  // Combine all pages
  const allPages = [
    ...staticPages,
    ...languagePages,
    ...categoryPages,
    ...productPages,
    ...multiLangProductPages,
  ];

  console.log(`✅ Sitemap generated with ${allPages.length} URLs`);

  return allPages;
}
