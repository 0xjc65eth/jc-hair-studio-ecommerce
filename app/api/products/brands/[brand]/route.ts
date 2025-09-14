import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../../../../../lib/services/productService';

/**
 * API para produtos por marca específica
 * GET /api/products/brands/[brand]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brand: string }> }
) {
  try {
    const { brand } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 12;

    // Decode the brand name from URL
    const decodedBrand = decodeURIComponent(brand);

    const products = await ProductService.getProductsByBrand(decodedBrand, limit);

    if (products.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: `Nenhum produto encontrado para a marca "${decodedBrand}"`
      });
    }

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      brand: decodedBrand,
      message: `Produtos da marca ${decodedBrand} carregados com sucesso`
    });
  } catch (error) {
    console.error('Brand Products API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}