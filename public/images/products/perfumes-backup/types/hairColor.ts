/**
 * Sistema de Cores Profissional para Mega Hair
 * Baseado nos padrões da indústria de colorimetria capilar
 */

export type HairColorCategory = 'natural' | 'blonde' | 'fashion';

export type HairColorUndertone = 'cool' | 'warm' | 'neutral';

export type HairColorDifficulty = 'basic' | 'intermediate' | 'advanced' | 'premium';

export type ColorLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface HairColorBase {
  /** Código numérico oficial da cor (ex: #1, #6, #613) */
  code: string;

  /** Nome comercial da cor */
  commercialName: string;

  /** Nome técnico/profissional da cor */
  technicalName: string;

  /** Descrição detalhada da cor */
  description: string;

  /** Categoria principal da cor */
  category: HairColorCategory;

  /** Subcategoria para organização mais específica */
  subcategory?: string;

  /** Tom de fundo da cor */
  undertone: HairColorUndertone;

  /** Nível de claridade (1=preto, 10=loiro platinado) */
  level: ColorLevel;

  /** Nível de dificuldade técnica para aplicação */
  difficulty: HairColorDifficulty;

  /** Cor hexadecimal para visualização */
  hexColor: string;

  /** Multiplicador de preço baseado na complexidade (1.0 = preço base) */
  priceMultiplier: number;

  /** Se a cor está disponível no estoque */
  isAvailable: boolean;

  /** Se é uma cor premium/exclusiva */
  isPremium: boolean;

  /** Tags para busca e filtros */
  tags: string[];
}

export interface HairColorCompatibility {
  /** Cores que combinam harmonicamente */
  harmonious: string[];

  /** Cores para criar degradê */
  gradient: string[];

  /** Cores complementares para mechas */
  highlights: string[];

  /** Cores que devem ser evitadas */
  avoid: string[];
}

export interface HairColorTechnicalInfo {
  /** Tempo de processamento recomendado */
  processingTime?: string;

  /** Volume de água oxigenada recomendado */
  developerVolume?: string;

  /** Observações técnicas especiais */
  technicalNotes?: string;

  /** Cuidados pós-aplicação */
  aftercare?: string[];
}

export interface HairColor extends HairColorBase {
  /** Sistema de compatibilidade entre cores */
  compatibility: HairColorCompatibility;

  /** Informações técnicas para profissionais */
  technicalInfo?: HairColorTechnicalInfo;

  /** Data de criação do registro */
  createdAt?: Date;

  /** Última atualização */
  updatedAt?: Date;
}

export interface HairColorFilter {
  category?: HairColorCategory | HairColorCategory[];
  undertone?: HairColorUndertone | HairColorUndertone[];
  difficulty?: HairColorDifficulty | HairColorDifficulty[];
  levelRange?: [ColorLevel, ColorLevel];
  isAvailable?: boolean;
  isPremium?: boolean;
  tags?: string[];
  priceRange?: [number, number];
}

export interface HairColorSearchResult {
  colors: HairColor[];
  total: number;
  filters: {
    categories: { [key in HairColorCategory]: number };
    undertones: { [key in HairColorUndertone]: number };
    difficulties: { [key in HairColorDifficulty]: number };
    levels: { [key in ColorLevel]: number };
  };
}

export interface ColorHarmonization {
  baseColor: string;
  recommendedCombinations: {
    type: 'monochromatic' | 'analogous' | 'complementary' | 'triadic';
    colors: string[];
    description: string;
  }[];
}

export interface ColorFormulation {
  targetColor: string;
  baseColors: {
    color: string;
    percentage: number;
  }[];
  instructions: string[];
  estimatedCost: number;
}

// Constantes do sistema
export const HAIR_COLOR_CATEGORIES: Record<HairColorCategory, string> = {
  natural: 'Cores Naturais',
  blonde: 'Loiros',
  fashion: 'Cores Fashion'
} as const;

export const HAIR_COLOR_UNDERTONES: Record<HairColorUndertone, string> = {
  cool: 'Frio',
  warm: 'Quente',
  neutral: 'Neutro'
} as const;

export const HAIR_COLOR_DIFFICULTIES: Record<HairColorDifficulty, string> = {
  basic: 'Básico',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
  premium: 'Premium'
} as const;

export const COLOR_LEVELS: Record<ColorLevel, string> = {
  1: 'Preto Natural',
  2: 'Castanho Escuro',
  3: 'Castanho Médio',
  4: 'Castanho Claro',
  5: 'Castanho Acinzentado',
  6: 'Loiro Escuro',
  7: 'Loiro Médio',
  8: 'Loiro Claro',
  9: 'Loiro Muito Claro',
  10: 'Loiro Platinado'
} as const;