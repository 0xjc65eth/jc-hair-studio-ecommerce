import { Order } from '../models/Order';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

/**
 * Data Export System
 * Provides comprehensive data export functionality for orders and analytics
 */

export interface ExportOptions {
  format: 'csv' | 'excel' | 'json';
  startDate?: Date;
  endDate?: Date;
  fields?: string[];
  filters?: Record<string, any>;
  includeCustomerData?: boolean;
  includeProductData?: boolean;
  includeFinancialData?: boolean;
}

export interface ExportResult {
  success: boolean;
  data?: string | Buffer;
  filename: string;
  size: number;
  recordCount: number;
  error?: string;
}

export class DataExporter {
  /**
   * Export orders data in various formats
   */
  static async exportOrders(options: ExportOptions): Promise<ExportResult> {
    try {
      const {
        format = 'csv',
        startDate,
        endDate,
        fields,
        filters = {},
        includeCustomerData = true,
        includeProductData = true,
        includeFinancialData = true
      } = options;

      // Build query
      const query: any = {};

      if (startDate || endDate) {
        query['timestamps.createdAt'] = {};
        if (startDate) query['timestamps.createdAt'].$gte = startDate;
        if (endDate) query['timestamps.createdAt'].$lte = endDate;
      }

      // Apply additional filters
      Object.entries(filters).forEach(([key, value]) => {
        query[key] = value;
      });

      // Build projection based on options
      const projection = this.buildProjection(fields, includeCustomerData, includeProductData, includeFinancialData);

      // Fetch data
      const orders = await Order.find(query, projection)
        .sort({ 'timestamps.createdAt': -1 })
        .lean();

      if (orders.length === 0) {
        return {
          success: false,
          filename: '',
          size: 0,
          recordCount: 0,
          error: 'No data found for the specified criteria'
        };
      }

      // Convert to flat structure for export
      const flatData = this.flattenOrderData(orders, includeCustomerData, includeProductData, includeFinancialData);

      // Generate export based on format
      let exportData: string | Buffer;
      let filename: string;

      switch (format) {
        case 'csv':
          exportData = this.convertToCSV(flatData);
          filename = `orders_export_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`;
          break;

        case 'excel':
          exportData = this.convertToExcel(flatData);
          filename = `orders_export_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`;
          break;

        case 'json':
          exportData = JSON.stringify(flatData, null, 2);
          filename = `orders_export_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.json`;
          break;

        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      return {
        success: true,
        data: exportData,
        filename,
        size: Buffer.byteLength(exportData),
        recordCount: flatData.length
      };

    } catch (error) {
      console.error('Error exporting orders:', error);
      return {
        success: false,
        filename: '',
        size: 0,
        recordCount: 0,
        error: error instanceof Error ? error.message : 'Unknown export error'
      };
    }
  }

  /**
   * Export analytics data
   */
  static async exportAnalytics(
    analyticsType: 'revenue' | 'customers' | 'products' | 'geographic',
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const { format = 'csv', startDate, endDate } = options;

      let data: any;
      let filename: string;

      switch (analyticsType) {
        case 'revenue':
          data = await this.getRevenueAnalyticsData(startDate, endDate);
          filename = `revenue_analytics_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`;
          break;

        case 'customers':
          data = await this.getCustomerAnalyticsData(startDate, endDate);
          filename = `customer_analytics_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`;
          break;

        case 'products':
          data = await this.getProductAnalyticsData(startDate, endDate);
          filename = `product_analytics_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`;
          break;

        case 'geographic':
          data = await this.getGeographicAnalyticsData(startDate, endDate);
          filename = `geographic_analytics_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`;
          break;

        default:
          throw new Error(`Unsupported analytics type: ${analyticsType}`);
      }

      let exportData: string | Buffer;

      switch (format) {
        case 'csv':
          exportData = this.convertToCSV(data);
          filename += '.csv';
          break;

        case 'excel':
          exportData = this.convertToExcel(data);
          filename += '.xlsx';
          break;

        case 'json':
          exportData = JSON.stringify(data, null, 2);
          filename += '.json';
          break;

        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      return {
        success: true,
        data: exportData,
        filename,
        size: Buffer.byteLength(exportData),
        recordCount: Array.isArray(data) ? data.length : 1
      };

    } catch (error) {
      console.error('Error exporting analytics:', error);
      return {
        success: false,
        filename: '',
        size: 0,
        recordCount: 0,
        error: error instanceof Error ? error.message : 'Unknown export error'
      };
    }
  }

  /**
   * Export customer data with privacy compliance
   */
  static async exportCustomers(options: ExportOptions & {
    includePII?: boolean;
    anonymize?: boolean;
  }): Promise<ExportResult> {
    try {
      const {
        format = 'csv',
        startDate,
        endDate,
        includePII = false,
        anonymize = false
      } = options;

      const query: any = {};
      if (startDate || endDate) {
        query['timestamps.createdAt'] = {};
        if (startDate) query['timestamps.createdAt'].$gte = startDate;
        if (endDate) query['timestamps.createdAt'].$lte = endDate;
      }

      const customers = await Order.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$customer.email',
            firstName: { $first: '$customer.firstName' },
            lastName: { $first: '$customer.lastName' },
            customerType: { $first: '$customer.type' },
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$pricing.total' },
            averageOrderValue: { $avg: '$pricing.total' },
            firstOrder: { $min: '$timestamps.createdAt' },
            lastOrder: { $max: '$timestamps.createdAt' },
            phone: { $first: '$customer.phone' },
            city: { $first: '$deliveryAddress.city' },
            state: { $first: '$deliveryAddress.state' }
          }
        },
        { $sort: { totalSpent: -1 } }
      ]);

      // Process data based on privacy settings
      const processedCustomers = customers.map(customer => {
        const result: any = {
          email: anonymize ? this.anonymizeEmail(customer._id) : (includePII ? customer._id : '[REDACTED]'),
          customerType: customer.customerType,
          totalOrders: customer.totalOrders,
          totalSpent: customer.totalSpent,
          averageOrderValue: customer.averageOrderValue,
          firstOrder: customer.firstOrder,
          lastOrder: customer.lastOrder,
          city: customer.city,
          state: customer.state
        };

        if (includePII) {
          result.firstName = customer.firstName;
          result.lastName = customer.lastName;
          result.phone = customer.phone;
        } else if (anonymize) {
          result.firstName = this.anonymizeName(customer.firstName);
          result.lastName = this.anonymizeName(customer.lastName);
          result.phone = customer.phone ? '[REDACTED]' : null;
        }

        return result;
      });

      let exportData: string | Buffer;
      let filename = `customers_export_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`;

      switch (format) {
        case 'csv':
          exportData = this.convertToCSV(processedCustomers);
          filename += '.csv';
          break;

        case 'excel':
          exportData = this.convertToExcel(processedCustomers);
          filename += '.xlsx';
          break;

        case 'json':
          exportData = JSON.stringify(processedCustomers, null, 2);
          filename += '.json';
          break;

        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      return {
        success: true,
        data: exportData,
        filename,
        size: Buffer.byteLength(exportData),
        recordCount: processedCustomers.length
      };

    } catch (error) {
      console.error('Error exporting customers:', error);
      return {
        success: false,
        filename: '',
        size: 0,
        recordCount: 0,
        error: error instanceof Error ? error.message : 'Unknown export error'
      };
    }
  }

  /**
   * Build projection based on options
   */
  private static buildProjection(
    fields?: string[],
    includeCustomerData: boolean = true,
    includeProductData: boolean = true,
    includeFinancialData: boolean = true
  ): Record<string, number> | null {
    if (fields && fields.length > 0) {
      const projection: Record<string, number> = {};
      fields.forEach(field => {
        projection[field] = 1;
      });
      return projection;
    }

    if (!includeCustomerData || !includeProductData || !includeFinancialData) {
      const projection: Record<string, number> = {
        orderNumber: 1,
        orderId: 1,
        'timestamps.createdAt': 1,
        'timestamps.updatedAt': 1,
        'payment.status': 1,
        'shipping.status': 1
      };

      if (includeCustomerData) {
        projection['customer'] = 1;
        projection['deliveryAddress'] = 1;
      }

      if (includeProductData) {
        projection['products'] = 1;
      }

      if (includeFinancialData) {
        projection['pricing'] = 1;
        projection['payment'] = 1;
        projection['financial'] = 1;
      }

      return projection;
    }

    return null; // Return all fields
  }

  /**
   * Flatten order data for export
   */
  private static flattenOrderData(
    orders: any[],
    includeCustomerData: boolean,
    includeProductData: boolean,
    includeFinancialData: boolean
  ): any[] {
    const flattened: any[] = [];

    orders.forEach(order => {
      if (includeProductData && order.products && order.products.length > 0) {
        // Create one row per product
        order.products.forEach((product: any, index: number) => {
          const row = this.createFlatRow(order, product, index, includeCustomerData, includeFinancialData);
          flattened.push(row);
        });
      } else {
        // Create one row per order
        const row = this.createFlatRow(order, null, 0, includeCustomerData, includeFinancialData);
        flattened.push(row);
      }
    });

    return flattened;
  }

  /**
   * Create a flat row for export
   */
  private static createFlatRow(
    order: any,
    product: any,
    productIndex: number,
    includeCustomerData: boolean,
    includeFinancialData: boolean
  ): any {
    const row: any = {
      orderNumber: order.orderNumber,
      orderId: order.orderId,
      orderDate: format(new Date(order.timestamps.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      paymentStatus: order.payment?.status,
      shippingStatus: order.shipping?.status
    };

    if (includeCustomerData && order.customer) {
      row.customerEmail = order.customer.email;
      row.customerFirstName = order.customer.firstName;
      row.customerLastName = order.customer.lastName;
      row.customerType = order.customer.type;
      row.customerPhone = order.customer.phone;
    }

    if (includeCustomerData && order.deliveryAddress) {
      row.deliveryCity = order.deliveryAddress.city;
      row.deliveryState = order.deliveryAddress.state;
      row.deliveryZipCode = order.deliveryAddress.zipCode;
      row.deliveryCountry = order.deliveryAddress.country;
    }

    if (product) {
      row.productIndex = productIndex + 1;
      row.productId = product.productId;
      row.productName = product.name;
      row.productCategory = product.category;
      row.productBrand = product.brand;
      row.productSku = product.sku;
      row.productQuantity = product.quantity;
      row.productUnitPrice = product.unitPrice;
      row.productTotalPrice = product.totalPrice;
    }

    if (includeFinancialData && order.pricing) {
      row.subtotal = order.pricing.subtotal;
      row.tax = order.pricing.tax;
      row.shipping = order.pricing.shipping;
      row.discount = order.pricing.discount;
      row.total = order.pricing.total;
      row.currency = order.pricing.currency;
    }

    if (includeFinancialData && order.payment) {
      row.paymentMethod = order.payment.method;
      row.paymentDate = order.payment.paymentDate ? format(new Date(order.payment.paymentDate), 'yyyy-MM-dd HH:mm:ss') : null;
      row.refundAmount = order.payment.refundAmount;
    }

    return row;
  }

  /**
   * Convert data to CSV format
   */
  private static convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value.toString();
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }

  /**
   * Convert data to Excel format
   */
  private static convertToExcel(data: any[]): Buffer {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Get revenue analytics data for export
   */
  private static async getRevenueAnalyticsData(startDate?: Date, endDate?: Date) {
    const defaultEndDate = endDate || new Date();
    const defaultStartDate = startDate || new Date(defaultEndDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    return await Order.aggregate([
      {
        $match: {
          'timestamps.createdAt': { $gte: defaultStartDate, $lte: defaultEndDate },
          'payment.status': 'paid'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamps.createdAt" } },
          date: { $first: { $dateToString: { format: "%Y-%m-%d", date: "$timestamps.createdAt" } } },
          totalRevenue: { $sum: '$pricing.total' },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: '$pricing.total' },
          totalItems: { $sum: { $sum: '$products.quantity' } }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  /**
   * Get customer analytics data for export
   */
  private static async getCustomerAnalyticsData(startDate?: Date, endDate?: Date) {
    const defaultEndDate = endDate || new Date();
    const defaultStartDate = startDate || new Date(defaultEndDate.getTime() - 90 * 24 * 60 * 60 * 1000);

    return await Order.aggregate([
      {
        $match: {
          'timestamps.createdAt': { $gte: defaultStartDate, $lte: defaultEndDate },
          'payment.status': 'paid'
        }
      },
      {
        $group: {
          _id: '$customer.email',
          email: { $first: '$customer.email' },
          customerType: { $first: '$customer.type' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$pricing.total' },
          averageOrderValue: { $avg: '$pricing.total' },
          firstOrder: { $min: '$timestamps.createdAt' },
          lastOrder: { $max: '$timestamps.createdAt' }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);
  }

  /**
   * Get product analytics data for export
   */
  private static async getProductAnalyticsData(startDate?: Date, endDate?: Date) {
    const defaultEndDate = endDate || new Date();
    const defaultStartDate = startDate || new Date(defaultEndDate.getTime() - 90 * 24 * 60 * 60 * 1000);

    return await Order.aggregate([
      {
        $match: {
          'timestamps.createdAt': { $gte: defaultStartDate, $lte: defaultEndDate },
          'payment.status': 'paid'
        }
      },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          productId: { $first: '$products.productId' },
          productName: { $first: '$products.name' },
          category: { $first: '$products.category' },
          brand: { $first: '$products.brand' },
          totalQuantity: { $sum: '$products.quantity' },
          totalRevenue: { $sum: '$products.totalPrice' },
          orderCount: { $sum: 1 },
          averagePrice: { $avg: '$products.unitPrice' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);
  }

  /**
   * Get geographic analytics data for export
   */
  private static async getGeographicAnalyticsData(startDate?: Date, endDate?: Date) {
    const defaultEndDate = endDate || new Date();
    const defaultStartDate = startDate || new Date(defaultEndDate.getTime() - 90 * 24 * 60 * 60 * 1000);

    return await Order.aggregate([
      {
        $match: {
          'timestamps.createdAt': { $gte: defaultStartDate, $lte: defaultEndDate },
          'payment.status': 'paid'
        }
      },
      {
        $group: {
          _id: {
            state: '$deliveryAddress.state',
            city: '$deliveryAddress.city'
          },
          state: { $first: '$deliveryAddress.state' },
          city: { $first: '$deliveryAddress.city' },
          orderCount: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.total' },
          averageOrderValue: { $avg: '$pricing.total' },
          uniqueCustomers: { $addToSet: '$customer.email' }
        }
      },
      {
        $project: {
          state: 1,
          city: 1,
          orderCount: 1,
          totalRevenue: 1,
          averageOrderValue: 1,
          uniqueCustomers: { $size: '$uniqueCustomers' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);
  }

  /**
   * Anonymize email for privacy
   */
  private static anonymizeEmail(email: string): string {
    const [username, domain] = email.split('@');
    const anonymizedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
    return `${anonymizedUsername}@${domain}`;
  }

  /**
   * Anonymize name for privacy
   */
  private static anonymizeName(name: string): string {
    if (!name || name.length <= 2) return name;
    return name.substring(0, 1) + '*'.repeat(name.length - 1);
  }
}

export default DataExporter;