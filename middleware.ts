// Geo-targeting Middleware for Pan-European SEO
import { NextRequest, NextResponse } from 'next/server';

// Supported locales for 27+ European countries
const locales = [
  'pt-PT', // Portugal
  'es-ES', // Spain
  'fr-FR', // France
  'it-IT', // Italy
  'de-DE', // Germany
  'en-GB', // United Kingdom
  'nl-NL', // Netherlands
  'pl-PL', // Poland
  'ro-RO', // Romania
  'sv-SE', // Sweden
  'da-DK', // Denmark
  'fi-FI', // Finland
  'el-GR', // Greece
  'cs-CZ', // Czech Republic
  'sk-SK', // Slovakia
  'hu-HU', // Hungary
  'bg-BG', // Bulgaria
  'hr-HR', // Croatia
  'sl-SI', // Slovenia
  'et-EE', // Estonia
  'lv-LV', // Latvia
  'lt-LT', // Lithuania
  'mt-MT', // Malta
  'cy-CY', // Cyprus
  'en-IE', // Ireland
  'fr-BE', // Belgium (French)
  'de-AT', // Austria
  'fr-LU', // Luxembourg
];

// Country to language mapping
const countryToLocale = {
  'PT': 'pt-PT',
  'ES': 'es-ES',
  'FR': 'fr-FR',
  'IT': 'it-IT',
  'DE': 'de-DE',
  'GB': 'en-GB',
  'NL': 'nl-NL',
  'BE': 'fr-BE', // Default to French for Belgium
  'AT': 'de-AT',
  'CH': 'de-DE', // Default to German for Switzerland
  'LU': 'fr-LU',
  'IE': 'en-IE',
  'PL': 'pl-PL',
  'RO': 'ro-RO',
  'GR': 'el-GR',
  'SE': 'sv-SE',
  'DK': 'da-DK',
  'FI': 'fi-FI',
  'CZ': 'cs-CZ',
  'SK': 'sk-SK',
  'HU': 'hu-HU',
  'BG': 'bg-BG',
  'HR': 'hr-HR',
  'SI': 'sl-SI',
  'EE': 'et-EE',
  'LV': 'lv-LV',
  'LT': 'lt-LT',
  'MT': 'mt-MT',
  'CY': 'cy-CY',
};

const defaultLocale = 'en-GB';

// Get locale from Accept-Language header
function getLocale(request: NextRequest): string {
  // Get country from Cloudflare/Vercel headers
  const country = request.headers.get('CF-IPCountry') ||
                 request.headers.get('X-Vercel-IP-Country');

  // If country is available and European, use country-specific locale
  if (country && countryToLocale[country]) {
    return countryToLocale[country];
  }

  return defaultLocale;
}

// Currency mapping for different regions
const getCurrency = (locale: string, country?: string) => {
  // Eurozone countries
  const eurozoneCountries = [
    'PT', 'ES', 'FR', 'IT', 'DE', 'BE', 'NL', 'AT', 'LU', 'IE',
    'FI', 'GR', 'EE', 'LV', 'LT', 'SK', 'SI', 'CY', 'MT'
  ];

  if (country && eurozoneCountries.includes(country)) return 'EUR';

  const currencyMap = {
    'en-GB': 'GBP',
    'en-IE': 'EUR',
    'de-CH': 'CHF',
    'fr-CH': 'CHF',
    'sv-SE': 'SEK',
    'da-DK': 'DKK',
    'pl-PL': 'PLN',
    'ro-RO': 'RON',
    'cs-CZ': 'CZK',
    'hu-HU': 'HUF',
    'bg-BG': 'BGN',
    'hr-HR': 'HRK',
  };

  return currencyMap[locale] || 'EUR';
};

export function middleware(request: NextRequest) {
  // Temporarily disabled to restore original functionality
  return NextResponse.next();
}

export const config = {
  // Match all pathnames except for API routes and static files
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - feed (product feed for Google Merchant)
     * - .xml files (XML feeds)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|feed|feed\\.xml|product-feed\\.xml|.*\\.xml|.*\\..*|robots\\.txt|sitemap\\.xml).*)',
  ],
};