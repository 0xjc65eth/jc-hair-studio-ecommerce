/**
 * Price Utilities for Brazilian Beauty E-commerce
 * 
 * Comprehensive price conversion and formatting system for BRL to EUR conversion
 * Formula: BRL × 0.20 × 1.5 = EUR (20% base rate + 50% profit margin)
 * 
 * Features:
 * - BRL to EUR conversion with profit margin
 * - Dual currency formatting (EUR primary, BRL reference)
 * - Brazilian number formatting (comma for decimals)
 * - Price validation and error handling
 * - Discount calculations
 * - Bulk pricing and complex scenarios
 */

// Re-export all constants
export * from './price-constants';

// Re-export core conversion functions
export {
  convertBrlToEur,
  convertEurToBrl,
  calculateProfitMargin,
  getBaseEurPrice,
  calculateDiscount,
  applyDiscount,
  validatePrice,
  roundPrice,
  comparePrices,
  getHigherPrice,
  getLowerPrice,
} from './price-conversion';

// Re-export formatting functions
export {
  formatPrice,
  formatDualPrice,
  formatPriceRange,
  formatDualPriceRange,
  formatDiscount,
  formatSavings,
  formatCompactPrice,
  formatPriceNumber,
  parsePrice,
} from './price-formatting';

// Re-export utility collections
export {
  priceComparison,
  priceCalculation,
  currencyUtils,
  priceIO,
  // Also export with shorter aliases
  comparison,
  calculation,
  currency,
  io,
} from './price-utilities';

// Main utility functions for common use cases
import { 
  convertBrlToEur, 
  validatePrice, 
  calculateDiscount as calcDiscount,
  roundPrice 
} from './price-conversion';
import { 
  formatPrice, 
  formatDualPrice 
} from './price-formatting';
import { Currency } from './price-constants';

/**
 * Quick conversion and formatting for common use cases
 */
export const price = {
  /**
   * Convert BRL to EUR with profit margin (main conversion function)
   * @param brlPrice - Price in Brazilian Reais
   * @returns Price in Euros with profit margin applied
   * @example price.convert(100) → 30.00
   */
  convert: convertBrlToEur,

  /**
   * Format price for display
   * @param price - Price to format
   * @param currency - Currency type ('BRL' | 'EUR')
   * @returns Formatted price string
   * @example price.format(30, 'EUR') → "€30,00"
   * @example price.format(100, 'BRL') → "R$ 100,00"
   */
  format: formatPrice,

  /**
   * Format dual currency display (EUR primary with BRL in parentheses)
   * @param brlPrice - Original price in BRL
   * @returns Formatted dual price string
   * @example price.formatDual(100) → "€30,00 (R$ 100,00)"
   */
  formatDual: formatDualPrice,

  /**
   * Calculate discount percentage
   * @param originalPrice - Original price
   * @param salePrice - Sale price
   * @returns Discount percentage (0-100)
   * @example price.discount(100, 80) → 20
   */
  discount: calcDiscount,

  /**
   * Validate if a price is valid
   * @param price - Price to validate
   * @returns True if price is valid
   */
  validate: validatePrice,

  /**
   * Round price to valid currency format
   * @param price - Price to round
   * @returns Rounded price
   */
  round: roundPrice,

  /**
   * Quick price display for products (converts BRL to dual format)
   * @param brlPrice - Product price in BRL
   * @param showDiscount - Whether to calculate and show discount info
   * @param originalBrlPrice - Original price for discount calculation
   * @returns Formatted price object with display strings
   */
  display: (
    brlPrice: number, 
    showDiscount?: boolean, 
    originalBrlPrice?: number
  ) => {
    if (!validatePrice(brlPrice)) {
      return {
        dual: '€0,00 (R$ 0,00)',
        eur: '€0,00',
        brl: 'R$ 0,00',
        isOnSale: false,
        discountPercent: 0,
      };
    }

    const eurPrice = convertBrlToEur(brlPrice);
    const isOnSale = showDiscount && 
                     originalBrlPrice && 
                     validatePrice(originalBrlPrice) && 
                     brlPrice < originalBrlPrice;

    return {
      dual: formatDualPrice(brlPrice),
      eur: formatPrice(eurPrice, 'EUR'),
      brl: formatPrice(brlPrice, 'BRL'),
      isOnSale: isOnSale || false,
      discountPercent: isOnSale ? calcDiscount(originalBrlPrice!, brlPrice) : 0,
    };
  },
};

/**
 * Default export - main price utility object
 */
export default price;

/**
 * Type definitions for external use
 */
export interface PriceDisplay {
  dual: string;
  eur: string;
  brl: string;
  isOnSale: boolean;
  discountPercent: number;
}

export interface PriceData {
  brl: {
    value: number;
    formatted: string;
  };
  eur: {
    value: number;
    formatted: string;
  };
  dual: string;
}

export interface BulkDiscountRule {
  minQty: number;
  discountPercent: number;
}

export interface PricingTier {
  maxQty: number;
  pricePerUnit: number;
}

export interface ShippingRules {
  freeShippingThreshold?: number;
  baseRate: number;
  weightRate: number;
  maxWeight?: number;
}

/**
 * Usage Examples:
 * 
 * Basic conversion:
 * ```typescript
 * import { convertBrlToEur, formatDualPrice } from '@/lib/utils/price';
 * 
 * const brlPrice = 100;
 * const eurPrice = convertBrlToEur(brlPrice); // 30.00
 * const display = formatDualPrice(brlPrice); // "€30,00 (R$ 100,00)"
 * ```
 * 
 * Using the convenience object:
 * ```typescript
 * import { price } from '@/lib/utils/price';
 * 
 * const productDisplay = price.display(100, true, 120);
 * // { dual: "€30,00 (R$ 100,00)", eur: "€30,00", brl: "R$ 100,00", isOnSale: true, discountPercent: 16 }
 * ```
 * 
 * Complex pricing:
 * ```typescript
 * import { priceCalculation } from '@/lib/utils/price';
 * 
 * const bulkPrice = priceCalculation.calculateBulkPrice(50, 10, [
 *   { minQty: 5, discountPercent: 10 },
 *   { minQty: 10, discountPercent: 15 }
 * ]);
 * ```
 */