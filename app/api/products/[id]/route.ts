import { NextRequest, NextResponse } from 'next/server';
import { resolveProductById } from '../../../../lib/services/productResolver';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 API: Resolving product ID "${productId}"`);

    const product = resolveProductById(productId);

    if (!product) {
      console.log(`❌ API: Product "${productId}" not found`);
      return NextResponse.json(
        { success: false, message: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    console.log(`✅ API: Product "${product.name || product.nome}" found successfully`);

    return NextResponse.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('❌ API: Error resolving product:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}