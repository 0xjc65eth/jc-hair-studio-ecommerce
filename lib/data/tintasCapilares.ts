/**
 * JC Hair Studio's 62 - Tintas Capilares
 * Catálogo expandido de tintas capilares profissionais
 * Baseado na análise detalhada dos rótulos dos produtos REAIS
 * Caminhos de imagens atualizados com nomes reais dos arquivos
 */

export interface TintaCapilar {
  id: string;
  nome: string;
  marca: string;
  tom?: string;
  cor: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  images: string[];
  pricing: {
    basePrice: number;
    ourPrice: number;
    discountPrice: number;
  };
  badge?: string;
  acabamento?: string;
  volume?: string;
}

// Tintas Capilares Profissionais - Catálogo Expandido
export const tintasCapilares: TintaCapilar[] = [
  // Biocolor - Tons Escuros
  {
    id: "biocolor-10-preto-azulado",
    nome: "Biocolor Kit Coloração 1.0 Preto Azulado",
    marca: "Biocolor",
    tom: "1.0",
    cor: "Preto Azulado",
    descricao: "Coloração permanente com fórmula hidratante, pronta em 20 minutos",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-permanente",
    images: ["/images/products/produtos_diversos/IMG-8713.png"],
    pricing: {
      basePrice: 42.90,
      ourPrice: 29.90,
      discountPrice: 26.90
    },
    badge: "HIDRATANTE"
  },
  {
    id: "biocolor-20-preto-azulado",
    nome: "Biocolor Kit Coloração 2.0 Preto Azulado",
    marca: "Biocolor",
    tom: "2.0",
    cor: "Preto Azulado",
    descricao: "Coloração permanente com fórmula hidratante, pronta em 20 minutos",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-permanente",
    images: ["/images/products/produtos_diversos/IMG-8716.png"],
    pricing: {
      basePrice: 42.90,
      ourPrice: 29.90,
      discountPrice: 26.90
    },
    badge: "HIDRATANTE"
  },
  {
    id: "biocolor-30-castanho-escuro",
    nome: "Biocolor Kit Coloração 3.0 Castanho Escuro",
    marca: "Biocolor",
    tom: "3.0",
    cor: "Castanho Escuro",
    descricao: "Coloração permanente com fórmula hidratante, pronta em 20 minutos",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-permanente",
    images: ["/images/products/produtos_diversos/IMG-8718.png"],
    pricing: {
      basePrice: 42.90,
      ourPrice: 29.90,
      discountPrice: 26.90
    },
    badge: "HIDRATANTE"
  },
  {
    id: "biocolor-50-castanho-claro",
    nome: "Biocolor Kit Coloração 5.0 Castanho Claro",
    marca: "Biocolor",
    tom: "5.0",
    cor: "Castanho Claro",
    descricao: "Coloração permanente com fórmula hidratante, pronta em 20 minutos",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-permanente",
    images: ["/images/products/produtos_diversos/IMG-8720.png"],
    pricing: {
      basePrice: 42.90,
      ourPrice: 29.90,
      discountPrice: 26.90
    },
    badge: "HIDRATANTE"
  },

  // Wella Soft Color - Sem Amônia
  {
    id: "wella-soft-color-20-preto",
    nome: "Wella Soft Color 20 Preto",
    marca: "Wella",
    tom: "20",
    cor: "Preto",
    descricao: "Coloração sem amônia, vegana, com 92% menos quebra",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-sem-amonia",
    images: ["/images/products/produtos_diversos/IMG-8725.png"],
    pricing: {
      basePrice: 52.90,
      ourPrice: 37.90,
      discountPrice: 34.90
    },
    badge: "SEM AMÔNIA"
  },
  {
    id: "wella-soft-color-40-castanho-medio",
    nome: "Wella Soft Color 40 Castanho Médio",
    marca: "Wella",
    tom: "40",
    cor: "Castanho Médio",
    descricao: "Coloração sem amônia, vegana, com 92% menos quebra",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-sem-amonia",
    images: ["/images/products/produtos_diversos/IMG-8727.png"],
    pricing: {
      basePrice: 52.90,
      ourPrice: 37.90,
      discountPrice: 34.90
    },
    badge: "SEM AMÔNIA"
  },
  {
    id: "wella-soft-color-50-castanho-claro",
    nome: "Wella Soft Color 50 Castanho Claro",
    marca: "Wella",
    tom: "50",
    cor: "Castanho Claro",
    descricao: "Coloração sem amônia, vegana, com 92% menos quebra",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-sem-amonia",
    images: ["/images/products/produtos_diversos/IMG-8733.png"],
    pricing: {
      basePrice: 52.90,
      ourPrice: 37.90,
      discountPrice: 34.90
    },
    badge: "SEM AMÔNIA"
  },
  {
    id: "wella-soft-color-54-castanho-acobreado",
    nome: "Wella Soft Color 54 Castanho Acobreado",
    marca: "Wella",
    tom: "54",
    cor: "Castanho Acobreado",
    descricao: "Coloração sem amônia, vegana, com 92% menos quebra",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-sem-amonia",
    images: ["/images/products/produtos_diversos/IMG-8752.png"],
    pricing: {
      basePrice: 52.90,
      ourPrice: 37.90,
      discountPrice: 34.90
    },
    badge: "SEM AMÔNIA"
  },
  {
    id: "wella-soft-color-415-capuccino",
    nome: "Wella Soft Color 415 Capuccino",
    marca: "Wella",
    tom: "415",
    cor: "Capuccino",
    descricao: "Coloração sem amônia, vegana, com 92% menos quebra",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-sem-amonia",
    images: ["/images/products/produtos_diversos/IMG-8757.png"],
    pricing: {
      basePrice: 52.90,
      ourPrice: 37.90,
      discountPrice: 34.90
    },
    badge: "SEM AMÔNIA"
  },

  // Wella Koleston Perfect - Linha Profissional
  {
    id: "wella-koleston-perfect-60-loiro-escuro",
    nome: "Wella Koleston Perfect 60 Loiro Escuro",
    marca: "Wella",
    tom: "60",
    cor: "Loiro Escuro",
    descricao: "Coloração permanente profissional com 100% cobertura de brancos",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-profissional",
    images: ["/images/products/produtos_diversos/IMG-8768.png"],
    pricing: {
      basePrice: 65.90,
      ourPrice: 45.90,
      discountPrice: 41.90
    },
    badge: "PROFISSIONAL"
  },
  {
    id: "wella-koleston-perfect-77-loiro-dourado",
    nome: "Wella Koleston Perfect 77 Loiro Dourado",
    marca: "Wella",
    tom: "77",
    cor: "Loiro Dourado",
    descricao: "Coloração permanente profissional com 100% cobertura de brancos",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-profissional",
    images: ["/images/products/produtos_diversos/IMG-8780.png"],
    pricing: {
      basePrice: 65.90,
      ourPrice: 45.90,
      discountPrice: 41.90
    },
    badge: "PROFISSIONAL"
  },

  // Alfaparf Alta Moda - Linha Premium
  {
    id: "alfaparf-alta-moda-7-loiro-rubio-medio",
    nome: "Alfaparf Alta Moda 7 Loiro Rubio Médio",
    marca: "Alfaparf",
    tom: "7",
    cor: "Loiro Rubio Médio",
    descricao: "Coloração com pigmentos micronizados para tratamento e cor",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-premium",
    images: ["/images/products/produtos_diversos/IMG-8800.png"],
    pricing: {
      basePrice: 78.90,
      ourPrice: 55.90,
      discountPrice: 49.90
    },
    badge: "PREMIUM"
  },

  // L'Oréal Excellence Creme - Linha Premium
  {
    id: "loreal-excellence-10-preto-natural",
    nome: "L'Oréal Excellence Creme 1.0 Preto Natural",
    marca: "L'Oréal",
    tom: "1.0",
    cor: "Preto Natural",
    descricao: "Coloração permanente com proteção tripla para cabelos sedosos",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-premium",
    images: ["/images/products/produtos_diversos/IMG-8739.png"],
    pricing: {
      basePrice: 68.90,
      ourPrice: 48.90,
      discountPrice: 44.90
    },
    badge: "PREMIUM"
  },
  {
    id: "loreal-excellence-30-castanho-escuro",
    nome: "L'Oréal Excellence Creme 3.0 Castanho Escuro",
    marca: "L'Oréal",
    tom: "3.0",
    cor: "Castanho Escuro",
    descricao: "Coloração permanente com proteção tripla para cabelos sedosos",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-premium",
    images: ["/images/products/produtos_diversos/IMG-8741.png"],
    pricing: {
      basePrice: 68.90,
      ourPrice: 48.90,
      discountPrice: 44.90
    },
    badge: "PREMIUM"
  },
  {
    id: "loreal-excellence-40-castanho-natural",
    nome: "L'Oréal Excellence Creme 4.0 Castanho Natural",
    marca: "L'Oréal",
    tom: "4.0",
    cor: "Castanho Natural",
    descricao: "Coloração permanente com proteção tripla para cabelos sedosos",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-premium",
    images: ["/images/products/produtos_diversos/IMG-8759.png"],
    pricing: {
      basePrice: 68.90,
      ourPrice: 48.90,
      discountPrice: 44.90
    },
    badge: "PREMIUM"
  },
  {
    id: "loreal-excellence-60-loiro-escuro",
    nome: "L'Oréal Excellence Creme 6.0 Loiro Escuro",
    marca: "L'Oréal",
    tom: "6.0",
    cor: "Loiro Escuro",
    descricao: "Coloração permanente com proteção tripla para cabelos sedosos",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-premium",
    images: ["/images/products/produtos_diversos/IMG-8761.png"],
    pricing: {
      basePrice: 68.90,
      ourPrice: 48.90,
      discountPrice: 44.90
    },
    badge: "PREMIUM"
  },

  // Garnier Nutrisse - Linha Nutritiva
  {
    id: "garnier-nutrisse-20-preto-azulado",
    nome: "Garnier Nutrisse 2.0 Preto Azulado",
    marca: "Garnier",
    tom: "2.0",
    cor: "Preto Azulado",
    descricao: "Coloração nutritiva com óleos que nutrem durante a coloração",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-nutritiva",
    images: ["/images/products/produtos_diversos/IMG-8764.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "NUTRITIVA"
  },
  {
    id: "garnier-nutrisse-30-castanho-escuro",
    nome: "Garnier Nutrisse 3.0 Castanho Escuro",
    marca: "Garnier",
    tom: "3.0",
    cor: "Castanho Escuro",
    descricao: "Coloração nutritiva com óleos que nutrem durante a coloração",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-nutritiva",
    images: ["/images/products/produtos_diversos/IMG-8766.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "NUTRITIVA"
  },
  {
    id: "garnier-nutrisse-40-castanho-natural",
    nome: "Garnier Nutrisse 4.0 Castanho Natural",
    marca: "Garnier",
    tom: "4.0",
    cor: "Castanho Natural",
    descricao: "Coloração nutritiva com óleos que nutrem durante a coloração",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-nutritiva",
    images: ["/images/products/produtos_diversos/IMG-8767.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "NUTRITIVA"
  },
  {
    id: "garnier-nutrisse-50-castanho-claro",
    nome: "Garnier Nutrisse 5.0 Castanho Claro",
    marca: "Garnier",
    tom: "5.0",
    cor: "Castanho Claro",
    descricao: "Coloração nutritiva com óleos que nutrem durante a coloração",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-nutritiva",
    images: ["/images/products/produtos_diversos/IMG-8769.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "NUTRITIVA"
  },
  {
    id: "garnier-nutrisse-60-loiro-escuro",
    nome: "Garnier Nutrisse 6.0 Loiro Escuro",
    marca: "Garnier",
    tom: "6.0",
    cor: "Loiro Escuro",
    descricao: "Coloração nutritiva com óleos que nutrem durante a coloração",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-nutritiva",
    images: ["/images/products/produtos_diversos/IMG-8770.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "NUTRITIVA"
  },

  // Schwarzkopf Palette - Linha Intensa
  {
    id: "schwarzkopf-palette-10-preto",
    nome: "Schwarzkopf Palette 1.0 Preto",
    marca: "Schwarzkopf",
    tom: "1.0",
    cor: "Preto",
    descricao: "Coloração intensa e duradoura com tecnologia alemã",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-intensa",
    images: ["/images/products/produtos_diversos/IMG-8774.png"],
    pricing: {
      basePrice: 38.90,
      ourPrice: 27.90,
      discountPrice: 24.90
    },
    badge: "INTENSA"
  },
  {
    id: "schwarzkopf-palette-20-preto-azulado",
    nome: "Schwarzkopf Palette 2.0 Preto Azulado",
    marca: "Schwarzkopf",
    tom: "2.0",
    cor: "Preto Azulado",
    descricao: "Coloração intensa e duradoura com tecnologia alemã",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-intensa",
    images: ["/images/products/produtos_diversos/IMG-8777.png"],
    pricing: {
      basePrice: 38.90,
      ourPrice: 27.90,
      discountPrice: 24.90
    },
    badge: "INTENSA"
  },
  {
    id: "schwarzkopf-palette-30-castanho-escuro",
    nome: "Schwarzkopf Palette 3.0 Castanho Escuro",
    marca: "Schwarzkopf",
    tom: "3.0",
    cor: "Castanho Escuro",
    descricao: "Coloração intensa e duradoura com tecnologia alemã",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-intensa",
    images: ["/images/products/produtos_diversos/IMG-8778.png"],
    pricing: {
      basePrice: 38.90,
      ourPrice: 27.90,
      discountPrice: 24.90
    },
    badge: "INTENSA"
  },

  // Revlon ColorSilk - Linha Seda
  {
    id: "revlon-colorsilk-10-preto",
    nome: "Revlon ColorSilk 10 Preto",
    marca: "Revlon",
    tom: "10",
    cor: "Preto",
    descricao: "Coloração com fórmula de seda para cabelos macios e brilhantes",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-seda",
    images: ["/images/products/produtos_diversos/IMG-8810.png"],
    pricing: {
      basePrice: 35.90,
      ourPrice: 25.90,
      discountPrice: 22.90
    },
    badge: "SEDA"
  },
  {
    id: "revlon-colorsilk-20-preto-azulado",
    nome: "Revlon ColorSilk 20 Preto Azulado",
    marca: "Revlon",
    tom: "20",
    cor: "Preto Azulado",
    descricao: "Coloração com fórmula de seda para cabelos macios e brilhantes",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-seda",
    images: ["/images/products/produtos_diversos/IMG-8819.png"],
    pricing: {
      basePrice: 35.90,
      ourPrice: 25.90,
      discountPrice: 22.90
    },
    badge: "SEDA"
  },
  {
    id: "revlon-colorsilk-30-castanho-escuro",
    nome: "Revlon ColorSilk 30 Castanho Escuro",
    marca: "Revlon",
    tom: "30",
    cor: "Castanho Escuro",
    descricao: "Coloração com fórmula de seda para cabelos macios e brilhantes",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-seda",
    images: ["/images/products/produtos_diversos/IMG-8820.png"],
    pricing: {
      basePrice: 35.90,
      ourPrice: 25.90,
      discountPrice: 22.90
    },
    badge: "SEDA"
  },

  // Clairol Natural Instincts - Linha Natural
  {
    id: "clairol-natural-instincts-4-castanho",
    nome: "Clairol Natural Instincts 4 Castanho",
    marca: "Clairol",
    tom: "4",
    cor: "Castanho",
    descricao: "Coloração semi-permanente com ingredientes naturais",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-semi-permanente",
    images: ["/images/products/produtos_diversos/IMG-8826.png"],
    pricing: {
      basePrice: 42.90,
      ourPrice: 30.90,
      discountPrice: 27.90
    },
    badge: "NATURAL"
  },
  {
    id: "clairol-natural-instincts-5-castanho-claro",
    nome: "Clairol Natural Instincts 5 Castanho Claro",
    marca: "Clairol",
    tom: "5",
    cor: "Castanho Claro",
    descricao: "Coloração semi-permanente com ingredientes naturais",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-semi-permanente",
    images: ["/images/products/produtos_diversos/IMG-8829.png"],
    pricing: {
      basePrice: 42.90,
      ourPrice: 30.90,
      discountPrice: 27.90
    },
    badge: "NATURAL"
  },
  {
    id: "clairol-natural-instincts-6-loiro-escuro",
    nome: "Clairol Natural Instincts 6 Loiro Escuro",
    marca: "Clairol",
    tom: "6",
    cor: "Loiro Escuro",
    descricao: "Coloração semi-permanente com ingredientes naturais",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-semi-permanente",
    images: ["/images/products/produtos_diversos/IMG-8830.png"],
    pricing: {
      basePrice: 42.90,
      ourPrice: 30.90,
      discountPrice: 27.90
    },
    badge: "NATURAL"
  },

  // Matrix SoColor - Linha Profissional Salão
  {
    id: "matrix-socolor-3n-castanho-escuro",
    nome: "Matrix SoColor 3N Castanho Escuro",
    marca: "Matrix",
    tom: "3N",
    cor: "Castanho Escuro",
    descricao: "Coloração profissional para salões com tecnologia avançada",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-profissional-salao",
    images: ["/images/products/produtos_diversos/IMG-8831.png"],
    pricing: {
      basePrice: 72.90,
      ourPrice: 52.90,
      discountPrice: 47.90
    },
    badge: "PROFISSIONAL"
  },
  {
    id: "matrix-socolor-4n-castanho-natural",
    nome: "Matrix SoColor 4N Castanho Natural",
    marca: "Matrix",
    tom: "4N",
    cor: "Castanho Natural",
    descricao: "Coloração profissional para salões com tecnologia avançada",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-profissional-salao",
    images: ["/images/products/produtos_diversos/IMG-8832.png"],
    pricing: {
      basePrice: 72.90,
      ourPrice: 52.90,
      discountPrice: 47.90
    },
    badge: "PROFISSIONAL"
  },
  {
    id: "matrix-socolor-5n-castanho-claro",
    nome: "Matrix SoColor 5N Castanho Claro",
    marca: "Matrix",
    tom: "5N",
    cor: "Castanho Claro",
    descricao: "Coloração profissional para salões com tecnologia avançada",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-profissional-salao",
    images: ["/images/products/produtos_diversos/IMG-8845.png"],
    pricing: {
      basePrice: 72.90,
      ourPrice: 52.90,
      discountPrice: 47.90
    },
    badge: "PROFISSIONAL"
  },
  {
    id: "matrix-socolor-6n-loiro-escuro",
    nome: "Matrix SoColor 6N Loiro Escuro",
    marca: "Matrix",
    tom: "6N",
    cor: "Loiro Escuro",
    descricao: "Coloração profissional para salões com tecnologia avançada",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-profissional-salao",
    images: ["/images/products/produtos_diversos/IMG-8846.png"],
    pricing: {
      basePrice: 72.90,
      ourPrice: 52.90,
      discountPrice: 47.90
    },
    badge: "PROFISSIONAL"
  },

  // Redken Color Extend - Linha Premium Salão
  {
    id: "redken-color-extend-2n-preto",
    nome: "Redken Color Extend 2N Preto",
    marca: "Redken",
    tom: "2N",
    cor: "Preto",
    descricao: "Coloração profissional premium com proteção da cor prolongada",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-premium-salao",
    images: ["/images/products/produtos_diversos/IMG-8852.png"],
    pricing: {
      basePrice: 85.90,
      ourPrice: 62.90,
      discountPrice: 57.90
    },
    badge: "PREMIUM"
  },
  {
    id: "redken-color-extend-3n-castanho-escuro",
    nome: "Redken Color Extend 3N Castanho Escuro",
    marca: "Redken",
    tom: "3N",
    cor: "Castanho Escuro",
    descricao: "Coloração profissional premium com proteção da cor prolongada",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-premium-salao",
    images: ["/images/products/produtos_diversos/IMG-8853.png"],
    pricing: {
      basePrice: 85.90,
      ourPrice: 62.90,
      discountPrice: 57.90
    },
    badge: "PREMIUM"
  },
  {
    id: "redken-color-extend-4n-castanho-natural",
    nome: "Redken Color Extend 4N Castanho Natural",
    marca: "Redken",
    tom: "4N",
    cor: "Castanho Natural",
    descricao: "Coloração profissional premium com proteção da cor prolongada",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-premium-salao",
    images: ["/images/products/produtos_diversos/IMG-8855.png"],
    pricing: {
      basePrice: 85.90,
      ourPrice: 62.90,
      discountPrice: 57.90
    },
    badge: "PREMIUM"
  },

  // Paul Mitchell The Color - Linha Exclusiva
  {
    id: "paul-mitchell-the-color-3n-castanho-escuro",
    nome: "Paul Mitchell The Color 3N Castanho Escuro",
    marca: "Paul Mitchell",
    tom: "3N",
    cor: "Castanho Escuro",
    descricao: "Coloração exclusiva com tecnologia de preservação da cor",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-exclusiva",
    images: ["/images/products/produtos_diversos/IMG-8857.png"],
    pricing: {
      basePrice: 92.90,
      ourPrice: 68.90,
      discountPrice: 62.90
    },
    badge: "EXCLUSIVA"
  },
  {
    id: "paul-mitchell-the-color-4n-castanho-natural",
    nome: "Paul Mitchell The Color 4N Castanho Natural",
    marca: "Paul Mitchell",
    tom: "4N",
    cor: "Castanho Natural",
    descricao: "Coloração exclusiva com tecnologia de preservação da cor",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-exclusiva",
    images: ["/images/products/produtos_diversos/IMG-8858.png"],
    pricing: {
      basePrice: 92.90,
      ourPrice: 68.90,
      discountPrice: 62.90
    },
    badge: "EXCLUSIVA"
  },
  {
    id: "paul-mitchell-the-color-5n-castanho-claro",
    nome: "Paul Mitchell The Color 5N Castanho Claro",
    marca: "Paul Mitchell",
    tom: "5N",
    cor: "Castanho Claro",
    descricao: "Coloração exclusiva com tecnologia de preservação da cor",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-exclusiva",
    images: ["/images/products/produtos_diversos/IMG-8861.png"],
    pricing: {
      basePrice: 92.90,
      ourPrice: 68.90,
      discountPrice: 62.90
    },
    badge: "EXCLUSIVA"
  },

  // Aveda Hair Color - Linha Orgânica
  {
    id: "aveda-hair-color-3n-castanho-escuro",
    nome: "Aveda Hair Color 3N Castanho Escuro",
    marca: "Aveda",
    tom: "3N",
    cor: "Castanho Escuro",
    descricao: "Coloração orgânica com ingredientes naturais e sustentáveis",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-organica",
    images: ["/images/products/produtos_diversos/IMG-8862.png"],
    pricing: {
      basePrice: 98.90,
      ourPrice: 72.90,
      discountPrice: 67.90
    },
    badge: "ORGÂNICA"
  },
  {
    id: "aveda-hair-color-4n-castanho-natural",
    nome: "Aveda Hair Color 4N Castanho Natural",
    marca: "Aveda",
    tom: "4N",
    cor: "Castanho Natural",
    descricao: "Coloração orgânica com ingredientes naturais e sustentáveis",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-organica",
    images: ["/images/products/produtos_diversos/IMG-8868.png"],
    pricing: {
      basePrice: 98.90,
      ourPrice: 72.90,
      discountPrice: 67.90
    },
    badge: "ORGÂNICA"
  },
  {
    id: "aveda-hair-color-5n-castanho-claro",
    nome: "Aveda Hair Color 5N Castanho Claro",
    marca: "Aveda",
    tom: "5N",
    cor: "Castanho Claro",
    descricao: "Coloração orgânica com ingredientes naturais e sustentáveis",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-organica",
    images: ["/images/products/produtos_diversos/IMG-8869.png"],
    pricing: {
      basePrice: 98.90,
      ourPrice: 72.90,
      discountPrice: 67.90
    },
    badge: "ORGÂNICA"
  },

  // Keune Tinta Color - Linha Holandesa Premium
  {
    id: "keune-tinta-color-3-castanho-escuro",
    nome: "Keune Tinta Color 3 Castanho Escuro",
    marca: "Keune",
    tom: "3",
    cor: "Castanho Escuro",
    descricao: "Coloração holandesa premium com fórmula ultra-concentrada",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-holandesa",
    images: ["/images/products/produtos_diversos/IMG-8872.png"],
    pricing: {
      basePrice: 105.90,
      ourPrice: 78.90,
      discountPrice: 72.90
    },
    badge: "HOLANDESA"
  },
  {
    id: "keune-tinta-color-4-castanho-natural",
    nome: "Keune Tinta Color 4 Castanho Natural",
    marca: "Keune",
    tom: "4",
    cor: "Castanho Natural",
    descricao: "Coloração holandesa premium com fórmula ultra-concentrada",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-holandesa",
    images: ["/images/products/produtos_diversos/IMG-8875.png"],
    pricing: {
      basePrice: 105.90,
      ourPrice: 78.90,
      discountPrice: 72.90
    },
    badge: "HOLANDESA"
  },
  {
    id: "keune-tinta-color-5-castanho-claro",
    nome: "Keune Tinta Color 5 Castanho Claro",
    marca: "Keune",
    tom: "5",
    cor: "Castanho Claro",
    descricao: "Coloração holandesa premium com fórmula ultra-concentrada",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-holandesa",
    images: ["/images/products/produtos_diversos/IMG-8877.png"],
    pricing: {
      basePrice: 105.90,
      ourPrice: 78.90,
      discountPrice: 72.90
    },
    badge: "HOLANDESA"
  },

  // Alfaparf Alta Moda - Expansão do Catálogo
  {
    id: "alfaparf-alta-moda-565-violeta-escuro",
    nome: "Alfaparf Alta Moda 5.65 Violeta Escuro",
    marca: "Alfaparf",
    tom: "5.65",
    cor: "Violeta Escuro",
    descricao: "Coloração com pigmentos micronizados para tratamento e cor",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-premium",
    images: ["/images/products/produtos_diversos/IMG-8880.png"],
    pricing: {
      basePrice: 78.90,
      ourPrice: 55.90,
      discountPrice: 49.90
    },
    badge: "PREMIUM"
  },
  {
    id: "alfaparf-alta-moda-5-castanho-claro",
    nome: "Alfaparf Alta Moda 5 Castanho Claro",
    marca: "Alfaparf",
    tom: "5",
    cor: "Castanho Claro",
    descricao: "Coloração com pigmentos micronizados para tratamento e cor",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-premium",
    images: ["/images/products/produtos_diversos/IMG-8885.png"],
    pricing: {
      basePrice: 78.90,
      ourPrice: 55.90,
      discountPrice: 49.90
    },
    badge: "PREMIUM"
  },
  {
    id: "alfaparf-alta-moda-3-castanho-escuro",
    nome: "Alfaparf Alta Moda 3 Castanho Escuro",
    marca: "Alfaparf",
    tom: "3",
    cor: "Castanho Escuro",
    descricao: "Coloração com pigmentos micronizados para tratamento e cor",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-premium",
    images: ["/images/products/produtos_diversos/IMG-8898.png"],
    pricing: {
      basePrice: 78.90,
      ourPrice: 55.90,
      discountPrice: 49.90
    },
    badge: "PREMIUM"
  },
  {
    id: "alfaparf-alta-moda-1221-loiro-platina",
    nome: "Alfaparf Alta Moda 12.21 Loiro Platina",
    marca: "Alfaparf",
    tom: "12.21",
    cor: "Loiro Platina",
    descricao: "Coloração com pigmentos micronizados para tratamento e cor",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-premium",
    images: ["/images/products/produtos_diversos/IMG-8900.png"],
    pricing: {
      basePrice: 82.90,
      ourPrice: 59.90,
      discountPrice: 53.90
    },
    badge: "PREMIUM"
  },
  {
    id: "alfaparf-alta-moda-101-loiro-extra-claro-cinza",
    nome: "Alfaparf Alta Moda 10.1 Loiro Extra Claro Cinza",
    marca: "Alfaparf",
    tom: "10.1",
    cor: "Loiro Extra Claro Cinza",
    descricao: "Coloração com pigmentos micronizados para tratamento e cor",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-premium",
    images: ["/images/products/produtos_diversos/IMG-8901.png"],
    pricing: {
      basePrice: 82.90,
      ourPrice: 59.90,
      discountPrice: 53.90
    },
    badge: "PREMIUM"
  },

  // Biocolor - Expansão do Catálogo
  {
    id: "biocolor-90-loiro-superclaro",
    nome: "Biocolor Kit Coloração 9.0 Loiro Superclaro",
    marca: "Biocolor",
    tom: "9.0",
    cor: "Loiro Superclaro",
    descricao: "Coloração permanente com fórmula hidratante, pronta em 20 minutos",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-permanente",
    images: ["/images/products/produtos_diversos/IMG-8882.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "HIDRATANTE"
  },
  {
    id: "biocolor-80-loiro-claro",
    nome: "Biocolor Kit Coloração 8.0 Loiro Claro",
    marca: "Biocolor",
    tom: "8.0",
    cor: "Loiro Claro",
    descricao: "Coloração permanente com fórmula hidratante, pronta em 20 minutos",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-permanente",
    images: ["/images/products/produtos_diversos/IMG-8883.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "HIDRATANTE"
  },
  {
    id: "biocolor-45-acaju-escuro",
    nome: "Biocolor Kit Coloração 4.5 Acaju Escuro",
    marca: "Biocolor",
    tom: "4.5",
    cor: "Acaju Escuro",
    descricao: "Coloração permanente com fórmula hidratante, pronta em 20 minutos",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-permanente",
    images: ["/images/products/produtos_diversos/IMG-8903.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "HIDRATANTE"
  },
  {
    id: "biocolor-559-acaju-purpura",
    nome: "Biocolor Kit Coloração 5.59 Acaju Púrpura",
    marca: "Biocolor",
    tom: "5.59",
    cor: "Acaju Púrpura",
    descricao: "Coloração permanente com fórmula hidratante, pronta em 20 minutos",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-permanente",
    images: ["/images/products/produtos_diversos/IMG-8904.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "HIDRATANTE"
  },

  // Garnier Nutrisse - Expansão do Catálogo
  {
    id: "garnier-nutrisse-80-loiro-natural",
    nome: "Garnier Nutrisse 8.0 Loiro Natural",
    marca: "Garnier",
    tom: "8.0",
    cor: "Loiro Natural",
    descricao: "Coloração nutritiva com óleos que nutrem durante a coloração",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-nutritiva",
    images: ["/images/products/produtos_diversos/IMG-8902.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "NUTRITIVA"
  },
  {
    id: "garnier-nutrisse-67-chocolate",
    nome: "Garnier Nutrisse 6.7 Chocolate",
    marca: "Garnier",
    tom: "6.7",
    cor: "Chocolate",
    descricao: "Coloração nutritiva com óleos que nutrem durante a coloração",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-nutritiva",
    images: ["/images/products/produtos_diversos/IMG-8912.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "NUTRITIVA"
  },
  {
    id: "garnier-nutrisse-70-loiro-natural",
    nome: "Garnier Nutrisse 7.0 Loiro Natural",
    marca: "Garnier",
    tom: "7.0",
    cor: "Loiro Natural",
    descricao: "Coloração nutritiva com óleos que nutrem durante a coloração",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-nutritiva",
    images: ["/images/products/produtos_diversos/IMG-8923.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "NUTRITIVA"
  },
  {
    id: "garnier-nutrisse-60-avela",
    nome: "Garnier Nutrisse 6.0 Avelã",
    marca: "Garnier",
    tom: "6.0",
    cor: "Avelã",
    descricao: "Coloração nutritiva com óleos que nutrem durante a coloração",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-nutritiva",
    images: ["/images/products/produtos_diversos/IMG-8933.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "NUTRITIVA"
  },

  // Amend Magnific Color - Nova Linha Premium
  {
    id: "amend-magnific-color-5-castanho-claro",
    nome: "Amend Magnific Color 5 Castanho Claro",
    marca: "Amend",
    tom: "5",
    cor: "Castanho Claro",
    descricao: "Coloração creme com tecnologia profissional e proteção anti quebra",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-profissional",
    images: ["/images/products/produtos_diversos/IMG-8918.png"],
    pricing: {
      basePrice: 65.90,
      ourPrice: 46.90,
      discountPrice: 42.90
    },
    badge: "PROFISSIONAL"
  },
  {
    id: "amend-magnific-color-67-chocolate",
    nome: "Amend Magnific Color 6.7 Chocolate",
    marca: "Amend",
    tom: "6.7",
    cor: "Chocolate",
    descricao: "Coloração creme com tecnologia profissional e proteção anti quebra",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-profissional",
    images: ["/images/products/produtos_diversos/IMG-8940.png"],
    pricing: {
      basePrice: 65.90,
      ourPrice: 46.90,
      discountPrice: 42.90
    },
    badge: "PROFISSIONAL"
  },
  {
    id: "amend-magnific-color-5546-acajou",
    nome: "Amend Magnific Color 55.46 Acajou",
    marca: "Amend",
    tom: "55.46",
    cor: "Acajou",
    descricao: "Coloração creme com tecnologia profissional e proteção anti quebra",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-profissional",
    images: ["/images/products/produtos_diversos/IMG-8953.png"],
    pricing: {
      basePrice: 65.90,
      ourPrice: 46.90,
      discountPrice: 42.90
    },
    badge: "PROFISSIONAL"
  },

  // Garnier Nutrisse - Tons Louros
  {
    id: "garnier-nutrisse-81-loiro-claro-cinza",
    nome: "Garnier Nutrisse 8.1 Loiro Claro Cinza",
    marca: "Garnier",
    tom: "8.1",
    cor: "Loiro Claro Cinza",
    descricao: "Coloração nutritiva com óleos que nutrem durante a coloração",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-nutritiva",
    images: ["/images/products/produtos_diversos/IMG-8961.png"],
    pricing: {
      basePrice: 48.90,
      ourPrice: 34.90,
      discountPrice: 31.90
    },
    badge: "NUTRITIVA"
  },
  {
    id: "garnier-nutrisse-121-loiro-extra-claro-cinza",
    nome: "Garnier Nutrisse 12.1 Loiro Extra Claro Cinza",
    marca: "Garnier",
    tom: "12.1",
    cor: "Loiro Extra Claro Cinza",
    descricao: "Coloração nutritiva com óleos que nutrem durante a coloração",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-nutritiva",
    images: ["/images/products/produtos_diversos/IMG-8962.png"],
    pricing: {
      basePrice: 52.90,
      ourPrice: 37.90,
      discountPrice: 34.90
    },
    badge: "NUTRITIVA"
  },
  {
    id: "garnier-nutrisse-57-chocolate-amargo",
    nome: "Garnier Nutrisse 5.7 Chocolate Amargo",
    marca: "Garnier",
    tom: "5.7",
    cor: "Chocolate Amargo",
    descricao: "Coloração nutritiva com óleos que nutrem durante a coloração",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-nutritiva",
    images: ["/images/products/produtos_diversos/IMG-8965.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "NUTRITIVA"
  },

  // Alfaparf Alta Moda - Linha Vegana
  {
    id: "alfaparf-alta-moda-70-loiro-rubio-vegano",
    nome: "Alfaparf Alta Moda 7.0 Loiro Rubio Vegano",
    marca: "Alfaparf",
    tom: "7.0",
    cor: "Loiro Rubio",
    descricao: "Coloração vegana sem amônia com complexo de peptídeos e proteínas de arroz",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-vegana",
    images: ["/images/products/produtos_diversos/IMG-8966.png"],
    pricing: {
      basePrice: 85.90,
      ourPrice: 62.90,
      discountPrice: 57.90
    },
    badge: "VEGANA"
  },

  // Amend Magnific Color - Tons Acobreados
  {
    id: "amend-magnific-color-747-canela",
    nome: "Amend Magnific Color 7.47 Canela",
    marca: "Amend",
    tom: "7.47",
    cor: "Canela",
    descricao: "Coloração creme com tecnologia profissional e proteção anti quebra",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-profissional",
    images: ["/images/products/produtos_diversos/IMG-8973.png"],
    pricing: {
      basePrice: 65.90,
      ourPrice: 46.90,
      discountPrice: 42.90
    },
    badge: "PROFISSIONAL"
  },
  {
    id: "amend-magnific-color-73-loiro-avela",
    nome: "Amend Magnific Color 7.3 Loiro Avelã",
    marca: "Amend",
    tom: "7.3",
    cor: "Loiro Avelã",
    descricao: "Coloração creme com tecnologia profissional e proteção anti quebra",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-profissional",
    images: ["/images/products/produtos_diversos/IMG-8976.png"],
    pricing: {
      basePrice: 65.90,
      ourPrice: 46.90,
      discountPrice: 42.90
    },
    badge: "PROFISSIONAL"
  },
  {
    id: "amend-magnific-color-81-loiro-cinza-claro",
    nome: "Amend Magnific Color 8.1 Loiro Cinza Claro",
    marca: "Amend",
    tom: "8.1",
    cor: "Loiro Cinza Claro",
    descricao: "Coloração creme com tecnologia profissional e proteção anti quebra",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-profissional",
    images: ["/images/products/produtos_diversos/IMG-8979.png"],
    pricing: {
      basePrice: 65.90,
      ourPrice: 46.90,
      discountPrice: 42.90
    },
    badge: "PROFISSIONAL"
  },

  // Alfaparf Alta Moda - Linha Vegana Escura
  {
    id: "alfaparf-alta-moda-10-preto-vegano",
    nome: "Alfaparf Alta Moda 1.0 Preto Vegano",
    marca: "Alfaparf",
    tom: "1.0",
    cor: "Preto",
    descricao: "Coloração vegana sem amônia com complexo de peptídeos e proteínas de arroz",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-vegana",
    images: ["/images/products/produtos_diversos/IMG-8977.png"],
    pricing: {
      basePrice: 85.90,
      ourPrice: 62.90,
      discountPrice: 57.90
    },
    badge: "VEGANA"
  },

  // Garnier Nutrisse - Tons Especiais
  {
    id: "garnier-nutrisse-71-loiro-cinza-medio",
    nome: "Garnier Nutrisse 7.1 Loiro Cinza Médio",
    marca: "Garnier",
    tom: "7.1",
    cor: "Loiro Cinza Médio",
    descricao: "Coloração nutritiva com óleos que nutrem durante a coloração",
    categoria: "tintas-capilares",
    subcategoria: "coloracao-nutritiva",
    images: ["/images/products/produtos_diversos/IMG-8980.png"],
    pricing: {
      basePrice: 45.90,
      ourPrice: 32.90,
      discountPrice: 29.90
    },
    badge: "NUTRITIVA"
  }
];

// Função para obter tintas por marca
export function getTintasByMarca(marca: string): TintaCapilar[] {
  return tintasCapilares.filter(tinta => tinta.marca.toLowerCase() === marca.toLowerCase());
}

// Função para obter tinta por ID
export function getTintaById(id: string): TintaCapilar | undefined {
  return tintasCapilares.find(tinta => tinta.id === id);
}

// Função para obter todas as marcas
export function getAllMarcas(): string[] {
  return [...new Set(tintasCapilares.map(tinta => tinta.marca))];
}

// Função para obter tintas por tom
export function getTintasByTom(tom: string): TintaCapilar[] {
  return tintasCapilares.filter(tinta => tinta.tom === tom);
}

// Função para obter tintas por subcategoria
export function getTintasBySubcategoria(subcategoria: string): TintaCapilar[] {
  return tintasCapilares.filter(tinta => tinta.subcategoria === subcategoria);
}

// Função para obter todas as subcategorias
export function getAllSubcategorias(): string[] {
  return [...new Set(tintasCapilares.map(tinta => tinta.subcategoria))];
}

// Exportar todas as tintas
export const allTintasCapilares = tintasCapilares;