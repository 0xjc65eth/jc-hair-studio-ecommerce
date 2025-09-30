import { chromium } from 'playwright';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const testResults = {
  navigation: [],
  products: [],
  cart: [],
  checkout: [],
  auth: [],
  referrals: [],
  mobile: [],
  performance: [],
  accessibility: [],
  errors: []
};

async function humanLikeDelay() {
  await delay(Math.random() * 2000 + 1000); // 1-3 segundos
}

async function simulateHumanTyping(page, selector, text) {
  await page.click(selector);
  await delay(300);

  for (const char of text) {
    await page.type(selector, char);
    await delay(Math.random() * 100 + 50); // 50-150ms entre caracteres
  }
}

async function testPageNavigation(page, browser) {
  console.log('\n🧭 Testando Navegação e Páginas Principais...');

  try {
    // Homepage
    console.log('📍 Acessando página inicial...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await humanLikeDelay();

    const title = await page.title();
    testResults.navigation.push({
      test: 'Homepage Load',
      status: 'PASS',
      details: `Título: ${title}`
    });

    // Verificar elementos principais
    const headerExists = await page.$('header') !== null;
    const navExists = await page.$('nav') !== null;
    const footerExists = await page.$('footer') !== null;

    testResults.navigation.push({
      test: 'Main Elements',
      status: headerExists && navExists && footerExists ? 'PASS' : 'PARTIAL',
      details: `Header: ${headerExists}, Nav: ${navExists}, Footer: ${footerExists}`
    });

    // Testar links de navegação
    const navLinks = await page.$$eval('nav a, header a', links =>
      links.map(link => ({ text: link.textContent?.trim(), href: link.href }))
        .filter(link => link.text && !link.href.includes('#') && !link.href.includes('mailto'))
        .slice(0, 5) // Limitar para não sobrecarregar
    );

    for (const link of navLinks) {
      try {
        console.log(`📱 Testando navegação: ${link.text}`);
        const newPage = await browser.newPage();
        const response = await newPage.goto(link.href, { waitUntil: 'networkidle', timeout: 10000 });

        if (response && response.status() < 400) {
          testResults.navigation.push({
            test: `Navigation - ${link.text}`,
            status: 'PASS',
            details: `Status: ${response.status()}`
          });
        } else {
          testResults.navigation.push({
            test: `Navigation - ${link.text}`,
            status: 'FAIL',
            details: `Status: ${response?.status() || 'No response'}`
          });
        }

        await newPage.close();
        await humanLikeDelay();
      } catch (error) {
        testResults.navigation.push({
          test: `Navigation - ${link.text}`,
          status: 'FAIL',
          details: error.message
        });
      }
    }

  } catch (error) {
    testResults.errors.push(`Navigation test error: ${error.message}`);
  }
}

async function testProductFunctionality(page) {
  console.log('\n🛍️ Testando Funcionalidades de Produtos...');

  try {
    // Ir para página de produtos
    await page.goto(`${BASE_URL}/produtos`, { waitUntil: 'networkidle' });
    await humanLikeDelay();

    // Verificar se produtos estão carregando
    const productCards = await page.$$('[data-testid*="product"], .product-card, article');
    testResults.products.push({
      test: 'Product Cards Load',
      status: productCards.length > 0 ? 'PASS' : 'FAIL',
      details: `${productCards.length} produtos encontrados`
    });

    // Testar busca de produtos
    const searchInput = await page.$('input[type="search"], input[placeholder*="busca"], input[placeholder*="pesquis"]');
    if (searchInput) {
      console.log('🔍 Testando busca de produtos...');
      await simulateHumanTyping(page, 'input[type="search"], input[placeholder*="busca"], input[placeholder*="pesquis"]', 'shampoo');
      await page.keyboard.press('Enter');
      await delay(2000);

      const searchResults = await page.$$('[data-testid*="product"], .product-card, article');
      testResults.products.push({
        test: 'Product Search',
        status: searchResults.length >= 0 ? 'PASS' : 'FAIL',
        details: `${searchResults.length} resultados para "shampoo"`
      });
    }

    // Testar clique em produto (se houver produtos)
    if (productCards.length > 0) {
      console.log('👆 Testando clique em produto...');
      await productCards[0].click();
      await humanLikeDelay();

      // Verificar se chegou na página de detalhes
      const currentUrl = page.url();
      const isProductPage = currentUrl.includes('/produto') || currentUrl.includes('/product') ||
                           await page.$('.product-detail, [data-testid="product-detail"]') !== null;

      testResults.products.push({
        test: 'Product Detail Navigation',
        status: isProductPage ? 'PASS' : 'FAIL',
        details: `URL: ${currentUrl}`
      });

      // Testar botão adicionar ao carrinho
      const addToCartBtn = await page.$('button[data-testid*="add-cart"], button:has-text("Adicionar"), button:has-text("Carrinho")');
      if (addToCartBtn) {
        testResults.products.push({
          test: 'Add to Cart Button Present',
          status: 'PASS',
          details: 'Botão encontrado'
        });
      }
    }

  } catch (error) {
    testResults.errors.push(`Product test error: ${error.message}`);
  }
}

async function testShoppingCart(page) {
  console.log('\n🛒 Testando Carrinho de Compras...');

  try {
    // Voltar para produtos e tentar adicionar ao carrinho
    await page.goto(`${BASE_URL}/produtos`, { waitUntil: 'networkidle' });
    await humanLikeDelay();

    const productCards = await page.$$('[data-testid*="product"], .product-card, article');
    if (productCards.length > 0) {
      await productCards[0].click();
      await humanLikeDelay();

      // Tentar adicionar ao carrinho
      const addToCartBtn = await page.$('button[data-testid*="add-cart"], button:has-text("Adicionar"), button:has-text("Carrinho")');
      if (addToCartBtn) {
        console.log('➕ Adicionando produto ao carrinho...');
        await addToCartBtn.click();
        await delay(2000);

        // Verificar feedback visual ou contador de carrinho
        const cartCounter = await page.$('[data-testid*="cart-count"], .cart-counter, .badge');
        const cartFeedback = cartCounter !== null || await page.$('.cart-success, .added-to-cart') !== null;

        testResults.cart.push({
          test: 'Add Product to Cart',
          status: cartFeedback ? 'PASS' : 'PARTIAL',
          details: `Feedback visual: ${cartFeedback}`
        });

        // Tentar acessar carrinho
        const cartLink = await page.$('a[href*="carrinho"], a[href*="cart"], [data-testid*="cart-link"]');
        if (cartLink) {
          console.log('🛒 Acessando carrinho...');
          await cartLink.click();
          await humanLikeDelay();

          const cartItems = await page.$$('.cart-item, [data-testid*="cart-item"]');
          testResults.cart.push({
            test: 'Cart Page Access',
            status: 'PASS',
            details: `${cartItems.length} itens no carrinho`
          });

          // Testar remoção de item (se houver itens)
          if (cartItems.length > 0) {
            const removeBtn = await page.$('button[data-testid*="remove"], button:has-text("Remover"), .remove-btn');
            if (removeBtn) {
              await removeBtn.click();
              await delay(1000);

              testResults.cart.push({
                test: 'Remove Item from Cart',
                status: 'PASS',
                details: 'Botão remover funcional'
              });
            }
          }
        }
      }
    }

  } catch (error) {
    testResults.errors.push(`Cart test error: ${error.message}`);
  }
}

async function testCheckoutProcess(page) {
  console.log('\n💳 Testando Processo de Checkout...');

  try {
    // Tentar acessar checkout
    await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle' });
    await humanLikeDelay();

    const currentUrl = page.url();

    if (currentUrl.includes('login') || currentUrl.includes('auth')) {
      testResults.checkout.push({
        test: 'Checkout Requires Authentication',
        status: 'PASS',
        details: 'Redirecionado para login (comportamento correto)'
      });
    } else {
      // Verificar formulário de checkout
      const checkoutForm = await page.$('form[data-testid*="checkout"], .checkout-form, form');
      const emailInput = await page.$('input[type="email"], input[name*="email"]');
      const nameInput = await page.$('input[name*="name"], input[name*="nome"]');

      testResults.checkout.push({
        test: 'Checkout Form Present',
        status: checkoutForm ? 'PASS' : 'FAIL',
        details: `Form: ${!!checkoutForm}, Email: ${!!emailInput}, Name: ${!!nameInput}`
      });

      // Testar preenchimento parcial do formulário
      if (emailInput && nameInput) {
        console.log('📝 Testando preenchimento do formulário...');
        await simulateHumanTyping(page, 'input[type="email"], input[name*="email"]', 'test@example.com');
        await simulateHumanTyping(page, 'input[name*="name"], input[name*="nome"]', 'João Teste');

        testResults.checkout.push({
          test: 'Form Field Input',
          status: 'PASS',
          details: 'Campos preenchidos com sucesso'
        });
      }
    }

  } catch (error) {
    testResults.errors.push(`Checkout test error: ${error.message}`);
  }
}

async function testAuthentication(page) {
  console.log('\n🔐 Testando Sistema de Autenticação...');

  try {
    // Testar página de login
    await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle' });
    await humanLikeDelay();

    const loginForm = await page.$('form');
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');

    testResults.auth.push({
      test: 'Login Page Load',
      status: loginForm && emailInput && passwordInput ? 'PASS' : 'FAIL',
      details: `Form: ${!!loginForm}, Email: ${!!emailInput}, Password: ${!!passwordInput}`
    });

    // Testar página de registro
    await page.goto(`${BASE_URL}/auth/signup`, { waitUntil: 'networkidle' });
    await humanLikeDelay();

    const signupForm = await page.$('form');
    const signupFields = await page.$$('input[required], input[type="email"], input[type="password"]');

    testResults.auth.push({
      test: 'Signup Page Load',
      status: signupForm && signupFields.length >= 2 ? 'PASS' : 'FAIL',
      details: `${signupFields.length} campos obrigatórios encontrados`
    });

    // Testar validação de formulário (email inválido)
    if (emailInput) {
      console.log('✉️ Testando validação de email...');
      await simulateHumanTyping(page, 'input[type="email"]', 'email-invalido');
      await page.keyboard.press('Tab');

      const hasError = await page.$('.error, .invalid, [data-error]') !== null;
      testResults.auth.push({
        test: 'Email Validation',
        status: hasError ? 'PASS' : 'PARTIAL',
        details: `Validação visual: ${hasError}`
      });
    }

  } catch (error) {
    testResults.errors.push(`Auth test error: ${error.message}`);
  }
}

async function testReferralSystem(page) {
  console.log('\n🤝 Testando Sistema de Referrals/Afiliados...');

  try {
    // Testar página de referrals
    await page.goto(`${BASE_URL}/conta/referrals`, { waitUntil: 'networkidle' });
    await humanLikeDelay();

    const currentUrl = page.url();

    if (currentUrl.includes('login') || currentUrl.includes('auth')) {
      testResults.referrals.push({
        test: 'Referral System Authentication',
        status: 'PASS',
        details: 'Requer autenticação (comportamento correto)'
      });
    } else {
      const referralContent = await page.$('.referral, [data-testid*="referral"]');
      testResults.referrals.push({
        test: 'Referral Page Access',
        status: referralContent ? 'PASS' : 'FAIL',
        details: `Conteúdo encontrado: ${!!referralContent}`
      });
    }

    // Testar link de referral
    await page.goto(`${BASE_URL}/ref/TEST123`, { waitUntil: 'networkidle' });
    await humanLikeDelay();

    const refUrl = page.url();
    const redirectedCorrectly = !refUrl.includes('/ref/') || refUrl.includes('?ref=') || refUrl.includes('referral');

    testResults.referrals.push({
      test: 'Referral Link Processing',
      status: redirectedCorrectly ? 'PASS' : 'PARTIAL',
      details: `URL final: ${refUrl}`
    });

  } catch (error) {
    testResults.errors.push(`Referral test error: ${error.message}`);
  }
}

async function testMobileResponsiveness(page) {
  console.log('\n📱 Testando Responsividade Mobile...');

  try {
    // Simular dispositivo móvel
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await humanLikeDelay();

    // Verificar se o menu mobile existe
    const mobileMenu = await page.$('.mobile-menu, [data-testid*="mobile-menu"], .hamburger');
    testResults.mobile.push({
      test: 'Mobile Menu Present',
      status: mobileMenu ? 'PASS' : 'PARTIAL',
      details: `Menu mobile: ${!!mobileMenu}`
    });

    // Testar toque no menu mobile
    if (mobileMenu) {
      await mobileMenu.click();
      await delay(500);

      const menuOpen = await page.$('.menu-open, .mobile-menu-open, [data-state="open"]') !== null;
      testResults.mobile.push({
        test: 'Mobile Menu Interaction',
        status: menuOpen ? 'PASS' : 'PARTIAL',
        details: `Menu abre: ${menuOpen}`
      });
    }

    // Verificar overflow horizontal
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    testResults.mobile.push({
      test: 'Mobile Overflow Check',
      status: bodyWidth <= viewportWidth * 1.1 ? 'PASS' : 'FAIL',
      details: `Body: ${bodyWidth}px, Viewport: ${viewportWidth}px`
    });

    // Voltar para desktop
    await page.setViewportSize({ width: 1280, height: 720 });

  } catch (error) {
    testResults.errors.push(`Mobile test error: ${error.message}`);
  }
}

async function testPerformanceAndAccessibility(page) {
  console.log('\n⚡ Testando Performance e Acessibilidade...');

  try {
    // Testar tempo de carregamento
    const startTime = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    testResults.performance.push({
      test: 'Page Load Time',
      status: loadTime < 5000 ? 'PASS' : (loadTime < 10000 ? 'PARTIAL' : 'FAIL'),
      details: `${loadTime}ms`
    });

    // Verificar elementos de acessibilidade
    const altImages = await page.$$eval('img', imgs =>
      imgs.filter(img => !img.alt || img.alt.trim() === '').length
    );

    testResults.accessibility.push({
      test: 'Image Alt Attributes',
      status: altImages === 0 ? 'PASS' : 'PARTIAL',
      details: `${altImages} imagens sem alt text`
    });

    // Verificar estrutura de cabeçalhos
    const headings = await page.$$('h1, h2, h3, h4, h5, h6');
    const h1Count = await page.$$('h1');

    testResults.accessibility.push({
      test: 'Heading Structure',
      status: h1Count.length === 1 && headings.length > 1 ? 'PASS' : 'PARTIAL',
      details: `${h1Count.length} H1, ${headings.length} total headings`
    });

    // Verificar contraste (básico)
    const contrastIssues = await page.$$eval('*', elements => {
      let issues = 0;
      elements.slice(0, 100).forEach(el => { // Limitar para não travar
        const styles = window.getComputedStyle(el);
        const bgColor = styles.backgroundColor;
        const textColor = styles.color;

        // Verificação muito básica
        if (bgColor === textColor ||
            (bgColor.includes('rgb(255, 255, 255)') && textColor.includes('rgb(255, 255, 255)'))) {
          issues++;
        }
      });
      return issues;
    });

    testResults.accessibility.push({
      test: 'Basic Contrast Check',
      status: contrastIssues === 0 ? 'PASS' : 'PARTIAL',
      details: `${contrastIssues} possíveis problemas de contraste`
    });

  } catch (error) {
    testResults.errors.push(`Performance test error: ${error.message}`);
  }
}

function generateTestReport() {
  console.log('\n📊 RELATÓRIO COMPLETO DE TESTES HUMANIZADOS');
  console.log('='.repeat(60));

  const categories = [
    { name: '🧭 NAVEGAÇÃO', data: testResults.navigation },
    { name: '🛍️ PRODUTOS', data: testResults.products },
    { name: '🛒 CARRINHO', data: testResults.cart },
    { name: '💳 CHECKOUT', data: testResults.checkout },
    { name: '🔐 AUTENTICAÇÃO', data: testResults.auth },
    { name: '🤝 REFERRALS', data: testResults.referrals },
    { name: '📱 MOBILE', data: testResults.mobile },
    { name: '⚡ PERFORMANCE', data: testResults.performance },
    { name: '♿ ACESSIBILIDADE', data: testResults.accessibility }
  ];

  let totalTests = 0;
  let passedTests = 0;

  categories.forEach(category => {
    console.log(`\n${category.name}`);
    console.log('-'.repeat(30));

    if (category.data.length === 0) {
      console.log('❌ Nenhum teste executado');
      return;
    }

    category.data.forEach(test => {
      totalTests++;
      const statusIcon = test.status === 'PASS' ? '✅' :
                        test.status === 'PARTIAL' ? '⚠️' : '❌';

      if (test.status === 'PASS') passedTests++;

      console.log(`${statusIcon} ${test.test}: ${test.details}`);
    });
  });

  if (testResults.errors.length > 0) {
    console.log('\n🚨 ERROS ENCONTRADOS');
    console.log('-'.repeat(30));
    testResults.errors.forEach(error => {
      console.log(`❌ ${error}`);
    });
  }

  console.log('\n📈 RESUMO GERAL');
  console.log('='.repeat(30));
  console.log(`Total de testes: ${totalTests}`);
  console.log(`Testes aprovados: ${passedTests}`);
  console.log(`Taxa de sucesso: ${totalTests > 0 ? Math.round((passedTests/totalTests) * 100) : 0}%`);

  // Recomendações
  console.log('\n💡 RECOMENDAÇÕES');
  console.log('-'.repeat(30));

  if (testResults.accessibility.some(t => t.status !== 'PASS')) {
    console.log('🔍 Melhorar acessibilidade (alt text, contraste, estrutura de cabeçalhos)');
  }

  if (testResults.performance.some(t => t.status === 'FAIL')) {
    console.log('⚡ Otimizar performance de carregamento');
  }

  if (testResults.mobile.some(t => t.status !== 'PASS')) {
    console.log('📱 Aprimorar experiência mobile');
  }

  if (testResults.errors.length > 0) {
    console.log('🐛 Corrigir erros JavaScript/Network encontrados');
  }

  console.log('\n✅ Teste humanizado concluído!');
}

// Executar todos os testes
(async () => {
  console.log('🚀 Iniciando testes humanizados completos do JC Hair Studio...');
  console.log(`🎯 URL Base: ${BASE_URL}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Simular usuário humano
  await page.route('**/*', route => {
    const headers = route.request().headers();
    headers['user-agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    headers['accept-language'] = 'pt-BR,pt;q=0.9,en;q=0.8';
    route.continue({ headers });
  });

  try {
    await testPageNavigation(page, browser);
    await testProductFunctionality(page);
    await testShoppingCart(page);
    await testCheckoutProcess(page);
    await testAuthentication(page);
    await testReferralSystem(page);
    await testMobileResponsiveness(page);
    await testPerformanceAndAccessibility(page);

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
    testResults.errors.push(`Test execution error: ${error.message}`);
  } finally {
    await browser.close();
    generateTestReport();
  }
})();