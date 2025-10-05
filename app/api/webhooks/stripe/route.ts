import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { sendEmail, generateOrderConfirmationEmail } from '@/lib/utils/email';
import { referralService } from '@/lib/services/referralService';
import logger from '@/lib/logger';
import { connectDB } from '@/lib/mongodb/connection';
import { Order } from '@/lib/mongodb/schemas/order.schema';
import mongoose from 'mongoose';

// Inicializar Stripe com configuração otimizada
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
  timeout: 30000,
  maxNetworkRetries: 3,
}) : null;

// Webhook Secret do Stripe (configurado no dashboard)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// ==================== CONFIGURATION VALIDATION ====================

interface ConfigValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

function validateEnvironmentConfig(): ConfigValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Critical configs
  if (!process.env.STRIPE_SECRET_KEY) {
    errors.push('STRIPE_SECRET_KEY is not configured');
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    errors.push('STRIPE_WEBHOOK_SECRET is not configured');
  }
  if (!process.env.MONGODB_URI) {
    errors.push('MONGODB_URI is not configured');
  }

  // Important but non-critical configs
  if (!process.env.SENDGRID_API_KEY) {
    warnings.push('SENDGRID_API_KEY not configured - emails will fail');
  }
  if (!process.env.SUPPORT_EMAIL) {
    warnings.push('SUPPORT_EMAIL not configured - using default');
  }
  if (!process.env.FROM_EMAIL) {
    warnings.push('FROM_EMAIL not configured - emails may not send correctly');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Validate on startup
const configValidation = validateEnvironmentConfig();
if (!configValidation.isValid) {
  logger.error('❌ CRITICAL CONFIGURATION ERRORS:', configValidation.errors);
}
if (configValidation.warnings.length > 0) {
  logger.warn('⚠️ Configuration warnings:', configValidation.warnings);
}

// ==================== RATE LIMITING & IDEMPOTENCY ====================

// Simple in-memory rate limiter (production should use Redis)
const webhookRateLimiter = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 30;

// Processed payment intents cache (prevent duplicate processing)
const processedPayments = new Map<string, { processedAt: number }>();
const PROCESSED_CACHE_TTL = 3600000; // 1 hour

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = webhookRateLimiter.get(identifier);

  if (!record || now > record.resetAt) {
    webhookRateLimiter.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    logger.warn(`⚠️ Rate limit exceeded for: ${identifier}`);
    return false;
  }

  record.count++;
  return true;
}

function isAlreadyProcessed(paymentIntentId: string): boolean {
  const record = processedPayments.get(paymentIntentId);
  if (!record) return false;

  const now = Date.now();
  if (now - record.processedAt > PROCESSED_CACHE_TTL) {
    processedPayments.delete(paymentIntentId);
    return false;
  }

  return true;
}

function markAsProcessed(paymentIntentId: string): void {
  processedPayments.set(paymentIntentId, { processedAt: Date.now() });
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();

  // Clean rate limiter
  const rateLimitKeys = Array.from(webhookRateLimiter.entries());
  for (const [key, record] of rateLimitKeys) {
    if (now > record.resetAt) {
      webhookRateLimiter.delete(key);
    }
  }

  // Clean processed payments
  const paymentKeys = Array.from(processedPayments.entries());
  for (const [key, record] of paymentKeys) {
    if (now - record.processedAt > PROCESSED_CACHE_TTL) {
      processedPayments.delete(key);
    }
  }
}, 300000);

// ==================== WEBHOOK TESTING ENDPOINT ====================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testType = searchParams.get('test');
  const requestId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  logger.info(`🧪 [${requestId}] Webhook test request: ${testType}`);

  if (!testType) {
    return NextResponse.json({
      message: 'Webhook Test Endpoint',
      availableTests: [
        'config',
        'payment_success',
        'payment_failed',
        'dispute_created',
        'email_test'
      ],
      usage: 'Add ?test=config to check configuration or ?test=payment_success to test specific scenarios'
    });
  }

  try {
    switch (testType) {
      case 'config':
        const validation = validateEnvironmentConfig();
        return NextResponse.json({
          success: validation.isValid,
          message: validation.isValid ? 'All critical configurations valid' : 'Configuration errors detected',
          validation: {
            isValid: validation.isValid,
            errors: validation.errors,
            warnings: validation.warnings,
            stripe: {
              configured: !!stripe,
              webhookSecret: !!webhookSecret
            },
            mongodb: {
              configured: !!process.env.MONGODB_URI
            },
            email: {
              sendgrid: !!process.env.SENDGRID_API_KEY,
              supportEmail: process.env.SUPPORT_EMAIL || 'default',
              fromEmail: !!process.env.FROM_EMAIL
            }
          },
          requestId
        });
      case 'payment_success':
        await handleTestPaymentSuccess(requestId);
        break;
      case 'payment_failed':
        await handleTestPaymentFailed(requestId);
        break;
      case 'dispute_created':
        await handleTestDispute(requestId);
        break;
      case 'email_test':
        await handleTestEmail(requestId);
        break;
      default:
        throw new Error(`Unknown test type: ${testType}`);
    }

    return NextResponse.json({
      success: true,
      message: `Test ${testType} completed successfully`,
      requestId
    });
  } catch (error) {
    logger.error(`❌ [${requestId}] Test failed:`, error);
    return NextResponse.json({
      success: false,
      message: `Test ${testType} failed: ${error.message}`,
      requestId
    }, { status: 500 });
  }
}

async function handleTestPaymentSuccess(requestId: string) {
  const mockPaymentIntent = {
    id: `pi_test_${requestId}`,
    amount: 5000, // €50.00
    currency: 'eur',
    metadata: {
      customerEmail: 'test@example.com',
      customerName: 'Test Customer',
      itemsCount: '2',
      items: JSON.stringify([
        { name: 'Test Product 1', quantity: 1, price: 25.00 },
        { name: 'Test Product 2', quantity: 1, price: 25.00 }
      ])
    }
  } as any;

  await handlePaymentSuccess(mockPaymentIntent, requestId, true);
}

async function handleTestPaymentFailed(requestId: string) {
  const mockPaymentIntent = {
    id: `pi_test_failed_${requestId}`,
    amount: 3000,
    currency: 'eur',
    metadata: {
      customerEmail: 'test@example.com',
      customerName: 'Test Customer'
    }
  } as any;

  await handlePaymentFailed(mockPaymentIntent, requestId, true);
}

async function handleTestDispute(requestId: string) {
  const mockDispute = {
    id: `dp_test_${requestId}`,
    amount: 5000,
    reason: 'fraudulent',
    status: 'warning_needs_response',
    created: Math.floor(Date.now() / 1000)
  } as any;

  await handleDispute(mockDispute, requestId, true);
}

async function handleTestEmail(requestId: string) {
  await sendEmailWithRetry({
    to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.com',
    subject: `🧪 Teste de Email - Webhook System`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4caf50;">🧪 Teste de Email</h2>
        <p><strong>Request ID:</strong> ${requestId}</p>
        <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-PT')}</p>
        <p>Este é um email de teste do sistema de webhooks.</p>
        <p>Se você recebeu este email, o sistema está funcionando corretamente!</p>
      </div>
    `,
    sandbox: false
  }, requestId, 'test_email');
}

// ==================== MAIN WEBHOOK HANDLER ====================

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  logger.info(`🔄 [${requestId}] Webhook request received`);

  if (!stripe) {
    logger.error(`❌ [${requestId}] Stripe not configured`);
    return NextResponse.json({ error: 'Service unavailable', requestId }, { status: 503 });
  }

  if (!webhookSecret) {
    logger.error(`❌ [${requestId}] Stripe webhook secret not configured`);
    return NextResponse.json({ error: 'Service unavailable', requestId }, { status: 503 });
  }

  // SECURITY: Rate limiting check
  const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(clientIp)) {
    logger.warn(`⚠️ [${requestId}] Rate limit exceeded for IP: ${clientIp}`);
    return NextResponse.json({ error: 'Too many requests', requestId }, { status: 429 });
  }

  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
      logger.error(`❌ [${requestId}] No Stripe signature found`);
      return NextResponse.json({ error: 'No signature provided', requestId }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      // Verificar a assinatura do webhook - REQUIRED for security
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      logger.info(`✅ [${requestId}] Webhook signature verified: ${event.type}`);
    } catch (err: any) {
      logger.error(`❌ [${requestId}] Webhook signature verification failed: ${err.message}`);
      // Return error immediately - do NOT process unsigned events
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}`, requestId },
        { status: 400 }
      );
    }

    // CRITICAL FIX: Don't catch errors for payment_intent.succeeded
    // WHY: If order save fails, we MUST return 5xx so Stripe retries
    // HOW: Let critical errors propagate to outer catch block
    switch (event.type) {
      case 'payment_intent.succeeded':
        // CRITICAL: No try-catch here - let errors propagate
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent, requestId);
        break;

      case 'payment_intent.payment_failed':
      case 'charge.dispute.created':
      case 'checkout.session.completed':
      case 'customer.created':
      case 'invoice.paid':
        // Non-critical events can fail without breaking
        try {
          switch (event.type) {
            case 'payment_intent.payment_failed':
              await handlePaymentFailed(event.data.object as Stripe.PaymentIntent, requestId);
              break;
            case 'charge.dispute.created':
              await handleDispute(event.data.object as Stripe.Dispute, requestId);
              break;
            case 'checkout.session.completed':
              const session = event.data.object as Stripe.Checkout.Session;
              logger.info(`✅ [${requestId}] Checkout session completed: ${session.id}`);
              break;
            case 'customer.created':
              const customer = event.data.object as Stripe.Customer;
              logger.info(`👤 [${requestId}] New customer created: ${customer.id}`);
              break;
            case 'invoice.paid':
              const invoice = event.data.object as Stripe.Invoice;
              logger.info(`📄 [${requestId}] Invoice paid: ${invoice.id}`);
              break;
          }
        } catch (nonCriticalError) {
          logger.warn(`⚠️ [${requestId}] Non-critical event failed: ${event.type}`, nonCriticalError);
          await sendFailureNotification({
            requestId,
            eventType: event.type,
            eventId: event.id,
            error: nonCriticalError
          });
        }
        break;

      default:
        logger.info(`🔔 [${requestId}] Unhandled event type: ${event.type}`);
    }

    // Retornar sucesso - only reached if no critical errors
    logger.info(`✅ [${requestId}] Webhook processed successfully: ${event.type}`);
    return NextResponse.json(
      { received: true, type: event.type, requestId },
      { status: 200 }
    );

  } catch (error) {
    logger.error(`❌ [${requestId}] Webhook handler failed:`, error);

    // Send failure notification
    await sendFailureNotification({
      requestId,
      eventType: 'unknown',
      eventId: 'unknown',
      error
    });

    return NextResponse.json(
      { error: 'Webhook handler failed', requestId },
      { status: 500 }
    );
  }
}

// ==================== HANDLERS DOS EVENTOS ====================

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent, requestId: string) {
  logger.info(`🎉 [${requestId}] Payment succeeded: ${paymentIntent.id}`);

  // IDEMPOTENCY: Check if payment already processed (in-memory cache)
  if (isAlreadyProcessed(paymentIntent.id)) {
    logger.info(`✅ [${requestId}] Payment already processed (cache), skipping: ${paymentIntent.id}`);
    return; // Silently succeed - already processed
  }

  // IDEMPOTENCY: Check database for existing order with this payment intent
  try {
    await connectDB();
    const existingOrder = await Order.findOne({
      'payments.transactionId': paymentIntent.id
    });

    if (existingOrder) {
      logger.info(`✅ [${requestId}] Order already exists in DB: ${existingOrder.orderNumber}`);
      markAsProcessed(paymentIntent.id);
      return; // Silently succeed - already processed
    }
  } catch (dbCheckError) {
    logger.warn(`⚠️ [${requestId}] Could not check for duplicate order (non-critical):`, dbCheckError);
    // Continue processing - better to risk duplicate than lose order
  }

  const orderId = paymentIntent.id;
  const amount = paymentIntent.amount / 100; // Convert from cents
  const currency = paymentIntent.currency.toUpperCase();
  const customerEmail = paymentIntent.metadata.customerEmail || '';
  const customerName = paymentIntent.metadata.customerName || 'Cliente';
  const itemsCount = parseInt(paymentIntent.metadata.itemsCount || '0');

  // Create order data structure
  const orderData = {
    orderId,
    paymentIntentId: paymentIntent.id,
    customerName,
    customerEmail,
    total: amount,
    currency,
    itemsCount,
    status: 'paid',
    paymentMethod: 'Cartão de Crédito',
    createdAt: new Date().toISOString(),
    metadata: paymentIntent.metadata,
    shippingType: determineShippingType(amount),
    estimatedDelivery: calculateDeliveryTime(amount)
  };

  // CRITICAL FIX: Order save errors MUST propagate
  // WHY: If order save fails, webhook must return 5xx for Stripe retry
  // HOW: Don't catch errors, let them propagate to POST handler

  // Save order to database with retry logic - CRITICAL, errors will throw
  await saveOrderToDatabase(orderData, requestId);

  // Mark payment as processed after successful save
  markAsProcessed(paymentIntent.id);

  // Non-critical operations - failures are logged but don't break order
  try {
    // Process referral if customer came through referral link
    await processReferralPurchase(paymentIntent, requestId);
  } catch (referralError) {
    logger.warn(`⚠️ [${requestId}] Referral processing failed (non-critical):`, referralError);
  }

  try {
    // Send confirmation email to customer with retry logic
    await sendCustomerConfirmationWithRetry(orderData, requestId);
  } catch (emailError) {
    logger.warn(`⚠️ [${requestId}] Customer email failed (non-critical):`, emailError);
  }

  try {
    // Send notification email to admin with retry logic
    await sendAdminNotificationWithRetry(orderData, requestId);
  } catch (emailError) {
    logger.warn(`⚠️ [${requestId}] Admin email failed (non-critical):`, emailError);
  }

  logger.info(`✅ [${requestId}] Order processed successfully: ${orderId}`);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent, requestId: string) {
  logger.info(`❌ [${requestId}] Payment failed: ${paymentIntent.id}`);

  const customerEmail = paymentIntent.metadata.customerEmail;
  if (customerEmail) {
    await sendEmailWithRetry({
      to: customerEmail,
      subject: '❌ Pagamento não processado - JC Hair Studio\'s 62',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">Pagamento não processado</h2>
          <p>Olá ${paymentIntent.metadata.customerName || 'Cliente'},</p>
          <p>Infelizmente, não conseguimos processar seu pagamento.</p>
          <p><strong>ID do pagamento:</strong> ${paymentIntent.id}</p>
          <p>Por favor, tente novamente ou entre em contato conosco.</p>
          <hr>
          <p><strong>JC Hair Studio's 62</strong><br>
          📧 suporte@jchairstudios62.xyz<br>
          📱 +351 928 375 226</p>
        </div>
      `,
      sandbox: false
    }, requestId, 'payment_failed_notification');
  }
}

async function handleDispute(dispute: Stripe.Dispute, requestId: string) {
  logger.info(`⚠️ [${requestId}] Dispute created: ${dispute.id}`);

  await sendEmailWithRetry({
    to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.com',
    subject: '🚨 URGENTE: Disputa criada no Stripe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">🚨 Disputa Criada</h2>
        <p><strong>ID da Disputa:</strong> ${dispute.id}</p>
        <p><strong>Valor:</strong> €${(dispute.amount / 100).toFixed(2)}</p>
        <p><strong>Motivo:</strong> ${dispute.reason}</p>
        <p><strong>Status:</strong> ${dispute.status}</p>
        <p><strong>Data:</strong> ${new Date(dispute.created * 1000).toLocaleString()}</p>
        <p><strong>Ação necessária:</strong> Responder no Stripe Dashboard</p>
        <a href="https://dashboard.stripe.com/disputes/${dispute.id}"
           style="background: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Ver no Stripe
        </a>
      </div>
    `,
    sandbox: !process.env.SENDGRID_API_KEY
  }, requestId, 'dispute_notification');
}

async function sendCustomerConfirmation(orderData: any) {
  const emailData = generateOrderConfirmationEmail({
    orderId: orderData.orderId,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    total: orderData.total,
    items: parseItemsFromMetadata(orderData.metadata), // Parse items from metadata
    paymentMethod: orderData.paymentMethod,
    shippingType: orderData.shippingType,
    estimatedDelivery: orderData.estimatedDelivery
  });

  await sendEmail(emailData);
}

async function sendCustomerConfirmationWithRetry(orderData: any, requestId: string) {
  const emailData = generateOrderConfirmationEmail({
    orderId: orderData.orderId,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    total: orderData.total,
    items: parseItemsFromMetadata(orderData.metadata),
    paymentMethod: orderData.paymentMethod,
    shippingType: orderData.shippingType,
    estimatedDelivery: orderData.estimatedDelivery
  });

  await sendEmailWithRetry(emailData, requestId, 'customer_confirmation');
}

async function sendAdminNotification(orderData: any) {
  await sendEmail({
    to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.com',
    subject: `🎉 Nova Venda - Pedido #${orderData.orderId}`,
    html: generateAdminNotificationHtml(orderData),
    sandbox: !process.env.SENDGRID_API_KEY
  });
}

async function sendAdminNotificationWithRetry(orderData: any, requestId: string) {
  await sendEmailWithRetry({
    to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.com',
    subject: `🎉 Nova Venda - Pedido #${orderData.orderId}`,
    html: generateAdminNotificationHtml(orderData),
    sandbox: !process.env.SENDGRID_API_KEY
  }, requestId, 'admin_notification');
}

function generateAdminNotificationHtml(orderData: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4caf50;">🎉 Nova Venda Realizada!</h2>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📋 Detalhes do Pedido</h3>
        <p><strong>Pedido ID:</strong> #${orderData.orderId}</p>
        <p><strong>Valor Total:</strong> €${orderData.total.toFixed(2)} ${orderData.currency}</p>
        <p><strong>Quantidade de Itens:</strong> ${orderData.itemsCount || 'N/A'}</p>
        <p><strong>Data:</strong> ${new Date(orderData.createdAt).toLocaleString('pt-PT')}</p>
      </div>

      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>👤 Dados do Cliente</h3>
        <p><strong>Nome:</strong> ${orderData.customerName}</p>
        <p><strong>Email:</strong> ${orderData.customerEmail}</p>
      </div>

      <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📦 Informações de Envio</h3>
        <p><strong>Tipo de Frete:</strong> ${orderData.shippingType}</p>
        <p><strong>Prazo Estimado:</strong> ${orderData.estimatedDelivery}</p>
      </div>

      <div style="background: #f1f8e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>💳 Pagamento</h3>
        <p><strong>Método:</strong> ${orderData.paymentMethod}</p>
        <p><strong>Status:</strong> ✅ Aprovado</p>
        <p><strong>Stripe ID:</strong> ${orderData.paymentIntentId}</p>
      </div>

      <div style="margin-top: 30px; padding: 20px; background: #ffebee; border-radius: 8px;">
        <h3>📋 Próximos Passos</h3>
        <ol style="line-height: 1.6;">
          <li>✅ <strong>Pagamento confirmado</strong></li>
          <li>📦 <strong>Preparar produtos para envio</strong></li>
          <li>🏃‍♂️ <strong>Processar envio (${orderData.shippingType})</strong></li>
          <li>📱 <strong>Enviar código de rastreamento ao cliente</strong></li>
        </ol>
      </div>

      <hr style="margin: 30px 0;">
      <p style="text-align: center; color: #666;">
        <strong>JC Hair Studio's 62</strong><br>
        Sistema de E-commerce Automatizado
      </p>
    </div>
  `;
}

function determineShippingType(amount: number): string {
  if (amount >= 50) {
    return '🚚 Frete Grátis (Standard)';
  } else if (amount >= 30) {
    return '📦 Frete Standard (€4.99)';
  } else {
    return '📦 Frete Standard (€7.99)';
  }
}

function calculateDeliveryTime(amount: number): string {
  if (amount >= 100) {
    return '1-2 dias úteis (Express)';
  } else if (amount >= 50) {
    return '2-3 dias úteis (Standard)';
  } else {
    return '3-5 dias úteis (Standard)';
  }
}

/**
 * CRITICAL SECURITY FIX: Save order to MongoDB with fallback
 * WHY: Payment succeeded but order not saved = MONEY LOSS
 * HOW: Try MongoDB Order collection first, fallback to webhook_failures collection
 * STRATEGY: Throw error if BOTH fail (Stripe will retry)
 */
async function saveOrderToDatabase(orderData: any, requestId: string) {
  logger.info(`💾 [${requestId}] Saving order data for ${orderData.orderId}`);

  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  // Try to save to primary MongoDB Order collection
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await connectDB();

      // Parse items from metadata if available
      const items = parseItemsFromMetadata(orderData.metadata);

      // Create MongoDB Order document
      const order = new Order({
        orderNumber: orderData.orderId,
        userId: orderData.metadata.userId || 'guest',
        customerInfo: {
          firstName: orderData.customerName.split(' ')[0] || 'Cliente',
          lastName: orderData.customerName.split(' ').slice(1).join(' ') || '',
          email: orderData.customerEmail,
          phone: orderData.metadata.phone || '',
        },
        items: items.length > 0 ? items.map(item => ({
          productId: item.productId || 'unknown',
          name: item.name,
          sku: item.sku || item.productId || 'N/A',
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          image: item.image,
        })) : [{
          productId: 'unknown',
          name: `${orderData.itemsCount} items`,
          sku: 'N/A',
          quantity: orderData.itemsCount,
          unitPrice: orderData.total / orderData.itemsCount,
          totalPrice: orderData.total,
        }],
        shippingAddress: orderData.metadata.shippingAddress
          ? JSON.parse(orderData.metadata.shippingAddress)
          : { street: 'N/A', city: 'N/A', state: 'N/A', postalCode: 'N/A', country: 'PT' },
        billingAddress: orderData.metadata.billingAddress
          ? JSON.parse(orderData.metadata.billingAddress)
          : { street: 'N/A', city: 'N/A', state: 'N/A', postalCode: 'N/A', country: 'PT' },
        subtotal: orderData.total,
        shippingCost: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: orderData.total,
        currency: orderData.currency,
        status: 'confirmed',
        paymentStatus: 'completed',
        payments: [{
          method: 'credit_card',
          status: 'completed',
          transactionId: orderData.paymentIntentId,
          amount: orderData.total,
          currency: orderData.currency,
          processedAt: new Date(),
        }],
        confirmedAt: new Date(),
        source: 'stripe_webhook',
        internalNotes: `Created by Stripe webhook. Request ID: ${requestId}`,
      });

      await order.save();

      logger.info(`✅ [${requestId}] Order saved to MongoDB successfully (attempt ${attempt}): ${orderData.orderId}`);
      return; // Success! Exit function

    } catch (mongoError) {
      logger.error(`❌ [${requestId}] MongoDB save failed (attempt ${attempt}):`, mongoError);

      if (attempt < maxRetries) {
        const delay = retryDelay * attempt; // Exponential backoff
        logger.info(`🔄 [${requestId}] Retrying MongoDB save in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        logger.error(`❌ [${requestId}] MongoDB save failed after ${maxRetries} attempts`);
        // Don't throw yet - try fallback storage
      }
    }
  }

  // If we reach here, MongoDB failed - try fallback
  logger.warn(`⚠️ [${requestId}] Primary MongoDB save failed, attempting fallback storage...`);
  await saveOrderToFallbackStorage(orderData, requestId);
}

/**
 * CRITICAL: Fallback storage for when primary Order collection fails
 * WHY: Last resort to prevent money loss - save raw webhook data
 * HOW: Save to webhook_failures collection for manual recovery
 * STRATEGY: Throw error if this fails too (Stripe will retry)
 */
async function saveOrderToFallbackStorage(orderData: any, requestId: string) {
  logger.info(`💾 [${requestId}] Using fallback storage for order: ${orderData.orderId}`);

  const maxRetries = 3;
  const retryDelay = 500; // Faster retries for fallback

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await connectDB();

      // Create fallback document with minimal schema requirements
      const WebhookFailure = mongoose.models.WebhookFailure || mongoose.model('WebhookFailure', new mongoose.Schema({
        requestId: { type: String, required: true, index: true },
        orderId: { type: String, required: true, index: true },
        webhookType: { type: String, required: true },
        rawData: { type: mongoose.Schema.Types.Mixed, required: true },
        customerEmail: { type: String, index: true },
        total: { type: Number },
        currency: { type: String },
        status: { type: String, default: 'pending_manual_processing' },
        recovered: { type: Boolean, default: false },
        recoveredAt: { type: Date },
        errorMessage: { type: String },
        createdAt: { type: Date, default: Date.now },
      }, { collection: 'webhook_failures' }));

      const fallbackDoc = new WebhookFailure({
        requestId,
        orderId: orderData.orderId,
        webhookType: 'payment_intent.succeeded',
        rawData: orderData,
        customerEmail: orderData.customerEmail,
        total: orderData.total,
        currency: orderData.currency,
        status: 'pending_manual_processing',
        errorMessage: 'Primary Order collection save failed',
      });

      await fallbackDoc.save();

      logger.info(`✅ [${requestId}] Order saved to fallback storage (attempt ${attempt}): ${orderData.orderId}`);
      logger.info(`🚨 [${requestId}] MANUAL ACTION REQUIRED: Check webhook_failures collection for order ${orderData.orderId}`);

      // Schedule automatic recovery attempt after 30 seconds
      setTimeout(() => {
        attemptFallbackRecovery(orderData.orderId, requestId).catch(err =>
          logger.error(`❌ Auto-recovery failed for ${orderData.orderId}:`, err)
        );
      }, 30000);

      // Send urgent notification to admin
      await sendEmail({
        to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.com',
        subject: `🚨 URGENTE: Order salvo em fallback - ${orderData.orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff3cd; padding: 20px; border: 2px solid #f0ad4e;">
            <h2 style="color: #d32f2f;">🚨 AÇÃO MANUAL NECESSÁRIA</h2>
            <p><strong>Um pedido foi salvo no fallback storage porque o MongoDB principal falhou!</strong></p>

            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>📋 Detalhes do Pedido</h3>
              <p><strong>Order ID:</strong> ${orderData.orderId}</p>
              <p><strong>Request ID:</strong> ${requestId}</p>
              <p><strong>Cliente:</strong> ${orderData.customerEmail}</p>
              <p><strong>Valor:</strong> €${orderData.total.toFixed(2)} ${orderData.currency}</p>
              <p><strong>Status:</strong> Pagamento confirmado pelo Stripe ✅</p>
            </div>

            <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>⚠️ O que aconteceu?</h3>
              <p>O pedido não pôde ser salvo na coleção Orders principal do MongoDB.</p>
              <p>Foi salvo automaticamente na coleção <code>webhook_failures</code> para recuperação manual.</p>
            </div>

            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>🔧 Passos para Recuperação</h3>
              <ol style="line-height: 1.8;">
                <li>Conecte ao MongoDB</li>
                <li>Execute: <code>db.webhook_failures.findOne({orderId: "${orderData.orderId}"})</code></li>
                <li>Copie os dados do campo <code>rawData</code></li>
                <li>Crie manualmente o pedido na coleção <code>orders</code></li>
                <li>Marque como recuperado: <code>db.webhook_failures.updateOne({orderId: "${orderData.orderId}"}, {$set: {recovered: true, recoveredAt: new Date()}})</code></li>
              </ol>
            </div>

            <p style="color: #d32f2f; font-weight: bold;">⏰ URGENTE: O cliente pagou mas não tem pedido no sistema!</p>
          </div>
        `,
        sandbox: false
      }).catch(err => logger.error(`❌ [${requestId}] Failed to send fallback notification email:`, err));

      return; // Success! Order is safe in fallback

    } catch (fallbackError) {
      logger.error(`❌ [${requestId}] Fallback storage failed (attempt ${attempt}):`, fallbackError);

      if (attempt < maxRetries) {
        const delay = retryDelay * attempt;
        logger.info(`🔄 [${requestId}] Retrying fallback save in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // CRITICAL: Both primary and fallback failed
        logger.error(`❌❌❌ [${requestId}] CRITICAL: Both primary AND fallback storage failed!`);
        logger.error(`❌❌❌ [${requestId}] Order data: ${JSON.stringify(orderData)}`);

        // Throw error - Stripe will retry the webhook
        throw new Error(`CRITICAL: Failed to save order ${orderData.orderId} to both primary and fallback storage after ${maxRetries} attempts. Stripe will retry.`);
      }
    }
  }
}

async function attemptFallbackRecovery(orderId: string, originalRequestId: string) {
  const recoveryId = `recovery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  logger.info(`🔄 [${recoveryId}] Attempting auto-recovery for fallback order: ${orderId}`);

  try {
    await connectDB();

    // Get the WebhookFailure model
    const WebhookFailure = mongoose.models.WebhookFailure || mongoose.model('WebhookFailure', new mongoose.Schema({
      requestId: { type: String, required: true, index: true },
      orderId: { type: String, required: true, index: true },
      webhookType: { type: String, required: true },
      rawData: { type: mongoose.Schema.Types.Mixed, required: true },
      customerEmail: { type: String, index: true },
      total: { type: Number },
      currency: { type: String },
      status: { type: String, default: 'pending_manual_processing' },
      recovered: { type: Boolean, default: false },
      recoveredAt: { type: Date },
      errorMessage: { type: String },
      createdAt: { type: Date, default: Date.now },
    }, { collection: 'webhook_failures' }));

    // Find unrecovered fallback for this order
    const fallbackDoc = await (WebhookFailure as any).findOne({
      orderId,
      recovered: { $ne: true }
    });

    if (!fallbackDoc) {
      logger.info(`ℹ️ [${recoveryId}] No unrecovered fallback found for ${orderId} (may have been recovered already)`);
      return;
    }

    // Check if order already exists in main Orders collection
    const existingOrder = await (Order as any).findOne({
      $or: [
        { orderNumber: orderId },
        { 'payments.transactionId': orderId }
      ]
    });

    if (existingOrder) {
      logger.info(`✅ [${recoveryId}] Order ${orderId} already exists in main collection, marking fallback as recovered`);
      await (WebhookFailure as any).updateOne(
        { _id: fallbackDoc._id },
        {
          $set: {
            recovered: true,
            recoveredAt: new Date(),
            status: 'auto_recovered'
          }
        }
      );
      return;
    }

    // Try to save order to main collection
    const orderData = fallbackDoc.rawData;
    logger.info(`🔄 [${recoveryId}] Attempting to save order to main collection: ${orderId}`);

    await saveOrderToDatabase(orderData, recoveryId);

    // Mark as recovered
    await (WebhookFailure as any).updateOne(
      { _id: fallbackDoc._id },
      {
        $set: {
          recovered: true,
          recoveredAt: new Date(),
          status: 'auto_recovered'
        }
      }
    );

    logger.info(`✅ [${recoveryId}] Auto-recovery successful for order ${orderId}`);

    // Send success notification to admin
    await sendEmail({
      to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.com',
      subject: `✅ Auto-recovery bem-sucedido - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4caf50;">✅ Recuperação Automática Bem-Sucedida</h2>
          <p>O pedido <strong>${orderId}</strong> foi recuperado automaticamente do fallback storage e salvo na coleção Orders principal.</p>
          <p><strong>Cliente:</strong> ${orderData.customerEmail}</p>
          <p><strong>Valor:</strong> €${orderData.total.toFixed(2)} ${orderData.currency}</p>
          <p><strong>Recovery ID:</strong> ${recoveryId}</p>
          <p style="color: #4caf50;">✅ Nenhuma ação manual necessária.</p>
        </div>
      `,
      sandbox: false
    }).catch(err => logger.error(`❌ [${recoveryId}] Failed to send recovery notification:`, err));

  } catch (error) {
    logger.error(`❌ [${recoveryId}] Auto-recovery failed for ${orderId}:`, error);
    // Don't throw - this is a background operation, we don't want to crash
    // Admin will still get the original fallback notification
  }
}

// ==================== RETRY AND FALLBACK FUNCTIONS ====================

async function sendEmailWithRetry(emailData: any, requestId: string, emailType: string, maxRetries: number = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const success = await sendEmail(emailData);
      if (success) {
        logger.info(`✅ [${requestId}] ${emailType} email sent successfully (attempt ${attempt})`);
        return;
      }
      throw new Error('Email sending returned false');
    } catch (error) {
      logger.error(`❌ [${requestId}] Failed to send ${emailType} email (attempt ${attempt}):`, error);

      if (attempt < maxRetries) {
        const delay = 1000 * attempt; // Exponential backoff
        logger.info(`🔄 [${requestId}] Retrying ${emailType} email in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        logger.error(`❌ [${requestId}] Failed to send ${emailType} email after ${maxRetries} attempts`);

        // Send fallback notification
        await sendFallbackEmailNotification({
          requestId,
          emailType,
          originalEmailData: emailData,
          error
        });
      }
    }
  }
}

async function sendFallbackEmailNotification(data: any) {
  try {
    // Send a simple notification about the failed email
    const fallbackEmail = {
      to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.com',
      subject: `🚨 FALHA NO ENVIO DE EMAIL - ${data.emailType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">🚨 Falha no Envio de Email</h2>
          <p><strong>Request ID:</strong> ${data.requestId}</p>
          <p><strong>Tipo de Email:</strong> ${data.emailType}</p>
          <p><strong>Email de Destino:</strong> ${data.originalEmailData.to}</p>
          <p><strong>Assunto Original:</strong> ${data.originalEmailData.subject}</p>
          <p><strong>Erro:</strong> ${data.error?.message || 'Erro desconhecido'}</p>
          <hr>
          <p><strong>Ação Necessária:</strong> Verificar configuração do SendGrid e reenviar email manualmente</p>
        </div>
      `,
      sandbox: false
    };

    await sendEmail(fallbackEmail);
  } catch (fallbackError) {
    logger.error('❌ Failed to send fallback email notification:', fallbackError);
  }
}

async function sendFailureNotification(data: any) {
  try {
    const failureEmail = {
      to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.com',
      subject: `🚨 WEBHOOK PROCESSING FAILURE - ${data.eventType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">🚨 Webhook Processing Failure</h2>
          <p><strong>Request ID:</strong> ${data.requestId}</p>
          <p><strong>Event Type:</strong> ${data.eventType}</p>
          <p><strong>Event ID:</strong> ${data.eventId}</p>
          <p><strong>Error:</strong> ${data.error?.message || 'Erro desconhecido'}</p>
          <p><strong>Stack Trace:</strong></p>
          <pre style="background: #f5f5f5; padding: 10px; overflow-x: auto;">${data.error?.stack || 'N/A'}</pre>
          ${data.orderData ? `
            <hr>
            <h3>Order Data:</h3>
            <pre style="background: #f5f5f5; padding: 10px; overflow-x: auto;">${JSON.stringify(data.orderData, null, 2)}</pre>
          ` : ''}
          <hr>
          <p><strong>Ação Necessária:</strong> Investigar e processar manualmente se necessário</p>
        </div>
      `,
      sandbox: false
    };

    await sendEmail(failureEmail);
  } catch (notificationError) {
    logger.error('❌ Failed to send failure notification:', notificationError);
  }
}

function parseItemsFromMetadata(metadata: any): Array<{name: string, quantity: number, price: number}> {
  try {
    if (metadata?.items) {
      return JSON.parse(metadata.items);
    }
    if (metadata?.itemsJson) {
      return JSON.parse(metadata.itemsJson);
    }
    // Try to reconstruct from individual metadata fields
    const items = [];
    for (let i = 0; i < 10; i++) { // Check for up to 10 items
      const name = metadata[`item_${i}_name`];
      const quantity = metadata[`item_${i}_quantity`];
      const price = metadata[`item_${i}_price`];

      if (name && quantity && price) {
        items.push({
          name,
          quantity: parseInt(quantity),
          price: parseFloat(price)
        });
      }
    }
    return items;
  } catch (error) {
    logger.warn('Failed to parse items from metadata:', error);
    return [];
  }
}

// ==================== REFERRAL PROCESSING ====================

async function processReferralPurchase(paymentIntent: Stripe.PaymentIntent, requestId: string) {
  try {
    const userId = paymentIntent.metadata.userId;
    const orderId = paymentIntent.id;
    const orderValue = paymentIntent.amount / 100; // Convert from cents

    if (!userId) {
      logger.info(`ℹ️ [${requestId}] No userId in payment metadata, skipping referral processing`);
      return;
    }

    logger.info(`🔍 [${requestId}] Checking for referral for user: ${userId}`);

    // Process first purchase and activate rewards if user came through referral
    const referral = await referralService.processFirstPurchase(userId, orderId, orderValue);

    if (referral) {
      logger.info(`🎉 [${requestId}] Referral rewards processed for referral: ${referral.id}`);

      // Send referral success notification to admin
      await sendReferralNotification({
        referral,
        orderId,
        orderValue,
        requestId
      });
    } else {
      logger.info(`ℹ️ [${requestId}] No referral found for user: ${userId}`);
    }

  } catch (error) {
    logger.error(`❌ [${requestId}] Error processing referral:`, error);
    // Don't throw error - referral processing shouldn't break order processing
  }
}

async function sendReferralNotification(data: any) {
  try {
    const { referral, orderId, orderValue, requestId } = data;

    await sendEmailWithRetry({
      to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.com',
      subject: `🎯 Referral Convertido - Pedido #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4caf50;">🎯 Referral Convertido!</h2>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📈 Conversão de Referral</h3>
            <p><strong>Referral ID:</strong> ${referral.id}</p>
            <p><strong>Status:</strong> ${referral.status}</p>
            <p><strong>Pedido ID:</strong> #${orderId}</p>
            <p><strong>Valor do Pedido:</strong> €${orderValue.toFixed(2)}</p>
            <p><strong>Data da Conversão:</strong> ${new Date().toLocaleString('pt-PT')}</p>
          </div>

          <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>👥 Participantes</h3>
            <p><strong>Referrer (Quem indicou):</strong> ${referral.referrerId}</p>
            <p><strong>Referee (Quem foi indicado):</strong> ${referral.refereeId}</p>
          </div>

          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🎁 Recompensas</h3>
            <p>✅ Recompensas foram processadas automaticamente</p>
            <p>✅ Cupons/cashback/pontos foram creditados</p>
            <p>✅ Notificações enviadas aos usuários</p>
          </div>

          <hr style="margin: 30px 0;">
          <p style="text-align: center; color: #666;">
            <strong>Sistema de Referrals - JC Hair Studio's 62</strong><br>
            Request ID: ${requestId}
          </p>
        </div>
      `,
      sandbox: !process.env.SENDGRID_API_KEY
    }, requestId, 'referral_conversion');

  } catch (error) {
    logger.error('❌ Failed to send referral notification:', error);
  }
}

// Configuração para Next.js 14 (route segment config)
export const dynamic = 'force-dynamic';
export const maxDuration = 60;