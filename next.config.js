/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    }
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    unoptimized: true,
  },

  // Environment variables (removed NODE_ENV as it's not allowed)
  env: {
    SKIP_TYPE_CHECK: 'true',
    SKIP_LINT: 'true',
    NEXT_TELEMETRY_DISABLED: '1'
  },

  // Build configuration
  distDir: '.next',
  generateEtags: false,

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Skip problematic modules during build
    config.externals = config.externals || {};

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        child_process: false,
      };
    }

    // Ignore warnings and continue build
    config.stats = {
      warnings: false,
      errors: false,
    };

    return config;
  },


  // Output configuration
  output: 'standalone',

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;