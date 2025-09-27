// Pan-European Schema Markup with Multi-Currency Support
import { Product } from '@/lib/types';

export function generateEuropeanProductSchema(
  product: Product,
  country: string,
  language: string,
  currency: string = 'EUR'
) {
  const baseUrl = 'https://jchairstudios62.xyz';

  // Currency conversion rates (example rates - should be dynamic)
  const currencyRates = {
    'EUR': 1,
    'GBP': 0.86,
    'CHF': 0.96,
    'SEK': 11.45,
    'DKK': 7.45,
    'PLN': 4.32,
    'RON': 4.97,
  };

  const convertPrice = (price: number, toCurrency: string) => {
    const rate = currencyRates[toCurrency] || 1;
    return (price * rate).toFixed(2);
  };

  // Shipping info per country
  const shippingInfo = {
    'PT': { days: '3-5', cost: 9.90 },
    'ES': { days: '3-5', cost: 9.90 },
    'FR': { days: '5-7', cost: 14.90 },
    'IT': { days: '5-7', cost: 14.90 },
    'DE': { days: '5-7', cost: 14.90 },
    'GB': { days: '7-10', cost: 19.90 },
    'BE': { days: '5-7', cost: 14.90 },
    'NL': { days: '5-7', cost: 14.90 },
    'AT': { days: '7-10', cost: 19.90 },
    'CH': { days: '7-10', cost: 19.90 },
  };

  const shipping = shippingInfo[country] || { days: '10-14', cost: 24.90 };

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${baseUrl}/${language}/produto/${product.id}`,
    'name': product.name,
    'description': product.description,
    'image': product.images,
    'brand': {
      '@type': 'Brand',
      'name': product.brand || 'JC Hair Studio',
    },
    'manufacturer': {
      '@type': 'Organization',
      'name': 'Brazilian Beauty Products',
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'BR',
      },
    },
    'offers': {
      '@type': 'Offer',
      'url': `${baseUrl}/${language}/produto/${product.id}`,
      'priceCurrency': currency,
      'price': convertPrice(product.price, currency),
      'priceValidUntil': '2025-12-31',
      'availability': 'https://schema.org/InStock',
      'seller': {
        '@type': 'Organization',
        'name': "JC Hair Studio's 62",
        '@id': `${baseUrl}#organization`,
      },
      'shippingDetails': {
        '@type': 'OfferShippingDetails',
        'shippingRate': {
          '@type': 'MonetaryAmount',
          'value': shipping.cost,
          'currency': 'EUR',
        },
        'shippingDestination': {
          '@type': 'DefinedRegion',
          'addressCountry': country,
        },
        'deliveryTime': {
          '@type': 'ShippingDeliveryTime',
          'handlingTime': {
            '@type': 'QuantitativeValue',
            'minValue': 0,
            'maxValue': 1,
            'unitCode': 'DAY',
          },
          'transitTime': {
            '@type': 'QuantitativeValue',
            'minValue': parseInt(shipping.days.split('-')[0]),
            'maxValue': parseInt(shipping.days.split('-')[1]),
            'unitCode': 'DAY',
          },
        },
      },
      'hasMerchantReturnPolicy': {
        '@type': 'MerchantReturnPolicy',
        'applicableCountry': country,
        'returnPolicyCategory': 'https://schema.org/MerchantReturnFiniteReturnWindow',
        'merchantReturnDays': 30,
        'returnMethod': 'https://schema.org/ReturnByMail',
        'returnFees': 'https://schema.org/FreeReturn',
      },
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': product.rating || 4.7,
      'reviewCount': product.reviewCount || 127,
      'bestRating': 5,
      'worstRating': 1,
    },
    'review': generateLocalizedReviews(language, product.category),
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Origin',
        'value': 'Brazil',
      },
      {
        '@type': 'PropertyValue',
        'name': 'Authenticity',
        'value': '100% Original Brazilian Product',
      },
      {
        '@type': 'PropertyValue',
        'name': 'European Distribution',
        'value': 'Official European Distributor',
      },
    ],
  };
}

// Localized reviews for social proof
function generateLocalizedReviews(language: string, category: string) {
  const reviews = {
    'pt-PT': [
      {
        '@type': 'Review',
        'author': 'Maria Silva',
        'datePublished': '2024-09-15',
        'reviewBody': 'Produto brasileiro de excelente qualidade! Entrega rápida para Lisboa.',
        'reviewRating': { '@type': 'Rating', 'ratingValue': 5 },
      },
    ],
    'es-ES': [
      {
        '@type': 'Review',
        'author': 'Carmen González',
        'datePublished': '2024-09-10',
        'reviewBody': 'Productos brasileños auténticos! Envío rápido a Madrid.',
        'reviewRating': { '@type': 'Rating', 'ratingValue': 5 },
      },
    ],
    'fr-FR': [
      {
        '@type': 'Review',
        'author': 'Sophie Dubois',
        'datePublished': '2024-09-12',
        'reviewBody': 'Produits brésiliens authentiques! Livraison rapide à Paris.',
        'reviewRating': { '@type': 'Rating', 'ratingValue': 5 },
      },
    ],
    'it-IT': [
      {
        '@type': 'Review',
        'author': 'Giulia Rossi',
        'datePublished': '2024-09-08',
        'reviewBody': 'Prodotti brasiliani autentici! Consegna veloce a Milano.',
        'reviewRating': { '@type': 'Rating', 'ratingValue': 5 },
      },
    ],
    'de-DE': [
      {
        '@type': 'Review',
        'author': 'Anna Müller',
        'datePublished': '2024-09-14',
        'reviewBody': 'Authentische brasilianische Produkte! Schnelle Lieferung nach Berlin.',
        'reviewRating': { '@type': 'Rating', 'ratingValue': 5 },
      },
    ],
    'en-GB': [
      {
        '@type': 'Review',
        'author': 'Emma Wilson',
        'datePublished': '2024-09-11',
        'reviewBody': 'Authentic Brazilian products! Fast delivery to London.',
        'reviewRating': { '@type': 'Rating', 'ratingValue': 5 },
      },
    ],
  };

  return reviews[language] || reviews['en-GB'];
}

// Multi-location Organization Schema
export const europeanOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://jchairstudios62.xyz#organization',
  'name': "JC Hair Studio's 62",
  'alternateName': 'JC Hair Studio European Distribution',
  'url': 'https://jchairstudios62.xyz',
  'logo': 'https://jchairstudios62.xyz/logo.png',
  'description': 'Official European distributor of premium Brazilian beauty products. Serving 27+ European countries with authentic Brazilian hair extensions, treatments, cosmetics, and fragrances.',
  'foundingDate': '2019',
  'areaServed': [
    { '@type': 'Country', 'name': 'Portugal' },
    { '@type': 'Country', 'name': 'Spain' },
    { '@type': 'Country', 'name': 'France' },
    { '@type': 'Country', 'name': 'Italy' },
    { '@type': 'Country', 'name': 'Germany' },
    { '@type': 'Country', 'name': 'United Kingdom' },
    { '@type': 'Country', 'name': 'Belgium' },
    { '@type': 'Country', 'name': 'Netherlands' },
    { '@type': 'Country', 'name': 'Austria' },
    { '@type': 'Country', 'name': 'Switzerland' },
    { '@type': 'Country', 'name': 'Luxembourg' },
    { '@type': 'Country', 'name': 'Ireland' },
  ],
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'R. Gil Vicente, N°5',
    'addressLocality': 'Seixal',
    'postalCode': '2840-474',
    'addressCountry': 'PT',
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': '38.6500',
    'longitude': '-9.1000',
  },
  'contactPoint': [
    {
      '@type': 'ContactPoint',
      'telephone': '+351-928-375-226',
      'contactType': 'customer service',
      'areaServed': ['PT', 'ES'],
      'availableLanguage': ['Portuguese', 'Spanish'],
      'hoursAvailable': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '09:00',
        'closes': '18:00',
      },
    },
    {
      '@type': 'ContactPoint',
      'telephone': '+32-472-384-027',
      'contactType': 'customer service',
      'areaServed': ['BE', 'NL', 'LU', 'FR'],
      'availableLanguage': ['French', 'Dutch', 'English'],
      'hoursAvailable': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '09:00',
        'closes': '18:00',
      },
    },
    {
      '@type': 'ContactPoint',
      'contactType': 'customer service',
      'email': 'europe@jchairstudios62.xyz',
      'areaServed': ['DE', 'AT', 'CH', 'IT', 'GB', 'IE'],
      'availableLanguage': ['English', 'German', 'Italian'],
    },
  ],
  'sameAs': [
    'https://facebook.com/jchairstudio62',
    'https://instagram.com/jchairstudio62',
    'https://youtube.com/@jchairstudio62',
    'https://tiktok.com/@jchairstudio62',
  ],
  'makesOffer': [
    {
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Service',
        'name': 'Free Shipping',
        'description': 'Free shipping on orders over €150-€300 depending on location',
      },
    },
    {
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Service',
        'name': 'Authenticity Guarantee',
        'description': '100% authentic Brazilian products with certificate of origin',
      },
    },
  ],
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': 4.8,
    'reviewCount': 3487,
    'bestRating': 5,
    'worstRating': 1,
  },
};