import {
  EXCHANGE_RATES,
  PRICE_VALIDATION,
  DISCOUNT_CONSTANTS,
  type Currency,
} from './price-constants';

/**
 * Convert BRL to EUR with profit margin
 * Formula: BRL × 0.20 × 1.5 = EUR
 * @param brlPrice - Price in Brazilian Reais
 * @returns Price in Euros with profit margin applied
 * @example convertBrlToEur(100) → 30.00
 */
export function convertBrlToEur(brlPrice: number): number {
  if (!validatePrice(brlPrice)) {
    throw new Error(`Invalid BRL price: ${brlPrice}`);
  }

  const eurPrice = brlPrice * EXCHANGE_RATES.BRL_TO_EUR_BASE * EXCHANGE_RATES.PROFIT_MARGIN;
  
  // Round to 2 decimal places
  return Math.round(eurPrice * 100) / 100;
}

/**
 * Convert EUR back to BRL (reverse calculation)
 * Formula: EUR ÷ 1.5 ÷ 0.20 = BRL
 * @param eurPrice - Price in Euros
 * @returns Price in Brazilian Reais
 * @example convertEurToBrl(30) → 100.00
 */
export function convertEurToBrl(eurPrice: number): number {
  if (!validatePrice(eurPrice)) {
    throw new Error(`Invalid EUR price: ${eurPrice}`);
  }

  const brlPrice = eurPrice / EXCHANGE_RATES.PROFIT_MARGIN / EXCHANGE_RATES.BRL_TO_EUR_BASE;
  
  // Round to 2 decimal places
  return Math.round(brlPrice * 100) / 100;
}

/**
 * Calculate the profit margin amount in EUR
 * @param brlPrice - Original price in BRL
 * @returns Profit margin amount in EUR
 */
export function calculateProfitMargin(brlPrice: number): number {
  if (!validatePrice(brlPrice)) {
    throw new Error(`Invalid BRL price: ${brlPrice}`);
  }

  const baseEurPrice = brlPrice * EXCHANGE_RATES.BRL_TO_EUR_BASE;
  const profitMargin = baseEurPrice * (EXCHANGE_RATES.PROFIT_MARGIN - 1);
  
  return Math.round(profitMargin * 100) / 100;
}

/**
 * Get the base EUR price without profit margin
 * @param brlPrice - Price in Brazilian Reais
 * @returns Base EUR price without profit margin
 */
export function getBaseEurPrice(brlPrice: number): number {
  if (!validatePrice(brlPrice)) {
    throw new Error(`Invalid BRL price: ${brlPrice}`);
  }

  const baseEurPrice = brlPrice * EXCHANGE_RATES.BRL_TO_EUR_BASE;
  
  return Math.round(baseEurPrice * 100) / 100;
}

/**
 * Calculate discount percentage between two prices
 * @param originalPrice - Original price
 * @param salePrice - Sale price
 * @returns Discount percentage (0-100)
 * @example calculateDiscount(100, 80) → 20
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (!validatePrice(originalPrice) || !validatePrice(salePrice)) {
    throw new Error('Invalid price values for discount calculation');
  }

  if (originalPrice <= 0 || salePrice < 0) {
    return 0;
  }

  if (salePrice >= originalPrice) {
    return 0;
  }

  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  
  // Ensure discount is within valid range
  return Math.min(Math.max(discount, DISCOUNT_CONSTANTS.MIN_DISCOUNT_PERCENTAGE), DISCOUNT_CONSTANTS.MAX_DISCOUNT_PERCENTAGE);
}

/**
 * Apply discount to a price
 * @param price - Original price
 * @param discountPercentage - Discount percentage (0-100)
 * @returns Price after discount
 */
export function applyDiscount(price: number, discountPercentage: number): number {
  if (!validatePrice(price)) {
    throw new Error(`Invalid price: ${price}`);
  }

  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error(`Invalid discount percentage: ${discountPercentage}`);
  }

  const discountedPrice = price * (1 - discountPercentage / 100);
  
  return Math.round(discountedPrice * 100) / 100;
}

/**
 * Validate if a price is valid
 * @param price - Price to validate
 * @returns True if price is valid
 */
export function validatePrice(price: number): boolean {
  if (typeof price !== 'number' || isNaN(price) || !isFinite(price)) {
    return false;
  }

  if (price < PRICE_VALIDATION.MIN_PRICE || price > PRICE_VALIDATION.MAX_PRICE) {
    return false;
  }

  // Check if price has more than allowed decimal places
  const decimalPlaces = (price.toString().split('.')[1] || '').length;
  if (decimalPlaces > PRICE_VALIDATION.DECIMAL_PLACES) {
    return false;
  }

  return true;
}

/**
 * Round price to valid currency format (2 decimal places)
 * @param price - Price to round
 * @returns Rounded price
 */
export function roundPrice(price: number): number {
  if (!isFinite(price) || isNaN(price)) {
    return 0;
  }

  return Math.round(price * 100) / 100;
}

/**
 * Compare two prices with tolerance for floating point precision
 * @param price1 - First price
 * @param price2 - Second price
 * @param tolerance - Tolerance for comparison (default: 0.001)
 * @returns True if prices are equal within tolerance
 */
export function comparePrices(price1: number, price2: number, tolerance: number = 0.001): boolean {
  return Math.abs(price1 - price2) < tolerance;
}

/**
 * Get the higher of two prices
 * @param price1 - First price
 * @param price2 - Second price
 * @returns Higher price
 */
export function getHigherPrice(price1: number, price2: number): number {
  if (!validatePrice(price1) || !validatePrice(price2)) {
    throw new Error('Invalid price values for comparison');
  }
  
  return Math.max(price1, price2);
}

/**
 * Get the lower of two prices
 * @param price1 - First price
 * @param price2 - Second price
 * @returns Lower price
 */
export function getLowerPrice(price1: number, price2: number): number {
  if (!validatePrice(price1) || !validatePrice(price2)) {
    throw new Error('Invalid price values for comparison');
  }
  
  return Math.min(price1, price2);
}