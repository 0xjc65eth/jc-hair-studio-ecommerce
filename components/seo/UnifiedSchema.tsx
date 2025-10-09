'use client';

import React from 'react';
import Script from 'next/script';

/**
 * Unified Schema.org Component - JC Hair Studio's 62
 * Comprehensive structured data implementation for maximum SEO impact
 * Supports: Product, LocalBusiness, Organization, BreadcrumbList, Review, FAQ, WebSite
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ProductSchemaProps {
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
  inStock?: boolean;
  sku?: string;
  color?: string;
  length?: number;
  weight?: string;
  material?: string;
  countryOfOrigin?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ReviewItem {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ============================================================================
// SCHEMA GENERATORS
// ============================================================================

function generateProductSchema(product: ProductSchemaProps, baseUrl: string) {
  const productUrl = `${baseUrl}/produto/${product.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': productUrl,
    name: product.name,
    description: product.description,
    image: product.images.map(img => img.startsWith('http') ? img : `${baseUrl}${img}`),
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
      ...(product.comparePrice && product.comparePrice > product.price && {
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: product.price.toFixed(2),
          priceCurrency: product.currency || 'EUR',
          referenceQuantity: {
            '@type': 'QuantitativeValue',
            value: 1,
            unitCode: 'EA'
          }
        }
      }),
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
      ...(product.material ? [{
        '@type': 'PropertyValue',
        name: 'Material',
        value: product.material
      }] : []),
      {
        '@type': 'PropertyValue',
        name: 'Family Tradition',
        value: '40+ years'
      }
    ]
  };
}

function generateOrganizationSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: "JC Hair Studio's 62",
    alternateName: ["JC Hair Studios 62", "JC Hair Studio"],
    legalName: "JC Hair Studio's 62",
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo-brasil.png`,
      width: 250,
      height: 60
    },
    image: `${baseUrl}/og-image-brasil.jpg`,
    description: 'Loja online especializada em produtos capilares brasileiros premium, mega hair 100% humano, progressivas Vogue, maquiagem brasileira e tratamentos capilares profissionais com mais de 40 anos de tradição familiar.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'R. Gil Vicente, N°5',
      addressLocality: 'Seixal',
      addressRegion: 'Setúbal',
      postalCode: '2840-474',
      addressCountry: 'PT'
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

function generateLocalBusinessSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': `${baseUrl}/#localbusiness`,
    name: "JC Hair Studio's 62",
    image: `${baseUrl}/og-image-brasil.jpg`,
    url: baseUrl,
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
      {
        '@type': 'Country',
        name: 'Portugal'
      },
      {
        '@type': 'Country',
        name: 'Belgium'
      },
      {
        '@type': 'Country',
        name: 'Spain'
      },
      {
        '@type': 'Country',
        name: 'France'
      }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Hair Services and Products',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Hair Extensions Application',
            description: 'Professional Brazilian mega hair application service'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Hair Straightening Treatments',
            description: 'Brazilian progressive hair straightening'
          }
        }
      ]
    }
  };
}

function generateWebsiteSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: "JC Hair Studio's 62",
    description: 'Loja online de produtos capilares brasileiros premium. Mega hair 100% humano, progressivas Vogue, maquiagem brasileira.',
    publisher: {
      '@id': `${baseUrl}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/buscar?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'pt-PT'
  };
}

function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[], baseUrl: string) {
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

function generateReviewSchema(productId: string, reviews: ReviewItem[], baseUrl: string) {
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
      name: review.author
    },
    reviewBody: review.comment,
    datePublished: review.date
  }));
}

function generateFAQSchema(faqs: FAQItem[]) {
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
// COMPONENTS
// ============================================================================

export function ProductSchema({ product }: { product: ProductSchemaProps }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';
  const schema = generateProductSchema(product, baseUrl);

  return (
    <Script
      id={`product-schema-${product.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="beforeInteractive"
    />
  );
}

export function OrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';
  const schema = generateOrganizationSchema(baseUrl);

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="beforeInteractive"
    />
  );
}

export function LocalBusinessSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';
  const schema = generateLocalBusinessSchema(baseUrl);

  return (
    <Script
      id="localbusiness-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="beforeInteractive"
    />
  );
}

export function WebsiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';
  const schema = generateWebsiteSchema(baseUrl);

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="beforeInteractive"
    />
  );
}

export function BreadcrumbSchema({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';
  const schema = generateBreadcrumbSchema(breadcrumbs, baseUrl);

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="beforeInteractive"
    />
  );
}

export function ReviewsSchema({ productId, reviews }: { productId: string; reviews: ReviewItem[] }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';
  const schemas = generateReviewSchema(productId, reviews, baseUrl);

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={`review-schema-${index}`}
          id={`review-schema-${productId}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          strategy="beforeInteractive"
        />
      ))}
    </>
  );
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = generateFAQSchema(faqs);

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="beforeInteractive"
    />
  );
}

// ============================================================================
// UNIFIED SCHEMA COMPONENT
// ============================================================================

interface UnifiedSchemaProps {
  type: 'product' | 'homepage' | 'category' | 'contact' | 'faq';
  product?: ProductSchemaProps;
  breadcrumbs?: BreadcrumbItem[];
  reviews?: ReviewItem[];
  faqs?: FAQItem[];
}

export default function UnifiedSchema({
  type,
  product,
  breadcrumbs = [],
  reviews = [],
  faqs = []
}: UnifiedSchemaProps) {
  return (
    <>
      {/* Always include Organization on every page */}
      <OrganizationSchema />

      {/* Type-specific schemas */}
      {type === 'homepage' && (
        <>
          <WebsiteSchema />
          <LocalBusinessSchema />
        </>
      )}

      {type === 'product' && product && (
        <>
          <ProductSchema product={product} />
          {reviews.length > 0 && <ReviewsSchema productId={product.id} reviews={reviews} />}
        </>
      )}

      {type === 'contact' && <LocalBusinessSchema />}

      {type === 'faq' && faqs.length > 0 && <FAQSchema faqs={faqs} />}

      {/* Breadcrumbs on all pages */}
      {breadcrumbs.length > 0 && <BreadcrumbSchema breadcrumbs={breadcrumbs} />}
    </>
  );
}

// ============================================================================
// HELPER EXPORTS
// ============================================================================

export {
  generateProductSchema,
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateReviewSchema,
  generateFAQSchema
};
