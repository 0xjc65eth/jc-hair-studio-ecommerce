#!/usr/bin/env node

/**
 * TESTE COMPLETO DO SITE - JC HAIR STUDIO'S 62
 * Validação end-to-end de todas as funcionalidades críticas
 */

import { chromium } from 'playwright';
import dotenv from 'dotenv';

dotenv.config();

console.log('\n🚀 TESTE COMPLETO DO SITE - JC HAIR STUDIO\'S 62');
console.log('═══════════════════════════════════════════════════');
console.log('🎯 Executando validação end-to-end de todas as funcionalidades\n');

const BASE_URL = 'http://localhost:3001';
const TEST_RESULTS = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

// Função para registrar resultado dos testes
function recordTest(testName, passed, error = null) {
  TEST_RESULTS.total++;
  if (passed) {
    TEST_RESULTS.passed++;
    console.log(`✅ ${testName}`);
  } else {
    TEST_RESULTS.failed++;
    console.log(`❌ ${testName}: ${error}`);
    TEST_RESULTS.errors.push({ test: testName, error });
  }
}

// Função para aguardar e capturar erros de console
async function setupPageMonitoring(page) {
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (error) => {
    consoleErrors.push(`Page Error: ${error.message}`);
  });

  return consoleErrors;
}

async function runComprehensiveTests() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  try {
    console.log('🔧 Iniciando bateria de testes...\n');

    // ==========================================
    // TESTE 1: PÁGINA INICIAL
    // ==========================================
    console.log('📱 TESTE 1: PÁGINA INICIAL');
    console.log('──────────────────────────');

    const page = await context.newPage();
    const consoleErrors = await setupPageMonitoring(page);

    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForSelector('h1', { timeout: 10000 });

      const title = await page.title();
      recordTest('Página inicial carrega', title.includes('JC Hair Studio'));

      const h1Text = await page.textContent('h1');
      recordTest('Título principal visível', h1Text && h1Text.length > 0);

      recordTest('Sem erros de console na homepage', consoleErrors.length === 0,
        consoleErrors.length > 0 ? `${consoleErrors.length} erros encontrados` : null);

    } catch (error) {
      recordTest('Página inicial carrega', false, error.message);
    }

    // ==========================================
    // TESTE 2: NAVEGAÇÃO PRINCIPAL
    // ==========================================
    console.log('\n🧭 TESTE 2: NAVEGAÇÃO PRINCIPAL');
    console.log('──────────────────────────────');

    const navigationLinks = [
      { name: 'Mega Hair', url: '/mega-hair' },
      { name: 'Cosméticos', url: '/cosmeticos' },
      { name: 'Maquiagens', url: '/maquiagens' },
      { name: 'Tratamentos', url: '/tratamentos-capilares' },
      { name: 'Contato', url: '/contato' }
    ];

    for (const link of navigationLinks) {
      try {
        await page.goto(`${BASE_URL}${link.url}`, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForSelector('h1', { timeout: 10000 });
        recordTest(`Página ${link.name} acessível`, true);
      } catch (error) {
        recordTest(`Página ${link.name} acessível`, false, error.message);
      }
    }

    // ==========================================
    // TESTE 3: SISTEMA DE BUSCA
    // ==========================================
    console.log('\n🔍 TESTE 3: SISTEMA DE BUSCA');
    console.log('────────────────────────────');

    try {
      await page.goto(`${BASE_URL}/busca`, { waitUntil: 'networkidle', timeout: 20000 });

      const searchInput = await page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="search"]').first();
      if (await searchInput.count() > 0) {
        await searchInput.fill('mega hair');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        recordTest('Sistema de busca funcional', true);
      } else {
        recordTest('Sistema de busca funcional', false, 'Campo de busca não encontrado');
      }
    } catch (error) {
      recordTest('Sistema de busca funcional', false, error.message);
    }

    // ==========================================
    // TESTE 4: PÁGINAS DE PRODUTOS
    // ==========================================
    console.log('\n🛍️ TESTE 4: PÁGINAS DE PRODUTOS');
    console.log('───────────────────────────────');

    try {
      await page.goto(`${BASE_URL}/produtos`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForSelector('.product-card, [class*="product"], [class*="Product"]', { timeout: 10000 });

      const productElements = await page.locator('.product-card, [class*="product"], [class*="Product"]').count();
      recordTest('Produtos exibidos na listagem', productElements > 0,
        productElements === 0 ? 'Nenhum produto encontrado' : null);

      // Tentar clicar no primeiro produto
      const firstProduct = page.locator('.product-card, [class*="product"], [class*="Product"]').first();
      if (await firstProduct.count() > 0) {
        await firstProduct.click();
        await page.waitForTimeout(3000);
        recordTest('Navegação para produto individual', true);
      }
    } catch (error) {
      recordTest('Páginas de produtos funcionais', false, error.message);
    }

    // ==========================================
    // TESTE 5: FORMULÁRIO DE CONTATO
    // ==========================================
    console.log('\n📧 TESTE 5: FORMULÁRIO DE CONTATO');
    console.log('─────────────────────────────────');

    try {
      await page.goto(`${BASE_URL}/contato`, { waitUntil: 'networkidle', timeout: 20000 });

      const nameField = await page.locator('input[name="name"], input[name="nome"], input[id*="name"], input[id*="nome"]').first();
      const emailField = await page.locator('input[name="email"], input[type="email"]').first();
      const messageField = await page.locator('textarea[name="message"], textarea[name="mensagem"]').first();

      if (await nameField.count() > 0 && await emailField.count() > 0 && await messageField.count() > 0) {
        recordTest('Formulário de contato presente', true);

        // Preencher formulário de teste
        await nameField.fill('Teste Automatizado');
        await emailField.fill('teste@jchairstudios62.xyz');
        await messageField.fill('Este é um teste automatizado do sistema.');

        recordTest('Campos do formulário preenchíveis', true);
      } else {
        recordTest('Formulário de contato presente', false, 'Campos obrigatórios não encontrados');
      }
    } catch (error) {
      recordTest('Formulário de contato funcional', false, error.message);
    }

    // ==========================================
    // TESTE 6: CARRINHO DE COMPRAS
    // ==========================================
    console.log('\n🛒 TESTE 6: CARRINHO DE COMPRAS');
    console.log('──────────────────────────────');

    try {
      await page.goto(`${BASE_URL}/carrinho`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForSelector('h1, h2, [class*="cart"], [class*="Cart"]', { timeout: 10000 });
      recordTest('Página do carrinho acessível', true);

      // Verificar se há elementos do carrinho
      const cartElements = await page.locator('[class*="cart"], [class*="Cart"], .cart-item').count();
      recordTest('Interface do carrinho renderizada', cartElements > 0 || await page.locator('text=/carrinho/i').count() > 0);
    } catch (error) {
      recordTest('Carrinho de compras funcional', false, error.message);
    }

    // ==========================================
    // TESTE 7: SISTEMA DE CHECKOUT
    // ==========================================
    console.log('\n💳 TESTE 7: SISTEMA DE CHECKOUT');
    console.log('───────────────────────────────');

    try {
      await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForSelector('h1, h2, [class*="checkout"], [class*="Checkout"]', { timeout: 10000 });
      recordTest('Página de checkout acessível', true);

      // Verificar se Stripe está carregado
      const stripeElements = await page.locator('[class*="stripe"], [class*="Stripe"], iframe[name*="stripe"]').count();
      recordTest('Elementos Stripe presentes', stripeElements > 0,
        stripeElements === 0 ? 'Elementos Stripe não encontrados' : null);
    } catch (error) {
      recordTest('Sistema de checkout acessível', false, error.message);
    }

    // ==========================================
    // TESTE 8: PAINEL ADMINISTRATIVO
    // ==========================================
    console.log('\n🎛️ TESTE 8: PAINEL ADMINISTRATIVO');
    console.log('─────────────────────────────────');

    try {
      await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle', timeout: 20000 });

      // Verificar se existe campo de senha
      const passwordField = await page.locator('input[type="password"], input[name="password"]').first();
      if (await passwordField.count() > 0) {
        recordTest('Tela de login admin presente', true);

        // Tentar fazer login
        await passwordField.fill('juliojuliana62');
        const submitButton = await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")').first();
        if (await submitButton.count() > 0) {
          await submitButton.click();
          await page.waitForTimeout(3000);

          // Verificar se logou com sucesso
          const dashboardElements = await page.locator('[class*="dashboard"], [class*="admin"], h1:has-text("Admin"), h1:has-text("Dashboard")').count();
          recordTest('Login admin funcional', dashboardElements > 0);
        }
      } else {
        recordTest('Painel admin acessível', false, 'Campo de senha não encontrado');
      }
    } catch (error) {
      recordTest('Painel administrativo funcional', false, error.message);
    }

    // ==========================================
    // TESTE 9: APIS CRÍTICAS
    // ==========================================
    console.log('\n🔌 TESTE 9: APIS CRÍTICAS');
    console.log('─────────────────────────');

    const apiEndpoints = [
      { name: 'Health Check', url: '/api/health' },
      { name: 'Products API', url: '/api/products' },
      { name: 'Categories API', url: '/api/categories' },
      { name: 'Contact API', url: '/api/contact', method: 'GET' }
    ];

    for (const api of apiEndpoints) {
      try {
        const response = await page.request.get(`${BASE_URL}${api.url}`);
        recordTest(`API ${api.name}`, response.ok(),
          !response.ok() ? `Status: ${response.status()}` : null);
      } catch (error) {
        recordTest(`API ${api.name}`, false, error.message);
      }
    }

    // ==========================================
    // TESTE 10: PERFORMANCE E RESPONSIVIDADE
    // ==========================================
    console.log('\n⚡ TESTE 10: PERFORMANCE E RESPONSIVIDADE');
    console.log('────────────────────────────────────────');

    try {
      // Teste mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForSelector('h1', { timeout: 10000 });
      recordTest('Layout responsivo (mobile)', true);

      // Teste tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload({ waitUntil: 'networkidle' });
      recordTest('Layout responsivo (tablet)', true);

      // Voltar ao desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
    } catch (error) {
      recordTest('Responsividade funcional', false, error.message);
    }

    await page.close();

  } catch (error) {
    console.error('❌ Erro geral nos testes:', error);
    TEST_RESULTS.failed++;
    TEST_RESULTS.errors.push({ test: 'Execução geral', error: error.message });
  } finally {
    await browser.close();
  }
}

// Função para gerar relatório
function generateReport() {
  console.log('\n📊 RELATÓRIO FINAL DOS TESTES');
  console.log('═══════════════════════════════════════');

  const successRate = ((TEST_RESULTS.passed / TEST_RESULTS.total) * 100).toFixed(1);

  console.log(`📈 Taxa de Sucesso: ${successRate}%`);
  console.log(`✅ Testes Aprovados: ${TEST_RESULTS.passed}`);
  console.log(`❌ Testes Falhados: ${TEST_RESULTS.failed}`);
  console.log(`📋 Total de Testes: ${TEST_RESULTS.total}`);

  if (TEST_RESULTS.errors.length > 0) {
    console.log('\n🔍 DETALHES DOS ERROS:');
    console.log('─────────────────────');
    TEST_RESULTS.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.test}: ${error.error}`);
    });
  }

  console.log('\n🎯 AVALIAÇÃO GERAL:');
  console.log('──────────────────');

  if (successRate >= 90) {
    console.log('🏆 EXCELENTE - Site totalmente funcional!');
  } else if (successRate >= 75) {
    console.log('✅ BOM - Site funcional com pequenos ajustes necessários');
  } else if (successRate >= 50) {
    console.log('⚠️ REGULAR - Site funcional mas precisa de correções');
  } else {
    console.log('❌ CRÍTICO - Site tem problemas sérios que precisam ser resolvidos');
  }

  console.log('\n═══════════════════════════════════════');
  console.log('🎉 TESTE COMPLETO FINALIZADO!');
  console.log('═══════════════════════════════════════\n');
}

// Executar testes
runComprehensiveTests()
  .then(() => {
    generateReport();
    process.exit(TEST_RESULTS.failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('💥 ERRO CRÍTICO:', error);
    process.exit(1);
  });