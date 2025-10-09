/**
 * SEO Internal Linking Helper
 * Manages internal links across the site for better SEO and user experience
 */

export interface InternalLink {
  href: string;
  text: string;
  title: string;
  rel?: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface CategoryLinks {
  main: InternalLink[];
  related: InternalLink[];
  popular: InternalLink[];
}

/**
 * Main navigation structure for consistent internal linking
 */
export const MAIN_NAVIGATION: InternalLink[] = [
  {
    href: '/',
    text: 'Início',
    title: 'Voltar à página inicial',
    priority: 'high'
  },
  {
    href: '/produtos',
    text: 'Todos os Produtos',
    title: 'Ver catálogo completo de produtos brasileiros',
    priority: 'high'
  },
  {
    href: '/mega-hair',
    text: 'Mega Hair Brasileiro',
    title: 'Extensões de cabelo 100% humano brasileiro',
    category: 'mega-hair',
    priority: 'high'
  },
  {
    href: '/categoria/progressivas-alisamentos',
    text: 'Progressivas & Alisamentos',
    title: 'Progressivas brasileiras profissionais e alisamentos',
    category: 'progressivas',
    priority: 'high'
  },
  {
    href: '/categoria/tratamentos-capilares',
    text: 'Tratamentos Capilares',
    title: 'Tratamentos e máscaras capilares premium',
    category: 'tratamentos',
    priority: 'high'
  },
  {
    href: '/maquiagens',
    text: 'Maquiagem Brasileira',
    title: 'Maquiagens e cosméticos brasileiros autênticos',
    category: 'maquiagem',
    priority: 'medium'
  },
  {
    href: '/perfumes-brasileiros',
    text: 'Perfumes Brasileiros',
    title: 'Perfumes e fragrâncias brasileiras premium',
    category: 'perfumes',
    priority: 'medium'
  },
];

/**
 * Product category mappings for contextual linking
 */
export const CATEGORY_SLUGS: Record<string, string> = {
  'mega-hair': '/mega-hair',
  'progressivas': '/categoria/progressivas-alisamentos',
  'tratamentos': '/categoria/tratamentos-capilares',
  'shampoos': '/categoria/shampoos-condicionadores',
  'ferramentas': '/categoria/ferramentas-profissionais',
  'maquiagem': '/maquiagens',
  'perfumes': '/perfumes-brasileiros',
  'esmaltes': '/esmaltes-impala-portugal',
};

/**
 * Get related category links for a product
 */
export function getRelatedCategoryLinks(currentCategory?: string): InternalLink[] {
  const links = MAIN_NAVIGATION.filter(link =>
    link.category && link.category !== currentCategory
  );

  return links.slice(0, 4);
}

/**
 * Get breadcrumb links for a given path
 */
export function getBreadcrumbLinks(path: string, customLabels?: Record<string, string>): InternalLink[] {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: InternalLink[] = [];

  let currentPath = '';
  segments.forEach(segment => {
    currentPath += `/${segment}`;
    const label = customLabels?.[segment] || formatSegmentLabel(segment);

    breadcrumbs.push({
      href: currentPath,
      text: label,
      title: `Navegar para ${label}`
    });
  });

  return breadcrumbs;
}

/**
 * Get anchor text variations for better SEO diversity
 */
export function getAnchorTextVariations(productName: string, brand?: string): string[] {
  const variations = [
    productName,
    `${productName} - ${brand || 'Premium'}`,
    `Comprar ${productName}`,
    `${productName} Original`,
    `${productName} Brasileiro`,
  ];

  if (brand) {
    variations.push(`${brand} ${productName}`);
  }

  return variations;
}

/**
 * Generate contextual links for a product page
 */
export function getProductPageLinks(
  productCategory: string,
  currentProductId: string
): CategoryLinks {
  // Main category links
  const mainLinks = MAIN_NAVIGATION.filter(link =>
    link.category === productCategory || link.priority === 'high'
  );

  // Related category links
  const relatedLinks = getRelatedCategoryLinks(productCategory);

  // Popular product links (these would be dynamic in real implementation)
  const popularLinks: InternalLink[] = [
    {
      href: '/mega-hair',
      text: 'Ver Mega Hair Mais Vendidos',
      title: 'Extensões de cabelo mais populares',
      priority: 'high'
    },
    {
      href: '/categoria/progressivas-alisamentos',
      text: 'Progressivas Best Sellers',
      title: 'Progressivas brasileiras mais vendidas',
      priority: 'high'
    },
  ];

  return {
    main: mainLinks,
    related: relatedLinks,
    popular: popularLinks
  };
}

/**
 * Get footer navigation structure
 */
export function getFooterLinks() {
  return {
    products: [
      { href: '/mega-hair', text: 'Mega Hair Brasileiro', description: 'Extensões 100% humanas' },
      { href: '/categoria/progressivas-alisamentos', text: 'Progressivas & Alisamentos', description: 'Tratamentos profissionais' },
      { href: '/categoria/tratamentos-capilares', text: 'Tratamentos Capilares', description: 'Cuidados especializados' },
      { href: '/maquiagens', text: 'Maquiagem Brasileira', description: 'Cosméticos originais' },
      { href: '/perfumes-brasileiros', text: 'Perfumes Brasileiros', description: 'Fragrâncias autênticas' },
      { href: '/produtos', text: 'Ver Todos os Produtos', description: 'Catálogo completo', featured: true },
    ],
    categories: [
      { href: '/categoria/shampoos-condicionadores', text: 'Shampoos & Condicionadores' },
      { href: '/categoria/ferramentas-profissionais', text: 'Ferramentas Profissionais' },
      { href: '/esmaltes-impala-portugal', text: 'Esmaltes Impala' },
      { href: '/progressiva-vogue-portugal', text: 'Progressiva Vogue' },
      { href: '/kits-completos', text: 'Kits Completos' },
    ],
    help: [
      { href: '/como-comprar', text: 'Como Comprar' },
      { href: '/envio-entrega', text: 'Envio e Entrega' },
      { href: '/formas-pagamento', text: 'Formas de Pagamento' },
      { href: '/trocas-devolucoes', text: 'Trocas e Devoluções' },
      { href: '/faq', text: 'FAQ - Perguntas Frequentes' },
    ],
    company: [
      { href: '/sobre', text: 'Sobre Nós' },
      { href: '/nossa-historia', text: 'Nossa História' },
      { href: '/contato', text: 'Contato' },
      { href: '/trabalhe-conosco', text: 'Trabalhe Conosco' },
      { href: '/blog', text: 'Blog' },
    ]
  };
}

/**
 * Prevent orphan pages - get emergency navigation links
 */
export function getEmergencyNavigation(): InternalLink[] {
  return [
    {
      href: '/',
      text: 'Voltar ao Início',
      title: 'Retornar à página inicial',
      priority: 'high'
    },
    {
      href: '/produtos',
      text: 'Ver Todos os Produtos',
      title: 'Explorar catálogo completo',
      priority: 'high'
    },
    {
      href: '/contato',
      text: 'Entre em Contato',
      title: 'Falar com nossa equipe',
      priority: 'medium'
    },
  ];
}

/**
 * Helper function to format segment labels
 */
function formatSegmentLabel(segment: string): string {
  const labelMap: Record<string, string> = {
    'produtos': 'Produtos',
    'produto': 'Produto',
    'categoria': 'Categoria',
    'mega-hair': 'Mega Hair',
    'progressivas-alisamentos': 'Progressivas & Alisamentos',
    'tratamentos-capilares': 'Tratamentos Capilares',
    'shampoos-condicionadores': 'Shampoos & Condicionadores',
    'ferramentas-profissionais': 'Ferramentas Profissionais',
    'maquiagens': 'Maquiagens',
    'perfumes-brasileiros': 'Perfumes Brasileiros',
  };

  return labelMap[segment] || segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate SEO-friendly link attributes
 */
export function getLinkAttributes(link: InternalLink): {
  href: string;
  title: string;
  rel?: string;
  'aria-label': string;
} {
  return {
    href: link.href,
    title: link.title,
    ...(link.rel && { rel: link.rel }),
    'aria-label': link.title || link.text,
  };
}

/**
 * Check if a link should be nofollow (external, affiliate, etc.)
 */
export function shouldNoFollow(href: string): boolean {
  // Add external domains or affiliate links here
  const nofollowPatterns = [
    /^https?:\/\/(www\.)?(facebook|instagram|twitter|tiktok)\.com/,
    /affiliate/i,
    /ref=/i,
  ];

  return nofollowPatterns.some(pattern => pattern.test(href));
}
