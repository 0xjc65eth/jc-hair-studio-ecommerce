#!/usr/bin/env node

/**
 * Teste Completo do Fluxo de Checkout
 * Simula exatamente o que o usuário está fazendo:
 * 1. Página final de qualquer item
 * 2. Adicionar ao carrinho
 * 3. Dados pessoais
 * 4. Endereço
 * 5. Pagamento com cartão
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

async function testCompleteCheckoutFlow() {
  const browser = await puppeteer.launch({
    headless: false, // Visível para debug
    defaultViewport: { width: 1280, height: 720 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security', // Para simular Brave
      '--disable-features=VizDisplayCompositor'
    ],
    executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser', // Tenta usar Brave se disponível
  });

  try {
    const page = await browser.newPage();

    // Capturar todos os console logs
    page.on('console', msg => {
      if (msg.text().includes('🛒') || msg.text().includes('CHECKOUT') || msg.text().includes('vazio') || msg.text().includes('empty')) {
        console.log(`🔍 Browser: ${msg.text()}`);
      }
    });

    // Capturar erros
    page.on('pageerror', error => {
      log.error(`JavaScript Error: ${error.message}`);
    });

    log.info('🚀 TESTE COMPLETO - Fluxo até Pagamento com Cartão');
    log.info('🌐 Simulando comportamento do Brave Browser');

    // ETAPA 1: Ir para uma página de produto específico
    log.info('1️⃣ Navegando para página de produto específico...');
    await page.goto(`${BASE_URL}/cosmeticos`, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // ETAPA 2: Adicionar item ao carrinho
    log.info('2️⃣ Adicionando item ao carrinho...');
    const buyButtons = await page.$$('button[class*="bg-gradient-to-r"]');
    if (buyButtons.length > 0) {
      await buyButtons[0].click();
      log.success(`Item adicionado (${buyButtons.length} botões encontrados)`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      throw new Error('Nenhum botão Comprar encontrado');
    }

    // Verificar se carrinho abriu
    const cartDrawer = await page.$('[class*="translate-x-0"]');
    if (cartDrawer) {
      log.success('Carrinho drawer abriu');
      // Fechar carrinho para continuar
      const closeButton = await page.$('button[aria-label="Fechar carrinho"]');
      if (closeButton) {
        await closeButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // ETAPA 3: Verificar localStorage
    const cartData = await page.evaluate(() => {
      const stored = localStorage.getItem('jc-cart-storage-manual');
      return stored ? JSON.parse(stored) : null;
    });

    if (!cartData || cartData.length === 0) {
      throw new Error('Item não foi salvo no localStorage');
    }
    log.success(`📦 Item salvo no localStorage: ${cartData[0].product.name}`);

    // ETAPA 4: Ir para checkout
    log.info('3️⃣ Navegando para checkout...');
    await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 8000)); // Aguardar carregamento completo

    // ETAPA 5: Verificar se mostra "Carrinho Vazio"
    const pageContent = await page.content();
    if (pageContent.includes('Carrinho Vazio') || pageContent.includes('carrinho está vazio')) {
      log.error('❌ ERRO CRÍTICO: Checkout mostra "Carrinho Vazio"!');

      // Screenshot do erro
      await page.screenshot({
        path: '/Users/juliocesar/Jc-hair-studio\'s 62  ecommerce/jc-hair-studio/erro-checkout-completo.png',
        fullPage: true
      });

      throw new Error('Checkout mostra carrinho vazio na etapa de dados pessoais');
    }

    log.success('✅ Checkout não mostra erro "Carrinho Vazio"');

    // ETAPA 6: Preencher dados pessoais
    log.info('4️⃣ Preenchendo dados pessoais...');

    // Preencher nome
    const nameInput = await page.$('input[type="text"]');
    if (nameInput) {
      await nameInput.type('João Silva');
      log.success('Nome preenchido');
    }

    // Preencher email
    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      await emailInput.type('joao@teste.com');
      log.success('Email preenchido');
    }

    // Preencher telefone
    const phoneInputs = await page.$$('input[type="tel"]');
    if (phoneInputs.length > 0) {
      await phoneInputs[0].type('+351912345678');
      log.success('Telefone preenchido');
    }

    // ETAPA 7: Preencher endereço
    log.info('5️⃣ Preenchendo endereço...');

    // CEP
    const zipInput = await page.$('input[placeholder*="1000"]');
    if (zipInput) {
      await zipInput.type('1000-001');
    }

    // Rua
    const streetInputs = await page.$$('input[placeholder*="rua"]');
    if (streetInputs.length > 0) {
      await streetInputs[0].type('Rua das Flores');
    }

    // Número
    const numberInputs = await page.$$('input[placeholder*="123"]');
    if (numberInputs.length > 0) {
      await numberInputs[0].type('123');
    }

    // Bairro
    const neighborhoodInputs = await page.$$('input[placeholder*="bairro"]');
    if (neighborhoodInputs.length > 0) {
      await neighborhoodInputs[0].type('Centro');
    }

    // Cidade
    const cityInputs = await page.$$('input[placeholder*="cidade"]');
    if (cityInputs.length > 0) {
      await cityInputs[0].type('Lisboa');
    }

    // Estado
    const stateInputs = await page.$$('input[placeholder*="Estado"]');
    if (stateInputs.length > 0) {
      await stateInputs[0].type('Lisboa');
    }

    log.success('Endereço preenchido');

    // ETAPA 8: Avançar para pagamento
    log.info('6️⃣ Avançando para etapa de pagamento...');

    // Encontrar botão "Continuar para Pagamento" por texto
    const continueButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(button => button.textContent.includes('Continuar para Pagamento'));
    });

    if (continueButton.asElement()) {
      await continueButton.asElement().click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      log.success('Avançou para etapa de pagamento');
    } else {
      // Tentar encontrar qualquer botão de submit/continue
      const submitButtons = await page.$$('button[type="submit"], button:contains("Continuar")');
      if (submitButtons.length > 0) {
        await submitButtons[0].click();
        log.warning('Clicou em botão alternativo para continuar');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        throw new Error('Nenhum botão de continuar encontrado');
      }
    }

    // ETAPA 9: Verificar se ainda funciona na etapa de pagamento
    const paymentContent = await page.content();
    if (paymentContent.includes('Carrinho Vazio') || paymentContent.includes('carrinho está vazio')) {
      log.error('❌ ERRO NA ETAPA DE PAGAMENTO: Mostra "Carrinho Vazio"!');

      await page.screenshot({
        path: '/Users/juliocesar/Jc-hair-studio\'s 62  ecommerce/jc-hair-studio/erro-pagamento.png',
        fullPage: true
      });

      throw new Error('Erro na etapa de pagamento - carrinho vazio');
    }

    // ETAPA 10: Selecionar cartão de crédito
    log.info('7️⃣ Selecionando cartão de crédito...');

    // Encontrar opção de cartão de crédito
    const creditCardOption = await page.evaluateHandle(() => {
      const elements = Array.from(document.querySelectorAll('div, button, label'));
      return elements.find(el => el.textContent.includes('Cartão de Crédito'));
    });

    if (creditCardOption.asElement()) {
      await creditCardOption.asElement().click();
      log.success('Cartão de crédito selecionado');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      log.warning('Opção cartão de crédito não encontrada');
    }

    // ETAPA 11: Verificar carrinho final antes do pagamento
    const finalContent = await page.content();
    if (finalContent.includes('Carrinho Vazio') || finalContent.includes('carrinho está vazio')) {
      log.error('❌ ERRO FINAL: Carrinho vazio antes do pagamento!');
      throw new Error('Erro final - carrinho vazio antes do pagamento');
    }

    // ETAPA 12: Tentar finalizar
    log.info('8️⃣ Tentando finalizar pedido...');

    // Encontrar botão finalizar
    const finalizeButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(button =>
        button.textContent.includes('Finalizar Pedido') ||
        button.textContent.includes('Finalizar') ||
        button.textContent.includes('Processar')
      );
    });

    if (finalizeButton.asElement()) {
      await finalizeButton.asElement().click();
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Verificar se processou ou se deu erro
      const processedContent = await page.content();
      if (processedContent.includes('Pedido Confirmado') || processedContent.includes('Processando')) {
        log.success('🎉 PEDIDO PROCESSADO COM SUCESSO!');
      } else if (processedContent.includes('Carrinho Vazio')) {
        log.error('❌ ERRO FINAL: Carrinho foi limpo durante processamento!');
        throw new Error('Carrinho foi limpo durante o processamento');
      } else {
        log.warning('⚠️ Status do pedido incerto');
      }
    } else {
      log.warning('Botão finalizar não encontrado');
    }

    log.success('🎉 TESTE COMPLETO FINALIZADO');
    log.info('💡 Mantendo navegador aberto para inspeção...');

    // Manter aberto para inspeção
    await new Promise(resolve => setTimeout(resolve, 30000));

  } catch (error) {
    log.error(`TESTE FALHOU: ${error.message}`);

    // Screenshot do erro
    await page.screenshot({
      path: '/Users/juliocesar/Jc-hair-studio\'s 62  ecommerce/jc-hair-studio/erro-fluxo-completo.png',
      fullPage: true
    });

    log.info('📸 Screenshot do erro salvo');
    throw error;
  } finally {
    await browser.close();
  }
}

// Executar teste
(async () => {
  try {
    await testCompleteCheckoutFlow();
    process.exit(0);
  } catch (error) {
    log.error(`ERRO FINAL: ${error.message}`);
    process.exit(1);
  }
})();