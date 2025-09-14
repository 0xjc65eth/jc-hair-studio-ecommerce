'use client'

interface Product {
  id: string
  name: string
  description: string
  price: number
  retailPrice?: number
  images: Array<{ url: string; alt: string }>
  stock: number
  brand?: string
  category: string
  reviews?: Array<{
    rating: number
    comment: string
    author: string
    date: string
  }>
  characteristics?: {
    hairColor?: string
    length?: string
    hairType?: string
    hairTexture?: string
  }
}

interface Organization {
  name: string
  url: string
  logo: string
  description: string
  telephone?: string
  email?: string
  address?: {
    streetAddress: string
    addressLocality: string
    postalCode: string
    addressCountry: string
  }
}

interface BreadcrumbItem {
  name: string
  url: string
}

// Product Schema.org
export function ProductStructuredData({ product }: { product: Product }) {
  const averageRating = product.reviews?.length 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0

  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(img => img.url),
    brand: {
      '@type': 'Brand',
      name: product.brand || 'JC Hair Studio'
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'JC Hair Studio\'s 62'
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    aggregateRating: product.reviews?.length ? {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount: product.reviews.length,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    review: product.reviews?.map(review => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      author: {
        '@type': 'Person',
        name: review.author
      },
      reviewBody: review.comment,
      datePublished: review.date
    })),
    additionalProperty: Object.entries(product.characteristics || {}).map(([key, value]) => ({
      '@type': 'PropertyValue',
      name: key,
      value: value
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Organization Schema.org
export function OrganizationStructuredData({ organization }: { organization: Organization }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${organization.url}#organization`,
    name: organization.name,
    url: organization.url,
    logo: {
      '@type': 'ImageObject',
      url: organization.logo
    },
    description: organization.description,
    telephone: organization.telephone,
    email: organization.email,
    address: organization.address ? {
      '@type': 'PostalAddress',
      streetAddress: organization.address.streetAddress,
      addressLocality: organization.address.addressLocality,
      postalCode: organization.address.postalCode,
      addressCountry: organization.address.addressCountry
    } : undefined,
    sameAs: [
      'https://facebook.com/jchairstudio',
      'https://instagram.com/jchairstudio62',
      'https://tiktok.com/@jchairstudio'
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Website Schema.org
export function WebsiteStructuredData({ url, name }: { url: string; name: string }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}#website`,
    url: url,
    name: name,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/produtos?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Breadcrumb Schema.org
export function BreadcrumbStructuredData({ items, baseUrl }: { items: BreadcrumbItem[]; baseUrl: string }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Local Business Schema.org (for physical store)
export function LocalBusinessStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': 'https://jchairstudio.com#business',
    name: 'JC Hair Studio\'s 62',
    description: 'Salon especializado em extensões de cabelo premium, mega hair e tratamentos capilares de luxo.',
    url: 'https://jchairstudio.com',
    telephone: '+351-XXX-XXXXXX',
    email: 'contato@jchairstudio.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rua Example, 62',
      addressLocality: 'Lisboa',
      postalCode: '1000-000',
      addressCountry: 'PT'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '38.7223',
      longitude: '-9.1393'
    },
    openingHours: [
      'Mo-Fr 09:00-19:00',
      'Sa 09:00-17:00'
    ],
    priceRange: '€€-€€€',
    acceptsReservations: true,
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'],
    currenciesAccepted: 'EUR'
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// FAQ Schema.org
export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const structuredData = {
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
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}