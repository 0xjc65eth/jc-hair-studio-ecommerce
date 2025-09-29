import { test, expect } from '@playwright/test';

test.describe('Fluxo completo do carrinho e checkout', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar cookies/localStorage se necessário
    await page.goto('/');
  });

  test('Adicionar produto ao carrinho e visualizar', async ({ page }) => {
    // Navegar para produtos
    await page.click('text=Produtos');
    await page.waitForLoadState('networkidle');

    // Adicionar primeiro produto disponível ao carrinho
    const addToCartButton = page.locator('button').filter({ hasText: /Adicionar ao carrinho/i }).first();
    await addToCartButton.click();

    // Verificar se o contador do carrinho atualizou
    const cartCounter = page.locator('[data-testid="cart-counter"]');
    await expect(cartCounter).toHaveText('1');

    // Abrir carrinho
    await page.click('[data-testid="cart-icon"]');

    // Verificar se produto aparece no carrinho
    const cartItem = page.locator('.cart-item').first();
    await expect(cartItem).toBeVisible();
  });

  test('Fluxo completo de checkout com Stripe', async ({ page }) => {
    // Adicionar produto ao carrinho
    await page.click('text=Produtos');
    await page.waitForLoadState('networkidle');

    const addToCartButton = page.locator('button').filter({ hasText: /Adicionar ao carrinho/i }).first();
    await addToCartButton.click();

    // Ir para checkout
    await page.click('[data-testid="cart-icon"]');
    await page.click('text=Finalizar Compra');

    // Verificar se chegou na página de checkout
    await expect(page).toHaveURL(/checkout/);

    // Preencher dados do cliente (se necessário)
    const emailField = page.locator('input[name="email"]');
    if (await emailField.isVisible()) {
      await emailField.fill('teste-checkout@jchairstudio.com');
    }

    // Selecionar método de pagamento Stripe
    const stripeOption = page.locator('input[value="stripe"]');
    if (await stripeOption.isVisible()) {
      await stripeOption.click();
    }

    // Simular preenchimento de cartão Stripe (cartão de teste)
    const cardNumber = page.locator('input[name="cardNumber"]');
    if (await cardNumber.isVisible()) {
      await cardNumber.fill('4242424242424242');
      await page.locator('input[name="cardExpiry"]').fill('12/30');
      await page.locator('input[name="cardCvc"]').fill('123');
    }

    // Finalizar pedido
    await page.click('button:has-text("Finalizar Pedido")');

    // Verificar sucesso
    await expect(page.locator('text=Pedido confirmado')).toBeVisible({ timeout: 10000 });
  });

  test('Fluxo de checkout com pagamento em Bitcoin', async ({ page }) => {
    // Adicionar produto ao carrinho
    await page.click('text=Produtos');
    await page.waitForLoadState('networkidle');

    const addToCartButton = page.locator('button').filter({ hasText: /Adicionar ao carrinho/i }).first();
    await addToCartButton.click();

    // Ir para checkout
    await page.click('[data-testid="cart-icon"]');
    await page.click('text=Finalizar Compra');

    await expect(page).toHaveURL(/checkout/);

    // Selecionar Bitcoin
    const btcOption = page.locator('input[value="btc"]');
    if (await btcOption.isVisible()) {
      await btcOption.click();

      // Verificar se endereço BTC aparece
      const btcAddress = page.locator('[data-testid="btc-address"]');
      await expect(btcAddress).toBeVisible();
      await expect(btcAddress).toContainText('1'); // Endereços BTC começam com 1 ou 3
    }

    // Finalizar pedido
    await page.click('button:has-text("Finalizar Pedido")');

    // Verificar status pendente para crypto
    await expect(page.locator('text=Pagamento BTC aguardando confirmação')).toBeVisible({ timeout: 10000 });
  });

  test('Fluxo de checkout com pagamento em Ethereum', async ({ page }) => {
    // Adicionar produto ao carrinho
    await page.click('text=Produtos');
    await page.waitForLoadState('networkidle');

    const addToCartButton = page.locator('button').filter({ hasText: /Adicionar ao carrinho/i }).first();
    await addToCartButton.click();

    // Ir para checkout
    await page.click('[data-testid="cart-icon"]');
    await page.click('text=Finalizar Compra');

    await expect(page).toHaveURL(/checkout/);

    // Selecionar Ethereum
    const ethOption = page.locator('input[value="eth"]');
    if (await ethOption.isVisible()) {
      await ethOption.click();

      // Verificar se endereço ETH aparece
      const ethAddress = page.locator('[data-testid="eth-address"]');
      await expect(ethAddress).toBeVisible();
      await expect(ethAddress).toContainText('0x'); // Endereços ETH começam com 0x
    }

    // Finalizar pedido
    await page.click('button:has-text("Finalizar Pedido")');

    // Verificar status pendente para crypto
    await expect(page.locator('text=Pagamento ETH aguardando confirmação')).toBeVisible({ timeout: 10000 });
  });
});