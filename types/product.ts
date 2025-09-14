/**
 * Product & Catalog Types
 * JC Hair Studio's 62 E-commerce
 */

import { 
  Product, 
  ProductVariant, 
  ProductImage, 
  Category, 
  Review,
  HairType,
  HairTexture,
  ProductStatus 
} from '../lib/generated/prisma';

// Extended product types with relations
export interface ProductWithDetails extends Product {
  images: ProductImage[];
  variants: ProductVariant[];
  categories: Array<{
    category: Category;
  }>;
  reviews: Array<Review & {
    user: {
      name: string | null;
      firstName: string | null;
      lastName: string | null;
    };
  }>;
  _count?: {
    reviews: number;
  };
  averageRating?: number;
}

export interface CategoryWithProducts extends Category {
  products: Array<{
    product: ProductWithDetails;
  }>;
  children?: CategoryWithProducts[];
  parent?: CategoryWithProducts | null;
  _count?: {
    products: number;
  };
}

// Product filtering and search
export interface ProductFilters {
  category?: string[];
  brand?: string[];
  priceMin?: number;
  priceMax?: number;
  priceRange?: string; // '10-30' | '30-50' | '50-100' | '100+'
  hairType?: HairType[];
  hairTexture?: HairTexture[];
  length?: number[];
  color?: string[];
  inStock?: boolean;
  featured?: boolean;
  onSale?: boolean;
  rating?: number;
  search?: string;
  sortBy?: ProductSortOption;
  page?: number;
  limit?: number;
}

// Advanced filter types
export interface AdvancedFilters extends ProductFilters {
  viewingCount?: boolean; // Show "X pessoas vendo agora"
  hasReviews?: boolean;
  isPopular?: boolean;
  isNew?: boolean; // Last 30 days
}

// Brand information
export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  country: string;
  description?: string;
}

// Hair type enum extended
export type HairTypeFilter = 'LISO' | 'ONDULADO' | 'CACHEADO' | 'TODOS';

// Wishlist types
export interface WishlistItem {
  id: string;
  productId: string;
  userId?: string;
  sessionId?: string;
  addedAt: Date;
  product: ProductWithDetails;
}

// Product comparison
export interface ProductComparison {
  products: ProductWithDetails[];
  maxProducts: 3;
}

// Review with photos
export interface ReviewWithPhotos extends Review {
  photos: Array<{
    id: string;
    url: string;
    alt?: string;
  }>;
  user: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    avatar?: string | null;
  };
}

// Shipping calculator
export interface ShippingCalculation {
  country: string;
  weight: number;
  value: number;
  estimatedDays: number;
  cost: number;
  trackingIncluded: boolean;
}

// Newsletter types
export interface NewsletterSubscription {
  email: string;
  name?: string;
  country?: string;
  interests: string[];
  source: 'popup' | 'footer' | 'checkout';
}

export type ProductSortOption = 
  | 'newest'
  | 'oldest'
  | 'price-low-high'
  | 'price-high-low'
  | 'name-asc'
  | 'name-desc'
  | 'rating-high'
  | 'rating-low'
  | 'popularity'
  | 'featured';

export interface ProductSearchResult {
  products: ProductWithDetails[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    categories: Array<{ id: string; name: string; count: number }>;
    priceRange: { min: number; max: number };
    hairTypes: Array<{ type: HairType; count: number }>;
    hairTextures: Array<{ texture: HairTexture; count: number }>;
    lengths: Array<{ length: number; count: number }>;
    colors: Array<{ color: string; count: number }>;
  };
}

// Product creation and updates
export interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  shortDesc?: string;
  sku: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  weight?: number;
  length?: number;
  hairType?: HairType;
  hairTexture?: HairTexture;
  hairColor?: string;
  hairOrigin?: string;
  quantity: number;
  lowStockAlert?: number;
  status: ProductStatus;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  isFeatured?: boolean;
  categories: string[];
  images: Array<{
    url: string;
    alt?: string;
    title?: string;
    isMain?: boolean;
  }>;
  variants?: Array<{
    name: string;
    sku: string;
    size?: string;
    color?: string;
    price?: number;
    comparePrice?: number;
    quantity?: number;
  }>;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

// Shopping cart types
export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: ProductImage[];
    status: ProductStatus;
    quantity: number;
  };
  variant?: {
    id: string;
    name: string;
    price?: number;
    quantity: number;
  };
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemsCount: number;
  isEmpty: boolean;
}

// Product analytics
export interface ProductAnalytics {
  views: number;
  purchases: number;
  conversions: number;
  revenue: number;
  ratings: {
    average: number;
    count: number;
    distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  };
}

// Inventory management
export interface InventoryUpdate {
  productId: string;
  variantId?: string;
  quantity: number;
  operation: 'add' | 'subtract' | 'set';
  reason?: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  alertThreshold: number;
  variantId?: string;
  variantName?: string;
  createdAt: Date;
}