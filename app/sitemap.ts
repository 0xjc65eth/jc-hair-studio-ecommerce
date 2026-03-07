/**
 * Dynamic Sitemap Generator - Next.js App Router
 * JC Hair Studio's 62
 *
 * WHY: Static sitemaps become outdated. This generates fresh sitemaps
 * on every request with current product data and all European locales.
 *
 * HOW: Uses Next.js MetadataRoute.Sitemap to auto-generate /sitemap.xml
 */

import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';

// European locales supported
const EU_LOCALES = [
  'pt-PT', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'nl-NL', 'pl-PL',
];

// Main pages with their priorities and change frequencies
const MAIN_PAGES = [
  { path: '', priority: 1.0, changeFrequency: 'daily' as const },
  { path: '/produtos', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/mega-hair', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/maquiagem', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/cosmeticos', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/progressiva-vogue-portugal', priority: 0.85, changeFrequency: 'weekly' as const },
  { path: '/tintas-wella-portugal', priority: 0.85, changeFrequency: 'weekly' as const },
  { path: '/esmaltes-impala-portugal', priority: 0.85, changeFrequency: 'weekly' as const },
  { path: '/mari-maria-makeup-portugal', priority: 0.85, changeFrequency: 'weekly' as const },
];

// Category pages
const CATEGORY_PAGES = [
  '/produtos/mega-hair',
  '/produtos/progressivas-alisamentos',
  '/produtos/shampoos-condicionadores',
  '/produtos/tratamentos-capilares',
  '/produtos/coloracao-tintas',
  '/produtos/maquiagem',
  '/produtos/cosmeticos',
];

// Static pages
const STATIC_PAGES = [
  { path: '/sobre', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/contato', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/legal/termos', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/legal/privacidade', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/legal/cookies', priority: 0.3, changeFrequency: 'yearly' as const },
];

/**
 * Generate alternates (hreflang) for a given path
 */
function generateAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {
    'x-default': `${SITE_URL}${path}`,
  };

  for (const locale of EU_LOCALES) {
    languages[locale] = `${SITE_URL}/${locale}${path}`;
  }

  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const entries: MetadataRoute.Sitemap = [];

  // 1. Main pages with hreflang alternates
  for (const page of MAIN_PAGES) {
    entries.push({
      url: `${SITE_URL}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: generateAlternates(page.path),
      },
    });
  }

  // 2. Locale homepage entries
  for (const locale of EU_LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  // 3. Category pages (for primary locale)
  for (const categoryPath of CATEGORY_PAGES) {
    entries.push({
      url: `${SITE_URL}/pt-PT${categoryPath}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
      alternates: {
        languages: generateAlternates(categoryPath),
      },
    });
  }

  // 4. Static pages
  for (const page of STATIC_PAGES) {
    entries.push({
      url: `${SITE_URL}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  // 5. Dynamic products from database (if available)
  try {
    // Try to fetch products from the API for dynamic sitemap entries
    const productsResponse = await fetch(`${SITE_URL}/api/products?limit=100`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    }).catch(() => null);

    if (productsResponse?.ok) {
      const data = await productsResponse.json();
      const products = data.products || data.data || [];

      for (const product of products) {
        if (product.slug) {
          entries.push({
            url: `${SITE_URL}/produto/${product.slug}`,
            lastModified: product.updatedAt || now,
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates: {
              languages: generateAlternates(`/produto/${product.slug}`),
            },
          });
        }
      }
    }
  } catch {
    // Products API not available - use static entries only
    // This is fine for initial indexing
  }

  return entries;
}
