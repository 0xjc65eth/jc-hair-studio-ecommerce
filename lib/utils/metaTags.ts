/**
 * Meta Tags Generator - JC Hair Studio's 62
 * Advanced meta tag optimization for maximum SERP visibility and CTR
 * Designed for Brazilian beauty products e-commerce
 */

import { Metadata } from 'next';

// Base URL configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';
const SITE_NAME = "JC Hair Studio's 62";
const BRAND_NAME = "JC Hair Studio's 62";

// Default meta configuration
const DEFAULT_META = {
  siteName: SITE_NAME,
  twitterSite: '@jchairstudios62',
  twitterCreator: '@jchairstudios62',
  locale: 'pt_PT',
  alternateLocales: ['pt_BR', 'en_US', 'es_ES', 'fr_FR'],
  defaultImage: '/og-image-brasil.jpg',
  defaultImageAlt: 'JC Hair Studio\'s 62 - Produtos Brasileiros Premium',
};

// Product meta tag generator
export function generateProductMeta(product: any): Metadata {
  const productName = product.name || product.nome || 'Produto';
  const productDescription = product.description || product.descricao || 'Produto de beleza brasileiro premium';
  const productBrand = product.brand || product.marca || BRAND_NAME;
  const productPrice = product.preco_eur || product.price || 0;
  const productImage = Array.isArray(product.images || product.imagens)
    ? (product.images || product.imagens)[0]
    : DEFAULT_META.defaultImage;

  // Category-specific keywords
  const getCategoryKeywords = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'mega-hair':
      case 'extensoes-naturais':
        return [
          'mega hair brasileiro',
          'extensão cabelo humano',
          'mega hair natural',
          'cabelo brasileiro premium',
          'extensão capilar portugal',
          'mega hair 100% humano',
          'cabelo natural brasileiro',
          'extensões de cabelo'
        ];
      case 'progressivas':
      case 'progressivas-btx':
      case 'tratamentos-capilares':
        return [
          'progressiva brasileira',
          'progressiva vogue original',
          'btx capilar profissional',
          'tratamento capilar brasileiro',
          'alisamento capilar',
          'progressiva sem formol',
          'tratamento capilar portugal',
          'progressiva premium'
        ];
      case 'maquiagens':
      case 'maquiagem-brasileira':
        return [
          'maquiagem brasileira',
          'cosméticos brasil',
          'maquiagem natura eudora',
          'produtos beleza brasil',
          'maquiagem ruby rose',
          'cosméticos brasileiros portugal',
          'maquiagem original brasil',
          'beleza brasileira'
        ];
      case 'esmaltes':
        return [
          'esmalte impala',
          'esmalte brasileiro',
          'esmalte colorido',
          'esmalte longa duração',
          'esmalte premium',
          'esmalte portugal',
          'unha colorida',
          'esmalte original'
        ];
      case 'perfumes':
        return [
          'perfume virginia',
          'perfume brasileiro',
          'fragrância brasileira',
          'perfume importado',
          'perfume feminino',
          'perfume portugal',
          'fragrância premium',
          'perfume original'
        ];
      case 'tintas':
        return [
          'tinta cabelo brasileira',
          'coloração capilar',
          'tinta profissional',
          'cor cabelo',
          'tintura cabelo',
          'coloração premium',
          'tinta portugal',
          'coloração brasileira'
        ];
      default:
        return [
          'produtos brasileiros',
          'beleza brasileira',
          'cosméticos brasil',
          'produtos premium',
          'beleza portugal',
          'produtos originais'
        ];
    }
  };

  const categoryKeywords = getCategoryKeywords(product.category);
  const brandKeywords = [productBrand.toLowerCase(), 'jc hair studio', '62 beauty'];
  const locationKeywords = ['portugal', 'europa', 'entrega europa', 'loja portuguesa'];

  const allKeywords = [
    ...categoryKeywords,
    ...brandKeywords,
    ...locationKeywords,
    'produtos brasileiros portugal',
    'authentic brazilian products',
    'produtos autênticos brasil'
  ];

  // Optimized title (max 60 characters for mobile, 70 for desktop)
  const title = `${productName} | ${productBrand} - Produto Brasileiro Premium`;

  // Optimized description (max 155 characters)
  const description = `${productName} ${productBrand}. ${productDescription.substring(0, 100)}... Produto brasileiro autêntico. Entrega Europa. Preço €${productPrice.toFixed(2)}`;

  return {
    title,
    description,
    keywords: allKeywords,

    // Open Graph
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${BASE_URL}/produto/${product.id}`,
      siteName: DEFAULT_META.siteName,
      locale: DEFAULT_META.locale,
      images: [{
        url: productImage.startsWith('http') ? productImage : `${BASE_URL}${productImage}`,
        width: 1200,
        height: 630,
        alt: `${productName} - ${productBrand}`
      }],
      // Product-specific OG tags
      ...(productPrice > 0 && {
        'product:price:amount': productPrice.toString(),
        'product:price:currency': 'EUR'
      })
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: DEFAULT_META.twitterSite,
      creator: DEFAULT_META.twitterCreator,
      title: title.length > 70 ? title.substring(0, 67) + '...' : title,
      description: description.length > 155 ? description.substring(0, 152) + '...' : description,
      images: [productImage.startsWith('http') ? productImage : `${BASE_URL}${productImage}`]
    },

    // Additional meta
    authors: [{ name: BRAND_NAME }],
    creator: BRAND_NAME,
    publisher: BRAND_NAME,
    category: product.category || 'Beauty Products',

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    },

    // Alternate languages
    alternates: {
      canonical: `${BASE_URL}/produto/${product.id}`,
      languages: {
        'pt-PT': `${BASE_URL}/produto/${product.id}`,
        'pt-BR': `${BASE_URL}/br/produto/${product.id}`,
        'en-US': `${BASE_URL}/en/produto/${product.id}`,
        'es-ES': `${BASE_URL}/es/produto/${product.id}`,
      }
    },

    // Additional properties
    other: {
      'product:brand': productBrand,
      'product:availability': product.inStock !== false ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:price:amount': productPrice.toString(),
      'product:price:currency': 'EUR',
      'product:retailer_item_id': product.id,
      'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
    }
  };
}

// Category page meta generator
export function generateCategoryMeta(category: string, products: any[] = []): Metadata {
  const getCategoryData = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'mega-hair':
        return {
          name: 'Mega Hair Brasileiro',
          title: 'Mega Hair Brasileiro 100% Humano | Extensões Naturais Premium',
          description: 'Mega hair brasileiro premium 100% humano. Extensões naturais para volume e comprimento. Qualidade superior, entrega Europa. Preços especiais.',
          keywords: [
            'mega hair brasileiro',
            'extensão cabelo humano',
            'mega hair portugal',
            'cabelo brasileiro premium',
            'extensão capilar natural',
            'mega hair 100% humano',
            'cabelo humano brasileiro',
            'extensões de cabelo'
          ],
          image: '/images/categories/mega-hair-og.jpg'
        };
      case 'progressivas':
      case 'tratamentos-capilares':
        return {
          name: 'Progressivas e Tratamentos',
          title: 'Progressivas Brasileiras e Tratamentos Capilares | BTX Premium',
          description: 'Progressivas Vogue originais, BTX capilar e tratamentos brasileiros premium. Alisamento profissional, hidratação intensa. Entrega Europa.',
          keywords: [
            'progressiva brasileira',
            'progressiva vogue',
            'btx capilar',
            'tratamento capilar',
            'alisamento brasileiro',
            'progressiva sem formol',
            'tratamento portugal',
            'progressiva premium'
          ],
          image: '/images/categories/progressivas-og.jpg'
        };
      case 'maquiagens':
      case 'maquiagem-brasileira':
        return {
          name: 'Maquiagem Brasileira',
          title: 'Maquiagem Brasileira Original | Natura, Eudora, Ruby Rose',
          description: 'Maquiagem brasileira autêntica: Natura, Eudora, Ruby Rose, Avon. Cosméticos premium originais do Brasil. Entrega rápida Europa.',
          keywords: [
            'maquiagem brasileira',
            'natura maquiagem',
            'eudora cosméticos',
            'ruby rose maquiagem',
            'cosméticos brasil',
            'maquiagem portuguesa',
            'beleza brasileira',
            'maquiagem importada'
          ],
          image: '/images/categories/maquiagem-og.jpg'
        };
      case 'esmaltes':
        return {
          name: 'Esmaltes IMPALA',
          title: 'Esmaltes IMPALA Brasileiros | Cores Vibrantes Premium',
          description: 'Esmaltes IMPALA brasileiros com +56 cores vibrantes. Longa duração, cobertura perfeita. Esmaltes premium originais. Entrega Europa.',
          keywords: [
            'esmalte impala',
            'esmalte brasileiro',
            'esmalte colorido',
            'impala portugal',
            'esmalte premium',
            'unha colorida',
            'esmalte original',
            'esmalte longa duração'
          ],
          image: '/images/categories/esmaltes-og.jpg'
        };
      case 'perfumes':
        return {
          name: 'Perfumes Virginia',
          title: 'Perfumes Virginia Brasileiros | Fragrâncias Exclusivas',
          description: 'Perfumes Virginia brasileiros com fragrâncias exclusivas e marcantes. Perfumes femininos premium originais. Entrega Europa.',
          keywords: [
            'perfume virginia',
            'perfume brasileiro',
            'fragrância brasileira',
            'perfume feminino',
            'perfume portugal',
            'perfume importado',
            'fragrância premium',
            'perfume original'
          ],
          image: '/images/categories/perfumes-og.jpg'
        };
      case 'tintas':
        return {
          name: 'Tintas Capilares',
          title: 'Tintas Capilares Brasileiras | Coloração Profissional',
          description: 'Tintas capilares brasileiras profissionais. Coloração premium com cobertura perfeita e durabilidade. Cores vibrantes. Entrega Europa.',
          keywords: [
            'tinta capilar',
            'coloração brasileira',
            'tinta cabelo',
            'coloração profissional',
            'tintura premium',
            'cor cabelo brasil',
            'tinta portugal',
            'coloração natural'
          ],
          image: '/images/categories/tintas-og.jpg'
        };
      default:
        return {
          name: 'Produtos Brasileiros',
          title: 'Produtos de Beleza Brasileiros Premium | JC Hair Studio\'s 62',
          description: 'Produtos de beleza brasileiros autênticos e premium. Mega hair, progressivas, maquiagem, esmaltes. Tradição de 40 anos. Entrega Europa.',
          keywords: [
            'produtos brasileiros',
            'beleza brasileira',
            'cosméticos brasil',
            'produtos premium',
            'beleza portugal',
            'jc hair studio'
          ],
          image: '/images/categories/produtos-og.jpg'
        };
    }
  };

  const categoryData = getCategoryData(category);
  const productCount = products.length;
  const priceRange = products.length > 0
    ? `€${Math.min(...products.map(p => p.preco_eur || p.price || 0)).toFixed(2)} - €${Math.max(...products.map(p => p.preco_eur || p.price || 0)).toFixed(2)}`
    : '';

  const enhancedDescription = `${categoryData.description} ${productCount > 0 ? `${productCount} produtos disponíveis.` : ''} ${priceRange ? `Preços desde ${priceRange}.` : ''}`.trim();

  return {
    title: categoryData.title,
    description: enhancedDescription,
    keywords: [
      ...categoryData.keywords,
      'jc hair studio 62',
      'produtos brasil portugal',
      'entrega europa',
      'loja brasileira',
      'produtos autênticos'
    ],

    // Open Graph
    openGraph: {
      title: categoryData.title,
      description: enhancedDescription,
      type: 'website',
      url: `${BASE_URL}/${category}`,
      siteName: DEFAULT_META.siteName,
      locale: DEFAULT_META.locale,
      images: [{
        url: `${BASE_URL}${categoryData.image}`,
        width: 1200,
        height: 630,
        alt: `${categoryData.name} - ${SITE_NAME}`
      }]
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: DEFAULT_META.twitterSite,
      creator: DEFAULT_META.twitterCreator,
      title: categoryData.title,
      description: enhancedDescription.length > 155 ? enhancedDescription.substring(0, 152) + '...' : enhancedDescription,
      images: [`${BASE_URL}${categoryData.image}`]
    },

    // Additional meta
    authors: [{ name: BRAND_NAME }],
    creator: BRAND_NAME,
    publisher: BRAND_NAME,
    category: categoryData.name,

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    },

    // Alternate languages
    alternates: {
      canonical: `${BASE_URL}/${category}`,
      languages: {
        'pt-PT': `${BASE_URL}/${category}`,
        'pt-BR': `${BASE_URL}/br/${category}`,
        'en-US': `${BASE_URL}/en/${category}`,
        'es-ES': `${BASE_URL}/es/${category}`,
      }
    }
  };
}

// Homepage meta generator
export function generateHomepageMeta(): Metadata {
  const title = 'JC Hair Studio\'s 62 - Produtos Capilares Brasileiros Premium | Mega Hair Portugal';
  const description = 'Loja online de produtos capilares brasileiros premium com +40 anos tradição. Mega hair 100% humano, progressivas Vogue, maquiagem brasileira. Entrega Europa.';

  return {
    title,
    description,
    keywords: [
      // Mega Hair Keywords
      'mega hair brasileiro',
      'extensão cabelo humano portugal',
      'mega hair natural',
      'cabelo brasileiro premium',

      // Progressiva Keywords
      'progressiva vogue original',
      'progressiva brasileira portugal',
      'btx capilar profissional',
      'tratamento capilar brasileiro',

      // Maquiagem Keywords
      'maquiagem brasileira portugal',
      'natura eudora maquiagem',
      'cosméticos brasil europa',

      // Location Keywords
      'produtos brasileiros portugal',
      'loja brasileira europa',
      'jc hair studio 62',
      'entrega portugal espanha',

      // Brand Keywords
      'tradição familiar 40 anos',
      'produtos autênticos brasil',
      'qualidade premium'
    ],

    // Open Graph
    openGraph: {
      title,
      description,
      type: 'website',
      url: BASE_URL,
      siteName: DEFAULT_META.siteName,
      locale: DEFAULT_META.locale,
      images: [{
        url: `${BASE_URL}${DEFAULT_META.defaultImage}`,
        width: 1200,
        height: 630,
        alt: DEFAULT_META.defaultImageAlt
      }]
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: DEFAULT_META.twitterSite,
      creator: DEFAULT_META.twitterCreator,
      title,
      description,
      images: [`${BASE_URL}${DEFAULT_META.defaultImage}`]
    },

    // Additional meta
    authors: [{ name: BRAND_NAME }],
    creator: BRAND_NAME,
    publisher: BRAND_NAME,

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    },

    // Verification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
    },

    // Alternate languages
    alternates: {
      canonical: BASE_URL,
      languages: {
        'pt-PT': BASE_URL,
        'pt-BR': `${BASE_URL}/br`,
        'en-US': `${BASE_URL}/en`,
        'es-ES': `${BASE_URL}/es`,
        'fr-FR': `${BASE_URL}/fr`,
      }
    }
  };
}

// Blog/Content meta generator
export function generateContentMeta(
  title: string,
  description: string,
  slug: string,
  image?: string,
  publishDate?: string,
  author?: string
): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const contentUrl = `${BASE_URL}/${slug}`;
  const contentImage = image || DEFAULT_META.defaultImage;

  return {
    title: fullTitle,
    description,
    keywords: [
      'cabelo brasileiro',
      'beleza brasileira',
      'produtos capilares',
      'dicas cabelo',
      'cuidados capilares',
      'jc hair studio',
      'blog beleza'
    ],

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      type: 'article',
      url: contentUrl,
      siteName: DEFAULT_META.siteName,
      locale: DEFAULT_META.locale,
      images: [{
        url: contentImage.startsWith('http') ? contentImage : `${BASE_URL}${contentImage}`,
        width: 1200,
        height: 630,
        alt: title
      }],
      // Article-specific properties
      ...(publishDate && { publishedTime: publishDate }),
      ...(author && { authors: [author] })
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: DEFAULT_META.twitterSite,
      creator: DEFAULT_META.twitterCreator,
      title: fullTitle,
      description,
      images: [contentImage.startsWith('http') ? contentImage : `${BASE_URL}${contentImage}`]
    },

    // Additional meta
    authors: [{ name: author || BRAND_NAME }],
    creator: BRAND_NAME,
    publisher: BRAND_NAME,

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    },

    // Alternate languages
    alternates: {
      canonical: contentUrl,
    }
  };
}

// Meta tags validator
export function validateMetaTags(metadata: Metadata): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check title length
  if (metadata.title && typeof metadata.title === 'string') {
    if (metadata.title.length > 60) {
      issues.push(`Title too long: ${metadata.title.length} characters (recommended: ≤60)`);
    }
    if (metadata.title.length < 30) {
      issues.push(`Title too short: ${metadata.title.length} characters (recommended: ≥30)`);
    }
  }

  // Check description length
  if (metadata.description) {
    if (metadata.description.length > 155) {
      issues.push(`Description too long: ${metadata.description.length} characters (recommended: ≤155)`);
    }
    if (metadata.description.length < 120) {
      issues.push(`Description too short: ${metadata.description.length} characters (recommended: ≥120)`);
    }
  }

  // Check Open Graph
  if (metadata.openGraph) {
    if (!metadata.openGraph.images || metadata.openGraph.images.length === 0) {
      issues.push('Missing Open Graph image');
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}