import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { Order } from '@/lib/mongodb/schemas/order.schema';
import { Types } from 'mongoose';

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

// Database connection and logging utility
async function logOperation(operation: string, details: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ADMIN ORDERS ${operation}:`, JSON.stringify(details, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    await logOperation('GET_STARTED', { timestamp: new Date().toISOString() });

    // Parse query parameters for filtering and sorting
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const customerSearch = searchParams.get('customer');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    await logOperation('QUERY_PARAMS', { status, sortBy, sortOrder, limit, page, customerSearch, dateFrom, dateTo });

    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB for order retrieval');

    // Build filter query
    const filter: any = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (customerSearch) {
      filter.$or = [
        { 'customerInfo.firstName': { $regex: customerSearch, $options: 'i' } },
        { 'customerInfo.lastName': { $regex: customerSearch, $options: 'i' } },
        { 'customerInfo.email': { $regex: customerSearch, $options: 'i' } },
        { orderNumber: { $regex: customerSearch, $options: 'i' } }
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    await logOperation('FILTER_BUILT', filter);

    // Build sort query
    const sortQuery: any = {};
    sortQuery[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute database query with pagination
    const skip = (page - 1) * limit;
    const [dbOrders, totalCount] = await Promise.all([
      Order.find(filter)
        .sort(sortQuery)
        .limit(limit)
        .skip(skip)
        .lean(),
      Order.countDocuments(filter)
    ]);

    await logOperation('DB_QUERY_RESULT', {
      foundOrders: dbOrders.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit)
    });

    // Transform database orders to admin panel format
    const transformedOrders = dbOrders.map((order: any) => ({
      _id: order._id.toString(),
      orderId: order.orderNumber,
      orderNumber: order.orderNumber,
      name: `${order.customerInfo?.firstName || ''} ${order.customerInfo?.lastName || ''}`.trim() || 'Cliente',
      email: order.customerInfo?.email || 'email não informado',
      phone: order.customerInfo?.phone || '',
      totalAmount: order.total,
      currency: order.currency || 'EUR',
      status: order.status,
      paymentStatus: order.paymentStatus,
      itemsCount: order.items?.length || 0,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,

      // Address information
      address: order.shippingAddress?.street || 'Endereço não informado',
      city: order.shippingAddress?.city || 'Cidade',
      state: order.shippingAddress?.state || 'Estado',
      postalCode: order.shippingAddress?.zipCode || order.shippingAddress?.postalCode || 'CEP',
      country: order.shippingAddress?.country || 'Portugal',

      // Product details
      products: order.items?.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        sku: item.sku,
        imageUrl: item.image,
        size: item.variant?.value || null,
        brand: item.brand || null
      })) || [],

      // Shipping information
      shippingMethod: order.shipping?.method || 'Standard',
      shippingCost: order.shippingCost || 0,
      trackingNumber: order.shipping?.trackingCode || null,
      carrier: order.shipping?.carrier || null,
      estimatedDelivery: order.shipping?.estimatedDelivery || null,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,

      // Payment information
      paymentMethod: order.payments?.[0]?.method || 'credit_card',
      paymentIntentId: order.payments?.[0]?.transactionId || null,

      // Notes and metadata
      customerNotes: order.customerNotes,
      internalNotes: order.internalNotes,
      source: order.source || 'web'
    }));

    // Try to fetch recent Stripe payment intents as backup/supplement
    let stripeOrders: any[] = [];
    let stripeError = null;

    try {
      console.log('🔍 Fetching recent Stripe payment intents for verification...');
      const stripeData = await stripeEdgeRequest('payment_intents?limit=50');

      stripeOrders = stripeData.data
        .filter((pi: any) => pi.status === 'succeeded')
        .map((pi: any) => ({
          _id: `stripe_${pi.id}`,
          orderId: pi.id,
          paymentIntentId: pi.id,
          name: pi.metadata?.customerName || 'Cliente Stripe',
          email: pi.metadata?.customerEmail || 'email não informado',
          totalAmount: pi.amount / 100,
          currency: pi.currency.toUpperCase(),
          itemsCount: parseInt(pi.metadata?.itemsCount || '1'),
          status: 'paid',
          paymentStatus: 'completed',
          paymentMethod: pi.charges?.data?.[0]?.payment_method_details?.type || 'Cartão de Crédito',
          createdAt: new Date(pi.created * 1000).toISOString(),
          receiptUrl: pi.charges?.data?.[0]?.receipt_url,
          metadata: pi.metadata || {},
          source: 'stripe',
          // Default values for required fields
          address: 'Endereço via Stripe',
          city: 'Cidade',
          state: 'Estado',
          postalCode: 'CEP',
          country: 'Portugal',
          products: []
        }));

      console.log(`✅ Fetched ${stripeOrders.length} Stripe payment intents`);
    } catch (error) {
      console.warn('⚠️ Could not fetch Stripe data:', error);
      stripeError = error instanceof Error ? error.message : String(error);
    }

    // Combine database orders with Stripe orders (avoiding duplicates)
    const existingPaymentIntentIds = new Set(
      transformedOrders
        .map(order => order.paymentIntentId)
        .filter(Boolean)
    );

    const uniqueStripeOrders = stripeOrders.filter(
      order => !existingPaymentIntentIds.has(order.paymentIntentId)
    );

    const allOrders = [...transformedOrders, ...uniqueStripeOrders];

    // Sort combined results
    allOrders.sort((a, b) => {
      const aVal = sortBy === 'createdAt' ? new Date(a.createdAt).getTime() : a[sortBy as keyof typeof a];
      const bVal = sortBy === 'createdAt' ? new Date(b.createdAt).getTime() : b[sortBy as keyof typeof b];

      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });

    // Calculate statistics
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = allOrders.filter(order =>
      ['pending', 'confirmed', 'processing'].includes(order.status)
    ).length;

    const responseData = {
      success: true,
      orders: allOrders,
      total: allOrders.length,
      totalInDb: totalCount,
      revenue: totalRevenue,
      pendingOrders,
      stripeOrders: uniqueStripeOrders.length,
      dbOrders: transformedOrders.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: page * limit < totalCount
      },
      filters: {
        status,
        customerSearch,
        dateFrom,
        dateTo,
        sortBy,
        sortOrder
      },
      stripeError
    };

    await logOperation('GET_SUCCESS', {
      totalOrders: allOrders.length,
      dbOrders: transformedOrders.length,
      stripeOrders: uniqueStripeOrders.length,
      revenue: totalRevenue
    });

    return NextResponse.json(responseData);

  } catch (error) {
    await logOperation('GET_ERROR', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    console.error('❌ Error fetching orders:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch orders from database',
      details: error instanceof Error ? error.message : String(error),
      orders: [],
      total: 0,
      revenue: 0,
      pendingOrders: 0,
      stripeOrders: 0,
      dbOrders: 0
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    await logOperation('POST_STARTED', { hasOrderData: !!orderData });

    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB for order creation');

    // Validate and transform order data to match schema
    const transformedOrder = {
      // Generate order number if not provided
      orderNumber: orderData.orderNumber || `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,

      // Customer information
      userId: orderData.userId || 'guest',
      customerInfo: {
        firstName: orderData.customerName?.split(' ')[0] || orderData.name?.split(' ')[0] || 'Cliente',
        lastName: orderData.customerName?.split(' ').slice(1).join(' ') || orderData.name?.split(' ').slice(1).join(' ') || '',
        email: orderData.customerEmail || orderData.email || 'email@example.com',
        phone: orderData.phone || orderData.customerPhone || ''
      },

      // Order items
      items: orderData.items || orderData.products?.map((product: any) => ({
        productId: product.id || product.productId || new Types.ObjectId().toString(),
        name: product.name || 'Produto',
        sku: product.sku || `SKU${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        quantity: product.quantity || 1,
        unitPrice: product.unitPrice || product.price || 0,
        totalPrice: product.totalPrice || (product.price * product.quantity) || 0,
        image: product.imageUrl || product.image,
        variant: product.variant
      })) || [{
        productId: new Types.ObjectId().toString(),
        name: 'Produto Padrão',
        sku: `SKU${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        quantity: orderData.itemsCount || 1,
        unitPrice: orderData.totalAmount || orderData.total || 0,
        totalPrice: orderData.totalAmount || orderData.total || 0
      }],

      // Addresses
      shippingAddress: orderData.shippingAddress || {
        street: orderData.address || 'Endereço não informado',
        city: orderData.city || 'Cidade',
        state: orderData.state || 'Estado',
        zipCode: orderData.postalCode || orderData.zipCode || 'CEP',
        country: orderData.country || 'Portugal'
      },
      billingAddress: orderData.billingAddress || orderData.shippingAddress || {
        street: orderData.address || 'Endereço não informado',
        city: orderData.city || 'Cidade',
        state: orderData.state || 'Estado',
        zipCode: orderData.postalCode || orderData.zipCode || 'CEP',
        country: orderData.country || 'Portugal'
      },

      // Financial information
      subtotal: orderData.subtotal || orderData.totalAmount || orderData.total || 0,
      shippingCost: orderData.shippingCost || 0,
      taxAmount: orderData.taxAmount || 0,
      discountAmount: orderData.discountAmount || 0,
      total: orderData.total || orderData.totalAmount || 0,
      currency: orderData.currency || 'EUR',

      // Status
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || (orderData.status === 'paid' ? 'completed' : 'pending'),

      // Payment information
      payments: orderData.payments || (orderData.paymentIntentId ? [{
        method: 'credit_card',
        status: orderData.status === 'paid' ? 'completed' : 'pending',
        transactionId: orderData.paymentIntentId,
        amount: orderData.total || orderData.totalAmount || 0,
        currency: orderData.currency || 'EUR',
        processedAt: orderData.status === 'paid' ? new Date() : undefined
      }] : []),

      // Shipping information
      shipping: orderData.shipping || (orderData.shippingMethod ? {
        method: orderData.shippingMethod || 'standard',
        carrier: orderData.carrier || 'Correios',
        trackingCode: orderData.trackingNumber,
        cost: orderData.shippingCost || 0
      } : undefined),

      // Metadata
      source: orderData.source || 'admin',
      customerNotes: orderData.customerNotes,
      internalNotes: orderData.internalNotes || `Created via admin panel at ${new Date().toISOString()}`
    };

    await logOperation('ORDER_TRANSFORMED', {
      orderNumber: transformedOrder.orderNumber,
      customerEmail: transformedOrder.customerInfo.email,
      total: transformedOrder.total,
      itemsCount: transformedOrder.items.length
    });

    // Create the order in database
    const newOrder = new Order(transformedOrder);
    const savedOrder = await newOrder.save();

    await logOperation('ORDER_SAVED', {
      orderId: savedOrder._id.toString(),
      orderNumber: savedOrder.orderNumber,
      total: savedOrder.total
    });

    console.log('✅ New order created in database:', savedOrder.orderNumber);

    // Transform back to admin panel format for response
    const responseOrder = {
      _id: savedOrder._id.toString(),
      orderId: savedOrder.orderNumber,
      orderNumber: savedOrder.orderNumber,
      name: `${savedOrder.customerInfo.firstName} ${savedOrder.customerInfo.lastName}`.trim(),
      email: savedOrder.customerInfo.email,
      phone: savedOrder.customerInfo.phone,
      totalAmount: savedOrder.total,
      currency: savedOrder.currency,
      status: savedOrder.status,
      paymentStatus: savedOrder.paymentStatus,
      itemsCount: savedOrder.items.length,
      createdAt: savedOrder.createdAt,
      updatedAt: savedOrder.updatedAt,
      products: savedOrder.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        sku: item.sku,
        imageUrl: item.image
      }))
    };

    return NextResponse.json({
      success: true,
      order: responseOrder,
      message: 'Order created successfully in database'
    });

  } catch (error) {
    await logOperation('POST_ERROR', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    console.error('❌ Error creating order:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to create order in database',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Function to add order from webhook (can be called internally)
export async function addOrderFromWebhook(orderData: any) {
  try {
    await connectDB();

    // Check if order already exists
    const existingOrder = await Order.findOne({
      $or: [
        { orderNumber: orderData.orderId },
        { 'payments.transactionId': orderData.paymentIntentId }
      ]
    });

    if (existingOrder) {
      console.log('📋 Order already exists, updating:', orderData.orderId);

      // Update existing order
      if (orderData.status) existingOrder.status = orderData.status;
      if (orderData.paymentStatus) existingOrder.paymentStatus = orderData.paymentStatus;

      await existingOrder.save();
      return existingOrder;
    }

    // Create new order
    const order = new Order({
      orderNumber: orderData.orderId,
      userId: orderData.userId || 'webhook',
      customerInfo: {
        firstName: orderData.customerName?.split(' ')[0] || 'Cliente',
        lastName: orderData.customerName?.split(' ').slice(1).join(' ') || 'Webhook',
        email: orderData.customerEmail || 'webhook@example.com'
      },
      items: [{
        productId: new Types.ObjectId().toString(),
        name: 'Produto via Webhook',
        sku: `WEBHOOK${Date.now()}`,
        quantity: orderData.itemsCount || 1,
        unitPrice: orderData.total || 0,
        totalPrice: orderData.total || 0
      }],
      shippingAddress: {
        street: 'Endereço via Webhook',
        city: 'Cidade',
        state: 'Estado',
        zipCode: 'CEP',
        country: 'Portugal'
      },
      billingAddress: {
        street: 'Endereço via Webhook',
        city: 'Cidade',
        state: 'Estado',
        zipCode: 'CEP',
        country: 'Portugal'
      },
      subtotal: orderData.total || 0,
      total: orderData.total || 0,
      currency: orderData.currency || 'EUR',
      status: orderData.status || 'pending',
      paymentStatus: orderData.status === 'paid' ? 'completed' : 'pending',
      payments: orderData.paymentIntentId ? [{
        method: 'credit_card',
        status: orderData.status === 'paid' ? 'completed' : 'pending',
        transactionId: orderData.paymentIntentId,
        amount: orderData.total || 0,
        currency: orderData.currency || 'EUR'
      }] : [],
      source: 'webhook',
      internalNotes: `Created via webhook at ${new Date().toISOString()}`
    });

    const savedOrder = await order.save();
    await logOperation('WEBHOOK_ORDER_CREATED', {
      orderId: savedOrder._id.toString(),
      orderNumber: savedOrder.orderNumber
    });

    console.log('✅ Order added from webhook to database:', savedOrder.orderNumber);
    return savedOrder;

  } catch (error) {
    await logOperation('WEBHOOK_ERROR', {
      error: error instanceof Error ? error.message : String(error),
      orderData
    });
    console.error('❌ Error adding order from webhook:', error);
    throw error;
  }
}

// PUT method for updating order status
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    const updateData = await request.json();

    await logOperation('PUT_STARTED', { orderId, updateData });

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the order by ID or order number
    const order = await Order.findOne({
      $or: [
        { _id: Types.isValidObjectId(orderId) ? new Types.ObjectId(orderId) : null },
        { orderNumber: orderId }
      ]
    });

    if (!order) {
      await logOperation('PUT_ORDER_NOT_FOUND', { orderId });
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order fields
    if (updateData.status) {
      order.updateStatus(updateData.status, updateData.notes);
    }

    if (updateData.paymentStatus) {
      order.paymentStatus = updateData.paymentStatus;
    }

    if (updateData.trackingCode) {
      if (!order.shipping) {
        order.shipping = {
          method: 'standard',
          carrier: 'Correios',
          cost: order.shippingCost || 0
        };
      }
      order.shipping.trackingCode = updateData.trackingCode;
    }

    if (updateData.internalNotes) {
      order.internalNotes = (order.internalNotes || '') + `\n${new Date().toISOString()}: ${updateData.internalNotes}`;
    }

    const updatedOrder = await order.save();

    await logOperation('PUT_SUCCESS', {
      orderId: updatedOrder._id.toString(),
      orderNumber: updatedOrder.orderNumber,
      newStatus: updatedOrder.status
    });

    console.log('✅ Order updated successfully:', updatedOrder.orderNumber);

    return NextResponse.json({
      success: true,
      order: {
        _id: updatedOrder._id.toString(),
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
        trackingCode: updatedOrder.shipping?.trackingCode,
        updatedAt: updatedOrder.updatedAt
      },
      message: 'Order updated successfully'
    });

  } catch (error) {
    await logOperation('PUT_ERROR', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    console.error('❌ Error updating order:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to update order',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE method for canceling orders
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    await logOperation('DELETE_STARTED', { orderId });

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findOne({
      $or: [
        { _id: Types.isValidObjectId(orderId) ? new Types.ObjectId(orderId) : null },
        { orderNumber: orderId }
      ]
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order can be cancelled
    if (!order.canCancel) {
      return NextResponse.json(
        { success: false, error: 'Order cannot be cancelled in current status' },
        { status: 400 }
      );
    }

    order.updateStatus('cancelled', 'Cancelled via admin panel');
    const cancelledOrder = await order.save();

    await logOperation('DELETE_SUCCESS', {
      orderId: cancelledOrder._id.toString(),
      orderNumber: cancelledOrder.orderNumber
    });

    console.log('✅ Order cancelled successfully:', cancelledOrder.orderNumber);

    return NextResponse.json({
      success: true,
      order: {
        _id: cancelledOrder._id.toString(),
        orderNumber: cancelledOrder.orderNumber,
        status: cancelledOrder.status,
        cancelledAt: cancelledOrder.cancelledAt
      },
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    await logOperation('DELETE_ERROR', {
      error: error instanceof Error ? error.message : String(error)
    });

    console.error('❌ Error cancelling order:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to cancel order',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}