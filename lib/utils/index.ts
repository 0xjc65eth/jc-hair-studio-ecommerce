/**
 * Utility functions index - Re-exports all utility modules
 */

// Performance utilities
export * from './performance';

// Price utilities - comprehensive pricing system
export * from './price';

// Export the main price utility object as default
export { default as price } from './price';

/**
 * Quick access to commonly used price functions
 */
export {
  convertBrlToEur,
  formatPrice,
  formatDualPrice,
  validatePrice,
  calculateDiscount,
} from './price';

/**
 * Legacy re-exports from main utils.ts for backward compatibility
 * These may be gradually migrated to use the new price utilities
 */
export {
  formatCurrency,
  formatPercentage,
  calculateDiscountPercentage,
  calculateProfessionalPrice,
} from '../utils';