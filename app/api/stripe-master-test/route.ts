import { NextRequest, NextResponse } from 'next/server';

interface TestResult {
    method: string;
    success: boolean;
    duration: number;
    error?: string;
    details?: any;
}

async function testEndpoint(url: string, method = 'GET', body?: any): Promise<TestResult> {
    const startTime = Date.now();

    try {
        const response = await fetch(url, {
            method,
            headers: method === 'POST' ? { 'Content-Type': 'application/json' } : {},
            body: body ? JSON.stringify(body) : undefined,
            signal: AbortSignal.timeout(60000) // 60 second timeout
        });

        const result = await response.json();
        const duration = Date.now() - startTime;

        return {
            method: result.method || 'UNKNOWN',
            success: response.ok && result.success,
            duration,
            details: result
        };

    } catch (error: any) {
        const duration = Date.now() - startTime;

        return {
            method: 'UNKNOWN',
            success: false,
            duration,
            error: error.message
        };
    }
}

export async function GET(request: NextRequest) {
    const masterStartTime = Date.now();
    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    console.log('🧪 MASTER TEST: Iniciando bateria completa de testes');

    const tests = [
        {
            name: 'Original API',
            url: `${baseUrl}/api/test-stripe`,
            description: 'API original que está falhando'
        },
        {
            name: 'Ultimate Fix',
            url: `${baseUrl}/api/stripe-ultimate-fix`,
            description: 'HTTPS direto com controle TLS'
        },
        {
            name: 'DNS Bypass',
            url: `${baseUrl}/api/stripe-ip-direct`,
            description: 'Conexão direta via IP'
        },
        {
            name: 'Edge Runtime',
            url: `${baseUrl}/api/stripe-edge-bypass`,
            description: 'Edge Runtime networking'
        }
    ];

    const results: { [key: string]: TestResult } = {};

    // Teste sequencial para evitar rate limits
    for (const test of tests) {
        console.log(`🔍 MASTER TEST: Testando ${test.name}...`);

        try {
            results[test.name] = await testEndpoint(test.url);
            console.log(`${results[test.name].success ? '✅' : '❌'} ${test.name}: ${results[test.name].success ? 'SUCESSO' : 'FALHOU'}`);
        } catch (error: any) {
            console.log(`❌ ${test.name}: ERRO - ${error.message}`);
            results[test.name] = {
                method: 'ERROR',
                success: false,
                duration: 0,
                error: error.message
            };
        }

        // Pequena pausa entre testes
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const masterDuration = Date.now() - masterStartTime;
    const successfulTests = Object.values(results).filter(r => r.success);
    const failedTests = Object.values(results).filter(r => !r.success);

    console.log(`🎯 MASTER TEST: Concluído! ${successfulTests.length}/${tests.length} sucessos`);

    // Análise de resultados
    let diagnosis = '';
    let recommendation = '';

    if (successfulTests.length === 0) {
        diagnosis = 'CRITICAL: Todas as estratégias falharam - problema fundamental de conectividade';
        recommendation = 'Verificar firewall do Vercel ou contatar suporte da Vercel';
    } else if (successfulTests.length === tests.length) {
        diagnosis = 'SUCCESS: Todas as estratégias funcionaram - problema resolvido';
        recommendation = 'Usar qualquer uma das APIs para produção';
    } else {
        const workingMethods = successfulTests.map(t => t.method).join(', ');
        diagnosis = `PARTIAL: ${successfulTests.length} de ${tests.length} funcionaram (${workingMethods})`;
        recommendation = `Usar as APIs que funcionaram: ${workingMethods}`;
    }

    // Payment Intent test na melhor API
    let paymentTestResult = null;
    if (successfulTests.length > 0) {
        console.log('💳 MASTER TEST: Testando criação de Payment Intent...');

        // Usar a API mais rápida que funcionou
        const fastestSuccess = successfulTests.reduce((prev, current) =>
            prev.duration < current.duration ? prev : current
        );

        const fastestTestName = Object.keys(results).find(key =>
            results[key] === fastestSuccess
        );

        if (fastestTestName) {
            const paymentTest = tests.find(t => t.name === fastestTestName);
            if (paymentTest) {
                try {
                    paymentTestResult = await testEndpoint(paymentTest.url, 'POST', { amount: 100 });
                    console.log(`${paymentTestResult.success ? '✅' : '❌'} Payment Intent: ${paymentTestResult.success ? 'SUCESSO' : 'FALHOU'}`);
                } catch (error: any) {
                    console.log(`❌ Payment Intent: ERRO - ${error.message}`);
                    paymentTestResult = {
                        method: 'PAYMENT_TEST',
                        success: false,
                        duration: 0,
                        error: error.message
                    };
                }
            }
        }
    }

    return NextResponse.json({
        success: successfulTests.length > 0,
        master_test: true,
        total_duration: masterDuration,
        tests_run: tests.length,
        successful_tests: successfulTests.length,
        failed_tests: failedTests.length,

        diagnosis,
        recommendation,

        detailed_results: Object.keys(results).map(testName => ({
            test_name: testName,
            description: tests.find(t => t.name === testName)?.description,
            ...results[testName]
        })),

        payment_test: paymentTestResult,

        summary: {
            original_api: results['Original API']?.success ? 'WORKING' : 'FAILED',
            ultimate_fix: results['Ultimate Fix']?.success ? 'WORKING' : 'FAILED',
            dns_bypass: results['DNS Bypass']?.success ? 'WORKING' : 'FAILED',
            edge_runtime: results['Edge Runtime']?.success ? 'WORKING' : 'FAILED'
        },

        next_steps: successfulTests.length > 0
            ? 'Use as APIs que funcionaram para implementação em produção'
            : 'Problema crítico de infraestrutura - contatar suporte Vercel',

        timestamp: new Date().toISOString()
    });
}

export async function POST(request: NextRequest) {
    // Teste específico de Payment Intent em todas as APIs
    const { amount = 100 } = await request.json();
    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    console.log('💳 MASTER TEST: Testando Payment Intent em todas as APIs');

    const paymentTests = [
        { name: 'Ultimate Fix', url: `${baseUrl}/api/stripe-ultimate-fix` },
        { name: 'DNS Bypass', url: `${baseUrl}/api/stripe-ip-direct` },
        { name: 'Edge Runtime', url: `${baseUrl}/api/stripe-edge-bypass` }
    ];

    const paymentResults: { [key: string]: TestResult } = {};

    for (const test of paymentTests) {
        console.log(`💳 Testando Payment Intent: ${test.name}...`);

        try {
            paymentResults[test.name] = await testEndpoint(test.url, 'POST', { amount });
            console.log(`${paymentResults[test.name].success ? '✅' : '❌'} ${test.name}: ${paymentResults[test.name].success ? 'SUCESSO' : 'FALHOU'}`);
        } catch (error: any) {
            paymentResults[test.name] = {
                method: 'PAYMENT_ERROR',
                success: false,
                duration: 0,
                error: error.message
            };
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const successfulPayments = Object.values(paymentResults).filter(r => r.success);

    return NextResponse.json({
        success: successfulPayments.length > 0,
        payment_test: true,
        amount,
        successful_payments: successfulPayments.length,
        failed_payments: Object.values(paymentResults).length - successfulPayments.length,

        results: Object.keys(paymentResults).map(testName => ({
            api: testName,
            ...paymentResults[testName]
        })),

        best_payment_api: successfulPayments.length > 0
            ? Object.keys(paymentResults).find(key => paymentResults[key] ===
                successfulPayments.reduce((prev, current) =>
                    prev.duration < current.duration ? prev : current
                )
              )
            : null,

        recommendation: successfulPayments.length > 0
            ? 'Payment processing funcionando - usar API mais rápida'
            : 'Payment processing falhou em todas as APIs',

        timestamp: new Date().toISOString()
    });
}