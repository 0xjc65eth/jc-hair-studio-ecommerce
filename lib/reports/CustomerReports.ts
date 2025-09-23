import { Order } from '../models/Order';
import { OrderAnalytics } from '../analytics/OrderAnalytics';
import { format, subDays, subMonths } from 'date-fns';

/**
 * Customer Reporting System
 * Generates comprehensive customer analysis and behavioral reports
 */

export interface CustomerReport {
  id: string;
  title: string;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    vipCustomers: number;
    averageLifetimeValue: number;
    customerRetentionRate: number;
  };
  segmentation: {
    byValue: any[];
    byFrequency: any[];
    byRecency: any[];
    byType: any[];
  };
  cohortAnalysis: any[];
  churnAnalysis: any;
  generatedAt: Date;
}

export interface CustomerLifetimeValue {
  customerId: string;
  email: string;
  firstName: string;
  lastName: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  firstOrderDate: Date;
  lastOrderDate: Date;
  customerLifetime: number;
  predictedLTV: number;
  segment: string;
  churnRisk: 'low' | 'medium' | 'high';
}

export class CustomerReports {
  /**
   * Generate comprehensive customer report
   */
  static async generateCustomerReport(
    startDate: Date = subDays(new Date(), 90),
    endDate: Date = new Date()
  ): Promise<CustomerReport> {
    try {
      const [
        customerSegmentation,
        cohortData,
        customerBehavior,
        churnAnalysis
      ] = await Promise.all([
        OrderAnalytics.getCustomerSegmentation(),
        OrderAnalytics.getCohortAnalysis(12),
        OrderAnalytics.getCustomerBehaviorMetrics(startDate, endDate),
        this.getChurnAnalysis(startDate, endDate)
      ]);

      // Segment customers by value
      const valueSegments = this.segmentByValue(customerSegmentation);

      // Segment customers by frequency
      const frequencySegments = this.segmentByFrequency(customerSegmentation);

      // Segment customers by recency
      const recencySegments = this.segmentByRecency(customerSegmentation);

      // Segment customers by type
      const typeSegments = customerSegmentation.reduce((acc: any, customer) => {
        const type = customer.customerType;
        if (!acc[type]) {
          acc[type] = {
            type,
            count: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            averageOrders: 0
          };
        }
        acc[type].count++;
        acc[type].totalRevenue += customer.totalSpent;
        acc[type].averageOrderValue += customer.averageOrderValue;
        acc[type].averageOrders += customer.totalOrders;
        return acc;
      }, {});

      // Calculate averages for type segments
      Object.values(typeSegments).forEach((segment: any) => {
        segment.averageOrderValue = segment.averageOrderValue / segment.count;
        segment.averageOrders = segment.averageOrders / segment.count;
      });

      const vipCustomers = customerSegmentation.filter(c => c.segment === 'VIP').length;

      return {
        id: `customer-report-${Date.now()}`,
        title: `Customer Analysis Report: ${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`,
        period: { start: startDate, end: endDate },
        summary: {
          totalCustomers: customerSegmentation.length,
          newCustomers: customerBehavior.newCustomers,
          returningCustomers: customerBehavior.returningCustomers,
          vipCustomers,
          averageLifetimeValue: customerBehavior.averageCustomerLifetimeValue,
          customerRetentionRate: customerBehavior.customerRetentionRate
        },
        segmentation: {
          byValue: valueSegments,
          byFrequency: frequencySegments,
          byRecency: recencySegments,
          byType: Object.values(typeSegments)
        },
        cohortAnalysis: cohortData,
        churnAnalysis,
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('Error generating customer report:', error);
      throw new Error('Failed to generate customer report');
    }
  }

  /**
   * Get customer lifetime value analysis
   */
  static async getCustomerLifetimeValueAnalysis(
    limit: number = 100
  ): Promise<CustomerLifetimeValue[]> {
    try {
      const customers = await Order.aggregate([
        {
          $match: {
            'payment.status': 'paid'
          }
        },
        {
          $group: {
            _id: '$customer.email',
            firstName: { $first: '$customer.firstName' },
            lastName: { $first: '$customer.lastName' },
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$pricing.total' },
            averageOrderValue: { $avg: '$pricing.total' },
            firstOrderDate: { $min: '$timestamps.createdAt' },
            lastOrderDate: { $max: '$timestamps.createdAt' },
            orderFrequency: {
              $avg: {
                $divide: [
                  { $subtract: ['$timestamps.createdAt', { $min: '$timestamps.createdAt' }] },
                  1000 * 60 * 60 * 24
                ]
              }
            }
          }
        },
        {
          $addFields: {
            customerLifetime: {
              $divide: [
                { $subtract: ['$lastOrderDate', '$firstOrderDate'] },
                1000 * 60 * 60 * 24
              ]
            },
            daysSinceLastOrder: {
              $divide: [
                { $subtract: [new Date(), '$lastOrderDate'] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        },
        {
          $addFields: {
            predictedLTV: {
              $multiply: [
                '$averageOrderValue',
                {
                  $divide: [
                    365,
                    { $max: ['$orderFrequency', 30] }
                  ]
                },
                3 // Predicted years of relationship
              ]
            },
            segment: {
              $switch: {
                branches: [
                  {
                    case: { $and: [{ $gte: ['$totalSpent', 1000] }, { $gte: ['$totalOrders', 5] }] },
                    then: 'VIP'
                  },
                  {
                    case: { $and: [{ $gte: ['$totalSpent', 500] }, { $gte: ['$totalOrders', 3] }] },
                    then: 'Loyal'
                  },
                  {
                    case: { $gte: ['$totalOrders', 2] },
                    then: 'Repeat'
                  }
                ],
                default: 'New'
              }
            },
            churnRisk: {
              $switch: {
                branches: [
                  {
                    case: { $gte: ['$daysSinceLastOrder', 180] },
                    then: 'high'
                  },
                  {
                    case: { $gte: ['$daysSinceLastOrder', 90] },
                    then: 'medium'
                  }
                ],
                default: 'low'
              }
            }
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: limit }
      ]);

      return customers.map(customer => ({
        customerId: customer._id,
        email: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        totalOrders: customer.totalOrders,
        totalSpent: customer.totalSpent,
        averageOrderValue: customer.averageOrderValue,
        firstOrderDate: customer.firstOrderDate,
        lastOrderDate: customer.lastOrderDate,
        customerLifetime: customer.customerLifetime,
        predictedLTV: customer.predictedLTV,
        segment: customer.segment,
        churnRisk: customer.churnRisk
      }));

    } catch (error) {
      console.error('Error getting customer lifetime value analysis:', error);
      throw new Error('Failed to get customer lifetime value analysis');
    }
  }

  /**
   * Get customer acquisition analysis
   */
  static async getCustomerAcquisitionAnalysis(
    startDate: Date = subMonths(new Date(), 12),
    endDate: Date = new Date()
  ) {
    try {
      const acquisitionData = await Order.aggregate([
        {
          $match: {
            'timestamps.createdAt': { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$customer.email',
            firstOrder: { $min: '$timestamps.createdAt' },
            source: { $first: '$metadata.source' },
            utmSource: { $first: '$metadata.utmSource' },
            utmMedium: { $first: '$metadata.utmMedium' },
            utmCampaign: { $first: '$metadata.utmCampaign' },
            firstOrderValue: { $min: '$pricing.total' }
          }
        },
        {
          $group: {
            _id: {
              month: { $dateToString: { format: "%Y-%m", date: "$firstOrder" } },
              source: '$source',
              utmSource: '$utmSource'
            },
            newCustomers: { $sum: 1 },
            totalAcquisitionValue: { $sum: '$firstOrderValue' },
            averageFirstOrderValue: { $avg: '$firstOrderValue' }
          }
        },
        { $sort: { '_id.month': 1 } }
      ]);

      // Group by source
      const bySource = acquisitionData.reduce((acc: any, item) => {
        const source = item._id.source || 'unknown';
        if (!acc[source]) {
          acc[source] = {
            source,
            newCustomers: 0,
            totalValue: 0,
            averageValue: 0
          };
        }
        acc[source].newCustomers += item.newCustomers;
        acc[source].totalValue += item.totalAcquisitionValue;
        return acc;
      }, {});

      // Calculate averages
      Object.values(bySource).forEach((source: any) => {
        source.averageValue = source.totalValue / source.newCustomers;
      });

      return {
        monthly: acquisitionData,
        bySource: Object.values(bySource),
        summary: {
          totalNewCustomers: acquisitionData.reduce((sum, item) => sum + item.newCustomers, 0),
          totalAcquisitionValue: acquisitionData.reduce((sum, item) => sum + item.totalAcquisitionValue, 0),
          averageCustomerAcquisitionCost: 0 // This would need marketing spend data
        }
      };

    } catch (error) {
      console.error('Error getting customer acquisition analysis:', error);
      throw new Error('Failed to get customer acquisition analysis');
    }
  }

  /**
   * Get customer behavior patterns
   */
  static async getCustomerBehaviorPatterns(
    startDate: Date = subDays(new Date(), 90),
    endDate: Date = new Date()
  ) {
    try {
      const patterns = await Order.aggregate([
        {
          $match: {
            'timestamps.createdAt': { $gte: startDate, $lte: endDate },
            'payment.status': 'paid'
          }
        },
        {
          $addFields: {
            dayOfWeek: { $dayOfWeek: '$timestamps.createdAt' },
            hourOfDay: { $hour: '$timestamps.createdAt' },
            month: { $month: '$timestamps.createdAt' }
          }
        },
        {
          $group: {
            _id: null,
            ordersByDayOfWeek: {
              $push: {
                day: '$dayOfWeek',
                order: 1
              }
            },
            ordersByHour: {
              $push: {
                hour: '$hourOfDay',
                order: 1
              }
            },
            ordersByMonth: {
              $push: {
                month: '$month',
                revenue: '$pricing.total'
              }
            },
            averageOrdersByDevice: {
              $push: {
                device: '$metadata.deviceType',
                order: 1
              }
            }
          }
        }
      ]);

      if (!patterns[0]) {
        return {
          dayOfWeek: [],
          hourOfDay: [],
          month: [],
          device: []
        };
      }

      const data = patterns[0];

      // Process day of week data
      const dayOfWeekCounts = data.ordersByDayOfWeek.reduce((acc: any, item: any) => {
        acc[item.day] = (acc[item.day] || 0) + 1;
        return acc;
      }, {});

      // Process hour of day data
      const hourCounts = data.ordersByHour.reduce((acc: any, item: any) => {
        acc[item.hour] = (acc[item.hour] || 0) + 1;
        return acc;
      }, {});

      // Process monthly data
      const monthlyRevenue = data.ordersByMonth.reduce((acc: any, item: any) => {
        acc[item.month] = (acc[item.month] || 0) + item.revenue;
        return acc;
      }, {});

      // Process device data
      const deviceCounts = data.averageOrdersByDevice.reduce((acc: any, item: any) => {
        if (item.device) {
          acc[item.device] = (acc[item.device] || 0) + 1;
        }
        return acc;
      }, {});

      return {
        dayOfWeek: Object.entries(dayOfWeekCounts).map(([day, count]) => ({
          day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][parseInt(day) - 1],
          orders: count
        })),
        hourOfDay: Object.entries(hourCounts).map(([hour, count]) => ({
          hour: parseInt(hour),
          orders: count
        })),
        month: Object.entries(monthlyRevenue).map(([month, revenue]) => ({
          month: parseInt(month),
          revenue
        })),
        device: Object.entries(deviceCounts).map(([device, count]) => ({
          device,
          orders: count
        }))
      };

    } catch (error) {
      console.error('Error getting customer behavior patterns:', error);
      throw new Error('Failed to get customer behavior patterns');
    }
  }

  /**
   * Get customer churn analysis
   */
  private static async getChurnAnalysis(startDate: Date, endDate: Date) {
    try {
      const churnData = await Order.aggregate([
        {
          $match: {
            'payment.status': 'paid'
          }
        },
        {
          $group: {
            _id: '$customer.email',
            lastOrderDate: { $max: '$timestamps.createdAt' },
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$pricing.total' }
          }
        },
        {
          $addFields: {
            daysSinceLastOrder: {
              $divide: [
                { $subtract: [new Date(), '$lastOrderDate'] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            atRisk: {
              $sum: { $cond: [{ $gte: ['$daysSinceLastOrder', 90] }, 1, 0] }
            },
            churned: {
              $sum: { $cond: [{ $gte: ['$daysSinceLastOrder', 180] }, 1, 0] }
            },
            active: {
              $sum: { $cond: [{ $lt: ['$daysSinceLastOrder', 90] }, 1, 0] }
            },
            totalCustomers: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            atRisk: 1,
            churned: 1,
            active: 1,
            totalCustomers: 1,
            churnRate: { $multiply: [{ $divide: ['$churned', '$totalCustomers'] }, 100] },
            atRiskRate: { $multiply: [{ $divide: ['$atRisk', '$totalCustomers'] }, 100] }
          }
        }
      ]);

      return churnData[0] || {
        atRisk: 0,
        churned: 0,
        active: 0,
        totalCustomers: 0,
        churnRate: 0,
        atRiskRate: 0
      };

    } catch (error) {
      console.error('Error getting churn analysis:', error);
      throw new Error('Failed to get churn analysis');
    }
  }

  /**
   * Segment customers by value
   */
  private static segmentByValue(customers: any[]) {
    const sorted = [...customers].sort((a, b) => b.totalSpent - a.totalSpent);
    const segments = {
      high: sorted.slice(0, Math.ceil(sorted.length * 0.2)),
      medium: sorted.slice(Math.ceil(sorted.length * 0.2), Math.ceil(sorted.length * 0.6)),
      low: sorted.slice(Math.ceil(sorted.length * 0.6))
    };

    return Object.entries(segments).map(([name, customers]) => ({
      segment: name,
      count: customers.length,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
      averageRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length || 0,
      percentage: (customers.length / sorted.length) * 100
    }));
  }

  /**
   * Segment customers by frequency
   */
  private static segmentByFrequency(customers: any[]) {
    const segments = customers.reduce((acc, customer) => {
      if (customer.totalOrders >= 10) acc.high.push(customer);
      else if (customer.totalOrders >= 3) acc.medium.push(customer);
      else acc.low.push(customer);
      return acc;
    }, { high: [], medium: [], low: [] });

    return Object.entries(segments).map(([name, customers]: [string, any[]]) => ({
      segment: name,
      count: customers.length,
      averageOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length || 0,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
    }));
  }

  /**
   * Segment customers by recency
   */
  private static segmentByRecency(customers: any[]) {
    const now = new Date();
    const segments = customers.reduce((acc, customer) => {
      const daysSinceLastOrder = (now.getTime() - customer.lastOrder.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceLastOrder <= 30) acc.recent.push(customer);
      else if (daysSinceLastOrder <= 90) acc.moderate.push(customer);
      else acc.old.push(customer);

      return acc;
    }, { recent: [], moderate: [], old: [] });

    return Object.entries(segments).map(([name, customers]: [string, any[]]) => ({
      segment: name,
      count: customers.length,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
      averageDaysSinceLastOrder: customers.reduce((sum, c) => {
        const days = (now.getTime() - c.lastOrder.getTime()) / (1000 * 60 * 60 * 24);
        return sum + days;
      }, 0) / customers.length || 0
    }));
  }

  /**
   * Export customer report to CSV
   */
  static async exportCustomerReportToCSV(report: CustomerReport): Promise<string> {
    try {
      const lines: string[] = [];

      // Header
      lines.push(`Customer Report,${report.title}`);
      lines.push(`Period,"${format(report.period.start, 'yyyy-MM-dd')} to ${format(report.period.end, 'yyyy-MM-dd')}"`);
      lines.push(`Generated,${format(report.generatedAt, 'yyyy-MM-dd HH:mm:ss')}`);
      lines.push('');

      // Summary
      lines.push('SUMMARY');
      lines.push('Metric,Value');
      lines.push(`Total Customers,${report.summary.totalCustomers}`);
      lines.push(`New Customers,${report.summary.newCustomers}`);
      lines.push(`Returning Customers,${report.summary.returningCustomers}`);
      lines.push(`VIP Customers,${report.summary.vipCustomers}`);
      lines.push(`Average Lifetime Value,${report.summary.averageLifetimeValue.toFixed(2)}`);
      lines.push(`Customer Retention Rate,${report.summary.customerRetentionRate.toFixed(2)}%`);
      lines.push('');

      // Value Segmentation
      lines.push('VALUE SEGMENTATION');
      lines.push('Segment,Count,Total Revenue,Average Revenue,Percentage');
      report.segmentation.byValue.forEach(segment => {
        lines.push(`${segment.segment},${segment.count},${segment.totalRevenue.toFixed(2)},${segment.averageRevenue.toFixed(2)},${segment.percentage.toFixed(2)}%`);
      });

      return lines.join('\n');

    } catch (error) {
      console.error('Error exporting customer report to CSV:', error);
      throw new Error('Failed to export customer report to CSV');
    }
  }
}

export default CustomerReports;