/**
 * JC Hair Studio's 62 - Tintas Capilares Reais
 *
 * Produtos de coloração capilar com imagens reais disponíveis
 */

export interface TintaProduct {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  imagens: string[];
  categoria: string;
  subcategoria: string;
  cor?: string;
  tom?: string;
  badge?: string;
  pricing: {
    basePrice: number;
    ourPrice: number;
    discountPrice?: number;
    savings?: number;
    margin: string;
    competitive: string;
  };
  especificacoes: {
    volume?: string;
    tipo: string;
    cobertura: string;
    durabilidade: string;
    aplicacao: string;
  };
  tags: string[];
  rating: number;
  reviews: number;
}

// Base pricing for different hair color brands
const tintaPricing = {
  'loreal': { base: 12.90, our: 18.90, discount: 16.90 },
  'wella': { base: 14.90, our: 21.90, discount: 19.90 },
  'amend': { base: 11.90, our: 17.90, discount: 15.90 },
  'biocolor': { base: 9.90, our: 14.90, discount: 12.90 },
  'beauty-color': { base: 8.90, our: 13.90, discount: 11.90 },
  'nutrisse': { base: 13.90, our: 19.90, discount: 17.90 },
  'excllusiv': { base: 15.90, our: 23.90, discount: 21.90 },
  'alta-moda': { base: 10.90, our: 16.90, discount: 14.90 }
};

// L'Oréal Paris Products (Premium Brand)
const lorealProducts: TintaProduct[] = [
  {
    id: 'loreal-excellence-1',
    nome: 'L\'Oréal Paris Excellence Crème Loiro Dourado',
    marca: 'L\'ORÉAL PARIS',
    descricao: 'Coloração permanente com proteção tripla para cabelos loiros. Fórmula com ceramidas e pro-keratina.',
    imagens: ['/images/products/tinta_loreal/tinta_loreal_1.PNG'],
    categoria: 'Tintas Capilares',
    subcategoria: 'Coloração Permanente',
    cor: 'Loiro',
    tom: 'Dourado',
    badge: 'PREMIUM',
    pricing: {
      basePrice: tintaPricing.loreal.base,
      ourPrice: tintaPricing.loreal.our,
      discountPrice: tintaPricing.loreal.discount,
      savings: tintaPricing.loreal.our - tintaPricing.loreal.discount,
      margin: '31%',
      competitive: 'Qualidade francesa premium'
    },
    especificacoes: {
      volume: '48ml + 72ml',
      tipo: 'Coloração Permanente',
      cobertura: '100% dos cabelos brancos',
      durabilidade: '6-8 semanas',
      aplicacao: 'Profissional recomendada'
    },
    tags: ['loreal', 'premium', 'loiro', 'permanente', 'cobertura-total'],
    rating: 4.6,
    reviews: 89
  },
  {
    id: 'loreal-excellence-2',
    nome: 'L\'Oréal Paris Excellence Crème Castanho Natural',
    marca: 'L\'ORÉAL PARIS',
    descricao: 'Coloração permanente castanho natural com brilho intenso e proteção durante o processo de coloração.',
    imagens: ['/images/products/tinta_loreal/tinta_loreal_2.PNG'],
    categoria: 'Tintas Capilares',
    subcategoria: 'Coloração Permanente',
    cor: 'Castanho',
    tom: 'Natural',
    badge: 'BEST SELLER',
    pricing: {
      basePrice: tintaPricing.loreal.base,
      ourPrice: tintaPricing.loreal.our,
      discountPrice: tintaPricing.loreal.discount,
      savings: tintaPricing.loreal.our - tintaPricing.loreal.discount,
      margin: '31%',
      competitive: 'Resultado profissional'
    },
    especificacoes: {
      volume: '48ml + 72ml',
      tipo: 'Coloração Permanente',
      cobertura: '100% dos cabelos brancos',
      durabilidade: '6-8 semanas',
      aplicacao: 'Em casa ou salão'
    },
    tags: ['loreal', 'castanho', 'natural', 'permanente', 'bestseller'],
    rating: 4.7,
    reviews: 156
  }
];

// Wella Products (Professional Brand)
const wellaProducts: TintaProduct[] = [
  {
    id: 'wella-koleston-1',
    nome: 'Wella Koleston Perfect Loiro Platinado',
    marca: 'WELLA PROFESSIONALS',
    descricao: 'Coloração profissional com tecnologia ME+ para redução de alergias. Cobertura total e brilho excepcional.',
    imagens: ['/images/products/tinta_wella/tinta_wella_1.PNG'],
    categoria: 'Tintas Capilares',
    subcategoria: 'Coloração Profissional',
    cor: 'Loiro',
    tom: 'Platinado',
    badge: 'PROFESSIONAL',
    pricing: {
      basePrice: tintaPricing.wella.base,
      ourPrice: tintaPricing.wella.our,
      discountPrice: tintaPricing.wella.discount,
      savings: tintaPricing.wella.our - tintaPricing.wella.discount,
      margin: '34%',
      competitive: 'Padrão salão profissional'
    },
    especificacoes: {
      volume: '60ml',
      tipo: 'Coloração Profissional',
      cobertura: '100% dos cabelos brancos',
      durabilidade: '8-10 semanas',
      aplicacao: 'Profissional recomendada'
    },
    tags: ['wella', 'profissional', 'loiro', 'platinado', 'salon-quality'],
    rating: 4.8,
    reviews: 203
  },
  {
    id: 'wella-color-touch-2',
    nome: 'Wella Color Touch Castanho Chocolate',
    marca: 'WELLA PROFESSIONALS',
    descricao: 'Coloração demi-permanente que adiciona reflexos intensos e brilho natural aos cabelos.',
    imagens: ['/images/products/tinta_wella/tinta_wella_2.PNG'],
    categoria: 'Tintas Capilares',
    subcategoria: 'Coloração Demi-permanente',
    cor: 'Castanho',
    tom: 'Chocolate',
    pricing: {
      basePrice: tintaPricing.wella.base,
      ourPrice: tintaPricing.wella.our,
      discountPrice: tintaPricing.wella.discount,
      savings: tintaPricing.wella.our - tintaPricing.wella.discount,
      margin: '34%',
      competitive: 'Tecnologia alemã avançada'
    },
    especificacoes: {
      volume: '60ml',
      tipo: 'Demi-permanente',
      cobertura: 'Reflexos intensos',
      durabilidade: '4-6 semanas',
      aplicacao: 'Salão ou casa'
    },
    tags: ['wella', 'castanho', 'chocolate', 'demi-permanente', 'reflexos'],
    rating: 4.5,
    reviews: 134
  }
];

// Amend Products (Brazilian Brand)
const amendProducts: TintaProduct[] = [
  {
    id: 'amend-expertise-1',
    nome: 'Amend Expertise Color Ruivo Intenso',
    marca: 'AMEND',
    descricao: 'Coloração brasileira com óleos naturais. Fórmula exclusiva que respeita a estrutura capilar brasileira.',
    imagens: ['/images/products/tinta_amend/tinta_amend_1.PNG'],
    categoria: 'Tintas Capilares',
    subcategoria: 'Coloração Brasileira',
    cor: 'Ruivo',
    tom: 'Intenso',
    badge: 'BRASILEIRO',
    pricing: {
      basePrice: tintaPricing.amend.base,
      ourPrice: tintaPricing.amend.our,
      discountPrice: tintaPricing.amend.discount,
      savings: tintaPricing.amend.our - tintaPricing.amend.discount,
      margin: '34%',
      competitive: 'Desenvolvido para cabelo brasileiro'
    },
    especificacoes: {
      volume: '50ml + 75ml',
      tipo: 'Coloração Permanente',
      cobertura: 'Excelente em cabelos brancos',
      durabilidade: '6-8 semanas',
      aplicacao: 'Em casa'
    },
    tags: ['amend', 'brasileiro', 'ruivo', 'intenso', 'natural'],
    rating: 4.4,
    reviews: 98
  }
];

// BioColor Products (Affordable Quality)
const biocolorProducts: TintaProduct[] = [
  {
    id: 'biocolor-mini-1',
    nome: 'BioColor Mini Kit Preto Azulado',
    marca: 'BIOCOLOR',
    descricao: 'Kit coloração prático e econômico. Ideal para retoques rápidos e cobertura de raiz.',
    imagens: ['/images/products/tinta_biocolor/tinta_biocolor_1.PNG'],
    categoria: 'Tintas Capilares',
    subcategoria: 'Kit Coloração',
    cor: 'Preto',
    tom: 'Azulado',
    badge: 'ECONÔMICO',
    pricing: {
      basePrice: tintaPricing.biocolor.base,
      ourPrice: tintaPricing.biocolor.our,
      discountPrice: tintaPricing.biocolor.discount,
      savings: tintaPricing.biocolor.our - tintaPricing.biocolor.discount,
      margin: '30%',
      competitive: 'Melhor custo-benefício'
    },
    especificacoes: {
      volume: '40ml + 40ml',
      tipo: 'Kit Prático',
      cobertura: 'Boa cobertura',
      durabilidade: '4-6 semanas',
      aplicacao: 'Muito fácil'
    },
    tags: ['biocolor', 'economico', 'preto', 'pratico', 'retoque'],
    rating: 4.2,
    reviews: 167
  }
];

// Beauty Color Products
const beautyColorProducts: TintaProduct[] = [
  {
    id: 'beauty-color-1',
    nome: 'Beauty Color Loiro Dourado Claro',
    marca: 'BEAUTY COLOR',
    descricao: 'Coloração cremosa com resultado profissional. Fórmula enriquecida com ingredientes nutritivos.',
    imagens: ['/images/products/tinta_beauty_color/tinta_beauty_color_1.PNG'],
    categoria: 'Tintas Capilares',
    subcategoria: 'Coloração Cremosa',
    cor: 'Loiro',
    tom: 'Dourado Claro',
    pricing: {
      basePrice: tintaPricing['beauty-color'].base,
      ourPrice: tintaPricing['beauty-color'].our,
      discountPrice: tintaPricing['beauty-color'].discount,
      savings: tintaPricing['beauty-color'].our - tintaPricing['beauty-color'].discount,
      margin: '29%',
      competitive: 'Qualidade acessível'
    },
    especificacoes: {
      volume: '45ml + 45ml',
      tipo: 'Coloração Cremosa',
      cobertura: 'Boa em cabelos brancos',
      durabilidade: '5-7 semanas',
      aplicacao: 'Doméstica'
    },
    tags: ['beauty-color', 'loiro', 'dourado', 'cremosa', 'nutritiva'],
    rating: 4.3,
    reviews: 142
  }
];

// Combine all tinta products
export const allTintasData: TintaProduct[] = [
  ...lorealProducts,
  ...wellaProducts,
  ...amendProducts,
  ...biocolorProducts,
  ...beautyColorProducts
];

// Helper functions
export const getTintasByMarca = (marca: string) => {
  return allTintasData.filter(tinta =>
    tinta.marca.toLowerCase().includes(marca.toLowerCase())
  );
};

export const getTintasByCor = (cor: string) => {
  return allTintasData.filter(tinta =>
    tinta.cor?.toLowerCase().includes(cor.toLowerCase())
  );
};

export const getTintaById = (id: string) => {
  return allTintasData.find(tinta => tinta.id === id);
};

export default allTintasData;