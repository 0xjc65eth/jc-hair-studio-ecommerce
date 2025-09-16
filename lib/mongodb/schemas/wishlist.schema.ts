/**
 * Wishlist Schema - MongoDB with Zod validation
 * JC Hair Studio's 62's 62 E-commerce
 */

import { Schema, model, models, Document } from 'mongoose';
import { z } from 'zod';

// Zod validation schemas
export const WishlistItemZodSchema = z.object({
  productId: z.string().min(1, 'ID do produto obrigatório'),
  variantId: z.string().optional(),
  
  // Informações do produto (cache para performance)
  productInfo: z.object({
    name: z.string().min(1, 'Nome do produto obrigatório'),
    sku: z.string().min(1, 'SKU obrigatório'),
    image: z.string().url('URL da imagem inválida').optional(),
    slug: z.string().min(1, 'Slug obrigatório'),
    price: z.number().min(0, 'Preço deve ser positivo'),
    originalPrice: z.number().min(0, 'Preço original deve ser positivo'),
    isActive: z.boolean().default(true),
    inStock: z.boolean().default(true),
    stockQuantity: z.number().int().min(0).default(0),
    isOnSale: z.boolean().default(false),
    averageRating: z.number().min(0).max(5).default(0),
    reviewCount: z.number().int().min(0).default(0),
  }),
  
  // Informações da variação (se aplicável)
  variantInfo: z.object({
    name: z.string(),
    type: z.string(),
    value: z.string(),
    image: z.string().url().optional(),
    sku: z.string(),
    price: z.number().min(0),
    inStock: z.boolean(),
    stockQuantity: z.number().int().min(0),
  }).optional(),
  
  // Metadados
  addedAt: z.date().default(() => new Date()),
  priceWhenAdded: z.number().min(0, 'Preço quando adicionado deve ser positivo'),
  notifyOnSale: z.boolean().default(false),
  notifyOnRestock: z.boolean().default(false),
  notes: z.string().max(500, 'Notas muito longas').optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  
  // Rastreamento de preço
  priceHistory: z.array(z.object({
    price: z.number().min(0),
    recordedAt: z.date(),
  })).default([]),
  
  // Notificações enviadas
  notificationsSent: z.array(z.object({
    type: z.enum(['price_drop', 'back_in_stock', 'last_units']),
    sentAt: z.date(),
    price: z.number().optional(),
  })).default([]),
});

export const WishlistZodSchema = z.object({
  // Identificação
  userId: z.string().min(1, 'ID do usuário obrigatório'),
  
  // Configurações da lista
  name: z.string().min(1, 'Nome da lista obrigatório').max(100, 'Nome muito longo').default('Minha Lista de Desejos'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  isPublic: z.boolean().default(false),
  shareToken: z.string().optional(), // For sharing public wishlists
  
  // Itens da wishlist
  items: z.array(WishlistItemZodSchema).default([]),
  
  // Estatísticas
  totalValue: z.number().min(0).default(0),
  itemCount: z.number().int().min(0).default(0),
  
  // Configurações de notificação
  notifications: z.object({
    priceDrops: z.boolean().default(true),
    backInStock: z.boolean().default(true),
    newSales: z.boolean().default(false),
    weeklyDigest: z.boolean().default(false),
  }).default({}),
  
  // Metadados
  lastViewedAt: z.date().default(() => new Date()),
  shareCount: z.number().int().min(0).default(0),
});

// TypeScript interfaces
export interface IWishlistProductInfo {
  name: string;
  sku: string;
  image?: string;
  slug: string;
  price: number;
  originalPrice: number;
  isActive: boolean;
  inStock: boolean;
  stockQuantity: number;
  isOnSale: boolean;
  averageRating: number;
  reviewCount: number;
}

export interface IWishlistVariantInfo {
  name: string;
  type: string;
  value: string;
  image?: string;
  sku: string;
  price: number;
  inStock: boolean;
  stockQuantity: number;
}

export interface IPriceHistoryEntry {
  price: number;
  recordedAt: Date;
}

export interface INotificationSent {
  type: 'price_drop' | 'back_in_stock' | 'last_units';
  sentAt: Date;
  price?: number;
}

export interface IWishlistItem {
  productId: string;
  variantId?: string;
  productInfo: IWishlistProductInfo;
  variantInfo?: IWishlistVariantInfo;
  addedAt: Date;
  priceWhenAdded: number;
  notifyOnSale: boolean;
  notifyOnRestock: boolean;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  priceHistory: IPriceHistoryEntry[];
  notificationsSent: INotificationSent[];
  
  // Virtual properties
  currentPrice: number;
  priceDrop: number;
  priceSavings: number;
  isAvailable: boolean;
  hasPriceDrop: boolean;
  daysSinceAdded: number;
}

export interface IWishlistNotifications {
  priceDrops: boolean;
  backInStock: boolean;
  newSales: boolean;
  weeklyDigest: boolean;
}

export interface IWishlist extends Document {
  // Identificação
  userId: string;
  
  // Configurações da lista
  name: string;
  description?: string;
  isPublic: boolean;
  shareToken?: string;
  
  // Itens da wishlist
  items: IWishlistItem[];
  
  // Estatísticas
  totalValue: number;
  itemCount: number;
  
  // Configurações de notificação
  notifications: IWishlistNotifications;
  
  // Metadados
  lastViewedAt: Date;
  shareCount: number;
  
  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual properties
  availableItemsCount: number;
  unavailableItemsCount: number;
  totalSavings: number;
  averageItemPrice: number;
  itemsOnSale: number;
  
  // Instance methods
  addItem(productId: string, productInfo: IWishlistProductInfo, variantId?: string, variantInfo?: IWishlistVariantInfo, options?: Partial<IWishlistItem>): boolean;
  removeItem(productId: string, variantId?: string): boolean;
  hasItem(productId: string, variantId?: string): boolean;
  updateItemPrice(productId: string, newPrice: number, variantId?: string): boolean;
  updateItemStock(productId: string, inStock: boolean, stockQuantity: number, variantId?: string): boolean;
  getItemsByPriority(priority: 'low' | 'medium' | 'high'): IWishlistItem[];
  getItemsOnSale(): IWishlistItem[];
  getUnavailableItems(): IWishlistItem[];
  calculateTotalValue(): number;
  generateShareToken(): string;
  markAsViewed(): void;
  incrementShareCount(): void;
  sendNotification(itemIndex: number, type: 'price_drop' | 'back_in_stock' | 'last_units', price?: number): void;
  getItemsForNotification(type: string): IWishlistItem[];
  clearOldNotifications(days?: number): void;
}

// MongoDB Schemas
const WishlistProductInfoSchema = new Schema<IWishlistProductInfo>({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  image: { type: String },
  slug: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0, min: 0 },
  isOnSale: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
});

const WishlistVariantInfoSchema = new Schema<IWishlistVariantInfo>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: String, required: true },
  image: { type: String },
  sku: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  inStock: { type: Boolean, required: true },
  stockQuantity: { type: Number, required: true, min: 0 },
});

const PriceHistorySchema = new Schema<IPriceHistoryEntry>({
  price: { type: Number, required: true, min: 0 },
  recordedAt: { type: Date, required: true },
});

const NotificationSentSchema = new Schema<INotificationSent>({
  type: { 
    type: String, 
    required: true, 
    enum: ['price_drop', 'back_in_stock', 'last_units'] 
  },
  sentAt: { type: Date, required: true },
  price: { type: Number, min: 0 },
});

const WishlistItemSchema = new Schema<IWishlistItem>({
  productId: { type: String, required: true },
  variantId: { type: String },
  productInfo: WishlistProductInfoSchema,
  variantInfo: WishlistVariantInfoSchema,
  addedAt: { type: Date, default: Date.now },
  priceWhenAdded: { type: Number, required: true, min: 0 },
  notifyOnSale: { type: Boolean, default: false },
  notifyOnRestock: { type: Boolean, default: false },
  notes: { type: String, maxlength: 500 },
  priority: { 
    type: String, 
    default: 'medium',
    enum: ['low', 'medium', 'high']
  },
  priceHistory: [PriceHistorySchema],
  notificationsSent: [NotificationSentSchema],
});

const WishlistNotificationsSchema = new Schema<IWishlistNotifications>({
  priceDrops: { type: Boolean, default: true },
  backInStock: { type: Boolean, default: true },
  newSales: { type: Boolean, default: false },
  weeklyDigest: { type: Boolean, default: false },
});

const WishlistSchema = new Schema<IWishlist>({
  // Identificação
  userId: { type: String, required: true },
  
  // Configurações da lista
  name: { 
    type: String, 
    required: true, 
    maxlength: 100,
    default: 'Minha Lista de Desejos'
  },
  description: { type: String, maxlength: 500 },
  isPublic: { type: Boolean, default: false },
  shareToken: { type: String, unique: true, sparse: true },
  
  // Itens da wishlist
  items: [WishlistItemSchema],
  
  // Estatísticas
  totalValue: { type: Number, default: 0, min: 0 },
  itemCount: { type: Number, default: 0, min: 0 },
  
  // Configurações de notificação
  notifications: { type: WishlistNotificationsSchema, default: {} },
  
  // Metadados
  lastViewedAt: { type: Date, default: Date.now },
  shareCount: { type: Number, default: 0, min: 0 },
}, { 
  timestamps: true,
  collection: 'wishlists'
});

// Indexes for better performance
WishlistSchema.index({ userId: 1 });
WishlistSchema.index({ shareToken: 1 }, { sparse: true });
WishlistSchema.index({ 'items.productId': 1 });
WishlistSchema.index({ isPublic: 1, shareCount: -1 });

// Compound index for preventing duplicate items
WishlistSchema.index({ userId: 1, 'items.productId': 1, 'items.variantId': 1 });

// Virtual properties for wishlist items
WishlistItemSchema.virtual('currentPrice').get(function() {
  return this.variantInfo ? this.variantInfo.price : this.productInfo.price;
});

WishlistItemSchema.virtual('priceDrop').get(function() {
  const currentPrice = this.variantInfo ? this.variantInfo.price : this.productInfo.price;
  return Math.max(0, this.priceWhenAdded - currentPrice);
});

WishlistItemSchema.virtual('priceSavings').get(function() {
  const currentPrice = this.variantInfo ? this.variantInfo.price : this.productInfo.price;
  const originalPrice = this.variantInfo ? this.variantInfo.price : this.productInfo.originalPrice;
  return Math.max(0, originalPrice - currentPrice);
});

WishlistItemSchema.virtual('isAvailable').get(function() {
  const inStock = this.variantInfo ? this.variantInfo.inStock : this.productInfo.inStock;
  return this.productInfo.isActive && inStock;
});

WishlistItemSchema.virtual('hasPriceDrop').get(function() {
  return this.priceDrop > 0;
});

WishlistItemSchema.virtual('daysSinceAdded').get(function() {
  return Math.floor((Date.now() - this.addedAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Virtual properties for wishlist
WishlistSchema.virtual('availableItemsCount').get(function() {
  return this.items.filter((item: IWishlistItem) => item.isAvailable).length;
});

WishlistSchema.virtual('unavailableItemsCount').get(function() {
  return this.items.filter((item: IWishlistItem) => !item.isAvailable).length;
});

WishlistSchema.virtual('totalSavings').get(function() {
  return this.items.reduce((total: number, item: IWishlistItem) => total + item.priceSavings, 0);
});

WishlistSchema.virtual('averageItemPrice').get(function() {
  if (this.itemCount === 0) return 0;
  return this.totalValue / this.itemCount;
});

WishlistSchema.virtual('itemsOnSale').get(function() {
  return this.items.filter((item: IWishlistItem) => item.productInfo.isOnSale).length;
});

// Ensure virtual fields are included in JSON
WishlistSchema.set('toJSON', { virtuals: true });
WishlistSchema.set('toObject', { virtuals: true });

// Pre-save middleware
WishlistSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.itemCount = this.items.length;
    this.totalValue = this.items.reduce((total: number, item: IWishlistItem) => {
      const price = item.variantInfo ? item.variantInfo.price : item.productInfo.price;
      return total + price;
    }, 0);
  }
  
  next();
});

// Instance methods
WishlistSchema.methods.addItem = function(
  productId: string, 
  productInfo: IWishlistProductInfo, 
  variantId?: string, 
  variantInfo?: IWishlistVariantInfo,
  options?: Partial<IWishlistItem>
): boolean {
  // Check if item already exists
  if (this.hasItem(productId, variantId)) {
    return false;
  }
  
  const price = variantInfo ? variantInfo.price : productInfo.price;
  
  this.items.push({
    productId,
    variantId,
    productInfo,
    variantInfo,
    addedAt: new Date(),
    priceWhenAdded: price,
    notifyOnSale: options?.notifyOnSale || false,
    notifyOnRestock: options?.notifyOnRestock || false,
    notes: options?.notes,
    priority: options?.priority || 'medium',
    priceHistory: [{ price, recordedAt: new Date() }],
    notificationsSent: [],
  });
  
  this.markAsViewed();
  return true;
};

WishlistSchema.methods.removeItem = function(productId: string, variantId?: string): boolean {
  const initialLength = this.items.length;
  this.items = this.items.filter((item: IWishlistItem) => 
    !(item.productId === productId && item.variantId === variantId)
  );
  
  if (this.items.length < initialLength) {
    this.markAsViewed();
    return true;
  }
  
  return false;
};

WishlistSchema.methods.hasItem = function(productId: string, variantId?: string): boolean {
  return this.items.some((item: IWishlistItem) => 
    item.productId === productId && item.variantId === variantId
  );
};

WishlistSchema.methods.updateItemPrice = function(
  productId: string, 
  newPrice: number, 
  variantId?: string
): boolean {
  const item = this.items.find((item: IWishlistItem) => 
    item.productId === productId && item.variantId === variantId
  );
  
  if (item) {
    if (variantId && item.variantInfo) {
      item.variantInfo.price = newPrice;
    } else {
      item.productInfo.price = newPrice;
    }
    
    // Add to price history
    item.priceHistory.push({
      price: newPrice,
      recordedAt: new Date(),
    });
    
    // Keep only last 30 price entries
    if (item.priceHistory.length > 30) {
      item.priceHistory = item.priceHistory.slice(-30);
    }
    
    return true;
  }
  
  return false;
};

WishlistSchema.methods.updateItemStock = function(
  productId: string, 
  inStock: boolean, 
  stockQuantity: number, 
  variantId?: string
): boolean {
  const item = this.items.find((item: IWishlistItem) => 
    item.productId === productId && item.variantId === variantId
  );
  
  if (item) {
    if (variantId && item.variantInfo) {
      item.variantInfo.inStock = inStock;
      item.variantInfo.stockQuantity = stockQuantity;
    } else {
      item.productInfo.inStock = inStock;
      item.productInfo.stockQuantity = stockQuantity;
    }
    
    return true;
  }
  
  return false;
};

WishlistSchema.methods.getItemsByPriority = function(priority: 'low' | 'medium' | 'high'): IWishlistItem[] {
  return this.items.filter((item: IWishlistItem) => item.priority === priority);
};

WishlistSchema.methods.getItemsOnSale = function(): IWishlistItem[] {
  return this.items.filter((item: IWishlistItem) => item.productInfo.isOnSale);
};

WishlistSchema.methods.getUnavailableItems = function(): IWishlistItem[] {
  return this.items.filter((item: IWishlistItem) => !item.isAvailable);
};

WishlistSchema.methods.calculateTotalValue = function(): number {
  return this.items.reduce((total: number, item: IWishlistItem) => {
    const price = item.variantInfo ? item.variantInfo.price : item.productInfo.price;
    return total + price;
  }, 0);
};

WishlistSchema.methods.generateShareToken = function(): string {
  if (!this.shareToken) {
    this.shareToken = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
  }
  return this.shareToken;
};

WishlistSchema.methods.markAsViewed = function(): void {
  this.lastViewedAt = new Date();
};

WishlistSchema.methods.incrementShareCount = function(): void {
  this.shareCount += 1;
};

WishlistSchema.methods.sendNotification = function(
  itemIndex: number, 
  type: 'price_drop' | 'back_in_stock' | 'last_units', 
  price?: number
): void {
  if (itemIndex >= 0 && itemIndex < this.items.length) {
    this.items[itemIndex].notificationsSent.push({
      type,
      sentAt: new Date(),
      price,
    });
  }
};

WishlistSchema.methods.getItemsForNotification = function(type: string): IWishlistItem[] {
  switch (type) {
    case 'price_drop':
      return this.items.filter((item: IWishlistItem) => 
        item.notifyOnSale && item.hasPriceDrop &&
        !item.notificationsSent.some(n => 
          n.type === 'price_drop' && 
          n.sentAt > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        )
      );
    
    case 'back_in_stock':
      return this.items.filter((item: IWishlistItem) => 
        item.notifyOnRestock && item.isAvailable &&
        !item.notificationsSent.some(n => 
          n.type === 'back_in_stock' && 
          n.sentAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        )
      );
    
    default:
      return [];
  }
};

WishlistSchema.methods.clearOldNotifications = function(days: number = 90): void {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  this.items.forEach((item: IWishlistItem) => {
    item.notificationsSent = item.notificationsSent.filter(
      (notification: INotificationSent) => notification.sentAt > cutoffDate
    );
  });
};

// Static methods
WishlistSchema.statics.findByUser = function(userId: string) {
  return this.findOne({ userId });
};

WishlistSchema.statics.findByShareToken = function(shareToken: string) {
  return this.findOne({ shareToken, isPublic: true });
};

WishlistSchema.statics.findPublicWishlists = function(limit: number = 10) {
  return this.find({ isPublic: true })
    .sort({ shareCount: -1, updatedAt: -1 })
    .limit(limit);
};

WishlistSchema.statics.findForPriceUpdates = function() {
  return this.find({ 
    'items.0': { $exists: true }, // Has at least one item
    $or: [
      { 'notifications.priceDrops': true },
      { 'items.notifyOnSale': true }
    ]
  });
};

WishlistSchema.statics.findForStockUpdates = function() {
  return this.find({ 
    'items.0': { $exists: true }, // Has at least one item
    $or: [
      { 'notifications.backInStock': true },
      { 'items.notifyOnRestock': true }
    ]
  });
};

// Create and export the model
export const Wishlist = models.Wishlist || model<IWishlist>('Wishlist', WishlistSchema);
export default Wishlist;