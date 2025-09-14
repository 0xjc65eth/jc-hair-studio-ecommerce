/**
 * Price conversion constants for Brazilian beauty e-commerce site
 * Formula: BRL × 0.20 × 1.5 = EUR
 * - R$ 1.00 = €0.20 (base conversion)
 * - Add 50% profit margin (× 1.5)
 */

// Exchange rate constants
export const EXCHANGE_RATES = {
  BRL_TO_EUR_BASE: 0.20, // Base conversion rate: R$ 1.00 = €0.20
  PROFIT_MARGIN: 1.5, // 50% profit margin multiplier
} as const;

// Currency symbols and formatting
export const CURRENCY_SYMBOLS = {
  BRL: 'R$',
  EUR: '€',
} as const;

// Locale settings for number formatting
export const LOCALE_SETTINGS = {
  BRAZILIAN: 'pt-BR',
  PORTUGUESE: 'pt-PT',
  EUROPEAN: 'de-DE', // For EUR formatting with comma decimals
} as const;

// Number formatting options
export const CURRENCY_FORMAT_OPTIONS = {
  BRL: {
    style: 'currency' as const,
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  EUR: {
    style: 'currency' as const,
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
} as const;

// Price validation constants
export const PRICE_VALIDATION = {
  MIN_PRICE: 0.01, // Minimum valid price
  MAX_PRICE: 999999.99, // Maximum valid price
  DECIMAL_PLACES: 2, // Maximum decimal places for prices
} as const;

// Discount calculation constants
export const DISCOUNT_CONSTANTS = {
  MAX_DISCOUNT_PERCENTAGE: 90, // Maximum allowed discount percentage
  MIN_DISCOUNT_PERCENTAGE: 0, // Minimum discount percentage
} as const;

// Currency type definitions
export type Currency = 'BRL' | 'EUR';
export type SupportedLocale = 'pt-BR' | 'pt-PT' | 'de-DE';