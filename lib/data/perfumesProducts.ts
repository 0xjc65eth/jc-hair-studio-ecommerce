/**
 * JC Hair Studio's 62 - Perfumes WEPINK Oficiais
 *
 * Catálogo completo com 32 perfumes exclusivos WEPINK
 * Coleção Virginia - Fragrâncias premium organizadas por gênero
 */

export interface PerfumeProduct {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  imagem: string;
  categoria: string;
  subcategoria: string;
  genero: 'feminino' | 'masculino' | 'unissex';
  badge?: string;
  pricing: {
    basePrice: number;
    ourPrice: number;
    discountPrice?: number;
    savings?: number;
    margin: string;
    competitive: string;
  };
  especificacoes: {
    volume: string;
    tipo: 'Desodorante Colônia' | 'Colônia Infantil';
    durabilidade: string;
    fixacao: string;
    aplicacao: string;
    familia_olfativa?: string;
  };
  notas?: {
    topo?: string[];
    corpo?: string[];
    fundo?: string[];
  };
  tags: string[];
  rating: number;
  reviews: number;
}

// Dados base para cálculos de preço
const precificacao = {
  '50ml': { base: 15.90, our: 22.90, discount: 19.90 },
  '75ml': { base: 18.90, our: 26.90, discount: 23.90 },
  '100ml': { base: 22.90, our: 32.90, discount: 28.90 }
};

// Perfumes organizados por gênero e características
export const perfumesWepink: PerfumeProduct[] = [
  // === PERFUMES FEMININOS ===
  {
    id: 'wepink-4dreams',
    nome: '4Dreams',
    marca: 'WEPINK',
    descricao: 'Fragrância feminina dos sonhos, com notas florais delicadas que despertam a feminilidade e elegância natural.',
    imagem: '/images/products/perfumes/perfume_1_4dreams-desodorante-colônia-7-wepink_feminino.png',
    categoria: 'Perfumes',
    subcategoria: 'Feminino',
    genero: 'feminino',
    badge: 'FLORAL',
    pricing: {
      basePrice: precificacao['75ml'].base,
      ourPrice: precificacao['75ml'].our,
      discountPrice: precificacao['75ml'].discount,
      savings: precificacao['75ml'].our - precificacao['75ml'].discount,
      margin: '22%',
      competitive: 'Menor preço garantido'
    },
    especificacoes: {
      volume: '75ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '6-8 horas',
      fixacao: 'Média',
      aplicacao: 'Pulsos e pescoço',
      familia_olfativa: 'Floral'
    },
    notas: {
      topo: ['Bergamota', 'Pêra', 'Cassis'],
      corpo: ['Rosa', 'Peônia', 'Magnólia'],
      fundo: ['Almíscar', 'Âmbar', 'Cedro']
    },
    tags: ['wepink', 'feminino', 'floral', 'elegante', 'dia', 'romantico', '75ml'],
    rating: 4.7,
    reviews: 142
  },
  {
    id: 'wepink-heaven-bride',
    nome: 'Heaven Bride',
    marca: 'WEPINK',
    descricao: 'A essência da pureza e elegância feminina. Perfeito para ocasiões especiais e momentos únicos.',
    imagem: '/images/products/perfumes/perfume_10_heaven-bride-desodorante-colônia-10-wepink_feminino.png',
    categoria: 'Perfumes',
    subcategoria: 'Feminino',
    genero: 'feminino',
    badge: 'BRIDAL',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Melhor custo-benefício'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '8-10 horas',
      fixacao: 'Longa',
      aplicacao: 'Pulsos, pescoço e cabelos',
      familia_olfativa: 'Floral Branco'
    },
    notas: {
      topo: ['Flor de Laranjeira', 'Aldeídos', 'Bergamota'],
      corpo: ['Jasmim', 'Rosa Branca', 'Lírio'],
      fundo: ['Sândalo', 'Almíscar Branco', 'Âmbar']
    },
    tags: ['wepink', 'feminino', 'bridal', 'casamento', 'elegante', 'especial', '100ml'],
    rating: 4.9,
    reviews: 89
  },
  {
    id: 'wepink-queen-pink',
    nome: 'Queen Pink',
    marca: 'WEPINK',
    descricao: 'Para mulheres que sabem do seu poder. Fragrância marcante e feminina que exala confiança.',
    imagem: '/images/products/perfumes/perfume_26_queen-pink-desodorante-colônia-10-wepink_feminino.png',
    categoria: 'Perfumes',
    subcategoria: 'Feminino',
    genero: 'feminino',
    badge: 'POWER',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Preço exclusivo online'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '7-9 horas',
      fixacao: 'Média-Longa',
      aplicacao: 'Pulsos e atrás das orelhas',
      familia_olfativa: 'Floral Frutal'
    },
    tags: ['wepink', 'feminino', 'power', 'confiança', 'moderno', 'sofisticado', '100ml'],
    rating: 4.8,
    reviews: 156
  },
  {
    id: 'wepink-sweet-lady',
    nome: 'Le Grand Club Sweet Lady',
    marca: 'WEPINK',
    descricao: 'Elegância clássica em cada borrifo. Para a mulher sofisticada que aprecia tradição e modernidade.',
    imagem: '/images/products/perfumes/perfume_18_le-grand-club-sweet-lady-desodorante-colônia-10-wepink_feminino.png',
    categoria: 'Perfumes',
    subcategoria: 'Feminino',
    genero: 'feminino',
    badge: 'CLASSIC',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Tradição garantida'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '6-8 horas',
      fixacao: 'Média',
      aplicacao: 'Todo o corpo',
      familia_olfativa: 'Oriental Floral'
    },
    tags: ['wepink', 'feminino', 'classic', 'elegante', 'tradicional', 'sofisticado', '100ml'],
    rating: 4.6,
    reviews: 78
  },
  {
    id: 'wepink-scarlette',
    nome: 'Scarlette',
    marca: 'WEPINK',
    descricao: 'Intensidade e paixão em uma fragrância única. Para mulheres decididas e apaixonadas pela vida.',
    imagem: '/images/products/perfumes/perfume_28_scarlette-desodorante-colônia-5-wepink_feminino.png',
    categoria: 'Perfumes',
    subcategoria: 'Feminino',
    genero: 'feminino',
    badge: 'INTENSE',
    pricing: {
      basePrice: precificacao['50ml'].base,
      ourPrice: precificacao['50ml'].our,
      discountPrice: precificacao['50ml'].discount,
      savings: precificacao['50ml'].our - precificacao['50ml'].discount,
      margin: '22%',
      competitive: 'Concentração premium'
    },
    especificacoes: {
      volume: '50ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '8-10 horas',
      fixacao: 'Longa',
      aplicacao: 'Pontos estratégicos',
      familia_olfativa: 'Oriental Especiado'
    },
    tags: ['wepink', 'feminino', 'intense', 'paixão', 'noite', 'especial', '50ml'],
    rating: 4.8,
    reviews: 134
  },
  {
    id: 'wepink-vf-bloom',
    nome: 'VF Bloom',
    marca: 'WEPINK',
    descricao: 'Como um jardim em flor, esta fragrância desperta os sentidos com sua delicadeza natural.',
    imagem: '/images/products/perfumes/perfume_30_vf-bloom-desodorante-colônia-7-wepink_feminino.png',
    categoria: 'Perfumes',
    subcategoria: 'Feminino',
    genero: 'feminino',
    badge: 'BLOOM',
    pricing: {
      basePrice: precificacao['75ml'].base,
      ourPrice: precificacao['75ml'].our,
      discountPrice: precificacao['75ml'].discount,
      savings: precificacao['75ml'].our - precificacao['75ml'].discount,
      margin: '22%',
      competitive: 'Natural e delicado'
    },
    especificacoes: {
      volume: '75ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '6-7 horas',
      fixacao: 'Média',
      aplicacao: 'Todo o corpo',
      familia_olfativa: 'Floral Verde'
    },
    tags: ['wepink', 'feminino', 'bloom', 'natural', 'primavera', 'delicado', '75ml'],
    rating: 4.5,
    reviews: 97
  },
  {
    id: 'wepink-vf-seduce',
    nome: 'VF Seduce',
    marca: 'WEPINK',
    descricao: 'O poder da sedução em cada gota. Para mulheres que sabem conquistar com elegância.',
    imagem: '/images/products/perfumes/perfume_31_vf-seduce-desodorante-colônia-7-wepink_feminino.png',
    categoria: 'Perfumes',
    subcategoria: 'Feminino',
    genero: 'feminino',
    badge: 'SEDUCE',
    pricing: {
      basePrice: precificacao['75ml'].base,
      ourPrice: precificacao['75ml'].our,
      discountPrice: precificacao['75ml'].discount,
      savings: precificacao['75ml'].our - precificacao['75ml'].discount,
      margin: '22%',
      competitive: 'Irresistível'
    },
    especificacoes: {
      volume: '75ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '7-9 horas',
      fixacao: 'Média-Longa',
      aplicacao: 'Pontos de pulsação',
      familia_olfativa: 'Oriental Amadeirado'
    },
    tags: ['wepink', 'feminino', 'seduce', 'sedução', 'noite', 'mistério', '75ml'],
    rating: 4.7,
    reviews: 123
  },

  // === PERFUMES MASCULINOS ===
  {
    id: 'wepink-bourbon',
    nome: 'Bourbon',
    marca: 'WEPINK',
    descricao: 'Masculinidade clássica e refinada. Para homens que apreciam tradição e elegância atemporal.',
    imagem: '/images/products/perfumes/perfume_2_bourbon-desodorante-colônia-10-wepink-masculino_masculino.png',
    categoria: 'Perfumes',
    subcategoria: 'Masculino',
    genero: 'masculino',
    badge: 'CLASSIC',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Tradição masculina'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '8-10 horas',
      fixacao: 'Longa',
      aplicacao: 'Peito e pulsos',
      familia_olfativa: 'Amadeirado Oriental'
    },
    notas: {
      topo: ['Bergamota', 'Limão', 'Cardamomo'],
      corpo: ['Lavanda', 'Gerânio', 'Cedro'],
      fundo: ['Sândalo', 'Vetiver', 'Almíscar']
    },
    tags: ['wepink', 'masculino', 'classic', 'elegante', 'tradicional', 'amadeirado', '100ml'],
    rating: 4.6,
    reviews: 189
  },
  {
    id: 'wepink-bourbon-silver',
    nome: 'Bourbon Silver',
    marca: 'WEPINK',
    descricao: 'A evolução moderna do clássico. Sofisticação contemporânea para o homem urbano.',
    imagem: '/images/products/perfumes/perfume_4_bourbon-silver-desodorante-colônia-10-wepink-masculino_masculino.png',
    categoria: 'Perfumes',
    subcategoria: 'Masculino',
    genero: 'masculino',
    badge: 'MODERN',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Modernidade premium'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '7-9 horas',
      fixacao: 'Média-Longa',
      aplicacao: 'Todo o corpo',
      familia_olfativa: 'Fresh Oriental'
    },
    tags: ['wepink', 'masculino', 'modern', 'urbano', 'contemporâneo', 'fresh', '100ml'],
    rating: 4.7,
    reviews: 156
  },
  {
    id: 'wepink-heaven-groom',
    nome: 'Heaven Groom',
    marca: 'WEPINK',
    descricao: 'Elegância masculina para momentos especiais. O companheiro perfeito para ocasiões únicas.',
    imagem: '/images/products/perfumes/perfume_11_heaven-groom-desodorante-colônia-10-wepink-masculino_masculino.png',
    categoria: 'Perfumes',
    subcategoria: 'Masculino',
    genero: 'masculino',
    badge: 'GROOM',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Para momentos especiais'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '8-12 horas',
      fixacao: 'Muito Longa',
      aplicacao: 'Pontos estratégicos',
      familia_olfativa: 'Amadeirado Especiado'
    },
    tags: ['wepink', 'masculino', 'groom', 'casamento', 'especial', 'elegante', '100ml'],
    rating: 4.9,
    reviews: 87
  },
  {
    id: 'wepink-king-blue-deep',
    nome: 'King Blue Deep',
    marca: 'WEPINK',
    descricao: 'Profundidade e intensidade masculina. Para homens que comandam com autoridade natural.',
    imagem: '/images/products/perfumes/perfume_15_king-blue-deep-desodorante-colônia-10-wepink-masculino_masculino.png',
    categoria: 'Perfumes',
    subcategoria: 'Masculino',
    genero: 'masculino',
    badge: 'DEEP',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Intensidade máxima'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '10-12 horas',
      fixacao: 'Muito Longa',
      aplicacao: 'Peito e pescoço',
      familia_olfativa: 'Aquático Amadeirado'
    },
    tags: ['wepink', 'masculino', 'deep', 'intenso', 'autoridade', 'aquático', '100ml'],
    rating: 4.8,
    reviews: 201
  },
  {
    id: 'wepink-king-blue',
    nome: 'King Blue',
    marca: 'WEPINK',
    descricao: 'A essência da realeza masculina. Frescor e elegância para líderes natos.',
    imagem: '/images/products/perfumes/perfume_17_king-blue-desodorante-colônia-10-wepink-masculino_masculino.png',
    categoria: 'Perfumes',
    subcategoria: 'Masculino',
    genero: 'masculino',
    badge: 'ROYAL',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Realeza acessível'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '7-9 horas',
      fixacao: 'Média-Longa',
      aplicacao: 'Todo o corpo',
      familia_olfativa: 'Fresh Aquático'
    },
    tags: ['wepink', 'masculino', 'royal', 'fresh', 'liderança', 'dia', '100ml'],
    rating: 4.6,
    reviews: 167
  },
  {
    id: 'wepink-lion-blanc',
    nome: 'Lion Blanc',
    marca: 'WEPINK',
    descricao: 'Força e pureza masculina. Para homens que equilibram poder e elegância com maestria.',
    imagem: '/images/products/perfumes/perfume_20_lion-blanc-desodorante-colônia-10-wepink-masculino_masculino.png',
    categoria: 'Perfumes',
    subcategoria: 'Masculino',
    genero: 'masculino',
    badge: 'POWER',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Força elegante'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '8-10 horas',
      fixacao: 'Longa',
      aplicacao: 'Pulsos e peito',
      familia_olfativa: 'Amadeirado Fresh'
    },
    tags: ['wepink', 'masculino', 'power', 'força', 'elegância', 'equilíbrio', '100ml'],
    rating: 4.7,
    reviews: 145
  },
  {
    id: 'wepink-lion-noir',
    nome: 'Lion Noir',
    marca: 'WEPINK',
    descricao: 'Mistério e magnetismo masculino. Para homens que fascinam pela sua presença marcante.',
    imagem: '/images/products/perfumes/perfume_21_lion-noir-desodorante-colônia-10-wepink-masculino_masculino.png',
    categoria: 'Perfumes',
    subcategoria: 'Masculino',
    genero: 'masculino',
    badge: 'MYSTERY',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Magnetismo único'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '9-11 horas',
      fixacao: 'Muito Longa',
      aplicacao: 'Pontos estratégicos',
      familia_olfativa: 'Oriental Especiado'
    },
    tags: ['wepink', 'masculino', 'mystery', 'mistério', 'noite', 'magnetismo', '100ml'],
    rating: 4.8,
    reviews: 178
  },
  {
    id: 'wepink-pureblixx-darkest',
    nome: 'Pureblixx Darkest',
    marca: 'WEPINK',
    descricao: 'A essência mais intensa da masculinidade. Para homens que não passam despercebidos.',
    imagem: '/images/products/perfumes/perfume_25_pureblixx-darkest-desodorante-colônia-10-wepink-masculino_masculino.png',
    categoria: 'Perfumes',
    subcategoria: 'Masculino',
    genero: 'masculino',
    badge: 'INTENSE',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Intensidade máxima'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '10-14 horas',
      fixacao: 'Extra Longa',
      aplicacao: 'Aplicação pontual',
      familia_olfativa: 'Oriental Intenso'
    },
    tags: ['wepink', 'masculino', 'intense', 'darkest', 'intenso', 'impactante', '100ml'],
    rating: 4.9,
    reviews: 134
  },
  {
    id: 'wepink-red-obsidian',
    nome: 'Red Obsidian',
    marca: 'WEPINK',
    descricao: 'Paixão e força em perfeita harmonia. Para homens apaixonados pela vida e pelo sucesso.',
    imagem: '/images/products/perfumes/perfume_27_red-obsidian-desodorante-colônia-10-wepink-masculino_masculino.png',
    categoria: 'Perfumes',
    subcategoria: 'Masculino',
    genero: 'masculino',
    badge: 'PASSION',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Paixão incontrolável'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '8-10 horas',
      fixacao: 'Longa',
      aplicacao: 'Todo o corpo',
      familia_olfativa: 'Especiado Oriental'
    },
    tags: ['wepink', 'masculino', 'passion', 'paixão', 'sucesso', 'especiado', '100ml'],
    rating: 4.7,
    reviews: 192
  },

  // === PERFUMES UNISSEX ===
  {
    id: 'wepink-celebrate-relics',
    nome: 'Celebrate Relics',
    marca: 'WEPINK',
    descricao: 'Uma fragrância atemporal que celebra momentos especiais. Perfeita para qualquer ocasião.',
    imagem: '/images/products/perfumes/perfume_5_celebrate-relics-desodorante-colônia-10-wepink_unissex.png',
    categoria: 'Perfumes',
    subcategoria: 'Unissex',
    genero: 'unissex',
    badge: 'CELEBRATE',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Para todos celebrarem'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '7-9 horas',
      fixacao: 'Média-Longa',
      aplicacao: 'Todo o corpo',
      familia_olfativa: 'Fresh Universal'
    },
    tags: ['wepink', 'unissex', 'celebrate', 'especial', 'comemoração', 'universal', '100ml'],
    rating: 4.6,
    reviews: 234
  },
  {
    id: 'wepink-wonderful',
    nome: 'Wonderful',
    marca: 'WEPINK',
    descricao: 'A maravilha de uma fragrância que encanta a todos. Delicadeza e frescor em harmonia perfeita.',
    imagem: '/images/products/perfumes/perfume_32_wonderful-desodorante-colônia-10-wepink_unissex.png',
    categoria: 'Perfumes',
    subcategoria: 'Unissex',
    genero: 'unissex',
    badge: 'WONDERFUL',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Simplicidade maravilhosa'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '6-8 horas',
      fixacao: 'Média',
      aplicacao: 'Todo o corpo',
      familia_olfativa: 'Floral Fresh'
    },
    tags: ['wepink', 'unissex', 'wonderful', 'harmonia', 'delicado', 'fresh', '100ml'],
    rating: 4.5,
    reviews: 187
  },
  {
    id: 'wepink-merry-christmas',
    nome: 'Merry Christmas',
    marca: 'WEPINK',
    descricao: 'O espírito natalino em uma fragrância única. Aconchego e celebração para toda a família.',
    imagem: '/images/products/perfumes/perfume_23_merry-christmas-desodorante-colônia-10-wepink_unissex.png',
    categoria: 'Perfumes',
    subcategoria: 'Unissex',
    genero: 'unissex',
    badge: 'CHRISTMAS',
    pricing: {
      basePrice: precificacao['100ml'].base,
      ourPrice: precificacao['100ml'].our,
      discountPrice: precificacao['100ml'].discount,
      savings: precificacao['100ml'].our - precificacao['100ml'].discount,
      margin: '22%',
      competitive: 'Magia natalina'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '7-8 horas',
      fixacao: 'Média',
      aplicacao: 'Todo o corpo',
      familia_olfativa: 'Especiado Quente'
    },
    tags: ['wepink', 'unissex', 'christmas', 'natal', 'família', 'aconchego', '100ml'],
    rating: 4.7,
    reviews: 298
  },
  {
    id: 'wepink-fantasy-kids',
    nome: 'Fantasy Kids Blue Dragon',
    marca: 'WEPINK',
    descricacao: 'Aventura e fantasia para os pequenos exploradores. Fragrância suave e divertida.',
    imagem: '/images/products/perfumes/perfume_8_fantasy-kids-blue-dragon-colônia-10-wepink_unissex.png',
    categoria: 'Perfumes',
    subcategoria: 'Infantil',
    genero: 'unissex',
    badge: 'KIDS',
    pricing: {
      basePrice: precificacao['100ml'].base - 5,
      ourPrice: precificacao['100ml'].our - 5,
      discountPrice: precificacao['100ml'].discount - 5,
      savings: (precificacao['100ml'].our - 5) - (precificacao['100ml'].discount - 5),
      margin: '18%',
      competitive: 'Especial para crianças'
    },
    especificacoes: {
      volume: '100ml',
      tipo: 'Colônia Infantil',
      durabilidade: '4-6 horas',
      fixacao: 'Suave',
      aplicacao: 'Todo o corpo',
      familia_olfativa: 'Fresh Suave'
    },
    tags: ['wepink', 'unissex', 'kids', 'infantil', 'suave', 'fantasia', '100ml'],
    rating: 4.8,
    reviews: 156
  },
  {
    id: 'wepink-infinity-cosmik',
    nome: 'Infinity Cosmik',
    marca: 'WEPINK',
    descricao: 'Uma jornada olfativa infinita. Fragrância moderna e única para personalidades marcantes.',
    imagem: '/images/products/perfumes/perfume_12_infinity-cosmik-desodorante-colônia-7-wepink_unissex.png',
    categoria: 'Perfumes',
    subcategoria: 'Unissex',
    genero: 'unissex',
    badge: 'COSMIC',
    pricing: {
      basePrice: precificacao['75ml'].base,
      ourPrice: precificacao['75ml'].our,
      discountPrice: precificacao['75ml'].discount,
      savings: precificacao['75ml'].our - precificacao['75ml'].discount,
      margin: '22%',
      competitive: 'Experiência cósmica'
    },
    especificacoes: {
      volume: '75ml',
      tipo: 'Desodorante Colônia',
      durabilidade: '8-10 horas',
      fixacao: 'Longa',
      aplicacao: 'Pontos estratégicos',
      familia_olfativa: 'Oriental Moderno'
    },
    tags: ['wepink', 'unissex', 'cosmic', 'moderno', 'único', 'marcante', '75ml'],
    rating: 4.6,
    reviews: 143
  }
];

// Função para filtrar perfumes por gênero
export const getPerfumesByGenero = (genero: 'feminino' | 'masculino' | 'unissex') => {
  return perfumesWepink.filter(perfume => perfume.genero === genero);
};

// Função para filtrar perfumes por volume
export const getPerfumesByVolume = (volume: '50ml' | '75ml' | '100ml') => {
  return perfumesWepink.filter(perfume => perfume.especificacoes.volume === volume);
};

// Exportar todos os dados
export const allPerfumesData = perfumesWepink;

export default perfumesWepink;