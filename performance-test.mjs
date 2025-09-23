#!/usr/bin/env node

/**
 * PERFORMANCE TEST SUITE - JC Hair Studio
 * Tests critical endpoints for production readiness
 */

import { performance } from 'perf_hooks';

const BASE_URL = 'https://jchairstudios62.xyz';

// Critical endpoints to test
const ENDPOINTS = [
  { path: '/', name: 'Homepage', method: 'GET' },
  { path: '/api/health', name: 'Health Check', method: 'GET' },
  { path: '/api/products', name: 'Products API', method: 'GET' },
  { path: '/maquiagens', name: 'Makeup Category', method: 'GET' },
  { path: '/api/admin/notifications', name: 'Notifications Config', method: 'GET' },
  { path: '/api/get-client-ip', name: 'Client IP API', method: 'GET' }
];

// Performance thresholds (milliseconds)
const THRESHOLDS = {
  excellent: 500,
  good: 1000,
  acceptable: 2000,
  poor: 5000
};

/**
 * Test individual endpoint performance
 */
async function testEndpoint(endpoint) {
  const startTime = performance.now();

  try {
    const response = await fetch(`${BASE_URL}${endpoint.path}`, {
      method: endpoint.method,
      headers: {
        'User-Agent': 'Production-Readiness-Test/1.0'
      }
    });

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    // Determine performance rating
    let rating = 'poor';
    if (duration <= THRESHOLDS.excellent) rating = 'excellent';
    else if (duration <= THRESHOLDS.good) rating = 'good';
    else if (duration <= THRESHOLDS.acceptable) rating = 'acceptable';

    const ratingIcon = {
      excellent: '🚀',
      good: '✅',
      acceptable: '⚠️',
      poor: '❌'
    }[rating];

    return {
      name: endpoint.name,
      path: endpoint.path,
      method: endpoint.method,
      duration,
      rating,
      status: response.status,
      statusText: response.statusText,
      success: response.ok,
      icon: ratingIcon,
      contentLength: response.headers.get('content-length') || 'unknown'
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    return {
      name: endpoint.name,
      path: endpoint.path,
      method: endpoint.method,
      duration,
      rating: 'error',
      status: 0,
      statusText: 'Network Error',
      success: false,
      icon: '💥',
      error: error.message,
      contentLength: 0
    };
  }
}

/**
 * Run comprehensive performance tests
 */
async function runPerformanceTests() {
  console.log(`
🚀 ====================================================================
🚀 PERFORMANCE TEST SUITE - JC HAIR STUDIO PRODUCTION READINESS
🚀 ====================================================================
🌐 Base URL: ${BASE_URL}
⏰ Started: ${new Date().toLocaleString('pt-PT')}
📊 Testing ${ENDPOINTS.length} critical endpoints
🚀 ====================================================================
  `);

  const results = [];

  console.log('🏃‍♂️ Running endpoint tests...\n');

  // Test each endpoint
  for (const endpoint of ENDPOINTS) {
    console.log(`🔍 Testing: ${endpoint.name} (${endpoint.path})`);
    const result = await testEndpoint(endpoint);
    results.push(result);

    console.log(`   ${result.icon} ${result.duration}ms - ${result.status} ${result.statusText}`);
    if (result.error) console.log(`      Error: ${result.error}`);
    console.log('');

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Performance summary
  const totalTests = results.length;
  const successfulTests = results.filter(r => r.success).length;
  const averageTime = Math.round(results.reduce((sum, r) => sum + r.duration, 0) / totalTests);

  const ratingCounts = {
    excellent: results.filter(r => r.rating === 'excellent').length,
    good: results.filter(r => r.rating === 'good').length,
    acceptable: results.filter(r => r.rating === 'acceptable').length,
    poor: results.filter(r => r.rating === 'poor').length,
    error: results.filter(r => r.rating === 'error').length
  };

  console.log(`
📊 ====================================================================
📊 PERFORMANCE TEST RESULTS SUMMARY
📊 ====================================================================

📈 Overall Performance:
  • Total Endpoints: ${totalTests}
  • Successful: ${successfulTests}/${totalTests} (${Math.round(successfulTests/totalTests*100)}%)
  • Average Response Time: ${averageTime}ms
  • Success Rate: ${successfulTests === totalTests ? '✅ 100%' : '⚠️ ' + Math.round(successfulTests/totalTests*100) + '%'}

⚡ Performance Breakdown:
  🚀 Excellent (≤${THRESHOLDS.excellent}ms): ${ratingCounts.excellent} endpoints
  ✅ Good (≤${THRESHOLDS.good}ms): ${ratingCounts.good} endpoints
  ⚠️ Acceptable (≤${THRESHOLDS.acceptable}ms): ${ratingCounts.acceptable} endpoints
  ❌ Poor (>${THRESHOLDS.acceptable}ms): ${ratingCounts.poor} endpoints
  💥 Errors: ${ratingCounts.error} endpoints

📋 DETAILED RESULTS:
────────────────────────────────────────────────────────────────────
  `);

  // Detailed results table
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.icon} ${result.name}`);
    console.log(`   📍 ${result.method} ${result.path}`);
    console.log(`   ⏱️ ${result.duration}ms | 📊 ${result.status} ${result.statusText}`);
    console.log(`   📏 Content: ${result.contentLength} bytes | 🎯 Rating: ${result.rating.toUpperCase()}`);
    if (result.error) console.log(`   ❌ Error: ${result.error}`);
    console.log('');
  });

  // Production readiness assessment
  const productionReady = successfulTests === totalTests &&
                         ratingCounts.error === 0 &&
                         ratingCounts.poor <= 1 &&
                         averageTime <= THRESHOLDS.good;

  console.log(`
🎯 ====================================================================
🎯 PRODUCTION READINESS ASSESSMENT
🎯 ====================================================================

${productionReady ? '🟢 PRODUCTION READY' : '🔴 NOT PRODUCTION READY'}

📋 Assessment Criteria:
  ${successfulTests === totalTests ? '✅' : '❌'} All endpoints responding (${successfulTests}/${totalTests})
  ${ratingCounts.error === 0 ? '✅' : '❌'} No network errors (${ratingCounts.error} errors)
  ${ratingCounts.poor <= 1 ? '✅' : '❌'} Minimal poor performance (${ratingCounts.poor} ≤ 1)
  ${averageTime <= THRESHOLDS.good ? '✅' : '❌'} Good average response time (${averageTime}ms ≤ ${THRESHOLDS.good}ms)

💡 RECOMMENDATIONS:
  `);

  if (ratingCounts.error > 0) {
    console.log(`   🔧 Fix ${ratingCounts.error} endpoint(s) with network errors`);
  }
  if (ratingCounts.poor > 1) {
    console.log(`   ⚡ Optimize ${ratingCounts.poor} slow endpoint(s) (>${THRESHOLDS.acceptable}ms)`);
  }
  if (averageTime > THRESHOLDS.good) {
    console.log(`   📈 Improve overall response time (current: ${averageTime}ms)`);
  }
  if (productionReady) {
    console.log(`   🚀 System performance is excellent for production deployment`);
    console.log(`   📊 Monitor response times regularly`);
    console.log(`   🔄 Run performance tests weekly`);
  }

  console.log(`
⏰ Test completed: ${new Date().toLocaleString('pt-PT')}
🚀 ====================================================================
  `);

  return {
    totalTests,
    successfulTests,
    averageTime,
    ratingCounts,
    productionReady,
    results,
    summary: {
      status: productionReady ? 'READY' : 'NOT_READY',
      score: Math.round(successfulTests/totalTests*100),
      avgResponseTime: averageTime,
      criticalIssues: ratingCounts.error + ratingCounts.poor
    }
  };
}

// Run the tests
(async function main() {
  try {
    const results = await runPerformanceTests();
    process.exit(results.productionReady ? 0 : 1);
  } catch (error) {
    console.error('\n❌ CRITICAL ERROR IN PERFORMANCE TESTS:', error);
    process.exit(1);
  }
})();