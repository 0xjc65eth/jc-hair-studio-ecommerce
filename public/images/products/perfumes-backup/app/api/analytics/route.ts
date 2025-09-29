import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { MongoAnalyticsService } from '@/lib/services/mongoAnalyticsService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'page_views', 'product_views', 'dashboard'
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Para dados sensíveis, verificar se é admin
    if (type === 'dashboard') {
      const session = await getServerSession(authOptions);
      const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Acesso negado' },
          { status: 403 }
        );
      }
    }

    const filters: any = { page, limit };

    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (productId) filters.productId = productId;

    let result;

    switch (type) {
      case 'page_views':
        result = await MongoAnalyticsService.getPageViews(filters);
        break;

      case 'product_views':
        result = await MongoAnalyticsService.getProductViews(filters);
        break;

      case 'dashboard':
        result = await MongoAnalyticsService.getDashboardStats(filters);
        break;

      case 'popular_products':
        result = await MongoAnalyticsService.getPopularProducts(filters);
        break;

      case 'traffic_sources':
        result = await MongoAnalyticsService.getTrafficSources(filters);
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo de analytics inválido' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);

  } catch (error) {
    logger.error('Erro ao buscar analytics:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Tipo e dados são obrigatórios' },
        { status: 400 }
      );
    }

    // Obter informações da requisição
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    let result;

    switch (type) {
      case 'page_view':
        if (!data.path) {
          return NextResponse.json(
            { error: 'Path é obrigatório para page view' },
            { status: 400 }
          );
        }

        result = await MongoAnalyticsService.trackPageView({
          path: data.path,
          userId: data.userId || null,
          sessionId: data.sessionId || `session_${Date.now()}_${Math.random()}`,
          userAgent,
          ip: ip.split(',')[0].trim(),
          referer
        });
        break;

      case 'product_view':
        if (!data.productId) {
          return NextResponse.json(
            { error: 'ProductId é obrigatório para product view' },
            { status: 400 }
          );
        }

        result = await MongoAnalyticsService.trackProductView({
          productId: data.productId,
          userId: data.userId || null,
          sessionId: data.sessionId || `session_${Date.now()}_${Math.random()}`
        });
        break;

      case 'search':
        if (!data.query) {
          return NextResponse.json(
            { error: 'Query é obrigatório para search tracking' },
            { status: 400 }
          );
        }

        result = await MongoAnalyticsService.trackSearch({
          query: data.query,
          results: data.results || 0,
          userId: data.userId || null,
          sessionId: data.sessionId || `session_${Date.now()}_${Math.random()}`
        });
        break;

      case 'add_to_cart':
        if (!data.productId) {
          return NextResponse.json(
            { error: 'ProductId é obrigatório para add to cart tracking' },
            { status: 400 }
          );
        }

        result = await MongoAnalyticsService.trackAddToCart({
          productId: data.productId,
          quantity: data.quantity || 1,
          price: data.price || 0,
          userId: data.userId || null,
          sessionId: data.sessionId || `session_${Date.now()}_${Math.random()}`
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo de tracking inválido' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'Evento rastreado com sucesso',
      id: result._id
    });

  } catch (error) {
    console.error('Erro ao rastrear evento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}