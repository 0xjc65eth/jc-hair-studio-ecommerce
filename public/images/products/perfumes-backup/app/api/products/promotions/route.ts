import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../../../../lib/services/productService';

/**
 * API para produtos em promoção
 * GET /api/products/promotions
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 12;

    const products = await ProductService.getProductsOnPromotion(limit);

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      message: 'Produtos em promoção carregados com sucesso'
    });
  } catch (error) {
    console.error('Promotions API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}