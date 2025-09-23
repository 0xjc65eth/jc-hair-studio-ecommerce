import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Configuração simples do Stripe (seguindo exemplo funcional)
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
}) : null;

export async function POST(request: NextRequest) {
  try {
    // Verificar se Stripe está configurado
    if (!stripe) {
      console.error('❌ Stripe not configured - missing STRIPE_SECRET_KEY');
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

    console.log('🛒 Creating Stripe Checkout Session...');

    // Criar Checkout Session (igual ao exemplo funcional)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: customerInfo?.name || 'Produto JC Hair Studio',
              description: `Compra de ${items?.length || 1} item(s)`,
            },
            unit_amount: Math.round(amount * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jchairstudios62.xyz'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jchairstudios62.xyz'}/checkout/cancel`,
      customer_email: customerInfo?.email,
      metadata: {
        customerName: customerInfo?.name || 'Cliente',
        itemsCount: items?.length?.toString() || '1',
      },
    });

    console.log('✅ Checkout Session created:', session.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('❌ Error creating Checkout Session:', error);

    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return NextResponse.json(
      {
        error: 'Erro ao criar sessão de pagamento',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}