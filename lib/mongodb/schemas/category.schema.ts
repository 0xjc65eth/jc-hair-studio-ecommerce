/**
 * Category Schema - MongoDB with Zod validation
 * JC Hair Studio's 62 E-commerce
 */

import { Schema, model, models, Document } from 'mongoose';
import { z } from 'zod';

// Zod validation schemas
export const CategorySeoZodSchema = z.object({
  title: z.string().min(1, 'Título SEO obrigatório').max(60, 'Título SEO muito longo'),
  description: z.string().min(1, 'Descrição SEO obrigatória').max(160, 'Descrição SEO muito longa'),
  keywords: z.array(z.string()).default([]),
});

export const CategoryZodSchema = z.object({
  // Informações básicas
  name: z.string().min(1, 'Nome da categoria obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  slug: z.string().min(1, 'Slug obrigatório').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  
  // Hierarquia
  parentId: z.string().nullable().default(null),
  level: z.number().int().min(0).default(0),
  path: z.string().default(''),
  
  // Imagem
  image: z.object({
    url: z.string().url('URL da imagem inválida'),
    alt: z.string().min(1, 'Texto alternativo obrigatório'),
  }).optional(),
  
  // SEO
  seo: CategorySeoZodSchema,
  
  // Organização
  displayOrder: z.number().int().min(0).default(0),
  
  // Status
  isActive: z.boolean().default(true),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  
  // Configurações especiais
  showInMenu: z.boolean().default(true),
  showInFooter: z.boolean().default(false),
  
  // Métricas
  productCount: z.number().int().min(0).default(0),
  viewCount: z.number().int().min(0).default(0),
});

// TypeScript interfaces
export interface ICategorySeo {
  title: string;
  description: string;
  keywords: string[];
}

export interface ICategoryImage {
  url: string;
  alt: string;
}

export interface ICategory extends Document {
  // Informações básicas
  name: string;
  description?: string;
  slug: string;
  
  // Hierarquia
  parentId: string | null;
  level: number;
  path: string;
  
  // Imagem
  image?: ICategoryImage;
  
  // SEO
  seo: ICategorySeo;
  
  // Organização
  displayOrder: number;
  
  // Status
  isActive: boolean;
  isVisible: boolean;
  isFeatured: boolean;
  
  // Configurações especiais
  showInMenu: boolean;
  showInFooter: boolean;
  
  // Métricas
  productCount: number;
  viewCount: number;
  
  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual properties
  children?: ICategory[];
  parent?: ICategory;
  breadcrumb?: string[];
}

// MongoDB Schema
const CategorySeoSchema = new Schema<ICategorySeo>({
  title: { type: String, required: true, maxlength: 60 },
  description: { type: String, required: true, maxlength: 160 },
  keywords: [{ type: String }],
});

const CategoryImageSchema = new Schema<ICategoryImage>({
  url: { type: String, required: true },
  alt: { type: String, required: true },
});

const CategorySchema = new Schema<ICategory>({
  // Informações básicas
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[a-z0-9-]+$/
  },
  
  // Hierarquia
  parentId: { type: String, default: null },
  level: { type: Number, default: 0, min: 0 },
  path: { type: String, default: '' },
  
  // Imagem
  image: CategoryImageSchema,
  
  // SEO
  seo: CategorySeoSchema,
  
  // Organização
  displayOrder: { type: Number, default: 0, min: 0 },
  
  // Status
  isActive: { type: Boolean, default: true },
  isVisible: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  
  // Configurações especiais
  showInMenu: { type: Boolean, default: true },
  showInFooter: { type: Boolean, default: false },
  
  // Métricas
  productCount: { type: Number, default: 0, min: 0 },
  viewCount: { type: Number, default: 0, min: 0 },
}, { 
  timestamps: true,
  collection: 'categories'
});

// Virtual for children categories
CategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId'
});

// Virtual for parent category
CategorySchema.virtual('parent', {
  ref: 'Category',
  localField: 'parentId',
  foreignField: '_id',
  justOne: true
});

// Virtual for breadcrumb
CategorySchema.virtual('breadcrumb').get(function() {
  if (!this.path) return [this.name];
  return this.path.split('/').filter(Boolean);
});

// Ensure virtual fields are included in JSON
CategorySchema.set('toJSON', { virtuals: true });
CategorySchema.set('toObject', { virtuals: true });

// Pre-save middleware to calculate path and level
CategorySchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('parentId')) {
    if (this.parentId) {
      const parent = await this.constructor.findById(this.parentId);
      if (parent) {
        this.level = (parent as any).level + 1;
        this.path = (parent as any).path ? `${(parent as any).path}/${(parent as any).name}` : (parent as any).name;
      }
    } else {
      this.level = 0;
      this.path = '';
    }
  }
  next();
});

// Post-save middleware to update product count
CategorySchema.post('save', async function() {
  // This would be implemented to update product counts
  // when categories are created or modified
});

// Static methods
CategorySchema.statics.findBySlug = function(slug: string) {
  return this.findOne({ slug, isActive: true, isVisible: true });
};

CategorySchema.statics.findFeatured = function() {
  return this.find({ 
    isFeatured: true, 
    isActive: true, 
    isVisible: true 
  }).sort({ displayOrder: 1 });
};

CategorySchema.statics.findForMenu = function() {
  return this.find({ 
    showInMenu: true, 
    isActive: true, 
    isVisible: true,
    level: { $lte: 2 } // Limit menu depth
  }).sort({ level: 1, displayOrder: 1 });
};

CategorySchema.statics.findRoots = function() {
  return this.find({ 
    parentId: null, 
    isActive: true, 
    isVisible: true 
  }).sort({ displayOrder: 1 });
};

CategorySchema.statics.buildTree = async function() {
  const categories = await this.find({ 
    isActive: true, 
    isVisible: true 
  }).sort({ level: 1, displayOrder: 1 });
  
  const categoryMap = new Map();
  const roots: any[] = [];
  
  // First pass: create map
  categories.forEach((cat: any) => {
    categoryMap.set(cat._id.toString(), {
      ...cat.toObject(),
      children: []
    });
  });
  
  // Second pass: build tree
  categories.forEach((cat: any) => {
    const category = categoryMap.get(cat._id.toString());
    if (cat.parentId) {
      const parent = categoryMap.get(cat.parentId.toString());
      if (parent) {
        parent.children.push(category);
      }
    } else {
      roots.push(category);
    }
  });
  
  return roots;
};

// Instance methods
CategorySchema.methods.getAncestors = async function() {
  const ancestors = [];
  let currentParentId = this.parentId;
  
  while (currentParentId) {
    const parent = await this.constructor.findById(currentParentId);
    if (parent) {
      ancestors.unshift(parent);
      currentParentId = parent.parentId;
    } else {
      break;
    }
  }
  
  return ancestors;
};

CategorySchema.methods.getDescendants = async function() {
  return this.constructor.find({
    path: new RegExp(`^${this.path}/${this.name}`)
  });
};

// Create and export the model
export const Category = models.Category || model<ICategory>('Category', CategorySchema);
export default Category;