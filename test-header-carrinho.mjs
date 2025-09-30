import { chromium } from 'playwright';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

async function testHeaderCarrinho() {
  console.log('🛒 Testando visibilidade do carrinho no header...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Ajustar viewport para desktop wide
  await page.setViewportSize({ width: 1600, height: 900 });

  try {
    // Ir para a página inicial
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('📍 Página carregada, verificando elementos do header...');

    // Verificar se o header existe
    const header = await page.$('header');
    console.log(`Header encontrado: ${!!header}`);

    // Verificar botões do carrinho (desktop e mobile)
    const cartButtonDesktop = await page.$('[data-testid="cart-button"]');
    const cartButtonMobile = await page.$('[data-testid="mobile-cart-button"]');

    console.log(`Botão carrinho desktop: ${!!cartButtonDesktop}`);
    console.log(`Botão carrinho mobile: ${!!cartButtonMobile}`);

    if (cartButtonDesktop) {
      const isVisible = await cartButtonDesktop.isVisible();
      const boundingBox = await cartButtonDesktop.boundingBox();
      console.log(`Botão desktop visível: ${isVisible}`);
      console.log(`Posição desktop:`, boundingBox);

      // Testar clique no carrinho (forçar clique mesmo se fora do viewport)
      await cartButtonDesktop.click({ force: true });
      await page.waitForTimeout(1000);
      console.log('✅ Clique no carrinho desktop testado');
    }

    if (cartButtonMobile) {
      const isVisible = await cartButtonMobile.isVisible();
      const boundingBox = await cartButtonMobile.boundingBox();
      console.log(`Botão mobile visível: ${isVisible}`);
      console.log(`Posição mobile:`, boundingBox);
    }

    // Verificar outros elementos do header
    const searchButton = await page.$('button[aria-label="Pesquisar"]');
    const userButton = await page.$('a[href="/conta"]');
    const logo = await page.$('a[href="/"]');

    console.log(`Botão busca: ${!!searchButton}`);
    console.log(`Botão usuário: ${!!userButton}`);
    console.log(`Logo: ${!!logo}`);

    // Tirar screenshot para análise visual
    await page.screenshot({
      path: 'header-test.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1280, height: 200 }
    });
    console.log('📸 Screenshot salvo como header-test.png');

    // Testar responsividade
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    const mobileCartVisible = await page.$('[data-testid="mobile-cart-button"]');
    if (mobileCartVisible) {
      const isVisible = await mobileCartVisible.isVisible();
      console.log(`Carrinho mobile visível em viewport pequeno: ${isVisible}`);
    }

    await page.screenshot({
      path: 'header-mobile-test.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 375, height: 150 }
    });
    console.log('📸 Screenshot mobile salvo como header-mobile-test.png');

    console.log('✅ Teste do header concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await browser.close();
  }
}

testHeaderCarrinho();