// Simplified Middleware for SEO tracking
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Match all pathnames except for API routes and static files
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - feed (product feed for Google Merchant)
     * - .xml files (XML feeds)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|feed|feed\\.xml|product-feed\\.xml|.*\\.xml|.*\\..*|robots\\.txt|sitemap\\.xml).*)',
  ],
};