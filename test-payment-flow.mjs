import puppeteer from 'puppeteer';

async function testPaymentFlow() {
  console.log('💳 Testando fluxo completo de pagamento...');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Capturar erros
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.log('❌ Console Error:', msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
      console.log('🚨 JavaScript Error:', error.message);
    });

    // Interceptar requisições de rede
    const networkRequests = [];
    page.on('request', request => {
      if (request.url().includes('payment') || request.url().includes('stripe')) {
        networkRequests.push({
          url: request.url(),
          method: request.method()
        });
        console.log('🌐 Payment Request:', request.method(), request.url());
      }
    });

    page.on('response', response => {
      if (response.url().includes('payment') || response.url().includes('stripe')) {
        console.log('📡 Payment Response:', response.status(), response.url());
      }
    });

    console.log('🛍️ PASSO 1: Navegando para a loja...');
    await page.goto('https://jchairstudios62.xyz/mega-hair', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🛒 PASSO 2: Adicionando produto ao carrinho...');
    const addToCartButtons = await page.$$('button[class*="bg-gray-900"], button[class*="bg-rose-600"]');

    if (addToCartButtons.length > 0) {
      // Encontrar um botão que não esteja desabilitado
      let buttonClicked = false;
      for (let i = 0; i < Math.min(5, addToCartButtons.length); i++) {
        try {
          const isDisabled = await page.evaluate(button => {
            return button.disabled || button.textContent.includes('Indisponível');
          }, addToCartButtons[i]);

          if (!isDisabled) {
            await addToCartButtons[i].click();
            console.log(`✅ Produto ${i + 1} adicionado ao carrinho`);
            buttonClicked = true;
            break;
          }
        } catch (error) {
          console.log(`⚠️ Erro ao clicar no botão ${i + 1}:`, error.message);
        }
      }

      if (!buttonClicked) {
        console.log('❌ Não foi possível adicionar nenhum produto ao carrinho');
        return;
      }
    } else {
      console.log('❌ Nenhum botão de adicionar ao carrinho encontrado');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('🛒 PASSO 3: Procurando por carrinho ou checkout...');

    // Tentar encontrar botão do carrinho ou link de checkout
    const cartLinks = await page.$$('a[href*="carrinho"], a[href*="checkout"], button[class*="cart"], [class*="cart-drawer"]');

    if (cartLinks.length > 0) {
      console.log(`📦 Encontrados ${cartLinks.length} elementos relacionados ao carrinho`);
      try {
        await cartLinks[0].click();
        console.log('✅ Cliquei no carrinho/checkout');
      } catch (error) {
        console.log('⚠️ Erro ao clicar no carrinho:', error.message);
      }
    } else {
      // Tentar navegar diretamente para checkout
      console.log('🔄 Tentando navegar diretamente para checkout...');
      await page.goto('https://jchairstudios62.xyz/checkout', {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
    }

    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('💳 PASSO 4: Testando página de checkout...');

    // Verificar se chegamos na página de checkout
    const currentUrl = page.url();
    console.log('📍 URL atual:', currentUrl);

    // Procurar por elementos de pagamento
    const paymentElements = await page.$$('[class*="stripe"], [class*="payment"], input[type="email"], form');
    console.log(`💳 Encontrados ${paymentElements.length} elementos relacionados a pagamento`);

    // Testar API de payment intent diretamente
    console.log('🔧 PASSO 5: Testando API de payment intent...');

    try {
      const response = await page.evaluate(async () => {
        const testPayload = {
          amount: 100,
          currency: 'eur',
          customerInfo: {
            name: 'Teste',
            email: 'teste@email.com'
          },
          items: [{ id: 1, name: 'Produto Teste', price: 100 }]
        };

        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testPayload)
        });

        return {
          status: response.status,
          statusText: response.statusText,
          data: await response.text()
        };
      });

      console.log('📡 Resposta da API de Payment Intent:');
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Body: ${response.data}`);

      if (response.status === 200) {
        console.log('✅ API de pagamento funcionando!');
      } else {
        console.log('❌ Problema na API de pagamento');
      }

    } catch (error) {
      console.log('❌ Erro ao testar API:', error.message);
    }

    // Relatório final
    console.log('\n📊 RELATÓRIO DO TESTE DE PAGAMENTO:');
    console.log('=====================================');
    console.log(`❌ Erros encontrados: ${errors.length}`);
    console.log(`🌐 Requisições de pagamento: ${networkRequests.length}`);

    if (errors.length > 0) {
      console.log('\n❌ Erros:');
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    if (networkRequests.length > 0) {
      console.log('\n🌐 Requisições de pagamento:');
      networkRequests.forEach((req, index) => {
        console.log(`   ${index + 1}. ${req.method} ${req.url}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await browser.close();
  }
}

testPaymentFlow();