/**
 * Utilitários e Validações para o Sistema de Cores de Mega Hair
 * Funções para manipulação, busca e harmonização de cores
 */

import {
  HairColor,
  HairColorFilter,
  HairColorSearchResult,
  ColorHarmonization,
  ColorFormulation,
  HairColorCategory,
  HairColorUndertone,
  HairColorDifficulty,
  ColorLevel
} from '@/types/hairColor';

import {
  PROFESSIONAL_HAIR_COLORS,
  COLOR_INDEX_BY_CODE,
  COLORS_BY_CATEGORY,
  COLORS_BY_LEVEL,
  PREMIUM_COLORS
} from '@/lib/data/hairColors';

/**
 * Busca cores com filtros avançados
 */
export function searchHairColors(filters: HairColorFilter = {}): HairColorSearchResult {
  let filteredColors = [...PROFESSIONAL_HAIR_COLORS];

  // Filtro por categoria
  if (filters.category) {
    const categories = Array.isArray(filters.category) ? filters.category : [filters.category];
    filteredColors = filteredColors.filter(color => categories.includes(color.category));
  }

  // Filtro por undertone
  if (filters.undertone) {
    const undertones = Array.isArray(filters.undertone) ? filters.undertone : [filters.undertone];
    filteredColors = filteredColors.filter(color => undertones.includes(color.undertone));
  }

  // Filtro por dificuldade
  if (filters.difficulty) {
    const difficulties = Array.isArray(filters.difficulty) ? filters.difficulty : [filters.difficulty];
    filteredColors = filteredColors.filter(color => difficulties.includes(color.difficulty));
  }

  // Filtro por nível (range)
  if (filters.levelRange) {
    const [minLevel, maxLevel] = filters.levelRange;
    filteredColors = filteredColors.filter(color =>
      color.level >= minLevel && color.level <= maxLevel
    );
  }

  // Filtro por disponibilidade
  if (filters.isAvailable !== undefined) {
    filteredColors = filteredColors.filter(color => color.isAvailable === filters.isAvailable);
  }

  // Filtro por cores premium
  if (filters.isPremium !== undefined) {
    filteredColors = filteredColors.filter(color => color.isPremium === filters.isPremium);
  }

  // Filtro por tags
  if (filters.tags && filters.tags.length > 0) {
    filteredColors = filteredColors.filter(color =>
      filters.tags!.some(tag =>
        color.tags.some(colorTag =>
          colorTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    );
  }

  // Filtro por faixa de preço
  if (filters.priceRange) {
    const [minPrice, maxPrice] = filters.priceRange;
    filteredColors = filteredColors.filter(color =>
      color.priceMultiplier >= minPrice && color.priceMultiplier <= maxPrice
    );
  }

  // Gerar estatísticas dos filtros
  const filterStats = generateFilterStats(filteredColors);

  return {
    colors: filteredColors,
    total: filteredColors.length,
    filters: filterStats
  };
}

/**
 * Gera estatísticas para os filtros
 */
function generateFilterStats(colors: HairColor[]) {
  const stats = {
    categories: {} as Record<HairColorCategory, number>,
    undertones: {} as Record<HairColorUndertone, number>,
    difficulties: {} as Record<HairColorDifficulty, number>,
    levels: {} as Record<ColorLevel, number>
  };

  colors.forEach(color => {
    // Contar categorias
    stats.categories[color.category] = (stats.categories[color.category] || 0) + 1;

    // Contar undertones
    stats.undertones[color.undertone] = (stats.undertones[color.undertone] || 0) + 1;

    // Contar dificuldades
    stats.difficulties[color.difficulty] = (stats.difficulties[color.difficulty] || 0) + 1;

    // Contar níveis
    stats.levels[color.level] = (stats.levels[color.level] || 0) + 1;
  });

  return stats;
}

/**
 * Busca cor por código
 */
export function getColorByCode(code: string): HairColor | undefined {
  return COLOR_INDEX_BY_CODE[code];
}

/**
 * Busca cores compatíveis para harmonização
 */
export function getCompatibleColors(colorCode: string): HairColor[] {
  const baseColor = getColorByCode(colorCode);
  if (!baseColor) return [];

  const compatibleCodes = [
    ...baseColor.compatibility.harmonious,
    ...baseColor.compatibility.gradient,
    ...baseColor.compatibility.highlights
  ];

  return compatibleCodes
    .map(code => getColorByCode(code))
    .filter(Boolean) as HairColor[];
}

/**
 * Gera recomendações de harmonização de cores
 */
export function generateColorHarmonization(colorCode: string): ColorHarmonization | null {
  const baseColor = getColorByCode(colorCode);
  if (!baseColor) return null;

  const harmonizations = [];

  // Harmonização monocromática (mesmo tom, níveis diferentes)
  const monochromaticColors = PROFESSIONAL_HAIR_COLORS
    .filter(color =>
      color.undertone === baseColor.undertone &&
      color.category === baseColor.category &&
      Math.abs(color.level - baseColor.level) <= 2 &&
      color.code !== colorCode
    )
    .slice(0, 3)
    .map(color => color.code);

  if (monochromaticColors.length > 0) {
    harmonizations.push({
      type: 'monochromatic' as const,
      colors: monochromaticColors,
      description: 'Tons da mesma família com diferentes intensidades'
    });
  }

  // Harmonização análoga (tons vizinhos)
  const analogousColors = baseColor.compatibility.harmonious
    .slice(0, 3);

  if (analogousColors.length > 0) {
    harmonizations.push({
      type: 'analogous' as const,
      colors: analogousColors,
      description: 'Tons próximos que criam transições suaves'
    });
  }

  // Harmonização complementar (tons opostos)
  const complementaryColors = PROFESSIONAL_HAIR_COLORS
    .filter(color =>
      color.undertone !== baseColor.undertone &&
      Math.abs(color.level - baseColor.level) <= 1
    )
    .slice(0, 2)
    .map(color => color.code);

  if (complementaryColors.length > 0) {
    harmonizations.push({
      type: 'complementary' as const,
      colors: complementaryColors,
      description: 'Tons contrastantes para criar impacto visual'
    });
  }

  // Harmonização triádica (três cores equilibradas)
  if (baseColor.compatibility.gradient.length >= 2) {
    harmonizations.push({
      type: 'triadic' as const,
      colors: baseColor.compatibility.gradient.slice(0, 2),
      description: 'Combinação de três tons para degradês complexos'
    });
  }

  return {
    baseColor: colorCode,
    recommendedCombinations: harmonizations
  };
}

/**
 * Calcula o custo estimado de uma transformação de cor
 */
export function calculateColorTransformationCost(
  fromColorCode: string,
  toColorCode: string,
  hairLength: 'short' | 'medium' | 'long' | 'extra_long' = 'medium'
): number {
  const fromColor = getColorByCode(fromColorCode);
  const toColor = getColorByCode(toColorCode);

  if (!fromColor || !toColor) return 0;

  // Multiplicadores base por comprimento
  const lengthMultipliers = {
    short: 1.0,
    medium: 1.3,
    long: 1.7,
    extra_long: 2.2
  };

  // Calcular complexidade da transformação
  const levelDifference = Math.abs(toColor.level - fromColor.level);
  const complexityMultiplier = 1 + (levelDifference * 0.2);

  // Multiplicador por dificuldade da cor de destino
  const difficultyMultipliers = {
    basic: 1.0,
    intermediate: 1.2,
    advanced: 1.5,
    premium: 2.0
  };

  // Custo base (pode ser configurado)
  const baseCost = 100;

  const finalCost = baseCost *
    lengthMultipliers[hairLength] *
    complexityMultiplier *
    difficultyMultipliers[toColor.difficulty] *
    toColor.priceMultiplier;

  return Math.round(finalCost);
}

/**
 * Gera formulação para criar uma cor customizada
 */
export function generateColorFormulation(targetColorCode: string): ColorFormulation | null {
  const targetColor = getColorByCode(targetColorCode);
  if (!targetColor) return null;

  // Para cores básicas, formulação simples
  if (targetColor.difficulty === 'basic') {
    return {
      targetColor: targetColorCode,
      baseColors: [
        { color: targetColorCode, percentage: 100 }
      ],
      instructions: [
        'Aplicar diretamente sobre cabelo natural',
        'Tempo de processamento: ' + (targetColor.technicalInfo?.processingTime || '30-45 min'),
        'Volume de água oxigenada: ' + (targetColor.technicalInfo?.developerVolume || '20 vol')
      ],
      estimatedCost: calculateColorTransformationCost('#4', targetColorCode)
    };
  }

  // Para cores complexas, sugerir mistura
  const baseColors = [];
  const instructions = ['Pré-descolorir se necessário'];

  if (targetColor.category === 'blonde' && targetColor.level >= 8) {
    baseColors.push(
      { color: '#10', percentage: 60 },
      { color: targetColorCode, percentage: 40 }
    );
    instructions.push('Descolorir até nível 9-10');
    instructions.push('Aplicar tonalizante na proporção indicada');
  } else if (targetColor.undertone === 'warm') {
    baseColors.push(
      { color: '#6', percentage: 50 },
      { color: '#16', percentage: 30 },
      { color: targetColorCode, percentage: 20 }
    );
    instructions.push('Misturar tons quentes na proporção');
  } else {
    baseColors.push(
      { color: targetColor.code, percentage: 80 },
      { color: '#8', percentage: 20 }
    );
  }

  instructions.push('Tempo de processamento: ' + (targetColor.technicalInfo?.processingTime || '45-60 min'));
  instructions.push('Matizar se necessário');

  return {
    targetColor: targetColorCode,
    baseColors,
    instructions,
    estimatedCost: calculateColorTransformationCost('#4', targetColorCode, 'medium')
  };
}

/**
 * Valida se uma transformação de cor é segura
 */
export function validateColorTransformation(
  fromColorCode: string,
  toColorCode: string
): { isValid: boolean; warnings: string[]; recommendations: string[] } {
  const fromColor = getColorByCode(fromColorCode);
  const toColor = getColorByCode(toColorCode);

  const warnings: string[] = [];
  const recommendations: string[] = [];

  if (!fromColor || !toColor) {
    return {
      isValid: false,
      warnings: ['Uma ou ambas as cores não foram encontradas'],
      recommendations: ['Verifique os códigos das cores']
    };
  }

  // Verificar se está na lista de cores a evitar
  if (fromColor.compatibility.avoid.includes(toColorCode)) {
    warnings.push('Transformação não recomendada - cores incompatíveis');
    recommendations.push('Considere uma cor intermediária primeiro');
  }

  // Verificar diferença extrema de níveis
  const levelDifference = Math.abs(toColor.level - fromColor.level);
  if (levelDifference > 4) {
    warnings.push('Grande diferença de níveis - processo complexo');
    recommendations.push('Realizar transformação em etapas');
    recommendations.push('Usar tratamentos reconstrutores');
  }

  // Verificar transformação de escuro para muito claro
  if (fromColor.level <= 3 && toColor.level >= 8) {
    warnings.push('Transformação extrema - alto risco de dano');
    recommendations.push('Processo deve ser feito por profissional experiente');
    recommendations.push('Várias sessões podem ser necessárias');
  }

  // Verificar cores premium
  if (toColor.isPremium) {
    recommendations.push('Cor premium - manutenção frequente necessária');
    recommendations.push('Cuidados especiais pós-aplicação obrigatórios');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    recommendations
  };
}

/**
 * Busca cores similares
 */
export function findSimilarColors(colorCode: string, limit: number = 5): HairColor[] {
  const baseColor = getColorByCode(colorCode);
  if (!baseColor) return [];

  return PROFESSIONAL_HAIR_COLORS
    .filter(color => color.code !== colorCode)
    .map(color => ({
      color,
      similarity: calculateColorSimilarity(baseColor, color)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(item => item.color);
}

/**
 * Calcula similaridade entre duas cores
 */
function calculateColorSimilarity(color1: HairColor, color2: HairColor): number {
  let similarity = 0;

  // Similaridade por categoria
  if (color1.category === color2.category) similarity += 30;

  // Similaridade por undertone
  if (color1.undertone === color2.undertone) similarity += 25;

  // Similaridade por nível (inversamente proporcional à diferença)
  const levelDiff = Math.abs(color1.level - color2.level);
  similarity += Math.max(0, 20 - (levelDiff * 2));

  // Similaridade por dificuldade
  if (color1.difficulty === color2.difficulty) similarity += 15;

  // Similaridade por tags comuns
  const commonTags = color1.tags.filter(tag => color2.tags.includes(tag));
  similarity += commonTags.length * 2;

  return similarity;
}

/**
 * Gera relatório de compatibilidade de cores
 */
export function generateCompatibilityReport(colorCodes: string[]): {
  compatible: boolean;
  score: number;
  analysis: string;
  suggestions: string[];
} {
  if (colorCodes.length < 2) {
    return {
      compatible: false,
      score: 0,
      analysis: 'São necessárias pelo menos 2 cores para análise',
      suggestions: []
    };
  }

  const colors = colorCodes.map(code => getColorByCode(code)).filter(Boolean) as HairColor[];
  if (colors.length !== colorCodes.length) {
    return {
      compatible: false,
      score: 0,
      analysis: 'Algumas cores não foram encontradas',
      suggestions: ['Verifique os códigos das cores']
    };
  }

  let compatibilityScore = 0;
  let analysis = '';
  const suggestions: string[] = [];

  // Analisar harmonização entre todas as cores
  for (let i = 0; i < colors.length - 1; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const color1 = colors[i];
      const color2 = colors[j];

      // Verificar se são compatíveis
      if (color1.compatibility.harmonious.includes(color2.code) ||
          color1.compatibility.gradient.includes(color2.code) ||
          color2.compatibility.harmonious.includes(color1.code) ||
          color2.compatibility.gradient.includes(color1.code)) {
        compatibilityScore += 20;
      }

      // Verificar se devem ser evitadas
      if (color1.compatibility.avoid.includes(color2.code) ||
          color2.compatibility.avoid.includes(color1.code)) {
        compatibilityScore -= 30;
      }

      // Bonificar por undertones complementares ou iguais
      if (color1.undertone === color2.undertone) {
        compatibilityScore += 10;
      } else if ((color1.undertone === 'warm' && color2.undertone === 'cool') ||
                 (color1.undertone === 'cool' && color2.undertone === 'warm')) {
        compatibilityScore += 5; // Contraste pode ser interessante
      }
    }
  }

  // Normalizar score para 0-100
  const maxPossibleScore = (colors.length * (colors.length - 1) / 2) * 20;
  const normalizedScore = Math.max(0, Math.min(100, (compatibilityScore / maxPossibleScore) * 100));

  // Gerar análise textual
  if (normalizedScore >= 70) {
    analysis = 'Excelente harmonização entre as cores selecionadas';
  } else if (normalizedScore >= 50) {
    analysis = 'Boa compatibilidade, com algumas considerações';
    suggestions.push('Considere ajustar a intensidade de algumas cores');
  } else if (normalizedScore >= 30) {
    analysis = 'Compatibilidade moderada, requer cuidado na aplicação';
    suggestions.push('Faça testes de mecha antes da aplicação');
    suggestions.push('Considere usar cores intermediárias');
  } else {
    analysis = 'Baixa compatibilidade - combinação não recomendada';
    suggestions.push('Escolha cores mais harmoniosas');
    suggestions.push('Consulte um colorista profissional');
  }

  // Sugestões baseadas nas categorias
  const categories = [...new Set(colors.map(c => c.category))];
  if (categories.length > 2) {
    suggestions.push('Muitas categorias diferentes - considere focar em uma paleta');
  }

  return {
    compatible: normalizedScore >= 50,
    score: Math.round(normalizedScore),
    analysis,
    suggestions
  };
}

/**
 * Utilitário para filtros de UI
 */
export const ColorFilterUtils = {
  // Opções para selects
  categoryOptions: [
    { value: 'natural', label: 'Cores Naturais' },
    { value: 'blonde', label: 'Loiros' },
    { value: 'fashion', label: 'Cores Fashion' }
  ],

  undertoneOptions: [
    { value: 'cool', label: 'Frio' },
    { value: 'warm', label: 'Quente' },
    { value: 'neutral', label: 'Neutro' }
  ],

  difficultyOptions: [
    { value: 'basic', label: 'Básico' },
    { value: 'intermediate', label: 'Intermediário' },
    { value: 'advanced', label: 'Avançado' },
    { value: 'premium', label: 'Premium' }
  ],

  levelOptions: Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: `Nível ${i + 1}`
  })),

  // Filtros predefinidos populares
  popularFilters: {
    natural: { category: 'natural' as const, isAvailable: true },
    blonde: { category: 'blonde' as const, isAvailable: true },
    premium: { isPremium: true, isAvailable: true },
    beginner: { difficulty: 'basic' as const, isAvailable: true },
    warm: { undertone: 'warm' as const, isAvailable: true },
    cool: { undertone: 'cool' as const, isAvailable: true }
  }
};