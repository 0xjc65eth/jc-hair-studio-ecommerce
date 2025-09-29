import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../../../../lib/services/productService';

/**
 * API para produtos de marcas brasileiras
 * GET /api/products/brazilian-brands
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20;

    const products = await ProductService.getBrazilianBrandsProducts(limit);

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      message: 'Produtos de marcas brasileiras carregados com sucesso'
    });
  } catch (error) {
    console.error('Brazilian Brands API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}