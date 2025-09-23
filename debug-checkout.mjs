#!/usr/bin/env node

/**
 * Debug Rápido do Checkout
 * Use este comando para debug manual: node debug-checkout.mjs
 */

import puppeteer from 'puppeteer';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

async function debugCheckout() {
  console.log('🔍 DEBUG CHECKOUT - Verificação Rápida');

  const browser = await puppeteer.launch({
    headless: false,
    devtools: true, // Abre DevTools automaticamente
    defaultViewport: { width: 1280, height: 720 }
  });

  const page = await browser.newPage();

  // Logs detalhados
  page.on('console', msg => {
    if (msg.text().includes('🛒') || msg.text().includes('CHECKOUT') || msg.text().includes('CART')) {
      console.log(`🔍 ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`❌ JavaScript Error: ${error.message}`);
  });

  try {
    // 1. Ir direto para checkout SEM itens (teste baseline)
    console.log('1️⃣ Testando checkout vazio primeiro...');
    await page.goto(`${BASE_URL}/checkout`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    let content = await page.content();
    if (content.includes('Carrinho Vazio')) {
      console.log('✅ Checkout vazio mostra "Carrinho Vazio" corretamente');
    }

    // 2. Adicionar item via cosméticos
    console.log('2️⃣ Adicionando produto via cosméticos...');
    await page.goto(`${BASE_URL}/cosmeticos`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    const buttons = await page.$$('button[class*="bg-gradient-to-r"]');
    if (buttons.length > 0) {
      await buttons[0].click();
      console.log(`✅ Clicou em Comprar (${buttons.length} botões)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 3. Verificar localStorage
    const cartData = await page.evaluate(() => {
      return localStorage.getItem('jc-cart-storage-manual');
    });
    console.log('3️⃣ LocalStorage:', cartData ? `${JSON.parse(cartData).length} itens` : 'vazio');

    // 4. Ir para checkout com itens
    console.log('4️⃣ Indo para checkout com itens...');
    await page.goto(`${BASE_URL}/checkout`);
    await new Promise(resolve => setTimeout(resolve, 5000));

    content = await page.content();
    if (content.includes('Carrinho Vazio')) {
      console.log('❌ ERRO: Checkout mostra "Carrinho Vazio" com itens presentes!');

      // Screenshot do erro
      await page.screenshot({ path: 'erro-checkout.png', fullPage: true });
      console.log('📸 Screenshot salvo: erro-checkout.png');

    } else {
      console.log('✅ Checkout mostra formulário corretamente');
    }

    // 5. Teste outras páginas
    console.log('5️⃣ Testando outras páginas...');

    const testPages = [
      '/mega-hair',
      '/produtos',
      '/tratamentos-capilares'
    ];

    for (const pagePath of testPages) {
      console.log(`📄 Testando ${pagePath}...`);
      await page.goto(`${BASE_URL}${pagePath}`);
      await new Promise(resolve => setTimeout(resolve, 2000));

      const buyButtons = await page.$$('button[class*="bg-gradient"], button:contains("Comprar"), button:contains("Adicionar")');
      console.log(`   - ${buyButtons.length} botões encontrados`);
    }

    console.log('✅ Debug completo - navegador permanece aberto para inspeção manual');
    console.log('🔍 Use as DevTools para investigar problemas específicos');
    console.log('⚠️  Pressione Ctrl+C para fechar quando terminar');

    // Manter aberto indefinidamente para debug manual
    await new Promise(() => {}); // Never resolves - keeps browser open

  } catch (error) {
    console.log(`❌ Erro no debug: ${error.message}`);
    await page.screenshot({ path: 'debug-error.png', fullPage: true });
  }
}

debugCheckout().catch(console.error);