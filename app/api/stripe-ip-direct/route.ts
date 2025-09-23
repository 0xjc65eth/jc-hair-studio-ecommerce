import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

function getStripeSecretKey() {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is required');
    }
    return STRIPE_SECRET_KEY;
}

const STRIPE_IPS = [
    '54.187.174.169',
    '54.187.205.235',
    '54.200.102.204',
    '54.244.53.127'
];

async function makeDirectHttpsRequest(endpoint: string, method = 'GET', data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const postData = data ? data : undefined;

        let lastError: any;
        let attemptCount = 0;

        const tryNextIP = () => {
            if (attemptCount >= STRIPE_IPS.length) {
                reject(lastError || new Error('Todos os IPs falharam'));
                return;
            }

            const ip = STRIPE_IPS[attemptCount];
            attemptCount++;

            const options = {
                hostname: ip,
                port: 443,
                path: `/v1/${endpoint}`,
                method,
                headers: {
                    'Authorization': `Bearer ${getStripeSecretKey()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Host': 'api.stripe.com',
                    'User-Agent': 'Stripe/v1 NodeBindings/14.25.0',
                    'Accept': 'application/json',
                    ...(postData && { 'Content-Length': Buffer.byteLength(postData) })
                },
                timeout: 30000,
                rejectUnauthorized: true,
                secureProtocol: 'TLSv1_2_method'
            };

            console.log(`🔍 DNS BYPASS: Tentando IP ${ip} (tentativa ${attemptCount})`);

            const req = https.request(options, (res) => {
                let body = '';

                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    try {
                        const response = JSON.parse(body);
                        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                            console.log(`✅ DNS BYPASS: Sucesso com IP ${ip}`);
                            resolve(response);
                        } else {
                            console.log(`❌ DNS BYPASS: HTTP ${res.statusCode} com IP ${ip}`);
                            lastError = new Error(`HTTP ${res.statusCode}: ${body}`);
                            tryNextIP();
                        }
                    } catch (parseError) {
                        console.log(`❌ DNS BYPASS: Parse error com IP ${ip}`, parseError);
                        lastError = parseError;
                        tryNextIP();
                    }
                });
            });

            req.on('error', (error) => {
                console.log(`❌ DNS BYPASS: Conexão falhou com IP ${ip}`, error.message);
                lastError = error;
                tryNextIP();
            });

            req.on('timeout', () => {
                console.log(`❌ DNS BYPASS: Timeout com IP ${ip}`);
                req.destroy();
                lastError = new Error(`Timeout com IP ${ip}`);
                tryNextIP();
            });

            if (postData) {
                req.write(postData);
            }

            req.end();
        };

        tryNextIP();
    });
}

export async function GET(request: NextRequest) {
    const startTime = Date.now();

    try {
        console.log('🚀 DNS BYPASS: Iniciando conexão direta via IP');

        const testResult = await makeDirectHttpsRequest('customers?limit=1');

        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log('✅ DNS BYPASS: Sucesso!', { duration });

        return NextResponse.json({
            success: true,
            method: 'DNS_BYPASS',
            message: 'Conexão direta via IP funcionou',
            duration,
            customers_found: testResult.data?.length || 0,
            ips_tested: STRIPE_IPS.length
        });

    } catch (error: any) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.error('❌ DNS BYPASS: Todos os IPs falharam', {
            error: error.message,
            duration
        });

        return NextResponse.json({
            success: false,
            method: 'DNS_BYPASS',
            error: error.message,
            duration,
            ips_tested: STRIPE_IPS.length,
            diagnosis: 'DNS resolution ou firewall bloqueando IPs do Stripe'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        const { amount = 100 } = await request.json();

        console.log('🚀 DNS BYPASS: Criando Payment Intent via IP direto');

        const paymentData = new URLSearchParams({
            amount: amount.toString(),
            currency: 'brl',
            'payment_method_types[]': 'card'
        }).toString();

        const paymentIntent = await makeDirectHttpsRequest('payment_intents', 'POST', paymentData);

        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log('✅ DNS BYPASS: Payment Intent criado!', {
            id: paymentIntent.id,
            duration
        });

        return NextResponse.json({
            success: true,
            method: 'DNS_BYPASS',
            payment_intent_id: paymentIntent.id,
            client_secret: paymentIntent.client_secret,
            amount: paymentIntent.amount,
            duration,
            message: 'Payment Intent criado via IP direto'
        });

    } catch (error: any) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.error('❌ DNS BYPASS: Payment Intent falhou', {
            error: error.message,
            duration
        });

        return NextResponse.json({
            success: false,
            method: 'DNS_BYPASS',
            error: error.message,
            duration,
            diagnosis: 'Falha na criação de Payment Intent via IP direto'
        }, { status: 500 });
    }
}