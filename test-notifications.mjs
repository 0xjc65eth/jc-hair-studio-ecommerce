#!/usr/bin/env node

/**
 * TESTE EXAUSTIVO DE NOTIFICAÇÕES - JC Hair Studio
 *
 * Este script testa rigorosamente todo o fluxo de notificações:
 * 1. Notificações de vendas para admin
 * 2. Emails de confirmação para clientes
 * 3. Integração com SendGrid
 * 4. Armazenamento MongoDB
 * 5. Sistema de fallback
 */

const BASE_URL = process.env.TEST_BASE_URL || 'https://jc-hair-studio-iqxbgl0d5-0xjc65eths-projects.vercel.app';

console.log(`🧪 INICIANDO TESTE EXAUSTIVO DE NOTIFICAÇÕES`);
console.log(`🌐 Base URL: ${BASE_URL}`);
console.log(`⏰ Data/Hora: ${new Date().toLocaleString('pt-BR')}`);
console.log(`${'='.repeat(80)}`);

/**
 * Teste 1: Notificação Admin - Simulação de venda
 */
async function testeNotificacaoAdmin() {
  console.log('\n📧 TESTE 1: NOTIFICAÇÃO ADMIN');
  console.log('-'.repeat(50));

  try {
    const response = await fetch(`${BASE_URL}/api/admin/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'testNotification'
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Teste de notificação admin: SUCESSO');
      console.log(`📝 Resposta: ${result.message}`);
      return true;
    } else {
      console.log('❌ Teste de notificação admin: FALHA');
      console.log(`📝 Erro: ${result.error || 'Erro desconhecido'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Teste de notificação admin: ERRO DE CONEXÃO');
    console.log(`📝 Erro: ${error.message}`);
    return false;
  }
}

/**
 * Teste 2: Payment Success API - Fluxo completo
 */
async function testePaymentSuccess() {
  console.log('\n💳 TESTE 2: PAYMENT SUCCESS API');
  console.log('-'.repeat(50));

  const testData = {
    paymentIntentId: `pi_test_${Date.now()}`,
    customerInfo: {
      name: 'Cliente Teste Exaustivo',
      email: 'teste.exaustivo@exemplo.com',
      phone: '+351 912 345 678'
    },
    items: [
      {
        name: '🧪 Produto Teste - Email System',
        quantity: 1,
        price: 1.00
      }
    ],
    amount: 1.00
  };

  try {
    console.log(`📊 Dados de teste:`, JSON.stringify(testData, null, 2));

    const response = await fetch(`${BASE_URL}/api/payment-success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Teste payment-success: SUCESSO');
      console.log(`📝 Resposta: ${result.message}`);
      return true;
    } else {
      console.log('❌ Teste payment-success: FALHA');
      console.log(`📝 Erro: ${result.error || 'Erro desconhecido'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Teste payment-success: ERRO DE CONEXÃO');
    console.log(`📝 Erro: ${error.message}`);
    return false;
  }
}

/**
 * Teste 3: Newsletter Signup
 */
async function testeNewsletter() {
  console.log('\n📬 TESTE 3: NEWSLETTER SIGNUP');
  console.log('-'.repeat(50));

  const testData = {
    email: 'teste.newsletter@exemplo.com',
    name: 'Teste Newsletter Exaustivo'
  };

  try {
    const response = await fetch(`${BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Teste newsletter: SUCESSO');
      console.log(`📝 Resposta: ${result.message}`);
      return true;
    } else {
      console.log('❌ Teste newsletter: FALHA');
      console.log(`📝 Erro: ${result.error || 'Erro desconhecido'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Teste newsletter: ERRO DE CONEXÃO');
    console.log(`📝 Erro: ${error.message}`);
    return false;
  }
}

/**
 * Teste 4: Contato/Suporte
 */
async function testeContato() {
  console.log('\n📞 TESTE 4: FORMULÁRIO DE CONTATO');
  console.log('-'.repeat(50));

  const testData = {
    name: 'Teste Contato Exaustivo',
    email: 'teste.contato@exemplo.com',
    phone: '+351 987 654 321',
    subject: 'Teste Exaustivo do Sistema de Notificações',
    message: 'Este é um teste automatizado para validar o funcionamento completo do sistema de notificações do JC Hair Studio. Se você está recebendo este email, significa que o sistema está funcionando corretamente.',
    formType: 'support'
  };

  try {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Teste contato: SUCESSO');
      console.log(`📝 Resposta: ${result.message || 'Email enviado'}`);
      return true;
    } else {
      console.log('❌ Teste contato: FALHA');
      console.log(`📝 Erro: ${result.error || 'Erro desconhecido'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Teste contato: ERRO DE CONEXÃO');
    console.log(`📝 Erro: ${error.message}`);
    return false;
  }
}

/**
 * Executar todos os testes
 */
async function executarTodosOsTestes() {
  const resultados = {
    notificacaoAdmin: false,
    paymentSuccess: false,
    newsletter: false,
    contato: false
  };

  // Executar testes sequencialmente com delay
  resultados.notificacaoAdmin = await testeNotificacaoAdmin();
  await new Promise(resolve => setTimeout(resolve, 2000));

  resultados.paymentSuccess = await testePaymentSuccess();
  await new Promise(resolve => setTimeout(resolve, 2000));

  resultados.newsletter = await testeNewsletter();
  await new Promise(resolve => setTimeout(resolve, 2000));

  resultados.contato = await testeContato();

  // Relatório final
  console.log('\n' + '='.repeat(80));
  console.log('📋 RELATÓRIO FINAL DE TESTES');
  console.log('='.repeat(80));

  const sucessos = Object.values(resultados).filter(Boolean).length;
  const total = Object.keys(resultados).length;

  console.log(`📊 Resultados: ${sucessos}/${total} testes bem-sucedidos`);
  console.log('');

  Object.entries(resultados).forEach(([teste, sucesso]) => {
    const status = sucesso ? '✅ SUCESSO' : '❌ FALHA';
    console.log(`${status} - ${teste}`);
  });

  console.log('');

  if (sucessos === total) {
    console.log('🎉 TODOS OS TESTES PASSARAM! Sistema de notificações funcionando perfeitamente.');
  } else {
    console.log('⚠️ ALGUNS TESTES FALHARAM! Verifique a configuração do sistema.');
  }

  console.log(`⏰ Teste concluído em: ${new Date().toLocaleString('pt-BR')}`);
  console.log('='.repeat(80));

  return resultados;
}

// Executar testes
executarTodosOsTestes().catch(error => {
  console.error('❌ ERRO CRÍTICO NO TESTE:', error);
  process.exit(1);
});