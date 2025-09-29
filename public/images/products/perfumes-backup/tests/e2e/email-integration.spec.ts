import { test, expect } from '@playwright/test';

test.describe('Testes de integração de email', () => {
  test('Testar envio de email via API', async ({ request }) => {
    const response = await request.post('/api/send-email', {
      data: {
        to: ['teste-integracao@jchairstudio.com'],
        subject: 'Teste de Integração - Pedido Confirmado',
        text: 'Este é um teste automatizado do sistema de emails.',
        html: '<h1>Pedido Confirmado</h1><p>Obrigado pela sua compra!</p>'
      }
    });

    // Verificar se API respondeu com sucesso
    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.success).toBe(true);
  });

  test('Testar email de confirmação de pedido', async ({ request }) => {
    // Simular dados de um pedido
    const orderData = {
      orderId: 'TEST-' + Date.now(),
      customerEmail: 'cliente-teste@jchairstudio.com',
      items: [
        {
          name: 'Shampoo Premium Test',
          quantity: 1,
          price: 29.90
        }
      ],
      total: 29.90,
      paymentMethod: 'stripe'
    };

    const response = await request.post('/api/send-email/order-confirmation', {
      data: orderData
    });

    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.emailSent).toBe(true);
    expect(responseData.orderId).toBe(orderData.orderId);
  });

  test('Testar newsletter via API', async ({ request }) => {
    const response = await request.post('/api/newsletter', {
      data: {
        email: 'newsletter-teste@jchairstudio.com',
        name: 'Cliente Newsletter'
      }
    });

    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.subscribed).toBe(true);
  });

  test('Testar email de recuperação de senha', async ({ request }) => {
    const response = await request.post('/api/auth/forgot-password', {
      data: {
        email: 'reset-teste@jchairstudio.com'
      }
    });

    // Pode retornar 200 mesmo se email não existir (por segurança)
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const responseData = await response.json();
      expect(responseData.message).toContain('email');
    }
  });

  test('Validar configuração do SendGrid', async ({ request }) => {
    // Testar se as configurações do SendGrid estão corretas
    const response = await request.get('/api/health/email');

    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.emailService).toBe('configured');
    expect(responseData.sendgrid).toBe(true);
  });
});