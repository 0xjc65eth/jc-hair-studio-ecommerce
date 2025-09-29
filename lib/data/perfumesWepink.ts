/**
 * JC Hair Studio's 62 - Perfumes WEPINK
 * Catálogo completo de 32 perfumes WEPINK brasileiros
 * Baseado na análise detalhada dos rótulos e frascos REAIS
 * Caminhos de imagens atualizados com nomes reais dos arquivos
 */

export interface PerfumeWepink {
  id: string;
  nome: string;
  marca: string;
  tipo: string;
  volume: string;
  familia_olfativa: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  images: string[];
  pricing: {
    basePrice: number;
    ourPrice: number;
    discountPrice: number;
  };
  badge: string;
  publico: string;
}

// Perfumes WEPINK - Coleção Completa (32 perfumes)
export const perfumesWepink: PerfumeWepink[] = [
  // LINHA FEMININA (9 produtos)
  {
    id: "wepink-4dreams-desodorante-colonia-70ml",
    nome: "WEPINK 4Dreams Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "70ml",
    familia_olfativa: "Floral Frutal",
    descricao: "Perfume feminino brasileiro com notas florais e frutais delicadas",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_1_4dreams-desodorante-colônia-7-wepink_feminino.png"],
    pricing: { basePrice: 69.90, ourPrice: 49.90, discountPrice: 44.90 },
    badge: "PREMIUM",
    publico: "Feminino"
  },
  {
    id: "wepink-heaven-bride-desodorante-colonia-100ml",
    nome: "WEPINK Heaven Bride Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Floral Delicada",
    descricao: "Perfume especial para noivas com fragrância romântica e sofisticada",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_10_heaven-bride-desodorante-colônia-10-wepink_feminino.png"],
    pricing: { basePrice: 89.90, ourPrice: 64.90, discountPrice: 59.90 },
    badge: "ESPECIAL",
    publico: "Feminino"
  },
  {
    id: "wepink-le-grand-club-sweet-lady-100ml",
    nome: "WEPINK Le Grand Club Sweet Lady",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Floral Doce",
    descricao: "Perfume feminino doce e sofisticado da linha premium",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_18_le-grand-club-sweet-lady-desodorante-colônia-10-wepink_feminino.png"],
    pricing: { basePrice: 89.90, ourPrice: 64.90, discountPrice: 59.90 },
    badge: "PREMIUM",
    publico: "Feminino"
  },
  {
    id: "wepink-queen-pink-desodorante-colonia-100ml",
    nome: "WEPINK Queen Pink Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Floral Frutal",
    descricao: "Perfume feminino com personalidade marcante e notas florais vibrantes",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_26_queen-pink-desodorante-colônia-10-wepink_feminino.png"],
    pricing: { basePrice: 79.90, ourPrice: 56.90, discountPrice: 52.90 },
    badge: "BESTSELLER",
    publico: "Feminino"
  },
  {
    id: "wepink-scarlette-desodorante-colonia-50ml",
    nome: "WEPINK Scarlette Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "50ml",
    familia_olfativa: "Floral Oriental",
    descricao: "Perfume feminino sofisticado com notas orientais marcantes",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_28_scarlette-desodorante-colônia-5-wepink_feminino.png"],
    pricing: { basePrice: 59.90, ourPrice: 42.90, discountPrice: 39.90 },
    badge: "PREMIUM",
    publico: "Feminino"
  },
  {
    id: "wepink-vf-bloom-desodorante-colonia-70ml",
    nome: "WEPINK VF Bloom Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "70ml",
    familia_olfativa: "Floral Delicada",
    descricao: "Perfume feminino com fragrância floral suave e envolvente",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_30_vf-bloom-desodorante-colônia-7-wepink_feminino.png"],
    pricing: { basePrice: 69.90, ourPrice: 49.90, discountPrice: 44.90 },
    badge: "DELICADA",
    publico: "Feminino"
  },
  {
    id: "wepink-vf-seduce-desodorante-colonia-70ml",
    nome: "WEPINK VF Seduce Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "70ml",
    familia_olfativa: "Oriental Sedutora",
    descricao: "Perfume feminino sedutor com notas orientais envolventes",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_31_vf-seduce-desodorante-colônia-7-wepink_feminino.png"],
    pricing: { basePrice: 69.90, ourPrice: 49.90, discountPrice: 44.90 },
    badge: "SEDUTORA",
    publico: "Feminino"
  },

  // LINHA MASCULINA (12 produtos)
  {
    id: "wepink-bourbon-desodorante-colonia-100ml",
    nome: "WEPINK Bourbon Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Amadeirada",
    descricao: "Perfume masculino clássico com notas amadeiradas marcantes",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_2_bourbon-desodorante-colônia-10-wepink-masculino_masculino.png"],
    pricing: { basePrice: 79.90, ourPrice: 56.90, discountPrice: 52.90 },
    badge: "CLÁSSICO",
    publico: "Masculino"
  },
  {
    id: "wepink-bourbon-premium-desodorante-colonia-100ml",
    nome: "WEPINK Bourbon Premium Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Amadeirada Premium",
    descricao: "Versão premium do clássico Bourbon com maior concentração",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_3_bourbon-desodorante-colônia-10-wepink-masculino(1)_masculino.png"],
    pricing: { basePrice: 99.90, ourPrice: 72.90, discountPrice: 69.90 },
    badge: "PREMIUM",
    publico: "Masculino"
  },
  {
    id: "wepink-bourbon-silver-desodorante-colonia-100ml",
    nome: "WEPINK Bourbon Silver Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Amadeirada Fresh",
    descricao: "Versão moderna do Bourbon com toque refrescante",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_4_bourbon-silver-desodorante-colônia-10-wepink-masculino_masculino.png"],
    pricing: { basePrice: 79.90, ourPrice: 56.90, discountPrice: 52.90 },
    badge: "MODERNO",
    publico: "Masculino"
  },
  {
    id: "wepink-heaven-groom-desodorante-colonia-100ml",
    nome: "WEPINK Heaven Groom Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Amadeirada Elegante",
    descricao: "Perfume especial para noivos com fragrância elegante e sofisticada",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_11_heaven-groom-desodorante-colônia-10-wepink-masculino_masculino.png"],
    pricing: { basePrice: 89.90, ourPrice: 64.90, discountPrice: 59.90 },
    badge: "ESPECIAL",
    publico: "Masculino"
  },
  {
    id: "wepink-king-blue-desodorante-colonia-100ml",
    nome: "WEPINK King Blue Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Aquática Fresca",
    descricao: "Perfume masculino com notas aquáticas refrescantes",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_17_king-blue-desodorante-colônia-10-wepink-masculino_masculino.png"],
    pricing: { basePrice: 79.90, ourPrice: 56.90, discountPrice: 52.90 },
    badge: "REFRESCANTE",
    publico: "Masculino"
  },
  {
    id: "wepink-king-blue-deep-desodorante-colonia-100ml",
    nome: "WEPINK King Blue Deep Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Aquática Amadeirada",
    descricao: "Versão intensa do King Blue com notas amadeiradas profundas",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_15_king-blue-deep-desodorante-colônia-10-wepink-masculino_masculino.png"],
    pricing: { basePrice: 89.90, ourPrice: 64.90, discountPrice: 59.90 },
    badge: "INTENSO",
    publico: "Masculino"
  },
  {
    id: "wepink-king-blue-deep-premium-desodorante-colonia-100ml",
    nome: "WEPINK King Blue Deep Premium Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Aquática Amadeirada Premium",
    descricao: "Versão premium do King Blue Deep com maior concentração",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_16_king-blue-deep-desodorante-colônia-10-wepink-masculino(1)_masculino.png"],
    pricing: { basePrice: 99.90, ourPrice: 72.90, discountPrice: 69.90 },
    badge: "PREMIUM",
    publico: "Masculino"
  },
  {
    id: "wepink-lion-blanc-desodorante-colonia-100ml",
    nome: "WEPINK Lion Blanc Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Amadeirada Fresca",
    descricao: "Perfume masculino sofisticado com notas amadeiradas e frescas",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_20_lion-blanc-desodorante-colônia-10-wepink-masculino_masculino.png"],
    pricing: { basePrice: 89.90, ourPrice: 64.90, discountPrice: 59.90 },
    badge: "SOFISTICADO",
    publico: "Masculino"
  },
  {
    id: "wepink-lion-noir-desodorante-colonia-100ml",
    nome: "WEPINK Lion Noir Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Oriental Amadeirada",
    descricao: "Perfume masculino intenso com notas orientais e amadeiradas",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_21_lion-noir-desodorante-colônia-10-wepink-masculino_masculino.png"],
    pricing: { basePrice: 89.90, ourPrice: 64.90, discountPrice: 59.90 },
    badge: "INTENSO",
    publico: "Masculino"
  },
  {
    id: "wepink-lion-noir-premium-desodorante-colonia-100ml",
    nome: "WEPINK Lion Noir Premium Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Oriental Amadeirada Premium",
    descricao: "Versão premium do Lion Noir com maior concentração",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_22_lion-noir-desodorante-colônia-10-wepink-masculino(1)_masculino.png"],
    pricing: { basePrice: 99.90, ourPrice: 72.90, discountPrice: 69.90 },
    badge: "PREMIUM",
    publico: "Masculino"
  },
  {
    id: "wepink-pureblixx-darkest-desodorante-colonia-100ml",
    nome: "WEPINK Pureblixx Darkest Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Oriental Intensa",
    descricao: "Perfume masculino com fragrância oriental intensa e marcante",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_25_pureblixx-darkest-desodorante-colônia-10-wepink-masculino_masculino.png"],
    pricing: { basePrice: 89.90, ourPrice: 64.90, discountPrice: 59.90 },
    badge: "MARCANTE",
    publico: "Masculino"
  },
  {
    id: "wepink-red-obsidian-desodorante-colonia-100ml",
    nome: "WEPINK Red Obsidian Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Oriental Especiada",
    descricao: "Perfume masculino com notas especiadas e orientais envolventes",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_27_red-obsidian-desodorante-colônia-10-wepink-masculino_masculino.png"],
    pricing: { basePrice: 89.90, ourPrice: 64.90, discountPrice: 59.90 },
    badge: "ESPECIADO",
    publico: "Masculino"
  },

  // LINHA UNISSEX (10 produtos)
  {
    id: "wepink-celebrate-relics-desodorante-colonia-100ml",
    nome: "WEPINK Celebrate Relics Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Oriental Unissex",
    descricao: "Perfume unissex para celebrações especiais com notas orientais",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_5_celebrate-relics-desodorante-colônia-10-wepink_unissex.png"],
    pricing: { basePrice: 79.90, ourPrice: 56.90, discountPrice: 52.90 },
    badge: "CELEBRAÇÃO",
    publico: "Unissex"
  },
  {
    id: "wepink-crave-desodorante-colonia-100ml",
    nome: "WEPINK Crave Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Oriental Moderna",
    descricao: "Perfume unissex com personalidade moderna e notas orientais",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_6_crave-desodorante-colônia-10-wepink_unissex.png"],
    pricing: { basePrice: 79.90, ourPrice: 56.90, discountPrice: 52.90 },
    badge: "MODERNO",
    publico: "Unissex"
  },
  {
    id: "wepink-divine-desodorante-colonia-100ml",
    nome: "WEPINK Divine Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Aquática Fresca",
    descricao: "Perfume unissex divino com notas aquáticas refrescantes",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_7_divine-desodorante-colônia-10-wepink_unissex.png"],
    pricing: { basePrice: 79.90, ourPrice: 56.90, discountPrice: 52.90 },
    badge: "DIVINO",
    publico: "Unissex"
  },
  {
    id: "wepink-fatal-rouge-desodorante-colonia-100ml",
    nome: "WEPINK Fatal Rouge Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Oriental Intensa",
    descricao: "Perfume unissex fatal com notas orientais intensas e sedutoras",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_9_fatal-rouge-desodorante-colônia-100-ml-wepink_unissex.png"],
    pricing: { basePrice: 89.90, ourPrice: 64.90, discountPrice: 59.90 },
    badge: "SEDUTOR",
    publico: "Unissex"
  },
  {
    id: "wepink-infinity-cosmik-desodorante-colonia-70ml",
    nome: "WEPINK Infinity Cosmik Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "70ml",
    familia_olfativa: "Cósmica Moderna",
    descricao: "Perfume unissex da linha cósmica com fragrância futurística",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_12_infinity-cosmik-desodorante-colônia-7-wepink_unissex.png"],
    pricing: { basePrice: 69.90, ourPrice: 49.90, discountPrice: 44.90 },
    badge: "FUTURÍSTICO",
    publico: "Unissex"
  },
  {
    id: "wepink-infinity-cosmik-premium-desodorante-colonia-70ml",
    nome: "WEPINK Infinity Cosmik Premium Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "70ml",
    familia_olfativa: "Cósmica Premium",
    descricao: "Versão premium do Infinity Cosmik com maior concentração",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_13_infinity-cosmik-desodorante-colônia-7-wepink(1)_unissex.png"],
    pricing: { basePrice: 79.90, ourPrice: 56.90, discountPrice: 52.90 },
    badge: "PREMIUM",
    publico: "Unissex"
  },
  {
    id: "wepink-infinity-xis-desodorante-colonia-70ml",
    nome: "WEPINK Infinity Xis Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "70ml",
    familia_olfativa: "Moderna Misteriosa",
    descricao: "Perfume unissex misterioso da linha Infinity",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_14_infinity-xis-desodorante-colônia-7-wepink_unissex.png"],
    pricing: { basePrice: 69.90, ourPrice: 49.90, discountPrice: 44.90 },
    badge: "MISTERIOSO",
    publico: "Unissex"
  },
  {
    id: "wepink-liberte-exclusif-desodorante-colonia-100ml",
    nome: "WEPINK Liberté Exclusif Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Floral Frutal",
    descricao: "Perfume unissex exclusivo com liberdade de expressão olfativa",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_19_liberté-exclusif-desodorante-colônia-10-wepink_unissex.png"],
    pricing: { basePrice: 89.90, ourPrice: 64.90, discountPrice: 59.90 },
    badge: "EXCLUSIVO",
    publico: "Unissex"
  },
  {
    id: "wepink-merry-christmas-desodorante-colonia-100ml",
    nome: "WEPINK Merry Christmas Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Especiada Festiva",
    descricao: "Perfume unissex de edição limitada para as festividades natalinas",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_23_merry-christmas-desodorante-colônia-10-wepink_unissex.png"],
    pricing: { basePrice: 89.90, ourPrice: 64.90, discountPrice: 59.90 },
    badge: "EDIÇÃO LIMITADA",
    publico: "Unissex"
  },
  {
    id: "wepink-merry-christmas-premium-desodorante-colonia-100ml",
    nome: "WEPINK Merry Christmas Premium Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Especiada Premium",
    descricao: "Versão premium do Merry Christmas com embalagem especial",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_24_merry-christmas-desodorante-colônia-10-wepink(1)_unissex.png"],
    pricing: { basePrice: 99.90, ourPrice: 72.90, discountPrice: 69.90 },
    badge: "PREMIUM",
    publico: "Unissex"
  },
  {
    id: "wepink-the-rainy-desodorante-colonia-70ml",
    nome: "WEPINK The Rainy Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "70ml",
    familia_olfativa: "Aquática Fresca",
    descricao: "Perfume unissex inspirado na chuva com notas aquáticas",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_29_the-rainy-desodorante-colônia-7-wepink_unissex.png"],
    pricing: { basePrice: 69.90, ourPrice: 49.90, discountPrice: 44.90 },
    badge: "INSPIRADOR",
    publico: "Unissex"
  },
  {
    id: "wepink-wonderful-desodorante-colonia-100ml",
    nome: "WEPINK Wonderful Desodorante Colônia",
    marca: "WEPINK",
    tipo: "Desodorante Colônia",
    volume: "100ml",
    familia_olfativa: "Floral Frutal",
    descricao: "Perfume unissex maravilhoso com notas florais e frutais",
    categoria: "perfumes",
    subcategoria: "desodorante-colonia",
    images: ["/images/products/perfumes/perfume_32_wonderful-desodorante-colônia-10-wepink_unissex.png"],
    pricing: { basePrice: 79.90, ourPrice: 56.90, discountPrice: 52.90 },
    badge: "MARAVILHOSO",
    publico: "Unissex"
  },

  // LINHA INFANTIL (1 produto)
  {
    id: "wepink-fantasy-kids-blue-dragon-colonia-infantil-100ml",
    nome: "WEPINK Fantasy Kids Blue Dragon Colônia Infantil",
    marca: "WEPINK",
    tipo: "Colônia Infantil",
    volume: "100ml",
    familia_olfativa: "Suave Infantil",
    descricao: "Colônia infantil suave com fragrância delicada para crianças",
    categoria: "perfumes",
    subcategoria: "colonia-infantil",
    images: ["/images/products/perfumes/perfume_8_fantasy-kids-blue-dragon-colônia-10-wepink_unissex.png"],
    pricing: { basePrice: 49.90, ourPrice: 35.90, discountPrice: 32.90 },
    badge: "INFANTIL",
    publico: "Infantil"
  }
];

// Função para obter perfumes por público
export function getPerfumesByPublico(publico: string): PerfumeWepink[] {
  return perfumesWepink.filter(perfume => perfume.publico.toLowerCase() === publico.toLowerCase());
}

// Função para obter perfume por ID
export function getPerfumeById(id: string): PerfumeWepink | undefined {
  return perfumesWepink.find(perfume => perfume.id === id);
}

// Função para obter perfumes por família olfativa
export function getPerfumesByFamilia(familia: string): PerfumeWepink[] {
  return perfumesWepink.filter(perfume => perfume.familia_olfativa.toLowerCase().includes(familia.toLowerCase()));
}

// Função para obter perfumes por volume
export function getPerfumesByVolume(volume: string): PerfumeWepink[] {
  return perfumesWepink.filter(perfume => perfume.volume === volume);
}

// Função para obter todos os públicos
export function getAllPublicos(): string[] {
  return [...new Set(perfumesWepink.map(perfume => perfume.publico))];
}

// Função para obter todas as famílias olfativas
export function getAllFamiliasOlfativas(): string[] {
  return [...new Set(perfumesWepink.map(perfume => perfume.familia_olfativa))];
}

// Exportar todos os perfumes
export const allPerfumesWepink = perfumesWepink;