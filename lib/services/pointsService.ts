import prisma from '@/lib/prisma';

// Configurações do programa de pontos
export const POINTS_CONFIG = {
  // Ganho de pontos
  POINTS_PER_EURO: 10, // 10 pontos por €1 gasto
  SIGNUP_BONUS: 500,   // 500 pontos de boas-vindas
  BIRTHDAY_BONUS: 1000, // 1000 pontos no aniversário
  REVIEW_BONUS: 200,   // 200 pontos por review
  REFERRAL_BONUS: 1500, // 1500 pontos por indicação

  // Valor dos pontos
  POINTS_VALUE: 0.01, // 1 ponto = €0.01 (100 pontos = €1)

  // Níveis de tier
  TIER_THRESHOLDS: {
    BRONZE: 0,
    SILVER: 2500,   // €250 gastos
    GOLD: 7500,     // €750 gastos
    PLATINUM: 15000, // €1500 gastos
    DIAMOND: 30000   // €3000 gastos
  },

  // Multiplicadores por tier
  TIER_MULTIPLIERS: {
    BRONZE: 1.0,
    SILVER: 1.2,  // 20% mais pontos
    GOLD: 1.5,    // 50% mais pontos
    PLATINUM: 1.8, // 80% mais pontos
    DIAMOND: 2.0   // 100% mais pontos
  },

  // Expiração de pontos
  POINTS_EXPIRY_MONTHS: 24 // Pontos expiram em 24 meses
};

export interface PointsTransactionData {
  userId: string;
  type: string;
  points: number;
  description: string;
  orderId?: string;
  productId?: string;
  metadata?: any;
}

export class PointsService {
  // Adicionar pontos a um usuário
  static async addPoints(data: PointsTransactionData) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: data.userId }
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Calcular pontos com multiplicador do tier
      const tierMultiplier = POINTS_CONFIG.TIER_MULTIPLIERS[user.tierLevel] || 1.0;
      const finalPoints = Math.floor(data.points * tierMultiplier);

      // Calcular data de expiração
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + POINTS_CONFIG.POINTS_EXPIRY_MONTHS);

      // Criar transação
      const transaction = await prisma.pointsTransaction.create({
        data: {
          userId: data.userId,
          type: data.type,
          points: finalPoints,
          description: data.description,
          orderId: data.orderId,
          productId: data.productId,
          metadata: data.metadata,
          expiresAt,
          status: 'COMPLETED'
        }
      });

      // Atualizar pontos do usuário
      const updatedUser = await prisma.user.update({
        where: { id: data.userId },
        data: {
          totalPoints: user.totalPoints + finalPoints,
          availablePoints: user.availablePoints + finalPoints,
          tierProgress: user.tierProgress + finalPoints
        }
      });

      // Verificar upgrade de tier
      await this.checkTierUpgrade(data.userId);

      return { transaction, user: updatedUser };
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
      throw error;
    }
  }

  // Resgatar pontos
  static async redeemPoints(userId: string, rewardId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      const reward = await prisma.pointsReward.findUnique({
        where: { id: rewardId }
      });

      if (!user || !reward) {
        throw new Error('Usuário ou recompensa não encontrados');
      }

      if (user.availablePoints < reward.pointsCost) {
        throw new Error('Pontos insuficientes');
      }

      if (user.tierLevel < reward.minTierLevel) {
        throw new Error('Nível de tier insuficiente');
      }

      // Verificar limite de uso por usuário
      if (reward.maxPerUser) {
        const redemptionCount = await prisma.pointsRedemption.count({
          where: {
            userId,
            rewardId,
            status: { in: ['ACTIVE', 'USED'] }
          }
        });

        if (redemptionCount >= reward.maxPerUser) {
          throw new Error('Limite de resgates por usuário atingido');
        }
      }

      // Gerar código de cupom único
      const couponCode = this.generateCouponCode();

      // Criar resgate
      const redemption = await prisma.pointsRedemption.create({
        data: {
          userId,
          rewardId,
          pointsUsed: reward.pointsCost,
          couponCode,
          status: 'ACTIVE',
          expiresAt: reward.validTo
        }
      });

      // Criar transação de débito
      await prisma.pointsTransaction.create({
        data: {
          userId,
          type: 'REDEEM_DISCOUNT',
          points: -reward.pointsCost,
          description: `Resgate: ${reward.name}`,
          metadata: { redemptionId: redemption.id }
        }
      });

      // Atualizar pontos do usuário
      await prisma.user.update({
        where: { id: userId },
        data: {
          availablePoints: user.availablePoints - reward.pointsCost,
          usedPoints: user.usedPoints + reward.pointsCost
        }
      });

      return { redemption, couponCode };
    } catch (error) {
      console.error('Erro ao resgatar pontos:', error);
      throw error;
    }
  }

  // Verificar e atualizar tier do usuário
  static async checkTierUpgrade(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) return;

      const thresholds = POINTS_CONFIG.TIER_THRESHOLDS;
      let newTier = user.tierLevel;

      if (user.tierProgress >= thresholds.DIAMOND) {
        newTier = 'DIAMOND';
      } else if (user.tierProgress >= thresholds.PLATINUM) {
        newTier = 'PLATINUM';
      } else if (user.tierProgress >= thresholds.GOLD) {
        newTier = 'GOLD';
      } else if (user.tierProgress >= thresholds.SILVER) {
        newTier = 'SILVER';
      }

      if (newTier !== user.tierLevel) {
        // Atualizar tier
        await prisma.user.update({
          where: { id: userId },
          data: { tierLevel: newTier }
        });

        // Adicionar bônus de tier
        const bonusPoints = this.getTierBonusPoints(newTier);
        if (bonusPoints > 0) {
          await this.addPoints({
            userId,
            type: 'TIER_BONUS',
            points: bonusPoints,
            description: `Parabéns! Você foi promovido para ${newTier}!`,
            metadata: { previousTier: user.tierLevel, newTier }
          });
        }

        return { upgraded: true, newTier, bonusPoints };
      }

      return { upgraded: false };
    } catch (error) {
      console.error('Erro ao verificar tier:', error);
      throw error;
    }
  }

  // Pontos de bônus por tier
  static getTierBonusPoints(tier: string): number {
    const bonuses = {
      SILVER: 500,
      GOLD: 1000,
      PLATINUM: 2000,
      DIAMOND: 5000
    };
    return bonuses[tier] || 0;
  }

  // Adicionar pontos por compra
  static async addPurchasePoints(userId: string, orderTotal: number, orderId: string) {
    const basePoints = Math.floor(orderTotal * POINTS_CONFIG.POINTS_PER_EURO);

    return await this.addPoints({
      userId,
      type: 'PURCHASE',
      points: basePoints,
      description: `Compra de €${orderTotal.toFixed(2)}`,
      orderId,
      metadata: { orderTotal, basePoints }
    });
  }

  // Bônus de boas-vindas
  static async addSignupBonus(userId: string) {
    return await this.addPoints({
      userId,
      type: 'SIGNUP_BONUS',
      points: POINTS_CONFIG.SIGNUP_BONUS,
      description: 'Bônus de boas-vindas! Bem-vindo à JC Hair Studio\'s 62!',
      metadata: { welcomeBonus: true }
    });
  }

  // Bônus de aniversário
  static async addBirthdayBonus(userId: string) {
    return await this.addPoints({
      userId,
      type: 'BIRTHDAY_BONUS',
      points: POINTS_CONFIG.BIRTHDAY_BONUS,
      description: 'Feliz aniversário! 🎉',
      metadata: { birthdayBonus: true }
    });
  }

  // Bônus por review
  static async addReviewBonus(userId: string, productId: string) {
    return await this.addPoints({
      userId,
      type: 'REVIEW_BONUS',
      points: POINTS_CONFIG.REVIEW_BONUS,
      description: 'Obrigado por sua avaliação!',
      productId,
      metadata: { reviewBonus: true }
    });
  }

  // Buscar histórico de pontos
  static async getPointsHistory(userId: string, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const [transactions, total] = await Promise.all([
        prisma.pointsTransaction.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.pointsTransaction.count({
          where: { userId }
        })
      ]);

      return {
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Erro ao buscar histórico de pontos:', error);
      throw error;
    }
  }

  // Buscar recompensas disponíveis
  static async getAvailableRewards(tierLevel: string) {
    try {
      const rewards = await prisma.pointsReward.findMany({
        where: {
          isActive: true,
          minTierLevel: { lte: tierLevel },
          validFrom: { lte: new Date() },
          OR: [
            { validTo: null },
            { validTo: { gte: new Date() } }
          ]
        },
        orderBy: { pointsCost: 'asc' }
      });

      return rewards;
    } catch (error) {
      console.error('Erro ao buscar recompensas:', error);
      throw error;
    }
  }

  // Buscar resgates ativos do usuário
  static async getUserRedemptions(userId: string) {
    try {
      const redemptions = await prisma.pointsRedemption.findMany({
        where: {
          userId,
          status: { in: ['ACTIVE', 'PENDING'] },
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: new Date() } }
          ]
        },
        include: {
          reward: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return redemptions;
    } catch (error) {
      console.error('Erro ao buscar resgates:', error);
      throw error;
    }
  }

  // Gerar código de cupom único
  private static generateCouponCode(): string {
    const prefix = 'PTS';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  // Expirar pontos antigos
  static async expireOldPoints() {
    try {
      const expiredTransactions = await prisma.pointsTransaction.findMany({
        where: {
          expiresAt: { lte: new Date() },
          status: 'COMPLETED',
          points: { gt: 0 } // Apenas pontos positivos (ganhos)
        }
      });

      for (const transaction of expiredTransactions) {
        // Marcar como expirado
        await prisma.pointsTransaction.update({
          where: { id: transaction.id },
          data: { status: 'EXPIRED' }
        });

        // Criar transação de débito
        await prisma.pointsTransaction.create({
          data: {
            userId: transaction.userId,
            type: 'EXPIRED',
            points: -transaction.points,
            description: 'Pontos expirados',
            metadata: { originalTransactionId: transaction.id }
          }
        });

        // Atualizar pontos disponíveis do usuário
        const user = await prisma.user.findUnique({
          where: { id: transaction.userId }
        });

        if (user) {
          await prisma.user.update({
            where: { id: transaction.userId },
            data: {
              availablePoints: Math.max(0, user.availablePoints - transaction.points)
            }
          });
        }
      }

      return { expiredCount: expiredTransactions.length };
    } catch (error) {
      console.error('Erro ao expirar pontos:', error);
      throw error;
    }
  }

  // Calcular próximo tier
  static getNextTierInfo(currentTier: string, tierProgress: number) {
    const thresholds = POINTS_CONFIG.TIER_THRESHOLDS;

    const tiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
    const currentIndex = tiers.indexOf(currentTier);

    if (currentIndex === -1 || currentIndex === tiers.length - 1) {
      return null; // Tier máximo atingido
    }

    const nextTier = tiers[currentIndex + 1];
    const nextThreshold = thresholds[nextTier];
    const pointsNeeded = nextThreshold - tierProgress;

    return {
      nextTier,
      pointsNeeded: Math.max(0, pointsNeeded),
      progress: Math.min(100, (tierProgress / nextThreshold) * 100)
    };
  }
}

export default PointsService;