import { Order } from '../models/Order';
import { OrderAnalytics } from '../analytics/OrderAnalytics';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

/**
 * Sales Reporting System
 * Generates comprehensive sales reports for business analysis
 */

export interface SalesReport {
  id: string;
  title: string;
  period: {
    start: Date;
    end: Date;
    type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  };
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalItems: number;
    uniqueCustomers: number;
  };
  breakdown: {
    byPaymentMethod: any[];
    byShippingMethod: any[];
    byCustomerType: any[];
    byGeography: any[];
  };
  trends: any[];
  generatedAt: Date;
  generatedBy: string;
}

export interface DetailedSalesReport extends SalesReport {
  orders: any[];
  products: any[];
  customers: any[];
  refunds: any[];
}

export class SalesReports {
  /**
   * Generate a comprehensive sales report
   */
  static async generateSalesReport(
    startDate: Date,
    endDate: Date,
    options: {
      includeDetails?: boolean;
      groupBy?: 'day' | 'week' | 'month';
      generatedBy?: string;
    } = {}
  ): Promise<SalesReport | DetailedSalesReport> {
    const {
      includeDetails = false,
      groupBy = 'day',
      generatedBy = 'system'
    } = options;

    try {
      // Get all the necessary data in parallel
      const [
        revenueData,
        totalRevenue,
        topProducts,
        customerBehavior,
        paymentMethods,
        shippingMethods,
        geographicData,
        orderList
      ] = await Promise.all([
        OrderAnalytics.getRevenueAnalytics(startDate, endDate, groupBy),
        OrderAnalytics.getTotalRevenue(startDate, endDate),
        OrderAnalytics.getTopProducts(startDate, endDate, 20),
        OrderAnalytics.getCustomerBehaviorMetrics(startDate, endDate),
        OrderAnalytics.getPaymentMethodAnalytics(startDate, endDate),
        OrderAnalytics.getShippingAnalytics(startDate, endDate),
        OrderAnalytics.getGeographicDistribution(startDate, endDate),
        includeDetails ? this.getDetailedOrderList(startDate, endDate) : null
      ]);

      // Calculate unique customers
      const uniqueCustomers = await Order.distinct('customer.email', {
        'timestamps.createdAt': { $gte: startDate, $lte: endDate },
        'payment.status': 'paid'
      });

      // Get customer type breakdown
      const customerTypeBreakdown = await Order.aggregate([
        {
          $match: {
            'timestamps.createdAt': { $gte: startDate, $lte: endDate },
            'payment.status': 'paid'
          }
        },
        {
          $group: {
            _id: '$customer.type',
            orderCount: { $sum: 1 },
            totalRevenue: { $sum: '$pricing.total' },
            uniqueCustomers: { $addToSet: '$customer.email' }
          }
        },
        {
          $project: {
            type: '$_id',
            orderCount: 1,
            totalRevenue: 1,
            uniqueCustomers: { $size: '$uniqueCustomers' },
            averageOrderValue: { $divide: ['$totalRevenue', '$orderCount'] }
          }
        }
      ]);

      const reportId = `sales-${format(startDate, 'yyyy-MM-dd')}-${format(endDate, 'yyyy-MM-dd')}-${Date.now()}`;

      const baseReport: SalesReport = {
        id: reportId,
        title: `Sales Report: ${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`,
        period: {
          start: startDate,
          end: endDate,
          type: this.determinePeriodType(startDate, endDate)
        },
        summary: {
          totalRevenue: totalRevenue.totalRevenue,
          totalOrders: totalRevenue.orderCount,
          averageOrderValue: totalRevenue.averageOrderValue,
          totalItems: totalRevenue.totalItems,
          uniqueCustomers: uniqueCustomers.length
        },
        breakdown: {
          byPaymentMethod: paymentMethods,
          byShippingMethod: shippingMethods,
          byCustomerType: customerTypeBreakdown,
          byGeography: geographicData.slice(0, 15)
        },
        trends: revenueData,
        generatedAt: new Date(),
        generatedBy
      };

      if (includeDetails) {
        const detailedReport: DetailedSalesReport = {
          ...baseReport,
          orders: orderList || [],
          products: topProducts,
          customers: await this.getTopCustomers(startDate, endDate),
          refunds: await this.getRefundData(startDate, endDate)
        };
        return detailedReport;
      }

      return baseReport;

    } catch (error) {
      console.error('Error generating sales report:', error);
      throw new Error('Failed to generate sales report');
    }
  }

  /**
   * Generate monthly sales report
   */
  static async generateMonthlySalesReport(
    year: number,
    month: number,
    includeDetails: boolean = false
  ): Promise<SalesReport | DetailedSalesReport> {
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));

    return this.generateSalesReport(startDate, endDate, {
      includeDetails,
      groupBy: 'day',
      generatedBy: 'monthly-report'
    });
  }

  /**
   * Generate yearly sales report
   */
  static async generateYearlySalesReport(
    year: number,
    includeDetails: boolean = false
  ): Promise<SalesReport | DetailedSalesReport> {
    const startDate = startOfYear(new Date(year, 0));
    const endDate = endOfYear(new Date(year, 0));

    return this.generateSalesReport(startDate, endDate, {
      includeDetails,
      groupBy: 'month',
      generatedBy: 'yearly-report'
    });
  }

  /**
   * Generate comparative sales report
   */
  static async generateComparativeSalesReport(
    currentStart: Date,
    currentEnd: Date,
    previousStart: Date,
    previousEnd: Date
  ) {
    try {
      const [currentReport, previousReport] = await Promise.all([
        this.generateSalesReport(currentStart, currentEnd),
        this.generateSalesReport(previousStart, previousEnd)
      ]);

      const comparison = {
        revenue: {
          current: currentReport.summary.totalRevenue,
          previous: previousReport.summary.totalRevenue,
          change: currentReport.summary.totalRevenue - previousReport.summary.totalRevenue,
          percentChange: ((currentReport.summary.totalRevenue - previousReport.summary.totalRevenue) / previousReport.summary.totalRevenue) * 100
        },
        orders: {
          current: currentReport.summary.totalOrders,
          previous: previousReport.summary.totalOrders,
          change: currentReport.summary.totalOrders - previousReport.summary.totalOrders,
          percentChange: ((currentReport.summary.totalOrders - previousReport.summary.totalOrders) / previousReport.summary.totalOrders) * 100
        },
        aov: {
          current: currentReport.summary.averageOrderValue,
          previous: previousReport.summary.averageOrderValue,
          change: currentReport.summary.averageOrderValue - previousReport.summary.averageOrderValue,
          percentChange: ((currentReport.summary.averageOrderValue - previousReport.summary.averageOrderValue) / previousReport.summary.averageOrderValue) * 100
        },
        customers: {
          current: currentReport.summary.uniqueCustomers,
          previous: previousReport.summary.uniqueCustomers,
          change: currentReport.summary.uniqueCustomers - previousReport.summary.uniqueCustomers,
          percentChange: ((currentReport.summary.uniqueCustomers - previousReport.summary.uniqueCustomers) / previousReport.summary.uniqueCustomers) * 100
        }
      };

      return {
        id: `comparative-${Date.now()}`,
        title: 'Comparative Sales Report',
        current: currentReport,
        previous: previousReport,
        comparison,
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('Error generating comparative sales report:', error);
      throw new Error('Failed to generate comparative sales report');
    }
  }

  /**
   * Get sales performance trends
   */
  static async getSalesPerformanceTrends(
    startDate: Date,
    endDate: Date,
    metrics: ('revenue' | 'orders' | 'aov' | 'customers')[] = ['revenue', 'orders']
  ) {
    try {
      const trends = await OrderAnalytics.getRevenueAnalytics(startDate, endDate, 'day');

      const performanceData = trends.map((day, index) => {
        const previousDay = trends[index - 1];
        const result: any = {
          date: day.period,
          revenue: day.totalRevenue,
          orders: day.orderCount,
          aov: day.averageOrderValue
        };

        // Calculate day-over-day changes
        if (previousDay) {
          result.revenueChange = ((day.totalRevenue - previousDay.totalRevenue) / previousDay.totalRevenue) * 100;
          result.ordersChange = ((day.orderCount - previousDay.orderCount) / previousDay.orderCount) * 100;
          result.aovChange = ((day.averageOrderValue - previousDay.averageOrderValue) / previousDay.averageOrderValue) * 100;
        }

        return result;
      });

      return {
        trends: performanceData,
        summary: {
          totalDays: trends.length,
          averageDailyRevenue: trends.reduce((sum, day) => sum + day.totalRevenue, 0) / trends.length,
          averageDailyOrders: trends.reduce((sum, day) => sum + day.orderCount, 0) / trends.length,
          bestDay: trends.reduce((best, day) => day.totalRevenue > best.totalRevenue ? day : best, trends[0]),
          worstDay: trends.reduce((worst, day) => day.totalRevenue < worst.totalRevenue ? day : worst, trends[0])
        }
      };

    } catch (error) {
      console.error('Error getting sales performance trends:', error);
      throw new Error('Failed to get sales performance trends');
    }
  }

  /**
   * Helper method to get detailed order list
   */
  private static async getDetailedOrderList(startDate: Date, endDate: Date) {
    return await Order.find({
      'timestamps.createdAt': { $gte: startDate, $lte: endDate },
      'payment.status': 'paid'
    })
    .select('orderNumber customer.email customer.firstName customer.lastName pricing.total payment.method shipping.method timestamps.createdAt deliveryAddress.city deliveryAddress.state')
    .sort({ 'timestamps.createdAt': -1 })
    .limit(1000); // Limit for performance
  }

  /**
   * Helper method to get top customers
   */
  private static async getTopCustomers(startDate: Date, endDate: Date, limit: number = 50) {
    return await Order.aggregate([
      {
        $match: {
          'timestamps.createdAt': { $gte: startDate, $lte: endDate },
          'payment.status': 'paid'
        }
      },
      {
        $group: {
          _id: '$customer.email',
          customerName: { $first: { $concat: ['$customer.firstName', ' ', '$customer.lastName'] } },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$pricing.total' },
          averageOrderValue: { $avg: '$pricing.total' },
          lastOrder: { $max: '$timestamps.createdAt' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit }
    ]);
  }

  /**
   * Helper method to get refund data
   */
  private static async getRefundData(startDate: Date, endDate: Date) {
    return await Order.find({
      'timestamps.createdAt': { $gte: startDate, $lte: endDate },
      'payment.status': { $in: ['refunded', 'partially_refunded'] }
    })
    .select('orderNumber customer.email payment.refundAmount payment.refundReason payment.refundDate pricing.total')
    .sort({ 'payment.refundDate': -1 });
  }

  /**
   * Helper method to determine period type
   */
  private static determinePeriodType(startDate: Date, endDate: Date): 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom' {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (days <= 1) return 'daily';
    if (days <= 7) return 'weekly';
    if (days <= 31) return 'monthly';
    if (days <= 93) return 'quarterly';
    if (days <= 366) return 'yearly';
    return 'custom';
  }

  /**
   * Export report to CSV format
   */
  static async exportReportToCSV(report: SalesReport | DetailedSalesReport): Promise<string> {
    try {
      const lines: string[] = [];

      // Header
      lines.push(`Sales Report,${report.title}`);
      lines.push(`Period,"${format(report.period.start, 'yyyy-MM-dd')} to ${format(report.period.end, 'yyyy-MM-dd')}"`);
      lines.push(`Generated,${format(report.generatedAt, 'yyyy-MM-dd HH:mm:ss')}`);
      lines.push('');

      // Summary
      lines.push('SUMMARY');
      lines.push('Metric,Value');
      lines.push(`Total Revenue,${report.summary.totalRevenue.toFixed(2)}`);
      lines.push(`Total Orders,${report.summary.totalOrders}`);
      lines.push(`Average Order Value,${report.summary.averageOrderValue.toFixed(2)}`);
      lines.push(`Total Items,${report.summary.totalItems}`);
      lines.push(`Unique Customers,${report.summary.uniqueCustomers}`);
      lines.push('');

      // Trends
      lines.push('DAILY TRENDS');
      lines.push('Date,Revenue,Orders,Average Order Value');
      report.trends.forEach(trend => {
        lines.push(`${trend.period},${trend.totalRevenue.toFixed(2)},${trend.orderCount},${trend.averageOrderValue.toFixed(2)}`);
      });
      lines.push('');

      // Payment Methods
      lines.push('PAYMENT METHODS');
      lines.push('Method,Orders,Revenue,Average Order Value,Conversion Rate');
      report.breakdown.byPaymentMethod.forEach(method => {
        lines.push(`${method.method},${method.orderCount},${method.totalRevenue.toFixed(2)},${method.averageOrderValue.toFixed(2)},${method.conversionRate.toFixed(2)}%`);
      });

      return lines.join('\n');

    } catch (error) {
      console.error('Error exporting report to CSV:', error);
      throw new Error('Failed to export report to CSV');
    }
  }
}

export default SalesReports;