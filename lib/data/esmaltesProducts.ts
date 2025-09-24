/**
 * JC Hair Studio's 62 - Esmaltes IMPALA Oficiais
 *
 * Catálogo completo com 56 produtos oficiais IMPALA
 * Baseado nas imagens oficiais de alta qualidade
 */

export interface EsmalteProduct {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  imagens: string[];
  categoria: string;
  subcategoria: string;
  badge?: string;
  pricing: {
    basePrice: number;
    ourPrice: number;
    discountPrice?: number;
    savings?: number;
    margin: string;
    competitive: string;
  };
  cores?: {
    nome: string;
    codigo: string;
    hex: string;
  }[];
  especificacoes?: {
    volume?: string;
    durabilidade?: string;
    acabamento?: string;
    aplicacao?: string;
    secagem?: string;
  };
  tags: string[];
}

// Tipos de esmaltes IMPALA
const tipos = [
  { tipo: 'Cremoso', badge: 'CREMOSO', basePrice: 4.90, durabilidade: '5-8 dias', aplicacao: '1-2 camadas', secagem: '6-8 minutos' },
  { tipo: 'Perolado', badge: 'PEROLADO', basePrice: 5.90, durabilidade: '5-7 dias', aplicacao: '2 camadas', secagem: '8-10 minutos' },
  { tipo: 'Metálico', badge: 'METÁLICO', basePrice: 6.90, durabilidade: '4-6 dias', aplicacao: '2 camadas', secagem: '10-12 minutos' },
  { tipo: 'Glitter', badge: 'GLITTER', basePrice: 7.90, durabilidade: '3-5 dias', aplicacao: '2-3 camadas', secagem: '12-15 minutos' },
  { tipo: 'Tratamento', badge: 'TRATAMENTO', basePrice: 6.90, durabilidade: 'Variável', aplicacao: '1 camada', secagem: '5-8 minutos' },
  { tipo: 'Transparente', badge: 'TOP COAT', basePrice: 5.90, durabilidade: 'Base/Top', aplicacao: '1 camada', secagem: '8-10 minutos' }
];

// Catálogo oficial IMPALA - 56 produtos com imagens reais
const esmaltesOficiais = [
  { nome: 'Abrigo', tipo: 'Cremoso', hex: '#8B7355', imagem: 'Impala Abrigo Cremoso.webp', descricao: 'Tom nude acastanhado que oferece proteção e conforto visual' },
  { nome: 'Acalanto', tipo: 'Cremoso', hex: '#E6E6FA', imagem: 'Impala Acalanto Cremoso.webp', descricao: 'Lilás suave que acalma e transmite tranquilidade' },
  { nome: 'Allure', tipo: 'Cremoso', hex: '#8B0000', imagem: 'Impala Allure Cremoso.webp', descricao: 'Vermelho intenso e sedutor com acabamento sofisticado' },
  { nome: 'Amante', tipo: 'Perolado', hex: '#FFB6C1', imagem: 'Impala Amante Perolado_.webp', descricao: 'Rosa perolado romântico para momentos especiais' },
  { nome: 'Amor', tipo: 'Perolado', hex: '#C41E3A', imagem: 'Impala Amor Perolado_.webp', descricao: 'Vermelho perolado que expressa paixão e intensidade' },
  { nome: 'Amore', tipo: 'Perolado', hex: '#FFB6C1', imagem: 'Impala Amore Perolado.webp', descricao: 'Rosa delicado com brilho perolado encantador' },
  { nome: 'Ballet Clássico', tipo: 'Cremoso', hex: '#F5F5DC', imagem: 'Impala Ballet Clássico Cremoso_.webp', descricao: 'Nude clássico inspirado na elegância do ballet' },
  { nome: 'Base Bomba', tipo: 'Tratamento', hex: '#FFFFFF', imagem: 'Impala Base Bomba Cremoso.webp', descricao: 'Base fortalecedora que prepara as unhas perfeitamente' },
  { nome: 'Base para Unhas Fracas', tipo: 'Tratamento', hex: '#FFFFFF', imagem: 'Impala Base para Unhas Fracas Tratamento_.webp', descricao: 'Tratamento específico para unhas frágeis e quebradiças' },
  { nome: 'Branco', tipo: 'Cremoso', hex: '#FFFFFF', imagem: 'Impala Branco Cremoso.webp', descricao: 'Branco puro clássico, perfeito para french manicure' },
  { nome: 'Café Café', tipo: 'Cremoso', hex: '#8B2635', imagem: 'Impala Café Café Cremoso_.webp', descricao: 'Marrom avermelhado sofisticado e elegante' },
  { nome: 'Chamego meu', tipo: 'Cremoso', hex: '#DDA0DD', imagem: 'Impala Chamego meu_.webp', descricao: 'Roxo suave e carinhoso para momentos de ternura' },
  { nome: 'Coffee', tipo: 'Cremoso', hex: '#654321', imagem: 'Impala Coffee Cremoso.webp', descricao: 'Marrom intenso inspirado no café aromático' },
  { nome: 'Coisa Linda', tipo: 'Cremoso', hex: '#A0522D', imagem: 'Impala Coisa Linda Cremoso.webp', descricao: 'Nude rosado natural que realça a beleza das mãos' },
  { nome: 'Collant', tipo: 'Cremoso', hex: '#D2B48C', imagem: 'Impala Collant Cremoso.webp', descricao: 'Bege natural como uma segunda pele' },
  { nome: 'Compartilhar Preguiça', tipo: 'Cremoso', hex: '#FFEFD5', imagem: 'Impala Compartilhar Preguiça_.webp', descricao: 'Nude claro para momentos de relaxamento' },
  { nome: 'Confeti', tipo: 'Cremoso', hex: '#FF69B4', imagem: 'Impala Confeti Cremoso_.webp', descricao: 'Rosa vibrante que celebra a alegria da vida' },
  { nome: 'Confiante e Imprevisível Metal Like', tipo: 'Metálico', hex: '#708090', imagem: 'Impala Confiante e Imprevisível Metal Likee.webp', descricao: 'Cinza metálico para personalidades marcantes' },
  { nome: 'Crochê', tipo: 'Cremoso', hex: '#D2B48C', imagem: 'Impala Crochê Cremoso.webp', descricao: 'Bege suave como os fios delicados do crochê' },
  { nome: 'Dádiva', tipo: 'Cremoso', hex: '#8FBC8F', imagem: 'Impala Dádiva Cremoso.webp', descricao: 'Verde suave que representa um presente da natureza' },
  { nome: 'Descomplicada', tipo: 'Cremoso', hex: '#8A2BE2', imagem: 'Impala Descomplicada Cremoso_.webp', descricao: 'Roxo vibrante para quem ama simplicidade com estilo' },
  { nome: 'Dizeres', tipo: 'Perolado', hex: '#F0E68C', imagem: 'Impala Dizeres Perolado.webp', descricao: 'Dourado perolado que fala por si só' },
  { nome: 'Equilíbrio', tipo: 'Cremoso', hex: '#F5E6D3', imagem: 'Impala Equilíbrio Cremoso.webp', descricao: 'Nude harmonioso que traz paz e serenidade' },
  { nome: 'Essencial', tipo: 'Cremoso', hex: '#2F2F2F', imagem: 'Impala Essencial Cremoso_.webp', descricao: 'Cinza escuro essencial para qualquer ocasião' },
  { nome: 'Fascinação', tipo: 'Cremoso', hex: '#DC143C', imagem: 'Impala Fascinação Cremoso_.webp', descricao: 'Vermelho fascinante que hipnotiza o olhar' },
  { nome: 'Flutua', tipo: 'Cremoso', hex: '#87CEEB', imagem: 'Impala Flutua Cremoso.webp', descricao: 'Azul celeste que flutua como as nuvens' },
  { nome: 'Gatinha', tipo: 'Cremoso', hex: '#FFB6C1', imagem: 'Impala Gatinha Cremoso.webp', descricao: 'Rosa fofo e brincalhão como um gatinho' },
  { nome: 'Imensidão', tipo: 'Cremoso', hex: '#4682B4', imagem: 'Impala Imensidão Cremoso.webp', descricao: 'Azul profundo como a vastidão do oceano' },
  { nome: 'Inocense', tipo: 'Cremoso', hex: '#FFC0CB', imagem: 'Impala Inocense Cremoso.webp', descricao: 'Rosa claro que expressa pureza e inocência' },
  { nome: 'Jane', tipo: 'Cremoso', hex: '#8B0000', imagem: 'Impala Jane Cremoso.webp', descricao: 'Vermelho escuro elegante e sofisticado' },
  { nome: 'Laguna', tipo: 'Cremoso', hex: '#20B2AA', imagem: 'Impala Laguna Cremoso_.webp', descricao: 'Verde-azulado cristalino como águas de laguna' },
  { nome: 'Lembrança', tipo: 'Perolado', hex: '#F5F5DC', imagem: 'Impala Lembrança Perolado_.webp', descricao: 'Bege perolado que guarda memórias especiais' },
  { nome: 'Lenny', tipo: 'Perolado', hex: '#FFB6C1', imagem: 'Impala Lenny Perolado.webp', descricao: 'Rosa perolado suave e romântico' },
  { nome: 'Lua', tipo: 'Perolado', hex: '#F5E6D3', imagem: 'Impala Lua Perolado_.webp', descricao: 'Branco perolado que brilha como o luar' },
  { nome: 'Maria Cereja', tipo: 'Cremoso', hex: '#DC143C', imagem: 'Impala Maria Cereja Cremoso.webp', descricao: 'Vermelho cereja doce e vibrante' },
  { nome: 'Marilyn', tipo: 'Cremoso', hex: '#FF6347', imagem: 'Impala Marilyn Cremoso.webp', descricao: 'Coral vibrante inspirado no glamour clássico' },
  { nome: 'Menina Bonita', tipo: 'Cremoso', hex: '#FFB6C1', imagem: 'Impala Menina Bonita.webp', descricao: 'Rosa delicado que realça a beleza natural' },
  { nome: 'Na Ponta do Pé', tipo: 'Cremoso', hex: '#D2B48C', imagem: 'Impala Na Ponta do Pé Cremoso.webp', descricao: 'Nude suave para passos delicados' },
  { nome: 'Preto', tipo: 'Cremoso', hex: '#000000', imagem: 'Impala Preto Cremoso.webp', descricao: 'Preto clássico essencial para looks sofisticados' },
  { nome: 'Querer', tipo: 'Cremoso', hex: '#9370DB', imagem: 'Impala Querer Cremoso.webp', descricao: 'Roxo intenso que desperta desejos' },
  { nome: 'Roça Rosa', tipo: 'Cremoso', hex: '#FF69B4', imagem: 'Impala Roça Rosa Cremoso.webp', descricao: 'Rosa country vibrante e alegre' },
  { nome: 'Royal', tipo: 'Cremoso', hex: '#4169E1', imagem: 'Impala Royal Cremoso.webp', descricao: 'Azul real majestoso e imponente' },
  { nome: 'Sabe que é Gostosa', tipo: 'Cremoso', hex: '#FF1493', imagem: 'Impala Sabe que é Gostosa Cremoso_.webp', descricao: 'Pink ousado para quem tem atitude' },
  { nome: 'Semear', tipo: 'Perolado', hex: '#8FBC8F', imagem: 'Impala Semear Perolado.webp', descricao: 'Verde perolado que planta esperanças' },
  { nome: 'Serena', tipo: 'Cremoso', hex: '#B0C4DE', imagem: 'Impala Serena.webp', descricao: 'Azul claro sereno e tranquilo' },
  { nome: 'Sofisticado', tipo: 'Cremoso', hex: '#654321', imagem: 'Impala Sofisticado Cremoso.webp', descricao: 'Marrom elegante para looks refinados' },
  { nome: 'Solta o Agronejo', tipo: 'Cremoso', hex: '#228B22', imagem: 'Impala Solta o Agronejo Cremoso.jpg', descricao: 'Verde country que liberta o coração' },
  { nome: 'Sonho', tipo: 'Perolado', hex: '#F8F8FF', imagem: 'Impala Sonho Perolado.webp', descricao: 'Branco perolado que realiza sonhos' },
  { nome: 'Sossego', tipo: 'Cremoso', hex: '#C71585', imagem: 'Impala Sossego_.webp', descricao: 'Magenta que traz paz interior' },
  { nome: 'Sutileza', tipo: 'Cremoso', hex: '#F5DEB3', imagem: 'Impala Sutileza Cremoso.webp', descricao: 'Bege sutil e delicado' },
  { nome: 'Terra Molhada', tipo: 'Cremoso', hex: '#8B4513', imagem: 'Impala Terra Molhada Cremoso.webp', descricao: 'Marrom terroso após a chuva' },
  { nome: 'Toda Dengosa', tipo: 'Cremoso', hex: '#FFB6C1', imagem: 'Impala Toda Dengosa Cremoso.webp', descricao: 'Rosa dengoso cheio de charme' },
  { nome: 'Top Pop', tipo: 'Transparente', hex: '#FFFFFF', imagem: 'Impala Top Pop_.webp', descricao: 'Top coat transparente para brilho extra' },
  { nome: 'Vinho', tipo: 'Cremoso', hex: '#800080', imagem: 'Impala Vinho Cremoso.webp', descricao: 'Roxo vinho sofisticado e intenso' },
  { nome: 'Viva Ame e Brilhe', tipo: 'Glitter', hex: '#FF69B4', imagem: 'Impala Viva Ame e Brilhe Glitter_.webp', descricao: 'Rosa com glitter para brilhar sempre' },
  { nome: 'Zaz', tipo: 'Cremoso', hex: '#FF6347', imagem: 'Impala Zaz.webp', descricao: 'Coral energético que desperta alegria' }
];

// Gerar produtos oficiais IMPALA
export function generateAllEsmaltes(): EsmalteProduct[] {
  return esmaltesOficiais.map((esmalte, index) => {
    const tipoInfo = tipos.find(t => t.tipo === esmalte.tipo) || tipos[0];

    return {
      id: `impala-${(index + 1).toString().padStart(3, '0')}`,
      nome: `IMPALA ${esmalte.nome}`,
      marca: 'IMPALA',
      descricao: esmalte.descricao,
      imagens: [`/images/products/esmaltes/${esmalte.imagem}`],
      categoria: 'Esmaltes',
      subcategoria: 'Nail Polish',
      badge: tipoInfo.badge,
      pricing: {
        basePrice: tipoInfo.basePrice,
        ourPrice: Math.round((tipoInfo.basePrice * 1.6) * 100) / 100,
        discountPrice: Math.round((tipoInfo.basePrice * 1.4) * 100) / 100,
        savings: Math.round((tipoInfo.basePrice * 0.2) * 100) / 100,
        margin: '45%',
        competitive: 'Preços baseados no mercado premium de esmaltes IMPALA'
      },
      cores: [{
        nome: esmalte.nome,
        codigo: `IMP${(index + 1).toString().padStart(3, '0')}`,
        hex: esmalte.hex
      }],
      especificacoes: {
        volume: '7.5ml',
        durabilidade: tipoInfo.durabilidade,
        acabamento: esmalte.tipo,
        aplicacao: tipoInfo.aplicacao,
        secagem: tipoInfo.secagem
      },
      tags: [
        'impala',
        'esmalte',
        esmalte.tipo.toLowerCase().replace(/\s+/g, '-'),
        esmalte.nome.toLowerCase().replace(/\s+/g, '-'),
        'nail-polish',
        'brasileiro',
        'oficial'
      ]
    };
  });
}

export const allEsmaltesData = generateAllEsmaltes();