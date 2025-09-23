#!/usr/bin/env node

/**
 * THIRD-PARTY INTEGRATIONS TEST - JC Hair Studio
 * Tests SendGrid, MongoDB, and Stripe integrations
 */

const BASE_URL = 'https://jchairstudios62.xyz';

console.log(`
🔌 ====================================================================
🔌 THIRD-PARTY INTEGRATIONS TEST SUITE - JC HAIR STUDIO
🔌 ====================================================================
🌐 Base URL: ${BASE_URL}
⏰ Started: ${new Date().toLocaleString('pt-PT')}
🔌 ====================================================================
`);

/**
 * Test SendGrid Email Integration
 */
async function testSendGridIntegration() {
  console.log('\n📧 TESTING SENDGRID EMAIL INTEGRATION');
  console.log('─'.repeat(60));

  try {
    const response = await fetch(`${BASE_URL}/api/admin/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'test',
        testEmail: 'test@example.com'
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('✅ SendGrid Integration: WORKING');
      console.log(`   📊 Response: ${result.message}`);
      return { status: 'working', details: result };
    } else {
      console.log('⚠️ SendGrid Integration: PARTIAL');
      console.log(`   📋 Issue: ${result.error || 'Unknown error'}`);
      return { status: 'partial', details: result };
    }
  } catch (error) {
    console.log('❌ SendGrid Integration: FAILED');
    console.log(`   🔥 Error: ${error.message}`);
    return { status: 'failed', error: error.message };
  }
}

/**
 * Test MongoDB Connection
 */
async function testMongoDBIntegration() {
  console.log('\n🗄️ TESTING MONGODB INTEGRATION');
  console.log('─'.repeat(60));

  try {
    const response = await fetch(`${BASE_URL}/api/admin/notifications`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('✅ MongoDB Integration: WORKING');
      console.log(`   📊 Health: ${result.health || 'operational'}`);
      console.log(`   📈 Statistics available: ${result.statistics?.length > 0 ? 'Yes' : 'No'}`);
      return { status: 'working', details: result };
    } else {
      console.log('⚠️ MongoDB Integration: PARTIAL');
      console.log(`   📋 Issue: ${result.error || 'Unknown error'}`);
      return { status: 'partial', details: result };
    }
  } catch (error) {
    console.log('❌ MongoDB Integration: FAILED');
    console.log(`   🔥 Error: ${error.message}`);
    return { status: 'failed', error: error.message };
  }
}

/**
 * Test Stripe Payment Integration
 */
async function testStripeIntegration() {
  console.log('\n💳 TESTING STRIPE PAYMENT INTEGRATION');
  console.log('─'.repeat(60));

  try {
    // Test payment intent creation
    const response = await fetch(`${BASE_URL}/api/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 100, // 1 EUR in cents
        currency: 'eur',
        items: [{ id: 'teste-juliana', quantity: 1 }]
      })
    });

    const result = await response.json();

    if (response.ok && result.clientSecret) {
      console.log('✅ Stripe Integration: WORKING');
      console.log(`   💰 Payment Intent Created: ${result.paymentIntentId}`);
      console.log(`   🔑 Client Secret: ${result.clientSecret.substring(0, 20)}...`);
      console.log(`   💵 Amount: €${(result.amount / 100).toFixed(2)}`);
      return { status: 'working', details: result };
    } else {
      console.log('⚠️ Stripe Integration: PARTIAL');
      console.log(`   📋 Issue: ${result.error || 'Unknown error'}`);
      return { status: 'partial', details: result };
    }
  } catch (error) {
    console.log('❌ Stripe Integration: FAILED');
    console.log(`   🔥 Error: ${error.message}`);
    return { status: 'failed', error: error.message };
  }
}

/**
 * Test Stripe Checkout Session (Alternative)
 */
async function testStripeCheckoutSession() {
  console.log('\n🛒 TESTING STRIPE CHECKOUT SESSION');
  console.log('─'.repeat(60));

  try {
    const response = await fetch(`${BASE_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: 'teste-juliana', quantity: 1, price: 100 }],
        customerEmail: 'test@example.com'
      })
    });

    const result = await response.json();

    if (response.ok && result.sessionId) {
      console.log('✅ Stripe Checkout: WORKING');
      console.log(`   🛒 Session ID: ${result.sessionId}`);
      console.log(`   🔗 URL: ${result.url ? 'Available' : 'Not provided'}`);
      return { status: 'working', details: result };
    } else {
      console.log('⚠️ Stripe Checkout: PARTIAL/FAILED');
      console.log(`   📋 Issue: ${result.error || result.message || 'Unknown error'}`);
      return { status: 'partial', details: result };
    }
  } catch (error) {
    console.log('❌ Stripe Checkout: FAILED');
    console.log(`   🔥 Error: ${error.message}`);
    return { status: 'failed', error: error.message };
  }
}

/**
 * Test Product API (Data Layer)
 */
async function testProductAPI() {
  console.log('\n🛍️ TESTING PRODUCT API INTEGRATION');
  console.log('─'.repeat(60));

  try {
    const response = await fetch(`${BASE_URL}/api/products?category=maquiagens&limit=5`);
    const result = await response.json();

    if (response.ok && Array.isArray(result)) {
      console.log('✅ Product API: WORKING');
      console.log(`   📦 Products loaded: ${result.length}`);

      // Check for Teste Juliana product
      const testeJuliana = result.find(p => p.name === 'Teste Juliana' || p.id === 'teste-juliana');
      if (testeJuliana) {
        console.log('✅ Teste Juliana product: FOUND');
        console.log(`   💰 Price: €${testeJuliana.price}`);
      } else {
        console.log('⚠️ Teste Juliana product: NOT FOUND in API response');
      }

      return { status: 'working', details: { count: result.length, testeJulianaFound: !!testeJuliana } };
    } else {
      console.log('❌ Product API: FAILED');
      console.log(`   📋 Issue: Status ${response.status} - ${response.statusText}`);
      return { status: 'failed', details: { status: response.status, statusText: response.statusText } };
    }
  } catch (error) {
    console.log('❌ Product API: FAILED');
    console.log(`   🔥 Error: ${error.message}`);
    return { status: 'failed', error: error.message };
  }
}

/**
 * Main integration test function
 */
async function runIntegrationTests() {
  const testResults = {
    sendgrid: await testSendGridIntegration(),
    mongodb: await testMongoDBIntegration(),
    stripe: await testStripeIntegration(),
    stripeCheckout: await testStripeCheckoutSession(),
    productAPI: await testProductAPI()
  };

  // Generate summary
  console.log(`
📊 ====================================================================
📊 THIRD-PARTY INTEGRATIONS SUMMARY
📊 ====================================================================
`);

  const integrations = [
    { name: 'SendGrid Email', key: 'sendgrid', icon: '📧' },
    { name: 'MongoDB Database', key: 'mongodb', icon: '🗄️' },
    { name: 'Stripe Payment Intent', key: 'stripe', icon: '💳' },
    { name: 'Stripe Checkout Session', key: 'stripeCheckout', icon: '🛒' },
    { name: 'Product API', key: 'productAPI', icon: '🛍️' }
  ];

  let workingCount = 0;
  let partialCount = 0;
  let failedCount = 0;

  integrations.forEach(integration => {
    const result = testResults[integration.key];
    const statusIcon = {
      working: '✅',
      partial: '⚠️',
      failed: '❌'
    }[result.status] || '❓';

    console.log(`${integration.icon} ${statusIcon} ${integration.name}: ${result.status.toUpperCase()}`);

    if (result.status === 'working') workingCount++;
    else if (result.status === 'partial') partialCount++;
    else failedCount++;
  });

  const totalTests = integrations.length;
  const successRate = Math.round((workingCount / totalTests) * 100);

  console.log(`
📈 Integration Health Score: ${successRate}% (${workingCount}/${totalTests} fully working)
  ✅ Working: ${workingCount}
  ⚠️ Partial: ${partialCount}
  ❌ Failed: ${failedCount}

🎯 PRODUCTION READINESS ASSESSMENT:
────────────────────────────────────────────────────────────────────
`);

  // Production readiness criteria
  const productionReady = workingCount >= 3 && failedCount <= 1;
  const criticalFailed = testResults.mongodb.status === 'failed' ||
                        (testResults.stripe.status === 'failed' && testResults.stripeCheckout.status === 'failed');

  if (criticalFailed) {
    console.log('🔴 NOT PRODUCTION READY - Critical integrations failed');
    console.log('💡 Critical issues detected:');
    if (testResults.mongodb.status === 'failed') {
      console.log('   • MongoDB connection failed - Database required');
    }
    if (testResults.stripe.status === 'failed' && testResults.stripeCheckout.status === 'failed') {
      console.log('   • Stripe payment processing failed - Payments required');
    }
  } else if (productionReady) {
    console.log('🟢 PRODUCTION READY - Core integrations working');
    console.log('💡 Recommendations:');
    console.log('   • Monitor integration health regularly');
    console.log('   • Set up alerts for payment failures');
    console.log('   • Implement fallback mechanisms');
  } else {
    console.log('🟡 PARTIALLY READY - Some integrations need attention');
    console.log('💡 Required actions:');
    if (testResults.sendgrid.status !== 'working') {
      console.log('   • Fix SendGrid email notifications');
    }
    if (testResults.productAPI.status !== 'working') {
      console.log('   • Fix product API for catalog functionality');
    }
  }

  console.log(`
⏰ Integration tests completed: ${new Date().toLocaleString('pt-PT')}
🔌 ====================================================================
`);

  return {
    testResults,
    summary: {
      workingCount,
      partialCount,
      failedCount,
      successRate,
      productionReady,
      criticalFailed
    }
  };
}

// Run the integration tests
(async function main() {
  try {
    const results = await runIntegrationTests();
    process.exit(results.summary.productionReady ? 0 : 1);
  } catch (error) {
    console.error('\n❌ CRITICAL ERROR IN INTEGRATION TESTS:', error);
    process.exit(1);
  }
})();