import { prisma } from '@/lib/prisma'
import {
  ReferralRewardType,
  RewardDeliveryType,
  ReferralStatus,
  CashbackStatus,
  RewardStatus,
  PayoutStatus,
  PayoutMethod
} from '@prisma/client'

export interface CreateReferralCodeData {
  userId: string
  customCode?: string
  referrerRewardType?: ReferralRewardType
  referrerRewardValue?: number
  refereeRewardType?: ReferralRewardType
  refereeRewardValue?: number
  maxUses?: number
  validTo?: Date
}

export interface ProcessReferralData {
  referralCodeId: string
  refereeId: string
  ipAddress?: string
  userAgent?: string
  source?: string
}

export class ReferralService {
  // Gerar código único de referral
  private generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Criar código de referral para usuário
  async createReferralCode(data: CreateReferralCodeData) {
    const code = data.customCode || this.generateReferralCode()

    // Verificar se código já existe
    const existingCode = await prisma.referralCode.findUnique({
      where: { code }
    })

    if (existingCode) {
      if (data.customCode) {
        throw new Error('Código personalizado já está em uso')
      }
      // Se for código gerado, tentar novamente
      return this.createReferralCode(data)
    }

    const referralCode = await prisma.referralCode.create({
      data: {
        userId: data.userId,
        code,
        referrerRewardType: data.referrerRewardType || ReferralRewardType.PERCENTAGE,
        referrerRewardValue: data.referrerRewardValue || 0.10,
        refereeRewardType: data.refereeRewardType || ReferralRewardType.PERCENTAGE,
        refereeRewardValue: data.refereeRewardValue || 0.05,
        maxUses: data.maxUses || 100,
        validTo: data.validTo
      }
    })

    // Criar/atualizar estatísticas do usuário
    await this.ensureUserStats(data.userId)

    return referralCode
  }

  // Processar referral quando usuário se registra
  async processReferral(data: ProcessReferralData) {
    const referralCode = await prisma.referralCode.findUnique({
      where: {
        id: data.referralCodeId,
        isActive: true
      }
    })

    if (!referralCode) {
      throw new Error('Código de referral inválido ou inativo')
    }

    // Verificar se ainda tem usos disponíveis
    if (referralCode.currentUses >= referralCode.maxUses) {
      throw new Error('Código de referral atingiu limite de usos')
    }

    // Verificar se não expirou
    if (referralCode.validTo && referralCode.validTo < new Date()) {
      throw new Error('Código de referral expirado')
    }

    // Verificar se usuário não está tentando usar seu próprio código
    if (referralCode.userId === data.refereeId) {
      throw new Error('Não é possível usar seu próprio código de referral')
    }

    // Criar referral
    const referral = await prisma.referral.create({
      data: {
        referralCodeId: data.referralCodeId,
        referrerId: referralCode.userId,
        refereeId: data.refereeId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        source: data.source,
        status: ReferralStatus.PENDING
      }
    })

    // Atualizar contador do código
    await prisma.referralCode.update({
      where: { id: data.referralCodeId },
      data: {
        currentUses: {
          increment: 1
        }
      }
    })

    // Atualizar estatísticas
    await this.updateReferrerStats(referralCode.userId, 'new_referral')

    return referral
  }

  // Processar primeira compra e ativar recompensas
  async processFirstPurchase(refereeId: string, orderId: string, orderValue: number) {
    const referral = await prisma.referral.findFirst({
      where: {
        refereeId,
        status: ReferralStatus.PENDING
      },
      include: {
        referralCode: true
      }
    })

    if (!referral) {
      return null // Usuário não veio por referral
    }

    // Atualizar referral como qualificado
    await prisma.referral.update({
      where: { id: referral.id },
      data: {
        status: ReferralStatus.QUALIFIED,
        firstPurchaseId: orderId,
        firstPurchaseAt: new Date()
      }
    })

    // Criar recompensas para referrer e referee
    await this.createReferralRewards(referral, orderValue)

    // Atualizar estatísticas
    await this.updateReferrerStats(referral.referrerId, 'successful_referral', orderValue)

    return referral
  }

  // Criar recompensas para referral
  private async createReferralRewards(referral: any, orderValue: number) {
    const { referralCode } = referral

    // Recompensa para quem indicou (referrer)
    const referrerRewardAmount = this.calculateRewardAmount(
      referralCode.referrerRewardType,
      referralCode.referrerRewardValue,
      orderValue
    )

    await this.createReward({
      referralId: referral.id,
      userId: referral.referrerId,
      type: referralCode.referrerRewardType,
      value: referrerRewardAmount,
      orderValue
    })

    // Recompensa para quem foi indicado (referee)
    const refereeRewardAmount = this.calculateRewardAmount(
      referralCode.refereeRewardType,
      referralCode.refereeRewardValue,
      orderValue
    )

    await this.createReward({
      referralId: referral.id,
      userId: referral.refereeId,
      type: referralCode.refereeRewardType,
      value: refereeRewardAmount,
      orderValue
    })
  }

  // Calcular valor da recompensa
  private calculateRewardAmount(type: ReferralRewardType, value: number, orderValue: number): number {
    switch (type) {
      case ReferralRewardType.PERCENTAGE:
        return (orderValue * value)
      case ReferralRewardType.FIXED:
        return value
      case ReferralRewardType.POINTS:
        return value
      case ReferralRewardType.CASHBACK:
        return (orderValue * value)
      default:
        return value
    }
  }

  // Criar recompensa individual
  private async createReward(data: {
    referralId: string
    userId: string
    type: ReferralRewardType
    value: number
    orderValue: number
  }) {
    const rewardType = this.getRewardDeliveryType(data.type)
    const reward = await prisma.referralReward.create({
      data: {
        referralId: data.referralId,
        userId: data.userId,
        type: data.type,
        rewardType,
        value: data.value,
        points: data.type === ReferralRewardType.POINTS ? Math.floor(data.value) : 0,
        cashbackAmount: data.type === ReferralRewardType.CASHBACK ? data.value : 0,
        cashbackStatus: data.type === ReferralRewardType.CASHBACK ? CashbackStatus.PENDING : CashbackStatus.CANCELLED,
        status: RewardStatus.APPROVED
      }
    })

    // Processar entrega da recompensa
    await this.deliverReward(reward)

    return reward
  }

  // Determinar tipo de entrega da recompensa
  private getRewardDeliveryType(type: ReferralRewardType): RewardDeliveryType {
    switch (type) {
      case ReferralRewardType.PERCENTAGE:
      case ReferralRewardType.FIXED:
        return RewardDeliveryType.DISCOUNT_COUPON
      case ReferralRewardType.POINTS:
        return RewardDeliveryType.LOYALTY_POINTS
      case ReferralRewardType.CASHBACK:
        return RewardDeliveryType.CASHBACK
      default:
        return RewardDeliveryType.DISCOUNT_COUPON
    }
  }

  // Entregar recompensa
  private async deliverReward(reward: any) {
    switch (reward.rewardType) {
      case RewardDeliveryType.DISCOUNT_COUPON:
        await this.createDiscountCoupon(reward)
        break
      case RewardDeliveryType.LOYALTY_POINTS:
        await this.addLoyaltyPoints(reward)
        break
      case RewardDeliveryType.CASHBACK:
        await this.addCashback(reward)
        break
    }

    await prisma.referralReward.update({
      where: { id: reward.id },
      data: {
        status: RewardStatus.DELIVERED,
        processedAt: new Date()
      }
    })
  }

  // Criar cupom de desconto
  private async createDiscountCoupon(reward: any) {
    const couponCode = `REF${reward.id.slice(-6).toUpperCase()}`

    await prisma.coupon.create({
      data: {
        code: couponCode,
        name: `Recompensa Referral - ${reward.type === ReferralRewardType.PERCENTAGE ? `${(reward.value * 100).toFixed(0)}%` : `€${reward.value.toFixed(2)}`}`,
        description: 'Cupom gerado automaticamente pelo sistema de referrals',
        usageLimit: 1,
        usageLimitPerUser: 1,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        isActive: true
      }
    })

    await prisma.referralReward.update({
      where: { id: reward.id },
      data: { couponCode }
    })
  }

  // Adicionar pontos de fidelidade
  private async addLoyaltyPoints(reward: any) {
    const pointsToAdd = Math.floor(reward.value)

    // Criar transação de pontos
    await prisma.pointsTransaction.create({
      data: {
        userId: reward.userId,
        type: 'REFERRAL_BONUS',
        points: pointsToAdd,
        description: `Pontos de referral - ${pointsToAdd} pontos`,
        status: 'COMPLETED'
      }
    })

    // Atualizar pontos do usuário
    await prisma.user.update({
      where: { id: reward.userId },
      data: {
        availablePoints: { increment: pointsToAdd },
        totalPoints: { increment: pointsToAdd }
      }
    })
  }

  // Adicionar cashback
  private async addCashback(reward: any) {
    const cashbackAmount = reward.cashbackAmount

    // Criar ou atualizar cashback do usuário
    await prisma.referralCashback.upsert({
      where: { userId: reward.userId },
      update: {
        totalEarned: { increment: cashbackAmount },
        pendingBalance: { increment: cashbackAmount }
      },
      create: {
        userId: reward.userId,
        totalEarned: cashbackAmount,
        pendingBalance: cashbackAmount
      }
    })

    // Atualizar status do reward
    await prisma.referralReward.update({
      where: { id: reward.id },
      data: {
        cashbackStatus: CashbackStatus.AVAILABLE
      }
    })
  }

  // Solicitar saque de cashback
  async requestCashbackPayout(userId: string, amount: number, method: PayoutMethod, bankDetails?: any) {
    const cashback = await prisma.referralCashback.findUnique({
      where: { userId }
    })

    if (!cashback) {
      throw new Error('Usuário não possui saldo de cashback')
    }

    if (amount > cashback.availableBalance) {
      throw new Error('Saldo insuficiente para saque')
    }

    if (amount < cashback.minPayoutAmount) {
      throw new Error(`Valor mínimo para saque é €${cashback.minPayoutAmount}`)
    }

    const payout = await prisma.cashbackPayout.create({
      data: {
        userId,
        cashbackId: cashback.id,
        amount,
        method,
        bankAccount: bankDetails?.account,
        bankName: bankDetails?.bankName,
        status: PayoutStatus.PENDING
      }
    })

    // Atualizar saldos
    await prisma.referralCashback.update({
      where: { id: cashback.id },
      data: {
        availableBalance: { decrement: amount },
        pendingBalance: { increment: amount }
      }
    })

    return payout
  }

  // Buscar estatísticas do usuário
  async getUserStats(userId: string) {
    return await prisma.userReferralStats.findUnique({
      where: { userId }
    })
  }

  // Garantir que estatísticas do usuário existem
  private async ensureUserStats(userId: string) {
    return await prisma.userReferralStats.upsert({
      where: { userId },
      update: {},
      create: { userId }
    })
  }

  // Atualizar estatísticas do referrer
  private async updateReferrerStats(userId: string, action: 'new_referral' | 'successful_referral', orderValue?: number) {
    const updateData: any = {}

    if (action === 'new_referral') {
      updateData.totalReferrals = { increment: 1 }
      updateData.monthlyReferrals = { increment: 1 }
    }

    if (action === 'successful_referral') {
      updateData.successfulReferrals = { increment: 1 }
      if (orderValue) {
        updateData.totalReferralSales = { increment: orderValue }
        updateData.monthlyReferralSales = { increment: orderValue }
      }
    }

    await prisma.userReferralStats.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...Object.keys(updateData).reduce((acc, key) => {
          acc[key] = updateData[key].increment || 0
          return acc
        }, {} as any)
      }
    })
  }

  // Buscar código de referral do usuário
  async getUserReferralCode(userId: string) {
    return await prisma.referralCode.findFirst({
      where: {
        userId,
        isActive: true
      }
    })
  }

  // Buscar histórico de referrals
  async getUserReferrals(userId: string, limit = 20, offset = 0) {
    return await prisma.referral.findMany({
      where: { referrerId: userId },
      include: {
        referralCode: {
          select: { code: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })
  }

  // Buscar recompensas do usuário
  async getUserRewards(userId: string, limit = 20, offset = 0) {
    return await prisma.referralReward.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })
  }

  // Buscar cashback do usuário
  async getUserCashback(userId: string) {
    return await prisma.referralCashback.findUnique({
      where: { userId }
    })
  }
}

export const referralService = new ReferralService()