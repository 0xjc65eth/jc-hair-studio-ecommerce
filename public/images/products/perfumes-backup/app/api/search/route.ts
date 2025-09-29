import { NextRequest, NextResponse } from 'next/server';
// import { SearchService } from '../../../lib/services/searchService';
// import { withOptionalAuth, withSecurityHeaders, withRateLimit } from '../../../lib/auth/middleware';
import { categories } from '@/lib/data/categories';
import { getAllStaticProducts } from '@/lib/data/staticProducts';

async function searchHandler(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse search parameters
    const filters = {
      query: searchParams.get('q') || undefined,
      categories: searchParams.getAll('category'),
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'relevance',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    };

    // Validate page and limit
    if (filters.page < 1) filters.page = 1;
    if (filters.limit < 1 || filters.limit > 50) filters.limit = 12;

    console.log('🔍 Search API - Filters:', filters);
    console.log('🔍 Search API - Categories imported:', typeof categories, Array.isArray(categories));

    // Get static products using function
    const staticProducts = getAllStaticProducts();
    console.log('🔍 Search API - StaticProducts loaded:', staticProducts?.length || 0);

    // Force recompilation trigger

    // Collect all products from categories and static products
    const allProducts: any[] = [];

    // Get products from categories
    console.log('🔍 Search API - Processing categories:', categories?.length || 0);
    categories.forEach(category => {
      console.log('🔍 Search API - Category:', category.name, 'products:', category.products?.length || 0);
      if (category.products) {
        category.products.forEach(product => {
          allProducts.push({
            id: product.id,
            name: product.name,
            slug: product.id,
            price: product.price,
            comparePrice: product.originalPrice,
            description: product.description,
            category: category.name,
            brand: product.brand,
            images: [product.image],
            colors: [],
            sizes: [],
            tags: product.features || []
          });
        });
      }
    });

    console.log('🔍 Search API - Products from categories:', allProducts.length);

    // Get products from staticProducts
    if (staticProducts && Array.isArray(staticProducts)) {
      console.log('🔍 Search API - Processing staticProducts:', staticProducts.length);
      staticProducts.forEach(produto => {
        if (!allProducts.find(p => p.id === produto.id)) {
          allProducts.push({
            id: produto.id,
            name: produto.nome,
            slug: produto.id,
            price: produto.pricing?.discountPrice || produto.pricing?.ourPrice || 0,
            comparePrice: produto.pricing?.basePrice,
            description: produto.descricao,
            category: 'Produtos', // StaticProducts don't have categoria field
            brand: produto.marca,
            images: produto.imagens,
            colors: [], // StaticProducts don't have cores field
            sizes: [], // StaticProducts don't have tamanhos field
            tags: produto.badge ? [produto.badge] : []
          });
        }
      });
    }

    console.log('🔍 Search API - Total products collected:', allProducts.length);

    // Search and filter products
    let results = allProducts;

    // Text search
    if (filters.query) {
      const searchTerm = filters.query.toLowerCase().trim();
      results = results.filter(product => {
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          product.category?.toLowerCase().includes(searchTerm) ||
          product.brand?.toLowerCase().includes(searchTerm) ||
          product.colors?.some((cor: string) => cor.toLowerCase().includes(searchTerm)) ||
          product.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))
        );
      });
    }

    // Apply filters
    if (filters.categories.length > 0) {
      results = results.filter(product =>
        filters.categories.includes(product.category || '')
      );
    }

    if (filters.priceMin !== undefined) {
      results = results.filter(product => product.price >= filters.priceMin!);
    }

    if (filters.priceMax !== undefined) {
      results = results.filter(product => product.price <= filters.priceMax!);
    }

    // Sort results
    switch (filters.sortBy) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        results.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'relevance':
      default:
        if (filters.query) {
          results.sort((a, b) => {
            const aRelevance = a.name.toLowerCase().includes(filters.query!.toLowerCase()) ? 1 : 0;
            const bRelevance = b.name.toLowerCase().includes(filters.query!.toLowerCase()) ? 1 : 0;
            return bRelevance - aRelevance;
          });
        }
        break;
    }

    // Pagination
    const total = results.length;
    const totalPages = Math.ceil(total / filters.limit);
    const offset = (filters.page - 1) * filters.limit;
    const paginatedResults = results.slice(offset, offset + filters.limit);

    const result = {
      products: paginatedResults,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: total,
        totalPages: totalPages,
        hasNext: filters.page < totalPages,
        hasPrev: filters.page > 1
      },
      query: filters.query,
      totalFound: total
    };

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

// Export the handler
export const GET = searchHandler;