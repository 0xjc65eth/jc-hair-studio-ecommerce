/**
 * Price Calculator Utility for JC Hair Studio
 *
 * Handles conversion from BRL to EUR with proper markup
 * Formula: BRL * 0.158 * 1.5 (conversion rate + 50% markup)
 */

export interface PriceConfig {
  conversionRate: number;
  markupMultiplier: number;
  vatRate?: number;
}

export interface PriceBreakdown {
  originalBRL: number;
  baseEUR: number;
  finalEUR: number;
  markup: number;
  vat?: number;
  savings?: number;
}

/**
 * Default price configuration
 */
export const DEFAULT_PRICE_CONFIG: PriceConfig = {
  conversionRate: 0.158, // BRL to EUR conversion rate
  markupMultiplier: 1.5,  // 50% markup for European market
  vatRate: 0.21           // 21% VAT (varies by European country)
};

/**
 * Calculate EUR price from BRL with markup
 */
export function calculateEURPrice(
  priceBRL: number,
  config: Partial<PriceConfig> = {}
): number {
  const { conversionRate, markupMultiplier } = {
    ...DEFAULT_PRICE_CONFIG,
    ...config
  };

  if (priceBRL <= 0) {
    throw new Error('Price must be greater than 0');
  }

  const baseEUR = priceBRL * conversionRate;
  const finalEUR = baseEUR * markupMultiplier;

  return Number(finalEUR.toFixed(2));
}

/**
 * Calculate detailed price breakdown
 */
export function calculatePriceBreakdown(
  priceBRL: number,
  comparePriceBRL?: number,
  config: Partial<PriceConfig> = {}
): PriceBreakdown {
  const { conversionRate, markupMultiplier, vatRate } = {
    ...DEFAULT_PRICE_CONFIG,
    ...config
  };

  const baseEUR = priceBRL * conversionRate;
  const finalEUR = baseEUR * markupMultiplier;
  const markup = finalEUR - baseEUR;

  const breakdown: PriceBreakdown = {
    originalBRL: priceBRL,
    baseEUR: Number(baseEUR.toFixed(2)),
    finalEUR: Number(finalEUR.toFixed(2)),
    markup: Number(markup.toFixed(2))
  };

  // Add VAT calculation if rate provided
  if (vatRate) {
    breakdown.vat = Number((finalEUR * vatRate).toFixed(2));
  }

  // Calculate savings if compare price provided
  if (comparePriceBRL) {
    const compareFinalEUR = comparePriceBRL * conversionRate * markupMultiplier;
    breakdown.savings = Number((compareFinalEUR - finalEUR).toFixed(2));
  }

  return breakdown;
}

/**
 * Batch calculate prices for multiple products
 */
export function batchCalculateEURPrices(
  products: Array<{ id: string; price_brl: number }>,
  config: Partial<PriceConfig> = {}
): Array<{ id: string; price_brl: number; price_eur: number }> {
  return products.map(product => ({
    ...product,
    price_eur: calculateEURPrice(product.price_brl, config)
  }));
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: 'BRL' | 'EUR' = 'EUR'): string {
  const symbols = {
    BRL: 'R$',
    EUR: '€'
  };

  const locales = {
    BRL: 'pt-BR',
    EUR: 'de-DE' // German locale for EUR formatting
  };

  return new Intl.NumberFormat(locales[currency], {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

/**
 * Calculate volume discounts
 */
export function calculateVolumeDiscount(
  basePrice: number,
  quantity: number,
  discountTiers: Array<{ minQuantity: number; discount: number }> = [
    { minQuantity: 3, discount: 0.05 },  // 5% off for 3+
    { minQuantity: 5, discount: 0.10 },  // 10% off for 5+
    { minQuantity: 10, discount: 0.15 }  // 15% off for 10+
  ]
): { finalPrice: number; discount: number; savings: number } {
  let applicableDiscount = 0;

  // Find the highest applicable discount
  for (const tier of discountTiers) {
    if (quantity >= tier.minQuantity) {
      applicableDiscount = Math.max(applicableDiscount, tier.discount);
    }
  }

  const discountAmount = basePrice * applicableDiscount;
  const finalPrice = basePrice - discountAmount;
  const totalSavings = discountAmount * quantity;

  return {
    finalPrice: Number(finalPrice.toFixed(2)),
    discount: applicableDiscount,
    savings: Number(totalSavings.toFixed(2))
  };
}

/**
 * Price comparison utility
 */
export function comparePrices(
  currentPrice: number,
  competitorPrices: number[]
): {
  isCompetitive: boolean;
  ranking: number;
  averageCompetitorPrice: number;
  priceAdvantage?: number;
} {
  const avgCompetitorPrice = competitorPrices.reduce((sum, price) => sum + price, 0) / competitorPrices.length;
  const allPrices = [...competitorPrices, currentPrice].sort((a, b) => a - b);
  const ranking = allPrices.indexOf(currentPrice) + 1;

  return {
    isCompetitive: currentPrice <= avgCompetitorPrice,
    ranking,
    averageCompetitorPrice: Number(avgCompetitorPrice.toFixed(2)),
    priceAdvantage: currentPrice < avgCompetitorPrice
      ? Number((avgCompetitorPrice - currentPrice).toFixed(2))
      : undefined
  };
}

/**
 * Shipping cost calculator
 */
export function calculateShippingCost(
  orderValue: number,
  weight: number,
  country: string = 'DE'
): {
  cost: number;
  isFree: boolean;
  freeShippingThreshold?: number;
} {
  const FREE_SHIPPING_THRESHOLD = 50; // €50 for free shipping
  const BASE_SHIPPING_COST = 8.90;
  const WEIGHT_MULTIPLIER = 0.02; // €0.02 per gram

  if (orderValue >= FREE_SHIPPING_THRESHOLD) {
    return {
      cost: 0,
      isFree: true,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD
    };
  }

  const weightCost = weight * WEIGHT_MULTIPLIER;
  const totalCost = BASE_SHIPPING_COST + weightCost;

  return {
    cost: Number(totalCost.toFixed(2)),
    isFree: false,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD
  };
}

/**
 * Tax calculator for different European countries
 */
export function calculateTax(price: number, country: string): {
  taxRate: number;
  taxAmount: number;
  priceWithTax: number;
} {
  const TAX_RATES: { [country: string]: number } = {
    'DE': 0.19,  // Germany
    'FR': 0.20,  // France
    'ES': 0.21,  // Spain
    'IT': 0.22,  // Italy
    'NL': 0.21,  // Netherlands
    'PT': 0.23,  // Portugal
    'AT': 0.20,  // Austria
    'BE': 0.21,  // Belgium
    'DK': 0.25,  // Denmark
    'SE': 0.25,  // Sweden
  };

  const taxRate = TAX_RATES[country] || 0.21; // Default to 21%
  const taxAmount = price * taxRate;
  const priceWithTax = price + taxAmount;

  return {
    taxRate,
    taxAmount: Number(taxAmount.toFixed(2)),
    priceWithTax: Number(priceWithTax.toFixed(2))
  };
}

/**
 * Currency conversion utility (for real-time rates)
 */
export async function getLatestExchangeRate(): Promise<number> {
  try {
    // In production, this would call a real exchange rate API
    // For now, return the default rate
    return DEFAULT_PRICE_CONFIG.conversionRate;
  } catch (error) {
    console.warn('Failed to fetch latest exchange rate, using default:', error);
    return DEFAULT_PRICE_CONFIG.conversionRate;
  }
}

/**
 * Validate price data
 */
export function validatePriceData(prices: {
  price_brl?: number;
  price_eur?: number;
  comparePrice_eur?: number;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (prices.price_brl !== undefined && prices.price_brl <= 0) {
    errors.push('BRL price must be greater than 0');
  }

  if (prices.price_eur !== undefined && prices.price_eur <= 0) {
    errors.push('EUR price must be greater than 0');
  }

  if (prices.comparePrice_eur !== undefined && prices.price_eur !== undefined) {
    if (prices.comparePrice_eur <= prices.price_eur) {
      errors.push('Compare price must be higher than regular price');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export default {
  calculateEURPrice,
  calculatePriceBreakdown,
  batchCalculateEURPrices,
  formatPrice,
  calculateVolumeDiscount,
  comparePrices,
  calculateShippingCost,
  calculateTax,
  getLatestExchangeRate,
  validatePriceData,
  DEFAULT_PRICE_CONFIG
};