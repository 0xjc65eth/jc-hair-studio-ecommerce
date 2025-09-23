import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for development (replace with database)
let orders: any[] = [];

export async function GET(request: NextRequest) {
  try {
    // For now, return mock data with any existing orders
    const mockOrders = [
      {
        orderId: 'pi_demo_12345',
        paymentIntentId: 'pi_demo_12345',
        customerName: 'Demo Cliente',
        customerEmail: 'demo@exemplo.com',
        total: 45.99,
        currency: 'EUR',
        itemsCount: 2,
        status: 'paid',
        paymentMethod: 'Cartão de Crédito',
        shippingType: '📦 Frete Standard (€4.99)',
        estimatedDelivery: '2-3 dias úteis (Standard)',
        createdAt: new Date().toISOString(),
        metadata: {
          customerName: 'Demo Cliente',
          customerEmail: 'demo@exemplo.com',
          itemsCount: '2'
        }
      }
    ];

    // Combine mock data with real orders
    const allOrders = [...mockOrders, ...orders];

    return NextResponse.json({
      success: true,
      orders: allOrders.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      total: allOrders.length,
      revenue: allOrders.reduce((sum, order) => sum + order.total, 0)
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
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