/**
 * Sistema de Structured Data para SEO - JC Hair Studio's 62
 * Otimizado para produtos brasileiros e busca internacional
 */

export interface ProductStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string[];
  brand: {
    '@type': string;
    name: string;
    logo?: string;
  };
  manufacturer: {
    '@type': string;
    name: string;
    address: {
      '@type': string;
      addressCountry: string;
    };
  };
  offers: {
    '@type': string;
    priceCurrency: string;
    price: string;
    priceValidUntil?: string;
    availability: string;
    url: string;
    seller: {
      '@type': string;
      name: string;
    };
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    reviewCount: string;
    bestRating: string;
    worstRating: string;
  };
  review?: Array<{
    '@type': string;
    reviewRating: {
      '@type': string;
      ratingValue: string;
      bestRating: string;
    };
    author: {
      '@type': string;
      name: string;
    };
    datePublished: string;
    reviewBody: string;
  }>;
  category?: string;
  countryOfOrigin?: string;
  material?: string;
  color?: string;
  size?: string;
  weight?: string;
  additionalProperty?: Array<{
    '@type': string;
    name: string;
    value: string;
  }>;
}

export function generateProductStructuredData(product: {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: Array<{ url: string; alt: string }>;
  rating?: number;
  reviews?: number;
  category?: string;
  brand?: string;
  inStock?: boolean;
  color?: string;
  length?: number;
  weight?: number;
  slug?: string;
}): ProductStructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(img => `${baseUrl}${img.url}`),
    brand: {
      '@type': 'Brand',
      name: product.brand || "JC Hair Studio's 62",
      logo: `${baseUrl}/logo-brasil.png`
    },
    manufacturer: {
      '@type': 'Organization',
      name: "JC Hair Studio's 62",
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BR'
      }
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/produto/${product.id}`,
      seller: {
        '@type': 'Organization',
        name: "JC Hair Studio's 62"
      }
    },
    ...(product.rating && product.reviews && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toFixed(1),
        reviewCount: product.reviews.toString(),
        bestRating: '5',
        worstRating: '1'
      }
    }),
    ...(product.category && { category: product.category }),
    countryOfOrigin: 'BR',
    ...(product.color && { color: product.color }),
    ...(product.length && { size: `${product.length}cm` }),
    ...(product.weight && { weight: `${product.weight}g` }),
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Origem',
        value: 'Brasil'
      },
      {
        '@type': 'PropertyValue',
        name: 'Qualidade',
        value: '100% Humano Premium'
      },
      {
        '@type': 'PropertyValue',
        name: 'Tradição Familiar',
        value: '+40 anos'
      }
    ]
  };
}

export interface CategoryStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  image: string;
  numberOfItems: number;
  hasOfferCatalog: {
    '@type': string;
    name: string;
    itemListElement: Array<{
      '@type': string;
      position: number;
      item: {
        '@type': string;
        name: string;
        url: string;
        image: string;
        offers: {
          '@type': string;
          priceCurrency: string;
          lowPrice: string;
          highPrice: string;
          offerCount: string;
        };
      };
    }>;
  };
}

export function generateCategoryStructuredData(category: {
  name: string;
  description: string;
  slug: string;
  image: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
  }>;
}): CategoryStructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';
  const prices = category.products.map(p => p.price);

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `${baseUrl}/categoria/${category.slug}`,
    image: `${baseUrl}${category.image}`,
    numberOfItems: category.products.length,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: category.name,
      itemListElement: category.products.slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          url: `${baseUrl}/produto/${product.id}`,
          image: `${baseUrl}${product.image}`,
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            lowPrice: Math.min(...prices).toFixed(2),
            highPrice: Math.max(...prices).toFixed(2),
            offerCount: category.products.length.toString()
          }
        }
      }))
    }
  };
}

export interface BreadcrumbStructuredData {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item?: string;
  }>;
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{
  name: string;
  href?: string;
}>): BreadcrumbStructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.href && index < breadcrumbs.length - 1 && {
        item: `${baseUrl}${crumb.href}`
      })
    }))
  };
}

export interface FAQStructuredData {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

export function generateFAQStructuredData(faqs: Array<{
  question: string;
  answer: string;
}>): FAQStructuredData {
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

// Produtos brasileiros específicos - FAQs otimizadas
export const BRAZILIAN_PRODUCTS_FAQS = [
  {
    question: 'O mega hair é realmente 100% humano brasileiro?',
    answer: 'Sim! Todos nossos mega hair são 100% cabelo humano brasileiro, com cutículas alinhadas e sem processamento químico agressivo. Garantimos a autenticidade e qualidade premium.'
  },
  {
    question: 'As progressivas Vogue são originais do Brasil?',
    answer: 'Todas nossas progressivas Vogue são importadas diretamente do Brasil, garantindo autenticidade. Somos distribuidores autorizados com mais de 40 anos de experiência no setor.'
  },
  {
    question: 'Vocês entregam produtos brasileiros em toda a Europa?',
    answer: 'Sim! Entregamos em Portugal, Bélgica, Espanha, França, Itália, Alemanha, Holanda e outros países europeus. Frete grátis acima de €150.'
  },
  {
    question: 'Como garantem a qualidade dos produtos brasileiros?',
    answer: 'Temos +40 anos de tradição familiar no setor capilar. Todos os produtos são testados, aprovados e importados diretamente dos fabricantes brasileiros de confiança.'
  },
  {
    question: 'Qual a diferença entre cabelo brasileiro e outras origens?',
    answer: 'O cabelo brasileiro é reconhecido mundialmente pela versatilidade, textura natural sedosa e capacidade de aceitar diferentes processos químicos mantendo a qualidade.'
  },
  {
    question: 'Os produtos de maquiagem brasileira são originais?',
    answer: 'Sim! Trabalhamos com marcas originais como Natura, Eudora, Ruby Rose, Avon e Quem Disse Berenice, todas importadas diretamente do Brasil.'
  }
];

export function generateWebsiteStructuredData(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "JC Hair Studio's 62",
    alternateName: "JC Hair Studios 62",
    url: 'https://jchairstudios62.xyz',
    description: 'Loja online de produtos capilares brasileiros premium. Mega hair, progressivas, maquiagem brasileira com +40 anos de tradição familiar.',
    inLanguage: ['pt-PT', 'pt-BR'],
    about: {
      '@type': 'Thing',
      name: 'Produtos Capilares Brasileiros',
      sameAs: [
        'https://pt.wikipedia.org/wiki/Cosm%C3%A9tico',
        'https://pt.wikipedia.org/wiki/Cuidado_capilar'
      ]
    },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://jchairstudios62.xyz/pesquisar?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    ],
    sameAs: [
      'https://instagram.com/jchairstudios62',
      'https://facebook.com/jchairstudios62',
      'https://tiktok.com/@jchairstudios62',
      'https://youtube.com/@jchairstudios62'
    ]
  };
}