# SCHEMA.ORG - QUICK REFERENCE GUIDE
# JC Hair Studio's 62

## Quick Implementation Guide

### For Homepage

```tsx
import { HomepageMaximizedSchema } from '@/components/seo/MaximizedSchema';

export default function HomePage() {
  return (
    <div>
      <HomepageMaximizedSchema
        breadcrumbs={[
          { name: 'Início', url: '/' }
        ]}
      />
      {/* Your page content */}
    </div>
  );
}
```

### For Product Pages

```tsx
import { ProductMaximizedSchema } from '@/components/seo/MaximizedSchema';

export default function ProductPage() {
  return (
    <div>
      <ProductMaximizedSchema
        product={{
          id: 'product-123',
          name: 'Mega Hair Brasileiro 100% Humano',
          description: 'Extensões de cabelo premium...',
          images: ['/images/product-1.jpg', '/images/product-2.jpg'],
          price: 185.00,
          currency: 'EUR',
          brand: 'JC Hair Studio\'s 62',
          category: 'Mega Hair',
          rating: 4.8,
          reviewCount: 127,
          reviews: [
            {
              author: 'Maria Silva',
              rating: 5,
              comment: 'Produto excelente!',
              date: '2024-01-15'
            }
          ],
          inStock: true,
          sku: 'JCH-123',
          material: 'Cabelo 100% Humano',
          countryOfOrigin: 'BR'
        }}
        breadcrumbs={[
          { name: 'Início', url: '/' },
          { name: 'Produtos', url: '/produtos' },
          { name: 'Mega Hair', url: '/mega-hair' },
          { name: 'Product Name', url: '/produto/123' }
        ]}
      />
      {/* Your page content */}
    </div>
  );
}
```

### For Category Pages

```tsx
import { CategoryMaximizedSchema } from '@/components/seo/MaximizedSchema';

export default function CategoryPage() {
  return (
    <div>
      <CategoryMaximizedSchema
        category={{
          name: 'Mega Hair Brasileiro',
          description: 'Extensões de cabelo 100% humano brasileiro premium',
          slug: 'mega-hair',
          image: '/images/category-mega-hair.jpg',
          products: [
            {
              id: '1',
              name: 'Product 1',
              price: 185.00,
              image: '/images/product-1.jpg',
              inStock: true
            }
          ]
        }}
        breadcrumbs={[
          { name: 'Início', url: '/' },
          { name: 'Mega Hair', url: '/mega-hair' }
        ]}
      />
      {/* Your page content */}
    </div>
  );
}
```

### For FAQ Pages

```tsx
import { FAQMaximizedSchema } from '@/components/seo/MaximizedSchema';

export default function FAQPage() {
  const faqs = [
    {
      question: 'O mega hair é 100% humano?',
      answer: 'Sim! Todos nossos mega hair são 100% cabelo humano brasileiro...'
    }
  ];

  return (
    <div>
      <FAQMaximizedSchema
        faqs={faqs}
        breadcrumbs={[
          { name: 'Início', url: '/' },
          { name: 'FAQ', url: '/faq' }
        ]}
      />
      {/* Your page content */}
    </div>
  );
}
```

### For Contact/About Pages

```tsx
import { ContactMaximizedSchema } from '@/components/seo/MaximizedSchema';

export default function ContactPage() {
  return (
    <div>
      <ContactMaximizedSchema
        breadcrumbs={[
          { name: 'Início', url: '/' },
          { name: 'Contato', url: '/contato' }
        ]}
      />
      {/* Your page content */}
    </div>
  );
}
```

### For Generic Pages

```tsx
import { GenericMaximizedSchema } from '@/components/seo/MaximizedSchema';

export default function GenericPage() {
  return (
    <div>
      <GenericMaximizedSchema
        breadcrumbs={[
          { name: 'Início', url: '/' },
          { name: 'Page Name', url: '/page' }
        ]}
      />
      {/* Your page content */}
    </div>
  );
}
```

---

## Testing Commands

### Test Homepage
```bash
# Google Rich Results Test
https://search.google.com/test/rich-results?url=https://jchairstudios62.xyz
```

### Test Product Page
```bash
# Replace [ID] with actual product ID
https://search.google.com/test/rich-results?url=https://jchairstudios62.xyz/produto/[ID]
```

### Test FAQ Page
```bash
https://search.google.com/test/rich-results?url=https://jchairstudios62.xyz/faq
```

### Test Contact Page
```bash
https://search.google.com/test/rich-results?url=https://jchairstudios62.xyz/contato
```

---

## What Each Schema Does

| Schema Type | Benefit | Where Used |
|------------|---------|------------|
| **WebSite** | Google Sitelinks Search Box | Homepage |
| **Organization** | Brand knowledge panel | Every page |
| **LocalBusiness** | Google Maps, local SEO | Homepage, Contact |
| **Product** | Rich product results with price/stars | Product pages |
| **CollectionPage** | Category rich results | Category pages |
| **FAQPage** | Expandable FAQs in search | FAQ page |
| **BreadcrumbList** | Navigation in search results | Every page |
| **Review** | Star ratings in search | Product pages |

---

## Component Exports

From `/components/seo/MaximizedSchema.tsx`:

```tsx
// Convenience Components
export function HomepageMaximizedSchema({ breadcrumbs })
export function ProductMaximizedSchema({ product, breadcrumbs })
export function CategoryMaximizedSchema({ category, breadcrumbs })
export function ContactMaximizedSchema({ breadcrumbs })
export function FAQMaximizedSchema({ faqs, breadcrumbs })
export function GenericMaximizedSchema({ breadcrumbs })

// Main Component
export default function MaximizedSchema({
  type,
  product,
  category,
  faqs,
  breadcrumbs
})

// Schema Generators (for custom use)
export function generateWebsiteSchema()
export function generateOrganizationSchema()
export function generateLocalBusinessSchema()
export function generateBreadcrumbSchema(breadcrumbs)
export function generateProductSchema(product)
export function generateCollectionPageSchema(category)
export function generateFAQSchema(faqs)
```

---

## Required Fields by Schema Type

### Product Schema
```typescript
{
  id: string;              // Required
  name: string;            // Required
  description: string;     // Required
  images: string[];        // Required (at least 1)
  price: number;           // Required
  currency?: string;       // Optional (defaults to EUR)
  brand?: string;          // Optional
  category?: string;       // Optional
  rating?: number;         // Optional (for stars)
  reviewCount?: number;    // Optional
  reviews?: ReviewData[];  // Optional
  inStock?: boolean;       // Optional (defaults to true)
  sku?: string;            // Optional
  color?: string;          // Optional
  length?: number;         // Optional
  weight?: string;         // Optional
  material?: string;       // Optional
  countryOfOrigin?: string; // Optional (defaults to BR)
}
```

### Category Schema
```typescript
{
  name: string;          // Required
  description: string;   // Required
  slug: string;          // Required
  image?: string;        // Optional
  products: Array<{      // Required
    id: string;
    name: string;
    price: number;
    image: string;
    inStock?: boolean;
  }>;
}
```

### FAQ Schema
```typescript
{
  question: string;  // Required
  answer: string;    // Required
}[]
```

---

## Common Issues & Solutions

### Issue: Schema not showing in Rich Results Test
**Solution:** Ensure component is client-side ('use client') and properly imported

### Issue: Duplicate schemas
**Solution:** Check if schema component is imported multiple times

### Issue: Invalid JSON
**Solution:** Use schema generators, they handle proper JSON formatting

### Issue: Missing required fields
**Solution:** Check TypeScript types, all required fields are marked

---

## Performance Notes

- Schemas are rendered as `<Script>` tags with `strategy="beforeInteractive"`
- No impact on Core Web Vitals
- Generated once per page load
- Cached by browser
- Small size (1-3KB per schema)

---

## SEO Impact

**Before Implementation:**
- Basic page titles and descriptions
- No rich results
- Generic search appearance

**After Implementation:**
- ✅ Star ratings in search results
- ✅ Price and availability shown
- ✅ FAQ expandable results
- ✅ Sitelinks search box
- ✅ Better click-through rates
- ✅ Faster Google indexing
- ✅ Knowledge panel eligibility

---

**Last Updated:** January 14, 2025
**Component Location:** `/components/seo/MaximizedSchema.tsx`
**Documentation:** See `SCHEMA-MAXIMIZATION-GUIDE.md` for full details
