#!/usr/bin/env node

/**
 * Teste Completo do Sistema SendGrid
 * Testa Newsletter, Contato e Notificações de Vendas
 */

import { spawn } from 'child_process';

console.log('🧪 TESTE COMPLETO DO SISTEMA SENDGRID');
console.log('=====================================\n');

// Função para fazer requisições HTTP
async function testAPI(url, method = 'GET', body = null) {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Teste 1: Newsletter Subscription
console.log('📧 TESTE 1: NEWSLETTER SUBSCRIPTION');
console.log('-----------------------------------');

const newsletterTest = await testAPI('https://jchairstudios62.xyz/api/newsletter', 'POST', {
  email: 'juliocesarurss62@gmail.com',
  name: 'Julio Cesar (Teste)'
});

if (newsletterTest.success) {
  console.log('✅ Newsletter API funcionando');
  console.log('📩 Resultado:', newsletterTest.data.message);
} else {
  console.log('❌ Newsletter API falhou');
  console.log('🔍 Erro:', newsletterTest.data || newsletterTest.error);
}

console.log('\n');

// Teste 2: Contact Form
console.log('📞 TESTE 2: CONTACT FORM');
console.log('------------------------');

const contactTest = await testAPI('https://jchairstudios62.xyz/api/contact', 'POST', {
  name: 'Julio Cesar (Teste)',
  email: 'juliocesarurss62@gmail.com',
  phone: '+351928375226',
  subject: 'Teste do Sistema de Contato',
  message: 'Este é um teste automatizado do sistema de contato. Se você recebeu este email, o sistema está funcionando perfeitamente!'
});

if (contactTest.success) {
  console.log('✅ Contact API funcionando');
  console.log('📩 Resultado:', contactTest.data.message);
} else {
  console.log('❌ Contact API falhou');
  console.log('🔍 Erro:', contactTest.data || contactTest.error);
}

console.log('\n');

// Teste 3: Admin Notifications
console.log('🔔 TESTE 3: ADMIN NOTIFICATIONS');
console.log('-------------------------------');

const notificationTest = await testAPI('https://jchairstudios62.xyz/api/admin/notifications', 'POST', {
  action: 'testNotification'
});

if (notificationTest.success) {
  console.log('✅ Notification API funcionando');
  console.log('📩 Resultado:', notificationTest.data.message);
} else {
  console.log('❌ Notification API falhou');
  console.log('🔍 Erro:', notificationTest.data || notificationTest.error);
}

console.log('\n');

// Teste 4: Verificar Configurações de Email
console.log('⚙️  TESTE 4: CONFIGURAÇÕES');
console.log('-------------------------');

// Verificar se as variáveis estão configuradas
const envVars = [
  'SENDGRID_API_KEY',
  'ADMIN_EMAIL',
  'FROM_EMAIL',
  'SUPPORT_EMAIL'
];

console.log('📋 Verificando variáveis de ambiente:');
envVars.forEach(varName => {
  const hasVar = process.env[varName] ? '✅' : '❌';
  console.log(`${hasVar} ${varName}: ${process.env[varName] ? 'Configurado' : 'Não configurado'}`);
});

console.log('\n');

// Resumo dos Testes
console.log('📊 RESUMO DOS TESTES');
console.log('====================');
console.log(`📧 Newsletter: ${newsletterTest.success ? '✅ OK' : '❌ FALHOU'}`);
console.log(`📞 Contato: ${contactTest.success ? '✅ OK' : '❌ FALHOU'}`);
console.log(`🔔 Notificações: ${notificationTest.success ? '✅ OK' : '❌ FALHOU'}`);

const totalTests = 3;
const passedTests = [newsletterTest.success, contactTest.success, notificationTest.success].filter(Boolean).length;

console.log(`\n🎯 RESULTADO FINAL: ${passedTests}/${totalTests} testes passaram`);

if (passedTests === totalTests) {
  console.log('🎉 SISTEMA SENDGRID 100% FUNCIONAL!');
  console.log('\n📮 O QUE ACONTECE QUANDO UM CLIENTE SE CADASTRA:');
  console.log('1. Cliente insere email no formulário de newsletter');
  console.log('2. Sistema valida o email');
  console.log('3. Cliente recebe email de boas-vindas com cupom BEMVINDO10');
  console.log('4. Você (admin) é notificado da nova inscrição');
  console.log('5. Cliente fica na lista para futuras campanhas');
} else {
  console.log('⚠️  Alguns testes falharam. Verifique as configurações.');
}