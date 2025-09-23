import { NextRequest, NextResponse } from 'next/server';
import { createRobustPaymentIntent } from '@/lib/stripe/robust-connection';

export async function POST(request: NextRequest) {
  try {
    // Parse request data - validar entrada antes de processar
    const { amount, currency = 'eur', customerInfo, items } = await request.json();

    // Validação robusta de dados de entrada
    if (!amount || amount <= 0) {
      console.warn('❌ Invalid amount provided:', amount);
      return NextResponse.json(
        { error: 'Valor inválido - deve ser maior que zero' },
        { status: 400 }
      );
    }

    // Validação de currency para evitar problemas na API Stripe
    const validCurrencies = ['eur', 'usd', 'gbp', 'brl'];
    if (!validCurrencies.includes(currency.toLowerCase())) {
      console.warn('❌ Invalid currency provided:', currency);
      return NextResponse.json(
        { error: 'Moeda não suportada' },
        { status: 400 }
      );
    }

    console.log('💳 Creating Payment Intent with robust connection...', {
      amount,
      currency,
      customer: customerInfo?.email || 'anonymous',
      timestamp: new Date().toISOString()
    });

    // Usar sistema robusto de conexão - implementa fallback automático e retry inteligente
    const paymentIntent = await createRobustPaymentIntent({
      amount,
      currency: currency.toLowerCase(),
      customerInfo,
      metadata: {
        itemsCount: items?.length?.toString() || '1',
        source: 'jc-hair-studio-web',
        timestamp: new Date().toISOString()
      }
    });

    console.log('✅ Payment Intent created successfully:', paymentIntent.id);

    // Retornar dados essenciais para o frontend
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });

  } catch (error) {
    // Log estruturado para debugging eficiente
    console.error('❌ Payment Intent creation failed:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.split('\n')[0] : undefined,
      timestamp: new Date().toISOString(),
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY
    });

    // Retornar erro estruturado com informações úteis para retry
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';

    // Determinar se é erro retryable baseado na mensagem
    const isRetryable = errorMessage.includes('connection') ||
                       errorMessage.includes('timeout') ||
                       errorMessage.includes('network');

    return NextResponse.json(
      {
        error: 'Erro ao inicializar pagamento',
        message: isRetryable
          ? 'Problema temporário de conexão. Tente novamente em alguns segundos.'
          : 'Erro interno. Nossa equipe foi notificada.',
        details: errorMessage,
        retryable: isRetryable,
        timestamp: new Date().toISOString()
      },
      { status: isRetryable ? 503 : 500 }
    );
  }
}