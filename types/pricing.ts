/**
 * Sistema de Pricing Inteligente para Mega Hair
 * Baseado em pesquisa de mercado brasileiro (2024-2025)
 */

export interface MegaHairPricingParams {
  basePrice: number;
  weight: number; // em gramas (50g, 100g, 150g, 200g)
  length: number; // em cm (30, 40, 50, 60, 70, 80, 90)
  complexity: TechnicalComplexity;
  quality: HairQuality;
  origin: HairOrigin;
}

export interface PricingResult {
  basePrice: number;
  complexityMultiplier: number;
  lengthMultiplier: number;
  qualityMultiplier: number;
  finalPrice: number;
  margin: number;
  costPrice: number;
  breakdown: PriceBreakdown;
}

export interface PriceBreakdown {
  base: number;
  complexityAdjustment: number;
  lengthAdjustment: number;
  qualityAdjustment: number;
  total: number;
}

export enum TechnicalComplexity {
  BASIC = 'basic',           // cores naturais - multiplicador 1.0x
  INTERMEDIATE = 'intermediate', // loiros - multiplicador 1.2x
  ADVANCED = 'advanced',     // fashion colors - multiplicador 1.5x
  PREMIUM = 'premium'        // coleções especiais - multiplicador 2.0x
}

export enum HairQuality {
  STANDARD = 'standard',     // Cabelo padrão classe A-B
  PREMIUM = 'premium',       // Cabelo selecionado classe A
  VIRGIN = 'virgin',         // Cabelo virgem sem tratamento químico
  VIRGIN_AAA = 'virgin_aaa'  // Cabelo virgem AAA+ premium
}

export enum HairOrigin {
  BRASILEIRO = 'brasileiro', // base
  EUROPEU = 'europeu',      // +25%
  INDIANO_REMY = 'indiano_remy', // +15%
  VIRGEM_AAA = 'virgem_aaa' // +40%
}

export interface MarketPriceReference {
  length: number;
  weight: number;
  quality: HairQuality;
  origin: HairOrigin;
  marketPrice: number; // baseado na pesquisa de mercado
  source: string;
}

export interface PricingConfig {
  // Multiplicadores de complexidade técnica
  complexityMultipliers: {
    [TechnicalComplexity.BASIC]: 1.0;
    [TechnicalComplexity.INTERMEDIATE]: 1.2;
    [TechnicalComplexity.ADVANCED]: 1.5;
    [TechnicalComplexity.PREMIUM]: 2.0;
  };

  // Multiplicadores por comprimento (progressivo)
  lengthMultipliers: {
    30: 1.0;   // base
    40: 1.3;   // +30%
    50: 1.69;  // +69%
    60: 2.2;   // +120%
    70: 2.85;  // +185%
    80: 3.71;  // +271%
    90: 4.83;  // +383%
  };

  // Multiplicadores por qualidade e origem
  qualityMultipliers: {
    [HairQuality.STANDARD]: 1.0;
    [HairQuality.PREMIUM]: 1.15;
    [HairQuality.VIRGIN]: 1.25;
    [HairQuality.VIRGIN_AAA]: 1.4;
  };

  originMultipliers: {
    [HairOrigin.BRASILEIRO]: 1.0;    // base
    [HairOrigin.EUROPEU]: 1.25;      // +25%
    [HairOrigin.INDIANO_REMY]: 1.15; // +15%
    [HairOrigin.VIRGEM_AAA]: 1.4;    // +40%
  };

  // Margem de lucro padrão (200-300%)
  targetMargin: {
    minimum: 2.0; // 200%
    standard: 2.5; // 250%
    premium: 3.0;  // 300%
  };
}

export interface WeightPricingTier {
  weight: number;
  description: string;
  recommendedUse: string;
  baseMultiplier: number;
}

export const WEIGHT_TIERS: WeightPricingTier[] = [
  {
    weight: 50,
    description: "Manutenção/Retoques",
    recommendedUse: "Para preenchimento de pontas ou manutenção",
    baseMultiplier: 0.5
  },
  {
    weight: 100,
    description: "Volume Médio",
    recommendedUse: "Manutenção ou mais volume para cabelos finos",
    baseMultiplier: 1.0
  },
  {
    weight: 150,
    description: "Volume Ideal",
    recommendedUse: "Volume médio - mais recomendado para resultado natural",
    baseMultiplier: 1.5
  },
  {
    weight: 200,
    description: "Volume Máximo",
    recommendedUse: "Máximo volume para cabelos grossos ou comprimentos longos",
    baseMultiplier: 2.0
  }
];

export interface PricingStrategy {
  name: string;
  description: string;
  targetMarket: string;
  basePricePerGram: number; // preço base por grama
  competitiveAnalysis: {
    competitor: string;
    avgPrice: number;
    positioning: 'below' | 'competitive' | 'premium';
  }[];
}