import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { referralService } from '@/lib/services/referralService'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const payoutRequestSchema = z.object({
  amount: z.number().min(0.01),
  method: z.enum(['BANK_TRANSFER', 'PAYPAL', 'PIX', 'STORE_CREDIT']),
  bankDetails: z.object({
    account: z.string().min(1),
    bankName: z.string().min(1),
    accountHolder: z.string().min(1)
  }).optional()
})

// POST: Solicitar saque de cashback
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
    const validatedData = payoutRequestSchema.parse(body)

    const payout = await referralService.requestCashbackPayout(
      session.user.id,
      validatedData.amount,
      validatedData.method,
      validatedData.bankDetails
    )

    return NextResponse.json({
      payout: {
        id: payout.id,
        amount: payout.amount,
        method: payout.method,
        status: payout.status,
        requestedAt: payout.requestedAt
      },
      message: 'Solicitação de saque enviada com sucesso!'
    })
  } catch (error) {
    console.error('Erro ao solicitar saque de cashback:', error)

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

// GET: Buscar histórico de saques
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const payouts = await prisma.cashbackPayout.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json({ payouts })
  } catch (error) {
    console.error('Erro ao buscar histórico de saques:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}