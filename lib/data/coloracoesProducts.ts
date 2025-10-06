/**
 * Colorações Capilares Products Data
 * Professional hair color products from Brazil with European pricing
 * Adjusted pricing strategy: €12.95-14.95 for 34-43% margins
 */

export interface ColoracaoProduct {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  imagens: string[];
  badge?: string;
  pricing: {
    basePrice: number;
    ourPrice: number;
    discountPrice: number;
    savings: number;
    margin: string;
    competitive: string;
  };
  category: string;
  shade: string;
  volume: string;
  type: 'permanente' | 'semi-permanente' | 'tonalizante';
  coverage: string;
  ammonia: boolean;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export const coloracoesProducts: ColoracaoProduct[] = [
  {
    id: 'coloracao-casting-creme-gloss-200',
    nome: 'Coloração Casting Creme Gloss 200 Preto Ébano',
    marca: "L'Oréal Paris",
    descricao: 'Coloração sem amônia Casting Creme Gloss no tom 200 Preto Ébano. Brilho intenso e duradouro com tratamento capilar integrado. Cobertura de 100% dos brancos com tonalidade profunda e rica.',
    imagens: ['/images/products/coloracoes/casting-200-preto-ebano.jpg'],
    badge: 'BESTSELLER',
    pricing: {
      basePrice: 12.95,
      ourPrice: 14.25,
      discountPrice: 11.40,
      savings: 2.85,
      margin: '43%',
      competitive: 'Preço europeu médio €15-18. Nossa oferta 20% mais acessível mantendo qualidade premium.'
    },
    category: 'Coloração',
    shade: '200 Preto Ébano',
    volume: '1 kit',
    type: 'semi-permanente',
    coverage: '100% brancos',
    ammonia: false,
    rating: 4.7,
    reviews: 234,
    inStock: true
  },
  {
    id: 'coloracao-casting-creme-gloss-300',
    nome: 'Coloração Casting Creme Gloss 300 Castanho Escuro',
    marca: "L'Oréal Paris",
    descricao: 'Coloração sem amônia Casting Creme Gloss no tom 300 Castanho Escuro. Reflexos naturais e brilho profissional com fórmula enriquecida. Duração de até 28 lavagens.',
    imagens: ['/images/products/coloracoes/casting-300-castanho-escuro.jpg'],
    badge: 'POPULAR',
    pricing: {
      basePrice: 12.95,
      ourPrice: 14.25,
      discountPrice: 11.40,
      savings: 2.85,
      margin: '43%',
      competitive: 'Preço europeu médio €15-18. Margem de 43% garante sustentabilidade.'
    },
    category: 'Coloração',
    shade: '300 Castanho Escuro',
    volume: '1 kit',
    type: 'semi-permanente',
    coverage: '100% brancos',
    ammonia: false,
    rating: 4.6,
    reviews: 198,
    inStock: true
  },
  {
    id: 'coloracao-casting-creme-gloss-400',
    nome: 'Coloração Casting Creme Gloss 400 Castanho Natural',
    marca: "L'Oréal Paris",
    descricao: 'Coloração sem amônia Casting Creme Gloss no tom 400 Castanho Natural. Tom versátil e atemporal com cobertura homogênea e brilho intenso. Fórmula com geleia real.',
    imagens: ['/images/products/coloracoes/casting-400-castanho-natural.jpg'],
    pricing: {
      basePrice: 12.95,
      ourPrice: 14.25,
      discountPrice: 11.40,
      savings: 2.85,
      margin: '43%',
      competitive: 'Baseado em colorações premium europeias. Tom universal mais vendido.'
    },
    category: 'Coloração',
    shade: '400 Castanho Natural',
    volume: '1 kit',
    type: 'semi-permanente',
    coverage: '100% brancos',
    ammonia: false,
    rating: 4.8,
    reviews: 312,
    inStock: true
  },
  {
    id: 'coloracao-casting-creme-gloss-500',
    nome: 'Coloração Casting Creme Gloss 500 Castanho Claro',
    marca: "L'Oréal Paris",
    descricao: 'Coloração sem amônia Casting Creme Gloss no tom 500 Castanho Claro. Resultado luminoso e natural com reflexos dourados sutis. Tratamento multidimensional para cabelos saudáveis.',
    imagens: ['/images/products/coloracoes/casting-500-castanho-claro.jpg'],
    pricing: {
      basePrice: 12.95,
      ourPrice: 14.25,
      discountPrice: 11.40,
      savings: 2.85,
      margin: '43%',
      competitive: 'Preço competitivo vs mercado europeu. Fórmula idêntica aos produtos vendidos em Portugal.'
    },
    category: 'Coloração',
    shade: '500 Castanho Claro',
    volume: '1 kit',
    type: 'semi-permanente',
    coverage: '100% brancos',
    ammonia: false,
    rating: 4.5,
    reviews: 167,
    inStock: true
  },
  {
    id: 'coloracao-casting-creme-gloss-600',
    nome: 'Coloração Casting Creme Gloss 600 Loiro Escuro',
    marca: "L'Oréal Paris",
    descricao: 'Coloração sem amônia Casting Creme Gloss no tom 600 Loiro Escuro. Transição perfeita do castanho para o loiro com resultado natural e brilhante. Enriquecida com geleia real nutritiva.',
    imagens: ['/images/products/coloracoes/casting-600-loiro-escuro.jpg'],
    badge: 'TRENDING',
    pricing: {
      basePrice: 13.50,
      ourPrice: 14.85,
      discountPrice: 11.88,
      savings: 2.97,
      margin: '40%',
      competitive: 'Tons loiros custam €16-19 na Europa. Nossa oferta 25% mais acessível.'
    },
    category: 'Coloração',
    shade: '600 Loiro Escuro',
    volume: '1 kit',
    type: 'semi-permanente',
    coverage: '100% brancos',
    ammonia: false,
    rating: 4.6,
    reviews: 203,
    inStock: true
  },
  {
    id: 'coloracao-casting-creme-gloss-700',
    nome: 'Coloração Casting Creme Gloss 700 Loiro Médio',
    marca: "L'Oréal Paris",
    descricao: 'Coloração sem amônia Casting Creme Gloss no tom 700 Loiro Médio. Loiro radiante e natural com reflexos dourados luminosos. Fórmula com proteção UV para durabilidade da cor.',
    imagens: ['/images/products/coloracoes/casting-700-loiro-medio.jpg'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 13.95,
      ourPrice: 15.35,
      discountPrice: 12.28,
      savings: 3.07,
      margin: '38%',
      competitive: 'Loiros premium custam €17-20 na Europa. Margem de 38% mantém competitividade.'
    },
    category: 'Coloração',
    shade: '700 Loiro Médio',
    volume: '1 kit',
    type: 'semi-permanente',
    coverage: '100% brancos',
    ammonia: false,
    rating: 4.7,
    reviews: 187,
    inStock: true
  },
  {
    id: 'coloracao-casting-creme-gloss-801',
    nome: 'Coloração Casting Creme Gloss 801 Loiro Claro Acinzentado',
    marca: "L'Oréal Paris",
    descricao: 'Coloração sem amônia Casting Creme Gloss no tom 801 Loiro Claro Acinzentado. Tom moderno e sofisticado com reflexos frios prateados. Ideal para cobrir brancos com elegância.',
    imagens: ['/images/products/coloracoes/casting-801-loiro-acinzentado.jpg'],
    badge: 'TRENDING',
    pricing: {
      basePrice: 14.50,
      ourPrice: 15.95,
      discountPrice: 12.76,
      savings: 3.19,
      margin: '36%',
      competitive: 'Tons acinzentados custam €18-22 na Europa. Nicho de mercado com demanda crescente.'
    },
    category: 'Coloração',
    shade: '801 Loiro Acinzentado',
    volume: '1 kit',
    type: 'semi-permanente',
    coverage: '100% brancos',
    ammonia: false,
    rating: 4.8,
    reviews: 145,
    inStock: true
  },
  {
    id: 'coloracao-casting-creme-gloss-803',
    nome: 'Coloração Casting Creme Gloss 803 Loiro Caramelo',
    marca: "L'Oréal Paris",
    descricao: 'Coloração sem amônia Casting Creme Gloss no tom 803 Loiro Caramelo. Tom quente e luminoso com reflexos dourados intensos. Resultado multidimensional e sofisticado.',
    imagens: ['/images/products/coloracoes/casting-803-loiro-caramelo.jpg'],
    badge: 'BESTSELLER',
    pricing: {
      basePrice: 14.50,
      ourPrice: 15.95,
      discountPrice: 12.76,
      savings: 3.19,
      margin: '36%',
      competitive: 'Tons caramelo são tendência na Europa a €18-22. Nossa oferta 30% mais acessível.'
    },
    category: 'Coloração',
    shade: '803 Loiro Caramelo',
    volume: '1 kit',
    type: 'semi-permanente',
    coverage: '100% brancos',
    ammonia: false,
    rating: 4.9,
    reviews: 278,
    inStock: true
  },
  {
    id: 'coloracao-casting-creme-gloss-1010',
    nome: 'Coloração Casting Creme Gloss 1010 Loiro Claríssimo Glacial',
    marca: "L'Oréal Paris",
    descricao: 'Coloração sem amônia Casting Creme Gloss no tom 1010 Loiro Claríssimo Glacial. Tom ultra claro com reflexos frios cristalinos. Para loiras que buscam máximo impacto visual.',
    imagens: ['/images/products/coloracoes/casting-1010-loiro-glacial.jpg'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 14.95,
      ourPrice: 16.45,
      discountPrice: 13.16,
      savings: 3.29,
      margin: '34%',
      competitive: 'Loiros ultra claros custam €19-24 na Europa. Produto premium com margem de 34%.'
    },
    category: 'Coloração',
    shade: '1010 Loiro Glacial',
    volume: '1 kit',
    type: 'semi-permanente',
    coverage: '100% brancos',
    ammonia: false,
    rating: 4.7,
    reviews: 192,
    inStock: true
  },
  {
    id: 'coloracao-casting-creme-gloss-1021',
    nome: 'Coloração Casting Creme Gloss 1021 Loiro Claro Pérola',
    marca: "L'Oréal Paris",
    descricao: 'Coloração sem amônia Casting Creme Gloss no tom 1021 Loiro Claro Pérola. Tom ultra luminoso com reflexos perolados exclusivos. Sofisticação máxima e brilho diamante.',
    imagens: ['/images/products/coloracoes/casting-1021-loiro-perola.jpg'],
    badge: 'EXCLUSIVO',
    pricing: {
      basePrice: 14.95,
      ourPrice: 16.45,
      discountPrice: 13.16,
      savings: 3.29,
      margin: '34%',
      competitive: 'Tons perolados são exclusivos a €20-25 na Europa. Nosso preço 35% mais competitivo.'
    },
    category: 'Coloração',
    shade: '1021 Loiro Pérola',
    volume: '1 kit',
    type: 'semi-permanente',
    coverage: '100% brancos',
    ammonia: false,
    rating: 4.8,
    reviews: 167,
    inStock: true
  }
];

// Helper functions
export function getColoracoesByShade(shade: string): ColoracaoProduct[] {
  return coloracoesProducts.filter(product => 
    product.shade.toLowerCase().includes(shade.toLowerCase())
  );
}

export function getColoracoesById(id: string): ColoracaoProduct | undefined {
  return coloracoesProducts.find(product => product.id === id);
}

export function getColoracoesByType(type: 'permanente' | 'semi-permanente' | 'tonalizante'): ColoracaoProduct[] {
  return coloracoesProducts.filter(product => product.type === type);
}

export function getAmmoniaFreeColoracoes(): ColoracaoProduct[] {
  return coloracoesProducts.filter(product => !product.ammonia);
}

export default coloracoesProducts;
