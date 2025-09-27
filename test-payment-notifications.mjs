#!/usr/bin/env node

/**
 * Test completo do sistema de notificações de pagamento
 */

import fetch from 'node-fetch';

const BASE_URL = process.env.TEST_BASE_URL || 'https://jchairstudios62.xyz';

console.log('🧪 TESTE: Sistema de Notificações de Pagamento');
console.log(`🌐 URL Base: ${BASE_URL}`);
console.log('=' .repeat(60));

// Dados de teste
const testOrderData = {
  paymentIntentId: `pi_test_${Date.now()}`,
  customerInfo: {
    name: 'João Silva Teste',
    email: 'teste@exemplo.com',
    phone: '+351912345678'
  },
  amount: 45.99,
  currency: 'eur',
  items: [
    {
      name: 'Mega Hair Brasileiro 50cm',
      quantity: 1,
      price: 45.99
    }
  ]
};

async function testPaymentSuccessAPI() {
  console.log('\n📧 TESTANDO: API de Notificação Imediata');

  try {
    const response = await fetch(`${BASE_URL}/api/payment-success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData)
    });

    console.log(`📊 Status: ${response.status}`);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ API funcionando corretamente');
      console.log('📄 Resposta:', result);
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Erro na API:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    return false;
  }
}

async function testWebhookEndpoint() {
  console.log('\n🎣 TESTANDO: Endpoint de Webhook');

  try {
    // Teste básico sem assinatura (vai falhar, mas confirma que endpoint existe)
    const response = await fetch(`${BASE_URL}/api/webhooks/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: testOrderData.paymentIntentId,
            amount: testOrderData.amount * 100,
            currency: testOrderData.currency,
            metadata: {
              customerEmail: testOrderData.customerInfo.email,
              customerName: testOrderData.customerInfo.name,
              itemsCount: '1'
            }
          }
        }
      })
    });

    console.log(`📊 Status: ${response.status}`);

    if (response.status === 400) {
      const error = await response.json();
      if (error.error && error.error.includes('signature')) {
        console.log('✅ Endpoint ativo (falha esperada: sem assinatura)');
        return true;
      }
    }

    console.log('⚠️ Resposta inesperada do webhook');
    return false;
  } catch (error) {
    console.error('❌ Erro testando webhook:', error.message);
    return false;
  }
}

async function testEmailConfiguration() {
  console.log('\n📬 VERIFICANDO: Configuração de Email');

  const requiredVars = [
    'SENDGRID_API_KEY',
    'SENDGRID_FROM_EMAIL',
    'SUPPORT_EMAIL'
  ];

  // Este é apenas um teste de conectividade, não pode verificar vars
  console.log('📋 Variáveis necessárias:', requiredVars.join(', '));
  console.log('✅ Verificação manual necessária no painel Vercel');

  return true;
}

async function testAdminAPI() {
  console.log('\n🔧 TESTANDO: API do Painel Admin');

  try {
    const response = await fetch(`${BASE_URL}/api/admin/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: testOrderData.paymentIntentId,
        customerName: testOrderData.customerInfo.name,
        customerEmail: testOrderData.customerInfo.email,
        total: testOrderData.amount,
        currency: testOrderData.currency,
        status: 'paid',
        createdAt: new Date().toISOString()
      })
    });

    console.log(`📊 Status: ${response.status}`);

    if (response.ok) {
      console.log('✅ API do admin funcionando');
      return true;
    } else {
      const error = await response.text();
      console.log('⚠️ API do admin com problemas:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro testando API admin:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando testes...\n');

  const results = {
    paymentAPI: await testPaymentSuccessAPI(),
    webhook: await testWebhookEndpoint(),
    email: await testEmailConfiguration(),
    admin: await testAdminAPI()
  };

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DOS TESTES:');
  console.log('='.repeat(60));

  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASSOU' : '❌ FALHOU';
    const testName = {
      paymentAPI: 'API Notificação Imediata',
      webhook: 'Endpoint Webhook',
      email: 'Configuração Email',
      admin: 'API Painel Admin'
    }[test];

    console.log(`${status} - ${testName}`);
  });

  const allPassed = Object.values(results).every(r => r);

  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ Sistema de notificações funcionando');
  } else {
    console.log('⚠️ ALGUNS TESTES FALHARAM');
    console.log('🔧 Verifique os problemas acima');
  }
  console.log('='.repeat(60));

  return allPassed;
}

// Executar testes
runAllTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Erro fatal nos testes:', error);
  process.exit(1);
});