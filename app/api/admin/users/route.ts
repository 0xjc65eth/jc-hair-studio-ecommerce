/**
 * Admin Users Management API
 * JC Hair Studio's 62 E-commerce
 *
 * Manages user accounts and customer data for admin panel
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { Order } from '@/lib/mongodb/schemas/order.schema';
import { withAdminAuth } from '@/lib/admin/auth-middleware';

async function getHandler(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const sortBy = searchParams.get('sortBy') || 'lastOrder';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    console.log(`📋 Admin users request - action: ${action}, page: ${page}, limit: ${limit}`);

    switch (action) {
      case 'list':
        return await getUsersList(limit, page, search, sortBy, sortOrder);
      case 'stats':
        return await getUsersStats();
      case 'profile':
        const userId = searchParams.get('id');
        if (!userId) {
          return NextResponse.json({ error: 'User ID required for profile action' }, { status: 400 });
        }
        return await getUserProfile(userId);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error in admin users API:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users data',
      details: error instanceof Error ? error.message : String(error),
      users: [],
      total: 0
    }, { status: 500 });
  }
}

async function getUsersList(limit: number, page: number, search?: string, sortBy?: string, sortOrder?: string) {
  try {
    // Build aggregation pipeline to get customer data from orders
    const pipeline: any[] = [
      {
        $group: {
          _id: '$customerInfo.email',
          firstName: { $first: '$customerInfo.firstName' },
          lastName: { $first: '$customerInfo.lastName' },
          phone: { $first: '$customerInfo.phone' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' },
          lastOrderStatus: { $last: '$status' },
          // Get order statuses
          pendingOrders: {
            $sum: {
              $cond: [{ $in: ['$status', ['pending', 'confirmed', 'processing']] }, 1, 0]
            }
          },
          completedOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0]
            }
          },
          cancelledOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0]
            }
          }
        }
      }
    ];

    // Add search filter if provided
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { _id: { $regex: search, $options: 'i' } } // email
          ]
        }
      });
    }

    // Add sorting
    const sortField = sortBy === 'name' ? 'firstName' :
                     sortBy === 'email' ? '_id' :
                     sortBy === 'totalSpent' ? 'totalSpent' :
                     sortBy === 'totalOrders' ? 'totalOrders' :
                     'lastOrder';

    pipeline.push({
      $sort: { [sortField]: sortOrder === 'desc' ? -1 : 1 }
    });

    // Add pagination
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const users = await Order.aggregate(pipeline);

    // Get total count for pagination
    const countPipeline = [
      {
        $group: {
          _id: '$customerInfo.email'
        }
      },
      {
        $count: 'total'
      }
    ];

    if (search) {
      countPipeline.splice(1, 0, {
        $match: {
          $or: [
            { 'customerInfo.firstName': { $regex: search, $options: 'i' } },
            { 'customerInfo.lastName': { $regex: search, $options: 'i' } },
            { 'customerInfo.email': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    const countResult = await Order.aggregate(countPipeline);
    const totalUsers = countResult[0]?.total || 0;

    // Transform data for frontend
    const transformedUsers = users.map(user => ({
      id: user._id, // email as ID
      email: user._id,
      firstName: user.firstName || 'N/A',
      lastName: user.lastName || 'N/A',
      fullName: `${user.firstName || 'Cliente'} ${user.lastName || ''}`.trim(),
      phone: user.phone || 'N/A',
      totalOrders: user.totalOrders,
      totalSpent: Math.round(user.totalSpent * 100) / 100,
      averageOrderValue: Math.round(user.averageOrderValue * 100) / 100,
      firstOrder: user.firstOrder,
      lastOrder: user.lastOrder,
      lastOrderStatus: user.lastOrderStatus,
      pendingOrders: user.pendingOrders,
      completedOrders: user.completedOrders,
      cancelledOrders: user.cancelledOrders,
      customerType: user.totalOrders > 3 ? 'VIP' : user.totalOrders > 1 ? 'Regular' : 'New',
      joinDate: user.firstOrder,
      status: 'active' // Default status
    }));

    console.log(`✅ Fetched ${transformedUsers.length} users (page ${page}/${Math.ceil(totalUsers / limit)})`);

    return NextResponse.json({
      success: true,
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        hasMore: skip + transformedUsers.length < totalUsers
      },
      filters: {
        search,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('❌ Error fetching users list:', error);
    throw error;
  }
}

async function getUsersStats() {
  try {
    // Get customer statistics from orders
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$customerInfo.email',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' }
        }
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          totalRevenue: { $sum: '$totalSpent' },
          averageLTV: { $avg: '$totalSpent' },
          averageOrders: { $avg: '$totalOrders' }
        }
      }
    ]);

    // Get new customers (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newCustomersCount = await Order.aggregate([
      {
        $group: {
          _id: '$customerInfo.email',
          firstOrder: { $min: '$createdAt' }
        }
      },
      {
        $match: {
          firstOrder: { $gte: thirtyDaysAgo }
        }
      },
      {
        $count: 'newCustomers'
      }
    ]);

    // Get returning customers
    const returningCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$customerInfo.email',
          orderCount: { $sum: 1 }
        }
      },
      {
        $match: {
          orderCount: { $gt: 1 }
        }
      },
      {
        $count: 'returningCustomers'
      }
    ]);

    const baseStats = stats[0] || {
      totalCustomers: 0,
      totalRevenue: 0,
      averageLTV: 0,
      averageOrders: 0
    };

    const newCustomers = newCustomersCount[0]?.newCustomers || 0;
    const returning = returningCustomers[0]?.returningCustomers || 0;

    console.log('✅ Generated users statistics');

    return NextResponse.json({
      success: true,
      stats: {
        totalCustomers: baseStats.totalCustomers,
        newCustomers,
        returningCustomers: returning,
        totalRevenue: Math.round(baseStats.totalRevenue * 100) / 100,
        averageLifetimeValue: Math.round(baseStats.averageLTV * 100) / 100,
        averageOrdersPerCustomer: Math.round(baseStats.averageOrders * 100) / 100,
        retentionRate: baseStats.totalCustomers > 0
          ? Math.round((returning / baseStats.totalCustomers) * 10000) / 100
          : 0,
        currency: 'EUR'
      }
    });

  } catch (error) {
    console.error('❌ Error fetching users stats:', error);
    throw error;
  }
}

async function getUserProfile(userId: string) {
  try {
    // Get detailed user profile from orders
    const userOrders = await Order.find({
      'customerInfo.email': userId
    }).sort({ createdAt: -1 });

    if (userOrders.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const latestOrder = userOrders[0];
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);

    const profile = {
      id: userId,
      email: userId,
      firstName: latestOrder.customerInfo.firstName || 'N/A',
      lastName: latestOrder.customerInfo.lastName || 'N/A',
      phone: latestOrder.customerInfo.phone || 'N/A',
      totalOrders: userOrders.length,
      totalSpent: Math.round(totalSpent * 100) / 100,
      averageOrderValue: Math.round((totalSpent / userOrders.length) * 100) / 100,
      firstOrderDate: userOrders[userOrders.length - 1].createdAt,
      lastOrderDate: userOrders[0].createdAt,
      lastOrderStatus: userOrders[0].status,
      orders: userOrders.map(order => ({
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        itemsCount: order.items.length
      }))
    };

    console.log(`✅ Retrieved profile for user: ${userId}`);

    return NextResponse.json({
      success: true,
      user: profile
    });

  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    throw error;
  }
}

// Export protected endpoint with admin authentication
export const GET = withAdminAuth(getHandler);