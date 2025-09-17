import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Enhanced Security and Performance Middleware for JC Hair Studio
 *
 * Features:
 * - Security headers (CSP, HSTS, etc.)
 * - Rate limiting for API routes
 * - Image optimization headers
 * - GDPR compliance headers
 * - Performance optimizations
 */

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security configuration
const SECURITY_HEADERS = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.stripe.com https://www.google-analytics.com",
    "frame-src 'self' https://js.stripe.com",
    "media-src 'self' blob: https:",
    "worker-src 'self' blob:",
  ].join('; '),

  // Security headers
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

  // HTTPS enforcement
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // GDPR compliance
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Permitted-Cross-Domain-Policies': 'none',
};

// Performance headers
const PERFORMANCE_HEADERS = {
  'Cache-Control': 'public, max-age=31536000, immutable',
  'X-DNS-Prefetch-Control': 'on',
};

// Rate limiting configuration
const RATE_LIMITS = {
  '/api/auth': { requests: 5, window: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  '/api/search': { requests: 100, window: 60 * 1000 }, // 100 requests per minute
  '/api/products': { requests: 200, window: 60 * 1000 }, // 200 requests per minute
  '/api/cart': { requests: 50, window: 60 * 1000 }, // 50 requests per minute
  '/api/checkout': { requests: 10, window: 60 * 1000 }, // 10 requests per minute
  '/api/webhooks': { requests: 100, window: 60 * 1000 }, // 100 webhooks per minute
  'default': { requests: 300, window: 60 * 1000 }, // Default: 300 requests per minute
};

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

/**
 * Rate limiting implementation
 */
function isRateLimited(request: NextRequest): boolean {
  const ip = getClientIP(request);
  const pathname = request.nextUrl.pathname;

  // Find matching rate limit rule
  let rateLimit = RATE_LIMITS.default;
  for (const [path, limit] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(path) && path !== 'default') {
      rateLimit = limit;
      break;
    }
  }

  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const stored = rateLimitStore.get(key);

  if (!stored || now > stored.resetTime) {
    // Reset or first request
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + rateLimit.window
    });
    return false;
  }

  if (stored.count >= rateLimit.requests) {
    return true;
  }

  stored.count++;
  return false;
}

/**
 * Clean up expired rate limit entries
 */
function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check if request is from a bot
 */
function isBot(userAgent: string): boolean {
  const botPatterns = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /rogerbot/i,
    /linkedinbot/i,
    /embedly/i,
    /quora link preview/i,
    /showyoubot/i,
    /outbrain/i,
    /pinterest/i,
    /developers.google.com/i,
  ];

  return botPatterns.some(pattern => pattern.test(userAgent));
}

/**
 * Apply security headers to response
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Apply performance headers for static assets
 */
function applyPerformanceHeaders(response: NextResponse, pathname: string): NextResponse {
  // Apply caching headers for static assets
  if (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/static/') ||
    pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot|css|js)$/)
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Apply short cache for API responses
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

/**
 * Handle blocked countries (if needed for legal compliance)
 */
function isBlockedCountry(request: NextRequest): boolean {
  const country = request.headers.get('cf-ipcountry') ||
                 request.headers.get('x-vercel-ip-country') ||
                 request.geo?.country;

  // Add any countries that need to be blocked for legal reasons
  const blockedCountries: string[] = [];

  return blockedCountries.includes(country || '');
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const ip = getClientIP(request);

  // Clean up rate limit store periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    cleanupRateLimit();
  }

  // Block certain countries if required
  if (isBlockedCountry(request)) {
    return NextResponse.json(
      { error: 'Service not available in your region' },
      { status: 451 }
    );
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    if (isRateLimited(request)) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: '60 seconds'
        },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 60)
          }
        }
      );
    }
  }

  // Special handling for admin routes
  if (pathname.startsWith('/admin')) {
    // Add additional admin security checks here
    // For example, IP whitelist, additional authentication, etc.
  }

  // Bot detection and handling
  if (isBot(userAgent)) {
    // Allow bots but with different headers
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'index, follow');
    return applySecurityHeaders(response);
  }

  // Continue with normal request
  const response = NextResponse.next();

  // Apply security headers
  applySecurityHeaders(response);

  // Apply performance headers
  applyPerformanceHeaders(response, pathname);

  // Add custom headers for debugging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('X-Client-IP', ip);
    response.headers.set('X-User-Agent', userAgent);
    response.headers.set('X-Pathname', pathname);
  }

  // GDPR compliance headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-GDPR-Compliant', 'true');

  // Performance timing header
  response.headers.set('X-Response-Time', String(Date.now()));

  return response;
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};