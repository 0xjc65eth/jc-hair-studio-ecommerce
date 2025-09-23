import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * API de checkout ULTRA-MINIMAL
 * Configuração mínima absoluta seguindo o exemplo Ruby funcional
 * Remove todos os extras que podem causar problemas de conectividade
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

    console.log('🛒 MINIMAL Checkout Session - zero config...');

    // Configuração ULTRA-MINIMAL - igual ao Ruby funcional
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
    });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jchairstudios62.xyz';

    // Criação MINIMAL - apenas campos essenciais
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'JC Hair Studio Product',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success`,
      cancel_url: `${baseUrl}/checkout/cancel`,
    });

    console.log('✅ MINIMAL Checkout Session success:', session.id);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      status: session.status,
    });

  } catch (error: any) {
    console.error('❌ MINIMAL Checkout Session error:', error?.message);

    return NextResponse.json(
      {
        success: false,
        error: 'Checkout creation failed',
        message: error?.message || 'Unknown error',
        errorCode: error?.code || 'unknown'
      },
      { status: 500 }
    );
  }
}