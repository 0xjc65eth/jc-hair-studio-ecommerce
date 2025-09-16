/**
 * Order Schema - MongoDB with Zod validation
 * JC Hair Studio's 62's 62 E-commerce
 */

import { Schema, model, models, Document } from 'mongoose';
import { z } from 'zod';
import { AddressZodSchema } from './user.schema';

// Zod validation schemas
export const OrderItemZodSchema = z.object({
  productId: z.string().min(1, 'ID do produto obrigatório'),
  variantId: z.string().optional(),
  name: z.string().min(1, 'Nome do produto obrigatório'),
  sku: z.string().min(1, 'SKU obrigatório'),
  quantity: z.number().int().min(1, 'Quantidade deve ser pelo menos 1'),
  unitPrice: z.number().min(0, 'Preço unitário deve ser positivo'),
  totalPrice: z.number().min(0, 'Preço total deve ser positivo'),
  image: z.string().url('URL da imagem inválida').optional(),
  variant: z.object({
    type: z.string(),
    value: z.string(),
  }).optional(),
});

export const PaymentZodSchema = z.object({
  method: z.enum(['credit_card', 'debit_card', 'pix', 'boleto', 'wallet'], {
    required_error: 'Método de pagamento obrigatório',
  }),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded']).default('pending'),
  transactionId: z.string().optional(),
  gatewayResponse: z.record(z.unknown()).optional(),
  amount: z.number().min(0, 'Valor deve ser positivo'),
  currency: z.string().default('BRL'),
  processedAt: z.date().optional(),
  failureReason: z.string().optional(),
});

export const ShippingZodSchema = z.object({
  method: z.string().min(1, 'Método de entrega obrigatório'),
  carrier: z.string().min(1, 'Transportadora obrigatória'),
  trackingCode: z.string().optional(),
  estimatedDelivery: z.date().optional(),
  shippedAt: z.date().optional(),
  deliveredAt: z.date().optional(),
  cost: z.number().min(0, 'Custo de entrega deve ser positivo'),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
  }).optional(),
});

export const OrderZodSchema = z.object({
  // Identificação
  orderNumber: z.string().min(1, 'Número do pedido obrigatório'),
  
  // Cliente
  userId: z.string().min(1, 'ID do usuário obrigatório'),
  customerInfo: z.object({
    firstName: z.string().min(1, 'Nome obrigatório'),
    lastName: z.string().min(1, 'Sobrenome obrigatório'),
    email: z.string().email('Email inválido'),
    phone: z.string().optional(),
  }),
  
  // Itens do pedido
  items: z.array(OrderItemZodSchema).min(1, 'Pelo menos um item obrigatório'),
  
  // Endereços
  shippingAddress: AddressZodSchema,
  billingAddress: AddressZodSchema,
  
  // Valores
  subtotal: z.number().min(0, 'Subtotal deve ser positivo'),
  shippingCost: z.number().min(0, 'Custo de entrega deve ser positivo'),
  taxAmount: z.number().min(0, 'Valor do imposto deve ser positivo'),
  discountAmount: z.number().min(0, 'Valor do desconto deve ser positivo'),
  total: z.number().min(0, 'Total deve ser positivo'),
  currency: z.string().default('BRL'),
  
  // Cupons e descontos
  discountCodes: z.array(z.object({
    code: z.string(),
    amount: z.number(),
    type: z.enum(['percentage', 'fixed']),
  })).default([]),
  
  // Status do pedido
  status: z.enum([
    'pending',      // Pendente
    'confirmed',    // Confirmado
    'processing',   // Processando
    'shipped',      // Enviado
    'delivered',    // Entregue
    'cancelled',    // Cancelado
    'refunded',     // Reembolsado
    'returned'      // Devolvido
  ]).default('pending'),
  
  // Pagamento
  payments: z.array(PaymentZodSchema).default([]),
  paymentStatus: z.enum(['pending', 'processing', 'completed', 'failed', 'refunded']).default('pending'),
  
  // Entrega
  shipping: ShippingZodSchema.optional(),
  
  // Datas importantes
  confirmedAt: z.date().optional(),
  processedAt: z.date().optional(),
  shippedAt: z.date().optional(),
  deliveredAt: z.date().optional(),
  cancelledAt: z.date().optional(),
  
  // Notas e comentários
  customerNotes: z.string().max(500, 'Notas muito longas').optional(),
  internalNotes: z.string().max(1000, 'Notas internas muito longas').optional(),
  
  // Comunicação
  notifications: z.array(z.object({
    type: z.enum(['email', 'sms', 'push']),
    status: z.enum(['sent', 'failed']),
    message: z.string(),
    sentAt: z.date(),
  })).default([]),
  
  // Métricas e rastreamento
  source: z.string().default('web'), // web, mobile, api
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

// TypeScript interfaces
export interface IOrderItem {
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
  variant?: {
    type: string;
    value: string;
  };
}

export interface IPayment {
  method: 'credit_card' | 'debit_card' | 'pix' | 'boleto' | 'wallet';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  transactionId?: string;
  gatewayResponse?: Record<string, unknown>;
  amount: number;
  currency: string;
  processedAt?: Date;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShipping {
  method: string;
  carrier: string;
  trackingCode?: string;
  estimatedDelivery?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cost: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ICustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface IDiscountCode {
  code: string;
  amount: number;
  type: 'percentage' | 'fixed';
}

export interface IOrderNotification {
  type: 'email' | 'sms' | 'push';
  status: 'sent' | 'failed';
  message: string;
  sentAt: Date;
}

export interface IOrder extends Document {
  // Identificação
  orderNumber: string;
  
  // Cliente
  userId: string;
  customerInfo: ICustomerInfo;
  
  // Itens do pedido
  items: IOrderItem[];
  
  // Endereços
  shippingAddress: any; // Using IAddress from user schema
  billingAddress: any;  // Using IAddress from user schema
  
  // Valores
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  
  // Cupons e descontos
  discountCodes: IDiscountCode[];
  
  // Status do pedido
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'returned';
  
  // Pagamento
  payments: IPayment[];
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  
  // Entrega
  shipping?: IShipping;
  
  // Datas importantes
  confirmedAt?: Date;
  processedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  
  // Notas e comentários
  customerNotes?: string;
  internalNotes?: string;
  
  // Comunicação
  notifications: IOrderNotification[];
  
  // Métricas e rastreamento
  source: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  
  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual properties
  itemCount: number;
  canCancel: boolean;
  canRefund: boolean;
  isCompleted: boolean;
  daysSinceOrder: number;
  
  // Instance methods
  generateOrderNumber(): string;
  calculateTotals(): void;
  updateStatus(newStatus: string, notes?: string): void;
  addPayment(payment: Partial<IPayment>): void;
  sendNotification(type: string, message: string): void;
  canUpdateStatus(newStatus: string): boolean;
}

// MongoDB Schemas
const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  variantId: { type: String },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
  image: { type: String },
  variant: {
    type: { type: String },
    value: { type: String },
  },
});

const PaymentSchema = new Schema<IPayment>({
  method: { 
    type: String, 
    required: true, 
    enum: ['credit_card', 'debit_card', 'pix', 'boleto', 'wallet'] 
  },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded']
  },
  transactionId: { type: String },
  gatewayResponse: { type: Schema.Types.Mixed },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'BRL' },
  processedAt: { type: Date },
  failureReason: { type: String },
}, { timestamps: true });

const ShippingSchema = new Schema<IShipping>({
  method: { type: String, required: true },
  carrier: { type: String, required: true },
  trackingCode: { type: String },
  estimatedDelivery: { type: Date },
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
  cost: { type: Number, required: true, min: 0 },
  weight: { type: Number, min: 0 },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },
});

const CustomerInfoSchema = new Schema<ICustomerInfo>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
});

const DiscountCodeSchema = new Schema<IDiscountCode>({
  code: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true, enum: ['percentage', 'fixed'] },
});

const NotificationSchema = new Schema<IOrderNotification>({
  type: { type: String, required: true, enum: ['email', 'sms', 'push'] },
  status: { type: String, required: true, enum: ['sent', 'failed'] },
  message: { type: String, required: true },
  sentAt: { type: Date, required: true },
});

const OrderSchema = new Schema<IOrder>({
  // Identificação
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  // Cliente
  userId: { type: String, required: true },
  customerInfo: CustomerInfoSchema,
  
  // Itens do pedido
  items: [OrderItemSchema],
  
  // Endereços (importing from user schema structure)
  shippingAddress: { type: Schema.Types.Mixed, required: true },
  billingAddress: { type: Schema.Types.Mixed, required: true },
  
  // Valores
  subtotal: { type: Number, required: true, min: 0 },
  shippingCost: { type: Number, default: 0, min: 0 },
  taxAmount: { type: Number, default: 0, min: 0 },
  discountAmount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'BRL' },
  
  // Cupons e descontos
  discountCodes: [DiscountCodeSchema],
  
  // Status do pedido
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned']
  },
  
  // Pagamento
  payments: [PaymentSchema],
  paymentStatus: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded']
  },
  
  // Entrega
  shipping: ShippingSchema,
  
  // Datas importantes
  confirmedAt: { type: Date },
  processedAt: { type: Date },
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
  cancelledAt: { type: Date },
  
  // Notas e comentários
  customerNotes: { type: String, maxlength: 500 },
  internalNotes: { type: String, maxlength: 1000 },
  
  // Comunicação
  notifications: [NotificationSchema],
  
  // Métricas e rastreamento
  source: { type: String, default: 'web' },
  referrer: { type: String },
  utmSource: { type: String },
  utmMedium: { type: String },
  utmCampaign: { type: String },
}, { 
  timestamps: true,
  collection: 'orders'
});

// Virtual properties
OrderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

OrderSchema.virtual('canCancel').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

OrderSchema.virtual('canRefund').get(function() {
  return ['delivered'].includes(this.status) && this.paymentStatus === 'completed';
});

OrderSchema.virtual('isCompleted').get(function() {
  return this.status === 'delivered';
});

OrderSchema.virtual('daysSinceOrder').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Ensure virtual fields are included in JSON
OrderSchema.set('toJSON', { virtuals: true });
OrderSchema.set('toObject', { virtuals: true });

// Instance methods
OrderSchema.methods.generateOrderNumber = function(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const orderNumber = `62B${timestamp}${random}`;
  this.orderNumber = orderNumber;
  return orderNumber;
};

OrderSchema.methods.calculateTotals = function(): void {
  this.subtotal = this.items.reduce((total, item) => total + item.totalPrice, 0);
  this.total = this.subtotal + this.shippingCost + this.taxAmount - this.discountAmount;
};

OrderSchema.methods.updateStatus = function(newStatus: string, notes?: string): void {
  if (!this.canUpdateStatus(newStatus)) {
    throw new Error(`Cannot update status from ${this.status} to ${newStatus}`);
  }
  
  const oldStatus = this.status;
  this.status = newStatus as any;
  
  // Update status-specific timestamps
  const now = new Date();
  switch (newStatus) {
    case 'confirmed':
      this.confirmedAt = now;
      break;
    case 'processing':
      this.processedAt = now;
      break;
    case 'shipped':
      this.shippedAt = now;
      if (this.shipping) {
        this.shipping.shippedAt = now;
      }
      break;
    case 'delivered':
      this.deliveredAt = now;
      if (this.shipping) {
        this.shipping.deliveredAt = now;
      }
      break;
    case 'cancelled':
      this.cancelledAt = now;
      break;
  }
  
  // Add internal notes about status change
  if (notes) {
    this.internalNotes = (this.internalNotes || '') + `\n${now.toISOString()}: Status changed from ${oldStatus} to ${newStatus} - ${notes}`;
  }
};

OrderSchema.methods.addPayment = function(payment: Partial<IPayment>): void {
  this.payments.push({
    method: payment.method!,
    status: payment.status || 'pending',
    amount: payment.amount!,
    currency: payment.currency || 'BRL',
    transactionId: payment.transactionId,
    gatewayResponse: payment.gatewayResponse,
    processedAt: payment.processedAt,
    failureReason: payment.failureReason,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  // Update overall payment status
  if (payment.status === 'completed') {
    const totalPaid = this.payments
      .filter(p => p.status === 'completed')
      .reduce((total, p) => total + p.amount, 0);
    
    if (totalPaid >= this.total) {
      this.paymentStatus = 'completed';
    }
  }
};

OrderSchema.methods.sendNotification = function(type: string, message: string): void {
  this.notifications.push({
    type: type as any,
    status: 'sent',
    message,
    sentAt: new Date(),
  });
};

OrderSchema.methods.canUpdateStatus = function(newStatus: string): boolean {
  const validTransitions: Record<string, string[]> = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['processing', 'cancelled'],
    'processing': ['shipped', 'cancelled'],
    'shipped': ['delivered', 'returned'],
    'delivered': ['returned', 'refunded'],
    'cancelled': [],
    'returned': ['refunded'],
    'refunded': [],
  };
  
  return validTransitions[this.status]?.includes(newStatus) || false;
};

// Pre-save middleware
OrderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    this.generateOrderNumber();
  }
  
  // Recalculate totals if items have changed
  if (this.isModified('items') || this.isModified('shippingCost') || this.isModified('discountAmount')) {
    this.calculateTotals();
  }
  
  next();
});

// Static methods
OrderSchema.statics.findByOrderNumber = function(orderNumber: string) {
  return this.findOne({ orderNumber });
};

OrderSchema.statics.findByUserId = function(userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

OrderSchema.statics.findPending = function() {
  return this.find({ status: 'pending' });
};

OrderSchema.statics.findByStatus = function(status: string) {
  return this.find({ status });
};

OrderSchema.statics.getRevenueStats = function(startDate: Date, endDate: Date) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ['delivered', 'shipped'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$total' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$total' }
      }
    }
  ]);
};

// Create and export the model
export const Order = models.Order || model<IOrder>('Order', OrderSchema);
export default Order;