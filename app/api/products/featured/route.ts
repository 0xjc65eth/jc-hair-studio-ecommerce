import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../../../../lib/services/productService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 8;

    const products = await ProductService.getFeaturedProducts(limit);

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Featured Products API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}