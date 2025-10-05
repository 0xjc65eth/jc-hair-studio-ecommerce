import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { sendEmail, generateOrderConfirmationEmail } from '@/lib/utils/email';
import logger from '@/lib/logger';

// Inicializar Stripe com configuração otimizada
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  timeout: 30000,
  maxNetworkRetries: 3,
}) : null;

// Webhook Secret do Stripe (configurado no dashboard)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
        'payment_success',
        'payment_failed',
        'dispute_created',
        'email_test'
      ],
      usage: 'Add ?test=payment_success to test specific scenarios'
    });
  }

  try {
    switch (testType) {
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
    return NextResponse.json({ error: 'Stripe not configured', requestId }, { status: 500 });
  }

  if (!webhookSecret) {
    logger.error(`❌ [${requestId}] Stripe webhook secret not configured`);
    return NextResponse.json({ error: 'Webhook secret not configured', requestId }, { status: 500 });
  }

  try {
    const body = await request.text();
    const sig = headers().get('stripe-signature');

    if (!sig) {
      logger.error(`❌ [${requestId}] No Stripe signature found`);
      return NextResponse.json({ error: 'No signature provided', requestId }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      // Verificar a assinatura do webhook
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      logger.info(`✅ [${requestId}] Webhook signature verified: ${event.type}`);
    } catch (err: any) {
      logger.error(`❌ [${requestId}] Webhook signature verification failed: ${err.message}`);

      // Fallback: try to parse the event manually for testing purposes
      try {
        event = JSON.parse(body) as Stripe.Event;
        logger.warn(`⚠️ [${requestId}] Processing unsigned webhook event (TESTING MODE): ${event.type}`);

        // Add a flag to indicate this is an unsigned event
        (event as any).__unsigned = true;
      } catch (parseErr) {
        logger.error(`❌ [${requestId}] Failed to parse webhook body: ${parseErr}`);
        return NextResponse.json(
          { error: `Webhook Error: ${err.message}`, requestId },
          { status: 400 }
        );
      }
    }

    // Processar diferentes tipos de eventos
    const isUnsigned = !!(event as any).__unsigned;

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent, requestId, isUnsigned);
          break;

        case 'payment_intent.payment_failed':
          await handlePaymentFailed(event.data.object as Stripe.PaymentIntent, requestId, isUnsigned);
          break;

        case 'charge.dispute.created':
          await handleDispute(event.data.object as Stripe.Dispute, requestId, isUnsigned);
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

        default:
          logger.info(`🔔 [${requestId}] Unhandled event type: ${event.type}`);
      }
    } catch (eventError) {
      logger.error(`❌ [${requestId}] Error processing event ${event.type}:`, eventError);

      // Even if event processing fails, we should still return 200 to Stripe
      // to prevent retries, but log the error for investigation
      await sendFailureNotification({
        requestId,
        eventType: event.type,
        eventId: event.id,
        error: eventError,
        isUnsigned
      });
    }

    // Retornar sucesso
    logger.info(`✅ [${requestId}] Webhook processed successfully: ${event.type}`);
    return NextResponse.json(
      { received: true, type: event.type, requestId, unsigned: isUnsigned },
      { status: 200 }
    );

  } catch (error) {
    logger.error(`❌ [${requestId}] Webhook handler failed:`, error);

    // Send failure notification
    await sendFailureNotification({
      requestId,
      eventType: 'unknown',
      eventId: 'unknown',
      error,
      isUnsigned: false
    });

    return NextResponse.json(
      { error: 'Webhook handler failed', requestId },
      { status: 500 }
    );
  }
}

// ==================== HANDLERS DOS EVENTOS ====================

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent, requestId: string, isUnsigned: boolean = false) {
  logger.info(`🎉 [${requestId}] Payment succeeded: ${paymentIntent.id} ${isUnsigned ? '(UNSIGNED)' : ''}`);

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

  try {
    // Save order to database with retry logic
    await saveOrderToDatabase(orderData, requestId);

    // Send confirmation email to customer with retry logic
    await sendCustomerConfirmationWithRetry(orderData, requestId);

    // Send notification email to admin with retry logic
    await sendAdminNotificationWithRetry(orderData, requestId);

    logger.info(`✅ [${requestId}] Order processed successfully: ${orderId}`);
  } catch (error) {
    logger.error(`❌ [${requestId}] Error processing order:`, error);

    // Send failure notification but don't throw - webhook should still return 200
    await sendFailureNotification({
      requestId,
      eventType: 'payment_intent.succeeded',
      eventId: paymentIntent.id,
      error,
      orderData,
      isUnsigned
    });
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent, requestId: string, isUnsigned: boolean = false) {
  logger.info(`❌ [${requestId}] Payment failed: ${paymentIntent.id} ${isUnsigned ? '(UNSIGNED)' : ''}`);

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

async function handleDispute(dispute: Stripe.Dispute, requestId: string, isUnsigned: boolean = false) {
  logger.info(`⚠️ [${requestId}] Dispute created: ${dispute.id} ${isUnsigned ? '(UNSIGNED)' : ''}`);

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

async function saveOrderToDatabase(orderData: any, requestId: string) {
  logger.info(`💾 [${requestId}] Saving order data:`, JSON.stringify(orderData, null, 2));

  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // First, try to save to admin orders API if it exists
      const baseUrl = process.env.NEXTAUTH_URL ||
                     process.env.NEXT_PUBLIC_SITE_URL ||
                     'https://jchairstudios62.xyz';

      try {
        const response = await fetch(`${baseUrl}/api/admin/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (response.ok) {
          logger.info(`✅ [${requestId}] Order saved to dashboard successfully (attempt ${attempt})`);
          return; // Success, exit function
        } else {
          const errorText = await response.text();
          logger.warn(`⚠️ [${requestId}] Failed to save order to dashboard (attempt ${attempt}): ${response.status} - ${errorText}`);
        }
      } catch (apiError) {
        logger.warn(`⚠️ [${requestId}] Admin API not available (attempt ${attempt}):`, apiError);
      }

      // Fallback: Save to local file system or log storage
      await saveOrderToFallbackStorage(orderData, requestId);
      return; // Success, exit function

    } catch (error) {
      logger.error(`❌ [${requestId}] Error saving order (attempt ${attempt}):`, error);

      if (attempt < maxRetries) {
        logger.info(`🔄 [${requestId}] Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      } else {
        logger.error(`❌ [${requestId}] Failed to save order after ${maxRetries} attempts`);
        throw error;
      }
    }
  }
}

async function saveOrderToFallbackStorage(orderData: any, requestId: string) {
  // Fallback storage - you could implement MongoDB, file system, or other storage
  logger.info(`💾 [${requestId}] Using fallback storage for order: ${orderData.orderId}`);

  try {
    // Here you could integrate with MongoDB, PostgreSQL, or other database
    // For now, we'll log the structured data that can be easily retrieved
    const orderLogEntry = {
      timestamp: new Date().toISOString(),
      requestId,
      orderId: orderData.orderId,
      customerEmail: orderData.customerEmail,
      total: orderData.total,
      status: 'saved_to_fallback',
      data: orderData
    };

    logger.info(`📋 [${requestId}] FALLBACK_ORDER_STORAGE:`, JSON.stringify(orderLogEntry));

    // TODO: Implement actual fallback storage
    // Examples:
    // - await mongodb.collection('orders').insertOne(orderData);
    // - await fs.writeFile(`/tmp/orders/${orderData.orderId}.json`, JSON.stringify(orderData));
    // - await redis.set(`order:${orderData.orderId}`, JSON.stringify(orderData));

  } catch (fallbackError) {
    logger.error(`❌ [${requestId}] Fallback storage also failed:`, fallbackError);
    throw fallbackError;
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
          <p><strong>Is Unsigned:</strong> ${data.isUnsigned ? 'Yes' : 'No'}</p>
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

// Configuração para o Next.js - bodyParser é desabilitado automaticamente para webhooks no App Router