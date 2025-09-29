import { NextRequest, NextResponse } from 'next/server';

/**
 * Shipping Rates Calculator API
 * GET /api/admin/shipping/rates - Calculate shipping rates
 *
 * Supports multiple carriers with real-time rate calculation
 * Handles domestic and international shipping
 */

interface RateRequest {
  origin: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  destination: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  packages: Array<{
    weight: number; // kg
    length: number; // cm
    width: number;  // cm
    height: number; // cm
    value: number;  // EUR
  }>;
  services?: string[]; // specific services to quote
}

interface ShippingRate {
  carrier: string;
  service: string;
  cost: number;
  currency: string;
  estimatedDays: number;
  estimatedDelivery: string;
  features: string[];
  trackingIncluded: boolean;
  insuranceIncluded: boolean;
  maxInsuranceValue?: number;
  restrictions?: string[];
}

interface RateResponse {
  success: boolean;
  rates: ShippingRate[];
  origin: any;
  destination: any;
  totalWeight: number;
  totalValue: number;
  isInternational: boolean;
  warnings?: string[];
  errors?: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const origin = {
      street: searchParams.get('origin_street') || 'Rua Example, 123',
      city: searchParams.get('origin_city') || 'Lisboa',
      state: searchParams.get('origin_state') || 'Lisboa',
      zipCode: searchParams.get('origin_zip') || '1000-001',
      country: searchParams.get('origin_country') || 'PT'
    };

    const destination = {
      street: searchParams.get('dest_street') || '',
      city: searchParams.get('dest_city') || '',
      state: searchParams.get('dest_state') || '',
      zipCode: searchParams.get('dest_zip') || '',
      country: searchParams.get('dest_country') || ''
    };

    // Default package if not specified
    const packages = [{
      weight: parseFloat(searchParams.get('weight') || '1'),
      length: parseFloat(searchParams.get('length') || '20'),
      width: parseFloat(searchParams.get('width') || '15'),
      height: parseFloat(searchParams.get('height') || '10'),
      value: parseFloat(searchParams.get('value') || '50')
    }];

    const services = searchParams.get('services')?.split(',') || [];

    if (!destination.city || !destination.country) {
      return NextResponse.json(
        { error: 'Missing destination city or country' },
        { status: 400 }
      );
    }

    // Calculate rates for all carriers
    const rates = await calculateShippingRates({
      origin,
      destination,
      packages,
      services
    });

    const totalWeight = packages.reduce((sum, pkg) => sum + pkg.weight, 0);
    const totalValue = packages.reduce((sum, pkg) => sum + pkg.value, 0);
    const isInternational = destination.country !== origin.country;

    const response: RateResponse = {
      success: true,
      rates: rates.filter(rate => rate.cost > 0), // Only valid rates
      origin,
      destination,
      totalWeight,
      totalValue,
      isInternational,
      warnings: generateWarnings(destination, packages, isInternational)
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error calculating shipping rates:', error);
    return NextResponse.json(
      { error: 'Failed to calculate shipping rates' },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for detailed rate calculation with complex packages
 */
export async function POST(request: NextRequest) {
  try {
    const rateRequest: RateRequest = await request.json();

    if (!rateRequest.destination || !rateRequest.packages || rateRequest.packages.length === 0) {
      return NextResponse.json(
        { error: 'Missing destination or packages information' },
        { status: 400 }
      );
    }

    // Validate package dimensions and weights
    const validation = validatePackages(rateRequest.packages);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    const rates = await calculateShippingRates(rateRequest);
    const totalWeight = rateRequest.packages.reduce((sum, pkg) => sum + pkg.weight, 0);
    const totalValue = rateRequest.packages.reduce((sum, pkg) => sum + pkg.value, 0);
    const isInternational = rateRequest.destination.country !== (rateRequest.origin?.country || 'PT');

    const response: RateResponse = {
      success: true,
      rates: rates.filter(rate => rate.cost > 0),
      origin: rateRequest.origin,
      destination: rateRequest.destination,
      totalWeight,
      totalValue,
      isInternational,
      warnings: generateWarnings(rateRequest.destination, rateRequest.packages, isInternational)
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in POST shipping rates:', error);
    return NextResponse.json(
      { error: 'Failed to calculate shipping rates' },
      { status: 500 }
    );
  }
}

/**
 * Calculate shipping rates for all supported carriers
 */
async function calculateShippingRates(request: RateRequest): Promise<ShippingRate[]> {
  const rates: ShippingRate[] = [];
  const isInternational = request.destination.country !== (request.origin?.country || 'PT');
  const totalWeight = request.packages.reduce((sum, pkg) => sum + pkg.weight, 0);
  const totalValue = request.packages.reduce((sum, pkg) => sum + pkg.value, 0);

  // CTT (Portugal Post)
  if (request.origin?.country === 'PT' || !isInternational) {
    rates.push(...await getCTTRates(request, isInternational, totalWeight, totalValue));
  }

  // Correios (Brazil Post)
  if (request.destination.country === 'BR' || request.origin?.country === 'BR') {
    rates.push(...await getCorreiosRates(request, isInternational, totalWeight, totalValue));
  }

  // DPD (European network)
  if (isEuropeanCountry(request.destination.country)) {
    rates.push(...await getDPDRates(request, isInternational, totalWeight, totalValue));
  }

  // UPS (Global)
  rates.push(...await getUPSRates(request, isInternational, totalWeight, totalValue));

  // DHL (Global Express)
  rates.push(...await getDHLRates(request, isInternational, totalWeight, totalValue));

  // Sort by cost (cheapest first)
  return rates.sort((a, b) => a.cost - b.cost);
}

/**
 * CTT (Portugal Post) rates
 */
async function getCTTRates(request: RateRequest, isInternational: boolean, weight: number, value: number): Promise<ShippingRate[]> {
  const rates: ShippingRate[] = [];

  if (!isInternational) {
    // Domestic Portugal rates
    rates.push({
      carrier: 'CTT',
      service: 'CTT Expresso',
      cost: calculateDomesticCTTCost(weight),
      currency: 'EUR',
      estimatedDays: 1,
      estimatedDelivery: getEstimatedDelivery(1),
      features: ['Tracking', 'Proof of Delivery'],
      trackingIncluded: true,
      insuranceIncluded: false,
      maxInsuranceValue: 1000,
      restrictions: weight > 30 ? ['Weight limit exceeded'] : []
    });

    if (weight <= 20) {
      rates.push({
        carrier: 'CTT',
        service: 'CTT Expresso 10H',
        cost: calculateDomesticCTTCost(weight) + 3.50,
        currency: 'EUR',
        estimatedDays: 1,
        estimatedDelivery: getEstimatedDelivery(1),
        features: ['Tracking', 'Morning Delivery', 'Proof of Delivery'],
        trackingIncluded: true,
        insuranceIncluded: false
      });
    }
  } else {
    // International rates
    const baseCost = calculateInternationalCTTCost(weight, request.destination.country);
    rates.push({
      carrier: 'CTT',
      service: 'CTT Expresso Internacional',
      cost: baseCost,
      currency: 'EUR',
      estimatedDays: getInternationalDeliveryDays('CTT', request.destination.country),
      estimatedDelivery: getEstimatedDelivery(getInternationalDeliveryDays('CTT', request.destination.country)),
      features: ['Tracking', 'Customs Handling'],
      trackingIncluded: true,
      insuranceIncluded: false,
      restrictions: getCountryRestrictions(request.destination.country)
    });
  }

  return rates;
}

/**
 * Correios (Brazil Post) rates
 */
async function getCorreiosRates(request: RateRequest, isInternational: boolean, weight: number, value: number): Promise<ShippingRate[]> {
  const rates: ShippingRate[] = [];

  if (!isInternational && request.destination.country === 'BR') {
    // Domestic Brazil rates
    rates.push({
      carrier: 'Correios',
      service: 'PAC',
      cost: calculateBrazilPACCost(weight, request.destination.state),
      currency: 'EUR', // Converted to EUR
      estimatedDays: 8,
      estimatedDelivery: getEstimatedDelivery(8),
      features: ['Basic Tracking'],
      trackingIncluded: true,
      insuranceIncluded: false
    });

    rates.push({
      carrier: 'Correios',
      service: 'SEDEX',
      cost: calculateBrazilSEDEXCost(weight, request.destination.state),
      currency: 'EUR',
      estimatedDays: 3,
      estimatedDelivery: getEstimatedDelivery(3),
      features: ['Tracking', 'Express Delivery'],
      trackingIncluded: true,
      insuranceIncluded: true
    });
  }

  return rates;
}

/**
 * DPD rates (European network)
 */
async function getDPDRates(request: RateRequest, isInternational: boolean, weight: number, value: number): Promise<ShippingRate[]> {
  const rates: ShippingRate[] = [];

  rates.push({
    carrier: 'DPD',
    service: 'DPD Classic',
    cost: calculateDPDCost(weight, isInternational),
    currency: 'EUR',
    estimatedDays: isInternational ? 3 : 2,
    estimatedDelivery: getEstimatedDelivery(isInternational ? 3 : 2),
    features: ['Tracking', 'Delivery Notifications'],
    trackingIncluded: true,
    insuranceIncluded: false,
    maxInsuranceValue: 520
  });

  if (weight <= 31.5) {
    rates.push({
      carrier: 'DPD',
      service: 'DPD Express',
      cost: calculateDPDCost(weight, isInternational) + 8.00,
      currency: 'EUR',
      estimatedDays: isInternational ? 2 : 1,
      estimatedDelivery: getEstimatedDelivery(isInternational ? 2 : 1),
      features: ['Tracking', 'Express Delivery', 'Time-Defined Delivery'],
      trackingIncluded: true,
      insuranceIncluded: true
    });
  }

  return rates;
}

/**
 * UPS rates (Global)
 */
async function getUPSRates(request: RateRequest, isInternational: boolean, weight: number, value: number): Promise<ShippingRate[]> {
  const rates: ShippingRate[] = [];

  rates.push({
    carrier: 'UPS',
    service: 'UPS Standard',
    cost: calculateUPSCost(weight, isInternational, 'standard'),
    currency: 'EUR',
    estimatedDays: isInternational ? 5 : 3,
    estimatedDelivery: getEstimatedDelivery(isInternational ? 5 : 3),
    features: ['Tracking', 'Proof of Delivery', 'UPS My Choice'],
    trackingIncluded: true,
    insuranceIncluded: true,
    maxInsuranceValue: 100
  });

  rates.push({
    carrier: 'UPS',
    service: 'UPS Express',
    cost: calculateUPSCost(weight, isInternational, 'express'),
    currency: 'EUR',
    estimatedDays: isInternational ? 2 : 1,
    estimatedDelivery: getEstimatedDelivery(isInternational ? 2 : 1),
    features: ['Tracking', 'Express Delivery', 'Money-Back Guarantee'],
    trackingIncluded: true,
    insuranceIncluded: true,
    maxInsuranceValue: 100
  });

  return rates;
}

/**
 * DHL rates (Global Express)
 */
async function getDHLRates(request: RateRequest, isInternational: boolean, weight: number, value: number): Promise<ShippingRate[]> {
  const rates: ShippingRate[] = [];

  if (isInternational || weight > 10) { // DHL focuses on international and heavier packages
    rates.push({
      carrier: 'DHL',
      service: 'DHL Express Worldwide',
      cost: calculateDHLCost(weight, isInternational),
      currency: 'EUR',
      estimatedDays: isInternational ? 2 : 1,
      estimatedDelivery: getEstimatedDelivery(isInternational ? 2 : 1),
      features: ['Tracking', 'Express Delivery', 'Customs Clearance', 'Signature Service'],
      trackingIncluded: true,
      insuranceIncluded: true,
      maxInsuranceValue: 2500
    });
  }

  return rates;
}

// Cost calculation functions
function calculateDomesticCTTCost(weight: number): number {
  if (weight <= 2) return 6.50;
  if (weight <= 5) return 8.50;
  if (weight <= 10) return 12.00;
  if (weight <= 20) return 16.50;
  return 16.50 + ((weight - 20) * 1.50);
}

function calculateInternationalCTTCost(weight: number, country: string): number {
  const zone = getCountryZone(country);
  const baseCosts = { 'EU': 15.00, 'Europe': 18.00, 'World': 25.00 };
  const baseCost = baseCosts[zone as keyof typeof baseCosts] || 25.00;

  if (weight <= 2) return baseCost;
  return baseCost + ((weight - 2) * 3.50);
}

function calculateBrazilPACCost(weight: number, state: string): number {
  // Convert BRL to EUR (approximate rate 1 EUR = 5.5 BRL)
  const brlToEur = 5.5;
  const baseCostBRL = weight <= 1 ? 12.00 : 12.00 + ((weight - 1) * 5.00);
  return baseCostBRL / brlToEur;
}

function calculateBrazilSEDEXCost(weight: number, state: string): number {
  const brlToEur = 5.5;
  const baseCostBRL = weight <= 1 ? 22.00 : 22.00 + ((weight - 1) * 8.00);
  return baseCostBRL / brlToEur;
}

function calculateDPDCost(weight: number, isInternational: boolean): number {
  const baseCost = isInternational ? 12.00 : 8.00;
  if (weight <= 2) return baseCost;
  return baseCost + ((weight - 2) * 2.00);
}

function calculateUPSCost(weight: number, isInternational: boolean, service: string): number {
  const multiplier = service === 'express' ? 1.8 : 1.0;
  const baseCost = isInternational ? 20.00 : 12.00;
  const cost = baseCost + ((weight - 1) * 3.50);
  return cost * multiplier;
}

function calculateDHLCost(weight: number, isInternational: boolean): number {
  const baseCost = isInternational ? 30.00 : 18.00;
  if (weight <= 0.5) return baseCost;
  return baseCost + ((weight - 0.5) * 8.00);
}

// Utility functions
function isEuropeanCountry(country: string): boolean {
  const europeanCountries = ['PT', 'ES', 'FR', 'DE', 'IT', 'NL', 'BE', 'AT', 'CH', 'DK', 'SE', 'NO', 'FI'];
  return europeanCountries.includes(country);
}

function getCountryZone(country: string): string {
  const euCountries = ['PT', 'ES', 'FR', 'DE', 'IT', 'NL', 'BE', 'AT', 'DK', 'SE', 'FI'];
  const europeCountries = ['CH', 'NO', 'UK', 'GB', 'PL', 'CZ', 'HU'];

  if (euCountries.includes(country)) return 'EU';
  if (europeCountries.includes(country)) return 'Europe';
  return 'World';
}

function getInternationalDeliveryDays(carrier: string, country: string): number {
  const zone = getCountryZone(country);

  switch (carrier) {
    case 'CTT':
      return zone === 'EU' ? 3 : zone === 'Europe' ? 5 : 7;
    case 'DPD':
      return zone === 'EU' ? 2 : 4;
    case 'UPS':
      return zone === 'EU' ? 3 : 5;
    case 'DHL':
      return zone === 'EU' ? 1 : 2;
    default:
      return 5;
  }
}

function getEstimatedDelivery(days: number): string {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);
  return deliveryDate.toLocaleDateString('pt-PT');
}

function getCountryRestrictions(country: string): string[] {
  const restrictions: { [key: string]: string[] } = {
    'US': ['No liquids over 100ml', 'Customs documentation required'],
    'CN': ['Restricted hair products', 'Long customs clearance'],
    'RU': ['Limited shipping options', 'Customs delays possible'],
    'AU': ['Quarantine restrictions on organic products']
  };

  return restrictions[country] || [];
}

function generateWarnings(destination: any, packages: any[], isInternational: boolean): string[] {
  const warnings: string[] = [];

  if (isInternational) {
    warnings.push('International shipments may require customs documentation');
    warnings.push('Delivery times may vary due to customs clearance');
  }

  const totalWeight = packages.reduce((sum, pkg) => sum + pkg.weight, 0);
  if (totalWeight > 30) {
    warnings.push('Heavy package may require special handling');
  }

  const totalValue = packages.reduce((sum, pkg) => sum + pkg.value, 0);
  if (totalValue > 500 && isInternational) {
    warnings.push('High-value shipments may require additional customs documentation');
  }

  return warnings;
}

function validatePackages(packages: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  packages.forEach((pkg, index) => {
    if (pkg.weight <= 0) errors.push(`Package ${index + 1}: Weight must be greater than 0`);
    if (pkg.weight > 50) errors.push(`Package ${index + 1}: Weight exceeds 50kg limit`);
    if (pkg.length <= 0 || pkg.width <= 0 || pkg.height <= 0) {
      errors.push(`Package ${index + 1}: All dimensions must be greater than 0`);
    }
    if (pkg.length > 120 || pkg.width > 80 || pkg.height > 80) {
      errors.push(`Package ${index + 1}: Dimensions exceed carrier limits`);
    }
    if (pkg.value < 0) errors.push(`Package ${index + 1}: Value cannot be negative`);
  });

  return { valid: errors.length === 0, errors };
}