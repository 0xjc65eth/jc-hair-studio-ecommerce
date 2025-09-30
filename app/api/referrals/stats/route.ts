import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { referralService } from '@/lib/services/referralService'

// GET: Buscar estatísticas de referral do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const stats = await referralService.getUserStats(session.user.id)
    const referrals = await referralService.getUserReferrals(session.user.id, 10)
    const rewards = await referralService.getUserRewards(session.user.id, 10)
    const cashback = await referralService.getUserCashback(session.user.id)

    return NextResponse.json({
      stats: stats || {
        totalReferrals: 0,
        successfulReferrals: 0,
        totalReferralSales: 0,
        totalRewardsEarned: 0,
        totalCashbackEarned: 0,
        totalPointsEarned: 0,
        monthlyReferrals: 0,
        monthlyReferralSales: 0,
        profileViews: 0,
        linkClicks: 0,
        socialShares: 0
      },
      recentReferrals: referrals,
      recentRewards: rewards,
      cashback: cashback || {
        totalEarned: 0,
        totalPaid: 0,
        availableBalance: 0,
        pendingBalance: 0,
        minPayoutAmount: 25.0
      }
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas de referral:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}