/**
 * JC Hair Studio's 62 - Application Constants
 *
 * Centralized configuration constants for the e-commerce platform.
 * This file contains all the application-wide constants used throughout
 * the JC Hair Studio's 62 hair extension e-commerce platform.
 *
 * @author JC Hair Studio
 * @version 1.0.0
 */

// =================================
// BUSINESS CONFIGURATION
// =================================

/** Company information and branding constants */
export const COMPANY = {
  /** Official business name */
  NAME: 'JC Hair Studio\'s 62',

  /** Business description for SEO and marketing */
  DESCRIPTION: 'E-commerce de extensões de cabelo - JC Hair Studio\'s 62',

  /** Business email for customer support */
  SUPPORT_EMAIL: 'contato@jchairstudio62.com',

  /** WhatsApp number for customer support */
  WHATSAPP: '+351912345678',

  /** Business address */
  ADDRESS: 'Portugal',
} as const;

// =================================
// PRODUCT CONFIGURATION
// =================================

/** Product-related constants and limits */
export const PRODUCTS = {
  /** Maximum number of products to display per page */
  PER_PAGE: 24,

  /** Maximum number of related products to show */
  RELATED_LIMIT: 8,

  /** Maximum number of featured products on homepage */
  FEATURED_LIMIT: 12,

  /** Supported image formats for product uploads */
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp'] as const,

  /** Maximum file size for product images in MB */
  MAX_IMAGE_SIZE_MB: 5,
} as const;

// =================================
// CART & ORDER CONFIGURATION
// =================================

/** Shopping cart and order processing constants */
export const CART = {
  /** Maximum quantity per product in cart */
  MAX_QUANTITY_PER_ITEM: 10,

  /** Minimum order value for free shipping (in EUR) */
  FREE_SHIPPING_THRESHOLD: 50,

  /** Default shipping cost (in EUR) */
  DEFAULT_SHIPPING_COST: 5.99,

  /** Cart session storage key */
  STORAGE_KEY: 'jc-cart-storage',

  /** Cart persistence timeout in days */
  PERSISTENCE_DAYS: 30,
} as const;

/** Valid promotional codes with their discount percentages */
export const PROMO_CODES = {
  /** Welcome discount for new customers */
  'BEMVINDO20': 20,

  /** General discount promotion */
  'DESCONTO20': 20,

  /** Promotional campaign discount */
  'PROMO20': 20,
} as const;

// =================================
// UI/UX CONFIGURATION
// =================================

/** User interface and experience settings */
export const UI = {
  /** Available locales for internationalization */
  LOCALES: ['pt', 'en'] as const,

  /** Default locale */
  DEFAULT_LOCALE: 'pt' as const,

  /** Animation duration in milliseconds */
  ANIMATION_DURATION: 300,

  /** Debounce delay for search input in milliseconds */
  SEARCH_DEBOUNCE_MS: 300,

  /** Mobile breakpoint in pixels */
  MOBILE_BREAKPOINT: 768,

  /** Items per page for pagination */
  PAGINATION_SIZES: [12, 24, 48] as const,
} as const;

// =================================
// API CONFIGURATION
// =================================

/** API endpoints and configuration */
export const API = {
  /** Base URL for internal API calls */
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  /** API timeout in milliseconds */
  TIMEOUT_MS: 10000,

  /** Rate limiting - requests per minute */
  RATE_LIMIT_PER_MINUTE: 60,

  /** Pagination limits */
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 20,
} as const;

// =================================
// PAYMENT CONFIGURATION
// =================================

/** Payment processing settings */
export const PAYMENTS = {
  /** Supported currencies */
  CURRENCIES: ['EUR', 'USD'] as const,

  /** Default currency */
  DEFAULT_CURRENCY: 'EUR' as const,

  /** Supported payment methods */
  SUPPORTED_METHODS: [
    'CREDIT_CARD',
    'DEBIT_CARD',
    'PAYPAL',
    'PIX',
    'SEPA',
    'MULTIBANCO'
  ] as const,

  /** Tax rate percentage */
  TAX_RATE: 0.23, // 23% IVA in Portugal
} as const;

// =================================
// HAIR PRODUCT SPECIFICATIONS
// =================================

/** Hair extension specific constants */
export const HAIR = {
  /** Available hair lengths in centimeters */
  LENGTHS: [40, 50, 60, 70, 80] as const,

  /** Hair texture types */
  TEXTURES: ['STRAIGHT', 'WAVY', 'CURLY', 'COILY'] as const,

  /** Hair quality grades */
  QUALITY_GRADES: ['PREMIUM', 'PROFESSIONAL', 'STANDARD'] as const,

  /** Available hair colors (basic color names) */
  BASIC_COLORS: [
    'PRETO',
    'CASTANHO_ESCURO',
    'CASTANHO',
    'CASTANHO_CLARO',
    'LOIRO_ESCURO',
    'LOIRO',
    'LOIRO_CLARO'
  ] as const,
} as const;

// =================================
// SEO CONFIGURATION
// =================================

/** Search engine optimization constants */
export const SEO = {
  /** Default meta title suffix */
  TITLE_SUFFIX: ' | JC Hair Studio\'s 62',

  /** Maximum meta title length */
  MAX_TITLE_LENGTH: 60,

  /** Maximum meta description length */
  MAX_DESCRIPTION_LENGTH: 160,

  /** Default meta keywords */
  DEFAULT_KEYWORDS: [
    'extensões de cabelo',
    'hair extensions',
    'mega hair',
    'cabelo natural',
    'Portugal'
  ],

  /** Open Graph image dimensions */
  OG_IMAGE_WIDTH: 1200,
  OG_IMAGE_HEIGHT: 630,
} as const;

// =================================
// ERROR MESSAGES
// =================================

/** Standardized error messages for the application */
export const ERRORS = {
  /** Generic error messages */
  GENERIC: {
    UNKNOWN: 'Ocorreu um erro inesperado. Tente novamente.',
    NETWORK: 'Erro de conexão. Verifique sua internet.',
    SERVER: 'Erro interno do servidor. Tente novamente mais tarde.',
  },

  /** Authentication error messages */
  AUTH: {
    INVALID_CREDENTIALS: 'Email ou senha incorretos.',
    USER_NOT_FOUND: 'Usuário não encontrado.',
    EMAIL_ALREADY_EXISTS: 'Este email já está em uso.',
    WEAK_PASSWORD: 'A senha deve ter pelo menos 8 caracteres.',
  },

  /** Product related error messages */
  PRODUCTS: {
    NOT_FOUND: 'Produto não encontrado.',
    OUT_OF_STOCK: 'Produto esgotado.',
    INVALID_QUANTITY: 'Quantidade inválida.',
  },

  /** Cart related error messages */
  CART: {
    ITEM_NOT_FOUND: 'Item não encontrado no carrinho.',
    MAX_QUANTITY_EXCEEDED: `Quantidade máxima de ${CART.MAX_QUANTITY_PER_ITEM} excedida.`,
    EMPTY_CART: 'Seu carrinho está vazio.',
  },
} as const;

// =================================
// SUCCESS MESSAGES
// =================================

/** Standardized success messages */
export const SUCCESS = {
  /** Authentication success messages */
  AUTH: {
    LOGIN: 'Login realizado com sucesso!',
    LOGOUT: 'Logout realizado com sucesso!',
    REGISTER: 'Conta criada com sucesso!',
  },

  /** Cart success messages */
  CART: {
    ITEM_ADDED: 'Produto adicionado ao carrinho!',
    ITEM_REMOVED: 'Produto removido do carrinho!',
    QUANTITY_UPDATED: 'Quantidade atualizada!',
  },

  /** Order success messages */
  ORDER: {
    PLACED: 'Pedido realizado com sucesso!',
    PAYMENT_CONFIRMED: 'Pagamento confirmado!',
  },
} as const;

// =================================
// TYPE EXPORTS
// =================================

/** Export types for TypeScript usage */
export type PromoCode = keyof typeof PROMO_CODES;
export type Locale = typeof UI.LOCALES[number];
export type Currency = typeof PAYMENTS.CURRENCIES[number];
export type PaymentMethod = typeof PAYMENTS.SUPPORTED_METHODS[number];
export type HairTexture = typeof HAIR.TEXTURES[number];
export type HairLength = typeof HAIR.LENGTHS[number];