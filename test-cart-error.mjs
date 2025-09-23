import puppeteer from 'puppeteer';

async function testCartError() {
  console.log('🔍 Testando erro específico do carrinho...');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Capturar todos os erros
    const allErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        allErrors.push(msg.text());
        console.log('❌ Console Error:', msg.text());

        // Verificar se é o erro específico do carrinho
        if (msg.text().includes('cart is not defined') ||
            msg.text().includes('isInCart') ||
            msg.text().includes('ReferenceError')) {
          console.log('🚨 ERRO DO CARRINHO DETECTADO:', msg.text());
        }
      }
    });

    page.on('pageerror', error => {
      allErrors.push(error.message);
      console.log('🚨 JavaScript Error:', error.message);

      if (error.message.includes('cart') || error.message.includes('isInCart')) {
        console.log('🚨 ERRO DO CARRINHO DETECTADO:', error.message);
      }
    });

    console.log('📱 Navegando para mega-hair...');
    await page.goto('https://jchairstudios62.xyz/mega-hair', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Aguardar JavaScript carregar completamente
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('🛒 Testando múltiplos botões do carrinho...');

    // Tentar clicar em vários botões diferentes
    for (let i = 0; i < 3; i++) {
      try {
        const buttons = await page.$$('button[class*="bg-gray-900"], button[class*="bg-rose-600"]');
        if (buttons[i]) {
          console.log(`🖱️ Clicando no botão ${i + 1}...`);
          await buttons[i].click();
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.log(`❌ Erro ao clicar no botão ${i + 1}:`, error.message);
      }
    }

    // Testar filtros também
    console.log('🔧 Testando filtros...');
    try {
      const filterButtons = await page.$$('button[class*="bg-rose-600"]');
      if (filterButtons.length > 0) {
        await filterButtons[0].click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.log('❌ Erro ao testar filtros:', error.message);
    }

    // Verificar se há elementos com erro no DOM
    const errorElements = await page.evaluate(() => {
      const errors = [];
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(script => {
        if (script.src.includes('chunk') || script.src.includes('app')) {
          errors.push(`Script: ${script.src}`);
        }
      });
      return errors;
    });

    console.log('\n📊 ANÁLISE COMPLETA:');
    console.log('====================');
    console.log(`Total de erros: ${allErrors.length}`);

    if (allErrors.length === 0) {
      console.log('✅ NENHUM ERRO DE CARRINHO ENCONTRADO!');
      console.log('✅ O problema parece estar resolvido!');
    } else {
      console.log('❌ Erros encontrados:');
      allErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    console.log('\n📦 Scripts carregados:');
    errorElements.forEach(script => console.log(`   - ${script}`));

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await browser.close();
  }
}

testCartError();