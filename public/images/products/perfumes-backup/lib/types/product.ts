/**
 * JC Hair Studio's 62 - Product Type Definitions
 *
 * Comprehensive TypeScript type definitions for the product catalog system.
 * This module defines all product-related types, interfaces, and enums
 * used throughout the e-commerce platform.
 *
 * @author JC Hair Studio
 * @version 1.0.0
 */

// =================================
// CORE PRODUCT TYPES
// =================================

/**
 * Base product interface containing all essential product information
 * Used for the main product catalog and individual product pages
 */
export interface Product {
  /** Unique identifier for the product */
  id: string;

  /** Product name displayed to customers */
  name: string;

  /** SEO-friendly URL slug */
  slug: string;

  /** Detailed product description with HTML support */
  description?: string;

  /** Short description for product cards and previews */
  shortDesc?: string;

  /** Stock Keeping Unit for inventory management */
  sku: string;

  /** Product barcode for inventory scanning */
  barcode?: string;

  /** Current selling price in euros */
  price: number;

  /** Professional/wholesale price for licensed professionals */
  professionalPrice?: number;

  /** Original price before discount (strike-through price) */
  comparePrice?: number;

  /** Product cost for margin calculations */
  cost?: number;

  /** Whether the product is currently on promotion */
  isOnPromotion: boolean;

  /** Promotional price when on sale */
  promoPrice?: number;

  /** Promotion start date */
  promoStartDate?: Date;

  /** Promotion end date */
  promoEndDate?: Date;

  /** Product weight in grams for shipping calculations */
  weight?: number;

  /** Hair length in centimeters (for hair extensions) */
  length?: number;

  /** Type of hair (straight, wavy, curly, etc.) */
  hairType?: HairType;

  /** Hair texture quality */
  hairTexture?: HairTexture;

  /** Hair color name or code */
  hairColor?: string;

  /** Country/region of hair origin */
  hairOrigin?: string;

  /** Brand name */
  brand?: string;

  /** Product line within the brand */
  productLine?: string;

  /** Volume specification (e.g., "1000ml", "500ml") */
  volume?: string;

  /** Category of product (hair extension, treatment, etc.) */
  productType: ProductType;

  /** Whether to track inventory quantities */
  trackQuantity: boolean;

  /** Current stock quantity */
  quantity: number;

  /** Minimum stock level for low stock alerts */
  lowStockAlert: number;

  /** Current product status */
  status: ProductStatus;

  /** Whether the product is digital (downloadable) */
  isDigital: boolean;

  /** Whether the product requires physical shipping */
  requiresShipping: boolean;

  /** SEO meta title */
  metaTitle?: string;

  /** SEO meta description */
  metaDescription?: string;

  /** SEO keywords */
  keywords?: string;

  /** Display order for sorting */
  displayOrder: number;

  /** Whether the product is featured on homepage */
  isFeatured: boolean;

  /** Product creation timestamp */
  createdAt: Date;

  /** Last modification timestamp */
  updatedAt: Date;

  /** Publication timestamp (when made active) */
  publishedAt?: Date;

  /** Associated category IDs */
  categoryIds: string[];

  /** Product variant IDs */
  variantIds: string[];

  /** Product image URLs and metadata */
  images: ProductImage[];

  /** Customer reviews and ratings */
  reviews?: ProductReview[];

  /** Product tags for filtering and search */
  tags: string[];

  /** Configurable product options (color, size, etc.) */
  options: ProductOption[];

  /** Average rating from customer reviews */
  averageRating?: number;

  /** Total number of reviews */
  reviewCount?: number;
}

// =================================
// PRODUCT STATUS & CLASSIFICATION
// =================================

/**
 * Product publication and availability status
 */
export enum ProductStatus {
  /** Product is in draft mode, not visible to customers */
  DRAFT = 'DRAFT',

  /** Product is active and available for purchase */
  ACTIVE = 'ACTIVE',

  /** Product is archived but may be restored later */
  ARCHIVED = 'ARCHIVED',

  /** Product is temporarily out of stock */
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

/**
 * Product type classification for the hair studio
 */
export enum ProductType {
  /** Hair extensions and weaves */
  HAIR_EXTENSION = 'HAIR_EXTENSION',

  /** Hair treatments and care products */
  HAIR_TREATMENT = 'HAIR_TREATMENT',

  /** Nail polish and nail care */
  NAIL_POLISH = 'NAIL_POLISH',

  /** Makeup and cosmetics */
  MAKEUP = 'MAKEUP',

  /** Professional tools and equipment */
  TOOL_PROFESSIONAL = 'TOOL_PROFESSIONAL',

  /** Body care products */
  BODY_CARE = 'BODY_CARE',

  /** Hair care products (shampoo, conditioner, etc.) */
  HAIR_CARE = 'HAIR_CARE',
}

/**
 * Hair type classification for extensions
 */
export enum HairType {
  /** Straight hair texture */
  STRAIGHT = 'STRAIGHT',

  /** Wavy hair texture */
  WAVY = 'WAVY',

  /** Curly hair texture */
  CURLY = 'CURLY',

  /** Coily/kinky hair texture */
  COILY = 'COILY',

  /** Mixed texture hair */
  MIXED = 'MIXED',
}

/**
 * Hair texture quality grades
 */
export enum HairTexture {
  /** Fine hair texture */
  FINE = 'FINE',

  /** Medium hair texture */
  MEDIUM = 'MEDIUM',

  /** Coarse hair texture */
  COARSE = 'COARSE',

  /** Extra coarse hair texture */
  EXTRA_COARSE = 'EXTRA_COARSE',
}

// =================================
// PRODUCT IMAGES
// =================================

/**
 * Product image metadata and configuration
 */
export interface ProductImage {
  /** Image URL (can be relative or absolute) */
  url: string;

  /** Alt text for accessibility */
  alt?: string;

  /** Image title for tooltips */
  title?: string;

  /** Display order for image gallery */
  displayOrder: number;

  /** Whether this is the main product image */
  isMain: boolean;

  /** Image width in pixels */
  width?: number;

  /** Image height in pixels */
  height?: number;

  /** File size in bytes */
  fileSize?: number;

  /** Image format (jpg, png, webp, etc.) */
  format?: string;
}

// =================================
// PRODUCT OPTIONS & VARIANTS
// =================================

/**
 * Configurable product options (color, size, volume, etc.)
 */
export interface ProductOption {
  /** Unique identifier for this option */
  id: string;

  /** Internal option name (e.g., "color", "size") */
  name: string;

  /** Display name shown to customers */
  displayName: string;

  /** Type of option control to display */
  type: OptionType;

  /** Whether this option is required for purchase */
  isRequired: boolean;

  /** Display order among other options */
  displayOrder: number;

  /** Available values for this option */
  values: ProductOptionValue[];
}

/**
 * UI component type for product options
 */
export enum OptionType {
  /** Dropdown/select list */
  SELECT = 'SELECT',

  /** Radio button group */
  RADIO = 'RADIO',

  /** Color picker/swatches */
  COLOR = 'COLOR',

  /** Size selector buttons */
  SIZE = 'SIZE',
}

/**
 * Individual option value (e.g., "Red", "Large", "1000ml")
 */
export interface ProductOptionValue {
  /** Unique identifier for this value */
  id: string;

  /** Option value (e.g., "Red", "L", "60cm") */
  value: string;

  /** Display label if different from value */
  label?: string;

  /** Hex color code for color options */
  hexColor?: string;

  /** Price adjustment for this option (+/- euros) */
  priceAdjustment: number;

  /** Stock quantity for this specific option */
  quantity: number;

  /** Whether this option value is currently available */
  isActive: boolean;

  /** Display order among option values */
  displayOrder: number;

  /** Additional metadata for the option value */
  metadata?: Record<string, any>;
}

/**
 * Product variant with specific option combinations
 */
export interface ProductVariant {
  /** Unique identifier for this variant */
  id: string;

  /** Parent product ID */
  productId: string;

  /** Variant name (e.g., "Red - Large") */
  name: string;

  /** Unique SKU for this variant */
  sku: string;

  /** Specific size for this variant */
  size?: string;

  /** Specific color for this variant */
  color?: string;

  /** Override price for this variant */
  price?: number;

  /** Professional price override */
  professionalPrice?: number;

  /** Compare price override */
  comparePrice?: number;

  /** Stock quantity for this variant */
  quantity: number;

  /** Whether this variant is active */
  isActive: boolean;

  /** Display order among variants */
  displayOrder: number;

  /** Variant creation timestamp */
  createdAt: Date;

  /** Last modification timestamp */
  updatedAt: Date;

  /** Selected option values that define this variant */
  selectedOptions: Record<string, string>;
}

// =================================
// PRODUCT REVIEWS & RATINGS
// =================================

/**
 * Customer review for a product
 */
export interface ProductReview {
  /** Unique review identifier */
  id: string;

  /** Product being reviewed */
  productId: string;

  /** Customer who wrote the review */
  userId: string;

  /** Customer name for display */
  customerName: string;

  /** Star rating (1-5) */
  rating: number;

  /** Review title/headline */
  title?: string;

  /** Review content/text */
  content: string;

  /** Whether the review is verified (customer purchased product) */
  isVerified: boolean;

  /** Whether the review is published and visible */
  isPublished: boolean;

  /** Number of helpful votes from other customers */
  helpfulCount: number;

  /** Review creation timestamp */
  createdAt: Date;

  /** Last modification timestamp */
  updatedAt: Date;
}

// =================================
// PRODUCT CATALOG & FILTERING
// =================================

/**
 * Product category for organization and navigation
 */
export interface ProductCategory {
  /** Unique category identifier */
  id: string;

  /** Category name */
  name: string;

  /** SEO-friendly URL slug */
  slug: string;

  /** Category description */
  description?: string;

  /** SEO meta title */
  metaTitle?: string;

  /** SEO meta description */
  metaDescription?: string;

  /** SEO keywords */
  keywords?: string;

  /** Category image URL */
  image?: string;

  /** Category banner image URL */
  banner?: string;

  /** Parent category ID (for hierarchy) */
  parentId?: string;

  /** Child category IDs */
  childrenIds: string[];

  /** Display order for sorting */
  displayOrder: number;

  /** Whether the category is active */
  isActive: boolean;

  /** Whether the category is featured */
  isFeatured: boolean;

  /** Category creation timestamp */
  createdAt: Date;

  /** Last modification timestamp */
  updatedAt: Date;

  /** Products in this category */
  productIds: string[];
}

/**
 * Product filtering options for search and browse
 */
export interface ProductFilters {
  /** Category filter */
  categoryIds?: string[];

  /** Brand filter */
  brands?: string[];

  /** Product type filter */
  productTypes?: ProductType[];

  /** Price range filter */
  priceRange?: {
    min: number;
    max: number;
  };

  /** Hair length filter (for hair extensions) */
  hairLengths?: number[];

  /** Hair color filter */
  hairColors?: string[];

  /** Hair texture filter */
  hairTextures?: HairTexture[];

  /** Availability filter */
  inStock?: boolean;

  /** Featured products only */
  featuredOnly?: boolean;

  /** On sale/promotion only */
  onSaleOnly?: boolean;

  /** Tag filters */
  tags?: string[];

  /** Search query */
  searchQuery?: string;
}

/**
 * Product sorting options
 */
export enum ProductSortBy {
  /** Sort by relevance (search results) */
  RELEVANCE = 'RELEVANCE',

  /** Sort by name A-Z */
  NAME_ASC = 'NAME_ASC',

  /** Sort by name Z-A */
  NAME_DESC = 'NAME_DESC',

  /** Sort by price low to high */
  PRICE_ASC = 'PRICE_ASC',

  /** Sort by price high to low */
  PRICE_DESC = 'PRICE_DESC',

  /** Sort by newest first */
  CREATED_DESC = 'CREATED_DESC',

  /** Sort by oldest first */
  CREATED_ASC = 'CREATED_ASC',

  /** Sort by best rating */
  RATING_DESC = 'RATING_DESC',

  /** Sort by most popular */
  POPULARITY_DESC = 'POPULARITY_DESC',

  /** Sort by featured first */
  FEATURED_FIRST = 'FEATURED_FIRST',
}

/**
 * Paginated product list response
 */
export interface ProductListResponse {
  /** Array of products for current page */
  products: Product[];

  /** Total number of products matching filters */
  totalCount: number;

  /** Current page number (1-based) */
  currentPage: number;

  /** Total number of pages */
  totalPages: number;

  /** Number of products per page */
  pageSize: number;

  /** Whether there is a next page */
  hasNextPage: boolean;

  /** Whether there is a previous page */
  hasPreviousPage: boolean;

  /** Applied filters for this result set */
  appliedFilters: ProductFilters;

  /** Available filter options based on current results */
  availableFilters: {
    brands: string[];
    categories: ProductCategory[];
    priceRange: { min: number; max: number };
    hairLengths: number[];
    hairColors: string[];
  };
}

// =================================
// CART & SHOPPING TYPES
// =================================

/**
 * Product item in shopping cart
 */
export interface CartProduct {
  /** Product ID */
  id: string;

  /** Product name */
  name: string;

  /** Product price at time of adding to cart */
  price: number;

  /** Selected product image */
  image?: string;

  /** Selected variant information */
  variant?: {
    id: string;
    name: string;
    sku: string;
  };

  /** Selected option values */
  selectedOptions: Record<string, string>;

  /** Quantity in cart */
  quantity: number;

  /** Maximum available quantity */
  maxQuantity: number;

  /** Whether the product is currently in stock */
  inStock: boolean;
}

// =================================
// API RESPONSE TYPES
// =================================

/**
 * Product API response wrapper
 */
export interface ProductApiResponse<T = Product> {
  /** Response data */
  data: T;

  /** Success status */
  success: boolean;

  /** Error message if any */
  message?: string;

  /** Additional metadata */
  meta?: {
    timestamp: string;
    version: string;
  };
}

/**
 * Bulk product operations response
 */
export interface BulkProductResponse {
  /** Number of successful operations */
  successCount: number;

  /** Number of failed operations */
  errorCount: number;

  /** List of errors that occurred */
  errors: Array<{
    productId: string;
    error: string;
  }>;

  /** Operation summary message */
  message: string;
}

// =================================
// UTILITY TYPES
// =================================

/**
 * Product creation payload (omits auto-generated fields)
 */
export type CreateProductPayload = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'averageRating' | 'reviewCount'
>;

/**
 * Product update payload (partial update with required ID)
 */
export type UpdateProductPayload = Partial<CreateProductPayload> & {
  id: string;
};

/**
 * Product summary for lists and previews
 */
export type ProductSummary = Pick<
  Product,
  | 'id'
  | 'name'
  | 'slug'
  | 'price'
  | 'comparePrice'
  | 'isOnPromotion'
  | 'promoPrice'
  | 'images'
  | 'status'
  | 'averageRating'
  | 'reviewCount'
  | 'quantity'
  | 'isFeatured'
>;

/**
 * Product search result with highlighting
 */
export interface ProductSearchResult extends ProductSummary {
  /** Search relevance score */
  relevanceScore: number;

  /** Highlighted text matches */
  highlights: {
    name?: string;
    description?: string;
    brand?: string;
  };
}

// =================================
// TYPE GUARDS
// =================================

/**
 * Type guard to check if a product is in stock
 */
export function isProductInStock(product: Product): boolean {
  return product.status === ProductStatus.ACTIVE &&
         (!product.trackQuantity || product.quantity > 0);
}

/**
 * Type guard to check if a product is on sale
 */
export function isProductOnSale(product: Product): boolean {
  return product.isOnPromotion &&
         product.promoPrice !== undefined &&
         product.promoPrice < product.price;
}

/**
 * Type guard to check if a product is a hair extension
 */
export function isHairExtension(product: Product): boolean {
  return product.productType === ProductType.HAIR_EXTENSION;
}