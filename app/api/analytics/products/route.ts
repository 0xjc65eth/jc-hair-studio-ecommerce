import { NextRequest, NextResponse } from 'next/server';
import { OrderAnalytics } from '@/lib/analytics/OrderAnalytics';
import { connectDB } from '@/lib/mongodb';
import { subDays } from 'date-fns';

/**
 * Product Analytics API
 * Provides product performance analysis and inventory insights
 */

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const includeInventory = searchParams.get('inventory') === 'true';

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
      OrderAnalytics.getTopProducts(startDate, endDate, limit)
    ];

    if (includeInventory) {
      promises.push(OrderAnalytics.getInventoryInsights(startDate, endDate));
    }

    const [topProducts, inventoryInsights] = await Promise.all(promises);

    // Filter by category and brand if specified
    let filteredProducts = topProducts;
    if (category) {
      filteredProducts = filteredProducts.filter((p: any) => p.category === category);
    }
    if (brand) {
      filteredProducts = filteredProducts.filter((p: any) => p.brand === brand);
    }

    // Get category and brand analytics
    const categoryAnalytics = topProducts.reduce((acc: any, product: any) => {
      if (!product.category) return acc;

      if (!acc[product.category]) {
        acc[product.category] = {
          totalRevenue: 0,
          totalQuantity: 0,
          productCount: 0
        };
      }

      acc[product.category].totalRevenue += product.totalRevenue;
      acc[product.category].totalQuantity += product.totalQuantity;
      acc[product.category].productCount += 1;

      return acc;
    }, {});

    const brandAnalytics = topProducts.reduce((acc: any, product: any) => {
      if (!product.brand) return acc;

      if (!acc[product.brand]) {
        acc[product.brand] = {
          totalRevenue: 0,
          totalQuantity: 0,
          productCount: 0
        };
      }

      acc[product.brand].totalRevenue += product.totalRevenue;
      acc[product.brand].totalQuantity += product.totalQuantity;
      acc[product.brand].productCount += 1;

      return acc;
    }, {});

    const response = {
      success: true,
      data: {
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        products: filteredProducts,
        analytics: {
          categories: Object.entries(categoryAnalytics)
            .map(([name, data]: [string, any]) => ({
              name,
              ...data,
              averagePrice: data.totalRevenue / data.totalQuantity
            }))
            .sort((a, b) => b.totalRevenue - a.totalRevenue),
          brands: Object.entries(brandAnalytics)
            .map(([name, data]: [string, any]) => ({
              name,
              ...data,
              averagePrice: data.totalRevenue / data.totalQuantity
            }))
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
        },
        inventory: includeInventory ? {
          insights: inventoryInsights?.slice(0, 50),
          fastMoving: inventoryInsights?.filter((item: any) => item.velocity > 1).slice(0, 10),
          slowMoving: inventoryInsights?.filter((item: any) => item.velocity < 0.1).slice(0, 10)
        } : null
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Product Analytics API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product analytics',
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
      filters = {},
      sortBy = 'totalRevenue',
      sortOrder = 'desc',
      limit = 50
    } = body;

    const startDate = new Date(customStartDate);
    const endDate = new Date(customEndDate);

    const [topProducts, inventoryInsights] = await Promise.all([
      OrderAnalytics.getTopProducts(startDate, endDate, 1000), // Get more data for filtering
      OrderAnalytics.getInventoryInsights(startDate, endDate)
    ]);

    // Apply filters
    let filteredProducts = topProducts;
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    if (filters.brand) {
      filteredProducts = filteredProducts.filter(p => p.brand === filters.brand);
    }
    if (filters.minRevenue) {
      filteredProducts = filteredProducts.filter(p => p.totalRevenue >= filters.minRevenue);
    }
    if (filters.minQuantity) {
      filteredProducts = filteredProducts.filter(p => p.totalQuantity >= filters.minQuantity);
    }

    // Sort results
    filteredProducts.sort((a: any, b: any) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    // Limit results
    filteredProducts = filteredProducts.slice(0, limit);

    // Calculate summary statistics
    const summary = {
      totalProducts: filteredProducts.length,
      totalRevenue: filteredProducts.reduce((sum, p) => sum + p.totalRevenue, 0),
      totalQuantity: filteredProducts.reduce((sum, p) => sum + p.totalQuantity, 0),
      averagePrice: filteredProducts.reduce((sum, p) => sum + p.averagePrice, 0) / filteredProducts.length || 0
    };

    const response = {
      success: true,
      data: {
        products: filteredProducts,
        summary,
        filters,
        sort: { by: sortBy, order: sortOrder }
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Product Analytics POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch filtered product analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}