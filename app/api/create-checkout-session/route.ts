import { NextRequest, NextResponse } from 'next/server';
import { createRobustCheckoutSession } from '@/lib/stripe/robust-connection';

export async function POST(request: NextRequest) {
  try {
    // Parse e validação de dados de entrada
    const { amount, currency = 'eur', customerInfo, items } = await request.json();

    // Validação robusta de dados obrigatórios
    if (!amount || amount <= 0) {
      console.warn('❌ Invalid amount for checkout session:', amount);
      return NextResponse.json(
        { error: 'Valor inválido - deve ser maior que zero' },
        { status: 400 }
      );
    }

    // Validação de currency suportadas
    const validCurrencies = ['eur', 'usd', 'gbp', 'brl'];
    if (!validCurrencies.includes(currency.toLowerCase())) {
      console.warn('❌ Invalid currency for checkout:', currency);
      return NextResponse.json(
        { error: 'Moeda não suportada' },
        { status: 400 }
      );
    }

    // Validação básica de email se fornecido
    if (customerInfo?.email && !customerInfo.email.includes('@')) {
      console.warn('❌ Invalid email format:', customerInfo.email);
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    console.log('🛒 Creating Checkout Session with robust connection...', {
      amount,
      currency,
      customer: customerInfo?.email || 'anonymous',
      items: items?.length || 1,
      timestamp: new Date().toISOString()
    });

    // Configurar URLs de sucesso e cancelamento - usar URLs dinâmicas baseadas no ambiente
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jchairstudios62.xyz';
    const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/checkout/cancel`;

    // Usar sistema robusto de conexão para criar checkout session
    const session = await createRobustCheckoutSession({
      amount,
      currency: currency.toLowerCase(),
      customerInfo,
      successUrl,
      cancelUrl,
      metadata: {
        itemsCount: items?.length?.toString() || '1',
        source: 'jc-hair-studio-checkout',
        timestamp: new Date().toISOString()
      }
    });

    console.log('✅ Checkout Session created successfully:', session.id);

    // Retornar dados estruturados para o frontend
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      status: session.status,
      amount_total: session.amount_total,
      currency: session.currency,
      expires_at: session.expires_at
    });

  } catch (error) {
    // Log estruturado para debugging eficiente
    console.error('❌ Checkout Session creation failed:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.split('\n')[0] : undefined,
      timestamp: new Date().toISOString(),
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY
    });

    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';

    // Determinar se é erro retryable para orientar o frontend
    const isRetryable = errorMessage.includes('connection') ||
                       errorMessage.includes('timeout') ||
                       errorMessage.includes('network') ||
                       errorMessage.includes('retry');

    // Retornar resposta estruturada com informações de retry
    return NextResponse.json(
      {
        error: 'Erro ao criar sessão de pagamento',
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