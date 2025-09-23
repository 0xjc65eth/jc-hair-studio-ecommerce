async function testCheckoutSession() {
  console.log('🛒 Testando Checkout Session (método do exemplo funcional)...');

  try {
    const response = await fetch('https://jchairstudios62.xyz/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 75,
        currency: 'eur',
        customerInfo: {
          name: 'Cliente Teste',
          email: 'teste@jchairstudios62.xyz'
        },
        items: [
          { id: 1, name: 'Mega Hair Premium', price: 75 }
        ]
      })
    });

    console.log('📡 Status da resposta:', response.status, response.statusText);

    const responseText = await response.text();
    console.log('📄 Resposta completa:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('📊 Dados parseados:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('⚠️ Resposta não é JSON válido');
    }

    if (response.status === 200) {
      console.log('✅ 🎉 CHECKOUT SESSION CRIADA COM SUCESSO!');
      if (data && data.url) {
        console.log('🔗 URL do Checkout:', data.url);
        console.log('🆔 Session ID:', data.sessionId);
      }
    } else {
      console.log('❌ Falha na criação da sessão');
    }

  } catch (error) {
    console.error('❌ Erro na requisição:', error);
  }
}

// Também testar a antiga API para comparar
async function testOldPaymentIntent() {
  console.log('\n💳 Testando API antiga (Payment Intent) para comparação...');

  try {
    const response = await fetch('https://jchairstudios62.xyz/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 75,
        currency: 'eur',
        customerInfo: {
          name: 'Cliente Teste',
          email: 'teste@jchairstudios62.xyz'
        },
        items: [
          { id: 1, name: 'Mega Hair Premium', price: 75 }
        ]
      })
    });

    console.log('📡 Status da resposta (Payment Intent):', response.status);
    const data = await response.text();
    console.log('📄 Resposta:', data.substring(0, 200) + '...');

  } catch (error) {
    console.error('❌ Erro na API antiga:', error.message);
  }
}

console.log('🔍 TESTE COMPARATIVO - CHECKOUT VS PAYMENT INTENT');
console.log('==================================================');

await testCheckoutSession();
await testOldPaymentIntent();