/**
 * CATEGORIAS PREMIUM - LIFESTYLE BRASILEIRO COMPLETO
 * Sistema expandido para dominar todos os segmentos de beleza e autocuidado
 */

export type LifestyleCategory =
  | 'perfumes-brasileiros'
  | 'skincare-brasileiro'
  | 'wellness-spa'
  | 'fitness-suplementos'
  | 'moda-intima'
  | 'acessorios-beleza'
  | 'unhas-nail-art'
  | 'bronzeamento'
  | 'anti-idade'
  | 'cabelo-afro'
  | 'homem-brasileiro'
  | 'teen-jovem';

// PERFUMES BRASILEIROS - Mercado Premium
export const perfumesBrasileiros = [
  {
    id: 'perf-001',
    name: 'Perfume Natura Ekos Castanha 100ml',
    brand: 'Natura',
    category: 'Perfumaria',
    price: 89.90,
    originalPrice: 120.00,
    image: '/images/perfumes/natura-ekos-castanha.jpg',
    description: 'Perfume brasileiro com essência de castanha da Amazônia. Fragrância única e sustentável que representa a biodiversidade brasileira.',
    notes: ['Castanha', 'Baunilha', 'Sândalo'],
    seoKeywords: [
      'perfume natura original',
      'perfume brasileiro europa',
      'natura ekos portugal',
      'perfume amazônia',
      'fragrância brasileira premium'
    ],
    rating: 4.9,
    reviews: 234,
    inStock: true,
    isExclusive: true
  },
  {
    id: 'perf-002',
    name: 'Boticário Malbec Tradicional 100ml',
    brand: 'O Boticário',
    category: 'Perfumaria Masculina',
    price: 75.50,
    originalPrice: 95.00,
    image: '/images/perfumes/boticario-malbec.jpg',
    description: 'O perfume masculino mais vendido do Brasil. Fragrância marcante e sofisticada que conquista na Europa.',
    notes: ['Uva Malbec', 'Couro', 'Madeiras Nobres'],
    seoKeywords: [
      'malbec boticário original',
      'perfume masculino brasileiro',
      'boticário portugal',
      'malbec europa entrega',
      'perfume homem brasileiro'
    ],
    rating: 4.8,
    reviews: 445,
    inStock: true,
    isBestSeller: true
  }
];

// SKINCARE BRASILEIRO - Produtos Únicos
export const skincareBrasileiro = [
  {
    id: 'skin-001',
    name: 'Sérum Vitamin C Sallve 30ml',
    brand: 'Sallve',
    category: 'Skincare',
    price: 65.90,
    image: '/images/skincare/sallve-vitamin-c.jpg',
    description: 'Sérum de Vitamina C brasileiro com tecnologia avançada. Clareamento e anti-idade com ingredientes da flora brasileira.',
    benefits: ['Clareamento', 'Anti-idade', 'Hidratação', 'Proteção'],
    seoKeywords: [
      'sallve vitamina c original',
      'skincare brasileiro europa',
      'sérum brasileiro portugal',
      'sallve portugal entrega',
      'vitamina c brasileira'
    ],
    rating: 4.7,
    reviews: 189,
    inStock: true
  },
  {
    id: 'skin-002',
    name: 'Protetor Solar Episol Color 60fps',
    brand: 'Episol',
    category: 'Proteção Solar',
    price: 45.90,
    image: '/images/skincare/episol-color.jpg',
    description: 'Protetor solar brasileiro com cor universal. Proteção FPS 60 desenvolvida para clima tropical, perfeita para Europa.',
    benefits: ['FPS 60', 'Com Cor', 'Resistente à água', 'Não oleoso'],
    seoKeywords: [
      'episol color original',
      'protetor solar brasileiro',
      'episol fps 60 europa',
      'protetor solar com cor',
      'skincare brasil portugal'
    ],
    rating: 4.6,
    reviews: 267,
    inStock: true
  }
];

// WELLNESS & SPA BRASILEIRO
export const wellnessBrasileiro = [
  {
    id: 'well-001',
    name: 'Kit Banho Relaxante Granado',
    brand: 'Granado',
    category: 'Banho & Corpo',
    price: 89.90,
    image: '/images/wellness/granado-banho-kit.jpg',
    description: 'Kit de banho luxuoso da marca centenária Granado. Tradição brasileira em cosméticos desde 1870.',
    includes: ['Sabonete Líquido', 'Hidratante Corporal', 'Óleo Relaxante'],
    seoKeywords: [
      'granado produtos originais',
      'kit banho brasileiro',
      'granado europa entrega',
      'cosméticos brasileiros tradição',
      'wellness brasileiro portugal'
    ],
    rating: 4.8,
    reviews: 156,
    inStock: true,
    isLuxury: true
  }
];

// UNHAS & NAIL ART BRASILEIRAS
export const unhasNailArt = [
  {
    id: 'nail-001',
    name: 'Coleção Esmaltes Risqué 12 Cores',
    brand: 'Risqué',
    category: 'Nail Art',
    price: 89.90,
    originalPrice: 120.00,
    image: '/images/nails/risque-collection-12.jpg',
    description: 'Coleção exclusiva de esmaltes Risqué com as cores mais tendência do Brasil. Qualidade profissional para nail art.',
    colors: ['Vermelho Passional', 'Rosa Chic', 'Nude Brasileiro', 'Preto Intenso'],
    seoKeywords: [
      'esmalte risqué original',
      'nail art brasileira',
      'risqué portugal entrega',
      'esmaltes brasileiros europa',
      'nail art profissional brasil'
    ],
    rating: 4.7,
    reviews: 334,
    inStock: true
  }
];

// FITNESS & SUPLEMENTOS BRASILEIROS
export const fitnessBrasileiro = [
  {
    id: 'fit-001',
    name: 'Whey Protein Integralmedica 900g',
    brand: 'IntegralMedica',
    category: 'Suplementos',
    price: 89.90,
    image: '/images/fitness/integralmedica-whey.jpg',
    description: 'Whey protein brasileiro premium com certificação internacional. Fórmula desenvolvida para o biotipo brasileiro.',
    flavors: ['Chocolate', 'Baunilha', 'Morango'],
    seoKeywords: [
      'whey protein brasileiro',
      'integralmedica europa',
      'suplemento brasileiro portugal',
      'whey brasil original',
      'fitness brasileiro europa'
    ],
    rating: 4.9,
    reviews: 567,
    inStock: true
  }
];

// MODA ÍNTIMA BRASILEIRA
export const modaIntimaBrasileira = [
  {
    id: 'ling-001',
    name: 'Conjunto Lingerie Hope Premium',
    brand: 'Hope',
    category: 'Lingerie',
    price: 149.90,
    originalPrice: 199.90,
    image: '/images/lingerie/hope-conjunto-premium.jpg',
    description: 'Lingerie brasileira de luxo da marca Hope. Design exclusivo e qualidade premium reconhecida mundialmente.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Nude', 'Vermelho'],
    seoKeywords: [
      'lingerie hope original',
      'moda íntima brasileira',
      'hope portugal entrega',
      'lingerie brasileira europa',
      'moda íntima premium brasil'
    ],
    rating: 4.8,
    reviews: 234,
    inStock: true,
    isLuxury: true
  }
];

// HOMEM BRASILEIRO - Linha Masculina
export const homemBrasileiro = [
  {
    id: 'masc-001',
    name: 'Kit Barba Completo QOD Barber Shop',
    brand: 'QOD',
    category: 'Cuidados Masculinos',
    price: 129.90,
    image: '/images/masculino/qod-barba-kit.jpg',
    description: 'Kit completo para cuidados com barba desenvolvido no Brasil. Produtos premium para o homem moderno.',
    includes: ['Shampoo para Barba', 'Condicionador', 'Óleo', 'Balm'],
    seoKeywords: [
      'kit barba brasileiro',
      'qod barber shop original',
      'cuidados masculinos brasil',
      'produtos homem brasileiro',
      'barba brasileira europa'
    ],
    rating: 4.9,
    reviews: 189,
    inStock: true
  }
];

// TEEN & JOVEM BRASILEIRO
export const teenBrasileiro = [
  {
    id: 'teen-001',
    name: 'Kit Teen Acne Episol + Sallve',
    brand: 'Multi-marca',
    category: 'Teen Care',
    price: 89.90,
    image: '/images/teen/teen-acne-kit.jpg',
    description: 'Kit especial para adolescentes com produtos brasileiros para combater acne e oleosidade.',
    includes: ['Gel de Limpeza', 'Tônico', 'Hidratante', 'Protetor Solar'],
    seoKeywords: [
      'skincare teen brasileiro',
      'produtos acne brasil',
      'cuidados adolescente brasileiro',
      'teen care brasil europa',
      'skincare jovem brasileiro'
    ],
    rating: 4.6,
    reviews: 234,
    inStock: true
  }
];

// MAPPING DE CATEGORIAS PARA SEO
export const LIFESTYLE_SEO_MAPPING = {
  'perfumes-brasileiros': {
    title: 'Perfumes Brasileiros Originais',
    description: 'Perfumes e fragrâncias brasileiras premium com entrega Europa',
    keywords: [
      'perfumes brasileiros originais',
      'natura boticário europa',
      'fragrâncias brasil portugal',
      'perfume brasileiro bélgica',
      'essências amazônia europa'
    ],
    volume: 'Alto', // 3.2k buscas/mês
    competition: 'Média'
  },

  'skincare-brasileiro': {
    title: 'Skincare Brasileiro Premium',
    description: 'Produtos de skincare brasileiros com ingredientes únicos da flora brasileira',
    keywords: [
      'skincare brasileiro europa',
      'sallve episol portugal',
      'cosméticos brasileiros premium',
      'skincare brasil bélgica',
      'produtos pele brasileiros'
    ],
    volume: 'Muito Alto', // 4.8k buscas/mês
    competition: 'Baixa'
  },

  'wellness-spa': {
    title: 'Wellness & Spa Brasileiro',
    description: 'Produtos wellness e spa brasileiros para autocuidado e relaxamento',
    keywords: [
      'wellness brasileiro europa',
      'spa brasileiro portugal',
      'autocuidado brasileiro',
      'relaxamento brasil europa',
      'bem estar brasileiro'
    ],
    volume: 'Médio', // 1.8k buscas/mês
    competition: 'Baixa'
  },

  'unhas-nail-art': {
    title: 'Nail Art Brasileira',
    description: 'Esmaltes e produtos para nail art das melhores marcas brasileiras',
    keywords: [
      'esmaltes brasileiros europa',
      'risqué portugal entrega',
      'nail art brasileira',
      'esmaltes brasil bélgica',
      'unhas brasileiras europa'
    ],
    volume: 'Alto', // 2.9k buscas/mês
    competition: 'Média'
  },

  'fitness-suplementos': {
    title: 'Fitness & Suplementos Brasileiros',
    description: 'Suplementos e produtos fitness brasileiros premium para Europa',
    keywords: [
      'suplementos brasileiros europa',
      'whey protein brasil portugal',
      'fitness brasileiro bélgica',
      'integralmedica europa',
      'suplementos brasil originais'
    ],
    volume: 'Muito Alto', // 5.2k buscas/mês
    competition: 'Alta'
  },

  'moda-intima': {
    title: 'Moda Íntima Brasileira',
    description: 'Lingerie e moda íntima brasileira premium com design exclusivo',
    keywords: [
      'lingerie brasileira europa',
      'hope portugal entrega',
      'moda íntima brasil bélgica',
      'lingerie brasil premium',
      'hope lingerie original'
    ],
    volume: 'Alto', // 3.1k buscas/mês
    competition: 'Média'
  },

  'homem-brasileiro': {
    title: 'Produtos Masculinos Brasileiros',
    description: 'Linha completa de cuidados masculinos das melhores marcas brasileiras',
    keywords: [
      'produtos masculinos brasileiros',
      'cuidados homem brasil europa',
      'barba brasileira portugal',
      'cosméticos masculinos brasil',
      'homem brasileiro europa'
    ],
    volume: 'Médio', // 2.1k buscas/mês
    competition: 'Baixa'
  }
};

// ESTRATÉGIA DE PALAVRAS-CHAVE POR INTENÇÃO
export const SEO_INTENT_MAPPING = {
  // Intenção Comercial (Compra Imediata)
  commercial: [
    'comprar perfume natura europa',
    'boticário online portugal',
    'sallve vitamina c preço',
    'onde comprar produtos brasileiros europa',
    'loja brasileira online portugal'
  ],

  // Intenção Informacional (Pesquisa/Educação)
  informational: [
    'diferença skincare brasileiro americano',
    'benefícios produtos naturais brasil',
    'como usar vitamina c sallve',
    'perfumes brasileiros mais vendidos',
    'rotina skincare brasileira'
  ],

  // Intenção Navegacional (Marca Específica)
  navigational: [
    'natura portugal site oficial',
    'boticário europa entrega',
    'sallve produtos onde comprar',
    'jc hair studio 62 loja',
    'produtos brasileiros autênticos'
  ],

  // Intenção Transacional (Pronto para Comprar)
  transactional: [
    'natura perfume desconto europa',
    'kit skincare brasileiro promoção',
    'frete grátis produtos brasil portugal',
    'entrega rápida cosméticos brasileiros',
    'cashback produtos brasileiros'
  ]
};

export default {
  perfumesBrasileiros,
  skincareBrasileiro,
  wellnessBrasileiro,
  unhasNailArt,
  fitnessBrasileiro,
  modaIntimaBrasileira,
  homemBrasileiro,
  teenBrasileiro,
  LIFESTYLE_SEO_MAPPING,
  SEO_INTENT_MAPPING
};