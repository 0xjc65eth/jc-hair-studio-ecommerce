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
  const catalog = generateUnifiedCatalog();

  return catalog.map((product, index) => ({
    id: index + 1,
    name: product.name,
    type: product.type!,
    color: product.color!,
    length: product.length,
    price: product.price,
    image: product.image!,
    badge: product.badge,
    rating: product.rating,
    reviews: product.reviews,
    inStock: product.inStock,
    origin: product.originCountry,
    weight: product.weight
  }));
}

// Exportar catálogo completo como default
export default generateUnifiedCatalog();