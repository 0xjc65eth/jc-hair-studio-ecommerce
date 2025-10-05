/**
 * ISR (Incremental Static Regeneration) Configuration
 *
 * This configuration optimizes static generation for Vercel builds
 */

const ISRConfig = {
  // Static page revalidation times (in seconds)
  revalidation: {
    // Product category pages - Cache for 1 hour
    productCategories: 3600,

    // Product detail pages - Cache for 30 minutes
    productDetails: 1800,

    // Home page - Cache for 15 minutes
    homePage: 900,

    // Blog posts - Cache for 24 hours
    blogPosts: 86400,

    // Static pages - Cache for 7 days
    staticPages: 604800
  },

  // Dynamic route generation limits
  dynamicRoutes: {
    // Limit concurrent generation to prevent memory issues
    maxConcurrent: 5,

    // Timeout for dynamic route generation
    timeout: 120000, // 2 minutes

    // Fallback strategy
    fallback: 'blocking'
  },

  // Build-time optimizations
  buildOptimizations: {
    // Disable source maps in production to save memory
    generateSourceMaps: false,

    // Limit static page generation during build
    maxStaticPages: 50,

    // Enable build-time caching
    enableBuildCache: true
  }
};

module.exports = ISRConfig;