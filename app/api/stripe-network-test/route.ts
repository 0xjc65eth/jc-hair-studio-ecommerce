import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  const tests = [];
  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    tests: []
  };

  try {
    // Teste 1: Verificar chaves
    tests.push({
      name: 'Key Configuration',
      status: 'running',
      details: {
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        keyLength: process.env.STRIPE_SECRET_KEY?.length || 0,
        isLiveKey: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') || false,
        keyStart: process.env.STRIPE_SECRET_KEY?.substring(0, 15) || 'N/A'
      }
    });

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        ...results,
        tests: [{ ...tests[0], status: 'failed', error: 'No Stripe key found' }]
      });
    }

    // Teste 2: Configurações mínimas do Stripe
    tests.push({
      name: 'Minimal Stripe Configuration',
      status: 'running'
    });

    const stripeMinimal = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    });

    tests[1].status = 'passed';
    tests[1].details = { message: 'Stripe instance created with minimal config' };

    // Teste 3: Configuração com timeout curto
    tests.push({
      name: 'Short Timeout Test',
      status: 'running'
    });

    const stripeShort = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      timeout: 5000,
      maxNetworkRetries: 0
    });

    try {
      const balance = await stripeShort.balance.retrieve();
      tests[2].status = 'passed';
      tests[2].details = {
        message: 'Balance retrieved successfully',
        available: balance.available?.length || 0
      };
    } catch (error) {
      tests[2].status = 'failed';
      tests[2].error = error instanceof Error ? error.message : String(error);
    }

    // Teste 4: Teste de criação de produto simples
    tests.push({
      name: 'Simple Product Creation',
      status: 'running'
    });

    try {
      const product = await stripeMinimal.products.create({
        name: 'Test Product JC Hair Studio',
        description: 'Test product for connectivity'
      });

      // Deletar o produto de teste imediatamente
      await stripeMinimal.products.del(product.id);

      tests[3].status = 'passed';
      tests[3].details = {
        message: 'Product created and deleted successfully',
        productId: product.id
      };
    } catch (error) {
      tests[3].status = 'failed';
      tests[3].error = error instanceof Error ? error.message : String(error);
    }

    // Teste 5: Verificar configurações de webhook
    tests.push({
      name: 'Webhook Endpoints',
      status: 'running'
    });

    try {
      const webhookEndpoints = await stripeMinimal.webhookEndpoints.list({
        limit: 3
      });

      tests[4].status = 'passed';
      tests[4].details = {
        message: 'Webhook endpoints retrieved',
        count: webhookEndpoints.data.length
      };
    } catch (error) {
      tests[4].status = 'failed';
      tests[4].error = error instanceof Error ? error.message : String(error);
    }

    results.tests = tests;

    return NextResponse.json(results, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    return NextResponse.json(
      {
        error: 'Network test failed',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        tests
      },
      { status: 500 }
    );
  }
}