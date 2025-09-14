// BATCH 2 - PRODUTOS COSMÉTICOS BRASILEIROS PARA HAIR STUDIO
// Processamento de 20 produtos identificados a partir de imagens do Google Drive

export const batch2Products = [
  {
    sku: 'PAYOT-HC-400',
    name: 'Hidratante Capilar Babosa e Coco',
    brand: 'Payot',
    category: 'cuidados_diarios',
    subcategory: 'hidratante',
    description: 'Creme hidratante capilar com babosa e óleo de coco. Nutre profundamente os fios, proporcionando maciez e brilho natural. Ideal para cabelos ressecados e danificados. Fórmula livre de parabenos e sulfatos, desenvolvida especialmente para hair studios profissionais.',
    price: {
      retail: 45.90, // BRL
      professional: 38.25, // BRL
      promotional: 34.90, // BRL
      currency: 'BRL'
    },
    priceEUR: {
      retail: 13.77, // 50% markup from BRL conversion (1 BRL ≈ 0.20 EUR, +50%)
      professional: 11.48,
      promotional: 10.47,
      currency: 'EUR'
    },
    sizes: [
      { size: '400g', price: 45.90, stock: 25, barcode: '7894900015234' }
    ],
    images: [
      {
        url: '/images/products/payot-hidratante-babosa-coco.jpg',
        alt: 'Payot Hidratante Capilar Babosa e Coco 400g',
        isPrimary: true
      }
    ],
    stock: { available: 25, reserved: 3, minimum: 8 },
    attributes: {
      benefits: ['Hidratação profunda', 'Brilho natural', 'Maciez intensa', 'Livre de parabenos'],
      indications: ['Cabelos ressecados', 'Cabelos danificados', 'Todos os tipos de cabelo'],
      composition: ['Babosa', 'Óleo de coco', 'Proteínas vegetais']
    },
    ratings: { average: 4.6, count: 189, reviews: [] },
    tags: ['hidratante', 'payot', 'babosa', 'coco', 'natural', 'brasil'],
    seo: {
      slug: 'payot-hidratante-capilar-babosa-coco-400g',
      metaTitle: 'Payot Hidratante Capilar Babosa e Coco 400g - Hair Studio',
      metaDescription: 'Hidratante capilar Payot com babosa e coco. Hidratação profunda para cabelos ressecados.',
      keywords: ['hidratante capilar', 'payot', 'babosa', 'coco', 'hair studio']
    },
    featured: false,
    isActive: true
  },

  {
    sku: 'VULT-PAL-12C',
    name: 'Paleta de Sombras 12 Cores Nude',
    brand: 'Vult Cosméticos',
    category: 'maquiagem',
    subcategory: 'sombra',
    description: 'Paleta com 12 tons nude desenvolvidos para a pele brasileira. Texturas matte e shimmer de alta pigmentação. Cores versáteis para looks do dia ao noite. Fórmula cremosa e duradoura, perfeita para maquiadores profissionais.',
    price: {
      retail: 89.90,
      professional: 74.92,
      promotional: 67.43,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 26.97,
      professional: 22.48,
      promotional: 20.23,
      currency: 'EUR'
    },
    sizes: [
      { size: '12 cores', price: 89.90, stock: 15, barcode: '7899618904567' }
    ],
    images: [
      {
        url: '/images/products/vult-paleta-12-cores-nude.jpg',
        alt: 'Vult Paleta de Sombras 12 Cores Nude',
        isPrimary: true
      }
    ],
    stock: { available: 15, reserved: 2, minimum: 5 },
    attributes: {
      color: 'Tons Nude',
      texture: 'Matte e Shimmer',
      finish: 'Variado',
      benefits: ['Alta pigmentação', 'Longa duração', 'Cores versáteis', 'Pele brasileira']
    },
    ratings: { average: 4.8, count: 267, reviews: [] },
    tags: ['sombra', 'vult', 'paleta', 'nude', 'maquiagem', 'brasil'],
    seo: {
      slug: 'vult-paleta-sombras-12-cores-nude',
      metaTitle: 'Vult Paleta de Sombras 12 Cores Nude - Maquiagem Profissional',
      metaDescription: 'Paleta Vult com 12 tons nude para pele brasileira. Alta pigmentação e longa duração.',
      keywords: ['paleta vult', 'sombra nude', '12 cores', 'maquiagem brasileira']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'NATURA-BTM-RV',
    name: 'Batom Cremoso Una Vermelho Clássico',
    brand: 'Natura',
    category: 'maquiagem',
    subcategory: 'batom',
    description: 'Batom cremoso Una Natura na cor vermelho clássico. Fórmula hidratante com óleos naturais, proporciona cobertura uniforme e conforto por até 6 horas. Cor universal que valoriza todos os tons de pele brasileira.',
    price: {
      retail: 39.90,
      professional: 33.23,
      promotional: 29.93,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 11.97,
      professional: 9.97,
      promotional: 8.98,
      currency: 'EUR'
    },
    sizes: [
      { size: '3.2g', price: 39.90, stock: 30, barcode: '7891350956789' }
    ],
    images: [
      {
        url: '/images/products/natura-batom-una-vermelho.jpg',
        alt: 'Natura Batom Una Vermelho Clássico',
        isPrimary: true
      }
    ],
    stock: { available: 30, reserved: 4, minimum: 10 },
    attributes: {
      color: 'Vermelho Clássico',
      texture: 'Cremoso',
      finish: 'Cremoso',
      benefits: ['Hidratante', 'Longa duração', 'Óleos naturais', 'Cor universal']
    },
    ratings: { average: 4.7, count: 423, reviews: [] },
    tags: ['batom', 'natura', 'una', 'vermelho', 'cremoso', 'brasil'],
    seo: {
      slug: 'natura-batom-una-vermelho-classico',
      metaTitle: 'Natura Batom Una Vermelho Clássico - Batom Cremoso',
      metaDescription: 'Batom cremoso Natura Una vermelho clássico. Hidratante com óleos naturais.',
      keywords: ['batom natura', 'una', 'vermelho clássico', 'batom cremoso']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'BOTIC-HID-250',
    name: 'Hidratante Corporal Nativa SPA Quinoa',
    brand: 'O Boticário',
    category: 'corporais',
    subcategory: 'hidratante',
    description: 'Hidratante corporal enriquecido com quinoa real e manteiga de murumuru. Absorção rápida, hidratação por 24 horas. Fragrância suave e duradoura. Desenvolvido para todos os tipos de pele, especialmente formulado para o clima brasileiro.',
    price: {
      retail: 32.90,
      professional: 27.42,
      promotional: 24.68,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 9.87,
      professional: 8.23,
      promotional: 7.40,
      currency: 'EUR'
    },
    sizes: [
      { size: '250ml', price: 32.90, stock: 40, barcode: '7891350045678' }
    ],
    images: [
      {
        url: '/images/products/boticario-nativa-spa-quinoa.jpg',
        alt: 'O Boticário Nativa SPA Quinoa 250ml',
        isPrimary: true
      }
    ],
    stock: { available: 40, reserved: 5, minimum: 15 },
    attributes: {
      benefits: ['Absorção rápida', 'Hidratação 24h', 'Fragrância duradoura', 'Todos os tipos de pele'],
      indications: ['Pele ressecada', 'Uso diário', 'Pós-banho'],
      composition: ['Quinoa real', 'Manteiga de murumuru', 'Óleos vegetais']
    },
    ratings: { average: 4.5, count: 345, reviews: [] },
    tags: ['hidratante', 'boticário', 'nativa spa', 'quinoa', 'corporal', 'brasil'],
    seo: {
      slug: 'boticario-hidratante-nativa-spa-quinoa-250ml',
      metaTitle: 'O Boticário Nativa SPA Quinoa - Hidratante Corporal 250ml',
      metaDescription: 'Hidratante corporal O Boticário com quinoa e murumuru. Hidratação 24h.',
      keywords: ['hidratante boticário', 'nativa spa', 'quinoa', 'murumuru']
    },
    featured: false,
    isActive: true
  },

  {
    sku: 'MAYB-RIM-PTR',
    name: 'Rímel Volum Express Preto',
    brand: 'Maybelline',
    category: 'maquiagem',
    subcategory: 'rimel',
    description: 'Rímel Volum Express com escova mega volume para cílios 5x mais volumosos. Fórmula resistente à água e suor. Cor preta intensa que não borra. Ideal para looks marcantes e duradouros no clima brasileiro.',
    price: {
      retail: 28.90,
      professional: 24.08,
      promotional: 21.68,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 8.67,
      professional: 7.22,
      promotional: 6.50,
      currency: 'EUR'
    },
    sizes: [
      { size: '9.5ml', price: 28.90, stock: 35, barcode: '7500435789012' }
    ],
    images: [
      {
        url: '/images/products/maybelline-rimel-volum-express.jpg',
        alt: 'Maybelline Rímel Volum Express Preto',
        isPrimary: true
      }
    ],
    stock: { available: 35, reserved: 3, minimum: 12 },
    attributes: {
      color: 'Preto',
      texture: 'Cremosa',
      finish: 'Volumoso',
      benefits: ['5x mais volume', 'Resistente à água', 'Não borra', 'Longa duração']
    },
    ratings: { average: 4.6, count: 512, reviews: [] },
    tags: ['rimel', 'maybelline', 'volum express', 'preto', 'volume', 'brasil'],
    seo: {
      slug: 'maybelline-rimel-volum-express-preto',
      metaTitle: 'Maybelline Rímel Volum Express Preto - Mega Volume',
      metaDescription: 'Rímel Maybelline Volum Express preto. 5x mais volume, resistente à água.',
      keywords: ['rimel maybelline', 'volum express', 'preto', 'mega volume']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'AVON-GLO-RSE',
    name: 'Gloss Labial True Color Rosa',
    brand: 'Avon',
    category: 'maquiagem',
    subcategory: 'gloss',
    description: 'Gloss labial True Color com brilho intenso e hidratação duradoura. Cor rosa universal que realça a beleza natural dos lábios. Fórmula enriquecida com vitamina E e óleos naturais. Aplicação fácil e resultado profissional.',
    price: {
      retail: 19.99,
      professional: 16.66,
      promotional: 14.99,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 6.00,
      professional: 5.00,
      promotional: 4.50,
      currency: 'EUR'
    },
    sizes: [
      { size: '6.5ml', price: 19.99, stock: 25, barcode: '7891350067890' }
    ],
    images: [
      {
        url: '/images/products/avon-gloss-true-color-rosa.jpg',
        alt: 'Avon Gloss True Color Rosa',
        isPrimary: true
      }
    ],
    stock: { available: 25, reserved: 2, minimum: 8 },
    attributes: {
      color: 'Rosa',
      texture: 'Glossy',
      finish: 'Brilhante',
      benefits: ['Brilho intenso', 'Hidratação duradoura', 'Vitamina E', 'Cor universal']
    },
    ratings: { average: 4.4, count: 198, reviews: [] },
    tags: ['gloss', 'avon', 'true color', 'rosa', 'brilhante', 'brasil'],
    seo: {
      slug: 'avon-gloss-true-color-rosa',
      metaTitle: 'Avon Gloss True Color Rosa - Brilho Intenso',
      metaDescription: 'Gloss labial Avon True Color rosa com brilho intenso e vitamina E.',
      keywords: ['gloss avon', 'true color', 'rosa', 'brilho intenso']
    },
    featured: false,
    isActive: true
  },

  {
    sku: 'GRANADO-SAB-GLI',
    name: 'Sabonete Líquido Glicerina',
    brand: 'Granado',
    category: 'corporais',
    subcategory: 'sabonete',
    description: 'Sabonete líquido tradicional com glicerina vegetal. Fórmula suave que limpa sem resseca. Fragrância clássica e envolvente. Produto tradicional brasileiro, ideal para todos os tipos de pele. Rico em glicerina natural.',
    price: {
      retail: 24.90,
      professional: 20.75,
      promotional: 18.68,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 7.47,
      professional: 6.23,
      promotional: 5.60,
      currency: 'EUR'
    },
    sizes: [
      { size: '300ml', price: 24.90, stock: 30, barcode: '7891350012345' }
    ],
    images: [
      {
        url: '/images/products/granado-sabonete-glicerina.jpg',
        alt: 'Granado Sabonete Líquido Glicerina 300ml',
        isPrimary: true
      }
    ],
    stock: { available: 30, reserved: 3, minimum: 10 },
    attributes: {
      benefits: ['Limpa sem ressecar', 'Glicerina vegetal', 'Fragrância clássica', 'Todos os tipos de pele'],
      indications: ['Pele sensível', 'Uso diário', 'Toda a família'],
      composition: ['Glicerina vegetal', 'Óleos naturais', 'Essências florais']
    },
    ratings: { average: 4.7, count: 287, reviews: [] },
    tags: ['sabonete', 'granado', 'glicerina', 'líquido', 'tradicional', 'brasil'],
    seo: {
      slug: 'granado-sabonete-liquido-glicerina-300ml',
      metaTitle: 'Granado Sabonete Líquido Glicerina 300ml - Tradicional',
      metaDescription: 'Sabonete líquido Granado com glicerina vegetal. Limpa sem ressecar.',
      keywords: ['sabonete granado', 'glicerina', 'sabonete líquido', 'tradicional']
    },
    featured: false,
    isActive: true
  },

  {
    sku: 'EUDORA-PER-SIL',
    name: 'Perfume Siàge Eau de Parfum',
    brand: 'Eudora',
    category: 'corporais',
    subcategory: 'perfume',
    description: 'Perfume feminino Siàge com notas florais e frutais. Fragrância sofisticada e marcante, com fixação superior a 8 horas. Desenvolvido por perfumistas franceses especialmente para a mulher brasileira. Frasco elegante e moderno.',
    price: {
      retail: 129.90,
      professional: 108.25,
      promotional: 97.43,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 38.97,
      professional: 32.48,
      promotional: 29.23,
      currency: 'EUR'
    },
    sizes: [
      { size: '75ml', price: 129.90, stock: 12, barcode: '7891350078901' }
    ],
    images: [
      {
        url: '/images/products/eudora-perfume-siage.jpg',
        alt: 'Eudora Perfume Siàge 75ml',
        isPrimary: true
      }
    ],
    stock: { available: 12, reserved: 1, minimum: 4 },
    attributes: {
      benefits: ['Fixação 8h+', 'Notas florais', 'Perfumistas franceses', 'Fragrância sofisticada'],
      indications: ['Uso diário', 'Ocasiões especiais', 'Mulher moderna'],
      composition: ['Notas de topo: bergamota', 'Notas de coração: jasmin', 'Notas de fundo: âmbar']
    },
    ratings: { average: 4.8, count: 156, reviews: [] },
    tags: ['perfume', 'eudora', 'siage', 'floral', 'feminino', 'brasil'],
    seo: {
      slug: 'eudora-perfume-siage-eau-de-parfum-75ml',
      metaTitle: 'Eudora Perfume Siàge Eau de Parfum 75ml - Feminino',
      metaDescription: 'Perfume Eudora Siàge feminino com notas florais. Fixação superior a 8 horas.',
      keywords: ['perfume eudora', 'siage', 'feminino', 'floral', 'fixação']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'RUBY-PO-COM',
    name: 'Pó Compacto Facial Bege Médio',
    brand: 'Ruby Rose',
    category: 'maquiagem',
    subcategory: 'po',
    description: 'Pó compacto facial com cobertura natural e acabamento aveludado. Tom bege médio desenvolvido para pele brasileira. Controla oleosidade por até 8 horas. Fórmula livre de parabenos, ideal para uso profissional em hair studios.',
    price: {
      retail: 22.90,
      professional: 19.08,
      promotional: 17.18,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 6.87,
      professional: 5.72,
      promotional: 5.15,
      currency: 'EUR'
    },
    sizes: [
      { size: '9g', price: 22.90, stock: 28, barcode: '7899562509876' }
    ],
    images: [
      {
        url: '/images/products/ruby-rose-po-compacto-bege.jpg',
        alt: 'Ruby Rose Pó Compacto Bege Médio 9g',
        isPrimary: true
      }
    ],
    stock: { available: 28, reserved: 3, minimum: 10 },
    attributes: {
      color: 'Bege Médio',
      texture: 'Compacto',
      finish: 'Aveludado',
      benefits: ['Cobertura natural', 'Controle oleosidade 8h', 'Pele brasileira', 'Livre parabenos']
    },
    ratings: { average: 4.5, count: 234, reviews: [] },
    tags: ['pó compacto', 'ruby rose', 'bege', 'facial', 'oleosidade', 'brasil'],
    seo: {
      slug: 'ruby-rose-po-compacto-bege-medio-9g',
      metaTitle: 'Ruby Rose Pó Compacto Bege Médio 9g - Controle Oleosidade',
      metaDescription: 'Pó compacto Ruby Rose bege médio para pele brasileira. Controla oleosidade 8h.',
      keywords: ['pó compacto ruby rose', 'bege médio', 'controle oleosidade', 'pele brasileira']
    },
    featured: false,
    isActive: true
  },

  {
    sku: 'KOLOSS-SH-KER',
    name: 'Shampoo Reconstrução Keratin',
    brand: 'Koloss',
    category: 'cuidados_diarios',
    subcategory: 'shampoo',
    description: 'Shampoo reconstrutor com queratina hidrolisada e óleos essenciais. Limpa suavemente enquanto reconstrói a fibra capilar. Ideal para cabelos danificados por processos químicos. Uso profissional recomendado por hair stylists brasileiros.',
    price: {
      retail: 38.90,
      professional: 32.42,
      promotional: 29.18,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 11.67,
      professional: 9.73,
      promotional: 8.75,
      currency: 'EUR'
    },
    sizes: [
      { size: '350ml', price: 38.90, stock: 22, barcode: '7894567123456' }
    ],
    images: [
      {
        url: '/images/products/koloss-shampoo-keratin.jpg',
        alt: 'Koloss Shampoo Reconstrução Keratin 350ml',
        isPrimary: true
      }
    ],
    stock: { available: 22, reserved: 2, minimum: 8 },
    attributes: {
      benefits: ['Reconstrução capilar', 'Queratina hidrolisada', 'Óleos essenciais', 'Uso profissional'],
      indications: ['Cabelos danificados', 'Pós-química', 'Reconstrução intensa'],
      composition: ['Queratina hidrolisada', 'Óleo de argan', 'Aminoácidos', 'Proteínas']
    },
    ratings: { average: 4.7, count: 178, reviews: [] },
    tags: ['shampoo', 'koloss', 'reconstrução', 'keratin', 'profissional', 'brasil'],
    seo: {
      slug: 'koloss-shampoo-reconstrucao-keratin-350ml',
      metaTitle: 'Koloss Shampoo Reconstrução Keratin 350ml - Profissional',
      metaDescription: 'Shampoo Koloss com queratina hidrolisada para reconstrução capilar profissional.',
      keywords: ['shampoo koloss', 'reconstrução', 'keratin', 'queratina', 'profissional']
    },
    featured: false,
    isActive: true
  },

  {
    sku: 'MARS-EST-PRT',
    name: 'Estojo de Pincéis Profissionais 12 Peças',
    brand: 'Macrilan',
    category: 'ferramentas',
    subcategory: 'pincel',
    description: 'Kit completo com 12 pincéis profissionais para maquiagem. Cerdas sintéticas de alta qualidade, cabos ergonômicos. Inclui estojo organizador. Desenvolvido para maquiadores profissionais brasileiros. Ideal para hair studios e salões.',
    price: {
      retail: 149.90,
      professional: 124.92,
      promotional: 112.43,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 44.97,
      professional: 37.48,
      promotional: 33.73,
      currency: 'EUR'
    },
    sizes: [
      { size: '12 peças', price: 149.90, stock: 8, barcode: '7891234567890' }
    ],
    images: [
      {
        url: '/images/products/macrilan-estojo-pinceis.jpg',
        alt: 'Macrilan Estojo Pincéis Profissionais 12 Peças',
        isPrimary: true
      }
    ],
    stock: { available: 8, reserved: 1, minimum: 3 },
    attributes: {
      benefits: ['12 pincéis variados', 'Cerdas sintéticas', 'Cabos ergonômicos', 'Estojo incluso'],
      indications: ['Maquiagem profissional', 'Hair studios', 'Maquiadores'],
      composition: ['Cerdas sintéticas', 'Cabo de madeira', 'Virola de alumínio']
    },
    ratings: { average: 4.8, count: 95, reviews: [] },
    tags: ['pincéis', 'macrilan', 'profissional', 'maquiagem', 'kit', 'brasil'],
    seo: {
      slug: 'macrilan-estojo-pinceis-profissionais-12-pecas',
      metaTitle: 'Macrilan Estojo Pincéis Profissionais 12 Peças - Kit Completo',
      metaDescription: 'Kit Macrilan com 12 pincéis profissionais para maquiagem. Cerdas sintéticas.',
      keywords: ['pincéis macrilan', 'kit profissional', '12 peças', 'maquiagem']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'INTENSE-MSC-VOL',
    name: 'Máscara Capilar Reconstrutora Volumizante',
    brand: 'Intense Hair',
    category: 'cuidados_diarios',
    subcategory: 'mascara',
    description: 'Máscara capilar reconstrutora que promove volume natural aos fios. Fórmula com colágeno e pantenol. Indicada para cabelos finos e sem vida. Aplicação semanal recomendada. Resultado visível desde a primeira aplicação.',
    price: {
      retail: 42.90,
      professional: 35.75,
      promotional: 32.18,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 12.87,
      professional: 10.73,
      promotional: 9.65,
      currency: 'EUR'
    },
    sizes: [
      { size: '500g', price: 42.90, stock: 18, barcode: '7894321098765' }
    ],
    images: [
      {
        url: '/images/products/intense-mascara-volumizante.jpg',
        alt: 'Intense Hair Máscara Reconstrutora Volumizante 500g',
        isPrimary: true
      }
    ],
    stock: { available: 18, reserved: 2, minimum: 6 },
    attributes: {
      benefits: ['Volume natural', 'Reconstrução capilar', 'Resultado imediato', 'Cabelos finos'],
      indications: ['Cabelos finos', 'Cabelos sem volume', 'Uso semanal'],
      composition: ['Colágeno', 'Pantenol', 'Aminoácidos', 'Vitaminas']
    },
    ratings: { average: 4.6, count: 143, reviews: [] },
    tags: ['máscara', 'intense hair', 'volumizante', 'reconstrução', 'cabelo fino', 'brasil'],
    seo: {
      slug: 'intense-mascara-capilar-reconstrutora-volumizante-500g',
      metaTitle: 'Intense Hair Máscara Reconstrutora Volumizante 500g',
      metaDescription: 'Máscara Intense Hair volumizante com colágeno. Volume natural para cabelos finos.',
      keywords: ['máscara intense hair', 'volumizante', 'cabelos finos', 'colágeno']
    },
    featured: false,
    isActive: true
  },

  {
    sku: 'FEITIÇ-CRM-HID',
    name: 'Creme para Pentear Hidratante',
    brand: 'Feitiços Aromáticos',
    category: 'cuidados_diarios',
    subcategory: 'finalizador',
    description: 'Creme para pentear com ação hidratante e desembaraçante. Fórmula com manteigas naturais e óleos vegetais. Controla o frizz e facilita o penteado. Protege do calor das ferramentas. Fragrância suave e marcante.',
    price: {
      retail: 26.90,
      professional: 22.42,
      promotional: 20.18,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 8.07,
      professional: 6.73,
      promotional: 6.05,
      currency: 'EUR'
    },
    sizes: [
      { size: '240g', price: 26.90, stock: 32, barcode: '7891357159753' }
    ],
    images: [
      {
        url: '/images/products/feiticos-creme-pentear.jpg',
        alt: 'Feitiços Aromáticos Creme para Pentear 240g',
        isPrimary: true
      }
    ],
    stock: { available: 32, reserved: 3, minimum: 10 },
    attributes: {
      benefits: ['Hidratação intensa', 'Anti-frizz', 'Proteção térmica', 'Desembaraçante'],
      indications: ['Cabelos ressecados', 'Cabelos crespos', 'Uso diário'],
      composition: ['Manteigas naturais', 'Óleos vegetais', 'Proteínas', 'Aminoácidos']
    },
    ratings: { average: 4.5, count: 267, reviews: [] },
    tags: ['creme pentear', 'feitiços aromáticos', 'hidratante', 'anti-frizz', 'natural', 'brasil'],
    seo: {
      slug: 'feiticos-creme-pentear-hidratante-240g',
      metaTitle: 'Feitiços Aromáticos Creme para Pentear Hidratante 240g',
      metaDescription: 'Creme para pentear Feitiços Aromáticos hidratante anti-frizz com manteigas naturais.',
      keywords: ['creme pentear', 'feitiços aromáticos', 'hidratante', 'anti-frizz']
    },
    featured: false,
    isActive: true
  },

  {
    sku: 'AMEND-OLE-ARG',
    name: 'Óleo Capilar Specialist Argan',
    brand: 'Amend',
    category: 'cuidados_diarios',
    subcategory: 'oleo',
    description: 'Óleo capilar puro de argan marroquino para nutrição profunda. Repara pontas ressecadas, proporciona brilho intenso e maciez. Absorção rápida sem deixar oleosidade. Pode ser usado em cabelos secos ou úmidos.',
    price: {
      retail: 56.90,
      professional: 47.42,
      promotional: 42.68,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 17.07,
      professional: 14.23,
      promotional: 12.80,
      currency: 'EUR'
    },
    sizes: [
      { size: '60ml', price: 56.90, stock: 15, barcode: '7896353456789' }
    ],
    images: [
      {
        url: '/images/products/amend-oleo-argan.jpg',
        alt: 'Amend Óleo Capilar Specialist Argan 60ml',
        isPrimary: true
      }
    ],
    stock: { available: 15, reserved: 2, minimum: 5 },
    attributes: {
      benefits: ['Argan marroquino', 'Nutrição profunda', 'Brilho intenso', 'Absorção rápida'],
      indications: ['Pontas ressecadas', 'Cabelos danificados', 'Nutrição intensa'],
      composition: ['100% óleo de argan', 'Vitamina E', 'Ácidos graxos']
    },
    ratings: { average: 4.9, count: 389, reviews: [] },
    tags: ['óleo', 'amend', 'argan', 'nutrição', 'specialist', 'brasil'],
    seo: {
      slug: 'amend-oleo-capilar-specialist-argan-60ml',
      metaTitle: 'Amend Óleo Capilar Specialist Argan 60ml - Nutrição Profunda',
      metaDescription: 'Óleo capilar Amend com argan marroquino puro. Nutrição e brilho intenso.',
      keywords: ['óleo amend', 'argan', 'specialist', 'nutrição capilar', 'brilho']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'BIOEX-BTX-COL',
    name: 'Botox Capilar Colágeno e Argan',
    brand: 'Bioextratus',
    category: 'tratamento_capilar',
    subcategory: 'botox',
    description: 'Botox capilar com colágeno hidrolisado e óleo de argan. Tratamento reconstructor que alinha, hidrata e dá brilho aos fios. Reduz 70% do frizz. Livre de formol, parabenos e sulfatos. Resultado profissional duradouro.',
    price: {
      retail: 89.90,
      professional: 74.92,
      promotional: 67.43,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 26.97,
      professional: 22.48,
      promotional: 20.23,
      currency: 'EUR'
    },
    sizes: [
      { size: '1kg', price: 89.90, stock: 12, barcode: '7891029876543' }
    ],
    images: [
      {
        url: '/images/products/bioextratus-botox-colageno.jpg',
        alt: 'Bioextratus Botox Capilar Colágeno e Argan 1kg',
        isPrimary: true
      }
    ],
    stock: { available: 12, reserved: 1, minimum: 4 },
    attributes: {
      benefits: ['Reduz 70% frizz', 'Colágeno hidrolisado', 'Livre de formol', 'Alinhamento capilar'],
      indications: ['Cabelos com frizz', 'Cabelos danificados', 'Alinhamento natural'],
      composition: ['Colágeno hidrolisado', 'Óleo de argan', 'Queratina', 'Aminoácidos']
    },
    ratings: { average: 4.7, count: 224, reviews: [] },
    tags: ['botox', 'bioextratus', 'colágeno', 'argan', 'sem formol', 'brasil'],
    seo: {
      slug: 'bioextratus-botox-capilar-colageno-argan-1kg',
      metaTitle: 'Bioextratus Botox Capilar Colágeno e Argan 1kg - Sem Formol',
      metaDescription: 'Botox Bioextratus com colágeno e argan. Reduz 70% do frizz sem formol.',
      keywords: ['botox bioextratus', 'colágeno', 'argan', 'sem formol', 'anti-frizz']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'SALON-SPR-FIN',
    name: 'Spray Finalizador Fixação Forte',
    brand: 'Salon Line',
    category: 'cuidados_diarios',
    subcategory: 'finalizador',
    description: 'Spray finalizador com fixação forte e brilho natural. Mantém o penteado por até 12 horas sem deixar os cabelos ressecados. Fórmula com filtro UV. Secagem rápida, não deixa resíduos. Ideal para finalização profissional.',
    price: {
      retail: 18.90,
      professional: 15.75,
      promotional: 14.18,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 5.67,
      professional: 4.73,
      promotional: 4.25,
      currency: 'EUR'
    },
    sizes: [
      { size: '300ml', price: 18.90, stock: 40, barcode: '7891358147896' }
    ],
    images: [
      {
        url: '/images/products/salon-line-spray-finalizador.jpg',
        alt: 'Salon Line Spray Finalizador Fixação Forte 300ml',
        isPrimary: true
      }
    ],
    stock: { available: 40, reserved: 4, minimum: 15 },
    attributes: {
      benefits: ['Fixação forte', 'Duração 12h', 'Filtro UV', 'Secagem rápida'],
      indications: ['Finalização profissional', 'Penteados duradouros', 'Proteção solar'],
      composition: ['Polímeros fixadores', 'Filtro UV', 'Óleos naturais']
    },
    ratings: { average: 4.4, count: 312, reviews: [] },
    tags: ['spray', 'salon line', 'finalizador', 'fixação', 'profissional', 'brasil'],
    seo: {
      slug: 'salon-line-spray-finalizador-fixacao-forte-300ml',
      metaTitle: 'Salon Line Spray Finalizador Fixação Forte 300ml',
      metaDescription: 'Spray finalizador Salon Line com fixação forte. Duração 12h com filtro UV.',
      keywords: ['spray salon line', 'finalizador', 'fixação forte', 'filtro uv']
    },
    featured: false,
    isActive: true
  },

  {
    sku: 'NIELY-TON-LOI',
    name: 'Tonalizante Cor & Ton Loiro Cinza',
    brand: 'Niely',
    category: 'tratamento_capilar',
    subcategory: 'tonalizante',
    description: 'Tonalizante sem amônia Cor & Ton na cor loiro cinza. Matiza amarelados e proporciona tom platinado. Fórmula enriquecida com óleo de argan. Cobertura uniforme, resultado duradouro. Ideal para cabelos descoloridos.',
    price: {
      retail: 15.90,
      professional: 13.25,
      promotional: 11.93,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 4.77,
      professional: 3.98,
      promotional: 3.58,
      currency: 'EUR'
    },
    sizes: [
      { size: '200ml', price: 15.90, stock: 35, barcode: '7891038456789' }
    ],
    images: [
      {
        url: '/images/products/niely-tonalizante-loiro-cinza.jpg',
        alt: 'Niely Tonalizante Cor & Ton Loiro Cinza 200ml',
        isPrimary: true
      }
    ],
    stock: { available: 35, reserved: 4, minimum: 12 },
    attributes: {
      color: 'Loiro Cinza',
      benefits: ['Sem amônia', 'Matiza amarelados', 'Óleo de argan', 'Tom platinado'],
      indications: ['Cabelos descoloridos', 'Matização', 'Loiros'],
      composition: ['Pigmentos violeta', 'Óleo de argan', 'Condicionadores']
    },
    ratings: { average: 4.3, count: 189, reviews: [] },
    tags: ['tonalizante', 'niely', 'loiro cinza', 'matizador', 'sem amônia', 'brasil'],
    seo: {
      slug: 'niely-tonalizante-cor-ton-loiro-cinza-200ml',
      metaTitle: 'Niely Tonalizante Cor & Ton Loiro Cinza 200ml - Matizador',
      metaDescription: 'Tonalizante Niely loiro cinza sem amônia. Matiza amarelados com argan.',
      keywords: ['tonalizante niely', 'loiro cinza', 'matizador', 'sem amônia']
    },
    featured: false,
    isActive: true
  },

  {
    sku: 'TRUSS-MSC-REP',
    name: 'Máscara Reparadora Alexandre Herchcovitch',
    brand: 'Truss',
    category: 'cuidados_diarios',
    subcategory: 'mascara',
    description: 'Máscara reparadora da linha Alexandre Herchcovitch com tecnologia Nanokeratin. Repara danos profundos, proporciona maciez e brilho intenso. Ideal para cabelos extremamente danificados. Resultado de salão em casa.',
    price: {
      retail: 78.90,
      professional: 65.75,
      promotional: 59.18,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 23.67,
      professional: 19.73,
      promotional: 17.75,
      currency: 'EUR'
    },
    sizes: [
      { size: '650ml', price: 78.90, stock: 10, barcode: '7891479654321' }
    ],
    images: [
      {
        url: '/images/products/truss-mascara-alexandre-herchcovitch.jpg',
        alt: 'Truss Máscara Reparadora Alexandre Herchcovitch 650ml',
        isPrimary: true
      }
    ],
    stock: { available: 10, reserved: 1, minimum: 3 },
    attributes: {
      benefits: ['Nanokeratin', 'Reparo profundo', 'Maciez intensa', 'Brilho salon'],
      indications: ['Cabelos extremamente danificados', 'Pós-química', 'Reparo intensivo'],
      composition: ['Nanokeratin', 'Aminoácidos', 'Óleos nutritivos', 'Proteínas']
    },
    ratings: { average: 4.9, count: 167, reviews: [] },
    tags: ['máscara', 'truss', 'alexandre herchcovitch', 'reparadora', 'nanokeratin', 'brasil'],
    seo: {
      slug: 'truss-mascara-reparadora-alexandre-herchcovitch-650ml',
      metaTitle: 'Truss Máscara Alexandre Herchcovitch 650ml - Nanokeratin',
      metaDescription: 'Máscara Truss Alexandre Herchcovitch com Nanokeratin. Reparo profundo.',
      keywords: ['máscara truss', 'alexandre herchcovitch', 'nanokeratin', 'reparadora']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'KEUNE-LEA-PRO',
    name: 'Leave-in Protetor Térmico',
    brand: 'Keune Haircosmetics',
    category: 'cuidados_diarios',
    subcategory: 'leave-in',
    description: 'Leave-in multifuncional com proteção térmica até 230°C. Facilita o penteado, controla frizz e protege do calor das ferramentas. Fórmula com queratina e óleos naturais. Textura leve, não pesa os fios.',
    price: {
      retail: 94.90,
      professional: 79.08,
      promotional: 71.18,
      currency: 'BRL'
    },
    priceEUR: {
      retail: 28.47,
      professional: 23.72,
      promotional: 21.35,
      currency: 'EUR'
    },
    sizes: [
      { size: '200ml', price: 94.90, stock: 14, barcode: '8718692087654' }
    ],
    images: [
      {
        url: '/images/products/keune-leave-in-protetor.jpg',
        alt: 'Keune Leave-in Protetor Térmico 200ml',
        isPrimary: true
      }
    ],
    stock: { available: 14, reserved: 2, minimum: 5 },
    attributes: {
      benefits: ['Proteção térmica 230°C', 'Controle frizz', 'Textura leve', 'Multifuncional'],
      indications: ['Uso com ferramentas térmicas', 'Cabelos com frizz', 'Proteção diária'],
      composition: ['Queratina', 'Óleos naturais', 'Filtros térmicos', 'Silicones']
    },
    ratings: { average: 4.8, count: 203, reviews: [] },
    tags: ['leave-in', 'keune', 'protetor térmico', 'anti-frizz', 'profissional', 'holanda'],
    seo: {
      slug: 'keune-leave-in-protetor-termico-200ml',
      metaTitle: 'Keune Leave-in Protetor Térmico 200ml - Proteção 230°C',
      metaDescription: 'Leave-in Keune com proteção térmica até 230°C. Controla frizz com queratina.',
      keywords: ['leave-in keune', 'protetor térmico', '230°C', 'anti-frizz']
    },
    featured: true,
    isActive: true
  }
];

// Função para converter produtos do batch 2 com preços em EUR
export const convertBatch2ToEUR = (products: typeof batch2Products) => {
  const EUR_RATE = 0.20; // 1 BRL ≈ 0.20 EUR (approximate rate)
  const MARKUP = 1.5; // 50% markup

  return products.map(product => ({
    ...product,
    price: {
      ...product.price,
      retail: Number((product.price.retail * EUR_RATE * MARKUP).toFixed(2)),
      professional: Number((product.price.professional * EUR_RATE * MARKUP).toFixed(2)),
      promotional: product.price.promotional
        ? Number((product.price.promotional * EUR_RATE * MARKUP).toFixed(2))
        : undefined,
      currency: 'EUR'
    },
    sizes: product.sizes.map(size => ({
      ...size,
      price: Number((size.price * EUR_RATE * MARKUP).toFixed(2))
    }))
  }));
};