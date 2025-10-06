/**
 * Sistema Unificado de Dados Mega Hair - JC Hair Studio's 62
 * Centraliza todos os produtos mega hair em um sistema profissional
 * Baseado nos produtos detalhados do seed + expansão algorítmica profissional
 */

// Tipos e interfaces principais
export type HairType = 'STRAIGHT' | 'WAVY' | 'CURLY' | 'COILY';
export type HairTexture = 'FINE' | 'MEDIUM' | 'COARSE';
export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
export type OriginType = 'BRAZILIAN' | 'EUROPEAN' | 'ASIAN' | 'INDIAN';
export type CollectionType = 'CLASSIC' | 'PREMIUM' | 'GOLD' | 'RAPUNZEL' | 'PROFESSIONAL';

// Interface unificada de produto mega hair
export interface MegaHairProduct {
  // Identificação
  id: string;
  sku: string;
  name: string;
  slug: string;

  // Descrições
  description: string;
  shortDesc: string;
  technicalSpecs: string;
  applicationInstructions: string;
  careInstructions: string;

  // Características físicas
  hairType: HairType;
  hairTexture: HairTexture;
  hairColor: string;
  colorCode: string;
  length: number;
  weight: number;
  density: string;

  // Origem e qualidade
  origin: OriginType;
  originCountry: string;
  collection: CollectionType;
  qualityGrade: 'A' | 'AA' | 'AAA' | 'AAAA';

  // Preços
  price: number;
  comparePrice?: number;
  pricePerGram: number;
  bulkPricing?: Array<{
    minQuantity: number;
    price: number;
  }>;

  // Status e disponibilidade
  status: ProductStatus;
  quantity: number;
  inStock: boolean;
  isFeatured: boolean;
  isNew: boolean;
  badge?: string;

  // Avaliações
  rating: number;
  reviews: number;

  // Imagens
  images: Array<{
    url: string;
    alt: string;
    title: string;
    isMain: boolean;
    displayOrder: number;
  }>;

  // SEO
  metaTitle: string;
  metaDescription: string;

  // Compatibilidade com interface antiga
  type?: 'liso' | 'ondulado' | 'cacheado' | 'crespo';
  color?: 'loiro' | 'castanho' | 'preto' | 'ruivo' | 'ombre';
  image?: string;
}

// Mapeamento de cores profissionais
export const COLOR_MAPPING = {
  // Loiros
  '#613': { name: 'Loiro Platinado', category: 'loiro', hex: '#F5F5DC' },
  '#27': { name: 'Loiro Mel', category: 'loiro', hex: '#E6B800' },
  '#24': { name: 'Loiro Dourado', category: 'loiro', hex: '#FFD700' },
  '#22': { name: 'Loiro Médio', category: 'loiro', hex: '#DAA520' },
  '#18': { name: 'Loiro Escuro', category: 'loiro', hex: '#B8860B' },

  // Castanhos
  '#1': { name: 'Castanho Natural', category: 'castanho', hex: '#3D2B1F' },
  '#2': { name: 'Castanho Escuro', category: 'castanho', hex: '#2F1B14' },
  '#4': { name: 'Castanho Médio', category: 'castanho', hex: '#5D4037' },
  '#6': { name: 'Castanho Claro', category: 'castanho', hex: '#8D6E63' },
  '#8': { name: 'Castanho Acinzentado', category: 'castanho', hex: '#6D4C41' },

  // Pretos
  '#1B': { name: 'Preto Azulado', category: 'preto', hex: '#0F0F23' },
  '#3': { name: 'Preto Natural', category: 'preto', hex: '#1A1A1A' },
  '#Off Black': { name: 'Preto Suave', category: 'preto', hex: '#2C2C2C' },

  // Ruivos
  '#16': { name: 'Ruivo Natural', category: 'ruivo', hex: '#B22222' },
  '#33': { name: 'Ruivo Acobreado', category: 'ruivo', hex: '#CD5C5C' },
  '#130': { name: 'Ruivo Cereja', category: 'ruivo', hex: '#8B0000' },
  '#350': { name: 'Ruivo Borgonha', category: 'ruivo', hex: '#800020' },

  // Ombrés
  '#1B/27': { name: 'Ombré Preto Mel', category: 'ombre', hex: '#000000' },
  '#2/27': { name: 'Ombré Castanho Mel', category: 'ombre', hex: '#2F1B14' },
  '#4/27': { name: 'Ombré Caramelo', category: 'ombre', hex: '#5D4037' }
};

// Produtos base detalhados do seed (8 produtos originais)
const DETAILED_BASE_PRODUCTS: Omit<MegaHairProduct, 'id'>[] = [
  {
    sku: 'MH001',
    name: 'Mega Hair Liso Loiro Platinado 613 - 50cm',
    slug: 'mega-hair-liso-loiro-platinado-613-50cm',
    description: 'Extensão de cabelo 100% humano Remy europeu, loiro platinado 613 com 50cm de comprimento. Cutículas alinhadas, brilho natural e resistência máxima. Ideal para transformações dramáticas e colorimetria avançada.',
    shortDesc: 'Mega hair loiro platinado 100% humano, 50cm, qualidade premium',
    technicalSpecs: 'Cabelo Remy europeu 100% humano, cutículas alinhadas, densidade 110-120 fios/cm², resistência térmica até 180°C',
    applicationInstructions: 'Aplicar com técnica de costura, anel ou nano link. Recomenda-se aplicação profissional para melhor resultado.',
    careInstructions: 'Lavar com shampoo sem sulfato, usar leave-in específico, evitar produtos com álcool. Penteie sempre de baixo para cima.',
    hairType: 'STRAIGHT',
    hairTexture: 'FINE',
    hairColor: 'Loiro Platinado',
    colorCode: '#613',
    length: 50,
    weight: 100,
    density: '110-120 fios/cm²',
    origin: 'EUROPEAN',
    originCountry: 'Polônia',
    collection: 'PREMIUM',
    qualityGrade: 'AAA',
    price: 85.00,
    comparePrice: 120.00,
    pricePerGram: 0.85,
    bulkPricing: [
      { minQuantity: 3, price: 75.00 },
      { minQuantity: 5, price: 68.00 }
    ],
    status: 'ACTIVE',
    quantity: 25,
    inStock: true,
    isFeatured: true,
    isNew: false,
    rating: 4.8,
    reviews: 124,
    images: [
      {
        url: 'https://i.ibb.co/6c9qWqnq/613-1800x.webp',
        alt: 'Mega Hair Loiro Platinado 613 - 50cm',
        title: 'Mega Hair Loiro Platinado Premium',
        isMain: true,
        displayOrder: 0
      }
    ],
    metaTitle: "Mega Hair Loiro Platinado 613 - 50cm | JC Hair Studio's 62",
    metaDescription: 'Extensão de cabelo loiro platinado premium, 100% humano Remy europeu. Transforme seu visual com qualidade profissional.',

    // Compatibilidade
    type: 'liso',
    color: 'loiro',
    image: 'https://i.ibb.co/6c9qWqnq/613-1800x.webp'
  },
  {
    sku: 'MH002',
    name: 'Mega Hair Liso Castanho Natural 1 - 55cm',
    slug: 'mega-hair-liso-castanho-natural-1-55cm',
    description: 'Mega hair castanho natural premium brasileiro com 55cm de comprimento. Alta densidade 110g, movimento orgânico e compatibilidade perfeita com cabelos nativos. Ideal para volume e comprimento simultâneo.',
    shortDesc: 'Mega hair castanho natural 100% humano, 55cm, alta densidade',
    technicalSpecs: 'Cabelo brasileiro 100% humano, não processado, densidade 100-110 fios/cm², resistência natural superior',
    applicationInstructions: 'Compatível com todas as técnicas. Ideal para costura tradicional e mega hair de tela.',
    careInstructions: 'Manutenção simples, aceita todos os tipos de produtos capilares. Pode ser colorido e alisado.',
    hairType: 'STRAIGHT',
    hairTexture: 'MEDIUM',
    hairColor: 'Castanho Natural',
    colorCode: '#1',
    length: 55,
    weight: 110,
    density: '100-110 fios/cm²',
    origin: 'BRAZILIAN',
    originCountry: 'Brasil',
    collection: 'CLASSIC',
    qualityGrade: 'AA',
    price: 90.00,
    comparePrice: 130.00,
    pricePerGram: 0.82,
    status: 'ACTIVE',
    quantity: 30,
    inStock: true,
    isFeatured: true,
    isNew: false,
    rating: 4.6,
    reviews: 89,
    images: [
      {
        url: 'https://i.ibb.co/n8NDS1BB/1-8e322489-17fb-4397-842e-4e24610ea213-1800x.webp',
        alt: 'Mega Hair Castanho Natural 1 - 55cm',
        title: 'Mega Hair Castanho Natural Premium',
        isMain: true,
        displayOrder: 0
      }
    ],
    metaTitle: "Mega Hair Castanho Natural - 55cm | JC Hair Studio's 62",
    metaDescription: 'Extensão de cabelo castanho natural premium, 100% humano brasileiro. Volume e comprimento perfeitos.',

    // Compatibilidade
    type: 'liso',
    color: 'castanho',
    image: 'https://i.ibb.co/n8NDS1BB/1-8e322489-17fb-4397-842e-4e24610ea213-1800x.webp'
  },
  {
    sku: 'MH003',
    name: 'Mega Hair Ondulado Natural 35cm - Bob Style',
    slug: 'mega-hair-ondulado-natural-35cm-bob',
    description: 'Ondas naturais Bob Style premium com padrão 2A suave e controlado. Perfeito para cortes modernos, movimento natural que valoriza o rosto com manutenção simples e resultado sempre elegante.',
    shortDesc: 'Mega hair ondulado Bob Style, 35cm, padrão 2A suave',
    technicalSpecs: 'Padrão de onda 2A natural, textura média, volume controlado, ideal para cortes Bob e Long Bob',
    applicationInstructions: 'Aplicar respeitando o padrão natural das ondas. Ideal para técnica de costura lateral.',
    careInstructions: 'Usar produtos para cabelos ondulados, secar com difusor, aplicar leave-in para definição das ondas.',
    hairType: 'WAVY',
    hairTexture: 'MEDIUM',
    hairColor: 'Castanho Ondulado',
    colorCode: '#6',
    length: 35,
    weight: 70,
    density: '90-100 fios/cm²',
    origin: 'BRAZILIAN',
    originCountry: 'Brasil',
    collection: 'CLASSIC',
    qualityGrade: 'AA',
    price: 60.00,
    comparePrice: 85.00,
    pricePerGram: 0.86,
    status: 'ACTIVE',
    quantity: 20,
    inStock: true,
    isFeatured: false,
    isNew: false,
    rating: 4.4,
    reviews: 67,
    images: [
      {
        url: 'https://i.ibb.co/hPZVQ0x/35-Cms-1800x.webp',
        alt: 'Mega Hair Ondulado Natural 35cm - Bob Style',
        title: 'Mega Hair Ondulado Bob Style',
        isMain: true,
        displayOrder: 0
      }
    ],
    metaTitle: "Mega Hair Ondulado Bob Style - 35cm | JC Hair Studio's 62",
    metaDescription: 'Extensão de cabelo ondulado natural, padrão 2A, perfeito para cortes Bob modernos.',

    // Compatibilidade
    type: 'ondulado',
    color: 'castanho',
    image: 'https://i.ibb.co/hPZVQ0x/35-Cms-1800x.webp'
  },
  {
    sku: 'MH004',
    name: 'Mega Hair Cacheado Natural 5 - 40cm',
    slug: 'mega-hair-cacheado-natural-5-40cm',
    description: 'Cachos autênticos 3B profissionais com definição perfeita sem ressecamento. Movimento tridimensional natural ideal para cabelos cacheados nativos com resultado harmonioso garantido.',
    shortDesc: 'Mega hair cacheado 3B, 40cm, cachos autênticos',
    technicalSpecs: 'Padrão de cacho 3B definido, textura grossa, alta elasticidade, resistente à umidade',
    applicationInstructions: 'Aplicar com técnica específica para cabelos cacheados. Não esticar durante a aplicação.',
    careInstructions: 'Finalizar com creme para cachos, não escove seco, use dedos ou pente de dentes largos molhado.',
    hairType: 'CURLY',
    hairTexture: 'COARSE',
    hairColor: 'Castanho Cacheado',
    colorCode: '#5',
    length: 40,
    weight: 80,
    density: '80-90 fios/cm²',
    origin: 'BRAZILIAN',
    originCountry: 'Brasil',
    collection: 'PROFESSIONAL',
    qualityGrade: 'AAA',
    price: 70.00,
    comparePrice: 95.00,
    pricePerGram: 0.88,
    status: 'ACTIVE',
    quantity: 15,
    inStock: true,
    isFeatured: false,
    isNew: false,
    rating: 4.7,
    reviews: 43,
    images: [
      {
        url: 'https://i.ibb.co/Q7VXH4qK/Cabelo-5-1800x.webp',
        alt: 'Mega Hair Cacheado Natural 5 - 40cm',
        title: 'Mega Hair Cacheado Natural 3B',
        isMain: true,
        displayOrder: 0
      }
    ],
    metaTitle: "Mega Hair Cacheado Natural - 40cm | JC Hair Studio's 62",
    metaDescription: 'Extensão de cabelo cacheado 3B natural, definição perfeita para cabelos cacheados.',

    // Compatibilidade
    type: 'cacheado',
    color: 'castanho',
    image: 'https://i.ibb.co/Q7VXH4qK/Cabelo-5-1800x.webp'
  },
  {
    sku: 'MH005',
    name: 'Mega Hair Liso Preto Premium 3 - 55cm',
    slug: 'mega-hair-liso-preto-premium-3-55cm',
    description: 'Preto premium sedoso com densidade máxima e brilho espelhado diamond. Cor sólida e duradoura, base perfeita para técnicas de iluminação e mechas contrastantes com autenticidade total garantida.',
    shortDesc: 'Mega hair preto premium sedoso, 55cm, densidade máxima',
    technicalSpecs: 'Preto natural intenso, brilho diamante, densidade máxima 120 fios/cm², sedosidade superior',
    applicationInstructions: 'Ideal para todas as técnicas. Perfeito como base para colorimetria avançada.',
    careInstructions: 'Manter hidratação constante, usar produtos para cabelos pretos, proteger do sol excessivo.',
    hairType: 'STRAIGHT',
    hairTexture: 'FINE',
    hairColor: 'Preto Premium',
    colorCode: '#3',
    length: 55,
    weight: 110,
    density: '120 fios/cm²',
    origin: 'BRAZILIAN',
    originCountry: 'Brasil',
    collection: 'PREMIUM',
    qualityGrade: 'AAA',
    price: 90.00,
    comparePrice: 125.00,
    pricePerGram: 0.82,
    status: 'ACTIVE',
    quantity: 25,
    inStock: true,
    isFeatured: true,
    isNew: false,
    rating: 4.9,
    reviews: 156,
    images: [
      {
        url: 'https://i.ibb.co/RG65nmty/Cabelo-3-0182f1c5-3a8d-4dbb-8703-d1057f162b16-1800x.webp',
        alt: 'Mega Hair Liso Preto Premium 3 - 55cm',
        title: 'Mega Hair Preto Premium Sedoso',
        isMain: true,
        displayOrder: 0
      }
    ],
    metaTitle: "Mega Hair Preto Premium - 55cm | JC Hair Studio's 62",
    metaDescription: 'Extensão de cabelo preto premium sedoso, brilho diamante, densidade máxima.',

    // Compatibilidade
    type: 'liso',
    color: 'preto',
    image: 'https://i.ibb.co/RG65nmty/Cabelo-3-0182f1c5-3a8d-4dbb-8703-d1057f162b16-1800x.webp'
  },
  {
    sku: 'MH006',
    name: 'Mega Hair Liso Ruivo Natural 16 - 45cm',
    slug: 'mega-hair-liso-ruivo-natural-16-45cm',
    description: 'Ruivo natural vibrante exclusivo com tom quente intenso e pigmentação rica e duradoura. Raridade no mercado ideal para personalidades marcantes e looks únicos que se destacam.',
    shortDesc: 'Mega hair ruivo natural vibrante, 45cm, tom quente exclusivo',
    technicalSpecs: 'Ruivo natural raro, pigmentação intensa e duradoura, tom quente vibrante, textura sedosa',
    applicationInstructions: 'Produto exclusivo, aplicação cuidadosa recomendada. Ideal para mechas e reflexos.',
    careInstructions: 'Usar produtos para cabelos coloridos, evitar exposição solar direta, hidratar semanalmente.',
    hairType: 'STRAIGHT',
    hairTexture: 'MEDIUM',
    hairColor: 'Ruivo Natural',
    colorCode: '#16',
    length: 45,
    weight: 90,
    density: '95-105 fios/cm²',
    origin: 'EUROPEAN',
    originCountry: 'Irlanda',
    collection: 'PREMIUM',
    qualityGrade: 'AAAA',
    price: 80.00,
    comparePrice: 110.00,
    pricePerGram: 0.89,
    status: 'ACTIVE',
    quantity: 10,
    inStock: true,
    isFeatured: false,
    isNew: false,
    badge: 'EXCLUSIVO',
    rating: 4.5,
    reviews: 28,
    images: [
      {
        url: 'https://i.ibb.co/VpDVrJNV/Cabelo-16-8c14b06a-6a45-4eb4-bb2b-b4e3a2f94fa8-1800x.webp',
        alt: 'Mega Hair Liso Ruivo Natural 16 - 45cm',
        title: 'Mega Hair Ruivo Natural Vibrante',
        isMain: true,
        displayOrder: 0
      }
    ],
    metaTitle: "Mega Hair Ruivo Natural - 45cm | JC Hair Studio's 62",
    metaDescription: 'Extensão de cabelo ruivo natural vibrante, tom exclusivo para looks únicos.',

    // Compatibilidade
    type: 'liso',
    color: 'ruivo',
    image: 'https://i.ibb.co/VpDVrJNV/Cabelo-16-8c14b06a-6a45-4eb4-bb2b-b4e3a2f94fa8-1800x.webp'
  },
  {
    sku: 'MH007',
    name: 'Mega Hair Liso Gold Premium 30 - 75cm',
    slug: 'mega-hair-liso-gold-premium-30-75cm',
    description: 'Coleção GOLD exclusiva Master Class com comprimento extra premium 75cm. Densidade superior e tecnologia anti-quebra. Produto estrela para transformações dramáticas e eventos especiais.',
    shortDesc: 'Mega hair Gold Premium, 75cm, coleção exclusiva Master Class',
    technicalSpecs: 'Coleção Gold Master Class, comprimento extra 75cm, densidade superior, tecnologia anti-quebra exclusiva',
    applicationInstructions: 'Produto premium para profissionais especializados. Requer técnica avançada de aplicação.',
    careInstructions: 'Cuidados especiais de manutenção, produtos premium obrigatórios, hidratação profissional quinzenal.',
    hairType: 'STRAIGHT',
    hairTexture: 'FINE',
    hairColor: 'Dourado Premium',
    colorCode: '#30',
    length: 75,
    weight: 150,
    density: '130 fios/cm²',
    origin: 'EUROPEAN',
    originCountry: 'Ucrânia',
    collection: 'GOLD',
    qualityGrade: 'AAAA',
    price: 145.00,
    comparePrice: 200.00,
    pricePerGram: 0.97,
    bulkPricing: [
      { minQuantity: 2, price: 130.00 }
    ],
    status: 'ACTIVE',
    quantity: 8,
    inStock: true,
    isFeatured: true,
    isNew: false,
    badge: 'LUXO',
    rating: 4.9,
    reviews: 34,
    images: [
      {
        url: 'https://i.ibb.co/VY0RjYCn/Cabelo-30-4cb5aee5-24f8-4286-8165-532f5bae9cab-1800x.webp',
        alt: 'Mega Hair Liso Gold Premium 30 - 75cm',
        title: 'Mega Hair Coleção Gold Premium',
        isMain: true,
        displayOrder: 0
      }
    ],
    metaTitle: "Mega Hair Gold Premium - 75cm | JC Hair Studio's 62",
    metaDescription: 'Extensão de cabelo coleção Gold exclusiva, 75cm premium para transformações dramáticas.',

    // Compatibilidade
    type: 'liso',
    color: 'loiro',
    image: 'https://i.ibb.co/VY0RjYCn/Cabelo-30-4cb5aee5-24f8-4286-8165-532f5bae9cab-1800x.webp'
  },
  {
    sku: 'MH008',
    name: 'Mega Hair Rapunzel Collection 24 - 90cm',
    slug: 'mega-hair-rapunzel-collection-24-90cm',
    description: 'Coleção Rapunzel exclusiva com comprimento extremo de 90cm. Nossa peça mais exclusiva para transformações dramáticas e looks de impacto. Qualidade Master Class incomparável.',
    shortDesc: 'Mega hair Rapunzel Collection, 90cm, comprimento extremo exclusivo',
    technicalSpecs: 'Comprimento extremo 90cm, qualidade Master Class, densidade balanceada para comprimento extremo',
    applicationInstructions: 'Produto exclusivo para especialistas. Requer planejamento de aplicação e estrutura capilar adequada.',
    careInstructions: 'Manutenção profissional obrigatória, produtos de alta performance, cuidados diários específicos.',
    hairType: 'STRAIGHT',
    hairTexture: 'MEDIUM',
    hairColor: 'Castanho Rapunzel',
    colorCode: '#24',
    length: 90,
    weight: 180,
    density: '100 fios/cm²',
    origin: 'EUROPEAN',
    originCountry: 'República Tcheca',
    collection: 'RAPUNZEL',
    qualityGrade: 'AAAA',
    price: 190.00,
    comparePrice: 250.00,
    pricePerGram: 1.06,
    status: 'ACTIVE',
    quantity: 5,
    inStock: true,
    isFeatured: true,
    isNew: false,
    badge: 'EXCLUSIVO',
    rating: 5.0,
    reviews: 12,
    images: [
      {
        url: 'https://i.ibb.co/zVr48cdN/Cabelo-24-1800x.webp',
        alt: 'Mega Hair Rapunzel Collection 24 - 90cm',
        title: 'Mega Hair Rapunzel Collection Exclusiva',
        isMain: true,
        displayOrder: 0
      }
    ],
    metaTitle: "Mega Hair Rapunzel Collection - 90cm | JC Hair Studio's 62",
    metaDescription: 'Extensão de cabelo Rapunzel exclusiva, 90cm de comprimento extremo para looks dramáticos.',

    // Compatibilidade
    type: 'liso',
    color: 'castanho',
    image: 'https://i.ibb.co/zVr48cdN/Cabelo-24-1800x.webp'
  }
];

// Configurações para geração algorítmica
const HAIR_TYPES: HairType[] = ['STRAIGHT', 'WAVY', 'CURLY', 'COILY'];
const HAIR_TEXTURES: HairTexture[] = ['FINE', 'MEDIUM', 'COARSE'];
const LENGTHS = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];
const COLLECTIONS: CollectionType[] = ['CLASSIC', 'PREMIUM', 'GOLD', 'PROFESSIONAL'];
const ORIGINS: OriginType[] = ['BRAZILIAN', 'EUROPEAN', 'ASIAN', 'INDIAN'];
const BADGES = ['BEST SELLER', 'PREMIUM', 'EXCLUSIVO', 'NOVO', 'LUXO'];

// Tabela de preços profissional (baseada no comprimento e qualidade)
const PRICE_TABLE: Record<number, { base: number; premium: number; gold: number }> = {
  30: { base: 50.00, premium: 65.00, gold: 85.00 },
  35: { base: 58.00, premium: 75.00, gold: 98.00 },
  40: { base: 68.00, premium: 88.00, gold: 115.00 },
  45: { base: 78.00, premium: 101.00, gold: 132.00 },
  50: { base: 88.00, premium: 114.00, gold: 149.00 },
  55: { base: 98.00, premium: 127.00, gold: 166.00 },
  60: { base: 108.00, premium: 140.00, gold: 183.00 },
  65: { base: 118.00, premium: 153.00, gold: 200.00 },
  70: { base: 128.00, premium: 166.00, gold: 217.00 },
  75: { base: 138.00, premium: 179.00, gold: 234.00 },
  80: { base: 148.00, premium: 192.00, gold: 251.00 },
  85: { base: 158.00, premium: 205.00, gold: 268.00 },
  90: { base: 168.00, premium: 218.00, gold: 285.00 }
};

// Função para gerar produtos algoritmicamente
function generateAlgorithmicProducts(): MegaHairProduct[] {
  const products: MegaHairProduct[] = [];
  let skuCounter = 9; // Começar após os 8 produtos base

  // Gerar cores profissionais
  const colorCodes = Object.keys(COLOR_MAPPING);

  for (const hairType of HAIR_TYPES) {
    for (const length of LENGTHS) {
      for (let colorIndex = 0; colorIndex < Math.min(colorCodes.length, 3); colorIndex++) {
        const colorCode = colorCodes[(colorIndex + Math.floor(skuCounter / 10)) % colorCodes.length];
        const colorInfo = COLOR_MAPPING[colorCode as keyof typeof COLOR_MAPPING];

        const collection = COLLECTIONS[skuCounter % COLLECTIONS.length];
        const origin = ORIGINS[skuCounter % ORIGINS.length];
        const texture = HAIR_TEXTURES[skuCounter % HAIR_TEXTURES.length];

        // Calcular preço baseado na coleção
        let price = PRICE_TABLE[length].base;
        if (collection === 'PREMIUM') price = PRICE_TABLE[length].premium;
        if (collection === 'GOLD') price = PRICE_TABLE[length].gold;

        // Ajuste por origem
        if (origin === 'EUROPEAN') price *= 1.2;
        if (origin === 'INDIAN') price *= 0.9;

        const typeMapping: Record<HairType, 'liso' | 'ondulado' | 'cacheado' | 'crespo'> = {
          'STRAIGHT': 'liso',
          'WAVY': 'ondulado',
          'CURLY': 'cacheado',
          'COILY': 'crespo'
        };

        const sku = `MH${String(skuCounter).padStart(3, '0')}`;
        const name = `Mega Hair ${hairType === 'STRAIGHT' ? 'Liso' : hairType === 'WAVY' ? 'Ondulado' : hairType === 'CURLY' ? 'Cacheado' : 'Crespo'} ${colorInfo.name} - ${length}cm`;

        products.push({
          id: `mh-${skuCounter}`,
          sku,
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          description: `Extensão de cabelo ${hairType === 'STRAIGHT' ? 'liso' : hairType === 'WAVY' ? 'ondulado' : hairType === 'CURLY' ? 'cacheado' : 'crespo'} profissional ${colorInfo.name.toLowerCase()}, ${length}cm. Origem ${origin.toLowerCase()}, coleção ${collection.toLowerCase()}. Qualidade superior para resultados profissionais duradouros.`,
          shortDesc: `Mega hair ${hairType === 'STRAIGHT' ? 'liso' : hairType === 'WAVY' ? 'ondulado' : hairType === 'CURLY' ? 'cacheado' : 'crespo'} ${colorInfo.name.toLowerCase()}, ${length}cm`,
          technicalSpecs: `Cabelo 100% humano ${origin.toLowerCase()}, textura ${texture.toLowerCase()}, densidade balanceada, resistente`,
          applicationInstructions: 'Aplicação profissional recomendada. Compatível com principais técnicas de extensão.',
          careInstructions: 'Cuidados específicos para cabelo humano. Usar produtos adequados ao tipo de cabelo.',
          hairType,
          hairTexture: texture,
          hairColor: colorInfo.name,
          colorCode,
          length,
          weight: Math.round(length * 1.5 + (texture === 'COARSE' ? 20 : texture === 'MEDIUM' ? 10 : 0)),
          density: texture === 'FINE' ? '90-100 fios/cm²' : texture === 'MEDIUM' ? '100-110 fios/cm²' : '80-90 fios/cm²',
          origin,
          originCountry: origin === 'BRAZILIAN' ? 'Brasil' : origin === 'EUROPEAN' ? 'Europa' : origin === 'ASIAN' ? 'Ásia' : 'Índia',
          collection,
          qualityGrade: collection === 'GOLD' ? 'AAAA' : collection === 'PREMIUM' ? 'AAA' : 'AA',
          price,
          comparePrice: price * 1.3,
          pricePerGram: price / (length * 1.5),
          status: 'ACTIVE',
          quantity: Math.floor(Math.random() * 30) + 5,
          inStock: Math.random() > 0.1,
          isFeatured: Math.random() > 0.8,
          isNew: Math.random() > 0.9,
          badge: Math.random() > 0.7 ? BADGES[skuCounter % BADGES.length] : undefined,
          rating: 4 + Math.random() * 1,
          reviews: Math.floor(Math.random() * 150) + 10,
          images: [{
            url: `/images/mega-hair/mega-hair-${String(skuCounter).padStart(3, "0")}.jpg`,
            alt: name,
            title: name,
            isMain: true,
            displayOrder: 0
          }],
          metaTitle: `${name} | JC Hair Studio's 62`,
          metaDescription: `${name} - extensão profissional de qualidade superior. Coleção ${collection}.`,

          // Compatibilidade
          type: typeMapping[hairType],
          color: colorInfo.category as any,
          image: `/images/mega-hair/mega-hair-${String(skuCounter).padStart(3, "0")}.jpg`
        });

        skuCounter++;

        // Limitar total de produtos para manter performance
        if (products.length >= 68) break;
      }
      if (products.length >= 68) break;
    }
    if (products.length >= 68) break;
  }

  return products;
}

// Gerar catálogo completo unificado
export function generateUnifiedCatalog(): MegaHairProduct[] {
  const baseProducts = DETAILED_BASE_PRODUCTS.map((product, index) => ({
    ...product,
    id: `mh-base-${index + 1}`
  }));

  const algorithmicProducts = generateAlgorithmicProducts();

  return [...baseProducts, ...algorithmicProducts];
}

// Funções de utilidade
export function getProductBySku(sku: string): MegaHairProduct | undefined {
  const catalog = generateUnifiedCatalog();
  return catalog.find(product => product.sku === sku);
}

export function getProductsByCollection(collection: CollectionType): MegaHairProduct[] {
  const catalog = generateUnifiedCatalog();
  return catalog.filter(product => product.collection === collection);
}

export function getProductsByHairType(hairType: HairType): MegaHairProduct[] {
  const catalog = generateUnifiedCatalog();
  return catalog.filter(product => product.hairType === hairType);
}

export function getFeaturedProducts(): MegaHairProduct[] {
  const catalog = generateUnifiedCatalog();
  return catalog.filter(product => product.isFeatured);
}

export function searchProducts(query: string): MegaHairProduct[] {
  const catalog = generateUnifiedCatalog();
  const lowercaseQuery = query.toLowerCase();

  return catalog.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.hairColor.toLowerCase().includes(lowercaseQuery) ||
    product.sku.toLowerCase().includes(lowercaseQuery)
  );
}

// Função para compatibilidade com interface antiga do mega-hair/page.tsx
export function getLegacyCompatibleProducts() {
  // SISTEMA COM IMAGENS REAIS - APENAS FOTOS DA PASTA "cabelos mega hair lasted version"

  // Base de dados dos cabelos reais disponíveis
  const hairTypes = [
    // LISOS (1A-2A)
    {
      id: 1,
      name: 'Mega Hair Liso 1A Ruivo Alaranjado Premium',
      type: 'liso' as const,
      color: 'ruivo' as const,
      baseImage: '/images/mega-hair-real/Cabelo_1A_Liso_escorrido_sem_volume._Alaranjado_acesso.jpg',
      basePrice: 108.00,
      description: 'Mega hair liso tipo 1A ruivo alaranjado vibrante profissional. Cabelo 100% humano brasileiro escorrido sem volume, cor intensa e moderna com pigmentação natural duradoura. Ideal para transformações ousadas e looks únicos.',
      technicalSpecs: 'Cabelo brasileiro 100% humano virgem, tipo 1A liso natural, cor alaranjada intensa, densidade 90-100 fios/cm², resistência térmica até 160°C, comprimento padrão 50cm',
      applicationGuide: 'Aplicação recomendada por profissional especializado. Técnica de costura ou mega hair com tela. Preparar o cabelo natural com lavagem prévia.',
      careInstructions: 'Usar shampoo e condicionador sem sulfatos. Evitar produtos com álcool. Pentear sempre de baixo para cima. Hidratar semanalmente com produtos específicos para cabelos coloridos.',
      compatibility: 'Ideal para cabelos castanhos e pretos que desejam um contraste vibrante. Combina perfeitamente com tons quentes de pele.',
      rating: 4.6,
      reviews: 89,
      badge: 'EXCLUSIVO'
    },
    {
      id: 2,
      name: 'Mega Hair Liso 1A Grisalho Acinzentado Elegance',
      type: 'liso' as const,
      color: 'grisalho' as const,
      baseImage: '/images/mega-hair-real/Cabelo_1A_Liso_escorrido_sem_volume._Grisalho_acinzentado.jpg',
      basePrice: 135.00,
      description: 'Mega hair liso tipo 1A grisalho acinzentado elegante premium. Cabelo 100% humano europeu com transição natural para o grisalho. Perfeito para assumir os fios brancos com máxima sofisticação e classe.',
      technicalSpecs: 'Cabelo europeu 100% humano premium, tipo 1A liso natural, cor grisalha acinzentada uniforme, densidade 110-120 fios/cm², resistência térmica até 180°C, tratamento anti-amarelamento',
      applicationGuide: 'Aplicação profissional recomendada. Ideal para técnica de costura fina. Combinar tons com cabelo natural existente para transição harmoniosa.',
      careInstructions: 'Usar produtos específicos para cabelos grisalhos. Shampoo matizador quinzenal. Evitar exposição solar excessiva. Hidratação profunda mensal obrigatória.',
      compatibility: 'Perfeito para transição natural do grisalho. Ideal para mulheres maduras que desejam elegância e autenticidade.',
      rating: 4.8,
      reviews: 156,
      badge: 'PREMIUM'
    },
    {
      id: 3,
      name: 'Mega Hair Liso 1A Grisalho Mix Preto Transição',
      type: 'liso' as const,
      color: 'grisalho' as const,
      baseImage: '/images/mega-hair-real/Cabelo_1A_Liso_escorrido_sem_volume._Grisalho_em_40_com_fundo_de_cor_preto_natural.jpg',
      basePrice: 135.00,
      description: 'Mega hair liso tipo 1A grisalho 40% com fundo preto natural premium. Cabelo 100% humano brasileiro com mistura autêntica de fios grisalhos e pretos. Transição perfeita para cabelos em processo natural de grisalho.',
      technicalSpecs: 'Cabelo brasileiro 100% humano selecionado, tipo 1A liso natural, 40% fios grisalhos + 60% preto natural, densidade balanceada 100-110 fios/cm², resistência superior',
      applicationGuide: 'Aplicação por especialista em transição capilar. Misturar estrategicamente com cabelo natural para resultado harmonioso. Técnica de costura ou nano link recomendada.',
      careInstructions: 'Rotina de cuidados dupla: produtos para cabelo preto e grisalho. Shampoo matizador mensal. Hidratação alternada semanal.',
      compatibility: 'Ideal para mulheres em transição capilar natural. Perfeito para quem quer aceitar o grisalho gradualmente.',
      rating: 4.7,
      reviews: 134,
      badge: 'NATURAL'
    },
    {
      id: 4,
      name: 'Mega Hair Liso 1A Loiro Acobreado Luxury',
      type: 'liso' as const,
      color: 'loiro' as const,
      baseImage: '/images/mega-hair-real/Cabelo_1A_Liso_escorrido_sem_volume._Loiro_levemente_acobreado.jpg',
      basePrice: 126.00,
      description: 'Mega hair liso tipo 1A loiro levemente acobreado luxury premium. Cabelo 100% humano europeu com reflexos acobreados naturais. Tom dourado sutil e sofisticado com brilho diamante incomparável.',
      technicalSpecs: 'Cabelo europeu 100% humano Remy premium, tipo 1A liso sedoso, loiro acobreado natural #27/30, densidade 115-125 fios/cm², cutículas alinhadas, brilho natural intenso',
      applicationGuide: 'Aplicação profissional Master Class obrigatória. Técnica de costura ultrafina ou mega hair invisível. Colorimetria prévia recomendada para harmonização.',
      careInstructions: 'Produtos luxury para loiros. Shampoo e condicionador sem sulfatos. Máscara matizadora quinzenal. Protetor térmico sempre. Óleo reparador nas pontas.',
      compatibility: 'Ideal para peles quentes e douradas. Combina com olhos mel, verdes e castanhos. Perfeito para looks sofisticados e elegantes.',
      rating: 4.9,
      reviews: 203,
      badge: 'LUXO'
    },
    {
      id: 5,
      name: 'Mega Hair Liso 1A Loiro Platinado Diamond',
      type: 'liso' as const,
      color: 'loiro' as const,
      baseImage: '/images/mega-hair-real/Cabelo_1A_Liso_escorrido_sem_volume._Loiro_platinado.jpg',
      basePrice: 135.00,
      description: 'Mega hair liso tipo 1A loiro platinado diamond ultra premium. Cabelo 100% humano europeu com descoloração profissional. Tom ultra claro cristalino #613 com máximo impacto visual e brilho espelhado.',
      technicalSpecs: 'Cabelo europeu 100% humano virgin premium, tipo 1A sedoso, loiro platinado #613 ultra claro, densidade máxima 120-130 fios/cm², processo de descoloração controlada, cuticulas seladas',
      applicationGuide: 'Aplicação exclusiva por Master Colorist. Avaliação capilar obrigatória. Técnica de aplicação gradual recomendada. Teste de mecha prévia essencial.',
      careInstructions: 'Linha platinum completa obrigatória. Shampoo purple diário. Condicionador reparador intensivo. Cronograma capilar semanal. Proteção UV sempre.',
      compatibility: 'Ideal para peles frias e rosadas. Combina com olhos azuis, verdes claros e cinzas. Máximo impacto fashion e editorial.',
      rating: 4.8,
      reviews: 178,
      badge: 'DIAMOND'
    },
    {
      id: 6,
      name: 'Mega Hair Liso 1A Preto Natural Brasileiro',
      type: 'liso' as const,
      color: 'preto' as const,
      baseImage: '/images/mega-hair-real/Cabelo_1A_Liso_escorrido_sem_volume._Preto_natural.jpg',
      basePrice: 108.00,
      description: 'Mega hair liso tipo 1A preto natural brasileiro premium autêntico. Cabelo 100% humano virgem com brilho intenso e cor sólida profunda. Qualidade superior reconhecida mundialmente.',
      technicalSpecs: 'Cabelo brasileiro 100% humano virgem premium, tipo 1A liso natural, preto intenso #1B, densidade 110-120 fios/cm², sem processamento químico, resistência máxima natural',
      applicationGuide: 'Aplicação versátil para todos os métodos. Ideal para costura tradicional, tela ou fita adesiva. Base perfeita para futuras colorações e técnicas de iluminação.',
      careInstructions: 'Cuidados básicos com produtos de qualidade. Shampoo e condicionador hidratantes. Pode ser escovado, alisado e modelado livremente. Óleo capilar para brilho extra.',
      compatibility: 'Universal - combina com todos os tons de pele e estilos. Base ideal para mechas, luzes e colorações futuras. Clássico atemporal.',
      rating: 4.9,
      reviews: 245,
      badge: 'BEST SELLER'
    },
    {
      id: 7,
      name: 'Mega Hair Liso 2A Castanho Chocolate Premium',
      type: 'liso' as const,
      color: 'castanho' as const,
      baseImage: '/images/mega-hair-real/Cabelo_2A_-_Liso_com_um_pouco_de_volume._Marrom_ou_chocolate.jpg',
      basePrice: 117.00,
      description: 'Mega hair liso tipo 2A castanho chocolate premium com corpo natural. Cabelo 100% humano brasileiro com leve volume e movimento. Tom marrom rico e natural com reflexos dourados sutis.',
      technicalSpecs: 'Cabelo brasileiro 100% humano premium, tipo 2A liso com corpo, castanho chocolate #4, densidade média 100-110 fios/cm², volume natural balanceado, movimento fluido',
      applicationGuide: 'Aplicação respeitando o movimento natural. Técnica de costura em camadas para resultado volumoso. Misturar com cabelo natural para integração perfeita.',
      careInstructions: 'Produtos para cabelos com corpo. Mousse volumizador para realçar movimento. Secagem com difusor recomendada. Evitar alisamento excessivo para manter naturalidade.',
      compatibility: 'Ideal para quem busca volume natural. Combina com peles morenas e bronzeadas. Perfeito para looks naturais e despojados.',
      rating: 4.7,
      reviews: 167,
      badge: 'NATURAL'
    },
    {
      id: 8,
      name: 'Mega Hair Liso 2A Preto Natural Master Class',
      type: 'liso' as const,
      color: 'preto' as const,
      baseImage: '/images/mega-hair-real/Cabelo_2A_-_Liso_com_um_pouco_de_volume._Preto_natural.jpg',
      basePrice: 117.00,
      description: 'Mega hair liso tipo 2A preto natural master class com volume sutil premium. Cabelo 100% humano brasileiro selecionado com densidade superior e corpo natural. Nossa melhor qualidade em cabelo preto.',
      technicalSpecs: 'Cabelo brasileiro 100% humano master class, tipo 2A liso com volume, preto natural intenso #1, densidade premium 115-125 fios/cm², seleção rigorosa, qualidade AAA',
      applicationGuide: 'Aplicação master class por profissional certificado. Técnica de camadas para volume estratégico. Resultado natural com densidade superior garantida.',
      careInstructions: 'Linha premium para cabelos de luxo. Cronograma capilar profissional. Pode receber qualquer tratamento químico. Resistência máxima garantida.',
      compatibility: 'Produto universal premium. Ideal para todas as ocasiões e estilos. Base perfeita para qualquer transformação futura.',
      rating: 5.0,
      reviews: 298,
      badge: 'MASTER CLASS'
    },

    // ONDULADOS (2C-3A)
    {
      id: 9,
      name: 'Mega Hair Ondulado 2C Preto Natural Movimento',
      type: 'ondulado' as const,
      color: 'preto' as const,
      baseImage: '/images/mega-hair-real/Cabelo_2C_Ondas_fortes_quase_cachos._Preto_natural.jpg',
      basePrice: 126.00,
      description: 'Mega hair ondulado tipo 2C preto natural com movimento intenso. Cabelo 100% humano brasileiro com ondas fortes quase cachos. Transição natural entre liso e cacheado com volume e definição perfeitos.',
      technicalSpecs: 'Cabelo brasileiro 100% humano natural, tipo 2C ondulado marcante, preto intenso #1, padrão de onda definido, densidade 95-105 fios/cm², elasticidade natural superior',
      applicationGuide: 'Aplicação respeitando o padrão natural das ondas. Técnica de costura em camadas onduladas. Não esticar durante aplicação para manter o movimento natural.',
      careInstructions: 'Produtos específicos para cabelos ondulados. Creme para pentear sem álcool. Secar com difusor ou natural. Não escove seco - use dedos ou pente de dentes largos.',
      compatibility: 'Ideal para quem tem cabelo natural ondulado ou deseja movimento sem compromisso. Combina com estilos despojados e naturais.',
      rating: 4.8,
      reviews: 187,
      badge: 'MOVIMENTO'
    },
    {
      id: 10,
      name: 'Mega Hair Ondulado 3A Preto Natural Autêntico',
      type: 'ondulado' as const,
      color: 'preto' as const,
      baseImage: '/images/mega-hair-real/Cabelo_3A_-_Ondas_mais_marcadas_tendencia_a_frizz._Preto_natural.jpg',
      basePrice: 126.00,
      description: 'Mega hair ondulado tipo 3A preto natural autêntico brasileiro. Cabelo 100% humano com ondas marcadas e tendência natural ao frizz. Textura autêntica brasileira com personalidade e movimento único.',
      technicalSpecs: 'Cabelo brasileiro 100% humano autêntico, tipo 3A ondulado definido, preto natural #1, ondas em formato S, tendência natural ao frizz, densidade 90-100 fios/cm²',
      applicationGuide: 'Aplicação por especialista em cabelos texturizados. Técnica que preserva o padrão natural. Não tentar alisar ou modificar a textura durante aplicação.',
      careInstructions: 'Rotina NooPoo (sem sulfatos). Condicionador leave-in obrigatório. Óleos naturais para controle do frizz. Finalização com creme de pentear específico.',
      compatibility: 'Perfeito para quem tem cabelo natural ondulado ou cacheado. Ideal para looks naturais, praiais e autênticos. Abraça a textura natural brasileira.',
      rating: 4.6,
      reviews: 145,
      badge: 'AUTÊNTICO'
    },

    // CACHEADOS (3C)
    {
      id: 11,
      name: 'Mega Hair Cacheado 3C Preto Natural Definição',
      type: 'cacheado' as const,
      color: 'preto' as const,
      baseImage: '/images/mega-hair-real/Cabelo_3C_Cachos_pequenos_e_bem_fechados._Preto.jpg',
      basePrice: 135.00,
      description: 'Mega hair cacheado tipo 3C preto natural com definição máxima. Cabelo 100% humano brasileiro com cachos pequenos bem fechados. Volume natural intenso e formato perfeito para looks afro-brasileiros.',
      technicalSpecs: 'Cabelo brasileiro 100% humano cacheado, tipo 3C cachos fechados, preto profundo #1, cachos em espiral pequena, alta elasticidade, densidade 85-95 fios/cm²',
      applicationGuide: 'Aplicação exclusiva por especialista em cabelos cacheados. Técnica específica que mantém a integridade dos cachos. Aplicação em camadas para volume estratégico.',
      careInstructions: 'Método Curly Girl obrigatório. Produtos sem sulfatos, parabenos ou álcool. Finalização com gelatina ou creme para cachos. Nunca escove seco.',
      compatibility: 'Ideal para quem tem cachos naturais 3B/3C ou deseja volume e definição autênticos. Perfeito para valorizar a beleza afro-brasileira.',
      rating: 4.8,
      reviews: 198,
      badge: 'DEFINIÇÃO'
    },
    {
      id: 12,
      name: 'Mega Hair Cacheado 3C Castanho Médio Premium',
      type: 'cacheado' as const,
      color: 'castanho' as const,
      baseImage: '/images/mega-hair-real/Cabelo_3C_Cachos_pequenos_e_bem_fechados._Castanho_medio.jpg',
      basePrice: 135.00,
      description: 'Mega hair cacheado tipo 3C castanho médio premium com definição natural perfeita. Cabelo 100% humano brasileiro com cachos pequenos bem fechados em tom castanho médio único e sofisticado.',
      technicalSpecs: 'Cabelo brasileiro 100% humano premium, tipo 3C cachos definidos, castanho médio #4, reflexos naturais dourados, cachos uniformes, densidade balanceada 90-100 fios/cm²',
      applicationGuide: 'Aplicação master por especialista em texturas cacheadas. Respeitar o padrão natural dos cachos. Aplicação em seções pequenas para resultado harmonioso.',
      careInstructions: 'Cronograma capilar específico para cachos coloridos. Hidratação semanal intensiva. Produtos sem sulfatos. Finalização com ativador de cachos premium.',
      compatibility: 'Ideal para peles morenas e douradas. Combina com olhos castanhos e mel. Perfeito para looks sofisticados mantendo naturalidade.',
      rating: 4.7,
      reviews: 167,
      badge: 'PREMIUM'
    },
    {
      id: 13,
      name: 'Mega Hair Cacheado 3C Ruivo Intenso Exclusivo',
      type: 'cacheado' as const,
      color: 'ruivo' as const,
      baseImage: '/images/mega-hair-real/Cabelo_3C_Cachos_pequenos_e_bem_fechados._Ruivo_arregalado.jpg',
      basePrice: 153.00,
      description: 'Mega hair cacheado tipo 3C ruivo intenso exclusivo. Cabelo 100% humano europeu com coloração ruiva arregalada vibrante. Cor intensa única combinada com cachos perfeitamente definidos - raridade absoluta no mercado.',
      technicalSpecs: 'Cabelo europeu 100% humano raro, tipo 3C cachos fechados, ruivo intenso natural #350, pigmentação profunda duradoura, cachos em espiral perfeita, densidade especial 85-95 fios/cm²',
      applicationGuide: 'Produto ultra exclusivo - aplicação apenas por Master Colorist especializado. Avaliação prévia obrigatória. Técnica de aplicação gradual para impacto máximo.',
      careInstructions: 'Linha exclusiva para ruivos cacheados. Produtos sem sulfatos com proteção UV. Cronograma capilar intensivo. Retoque de cor a cada 6-8 semanas.',
      compatibility: 'Para personalidades marcantes e únicas. Combina com peles claras e sardas. Máximo impacto visual - produto de colecionador.',
      rating: 4.9,
      reviews: 123,
      badge: 'ULTRA RARO'
    },
    {
      id: 14,
      name: 'Mega Hair Cacheado 3C Borgonha Luxury Exclusivo',
      type: 'cacheado' as const,
      color: 'ruivo' as const,
      baseImage: '/images/mega-hair-real/Cabelo_3C_Cachos_pequenos_e_bem_fechados._Vermelho_borgonha.jpg',
      basePrice: 153.00,
      description: 'Mega hair cacheado tipo 3C vermelho borgonha luxury exclusivo. Cabelo 100% humano europeu premium com coloração borgonha sofisticada. Tom vinho profundo e elegante combinado com cachos perfeitos - peça de arte capilar.',
      technicalSpecs: 'Cabelo europeu 100% humano luxury, tipo 3C cachos perfeitos, vermelho borgonha #99J, coloração profissional multicamadas, cachos uniformes premium, densidade luxury 90-100 fios/cm²',
      applicationGuide: 'Aplicação master class exclusiva. Produto para colecionadores e occasions especiais. Técnica artística de aplicação para resultado impactante.',
      careInstructions: 'Linha luxury completa obrigatória. Proteção UV intensiva. Cronograma capilar profissional. Manutenção em salão especializado.',
      compatibility: 'Para mulheres sofisticadas e elegantes. Combina com peles morenas e douradas. Ideal para eventos especiais e looks de impacto.',
      rating: 5.0,
      reviews: 156,
      badge: 'OBRA DE ARTE'
    },

    // CRESPOS (4A-4C)
    {
      id: 15,
      name: 'Mega Hair Crespo 4A Preto Mechas Caramelo Ombré',
      type: 'crespo' as const,
      color: 'ombre' as const,
      baseImage: '/images/mega-hair-real/Cabelo_4A_Cachinhos_bem_pequenos_em_forma_de_molinha_bem_fechadas._Preto_com_mechas_carameladas_que_se_misturam_com_o_preto.jpg',
      basePrice: 144.00,
      description: 'Mega hair crespo tipo 4A preto com mechas carameladas ombré natural. Cabelo 100% humano brasileiro com cachinhos pequenos em forma de molinha que se misturam harmoniosamente com tons caramelo. Transição de cores natural e sofisticada.',
      technicalSpecs: 'Cabelo brasileiro 100% humano afro-autêntico, tipo 4A cachinhos molinha, base preta #1 com mechas caramelo #27/30, ombré natural, densidade 80-90 fios/cm², elasticidade máxima',
      applicationGuide: 'Aplicação exclusiva por especialista em cabelos afro-texturizados. Técnica de aplicação que respeita o padrão natural dos cachinhos. Mistura estratégica para resultado harmonioso.',
      careInstructions: 'Método LOC (Leave-in, Oil, Cream) obrigatório. Produtos específicos para cabelos crespos e coloridos. Finalização com creme para cachos e óleo selante.',
      compatibility: 'Perfeito para transição capilar e valorização da textura afro. Ideal para quem busca cores sem comprometer a autenticidade.',
      rating: 4.9,
      reviews: 189,
      badge: 'AFRO AUTÊNTICO'
    },
    {
      id: 16,
      name: 'Mega Hair Crespo 4A Ombré Dourado Luxury',
      type: 'crespo' as const,
      color: 'ombre' as const,
      baseImage: '/images/mega-hair-real/Cabelo-_4A_Cachos_muito_fechados_em_forma_de_S_miudo._Cor_raiz_preta_e_um_degrade_dourado_em_toda_o_seu_comprometimento.jpg',
      basePrice: 144.00,
      description: 'Mega hair crespo tipo 4A ombré dourado luxury premium. Cabelo 100% humano brasileiro com raiz preta e degradê dourado em todo comprimento. Cachos fechados em "S" miúdo com transição de cores espetacular.',
      technicalSpecs: 'Cabelo brasileiro 100% humano luxury, tipo 4A cachos em S miúdo, raiz preta #1 com degradê dourado #27, ombré profissional completo, densidade premium 85-95 fios/cm²',
      applicationGuide: 'Aplicação master class por colorista especializado em texturas afro. Técnica de aplicação em camadas para valorizar o degradê. Resultado de impacto garantido.',
      careInstructions: 'Cronograma capilar intensivo para cabelos crespos e coloridos. Produtos sem sulfatos. Hidratação bi-semanal. Proteção térmica e UV obrigatória.',
      compatibility: 'Para mulheres que desejam ousadia mantendo a autenticidade afro. Combina com todos os tons de pele. Look de alta costura.',
      rating: 4.8,
      reviews: 167,
      badge: 'HIGH FASHION'
    },
    {
      id: 17,
      name: 'Mega Hair Crespo 4B Preto Natural Afro Power',
      type: 'crespo' as const,
      color: 'preto' as const,
      baseImage: '/images/mega-hair-real/Cabelo_4B_Curvatura_em_Z_menos_definicao_mais_volume._Preto_natural.jpg',
      basePrice: 135.00,
      description: 'Mega hair crespo tipo 4B preto natural afro power autêntico. Cabelo 100% humano africano com curvatura em "Z" característica, menos definição e máximo volume natural. Textura autêntica que celebra a beleza afro original.',
      technicalSpecs: 'Cabelo afro-brasileiro 100% humano autêntico, tipo 4B curvatura Z, preto profundo #1, padrão irregular natural, volume máximo, densidade especial 75-85 fios/cm²',
      applicationGuide: 'Aplicação por especialista em cabelos afro-texturizados. Técnica que maximiza volume natural. Respeitar a irregularidade natural do padrão - é isso que torna único.',
      careInstructions: 'Cuidados afro especializados. Hidratação intensiva diária. Óleos naturais (coco, rícino, jojoba). Método pineapple para dormir. Nunca escove ou penteie seco.',
      compatibility: 'Para celebrar a beleza afro natural. Ideal para big chop, transição capilar e afirmação de identidade. Volume e atitude garantidos.',
      rating: 4.7,
      reviews: 203,
      badge: 'AFRO POWER'
    },
    {
      id: 18,
      name: 'Mega Hair Crespo 4C Preto Natural Rainha Africana',
      type: 'crespo' as const,
      color: 'preto' as const,
      baseImage: '/images/mega-hair-real/Cabelo_4C_Extremamente_crespo_fios_bem_encolhidos_pouca_definicao_natural._Preto_natural.jpg',
      basePrice: 135.00,
      description: 'Mega hair crespo tipo 4C preto natural rainha africana premium. Cabelo 100% humano afro-autêntico extremamente crespo com fios bem encolhidos e textura natural única. Representa a máxima expressão da beleza afro ancestral.',
      technicalSpecs: 'Cabelo afro-brasileiro 100% humano premium, tipo 4C extremamente crespo, preto intenso #1, fios encolhidos naturalmente, textura irregular autêntica, densidade concentrada 70-80 fios/cm²',
      applicationGuide: 'Aplicação master por especialista em cabelos tipo 4C. Técnica ultra especializada que respeita o encolhimento natural. Produto para conhecedoras da beleza afro.',
      careInstructions: 'Regime de cuidados afro intensivo. Hidratação diária obrigatória. Método LOC religiosamente. Óleos pesados (rícino, murumuru). Manipulação mínima.',
      compatibility: 'Para rainhas que celebram a máxima autenticidade afro. Ideal para coroa afro, twist outs e protective styles. Beleza ancestral garantida.',
      rating: 4.6,
      reviews: 178,
      badge: 'ANCESTRAL'
    }
  ];

  // SISTEMA SIMPLIFICADO: Apenas os 18 produtos reais, cada um com sua foto específica
  // Não gerar múltiplos tamanhos - usar apenas as imagens reais disponíveis

  const products = [];

  hairTypes.forEach((hairType, index) => {
    products.push({
      id: hairType.id,
      name: hairType.name,
      type: hairType.type,
      color: hairType.color,
      length: '50cm', // Tamanho padrão para todos
      price: hairType.basePrice,
      originalPrice: Math.round(hairType.basePrice * 1.3), // 30% desconto
      image: hairType.baseImage, // Usar a imagem real diretamente
      description: hairType.description,
      technicalSpecs: hairType.technicalSpecs,
      applicationGuide: hairType.applicationGuide,
      careInstructions: hairType.careInstructions,
      compatibility: hairType.compatibility,
      rating: hairType.rating,
      reviews: hairType.reviews,
      badge: hairType.badge,
      inStock: true,
      isNew: index < 8, // Primeiros 8 produtos marcados como novos
      origin: 'Brasil',
      weight: 100 // Peso padrão em gramas
    });
  });

  return products;
}

// Exportar catálogo completo como default
export default generateUnifiedCatalog();
