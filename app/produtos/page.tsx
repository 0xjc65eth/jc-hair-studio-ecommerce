'use client';

import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import ProductCard from '../../components/products/SimpleProductCard';
import { ShoppingBag, Search, Filter } from 'lucide-react';

const progressivasData = [
  {
    id: 'cocochoco-original-premium',
    nome: 'COCOCHOCO Original Premium Keratin Treatment',
    marca: 'COCOCHOCO PROFESSIONAL',
    descricao: 'Tratamento premium de queratina com terapia de chocolate. Fórmula profissional que proporciona alisamento duradouro, brilho intenso e nutrição profunda para resultados excepcionais.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_1.JPG'],
    badge: 'BEST SELLER',
    pricing: {
      basePrice: 47.00,
      ourPrice: 47.00,
      discountPrice: 42.30,
      savings: 4.70,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu (£39.99)'
    }
  },
  {
    id: 'cocochoco-gold-premium',
    nome: 'COCOCHOCO Gold Premium Keratin Treatment',
    marca: 'COCOCHOCO PROFESSIONAL',
    descricao: 'Tratamento de queratina dourado com brilho extra. Fórmula premium para resultados profissionais com máximo brilho e alisamento perfeito.',
    imagens: ['/images/products/progressivas_diversas/progressivas_diversas_2.JPG'],
    badge: 'PREMIUM',
    pricing: {
      basePrice: 47.00,
      ourPrice: 47.00,
      discountPrice: 42.30,
      savings: 4.70,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu (£39.99)'
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
      basePrice: 50.00,
      ourPrice: 50.00,
      discountPrice: 45.00,
      savings: 5.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 47.00,
      ourPrice: 47.00,
      discountPrice: 42.30,
      savings: 4.70,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 80.00,
      ourPrice: 80.00,
      discountPrice: 72.00,
      savings: 8.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 85.00,
      ourPrice: 85.00,
      discountPrice: 76.50,
      savings: 8.50,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 95.00,
      ourPrice: 95.00,
      discountPrice: 85.50,
      savings: 9.50,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 110.00,
      ourPrice: 110.00,
      discountPrice: 99.00,
      savings: 11.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 90.00,
      ourPrice: 90.00,
      discountPrice: 81.00,
      savings: 9.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 70.00,
      ourPrice: 70.00,
      discountPrice: 63.00,
      savings: 7.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 115.00,
      ourPrice: 115.00,
      discountPrice: 103.50,
      savings: 11.50,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 105.00,
      ourPrice: 105.00,
      discountPrice: 94.50,
      savings: 10.50,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 95.00,
      ourPrice: 95.00,
      discountPrice: 85.50,
      savings: 9.50,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 90.00,
      ourPrice: 90.00,
      discountPrice: 81.00,
      savings: 9.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 108.00,
      ourPrice: 108.00,
      discountPrice: 97.20,
      savings: 10.80,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 120.00,
      ourPrice: 120.00,
      discountPrice: 108.00,
      savings: 12.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 90.00,
      ourPrice: 90.00,
      discountPrice: 81.00,
      savings: 9.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 70.00,
      ourPrice: 70.00,
      discountPrice: 63.00,
      savings: 7.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 85.00,
      ourPrice: 85.00,
      discountPrice: 76.50,
      savings: 8.50,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 95.00,
      ourPrice: 95.00,
      discountPrice: 85.50,
      savings: 9.50,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 120.00,
      ourPrice: 120.00,
      discountPrice: 108.00,
      savings: 12.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 105.00,
      ourPrice: 105.00,
      discountPrice: 94.50,
      savings: 10.50,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 80.00,
      ourPrice: 80.00,
      discountPrice: 72.00,
      savings: 8.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 135.00,
      ourPrice: 135.00,
      discountPrice: 121.50,
      savings: 13.50,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 90.00,
      ourPrice: 90.00,
      discountPrice: 81.00,
      savings: 9.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 170.00,
      ourPrice: 170.00,
      discountPrice: 153.00,
      savings: 17.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 222.27,
      ourPrice: 222.27,
      discountPrice: 200.05,
      savings: 22.22,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 90.00,
      ourPrice: 90.00,
      discountPrice: 81.00,
      savings: 9.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 99.00,
      ourPrice: 99.00,
      discountPrice: 89.10,
      savings: 9.90,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
    }
  }
];

const relaxamentosData = [
  {
    id: 'afro-nature-guanidina',
    nome: 'Afro Nature Guanidina Super',
    marca: 'AFRO NATURE',
    descricao: 'Relaxante capilar com base de guanidina para cabelos afro e crespos. Fórmula suave que respeita a estrutura natural dos fios, proporcionando alisamento controlado e duradouro.',
    imagens: ['/images/products/relaxamentos_/relaxamentos__1.WEBP'],
    badge: 'BEST SELLER',
    pricing: {
      basePrice: 15.00,
      ourPrice: 15.00,
      discountPrice: 13.50,
      savings: 1.50,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 12.00,
      ourPrice: 12.00,
      discountPrice: 10.80,
      savings: 1.20,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 14.00,
      ourPrice: 14.00,
      discountPrice: 12.60,
      savings: 1.40,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 11.00,
      ourPrice: 11.00,
      discountPrice: 9.90,
      savings: 1.10,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 18.00,
      ourPrice: 18.00,
      discountPrice: 16.20,
      savings: 1.80,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 20.00,
      ourPrice: 20.00,
      discountPrice: 18.00,
      savings: 2.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 22.00,
      ourPrice: 22.00,
      discountPrice: 19.80,
      savings: 2.20,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 25.00,
      ourPrice: 25.00,
      discountPrice: 22.50,
      savings: 2.50,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 17.00,
      ourPrice: 17.00,
      discountPrice: 15.30,
      savings: 1.70,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 18.00,
      ourPrice: 18.00,
      discountPrice: 16.20,
      savings: 1.80,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
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
      basePrice: 30.00,
      ourPrice: 30.00,
      discountPrice: 27.00,
      savings: 3.00,
      margin: '-10%',
      competitive: '10% abaixo do mercado europeu'
    }
  }
];

// ========================================
// DADOS DOS PRODUTOS - TRATAMENTOS CAPILARES
// ========================================
const tratamentosData = [
  // HIDRATAÇÃO E NUTRIÇÃO
  {
    id: 'novex-creme-antiporosidade-rosa',
    nome: 'Novex Creme Antiporosidade 72H Rosa - Cachos Mega Volume',
    marca: 'NOVEX',
    descricao: 'Creme para pentear com fórmula antiporosidade que proporciona volume e definição para cabelos ressecados. Hidratação intensa por até 72 horas com proteção contra ressecamento.',
    imagens: ['/images/products/produtos_de_hidratacao/produtos_de_hidratacao_1.WEBP'],
    badge: 'BEST SELLER',
    pricing: {
      basePrice: 10.59,
      ourPrice: 15.89,
      discountPrice: 14.50,
      savings: 1.39,
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
      basePrice: 9.16,
      ourPrice: 13.74,
      discountPrice: 12.50,
      savings: 1.24,
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
      basePrice: 10.89,
      ourPrice: 16.34,
      discountPrice: 14.90,
      savings: 1.44,
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
      basePrice: 13.90,
      ourPrice: 20.85,
      discountPrice: 18.90,
      savings: 1.95,
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
      basePrice: 11.48,
      ourPrice: 17.22,
      discountPrice: 15.50,
      savings: 1.72,
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
      basePrice: 8.78,
      ourPrice: 13.17,
      discountPrice: 11.90,
      savings: 1.27,
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
      basePrice: 7.75,
      ourPrice: 11.63,
      discountPrice: 10.50,
      savings: 1.13,
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
      basePrice: 6.59,
      ourPrice: 9.89,
      discountPrice: 8.90,
      savings: 0.99,
      margin: '35%',
      competitive: 'Baseado em produtos de hidratação europeus'
    }
  },

  // BOTOX CAPILAR E RECONSTRUÇÃO
  {
    id: 'topvip-btx-topterapia',
    nome: 'TopVip BTX Topterapia Formula 0%',
    marca: 'TOPVIP',
    descricao: 'Botox capilar livre de formol com ação hidratante e alisante. Contém D\'pantenol, óleo de argan e aminoácidos para reconstrução profunda dos fios.',
    imagens: ['/images/products/botox/botox_1.png'],
    badge: 'SEM FORMOL',
    pricing: {
      basePrice: 9.66,
      ourPrice: 14.49,
      discountPrice: 13.10,
      savings: 1.39,
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
      basePrice: 12.60,
      ourPrice: 18.90,
      discountPrice: 17.10,
      savings: 1.80,
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
      basePrice: 11.18,
      ourPrice: 16.77,
      discountPrice: 15.20,
      savings: 1.57,
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
      basePrice: 10.48,
      ourPrice: 15.72,
      discountPrice: 14.20,
      savings: 1.52,
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
      basePrice: 16.58,
      ourPrice: 24.87,
      discountPrice: 22.50,
      savings: 2.37,
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
      basePrice: 15.32,
      ourPrice: 22.98,
      discountPrice: 20.80,
      savings: 2.18,
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
      basePrice: 19.78,
      ourPrice: 29.67,
      discountPrice: 26.90,
      savings: 2.77,
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
      basePrice: 13.42,
      ourPrice: 20.13,
      discountPrice: 18.20,
      savings: 1.93,
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
      basePrice: 11.52,
      ourPrice: 17.28,
      discountPrice: 15.60,
      savings: 1.68,
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
      basePrice: 17.87,
      ourPrice: 26.81,
      discountPrice: 24.30,
      savings: 2.51,
      margin: '36%',
      competitive: 'Baseado em produtos de reconstrução europeus'
    }
  }
];

export default function ProdutosPage() {
  const [activeTab, setActiveTab] = useState('progressivas');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentProducts = activeTab === 'progressivas'
    ? progressivasData
    : relaxamentosData;
  const filteredProducts = currentProducts.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-20 mt-16 lg:mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-6">
              Produtos Capilares
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Progressivas, Tratamentos e Alisamentos Profissionais para Transformação Capilar
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('progressivas')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'progressivas'
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-600 hover:text-amber-600'
                }`}
              >
                ✨ Progressivas ({progressivasData.length})
              </button>
              <button
                onClick={() => setActiveTab('relaxamentos')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'relaxamentos'
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-600 hover:text-amber-600'
                }`}
              >
                🌊 Relaxamentos ({relaxamentosData.length})
              </button>
            </div>

            {/* Search and View Controls */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 border rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {activeTab === 'progressivas'
              ? 'Progressivas Profissionais'
              : 'Relaxamentos Capilares'
            }
          </h2>
          <p className="text-gray-600">
            {activeTab === 'progressivas'
              ? 'Transforme seus cabelos com nossas progressivas de alta qualidade'
              : 'Relaxantes seguros e eficazes para todos os tipos de cabelo'
            }
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
          }>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                nome={product.nome}
                marca={product.marca}
                descricao={product.descricao}
                imagens={product.imagens}
                badge={product.badge}
                pricing={product.pricing}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-600">Tente ajustar sua busca ou filtros</p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-4">🔬</div>
              <h3 className="text-lg font-semibold mb-2">Tecnologia Avançada</h3>
              <p className="text-gray-600">Produtos desenvolvidos com as mais modernas tecnologias capilares</p>
            </div>
            <div>
              <div className="text-3xl mb-4">✅</div>
              <h3 className="text-lg font-semibold mb-2">Resultados Garantidos</h3>
              <p className="text-gray-600">Transformação visível e duradoura para todos os tipos de cabelo</p>
            </div>
            <div>
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-lg font-semibold mb-2">Segurança Total</h3>
              <p className="text-gray-600">Fórmulas testadas e aprovadas por profissionais especializados</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}