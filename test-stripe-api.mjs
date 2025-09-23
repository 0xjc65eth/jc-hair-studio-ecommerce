async function testStripeAPI() {
  console.log('🔧 Testando API do Stripe diretamente...');

  try {
    const response = await fetch('https://jchairstudios62.xyz/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 50,
        currency: 'eur',
        customerInfo: {
          name: 'Teste Cliente',
          email: 'teste@email.com'
        },
        items: [
          { id: 1, name: 'Produto Teste', price: 50 }
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
      console.log('✅ API funcionando! Payment Intent criado com sucesso');
      if (data && data.clientSecret) {
        console.log('🔑 Client Secret gerado:', data.clientSecret.substring(0, 20) + '...');
      }
    } else if (response.status === 503) {
      console.log('❌ Serviço indisponível - problema de conectividade com Stripe');
    } else if (response.status === 500) {
      console.log('❌ Erro interno - problema de configuração');
    } else {
      console.log('⚠️ Status inesperado:', response.status);
    }

  } catch (error) {
    console.error('❌ Erro na requisição:', error);
  }
}

// Testar também a saúde da API
async function testHealthAPI() {
  console.log('\n🏥 Testando API de saúde...');

  try {
    const response = await fetch('https://jchairstudios62.xyz/api/health');
    console.log('📡 Health API Status:', response.status);

    if (response.ok) {
      const data = await response.text();
      console.log('📄 Health Response:', data);
    }
  } catch (error) {
    console.log('❌ Erro na API de saúde:', error.message);
  }
}

console.log('🔍 TESTE COMPLETO DA API DE PAGAMENTO');
console.log('=====================================');

await testStripeAPI();
await testHealthAPI();