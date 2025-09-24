import { NextRequest, NextResponse } from 'next/server';
import NotificationService, { NotificationData, NotificationEvent } from '@/lib/services/notificationService';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { event, data }: { event: NotificationEvent; data: NotificationData } = await request.json();

    if (!event || !data) {
      return NextResponse.json(
        { error: 'Missing required parameters: event and data' },
        { status: 400 }
      );
    }

    logger.info(`📧 API: Processing notification for event: ${event}`, {
      orderId: data.orderId,
      customerEmail: data.customerEmail
    });

    const results = await NotificationService.notify(event, data);

    return NextResponse.json({
      success: true,
      message: `Notifications processed for event: ${event}`,
      results: {
        clientNotification: results.clientNotification,
        companyNotification: results.companyNotification
      }
    });

  } catch (error) {
    logger.error('API: Failed to process notifications:', error);
    return NextResponse.json(
      { error: 'Failed to process notifications', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test');

    if (test === 'true') {
      logger.info('🧪 API: Starting test notifications...');
      await NotificationService.sendTestNotifications();

      return NextResponse.json({
        success: true,
        message: 'Test notifications sent successfully',
        note: 'Check the configured email addresses for test notifications'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Notification API is ready',
      availableEvents: [
        'order_created',
        'order_confirmed',
        'payment_confirmed',
        'order_processing',
        'order_shipped',
        'order_delivered',
        'order_cancelled',
        'order_refunded',
        'inventory_low',
        'inventory_out'
      ],
      testEndpoint: 'GET /api/notifications?test=true'
    });

  } catch (error) {
    logger.error('API: Failed to handle GET request:', error);
    return NextResponse.json(
      { error: 'Failed to handle request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}