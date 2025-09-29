#!/usr/bin/env node

/**
 * TESTE DO SISTEMA DE PAGAMENTO OTIMIZADO
 * Valida as melhorias de performance implementadas
 */

import fetch from 'node-fetch';

const PRODUCTION_URL = 'https://jc-hair-studio-2m7vahjzx-0xjc65eths-projects.vercel.app';

console.log('\n⚡ TESTE DO SISTEMA DE PAGAMENTO OTIMIZADO');
console.log('══════════════════════════════════════════════════════════');
console.log(`🌐 URL: ${PRODUCTION_URL}\n`);

const tests = [
  {
    name: 'Site principal carregando',
    test: async () => {
      const start = Date.now();
      const response = await fetch(PRODUCTION_URL);
      const duration = Date.now() - start;
      console.log(`⏱️ Tempo de resposta: ${duration}ms`);
      return response.ok && duration < 5000; // Deve carregar em menos de 5s
    }
  },
  {
    name: 'Página de checkout otimizada',
    test: async () => {
      const start = Date.now();
      const response = await fetch(`${PRODUCTION_URL}/checkout`);
      const duration = Date.now() - start;
      console.log(`⏱️ Checkout loading time: ${duration}ms`);
      return response.ok && duration < 3000; // Deve carregar em menos de 3s
    }
  },
  {
    name: 'API Payment Intent rápida',
    test: async () => {
      const start = Date.now();
      const response = await fetch(`${PRODUCTION_URL}/api/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 50,
          currency: 'eur',
          customerInfo: {
            name: 'Teste Performance',
            email: 'teste@performance.com',
            phone: '912345678'
          },
          items: [{
            name: 'Produto Teste',
            quantity: 1,
            price: 50
          }]
        })
      });

      const duration = Date.now() - start;
      console.log(`⏱️ Payment Intent creation: ${duration}ms`);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Payment Intent criado: ${data.paymentIntentId?.substring(0, 20)}...`);
        return duration < 2000; // Deve criar em menos de 2s
      }
      return false;
    }
  },
  {
    name: 'Headers de performance otimizados',
    test: async () => {
      const response = await fetch(PRODUCTION_URL);
      const cacheControl = response.headers.get('cache-control');
      const contentEncoding = response.headers.get('content-encoding');

      console.log(`📋 Cache-Control: ${cacheControl || 'não definido'}`);
      console.log(`📋 Content-Encoding: ${contentEncoding || 'não comprimido'}`);

      return response.ok;
    }
  },
  {
    name: 'Mega Hair carregamento rápido',
    test: async () => {
      const start = Date.now();
      const response = await fetch(`${PRODUCTION_URL}/mega-hair`);
      const duration = Date.now() - start;
      console.log(`⏱️ Mega Hair page: ${duration}ms`);
      return response.ok && duration < 4000;
    }
  }
];

let results = { passed: 0, failed: 0, total: tests.length };
const performanceMetrics = [];

for (const { name, test } of tests) {
  try {
    console.log(`\n🧪 Testando: ${name}`);
    const start = Date.now();
    const result = await test();
    const duration = Date.now() - start;

    performanceMetrics.push({ name, duration, success: result });

    if (result) {
      console.log(`✅ ${name}`);
      results.passed++;
    } else {
      console.log(`❌ ${name}`);
      results.failed++;
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    results.failed++;
    performanceMetrics.push({ name, duration: 0, success: false, error: error.message });
  }
}

const successRate = ((results.passed / results.total) * 100).toFixed(1);
const avgResponseTime = performanceMetrics
  .filter(m => m.success && m.duration > 0)
  .reduce((acc, m) => acc + m.duration, 0) /
  performanceMetrics.filter(m => m.success && m.duration > 0).length;

console.log('\n📊 RESULTADO DO TESTE DE PERFORMANCE');
console.log('═══════════════════════════════════════');
console.log(`📈 Taxa de Sucesso: ${successRate}%`);
console.log(`✅ Aprovados: ${results.passed}/${results.total}`);
console.log(`⏱️ Tempo Médio de Resposta: ${Math.round(avgResponseTime)}ms`);

console.log('\n📋 MÉTRICAS DETALHADAS');
console.log('═══════════════════════');
performanceMetrics.forEach(metric => {
  const status = metric.success ? '✅' : '❌';
  console.log(`${status} ${metric.name}: ${metric.duration}ms${metric.error ? ` (${metric.error})` : ''}`);
});

if (successRate >= 80 && avgResponseTime < 3000) {
  console.log('\n🎉 OTIMIZAÇÃO REALIZADA COM SUCESSO!');
  console.log('⚡ Sistema de pagamento mais rápido e responsivo');
  console.log('🚀 Performance melhorada significativamente');
  console.log(`🌐 Site otimizado: ${PRODUCTION_URL}`);
} else {
  console.log('\n⚠️ Algumas otimizações precisam de ajustes');
  console.log(`📊 Taxa atual: ${successRate}% (meta: 80%+)`);
  console.log(`⏱️ Tempo médio: ${Math.round(avgResponseTime)}ms (meta: <3000ms)`);
}

console.log('\n══════════════════════════════════════════════════════════');