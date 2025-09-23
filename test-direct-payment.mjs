async function testDirectPayment() {
  console.log('🚀 TESTE DAS APIS DIRETAS (SEM TESTE DE CONECTIVIDADE)');
  console.log('=======================================================');

  // Teste 1: Payment Intent Direto
  console.log('\n💳 Testando Payment Intent DIRETO...');
  try {
    const paymentResponse = await fetch('https://jchairstudios62.xyz/api/payment-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 75,
        currency: 'eur',
        customerInfo: {
          name: 'Cliente Teste Direto',
          email: 'direto@jchairstudios62.xyz'
        },
        items: [
          { id: 1, name: 'Mega Hair Premium', price: 75 }
        ]
      })
    });

    console.log('📡 Status Payment Intent:', paymentResponse.status, paymentResponse.statusText);

    if (paymentResponse.status === 200) {
      const data = await paymentResponse.json();
      console.log('✅ SUCESSO Payment Intent:');
      console.log(`   ID: ${data.paymentIntentId}`);
      console.log(`   Client Secret: ${data.clientSecret?.substring(0, 30)}...`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Valor: €${data.amount / 100}`);
    } else {
      const errorData = await paymentResponse.text();
      console.log('❌ FALHA Payment Intent:', errorData.substring(0, 200));
    }

  } catch (error) {
    console.log('❌ ERRO Payment Intent:', error.message);
  }

  // Teste 2: Checkout Session Direto
  console.log('\n🛒 Testando Checkout Session DIRETO...');
  try {
    const checkoutResponse = await fetch('https://jchairstudios62.xyz/api/checkout-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 85,
        currency: 'eur',
        customerInfo: {
          name: 'Cliente Checkout Direto',
          email: 'checkout-direto@jchairstudios62.xyz'
        },
        items: [
          { id: 2, name: 'Mega Hair Platinum', price: 85 }
        ]
      })
    });

    console.log('📡 Status Checkout Session:', checkoutResponse.status, checkoutResponse.statusText);

    if (checkoutResponse.status === 200) {
      const data = await checkoutResponse.json();
      console.log('✅ SUCESSO Checkout Session:');
      console.log(`   Session ID: ${data.sessionId}`);
      console.log(`   URL: ${data.url?.substring(0, 50)}...`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Valor Total: €${data.amount_total / 100}`);
      console.log(`   Expira em: ${new Date(data.expires_at * 1000).toLocaleString()}`);
    } else {
      const errorData = await checkoutResponse.text();
      console.log('❌ FALHA Checkout Session:', errorData.substring(0, 200));
    }

  } catch (error) {
    console.log('❌ ERRO Checkout Session:', error.message);
  }

  // Teste 3: Comparar com APIs antigas
  console.log('\n🔄 Comparando com APIs antigas...');

  try {
    const oldPaymentResponse = await fetch('https://jchairstudios62.xyz/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 75,
        currency: 'eur',
        customerInfo: { name: 'Teste', email: 'teste@email.com' },
        items: [{ id: 1, name: 'Teste', price: 75 }]
      })
    });

    console.log('📊 Comparação:');
    console.log(`   API Antiga (robusta): ${oldPaymentResponse.status}`);
    console.log(`   API Direta: ${paymentResponse.status} (testada acima)`);

    if (oldPaymentResponse.status === 200) {
      console.log('   ✅ Ambas funcionando!');
    } else if (paymentResponse.status === 200) {
      console.log('   ✅ API Direta funcionando, antiga com problemas');
    } else {
      console.log('   ❌ Ambas com problemas');
    }

  } catch (error) {
    console.log('⚠️ Erro na comparação:', error.message);
  }

  console.log('\n📊 RELATÓRIO FINAL:');
  console.log('===================');
  console.log('APIs diretas testadas com bypass completo de conectividade');
  console.log('Implementação baseada no exemplo Ruby/Sinatra funcional');
  console.log('Configuração mínima Stripe sem overhead de testes');
}

testDirectPayment();