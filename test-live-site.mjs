import puppeteer from 'puppeteer';

async function testLiveSite() {
  console.log('🔍 Testando site ao vivo: https://jchairstudios62.xyz');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Capturar erros do console
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log('❌ Console Error:', msg.text());
      }
    });

    // Capturar erros de rede
    const networkErrors = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        networkErrors.push(`${response.status()} - ${response.url()}`);
        console.log('🌐 Network Error:', response.status(), response.url());
      }
    });

    // Capturar erros JavaScript
    const jsErrors = [];
    page.on('pageerror', error => {
      jsErrors.push(error.message);
      console.log('🚨 JavaScript Error:', error.message);
    });

    console.log('📱 Navegando para a página principal...');
    await page.goto('https://jchairstudios62.xyz', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('✅ Página principal carregada');

    // Testar página mega-hair
    console.log('🔄 Testando página mega-hair...');
    await page.goto('https://jchairstudios62.xyz/mega-hair', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Aguardar um pouco para JavaScript carregar
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Tentar clicar em um botão "Adicionar ao Carrinho"
    console.log('🛒 Testando funcionalidade do carrinho...');

    try {
      const addToCartButtons = await page.$$('button[class*="bg-gray-900"], button[class*="bg-rose-600"]');

      if (addToCartButtons.length > 0) {
        console.log(`✅ Encontrados ${addToCartButtons.length} botões de adicionar ao carrinho`);

        // Tentar clicar no primeiro botão
        await addToCartButtons[0].click();
        console.log('🖱️ Cliquei no primeiro botão "Adicionar ao Carrinho"');

        // Aguardar um pouco para ver se há erros
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log('⚠️ Nenhum botão de adicionar ao carrinho encontrado');
      }
    } catch (error) {
      console.log('❌ Erro ao testar carrinho:', error.message);
    }

    // Relatório final
    console.log('\n📊 RELATÓRIO FINAL:');
    console.log('==================');
    console.log(`❌ Erros do Console: ${consoleErrors.length}`);
    consoleErrors.forEach(error => console.log(`   - ${error}`));

    console.log(`🌐 Erros de Rede: ${networkErrors.length}`);
    networkErrors.forEach(error => console.log(`   - ${error}`));

    console.log(`🚨 Erros JavaScript: ${jsErrors.length}`);
    jsErrors.forEach(error => console.log(`   - ${error}`));

    if (consoleErrors.length === 0 && networkErrors.length === 0 && jsErrors.length === 0) {
      console.log('✅ Site está funcionando corretamente!');
    } else {
      console.log('⚠️ Foram encontrados problemas que precisam ser corrigidos');
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await browser.close();
  }
}

testLiveSite();