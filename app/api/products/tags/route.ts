import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../../../../lib/services/productService';

/**
 * API para produtos por tags
 * GET /api/products/tags?tags=profissional,marca-brasileira
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tagSlugs = searchParams.getAll('tags').flatMap(tags => tags.split(','));
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 12;

    if (tagSlugs.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'É necessário fornecer pelo menos uma tag',
      }, { status: 400 });
    }

    const products = await ProductService.getProductsByTags(tagSlugs, limit);

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      tags: tagSlugs,
      message: `Produtos com as tags [${tagSlugs.join(', ')}] carregados com sucesso`
    });
  } catch (error) {
    console.error('Tags Products API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}