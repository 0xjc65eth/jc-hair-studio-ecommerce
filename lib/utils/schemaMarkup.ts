/**
 * Schema Markup Generator - JC Hair Studio's 62
 * Comprehensive Schema.org structured data for e-commerce SEO dominance
 * Designed to maximize rich snippets presence in Google SERPs
 */

import { Product } from '../data/categories';

// Organization Schema - Main business information
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: "JC Hair Studio's 62",
  alternateName: ["JC Hair Studios 62", "62 Beauty"],
  description: 'Loja online especializada em produtos capilares brasileiros premium, mega hair 100% humano, progressivas Vogue, maquiagem brasileira e tratamentos capilares profissionais com mais de 40 anos de tradição familiar.',
  url: 'https://jchairstudios62.xyz',
  logo: 'https://jchairstudios62.xyz/logo-brasil.png',
  image: 'https://jchairstudios62.xyz/og-image-brasil.jpg',

  // Founder information
  founder: {
    '@type': 'Person',
    name: 'Julio César',
    nationality: 'Brazilian',
    knowsAbout: [
      'Hair Extensions',
      'Brazilian Hair Products',
      'Professional Hair Treatments',
      'Mega Hair Application',
      'Brazilian Beauty Products'
    ],
    alumniOf: 'International Hair Academy'
  },

  // Contact information
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+351928375226',
      contactType: 'Customer Service',
      areaServed: ['PT', 'BE', 'ES', 'FR', 'IT', 'DE', 'NL'],
      availableLanguage: ['Portuguese', 'English', 'Spanish', 'French'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
        timeZone: 'Europe/Lisbon'
      }
    },
    {
      '@type': 'ContactPoint',
      telephone: '+32472384027',
      contactType: 'Customer Service',
      areaServed: 'BE',
      availableLanguage: ['Portuguese', 'French', 'Dutch', 'English']
    }
  ],

  // Address
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'R. Gil Vicente, N°5',
    addressLocality: 'Seixal',
    addressRegion: 'Setúbal',
    postalCode: '2840-474',
    addressCountry: 'PT'
  },

  // Social media
  sameAs: [
    'https://instagram.com/jchairstudios62',
    'https://facebook.com/jchairstudios62',
    'https://tiktok.com/@jchairstudios62',
    'https://youtube.com/@jchairstudios62'
  ],

  // Service area (Europe)
  serviceArea: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 38.6500,
      longitude: -9.1000
    },
    geoRadius: '2000000' // 2000km radius covers most of Europe
  },

  // Business attributes
  paymentAccepted: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Multibanco'],
  currenciesAccepted: 'EUR',
  openingHours: 'Mo-Fr 09:00-18:00',
  priceRange: '€€',

  // Aggregate rating
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '1250',
    bestRating: '5',
    worstRating: '1'
  },

  // Specialties
  specialty: [
    'Brazilian Hair Extensions',
    'Mega Hair 100% Human',
    'Hair Straightening Treatments',
    'Brazilian Cosmetics',
    'Professional Hair Products',
    'Curly Hair Specialists'
  ]
};

// Product Schema Generator
export function generateProductSchema(product: any): any {
  // Determine product category and type
  const getProductType = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'mega-hair':
      case 'extensoes-naturais':
        return 'HairExtensions';
      case 'progressivas-btx':
      case 'tratamentos-capilares':
        return 'HairCareProduct';
      case 'maquiagem-brasileira':
      case 'maquiagens':
        return 'BeautyProduct';
      case 'esmaltes':
        return 'NailPolish';
      case 'perfumes':
        return 'Fragrance';
      case 'tintas':
        return 'HairDye';
      default:
        return 'Product';
    }
  };

  const productType = getProductType(product.category);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';
  const productUrl = `${baseUrl}/produto/${product.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': productType,
    '@id': productUrl,
    name: product.name || product.nome,
    description: product.description || product.descricao,

    // Brand information
    brand: {
      '@type': 'Brand',
      name: product.brand || product.marca || "JC Hair Studio's 62",
      logo: `${baseUrl}/logo-brasil.png`
    },

    // Manufacturer (for Brazilian products)
    manufacturer: {
      '@type': 'Organization',
      name: product.brand || product.marca || "JC Hair Studio's 62",
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BR'
      }
    },

    // Product images
    image: Array.isArray(product.images || product.imagens)
      ? (product.images || product.imagens).map((img: string) =>
          img.startsWith('http') ? img : `${baseUrl}${img}`
        )
      : [`${baseUrl}/placeholder-product.jpg`],

    // SKU and identifiers
    sku: product.sku || `JCH-${product.id}`,
    productID: product.id,
    gtin: product.gtin || undefined,
    mpn: product.mpn || product.id,

    // Pricing
    offers: {
      '@type': 'Offer',
      '@id': `${productUrl}#offer`,
      price: product.preco_eur || product.price || 0,
      priceCurrency: 'EUR',
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: productUrl,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
      seller: {
        '@type': 'Organization',
        name: "JC Hair Studio's 62",
        url: baseUrl
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'EUR'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          minValue: 2,
          maxValue: 5,
          unitCode: 'DAY'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: ['PT', 'ES', 'FR', 'BE', 'IT', 'DE', 'NL']
        }
      }
    },

    // Reviews and ratings
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: (product.reviews || product.reviewCount || 50).toString(),
      bestRating: '5',
      worstRating: '1'
    } : undefined,

    // Category
    category: product.category || 'Beauty Products',

    // Additional properties based on product type
    ...(productType === 'HairExtensions' && {
      material: 'Human Hair',
      color: product.color || 'Natural',
      size: product.length || '50cm',
      countryOfOrigin: 'Brazil'
    }),

    ...(productType === 'HairCareProduct' && {
      targetGender: 'https://schema.org/Female',
      applicationMethod: 'Topical',
      activeIngredient: product.activeIngredient || 'Keratin'
    }),

    ...(productType === 'BeautyProduct' && {
      targetGender: 'https://schema.org/Female',
      color: product.color || 'Various'
    }),

    // Product features
    additionalProperty: product.features ? product.features.map((feature: string, index: number) => ({
      '@type': 'PropertyValue',
      name: `Feature ${index + 1}`,
      value: feature
    })) : undefined,

    // Warranty and return policy
    warranty: {
      '@type': 'WarrantyPromise',
      durationOfWarranty: {
        '@type': 'QuantitativeValue',
        value: 30,
        unitCode: 'DAY'
      }
    }
  };
}

// Breadcrumb Schema Generator
export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>): any {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${baseUrl}${crumb.url}`
    }))
  };
}

// Category/Collection Page Schema
export function generateCategorySchema(category: string, products: any[]): any {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';
  const categoryUrl = `${baseUrl}/${category}`;

  const getCategoryInfo = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'mega-hair':
        return {
          name: 'Mega Hair Brasileiro',
          description: 'Extensões de cabelo 100% humano brasileiro premium para volume e comprimento natural',
          audience: 'Women seeking hair extensions'
        };
      case 'progressivas':
      case 'tratamentos-capilares':
        return {
          name: 'Progressivas e Tratamentos',
          description: 'Progressivas brasileiras e tratamentos capilares profissionais para alisamento e nutrição',
          audience: 'Women seeking hair straightening'
        };
      case 'maquiagens':
      case 'maquiagem-brasileira':
        return {
          name: 'Maquiagem Brasileira',
          description: 'Cosméticos e maquiagem das melhores marcas brasileiras premium',
          audience: 'Women seeking Brazilian cosmetics'
        };
      case 'esmaltes':
        return {
          name: 'Esmaltes IMPALA',
          description: 'Esmaltes brasileiros IMPALA com cores vibrantes e longa duração',
          audience: 'Women seeking nail polish'
        };
      case 'perfumes':
        return {
          name: 'Perfumes Virginia',
          description: 'Perfumes brasileiros Virginia com fragrâncias exclusivas e marcantes',
          audience: 'Women seeking fragrances'
        };
      default:
        return {
          name: 'Produtos Brasileiros',
          description: 'Produtos de beleza brasileiros premium',
          audience: 'Women seeking beauty products'
        };
    }
  };

  const categoryInfo = getCategoryInfo(category);

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': categoryUrl,
    name: categoryInfo.name,
    description: categoryInfo.description,
    url: categoryUrl,

    // Main content
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          '@id': `${baseUrl}/produto/${product.id}`,
          name: product.name || product.nome,
          url: `${baseUrl}/produto/${product.id}`,
          image: Array.isArray(product.images || product.imagens)
            ? (product.images || product.imagens)[0]
            : '/placeholder-product.jpg',
          offers: {
            '@type': 'Offer',
            price: product.preco_eur || product.price || 0,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock'
          }
        }
      }))
    },

    // Breadcrumb
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Início',
          item: baseUrl
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: categoryInfo.name,
          item: categoryUrl
        }
      ]
    },

    // Audience
    audience: {
      '@type': 'Audience',
      audienceType: categoryInfo.audience
    }
  };
}

// FAQ Schema Generator
export function generateFAQSchema(faqs: Array<{question: string, answer: string}>): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// Review Schema Generator
export function generateReviewSchema(productId: string, reviews: any[]): any {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';

  return reviews.map((review, index) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `${baseUrl}/produto/${productId}#review-${index}`,
    itemReviewed: {
      '@type': 'Product',
      '@id': `${baseUrl}/produto/${productId}`
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating.toString(),
      bestRating: '5',
      worstRating: '1'
    },
    author: {
      '@type': 'Person',
      name: review.author || 'Cliente Verificado'
    },
    reviewBody: review.comment || review.text,
    datePublished: review.date || new Date().toISOString().split('T')[0]
  }));
}

// Website Schema (for homepage)
export function generateWebsiteSchema(): any {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: "JC Hair Studio's 62",
    description: 'Loja online de produtos capilares brasileiros premium. Mega hair, progressivas, maquiagem brasileira e tratamentos profissionais.',

    // Search action
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/buscar?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },

    // Publisher
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: "JC Hair Studio's 62",
      logo: `${baseUrl}/logo-brasil.png`
    }
  };
}

// Local Business Schema (for contact/about pages)
export function generateLocalBusinessSchema(): any {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';

  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': `${baseUrl}/#localbusiness`,
    name: "JC Hair Studio's 62",
    image: `${baseUrl}/og-image-brasil.jpg`,

    // Address
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'R. Gil Vicente, N°5',
      addressLocality: 'Seixal',
      addressRegion: 'Setúbal',
      postalCode: '2840-474',
      addressCountry: 'PT'
    },

    // Contact
    telephone: '+351928375226',
    email: 'info@jchairstudios62.xyz',
    url: baseUrl,

    // Business hours
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      }
    ],

    // Services
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Hair Services and Products',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Hair Extensions Application',
            description: 'Professional mega hair application service'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Hair Straightening Treatments',
            description: 'Brazilian hair straightening and smoothing treatments'
          }
        }
      ]
    },

    // Geographic area served
    areaServed: ['Portugal', 'Spain', 'France', 'Belgium', 'Italy', 'Germany', 'Netherlands'],

    // Payment methods
    paymentAccepted: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'],

    // Price range
    priceRange: '€€'
  };
}

// Helper function to inject schema into page head
export function injectSchema(schema: any): string {
  return JSON.stringify(schema, null, 0);
}

// Schema validation helper
export function validateSchema(schema: any): boolean {
  try {
    // Basic validation - check required fields
    if (!schema['@context'] || !schema['@type']) {
      return false;
    }

    // Ensure JSON is valid
    JSON.stringify(schema);
    return true;
  } catch (error) {
    console.error('Schema validation error:', error);
    return false;
  }
}