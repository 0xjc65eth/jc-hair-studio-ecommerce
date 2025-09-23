import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * This route demonstrates the Stripe connection failure on Vercel
 * Works locally but fails in production with "connection to Stripe" error
 */
export async function GET() {
  // Check environment variable
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error: 'STRIPE_SECRET_KEY not configured',
        instructions: 'Add STRIPE_SECRET_KEY to Vercel environment variables'
      },
      { status: 500 }
    );
  }

  try {
    console.log('🔍 Testing Stripe connection...');

    // Create Stripe instance with minimal configuration
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    });

    // Try the simplest possible API call
    const account = await stripe.accounts.retrieve();

    console.log('✅ Stripe connection successful');

    return NextResponse.json({
      success: true,
      message: 'Stripe connection successful',
      accountId: account.id,
      accountType: account.type,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Stripe connection failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Stripe connection failed',
        message: error?.message || 'Unknown error',
        code: error?.code || 'unknown',
        type: error?.type || 'unknown',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}