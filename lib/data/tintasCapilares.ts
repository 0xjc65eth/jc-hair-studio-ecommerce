/**
 * Tintas Capilares Data
 * Centralized source for all hair coloring products
 * 85 produtos identificados nas imagens reais
 */

export interface TintaCapilar {
  id: string;
  nome: string;
  marca: string;
  tom?: string;
  cor: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  images: string[];
  pricing: {
    basePrice: number;
    ourPrice: number;
    discountPrice: number;
    margin: string;
    competitive: string;
  };
  badge?: string;
}

// ==================== BIOCOLOR (23 PRODUTOS) ====================

export const biocolorProducts: TintaCapilar[] = [
  {
    id: 'biocolor-1-0-preto',
    nome: 'Biocolor 1.0 Preto Super-Azulado',
    marca: 'Biocolor',
    tom: '1.0',
    cor: 'Preto Super-Azulado',
    descricao: 'Coloração permanente Biocolor com fórmula hidratante. Tom 1.0 Preto Super-Azulado, tá pronta em 20 minutos. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8733.png'],
    pricing: {
      basePrice: 42,
      ourPrice: 29,
      discountPrice: 26,
      margin: '31%',
      competitive: 'Preço acessível comparado a colorações europeias (€8-12), com fórmula de qualidade profissional.'
    },
    badge: 'COBERTURA TOTAL'
  },
  {
    id: 'biocolor-2-0-preto-azulado',
    nome: 'Biocolor 2.0 Preto Azulado Em Alta',
    marca: 'Biocolor',
    tom: '2.0',
    cor: 'Preto Azulado Em Alta',
    descricao: 'Coloração permanente com reflexos azulados. Tom 2.0 Preto Azulado Em Alta, tá pronta em 20 minutos. Mais hidratação para seu cabelo, cobertura perfeita dos fios brancos, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8757.png'],
    pricing: {
      basePrice: 42,
      ourPrice: 29,
      discountPrice: 26,
      margin: '31%',
      competitive: 'Preço acessível comparado a colorações europeias (€8-12), com fórmula de qualidade profissional.'
    },
    badge: 'REFLEXOS AZULADOS'
  },
  {
    id: 'biocolor-3-0-castanho-escuro',
    nome: 'Biocolor 3.0 Castanho Escuro Super',
    marca: 'Biocolor',
    tom: '3.0',
    cor: 'Castanho Escuro Super',
    descricao: 'Coloração permanente tom 3.0 Castanho Escuro Super. Tá pronta em 20 minutos, mais hidratação para seu cabelo. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8725.png'],
    pricing: {
      basePrice: 42,
      ourPrice: 29,
      discountPrice: 26,
      margin: '31%',
      competitive: 'Preço acessível comparado a colorações europeias (€8-12), com fórmula de qualidade profissional.'
    },
    badge: 'HIDRATANTE'
  },
  {
    id: 'biocolor-4-0-castanho-medio',
    nome: 'Biocolor 4.0 Castanho Médio Muito Brilho',
    marca: 'Biocolor',
    tom: '4.0',
    cor: 'Castanho Médio Muito Brilho',
    descricao: 'Coloração permanente tom 4.0 Castanho Médio Muito Brilho. Tá pronta em 20 minutos, mais hidratação. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8777.png'],
    pricing: {
      basePrice: 43,
      ourPrice: 30,
      discountPrice: 27,
      margin: '30%',
      competitive: 'Preço acessível comparado a colorações europeias (€8-12), com fórmula de qualidade profissional.'
    },
    badge: 'NUTRITIVA'
  },
  {
    id: 'biocolor-4-5-castanho-acaju',
    nome: 'Biocolor 4.5 Acaju Escuro Poderoso',
    marca: 'Biocolor',
    tom: '4.5',
    cor: 'Acaju Escuro Poderoso',
    descricao: 'Coloração permanente tom 4.5 Acaju Escuro Poderoso. Tá pronta em 20 minutos, mais hidratação. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8903.png'],
    pricing: {
      basePrice: 43,
      ourPrice: 30,
      discountPrice: 27,
      margin: '30%',
      competitive: 'Preço acessível comparado a colorações europeias (€8-12), com fórmula de qualidade profissional.'
    },
    badge: 'REFLEXOS ACAJU'
  },
  {
    id: 'biocolor-4-7-castanho-marrom',
    nome: 'Biocolor 4.7 Marrom Escuro De Moda',
    marca: 'Biocolor',
    tom: '4.7',
    cor: 'Marrom Escuro De Moda',
    descricao: 'Coloração permanente tom 4.7 Marrom Escuro De Moda. Tá pronta em 20 minutos, mais hidratação. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8875.png'],
    pricing: {
      basePrice: 43,
      ourPrice: 30,
      discountPrice: 27,
      margin: '30%',
      competitive: 'Preço acessível comparado a colorações europeias (€8-12), com fórmula de qualidade profissional.'
    },
    badge: 'TOM QUENTE'
  },
  {
    id: 'biocolor-5-0-castanho-claro',
    nome: 'Biocolor 5.0 Castanho Claro Luxuoso',
    marca: 'Biocolor',
    tom: '5.0',
    cor: 'Castanho Claro Luxuoso',
    descricao: 'Coloração permanente tom 5.0 Castanho Claro Luxuoso. Tá pronta em 20 minutos, mais hidratação. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8780.png'],
    pricing: {
      basePrice: 43,
      ourPrice: 30,
      discountPrice: 27,
      margin: '30%',
      competitive: 'Preço acessível comparado a colorações europeias (€8-12), com fórmula de qualidade profissional.'
    },
    badge: 'HIDRATANTE'
  },
  {
    id: 'biocolor-5-1-castanho-claro-cinza',
    nome: 'Biocolor 5.1 Castanho Cinza Chic',
    marca: 'Biocolor',
    tom: '5.1',
    cor: 'Castanho Cinza Chic',
    descricao: 'Coloração permanente tom 5.1 Castanho Cinza Chic. Tá pronta em 20 minutos, mais hidratação. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-9055.png'],
    pricing: {
      basePrice: 43,
      ourPrice: 30,
      discountPrice: 27,
      margin: '30%',
      competitive: 'Preço acessível comparado a colorações europeias (€8-12), com fórmula de qualidade profissional.'
    },
    badge: 'TOM MODERNO'
  },
  {
    id: 'biocolor-5-3-castanho-claro-dourado',
    nome: 'Biocolor 5.3 Castanho Claro Dourado Super',
    marca: 'Biocolor',
    tom: '5.3',
    cor: 'Castanho Claro Dourado Super',
    descricao: 'Coloração permanente tom 5.3 Castanho Claro Dourado Super. Tá pronta em 20 minutos, mais hidratação. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-9020.png'],
    pricing: {
      basePrice: 43,
      ourPrice: 30,
      discountPrice: 27,
      margin: '30%',
      competitive: 'Preço acessível comparado a colorações europeias (€8-12), com fórmula de qualidade profissional.'
    },
    badge: 'LUMINOSO'
  },
  {
    id: 'biocolor-5-59-castanho-claro-acaju',
    nome: 'Biocolor 5.59 Acaju Púrpura Intensíssimo',
    marca: 'Biocolor',
    tom: '5.59',
    cor: 'Acaju Púrpura Intensíssimo',
    descricao: 'Coloração permanente tom 5.59 Acaju Púrpura Intensíssimo. Tá pronta em 20 minutos, mais hidratação. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8904.png'],
    pricing: {
      basePrice: 43,
      ourPrice: 30,
      discountPrice: 27,
      margin: '30%',
      competitive: 'Preço acessível comparado a colorações europeias (€8-12), com fórmula de qualidade profissional.'
    },
    badge: 'ACAJU INTENSO'
  },
  {
    id: 'biocolor-6-0-louro-escuro',
    nome: 'Biocolor 6.0 Louro Escuro Chique',
    marca: 'Biocolor',
    tom: '6.0',
    cor: 'Louro Escuro Chique',
    descricao: 'Coloração permanente Biocolor com fórmula hidratante. Tom 6.0 Louro Escuro Chique, tá pronta em 20 minutos. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8766.png'],
    pricing: {
      basePrice: 44,
      ourPrice: 31,
      discountPrice: 28,
      margin: '30%',
      competitive: 'Excelente custo-benefício frente a colorações europeias (€8-12), ideal para tons louros.'
    },
    badge: 'NUTRITIVA'
  },
  {
    id: 'biocolor-6-1-louro-escuro-cinza',
    nome: 'Biocolor 6.1 Louro Cinza Escuro Moderno',
    marca: 'Biocolor',
    tom: '6.1',
    cor: 'Louro Cinza Escuro Moderno',
    descricao: 'Coloração permanente Biocolor com reflexos cinza. Tom 6.1 Louro Cinza Escuro Moderno, tá pronta em 20 minutos. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8845.png'],
    pricing: {
      basePrice: 44,
      ourPrice: 31,
      discountPrice: 28,
      margin: '30%',
      competitive: 'Excelente custo-benefício frente a colorações europeias (€8-12), ideal para tons louros.'
    },
    badge: 'TOM FRIO'
  },
  {
    id: 'biocolor-6-66-vermelho-cereja',
    nome: 'Biocolor 6.66 Vermelho Intenso É Arraso',
    marca: 'Biocolor',
    tom: '6.66',
    cor: 'Vermelho Intenso É Arraso',
    descricao: 'Coloração permanente Biocolor vermelho vibrante. Tom 6.66 Vermelho Intenso É Arraso, tá pronta em 20 minutos. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8829.png'],
    pricing: {
      basePrice: 44,
      ourPrice: 31,
      discountPrice: 28,
      margin: '30%',
      competitive: 'Excelente custo-benefício frente a colorações europeias (€8-12), ideal para tons louros.'
    },
    badge: 'VERMELHO INTENSO'
  },
  {
    id: 'biocolor-6-7-chocolate',
    nome: 'Biocolor 6.7 Chocolate Para Brilhar',
    marca: 'Biocolor',
    tom: '6.7',
    cor: 'Chocolate Para Brilhar',
    descricao: 'Coloração permanente Biocolor tom chocolate. Tom 6.7 Chocolate Para Brilhar, tá pronta em 20 minutos. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8819.png'],
    pricing: {
      basePrice: 44,
      ourPrice: 31,
      discountPrice: 28,
      margin: '30%',
      competitive: 'Excelente custo-benefício frente a colorações europeias (€8-12), ideal para tons louros.'
    },
    badge: 'CHOCOLATE'
  },
  {
    id: 'biocolor-7-0-louro-medio',
    nome: 'Biocolor 7.0 Louro Médio Divino',
    marca: 'Biocolor',
    tom: '7.0',
    cor: 'Louro Médio Divino',
    descricao: 'Coloração permanente Biocolor louro médio. Tom 7.0 Louro Médio Divino, tá pronta em 20 minutos. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8853.png'],
    pricing: {
      basePrice: 44,
      ourPrice: 31,
      discountPrice: 28,
      margin: '30%',
      competitive: 'Excelente custo-benefício frente a colorações europeias (€8-12), ideal para tons louros.'
    },
    badge: 'BRILHO RADIANTE'
  },
  {
    id: 'biocolor-7-1-louro-medio-cinza',
    nome: 'Biocolor 7.1 Louro Cinza Médio É Poderoso',
    marca: 'Biocolor',
    tom: '7.1',
    cor: 'Louro Cinza Médio É Poderoso',
    descricao: 'Coloração permanente Biocolor com reflexos cinza. Tom 7.1 Louro Cinza Médio É Poderoso, tá pronta em 20 minutos. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8855.png'],
    pricing: {
      basePrice: 44,
      ourPrice: 31,
      discountPrice: 28,
      margin: '30%',
      competitive: 'Excelente custo-benefício frente a colorações europeias (€8-12), ideal para tons louros.'
    },
    badge: 'PLATINADO'
  },
  {
    id: 'biocolor-7-3-louro-medio-dourado',
    nome: 'Biocolor 7.3 Louro Dourado Super De Brilho',
    marca: 'Biocolor',
    tom: '7.3',
    cor: 'Louro Dourado Super De Brilho',
    descricao: 'Coloração permanente Biocolor com reflexos dourados. Tom 7.3 Louro Dourado Super De Brilho, tá pronta em 20 minutos. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8831.png'],
    pricing: {
      basePrice: 44,
      ourPrice: 31,
      discountPrice: 28,
      margin: '30%',
      competitive: 'Excelente custo-benefício frente a colorações europeias (€8-12), ideal para tons louros.'
    },
    badge: 'DOURADO'
  },
  {
    id: 'biocolor-7-44-cobre-intenso',
    nome: 'Biocolor 7.44 Cobre Intenso Fabuloso',
    marca: 'Biocolor',
    tom: '7.44',
    cor: 'Cobre Intenso Fabuloso',
    descricao: 'Coloração permanente Biocolor cobre. Tom 7.44 Cobre Intenso Fabuloso, tá pronta em 20 minutos. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8830.png'],
    pricing: {
      basePrice: 44,
      ourPrice: 31,
      discountPrice: 28,
      margin: '30%',
      competitive: 'Excelente custo-benefício frente a colorações europeias (€8-12), ideal para tons louros.'
    },
    badge: 'COBRE INTENSO'
  },
  {
    id: 'biocolor-8-0-louro-claro',
    nome: 'Biocolor 8.0 Louro Claro Tá Com Tudo',
    marca: 'Biocolor',
    tom: '8.0',
    cor: 'Louro Claro Tá Com Tudo',
    descricao: 'Coloração permanente Biocolor louro claro. Tom 8.0 Louro Claro Tá Com Tudo, tá pronta em 20 minutos. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8883.png'],
    pricing: {
      basePrice: 45,
      ourPrice: 32,
      discountPrice: 29,
      margin: '29%',
      competitive: 'Excelente custo-benefício frente a colorações europeias (€8-12), ideal para tons louros.'
    },
    badge: 'ILUMINADO'
  },
  {
    id: 'biocolor-8-1-louro-claro-cinza',
    nome: 'Biocolor 8.1 Louro Cinza Claro Brilho',
    marca: 'Biocolor',
    tom: '8.1',
    cor: 'Louro Cinza Claro Brilho',
    descricao: 'Coloração permanente Biocolor com reflexos cinza. Tom 8.1 Louro Cinza Claro Brilho, tá pronta em 20 minutos. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8820.png'],
    pricing: {
      basePrice: 45,
      ourPrice: 32,
      discountPrice: 29,
      margin: '29%',
      competitive: 'Excelente custo-benefício frente a colorações europeias (€8-12), ideal para tons louros.'
    },
    badge: 'CINZA PLATINADO'
  },
  {
    id: 'biocolor-9-0-louro-muito-claro',
    nome: 'Biocolor 9.0 Louro Superclaro É Lindo Já',
    marca: 'Biocolor',
    tom: '9.0',
    cor: 'Louro Superclaro É Lindo Já',
    descricao: 'Coloração permanente Biocolor louro superclaro. Tom 9.0 Louro Superclaro É Lindo Já, tá pronta em 20 minutos. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8882.png'],
    pricing: {
      basePrice: 45,
      ourPrice: 32,
      discountPrice: 29,
      margin: '29%',
      competitive: 'Excelente custo-benefício frente a colorações europeias (€8-12), ideal para tons louros.'
    },
    badge: 'SUPER CLARO'
  },
  {
    id: 'biocolor-10-0-louro-clarissimo',
    nome: 'Biocolor 10.0 Louro Ultraclaro Sensacional',
    marca: 'Biocolor',
    tom: '10.0',
    cor: 'Louro Ultraclaro Sensacional',
    descricao: 'Coloração permanente Biocolor louro ultraclaro. Tom 10.0 Louro Ultraclaro Sensacional, tá pronta em 20 minutos. Cobertura perfeita dos fios brancos, proteção total da cor, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-permanente',
    images: ['/images/products/produtos_diversos/IMG-8858.png'],
    pricing: {
      basePrice: 45,
      ourPrice: 32,
      discountPrice: 29,
      margin: '29%',
      competitive: 'Excelente custo-benefício frente a colorações europeias (€8-12), ideal para tons louros.'
    },
    badge: 'ULTRA CLARO'
  },
  {
    id: 'biocolor-12-11-super-clareador',
    nome: 'Biocolor 12.11 Louríssimo Platinado De Arrasar',
    marca: 'Biocolor',
    tom: '12.11',
    cor: 'Louríssimo Platinado De Arrasar',
    descricao: 'Super clareador permanente Biocolor. Tom 12.11 Louríssimo Platinado De Arrasar, tá pronto em 20 minutos. Clareia até 7 tons com resultado ultra platinado, cobertura perfeita dos fios brancos, com silicone, proteína e filtro UV.',
    categoria: 'tintas-capilares',
    subcategoria: 'super-clareador',
    images: ['/images/products/produtos_diversos/IMG-9023.png'],
    pricing: {
      basePrice: 45,
      ourPrice: 32,
      discountPrice: 29,
      margin: '29%',
      competitive: 'Excelente custo-benefício frente a colorações europeias (€8-12), ideal para tons louros.'
    },
    badge: 'SUPER CLAREADOR'
  }
];

// ==================== WELLA KOLESTON (11 PRODUTOS) ====================

export const wellaKolestonProducts: TintaCapilar[] = [
  {
    id: 'wella-koleston-20-preto-azulado',
    nome: 'Wella Koleston 20 Preto Azulado',
    marca: 'Wella Koleston',
    tom: '20',
    cor: 'Preto Azulado',
    descricao: 'Coloração permanente profissional Wella Koleston. Tom 20 preto com reflexos azulados intensos, tecnologia ME+ para máxima proteção.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8739.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 45,
      discountPrice: 41,
      margin: '31%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), tecnologia ME+.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'wella-koleston-30-castanho-escuro',
    nome: 'Wella Koleston 30 Castanho Escuro',
    marca: 'Wella Koleston',
    tom: '30',
    cor: 'Castanho Escuro',
    descricao: 'Coloração permanente profissional com tecnologia ME+. Tom 30 castanho escuro natural com cobertura total de brancos.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8759.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 45,
      discountPrice: 41,
      margin: '31%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), tecnologia ME+.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'wella-koleston-60-louro-escuro',
    nome: 'Wella Koleston 60 Louro Escuro',
    marca: 'Wella Koleston',
    tom: '60',
    cor: 'Louro Escuro Chique',
    descricao: 'Coloração permanente profissional Wella Koleston. Tom 60 louro escuro natural com brilho intenso e duradouro.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8720.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 45,
      discountPrice: 41,
      margin: '31%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), tecnologia ME+.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'wella-koleston-71-louro-medio-cinza',
    nome: 'Wella Koleston 71 Louro Médio Acinzentado',
    marca: 'Wella Koleston',
    tom: '71',
    cor: 'Louro Cinza Médio É Poderoso',
    descricao: 'Coloração permanente profissional com reflexos cinza. Tom 71 louro médio acinzentado moderno e sofisticado.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8774.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 45,
      discountPrice: 41,
      margin: '31%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), tecnologia ME+.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'wella-koleston-73-louro-medio-dourado',
    nome: 'Wella Koleston 73 Louro Médio Dourado',
    marca: 'Wella Koleston',
    tom: '73',
    cor: 'Louro Dourado Super De Brilho',
    descricao: 'Coloração permanente profissional com reflexos dourados. Tom 73 louro médio dourado luminoso e radiante.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8741.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 45,
      discountPrice: 41,
      margin: '31%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), tecnologia ME+.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'wella-koleston-77-louro-medio-intenso',
    nome: 'Wella Koleston 77 Louro Médio Intenso',
    marca: 'Wella Koleston',
    tom: '77',
    cor: 'Louro Médio Intenso',
    descricao: 'Coloração permanente profissional Wella Koleston. Tom 77 louro médio marrom intenso com reflexos quentes.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8713.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 45,
      discountPrice: 41,
      margin: '31%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), tecnologia ME+.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'wella-koleston-121-louro-especial-cinza',
    nome: 'Wella Koleston 121 Louro Especial Acinzentado',
    marca: 'Wella Koleston',
    tom: '121',
    cor: 'Louro Especial Acinzentado',
    descricao: 'Coloração permanente profissional louro especial. Tom 121 louro acinzentado extra claro com tecnologia ME+.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8764.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 45,
      discountPrice: 41,
      margin: '31%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), tecnologia ME+.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'wella-koleston-5546-amora',
    nome: 'Wella Koleston 5546 Amora',
    marca: 'Wella Koleston',
    tom: '5546',
    cor: 'Amora',
    descricao: 'Coloração permanente profissional tom amora. Reflexos vermelho-violeta vibrantes e duradouros com máximo brilho.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8770.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 45,
      discountPrice: 41,
      margin: '31%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), tecnologia ME+.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'wella-koleston-6646-cereja',
    nome: 'Wella Koleston 6646 Cereja',
    marca: 'Wella Koleston',
    tom: '6646',
    cor: 'Cereja',
    descricao: 'Coloração permanente profissional tom cereja. Vermelho vibrante com reflexos intensos e cobertura total.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8761.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 45,
      discountPrice: 41,
      margin: '31%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), tecnologia ME+.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'wella-koleston-7744-cobre-intenso',
    nome: 'Wella Koleston 7744 Cobre Intenso',
    marca: 'Wella Koleston',
    tom: '7744',
    cor: 'Cobre Intenso Fabuloso',
    descricao: 'Coloração permanente profissional cobre. Tom 7744 louro médio cobre intenso com reflexos acobreados vibrantes.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8778.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 45,
      discountPrice: 41,
      margin: '31%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), tecnologia ME+.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'wella-soft-color-535-chocolate-dourado-extra',
    nome: 'Wella Soft Color 535 Chocolate Dourado',
    marca: 'Wella Koleston',
    tom: '535',
    cor: 'Chocolate Dourado Especial',
    descricao: 'Coloração permanente profissional Wella Koleston. Tom 535 chocolate dourado com tecnologia ME+ e reflexos quentes.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8767.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 45,
      discountPrice: 41,
      margin: '31%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), tecnologia ME+.'
    },
    badge: 'PROFISSIONAL'
  }
];

// ==================== WELLA SOFT COLOR (6 PRODUTOS) ====================

export const wellaSoftColorProducts: TintaCapilar[] = [
  {
    id: 'wella-soft-color-20-preto',
    nome: 'Wella Soft Color 20 Preto',
    marca: 'Wella Soft Color',
    tom: '20',
    cor: 'Preto',
    descricao: 'Coloração sem amônia Wella Soft Color. Tom 20 preto intenso com fórmula suave e nutritiva, sem agressão aos fios.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-sem-amonia',
    images: ['/images/products/produtos_diversos/IMG-8716.png'],
    pricing: {
      basePrice: 52,
      ourPrice: 37,
      discountPrice: 34,
      margin: '29%',
      competitive: 'Excelente valor comparado a colorações sem amônia europeias (€6-10), fórmula suave.'
    },
    badge: 'SEM AMÔNIA'
  },
  {
    id: 'wella-soft-color-40-castanho-medio',
    nome: 'Wella Soft Color 40 Castanho Médio',
    marca: 'Wella Soft Color',
    tom: '40',
    cor: 'Castanho Médio',
    descricao: 'Coloração sem amônia Wella Soft Color. Tom 40 castanho médio natural com fórmula enriquecida com óleo de semente de uva.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-sem-amonia',
    images: ['/images/products/produtos_diversos/IMG-8727.png'],
    pricing: {
      basePrice: 52,
      ourPrice: 37,
      discountPrice: 34,
      margin: '29%',
      competitive: 'Excelente valor comparado a colorações sem amônia europeias (€6-10), fórmula suave.'
    },
    badge: 'SEM AMÔNIA'
  },
  {
    id: 'wella-soft-color-50-castanho-claro',
    nome: 'Wella Soft Color 50 Castanho Claro',
    marca: 'Wella Soft Color',
    tom: '50',
    cor: 'Castanho Claro',
    descricao: 'Coloração sem amônia Wella Soft Color. Tom 50 castanho claro suave com fórmula hidratante e perfumada.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-sem-amonia',
    images: ['/images/products/produtos_diversos/IMG-8718.png'],
    pricing: {
      basePrice: 52,
      ourPrice: 37,
      discountPrice: 34,
      margin: '29%',
      competitive: 'Excelente valor comparado a colorações sem amônia europeias (€6-10), fórmula suave.'
    },
    badge: 'SEM AMÔNIA'
  },
  {
    id: 'wella-soft-color-54-castanho-claro-acobreado',
    nome: 'Wella Soft Color 54 Castanho Claro Acobreado',
    marca: 'Wella Soft Color',
    tom: '54',
    cor: 'Castanho Claro Acobreado',
    descricao: 'Coloração sem amônia com reflexos acobreados. Tom 54 castanho claro acobreado quente e luminoso.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-sem-amonia',
    images: ['/images/products/produtos_diversos/IMG-8752.png'],
    pricing: {
      basePrice: 52,
      ourPrice: 37,
      discountPrice: 34,
      margin: '29%',
      competitive: 'Excelente valor comparado a colorações sem amônia europeias (€6-10), fórmula suave.'
    },
    badge: 'SEM AMÔNIA'
  },
  {
    id: 'wella-soft-color-415-vermelho-amora',
    nome: 'Wella Soft Color 415 Vermelho Amora',
    marca: 'Wella Soft Color',
    tom: '415',
    cor: 'Vermelho Amora',
    descricao: 'Coloração sem amônia tom vermelho amora. Reflexos vermelho-violeta vibrantes com fórmula suave e nutritiva.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-sem-amonia',
    images: ['/images/products/produtos_diversos/IMG-8768.png'],
    pricing: {
      basePrice: 52,
      ourPrice: 37,
      discountPrice: 34,
      margin: '29%',
      competitive: 'Excelente valor comparado a colorações sem amônia europeias (€6-10), fórmula suave.'
    },
    badge: 'SEM AMÔNIA'
  },
  {
    id: 'wella-soft-color-535-chocolate-dourado',
    nome: 'Wella Soft Color 535 Chocolate Dourado',
    marca: 'Wella Soft Color',
    tom: '535',
    cor: 'Chocolate Dourado',
    descricao: 'Coloração sem amônia chocolate dourado. Tom quente com reflexos dourados e fórmula nutritiva.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-sem-amonia',
    images: ['/images/products/produtos_diversos/IMG-8767.png'],
    pricing: {
      basePrice: 52,
      ourPrice: 37,
      discountPrice: 34,
      margin: '29%',
      competitive: 'Excelente valor comparado a colorações sem amônia europeias (€6-10), fórmula suave.'
    },
    badge: 'SEM AMÔNIA'
  }
];

// ==================== ALFAPARF ALTA MODA (36 PRODUTOS) ====================

export const alfaparfAltaModaProducts: TintaCapilar[] = [
  {
    id: 'alfaparf-1-0-preto',
    nome: 'Alfaparf Alta Moda 1.0 Preto',
    marca: 'Alfaparf Alta Moda',
    tom: '1.0',
    cor: 'Preto',
    descricao: 'Coloração permanente profissional italiana Alfaparf. Tom 1.0 preto profundo com tecnologia micro pigmentos para cobertura total.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8810.png'],
    pricing: {
      basePrice: 78,
      ourPrice: 55,
      discountPrice: 49,
      margin: '29%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-1-0-vegano',
    nome: 'Alfaparf Alta Moda 1.0 Preto Vegano',
    marca: 'Alfaparf Alta Moda',
    tom: '1.0',
    cor: 'Preto Vegano',
    descricao: 'Coloração vegana profissional Alfaparf. Tom 1.0 preto com fórmula 100% vegana, sem ingredientes de origem animal.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-vegana',
    images: ['/images/products/produtos_diversos/IMG-8977.png'],
    pricing: {
      basePrice: 85,
      ourPrice: 62,
      discountPrice: 57,
      margin: '27%',
      competitive: 'Linha vegana premium com preço competitivo frente a colorações italianas veganas (€12-18).'
    },
    badge: 'VEGANA'
  },
  {
    id: 'alfaparf-1-11-preto-azulado',
    nome: 'Alfaparf Alta Moda 1.11 Preto Azulado Intenso',
    marca: 'Alfaparf Alta Moda',
    tom: '1.11',
    cor: 'Preto Azulado Intenso',
    descricao: 'Coloração permanente profissional com reflexos azulados intensos. Tom 1.11 preto azulado vibrante.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-9032.png'],
    pricing: {
      basePrice: 78,
      ourPrice: 55,
      discountPrice: 49,
      margin: '29%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-3-0-castanho-escuro',
    nome: 'Alfaparf Alta Moda 3.0 Castanho Escuro',
    marca: 'Alfaparf Alta Moda',
    tom: '3.0',
    cor: 'Castanho Escuro',
    descricao: 'Coloração permanente profissional Alfaparf. Tom 3.0 castanho escuro natural com brilho intenso e duradouro.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8898.png'],
    pricing: {
      basePrice: 78,
      ourPrice: 55,
      discountPrice: 49,
      margin: '29%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-3-0-vegano',
    nome: 'Alfaparf Alta Moda 3.0 Castanho Escuro Vegano',
    marca: 'Alfaparf Alta Moda',
    tom: '3.0',
    cor: 'Castanho Escuro Vegano',
    descricao: 'Coloração vegana profissional Alfaparf. Tom 3.0 castanho escuro com fórmula 100% vegana e sustentável.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-vegana',
    images: ['/images/products/produtos_diversos/IMG-8986.png'],
    pricing: {
      basePrice: 85,
      ourPrice: 62,
      discountPrice: 57,
      margin: '27%',
      competitive: 'Linha vegana premium com preço competitivo frente a colorações italianas veganas (€12-18).'
    },
    badge: 'VEGANA'
  },
  {
    id: 'alfaparf-4-0-castanho-medio',
    nome: 'Alfaparf Alta Moda 4.0 Castanho Médio',
    marca: 'Alfaparf Alta Moda',
    tom: '4.0',
    cor: 'Castanho Médio',
    descricao: 'Coloração permanente profissional italiana. Tom 4.0 castanho médio natural com tecnologia de micro pigmentos.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8846.png'],
    pricing: {
      basePrice: 78,
      ourPrice: 55,
      discountPrice: 49,
      margin: '29%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-5-0-castanho-claro',
    nome: 'Alfaparf Alta Moda 5.0 Castanho Claro',
    marca: 'Alfaparf Alta Moda',
    tom: '5.0',
    cor: 'Castanho Claro',
    descricao: 'Coloração permanente profissional Alfaparf. Tom 5.0 castanho claro suave com cobertura perfeita de brancos.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8885.png'],
    pricing: {
      basePrice: 78,
      ourPrice: 55,
      discountPrice: 49,
      margin: '29%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-5-0-vegano',
    nome: 'Alfaparf Alta Moda 5.0 Castanho Claro Vegano',
    marca: 'Alfaparf Alta Moda',
    tom: '5.0',
    cor: 'Castanho Claro Vegano',
    descricao: 'Coloração vegana profissional Alfaparf. Tom 5.0 castanho claro com fórmula 100% vegana livre de crueldade.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-vegana',
    images: ['/images/products/produtos_diversos/IMG-8985.png'],
    pricing: {
      basePrice: 85,
      ourPrice: 62,
      discountPrice: 57,
      margin: '27%',
      competitive: 'Linha vegana premium com preço competitivo frente a colorações italianas veganas (€12-18).'
    },
    badge: 'VEGANA'
  },
  {
    id: 'alfaparf-5-64-vegano',
    nome: 'Alfaparf Alta Moda 5.64 Castanho Claro Vermelho Acobreado Vegano',
    marca: 'Alfaparf Alta Moda',
    tom: '5.64',
    cor: 'Castanho Claro Vermelho Acobreado Vegano',
    descricao: 'Coloração vegana com reflexos vermelho-acobreados. Fórmula 100% vegana com cor vibrante e duradoura.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-vegana',
    images: ['/images/products/produtos_diversos/IMG-8987.png'],
    pricing: {
      basePrice: 85,
      ourPrice: 62,
      discountPrice: 57,
      margin: '27%',
      competitive: 'Linha vegana premium com preço competitivo frente a colorações italianas veganas (€12-18).'
    },
    badge: 'VEGANA'
  },
  {
    id: 'alfaparf-5-65-castanho-claro-vermelho-acaju',
    nome: 'Alfaparf Alta Moda 5.65 Castanho Claro Vermelho Acaju',
    marca: 'Alfaparf Alta Moda',
    tom: '5.65',
    cor: 'Castanho Claro Vermelho Acaju',
    descricao: 'Coloração permanente profissional com reflexos acaju. Tom 5.65 castanho claro vermelho acaju vibrante.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8880.png'],
    pricing: {
      basePrice: 78,
      ourPrice: 55,
      discountPrice: 49,
      margin: '29%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-5-7-castanho-claro-marrom',
    nome: 'Alfaparf Alta Moda 5.7 Castanho Claro Marrom',
    marca: 'Alfaparf Alta Moda',
    tom: '5.7',
    cor: 'Castanho Claro Marrom',
    descricao: 'Coloração permanente profissional com reflexos marrom. Tom 5.7 castanho claro marrom quente e natural.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8861.png'],
    pricing: {
      basePrice: 78,
      ourPrice: 55,
      discountPrice: 49,
      margin: '29%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-6-0-louro-escuro',
    nome: 'Alfaparf Alta Moda 6.0 Louro Escuro',
    marca: 'Alfaparf Alta Moda',
    tom: '6.0',
    cor: 'Louro Escuro Chique',
    descricao: 'Coloração permanente profissional Alfaparf. Tom 6.0 louro escuro natural com brilho intenso italiano.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8862.png'],
    pricing: {
      basePrice: 80,
      ourPrice: 56,
      discountPrice: 50,
      margin: '30%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-6-1-louro-escuro-cinza',
    nome: 'Alfaparf Alta Moda 6.1 Louro Escuro Acinzentado',
    marca: 'Alfaparf Alta Moda',
    tom: '6.1',
    cor: 'Louro Cinza Escuro Moderno',
    descricao: 'Coloração permanente profissional com reflexos cinza. Tom 6.1 louro escuro acinzentado moderno.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8852.png'],
    pricing: {
      basePrice: 80,
      ourPrice: 56,
      discountPrice: 50,
      margin: '30%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-6-35-louro-escuro-dourado-acaju',
    nome: 'Alfaparf Alta Moda 6.35 Louro Escuro Dourado Acaju',
    marca: 'Alfaparf Alta Moda',
    tom: '6.35',
    cor: 'Louro Escuro Dourado Acaju',
    descricao: 'Coloração permanente profissional com reflexos dourado-acaju. Tom 6.35 louro escuro dourado acaju vibrante.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8869.png'],
    pricing: {
      basePrice: 80,
      ourPrice: 56,
      discountPrice: 50,
      margin: '30%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-6-66-vermelho-intenso',
    nome: 'Alfaparf Alta Moda 6.66 Vermelho Intenso',
    marca: 'Alfaparf Alta Moda',
    tom: '6.66',
    cor: 'Vermelho Intenso',
    descricao: 'Coloração permanente profissional vermelho intenso. Tom 6.66 louro escuro vermelho ultra vibrante.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8872.png'],
    pricing: {
      basePrice: 80,
      ourPrice: 56,
      discountPrice: 50,
      margin: '30%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-6-7-chocolate',
    nome: 'Alfaparf Alta Moda 6.7 Chocolate',
    marca: 'Alfaparf Alta Moda',
    tom: '6.7',
    cor: 'Chocolate Para Brilhar',
    descricao: 'Coloração permanente profissional tom chocolate. Tom 6.7 louro escuro marrom chocolate rico e intenso.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8769.png'],
    pricing: {
      basePrice: 80,
      ourPrice: 56,
      discountPrice: 50,
      margin: '30%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-7-0-louro-medio',
    nome: 'Alfaparf Alta Moda 7.0 Louro Médio',
    marca: 'Alfaparf Alta Moda',
    tom: '7.0',
    cor: 'Louro Médio Divino',
    descricao: 'Coloração permanente profissional Alfaparf. Tom 7.0 louro médio natural com tecnologia italiana de brilho.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8800.png'],
    pricing: {
      basePrice: 80,
      ourPrice: 56,
      discountPrice: 50,
      margin: '30%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-7-0-vegano',
    nome: 'Alfaparf Alta Moda 7.0 Louro Médio Vegano',
    marca: 'Alfaparf Alta Moda',
    tom: '7.0',
    cor: 'Louro Médio Vegano',
    descricao: 'Coloração vegana profissional Alfaparf. Tom 7.0 louro médio com fórmula 100% vegana e sustentável.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-vegana',
    images: ['/images/products/produtos_diversos/IMG-8966.png'],
    pricing: {
      basePrice: 85,
      ourPrice: 62,
      discountPrice: 57,
      margin: '27%',
      competitive: 'Linha vegana premium com preço competitivo frente a colorações italianas veganas (€12-18).'
    },
    badge: 'VEGANA'
  },
  {
    id: 'alfaparf-7-1-louro-medio-cinza',
    nome: 'Alfaparf Alta Moda 7.1 Louro Médio Acinzentado',
    marca: 'Alfaparf Alta Moda',
    tom: '7.1',
    cor: 'Louro Cinza Médio É Poderoso',
    descricao: 'Coloração permanente profissional com reflexos cinza. Tom 7.1 louro médio acinzentado platinado.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8868.png'],
    pricing: {
      basePrice: 80,
      ourPrice: 56,
      discountPrice: 50,
      margin: '30%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-7-4-louro-medio-cobre',
    nome: 'Alfaparf Alta Moda 7.4 Louro Médio Cobre',
    marca: 'Alfaparf Alta Moda',
    tom: '7.4',
    cor: 'Louro Médio Cobre',
    descricao: 'Coloração permanente profissional com reflexos cobre. Tom 7.4 louro médio cobre vibrante e luminoso.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8826.png'],
    pricing: {
      basePrice: 80,
      ourPrice: 56,
      discountPrice: 50,
      margin: '30%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-7-52-louro-medio-acaju-irise',
    nome: 'Alfaparf Alta Moda 7.52 Louro Médio Acaju Irisé',
    marca: 'Alfaparf Alta Moda',
    tom: '7.52',
    cor: 'Louro Médio Acaju Irisé',
    descricao: 'Coloração permanente profissional com reflexos acaju irisé. Tom 7.52 louro médio acaju irisé exclusivo.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8857.png'],
    pricing: {
      basePrice: 80,
      ourPrice: 56,
      discountPrice: 50,
      margin: '30%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-7-7-louro-medio-marrom',
    nome: 'Alfaparf Alta Moda 7.7 Louro Médio Marrom',
    marca: 'Alfaparf Alta Moda',
    tom: '7.7',
    cor: 'Louro Médio Marrom',
    descricao: 'Coloração permanente profissional com reflexos marrom. Tom 7.7 louro médio marrom quente e natural.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-9043.png'],
    pricing: {
      basePrice: 80,
      ourPrice: 56,
      discountPrice: 50,
      margin: '30%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-8-1-louro-claro-cinza',
    nome: 'Alfaparf Alta Moda 8.1 Louro Claro Acinzentado',
    marca: 'Alfaparf Alta Moda',
    tom: '8.1',
    cor: 'Louro Cinza Claro Brilho',
    descricao: 'Coloração permanente profissional com reflexos cinza platinado. Tom 8.1 louro claro acinzentado moderno.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-9053.png'],
    pricing: {
      basePrice: 82,
      ourPrice: 58,
      discountPrice: 52,
      margin: '29%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-8-21-louro-claro-irise-cinza',
    nome: 'Alfaparf Alta Moda 8.21 Louro Claro Irisé Acinzentado',
    marca: 'Alfaparf Alta Moda',
    tom: '8.21',
    cor: 'Louro Claro Irisé Acinzentado',
    descricao: 'Coloração permanente profissional com reflexos irisé-acinzentados. Tom 8.21 louro claro irisé acinzentado exclusivo.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-9008.png'],
    pricing: {
      basePrice: 82,
      ourPrice: 58,
      discountPrice: 52,
      margin: '29%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-9-0-louro-muito-claro',
    nome: 'Alfaparf Alta Moda 9.0 Louro Muito Claro',
    marca: 'Alfaparf Alta Moda',
    tom: '9.0',
    cor: 'Louro Superclaro É Lindo Já',
    descricao: 'Coloração permanente profissional Alfaparf. Tom 9.0 louro muito claro com máxima luminosidade italiana.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8832.png'],
    pricing: {
      basePrice: 82,
      ourPrice: 58,
      discountPrice: 52,
      margin: '29%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-9-1-louro-muito-claro-cinza',
    nome: 'Alfaparf Alta Moda 9.1 Louro Muito Claro Acinzentado',
    marca: 'Alfaparf Alta Moda',
    tom: '9.1',
    cor: 'Louro Muito Claro Acinzentado',
    descricao: 'Coloração permanente profissional com reflexos cinza platinado. Tom 9.1 louro muito claro acinzentado.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8877.png'],
    pricing: {
      basePrice: 82,
      ourPrice: 58,
      discountPrice: 52,
      margin: '29%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-9-21-louro-muito-claro-irise-cinza',
    nome: 'Alfaparf Alta Moda 9.21 Louro Muito Claro Irisé Acinzentado',
    marca: 'Alfaparf Alta Moda',
    tom: '9.21',
    cor: 'Louro Muito Claro Irisé Acinzentado',
    descricao: 'Coloração permanente profissional com reflexos irisé platinados. Tom 9.21 louro muito claro irisé acinzentado exclusivo.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-9036.png'],
    pricing: {
      basePrice: 82,
      ourPrice: 58,
      discountPrice: 52,
      margin: '29%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-10-1-louro-clarissimo-cinza',
    nome: 'Alfaparf Alta Moda 10.1 Louro Claríssimo Acinzentado',
    marca: 'Alfaparf Alta Moda',
    tom: '10.1',
    cor: 'Louro Claríssimo Acinzentado',
    descricao: 'Coloração permanente profissional louro claríssimo. Tom 10.1 louro claríssimo acinzentado ultra platinado.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8901.png'],
    pricing: {
      basePrice: 82,
      ourPrice: 58,
      discountPrice: 52,
      margin: '29%',
      competitive: 'Preço premium compatível com colorações italianas (€10-15), qualidade profissional Alfaparf.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'alfaparf-12-21-super-clareador-irise-cinza',
    nome: 'Alfaparf Alta Moda 12.21 Super Clareador Irisé Acinzentado',
    marca: 'Alfaparf Alta Moda',
    tom: '12.21',
    cor: 'Super Clareador Irisé Acinzentado',
    descricao: 'Super clareador permanente profissional com reflexos irisé platinados. Clareia até 8 tons com resultado ultra platinado.',
    categoria: 'tintas-capilares',
    subcategoria: 'super-clareador',
    images: ['/images/products/produtos_diversos/IMG-8900.png'],
    pricing: {
      basePrice: 85,
      ourPrice: 62,
      discountPrice: 57,
      margin: '27%',
      competitive: 'Super clareador profissional com preço justo comparado a produtos europeus (€12-18).'
    },
    badge: 'SUPER CLAREADOR'
  }
];

// ==================== GARNIER NUTRISSE (10 PRODUTOS) ====================

export const garnierNutrisseProducts: TintaCapilar[] = [
  {
    id: 'garnier-nutrisse-57-chocolate-castanho',
    nome: 'Garnier Nutrisse 57 Chocolate Castanho',
    marca: 'Garnier Nutrisse',
    tom: '57',
    cor: 'Chocolate Castanho',
    descricao: 'Coloração permanente Garnier Nutrisse com tecnologia nutritiva. Tom 57 chocolate castanho rico enriquecido com óleos de abacate, oliva e karité.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-nutritiva',
    images: ['/images/products/produtos_diversos/IMG-8965.png'],
    pricing: {
      basePrice: 45,
      ourPrice: 32,
      discountPrice: 29,
      margin: '29%',
      competitive: 'Excelente custo-benefício frente a colorações nutritivas europeias (€8-12), tripla nutrição.'
    },
    badge: 'NUTRITIVA'
  },
  {
    id: 'garnier-nutrisse-60-castanho-escuro',
    nome: 'Garnier Nutrisse 60 Castanho Escuro',
    marca: 'Garnier Nutrisse',
    tom: '60',
    cor: 'Castanho Escuro',
    descricao: 'Coloração permanente nutritiva Garnier. Tom 60 castanho escuro natural com tripla nutrição de óleos vegetais.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-nutritiva',
    images: ['/images/products/produtos_diversos/IMG-8933.png'],
    pricing: {
      basePrice: 45,
      ourPrice: 32,
      discountPrice: 29,
      margin: '29%',
      competitive: 'Excelente custo-benefício frente a colorações nutritivas europeias (€8-12), tripla nutrição.'
    },
    badge: 'NUTRITIVA'
  },
  {
    id: 'garnier-nutrisse-61-carvalho-escuro',
    nome: 'Garnier Nutrisse 61 Carvalho Escuro',
    marca: 'Garnier Nutrisse',
    tom: '61',
    cor: 'Carvalho Escuro',
    descricao: 'Coloração permanente nutritiva com reflexos carvalho. Tom 61 carvalho escuro com fórmula enriquecida.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-nutritiva',
    images: ['/images/products/produtos_diversos/IMG-8981.png'],
    pricing: {
      basePrice: 45,
      ourPrice: 32,
      discountPrice: 29,
      margin: '29%',
      competitive: 'Excelente custo-benefício frente a colorações nutritivas europeias (€8-12), tripla nutrição.'
    },
    badge: 'NUTRITIVA'
  },
  {
    id: 'garnier-nutrisse-666-vermelho-rubi',
    nome: 'Garnier Nutrisse 666 Vermelho Rubi Profundo',
    marca: 'Garnier Nutrisse',
    tom: '666',
    cor: 'Vermelho Rubi Profundo',
    descricao: 'Coloração permanente nutritiva vermelho intenso. Tom 666 vermelho rubi profundo vibrante com tripla nutrição.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-nutritiva',
    images: ['/images/products/produtos_diversos/IMG-8984.png'],
    pricing: {
      basePrice: 48,
      ourPrice: 34,
      discountPrice: 31,
      margin: '29%',
      competitive: 'Excelente custo-benefício frente a colorações nutritivas europeias (€8-12), tripla nutrição.'
    },
    badge: 'NUTRITIVA'
  },
  {
    id: 'garnier-nutrisse-67-chocolate-puro',
    nome: 'Garnier Nutrisse 67 Chocolate Puro',
    marca: 'Garnier Nutrisse',
    tom: '67',
    cor: 'Chocolate Puro',
    descricao: 'Coloração permanente nutritiva chocolate puro. Tom 67 chocolate puro intenso com óleos nutritivos de abacate, oliva e karité.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-nutritiva',
    images: ['/images/products/produtos_diversos/IMG-8912.png'],
    pricing: {
      basePrice: 48,
      ourPrice: 34,
      discountPrice: 31,
      margin: '29%',
      competitive: 'Excelente custo-benefício frente a colorações nutritivas europeias (€8-12), tripla nutrição.'
    },
    badge: 'NUTRITIVA'
  },
  {
    id: 'garnier-nutrisse-70-louro-natural',
    nome: 'Garnier Nutrisse 70 Louro Natural',
    marca: 'Garnier Nutrisse',
    tom: '70',
    cor: 'Louro Natural',
    descricao: 'Coloração permanente nutritiva Garnier. Tom 70 louro natural com tripla nutrição para cabelos saudáveis e brilhantes.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-nutritiva',
    images: ['/images/products/produtos_diversos/IMG-8923.png'],
    pricing: {
      basePrice: 48,
      ourPrice: 34,
      discountPrice: 31,
      margin: '29%',
      competitive: 'Excelente custo-benefício frente a colorações nutritivas europeias (€8-12), tripla nutrição.'
    },
    badge: 'NUTRITIVA'
  },
  {
    id: 'garnier-nutrisse-71-louro-cinza',
    nome: 'Garnier Nutrisse 71 Louro Acinzentado',
    marca: 'Garnier Nutrisse',
    tom: '71',
    cor: 'Louro Acinzentado',
    descricao: 'Coloração permanente nutritiva com reflexos cinza. Tom 71 louro acinzentado moderno com tripla nutrição.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-nutritiva',
    images: ['/images/products/produtos_diversos/IMG-8980.png'],
    pricing: {
      basePrice: 48,
      ourPrice: 34,
      discountPrice: 31,
      margin: '29%',
      competitive: 'Excelente custo-benefício frente a colorações nutritivas europeias (€8-12), tripla nutrição.'
    },
    badge: 'NUTRITIVA'
  },
  {
    id: 'garnier-nutrisse-80-louro-claro',
    nome: 'Garnier Nutrisse 80 Louro Claro',
    marca: 'Garnier Nutrisse',
    tom: '80',
    cor: 'Louro Claro Tá Com Tudo',
    descricao: 'Coloração permanente nutritiva Garnier. Tom 80 louro claro luminoso com óleos de abacate, oliva e karité.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-nutritiva',
    images: ['/images/products/produtos_diversos/IMG-8902.png'],
    pricing: {
      basePrice: 50,
      ourPrice: 35,
      discountPrice: 32,
      margin: '30%',
      competitive: 'Excelente custo-benefício frente a colorações nutritivas europeias (€8-12), tripla nutrição.'
    },
    badge: 'NUTRITIVA'
  },
  {
    id: 'garnier-nutrisse-81-louro-claro-cinza',
    nome: 'Garnier Nutrisse 81 Louro Claro Acinzentado',
    marca: 'Garnier Nutrisse',
    tom: '81',
    cor: 'Louro Cinza Claro Brilho',
    descricao: 'Coloração permanente nutritiva com reflexos cinza. Tom 81 louro claro acinzentado platinado com tripla nutrição.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-nutritiva',
    images: ['/images/products/produtos_diversos/IMG-8961.png'],
    pricing: {
      basePrice: 50,
      ourPrice: 35,
      discountPrice: 32,
      margin: '30%',
      competitive: 'Excelente custo-benefício frente a colorações nutritivas europeias (€8-12), tripla nutrição.'
    },
    badge: 'NUTRITIVA'
  },
  {
    id: 'garnier-nutrisse-12-11-louro-natural-extra-claro',
    nome: 'Garnier Nutrisse 12.11 Louro Natural Extra Claro',
    marca: 'Garnier Nutrisse',
    tom: '12.11',
    cor: 'Louro Natural Extra Claro',
    descricao: 'Coloração permanente nutritiva louro extra claro. Tom 12.11 louro natural extra claro com tripla nutrição de óleos.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-nutritiva',
    images: ['/images/products/produtos_diversos/IMG-8962.png'],
    pricing: {
      basePrice: 52,
      ourPrice: 37,
      discountPrice: 34,
      margin: '29%',
      competitive: 'Excelente custo-benefício frente a colorações nutritivas europeias (€8-12), tripla nutrição.'
    },
    badge: 'NUTRITIVA'
  }
];

// ==================== AMEND MAGNIFIC COLOR (6 PRODUTOS) ====================

export const amendMagnificColorProducts: TintaCapilar[] = [
  {
    id: 'amend-magnific-5-0-castanho-claro',
    nome: 'Amend Magnific Color 5.0 Castanho Claro',
    marca: 'Amend Magnific Color',
    tom: '5.0',
    cor: 'Castanho Claro',
    descricao: 'Coloração permanente profissional Amend com tecnologia de micro partículas. Tom 5.0 castanho claro natural com brilho intenso.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8918.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 46,
      discountPrice: 42,
      margin: '29%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), micro partículas.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'amend-magnific-55-46-castanho-claro-cobre-vermelho',
    nome: 'Amend Magnific Color 55.46 Castanho Claro Cobre Vermelho',
    marca: 'Amend Magnific Color',
    tom: '55.46',
    cor: 'Castanho Claro Cobre Vermelho',
    descricao: 'Coloração permanente profissional com reflexos cobre-vermelho. Tom 55.46 castanho claro cobre vermelho vibrante.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8953.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 46,
      discountPrice: 42,
      margin: '29%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), micro partículas.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'amend-magnific-6-7-chocolate',
    nome: 'Amend Magnific Color 6.7 Chocolate',
    marca: 'Amend Magnific Color',
    tom: '6.7',
    cor: 'Chocolate Para Brilhar',
    descricao: 'Coloração permanente profissional tom chocolate. Tom 6.7 louro escuro marrom chocolate rico com tecnologia de micro partículas.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8940.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 46,
      discountPrice: 42,
      margin: '29%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), micro partículas.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'amend-magnific-7-3-louro-medio-dourado',
    nome: 'Amend Magnific Color 7.3 Louro Médio Dourado',
    marca: 'Amend Magnific Color',
    tom: '7.3',
    cor: 'Louro Dourado Super De Brilho',
    descricao: 'Coloração permanente profissional com reflexos dourados. Tom 7.3 louro médio dourado luminoso e radiante.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8976.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 46,
      discountPrice: 42,
      margin: '29%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), micro partículas.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'amend-magnific-7-47-louro-medio-cobre-marrom',
    nome: 'Amend Magnific Color 7.47 Louro Médio Cobre Marrom',
    marca: 'Amend Magnific Color',
    tom: '7.47',
    cor: 'Louro Médio Cobre Marrom',
    descricao: 'Coloração permanente profissional com reflexos cobre-marrom. Tom 7.47 louro médio cobre marrom vibrante.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8973.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 46,
      discountPrice: 42,
      margin: '29%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), micro partículas.'
    },
    badge: 'PROFISSIONAL'
  },
  {
    id: 'amend-magnific-8-1-louro-claro-cinza',
    nome: 'Amend Magnific Color 8.1 Louro Claro Acinzentado',
    marca: 'Amend Magnific Color',
    tom: '8.1',
    cor: 'Louro Cinza Claro Brilho',
    descricao: 'Coloração permanente profissional com reflexos cinza platinado. Tom 8.1 louro claro acinzentado moderno.',
    categoria: 'tintas-capilares',
    subcategoria: 'coloracao-profissional',
    images: ['/images/products/produtos_diversos/IMG-8979.png'],
    pricing: {
      basePrice: 65,
      ourPrice: 46,
      discountPrice: 42,
      margin: '29%',
      competitive: 'Preço competitivo comparado a colorações profissionais europeias (€10-15), micro partículas.'
    },
    badge: 'PROFISSIONAL'
  }
];

// ==================== COMBINED EXPORTS ====================

export const tintasCapilares: TintaCapilar[] = [
  ...biocolorProducts,
  ...wellaKolestonProducts,
  ...wellaSoftColorProducts,
  ...alfaparfAltaModaProducts,
  ...garnierNutrisseProducts,
  ...amendMagnificColorProducts
];

// Get all hair coloring products
export const getAllTintasCapilares = () => tintasCapilares;

// Get hair coloring product by ID
export const getTintaCapilarById = (id: string) => {
  return tintasCapilares.find(product => product.id === id);
};

// Get hair coloring products by brand
export const getTintasCapilaresByBrand = (brand: string) => {
  return tintasCapilares.filter(product =>
    product.marca.toLowerCase().includes(brand.toLowerCase())
  );
};

// Get hair coloring products by subcategory
export const getTintasCapilaresBySubcategory = (subcategory: string) => {
  return tintasCapilares.filter(product => product.subcategoria === subcategory);
};

// Get hair coloring products by tone
export const getTintasCapilaresByTone = (tone: string) => {
  return tintasCapilares.filter(product => product.tom === tone);
};

// Export for backward compatibility
export const allTintasCapilares = tintasCapilares;

// Export default all hair coloring products
export default getAllTintasCapilares();
