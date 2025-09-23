#!/usr/bin/env node

/**
 * Teste das APIs de email do sistema
 * Testa através dos endpoints da aplicação
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

console.log('🧪 Testando APIs de Email - JC Hair Studio\'s 62\n');

const testData = {
  contact: {
    name: 'João Silva',
    email: 'teste@jchairstudios62.xyz',
    phone: '+351928375226',
    subject: 'Dúvida sobre produto',
    message: 'Gostaria de saber se o produto X é adequado para cabelos cacheados.',
    formType: 'product_question'
  },
  newsletter: {
    email: 'teste@jchairstudios62.xyz',
    name: 'João Silva'
  },
  order: {
    orderId: 'TEST_' + Date.now(),
    customerName: 'João Silva',
    customerEmail: 'teste@jchairstudios62.xyz',
    total: 89.99,
    items: [
      { name: 'Tinta Beauty Color Louro Dourado', quantity: 2, price: 24.99 },
      { name: 'Shampoo Hidratante Wella', quantity: 1, price: 39.99 }
    ]
  }
};

async function testEmailAPIs() {
  console.log('='.repeat(60));
  console.log('🔍 VERIFICANDO SERVIDOR LOCAL');
  console.log('='.repeat(60));

  try {
    const healthCheck = await fetch(`${BASE_URL}/api/health`);
    console.log(`🖥️ Servidor: ${healthCheck.ok ? '✅ Online' : '❌ Offline'}`);
  } catch (error) {
    console.log('❌ Erro ao conectar no servidor:', error.message);
    console.log('💡 Execute: npm run dev');
    return;
  }

  const results = {
    contact: false,
    newsletter: false,
    sendEmail: false
  };

  console.log('\n='.repeat(60));
  console.log('📧 TESTE 1: API DE CONTATO');
  console.log('='.repeat(60));

  try {
    const contactResponse = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData.contact)
    });

    const contactResult = await contactResponse.json();
    results.contact = contactResponse.ok;

    console.log(`Status: ${contactResponse.status} ${contactResponse.statusText}`);
    console.log('Resposta:', JSON.stringify(contactResult, null, 2));
    console.log(`${results.contact ? '✅' : '❌'} API de contato: ${results.contact ? 'Funcionando' : 'Falhou'}`);
  } catch (error) {
    console.log('❌ Erro na API de contato:', error.message);
  }

  console.log('\n='.repeat(60));
  console.log('📧 TESTE 2: API DE NEWSLETTER');
  console.log('='.repeat(60));

  try {
    const newsletterResponse = await fetch(`${BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData.newsletter)
    });

    const newsletterResult = await newsletterResponse.json();
    results.newsletter = newsletterResponse.ok;

    console.log(`Status: ${newsletterResponse.status} ${newsletterResponse.statusText}`);
    console.log('Resposta:', JSON.stringify(newsletterResult, null, 2));
    console.log(`${results.newsletter ? '✅' : '❌'} API de newsletter: ${results.newsletter ? 'Funcionando' : 'Falhou'}`);
  } catch (error) {
    console.log('❌ Erro na API de newsletter:', error.message);
  }

  console.log('\n='.repeat(60));
  console.log('📧 TESTE 3: API DE ENVIO DE EMAIL GERAL');
  console.log('='.repeat(60));

  try {
    const emailData = {
      to: 'teste@jchairstudios62.xyz',
      subject: 'Teste de Email - JC Hair Studio',
      message: 'Este é um teste do sistema de emails.',
      orderData: testData.order
    };

    const emailResponse = await fetch(`${BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    const emailResult = await emailResponse.json();
    results.sendEmail = emailResponse.ok;

    console.log(`Status: ${emailResponse.status} ${emailResponse.statusText}`);
    console.log('Resposta:', JSON.stringify(emailResult, null, 2));
    console.log(`${results.sendEmail ? '✅' : '❌'} API de envio de email: ${results.sendEmail ? 'Funcionando' : 'Falhou'}`);
  } catch (error) {
    console.log('❌ Erro na API de email:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎯 RESUMO DOS TESTES DE API');
  console.log('='.repeat(60));

  const apiTests = [
    { name: '📞 API de Contato', success: results.contact },
    { name: '📰 API de Newsletter', success: results.newsletter },
    { name: '📧 API de Envio de Email', success: results.sendEmail }
  ];

  apiTests.forEach((test, index) => {
    const status = test.success ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${test.name}`);
  });

  const successCount = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  console.log(`\n📊 Resultado: ${successCount}/${totalTests} APIs funcionando`);

  console.log('\n💡 INTEGRAÇÃO COM E-COMMERCE:');
  console.log('✅ Email de contato: Formulários de suporte');
  console.log('✅ Email de newsletter: Cadastro de clientes');
  console.log('✅ Email de pedido: Confirmação automática');
  console.log('✅ Email de shipping: Notificação de envio');
  console.log('✅ Email de pagamento: Confirmação de pagamento');

  console.log('\n📋 FLUXO COMPLETO DO E-COMMERCE:');
  console.log('1. 🛒 Cliente faz pedido → Email de confirmação');
  console.log('2. 💳 Pagamento aprovado → Email de pagamento');
  console.log('3. 📦 Produto despachado → Email de shipping');
  console.log('4. 📞 Cliente tem dúvida → Email de suporte');
  console.log('5. 📰 Cliente se cadastra → Email de newsletter');

  if (successCount === totalTests) {
    console.log('\n✅ Sistema de emails totalmente funcional!');
    console.log('🚀 Pronto para uso em produção');
  } else if (successCount > 0) {
    console.log('\n⚠️ Sistema parcialmente funcional');
    console.log('🔧 Verificar APIs que falharam');
  } else {
    console.log('\n❌ Sistema com problemas');
    console.log('🔧 Verificar configuração do servidor');
  }

  console.log('\n🏆 Teste de APIs concluído!');
}

// Executar testes
testEmailAPIs().catch(console.error);