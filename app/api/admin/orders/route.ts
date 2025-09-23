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

    const response = await fetch(url, requestInit);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
}

// In-memory storage for development (replace with database if needed)
let orders: any[] = [];

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching real Stripe payment intents...');

    // Fetch real Stripe Payment Intents (últimos 100)
    const stripeData = await stripeEdgeRequest('payment_intents?limit=100');

    // Convert Stripe Payment Intents to order format
    const realOrders = stripeData.data
      .filter((pi: any) => pi.status === 'succeeded') // Only successful payments
      .map((pi: any) => ({
        orderId: pi.id,
        paymentIntentId: pi.id,
        customerName: pi.metadata?.customerName || 'Cliente',
        customerEmail: pi.metadata?.customerEmail || 'email não informado',
        total: pi.amount / 100, // Convert from cents
        currency: pi.currency.toUpperCase(),
        itemsCount: parseInt(pi.metadata?.itemsCount || '1'),
        status: pi.status === 'succeeded' ? 'paid' : pi.status,
        paymentMethod: pi.charges?.data?.[0]?.payment_method_details?.type || 'Cartão de Crédito',
        shippingType: pi.metadata?.shippingType || '📦 Frete Standard',
        estimatedDelivery: pi.metadata?.estimatedDelivery || '2-3 dias úteis',
        createdAt: new Date(pi.created * 1000).toISOString(),
        receiptUrl: pi.charges?.data?.[0]?.receipt_url,
        metadata: pi.metadata || {}
      }));

    // Combine with any local orders
    const allOrders = [...realOrders, ...orders];

    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = allOrders.filter(order => order.status !== 'paid').length;

    console.log(`✅ Fetched ${realOrders.length} real orders from Stripe`);

    return NextResponse.json({
      success: true,
      orders: allOrders.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      total: allOrders.length,
      revenue: totalRevenue,
      pendingOrders,
      stripeOrders: realOrders.length
    });

  } catch (error) {
    console.error('❌ Error fetching real orders:', error);

    // Fallback to empty data if Stripe fails
    return NextResponse.json({
      success: true,
      orders: orders,
      total: orders.length,
      revenue: orders.reduce((sum, order) => sum + order.total, 0),
      error: 'Failed to fetch Stripe data - showing local orders only',
      stripeOrders: 0
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Add timestamp if not present
    if (!orderData.createdAt) {
      orderData.createdAt = new Date().toISOString();
    }

    // Add to in-memory storage
    orders.push(orderData);

    console.log('📋 New order added to dashboard:', orderData.orderId);

    return NextResponse.json({
      success: true,
      order: orderData
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// Function to add order from webhook (can be called internally)
export function addOrderFromWebhook(orderData: any) {
  orders.push(orderData);
  console.log('📋 Order added from webhook:', orderData.orderId);
}