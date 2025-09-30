import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { referralService } from '@/lib/services/referralService'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const processReferralSchema = z.object({
  referralCode: z.string().min(1),
  source: z.string().optional()
})

// POST: Processar referral quando usuário se registra
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
    const validatedData = processReferralSchema.parse(body)

    // Buscar código de referral
    const referralCodeRecord = await prisma.referralCode.findUnique({
      where: { code: validatedData.referralCode }
    })

    if (!referralCodeRecord) {
      return NextResponse.json(
        { error: 'Código de referral não encontrado' },
        { status: 404 }
      )
    }

    // Obter informações da requisição
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || ''
    const userAgent = request.headers.get('user-agent') || ''

    const referral = await referralService.processReferral({
      referralCodeId: referralCodeRecord.id,
      refereeId: session.user.id,
      ipAddress: ip,
      userAgent,
      source: validatedData.source || 'direct'
    })

    return NextResponse.json({
      referral: {
        id: referral.id,
        status: referral.status,
        createdAt: referral.createdAt
      },
      message: 'Referral processado com sucesso!'
    })
  } catch (error) {
    console.error('Erro ao processar referral:', error)

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