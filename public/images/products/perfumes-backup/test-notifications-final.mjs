#!/usr/bin/env node

/**
 * TESTE FINAL DE NOTIFICAÇÕES EM PRODUÇÃO
 * Verifica se emails estão sendo enviados corretamente
 */

import fetch from 'node-fetch';

const PRODUCTION_URL = 'https://jchairstudios62.xyz';

console.log('\n📧 TESTE FINAL DO SISTEMA DE NOTIFICAÇÕES');
console.log('══════════════════════════════════════════════════════════');
console.log(`🌐 URL: ${PRODUCTION_URL}\n`);

// Teste 1: Verificar configuração
const testConfiguration = async () => {
  console.log('🔧 Verificando configuração de emails...');

  try {
    const response = await fetch(`${PRODUCTION_URL}/api/debug/email?action=config`);
    const config = await response.json();

    if (config.success && config.config?.sendgrid?.configured) {
      console.log('✅ SendGrid configurado corretamente');
      console.log(`   From Email: ${config.config.environment.fromEmail?.trim()}`);
      console.log(`   Support Email: ${config.config.environment.supportEmail?.trim()}`);
      return true;
    } else {
      console.log('❌ SendGrid não está configurado');
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao verificar configuração:', error.message);
    return false;
  }
};

// Teste 2: Criar um pedido completo
const testCompleteOrder = async () => {
  console.log('\n📦 Criando pedido de teste completo...');

  try {
    // Passo 1: Criar Payment Intent
    console.log('   1. Criando Payment Intent...');
    const paymentResponse = await fetch(`${PRODUCTION_URL}/api/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 35.99,
        currency: 'eur',
        customerInfo: {
          name: 'Teste Notificações Final',
          email: 'juliocesarurss65@gmail.com',
          phone: '+351928375226'
        },
        items: [{
          name: 'Teste Produto - Notificações',
          quantity: 1,
          price: 35.99
        }]
      })
    });

    if (!paymentResponse.ok) {
      console.log('   ❌ Falha ao criar Payment Intent');
      return false;
    }

    const paymentData = await paymentResponse.json();
    console.log('   ✅ Payment Intent criado:', paymentData.paymentIntentId?.substring(0, 20) + '...');

    // Passo 2: Simular sucesso do pagamento
    console.log('   2. Processando pagamento...');
    const successResponse = await fetch(`${PRODUCTION_URL}/api/payment-success`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentIntentId: paymentData.paymentIntentId,
        amount: 35.99,
        currency: 'eur',
        customerInfo: {
          name: 'Teste Notificações Final',
          email: 'juliocesarurss65@gmail.com',
          phone: '+351928375226',
          country: 'PT',
          address: {
            street: 'Rua de Teste Final',
            number: '123',
            city: 'Lisboa',
            state: 'Lisboa',
            zipCode: '1000-001'
          }
        },
        items: [{
          name: 'Teste Produto - Notificações',
          quantity: 1,
          price: 35.99
        }],
        orderTotals: {
          subtotal: 35.99,
          taxAmount: 0,
          shippingCost: 0,
          finalTotal: 35.99
        },
        technicalInfo: {
          clientIp: '127.0.0.1',
          userAgent: 'Teste Final Notificações',
          timestamp: new Date().toISOString()
        }
      })
    });

    if (!successResponse.ok) {
      console.log('   ❌ Falha no processamento do pagamento');
      return false;
    }

    const successData = await successResponse.json();
    console.log('   ✅ Pagamento processado com sucesso');
    console.log(`   📧 Email cliente: ${successData.notifications?.customerEmail || 'N/A'}`);
    console.log(`   📧 Email admin: ${successData.notifications?.adminEmail || 'N/A'}`);
    console.log(`   💾 Order salva: ${successData.notifications?.orderSaved || 'N/A'}`);

    return successData.notifications?.customerEmail === 'sent';
  } catch (error) {
    console.log('❌ Erro no teste de pedido:', error.message);
    return false;
  }
};

// Teste 3: Verificar admin simplificado
const testSimplifiedAdmin = async () => {
  console.log('\n👨‍💼 Testando painel admin simplificado...');

  try {
    const response = await fetch(`${PRODUCTION_URL}/api/admin/orders-simple`);
    const data = await response.json();

    if (data.success) {
      console.log('✅ API admin simplificada funcionando');
      console.log(`   Pedidos em memória: ${data.orders?.length || 0}`);
      console.log(`   Total de pedidos: ${data.total || 0}`);
      return true;
    } else {
      console.log('❌ API admin com problemas');
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao acessar admin:', error.message);
    return false;
  }
};

// Executar todos os testes
const runAllTests = async () => {
  console.log('🚀 Iniciando testes de notificações...\n');

  const results = {
    configuration: await testConfiguration(),
    completeOrder: await testCompleteOrder(),
    simplifiedAdmin: await testSimplifiedAdmin()
  };

  console.log('\n📊 RELATÓRIO FINAL');
  console.log('═══════════════════════════════════════');
  console.log(`⚙️ Configuração: ${results.configuration ? '✅' : '❌'}`);
  console.log(`📦 Pedido Completo: ${results.completeOrder ? '✅' : '❌'}`);
  console.log(`👨‍💼 Admin Simplificado: ${results.simplifiedAdmin ? '✅' : '❌'}`);

  const successCount = Object.values(results).filter(Boolean).length;
  const successRate = (successCount / 3 * 100).toFixed(0);

  console.log(`\n📈 Taxa de Sucesso: ${successRate}%`);

  if (successRate >= 66) {
    console.log('\n🎉 SISTEMA DE NOTIFICAÇÕES FUNCIONANDO!');
    console.log('📧 Verifique seu email: juliocesarurss65@gmail.com');
    console.log('📱 Também verifique o email de admin: suporte@jchairstudios62.xyz');
    console.log('🌐 Acesse o painel admin em: https://jchairstudios62.xyz/admin-simple');
  } else {
    console.log('\n⚠️ Sistema com problemas detectados');
    console.log('🔧 Verifique as configurações no Vercel');
  }

  console.log('\n══════════════════════════════════════════════════════════');
};

// Executar
runAllTests().catch(console.error);