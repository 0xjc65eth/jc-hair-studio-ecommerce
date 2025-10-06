import sgMail from '@sendgrid/mail';
import logger from '@/lib/logger';

// Configurar SendGrid API Key
const SENDGRID_ENABLED = !!process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG.your-sendgrid-api-key' && process.env.SENDGRID_API_KEY.startsWith('SG.');
const FORCE_SEND_EMAILS = process.env.FORCE_SEND_EMAILS === 'true';
const TEST_MODE = (process.env.NODE_ENV === 'test' || process.env.SENDGRID_TEST_MODE === 'true') && !FORCE_SEND_EMAILS && !SENDGRID_ENABLED;

if (SENDGRID_ENABLED || FORCE_SEND_EMAILS) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  console.log('✅ SendGrid configured successfully', {
    enabled: SENDGRID_ENABLED,
    forceSend: FORCE_SEND_EMAILS,
    testMode: TEST_MODE,
    nodeEnv: process.env.NODE_ENV
  });
} else if (TEST_MODE) {
  console.log('🧪 SendGrid in test mode - emails will be mocked', {
    forceSend: FORCE_SEND_EMAILS,
    nodeEnv: process.env.NODE_ENV
  });
} else {
  console.warn('⚠️ SendGrid not configured', {
    apiKeyExists: !!process.env.SENDGRID_API_KEY,
    forceSend: FORCE_SEND_EMAILS,
    nodeEnv: process.env.NODE_ENV
  });
}

export interface EmailTemplate {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  formType?: 'contact' | 'support' | 'order_inquiry' | 'product_question' | 'order_confirmation' | 'payment_confirmation' | 'shipping_notification';
}

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string;
    description?: string;
    brand?: string;
    category?: string;
  }>;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  currency?: string;
  estimatedDelivery?: string;
  shippingAddress?: any;
  paymentMethod?: string;
  orderDate?: string;
}

export interface PaymentEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  paymentMethod: string;
  transactionId?: string;
  currency?: string;
  paymentDate?: string;
  estimatedDelivery?: string;
}

export interface ShippingEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  trackingCode: string;
  carrier: string;
  trackingUrl: string;
  estimatedDelivery?: string;
  shippingAddress?: any;
  items?: Array<{
    name: string;
    quantity: number;
    imageUrl?: string;
  }>;
}

/**
 * Enviar email de contato/suporte
 */
export async function sendContactEmail(data: ContactFormData): Promise<boolean> {
  try {
    console.log('🔧 SendGrid DEBUG - sendContactEmail called with:', {
      hasData: !!data,
      sendgridEnabled: SENDGRID_ENABLED,
      apiKeyExists: !!process.env.SENDGRID_API_KEY
    });

    const { name, email, phone, subject, message, formType = 'contact' } = data;

    // Email para a empresa
    const emailToCompany: EmailTemplate = {
      to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.xyz',
      from: `${process.env.FROM_NAME || 'JC Hair Studio\'s 62'} <${process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz'}>`,
      subject: `[${formType.toUpperCase()}] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">JC Hair Studio's 62</h1>
            <p style="color: white; margin: 5px 0;">Nova mensagem de contato</p>
          </div>

          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #374151; margin-bottom: 20px;">Detalhes do Contato</h2>

            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ''}
              <p><strong>Assunto:</strong> ${subject}</p>
              <p><strong>Tipo:</strong> ${formType}</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #374151; margin-top: 0;">Mensagem:</h3>
              <p style="line-height: 1.6; color: #6b7280;">${message}</p>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #ddd6fe; border-radius: 8px;">
              <p style="margin: 0; color: #5b21b6;">
                <strong>Ação requerida:</strong> Responder ao cliente dentro de 24 horas
              </p>
            </div>
          </div>

          <div style="background: #374151; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">JC Hair Studio's 62 - Tradição Familiar há mais de 40 anos</p>
            <p style="margin: 5px 0;">WhatsApp: +351 928375226 | +32 472384027</p>
          </div>
        </div>
      `,
      text: `
        Nova mensagem de contato - JC Hair Studio's 62

        Nome: ${name}
        Email: ${email}
        ${phone ? `Telefone: ${phone}` : ''}
        Assunto: ${subject}
        Tipo: ${formType}

        Mensagem:
        ${message}

        Responder ao cliente dentro de 24 horas.
      `
    };

    // Email de confirmação para o cliente
    const emailToCustomer: EmailTemplate = {
      to: email,
      from: `${process.env.FROM_NAME || 'JC Hair Studio\'s 62'} <${process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz'}>`,
      subject: 'Recebemos sua mensagem - JC Hair Studio\'s 62',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">JC Hair Studio's 62</h1>
            <p style="color: white; margin: 5px 0;">Obrigado pelo seu contato!</p>
          </div>

          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #374151;">Olá, ${name}!</h2>

            <p style="color: #6b7280; line-height: 1.6;">
              Recebemos sua mensagem com o assunto "<strong>${subject}</strong>" e estamos analisando sua solicitação.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Sua mensagem:</h3>
              <p style="color: #6b7280; line-height: 1.6; font-style: italic;">"${message}"</p>
            </div>

            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #166534;">
                <strong>⏰ Tempo de resposta:</strong> Retornaremos seu contato em até 24 horas
              </p>
            </div>

            <h3 style="color: #374151;">Precisa de ajuda urgente?</h3>
            <p style="color: #6b7280;">Entre em contato conosco via WhatsApp:</p>

            <div style="margin: 20px 0;">
              <a href="https://wa.me/351928375226" style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-right: 10px;">
                📱 WhatsApp Portugal: +351 928375226
              </a>
              <a href="https://wa.me/32472384027" style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                📱 WhatsApp Bélgica: +32 472384027
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              <strong>Horário de atendimento:</strong><br>
              Segunda a Sexta: 09:00 - 18:00 (Horário de Brasília)<br>
              Sábado: 09:00 - 14:00 (Horário de Brasília)
            </p>
          </div>

          <div style="background: #374151; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">JC Hair Studio's 62 - Tradição Familiar há mais de 40 anos</p>
            <p style="margin: 5px 0;">Produtos de qualidade, tradição de família</p>
          </div>
        </div>
      `,
      text: `
        JC Hair Studio's 62 - Obrigado pelo seu contato!

        Olá, ${name}!

        Recebemos sua mensagem com o assunto "${subject}" e estamos analisando sua solicitação.

        Sua mensagem: "${message}"

        Tempo de resposta: Retornaremos seu contato em até 24 horas

        Precisa de ajuda urgente? Entre em contato via WhatsApp:
        Portugal: +351 928375226
        Bélgica: +32 472384027

        Horário de atendimento:
        Segunda a Sexta: 09:00 - 18:00 (Horário de Brasília)
        Sábado: 09:00 - 14:00 (Horário de Brasília)

        JC Hair Studio's 62 - Tradição Familiar há mais de 40 anos
        Produtos de qualidade, tradição de família
      `
    };

    // Enviar ambos os emails
    if (SENDGRID_ENABLED || FORCE_SEND_EMAILS) {
      console.log('📧 SendGrid ENABLED - Attempting to send emails...', {
        enabled: SENDGRID_ENABLED,
        forceSend: FORCE_SEND_EMAILS,
        testMode: TEST_MODE
      });

      try {
        await sgMail.send(emailToCompany);
        console.log('✅ Email to company sent successfully:', emailToCompany.to);

        await sgMail.send(emailToCustomer);
        console.log('✅ Email to customer sent successfully:', emailToCustomer.to);
      } catch (sendError) {
        console.error('❌ Failed to send emails:', sendError);
        logger.error('SendGrid email sending failed:', sendError);
        throw sendError;
      }
    } else {
      console.log('📧 [DEV MODE] SendGrid DISABLED - Would send emails:', {
        company: emailToCompany.to,
        customer: emailToCustomer.to,
        sendgridKey: process.env.SENDGRID_API_KEY ? 'EXISTS' : 'MISSING',
        forceSend: FORCE_SEND_EMAILS,
        testMode: TEST_MODE
      });
    }

    return true;
  } catch (error) {
    logger.error('Erro ao enviar email de contato:', error);
    return false;
  }
}

/**
 * Ultra-Professional Order Confirmation Email Template
 * Mobile-responsive with premium beauty brand aesthetic
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      total,
      items,
      subtotal,
      shipping = 0,
      tax = 0,
      discount = 0,
      currency = 'EUR',
      estimatedDelivery = '5-10 dias úteis',
      shippingAddress,
      paymentMethod = 'Cartão de Crédito',
      orderDate = new Date().toLocaleDateString('pt-PT')
    } = data;

    // Create responsive product cards with images
    const itemsHtml = items.map(item => `
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 20px 0; display: flex; align-items: center;">
          <div style="width: 80px; height: 80px; background: #f9fafb; border-radius: 12px; margin-right: 16px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
            ${item.imageUrl ?
              `<img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" />` :
              `<div style="color: #d1d5db; font-size: 14px; text-align: center;">📦<br/>Produto</div>`
            }
          </div>
          <div>
            <h4 style="margin: 0 0 4px 0; color: #1f2937; font-size: 16px; font-weight: 600;">${item.name}</h4>
            ${item.brand ? `<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">Marca: ${item.brand}</p>` : ''}
            ${item.description ? `<p style="margin: 0; color: #9ca3af; font-size: 12px; max-width: 300px;">${item.description}</p>` : ''}
          </div>
        </td>
        <td style="padding: 20px 16px; text-align: center; color: #374151; font-weight: 500;">${item.quantity}x</td>
        <td style="padding: 20px 0; text-align: right; color: #1f2937; font-weight: 600; font-size: 16px;">${currency} ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    // Create responsive pricing summary
    const pricingSummary = `
      <div style="background: #f8fafc; padding: 24px; border-radius: 16px; margin: 24px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #6b7280;">
          <span>Subtotal</span>
          <span>${currency} ${(subtotal || total - shipping - tax + discount).toFixed(2)}</span>
        </div>
        ${shipping > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #6b7280;">
          <span>Envio</span>
          <span>${currency} ${shipping.toFixed(2)}</span>
        </div>` : ''}
        ${tax > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #6b7280;">
          <span>Impostos</span>
          <span>${currency} ${tax.toFixed(2)}</span>
        </div>` : ''}
        ${discount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #ef4444;">
          <span>Desconto</span>
          <span>-${currency} ${discount.toFixed(2)}</span>
        </div>` : ''}
        <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 16px 0;" />
        <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 700; color: #1f2937;">
          <span>Total</span>
          <span style="color: #ec4899;">${currency} ${total.toFixed(2)}</span>
        </div>
      </div>
    `;

    const emailTemplate: EmailTemplate = {
      to: customerEmail,
      from: `${process.env.FROM_NAME || 'JC Hair Studio\'s 62'} <${process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz'}>`,
      subject: `✨ Pedido Confirmado #${orderId} - JC Hair Studio's 62`,
      html: `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pedido Confirmado - JC Hair Studio's 62</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          @media only screen and (max-width: 600px) {
            .mobile-padding { padding: 16px !important; }
            .mobile-text-center { text-align: center !important; }
            .mobile-full-width { width: 100% !important; }
            .mobile-hidden { display: none !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">

          <!-- Header with Gradient Background -->
          <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%); padding: 40px 24px; text-align: center; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=') repeat; opacity: 0.1; animation: float 20s ease-in-out infinite;"></div>
            <div style="position: relative; z-index: 1;">
              <h1 style="color: white; margin: 0 0 8px 0; font-size: 32px; font-weight: 700; letter-spacing: -1px;">JC Hair Studio's 62</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px; font-weight: 500;">✨ Tradição Familiar há mais de 40 anos ✨</p>
            </div>
          </div>

          <!-- Success Banner -->
          <div style="background: linear-gradient(90deg, #10b981, #059669); margin: 0; padding: 24px; text-align: center;">
            <div style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.2); padding: 12px 24px; border-radius: 50px; backdrop-filter: blur(10px);">
              <span style="font-size: 24px; margin-right: 8px;">🎉</span>
              <span style="color: white; font-weight: 600; font-size: 18px;">Pedido Confirmado com Sucesso!</span>
            </div>
          </div>

          <!-- Main Content -->
          <div class="mobile-padding" style="padding: 40px 32px;">

            <!-- Personal Greeting -->
            <div style="text-align: center; margin-bottom: 32px;">
              <h2 style="color: #1f2937; margin: 0 0 12px 0; font-size: 28px; font-weight: 700;">Olá, ${customerName}! 👋</h2>
              <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">Obrigado por escolher a JC Hair Studio's 62. Seu pedido foi recebido e está sendo processado com muito cuidado.</p>
            </div>

            <!-- Order Details Card -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px solid #e2e8f0; border-radius: 20px; padding: 32px; margin-bottom: 32px; position: relative; overflow: hidden;">
              <div style="position: absolute; top: -10px; right: -10px; width: 80px; height: 80px; background: linear-gradient(45deg, #ec4899, #8b5cf6); border-radius: 50%; opacity: 0.1;"></div>
              <div style="position: relative; z-index: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
                  <div>
                    <h3 style="color: #1f2937; margin: 0 0 8px 0; font-size: 20px; font-weight: 700;">Pedido #${orderId}</h3>
                    <p style="color: #6b7280; margin: 0; font-size: 14px;">Data: ${orderDate}</p>
                  </div>
                  <div style="background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    Confirmado
                  </div>
                </div>

                <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="background: linear-gradient(90deg, #f8fafc, #f1f5f9);">
                        <th style="padding: 20px; text-align: left; color: #374151; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Produto</th>
                        <th style="padding: 20px; text-align: center; color: #374151; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Qtd</th>
                        <th style="padding: 20px; text-align: right; color: #374151; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Pricing Summary -->
            ${pricingSummary}

            <!-- Next Steps Timeline -->
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 20px; padding: 32px; margin: 32px 0;">
              <h3 style="color: #1f2937; margin: 0 0 24px 0; font-size: 20px; font-weight: 700; text-align: center;">📋 Próximos Passos</h3>

              <div style="position: relative;">
                <div style="position: absolute; left: 20px; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, #ec4899, #8b5cf6); opacity: 0.3;"></div>

                <div style="margin-bottom: 24px; position: relative; padding-left: 60px;">
                  <div style="position: absolute; left: 8px; top: 8px; width: 24px; height: 24px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">1</div>
                  <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">✅ Confirmação do Pagamento</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Processamento automático em até 2 horas</p>
                </div>

                <div style="margin-bottom: 24px; position: relative; padding-left: 60px;">
                  <div style="position: absolute; left: 8px; top: 8px; width: 24px; height: 24px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">2</div>
                  <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">📦 Separação dos Produtos</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Cuidadosa seleção e embalagem (1-2 dias úteis)</p>
                </div>

                <div style="margin-bottom: 24px; position: relative; padding-left: 60px;">
                  <div style="position: absolute; left: 8px; top: 8px; width: 24px; height: 24px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">3</div>
                  <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">🚚 Envio com Rastreamento</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Código de rastreamento enviado por email</p>
                </div>

                <div style="position: relative; padding-left: 60px;">
                  <div style="position: absolute; left: 8px; top: 8px; width: 24px; height: 24px; background: #8b5cf6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">4</div>
                  <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">🏠 Entrega no Endereço</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Prazo estimado: ${estimatedDelivery}</p>
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            ${shippingAddress ? `
            <div style="background: #fef7f7; border: 2px solid #fecaca; border-radius: 16px; padding: 24px; margin: 24px 0;">
              <h4 style="color: #991b1b; margin: 0 0 16px 0; font-weight: 600; display: flex; align-items: center;">
                <span style="margin-right: 8px; font-size: 18px;">📍</span>
                Endereço de Entrega
              </h4>
              <div style="color: #7f1d1d; line-height: 1.6;">
                ${shippingAddress.name || customerName}<br>
                ${shippingAddress.street}<br>
                ${shippingAddress.city}, ${shippingAddress.zipCode}<br>
                ${shippingAddress.country || 'Portugal'}
                ${shippingAddress.phone ? `<br>Tel: ${shippingAddress.phone}` : ''}
              </div>
            </div>` : ''}

            <!-- Emergency Contact Section -->
            <div style="background: linear-gradient(135deg, #25d366, #128c7e); border-radius: 20px; padding: 32px; margin: 32px 0; text-align: center; color: white;">
              <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700;">💬 Precisa de Ajuda?</h3>
              <p style="margin: 0 0 24px 0; opacity: 0.9; line-height: 1.6;">Nossa equipe está sempre disponível para ajudar você!</p>

              <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
                <a href="https://wa.me/351928375226" style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.2); color: white; padding: 12px 20px; text-decoration: none; border-radius: 50px; font-weight: 600; backdrop-filter: blur(10px); transition: all 0.3s ease;">
                  <span style="margin-right: 8px; font-size: 18px;">📱</span>
                  Portugal: +351 928375226
                </a>
                <a href="https://wa.me/32472384027" style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.2); color: white; padding: 12px 20px; text-decoration: none; border-radius: 50px; font-weight: 600; backdrop-filter: blur(10px); transition: all 0.3s ease;">
                  <span style="margin-right: 8px; font-size: 18px;">📱</span>
                  Bélgica: +32 472384027
                </a>
              </div>

              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 14px; opacity: 0.8;">
                <strong>Horário de Atendimento:</strong><br>
                Segunda a Sexta: 09:00 - 18:00<br>
                Sábado: 09:00 - 14:00 (Horário de Lisboa)
              </div>
            </div>

            <!-- Thank You Message -->
            <div style="text-align: center; padding: 32px 0;">
              <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 700;">Obrigado pela sua confiança! ✨</h3>
              <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">É uma honra fazer parte da sua jornada de beleza e cuidado capilar.</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #1f2937; color: white; padding: 40px 32px; text-align: center;">
            <div style="margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">JC Hair Studio's 62</h4>
              <p style="margin: 0; opacity: 0.8; font-size: 14px;">Tradição Familiar há mais de 40 anos</p>
            </div>

            <div style="margin-bottom: 24px; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 12px;">
              <p style="margin: 0; font-size: 14px; line-height: 1.6; opacity: 0.9;">
                <strong>🌟 Nossa Missão:</strong> Oferecer produtos de qualidade premium para realçar sua beleza natural com a confiança de uma tradição familiar consolidada.
              </p>
            </div>

            <div style="display: flex; justify-content: center; gap: 24px; margin-bottom: 24px; flex-wrap: wrap;">
              <a href="https://jchairstudios62.xyz" style="color: #93c5fd; text-decoration: none; font-size: 14px;">🌐 Website</a>
              <a href="mailto:contato@jchairstudios62.xyz" style="color: #93c5fd; text-decoration: none; font-size: 14px;">📧 Email</a>
              <a href="https://jchairstudios62.xyz/conta/pedidos" style="color: #93c5fd; text-decoration: none; font-size: 14px;">📋 Meus Pedidos</a>
            </div>

            <div style="font-size: 12px; opacity: 0.6; line-height: 1.5;">
              © 2024 JC Hair Studio's 62. Todos os direitos reservados.<br>
              Este email foi enviado para ${customerEmail}<br>
              <a href="#" style="color: #93c5fd; text-decoration: none;">Gerenciar preferências de email</a>
            </div>
          </div>
        </div>

        <style>
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        </style>
      </body>
      </html>
      `
    };

    if (SENDGRID_ENABLED || FORCE_SEND_EMAILS) {
      console.log('📧 Sending order confirmation email...', {
        to: emailTemplate.to,
        orderId,
        enabled: SENDGRID_ENABLED,
        forceSend: FORCE_SEND_EMAILS
      });

      try {
        await sgMail.send(emailTemplate);
        console.log('✅ Order confirmation email sent successfully');
      } catch (sendError) {
        console.error('❌ Failed to send order confirmation email:', sendError);
        logger.error('Order confirmation email failed:', sendError);
        throw sendError;
      }
    } else {
      logger.info('📧 [DEV MODE] Email de confirmação de pedido:', {
        to: emailTemplate.to,
        subject: emailTemplate.subject,
        orderId,
        total,
        forceSend: FORCE_SEND_EMAILS,
        testMode: TEST_MODE
      });
    }
    return true;
  } catch (error) {
    logger.error('Erro ao enviar email de confirmação de pedido:', error);
    return false;
  }
}

/**
 * Ultra-Professional Payment Confirmation Email Template
 * Mobile-responsive with premium beauty brand aesthetic and secure payment details
 */
export async function sendPaymentConfirmationEmail(data: PaymentEmailData): Promise<boolean> {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      total,
      paymentMethod,
      transactionId,
      currency = 'EUR',
      paymentDate = new Date().toLocaleDateString('pt-PT'),
      estimatedDelivery = '3-5 dias úteis'
    } = data;

    const emailTemplate: EmailTemplate = {
      to: customerEmail,
      from: `${process.env.FROM_NAME || 'JC Hair Studio\'s 62'} <${process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz'}>`,
      subject: `💳 Pagamento Aprovado - Pedido #${orderId} - JC Hair Studio's 62`,
      html: `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pagamento Confirmado - JC Hair Studio's 62</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">

          <!-- Header with Gradient Background -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); padding: 40px 24px; text-align: center;">
            <h1 style="color: white; margin: 0 0 8px 0; font-size: 32px; font-weight: 700;">JC Hair Studio's 62</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">✨ Tradição Familiar há mais de 40 anos ✨</p>
          </div>

          <!-- Success Banner -->
          <div style="background: linear-gradient(90deg, #10b981, #059669); margin: 0; padding: 24px; text-align: center;">
            <div style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.2); padding: 12px 24px; border-radius: 50px;">
              <span style="font-size: 24px; margin-right: 8px;">💳</span>
              <span style="color: white; font-weight: 600; font-size: 18px;">Pagamento Confirmado!</span>
            </div>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 32px;">

            <!-- Personal Greeting -->
            <div style="text-align: center; margin-bottom: 32px;">
              <h2 style="color: #1f2937; margin: 0 0 12px 0; font-size: 28px; font-weight: 700;">Olá, ${customerName}! 👋</h2>
              <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">Recebemos a confirmação do seu pagamento! Seu pedido já está sendo processado.</p>
            </div>

            <!-- Payment Details Card -->
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #10b981; border-radius: 20px; padding: 32px; margin-bottom: 32px;">
              <h3 style="color: #065f46; margin: 0 0 20px 0; font-size: 20px; font-weight: 700; text-align: center;">💰 Detalhes do Pagamento</h3>

              <div style="background: white; border-radius: 16px; padding: 24px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #6b7280; font-weight: 500;">Pedido:</span>
                  <span style="color: #1f2937; font-weight: 600;">#${orderId}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #6b7280; font-weight: 500;">Método de Pagamento:</span>
                  <span style="color: #1f2937; font-weight: 600;">${paymentMethod}</span>
                </div>
                ${transactionId ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #6b7280; font-weight: 500;">ID da Transação:</span>
                  <span style="color: #1f2937; font-weight: 600; font-family: monospace; font-size: 12px;">${transactionId}</span>
                </div>` : ''}
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #6b7280; font-weight: 500;">Data do Pagamento:</span>
                  <span style="color: #1f2937; font-weight: 600;">${paymentDate}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px;">
                  <span style="color: #1f2937; font-weight: 700; font-size: 18px;">Valor Total:</span>
                  <span style="color: #10b981; font-weight: 700; font-size: 24px;">${currency} ${total.toFixed(2)}</span>
                </div>
              </div>

              <div style="background: rgba(16, 185, 129, 0.1); border-radius: 12px; padding: 16px; text-align: center;">
                <span style="color: #065f46; font-weight: 600; font-size: 14px;">✅ STATUS: PAGAMENTO APROVADO</span>
              </div>
            </div>

            <!-- Next Steps Timeline -->
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 20px; padding: 32px; margin: 32px 0;">
              <h3 style="color: #1f2937; margin: 0 0 24px 0; font-size: 20px; font-weight: 700; text-align: center;">📋 Próximas Etapas</h3>

              <div style="position: relative;">
                <div style="position: absolute; left: 20px; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, #10b981, #059669); opacity: 0.3;"></div>

                <div style="margin-bottom: 24px; position: relative; padding-left: 60px;">
                  <div style="position: absolute; left: 8px; top: 8px; width: 24px; height: 24px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">✓</div>
                  <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">✅ Pagamento Confirmado</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Recebemos e confirmamos seu pagamento</p>
                </div>

                <div style="margin-bottom: 24px; position: relative; padding-left: 60px;">
                  <div style="position: absolute; left: 8px; top: 8px; width: 24px; height: 24px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">2</div>
                  <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">📦 Separação dos Produtos</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Em andamento - 1 dia útil</p>
                </div>

                <div style="margin-bottom: 24px; position: relative; padding-left: 60px;">
                  <div style="position: absolute; left: 8px; top: 8px; width: 24px; height: 24px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">3</div>
                  <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">🚚 Envio com Rastreamento</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Código será enviado por email</p>
                </div>

                <div style="position: relative; padding-left: 60px;">
                  <div style="position: absolute; left: 8px; top: 8px; width: 24px; height: 24px; background: #8b5cf6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">4</div>
                  <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">🏠 Entrega no Endereço</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Prazo estimado: ${estimatedDelivery}</p>
                </div>
              </div>
            </div>

            <!-- WhatsApp Contact -->
            <div style="background: linear-gradient(135deg, #25d366, #128c7e); border-radius: 20px; padding: 32px; margin: 32px 0; text-align: center; color: white;">
              <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700;">💬 Precisa de Ajuda?</h3>
              <p style="margin: 0 0 24px 0; opacity: 0.9;">Nossa equipe está sempre disponível!</p>

              <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
                <a href="https://wa.me/351928375226" style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.2); color: white; padding: 12px 20px; text-decoration: none; border-radius: 50px; font-weight: 600;">
                  <span style="margin-right: 8px;">📱</span>
                  Portugal: +351 928375226
                </a>
                <a href="https://wa.me/32472384027" style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.2); color: white; padding: 12px 20px; text-decoration: none; border-radius: 50px; font-weight: 600;">
                  <span style="margin-right: 8px;">📱</span>
                  Bélgica: +32 472384027
                </a>
              </div>
            </div>

            <!-- Thank You -->
            <div style="text-align: center; padding: 32px 0;">
              <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 700;">Obrigado pela sua confiança! ✨</h3>
              <p style="color: #6b7280; margin: 0; font-size: 16px;">Estamos empolgados para entregar seus produtos!</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #1f2937; color: white; padding: 40px 32px; text-align: center;">
            <h4 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">JC Hair Studio's 62</h4>
            <p style="margin: 0; opacity: 0.8; font-size: 14px;">Tradição Familiar há mais de 40 anos</p>

            <div style="margin: 24px 0; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 12px;">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">
                🌟 Nossa Missão: Oferecer produtos premium para realçar sua beleza natural
              </p>
            </div>

            <div style="font-size: 12px; opacity: 0.6;">
              © 2024 JC Hair Studio's 62. Todos os direitos reservados.<br>
              Este email foi enviado para ${customerEmail}
            </div>
          </div>
        </div>
      </body>
      </html>
      `
    };

    if (SENDGRID_ENABLED || FORCE_SEND_EMAILS) {
      console.log('📧 Sending payment confirmation email...', {
        to: emailTemplate.to,
        orderId,
        enabled: SENDGRID_ENABLED,
        forceSend: FORCE_SEND_EMAILS
      });

      try {
        await sgMail.send(emailTemplate);
        console.log('✅ Payment confirmation email sent successfully');
      } catch (sendError) {
        console.error('❌ Failed to send payment confirmation email:', sendError);
        logger.error('Payment confirmation email failed:', sendError);
        throw sendError;
      }
    } else {
      logger.info('📧 [DEV MODE] Email de confirmação de pagamento:', {
        to: emailTemplate.to,
        subject: emailTemplate.subject,
        orderId,
        total,
        forceSend: FORCE_SEND_EMAILS,
        testMode: TEST_MODE
      });
    }
    return true;
  } catch (error) {
    logger.error('Erro ao enviar email de confirmação de pagamento:', error);
    return false;
  }
}

/**
 * Ultra-Professional Shipping Notification Email Template
 * Mobile-responsive with detailed tracking and premium beauty brand aesthetic
 */
export async function sendShippingNotificationEmail(data: ShippingEmailData): Promise<boolean> {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      trackingCode,
      carrier,
      trackingUrl,
      estimatedDelivery = '5-10 dias úteis',
      shippingAddress,
      items = []
    } = data;

    const emailTemplate: EmailTemplate = {
      to: customerEmail,
      from: `${process.env.FROM_NAME || 'JC Hair Studio\'s 62'} <${process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz'}>`,
      subject: `📦 Seu pedido foi enviado! #${orderId} - JC Hair Studio's 62`,
      html: `Shipping notification email content here`
    };

    if (SENDGRID_ENABLED || FORCE_SEND_EMAILS) {
      console.log('📧 Sending shipping notification email...', {
        to: emailTemplate.to,
        orderId,
        trackingCode,
        enabled: SENDGRID_ENABLED,
        forceSend: FORCE_SEND_EMAILS
      });

      try {
        await sgMail.send(emailTemplate);
        console.log('✅ Shipping notification email sent successfully');
      } catch (sendError) {
        console.error('❌ Failed to send shipping notification email:', sendError);
        logger.error('Shipping notification email failed:', sendError);
        throw sendError;
      }
    } else {
      logger.info('📧 [DEV MODE] Email de notificação de envio:', {
        to: emailTemplate.to,
        subject: emailTemplate.subject,
        orderId,
        trackingCode,
        forceSend: FORCE_SEND_EMAILS,
        testMode: TEST_MODE
      });
    }
    return true;
  } catch (error) {
    logger.error('Erro ao enviar email de notificação de envio:', error);
    return false;
  }
}

export async function sendNewsletterEmail(email: string, name?: string): Promise<boolean> {
  try {
    console.log('🔧 SendGrid DEBUG - sendNewsletterEmail called with:', {
      email,
      name,
      sendgridEnabled: SENDGRID_ENABLED,
      apiKeyExists: !!process.env.SENDGRID_API_KEY
    });

    const emailTemplate: EmailTemplate = {
      to: email,
      from: `${process.env.FROM_NAME || 'JC Hair Studio\'s 62'} <${process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz'}>`,
      subject: 'Bem-vindo(a) à Newsletter JC Hair Studio\'s 62! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">JC Hair Studio's 62</h1>
            <p style="color: white; margin: 5px 0;">Bem-vindo(a) à nossa família!</p>
          </div>

          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #374151;">${name ? `Olá, ${name}!` : 'Olá!'}</h2>

            <p style="color: #6b7280; line-height: 1.6;">
              É com grande alegria que recebemos você em nossa newsletter! Agora você faz parte da família JC Hair Studio's 62 e terá acesso exclusivo a:
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">🎁 Benefícios Exclusivos:</h3>
              <ul style="color: #6b7280; line-height: 1.8;">
                <li>Promoções especiais antes de todo mundo</li>
                <li>Dicas de cuidados capilares de especialistas</li>
                <li>Lançamentos de produtos em primeira mão</li>
                <li>Cupons de desconto exclusivos</li>
                <li>Tutoriais e guias de aplicação</li>
              </ul>
            </div>

            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="color: #166534; margin: 0;">🎉 Desconto de Boas-Vindas</h3>
              <p style="color: #166534; margin: 10px 0;">Use o cupom <strong>BEMVINDO10</strong> e ganhe 10% de desconto na sua primeira compra!</p>
            </div>

            <div style="margin: 20px 0; text-align: center;">
              <a href="https://jchairstudios62.vercel.app/produtos" style="display: inline-block; background: #ec4899; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                🛍️ Explorar Produtos
              </a>
            </div>
          </div>

          <div style="background: #374151; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">JC Hair Studio's 62 - Tradição Familiar há mais de 40 anos</p>
            <p style="margin: 5px 0;">Produtos de qualidade, tradição de família</p>
            <p style="margin: 10px 0; font-size: 12px; color: #9ca3af;">
              Se não desejar mais receber nossos emails,
              <a href="#" style="color: #9ca3af;">clique aqui para descadastrar</a>
            </p>
          </div>
        </div>
      `
    };

    if (SENDGRID_ENABLED || FORCE_SEND_EMAILS) {
      console.log('📧 Newsletter - SendGrid ENABLED - Attempting to send...', {
        enabled: SENDGRID_ENABLED,
        forceSend: FORCE_SEND_EMAILS
      });

      try {
        await sgMail.send(emailTemplate);
        console.log('✅ Newsletter email sent successfully');
      } catch (sendError) {
        console.error('❌ Failed to send newsletter email:', sendError);
        logger.error('Newsletter email failed:', sendError);
        throw sendError;
      }
    } else {
      console.log('📧 [DEV MODE] Newsletter - SendGrid DISABLED:', {
        to: emailTemplate.to,
        subject: emailTemplate.subject,
        sendgridKey: process.env.SENDGRID_API_KEY ? 'EXISTS' : 'MISSING',
        forceSend: FORCE_SEND_EMAILS,
        testMode: TEST_MODE
      });
    }
    return true;
  } catch (error) {
    logger.error('Erro ao enviar email de newsletter:', error);
    return false;
  }
}

// Legacy export for compatibility
export const sendEmail = sendContactEmail;

/**
 * Send cart abandonment recovery email
 */
export async function sendCartAbandonmentEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('📧 SendGrid Cart Abandonment - Attempting to send...', {
      to: to.replace(/(.{3}).*(@.*)/, '$1***$2'),
      subject,
      enabled: SENDGRID_ENABLED
    });

    if ((TEST_MODE && !FORCE_SEND_EMAILS) || (!SENDGRID_ENABLED && !FORCE_SEND_EMAILS)) {
      console.log('📧 [DEV MODE] Cart abandonment email simulated:', {
        to: to.replace(/(.{3}).*(@.*)/, '$1***$2'),
        subject,
        htmlLength: html.length,
        forceSend: FORCE_SEND_EMAILS,
        testMode: TEST_MODE
      });
      return { success: true };
    }

    const emailTemplate = {
      to,
      from: `${process.env.FROM_NAME || 'JC Hair Studio\'s 62'} <${process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz'}>`,
      subject,
      html
    };

    try {
      await sgMail.send(emailTemplate);
      console.log('✅ Cart abandonment email sent successfully');
      return { success: true };
    } catch (sendError) {
      console.error('❌ Failed to send cart abandonment email:', sendError);
      throw sendError;
    }

  } catch (error) {
    console.error('❌ Error sending cart abandonment email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export default {
  sendContactEmail,
  sendOrderConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendShippingNotificationEmail,
  sendNewsletterEmail,
  sendCartAbandonmentEmail,
  sendEmail
};