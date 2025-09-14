import connectDB from '../mongodb';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

// DADOS REAIS DE PRODUTOS BRASILEIROS PARA HAIR STUDIO

export const treatmentProducts = [
  {
    sku: 'CAD-BC-1000',
    name: 'Brasil Cacau Smoothing Protein Treatment',
    brand: 'Cadiveu Professional',
    category: 'tratamento_capilar',
    subcategory: 'progressiva',
    description: 'Tratamento alisante com cana-de-açúcar Cysteine, cacau e D-panthenol. Sem formol, parabenos e ingredientes animais. Durabilidade de 3+ meses. Ideal para todos os tipos de cabelo, proporcionando alisamento máximo com hidratação profunda.',
    price: {
      retail: 268.52,
      professional: 222.27,
      promotional: 199.99,
      currency: 'BRL'
    },
    sizes: [
      { size: '1000ml', price: 268.52, stock: 15, barcode: '7898963522341' },
      { size: '500ml', price: 149.90, stock: 25, barcode: '7898963522358' }
    ],
    images: [
      { 
        url: '/images/products/cadiveu-brasil-cacau.jpg', 
        alt: 'Cadiveu Brasil Cacau 1000ml', 
        isPrimary: true 
      }
    ],
    stock: { available: 40, reserved: 5, minimum: 10 },
    attributes: {
      benefits: ['Alisamento máximo', 'Hidratação profunda', 'Reestruturação capilar', 'Durabilidade 3+ meses'],
      indications: ['Todos os tipos de cabelo', 'Compatível com coloração'],
      composition: ['Cysteine', 'Cacau', 'D-panthenol']
    },
    ratings: { average: 4.8, count: 324, reviews: [] },
    tags: ['progressiva', 'alisamento', 'cadiveu', 'profissional', 'sem formol', 'brasil'],
    seo: {
      slug: 'cadiveu-brasil-cacau-progressiva-1000ml',
      metaTitle: 'Cadiveu Brasil Cacau - Progressiva Sem Formol 1000ml',
      metaDescription: 'Progressiva Cadiveu Brasil Cacau com cacau e D-panthenol. Alisamento duradouro sem formol. Ideal para hair studio profissional.',
      keywords: ['progressiva cadiveu', 'brasil cacau', 'alisamento sem formol', 'progressiva profissional']
    },
    featured: true,
    isActive: true
  },
  {
    sku: 'INOAR-GH-1000',
    name: 'Kit Escova Progressiva Alemã G-Hair',
    brand: 'Inoar/G.Hair',
    category: 'tratamento_capilar',
    subcategory: 'progressiva',
    description: 'Fórmula alemã com queratina e óleo de cacau, 0,2% formol. Kit completo com 3 produtos para ação instantânea. Permite lavagem no mesmo dia da aplicação, ideal para cabelos rebeldes.',
    price: {
      retail: 415.87,
      professional: 350.00,
      promotional: 299.99,
      currency: 'BRL'
    },
    sizes: [
      { size: 'Kit 3x1000ml', price: 415.87, stock: 10, barcode: '7908124000134' }
    ],
    images: [
      { 
        url: '/images/products/inoar-g-hair-kit.jpg', 
        alt: 'Kit G-Hair Alemã 3x1000ml', 
        isPrimary: true 
      }
    ],
    stock: { available: 10, reserved: 2, minimum: 5 },
    attributes: {
      benefits: ['Ação instantânea', 'Permite lavagem no mesmo dia', '15-20 aplicações'],
      indications: ['Cabelos rebeldes', 'Cabelos com muito volume'],
      composition: ['Queratina', 'Óleo de cacau', 'Argila branca']
    },
    ratings: { average: 4.6, count: 189, reviews: [] },
    tags: ['progressiva', 'alemã', 'inoar', 'g-hair', 'kit profissional', 'queratina'],
    seo: {
      slug: 'inoar-g-hair-escova-progressiva-alema-kit',
      metaTitle: 'Inoar G-Hair - Kit Escova Progressiva Alemã 3x1000ml',
      metaDescription: 'Kit G-Hair com fórmula alemã e queratina. Progressiva de ação instantânea para hair studio.',
      keywords: ['progressiva alemã', 'g-hair', 'inoar progressiva', 'kit profissional']
    },
    featured: true,
    isActive: true
  },
  {
    sku: 'SWEET-TF-980',
    name: 'The First Liso Intenso Shampoo Alisante',
    brand: 'Sweet Hair Professional',
    category: 'tratamento_capilar',
    subcategory: 'progressiva',
    description: 'Primeiro shampoo alisante do mundo com blend de 5 ácidos. Livre de formol, alisa em uma única lavagem com durabilidade de até 3 meses. Inovação brasileira revolucionária.',
    price: {
      retail: 545.90,
      professional: 474.90,
      promotional: 449.90,
      currency: 'BRL'
    },
    sizes: [
      { size: '980ml', price: 474.90, stock: 8, barcode: '7898959463214' }
    ],
    images: [
      { 
        url: '/images/products/sweet-hair-the-first.jpg', 
        alt: 'Sweet Hair The First 980ml', 
        isPrimary: true 
      }
    ],
    stock: { available: 8, reserved: 1, minimum: 3 },
    attributes: {
      benefits: ['Livre de formol', 'Alisa em uma lavagem', 'Durabilidade 3 meses', 'Até 20 aplicações'],
      indications: ['Todos os tipos de cabelo'],
      composition: ['Ácido Salicílico', 'Ácido Alfa Lipóico', 'Ácido Glicólico', 'Ácido Lático', 'Ácido Hialurônico']
    },
    ratings: { average: 4.9, count: 567, reviews: [] },
    tags: ['progressiva', 'shampoo alisante', 'sweet hair', 'sem formol', 'inovação', 'brasil'],
    seo: {
      slug: 'sweet-hair-the-first-shampoo-alisante-980ml',
      metaTitle: 'Sweet Hair The First - Shampoo Alisante sem Formol 980ml',
      metaDescription: 'The First Sweet Hair - Primeiro shampoo alisante do mundo. Sem formol, alisa em uma lavagem.',
      keywords: ['shampoo alisante', 'the first', 'sweet hair', 'sem formol', 'alisamento inovador']
    },
    featured: true,
    isActive: true
  },
  {
    sku: 'FOREVER-BOT-1000',
    name: 'Botox Capilar Zero Formol',
    brand: 'Forever Liss Professional',
    category: 'tratamento_capilar',
    subcategory: 'botox',
    description: '100% livre de formol, com óleo de argan, coco e manteiga de karité. Redução de 90% do volume, alinhamento capilar e hidratação profunda. Durabilidade de 20-50 dias.',
    price: {
      retail: 127.99,
      professional: 95.00,
      promotional: 89.90,
      currency: 'BRL'
    },
    sizes: [
      { size: '1kg', price: 127.99, stock: 20, barcode: '7908030408458' },
      { size: '250g', price: 38.90, stock: 30, barcode: '7908030408465' }
    ],
    images: [
      { 
        url: '/images/products/forever-liss-botox-zero.jpg', 
        alt: 'Forever Liss Botox Zero Formol 1kg', 
        isPrimary: true 
      }
    ],
    stock: { available: 50, reserved: 5, minimum: 10 },
    attributes: {
      benefits: ['Alinhamento capilar', 'Redução 90% do volume', 'Hidratação profunda', 'Durabilidade 20-50 dias'],
      indications: ['Cabelos danificados', 'Cabelos com frizz'],
      composition: ['Óleo de argan', 'Óleo de coco', 'Manteiga de karité']
    },
    ratings: { average: 4.5, count: 234, reviews: [] },
    tags: ['botox', 'tratamento', 'forever liss', 'sem formol', 'hidratação', 'brasil'],
    seo: {
      slug: 'forever-liss-botox-capilar-zero-formol-1kg',
      metaTitle: 'Forever Liss Botox Capilar Zero Formol 1kg - Hidratação Profunda',
      metaDescription: 'Botox capilar Forever Liss sem formol. Reduz 90% do volume com hidratação profunda.',
      keywords: ['botox capilar', 'forever liss', 'sem formol', 'hidratação', 'alinhamento']
    },
    featured: false,
    isActive: true
  }
];

export const nailProducts = [
  {
    sku: 'RISQ-DG-HIB',
    name: 'Esmalte Diamond Gel - Hibisco Rosa',
    brand: 'Risqué',
    category: 'esmaltes',
    subcategory: 'cremoso',
    description: 'Esmalte efeito gel com pincel de 800 cerdas para aplicação perfeita. Durabilidade superior e brilho intenso duradouro. Cor tendência hibisco rosa.',
    price: {
      retail: 14.93,
      professional: 12.50,
      promotional: 13.96,
      currency: 'BRL'
    },
    sizes: [
      { size: '9.5ml', price: 14.93, stock: 50, barcode: '7891350038224' }
    ],
    images: [
      { 
        url: '/images/products/risque-hibisco-rosa.jpg', 
        alt: 'Risqué Diamond Gel Hibisco Rosa', 
        isPrimary: true 
      }
    ],
    stock: { available: 50, reserved: 5, minimum: 15 },
    attributes: {
      color: 'Hibisco Rosa',
      texture: 'Cremoso',
      finish: 'Brilhante',
      benefits: ['Efeito gel', 'Longa duração', 'Secagem rápida', 'Pincel 800 cerdas']
    },
    ratings: { average: 4.7, count: 89, reviews: [] },
    tags: ['esmalte', 'risqué', 'diamond gel', 'rosa', 'cremoso', 'brasil'],
    seo: {
      slug: 'risque-esmalte-diamond-gel-hibisco-rosa',
      metaTitle: 'Risqué Diamond Gel Hibisco Rosa - Esmalte Efeito Gel',
      metaDescription: 'Esmalte Risqué Diamond Gel na cor Hibisco Rosa. Efeito gel com brilho intenso e longa duração.',
      keywords: ['esmalte risqué', 'diamond gel', 'hibisco rosa', 'efeito gel', 'longa duração']
    },
    featured: true,
    isActive: true
  },
  {
    sku: 'RISQ-DG-CHAB',
    name: 'Esmalte Diamond Gel - Chá Branco',
    brand: 'Risqué',
    category: 'esmaltes',
    subcategory: 'cremoso',
    description: 'Esmalte nude claro cremoso com efeito gel duradouro. Tonalidade elegante e sofisticada, perfeita para qualquer ocasião.',
    price: {
      retail: 14.93,
      professional: 12.50,
      promotional: 13.96,
      currency: 'BRL'
    },
    sizes: [
      { size: '9.5ml', price: 14.93, stock: 45, barcode: '7891350038231' }
    ],
    images: [
      { 
        url: '/images/products/risque-cha-branco.jpg', 
        alt: 'Risqué Diamond Gel Chá Branco', 
        isPrimary: true 
      }
    ],
    stock: { available: 45, reserved: 3, minimum: 15 },
    attributes: {
      color: 'Chá Branco',
      texture: 'Cremoso',
      finish: 'Brilhante',
      benefits: ['Efeito gel', 'Nude elegante', 'Alta cobertura']
    },
    ratings: { average: 4.8, count: 120, reviews: [] },
    tags: ['esmalte', 'risqué', 'diamond gel', 'nude', 'cremoso', 'brasil'],
    seo: {
      slug: 'risque-esmalte-diamond-gel-cha-branco',
      metaTitle: 'Risqué Diamond Gel Chá Branco - Esmalte Nude Elegante',
      metaDescription: 'Esmalte Risqué Diamond Gel Chá Branco. Nude elegante com efeito gel e alta cobertura.',
      keywords: ['esmalte nude', 'risqué', 'chá branco', 'diamond gel', 'elegante']
    },
    featured: true,
    isActive: true
  },
  {
    sku: 'COLOR-VOBS',
    name: 'Esmalte Colorama - Vermelha Obsessão',
    brand: 'Colorama',
    category: 'esmaltes',
    subcategory: 'efeito_gel',
    description: 'Esmalte efeito gel que dura até 10 dias. Vermelho intenso clássico com brilho espelhado e secagem rápida.',
    price: {
      retail: 8.90,
      professional: 7.50,
      promotional: 8.08,
      currency: 'BRL'
    },
    sizes: [
      { size: '8ml', price: 8.90, stock: 60, barcode: '7896000714596' }
    ],
    images: [
      { 
        url: '/images/products/colorama-vermelha-obsessao.jpg', 
        alt: 'Colorama Vermelha Obsessão', 
        isPrimary: true 
      }
    ],
    stock: { available: 60, reserved: 5, minimum: 20 },
    attributes: {
      color: 'Vermelha Obsessão',
      texture: 'Cremoso',
      finish: 'Gel',
      benefits: ['Dura até 10 dias', 'Brilho espelhado', 'Secagem rápida']
    },
    ratings: { average: 4.4, count: 67, reviews: [] },
    tags: ['esmalte', 'colorama', 'efeito gel', 'vermelho', 'longa duração', 'brasil'],
    seo: {
      slug: 'colorama-esmalte-vermelha-obsessao-efeito-gel',
      metaTitle: 'Colorama Vermelha Obsessão - Esmalte Efeito Gel Vermelho',
      metaDescription: 'Esmalte Colorama Vermelha Obsessão com efeito gel. Dura até 10 dias com brilho espelhado.',
      keywords: ['esmalte colorama', 'vermelha obsessão', 'efeito gel', 'vermelho', '10 dias']
    },
    featured: false,
    isActive: true
  },
  {
    sku: 'DAILUS-BC-233',
    name: 'Esmalte Queridinhos - Bolo de Chocolate',
    brand: 'Dailus',
    category: 'esmaltes',
    subcategory: 'cremoso',
    description: 'Esmalte cremoso marrom chocolate da linha Queridinhos. Alta pigmentação com cobertura uniforme e pincel preciso.',
    price: {
      retail: 11.30,
      professional: 9.50,
      promotional: 10.84,
      currency: 'BRL'
    },
    sizes: [
      { size: '8ml', price: 10.84, stock: 40, barcode: '7894321654897' }
    ],
    images: [
      { 
        url: '/images/products/dailus-bolo-chocolate.jpg', 
        alt: 'Dailus Bolo de Chocolate', 
        isPrimary: true 
      }
    ],
    stock: { available: 40, reserved: 2, minimum: 10 },
    attributes: {
      color: 'Bolo de Chocolate',
      texture: 'Cremoso',
      finish: 'Cremoso',
      benefits: ['Alta pigmentação', 'Cobertura uniforme', 'Pincel preciso']
    },
    ratings: { average: 4.6, count: 45, reviews: [] },
    tags: ['esmalte', 'dailus', 'queridinhos', 'marrom', 'cremoso', 'brasil'],
    seo: {
      slug: 'dailus-esmalte-queridinhos-bolo-chocolate',
      metaTitle: 'Dailus Queridinhos Bolo de Chocolate - Esmalte Cremoso',
      metaDescription: 'Esmalte Dailus Bolo de Chocolate da linha Queridinhos. Cremoso com alta pigmentação.',
      keywords: ['esmalte dailus', 'queridinhos', 'bolo de chocolate', 'marrom', 'cremoso']
    },
    featured: false,
    isActive: true
  }
];

export const makeupProducts = [
  {
    sku: 'QDB-BASE-240F',
    name: 'Base Tô No Glow 240F',
    brand: 'Quem Disse Berenice?',
    category: 'maquiagem',
    subcategory: 'base',
    description: 'Base líquida com efeito radiante natural, cobertura média e hidratação sem oleosidade. Desenvolvida especialmente para a pele brasileira.',
    price: {
      retail: 69.90,
      professional: 55.00,
      promotional: 37.70,
      currency: 'BRL'
    },
    sizes: [
      { size: '30ml', price: 37.70, stock: 25, barcode: '7908229401324' }
    ],
    images: [
      { 
        url: '/images/products/qdb-base-glow-240f.jpg', 
        alt: 'Base Tô No Glow 240F', 
        isPrimary: true 
      }
    ],
    stock: { available: 25, reserved: 3, minimum: 8 },
    attributes: {
      color: '240F',
      texture: 'Líquida',
      finish: 'Glow',
      benefits: ['Efeito radiante', 'Cobertura média', 'Hidratação', 'Pele brasileira']
    },
    ratings: { average: 4.5, count: 156, reviews: [] },
    tags: ['base', 'qdb', 'glow', 'maquiagem', 'pele radiante', 'brasil'],
    seo: {
      slug: 'qdb-base-to-no-glow-240f-pele-brasileira',
      metaTitle: 'QDB Base Tô No Glow 240F - Base Radiante Pele Brasileira',
      metaDescription: 'Base Quem Disse Berenice Tô No Glow tom 240F. Efeito radiante natural para pele brasileira.',
      keywords: ['base qdb', 'tô no glow', '240f', 'base radiante', 'pele brasileira']
    },
    featured: true,
    isActive: true
  },
  {
    sku: 'RUBY-FEELS-MD',
    name: 'Base Fluída Feels Mood',
    brand: 'Ruby Rose',
    category: 'maquiagem',
    subcategory: 'base',
    description: 'Base fluída com tons adaptados para pele brasileira, textura leve e cobertura natural. Longa duração e conforto durante todo o dia.',
    price: {
      retail: 25.90,
      professional: 20.00,
      promotional: 22.90,
      currency: 'BRL'
    },
    sizes: [
      { size: '30ml', price: 25.90, stock: 30, barcode: '7899562506234' }
    ],
    images: [
      { 
        url: '/images/products/ruby-rose-feels-mood.jpg', 
        alt: 'Ruby Rose Feels Mood', 
        isPrimary: true 
      }
    ],
    stock: { available: 30, reserved: 2, minimum: 10 },
    attributes: {
      texture: 'Fluída',
      finish: 'Natural',
      benefits: ['Tons brasileiros', 'Textura leve', 'Longa duração']
    },
    ratings: { average: 4.3, count: 98, reviews: [] },
    tags: ['base', 'ruby rose', 'feels', 'maquiagem', 'pele brasileira', 'brasil'],
    seo: {
      slug: 'ruby-rose-base-fluida-feels-mood',
      metaTitle: 'Ruby Rose Base Feels Mood - Base Fluída Pele Brasileira',
      metaDescription: 'Base Ruby Rose Feels Mood com tons para pele brasileira. Textura leve e cobertura natural.',
      keywords: ['base ruby rose', 'feels mood', 'base fluída', 'pele brasileira', 'tons brasileiros']
    },
    featured: true,
    isActive: true
  }
];

export const toolProducts = [
  {
    sku: 'TAIFF-TOUR-2100',
    name: 'Secador Tourmaline Ion 2100W',
    brand: 'Taiff',
    category: 'ferramentas',
    subcategory: 'secador',
    description: 'Secador profissional com tecnologia íons negativos, tourmaline e cerâmica. Motor AC de longa durabilidade, cabo 3m e tampa removível.',
    price: {
      retail: 639.00,
      professional: 520.00,
      promotional: 440.01,
      currency: 'BRL'
    },
    sizes: [
      { size: 'Único', price: 440.01, stock: 12, barcode: '7898483610234' }
    ],
    images: [
      { 
        url: '/images/products/taiff-tourmaline-ion.jpg', 
        alt: 'Taiff Tourmaline Ion 2100W', 
        isPrimary: true 
      }
    ],
    stock: { available: 12, reserved: 2, minimum: 3 },
    attributes: {
      voltage: '127V',
      power: '2100W',
      benefits: ['Íons negativos', 'Tourmaline', 'Cerâmica', 'Cabo 3m', 'Tampa removível']
    },
    ratings: { average: 4.8, count: 567, reviews: [] },
    tags: ['secador', 'taiff', 'profissional', '2100w', 'tourmaline', 'brasil'],
    seo: {
      slug: 'taiff-secador-tourmaline-ion-2100w-profissional',
      metaTitle: 'Taiff Tourmaline Ion 2100W - Secador Profissional',
      metaDescription: 'Secador Taiff Tourmaline Ion 2100W com íons negativos. Profissional para hair studio.',
      keywords: ['secador taiff', 'tourmaline ion', '2100w', 'secador profissional', 'íons negativos']
    },
    featured: true,
    isActive: true
  },
  {
    sku: 'BABY-NANO-2091',
    name: 'Prancha Nano Titanium',
    brand: 'BaByliss PRO',
    category: 'ferramentas',
    subcategory: 'chapinha',
    description: 'Prancha profissional com placas de titânio 32mm, temperatura até 230°C, display LED digital e cabo giratório.',
    price: {
      retail: 768.00,
      professional: 650.00,
      promotional: 512.00,
      currency: 'BRL'
    },
    sizes: [
      { size: 'Único', price: 512.00, stock: 8, barcode: '3030050139914' }
    ],
    images: [
      { 
        url: '/images/products/babyliss-nano-titanium.jpg', 
        alt: 'BaByliss Nano Titanium', 
        isPrimary: true 
      }
    ],
    stock: { available: 8, reserved: 1, minimum: 2 },
    attributes: {
      voltage: 'Bivolt',
      power: '60W',
      benefits: ['Placas titânio', 'Display LED', '5 níveis temperatura', 'Cabo giratório']
    },
    ratings: { average: 4.9, count: 890, reviews: [] },
    tags: ['chapinha', 'babyliss', 'nano titanium', 'profissional', 'bivolt', 'prancha'],
    seo: {
      slug: 'babyliss-prancha-nano-titanium-profissional',
      metaTitle: 'BaByliss Nano Titanium - Prancha Profissional Bivolt',
      metaDescription: 'Prancha BaByliss Nano Titanium com placas de titânio. Profissional para salões.',
      keywords: ['prancha babyliss', 'nano titanium', 'chapinha profissional', 'bivolt', 'titânio']
    },
    featured: true,
    isActive: true
  }
];

export const careProducts = [
  {
    sku: 'LOREAL-ABS-500',
    name: 'Absolut Repair Gold Quinoa Shampoo',
    brand: "L'Oréal Professionnel",
    category: 'cuidados_diarios',
    subcategory: 'shampoo',
    description: 'Shampoo reparador com Gold Quinoa e proteínas. Repara e reestrutura a fibra capilar, proporcionando 77% mais reparação e 7x mais brilho.',
    price: {
      retail: 236.90,
      professional: 190.00,
      promotional: 180.90,
      currency: 'BRL'
    },
    sizes: [
      { size: '500ml', price: 180.90, stock: 20, barcode: '3474636975853' },
      { size: '250ml', price: 105.90, stock: 30, barcode: '3474636975846' }
    ],
    images: [
      { 
        url: '/images/products/loreal-absolut-repair-gold.jpg', 
        alt: 'Absolut Repair Gold Quinoa 500ml', 
        isPrimary: true 
      }
    ],
    stock: { available: 50, reserved: 5, minimum: 15 },
    attributes: {
      benefits: ['77% mais reparado', '7x mais brilho', 'Reestrutura fibra'],
      indications: ['Cabelos danificados', 'Cabelos ressecados'],
      composition: ['Gold Quinoa', 'Proteínas']
    },
    ratings: { average: 4.8, count: 456, reviews: [] },
    tags: ['shampoo', 'loreal', 'reparador', 'profissional', 'quinoa', 'ouro'],
    seo: {
      slug: 'loreal-absolut-repair-gold-quinoa-shampoo-500ml',
      metaTitle: "L'Oréal Absolut Repair Gold Quinoa - Shampoo Reparador 500ml",
      metaDescription: 'Shampoo reparador LOréal com Gold Quinoa. Repara fibra capilar com 77% mais eficácia.',
      keywords: ['shampoo reparador', 'loreal profissional', 'gold quinoa', 'absolut repair', 'cabelo danificado']
    },
    featured: false,
    isActive: true
  }
];

// CATEGORIAS BRASILEIRAS
export const brazilianCategories = [
  {
    name: 'Tratamentos Capilares',
    slug: 'tratamento_capilar',
    description: 'Progressivas, botox capilar e tratamentos profissionais brasileiros',
    order: 1,
    featured: true,
    image: '/images/categories/tratamentos-capilares.jpg',
    icon: '💇‍♀️',
    seo: {
      metaTitle: 'Tratamentos Capilares Profissionais - Hair Studio Brasil',
      metaDescription: 'Progressivas, botox e tratamentos capilares das melhores marcas brasileiras. Cadiveu, Sweet Hair, Forever Liss.',
      keywords: ['progressiva brasil', 'botox capilar', 'tratamento profissional', 'cadiveu', 'sweet hair']
    }
  },
  {
    name: 'Esmaltes',
    slug: 'esmaltes',
    description: 'Esmaltes das marcas brasileiras mais amadas',
    order: 2,
    featured: true,
    image: '/images/categories/esmaltes.jpg',
    icon: '💅',
    seo: {
      metaTitle: 'Esmaltes Brasileiros - Risqué, Colorama, Dailus',
      metaDescription: 'Esmaltes das melhores marcas brasileiras. Risqué Diamond Gel, Colorama, Dailus e muito mais.',
      keywords: ['esmalte risqué', 'esmalte colorama', 'esmalte dailus', 'esmalte brasileiro']
    }
  },
  {
    name: 'Maquiagem',
    slug: 'maquiagem',
    description: 'Maquiagens brasileiras para todos os tons de pele',
    order: 3,
    featured: true,
    image: '/images/categories/maquiagem.jpg',
    icon: '💄',
    seo: {
      metaTitle: 'Maquiagem Brasileira - QDB, Ruby Rose, Vult',
      metaDescription: 'Maquiagens desenvolvidas para a pele brasileira. Bases, batons e paletas das melhores marcas nacionais.',
      keywords: ['maquiagem brasileira', 'base qdb', 'ruby rose', 'vult', 'pele brasileira']
    }
  },
  {
    name: 'Ferramentas Profissionais',
    slug: 'ferramentas',
    description: 'Equipamentos profissionais para salões e hair studios',
    order: 4,
    featured: true,
    image: '/images/categories/ferramentas.jpg',
    icon: '🔧',
    seo: {
      metaTitle: 'Ferramentas Profissionais - Taiff, BaByliss, Wahl',
      metaDescription: 'Secadores, chapinhas e equipamentos profissionais. Taiff, BaByliss PRO para hair studios.',
      keywords: ['secador taiff', 'chapinha babyliss', 'ferramentas profissionais', 'equipamentos salão']
    }
  },
  {
    name: 'Cuidados Diários',
    slug: 'cuidados_diarios',
    description: 'Shampoos, condicionadores e máscaras para uso diário',
    order: 5,
    featured: false,
    image: '/images/categories/cuidados-diarios.jpg',
    icon: '🧴',
    seo: {
      metaTitle: 'Cuidados Diários Capilares - Shampoos e Condicionadores',
      metaDescription: 'Produtos para cuidados diários dos cabelos. LOréal, Kérastase, marcas profissionais.',
      keywords: ['shampoo profissional', 'condicionador', 'máscara capilar', 'cuidados diários']
    }
  },
  {
    name: 'Produtos Corporais',
    slug: 'corporais',
    description: 'Hidratantes e óleos corporais brasileiros',
    order: 6,
    featured: false,
    image: '/images/categories/corporais.jpg',
    icon: '🧴',
    seo: {
      metaTitle: 'Produtos Corporais - Natura, O Boticário, Granado',
      metaDescription: 'Hidratantes e óleos corporais das melhores marcas brasileiras. Natura Tododia, Nativa SPA.',
      keywords: ['hidratante corporal', 'natura tododia', 'nativa spa', 'óleo corporal brasileiro']
    }
  }
];

export async function seedDatabase() {
  try {
    await connectDB();
    console.log('🌱 Iniciando seeding do banco de dados...');

    // Limpar dados existentes
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️ Dados existentes removidos');

    // Inserir categorias
    const categories = await Category.insertMany(brazilianCategories);
    console.log(`✅ ${categories.length} categorias inseridas`);

    // Inserir produtos
    const allProducts = [
      ...treatmentProducts,
      ...nailProducts,
      ...makeupProducts,
      ...toolProducts,
      ...careProducts
    ];

    const products = await Product.insertMany(allProducts);
    console.log(`✅ ${products.length} produtos inseridos`);

    console.log('🎉 Seeding concluído com sucesso!');
    console.log(`📊 Total: ${categories.length} categorias, ${products.length} produtos`);

  } catch (error) {
    console.error('❌ Erro durante o seeding:', error);
    throw error;
  }
}