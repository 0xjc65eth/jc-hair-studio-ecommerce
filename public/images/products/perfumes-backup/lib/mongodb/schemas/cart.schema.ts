/**
 * Cart Schema - MongoDB with Zod validation
 * JC Hair Studio's 62's 62 E-commerce
 */

import { Schema, model, models, Document } from 'mongoose';
import { z } from 'zod';

// Zod validation schemas
export const CartItemZodSchema = z.object({
  productId: z.string().min(1, 'ID do produto obrigatório'),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1, 'Quantidade deve ser pelo menos 1'),
  unitPrice: z.number().min(0, 'Preço unitário deve ser positivo'),
  originalPrice: z.number().min(0, 'Preço original deve ser positivo'),
  discount: z.number().min(0).default(0),
  
  // Informações do produto (cache para performance)
  productInfo: z.object({
    name: z.string().min(1, 'Nome do produto obrigatório'),
    sku: z.string().min(1, 'SKU obrigatório'),
    image: z.string().url('URL da imagem inválida').optional(),
    slug: z.string().min(1, 'Slug obrigatório'),
    isActive: z.boolean().default(true),
    inStock: z.boolean().default(true),
    stockQuantity: z.number().int().min(0).default(0),
  }),
  
  // Informações da variação (se aplicável)
  variantInfo: z.object({
    name: z.string(),
    type: z.string(),
    value: z.string(),
    image: z.string().url().optional(),
    sku: z.string(),
  }).optional(),
  
  // Metadados
  addedAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  source: z.string().default('web'), // web, mobile, api
});

export const CartZodSchema = z.object({
  // Identificação
  userId: z.string().min(1, 'ID do usuário obrigatório').optional(), // Optional for guest carts
  sessionId: z.string().min(1, 'ID da sessão obrigatório').optional(), // For guest carts
  
  // Itens do carrinho
  items: z.array(CartItemZodSchema).default([]),
  
  // Totais
  subtotal: z.number().min(0).default(0),
  totalDiscount: z.number().min(0).default(0),
  total: z.number().min(0).default(0),
  itemCount: z.number().int().min(0).default(0),
  currency: z.string().default('BRL'),
  
  // Status
  status: z.enum(['active', 'abandoned', 'converted', 'expired']).default('active'),
  
  // Cupons aplicados
  appliedCoupons: z.array(z.object({
    code: z.string(),
    type: z.enum(['percentage', 'fixed']),
    value: z.number(),
    discount: z.number(),
    appliedAt: z.date(),
  })).default([]),
  
  // Metadados de abandono
  abandonedAt: z.date().optional(),
  recoveryEmailSent: z.boolean().default(false),
  reminderCount: z.number().int().min(0).default(0),
  
  // Informações de entrega (estimativa)
  shippingEstimate: z.object({
    method: z.string(),
    cost: z.number().min(0),
    estimatedDays: z.number().int().min(0),
    calculatedAt: z.date(),
  }).optional(),
  
  // Rastreamento
  lastActivity: z.date().default(() => new Date()),
  source: z.string().default('web'),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  
  // Expiração
  expiresAt: z.date().optional(),
});

// TypeScript interfaces
export interface ICartProductInfo {
  name: string;
  sku: string;
  image?: string;
  slug: string;
  isActive: boolean;
  inStock: boolean;
  stockQuantity: number;
}

export interface ICartVariantInfo {
  name: string;
  type: string;
  value: string;
  image?: string;
  sku: string;
}

export interface ICartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  originalPrice: number;
  discount: number;
  productInfo: ICartProductInfo;
  variantInfo?: ICartVariantInfo;
  addedAt: Date;
  updatedAt: Date;
  source: string;
  
  // Virtual properties
  totalPrice: number;
  totalDiscount: number;
}

export interface IAppliedCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discount: number;
  appliedAt: Date;
}

export interface IShippingEstimate {
  method: string;
  cost: number;
  estimatedDays: number;
  calculatedAt: Date;
}

export interface ICart extends Document {
  // Identificação
  userId?: string;
  sessionId?: string;
  
  // Itens do carrinho
  items: ICartItem[];
  
  // Totais
  subtotal: number;
  totalDiscount: number;
  total: number;
  itemCount: number;
  currency: string;
  
  // Status
  status: 'active' | 'abandoned' | 'converted' | 'expired';
  
  // Cupons aplicados
  appliedCoupons: IAppliedCoupon[];
  
  // Metadados de abandono
  abandonedAt?: Date;
  recoveryEmailSent: boolean;
  reminderCount: number;
  
  // Informações de entrega
  shippingEstimate?: IShippingEstimate;
  
  // Rastreamento
  lastActivity: Date;
  source: string;
  userAgent?: string;
  ipAddress?: string;
  
  // Expiração
  expiresAt?: Date;
  
  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual properties
  isExpired: boolean;
  isAbandoned: boolean;
  daysSinceCreated: number;
  hoursSinceLastActivity: number;
  
  // Instance methods
  addItem(productId: string, quantity: number, productInfo: ICartProductInfo, variantId?: string, variantInfo?: ICartVariantInfo): void;
  updateItemQuantity(productId: string, quantity: number, variantId?: string): boolean;
  removeItem(productId: string, variantId?: string): boolean;
  clearItems(): void;
  applyCoupon(coupon: Omit<IAppliedCoupon, 'appliedAt'>): void;
  removeCoupon(code: string): boolean;
  calculateTotals(): void;
  markAsAbandoned(): void;
  markAsConverted(): void;
  refreshExpiration(days?: number): void;
  updateLastActivity(): void;
  hasItem(productId: string, variantId?: string): boolean;
  getItemCount(): number;
  getTotalWeight(): number;
  canApplyCoupon(code: string): boolean;
}

// MongoDB Schemas
const CartProductInfoSchema = new Schema<ICartProductInfo>({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  image: { type: String },
  slug: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0, min: 0 },
});

const CartVariantInfoSchema = new Schema<ICartVariantInfo>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: String, required: true },
  image: { type: String },
  sku: { type: String, required: true },
});

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: String, required: true },
  variantId: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  productInfo: CartProductInfoSchema,
  variantInfo: CartVariantInfoSchema,
  addedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  source: { type: String, default: 'web' },
});

const AppliedCouponSchema = new Schema<IAppliedCoupon>({
  code: { type: String, required: true },
  type: { type: String, required: true, enum: ['percentage', 'fixed'] },
  value: { type: Number, required: true },
  discount: { type: Number, required: true },
  appliedAt: { type: Date, required: true },
});

const ShippingEstimateSchema = new Schema<IShippingEstimate>({
  method: { type: String, required: true },
  cost: { type: Number, required: true, min: 0 },
  estimatedDays: { type: Number, required: true, min: 0 },
  calculatedAt: { type: Date, required: true },
});

const CartSchema = new Schema<ICart>({
  // Identificação
  userId: { type: String },
  sessionId: { type: String },
  
  // Itens do carrinho
  items: [CartItemSchema],
  
  // Totais
  subtotal: { type: Number, default: 0, min: 0 },
  totalDiscount: { type: Number, default: 0, min: 0 },
  total: { type: Number, default: 0, min: 0 },
  itemCount: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'BRL' },
  
  // Status
  status: { 
    type: String, 
    default: 'active',
    enum: ['active', 'abandoned', 'converted', 'expired']
  },
  
  // Cupons aplicados
  appliedCoupons: [AppliedCouponSchema],
  
  // Metadados de abandono
  abandonedAt: { type: Date },
  recoveryEmailSent: { type: Boolean, default: false },
  reminderCount: { type: Number, default: 0, min: 0 },
  
  // Informações de entrega
  shippingEstimate: ShippingEstimateSchema,
  
  // Rastreamento
  lastActivity: { type: Date, default: Date.now },
  source: { type: String, default: 'web' },
  userAgent: { type: String },
  ipAddress: { type: String },
  
  // Expiração
  expiresAt: { type: Date },
}, { 
  timestamps: true,
  collection: 'carts'
});

// Indexes for better performance
CartSchema.index({ userId: 1, status: 1 });
CartSchema.index({ sessionId: 1, status: 1 });
CartSchema.index({ status: 1, abandonedAt: 1 });
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
CartSchema.index({ lastActivity: 1, status: 1 });

// Virtual properties for cart items
CartItemSchema.virtual('totalPrice').get(function() {
  return this.quantity * this.unitPrice;
});

CartItemSchema.virtual('totalDiscount').get(function() {
  return this.quantity * this.discount;
});

// Virtual properties for cart
CartSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

CartSchema.virtual('isAbandoned').get(function() {
  return this.status === 'abandoned';
});

CartSchema.virtual('daysSinceCreated').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

CartSchema.virtual('hoursSinceLastActivity').get(function() {
  return Math.floor((Date.now() - this.lastActivity.getTime()) / (1000 * 60 * 60));
});

// Ensure virtual fields are included in JSON
CartSchema.set('toJSON', { virtuals: true });
CartSchema.set('toObject', { virtuals: true });

// Pre-save middleware
CartSchema.pre('save', function(next) {
  if (this.isModified('items') || this.isModified('appliedCoupons')) {
    this.calculateTotals();
  }
  
  // Set expiration if not set (30 days for logged in users, 7 days for guests)
  if (this.isNew && !this.expiresAt) {
    const days = this.userId ? 30 : 7;
    this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
  
  next();
});

// Instance methods
CartSchema.methods.addItem = function(
  productId: string, 
  quantity: number, 
  productInfo: ICartProductInfo, 
  variantId?: string, 
  variantInfo?: ICartVariantInfo
): void {
  const existingItemIndex = this.items.findIndex((item: ICartItem) => 
    item.productId === productId && item.variantId === variantId
  );
  
  if (existingItemIndex > -1) {
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].updatedAt = new Date();
  } else {
    this.items.push({
      productId,
      variantId,
      quantity,
      unitPrice: productInfo.stockQuantity > 0 ? productInfo.stockQuantity : 0, // This should be the actual price
      originalPrice: productInfo.stockQuantity > 0 ? productInfo.stockQuantity : 0, // This should be the original price
      discount: 0,
      productInfo,
      variantInfo,
      addedAt: new Date(),
      updatedAt: new Date(),
      source: this.source,
    });
  }
  
  this.updateLastActivity();
};

CartSchema.methods.updateItemQuantity = function(
  productId: string, 
  quantity: number, 
  variantId?: string
): boolean {
  const itemIndex = this.items.findIndex((item: ICartItem) => 
    item.productId === productId && item.variantId === variantId
  );
  
  if (itemIndex > -1) {
    if (quantity <= 0) {
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].quantity = quantity;
      this.items[itemIndex].updatedAt = new Date();
    }
    this.updateLastActivity();
    return true;
  }
  
  return false;
};

CartSchema.methods.removeItem = function(productId: string, variantId?: string): boolean {
  const initialLength = this.items.length;
  this.items = this.items.filter((item: ICartItem) => 
    !(item.productId === productId && item.variantId === variantId)
  );
  
  if (this.items.length < initialLength) {
    this.updateLastActivity();
    return true;
  }
  
  return false;
};

CartSchema.methods.clearItems = function(): void {
  this.items = [];
  this.appliedCoupons = [];
  this.updateLastActivity();
};

CartSchema.methods.applyCoupon = function(coupon: Omit<IAppliedCoupon, 'appliedAt'>): void {
  // Remove existing coupon with same code if any
  this.appliedCoupons = this.appliedCoupons.filter((c: IAppliedCoupon) => c.code !== coupon.code);
  
  // Add new coupon
  this.appliedCoupons.push({
    ...coupon,
    appliedAt: new Date(),
  });
  
  this.updateLastActivity();
};

CartSchema.methods.removeCoupon = function(code: string): boolean {
  const initialLength = this.appliedCoupons.length;
  this.appliedCoupons = this.appliedCoupons.filter((c: IAppliedCoupon) => c.code !== code);
  
  if (this.appliedCoupons.length < initialLength) {
    this.updateLastActivity();
    return true;
  }
  
  return false;
};

CartSchema.methods.calculateTotals = function(): void {
  // Calculate subtotal
  this.subtotal = this.items.reduce((total: number, item: ICartItem) => 
    total + (item.quantity * item.unitPrice), 0
  );
  
  // Calculate total discount from coupons
  this.totalDiscount = this.appliedCoupons.reduce((total: number, coupon: IAppliedCoupon) => 
    total + coupon.discount, 0
  );
  
  // Add item-level discounts
  this.totalDiscount += this.items.reduce((total: number, item: ICartItem) => 
    total + (item.quantity * item.discount), 0
  );
  
  // Calculate final total
  this.total = Math.max(0, this.subtotal - this.totalDiscount);
  
  // Update item count
  this.itemCount = this.items.reduce((total: number, item: ICartItem) => total + item.quantity, 0);
};

CartSchema.methods.markAsAbandoned = function(): void {
  if (this.status === 'active') {
    this.status = 'abandoned';
    this.abandonedAt = new Date();
  }
};

CartSchema.methods.markAsConverted = function(): void {
  this.status = 'converted';
  this.updateLastActivity();
};

CartSchema.methods.refreshExpiration = function(days: number = 30): void {
  this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  this.updateLastActivity();
};

CartSchema.methods.updateLastActivity = function(): void {
  this.lastActivity = new Date();
  
  // Refresh status if was abandoned
  if (this.status === 'abandoned') {
    this.status = 'active';
    this.abandonedAt = undefined;
  }
};

CartSchema.methods.hasItem = function(productId: string, variantId?: string): boolean {
  return this.items.some((item: ICartItem) => 
    item.productId === productId && item.variantId === variantId
  );
};

CartSchema.methods.getItemCount = function(): number {
  return this.items.reduce((total: number, item: ICartItem) => total + item.quantity, 0);
};

CartSchema.methods.getTotalWeight = function(): number {
  // This would require weight information in product info
  // For now, return 0 as placeholder
  return 0;
};

CartSchema.methods.canApplyCoupon = function(code: string): boolean {
  return !this.appliedCoupons.some((coupon: IAppliedCoupon) => coupon.code === code);
};

// Static methods
CartSchema.statics.findByUser = function(userId: string) {
  return this.findOne({ userId, status: 'active' });
};

CartSchema.statics.findBySession = function(sessionId: string) {
  return this.findOne({ sessionId, status: 'active' });
};

CartSchema.statics.findAbandoned = function(hoursAgo: number = 24) {
  const cutoffDate = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  return this.find({ 
    status: 'active',
    lastActivity: { $lt: cutoffDate },
    itemCount: { $gt: 0 }
  });
};

CartSchema.statics.cleanupExpired = function() {
  return this.deleteMany({ 
    status: { $in: ['expired', 'converted'] },
    updatedAt: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } // 90 days old
  });
};

// Create and export the model
export const Cart = models.Cart || model<ICart>('Cart', CartSchema);
export default Cart;