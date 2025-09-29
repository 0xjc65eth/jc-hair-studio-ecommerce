// Hreflang Configuration for Pan-European SEO
export const hreflangConfig = {
  // Primary Languages (5 main languages covering 90% of Europe)
  languages: [
    { code: 'pt-PT', name: 'Português', region: 'Portugal' },
    { code: 'es-ES', name: 'Español', region: 'España' },
    { code: 'fr-FR', name: 'Français', region: 'France' },
    { code: 'it-IT', name: 'Italiano', region: 'Italia' },
    { code: 'en-GB', name: 'English', region: 'United Kingdom' },
    { code: 'de-DE', name: 'Deutsch', region: 'Deutschland' },
  ],

  // Regional variations
  regionalVariations: {
    'pt': ['pt-PT', 'pt-BR'], // Portugal & Brazil diaspora
    'es': ['es-ES', 'es-MX', 'es-AR'], // Spain & Latin diaspora
    'fr': ['fr-FR', 'fr-BE', 'fr-CH', 'fr-LU'], // France, Belgium, Switzerland, Luxembourg
    'de': ['de-DE', 'de-AT', 'de-CH'], // Germany, Austria, Switzerland
    'en': ['en-GB', 'en-IE', 'en-US'], // UK, Ireland, US diaspora
    'nl': ['nl-NL', 'nl-BE'], // Netherlands, Belgium
    'it': ['it-IT', 'it-CH'], // Italy, Switzerland
  },

  // Default language
  defaultLanguage: 'en-GB',

  // X-default for unmatched languages
  xDefault: 'en-GB',
};

export function generateHreflangTags(currentPath: string, currentLang: string) {
  const tags = [];

  // Generate hreflang for all languages
  for (const lang of hreflangConfig.languages) {
    tags.push({
      rel: 'alternate',
      hreflang: lang.code,
      href: `https://jchairstudios62.xyz/${lang.code.toLowerCase()}${currentPath}`
    });
  }

  // Add x-default
  tags.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `https://jchairstudios62.xyz${currentPath}`
  });

  return tags;
}

// Currency configuration per region
export const currencyByRegion = {
  'EUR': ['PT', 'ES', 'FR', 'IT', 'DE', 'BE', 'NL', 'AT', 'LU', 'IE', 'FI', 'GR'],
  'GBP': ['GB'],
  'CHF': ['CH'],
  'SEK': ['SE'],
  'DKK': ['DK'],
  'PLN': ['PL'],
  'RON': ['RO'],
};

// Shipping zones for Europe
export const shippingZones = {
  zone1: {
    countries: ['PT', 'ES', 'FR'],
    deliveryTime: '3-5 dias',
    shippingCost: 9.90,
    freeShippingThreshold: 150,
  },
  zone2: {
    countries: ['IT', 'DE', 'BE', 'NL', 'LU'],
    deliveryTime: '5-7 dias',
    shippingCost: 14.90,
    freeShippingThreshold: 200,
  },
  zone3: {
    countries: ['GB', 'IE', 'AT', 'CH'],
    deliveryTime: '7-10 dias',
    shippingCost: 19.90,
    freeShippingThreshold: 250,
  },
  zone4: {
    countries: ['PL', 'RO', 'GR', 'SE', 'DK', 'FI'],
    deliveryTime: '10-14 dias',
    shippingCost: 24.90,
    freeShippingThreshold: 300,
  },
};

// Market-specific beauty preferences
export const marketPreferences = {
  'PT': {
    popularProducts: ['mega-hair', 'progressivas', 'esmaltes'],
    priceRange: 'medium',
    preferredBrands: ['IMPALA', 'WEPINK', 'Mari Maria'],
  },
  'ES': {
    popularProducts: ['tintas', 'tratamentos', 'maquiagens'],
    priceRange: 'medium-low',
    preferredBrands: ['L\'Oréal', 'Garnier', 'Beauty Color'],
  },
  'FR': {
    popularProducts: ['perfumes', 'maquiagens', 'tratamentos-premium'],
    priceRange: 'high',
    preferredBrands: ['WEPINK', 'Virginia', 'Alfaparf'],
  },
  'IT': {
    popularProducts: ['tintas-premium', 'progressivas', 'bases'],
    priceRange: 'medium-high',
    preferredBrands: ['Alfaparf', 'Mari Maria', 'COCOCHOCO'],
  },
  'DE': {
    popularProducts: ['tratamentos', 'produtos-organicos', 'progressivas'],
    priceRange: 'high',
    preferredBrands: ['COCOCHOCO', 'Bio Extratus', 'Organic'],
  },
  'GB': {
    popularProducts: ['mega-hair', 'esmaltes', 'perfumes'],
    priceRange: 'medium-high',
    preferredBrands: ['IMPALA', 'Virginia', 'WEPINK'],
  },
};