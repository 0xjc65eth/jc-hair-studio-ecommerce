/**
 * Utilitários para o sistema de pricing de Mega Hair
 */

import {
  TechnicalComplexity,
  HairQuality,
  HairOrigin,
  WeightPricingTier,
  WEIGHT_TIERS,
  PricingResult
} from '../../types/pricing';

/**
 * Mapeia cores de cabelo para complexidade técnica
 */
export const getComplexityByColor = (colorCode: string): TechnicalComplexity => {
  const colorComplexityMap: Record<string, TechnicalComplexity> = {
    // Cores naturais - Basic
    '1': TechnicalComplexity.BASIC,    // Preto
    '1B': TechnicalComplexity.BASIC,   // Preto Natural
    '2': TechnicalComplexity.BASIC,    // Castanho Escuro
    '4': TechnicalComplexity.BASIC,    // Castanho
    '6': TechnicalComplexity.BASIC,    // Castanho Claro
    '8': TechnicalComplexity.BASIC,    // Loiro Escuro

    // Loiros - Intermediate
    '10': TechnicalComplexity.INTERMEDIATE, // Loiro Claro
    '12': TechnicalComplexity.INTERMEDIATE, // Loiro Claríssimo
    '14': TechnicalComplexity.INTERMEDIATE, // Loiro Natural
    '16': TechnicalComplexity.INTERMEDIATE, // Loiro Dourado
    '18': TechnicalComplexity.INTERMEDIATE, // Loiro Cinza
    '22': TechnicalComplexity.INTERMEDIATE, // Loiro Hollywood
    '24': TechnicalComplexity.INTERMEDIATE, // Loiro Sueco
    '613': TechnicalComplexity.INTERMEDIATE, // Loiro Platinado

    // Fashion Colors - Advanced
    'RED': TechnicalComplexity.ADVANCED,      // Vermelho
    'BLUE': TechnicalComplexity.ADVANCED,     // Azul
    'GREEN': TechnicalComplexity.ADVANCED,    // Verde
    'PINK': TechnicalComplexity.ADVANCED,     // Rosa
    'PURPLE': TechnicalComplexity.ADVANCED,   // Roxo
    'ORANGE': TechnicalComplexity.ADVANCED,   // Laranja
    'FANTASY': TechnicalComplexity.ADVANCED,  // Cores Fantasia

    // Coleções Especiais - Premium
    'OMBRE': TechnicalComplexity.PREMIUM,     // Ombré
    'BALAYAGE': TechnicalComplexity.PREMIUM,  // Balayage
    'RAINBOW': TechnicalComplexity.PREMIUM,   // Arco-íris
    'MERMAID': TechnicalComplexity.PREMIUM,   // Sereia
    'UNICORN': TechnicalComplexity.PREMIUM,   // Unicórnio
    'GALAXY': TechnicalComplexity.PREMIUM,    // Galáxia
    'SUNSET': TechnicalComplexity.PREMIUM     // Pôr do Sol
  };

  return colorComplexityMap[colorCode.toUpperCase()] || TechnicalComplexity.BASIC;
};

/**
 * Mapeia descrições de qualidade para enum
 */
export const getQualityByDescription = (description: string): HairQuality => {
  const desc = description.toLowerCase();

  if (desc.includes('virgem aaa') || desc.includes('virgin aaa')) {
    return HairQuality.VIRGIN_AAA;
  }
  if (desc.includes('virgem') || desc.includes('virgin')) {
    return HairQuality.VIRGIN;
  }
  if (desc.includes('premium') || desc.includes('classe a')) {
    return HairQuality.PREMIUM;
  }

  return HairQuality.STANDARD;
};

/**
 * Mapeia país/origem para enum
 */
export const getOriginByCountry = (country: string): HairOrigin => {
  const countryMap: Record<string, HairOrigin> = {
    'brasil': HairOrigin.BRASILEIRO,
    'brazil': HairOrigin.BRASILEIRO,
    'brasileiro': HairOrigin.BRASILEIRO,
    'europa': HairOrigin.EUROPEU,
    'europe': HairOrigin.EUROPEU,
    'europeu': HairOrigin.EUROPEU,
    'russia': HairOrigin.EUROPEU,
    'russa': HairOrigin.EUROPEU,
    'india': HairOrigin.INDIANO_REMY,
    'índia': HairOrigin.INDIANO_REMY,
    'indiano': HairOrigin.INDIANO_REMY,
    'remy': HairOrigin.INDIANO_REMY,
    'virgem': HairOrigin.VIRGEM_AAA,
    'virgin': HairOrigin.VIRGEM_AAA
  };

  return countryMap[country.toLowerCase()] || HairOrigin.BRASILEIRO;
};

/**
 * Recomenda peso baseado no tipo de uso desejado
 */
export const getRecommendedWeight = (
  usage: 'maintenance' | 'volume' | 'full_head' | 'thick_hair',
  hairLength?: number
): WeightPricingTier => {
  const usageMap: Record<string, number> = {
    'maintenance': 50,
    'volume': 150,
    'full_head': 200,
    'thick_hair': 200
  };

  let recommendedWeight = usageMap[usage] || 100;

  // Ajusta peso baseado no comprimento (cabelos longos precisam de mais peso)
  if (hairLength && hairLength > 60) {
    recommendedWeight = Math.max(recommendedWeight, 150);
  }
  if (hairLength && hairLength > 80) {
    recommendedWeight = Math.max(recommendedWeight, 200);
  }

  return WEIGHT_TIERS.find(tier => tier.weight >= recommendedWeight) || WEIGHT_TIERS[1];
};

/**
 * Formata resultado de pricing para exibição
 */
export const formatPricingResult = (result: PricingResult): {
  formattedPrice: string;
  formattedCost: string;
  formattedMargin: string;
  installments: string;
  savings?: string;
} => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const installments = Math.round((result.finalPrice / 12) * 100) / 100;

  return {
    formattedPrice: formatCurrency(result.finalPrice),
    formattedCost: formatCurrency(result.costPrice),
    formattedMargin: `${result.margin.toFixed(1)}%`,
    installments: `12x de ${formatCurrency(installments)}`,
    savings: result.finalPrice > result.basePrice
      ? `Economia de ${formatCurrency(result.finalPrice - result.basePrice)}`
      : undefined
  };
};

/**
 * Calcula desconto por volume
 */
export const calculateVolumeDiscount = (
  quantity: number,
  unitPrice: number
): { discount: number; finalPrice: number; totalSavings: number } => {
  let discount = 0;

  // Escala de desconto por quantidade
  if (quantity >= 10) {
    discount = 0.20; // 20% para 10+ unidades
  } else if (quantity >= 5) {
    discount = 0.15; // 15% para 5+ unidades
  } else if (quantity >= 3) {
    discount = 0.10; // 10% para 3+ unidades
  } else if (quantity >= 2) {
    discount = 0.05; // 5% para 2+ unidades
  }

  const discountedPrice = unitPrice * (1 - discount);
  const totalPrice = discountedPrice * quantity;
  const originalTotal = unitPrice * quantity;
  const totalSavings = originalTotal - totalPrice;

  return {
    discount,
    finalPrice: Math.round(discountedPrice * 100) / 100,
    totalSavings: Math.round(totalSavings * 100) / 100
  };
};

/**
 * Gera sugestões de produtos complementares
 */
export const getSuggestedProducts = (
  mainWeight: number,
  mainLength: number
): Array<{
  type: string;
  weight: number;
  description: string;
  reason: string;
}> => {
  const suggestions = [];

  // Sugere kit de manutenção
  if (mainWeight >= 150) {
    suggestions.push({
      type: 'Manutenção',
      weight: 50,
      description: 'Kit de manutenção para retoques',
      reason: 'Para manter o visual por mais tempo'
    });
  }

  // Sugere comprimento alternativo
  if (mainLength >= 60) {
    suggestions.push({
      type: 'Comprimento Alternativo',
      weight: Math.floor(mainWeight / 2),
      description: `${mainLength - 10}cm para variação de look`,
      reason: 'Para versatilidade de penteados'
    });
  }

  // Sugere peso adicional para volume extra
  if (mainWeight < 200) {
    suggestions.push({
      type: 'Volume Extra',
      weight: 50,
      description: 'Peso adicional para mais volume',
      reason: 'Para ocasiões especiais ou cabelos muito volumosos'
    });
  }

  return suggestions;
};

/**
 * Valida parâmetros de pricing
 */
export const validatePricingParams = (params: {
  weight?: number;
  length?: number;
  basePrice?: number;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (params.weight !== undefined) {
    if (params.weight < 25 || params.weight > 500) {
      errors.push('Peso deve estar entre 25g e 500g');
    }
  }

  if (params.length !== undefined) {
    if (params.length < 20 || params.length > 120) {
      errors.push('Comprimento deve estar entre 20cm e 120cm');
    }
  }

  if (params.basePrice !== undefined) {
    if (params.basePrice < 50 || params.basePrice > 10000) {
      errors.push('Preço base deve estar entre R$ 50 e R$ 10.000');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calcula ROI para diferentes estratégias de pricing
 */
export const calculateROI = (
  costPrice: number,
  sellingPrice: number,
  expectedVolume: number,
  period: 'month' | 'quarter' | 'year' = 'month'
): {
  roi: number;
  profit: number;
  revenue: number;
  margin: number;
} => {
  const unitProfit = sellingPrice - costPrice;
  const totalRevenue = sellingPrice * expectedVolume;
  const totalProfit = unitProfit * expectedVolume;
  const totalCost = costPrice * expectedVolume;
  const roi = (totalProfit / totalCost) * 100;
  const margin = (unitProfit / sellingPrice) * 100;

  return {
    roi: Math.round(roi * 100) / 100,
    profit: Math.round(totalProfit * 100) / 100,
    revenue: Math.round(totalRevenue * 100) / 100,
    margin: Math.round(margin * 100) / 100
  };
};

/**
 * Gera relatório de análise de preços
 */
export interface PriceAnalysisReport {
  recommendedPrice: number;
  competitivePosition: string;
  marginAnalysis: string;
  volumeProjection: string;
  riskAssessment: string;
  recommendations: string[];
}

export const generatePriceAnalysisReport = (
  result: PricingResult,
  marketAverage: number,
  targetVolume: number
): PriceAnalysisReport => {
  const priceRatio = result.finalPrice / marketAverage;
  const recommendations: string[] = [];

  let competitivePosition: string;
  if (priceRatio < 0.8) {
    competitivePosition = 'Preço muito competitivo - abaixo do mercado';
    recommendations.push('Considere aumentar preço para melhorar margem');
  } else if (priceRatio <= 1.2) {
    competitivePosition = 'Preço competitivo com o mercado';
    recommendations.push('Estratégia de preço bem posicionada');
  } else if (priceRatio <= 1.5) {
    competitivePosition = 'Preço premium - acima do mercado';
    recommendations.push('Certifique-se de que a qualidade justifica o preço premium');
  } else {
    competitivePosition = 'Preço ultra-premium';
    recommendations.push('Considere reduzir preço ou segmentar para mercado de luxo');
  }

  let marginAnalysis: string;
  if (result.margin < 150) {
    marginAnalysis = 'Margem baixa - risco para sustentabilidade';
    recommendations.push('Otimize custos ou ajuste preço para melhor margem');
  } else if (result.margin <= 250) {
    marginAnalysis = 'Margem adequada para operação sustentável';
  } else {
    marginAnalysis = 'Margem excelente com boa rentabilidade';
  }

  const volumeProjection = targetVolume > 100
    ? 'Alto volume esperado - foque em eficiência operacional'
    : 'Volume moderado - oportunidade para produtos premium';

  const riskAssessment = priceRatio > 1.3
    ? 'Alto risco - preço pode limitar demanda'
    : priceRatio < 0.9
      ? 'Baixo risco - preço atrativo para mercado'
      : 'Risco moderado - posição equilibrada';

  return {
    recommendedPrice: result.finalPrice,
    competitivePosition,
    marginAnalysis,
    volumeProjection,
    riskAssessment,
    recommendations
  };
};