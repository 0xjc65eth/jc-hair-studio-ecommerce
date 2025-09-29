import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { MongoAnalyticsService } from '@/lib/services/mongoAnalyticsService';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { type, productId, path, userId, sessionId } = body;

    // Obter informações da requisição
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const baseSessionId = sessionId || `session_${Date.now()}_${Math.random()}`;

    let result;

    switch (type) {
      case 'page':
        if (!path) {
          return NextResponse.json(
            { error: 'Path é obrigatório' },
            { status: 400 }
          );
        }

        result = await MongoAnalyticsService.trackPageView({
          path,
          userId: userId || null,
          sessionId: baseSessionId,
          userAgent,
          ip: ip.split(',')[0].trim(),
          referer
        });
        break;

      case 'product':
        if (!productId) {
          return NextResponse.json(
            { error: 'ProductId é obrigatório' },
            { status: 400 }
          );
        }

        // Rastrear visualização de produto
        result = await MongoAnalyticsService.trackProductView({
          productId,
          userId: userId || null,
          sessionId: baseSessionId
        });

        // Também incrementar contador no produto
        await MongoAnalyticsService.incrementProductViewCount(productId);
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo de tracking inválido' },
          { status: 400 }
        );
    }

    // Resposta mínima para tracking
    return NextResponse.json({
      success: true,
      id: result._id
    });

  } catch (error) {
    console.error('Erro no tracking de views:', error);

    // Para tracking, não queremos que erros afetem a experiência do usuário
    return NextResponse.json({
      success: false,
      error: 'Tracking error'
    }, { status: 200 }); // Retorna 200 mesmo com erro
  }
}

// Endpoint simplificado para tracking via GET (pixels/beacons)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const productId = searchParams.get('productId');
    const path = searchParams.get('path');
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!type) {
      return new NextResponse('Type required', { status: 400 });
    }

    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const baseSessionId = sessionId || `session_${Date.now()}_${Math.random()}`;

    switch (type) {
      case 'page':
        if (path) {
          await MongoAnalyticsService.trackPageView({
            path,
            userId: userId || null,
            sessionId: baseSessionId,
            userAgent,
            ip: ip.split(',')[0].trim(),
            referer
          });
        }
        break;

      case 'product':
        if (productId) {
          await MongoAnalyticsService.trackProductView({
            productId,
            userId: userId || null,
            sessionId: baseSessionId
          });
          await MongoAnalyticsService.incrementProductViewCount(productId);
        }
        break;
    }

    // Retornar pixel transparente 1x1
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
      'base64'
    );

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Content-Length': pixel.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Erro no pixel tracking:', error);

    // Retornar pixel mesmo com erro
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
      'base64'
    );

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Content-Length': pixel.length.toString()
      }
    });
  }
}