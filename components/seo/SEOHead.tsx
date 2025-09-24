'use client';

import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'category';
  structuredData?: any;
  noIndex?: boolean;
  canonical?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';
const SITE_NAME = "JC Hair Studio's 62";

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  structuredData,
  noIndex = false,
  canonical
}: SEOHeadProps) {
  useEffect(() => {
    // Atualizar title dinâmico se fornecido
    if (title) {
      document.title = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    }

    // Atualizar ou criar meta tags
    if (description) {
      updateMetaTag('description', description);
    }

    if (keywords && keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '));
    }

    // Open Graph tags
    if (title) {
      updateMetaTag('og:title', title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`);
    }
    if (description) {
      updateMetaTag('og:description', description);
    }
    if (image) {
      updateMetaTag('og:image', image.startsWith('http') ? image : `${BASE_URL}${image}`);
    }
    if (url) {
      updateMetaTag('og:url', `${BASE_URL}${url}`);
    }
    updateMetaTag('og:type', type);
    updateMetaTag('og:site_name', SITE_NAME);

    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', '@jchairstudios62');
    updateMetaTag('twitter:creator', '@jchairstudios62');
    if (title) {
      updateMetaTag('twitter:title', title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`);
    }
    if (description) {
      updateMetaTag('twitter:description', description);
    }
    if (image) {
      updateMetaTag('twitter:image', image.startsWith('http') ? image : `${BASE_URL}${image}`);
    }

    // Robots
    updateMetaTag('robots', noIndex ? 'noindex,nofollow' : 'index,follow');

    // Canonical
    if (canonical || url) {
      updateLinkTag('canonical', canonical || `${BASE_URL}${url}`);
    }

    // Structured Data
    if (structuredData) {
      addStructuredData(structuredData);
    }

  }, [title, description, keywords, image, url, type, structuredData, noIndex, canonical]);

  return null; // Este componente não renderiza nada visível
}

// Utility functions
function updateMetaTag(property: string, content: string) {
  const isProperty = property.startsWith('og:') || property.startsWith('twitter:');
  const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;

  let meta = document.querySelector(selector) as HTMLMetaElement;

  if (!meta) {
    meta = document.createElement('meta');
    if (isProperty) {
      meta.setAttribute('property', property);
    } else {
      meta.setAttribute('name', property);
    }
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }

  link.setAttribute('href', href);
}

function addStructuredData(data: any) {
  // Remove existing structured data script if any
  const existingScript = document.querySelector('script[data-seo="dynamic"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo', 'dynamic');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// Brazilian Products specific keywords by category
export const SEO_KEYWORDS = {
  megahair: [
    'mega hair brasileiro',
    'cabelo humano brasileiro',
    'extensão capilar brasil',
    'mega hair natural',
    'cabelo brasileiro premium',
    'extensão cabelo 100% humano',
    'mega hair liso cacheado ondulado',
    'cabelo brasileiro europa'
  ],

  progressiva: [
    'progressiva vogue original',
    'progressiva brasileira premium',
    'btx capilar profissional',
    'botox capilar brasileiro',
    'alisamento brasileiro',
    'progressiva profissional',
    'queratina brasileira',
    'tratamento capilar brasil'
  ],

  maquiagem: [
    'maquiagem brasileira original',
    'cosméticos brasil europa',
    'natura produtos portugal',
    'eudora maquiagem',
    'ruby rose batom',
    'avon cosméticos',
    'quem disse berenice',
    'maquiagem brasileira europa'
  ],

  location: [
    'produtos brasileiros portugal',
    'cosméticos brasil europa',
    'loja brasileira portugal',
    'produtos brasil bélgica',
    'mega hair entrega europa',
    'produtos autênticos brasil'
  ]
};

// Predefined structured data generators
export const SEO_STRUCTURED_DATA = {
  product: (product: {
    name: string;
    description: string;
    price: number;
    image?: string;
    brand?: string;
    category?: string;
    rating?: number;
    reviews?: number;
    availability?: boolean;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image ? `${BASE_URL}${product.image}` : undefined,
    brand: {
      '@type': 'Brand',
      name: product.brand || "JC Hair Studio's 62"
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      availability: product.availability ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
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
    countryOfOrigin: 'BR',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Origem',
        value: 'Brasil'
      },
      {
        '@type': 'PropertyValue',
        name: 'Tradição',
        value: '+40 anos'
      }
    ]
  }),

  category: (category: {
    name: string;
    description: string;
    url: string;
    products: Array<{name: string; price: number; image: string}>
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `${BASE_URL}${category.url}`,
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
          image: `${BASE_URL}${product.image}`,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: product.price.toFixed(2)
          }
        }
      }))
    }
  }),

  faq: (faqs: Array<{question: string; answer: string}>) => ({
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
  })
};