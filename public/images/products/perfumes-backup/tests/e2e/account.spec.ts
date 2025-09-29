import { test, expect } from '@playwright/test';

test.describe('Área do Cliente', () => {
  test('Acessar página de login', async ({ page }) => {
    await page.goto('/auth/signin');

    await expect(page).toHaveTitle(/login|entrar|sign/i);
    await expect(page.locator('h1, h2').filter({ hasText: /entrar|login|sign/i })).toBeVisible();
  });

  test('Acessar área do cliente após login simulado', async ({ page }) => {
    // Simular login com dados válidos
    await page.goto('/auth/signin');

    // Verificar se há campos de login
    const emailField = page.locator('input[name="email"], input[type="email"]').first();
    const passwordField = page.locator('input[name="password"], input[type="password"]').first();

    if (await emailField.isVisible() && await passwordField.isVisible()) {
      await emailField.fill('cliente-teste@jchairstudio.com');
      await passwordField.fill('senha123');

      const loginButton = page.locator('button').filter({ hasText: /entrar|login|sign/i }).first();
      await loginButton.click();

      // Aguardar redirecionamento para área do cliente
      await page.waitForURL(/conta|account|profile/);
    } else {
      // Se não há formulário de login tradicional, tentar login com Google
      const googleLoginButton = page.locator('button').filter({ hasText: /google|continuar com google/i }).first();

      if (await googleLoginButton.isVisible()) {
        console.log('Login com Google detectado - necessário mock em ambiente de teste');
        // Em ambiente de teste, pular para área do cliente diretamente
        await page.goto('/conta');
      }
    }

    // Verificar se está na área do cliente
    await expect(page).toHaveURL(/conta|account|profile/);
    await expect(page.locator('h1, h2').filter({ hasText: /minha conta|my account|perfil/i })).toBeVisible();
  });

  test('Navegar pelas seções da área do cliente', async ({ page }) => {
    // Ir diretamente para área do cliente (simulando usuário logado)
    await page.goto('/conta');

    // Verificar seções principais
    const sections = [
      { link: '/conta/pedidos', text: /pedidos|orders/i },
      { link: '/conta/enderecos', text: /endereços|addresses/i },
      { link: '/conta/perfil', text: /perfil|profile/i },
      { link: '/conta/favoritos', text: /favoritos|favorites|wishlist/i }
    ];

    for (const section of sections) {
      const sectionLink = page.locator(`a[href="${section.link}"], a`).filter({ hasText: section.text }).first();

      if (await sectionLink.isVisible()) {
        await sectionLink.click();
        await expect(page).toHaveURL(section.link);

        // Verificar se a página carregou
        await expect(page.locator('h1, h2')).toBeVisible();

        // Voltar para página principal da conta
        await page.goto('/conta');
      }
    }
  });

  test('Acessar histórico de pedidos', async ({ page }) => {
    await page.goto('/conta/pedidos');

    // Verificar se página de pedidos carregou
    await expect(page.locator('h1, h2').filter({ hasText: /pedidos|orders/i })).toBeVisible();

    // Verificar se há lista de pedidos ou mensagem de "nenhum pedido"
    const ordersContainer = page.locator('.orders-list, .pedidos-lista, [data-testid="orders"]').first();
    const noOrdersMessage = page.locator('text=Nenhum pedido encontrado');

    if (await ordersContainer.isVisible()) {
      console.log('Lista de pedidos encontrada');
    } else if (await noOrdersMessage.isVisible()) {
      console.log('Nenhum pedido encontrado - comportamento esperado para novo usuário');
    } else {
      console.log('Página de pedidos carregada sem conteúdo específico');
    }
  });

  test('Gerenciar endereços', async ({ page }) => {
    await page.goto('/conta/enderecos');

    await expect(page.locator('h1, h2').filter({ hasText: /endereços|addresses/i })).toBeVisible();

    // Procurar botão para adicionar novo endereço
    const addAddressButton = page.locator('button').filter({ hasText: /adicionar|novo endereço|add address/i }).first();

    if (await addAddressButton.isVisible()) {
      await addAddressButton.click();

      // Verificar se formulário de endereço aparece
      const addressForm = page.locator('form, .address-form').first();
      await expect(addressForm).toBeVisible();
    }
  });

  test('Editar perfil do usuário', async ({ page }) => {
    await page.goto('/conta/perfil');

    await expect(page.locator('h1, h2').filter({ hasText: /perfil|profile/i })).toBeVisible();

    // Procurar campos editáveis
    const nameField = page.locator('input[name="name"], input[name="nome"]').first();
    const phoneField = page.locator('input[name="phone"], input[name="telefone"]').first();

    if (await nameField.isVisible()) {
      await nameField.fill('Cliente Teste Atualizado');
    }

    if (await phoneField.isVisible()) {
      await phoneField.fill('(11) 99999-9999');
    }

    // Procurar botão de salvar
    const saveButton = page.locator('button').filter({ hasText: /salvar|save|atualizar/i }).first();

    if (await saveButton.isVisible()) {
      await saveButton.click();

      // Verificar mensagem de sucesso
      await expect(page.locator('text=Perfil atualizado')).toBeVisible({ timeout: 5000 });
    }
  });
});