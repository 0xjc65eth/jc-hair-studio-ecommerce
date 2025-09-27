/**
 * SEO Testing & Validation Utilities - JC Hair Studio's 62
 * Tools for testing and validating schema markup and meta tags
 * Comprehensive testing strategy for rich snippets and SERP optimization
 */

interface SchemaValidationResult {
  valid: boolean;
  type: string;
  issues: string[];
  recommendations: string[];
  score: number; // 0-100
}

interface MetaValidationResult {
  title: {
    valid: boolean;
    length: number;
    issues: string[];
  };
  description: {
    valid: boolean;
    length: number;
    issues: string[];
  };
  keywords: {
    count: number;
    issues: string[];
  };
  openGraph: {
    valid: boolean;
    issues: string[];
  };
  twitter: {
    valid: boolean;
    issues: string[];
  };
  score: number; // 0-100
}

// Schema Validation
export function validateSchema(schema: any): SchemaValidationResult {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Basic structure validation
  if (!schema['@context']) {
    issues.push('Missing @context');
    score -= 20;
  } else if (schema['@context'] !== 'https://schema.org') {
    issues.push('Invalid @context - should be https://schema.org');
    score -= 10;
  }

  if (!schema['@type']) {
    issues.push('Missing @type');
    score -= 20;
  }

  const schemaType = schema['@type'];

  // Product schema validation
  if (schemaType === 'Product') {
    validateProductSchema(schema, issues, recommendations, score);
  }

  // Organization schema validation
  if (schemaType === 'Organization' || schemaType === 'OnlineStore') {
    validateOrganizationSchema(schema, issues, recommendations, score);
  }

  // Local Business schema validation
  if (schemaType === 'LocalBusiness' || schemaType === 'HairSalon') {
    validateLocalBusinessSchema(schema, issues, recommendations, score);
  }

  // Breadcrumb schema validation
  if (schemaType === 'BreadcrumbList') {
    validateBreadcrumbSchema(schema, issues, recommendations, score);
  }

  // FAQ schema validation
  if (schemaType === 'FAQPage') {
    validateFAQSchema(schema, issues, recommendations, score);
  }

  return {
    valid: issues.length === 0,
    type: schemaType,
    issues,
    recommendations,
    score: Math.max(0, score)
  };
}

function validateProductSchema(schema: any, issues: string[], recommendations: string[], score: number): number {
  // Required fields for Product
  if (!schema.name) {
    issues.push('Product missing name');
    score -= 15;
  }

  if (!schema.description) {
    issues.push('Product missing description');
    score -= 10;
  } else if (schema.description.length < 50) {
    recommendations.push('Product description should be at least 50 characters');
    score -= 5;
  }

  if (!schema.image) {
    issues.push('Product missing image');
    score -= 10;
  }

  if (!schema.offers) {
    issues.push('Product missing offers');
    score -= 15;
  } else {
    if (!schema.offers.price) {
      issues.push('Product offer missing price');
      score -= 10;
    }
    if (!schema.offers.priceCurrency) {
      issues.push('Product offer missing priceCurrency');
      score -= 5;
    }
    if (!schema.offers.availability) {
      issues.push('Product offer missing availability');
      score -= 5;
    }
  }

  if (!schema.brand) {
    recommendations.push('Consider adding brand information');
    score -= 3;
  }

  if (!schema.sku) {
    recommendations.push('Consider adding SKU for better product identification');
    score -= 2;
  }

  if (!schema.aggregateRating) {
    recommendations.push('Add aggregate rating for rich snippets');
    score -= 5;
  }

  return score;
}

function validateOrganizationSchema(schema: any, issues: string[], recommendations: string[], score: number): number {
  if (!schema.name) {
    issues.push('Organization missing name');
    score -= 15;
  }

  if (!schema.url) {
    issues.push('Organization missing URL');
    score -= 10;
  }

  if (!schema.logo) {
    recommendations.push('Add logo for better brand recognition');
    score -= 5;
  }

  if (!schema.contactPoint) {
    recommendations.push('Add contact information');
    score -= 8;
  }

  if (!schema.address) {
    recommendations.push('Add business address');
    score -= 5;
  }

  return score;
}

function validateLocalBusinessSchema(schema: any, issues: string[], recommendations: string[], score: number): number {
  if (!schema.address) {
    issues.push('Local business missing address');
    score -= 15;
  }

  if (!schema.telephone) {
    issues.push('Local business missing telephone');
    score -= 10;
  }

  if (!schema.openingHoursSpecification) {
    recommendations.push('Add opening hours for better local SEO');
    score -= 5;
  }

  return score;
}

function validateBreadcrumbSchema(schema: any, issues: string[], recommendations: string[], score: number): number {
  if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
    issues.push('Breadcrumb missing itemListElement array');
    score -= 20;
  } else {
    schema.itemListElement.forEach((item: any, index: number) => {
      if (!item.position) {
        issues.push(`Breadcrumb item ${index} missing position`);
        score -= 5;
      }
      if (!item.name) {
        issues.push(`Breadcrumb item ${index} missing name`);
        score -= 5;
      }
      if (!item.item) {
        issues.push(`Breadcrumb item ${index} missing item URL`);
        score -= 5;
      }
    });
  }

  return score;
}

function validateFAQSchema(schema: any, issues: string[], recommendations: string[], score: number): number {
  if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
    issues.push('FAQ missing mainEntity array');
    score -= 20;
  } else {
    schema.mainEntity.forEach((item: any, index: number) => {
      if (item['@type'] !== 'Question') {
        issues.push(`FAQ item ${index} should be of type Question`);
        score -= 5;
      }
      if (!item.name) {
        issues.push(`FAQ question ${index} missing name`);
        score -= 5;
      }
      if (!item.acceptedAnswer) {
        issues.push(`FAQ question ${index} missing acceptedAnswer`);
        score -= 5;
      }
    });
  }

  return score;
}

// Meta Tags Validation
export function validateMetaTags(
  title: string | undefined,
  description: string | undefined,
  keywords: string[] | undefined,
  openGraph: any,
  twitter: any
): MetaValidationResult {
  const result: MetaValidationResult = {
    title: { valid: true, length: 0, issues: [] },
    description: { valid: true, length: 0, issues: [] },
    keywords: { count: 0, issues: [] },
    openGraph: { valid: true, issues: [] },
    twitter: { valid: true, issues: [] },
    score: 100
  };

  let score = 100;

  // Title validation
  if (!title) {
    result.title.issues.push('Title is missing');
    result.title.valid = false;
    score -= 20;
  } else {
    result.title.length = title.length;
    if (title.length < 30) {
      result.title.issues.push('Title too short (recommended: 30-60 characters)');
      score -= 10;
    }
    if (title.length > 60) {
      result.title.issues.push('Title too long (recommended: 30-60 characters)');
      score -= 10;
    }
    if (!title.includes('JC Hair Studio')) {
      result.title.issues.push('Consider including brand name in title');
      score -= 5;
    }
  }

  // Description validation
  if (!description) {
    result.description.issues.push('Description is missing');
    result.description.valid = false;
    score -= 20;
  } else {
    result.description.length = description.length;
    if (description.length < 120) {
      result.description.issues.push('Description too short (recommended: 120-155 characters)');
      score -= 10;
    }
    if (description.length > 155) {
      result.description.issues.push('Description too long (recommended: 120-155 characters)');
      score -= 10;
    }
  }

  // Keywords validation
  if (keywords) {
    result.keywords.count = keywords.length;
    if (keywords.length < 5) {
      result.keywords.issues.push('Consider adding more relevant keywords');
      score -= 5;
    }
    if (keywords.length > 20) {
      result.keywords.issues.push('Too many keywords, focus on most relevant ones');
      score -= 5;
    }
  }

  // Open Graph validation
  if (!openGraph) {
    result.openGraph.issues.push('Open Graph tags missing');
    result.openGraph.valid = false;
    score -= 15;
  } else {
    if (!openGraph.title) {
      result.openGraph.issues.push('OG title missing');
      score -= 5;
    }
    if (!openGraph.description) {
      result.openGraph.issues.push('OG description missing');
      score -= 5;
    }
    if (!openGraph.images || openGraph.images.length === 0) {
      result.openGraph.issues.push('OG image missing');
      score -= 10;
    }
    if (!openGraph.url) {
      result.openGraph.issues.push('OG URL missing');
      score -= 3;
    }
  }

  // Twitter validation
  if (!twitter) {
    result.twitter.issues.push('Twitter Card tags missing');
    result.twitter.valid = false;
    score -= 10;
  } else {
    if (!twitter.card) {
      result.twitter.issues.push('Twitter card type missing');
      score -= 3;
    }
    if (!twitter.title) {
      result.twitter.issues.push('Twitter title missing');
      score -= 3;
    }
    if (!twitter.description) {
      result.twitter.issues.push('Twitter description missing');
      score -= 3;
    }
  }

  result.score = Math.max(0, score);
  return result;
}

// Rich Snippets Testing URLs
export const TESTING_TOOLS = {
  googleRichResults: 'https://search.google.com/test/rich-results',
  googleStructuredData: 'https://search.google.com/structured-data/testing-tool',
  facebookDebugger: 'https://developers.facebook.com/tools/debug/',
  twitterCardValidator: 'https://cards-dev.twitter.com/validator',
  linkedInInspector: 'https://www.linkedin.com/post-inspector/',
  schemaMarkupValidator: 'https://validator.schema.org/',
  webPageTest: 'https://www.webpagetest.org/',
  googlePageSpeed: 'https://pagespeed.web.dev/'
};

// Generate test report for a URL
export function generateSEOTestReport(url: string) {
  const testUrls = Object.entries(TESTING_TOOLS).map(([tool, baseUrl]) => ({
    tool: tool.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    url: `${baseUrl}?url=${encodeURIComponent(url)}`
  }));

  return {
    url,
    testUrls,
    timestamp: new Date().toISOString(),
    instructions: [
      '1. Test structured data with Google Rich Results Test',
      '2. Validate schema markup with Schema.org validator',
      '3. Check social media previews with platform-specific tools',
      '4. Monitor Core Web Vitals with PageSpeed Insights',
      '5. Test mobile-friendliness and page speed',
      '6. Verify canonical URLs and meta tags',
      '7. Check for duplicate content issues'
    ]
  };
}

// Product-specific SEO checklist
export const PRODUCT_SEO_CHECKLIST = [
  {
    category: 'Schema Markup',
    items: [
      'Product schema with name, description, price',
      'Brand and manufacturer information',
      'Product images with proper alt text',
      'Availability and stock status',
      'SKU and product identifiers',
      'Aggregate rating and reviews',
      'Product specifications',
      'Shipping and return information'
    ]
  },
  {
    category: 'Meta Tags',
    items: [
      'Unique title tag (30-60 characters)',
      'Compelling meta description (120-155 characters)',
      'Relevant keywords without stuffing',
      'Open Graph tags for social sharing',
      'Twitter Card tags',
      'Canonical URL to prevent duplicate content'
    ]
  },
  {
    category: 'Content',
    items: [
      'Unique product descriptions (minimum 150 words)',
      'High-quality product images (multiple angles)',
      'Customer reviews and ratings',
      'Technical specifications',
      'Care instructions',
      'Related products section',
      'Breadcrumb navigation'
    ]
  },
  {
    category: 'Technical',
    items: [
      'Fast loading speed (Core Web Vitals)',
      'Mobile-responsive design',
      'Proper URL structure',
      'Internal linking strategy',
      'Image optimization and lazy loading',
      'Structured URL hierarchy'
    ]
  }
];

// Category-specific SEO checklist
export const CATEGORY_SEO_CHECKLIST = [
  {
    category: 'Schema Markup',
    items: [
      'CollectionPage or ItemList schema',
      'Product listings with basic schema',
      'Breadcrumb navigation schema',
      'Organization schema',
      'Local business schema (if applicable)'
    ]
  },
  {
    category: 'Meta Tags',
    items: [
      'Descriptive category title',
      'Category description with keywords',
      'Open Graph tags',
      'Twitter Card tags',
      'Pagination meta tags (if applicable)'
    ]
  },
  {
    category: 'Content',
    items: [
      'Category description and benefits',
      'Product filtering and sorting',
      'Product grid with key information',
      'Category-specific content',
      'Related categories',
      'SEO-friendly pagination'
    ]
  }
];

// Auto-generate SEO recommendations
export function generateSEORecommendations(pageType: string, data: any) {
  const recommendations: string[] = [];

  switch (pageType) {
    case 'product':
      if (!data.description || data.description.length < 150) {
        recommendations.push('Add detailed product description (minimum 150 words)');
      }
      if (!data.images || data.images.length < 2) {
        recommendations.push('Add multiple high-quality product images');
      }
      if (!data.reviews || data.reviews.length === 0) {
        recommendations.push('Encourage customer reviews for social proof');
      }
      if (!data.specifications) {
        recommendations.push('Add detailed product specifications');
      }
      break;

    case 'category':
      if (!data.description) {
        recommendations.push('Add compelling category description');
      }
      if (!data.featuredProducts) {
        recommendations.push('Highlight featured products in category');
      }
      if (data.products && data.products.length > 20) {
        recommendations.push('Implement pagination for large product catalogs');
      }
      break;

    case 'homepage':
      recommendations.push('Ensure homepage highlights key product categories');
      recommendations.push('Add customer testimonials and reviews');
      recommendations.push('Include clear value proposition');
      break;
  }

  // General recommendations
  recommendations.push('Monitor Core Web Vitals regularly');
  recommendations.push('Update content regularly for freshness');
  recommendations.push('Build quality backlinks from relevant sites');

  return recommendations;
}