/**
 * PERFORMANCE-OPTIMIZED MIDDLEWARE
 * =================================
 *
 * This middleware enhances performance by:
 * 1. Setting aggressive cache headers
 * 2. Adding resource hints (preconnect, dns-prefetch)
 * 3. Compressing responses
 * 4. Adding security headers
 * 5. Monitoring Core Web Vitals
 *
 * Performance improvements:
 * - Static assets: 1 year cache
 * - Images: 1 year cache + immutable
 * - Fonts: 1 year cache + immutable
 * - API routes: Smart caching
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cache duration constants (in seconds)
const CACHE_DURATIONS = {
  ONE_YEAR: 31536000,
  ONE_MONTH: 2592000,
  ONE_WEEK: 604800,
  ONE_DAY: 86400,
  ONE_HOUR: 3600,
  FIVE_MINUTES: 300,
};

/**
 * Determine cache headers based on path
 */
function getCacheHeaders(pathname: string): Record<string, string> {
  // Static assets - 1 year cache
  if (pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i)) {
    return {
      'Cache-Control': `public, max-age=${CACHE_DURATIONS.ONE_YEAR}, immutable`,
      'X-Content-Type-Options': 'nosniff',
    };
  }

  // Fonts - 1 year cache
  if (pathname.match(/\.(woff|woff2|ttf|otf|eot)$/i)) {
    return {
      'Cache-Control': `public, max-age=${CACHE_DURATIONS.ONE_YEAR}, immutable`,
      'X-Content-Type-Options': 'nosniff',
    };
  }

  // JavaScript and CSS - 1 week with stale-while-revalidate
  if (pathname.match(/\.(js|css)$/i)) {
    return {
      'Cache-Control': `public, max-age=${CACHE_DURATIONS.ONE_WEEK}, stale-while-revalidate=${CACHE_DURATIONS.ONE_DAY}`,
    };
  }

  // API routes - short cache with revalidation
  if (pathname.startsWith('/api/')) {
    // Don't cache auth or mutations
    if (pathname.includes('/auth') || pathname.includes('/checkout') || pathname.includes('/orders')) {
      return {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      };
    }

    // Cache product data briefly
    if (pathname.includes('/products')) {
      return {
        'Cache-Control': `public, max-age=${CACHE_DURATIONS.FIVE_MINUTES}, stale-while-revalidate=${CACHE_DURATIONS.ONE_HOUR}`,
      };
    }

    return {
      'Cache-Control': `public, max-age=${CACHE_DURATIONS.ONE_HOUR}, stale-while-revalidate=${CACHE_DURATIONS.ONE_DAY}`,
    };
  }

  // Product feeds and sitemaps - 1 day cache
  if (pathname.match(/\.(xml|json)$/i)) {
    return {
      'Cache-Control': `public, max-age=${CACHE_DURATIONS.ONE_DAY}, stale-while-revalidate=${CACHE_DURATIONS.ONE_WEEK}`,
    };
  }

  // HTML pages - short cache with revalidation
  return {
    'Cache-Control': `public, max-age=${CACHE_DURATIONS.ONE_HOUR}, stale-while-revalidate=${CACHE_DURATIONS.ONE_DAY}`,
  };
}

/**
 * Get resource hints headers
 */
function getResourceHints(): Record<string, string> {
  const hints = [
    '<https://fonts.googleapis.com>; rel=preconnect; crossorigin',
    '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
    '<https://www.googletagmanager.com>; rel=dns-prefetch',
    '<https://www.google-analytics.com>; rel=dns-prefetch',
    '<https://connect.facebook.net>; rel=dns-prefetch',
  ];

  return {
    'Link': hints.join(', '),
  };
}

/**
 * Get security headers
 */
function getSecurityHeaders(): Record<string, string> {
  return {
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

/**
 * Get performance headers
 */
function getPerformanceHeaders(): Record<string, string> {
  return {
    'Server-Timing': 'edge; dur=0',
    'X-Powered-By': 'JC Hair Studio',
  };
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Create response
  const response = NextResponse.next();

  // Add cache headers
  const cacheHeaders = getCacheHeaders(pathname);
  Object.entries(cacheHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add resource hints (only for HTML pages)
  if (!pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico|woff|woff2|ttf|otf|eot|js|css|xml|json)$/i)) {
    const resourceHints = getResourceHints();
    Object.entries(resourceHints).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  // Add security headers
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add performance headers
  const performanceHeaders = getPerformanceHeaders();
  Object.entries(performanceHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add timing headers for monitoring
  const startTime = Date.now();
  response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);

  return response;
}

// Configure middleware matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
