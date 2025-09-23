import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Verificar se a chave do Stripe está disponível e é válida
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not configured - payments will not work');
} else {
  // Validate Stripe key format
  const keyPattern = /^sk_(test|live)_[a-zA-Z0-9]{24,}$/;
  if (!keyPattern.test(process.env.STRIPE_SECRET_KEY)) {
    console.error('⚠️ Invalid STRIPE_SECRET_KEY format:', {
      keyLength: process.env.STRIPE_SECRET_KEY.length,
      keyStart: process.env.STRIPE_SECRET_KEY.substring(0, 10) + '...',
      isLiveKey: process.env.STRIPE_SECRET_KEY.startsWith('sk_live_'),
      isTestKey: process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')
    });
  } else {
    console.log('✅ Stripe key format is valid:', {
      isLiveKey: process.env.STRIPE_SECRET_KEY.startsWith('sk_live_'),
      keyLength: process.env.STRIPE_SECRET_KEY.length
    });
  }
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  timeout: 60000, // 60 second timeout (increased)
  maxNetworkRetries: 5, // Allow 5 retries (increased)
  telemetry: false, // Disable telemetry
  stripeAccount: undefined, // Ensure we're not using connect
  httpAgent: undefined, // Use default HTTP agent
  host: 'api.stripe.com', // Explicitly set host
  protocol: 'https', // Explicitly set protocol
}) : null;

export async function POST(request: NextRequest) {
  try {
    // Log environment status for debugging
    console.log('🔧 Environment check:', {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      stripeKeyLength: process.env.STRIPE_SECRET_KEY?.length || 0,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

    // Verificar se Stripe está configurado
    if (!stripe) {
      console.error('❌ Stripe not configured - missing STRIPE_SECRET_KEY');
      return NextResponse.json(
        {
          error: 'Pagamentos temporariamente indisponíveis',
          message: 'O sistema de pagamentos está sendo configurado. Tente novamente em alguns minutos.',
          fallback: true
        },
        { status: 503 }
      );
    }

    // Testar conectividade com Stripe antes de criar PaymentIntent
    try {
      console.log('🔍 Testing Stripe connectivity with extended timeout...');
      const balance = await stripe.balance.retrieve();
      console.log('✅ Stripe connection test successful');
    } catch (connectionError) {
      console.error('❌ Stripe connection test failed:', connectionError);

      // Se for problema de rede, tentar uma vez mais com configuração diferente
      console.log('🔄 Attempting alternative Stripe configuration...');
      try {
        const alternativeStripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2023-10-16',
          timeout: 120000, // 2 minutos
          maxNetworkRetries: 2,
          telemetry: false,
        });

        await alternativeStripe.balance.retrieve();
        console.log('✅ Alternative Stripe connection successful');

        // Atualizar stripe instance para usar a configuração que funcionou
        Object.assign(stripe, alternativeStripe);

      } catch (alternativeError) {
        console.error('❌ Alternative Stripe connection also failed:', alternativeError);
        return NextResponse.json(
          {
            error: 'Erro de conectividade com Stripe',
            message: 'Sistema de pagamentos temporariamente indisponível. Nossa equipe foi notificada.',
            details: connectionError instanceof Error ? connectionError.message : 'Erro desconhecido',
            retryable: true,
            timestamp: new Date().toISOString()
          },
          { status: 503 }
        );
      }
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
    // Enhanced error logging for debugging
    console.error('❌ Error creating Payment Intent:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      timestamp: new Date().toISOString()
    });

    // Return more specific error message based on error type
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return NextResponse.json(
      {
        error: 'Erro ao inicializar pagamento',
        details: errorMessage,
        debugInfo: {
          hasStripeConfig: !!process.env.STRIPE_SECRET_KEY,
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}