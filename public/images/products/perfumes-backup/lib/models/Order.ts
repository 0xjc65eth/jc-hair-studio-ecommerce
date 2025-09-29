import { Schema, model, models, Document, Types } from 'mongoose';

/**
 * Interface for Order document structure
 * Defines the complete data model for e-commerce orders
 */
export interface IOrder extends Document {
  // Order Identification
  orderId: string;
  orderNumber: string;
  stripePaymentIntentId?: string;

  // Customer Information
  customer: {
    customerId?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    cpf?: string;
    type: 'retail' | 'professional';
  };

  // Products and Pricing
  products: Array<{
    productId: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    category?: string;
    sku?: string;
    brand?: string;
    size?: string;
    imageUrl?: string;
  }>;

  // Order Totals
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    currency: string;
  };

  // Payment Information
  payment: {
    status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
    method: 'stripe' | 'credit_card' | 'debit_card' | 'pix' | 'boleto' | 'paypal' | 'bank_transfer';
    transactionId?: string;
    stripeChargeId?: string;
    installments?: number;
    refundAmount?: number;
    refundReason?: string;
    refundDate?: Date;
    paymentDate?: Date;
    dueDate?: Date;
    pixCode?: string;
  };

  // Shipping Information
  shipping: {
    status: 'pending' | 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'returned' | 'cancelled';
    method: 'correios_pac' | 'correios_sedex' | 'transportadora' | 'retirada' | 'standard' | 'express' | 'overnight';
    carrier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
    shippingCost: number;
  };

  // Complete Delivery Address
  deliveryAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
    deliveryInstructions?: string;
  };

  // Billing Address (if different from delivery)
  billingAddress?: {
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };

  // Order Status History - Complete audit trail
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    changedBy: string; // user ID or system
    reason?: string;
    notes?: string;
    previousStatus?: string;
  }>;

  // Tracking Information
  tracking: {
    events: Array<{
      status: string;
      description: string;
      location?: string;
      timestamp: Date;
      carrier?: string;
    }>;
    lastUpdated?: Date;
    deliveryAttempts?: number;
    signedBy?: string;
  };

  // Notifications System
  notifications: {
    sent: Array<{
      type: 'order_confirmation' | 'payment_received' | 'order_shipped' | 'delivery_update' | 'order_delivered' | 'refund_processed';
      channel: 'email' | 'sms' | 'push' | 'webhook';
      recipient: string;
      sentAt: Date;
      status: 'sent' | 'delivered' | 'failed' | 'bounced';
      messageId?: string;
      errorMessage?: string;
      retryCount: number;
    }>;
    preferences: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };

  // Order Metadata
  metadata: {
    source: 'website' | 'mobile_app' | 'admin_panel' | 'api';
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    deviceType?: 'desktop' | 'mobile' | 'tablet';
  };

  // Customer Notes and Internal Notes
  notes: {
    customer?: string; // Notes from customer during checkout
    internal: Array<{
      note: string;
      addedBy: string;
      addedAt: Date;
      category?: 'general' | 'payment' | 'shipping' | 'customer_service';
    }>;
  };

  // Timestamps and Audit Information
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    cancelledAt?: Date;
  };

  // Audit Log - Comprehensive change tracking
  auditLog: Array<{
    action: 'created' | 'updated' | 'status_changed' | 'payment_updated' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    performedBy: string; // user ID or system identifier
    timestamp: Date;
    changes: Array<{
      field: string;
      oldValue: any;
      newValue: any;
    }>;
    ipAddress?: string;
    userAgent?: string;
  }>;

  // Additional Business Fields
  tags?: string[]; // For categorization and filtering
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  isGift?: boolean;
  giftMessage?: string;
  specialInstructions?: string;

  // Financial Information
  financial: {
    taxDetails?: Array<{
      type: string;
      rate: number;
      amount: number;
      jurisdiction: string;
    }>;
    discountDetails?: Array<{
      code: string;
      type: 'percentage' | 'fixed';
      amount: number;
      description?: string;
    }>;
  };

  // Virtual properties for backward compatibility
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  timeline: Array<{
    status: string;
    date: Date;
    note?: string;
  }>;
}

/**
 * MongoDB Schema for Order collection
 * Comprehensive e-commerce order management system
 */
const OrderSchema = new Schema<IOrder>({
  // Order Identification - Unique identifiers for tracking
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    uppercase: true
  },

  orderNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true
  },

  stripePaymentIntentId: {
    type: String,
    sparse: true,
    index: true
  },

  // Customer Information - Essential contact details
  customer: {
    customerId: {
      type: String,
      index: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    cpf: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['retail', 'professional'],
      default: 'retail'
    }
  },

  // Products - Detailed product information with pricing
  products: [{
    productId: {
      type: String,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      trim: true
    },
    sku: {
      type: String,
      trim: true
    },
    brand: {
      type: String,
      trim: true
    },
    size: {
      type: String,
      trim: true
    },
    imageUrl: {
      type: String,
      trim: true
    }
  }],

  // Pricing - Complete financial breakdown
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    shipping: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      default: 'BRL',
      enum: ['USD', 'EUR', 'GBP', 'BRL', 'CAD']
    }
  },

  // Payment - Complete payment lifecycle tracking
  payment: {
    status: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
      index: true
    },
    method: {
      type: String,
      required: true,
      enum: ['stripe', 'credit_card', 'debit_card', 'pix', 'boleto', 'paypal', 'bank_transfer'],
      default: 'stripe'
    },
    transactionId: {
      type: String,
      sparse: true,
      index: true
    },
    stripeChargeId: {
      type: String,
      sparse: true
    },
    installments: {
      type: Number,
      default: 1,
      min: 1,
      max: 12
    },
    refundAmount: {
      type: Number,
      min: 0
    },
    refundReason: {
      type: String,
      trim: true
    },
    refundDate: {
      type: Date
    },
    paymentDate: {
      type: Date,
      index: true
    },
    dueDate: {
      type: Date
    },
    pixCode: {
      type: String,
      trim: true
    }
  },

  // Shipping - Complete fulfillment tracking
  shipping: {
    status: {
      type: String,
      required: true,
      enum: ['pending', 'preparing', 'shipped', 'in_transit', 'delivered', 'returned', 'cancelled'],
      default: 'pending',
      index: true
    },
    method: {
      type: String,
      required: true,
      enum: ['correios_pac', 'correios_sedex', 'transportadora', 'retirada', 'standard', 'express', 'overnight'],
      default: 'correios_pac'
    },
    carrier: {
      type: String,
      trim: true
    },
    trackingNumber: {
      type: String,
      trim: true,
      sparse: true,
      index: true
    },
    trackingUrl: {
      type: String,
      trim: true
    },
    estimatedDelivery: {
      type: Date,
      index: true
    },
    actualDelivery: {
      type: Date,
      index: true
    },
    shippingCost: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },

  // Delivery Address - Complete shipping destination
  deliveryAddress: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    street: {
      type: String,
      required: true,
      trim: true
    },
    number: {
      type: String,
      required: true,
      trim: true
    },
    complement: {
      type: String,
      trim: true
    },
    neighborhood: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    country: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      default: 'BR'
    },
    phone: {
      type: String,
      trim: true
    },
    deliveryInstructions: {
      type: String,
      trim: true
    }
  },

  // Billing Address - Optional separate billing information
  billingAddress: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    street: {
      type: String,
      trim: true
    },
    number: {
      type: String,
      trim: true
    },
    complement: {
      type: String,
      trim: true
    },
    neighborhood: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      uppercase: true
    },
    phone: {
      type: String,
      trim: true
    }
  },

  // Status History - Complete audit trail of status changes
  statusHistory: [{
    status: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    changedBy: {
      type: String,
      required: true,
      trim: true
    },
    reason: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    previousStatus: {
      type: String,
      trim: true
    }
  }],

  // Tracking - Detailed shipment tracking information
  tracking: {
    events: [{
      status: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true,
        trim: true
      },
      location: {
        type: String,
        trim: true
      },
      timestamp: {
        type: Date,
        required: true,
        index: true
      },
      carrier: {
        type: String,
        trim: true
      }
    }],
    lastUpdated: {
      type: Date,
      index: true
    },
    deliveryAttempts: {
      type: Number,
      min: 0,
      default: 0
    },
    signedBy: {
      type: String,
      trim: true
    }
  },

  // Notifications - Complete notification management system
  notifications: {
    sent: [{
      type: {
        type: String,
        required: true,
        enum: ['order_confirmation', 'payment_received', 'order_shipped', 'delivery_update', 'order_delivered', 'refund_processed']
      },
      channel: {
        type: String,
        required: true,
        enum: ['email', 'sms', 'push', 'webhook']
      },
      recipient: {
        type: String,
        required: true,
        trim: true
      },
      sentAt: {
        type: Date,
        required: true,
        index: true
      },
      status: {
        type: String,
        required: true,
        enum: ['sent', 'delivered', 'failed', 'bounced'],
        default: 'sent'
      },
      messageId: {
        type: String,
        trim: true
      },
      errorMessage: {
        type: String,
        trim: true
      },
      retryCount: {
        type: Number,
        min: 0,
        default: 0
      }
    }],
    preferences: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },

  // Metadata - Order context and source information
  metadata: {
    source: {
      type: String,
      required: true,
      enum: ['website', 'mobile_app', 'admin_panel', 'api'],
      default: 'website'
    },
    userAgent: {
      type: String,
      trim: true
    },
    ipAddress: {
      type: String,
      trim: true
    },
    referrer: {
      type: String,
      trim: true
    },
    utmSource: {
      type: String,
      trim: true
    },
    utmMedium: {
      type: String,
      trim: true
    },
    utmCampaign: {
      type: String,
      trim: true
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet']
    }
  },

  // Notes - Customer and internal documentation
  notes: {
    customer: {
      type: String,
      trim: true
    },
    internal: [{
      note: {
        type: String,
        required: true,
        trim: true
      },
      addedBy: {
        type: String,
        required: true,
        trim: true
      },
      addedAt: {
        type: Date,
        required: true,
        default: Date.now
      },
      category: {
        type: String,
        enum: ['general', 'payment', 'shipping', 'customer_service'],
        default: 'general'
      }
    }]
  },

  // Timestamps - Essential date tracking
  timestamps: {
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    completedAt: {
      type: Date,
      index: true
    },
    cancelledAt: {
      type: Date,
      index: true
    }
  },

  // Audit Log - Comprehensive change tracking for compliance
  auditLog: [{
    action: {
      type: String,
      required: true,
      enum: ['created', 'updated', 'status_changed', 'payment_updated', 'shipped', 'delivered', 'cancelled', 'refunded']
    },
    performedBy: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    changes: [{
      field: {
        type: String,
        required: true,
        trim: true
      },
      oldValue: {
        type: Schema.Types.Mixed
      },
      newValue: {
        type: Schema.Types.Mixed
      }
    }],
    ipAddress: {
      type: String,
      trim: true
    },
    userAgent: {
      type: String,
      trim: true
    }
  }],

  // Additional Business Fields
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
    index: true
  },

  isGift: {
    type: Boolean,
    default: false,
    index: true
  },

  giftMessage: {
    type: String,
    trim: true
  },

  specialInstructions: {
    type: String,
    trim: true
  },

  // Financial Information - Advanced financial tracking
  financial: {
    taxDetails: [{
      type: {
        type: String,
        required: true,
        trim: true
      },
      rate: {
        type: Number,
        required: true,
        min: 0,
        max: 1
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      jurisdiction: {
        type: String,
        required: true,
        trim: true
      }
    }],
    discountDetails: [{
      code: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
      },
      type: {
        type: String,
        required: true,
        enum: ['percentage', 'fixed']
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      description: {
        type: String,
        trim: true
      }
    }]
  }
}, {
  // Schema Options
  timestamps: {
    createdAt: 'timestamps.createdAt',
    updatedAt: 'timestamps.updatedAt'
  },
  collection: 'orders',
  versionKey: '__v'
});

// Indexes for optimal query performance and analytics
OrderSchema.index({ 'customer.email': 1, 'timestamps.createdAt': -1 });
OrderSchema.index({ 'payment.status': 1, 'shipping.status': 1 });
OrderSchema.index({ 'deliveryAddress.zipCode': 1 });
OrderSchema.index({ 'metadata.source': 1, 'timestamps.createdAt': -1 });
OrderSchema.index({ 'tags': 1 });
OrderSchema.index({ 'priority': 1, 'timestamps.createdAt': -1 });

// Analytics-focused indexes
OrderSchema.index({ 'pricing.total': 1, 'timestamps.createdAt': -1 });
OrderSchema.index({ 'customer.type': 1, 'pricing.total': 1 });
OrderSchema.index({ 'products.category': 1, 'timestamps.createdAt': -1 });
OrderSchema.index({ 'products.brand': 1, 'pricing.total': 1 });
OrderSchema.index({ 'deliveryAddress.city': 1, 'deliveryAddress.state': 1 });
OrderSchema.index({ 'payment.method': 1, 'payment.status': 1 });
OrderSchema.index({ 'shipping.method': 1, 'shipping.status': 1 });
OrderSchema.index({ 'metadata.utmSource': 1, 'metadata.utmCampaign': 1 });

// Compound indexes for complex analytics queries
OrderSchema.index({
  'payment.status': 1,
  'timestamps.createdAt': -1,
  'pricing.total': 1
});
OrderSchema.index({
  'customer.type': 1,
  'deliveryAddress.state': 1,
  'timestamps.createdAt': -1
});
OrderSchema.index({
  'products.category': 1,
  'products.brand': 1,
  'timestamps.createdAt': -1
});

// Pre-save middleware for automatic audit logging and order number generation
OrderSchema.pre('save', function(next) {
  const order = this as IOrder;

  // Generate order number if not exists
  if (!order.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    order.orderNumber = `62B${timestamp.slice(-6)}${random}`;
  }

  // Generate orderId if not exists
  if (!order.orderId) {
    order.orderId = order.orderNumber;
  }

  // Update the updatedAt timestamp
  order.timestamps.updatedAt = new Date();

  // Add to audit log if this is an update (not creation)
  if (!order.isNew && order.isModified()) {
    const modifiedPaths = order.modifiedPaths();
    const changes = modifiedPaths.map(path => ({
      field: path,
      oldValue: order.$__getOriginal ? order.$__getOriginal(path) : undefined,
      newValue: order.get(path)
    }));

    order.auditLog.push({
      action: 'updated',
      performedBy: 'system', // This should be set by the application
      timestamp: new Date(),
      changes: changes
    });
  }

  // Add to status history if status changed
  if (order.isModified('payment.status') || order.isModified('shipping.status')) {
    const newStatus = order.payment.status || order.shipping.status;
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      changedBy: 'system',
      reason: `Status changed to ${newStatus}`,
      previousStatus: order.$__getOriginal ? order.$__getOriginal('payment.status') || order.$__getOriginal('shipping.status') : undefined
    });
  }

  next();
});

// Static methods for common queries
OrderSchema.statics.findByCustomerEmail = function(email: string) {
  return this.find({ 'customer.email': email }).sort({ 'timestamps.createdAt': -1 });
};

OrderSchema.statics.findByStatus = function(paymentStatus?: string, shippingStatus?: string) {
  const query: any = {};
  if (paymentStatus) query['payment.status'] = paymentStatus;
  if (shippingStatus) query['shipping.status'] = shippingStatus;
  return this.find(query).sort({ 'timestamps.createdAt': -1 });
};

OrderSchema.statics.findByDateRange = function(startDate: Date, endDate: Date) {
  return this.find({
    'timestamps.createdAt': {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ 'timestamps.createdAt': -1 });
};

// Analytics static methods
OrderSchema.statics.getRevenueByPeriod = function(startDate: Date, endDate: Date, groupBy: 'day' | 'week' | 'month' = 'day') {
  const groupByFormat = {
    day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamps.createdAt" } },
    week: { $dateToString: { format: "%Y-W%U", date: "$timestamps.createdAt" } },
    month: { $dateToString: { format: "%Y-%m", date: "$timestamps.createdAt" } }
  };

  return this.aggregate([
    {
      $match: {
        'timestamps.createdAt': { $gte: startDate, $lte: endDate },
        'payment.status': 'paid'
      }
    },
    {
      $group: {
        _id: groupByFormat[groupBy],
        totalRevenue: { $sum: '$pricing.total' },
        orderCount: { $sum: 1 },
        averageOrderValue: { $avg: '$pricing.total' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

OrderSchema.statics.getTopProducts = function(startDate: Date, endDate: Date, limit: number = 10) {
  return this.aggregate([
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
        productName: { $first: '$products.name' },
        category: { $first: '$products.category' },
        brand: { $first: '$products.brand' },
        totalQuantity: { $sum: '$products.quantity' },
        totalRevenue: { $sum: '$products.totalPrice' },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: limit }
  ]);
};

OrderSchema.statics.getCustomerSegmentation = function() {
  return this.aggregate([
    {
      $match: {
        'payment.status': 'paid'
      }
    },
    {
      $group: {
        _id: '$customer.email',
        customerType: { $first: '$customer.type' },
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' },
        firstOrder: { $min: '$timestamps.createdAt' },
        lastOrder: { $max: '$timestamps.createdAt' }
      }
    },
    {
      $addFields: {
        customerLifetime: {
          $divide: [
            { $subtract: ['$lastOrder', '$firstOrder'] },
            1000 * 60 * 60 * 24
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
        }
      }
    }
  ]);
};

OrderSchema.statics.getGeographicDistribution = function(startDate: Date, endDate: Date) {
  return this.aggregate([
    {
      $match: {
        'timestamps.createdAt': { $gte: startDate, $lte: endDate },
        'payment.status': 'paid'
      }
    },
    {
      $group: {
        _id: {
          state: '$deliveryAddress.state',
          city: '$deliveryAddress.city'
        },
        orderCount: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);
};

OrderSchema.statics.getConversionFunnel = function(startDate: Date, endDate: Date) {
  return this.aggregate([
    {
      $match: {
        'timestamps.createdAt': { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$payment.status', 'pending'] }, 1, 0] }
        },
        paidOrders: {
          $sum: { $cond: [{ $eq: ['$payment.status', 'paid'] }, 1, 0] }
        },
        shippedOrders: {
          $sum: { $cond: [{ $eq: ['$shipping.status', 'shipped'] }, 1, 0] }
        },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ['$shipping.status', 'delivered'] }, 1, 0] }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$payment.status', 'failed'] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalOrders: 1,
        pendingOrders: 1,
        paidOrders: 1,
        shippedOrders: 1,
        deliveredOrders: 1,
        cancelledOrders: 1,
        paymentConversionRate: {
          $multiply: [{ $divide: ['$paidOrders', '$totalOrders'] }, 100]
        },
        fulfillmentRate: {
          $multiply: [{ $divide: ['$deliveredOrders', '$paidOrders'] }, 100]
        },
        cancellationRate: {
          $multiply: [{ $divide: ['$cancelledOrders', '$totalOrders'] }, 100]
        }
      }
    }
  ]);
};

// Instance methods for order management
OrderSchema.methods.updateStatus = function(newStatus: string, changedBy: string, reason?: string) {
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    changedBy: changedBy,
    reason: reason,
    previousStatus: this.payment.status || this.shipping.status
  });

  this.auditLog.push({
    action: 'status_changed',
    performedBy: changedBy,
    timestamp: new Date(),
    changes: [{
      field: 'status',
      oldValue: this.payment.status || this.shipping.status,
      newValue: newStatus
    }]
  });
};

OrderSchema.methods.addNotification = function(notification: any) {
  this.notifications.sent.push({
    ...notification,
    sentAt: new Date(),
    retryCount: 0
  });
};

OrderSchema.methods.addTrackingEvent = function(event: any) {
  this.tracking.events.push({
    ...event,
    timestamp: new Date()
  });
  this.tracking.lastUpdated = new Date();
};

// Virtual properties for backward compatibility
OrderSchema.virtual('status').get(function() {
  // Return the most relevant status for backward compatibility
  if (this.shipping.status === 'delivered') return 'delivered';
  if (this.shipping.status === 'shipped') return 'shipped';
  if (this.shipping.status === 'preparing') return 'processing';
  if (this.payment.status === 'paid') return 'confirmed';
  if (this.payment.status === 'failed') return 'cancelled';
  return 'pending';
});

OrderSchema.virtual('timeline').get(function() {
  // Convert statusHistory to timeline format for backward compatibility
  return this.statusHistory.map(entry => ({
    status: entry.status,
    date: entry.timestamp,
    note: entry.notes || entry.reason
  }));
});

// Virtual methods for business logic
OrderSchema.virtual('canCancel').get(function() {
  const currentStatus = this.status;
  return ['pending', 'confirmed'].includes(currentStatus);
});

OrderSchema.virtual('canReturn').get(function() {
  if (this.shipping.status !== 'delivered') return false;

  const deliveredEvent = this.statusHistory.find(entry => entry.status === 'delivered');
  if (!deliveredEvent) return false;

  const deliveryDate = deliveredEvent.timestamp;
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - deliveryDate.getTime() <= sevenDaysInMs;
});

OrderSchema.virtual('totalItems').get(function() {
  return this.products.reduce((total, product) => total + product.quantity, 0);
});

OrderSchema.virtual('estimatedDeliveryRange').get(function() {
  if (!this.shipping.estimatedDelivery) return null;

  const estimatedDate = new Date(this.shipping.estimatedDelivery);
  const minDate = new Date(estimatedDate);
  minDate.setDate(estimatedDate.getDate() - 1);
  const maxDate = new Date(estimatedDate);
  maxDate.setDate(estimatedDate.getDate() + 1);

  return {
    min: minDate,
    max: maxDate,
    estimated: estimatedDate
  };
});

// Export the model
export const Order = models.Order || model<IOrder>('Order', OrderSchema);
export default Order;