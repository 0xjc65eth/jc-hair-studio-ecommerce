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

// PROGRESSIVAS E BTX (15 produtos)
export const progressivasBtxProducts: Product[] = [
  {
    id: 'prog-001',
    name: 'Progressiva Vogue Platinum 1L',
    brand: 'Vogue',
    price: 89.90,
    originalPrice: 120.00,
    rating: 4.8,
    reviewCount: 245,
    image: '/images/products/progressiva-vogue-platinum.jpg',
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
    image: '/images/products/btx-reconstruction.jpg',
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
    image: '/images/products/progressiva-organica-argan.jpg',
    discount: 20,
    description: 'Progressiva orgânica enriquecida com óleo de argan',
    features: ['100% orgânica', 'Nutrição profunda', 'Proteção UV', 'Resultado natural'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  },
  {
    id: 'prog-004',
    name: 'BTX Anti-Idade Collagen Plus',
    brand: 'Kerastase',
    price: 125.00,
    rating: 4.9,
    reviewCount: 298,
    image: '/images/products/btx-anti-idade.jpg',
    isPopular: true,
    description: 'Tratamento anti-idade com colágeno para cabelos maduros',
    features: ['Anti-idade', 'Fortalecimento', 'Elasticidade', 'Textura sedosa'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  },
  {
    id: 'prog-005',
    name: 'Progressiva Cachos Definidos',
    brand: 'Seda',
    price: 58.90,
    rating: 4.4,
    reviewCount: 167,
    image: '/images/products/progressiva-cachos.jpg',
    description: 'Progressiva especial para definição de cachos naturais',
    features: ['Define cachos', 'Reduz frizz', 'Hidratação', 'Movimento natural'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  },
  {
    id: 'prog-006',
    name: 'BTX Thermal Protect',
    brand: 'L\'Oreal',
    price: 98.50,
    rating: 4.6,
    reviewCount: 203,
    image: '/images/products/btx-thermal.jpg',
    isNew: true,
    description: 'Botox com proteção térmica para uso frequente de ferramentas',
    features: ['Proteção térmica', 'Reparação', 'Brilho', 'Leveza'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  },
  {
    id: 'prog-007',
    name: 'Progressiva Nano Keratin',
    brand: 'Inoar',
    price: 145.00,
    rating: 4.8,
    reviewCount: 312,
    image: '/images/products/progressiva-nano.jpg',
    isPopular: true,
    description: 'Tecnologia nanotecnológica para alisamento perfeito',
    features: ['Nanotecnologia', 'Alisamento perfeito', 'Longa duração', 'Cabelo sedoso'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  },
  {
    id: 'prog-008',
    name: 'BTX Blonde Specialist',
    brand: 'Blondme',
    price: 115.90,
    rating: 4.7,
    reviewCount: 178,
    image: '/images/products/btx-blonde.jpg',
    description: 'Botox especializado para cabelos loiros e descoloridos',
    features: ['Para loiros', 'Neutraliza amarelado', 'Hidratação', 'Brilho platinado'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  },
  {
    id: 'prog-009',
    name: 'Progressiva Vegana Natural',
    brand: 'Skala',
    price: 42.90,
    rating: 4.3,
    reviewCount: 145,
    image: '/images/products/progressiva-vegana.jpg',
    description: 'Progressiva 100% vegana com ingredientes naturais',
    features: ['100% vegana', 'Cruelty-free', 'Ingredientes naturais', 'Eco-friendly'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  },
  {
    id: 'prog-010',
    name: 'BTX Repair Extreme',
    brand: 'Matrix',
    price: 78.50,
    originalPrice: 95.00,
    rating: 4.5,
    reviewCount: 189,
    image: '/images/products/btx-repair.jpg',
    discount: 17,
    description: 'Reparação extrema para cabelos muito danificados',
    features: ['Reparação intensa', 'Cabelos danificados', 'Força', 'Resistência'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  },
  {
    id: 'prog-011',
    name: 'Progressiva Smooth & Shine',
    brand: 'Wella',
    price: 87.90,
    rating: 4.6,
    reviewCount: 234,
    image: '/images/products/progressiva-smooth.jpg',
    description: 'Alisamento suave com brilho intenso',
    features: ['Alisamento suave', 'Brilho intenso', 'Maciez', 'Controle de frizz'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  },
  {
    id: 'prog-012',
    name: 'BTX Hydra Intensive',
    brand: 'Schwarzkopf',
    price: 105.00,
    rating: 4.7,
    reviewCount: 267,
    image: '/images/products/btx-hydra.jpg',
    isNew: true,
    description: 'Hidratação intensiva com efeito botox',
    features: ['Hidratação profunda', 'Efeito botox', 'Nutrição', 'Revitalização'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  },
  {
    id: 'prog-013',
    name: 'Progressiva Express 30min',
    brand: 'Felps',
    price: 68.90,
    rating: 4.4,
    reviewCount: 198,
    image: '/images/products/progressiva-express.jpg',
    description: 'Progressiva rápida com resultado em 30 minutos',
    features: ['Aplicação rápida', '30 minutos', 'Praticidade', 'Resultado imediato'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  },
  {
    id: 'prog-014',
    name: 'BTX Caviar Luxury',
    brand: 'Alterna',
    price: 189.90,
    rating: 4.9,
    reviewCount: 156,
    image: '/images/products/btx-caviar.jpg',
    isPopular: true,
    description: 'Tratamento de luxo com extrato de caviar',
    features: ['Extrato de caviar', 'Luxo premium', 'Anti-aging', 'Regeneração celular'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  },
  {
    id: 'prog-015',
    name: 'Progressiva Curl Enhancer',
    brand: 'DevaCurl',
    price: 95.50,
    rating: 4.8,
    reviewCount: 223,
    image: '/images/products/progressiva-curl.jpg',
    description: 'Progressiva que realça cachos naturais',
    features: ['Realça cachos', 'Definição', 'Hidratação', 'Movimento natural'],
    category: 'progressivas-btx',
    availability: 'in_stock'
  }
];

// TRATAMENTOS CAPILARES (10 produtos)
export const tratamentosCapilaresProducts: Product[] = [
  {
    id: 'trat-001',
    name: 'Máscara Reparadora Absolut',
    brand: 'Kerastase',
    price: 125.90,
    rating: 4.8,
    reviewCount: 345,
    image: '/images/products/mascara-reparadora.jpg',
    isPopular: true,
    description: 'Máscara reparadora para cabelos extremamente danificados',
    features: ['Reparação profunda', 'Cabelos danificados', 'Nutrição intensa', 'Força e elasticidade'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'trat-002',
    name: 'Ampola Reconstruction 12ml',
    brand: 'L\'Oreal',
    price: 45.50,
    originalPrice: 55.00,
    rating: 4.6,
    reviewCount: 289,
    image: '/images/products/ampola-reconstruction.jpg',
    discount: 17,
    description: 'Ampola de reconstrução capilar intensiva',
    features: ['Reconstrução', 'Uso intensivo', 'Quebra zero', 'Cabelos fortes'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'trat-003',
    name: 'Sérum Anti-Queda Crescimento',
    brand: 'Vichy',
    price: 89.90,
    rating: 4.7,
    reviewCount: 456,
    image: '/images/products/serum-antiqueda.jpg',
    isNew: true,
    description: 'Sérum para combater queda e estimular crescimento',
    features: ['Anti-queda', 'Estimula crescimento', 'Fortalece raiz', 'Densidade'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'trat-004',
    name: 'Óleo Capilar Argan & Macadâmia',
    brand: 'Moroccanoil',
    price: 165.00,
    rating: 4.9,
    reviewCount: 378,
    image: '/images/products/oleo-argan.jpg',
    isPopular: true,
    description: 'Óleo nutritivo com argan e macadâmia',
    features: ['Nutrição profunda', 'Brilho intenso', 'Proteção', 'Maciez sedosa'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'trat-005',
    name: 'Leave-in Hidratante 300ml',
    brand: 'Pantene',
    price: 35.90,
    rating: 4.4,
    reviewCount: 567,
    image: '/images/products/leave-in-hidratante.jpg',
    description: 'Leave-in para hidratação diária',
    features: ['Hidratação diária', 'Proteção térmica', 'Desembaraça', 'Maciez'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'trat-006',
    name: 'Cronograma Capilar Completo',
    brand: 'Seda',
    price: 78.50,
    originalPrice: 95.00,
    rating: 4.5,
    reviewCount: 234,
    image: '/images/products/cronograma-capilar.jpg',
    discount: 17,
    description: 'Kit completo para cronograma capilar',
    features: ['Kit completo', 'Hidratação', 'Nutrição', 'Reconstrução'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'trat-007',
    name: 'Tônico Fortalecedor Raiz',
    brand: 'Phyto',
    price: 95.90,
    rating: 4.6,
    reviewCount: 178,
    image: '/images/products/tonico-fortalecedor.jpg',
    description: 'Tônico para fortalecer a raiz e estimular crescimento',
    features: ['Fortalece raiz', 'Estimula crescimento', 'Circulação', 'Densidade'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'trat-008',
    name: 'Máscara Matizadora Platinum',
    brand: 'Blondme',
    price: 68.90,
    rating: 4.7,
    reviewCount: 298,
    image: '/images/products/mascara-matizadora.jpg',
    description: 'Máscara matizadora para cabelos loiros',
    features: ['Matiza amarelado', 'Tons platinados', 'Hidratação', 'Brilho'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'trat-009',
    name: 'Protetor Térmico Professional',
    brand: 'Tresemmé',
    price: 42.50,
    rating: 4.3,
    reviewCount: 445,
    image: '/images/products/protetor-termico.jpg',
    description: 'Proteção térmica até 230°C',
    features: ['Proteção 230°C', 'Anti-frizz', 'Brilho', 'Movimento natural'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  },
  {
    id: 'trat-010',
    name: 'Vitamina Capilar Growth',
    brand: 'Novex',
    price: 55.90,
    rating: 4.5,
    reviewCount: 189,
    image: '/images/products/vitamina-capilar.jpg',
    isNew: true,
    description: 'Complexo vitamínico para crescimento capilar',
    features: ['Complexo vitamínico', 'Crescimento', 'Fortalecimento', 'Nutrição'],
    category: 'tratamentos-capilares',
    availability: 'in_stock'
  }
];

// SHAMPOOS E CONDICIONADORES (8 produtos)
export const shampoosCondicionadoresProducts: Product[] = [
  {
    id: 'sham-001',
    name: 'Kit Shampoo + Condicionador Keratin',
    brand: 'Kerastase',
    price: 145.90,
    originalPrice: 180.00,
    rating: 4.8,
    reviewCount: 567,
    image: '/images/products/kit-keratin.jpg',
    isPopular: true,
    discount: 19,
    description: 'Kit completo com queratina para cabelos lisos',
    features: ['Queratina', 'Alisamento', 'Nutrição', 'Brilho intenso'],
    category: 'shampoos-condicionadores',
    availability: 'in_stock'
  },
  {
    id: 'sham-002',
    name: 'Shampoo Antiqueda Dercos',
    brand: 'Vichy',
    price: 68.50,
    rating: 4.6,
    reviewCount: 423,
    image: '/images/products/shampoo-antiqueda.jpg',
    description: 'Shampoo específico para queda de cabelo',
    features: ['Anti-queda', 'Fortalecimento', 'Estimula crescimento', 'Dermatológico'],
    category: 'shampoos-condicionadores',
    availability: 'in_stock'
  },
  {
    id: 'sham-003',
    name: 'Condicionador Hidratante Cachos',
    brand: 'DevaCurl',
    price: 85.90,
    rating: 4.7,
    reviewCount: 345,
    image: '/images/products/condicionador-cachos.jpg',
    isNew: true,
    description: 'Condicionador específico para cabelos cacheados',
    features: ['Para cachos', 'Definição', 'Hidratação', 'Anti-frizz'],
    category: 'shampoos-condicionadores',
    availability: 'in_stock'
  },
  {
    id: 'sham-004',
    name: 'Shampoo Matizador Silver',
    brand: 'Blondme',
    price: 52.90,
    rating: 4.5,
    reviewCount: 289,
    image: '/images/products/shampoo-matizador.jpg',
    description: 'Shampoo matizador para cabelos grisalhos e brancos',
    features: ['Matiza amarelado', 'Tons prateados', 'Brilho', 'Suavidade'],
    category: 'shampoos-condicionadores',
    availability: 'in_stock'
  },
  {
    id: 'sham-005',
    name: 'Kit Reparação Extrema 500ml',
    brand: 'L\'Oreal',
    price: 95.50,
    originalPrice: 115.00,
    rating: 4.6,
    reviewCount: 198,
    image: '/images/products/kit-reparacao.jpg',
    discount: 17,
    description: 'Kit para cabelos extremamente danificados',
    features: ['Reparação extrema', 'Cabelos danificados', 'Força', 'Elasticidade'],
    category: 'shampoos-condicionadores',
    availability: 'in_stock'
  },
  {
    id: 'sham-006',
    name: 'Shampoo Seco Refresh 200ml',
    brand: 'Batiste',
    price: 35.90,
    rating: 4.4,
    reviewCount: 456,
    image: '/images/products/shampoo-seco.jpg',
    description: 'Shampoo seco para limpeza instantânea',
    features: ['Limpeza instantânea', 'Absorve oleosidade', 'Volume', 'Praticidade'],
    category: 'shampoos-condicionadores',
    availability: 'in_stock'
  },
  {
    id: 'sham-007',
    name: 'Condicionador Nutritivo Argan',
    brand: 'Moroccanoil',
    price: 125.00,
    rating: 4.8,
    reviewCount: 234,
    image: '/images/products/condicionador-argan.jpg',
    isPopular: true,
    description: 'Condicionador nutritivo com óleo de argan',
    features: ['Óleo de argan', 'Nutrição profunda', 'Brilho', 'Maciez'],
    category: 'shampoos-condicionadores',
    availability: 'in_stock'
  },
  {
    id: 'sham-008',
    name: 'Kit Detox Purificante',
    brand: 'Schwarzkopf',
    price: 78.90,
    rating: 4.5,
    reviewCount: 167,
    image: '/images/products/kit-detox.jpg',
    description: 'Kit detox para limpeza profunda',
    features: ['Detox capilar', 'Limpeza profunda', 'Remove resíduos', 'Purifica'],
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
    image: '/images/products/base-eudora.jpg',
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
    image: '/images/products/paleta-natura.jpg',
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
    image: '/images/products/batom-ruby-rose.jpg',
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
    image: '/images/products/blush-avon.jpg',
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
    image: '/images/products/mascara-qdb.jpg',
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
    image: '/images/products/corretivo-payot.jpg',
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
    image: '/images/products/po-vult.jpg',
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
    image: '/images/products/delineador-mahav.jpg',
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
    image: '/images/products/iluminador-tracta.jpg',
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
    image: '/images/products/kit-contorno-oceane.jpg',
    description: 'Kit completo para contorno facial',
    features: ['Kit completo', 'Fácil aplicação', 'Natural', 'Para todos os tons'],
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
    image: '/images/products/chapinha-babyliss.jpg',
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
    image: '/images/products/secador-taiff.jpg',
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
    image: '/images/products/modelador-conair.jpg',
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
    image: '/images/products/escova-alisadora.jpg',
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
    image: '/images/products/kit-pinceis.jpg',
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
    image: '/images/products/prancha-vapor.jpg',
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
    image: '/images/products/ondulador-automatico.jpg',
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
    image: '/images/products/touca-termica.jpg',
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
    productCount: 15,
    products: progressivasBtxProducts
  },
  {
    id: 'tratamentos-capilares',
    name: 'Tratamentos Capilares',
    slug: 'tratamentos-capilares',
    description: 'Máscaras, ampolas e tratamentos intensivos para todos os tipos de cabelo',
    image: '/images/categories/tratamentos.jpg',
    productCount: 10,
    products: tratamentosCapilaresProducts
  },
  {
    id: 'shampoos-condicionadores',
    name: 'Shampoos e Condicionadores',
    slug: 'shampoos-condicionadores',
    description: 'Produtos de limpeza e condicionamento profissionais',
    image: '/images/categories/shampoos.jpg',
    productCount: 8,
    products: shampoosCondicionadoresProducts
  },
  {
    id: 'maquiagem-brasileira',
    name: 'Maquiagem Brasileira',
    slug: 'maquiagem-brasileira',
    description: 'As melhores marcas brasileiras de maquiagem',
    image: '/images/categories/maquiagem.jpg',
    productCount: 10,
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
  'Philco', 'Macrilan', 'Remington', 'Mega Hair'
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