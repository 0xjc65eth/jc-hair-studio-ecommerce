#!/usr/bin/env node

/**
 * Teste Direto do Sistema de Emails
 * JC Hair Studio's 62
 */

import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

console.log('\n🧪 TESTE DIRETO DO SISTEMA DE EMAILS');
console.log('====================================\n');

// Configurar SendGrid
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error('❌ SENDGRID_API_KEY não encontrada');
  process.exit(1);
}

sgMail.setApiKey(apiKey);
console.log('✅ SendGrid configurado');

// Template de email de pedido
const generateOrderEmailHTML = (orderData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Pedido - JC Hair Studio's 62</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); min-height: 100vh;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; margin-top: 20px; margin-bottom: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
        🌟 JC Hair Studio's 62
      </h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
        Confirmação de Pedido
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">
        Olá ${orderData.customerName}! 👋
      </h2>

      <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
        Recebemos seu pedido com sucesso! Aqui estão os detalhes:
      </p>

      <!-- Order Details -->
      <div style="background: #f9fafb; border-radius: 15px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">
          📦 Pedido #${orderData.orderId}
        </h3>

        ${orderData.items.map(item => `
          <div style="border-bottom: 1px solid #e5e7eb; padding: 15px 0; display: flex; justify-content: space-between;">
            <div>
              <strong style="color: #1f2937;">${item.name}</strong><br>
              <span style="color: #6b7280;">Quantidade: ${item.quantity}</span>
            </div>
            <div style="text-align: right;">
              <strong style="color: #1f2937;">€${item.price.toFixed(2)}</strong>
            </div>
          </div>
        `).join('')}

        <div style="padding-top: 15px; text-align: right;">
          <strong style="color: #1f2937; font-size: 18px;">
            Total: €${orderData.total.toFixed(2)}
          </strong>
        </div>
      </div>

      <!-- Next Steps -->
      <div style="background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); border-radius: 15px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #1f2937; margin-bottom: 15px;">🚀 Próximos Passos</h3>
        <ol style="color: #6b7280; margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Preparação do seu pedido (1-2 dias úteis)</li>
          <li style="margin-bottom: 8px;">Embalagem e envio (2-3 dias úteis)</li>
          <li style="margin-bottom: 8px;">Entrega em sua casa (3-5 dias úteis)</li>
          <li>Aproveite seus produtos premium!</li>
        </ol>
      </div>

      <!-- Contact -->
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #6b7280; margin-bottom: 15px;">
          Precisa de ajuda? Entre em contato:
        </p>
        <a href="https://wa.me/351928375226" style="background: #10b981; color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; display: inline-block; font-weight: bold;">
          💬 WhatsApp Suporte
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; margin: 0; font-size: 14px;">
        © 2024 JC Hair Studio's 62 - Beleza Premium Portuguesa
      </p>
    </div>
  </div>
</body>
</html>
`;

// Dados de teste
const testOrderData = {
  orderId: 'TEST_' + Date.now(),
  customerName: 'Júlio César',
  customerEmail: 'juliocesarurss65@gmail.com',
  total: 150.50,
  items: [
    {
      name: 'Mega Hair Premium Brasileiro',
      quantity: 1,
      price: 150.50
    }
  ]
};

// Função para enviar email
async function sendTestEmail() {
  try {
    console.log('📧 Enviando email de teste para:', testOrderData.customerEmail);

    const msg = {
      to: testOrderData.customerEmail,
      from: {
        email: process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz',
        name: process.env.FROM_NAME || "JC Hair Studio's 62"
      },
      subject: `✅ Confirmação de Pedido #${testOrderData.orderId} - JC Hair Studio's 62`,
      html: generateOrderEmailHTML(testOrderData),
      text: `Olá ${testOrderData.customerName}! Recebemos seu pedido #${testOrderData.orderId} no valor de €${testOrderData.total.toFixed(2)}. Obrigado pela sua compra!`
    };

    const response = await sgMail.send(msg);

    console.log('✅ Email enviado com sucesso!');
    console.log('📬 Status:', response[0].statusCode);
    console.log('🎯 Message ID:', response[0].headers['x-message-id']);
    console.log('\n📧 Verifique sua caixa de entrada:', testOrderData.customerEmail);

    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error.message);
    if (error.response) {
      console.error('📋 Resposta do SendGrid:', error.response.body);
    }
    return false;
  }
}

// Executar teste
sendTestEmail()
  .then(success => {
    if (success) {
      console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
      console.log('🔥 O sistema de emails está funcionando perfeitamente!');
    } else {
      console.log('\n❌ TESTE FALHOU');
      console.log('🔧 Verifique as configurações e tente novamente.');
    }
  })
  .catch(error => {
    console.error('\n💥 ERRO CRÍTICO:', error.message);
  });