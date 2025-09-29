import { test, expect } from '@playwright/test';

test.describe('Newsletter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Inscrever-se na newsletter com sucesso', async ({ page }) => {
    // Procurar campo de newsletter na página
    const newsletterEmail = page.locator('input[name="newsletter-email"], input[name="newsletterEmail"], input[placeholder*="email" i]').first();

    if (await newsletterEmail.isVisible()) {
      await newsletterEmail.fill('teste-newsletter@jchairstudio.com');

      // Procurar botão de inscrição
      const subscribeButton = page.locator('button').filter({ hasText: /inscrever|subscribe/i }).first();
      await subscribeButton.click();

      // Verificar mensagem de sucesso
      await expect(page.locator('text=Inscrição confirmada')).toBeVisible({ timeout: 5000 });
    } else {
      console.log('Campo de newsletter não encontrado na página principal');
    }
  });

  test('Validar email inválido na newsletter', async ({ page }) => {
    const newsletterEmail = page.locator('input[name="newsletter-email"], input[name="newsletterEmail"], input[placeholder*="email" i]').first();

    if (await newsletterEmail.isVisible()) {
      await newsletterEmail.fill('email-invalido');

      const subscribeButton = page.locator('button').filter({ hasText: /inscrever|subscribe/i }).first();
      await subscribeButton.click();

      // Verificar mensagem de erro ou validação HTML5
      const emailValidation = await newsletterEmail.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(emailValidation).toBeTruthy();
    }
  });

  test('Newsletter no rodapé', async ({ page }) => {
    // Rolar até o rodapé
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const footerNewsletterEmail = page.locator('footer input[type="email"]').first();

    if (await footerNewsletterEmail.isVisible()) {
      await footerNewsletterEmail.fill('footer-newsletter@jchairstudio.com');

      const footerSubscribeButton = page.locator('footer button').filter({ hasText: /inscrever|subscribe/i }).first();
      await footerSubscribeButton.click();

      await expect(page.locator('text=Obrigado por se inscrever')).toBeVisible({ timeout: 5000 });
    }
  });
});