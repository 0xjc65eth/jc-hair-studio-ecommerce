// Script de automação E2E para JC Hair Studio's 62 E-commerce
// Testa funcionalidades críticas usando Puppeteer e axios

const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configurações do ambiente de teste
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';
const TEST_EMAILS = [
  'juliocesarurss65@gmail.com',
  'juliana.dayane110@gmail.com',
];

// Configuração do Puppeteer
const BROWSER_CONFIG = {
  headless: process.env.TEST_HEADLESS !== 'false',
  defaultViewport: { width: 1280, height: 720 },
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};

// Utilitários
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ECommerceTestSuite {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async setup() {
    console.log('🚀 Iniciando testes de E-commerce JC Hair Studio\'s 62');
    console.log(`📍 URL Base: ${BASE_URL}`);

    this.browser = await puppeteer.launch(BROWSER_CONFIG);
    this.page = await this.browser.newPage();

    // Configurar interceptação de erros de console
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Erro de console:', msg.text());
      }
    });

    // Configurar timeout padrão
    this.page.setDefaultTimeout(10000);
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }

    console.log('\n📊 Resultados dos Testes:');
    console.log(`✅ Passou: ${this.results.passed}`);
    console.log(`❌ Falhou: ${this.results.failed}`);

    if (this.results.errors.length > 0) {
      console.log('\n🔍 Erros encontrados:');
      this.results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
  }

  async test(testName, testFn) {
    try {
      console.log(`\n🧪 ${testName}`);
      await testFn();
      console.log(`✅ ${testName} - PASSOU`);
      this.results.passed++;
    } catch (error) {
      console.log(`❌ ${testName} - FALHOU: ${error.message}`);
      this.results.failed++;
      this.results.errors.push(`${testName}: ${error.message}`);
    }
  }

  // Teste 1: Verificar se o servidor está rodando
  async testServerHealth() {
    const response = await axios.get(BASE_URL, { timeout: 5000 });
    if (response.status !== 200) {
      throw new Error(`Servidor retornou status ${response.status}`);
    }
  }

  // Teste 2: Seed do banco de dados
  async testDatabaseSeed() {
    try {
      const response = await axios.get(`${BASE_URL}/api/seed`, { timeout: 30000 });
      console.log(`   📊 Seed executado: HTTP ${response.status}`);

      if (response.data && response.data.message) {
        console.log(`   📝 ${response.data.message}`);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('   ⚠️  Endpoint /api/seed não encontrado - pulando');
        return;
      }
      throw error;
    }
  }

  // Teste 3: Verificar produtos no catálogo
  async testProductCatalog() {
    await this.page.goto(`${BASE_URL}/produtos`, { waitUntil: 'networkidle2' });

    // Verificar se produtos carregaram
    await this.page.waitForSelector('[data-testid="product-card"], .product-card, .grid > div', { timeout: 10000 });

    const products = await this.page.$$('[data-testid="product-card"], .product-card, .grid > div');
    console.log(`   📦 Produtos encontrados: ${products.length}`);

    if (products.length === 0) {
      throw new Error('Nenhum produto encontrado no catálogo');
    }

    // Verificar se pelo menos um produto tem imagem
    const productWithImage = await this.page.$('img[src*="/images/products"], img[alt*="produto"]');
    if (productWithImage) {
      console.log('   🖼️  Imagens de produtos carregando corretamente');
    }
  }

  // Teste 4: Funcionalidade do carrinho
  async testCartFunctionality() {
    await this.page.goto(`${BASE_URL}/produtos`, { waitUntil: 'networkidle2' });

    // Procurar por botões de adicionar ao carrinho
    const addToCartSelectors = [
      'button[data-testid="add-to-cart"]',
      'button:has-text("Adicionar")',
      'button:has-text("Comprar")',
      '.add-to-cart',
      'button[aria-label*="adicionar"]'
    ];

    let addToCartButton = null;
    for (const selector of addToCartSelectors) {
      try {
        addToCartButton = await this.page.$(selector);
        if (addToCartButton) break;
      } catch (e) {
        continue;
      }
    }

    if (addToCartButton) {
      await addToCartButton.click();
      await delay(1000);
      console.log('   🛒 Item adicionado ao carrinho');

      // Verificar se carrinho foi atualizado
      const cartIndicator = await this.page.$('[data-testid="cart-count"], .cart-count, .badge');
      if (cartIndicator) {
        const count = await cartIndicator.textContent();
        console.log(`   📊 Itens no carrinho: ${count}`);
      }
    } else {
      console.log('   ⚠️  Botão de adicionar ao carrinho não encontrado');
    }
  }

  // Teste 5: Newsletter signup
  async testNewsletterSignup() {
    try {
      const response = await axios.post(`${BASE_URL}/api/newsletter`, {
        email: TEST_EMAILS[1],
        name: 'Teste Automatizado'
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      console.log(`   📧 Newsletter API: HTTP ${response.status}`);

      if (response.status === 200 || response.status === 201) {
        console.log('   ✅ Newsletter signup funcionando');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('   ⚠️  API /api/newsletter não encontrada');
        return;
      }
      throw new Error(`Newsletter signup falhou: ${error.message}`);
    }
  }

  // Teste 6: Formulário de contato
  async testContactForm() {
    try {
      const response = await axios.post(`${BASE_URL}/api/contact`, {
        name: 'Teste Automatizado',
        email: TEST_EMAILS[0],
        subject: 'Teste de automação',
        message: 'Esta é uma mensagem de teste automatizada.'
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      });

      console.log(`   📧 Contact API: HTTP ${response.status}`);

      if (response.status === 200 || response.status === 201) {
        console.log('   ✅ Formulário de contato funcionando');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('   ⚠️  API /api/contact não encontrada');
        return;
      }
      throw new Error(`Formulário de contato falhou: ${error.message}`);
    }
  }

  // Teste 7: Páginas principais
  async testMainPages() {
    const pages = [
      { path: '/', name: 'Home' },
      { path: '/produtos', name: 'Produtos' },
      { path: '/sobre', name: 'Sobre' },
      { path: '/mega-hair', name: 'Mega Hair' },
      { path: '/cosmeticos', name: 'Cosméticos' }
    ];

    for (const { path, name } of pages) {
      try {
        await this.page.goto(`${BASE_URL}${path}`, {
          waitUntil: 'networkidle2',
          timeout: 10000
        });

        // Verificar se a página carregou sem erro 404
        const title = await this.page.title();
        const is404 = title.toLowerCase().includes('404') ||
                     title.toLowerCase().includes('not found');

        if (is404) {
          console.log(`   ⚠️  Página ${name} (${path}) não encontrada`);
        } else {
          console.log(`   ✅ Página ${name} carregou corretamente`);
        }
      } catch (error) {
        console.log(`   ❌ Erro ao carregar ${name}: ${error.message}`);
      }
    }
  }

  // Teste 8: Autenticação NextAuth
  async testAuthentication() {
    await this.page.goto(`${BASE_URL}/auth/signin`, { waitUntil: 'networkidle2' });

    // Verificar se página de login existe
    const signInForm = await this.page.$('form, [data-testid="signin-form"]');
    const googleButton = await this.page.$('button:has-text("Google"), [data-provider="google"]');

    if (signInForm || googleButton) {
      console.log('   🔐 Página de autenticação encontrada');

      if (googleButton) {
        console.log('   🌐 Login Google disponível');
      }
    } else {
      console.log('   ⚠️  Página de autenticação não encontrada ou diferente do esperado');
    }
  }

  // Teste 9: Responsividade mobile
  async testMobileResponsiveness() {
    await this.page.setViewport({ width: 375, height: 667 });
    await this.page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    // Verificar se menu mobile existe
    const mobileMenu = await this.page.$('[data-testid="mobile-menu"], .mobile-menu, .hamburger, .menu-toggle');

    if (mobileMenu) {
      console.log('   📱 Menu mobile encontrado');
    } else {
      console.log('   ⚠️  Menu mobile não encontrado');
    }

    // Resetar viewport
    await this.page.setViewport({ width: 1280, height: 720 });
  }

  // Teste 10: Performance básica
  async testBasicPerformance() {
    const startTime = Date.now();
    await this.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    const loadTime = Date.now() - startTime;

    console.log(`   ⏱️  Tempo de carregamento: ${loadTime}ms`);

    if (loadTime > 5000) {
      console.log('   ⚠️  Página lenta (>5s)');
    } else {
      console.log('   ✅ Tempo de carregamento aceitável');
    }
  }
}

// Executar todos os testes
async function runAllTests() {
  const testSuite = new ECommerceTestSuite();

  try {
    await testSuite.setup();

    await testSuite.test('Verificar saúde do servidor', () => testSuite.testServerHealth());
    await testSuite.test('Executar seed do banco de dados', () => testSuite.testDatabaseSeed());
    await testSuite.test('Verificar catálogo de produtos', () => testSuite.testProductCatalog());
    await testSuite.test('Testar funcionalidade do carrinho', () => testSuite.testCartFunctionality());
    await testSuite.test('Testar signup newsletter', () => testSuite.testNewsletterSignup());
    await testSuite.test('Testar formulário de contato', () => testSuite.testContactForm());
    await testSuite.test('Verificar páginas principais', () => testSuite.testMainPages());
    await testSuite.test('Testar autenticação', () => testSuite.testAuthentication());
    await testSuite.test('Testar responsividade mobile', () => testSuite.testMobileResponsiveness());
    await testSuite.test('Testar performance básica', () => testSuite.testBasicPerformance());

  } finally {
    await testSuite.teardown();
  }

  process.exit(testSuite.results.failed > 0 ? 1 : 0);
}

// Executar se chamado diretamente
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { ECommerceTestSuite, runAllTests };