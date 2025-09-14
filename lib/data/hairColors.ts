/**
 * Base de Dados Profissional de Cores para Mega Hair
 * Baseada nos padrões internacionais de colorimetria capilar
 */

import { HairColor } from '@/types/hairColor';

export const PROFESSIONAL_HAIR_COLORS: HairColor[] = [
  // ================== CORES NATURAIS (#1-#5) ==================
  {
    code: '#1',
    commercialName: 'Preto Natural',
    technicalName: 'Natural Black',
    description: 'Tom preto profundo e natural, ideal para cabelos brasileiros',
    category: 'natural',
    subcategory: 'pretos',
    undertone: 'neutral',
    level: 1,
    difficulty: 'basic',
    hexColor: '#1a1a1a',
    priceMultiplier: 1.0,
    isAvailable: true,
    isPremium: false,
    tags: ['natural', 'preto', 'básico', 'brasileiro'],
    compatibility: {
      harmonious: ['#1B', '#2', '#4'],
      gradient: ['#2', '#4'],
      highlights: ['#6', '#8'],
      avoid: ['#613', '#24']
    },
    technicalInfo: {
      processingTime: '30-45 minutos',
      developerVolume: '20 vol',
      technicalNotes: 'Cor base universal, aceita qualquer tonalizante',
      aftercare: ['Shampoo neutro', 'Hidratação semanal', 'Protetor térmico']
    }
  },

  {
    code: '#1B',
    commercialName: 'Preto Azulado',
    technicalName: 'Off Black',
    description: 'Preto com reflexos azulados sutis, muito natural',
    category: 'natural',
    subcategory: 'pretos',
    undertone: 'cool',
    level: 1,
    difficulty: 'basic',
    hexColor: '#191919',
    priceMultiplier: 1.1,
    isAvailable: true,
    isPremium: false,
    tags: ['preto', 'azulado', 'reflexo', 'natural'],
    compatibility: {
      harmonious: ['#1', '#2', '#4'],
      gradient: ['#2', '#4'],
      highlights: ['#6', '#8'],
      avoid: ['#27', '#30']
    },
    technicalInfo: {
      processingTime: '35-45 minutos',
      developerVolume: '20 vol',
      technicalNotes: 'Reflexo azul sutil, ideal para pele fria',
      aftercare: ['Shampoo matizador azul', 'Máscara nutritiva']
    }
  },

  {
    code: '#2',
    commercialName: 'Castanho Escuro',
    technicalName: 'Darkest Brown',
    description: 'Castanho profundo com nuances naturais',
    category: 'natural',
    subcategory: 'castanhos',
    undertone: 'neutral',
    level: 2,
    difficulty: 'basic',
    hexColor: '#2d1b14',
    priceMultiplier: 1.0,
    isAvailable: true,
    isPremium: false,
    tags: ['castanho', 'escuro', 'natural', 'clássico'],
    compatibility: {
      harmonious: ['#1', '#4', '#6'],
      gradient: ['#4', '#6', '#8'],
      highlights: ['#6', '#8', '#16'],
      avoid: ['#613']
    },
    technicalInfo: {
      processingTime: '30-40 minutos',
      developerVolume: '20 vol',
      technicalNotes: 'Base estável para qualquer transformação',
      aftercare: ['Shampoo neutro', 'Hidratação quinzenal']
    }
  },

  {
    code: '#4',
    commercialName: 'Castanho Médio',
    technicalName: 'Medium Brown',
    description: 'Tom castanho equilibrado, versátil e natural',
    category: 'natural',
    subcategory: 'castanhos',
    undertone: 'neutral',
    level: 4,
    difficulty: 'basic',
    hexColor: '#4a3429',
    priceMultiplier: 1.0,
    isAvailable: true,
    isPremium: false,
    tags: ['castanho', 'médio', 'versátil', 'natural'],
    compatibility: {
      harmonious: ['#2', '#6', '#8'],
      gradient: ['#6', '#8', '#16'],
      highlights: ['#8', '#16', '#24'],
      avoid: ['#613']
    },
    technicalInfo: {
      processingTime: '25-35 minutos',
      developerVolume: '20 vol',
      technicalNotes: 'Excelente base para mechas e reflexos',
      aftercare: ['Shampoo neutro', 'Leave-in protetor']
    }
  },

  {
    code: '#5',
    commercialName: 'Castanho Claro Acinzentado',
    technicalName: 'Light Ash Brown',
    description: 'Castanho claro com nuances acinzentadas sofisticadas',
    category: 'natural',
    subcategory: 'castanhos',
    undertone: 'cool',
    level: 5,
    difficulty: 'intermediate',
    hexColor: '#5d4c3a',
    priceMultiplier: 1.2,
    isAvailable: true,
    isPremium: false,
    tags: ['castanho', 'claro', 'acinzentado', 'sofisticado'],
    compatibility: {
      harmonious: ['#4', '#6', '#8'],
      gradient: ['#6', '#8', '#10'],
      highlights: ['#8', '#10', '#16'],
      avoid: ['#27', '#30']
    },
    technicalInfo: {
      processingTime: '35-45 minutos',
      developerVolume: '20-30 vol',
      technicalNotes: 'Requer matização para manter o acinzentado',
      aftercare: ['Shampoo matizador', 'Tônico anti-amarelo']
    }
  },

  // ================== ESCALA LOIRA (#6-#10) ==================
  {
    code: '#6',
    commercialName: 'Loiro Escuro',
    technicalName: 'Dark Blonde',
    description: 'Loiro natural escuro, base perfeita para transformações',
    category: 'blonde',
    subcategory: 'loiros naturais',
    undertone: 'neutral',
    level: 6,
    difficulty: 'intermediate',
    hexColor: '#8b7355',
    priceMultiplier: 1.3,
    isAvailable: true,
    isPremium: false,
    tags: ['loiro', 'escuro', 'natural', 'base'],
    compatibility: {
      harmonious: ['#4', '#8', '#10'],
      gradient: ['#8', '#10', '#16'],
      highlights: ['#10', '#16', '#24'],
      avoid: ['#1', '#2']
    },
    technicalInfo: {
      processingTime: '40-50 minutos',
      developerVolume: '30 vol',
      technicalNotes: 'Requer pré-descoloração em cabelos escuros',
      aftercare: ['Shampoo matizador', 'Máscara reconstrutora']
    }
  },

  {
    code: '#8',
    commercialName: 'Loiro Claro',
    technicalName: 'Light Blonde',
    description: 'Loiro claro luminoso e natural',
    category: 'blonde',
    subcategory: 'loiros naturais',
    undertone: 'neutral',
    level: 8,
    difficulty: 'intermediate',
    hexColor: '#c4a574',
    priceMultiplier: 1.4,
    isAvailable: true,
    isPremium: false,
    tags: ['loiro', 'claro', 'luminoso', 'natural'],
    compatibility: {
      harmonious: ['#6', '#10', '#16'],
      gradient: ['#10', '#16', '#24'],
      highlights: ['#16', '#24', '#613'],
      avoid: ['#1', '#2']
    },
    technicalInfo: {
      processingTime: '45-55 minutos',
      developerVolume: '30-40 vol',
      technicalNotes: 'Necessita descoloração prévia e matização',
      aftercare: ['Shampoo matizador violeta', 'Máscara hidratante']
    }
  },

  {
    code: '#10',
    commercialName: 'Loiro Platinado',
    technicalName: 'Platinum Blonde',
    description: 'Loiro platinado ultra claro, máxima luminosidade',
    category: 'blonde',
    subcategory: 'loiros platinados',
    undertone: 'cool',
    level: 10,
    difficulty: 'premium',
    hexColor: '#f5f0e8',
    priceMultiplier: 2.0,
    isAvailable: true,
    isPremium: true,
    tags: ['platinado', 'ultra claro', 'premium', 'luminoso'],
    compatibility: {
      harmonious: ['#8', '#16', '#613'],
      gradient: ['#8', '#16', '#24'],
      highlights: ['#613', '#24'],
      avoid: ['#1', '#2', '#4']
    },
    technicalInfo: {
      processingTime: '60-90 minutos',
      developerVolume: '40 vol',
      technicalNotes: 'Requer múltiplas descolorações, processo complexo',
      aftercare: ['Shampoo matizador diário', 'Tratamento de reconstrução']
    }
  },

  // ================== CORES ESPECIAIS ==================
  {
    code: '#16',
    commercialName: 'Mel Dourado',
    technicalName: 'Honey Blonde',
    description: 'Loiro mel com reflexos dourados quentes',
    category: 'blonde',
    subcategory: 'loiros dourados',
    undertone: 'warm',
    level: 7,
    difficulty: 'advanced',
    hexColor: '#d4a574',
    priceMultiplier: 1.6,
    isAvailable: true,
    isPremium: true,
    tags: ['mel', 'dourado', 'quente', 'reflexos'],
    compatibility: {
      harmonious: ['#6', '#8', '#24'],
      gradient: ['#8', '#24', '#27'],
      highlights: ['#24', '#27', '#30'],
      avoid: ['#1', '#1B', '#613']
    },
    technicalInfo: {
      processingTime: '45-60 minutos',
      developerVolume: '30-40 vol',
      technicalNotes: 'Requer tonalizante dourado específico',
      aftercare: ['Shampoo para loiros dourados', 'Óleo nutritivo']
    }
  },

  {
    code: '#24',
    commercialName: 'Loiro Dourado Natural',
    technicalName: 'Natural Golden Blonde',
    description: 'Loiro com reflexos dourados naturais e vibrantes',
    category: 'blonde',
    subcategory: 'loiros dourados',
    undertone: 'warm',
    level: 6,
    difficulty: 'advanced',
    hexColor: '#b8935a',
    priceMultiplier: 1.5,
    isAvailable: true,
    isPremium: true,
    tags: ['dourado', 'natural', 'vibrante', 'reflexos'],
    compatibility: {
      harmonious: ['#16', '#27', '#30'],
      gradient: ['#16', '#27', '#30'],
      highlights: ['#27', '#30'],
      avoid: ['#1', '#1B', '#10']
    },
    technicalInfo: {
      processingTime: '40-55 minutos',
      developerVolume: '30 vol',
      technicalNotes: 'Tonalização dourada intensa necessária',
      aftercare: ['Shampoo dourado', 'Máscara nutritiva dourada']
    }
  },

  {
    code: '#27',
    commercialName: 'Ruivo Mel',
    technicalName: 'Strawberry Blonde',
    description: 'Tom ruivo acobreado com nuances mel',
    category: 'fashion',
    subcategory: 'ruivos',
    undertone: 'warm',
    level: 7,
    difficulty: 'premium',
    hexColor: '#d2691e',
    priceMultiplier: 1.8,
    isAvailable: true,
    isPremium: true,
    tags: ['ruivo', 'acobreado', 'mel', 'fashion'],
    compatibility: {
      harmonious: ['#16', '#24', '#30'],
      gradient: ['#24', '#30'],
      highlights: ['#24', '#30'],
      avoid: ['#1', '#1B', '#10', '#613']
    },
    technicalInfo: {
      processingTime: '50-70 minutos',
      developerVolume: '30-40 vol',
      technicalNotes: 'Cor instável, requer manutenção frequente',
      aftercare: ['Shampoo específico para ruivos', 'Protetor UV']
    }
  },

  {
    code: '#30',
    commercialName: 'Castanho Acobreado',
    technicalName: 'Auburn',
    description: 'Castanho profundo com reflexos acobreados intensos',
    category: 'natural',
    subcategory: 'castanhos especiais',
    undertone: 'warm',
    level: 4,
    difficulty: 'advanced',
    hexColor: '#8b4513',
    priceMultiplier: 1.4,
    isAvailable: true,
    isPremium: false,
    tags: ['castanho', 'acobreado', 'intenso', 'reflexos'],
    compatibility: {
      harmonious: ['#4', '#16', '#24', '#27'],
      gradient: ['#24', '#27'],
      highlights: ['#16', '#24'],
      avoid: ['#1', '#10', '#613']
    },
    technicalInfo: {
      processingTime: '40-55 minutos',
      developerVolume: '30 vol',
      technicalNotes: 'Reflexo acobreado necessita matização específica',
      aftercare: ['Shampoo para reflexos acobreados', 'Leave-in protetor']
    }
  },

  {
    code: '#613',
    commercialName: 'Loiro Ultra Claro Acinzentado',
    technicalName: 'Ultra Light Ash Blonde',
    description: 'Loiro ultra claro com nuances acinzentadas platinadas',
    category: 'blonde',
    subcategory: 'loiros platinados',
    undertone: 'cool',
    level: 10,
    difficulty: 'premium',
    hexColor: '#f8f6f0',
    priceMultiplier: 2.2,
    isAvailable: true,
    isPremium: true,
    tags: ['ultra claro', 'acinzentado', 'platinado', 'premium'],
    compatibility: {
      harmonious: ['#10', '#8'],
      gradient: ['#10', '#8'],
      highlights: ['#10'],
      avoid: ['#1', '#2', '#4', '#16', '#24', '#27', '#30']
    },
    technicalInfo: {
      processingTime: '70-100 minutos',
      developerVolume: '40 vol',
      technicalNotes: 'Processo mais complexo, múltiplas etapas',
      aftercare: ['Shampoo matizador prata', 'Tratamento reconstrutor semanal']
    }
  },

  // ================== CORES FASHION ADICIONAIS ==================
  {
    code: '#99J',
    commercialName: 'Borgonha Intenso',
    technicalName: 'Deep Burgundy',
    description: 'Tom borgonha profundo com reflexos violáceos',
    category: 'fashion',
    subcategory: 'tons escuros fashion',
    undertone: 'cool',
    level: 2,
    difficulty: 'premium',
    hexColor: '#722f37',
    priceMultiplier: 1.9,
    isAvailable: true,
    isPremium: true,
    tags: ['borgonha', 'violáceo', 'intenso', 'fashion'],
    compatibility: {
      harmonious: ['#1', '#2', '#4'],
      gradient: ['#2', '#4'],
      highlights: ['#30', '#27'],
      avoid: ['#6', '#8', '#10', '#613']
    },
    technicalInfo: {
      processingTime: '55-75 minutos',
      developerVolume: '30 vol',
      technicalNotes: 'Requer pré-descoloração para intensidade',
      aftercare: ['Shampoo para cores fantasia', 'Máscara matizadora']
    }
  },

  {
    code: '#350',
    commercialName: 'Castanho Avermelhado',
    technicalName: 'Red Brown',
    description: 'Castanho com reflexos avermelhados naturais',
    category: 'natural',
    subcategory: 'castanhos especiais',
    undertone: 'warm',
    level: 3,
    difficulty: 'intermediate',
    hexColor: '#5d2c28',
    priceMultiplier: 1.3,
    isAvailable: true,
    isPremium: false,
    tags: ['castanho', 'avermelhado', 'natural', 'reflexos'],
    compatibility: {
      harmonious: ['#2', '#4', '#30'],
      gradient: ['#4', '#30', '#27'],
      highlights: ['#16', '#24'],
      avoid: ['#10', '#613']
    },
    technicalInfo: {
      processingTime: '35-50 minutos',
      developerVolume: '20-30 vol',
      technicalNotes: 'Tom natural brasileiro, aceita bem tonalizantes',
      aftercare: ['Shampoo neutro', 'Hidratação com óleos']
    }
  },

  {
    code: '#18',
    commercialName: 'Loiro Acinzentado Médio',
    technicalName: 'Ash Blonde',
    description: 'Loiro com nuances acinzentadas sofisticadas',
    category: 'blonde',
    subcategory: 'loiros acinzentados',
    undertone: 'cool',
    level: 7,
    difficulty: 'advanced',
    hexColor: '#a8996b',
    priceMultiplier: 1.5,
    isAvailable: true,
    isPremium: false,
    tags: ['acinzentado', 'sofisticado', 'frio', 'moderno'],
    compatibility: {
      harmonious: ['#6', '#8', '#10'],
      gradient: ['#8', '#10', '#613'],
      highlights: ['#10', '#613'],
      avoid: ['#16', '#24', '#27', '#30']
    },
    technicalInfo: {
      processingTime: '45-60 minutos',
      developerVolume: '30-40 vol',
      technicalNotes: 'Requer matização constante para manter o acinzentado',
      aftercare: ['Shampoo matizador violeta', 'Tônico anti-amarelo']
    }
  }
];

// Índices para busca otimizada
export const COLOR_INDEX_BY_CODE = PROFESSIONAL_HAIR_COLORS.reduce((acc, color) => {
  acc[color.code] = color;
  return acc;
}, {} as Record<string, HairColor>);

export const COLORS_BY_CATEGORY = PROFESSIONAL_HAIR_COLORS.reduce((acc, color) => {
  if (!acc[color.category]) {
    acc[color.category] = [];
  }
  acc[color.category].push(color);
  return acc;
}, {} as Record<string, HairColor[]>);

export const COLORS_BY_LEVEL = PROFESSIONAL_HAIR_COLORS.reduce((acc, color) => {
  if (!acc[color.level]) {
    acc[color.level] = [];
  }
  acc[color.level].push(color);
  return acc;
}, {} as Record<number, HairColor[]>);

export const PREMIUM_COLORS = PROFESSIONAL_HAIR_COLORS.filter(color => color.isPremium);

export const BASIC_COLORS = PROFESSIONAL_HAIR_COLORS.filter(color => color.difficulty === 'basic');

// Metadados do sistema
export const HAIR_COLOR_SYSTEM_INFO = {
  totalColors: PROFESSIONAL_HAIR_COLORS.length,
  lastUpdated: new Date('2024-09-14'),
  version: '1.0.0',
  standard: 'International Hair Color Chart',
  categories: {
    natural: COLORS_BY_CATEGORY.natural?.length || 0,
    blonde: COLORS_BY_CATEGORY.blonde?.length || 0,
    fashion: COLORS_BY_CATEGORY.fashion?.length || 0
  },
  levels: {
    darkest: Math.min(...PROFESSIONAL_HAIR_COLORS.map(c => c.level)),
    lightest: Math.max(...PROFESSIONAL_HAIR_COLORS.map(c => c.level))
  },
  priceRange: {
    min: Math.min(...PROFESSIONAL_HAIR_COLORS.map(c => c.priceMultiplier)),
    max: Math.max(...PROFESSIONAL_HAIR_COLORS.map(c => c.priceMultiplier))
  }
};