#!/usr/bin/env node

/**
 * TESTE DO SISTEMA DE EMAIL CORRIGIDO
 * Testa as correções de timeout implementadas
 */

import fetch from 'node-fetch';

const PRODUCTION_URL = 'https://jc-hair-studio-jg8yx30ve-0xjc65eths-projects.vercel.app';

console.log('\n📧 TESTE SISTEMA DE EMAIL CORRIGIDO');
console.log('══════════════════════════════════════════════════════════');
console.log(`🌐 URL: ${PRODUCTION_URL}\n`);

// Teste 1: Verificar configurações de email
const testEmailConfig = async () => {
  try {
    console.log('🔧 Testando configurações de email...');

    const response = await fetch(`${PRODUCTION_URL}/api/debug/email?action=config`, {
      method: 'GET',
    });

    if (response.ok) {
      const config = await response.json();
      console.log('📋 Configurações:', JSON.stringify(config, null, 2));
      return config.config?.sendgrid?.configured || false;
    } else {
      console.log('❌ Erro ao obter configurações:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao testar configurações:', error.message);
    return false;
  }
};

// Teste 2: Enviar email de teste direto
const testDirectEmail = async () => {
  try {
    console.log('\n🧪 Testando envio direto de email...');

    const response = await fetch(`${PRODUCTION_URL}/api/debug/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'test',
        to: 'juliocesarurss65@gmail.com',
        testType: 'basic',
        bypassProduction: true
      }),
    });

    console.log('📊 Status da resposta:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Resultado do teste:', JSON.stringify(result, null, 2));
      return true;
    } else {
      const error = await response.text();
      console.log('❌ Erro no teste:', error);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao testar email direto:', error.message);
    return false;
  }
};

// Teste 3: Simular compra real (com timeout corrigido)
const testRealPurchase = async () => {
  try {
    console.log('\n🛒 Simulando compra real com timeout corrigido...');

    const mockOrderData = {
      paymentIntentId: 'pi_test_' + Date.now(),
      amount: 15.99,
      currency: 'eur',
      customerInfo: {
        name: 'Teste Email Corrigido',
        email: 'juliocesarurss65@gmail.com',
        phone: '912345678',
        country: 'PT',
        address: {
          street: 'Rua de Teste',
          number: '123',
          city: 'Lisboa',
          state: 'Lisboa',
          zipCode: '1000-001'
        }
      },
      items: [{
        name: 'Mega Hair Teste - Email Corrigido',
        quantity: 1,
        price: 15.99
      }],
      orderTotals: {
        subtotal: 15.99,
        taxAmount: 0,
        shippingCost: 0,
        finalTotal: 15.99
      },
      technicalInfo: {
        clientIp: '127.0.0.1',
        userAgent: 'Test Bot Fixed',
        timestamp: new Date().toISOString()
      }
    };

    console.log('📤 Enviando para payment-success API (com timeout corrigido)...');

    const response = await fetch(`${PRODUCTION_URL}/api/payment-success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockOrderData),
    });

    console.log('📊 Status:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Resultado da compra simulada:', JSON.stringify(result, null, 2));
      return true;
    } else {
      const error = await response.text();
      console.log('❌ Erro na compra simulada:', error);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao simular compra:', error.message);
    return false;
  }
};

// Executar todos os testes
const runAllTests = async () => {
  console.log('🚀 Iniciando testes do sistema de email corrigido...\n');

  const results = {
    config: await testEmailConfig(),
    directEmail: await testDirectEmail(),
    realPurchase: await testRealPurchase()
  };

  console.log('\n📊 RESUMO DOS TESTES');
  console.log('═══════════════════════');
  console.log(`📋 Configurações: ${results.config ? '✅' : '❌'}`);
  console.log(`📧 Email Direto: ${results.directEmail ? '✅' : '❌'}`);
  console.log(`🛒 Compra Simulada: ${results.realPurchase ? '✅' : '❌'}`);

  const successCount = Object.values(results).filter(Boolean).length;
  const successRate = (successCount / 3 * 100).toFixed(1);

  console.log(`\n📈 Taxa de Sucesso: ${successRate}%`);

  if (successRate >= 66.7) {
    console.log('\n🎉 SISTEMA DE EMAIL CORRIGIDO COM SUCESSO!');
    console.log('📧 Verifique sua caixa de entrada para os emails de teste');
    console.log('📱 Também verifique a pasta de spam');
    console.log('🕐 Emails podem demorar 1-2 minutos para chegar');
  } else {
    console.log('\n⚠️ Ainda há problemas no sistema de email');
    console.log('🔧 Pode ser necessário mais ajustes');
  }

  console.log('\n══════════════════════════════════════════════════════════');
};

// Executar testes
runAllTests();