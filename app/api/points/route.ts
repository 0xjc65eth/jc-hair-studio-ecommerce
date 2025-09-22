import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PointsService from '@/lib/services/pointsService';
import prisma from '@/lib/prisma';

// GET /api/points - Obter saldo e histórico de pontos do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeHistory = searchParams.get('includeHistory') === 'true';

    // Buscar dados do usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        totalPoints: true,
        availablePoints: true,
        usedPoints: true,
        tierLevel: true,
        tierProgress: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Calcular informações do próximo tier
    const nextTierInfo = PointsService.getNextTierInfo(
      user.tierLevel,
      user.tierProgress
    );

    const result = {
      points: user,
      nextTier: nextTierInfo,
      tierMultiplier: PointsService.POINTS_CONFIG.TIER_MULTIPLIERS[user.tierLevel],
      history: null as any
    };

    // Incluir histórico se solicitado
    if (includeHistory) {
      result.history = await PointsService.getPointsHistory(
        session.user.id,
        page,
        limit
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Erro ao buscar pontos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/points - Adicionar pontos (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    // Verificar se é admin (você pode ajustar esta verificação)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { userId, type, points, description, orderId, productId, metadata } = data;

    if (!userId || !type || !points || !description) {
      return NextResponse.json(
        { error: 'Dados obrigatórios: userId, type, points, description' },
        { status: 400 }
      );
    }

    const result = await PointsService.addPoints({
      userId,
      type,
      points,
      description,
      orderId,
      productId,
      metadata
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Erro ao adicionar pontos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}