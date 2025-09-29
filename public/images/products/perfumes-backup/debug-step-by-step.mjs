#!/usr/bin/env node

/**
 * Debug Passo a Passo
 * Vamos reproduzir EXATAMENTE o que você está fazendo
 */

import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:3001';

async function debugStepByStep() {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();

    // Logs completos
    page.on('console', msg => {
      console.log(`🔍 BROWSER: ${msg.text()}`);
    });

    console.log('🚀 INICIANDO DEBUG PASSO A PASSO');
    console.log('📌 Siga exatamente estes passos no navegador que abriu:');
    console.log('');

    // 1. Carregar página inicial
    console.log('1️⃣ Carregando página inicial...');
    await page.goto(BASE_URL);
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('✅ AGORA FAÇA VOCÊ MESMO:');
    console.log('  → Vá para qualquer página de produtos');
    console.log('  → Adicione um item ao carrinho');
    console.log('  → Vá para /checkout');
    console.log('  → Preencha todos os dados');
    console.log('  → Clique em "Finalizar Pedido"');
    console.log('');
    console.log('🔍 Observe os logs do console no DevTools...');
    console.log('📸 Se der erro, me diga EXATAMENTE quando acontece');

    // Monitorar mudanças no localStorage
    await page.evaluateOnNewDocument(() => {
      const originalSetItem = localStorage.setItem;
      const originalGetItem = localStorage.getItem;
      const originalRemoveItem = localStorage.removeItem;

      localStorage.setItem = function(key, value) {
        if (key === 'jc-cart-storage-manual') {
          console.log('🔄 LOCALSTORAGE SET:', key, JSON.parse(value || '[]').length, 'items');
        }
        return originalSetItem.apply(this, arguments);
      };

      localStorage.getItem = function(key) {
        const result = originalGetItem.apply(this, arguments);
        if (key === 'jc-cart-storage-manual' && result) {
          console.log('📖 LOCALSTORAGE GET:', key, JSON.parse(result).length, 'items');
        }
        return result;
      };

      localStorage.removeItem = function(key) {
        if (key === 'jc-cart-storage-manual') {
          console.log('🗑️ LOCALSTORAGE REMOVE:', key);
        }
        return originalRemoveItem.apply(this, arguments);
      };
    });

    // Monitorar navegação
    page.on('framenavigated', frame => {
      if (frame === page.mainFrame()) {
        console.log(`🌐 NAVEGOU PARA: ${frame.url()}`);
      }
    });

    // Aguardar indefinidamente para debug manual
    console.log('⏰ Navegador permanecerá aberto para debug...');
    console.log('   Pressione Ctrl+C quando terminar');

    await new Promise(() => {}); // Never resolves

  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
  }
}

debugStepByStep().catch(console.error);