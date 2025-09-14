import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '../../../lib/services/searchService';
import { withOptionalAuth, withSecurityHeaders, withRateLimit } from '../../../lib/auth/middleware';

async function searchHandler(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse search parameters
    const filters = {
      query: searchParams.get('q') || undefined,
      categories: searchParams.getAll('category'),
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      hairType: searchParams.getAll('hairType'),
      hairTexture: searchParams.getAll('hairTexture'),
      hairColor: searchParams.getAll('hairColor'),
      length: searchParams.getAll('length').map(l => Number(l)).filter(l => !isNaN(l)),
      rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
      inStock: searchParams.get('inStock') === 'true',
      featured: searchParams.get('featured') === 'true',
      onSale: searchParams.get('onSale') === 'true',
      sortBy: (searchParams.get('sortBy') as any) || 'relevance',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    };

    // Validate page and limit
    if (filters.page < 1) filters.page = 1;
    if (filters.limit < 1 || filters.limit > 50) filters.limit = 12;

    const result = await SearchService.searchProducts(filters);

    return NextResponse.json({
      success: true,
      data: result,
      filters: filters
    });

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        code: 'SEARCH_ERROR'
      },
      { status: 500 }
    );
  }
}

// Apply middleware
const GET = withSecurityHeaders(
  withRateLimit(
    withOptionalAuth(searchHandler),
    {
      maxRequests: 100,
      windowMs: 15 * 60 * 1000, // 15 minutes
      keyGenerator: (req) => {
        const forwarded = req.headers.get('x-forwarded-for');
        const realIp = req.headers.get('x-real-ip');
        const ip = forwarded?.split(',')[0] || realIp || 'anonymous';
        return `search:${ip}`;
      }
    }
  )
);

export { GET };