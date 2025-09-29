/**
 * User Schema - MongoDB with Zod validation
 * JC Hair Studio's 62's 62 E-commerce
 */

import { Schema, model, models, Document } from 'mongoose';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Zod validation schemas
export const AddressZodSchema = z.object({
  type: z.enum(['shipping', 'billing', 'both'], {
    required_error: 'Tipo de endereço obrigatório',
  }),
  firstName: z.string().min(1, 'Nome obrigatório'),
  lastName: z.string().min(1, 'Sobrenome obrigatório'),
  company: z.string().optional(),
  address1: z.string().min(1, 'Endereço obrigatório'),
  address2: z.string().optional(),
  city: z.string().min(1, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório').max(2, 'Estado deve ter 2 caracteres'),
  postalCode: z.string().min(8, 'CEP deve ter 8 dígitos').max(9, 'CEP inválido').regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  country: z.string().default('BR'),
  phone: z.string().min(10, 'Telefone inválido').max(15, 'Telefone inválido'),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const CartItemZodSchema = z.object({
  productId: z.string().min(1, 'ID do produto obrigatório'),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1, 'Quantidade deve ser pelo menos 1'),
  price: z.number().min(0, 'Preço deve ser positivo'),
  addedAt: z.date().default(() => new Date()),
});

export const WishlistItemZodSchema = z.object({
  productId: z.string().min(1, 'ID do produto obrigatório'),
  variantId: z.string().optional(),
  addedAt: z.date().default(() => new Date()),
});

export const ProfessionalInfoZodSchema = z.object({
  licenseNumber: z.string().min(1, 'Número da licença obrigatório'),
  salonName: z.string().min(1, 'Nome do salão obrigatório'),
  salonAddress: AddressZodSchema,
  specializations: z.array(z.string()).default([]),
  experienceYears: z.number().int().min(0).max(50),
  verificationStatus: z.enum(['pending', 'verified', 'rejected']).default('pending'),
  verificationDocuments: z.array(z.string().url()).default([]),
  verifiedAt: z.date().optional(),
  verifiedBy: z.string().optional(),
});

export const UserPreferencesZodSchema = z.object({
  language: z.string().default('pt-BR'),
  currency: z.string().default('BRL'),
  newsletter: z.boolean().default(true),
  smsMarketing: z.boolean().default(false),
  emailMarketing: z.boolean().default(true),
  productRecommendations: z.boolean().default(true),
  priceAlerts: z.boolean().default(false),
});

export const UserZodSchema = z.object({
  // Informações básicas
  firstName: z.string().min(1, 'Nome obrigatório').max(50, 'Nome muito longo'),
  lastName: z.string().min(1, 'Sobrenome obrigatório').max(50, 'Sobrenome muito longo'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido').max(15, 'Telefone inválido').optional(),
  
  // Data de nascimento
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  
  // Autenticação
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres').max(128, 'Senha muito longa'),
  
  // Tipo de usuário
  userType: z.enum(['retail', 'professional'], {
    required_error: 'Tipo de usuário obrigatório',
  }).default('retail'),
  
  // Informações profissionais (apenas para usuários profissionais)
  professionalInfo: ProfessionalInfoZodSchema.optional(),
  
  // Endereços
  addresses: z.array(AddressZodSchema).default([]),
  
  // Carrinho
  cart: z.array(CartItemZodSchema).default([]),
  
  // Lista de desejos
  wishlist: z.array(WishlistItemZodSchema).default([]),
  
  // Avatar
  avatar: z.object({
    url: z.string().url(),
    alt: z.string(),
  }).optional(),
  
  // Preferências
  preferences: UserPreferencesZodSchema.default({}),
  
  // Status da conta
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),
  emailVerifiedAt: z.date().optional(),
  phoneVerifiedAt: z.date().optional(),
  
  // Datas importantes
  lastLoginAt: z.date().optional(),
  lastPasswordChangeAt: z.date().optional(),
  
  // Tokens
  emailVerificationToken: z.string().optional(),
  passwordResetToken: z.string().optional(),
  passwordResetExpires: z.date().optional(),
  
  // Métricas
  totalOrders: z.number().int().min(0).default(0),
  totalSpent: z.number().min(0).default(0),
  loyaltyPoints: z.number().int().min(0).default(0),
  
  // Sistema
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

// TypeScript interfaces
export interface IAddress {
  type: 'shipping' | 'billing' | 'both';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface ICartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface IWishlistItem {
  productId: string;
  variantId?: string;
  addedAt: Date;
}

export interface IProfessionalInfo {
  licenseNumber: string;
  salonName: string;
  salonAddress: IAddress;
  specializations: string[];
  experienceYears: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDocuments: string[];
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface IUserPreferences {
  language: string;
  currency: string;
  newsletter: boolean;
  smsMarketing: boolean;
  emailMarketing: boolean;
  productRecommendations: boolean;
  priceAlerts: boolean;
}

export interface IUserAvatar {
  url: string;
  alt: string;
}

export interface IUser extends Document {
  // Informações básicas
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  
  // Data de nascimento
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  
  // Autenticação
  password: string;
  
  // Tipo de usuário
  userType: 'retail' | 'professional';
  
  // Informações profissionais
  professionalInfo?: IProfessionalInfo;
  
  // Endereços
  addresses: IAddress[];
  
  // Carrinho
  cart: ICartItem[];
  
  // Lista de desejos
  wishlist: IWishlistItem[];
  
  // Avatar
  avatar?: IUserAvatar;
  
  // Preferências
  preferences: IUserPreferences;
  
  // Status da conta
  isActive: boolean;
  isVerified: boolean;
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
  
  // Datas importantes
  lastLoginAt?: Date;
  lastPasswordChangeAt?: Date;
  
  // Tokens
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  
  // Métricas
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  
  // Sistema
  ipAddress?: string;
  userAgent?: string;
  
  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual properties
  fullName: string;
  age?: number;
  cartTotal: number;
  wishlistCount: number;
  defaultAddress?: IAddress;
  
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateEmailVerificationToken(): string;
  generatePasswordResetToken(): string;
  addToCart(productId: string, quantity: number, price: number, variantId?: string): void;
  removeFromCart(productId: string, variantId?: string): void;
  updateCartItemQuantity(productId: string, quantity: number, variantId?: string): void;
  clearCart(): void;
  addToWishlist(productId: string, variantId?: string): void;
  removeFromWishlist(productId: string, variantId?: string): void;
  isProfessional(): boolean;
  isVerifiedProfessional(): boolean;
}

// MongoDB Schemas
const AddressSchema = new Schema<IAddress>({
  type: { 
    type: String, 
    required: true, 
    enum: ['shipping', 'billing', 'both'] 
  },
  firstName: { type: String, required: true, maxlength: 50 },
  lastName: { type: String, required: true, maxlength: 50 },
  company: { type: String, maxlength: 100 },
  address1: { type: String, required: true, maxlength: 200 },
  address2: { type: String, maxlength: 200 },
  city: { type: String, required: true, maxlength: 100 },
  state: { type: String, required: true, minlength: 2, maxlength: 2 },
  postalCode: { 
    type: String, 
    required: true, 
    match: /^\d{5}-?\d{3}$/
  },
  country: { type: String, default: 'BR' },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: String, required: true },
  variantId: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  addedAt: { type: Date, default: Date.now },
});

const WishlistItemSchema = new Schema<IWishlistItem>({
  productId: { type: String, required: true },
  variantId: { type: String },
  addedAt: { type: Date, default: Date.now },
});

const ProfessionalInfoSchema = new Schema<IProfessionalInfo>({
  licenseNumber: { type: String, required: true },
  salonName: { type: String, required: true },
  salonAddress: AddressSchema,
  specializations: [{ type: String }],
  experienceYears: { type: Number, required: true, min: 0, max: 50 },
  verificationStatus: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'verified', 'rejected'] 
  },
  verificationDocuments: [{ type: String }],
  verifiedAt: { type: Date },
  verifiedBy: { type: String },
});

const UserPreferencesSchema = new Schema<IUserPreferences>({
  language: { type: String, default: 'pt-BR' },
  currency: { type: String, default: 'BRL' },
  newsletter: { type: Boolean, default: true },
  smsMarketing: { type: Boolean, default: false },
  emailMarketing: { type: Boolean, default: true },
  productRecommendations: { type: Boolean, default: true },
  priceAlerts: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>({
  // Informações básicas
  firstName: { type: String, required: true, maxlength: 50 },
  lastName: { type: String, required: true, maxlength: 50 },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: { type: String },
  
  // Data de nascimento
  dateOfBirth: { type: Date },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other', 'prefer_not_to_say'] 
  },
  
  // Autenticação
  password: { 
    type: String, 
    required: true, 
    minlength: 8,
    maxlength: 128
  },
  
  // Tipo de usuário
  userType: { 
    type: String, 
    required: true, 
    enum: ['retail', 'professional'],
    default: 'retail'
  },
  
  // Informações profissionais
  professionalInfo: ProfessionalInfoSchema,
  
  // Endereços
  addresses: [AddressSchema],
  
  // Carrinho
  cart: [CartItemSchema],
  
  // Lista de desejos
  wishlist: [WishlistItemSchema],
  
  // Avatar
  avatar: {
    url: { type: String },
    alt: { type: String },
  },
  
  // Preferências
  preferences: { type: UserPreferencesSchema, default: {} },
  
  // Status da conta
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  emailVerifiedAt: { type: Date },
  phoneVerifiedAt: { type: Date },
  
  // Datas importantes
  lastLoginAt: { type: Date },
  lastPasswordChangeAt: { type: Date },
  
  // Tokens
  emailVerificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  
  // Métricas
  totalOrders: { type: Number, default: 0, min: 0 },
  totalSpent: { type: Number, default: 0, min: 0 },
  loyaltyPoints: { type: Number, default: 0, min: 0 },
  
  // Sistema
  ipAddress: { type: String },
  userAgent: { type: String },
}, { 
  timestamps: true,
  collection: 'users'
});

// Virtual properties
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return undefined;
  return Math.floor((Date.now() - this.dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
});

UserSchema.virtual('cartTotal').get(function() {
  return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
});

UserSchema.virtual('wishlistCount').get(function() {
  return this.wishlist.length;
});

UserSchema.virtual('defaultAddress').get(function() {
  return this.addresses.find(addr => addr.isDefault && addr.isActive);
});

// Ensure virtual fields are included in JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance methods
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateEmailVerificationToken = function(): string {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  this.emailVerificationToken = token;
  return token;
};

UserSchema.methods.generatePasswordResetToken = function(): string {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  this.passwordResetToken = token;
  this.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
  return token;
};

UserSchema.methods.addToCart = function(productId: string, quantity: number, price: number, variantId?: string) {
  const existingItemIndex = this.cart.findIndex((item: ICartItem) => 
    item.productId === productId && item.variantId === variantId
  );
  
  if (existingItemIndex > -1) {
    this.cart[existingItemIndex].quantity += quantity;
  } else {
    this.cart.push({
      productId,
      variantId,
      quantity,
      price,
      addedAt: new Date(),
    });
  }
};

UserSchema.methods.removeFromCart = function(productId: string, variantId?: string) {
  this.cart = this.cart.filter((item: ICartItem) => 
    !(item.productId === productId && item.variantId === variantId)
  );
};

UserSchema.methods.updateCartItemQuantity = function(productId: string, quantity: number, variantId?: string) {
  const item = this.cart.find((item: ICartItem) => 
    item.productId === productId && item.variantId === variantId
  );
  
  if (item) {
    item.quantity = quantity;
  }
};

UserSchema.methods.clearCart = function() {
  this.cart = [];
};

UserSchema.methods.addToWishlist = function(productId: string, variantId?: string) {
  const existingItem = this.wishlist.find((item: IWishlistItem) => 
    item.productId === productId && item.variantId === variantId
  );
  
  if (!existingItem) {
    this.wishlist.push({
      productId,
      variantId,
      addedAt: new Date(),
    });
  }
};

UserSchema.methods.removeFromWishlist = function(productId: string, variantId?: string) {
  this.wishlist = this.wishlist.filter((item: IWishlistItem) => 
    !(item.productId === productId && item.variantId === variantId)
  );
};

UserSchema.methods.isProfessional = function(): boolean {
  return this.userType === 'professional';
};

UserSchema.methods.isVerifiedProfessional = function(): boolean {
  return this.userType === 'professional' && 
         this.professionalInfo?.verificationStatus === 'verified';
};

// Static methods
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase(), isActive: true });
};

UserSchema.statics.findProfessionals = function() {
  return this.find({ 
    userType: 'professional',
    isActive: true,
    'professionalInfo.verificationStatus': 'verified'
  });
};

// Create and export the model
export const User = models.User || model<IUser>('User', UserSchema);
export default User;