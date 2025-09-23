#!/usr/bin/env node

/**
 * Teste Real do Fluxo do Usuário
 * Simula exatamente o que um usuário real faria
 */

import puppeteer from 'puppeteer';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`)
};

async function testRealUserFlow() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Capturar todos os console logs para debug
    page.on('console', msg => {
      console.log(`🌐 Browser: ${msg.text()}`);
    });

    // Capturar erros de JavaScript
    page.on('pageerror', error => {
      log.error(`JavaScript Error: ${error.message}`);
    });

    log.info('🚀 Testando Fluxo Real do Usuário');

    // 1. Começar na página inicial
    log.info('📄 1. Carregando página inicial...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Navegar para cosméticos
    log.info('🎨 2. Navegando para cosméticos...');
    await page.goto(`${BASE_URL}/cosmeticos`, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 3. Adicionar produto ao carrinho
    log.info('🛒 3. Clicando em Comprar...');
    const buyButtons = await page.$$('button[class*="bg-gradient-to-r"]');
    if (buyButtons.length > 0) {
      await buyButtons[0].click();
      log.success(`Clicou no botão Comprar (${buyButtons.length} botões encontrados)`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      throw new Error('Nenhum botão Comprar encontrado');
    }

    // 4. Verificar se o carrinho abriu
    log.info('🔍 4. Verificando se carrinho abriu...');
    const cartDrawer = await page.$('[class*="translate-x-0"]');
    if (cartDrawer) {
      log.success('Carrinho drawer abriu automaticamente');
    } else {
      log.warning('Carrinho drawer não abriu, tentando abrir manualmente...');
    }

    // 5. Verificar localStorage
    const localStorage = await page.evaluate(() => {
      const cartData = localStorage.getItem('jc-cart-storage-manual');
      return cartData ? JSON.parse(cartData) : null;
    });

    if (localStorage && localStorage.length > 0) {
      log.success(`📦 LocalStorage: ${localStorage.length} item(s) salvos`);
      log.info(`📝 Produto: ${localStorage[0].product.name}`);
    } else {
      log.error('❌ LocalStorage vazio - erro na adição do produto');
      throw new Error('Produto não foi adicionado ao localStorage');
    }

    // 6. Tentar ir direto para checkout via URL
    log.info('🏁 5. Navegando DIRETAMENTE para checkout...');
    await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 5000)); // Esperar 5 segundos

    // 7. Verificar se mostra erro "Carrinho Vazio"
    log.info('🔍 6. Verificando se checkout mostra "Carrinho Vazio"...');

    const pageContent = await page.content();

    if (pageContent.includes('Carrinho Vazio') || pageContent.includes('carrinho está vazio')) {
      log.error('❌ ERRO ENCONTRADO: Checkout mostra "Carrinho Vazio"');
      log.error('❌ RACE CONDITION ainda existe!');

      // Capturar screenshot do erro
      await page.screenshot({
        path: '/Users/juliocesar/Jc-hair-studio\'s 62  ecommerce/jc-hair-studio/checkout-error.png',
        fullPage: true
      });
      log.info('📸 Screenshot salvo como checkout-error.png');

      throw new Error('Checkout mostra carrinho vazio mesmo com itens');
    } else {
      log.success('✅ Checkout NÃO mostra erro "Carrinho Vazio"');
    }

    // 8. Verificar se formulário aparece
    const nameInput = await page.$('input[type="text"]');
    const emailInput = await page.$('input[type="email"]');

    if (nameInput && emailInput) {
      log.success('📋 Formulário de checkout visível');
    } else {
      log.warning('⚠️ Formulário não encontrado');
    }

    // 9. Testar recarregar a página
    log.info('🔄 7. Testando recarga da página...');
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 5000));

    const reloadContent = await page.content();
    if (reloadContent.includes('Carrinho Vazio') || reloadContent.includes('carrinho está vazio')) {
      log.error('❌ ERRO: Após reload, checkout mostra "Carrinho Vazio"');
      throw new Error('Erro persiste após reload');
    } else {
      log.success('✅ Após reload, checkout continua funcionando');
    }

    log.success('🎉 TESTE COMPLETO - TUDO FUNCIONANDO!');

    // Manter aberto para verificação visual
    log.info('👀 Mantendo navegador aberto por 15 segundos para verificação...');
    await new Promise(resolve => setTimeout(resolve, 15000));

  } catch (error) {
    log.error(`TESTE FALHOU: ${error.message}`);

    // Capturar screenshot do erro
    await page.screenshot({
      path: '/Users/juliocesar/Jc-hair-studio\'s 62  ecommerce/jc-hair-studio/error-screenshot.png',
      fullPage: true
    });

    throw error;
  } finally {
    await browser.close();
  }
}

// Executar teste
(async () => {
  try {
    await testRealUserFlow();
    process.exit(0);
  } catch (error) {
    log.error(`ERRO FINAL: ${error.message}`);
    process.exit(1);
  }
})();