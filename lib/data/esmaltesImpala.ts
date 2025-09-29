/**
 * JC Hair Studio's 62 - Esmaltes IMPALA
 * Catálogo completo de 55 esmaltes IMPALA brasileiros
 * Baseado na análise detalhada dos rótulos e frascos REAIS
 * Caminhos de imagens atualizados com nomes reais dos arquivos
 */

export interface EsmalteImpala {
  id: string;
  nome: string;
  marca: string;
  codigo?: string;
  cor: string;
  acabamento: string;
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
  familiaCorr: string;
}

// Esmaltes IMPALA - Coleção Completa (55 esmaltes)
export const esmaltesImpala: EsmalteImpala[] = [
  // FAMÍLIA ROSA (15 produtos)
  {
    id: "impala-esmalte-amore-perolado",
    nome: "Esmalte IMPALA Amore",
    marca: "IMPALA",
    cor: "Rosa Suave",
    acabamento: "Perolado",
    descricao: "Esmalte brasileiro de longa duração com fórmula livre de tolueno",
    categoria: "esmaltes",
    subcategoria: "esmalte-perolado",
    images: ["/images/products/esmaltes/Impala Amore Perolado.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },
  {
    id: "impala-esmalte-ballet-classico",
    nome: "Esmalte IMPALA Ballet Clássico",
    marca: "IMPALA",
    cor: "Rosa Claro",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro de longa duração com fórmula livre de tolueno",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Ballet Clássico Cremoso_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },
  {
    id: "impala-esmalte-chamego-meu",
    nome: "Esmalte IMPALA Chamego Meu",
    marca: "IMPALA",
    cor: "Rosa Médio",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro de longa duração com fórmula livre de tolueno",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Chamego meu_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },
  {
    id: "impala-esmalte-coisa-linda",
    nome: "Esmalte IMPALA Coisa Linda",
    marca: "IMPALA",
    cor: "Rosa Vibrante",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro de longa duração com fórmula livre de tolueno",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Coisa Linda Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },
  {
    id: "impala-esmalte-confeti",
    nome: "Esmalte IMPALA Confeti",
    marca: "IMPALA",
    cor: "Rosa Glitter",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com efeito glitter e partículas cintilantes",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Confeti Cremoso_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },
  {
    id: "impala-esmalte-compartilhar-preguica",
    nome: "Esmalte IMPALA Compartilhar Preguiça",
    marca: "IMPALA",
    cor: "Rosa Nude",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com tom nude rosado para relaxar",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Compartilhar Preguiça_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },
  {
    id: "impala-esmalte-descomplicada",
    nome: "Esmalte IMPALA Descomplicada",
    marca: "IMPALA",
    cor: "Rosa Natural",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro descomplicado para o dia a dia",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Descomplicada Cremoso_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },
  {
    id: "impala-esmalte-fascinacao",
    nome: "Esmalte IMPALA Fascinação",
    marca: "IMPALA",
    cor: "Rosa Fascinante",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro fascinante com cor envolvente",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Fascinação Cremoso_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },
  {
    id: "impala-esmalte-gatinha",
    nome: "Esmalte IMPALA Gatinha",
    marca: "IMPALA",
    cor: "Rosa Divertido",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro divertido e jovial",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Gatinha Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },
  {
    id: "impala-esmalte-menina-bonita",
    nome: "Esmalte IMPALA Menina Bonita",
    marca: "IMPALA",
    cor: "Rosa Bonito",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro para meninas bonitas de todas as idades",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Menina Bonita.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },
  {
    id: "impala-esmalte-na-ponta-do-pe",
    nome: "Esmalte IMPALA Na Ponta do Pé",
    marca: "IMPALA",
    cor: "Rosa Delicado",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro delicado na ponta dos pés",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Na Ponta do Pé Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },
  {
    id: "impala-esmalte-roca-rosa",
    nome: "Esmalte IMPALA Roça Rosa",
    marca: "IMPALA",
    cor: "Rosa Caipira",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com charme da roça em tom rosa",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Roça Rosa Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },
  {
    id: "impala-esmalte-sabe-que-e-gostosa",
    nome: "Esmalte IMPALA Sabe que é Gostosa",
    marca: "IMPALA",
    cor: "Rosa Gostoso",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro para quem sabe que é gostosa",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Sabe que é Gostosa Cremoso_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },
  {
    id: "impala-esmalte-toda-dengosa",
    nome: "Esmalte IMPALA Toda Dengosa",
    marca: "IMPALA",
    cor: "Rosa Dengoso",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro para momentos dengosos",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Toda Dengosa Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },
  {
    id: "impala-esmalte-viva-ame-brilhe",
    nome: "Esmalte IMPALA Viva Ame e Brilhe",
    marca: "IMPALA",
    cor: "Rosa Glitter",
    acabamento: "Glitter",
    descricao: "Esmalte brasileiro com glitter para viver, amar e brilhar",
    categoria: "esmaltes",
    subcategoria: "esmalte-glitter",
    images: ["/images/products/esmaltes/Impala Viva Ame e Brilhe Glitter_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Rosa"
  },

  // FAMÍLIA VERMELHA (7 produtos)
  {
    id: "impala-esmalte-allure",
    nome: "Esmalte IMPALA Allure",
    marca: "IMPALA",
    cor: "Vermelho Clássico",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro de longa duração com fórmula livre de tolueno",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Allure Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Vermelho"
  },
  {
    id: "impala-esmalte-amante",
    nome: "Esmalte IMPALA Amante",
    marca: "IMPALA",
    cor: "Vermelho Perolado",
    acabamento: "Perolado",
    descricao: "Esmalte brasileiro com efeito perolado sofisticado",
    categoria: "esmaltes",
    subcategoria: "esmalte-perolado",
    images: ["/images/products/esmaltes/Impala Amante Perolado_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Vermelho"
  },
  {
    id: "impala-esmalte-amor",
    nome: "Esmalte IMPALA Amor",
    marca: "IMPALA",
    cor: "Vermelho Intenso",
    acabamento: "Perolado",
    descricao: "Esmalte brasileiro com pigmentação intensa e acabamento perolado",
    categoria: "esmaltes",
    subcategoria: "esmalte-perolado",
    images: ["/images/products/esmaltes/Impala Amor Perolado_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Vermelho"
  },
  {
    id: "impala-esmalte-maria-cereja",
    nome: "Esmalte IMPALA Maria Cereja",
    marca: "IMPALA",
    cor: "Vermelho Cereja",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com tom cereja marcante",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Maria Cereja Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Vermelho"
  },
  {
    id: "impala-esmalte-querer",
    nome: "Esmalte IMPALA Querer",
    marca: "IMPALA",
    cor: "Vermelho Desejado",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro que desperta o querer",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Querer Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Vermelho"
  },
  {
    id: "impala-esmalte-royal",
    nome: "Esmalte IMPALA Royal",
    marca: "IMPALA",
    cor: "Vermelho Real",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com realeza em vermelho",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Royal Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Vermelho"
  },
  {
    id: "impala-esmalte-vinho",
    nome: "Esmalte IMPALA Vinho",
    marca: "IMPALA",
    cor: "Vermelho Vinho",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com tom vinho sofisticado",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Vinho Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Vermelho"
  },

  // FAMÍLIA AZUL (6 produtos)
  {
    id: "impala-esmalte-abrigo",
    nome: "Esmalte IMPALA Abrigo",
    marca: "IMPALA",
    cor: "Azul Marinho",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro de longa duração com fórmula livre de tolueno",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Abrigo Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Azul"
  },
  {
    id: "impala-esmalte-flutua",
    nome: "Esmalte IMPALA Flutua",
    marca: "IMPALA",
    cor: "Azul Claro",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro de longa duração com fórmula livre de tolueno",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Flutua Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Azul"
  },
  {
    id: "impala-esmalte-imensidao",
    nome: "Esmalte IMPALA Imensidão",
    marca: "IMPALA",
    cor: "Azul Profundo",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro de longa duração com fórmula livre de tolueno",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Imensidão Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Azul"
  },
  {
    id: "impala-esmalte-laguna",
    nome: "Esmalte IMPALA Laguna",
    marca: "IMPALA",
    cor: "Azul Laguna",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com tom de laguna tropical",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Laguna Cremoso_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Azul"
  },
  {
    id: "impala-esmalte-sossego",
    nome: "Esmalte IMPALA Sossego",
    marca: "IMPALA",
    cor: "Azul Sossego",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro para momentos de sossego",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Sossego_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Azul"
  },
  {
    id: "impala-esmalte-confiante-imprevisivel",
    nome: "Esmalte IMPALA Confiante e Imprevisível",
    marca: "IMPALA",
    cor: "Azul Metálico",
    acabamento: "Metal Like",
    descricao: "Esmalte brasileiro com acabamento metálico para personalidades confiantes",
    categoria: "esmaltes",
    subcategoria: "esmalte-metalico",
    images: ["/images/products/esmaltes/Impala Confiante e Imprevisível Metal Likee.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Azul"
  },

  // FAMÍLIA NEUTRA (8 produtos)
  {
    id: "impala-esmalte-collant",
    nome: "Esmalte IMPALA Collant",
    marca: "IMPALA",
    cor: "Nude Rosado",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com cor natural para uso diário",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Collant Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Neutro"
  },
  {
    id: "impala-esmalte-branco",
    nome: "Esmalte IMPALA Branco",
    marca: "IMPALA",
    cor: "Branco",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro branco clássico de alta cobertura",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Branco Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Neutro"
  },
  {
    id: "impala-esmalte-essencial",
    nome: "Esmalte IMPALA Essencial",
    marca: "IMPALA",
    cor: "Nude",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com tom nude essencial",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Essencial Cremoso_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Neutro"
  },
  {
    id: "impala-esmalte-dadiva",
    nome: "Esmalte IMPALA Dádiva",
    marca: "IMPALA",
    cor: "Nude Rosé",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro que é uma dádiva em suas mãos",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Dádiva Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Neutro"
  },
  {
    id: "impala-esmalte-inocense",
    nome: "Esmalte IMPALA Inocense",
    marca: "IMPALA",
    cor: "Nude Inocente",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com inocência e delicadeza",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Inocense Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Neutro"
  },
  {
    id: "impala-esmalte-jane",
    nome: "Esmalte IMPALA Jane",
    marca: "IMPALA",
    cor: "Nude Jane",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro simples e elegante como Jane",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Jane Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Neutro"
  },
  {
    id: "impala-esmalte-serena",
    nome: "Esmalte IMPALA Serena",
    marca: "IMPALA",
    cor: "Nude Sereno",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com serenidade e paz",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Serena.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Neutro"
  },
  {
    id: "impala-esmalte-sutileza",
    nome: "Esmalte IMPALA Sutileza",
    marca: "IMPALA",
    cor: "Nude Sutil",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com sutileza e elegância",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Sutileza Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Neutro"
  },

  // FAMÍLIA MARROM/CAFÉ (5 produtos)
  {
    id: "impala-esmalte-cafe-cafe",
    nome: "Esmalte IMPALA Café Café",
    marca: "IMPALA",
    cor: "Marrom Café",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com tom terroso sofisticado",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Café Café Cremoso_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Marrom"
  },
  {
    id: "impala-esmalte-coffee",
    nome: "Esmalte IMPALA Coffee",
    marca: "IMPALA",
    cor: "Marrom Coffee",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com tom de café intenso",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Coffee Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Marrom"
  },
  {
    id: "impala-esmalte-croche",
    nome: "Esmalte IMPALA Crochê",
    marca: "IMPALA",
    cor: "Marrom Crochê",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com charme artesanal do crochê",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Crochê Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Marrom"
  },
  {
    id: "impala-esmalte-sofisticado",
    nome: "Esmalte IMPALA Sofisticado",
    marca: "IMPALA",
    cor: "Marrom Sofisticado",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com sofisticação em marrom",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Sofisticado Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Marrom"
  },
  {
    id: "impala-esmalte-terra-molhada",
    nome: "Esmalte IMPALA Terra Molhada",
    marca: "IMPALA",
    cor: "Marrom Terra",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com tom de terra molhada",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Terra Molhada Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Marrom"
  },

  // FAMÍLIA ROXO/LILÁS (6 produtos)
  {
    id: "impala-esmalte-acalanto",
    nome: "Esmalte IMPALA Acalanto",
    marca: "IMPALA",
    cor: "Lilás Suave",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com tom lilás delicado",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Acalanto Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Roxo"
  },
  {
    id: "impala-esmalte-lenny",
    nome: "Esmalte IMPALA Lenny",
    marca: "IMPALA",
    cor: "Roxo Perolado",
    acabamento: "Perolado",
    descricao: "Esmalte brasileiro com efeito perolado em tom roxo",
    categoria: "esmaltes",
    subcategoria: "esmalte-perolado",
    images: ["/images/products/esmaltes/Impala Lenny Perolado.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Roxo"
  },
  {
    id: "impala-esmalte-dizeres",
    nome: "Esmalte IMPALA Dizeres",
    marca: "IMPALA",
    cor: "Roxo Dizeres",
    acabamento: "Perolado",
    descricao: "Esmalte brasileiro que fala por si só",
    categoria: "esmaltes",
    subcategoria: "esmalte-perolado",
    images: ["/images/products/esmaltes/Impala Dizeres Perolado.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Roxo"
  },
  {
    id: "impala-esmalte-lembranca",
    nome: "Esmalte IMPALA Lembrança",
    marca: "IMPALA",
    cor: "Roxo Lembrança",
    acabamento: "Perolado",
    descricao: "Esmalte brasileiro que deixa lembranças marcantes",
    categoria: "esmaltes",
    subcategoria: "esmalte-perolado",
    images: ["/images/products/esmaltes/Impala Lembrança Perolado_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Roxo"
  },
  {
    id: "impala-esmalte-lua",
    nome: "Esmalte IMPALA Lua",
    marca: "IMPALA",
    cor: "Roxo Lunar",
    acabamento: "Perolado",
    descricao: "Esmalte brasileiro inspirado na lua",
    categoria: "esmaltes",
    subcategoria: "esmalte-perolado",
    images: ["/images/products/esmaltes/Impala Lua Perolado_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Roxo"
  },
  {
    id: "impala-esmalte-sonho",
    nome: "Esmalte IMPALA Sonho",
    marca: "IMPALA",
    cor: "Roxo Sonho",
    acabamento: "Perolado",
    descricao: "Esmalte brasileiro que realiza sonhos",
    categoria: "esmaltes",
    subcategoria: "esmalte-perolado",
    images: ["/images/products/esmaltes/Impala Sonho Perolado.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Roxo"
  },

  // FAMÍLIA VERDE (3 produtos)
  {
    id: "impala-esmalte-equilibrio",
    nome: "Esmalte IMPALA Equilíbrio",
    marca: "IMPALA",
    cor: "Verde Água",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com tom verde refrescante",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Equilíbrio Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Verde"
  },
  {
    id: "impala-esmalte-semear",
    nome: "Esmalte IMPALA Semear",
    marca: "IMPALA",
    cor: "Verde Perolado",
    acabamento: "Perolado",
    descricao: "Esmalte brasileiro com tom verde e acabamento perolado",
    categoria: "esmaltes",
    subcategoria: "esmalte-perolado",
    images: ["/images/products/esmaltes/Impala Semear Perolado.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Verde"
  },
  {
    id: "impala-esmalte-solta-agronejo",
    nome: "Esmalte IMPALA Solta o Agronejo",
    marca: "IMPALA",
    cor: "Verde Agronejo",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro para soltar o agronejo que há em você",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Solta o Agronejo Cremoso.jpg"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Verde"
  },

  // FASHION/ESPECIAIS (3 produtos)
  {
    id: "impala-esmalte-marilyn",
    nome: "Esmalte IMPALA Marilyn",
    marca: "IMPALA",
    cor: "Rosa Marilyn",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro inspirado na elegância de Marilyn",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Marilyn Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Fashion"
  },
  {
    id: "impala-esmalte-top-pop",
    nome: "Esmalte IMPALA Top Pop",
    marca: "IMPALA",
    cor: "Fashion Pop",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro para quem é top e pop",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Top Pop_.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Fashion"
  },
  {
    id: "impala-esmalte-zaz",
    nome: "Esmalte IMPALA Zaz",
    marca: "IMPALA",
    cor: "Fashion Zaz",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro com atitude zaz",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Zaz.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Fashion"
  },

  // CLÁSSICOS (1 produto)
  {
    id: "impala-esmalte-preto",
    nome: "Esmalte IMPALA Preto",
    marca: "IMPALA",
    cor: "Preto",
    acabamento: "Cremoso",
    descricao: "Esmalte brasileiro preto clássico de alta cobertura",
    categoria: "esmaltes",
    subcategoria: "esmalte-cremoso",
    images: ["/images/products/esmaltes/Impala Preto Cremoso.webp"],
    pricing: { basePrice: 12.90, ourPrice: 8.90, discountPrice: 7.90 },
    badge: "BRASILEIRO",
    familiaCorr: "Clássico"
  },

  // BASES E TRATAMENTOS (2 produtos)
  {
    id: "impala-base-bomba",
    nome: "IMPALA Base Bomba",
    marca: "IMPALA",
    cor: "Transparente",
    acabamento: "Tratamento",
    descricao: "Base fortalecedora para unhas fracas e quebradiças",
    categoria: "esmaltes",
    subcategoria: "base-tratamento",
    images: ["/images/products/esmaltes/Impala Base Bomba Cremoso.webp"],
    pricing: { basePrice: 14.90, ourPrice: 10.90, discountPrice: 9.90 },
    badge: "TRATAMENTO",
    familiaCorr: "Tratamento"
  },
  {
    id: "impala-base-unhas-fracas",
    nome: "IMPALA Base para Unhas Fracas",
    marca: "IMPALA",
    cor: "Transparente",
    acabamento: "Tratamento",
    descricao: "Base específica para fortalecimento de unhas fracas",
    categoria: "esmaltes",
    subcategoria: "base-tratamento",
    images: ["/images/products/esmaltes/Impala Base para Unhas Fracas Tratamento_.webp"],
    pricing: { basePrice: 14.90, ourPrice: 10.90, discountPrice: 9.90 },
    badge: "TRATAMENTO",
    familiaCorr: "Tratamento"
  }
];

// Função para obter esmaltes por família de cor
export function getEsmaltesByFamilia(familia: string): EsmalteImpala[] {
  return esmaltesImpala.filter(esmalte => esmalte.familiaCorr.toLowerCase() === familia.toLowerCase());
}

// Função para obter esmalte por ID
export function getEsmalteById(id: string): EsmalteImpala | undefined {
  return esmaltesImpala.find(esmalte => esmalte.id === id);
}

// Função para obter esmaltes por acabamento
export function getEsmaltesByAcabamento(acabamento: string): EsmalteImpala[] {
  return esmaltesImpala.filter(esmalte => esmalte.acabamento.toLowerCase() === acabamento.toLowerCase());
}

// Função para obter todas as famílias de cores
export function getAllFamiliasCores(): string[] {
  return [...new Set(esmaltesImpala.map(esmalte => esmalte.familiaCorr))];
}

// Exportar todos os esmaltes
export const allEsmaltesImpala = esmaltesImpala;