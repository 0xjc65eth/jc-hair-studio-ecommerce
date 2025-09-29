/**
 * SchemaMarkup Component - Rich Snippets Generator
 * Dynamically injects structured data for maximum Google rich snippets presence
 */

import Script from 'next/script';
import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateCategorySchema,
  generateWebsiteSchema,
  generateLocalBusinessSchema,
  generateFAQSchema,
  generateReviewSchema,
  organizationSchema,
  injectSchema,
  validateSchema
} from '@/lib/utils/schemaMarkup';

interface SchemaMarkupProps {
  type: 'product' | 'category' | 'homepage' | 'local' | 'faq' | 'organization';
  data?: any;
  breadcrumbs?: Array<{name: string, url: string}>;
  reviews?: any[];
  faqs?: Array<{question: string, answer: string}>;
}

export default function SchemaMarkup({
  type,
  data,
  breadcrumbs = [],
  reviews = [],
  faqs = []
}: SchemaMarkupProps) {

  const generateSchemas = () => {
    const schemas: any[] = [];

    // Always include organization schema
    schemas.push(organizationSchema);

    // Add type-specific schemas
    switch (type) {
      case 'product':
        if (data) {
          const productSchema = generateProductSchema(data);
          if (validateSchema(productSchema)) {
            schemas.push(productSchema);
          }

          // Add reviews if available
          if (reviews.length > 0) {
            const reviewSchemas = generateReviewSchema(data.id, reviews);
            reviewSchemas.forEach((schema: any) => {
              if (validateSchema(schema)) {
                schemas.push(schema);
              }
            });
          }
        }
        break;

      case 'category':
        if (data) {
          const categorySchema = generateCategorySchema(data.category || data.slug, data.products || []);
          if (validateSchema(categorySchema)) {
            schemas.push(categorySchema);
          }
        }
        break;

      case 'homepage':
        const websiteSchema = generateWebsiteSchema();
        if (validateSchema(websiteSchema)) {
          schemas.push(websiteSchema);
        }
        break;

      case 'local':
        const localSchema = generateLocalBusinessSchema();
        if (validateSchema(localSchema)) {
          schemas.push(localSchema);
        }
        break;

      case 'faq':
        if (faqs.length > 0) {
          const faqSchema = generateFAQSchema(faqs);
          if (validateSchema(faqSchema)) {
            schemas.push(faqSchema);
          }
        }
        break;

      case 'organization':
        // Already included above
        break;
    }

    // Add breadcrumb schema if provided
    if (breadcrumbs.length > 0) {
      const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
      if (validateSchema(breadcrumbSchema)) {
        schemas.push(breadcrumbSchema);
      }
    }

    return schemas;
  };

  const schemas = generateSchemas();

  if (schemas.length === 0) {
    return null;
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={`schema-${type}-${index}`}
          id={`schema-${type}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: injectSchema(schema)
          }}
        />
      ))}
    </>
  );
}

// Product Page Schema Component
interface ProductSchemaProps {
  product: any;
  reviews?: any[];
  breadcrumbs?: Array<{name: string, url: string}>;
}

export function ProductSchema({ product, reviews = [], breadcrumbs = [] }: ProductSchemaProps) {
  // Default breadcrumbs for product pages
  const defaultBreadcrumbs = [
    { name: 'Início', url: '/' },
    { name: 'Produtos', url: '/produtos' },
    ...(product.category ? [{
      name: product.category,
      url: `/categoria/${product.category.toLowerCase().replace(/\s+/g, '-')}`
    }] : []),
    { name: product.name || product.nome, url: `/produto/${product.id}` }
  ];

  const finalBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  return (
    <SchemaMarkup
      type="product"
      data={product}
      breadcrumbs={finalBreadcrumbs}
      reviews={reviews}
    />
  );
}

// Category Page Schema Component
interface CategorySchemaProps {
  category: string;
  products: any[];
  breadcrumbs?: Array<{name: string, url: string}>;
}

export function CategorySchema({ category, products, breadcrumbs = [] }: CategorySchemaProps) {
  // Default breadcrumbs for category pages
  const defaultBreadcrumbs = [
    { name: 'Início', url: '/' },
    { name: 'Produtos', url: '/produtos' },
    { name: category, url: `/${category.toLowerCase().replace(/\s+/g, '-')}` }
  ];

  const finalBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  return (
    <SchemaMarkup
      type="category"
      data={{ category, products }}
      breadcrumbs={finalBreadcrumbs}
    />
  );
}

// Homepage Schema Component
export function HomepageSchema() {
  const breadcrumbs = [
    { name: 'Início', url: '/' }
  ];

  return (
    <SchemaMarkup
      type="homepage"
      breadcrumbs={breadcrumbs}
    />
  );
}

// FAQ Schema Component
interface FAQSchemaProps {
  faqs: Array<{question: string, answer: string}>;
  breadcrumbs?: Array<{name: string, url: string}>;
}

export function FAQSchema({ faqs, breadcrumbs = [] }: FAQSchemaProps) {
  return (
    <SchemaMarkup
      type="faq"
      faqs={faqs}
      breadcrumbs={breadcrumbs}
    />
  );
}

// Local Business Schema Component (for contact/about pages)
interface LocalBusinessSchemaProps {
  breadcrumbs?: Array<{name: string, url: string}>;
}

export function LocalBusinessSchema({ breadcrumbs = [] }: LocalBusinessSchemaProps) {
  return (
    <SchemaMarkup
      type="local"
      breadcrumbs={breadcrumbs}
    />
  );
}

// Rich Snippets Preview Component (for development/testing)
interface RichSnippetsPreviewProps {
  schemas: any[];
}

export function RichSnippetsPreview({ schemas }: RichSnippetsPreviewProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg z-50">
      <div className="mb-2 font-bold text-blue-600">Rich Snippets Preview</div>
      {schemas.map((schema, index) => (
        <div key={index} className="mb-2 p-2 bg-gray-50 rounded text-xs">
          <div className="font-semibold">{schema['@type']}</div>
          <div className="text-gray-600 truncate">{schema.name || schema.title}</div>
          {schema.offers?.price && (
            <div className="text-green-600">€{schema.offers.price}</div>
          )}
          {schema.aggregateRating?.ratingValue && (
            <div className="text-yellow-600">
              ★ {schema.aggregateRating.ratingValue} ({schema.aggregateRating.reviewCount} reviews)
            </div>
          )}
        </div>
      ))}
    </div>
  );
}