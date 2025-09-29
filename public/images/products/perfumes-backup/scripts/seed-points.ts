import { PrismaClient } from '@prisma/client';
import defaultRewards from '../lib/data/default-rewards.json';

const prisma = new PrismaClient();

async function seedPointsRewards() {
  console.log('🌱 Seeding points rewards...');

  try {
    // Limpar recompensas existentes
    await prisma.pointsReward.deleteMany({});
    console.log('✅ Cleared existing rewards');

    // Inserir recompensas padrão
    for (const reward of defaultRewards) {
      await prisma.pointsReward.create({
        data: {
          name: reward.name,
          description: reward.description,
          type: reward.type,
          pointsCost: reward.pointsCost,
          discountPercent: reward.discountPercent || null,
          discountFixed: reward.discountFixed || null,
          freeShipping: reward.freeShipping || false,
          minTierLevel: reward.minTierLevel,
          maxPerUser: reward.maxPerUser || null,
          validFrom: new Date(reward.validFrom),
          validTo: reward.validTo ? new Date(reward.validTo) : null,
          isActive: reward.isActive
        }
      });
    }

    console.log(`✅ Created ${defaultRewards.length} rewards`);

    // Criar usuário de exemplo com pontos (opcional)
    const exampleUser = await prisma.user.findFirst({
      where: { email: 'demo@jchairstudios62.xyz' }
    });

    if (exampleUser) {
      await prisma.user.update({
        where: { id: exampleUser.id },
        data: {
          totalPoints: 5000,
          availablePoints: 5000,
          usedPoints: 0,
          tierLevel: 'GOLD',
          tierProgress: 7500
        }
      });

      // Criar algumas transações de exemplo
      await prisma.pointsTransaction.createMany({
        data: [
          {
            userId: exampleUser.id,
            type: 'SIGNUP_BONUS',
            points: 500,
            description: 'Bônus de boas-vindas!',
            status: 'COMPLETED'
          },
          {
            userId: exampleUser.id,
            type: 'PURCHASE',
            points: 2000,
            description: 'Compra de €200.00',
            status: 'COMPLETED',
            metadata: { orderTotal: 200, basePoints: 2000 }
          },
          {
            userId: exampleUser.id,
            type: 'REVIEW_BONUS',
            points: 200,
            description: 'Obrigado por sua avaliação!',
            status: 'COMPLETED'
          },
          {
            userId: exampleUser.id,
            type: 'TIER_BONUS',
            points: 1000,
            description: 'Parabéns! Você foi promovido para GOLD!',
            status: 'COMPLETED',
            metadata: { previousTier: 'SILVER', newTier: 'GOLD' }
          },
          {
            userId: exampleUser.id,
            type: 'BIRTHDAY_BONUS',
            points: 1000,
            description: 'Feliz aniversário! 🎉',
            status: 'COMPLETED'
          }
        ]
      });

      console.log('✅ Created example user points and transactions');
    }

    console.log('🎉 Points system seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding points system:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seedPointsRewards()
    .then(() => {
      console.log('✅ Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}

export { seedPointsRewards };