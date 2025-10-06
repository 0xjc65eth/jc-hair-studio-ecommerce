/**
 * Sistema de Pricing Inteligente para Mega Hair
 * Baseado em custo real de importação Europa-Brasil
 *
 * DADOS CRÍTICOS:
 * - Custo base: €70 por 100g, 50cm (cabelo liso padrão)
 * - Margem alvo: 45-55% para competitividade
 * - Margem padrão aplicada: 50% (preço venda = €105 / 100g)
 * - Volumes disponíveis: 100g, 200g, 300g, 500g
 * - Variações: comprimento (50cm, 60cm, 70cm), textura (liso, ondulado, cacheado)
 *
 * FÓRMULA DE PREÇO:
 * Preço Final = (Custo Base × Multiplicador Volume × Multiplicador Comprimento × Multiplicador Textura) × (1 + Margem)
 */

import {
  MegaHairPricingParams,
  PricingResult,
  PriceBreakdown,
  PricingConfig,
  TechnicalComplexity,
  HairQuality,
  HairOrigin,
  WeightPricingTier,
  WEIGHT_TIERS,
  MarketPriceReference,
  PricingStrategy
} from '../../types/pricing';

// Constantes de custo baseadas em dados reais de importação
const COST_BASE_EUR = 70; // Custo base por 100g, 50cm
const MARGIN_TARGET = 0.50; // 50% margem
const BASE_WEIGHT = 100; // Peso base em gramas
const BASE_LENGTH = 50; // Comprimento base em cm

// Sistema de descontos progressivos por volume
const VOLUME_DISCOUNTS = {
  100: 0,      // Sem desconto
  200: 0.10,   // 10% desconto
  300: 0.15,   // 15% desconto
  500: 0.20    // 20% desconto
};

// Multiplicadores por comprimento (custo aumenta com comprimento)
const LENGTH_MULTIPLIERS = {
  50: 1.0,     // Base
  60: 1.3,     // +30%
  70: 1.6      // +60%
};

// Multiplicadores por textura (complexidade de processamento)
const TEXTURE_MULTIPLIERS = {
  'STRAIGHT': 1.0,    // Liso - base
  'WAVY': 1.15,       // Ondulado - +15%
  'CURLY': 1.30,      // Cacheado - +30%
  'COILY': 1.45       // Crespo - +45%
};

export class MegaHairPricingEngine {
  private config: PricingConfig;
  private marketReferences: MarketPriceReference[];
  private strategies: PricingStrategy[];

  constructor() {
    this.config = this.getDefaultConfig();
    this.marketReferences = this.getMarketReferences();
    this.strategies = this.getPricingStrategies();
  }

  /**
   * Calcula preço baseado no custo real de importação (€70/100g)
   * Com margem de 50% e descontos progressivos por volume
   */
  calculateImportPrice(
    weight: number,      // 100, 200, 300, 500
    length: number,      // 50, 60, 70
    texture: 'STRAIGHT' | 'WAVY' | 'CURLY' | 'COILY'
  ): {
    costPrice: number;
    volumeDiscount: number;
    lengthMultiplier: number;
    textureMultiplier: number;
    finalCost: number;
    margin: number;
    salePrice: number;
    profitMargin: number;
  } {
    // 1. Calcular custo base por peso
    const baseCostForWeight = (COST_BASE_EUR * weight) / BASE_WEIGHT;

    // 2. Aplicar multiplicador de comprimento
    const lengthMultiplier = LENGTH_MULTIPLIERS[length as keyof typeof LENGTH_MULTIPLIERS] || 1.0;
    const costAfterLength = baseCostForWeight * lengthMultiplier;

    // 3. Aplicar multiplicador de textura
    const textureMultiplier = TEXTURE_MULTIPLIERS[texture];
    const costAfterTexture = costAfterLength * textureMultiplier;

    // 4. Aplicar desconto por volume
    const volumeDiscount = VOLUME_DISCOUNTS[weight as keyof typeof VOLUME_DISCOUNTS] || 0;
    const finalCost = costAfterTexture * (1 - volumeDiscount);

    // 5. Aplicar margem de lucro
    const salePrice = finalCost * (1 + MARGIN_TARGET);

    // 6. Calcular margem real
    const profitMargin = ((salePrice - finalCost) / finalCost) * 100;

    return {
      costPrice: Math.round(baseCostForWeight * 100) / 100,
      volumeDiscount: volumeDiscount * 100,
      lengthMultiplier,
      textureMultiplier,
      finalCost: Math.round(finalCost * 100) / 100,
      margin: MARGIN_TARGET * 100,
      salePrice: Math.round(salePrice * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100
    };
  }

  /**
   * Gera tabela completa de preços para todas as variações
   */
  generatePriceTable(): Array<{
    weight: number;
    length: number;
    texture: string;
    cost: number;
    price: number;
    discount: number;
    margin: number;
  }> {
    const weights = [100, 200, 300, 500];
    const lengths = [50, 60, 70];
    const textures: Array<'STRAIGHT' | 'WAVY' | 'CURLY' | 'COILY'> = ['STRAIGHT', 'WAVY', 'CURLY', 'COILY'];

    const priceTable: Array<{
      weight: number;
      length: number;
      texture: string;
      cost: number;
      price: number;
      discount: number;
      margin: number;
    }> = [];

    for (const weight of weights) {
      for (const length of lengths) {
        for (const texture of textures) {
          const pricing = this.calculateImportPrice(weight, length, texture);
          priceTable.push({
            weight,
            length,
            texture,
            cost: pricing.finalCost,
            price: pricing.salePrice,
            discount: pricing.volumeDiscount,
            margin: pricing.profitMargin
          });
        }
      }
    }

    return priceTable;
  }

  /**
   * Calcula o preço final baseado nos parâmetros fornecidos
   */
  calculatePrice(params: MegaHairPricingParams): PricingResult {
    const {
      basePrice,
      weight,
      length,
      complexity,
      quality,
      origin
    } = params;

    // Aplica multiplicadores
    const complexityMultiplier = this.config.complexityMultipliers[complexity];
    const lengthMultiplier = this.getLengthMultiplier(length);
    const qualityMultiplier = this.config.qualityMultipliers[quality];
    const originMultiplier = this.config.originMultipliers[origin];
    const weightMultiplier = this.getWeightMultiplier(weight);

    // Cálculo do preço base ajustado por peso
    const weightAdjustedBase = basePrice * weightMultiplier;

    // Aplica todos os multiplicadores
    const priceAfterComplexity = weightAdjustedBase * complexityMultiplier;
    const priceAfterLength = priceAfterComplexity * lengthMultiplier;
    const priceAfterQuality = priceAfterLength * qualityMultiplier;
    const finalPrice = Math.round(priceAfterQuality * originMultiplier * 100) / 100;

    // Calcula preço de custo baseado na margem target
    const targetMargin = this.getTargetMargin(complexity, quality);
    const costPrice = Math.round((finalPrice / targetMargin) * 100) / 100;
    const margin = ((finalPrice - costPrice) / costPrice) * 100;

    const breakdown: PriceBreakdown = {
      base: weightAdjustedBase,
      complexityAdjustment: priceAfterComplexity - weightAdjustedBase,
      lengthAdjustment: priceAfterLength - priceAfterComplexity,
      qualityAdjustment: finalPrice - priceAfterLength,
      total: finalPrice
    };

    return {
      basePrice: weightAdjustedBase,
      complexityMultiplier,
      lengthMultiplier,
      qualityMultiplier: qualityMultiplier * originMultiplier,
      finalPrice,
      margin,
      costPrice,
      breakdown
    };
  }

  /**
   * Calcula preço baseado em referências de mercado
   */
  calculateMarketBasedPrice(
    weight: number,
    length: number,
    quality: HairQuality,
    origin: HairOrigin,
    complexity: TechnicalComplexity
  ): PricingResult {
    const marketPrice = this.getMarketReferencePrice(weight, length, quality, origin);

    const params: MegaHairPricingParams = {
      basePrice: marketPrice,
      weight,
      length,
      complexity,
      quality,
      origin
    };

    return this.calculatePrice(params);
  }

  /**
   * Sugere estratégia de pricing baseada no posicionamento desejado
   */
  suggestPricingStrategy(
    positioning: 'economy' | 'competitive' | 'premium',
    weight: number,
    length: number
  ): { strategy: PricingStrategy; suggestedPrice: number } {
    const strategy = this.strategies.find(s =>
      s.name.toLowerCase().includes(positioning)
    ) || this.strategies[1]; // default para competitive

    const basePrice = strategy.basePricePerGram * weight;
    const lengthMultiplier = this.getLengthMultiplier(length);
    const suggestedPrice = Math.round(basePrice * lengthMultiplier * 100) / 100;

    return {
      strategy,
      suggestedPrice
    };
  }

  /**
   * Analisa competitividade do preço
   */
  analyzeCompetitiveness(
    price: number,
    weight: number,
    length: number
  ): {
    position: 'below' | 'competitive' | 'above' | 'premium';
    marketAverage: number;
    difference: number;
    recommendation: string;
  } {
    const pricePerGramCm = price / (weight * (length / 10));
    const marketAverage = this.calculateMarketAverage(weight, length);
    const marketPricePerGramCm = marketAverage / (weight * (length / 10));

    const difference = ((pricePerGramCm - marketPricePerGramCm) / marketPricePerGramCm) * 100;

    let position: 'below' | 'competitive' | 'above' | 'premium';
    let recommendation: string;

    if (difference < -20) {
      position = 'below';
      recommendation = 'Preço muito abaixo do mercado. Considere aumentar para melhor margem.';
    } else if (difference >= -20 && difference <= 20) {
      position = 'competitive';
      recommendation = 'Preço competitivo com o mercado. Boa estratégia.';
    } else if (difference > 20 && difference <= 50) {
      position = 'above';
      recommendation = 'Preço acima da média. Certifique-se de que a qualidade justifica.';
    } else {
      position = 'premium';
      recommendation = 'Preço premium. Ideal para produtos exclusivos de alta qualidade.';
    }

    return {
      position,
      marketAverage,
      difference: Math.round(difference * 100) / 100,
      recommendation
    };
  }

  private getDefaultConfig(): PricingConfig {
    return {
      complexityMultipliers: {
        [TechnicalComplexity.BASIC]: 1.0,
        [TechnicalComplexity.INTERMEDIATE]: 1.2,
        [TechnicalComplexity.ADVANCED]: 1.5,
        [TechnicalComplexity.PREMIUM]: 2.0
      },
      lengthMultipliers: {
        30: 1.0,   // base
        40: 1.3,   // +30%
        50: 1.69,  // +69%
        60: 2.2,   // +120%
        70: 2.85,  // +185%
        80: 3.71,  // +271%
        90: 4.83   // +383%
      },
      qualityMultipliers: {
        [HairQuality.STANDARD]: 1.0,
        [HairQuality.PREMIUM]: 1.15,
        [HairQuality.VIRGIN]: 1.25,
        [HairQuality.VIRGIN_AAA]: 1.4
      },
      originMultipliers: {
        [HairOrigin.BRASILEIRO]: 1.0,
        [HairOrigin.EUROPEU]: 1.25,
        [HairOrigin.INDIANO_REMY]: 1.15,
        [HairOrigin.VIRGEM_AAA]: 1.4
      },
      targetMargin: {
        minimum: 2.0,
        standard: 2.5,
        premium: 3.0
      }
    };
  }

  private getMarketReferences(): MarketPriceReference[] {
    return [
      // Baseado na pesquisa DonaChique
      {
        length: 51,
        weight: 37.5,
        quality: HairQuality.STANDARD,
        origin: HairOrigin.BRASILEIRO,
        marketPrice: 141, // média entre R$ 130-152
        source: 'DonaChique (2024)'
      },
      {
        length: 61,
        weight: 37.5,
        quality: HairQuality.STANDARD,
        origin: HairOrigin.BRASILEIRO,
        marketPrice: 176.5, // média entre R$ 166-187
        source: 'DonaChique (2024)'
      },
      // Baseado na pesquisa Dana Mega Hair
      {
        length: 70,
        weight: 200,
        quality: HairQuality.VIRGIN,
        origin: HairOrigin.BRASILEIRO,
        marketPrice: 2235.25,
        source: 'Dana Mega Hair (2024)'
      },
      // Referências extrapoladas baseadas no padrão do mercado
      {
        length: 40,
        weight: 100,
        quality: HairQuality.STANDARD,
        origin: HairOrigin.BRASILEIRO,
        marketPrice: 280,
        source: 'Extrapolação baseada no mercado'
      },
      {
        length: 50,
        weight: 100,
        quality: HairQuality.STANDARD,
        origin: HairOrigin.BRASILEIRO,
        marketPrice: 380,
        source: 'Extrapolação baseada no mercado'
      },
      {
        length: 60,
        weight: 100,
        quality: HairQuality.PREMIUM,
        origin: HairOrigin.BRASILEIRO,
        marketPrice: 650,
        source: 'Extrapolação baseada no mercado'
      }
    ];
  }

  private getPricingStrategies(): PricingStrategy[] {
    return [
      {
        name: 'Economy',
        description: 'Estratégia de preços competitivos para mercado de entrada',
        targetMarket: 'Clientes conscientes de preço, primeira compra',
        basePricePerGram: 2.5, // R$ 2.50 por grama
        competitiveAnalysis: [
          {
            competitor: 'DonaChique',
            avgPrice: 158.75,
            positioning: 'competitive'
          },
          {
            competitor: 'Mercado Popular',
            avgPrice: 120,
            positioning: 'below'
          }
        ]
      },
      {
        name: 'Competitive',
        description: 'Posicionamento competitivo com boa margem',
        targetMarket: 'Mercado principal, clientes regulares',
        basePricePerGram: 3.8, // R$ 3.80 por grama
        competitiveAnalysis: [
          {
            competitor: 'Dana Mega Hair',
            avgPrice: 2235,
            positioning: 'competitive'
          },
          {
            competitor: 'Média do Mercado',
            avgPrice: 400,
            positioning: 'competitive'
          }
        ]
      },
      {
        name: 'Premium',
        description: 'Estratégia premium para produtos de alta qualidade',
        targetMarket: 'Clientes premium, salões de alta qualidade',
        basePricePerGram: 5.5, // R$ 5.50 por grama
        competitiveAnalysis: [
          {
            competitor: 'Marcas Premium',
            avgPrice: 800,
            positioning: 'premium'
          },
          {
            competitor: 'Importados',
            avgPrice: 1200,
            positioning: 'below'
          }
        ]
      }
    ];
  }

  private getLengthMultiplier(length: number): number {
    // Se o comprimento exato não existe, interpola entre os valores mais próximos
    const lengths = Object.keys(this.config.lengthMultipliers)
      .map(Number)
      .sort((a, b) => a - b);

    if (this.config.lengthMultipliers[length as keyof typeof this.config.lengthMultipliers]) {
      return this.config.lengthMultipliers[length as keyof typeof this.config.lengthMultipliers];
    }

    // Interpolação linear para comprimentos não definidos
    const lowerLength = lengths.find((l, i) => l <= length && lengths[i + 1] > length);
    const upperLength = lengths.find(l => l > length);

    if (!lowerLength || !upperLength) {
      // Se não encontrou, usa o valor mais próximo
      const closest = lengths.reduce((prev, curr) =>
        Math.abs(curr - length) < Math.abs(prev - length) ? curr : prev
      );
      return this.config.lengthMultipliers[closest as keyof typeof this.config.lengthMultipliers];
    }

    const lowerMultiplier = this.config.lengthMultipliers[lowerLength as keyof typeof this.config.lengthMultipliers];
    const upperMultiplier = this.config.lengthMultipliers[upperLength as keyof typeof this.config.lengthMultipliers];

    const ratio = (length - lowerLength) / (upperLength - lowerLength);
    return lowerMultiplier + (upperMultiplier - lowerMultiplier) * ratio;
  }

  private getWeightMultiplier(weight: number): number {
    const tier = WEIGHT_TIERS.find(t => t.weight >= weight) || WEIGHT_TIERS[WEIGHT_TIERS.length - 1];
    return tier.baseMultiplier;
  }

  private getTargetMargin(complexity: TechnicalComplexity, quality: HairQuality): number {
    if (complexity === TechnicalComplexity.PREMIUM || quality === HairQuality.VIRGIN_AAA) {
      return this.config.targetMargin.premium;
    }

    if (complexity === TechnicalComplexity.ADVANCED || quality === HairQuality.VIRGIN) {
      return this.config.targetMargin.standard;
    }

    return this.config.targetMargin.minimum;
  }

  private getMarketReferencePrice(
    weight: number,
    length: number,
    quality: HairQuality,
    origin: HairOrigin
  ): number {
    // Encontra a referência mais próxima
    const bestMatch = this.marketReferences.reduce((best, current) => {
      const bestScore = this.calculateMatchScore(best, weight, length, quality, origin);
      const currentScore = this.calculateMatchScore(current, weight, length, quality, origin);
      return currentScore > bestScore ? current : best;
    });

    // Ajusta o preço baseado nas diferenças
    const pricePerGram = bestMatch.marketPrice / bestMatch.weight;
    const lengthRatio = length / bestMatch.length;
    const adjustedPrice = pricePerGram * weight * lengthRatio;

    return Math.round(adjustedPrice * 100) / 100;
  }

  private calculateMatchScore(
    reference: MarketPriceReference,
    weight: number,
    length: number,
    quality: HairQuality,
    origin: HairOrigin
  ): number {
    let score = 0;

    // Pontuação por proximidade de peso (0-30 pontos)
    const weightDiff = Math.abs(reference.weight - weight) / Math.max(reference.weight, weight);
    score += (1 - weightDiff) * 30;

    // Pontuação por proximidade de comprimento (0-30 pontos)
    const lengthDiff = Math.abs(reference.length - length) / Math.max(reference.length, length);
    score += (1 - lengthDiff) * 30;

    // Pontuação por qualidade (0-20 pontos)
    score += reference.quality === quality ? 20 : 0;

    // Pontuação por origem (0-20 pontos)
    score += reference.origin === origin ? 20 : 0;

    return score;
  }

  private calculateMarketAverage(weight: number, length: number): number {
    const relevantReferences = this.marketReferences.filter(ref =>
      Math.abs(ref.weight - weight) <= weight * 0.5 &&
      Math.abs(ref.length - length) <= length * 0.3
    );

    if (relevantReferences.length === 0) {
      // Fallback para todas as referências com ajuste
      return this.getMarketReferencePrice(weight, length, HairQuality.STANDARD, HairOrigin.BRASILEIRO);
    }

    const avgPricePerGramCm = relevantReferences.reduce((sum, ref) => {
      const pricePerGramCm = ref.marketPrice / (ref.weight * (ref.length / 10));
      return sum + pricePerGramCm;
    }, 0) / relevantReferences.length;

    return avgPricePerGramCm * weight * (length / 10);
  }
}

// Instância singleton para uso global
export const megaHairPricing = new MegaHairPricingEngine();

// Funções de conveniência para uso direto
export const calculateMegaHairPrice = (params: MegaHairPricingParams): PricingResult => {
  return megaHairPricing.calculatePrice(params);
};

export const getMarketBasedPrice = (
  weight: number,
  length: number,
  quality: HairQuality = HairQuality.STANDARD,
  origin: HairOrigin = HairOrigin.BRASILEIRO,
  complexity: TechnicalComplexity = TechnicalComplexity.BASIC
): PricingResult => {
  return megaHairPricing.calculateMarketBasedPrice(weight, length, quality, origin, complexity);
};

export const analyzePriceCompetitiveness = (
  price: number,
  weight: number,
  length: number
) => {
  return megaHairPricing.analyzeCompetitiveness(price, weight, length);
};