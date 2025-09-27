import React from 'react';

export interface Review {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  title?: string;
}

export interface Tutorial {
  name: string;
  description: string;
  author: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
  datePublished: string;
  videoUrl?: string;
  supplies?: string[];
}

export interface Product {
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  sku?: string;
  gtin?: string;
}

interface ReviewSnippetsProps {
  product: Product;
  reviews: Review[];
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
}

interface TutorialSnippetsProps {
  tutorial: Tutorial;
  relatedProducts?: Product[];
}

interface ProductSnippetsProps {
  product: Product;
  reviews?: Review[];
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export function ReviewSnippets({ product, reviews, aggregateRating }: ReviewSnippetsProps) {
  const productReviewJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      ...(product.sku && { sku: product.sku }),
      ...(product.gtin && { gtin: product.gtin })
    },
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: aggregateRating.bestRating || 5,
        worstRating: aggregateRating.worstRating || 1
      }
    }),
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
      ...(review.title && { name: review.title })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productReviewJsonLd) }}
    />
  );
}

export function TutorialSnippets({ tutorial, relatedProducts }: TutorialSnippetsProps) {
  const tutorialJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: tutorial.name,
    description: tutorial.description,
    author: {
      '@type': 'Person',
      name: tutorial.author
    },
    totalTime: tutorial.duration,
    difficulty: tutorial.difficulty,
    category: tutorial.category,
    datePublished: tutorial.datePublished,
    ...(tutorial.videoUrl && {
      video: {
        '@type': 'VideoObject',
        name: tutorial.name,
        description: tutorial.description,
        contentUrl: tutorial.videoUrl
      }
    }),
    ...(tutorial.supplies && {
      supply: tutorial.supplies.map(supply => ({
        '@type': 'HowToSupply',
        name: supply
      }))
    }),
    step: tutorial.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: {
          '@type': 'ImageObject',
          url: step.image
        }
      })
    })),
    ...(relatedProducts && {
      mentions: relatedProducts.map(product => ({
        '@type': 'Product',
        name: product.name,
        brand: {
          '@type': 'Brand',
          name: product.brand
        }
      }))
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(tutorialJsonLd) }}
    />
  );
}

export function ProductSnippets({ product, reviews, aggregateRating }: ProductSnippetsProps) {
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    category: product.category,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      seller: {
        '@type': 'Organization',
        name: 'JC Hair Studio\'s 62'
      },
      ...(product.sku && { sku: product.sku }),
      ...(product.gtin && { gtin: product.gtin })
    },
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1
      }
    }),
    ...(reviews && {
      review: reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1
        },
        reviewBody: review.reviewBody,
        datePublished: review.datePublished
      }))
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
    />
  );
}

interface VideoSnippetsProps {
  video: {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration: string;
    contentUrl: string;
    embedUrl?: string;
    author: string;
    category: string;
  };
}

export function VideoSnippets({ video }: VideoSnippetsProps) {
  const videoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    ...(video.embedUrl && { embedUrl: video.embedUrl }),
    author: {
      '@type': 'Person',
      name: video.author
    },
    genre: video.category,
    publisher: {
      '@type': 'Organization',
      name: 'JC Hair Studio\'s 62',
      logo: {
        '@type': 'ImageObject',
        url: '/images/jc-logo.png'
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
    />
  );
}

interface ArticleSnippetsProps {
  article: {
    headline: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    image: string;
    category: string;
    keywords: string[];
    wordCount?: number;
  };
}

export function ArticleSnippets({ article }: ArticleSnippetsProps) {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    image: {
      '@type': 'ImageObject',
      url: article.image
    },
    publisher: {
      '@type': 'Organization',
      name: 'JC Hair Studio\'s 62',
      logo: {
        '@type': 'ImageObject',
        url: '/images/jc-logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': typeof window !== 'undefined' ? window.location.href : ''
    },
    articleSection: article.category,
    keywords: article.keywords.join(', '),
    ...(article.wordCount && { wordCount: article.wordCount })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
    />
  );
}

interface BreadcrumbSnippetsProps {
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSnippets({ breadcrumbs }: BreadcrumbSnippetsProps) {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
    />
  );
}

export interface FAQ {
  question: string;
  answer: string;
}

interface RichSnippetsProps {
  type: 'product' | 'product-collection' | 'tutorial' | 'article' | 'video';
  products?: Product[];
  product?: Product;
  tutorial?: Tutorial;
  article?: {
    headline: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    image: string;
    category: string;
    keywords: string[];
    wordCount?: number;
  };
  video?: {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration: string;
    contentUrl: string;
    embedUrl?: string;
    author: string;
    category: string;
  };
  reviews?: Review[];
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  faqs?: FAQ[];
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

export function RichSnippets({
  type,
  product,
  products,
  tutorial,
  article,
  video,
  reviews,
  aggregateRating,
  faqs,
  breadcrumbs
}: RichSnippetsProps) {
  const generateFAQSchema = (faqs: FAQ[]) => ({
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
  });

  const generateProductCollectionSchema = (products: Product[]) => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Produtos Brasileiros Premium',
    description: 'Coleção de produtos de beleza brasileiros',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          brand: {
            '@type': 'Brand',
            name: product.brand
          },
          category: product.category,
          description: product.description,
          image: product.image,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: product.currency,
            availability: `https://schema.org/${product.availability}`,
            seller: {
              '@type': 'Organization',
              name: 'JC Hair Studio\'s 62'
            }
          }
        }
      }))
    }
  });

  return (
    <>
      {breadcrumbs && <BreadcrumbSnippets breadcrumbs={breadcrumbs} />}

      {type === 'product' && product && (
        <ProductSnippets
          product={product}
          reviews={reviews}
          aggregateRating={aggregateRating}
        />
      )}

      {type === 'product-collection' && products && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateProductCollectionSchema(products))
          }}
        />
      )}

      {type === 'tutorial' && tutorial && (
        <TutorialSnippets tutorial={tutorial} relatedProducts={products} />
      )}

      {type === 'article' && article && (
        <ArticleSnippets article={article} />
      )}

      {type === 'video' && video && (
        <VideoSnippets video={video} />
      )}

      {faqs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQSchema(faqs))
          }}
        />
      )}
    </>
  );
}

export default {
  ReviewSnippets,
  TutorialSnippets,
  ProductSnippets,
  VideoSnippets,
  ArticleSnippets,
  BreadcrumbSnippets,
  RichSnippets
};