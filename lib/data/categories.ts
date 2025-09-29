// Dados mockados para categorias de beleza
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  isNew?: boolean;
  isPopular?: boolean;
  discount?: number;
  description: string;
  features: string[];
  category: string;
  subcategory?: string;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  products: Product[];
}

// PROGRESSIVAS E BTX (3 produtos)
export const progressivasBtxProducts: Product[] = [
  {
    id: 'prog-001',
    name: 'Progressiva Vogue Platinum 1L',
    brand: 'Vogue',
    price: 89.90,
    originalPrice: 120.00,
    rating: 4.8,
    reviewCount: 245,
    image: '/images/products/progressivas_diversas/progressivas_diversas_1.JPG',
    isNew: true,
    isPopular: true,
    discount: 25,
    description: 'Progressiva de alta performance com queratina e colágeno',
    features: ['Redução de 95% do volume', 'Duração até 4 meses', 'Sem formol', 'Para todos os tipos de cabelo'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  },
  {
    id: 'prog-002',
    name: 'BTX Capilar Reconstruction 500ml',
    brand: 'Inoar',
    price: 65.50,
    rating: 4.6,
    reviewCount: 189,
    image: '/images/products/progressivas_diversas/progressivas_diversas_2.JPG',
    isPopular: true,
    description: 'Botox capilar para reconstrução e hidratação profunda',
    features: ['Hidratação intensa', 'Reduz frizz', 'Brilho intenso', 'Sem química agressiva'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  },
  {
    id: 'prog-003',
    name: 'Progressiva Orgânica Argan Oil',
    brand: 'Professional',
    price: 75.90,
    originalPrice: 95.00,
    rating: 4.7,
    reviewCount: 156,
    image: '/images/products/progressivas_diversas/progressivas_diversas_3.JPG',
    discount: 20,
    description: 'Progressiva orgânica enriquecida com óleo de argan',
    features: ['100% orgânica', 'Nutrição profunda', 'Proteção UV', 'Resultado natural'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  }
];

// TRATAMENTOS CAPILARES - removidos produtos placeholder conforme solicitado
export const tratamentosCapilaresProducts: Product[] = [
  // PRODUTOS WEPINK - TRATAMENTOS CAPILARES
  {
    id: 'wepink-trat-001',
    name: 'Booster Repair Óleo Capilar 30ml',
    brand: 'Wepink',
    price: 38.90,
    rating: 4.8,
    reviewCount: 145,
    image: '/images/products/wepink-tratamentos/booster-repair-oleo.png',
    isNew: true,
    description: 'Óleo capilar concentrado Booster Repair para reparação intensiva dos fios',
    features: ['Reparação profunda', 'Óleo concentrado', 'Nutrição intensa', 'Brilho extremo'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'wepink-trat-002',
    name: 'Hair Mist Liberté Desodorante Capilar 50ml',
    brand: 'Wepink',
    price: 29.90,
    rating: 4.6,
    reviewCount: 198,
    image: '/images/products/wepink-tratamentos/hair-mist-liberte.png',
    isPopular: true,
    description: 'Hair Mist Liberté com fragrância exclusiva para perfumar e proteger os cabelos',
    features: ['Fragrância exclusiva', 'Proteção capilar', 'Longa duração', 'Frescor'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'wepink-trat-003',
    name: 'Hair Mist Liberté Premium Desodorante Capilar 50ml',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.7,
    reviewCount: 176,
    image: '/images/products/wepink-tratamentos/hair-mist-liberte-2.png',
    description: 'Hair Mist Liberté Premium com fórmula enriquecida e fragrância sofisticada',
    features: ['Fórmula premium', 'Fragrância sofisticada', 'Hidratação leve', 'Proteção UV'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'wepink-trat-004',
    name: 'Hair Mist Liberté Exclusif Desodorante Capilar 50ml',
    brand: 'Wepink',
    price: 34.90,
    rating: 4.9,
    reviewCount: 234,
    image: '/images/products/wepink-tratamentos/hair-mist-liberte-exclusif.png',
    isPopular: true,
    description: 'Hair Mist Liberté Exclusif com fragrância limitada e ingredientes premium',
    features: ['Edição exclusiva', 'Fragrância limitada', 'Ingredientes premium', 'Luxo acessível'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'wepink-trat-005',
    name: 'Hair Mist Obsessed Desodorante Capilar 50ml',
    brand: 'Wepink',
    price: 31.90,
    rating: 4.5,
    reviewCount: 189,
    image: '/images/products/wepink-tratamentos/hair-mist-obsessed.png',
    description: 'Hair Mist Obsessed com fragrância envolvente e proteção antioxidante',
    features: ['Fragrância envolvente', 'Proteção antioxidante', 'Fixação prolongada', 'Frescor duradouro'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'wepink-trat-006',
    name: 'Hair Mist Red Desodorante Capilar 50ml',
    brand: 'Wepink',
    price: 33.90,
    rating: 4.8,
    reviewCount: 212,
    image: '/images/products/wepink-tratamentos/hair-mist-red.png',
    isNew: true,
    description: 'Hair Mist Red com fragrância marcante e proteção contra poluição urbana',
    features: ['Fragrância marcante', 'Anti-poluição', 'Proteção térmica', 'Elegância urbana'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'wepink-trat-007',
    name: 'Hair Tonic - Tônico Capilar 120ml',
    brand: 'Wepink',
    price: 42.90,
    rating: 4.7,
    reviewCount: 167,
    image: '/images/products/wepink-tratamentos/hair-tonic-tonico.png',
    description: 'Tônico capilar revitalizante Hair Tonic para estimular o crescimento e fortalecer',
    features: ['Estimula crescimento', 'Fortalecimento', 'Revitalização', 'Aplicação prática'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'wepink-trat-008',
    name: 'Leave-in Capilar Multifuncional 120ml',
    brand: 'Wepink',
    price: 39.90,
    rating: 4.9,
    reviewCount: 298,
    image: '/images/products/wepink-tratamentos/leave-in-multifuncional.png',
    isPopular: true,
    description: 'Leave-in multifuncional com 10 benefícios em 1 produto para todos os tipos de cabelo',
    features: ['10 benefícios em 1', 'Multifuncional', 'Proteção térmica', 'Hidratação prolongada'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  }
];

// SHAMPOOS E CONDICIONADORES WEPINK (4 produtos)
export const shampoosCondicionadoresProducts: Product[] = [
  {
    id: 'wepink-001',
    name: 'Shampoo My Hair Ultra Repair 250ml',
    brand: 'Wepink',
    price: 45.90,
    rating: 4.7,
    reviewCount: 198,
    image: '/images/products/wepink-shampoos/shampoo-ultra-repair.png',
    isNew: true,
    description: 'Shampoo ultra reparador Wepink para cabelos danificados com fórmula avançada',
    features: ['Reparação intensa', 'Cabelos danificados', 'Limpeza suave', 'Hidratação'],
    category: 'shampoos-condicionadores',
    availability: 'in_stock'
  },
  {
    id: 'wepink-002',
    name: 'Condicionador My Hair Ultra Repair 250ml',
    brand: 'Wepink',
    price: 42.90,
    rating: 4.6,
    reviewCount: 176,
    image: '/images/products/wepink-condicionadores/condicionador-ultra-repair.png',
    description: 'Condicionador ultra reparador com tecnologia avançada para cabelos ressecados',
    features: ['Condicionamento profundo', 'Reparação capilar', 'Maciez', 'Desembaraço'],
    category: 'shampoos-condicionadores',
    availability: 'in_stock'
  },
  {
    id: 'wepink-003',
    name: 'Condicionador My Hair Ultra Repair Premium 250ml',
    brand: 'Wepink',
    price: 44.90,
    rating: 4.8,
    reviewCount: 203,
    image: '/images/products/wepink-condicionadores/condicionador-ultra-repair-2.png',
    isPopular: true,
    description: 'Condicionador premium da linha My Hair Ultra Repair com fórmula enriquecida',
    features: ['Fórmula premium', 'Nutrição profunda', 'Brilho intenso', 'Proteção'],
    category: 'shampoos-condicionadores',
    availability: 'in_stock'
  },
  {
    id: 'wepink-004',
    name: 'Proteína Condicionante My Hair Ultra Repair 230ml',
    brand: 'Wepink',
    price: 48.90,
    rating: 4.9,
    reviewCount: 234,
    image: '/images/products/wepink-condicionadores/proteina-condicionante.png',
    isPopular: true,
    description: 'Proteína condicionante com ação reparadora intensiva para cabelos extremamente danificados',
    features: ['Proteína reparadora', 'Reconstrução capilar', 'Força e resistência', 'Cabelos fortes'],
    category: 'shampoos-condicionadores',
    availability: 'in_stock'
  }
];

// MAQUIAGEM BRASILEIRA (10 produtos)
export const maquiagemBrasileiraProducts: Product[] = [
  {
    id: 'maq-001',
    name: 'Base Líquida Eudora Glam',
    brand: 'Eudora',
    price: 49.90,
    originalPrice: 65.90,
    rating: 4.6,
    reviewCount: 678,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-01.png',
    isPopular: true,
    discount: 24,
    description: 'Base líquida com cobertura natural e longa duração',
    features: ['Cobertura natural', 'Longa duração', '12 tons', 'FPS 15'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'maq-002',
    name: 'Paleta de Sombras Natura Una',
    brand: 'Natura',
    price: 89.90,
    rating: 4.7,
    reviewCount: 445,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-02.png',
    isNew: true,
    description: 'Paleta com 12 cores inspiradas na natureza brasileira',
    features: ['12 cores', 'Vegana', 'Pigmentação intensa', 'Cores tropicais'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'maq-003',
    name: 'Batom Líquido Ruby Rose',
    brand: 'Ruby Rose',
    price: 25.90,
    rating: 4.4,
    reviewCount: 789,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-03.png',
    description: 'Batom líquido matte de longa duração',
    features: ['Efeito matte', 'Longa duração', '20 cores', 'Transfer-proof'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'maq-004',
    name: 'Blush Compacto Avon True',
    brand: 'Avon',
    price: 32.90,
    originalPrice: 42.90,
    rating: 4.5,
    reviewCount: 356,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-04.png',
    discount: 23,
    description: 'Blush compacto com cor natural e duradoura',
    features: ['Cor natural', 'Longa duração', 'Fácil aplicação', '8 tons'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'maq-005',
    name: 'Máscara de Cílios Quem Disse Berenice',
    brand: 'Quem Disse Berenice',
    price: 45.90,
    rating: 4.6,
    reviewCount: 523,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-05.png',
    isPopular: true,
    description: 'Máscara para volume e curvatura extrema',
    features: ['Volume extremo', 'Curvatura', 'À prova d\'água', 'Não resseca'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'maq-006',
    name: 'Corretivo Líquido Payot',
    brand: 'Payot',
    price: 38.50,
    rating: 4.3,
    reviewCount: 234,
    image: '/images/products/mari-maria-bases/mari-maria-bases_1.jpg',
    description: 'Corretivo líquido de alta cobertura',
    features: ['Alta cobertura', 'Natural', 'Não resseca', '15 tons'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'maq-007',
    name: 'Pó Compacto Translúcido Vult',
    brand: 'Vult',
    price: 29.90,
    rating: 4.4,
    reviewCount: 445,
    image: '/images/products/mari-maria-bases/mari-maria-bases_2.jpg',
    description: 'Pó compacto para fixação da maquiagem',
    features: ['Fixação', 'Translúcido', 'Controla oleosidade', 'Acabamento natural'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'maq-008',
    name: 'Delineador Gel Mahav',
    brand: 'Mahav',
    price: 22.90,
    originalPrice: 29.90,
    rating: 4.2,
    reviewCount: 178,
    image: '/images/products/mari-maria-bases/mari-maria-bases_3.jpg',
    discount: 23,
    description: 'Delineador em gel de longa duração',
    features: ['Longa duração', 'Pigmentação intensa', 'Fácil aplicação', 'À prova d\'água'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'maq-009',
    name: 'Iluminador Facial Tracta',
    brand: 'Tracta',
    price: 42.50,
    rating: 4.5,
    reviewCount: 267,
    image: '/images/products/mari-maria-bases/mari-maria-bases_4.jpg',
    isNew: true,
    description: 'Iluminador para glow natural',
    features: ['Glow natural', 'Múltiplos usos', 'Vegano', 'Cruelty-free'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'maq-010',
    name: 'Kit Contorno Facial Océane',
    brand: 'Océane',
    price: 65.90,
    rating: 4.6,
    reviewCount: 198,
    image: '/images/products/mari-maria-bases/mari-maria-bases_5.jpg',
    description: 'Kit completo para contorno facial',
    features: ['Kit completo', 'Fácil aplicação', 'Natural', 'Para todos os tons'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  // BASES WEPINK VIRGINIA
  {
    id: 'wepink-base-001',
    name: 'Base Líquida Virginia Cor 01 - Tom Bem Claro',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.7,
    reviewCount: 89,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-01.png',
    isNew: true,
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Bem Claro',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'wepink-base-002',
    name: 'Base Líquida Virginia Cor 02 - Tom Claro',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.8,
    reviewCount: 112,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-02.png',
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Claro',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'wepink-base-003',
    name: 'Base Líquida Virginia Cor 03 - Tom Claro Rosado',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.6,
    reviewCount: 95,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-03.png',
    isPopular: true,
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Claro Rosado',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'wepink-base-004',
    name: 'Base Líquida Virginia Cor 04 - Tom Claro Amarelado',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.7,
    reviewCount: 78,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-04.png',
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Claro Amarelado',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'wepink-base-005',
    name: 'Base Líquida Virginia Cor 05 - Tom Médio Claro',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.8,
    reviewCount: 134,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-05.png',
    isPopular: true,
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Médio Claro',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'wepink-base-006',
    name: 'Base Líquida Virginia Cor 06 - Tom Médio',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.9,
    reviewCount: 156,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-06.png',
    isPopular: true,
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Médio',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'wepink-base-007',
    name: 'Base Líquida Virginia Cor 07 - Tom Médio Rosado',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.7,
    reviewCount: 89,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-07.png',
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Médio Rosado',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'wepink-base-008',
    name: 'Base Líquida Virginia Cor 08 - Tom Médio Escuro',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.8,
    reviewCount: 67,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-08.png',
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Médio Escuro',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'wepink-base-009',
    name: 'Base Líquida Virginia Cor 09 - Tom Escuro',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.9,
    reviewCount: 123,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-09.png',
    isPopular: true,
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Escuro',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'wepink-base-010',
    name: 'Base Líquida Virginia Cor 10 - Tom Escuro Dourado',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.6,
    reviewCount: 78,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-10.png',
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Escuro Dourado',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'wepink-base-011',
    name: 'Base Líquida Virginia Cor 11 - Tom Escuro Rosado',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.7,
    reviewCount: 94,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-11.png',
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Escuro Rosado',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'wepink-base-012',
    name: 'Base Líquida Virginia Cor 12 - Tom Bem Escuro',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.8,
    reviewCount: 87,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-12.png',
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Bem Escuro',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'wepink-base-013',
    name: 'Base Líquida Virginia Cor 13 - Tom Extra Escuro',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.9,
    reviewCount: 145,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-13.png',
    isPopular: true,
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Extra Escuro',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'wepink-base-014',
    name: 'Base Líquida Virginia Cor 14 - Tom Extra Escuro Dourado',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.7,
    reviewCount: 76,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-14.png',
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Extra Escuro Dourado',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  },
  {
    id: 'wepink-base-015',
    name: 'Base Líquida Virginia Cor 15 - Tom Extra Escuro Intenso',
    brand: 'Wepink',
    price: 32.90,
    rating: 4.8,
    reviewCount: 102,
    image: '/images/products/wepink-virginia-bases/wepink-base-cor-15.png',
    description: 'Base líquida Virginia com cobertura natural e longa duração - Tom Extra Escuro Intenso',
    features: ['Cobertura natural', 'Longa duração', 'Hidratante', 'Antioxidante'],
    category: 'maquiagem-brasileira',
    availability: 'in_stock'
  }
];

// FERRAMENTAS E EQUIPAMENTOS (8 produtos)
export const ferramentasEquipamentosProducts: Product[] = [
  {
    id: 'ferr-001',
    name: 'Chapinha Titanium Professional',
    brand: 'Babyliss',
    price: 189.90,
    originalPrice: 239.90,
    rating: 4.8,
    reviewCount: 567,
    image: '/images/products/produtos_diversos/produtos_diversos_1.jpg',
    isPopular: true,
    discount: 21,
    description: 'Chapinha profissional com placas de titanium',
    features: ['Placas titanium', 'Até 235°C', 'Íons negativos', 'Bivolt'],
    category: 'ferramentas-equipamentos',
    availability: 'in_stock'
  },
  {
    id: 'ferr-002',
    name: 'Secador Ionic Ceramic 2000W',
    brand: 'Taiff',
    price: 125.90,
    rating: 4.6,
    reviewCount: 423,
    image: '/images/products/produtos_diversos/produtos_diversos_2.jpg',
    description: 'Secador profissional com tecnologia iônica',
    features: ['2000W potência', 'Tecnologia iônica', 'Cerâmica', '3 temperaturas'],
    category: 'ferramentas-equipamentos',
    availability: 'in_stock'
  },
  {
    id: 'ferr-003',
    name: 'Modelador de Cachos 32mm',
    brand: 'Conair',
    price: 78.90,
    originalPrice: 95.90,
    rating: 4.4,
    reviewCount: 234,
    image: '/images/products/produtos_diversos/produtos_diversos_3.jpg',
    discount: 18,
    description: 'Modelador para cachos perfeitos',
    features: ['Barril 32mm', 'Revestimento cerâmico', 'Controle temperatura', 'Garra automática'],
    category: 'ferramentas-equipamentos',
    availability: 'in_stock'
  },
  {
    id: 'ferr-004',
    name: 'Escova Alisadora Elétrica',
    brand: 'Philco',
    price: 89.50,
    rating: 4.3,
    reviewCount: 345,
    image: '/images/products/produtos_diversos/produtos_diversos_4.jpg',
    isNew: true,
    description: 'Escova alisadora com cerdas aquecidas',
    features: ['Cerdas aquecidas', 'Alisamento rápido', 'Anti-queimadura', 'LED display'],
    category: 'ferramentas-equipamentos',
    availability: 'in_stock'
  },
  {
    id: 'ferr-005',
    name: 'Kit Pincéis Profissionais',
    brand: 'Macrilan',
    price: 145.90,
    rating: 4.7,
    reviewCount: 189,
    image: '/images/products/produtos_diversos/produtos_diversos_5.jpg',
    description: 'Kit com 12 pincéis profissionais para maquiagem',
    features: ['12 pincéis', 'Cerdas sintéticas', 'Cabo anatômico', 'Estojo incluso'],
    category: 'ferramentas-equipamentos',
    availability: 'in_stock'
  },
  {
    id: 'ferr-006',
    name: 'Prancha Alisadora Vapor',
    brand: 'Remington',
    price: 195.90,
    rating: 4.6,
    reviewCount: 298,
    image: '/images/products/produtos_diversos/produtos_diversos_6.jpg',
    isPopular: true,
    description: 'Prancha com tecnologia de vapor para hidratação',
    features: ['Tecnologia vapor', 'Hidrata enquanto alisa', 'Placas flutuantes', 'Aquecimento rápido'],
    category: 'ferramentas-equipamentos',
    availability: 'in_stock'
  },
  {
    id: 'ferr-007',
    name: 'Babyliss Ondulador Automático',
    brand: 'Babyliss',
    price: 245.90,
    originalPrice: 299.90,
    rating: 4.8,
    reviewCount: 156,
    image: '/images/products/produtos_diversos/produtos_diversos_7.jpg',
    discount: 18,
    description: 'Ondulador automático para cachos perfeitos',
    features: ['Cachos automáticos', '3 tamanhos', 'Timer digital', 'Segurança total'],
    category: 'ferramentas-equipamentos',
    availability: 'in_stock'
  },
  {
    id: 'ferr-008',
    name: 'Touca Térmica Professional',
    brand: 'Mega Hair',
    price: 65.90,
    rating: 4.4,
    reviewCount: 123,
    image: '/images/products/produtos_diversos/produtos_diversos_8.jpg',
    description: 'Touca térmica para tratamentos capilares',
    features: ['Aquecimento uniforme', 'Timer digital', 'Temperatura ajustável', 'Uso profissional'],
    category: 'ferramentas-equipamentos',
    availability: 'in_stock'
  }
];

// Categorias principais
export const beautyCategories: Category[] = [
  {
    id: 'progressivas-btx',
    name: 'Progressivas e BTX',
    slug: 'progressivas-btx',
    description: 'Progressivas e tratamentos de botox capilar para alisamento e nutrição profunda',
    image: '/images/categories/progressivas-btx.jpg',
    productCount: 3,
    products: progressivasBtxProducts
  },
  {
    id: 'tratamentos-capilares',
    name: 'Tratamentos Capilares',
    slug: 'tratamentos-capilares',
    description: 'Produtos WEPINK para tratamentos capilares profissionais',
    image: '/images/categories/tratamentos.jpg',
    productCount: 8,
    products: tratamentosCapilaresProducts
  },
  {
    id: 'shampoos-condicionadores',
    name: 'Shampoos e Condicionadores',
    slug: 'shampoos-condicionadores',
    description: 'Produtos de limpeza e condicionamento profissionais',
    image: '/images/categories/shampoos.jpg',
    productCount: 4,
    products: shampoosCondicionadoresProducts
  },
  {
    id: 'maquiagem-brasileira',
    name: 'Maquiagem Brasileira',
    slug: 'maquiagem-brasileira',
    description: 'As melhores marcas brasileiras de maquiagem',
    image: '/images/categories/maquiagem.jpg',
    productCount: 25,
    products: maquiagemBrasileiraProducts
  },
  {
    id: 'ferramentas-equipamentos',
    name: 'Ferramentas e Equipamentos',
    slug: 'ferramentas-equipamentos',
    description: 'Ferramentas profissionais para cabeleireiros e uso doméstico',
    image: '/images/categories/ferramentas.jpg',
    productCount: 8,
    products: ferramentasEquipamentosProducts
  }
];

// Todas as marcas disponíveis
export const allBrands = [
  'Vogue', 'Inoar', 'Professional', 'Kerastase', 'Seda', 'L\'Oreal', 'Blondme',
  'Skala', 'Matrix', 'Wella', 'Schwarzkopf', 'Felps', 'Alterna', 'DevaCurl',
  'Vichy', 'Moroccanoil', 'Pantene', 'Phyto', 'Tresemmé', 'Novex', 'Batiste',
  'Eudora', 'Natura', 'Ruby Rose', 'Avon', 'Quem Disse Berenice', 'Payot',
  'Vult', 'Mahav', 'Tracta', 'Océane', 'Babyliss', 'Taiff', 'Conair',
  'Philco', 'Macrilan', 'Remington', 'Mega Hair', 'Wepink'
];

// Faixas de preço
export const priceRanges = [
  { id: '0-30', label: 'Até €30', min: 0, max: 30 },
  { id: '30-60', label: '€30 - €60', min: 30, max: 60 },
  { id: '60-100', label: '€60 - €100', min: 60, max: 100 },
  { id: '100-150', label: '€100 - €150', min: 100, max: 150 },
  { id: '150+', label: 'Acima de €150', min: 150, max: Infinity }
];

// Opções de ordenação
export const sortOptions = [
  { id: 'popularity', label: 'Mais Populares' },
  { id: 'newest', label: 'Lançamentos' },
  { id: 'price-low', label: 'Menor Preço' },
  { id: 'price-high', label: 'Maior Preço' },
  { id: 'rating', label: 'Melhor Avaliação' },
  { id: 'name', label: 'Nome A-Z' }
];

// Export categories as an alias for beautyCategories for compatibility
export const categories = beautyCategories;