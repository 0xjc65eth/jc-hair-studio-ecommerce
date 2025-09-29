import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../../../../lib/services/productService';

/**
 * API para produtos com estoque baixo (para gestão de inventário)
 * GET /api/inventory/low-stock
 */
export async function GET(request: NextRequest) {
  try {
    const products = await ProductService.getLowStockProducts();

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      message: products.length > 0 
        ? `${products.length} produtos com estoque baixo encontrados` 
        : 'Nenhum produto com estoque baixo',
      alert: products.length > 0 
        ? 'Atenção: Alguns produtos estão com estoque baixo e precisam ser repostos' 
        : null
    });
  } catch (error) {
    console.error('Low Stock API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}