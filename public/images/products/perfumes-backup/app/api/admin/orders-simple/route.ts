import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for orders (for production without MongoDB)
const orders: any[] = [];

export async function GET(request: NextRequest) {
  try {
    // Return stored orders
    return NextResponse.json({
      success: true,
      orders: orders.slice(-50), // Return last 50 orders
      total: orders.length,
      message: 'Orders retrieved from memory storage'
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Create order with ID and timestamp
    const newOrder = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: orderData.status || 'pending'
    };

    // Store in memory
    orders.push(newOrder);

    // Keep only last 100 orders in memory
    if (orders.length > 100) {
      orders.splice(0, orders.length - 100);
    }

    console.log('✅ Order stored in memory:', newOrder.id);

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}