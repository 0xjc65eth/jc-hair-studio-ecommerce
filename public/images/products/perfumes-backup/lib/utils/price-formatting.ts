import {
  CURRENCY_SYMBOLS,
  LOCALE_SETTINGS,
  CURRENCY_FORMAT_OPTIONS,
  type Currency,
  type SupportedLocale,
} from './price-constants';
import { convertBrlToEur, validatePrice, roundPrice } from './price-conversion';

/**
 * Format price for display with proper currency symbol and locale formatting
 * @param price - Price to format
 * @param currency - Currency type ('BRL' | 'EUR')
 * @param locale - Locale for formatting (optional)
 * @returns Formatted price string
 * @example formatPrice(30, 'EUR') → "€30,00"
 * @example formatPrice(100, 'BRL') → "R$ 100,00"
 */
export function formatPrice(
  price: number, 
  currency: Currency, 
  locale?: SupportedLocale
): string {
  if (!validatePrice(price)) {
    return currency === 'BRL' ? 'R$ 0,00' : '€0,00';
  }

  const roundedPrice = roundPrice(price);
  
  // Choose appropriate locale based on currency if not specified
  let formatLocale: SupportedLocale;
  if (locale) {
    formatLocale = locale;
  } else {
    formatLocale = currency === 'BRL' ? LOCALE_SETTINGS.BRAZILIAN : LOCALE_SETTINGS.EUROPEAN;
  }

  try {
    const formatter = new Intl.NumberFormat(formatLocale, CURRENCY_FORMAT_OPTIONS[currency]);
    return formatter.format(roundedPrice);
  } catch (error) {
    // Fallback formatting if Intl fails
    console.warn('Price formatting failed, using fallback:', error);
    return formatPriceFallback(roundedPrice, currency);
  }
}

/**
 * Format dual currency display showing EUR as primary with BRL in parentheses
 * @param brlPrice - Original price in BRL
 * @param showBrlReference - Whether to show BRL price in parentheses (default: true)
 * @returns Formatted dual price string
 * @example formatDualPrice(100) → "€30,00 (R$ 100,00)"
 */
export function formatDualPrice(brlPrice: number, showBrlReference: boolean = true): string {
  if (!validatePrice(brlPrice)) {
    return showBrlReference ? '€0,00 (R$ 0,00)' : '€0,00';
  }

  const eurPrice = convertBrlToEur(brlPrice);
  const formattedEur = formatPrice(eurPrice, 'EUR');
  
  if (!showBrlReference) {
    return formattedEur;
  }

  const formattedBrl = formatPrice(brlPrice, 'BRL');
  return `${formattedEur} (${formattedBrl})`;
}

/**
 * Format price range display
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @param currency - Currency type
 * @param locale - Locale for formatting (optional)
 * @returns Formatted price range string
 * @example formatPriceRange(20, 50, 'EUR') → "€20,00 - €50,00"
 */
export function formatPriceRange(
  minPrice: number,
  maxPrice: number,
  currency: Currency,
  locale?: SupportedLocale
): string {
  if (!validatePrice(minPrice) || !validatePrice(maxPrice)) {
    return currency === 'BRL' ? 'R$ 0,00' : '€0,00';
  }

  const formattedMin = formatPrice(minPrice, currency, locale);
  const formattedMax = formatPrice(maxPrice, currency, locale);
  
  if (minPrice === maxPrice) {
    return formattedMin;
  }

  return `${formattedMin} - ${formattedMax}`;
}

/**
 * Format dual currency price range
 * @param minBrlPrice - Minimum price in BRL
 * @param maxBrlPrice - Maximum price in BRL
 * @returns Formatted dual currency price range
 * @example formatDualPriceRange(100, 200) → "€30,00 - €60,00 (R$ 100,00 - R$ 200,00)"
 */
export function formatDualPriceRange(minBrlPrice: number, maxBrlPrice: number): string {
  if (!validatePrice(minBrlPrice) || !validatePrice(maxBrlPrice)) {
    return '€0,00 (R$ 0,00)';
  }

  const minEurPrice = convertBrlToEur(minBrlPrice);
  const maxEurPrice = convertBrlToEur(maxBrlPrice);
  
  const eurRange = formatPriceRange(minEurPrice, maxEurPrice, 'EUR');
  const brlRange = formatPriceRange(minBrlPrice, maxBrlPrice, 'BRL');
  
  return `${eurRange} (${brlRange})`;
}

/**
 * Format discount display
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @param currency - Currency type
 * @param showPercentage - Whether to show discount percentage (default: true)
 * @param locale - Locale for formatting (optional)
 * @returns Formatted discount string
 * @example formatDiscount(100, 80, 'EUR', true) → "€80,00 (was €100,00, 20% off)"
 */
export function formatDiscount(
  originalPrice: number,
  discountedPrice: number,
  currency: Currency,
  showPercentage: boolean = true,
  locale?: SupportedLocale
): string {
  if (!validatePrice(originalPrice) || !validatePrice(discountedPrice)) {
    return formatPrice(0, currency, locale);
  }

  const formattedOriginal = formatPrice(originalPrice, currency, locale);
  const formattedDiscounted = formatPrice(discountedPrice, currency, locale);

  if (originalPrice <= discountedPrice) {
    return formattedDiscounted;
  }

  if (!showPercentage) {
    return `${formattedDiscounted} (was ${formattedOriginal})`;
  }

  const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  return `${formattedDiscounted} (was ${formattedOriginal}, ${discountPercentage}% off)`;
}

/**
 * Format savings amount
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @param currency - Currency type
 * @param locale - Locale for formatting (optional)
 * @returns Formatted savings string
 * @example formatSavings(100, 80, 'EUR') → "Save €20,00"
 */
export function formatSavings(
  originalPrice: number,
  discountedPrice: number,
  currency: Currency,
  locale?: SupportedLocale
): string {
  if (!validatePrice(originalPrice) || !validatePrice(discountedPrice) || discountedPrice >= originalPrice) {
    return '';
  }

  const savings = originalPrice - discountedPrice;
  const formattedSavings = formatPrice(savings, currency, locale);
  
  return `Save ${formattedSavings}`;
}

/**
 * Format compact price (shorter format for mobile/small spaces)
 * @param price - Price to format
 * @param currency - Currency type
 * @returns Compact formatted price
 * @example formatCompactPrice(1500, 'EUR') → "€1.5K"
 */
export function formatCompactPrice(price: number, currency: Currency): string {
  if (!validatePrice(price)) {
    return currency === 'BRL' ? 'R$0' : '€0';
  }

  const symbol = CURRENCY_SYMBOLS[currency];
  
  if (price >= 1000000) {
    return `${symbol}${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `${symbol}${(price / 1000).toFixed(1)}K`;
  } else {
    return `${symbol}${price.toFixed(0)}`;
  }
}

/**
 * Parse price string to number
 * @param priceString - Price string to parse
 * @returns Parsed price number or null if invalid
 * @example parsePrice("€30,00") → 30.00
 * @example parsePrice("R$ 100,00") → 100.00
 */
export function parsePrice(priceString: string): number | null {
  if (!priceString || typeof priceString !== 'string') {
    return null;
  }

  // Remove currency symbols and normalize
  const cleanString = priceString
    .replace(/[€R$\s]/g, '') // Remove currency symbols and spaces
    .replace(/\./g, '') // Remove thousands separators (dots)
    .replace(/,(\d{2})$/, '.$1'); // Replace comma with dot for decimals

  const parsed = parseFloat(cleanString);
  
  if (isNaN(parsed) || !isFinite(parsed)) {
    return null;
  }

  return validatePrice(parsed) ? parsed : null;
}

/**
 * Fallback price formatting when Intl.NumberFormat fails
 * @param price - Price to format
 * @param currency - Currency type
 * @returns Formatted price string
 */
function formatPriceFallback(price: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const rounded = roundPrice(price);
  
  // Format with comma as decimal separator and dot as thousands separator
  const parts = rounded.toFixed(2).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decimalPart = parts[1];
  
  if (currency === 'BRL') {
    return `${symbol} ${integerPart},${decimalPart}`;
  } else {
    return `${symbol}${integerPart},${decimalPart}`;
  }
}

/**
 * Format price without currency symbol (numbers only)
 * @param price - Price to format
 * @param locale - Locale for number formatting
 * @returns Formatted number string
 */
export function formatPriceNumber(price: number, locale: SupportedLocale = LOCALE_SETTINGS.EUROPEAN): string {
  if (!validatePrice(price)) {
    return '0,00';
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(roundPrice(price));
  } catch (error) {
    // Fallback
    const rounded = roundPrice(price);
    return rounded.toFixed(2).replace('.', ',');
  }
}