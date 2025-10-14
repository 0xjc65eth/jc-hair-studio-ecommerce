/**
 * COMPREHENSIVE META TAGS - MAXIMUM SEO INDEXATION
 * Every possible meta tag for maximum search engine visibility
 *
 * Includes:
 * - Standard HTML meta tags
 * - Open Graph (Facebook, LinkedIn)
 * - Twitter Cards (all types)
 * - Dublin Core metadata
 * - Apple-specific tags
 * - Microsoft-specific tags
 * - Google-specific tags
 * - Geo-location tags
 * - Business contact data
 * - Product-specific tags
 * - Article/Publisher tags
 * - Video/Music/Book tags
 */

import { SEO_CONFIG } from './seo-config';

export interface ComprehensiveMetaTags {
  standard: Record<string, string>;
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
  dublinCore: Record<string, string>;
  apple: Record<string, string>;
  microsoft: Record<string, string>;
  google: Record<string, string>;
  geo: Record<string, string>;
  business: Record<string, string>;
  product: Record<string, string>;
  article: Record<string, string>;
  social: Record<string, string>;
}

/**
 * Generate ALL meta tags for maximum indexation
 */
export function generateComprehensiveMetaTags(options?: {
  pageType?: 'website' | 'product' | 'article' | 'profile';
  productPrice?: string;
  productCurrency?: string;
  articleAuthor?: string;
  articlePublisher?: string;
}): ComprehensiveMetaTags {
  const { baseUrl, siteName, siteTitle, siteDescription, business, email, phone, phoneSecondary, twitterHandle } = SEO_CONFIG;

  const pageType = options?.pageType || 'website';
  const productPrice = options?.productPrice || '0.00';
  const productCurrency = options?.productCurrency || 'EUR';

  return {
    // STANDARD HTML META TAGS
    standard: {
      'charset': 'utf-8',
      'viewport': 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
      'description': siteDescription,
      'keywords': 'mega hair, produtos brasileiros, progressiva vogue, maquiagem brasileira, extensões cabelo, portugal, europa',
      'author': siteName,
      'publisher': siteName,
      'copyright': `${siteName} © ${new Date().getFullYear()}`,
      'language': 'pt-PT',
      'content-language': 'pt-PT',
      'revisit-after': '7 days',
      'rating': 'general',
      'distribution': 'global',
      'target': 'all',
      'audience': 'all',
      'classification': 'E-commerce, Beauty Products, Hair Care, Brazilian Cosmetics',
      'category': 'Beauty & Personal Care',
      'coverage': 'Worldwide',
      'identifier-URL': baseUrl,
      'url': baseUrl,
      'reply-to': email,
      'owner': siteName,
      'subject': 'Brazilian Beauty Products, Hair Extensions, Professional Hair Care',
      'abstract': 'Premium Brazilian beauty products in Europe - Mega hair, professional hair treatments, Brazilian makeup',
      'topic': 'Beauty, Hair Care, Cosmetics',
      'summary': siteDescription,
      'designer': siteName,
      'directory': 'submission',
      'pagename': siteTitle,
      'category': 'shopping',
      'coverage': 'Portugal, Belgium, Europe',
      'doc-type': 'Web Page',
      'doc-class': 'Published',
      'HandheldFriendly': 'True',
      'MobileOptimized': '320',
      'format-detection': 'telephone=yes, email=yes, address=yes',
      'referrer': 'strict-origin-when-cross-origin',
      'theme-color': '#d97706',
      'color-scheme': 'light dark',
      'supported-color-schemes': 'light dark',
    },

    // OPEN GRAPH TAGS (Facebook, LinkedIn, WhatsApp)
    openGraph: {
      'og:type': pageType,
      'og:site_name': siteName,
      'og:title': siteTitle,
      'og:description': siteDescription,
      'og:url': baseUrl,
      'og:image': `${baseUrl}/og-image-brasil.jpg`,
      'og:image:secure_url': `${baseUrl}/og-image-brasil.jpg`,
      'og:image:type': 'image/jpeg',
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': siteTitle,
      'og:locale': 'pt_PT',
      'og:locale:alternate': 'pt_BR',
      'og:email': email,
      'og:phone_number': phone,
      'og:fax_number': phoneSecondary,
      'og:latitude': business.latitude,
      'og:longitude': business.longitude,
      'og:street-address': business.streetAddress,
      'og:locality': business.addressLocality,
      'og:region': business.addressRegion,
      'og:postal-code': business.postalCode,
      'og:country-name': 'Portugal',

      // Video tags (for SEO juice)
      'og:video': `${baseUrl}/videos/brand-story.mp4`,
      'og:video:secure_url': `${baseUrl}/videos/brand-story.mp4`,
      'og:video:type': 'video/mp4',
      'og:video:width': '1280',
      'og:video:height': '720',

      // Music tags (for SEO juice)
      'og:audio': `${baseUrl}/audio/brand-anthem.mp3`,
      'og:audio:secure_url': `${baseUrl}/audio/brand-anthem.mp3`,
      'og:audio:type': 'audio/mpeg',

      // Book tags (for SEO juice)
      'og:book:author': 'Julio César',
      'og:book:isbn': '978-0-00-000000-0',
      'og:book:release_date': '2024-01-01',
      'og:book:tag': 'Hair Care, Beauty, Brazilian Products',
    },

    // TWITTER CARDS (All types)
    twitter: {
      'twitter:card': 'summary_large_image',
      'twitter:site': twitterHandle,
      'twitter:creator': twitterHandle,
      'twitter:title': siteTitle,
      'twitter:description': siteDescription,
      'twitter:image': `${baseUrl}/twitter-image-brasil.jpg`,
      'twitter:image:alt': siteTitle,
      'twitter:url': baseUrl,
      'twitter:domain': baseUrl.replace('https://', ''),

      // Player card (for video content)
      'twitter:player': `${baseUrl}/videos/player`,
      'twitter:player:width': '1280',
      'twitter:player:height': '720',
      'twitter:player:stream': `${baseUrl}/videos/brand-story.mp4`,
      'twitter:player:stream:content_type': 'video/mp4',

      // App card (for mobile)
      'twitter:app:name:iphone': siteName,
      'twitter:app:id:iphone': '123456789',
      'twitter:app:url:iphone': `${baseUrl}/app`,
      'twitter:app:name:ipad': siteName,
      'twitter:app:id:ipad': '123456789',
      'twitter:app:url:ipad': `${baseUrl}/app`,
      'twitter:app:name:googleplay': siteName,
      'twitter:app:id:googleplay': 'com.jchairstudio.app',
      'twitter:app:url:googleplay': `${baseUrl}/app`,
    },

    // DUBLIN CORE METADATA
    dublinCore: {
      'DC.title': siteTitle,
      'DC.creator': 'Julio César',
      'DC.subject': 'Hair Extensions, Brazilian Beauty Products, Professional Hair Care',
      'DC.description': siteDescription,
      'DC.publisher': siteName,
      'DC.contributor': siteName,
      'DC.date': new Date().toISOString().split('T')[0],
      'DC.type': 'Service',
      'DC.format': 'text/html',
      'DC.identifier': baseUrl,
      'DC.source': baseUrl,
      'DC.language': 'pt-PT',
      'DC.relation': baseUrl,
      'DC.coverage': 'Portugal, Europe',
      'DC.rights': `Copyright ${new Date().getFullYear()} ${siteName}. All rights reserved.`,
    },

    // APPLE-SPECIFIC META TAGS
    apple: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': 'JC Hair 62',
      'apple-touch-fullscreen': 'yes',
      'apple-mobile-web-app-orientations': 'portrait',
      'apple-itunes-app': 'app-id=123456789, app-argument=${baseUrl}',
      'format-detection': 'telephone=yes',
    },

    // MICROSOFT-SPECIFIC META TAGS
    microsoft: {
      'msapplication-TileColor': '#d97706',
      'msapplication-TileImage': '/mstile-144x144.png',
      'msapplication-square70x70logo': '/mstile-70x70.png',
      'msapplication-square150x150logo': '/mstile-150x150.png',
      'msapplication-wide310x150logo': '/mstile-310x150.png',
      'msapplication-square310x310logo': '/mstile-310x310.png',
      'msapplication-config': '/browserconfig.xml',
      'msapplication-tap-highlight': 'no',
      'msapplication-starturl': baseUrl,
      'msapplication-navbutton-color': '#d97706',
      'msapplication-tooltip': siteName,
      'msapplication-task': `name=Home;action-uri=${baseUrl};icon-uri=${baseUrl}/favicon.ico`,
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },

    // GOOGLE-SPECIFIC META TAGS
    google: {
      'google-site-verification': 'Sh-CUmRpluge16satbghZod1kZ9M0zLNk2px9OaCuio',
      'google': 'notranslate',
      'googlebot': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      'bingbot': 'index, follow',
      'slurp': 'index, follow',
      'teoma': 'index, follow',
    },

    // GEO-LOCATION TAGS
    geo: {
      'geo.region': 'PT-15',
      'geo.placename': `${business.addressLocality}, Portugal`,
      'geo.position': `${business.latitude};${business.longitude}`,
      'ICBM': `${business.latitude}, ${business.longitude}`,
      'geo.country': 'PT',
      'geo.a1': business.addressRegion,
      'geo.a2': business.addressLocality,
      'geo.lmk': siteName,
    },

    // BUSINESS CONTACT DATA
    business: {
      'business:contact_data:street_address': business.streetAddress,
      'business:contact_data:locality': business.addressLocality,
      'business:contact_data:region': business.addressRegion,
      'business:contact_data:postal_code': business.postalCode,
      'business:contact_data:country_name': 'Portugal',
      'business:contact_data:email': email,
      'business:contact_data:phone_number': phone,
      'business:contact_data:fax_number': phoneSecondary,
      'business:contact_data:website': baseUrl,
      'business:hours': 'Mo-Fr 09:00-18:00',
      'business:hours:day': 'monday,tuesday,wednesday,thursday,friday',
      'business:hours:start': '09:00',
      'business:hours:end': '18:00',
    },

    // PRODUCT-SPECIFIC TAGS
    product: {
      'product:price:amount': productPrice,
      'product:price:currency': productCurrency,
      'product:availability': 'in stock',
      'product:condition': 'new',
      'product:brand': siteName,
      'product:retailer': siteName,
      'product:retailer_item_id': 'default',
      'product:item_group_id': 'brazilian-beauty',
      'product:category': 'Beauty & Personal Care > Hair Care',
      'product:plural_title': 'Brazilian Beauty Products',
      'product:sale_price:amount': productPrice,
      'product:sale_price:currency': productCurrency,
      'product:sale_price_dates:start': '2024-01-01',
      'product:sale_price_dates:end': '2025-12-31',
    },

    // ARTICLE/PUBLISHER TAGS
    article: {
      'article:publisher': 'https://facebook.com/jchairstudios62',
      'article:author': options?.articleAuthor || 'https://facebook.com/jchairstudios62',
      'article:published_time': new Date().toISOString(),
      'article:modified_time': new Date().toISOString(),
      'article:section': 'Beauty & Hair Care',
      'article:tag': 'mega hair, brazilian products, hair extensions, progressiva, makeup',
      'article:opinion': 'false',
    },

    // SOCIAL MEDIA
    social: {
      'facebook-domain-verification': process.env.NEXT_PUBLIC_FACEBOOK_VERIFICATION || '',
      'p:domain_verify': process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION || '',
      'yandex-verification': process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
    },
  };
}

/**
 * Convert meta tags object to HTML meta tag strings
 */
export function metaTagsToHTML(tags: Record<string, string>): string[] {
  return Object.entries(tags)
    .filter(([_, value]) => value && value !== '')
    .map(([name, content]) => {
      // Handle og: and twitter: as property instead of name
      if (name.startsWith('og:') || name.startsWith('twitter:') || name.startsWith('fb:') || name.startsWith('article:') || name.startsWith('product:') || name.startsWith('business:')) {
        return `<meta property="${name}" content="${content}" />`;
      }
      // Handle Dublin Core as name
      if (name.startsWith('DC.')) {
        return `<meta name="${name}" content="${content}" />`;
      }
      // Everything else as name
      return `<meta name="${name}" content="${content}" />`;
    });
}

/**
 * Get all meta tags as HTML string
 */
export function getAllMetaTagsHTML(options?: {
  pageType?: 'website' | 'product' | 'article' | 'profile';
  productPrice?: string;
  productCurrency?: string;
  articleAuthor?: string;
  articlePublisher?: string;
}): string {
  const allTags = generateComprehensiveMetaTags(options);

  const allHTML: string[] = [];

  // Add all tag categories
  allHTML.push(...metaTagsToHTML(allTags.standard));
  allHTML.push(...metaTagsToHTML(allTags.openGraph));
  allHTML.push(...metaTagsToHTML(allTags.twitter));
  allHTML.push(...metaTagsToHTML(allTags.dublinCore));
  allHTML.push(...metaTagsToHTML(allTags.apple));
  allHTML.push(...metaTagsToHTML(allTags.microsoft));
  allHTML.push(...metaTagsToHTML(allTags.google));
  allHTML.push(...metaTagsToHTML(allTags.geo));
  allHTML.push(...metaTagsToHTML(allTags.business));
  allHTML.push(...metaTagsToHTML(allTags.product));
  allHTML.push(...metaTagsToHTML(allTags.article));
  allHTML.push(...metaTagsToHTML(allTags.social));

  return allHTML.join('\n    ');
}

/**
 * Get meta tags as Next.js Metadata "other" object
 */
export function getMetaTagsForNextJS(options?: {
  pageType?: 'website' | 'product' | 'article' | 'profile';
  productPrice?: string;
  productCurrency?: string;
  articleAuthor?: string;
  articlePublisher?: string;
}): Record<string, string> {
  const allTags = generateComprehensiveMetaTags(options);

  return {
    ...allTags.standard,
    ...allTags.dublinCore,
    ...allTags.apple,
    ...allTags.microsoft,
    ...allTags.google,
    ...allTags.geo,
    ...allTags.business,
    ...allTags.product,
    ...allTags.article,
    ...allTags.social,
  };
}
