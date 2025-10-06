/**
 * JC Hair Studio's 62 - Perfumes O Boticário
 * Catálogo completo de perfumes O Boticário brasileiros
 * Baseado na análise detalhada dos rótulos e frascos REAIS
 * Produtos autênticos com imagens dos rótulos originais
 */

export interface PerfumeOBoticario {
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
    savings: number;
  };
  badge: string;
  publico: string;
  cor?: string;
  familiaCorr?: string;
}

// Perfumes O Boticário - Coleção Completa
export const perfumesOBoticario: PerfumeOBoticario[] = [
  // LINHA FEMININA EAU DE TOILETTE
  {
    id: "boticario-acqua-fresca-edt-100ml",
    nome: "Acqua Fresca Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "100ml",
    familia_olfativa: "Floral Aquática",
    descricao: "Fragrância feminina fresca e leve com notas aquáticas e florais",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Acqua Fresca Eau de Toilette, 100ml.png"],
    pricing: { basePrice: 89.90, ourPrice: 69.90, discountPrice: 64.90, savings: 25.00 },
    badge: "REFRESCANTE",
    publico: "Feminino"
  },
  {
    id: "boticario-anni-edt-100ml",
    nome: "Anni Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "100ml",
    familia_olfativa: "Floral Frutal",
    descricao: "Perfume feminino jovem e vibrante com notas florais e frutais",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Anni Eau de Toilette, 100ml.png"],
    pricing: { basePrice: 79.90, ourPrice: 59.90, discountPrice: 54.90, savings: 25.00 },
    badge: "JOVEM",
    publico: "Feminino"
  },
  {
    id: "boticario-anni-sweety-edt-100ml",
    nome: "Anni Sweety Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "100ml",
    familia_olfativa: "Floral Doce",
    descricao: "Versão doce e delicada do Anni com notas açucaradas",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Anni Sweety Eau de Toilette, 100ml.png"],
    pricing: { basePrice: 79.90, ourPrice: 59.90, discountPrice: 54.90, savings: 25.00 },
    badge: "DOCE",
    publico: "Feminino"
  },
  {
    id: "boticario-celebre-edt-feminino-100ml",
    nome: "Celebre Eau de Toilette Feminino",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "100ml",
    familia_olfativa: "Oriental Floral",
    descricao: "Perfume feminino elegante para celebrar momentos especiais",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Celebre Eau de Toilette Feminino, 100ml.png"],
    pricing: { basePrice: 89.90, ourPrice: 69.90, discountPrice: 64.90, savings: 25.00 },
    badge: "ELEGANTE",
    publico: "Feminino"
  },
  {
    id: "boticario-coffee-woman-edt-100ml",
    nome: "Coffee Woman Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "100ml",
    familia_olfativa: "Oriental Gourmand",
    descricao: "Perfume feminino sofisticado com notas de café e baunilha",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Coffee Woman Eau de Toilette, 100ml.png"],
    pricing: { basePrice: 99.90, ourPrice: 79.90, discountPrice: 74.90, savings: 25.00 },
    badge: "SOFISTICADO",
    publico: "Feminino"
  },
  {
    id: "boticario-coffee-woman-duo-edt-100ml",
    nome: "Coffee Woman Duo Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "100ml",
    familia_olfativa: "Oriental Gourmand Intenso",
    descricao: "Versão dupla do Coffee Woman com maior intensidade",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Coffee Woman Duo Eau de Toilette 100ml.png"],
    pricing: { basePrice: 109.90, ourPrice: 89.90, discountPrice: 84.90, savings: 25.00 },
    badge: "INTENSO",
    publico: "Feminino"
  },
  {
    id: "boticario-coffee-woman-seduction-edt-100ml",
    nome: "Coffee Woman Seduction Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "100ml",
    familia_olfativa: "Oriental Sedutor",
    descricao: "Coffee Woman com toque sedutor e envolvente",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Coffee Woman Seduction Eau de Toilette, 100ml.png"],
    pricing: { basePrice: 109.90, ourPrice: 89.90, discountPrice: 84.90, savings: 25.00 },
    badge: "SEDUTOR",
    publico: "Feminino"
  },
  {
    id: "boticario-egeo-dolce-edt-90ml",
    nome: "Egeo Dolce Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "90ml",
    familia_olfativa: "Floral Frutal Doce",
    descricao: "Perfume feminino doce e irresistível da linha Egeo",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Egeo Dolce Eau de Toilette, 90ml.png"],
    pricing: { basePrice: 79.90, ourPrice: 59.90, discountPrice: 54.90, savings: 25.00 },
    badge: "IRRESISTÍVEL",
    publico: "Feminino"
  },
  {
    id: "boticario-egeo-vanilla-vibe-edt-90ml",
    nome: "Egeo Vanilla Vibe Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "90ml",
    familia_olfativa: "Oriental Baunilha",
    descricao: "Fragrância vibrante com notas marcantes de baunilha",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Egeo Vanilla Vibe Eau de Toilette, 90ml.png"],
    pricing: { basePrice: 79.90, ourPrice: 59.90, discountPrice: 54.90, savings: 25.00 },
    badge: "VIBRANTE",
    publico: "Feminino"
  },
  {
    id: "boticario-floratta-blue-edt-75ml",
    nome: "Floratta Blue Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "75ml",
    familia_olfativa: "Floral Aquático",
    descricao: "Floratta em versão azul com notas aquáticas refrescantes",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Floratta Blue Eau de Toilette, 75ml.png"],
    pricing: { basePrice: 89.90, ourPrice: 69.90, discountPrice: 64.90, savings: 25.00 },
    badge: "AQUÁTICO",
    publico: "Feminino"
  },
  {
    id: "boticario-floratta-cerejeira-edt-75ml",
    nome: "Floratta Cerejeira em Flor Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "75ml",
    familia_olfativa: "Floral Delicado",
    descricao: "Perfume delicado inspirado nas flores de cerejeira",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Floratta Cerejeira em Flor Eau de Toilette, 75ml.png"],
    pricing: { basePrice: 89.90, ourPrice: 69.90, discountPrice: 64.90, savings: 25.00 },
    badge: "DELICADO",
    publico: "Feminino"
  },
  {
    id: "boticario-floratta-lamore-edt-75ml",
    nome: "Floratta L'Amore Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "75ml",
    familia_olfativa: "Floral Romântico",
    descricao: "Floratta romântico dedicado ao amor com notas florais envolventes",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Floratta L_Amore Eau de Toilette, 75ml.png"],
    pricing: { basePrice: 89.90, ourPrice: 69.90, discountPrice: 64.90, savings: 25.00 },
    badge: "ROMÂNTICO",
    publico: "Feminino"
  },
  {
    id: "boticario-floratta-love-flower-edt-75ml",
    nome: "Floratta Love Flower Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "75ml",
    familia_olfativa: "Floral Primaveril",
    descricao: "Perfume floral vibrante como flores da primavera",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Floratta Love Flower Eau de Toilette, 75ml.png"],
    pricing: { basePrice: 89.90, ourPrice: 69.90, discountPrice: 64.90, savings: 25.00 },
    badge: "PRIMAVERIL",
    publico: "Feminino"
  },
  {
    id: "boticario-floratta-my-blue-edt-75ml",
    nome: "Floratta My Blue Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "75ml",
    familia_olfativa: "Floral Azul",
    descricao: "Versão especial do Floratta com personalidade única",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Floratta My Blue Eau de Toilette, 75ml.png"],
    pricing: { basePrice: 89.90, ourPrice: 69.90, discountPrice: 64.90, savings: 25.00 },
    badge: "ÚNICO",
    publico: "Feminino"
  },
  {
    id: "boticario-glamour-edt-75ml",
    nome: "Glamour Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "75ml",
    familia_olfativa: "Floral Oriental",
    descricao: "Perfume glamouroso e sofisticado para mulheres modernas",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Glamour Eau de Toilette, 75ml.png"],
    pricing: { basePrice: 89.90, ourPrice: 69.90, discountPrice: 64.90, savings: 25.00 },
    badge: "GLAMOUROSO",
    publico: "Feminino"
  },
  {
    id: "boticario-glamour-diva-edt-75ml",
    nome: "Glamour Diva Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "75ml",
    familia_olfativa: "Oriental Diva",
    descricao: "Versão diva do Glamour para mulheres poderosas",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Glamour Diva Eau de Toilette, 75 ml.png"],
    pricing: { basePrice: 89.90, ourPrice: 69.90, discountPrice: 64.90, savings: 25.00 },
    badge: "PODEROSO",
    publico: "Feminino"
  },
  {
    id: "boticario-glamour-secrets-black-edt-75ml",
    nome: "Glamour Secrets Black Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "75ml",
    familia_olfativa: "Oriental Misteriosa",
    descricao: "Glamour em versão black misteriosa e sedutora",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Glamour Secrets Black Eau de Toilette 75ml.png"],
    pricing: { basePrice: 89.90, ourPrice: 69.90, discountPrice: 64.90, savings: 25.00 },
    badge: "MISTERIOSO",
    publico: "Feminino"
  },
  {
    id: "boticario-liz-edt-100ml",
    nome: "Liz Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "100ml",
    familia_olfativa: "Floral Clássico",
    descricao: "Perfume feminino clássico e atemporal",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Liz Eau de Toilette, 100ml.png"],
    pricing: { basePrice: 79.90, ourPrice: 59.90, discountPrice: 54.90, savings: 25.00 },
    badge: "CLÁSSICO",
    publico: "Feminino"
  },
  {
    id: "boticario-liz-sublime-edt-100ml",
    nome: "Liz Sublime Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "100ml",
    familia_olfativa: "Floral Sublime",
    descricao: "Versão sublime do clássico Liz com maior sofisticação",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Liz Sublime Eau de Toilette, 100ml.png"],
    pricing: { basePrice: 89.90, ourPrice: 69.90, discountPrice: 64.90, savings: 25.00 },
    badge: "SUBLIME",
    publico: "Feminino"
  },
  {
    id: "boticario-thaty-edt-100ml",
    nome: "Thaty Eau de Toilette",
    marca: "O Boticário",
    tipo: "Eau de Toilette",
    volume: "100ml",
    familia_olfativa: "Floral Jovem",
    descricao: "Perfume feminino jovem e descontraído",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Thaty Eau de Toilette, 100ml.png"],
    pricing: { basePrice: 69.90, ourPrice: 49.90, discountPrice: 44.90, savings: 25.00 },
    badge: "DESCONTRAÍDO",
    publico: "Feminino"
  },

  // LINHA FEMININA EAU DE PARFUM
  {
    id: "boticario-desobediente-edp-100ml",
    nome: "Eau de Parfum Desobediente",
    marca: "O Boticário",
    tipo: "Eau de Parfum",
    volume: "100ml",
    familia_olfativa: "Oriental Ousado",
    descricao: "Perfume ousado para mulheres que não seguem regras",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Eau de Parfum Desobediente, 100ml.png"],
    pricing: { basePrice: 129.90, ourPrice: 99.90, discountPrice: 94.90, savings: 35.00 },
    badge: "OUSADO",
    publico: "Feminino"
  },
  {
    id: "boticario-elysee-edp-50ml",
    nome: "Elysée Eau de Parfum",
    marca: "O Boticário",
    tipo: "Eau de Parfum",
    volume: "50ml",
    familia_olfativa: "Floral Sofisticado",
    descricao: "Perfume premium sofisticado da linha Elysée",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Elysée Eau de Parfum, 50ml.png"],
    pricing: { basePrice: 119.90, ourPrice: 89.90, discountPrice: 84.90, savings: 35.00 },
    badge: "PREMIUM",
    publico: "Feminino"
  },
  {
    id: "boticario-elysee-blanc-edp-50ml",
    nome: "Elysée Blanc Eau de Parfum",
    marca: "O Boticário",
    tipo: "Eau de Parfum",
    volume: "50ml",
    familia_olfativa: "Floral Branco",
    descricao: "Elysée em versão branca delicada e pura",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Elysée Blanc Eau de Parfum, 50ml.png"],
    pricing: { basePrice: 119.90, ourPrice: 89.90, discountPrice: 84.90, savings: 35.00 },
    badge: "PURO",
    publico: "Feminino"
  },
  {
    id: "boticario-elysee-nuit-edp-50ml",
    nome: "Elysée Nuit Eau de Parfum",
    marca: "O Boticário",
    tipo: "Eau de Parfum",
    volume: "50ml",
    familia_olfativa: "Oriental Noturno",
    descricao: "Elysée noturno para noites especiais",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Elysée Nuit Eau de Parfum, 50ml.png"],
    pricing: { basePrice: 119.90, ourPrice: 89.90, discountPrice: 84.90, savings: 35.00 },
    badge: "NOTURNO",
    publico: "Feminino"
  },
  {
    id: "boticario-elysee-succes-edp-50ml",
    nome: "Elysée Succès Eau de Parfum",
    marca: "O Boticário",
    tipo: "Eau de Parfum",
    volume: "50ml",
    familia_olfativa: "Chypre Amadeirado",
    descricao: "Elysée do sucesso para mulheres vencedoras",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Elysée Succès Eau de Parfum, 50ml.png"],
    pricing: { basePrice: 119.90, ourPrice: 89.90, discountPrice: 84.90, savings: 35.00 },
    badge: "VENCEDOR",
    publico: "Feminino"
  },
  {
    id: "boticario-floratta-fleur-supreme-edp-75ml",
    nome: "Floratta Fleur Suprême Eau de Parfum",
    marca: "O Boticário",
    tipo: "Eau de Parfum",
    volume: "75ml",
    familia_olfativa: "Floral Supremo",
    descricao: "Floratta em versão Parfum suprema e luxuosa",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Floratta Fleur Suprême Eau de Parfum, 75ml.png"],
    pricing: { basePrice: 129.90, ourPrice: 99.90, discountPrice: 94.90, savings: 35.00 },
    badge: "LUXUOSO",
    publico: "Feminino"
  },
  {
    id: "boticario-lily-edp-75ml",
    nome: "Lily Eau de Parfum",
    marca: "O Boticário",
    tipo: "Eau de Parfum",
    volume: "75ml",
    familia_olfativa: "Floral Lírio",
    descricao: "Perfume premium com notas de lírio puro e elegante",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Lily Eau de Parfum, 75ml.png"],
    pricing: { basePrice: 129.90, ourPrice: 99.90, discountPrice: 94.90, savings: 35.00 },
    badge: "ELEGANTE",
    publico: "Feminino"
  },
  {
    id: "boticario-lily-absolu-edp-75ml",
    nome: "Lily Absolu Eau De Parfum",
    marca: "O Boticário",
    tipo: "Eau de Parfum",
    volume: "75ml",
    familia_olfativa: "Floral Absoluto",
    descricao: "Lily em versão absoluta com máxima concentração",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Lily Absolu Eau De Parfum, 75ml.png"],
    pricing: { basePrice: 139.90, ourPrice: 109.90, discountPrice: 104.90, savings: 35.00 },
    badge: "ABSOLUTO",
    publico: "Feminino"
  },
  {
    id: "boticario-lily-lumiere-edp-75ml",
    nome: "Lily Lumière Eau de Parfum",
    marca: "O Boticário",
    tipo: "Eau de Parfum",
    volume: "75ml",
    familia_olfativa: "Floral Luminoso",
    descricao: "Lily luminoso que brilha como luz",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Lily Lumière Eau de Parfum, 75ml.png"],
    pricing: { basePrice: 129.90, ourPrice: 99.90, discountPrice: 94.90, savings: 35.00 },
    badge: "LUMINOSO",
    publico: "Feminino"
  },
  {
    id: "boticario-love-lily-edp-75ml",
    nome: "Love Lily Eau de Parfum",
    marca: "O Boticário",
    tipo: "Eau de Parfum",
    volume: "75ml",
    familia_olfativa: "Floral Romântico",
    descricao: "Lily do amor com notas românticas e envolventes",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Love Lily Eau de Parfum, 75ml.png"],
    pricing: { basePrice: 129.90, ourPrice: 99.90, discountPrice: 94.90, savings: 35.00 },
    badge: "ROMÂNTICO",
    publico: "Feminino"
  },

  // BODY SPLASHES
  {
    id: "boticario-cuide-se-bem-pessegura-body-splash-200ml",
    nome: "Body Splash Cuide-se Bem Pessegura",
    marca: "O Boticário",
    tipo: "Body Splash",
    volume: "200ml",
    familia_olfativa: "Frutal Pêssego",
    descricao: "Body splash refrescante com fragrância de pêssego",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Body Splash Cuide-se Bem Pessegura, 200ml.png"],
    pricing: { basePrice: 49.90, ourPrice: 34.90, discountPrice: 29.90, savings: 20.00 },
    badge: "REFRESCANTE",
    publico: "Feminino"
  },
  {
    id: "boticario-nativa-spa-ameixa-body-splash-200ml",
    nome: "Body Splash Nativa Spa Ameixa",
    marca: "O Boticário",
    tipo: "Body Splash",
    volume: "200ml",
    familia_olfativa: "Frutal Ameixa",
    descricao: "Body splash Nativa Spa com fragrância de ameixa",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Body Splash Nativa Spa Ameixa, 200ml.png"],
    pricing: { basePrice: 54.90, ourPrice: 39.90, discountPrice: 34.90, savings: 20.00 },
    badge: "SPA",
    publico: "Feminino"
  },
  {
    id: "boticario-nativa-spa-ameixa-negra-body-splash-200ml",
    nome: "Body Splash Nativa Spa Ameixa Negra",
    marca: "O Boticário",
    tipo: "Body Splash",
    volume: "200ml",
    familia_olfativa: "Frutal Ameixa Negra",
    descricao: "Body splash Nativa Spa com ameixa negra sofisticada",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Body Splash Nativa Spa Ameixa Negra, 200ml.png"],
    pricing: { basePrice: 54.90, ourPrice: 39.90, discountPrice: 34.90, savings: 20.00 },
    badge: "SOFISTICADO",
    publico: "Feminino"
  },
  {
    id: "boticario-nativa-spa-caviar-body-splash-200ml",
    nome: "Body Splash Nativa Spa Caviar",
    marca: "O Boticário",
    tipo: "Body Splash",
    volume: "200ml",
    familia_olfativa: "Oriental Luxuoso",
    descricao: "Body splash Nativa Spa com fragrância de caviar luxuoso",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Body Splash Nativa Spa Caviar, 200ml.png"],
    pricing: { basePrice: 59.90, ourPrice: 44.90, discountPrice: 39.90, savings: 20.00 },
    badge: "LUXUOSO",
    publico: "Feminino"
  },
  {
    id: "boticario-nativa-spa-morango-ruby-body-splash-200ml",
    nome: "Body Splash Nativa Spa Morango Ruby",
    marca: "O Boticário",
    tipo: "Body Splash",
    volume: "200ml",
    familia_olfativa: "Frutal Morango",
    descricao: "Body splash com fragrância vibrante de morango ruby",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Body Splash Nativa Spa Morango Ruby, 200ml.png"],
    pricing: { basePrice: 54.90, ourPrice: 39.90, discountPrice: 34.90, savings: 20.00 },
    badge: "VIBRANTE",
    publico: "Feminino"
  },
  {
    id: "boticario-nativa-spa-quinoa-body-splash-200ml",
    nome: "Body Splash Nativa Spa Quinoa",
    marca: "O Boticário",
    tipo: "Body Splash",
    volume: "200ml",
    familia_olfativa: "Natural Nutritivo",
    descricao: "Body splash nutritivo com extrato de quinoa",
    categoria: "cosmeticos",
    subcategoria: "perfumes-boticario",
    images: ["/images/products/perfumes-o-boticario/Body Splash Nativa Spa Quinoa, 200ml.png"],
    pricing: { basePrice: 54.90, ourPrice: 39.90, discountPrice: 34.90, savings: 20.00 },
    badge: "NUTRITIVO",
    publico: "Feminino"
  }
];

// Função para obter perfumes por público
export function getPerfumesOBoticarioByPublico(publico: string): PerfumeOBoticario[] {
  return perfumesOBoticario.filter(perfume => perfume.publico.toLowerCase() === publico.toLowerCase());
}

// Função para obter perfume por ID
export function getPerfumeOBoticarioById(id: string): PerfumeOBoticario | undefined {
  return perfumesOBoticario.find(perfume => perfume.id === id);
}

// Função para obter perfumes por tipo
export function getPerfumesOBoticarioByTipo(tipo: string): PerfumeOBoticario[] {
  return perfumesOBoticario.filter(perfume => perfume.tipo.toLowerCase().includes(tipo.toLowerCase()));
}

// Função para obter perfumes por família olfativa
export function getPerfumesOBoticarioByFamilia(familia: string): PerfumeOBoticario[] {
  return perfumesOBoticario.filter(perfume => perfume.familia_olfativa.toLowerCase().includes(familia.toLowerCase()));
}

// Função para obter todos os tipos
export function getAllTiposOBoticario(): string[] {
  return [...new Set(perfumesOBoticario.map(perfume => perfume.tipo))];
}

// Função para obter todas as famílias olfativas
export function getAllFamiliasOlfativasOBoticario(): string[] {
  return [...new Set(perfumesOBoticario.map(perfume => perfume.familia_olfativa))];
}

// Exportar todos os perfumes
export const allPerfumesOBoticario = perfumesOBoticario;
