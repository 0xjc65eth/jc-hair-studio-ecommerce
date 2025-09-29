export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  shippingCost: number;
  estimatedDays: string;
  cities?: string[];
}

export const countries: Country[] = [
  // Opção para qualquer país
  {
    code: 'GLOBAL',
    name: '🌍 Outro País (Envio Internacional)',
    currency: 'EUR',
    currencySymbol: '€',
    shippingCost: 59.99,
    estimatedDays: '15-30 dias',
  },
  // Europa
  {
    code: 'PT',
    name: 'Portugal',
    currency: 'EUR',
    currencySymbol: '€',
    shippingCost: 0,
    estimatedDays: '2-3 dias',
    cities: ['Lisboa', 'Porto', 'Coimbra', 'Braga', 'Aveiro', 'Faro', 'Setúbal', 'Funchal']
  },
  {
    code: 'ES',
    name: 'Espanha',
    currency: 'EUR',
    currencySymbol: '€',
    shippingCost: 9.99,
    estimatedDays: '3-5 dias',
    cities: ['Madrid', 'Barcelona', 'Valencia', 'Sevilha', 'Bilbao', 'Málaga']
  },
  {
    code: 'FR',
    name: 'França',
    currency: 'EUR',
    currencySymbol: '€',
    shippingCost: 12.99,
    estimatedDays: '4-6 dias',
    cities: ['Paris', 'Lyon', 'Marselha', 'Toulouse', 'Nice', 'Bordeaux']
  },
  {
    code: 'DE',
    name: 'Alemanha',
    currency: 'EUR',
    currencySymbol: '€',
    shippingCost: 14.99,
    estimatedDays: '4-7 dias',
    cities: ['Berlim', 'Munique', 'Frankfurt', 'Hamburgo', 'Colônia', 'Stuttgart']
  },
  {
    code: 'IT',
    name: 'Itália',
    currency: 'EUR',
    currencySymbol: '€',
    shippingCost: 14.99,
    estimatedDays: '5-7 dias',
    cities: ['Roma', 'Milão', 'Nápoles', 'Turim', 'Florença', 'Veneza']
  },
  {
    code: 'UK',
    name: 'Reino Unido',
    currency: 'GBP',
    currencySymbol: '£',
    shippingCost: 19.99,
    estimatedDays: '5-8 dias',
    cities: ['Londres', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Glasgow']
  },

  // América
  {
    code: 'BR',
    name: 'Brasil',
    currency: 'BRL',
    currencySymbol: 'R$',
    shippingCost: 29.99,
    estimatedDays: '10-15 dias',
    cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte']
  },
  {
    code: 'US',
    name: 'Estados Unidos',
    currency: 'USD',
    currencySymbol: '$',
    shippingCost: 34.99,
    estimatedDays: '10-15 dias',
    cities: ['Nova York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'San Francisco']
  },
  {
    code: 'CA',
    name: 'Canadá',
    currency: 'CAD',
    currencySymbol: 'C$',
    shippingCost: 39.99,
    estimatedDays: '10-15 dias',
    cities: ['Toronto', 'Montreal', 'Vancouver', 'Ottawa', 'Calgary', 'Edmonton']
  },

  // África
  {
    code: 'AO',
    name: 'Angola',
    currency: 'AOA',
    currencySymbol: 'Kz',
    shippingCost: 44.99,
    estimatedDays: '15-20 dias',
    cities: ['Luanda', 'Huambo', 'Lobito', 'Benguela', 'Lubango', 'Malanje']
  },
  {
    code: 'MZ',
    name: 'Moçambique',
    currency: 'MZN',
    currencySymbol: 'MT',
    shippingCost: 44.99,
    estimatedDays: '15-20 dias',
    cities: ['Maputo', 'Beira', 'Nampula', 'Chimoio', 'Nacala', 'Quelimane']
  },
  {
    code: 'CV',
    name: 'Cabo Verde',
    currency: 'CVE',
    currencySymbol: '$',
    shippingCost: 39.99,
    estimatedDays: '10-15 dias',
    cities: ['Praia', 'Mindelo', 'Santa Maria', 'Espargos', 'Assomada', 'São Filipe']
  },

  // Ásia
  {
    code: 'JP',
    name: 'Japão',
    currency: 'JPY',
    currencySymbol: '¥',
    shippingCost: 49.99,
    estimatedDays: '15-20 dias',
    cities: ['Tóquio', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Kobe']
  },
  {
    code: 'CN',
    name: 'China',
    currency: 'CNY',
    currencySymbol: '¥',
    shippingCost: 49.99,
    estimatedDays: '15-25 dias',
    cities: ['Pequim', 'Xangai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hong Kong']
  },

  // Oceania
  {
    code: 'AU',
    name: 'Austrália',
    currency: 'AUD',
    currencySymbol: 'A$',
    shippingCost: 54.99,
    estimatedDays: '15-25 dias',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast']
  },
  {
    code: 'NZ',
    name: 'Nova Zelândia',
    currency: 'NZD',
    currencySymbol: 'NZ$',
    shippingCost: 54.99,
    estimatedDays: '15-25 dias',
    cities: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton']
  },

  // Mais países populares
  {
    code: 'MX',
    name: 'México',
    currency: 'MXN',
    currencySymbol: '$',
    shippingCost: 39.99,
    estimatedDays: '12-18 dias',
    cities: ['Cidade do México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana']
  },
  {
    code: 'AR',
    name: 'Argentina',
    currency: 'ARS',
    currencySymbol: '$',
    shippingCost: 44.99,
    estimatedDays: '12-20 dias',
    cities: ['Buenos Aires', 'Córdoba', 'Rosário', 'Mendoza', 'La Plata']
  },
  {
    code: 'CL',
    name: 'Chile',
    currency: 'CLP',
    currencySymbol: '$',
    shippingCost: 44.99,
    estimatedDays: '12-20 dias',
    cities: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena']
  },
  {
    code: 'CO',
    name: 'Colômbia',
    currency: 'COP',
    currencySymbol: '$',
    shippingCost: 44.99,
    estimatedDays: '12-20 dias',
    cities: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena']
  },
  {
    code: 'PE',
    name: 'Peru',
    currency: 'PEN',
    currencySymbol: 'S/',
    shippingCost: 44.99,
    estimatedDays: '12-20 dias',
    cities: ['Lima', 'Arequipa', 'Cusco', 'Trujillo']
  },
  {
    code: 'ZA',
    name: 'África do Sul',
    currency: 'ZAR',
    currencySymbol: 'R',
    shippingCost: 49.99,
    estimatedDays: '15-25 dias',
    cities: ['Joanesburgo', 'Cidade do Cabo', 'Durban', 'Pretória']
  },
  {
    code: 'EG',
    name: 'Egito',
    currency: 'EGP',
    currencySymbol: '£',
    shippingCost: 49.99,
    estimatedDays: '15-20 dias',
    cities: ['Cairo', 'Alexandria', 'Gizé', 'Luxor']
  },
  {
    code: 'IN',
    name: 'Índia',
    currency: 'INR',
    currencySymbol: '₹',
    shippingCost: 49.99,
    estimatedDays: '15-25 dias',
    cities: ['Nova Délhi', 'Mumbai', 'Bangalore', 'Calcutá', 'Chennai']
  },
  {
    code: 'KR',
    name: 'Coreia do Sul',
    currency: 'KRW',
    currencySymbol: '₩',
    shippingCost: 49.99,
    estimatedDays: '15-20 dias',
    cities: ['Seul', 'Busan', 'Incheon', 'Daegu']
  },
  {
    code: 'AE',
    name: 'Emirados Árabes',
    currency: 'AED',
    currencySymbol: 'د.إ',
    shippingCost: 44.99,
    estimatedDays: '10-15 dias',
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman']
  },
  {
    code: 'SA',
    name: 'Arábia Saudita',
    currency: 'SAR',
    currencySymbol: '﷼',
    shippingCost: 44.99,
    estimatedDays: '10-15 dias',
    cities: ['Riade', 'Jeddah', 'Meca', 'Medina']
  },
  {
    code: 'IL',
    name: 'Israel',
    currency: 'ILS',
    currencySymbol: '₪',
    shippingCost: 39.99,
    estimatedDays: '10-15 dias',
    cities: ['Tel Aviv', 'Jerusalém', 'Haifa', 'Rishon LeZion']
  },
  {
    code: 'TR',
    name: 'Turquia',
    currency: 'TRY',
    currencySymbol: '₺',
    shippingCost: 34.99,
    estimatedDays: '8-12 dias',
    cities: ['Istambul', 'Ancara', 'Izmir', 'Bursa']
  },
  {
    code: 'RU',
    name: 'Rússia',
    currency: 'RUB',
    currencySymbol: '₽',
    shippingCost: 54.99,
    estimatedDays: '15-25 dias',
    cities: ['Moscou', 'São Petersburgo', 'Novosibirsk', 'Ecaterimburgo']
  },
  {
    code: 'UA',
    name: 'Ucrânia',
    currency: 'UAH',
    currencySymbol: '₴',
    shippingCost: 44.99,
    estimatedDays: '12-20 dias',
    cities: ['Kiev', 'Kharkiv', 'Odessa', 'Dnipro']
  },
  {
    code: 'PL',
    name: 'Polônia',
    currency: 'PLN',
    currencySymbol: 'zł',
    shippingCost: 19.99,
    estimatedDays: '5-8 dias',
    cities: ['Varsóvia', 'Cracóvia', 'Łódź', 'Wrocław', 'Poznań']
  },
  {
    code: 'NL',
    name: 'Holanda',
    currency: 'EUR',
    currencySymbol: '€',
    shippingCost: 14.99,
    estimatedDays: '4-7 dias',
    cities: ['Amsterdã', 'Roterdã', 'Haia', 'Utrecht']
  },
  {
    code: 'BE',
    name: 'Bélgica',
    currency: 'EUR',
    currencySymbol: '€',
    shippingCost: 14.99,
    estimatedDays: '4-7 dias',
    cities: ['Bruxelas', 'Antuérpia', 'Gante', 'Bruges']
  },
  {
    code: 'CH',
    name: 'Suíça',
    currency: 'CHF',
    currencySymbol: 'CHF',
    shippingCost: 24.99,
    estimatedDays: '5-8 dias',
    cities: ['Zurique', 'Genebra', 'Basileia', 'Berna', 'Lausanne']
  },
  {
    code: 'AT',
    name: 'Áustria',
    currency: 'EUR',
    currencySymbol: '€',
    shippingCost: 14.99,
    estimatedDays: '5-7 dias',
    cities: ['Viena', 'Graz', 'Linz', 'Salzburgo', 'Innsbruck']
  },
  {
    code: 'SE',
    name: 'Suécia',
    currency: 'SEK',
    currencySymbol: 'kr',
    shippingCost: 19.99,
    estimatedDays: '5-8 dias',
    cities: ['Estocolmo', 'Gotemburgo', 'Malmö', 'Uppsala']
  },
  {
    code: 'NO',
    name: 'Noruega',
    currency: 'NOK',
    currencySymbol: 'kr',
    shippingCost: 24.99,
    estimatedDays: '5-8 dias',
    cities: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger']
  },
  {
    code: 'DK',
    name: 'Dinamarca',
    currency: 'DKK',
    currencySymbol: 'kr',
    shippingCost: 19.99,
    estimatedDays: '5-8 dias',
    cities: ['Copenhague', 'Aarhus', 'Odense', 'Aalborg']
  },
  {
    code: 'FI',
    name: 'Finlândia',
    currency: 'EUR',
    currencySymbol: '€',
    shippingCost: 19.99,
    estimatedDays: '6-9 dias',
    cities: ['Helsinque', 'Espoo', 'Tampere', 'Turku']
  },
  {
    code: 'IE',
    name: 'Irlanda',
    currency: 'EUR',
    currencySymbol: '€',
    shippingCost: 14.99,
    estimatedDays: '5-7 dias',
    cities: ['Dublin', 'Cork', 'Galway', 'Limerick']
  },
  {
    code: 'GR',
    name: 'Grécia',
    currency: 'EUR',
    currencySymbol: '€',
    shippingCost: 19.99,
    estimatedDays: '6-9 dias',
    cities: ['Atenas', 'Tessalônica', 'Patras', 'Heraclião']
  },
  {
    code: 'CZ',
    name: 'República Tcheca',
    currency: 'CZK',
    currencySymbol: 'Kč',
    shippingCost: 19.99,
    estimatedDays: '5-8 dias',
    cities: ['Praga', 'Brno', 'Ostrava', 'Plzeň']
  },
  {
    code: 'HU',
    name: 'Hungria',
    currency: 'HUF',
    currencySymbol: 'Ft',
    shippingCost: 19.99,
    estimatedDays: '5-8 dias',
    cities: ['Budapeste', 'Debrecen', 'Szeged', 'Miskolc']
  },
  {
    code: 'RO',
    name: 'Romênia',
    currency: 'RON',
    currencySymbol: 'lei',
    shippingCost: 24.99,
    estimatedDays: '6-10 dias',
    cities: ['Bucareste', 'Cluj-Napoca', 'Timișoara', 'Iași']
  },
  {
    code: 'BG',
    name: 'Bulgária',
    currency: 'BGN',
    currencySymbol: 'лв',
    shippingCost: 24.99,
    estimatedDays: '6-10 dias',
    cities: ['Sofia', 'Plovdiv', 'Varna', 'Burgas']
  },
  {
    code: 'HR',
    name: 'Croácia',
    currency: 'EUR',
    currencySymbol: '€',
    shippingCost: 19.99,
    estimatedDays: '5-8 dias',
    cities: ['Zagreb', 'Split', 'Rijeka', 'Osijek']
  },
  {
    code: 'LU',
    name: 'Luxemburgo',
    currency: 'EUR',
    currencySymbol: '€',
    shippingCost: 14.99,
    estimatedDays: '4-7 dias',
    cities: ['Luxemburgo', 'Esch-sur-Alzette', 'Dudelange']
  },
  {
    code: 'MY',
    name: 'Malásia',
    currency: 'MYR',
    currencySymbol: 'RM',
    shippingCost: 49.99,
    estimatedDays: '15-20 dias',
    cities: ['Kuala Lumpur', 'George Town', 'Ipoh', 'Johor Bahru']
  },
  {
    code: 'SG',
    name: 'Singapura',
    currency: 'SGD',
    currencySymbol: 'S$',
    shippingCost: 44.99,
    estimatedDays: '12-18 dias',
    cities: ['Singapura']
  },
  {
    code: 'TH',
    name: 'Tailândia',
    currency: 'THB',
    currencySymbol: '฿',
    shippingCost: 49.99,
    estimatedDays: '15-20 dias',
    cities: ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket']
  },
  {
    code: 'VN',
    name: 'Vietnã',
    currency: 'VND',
    currencySymbol: '₫',
    shippingCost: 49.99,
    estimatedDays: '15-20 dias',
    cities: ['Ho Chi Minh', 'Hanói', 'Da Nang', 'Haiphong']
  },
  {
    code: 'PH',
    name: 'Filipinas',
    currency: 'PHP',
    currencySymbol: '₱',
    shippingCost: 49.99,
    estimatedDays: '15-20 dias',
    cities: ['Manila', 'Quezon City', 'Davao', 'Cebu City']
  },
  {
    code: 'ID',
    name: 'Indonésia',
    currency: 'IDR',
    currencySymbol: 'Rp',
    shippingCost: 54.99,
    estimatedDays: '15-25 dias',
    cities: ['Jacarta', 'Surabaya', 'Bandung', 'Medan']
  },
  {
    code: 'NG',
    name: 'Nigéria',
    currency: 'NGN',
    currencySymbol: '₦',
    shippingCost: 54.99,
    estimatedDays: '15-25 dias',
    cities: ['Lagos', 'Abuja', 'Kano', 'Ibadan']
  },
  {
    code: 'KE',
    name: 'Quênia',
    currency: 'KES',
    currencySymbol: 'KSh',
    shippingCost: 54.99,
    estimatedDays: '15-25 dias',
    cities: ['Nairóbi', 'Mombasa', 'Kisumu', 'Nakuru']
  },
  {
    code: 'MA',
    name: 'Marrocos',
    currency: 'MAD',
    currencySymbol: 'د.م.',
    shippingCost: 39.99,
    estimatedDays: '10-15 dias',
    cities: ['Casablanca', 'Rabat', 'Fez', 'Marraquexe']
  },
  {
    code: 'TN',
    name: 'Tunísia',
    currency: 'TND',
    currencySymbol: 'د.ت',
    shippingCost: 39.99,
    estimatedDays: '10-15 dias',
    cities: ['Túnis', 'Sfax', 'Sousse', 'Kairouan']
  }
];

export function getCountryByCode(code: string): Country | undefined {
  return countries.find(c => c.code === code);
}

export function getShippingCost(countryCode: string): number {
  const country = getCountryByCode(countryCode);
  // Se não encontrar o país específico, usa taxa global
  if (!country && countryCode !== 'PT') {
    return 59.99; // Taxa padrão para envio internacional
  }
  return country?.shippingCost || 0;
}

export function getCurrencySymbol(countryCode: string): string {
  const country = getCountryByCode(countryCode);
  return country?.currencySymbol || '€';
}