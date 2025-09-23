import { NextRequest, NextResponse } from 'next/server';
import { DataExporter } from '@/lib/data-management/DataExporter';
import { connectDB } from '@/lib/mongodb';

/**
 * Data Export API
 * Provides endpoints for exporting orders, customers, and analytics data
 */

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      exportType = 'orders',
      format = 'csv',
      startDate,
      endDate,
      filters = {},
      includeCustomerData = true,
      includeProductData = true,
      includeFinancialData = true,
      includePII = false,
      anonymize = false
    } = body;

    let result;

    switch (exportType) {
      case 'orders':
        result = await DataExporter.exportOrders({
          format,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          filters,
          includeCustomerData,
          includeProductData,
          includeFinancialData
        });
        break;

      case 'customers':
        result = await DataExporter.exportCustomers({
          format,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          includePII,
          anonymize
        });
        break;

      case 'analytics':
        const analyticsType = body.analyticsType || 'revenue';
        result = await DataExporter.exportAnalytics(analyticsType, {
          format,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined
        });
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported export type: ${exportType}`
          },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error
        },
        { status: 400 }
      );
    }

    // Set appropriate headers for file download
    const headers = new Headers();

    if (format === 'csv') {
      headers.set('Content-Type', 'text/csv');
    } else if (format === 'excel') {
      headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    } else if (format === 'json') {
      headers.set('Content-Type', 'application/json');
    }

    headers.set('Content-Disposition', `attachment; filename="${result.filename}"`);
    headers.set('Content-Length', result.size.toString());

    return new NextResponse(result.data, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Export API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exportType = searchParams.get('type') || 'orders';
    const format = searchParams.get('format') || 'csv';
    const period = searchParams.get('period') || '30d';

    // Calculate date range based on period
    let startDate: Date;
    let endDate: Date = new Date();

    switch (period) {
      case 'today':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case '7d':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
    }

    let result;

    switch (exportType) {
      case 'orders':
        result = await DataExporter.exportOrders({
          format: format as any,
          startDate,
          endDate
        });
        break;

      case 'customers':
        result = await DataExporter.exportCustomers({
          format: format as any,
          startDate,
          endDate,
          anonymize: true // Default to anonymized for GET requests
        });
        break;

      case 'analytics':
        result = await DataExporter.exportAnalytics('revenue', {
          format: format as any,
          startDate,
          endDate
        });
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported export type: ${exportType}`
          },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error
        },
        { status: 400 }
      );
    }

    // Set appropriate headers
    const headers = new Headers();

    if (format === 'csv') {
      headers.set('Content-Type', 'text/csv');
    } else if (format === 'excel') {
      headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    } else if (format === 'json') {
      headers.set('Content-Type', 'application/json');
    }

    headers.set('Content-Disposition', `attachment; filename="${result.filename}"`);

    return new NextResponse(result.data, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Export GET API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}