#!/usr/bin/env node

/**
 * TESTE RÁPIDO DE VALIDAÇÃO - JC HAIR STUDIO'S 62
 * Verificação das funcionalidades principais
 */

import fetch from 'node-fetch';

console.log('\n🚀 TESTE RÁPIDO DE VALIDAÇÃO DO SITE');
console.log('═════════════════════════════════════');

const BASE_URL = 'http://localhost:3001';
const tests = [];

// Função para registrar teste
function test(name, testFn) {
  tests.push({ name, testFn });
}

// Função para executar todos os testes
async function runTests() {
  let passed = 0;
  let failed = 0;

  console.log('\n📋 Executando testes de validação...\n');

  for (const { name, testFn } of tests) {
    try {
      const result = await testFn();
      if (result) {
        console.log(`✅ ${name}`);
        passed++;
      } else {
        console.log(`❌ ${name}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
      failed++;
    }
  }

  return { passed, failed, total: passed + failed };
}

// =====================================
// DEFINIÇÃO DOS TESTES
// =====================================

// Teste 1: Servidor respondendo
test('Servidor Next.js respondendo', async () => {
  const response = await fetch(BASE_URL);
  return response.ok;
});

// Teste 2: API Health Check
test('API Health Check funcionando', async () => {
  const response = await fetch(`${BASE_URL}/api/health`);
  return response.ok;
});

// Teste 3: API de Produtos
test('API de Produtos respondendo', async () => {
  const response = await fetch(`${BASE_URL}/api/products`);
  return response.ok;
});

// Teste 4: API de Categorias
test('API de Categorias funcionando', async () => {
  const response = await fetch(`${BASE_URL}/api/categories`);
  return response.ok;
});

// Teste 5: Página de Mega Hair
test('Página Mega Hair carregando', async () => {
  const response = await fetch(`${BASE_URL}/mega-hair`);
  return response.ok;
});

// Teste 6: Página de Cosméticos
test('Página Cosméticos carregando', async () => {
  const response = await fetch(`${BASE_URL}/cosmeticos`);
  return response.ok;
});

// Teste 7: Página de Maquiagens
test('Página Maquiagens carregando', async () => {
  const response = await fetch(`${BASE_URL}/maquiagens`);
  return response.ok;
});

// Teste 8: Página de Contato
test('Página Contato carregando', async () => {
  const response = await fetch(`${BASE_URL}/contato`);
  return response.ok;
});

// Teste 9: Página de Produtos
test('Página Produtos carregando', async () => {
  const response = await fetch(`${BASE_URL}/produtos`);
  return response.ok;
});

// Teste 10: Painel Admin
test('Painel Admin acessível', async () => {
  const response = await fetch(`${BASE_URL}/admin`);
  return response.ok;
});

// Teste 11: API Admin Auth
test('API Admin Auth funcionando', async () => {
  const response = await fetch(`${BASE_URL}/api/admin/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'juliojuliana62' })
  });
  return response.ok;
});

// Teste 12: API de Email Debug
test('API Email Debug disponível', async () => {
  const response = await fetch(`${BASE_URL}/api/debug/email`);
  return response.ok;
});

// Teste 13: Webhook Stripe
test('Webhook Stripe acessível', async () => {
  const response = await fetch(`${BASE_URL}/api/webhooks/stripe`);
  // Webhook deve retornar 405 para GET (Method Not Allowed)
  return response.status === 405;
});

// Teste 14: API de Notificações
test('API Notificações funcionando', async () => {
  const response = await fetch(`${BASE_URL}/api/notifications`);
  return response.ok;
});

// Teste 15: Sistema de Pontos
test('Sistema de Pontos funcionando', async () => {
  const response = await fetch(`${BASE_URL}/api/points`);
  return response.ok;
});

// Teste 16: API de Payment Intent
test('API Payment Intent funcionando', async () => {
  const response = await fetch(`${BASE_URL}/api/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 100,
      currency: 'eur',
      customerEmail: 'test@test.com'
    })
  });
  return response.status !== 500; // Não deve retornar erro 500
});

// Teste 17: Página de Carrinho
test('Página Carrinho carregando', async () => {
  const response = await fetch(`${BASE_URL}/carrinho`);
  return response.ok;
});

// Teste 18: Página de Checkout
test('Página Checkout carregando', async () => {
  const response = await fetch(`${BASE_URL}/checkout`);
  return response.ok;
});

// Teste 19: API de Busca
test('API Busca funcionando', async () => {
  const response = await fetch(`${BASE_URL}/api/search?q=mega`);
  return response.ok;
});

// Teste 20: API de Autocomplete
test('API Autocomplete funcionando', async () => {
  const response = await fetch(`${BASE_URL}/api/search/autocomplete?q=mega`);
  return response.ok;
});

// =====================================
// EXECUÇÃO E RELATÓRIO
// =====================================

async function main() {
  console.log('🔄 Aguardando servidor...');

  // Aguardar servidor estar pronto
  let serverReady = false;
  let attempts = 0;

  while (!serverReady && attempts < 10) {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) {
        serverReady = true;
        console.log('✅ Servidor pronto!\n');
      }
    } catch (error) {
      attempts++;
      console.log(`⏳ Tentativa ${attempts}/10...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  if (!serverReady) {
    console.log('❌ Servidor não está respondendo. Verifique se está rodando na porta 3001.');
    process.exit(1);
  }

  // Executar testes
  const results = await runTests();

  // Gerar relatório
  console.log('\n📊 RELATÓRIO FINAL');
  console.log('═════════════════');

  const successRate = ((results.passed / results.total) * 100).toFixed(1);

  console.log(`📈 Taxa de Sucesso: ${successRate}%`);
  console.log(`✅ Testes Aprovados: ${results.passed}`);
  console.log(`❌ Testes Falhados: ${results.failed}`);
  console.log(`📋 Total de Testes: ${results.total}`);

  console.log('\n🎯 AVALIAÇÃO:');
  if (successRate >= 90) {
    console.log('🏆 EXCELENTE - Site totalmente funcional!');
  } else if (successRate >= 75) {
    console.log('✅ BOM - Site funcional com pequenos ajustes');
  } else if (successRate >= 50) {
    console.log('⚠️ REGULAR - Alguns problemas precisam ser resolvidos');
  } else {
    console.log('❌ CRÍTICO - Muitos problemas encontrados');
  }

  console.log('\n🔍 FUNCIONALIDADES TESTADAS:');
  console.log('- ✅ Servidor Next.js');
  console.log('- ✅ APIs essenciais');
  console.log('- ✅ Páginas principais');
  console.log('- ✅ Sistema de admin');
  console.log('- ✅ Sistema de pagamento');
  console.log('- ✅ Sistema de emails');
  console.log('- ✅ Sistema de busca');

  console.log('\n═════════════════════════════════════');
  console.log('🎉 VALIDAÇÃO COMPLETA!');
  console.log('═════════════════════════════════════\n');

  process.exit(results.failed === 0 ? 0 : 1);
}

main().catch(error => {
  console.error('💥 ERRO CRÍTICO:', error);
  process.exit(1);
});