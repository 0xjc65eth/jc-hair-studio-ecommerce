import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { sendEmail } from '@/lib/utils/sendgrid';

/**
 * Shipping Tracking Management API
 * POST /api/admin/shipping/track - Create tracking entries
 * PUT /api/admin/shipping/track - Update tracking status
 * GET /api/admin/shipping/track - Get tracking information
 */

interface TrackingEvent {
  status: string;
  description: string;
  location?: string;
  timestamp: Date;
  carrier?: string;
  notes?: string;
}

interface TrackingUpdate {
  orderId: string;
  trackingNumber: string;
  status: string;
  location?: string;
  description?: string;
  notes?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  signedBy?: string;
  automaticNotification?: boolean;
}

/**
 * POST - Create new tracking entry
 */
export async function POST(request: NextRequest) {
  try {
    const {
      orderId,
      trackingNumber,
      carrier,
      service,
      estimatedDelivery,
      initialStatus = 'label_created',
      automaticNotification = true
    } = await request.json();

    if (!orderId || !trackingNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, trackingNumber' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Create initial tracking event
    const initialEvent: TrackingEvent = {
      status: initialStatus,
      description: getStatusDescription(initialStatus),
      location: 'JC Hair Studio - Lisboa',
      timestamp: new Date(),
      carrier: carrier || 'Unknown',
      notes: 'Shipping label created and package prepared'
    };

    // Update order with tracking information
    const updateData = {
      'shipping.trackingNumber': trackingNumber,
      'shipping.carrier': carrier || 'Unknown',
      'shipping.status': initialStatus === 'shipped' ? 'shipped' : 'preparing',
      'shipping.trackingUrl': generateTrackingUrl(trackingNumber, carrier),
      'tracking.lastUpdated': new Date()
    };

    if (estimatedDelivery) {
      updateData['shipping.estimatedDelivery'] = new Date(estimatedDelivery);
    }

    await Order.findOneAndUpdate(
      { orderId },
      {
        $set: updateData,
        $push: {
          'tracking.events': initialEvent,
          'statusHistory': {
            status: initialStatus,
            timestamp: new Date(),
            changedBy: 'admin-tracking-system',
            reason: `Tracking created: ${trackingNumber}`,
            notes: `Carrier: ${carrier || 'Unknown'}`
          }
        }
      }
    );

    // Send notification if enabled
    if (automaticNotification && initialStatus === 'shipped') {
      await sendShippingNotification(order, trackingNumber, carrier);
    }

    return NextResponse.json({
      success: true,
      message: 'Tracking entry created successfully',
      orderId,
      trackingNumber,
      trackingUrl: generateTrackingUrl(trackingNumber, carrier),
      initialEvent
    });

  } catch (error) {
    console.error('Error creating tracking entry:', error);
    return NextResponse.json(
      { error: 'Failed to create tracking entry' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update tracking status
 */
export async function PUT(request: NextRequest) {
  try {
    const trackingUpdate: TrackingUpdate = await request.json();

    if (!trackingUpdate.orderId && !trackingUpdate.trackingNumber) {
      return NextResponse.json(
        { error: 'Missing orderId or trackingNumber' },
        { status: 400 }
      );
    }

    if (!trackingUpdate.status) {
      return NextResponse.json(
        { error: 'Missing status for tracking update' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find order by orderId or trackingNumber
    const query = trackingUpdate.orderId
      ? { orderId: trackingUpdate.orderId }
      : { 'shipping.trackingNumber': trackingUpdate.trackingNumber };

    const order = await Order.findOne(query);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Create tracking event
    const trackingEvent: TrackingEvent = {
      status: trackingUpdate.status,
      description: trackingUpdate.description || getStatusDescription(trackingUpdate.status),
      location: trackingUpdate.location,
      timestamp: new Date(),
      carrier: order.shipping.carrier,
      notes: trackingUpdate.notes
    };

    // Prepare update data
    const updateData: any = {
      'tracking.lastUpdated': new Date()
    };

    // Update shipping status based on tracking status
    const shippingStatus = mapTrackingToShippingStatus(trackingUpdate.status);
    if (shippingStatus) {
      updateData['shipping.status'] = shippingStatus;
    }

    // Handle specific status updates
    if (trackingUpdate.status === 'delivered') {
      if (trackingUpdate.actualDelivery) {
        updateData['shipping.actualDelivery'] = new Date(trackingUpdate.actualDelivery);
      } else {
        updateData['shipping.actualDelivery'] = new Date();
      }

      if (trackingUpdate.signedBy) {
        updateData['tracking.signedBy'] = trackingUpdate.signedBy;
      }

      // Mark order as completed
      updateData['timestamps.completedAt'] = new Date();
    }

    if (trackingUpdate.estimatedDelivery) {
      updateData['shipping.estimatedDelivery'] = new Date(trackingUpdate.estimatedDelivery);
    }

    // Update order
    await Order.findOneAndUpdate(
      query,
      {
        $set: updateData,
        $push: {
          'tracking.events': trackingEvent,
          'statusHistory': {
            status: trackingUpdate.status,
            timestamp: new Date(),
            changedBy: 'admin-tracking-system',
            reason: trackingUpdate.description || getStatusDescription(trackingUpdate.status),
            notes: trackingUpdate.notes
          }
        },
        $inc: {
          'tracking.deliveryAttempts': trackingUpdate.status === 'delivery_attempted' ? 1 : 0
        }
      }
    );

    // Send automatic notifications for key status updates
    if (trackingUpdate.automaticNotification !== false) {
      const notificationStatuses = ['shipped', 'out_for_delivery', 'delivered', 'delivery_failed'];
      if (notificationStatuses.includes(trackingUpdate.status)) {
        await sendTrackingUpdateNotification(order, trackingEvent);
      }
    }

    // Refresh order data for response
    const updatedOrder = await Order.findOne(query);

    return NextResponse.json({
      success: true,
      message: 'Tracking status updated successfully',
      orderId: updatedOrder.orderId,
      trackingNumber: updatedOrder.shipping.trackingNumber,
      currentStatus: trackingUpdate.status,
      shippingStatus: updatedOrder.shipping.status,
      trackingEvent,
      deliveryAttempts: updatedOrder.tracking.deliveryAttempts,
      estimatedDelivery: updatedOrder.shipping.estimatedDelivery,
      actualDelivery: updatedOrder.shipping.actualDelivery
    });

  } catch (error) {
    console.error('Error updating tracking status:', error);
    return NextResponse.json(
      { error: 'Failed to update tracking status' },
      { status: 500 }
    );
  }
}

/**
 * GET - Retrieve tracking information
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const trackingNumber = searchParams.get('trackingNumber');
    const detailed = searchParams.get('detailed') === 'true';

    if (!orderId && !trackingNumber) {
      return NextResponse.json(
        { error: 'Missing orderId or trackingNumber parameter' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find order
    const query = orderId
      ? { orderId }
      : { 'shipping.trackingNumber': trackingNumber };

    const order = await Order.findOne(query);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Build response based on detail level
    const trackingInfo = {
      orderId: order.orderId,
      trackingNumber: order.shipping.trackingNumber,
      carrier: order.shipping.carrier,
      service: order.shipping.method,
      currentStatus: order.shipping.status,
      trackingUrl: order.shipping.trackingUrl,
      estimatedDelivery: order.shipping.estimatedDelivery,
      actualDelivery: order.shipping.actualDelivery,
      lastUpdated: order.tracking.lastUpdated,
      deliveryAttempts: order.tracking.deliveryAttempts,
      signedBy: order.tracking.signedBy,
      events: order.tracking.events.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    };

    if (detailed) {
      // Include additional order details for admin view
      trackingInfo['customer'] = {
        name: `${order.customer.firstName} ${order.customer.lastName}`,
        email: order.customer.email,
        phone: order.customer.phone
      };
      trackingInfo['deliveryAddress'] = order.deliveryAddress;
      trackingInfo['products'] = order.products.map(p => ({
        name: p.name,
        quantity: p.quantity,
        sku: p.sku
      }));
      trackingInfo['orderValue'] = order.pricing.total;
      trackingInfo['shippingCost'] = order.shipping.shippingCost;
    }

    return NextResponse.json({
      success: true,
      tracking: trackingInfo
    });

  } catch (error) {
    console.error('Error retrieving tracking information:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve tracking information' },
      { status: 500 }
    );
  }
}

/**
 * Map tracking status to shipping status
 */
function mapTrackingToShippingStatus(trackingStatus: string): string | null {
  const statusMap: { [key: string]: string } = {
    'label_created': 'preparing',
    'picked_up': 'shipped',
    'shipped': 'shipped',
    'in_transit': 'in_transit',
    'out_for_delivery': 'in_transit',
    'delivered': 'delivered',
    'delivery_failed': 'in_transit',
    'delivery_attempted': 'in_transit',
    'returned': 'returned',
    'cancelled': 'cancelled'
  };

  return statusMap[trackingStatus] || null;
}

/**
 * Get status description
 */
function getStatusDescription(status: string): string {
  const descriptions: { [key: string]: string } = {
    'label_created': 'Shipping label created',
    'picked_up': 'Package picked up by carrier',
    'shipped': 'Package shipped',
    'in_transit': 'Package in transit',
    'out_for_delivery': 'Out for delivery',
    'delivered': 'Package delivered',
    'delivery_failed': 'Delivery failed',
    'delivery_attempted': 'Delivery attempted',
    'exception': 'Delivery exception',
    'returned': 'Package returned to sender',
    'cancelled': 'Shipment cancelled'
  };

  return descriptions[status] || `Status: ${status}`;
}

/**
 * Generate tracking URL
 */
function generateTrackingUrl(trackingNumber: string, carrier?: string): string {
  switch (carrier?.toLowerCase()) {
    case 'ctt':
      return `https://www.ctt.pt/feapl_2/app/open/cttexpresso/objectSearch/objectSearch.jspx?objects=${trackingNumber}`;
    case 'correios':
      return `https://www2.correios.com.br/sistemas/rastreamento/resultado_semcookie.cfm?objetos=${trackingNumber}`;
    case 'dpd':
      return `https://www.dpd.com/pt_en/mydpd/my-parcels/track?parcelNumber=${trackingNumber}`;
    case 'ups':
      return `https://www.ups.com/track?tracknum=${trackingNumber}`;
    case 'dhl':
      return `https://www.dhl.com/pt-pt/home/tracking.html?tracking-id=${trackingNumber}`;
    default:
      return `https://track.jchairstudios62.com/${trackingNumber}`;
  }
}

/**
 * Send shipping notification to customer
 */
async function sendShippingNotification(order: any, trackingNumber: string, carrier?: string) {
  try {
    const trackingUrl = generateTrackingUrl(trackingNumber, carrier);

    await sendEmail({
      to: order.customer.email,
      subject: `📦 Seu pedido foi enviado - #${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">📦 Pedido Enviado!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Seu pedido está a caminho</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #667eea;">
              <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">Detalhes do Envio</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Pedido:</strong> #${order.orderId}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Código de Rastreamento:</strong> ${trackingNumber}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Transportadora:</strong> ${carrier || 'CTT Express'}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Previsão de Entrega:</strong> ${order.shipping.estimatedDelivery ? new Date(order.shipping.estimatedDelivery).toLocaleDateString('pt-PT') : '2-3 dias úteis'}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${trackingUrl}"
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                🔍 Rastrear Pedido
              </a>
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #856404;">💡 Dica de Rastreamento</h4>
              <p style="margin: 0; color: #856404; font-size: 14px;">
                Salve o código de rastreamento <strong>${trackingNumber}</strong> para acompanhar seu pedido.
                Você receberá atualizações automáticas sobre o status da entrega.
              </p>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <h4 style="color: #333; margin-bottom: 15px;">📋 Produtos Enviados</h4>
              ${order.products.map(product => `
                <div style="border-bottom: 1px solid #f0f0f0; padding: 10px 0;">
                  <span style="font-weight: bold; color: #333;">${product.name}</span>
                  <span style="float: right; color: #666;">Qty: ${product.quantity}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>JC Hair Studio</strong><br>
              Professional Hair Care Products<br>
              📧 suporte@jchairstudios62.com | 📞 +351 928 375 226
            </p>
          </div>
        </div>
      `,
      templateId: process.env.SENDGRID_SHIPPING_TEMPLATE_ID
    });

    console.log(`✅ Shipping notification sent for order ${order.orderId}`);
  } catch (error) {
    console.error('❌ Failed to send shipping notification:', error);
  }
}

/**
 * Send tracking update notification
 */
async function sendTrackingUpdateNotification(order: any, trackingEvent: TrackingEvent) {
  try {
    const trackingUrl = generateTrackingUrl(order.shipping.trackingNumber, order.shipping.carrier);

    let subject = '';
    let statusEmoji = '';
    let statusColor = '';

    switch (trackingEvent.status) {
      case 'shipped':
        subject = 'Seu pedido foi enviado';
        statusEmoji = '📦';
        statusColor = '#3498db';
        break;
      case 'out_for_delivery':
        subject = 'Seu pedido está saindo para entrega';
        statusEmoji = '🚚';
        statusColor = '#f39c12';
        break;
      case 'delivered':
        subject = 'Seu pedido foi entregue';
        statusEmoji = '✅';
        statusColor = '#27ae60';
        break;
      case 'delivery_failed':
        subject = 'Tentativa de entrega do seu pedido';
        statusEmoji = '⚠️';
        statusColor = '#e74c3c';
        break;
      default:
        return; // Don't send notification for other statuses
    }

    await sendEmail({
      to: order.customer.email,
      subject: `${statusEmoji} ${subject} - #${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: ${statusColor}; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">${statusEmoji} ${subject}</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Pedido #${order.orderId}</p>
          </div>

          <div style="padding: 30px; background: white;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #333;">Atualização do Pedido</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> ${trackingEvent.description}</p>
              ${trackingEvent.location ? `<p style="margin: 5px 0; color: #666;"><strong>Local:</strong> ${trackingEvent.location}</p>` : ''}
              <p style="margin: 5px 0; color: #666;"><strong>Data:</strong> ${trackingEvent.timestamp.toLocaleString('pt-PT')}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Código de Rastreamento:</strong> ${order.shipping.trackingNumber}</p>
            </div>

            <div style="text-align: center; margin: 20px 0;">
              <a href="${trackingUrl}"
                 style="background: ${statusColor}; color: white; padding: 12px 25px; text-decoration: none; border-radius: 20px; font-weight: bold;">
                Rastrear Pedido
              </a>
            </div>
          </div>

          <div style="background: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 14px;">
            JC Hair Studio - Professional Hair Care Products
          </div>
        </div>
      `
    });

    console.log(`✅ Tracking update notification sent for order ${order.orderId} - ${trackingEvent.status}`);
  } catch (error) {
    console.error('❌ Failed to send tracking update notification:', error);
  }
}