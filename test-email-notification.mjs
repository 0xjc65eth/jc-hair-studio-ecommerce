#!/usr/bin/env node

/**
 * TESTE IMEDIATO DO SISTEMA DE NOTIFICAÇÕES DE EMAIL
 * Simula uma compra real para testar o envio de emails
 */

import fetch from 'node-fetch';

const PRODUCTION_URL = 'https://jc-hair-studio-2m7vahjzx-0xjc65eths-projects.vercel.app';

console.log('\n📧 TESTE SISTEMA DE NOTIFICAÇÕES DE EMAIL');
console.log('══════════════════════════════════════════════════════════');
console.log(`🌐 URL: ${PRODUCTION_URL}\n`);

const testEmailNotification = async () => {
  try {
    console.log('🧪 Testando API de payment-success diretamente...');

    const mockOrderData = {
      paymentIntentId: 'pi_test_' + Date.now(),
      amount: 25.99,
      currency: 'eur',
      customerInfo: {
        name: 'Teste de Email',
        email: 'juliocesarurss65@gmail.com', // Seu email para teste
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
        name: 'Mega Hair Teste',
        quantity: 1,
        price: 25.99
      }],
      orderTotals: {
        subtotal: 25.99,
        taxAmount: 0,
        shippingCost: 0,
        finalTotal: 25.99
      },
      technicalInfo: {
        clientIp: '127.0.0.1',
        userAgent: 'Test Bot',
        timestamp: new Date().toISOString()
      }
    };

    console.log('📤 Enviando dados para payment-success API...');
    console.log('📧 Email do cliente:', mockOrderData.customerInfo.email);
    console.log('💰 Valor do pedido: €' + mockOrderData.amount);

    const response = await fetch(`${PRODUCTION_URL}/api/payment-success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockOrderData),
    });

    console.log('\n📊 RESULTADO DA API:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Resposta da API:', data);

      console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
      console.log('📧 Verifique sua caixa de entrada:');
      console.log('   • Cliente: ' + mockOrderData.customerInfo.email);
      console.log('   • Admin: suporte@jchairstudios62.xyz');
      console.log('📱 Também verifique a pasta de spam');

    } else {
      const errorText = await response.text();
      console.log('❌ Erro na API:', errorText);
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
};

// Teste adicional: verificar configurações de email
const testEmailConfig = async () => {
  try {
    console.log('\n🔧 Testando configurações de email...');

    const response = await fetch(`${PRODUCTION_URL}/api/debug/email`, {
      method: 'GET',
    });

    if (response.ok) {
      const config = await response.json();
      console.log('📋 Configurações de email:', config);
    } else {
      console.log('⚠️ Não foi possível obter configurações de email');
    }
  } catch (error) {
    console.log('⚠️ Erro ao verificar configurações:', error.message);
  }
};

// Executar testes
console.log('🚀 Iniciando teste de notificações...\n');

await testEmailConfig();
await testEmailNotification();

console.log('\n══════════════════════════════════════════════════════════');
console.log('📧 Verifique sua caixa de entrada nos próximos minutos!');
console.log('🕐 SendGrid pode demorar 1-2 minutos para entregar emails');
console.log('══════════════════════════════════════════════════════════');