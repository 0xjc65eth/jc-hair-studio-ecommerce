/**
 * Funções auxiliares para o sistema de pricing
 */

import {
  calculateMegaHairPrice,
  analyzePriceCompetitiveness
} from './megaHairPricing';

import {
  TechnicalComplexity,
  HairQuality,
  HairOrigin
} from '../../types/pricing';

import {
  getComplexityByColor,
  getQualityByDescription,
  getOriginByCountry,
  getSuggestedProducts,
  generatePriceAnalysisReport
} from './utils';

import {
  getMarketAverage,
  getCompetitorAnalysis
} from './marketData';

import type { MegaHairPricingParams } from '../../types/pricing';

// Função de conveniência para cálculo rápido
export const quickPriceCalculation = (
  weight: number,
  length: number,
  colorCode?: string,
  qualityDescription?: string,
  origin?: string
) => {
  // Determina parâmetros automaticamente
  const complexity = colorCode ? getComplexityByColor(colorCode) : TechnicalComplexity.BASIC;
  const quality = qualityDescription ? getQualityByDescription(qualityDescription) : HairQuality.STANDARD;
  const hairOrigin = origin ? getOriginByCountry(origin) : HairOrigin.BRASILEIRO;

  // Usa preço de mercado como base
  const basePrice = getMarketAverage(weight, length);

  const params: MegaHairPricingParams = {
    basePrice,
    weight,
    length,
    complexity,
    quality,
    origin: hairOrigin
  };

  return calculateMegaHairPrice(params);
};

// Função para análise completa de produto
export const completeProductAnalysis = (
  weight: number,
  length: number,
  targetPrice?: number
) => {
  const marketAverage = getMarketAverage(weight, length);
  const priceToAnalyze = targetPrice || marketAverage;

  const competitiveness = analyzePriceCompetitiveness(priceToAnalyze, weight, length);
  const competitors = getCompetitorAnalysis(priceToAnalyze, weight);
  const suggestions = getSuggestedProducts(weight, length);

  // Calcula diferentes cenários de pricing
  const scenarios = [
    quickPriceCalculation(weight, length),
    quickPriceCalculation(weight, length, '10', 'premium'),
    quickPriceCalculation(weight, length, 'OMBRE', 'virgem', 'europeu')
  ];

  return {
    marketAnalysis: {
      average: marketAverage,
      competitiveness,
      competitors
    },
    pricingScenarios: {
      basic: scenarios[0],
      premium: scenarios[1],
      luxury: scenarios[2]
    },
    recommendations: {
      suggestedProducts: suggestions,
      analysis: generatePriceAnalysisReport(scenarios[1], marketAverage, 50)
    }
  };
};