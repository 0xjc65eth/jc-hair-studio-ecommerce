import { NextRequest, NextResponse } from 'next/server';
import { OrderAnalytics } from '@/lib/analytics/OrderAnalytics';
import { connectDB } from '@/lib/mongodb';

/**
 * Real-Time Analytics API
 * Provides live metrics for dashboard monitoring
 */

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const realTimeMetrics = await OrderAnalytics.getRealTimeMetrics();

    const response = NextResponse.json({
      success: true,
      data: realTimeMetrics,
      timestamp: new Date().toISOString()
    });

    // Set headers for real-time data (no caching)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error) {
    console.error('Real-Time Analytics API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch real-time metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Server-Sent Events endpoint for live updates
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { interval = 30000 } = body; // Default 30 seconds

    // This would typically be implemented with WebSockets or SSE
    // For now, return the current metrics with suggested polling interval
    const realTimeMetrics = await OrderAnalytics.getRealTimeMetrics();

    return NextResponse.json({
      success: true,
      data: realTimeMetrics,
      config: {
        pollInterval: interval,
        lastUpdate: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Real-Time Analytics POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to setup real-time metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}