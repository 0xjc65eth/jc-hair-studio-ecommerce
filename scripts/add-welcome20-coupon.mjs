#!/usr/bin/env node

/**
 * Script simplificado para adicionar o cupom WELCOME20
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Schema simplificado do PromoCode
const PromoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  discountValue: { type: Number, required: true },
  maxDiscount: Number,
  minPurchase: { type: Number, default: 0 },
  freeShipping: { type: Boolean, default: false },
  maxUses: { type: Number, default: -1 },
  currentUses: { type: Number, default: 0 },
  maxUsesPerUser: { type: Number, default: 1 },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  firstPurchaseOnly: { type: Boolean, default: false },
  createdBy: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  totalRevenue: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 }
}, { timestamps: true });

const PromoCode = mongoose.models.PromoCode || mongoose.model('PromoCode', PromoCodeSchema);

async function addWelcome20Coupon() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error('❌ MONGODB_URI não encontrado no .env.local');
      process.exit(1);
    }

    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(mongoUri, {
      dbName: 'jc-hair-studio-ecommerce',
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000
    });
    console.log('✅ Conectado ao MongoDB');

    // Verificar se o cupom já existe
    const existing = await PromoCode.findOne({ code: 'WELCOME20' });

    if (existing) {
      console.log('🔄 Cupom WELCOME20 já existe, atualizando...');
      await PromoCode.findOneAndUpdate(
        { code: 'WELCOME20' },
        {
          $set: {
            type: 'PERCENTAGE',
            description: '20% de desconto de boas-vindas',
            discountValue: 20,
            maxDiscount: 100,
            minPurchase: 0,
            freeShipping: false,
            maxUses: -1,
            maxUsesPerUser: 1,
            validFrom: new Date('2025-01-01'),
            validTo: new Date('2025-12-31'),
            firstPurchaseOnly: false,
            createdBy: 'system',
            isActive: true
          }
        }
      );
      console.log('✅ Cupom WELCOME20 atualizado com sucesso!');
    } else {
      console.log('➕ Criando cupom WELCOME20...');
      await PromoCode.create({
        code: 'WELCOME20',
        type: 'PERCENTAGE',
        description: '20% de desconto de boas-vindas',
        discountValue: 20,
        maxDiscount: 100,
        minPurchase: 0,
        freeShipping: false,
        maxUses: -1,
        currentUses: 0,
        maxUsesPerUser: 1,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-12-31'),
        firstPurchaseOnly: false,
        createdBy: 'system',
        isActive: true,
        totalRevenue: 0,
        totalOrders: 0
      });
      console.log('✅ Cupom WELCOME20 criado com sucesso!');
    }

    // Verificar o cupom criado
    const coupon = await PromoCode.findOne({ code: 'WELCOME20' });
    console.log('\n📄 Detalhes do Cupom:');
    console.log('   Código:', coupon.code);
    console.log('   Tipo:', coupon.type);
    console.log('   Desconto:', coupon.discountValue + '%');
    console.log('   Descrição:', coupon.description);
    console.log('   Ativo:', coupon.isActive ? 'Sim' : 'Não');
    console.log('   Válido até:', coupon.validTo.toLocaleDateString('pt-BR'));

    await mongoose.disconnect();
    console.log('\n✨ Processo concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

addWelcome20Coupon();
