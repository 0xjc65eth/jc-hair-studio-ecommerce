/**
 * Progressivas & BTX Products
 * Professional hair straightening and botox treatments from Brazil
 * Based on PLANILHA-DETALHADA-PRODUTOS-IMPORTACAO.csv (lines 28-47)
 */

export interface ProgressivaProduct {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  imagens: string[];
  badge?: string;
  pricing: {
    basePrice: number;      // Custo Brasil em €
    ourPrice: number;        // Preço venda
    discountPrice: number;   // Preço com desconto
    savings: number;         // Economia
    margin: string;          // Margem %
    competitive: string;     // Posicionamento competitivo
  };
  category: string;
  volume: string;
  type: 'progressiva' | 'btx' | 'sistema';
  rating: number;
  reviews: number;
  inStock: boolean;
  sku: string;
}

export const progressivasProducts: ProgressivaProduct[] = [
  // BEST-SELLERS PREMIUM
  {
    id: 'cadiveu-brasil-cacau-1l',
    sku: 'CAD-BC-1L',
    nome: 'Brasil Cacau Progressiva 1L',
    marca: 'Cadiveu',
    descricao: 'Progressiva profissional Brasil Cacau 1L - O best-seller absoluto na Europa! Alisamento perfeito com cacau brasileiro, alta demanda garantida. Resultado profissional duradouro até 4 meses.',
    imagens: ['/images/products/cadiveu/cadiveu-1.png'],
    badge: 'BEST SELLER',
    pricing: {
      basePrice: 60.00,
      ourPrice: 195.60,
      discountPrice: 175.90,
      savings: 19.70,
      margin: '56.5%',
      competitive: 'Preço competitivo vs mercado europeu onde progressivas profissionais custam €220-280. Cadiveu é marca reconhecida.'
    },
    category: 'Progressivas & BTX',
    volume: '1000ml',
    type: 'progressiva',
    rating: 4.9,
    reviews: 342,
    inStock: true
  },
  {
    id: 'cadiveu-brasil-cacau-300ml',
    sku: 'CAD-BC-300',
    nome: 'Brasil Cacau Progressiva 300ml',
    marca: 'Cadiveu',
    descricao: 'Brasil Cacau 300ml - Tamanho travel perfeito para testes. Mesma qualidade profissional em formato menor, ideal para clientes que querem experimentar antes de comprar o litro.',
    imagens: ['/images/products/cadiveu/cadiveu-2.png'],
    badge: 'TRAVEL SIZE',
    pricing: {
      basePrice: 20.00,
      ourPrice: 73.90,
      discountPrice: 66.50,
      savings: 7.40,
      margin: '59.4%',
      competitive: 'Ótima opção vs progressivas travel na Europa (€80-95). Excelente margem e conversão para produto maior.'
    },
    category: 'Progressivas & BTX',
    volume: '300ml',
    type: 'progressiva',
    rating: 4.8,
    reviews: 189,
    inStock: true
  },

  // FOREVER LISS BTX LINE
  {
    id: 'forever-liss-btx-250g',
    sku: 'FL-BTX-250',
    nome: 'Forever Liss BTX Capilar 250g',
    marca: 'Forever Liss',
    descricao: 'BTX Capilar Forever Liss 250g - Produto entry-level com ótima margem. Reconstrução profunda, reduz volume e frizz, resultado botox sem formol. Ideal para iniciantes.',
    imagens: ['/images/products/forever-liss/forever-liss-1.png'],
    badge: 'ENTRY LEVEL',
    pricing: {
      basePrice: 13.64,
      ourPrice: 52.90,
      discountPrice: 47.60,
      savings: 5.30,
      margin: '58.4%',
      competitive: 'Preço acessível vs BTX europeus (€65-85). Marca brasileira autêntica com excelente custo-benefício.'
    },
    category: 'Progressivas & BTX',
    volume: '250g',
    type: 'btx',
    rating: 4.7,
    reviews: 256,
    inStock: true
  },
  {
    id: 'forever-liss-btx-1kg',
    sku: 'FL-BTX-1K',
    nome: 'Forever Liss BTX Capilar 1kg Profissional',
    marca: 'Forever Liss',
    descricao: 'BTX Profissional 1kg Forever Liss - Tamanho salão com recompra frequente garantida. Tratamento intensivo de reconstrução, máxima economia para profissionais.',
    imagens: ['/images/products/forever-liss/forever-liss-2.png'],
    badge: 'PROFISSIONAL',
    pricing: {
      basePrice: 40.00,
      ourPrice: 162.90,
      discountPrice: 146.60,
      savings: 16.30,
      margin: '61.9%',
      competitive: 'Excelente valor vs BTX profissionais europeus (€180-220). Alta margem e recompra garantida.'
    },
    category: 'Progressivas & BTX',
    volume: '1000g',
    type: 'btx',
    rating: 4.9,
    reviews: 412,
    inStock: true
  },

  // BTX PROFESSIONAL LINE
  {
    id: 'btx-professional-250g',
    sku: 'BTX-PRO-01',
    nome: 'BTX Professional 250g',
    marca: 'Genérico Pro',
    descricao: 'BTX Professional 250g - Possibilidade de marca própria com margem alta. Qualidade profissional garantida, ótima aceitação no mercado europeu.',
    imagens: ['/images/products/botox/botox_1.png'],
    pricing: {
      basePrice: 11.82,
      ourPrice: 52.90,
      discountPrice: 47.60,
      savings: 5.30,
      margin: '62.2%',
      competitive: 'Marca própria permite posicionamento único vs concorrência europeia (€60-75).'
    },
    category: 'Progressivas & BTX',
    volume: '250g',
    type: 'btx',
    rating: 4.6,
    reviews: 178,
    inStock: true
  },
  {
    id: 'progressiva-advanced-300ml',
    sku: 'PROG-ADV-02',
    nome: 'Progressiva Advanced 300ml',
    marca: 'Linha Pro',
    descricao: 'Progressiva Advanced 300ml - Alta rotatividade garantida. Fórmula avançada para alisamento perfeito, resultado profissional em casa.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_7.png'],
    pricing: {
      basePrice: 17.27,
      ourPrice: 73.90,
      discountPrice: 66.50,
      savings: 7.40,
      margin: '62.1%',
      competitive: 'Preço atrativo vs progressivas europeias entry-level (€85-100).'
    },
    category: 'Progressivas & BTX',
    volume: '300ml',
    type: 'progressiva',
    rating: 4.5,
    reviews: 145,
    inStock: true
  },
  {
    id: 'btx-repair-250g',
    sku: 'BTX-REP-03',
    nome: 'BTX Repair 250g',
    marca: 'Linha Pro',
    descricao: 'BTX Repair 250g - Reparação intensa com boa aceitação no mercado. Reconstrói fibra capilar danificada, reduz quebra e pontas duplas.',
    imagens: ['/images/products/botox/botox_3.png'],
    pricing: {
      basePrice: 12.36,
      ourPrice: 52.90,
      discountPrice: 47.60,
      savings: 5.30,
      margin: '60.3%',
      competitive: 'Boa margem vs tratamentos reparadores europeus (€58-70).'
    },
    category: 'Progressivas & BTX',
    volume: '250g',
    type: 'btx',
    rating: 4.7,
    reviews: 203,
    inStock: true
  },

  // PREMIUM SPECIALTY LINE
  {
    id: 'progressiva-keratin-300ml',
    sku: 'PROG-KER-04',
    nome: 'Progressiva Keratin Complex 300ml',
    marca: 'Keratin Complex',
    descricao: 'Progressiva com Queratina 300ml - Premium positioning. Enriquecida com queratina hidrolisada para máxima reconstrução e alisamento.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_8.png'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 17.82,
      ourPrice: 73.90,
      discountPrice: 66.50,
      savings: 7.40,
      margin: '62.1%',
      competitive: 'Posicionamento premium vs progressivas com queratina europeias (€90-120).'
    },
    category: 'Progressivas & BTX',
    volume: '300ml',
    type: 'progressiva',
    rating: 4.8,
    reviews: 267,
    inStock: true
  },
  {
    id: 'btx-collagen-250g',
    sku: 'BTX-COL-05',
    nome: 'BTX Collagen 250g',
    marca: 'Collagen Line',
    descricao: 'BTX com Colágeno 250g - Ingrediente em alta no mercado. Colágeno marinho para máxima elasticidade e recuperação capilar.',
    imagens: ['/images/products/botox/botox_4.png'],
    badge: 'COLÁGENO',
    pricing: {
      basePrice: 12.73,
      ourPrice: 52.90,
      discountPrice: 47.60,
      savings: 5.30,
      margin: '60.2%',
      competitive: 'Trend ingredient vs produtos com colágeno europeus (€65-80).'
    },
    category: 'Progressivas & BTX',
    volume: '250g',
    type: 'btx',
    rating: 4.6,
    reviews: 192,
    inStock: true
  },
  {
    id: 'progressiva-silk-300ml',
    sku: 'PROG-SILK-06',
    nome: 'Progressiva Silk Protein 300ml',
    marca: 'Silk Protein',
    descricao: 'Progressiva Silk 300ml - Diferencial com proteína de seda natural. Alisamento com brilho intenso e toque sedoso incomparável.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_9.png'],
    badge: 'SILK',
    pricing: {
      basePrice: 16.73,
      ourPrice: 73.90,
      discountPrice: 66.50,
      savings: 7.40,
      margin: '62.2%',
      competitive: 'Diferenciação com seda vs progressivas standard europeias (€88-105).'
    },
    category: 'Progressivas & BTX',
    volume: '300ml',
    type: 'progressiva',
    rating: 4.7,
    reviews: 223,
    inStock: true
  },
  {
    id: 'btx-vitamin-250g',
    sku: 'BTX-VIT-07',
    nome: 'BTX Vitamin Complex 250g',
    marca: 'Vitamin Complex',
    descricao: 'BTX Vitamínico 250g - Rico em complexo vitamínico. Vitaminas A, E, B5, C para nutrição profunda e fortalecimento.',
    imagens: ['/images/products/botox/botox_6.png'],
    badge: 'VITAMINAS',
    pricing: {
      basePrice: 13.09,
      ourPrice: 52.90,
      discountPrice: 47.60,
      savings: 5.30,
      margin: '58.4%',
      competitive: 'Rico em vitaminas vs BTX europeus básicos (€60-72).'
    },
    category: 'Progressivas & BTX',
    volume: '250g',
    type: 'btx',
    rating: 4.5,
    reviews: 167,
    inStock: true
  },

  // ADVANCED TECHNOLOGY LINE
  {
    id: 'progressiva-nano-300ml',
    sku: 'PROG-NANO-08',
    nome: 'Progressiva Nano Tech 300ml',
    marca: 'Nano Tech',
    descricao: 'Progressiva Nano 300ml - Tecnologia avançada com nanotecnologia. Partículas ultra pequenas penetram profundamente na fibra capilar.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_10.png'],
    badge: 'NANO TECH',
    pricing: {
      basePrice: 19.09,
      ourPrice: 73.90,
      discountPrice: 66.50,
      savings: 7.40,
      margin: '59.4%',
      competitive: 'Tecnologia avançada vs progressivas europeias tradicionais (€95-115).'
    },
    category: 'Progressivas & BTX',
    volume: '300ml',
    type: 'progressiva',
    rating: 4.8,
    reviews: 198,
    inStock: true
  },
  {
    id: 'btx-argan-250g',
    sku: 'BTX-ARG-09',
    nome: 'BTX Argan Oil 250g',
    marca: 'Argan Oil',
    descricao: 'BTX com Óleo de Argan Puro 250g - Argan marroquino autêntico. Máxima hidratação e reparação com óleo de argan 100% puro.',
    imagens: ['/images/products/botox/botox_2.png'],
    badge: 'ARGAN PURO',
    pricing: {
      basePrice: 14.18,
      ourPrice: 52.90,
      discountPrice: 47.60,
      savings: 5.30,
      margin: '58.3%',
      competitive: 'Argan puro vs BTX europeus com óleo (€68-82).'
    },
    category: 'Progressivas & BTX',
    volume: '250g',
    type: 'btx',
    rating: 4.9,
    reviews: 289,
    inStock: true
  },
  {
    id: 'progressiva-diamond-300ml',
    sku: 'PROG-DIA-10',
    nome: 'Progressiva Diamond Line 300ml',
    marca: 'Diamond Line',
    descricao: 'Progressiva Diamond 300ml - Linha premium diamante. Partículas de diamante para brilho incomparável e proteção UV.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_12.png'],
    badge: 'DIAMOND',
    pricing: {
      basePrice: 19.64,
      ourPrice: 73.90,
      discountPrice: 66.50,
      savings: 7.40,
      margin: '59.2%',
      competitive: 'Linha premium diamante vs progressivas luxury europeias (€98-125).'
    },
    category: 'Progressivas & BTX',
    volume: '300ml',
    type: 'progressiva',
    rating: 4.7,
    reviews: 176,
    inStock: true
  },

  // SISTEMA COMPLETO
  {
    id: 'sistema-progressivo-300ml',
    sku: 'SIST-PROG-11',
    nome: 'Sistema Progressivo Completo 300ml',
    marca: 'Pro System',
    descricao: 'Sistema Progressivo 3 passos 300ml - Kit completo profissional. Pré-shampoo + Progressiva + Máscara seladora para resultado perfeito.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_13.png'],
    badge: 'KIT COMPLETO',
    pricing: {
      basePrice: 18.18,
      ourPrice: 73.90,
      discountPrice: 66.50,
      savings: 7.40,
      margin: '60.8%',
      competitive: 'Sistema completo vs kits europeus (€95-120). Tudo em um para resultado profissional.'
    },
    category: 'Progressivas & BTX',
    volume: '300ml',
    type: 'sistema',
    rating: 4.8,
    reviews: 234,
    inStock: true
  },
  {
    id: 'btx-ultra-250g',
    sku: 'BTX-ULT-12',
    nome: 'BTX Ultra 250g',
    marca: 'Ultra Line',
    descricao: 'BTX Ultra 250g - Resultado intenso máximo. Fórmula ultra concentrada para transformações dramáticas em cabelos muito danificados.',
    imagens: ['/images/products/botox/botox_7.png'],
    badge: 'ULTRA INTENSO',
    pricing: {
      basePrice: 13.64,
      ourPrice: 52.90,
      discountPrice: 47.60,
      savings: 5.30,
      margin: '58.4%',
      competitive: 'Resultado intenso vs BTX europeus standard (€62-78).'
    },
    category: 'Progressivas & BTX',
    volume: '250g',
    type: 'btx',
    rating: 4.6,
    reviews: 211,
    inStock: true
  },

  // LUXURY COLLECTION
  {
    id: 'luxury-progressive-300ml',
    sku: 'LUX-PROG-13',
    nome: 'Luxury Progressive Gold System 300ml',
    marca: 'Gold System',
    descricao: 'Progressiva Luxury Gold 300ml - Posicionamento alto luxo. Ouro coloidal 24k + ácido hialurônico para resultado de salão VIP.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_14.png'],
    badge: 'LUXO',
    pricing: {
      basePrice: 20.36,
      ourPrice: 73.90,
      discountPrice: 66.50,
      savings: 7.40,
      margin: '58.1%',
      competitive: 'Luxury positioning vs progressivas gold europeias (€110-145).'
    },
    category: 'Progressivas & BTX',
    volume: '300ml',
    type: 'progressiva',
    rating: 4.9,
    reviews: 156,
    inStock: true
  },
  {
    id: 'btx-professional-advanced-250g',
    sku: 'BTX-PRO-14',
    nome: 'Professional BTX Advanced Pro 250g',
    marca: 'Advanced Pro',
    descricao: 'BTX Professional Advanced 250g - Fórmula profissional exclusiva. Desenvolvido para cabeleireiros exigentes, resultado de alta performance.',
    imagens: ['/images/products/botox/botox_8.png'],
    badge: 'PRO',
    pricing: {
      basePrice: 13.27,
      ourPrice: 52.90,
      discountPrice: 47.60,
      savings: 5.30,
      margin: '58.5%',
      competitive: 'Fórmula pro vs BTX profissionais europeus (€65-80).'
    },
    category: 'Progressivas & BTX',
    volume: '250g',
    type: 'btx',
    rating: 4.7,
    reviews: 245,
    inStock: true
  },
  {
    id: 'btx-premium-diamond-250g',
    sku: 'BTX-PREM-15',
    nome: 'Premium BTX Diamond Collection 250g',
    marca: 'Diamond Collection',
    descricao: 'BTX Premium Diamond 250g - Coleção especial diamante. Partículas de diamante + ceramidas para brilho espelhado duradouro.',
    imagens: ['/images/products/botox/botox_9.png'],
    badge: 'DIAMOND',
    pricing: {
      basePrice: 13.82,
      ourPrice: 52.90,
      discountPrice: 47.60,
      savings: 5.30,
      margin: '58.3%',
      competitive: 'Coleção especial vs BTX premium europeus (€66-82).'
    },
    category: 'Progressivas & BTX',
    volume: '250g',
    type: 'btx',
    rating: 4.8,
    reviews: 198,
    inStock: true
  },
  {
    id: 'royal-progressive-300ml',
    sku: 'ROYAL-PROG-16',
    nome: 'Royal Progressive Platinum System 300ml',
    marca: 'Platinum System',
    descricao: 'Progressiva Royal Platinum 300ml - Top de linha absoluto. Platina coloidal + caviar + trufa negra para transformação imperial.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_15.png'],
    badge: 'ROYAL',
    pricing: {
      basePrice: 20.91,
      ourPrice: 73.90,
      discountPrice: 66.50,
      savings: 7.40,
      margin: '58.0%',
      competitive: 'Top de linha vs progressivas platinum europeias (€120-160). Máximo luxo.'
    },
    category: 'Progressivas & BTX',
    volume: '300ml',
    type: 'progressiva',
    rating: 5.0,
    reviews: 134,
    inStock: true
  }
];

// Helper functions
export function getProgressivasByType(type: 'progressiva' | 'btx' | 'sistema'): ProgressivaProduct[] {
  return progressivasProducts.filter(p => p.type === type);
}

export function getProgressivasById(id: string): ProgressivaProduct | undefined {
  return progressivasProducts.find(p => p.id === id);
}

export function getProgressivasBySku(sku: string): ProgressivaProduct | undefined {
  return progressivasProducts.find(p => p.sku === sku);
}

export function getPremiumProgressivas(): ProgressivaProduct[] {
  return progressivasProducts.filter(p => 
    p.badge && ['PREMIUM', 'LUXO', 'DIAMOND', 'ROYAL'].includes(p.badge)
  );
}

export default progressivasProducts;
