/**
 * JC Hair Studio's 62 - Product Bundles/Kits Data
 *
 * Predefined product bundles with automatic discount application
 * Bundles are automatically detected when products are in the cart
 */

import { Bundle, BundleCategory } from '../types/bundle';

/**
 * All available product bundles
 */
export const bundles: Bundle[] = [
  // BUNDLE 1: Mega Hair Complete Care (15% off)
  {
    id: 'bundle-mega-hair-care',
    name: 'Kit Mega Hair Completo',
    description:
      'Kit completo para cuidar do seu mega hair! Inclui extensão + shampoo + condicionador profissional. Economize 15% comprando o kit.',
    category: BundleCategory.MEGA_HAIR,
    products: [
      {
        productId: '1', // Mega Hair product (any)
        quantity: 1,
        required: true,
        alternatives: ['2', '3', '4', '5', '6', '7', '8', '9', '10'], // Accept any mega hair
      },
      {
        productId: 'cocochoco-shampoo-gold',
        quantity: 1,
        required: true,
        alternatives: ['cocochoco-shampoo-original'], // Alternative shampoo
      },
      {
        productId: 'cocochoco-conditioner-gold',
        quantity: 1,
        required: true,
        alternatives: ['cocochoco-conditioner-original'], // Alternative conditioner
      },
    ],
    discount: {
      type: 'percentage',
      value: 15,
    },
    badge: 'POUPE 15%',
    image: '/images/bundles/mega-hair-complete-kit.jpg',
    isActive: true,
    priority: 1,
    tags: ['mega-hair', 'cuidados', 'kit-completo', 'promocao'],
    slug: 'kit-mega-hair-completo',
  },

  // BUNDLE 2: 3x Progressivas (20% off)
  {
    id: 'bundle-progressivas-3x',
    name: 'Kit 3x Progressivas Brasileiras',
    description:
      'Compre 3 progressivas e economize 20%! Escolha entre Cocochoco, Tzaha e outras marcas premium. Perfeito para profissionais ou uso prolongado.',
    category: BundleCategory.TRATAMENTOS,
    products: [
      {
        productId: 'cocochoco-original-premium',
        quantity: 3,
        required: false,
        alternatives: [
          'cocochoco-gold-premium',
          'tzaha-diamante-total-liss',
          'prog-001',
          'prog-002',
          'prog-003',
        ],
      },
    ],
    discount: {
      type: 'percentage',
      value: 20,
      minQuantity: 3,
    },
    badge: 'POUPE 20%',
    image: '/images/bundles/progressivas-3x-kit.jpg',
    isActive: true,
    priority: 2,
    tags: ['progressiva', 'tratamento', 'profissional', 'economia'],
    slug: 'kit-3x-progressivas',
  },

  // BUNDLE 3: Kit Maquiagem Completo (25% off)
  {
    id: 'bundle-makeup-complete',
    name: 'Kit Maquiagem Completo',
    description:
      'Kit completo de maquiagem com base + batom + sombra. Escolha seus produtos favoritos da Mari Maria, Bruna Tavares ou PAM by Pamella e economize 25%!',
    category: BundleCategory.MAQUIAGEM,
    products: [
      {
        productId: 'mari-maria-base-amndoa',
        quantity: 1,
        required: false,
        alternatives: [
          // Mari Maria bases
          'mari-maria-base-baunilha',
          'mari-maria-base-bege-claro',
          'mari-maria-base-cacau',
          // Wepink bases
          'wepink-virginia-base-cor-01',
          'wepink-virginia-base-cor-02',
          'wepink-virginia-base-cor-03',
          // Fran bases
          'base-fran-c01',
          'base-fran-m01',
        ],
      },
      {
        productId: 'bt-lips-bruna',
        quantity: 1,
        required: false,
        alternatives: [
          'bt-lips-amanda',
          'bt-lips-flavia',
          'pam-batom-cancun',
          'pam-batom-maldivas',
          'mari-maria-creamy-matte-blazing',
        ],
      },
      {
        productId: 'pam-paleta-sombras',
        quantity: 1,
        required: false,
        alternatives: ['bt-velvet-black', 'bt-velvet-hermione'],
      },
    ],
    discount: {
      type: 'percentage',
      value: 25,
    },
    badge: 'POUPE 25%',
    image: '/images/bundles/makeup-complete-kit.jpg',
    isActive: true,
    priority: 3,
    tags: ['maquiagem', 'kit-completo', 'makeup', 'promocao-especial'],
    slug: 'kit-maquiagem-completo',
  },

  // BUNDLE 4: Duo Batom + Lápis (10% off)
  {
    id: 'bundle-batom-lapis',
    name: 'Duo Perfeito: Batom + Lápis',
    description:
      'Combine batom líquido com lápis de boca para um acabamento impecável. Economize 10% no duo!',
    category: BundleCategory.MAQUIAGEM,
    products: [
      {
        productId: 'bt-lips-amanda',
        quantity: 1,
        required: false,
        alternatives: [
          'bt-lips-bruna',
          'bt-lips-flavia',
          'mari-maria-creamy-matte-blazing',
          'pam-batom-cancun',
        ],
      },
      {
        productId: 'bt-lipshape-beige-rose',
        quantity: 1,
        required: false,
        alternatives: [
          'bt-lipshape-beige-camel',
          'bt-lipshape-marsala',
          'bt-lipshape-red-carpet',
        ],
      },
    ],
    discount: {
      type: 'percentage',
      value: 10,
    },
    badge: 'COMBO',
    image: '/images/bundles/batom-lapis-duo.jpg',
    isActive: true,
    priority: 4,
    tags: ['maquiagem', 'batom', 'lapis', 'combo'],
    slug: 'duo-batom-lapis',
  },

  // BUNDLE 5: Kit Tratamento Capilar Profissional (18% off)
  {
    id: 'bundle-tratamento-profissional',
    name: 'Kit Tratamento Profissional',
    description:
      'Kit profissional com progressiva + botox + shampoo + máscara. Tudo que você precisa para transformar qualquer cabelo. Economize 18%!',
    category: BundleCategory.PROFISSIONAL,
    products: [
      {
        productId: 'cocochoco-original-premium',
        quantity: 1,
        required: true,
        alternatives: ['cocochoco-gold-premium', 'tzaha-diamante-total-liss'],
      },
      {
        productId: 'cocochoco-shampoo-gold',
        quantity: 1,
        required: true,
      },
      {
        productId: 'cocochoco-conditioner-gold',
        quantity: 1,
        required: true,
      },
    ],
    discount: {
      type: 'percentage',
      value: 18,
    },
    badge: 'KIT PROFISSIONAL',
    image: '/images/bundles/tratamento-profissional.jpg',
    isActive: true,
    priority: 5,
    tags: ['profissional', 'tratamento', 'completo', 'salao'],
    slug: 'kit-tratamento-profissional',
  },

  // BUNDLE 6: Buy 2 Get 1 Free - Esmaltes
  {
    id: 'bundle-esmaltes-2-1',
    name: 'Compre 2 Esmaltes, Leve 3!',
    description:
      'Promoção especial de esmaltes IMPALA: compre 2 e ganhe o 3º de presente! Escolha suas cores favoritas.',
    category: BundleCategory.PROMOCIONAL,
    products: [
      {
        productId: 'impala-esmalte-vermelho',
        quantity: 3,
        required: false,
        // Any esmalte works
      },
    ],
    discount: {
      type: 'buy_x_get_y',
      value: 0,
      buyXGetY: {
        buy: 2,
        get: 1,
      },
    },
    badge: 'LEVE 3 PAGUE 2',
    image: '/images/bundles/esmaltes-buy-2-get-1.jpg',
    isActive: true,
    priority: 6,
    tags: ['esmaltes', 'impala', 'promocao', 'leve-3-pague-2'],
    slug: 'esmaltes-leve-3-pague-2',
  },

  // BUNDLE 7: Kit PAM Completo (22% off)
  {
    id: 'bundle-pam-completo',
    name: 'Kit PAM by Pamella Completo',
    description:
      'Kit completo PAM: batom + gloss + paleta de sombras + máscara para cílios. Maquiagem completa com 22% de desconto!',
    category: BundleCategory.MAQUIAGEM,
    products: [
      {
        productId: 'pam-batom-cancun',
        quantity: 1,
        required: false,
        alternatives: ['pam-batom-maldivas', 'pam-batom-punta-cana'],
      },
      {
        productId: 'pam-gloss-dubai',
        quantity: 1,
        required: false,
        alternatives: ['pam-gloss-miami', 'pam-gloss-las-vegas'],
      },
      {
        productId: 'pam-paleta-sombras',
        quantity: 1,
        required: true,
      },
      {
        productId: 'pam-mascara',
        quantity: 1,
        required: true,
      },
    ],
    discount: {
      type: 'percentage',
      value: 22,
    },
    badge: 'KIT EXCLUSIVO',
    image: '/images/bundles/pam-kit-completo.jpg',
    isActive: true,
    priority: 7,
    tags: ['pam-by-pamella', 'maquiagem', 'kit-completo', 'exclusivo'],
    slug: 'kit-pam-completo',
  },

  // BUNDLE 8: Duo Perfumes (12% off)
  {
    id: 'bundle-perfumes-duo',
    name: 'Duo de Perfumes',
    description:
      'Escolha 2 perfumes da nossa coleção WEPINK ou O Boticário e ganhe 12% de desconto. Perfeito para presentear ou ter opções!',
    category: BundleCategory.COMPLETO,
    products: [
      {
        productId: 'wepink-perfume-1',
        quantity: 2,
        required: false,
        // Any perfume works
      },
    ],
    discount: {
      type: 'percentage',
      value: 12,
      minQuantity: 2,
    },
    badge: 'DUO PERFUMES',
    image: '/images/bundles/perfumes-duo.jpg',
    isActive: true,
    priority: 8,
    tags: ['perfumes', 'fragrancia', 'duo', 'presente'],
    slug: 'duo-perfumes',
  },

  // BUNDLE 9: Kit Mari Maria Bestsellers (20% off)
  {
    id: 'bundle-mari-maria-bestsellers',
    name: 'Kit Mari Maria Bestsellers',
    description:
      'Os produtos mais vendidos da Mari Maria em um kit especial: base + batom cremoso + gloss plump. Economize 20%!',
    category: BundleCategory.MAQUIAGEM,
    products: [
      {
        productId: 'mari-maria-base-amndoa',
        quantity: 1,
        required: false,
        alternatives: [
          'mari-maria-base-baunilha',
          'mari-maria-base-bege-claro',
          'mari-maria-base-cacau',
        ],
      },
      {
        productId: 'mari-maria-creamy-matte-blazing',
        quantity: 1,
        required: false,
        alternatives: [
          'mari-maria-creamy-matte-classy',
          'mari-maria-creamy-matte-hera',
        ],
      },
      {
        productId: 'mari-maria-plump-fire-bergamota',
        quantity: 1,
        required: false,
        alternatives: ['mari-maria-plump-fire-bubble-gum'],
      },
    ],
    discount: {
      type: 'percentage',
      value: 20,
    },
    badge: 'BESTSELLERS',
    image: '/images/bundles/mari-maria-bestsellers.jpg',
    isActive: true,
    priority: 9,
    tags: ['mari-maria', 'bestsellers', 'maquiagem', 'kit'],
    slug: 'kit-mari-maria-bestsellers',
  },

  // BUNDLE 10: Kit Mega Hair Premium (30% off)
  {
    id: 'bundle-mega-hair-premium-3x',
    name: 'Kit Premium 3 Mega Hair',
    description:
      'Kit premium com 3 extensões de mega hair + kit manutenção completo. Ideal para transformações completas. Economia de 30%!',
    category: BundleCategory.MEGA_HAIR,
    products: [
      {
        productId: '1',
        quantity: 3,
        required: false,
        alternatives: ['2', '3', '4', '5', '6', '7', '8', '9', '10'],
      },
      {
        productId: 'cocochoco-shampoo-gold',
        quantity: 1,
        required: true,
      },
      {
        productId: 'cocochoco-conditioner-gold',
        quantity: 1,
        required: true,
      },
    ],
    discount: {
      type: 'percentage',
      value: 30,
      minQuantity: 3,
    },
    badge: 'SUPER OFERTA',
    image: '/images/bundles/mega-hair-premium-3x.jpg',
    isActive: true,
    priority: 10,
    tags: ['mega-hair', 'premium', 'super-oferta', 'profissional'],
    slug: 'kit-mega-hair-premium-3x',
  },
];

/**
 * Get all active bundles
 */
export function getActiveBundles(): Bundle[] {
  const now = new Date();
  return bundles
    .filter((bundle) => {
      if (!bundle.isActive) return false;
      if (bundle.startDate && now < bundle.startDate) return false;
      if (bundle.endDate && now > bundle.endDate) return false;
      return true;
    })
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Get bundle by ID
 */
export function getBundleById(id: string): Bundle | undefined {
  return bundles.find((bundle) => bundle.id === id);
}

/**
 * Get bundles by category
 */
export function getBundlesByCategory(
  category: BundleCategory
): Bundle[] {
  return getActiveBundles().filter(
    (bundle) => bundle.category === category
  );
}

/**
 * Get bundles by tag
 */
export function getBundlesByTag(tag: string): Bundle[] {
  return getActiveBundles().filter((bundle) =>
    bundle.tags.includes(tag.toLowerCase())
  );
}

/**
 * Search bundles by name or description
 */
export function searchBundles(query: string): Bundle[] {
  const lowerQuery = query.toLowerCase();
  return getActiveBundles().filter(
    (bundle) =>
      bundle.name.toLowerCase().includes(lowerQuery) ||
      bundle.description.toLowerCase().includes(lowerQuery) ||
      bundle.tags.some((tag) => tag.includes(lowerQuery))
  );
}

export default bundles;
