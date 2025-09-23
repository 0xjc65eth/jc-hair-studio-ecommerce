import { NextRequest, NextResponse } from 'next/server';
import { robustStripe, createRobustPaymentIntent, createRobustCheckoutSession } from '@/lib/stripe/robust-connection';

/**
 * Endpoint de teste para verificar funcionamento do sistema robusto de pagamentos
 * Testa múltiplas operações Stripe com diferentes estratégias de conexão
 */
export async function GET(request: NextRequest) {
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    tests: [] as any[]
  };

  try {
    // Teste 1: Verificar status da conexão robusta
    console.log('🔍 Testing robust Stripe connection status...');
    testResults.tests.push({
      name: 'Connection Status',
      status: 'running',
      startTime: Date.now()
    });

    const connectionStatus = robustStripe.getConnectionStatus();
    testResults.tests[0].status = 'passed';
    testResults.tests[0].result = connectionStatus;
    testResults.tests[0].duration = Date.now() - testResults.tests[0].startTime;

    // Teste 2: Testar criação de Payment Intent pequeno
    console.log('💳 Testing robust Payment Intent creation...');
    testResults.tests.push({
      name: 'Payment Intent Creation',
      status: 'running',
      startTime: Date.now()
    });

    try {
      const paymentIntent = await createRobustPaymentIntent({
        amount: 1, // Valor mínimo para teste
        currency: 'eur',
        customerInfo: {
          name: 'Teste Robusto',
          email: 'teste@jchairstudios62.xyz'
        },
        metadata: {
          test: 'robust_system_test',
          environment: process.env.NODE_ENV || 'unknown'
        }
      });

      testResults.tests[1].status = 'passed';
      testResults.tests[1].result = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      };
      testResults.tests[1].duration = Date.now() - testResults.tests[1].startTime;
      console.log('✅ Payment Intent test successful:', paymentIntent.id);

    } catch (error) {
      testResults.tests[1].status = 'failed';
      testResults.tests[1].error = error instanceof Error ? error.message : String(error);
      testResults.tests[1].duration = Date.now() - testResults.tests[1].startTime;
      console.log('❌ Payment Intent test failed:', error);
    }

    // Teste 3: Testar criação de Checkout Session
    console.log('🛒 Testing robust Checkout Session creation...');
    testResults.tests.push({
      name: 'Checkout Session Creation',
      status: 'running',
      startTime: Date.now()
    });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jchairstudios62.xyz';

      const session = await createRobustCheckoutSession({
        amount: 1, // Valor mínimo para teste
        currency: 'eur',
        customerInfo: {
          name: 'Teste Checkout Robusto',
          email: 'checkout@jchairstudios62.xyz'
        },
        successUrl: `${baseUrl}/test/success`,
        cancelUrl: `${baseUrl}/test/cancel`,
        metadata: {
          test: 'robust_checkout_test',
          environment: process.env.NODE_ENV || 'unknown'
        }
      });

      testResults.tests[2].status = 'passed';
      testResults.tests[2].result = {
        id: session.id,
        status: session.status,
        url: session.url,
        amount_total: session.amount_total,
        currency: session.currency
      };
      testResults.tests[2].duration = Date.now() - testResults.tests[2].startTime;
      console.log('✅ Checkout Session test successful:', session.id);

    } catch (error) {
      testResults.tests[2].status = 'failed';
      testResults.tests[2].error = error instanceof Error ? error.message : String(error);
      testResults.tests[2].duration = Date.now() - testResults.tests[2].startTime;
      console.log('❌ Checkout Session test failed:', error);
    }

    // Teste 4: Verificar instância Stripe direta
    console.log('⚙️ Testing direct Stripe instance...');
    testResults.tests.push({
      name: 'Direct Stripe Instance',
      status: 'running',
      startTime: Date.now()
    });

    try {
      const stripe = await robustStripe.getStripeInstance();

      // Teste leve - apenas verificar se a instância foi criada
      const hasValidInstance = stripe && typeof stripe.paymentIntents === 'object';

      testResults.tests[3].status = hasValidInstance ? 'passed' : 'failed';
      testResults.tests[3].result = {
        instanceCreated: hasValidInstance,
        hasPaymentIntentsAPI: typeof stripe.paymentIntents === 'object',
        hasCheckoutAPI: typeof stripe.checkout === 'object'
      };
      testResults.tests[3].duration = Date.now() - testResults.tests[3].startTime;

    } catch (error) {
      testResults.tests[3].status = 'failed';
      testResults.tests[3].error = error instanceof Error ? error.message : String(error);
      testResults.tests[3].duration = Date.now() - testResults.tests[3].startTime;
    }

    // Calcular estatísticas finais
    const passedTests = testResults.tests.filter(t => t.status === 'passed').length;
    const totalTests = testResults.tests.length;
    const averageDuration = testResults.tests.reduce((acc, t) => acc + (t.duration || 0), 0) / totalTests;

    const finalResult = {
      ...testResults,
      summary: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        successRate: Math.round((passedTests / totalTests) * 100),
        averageDuration: Math.round(averageDuration),
        isSystemHealthy: passedTests >= 2, // Pelo menos 2 de 4 testes devem passar
      }
    };

    // Log do resultado final
    console.log('📊 Robust payment system test completed:', {
      successRate: finalResult.summary.successRate + '%',
      healthStatus: finalResult.summary.isSystemHealthy ? 'HEALTHY' : 'UNHEALTHY'
    });

    return NextResponse.json(finalResult, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    // Erro crítico no sistema de teste
    console.error('❌ Critical error in robust payment test:', error);

    return NextResponse.json(
      {
        error: 'Test system failure',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        tests: testResults.tests
      },
      { status: 500 }
    );
  }
}