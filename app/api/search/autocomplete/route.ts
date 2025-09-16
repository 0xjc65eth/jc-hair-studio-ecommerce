// Autocomplete endpoint for JC Hair Studio's 62's 62 E-commerce
import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '../../../../lib/services/searchService';
import { withOptionalAuth, withSecurityHeaders, withRateLimit } from '../../../../lib/auth/middleware';

async function autocompleteHandler(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = Math.min(Number(searchParams.get('limit') || 10), 20);

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          suggestions: [],
          query: query
        }
      });
    }

    const suggestions = await SearchService.getAutocompleteSuggestions(query, limit);

    return NextResponse.json({
      success: true,
      data: {
        suggestions,
        query
      }
    });

  } catch (error) {
    console.error('Autocomplete API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        code: 'AUTOCOMPLETE_ERROR'
      },
      { status: 500 }
    );
  }
}

// Apply middleware
const GET = withSecurityHeaders(
  withRateLimit(
    withOptionalAuth(autocompleteHandler),
    {
      maxRequests: 200,
      windowMs: 15 * 60 * 1000, // 15 minutes
      keyGenerator: (req) => {
        const forwarded = req.headers.get('x-forwarded-for');
        const realIp = req.headers.get('x-real-ip');
        const ip = forwarded?.split(',')[0] || realIp || 'anonymous';
        return `autocomplete:${ip}`;
      }
    }
  )
);

export { GET };