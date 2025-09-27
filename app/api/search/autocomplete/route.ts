// Autocomplete endpoint for JC Hair Studio's 62's 62 E-commerce
import { NextRequest, NextResponse } from 'next/server';
// import { SearchService } from '../../../../lib/services/searchService';
// import { withOptionalAuth, withSecurityHeaders, withRateLimit } from '../../../../lib/auth/middleware';
import { categories } from '@/lib/data/categories';
import { getAllStaticProducts } from '@/lib/data/staticProducts';

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

    // Get suggestions from static data
    const suggestions = new Set<string>();

    // Search in categories
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(category.name);
      }
      if (category.products) {
        category.products.forEach(product => {
          if (product.name.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(product.name);
          }
          if (product.brand && product.brand.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(product.brand);
          }
          // Note: Category products don't have colors field in this structure
        });
      }
    });

    // Search in static products
    const staticProducts = getAllStaticProducts();
    if (staticProducts && Array.isArray(staticProducts)) {
      staticProducts.forEach(produto => {
        if (produto.nome.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(produto.nome);
        }
        if (produto.marca && produto.marca.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(produto.marca);
        }
        // Note: StaticProducts doesn't have 'cores' field like categories products do
      });
    }

    const suggestionArray = Array.from(suggestions).slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        suggestions: suggestionArray,
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

// Export the handler
export const GET = autocompleteHandler;