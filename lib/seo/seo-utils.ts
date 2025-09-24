/**
 * Utilities para SEO - JC Hair Studio's 62
 * Funções para gerar meta tags, structured data e otimizações específicas
 */

import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'product' | 'category';
  url?: string;
  noIndex?: boolean;
  canonical?: string;
  structuredData?: any;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';
const SITE_NAME = "JC Hair Studio's 62";

// Keywords específicos para produtos brasileiros
export const BRAZILIAN_HAIR_KEYWORDS = [
  'mega hair brasileiro',
  'cabelo humano brasileiro',
  'extensão capilar brasil',
  'mega hair natural',
  'cabelo brasileiro premium',
  'extensão cabelo 100% humano',
  'mega hair liso',
  'mega hair cacheado',
  'mega hair ondulado',
  'cabelo brasileiro europa'
];

export const PROGRESSIVE_KEYWORDS = [
  'progressiva vogue',
  'progressiva brasileira',
  'btx capilar',
  'botox capilar',
  'alisamento brasileiro',
  'progressiva original',
  'tratamento capilar brasileiro',
  'progressiva profissional',
  'alisamento natural',
  'queratina brasileira'
];

export const BRAZILIAN_MAKEUP_KEYWORDS = [
  'maquiagem brasileira',
  'cosméticos brasil',
  'natura produtos',
  'eudora maquiagem',
  'ruby rose batom',
  'avon cosméticos',
  'quem disse berenice',
  'maquiagem brasileira europa',
  'cosméticos originais brasil',
  'beleza brasileira'
];

export const LOCATION_KEYWORDS = [
  'produtos brasileiros portugal',
  'cosméticos brasil europa',
  'loja brasileira portugal',
  'produtos brasil bélgica',
  'mega hair entrega europa',
  'produtos autênticos brasil',
  'importação brasil portugal',
  'tradição brasileira europa'
];

export function generateSEOMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    type = 'website',
    url,
    noIndex = false,
    canonical,
    structuredData
  } = config;

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const imageUrl = image ? (image.startsWith('http') ? image : `${BASE_URL}${image}`) : `${BASE_URL}/og-image-brasil.jpg`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    canonical: canonical || fullUrl,

    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'pt_PT',
      type: type as any,
    },

    twitter: {
      card: 'summary_large_image',
      site: '@jchairstudios62',
      creator: '@jchairstudios62',
      title: fullTitle,
      description,
      images: [imageUrl],
    },

    alternates: {
      canonical: canonical || fullUrl,
    },
  };

  return metadata;
}

// Gerador de meta tags específicas para produtos
export function generateProductSEO(product: {
  name: string;
  description: string;
  price: number;
  category?: string;
  brand?: string;
  images?: Array<{ url: string; alt: string }>;
  slug?: string;
}): SEOConfig {
  const categoryKeywords = product.category?.toLowerCase().includes('mega')
    ? BRAZILIAN_HAIR_KEYWORDS
    : product.category?.toLowerCase().includes('progressiva')
    ? PROGRESSIVE_KEYWORDS
    : product.category?.toLowerCase().includes('maquiagem')
    ? BRAZILIAN_MAKEUP_KEYWORDS
    : [];

  const keywords = [
    ...categoryKeywords.slice(0, 8),
    ...LOCATION_KEYWORDS.slice(0, 4),
    `${product.brand?.toLowerCase()} ${product.category?.toLowerCase()}`,
    `${product.name.toLowerCase()}`,
    'produtos brasileiros premium',
    'qualidade profissional',
    'tradição familiar',
    'entrega europa'
  ].filter(Boolean);

  return {
    title: `${product.name} - ${product.brand || 'Premium'} | Produtos Brasileiros`,
    description: `${product.description.substring(0, 150)}... Preço: €${product.price}. Produtos brasileiros autênticos com +40 anos de tradição familiar. Entrega em toda Europa.`,
    keywords,
    image: product.images?.[0]?.url,
    type: 'product',
    url: `/produto/${product.slug || 'produto'}`,
  };
}

// Gerador de meta tags para categorias
export function generateCategorySEO(category: {
  name: string;
  description: string;
  slug: string;
  productCount?: number;
}): SEOConfig {
  const categoryType = category.slug.toLowerCase();

  let keywords: string[] = [];
  if (categoryType.includes('mega') || categoryType.includes('cabelo')) {
    keywords = [...BRAZILIAN_HAIR_KEYWORDS, ...LOCATION_KEYWORDS.slice(0, 3)];
  } else if (categoryType.includes('progressiva') || categoryType.includes('tratamento')) {
    keywords = [...PROGRESSIVE_KEYWORDS, ...LOCATION_KEYWORDS.slice(0, 3)];
  } else if (categoryType.includes('maquiagem') || categoryType.includes('cosmetico')) {
    keywords = [...BRAZILIAN_MAKEUP_KEYWORDS, ...LOCATION_KEYWORDS.slice(0, 3)];
  }

  keywords.push(
    'produtos brasileiros premium',
    'qualidade profissional',
    'tradição familiar 40 anos',
    'entrega europa',
    'produtos autênticos'
  );

  return {
    title: `${category.name} Brasileiros Premium | ${category.productCount ? `${category.productCount}+ Produtos` : 'Produtos'} | JC Hair Studio's 62`,
    description: `${category.description} ${category.productCount ? `Mais de ${category.productCount} produtos` : 'Grande variedade'} brasileiros premium com garantia de qualidade. Tradição familiar +40 anos. Entrega em toda Europa.`,
    keywords,
    type: 'category',
    url: `/categoria/${category.slug}`,
  };
}

// Landing pages específicas para SEO
export const SEO_LANDING_PAGES = {
  'mega-hair-brasileiro': {
    title: 'Mega Hair Brasileiro 100% Humano Premium | Extensões Capilares Brasil',
    description: 'Mega hair brasileiro 100% humano com qualidade premium. Liso, cacheado, ondulado. Tradição familiar +40 anos. Entrega Europa. Cabelo natural brasileiro autêntico.',
    keywords: [...BRAZILIAN_HAIR_KEYWORDS, ...LOCATION_KEYWORDS],
  },
  'progressiva-brasileira': {
    title: 'Progressiva Brasileira Original | Vogue BTX Capilar Premium',
    description: 'Progressivas brasileiras originais Vogue, BTX capilar profissional. Produtos autênticos importados do Brasil. Tradição +40 anos. Entrega Europa.',
    keywords: [...PROGRESSIVE_KEYWORDS, ...LOCATION_KEYWORDS],
  },
  'maquiagem-brasileira-europa': {
    title: 'Maquiagem Brasileira Original | Natura, Eudora, Ruby Rose Europa',
    description: 'Maquiagem brasileira original em Portugal e Europa. Natura, Eudora, Ruby Rose, Avon. Cosméticos autênticos importados do Brasil. Entrega garantida.',
    keywords: [...BRAZILIAN_MAKEUP_KEYWORDS, ...LOCATION_KEYWORDS],
  }
};

// Função para gerar FAQ estruturado para SEO
export function generateSEOFAQ(category: string) {
  const baseFAQs = [
    {
      question: 'Os produtos são realmente brasileiros originais?',
      answer: 'Sim! Todos nossos produtos são importados diretamente do Brasil com certificado de autenticidade. Temos +40 anos de experiência e garantimos a procedência.'
    },
    {
      question: 'Quanto tempo demora a entrega para Portugal/Europa?',
      answer: 'Entregamos em 5-10 dias úteis para Portugal, 7-14 dias para outros países europeus. Frete grátis acima de €150.'
    },
    {
      question: 'Vocês têm garantia nos produtos?',
      answer: 'Sim! Oferecemos garantia de qualidade em todos os produtos. Caso não fique satisfeito, temos política de devolução de 30 dias.'
    }
  ];

  const categorySpecificFAQs: { [key: string]: Array<{question: string, answer: string}> } = {
    'mega-hair': [
      {
        question: 'O mega hair é 100% cabelo humano brasileiro?',
        answer: 'Sim! Nosso mega hair é 100% cabelo humano brasileiro com cutículas alinhadas, sem processos químicos agressivos. Qualidade premium garantida.'
      },
      {
        question: 'Quanto tempo dura o mega hair brasileiro?',
        answer: 'Com cuidados adequados, nosso mega hair brasileiro pode durar de 8 a 12 meses, mantendo qualidade e aparência natural.'
      }
    ],
    'progressiva': [
      {
        question: 'As progressivas Vogue são originais do Brasil?',
        answer: 'Sim! Somos distribuidores autorizados das progressivas Vogue originais. Importamos diretamente do fabricante brasileiro.'
      },
      {
        question: 'Qual a diferença entre BTX e progressiva?',
        answer: 'O BTX é um tratamento de hidratação e nutrição, enquanto a progressiva foca no alisamento. Ambos são tratamentos brasileiros de alta qualidade.'
      }
    ],
    'maquiagem': [
      {
        question: 'As marcas de maquiagem são originais do Brasil?',
        answer: 'Sim! Trabalhamos apenas com marcas originais como Natura, Eudora, Ruby Rose, importadas diretamente do Brasil.'
      },
      {
        question: 'A maquiagem brasileira é adequada para todos os tons de pele?',
        answer: 'Sim! A maquiagem brasileira é famosa pela diversidade de tons, desenvolvida para a miscigenação brasileira, adequada para todos os tipos de pele.'
      }
    ]
  };

  return [
    ...baseFAQs,
    ...(categorySpecificFAQs[category] || [])
  ];
}

// Utility para slug SEO-friendly
export function generateSEOSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim()
    .replace(/^-|-$/g, ''); // Remove hífens do início e fim
}

// Schema.org para análise de reviews
export function generateReviewSchema(reviews: Array<{
  rating: number;
  comment: string;
  author: string;
  date: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5
      },
      author: {
        '@type': 'Person',
        name: review.author
      },
      datePublished: review.date,
      reviewBody: review.comment
    }))
  };
}