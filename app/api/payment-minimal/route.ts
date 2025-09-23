import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * API de pagamento ULTRA-MINIMAL
 * Configuração mínima absoluta para contornar problemas de infraestrutura
 * Remove todos os retries e configurações extras do Stripe
 */

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 503 }
      );
    }

    const { amount, currency = 'eur', customerInfo } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    console.log('💳 MINIMAL Payment Intent - zero config...');

    // Configuração ULTRA-MINIMAL - sem qualquer configuração extra
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
      // SEM timeout customizado
      // SEM maxNetworkRetries (deixa padrão 0)
      // SEM telemetry (deixa padrão)
      // SEM host customizado
      // SEM protocol customizado
    });

    // Criação MINIMAL - apenas campos obrigatórios
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('✅ MINIMAL Payment Intent success:', paymentIntent.id);

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });

  } catch (error: any) {
    console.error('❌ MINIMAL Payment Intent error:', error?.message);

    return NextResponse.json(
      {
        success: false,
        error: 'Payment creation failed',
        message: error?.message || 'Unknown error',
        errorCode: error?.code || 'unknown'
      },
      { status: 500 }
    );
  }
}