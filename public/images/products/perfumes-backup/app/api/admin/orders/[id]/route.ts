import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { Order } from '@/lib/mongodb/schemas/order.schema';
import { Types } from 'mongoose';

// Logging utility
async function logOperation(operation: string, details: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ADMIN ORDER [ID] ${operation}:`, JSON.stringify(details, null, 2));
}

// GET single order by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    await logOperation('GET_SINGLE_STARTED', { orderId });

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
    }).lean();

    if (!order) {
      await logOperation('GET_SINGLE_NOT_FOUND', { orderId });
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Transform to admin panel format
    const transformedOrder = {
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

      // Full address objects
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,

      // Product details
      products: order.items?.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        sku: item.sku,
        imageUrl: item.image,
        size: item.variant?.value || null,
        brand: item.brand || null,
        productId: item.productId,
        variant: item.variant
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
      payments: order.payments || [],

      // Notes and metadata
      customerNotes: order.customerNotes,
      internalNotes: order.internalNotes,
      source: order.source || 'web',

      // Financial breakdown
      subtotal: order.subtotal,
      taxAmount: order.taxAmount || 0,
      discountAmount: order.discountAmount || 0,
      discountCodes: order.discountCodes || [],

      // Status dates
      confirmedAt: order.confirmedAt,
      processedAt: order.processedAt,
      cancelledAt: order.cancelledAt,

      // Virtual properties
      canCancel: ['pending', 'confirmed'].includes(order.status),
      canRefund: order.status === 'delivered' && order.paymentStatus === 'completed',
      isCompleted: order.status === 'delivered'
    };

    await logOperation('GET_SINGLE_SUCCESS', {
      orderId: transformedOrder._id,
      orderNumber: transformedOrder.orderNumber
    });

    return NextResponse.json({
      success: true,
      order: transformedOrder
    });

  } catch (error) {
    await logOperation('GET_SINGLE_ERROR', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    console.error('❌ Error fetching single order:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch order',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// PUT update single order
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    const updateData = await request.json();

    await logOperation('PUT_SINGLE_STARTED', { orderId, updateData });

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
      await logOperation('PUT_SINGLE_NOT_FOUND', { orderId });
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    let updateSummary: string[] = [];

    // Update order status
    if (updateData.status && updateData.status !== order.status) {
      try {
        order.updateStatus(updateData.status, updateData.notes || `Status updated via admin panel`);
        updateSummary.push(`Status: ${order.status} → ${updateData.status}`);
      } catch (error) {
        return NextResponse.json(
          { success: false, error: `Cannot update status: ${error.message}` },
          { status: 400 }
        );
      }
    }

    // Update payment status
    if (updateData.paymentStatus && updateData.paymentStatus !== order.paymentStatus) {
      order.paymentStatus = updateData.paymentStatus;
      updateSummary.push(`Payment status: ${updateData.paymentStatus}`);
    }

    // Update tracking information
    if (updateData.trackingCode) {
      if (!order.shipping) {
        order.shipping = {
          method: 'standard',
          carrier: 'Correios',
          cost: order.shippingCost || 0
        };
      }
      order.shipping.trackingCode = updateData.trackingCode;
      updateSummary.push(`Tracking code: ${updateData.trackingCode}`);
    }

    // Update carrier
    if (updateData.carrier) {
      if (!order.shipping) {
        order.shipping = {
          method: 'standard',
          carrier: updateData.carrier,
          cost: order.shippingCost || 0
        };
      } else {
        order.shipping.carrier = updateData.carrier;
      }
      updateSummary.push(`Carrier: ${updateData.carrier}`);
    }

    // Update internal notes
    if (updateData.internalNotes) {
      const noteTimestamp = new Date().toISOString();
      const newNote = `${noteTimestamp}: ${updateData.internalNotes}`;
      order.internalNotes = order.internalNotes ? `${order.internalNotes}\n${newNote}` : newNote;
      updateSummary.push('Internal notes updated');
    }

    // Update customer notes
    if (updateData.customerNotes !== undefined) {
      order.customerNotes = updateData.customerNotes;
      updateSummary.push('Customer notes updated');
    }

    // Update estimated delivery
    if (updateData.estimatedDelivery) {
      if (!order.shipping) {
        order.shipping = {
          method: 'standard',
          carrier: 'Correios',
          cost: order.shippingCost || 0
        };
      }
      order.shipping.estimatedDelivery = new Date(updateData.estimatedDelivery);
      updateSummary.push(`Estimated delivery: ${updateData.estimatedDelivery}`);
    }

    // Add update summary to internal notes
    if (updateSummary.length > 0) {
      const summaryNote = `Admin update: ${updateSummary.join(', ')}`;
      const noteTimestamp = new Date().toISOString();
      const fullNote = `${noteTimestamp}: ${summaryNote}`;
      order.internalNotes = order.internalNotes ? `${order.internalNotes}\n${fullNote}` : fullNote;
    }

    const updatedOrder = await order.save();

    await logOperation('PUT_SINGLE_SUCCESS', {
      orderId: updatedOrder._id.toString(),
      orderNumber: updatedOrder.orderNumber,
      updates: updateSummary
    });

    console.log('✅ Order updated successfully:', updatedOrder.orderNumber, updateSummary);

    return NextResponse.json({
      success: true,
      order: {
        _id: updatedOrder._id.toString(),
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
        trackingCode: updatedOrder.shipping?.trackingCode,
        carrier: updatedOrder.shipping?.carrier,
        estimatedDelivery: updatedOrder.shipping?.estimatedDelivery,
        updatedAt: updatedOrder.updatedAt,
        internalNotes: updatedOrder.internalNotes
      },
      message: `Order updated successfully: ${updateSummary.join(', ')}`,
      updates: updateSummary
    });

  } catch (error) {
    await logOperation('PUT_SINGLE_ERROR', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    console.error('❌ Error updating single order:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to update order',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE (cancel) single order
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    await logOperation('DELETE_SINGLE_STARTED', { orderId });

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
      await logOperation('DELETE_SINGLE_NOT_FOUND', { orderId });
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order can be cancelled
    if (!order.canCancel) {
      return NextResponse.json(
        { success: false, error: `Order cannot be cancelled from status '${order.status}'` },
        { status: 400 }
      );
    }

    order.updateStatus('cancelled', 'Cancelled via admin panel');
    const cancelledOrder = await order.save();

    await logOperation('DELETE_SINGLE_SUCCESS', {
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
        cancelledAt: cancelledOrder.cancelledAt,
        updatedAt: cancelledOrder.updatedAt
      },
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    await logOperation('DELETE_SINGLE_ERROR', {
      error: error instanceof Error ? error.message : String(error)
    });

    console.error('❌ Error cancelling single order:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to cancel order',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}