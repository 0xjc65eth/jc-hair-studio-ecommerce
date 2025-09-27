import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for webhook events (in production, this would be in a database)
const webhookEvents: Array<{
  id: string;
  timestamp: string;
  type: string;
  source: 'stripe' | 'sendgrid' | 'system';
  status: 'processed' | 'failed' | 'pending';
  data?: any;
  error?: string;
  processingTime?: number;
}> = [];

// Add some sample events for demonstration
webhookEvents.push(
  {
    id: 'wh_' + Math.random().toString(36).substr(2, 9),
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    type: 'payment_intent.succeeded',
    source: 'stripe',
    status: 'processed',
    data: { amount: 9999, currency: 'eur' },
    processingTime: 234
  },
  {
    id: 'wh_' + Math.random().toString(36).substr(2, 9),
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    type: 'processed',
    source: 'sendgrid',
    status: 'processed',
    data: { email: 'customer@example.com', event: 'delivered' },
    processingTime: 156
  },
  {
    id: 'wh_' + Math.random().toString(36).substr(2, 9),
    timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    type: 'checkout.session.completed',
    source: 'stripe',
    status: 'processed',
    data: { session_id: 'cs_test_123', amount_total: 9999 },
    processingTime: 445
  },
  {
    id: 'wh_' + Math.random().toString(36).substr(2, 9),
    timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    type: 'bounce',
    source: 'sendgrid',
    status: 'failed',
    data: { email: 'invalid@domain.com', reason: 'invalid_email' },
    error: 'Email address does not exist',
    processingTime: 89
  }
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const source = searchParams.get('source') as 'stripe' | 'sendgrid' | 'system' | null;
    const status = searchParams.get('status') as 'processed' | 'failed' | 'pending' | null;

    console.log('🔍 Fetching webhook events:', { limit, source, status });

    let filteredEvents = [...webhookEvents];

    // Filter by source if specified
    if (source) {
      filteredEvents = filteredEvents.filter(event => event.source === source);
    }

    // Filter by status if specified
    if (status) {
      filteredEvents = filteredEvents.filter(event => event.status === status);
    }

    // Sort by timestamp (newest first) and limit
    filteredEvents = filteredEvents
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    // Calculate statistics
    const stats = {
      total: webhookEvents.length,
      bySource: {
        stripe: webhookEvents.filter(e => e.source === 'stripe').length,
        sendgrid: webhookEvents.filter(e => e.source === 'sendgrid').length,
        system: webhookEvents.filter(e => e.source === 'system').length
      },
      byStatus: {
        processed: webhookEvents.filter(e => e.status === 'processed').length,
        failed: webhookEvents.filter(e => e.status === 'failed').length,
        pending: webhookEvents.filter(e => e.status === 'pending').length
      },
      last24Hours: webhookEvents.filter(e =>
        new Date(e.timestamp).getTime() > Date.now() - 86400000
      ).length,
      averageProcessingTime: webhookEvents
        .filter(e => e.processingTime)
        .reduce((sum, e) => sum + (e.processingTime || 0), 0) /
        webhookEvents.filter(e => e.processingTime).length || 0
    };

    console.log('✅ Webhook events fetched successfully:', {
      returned: filteredEvents.length,
      total: webhookEvents.length,
      filters: { source, status, limit }
    });

    return NextResponse.json({
      success: true,
      events: filteredEvents,
      stats,
      metadata: {
        timestamp: new Date().toISOString(),
        filters: { source, status, limit },
        hasMore: filteredEvents.length === limit && webhookEvents.length > limit
      }
    });

  } catch (error) {
    console.error('❌ Failed to fetch webhook events:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch webhook events',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, source, data, simulate = false } = body;

    if (!type || !source) {
      return NextResponse.json({
        error: 'Missing required fields: type and source'
      }, { status: 400 });
    }

    if (simulate) {
      // Add a simulated webhook event
      const simulatedEvent = {
        id: 'sim_' + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        type,
        source,
        status: Math.random() > 0.1 ? 'processed' as const : 'failed' as const,
        data: data || { simulated: true },
        processingTime: Math.floor(Math.random() * 500) + 100
      };

      if (simulatedEvent.status === 'failed') {
        simulatedEvent.error = 'Simulated webhook processing error';
      }

      webhookEvents.push(simulatedEvent);

      // Keep only last 500 events
      if (webhookEvents.length > 500) {
        webhookEvents.splice(0, webhookEvents.length - 500);
      }

      console.log('🎭 Simulated webhook event created:', {
        id: simulatedEvent.id,
        type: simulatedEvent.type,
        source: simulatedEvent.source,
        status: simulatedEvent.status
      });

      return NextResponse.json({
        success: true,
        message: 'Simulated webhook event created',
        event: simulatedEvent
      });
    }

    return NextResponse.json({
      error: 'Only simulated events are supported in debug mode'
    }, { status: 400 });

  } catch (error) {
    console.error('❌ Failed to create webhook event:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to create webhook event',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'clear') {
      const originalLength = webhookEvents.length;
      webhookEvents.length = 0;

      console.log('🧹 Webhook events cleared:', { originalLength });

      return NextResponse.json({
        success: true,
        message: `Cleared ${originalLength} webhook events`,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      error: 'Invalid action. Use ?action=clear to clear all events'
    }, { status: 400 });

  } catch (error) {
    console.error('❌ Failed to clear webhook events:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to clear webhook events',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}