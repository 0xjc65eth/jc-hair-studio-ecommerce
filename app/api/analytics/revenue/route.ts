import { NextRequest, NextResponse } from 'next/server';
import { OrderAnalytics } from '@/lib/analytics/OrderAnalytics';
import { connectDB } from '@/lib/mongodb';
import { subDays, subWeeks, subMonths } from 'date-fns';

/**
 * Revenue Analytics API
 * Provides detailed revenue analysis and trends
 */

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const groupBy = searchParams.get('groupBy') as 'day' | 'week' | 'month' || 'day';
    const compare = searchParams.get('compare') === 'true';

    let startDate: Date;
    let endDate: Date = new Date();

    // Parse period
    switch (period) {
      case 'today':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case '7d':
        startDate = subDays(endDate, 7);
        break;
      case '30d':
        startDate = subDays(endDate, 30);
        break;
      case '90d':
        startDate = subDays(endDate, 90);
        break;
      case '1y':
        startDate = subDays(endDate, 365);
        break;
      default:
        startDate = subDays(endDate, 30);
    }

    const promises: Promise<any>[] = [
      OrderAnalytics.getRevenueAnalytics(startDate, endDate, groupBy),
      OrderAnalytics.getTotalRevenue(startDate, endDate)
    ];

    // Add comparison data if requested
    if (compare) {
      const periodLength = endDate.getTime() - startDate.getTime();
      const compareStartDate = new Date(startDate.getTime() - periodLength);
      const compareEndDate = new Date(startDate.getTime());

      promises.push(
        OrderAnalytics.getRevenueAnalytics(compareStartDate, compareEndDate, groupBy),
        OrderAnalytics.getTotalRevenue(compareStartDate, compareEndDate)
      );
    }

    const [revenueData, totalRevenue, compareData, compareTotalRevenue] = await Promise.all(promises);

    const response = {
      success: true,
      data: {
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          groupBy
        },
        revenue: revenueData,
        summary: totalRevenue,
        comparison: compare ? {
          revenue: compareData,
          summary: compareTotalRevenue,
          growth: {
            revenue: ((totalRevenue.totalRevenue - compareTotalRevenue.totalRevenue) / compareTotalRevenue.totalRevenue) * 100,
            orders: ((totalRevenue.orderCount - compareTotalRevenue.orderCount) / compareTotalRevenue.orderCount) * 100,
            aov: ((totalRevenue.averageOrderValue - compareTotalRevenue.averageOrderValue) / compareTotalRevenue.averageOrderValue) * 100
          }
        } : null
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Revenue Analytics API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch revenue analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}