/**
 * Shampoo & Condicionador Products  
 * Professional hair care products from Brazil
 * Based on PLANILHA-DETALHADA-PRODUTOS-IMPORTACAO.csv (lines 101-110)
 */

export interface HairCareProduct {
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
  volume: string;
  type: 'shampoo' | 'condicionador' | 'mascara' | 'leave-in' | 'oleo' | 'serum' | 'ampola' | 'spray' | 'tonico';
  rating: number;
  reviews: number;
  inStock: boolean;
  sku: string;
}

export const hairCareProducts: HairCareProduct[] = [
  {
    id: 'shampoo-profissional-500ml',
    sku: 'SHAMP-PRO-01',
    nome: 'Shampoo Profissional Salon Line 500ml',
    marca: 'Salon Line',
    descricao: 'Shampoo profissional 500ml para uso em salão. Limpeza profunda sem ressecar, ideal para todos os tipos de cabelo. Fórmula balanceada pH neutro.',
    imagens: ['/images/products/hair-care/shampoo-profissional-500ml.jpg'],
    badge: 'PROFISSIONAL',
    pricing: {
      basePrice: 6.91,
      ourPrice: 28.90,
      discountPrice: 25.90,
      savings: 3.00,
      margin: '41.2%',
      competitive: 'Preço competitivo vs shampoos profissionais europeus como L\'Oréal Pro (€18-25) e Kérastase (€28-35).'
    },
    category: 'Cuidados & Manutenção',
    volume: '500ml',
    type: 'shampoo',
    rating: 4.7,
    reviews: 312,
    inStock: true
  },
  {
    id: 'condicionador-profissional-500ml',
    sku: 'COND-PRO-02',
    nome: 'Condicionador Profissional Salon Line 500ml',
    marca: 'Salon Line',
    descricao: 'Condicionador profissional 500ml alta performance. Desembaraça, hidrata e sela cutículas. Resultado salão em casa.',
    imagens: ['/images/products/hair-care/condicionador-profissional-500ml.jpg'],
    badge: 'PROFISSIONAL',
    pricing: {
      basePrice: 6.91,
      ourPrice: 28.90,
      discountPrice: 25.90,
      savings: 3.00,
      margin: '41.2%',
      competitive: 'Ótimo valor vs condicionadores pro europeus como Redken (€20-28) e Pureology (€25-32).'
    },
    category: 'Cuidados & Manutenção',
    volume: '500ml',
    type: 'condicionador',
    rating: 4.8,
    reviews: 298,
    inStock: true
  },
  {
    id: 'mascara-reparadora-250g',
    sku: 'MASC-REP-03',
    nome: 'Máscara Reparadora Repair Line 250g',
    marca: 'Repair Line',
    descricao: 'Máscara reparadora intensiva 250g. Reparação profunda em 3 minutos, tecnologia de reconstrução molecular. Ideal para cabelos danificados.',
    imagens: ['/images/products/hair-care/mascara-reparadora-250g.jpg'],
    badge: 'REPARAÇÃO INTENSA',
    pricing: {
      basePrice: 5.82,
      ourPrice: 22.90,
      discountPrice: 20.60,
      savings: 2.30,
      margin: '41.5%',
      competitive: 'Alternativa acessível vs máscaras premium como Olaplex No.8 (€35-42) e K18 Mask (€50-65).'
    },
    category: 'Cuidados & Manutenção',
    volume: '250g',
    type: 'mascara',
    rating: 4.9,
    reviews: 423,
    inStock: true
  },
  {
    id: 'leave-in-protecao-200ml',
    sku: 'LEAVE-PROT-04',
    nome: 'Leave-in Proteção Térmica Protection Line 200ml',
    marca: 'Protection Line',
    descricao: 'Leave-in com proteção térmica 200ml. Protege até 230°C, facilita pentear, reduz frizz. Essencial para quem usa chapinha/secador.',
    imagens: ['/images/products/hair-care/leave-in-protecao-200ml.jpg'],
    badge: 'PROTEÇÃO TÉRMICA',
    pricing: {
      basePrice: 5.09,
      ourPrice: 28.90,
      discountPrice: 25.90,
      savings: 3.00,
      margin: '60.2%',
      competitive: 'Excelente margem vs leave-ins europeus como Moroccanoil (€28-35) e Ouai (€24-30).'
    },
    category: 'Cuidados & Manutenção',
    volume: '200ml',
    type: 'leave-in',
    rating: 4.6,
    reviews: 267,
    inStock: true
  },
  {
    id: 'oleo-capilar-100ml',
    sku: 'OLEO-CAP-05',
    nome: 'Óleo Capilar Multibenefícios Oil Therapy 100ml',
    marca: 'Oil Therapy',
    descricao: 'Óleo capilar multibenefícios 100ml. 7 óleos nobres: argan, coco, macadâmia, jojoba. Nutre, repara, dá brilho e controla frizz.',
    imagens: ['/images/products/hair-care/oleo-capilar-100ml.jpg'],
    badge: '7 ÓLEOS',
    pricing: {
      basePrice: 6.36,
      ourPrice: 28.90,
      discountPrice: 25.90,
      savings: 3.00,
      margin: '59.2%',
      competitive: 'Preço competitivo vs óleos premium como Argan Gold (€22-28) e Mythic Oil (€28-35).'
    },
    category: 'Cuidados & Manutenção',
    volume: '100ml',
    type: 'oleo',
    rating: 4.8,
    reviews: 389,
    inStock: true
  },
  {
    id: 'serum-anti-frizz-60ml',
    sku: 'SERUM-FRIZZ-06',
    nome: 'Sérum Anti-Frizz Smooth Line 60ml',
    marca: 'Smooth Line',
    descricao: 'Sérum anti-frizz controle total 60ml. Elimina frizz por até 72h, mesmo em dias úmidos. Leve, não pesa, acabamento profissional.',
    imagens: ['/images/products/hair-care/serum-anti-frizz-60ml.jpg'],
    badge: 'CONTROLE FRIZZ',
    pricing: {
      basePrice: 5.45,
      ourPrice: 28.90,
      discountPrice: 25.90,
      savings: 3.00,
      margin: '66.1%',
      competitive: 'Excelente margem vs séruns anti-frizz como John Frieda (€15-20) e Frizz Ease (€16-22).'
    },
    category: 'Cuidados & Manutenção',
    volume: '60ml',
    type: 'serum',
    rating: 4.7,
    reviews: 334,
    inStock: true
  },
  {
    id: 'ampola-fortalecimento-15ml',
    sku: 'AMP-FORT-07',
    nome: 'Ampola Fortalecimento Strength Line 15ml',
    marca: 'Strength Line',
    descricao: 'Ampola de fortalecimento dose única 15ml. Tratamento shock com queratina + vitamina E. Resultado imediato em uma aplicação.',
    imagens: ['/images/products/hair-care/ampola-fortalecimento-15ml.jpg'],
    badge: 'DOSE ÚNICA',
    pricing: {
      basePrice: 2.18,
      ourPrice: 28.90,
      discountPrice: 25.90,
      savings: 3.00,
      margin: '80.9%',
      competitive: 'Margem excelente vs ampolas europeias como L\'Oréal Absolut (€8-12) e Kérastase (€12-16). Best-seller garantido!'
    },
    category: 'Cuidados & Manutenção',
    volume: '15ml',
    type: 'ampola',
    rating: 4.9,
    reviews: 567,
    inStock: true
  },
  {
    id: 'spray-termoativo-200ml',
    sku: 'SPRAY-TERM-08',
    nome: 'Spray Termoativo Heat Protection 200ml',
    marca: 'Heat Protection',
    descricao: 'Spray termoativo proteção até 230°C. Spray finalizador que protege contra calor, facilita escova e dá brilho. Essencial para ferramentas quentes.',
    imagens: ['/images/products/hair-care/spray-termoativo-200ml.jpg'],
    badge: 'ATÉ 230°C',
    pricing: {
      basePrice: 5.82,
      ourPrice: 28.90,
      discountPrice: 25.90,
      savings: 3.00,
      margin: '57.8%',
      competitive: 'Boa margem vs sprays térmicos como Tresemmé (€10-14) e Pantene (€9-13).'
    },
    category: 'Cuidados & Manutenção',
    volume: '200ml',
    type: 'spray',
    rating: 4.5,
    reviews: 289,
    inStock: true
  },
  {
    id: 'tonico-crescimento-100ml',
    sku: 'TON-CRESC-09',
    nome: 'Tônico Crescimento Growth Line 100ml',
    marca: 'Growth Line',
    descricao: 'Tônico para crescimento capilar 100ml. Estimula crescimento até 2cm/mês, fortalece raiz, reduz queda. Resultados visíveis em 30 dias.',
    imagens: ['/images/products/hair-care/tonico-crescimento-100ml.jpg'],
    badge: 'CRESCIMENTO',
    pricing: {
      basePrice: 7.64,
      ourPrice: 28.90,
      discountPrice: 25.90,
      savings: 3.00,
      margin: '54.0%',
      competitive: 'Preço atrativo vs tônicos europeus como Novex (€15-20) e Phytoervas (€16-22).'
    },
    category: 'Cuidados & Manutenção',
    volume: '100ml',
    type: 'tonico',
    rating: 4.6,
    reviews: 412,
    inStock: true
  },
  {
    id: 'serum-antiqueda-60ml',
    sku: 'SERUM-QUED-10',
    nome: 'Sérum Antiqueda Anti-Fall 60ml',
    marca: 'Fall Control',
    descricao: 'Sérum antiqueda Fall Control 60ml. Reduz queda em 90 dias, fortalece fios frágeis, estimula bulbo capilar. Tecnologia biotina + cafeína.',
    imagens: ['/images/products/hair-care/serum-antiqueda-60ml.jpg'],
    badge: 'ANTIQUEDA',
    pricing: {
      basePrice: 8.18,
      ourPrice: 28.90,
      discountPrice: 25.90,
      savings: 3.00,
      margin: '56.7%',
      competitive: 'Excelente valor vs séruns antiqueda como Vichy Dercos (€28-35) e Alpecin (€24-30).'
    },
    category: 'Cuidados & Manutenção',
    volume: '60ml',
    type: 'serum',
    rating: 4.8,
    reviews: 478,
    inStock: true
  }
];

// Helper functions
export function getHairCareByType(type: HairCareProduct['type']): HairCareProduct[] {
  return hairCareProducts.filter(p => p.type === type);
}

export function getHairCareById(id: string): HairCareProduct | undefined {
  return hairCareProducts.find(p => p.id === id);
}

export function getHairCareBySku(sku: string): HairCareProduct | undefined {
  return hairCareProducts.find(p => p.sku === sku);
}

export function getHighMarginHairCare(): HairCareProduct[] {
  return hairCareProducts.filter(p => parseFloat(p.pricing.margin) >= 60);
}

export default hairCareProducts;
