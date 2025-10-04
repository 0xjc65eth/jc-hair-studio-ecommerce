import { NextRequest, NextResponse } from 'next/server';
import {
  ShippingCalculator,
  DEFAULT_ORIGIN,
  type ShippingAddress,
  type Package as ShippingPackage,
} from '@/lib/shipping/shipping-apis';

/**
 * POST /api/shipping/calculate
 *
 * Calculate shipping rates for checkout
 *
 * Body:
 * {
 *   destination: { country, postalCode, city },
 *   cartTotal: number,
 *   weight: number (optional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination, cartTotal, weight } = body;

    if (!destination || !destination.country || !destination.postalCode) {
      return NextResponse.json(
        { error: 'Destination address required' },
        { status: 400 }
      );
    }

    // Create full destination address
    const fullDestination: ShippingAddress = {
      country: destination.country,
      postalCode: destination.postalCode,
      city: destination.city || '',
      address: destination.address || '',
      name: destination.name || 'Cliente',
      phone: destination.phone || '',
    };

    // Create package details
    // Peso estimado: 0.5kg base + 0.1kg por cada €10 de valor
    const estimatedWeight = weight || Math.max(0.5, (cartTotal || 50) / 100);

    const pkg: ShippingPackage = {
      weight: estimatedWeight,
      length: 30,
      width: 20,
      height: 15,
      value: cartTotal || 50,
    };

    // Calculate rates
    const calculator = new ShippingCalculator();
    let rates = await calculator.getAllRates(DEFAULT_ORIGIN, fullDestination, pkg);

    // Apply free shipping rule
    rates = calculator.applyFreeShippingRule(rates, cartTotal || 0, 100);

    // Sort by price
    rates.sort((a, b) => a.price - b.price);

    return NextResponse.json({
      success: true,
      rates,
      freeShippingThreshold: 100,
      cartTotal,
      hasFreeShipping: cartTotal >= 100,
    });
  } catch (error: any) {
    console.error('Error calculating shipping:', error);
    return NextResponse.json(
      { error: 'Failed to calculate shipping', details: error.message },
      { status: 500 }
    );
  }
}
