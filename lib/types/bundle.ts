/**
 * JC Hair Studio's 62 - Bundle/Kit Type Definitions
 *
 * Comprehensive TypeScript type definitions for product bundles/kits system
 * Supports automatic discount detection and application
 *
 * @author JC Hair Studio
 * @version 1.0.0
 */

/**
 * Product reference in a bundle
 */
export interface BundleProduct {
  /** Product ID */
  productId: string;

  /** Quantity required in bundle */
  quantity: number;

  /** Optional specific variant ID */
  variantId?: string;

  /** Whether this product is mandatory in the bundle */
  required: boolean;

  /** Alternative product IDs that can substitute this product */
  alternatives?: string[];
}

/**
 * Bundle discount configuration
 */
export interface BundleDiscount {
  /** Discount type */
  type: 'percentage' | 'fixed' | 'buy_x_get_y';

  /** Discount value (percentage 0-100 or fixed amount in EUR) */
  value: number;

  /** Minimum quantity to trigger discount */
  minQuantity?: number;

  /** Maximum discount amount (cap) */
  maxDiscount?: number;

  /** Buy X Get Y configuration */
  buyXGetY?: {
    buy: number;
    get: number;
    applyToProductId?: string; // If not specified, applies to cheapest item
  };
}

/**
 * Bundle/Kit definition
 */
export interface Bundle {
  /** Unique bundle identifier */
  id: string;

  /** Bundle name */
  name: string;

  /** Bundle description */
  description: string;

  /** Bundle category/type */
  category: BundleCategory;

  /** Products included in bundle */
  products: BundleProduct[];

  /** Discount configuration */
  discount: BundleDiscount;

  /** Bundle badge text */
  badge?: string;

  /** Bundle image URL */
  image?: string;

  /** Additional images */
  images?: string[];

  /** Whether bundle is currently active */
  isActive: boolean;

  /** Priority for display ordering */
  priority: number;

  /** Start date for bundle availability */
  startDate?: Date;

  /** End date for bundle availability */
  endDate?: Date;

  /** Tags for filtering */
  tags: string[];

  /** SEO-friendly slug */
  slug: string;

  /** Minimum total value to apply bundle */
  minValue?: number;

  /** Maximum times this bundle can be applied per cart */
  maxApplications?: number;
}

/**
 * Bundle categories
 */
export enum BundleCategory {
  /** Hair extension bundles */
  MEGA_HAIR = 'MEGA_HAIR',

  /** Hair treatment bundles */
  TRATAMENTOS = 'TRATAMENTOS',

  /** Makeup bundles */
  MAQUIAGEM = 'MAQUIAGEM',

  /** Mixed product bundles */
  COMPLETO = 'COMPLETO',

  /** Seasonal/promotional bundles */
  PROMOCIONAL = 'PROMOCIONAL',

  /** Professional kits */
  PROFISSIONAL = 'PROFISSIONAL',
}

/**
 * Bundle application result
 */
export interface BundleApplication {
  /** Bundle that was applied */
  bundle: Bundle;

  /** Products matched in the bundle */
  matchedProducts: Array<{
    productId: string;
    quantity: number;
    variantId?: string;
  }>;

  /** Original total before discount */
  originalTotal: number;

  /** Discount amount */
  discountAmount: number;

  /** Final total after discount */
  finalTotal: number;

  /** Whether the bundle was fully matched */
  isComplete: boolean;

  /** Missing products if incomplete */
  missingProducts?: BundleProduct[];
}

/**
 * Cart bundle analysis result
 */
export interface CartBundleAnalysis {
  /** Bundles that were automatically applied */
  appliedBundles: BundleApplication[];

  /** Bundles that are partially matched */
  partialMatches: Array<{
    bundle: Bundle;
    matchedProducts: BundleProduct[];
    missingProducts: BundleProduct[];
    progress: number; // Percentage 0-100
  }>;

  /** Suggested bundles based on cart contents */
  suggestions: Bundle[];

  /** Total discount from all bundles */
  totalBundleDiscount: number;

  /** Original cart total */
  originalTotal: number;

  /** Final total after bundle discounts */
  finalTotal: number;
}

/**
 * Bundle recommendation
 */
export interface BundleRecommendation {
  /** Recommended bundle */
  bundle: Bundle;

  /** Reason for recommendation */
  reason: string;

  /** Potential savings */
  potentialSavings: number;

  /** Products user needs to add */
  productsToAdd: BundleProduct[];

  /** Current cart matches */
  currentMatches: BundleProduct[];
}

/**
 * Type guard to check if discount is percentage-based
 */
export function isPercentageDiscount(discount: BundleDiscount): boolean {
  return discount.type === 'percentage';
}

/**
 * Type guard to check if discount is fixed amount
 */
export function isFixedDiscount(discount: BundleDiscount): boolean {
  return discount.type === 'fixed';
}

/**
 * Type guard to check if discount is buy X get Y
 */
export function isBuyXGetYDiscount(discount: BundleDiscount): boolean {
  return discount.type === 'buy_x_get_y';
}

/**
 * Check if bundle is currently active
 */
export function isBundleActive(bundle: Bundle): boolean {
  if (!bundle.isActive) return false;

  const now = new Date();

  if (bundle.startDate && now < bundle.startDate) return false;
  if (bundle.endDate && now > bundle.endDate) return false;

  return true;
}

/**
 * Calculate bundle savings
 */
export function calculateBundleSavings(
  originalTotal: number,
  discount: BundleDiscount
): number {
  switch (discount.type) {
    case 'percentage':
      const percentageSaving = originalTotal * (discount.value / 100);
      return discount.maxDiscount
        ? Math.min(percentageSaving, discount.maxDiscount)
        : percentageSaving;

    case 'fixed':
      return Math.min(discount.value, originalTotal);

    case 'buy_x_get_y':
      // This requires product-specific calculation
      // Will be handled by the bundle service
      return 0;

    default:
      return 0;
  }
}
