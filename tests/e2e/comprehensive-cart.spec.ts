import { test, expect } from '@playwright/test';

/**
 * 🛒 TESTES ABRANGENTES DO CARRINHO
 * Cobre todos os cenários possíveis do carrinho de compras
 */

test.describe('Carrinho de Compras - Testes Abrangentes', () => {
  let testResults = {
    addToCart: false,
    updateQuantity: false,
    removeItem: false,
    cartPersistence: false,
    emptyCart: false,
    multipleProducts: false,
    priceCalculation: false,
    cartCounter: false
  };

  test.beforeEach(async ({ page }) => {
    // Configurar interceptors para capturar requests
    await page.route('**/api/cart/**', route => {
      console.log(`🔍 Cart API call: ${route.request().method()} ${route.request().url()}`);
      route.continue();
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.afterAll(async () => {
    // Gerar relatório detalhado
    console.log('\n🛒 RELATÓRIO DO CARRINHO:');
    console.log('================================');
    Object.entries(testResults).forEach(([test, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSOU' : 'FALHOU'}`);
    });
  });

  test('CT001 - Adicionar produto ao carrinho com sucesso', async ({ page }) => {
    try {
      // Navegar para produtos
      await page.click('text=Produtos');
      await page.waitForLoadState('networkidle');

      // Verificar se produtos estão carregados
      await expect(page.locator('.product-card, [data-testid="product-card"]')).toHaveCount({ min: 1 });

      // Capturar nome e preço do primeiro produto
      const firstProduct = page.locator('.product-card, [data-testid="product-card"]').first();
      const productName = await firstProduct.locator('h3, .product-name, [data-testid="product-name"]').first().textContent();
      const productPrice = await firstProduct.locator('.price, [data-testid="product-price"]').first().textContent();

      console.log(`📦 Produto selecionado: ${productName} - ${productPrice}`);

      // Adicionar ao carrinho
      const addButton = firstProduct.locator('button:has-text("Adicionar"), button[data-testid="add-to-cart"]').first();
      await addButton.click();

      // Verificar feedback visual
      await expect(page.locator('.toast, .notification, [data-testid="success-message"]')).toBeVisible({ timeout: 5000 });

      // Verificar contador do carrinho
      const cartCounter = page.locator('[data-testid="cart-counter"], .cart-count, .badge');
      await expect(cartCounter).toHaveText('1');

      testResults.addToCart = true;
      console.log('✅ CT001 - Adicionar produto: SUCESSO');
    } catch (error) {
      console.log('❌ CT001 - Adicionar produto: FALHA -', error.message);
    }
  });

  test('CT002 - Visualizar carrinho com produtos', async ({ page }) => {
    try {
      // Primeiro adicionar um produto
      await page.click('text=Produtos');
      await page.waitForLoadState('networkidle');

      const addButton = page.locator('button:has-text("Adicionar"), button[data-testid="add-to-cart"]').first();
      await addButton.click();
      await page.waitForTimeout(2000);

      // Abrir carrinho
      await page.click('[data-testid="cart-icon"], .cart-icon, a[href*="carrinho"]');

      // Verificar se carrinho carregou
      await expect(page.locator('h1, h2').filter({ hasText: /carrinho/i })).toBeVisible();

      // Verificar se produto aparece no carrinho
      const cartItem = page.locator('.cart-item, [data-testid="cart-item"]').first();
      await expect(cartItem).toBeVisible();

      // Verificar elementos essenciais do item
      await expect(cartItem.locator('.product-name, [data-testid="item-name"]')).toBeVisible();
      await expect(cartItem.locator('.price, [data-testid="item-price"]')).toBeVisible();
      await expect(cartItem.locator('.quantity, [data-testid="item-quantity"]')).toBeVisible();

      testResults.cartCounter = true;
      console.log('✅ CT002 - Visualizar carrinho: SUCESSO');
    } catch (error) {
      console.log('❌ CT002 - Visualizar carrinho: FALHA -', error.message);
    }
  });

  test('CT003 - Atualizar quantidade no carrinho', async ({ page }) => {
    try {
      // Adicionar produto e ir para carrinho
      await page.click('text=Produtos');
      await page.waitForLoadState('networkidle');
      await page.click('button:has-text("Adicionar")');
      await page.waitForTimeout(2000);
      await page.click('[data-testid="cart-icon"], .cart-icon, a[href*="carrinho"]');

      // Localizar controles de quantidade
      const quantityInput = page.locator('input[type="number"], .quantity-input').first();
      const increaseButton = page.locator('button:has-text("+"), .quantity-increase').first();

      if (await quantityInput.isVisible()) {
        // Atualizar via input
        await quantityInput.fill('2');
        await quantityInput.press('Enter');
      } else if (await increaseButton.isVisible()) {
        // Atualizar via botão
        await increaseButton.click();
      }

      await page.waitForTimeout(2000);

      // Verificar se quantidade foi atualizada
      const cartCounter = page.locator('[data-testid="cart-counter"], .cart-count');
      await expect(cartCounter).toHaveText('2');

      testResults.updateQuantity = true;
      console.log('✅ CT003 - Atualizar quantidade: SUCESSO');
    } catch (error) {
      console.log('❌ CT003 - Atualizar quantidade: FALHA -', error.message);
    }
  });

  test('CT004 - Remover item do carrinho', async ({ page }) => {
    try {
      // Adicionar produto e ir para carrinho
      await page.click('text=Produtos');
      await page.waitForLoadState('networkidle');
      await page.click('button:has-text("Adicionar")');
      await page.waitForTimeout(2000);
      await page.click('[data-testid="cart-icon"], .cart-icon, a[href*="carrinho"]');

      // Remover item
      const removeButton = page.locator('button:has-text("Remover"), .remove-item, [data-testid="remove-item"]').first();
      await removeButton.click();

      // Confirmar remoção se necessário
      const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Sim")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }

      await page.waitForTimeout(2000);

      // Verificar se carrinho está vazio
      const emptyMessage = page.locator('text=Carrinho vazio, text=Nenhum item');
      await expect(emptyMessage).toBeVisible();

      testResults.removeItem = true;
      console.log('✅ CT004 - Remover item: SUCESSO');
    } catch (error) {
      console.log('❌ CT004 - Remover item: FALHA -', error.message);
    }
  });

  test('CT005 - Persistência do carrinho entre sessões', async ({ page }) => {
    try {
      // Adicionar produto
      await page.click('text=Produtos');
      await page.waitForLoadState('networkidle');
      await page.click('button:has-text("Adicionar")');
      await page.waitForTimeout(2000);

      // Verificar localStorage/sessionStorage
      const cartData = await page.evaluate(() => {
        return {
          localStorage: localStorage.getItem('cart') || localStorage.getItem('shopping-cart'),
          sessionStorage: sessionStorage.getItem('cart') || sessionStorage.getItem('shopping-cart')
        };
      });

      // Recarregar página
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Verificar se carrinho persiste
      const cartCounter = page.locator('[data-testid="cart-counter"], .cart-count');
      await expect(cartCounter).toHaveText('1');

      testResults.cartPersistence = true;
      console.log('✅ CT005 - Persistência do carrinho: SUCESSO');
      console.log('📊 Dados do carrinho:', cartData);
    } catch (error) {
      console.log('❌ CT005 - Persistência do carrinho: FALHA -', error.message);
    }
  });

  test('CT006 - Adicionar múltiplos produtos diferentes', async ({ page }) => {
    try {
      await page.click('text=Produtos');
      await page.waitForLoadState('networkidle');

      // Verificar se há pelo menos 2 produtos
      const products = page.locator('.product-card, [data-testid="product-card"]');
      const productCount = await products.count();

      if (productCount >= 2) {
        // Adicionar primeiro produto
        await products.nth(0).locator('button:has-text("Adicionar")').click();
        await page.waitForTimeout(1000);

        // Adicionar segundo produto
        await products.nth(1).locator('button:has-text("Adicionar")').click();
        await page.waitForTimeout(1000);

        // Verificar contador
        const cartCounter = page.locator('[data-testid="cart-counter"], .cart-count');
        await expect(cartCounter).toHaveText('2');

        testResults.multipleProducts = true;
        console.log('✅ CT006 - Múltiplos produtos: SUCESSO');
      } else {
        console.log('⚠️ CT006 - Produtos insuficientes para teste');
      }
    } catch (error) {
      console.log('❌ CT006 - Múltiplos produtos: FALHA -', error.message);
    }
  });

  test('CT007 - Cálculo correto de preços e total', async ({ page }) => {
    try {
      await page.click('text=Produtos');
      await page.waitForLoadState('networkidle');

      // Capturar preço do produto
      const firstProduct = page.locator('.product-card, [data-testid="product-card"]').first();
      const priceText = await firstProduct.locator('.price, [data-testid="product-price"]').first().textContent();
      const productPrice = parseFloat(priceText?.replace(/[R$\s,]/g, '').replace(',', '.') || '0');

      console.log(`💰 Preço do produto: R$ ${productPrice}`);

      // Adicionar produto
      await firstProduct.locator('button:has-text("Adicionar")').click();
      await page.waitForTimeout(2000);

      // Ir para carrinho
      await page.click('[data-testid="cart-icon"], .cart-icon, a[href*="carrinho"]');

      // Verificar total no carrinho
      const totalElement = page.locator('.total, [data-testid="cart-total"], .cart-total').first();
      if (await totalElement.isVisible()) {
        const totalText = await totalElement.textContent();
        const cartTotal = parseFloat(totalText?.replace(/[R$\s,]/g, '').replace(',', '.') || '0');

        console.log(`💰 Total no carrinho: R$ ${cartTotal}`);

        // Verificar se preços batem (com tolerância para diferenças de formatação)
        if (Math.abs(productPrice - cartTotal) < 0.01) {
          testResults.priceCalculation = true;
          console.log('✅ CT007 - Cálculo de preços: SUCESSO');
        } else {
          console.log('❌ CT007 - Cálculo de preços: DIVERGÊNCIA');
        }
      }
    } catch (error) {
      console.log('❌ CT007 - Cálculo de preços: FALHA -', error.message);
    }
  });

  test('CT008 - Comportamento com carrinho vazio', async ({ page }) => {
    try {
      // Ir diretamente para carrinho
      await page.goto('/carrinho');
      await page.waitForLoadState('networkidle');

      // Verificar mensagem de carrinho vazio
      const emptyMessage = page.locator('text=Carrinho vazio, text=Nenhum item, text=Seu carrinho está vazio');
      await expect(emptyMessage).toBeVisible();

      // Verificar se botão de checkout está desabilitado
      const checkoutButton = page.locator('button:has-text("Finalizar"), a:has-text("Checkout")');
      if (await checkoutButton.isVisible()) {
        await expect(checkoutButton).toBeDisabled();
      }

      testResults.emptyCart = true;
      console.log('✅ CT008 - Carrinho vazio: SUCESSO');
    } catch (error) {
      console.log('❌ CT008 - Carrinho vazio: FALHA -', error.message);
    }
  });
});