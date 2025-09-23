import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { sendEmail, generateOrderConfirmationEmail } from '@/lib/utils/email';

// Inicializar Stripe com configuração otimizada
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  timeout: 30000,
  maxNetworkRetries: 3,
}) : null;

// Webhook Secret do Stripe (configurado no dashboard)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!stripe) {
    console.error('❌ Stripe not configured');
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  if (!webhookSecret) {
    console.error('❌ Stripe webhook secret not configured');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  try {
    const body = await request.text();
    const sig = headers().get('stripe-signature');

    if (!sig) {
      console.error('❌ No Stripe signature found');
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      // Verificar a assinatura do webhook
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      console.log('✅ Webhook signature verified:', event.type);
    } catch (err: any) {
      console.error(`❌ Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.dispute.created':
        await handleDispute(event.data.object as Stripe.Dispute);
        break;

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`✅ Checkout session completed: ${session.id}`);
        break;

      case 'customer.created':
        const customer = event.data.object as Stripe.Customer;
        console.log(`👤 New customer created: ${customer.id}`);
        break;

      case 'invoice.paid':
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`📄 Invoice paid: ${invoice.id}`);
        break;

      default:
        console.log(`🔔 Unhandled event type: ${event.type}`);
    }

    // Retornar sucesso
    return NextResponse.json(
      { received: true, type: event.type },
      { status: 200 }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// ==================== HANDLERS DOS EVENTOS ====================

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('🎉 Payment succeeded:', paymentIntent.id);

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
    // Save order to database
    await saveOrderToDatabase(orderData);

    // Send confirmation email to customer
    await sendCustomerConfirmation(orderData);

    // Send notification email to admin
    await sendAdminNotification(orderData);

    console.log('✅ Order processed successfully:', orderId);
  } catch (error) {
    console.error('❌ Error processing order:', error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id);

  const customerEmail = paymentIntent.metadata.customerEmail;
  if (customerEmail) {
    await sendEmail({
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
      sandbox: !process.env.SENDGRID_API_KEY
    });
  }
}

async function handleDispute(dispute: Stripe.Dispute) {
  console.log('⚠️ Dispute created:', dispute.id);

  await sendEmail({
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
  });
}

async function sendCustomerConfirmation(orderData: any) {
  const emailData = generateOrderConfirmationEmail({
    orderId: orderData.orderId,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    total: orderData.total,
    items: [], // You can parse items from metadata
    paymentMethod: orderData.paymentMethod,
    shippingType: orderData.shippingType,
    estimatedDelivery: orderData.estimatedDelivery
  });

  await sendEmail(emailData);
}

async function sendAdminNotification(orderData: any) {
  await sendEmail({
    to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.com',
    subject: `🎉 Nova Venda - Pedido #${orderData.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4caf50;">🎉 Nova Venda Realizada!</h2>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>📋 Detalhes do Pedido</h3>
          <p><strong>Pedido ID:</strong> #${orderData.orderId}</p>
          <p><strong>Valor Total:</strong> €${orderData.total.toFixed(2)} ${orderData.currency}</p>
          <p><strong>Quantidade de Itens:</strong> ${orderData.itemsCount}</p>
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
    `,
    sandbox: !process.env.SENDGRID_API_KEY
  });
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

async function saveOrderToDatabase(orderData: any) {
  // Log the order for now
  console.log('💾 Order Data to Save:', JSON.stringify(orderData, null, 2));

  try {
    // Save to admin orders API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/admin/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      console.log('✅ Order saved to dashboard successfully');
    } else {
      console.error('❌ Failed to save order to dashboard');
    }
  } catch (error) {
    console.error('❌ Error saving order to dashboard:', error);
  }

  // TODO: Integrate with your database
  // Example with Prisma:
  // await prisma.order.create({
  //   data: orderData
  // });
}

// Configuração para o Next.js
export const config = {
  api: {
    bodyParser: false, // Stripe requer o body cru
  },
};