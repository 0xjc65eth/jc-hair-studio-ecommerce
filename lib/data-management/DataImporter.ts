import { Order, IOrder } from '../models/Order';
import { connectDB } from '../mongodb';
import * as XLSX from 'xlsx';

/**
 * Data Import System
 * Provides comprehensive data import functionality with validation and error handling
 */

export interface ImportOptions {
  format: 'csv' | 'excel' | 'json';
  validateOnly?: boolean;
  skipDuplicates?: boolean;
  updateExisting?: boolean;
  batchSize?: number;
  mapping?: Record<string, string>;
}

export interface ImportResult {
  success: boolean;
  totalRecords: number;
  processedRecords: number;
  successfulImports: number;
  skippedRecords: number;
  failedRecords: number;
  errors: ImportError[];
  duplicates: string[];
  warnings: string[];
}

export interface ImportError {
  row: number;
  field?: string;
  value?: any;
  message: string;
  severity: 'error' | 'warning';
}

export interface OrderImportData {
  orderNumber?: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerType?: 'retail' | 'professional';
  customerPhone?: string;
  productId: string;
  productName: string;
  productCategory?: string;
  productBrand?: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  deliveryStreet: string;
  deliveryNumber: string;
  deliveryNeighborhood: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  deliveryCountry?: string;
  paymentMethod?: string;
  shippingMethod?: string;
  orderDate?: string;
  specialInstructions?: string;
}

export class DataImporter {
  /**
   * Import orders from various data sources
   */
  static async importOrders(
    data: string | Buffer,
    options: ImportOptions
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      totalRecords: 0,
      processedRecords: 0,
      successfulImports: 0,
      skippedRecords: 0,
      failedRecords: 0,
      errors: [],
      duplicates: [],
      warnings: []
    };

    try {
      await connectDB();

      // Parse data based on format
      let parsedData: any[];
      switch (options.format) {
        case 'csv':
          parsedData = this.parseCSV(data as string);
          break;
        case 'excel':
          parsedData = this.parseExcel(data as Buffer);
          break;
        case 'json':
          parsedData = JSON.parse(data as string);
          break;
        default:
          throw new Error(`Unsupported import format: ${options.format}`);
      }

      result.totalRecords = parsedData.length;

      if (result.totalRecords === 0) {
        result.errors.push({
          row: 0,
          message: 'No data found in import file',
          severity: 'error'
        });
        return result;
      }

      // Apply field mapping if provided
      if (options.mapping) {
        parsedData = this.applyFieldMapping(parsedData, options.mapping);
      }

      // Validate data structure
      const validationErrors = this.validateDataStructure(parsedData);
      if (validationErrors.length > 0) {
        result.errors.push(...validationErrors);
        if (options.validateOnly) {
          return result;
        }
      }

      // Group data by order (since CSV might have multiple product rows per order)
      const groupedOrders = this.groupDataByOrder(parsedData);

      // Process orders in batches
      const batchSize = options.batchSize || 50;
      const orderEntries = Object.entries(groupedOrders);

      for (let i = 0; i < orderEntries.length; i += batchSize) {
        const batch = orderEntries.slice(i, i + batchSize);
        const batchResult = await this.processBatch(batch, options, result.errors);

        result.processedRecords += batchResult.processed;
        result.successfulImports += batchResult.successful;
        result.skippedRecords += batchResult.skipped;
        result.failedRecords += batchResult.failed;
        result.duplicates.push(...batchResult.duplicates);
        result.warnings.push(...batchResult.warnings);
      }

      result.success = result.successfulImports > 0;

      return result;

    } catch (error) {
      result.errors.push({
        row: 0,
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });
      return result;
    }
  }

  /**
   * Import customer data
   */
  static async importCustomers(
    data: string | Buffer,
    options: ImportOptions
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      totalRecords: 0,
      processedRecords: 0,
      successfulImports: 0,
      skippedRecords: 0,
      failedRecords: 0,
      errors: [],
      duplicates: [],
      warnings: []
    };

    try {
      await connectDB();

      // Parse data
      let parsedData: any[];
      switch (options.format) {
        case 'csv':
          parsedData = this.parseCSV(data as string);
          break;
        case 'excel':
          parsedData = this.parseExcel(data as Buffer);
          break;
        case 'json':
          parsedData = JSON.parse(data as string);
          break;
        default:
          throw new Error(`Unsupported import format: ${options.format}`);
      }

      result.totalRecords = parsedData.length;

      // Validate customer data
      for (let i = 0; i < parsedData.length; i++) {
        const customer = parsedData[i];
        const errors = this.validateCustomerData(customer, i + 1);

        if (errors.length > 0) {
          result.errors.push(...errors);
          result.failedRecords++;
          continue;
        }

        // Check for duplicates
        if (options.skipDuplicates) {
          const existing = await Order.findOne({ 'customer.email': customer.email });
          if (existing) {
            result.duplicates.push(customer.email);
            result.skippedRecords++;
            continue;
          }
        }

        result.processedRecords++;
      }

      result.success = result.processedRecords > 0;
      return result;

    } catch (error) {
      result.errors.push({
        row: 0,
        message: `Customer import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });
      return result;
    }
  }

  /**
   * Bulk data validation without import
   */
  static async validateData(
    data: string | Buffer,
    dataType: 'orders' | 'customers',
    format: 'csv' | 'excel' | 'json'
  ): Promise<ImportResult> {
    const options: ImportOptions = {
      format,
      validateOnly: true
    };

    switch (dataType) {
      case 'orders':
        return await this.importOrders(data, options);
      case 'customers':
        return await this.importCustomers(data, options);
      default:
        throw new Error(`Unsupported data type: ${dataType}`);
    }
  }

  /**
   * Parse CSV data
   */
  private static parseCSV(csvData: string): any[] {
    const lines = csvData.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim() || '';
        });
        data.push(row);
      }
    }

    return data;
  }

  /**
   * Parse CSV line handling quoted values
   */
  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  /**
   * Parse Excel data
   */
  private static parseExcel(excelData: Buffer): any[] {
    const workbook = XLSX.read(excelData, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(worksheet);
  }

  /**
   * Apply field mapping to transform data
   */
  private static applyFieldMapping(data: any[], mapping: Record<string, string>): any[] {
    return data.map(row => {
      const mappedRow: any = {};
      Object.entries(row).forEach(([key, value]) => {
        const mappedKey = mapping[key] || key;
        mappedRow[mappedKey] = value;
      });
      return mappedRow;
    });
  }

  /**
   * Validate data structure
   */
  private static validateDataStructure(data: any[]): ImportError[] {
    const errors: ImportError[] = [];
    const requiredFields = ['customerEmail', 'customerFirstName', 'customerLastName', 'productId', 'productName', 'quantity', 'unitPrice'];

    if (data.length === 0) {
      errors.push({
        row: 0,
        message: 'No data rows found',
        severity: 'error'
      });
      return errors;
    }

    // Check if required fields exist in first row
    const firstRow = data[0];
    const availableFields = Object.keys(firstRow);

    requiredFields.forEach(field => {
      if (!availableFields.includes(field)) {
        errors.push({
          row: 0,
          field,
          message: `Required field '${field}' is missing`,
          severity: 'error'
        });
      }
    });

    return errors;
  }

  /**
   * Group data by order number or email+date
   */
  private static groupDataByOrder(data: any[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {};

    data.forEach(row => {
      const orderKey = row.orderNumber || `${row.customerEmail}_${row.orderDate || 'default'}`;

      if (!grouped[orderKey]) {
        grouped[orderKey] = [];
      }

      grouped[orderKey].push(row);
    });

    return grouped;
  }

  /**
   * Process a batch of orders
   */
  private static async processBatch(
    batch: [string, any[]][],
    options: ImportOptions,
    globalErrors: ImportError[]
  ): Promise<{
    processed: number;
    successful: number;
    skipped: number;
    failed: number;
    duplicates: string[];
    warnings: string[];
  }> {
    const result = {
      processed: 0,
      successful: 0,
      skipped: 0,
      failed: 0,
      duplicates: [],
      warnings: []
    };

    for (const [orderKey, orderRows] of batch) {
      try {
        result.processed++;

        // Validate order data
        const validationErrors = this.validateOrderData(orderRows);
        if (validationErrors.length > 0) {
          globalErrors.push(...validationErrors);
          result.failed++;
          continue;
        }

        // Check for duplicates
        const firstRow = orderRows[0];
        const existingOrder = await Order.findOne({
          $or: [
            { orderNumber: firstRow.orderNumber },
            { 'customer.email': firstRow.customerEmail, 'timestamps.createdAt': { $gte: new Date(firstRow.orderDate || Date.now()) } }
          ]
        });

        if (existingOrder) {
          if (options.skipDuplicates) {
            result.duplicates.push(firstRow.orderNumber || orderKey);
            result.skipped++;
            continue;
          } else if (options.updateExisting) {
            // Update existing order logic would go here
            result.warnings.push(`Order ${orderKey} updated`);
          }
        }

        if (options.validateOnly) {
          result.successful++;
          continue;
        }

        // Create order
        const orderData = this.transformToOrderData(orderRows);
        const order = new Order(orderData);
        await order.save();

        result.successful++;

      } catch (error) {
        globalErrors.push({
          row: 0,
          message: `Failed to process order ${orderKey}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error'
        });
        result.failed++;
      }
    }

    return result;
  }

  /**
   * Validate order data
   */
  private static validateOrderData(orderRows: any[]): ImportError[] {
    const errors: ImportError[] = [];

    if (orderRows.length === 0) {
      errors.push({
        row: 0,
        message: 'No product rows found for order',
        severity: 'error'
      });
      return errors;
    }

    const firstRow = orderRows[0];

    // Validate required fields
    if (!firstRow.customerEmail || !this.isValidEmail(firstRow.customerEmail)) {
      errors.push({
        row: 0,
        field: 'customerEmail',
        value: firstRow.customerEmail,
        message: 'Invalid or missing customer email',
        severity: 'error'
      });
    }

    if (!firstRow.customerFirstName) {
      errors.push({
        row: 0,
        field: 'customerFirstName',
        message: 'Customer first name is required',
        severity: 'error'
      });
    }

    if (!firstRow.customerLastName) {
      errors.push({
        row: 0,
        field: 'customerLastName',
        message: 'Customer last name is required',
        severity: 'error'
      });
    }

    // Validate products
    orderRows.forEach((row, index) => {
      if (!row.productId) {
        errors.push({
          row: index + 1,
          field: 'productId',
          message: 'Product ID is required',
          severity: 'error'
        });
      }

      if (!row.productName) {
        errors.push({
          row: index + 1,
          field: 'productName',
          message: 'Product name is required',
          severity: 'error'
        });
      }

      const quantity = parseFloat(row.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        errors.push({
          row: index + 1,
          field: 'quantity',
          value: row.quantity,
          message: 'Quantity must be a positive number',
          severity: 'error'
        });
      }

      const unitPrice = parseFloat(row.unitPrice);
      if (isNaN(unitPrice) || unitPrice < 0) {
        errors.push({
          row: index + 1,
          field: 'unitPrice',
          value: row.unitPrice,
          message: 'Unit price must be a non-negative number',
          severity: 'error'
        });
      }
    });

    return errors;
  }

  /**
   * Validate customer data
   */
  private static validateCustomerData(customer: any, rowNumber: number): ImportError[] {
    const errors: ImportError[] = [];

    if (!customer.email || !this.isValidEmail(customer.email)) {
      errors.push({
        row: rowNumber,
        field: 'email',
        value: customer.email,
        message: 'Invalid or missing email address',
        severity: 'error'
      });
    }

    if (!customer.firstName) {
      errors.push({
        row: rowNumber,
        field: 'firstName',
        message: 'First name is required',
        severity: 'error'
      });
    }

    if (!customer.lastName) {
      errors.push({
        row: rowNumber,
        field: 'lastName',
        message: 'Last name is required',
        severity: 'error'
      });
    }

    return errors;
  }

  /**
   * Transform imported data to Order schema format
   */
  private static transformToOrderData(orderRows: any[]): Partial<IOrder> {
    const firstRow = orderRows[0];

    const orderData: Partial<IOrder> = {
      orderNumber: firstRow.orderNumber || undefined,
      customer: {
        email: firstRow.customerEmail.toLowerCase().trim(),
        firstName: firstRow.customerFirstName.trim(),
        lastName: firstRow.customerLastName.trim(),
        type: firstRow.customerType || 'retail',
        phone: firstRow.customerPhone || undefined
      },
      products: orderRows.map(row => ({
        productId: row.productId,
        name: row.productName,
        category: row.productCategory || '',
        brand: row.productBrand || '',
        sku: row.productSku || '',
        quantity: parseInt(row.quantity),
        unitPrice: parseFloat(row.unitPrice),
        totalPrice: parseInt(row.quantity) * parseFloat(row.unitPrice),
        description: row.productDescription || ''
      })),
      deliveryAddress: {
        firstName: firstRow.customerFirstName,
        lastName: firstRow.customerLastName,
        street: firstRow.deliveryStreet || '',
        number: firstRow.deliveryNumber || '',
        neighborhood: firstRow.deliveryNeighborhood || '',
        city: firstRow.deliveryCity || '',
        state: firstRow.deliveryState || '',
        zipCode: firstRow.deliveryZipCode || '',
        country: firstRow.deliveryCountry || 'BR'
      },
      payment: {
        status: 'pending',
        method: firstRow.paymentMethod || 'stripe'
      },
      shipping: {
        status: 'pending',
        method: firstRow.shippingMethod || 'standard',
        shippingCost: 0
      },
      timestamps: {
        createdAt: firstRow.orderDate ? new Date(firstRow.orderDate) : new Date(),
        updatedAt: new Date()
      },
      metadata: {
        source: 'api'
      },
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        changedBy: 'import-system',
        reason: 'Order imported from data file'
      }],
      tracking: {
        events: []
      },
      notifications: {
        sent: [],
        preferences: {
          email: true,
          sms: false,
          push: false
        }
      },
      notes: {
        internal: [{
          note: 'Order imported from external data source',
          addedBy: 'import-system',
          addedAt: new Date(),
          category: 'general'
        }]
      },
      auditLog: [{
        action: 'created',
        performedBy: 'import-system',
        timestamp: new Date(),
        changes: []
      }],
      specialInstructions: firstRow.specialInstructions || '',
      financial: {
        discountDetails: [],
        taxDetails: []
      }
    };

    // Calculate pricing
    const subtotal = orderData.products!.reduce((sum, product) => sum + product.totalPrice, 0);
    orderData.pricing = {
      subtotal,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: subtotal,
      currency: 'BRL'
    };

    return orderData;
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generate import template
   */
  static generateImportTemplate(dataType: 'orders' | 'customers', format: 'csv' | 'excel'): string | Buffer {
    const templates = {
      orders: {
        csv: this.generateOrdersCSVTemplate(),
        excel: this.generateOrdersExcelTemplate()
      },
      customers: {
        csv: this.generateCustomersCSVTemplate(),
        excel: this.generateCustomersExcelTemplate()
      }
    };

    return templates[dataType][format];
  }

  /**
   * Generate orders CSV template
   */
  private static generateOrdersCSVTemplate(): string {
    const headers = [
      'orderNumber', 'customerEmail', 'customerFirstName', 'customerLastName', 'customerType', 'customerPhone',
      'productId', 'productName', 'productCategory', 'productBrand', 'productSku', 'quantity', 'unitPrice',
      'deliveryStreet', 'deliveryNumber', 'deliveryNeighborhood', 'deliveryCity', 'deliveryState', 'deliveryZipCode',
      'paymentMethod', 'shippingMethod', 'orderDate', 'specialInstructions'
    ];

    const sampleRow = [
      'ORD001', 'customer@example.com', 'João', 'Silva', 'retail', '11999999999',
      'PROD001', 'Shampoo Premium', 'Hair Care', 'Brand A', 'SKU001', '2', '29.90',
      'Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234-567',
      'stripe', 'standard', '2024-01-15', 'Entregar na portaria'
    ];

    return headers.join(',') + '\n' + sampleRow.join(',');
  }

  /**
   * Generate orders Excel template
   */
  private static generateOrdersExcelTemplate(): Buffer {
    const data = [
      {
        orderNumber: 'ORD001',
        customerEmail: 'customer@example.com',
        customerFirstName: 'João',
        customerLastName: 'Silva',
        customerType: 'retail',
        customerPhone: '11999999999',
        productId: 'PROD001',
        productName: 'Shampoo Premium',
        productCategory: 'Hair Care',
        productBrand: 'Brand A',
        productSku: 'SKU001',
        quantity: 2,
        unitPrice: 29.90,
        deliveryStreet: 'Rua das Flores',
        deliveryNumber: '123',
        deliveryNeighborhood: 'Centro',
        deliveryCity: 'São Paulo',
        deliveryState: 'SP',
        deliveryZipCode: '01234-567',
        paymentMethod: 'stripe',
        shippingMethod: 'standard',
        orderDate: '2024-01-15',
        specialInstructions: 'Entregar na portaria'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders Template');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Generate customers CSV template
   */
  private static generateCustomersCSVTemplate(): string {
    const headers = ['email', 'firstName', 'lastName', 'type', 'phone'];
    const sampleRow = ['customer@example.com', 'João', 'Silva', 'retail', '11999999999'];

    return headers.join(',') + '\n' + sampleRow.join(',');
  }

  /**
   * Generate customers Excel template
   */
  private static generateCustomersExcelTemplate(): Buffer {
    const data = [
      {
        email: 'customer@example.com',
        firstName: 'João',
        lastName: 'Silva',
        type: 'retail',
        phone: '11999999999'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers Template');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}

export default DataImporter;