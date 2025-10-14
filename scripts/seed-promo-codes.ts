#!/usr/bin/env node

/**
 * Script para popular cupons promocionais no banco de dados
 *
 * Uso: ts-node scripts/seed-promo-codes.ts
 */

import { connectDB } from '@/lib/mongodb'
import PromoCode, { PromoCodeType } from '@/lib/mongodb/schemas/promoCode.schema'

interface PromoCodeData {
  code: string
  type: PromoCodeType
  description: string
  discountValue: number
  maxDiscount?: number
  minPurchase?: number
  freeShipping?: boolean
  maxUses?: number
  maxUsesPerUser?: number
  validFrom: Date
  validTo: Date
  categories?: string[]
  excludedCategories?: string[]
  excludedProducts?: string[]
  firstPurchaseOnly?: boolean
  createdBy: string
  isActive: boolean
}

const promoCodes: PromoCodeData[] = [
  // 0. WELCOME20 - 20% off para novos clientes (CUPOM PRINCIPAL)
  {
    code: 'WELCOME20',
    type: PromoCodeType.PERCENTAGE,
    description: '20% de desconto de boas-vindas',
    discountValue: 20,
    maxDiscount: 100, // Máximo €100 de desconto
    minPurchase: 0, // Sem compra mínima
    freeShipping: false,
    maxUses: -1, // Ilimitado
    maxUsesPerUser: 1, // Apenas 1 vez por usuário
    validFrom: new Date('2025-01-01'),
    validTo: new Date('2025-12-31'),
    firstPurchaseOnly: false, // Não restrito apenas à primeira compra
    createdBy: 'system',
    isActive: true
  },

  // 1. PRIMEIRA-COMPRA - 10% off na primeira compra
  {
    code: 'PRIMEIRA-COMPRA',
    type: PromoCodeType.PERCENTAGE,
    description: '10% de desconto na primeira compra',
    discountValue: 10,
    maxDiscount: 50, // Máximo €50 de desconto
    minPurchase: 25, // Compra mínima de €25
    freeShipping: false,
    maxUses: -1, // Ilimitado
    maxUsesPerUser: 1, // Apenas 1 vez por usuário
    validFrom: new Date('2025-01-01'),
    validTo: new Date('2025-12-31'),
    firstPurchaseOnly: true,
    createdBy: 'system',
    isActive: true
  },

  // 2. MEGA50 - 15% off em mega hair
  {
    code: 'MEGA50',
    type: PromoCodeType.PERCENTAGE,
    description: '15% de desconto em mega hair e extensões',
    discountValue: 15,
    maxDiscount: 100, // Máximo €100 de desconto
    minPurchase: 50, // Compra mínima de €50
    freeShipping: false,
    maxUses: -1, // Ilimitado
    maxUsesPerUser: 3, // Até 3 usos por usuário
    validFrom: new Date('2025-01-01'),
    validTo: new Date('2025-12-31'),
    categories: ['mega-hair', 'extensoes-naturais', 'mega-hair-premium'],
    createdBy: 'system',
    isActive: true
  },

  // 3. KIT3PRODUTOS - 20% em kits com 3 ou mais produtos
  {
    code: 'KIT3PRODUTOS',
    type: PromoCodeType.PERCENTAGE,
    description: '20% de desconto na compra de 3 ou mais produtos',
    discountValue: 20,
    maxDiscount: 80, // Máximo €80 de desconto
    minPurchase: 60, // Compra mínima de €60
    freeShipping: false,
    maxUses: -1, // Ilimitado
    maxUsesPerUser: 5, // Até 5 usos por usuário
    validFrom: new Date('2025-01-01'),
    validTo: new Date('2025-12-31'),
    createdBy: 'system',
    isActive: true
  },

  // Cupons adicionais úteis

  // 4. PROGRESSIVA25 - 25% off em progressivas
  {
    code: 'PROGRESSIVA25',
    type: PromoCodeType.PERCENTAGE,
    description: '25% de desconto em progressivas e BTX',
    discountValue: 25,
    maxDiscount: 100,
    minPurchase: 40,
    freeShipping: false,
    maxUses: -1,
    maxUsesPerUser: 2,
    validFrom: new Date('2025-01-01'),
    validTo: new Date('2025-06-30'),
    categories: ['progressivas-btx', 'progressiva'],
    createdBy: 'system',
    isActive: true
  },

  // 5. FRETEGRATIS - Frete grátis acima de €39
  {
    code: 'FRETEGRATIS',
    type: PromoCodeType.FREE_SHIPPING,
    description: 'Frete grátis em compras acima de €39',
    discountValue: 0,
    minPurchase: 39,
    freeShipping: true,
    maxUses: -1,
    maxUsesPerUser: 10,
    validFrom: new Date('2025-01-01'),
    validTo: new Date('2025-12-31'),
    createdBy: 'system',
    isActive: true
  },

  // 6. MAKEUP15 - 15% off em maquiagem
  {
    code: 'MAKEUP15',
    type: PromoCodeType.PERCENTAGE,
    description: '15% de desconto em maquiagem brasileira premium',
    discountValue: 15,
    maxDiscount: 45,
    minPurchase: 30,
    freeShipping: false,
    maxUses: -1,
    maxUsesPerUser: 3,
    validFrom: new Date('2025-01-01'),
    validTo: new Date('2025-06-30'),
    categories: ['maquiagem-premium', 'maquiagem'],
    createdBy: 'system',
    isActive: true
  },

  // 7. BELEZA30 - €30 de desconto fixo
  {
    code: 'BELEZA30',
    type: PromoCodeType.FIXED_AMOUNT,
    description: '€30 de desconto em compras acima de €150',
    discountValue: 30,
    minPurchase: 150,
    freeShipping: false,
    maxUses: 100, // Limitado a 100 usos
    maxUsesPerUser: 1,
    validFrom: new Date('2025-01-01'),
    validTo: new Date('2025-03-31'),
    createdBy: 'system',
    isActive: true
  },

  // 8. VIP20 - 20% para clientes VIP (compras acima de €100)
  {
    code: 'VIP20',
    type: PromoCodeType.PERCENTAGE,
    description: '20% de desconto VIP em compras acima de €100',
    discountValue: 20,
    maxDiscount: 150,
    minPurchase: 100,
    freeShipping: true, // Frete grátis incluído
    maxUses: -1,
    maxUsesPerUser: 5,
    validFrom: new Date('2025-01-01'),
    validTo: new Date('2025-12-31'),
    createdBy: 'system',
    isActive: true
  },

  // 9. AMIGO10 - 10% para indicações de amigos
  {
    code: 'AMIGO10',
    type: PromoCodeType.PERCENTAGE,
    description: '10% de desconto para indicações de amigos',
    discountValue: 10,
    maxDiscount: 40,
    minPurchase: 20,
    freeShipping: false,
    maxUses: -1,
    maxUsesPerUser: 1,
    validFrom: new Date('2025-01-01'),
    validTo: new Date('2025-12-31'),
    createdBy: 'system',
    isActive: true
  },

  // 10. SKINCARE20 - 20% off em skincare brasileiro
  {
    code: 'SKINCARE20',
    type: PromoCodeType.PERCENTAGE,
    description: '20% de desconto em skincare brasileiro',
    discountValue: 20,
    maxDiscount: 60,
    minPurchase: 35,
    freeShipping: false,
    maxUses: -1,
    maxUsesPerUser: 3,
    validFrom: new Date('2025-01-01'),
    validTo: new Date('2025-12-31'),
    categories: ['skincare-brasileiro', 'skincare'],
    createdBy: 'system',
    isActive: true
  }
]

async function seedPromoCodes() {
  try {
    console.log('🔌 Conectando ao MongoDB...')
    await connectDB()
    console.log('✅ Conectado ao MongoDB')

    console.log('\n🎫 Populando cupons promocionais...\n')

    let created = 0
    let skipped = 0
    let updated = 0

    for (const promoData of promoCodes) {
      try {
        // Verificar se já existe
        const existing = await PromoCode.findOne({ code: promoData.code })

        if (existing) {
          // Atualizar cupom existente
          await PromoCode.findOneAndUpdate(
            { code: promoData.code },
            { $set: promoData }
          )
          console.log(`🔄 Atualizado: ${promoData.code} - ${promoData.description}`)
          updated++
        } else {
          // Criar novo cupom
          await PromoCode.create(promoData)
          console.log(`✅ Criado: ${promoData.code} - ${promoData.description}`)
          created++
        }
      } catch (error: any) {
        if (error.code === 11000) {
          console.log(`⏭️  Ignorado (já existe): ${promoData.code}`)
          skipped++
        } else {
          console.error(`❌ Erro ao criar ${promoData.code}:`, error.message)
        }
      }
    }

    console.log('\n📊 Resumo:')
    console.log(`   ✅ Criados: ${created}`)
    console.log(`   🔄 Atualizados: ${updated}`)
    console.log(`   ⏭️  Ignorados: ${skipped}`)
    console.log(`   📦 Total no sistema: ${created + updated + skipped}`)

    // Listar todos os cupons ativos
    console.log('\n🎫 Cupons Ativos:')
    const activeCoupons = await PromoCode.find({ isActive: true }).sort({ code: 1 })

    for (const coupon of activeCoupons) {
      const typeEmoji = {
        PERCENTAGE: '💯',
        FIXED_AMOUNT: '💰',
        FREE_SHIPPING: '🚚',
        BUY_X_GET_Y: '🎁'
      }[coupon.type] || '🎫'

      const discount = coupon.type === PromoCodeType.PERCENTAGE
        ? `${coupon.discountValue}%`
        : `€${coupon.discountValue}`

      console.log(`   ${typeEmoji} ${coupon.code} - ${discount} - ${coupon.description}`)

      if (coupon.categories && coupon.categories.length > 0) {
        console.log(`      📁 Categorias: ${coupon.categories.join(', ')}`)
      }

      if (coupon.minPurchase && coupon.minPurchase > 0) {
        console.log(`      💳 Compra mínima: €${coupon.minPurchase}`)
      }

      if (coupon.maxDiscount) {
        console.log(`      🎯 Desconto máximo: €${coupon.maxDiscount}`)
      }

      if (coupon.firstPurchaseOnly) {
        console.log(`      🆕 Apenas primeira compra`)
      }

      if (coupon.freeShipping) {
        console.log(`      🚚 Frete grátis incluído`)
      }

      const usageText = coupon.maxUses === -1
        ? 'Ilimitado'
        : `${coupon.currentUses}/${coupon.maxUses}`
      console.log(`      📊 Usos: ${usageText} | Por usuário: ${coupon.maxUsesPerUser}`)

      const validUntil = new Date(coupon.validTo).toLocaleDateString('pt-BR')
      console.log(`      📅 Válido até: ${validUntil}\n`)
    }

    console.log('\n✨ Seed de cupons concluído com sucesso!')
    process.exit(0)

  } catch (error) {
    console.error('❌ Erro ao popular cupons:', error)
    process.exit(1)
  }
}

// Executar seed
seedPromoCodes()
