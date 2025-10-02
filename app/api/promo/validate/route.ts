import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { promoCodeService } from '@/lib/services/promoCodeService'

/**
 * POST /api/promo/validate
 * Validate and calculate discount for a promo code
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    if (!body.code || !body.cartTotal || !body.cartItems) {
      return NextResponse.json(
        { error: 'Código, total do carrinho e itens são obrigatórios' },
        { status: 400 }
      )
    }

    // Validate promo code
    const result = await promoCodeService.validatePromoCode({
      code: body.code,
      userId: session.user.id,
      cartTotal: body.cartTotal,
      cartItems: body.cartItems
    })

    return NextResponse.json({
      success: result.valid,
      ...result
    })
  } catch (error: any) {
    console.error('Erro ao validar código promocional:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao validar código promocional' },
      { status: 500 }
    )
  }
}
