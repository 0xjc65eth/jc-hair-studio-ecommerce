/**
 * Price Utility Examples and Testing
 * 
 * This file demonstrates the usage of the price utilities
 * and serves as a reference for implementation throughout the site.
 */

import {
  convertBrlToEur,
  formatPrice,
  formatDualPrice,
  formatPriceRange,
  formatDualPriceRange,
  calculateDiscount,
  validatePrice,
  price,
  priceCalculation,
  currencyUtils,
} from './price';

/**
 * Basic Conversion Examples
 */
export const basicExamples = () => {
  console.log('=== Basic Price Conversion Examples ===');
  
  // Basic conversion: R$ 100 → €30.00
  const brlPrice = 100;
  const eurPrice = convertBrlToEur(brlPrice);
  console.log(`R$ ${brlPrice} converts to €${eurPrice}`); // €30.00
  
  // Formatting examples
  console.log('EUR formatting:', formatPrice(eurPrice, 'EUR')); // €30,00
  console.log('BRL formatting:', formatPrice(brlPrice, 'BRL')); // R$ 100,00
  console.log('Dual formatting:', formatDualPrice(brlPrice)); // €30,00 (R$ 100,00)
  
  // Using the convenience object
  const display = price.display(brlPrice);
  console.log('Price display object:', display);
  /*
  {
    dual: "€30,00 (R$ 100,00)",
    eur: "€30,00",
    brl: "R$ 100,00",
    isOnSale: false,
    discountPercent: 0
  }
  */
};

/**
 * Price Range Examples
 */
export const priceRangeExamples = () => {
  console.log('\n=== Price Range Examples ===');
  
  const minBrl = 50;
  const maxBrl = 200;
  
  console.log('EUR range:', formatPriceRange(
    convertBrlToEur(minBrl), 
    convertBrlToEur(maxBrl), 
    'EUR'
  )); // €15,00 - €60,00
  
  console.log('BRL range:', formatPriceRange(minBrl, maxBrl, 'BRL')); // R$ 50,00 - R$ 200,00
  console.log('Dual range:', formatDualPriceRange(minBrl, maxBrl)); // €15,00 - €60,00 (R$ 50,00 - R$ 200,00)
};

/**
 * Discount Examples
 */
export const discountExamples = () => {
  console.log('\n=== Discount Calculation Examples ===');
  
  const originalPrice = 120;
  const salePrice = 100;
  const discount = calculateDiscount(originalPrice, salePrice);
  
  console.log(`Original: R$ ${originalPrice}, Sale: R$ ${salePrice}`);
  console.log(`Discount: ${discount}%`); // 16%
  
  // Display with discount
  const discountDisplay = price.display(salePrice, true, originalPrice);
  console.log('Sale display:', discountDisplay);
  /*
  {
    dual: "€30,00 (R$ 100,00)",
    eur: "€30,00",
    brl: "R$ 100,00",
    isOnSale: true,
    discountPercent: 16
  }
  */
};

/**
 * Bulk Pricing Examples
 */
export const bulkPricingExamples = () => {
  console.log('\n=== Bulk Pricing Examples ===');
  
  const unitPrice = 50; // R$ 50 per unit
  const quantity = 12;
  
  const bulkRules = [
    { minQty: 5, discountPercent: 10 },   // 10% off for 5+ units
    { minQty: 10, discountPercent: 15 },  // 15% off for 10+ units
    { minQty: 20, discountPercent: 20 },  // 20% off for 20+ units
  ];
  
  const bulkTotal = priceCalculation.calculateBulkPrice(unitPrice, quantity, bulkRules);
  
  console.log(`Unit price: R$ ${unitPrice}`);
  console.log(`Quantity: ${quantity}`);
  console.log(`Regular total: R$ ${unitPrice * quantity}`); // R$ 600
  console.log(`Bulk total: R$ ${bulkTotal}`); // R$ 510 (15% discount applied)
  console.log(`Bulk total in EUR: ${formatDualPrice(bulkTotal)}`); // €153,00 (R$ 510,00)
};

/**
 * Currency Utility Examples
 */
export const currencyUtilityExamples = () => {
  console.log('\n=== Currency Utility Examples ===');
  
  // Get exchange rate info
  const rateInfo = currencyUtils.getExchangeRateInfo();
  console.log('Exchange rate info:', rateInfo);
  /*
  {
    brlToEurBase: 0.2,
    profitMargin: 1.5,
    effectiveRate: 0.3
  }
  */
  
  // Batch conversion
  const brlPrices = [50, 100, 150, 200];
  const eurPrices = currencyUtils.convertPricesBatch(brlPrices);
  console.log('Batch conversion:', brlPrices, '→', eurPrices); // [15, 30, 45, 60]
  
  // API formatting
  const apiFormat = currencyUtils.formatForApi(100);
  console.log('API format:', apiFormat);
  /*
  {
    brl: { value: 100, formatted: "R$ 100,00" },
    eur: { value: 30, formatted: "€30,00" },
    dual: "€30,00 (R$ 100,00)"
  }
  */
};

/**
 * Validation Examples
 */
export const validationExamples = () => {
  console.log('\n=== Price Validation Examples ===');
  
  const validPrices = [10.50, 100, 999.99];
  const invalidPrices = [-5, 0, NaN, Infinity, 1000000];
  
  console.log('Valid prices:');
  validPrices.forEach(price => {
    console.log(`  ${price}: ${validatePrice(price) ? '✓' : '✗'}`);
  });
  
  console.log('Invalid prices:');
  invalidPrices.forEach(price => {
    console.log(`  ${price}: ${validatePrice(price) ? '✓' : '✗'}`);
  });
};

/**
 * Real-world Usage Examples for Common Scenarios
 */
export const realWorldExamples = () => {
  console.log('\n=== Real-world Usage Examples ===');
  
  // Product pricing scenario
  const productPriceBrl = 89.90;
  const originalPriceBrl = 119.90;
  
  console.log('=== Hair Extension Product ===');
  console.log('Original price:', formatDualPrice(originalPriceBrl));
  console.log('Sale price:', formatDualPrice(productPriceBrl));
  console.log('Discount:', calculateDiscount(originalPriceBrl, productPriceBrl) + '%');
  
  // Shopping cart scenario
  console.log('\n=== Shopping Cart ===');
  const cartItems = [
    { name: 'Premium Extensions', priceBrl: 150, quantity: 2 },
    { name: 'Hair Serum', priceBrl: 45, quantity: 1 },
    { name: 'Styling Brush', priceBrl: 35, quantity: 1 },
  ];
  
  let cartTotal = 0;
  cartItems.forEach(item => {
    const lineTotal = item.priceBrl * item.quantity;
    cartTotal += lineTotal;
    console.log(`${item.name}: ${formatDualPrice(lineTotal)} (${item.quantity}x ${formatDualPrice(item.priceBrl)})`);
  });
  
  console.log(`Cart Total: ${formatDualPrice(cartTotal)}`);
  
  // Professional discount scenario
  const professionalDiscount = 15; // 15% professional discount
  const professionalTotal = priceCalculation.calculateBulkPrice(cartTotal, 1, [
    { minQty: 1, discountPercent: professionalDiscount }
  ]);
  
  console.log(`Professional Price (${professionalDiscount}% off): ${formatDualPrice(professionalTotal)}`);
  console.log(`You save: ${formatDualPrice(cartTotal - professionalTotal)}`);
};

/**
 * Run all examples
 */
export const runAllExamples = () => {
  basicExamples();
  priceRangeExamples();
  discountExamples();
  bulkPricingExamples();
  currencyUtilityExamples();
  validationExamples();
  realWorldExamples();
};

// Export for testing in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).priceExamples = {
    basicExamples,
    priceRangeExamples,
    discountExamples,
    bulkPricingExamples,
    currencyUtilityExamples,
    validationExamples,
    realWorldExamples,
    runAllExamples,
  };
}

/**
 * Usage in Components:
 * 
 * ```tsx
 * import { price, formatDualPrice } from '@/lib/utils/price';
 * 
 * function ProductCard({ priceBrl, originalPriceBrl }: { priceBrl: number; originalPriceBrl?: number }) {
 *   const priceDisplay = price.display(priceBrl, !!originalPriceBrl, originalPriceBrl);
 *   
 *   return (
 *     <div className="product-card">
 *       <div className="price">
 *         <span className="current-price">{priceDisplay.dual}</span>
 *         {priceDisplay.isOnSale && (
 *           <span className="discount">-{priceDisplay.discountPercent}%</span>
 *         )}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 * 
 * ```tsx
 * import { priceCalculation, formatDualPrice } from '@/lib/utils/price';
 * 
 * function ShoppingCart({ items }: { items: CartItem[] }) {
 *   const total = items.reduce((sum, item) => sum + (item.priceBrl * item.quantity), 0);
 *   const bulkTotal = priceCalculation.calculateBulkPrice(total, 1, bulkDiscountRules);
 *   
 *   return (
 *     <div className="cart-total">
 *       <div>Subtotal: {formatDualPrice(total)}</div>
 *       {bulkTotal < total && (
 *         <div>Discount Applied: {formatDualPrice(bulkTotal)}</div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */