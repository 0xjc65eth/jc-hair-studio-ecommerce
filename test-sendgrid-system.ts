#!/usr/bin/env tsx

/**
 * Teste completo do sistema de emails SendGrid
 * Executa: npx tsx test-sendgrid-system.ts
 */

import { sendContactEmail, sendOrderConfirmationEmail, sendNewsletterEmail } from './lib/utils/sendgrid';
import { sendEmail, generateOrderConfirmationEmail, generateSupportEmail, generateShippedEmail } from './lib/utils/email';

console.log('🧪 Testando Sistema de Emails SendGrid - JC Hair Studio\'s 62\n');

// Dados de teste
const testCustomer = {
  name: 'João Silva',
  email: 'teste@jchairstudios62.xyz',
  phone: '+351928375226'
};

const testOrderData = {
  orderId: 'TEST_' + Date.now(),
  customerName: testCustomer.name,
  customerEmail: testCustomer.email,
  total: 89.99,
  items: [
    { name: 'Tinta Beauty Color Louro Dourado', quantity: 2, price: 24.99 },
    { name: 'Shampoo Hidratante Wella', quantity: 1, price: 39.99 }
  ]
};

const testShippingData = {
  orderId: testOrderData.orderId,
  customerName: testCustomer.name,
  customerEmail: testCustomer.email,
  trackingCode: 'BR123456789PT',
  carrier: 'CTT Express',
  estimatedDelivery: '3-5 dias úteis',
  shippingAddress: 'Rua das Flores, 123\n1200-001 Lisboa\nPortugal',
  items: testOrderData.items.map(item => ({
    name: item.name,
    quantity: item.quantity
  }))
};

const testContactData = {
  name: testCustomer.name,
  email: testCustomer.email,
  phone: testCustomer.phone,
  subject: 'Dúvida sobre produto',
  message: 'Gostaria de saber se o produto X é adequado para cabelos cacheados.',
  formType: 'product_question' as const
};

async function testEmailSystem() {
  console.log('='.repeat(60));
  console.log('🔍 VERIFICANDO CONFIGURAÇÃO');
  console.log('='.repeat(60));

  const hasApiKey = !!process.env.SENDGRID_API_KEY;
  const hasFromEmail = !!process.env.FROM_EMAIL;
  const hasSupportEmail = !!process.env.SUPPORT_EMAIL;

  console.log(`📧 SendGrid API Key: ${hasApiKey ? '✅ Configurada' : '❌ Não encontrada'}`);
  console.log(`📧 From Email: ${hasFromEmail ? '✅ Configurada' : '❌ Não encontrada'}`);
  console.log(`📧 Support Email: ${hasSupportEmail ? '✅ Configurada' : '❌ Não encontrada'}`);

  if (!hasApiKey) {
    console.log('\n❌ SENDGRID_API_KEY não encontrada! Emails serão simulados.');
  }

  console.log(`\n📋 Email de teste: ${testCustomer.email}`);
  console.log(`📋 Pedido de teste: #${testOrderData.orderId}`);

  const results = {
    contact: false,
    order: false,
    newsletter: false,
    shipping: false,
    support: false
  };

  console.log('\n='.repeat(60));
  console.log('📧 TESTE 1: EMAIL DE CONTATO/SUPORTE');
  console.log('='.repeat(60));

  try {
    results.contact = await sendContactEmail(testContactData);
    console.log(`${results.contact ? '✅' : '❌'} Email de contato: ${results.contact ? 'Enviado' : 'Falhou'}`);
  } catch (error) {
    console.log('❌ Erro no email de contato:', (error as Error).message);
  }

  console.log('\n='.repeat(60));
  console.log('📧 TESTE 2: EMAIL DE CONFIRMAÇÃO DE PEDIDO');
  console.log('='.repeat(60));

  try {
    results.order = await sendOrderConfirmationEmail(testOrderData);
    console.log(`${results.order ? '✅' : '❌'} Email de pedido: ${results.order ? 'Enviado' : 'Falhou'}`);
  } catch (error) {
    console.log('❌ Erro no email de pedido:', (error as Error).message);
  }

  console.log('\n='.repeat(60));
  console.log('📧 TESTE 3: EMAIL DE NEWSLETTER');
  console.log('='.repeat(60));

  try {
    results.newsletter = await sendNewsletterEmail(testCustomer.email, testCustomer.name);
    console.log(`${results.newsletter ? '✅' : '❌'} Email de newsletter: ${results.newsletter ? 'Enviado' : 'Falhou'}`);
  } catch (error) {
    console.log('❌ Erro no email de newsletter:', (error as Error).message);
  }

  console.log('\n='.repeat(60));
  console.log('📧 TESTE 4: EMAIL DE ENVIO/SHIPPING');
  console.log('='.repeat(60));

  try {
    const shippingEmailData = generateShippedEmail(testShippingData);
    results.shipping = await sendEmail(shippingEmailData);
    console.log(`${results.shipping ? '✅' : '❌'} Email de envio: ${results.shipping ? 'Enviado' : 'Falhou'}`);
  } catch (error) {
    console.log('❌ Erro no email de envio:', (error as Error).message);
  }

  console.log('\n='.repeat(60));
  console.log('📧 TESTE 5: EMAIL DE SUPORTE INTERNO');
  console.log('='.repeat(60));

  try {
    const supportEmailData = generateSupportEmail({
      customerName: testCustomer.name,
      customerEmail: testCustomer.email,
      subject: 'Problema com pedido',
      message: 'Não recebi o código de rastreamento do meu pedido.',
      orderId: testOrderData.orderId,
      phone: testCustomer.phone
    });
    results.support = await sendEmail(supportEmailData);
    console.log(`${results.support ? '✅' : '❌'} Email de suporte interno: ${results.support ? 'Enviado' : 'Falhou'}`);
  } catch (error) {
    console.log('❌ Erro no email de suporte interno:', (error as Error).message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎯 RESUMO DOS TESTES');
  console.log('='.repeat(60));

  const emailTests = [
    { name: '📞 Email de Contato/Suporte', success: results.contact },
    { name: '🛒 Email de Confirmação de Pedido', success: results.order },
    { name: '📰 Email de Newsletter', success: results.newsletter },
    { name: '📦 Email de Envio/Shipping', success: results.shipping },
    { name: '🔧 Email de Suporte Interno', success: results.support }
  ];

  emailTests.forEach((test, index) => {
    const status = test.success ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${test.name}`);
  });

  const successCount = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  console.log(`\n📊 Resultado: ${successCount}/${totalTests} emails enviados com sucesso`);

  console.log('\n💡 PRÓXIMOS PASSOS:');
  console.log('1. Verificar se os emails chegaram na caixa de entrada');
  console.log('2. Verificar se não foram para SPAM');
  console.log('3. Validar o visual e conteúdo dos emails');
  console.log('4. Testar links e botões nos emails');

  if (hasApiKey && successCount === totalTests) {
    console.log('\n✅ Sistema de emails está configurado e funcionando perfeitamente!');
    console.log('📧 Verificar sua caixa de email: ' + testCustomer.email);
  } else if (hasApiKey && successCount > 0) {
    console.log('\n⚠️ Sistema parcialmente funcional - alguns emails falharam');
  } else if (!hasApiKey) {
    console.log('\n⚠️ Sistema em modo de desenvolvimento (emails simulados)');
    console.log('🔧 Configure SENDGRID_API_KEY para envio real');
  } else {
    console.log('\n❌ Sistema com problemas - verificar configuração');
  }

  console.log('\n🏆 Teste concluído!');
}

// Executar testes
testEmailSystem().catch(console.error);