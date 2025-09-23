#!/usr/bin/env node

/**
 * Production Payment API Diagnostic Script
 * Tests payment API on custom domain and provides detailed error information
 */

import fetch from 'node-fetch';

const DOMAIN = 'https://jchairstudios62.xyz';
const LATEST_VERCEL_URL = 'https://jc-hair-studio-iheyhjomr-0xjc65eths-projects.vercel.app';

console.log('🔍 Testing Payment API on Production Domain...\n');

// Test data for payment creation
const testPaymentData = {
  amount: 89.99,
  currency: 'eur',
  customerInfo: {
    name: 'Test Customer',
    email: 'test@jchairstudios62.com',
    phone: '+351928375226'
  },
  items: [
    {
      name: 'Test Product',
      quantity: 1,
      price: 89.99
    }
  ]
};

async function testPaymentAPI(baseUrl, label) {
  console.log(`🧪 Testing ${label}: ${baseUrl}`);
  console.log('='.repeat(50));

  try {
    const response = await fetch(`${baseUrl}/api/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPaymentData)
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    const responseData = await response.json();
    console.log('📄 Response:', JSON.stringify(responseData, null, 2));

    if (response.ok && responseData.clientSecret) {
      console.log('✅ Payment API is working correctly!');
      return true;
    } else {
      console.log('❌ Payment API failed');
      return false;
    }

  } catch (error) {
    console.error('💥 Network/Connection Error:', error.message);
    return false;
  }

  console.log('\n');
}

async function main() {
  console.log('Testing custom domain...');
  const customDomainWorks = await testPaymentAPI(DOMAIN, 'Custom Domain');

  console.log('\nTesting latest Vercel deployment...');
  const vercelWorks = await testPaymentAPI(LATEST_VERCEL_URL, 'Latest Vercel URL');

  console.log('\n' + '='.repeat(60));
  console.log('🎯 DIAGNOSIS SUMMARY:');
  console.log('='.repeat(60));

  if (customDomainWorks && vercelWorks) {
    console.log('✅ Both custom domain and Vercel are working - Payment system is ready!');
  } else if (!customDomainWorks && vercelWorks) {
    console.log('⚠️ Custom domain is using an older deployment');
    console.log('💡 SOLUTION: Wait 5-10 minutes for DNS propagation, or contact Vercel support');
  } else if (customDomainWorks && !vercelWorks) {
    console.log('🔄 Custom domain is working but latest deployment has issues');
  } else {
    console.log('❌ Both endpoints are failing - check environment variables');
    console.log('🔧 SOLUTION: Verify Stripe keys are properly set in Vercel dashboard');
  }

  console.log('\n📋 NEXT STEPS:');
  console.log('1. If custom domain fails: Wait for DNS propagation (5-10 minutes)');
  console.log('2. Clear browser cache and try again');
  console.log('3. Check Vercel dashboard for environment variables');
  console.log('4. Contact Vercel support if domain doesn\'t update');
}

main().catch(console.error);