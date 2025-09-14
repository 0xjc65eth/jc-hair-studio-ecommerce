import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  price: {
    retail: number;
    professional: number;
    promotional?: number;
    currency: string;
  };
  sizes: Array<{
    size: string;
    price: number;
    stock: number;
    barcode: string;
  }>;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  stock: {
    available: number;
    reserved: number;
    minimum: number;
  };
  attributes: {
    color?: string;
    texture?: string;
    finish?: string;
    voltage?: string;
    power?: string;
    benefits?: string[];
    indications?: string[];
    composition?: string[];
  };
  ratings: {
    average: number;
    count: number;
    reviews: Array<{
      userId: mongoose.Types.ObjectId;
      rating: number;
      comment: string;
      date: Date;
      verified: boolean;
      helpful: number;
      photos?: string[];
    }>;
  };
  tags: string[];
  seo: {
    slug: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  sku: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  brand: { 
    type: String, 
    required: true,
    trim: true
  },
  category: { 
    type: String, 
    required: true,
    enum: ['tratamento_capilar', 'esmaltes', 'maquiagem', 'ferramentas', 'cuidados_diarios', 'corporais']
  },
  subcategory: { 
    type: String, 
    required: true
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  price: {
    retail: { type: Number, required: true, min: 0 },
    professional: { type: Number, required: true, min: 0 },
    promotional: { type: Number, min: 0 },
    currency: { type: String, default: 'BRL' }
  },
  sizes: [{
    size: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    barcode: { type: String, required: true }
  }],
  images: [{
    url: { type: String, required: true },
    alt: { type: String, required: true },
    isPrimary: { type: Boolean, default: false }
  }],
  stock: {
    available: { type: Number, required: true, min: 0, default: 0 },
    reserved: { type: Number, default: 0, min: 0 },
    minimum: { type: Number, default: 5, min: 0 }
  },
  attributes: {
    color: String,
    texture: String,
    finish: String,
    voltage: String,
    power: String,
    benefits: [String],
    indications: [String],
    composition: [String]
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 },
    reviews: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true, maxlength: 1000 },
      date: { type: Date, default: Date.now },
      verified: { type: Boolean, default: false },
      helpful: { type: Number, default: 0 },
      photos: [String]
    }]
  },
  tags: [{ 
    type: String, 
    lowercase: true,
    trim: true
  }],
  seo: {
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Índices para otimização
ProductSchema.index({ sku: 1 }, { unique: true });
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ 'price.retail': 1 });
ProductSchema.index({ 'price.professional': 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ featured: 1, isActive: 1 });
ProductSchema.index({ 'ratings.average': -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ 'seo.slug': 1 }, { unique: true });

// Índice de texto para busca
ProductSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  tags: 'text'
});

// Middleware para gerar slug automaticamente
ProductSchema.pre('save', function(next) {
  if (!this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Métodos virtuais
ProductSchema.virtual('inStock').get(function() {
  return this.stock.available > 0;
});

ProductSchema.virtual('needsRestock').get(function() {
  return this.stock.available <= this.stock.minimum;
});

ProductSchema.virtual('discountPercentage').get(function() {
  if (this.price.promotional && this.price.promotional < this.price.retail) {
    return Math.round(((this.price.retail - this.price.promotional) / this.price.retail) * 100);
  }
  return 0;
});

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);