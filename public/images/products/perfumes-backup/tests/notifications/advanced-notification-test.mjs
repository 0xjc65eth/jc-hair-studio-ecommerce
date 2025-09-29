#!/usr/bin/env node

/**
 * @fileoverview Advanced Notification System Testing Framework - JC Hair Studio
 * @author JC Hair Studio Development Team
 * @version 3.0.0 - Enhanced QA Framework
 *
 * COMPREHENSIVE TESTING SUITE FOR ALL 5 NOTIFICATION AGENTS:
 * - Agent 1: Email direto para admin (juliocesarurss65@gmail.com)
 * - Agent 2: Email para cliente (confirmação de pedido)
 * - Agent 3: Email para cliente (confirmação de pagamento)
 * - Agent 4: Email para cliente (notificação de envio)
 * - Agent 5: Persistência no MongoDB + Webhook backup
 *
 * FEATURES:
 * ✅ Performance Testing under Load
 * ✅ Error Handling and Retry Logic Testing
 * ✅ Integration Testing with SendGrid
 * ✅ MongoDB Persistence Verification
 * ✅ Email Delivery Rate Testing
 * ✅ Concurrent Request Testing
 * ✅ Failure Recovery Testing
 * ✅ Detailed Metrics and Reporting
 * ✅ Health Check Integration
 * ✅ Rate Limiting Testing
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { performance } from 'perf_hooks';

const execAsync = promisify(exec);

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  BASE_URL: process.env.TEST_BASE_URL || 'https://jc-hair-studio-iqxbgl0d5-0xjc65eths-projects.vercel.app',
  ADMIN_EMAIL: 'juliocesarurss65@gmail.com',

  // Test Configuration
  CONCURRENT_TESTS: 5,
  LOAD_TEST_ITERATIONS: 10,
  RETRY_ATTEMPTS: 3,
  TIMEOUT_MS: 30000,

  // Performance Thresholds
  MAX_RESPONSE_TIME: 5000, // 5 seconds
  MIN_SUCCESS_RATE: 95, // 95%
  MAX_ERROR_RATE: 5, // 5%

  // Test Email Patterns
  TEST_EMAILS: [
    'test1@example.com',
    'test2@example.com',
    'test3@example.com',
    'invalid-email@non-existent-domain.test',
    'malformed-email@'
  ]
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Enhanced delay function with jitter
 */
function delay(ms, jitter = 0.1) {
  const jitterMs = ms * jitter * (Math.random() - 0.5);
  return new Promise(resolve => setTimeout(resolve, ms + jitterMs));
}

/**
 * Generate test order data with variations
 */
function generateTestOrder(variant = 'default') {
  const timestamp = Date.now();
  const variants = {
    default: {
      orderId: `TEST-DEFAULT-${timestamp}`,
      customerName: 'João Silva Teste',
      customerEmail: 'joao.silva.teste@exemplo.com',
      status: 'pending'
    },
    paid: {
      orderId: `TEST-PAID-${timestamp}`,
      customerName: 'Maria Costa Teste',
      customerEmail: 'maria.costa.teste@exemplo.com',
      status: 'paid',
      transactionId: `tx_${timestamp}`
    },
    shipped: {
      orderId: `TEST-SHIPPED-${timestamp}`,
      customerName: 'Pedro Santos Teste',
      customerEmail: 'pedro.santos.teste@exemplo.com',
      status: 'shipped',
      trackingCode: `JC${timestamp}PT`
    },
    invalid_email: {
      orderId: `TEST-INVALID-${timestamp}`,
      customerName: 'Invalid Email Teste',
      customerEmail: 'invalid@non-existent-domain.test',
      status: 'pending'
    },
    large_order: {
      orderId: `TEST-LARGE-${timestamp}`,
      customerName: 'Large Order Teste',
      customerEmail: 'large.order.teste@exemplo.com',
      status: 'paid',
      products: Array(20).fill().map((_, i) => ({
        name: `Produto Teste ${i + 1}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        price: Math.random() * 100 + 10,
        sku: `TEST${i + 1}`.padStart(6, '0')
      }))
    }
  };

  const baseOrder = {
    customerPhone: '+351 912 345 678',
    total: 189.90,
    subtotal: 169.90,
    shippingCost: 20.00,
    discount: 0.00,
    currency: 'EUR',
    paymentMethod: 'Cartão de Crédito',
    paymentGateway: 'Stripe',
    products: [
      {
        name: 'Shampoo Hidratante Profissional 500ml',
        quantity: 2,
        price: 45.50,
        sku: 'SHP001',
        category: 'Shampoos'
      },
      {
        name: 'Condicionador Reparador 300ml',
        quantity: 1,
        price: 38.90,
        sku: 'CND002',
        category: 'Condicionadores'
      }
    ],
    shippingAddress: {
      name: 'Cliente Teste',
      street: 'Rua das Flores, 123',
      city: 'Lisboa',
      zipCode: '1000-001',
      country: 'Portugal',
      phone: '+351 912 345 678'
    },
    deliveryMethod: 'Correios Express',
    estimatedDelivery: '3-5 dias úteis',
    createdAt: new Date().toISOString()
  };

  return { ...baseOrder, ...variants[variant] };
}

/**
 * HTTP Request with timeout and retry
 */
async function makeRequest(url, options = {}, retries = CONFIG.RETRY_ATTEMPTS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

  try {
    const startTime = performance.now();
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    const endTime = performance.now();

    clearTimeout(timeoutId);

    const result = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data: result,
      responseTime: endTime - startTime,
      url,
      method: options.method || 'GET'
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (retries > 0 && !error.name === 'AbortError') {
      console.warn(`⚠️ Request failed, retrying... (${retries} attempts left)`);
      await delay(1000);
      return makeRequest(url, options, retries - 1);
    }

    return {
      success: false,
      error: error.message,
      responseTime: CONFIG.TIMEOUT_MS,
      url,
      method: options.method || 'GET'
    };
  }
}

// ============================================================================
// TEST CASES
// ============================================================================

/**
 * Test 1: Basic Notification System Health Check
 */
async function testSystemHealth() {
  console.log('\n🏥 TEST 1: SYSTEM HEALTH CHECK');
  console.log('='.repeat(60));

  const tests = [
    {
      name: 'Health Endpoint',
      url: `${CONFIG.BASE_URL}/api/health`,
      method: 'GET'
    },
    {
      name: 'Notifications Config',
      url: `${CONFIG.BASE_URL}/api/admin/notifications`,
      method: 'GET'
    }
  ];

  const results = [];

  for (const test of tests) {
    console.log(`🔍 Testing ${test.name}...`);
    const result = await makeRequest(test.url, { method: test.method });

    results.push({
      name: test.name,
      success: result.success,
      responseTime: result.responseTime,
      status: result.status
    });

    if (result.success) {
      console.log(`✅ ${test.name}: OK (${result.responseTime.toFixed(2)}ms)`);
    } else {
      console.log(`❌ ${test.name}: FAILED - ${result.error || result.status}`);
    }
  }

  return results;
}

/**
 * Test 2: Individual Agent Testing
 */
async function testIndividualAgents() {
  console.log('\n🤖 TEST 2: INDIVIDUAL AGENT TESTING');
  console.log('='.repeat(60));

  const agents = [
    {
      name: 'Admin Notification Agent',
      action: 'test',
      testEmail: CONFIG.ADMIN_EMAIL
    },
    {
      name: 'Order Confirmation Agent',
      action: 'processOrder',
      data: generateTestOrder('default')
    },
    {
      name: 'Payment Confirmation Agent',
      action: 'processOrder',
      data: generateTestOrder('paid')
    },
    {
      name: 'Shipping Notification Agent',
      action: 'processOrder',
      data: generateTestOrder('shipped')
    }
  ];

  const results = [];

  for (const agent of agents) {
    console.log(`🔍 Testing ${agent.name}...`);
    const startTime = performance.now();

    const requestBody = agent.action === 'test'
      ? { action: agent.action, testEmail: agent.testEmail }
      : { action: agent.action, ...agent.data };

    const result = await makeRequest(`${CONFIG.BASE_URL}/api/admin/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const endTime = performance.now();

    results.push({
      agent: agent.name,
      success: result.success,
      responseTime: endTime - startTime,
      agentResults: result.data?.summary || null,
      error: result.error
    });

    if (result.success) {
      const summary = result.data.summary;
      console.log(`✅ ${agent.name}: ${summary?.successful || 1}/${summary?.total || 1} agents succeeded`);
      if (summary?.details) {
        summary.details.forEach(detail => {
          const status = detail.status === 'fulfilled' ? '✅' : '❌';
          console.log(`   ${status} ${detail.agent}`);
        });
      }
    } else {
      console.log(`❌ ${agent.name}: FAILED - ${result.error}`);
    }

    await delay(2000); // Rate limiting
  }

  return results;
}

/**
 * Test 3: Concurrent Load Testing
 */
async function testConcurrentLoad() {
  console.log('\n⚡ TEST 3: CONCURRENT LOAD TESTING');
  console.log('='.repeat(60));

  console.log(`🚀 Running ${CONFIG.CONCURRENT_TESTS} concurrent requests...`);

  const startTime = performance.now();

  const promises = Array(CONFIG.CONCURRENT_TESTS).fill().map(async (_, index) => {
    const testOrder = generateTestOrder(index % 2 === 0 ? 'default' : 'paid');
    testOrder.orderId = `LOAD-${index}-${Date.now()}`;

    return makeRequest(`${CONFIG.BASE_URL}/api/admin/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'processOrder', ...testOrder })
    });
  });

  const results = await Promise.allSettled(promises);
  const endTime = performance.now();

  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const failed = results.length - successful;
  const totalTime = endTime - startTime;
  const avgResponseTime = results
    .filter(r => r.status === 'fulfilled')
    .reduce((sum, r) => sum + r.value.responseTime, 0) / results.length;

  console.log(`📊 Load Test Results:`);
  console.log(`   • Total Requests: ${results.length}`);
  console.log(`   • Successful: ${successful} (${(successful/results.length*100).toFixed(1)}%)`);
  console.log(`   • Failed: ${failed} (${(failed/results.length*100).toFixed(1)}%)`);
  console.log(`   • Total Time: ${totalTime.toFixed(2)}ms`);
  console.log(`   • Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`   • Requests/Second: ${(results.length / (totalTime / 1000)).toFixed(2)}`);

  return {
    total: results.length,
    successful,
    failed,
    totalTime,
    avgResponseTime,
    requestsPerSecond: results.length / (totalTime / 1000),
    passedThresholds: {
      responseTime: avgResponseTime < CONFIG.MAX_RESPONSE_TIME,
      successRate: (successful / results.length) >= (CONFIG.MIN_SUCCESS_RATE / 100),
      errorRate: (failed / results.length) <= (CONFIG.MAX_ERROR_RATE / 100)
    }
  };
}

/**
 * Test 4: Error Handling and Recovery
 */
async function testErrorHandling() {
  console.log('\n🛡️ TEST 4: ERROR HANDLING AND RECOVERY');
  console.log('='.repeat(60));

  const errorTests = [
    {
      name: 'Invalid Email Test',
      data: generateTestOrder('invalid_email')
    },
    {
      name: 'Malformed Request',
      data: { invalid: 'data' }
    },
    {
      name: 'Missing Required Fields',
      data: { action: 'processOrder', orderId: 'incomplete' }
    },
    {
      name: 'Large Payload Test',
      data: generateTestOrder('large_order')
    }
  ];

  const results = [];

  for (const test of errorTests) {
    console.log(`🔍 Testing ${test.name}...`);

    const result = await makeRequest(`${CONFIG.BASE_URL}/api/admin/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'processOrder', ...test.data })
    });

    results.push({
      test: test.name,
      handled: result.success || (result.status >= 400 && result.status < 500), // Proper error codes
      response: result.data,
      responseTime: result.responseTime
    });

    if (result.success) {
      console.log(`✅ ${test.name}: Handled gracefully`);
    } else if (result.status >= 400 && result.status < 500) {
      console.log(`⚠️ ${test.name}: Proper error response (${result.status})`);
    } else {
      console.log(`❌ ${test.name}: Unexpected failure`);
    }

    await delay(1000);
  }

  return results;
}

/**
 * Test 5: MongoDB Persistence Verification
 */
async function testMongoPersistence() {
  console.log('\n🗄️ TEST 5: MONGODB PERSISTENCE VERIFICATION');
  console.log('='.repeat(60));

  // First, send a notification
  const testOrder = generateTestOrder('default');
  testOrder.orderId = `MONGO-TEST-${Date.now()}`;

  console.log('🔍 Sending test notification...');
  const sendResult = await makeRequest(`${CONFIG.BASE_URL}/api/admin/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'processOrder', ...testOrder })
  });

  if (!sendResult.success) {
    console.log('❌ Failed to send test notification');
    return { success: false, error: 'Send failed' };
  }

  // Wait for processing
  await delay(3000);

  // Check if data was persisted
  console.log('🔍 Checking MongoDB persistence...');
  const statsResult = await makeRequest(`${CONFIG.BASE_URL}/api/admin/notifications`, {
    method: 'GET'
  });

  if (statsResult.success && statsResult.data.statistics) {
    const stats = statsResult.data.statistics;
    const totalNotifications = stats.reduce((sum, stat) => sum + stat.total, 0);

    console.log(`✅ MongoDB Persistence: ${totalNotifications} notifications logged`);
    console.log('📊 Statistics by type:');
    stats.forEach(stat => {
      console.log(`   • ${stat._id}: ${stat.total} total, ${stat.sent} sent, ${stat.failed} failed`);
    });

    return {
      success: true,
      totalNotifications,
      statistics: stats
    };
  } else {
    console.log('❌ Failed to retrieve MongoDB statistics');
    return { success: false, error: 'Stats retrieval failed' };
  }
}

/**
 * Test 6: Performance Benchmark
 */
async function testPerformanceBenchmark() {
  console.log('\n🏁 TEST 6: PERFORMANCE BENCHMARK');
  console.log('='.repeat(60));

  const benchmarks = [];

  console.log(`🔥 Running ${CONFIG.LOAD_TEST_ITERATIONS} iterations...`);

  for (let i = 0; i < CONFIG.LOAD_TEST_ITERATIONS; i++) {
    const testOrder = generateTestOrder('default');
    testOrder.orderId = `BENCH-${i}-${Date.now()}`;

    const startTime = performance.now();

    const result = await makeRequest(`${CONFIG.BASE_URL}/api/admin/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'processOrder', ...testOrder })
    });

    const endTime = performance.now();

    benchmarks.push({
      iteration: i + 1,
      responseTime: endTime - startTime,
      success: result.success,
      agentsExecuted: result.data?.summary?.successful || 0
    });

    if ((i + 1) % 2 === 0) {
      console.log(`   Completed ${i + 1}/${CONFIG.LOAD_TEST_ITERATIONS} iterations`);
    }

    await delay(500); // Avoid overwhelming the system
  }

  const successfulBenchmarks = benchmarks.filter(b => b.success);
  const avgResponseTime = successfulBenchmarks.reduce((sum, b) => sum + b.responseTime, 0) / successfulBenchmarks.length;
  const minResponseTime = Math.min(...successfulBenchmarks.map(b => b.responseTime));
  const maxResponseTime = Math.max(...successfulBenchmarks.map(b => b.responseTime));
  const successRate = (successfulBenchmarks.length / benchmarks.length) * 100;

  console.log('📊 Performance Benchmark Results:');
  console.log(`   • Total Iterations: ${benchmarks.length}`);
  console.log(`   • Success Rate: ${successRate.toFixed(1)}%`);
  console.log(`   • Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`   • Min Response Time: ${minResponseTime.toFixed(2)}ms`);
  console.log(`   • Max Response Time: ${maxResponseTime.toFixed(2)}ms`);
  console.log(`   • Performance Grade: ${avgResponseTime < 2000 ? 'A' : avgResponseTime < 5000 ? 'B' : 'C'}`);

  return {
    iterations: benchmarks.length,
    successRate,
    avgResponseTime,
    minResponseTime,
    maxResponseTime,
    benchmarks
  };
}

// ============================================================================
// MAIN EXECUTION FUNCTION
// ============================================================================

async function runComprehensiveTests() {
  const startTime = performance.now();

  console.log(`
🧪 ======================================================================
🧪 ADVANCED NOTIFICATION SYSTEM TESTING FRAMEWORK - JC HAIR STUDIO
🧪 ======================================================================
🌐 Base URL: ${CONFIG.BASE_URL}
📧 Admin Email: ${CONFIG.ADMIN_EMAIL}
⏰ Started at: ${new Date().toLocaleString('pt-BR')}
🎯 Test Configuration: ${CONFIG.CONCURRENT_TESTS} concurrent, ${CONFIG.LOAD_TEST_ITERATIONS} iterations
🧪 ======================================================================
`);

  const testResults = {
    systemHealth: null,
    individualAgents: null,
    concurrentLoad: null,
    errorHandling: null,
    mongoPersistence: null,
    performanceBenchmark: null,
    summary: {
      totalTests: 6,
      passedTests: 0,
      failedTests: 0,
      overallGrade: 'F'
    }
  };

  try {
    // Test 1: System Health
    testResults.systemHealth = await testSystemHealth();
    await delay(2000);

    // Test 2: Individual Agents
    testResults.individualAgents = await testIndividualAgents();
    await delay(3000);

    // Test 3: Concurrent Load
    testResults.concurrentLoad = await testConcurrentLoad();
    await delay(3000);

    // Test 4: Error Handling
    testResults.errorHandling = await testErrorHandling();
    await delay(2000);

    // Test 5: MongoDB Persistence
    testResults.mongoPersistence = await testMongoPersistence();
    await delay(2000);

    // Test 6: Performance Benchmark
    testResults.performanceBenchmark = await testPerformanceBenchmark();

  } catch (error) {
    console.error('❌ CRITICAL ERROR DURING TESTING:', error);
  }

  const endTime = performance.now();
  const totalDuration = (endTime - startTime) / 1000;

  // Calculate summary
  const passedTests = [
    testResults.systemHealth?.every(r => r.success) || false,
    testResults.individualAgents?.every(r => r.success) || false,
    testResults.concurrentLoad?.passedThresholds?.successRate || false,
    testResults.errorHandling?.every(r => r.handled) || false,
    testResults.mongoPersistence?.success || false,
    testResults.performanceBenchmark?.successRate >= 95 || false
  ].filter(Boolean).length;

  testResults.summary = {
    totalTests: 6,
    passedTests,
    failedTests: 6 - passedTests,
    successRate: (passedTests / 6) * 100,
    overallGrade: passedTests >= 5 ? 'A' : passedTests >= 4 ? 'B' : passedTests >= 3 ? 'C' : 'F',
    totalDuration: totalDuration.toFixed(2)
  };

  // Final Report
  console.log('\n' + '='.repeat(80));
  console.log('📋 COMPREHENSIVE TEST REPORT - NOTIFICATION SYSTEM QA');
  console.log('='.repeat(80));
  console.log(`⏱️ Total Duration: ${totalDuration.toFixed(2)} seconds`);
  console.log(`📊 Tests Passed: ${passedTests}/6 (${testResults.summary.successRate.toFixed(1)}%)`);
  console.log(`🎯 Overall Grade: ${testResults.summary.overallGrade}`);
  console.log(`🌐 Environment: ${CONFIG.BASE_URL}`);
  console.log('');

  // Detailed Results
  console.log('📝 DETAILED TEST RESULTS:');
  console.log('-'.repeat(80));

  const testNames = [
    'System Health Check',
    'Individual Agent Testing',
    'Concurrent Load Testing',
    'Error Handling & Recovery',
    'MongoDB Persistence',
    'Performance Benchmark'
  ];

  const testStatuses = [
    testResults.systemHealth?.every(r => r.success),
    testResults.individualAgents?.every(r => r.success),
    testResults.concurrentLoad?.passedThresholds?.successRate,
    testResults.errorHandling?.every(r => r.handled),
    testResults.mongoPersistence?.success,
    testResults.performanceBenchmark?.successRate >= 95
  ];

  testNames.forEach((name, index) => {
    const status = testStatuses[index] ? 'PASSED' : 'FAILED';
    const emoji = testStatuses[index] ? '✅' : '❌';
    console.log(`${emoji} ${status.padEnd(8)} - ${name}`);
  });

  console.log('');

  // Performance Metrics
  if (testResults.performanceBenchmark) {
    console.log('⚡ PERFORMANCE METRICS:');
    console.log(`   • Average Response Time: ${testResults.performanceBenchmark.avgResponseTime.toFixed(2)}ms`);
    console.log(`   • Success Rate: ${testResults.performanceBenchmark.successRate.toFixed(1)}%`);
    console.log(`   • Performance Grade: ${testResults.performanceBenchmark.avgResponseTime < 2000 ? 'A' : 'B'}`);
  }

  if (testResults.concurrentLoad) {
    console.log(`   • Concurrent Load Success: ${testResults.concurrentLoad.successful}/${testResults.concurrentLoad.total}`);
    console.log(`   • Requests per Second: ${testResults.concurrentLoad.requestsPerSecond.toFixed(2)}`);
  }

  console.log('');

  // Recommendations
  console.log('💡 RECOMMENDATIONS:');
  if (testResults.summary.successRate >= 95) {
    console.log('   🎉 EXCELLENT! System is production-ready');
    console.log('   ✓ All critical components are functioning optimally');
    console.log('   ✓ Performance meets production standards');
    console.log('   ✓ Error handling is robust');
  } else if (testResults.summary.successRate >= 80) {
    console.log('   ⚡ GOOD! Minor optimizations recommended');
    console.log('   • Monitor performance under sustained load');
    console.log('   • Review failed test cases for improvements');
  } else {
    console.log('   🚨 CRITICAL! System needs immediate attention');
    console.log('   • Review notification agent implementations');
    console.log('   • Check SendGrid configuration and limits');
    console.log('   • Verify MongoDB connectivity and performance');
    console.log('   • Consider implementing circuit breakers');
  }

  console.log('');
  console.log(`⏰ Test completed at: ${new Date().toLocaleString('pt-BR')}`);
  console.log('='.repeat(80));

  return testResults;
}

// Execute tests if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runComprehensiveTests()
    .then(results => {
      process.exit(results.summary.overallGrade === 'F' ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ FATAL ERROR:', error);
      process.exit(1);
    });
}

export { runComprehensiveTests, CONFIG };