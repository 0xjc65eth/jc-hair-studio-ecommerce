import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Verificar se a chave do Stripe está disponível
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not configured - payments will not work');
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

    const { amount, currency = 'eur', customerInfo, items } = await request.json();

    // Validar dados obrigatórios
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valor inválido' },
        { status: 400 }
      );
    }

    // Criar Payment Intent do Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customerName: customerInfo?.name || 'Cliente',
        customerEmail: customerInfo?.email || '',
        itemsCount: items?.length?.toString() || '0',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Erro ao criar Payment Intent:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}