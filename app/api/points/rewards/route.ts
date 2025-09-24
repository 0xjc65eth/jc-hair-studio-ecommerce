import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PointsService from '@/lib/services/pointsService';
import { User } from '@/lib/mongodb';

// GET /api/points/rewards - Buscar recompensas disponíveis
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    // Buscar tier do usuário
    const user = await User.findById(session.user.id).select({
      tierLevel: 1,
      availablePoints: 1
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Buscar recompensas disponíveis para o tier do usuário
    const rewards = await PointsService.getAvailableRewards(user.tierLevel);

    // Adicionar informação se o usuário pode resgatar cada recompensa
    const rewardsWithAvailability = rewards.map(reward => ({
      ...reward,
      canRedeem: user.availablePoints >= reward.pointsCost,
      pointsNeeded: Math.max(0, reward.pointsCost - user.availablePoints)
    }));

    return NextResponse.json({
      rewards: rewardsWithAvailability,
      userPoints: user.availablePoints,
      userTier: user.tierLevel
    });

  } catch (error) {
    console.error('Erro ao buscar recompensas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}