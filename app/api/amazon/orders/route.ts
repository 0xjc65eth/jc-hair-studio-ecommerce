import { NextRequest, NextResponse } from 'next/server';
import { amazonMarketplaceService } from '@/lib/amazon/marketplace-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate) {
      return NextResponse.json(
        { error: 'startDate parameter is required (YYYY-MM-DD format)' },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate)) {
      return NextResponse.json(
        { error: 'startDate must be in YYYY-MM-DD format' },
        { status: 400 }
      );
    }

    if (endDate && !dateRegex.test(endDate)) {
      return NextResponse.json(
        { error: 'endDate must be in YYYY-MM-DD format' },
        { status: 400 }
      );
    }

    // Convert to ISO format for Amazon API
    const startDateTime = `${startDate}T00:00:00Z`;
    const endDateTime = endDate ? `${endDate}T23:59:59Z` : undefined;

    const orders = await amazonMarketplaceService.getAmazonOrders(startDateTime, endDateTime);

    return NextResponse.json({
      success: true,
      orders: orders.payload?.Orders || [],
      pagination: {
        nextToken: orders.payload?.NextToken || null,
        total: orders.payload?.Orders?.length || 0
      },
      dateRange: {
        start: startDateTime,
        end: endDateTime || 'now'
      }
    });

  } catch (error) {
    console.error('Amazon orders API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch Amazon orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}