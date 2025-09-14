/**
 * Sistema de Pricing Inteligente para Mega Hair - Exports
 *
 * Importação centralizada para facilitar o uso do sistema de pricing
 *
 * Exemplo de uso:
 * ```typescript
 * import {
 *   calculateMegaHairPrice,
 *   TechnicalComplexity,
 *   HairQuality
 * } from '@/lib/pricing';
 *
 * const result = calculateMegaHairPrice({
 *   basePrice: 400,
 *   weight: 100,
 *   length: 60,
 *   complexity: TechnicalComplexity.INTERMEDIATE,
 *   quality: HairQuality.VIRGIN,
 *   origin: HairOrigin.BRASILEIRO
 * });
 * ```
 */

// Tipos principais
export type {
  MegaHairPricingParams,
  PricingResult,
  PriceBreakdown,
  PricingConfig,
  MarketPriceReference,
  PricingStrategy,
  WeightPricingTier
} from '../../types/pricing';

export {
  TechnicalComplexity,
  HairQuality,
  HairOrigin,
  WEIGHT_TIERS
} from '../../types/pricing';

// Engine principal de pricing
export {
  MegaHairPricingEngine,
  megaHairPricing,
  calculateMegaHairPrice,
  getMarketBasedPrice,
  analyzePriceCompetitiveness
} from './megaHairPricing';

// Utilitários de pricing
export {
  getComplexityByColor,
  getQualityByDescription,
  getOriginByCountry,
  getRecommendedWeight,
  formatPricingResult,
  calculateVolumeDiscount,
  getSuggestedProducts,
  validatePricingParams,
  calculateROI,
  generatePriceAnalysisReport,
  type PriceAnalysisReport
} from './utils';

// Dados de mercado
export {
  MARKET_COMPETITORS,
  MARKET_PRICE_POINTS,
  MARKET_TRENDS,
  PRICE_SEGMENTS,
  COST_BENCHMARKS,
  getMarketAverage,
  getCompetitorAnalysis,
  getSeasonalityMultiplier,
  type MarketCompetitor,
  type PricePoint
} from './marketData';

// Funções auxiliares
export {
  quickPriceCalculation,
  completeProductAnalysis
} from './helpers';

// Constantes úteis para validação e UI
export const PRICING_CONSTANTS = {
  MIN_WEIGHT: 25,
  MAX_WEIGHT: 500,
  MIN_LENGTH: 20,
  MAX_LENGTH: 120,
  MIN_PRICE: 50,
  MAX_PRICE: 10000,
  STANDARD_WEIGHTS: [50, 100, 150, 200],
  STANDARD_LENGTHS: [30, 40, 50, 60, 70, 80, 90],
  INSTALLMENT_OPTIONS: [1, 3, 6, 10, 12],
  CURRENCY_FORMAT: {
    locale: 'pt-BR',
    currency: 'BRL'
  }
} as const;