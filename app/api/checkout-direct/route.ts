import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * API de checkout DIRETO - sem testes de conectividade
 * Implementação simplificada que vai direto criar Checkout Session
 * Baseada no exemplo Ruby/Sinatra funcional fornecido pelo usuário
 */

export async function POST(request: NextRequest) {
  try {
    // Verificação mínima de configuração
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Configuração de pagamento indisponível' },
        { status: 503 }
      );
    }

    // Parse dados de entrada
    const { amount, currency = 'eur', customerInfo, items } = await request.json();

    // Validação crítica apenas
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valor inválido' },
        { status: 400 }
      );
    }

    console.log('🛒 DIRECT Checkout Session creation (no connectivity test)...', {
      amount,
      currency,
      timestamp: new Date().toISOString()
    });

    // Configuração Stripe simplificada - igual ao exemplo Ruby funcional
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
      // Sem configurações extras - manter o mais simples possível
    });

    // URLs de retorno
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jchairstudios62.xyz';
    const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/checkout/cancel`;

    // Criar Checkout Session DIRETAMENTE - seguindo exemplo Ruby
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Produto JC Hair Studio - ${customerInfo?.name || 'Cliente'}`,
              description: `Compra de ${items?.length || 1} item(s)`,
              images: ['https://jchairstudios62.xyz/icon-144x144.png'], // Logo da loja
            },
            unit_amount: Math.round(amount * 100), // Converter para centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Configurações opcionais para melhorar UX
      customer_email: customerInfo?.email || undefined,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['PT', 'ES', 'FR', 'DE', 'IT', 'NL', 'BE'], // Europa
      },
      metadata: {
        customerName: customerInfo?.name || 'Cliente',
        itemsCount: items?.length?.toString() || '1',
        source: 'jc-hair-studio-direct',
        timestamp: new Date().toISOString()
      },
      // Configurações de expiração
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutos
    });

    console.log('✅ DIRECT Checkout Session created successfully:', session.id);

    // Retornar dados estruturados
    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      status: session.status,
      amount_total: session.amount_total,
      currency: session.currency,
      expires_at: session.expires_at,
      created: session.created
    });

  } catch (error: any) {
    // Log estruturado para debugging
    console.error('❌ DIRECT Checkout Session failed:', {
      error: error?.message || String(error),
      code: error?.code || 'unknown',
      type: error?.type || 'unknown',
      timestamp: new Date().toISOString()
    });

    // Análise do tipo de erro Stripe para melhor feedback
    const stripeErrorTypes = {
      'card_error': 'Problema com o cartão',
      'rate_limit_error': 'Muitas requisições, tente novamente',
      'invalid_request_error': 'Dados de checkout inválidos',
      'authentication_error': 'Erro de autenticação na loja',
      'api_connection_error': 'Erro de conexão temporário',
      'api_error': 'Erro interno do sistema',
      'idempotency_error': 'Sessão já criada'
    };

    const errorType = error?.type || 'unknown';
    const userMessage = stripeErrorTypes[errorType as keyof typeof stripeErrorTypes] ||
                       'Erro interno no sistema de checkout';

    // Determinar se é retryable
    const retryableErrors = ['rate_limit_error', 'api_connection_error', 'api_error'];
    const isRetryable = retryableErrors.includes(errorType) ||
                       error?.message?.includes('connection') ||
                       error?.message?.includes('timeout') ||
                       error?.message?.includes('network');

    return NextResponse.json(
      {
        success: false,
        error: 'Erro na criação do checkout',
        message: userMessage,
        details: error?.message || 'Erro desconhecido',
        retryable: isRetryable,
        errorCode: error?.code || 'unknown',
        timestamp: new Date().toISOString()
      },
      { status: isRetryable ? 503 : 400 }
    );
  }
}