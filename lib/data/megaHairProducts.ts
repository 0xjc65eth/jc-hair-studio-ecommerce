/**
 * Mega Hair Products - PREÇOS ATUALIZADOS
 * Base: €110 para cores naturais
 * Base + €40: €150 para cores coloridas/descoloridas
 * Desconto: 10% sobre o preço base
 *
 * IMPORTANTE: Preços padronizados conforme solicitação do cliente
 */

export interface MegaHairProductCorrected {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  imagens: string[];
  badge?: string;
  pricing: {
    basePrice: number;      // Custo fictício em €
    ourPrice: number;        // Preço venda
    discountPrice: number;   // Preço com desconto 10%
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

// Helper function to determine if color is natural or colored
function isColoredOrBleached(color: string): boolean {
  const coloredColors = [
    'Ombré Grisalho',
    'Ruivo Intenso',
    'Borgonha Profunda',
    'Loiro Platinado',
    'Castanho Chocolate'
  ];
  return coloredColors.includes(color);
}

// Helper function to calculate pricing
function calculatePricing(color: string) {
  const isColored = isColoredOrBleached(color);
  const ourPrice = isColored ? 150 : 110;
  const discountPrice = ourPrice * 0.9; // 10% discount
  const savings = ourPrice - discountPrice;
  const basePrice = ourPrice * 0.6; // Fictitious cost for margin calculation

  return {
    basePrice,
    ourPrice,
    discountPrice,
    savings,
    margin: isColored ? '60%' : '60%',
    competitive: `Preço competitivo vs extensões brasileiras na Europa. Cabelo 100% humano ${isColored ? 'colorido/descolorido' : 'natural'} autêntico.`
  };
}

export const megaHairProductsCorrected: MegaHairProductCorrected[] = [
  // 40CM
  {
    id: 'mega-hair-40cm-liso-preto',
    sku: 'MEGA-40-LISO-PRETO',
    nome: 'Mega Hair Liso Ombré Grisalho 40cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair 100% cabelo humano brasileiro natural liso com efeito ombré castanho para loiro acinzentado, 40cm de comprimento, 100g. Perfeito para quem busca volume e comprimento moderado com efeito de iluminação natural.',
    imagens: ['/images/mega-hair/liso/40cm/grisalho-mix-liso-1a.jpg'],
    badge: 'COMPACTO',
    pricing: calculatePricing('Ombré Grisalho'),
    category: 'Mega Hair',
    length: 40,
    weight: '100g',
    type: 'liso',
    color: 'Ombré Grisalho',
    origin: 'Brasil',
    rating: 4.7,
    reviews: 156,
    inStock: true
  },
  {
    id: 'mega-hair-40cm-ondulado',
    sku: 'MEGA-40-OND',
    nome: 'Mega Hair Ondulado Preto 40cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair ondulado brasileiro preto natural 40cm, 100g. Ondas naturais tipo 3A, movimento perfeito e volume equilibrado.',
    imagens: ['/images/mega-hair/ondulado/40cm/preto-natural-ondulado-3a.jpg'],
    pricing: calculatePricing('Preto Natural'),
    category: 'Mega Hair',
    length: 40,
    weight: '100g',
    type: 'ondulado',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 4.6,
    reviews: 134,
    inStock: true
  },
  {
    id: 'mega-hair-40cm-cacheado',
    sku: 'MEGA-40-CACH',
    nome: 'Mega Hair Cacheado Ruivo 40cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair cacheado brasileiro ruivo intenso 40cm, 100g. Cachos tipo 3C definidos, volume natural e textura vibrante com tons cobre.',
    imagens: ['/images/mega-hair/cacheado/45cm/ruivo-cacheado-3c.jpg'],
    badge: 'CACHOS',
    pricing: calculatePricing('Ruivo Intenso'),
    category: 'Mega Hair',
    length: 40,
    weight: '100g',
    type: 'cacheado',
    color: 'Ruivo Intenso',
    origin: 'Brasil',
    rating: 4.8,
    reviews: 178,
    inStock: true
  },

  // 50CM
  {
    id: 'mega-hair-50cm-liso-preto',
    sku: 'MEGA-50-LISO-PRETO',
    nome: 'Mega Hair Liso Preto 50cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair 100% cabelo humano brasileiro natural liso preto, 50cm - nosso comprimento mais popular! 100g de puro luxo brasileiro.',
    imagens: ['/images/mega-hair/liso/50cm/preto-natural-liso-1a.jpg'],
    badge: 'BEST SELLER',
    pricing: calculatePricing('Preto Natural'),
    category: 'Mega Hair',
    length: 50,
    weight: '100g',
    type: 'liso',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 4.9,
    reviews: 342,
    inStock: true
  },
  {
    id: 'mega-hair-50cm-ondulado',
    sku: 'MEGA-50-OND',
    nome: 'Mega Hair Ondulado Preto 50cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair ondulado brasileiro preto natural 50cm, 100g. Ondas tipo 3A com balanço natural. Comprimento versátil e muito procurado.',
    imagens: ['/images/mega-hair/ondulado/40cm/preto-natural-ondulado-3a.jpg'],
    badge: 'POPULAR',
    pricing: calculatePricing('Preto Natural'),
    category: 'Mega Hair',
    length: 50,
    weight: '100g',
    type: 'ondulado',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 4.8,
    reviews: 289,
    inStock: true
  },
  {
    id: 'mega-hair-50cm-cacheado',
    sku: 'MEGA-50-CACH',
    nome: 'Mega Hair Cacheado Borgonha 50cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair cacheado brasileiro borgonha profunda 50cm, 100g. Cachos 3C vibrantes com movimento natural e reflexos roxo-avinados. Alta demanda!',
    imagens: ['/images/mega-hair/cacheado/55cm/borgonha-cacheado-3c.jpg'],
    badge: 'ALTA DEMANDA',
    pricing: calculatePricing('Borgonha Profunda'),
    category: 'Mega Hair',
    length: 50,
    weight: '100g',
    type: 'cacheado',
    color: 'Borgonha Profunda',
    origin: 'Brasil',
    rating: 4.9,
    reviews: 267,
    inStock: true
  },

  // 60CM
  {
    id: 'mega-hair-60cm-liso-preto',
    sku: 'MEGA-60-LISO-PRETO',
    nome: 'Mega Hair Liso Loiro Platinado 60cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair liso loiro platinado brasileiro 60cm, 100g. Comprimento longo sofisticado, transformação dramática com elegância e brilho premium.',
    imagens: ['/images/mega-hair/liso/60cm/loiro-platinado-liso-1a.jpg'],
    badge: 'SOFISTICADO',
    pricing: calculatePricing('Loiro Platinado'),
    category: 'Mega Hair',
    length: 60,
    weight: '100g',
    type: 'liso',
    color: 'Loiro Platinado',
    origin: 'Brasil',
    rating: 4.8,
    reviews: 198,
    inStock: true
  },
  {
    id: 'mega-hair-60cm-ondulado',
    sku: 'MEGA-60-OND',
    nome: 'Mega Hair Ondulado Preto 60cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair ondulado brasileiro preto natural 60cm, 100g. Ondas longas deslumbrantes tipo 2C, volume e movimento de sereia.',
    imagens: ['/images/mega-hair/ondulado/30cm/preto-natural-ondulado-2c.jpg'],
    badge: 'DESLUMBRANTE',
    pricing: calculatePricing('Preto Natural'),
    category: 'Mega Hair',
    length: 60,
    weight: '100g',
    type: 'ondulado',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 4.7,
    reviews: 167,
    inStock: true
  },
  {
    id: 'mega-hair-60cm-cacheado',
    sku: 'MEGA-60-CACH',
    nome: 'Mega Hair Cacheado Borgonha 60cm - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair cacheado brasileiro borgonha profunda 60cm, 100g. Cachos longos tipo 3C volumosos e dramáticos com reflexos roxos. Peça statement!',
    imagens: ['/images/mega-hair/cacheado/55cm/borgonha-cacheado-3c.jpg'],
    badge: 'STATEMENT',
    pricing: calculatePricing('Borgonha Profunda'),
    category: 'Mega Hair',
    length: 60,
    weight: '100g',
    type: 'cacheado',
    color: 'Borgonha Profunda',
    origin: 'Brasil',
    rating: 4.9,
    reviews: 145,
    inStock: true
  },

  // 70CM
  {
    id: 'mega-hair-70cm-liso-preto',
    sku: 'MEGA-70-LISO-PRETO',
    nome: 'Mega Hair Liso Preto 70cm Extra Long - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair liso preto brasileiro 70cm, 100g. Comprimento extra longo exclusivo, transformação de revista.',
    imagens: ['/images/mega-hair/liso/70cm/preto-natural-liso-1a.jpg'],
    badge: 'EXTRA LONG',
    pricing: calculatePricing('Preto Natural'),
    category: 'Mega Hair',
    length: 70,
    weight: '100g',
    type: 'liso',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 5.0,
    reviews: 89,
    inStock: true
  },
  {
    id: 'mega-hair-70cm-ondulado',
    sku: 'MEGA-70-OND',
    nome: 'Mega Hair Ondulado Preto 70cm Extra Long - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair ondulado brasileiro preto natural 70cm, 100g. Ondas extra longas tipo 2C, visual de deusa grega.',
    imagens: ['/images/mega-hair/ondulado/30cm/preto-natural-ondulado-2c.jpg'],
    badge: 'EXCLUSIVO',
    pricing: calculatePricing('Preto Natural'),
    category: 'Mega Hair',
    length: 70,
    weight: '100g',
    type: 'ondulado',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 4.9,
    reviews: 78,
    inStock: true
  },
  {
    id: 'mega-hair-70cm-cacheado',
    sku: 'MEGA-70-CACH',
    nome: 'Mega Hair Cacheado Borgonha 70cm Extra Long - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair cacheado brasileiro borgonha profunda 70cm, 100g. Cachos extra longos tipo 3C com reflexos roxos, volume máximo dramático.',
    imagens: ['/images/mega-hair/cacheado/55cm/borgonha-cacheado-3c.jpg'],
    badge: 'EXCLUSIVO',
    pricing: calculatePricing('Borgonha Profunda'),
    category: 'Mega Hair',
    length: 70,
    weight: '100g',
    type: 'cacheado',
    color: 'Borgonha Profunda',
    origin: 'Brasil',
    rating: 5.0,
    reviews: 67,
    inStock: true
  },

  // 80CM
  {
    id: 'mega-hair-80cm-liso-preto',
    sku: 'MEGA-80-LISO-PRETO',
    nome: 'Mega Hair Liso Castanho Chocolate 80cm Luxury - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair liso castanho chocolate brasileiro 80cm, 100g. Coleção Luxury - comprimento espetacular de passarela com tons ricos.',
    imagens: ['/images/mega-hair/liso/80cm/castanho-chocolate-liso-2a.jpg'],
    badge: 'LUXURY',
    pricing: calculatePricing('Castanho Chocolate'),
    category: 'Mega Hair',
    length: 80,
    weight: '100g',
    type: 'liso',
    color: 'Castanho Chocolate',
    origin: 'Brasil',
    rating: 5.0,
    reviews: 45,
    inStock: true
  },
  {
    id: 'mega-hair-80cm-ondulado',
    sku: 'MEGA-80-OND',
    nome: 'Mega Hair Ondulado Preto 80cm Luxury - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair ondulado brasileiro preto natural 80cm, 100g. Ondas luxury tipo 3A de cinema.',
    imagens: ['/images/mega-hair/ondulado/40cm/preto-natural-ondulado-3a.jpg'],
    badge: 'LUXURY',
    pricing: calculatePricing('Preto Natural'),
    category: 'Mega Hair',
    length: 80,
    weight: '100g',
    type: 'ondulado',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 5.0,
    reviews: 34,
    inStock: true
  },
  {
    id: 'mega-hair-80cm-cacheado',
    sku: 'MEGA-80-CACH',
    nome: 'Mega Hair Cacheado Ruivo 80cm Luxury - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair cacheado brasileiro ruivo intenso 80cm, 100g. Cachos luxury tipo 3C volumosos extremos com tons cobre.',
    imagens: ['/images/mega-hair/cacheado/45cm/ruivo-cacheado-3c.jpg'],
    badge: 'LUXURY',
    pricing: calculatePricing('Ruivo Intenso'),
    category: 'Mega Hair',
    length: 80,
    weight: '100g',
    type: 'cacheado',
    color: 'Ruivo Intenso',
    origin: 'Brasil',
    rating: 5.0,
    reviews: 28,
    inStock: true
  },

  // 90CM - RAPUNZEL COLLECTION
  {
    id: 'mega-hair-90cm-liso-preto',
    sku: 'MEGA-90-LISO-PRETO',
    nome: 'Mega Hair Liso Preto 90cm Rapunzel - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair 100% cabelo humano brasileiro liso preto natural, 90cm, 100g. Coleção Rapunzel - Nossa peça mais exclusiva e espetacular!',
    imagens: ['/images/mega-hair/liso/90cm/preto-natural-liso-2a.jpg'],
    badge: 'RAPUNZEL',
    pricing: calculatePricing('Preto Natural'),
    category: 'Mega Hair',
    length: 90,
    weight: '100g',
    type: 'liso',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 5.0,
    reviews: 19,
    inStock: true
  },
  {
    id: 'mega-hair-90cm-ondulado',
    sku: 'MEGA-90-OND',
    nome: 'Mega Hair Ondulado Preto 90cm Rapunzel - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair ondulado brasileiro preto natural 90cm, 100g. Ondas tipo 2C Rapunzel de conto de fadas, para quem sonha grande.',
    imagens: ['/images/mega-hair/ondulado/30cm/preto-natural-ondulado-2c.jpg'],
    badge: 'RAPUNZEL',
    pricing: calculatePricing('Preto Natural'),
    category: 'Mega Hair',
    length: 90,
    weight: '100g',
    type: 'ondulado',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 5.0,
    reviews: 15,
    inStock: true
  },
  {
    id: 'mega-hair-90cm-cacheado',
    sku: 'MEGA-90-CACH',
    nome: 'Mega Hair Cacheado Preto 90cm Rapunzel - 100g',
    marca: 'JC Hair Studio Premium',
    descricao: 'Mega Hair cacheado brasileiro preto natural 90cm, 100g. Cachos tipo 3C Rapunzel volumosos de princesa brasileira.',
    imagens: ['/images/mega-hair/cacheado/35cm/preto-natural-cacheado-3c.jpg'],
    badge: 'RAPUNZEL',
    pricing: calculatePricing('Preto Natural'),
    category: 'Mega Hair',
    length: 90,
    weight: '100g',
    type: 'cacheado',
    color: 'Preto Natural',
    origin: 'Brasil',
    rating: 5.0,
    reviews: 12,
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

// Legacy compatibility function for old pages that expect different structure
export function getLegacyCompatibleProducts() {
  return megaHairProductsCorrected.map(product => ({
    id: product.id,
    name: product.nome,
    price: product.pricing.discountPrice,
    originalPrice: product.pricing.ourPrice,
    image: product.imagens[0],
    category: product.category,
    rating: product.rating,
    reviews: product.reviews,
    badge: product.badge,
    length: product.length,
    type: product.type,
    color: product.color,
    inStock: product.inStock
  }));
}

export function generateUnifiedCatalog() {
  return megaHairProductsCorrected;
}

export default megaHairProductsCorrected;
