import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Stripe Debug - Checking configuration...');

    // Verificar variáveis de ambiente
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    const hasPublicKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    const secretKeyLength = process.env.STRIPE_SECRET_KEY?.length || 0;
    const secretKeyStart = process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'N/A';
    const isLiveKey = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') || false;
    const isTestKey = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') || false;

    const publicKeyLength = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.length || 0;
    const publicKeyStart = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 10) || 'N/A';

    const result = {
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      },
      configuration: {
        hasSecretKey,
        hasPublicKey,
        secretKeyLength,
        secretKeyStart,
        isLiveKey,
        isTestKey,
        publicKeyLength,
        publicKeyStart
      },
      tests: {
        stripeInstanceCreated: false,
        balanceRetrieved: false,
        errorMessage: null
      }
    };

    // Tentar criar instância do Stripe
    let stripe = null;
    if (hasSecretKey) {
      try {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2023-10-16',
          timeout: 10000, // 10 segundos
          maxNetworkRetries: 1, // Só 1 tentativa para teste rápido
        });
        result.tests.stripeInstanceCreated = true;
        console.log('✅ Stripe instance created successfully');
      } catch (error) {
        result.tests.errorMessage = `Stripe instance creation failed: ${error instanceof Error ? error.message : String(error)}`;
        console.log('❌ Stripe instance creation failed:', error);
      }
    }

    // Tentar testar conectividade
    if (stripe) {
      try {
        console.log('🔍 Testing Stripe connectivity...');
        const balance = await stripe.balance.retrieve();
        result.tests.balanceRetrieved = true;
        console.log('✅ Stripe balance retrieved successfully');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        result.tests.errorMessage = `Balance retrieval failed: ${errorMessage}`;
        console.log('❌ Stripe balance retrieval failed:', error);
      }
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    return NextResponse.json(
      {
        error: 'Debug endpoint failed',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}