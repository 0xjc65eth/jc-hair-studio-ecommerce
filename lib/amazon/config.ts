export const AMAZON_CONFIG = {
  // Amazon SP-API Configuration
  region: 'NA', // North America (includes Brazil)
  marketplace: {
    US: 'ATVPDKIKX0DER',
    BR: 'A2Q3Y263D00KWC', // Amazon Brazil
    CA: 'A2EUQ1WTGCTBG2',
    MX: 'A1AM78C64UM0Y8'
  },

  // Endpoints
  endpoints: {
    production: 'https://sellingpartnerapi-na.amazon.com',
    sandbox: 'https://sandbox.sellingpartnerapi-na.amazon.com'
  },

  // Default marketplace for Brazil
  defaultMarketplace: 'A2Q3Y263D00KWC',

  // API Scopes needed for our application
  scopes: [
    'sellingpartnerapi::listings',
    'sellingpartnerapi::orders',
    'sellingpartnerapi::inventory',
    'sellingpartnerapi::reports',
    'sellingpartnerapi::catalog',
    'sellingpartnerapi::feeds'
  ]
};

export const AMAZON_CATEGORIES = {
  // Beauty & Personal Care categories for hair products
  HAIR_CARE: 'Beauty',
  HAIR_EXTENSIONS: 'Beauty',
  HAIR_TREATMENTS: 'Beauty',
  NAIL_POLISH: 'Beauty',
  MAKEUP: 'Beauty',
  PERFUMES: 'Beauty'
};

export const AMAZON_PRODUCT_TYPES = {
  HAIR_EXTENSION: 'BEAUTY',
  HAIR_CARE: 'BEAUTY',
  NAIL_POLISH: 'BEAUTY',
  MAKEUP: 'BEAUTY',
  PERFUME: 'BEAUTY'
};