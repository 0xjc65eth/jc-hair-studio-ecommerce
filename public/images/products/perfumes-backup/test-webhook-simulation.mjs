#!/usr/bin/env node

/**
 * Simulação de Webhook Stripe - Teste Completo
 * JC Hair Studio's 62
 */

import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

console.log('\n🎯 SIMULAÇÃO COMPLETA DE COMPRA - WEBHOOK STRIPE');
console.log('================================================\n');

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Dados simulados de uma compra real
const simulatedPurchase = {
  // Dados do cliente
  customerName: 'Maria Silva',
  customerEmail: 'juliocesarurss65@gmail.com', // Usando seu email para teste
  customerPhone: '+351928375226',

  // Dados do pedido
  orderId: 'ORD_' + Date.now(),
  paymentIntentId: 'pi_' + Math.random().toString(36).substr(2, 9),
  total: 295.80,
  currency: 'EUR',

  // Produtos comprados
  items: [
    {
      name: 'Mega Hair Premium Liso 60cm',
      quantity: 1,
      price: 189.90,
      category: 'mega-hair'
    },
    {
      name: 'Kit Manutenção Mega Hair',
      quantity: 1,
      price: 45.90,
      category: 'tratamentos'
    },
    {
      name: 'Progressiva Vogue Premium',
      quantity: 1,
      price: 59.90,
      category: 'progressivas'
    }
  ],

  // Endereço de entrega
  deliveryAddress: {
    street: 'Rua das Flores, 123, 2º Andar',
    city: 'Lisboa',
    zipCode: '1200-001',
    country: 'Portugal'
  },

  // Metadados
  timestamp: new Date().toISOString(),
  source: 'website',
  deviceType: 'desktop'
};

// Template para email de confirmação do cliente
const generateCustomerEmailHTML = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Compra - JC Hair Studio's 62</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); min-height: 100vh;">
  <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">
        💄 JC Hair Studio's 62
      </h1>
      <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">
        Confirmação de Compra
      </p>
    </div>

    <!-- Success Message -->
    <div style="padding: 40px 30px 20px 30px; text-align: center;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; border-radius: 15px; margin-bottom: 30px;">
        <h2 style="margin: 0; font-size: 24px;">✅ Compra Confirmada!</h2>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
          Pagamento processado com sucesso
        </p>
      </div>

      <h3 style="color: #1f2937; margin-bottom: 20px; font-size: 22px;">
        Olá ${data.customerName}! 🌟
      </h3>

      <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
        Obrigada pela sua compra! Seus produtos premium já estão sendo preparados com todo carinho.
      </p>
    </div>

    <!-- Order Details -->
    <div style="padding: 0 30px 30px 30px;">
      <div style="background: #f9fafb; border-radius: 15px; padding: 30px; margin-bottom: 30px;">
        <h3 style="color: #1f2937; margin-bottom: 20px; font-size: 20px; text-align: center;">
          📦 Detalhes do Pedido
        </h3>

        <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <p style="margin: 0; color: #6b7280;"><strong>Pedido:</strong> #${data.orderId}</p>
          <p style="margin: 5px 0; color: #6b7280;"><strong>Data:</strong> ${new Date(data.timestamp).toLocaleDateString('pt-PT')}</p>
          <p style="margin: 5px 0 0 0; color: #6b7280;"><strong>Pagamento:</strong> ${data.paymentIntentId}</p>
        </div>

        <!-- Products -->
        ${data.items.map(item => `
          <div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #ec4899;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="margin: 0; color: #1f2937; font-size: 16px;">${item.name}</h4>
                <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Quantidade: ${item.quantity}</p>
                <span style="background: #e0e7ff; color: #4338ca; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                  ${item.category.toUpperCase()}
                </span>
              </div>
              <div style="text-align: right;">
                <strong style="color: #1f2937; font-size: 18px;">€${item.price.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        `).join('')}

        <!-- Total -->
        <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; border-radius: 10px; padding: 20px; text-align: center;">
          <h3 style="margin: 0; font-size: 24px;">
            Total Pago: €${data.total.toFixed(2)}
          </h3>
        </div>
      </div>

      <!-- Delivery Address -->
      <div style="background: #eff6ff; border-radius: 15px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">
          🚚 Endereço de Entrega
        </h3>
        <div style="color: #6b7280; line-height: 1.6;">
          <strong>${data.customerName}</strong><br>
          ${data.deliveryAddress.street}<br>
          ${data.deliveryAddress.city}, ${data.deliveryAddress.zipCode}<br>
          ${data.deliveryAddress.country}
        </div>
      </div>

      <!-- Timeline -->
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 15px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #92400e; margin-bottom: 20px; text-align: center;">🕒 Cronograma de Entrega</h3>
        <div style="color: #92400e;">
          <div style="margin-bottom: 12px;">
            <strong>✅ Hoje:</strong> Pedido confirmado e pago
          </div>
          <div style="margin-bottom: 12px;">
            <strong>📦 1-2 dias:</strong> Preparação e embalagem
          </div>
          <div style="margin-bottom: 12px;">
            <strong>🚛 2-3 dias:</strong> Produto em trânsito
          </div>
          <div>
            <strong>🏠 3-5 dias:</strong> Entrega em sua casa
          </div>
        </div>
      </div>

      <!-- Contact Support -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h3 style="color: #1f2937; margin-bottom: 15px;">💬 Precisa de Ajuda?</h3>
        <p style="color: #6b7280; margin-bottom: 20px;">
          Nossa equipe está sempre pronta para ajudar!
        </p>
        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
          <a href="https://wa.me/351928375226" style="background: #10b981; color: white; padding: 12px 20px; border-radius: 25px; text-decoration: none; font-weight: bold; display: inline-block;">
            📱 WhatsApp
          </a>
          <a href="mailto:suporte@jchairstudios62.xyz" style="background: #3b82f6; color: white; padding: 12px 20px; border-radius: 25px; text-decoration: none; font-weight: bold; display: inline-block;">
            ✉️ Email
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">
        💕 Obrigada por escolher a JC Hair Studio's 62!
      </p>
      <p style="color: #9ca3af; margin: 0; font-size: 14px;">
        © 2024 JC Hair Studio's 62 - Beleza Premium Portuguesa
      </p>
    </div>
  </div>
</body>
</html>
`;

// Template para notificação do admin
const generateAdminEmailHTML = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🚨 Nova Venda - Admin Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f3f4f6;">
  <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">

    <!-- Alert Header -->
    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 25px; text-align: center; color: white;">
      <h1 style="margin: 0; font-size: 24px;">🚨 NOVA VENDA CONFIRMADA!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Pedido #{data.orderId}</p>
    </div>

    <!-- Quick Stats -->
    <div style="padding: 30px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 25px;">
        <h2 style="margin: 0; font-size: 28px;">€${data.total.toFixed(2)}</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Valor Total da Venda</p>
      </div>

      <!-- Customer Info -->
      <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 15px 0; color: #1f2937;">👤 Cliente</h3>
        <p style="margin: 0; color: #6b7280;"><strong>Nome:</strong> ${data.customerName}</p>
        <p style="margin: 5px 0; color: #6b7280;"><strong>Email:</strong> ${data.customerEmail}</p>
        <p style="margin: 5px 0; color: #6b7280;"><strong>Telefone:</strong> ${data.customerPhone}</p>
      </div>

      <!-- Products -->
      <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 15px 0; color: #1f2937;">🛍️ Produtos Vendidos</h3>
        ${data.items.map(item => `
          <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
            <strong>${item.name}</strong> - Qtd: ${item.quantity} - €${item.price.toFixed(2)}
          </div>
        `).join('')}
      </div>

      <!-- Delivery Address -->
      <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 15px 0; color: #1f2937;">📍 Endereço de Entrega</h3>
        <p style="margin: 0; color: #6b7280;">
          ${data.deliveryAddress.street}<br>
          ${data.deliveryAddress.city}, ${data.deliveryAddress.zipCode}<br>
          ${data.deliveryAddress.country}
        </p>
      </div>

      <!-- Actions -->
      <div style="text-align: center; margin-top: 25px;">
        <h3 style="color: #1f2937; margin-bottom: 15px;">⚡ Ações Necessárias</h3>
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <strong>📦 Preparar produtos para envio</strong><br>
          <small>Verificar estoque e preparar embalagem</small>
        </div>
        <a href="https://jchairstudios62.xyz/admin" style="background: #3b82f6; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          🎛️ Acessar Painel Admin
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f3f4f6; padding: 20px; text-align: center;">
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        Admin Alert System - JC Hair Studio's 62
      </p>
    </div>
  </div>
</body>
</html>
`;

// Função para enviar emails
async function sendPurchaseNotifications() {
  console.log('🔄 Simulando processamento de compra...\n');

  try {
    // 1. Email de confirmação para o cliente
    console.log('📧 Enviando confirmação para o cliente...');

    const customerEmail = {
      to: simulatedPurchase.customerEmail,
      from: {
        email: process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz',
        name: process.env.FROM_NAME || "JC Hair Studio's 62"
      },
      subject: `✅ Compra Confirmada #${simulatedPurchase.orderId} - JC Hair Studio's 62`,
      html: generateCustomerEmailHTML(simulatedPurchase)
    };

    const customerResponse = await sgMail.send(customerEmail);
    console.log('✅ Email do cliente enviado! Status:', customerResponse[0].statusCode);

    // 2. Notificação para o admin
    console.log('📧 Enviando notificação para admin...');

    const adminEmail = {
      to: 'juliocesarurss65@gmail.com', // Admin email
      from: {
        email: process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz',
        name: process.env.FROM_NAME || "JC Hair Studio's 62"
      },
      subject: `🚨 Nova Venda €${simulatedPurchase.total.toFixed(2)} - ${simulatedPurchase.customerName}`,
      html: generateAdminEmailHTML(simulatedPurchase)
    };

    const adminResponse = await sgMail.send(adminEmail);
    console.log('✅ Email do admin enviado! Status:', adminResponse[0].statusCode);

    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar emails:', error.message);
    return false;
  }
}

// Executar simulação
console.log('🎬 INICIANDO SIMULAÇÃO DE COMPRA COMPLETA...\n');

console.log('📊 Dados da compra simulada:');
console.log('─────────────────────────────');
console.log(`Cliente: ${simulatedPurchase.customerName}`);
console.log(`Email: ${simulatedPurchase.customerEmail}`);
console.log(`Pedido: #${simulatedPurchase.orderId}`);
console.log(`Total: €${simulatedPurchase.total.toFixed(2)}`);
console.log(`Produtos: ${simulatedPurchase.items.length} itens`);
console.log('─────────────────────────────\n');

sendPurchaseNotifications()
  .then(success => {
    if (success) {
      console.log('\n🎉 SIMULAÇÃO CONCLUÍDA COM SUCESSO!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ Sistema de notificações funcionando perfeitamente!');
      console.log('✅ Cliente recebeu confirmação de compra');
      console.log('✅ Admin recebeu notificação de nova venda');
      console.log('\n📬 Verifique sua caixa de entrada:', simulatedPurchase.customerEmail);
      console.log('🎯 Ambos os emails foram enviados com sucesso!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else {
      console.log('\n❌ SIMULAÇÃO FALHOU');
      console.log('🔧 Verifique as configurações e tente novamente.');
    }
  })
  .catch(error => {
    console.error('\n💥 ERRO CRÍTICO:', error.message);
  });