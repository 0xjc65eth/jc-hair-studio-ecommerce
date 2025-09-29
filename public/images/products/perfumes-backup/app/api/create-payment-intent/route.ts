import { NextRequest, NextResponse } from 'next/server';

function getStripeSecretKey() {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is required');
    }
    return STRIPE_SECRET_KEY;
}

async function stripeEdgeRequest(endpoint: string, method = 'GET', body?: any): Promise<any> {
    const url = `https://api.stripe.com/v1/${endpoint}`;

    const requestInit: RequestInit = {
        method,
        headers: {
            'Authorization': `Bearer ${getStripeSecretKey()}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'EdgeRuntime/1.0',
            'Accept': 'application/json',
        },
        body: body ? new URLSearchParams(body).toString() : undefined,
    };

    console.log(`🚀 EDGE API: Fazendo request ${method} para ${endpoint}`);

    const response = await fetch(url, requestInit);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

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

    console.log('💳 Creating Payment Intent via EDGE RUNTIME...', {
      amount,
      currency,
      customer: customerInfo?.email || 'anonymous',
      timestamp: new Date().toISOString()
    });

    // Simplified Stripe request for faster execution
    const paymentIntent = await stripeEdgeRequest('payment_intents', 'POST', {
        amount: Math.round(amount * 100).toString(),
        currency: currency.toLowerCase(),
        'automatic_payment_methods[enabled]': 'true',
        'automatic_payment_methods[allow_redirects]': 'always',
        'metadata[source]': 'jc-hair-studio',
        'metadata[customer]': customerInfo?.email || 'guest'
    });

    const duration = Date.now() - startTime;
    console.log('✅ Payment Intent created successfully via EDGE RUNTIME:', paymentIntent.id, `${duration}ms`);

    // Store payment intent for potential notification later
    const orderData = {
      orderId: paymentIntent.id,
      paymentIntentId: paymentIntent.id,
      customerName: customerInfo?.name || 'Cliente',
      customerEmail: customerInfo?.email || 'email não informado',
      total: amount, // Already in euros
      currency: currency.toUpperCase(),
      itemsCount: items?.length || 1,
      status: 'pending_payment',
      paymentMethod: 'Cartão de Crédito',
      createdAt: new Date().toISOString(),
      metadata: {
        source: 'jc-hair-studio-web',
        itemsCount: items?.length?.toString() || '1',
        customerName: customerInfo?.name || 'Cliente',
        customerEmail: customerInfo?.email || '',
        timestamp: new Date().toISOString()
      }
    };

    // Skip non-critical admin orders creation for speed
    // This will be handled by payment-success webhook instead
    console.log('⚡ Skipping admin order creation for faster response');

    // Retornar dados essenciais para o frontend
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      method: 'EDGE_BYPASS',
      duration
    });

  } catch (error) {
    const duration = Date.now() - startTime;

    // Log estruturado para debugging eficiente
    console.error('❌ EDGE RUNTIME Payment Intent creation failed:', {
      error: error instanceof Error ? error.message : String(error),
      duration,
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
        timestamp: new Date().toISOString(),
        method: 'EDGE_BYPASS',
        duration
      },
      { status: isRetryable ? 503 : 500 }
    );
  }
}