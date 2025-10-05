import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { promoCodeService } from '@/lib/services/promoCodeService'
import { PromoCodeType } from '@/lib/mongodb/schemas/promoCode.schema'

/**
 * GET /api/promo
 * List all promo codes (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check admin access
    if (!session?.user?.email || session.user.email !== 'admin@jchairstudios62.xyz') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const type = searchParams.get('type')

    const filter: any = {}
    if (isActive !== null) {
      filter.isActive = isActive === 'true'
    }
    if (type) {
      filter.type = type as PromoCodeType
    }

    const promoCodes = await promoCodeService.listPromoCodes(filter)

    return NextResponse.json({
      success: true,
      promoCodes
    })
  } catch (error: any) {
    console.error('Erro ao listar códigos promocionais:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao listar códigos promocionais' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/promo
 * Create a new promo code (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check admin access
    if (!session?.user?.email || session.user.email !== 'admin@jchairstudios62.xyz') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validate required fields
    if (!body.code || !body.type || !body.description || !body.discountValue || !body.validTo) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const promoCode = await promoCodeService.createPromoCode({
      code: body.code,
      type: body.type,
      description: body.description,
      discountValue: body.discountValue,
      maxDiscount: body.maxDiscount,
      minPurchase: body.minPurchase,
      freeShipping: body.freeShipping,
      maxUses: body.maxUses,
      maxUsesPerUser: body.maxUsesPerUser,
      validFrom: body.validFrom ? new Date(body.validFrom) : undefined,
      validTo: new Date(body.validTo),
      categories: body.categories,
      excludedCategories: body.excludedCategories,
      excludedProducts: body.excludedProducts,
      firstPurchaseOnly: body.firstPurchaseOnly,
      createdBy: session.user.id || session.user.email
    })

    return NextResponse.json({
      success: true,
      promoCode
    }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar código promocional:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar código promocional' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/promo
 * Update a promo code (admin only)
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check admin access
    if (!session?.user?.email || session.user.email !== 'admin@jchairstudios62.xyz') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      )
    }

    const body = await request.json()

    if (!body.code) {
      return NextResponse.json(
        { error: 'Código é obrigatório' },
        { status: 400 }
      )
    }

    const promoCode = await promoCodeService.updatePromoCode(body.code, body.updates)

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Código não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      promoCode
    })
  } catch (error: any) {
    console.error('Erro ao atualizar código promocional:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar código promocional' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/promo
 * Deactivate a promo code (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check admin access
    if (!session?.user?.email || session.user.email !== 'admin@jchairstudios62.xyz') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Código é obrigatório' },
        { status: 400 }
      )
    }

    await promoCodeService.deactivatePromoCode(code)

    return NextResponse.json({
      success: true,
      message: 'Código desativado com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao desativar código promocional:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao desativar código promocional' },
      { status: 500 }
    )
  }
}
