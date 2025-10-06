/**
 * Mega Hair Products - PREÇOS CORRIGIDOS
 * Custo real: €70 por 100g de 50cm
 * Incremento: +37% a cada 10cm
 * Margem mínima: 50%
 * Venda: Apenas 100g para todos comprimentos
 */

export interface MegaHairProductCorrected {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  imagens: string[];
  badge?: string;
  pricing: {
    basePrice: number;      // Custo real em €
    ourPrice: number;        // Preço venda (mínimo 2x custo = 50% margem)
    discountPrice: number;   // Preço promocional
    savings: number;
    margin: string;
    competitive: string;
  };
  category: string;
  length: number;           // Comprimento em cm
  weight: string;           // Sempre 100g
  type: 'liso' | 'ondulado' | 'cacheado';
  color: string;
  origin: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  sku: string;
}

export const megaHairProductsCorrected: MegaHairProductCorrected[] = [
  // 40CM - €44.10 custo
  {
    id: 'mega-hair-40cm-liso-preto',
    sku: 'MEGA-40-LISO-PRETO',
    nome: 'Mega Hair Liso Preto 40cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair 100% cabelo humano brasileiro natural liso preto, 40cm de comprimento, 100g. Perfeito para quem busca volume e comprimento moderado com máxima naturalidade.',
    imagens: ['/images/products/mega-hair/mega-hair-40cm-liso-preto.jpg'],
    badge: 'COMPACTO',
    pricing: {
      basePrice: 44.10,
      ourPrice: 88.20,
      discountPrice: 79.40,
      savings: 8.80,
      margin: '50.0%',
      competitive: 'Preço competitivo vs extensões brasileiras 40cm na Europa (€95-120). Cabelo 100% humano autêntico.'
    },
    category: 'Mega Hair',
    length: 40,
    weight: '100g',
    type: 'liso',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 4.7,
    reviews: 156,
    inStock: true
  },
  {
    id: 'mega-hair-40cm-ondulado',
    sku: 'MEGA-40-OND',
    nome: 'Mega Hair Ondulado 40cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair ondulado brasileiro 40cm, 100g. Ondas naturais tipo 2B/2C, movimento perfeito e volume equilibrado.',
    imagens: ['/images/products/mega-hair/mega-hair-40cm-ondulado.jpg'],
    pricing: {
      basePrice: 44.10,
      ourPrice: 92.60,
      discountPrice: 83.30,
      savings: 9.30,
      margin: '52.4%',
      competitive: 'Ondulado brasileiro vs europeu (€105-135). Textura autêntica 2B/2C.'
    },
    category: 'Mega Hair',
    length: 40,
    weight: '100g',
    type: 'ondulado',
    color: 'Castanho Natural',
    origin: 'Brasil',
    rating: 4.6,
    reviews: 134,
    inStock: true
  },
  {
    id: 'mega-hair-40cm-cacheado',
    sku: 'MEGA-40-CACH',
    nome: 'Mega Hair Cacheado 40cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair cacheado brasileiro 40cm, 100g. Cachos definidos tipo 3B/3C, volume natural intenso.',
    imagens: ['/images/products/mega-hair/mega-hair-40cm-cacheado.jpg'],
    badge: 'CACHOS',
    pricing: {
      basePrice: 44.10,
      ourPrice: 97.00,
      discountPrice: 87.30,
      savings: 9.70,
      margin: '54.5%',
      competitive: 'Cacheado brasileiro raro na Europa (€115-145). Cachos autênticos 3B/3C.'
    },
    category: 'Mega Hair',
    length: 40,
    weight: '100g',
    type: 'cacheado',
    color: 'Castanho Natural',
    origin: 'Brasil',
    rating: 4.8,
    reviews: 189,
    inStock: true
  },

  // 50CM - €70.00 custo
  {
    id: 'mega-hair-50cm-liso-preto',
    sku: 'MEGA-50-LISO-PRETO',
    nome: 'Mega Hair Liso Preto 50cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair 100% cabelo humano brasileiro natural liso preto, 50cm de comprimento, 100g. Nosso best-seller absoluto! Comprimento ideal para transformações versáteis.',
    imagens: ['/images/products/mega-hair/mega-hair-50cm-liso-preto.jpg'],
    badge: 'BEST SELLER',
    pricing: {
      basePrice: 70.00,
      ourPrice: 140.00,
      discountPrice: 126.00,
      savings: 14.00,
      margin: '50.0%',
      competitive: 'Preço competitivo vs extensões brasileiras 50cm na Europa (€150-190). Qualidade premium garantida.'
    },
    category: 'Mega Hair',
    length: 50,
    weight: '100g',
    type: 'liso',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 4.9,
    reviews: 423,
    inStock: true
  },
  {
    id: 'mega-hair-50cm-ondulado',
    sku: 'MEGA-50-OND',
    nome: 'Mega Hair Ondulado 50cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair ondulado brasileiro 50cm, 100g. Ondas naturais perfeitas, movimento e volume equilibrado.',
    imagens: ['/images/products/mega-hair/mega-hair-50cm-ondulado.jpg'],
    badge: 'POPULAR',
    pricing: {
      basePrice: 70.00,
      ourPrice: 147.00,
      discountPrice: 132.30,
      savings: 14.70,
      margin: '52.4%',
      competitive: 'Ondulado 50cm vs europeu (€165-210). Movimento natural brasileiro autêntico.'
    },
    category: 'Mega Hair',
    length: 50,
    weight: '100g',
    type: 'ondulado',
    color: 'Castanho Natural',
    origin: 'Brasil',
    rating: 4.8,
    reviews: 367,
    inStock: true
  },
  {
    id: 'mega-hair-50cm-cacheado',
    sku: 'MEGA-50-CACH',
    nome: 'Mega Hair Cacheado 50cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair cacheado brasileiro 50cm, 100g. Cachos definidos volumosos, textura 3B/3C autêntica.',
    imagens: ['/images/products/mega-hair/mega-hair-50cm-cacheado.jpg'],
    badge: 'CACHOS',
    pricing: {
      basePrice: 70.00,
      ourPrice: 154.00,
      discountPrice: 138.60,
      savings: 15.40,
      margin: '54.5%',
      competitive: 'Cacheado 50cm raro na Europa (€180-230). Textura brasileira única.'
    },
    category: 'Mega Hair',
    length: 50,
    weight: '100g',
    type: 'cacheado',
    color: 'Castanho Natural',
    origin: 'Brasil',
    rating: 4.9,
    reviews: 412,
    inStock: true
  },

  // 60CM - €95.90 custo
  {
    id: 'mega-hair-60cm-liso-preto',
    sku: 'MEGA-60-LISO-PRETO',
    nome: 'Mega Hair Liso Preto 60cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair 100% cabelo humano brasileiro liso preto, 60cm, 100g. Comprimento longo ideal para máximo impacto visual.',
    imagens: ['/images/products/mega-hair/mega-hair-60cm-liso-preto.jpg'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 95.90,
      ourPrice: 191.80,
      discountPrice: 172.60,
      savings: 19.20,
      margin: '50.0%',
      competitive: 'Excelente valor vs extensões 60cm europeias (€210-270). Cabelo brasileiro premium.'
    },
    category: 'Mega Hair',
    length: 60,
    weight: '100g',
    type: 'liso',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 4.8,
    reviews: 289,
    inStock: true
  },
  {
    id: 'mega-hair-60cm-ondulado',
    sku: 'MEGA-60-OND',
    nome: 'Mega Hair Ondulado 60cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair ondulado brasileiro 60cm, 100g. Ondas longas espetaculares com movimento fluido.',
    imagens: ['/images/products/mega-hair/mega-hair-60cm-ondulado.jpg'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 95.90,
      ourPrice: 201.40,
      discountPrice: 181.30,
      savings: 20.10,
      margin: '52.4%',
      competitive: 'Ondulado 60cm premium vs europeu (€230-290). Movimento natural brasileiro.'
    },
    category: 'Mega Hair',
    length: 60,
    weight: '100g',
    type: 'ondulado',
    color: 'Castanho Natural',
    origin: 'Brasil',
    rating: 4.7,
    reviews: 245,
    inStock: true
  },
  {
    id: 'mega-hair-60cm-cacheado',
    sku: 'MEGA-60-CACH',
    nome: 'Mega Hair Cacheado 60cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair cacheado brasileiro 60cm, 100g. Cachos longos definidos, volume espetacular.',
    imagens: ['/images/products/mega-hair/mega-hair-60cm-cacheado.jpg'],
    badge: 'VOLUME',
    pricing: {
      basePrice: 95.90,
      ourPrice: 211.00,
      discountPrice: 189.90,
      savings: 21.10,
      margin: '54.5%',
      competitive: 'Cacheado 60cm exclusivo na Europa (€250-320). Raridade brasileira.'
    },
    category: 'Mega Hair',
    length: 60,
    weight: '100g',
    type: 'cacheado',
    color: 'Castanho Natural',
    origin: 'Brasil',
    rating: 4.9,
    reviews: 312,
    inStock: true
  },

  // 70CM - €131.38 custo
  {
    id: 'mega-hair-70cm-liso-preto',
    sku: 'MEGA-70-LISO-PRETO',
    nome: 'Mega Hair Liso Preto 70cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair 100% cabelo humano brasileiro liso preto, 70cm, 100g. Comprimento extra longo para transformações dramáticas.',
    imagens: ['/images/products/mega-hair/mega-hair-70cm-liso-preto.jpg'],
    badge: 'LUXO',
    pricing: {
      basePrice: 131.38,
      ourPrice: 262.76,
      discountPrice: 236.50,
      savings: 26.26,
      margin: '50.0%',
      competitive: 'Preço excelente vs extensões 70cm europeias (€290-370). Qualidade luxury brasileira.'
    },
    category: 'Mega Hair',
    length: 70,
    weight: '100g',
    type: 'liso',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 4.8,
    reviews: 198,
    inStock: true
  },
  {
    id: 'mega-hair-70cm-ondulado',
    sku: 'MEGA-70-OND',
    nome: 'Mega Hair Ondulado 70cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair ondulado brasileiro 70cm, 100g. Ondas extra longas de impacto máximo.',
    imagens: ['/images/products/mega-hair/mega-hair-70cm-ondulado.jpg'],
    badge: 'LUXO',
    pricing: {
      basePrice: 131.38,
      ourPrice: 276.00,
      discountPrice: 248.40,
      savings: 27.60,
      margin: '52.4%',
      competitive: 'Ondulado 70cm luxury vs europeu (€320-410). Movimento espetacular.'
    },
    category: 'Mega Hair',
    length: 70,
    weight: '100g',
    type: 'ondulado',
    color: 'Castanho Natural',
    origin: 'Brasil',
    rating: 4.7,
    reviews: 167,
    inStock: true
  },
  {
    id: 'mega-hair-70cm-cacheado',
    sku: 'MEGA-70-CACH',
    nome: 'Mega Hair Cacheado 70cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair cacheado brasileiro 70cm, 100g. Cachos extra longos, volume máximo dramático.',
    imagens: ['/images/products/mega-hair/mega-hair-70cm-cacheado.jpg'],
    badge: 'EXCLUSIVO',
    pricing: {
      basePrice: 131.38,
      ourPrice: 289.00,
      discountPrice: 260.10,
      savings: 28.90,
      margin: '54.5%',
      competitive: 'Cacheado 70cm ultra raro na Europa (€350-450). Peça de colecionador.'
    },
    category: 'Mega Hair',
    length: 70,
    weight: '100g',
    type: 'cacheado',
    color: 'Castanho Natural',
    origin: 'Brasil',
    rating: 5.0,
    reviews: 145,
    inStock: true
  },

  // 80CM - €179.99 custo
  {
    id: 'mega-hair-80cm-liso-preto',
    sku: 'MEGA-80-LISO-PRETO',
    nome: 'Mega Hair Liso Preto 80cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair 100% cabelo humano brasileiro liso preto, 80cm, 100g. Comprimento de estrela, raridade absoluta no mercado.',
    imagens: ['/images/products/mega-hair/mega-hair-80cm-liso-preto.jpg'],
    badge: 'VIP',
    pricing: {
      basePrice: 179.99,
      ourPrice: 359.98,
      discountPrice: 323.98,
      savings: 36.00,
      margin: '50.0%',
      competitive: 'Raridade vs extensões 80cm europeias (€400-520). Comprimento de celebridade.'
    },
    category: 'Mega Hair',
    length: 80,
    weight: '100g',
    type: 'liso',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 4.9,
    reviews: 89,
    inStock: true
  },
  {
    id: 'mega-hair-80cm-ondulado',
    sku: 'MEGA-80-OND',
    nome: 'Mega Hair Ondulado 80cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair ondulado brasileiro 80cm, 100g. Ondas de sereia, impacto visual máximo.',
    imagens: ['/images/products/mega-hair/mega-hair-80cm-ondulado.jpg'],
    badge: 'VIP',
    pricing: {
      basePrice: 179.99,
      ourPrice: 378.00,
      discountPrice: 340.20,
      savings: 37.80,
      margin: '52.4%',
      competitive: 'Ondulado 80cm ultra exclusivo vs europeu (€450-580). Ondas de passarela.'
    },
    category: 'Mega Hair',
    length: 80,
    weight: '100g',
    type: 'ondulado',
    color: 'Castanho Natural',
    origin: 'Brasil',
    rating: 4.8,
    reviews: 76,
    inStock: true
  },
  {
    id: 'mega-hair-80cm-cacheado',
    sku: 'MEGA-80-CACH',
    nome: 'Mega Hair Cacheado 80cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair cacheado brasileiro 80cm, 100g. Cachos de deusa, volume afro-brasileiro espetacular.',
    imagens: ['/images/products/mega-hair/mega-hair-80cm-cacheado.jpg'],
    badge: 'OBRA DE ARTE',
    pricing: {
      basePrice: 179.99,
      ourPrice: 396.00,
      discountPrice: 356.40,
      savings: 39.60,
      margin: '54.5%',
      competitive: 'Cacheado 80cm inexistente na Europa (€500-650). Obra de arte capilar brasileira.'
    },
    category: 'Mega Hair',
    length: 80,
    weight: '100g',
    type: 'cacheado',
    color: 'Castanho Natural',
    origin: 'Brasil',
    rating: 5.0,
    reviews: 67,
    inStock: true
  },

  // 90CM - €246.59 custo (RAPUNZEL)
  {
    id: 'mega-hair-90cm-liso-preto',
    sku: 'MEGA-90-LISO-PRETO',
    nome: 'Mega Hair Liso Preto 90cm Rapunzel - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair 100% cabelo humano brasileiro liso preto, 90cm, 100g. Coleção Rapunzel - Nossa peça mais exclusiva e espetacular!',
    imagens: ['/images/products/mega-hair/mega-hair-90cm-liso-preto.jpg'],
    badge: 'RAPUNZEL',
    pricing: {
      basePrice: 246.59,
      ourPrice: 493.18,
      discountPrice: 443.86,
      savings: 49.32,
      margin: '50.0%',
      competitive: 'Coleção Rapunzel única na Europa (€550-720). Comprimento extremo de 90cm - peça de museu.'
    },
    category: 'Mega Hair',
    length: 90,
    weight: '100g',
    type: 'liso',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 5.0,
    reviews: 45,
    inStock: true
  },
  {
    id: 'mega-hair-90cm-ondulado',
    sku: 'MEGA-90-OND',
    nome: 'Mega Hair Ondulado 90cm Rapunzel - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair ondulado brasileiro 90cm, 100g. Ondas Rapunzel de conto de fadas, para quem sonha grande.',
    imagens: ['/images/products/mega-hair/mega-hair-90cm-ondulado.jpg'],
    badge: 'RAPUNZEL',
    pricing: {
      basePrice: 246.59,
      ourPrice: 518.00,
      discountPrice: 466.20,
      savings: 51.80,
      margin: '52.4%',
      competitive: 'Ondulado 90cm Rapunzel inexistente na Europa (€620-800). Ondas de princesa brasileira.'
    },
    category: 'Mega Hair',
    length: 90,
    weight: '100g',
    type: 'ondulado',
    color: 'Castanho Natural',
    origin: 'Brasil',
    rating: 5.0,
    reviews: 38,
    inStock: true
  },
  {
    id: 'mega-hair-90cm-cacheado',
    sku: 'MEGA-90-CACH',
    nome: 'Mega Hair Cacheado 90cm Rapunzel - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair cacheado brasileiro 90cm, 100g. Cachos Rapunzel - O ápice da beleza afro-brasileira, volume imperial.',
    imagens: ['/images/products/mega-hair/mega-hair-90cm-cacheado.jpg'],
    badge: 'IMPERIAL',
    pricing: {
      basePrice: 246.59,
      ourPrice: 543.00,
      discountPrice: 488.70,
      savings: 54.30,
      margin: '54.5%',
      competitive: 'Cacheado 90cm Rapunzel - NÃO EXISTE na Europa (€700-950). Coroa afro-brasileira imperial.'
    },
    category: 'Mega Hair',
    length: 90,
    weight: '100g',
    type: 'cacheado',
    color: 'Castanho Natural',
    origin: 'Brasil',
    rating: 5.0,
    reviews: 29,
    inStock: true
  }
];

// Helper functions
export function getMegaHairByLength(length: number): MegaHairProductCorrected[] {
  return megaHairProductsCorrected.filter(p => p.length === length);
}

export function getMegaHairByType(type: 'liso' | 'ondulado' | 'cacheado'): MegaHairProductCorrected[] {
  return megaHairProductsCorrected.filter(p => p.type === type);
}

export function getMegaHairById(id: string): MegaHairProductCorrected | undefined {
  return megaHairProductsCorrected.find(p => p.id === id);
}

export function getMegaHairBySku(sku: string): MegaHairProductCorrected | undefined {
  return megaHairProductsCorrected.find(p => p.sku === sku);
}

export default megaHairProductsCorrected;
