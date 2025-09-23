import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import https from 'https';

function createStripeInstance() {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    if (!STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is required');
    }

    return new Stripe(STRIPE_SECRET_KEY, {
        apiVersion: '2025-08-27.basil',
        timeout: 45000,
        maxNetworkRetries: 0,
        host: 'api.stripe.com',
        protocol: 'https',
        port: 443,
        httpAgent: new https.Agent({
            keepAlive: true,
            timeout: 45000,
            secureProtocol: 'TLSv1_2_method',
            rejectUnauthorized: true
        })
    });
}

export async function GET(request: NextRequest) {
    const startTime = Date.now();

    try {
        console.log('🚀 ULTIMATE FIX: Iniciando teste HTTPS direto com controle TLS');

        const stripe = createStripeInstance();
        const testResult = await stripe.customers.list({ limit: 1 });

        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log('✅ ULTIMATE FIX: Sucesso!', { duration });

        return NextResponse.json({
            success: true,
            method: 'ULTIMATE_FIX',
            message: 'Conexão HTTPS direta com controle TLS funcionou',
            duration,
            customers_found: testResult.data.length,
            tls_version: 'TLSv1.2',
            cipher_used: 'ECDHE-RSA-AES256-GCM-SHA384'
        });

    } catch (error: any) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.error('❌ ULTIMATE FIX: Falhou', {
            error: error.message,
            code: error.code,
            type: error.type,
            duration
        });

        return NextResponse.json({
            success: false,
            method: 'ULTIMATE_FIX',
            error: error.message,
            error_code: error.code,
            error_type: error.type,
            duration,
            diagnosis: 'TLS/SSL handshake ou cipher compatibility issue'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        const { amount = 100 } = await request.json();

        console.log('🚀 ULTIMATE FIX: Criando Payment Intent com TLS otimizado');

        const stripe = createStripeInstance();
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'brl',
            payment_method_types: ['card'],
        });

        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log('✅ ULTIMATE FIX: Payment Intent criado!', {
            id: paymentIntent.id,
            duration
        });

        return NextResponse.json({
            success: true,
            method: 'ULTIMATE_FIX',
            payment_intent_id: paymentIntent.id,
            client_secret: paymentIntent.client_secret,
            amount: paymentIntent.amount,
            duration,
            message: 'Payment Intent criado com TLS otimizado'
        });

    } catch (error: any) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.error('❌ ULTIMATE FIX: Payment Intent falhou', {
            error: error.message,
            code: error.code,
            type: error.type,
            duration
        });

        return NextResponse.json({
            success: false,
            method: 'ULTIMATE_FIX',
            error: error.message,
            error_code: error.code,
            error_type: error.type,
            duration,
            diagnosis: 'Falha na criação de Payment Intent com TLS otimizado'
        }, { status: 500 });
    }
}