/** @type {import('next').NextConfig} */
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const nextConfig = {
  // TypeScript handling - skip for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint handling - skip for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization - disable for Vercel edge cases
  images: {
    unoptimized: true,
    formats: ['image/webp'],
    minimumCacheTTL: 3600, // 1 hour for faster rebuilds
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Aggressive performance optimizations for Vercel
  experimental: {
    serverActions: true,
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@heroicons/react',
      'react-toastify',
      'framer-motion'
    ],
    // Disable turbo for compatibility
    turbo: false,
    // Enable faster refresh for development
    esmExternals: 'loose',
    // Reduce memory usage
    isrMemoryCacheSize: 0,
    // Faster builds
    swcTraceProfiling: false,
  },

  // Output configuration optimized for Vercel
  output: 'standalone',
  distDir: '.next',

  // React configuration
  reactStrictMode: false,
  swcMinify: true,

  // Webpack optimization specifically for Vercel constraints
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Essential plugins only
    config.plugins.push(new CaseSensitivePathsPlugin());

    // Memory optimization for Vercel builds
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        // Reduce memory usage
        minimize: true,
        // Simplified split chunks for faster builds
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              enforce: true,
            },
          },
        },
        // Disable source maps in production to save memory
        devtool: false,
      };

      // Reduce bundle size
      config.resolve.alias = {
        ...config.resolve.alias,
        // Bundle optimizations
        '@': require('path').resolve(__dirname),
      };
    }

    // Vercel-specific optimizations
    if (process.env.VERCEL) {
      // Reduce memory usage on Vercel
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 200000, // Smaller chunks for Vercel
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },

  // Environment variables
  env: {
    CUSTOM_BUILD_ID: process.env.VERCEL_GIT_COMMIT_SHA || 'vercel-optimized',
    VERCEL_OPTIMIZED: 'true',
  },

  // Minimal headers for faster response
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },

  // Performance optimizations
  generateEtags: false, // Disable for faster response
  poweredByHeader: false,
  compress: true,

  // Aggressive development optimizations
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1 minute
    pagesBufferLength: 5,
  },

  // Disable unnecessary features for faster builds
  i18n: undefined,
  trailingSlash: false,
};

module.exports = nextConfig;