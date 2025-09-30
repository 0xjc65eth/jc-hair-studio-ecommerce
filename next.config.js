/** @type {import('next').NextConfig} */
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const nextConfig = {
  // TypeScript handling with environment-aware configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint handling with environment-aware configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization configuration
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Performance optimizations
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3001', 'jc-hair-studio.vercel.app'],
    },
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
    cpus: 1,
  },

  // Output configuration for Vercel
  output: 'standalone',

  // React configuration
  reactStrictMode: false,

  // Build optimization
  compiler: {
    // Remove console logs in production builds
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Webpack optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Add case-sensitive paths plugin for consistent builds
    config.plugins.push(new CaseSensitivePathsPlugin());

    // Memory optimization settings
    config.optimization = {
      ...config.optimization,
      // Split chunks more aggressively to reduce memory usage
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 20,
            chunks: 'all',
          },
          stripe: {
            test: /[\\/]node_modules[\\/](@stripe)[\\/]/,
            name: 'stripe',
            priority: 15,
            chunks: 'all',
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|@headlessui|lucide-react)[\\/]/,
            name: 'ui-libs',
            priority: 10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      },
      // Enable module concatenation for better performance
      concatenateModules: true,
    };

    // Reduce memory usage during build
    config.cache = false;

    // Optimize parallelization for Vercel limits
    if (!dev && !isServer) {
      config.optimization.minimizer = config.optimization.minimizer?.map((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.parallel = 1; // Limit parallel processes
          minimizer.options.terserOptions = {
            ...minimizer.options.terserOptions,
            compress: {
              ...minimizer.options.terserOptions?.compress,
              passes: 1, // Reduce compression passes
            },
          };
        }
        return minimizer;
      });
    }

    // Memory management
    config.stats = {
      all: false,
      errors: true,
      warnings: true,
    };

    // Bundle analyzer support
    if (process.env.ANALYZE === 'true') {
      const withBundleAnalyzer = require('@next/bundle-analyzer')({
        enabled: true,
      });
      return withBundleAnalyzer(config);
    }

    return config;
  },

  // Environment variables
  env: {
    CUSTOM_BUILD_ID: process.env.VERCEL_GIT_COMMIT_SHA || 'local-build',
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'Server',
            value: 'JC Hair Studio'
          }
        ]
      }
    ];
  },

  // Redirects and rewrites optimization
  async redirects() {
    return [];
  },

  async rewrites() {
    return [];
  },

  // Page generation optimization
  generateEtags: true,
  poweredByHeader: false,
  compress: true,

  // Development optimizations
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Static generation optimization for memory
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },

  // Memory optimization for static pages
  staticPageGenerationTimeout: 120,
};

module.exports = nextConfig;