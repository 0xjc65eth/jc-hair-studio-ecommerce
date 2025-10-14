/**
 * ROBOTS.TXT - CRAWLER CONFIGURATION
 * Guides search engine crawlers to all important pages
 * Purpose: Direct bots to honeypot pages and sitemap
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://jchairstudios62.xyz';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/conta/',
          '/_next/',
          '/admin-simple/',
        ],
      },
      // Special rules for major search engines - guide them to honeypots
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0, // No delay - crawl fast
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Slurp', // Yahoo
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        crawlDelay: 0,
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-html`,
      `${baseUrl}/sitemap-text`,
    ],
    host: baseUrl,
  };
}
