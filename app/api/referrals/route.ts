import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { referralService } from '@/lib/services/referralService'
import { z } from 'zod'

// Schema de validação para criar código de referral
const createReferralCodeSchema = z.object({
  customCode: z.string().optional(),
  referrerRewardType: z.enum(['PERCENTAGE', 'FIXED', 'POINTS', 'CASHBACK']).optional(),
  referrerRewardValue: z.number().min(0).optional(),
  refereeRewardType: z.enum(['PERCENTAGE', 'FIXED', 'POINTS', 'CASHBACK']).optional(),
  refereeRewardValue: z.number().min(0).optional(),
  maxUses: z.number().min(1).optional(),
  validTo: z.string().datetime().optional()
})

// GET: Buscar código de referral do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const referralCode = await referralService.getUserReferralCode(session.user.id)

    if (!referralCode) {
      return NextResponse.json(
        { referralCode: null, message: 'Nenhum código encontrado' },
        { status: 200 }
      )
    }

    return NextResponse.json({
      referralCode: {
        id: referralCode.id,
        code: referralCode.code,
        isActive: referralCode.isActive,
        currentUses: referralCode.currentUses,
        maxUses: referralCode.maxUses,
        referrerRewardType: referralCode.referrerRewardType,
        referrerRewardValue: referralCode.referrerRewardValue,
        refereeRewardType: referralCode.refereeRewardType,
        refereeRewardValue: referralCode.refereeRewardValue,
        validFrom: referralCode.validFrom,
        validTo: referralCode.validTo,
        createdAt: referralCode.createdAt,
        // URL completa para compartilhar
        shareUrl: `${process.env.NEXTAUTH_URL}/ref/${referralCode.code}`
      }
    })
  } catch (error) {
    console.error('Erro ao buscar código de referral:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST: Criar código de referral
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createReferralCodeSchema.parse(body)

    // Verificar se usuário já tem código ativo
    const existingCode = await referralService.getUserReferralCode(session.user.id)
    if (existingCode) {
      return NextResponse.json(
        { error: 'Você já possui um código de referral ativo' },
        { status: 400 }
      )
    }

    const referralCode = await referralService.createReferralCode({
      userId: session.user.id,
      ...validatedData,
      validTo: validatedData.validTo ? new Date(validatedData.validTo) : undefined
    })

    return NextResponse.json({
      referralCode: {
        id: referralCode.id,
        code: referralCode.code,
        isActive: referralCode.isActive,
        currentUses: referralCode.currentUses,
        maxUses: referralCode.maxUses,
        shareUrl: `${process.env.NEXTAUTH_URL}/ref/${referralCode.code}`,
        createdAt: referralCode.createdAt
      },
      message: 'Código de referral criado com sucesso!'
    })
  } catch (error) {
    console.error('Erro ao criar código de referral:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}