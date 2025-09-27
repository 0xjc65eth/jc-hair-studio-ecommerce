#!/usr/bin/env node

/**
 * Teste completo do fluxo de pagamento com notificações
 */

import fetch from 'node-fetch';
import Stripe from 'stripe';

const BASE_URL = 'https://jchairstudios62.xyz';

// Configurar Stripe para teste
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2023-10-16',
});

console.log('🧪 TESTE COMPLETO: Sistema de Pagamento e Notificações');
console.log(`🌐 URL: ${BASE_URL}`);
console.log('=' .repeat(60));

// Dados de teste
const testData = {
  customerInfo: {
    name: 'Teste Cliente',
    email: 'juliocesarurss62@gmail.com', // Email real para testar
    phone: '+351912345678'
  },
  amount: 25.99,
  currency: 'eur',
  items: [
    {
      name: 'Produto Teste',
      quantity: 1,
      price: 25.99
    }
  ]
};

async function testPaymentIntentCreation() {
  console.log('\n1️⃣ TESTANDO: Criação do Payment Intent');

  try {
    const response = await fetch(`${BASE_URL}/api/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (response.ok && result.clientSecret) {
      console.log('✅ Payment Intent criado com sucesso');
      console.log('   - Client Secret recebido');
      console.log(`   - Payment Intent ID: ${result.paymentIntentId}`);
      return result.paymentIntentId;
    } else {
      console.error('❌ Falha ao criar Payment Intent:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro de rede:', error.message);
    return null;
  }
}

async function testImmediateNotification(paymentIntentId) {
  console.log('\n2️⃣ TESTANDO: Notificação Imediata');

  try {
    const response = await fetch(`${BASE_URL}/api/payment-success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentIntentId: paymentIntentId || 'pi_test_' + Date.now(),
        ...testData
      })
    });

    if (response.ok) {
      console.log('✅ Notificação imediata enviada');
      console.log('   📧 Email de confirmação deve chegar em breve');
      console.log('   📊 Pedido deve aparecer no painel admin');
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Falha na notificação:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro enviando notificação:', error.message);
    return false;
  }
}

async function checkAdminPanel() {
  console.log('\n3️⃣ VERIFICANDO: Painel Administrativo');

  try {
    const response = await fetch(`${BASE_URL}/api/admin/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const orders = await response.json();
      console.log('✅ Painel admin acessível');
      console.log(`   📋 Total de pedidos: ${orders.length || 0}`);

      if (orders.length > 0) {
        const lastOrder = orders[orders.length - 1];
        console.log(`   🆕 Último pedido: #${lastOrder.orderId?.substring(0, 8)}`);
      }
      return true;
    } else {
      console.log('⚠️ Painel admin requer autenticação ou não está acessível');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro acessando painel admin:', error.message);
    return false;
  }
}

async function testWebhookEndpoint() {
  console.log('\n4️⃣ TESTANDO: Webhook do Stripe');

  try {
    // Simular webhook (sem assinatura válida, mas testa se endpoint existe)
    const response = await fetch(`${BASE_URL}/api/webhooks/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test_signature'
      },
      body: JSON.stringify({
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_webhook_' + Date.now(),
            amount: 2599,
            currency: 'eur',
            metadata: {
              customerEmail: testData.customerInfo.email,
              customerName: testData.customerInfo.name,
              itemsCount: '1'
            }
          }
        }
      })
    });

    if (response.status === 400) {
      const result = await response.json();
      if (result.error && result.error.includes('signature')) {
        console.log('✅ Webhook endpoint ativo');
        console.log('   ⚠️ Assinatura inválida (esperado em teste)');
        return true;
      }
    } else if (response.status === 500 && (await response.text()).includes('not configured')) {
      console.log('⚠️ Webhook secret não configurado em produção');
      return false;
    }

    console.log('⚠️ Resposta inesperada do webhook:', response.status);
    return false;
  } catch (error) {
    console.error('❌ Erro testando webhook:', error.message);
    return false;
  }
}

async function runFullTest() {
  console.log('🚀 Iniciando teste completo do sistema...\n');

  const results = {
    paymentIntent: false,
    notification: false,
    adminPanel: false,
    webhook: false
  };

  // Teste 1: Criar Payment Intent
  const paymentIntentId = await testPaymentIntentCreation();
  results.paymentIntent = !!paymentIntentId;

  // Teste 2: Enviar notificação imediata
  if (paymentIntentId) {
    results.notification = await testImmediateNotification(paymentIntentId);
  } else {
    console.log('⏭️ Pulando teste de notificação (Payment Intent falhou)');
  }

  // Teste 3: Verificar painel admin
  results.adminPanel = await checkAdminPanel();

  // Teste 4: Testar webhook
  results.webhook = await testWebhookEndpoint();

  // Resumo dos resultados
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DOS TESTES:');
  console.log('='.repeat(60));

  const testNames = {
    paymentIntent: '💳 Criação de Payment Intent',
    notification: '📧 Sistema de Notificação',
    adminPanel: '🔧 Painel Administrativo',
    webhook: '🎣 Webhook do Stripe'
  };

  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASSOU' : '❌ FALHOU';
    console.log(`${status} - ${testNames[test]}`);
  });

  const allPassed = Object.values(results).every(r => r);
  const critical = results.paymentIntent && results.notification;

  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ Sistema funcionando perfeitamente');
  } else if (critical) {
    console.log('⚠️ SISTEMA PARCIALMENTE FUNCIONAL');
    console.log('✅ Pagamentos e notificações funcionando');
    console.log('🔧 Verifique os componentes que falharam');
  } else {
    console.log('❌ SISTEMA COM PROBLEMAS CRÍTICOS');
    console.log('🔧 Correções urgentes necessárias');
  }
  console.log('='.repeat(60));

  // Instruções finais
  if (results.notification) {
    console.log('\n📬 IMPORTANTE: Verifique seu email (juliocesarurss62@gmail.com)');
    console.log('   - Você deve receber um email de confirmação de pedido');
    console.log('   - Também deve receber uma notificação de nova venda');
  }

  return allPassed;
}

// Executar teste
runFullTest().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Erro fatal no teste:', error);
  process.exit(1);
});