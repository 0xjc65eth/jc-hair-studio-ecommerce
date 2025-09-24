import { NextRequest, NextResponse } from 'next/server';
import PersistentNotificationLogger from '@/lib/services/persistentNotificationLogger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '50');
    const event = searchParams.get('event');
    const orderId = searchParams.get('orderId');

    switch (action) {
      case 'stats':
        return NextResponse.json({
          success: true,
          data: PersistentNotificationLogger.getStats()
        });

      case 'by-event':
        if (!event) {
          return NextResponse.json(
            { error: 'Event parameter is required for by-event action' },
            { status: 400 }
          );
        }
        return NextResponse.json({
          success: true,
          data: PersistentNotificationLogger.getLogsByEvent(event, limit)
        });

      case 'by-order':
        if (!orderId) {
          return NextResponse.json(
            { error: 'OrderId parameter is required for by-order action' },
            { status: 400 }
          );
        }
        return NextResponse.json({
          success: true,
          data: PersistentNotificationLogger.getLogsByOrder(orderId)
        });

      default:
        // Return all logs
        return NextResponse.json({
          success: true,
          data: {
            logs: PersistentNotificationLogger.getLogs(limit),
            stats: PersistentNotificationLogger.getStats()
          }
        });
    }

  } catch (error) {
    console.error('Error fetching notification logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification logs' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'clear') {
      PersistentNotificationLogger.clearLogs();
      return NextResponse.json({
        success: true,
        message: 'All notification logs cleared'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use ?action=clear to clear logs' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error clearing notification logs:', error);
    return NextResponse.json(
      { error: 'Failed to clear notification logs' },
      { status: 500 }
    );
  }
}