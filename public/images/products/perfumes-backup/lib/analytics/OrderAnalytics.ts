import { Order } from '../models/Order';
import { startOfDay, endOfDay, subDays, subWeeks, subMonths, format } from 'date-fns';

/**
 * Comprehensive Order Analytics System
 * Provides business intelligence and insights for e-commerce operations
 */

export interface RevenueMetrics {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  period: string;
}

export interface ProductAnalytics {
  productId: string;
  productName: string;
  category: string;
  brand: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
  averagePrice: number;
}

export interface CustomerSegment {
  customerId: string;
  email: string;
  customerType: 'retail' | 'professional';
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  firstOrder: Date;
  lastOrder: Date;
  customerLifetime: number;
  segment: 'New' | 'Repeat' | 'Loyal' | 'VIP';
}

export interface GeographicInsight {
  state: string;
  city: string;
  orderCount: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface ConversionFunnelData {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  paymentConversionRate: number;
  fulfillmentRate: number;
  cancellationRate: number;
}

export interface SeasonalTrend {
  period: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  growthRate: number;
}

export interface CustomerBehavior {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerRetentionRate: number;
  averageCustomerLifetimeValue: number;
  averageOrdersPerCustomer: number;
}

export interface PaymentMethodAnalytics {
  method: string;
  orderCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
}

export interface ShippingAnalytics {
  method: string;
  orderCount: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  averageShippingCost: number;
}

export class OrderAnalytics {
  /**
   * Get revenue analytics for a specific period
   */
  static async getRevenueAnalytics(
    startDate: Date = subDays(new Date(), 30),
    endDate: Date = new Date(),
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<RevenueMetrics[]> {
    try {
      const results = await Order.getRevenueByPeriod(startDate, endDate, groupBy);
      return results.map(result => ({
        period: result._id,
        totalRevenue: result.totalRevenue,
        orderCount: result.orderCount,
        averageOrderValue: result.averageOrderValue
      }));
    } catch (error) {
      console.error('Error getting revenue analytics:', error);
      throw new Error('Failed to retrieve revenue analytics');
    }
  }

  /**
   * Get comprehensive dashboard metrics
   */
  static async getDashboardMetrics(period: 'today' | '7d' | '30d' | '90d' = '30d') {
    const endDate = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = startOfDay(endDate);
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
    }

    try {
      const [
        revenue,
        topProducts,
        conversionFunnel,
        geographic,
        customerBehavior
      ] = await Promise.all([
        this.getTotalRevenue(startDate, endDate),
        this.getTopProducts(startDate, endDate, 5),
        this.getConversionFunnel(startDate, endDate),
        this.getGeographicDistribution(startDate, endDate),
        this.getCustomerBehaviorMetrics(startDate, endDate)
      ]);

      return {
        period,
        revenue,
        topProducts,
        conversionFunnel,
        geographic: geographic.slice(0, 10),
        customerBehavior,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      throw new Error('Failed to retrieve dashboard metrics');
    }
  }

  /**
   * Get total revenue for a period
   */
  static async getTotalRevenue(startDate: Date, endDate: Date) {
    try {
      const result = await Order.aggregate([
        {
          $match: {
            'timestamps.createdAt': { $gte: startDate, $lte: endDate },
            'payment.status': 'paid'
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$pricing.total' },
            orderCount: { $sum: 1 },
            averageOrderValue: { $avg: '$pricing.total' },
            totalItems: { $sum: { $sum: '$products.quantity' } }
          }
        }
      ]);

      return result[0] || {
        totalRevenue: 0,
        orderCount: 0,
        averageOrderValue: 0,
        totalItems: 0
      };
    } catch (error) {
      console.error('Error getting total revenue:', error);
      throw new Error('Failed to retrieve total revenue');
    }
  }

  /**
   * Get top performing products
   */
  static async getTopProducts(
    startDate: Date = subDays(new Date(), 30),
    endDate: Date = new Date(),
    limit: number = 10
  ): Promise<ProductAnalytics[]> {
    try {
      const results = await Order.getTopProducts(startDate, endDate, limit);
      return results.map(result => ({
        productId: result._id,
        productName: result.productName,
        category: result.category,
        brand: result.brand,
        totalQuantity: result.totalQuantity,
        totalRevenue: result.totalRevenue,
        orderCount: result.orderCount,
        averagePrice: result.totalRevenue / result.totalQuantity
      }));
    } catch (error) {
      console.error('Error getting top products:', error);
      throw new Error('Failed to retrieve top products');
    }
  }

  /**
   * Get customer segmentation analysis
   */
  static async getCustomerSegmentation(): Promise<CustomerSegment[]> {
    try {
      const results = await Order.getCustomerSegmentation();
      return results.map(result => ({
        customerId: result._id,
        email: result._id,
        customerType: result.customerType,
        totalOrders: result.totalOrders,
        totalSpent: result.totalSpent,
        averageOrderValue: result.averageOrderValue,
        firstOrder: result.firstOrder,
        lastOrder: result.lastOrder,
        customerLifetime: result.customerLifetime,
        segment: result.segment
      }));
    } catch (error) {
      console.error('Error getting customer segmentation:', error);
      throw new Error('Failed to retrieve customer segmentation');
    }
  }

  /**
   * Get geographic distribution of orders
   */
  static async getGeographicDistribution(
    startDate: Date = subDays(new Date(), 30),
    endDate: Date = new Date()
  ): Promise<GeographicInsight[]> {
    try {
      const results = await Order.getGeographicDistribution(startDate, endDate);
      return results.map(result => ({
        state: result._id.state,
        city: result._id.city,
        orderCount: result.orderCount,
        totalRevenue: result.totalRevenue,
        averageOrderValue: result.averageOrderValue
      }));
    } catch (error) {
      console.error('Error getting geographic distribution:', error);
      throw new Error('Failed to retrieve geographic distribution');
    }
  }

  /**
   * Get conversion funnel analysis
   */
  static async getConversionFunnel(
    startDate: Date = subDays(new Date(), 30),
    endDate: Date = new Date()
  ): Promise<ConversionFunnelData> {
    try {
      const results = await Order.getConversionFunnel(startDate, endDate);
      return results[0] || {
        totalOrders: 0,
        pendingOrders: 0,
        paidOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        paymentConversionRate: 0,
        fulfillmentRate: 0,
        cancellationRate: 0
      };
    } catch (error) {
      console.error('Error getting conversion funnel:', error);
      throw new Error('Failed to retrieve conversion funnel');
    }
  }

  /**
   * Get seasonal trends analysis
   */
  static async getSeasonalTrends(
    months: number = 12,
    groupBy: 'month' | 'quarter' = 'month'
  ): Promise<SeasonalTrend[]> {
    const endDate = new Date();
    const startDate = subMonths(endDate, months);

    try {
      const results = await this.getRevenueAnalytics(startDate, endDate, 'month');

      // Calculate growth rates
      return results.map((current, index) => {
        const previous = results[index - 1];
        const growthRate = previous
          ? ((current.totalRevenue - previous.totalRevenue) / previous.totalRevenue) * 100
          : 0;

        return {
          period: current.period,
          revenue: current.totalRevenue,
          orders: current.orderCount,
          averageOrderValue: current.averageOrderValue,
          growthRate
        };
      });
    } catch (error) {
      console.error('Error getting seasonal trends:', error);
      throw new Error('Failed to retrieve seasonal trends');
    }
  }

  /**
   * Get customer behavior metrics
   */
  static async getCustomerBehaviorMetrics(
    startDate: Date = subDays(new Date(), 30),
    endDate: Date = new Date()
  ): Promise<CustomerBehavior> {
    try {
      const [currentPeriod, previousPeriod] = await Promise.all([
        Order.aggregate([
          {
            $match: {
              'timestamps.createdAt': { $gte: startDate, $lte: endDate },
              'payment.status': 'paid'
            }
          },
          {
            $group: {
              _id: '$customer.email',
              orderCount: { $sum: 1 },
              totalSpent: { $sum: '$pricing.total' },
              firstOrderInPeriod: { $min: '$timestamps.createdAt' }
            }
          }
        ]),
        Order.aggregate([
          {
            $match: {
              'timestamps.createdAt': { $lt: startDate },
              'payment.status': 'paid'
            }
          },
          {
            $group: {
              _id: '$customer.email',
              hasOrdersBefore: { $sum: 1 }
            }
          }
        ])
      ]);

      const previousCustomers = new Set(previousPeriod.map(p => p._id));
      const newCustomers = currentPeriod.filter(c => !previousCustomers.has(c._id)).length;
      const returningCustomers = currentPeriod.filter(c => previousCustomers.has(c._id)).length;
      const totalCustomers = currentPeriod.length;

      const customerRetentionRate = totalCustomers > 0
        ? (returningCustomers / totalCustomers) * 100
        : 0;

      const averageCustomerLifetimeValue = currentPeriod.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers || 0;
      const averageOrdersPerCustomer = currentPeriod.reduce((sum, c) => sum + c.orderCount, 0) / totalCustomers || 0;

      return {
        totalCustomers,
        newCustomers,
        returningCustomers,
        customerRetentionRate,
        averageCustomerLifetimeValue,
        averageOrdersPerCustomer
      };
    } catch (error) {
      console.error('Error getting customer behavior metrics:', error);
      throw new Error('Failed to retrieve customer behavior metrics');
    }
  }

  /**
   * Get payment method analytics
   */
  static async getPaymentMethodAnalytics(
    startDate: Date = subDays(new Date(), 30),
    endDate: Date = new Date()
  ): Promise<PaymentMethodAnalytics[]> {
    try {
      const results = await Order.aggregate([
        {
          $match: {
            'timestamps.createdAt': { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$payment.method',
            totalOrders: { $sum: 1 },
            paidOrders: {
              $sum: { $cond: [{ $eq: ['$payment.status', 'paid'] }, 1, 0] }
            },
            totalRevenue: {
              $sum: { $cond: [{ $eq: ['$payment.status', 'paid'] }, '$pricing.total', 0] }
            }
          }
        },
        {
          $project: {
            method: '$_id',
            orderCount: '$paidOrders',
            totalRevenue: 1,
            averageOrderValue: { $divide: ['$totalRevenue', '$paidOrders'] },
            conversionRate: { $multiply: [{ $divide: ['$paidOrders', '$totalOrders'] }, 100] }
          }
        },
        { $sort: { totalRevenue: -1 } }
      ]);

      return results.map(result => ({
        method: result.method,
        orderCount: result.orderCount,
        totalRevenue: result.totalRevenue,
        averageOrderValue: result.averageOrderValue || 0,
        conversionRate: result.conversionRate || 0
      }));
    } catch (error) {
      console.error('Error getting payment method analytics:', error);
      throw new Error('Failed to retrieve payment method analytics');
    }
  }

  /**
   * Get shipping method analytics
   */
  static async getShippingAnalytics(
    startDate: Date = subDays(new Date(), 30),
    endDate: Date = new Date()
  ): Promise<ShippingAnalytics[]> {
    try {
      const results = await Order.aggregate([
        {
          $match: {
            'timestamps.createdAt': { $gte: startDate, $lte: endDate },
            'payment.status': 'paid'
          }
        },
        {
          $group: {
            _id: '$shipping.method',
            orderCount: { $sum: 1 },
            totalShippingCost: { $sum: '$shipping.shippingCost' },
            deliveredOrders: {
              $sum: { $cond: [{ $eq: ['$shipping.status', 'delivered'] }, 1, 0] }
            },
            totalDeliveryTime: {
              $sum: {
                $cond: [
                  { $and: [
                    { $ne: ['$shipping.actualDelivery', null] },
                    { $ne: ['$timestamps.createdAt', null] }
                  ]},
                  { $divide: [
                    { $subtract: ['$shipping.actualDelivery', '$timestamps.createdAt'] },
                    1000 * 60 * 60 * 24
                  ]},
                  0
                ]
              }
            }
          }
        },
        {
          $project: {
            method: '$_id',
            orderCount: 1,
            averageShippingCost: { $divide: ['$totalShippingCost', '$orderCount'] },
            onTimeDeliveryRate: { $multiply: [{ $divide: ['$deliveredOrders', '$orderCount'] }, 100] },
            averageDeliveryTime: { $divide: ['$totalDeliveryTime', '$deliveredOrders'] }
          }
        },
        { $sort: { orderCount: -1 } }
      ]);

      return results.map(result => ({
        method: result.method,
        orderCount: result.orderCount,
        averageDeliveryTime: result.averageDeliveryTime || 0,
        onTimeDeliveryRate: result.onTimeDeliveryRate || 0,
        averageShippingCost: result.averageShippingCost || 0
      }));
    } catch (error) {
      console.error('Error getting shipping analytics:', error);
      throw new Error('Failed to retrieve shipping analytics');
    }
  }

  /**
   * Get cohort analysis for customer retention
   */
  static async getCohortAnalysis(months: number = 12) {
    const endDate = new Date();
    const startDate = subMonths(endDate, months);

    try {
      const results = await Order.aggregate([
        {
          $match: {
            'timestamps.createdAt': { $gte: startDate, $lte: endDate },
            'payment.status': 'paid'
          }
        },
        {
          $group: {
            _id: '$customer.email',
            firstOrder: { $min: '$timestamps.createdAt' },
            orders: { $push: '$timestamps.createdAt' }
          }
        },
        {
          $project: {
            email: '$_id',
            firstOrderMonth: {
              $dateToString: { format: "%Y-%m", date: "$firstOrder" }
            },
            orderMonths: {
              $map: {
                input: '$orders',
                as: 'order',
                in: { $dateToString: { format: "%Y-%m", date: "$$order" } }
              }
            }
          }
        },
        {
          $unwind: '$orderMonths'
        },
        {
          $group: {
            _id: {
              cohort: '$firstOrderMonth',
              month: '$orderMonths'
            },
            customers: { $addToSet: '$email' }
          }
        },
        {
          $group: {
            _id: '$_id.cohort',
            months: {
              $push: {
                month: '$_id.month',
                customers: { $size: '$customers' }
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      return results;
    } catch (error) {
      console.error('Error getting cohort analysis:', error);
      throw new Error('Failed to retrieve cohort analysis');
    }
  }

  /**
   * Get real-time metrics for live dashboard
   */
  static async getRealTimeMetrics() {
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);

    try {
      const [todayStats, yesterdayStats, recentOrders] = await Promise.all([
        this.getTotalRevenue(today, new Date()),
        this.getTotalRevenue(yesterday, today),
        Order.find({
          'timestamps.createdAt': { $gte: subDays(new Date(), 1) }
        })
        .sort({ 'timestamps.createdAt': -1 })
        .limit(10)
        .select('orderNumber customer.email pricing.total payment.status timestamps.createdAt')
      ]);

      const revenueGrowth = yesterdayStats.totalRevenue > 0
        ? ((todayStats.totalRevenue - yesterdayStats.totalRevenue) / yesterdayStats.totalRevenue) * 100
        : 0;

      const orderGrowth = yesterdayStats.orderCount > 0
        ? ((todayStats.orderCount - yesterdayStats.orderCount) / yesterdayStats.orderCount) * 100
        : 0;

      return {
        today: todayStats,
        yesterday: yesterdayStats,
        growth: {
          revenue: revenueGrowth,
          orders: orderGrowth
        },
        recentOrders: recentOrders.map(order => ({
          orderNumber: order.orderNumber,
          customerEmail: order.customer.email,
          total: order.pricing.total,
          status: order.payment.status,
          createdAt: order.timestamps.createdAt
        })),
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error getting real-time metrics:', error);
      throw new Error('Failed to retrieve real-time metrics');
    }
  }

  /**
   * Get inventory insights based on orders
   */
  static async getInventoryInsights(
    startDate: Date = subDays(new Date(), 30),
    endDate: Date = new Date()
  ) {
    try {
      const results = await Order.aggregate([
        {
          $match: {
            'timestamps.createdAt': { $gte: startDate, $lte: endDate },
            'payment.status': 'paid'
          }
        },
        { $unwind: '$products' },
        {
          $group: {
            _id: {
              productId: '$products.productId',
              category: '$products.category',
              brand: '$products.brand'
            },
            totalSold: { $sum: '$products.quantity' },
            totalRevenue: { $sum: '$products.totalPrice' },
            orderCount: { $sum: 1 },
            averagePrice: { $avg: '$products.unitPrice' },
            lastSold: { $max: '$timestamps.createdAt' }
          }
        },
        {
          $project: {
            productId: '$_id.productId',
            category: '$_id.category',
            brand: '$_id.brand',
            totalSold: 1,
            totalRevenue: 1,
            orderCount: 1,
            averagePrice: 1,
            lastSold: 1,
            velocity: {
              $divide: [
                '$totalSold',
                { $divide: [
                  { $subtract: [endDate, startDate] },
                  1000 * 60 * 60 * 24
                ]}
              ]
            }
          }
        },
        { $sort: { velocity: -1 } }
      ]);

      return results;
    } catch (error) {
      console.error('Error getting inventory insights:', error);
      throw new Error('Failed to retrieve inventory insights');
    }
  }
}

export default OrderAnalytics;