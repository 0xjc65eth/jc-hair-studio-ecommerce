import sgMail from '@sendgrid/mail';
import logger from '@/lib/logger';

// Configurar SendGrid API Key
const SENDGRID_ENABLED = !!process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG.your-sendgrid-api-key';

if (SENDGRID_ENABLED) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  logger.info('✅ SendGrid configured successfully');
} else {
  logger.warn('⚠️ SendGrid not configured - emails will be logged to console only');
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
  formType?: 'contact' | 'support' | 'order_inquiry' | 'product_question';
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
  }>;
}

/**
 * Enviar email de contato/suporte
 */
export async function sendContactEmail(data: ContactFormData): Promise<boolean> {
  try {
    const { name, email, phone, subject, message, formType = 'contact' } = data;

    // Email para a empresa
    const emailToCompany: EmailTemplate = {
      to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.xyz',
      from: process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz',
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
            <p style="margin: 5px 0;">WhatsApp: +351 928375226 | +32 497484720</p>
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
      from: process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz',
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
              <a href="https://wa.me/32497484720" style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                📱 WhatsApp Bélgica: +32 497484720
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
        Bélgica: +32 497484720

        Horário de atendimento:
        Segunda a Sexta: 09:00 - 18:00 (Horário de Brasília)
        Sábado: 09:00 - 14:00 (Horário de Brasília)

        JC Hair Studio's 62 - Tradição Familiar há mais de 40 anos
        Produtos de qualidade, tradição de família
      `
    };

    // Enviar ambos os emails
    if (SENDGRID_ENABLED) {
      await sgMail.send(emailToCompany);
      await sgMail.send(emailToCustomer);
    } else {
      logger.info('📧 [DEV MODE] Email para empresa:', {
        to: emailToCompany.to,
        subject: emailToCompany.subject,
      });
      logger.info('📧 [DEV MODE] Email para cliente:', {
        to: emailToCustomer.to,
        subject: emailToCustomer.subject,
      });
    }

    return true;
  } catch (error) {
    logger.error('Erro ao enviar email de contato:', error);
    return false;
  }
}

/**
 * Enviar email de confirmação de pedido
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  try {
    const { orderId, customerName, customerEmail, total, items } = data;

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">R$ ${item.price.toFixed(2)}</td>
      </tr>
    `).join('');

    const emailTemplate: EmailTemplate = {
      to: customerEmail,
      from: process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz',
      subject: `Pedido Confirmado #${orderId} - JC Hair Studio's 62`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">JC Hair Studio's 62</h1>
            <p style="color: white; margin: 5px 0;">Pedido Confirmado!</p>
          </div>

          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #374151;">Olá, ${customerName}!</h2>

            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="color: #166534; margin: 0;">✅ Pedido #${orderId} Confirmado</h3>
              <p style="color: #166534; margin: 5px 0;">Obrigado pela sua confiança!</p>
            </div>

            <h3 style="color: #374151;">Resumo do Pedido:</h3>

            <table style="width: 100%; background: white; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 15px; text-align: left; color: #374151;">Produto</th>
                  <th style="padding: 15px; text-align: center; color: #374151;">Qtd</th>
                  <th style="padding: 15px; text-align: right; color: #374151;">Preço</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr style="background: #f3f4f6;">
                  <td colspan="2" style="padding: 15px; font-weight: bold; color: #374151;">TOTAL</td>
                  <td style="padding: 15px; text-align: right; font-weight: bold; color: #374151;">R$ ${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">📦 Próximos Passos:</h3>
              <ol style="color: #6b7280; line-height: 1.6;">
                <li>Processamento do pagamento (1-2 dias úteis)</li>
                <li>Separação e embalagem dos produtos</li>
                <li>Envio com código de rastreamento</li>
                <li>Entrega no endereço cadastrado</li>
              </ol>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                <strong>📱 Acompanhe seu pedido:</strong> Entre em contato via WhatsApp para updates
              </p>
            </div>

            <div style="margin: 20px 0; text-align: center;">
              <a href="https://wa.me/351928375226" style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-right: 10px;">
                📱 WhatsApp Portugal
              </a>
              <a href="https://wa.me/32497484720" style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                📱 WhatsApp Bélgica
              </a>
            </div>
          </div>

          <div style="background: #374151; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">JC Hair Studio's 62 - Tradição Familiar há mais de 40 anos</p>
            <p style="margin: 5px 0;">Obrigado pela preferência!</p>
          </div>
        </div>
      `
    };

    if (SENDGRID_ENABLED) {
      await sgMail.send(emailTemplate);
    } else {
      logger.info('📧 [DEV MODE] Email de confirmação de pedido:', {
        to: emailTemplate.to,
        subject: emailTemplate.subject,
        orderId,
        total,
      });
    }
    return true;
  } catch (error) {
    logger.error('Erro ao enviar email de confirmação de pedido:', error);
    return false;
  }
}

/**
 * Enviar email de newsletter
 */
export async function sendNewsletterEmail(email: string, name?: string): Promise<boolean> {
  try {
    const emailTemplate: EmailTemplate = {
      to: email,
      from: process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz',
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

    if (SENDGRID_ENABLED) {
      await sgMail.send(emailTemplate);
    } else {
      logger.info('📧 [DEV MODE] Email de newsletter:', {
        to: emailTemplate.to,
        subject: emailTemplate.subject,
        name: name || 'Subscriber',
      });
    }
    return true;
  } catch (error) {
    logger.error('Erro ao enviar email de newsletter:', error);
    return false;
  }
}

export default {
  sendContactEmail,
  sendOrderConfirmationEmail,
  sendNewsletterEmail
};