/**
 * Admin Analytics API
 * JC Hair Studio's 62 E-commerce
 *
 * Provides detailed analytics and insights for the admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { Order } from '@/lib/mongodb/schemas/order.schema';
import { Product } from '@/lib/models/Product';
import { withAdminAuth } from '@/lib/admin/auth-middleware';

async function getHandler(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const type = searchParams.get('type') || 'overview';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period));

    console.log(`📈 Generating analytics - type: ${type}, period: ${period} days`);

    switch (type) {
      case 'overview':
        return await getOverviewAnalytics(startDate, endDate);
      case 'sales':
        return await getSalesAnalytics(startDate, endDate);
      case 'products':
        return await getProductAnalytics(startDate, endDate);
      case 'customers':
        return await getCustomerAnalytics(startDate, endDate);
      case 'trends':
        return await getTrendsAnalytics(startDate, endDate);
      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error generating analytics:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to generate analytics',
      details: error instanceof Error ? error.message : String(error),
      // Fallback data
      data: {
        sales: { total: 0, growth: 0 },
        orders: { total: 0, growth: 0 },
        customers: { total: 0, growth: 0 },
        products: { total: 0, topSelling: [] }
      }
    }, { status: 500 });
  }
}

async function getOverviewAnalytics(startDate: Date, endDate: Date) {
  try {
    const [salesData, ordersData, customersData, productsData] = await Promise.all([
      getSalesOverview(startDate, endDate),
      getOrdersOverview(startDate, endDate),
      getCustomersOverview(startDate, endDate),
      getProductsOverview()
    ]);

    return NextResponse.json({
      success: true,
      analytics: {
        period: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          days: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        },
        sales: salesData,
        orders: ordersData,
        customers: customersData,
        products: productsData,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error in overview analytics:', error);
    throw error;
  }
}

async function getSalesOverview(startDate: Date, endDate: Date) {
  // Current period sales
  const currentSales = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        paymentStatus: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$total' },
        count: { $sum: 1 },
        average: { $avg: '$total' }
      }
    }
  ]);

  // Previous period for comparison
  const periodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const prevStartDate = new Date(startDate);
  const prevEndDate = new Date(startDate);
  prevStartDate.setDate(prevStartDate.getDate() - periodDays);

  const previousSales = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: prevStartDate, $lte: prevEndDate },
        paymentStatus: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$total' }
      }
    }
  ]);

  const current = currentSales[0] || { total: 0, count: 0, average: 0 };
  const previous = previousSales[0] || { total: 0 };

  const growth = previous.total > 0 ? ((current.total - previous.total) / previous.total) * 100 : 0;

  return {
    total: Math.round(current.total * 100) / 100,
    orderCount: current.count,
    averageOrderValue: Math.round(current.average * 100) / 100,
    growth: Math.round(growth * 100) / 100,
    currency: 'EUR'
  };
}

async function getOrdersOverview(startDate: Date, endDate: Date) {
  const ordersData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const statusBreakdown = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };

  let total = 0;
  ordersData.forEach(item => {
    if (item._id in statusBreakdown) {
      statusBreakdown[item._id as keyof typeof statusBreakdown] = item.count;
      total += item.count;
    }
  });

  return {
    total,
    breakdown: statusBreakdown,
    completionRate: total > 0 ? Math.round((statusBreakdown.delivered / total) * 10000) / 100 : 0,
    cancellationRate: total > 0 ? Math.round((statusBreakdown.cancelled / total) * 10000) / 100 : 0
  };
}

async function getCustomersOverview(startDate: Date, endDate: Date) {
  const customerData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$customerInfo.email',
        orderCount: { $sum: 1 },
        totalSpent: { $sum: '$total' },
        firstOrder: { $min: '$createdAt' }
      }
    }
  ]);

  const newCustomers = customerData.filter(customer => customer.firstOrder >= startDate).length;
  const returningCustomers = customerData.filter(customer => customer.orderCount > 1).length;

  return {
    total: customerData.length,
    new: newCustomers,
    returning: returningCustomers,
    retentionRate: customerData.length > 0
      ? Math.round((returningCustomers / customerData.length) * 10000) / 100
      : 0
  };
}

async function getProductsOverview() {
  const totalProducts = await Product.countDocuments();
  const activeProducts = await Product.countDocuments({ status: 'active' });
  const outOfStock = await Product.countDocuments({ 'stock.available': { $lte: 0 } });

  return {
    total: totalProducts,
    active: activeProducts,
    outOfStock,
    stockRate: totalProducts > 0 ? Math.round(((totalProducts - outOfStock) / totalProducts) * 10000) / 100 : 0
  };
}

async function getSalesAnalytics(startDate: Date, endDate: Date) {
  try {
    // Daily sales trend
    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Sales by payment method
    const paymentMethodSales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: '$payments.0.method',
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      analytics: {
        dailyTrend: dailySales,
        paymentMethods: paymentMethodSales,
        period: { startDate, endDate }
      }
    });

  } catch (error) {
    console.error('❌ Error in sales analytics:', error);
    throw error;
  }
}

async function getProductAnalytics(startDate: Date, endDate: Date) {
  try {
    // Top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: 'completed'
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.totalPrice' },
          averagePrice: { $avg: '$items.unitPrice' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    // Sales by category
    const categorySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: 'completed'
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$product.category',
          totalRevenue: { $sum: '$items.totalPrice' },
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      analytics: {
        topProducts,
        categorySales,
        period: { startDate, endDate }
      }
    });

  } catch (error) {
    console.error('❌ Error in product analytics:', error);
    throw error;
  }
}

async function getCustomerAnalytics(startDate: Date, endDate: Date) {
  try {
    // Customer lifetime value distribution
    const customerLTV = await Order.aggregate([
      {
        $group: {
          _id: '$customerInfo.email',
          totalSpent: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $bucket: {
          groupBy: '$totalSpent',
          boundaries: [0, 50, 100, 200, 500, 1000, 10000],
          default: '1000+',
          output: {
            count: { $sum: 1 },
            averageOrders: { $avg: '$orderCount' }
          }
        }
      }
    ]);

    // Customer acquisition trend
    const acquisitionTrend = await Order.aggregate([
      {
        $group: {
          _id: {
            email: '$customerInfo.email',
            firstOrderDate: { $min: '$createdAt' }
          }
        }
      },
      {
        $match: {
          '_id.firstOrderDate': { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$_id.firstOrderDate" } },
          newCustomers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({
      success: true,
      analytics: {
        lifetimeValueDistribution: customerLTV,
        acquisitionTrend,
        period: { startDate, endDate }
      }
    });

  } catch (error) {
    console.error('❌ Error in customer analytics:', error);
    throw error;
  }
}

async function getTrendsAnalytics(startDate: Date, endDate: Date) {
  try {
    // Weekly trends
    const weeklyTrends = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            week: { $week: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, '$total', 0] } },
          customers: { $addToSet: '$customerInfo.email' }
        }
      },
      {
        $addFields: {
          uniqueCustomers: { $size: '$customers' }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } }
    ]);

    return NextResponse.json({
      success: true,
      analytics: {
        weeklyTrends: weeklyTrends.map(trend => ({
          period: `${trend._id.year}-W${trend._id.week}`,
          orders: trend.orders,
          revenue: Math.round(trend.revenue * 100) / 100,
          customers: trend.uniqueCustomers
        })),
        period: { startDate, endDate }
      }
    });

  } catch (error) {
    console.error('❌ Error in trends analytics:', error);
    throw error;
  }
}

// Export protected endpoint with admin authentication
export const GET = withAdminAuth(getHandler);