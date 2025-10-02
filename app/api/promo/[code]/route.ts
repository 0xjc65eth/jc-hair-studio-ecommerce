import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { promoCodeService } from '@/lib/services/promoCodeService'

/**
 * GET /api/promo/[code]
 * Get promo code details and usage stats (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    // Check admin access
    if (!session?.user?.email || session.user.email !== 'admin@jchairstudios62.xyz') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      )
    }

    const stats = await promoCodeService.getUsageStats(params.code)

    return NextResponse.json({
      success: true,
      ...stats
    })
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas do código:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
