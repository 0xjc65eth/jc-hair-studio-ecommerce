/**
 * MAXIMIZED SCHEMA.ORG COMPONENT - JC Hair Studio's 62
 *
 * Complete Schema.org implementation for instant Google indexing and rich results.
 * This component provides ALL necessary structured data types for maximum SEO impact.
 *
 * Features:
 * - WebSite schema with SearchAction (enables Google Sitelinks Search Box)
 * - Organization schema with complete business details
 * - LocalBusiness schema for local SEO
 * - Product schema with offers, ratings, reviews
 * - CollectionPage schema for category pages
 * - ItemList for product listings
 * - BreadcrumbList for navigation
 * - FAQPage for FAQ sections
 * - Review and AggregateRating schemas
 *
 * Google Rich Results supported:
 * - Product rich snippets with price, availability, ratings
 * - Star ratings in search results
 * - Breadcrumb navigation
 * - FAQ accordions
 * - Local business information
 * - Sitelinks search box
 */

'use client';

import Script from 'next/script';
import { useMemo } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface BaseSchemaProps {
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

export interface ProductSchemaData {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  comparePrice?: number;
  currency?: string;
  brand?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  reviews?: ReviewData[];
  inStock?: boolean;
  sku?: string;
  color?: string;
  length?: number;
  weight?: string;
  material?: string;
  countryOfOrigin?: string;
}

export interface ReviewData {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQData {
  question: string;
  answer: string;
}

export interface CategorySchemaData {
  name: string;
  description: string;
  slug: string;
  image?: string;
  products: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    image: string;
    inStock?: boolean;
  }>;
}

// ============================================================================
// SCHEMA GENERATORS
// ============================================================================

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';

/**
 * WebSite Schema - Enables Google Sitelinks Search Box
 * This is CRITICAL for homepage and should be on every page
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "JC Hair Studio's 62",
    description: 'Loja online de produtos capilares brasileiros premium. Mega hair 100% humano, progressivas Vogue, maquiagem brasileira.',
    publisher: {
      '@id': `${BASE_URL}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/busca?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'pt-PT'
  };
}

/**
 * Organization Schema - Complete business information
 * Should appear on EVERY page for brand consistency
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: "JC Hair Studio's 62",
    alternateName: ["JC Hair Studios 62", "JC Hair Studio"],
    legalName: "JC Hair Studio's 62",
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo-brasil.png`,
      width: 250,
      height: 60
    },
    image: `${BASE_URL}/og-image-brasil.jpg`,
    description: 'Loja online especializada em produtos capilares brasileiros premium, mega hair 100% humano, progressivas Vogue, maquiagem brasileira e tratamentos capilares profissionais com mais de 40 anos de tradição familiar.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'R. Gil Vicente, N°5',
      addressLocality: 'Seixal',
      addressRegion: 'Setúbal',
      postalCode: '2840-474',
      addressCountry: 'PT'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 38.6500,
      longitude: -9.1000
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+351928375226',
        contactType: 'Customer Service',
        areaServed: ['PT', 'BE', 'ES', 'FR', 'IT', 'DE', 'NL'],
        availableLanguage: ['Portuguese', 'English', 'Spanish', 'French']
      }
    ],
    sameAs: [
      'https://instagram.com/jchairstudios62',
      'https://facebook.com/jchairstudios62',
      'https://tiktok.com/@jchairstudios62',
      'https://youtube.com/@jchairstudios62'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
      bestRating: '5',
      worstRating: '1'
    }
  };
}

/**
 * LocalBusiness Schema - For local SEO and Google Maps
 * Essential for contact pages and homepage
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['HairSalon', 'Store'],
    '@id': `${BASE_URL}/#localbusiness`,
    name: "JC Hair Studio's 62",
    image: `${BASE_URL}/og-image-brasil.jpg`,
    url: BASE_URL,
    telephone: '+351928375226',
    email: 'info@jchairstudios62.xyz',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'R. Gil Vicente, N°5',
      addressLocality: 'Seixal',
      addressRegion: 'Setúbal',
      postalCode: '2840-474',
      addressCountry: 'PT'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 38.6500,
      longitude: -9.1000
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      }
    ],
    priceRange: '€€',
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'],
    currenciesAccepted: 'EUR',
    areaServed: [
      { '@type': 'Country', name: 'Portugal' },
      { '@type': 'Country', name: 'Belgium' },
      { '@type': 'Country', name: 'Spain' },
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'Italy' },
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'Country', name: 'Netherlands' }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Hair Services and Products',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Aplicação de Mega Hair',
            description: 'Serviço profissional de aplicação de mega hair brasileiro'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Tratamentos de Alisamento Capilar',
            description: 'Progressivas e tratamentos brasileiros de alisamento'
          }
        }
      ]
    }
  };
}

/**
 * BreadcrumbList Schema - Navigation hierarchy
 * MUST be on every page for SEO and user experience
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    breadcrumbs = [{ name: 'Início', url: '/' }];
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${BASE_URL}${crumb.url}`
    }))
  };
}

/**
 * Product Schema - Rich product information
 * For individual product pages
 */
export function generateProductSchema(product: ProductSchemaData) {
  const productUrl = `${BASE_URL}/produto/${product.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': productUrl,
    name: product.name,
    description: product.description,
    image: product.images.map(img => img.startsWith('http') ? img : `${BASE_URL}${img}`),
    sku: product.sku || `JCH-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: product.brand || "JC Hair Studio's 62"
    },
    manufacturer: {
      '@type': 'Organization',
      name: "JC Hair Studio's 62",
      address: {
        '@type': 'PostalAddress',
        addressCountry: product.countryOfOrigin || 'BR'
      }
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: product.currency || 'EUR',
      price: product.price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: "JC Hair Studio's 62"
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'EUR'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: ['PT', 'ES', 'FR', 'BE', 'IT', 'DE', 'NL']
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 5,
            unitCode: 'DAY'
          }
        }
      }
    },
    ...(product.rating && product.reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toString(),
        reviewCount: product.reviewCount.toString(),
        bestRating: '5',
        worstRating: '1'
      }
    }),
    ...(product.reviews && product.reviews.length > 0 && {
      review: product.reviews.slice(0, 5).map(review => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating.toString(),
          bestRating: '5',
          worstRating: '1'
        },
        author: {
          '@type': 'Person',
          name: review.author
        },
        datePublished: review.date,
        reviewBody: review.comment
      }))
    }),
    ...(product.color && { color: product.color }),
    ...(product.material && { material: product.material }),
    ...(product.length && { size: `${product.length}cm` }),
    ...(product.weight && { weight: product.weight }),
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Country of Origin',
        value: product.countryOfOrigin || 'Brazil'
      },
      {
        '@type': 'PropertyValue',
        name: 'Family Tradition',
        value: '40+ years'
      }
    ]
  };
}

/**
 * CollectionPage Schema - For category/collection pages
 * Includes ItemList of products
 */
export function generateCollectionPageSchema(category: CategorySchemaData) {
  const categoryUrl = `${BASE_URL}/categoria/${category.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': categoryUrl,
    name: category.name,
    description: category.description,
    url: categoryUrl,
    ...(category.image && {
      image: category.image.startsWith('http') ? category.image : `${BASE_URL}${category.image}`
    }),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: category.products.length,
      itemListElement: category.products.slice(0, 20).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          '@id': `${BASE_URL}/produto/${product.id}`,
          name: product.name,
          url: `${BASE_URL}/produto/${product.id}`,
          image: product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`,
          offers: {
            '@type': 'Offer',
            price: product.price.toFixed(2),
            priceCurrency: 'EUR',
            availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
          }
        }
      }))
    }
  };
}

/**
 * FAQPage Schema - For FAQ sections
 * Enables FAQ rich results in Google
 */
export function generateFAQSchema(faqs: FAQData[]) {
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

// ============================================================================
// REACT COMPONENTS
// ============================================================================

interface MaximizedSchemaProps extends BaseSchemaProps {
  type: 'homepage' | 'product' | 'category' | 'contact' | 'faq' | 'generic';
  product?: ProductSchemaData;
  category?: CategorySchemaData;
  faqs?: FAQData[];
}

/**
 * MaximizedSchema Component
 *
 * Usage:
 * - Homepage: <MaximizedSchema type="homepage" breadcrumbs={[...]} />
 * - Product: <MaximizedSchema type="product" product={productData} breadcrumbs={[...]} />
 * - Category: <MaximizedSchema type="category" category={categoryData} breadcrumbs={[...]} />
 * - Contact: <MaximizedSchema type="contact" breadcrumbs={[...]} />
 * - FAQ: <MaximizedSchema type="faq" faqs={faqsData} breadcrumbs={[...]} />
 */
export default function MaximizedSchema({
  type,
  product,
  category,
  faqs = [],
  breadcrumbs = []
}: MaximizedSchemaProps) {

  const schemas = useMemo(() => {
    const schemaList: any[] = [];

    // ALWAYS include these on EVERY page
    schemaList.push(generateOrganizationSchema());
    schemaList.push(generateBreadcrumbSchema(breadcrumbs));

    // Type-specific schemas
    switch (type) {
      case 'homepage':
        schemaList.push(generateWebsiteSchema());
        schemaList.push(generateLocalBusinessSchema());
        break;

      case 'product':
        if (product) {
          schemaList.push(generateProductSchema(product));
        }
        break;

      case 'category':
        if (category) {
          schemaList.push(generateCollectionPageSchema(category));
        }
        break;

      case 'contact':
        schemaList.push(generateLocalBusinessSchema());
        break;

      case 'faq':
        if (faqs.length > 0) {
          schemaList.push(generateFAQSchema(faqs));
        }
        break;

      case 'generic':
        // Just organization and breadcrumbs
        break;
    }

    return schemaList;
  }, [type, product, category, faqs, breadcrumbs]);

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={`schema-${type}-${index}`}
          id={`schema-${type}-${schema['@type']}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          strategy="beforeInteractive"
        />
      ))}
    </>
  );
}

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

export function HomepageMaximizedSchema({ breadcrumbs }: BaseSchemaProps) {
  return <MaximizedSchema type="homepage" breadcrumbs={breadcrumbs} />;
}

export function ProductMaximizedSchema({
  product,
  breadcrumbs
}: {
  product: ProductSchemaData;
  breadcrumbs?: BaseSchemaProps['breadcrumbs'];
}) {
  return <MaximizedSchema type="product" product={product} breadcrumbs={breadcrumbs} />;
}

export function CategoryMaximizedSchema({
  category,
  breadcrumbs
}: {
  category: CategorySchemaData;
  breadcrumbs?: BaseSchemaProps['breadcrumbs'];
}) {
  return <MaximizedSchema type="category" category={category} breadcrumbs={breadcrumbs} />;
}

export function ContactMaximizedSchema({ breadcrumbs }: BaseSchemaProps) {
  return <MaximizedSchema type="contact" breadcrumbs={breadcrumbs} />;
}

export function FAQMaximizedSchema({
  faqs,
  breadcrumbs
}: {
  faqs: FAQData[];
  breadcrumbs?: BaseSchemaProps['breadcrumbs'];
}) {
  return <MaximizedSchema type="faq" faqs={faqs} breadcrumbs={breadcrumbs} />;
}

export function GenericMaximizedSchema({ breadcrumbs }: BaseSchemaProps) {
  return <MaximizedSchema type="generic" breadcrumbs={breadcrumbs} />;
}
