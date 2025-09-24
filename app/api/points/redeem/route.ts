import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import PointsService from '@/lib/services/pointsService';
import { z } from 'zod';

const redeemSchema = z.object({
  rewardId: z.string().min(1, 'ID da recompensa é obrigatório')
});

// POST /api/points/redeem - Resgatar pontos por recompensa
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = redeemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { rewardId } = validation.data;

    try {
      const result = await PointsService.redeemPoints(session.user.id, rewardId);

      return NextResponse.json({
        success: true,
        message: 'Pontos resgatados com sucesso!',
        couponCode: result.couponCode,
        redemption: result.redemption
      });

    } catch (serviceError: any) {
      return NextResponse.json(
        { error: serviceError.message },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Erro ao resgatar pontos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// GET /api/points/redeem - Buscar resgates ativos do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const redemptions = await PointsService.getUserRedemptions(session.user.id);

    return NextResponse.json({ redemptions });

  } catch (error) {
    console.error('Erro ao buscar resgates:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}