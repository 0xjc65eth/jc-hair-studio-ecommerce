import { NextRequest, NextResponse } from 'next/server';
import { OrderAnalytics } from '@/lib/analytics/OrderAnalytics';
import { connectDB } from '@/lib/mongodb';
import { cacheManager } from '@/lib/database/CacheManager';

/**
 * Dashboard Analytics API
 * Provides comprehensive business metrics for admin dashboard
 */

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as 'today' | '7d' | '30d' | '90d' || '30d';
    const cache = searchParams.get('cache') !== 'false'; // Default to using cache

    // Check if we should use cached data
    if (cache) {
      // You can implement Redis cache here later
      // For now, we'll proceed with fresh data
    }

    const cacheKey = `dashboard_metrics_${period}`;
    const dashboardMetrics = await cacheManager.cacheDashboard(
      cacheKey,
      () => OrderAnalytics.getDashboardMetrics(period)
    );

    // Set cache headers for browser caching
    const response = NextResponse.json({
      success: true,
      data: dashboardMetrics,
      timestamp: new Date().toISOString()
    });

    // Cache for 5 minutes
    response.headers.set('Cache-Control', 'public, max-age=300');

    return response;

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      period = '30d',
      customStartDate,
      customEndDate,
      includeRealTime = true,
      includeTrends = true
    } = body;

    let startDate: Date;
    let endDate: Date = new Date();

    if (customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
    } else {
      const days = {
        'today': 0,
        '7d': 7,
        '30d': 30,
        '90d': 90
      }[period] || 30;

      startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
    }

    const promises: Promise<any>[] = [
      OrderAnalytics.getDashboardMetrics(period)
    ];

    if (includeRealTime) {
      promises.push(OrderAnalytics.getRealTimeMetrics());
    }

    if (includeTrends) {
      promises.push(OrderAnalytics.getSeasonalTrends(6, 'month'));
    }

    const [dashboardMetrics, realTimeMetrics, seasonalTrends] = await Promise.all(promises);

    return NextResponse.json({
      success: true,
      data: {
        dashboard: dashboardMetrics,
        realTime: includeRealTime ? realTimeMetrics : null,
        trends: includeTrends ? seasonalTrends : null
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dashboard POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch custom dashboard metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}