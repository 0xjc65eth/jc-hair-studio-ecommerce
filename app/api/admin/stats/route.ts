/**
 * Admin Dashboard Stats API
 * JC Hair Studio's 62 E-commerce
 *
 * Provides comprehensive statistics for the admin dashboard
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
    const timezone = searchParams.get('timezone') || 'Europe/Lisbon';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period));

    console.log(`📊 Generating stats for period: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    // Parallel data fetching for better performance
    const [
      orderStats,
      productStats,
      revenueStats,
      customerStats
    ] = await Promise.all([
      getOrderStats(startDate, endDate),
      getProductStats(),
      getRevenueStats(startDate, endDate),
      getCustomerStats(startDate, endDate)
    ]);

    const statsData = {
      success: true,
      period: {
        days: parseInt(period),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        timezone
      },
      orders: orderStats,
      products: productStats,
      revenue: revenueStats,
      customers: customerStats,
      generatedAt: new Date().toISOString()
    };

    console.log('✅ Admin stats generated successfully');

    return NextResponse.json(statsData);

  } catch (error) {
    console.error('❌ Error generating admin stats:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to generate dashboard statistics',
      details: error instanceof Error ? error.message : String(error),
      // Provide fallback data
      orders: { total: 0, pending: 0, completed: 0, cancelled: 0 },
      products: { total: 0, active: 0, outOfStock: 0, featured: 0 },
      revenue: { total: 0, average: 0, growth: 0 },
      customers: { total: 0, new: 0, returning: 0 }
    }, { status: 500 });
  }
}

async function getOrderStats(startDate: Date, endDate: Date) {
  try {
    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const ordersByStatus = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusCounts = {
      total: totalOrders,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    ordersByStatus.forEach(item => {
      if (item._id in statusCounts) {
        statusCounts[item._id as keyof typeof statusCounts] = item.count;
      }
    });

    // Calculate completion rate
    const completed = statusCounts.delivered;
    const completionRate = totalOrders > 0 ? (completed / totalOrders) * 100 : 0;

    return {
      ...statusCounts,
      completionRate: Math.round(completionRate * 100) / 100
    };

  } catch (error) {
    console.error('❌ Error fetching order stats:', error);
    return { total: 0, pending: 0, completed: 0, cancelled: 0, completionRate: 0 };
  }
}

async function getProductStats() {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const featuredProducts = await Product.countDocuments({ featured: true });

    const outOfStockProducts = await Product.countDocuments({
      'stock.available': { $lte: 0 }
    });

    const lowStockProducts = await Product.countDocuments({
      'stock.available': { $gt: 0, $lte: 10 }
    });

    // Top categories
    const topCategories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return {
      total: totalProducts,
      active: activeProducts,
      featured: featuredProducts,
      outOfStock: outOfStockProducts,
      lowStock: lowStockProducts,
      topCategories
    };

  } catch (error) {
    console.error('❌ Error fetching product stats:', error);
    return {
      total: 0,
      active: 0,
      featured: 0,
      outOfStock: 0,
      lowStock: 0,
      topCategories: []
    };
  }
}

async function getRevenueStats(startDate: Date, endDate: Date) {
  try {
    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    const stats = revenueData[0] || {
      totalRevenue: 0,
      averageOrderValue: 0,
      orderCount: 0
    };

    // Calculate previous period for growth comparison
    const prevStartDate = new Date(startDate);
    const prevEndDate = new Date(endDate);
    const periodDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    prevStartDate.setDate(prevStartDate.getDate() - periodDays);
    prevEndDate.setDate(prevEndDate.getDate() - periodDays);

    const prevRevenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: prevStartDate, $lte: prevEndDate },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' }
        }
      }
    ]);

    const prevRevenue = prevRevenueData[0]?.totalRevenue || 0;
    const growth = prevRevenue > 0 ? ((stats.totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    return {
      total: Math.round(stats.totalRevenue * 100) / 100,
      average: Math.round(stats.averageOrderValue * 100) / 100,
      orderCount: stats.orderCount,
      growth: Math.round(growth * 100) / 100,
      currency: 'EUR'
    };

  } catch (error) {
    console.error('❌ Error fetching revenue stats:', error);
    return { total: 0, average: 0, orderCount: 0, growth: 0, currency: 'EUR' };
  }
}

async function getCustomerStats(startDate: Date, endDate: Date) {
  try {
    // Get unique customers from orders
    const customerData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$customerInfo.email',
          firstOrder: { $min: '$createdAt' },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$total' }
        }
      }
    ]);

    const totalCustomers = customerData.length;
    const newCustomers = customerData.filter(customer =>
      customer.firstOrder >= startDate
    ).length;

    const returningCustomers = customerData.filter(customer =>
      customer.orderCount > 1
    ).length;

    // Calculate customer lifetime value
    const averageLTV = customerData.length > 0
      ? customerData.reduce((sum, customer) => sum + customer.totalSpent, 0) / customerData.length
      : 0;

    return {
      total: totalCustomers,
      new: newCustomers,
      returning: returningCustomers,
      averageLTV: Math.round(averageLTV * 100) / 100,
      retentionRate: totalCustomers > 0 ? Math.round((returningCustomers / totalCustomers) * 10000) / 100 : 0
    };

  } catch (error) {
    console.error('❌ Error fetching customer stats:', error);
    return { total: 0, new: 0, returning: 0, averageLTV: 0, retentionRate: 0 };
  }
}

// Export protected endpoint with admin authentication
export const GET = withAdminAuth(getHandler);