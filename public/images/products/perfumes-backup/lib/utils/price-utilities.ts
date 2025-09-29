import { 
  convertBrlToEur, 
  validatePrice, 
  calculateDiscount, 
  applyDiscount,
  roundPrice 
} from './price-conversion';
import { 
  formatPrice, 
  formatDualPrice,
  parsePrice 
} from './price-formatting';
import { 
  EXCHANGE_RATES,
  PRICE_VALIDATION,
  type Currency 
} from './price-constants';

/**
 * Price comparison utilities
 */
export const priceComparison = {
  /**
   * Check if a price is on sale (has discount)
   * @param originalPrice - Original price
   * @param currentPrice - Current price
   * @returns True if price is discounted
   */
  isOnSale: (originalPrice: number, currentPrice: number): boolean => {
    return validatePrice(originalPrice) && 
           validatePrice(currentPrice) && 
           currentPrice < originalPrice;
  },

  /**
   * Check if price is within a budget range
   * @param price - Price to check
   * @param minBudget - Minimum budget
   * @param maxBudget - Maximum budget
   * @returns True if price is within budget
   */
  isWithinBudget: (price: number, minBudget: number, maxBudget: number): boolean => {
    return validatePrice(price) && 
           validatePrice(minBudget) && 
           validatePrice(maxBudget) &&
           price >= minBudget && 
           price <= maxBudget;
  },

  /**
   * Get the best deal from a list of prices
   * @param prices - Array of prices
   * @returns Lowest valid price
   */
  getBestDeal: (prices: number[]): number | null => {
    const validPrices = prices.filter(validatePrice);
    return validPrices.length > 0 ? Math.min(...validPrices) : null;
  },

  /**
   * Compare two products by price efficiency (price per unit)
   * @param price1 - First product price
   * @param unit1 - First product units (e.g., grams, pieces)
   * @param price2 - Second product price
   * @param unit2 - Second product units
   * @returns Comparison result (-1: first is better, 1: second is better, 0: equal)
   */
  compareValueForMoney: (price1: number, unit1: number, price2: number, unit2: number): number => {
    if (!validatePrice(price1) || !validatePrice(price2) || unit1 <= 0 || unit2 <= 0) {
      return 0;
    }

    const efficiency1 = price1 / unit1;
    const efficiency2 = price2 / unit2;

    if (efficiency1 < efficiency2) return -1;
    if (efficiency1 > efficiency2) return 1;
    return 0;
  },
};

/**
 * Price calculation utilities for complex scenarios
 */
export const priceCalculation = {
  /**
   * Calculate bulk discount based on quantity
   * @param unitPrice - Price per unit
   * @param quantity - Number of units
   * @param bulkRules - Bulk discount rules [{minQty, discountPercent}]
   * @returns Total price with bulk discount applied
   */
  calculateBulkPrice: (
    unitPrice: number, 
    quantity: number,
    bulkRules: Array<{minQty: number; discountPercent: number}>
  ): number => {
    if (!validatePrice(unitPrice) || quantity <= 0) {
      return 0;
    }

    // Find applicable bulk discount
    const applicableRule = bulkRules
      .filter(rule => quantity >= rule.minQty)
      .sort((a, b) => b.discountPercent - a.discountPercent)[0];

    const baseTotal = unitPrice * quantity;
    
    if (!applicableRule) {
      return roundPrice(baseTotal);
    }

    return applyDiscount(baseTotal, applicableRule.discountPercent);
  },

  /**
   * Calculate tiered pricing
   * @param quantity - Number of units
   * @param tiers - Pricing tiers [{maxQty, pricePerUnit}]
   * @returns Total price based on tiered structure
   */
  calculateTieredPrice: (
    quantity: number,
    tiers: Array<{maxQty: number; pricePerUnit: number}>
  ): number => {
    if (quantity <= 0 || tiers.length === 0) {
      return 0;
    }

    let total = 0;
    let remainingQty = quantity;

    // Sort tiers by maxQty
    const sortedTiers = tiers.sort((a, b) => a.maxQty - b.maxQty);

    for (const tier of sortedTiers) {
      if (remainingQty <= 0) break;
      
      const qtyForThisTier = Math.min(remainingQty, tier.maxQty);
      total += qtyForThisTier * tier.pricePerUnit;
      remainingQty -= qtyForThisTier;
    }

    // Handle remaining quantity with the highest tier price
    if (remainingQty > 0 && sortedTiers.length > 0) {
      const lastTier = sortedTiers[sortedTiers.length - 1];
      total += remainingQty * lastTier.pricePerUnit;
    }

    return roundPrice(total);
  },

  /**
   * Calculate shipping costs based on order value and weight
   * @param orderValue - Total order value
   * @param weight - Total weight in kg
   * @param shippingRules - Shipping cost rules
   * @returns Shipping cost
   */
  calculateShipping: (
    orderValue: number,
    weight: number,
    shippingRules: {
      freeShippingThreshold?: number;
      baseRate: number;
      weightRate: number;
      maxWeight?: number;
    }
  ): number => {
    if (!validatePrice(orderValue) || weight <= 0) {
      return shippingRules.baseRate;
    }

    // Free shipping threshold
    if (shippingRules.freeShippingThreshold && orderValue >= shippingRules.freeShippingThreshold) {
      return 0;
    }

    // Calculate weight-based shipping
    const effectiveWeight = shippingRules.maxWeight 
      ? Math.min(weight, shippingRules.maxWeight) 
      : weight;

    const shippingCost = shippingRules.baseRate + (effectiveWeight * shippingRules.weightRate);

    return roundPrice(Math.max(shippingCost, 0));
  },

  /**
   * Calculate tax amount
   * @param price - Base price
   * @param taxRate - Tax rate (0-1, e.g., 0.23 for 23%)
   * @returns Tax amount
   */
  calculateTax: (price: number, taxRate: number): number => {
    if (!validatePrice(price) || taxRate < 0 || taxRate > 1) {
      return 0;
    }

    return roundPrice(price * taxRate);
  },

  /**
   * Calculate price including tax
   * @param price - Base price
   * @param taxRate - Tax rate (0-1)
   * @returns Price including tax
   */
  calculatePriceWithTax: (price: number, taxRate: number): number => {
    if (!validatePrice(price) || taxRate < 0) {
      return price;
    }

    return roundPrice(price * (1 + taxRate));
  },
};

/**
 * Currency conversion utilities
 */
export const currencyUtils = {
  /**
   * Get current exchange rate information
   * @returns Exchange rate data
   */
  getExchangeRateInfo: () => ({
    brlToEurBase: EXCHANGE_RATES.BRL_TO_EUR_BASE,
    profitMargin: EXCHANGE_RATES.PROFIT_MARGIN,
    effectiveRate: EXCHANGE_RATES.BRL_TO_EUR_BASE * EXCHANGE_RATES.PROFIT_MARGIN,
  }),

  /**
   * Convert multiple prices at once
   * @param brlPrices - Array of BRL prices
   * @returns Array of EUR prices
   */
  convertPricesBatch: (brlPrices: number[]): number[] => {
    return brlPrices.map(price => {
      try {
        return convertBrlToEur(price);
      } catch (error) {
        console.warn('Failed to convert price:', price, error);
        return 0;
      }
    });
  },

  /**
   * Format prices for API response
   * @param brlPrice - Price in BRL
   * @returns Object with both currencies formatted
   */
  formatForApi: (brlPrice: number) => {
    if (!validatePrice(brlPrice)) {
      return {
        brl: { value: 0, formatted: 'R$ 0,00' },
        eur: { value: 0, formatted: '€0,00' },
        dual: '€0,00 (R$ 0,00)',
      };
    }

    const eurPrice = convertBrlToEur(brlPrice);
    
    return {
      brl: {
        value: roundPrice(brlPrice),
        formatted: formatPrice(brlPrice, 'BRL'),
      },
      eur: {
        value: roundPrice(eurPrice),
        formatted: formatPrice(eurPrice, 'EUR'),
      },
      dual: formatDualPrice(brlPrice),
    };
  },
};

/**
 * Price input/output utilities
 */
export const priceIO = {
  /**
   * Sanitize price input from user
   * @param input - Raw price input
   * @returns Sanitized price number or null
   */
  sanitizePriceInput: (input: string | number): number | null => {
    if (typeof input === 'number') {
      return validatePrice(input) ? roundPrice(input) : null;
    }

    if (typeof input === 'string') {
      const parsed = parsePrice(input);
      return parsed !== null && validatePrice(parsed) ? roundPrice(parsed) : null;
    }

    return null;
  },

  /**
   * Generate price suggestions based on a base price
   * @param basePrice - Base price in BRL
   * @param variations - Array of variation percentages (e.g., [-10, 0, 15, 25])
   * @returns Array of suggested prices with labels
   */
  generatePriceSuggestions: (
    basePrice: number, 
    variations: number[] = [-20, -10, 0, 10, 20]
  ) => {
    if (!validatePrice(basePrice)) {
      return [];
    }

    return variations.map(variation => {
      const adjustedBrlPrice = applyDiscount(basePrice, -variation); // Negative discount = increase
      const eurPrice = convertBrlToEur(adjustedBrlPrice);
      
      return {
        variation,
        brl: roundPrice(adjustedBrlPrice),
        eur: roundPrice(eurPrice),
        label: variation === 0 ? 'Base Price' : 
               variation > 0 ? `+${variation}%` : `${variation}%`,
        formattedDual: formatDualPrice(adjustedBrlPrice),
      };
    });
  },

  /**
   * Validate price range input
   * @param minPrice - Minimum price
   * @param maxPrice - Maximum price
   * @returns Validation result with errors
   */
  validatePriceRange: (minPrice: number, maxPrice: number) => {
    const errors: string[] = [];
    
    if (!validatePrice(minPrice)) {
      errors.push('Invalid minimum price');
    }
    
    if (!validatePrice(maxPrice)) {
      errors.push('Invalid maximum price');
    }
    
    if (validatePrice(minPrice) && validatePrice(maxPrice) && minPrice > maxPrice) {
      errors.push('Minimum price cannot be greater than maximum price');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized: {
        min: validatePrice(minPrice) ? roundPrice(minPrice) : PRICE_VALIDATION.MIN_PRICE,
        max: validatePrice(maxPrice) ? roundPrice(maxPrice) : PRICE_VALIDATION.MIN_PRICE,
      },
    };
  },
};

/**
 * Export all utility collections
 */
export {
  priceComparison as comparison,
  priceCalculation as calculation,
  currencyUtils as currency,
  priceIO as io,
};