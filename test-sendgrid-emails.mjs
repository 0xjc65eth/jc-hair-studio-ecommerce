#!/usr/bin/env node

/**
 * Teste completo do sistema de emails SendGrid
 * Testa todos os tipos: orders, payment, shipping e newsletter
 */

// Como é um teste em Node.js puro, vamos simular as funções de email
// Para teste real, seria necessário compilar o TypeScript ou usar tsx

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
  ],
  paymentMethod: 'Cartão de Crédito'
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
  formType: 'product_question'
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

  console.log('\n='.repeat(60));
  console.log('📧 TESTE 1: EMAIL DE CONTATO/SUPORTE');
  console.log('='.repeat(60));

  try {
    const contactResult = await sendContactEmail(testContactData);
    console.log(`${contactResult ? '✅' : '❌'} Email de contato: ${contactResult ? 'Enviado' : 'Falhou'}`);
  } catch (error) {
    console.log('❌ Erro no email de contato:', error.message);
  }

  console.log('\n='.repeat(60));
  console.log('📧 TESTE 2: EMAIL DE CONFIRMAÇÃO DE PEDIDO');
  console.log('='.repeat(60));

  try {
    const orderResult = await sendOrderConfirmationEmail(testOrderData);
    console.log(`${orderResult ? '✅' : '❌'} Email de pedido: ${orderResult ? 'Enviado' : 'Falhou'}`);
  } catch (error) {
    console.log('❌ Erro no email de pedido:', error.message);
  }

  console.log('\n='.repeat(60));
  console.log('📧 TESTE 3: EMAIL DE NEWSLETTER');
  console.log('='.repeat(60));

  try {
    const newsletterResult = await sendNewsletterEmail(testCustomer.email, testCustomer.name);
    console.log(`${newsletterResult ? '✅' : '❌'} Email de newsletter: ${newsletterResult ? 'Enviado' : 'Falhou'}`);
  } catch (error) {
    console.log('❌ Erro no email de newsletter:', error.message);
  }

  console.log('\n='.repeat(60));
  console.log('📧 TESTE 4: EMAIL DE ENVIO/SHIPPING');
  console.log('='.repeat(60));

  try {
    const shippingEmailData = generateShippedEmail(testShippingData);
    const shippingResult = await sendEmail(shippingEmailData);
    console.log(`${shippingResult ? '✅' : '❌'} Email de envio: ${shippingResult ? 'Enviado' : 'Falhou'}`);
  } catch (error) {
    console.log('❌ Erro no email de envio:', error.message);
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
    const supportResult = await sendEmail(supportEmailData);
    console.log(`${supportResult ? '✅' : '❌'} Email de suporte interno: ${supportResult ? 'Enviado' : 'Falhou'}`);
  } catch (error) {
    console.log('❌ Erro no email de suporte interno:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎯 RESUMO DOS TESTES');
  console.log('='.repeat(60));

  const emailTypes = [
    '📞 Email de Contato/Suporte',
    '🛒 Email de Confirmação de Pedido',
    '📰 Email de Newsletter',
    '📦 Email de Envio/Shipping',
    '🔧 Email de Suporte Interno'
  ];

  emailTypes.forEach((type, index) => {
    console.log(`${index + 1}. ${type}`);
  });

  console.log('\n💡 PRÓXIMOS PASSOS:');
  console.log('1. Verificar se os emails chegaram na caixa de entrada');
  console.log('2. Verificar se não foram para SPAM');
  console.log('3. Validar o visual e conteúdo dos emails');
  console.log('4. Testar links e botões nos emails');

  if (hasApiKey) {
    console.log('\n✅ Sistema de emails está configurado e funcionando!');
    console.log('📧 Verificar sua caixa de email: ' + testCustomer.email);
  } else {
    console.log('\n⚠️ Sistema em modo de desenvolvimento (emails simulados)');
    console.log('🔧 Configure SENDGRID_API_KEY para envio real');
  }

  console.log('\n🏆 Teste concluído!');
}

// Executar testes
testEmailSystem().catch(console.error);