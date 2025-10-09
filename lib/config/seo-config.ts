/**
 * SEO Configuration - JC Hair Studio's 62
 * Configuração centralizada de meta tags otimizadas para SEO máximo
 *
 * Otimizações implementadas:
 * 1. Títulos com max 60 caracteres para mobile SERP
 * 2. Descriptions com max 160 caracteres para melhor CTR
 * 3. Open Graph completo com múltiplas imagens
 * 4. Twitter Cards otimizados
 * 5. hreflang tags para 10+ idiomas
 * 6. Geo-targeting e local SEO
 * 7. Structured data completo
 * 8. Verificações de webmasters (Google, Bing, Yandex, Pinterest, Facebook)
 */

import { Metadata } from 'next';

// Constantes base
export const SEO_CONFIG = {
  siteName: "JC Hair Studio's 62",
  siteTitle: 'Mega Hair & Produtos Brasileiros Premium | JC Hair 62',
  siteDescription: 'Mega hair 100% humano, progressivas Vogue, maquiagem brasileira premium. +40 anos tradição. Entrega rápida Europa. Qualidade garantida.',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz',
  locale: 'pt_PT',
  twitterHandle: '@jchairstudios62',
  email: 'contato@jchairstudios62.xyz',
  phone: '+351928375226',
  phoneSecondary: '+32472384027',

  // Informações de negócio
  business: {
    name: "JC Hair Studio's 62",
    streetAddress: 'R. Gil Vicente, N°5',
    addressLocality: 'Seixal',
    addressRegion: 'Setúbal',
    postalCode: '2840-474',
    addressCountry: 'PT',
    latitude: '38.6500',
    longitude: '-9.1000',
  },

  // Social media profiles
  socialProfiles: [
    'https://instagram.com/jchairstudios62',
    'https://facebook.com/jchairstudios62',
    'https://tiktok.com/@jchairstudios62',
    'https://youtube.com/@jchairstudios62',
  ],

  // Idiomas suportados com hreflang
  supportedLanguages: {
    'pt-PT': { name: 'Português (Portugal)', url: '' },
    'pt-BR': { name: 'Português (Brasil)', url: '/pt-BR' },
    'en-US': { name: 'English (US)', url: '/en' },
    'en-GB': { name: 'English (UK)', url: '/en-GB' },
    'es-ES': { name: 'Español (España)', url: '/es' },
    'fr-FR': { name: 'Français (France)', url: '/fr' },
    'de-DE': { name: 'Deutsch (Deutschland)', url: '/de' },
    'it-IT': { name: 'Italiano (Italia)', url: '/it' },
    'nl-BE': { name: 'Nederlands (België)', url: '/nl' },
    'nl-NL': { name: 'Nederlands (Nederland)', url: '/nl-NL' },
    'x-default': { name: 'Default', url: '' },
  },

  // Keywords principais por categoria
  keywords: {
    primary: [
      'mega hair brasileiro',
      'progressiva vogue',
      'maquiagem brasileira',
      'produtos brasileiros portugal',
    ],
    secondary: [
      'extensão cabelo humano',
      'btx capilar profissional',
      'cabelo brasileiro premium',
      'cosméticos brasil europa',
    ],
    longTail: [
      'mega hair 100% humano portugal',
      'progressiva brasileira original',
      'loja produtos brasileiros europa',
      'entrega produtos brasil portugal',
    ],
    local: [
      'jc hair studio 62',
      'produtos brasileiros seixal',
      'loja brasileira portugal',
      'produtos brasil bélgica',
    ],
    brand: [
      'tradição familiar 40 anos',
      'produtos autênticos brasil',
      'qualidade premium brasileira',
    ],
  },

  // Imagens default
  images: {
    ogImage: '/og-image-brasil.jpg',
    ogImageSquare: '/og-image-square.jpg',
    twitterImage: '/twitter-image-brasil.jpg',
    logo: '/logo-brasil.png',
  },
};

/**
 * Gera meta tags otimizadas para a raiz do site
 */
export function generateRootMetadata(): Metadata {
  const { baseUrl, siteName, siteTitle, siteDescription, twitterHandle, images, business } = SEO_CONFIG;

  // Combina todos os keywords
  const allKeywords = [
    ...SEO_CONFIG.keywords.primary,
    ...SEO_CONFIG.keywords.secondary,
    ...SEO_CONFIG.keywords.longTail.slice(0, 4),
    ...SEO_CONFIG.keywords.local.slice(0, 4),
    ...SEO_CONFIG.keywords.brand,
  ];

  return {
    // Title otimizado (max 60 chars)
    title: {
      default: siteTitle,
      template: `%s | ${siteName}`,
    },

    // Description otimizada (max 160 chars)
    description: siteDescription,

    // Keywords SEO
    keywords: allKeywords,

    // Author & Publisher
    authors: [
      { name: siteName, url: baseUrl },
      { name: 'Julio César' }
    ],
    creator: `${siteName} - Produtos Brasileiros Premium`,
    publisher: siteName,

    // Application info
    applicationName: siteName,

    // Robots otimizado
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph otimizado
    openGraph: {
      type: 'website',
      locale: 'pt_PT',
      alternateLocale: ['pt_BR', 'en_US', 'es_ES', 'fr_FR', 'nl_BE', 'de_DE', 'it_IT'],
      url: baseUrl,
      siteName,
      title: siteTitle,
      description: siteDescription,
      images: [
        {
          url: `${baseUrl}${images.ogImage}`,
          width: 1200,
          height: 630,
          alt: `${siteName} - Produtos Capilares Brasileiros Premium`,
          type: 'image/jpeg',
        },
        {
          url: `${baseUrl}${images.ogImageSquare}`,
          width: 800,
          height: 800,
          alt: `${siteName} - Logo`,
          type: 'image/jpeg',
        },
      ],
      emails: [SEO_CONFIG.email],
      phoneNumbers: [SEO_CONFIG.phone, SEO_CONFIG.phoneSecondary],
      countryName: 'Portugal',
    },

    // Twitter Card otimizado
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title: 'Mega Hair & Produtos Brasileiros | JC Hair 62',
      description: siteDescription,
      images: {
        url: `${baseUrl}${images.twitterImage}`,
        alt: `${siteName} - Produtos Brasileiros`,
      },
    },

    // Base URL
    metadataBase: new URL(baseUrl),

    // PWA Manifest
    manifest: '/manifest.json',

    // Icons otimizados
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon.ico', sizes: 'any' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        { url: '/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/safari-pinned-tab.svg',
          color: '#d97706',
        },
      ],
    },

    // Verificação de webmasters
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || 'verification_token_google',
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      other: {
        'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
        'p:domain_verify': process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION || '',
        'facebook-domain-verification': process.env.NEXT_PUBLIC_FACEBOOK_VERIFICATION || '',
      },
    },

    // Categoria
    category: 'Beauty & Personal Care',

    // Classification
    classification: 'E-commerce, Beauty Products, Hair Extensions, Brazilian Cosmetics',

    // Alternates com hreflang completo
    alternates: {
      canonical: baseUrl,
      languages: Object.fromEntries(
        Object.entries(SEO_CONFIG.supportedLanguages).map(([code, lang]) => [
          code,
          `${baseUrl}${lang.url}`
        ])
      ),
    },

    // Outras meta tags otimizadas
    other: {
      // Geo-targeting para SEO local
      'geo.region': 'PT',
      'geo.placename': `${business.addressLocality}, Portugal`,
      'geo.position': `${business.latitude};${business.longitude}`,
      'ICBM': `${business.latitude}, ${business.longitude}`,

      // Distribution
      'distribution': 'global',
      'target': 'all',
      'audience': 'all',

      // Rating e revisit
      'rating': 'general',
      'revisit-after': '7 days',

      // Mobile optimization
      'HandheldFriendly': 'True',
      'MobileOptimized': '320',

      // Theme colors
      'theme-color': '#d97706',
      'msapplication-TileColor': '#d97706',

      // Apple meta tags
      'apple-mobile-web-app-title': 'JC Hair 62',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',

      // Language
      'language': 'Portuguese',
      'content-language': 'pt-PT',

      // Copyright
      'copyright': `${siteName} © ${new Date().getFullYear()}`,

      // Organization info
      'organization': siteName,
      'locality': business.addressLocality,
      'region': business.addressRegion,
      'country': business.addressCountry,

      // Business contact data para rich snippets
      'business:contact_data:street_address': business.streetAddress,
      'business:contact_data:locality': business.addressLocality,
      'business:contact_data:region': business.addressRegion,
      'business:contact_data:postal_code': business.postalCode,
      'business:contact_data:country_name': business.addressCountry,
      'business:contact_data:email': SEO_CONFIG.email,
      'business:contact_data:phone_number': SEO_CONFIG.phone,
      'business:contact_data:website': baseUrl,
    },
  };
}

/**
 * Viewport e charset otimizados
 */
export const VIEWPORT_CONFIG = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
};

/**
 * Gera meta tags HTML adicionais que não são suportadas pelo Next.js Metadata API
 */
export function generateAdditionalMetaTags() {
  return `
    <!-- Charset e viewport -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, user-scalable=yes, viewport-fit=cover" />

    <!-- DNS Prefetch para performance -->
    <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
    <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    <link rel="dns-prefetch" href="https://www.google-analytics.com" />
    <link rel="dns-prefetch" href="https://connect.facebook.net" />

    <!-- Preconnect para recursos críticos -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Referrer policy para privacidade -->
    <meta name="referrer" content="strict-origin-when-cross-origin" />

    <!-- Format detection -->
    <meta name="format-detection" content="telephone=yes" />
    <meta name="format-detection" content="email=yes" />
    <meta name="format-detection" content="address=yes" />
  `;
}

/**
 * Gera hreflang tags completas
 */
export function generateHreflangTags(currentPath: string = '') {
  const { baseUrl, supportedLanguages } = SEO_CONFIG;

  return Object.entries(supportedLanguages)
    .map(([code, lang]) => {
      const href = `${baseUrl}${lang.url}${currentPath}`;
      return `<link rel="alternate" hreflang="${code}" href="${href}" />`;
    })
    .join('\n    ');
}

/**
 * Valida meta tags
 */
export function validateMetadata(metadata: Metadata): {
  valid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Valida título
  if (metadata.title && typeof metadata.title === 'string') {
    if (metadata.title.length > 60) {
      warnings.push(`Title muito longo: ${metadata.title.length} caracteres (recomendado: ≤60)`);
    }
    if (metadata.title.length < 30) {
      warnings.push(`Title muito curto: ${metadata.title.length} caracteres (recomendado: ≥30)`);
    }
  }

  // Valida description
  if (metadata.description) {
    if (metadata.description.length > 160) {
      warnings.push(`Description muito longa: ${metadata.description.length} caracteres (recomendado: ≤160)`);
    }
    if (metadata.description.length < 120) {
      warnings.push(`Description muito curta: ${metadata.description.length} caracteres (recomendado: ≥120)`);
    }
  } else {
    errors.push('Description ausente');
  }

  // Valida Open Graph
  if (metadata.openGraph) {
    if (!metadata.openGraph.images || metadata.openGraph.images.length === 0) {
      errors.push('Imagem Open Graph ausente');
    }
  } else {
    errors.push('Open Graph ausente');
  }

  // Valida canonical
  if (!metadata.alternates?.canonical) {
    warnings.push('URL canonical ausente');
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

export default SEO_CONFIG;
