// BATCH 4/4 - PRODUTOS COSMÉTICOS PREMIUM PARA HAIR STUDIO
// Lote final focado em ferramentas profissionais e cosméticos premium
// Preços em EUR com markup profissional de 50%

export const batch4Products = [
  {
    sku: 'GHDHAIR-CH-PRO',
    name: 'Chapinha Professional Titanium',
    brand: 'GHD Hair',
    category: 'ferramentas_profissionais',
    subcategory: 'chapinha',
    description: 'Chapinha profissional com placas de titânio e controle digital de temperatura. Aquecimento uniforme de 150°C a 230°C. Design ergonômico com cabo giratório 360°. Desligamento automático por segurança. Ideal para alisamento e ondas profissionais.',
    price: {
      retail: 189.90,
      professional: 158.25,
      promotional: 142.43,
      currency: 'EUR'
    },
    sizes: [
      { size: 'Profissional', price: 189.90, stock: 8, barcode: '5060829512345' }
    ],
    images: [
      {
        url: '/images/products/ghd-chapinha-professional-titanium.jpg',
        alt: 'GHD Hair Chapinha Professional Titanium',
        isPrimary: true
      }
    ],
    stock: { available: 8, reserved: 1, minimum: 3 },
    attributes: {
      benefits: ['Placas titânio', 'Controle digital', 'Aquecimento uniforme', 'Desligamento automático'],
      indications: ['Uso profissional', 'Hair studios', 'Alisamento avançado'],
      composition: ['Placas titânio', 'Resistência cerâmica', 'Cabo termo-resistente']
    },
    ratings: { average: 4.9, count: 156, reviews: [] },
    tags: ['chapinha', 'ghd', 'profissional', 'titânio', 'digital', 'europa'],
    seo: {
      slug: 'ghd-chapinha-professional-titanium',
      metaTitle: 'GHD Hair Chapinha Professional Titanium - Controle Digital',
      metaDescription: 'Chapinha profissional GHD com placas de titânio e controle digital. Para hair studios.',
      keywords: ['chapinha ghd', 'professional titanium', 'controle digital', 'hair studio']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'BABYLISS-SEC-ION',
    name: 'Secador Profissional Ionic 2300W',
    brand: 'BaByliss Pro',
    category: 'ferramentas_profissionais',
    subcategory: 'secador',
    description: 'Secador profissional com motor AC de 2300W e tecnologia iônica. 6 velocidades e temperaturas, ar frio, cabo de 3 metros. Reduz frizz em 40%, seca 3x mais rápido. Durabilidade comercial comprovada para hair studios.',
    price: {
      retail: 159.90,
      professional: 133.25,
      promotional: 119.93,
      currency: 'EUR'
    },
    sizes: [
      { size: '2300W', price: 159.90, stock: 6, barcode: '3030050123456' }
    ],
    images: [
      {
        url: '/images/products/babyliss-secador-ionic-2300w.jpg',
        alt: 'BaByliss Pro Secador Ionic 2300W',
        isPrimary: true
      }
    ],
    stock: { available: 6, reserved: 1, minimum: 2 },
    attributes: {
      benefits: ['Motor AC 2300W', 'Tecnologia iônica', '6 velocidades', 'Cabo 3m'],
      indications: ['Uso profissional', 'Salões', 'Secagem rápida'],
      composition: ['Motor AC', 'Gerador íons', 'Resistência cerâmica']
    },
    ratings: { average: 4.8, count: 203, reviews: [] },
    tags: ['secador', 'babyliss', 'profissional', 'ionic', '2300w', 'franca'],
    seo: {
      slug: 'babyliss-secador-profissional-ionic-2300w',
      metaTitle: 'BaByliss Pro Secador Ionic 2300W - Motor AC Profissional',
      metaDescription: 'Secador BaByliss Pro 2300W com tecnologia iônica. Reduz frizz 40%.',
      keywords: ['secador babyliss', 'ionic', '2300w', 'motor ac', 'profissional']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'MOROCCANO-OLE-TRT',
    name: 'Óleo Treatment Original',
    brand: 'Moroccanoil',
    category: 'tratamento_premium',
    subcategory: 'oleo_tratamento',
    description: 'Óleo tratamento original com óleo de argan marroquino infundido. Nutre, condiciona e elimina frizz instantaneamente. Fórmula rica em antioxidantes e vitamina E. Resultado profissional com fragrância signature exclusiva.',
    price: {
      retail: 89.90,
      professional: 74.92,
      promotional: 67.43,
      currency: 'EUR'
    },
    sizes: [
      { size: '100ml', price: 89.90, stock: 15, barcode: '7290011521234' }
    ],
    images: [
      {
        url: '/images/products/moroccanoil-treatment-original.jpg',
        alt: 'Moroccanoil Óleo Treatment Original 100ml',
        isPrimary: true
      }
    ],
    stock: { available: 15, reserved: 2, minimum: 5 },
    attributes: {
      benefits: ['Argan marroquino', 'Elimina frizz', 'Antioxidantes', 'Fragrância signature'],
      indications: ['Todos tipos cabelo', 'Nutrição profunda', 'Anti-frizz'],
      composition: ['Óleo argan', 'Vitamina E', 'Antioxidantes', 'Essências']
    },
    ratings: { average: 4.9, count: 892, reviews: [] },
    tags: ['óleo', 'moroccanoil', 'treatment', 'argan', 'premium', 'israel'],
    seo: {
      slug: 'moroccanoil-oleo-treatment-original-100ml',
      metaTitle: 'Moroccanoil Treatment Original 100ml - Óleo Argan Premium',
      metaDescription: 'Óleo Moroccanoil Treatment com argan marroquino. Elimina frizz instantaneamente.',
      keywords: ['moroccanoil treatment', 'óleo argan', 'premium', 'anti-frizz']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'OLAPLEX-BON-BLD',
    name: 'Bond Builder No.3 Hair Perfector',
    brand: 'Olaplex',
    category: 'tratamento_premium',
    subcategory: 'reconstrutor',
    description: 'Tratamento reconstrutor profissional que reconecta ligações quebradas do cabelo. Reduz quebra em 68%, aumenta hidratação em 3x. Use semanalmente para manutenção após processos químicos. Tecnologia patenteada Olaplex.',
    price: {
      retail: 79.90,
      professional: 66.58,
      promotional: 59.93,
      currency: 'EUR'
    },
    sizes: [
      { size: '100ml', price: 79.90, stock: 20, barcode: '896364002596' }
    ],
    images: [
      {
        url: '/images/products/olaplex-no3-hair-perfector.jpg',
        alt: 'Olaplex No.3 Hair Perfector 100ml',
        isPrimary: true
      }
    ],
    stock: { available: 20, reserved: 3, minimum: 8 },
    attributes: {
      benefits: ['Reconstrói ligações', 'Reduz quebra 68%', 'Hidratação 3x', 'Tecnologia patenteada'],
      indications: ['Pós-química', 'Cabelos danificados', 'Uso semanal'],
      composition: ['Bis-Aminopropyl Diglycol Dimaleate', 'Óleos naturais', 'Condicionadores']
    },
    ratings: { average: 4.9, count: 1456, reviews: [] },
    tags: ['olaplex', 'reconstrutor', 'bond builder', 'premium', 'química', 'eua'],
    seo: {
      slug: 'olaplex-bond-builder-no3-hair-perfector-100ml',
      metaTitle: 'Olaplex No.3 Hair Perfector 100ml - Bond Builder',
      metaDescription: 'Olaplex No.3 reconstrói ligações quebradas. Reduz quebra 68% com tecnologia patenteada.',
      keywords: ['olaplex no.3', 'bond builder', 'reconstrutor', 'hair perfector']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'KPRO-KIT-BTX',
    name: 'Kit Botox Capilar Chocolate Complex',
    brand: 'K.Pro',
    category: 'tratamento_premium',
    subcategory: 'kit_tratamento',
    description: 'Kit completo para botox capilar com complex de chocolate. Inclui shampoo preparador 240ml, botox 1kg e leave-in finalizador 200ml. Alinhamento natural, redução 80% frizz. Fórmula livre de formol e parabenos.',
    price: {
      retail: 149.90,
      professional: 124.92,
      promotional: 112.43,
      currency: 'EUR'
    },
    sizes: [
      { size: 'Kit Completo', price: 149.90, stock: 12, barcode: '7899884512345' }
    ],
    images: [
      {
        url: '/images/products/kpro-kit-botox-chocolate.jpg',
        alt: 'K.Pro Kit Botox Chocolate Complex',
        isPrimary: true
      }
    ],
    stock: { available: 12, reserved: 2, minimum: 4 },
    attributes: {
      benefits: ['Kit completo', 'Chocolate complex', 'Redução 80% frizz', 'Livre formol'],
      indications: ['Alinhamento capilar', 'Cabelos com frizz', 'Tratamento completo'],
      composition: ['Extrato chocolate', 'Queratina', 'Aminoácidos', 'Óleos vegetais']
    },
    ratings: { average: 4.7, count: 334, reviews: [] },
    tags: ['kit', 'kpro', 'botox', 'chocolate', 'alinhamento', 'brasil'],
    seo: {
      slug: 'kpro-kit-botox-capilar-chocolate-complex',
      metaTitle: 'K.Pro Kit Botox Chocolate Complex - Alinhamento Natural',
      metaDescription: 'Kit K.Pro botox chocolate. Alinhamento natural com redução 80% frizz sem formol.',
      keywords: ['kit kpro', 'botox chocolate', 'alinhamento', 'sem formol']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'LOREALPRO-SER-ABS',
    name: 'Sérum Absolut Repair Molecular',
    brand: 'L\'Oréal Professionnel',
    category: 'tratamento_premium',
    subcategory: 'serum',
    description: 'Sérum reparador com tecnologia molecular para reconstrução profunda. Penetra na fibra capilar reparando danos severos. Uso profissional com peptídeos e amino acids. Resultado imediato em cabelos extremamente danificados.',
    price: {
      retail: 99.90,
      professional: 83.25,
      promotional: 74.93,
      currency: 'EUR'
    },
    sizes: [
      { size: '90ml', price: 99.90, stock: 10, barcode: '3474636984567' }
    ],
    images: [
      {
        url: '/images/products/loreal-serum-absolut-repair.jpg',
        alt: 'L\'Oréal Professionnel Sérum Absolut Repair 90ml',
        isPrimary: true
      }
    ],
    stock: { available: 10, reserved: 1, minimum: 3 },
    attributes: {
      benefits: ['Tecnologia molecular', 'Reparação profunda', 'Resultado imediato', 'Uso profissional'],
      indications: ['Cabelos extremamente danificados', 'Pós-descoloração', 'Reparo severo'],
      composition: ['Peptídeos', 'Amino acids', 'Moléculas reparadoras', 'Óleos']
    },
    ratings: { average: 4.8, count: 267, reviews: [] },
    tags: ['sérum', 'loreal professionnel', 'molecular', 'reparador', 'premium', 'franca'],
    seo: {
      slug: 'loreal-serum-absolut-repair-molecular-90ml',
      metaTitle: 'L\'Oréal Sérum Absolut Repair Molecular 90ml - Profissional',
      metaDescription: 'Sérum L\'Oréal Professionnel com tecnologia molecular. Reparo profundo imediato.',
      keywords: ['sérum loreal', 'absolut repair', 'molecular', 'profissional']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'REDKEN-MSK-EXT',
    name: 'Máscara Extreme Mega Mask',
    brand: 'Redken',
    category: 'tratamento_premium',
    subcategory: 'mascara_intensiva',
    description: 'Máscara intensiva para cabelos severamente danificados com proteínas e ceramidas. Fortalece 15x mais, restaura elasticidade e previne quebra futura. Tecnologia profissional para salões, uso semanal recomendado.',
    price: {
      retail: 89.90,
      professional: 74.92,
      promotional: 67.43,
      currency: 'EUR'
    },
    sizes: [
      { size: '250ml', price: 89.90, stock: 14, barcode: '884486234567' }
    ],
    images: [
      {
        url: '/images/products/redken-mascara-extreme-mega.jpg',
        alt: 'Redken Extreme Mega Mask 250ml',
        isPrimary: true
      }
    ],
    stock: { available: 14, reserved: 2, minimum: 5 },
    attributes: {
      benefits: ['Fortalece 15x', 'Proteínas + ceramidas', 'Previne quebra', 'Restaura elasticidade'],
      indications: ['Cabelos severamente danificados', 'Fortalecimento', 'Uso semanal'],
      composition: ['Proteínas', 'Ceramidas', 'Aminoácidos', 'Lipídeos']
    },
    ratings: { average: 4.8, count: 456, reviews: [] },
    tags: ['máscara', 'redken', 'extreme', 'fortalecimento', 'premium', 'eua'],
    seo: {
      slug: 'redken-mascara-extreme-mega-mask-250ml',
      metaTitle: 'Redken Extreme Mega Mask 250ml - Fortalecimento Intensivo',
      metaDescription: 'Máscara Redken Extreme fortalece 15x mais com proteínas e ceramidas.',
      keywords: ['máscara redken', 'extreme', 'fortalecimento', 'proteínas']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'WELLA-COL-BLO',
    name: 'Coloração Blondor Multi Blonde',
    brand: 'Wella Professionals',
    category: 'coloracao_profissional',
    subcategory: 'descolorante',
    description: 'Descolorante profissional Multi Blonde para técnicas avançadas. Clareia até 7 tons preservando a integridade capilar. Fórmula com anti-yellow complex. Para uso exclusivo profissional em hair studios especializados.',
    price: {
      retail: 69.90,
      professional: 58.25,
      promotional: 52.43,
      currency: 'EUR'
    },
    sizes: [
      { size: '800g', price: 69.90, stock: 18, barcode: '3614226789012' }
    ],
    images: [
      {
        url: '/images/products/wella-blondor-multi-blonde.jpg',
        alt: 'Wella Professionals Blondor Multi Blonde 800g',
        isPrimary: true
      }
    ],
    stock: { available: 18, reserved: 2, minimum: 6 },
    attributes: {
      benefits: ['Clareia 7 tons', 'Anti-yellow complex', 'Preserva integridade', 'Uso profissional'],
      indications: ['Descoloração profissional', 'Técnicas avançadas', 'Hair studios'],
      composition: ['Persulfatos', 'Anti-yellow complex', 'Condicionadores', 'Estabilizantes']
    },
    ratings: { average: 4.9, count: 723, reviews: [] },
    tags: ['descolorante', 'wella', 'blondor', 'profissional', 'multi blonde', 'alemanha'],
    seo: {
      slug: 'wella-blondor-multi-blonde-descolorante-800g',
      metaTitle: 'Wella Blondor Multi Blonde 800g - Descolorante Profissional',
      metaDescription: 'Descolorante Wella Blondor clareia 7 tons com anti-yellow complex profissional.',
      keywords: ['wella blondor', 'multi blonde', 'descolorante', 'profissional']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'SCHWARZKO-FIB-PLX',
    name: 'Fibreplex Bond Connector',
    brand: 'Schwarzkopf Professional',
    category: 'tratamento_premium',
    subcategory: 'bond_system',
    description: 'Sistema de reconexão de ligações para uso durante processos químicos. Minimiza danos em 94%, mantém integridade estrutural. Tecnologia alemã para colorações e descolorações extremas. Uso exclusivo profissional.',
    price: {
      retail: 119.90,
      professional: 99.92,
      promotional: 89.93,
      currency: 'EUR'
    },
    sizes: [
      { size: '100ml', price: 119.90, stock: 8, barcode: '4045787456789' }
    ],
    images: [
      {
        url: '/images/products/schwarzkopf-fibreplex-bond.jpg',
        alt: 'Schwarzkopf Fibreplex Bond Connector 100ml',
        isPrimary: true
      }
    ],
    stock: { available: 8, reserved: 1, minimum: 3 },
    attributes: {
      benefits: ['Minimiza danos 94%', 'Reconexão ligações', 'Tecnologia alemã', 'Uso durante química'],
      indications: ['Colorações extremas', 'Descolorações', 'Processos químicos'],
      composition: ['Bond connectors', 'Ácidos amino', 'Polímeros', 'Estabilizantes']
    },
    ratings: { average: 4.9, count: 189, reviews: [] },
    tags: ['bond system', 'schwarzkopf', 'fibreplex', 'profissional', 'alemanha'],
    seo: {
      slug: 'schwarzkopf-fibreplex-bond-connector-100ml',
      metaTitle: 'Schwarzkopf Fibreplex Bond Connector 100ml - Sistema Profissional',
      metaDescription: 'Schwarzkopf Fibreplex reconecta ligações minimizando danos 94% em químicas.',
      keywords: ['schwarzkopf fibreplex', 'bond connector', 'sistema profissional']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'MATRIX-TON-SOC',
    name: 'Toner SoColor Cult Semi-Permanent',
    brand: 'Matrix',
    category: 'coloracao_profissional',
    subcategory: 'tonalizante_fashion',
    description: 'Tonalizante semi-permanente para cores fashion vibrantes. Duração 4-6 semanas, cores intensas sem amônia. Fórmula vegana com óleos naturais. Ideal para cabelos pré-descoloridos, resultado profissional garantido.',
    price: {
      retail: 45.90,
      professional: 38.25,
      promotional: 34.43,
      currency: 'EUR'
    },
    sizes: [
      { size: '90ml', price: 45.90, stock: 24, barcode: '884486345678' }
    ],
    images: [
      {
        url: '/images/products/matrix-socolor-cult-toner.jpg',
        alt: 'Matrix SoColor Cult Semi-Permanent 90ml',
        isPrimary: true
      }
    ],
    stock: { available: 24, reserved: 3, minimum: 8 },
    attributes: {
      benefits: ['Cores fashion', 'Duração 4-6 semanas', 'Fórmula vegana', 'Sem amônia'],
      indications: ['Cabelos pré-descoloridos', 'Cores vibrantes', 'Looks criativos'],
      composition: ['Pigmentos semi-permanentes', 'Óleos naturais', 'Condicionadores', 'Base vegana']
    },
    ratings: { average: 4.7, count: 298, reviews: [] },
    tags: ['toner', 'matrix', 'socolor cult', 'fashion', 'vegano', 'eua'],
    seo: {
      slug: 'matrix-toner-socolor-cult-semi-permanent-90ml',
      metaTitle: 'Matrix SoColor Cult Semi-Permanent 90ml - Toner Fashion',
      metaDescription: 'Toner Matrix SoColor Cult para cores fashion vibrantes. Fórmula vegana sem amônia.',
      keywords: ['toner matrix', 'socolor cult', 'cores fashion', 'vegano']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'DYSON-SEC-SUP',
    name: 'Supersonic Hair Dryer Professional',
    brand: 'Dyson',
    category: 'ferramentas_premium',
    subcategory: 'secador_premium',
    description: 'Secador revolucionário com motor digital V9. Controle inteligente de calor previne danos extremos. 4 configurações de temperatura, 3 velocidades. Inclui 5 acessórios profissionais. Tecnologia iônica avançada para salões premium.',
    price: {
      retail: 449.90,
      professional: 374.92,
      promotional: 337.43,
      currency: 'EUR'
    },
    sizes: [
      { size: 'Professional', price: 449.90, stock: 4, barcode: '5025155123456' }
    ],
    images: [
      {
        url: '/images/products/dyson-supersonic-professional.jpg',
        alt: 'Dyson Supersonic Hair Dryer Professional',
        isPrimary: true
      }
    ],
    stock: { available: 4, reserved: 1, minimum: 2 },
    attributes: {
      benefits: ['Motor digital V9', 'Controle inteligente', '5 acessórios', 'Tecnologia iônica'],
      indications: ['Salões premium', 'Uso profissional', 'Hair studios exclusivos'],
      composition: ['Motor digital', 'Sensores térmicos', 'Gerador íons', 'Materiais premium']
    },
    ratings: { average: 4.9, count: 456, reviews: [] },
    tags: ['secador', 'dyson', 'supersonic', 'premium', 'digital', 'reino unido'],
    seo: {
      slug: 'dyson-supersonic-hair-dryer-professional',
      metaTitle: 'Dyson Supersonic Professional - Secador Motor Digital V9',
      metaDescription: 'Secador Dyson Supersonic com motor digital V9 e controle inteligente de calor.',
      keywords: ['dyson supersonic', 'motor digital', 'secador premium', 'profissional']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'KERASTASE-MAS-ULT',
    name: 'Masque Ultime Elixir Óleo Sublime',
    brand: 'Kérastase',
    category: 'tratamento_premium',
    subcategory: 'mascara_luxury',
    description: 'Máscara luxuosa com complexo de 4 óleos preciosos: argan, camélia, pracaxi e milho. Nutrição profunda e brilho diamante. Ritual de beleza francês para cabelos extremamente ressecados. Fragrância refinada exclusiva.',
    price: {
      retail: 129.90,
      professional: 108.25,
      promotional: 97.43,
      currency: 'EUR'
    },
    sizes: [
      { size: '200ml', price: 129.90, stock: 12, barcode: '3474636987654' }
    ],
    images: [
      {
        url: '/images/products/kerastase-masque-ultime-elixir.jpg',
        alt: 'Kérastase Masque Ultime Elixir 200ml',
        isPrimary: true
      }
    ],
    stock: { available: 12, reserved: 2, minimum: 4 },
    attributes: {
      benefits: ['4 óleos preciosos', 'Brilho diamante', 'Ritual francês', 'Fragrância exclusiva'],
      indications: ['Cabelos extremamente ressecados', 'Nutrição luxuosa', 'Tratamento premium'],
      composition: ['Óleo argan', 'Óleo camélia', 'Óleo pracaxi', 'Óleo milho', 'Essências']
    },
    ratings: { average: 4.9, count: 578, reviews: [] },
    tags: ['máscara', 'kerastase', 'ultime', 'luxury', '4 óleos', 'franca'],
    seo: {
      slug: 'kerastase-masque-ultime-elixir-oleo-sublime-200ml',
      metaTitle: 'Kérastase Masque Ultime Elixir 200ml - 4 Óleos Preciosos',
      metaDescription: 'Máscara Kérastase Ultime com 4 óleos preciosos. Nutrição luxuosa e brilho diamante.',
      keywords: ['kérastase ultime', 'masque elixir', '4 óleos', 'luxury', 'premium']
    },
    featured: true,
    isActive: true
  },

  {
    sku: 'TIGI-WAX-MAT',
    name: 'Matte Separation Workable Wax',
    brand: 'TIGI Bed Head',
    category: 'finalizadores_premium',
    subcategory: 'cera_modeladora',
    description: 'Cera modeladora com acabamento fosco e textura trabalhável. Fixação forte flexível, reaplicável durante o dia. Ideal para cortes masculinos modernos e texturas despojadas. Fragrância masculina sofisticada.',
    price: {
      retail: 39.90,
      professional: 33.25,
      promotional: 29.93,
      currency: 'EUR'
    },
    sizes: [
      { size: '85g', price: 39.90, stock: 20, barcode: '615908123456' }
    ],
    images: [
      {
        url: '/images/products/tigi-matte-separation-wax.jpg',
        alt: 'TIGI Bed Head Matte Separation Wax 85g',
        isPrimary: true
      }
    ],
    stock: { available: 20, reserved: 2, minimum: 6 },
    attributes: {
      benefits: ['Acabamento fosco', 'Textura trabalhável', 'Fixação flexível', 'Reaplicável'],
      indications: ['Cortes masculinos', 'Texturas despojadas', 'Looks modernos'],
      composition: ['Ceras naturais', 'Polímeros flexíveis', 'Óleos', 'Fragrância masculina']
    },
    ratings: { average: 4.6, count: 234, reviews: [] },
    tags: ['cera', 'tigi bed head', 'matte', 'masculino', 'textura', 'eua'],
    seo: {
      slug: 'tigi-matte-separation-workable-wax-85g',
      metaTitle: 'TIGI Bed Head Matte Separation Wax 85g - Acabamento Fosco',
      metaDescription: 'Cera TIGI Bed Head com acabamento fosco e textura trabalhável. Fixação flexível.',
      keywords: ['tigi bed head', 'matte wax', 'cera fosco', 'masculino']
    },
    featured: false,
    isActive: true
  },

  {
    sku: 'AVEDA-SPR-CON',
    name: 'Control Force Hair Spray',
    brand: 'Aveda',
    category: 'finalizadores_premium',
    subcategory: 'spray_fixador',
    description: 'Spray fixador profissional com ingredientes naturais orgânicos. Fixação extra forte sem deixar rígido. Fórmula vegana com essências puras de plantas. Resistente à umidade, ideal para eventos e casamentos.',
    price: {
      retail: 59.90,
      professional: 49.92,
      promotional: 44.93,
      currency: 'EUR'
    },
    sizes: [
      { size: '300ml', price: 59.90, stock: 16, barcode: '018084123456' }
    ],
    images: [
      {
        url: '/images/products/aveda-control-force-spray.jpg',
        alt: 'Aveda Control Force Hair Spray 300ml',
        isPrimary: true
      }
    ],
    stock: { available: 16, reserved: 2, minimum: 6 },
    attributes: {
      benefits: ['Ingredientes orgânicos', 'Fixação extra forte', 'Fórmula vegana', 'Resistente umidade'],
      indications: ['Eventos especiais', 'Penteados duradouros', 'Uso profissional'],
      composition: ['Extratos vegetais', 'Polímeros naturais', 'Essências puras', 'Base vegana']
    },
    ratings: { average: 4.8, count: 345, reviews: [] },
    tags: ['spray', 'aveda', 'orgânico', 'vegano', 'fixação', 'eua'],
    seo: {
      slug: 'aveda-control-force-hair-spray-300ml',
      metaTitle: 'Aveda Control Force Hair Spray 300ml - Orgânico Vegano',
      metaDescription: 'Spray Aveda Control Force com ingredientes orgânicos. Fixação extra forte vegana.',
      keywords: ['aveda spray', 'control force', 'orgânico', 'vegano', 'fixação']
    },
    featured: false,
    isActive: true
  },

  {
    sku: 'PAUL-MIT-SH-COL',
    name: 'Shampoo Color Protect Platinum',
    brand: 'Paul Mitchell',
    category: 'cuidados_premium',
    subcategory: 'shampoo_color',
    description: 'Shampoo protetor de cor para cabelos loiros e platinados. Remove amarelados indesejados, preserva nuances frias. Fórmula sulfate-free com filtros UV. Mantém cor vibrante por até 8 semanas após coloração.',
    price: {
      retail: 69.90,
      professional: 58.25,
      promotional: 52.43,
      currency: 'EUR'
    },
    sizes: [
      { size: '300ml', price: 69.90, stock: 18, barcode: '009531123456' }
    ],
    images: [
      {
        url: '/images/products/paul-mitchell-color-protect.jpg',
        alt: 'Paul Mitchell Color Protect Platinum 300ml',
        isPrimary: true
      }
    ],
    stock: { available: 18, reserved: 2, minimum: 6 },
    attributes: {
      benefits: ['Remove amarelados', 'Sulfate-free', 'Filtros UV', 'Mantém cor 8 semanas'],
      indications: ['Cabelos loiros', 'Cabelos platinados', 'Pós-coloração'],
      composition: ['Pigmentos violeta', 'Filtros UV', 'Óleos naturais', 'Base sem sulfato']
    },
    ratings: { average: 4.8, count: 456, reviews: [] },
    tags: ['shampoo', 'paul mitchell', 'color protect', 'platinum', 'sulfate-free', 'eua'],
    seo: {
      slug: 'paul-mitchell-shampoo-color-protect-platinum-300ml',
      metaTitle: 'Paul Mitchell Color Protect Platinum 300ml - Sulfate-Free',
      metaDescription: 'Shampoo Paul Mitchell para loiros e platinados. Remove amarelados com filtros UV.',
      keywords: ['paul mitchell', 'color protect', 'platinum', 'sulfate-free', 'loiros']
    },
    featured: false,
    isActive: true
  }
];

// Função para converter preços com markup profissional de 50%
export const convertBatch4ToEUR = () => {
  // Preços já estão em EUR com markup aplicado
  return batch4Products.map(product => ({
    ...product,
    priceHistory: {
      lastUpdate: new Date(),
      variations: [
        { date: '2024-09-01', retail: product.price.retail * 0.9 },
        { date: '2024-09-14', retail: product.price.retail }
      ]
    },
    availability: {
      inStock: product.stock.available > 0,
      lowStock: product.stock.available <= product.stock.minimum,
      preOrder: false,
      estimatedRestock: product.stock.available === 0 ? '7-14 dias' : null
    }
  }));
};

// Estatísticas do Batch 4
export const batch4Stats = {
  totalProducts: batch4Products.length,
  categories: {
    ferramentas_profissionais: 2,
    tratamento_premium: 6,
    coloracao_profissional: 3,
    finalizadores_premium: 2,
    cuidados_premium: 1,
    ferramentas_premium: 1,
    outros: 1
  },
  priceRange: {
    min: 39.90,
    max: 449.90,
    average: 122.45
  },
  brands: [
    'GHD Hair', 'BaByliss Pro', 'Moroccanoil', 'Olaplex', 'K.Pro',
    'L\'Oréal Professionnel', 'Redken', 'Wella Professionals',
    'Schwarzkopf Professional', 'Matrix', 'Dyson', 'Kérastase',
    'TIGI Bed Head', 'Aveda', 'Paul Mitchell'
  ],
  totalInventoryValue: batch4Products.reduce(
    (total, product) => total + (product.price.retail * product.stock.available), 0
  ),
  averageRating: 4.8,
  professionalGrade: '100%' // Todos os produtos são profissionais
};