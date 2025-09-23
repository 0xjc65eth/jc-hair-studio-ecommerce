#!/usr/bin/env node

/**
 * Teste Final de Verificação
 * Testa especificamente o problema do carrinho vazio durante processamento
 */

import puppeteer from 'puppeteer';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

const log = {
  info: (msg) => console.log(`\x1b[34mℹ ${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m✅ ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m❌ ${msg}\x1b[0m`),
  warning: (msg) => console.log(`\x1b[33m⚠️ ${msg}\x1b[0m`)
};

async function testFinalVerification() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Logs específicos para o problema
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('💳') || text.includes('PROCESSING') || text.includes('CLEARING CART') || text.includes('vazio') || text.includes('empty')) {
        console.log(`🔍 ${text}`);
      }
    });

    log.info('🎯 TESTE FINAL - Verificação do Carrinho Durante Processamento');

    // Setup rápido: adicionar item e ir para checkout
    await page.goto(`${BASE_URL}/cosmeticos`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const buyButtons = await page.$$('button[class*="bg-gradient-to-r"]');
    await buyButtons[0].click();
    log.success('Item adicionado');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Ir para checkout
    await page.goto(`${BASE_URL}/checkout`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Preencher formulário rapidamente
    const inputs = await page.$$('input');
    await inputs[0].type('João');
    await inputs[1].type('joao@teste.com');
    await inputs[2].type('912345678');
    await inputs[3].type('1000-001');
    await inputs[4].type('Rua Teste');
    await inputs[5].type('123');
    await inputs[7].type('Centro');
    await inputs[8].type('Lisboa');
    await inputs[9].type('Lisboa');

    log.success('Formulário preenchido');

    // Avançar para pagamento
    const continueBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(button => button.textContent.includes('Continuar'));
    });

    if (continueBtn.asElement()) {
      await continueBtn.asElement().click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      log.success('Avançou para pagamento');
    }

    // Selecionar cartão
    const creditCard = await page.evaluateHandle(() => {
      const elements = Array.from(document.querySelectorAll('div'));
      return elements.find(el => el.textContent.includes('Cartão de Crédito'));
    });

    if (creditCard.asElement()) {
      await creditCard.asElement().click();
      log.success('Cartão selecionado');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // TESTE CRÍTICO: Finalizar pedido e verificar carrinho durante processamento
    log.info('🔥 TESTE CRÍTICO: Iniciando processamento do pedido...');

    const finalizeBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(button => button.textContent.includes('Finalizar'));
    });

    if (finalizeBtn.asElement()) {
      // Verificar carrinho ANTES do clique
      const cartBefore = await page.evaluate(() => {
        const cart = localStorage.getItem('jc-cart-storage-manual');
        return cart ? JSON.parse(cart).length : 0;
      });

      log.info(`Carrinho antes: ${cartBefore} itens`);

      // Clicar finalizar
      await finalizeBtn.asElement().click();
      log.info('Clicou em Finalizar Pedido - Iniciando processamento...');

      // Verificar carrinho DURANTE processamento (após 1 segundo)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const cartDuring = await page.evaluate(() => {
        const cart = localStorage.getItem('jc-cart-storage-manual');
        return cart ? JSON.parse(cart).length : 0;
      });

      log.info(`Carrinho durante processamento (1s): ${cartDuring} itens`);

      if (cartDuring === 0 && cartBefore > 0) {
        log.error('❌ PROBLEMA ENCONTRADO: Carrinho foi limpo DURANTE processamento!');
        throw new Error('Carrinho foi limpo prematuramente');
      } else {
        log.success('✅ Carrinho mantido durante processamento');
      }

      // Aguardar processamento completo
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Verificar se chegou na tela de sucesso
      const content = await page.content();
      if (content.includes('Pedido Confirmado')) {
        log.success('🎉 Pedido processado com sucesso!');

        // Agora o carrinho PODE estar vazio (isso é correto)
        const cartAfter = await page.evaluate(() => {
          const cart = localStorage.getItem('jc-cart-storage-manual');
          return cart ? JSON.parse(cart).length : 0;
        });

        log.info(`Carrinho após sucesso: ${cartAfter} itens (deve estar vazio)`);

        if (cartAfter === 0) {
          log.success('✅ Carrinho corretamente limpo APÓS sucesso');
        }

      } else if (content.includes('Carrinho Vazio')) {
        log.error('❌ ERRO: Mostra "Carrinho Vazio" em vez de processar');
        throw new Error('Erro de carrinho vazio durante processamento');
      }

    } else {
      throw new Error('Botão Finalizar não encontrado');
    }

    log.success('🎯 TESTE COMPLETO - Funcionamento correto verificado!');

    // Manter aberto para inspeção
    await new Promise(resolve => setTimeout(resolve, 15000));

  } catch (error) {
    log.error(`TESTE FALHOU: ${error.message}`);

    // Screenshot para debug
    await page.screenshot({
      path: '/Users/juliocesar/Jc-hair-studio\'s 62  ecommerce/jc-hair-studio/erro-final.png',
      fullPage: true
    });

    throw error;
  } finally {
    await browser.close();
  }
}

// Executar
(async () => {
  try {
    await testFinalVerification();
    log.success('🔥 SUCESSO TOTAL - Erro do carrinho vazio foi RESOLVIDO!');
    process.exit(0);
  } catch (error) {
    log.error(`ERRO CRÍTICO: ${error.message}`);
    process.exit(1);
  }
})();