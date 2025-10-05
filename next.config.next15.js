/** @type {import('next').NextConfig} */
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const nextConfig = {
  // TypeScript handling with production-ready configuration
  typescript: {
    ignoreBuildErrors: false, // ✅ Enable type checking
  },

  // ESLint handling with production-ready configuration
  eslint: {
    ignoreDuringBuilds: false, // ✅ Enable linting
  },

  // Image optimization configuration - Next.js 15 compatible
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // ✅ Remove deprecated unoptimized for better performance
  },

  // Next.js 15 optimized experimental features
  experimental: {
    // ✅ Next.js 15 compatible serverActions
    serverActions: {
      allowedOrigins: ['localhost:3001', 'jc-hair-studio.vercel.app'],
      bodySizeLimit: '2mb',
    },
    // ✅ New Next.js 15 optimizations
    optimizePackageImports: ['lucide-react', '@heroicons/react', '@radix-ui/react-slot'],
    turbotrace: {
      logLevel: 'error',
    },
    // ✅ Enable for better performance
    esmExternals: true,
    // ✅ Next.js 15 feature for better server components
    serverComponentsExternalPackages: ['mongoose', 'bcryptjs'],
  },

  // Output configuration for Vercel - Next.js 15 optimized
  output: 'standalone',

  // React configuration - Next.js 15 best practices
  reactStrictMode: true, // ✅ Enable for better debugging

  // Build optimization - Next.js 15 compatible
  compiler: {
    // Remove console logs in production builds
    removeConsole: process.env.NODE_ENV === 'production',
    // ✅ Enable emotion if using CSS-in-JS
    emotion: true,
  },

  // Webpack optimization - Next.js 15 compatible
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Add case-sensitive paths plugin for consistent builds
    config.plugins.push(new CaseSensitivePathsPlugin());

    // ✅ Enable caching for better performance (Next.js 15 improvement)
    if (!dev) {
      config.cache = {
        type: 'filesystem',
        allowCollectingMemory: false,
        cacheDirectory: '.next/cache/webpack',
      };
    }

    // Memory optimization settings - Next.js 15 optimized
    config.optimization = {
      ...config.optimization,
      // ✅ Better chunk splitting for Next.js 15
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
          // ✅ Next.js 15 specific optimizations
          nextjs: {
            test: /[\\/]node_modules[\\/]next[\\/]/,
            name: 'nextjs',
            priority: 25,
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

    // ✅ Next.js 15 optimized bundle analyzer support
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true,
        })
      );
    }

    return config;
  },

  // Environment variables
  env: {
    CUSTOM_BUILD_ID: process.env.VERCEL_GIT_COMMIT_SHA || 'local-build',
  },

  // Headers for security and performance - Next.js 15 compatible
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
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
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

  // Page generation optimization - Next.js 15 compatible
  generateEtags: true,
  poweredByHeader: false,
  compress: true,

  // ✅ Next.js 15 improved static generation
  generateBuildId: async () => {
    return process.env.VERCEL_GIT_COMMIT_SHA || `build-${Date.now()}`;
  },

  // ✅ Increased timeout for Next.js 15
  staticPageGenerationTimeout: 180,

  // ✅ Next.js 15 logging improvements
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
};

module.exports = nextConfig;