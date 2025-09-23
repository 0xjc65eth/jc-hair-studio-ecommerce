async function testMinimalPayment() {
  console.log('🚀 TESTE ULTRA-MINIMAL (CONFIGURAÇÃO ZERO)');
  console.log('=============================================');

  // Teste 1: Payment Intent Minimal
  console.log('\n💳 Testando Payment Intent MINIMAL...');
  try {
    const paymentResponse = await fetch('https://jchairstudios62.xyz/api/payment-minimal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 50,
        currency: 'eur',
        customerInfo: {
          name: 'Teste Minimal',
          email: 'minimal@jchairstudios62.xyz'
        }
      })
    });

    console.log('📡 Status Payment Minimal:', paymentResponse.status, paymentResponse.statusText);

    if (paymentResponse.status === 200) {
      const data = await paymentResponse.json();
      console.log('✅ SUCESSO Payment Minimal:');
      console.log(`   ID: ${data.paymentIntentId}`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Client Secret: ${data.clientSecret?.substring(0, 30)}...`);
    } else {
      const errorData = await paymentResponse.text();
      console.log('❌ FALHA Payment Minimal:', errorData.substring(0, 300));
    }

  } catch (error) {
    console.log('❌ ERRO Payment Minimal:', error.message);
  }

  // Teste 2: Checkout Session Minimal
  console.log('\n🛒 Testando Checkout Session MINIMAL...');
  try {
    const checkoutResponse = await fetch('https://jchairstudios62.xyz/api/checkout-minimal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 60,
        currency: 'eur',
        customerInfo: {
          name: 'Teste Checkout Minimal',
          email: 'checkout-minimal@jchairstudios62.xyz'
        }
      })
    });

    console.log('📡 Status Checkout Minimal:', checkoutResponse.status, checkoutResponse.statusText);

    if (checkoutResponse.status === 200) {
      const data = await checkoutResponse.json();
      console.log('✅ SUCESSO Checkout Minimal:');
      console.log(`   Session ID: ${data.sessionId}`);
      console.log(`   URL: ${data.url?.substring(0, 50)}...`);
      console.log(`   Status: ${data.status}`);
    } else {
      const errorData = await checkoutResponse.text();
      console.log('❌ FALHA Checkout Minimal:', errorData.substring(0, 300));
    }

  } catch (error) {
    console.log('❌ ERRO Checkout Minimal:', error.message);
  }

  console.log('\n📊 RELATÓRIO MINIMAL:');
  console.log('=====================');
  console.log('Configuração ultra-minimal implementada');
  console.log('Zero configurações extras no Stripe');
  console.log('Apenas campos obrigatórios utilizados');
  console.log('Sem retries, sem timeouts customizados');
}

testMinimalPayment();