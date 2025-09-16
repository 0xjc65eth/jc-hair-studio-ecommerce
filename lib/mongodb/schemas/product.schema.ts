/**
 * Product Schema - MongoDB with Zod validation
 * JC Hair Studio's 62's 62 E-commerce
 */

import { Schema, model, models, Document, Types } from 'mongoose';
import { z } from 'zod';

// Zod validation schemas
export const ProductImageZodSchema = z.object({
  url: z.string().url('URL da imagem inválida'),
  alt: z.string().min(1, 'Texto alternativo obrigatório'),
  isMain: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
});

export const ProductVariantZodSchema = z.object({
  name: z.string().min(1, 'Nome da variação obrigatório'),
  type: z.enum(['color', 'size', 'length', 'texture'], {
    required_error: 'Tipo de variação obrigatório',
  }),
  value: z.string().min(1, 'Valor da variação obrigatório'),
  price: z.number().min(0, 'Preço deve ser positivo'),
  stock: z.number().int().min(0, 'Estoque deve ser positivo'),
  sku: z.string().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

export const ProductReviewZodSchema = z.object({
  userId: z.string().min(1, 'ID do usuário obrigatório'),
  rating: z.number().int().min(1).max(5, 'Avaliação deve ser entre 1 e 5'),
  title: z.string().min(1, 'Título obrigatório').max(100, 'Título muito longo'),
  comment: z.string().min(10, 'Comentário deve ter pelo menos 10 caracteres').max(1000, 'Comentário muito longo'),
  photos: z.array(z.string().url()).default([]),
  isVerifiedPurchase: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  moderatedBy: z.string().optional(),
  moderatedAt: z.date().optional(),
  helpfulCount: z.number().int().min(0).default(0),
  reportCount: z.number().int().min(0).default(0),
});

export const ProductSeoZodSchema = z.object({
  title: z.string().min(1, 'Título SEO obrigatório').max(60, 'Título SEO muito longo'),
  description: z.string().min(1, 'Descrição SEO obrigatória').max(160, 'Descrição SEO muito longa'),
  keywords: z.array(z.string()).default([]),
  slug: z.string().min(1, 'Slug obrigatório').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
});

export const ProductZodSchema = z.object({
  // Informações básicas
  name: z.string().min(1, 'Nome do produto obrigatório').max(200, 'Nome muito longo'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').max(2000, 'Descrição muito longa'),
  shortDescription: z.string().max(300, 'Descrição curta muito longa').optional(),
  
  // SKU e identificação
  sku: z.string().min(1, 'SKU obrigatório').regex(/^[A-Z0-9-]+$/, 'SKU deve conter apenas letras maiúsculas, números e hífens'),
  barcode: z.string().optional(),
  
  // Preços
  price: z.number().min(0, 'Preço deve ser positivo'),
  retailPrice: z.number().min(0, 'Preço de varejo deve ser positivo'),
  professionalPrice: z.number().min(0, 'Preço profissional deve ser positivo'),
  costPrice: z.number().min(0, 'Preço de custo deve ser positivo').optional(),
  
  // Categorias e classificação
  categoryIds: z.array(z.string().min(1, 'ID da categoria inválido')),
  brandId: z.string().min(1, 'ID da marca obrigatório'),
  tags: z.array(z.string()).default([]),
  
  // Imagens e mídias
  images: z.array(ProductImageZodSchema).min(1, 'Pelo menos uma imagem obrigatória'),
  videos: z.array(z.string().url()).default([]),
  
  // Variações
  variants: z.array(ProductVariantZodSchema).default([]),
  hasVariants: z.boolean().default(false),
  
  // Estoque
  stock: z.number().int().min(0, 'Estoque deve ser positivo'),
  minStock: z.number().int().min(0).default(5),
  trackStock: z.boolean().default(true),
  
  // Dimensões e peso
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
  }).optional(),
  
  // Características do produto
  characteristics: z.record(z.string()).default({}),
  ingredients: z.array(z.string()).default([]),
  usage: z.string().optional(),
  warnings: z.array(z.string()).default([]),
  
  // Avaliações
  reviews: z.array(ProductReviewZodSchema).default([]),
  averageRating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  
  // SEO
  seo: ProductSeoZodSchema,
  
  // Status e visibilidade
  isActive: z.boolean().default(true),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  
  // Datas importantes
  publishedAt: z.date().optional(),
  saleStartDate: z.date().optional(),
  saleEndDate: z.date().optional(),
  
  // Métricas
  viewCount: z.number().int().min(0).default(0),
  purchaseCount: z.number().int().min(0).default(0),
  wishlistCount: z.number().int().min(0).default(0),
});

// TypeScript interfaces
export interface IProductImage {
  url: string;
  alt: string;
  isMain: boolean;
  displayOrder: number;
}

export interface IProductVariant {
  name: string;
  type: 'color' | 'size' | 'length' | 'texture';
  value: string;
  price: number;
  stock: number;
  sku?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface IProductReview {
  userId: string;
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  isVerifiedPurchase: boolean;
  isPublished: boolean;
  moderatedBy?: string;
  moderatedAt?: Date;
  helpfulCount: number;
  reportCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductSeo {
  title: string;
  description: string;
  keywords: string[];
  slug: string;
}

export interface IProduct extends Document {
  // Informações básicas
  name: string;
  description: string;
  shortDescription?: string;
  
  // SKU e identificação
  sku?: string;
  barcode?: string;
  
  // Preços
  price: number;
  retailPrice: number;
  professionalPrice: number;
  costPrice?: number;
  
  // Categorias e classificação
  categoryIds: string[];
  brandId: string;
  tags: string[];
  
  // Imagens e mídias
  images: IProductImage[];
  videos: string[];
  
  // Variações
  variants: IProductVariant[];
  hasVariants: boolean;
  
  // Estoque
  stock: number;
  minStock: number;
  trackStock: boolean;
  
  // Dimensões e peso
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  // Características do produto
  characteristics: Record<string, string>;
  ingredients: string[];
  usage?: string;
  warnings: string[];
  
  // Avaliações
  reviews: IProductReview[];
  averageRating: number;
  reviewCount: number;
  
  // SEO
  seo: IProductSeo;
  
  // Status e visibilidade
  isActive: boolean;
  isVisible: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  
  // Datas importantes
  publishedAt?: Date;
  saleStartDate?: Date;
  saleEndDate?: Date;
  
  // Métricas
  viewCount: number;
  purchaseCount: number;
  wishlistCount: number;
  
  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
}

// MongoDB Schema
const ProductImageSchema = new Schema<IProductImage>({
  url: { type: String, required: true },
  alt: { type: String, required: true },
  isMain: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
});

const ProductVariantSchema = new Schema<IProductVariant>({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['color', 'size', 'length', 'texture'] 
  },
  value: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  sku: { type: String, sparse: true },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
});

const ProductReviewSchema = new Schema<IProductReview>({
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, maxlength: 100 },
  comment: { type: String, required: true, minlength: 10, maxlength: 1000 },
  photos: [{ type: String }],
  isVerifiedPurchase: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  moderatedBy: { type: String },
  moderatedAt: { type: Date },
  helpfulCount: { type: Number, default: 0, min: 0 },
  reportCount: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

const ProductSeoSchema = new Schema<IProductSeo>({
  title: { type: String, required: true, maxlength: 60 },
  description: { type: String, required: true, maxlength: 160 },
  keywords: [{ type: String }],
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[a-z0-9-]+$/
  },
});

const ProductSchema = new Schema<IProduct>({
  // Informações básicas
  name: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, minlength: 10, maxlength: 2000 },
  shortDescription: { type: String, maxlength: 300 },
  
  // SKU e identificação
  sku: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[A-Z0-9-]+$/
  },
  barcode: { type: String },
  
  // Preços
  price: { type: Number, required: true, min: 0 },
  retailPrice: { type: Number, required: true, min: 0 },
  professionalPrice: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, min: 0 },
  
  // Categorias e classificação
  categoryIds: [{ type: String, required: true }],
  brandId: { type: String, required: true },
  tags: [{ type: String }],
  
  // Imagens e mídias
  images: [ProductImageSchema],
  videos: [{ type: String }],
  
  // Variações
  variants: [ProductVariantSchema],
  hasVariants: { type: Boolean, default: false },
  
  // Estoque
  stock: { type: Number, required: true, min: 0 },
  minStock: { type: Number, default: 5, min: 0 },
  trackStock: { type: Boolean, default: true },
  
  // Dimensões e peso
  weight: { type: Number, min: 0 },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },
  
  // Características do produto
  characteristics: { type: Map, of: String, default: {} },
  ingredients: [{ type: String }],
  usage: { type: String },
  warnings: [{ type: String }],
  
  // Avaliações
  reviews: [ProductReviewSchema],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  
  // SEO
  seo: ProductSeoSchema,
  
  // Status e visibilidade
  isActive: { type: Boolean, default: true },
  isVisible: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isOnSale: { type: Boolean, default: false },
  
  // Datas importantes
  publishedAt: { type: Date },
  saleStartDate: { type: Date },
  saleEndDate: { type: Date },
  
  // Métricas
  viewCount: { type: Number, default: 0, min: 0 },
  purchaseCount: { type: Number, default: 0, min: 0 },
  wishlistCount: { type: Number, default: 0, min: 0 },
}, { 
  timestamps: true,
  collection: 'products'
});

// Create and export the model
export const Product = models.Product || model<IProduct>('Product', ProductSchema);
export default Product;