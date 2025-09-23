import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { sendEmail, generateOrderConfirmationEmail } from '@/lib/utils/email';

// Inicializar Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

// Webhook Secret do Stripe (configurado no dashboard)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = headers().get('stripe-signature');

    if (!sig) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      // Verificar a assinatura do webhook
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`💰 PaymentIntent succeeded: ${paymentIntent.id}`);

        // Enviar email de confirmação
        if (paymentIntent.metadata?.customerEmail) {
          const emailData = generateOrderConfirmationEmail({
            orderId: paymentIntent.id,
            customerName: paymentIntent.metadata.customerName || 'Cliente',
            customerEmail: paymentIntent.metadata.customerEmail,
            items: JSON.parse(paymentIntent.metadata.items || '[]'),
            total: paymentIntent.amount / 100,
            paymentMethod: 'Cartão de Crédito'
          });

          await sendEmail(emailData);
          console.log(`📧 Email de confirmação enviado para: ${paymentIntent.metadata.customerEmail}`);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log(`❌ Payment failed: ${failedPayment.id}`);
        // Aqui você pode notificar o cliente sobre a falha
        break;

      case 'charge.succeeded':
        const charge = event.data.object as Stripe.Charge;
        console.log(`✅ Charge succeeded: ${charge.id}`);
        break;

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`✅ Checkout session completed: ${session.id}`);

        // Processar pedido completo
        if (session.customer_email) {
          // Aqui você pode criar o pedido no banco de dados
          console.log(`Pedido processado para: ${session.customer_email}`);
        }
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
        console.log(`Unhandled event type: ${event.type}`);
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

// Configuração para o Next.js
export const config = {
  api: {
    bodyParser: false, // Stripe requer o body cru
  },
};