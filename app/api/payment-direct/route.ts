import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * API de pagamento DIRETA - sem testes de conectividade
 * Bypassa todos os testes e vai direto criar o Payment Intent
 * Solução para problemas de conectividade entre Vercel e Stripe Live API
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

    // Parse dados de entrada com validação básica
    const { amount, currency = 'eur', customerInfo, items } = await request.json();

    // Validação crítica apenas
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valor inválido' },
        { status: 400 }
      );
    }

    console.log('💳 DIRECT Payment Intent creation (no connectivity test)...', {
      amount,
      currency,
      timestamp: new Date().toISOString()
    });

    // Configuração mínima Stripe - sem testes, sem overhead
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
      timeout: 30000, // 30 segundos - timeout padrão
      maxNetworkRetries: 3, // Retries padrão Stripe
      telemetry: false // Sem telemetria
    });

    // IR DIRETO para criação de Payment Intent - sem testes prévios
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Converter para centavos
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      description: `Compra JC Hair Studio - ${customerInfo?.name || 'Cliente'}`,
      metadata: {
        customerName: customerInfo?.name || 'Cliente',
        customerEmail: customerInfo?.email || '',
        itemsCount: items?.length?.toString() || '1',
        source: 'jc-hair-studio-direct',
        timestamp: new Date().toISOString()
      },
      // Configurações adicionais para aumentar chance de sucesso
      receipt_email: customerInfo?.email || undefined,
      statement_descriptor: 'JC HAIR STUDIO', // Aparece no extrato
    });

    console.log('✅ DIRECT Payment Intent created successfully:', paymentIntent.id);

    // Retornar resposta otimizada
    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      created: paymentIntent.created
    });

  } catch (error: any) {
    // Log estruturado para debugging
    console.error('❌ DIRECT Payment Intent failed:', {
      error: error?.message || String(error),
      code: error?.code || 'unknown',
      type: error?.type || 'unknown',
      timestamp: new Date().toISOString()
    });

    // Análise do tipo de erro Stripe
    const stripeErrorTypes = {
      'card_error': 'Problema com o cartão',
      'rate_limit_error': 'Muitas requisições, tente novamente',
      'invalid_request_error': 'Dados inválidos',
      'authentication_error': 'Erro de autenticação',
      'api_connection_error': 'Erro de conexão',
      'api_error': 'Erro interno da API',
      'idempotency_error': 'Requisição duplicada'
    };

    const errorType = error?.type || 'unknown';
    const userMessage = stripeErrorTypes[errorType as keyof typeof stripeErrorTypes] ||
                       'Erro interno no sistema de pagamentos';

    // Determinar se é retryable
    const retryableErrors = ['rate_limit_error', 'api_connection_error', 'api_error'];
    const isRetryable = retryableErrors.includes(errorType) ||
                       error?.message?.includes('connection') ||
                       error?.message?.includes('timeout');

    return NextResponse.json(
      {
        success: false,
        error: 'Erro no processamento do pagamento',
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