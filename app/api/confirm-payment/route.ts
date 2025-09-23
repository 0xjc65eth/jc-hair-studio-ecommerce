import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Verificar se a chave do Stripe está disponível
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not configured - payment confirmation will not work');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-09-30.acacia',
}) : null;

export async function POST(request: NextRequest) {
  try {
    // Verificar se Stripe está configurado
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe não configurado' },
        { status: 500 }
      );
    }

    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID obrigatório' },
        { status: 400 }
      );
    }

    // Buscar o Payment Intent no Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Verificar se o pagamento foi bem-sucedido
    if (paymentIntent.status === 'succeeded') {
      return NextResponse.json({
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          amount: paymentIntent.amount / 100, // Converter de centavos
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          metadata: paymentIntent.metadata,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        status: paymentIntent.status,
        error: 'Pagamento não confirmado',
      });
    }

  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}