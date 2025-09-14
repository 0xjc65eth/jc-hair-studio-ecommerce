import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { MongoOrderService } from '@/lib/services/mongoOrderService';
import { connectToDatabase } from '@/lib/mongodb/connection';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    console.log(`Received Stripe webhook: ${event.type}`);

    // Connect to database
    await connectToDatabase();

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionEvent(subscription, event.type);
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        await handleChargeDispute(dispute);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing completed checkout session:', session.id);

    // Get full session with line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer']
    });

    // Update order status to completed
    if (session.metadata?.orderId) {
      await MongoOrderService.updateOrderStatus(
        session.metadata.orderId,
        'COMPLETED',
        {
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
          paymentMethod: session.payment_method_types[0],
          amountReceived: session.amount_total || 0,
          currency: session.currency || 'eur'
        }
      );

      console.log(`Order ${session.metadata.orderId} marked as completed`);
    }

    // Send confirmation email (if email service is configured)
    if (session.customer_email) {
      await sendOrderConfirmationEmail(session.customer_email, fullSession);
    }

  } catch (error) {
    console.error('Error handling checkout completed:', error);
    throw error;
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Processing successful payment:', paymentIntent.id);

    // Update order status if metadata contains orderId
    if (paymentIntent.metadata?.orderId) {
      await MongoOrderService.updateOrderStatus(
        paymentIntent.metadata.orderId,
        'PROCESSING',
        {
          stripePaymentIntentId: paymentIntent.id,
          amountReceived: paymentIntent.amount_received,
          currency: paymentIntent.currency
        }
      );
    }

  } catch (error) {
    console.error('Error handling payment succeeded:', error);
    throw error;
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Processing failed payment:', paymentIntent.id);

    // Update order status to failed
    if (paymentIntent.metadata?.orderId) {
      await MongoOrderService.updateOrderStatus(
        paymentIntent.metadata.orderId,
        'PAYMENT_FAILED',
        {
          stripePaymentIntentId: paymentIntent.id,
          failureReason: paymentIntent.last_payment_error?.message || 'Payment failed'
        }
      );
    }

  } catch (error) {
    console.error('Error handling payment failed:', error);
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log('Processing successful invoice payment:', invoice.id);

    // Handle subscription invoice payments
    if (invoice.subscription && invoice.metadata?.orderId) {
      await MongoOrderService.updateOrderStatus(
        invoice.metadata.orderId,
        'COMPLETED',
        {
          stripeInvoiceId: invoice.id,
          subscriptionId: invoice.subscription as string
        }
      );
    }

  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
    throw error;
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log('Processing failed invoice payment:', invoice.id);

    // Handle failed subscription payments
    if (invoice.subscription && invoice.metadata?.orderId) {
      await MongoOrderService.updateOrderStatus(
        invoice.metadata.orderId,
        'PAYMENT_FAILED',
        {
          stripeInvoiceId: invoice.id,
          subscriptionId: invoice.subscription as string,
          failureReason: 'Invoice payment failed'
        }
      );
    }

  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
    throw error;
  }
}

async function handleSubscriptionEvent(
  subscription: Stripe.Subscription,
  eventType: string
) {
  try {
    console.log(`Processing subscription event: ${eventType}`, subscription.id);

    // Handle subscription lifecycle events
    // This can be extended based on your subscription needs

  } catch (error) {
    console.error('Error handling subscription event:', error);
    throw error;
  }
}

async function handleChargeDispute(dispute: Stripe.Dispute) {
  try {
    console.log('Processing charge dispute:', dispute.id);

    // Handle disputes/chargebacks
    // Update order status and notify admins

  } catch (error) {
    console.error('Error handling charge dispute:', error);
    throw error;
  }
}

async function sendOrderConfirmationEmail(email: string, session: Stripe.Checkout.Session) {
  try {
    // This would integrate with your email service (SendGrid, etc.)
    console.log(`Would send confirmation email to: ${email}`);

    // TODO: Implement email sending logic

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't throw - email failure shouldn't fail the webhook
  }
}