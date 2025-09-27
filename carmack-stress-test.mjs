#!/usr/bin/env node

/**
 * CARMACK STRESS TEST - TESTE INCANSÁVEL DO SISTEMA
 * Inspirado na metodologia de John Carmack de testar até quebrar
 * Testa TUDO múltiplas vezes com diferentes cenários
 */

import fetch from 'node-fetch';

const PRODUCTION_URL = 'https://jc-hair-studio-jg8yx30ve-0xjc65eths-projects.vercel.app';
const TEST_ITERATIONS = 10; // Múltiplas iterações como Carmack faria
const CONCURRENT_TESTS = 3; // Testes simultâneos

console.log('\n🔥 CARMACK STRESS TEST - MODO INCANSÁVEL');
console.log('══════════════════════════════════════════════════════════');
console.log(`🌐 URL: ${PRODUCTION_URL}`);
console.log(`🔄 Iterações: ${TEST_ITERATIONS}`);
console.log(`⚡ Testes simultâneos: ${CONCURRENT_TESTS}`);
console.log('💪 "Teste até quebrar ou provar que é indestrutível" - JC\n');

let globalStats = {
  totalTests: 0,
  successfulTests: 0,
  failedTests: 0,
  totalResponseTime: 0,
  emailsSent: 0,
  paymentIntentsCreated: 0,
  errors: []
};

// Simular diferentes tipos de usuários
const testUsers = [
  {
    name: 'Cliente Portugal',
    email: 'juliocesarurss65@gmail.com',
    phone: '+351912345678',
    country: 'PT',
    amount: 25.99
  },
  {
    name: 'Cliente Brasil',
    email: 'juliocesarurss65@gmail.com',
    phone: '+5511987654321',
    country: 'BR',
    amount: 45.50
  },
  {
    name: 'Cliente Stress Test',
    email: 'juliocesarurss65@gmail.com',
    phone: '+351999888777',
    country: 'PT',
    amount: 99.99
  }
];

// Diferentes cenários de produtos
const testProducts = [
  [{ name: 'Mega Hair Premium', quantity: 1, price: 25.99 }],
  [
    { name: 'Shampoo Profissional', quantity: 2, price: 15.50 },
    { name: 'Condicionador Hidratante', quantity: 1, price: 14.50 }
  ],
  [
    { name: 'Kit Completo Mega Hair', quantity: 1, price: 89.99 },
    { name: 'Produtos Complementares', quantity: 3, price: 3.33 }
  ]
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Teste individual de compra completa
const testCompletePurchase = async (iteration, userIndex) => {
  const startTime = Date.now();
  const user = testUsers[userIndex % testUsers.length];
  const products = testProducts[userIndex % testProducts.length];
  const totalAmount = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  try {
    console.log(`🧪 Iteration ${iteration}.${userIndex}: Testing ${user.name} - €${totalAmount}`);

    // Passo 1: Criar Payment Intent
    console.log(`  📝 Step 1: Creating Payment Intent...`);
    const paymentResponse = await fetch(`${PRODUCTION_URL}/api/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalAmount,
        currency: 'eur',
        customerInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        items: products
      })
    });

    if (!paymentResponse.ok) {
      throw new Error(`Payment Intent failed: ${paymentResponse.status}`);
    }

    const paymentData = await paymentResponse.json();
    globalStats.paymentIntentsCreated++;
    console.log(`  ✅ Payment Intent: ${paymentData.paymentIntentId?.substring(0, 20)}...`);

    // Pequena pausa realística
    await sleep(100);

    // Passo 2: Simular pagamento bem-sucedido
    console.log(`  💳 Step 2: Processing payment success...`);
    const successResponse = await fetch(`${PRODUCTION_URL}/api/payment-success`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentIntentId: paymentData.paymentIntentId || `pi_test_${Date.now()}_${iteration}`,
        amount: totalAmount,
        currency: 'eur',
        customerInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          country: user.country,
          address: {
            street: 'Rua do Teste',
            number: `${100 + iteration}`,
            city: user.country === 'PT' ? 'Lisboa' : 'São Paulo',
            state: user.country === 'PT' ? 'Lisboa' : 'SP',
            zipCode: user.country === 'PT' ? '1000-001' : '01000-000'
          }
        },
        items: products,
        orderTotals: {
          subtotal: totalAmount,
          taxAmount: 0,
          shippingCost: 0,
          finalTotal: totalAmount
        },
        technicalInfo: {
          clientIp: '127.0.0.1',
          userAgent: `CarmackTest/1.0 Iteration${iteration}`,
          timestamp: new Date().toISOString()
        }
      })
    });

    if (!successResponse.ok) {
      throw new Error(`Payment Success failed: ${successResponse.status}`);
    }

    const successData = await successResponse.json();
    const responseTime = Date.now() - startTime;

    // Contar emails enviados
    if (successData.notifications?.customerEmail === 'sent') globalStats.emailsSent++;
    if (successData.notifications?.adminEmail === 'sent') globalStats.emailsSent++;

    globalStats.totalTests++;
    globalStats.successfulTests++;
    globalStats.totalResponseTime += responseTime;

    console.log(`  ✅ Complete purchase successful! (${responseTime}ms)`);
    console.log(`     📧 Emails: ${successData.notifications?.customerEmail}, ${successData.notifications?.adminEmail}`);

    return {
      success: true,
      responseTime,
      emailsSent: (successData.notifications?.customerEmail === 'sent' ? 1 : 0) +
                  (successData.notifications?.adminEmail === 'sent' ? 1 : 0),
      iteration,
      user: user.name
    };

  } catch (error) {
    const responseTime = Date.now() - startTime;
    globalStats.totalTests++;
    globalStats.failedTests++;
    globalStats.errors.push(`Iteration ${iteration}.${userIndex}: ${error.message}`);

    console.log(`  ❌ Test failed: ${error.message} (${responseTime}ms)`);

    return {
      success: false,
      error: error.message,
      responseTime,
      iteration,
      user: user.name
    };
  }
};

// Teste de stress - múltiplas compras simultâneas
const runStressTest = async (iteration) => {
  console.log(`\n🔥 STRESS TEST ITERATION ${iteration}`);
  console.log('─'.repeat(60));

  const concurrentPromises = [];

  // Lançar múltiplos testes simultâneos
  for (let i = 0; i < CONCURRENT_TESTS; i++) {
    concurrentPromises.push(testCompletePurchase(iteration, i));
  }

  // Aguardar todos completarem
  const results = await Promise.allSettled(concurrentPromises);

  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length;

  console.log(`📊 Iteration ${iteration} Results: ✅ ${successful}/${CONCURRENT_TESTS} successful`);

  return { successful, failed, results };
};

// Teste específico de email
const testEmailSystem = async () => {
  console.log('\n📧 TESTING EMAIL SYSTEM SPECIFICALLY');
  console.log('─'.repeat(60));

  try {
    // Teste a API de debug de email
    const emailTest = await fetch(`${PRODUCTION_URL}/api/debug/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'test',
        to: 'juliocesarurss65@gmail.com',
        testType: 'basic',
        bypassProduction: true
      })
    });

    if (emailTest.ok) {
      const result = await emailTest.json();
      console.log('✅ Direct email test successful');
      return true;
    } else {
      console.log('❌ Direct email test failed:', emailTest.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Email system test error:', error.message);
    return false;
  }
};

// Teste de carga da página
const testPageLoad = async () => {
  console.log('\n🌐 TESTING PAGE LOADS');
  console.log('─'.repeat(60));

  const pages = [
    '/',
    '/checkout',
    '/mega-hair',
    '/api/health'
  ];

  let successful = 0;

  for (const page of pages) {
    try {
      const start = Date.now();
      const response = await fetch(`${PRODUCTION_URL}${page}`);
      const time = Date.now() - start;

      if (response.ok) {
        console.log(`✅ ${page}: ${response.status} (${time}ms)`);
        successful++;
      } else {
        console.log(`❌ ${page}: ${response.status} (${time}ms)`);
      }
    } catch (error) {
      console.log(`❌ ${page}: ${error.message}`);
    }
  }

  return successful / pages.length;
};

// FUNÇÃO PRINCIPAL - CARMACK STYLE
const runCarmackTest = async () => {
  const overallStart = Date.now();

  console.log('🚀 Starting Carmack-style stress test...\n');

  // Teste inicial de conectividade
  await testPageLoad();

  // Teste específico de email
  await testEmailSystem();

  // Executar múltiplas iterações de stress test
  for (let i = 1; i <= TEST_ITERATIONS; i++) {
    await runStressTest(i);

    // Pausa estratégica entre iterações (como Carmack faria para simular uso real)
    if (i < TEST_ITERATIONS) {
      console.log(`⏳ Cooling down... (${i}/${TEST_ITERATIONS})`);
      await sleep(500);
    }
  }

  const totalTime = Date.now() - overallStart;

  // RELATÓRIO FINAL ESTILO CARMACK
  console.log('\n' + '═'.repeat(80));
  console.log('🏆 CARMACK STRESS TEST - RELATÓRIO FINAL');
  console.log('═'.repeat(80));

  const successRate = (globalStats.successfulTests / globalStats.totalTests * 100).toFixed(1);
  const avgResponseTime = globalStats.totalResponseTime / globalStats.totalTests;

  console.log(`📊 MÉTRICAS GERAIS:`);
  console.log(`   Total de testes: ${globalStats.totalTests}`);
  console.log(`   Sucessos: ${globalStats.successfulTests}`);
  console.log(`   Falhas: ${globalStats.failedTests}`);
  console.log(`   Taxa de sucesso: ${successRate}%`);
  console.log(`   Tempo médio: ${Math.round(avgResponseTime)}ms`);
  console.log(`   Emails enviados: ${globalStats.emailsSent}`);
  console.log(`   Payment Intents: ${globalStats.paymentIntentsCreated}`);
  console.log(`   Tempo total: ${Math.round(totalTime/1000)}s`);

  if (globalStats.errors.length > 0) {
    console.log(`\n❌ ERROS ENCONTRADOS:`);
    globalStats.errors.forEach(error => console.log(`   - ${error}`));
  }

  // VEREDICTO FINAL
  console.log(`\n🎯 VEREDICTO CARMACK:`);
  if (successRate >= 95) {
    console.log(`   ✅ SISTEMA INDESTRUTÍVEL! ${successRate}% de sucesso`);
    console.log(`   🔥 Worthy of production - ship it!`);
  } else if (successRate >= 85) {
    console.log(`   ⚠️ SISTEMA ROBUSTO mas pode melhorar (${successRate}%)`);
    console.log(`   🔧 Few tweaks needed but fundamentally solid`);
  } else {
    console.log(`   ❌ SISTEMA PRECISA DE TRABALHO (${successRate}%)`);
    console.log(`   🛠️ Back to the drawing board`);
  }

  console.log('\n💪 "If it can survive this, it can survive anything" - Carmack');
  console.log('═'.repeat(80));
};

// EXECUTAR O TESTE
runCarmackTest().catch(console.error);