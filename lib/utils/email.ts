import sgMail from '@sendgrid/mail';

import { env } from '@/lib/env';
import logger from '@/lib/logger';

// Configuração condicional do SendGrid
if (env.SENDGRID_API_KEY) {
  sgMail.setApiKey(env.SENDGRID_API_KEY);
  logger.info('SendGrid configurado com sucesso');
} else {
  logger.warn('SENDGRID_API_KEY não configurada - emails serão simulados em desenvolvimento');
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // Se SENDGRID_API_KEY não estiver configurada, simular envio
    if (!env.SENDGRID_API_KEY) {
      logger.info('📧 [SIMULAÇÃO] Email seria enviado para:', {
        to: emailData.to,
        subject: emailData.subject,
        sandbox: true
      });
      return true;
    }

    const msg = {
      to: emailData.to,
      from: env.FROM_EMAIL || 'orders@jchairstudios62.com',
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
      mail_settings: {
        sandbox_mode: {
          enable: process.env.NODE_ENV !== 'production',
        },
      },
    };

    await sgMail.send(msg);
    logger.info('Email enviado com sucesso para:', emailData.to);
    return true;
  } catch (error) {
    logger.error('Erro ao enviar email:', error);
    return false;
  }
}

export function generateOrderConfirmationEmail(orderData: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
}): EmailData {
  const itemsHtml = orderData.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">R$ ${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmação de Pedido - JC Hair Studio's 62</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ff6b9d; margin: 0;">JC Hair Studio's 62</h1>
          <p style="color: #666; margin: 5px 0;">Confirmação de Pedido</p>
        </div>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #333;">Olá, ${orderData.customerName}!</h2>
          <p>Recebemos seu pedido com sucesso. Aqui estão os detalhes:</p>

          <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Número do Pedido:</strong> #${orderData.orderId}</p>
            <p><strong>Email:</strong> ${orderData.customerEmail}</p>
            <p><strong>Forma de Pagamento:</strong> ${orderData.paymentMethod}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #ff6b9d; padding-bottom: 10px;">Itens do Pedido</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Produto</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qtd</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Preço</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #f5f5f5; font-weight: bold;">
                <td colspan="2" style="padding: 15px; text-align: right; border-top: 2px solid #ddd;">Total:</td>
                <td style="padding: 15px; text-align: right; border-top: 2px solid #ddd;">R$ ${orderData.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="background: #e8f7ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #0066cc;">O que acontece agora?</h3>
          <p>✅ Seu pedido foi confirmado<br>
          📦 Processaremos seu pedido em até 24 horas<br>
          🚚 Você receberá informações de entrega em breve<br>
          📞 Em caso de dúvidas, entre em contato conosco</p>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; margin: 0;">Obrigado por escolher o JC Hair Studio's 62!</p>
          <p style="color: #666; margin: 5px 0;">💄 Beleza que transforma 💄</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    JC Hair Studio's 62 - Confirmação de Pedido

    Olá, ${orderData.customerName}!

    Recebemos seu pedido com sucesso.

    Número do Pedido: #${orderData.orderId}
    Email: ${orderData.customerEmail}
    Forma de Pagamento: ${orderData.paymentMethod}

    Itens do Pedido:
    ${orderData.items.map(item => `- ${item.name} (${item.quantity}x) - R$ ${item.price.toFixed(2)}`).join('\n')}

    Total: R$ ${orderData.total.toFixed(2)}

    Obrigado por escolher o JC Hair Studio's 62!
  `;

  return {
    to: orderData.customerEmail,
    subject: `Pedido Confirmado #${orderData.orderId} - JC Hair Studio's 62`,
    html,
    text
  };
}

export function generateSupportEmail(contactData: {
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  orderId?: string;
  phone?: string;
}): EmailData {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Mensagem de Contato - JC Hair Studio's 62</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ff6b9d; margin: 0;">JC Hair Studio's 62</h1>
          <p style="color: #666; margin: 5px 0;">Nova Mensagem de Contato</p>
        </div>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #333;">Dados do Cliente</h2>

          <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Nome:</strong> ${contactData.customerName}</p>
            <p><strong>Email:</strong> ${contactData.customerEmail}</p>
            ${contactData.phone ? `<p><strong>Telefone:</strong> ${contactData.phone}</p>` : ''}
            ${contactData.orderId ? `<p><strong>Pedido:</strong> #${contactData.orderId}</p>` : ''}
            <p><strong>Assunto:</strong> ${contactData.subject}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #ff6b9d; padding-bottom: 10px;">Mensagem</h3>
          <div style="background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #ff6b9d; margin-top: 15px;">
            <p style="margin: 0; white-space: pre-wrap;">${contactData.message}</p>
          </div>
        </div>

        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ffeaa7;">
          <h3 style="margin-top: 0; color: #856404;">⏰ Ação Necessária</h3>
          <p>📧 Responder para: ${contactData.customerEmail}<br>
          📞 ${contactData.phone ? `Telefone: ${contactData.phone}` : 'Telefone não informado'}<br>
          🎯 Prioridade: ${contactData.orderId ? 'ALTA (cliente com pedido)' : 'NORMAL'}</p>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; margin: 0;">Mensagem recebida em ${new Date().toLocaleString('pt-BR')}</p>
          <p style="color: #666; margin: 5px 0;">💄 JC Hair Studio's 62 - Atendimento 💄</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    JC Hair Studio's 62 - Nova Mensagem de Contato

    DADOS DO CLIENTE:
    Nome: ${contactData.customerName}
    Email: ${contactData.customerEmail}
    ${contactData.phone ? `Telefone: ${contactData.phone}` : ''}
    ${contactData.orderId ? `Pedido: #${contactData.orderId}` : ''}
    Assunto: ${contactData.subject}

    MENSAGEM:
    ${contactData.message}

    Responder para: ${contactData.customerEmail}
    Recebido em: ${new Date().toLocaleString('pt-BR')}
  `;

  return {
    to: env.SUPPORT_EMAIL || env.FROM_EMAIL || 'suporte@jchairstudios62.com',
    subject: `[CONTATO] ${contactData.subject} - ${contactData.customerName}`,
    html,
    text
  };
}

export function generateShippedEmail(shippingData: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  trackingCode: string;
  carrier: string;
  estimatedDelivery: string;
  shippingAddress: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}): EmailData {
  const itemsList = shippingData.items.map(item =>
    `<li style="margin: 5px 0;">${item.quantity}x ${item.name}</li>`
  ).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Pedido Despachado - JC Hair Studio's 62</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ff6b9d; margin: 0;">JC Hair Studio's 62</h1>
          <p style="color: #666; margin: 5px 0;">Seu Pedido Foi Despachado! 📦</p>
        </div>

        <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #c3e6cb;">
          <h2 style="margin-top: 0; color: #155724;">🚚 Boa notícia, ${shippingData.customerName}!</h2>
          <p style="margin: 10px 0;">Seu pedido #${shippingData.orderId} foi despachado e está a caminho!</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #333;">📋 Informações do Envio</h3>

          <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>🏷️ Código de Rastreamento:</strong></p>
            <div style="background: #f1f3f4; padding: 15px; border-radius: 5px; text-align: center; margin: 10px 0;">
              <h3 style="margin: 0; color: #ff6b9d; font-family: monospace; letter-spacing: 2px;">${shippingData.trackingCode}</h3>
            </div>

            <p><strong>🚛 Transportadora:</strong> ${shippingData.carrier}</p>
            <p><strong>📅 Previsão de Entrega:</strong> ${shippingData.estimatedDelivery}</p>
            <p><strong>📍 Endereço de Entrega:</strong></p>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 5px 0;">
              ${shippingData.shippingAddress}
            </div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #ff6b9d; padding-bottom: 10px;">📦 Itens Enviados</h3>
          <ul style="background: white; padding: 20px; border-radius: 5px; margin-top: 15px;">
            ${itemsList}
          </ul>
        </div>

        <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #0066cc;">🔍 Como Rastrear Seu Pedido</h3>
          <p>1️⃣ Copie o código de rastreamento acima<br>
          2️⃣ Acesse o site da transportadora ${shippingData.carrier}<br>
          3️⃣ Cole o código na área de rastreamento<br>
          4️⃣ Acompanhe em tempo real a localização do seu pedido</p>

          <div style="text-align: center; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>💡 Dica:</strong> Salve este email para facilitar o rastreamento!</p>
          </div>
        </div>

        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ffeaa7;">
          <h3 style="margin-top: 0; color: #856404;">📞 Precisa de Ajuda?</h3>
          <p>🤝 Nossa equipe está pronta para ajudar<br>
          📧 Responda este email com suas dúvidas<br>
          🕒 Atendimento: Segunda a Sexta, 9h às 18h</p>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; margin: 0;">Obrigado por escolher o JC Hair Studio's 62!</p>
          <p style="color: #666; margin: 5px 0;">💄 Beleza que transforma, entrega que surpreende 💄</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    JC Hair Studio's 62 - Pedido Despachado!

    Olá, ${shippingData.customerName}!

    Seu pedido #${shippingData.orderId} foi despachado e está a caminho!

    INFORMAÇÕES DO ENVIO:
    Código de Rastreamento: ${shippingData.trackingCode}
    Transportadora: ${shippingData.carrier}
    Previsão de Entrega: ${shippingData.estimatedDelivery}

    Endereço de Entrega:
    ${shippingData.shippingAddress}

    ITENS ENVIADOS:
    ${shippingData.items.map(item => `- ${item.quantity}x ${item.name}`).join('\n')}

    Para rastrear seu pedido:
    1. Acesse o site da ${shippingData.carrier}
    2. Insira o código: ${shippingData.trackingCode}
    3. Acompanhe a entrega em tempo real

    Obrigado por escolher o JC Hair Studio's 62!
  `;

  return {
    to: shippingData.customerEmail,
    subject: `📦 Pedido #${shippingData.orderId} Despachado - Código: ${shippingData.trackingCode}`,
    html,
    text
  };
}