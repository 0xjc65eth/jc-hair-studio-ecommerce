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

    console.log(`🚀 EDGE BYPASS: Fazendo request ${method} para ${endpoint}`);

    const response = await fetch(url, requestInit);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
}

export async function GET(request: NextRequest) {
    const startTime = Date.now();

    try {
        console.log('🚀 EDGE BYPASS: Iniciando teste Edge Runtime');

        const testResult = await stripeEdgeRequest('customers?limit=1');

        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log('✅ EDGE BYPASS: Sucesso!', { duration });

        return NextResponse.json({
            success: true,
            method: 'EDGE_BYPASS',
            runtime: 'edge',
            message: 'Conexão via Edge Runtime funcionou',
            duration,
            customers_found: testResult.data?.length || 0,
            edge_location: 'unknown'
        });

    } catch (error: any) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.error('❌ EDGE BYPASS: Falhou', {
            error: error.message,
            duration
        });

        return NextResponse.json({
            success: false,
            method: 'EDGE_BYPASS',
            runtime: 'edge',
            error: error.message,
            duration,
            edge_location: 'unknown',
            diagnosis: 'Edge Runtime network stack issue'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        const { amount = 100 } = await request.json();

        console.log('🚀 EDGE BYPASS: Criando Payment Intent via Edge Runtime');

        const paymentIntent = await stripeEdgeRequest('payment_intents', 'POST', {
            amount: amount.toString(),
            currency: 'brl',
            'payment_method_types[]': 'card'
        });

        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log('✅ EDGE BYPASS: Payment Intent criado!', {
            id: paymentIntent.id,
            duration
        });

        return NextResponse.json({
            success: true,
            method: 'EDGE_BYPASS',
            runtime: 'edge',
            payment_intent_id: paymentIntent.id,
            client_secret: paymentIntent.client_secret,
            amount: paymentIntent.amount,
            duration,
            edge_location: 'unknown',
            message: 'Payment Intent criado via Edge Runtime'
        });

    } catch (error: any) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.error('❌ EDGE BYPASS: Payment Intent falhou', {
            error: error.message,
            duration
        });

        return NextResponse.json({
            success: false,
            method: 'EDGE_BYPASS',
            runtime: 'edge',
            error: error.message,
            duration,
            edge_location: 'unknown',
            diagnosis: 'Falha na criação de Payment Intent via Edge Runtime'
        }, { status: 500 });
    }
}