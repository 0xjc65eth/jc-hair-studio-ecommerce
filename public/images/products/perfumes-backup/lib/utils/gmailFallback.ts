/**
 * Gmail SMTP Fallback Configuration for JC Hair Studio's 62
 *
 * This module provides a fallback email service using Gmail SMTP
 * when SendGrid is unavailable or fails to deliver emails.
 *
 * Features:
 * - Automatic fallback detection
 * - Gmail SMTP configuration
 * - Email template compatibility
 * - Error handling and logging
 */

import nodemailer from 'nodemailer';
import logger from '@/lib/logger';
import type { EmailTemplate, ContactFormData, OrderEmailData, PaymentEmailData, ShippingEmailData } from './sendgrid';

// Gmail SMTP Configuration
const GMAIL_ENABLED = !!(
  process.env.GMAIL_USER &&
  process.env.GMAIL_APP_PASSWORD &&
  process.env.ENABLE_GMAIL_FALLBACK === 'true'
);

const GMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
};

let gmailTransporter: nodemailer.Transporter | null = null;

// Initialize Gmail transporter
function initializeGmailTransporter(): nodemailer.Transporter {
  if (!gmailTransporter && GMAIL_ENABLED) {
    gmailTransporter = nodemailer.createTransporter(GMAIL_CONFIG);
    console.log('✅ Gmail SMTP transporter initialized');
  }
  return gmailTransporter!;
}

/**
 * Test Gmail SMTP connection
 */
export async function testGmailConnection(): Promise<boolean> {
  if (!GMAIL_ENABLED) {
    console.log('⚠️ Gmail fallback not enabled');
    return false;
  }

  try {
    const transporter = initializeGmailTransporter();
    await transporter.verify();
    console.log('✅ Gmail SMTP connection verified');
    return true;
  } catch (error) {
    console.error('❌ Gmail SMTP connection failed:', error);
    return false;
  }
}

/**
 * Send email using Gmail SMTP
 */
export async function sendEmailViaGmail(emailData: EmailTemplate): Promise<boolean> {
  if (!GMAIL_ENABLED) {
    console.log('⚠️ Gmail fallback not enabled');
    return false;
  }

  try {
    const transporter = initializeGmailTransporter();

    const mailOptions = {
      from: `${process.env.FROM_NAME || 'JC Hair Studio\'s 62'} <${process.env.GMAIL_USER}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      replyTo: process.env.SUPPORT_EMAIL || process.env.GMAIL_USER
    };

    console.log('📧 Gmail - Attempting to send email...', {
      to: emailData.to.replace(/(.{3}).*(@.*)/, '$1***$2'),
      subject: emailData.subject
    });

    const result = await transporter.sendMail(mailOptions);

    console.log('✅ Gmail - Email sent successfully:', {
      messageId: result.messageId,
      response: result.response
    });

    return true;
  } catch (error) {
    console.error('❌ Gmail - Failed to send email:', error);
    logger.error('Gmail SMTP error:', error);
    return false;
  }
}

/**
 * Enhanced email sender with automatic fallback
 */
export class EmailService {
  private static instance: EmailService;
  private sendgridAvailable: boolean = true;
  private gmailAvailable: boolean = false;

  private constructor() {
    this.initializeService();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private async initializeService(): Promise<void> {
    // Test Gmail connection on initialization
    this.gmailAvailable = await testGmailConnection();

    console.log('📧 Email Service initialized:', {
      sendgridEnabled: !!process.env.SENDGRID_API_KEY,
      gmailFallback: this.gmailAvailable,
      fallbackEnabled: GMAIL_ENABLED
    });
  }

  /**
   * Send email with automatic fallback
   */
  public async sendEmail(emailData: EmailTemplate, forceGmail: boolean = false): Promise<boolean> {
    // Force Gmail if requested
    if (forceGmail && this.gmailAvailable) {
      console.log('📧 Force using Gmail SMTP');
      return await sendEmailViaGmail(emailData);
    }

    // Try SendGrid first
    if (this.sendgridAvailable) {
      try {
        const sgMail = require('@sendgrid/mail');
        if (process.env.SENDGRID_API_KEY) {
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          await sgMail.send(emailData);
          console.log('✅ SendGrid - Email sent successfully');
          return true;
        }
      } catch (error) {
        console.warn('⚠️ SendGrid failed, attempting Gmail fallback:', error);
        this.sendgridAvailable = false; // Mark as temporarily unavailable

        // Reset SendGrid availability after 5 minutes
        setTimeout(() => {
          this.sendgridAvailable = true;
          console.log('🔄 SendGrid availability reset');
        }, 5 * 60 * 1000);
      }
    }

    // Fallback to Gmail
    if (this.gmailAvailable) {
      console.log('🔄 Falling back to Gmail SMTP');
      return await sendEmailViaGmail(emailData);
    }

    console.error('❌ No email service available');
    return false;
  }

  /**
   * Send contact email with fallback
   */
  public async sendContactEmail(data: ContactFormData): Promise<boolean> {
    const { name, email, phone, subject, message, formType = 'contact' } = data;

    // Email to company
    const emailToCompany: EmailTemplate = {
      to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.xyz',
      from: `${process.env.FROM_NAME || 'JC Hair Studio\'s 62'} <${process.env.GMAIL_USER || process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz'}>`,
      subject: `[${formType.toUpperCase()}] ${subject}`,
      html: this.generateContactEmailHTML(data),
      text: this.generateContactEmailText(data)
    };

    // Email to customer
    const emailToCustomer: EmailTemplate = {
      to: email,
      from: `${process.env.FROM_NAME || 'JC Hair Studio\'s 62'} <${process.env.GMAIL_USER || process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz'}>`,
      subject: 'Recebemos sua mensagem - JC Hair Studio\'s 62',
      html: this.generateCustomerConfirmationHTML(data),
      text: this.generateCustomerConfirmationText(data)
    };

    try {
      // Send both emails
      const companyResult = await this.sendEmail(emailToCompany);
      const customerResult = await this.sendEmail(emailToCustomer);

      return companyResult && customerResult;
    } catch (error) {
      logger.error('Error sending contact emails with fallback:', error);
      return false;
    }
  }

  /**
   * Send order confirmation with fallback
   */
  public async sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
    const emailTemplate: EmailTemplate = {
      to: data.customerEmail,
      from: `${process.env.FROM_NAME || 'JC Hair Studio\'s 62'} <${process.env.GMAIL_USER || process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz'}>`,
      subject: `✨ Pedido Confirmado #${data.orderId} - JC Hair Studio's 62`,
      html: this.generateOrderConfirmationHTML(data),
      text: this.generateOrderConfirmationText(data)
    };

    return await this.sendEmail(emailTemplate);
  }

  /**
   * Get service status
   */
  public getServiceStatus(): {
    sendgrid: boolean;
    gmail: boolean;
    fallbackEnabled: boolean;
  } {
    return {
      sendgrid: this.sendgridAvailable,
      gmail: this.gmailAvailable,
      fallbackEnabled: GMAIL_ENABLED
    };
  }

  // HTML Template Generators
  private generateContactEmailHTML(data: ContactFormData): string {
    const { name, email, phone, subject, message, formType } = data;

    return `
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
    `;
  }

  private generateContactEmailText(data: ContactFormData): string {
    const { name, email, phone, subject, message, formType } = data;

    return `
      Nova mensagem de contato - JC Hair Studio's 62

      Nome: ${name}
      Email: ${email}
      ${phone ? `Telefone: ${phone}` : ''}
      Assunto: ${subject}
      Tipo: ${formType}

      Mensagem:
      ${message}

      Responder ao cliente dentro de 24 horas.
    `;
  }

  private generateCustomerConfirmationHTML(data: ContactFormData): string {
    const { name, subject, message } = data;

    return `
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
        </div>

        <div style="background: #374151; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">JC Hair Studio's 62 - Tradição Familiar há mais de 40 anos</p>
        </div>
      </div>
    `;
  }

  private generateCustomerConfirmationText(data: ContactFormData): string {
    const { name, subject, message } = data;

    return `
      JC Hair Studio's 62 - Obrigado pelo seu contato!

      Olá, ${name}!

      Recebemos sua mensagem com o assunto "${subject}" e estamos analisando sua solicitação.

      Sua mensagem: "${message}"

      Tempo de resposta: Retornaremos seu contato em até 24 horas

      Precisa de ajuda urgente? Entre em contato via WhatsApp:
      Portugal: +351 928375226
      Bélgica: +32 472384027

      JC Hair Studio's 62 - Tradição Familiar há mais de 40 anos
    `;
  }

  private generateOrderConfirmationHTML(data: OrderEmailData): string {
    // Simplified order confirmation template for Gmail fallback
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">JC Hair Studio's 62</h1>
          <p style="color: white; margin: 5px 0;">Pedido Confirmado!</p>
        </div>

        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151;">Olá, ${data.customerName}!</h2>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151;">Pedido #${data.orderId}</h3>
            <p><strong>Total:</strong> €${data.total.toFixed(2)}</p>
            <p><strong>Itens:</strong> ${data.items.length} produto(s)</p>
          </div>

          <div style="background: #dcfce7; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; color: #166534;">
              <strong>✅ Status:</strong> Pedido confirmado e em processamento
            </p>
          </div>
        </div>

        <div style="background: #374151; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">JC Hair Studio's 62 - Tradição Familiar há mais de 40 anos</p>
        </div>
      </div>
    `;
  }

  private generateOrderConfirmationText(data: OrderEmailData): string {
    return `
      JC Hair Studio's 62 - Pedido Confirmado!

      Olá, ${data.customerName}!

      Pedido #${data.orderId}
      Total: €${data.total.toFixed(2)}
      Itens: ${data.items.length} produto(s)

      Status: Pedido confirmado e em processamento

      JC Hair Studio's 62 - Tradição Familiar há mais de 40 anos
    `;
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();

// Export individual functions for backward compatibility
export async function sendContactEmailWithFallback(data: ContactFormData): Promise<boolean> {
  return await emailService.sendContactEmail(data);
}

export async function sendOrderConfirmationWithFallback(data: OrderEmailData): Promise<boolean> {
  return await emailService.sendOrderConfirmationEmail(data);
}

export default {
  EmailService,
  emailService,
  testGmailConnection,
  sendEmailViaGmail,
  sendContactEmailWithFallback,
  sendOrderConfirmationWithFallback
};