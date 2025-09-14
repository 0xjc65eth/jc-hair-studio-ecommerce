import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../../../../lib/services/productService';
import { ProductFilters } from '../../../../types/product';

/**
 * API para produtos com preços profissionais
 * GET /api/products/professional
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse filters from query parameters
    const filters: ProductFilters = {
      category: searchParams.getAll('category'),
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      hairType: searchParams.getAll('hairType') as any,
      hairTexture: searchParams.getAll('hairTexture') as any,
      length: searchParams.getAll('length').map(l => Number(l)),
      color: searchParams.getAll('color'),
      inStock: searchParams.get('inStock') === 'true',
      featured: searchParams.get('featured') === 'true',
      onSale: searchParams.get('onSale') === 'true',
      rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'newest',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    };

    const result = await ProductService.getProductsWithProfessionalPricing(filters);

    return NextResponse.json({
      success: true,
      products: result.products,
      pagination: result.pagination,
      filters: result.filters,
      message: 'Produtos com preços profissionais carregados'
    });
  } catch (error) {
    console.error('Professional Products API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}