import { Order } from '../models/Order';
import { OrderAnalytics } from '../analytics/OrderAnalytics';
import { format, subDays, subMonths } from 'date-fns';

/**
 * Product Reporting System
 * Generates comprehensive product performance and inventory reports
 */

export interface ProductReport {
  id: string;
  title: string;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalProducts: number;
    totalQuantitySold: number;
    totalRevenue: number;
    averagePrice: number;
    topCategory: string;
    topBrand: string;
  };
  performance: {
    topProducts: any[];
    topCategories: any[];
    topBrands: any[];
    slowMoving: any[];
  };
  inventory: {
    fastMoving: any[];
    trends: any[];
    recommendations: any[];
  };
  generatedAt: Date;
}

export interface ProductPerformanceMetrics {
  productId: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  totalQuantitySold: number;
  totalRevenue: number;
  averagePrice: number;
  orderCount: number;
  velocity: number;
  profitability: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  lastSold: Date;
}

export class ProductReports {
  /**
   * Generate comprehensive product report
   */
  static async generateProductReport(
    startDate: Date = subDays(new Date(), 90),
    endDate: Date = new Date()
  ): Promise<ProductReport> {
    try {
      const [
        topProducts,
        inventoryInsights,
        categoryPerformance,
        brandPerformance
      ] = await Promise.all([
        OrderAnalytics.getTopProducts(startDate, endDate, 50),
        OrderAnalytics.getInventoryInsights(startDate, endDate),
        this.getCategoryPerformance(startDate, endDate),
        this.getBrandPerformance(startDate, endDate)
      ]);

      // Calculate summary metrics
      const totalQuantitySold = topProducts.reduce((sum, p) => sum + p.totalQuantity, 0);
      const totalRevenue = topProducts.reduce((sum, p) => sum + p.totalRevenue, 0);
      const averagePrice = totalRevenue / totalQuantitySold;

      // Find top category and brand
      const topCategory = categoryPerformance.length > 0 ? categoryPerformance[0].name : 'N/A';
      const topBrand = brandPerformance.length > 0 ? brandPerformance[0].name : 'N/A';

      // Identify slow moving products
      const slowMoving = inventoryInsights
        .filter(product => product.velocity < 0.1)
        .slice(0, 20);

      // Get fast moving products
      const fastMoving = inventoryInsights
        .filter(product => product.velocity > 1)
        .slice(0, 20);

      // Generate inventory recommendations
      const recommendations = await this.generateInventoryRecommendations(inventoryInsights);

      return {
        id: `product-report-${Date.now()}`,
        title: `Product Performance Report: ${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`,
        period: { start: startDate, end: endDate },
        summary: {
          totalProducts: topProducts.length,
          totalQuantitySold,
          totalRevenue,
          averagePrice,
          topCategory,
          topBrand
        },
        performance: {
          topProducts: topProducts.slice(0, 20),
          topCategories: categoryPerformance.slice(0, 10),
          topBrands: brandPerformance.slice(0, 10),
          slowMoving
        },
        inventory: {
          fastMoving,
          trends: await this.getProductTrends(startDate, endDate),
          recommendations
        },
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('Error generating product report:', error);
      throw new Error('Failed to generate product report');
    }
  }

  /**
   * Get detailed product performance metrics
   */
  static async getProductPerformanceMetrics(
    startDate: Date = subDays(new Date(), 90),
    endDate: Date = new Date(),
    limit: number = 100
  ): Promise<ProductPerformanceMetrics[]> {
    try {
      const products = await Order.aggregate([
        {
          $match: {
            'timestamps.createdAt': { $gte: startDate, $lte: endDate },
            'payment.status': 'paid'
          }
        },
        { $unwind: '$products' },
        {
          $group: {
            _id: '$products.productId',
            name: { $first: '$products.name' },
            category: { $first: '$products.category' },
            brand: { $first: '$products.brand' },
            sku: { $first: '$products.sku' },
            totalQuantitySold: { $sum: '$products.quantity' },
            totalRevenue: { $sum: '$products.totalPrice' },
            orderCount: { $sum: 1 },
            averagePrice: { $avg: '$products.unitPrice' },
            lastSold: { $max: '$timestamps.createdAt' },
            prices: { $push: '$products.unitPrice' },
            dates: { $push: '$timestamps.createdAt' }
          }
        },
        {
          $addFields: {
            velocity: {
              $divide: [
                '$totalQuantitySold',
                { $divide: [
                  { $subtract: [endDate, startDate] },
                  1000 * 60 * 60 * 24
                ]}
              ]
            },
            profitability: '$totalRevenue' // This would need cost data for accurate calculation
          }
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: limit }
      ]);

      // Calculate trends for each product
      const productsWithTrends = await Promise.all(
        products.map(async (product) => {
          const trend = await this.calculateProductTrend(product._id, startDate, endDate);
          return {
            productId: product._id,
            name: product.name,
            category: product.category,
            brand: product.brand,
            sku: product.sku,
            totalQuantitySold: product.totalQuantitySold,
            totalRevenue: product.totalRevenue,
            averagePrice: product.averagePrice,
            orderCount: product.orderCount,
            velocity: product.velocity,
            profitability: product.profitability,
            trend,
            lastSold: product.lastSold
          };
        })
      );

      return productsWithTrends;

    } catch (error) {
      console.error('Error getting product performance metrics:', error);
      throw new Error('Failed to get product performance metrics');
    }
  }

  /**
   * Get category performance analysis
   */
  static async getCategoryPerformance(startDate: Date, endDate: Date) {
    try {
      const categories = await Order.aggregate([
        {
          $match: {
            'timestamps.createdAt': { $gte: startDate, $lte: endDate },
            'payment.status': 'paid'
          }
        },
        { $unwind: '$products' },
        {
          $group: {
            _id: '$products.category',
            totalRevenue: { $sum: '$products.totalPrice' },
            totalQuantity: { $sum: '$products.quantity' },
            orderCount: { $sum: 1 },
            uniqueProducts: { $addToSet: '$products.productId' },
            averagePrice: { $avg: '$products.unitPrice' }
          }
        },
        {
          $project: {
            name: '$_id',
            totalRevenue: 1,
            totalQuantity: 1,
            orderCount: 1,
            uniqueProducts: { $size: '$uniqueProducts' },
            averagePrice: 1,
            revenuePerProduct: { $divide: ['$totalRevenue', { $size: '$uniqueProducts' }] }
          }
        },
        { $sort: { totalRevenue: -1 } }
      ]);

      return categories.filter(cat => cat.name); // Filter out null/undefined categories

    } catch (error) {
      console.error('Error getting category performance:', error);
      throw new Error('Failed to get category performance');
    }
  }

  /**
   * Get brand performance analysis
   */
  static async getBrandPerformance(startDate: Date, endDate: Date) {
    try {
      const brands = await Order.aggregate([
        {
          $match: {
            'timestamps.createdAt': { $gte: startDate, $lte: endDate },
            'payment.status': 'paid'
          }
        },
        { $unwind: '$products' },
        {
          $group: {
            _id: '$products.brand',
            totalRevenue: { $sum: '$products.totalPrice' },
            totalQuantity: { $sum: '$products.quantity' },
            orderCount: { $sum: 1 },
            uniqueProducts: { $addToSet: '$products.productId' },
            averagePrice: { $avg: '$products.unitPrice' }
          }
        },
        {
          $project: {
            name: '$_id',
            totalRevenue: 1,
            totalQuantity: 1,
            orderCount: 1,
            uniqueProducts: { $size: '$uniqueProducts' },
            averagePrice: 1,
            marketShare: '$totalRevenue' // Will be calculated as percentage later
          }
        },
        { $sort: { totalRevenue: -1 } }
      ]);

      // Calculate market share
      const totalMarketRevenue = brands.reduce((sum, brand) => sum + brand.totalRevenue, 0);
      brands.forEach(brand => {
        brand.marketShare = (brand.totalRevenue / totalMarketRevenue) * 100;
      });

      return brands.filter(brand => brand.name); // Filter out null/undefined brands

    } catch (error) {
      console.error('Error getting brand performance:', error);
      throw new Error('Failed to get brand performance');
    }
  }

  /**
   * Get product trends analysis
   */
  static async getProductTrends(startDate: Date, endDate: Date) {
    try {
      const trends = await Order.aggregate([
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
              week: { $week: '$timestamps.createdAt' },
              year: { $year: '$timestamps.createdAt' }
            },
            productName: { $first: '$products.name' },
            weeklyQuantity: { $sum: '$products.quantity' },
            weeklyRevenue: { $sum: '$products.totalPrice' }
          }
        },
        {
          $group: {
            _id: '$_id.productId',
            productName: { $first: '$productName' },
            weeklyData: {
              $push: {
                week: '$_id.week',
                year: '$_id.year',
                quantity: '$weeklyQuantity',
                revenue: '$weeklyRevenue'
              }
            }
          }
        },
        {
          $addFields: {
            trend: {
              $let: {
                vars: {
                  sorted: { $sortArray: { input: '$weeklyData', sortBy: { year: 1, week: 1 } } }
                },
                in: {
                  $cond: {
                    if: { $gte: [{ $size: '$$sorted' }, 2] },
                    then: {
                      $cond: {
                        if: {
                          $gt: [
                            { $arrayElemAt: ['$$sorted.quantity', -1] },
                            { $arrayElemAt: ['$$sorted.quantity', 0] }
                          ]
                        },
                        then: 'increasing',
                        else: {
                          $cond: {
                            if: {
                              $lt: [
                                { $arrayElemAt: ['$$sorted.quantity', -1] },
                                { $arrayElemAt: ['$$sorted.quantity', 0] }
                              ]
                            },
                            then: 'decreasing',
                            else: 'stable'
                          }
                        }
                      }
                    },
                    else: 'stable'
                  }
                }
              }
            }
          }
        },
        { $sort: { '_id': 1 } },
        { $limit: 50 }
      ]);

      return trends;

    } catch (error) {
      console.error('Error getting product trends:', error);
      throw new Error('Failed to get product trends');
    }
  }

  /**
   * Get inventory analysis and recommendations
   */
  static async getInventoryAnalysis(
    startDate: Date = subDays(new Date(), 90),
    endDate: Date = new Date()
  ) {
    try {
      const inventoryData = await OrderAnalytics.getInventoryInsights(startDate, endDate);

      // Categorize products by velocity
      const fastMoving = inventoryData.filter(item => item.velocity > 1);
      const normalMoving = inventoryData.filter(item => item.velocity >= 0.1 && item.velocity <= 1);
      const slowMoving = inventoryData.filter(item => item.velocity < 0.1);

      // Calculate stock recommendations
      const recommendations = inventoryData.map(item => {
        let recommendation = 'maintain';
        let priority = 'low';

        if (item.velocity > 2) {
          recommendation = 'increase';
          priority = 'high';
        } else if (item.velocity < 0.05) {
          recommendation = 'reduce';
          priority = 'medium';
        }

        return {
          productId: item.productId,
          category: item.category,
          brand: item.brand,
          velocity: item.velocity,
          recommendation,
          priority,
          suggestedAction: this.getSuggestedAction(item.velocity, item.lastSold)
        };
      });

      return {
        overview: {
          totalProducts: inventoryData.length,
          fastMoving: fastMoving.length,
          normalMoving: normalMoving.length,
          slowMoving: slowMoving.length
        },
        categories: {
          fastMoving: fastMoving.slice(0, 20),
          slowMoving: slowMoving.slice(0, 20)
        },
        recommendations: recommendations.filter(r => r.priority !== 'low').slice(0, 30)
      };

    } catch (error) {
      console.error('Error getting inventory analysis:', error);
      throw new Error('Failed to get inventory analysis');
    }
  }

  /**
   * Calculate product trend
   */
  private static async calculateProductTrend(
    productId: string,
    startDate: Date,
    endDate: Date
  ): Promise<'increasing' | 'stable' | 'decreasing'> {
    try {
      const midPoint = new Date((startDate.getTime() + endDate.getTime()) / 2);

      const [firstHalf, secondHalf] = await Promise.all([
        Order.aggregate([
          {
            $match: {
              'timestamps.createdAt': { $gte: startDate, $lt: midPoint },
              'payment.status': 'paid',
              'products.productId': productId
            }
          },
          { $unwind: '$products' },
          { $match: { 'products.productId': productId } },
          {
            $group: {
              _id: null,
              totalQuantity: { $sum: '$products.quantity' }
            }
          }
        ]),
        Order.aggregate([
          {
            $match: {
              'timestamps.createdAt': { $gte: midPoint, $lte: endDate },
              'payment.status': 'paid',
              'products.productId': productId
            }
          },
          { $unwind: '$products' },
          { $match: { 'products.productId': productId } },
          {
            $group: {
              _id: null,
              totalQuantity: { $sum: '$products.quantity' }
            }
          }
        ])
      ]);

      const firstHalfQty = firstHalf[0]?.totalQuantity || 0;
      const secondHalfQty = secondHalf[0]?.totalQuantity || 0;

      if (secondHalfQty > firstHalfQty * 1.1) return 'increasing';
      if (secondHalfQty < firstHalfQty * 0.9) return 'decreasing';
      return 'stable';

    } catch (error) {
      console.error('Error calculating product trend:', error);
      return 'stable';
    }
  }

  /**
   * Generate inventory recommendations
   */
  private static async generateInventoryRecommendations(inventoryData: any[]) {
    const recommendations = [];

    for (const item of inventoryData) {
      if (item.velocity > 2) {
        recommendations.push({
          productId: item.productId,
          type: 'restock',
          priority: 'high',
          message: `High velocity product (${item.velocity.toFixed(2)} units/day) - consider increasing stock`,
          category: item.category,
          brand: item.brand
        });
      } else if (item.velocity < 0.05) {
        const daysSinceLastSold = (new Date().getTime() - new Date(item.lastSold).getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceLastSold > 90) {
          recommendations.push({
            productId: item.productId,
            type: 'clearance',
            priority: 'medium',
            message: `Slow moving product - no sales in ${Math.round(daysSinceLastSold)} days. Consider clearance sale`,
            category: item.category,
            brand: item.brand
          });
        }
      }
    }

    // Add category-level recommendations
    const categoryStats = inventoryData.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { totalVelocity: 0, count: 0 };
      }
      acc[item.category].totalVelocity += item.velocity;
      acc[item.category].count++;
      return acc;
    }, {});

    Object.entries(categoryStats).forEach(([category, stats]: [string, any]) => {
      const avgVelocity = stats.totalVelocity / stats.count;
      if (avgVelocity > 1.5) {
        recommendations.push({
          productId: null,
          type: 'category-expansion',
          priority: 'medium',
          message: `Category "${category}" showing strong performance (avg velocity: ${avgVelocity.toFixed(2)}) - consider expanding product line`,
          category,
          brand: null
        });
      }
    });

    return recommendations.slice(0, 20); // Limit recommendations
  }

  /**
   * Get suggested action based on velocity and last sold date
   */
  private static getSuggestedAction(velocity: number, lastSold: Date): string {
    const daysSinceLastSold = (new Date().getTime() - new Date(lastSold).getTime()) / (1000 * 60 * 60 * 24);

    if (velocity > 2) return 'Increase stock levels - high demand';
    if (velocity > 1) return 'Monitor closely - good performance';
    if (velocity > 0.1) return 'Maintain current levels';
    if (daysSinceLastSold > 180) return 'Consider discontinuing - very slow moving';
    if (daysSinceLastSold > 90) return 'Run promotion to clear stock';
    return 'Monitor for trends';
  }

  /**
   * Export product report to CSV
   */
  static async exportProductReportToCSV(report: ProductReport): Promise<string> {
    try {
      const lines: string[] = [];

      // Header
      lines.push(`Product Report,${report.title}`);
      lines.push(`Period,"${format(report.period.start, 'yyyy-MM-dd')} to ${format(report.period.end, 'yyyy-MM-dd')}"`);
      lines.push(`Generated,${format(report.generatedAt, 'yyyy-MM-dd HH:mm:ss')}`);
      lines.push('');

      // Summary
      lines.push('SUMMARY');
      lines.push('Metric,Value');
      lines.push(`Total Products,${report.summary.totalProducts}`);
      lines.push(`Total Quantity Sold,${report.summary.totalQuantitySold}`);
      lines.push(`Total Revenue,${report.summary.totalRevenue.toFixed(2)}`);
      lines.push(`Average Price,${report.summary.averagePrice.toFixed(2)}`);
      lines.push(`Top Category,${report.summary.topCategory}`);
      lines.push(`Top Brand,${report.summary.topBrand}`);
      lines.push('');

      // Top Products
      lines.push('TOP PRODUCTS');
      lines.push('Product ID,Name,Category,Brand,Quantity Sold,Revenue,Average Price');
      report.performance.topProducts.forEach(product => {
        lines.push(`${product.productId},"${product.productName}",${product.category},${product.brand},${product.totalQuantity},${product.totalRevenue.toFixed(2)},${product.averagePrice.toFixed(2)}`);
      });
      lines.push('');

      // Categories
      lines.push('CATEGORY PERFORMANCE');
      lines.push('Category,Revenue,Quantity,Orders,Products,Average Price');
      report.performance.topCategories.forEach(category => {
        lines.push(`${category.name},${category.totalRevenue.toFixed(2)},${category.totalQuantity},${category.orderCount},${category.uniqueProducts},${category.averagePrice.toFixed(2)}`);
      });

      return lines.join('\n');

    } catch (error) {
      console.error('Error exporting product report to CSV:', error);
      throw new Error('Failed to export product report to CSV');
    }
  }
}

export default ProductReports;