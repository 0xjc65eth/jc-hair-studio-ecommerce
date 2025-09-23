import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * Diagnóstico completo do problema de conectividade Stripe
 * Testa todas as possíveis causas do erro
 */

export async function GET(request: NextRequest) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL ? 'true' : 'false',
    region: process.env.VERCEL_REGION || 'unknown',
    checks: [] as any[]
  };

  // Check 1: Variáveis de ambiente
  diagnostics.checks.push({
    name: 'Environment Variables',
    status: 'checking',
    details: {}
  });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const hasKey = !!stripeKey;
  const keyPrefix = stripeKey ? stripeKey.substring(0, 7) : 'none';
  const isLiveKey = stripeKey?.startsWith('sk_live_');
  const isTestKey = stripeKey?.startsWith('sk_test_');

  diagnostics.checks[0].status = hasKey ? 'found' : 'missing';
  diagnostics.checks[0].details = {
    hasKey,
    keyPrefix,
    isLiveKey,
    isTestKey,
    keyLength: stripeKey?.length || 0
  };

  // Check 2: Verificar formato da chave
  diagnostics.checks.push({
    name: 'Key Format Validation',
    status: 'checking',
    details: {}
  });

  const validKeyFormat = stripeKey && (stripeKey.startsWith('sk_live_') || stripeKey.startsWith('sk_test_')) && stripeKey.length > 20;
  diagnostics.checks[1].status = validKeyFormat ? 'valid' : 'invalid';
  diagnostics.checks[1].details = {
    validFormat: validKeyFormat,
    startsCorrectly: stripeKey?.startsWith('sk_'),
    hasProperLength: stripeKey && stripeKey.length > 20
  };

  // Check 3: Testar conectividade básica
  diagnostics.checks.push({
    name: 'Basic Connectivity Test',
    status: 'testing',
    details: {},
    startTime: Date.now()
  });

  if (stripeKey && validKeyFormat) {
    try {
      // Teste 1: Criar instância mais simples possível
      const stripe = new Stripe(stripeKey, {
        apiVersion: '2023-10-16' as Stripe.LatestApiVersion
      });

      // Teste 2: Operação mais leve possível
      const account = await stripe.accounts.retrieve();

      diagnostics.checks[2].status = 'connected';
      diagnostics.checks[2].details = {
        accountId: account.id,
        accountType: account.type,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled
      };
      diagnostics.checks[2].duration = Date.now() - diagnostics.checks[2].startTime;
    } catch (error: any) {
      diagnostics.checks[2].status = 'failed';
      diagnostics.checks[2].error = error?.message || 'Unknown error';
      diagnostics.checks[2].errorType = error?.type || 'unknown';
      diagnostics.checks[2].errorCode = error?.code || 'unknown';
      diagnostics.checks[2].duration = Date.now() - diagnostics.checks[2].startTime;

      // Análise detalhada do erro
      if (error?.message?.includes('connection')) {
        diagnostics.checks[2].analysis = 'Network connectivity issue detected';
      } else if (error?.message?.includes('Invalid API Key')) {
        diagnostics.checks[2].analysis = 'API key is invalid or revoked';
      } else if (error?.message?.includes('authentication')) {
        diagnostics.checks[2].analysis = 'Authentication failure - check key permissions';
      }
    }
  } else {
    diagnostics.checks[2].status = 'skipped';
    diagnostics.checks[2].reason = 'Invalid or missing API key';
  }

  // Check 4: Teste de DNS/Network
  diagnostics.checks.push({
    name: 'DNS and Network Check',
    status: 'testing',
    details: {},
    startTime: Date.now()
  });

  try {
    // Teste de DNS usando fetch direto
    const dnsResponse = await fetch('https://api.stripe.com', {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });

    diagnostics.checks[3].status = 'reachable';
    diagnostics.checks[3].details = {
      statusCode: dnsResponse.status,
      statusText: dnsResponse.statusText,
      headers: {
        server: dnsResponse.headers.get('server'),
        'cf-ray': dnsResponse.headers.get('cf-ray'),
        'stripe-version': dnsResponse.headers.get('stripe-version')
      }
    };
    diagnostics.checks[3].duration = Date.now() - diagnostics.checks[3].startTime;
  } catch (error: any) {
    diagnostics.checks[3].status = 'unreachable';
    diagnostics.checks[3].error = error?.message || 'Network error';
    diagnostics.checks[3].duration = Date.now() - diagnostics.checks[3].startTime;
  }

  // Check 5: Vercel-specific checks
  diagnostics.checks.push({
    name: 'Vercel Environment',
    status: 'analyzing',
    details: {
      isVercel: !!process.env.VERCEL,
      region: process.env.VERCEL_REGION || 'none',
      env: process.env.VERCEL_ENV || 'none',
      functionRegion: process.env.AWS_REGION || 'none',
      functionMemory: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE || 'none',
      nodeVersion: process.version
    }
  });

  // Check 6: Test with different Stripe configurations
  if (stripeKey && validKeyFormat) {
    diagnostics.checks.push({
      name: 'Alternative Configurations Test',
      status: 'testing',
      configs: [],
      startTime: Date.now()
    });

    const configs = [
      { name: 'default', config: { apiVersion: '2023-10-16' as Stripe.LatestApiVersion } },
      { name: 'with-timeout', config: { apiVersion: '2023-10-16' as Stripe.LatestApiVersion, timeout: 20000 } },
      { name: 'no-retries', config: { apiVersion: '2023-10-16' as Stripe.LatestApiVersion, maxNetworkRetries: 0 } }
    ];

    for (const { name, config } of configs) {
      try {
        const stripe = new Stripe(stripeKey, config);
        await stripe.accounts.retrieve();
        diagnostics.checks[5].configs.push({ name, status: 'success' });
      } catch (error: any) {
        diagnostics.checks[5].configs.push({
          name,
          status: 'failed',
          error: error?.message?.substring(0, 100)
        });
      }
    }
    diagnostics.checks[5].duration = Date.now() - diagnostics.checks[5].startTime;
  }

  // Summary and recommendations
  const summary = {
    totalChecks: diagnostics.checks.length,
    passed: diagnostics.checks.filter(c => c.status === 'connected' || c.status === 'valid' || c.status === 'found' || c.status === 'reachable').length,
    failed: diagnostics.checks.filter(c => c.status === 'failed' || c.status === 'invalid' || c.status === 'missing' || c.status === 'unreachable').length,
    recommendations: [] as string[]
  };

  // Generate recommendations based on findings
  if (!hasKey) {
    summary.recommendations.push('STRIPE_SECRET_KEY environment variable is missing');
  }
  if (hasKey && !validKeyFormat) {
    summary.recommendations.push('STRIPE_SECRET_KEY has invalid format');
  }
  if (isTestKey && process.env.NODE_ENV === 'production') {
    summary.recommendations.push('Using TEST key in PRODUCTION environment');
  }
  if (diagnostics.checks[2]?.status === 'failed' && diagnostics.checks[2]?.error?.includes('connection')) {
    summary.recommendations.push('Network connectivity issue detected between Vercel and Stripe');
    summary.recommendations.push('Consider contacting Vercel support with error details');
  }
  if (diagnostics.checks[3]?.status === 'unreachable') {
    summary.recommendations.push('Cannot reach api.stripe.com from Vercel Function');
    summary.recommendations.push('Possible network/firewall issue in Vercel environment');
  }

  return NextResponse.json({
    ...diagnostics,
    summary
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json'
    }
  });
}