// Static products data extracted from produtos page
// This consolidates all hardcoded product data for compatibility

interface StaticProduct {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  imagens: string[];
  badge?: string;
  destaque?: boolean;
  pricing?: {
    basePrice: number;
    ourPrice: number;
    discountPrice: number;
    savings: number;
    margin: string;
    competitive: string;
  };
}

const progressivasData: StaticProduct[] = [
  {
    id: 'cocochoco-original-premium',
    nome: 'COCOCHOCO Original Premium Keratin Treatment 1000ML',
    marca: 'COCOCHOCO PROFESSIONAL',
    descricao: 'Tratamento premium de queratina com terapia de chocolate. Fórmula profissional que proporciona alisamento duradouro, brilho intenso e nutrição profunda para resultados excepcionais.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_1.JPG'],
    badge: 'BEST SELLER',
    pricing: {
      basePrice: 124.89,
      ourPrice: 124.89,
      discountPrice: 124.89,
      savings: 0,
      margin: '0%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'cocochoco-gold-premium',
    nome: 'COCOCHOCO Gold Premium Keratin Treatment 250ML',
    marca: 'COCOCHOCO PROFESSIONAL',
    descricao: 'Tratamento de queratina dourado com brilho extra. Fórmula premium para resultados profissionais com máximo brilho e alisamento perfeito.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_2.JPG'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 43.30,
      ourPrice: 43.30,
      discountPrice: 43.30,
      savings: 0,
      margin: '0%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'tzaha-diamante-total-liss',
    nome: 'T\'ZAHA Diamante Total Liss Therapy 3D',
    marca: 'T\'ZAHA',
    descricao: 'Terapia de alisamento total 3D com shampoo e gloss. Sistema completo com semi di lino para cabelos perfeitamente lisos e sedosos.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_3.JPG'],
    badge: 'NOVO',
    pricing: {
      basePrice: 72.32,
      ourPrice: 72.32,
      discountPrice: 72.32,
      savings: 0,
      margin: '0%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'cocochoco-gold-large',
    nome: 'COCOCHOCO Gold Premium Large Size',
    marca: 'COCOCHOCO PROFESSIONAL',
    descricao: 'Tratamento de queratina dourado em tamanho profissional 1000ml. Ideal para salões que buscam máximo rendimento com qualidade premium.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_4.JPG'],
    badge: 'EXCLUSIVO',
    pricing: {
      basePrice: 130.21,
      ourPrice: 130.21,
      discountPrice: 130.21,
      savings: 0,
      margin: '0%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'brazilicious-honey-therapy',
    nome: 'BRAZILICIOUS Honey Therapy System',
    marca: 'BRAZILICIOUS',
    descricao: 'Sistema de 3 passos com terapia de mel. Kit completo com shampoo, tratamento anti-frizz e máscara para cabelos preciosos e tratados.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_5.JPG'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 174.9,
      ourPrice: 174.9,
      discountPrice: 174.9,
      savings: 0,
      margin: '34.6%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'la-grace-alinhamento-capilar',
    nome: 'La Grace Alinhamento Capilar Termoativado',
    marca: 'LA GRACE',
    descricao: 'Condicionador termoativado para alinhamento capilar profundo. Recuperação intensa com tecnologia termoativada para resultados duradouros.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_6.JPG'],
    badge: 'NOVO',
    pricing: {
      basePrice: 189.9,
      ourPrice: 189.9,
      discountPrice: 189.9,
      savings: 0,
      margin: '35.8%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'ft-cosmetics-amazon-oil',
    nome: 'FT Cosmetics Amazon Oil One Step',
    marca: 'FT COSMETICS',
    descricao: 'Tratamento em uma etapa com óleos da Amazônia. Enriquecido com açaí e buriti para nutrição e alisamento natural em um só produto.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_7.PNG'],
    badge: 'EXCLUSIVO',
    pricing: {
      basePrice: 219.9,
      ourPrice: 219.9,
      discountPrice: 219.9,
      savings: 0,
      margin: '37.5%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'prohall-burix-one',
    nome: 'PROHALL BURIX ONE Brazilian Protein',
    marca: 'PROHALL COSMETIC',
    descricao: 'Realinhamento com proteína brasileira para reestruturação molecular. Tratamento e máscara de realinhamento para cabelos danificados.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_8.PNG'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 249.9,
      ourPrice: 249.9,
      discountPrice: 249.9,
      savings: 0,
      margin: '38.9%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'plastica-fios-system',
    nome: 'Plástica de Fios Sistema Profissional',
    marca: 'PLÁSTICA DE FIOS',
    descricao: 'Sistema profissional de 3 passos com argan e colágeno. Tratamento anti-frizz completo para alisamento e nutrição simultânea.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_9.png'],
    badge: 'BEST SELLER',
    pricing: {
      basePrice: 204.9,
      ourPrice: 204.9,
      discountPrice: 204.9,
      savings: 0,
      margin: '36.7%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'fly-corpo-nanoplastia',
    nome: 'Fly Corpo Torrano Nanoplastia Organic',
    marca: 'FLY CORPO',
    descricao: 'Nanoplastia orgânica com proteínas, queratina e óleos vegetais. Fórmula orgânica líquida para alisamento natural e saudável.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_10.png'],
    badge: 'NOVO',
    pricing: {
      basePrice: 159.9,
      ourPrice: 159.9,
      discountPrice: 159.9,
      savings: 0,
      margin: '33.4%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'forbelle-extreme-expert',
    nome: 'FORBELLE EXTREME Expert System',
    marca: 'FORBELLE',
    descricao: 'Sistema especialista extremo com queratina profissional. Dupla proteção para cabelos que exigem tratamento intensivo e duradouro.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_11.JPG'],
    badge: 'EXCLUSIVO',
    pricing: {
      basePrice: 259.9,
      ourPrice: 259.9,
      discountPrice: 259.9,
      savings: 0,
      margin: '36.9%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'nuance-liso-perfect',
    nome: 'Nuance LISO Perfect Brazilian Keratin',
    marca: 'NUANCE',
    descricao: 'Queratina brasileira orgânica em máscara profissional. Design moderno com fórmula avançada para alisamento perfeito e natural.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_12.PNG'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 234.9,
      ourPrice: 234.9,
      discountPrice: 234.9,
      savings: 0,
      margin: '38.3%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'ineya-keratin-smooth',
    nome: 'INEYA Professional Keratin Smooth',
    marca: 'INEYA PROFESSIONAL',
    descricao: 'Shampoo clarificante e tratamento alisador com queratina. Sistema profissional para alisamento suave e natural.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_14.png'],
    badge: 'NOVO',
    pricing: {
      basePrice: 219.9,
      ourPrice: 219.9,
      discountPrice: 219.9,
      savings: 0,
      margin: '37.5%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'ft-cosmetics-advanced',
    nome: 'FT Cosmetics Professional Advanced System',
    marca: 'FT COSMETICS',
    descricao: 'Sistema avançado anti-resíduos com vitaminas e aminoácidos. Shampoo e tratamento para máxima eficácia profissional.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_15.PNG'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 204.9,
      ourPrice: 204.9,
      discountPrice: 204.9,
      savings: 0,
      margin: '36.7%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'relfe-ultra-liss-ojon',
    nome: 'Relfé Ultra Liss Effect OJON',
    marca: 'RELFÉ',
    descricao: 'Sistema de gloss avançado com efeito ultra liso. Tratamento com óleo de ojon para brilho e alisamento excepcionais.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_16.png'],
    badge: 'EXCLUSIVO',
    pricing: {
      basePrice: 244.9,
      ourPrice: 244.9,
      discountPrice: 244.9,
      savings: 0,
      margin: '36.2%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'luxury-restore-super-liss',
    nome: 'Luxury Professional Restore & Super Liss',
    marca: 'LUXURY PROFESSIONAL',
    descricao: 'Tratamento de revitalização para cabelos danificados. Brilho intenso e super alisamento para transformação completa.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_17.PNG'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 274.9,
      ourPrice: 274.9,
      discountPrice: 274.9,
      savings: 0,
      margin: '37.5%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'richee-bioplastica-capilar',
    nome: 'Richée Bioplástica Capilar Professional',
    marca: 'RICHÉE PROFESSIONAL',
    descricao: 'Sistema bioplástica com shampoo anti-resíduos e ativador. Tecnologia avançada para alisamento natural e duradouro.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_19.png'],
    badge: 'BEST SELLER',
    pricing: {
      basePrice: 204.9,
      ourPrice: 204.9,
      discountPrice: 204.9,
      savings: 0,
      margin: '36.7%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'bonequinha-professional-system',
    nome: 'BONEQUINHA Professional Hair System',
    marca: 'BONEQUINHA',
    descricao: 'Sistema capilar profissional com shampoo anti-resíduos e máscara. Design divertido com tecnologia séria para resultados profissionais.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_20.png'],
    badge: 'NOVO',
    pricing: {
      basePrice: 159.9,
      ourPrice: 159.9,
      discountPrice: 159.9,
      savings: 0,
      margin: '33.4%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'maria-escandalosa-system',
    nome: 'Maria Escandalosa Professional System',
    marca: 'MARIA ESCANDALOSA',
    descricao: 'Sistema profissional com design artístico floral. Shampoo e máscara para cabelos que merecem um tratamento especial.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_21.JPG'],
    badge: 'EXCLUSIVO',
    pricing: {
      basePrice: 189.9,
      ourPrice: 189.9,
      discountPrice: 189.9,
      savings: 0,
      margin: '35.8%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'empodera-perfect-liss',
    nome: 'Empodera Cosmetics Perfect Liss',
    marca: 'EMPODERA COSMETICS',
    descricao: 'Tratamento orgânico com shampoo anti-resíduos. Fórmula perfeita para alisamento natural e saudável.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_22.JPG'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 219.9,
      ourPrice: 219.9,
      discountPrice: 219.9,
      savings: 0,
      margin: '37.5%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'relfe-liss-extreme-gold',
    nome: 'Relfé Liss Extreme Gold Progressive',
    marca: 'RELFÉ (F2)',
    descricao: 'Tratamento progressivo dourado para escova perfeita. Fórmula premium com tecnologia gold para resultados superiores.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_24.PNG'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 274.9,
      ourPrice: 274.9,
      discountPrice: 274.9,
      savings: 0,
      margin: '37.5%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'japinha-cosmetics-system',
    nome: 'Japinha Cosmetics Japanese System',
    marca: 'JAPINHA COSMETICS',
    descricao: 'Sistema japonês profissional com shampoo de limpeza profunda e tratamento progressivo. Tecnologia oriental para cabelos perfeitos.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_25.JPG'],
    badge: 'EXCLUSIVO',
    pricing: {
      basePrice: 234.9,
      ourPrice: 234.9,
      discountPrice: 234.9,
      savings: 0,
      margin: '38.3%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'borabella-nao-chore-mais',
    nome: 'Borabella Não Chore Mais System',
    marca: 'BORABELLA',
    descricao: 'Sistema definitivo anti-lágrimas com shampoo anti-resíduos e tratamento ultra-definitivo. Para cabelos que merecem carinho especial.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_26.JPG'],
    badge: 'BEST SELLER',
    pricing: {
      basePrice: 174.9,
      ourPrice: 174.9,
      discountPrice: 174.9,
      savings: 0,
      margin: '34.6%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'korth-guyenne-re-match',
    nome: 'Korth Guyenne Re-Match Inner Restore',
    marca: 'KORTH GUYENNE',
    descricao: 'Alisamento reconstrutivo com ácido hialurônico. Tecnologia avançada para restauração interna e alisamento perfeito.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_27.png'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 304.9,
      ourPrice: 304.9,
      discountPrice: 304.9,
      savings: 0,
      margin: '38.7%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'relfe-organic-gloss',
    nome: 'Relfé Organic Gloss Progressive',
    marca: 'RELFÉ',
    descricao: 'Tratamento progressivo orgânico com gloss natural. Fórmula ecológica para alisamento sustentável e saudável.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_28.png'],
    badge: 'NOVO',
    pricing: {
      basePrice: 204.9,
      ourPrice: 204.9,
      discountPrice: 204.9,
      savings: 0,
      margin: '36.7%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'brasil-cacau-professional',
    nome: 'Brasil Cacau Professional System',
    marca: 'BRASIL CACAU',
    descricao: 'Sistema profissional com shampoo anti-resíduos e tratamento Eco Keratin. Fórmula aprimorada com cacau brasileiro.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_31.PNG'],
    badge: 'BEST SELLER',
    pricing: {
      basePrice: 249.9,
      ourPrice: 249.9,
      discountPrice: 249.9,
      savings: 0,
      margin: '38.9%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'cadiveu-plastica-dos-fios-linha-completa',
    nome: 'Cadiveu Plástica dos Fios - Linha Completa Profissional',
    marca: 'CADIVEU PROFESSIONAL',
    descricao: 'Linha completa de progressiva Plástica dos Fios com shampoo clarificante, máscara reconstrutora e finalizador. Sistema avançado para alisamento duradouro e brilho intenso.',
    imagens: [
      '/images/products/cadiveu/cadiveu-1.png',
      '/images/products/cadiveu/cadiveu-2.png',
      '/images/products/cadiveu/cadiveu-3.png',
      '/images/products/cadiveu/cadiveu-4.png'
    ],
    badge: 'LINHA COMPLETA',
    pricing: {
      basePrice: 264.9,
      ourPrice: 264.9,
      discountPrice: 264.9,
      savings: 0,
      margin: '39.4%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'forever-liss-cauterizacao-molecular',
    nome: 'Forever Liss Cauterização Molecular',
    marca: 'FOREVER LISS PROFESSIONAL',
    descricao: 'Tratamento revolucionário de cauterização molecular para reconstrução capilar profunda. Ação reparadora intensiva que reconstrói a fibra capilar desde o interior.',
    imagens: [
      '/images/products/forever-liss/cauterizacao-1.png'
    ],
    badge: 'NOVIDADE',
    pricing: {
      basePrice: 204.9,
      ourPrice: 204.9,
      discountPrice: 204.9,
      savings: 0,
      margin: '36.7%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  },
  {
    id: 'forever-liss-professional-system',
    nome: 'Forever Liss Professional System',
    marca: 'FOREVER LISS PROFESSIONAL',
    descricao: 'Sistema profissional completo com shampoo clarificante e máscara alisadora. Fórmula enriquecida com aminoácidos e vitaminas para cabelos mais lisos e saudáveis.',
    imagens: [
      '/images/products/forever-liss/forever-liss-1.png',
      '/images/products/forever-liss/forever-liss-2.png',
      '/images/products/forever-liss/forever-liss-3.png'
    ],
    badge: 'PROFISSIONAL',
    pricing: {
      basePrice: 219.9,
      ourPrice: 219.9,
      discountPrice: 219.9,
      savings: 0,
      margin: '37.5%',
      competitive: 'Baseado em progressivas premium europeias'
    }
  }
];

const relaxamentosData: StaticProduct[] = [
  {
    id: 'afro-nature-guanidina',
    nome: 'Afro Nature Guanidina Super',
    marca: 'AFRO NATURE',
    descricao: 'Relaxante capilar com base de guanidina para cabelos afro e crespos. Fórmula suave que respeita a estrutura natural dos fios, proporcionando alisamento controlado e duradouro.',
    imagens: ['/images/products/relaxamentos_/relaxamentos__1.WEBP'],
    badge: 'BEST SELLER',
    pricing: {
      basePrice: 62.9,
      ourPrice: 62.9,
      discountPrice: 62.9,
      savings: 0,
      margin: '37%',
      competitive: 'Baseado em relaxantes premium europeus'
    }
  },
  {
    id: 'salon-line-coco',
    nome: 'Salon Line Relaxamento Óleo de Coco',
    marca: 'SALON LINE',
    descricao: 'Creme relaxante enriquecido com óleo de coco virgem. Proporciona alisamento natural respeitando a fibra capilar, com hidratação intensa e proteção contra danos.',
    imagens: ['/images/products/relaxamentos_/relaxamentos__2.PNG'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 54.9,
      ourPrice: 54.9,
      discountPrice: 54.9,
      savings: 0,
      margin: '37.5%',
      competitive: 'Baseado em relaxantes premium europeus'
    }
  },
  {
    id: 'soft-hair-olive',
    nome: 'Soft Hair Relaxamento Olive',
    marca: 'SOFT HAIR',
    descricao: 'Relaxante capilar com extrato de oliva e vitamina E. Fórmula nutritiva que alisa suavemente enquanto fortalece e protege os fios contra quebra e ressecamento.',
    imagens: ['/images/products/relaxamentos_/relaxamentos__3.PNG'],
    badge: 'NOVO',
    pricing: {
      basePrice: 59.9,
      ourPrice: 59.9,
      discountPrice: 59.9,
      savings: 0,
      margin: '39.6%',
      competitive: 'Baseado em relaxantes premium europeus'
    }
  },
  {
    id: 'embelleze-novex',
    nome: 'Embelleze Novex Relaxamento',
    marca: 'EMBELLEZE',
    descricao: 'Sistema relaxante com tecnologia Novex que oferece alisamento progressivo e duradouro. Enriquecido com ativos hidratantes que mantêm os cabelos macios e brilhantes.',
    imagens: ['/images/products/relaxamentos_/relaxamentos__4.PNG'],
    badge: 'PROMOÇÃO',
    pricing: {
      basePrice: 49.9,
      ourPrice: 49.9,
      discountPrice: 49.9,
      savings: 0,
      margin: '35.2%',
      competitive: 'Baseado em relaxantes premium europeus'
    }
  },
  {
    id: 'tcb-professional',
    nome: 'TCB Professional Relaxamento',
    marca: 'TCB',
    descricao: 'Relaxante profissional de alta qualidade para uso em salões. Fórmula balanceada que oferece controle total do processo de alisamento com resultados previsíveis e seguros.',
    imagens: ['/images/products/relaxamentos_/relaxamentos__5.PNG'],
    badge: 'EXCLUSIVO',
    pricing: {
      basePrice: 72.9,
      ourPrice: 72.9,
      discountPrice: 72.9,
      savings: 0,
      margin: '37.8%',
      competitive: 'Baseado em relaxantes premium europeus'
    }
  },
  {
    id: 'relaxamento-argan-professional',
    nome: 'Relaxamento Argan Professional',
    marca: 'ARGAN PROFESSIONAL',
    descricao: 'Relaxante premium com óleo de argan e proteínas reconstrutoras. Ideal para cabelos resistentes, oferece alisamento suave com máxima proteção e nutrição.',
    imagens: ['/images/products/relaxamentos_/relaxamentos__6.PNG'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 79.9,
      ourPrice: 79.9,
      discountPrice: 79.9,
      savings: 0,
      margin: '35.7%',
      competitive: 'Baseado em relaxantes premium europeus'
    }
  },
  {
    id: 'relaxamento-keratin-smooth',
    nome: 'Relaxamento Keratin Smooth Complex',
    marca: 'KERATIN SMOOTH',
    descricao: 'Complexo relaxante com queratina hidrolisada para reestruturação capilar. Proporciona alisamento profissional com fortalecimento simultâneo da fibra capilar.',
    imagens: ['/images/products/relaxamentos_/relaxamentos__7.JPG'],
    badge: 'NOVO',
    pricing: {
      basePrice: 84.9,
      ourPrice: 84.9,
      discountPrice: 84.9,
      savings: 0,
      margin: '35%',
      competitive: 'Baseado em relaxantes premium europeus'
    }
  },
  {
    id: 'relaxamento-botanical-nature',
    nome: 'Relaxamento Botanical Nature Organic',
    marca: 'BOTANICAL NATURE',
    descricao: 'Relaxante orgânico com extratos botânicos selecionados. Fórmula suave e natural que respeita o couro cabeludo sensível, proporcionando alisamento saudável.',
    imagens: ['/images/products/relaxamentos_/relaxamentos__8.PNG'],
    badge: 'EXCLUSIVO',
    pricing: {
      basePrice: 94.9,
      ourPrice: 94.9,
      discountPrice: 94.9,
      savings: 0,
      margin: '39.8%',
      competitive: 'Baseado em relaxantes premium europeus'
    }
  },
  {
    id: 'relaxamento-vitamin-repair',
    nome: 'Relaxamento Vitamin Repair System',
    marca: 'VITAMIN REPAIR',
    descricao: 'Sistema reparador com complexo vitamínico para cabelos danificados. Relaxa enquanto reconstrói, devolvendo elasticidade e resistência aos fios fragilizados.',
    imagens: ['/images/products/relaxamentos_/relaxamentos__9.JPG'],
    badge: 'BEST SELLER',
    pricing: {
      basePrice: 69.9,
      ourPrice: 69.9,
      discountPrice: 69.9,
      savings: 0,
      margin: '40.1%',
      competitive: 'Baseado em relaxantes premium europeus'
    }
  },
  {
    id: 'relaxamento-collagen-intensive',
    nome: 'Relaxamento Collagen Intensive Care',
    marca: 'COLLAGEN INTENSIVE',
    descricao: 'Cuidado intensivo com colágeno para máxima hidratação. Ideal para cabelos muito ressecados, oferece relaxamento suave com tratamento reparador profundo.',
    imagens: ['/images/products/relaxamentos_/relaxamentos__10.JPG'],
    badge: 'PROMOÇÃO',
    pricing: {
      basePrice: 74.9,
      ourPrice: 74.9,
      discountPrice: 74.9,
      savings: 0,
      margin: '36.4%',
      competitive: 'Baseado em relaxantes premium europeus'
    }
  },
  {
    id: 'relaxamento-platinum-luxury',
    nome: 'Relaxamento Platinum Luxury Edition',
    marca: 'PLATINUM LUXURY',
    descricao: 'Edição de luxo com tecnologia platinum para resultado excepcional. O mais sofisticado relaxante da linha, proporcionando alisamento perfeito com cuidado premium.',
    imagens: ['/images/products/relaxamentos_/relaxamentos__11.WEBP'],
    badge: 'EXCLUSIVO',
    pricing: {
      basePrice: 124.9,
      ourPrice: 124.9,
      discountPrice: 124.9,
      savings: 0,
      margin: '38.9%',
      competitive: 'Baseado em relaxantes premium europeus'
    }
  }
];

const tratamentosData: StaticProduct[] = [
  {
    id: 'novex-creme-antiporosidade-rosa',
    nome: 'Novex Creme Antiporosidade 72H Rosa - Cachos Mega Volume',
    marca: 'NOVEX',
    descricao: 'Creme para pentear com fórmula antiporosidade que proporciona volume e definição para cabelos ressecados. Hidratação intensa por até 72 horas com proteção contra ressecamento.',
    imagens: ['/images/products/produtos_de_hidratacao/produtos_de_hidratacao_1.WEBP'],
    badge: 'BEST SELLER',
    pricing: {
      basePrice: 14.5,
      ourPrice: 14.5,
      discountPrice: 14.5,
      savings: 0,
      margin: '37%',
      competitive: 'Baseado em produtos de hidratação europeus'
    }
  },
  {
    id: 'novex-leave-in-blindagem',
    nome: 'Novex Salon Blindagem Leave-in Impermeabilizante',
    marca: 'NOVEX',
    descricao: 'Leave-in com proteção absoluta antifrizz, anti pontas duplas e brilho extremo. Proteção para altas temperaturas até 232°C, ideal para uso profissional.',
    imagens: ['/images/products/produtos_de_hidratacao/produtos_de_hidratacao_2.WEBP'],
    badge: 'PROFISSIONAL',
    pricing: {
      basePrice: 12.5,
      ourPrice: 12.5,
      discountPrice: 12.5,
      savings: 0,
      margin: '36%',
      competitive: 'Baseado em produtos de hidratação europeus'
    }
  },
  {
    id: 'novex-gelato-pistache',
    nome: 'Novex Gelato Pistache Bomba Lamelar 8 em 1',
    marca: 'NOVEX',
    descricao: 'Creme de tratamento ultraprofundo com deliciosa sensação refrescante. Bomba lamelar 8 em 1 com efeito brilho espelhado e 3 minutos mágicos de ação.',
    imagens: ['/images/products/produtos_de_hidratacao/produtos_de_hidratacao_3.WEBP'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 14.9,
      ourPrice: 14.9,
      discountPrice: 14.9,
      savings: 0,
      margin: '37%',
      competitive: 'Baseado em produtos de hidratação europeus'
    }
  },
  {
    id: 'novex-blindagem-kit',
    nome: 'Kit Novex Salon Blindagem Leave-in - Spray + Tubo',
    marca: 'NOVEX',
    descricao: 'Kit completo com leave-in spray e tubo impermeabilizante. Reparação lamelar com 12 benefícios em 1 para proteção total dos fios contra agressões.',
    imagens: ['/images/products/produtos_de_hidratacao/produtos_de_hidratacao_5.WEBP'],
    badge: 'KIT COMPLETO',
    pricing: {
      basePrice: 18.9,
      ourPrice: 18.9,
      discountPrice: 18.9,
      savings: 0,
      margin: '36%',
      competitive: 'Baseado em produtos de hidratação europeus'
    }
  },
  {
    id: 'novex-ritual-dorama',
    nome: 'Novex Ritual Dorama com Tsubaki - Creme Ultraprofundo',
    marca: 'NOVEX',
    descricao: 'Creme de tratamento ultraprofundo inspirado nos rituais coreanos com óleo de camélia Tsubaki. HNR nutrição para sonho de nutrição, brilho apaixonante e amor ao cabelo.',
    imagens: ['/images/products/produtos_de_hidratacao/produtos_de_hidratacao_6.WEBP'],
    badge: 'EXCLUSIVO',
    pricing: {
      basePrice: 15.5,
      ourPrice: 15.5,
      discountPrice: 15.5,
      savings: 0,
      margin: '35%',
      competitive: 'Baseado em produtos de hidratação europeus'
    }
  },
  {
    id: 'salon-line-mascara-chocolate',
    nome: 'Salon Line Máscara Matizadora #TodeCacho Chocolate',
    marca: 'SALON LINE',
    descricao: 'Máscara matizadora vegana com blend de cacau e óleo de amêndoas. Hidrata profundamente promovendo efeito castanho com nuance avermelhada de longa duração.',
    imagens: ['/images/products/produtos_de_hidratacao/produtos_de_hidratacao_9.PNG'],
    badge: 'VEGANA',
    pricing: {
      basePrice: 11.9,
      ourPrice: 11.9,
      discountPrice: 11.9,
      savings: 0,
      margin: '35%',
      competitive: 'Baseado em produtos de hidratação europeus'
    }
  },
  {
    id: 'bio-extratus-colorante',
    nome: 'Bio Extratus Colorante Castanho - 2 Minutos Mágicos',
    marca: 'BIO EXTRATUS',
    descricao: 'Máscara capilar colorante com ação em 2 minutos mágicos. Mantém manteiga illipê, Goji Berry e microqueratina para hidratação e intensificação dos tons castanhos.',
    imagens: ['/images/products/produtos_de_hidratacao/produtos_de_hidratacao_10.PNG'],
    badge: 'NOVO',
    pricing: {
      basePrice: 10.5,
      ourPrice: 10.5,
      discountPrice: 10.5,
      savings: 0,
      margin: '35%',
      competitive: 'Baseado em produtos de hidratação europeus'
    }
  },
  {
    id: 'bio-extratus-sillitan',
    nome: 'Bio Extratus Sillitan Óleo Capilar com Tutano',
    marca: 'BIO EXTRATUS',
    descricao: 'Óleo capilar com silicone e tutano para cabelos ressecados. Reduz volume, aumenta brilho e maciez com proteção contra agressões externas.',
    imagens: ['/images/products/produtos_de_hidratacao/produtos_de_hidratacao_11.WEBP'],
    badge: 'BEST SELLER',
    pricing: {
      basePrice: 8.9,
      ourPrice: 8.9,
      discountPrice: 8.9,
      savings: 0,
      margin: '35%',
      competitive: 'Baseado em produtos de hidratação europeus'
    }
  },
  {
    id: 'topvip-btx-topterapia',
    nome: 'TopVip BTX Topterapia Formula 0%',
    marca: 'TOPVIP',
    descricao: 'Botox capilar livre de formol com ação hidratante e alisante. Contém D\'pantenol, óleo de argan e aminoácidos para reconstrução profunda dos fios.',
    imagens: ['/images/products/botox/botox_1.png'],
    badge: 'SEM FORMOL',
    pricing: {
      basePrice: 13.1,
      ourPrice: 13.1,
      discountPrice: 13.1,
      savings: 0,
      margin: '36%',
      competitive: 'Baseado em produtos de reconstrução europeus'
    }
  },
  {
    id: 'forever-liss-btox-zero',
    nome: 'Forever Liss BTOX Zero Máscara Ultra Hidratante',
    marca: 'FOREVER LISS',
    descricao: 'Máscara ultra hidratante com fórmula orgânica antifrizz. Rica em óleo de argan, óleo de coco e manteiga de karité, proporciona hidratação profunda e realinhamento dos fios.',
    imagens: ['/images/products/botox/botox_2.png'],
    badge: 'ORGÂNICO',
    pricing: {
      basePrice: 17.1,
      ourPrice: 17.1,
      discountPrice: 17.1,
      savings: 0,
      margin: '36%',
      competitive: 'Baseado em produtos de reconstrução europeus'
    }
  },
  {
    id: 'btx-redutor-volume',
    nome: 'BTX Redutor de Volume Orgânico Zero Formol',
    marca: 'ORGÂNICO',
    descricao: 'Redutor de volume orgânico livre de formol para cabelos cacheados e volumosos. Composto de aminoácidos, ácidos condicionantes e óleo de argan para reparação dos fios.',
    imagens: ['/images/products/botox/botox_3.png'],
    badge: 'ZERO FORMOL',
    pricing: {
      basePrice: 15.2,
      ourPrice: 15.2,
      discountPrice: 15.2,
      savings: 0,
      margin: '36%',
      competitive: 'Baseado em produtos de reconstrução europeus'
    }
  },
  {
    id: 'topvip-botox-lisoplastia',
    nome: 'TopVip Botox Lisoplastia 0% Formol',
    marca: 'TOPVIP',
    descricao: 'Botox capilar com ação lisoplastia para reconstrução intensa dos fios e redução de volume. Fórmula com D\'pantenol, óleo de argan e aminoácidos.',
    imagens: ['/images/products/botox/botox_4.png'],
    badge: 'RECONSTRUÇÃO',
    pricing: {
      basePrice: 14.2,
      ourPrice: 14.2,
      discountPrice: 14.2,
      savings: 0,
      margin: '36%',
      competitive: 'Baseado em produtos de reconstrução europeus'
    }
  },
  {
    id: 'lanox-botox-organico',
    nome: 'Lanox Botox Orgânico Transformador',
    marca: 'LANOX',
    descricao: 'Botox orgânico transformador com ação liso restaurador de longa duração. Rico em aminoácidos, óleos vegetais e silicones para reconstrução e diminuição do frizz.',
    imagens: ['/images/products/botox/botox_6.png'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 22.5,
      ourPrice: 22.5,
      discountPrice: 22.5,
      savings: 0,
      margin: '36%',
      competitive: 'Baseado em produtos de reconstrução europeus'
    }
  },
  {
    id: 'versus-desmaia-organic',
    nome: 'Versus Desmaia Organic Botox Formol Free',
    marca: 'VERSUS',
    descricao: 'Realinhamento capilar com ação instantânea e alta redução de volume. Enriquecido com macadâmia e óleo de argan para brilho e hidratação.',
    imagens: ['/images/products/botox/botox_7.png'],
    badge: 'INSTANTÂNEO',
    pricing: {
      basePrice: 20.8,
      ourPrice: 20.8,
      discountPrice: 20.8,
      savings: 0,
      margin: '36%',
      competitive: 'Baseado em produtos de reconstrução europeus'
    }
  },
  {
    id: 'probelle-botox-forca-super',
    nome: 'Probelle Botox Alisante Força Super',
    marca: 'PROBELLE',
    descricao: 'Botox alisante de força super para cabelos com alta resistência. Proporciona alisamento definitivo em uma única aplicação com efeito antioxidante.',
    imagens: ['/images/products/botox/botox_8.png'],
    badge: 'FORÇA SUPER',
    pricing: {
      basePrice: 26.9,
      ourPrice: 26.9,
      discountPrice: 26.9,
      savings: 0,
      margin: '36%',
      competitive: 'Baseado em produtos de reconstrução europeus'
    }
  },
  {
    id: 'rofer-quiabo-magico',
    nome: 'Rofer Quiabo Mágico BBTOX Mágico',
    marca: 'ROFER',
    descricao: 'Botox mágico com extrato de quiabo para hidratação e nutrição intensa. Rico em óleos de macadâmia e coco, proporciona brilho intenso e maciez.',
    imagens: ['/images/products/botox/botox_9.png'],
    badge: 'NATURAL',
    pricing: {
      basePrice: 18.2,
      ourPrice: 18.2,
      discountPrice: 18.2,
      savings: 0,
      margin: '36%',
      competitive: 'Baseado em produtos de reconstrução europeus'
    }
  },
  {
    id: 'boratx-mascara-profissional',
    nome: 'BÓRATX Máscara Profissional Hidratação',
    marca: 'BÓRATX',
    descricao: 'Máscara profissional com tripla ação: hidratação, antifrizz e nutrição. Complexo bio complex com vitaminas para reparação e nutrição dos fios.',
    imagens: ['/images/products/botox/botox_10.png'],
    badge: 'TRIPLA AÇÃO',
    pricing: {
      basePrice: 15.6,
      ourPrice: 15.6,
      discountPrice: 15.6,
      savings: 0,
      margin: '35%',
      competitive: 'Baseado em produtos de reconstrução europeus'
    }
  },
  {
    id: 'prohall-bbtox-platinum',
    nome: 'Prohall BBTOX Platinum Máscara Matizadora',
    marca: 'PROHALL',
    descricao: 'Máscara matizadora de realinhamento com controle absoluto do volume e frizz. Ação matizadora platinum blond com colágeno hidrolisado e ácido lático.',
    imagens: ['/images/products/botox/botox_18.png'],
    badge: 'MATIZADORA',
    pricing: {
      basePrice: 24.3,
      ourPrice: 24.3,
      discountPrice: 24.3,
      savings: 0,
      margin: '36%',
      competitive: 'Baseado em produtos de reconstrução europeus'
    }
  }
];

// Maquiagens data from maquiagens page
// Cosmetics data from cosmeticos page (tintas capilares and esmaltes)
const cosmeticsData: StaticProduct[] = [
  // L'Oréal Paris Excellence Creme products (loreal-1 to loreal-22)
  ...Array.from({ length: 22 }, (_, i) => {
    const id = i + 1;
    const cor = id <= 5 ? 'Preto/Castanho' : id <= 10 ? 'Castanho' : id <= 15 ? 'Louro Escuro' : 'Louro Claro';
    return {
      id: `loreal-${id}`,
      nome: `L'Oréal Paris Excellence Creme ${id} - Tom Profissional`,
      marca: 'L\'ORÉAL PARIS',
      descricao: 'Coloração permanente L\'Oréal com triplo cuidado e cobertura 100% dos brancos.',
      imagens: [`/images/products/tinta_loreal/tinta_loreal_${id}.PNG`],
      badge: id <= 10 ? 'BESTSELLER' : 'PREMIUM',
      pricing: {
      basePrice: 17.28,
      ourPrice: 17.28,
      discountPrice: 17.28,
      savings: 0,
        margin: '38%',
        competitive: 'Baseado em tintas capilares premium europeias'
      }
    };
  }),

  // BioColor products (biocolor-1 to biocolor-23)
  ...Array.from({ length: 23 }, (_, i) => {
    const id = i + 1;
    const cor = id <= 6 ? 'Preto/Castanho' : id <= 12 ? 'Castanho' : id <= 18 ? 'Louro Escuro' : 'Louro Claro';
    return {
      id: `biocolor-${id}`,
      nome: `BioColor Coloração Creme ${id} - Tom Natural`,
      marca: 'BIOCOLOR',
      descricao: 'Coloração creme BioColor com mais hidratação, pronta em 20 minutos.',
      imagens: [`/images/products/tinta_biocolor/tinta_biocolor_${id}.PNG`],
      badge: 'NATURAL',
      pricing: {
      basePrice: 8.78,
      ourPrice: 8.78,
      discountPrice: 8.78,
      savings: 0,
        margin: '28%',
        competitive: 'Baseado em tintas capilares premium europeias'
      }
    };
  }),

  // Beauty Color products (beautycolor-2 to beautycolor-46, excluding placeholders)
  ...(() => {
    const validIds = [
      2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
      37, 38, 39, 40, 41, 42, 43, 44, 45, 46
    ];
    return validIds.map(id => {
      const cor = id <= 10 ? 'Preto/Castanho' : id <= 20 ? 'Castanho' : id <= 30 ? 'Louro Escuro' : id <= 40 ? 'Louro Claro' : 'Especiais';
      return {
        id: `beautycolor-${id}`,
        nome: `Beauty Color Kit ${id} - Tom Especial`,
        marca: 'BEAUTY COLOR',
        descricao: 'Coloração Beauty Color com óleos nobres e tecnologia avançada.',
        imagens: [`/images/products/tinta_beauty_color/tinta_beauty_color_${id}.PNG`],
        badge: id % 3 === 0 ? 'PREMIUM' : id % 5 === 0 ? 'BESTSELLER' : 'NOVO',
        pricing: {
      basePrice: 12.02,
      ourPrice: 12.02,
      discountPrice: 12.02,
      savings: 0,
          margin: '32%',
          competitive: 'Baseado em tintas capilares premium europeias'
        }
      };
    });
  })(),

  // Amend products (amend-1 to amend-6)
  ...Array.from({ length: 6 }, (_, i) => {
    const id = i + 1;
    const tons = ['8.1', '7.0', '6.3', '5.4', '4.0', '9.1'];
    const cores = ['Louro Cinza Claro', 'Louro Médio', 'Louro Dourado', 'Castanho Médio', 'Castanho Natural', 'Louro Muito Claro'];
    return {
      id: `amend-${id}`,
      nome: `Amend Magnific Color ${tons[id-1]} - ${cores[id-1]}`,
      marca: 'AMEND',
      descricao: 'Coloração profissional Amend com keratina e proteção antifade.',
      imagens: [`/images/products/tinta_amend/tinta_amend_${id}.PNG`],
      badge: 'PROFISSIONAL',
      pricing: {
      basePrice: 20.52,
      ourPrice: 20.52,
      discountPrice: 20.52,
      savings: 0,
        margin: '35%',
        competitive: 'Baseado em tintas capilares premium europeias'
      }
    };
  }),

  // Garnier Nutrisse products (nutrisse-1 to nutrisse-9)
  ...Array.from({ length: 9 }, (_, i) => {
    const id = i + 1;
    const cor = id <= 3 ? 'Preto/Castanho' : id <= 6 ? 'Castanho' : 'Louro Escuro';
    return {
      id: `nutrisse-${id}`,
      nome: `Garnier Nutrisse Creme ${id} - Nutrição Intensa`,
      marca: 'GARNIER NUTRISSE',
      descricao: 'Coloração nutritiva Garnier com 4 óleos e cobertura 100% dos brancos.',
      imagens: [`/images/products/tinta_nutrisse/tinta_nutrisse_${id}.PNG`],
      badge: 'NUTRITIVO',
      pricing: {
      basePrice: 14.18,
      ourPrice: 14.18,
      discountPrice: 14.18,
      savings: 0,
        margin: '30%',
        competitive: 'Baseado em tintas capilares premium europeias'
      }
    };
  }),

  // Alfaparf Alta Moda products (altamoda-1 to altamoda-29)
  ...Array.from({ length: 29 }, (_, i) => {
    const id = i + 1;
    const cor = id <= 8 ? 'Preto/Castanho' : id <= 15 ? 'Castanho' : id <= 22 ? 'Louro Escuro' : 'Louro Claro';
    return {
      id: `altamoda-${id}`,
      nome: `Alfaparf Alta Moda ${id} - Pigmentos Micronizados`,
      marca: 'ALFAPARF',
      descricao: 'Coloração italiana Alfaparf com pigmentos micronizados e máximo brilho.',
      imagens: [`/images/products/tinta_alta_moda_/tinta_alta_moda__${id}.PNG`],
      badge: 'IMPORTADA',
      pricing: {
      basePrice: 25.52,
      ourPrice: 25.52,
      discountPrice: 25.52,
      savings: 0,
        margin: '40%',
        competitive: 'Baseado em tintas capilares premium europeias'
      }
    };
  }),

  // IMPALA Esmaltes (impala-001 to impala-071) from esmaltesProducts.ts
  ...Array.from({ length: 71 }, (_, i) => {
    const index = i + 1;
    const paddedIndex = index.toString().padStart(3, '0');
    const tipos = ['Cremoso', 'Perolado', 'Metálico', 'Matte', 'Glitter', 'Duo Color', 'Classic', 'Premium', 'Especial', 'Transparente', 'Fixador', 'Coleção'];
    const badges = ['CREMOSO', 'PEROLADO', 'METALLIC', 'MATTE', 'GLITTER', 'DUO COLOR', 'CLASSIC', 'PREMIUM', 'ESPECIAL', 'TRANSPARENTE', 'FIXADOR', 'COLEÇÃO'];
    const precos = [4.90, 5.90, 6.90, 5.90, 7.90, 8.90, 4.90, 7.90, 6.90, 5.90, 6.90, 5.90];
    const tipoIndex = (index - 1) % tipos.length;

    // Cores baseadas nas imagens reais analisadas
    const coresReais = [
      'lua', 'amor', 'café café', 'branco', 'na ponta do pé', 'preto', 'coisa linda', 'crochê',
      'sonho', 'descomplicado', 'gatinho', 'sossego', 'querer', 'sofisticado', 'beterraba',
      'prazeres', 'allure', 'fascinação', 'delicado', 'intenso', 'vivência', 'destinos',
      'virtude', 'segredos', 'lembranças'
    ];
    const corIndex = (index - 1) % coresReais.length;

    return {
      id: `impala-${paddedIndex}`,
      nome: `IMPALA ${coresReais[corIndex]} ${tipos[tipoIndex]}`,
      marca: 'IMPALA',
      descricao: `Esmalte IMPALA ${tipos[tipoIndex].toLowerCase()} na cor ${coresReais[corIndex]}. Fórmula de qualidade superior da marca número 1 em esmaltes no Brasil.`,
      imagens: ['/images/products/esmaltes/Impala Abrigo Cremoso.webp'],
      badge: badges[tipoIndex],
      pricing: {
        basePrice: precos[tipoIndex],
        ourPrice: Math.round((precos[tipoIndex] * 1.5) * 100) / 100,
        discountPrice: Math.round((precos[tipoIndex] * 1.35) * 100) / 100,
        savings: Math.round((precos[tipoIndex] * 0.15) * 100) / 100,
        margin: '40%',
        competitive: 'Baseado em esmaltes IMPALA originais'
      }
    };
  })
];

// Mega Hair products (numeric IDs 1 to 20 from mega-hair page)
const megaHairData: StaticProduct[] = [
  {
    id: '1',
    nome: 'Mega Hair Liso Castanho Natural - 50cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair 100% humano, castanho natural, 50cm de comprimento. Qualidade premium sem marca d\'água.',
    imagens: ['/images/products/g-hair/g-hair-1.png'],
    badge: 'NOVO',
    pricing: {
      basePrice: 85,
      ourPrice: 85,
      discountPrice: 85,
      savings: 0,
      margin: '41.7%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '2',
    nome: 'Mega Hair Liso Loiro Mel - 55cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair loiro mel premium, 55cm, ideal para transformações naturais.',
    imagens: ['/images/products/g-hair/g-hair-2.png'],
    badge: 'NOVO',
    pricing: {
      basePrice: 90,
      ourPrice: 90,
      discountPrice: 90,
      savings: 0,
      margin: '38.4%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '3',
    nome: 'Mega Hair Ondulado Castanho - 45cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair ondulado natural, movimento perfeito para looks modernos.',
    imagens: ['/images/products/g-hair/g-hair-3.png'],
    badge: 'NOVO',
    pricing: {
      basePrice: 75,
      ourPrice: 75,
      discountPrice: 75,
      savings: 0,
      margin: '36.7%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '4',
    nome: 'Mega Hair Liso Preto Intenso - 60cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair preto intenso premium, 60cm, brilho natural excepcional.',
    imagens: ['/images/products/g-hair/g-hair-4.png'],
    badge: 'NOVO',
    pricing: {
      basePrice: 95,
      ourPrice: 95,
      discountPrice: 95,
      savings: 0,
      margin: '36.8%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '5',
    nome: 'Mega Hair Liso Castanho Claro - 50cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair castanho claro delicado, perfeito para looks suaves.',
    imagens: ['/images/products/g-hair/g-hair-5.png'],
    badge: 'NOVO',
    pricing: {
      basePrice: 80,
      ourPrice: 80,
      discountPrice: 80,
      savings: 0,
      margin: '33.3%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '6',
    nome: 'Mega Hair Liso Loiro Escuro - 55cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair loiro escuro sofisticado, 55cm de elegância.',
    imagens: ['/images/products/g-hair/g-hair-6.png'],
    badge: 'NOVO',
    pricing: {
      basePrice: 88,
      ourPrice: 88,
      discountPrice: 88,
      savings: 0,
      margin: '35.4%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '7',
    nome: 'Mega Hair Liso Castanho Médio - 45cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair castanho médio versátil, ideal para o dia a dia.',
    imagens: ['/images/products/g-hair/inoar-ghair-alemanha-3.png'],
    badge: 'NOVO',
    pricing: {
      basePrice: 72,
      ourPrice: 72,
      discountPrice: 72,
      savings: 0,
      margin: '30.9%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '8',
    nome: 'Mega Hair Ondulado Natural - 50cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair ondulado com movimento natural, 50cm de charme.',
    imagens: ['/images/products/g-hair/g-hair-1.png'],
    badge: 'NOVO',
    pricing: {
      basePrice: 82,
      ourPrice: 82,
      discountPrice: 82,
      savings: 0,
      margin: '36.8%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '9',
    nome: 'Mega Hair Liso Premium - 55cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair liso premium, qualidade superior garantida.',
    imagens: ['/images/products/g-hair/g-hair-2.png'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 92,
      ourPrice: 92,
      discountPrice: 92,
      savings: 0,
      margin: '35.2%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '10',
    nome: 'Mega Hair Cacheado Natural - 40cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair cacheado com cachos definidos e naturais.',
    imagens: ['/images/products/g-hair/g-hair-3.png'],
    badge: 'NOVO',
    pricing: {
      basePrice: 78,
      ourPrice: 78,
      discountPrice: 78,
      savings: 0,
      margin: '34.4%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '11',
    nome: 'Mega Hair Liso Dourado - 60cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair dourado luxuoso, 60cm de sofisticação.',
    imagens: ['/images/mega-hair/mega-hair-011.jpg'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 98,
      ourPrice: 98,
      discountPrice: 98,
      savings: 0,
      margin: '34.2%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '12',
    nome: 'Mega Hair Liso Elegante - 65cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair liso elegante, comprimento extra para looks impactantes.',
    imagens: ['/images/mega-hair/mega-hair-012.jpg'],
    badge: 'NOVO',
    pricing: {
      basePrice: 105,
      ourPrice: 105,
      discountPrice: 105,
      savings: 0,
      margin: '31.2%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '13',
    nome: 'Mega Hair Liso Suave - 50cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair liso com textura suave e sedosa.',
    imagens: ['/images/mega-hair/mega-hair-013.jpg'],
    badge: 'NOVO',
    pricing: {
      basePrice: 83,
      ourPrice: 83,
      discountPrice: 83,
      savings: 0,
      margin: '33.8%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '14',
    nome: 'Mega Hair Liso Clássico - 55cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair clássico atemporal, sempre em alta.',
    imagens: ['/images/mega-hair/mega-hair-014.jpg'],
    badge: 'NOVO',
    pricing: {
      basePrice: 87,
      ourPrice: 87,
      discountPrice: 87,
      savings: 0,
      margin: '33.8%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '15',
    nome: 'Mega Hair Liso Refinado - 60cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair refinado para ocasiões especiais.',
    imagens: ['/images/mega-hair/mega-hair-015.jpg'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 95,
      ourPrice: 95,
      discountPrice: 95,
      savings: 0,
      margin: '32.0%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '16',
    nome: 'Mega Hair Liso Delicado - 50cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair delicado com toque natural e suave.',
    imagens: ['/images/mega-hair/mega-hair-016.jpg'],
    badge: 'NOVO',
    pricing: {
      basePrice: 81,
      ourPrice: 81,
      discountPrice: 81,
      savings: 0,
      margin: '35.0%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '17',
    nome: 'Mega Hair Liso Especial - 45cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair especial para looks únicos e personalizados.',
    imagens: ['/images/mega-hair/mega-hair-017.jpg'],
    badge: 'NOVO',
    pricing: {
      basePrice: 74,
      ourPrice: 74,
      discountPrice: 74,
      savings: 0,
      margin: '32.4%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '18',
    nome: 'Mega Hair Ondulado Chique - 55cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair ondulado chique com movimento sofisticado.',
    imagens: ['/images/mega-hair/mega-hair-018.jpg'],
    badge: 'NOVO',
    pricing: {
      basePrice: 89,
      ourPrice: 89,
      discountPrice: 89,
      savings: 0,
      margin: '33.0%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '19',
    nome: 'Mega Hair Liso Moderno - 50cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair moderno para mulheres contemporâneas.',
    imagens: ['/images/mega-hair/mega-hair-019.jpg'],
    badge: 'NOVO',
    pricing: {
      basePrice: 84,
      ourPrice: 84,
      discountPrice: 84,
      savings: 0,
      margin: '35.4%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  },
  {
    id: '20',
    nome: 'Mega Hair Liso Glamouroso - 60cm',
    marca: 'JC HAIR STUDIO',
    descricao: 'Mega hair glamouroso para momentos especiais.',
    imagens: ['/images/mega-hair/mega-hair-020.jpg'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 97,
      ourPrice: 97,
      discountPrice: 97,
      savings: 0,
      margin: '29.4%',
      competitive: 'Baseado em mega hair premium do mercado europeu'
    }
  }
];

const maquiagensData: StaticProduct[] = [
  // Mari Maria Products
  {
    id: 'mari-maria-base-amndoa',
    nome: 'Base Mari Maria - Tom Amêndoa',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Amêndoa. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-amndoa.png'],
    badge: 'BESTSELLER',
    pricing: {
      basePrice: 28.16,
      ourPrice: 28.16,
      discountPrice: 28.16,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-baunilha',
    nome: 'Base Mari Maria - Tom Baunilha',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Baunilha. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-baunilha.png'],
    badge: 'BESTSELLER',
    pricing: {
      basePrice: 28.6,
      ourPrice: 28.6,
      discountPrice: 28.6,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-bege-claro',
    nome: 'Base Mari Maria - Tom Bege Claro',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Bege Claro. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-bege-claro.png'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 29.48,
      ourPrice: 29.48,
      discountPrice: 29.48,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-bege-escuro',
    nome: 'Base Mari Maria - Tom Bege Escuro',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Bege Escuro. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-bege-escuro.png'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 29.92,
      ourPrice: 29.92,
      discountPrice: 29.92,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-bege-medio',
    nome: 'Base Mari Maria - Tom Bege Médio',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Bege Médio. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-bege-mdio.png'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 30.36,
      ourPrice: 30.36,
      discountPrice: 30.36,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-cacau',
    nome: 'Base Mari Maria - Tom Cacau',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Cacau. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-cacau.png'],
    badge: 'DESTAQUE',
    pricing: {
      basePrice: 30.8,
      ourPrice: 30.8,
      discountPrice: 30.8,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-canela',
    nome: 'Base Mari Maria - Tom Canela',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Canela. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-canela.png'],
    badge: 'DESTAQUE',
    pricing: {
      basePrice: 31.24,
      ourPrice: 31.24,
      discountPrice: 31.24,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-caramelo',
    nome: 'Base Mari Maria - Tom Caramelo',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Caramelo. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-caramelo.png'],
    badge: 'DESTAQUE',
    pricing: {
      basePrice: 31.68,
      ourPrice: 31.68,
      discountPrice: 31.68,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-chocolate',
    nome: 'Base Mari Maria - Tom Chocolate',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Chocolate. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-chocolate.png'],
    badge: 'DESTAQUE',
    pricing: {
      basePrice: 32.12,
      ourPrice: 32.12,
      discountPrice: 32.12,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-nude',
    nome: 'Base Mari Maria - Tom Nude',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Nude. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-nude.png'],
    badge: 'DESTAQUE',
    pricing: {
      basePrice: 32.56,
      ourPrice: 32.56,
      discountPrice: 32.56,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  // Bruna Tavares Products
  {
    id: 'bruna-tavares-bt-skin-d10',
    nome: 'Base BT Skin D10 - Tom Claro',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin com fórmula avançada, cobertura natural e alta pigmentação. Desenvolvida com ácido hialurônico para hidratação prolongada.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin D10 Base Bruna Tavares.png'],
    badge: 'BESTSELLER',
    pricing: {
      basePrice: 22,
      ourPrice: 22,
      discountPrice: 22,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-d20',
    nome: 'Base BT Skin D20 - Tom Médio',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin especialmente desenvolvida para peles com subtom quente. Fórmula com ácido hialurônico e proteção contra luz azul.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin D20 Base Bruna Tavares.png'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 22.88,
      ourPrice: 22.88,
      discountPrice: 22.88,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-d30',
    nome: 'Base BT Skin D30 - Tom Escuro',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida com cobertura natural, alta pigmentação e acabamento aveludado. Ideal para peles escuras com subtom quente.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin D30 Base Bruna Tavares.png'],
    badge: 'DESTAQUE',
    pricing: {
      basePrice: 24.2,
      ourPrice: 24.2,
      discountPrice: 24.2,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-f10',
    nome: 'Base BT Skin F10 - Tom Claro Frio',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin especialmente desenvolvida para peles claras com subtom frio. Fórmula com ácido hialurônico.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin F10 Base Bruna Tavares.png'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 22.44,
      ourPrice: 22.44,
      discountPrice: 22.44,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-l10',
    nome: 'Base BT Skin L10 - Tom Light',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin para peles muito claras. Cobertura natural com acabamento sedoso e longa duração.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin L10 Base Bruna Tavares.png'],
    badge: 'BESTSELLER',
    pricing: {
      basePrice: 21.56,
      ourPrice: 21.56,
      discountPrice: 21.56,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-m10',
    nome: 'Base BT Skin M10 - Tom Medium',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin para peles médias. Fórmula avançada com proteção e hidratação prolongada.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin M10 Base Bruna Tavares.png'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 23.32,
      ourPrice: 23.32,
      discountPrice: 23.32,
      savings: 0, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
];

// Consolidate all static products
const allStaticProducts = [
  ...progressivasData,
  ...relaxamentosData,
  ...tratamentosData,
  ...cosmeticsData,
  ...megaHairData,
  ...maquiagensData
];

export const getStaticProductById = (productId: string): StaticProduct | null => {
  return allStaticProducts.find(p => p.id === productId) || null;
};

export const getAllStaticProducts = (): StaticProduct[] => {
  return allStaticProducts;
};

export const staticProducts = allStaticProducts;
export { type StaticProduct };