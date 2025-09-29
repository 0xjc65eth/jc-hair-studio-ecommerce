import { NextRequest, NextResponse } from 'next/server';
import { OrderAnalytics } from '@/lib/analytics/OrderAnalytics';
import { connectDB } from '@/lib/mongodb';
import { subDays } from 'date-fns';

/**
 * Customer Analytics API
 * Provides customer behavior analysis and segmentation
 */

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const includeSegmentation = searchParams.get('segmentation') !== 'false';
    const includeCohort = searchParams.get('cohort') === 'true';

    let startDate: Date;
    let endDate: Date = new Date();

    // Parse period
    const days = {
      'today': 0,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[period] || 30;

    if (days === 0) {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = subDays(endDate, days);
    }

    const promises: Promise<any>[] = [
      OrderAnalytics.getCustomerBehaviorMetrics(startDate, endDate)
    ];

    if (includeSegmentation) {
      promises.push(OrderAnalytics.getCustomerSegmentation());
    }

    if (includeCohort) {
      promises.push(OrderAnalytics.getCohortAnalysis(12));
    }

    const [behaviorMetrics, segmentation, cohortAnalysis] = await Promise.all(promises);

    // Calculate segment distribution if segmentation is included
    let segmentDistribution = null;
    if (includeSegmentation && segmentation) {
      segmentDistribution = segmentation.reduce((acc: any, customer: any) => {
        acc[customer.segment] = (acc[customer.segment] || 0) + 1;
        return acc;
      }, {});
    }

    const response = {
      success: true,
      data: {
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        behavior: behaviorMetrics,
        segmentation: includeSegmentation ? {
          customers: segmentation?.slice(0, 100), // Limit to first 100 for performance
          distribution: segmentDistribution,
          total: segmentation?.length || 0
        } : null,
        cohort: includeCohort ? cohortAnalysis : null
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Customer Analytics API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch customer analytics',
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
      startDate: customStartDate,
      endDate: customEndDate,
      segmentFilters = {},
      includeDetailed = false
    } = body;

    const startDate = new Date(customStartDate);
    const endDate = new Date(customEndDate);

    const segmentation = await OrderAnalytics.getCustomerSegmentation();

    // Apply filters if provided
    let filteredSegmentation = segmentation;
    if (Object.keys(segmentFilters).length > 0) {
      filteredSegmentation = segmentation.filter(customer => {
        return Object.entries(segmentFilters).every(([key, value]) => {
          if (key === 'segment') return customer.segment === value;
          if (key === 'customerType') return customer.customerType === value;
          if (key === 'minSpent') return customer.totalSpent >= (value as number);
          if (key === 'maxSpent') return customer.totalSpent <= (value as number);
          if (key === 'minOrders') return customer.totalOrders >= (value as number);
          return true;
        });
      });
    }

    // Sort by total spent descending
    filteredSegmentation.sort((a, b) => b.totalSpent - a.totalSpent);

    const response = {
      success: true,
      data: {
        filters: segmentFilters,
        customers: includeDetailed ? filteredSegmentation : filteredSegmentation.slice(0, 50),
        total: filteredSegmentation.length,
        summary: {
          totalSpent: filteredSegmentation.reduce((sum, c) => sum + c.totalSpent, 0),
          totalOrders: filteredSegmentation.reduce((sum, c) => sum + c.totalOrders, 0),
          averageSpent: filteredSegmentation.reduce((sum, c) => sum + c.totalSpent, 0) / filteredSegmentation.length || 0,
          segmentDistribution: filteredSegmentation.reduce((acc: any, customer) => {
            acc[customer.segment] = (acc[customer.segment] || 0) + 1;
            return acc;
          }, {})
        }
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Customer Analytics POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch filtered customer analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}