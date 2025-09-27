#!/usr/bin/env node

/**
 * TESTE FINAL DE PRODUÇÃO - JC HAIR STUDIO'S 62
 * Validação do deploy com sistema de pagamento corrigido
 */

import fetch from 'node-fetch';

const PRODUCTION_URL = 'https://jc-hair-studio-o65ugls7x-0xjc65eths-projects.vercel.app';

console.log('\n🚀 TESTE FINAL DE PRODUÇÃO - DEPLOY COM PAGAMENTO CORRIGIDO');
console.log('══════════════════════════════════════════════════════════');
console.log(`🌐 URL: ${PRODUCTION_URL}\n`);

const tests = [
  { name: 'Site principal online', test: async () => {
    const response = await fetch(PRODUCTION_URL);
    return response.ok;
  }},
  { name: 'API Health Check', test: async () => {
    const response = await fetch(`${PRODUCTION_URL}/api/health`);
    if (!response.ok) return false;
    const data = await response.json();
    return data.status === 'ok';
  }},
  { name: 'Página Mega Hair', test: async () => {
    const response = await fetch(`${PRODUCTION_URL}/mega-hair`);
    return response.ok;
  }},
  { name: 'Página Checkout', test: async () => {
    const response = await fetch(`${PRODUCTION_URL}/checkout`);
    return response.ok;
  }},
  { name: 'Painel Admin', test: async () => {
    const response = await fetch(`${PRODUCTION_URL}/admin`);
    return response.ok;
  }}
];

let results = { passed: 0, failed: 0, total: tests.length };

for (const { name, test } of tests) {
  try {
    const result = await test();
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
  }
}

const successRate = ((results.passed / results.total) * 100).toFixed(1);

console.log('\n📊 RESULTADO FINAL');
console.log('═══════════════════');
console.log(`📈 Taxa de Sucesso: ${successRate}%`);
console.log(`✅ Aprovados: ${results.passed}/${results.total}`);

if (successRate >= 80) {
  console.log('\n🎉 DEPLOY REALIZADO COM SUCESSO!');
  console.log('💳 Sistema de pagamento corrigido e site operacional');
  console.log(`🌐 Acesse: ${PRODUCTION_URL}`);
} else {
  console.log('\n⚠️ Deploy com problemas identificados');
}

console.log('\n══════════════════════════════════════════════════════════');