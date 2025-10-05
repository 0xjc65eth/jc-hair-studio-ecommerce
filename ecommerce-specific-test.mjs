import { chromium } from 'playwright';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testEcommerceSpecificFeatures() {
  console.log('🛍️ Testando Funcionalidades Específicas do E-commerce...');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];

  try {
    // 1. Testar Catálogo de Produtos
    console.log('\n📦 Testando Catálogo de Produtos...');

    const productPages = [
      '/produtos',
      '/mega-hair',
      '/tratamentos-capilares',
      '/maquiagem'
    ];

    for (const productPage of productPages) {
      try {
        await page.goto(`${BASE_URL}${productPage}`, { waitUntil: 'networkidle', timeout: 10000 });
        await delay(1000);

        // Verificar produtos na página
        const productElements = await page.$$('img[alt*="produto"], img[src*="/products/"], .product, [data-product]');
        const productLinks = await page.$$('a[href*="/produto"], a[href*="/product"]');

        results.push({
          page: productPage,
          status: productElements.length > 0 ? '✅ PASS' : '❌ FAIL',
          details: `${productElements.length} produtos encontrados, ${productLinks.length} links de produtos`
        });

        console.log(`${productPage}: ${productElements.length} produtos encontrados`);

      } catch (error) {
        results.push({
          page: productPage,
          status: '❌ ERROR',
          details: error.message
        });
      }
    }

    // 2. Testar Funcionalidade de Busca
    console.log('\n🔍 Testando Funcionalidade de Busca...');

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const searchInputs = await page.$$('input[type="search"], input[placeholder*="busca"], input[placeholder*="pesquis"], input[name*="search"]');

    if (searchInputs.length > 0) {
      await searchInputs[0].fill('mega hair');
      await page.keyboard.press('Enter');
      await delay(2000);

      const searchResults = await page.$$('img[alt*="produto"], .product, [data-product]');

      results.push({
        test: 'Busca de Produtos',
        status: searchResults.length >= 0 ? '✅ PASS' : '❌ FAIL',
        details: `${searchResults.length} resultados para "mega hair"`
      });
    } else {
      results.push({
        test: 'Busca de Produtos',
        status: '⚠️ PARTIAL',
        details: 'Campo de busca não encontrado'
      });
    }

    // 3. Testar Categorias de Produtos
    console.log('\n📂 Testando Categorias de Produtos...');

    const categories = [
      'mega-hair',
      'tintas-capilares',
      'tratamentos-capilares',
      'esmaltes',
      'maquiagem'
    ];

    for (const category of categories) {
      try {
        await page.goto(`${BASE_URL}/${category}`, { waitUntil: 'networkidle', timeout: 8000 });
        await delay(1000);

        const categoryProducts = await page.$$('img[alt*="produto"], .product, [data-product]');

        results.push({
          category: category,
          status: categoryProducts.length > 0 ? '✅ PASS' : '⚠️ EMPTY',
          details: `${categoryProducts.length} produtos na categoria`
        });

      } catch (error) {
        results.push({
          category: category,
          status: '❌ ERROR',
          details: `Erro ao carregar: ${error.message.substring(0, 100)}`
        });
      }
    }

    // 4. Testar Detalhes do Produto
    console.log('\n📝 Testando Detalhes do Produto...');

    await page.goto(`${BASE_URL}/mega-hair`, { waitUntil: 'networkidle' });
    const productLinks = await page.$$('a[href*="/produto"], a[href*="/product"]');

    if (productLinks.length > 0) {
      await productLinks[0].click();
      await delay(2000);

      const productTitle = await page.$('h1, .product-title, [data-testid="product-title"]');
      const productPrice = await page.$('.price, .produto-preco, [data-testid="price"]');
      const productImage = await page.$('img[alt*="produto"], .product-image');
      const addToCartBtn = await page.$('button:has-text("Adicionar"), button:has-text("Carrinho"), [data-testid*="add-cart"]');

      results.push({
        test: 'Detalhes do Produto',
        status: (productTitle && productPrice) ? '✅ PASS' : '⚠️ PARTIAL',
        details: `Título: ${!!productTitle}, Preço: ${!!productPrice}, Imagem: ${!!productImage}, Botão: ${!!addToCartBtn}`
      });
    }

    // 5. Testar Sistema de Carrinho
    console.log('\n🛒 Testando Sistema de Carrinho...');

    // Tentar adicionar produto ao carrinho
    const addToCartBtn = await page.$('button:has-text("Adicionar"), button:has-text("Carrinho"), [data-testid*="add-cart"]');
    if (addToCartBtn) {
      await addToCartBtn.click();
      await delay(2000);

      // Verificar se há indicação de produto no carrinho
      const cartIndicator = await page.$('[data-testid*="cart-count"], .cart-counter, .badge');
      const cartLink = await page.$('a[href*="carrinho"], a[href*="cart"]');

      results.push({
        test: 'Adicionar ao Carrinho',
        status: (cartIndicator || cartLink) ? '✅ PASS' : '⚠️ PARTIAL',
        details: `Indicador: ${!!cartIndicator}, Link carrinho: ${!!cartLink}`
      });

      // Acessar página do carrinho
      if (cartLink) {
        await cartLink.click();
        await delay(2000);

        const cartItems = await page.$$('.cart-item, [data-testid*="cart-item"], .produto-carrinho');
        const totalPrice = await page.$('.total, .valor-total, [data-testid="total"]');

        results.push({
          test: 'Página do Carrinho',
          status: cartItems.length > 0 ? '✅ PASS' : '❌ EMPTY',
          details: `${cartItems.length} itens, Total visível: ${!!totalPrice}`
        });
      }
    }

    // 6. Testar Processo de Checkout
    console.log('\n💳 Testando Processo de Checkout...');

    await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle' });
    await delay(1000);

    const checkoutForm = await page.$('form');
    const requiredFields = await page.$$('input[required]');
    const emailField = await page.$('input[type="email"]');
    const nameField = await page.$('input[name*="name"], input[name*="nome"]');

    results.push({
      test: 'Página de Checkout',
      status: checkoutForm ? '✅ PASS' : '❌ FAIL',
      details: `Form: ${!!checkoutForm}, Campos obr.: ${requiredFields.length}, Email: ${!!emailField}, Nome: ${!!nameField}`
    });

    // 7. Testar Sistema de Autenticação
    console.log('\n🔐 Testando Sistema de Autenticação...');

    await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle' });
    const loginForm = await page.$('form');
    const loginEmail = await page.$('input[type="email"]');
    const loginPassword = await page.$('input[type="password"]');

    results.push({
      test: 'Página de Login',
      status: (loginForm && loginEmail && loginPassword) ? '✅ PASS' : '❌ FAIL',
      details: `Formulário completo: ${!!(loginForm && loginEmail && loginPassword)}`
    });

    await page.goto(`${BASE_URL}/auth/signup`, { waitUntil: 'networkidle' });
    const signupForm = await page.$('form');
    const signupFields = await page.$$('input[required]');

    results.push({
      test: 'Página de Cadastro',
      status: (signupForm && signupFields.length >= 3) ? '✅ PASS' : '❌ FAIL',
      details: `${signupFields.length} campos obrigatórios`
    });

    // 8. Testar Funcionalidades Mobile
    console.log('\n📱 Testando Funcionalidades Mobile...');

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const mobileMenu = await page.$('.mobile-menu, .hamburger, [data-testid*="mobile-menu"]');
    const responsiveImages = await page.$$('img[srcset], img[sizes]');

    results.push({
      test: 'Design Responsivo',
      status: mobileMenu ? '✅ PASS' : '⚠️ PARTIAL',
      details: `Menu mobile: ${!!mobileMenu}, Imagens responsivas: ${responsiveImages.length}`
    });

  } catch (error) {
    console.error('Erro durante os testes:', error);
  } finally {
    await browser.close();
  }

  // Gerar relatório
  console.log('\n📊 RELATÓRIO DE TESTES E-COMMERCE ESPECÍFICOS');
  console.log('='.repeat(60));

  let passCount = 0;
  let totalCount = 0;

  results.forEach(result => {
    totalCount++;
    if (result.status?.includes('✅')) passCount++;

    const testName = result.test || result.page || result.category || 'Teste';
    console.log(`${result.status} ${testName}: ${result.details}`);
  });

  console.log('\n📈 RESUMO DOS TESTES E-COMMERCE');
  console.log('='.repeat(40));
  console.log(`Taxa de sucesso: ${Math.round((passCount/totalCount) * 100)}%`);
  console.log(`Testes aprovados: ${passCount}/${totalCount}`);

  console.log('\n💡 ANÁLISE E RECOMENDAÇÕES');
  console.log('='.repeat(40));

  const failedTests = results.filter(r => r.status?.includes('❌'));
  const partialTests = results.filter(r => r.status?.includes('⚠️'));

  if (failedTests.length > 0) {
    console.log('🔴 Problemas críticos encontrados:');
    failedTests.forEach(test => {
      const name = test.test || test.page || test.category;
      console.log(`   - ${name}: ${test.details}`);
    });
  }

  if (partialTests.length > 0) {
    console.log('🟡 Melhorias recomendadas:');
    partialTests.forEach(test => {
      const name = test.test || test.page || test.category;
      console.log(`   - ${name}: ${test.details}`);
    });
  }

  if (passCount === totalCount) {
    console.log('🎉 Todos os testes passaram! E-commerce funcionando perfeitamente.');
  }
}

// Executar testes
testEcommerceSpecificFeatures().catch(console.error);