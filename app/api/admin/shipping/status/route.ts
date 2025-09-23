import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { sendEmail } from '@/lib/utils/sendgrid';

/**
 * Shipping Status Update API
 * PUT /api/admin/shipping/status - Update shipping status for orders
 *
 * Supports bulk status updates and automatic notifications
 */

interface StatusUpdateRequest {
  orderIds: string[];
  status: 'pending' | 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'returned' | 'cancelled';
  reason?: string;
  notes?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingNumber?: string;
  carrier?: string;
  location?: string;
  signedBy?: string;
  automaticNotification?: boolean;
  notificationTemplate?: string;
}

interface StatusUpdateResponse {
  success: boolean;
  message: string;
  updatedOrders: number;
  failedOrders: string[];
  summary: {
    [status: string]: number;
  };
  notifications: {
    sent: number;
    failed: number;
  };
}

export async function PUT(request: NextRequest) {
  try {
    const updateRequest: StatusUpdateRequest = await request.json();

    if (!updateRequest.orderIds || !Array.isArray(updateRequest.orderIds) || updateRequest.orderIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid orderIds array' },
        { status: 400 }
      );
    }

    if (!updateRequest.status) {
      return NextResponse.json(
        { error: 'Missing status field' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Fetch orders to update
    const orders = await Order.find({ orderId: { $in: updateRequest.orderIds } });

    if (orders.length === 0) {
      return NextResponse.json(
        { error: 'No orders found for the provided IDs' },
        { status: 404 }
      );
    }

    const updatedOrders: string[] = [];
    const failedOrders: string[] = [];
    const statusSummary: { [status: string]: number } = {};
    const notifications = { sent: 0, failed: 0 };

    // Process each order
    for (const order of orders) {
      try {
        // Prepare update data
        const updateData: any = {
          'shipping.status': updateRequest.status,
          'tracking.lastUpdated': new Date()
        };

        // Handle specific status fields
        if (updateRequest.estimatedDelivery) {
          updateData['shipping.estimatedDelivery'] = new Date(updateRequest.estimatedDelivery);
        }

        if (updateRequest.actualDelivery) {
          updateData['shipping.actualDelivery'] = new Date(updateRequest.actualDelivery);
        }

        if (updateRequest.trackingNumber) {
          updateData['shipping.trackingNumber'] = updateRequest.trackingNumber;
          updateData['shipping.trackingUrl'] = generateTrackingUrl(updateRequest.trackingNumber, updateRequest.carrier);
        }

        if (updateRequest.carrier) {
          updateData['shipping.carrier'] = updateRequest.carrier;
        }

        if (updateRequest.signedBy) {
          updateData['tracking.signedBy'] = updateRequest.signedBy;
        }

        // Handle status-specific logic
        if (updateRequest.status === 'delivered') {
          updateData['timestamps.completedAt'] = new Date();
          if (!updateRequest.actualDelivery) {
            updateData['shipping.actualDelivery'] = new Date();
          }
        }

        if (updateRequest.status === 'cancelled') {
          updateData['timestamps.cancelledAt'] = new Date();
        }

        // Create tracking event
        const trackingEvent = {
          status: updateRequest.status,
          description: getStatusDescription(updateRequest.status, updateRequest.reason),
          location: updateRequest.location || '',
          timestamp: new Date(),
          carrier: updateRequest.carrier || order.shipping.carrier || '',
          notes: updateRequest.notes || ''
        };

        // Create status history entry
        const statusHistory = {
          status: updateRequest.status,
          timestamp: new Date(),
          changedBy: 'admin-bulk-update',
          reason: updateRequest.reason || `Status updated to ${updateRequest.status}`,
          notes: updateRequest.notes,
          previousStatus: order.shipping.status
        };

        // Update order in database
        await Order.findOneAndUpdate(
          { orderId: order.orderId },
          {
            $set: updateData,
            $push: {
              'tracking.events': trackingEvent,
              'statusHistory': statusHistory,
              'auditLog': {
                action: 'status_changed',
                performedBy: 'admin-bulk-update',
                timestamp: new Date(),
                changes: [{
                  field: 'shipping.status',
                  oldValue: order.shipping.status,
                  newValue: updateRequest.status
                }]
              }
            }
          }
        );

        updatedOrders.push(order.orderId);

        // Update status summary
        statusSummary[updateRequest.status] = (statusSummary[updateRequest.status] || 0) + 1;

        // Send automatic notification if enabled
        if (updateRequest.automaticNotification !== false) {
          try {
            await sendStatusUpdateNotification(
              order,
              updateRequest.status,
              trackingEvent,
              updateRequest.notificationTemplate
            );
            notifications.sent++;
          } catch (notificationError) {
            console.error(`Failed to send notification for order ${order.orderId}:`, notificationError);
            notifications.failed++;
          }
        }

      } catch (error) {
        console.error(`Failed to update order ${order.orderId}:`, error);
        failedOrders.push(`${order.orderId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    const response: StatusUpdateResponse = {
      success: true,
      message: `Updated ${updatedOrders.length} orders to status: ${updateRequest.status}`,
      updatedOrders: updatedOrders.length,
      failedOrders,
      summary: statusSummary,
      notifications
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in bulk status update:', error);
    return NextResponse.json(
      { error: 'Failed to update shipping statuses' },
      { status: 500 }
    );
  }
}

/**
 * GET - Retrieve shipping status statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const detailed = searchParams.get('detailed') === 'true';

    await connectToDatabase();

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Aggregation pipeline for shipping statistics
    const pipeline = [
      {
        $match: {
          'timestamps.createdAt': { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$shipping.status',
          count: { $sum: 1 },
          averageShippingCost: { $avg: '$shipping.shippingCost' },
          totalShippingRevenue: { $sum: '$shipping.shippingCost' },
          averageDeliveryTime: {
            $avg: {
              $cond: {
                if: { $and: ['$shipping.actualDelivery', '$timestamps.createdAt'] },
                then: {
                  $divide: [
                    { $subtract: ['$shipping.actualDelivery', '$timestamps.createdAt'] },
                    1000 * 60 * 60 * 24 // Convert to days
                  ]
                },
                else: null
              }
            }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ];

    const statusStats = await Order.aggregate(pipeline);

    // Calculate carrier performance if detailed
    let carrierStats = [];
    if (detailed) {
      const carrierPipeline = [
        {
          $match: {
            'timestamps.createdAt': { $gte: startDate },
            'shipping.carrier': { $exists: true, $ne: '' }
          }
        },
        {
          $group: {
            _id: '$shipping.carrier',
            orderCount: { $sum: 1 },
            averageCost: { $avg: '$shipping.shippingCost' },
            onTimeDeliveries: {
              $sum: {
                $cond: {
                  if: {
                    $and: [
                      '$shipping.actualDelivery',
                      '$shipping.estimatedDelivery',
                      { $lte: ['$shipping.actualDelivery', '$shipping.estimatedDelivery'] }
                    ]
                  },
                  then: 1,
                  else: 0
                }
              }
            },
            totalDeliveries: {
              $sum: {
                $cond: {
                  if: '$shipping.actualDelivery',
                  then: 1,
                  else: 0
                }
              }
            }
          }
        },
        {
          $addFields: {
            onTimeRate: {
              $cond: {
                if: { $gt: ['$totalDeliveries', 0] },
                then: { $multiply: [{ $divide: ['$onTimeDeliveries', '$totalDeliveries'] }, 100] },
                else: 0
              }
            }
          }
        },
        {
          $sort: { orderCount: -1 }
        }
      ];

      carrierStats = await Order.aggregate(carrierPipeline);
    }

    // Calculate delivery performance metrics
    const deliveryMetrics = await Order.aggregate([
      {
        $match: {
          'timestamps.createdAt': { $gte: startDate },
          'shipping.status': 'delivered'
        }
      },
      {
        $group: {
          _id: null,
          averageDeliveryTime: {
            $avg: {
              $divide: [
                { $subtract: ['$shipping.actualDelivery', '$timestamps.createdAt'] },
                1000 * 60 * 60 * 24
              ]
            }
          },
          onTimeDeliveries: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    '$shipping.estimatedDelivery',
                    { $lte: ['$shipping.actualDelivery', '$shipping.estimatedDelivery'] }
                  ]
                },
                then: 1,
                else: 0
              }
            }
          },
          totalDeliveries: { $sum: 1 },
          totalShippingCost: { $sum: '$shipping.shippingCost' }
        }
      },
      {
        $addFields: {
          onTimeRate: {
            $multiply: [{ $divide: ['$onTimeDeliveries', '$totalDeliveries'] }, 100]
          }
        }
      }
    ]);

    const response = {
      success: true,
      period: `Last ${period} days`,
      statusDistribution: statusStats,
      totalOrders: statusStats.reduce((sum, stat) => sum + stat.count, 0),
      deliveryMetrics: deliveryMetrics[0] || {
        averageDeliveryTime: 0,
        onTimeRate: 0,
        totalDeliveries: 0,
        totalShippingCost: 0
      },
      ...(detailed && { carrierPerformance: carrierStats })
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error retrieving shipping statistics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve shipping statistics' },
      { status: 500 }
    );
  }
}

/**
 * Get status description based on status and reason
 */
function getStatusDescription(status: string, reason?: string): string {
  if (reason) return reason;

  const descriptions: { [key: string]: string } = {
    'pending': 'Order received, awaiting processing',
    'preparing': 'Order being prepared for shipment',
    'shipped': 'Package has been shipped',
    'in_transit': 'Package is in transit',
    'delivered': 'Package has been delivered',
    'returned': 'Package has been returned to sender',
    'cancelled': 'Shipment has been cancelled'
  };

  return descriptions[status] || `Status updated to: ${status}`;
}

/**
 * Generate tracking URL for carrier
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
 * Send status update notification to customer
 */
async function sendStatusUpdateNotification(
  order: any,
  status: string,
  trackingEvent: any,
  template?: string
) {
  // Only send notifications for significant status changes
  const notificationStatuses = ['shipped', 'in_transit', 'delivered', 'returned', 'cancelled'];
  if (!notificationStatuses.includes(status)) {
    return;
  }

  try {
    let subject = '';
    let statusEmoji = '';
    let statusColor = '';
    let statusMessage = '';

    switch (status) {
      case 'shipped':
        subject = 'Seu pedido foi enviado';
        statusEmoji = '📦';
        statusColor = '#3498db';
        statusMessage = 'Seu pedido foi despachado e está a caminho!';
        break;
      case 'in_transit':
        subject = 'Seu pedido está em trânsito';
        statusEmoji = '🚚';
        statusColor = '#f39c12';
        statusMessage = 'Seu pedido está em movimento e se aproximando do destino.';
        break;
      case 'delivered':
        subject = 'Seu pedido foi entregue';
        statusEmoji = '✅';
        statusColor = '#27ae60';
        statusMessage = 'Seu pedido foi entregue com sucesso! Esperamos que você aproveite seus produtos.';
        break;
      case 'returned':
        subject = 'Seu pedido foi devolvido';
        statusEmoji = '↩️';
        statusColor = '#e74c3c';
        statusMessage = 'Seu pedido foi devolvido ao remetente. Entre em contato conosco para mais informações.';
        break;
      case 'cancelled':
        subject = 'Seu pedido foi cancelado';
        statusEmoji = '❌';
        statusColor = '#e74c3c';
        statusMessage = 'Seu pedido foi cancelado. Se você não solicitou este cancelamento, entre em contato conosco.';
        break;
    }

    const trackingUrl = order.shipping.trackingNumber
      ? generateTrackingUrl(order.shipping.trackingNumber, order.shipping.carrier)
      : '#';

    await sendEmail({
      to: order.customer.email,
      subject: `${statusEmoji} ${subject} - #${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: ${statusColor}; padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">${statusEmoji} ${subject}</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Pedido #${order.orderId}</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid ${statusColor};">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Atualização do Status</h3>
              <p style="margin: 0 0 15px 0; color: #666; font-size: 16px; line-height: 1.5;">${statusMessage}</p>

              <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #e1e8ed;">
                <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> ${trackingEvent.description}</p>
                ${trackingEvent.location ? `<p style="margin: 5px 0; color: #666;"><strong>Local:</strong> ${trackingEvent.location}</p>` : ''}
                <p style="margin: 5px 0; color: #666;"><strong>Data/Hora:</strong> ${trackingEvent.timestamp.toLocaleString('pt-PT')}</p>
                ${order.shipping.trackingNumber ? `<p style="margin: 5px 0; color: #666;"><strong>Código de Rastreamento:</strong> ${order.shipping.trackingNumber}</p>` : ''}
              </div>
            </div>

            ${order.shipping.trackingNumber ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${trackingUrl}"
                   style="background: ${statusColor}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                  🔍 Rastrear Pedido
                </a>
              </div>
            ` : ''}

            ${status === 'delivered' ? `
              <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #155724;">🎉 Obrigado pela sua compra!</h4>
                <p style="margin: 0; color: #155724;">
                  Esperamos que você tenha uma excelente experiência com nossos produtos.
                  Se tiver alguma dúvida ou feedback, não hesite em nos contatar.
                </p>
              </div>
            ` : ''}

            ${(status === 'returned' || status === 'cancelled') ? `
              <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #721c24;">📞 Precisa de Ajuda?</h4>
                <p style="margin: 0; color: #721c24;">
                  Se você tem alguma dúvida sobre este status ou precisa de assistência,
                  entre em contato conosco através do email suporte@jchairstudios62.com
                  ou pelo telefone +351 928 375 226.
                </p>
              </div>
            ` : ''}
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
      templateId: template || process.env.SENDGRID_STATUS_UPDATE_TEMPLATE_ID
    });

    console.log(`✅ Status update notification sent for order ${order.orderId} - ${status}`);
  } catch (error) {
    console.error('❌ Failed to send status update notification:', error);
    throw error;
  }
}