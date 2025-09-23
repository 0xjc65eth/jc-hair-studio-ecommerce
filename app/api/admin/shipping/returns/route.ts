import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { sendEmail } from '@/lib/utils/sendgrid';

/**
 * Return Label and RMA Management API
 * POST /api/admin/shipping/returns - Generate return labels
 * GET /api/admin/shipping/returns - Get return statistics
 * PUT /api/admin/shipping/returns - Update return status
 */

interface ReturnRequest {
  orderId: string;
  reason: 'defective' | 'wrong_item' | 'not_as_described' | 'customer_preference' | 'damaged' | 'other';
  description?: string;
  returnItems: Array<{
    productId: string;
    quantity: number;
    condition?: 'new' | 'used' | 'damaged';
  }>;
  customerNotes?: string;
  refundType: 'full' | 'partial' | 'exchange' | 'store_credit';
  pickupAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  carrier?: string;
  priority?: boolean;
}

interface ReturnLabel {
  returnId: string;
  orderId: string;
  trackingNumber: string;
  labelUrl: string;
  carrier: string;
  estimatedPickup: Date;
  returnAddress: any;
  qrCode: string;
  instructions: string[];
}

/**
 * POST - Generate return label and create RMA
 */
export async function POST(request: NextRequest) {
  try {
    const returnRequest: ReturnRequest = await request.json();

    if (!returnRequest.orderId || !returnRequest.reason) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, reason' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the original order
    const order = await Order.findOne({ orderId: returnRequest.orderId });
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if return is allowed (within return period)
    const returnPolicyDays = 30;
    const orderDate = new Date(order.timestamps.createdAt);
    const daysSinceOrder = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceOrder > returnPolicyDays) {
      return NextResponse.json(
        { error: `Return period expired. Returns are only allowed within ${returnPolicyDays} days of purchase.` },
        { status: 400 }
      );
    }

    // Generate return ID and tracking number
    const returnId = `RMA${Date.now().toString().slice(-8)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const returnTrackingNumber = generateReturnTrackingNumber(returnRequest.carrier || 'CTT');

    // Calculate estimated pickup date
    const estimatedPickup = new Date();
    estimatedPickup.setDate(estimatedPickup.getDate() + (returnRequest.priority ? 1 : 3));

    // Create return data structure
    const returnData = {
      returnId,
      orderId: returnRequest.orderId,
      reason: returnRequest.reason,
      description: returnRequest.description,
      returnItems: returnRequest.returnItems,
      customerNotes: returnRequest.customerNotes,
      refundType: returnRequest.refundType,
      status: 'initiated',
      createdAt: new Date(),
      estimatedPickup,
      trackingNumber: returnTrackingNumber,
      carrier: returnRequest.carrier || 'CTT',
      pickupAddress: returnRequest.pickupAddress || order.deliveryAddress,
      returnAddress: {
        company: 'JC Hair Studio',
        street: 'Rua Example, 123',
        city: 'Lisboa',
        state: 'Lisboa',
        zipCode: '1000-001',
        country: 'PT',
        phone: '+351 928 375 226'
      }
    };

    // Generate return label
    const returnLabel: ReturnLabel = {
      returnId,
      orderId: returnRequest.orderId,
      trackingNumber: returnTrackingNumber,
      labelUrl: await generateReturnLabelPDF(order, returnData),
      carrier: returnRequest.carrier || 'CTT',
      estimatedPickup,
      returnAddress: returnData.returnAddress,
      qrCode: await generateReturnQRCode(returnData),
      instructions: generateReturnInstructions(returnRequest.reason, returnRequest.refundType)
    };

    // Update order with return information
    await Order.findOneAndUpdate(
      { orderId: returnRequest.orderId },
      {
        $set: {
          'shipping.status': 'return_initiated',
          'timestamps.updatedAt': new Date()
        },
        $push: {
          'statusHistory': {
            status: 'return_initiated',
            timestamp: new Date(),
            changedBy: 'admin-return-system',
            reason: `Return initiated: ${returnRequest.reason}`,
            notes: `Return ID: ${returnId}`
          },
          'auditLog': {
            action: 'return_initiated',
            performedBy: 'admin-return-system',
            timestamp: new Date(),
            changes: [{
              field: 'return',
              oldValue: null,
              newValue: returnData
            }]
          }
        }
      }
    );

    // Store return data (in production, use a separate Returns collection)
    // For now, we'll add it to the order's metadata
    await Order.findOneAndUpdate(
      { orderId: returnRequest.orderId },
      {
        $set: {
          'metadata.returnData': returnData
        }
      }
    );

    // Send return label email to customer
    await sendReturnLabelEmail(order, returnLabel, returnData);

    // Send internal notification
    await sendInternalReturnNotification(order, returnData);

    return NextResponse.json({
      success: true,
      message: 'Return label generated successfully',
      returnLabel,
      returnId,
      estimatedPickup: estimatedPickup.toISOString(),
      instructions: returnLabel.instructions
    });

  } catch (error) {
    console.error('Error generating return label:', error);
    return NextResponse.json(
      { error: 'Failed to generate return label' },
      { status: 500 }
    );
  }
}

/**
 * GET - Get return statistics and list
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const status = searchParams.get('status') || 'all';

    await connectToDatabase();

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Query for orders with returns
    const query: any = {
      'timestamps.createdAt': { $gte: startDate },
      'metadata.returnData': { $exists: true }
    };

    if (status !== 'all') {
      query['metadata.returnData.status'] = status;
    }

    const returnsData = await Order.find(query, {
      orderId: 1,
      'customer.firstName': 1,
      'customer.lastName': 1,
      'customer.email': 1,
      'pricing.total': 1,
      'timestamps.createdAt': 1,
      'metadata.returnData': 1
    }).sort({ 'timestamps.createdAt': -1 });

    // Calculate statistics
    const totalReturns = returnsData.length;
    const returnsByReason = {};
    const returnsByStatus = {};
    const returnsByRefundType = {};
    let totalReturnValue = 0;

    returnsData.forEach(order => {
      const returnData = order.metadata?.returnData;
      if (returnData) {
        // Count by reason
        returnsByReason[returnData.reason] = (returnsByReason[returnData.reason] || 0) + 1;

        // Count by status
        returnsByStatus[returnData.status] = (returnsByStatus[returnData.status] || 0) + 1;

        // Count by refund type
        returnsByRefundType[returnData.refundType] = (returnsByRefundType[returnData.refundType] || 0) + 1;

        // Calculate return value
        totalReturnValue += order.pricing.total;
      }
    });

    // Calculate return rate (need total orders for the period)
    const totalOrdersInPeriod = await Order.countDocuments({
      'timestamps.createdAt': { $gte: startDate }
    });

    const returnRate = totalOrdersInPeriod > 0 ? (totalReturns / totalOrdersInPeriod) * 100 : 0;

    return NextResponse.json({
      success: true,
      period: `Last ${period} days`,
      statistics: {
        totalReturns,
        returnRate: Math.round(returnRate * 100) / 100,
        totalReturnValue,
        averageReturnValue: totalReturns > 0 ? totalReturnValue / totalReturns : 0,
        returnsByReason,
        returnsByStatus,
        returnsByRefundType
      },
      returns: returnsData.map(order => ({
        orderId: order.orderId,
        customerName: `${order.customer.firstName} ${order.customer.lastName}`,
        customerEmail: order.customer.email,
        orderValue: order.pricing.total,
        orderDate: order.timestamps.createdAt,
        returnData: order.metadata.returnData
      }))
    });

  } catch (error) {
    console.error('Error retrieving return statistics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve return statistics' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update return status
 */
export async function PUT(request: NextRequest) {
  try {
    const { returnId, orderId, status, notes, refundAmount, refundDate } = await request.json();

    if (!returnId && !orderId) {
      return NextResponse.json(
        { error: 'Missing returnId or orderId' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Missing status field' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find order by return ID or order ID
    const query = returnId
      ? { 'metadata.returnData.returnId': returnId }
      : { orderId };

    const order = await Order.findOne(query);
    if (!order) {
      return NextResponse.json(
        { error: 'Return not found' },
        { status: 404 }
      );
    }

    // Update return status
    const updateData: any = {
      'metadata.returnData.status': status,
      'metadata.returnData.lastUpdated': new Date(),
      'timestamps.updatedAt': new Date()
    };

    if (notes) {
      updateData['metadata.returnData.notes'] = notes;
    }

    if (refundAmount) {
      updateData['payment.refundAmount'] = refundAmount;
      updateData['payment.refundDate'] = refundDate ? new Date(refundDate) : new Date();

      if (refundAmount >= order.pricing.total) {
        updateData['payment.status'] = 'refunded';
      } else {
        updateData['payment.status'] = 'partially_refunded';
      }
    }

    // Update shipping status based on return status
    if (status === 'received') {
      updateData['shipping.status'] = 'returned';
    } else if (status === 'completed') {
      updateData['shipping.status'] = 'returned';
      updateData['timestamps.completedAt'] = new Date();
    }

    await Order.findOneAndUpdate(
      query,
      {
        $set: updateData,
        $push: {
          'statusHistory': {
            status: `return_${status}`,
            timestamp: new Date(),
            changedBy: 'admin-return-system',
            reason: `Return status updated to ${status}`,
            notes
          }
        }
      }
    );

    // Send customer notification for key status updates
    const notificationStatuses = ['shipped', 'received', 'completed', 'rejected'];
    if (notificationStatuses.includes(status)) {
      await sendReturnStatusUpdateEmail(order, status, notes);
    }

    return NextResponse.json({
      success: true,
      message: `Return status updated to ${status}`,
      returnId: order.metadata.returnData.returnId,
      orderId: order.orderId,
      newStatus: status
    });

  } catch (error) {
    console.error('Error updating return status:', error);
    return NextResponse.json(
      { error: 'Failed to update return status' },
      { status: 500 }
    );
  }
}

/**
 * Generate return tracking number
 */
function generateReturnTrackingNumber(carrier: string): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  switch (carrier.toLowerCase()) {
    case 'ctt':
      return `RT${timestamp.slice(-8)}${random}PT`;
    case 'dpd':
      return `DPD${timestamp.slice(-8)}${random}`;
    case 'ups':
      return `1ZRT${random}${timestamp.slice(-8)}`;
    default:
      return `RT${timestamp.slice(-8)}${random}`;
  }
}

/**
 * Generate return instructions based on reason and refund type
 */
function generateReturnInstructions(reason: string, refundType: string): string[] {
  const baseInstructions = [
    'Package items securely in original packaging if possible',
    'Include all accessories and documentation',
    'Attach the return label to the outside of the package',
    'Drop off at any authorized shipping location'
  ];

  const reasonSpecific: { [key: string]: string[] } = {
    'defective': [
      'Please include a detailed description of the defect',
      'Do not attempt to repair the item yourself'
    ],
    'wrong_item': [
      'Ensure the item is in original condition',
      'Keep all original tags attached'
    ],
    'damaged': [
      'Take photos of the damage before packaging',
      'Wrap carefully to prevent further damage during return'
    ]
  };

  const refundSpecific: { [key: string]: string[] } = {
    'exchange': [
      'Your replacement item will be shipped once we receive your return',
      'Contact customer service to specify your exchange preference'
    ],
    'store_credit': [
      'Store credit will be issued within 3-5 business days of receiving your return',
      'Store credit does not expire and can be used for any future purchase'
    ]
  };

  return [
    ...baseInstructions,
    ...(reasonSpecific[reason] || []),
    ...(refundSpecific[refundType] || [])
  ];
}

/**
 * Generate return QR code data
 */
async function generateReturnQRCode(returnData: any): Promise<string> {
  const qrData = {
    type: 'return',
    returnId: returnData.returnId,
    orderId: returnData.orderId,
    trackingNumber: returnData.trackingNumber
  };

  // In production, generate actual QR code
  return JSON.stringify(qrData);
}

/**
 * Generate return label PDF
 */
async function generateReturnLabelPDF(order: any, returnData: any): Promise<string> {
  // In production, generate actual PDF
  // For now, return a placeholder URL
  return `/api/shipping/returns/download/${returnData.returnId}_return_label.pdf`;
}

/**
 * Send return label email to customer
 */
async function sendReturnLabelEmail(order: any, returnLabel: ReturnLabel, returnData: any) {
  try {
    await sendEmail({
      to: order.customer.email,
      subject: `📦 Return Label for Order #${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">📦 Return Label Generated</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Order #${order.orderId}</p>
          </div>

          <div style="padding: 30px;">
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">Return Information</h3>
              <p style="margin: 5px 0; color: #856404;"><strong>Return ID:</strong> ${returnLabel.returnId}</p>
              <p style="margin: 5px 0; color: #856404;"><strong>Tracking Number:</strong> ${returnLabel.trackingNumber}</p>
              <p style="margin: 5px 0; color: #856404;"><strong>Carrier:</strong> ${returnLabel.carrier}</p>
              <p style="margin: 5px 0; color: #856404;"><strong>Estimated Pickup:</strong> ${returnLabel.estimatedPickup.toLocaleDateString('pt-PT')}</p>
            </div>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1565c0;">Return Instructions</h3>
              <ol style="margin: 0; padding-left: 20px; color: #1565c0;">
                ${returnLabel.instructions.map(instruction => `<li style="margin-bottom: 8px;">${instruction}</li>`).join('')}
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${returnLabel.labelUrl}"
                 style="background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">
                📥 Download Return Label
              </a>
            </div>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #495057;">What happens next?</h4>
              <ul style="margin: 0; padding-left: 20px; color: #6c757d;">
                <li>Package your items using the instructions above</li>
                <li>Attach the return label to your package</li>
                <li>Drop off at any ${returnLabel.carrier} location</li>
                <li>We'll process your return within 3-5 business days of receipt</li>
                <li>You'll receive an email confirmation once your return is processed</li>
              </ul>
            </div>
          </div>

          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>JC Hair Studio</strong><br>
              Questions? Contact us at suporte@jchairstudios62.com
            </p>
          </div>
        </div>
      `
    });

    console.log(`✅ Return label email sent for order ${order.orderId}`);
  } catch (error) {
    console.error('❌ Failed to send return label email:', error);
  }
}

/**
 * Send internal return notification
 */
async function sendInternalReturnNotification(order: any, returnData: any) {
  try {
    await sendEmail({
      to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.com',
      subject: `🔄 New Return Request - Order #${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b6b;">🔄 New Return Request</h2>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3>Return Details</h3>
            <p><strong>Return ID:</strong> ${returnData.returnId}</p>
            <p><strong>Order ID:</strong> ${returnData.orderId}</p>
            <p><strong>Customer:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Reason:</strong> ${returnData.reason}</p>
            <p><strong>Refund Type:</strong> ${returnData.refundType}</p>
            <p><strong>Order Value:</strong> €${order.pricing.total.toFixed(2)}</p>
          </div>

          ${returnData.description ? `
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h4>Description:</h4>
              <p>${returnData.description}</p>
            </div>
          ` : ''}

          ${returnData.customerNotes ? `
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h4>Customer Notes:</h4>
              <p>${returnData.customerNotes}</p>
            </div>
          ` : ''}

          <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>Items to Return:</h4>
            <ul>
              ${returnData.returnItems.map(item =>
                `<li>Product ID: ${item.productId} - Quantity: ${item.quantity}${item.condition ? ` (${item.condition})` : ''}</li>`
              ).join('')}
            </ul>
          </div>
        </div>
      `
    });

    console.log(`✅ Internal return notification sent for order ${order.orderId}`);
  } catch (error) {
    console.error('❌ Failed to send internal return notification:', error);
  }
}

/**
 * Send return status update email to customer
 */
async function sendReturnStatusUpdateEmail(order: any, status: string, notes?: string) {
  try {
    let subject = '';
    let statusMessage = '';
    let statusColor = '';

    switch (status) {
      case 'shipped':
        subject = 'Return package picked up';
        statusMessage = 'Your return package has been picked up and is on its way to our warehouse.';
        statusColor = '#3498db';
        break;
      case 'received':
        subject = 'Return package received';
        statusMessage = 'We have received your return package and are processing it.';
        statusColor = '#f39c12';
        break;
      case 'completed':
        subject = 'Return processed successfully';
        statusMessage = 'Your return has been processed and your refund/exchange is complete.';
        statusColor = '#27ae60';
        break;
      case 'rejected':
        subject = 'Return could not be processed';
        statusMessage = 'Unfortunately, we could not process your return. Please see the notes below.';
        statusColor = '#e74c3c';
        break;
    }

    await sendEmail({
      to: order.customer.email,
      subject: `🔄 ${subject} - Order #${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: ${statusColor}; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">🔄 ${subject}</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Order #${order.orderId}</p>
          </div>

          <div style="padding: 30px;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #333;">Return Status Update</h3>
              <p style="margin: 0; color: #666; line-height: 1.5;">${statusMessage}</p>
            </div>

            ${notes ? `
              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #1565c0;">Additional Information</h4>
                <p style="margin: 0; color: #1565c0;">${notes}</p>
              </div>
            ` : ''}
          </div>

          <div style="background: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 14px;">
            JC Hair Studio - Professional Hair Care Products
          </div>
        </div>
      `
    });

    console.log(`✅ Return status update notification sent for order ${order.orderId} - ${status}`);
  } catch (error) {
    console.error('❌ Failed to send return status update notification:', error);
  }
}