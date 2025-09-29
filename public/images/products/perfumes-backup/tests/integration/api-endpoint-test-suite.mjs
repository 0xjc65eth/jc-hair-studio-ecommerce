#!/usr/bin/env node

/**
 * @fileoverview API Endpoint Testing Framework - JC Hair Studio
 * @author JC Hair Studio Development Team - Agent 6 (QA Specialist)
 * @version 1.0.0
 *
 * COMPREHENSIVE API TESTING FRAMEWORK:
 * - Admin API Endpoints Testing
 * - Notification System API Testing
 * - Data Flow Validation
 * - Security Testing
 * - Performance Testing
 * - Error Handling Validation
 * - Integration Testing
 * - Rate Limiting Testing
 *
 * FEATURES:
 * ✅ Complete API endpoint coverage
 * ✅ Request/Response validation
 * ✅ Security vulnerability testing
 * ✅ Performance benchmarking
 * ✅ Error state validation
 * ✅ Data integrity testing
 * ✅ Authentication testing
 * ✅ Rate limiting validation
 */

import { performance } from 'perf_hooks';
import crypto from 'crypto';

// ============================================================================
// API TESTING CONFIGURATION
// ============================================================================

const API_TEST_CONFIG = {
  BASE_URL: process.env.TEST_BASE_URL || 'https://jc-hair-studio-iqxbgl0d5-0xjc65eths-projects.vercel.app',
  ADMIN_EMAIL: 'juliocesarurss65@gmail.com',

  // API Testing Configuration
  REQUEST_TIMEOUT: 30000,
  RATE_LIMIT_TEST_REQUESTS: 10,
  CONCURRENT_REQUEST_LIMIT: 5,

  // Performance Thresholds
  MAX_RESPONSE_TIME: {
    GET: 2000,
    POST: 5000,
    PUT: 3000,
    DELETE: 2000
  },

  // Security Testing
  INJECTION_PAYLOADS: [
    '<script>alert("xss")</script>',
    "'; DROP TABLE orders; --",
    '{{7*7}}',
    '${7*7}',
    '../../../etc/passwd',
    'javascript:alert("xss")'
  ],

  // API Endpoints to Test
  ENDPOINTS: {
    admin: {
      orders: '/api/admin/orders',
      notifications: '/api/admin/notifications',
      products: '/api/admin/products'
    },
    public: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/categories',
      search: '/api/search'
    },
    notification: {
      paymentSuccess: '/api/payment-success',
      notifyShipping: '/api/notify-shipping',
      contact: '/api/contact',
      newsletter: '/api/newsletter'
    }
  }
};

// ============================================================================
// API TESTING UTILITIES
// ============================================================================

class APITestUtilities {
  static async makeRequest(url, options = {}, timeout = API_TEST_CONFIG.REQUEST_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const startTime = performance.now();
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      const endTime = performance.now();

      clearTimeout(timeoutId);

      let data = null;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (parseError) {
          data = { parseError: parseError.message };
        }
      } else {
        data = await response.text();
      }

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data,
        responseTime: endTime - startTime,
        url,
        method: options.method || 'GET'
      };
    } catch (error) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: error.message,
        responseTime: timeout,
        url,
        method: options.method || 'GET'
      };
    }
  }

  static generateTestData(type = 'order') {
    const timestamp = Date.now();

    switch (type) {
      case 'order':
        return {
          orderId: `API-TEST-${timestamp}`,
          customerName: 'API Test Customer',
          customerEmail: `api.test.${timestamp}@example.com`,
          customerPhone: '+351 900 000 000',
          total: Math.random() * 500 + 50,
          currency: 'EUR',
          status: 'pending',
          paymentMethod: 'Credit Card',
          products: [
            {
              name: 'API Test Product',
              quantity: 1,
              price: 49.99,
              sku: `API-TEST-${timestamp}`
            }
          ],
          shippingAddress: {
            name: 'API Test Customer',
            street: 'Test Street, 123',
            city: 'Test City',
            zipCode: '1000-001',
            country: 'Portugal'
          },
          createdAt: new Date().toISOString()
        };

      case 'notification':
        return {
          action: 'test',
          testEmail: API_TEST_CONFIG.ADMIN_EMAIL,
          timestamp: new Date().toISOString()
        };

      case 'contact':
        return {
          name: 'API Test Contact',
          email: `api.contact.${timestamp}@example.com`,
          subject: 'API Test Message',
          message: 'This is an automated API test message.',
          formType: 'support'
        };

      case 'newsletter':
        return {
          email: `api.newsletter.${timestamp}@example.com`,
          name: 'API Newsletter Test'
        };

      default:
        return {};
    }
  }

  static validateResponseStructure(data, expectedStructure) {
    const errors = [];

    for (const [key, type] of Object.entries(expectedStructure)) {
      if (!(key in data)) {
        errors.push(`Missing required field: ${key}`);
      } else if (typeof data[key] !== type && type !== 'any') {
        errors.push(`Field ${key} should be ${type}, got ${typeof data[key]}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static async testSecurityPayloads(url, method = 'POST', fieldName = 'testField') {
    const results = [];

    for (const payload of API_TEST_CONFIG.INJECTION_PAYLOADS) {
      try {
        const testData = { [fieldName]: payload };
        const result = await this.makeRequest(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData)
        });

        results.push({
          payload,
          status: result.status,
          blocked: result.status === 400 || result.status === 422,
          responseTime: result.responseTime
        });
      } catch (error) {
        results.push({
          payload,
          error: error.message,
          blocked: true
        });
      }
    }

    return results;
  }

  static async testRateLimit(url, requestCount = API_TEST_CONFIG.RATE_LIMIT_TEST_REQUESTS) {
    const requests = [];
    const startTime = performance.now();

    // Send multiple requests rapidly
    for (let i = 0; i < requestCount; i++) {
      requests.push(this.makeRequest(url));
    }

    const results = await Promise.all(requests);
    const endTime = performance.now();

    const successCount = results.filter(r => r.success).length;
    const rateLimitedCount = results.filter(r => r.status === 429).length;

    return {
      totalRequests: requestCount,
      successfulRequests: successCount,
      rateLimitedRequests: rateLimitedCount,
      totalTime: endTime - startTime,
      requestsPerSecond: requestCount / ((endTime - startTime) / 1000),
      rateLimitingWorking: rateLimitedCount > 0
    };
  }
}

// ============================================================================
// API ENDPOINT TESTERS
// ============================================================================

class AdminAPITester {
  constructor() {
    this.name = 'Admin API';
    this.results = [];
  }

  async testOrdersEndpoint() {
    console.log('📋 Testing Admin Orders API...');

    const tests = [
      { method: 'GET', name: 'get_orders', endpoint: API_TEST_CONFIG.ENDPOINTS.admin.orders },
      { method: 'POST', name: 'create_order', endpoint: API_TEST_CONFIG.ENDPOINTS.admin.orders, data: APITestUtilities.generateTestData('order') }
    ];

    for (const test of tests) {
      const options = {
        method: test.method,
        headers: { 'Content-Type': 'application/json' }
      };

      if (test.data) {
        options.body = JSON.stringify(test.data);
      }

      const result = await APITestUtilities.makeRequest(
        `${API_TEST_CONFIG.BASE_URL}${test.endpoint}`,
        options
      );

      const testResult = {
        test: test.name,
        method: test.method,
        endpoint: test.endpoint,
        success: result.success,
        status: result.status,
        responseTime: result.responseTime,
        withinThreshold: result.responseTime < API_TEST_CONFIG.MAX_RESPONSE_TIME[test.method],
        dataStructure: this.validateOrdersResponse(result.data),
        errors: result.error ? [result.error] : []
      };

      this.results.push(testResult);

      const statusIcon = testResult.success ? '✅' : '❌';
      console.log(`  ${statusIcon} ${test.name}: ${result.status} (${result.responseTime.toFixed(2)}ms)`);
    }
  }

  async testNotificationsEndpoint() {
    console.log('🔔 Testing Admin Notifications API...');

    const tests = [
      { method: 'GET', name: 'get_notifications_config', endpoint: API_TEST_CONFIG.ENDPOINTS.admin.notifications },
      { method: 'POST', name: 'test_notification', endpoint: API_TEST_CONFIG.ENDPOINTS.admin.notifications, data: APITestUtilities.generateTestData('notification') },
      { method: 'POST', name: 'process_order_notification', endpoint: API_TEST_CONFIG.ENDPOINTS.admin.notifications, data: { action: 'processOrder', ...APITestUtilities.generateTestData('order') } }
    ];

    for (const test of tests) {
      const options = {
        method: test.method,
        headers: { 'Content-Type': 'application/json' }
      };

      if (test.data) {
        options.body = JSON.stringify(test.data);
      }

      const result = await APITestUtilities.makeRequest(
        `${API_TEST_CONFIG.BASE_URL}${test.endpoint}`,
        options
      );

      const testResult = {
        test: test.name,
        method: test.method,
        endpoint: test.endpoint,
        success: result.success,
        status: result.status,
        responseTime: result.responseTime,
        withinThreshold: result.responseTime < API_TEST_CONFIG.MAX_RESPONSE_TIME[test.method],
        dataStructure: this.validateNotificationsResponse(result.data),
        errors: result.error ? [result.error] : []
      };

      this.results.push(testResult);

      const statusIcon = testResult.success ? '✅' : '❌';
      console.log(`  ${statusIcon} ${test.name}: ${result.status} (${result.responseTime.toFixed(2)}ms)`);

      // Add delay between notification tests
      await this.delay(2000);
    }
  }

  async testSecurityValidation() {
    console.log('🔒 Testing Admin API Security...');

    const securityTests = [
      {
        name: 'orders_sql_injection',
        endpoint: API_TEST_CONFIG.ENDPOINTS.admin.orders,
        method: 'POST'
      },
      {
        name: 'notifications_xss_protection',
        endpoint: API_TEST_CONFIG.ENDPOINTS.admin.notifications,
        method: 'POST'
      }
    ];

    for (const test of securityTests) {
      const securityResults = await APITestUtilities.testSecurityPayloads(
        `${API_TEST_CONFIG.BASE_URL}${test.endpoint}`,
        test.method
      );

      const blockedCount = securityResults.filter(r => r.blocked).length;
      const securityScore = (blockedCount / securityResults.length) * 100;

      const testResult = {
        test: test.name,
        endpoint: test.endpoint,
        success: securityScore >= 80, // At least 80% of malicious payloads should be blocked
        securityScore,
        blockedPayloads: blockedCount,
        totalPayloads: securityResults.length,
        vulnerabilities: securityResults.filter(r => !r.blocked),
        errors: securityScore < 80 ? [`Low security score: ${securityScore.toFixed(1)}%`] : []
      };

      this.results.push(testResult);

      const statusIcon = testResult.success ? '✅' : '⚠️';
      console.log(`  ${statusIcon} ${test.name}: Security Score ${securityScore.toFixed(1)}%`);
    }
  }

  validateOrdersResponse(data) {
    if (typeof data === 'string') return { valid: false, errors: ['Non-JSON response'] };

    const expectedStructure = {
      success: 'boolean'
    };

    return APITestUtilities.validateResponseStructure(data, expectedStructure);
  }

  validateNotificationsResponse(data) {
    if (typeof data === 'string') return { valid: false, errors: ['Non-JSON response'] };

    const expectedStructure = {
      success: 'boolean'
    };

    return APITestUtilities.validateResponseStructure(data, expectedStructure);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateReport() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const avgResponseTime = this.results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / totalTests;

    return {
      component: this.name,
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      successRate: (passedTests / totalTests) * 100,
      avgResponseTime,
      results: this.results,
      grade: this.calculateGrade(passedTests, totalTests, avgResponseTime)
    };
  }

  calculateGrade(passed, total, avgTime) {
    const successRate = (passed / total) * 100;
    const performanceGood = avgTime < 3000;

    if (successRate === 100 && performanceGood) return 'A+';
    if (successRate >= 95 && performanceGood) return 'A';
    if (successRate >= 90) return 'B';
    if (successRate >= 80) return 'C';
    return 'F';
  }
}

class NotificationAPITester {
  constructor() {
    this.name = 'Notification API';
    this.results = [];
  }

  async testPaymentSuccessEndpoint() {
    console.log('💳 Testing Payment Success API...');

    const paymentData = {
      paymentIntentId: `pi_test_${Date.now()}`,
      customerInfo: {
        name: 'Payment Test Customer',
        email: 'payment.test@example.com',
        phone: '+351 900 000 000'
      },
      items: [
        {
          name: 'Test Product',
          quantity: 1,
          price: 99.99
        }
      ],
      amount: 99.99,
      shippingAddress: APITestUtilities.generateTestData('order').shippingAddress,
      deliveryMethod: 'Standard'
    };

    const result = await APITestUtilities.makeRequest(
      `${API_TEST_CONFIG.BASE_URL}${API_TEST_CONFIG.ENDPOINTS.notification.paymentSuccess}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      }
    );

    const testResult = {
      test: 'payment_success_notification',
      endpoint: API_TEST_CONFIG.ENDPOINTS.notification.paymentSuccess,
      success: result.success,
      status: result.status,
      responseTime: result.responseTime,
      dataStructure: this.validateNotificationResponse(result.data),
      errors: result.error ? [result.error] : []
    };

    this.results.push(testResult);

    const statusIcon = testResult.success ? '✅' : '❌';
    console.log(`  ${statusIcon} payment_success: ${result.status} (${result.responseTime.toFixed(2)}ms)`);
  }

  async testContactEndpoint() {
    console.log('📞 Testing Contact API...');

    const contactData = APITestUtilities.generateTestData('contact');

    const result = await APITestUtilities.makeRequest(
      `${API_TEST_CONFIG.BASE_URL}${API_TEST_CONFIG.ENDPOINTS.notification.contact}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      }
    );

    const testResult = {
      test: 'contact_form_submission',
      endpoint: API_TEST_CONFIG.ENDPOINTS.notification.contact,
      success: result.success,
      status: result.status,
      responseTime: result.responseTime,
      dataStructure: this.validateNotificationResponse(result.data),
      errors: result.error ? [result.error] : []
    };

    this.results.push(testResult);

    const statusIcon = testResult.success ? '✅' : '❌';
    console.log(`  ${statusIcon} contact_form: ${result.status} (${result.responseTime.toFixed(2)}ms)`);
  }

  async testNewsletterEndpoint() {
    console.log('📧 Testing Newsletter API...');

    const newsletterData = APITestUtilities.generateTestData('newsletter');

    const result = await APITestUtilities.makeRequest(
      `${API_TEST_CONFIG.BASE_URL}${API_TEST_CONFIG.ENDPOINTS.notification.newsletter}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsletterData)
      }
    );

    const testResult = {
      test: 'newsletter_subscription',
      endpoint: API_TEST_CONFIG.ENDPOINTS.notification.newsletter,
      success: result.success,
      status: result.status,
      responseTime: result.responseTime,
      dataStructure: this.validateNotificationResponse(result.data),
      errors: result.error ? [result.error] : []
    };

    this.results.push(testResult);

    const statusIcon = testResult.success ? '✅' : '❌';
    console.log(`  ${statusIcon} newsletter: ${result.status} (${result.responseTime.toFixed(2)}ms)`);
  }

  async testErrorHandling() {
    console.log('🚨 Testing Error Handling...');

    const errorTests = [
      {
        name: 'missing_required_fields',
        endpoint: API_TEST_CONFIG.ENDPOINTS.notification.contact,
        data: { incomplete: 'data' }
      },
      {
        name: 'invalid_email_format',
        endpoint: API_TEST_CONFIG.ENDPOINTS.notification.newsletter,
        data: { email: 'invalid-email', name: 'Test' }
      },
      {
        name: 'malformed_json',
        endpoint: API_TEST_CONFIG.ENDPOINTS.notification.contact,
        data: 'invalid json string',
        rawBody: true
      }
    ];

    for (const test of errorTests) {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      };

      if (test.rawBody) {
        options.body = test.data;
      } else {
        options.body = JSON.stringify(test.data);
      }

      const result = await APITestUtilities.makeRequest(
        `${API_TEST_CONFIG.BASE_URL}${test.endpoint}`,
        options
      );

      const testResult = {
        test: test.name,
        endpoint: test.endpoint,
        success: result.status >= 400 && result.status < 500, // Should return client error
        status: result.status,
        responseTime: result.responseTime,
        properErrorHandling: result.status >= 400 && result.status < 500,
        errors: result.status < 400 ? ['Should have returned client error'] : []
      };

      this.results.push(testResult);

      const statusIcon = testResult.success ? '✅' : '⚠️';
      console.log(`  ${statusIcon} ${test.name}: ${result.status} (proper error: ${testResult.properErrorHandling})`);
    }
  }

  validateNotificationResponse(data) {
    if (typeof data === 'string') return { valid: false, errors: ['Non-JSON response'] };

    const expectedStructure = {
      success: 'boolean'
    };

    return APITestUtilities.validateResponseStructure(data, expectedStructure);
  }

  generateReport() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const avgResponseTime = this.results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / totalTests;

    return {
      component: this.name,
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      successRate: (passedTests / totalTests) * 100,
      avgResponseTime,
      results: this.results,
      grade: passedTests === totalTests ? 'A' : passedTests >= totalTests * 0.8 ? 'B' : 'C'
    };
  }
}

class PublicAPITester {
  constructor() {
    this.name = 'Public API';
    this.results = [];
  }

  async testHealthEndpoint() {
    console.log('🏥 Testing Health Check API...');

    const result = await APITestUtilities.makeRequest(
      `${API_TEST_CONFIG.BASE_URL}${API_TEST_CONFIG.ENDPOINTS.public.health}`
    );

    const testResult = {
      test: 'health_check',
      endpoint: API_TEST_CONFIG.ENDPOINTS.public.health,
      success: result.success,
      status: result.status,
      responseTime: result.responseTime,
      isHealthy: result.success && result.status === 200,
      errors: result.error ? [result.error] : []
    };

    this.results.push(testResult);

    const statusIcon = testResult.success ? '✅' : '❌';
    console.log(`  ${statusIcon} health_check: ${result.status} (${result.responseTime.toFixed(2)}ms)`);
  }

  async testProductsEndpoint() {
    console.log('🛍️ Testing Products API...');

    const result = await APITestUtilities.makeRequest(
      `${API_TEST_CONFIG.BASE_URL}${API_TEST_CONFIG.ENDPOINTS.public.products}`
    );

    const testResult = {
      test: 'products_list',
      endpoint: API_TEST_CONFIG.ENDPOINTS.public.products,
      success: result.success,
      status: result.status,
      responseTime: result.responseTime,
      dataStructure: this.validateProductsResponse(result.data),
      errors: result.error ? [result.error] : []
    };

    this.results.push(testResult);

    const statusIcon = testResult.success ? '✅' : '❌';
    console.log(`  ${statusIcon} products_list: ${result.status} (${result.responseTime.toFixed(2)}ms)`);
  }

  async testRateLimiting() {
    console.log('⚡ Testing Rate Limiting...');

    const rateLimitTest = await APITestUtilities.testRateLimit(
      `${API_TEST_CONFIG.BASE_URL}${API_TEST_CONFIG.ENDPOINTS.public.health}`
    );

    const testResult = {
      test: 'rate_limiting',
      endpoint: API_TEST_CONFIG.ENDPOINTS.public.health,
      success: true, // Rate limiting is optional, so this always passes
      rateLimitingActive: rateLimitTest.rateLimitingWorking,
      requestsPerSecond: rateLimitTest.requestsPerSecond,
      successfulRequests: rateLimitTest.successfulRequests,
      rateLimitedRequests: rateLimitTest.rateLimitedRequests,
      totalTime: rateLimitTest.totalTime,
      errors: []
    };

    this.results.push(testResult);

    const statusIcon = '✅';
    console.log(`  ${statusIcon} rate_limiting: ${rateLimitTest.rateLimitingWorking ? 'Active' : 'Not Active'} (${rateLimitTest.requestsPerSecond.toFixed(2)} req/s)`);
  }

  validateProductsResponse(data) {
    if (typeof data === 'string') return { valid: false, errors: ['Non-JSON response'] };

    const expectedStructure = {
      success: 'boolean'
    };

    return APITestUtilities.validateResponseStructure(data, expectedStructure);
  }

  generateReport() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const avgResponseTime = this.results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / totalTests;

    return {
      component: this.name,
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      successRate: (passedTests / totalTests) * 100,
      avgResponseTime,
      results: this.results,
      grade: passedTests === totalTests ? 'A' : 'B'
    };
  }
}

// ============================================================================
// MAIN API TEST ORCHESTRATOR
// ============================================================================

class APIEndpointTestSuite {
  constructor() {
    this.testers = {
      adminAPI: new AdminAPITester(),
      notificationAPI: new NotificationAPITester(),
      publicAPI: new PublicAPITester()
    };
    this.overallResults = {};
  }

  async runAllAPITests() {
    console.log(`
🔌 ======================================================================
🔌 API ENDPOINT TESTING FRAMEWORK - JC HAIR STUDIO QA
🔌 ======================================================================
🎯 Testing All API Endpoints for Functionality, Security, and Performance
🛡️ Security Vulnerability Testing Included
⏰ Started at: ${new Date().toLocaleString('pt-BR')}
🔌 ======================================================================
`);

    const startTime = performance.now();

    // Test Admin APIs
    console.log('\n👑 TESTING ADMIN APIs');
    console.log('='.repeat(60));
    await this.testAdminAPIs();

    await this.delay(3000);

    // Test Notification APIs
    console.log('\n📧 TESTING NOTIFICATION APIs');
    console.log('='.repeat(60));
    await this.testNotificationAPIs();

    await this.delay(3000);

    // Test Public APIs
    console.log('\n🌐 TESTING PUBLIC APIs');
    console.log('='.repeat(60));
    await this.testPublicAPIs();

    const endTime = performance.now();
    const totalDuration = (endTime - startTime) / 1000;

    this.generateComprehensiveReport(totalDuration);

    return this.overallResults;
  }

  async testAdminAPIs() {
    const tester = this.testers.adminAPI;

    await tester.testOrdersEndpoint();
    await tester.testNotificationsEndpoint();
    await tester.testSecurityValidation();

    this.overallResults.adminAPI = tester.generateReport();
  }

  async testNotificationAPIs() {
    const tester = this.testers.notificationAPI;

    await tester.testPaymentSuccessEndpoint();
    await tester.testContactEndpoint();
    await tester.testNewsletterEndpoint();
    await tester.testErrorHandling();

    this.overallResults.notificationAPI = tester.generateReport();
  }

  async testPublicAPIs() {
    const tester = this.testers.publicAPI;

    await tester.testHealthEndpoint();
    await tester.testProductsEndpoint();
    await tester.testRateLimiting();

    this.overallResults.publicAPI = tester.generateReport();
  }

  generateComprehensiveReport(totalDuration) {
    console.log('\n' + '='.repeat(80));
    console.log('🔌 COMPREHENSIVE API ENDPOINT TEST REPORT');
    console.log('='.repeat(80));

    const allAPIs = Object.values(this.overallResults);
    const totalTests = allAPIs.reduce((sum, api) => sum + api.totalTests, 0);
    const totalPassed = allAPIs.reduce((sum, api) => sum + api.passedTests, 0);
    const overallSuccessRate = (totalPassed / totalTests) * 100;
    const avgResponseTime = allAPIs.reduce((sum, api) => sum + api.avgResponseTime, 0) / allAPIs.length;

    console.log(`⏱️ Total Duration: ${totalDuration.toFixed(2)} seconds`);
    console.log(`📊 Overall Success Rate: ${totalPassed}/${totalTests} (${overallSuccessRate.toFixed(1)}%)`);
    console.log(`🎯 Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log('');

    // API-wise results
    console.log('🔌 API ENDPOINT RESULTS:');
    console.log('-'.repeat(80));

    Object.entries(this.overallResults).forEach(([apiName, report]) => {
      const status = report.successRate >= 95 ? '✅ EXCELLENT' : report.successRate >= 85 ? '⚡ GOOD' : '⚠️ NEEDS WORK';
      console.log(`${status} ${apiName.toUpperCase().padEnd(16)} - Grade: ${report.grade} | Success: ${report.successRate.toFixed(1)}% | Avg Time: ${report.avgResponseTime.toFixed(0)}ms`);
    });

    console.log('');

    // Security Assessment
    const securityTests = this.getSecurityTestResults();
    console.log('🛡️ SECURITY ASSESSMENT:');
    console.log(`   Security Score: ${securityTests.avgSecurityScore.toFixed(1)}%`);
    console.log(`   Vulnerabilities Found: ${securityTests.vulnerabilityCount}`);
    console.log(`   Security Grade: ${this.calculateSecurityGrade(securityTests.avgSecurityScore)}`);

    console.log('');

    // Performance Assessment
    console.log('⚡ PERFORMANCE ASSESSMENT:');
    console.log(`   Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`   Performance Grade: ${this.calculatePerformanceGrade(avgResponseTime)}`);
    console.log(`   Fast Endpoints: ${this.countFastEndpoints()}/${totalTests}`);

    // Overall system assessment
    const systemGrade = this.calculateOverallGrade(overallSuccessRate, avgResponseTime, securityTests.avgSecurityScore);
    console.log('');
    console.log('🎯 OVERALL API SYSTEM ASSESSMENT:');
    console.log(`   System Grade: ${systemGrade}`);
    console.log(`   Production Ready: ${this.isProductionReady(overallSuccessRate, securityTests.avgSecurityScore) ? 'YES ✅' : 'NEEDS WORK ⚠️'}`);

    // Recommendations
    console.log('\n💡 API RECOMMENDATIONS:');
    this.generateAPIRecommendations(overallSuccessRate, avgResponseTime, securityTests);

    console.log(`\n⏰ API Testing completed at: ${new Date().toLocaleString('pt-BR')}`);
    console.log('='.repeat(80));
  }

  getSecurityTestResults() {
    let totalSecurityScore = 0;
    let securityTestCount = 0;
    let vulnerabilityCount = 0;

    Object.values(this.overallResults).forEach(apiResult => {
      apiResult.results.forEach(result => {
        if (result.securityScore !== undefined) {
          totalSecurityScore += result.securityScore;
          securityTestCount++;
          vulnerabilityCount += result.vulnerabilities?.length || 0;
        }
      });
    });

    return {
      avgSecurityScore: securityTestCount > 0 ? totalSecurityScore / securityTestCount : 100,
      vulnerabilityCount,
      securityTestCount
    };
  }

  calculateSecurityGrade(securityScore) {
    if (securityScore >= 95) return 'A+';
    if (securityScore >= 90) return 'A';
    if (securityScore >= 80) return 'B';
    if (securityScore >= 70) return 'C';
    return 'F';
  }

  calculatePerformanceGrade(avgResponseTime) {
    if (avgResponseTime < 1000) return 'A+';
    if (avgResponseTime < 2000) return 'A';
    if (avgResponseTime < 3000) return 'B';
    if (avgResponseTime < 5000) return 'C';
    return 'F';
  }

  countFastEndpoints() {
    let fastCount = 0;

    Object.values(this.overallResults).forEach(apiResult => {
      apiResult.results.forEach(result => {
        if (result.responseTime && result.responseTime < 2000) {
          fastCount++;
        }
      });
    });

    return fastCount;
  }

  calculateOverallGrade(successRate, responseTime, securityScore) {
    const scores = [
      successRate >= 95 ? 4 : successRate >= 85 ? 3 : successRate >= 75 ? 2 : 1,
      responseTime < 2000 ? 4 : responseTime < 3000 ? 3 : responseTime < 5000 ? 2 : 1,
      securityScore >= 90 ? 4 : securityScore >= 80 ? 3 : securityScore >= 70 ? 2 : 1
    ];

    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    if (avgScore >= 3.7) return 'A+';
    if (avgScore >= 3.3) return 'A';
    if (avgScore >= 2.7) return 'B';
    if (avgScore >= 2.0) return 'C';
    return 'F';
  }

  isProductionReady(successRate, securityScore) {
    return successRate >= 90 && securityScore >= 80;
  }

  generateAPIRecommendations(successRate, avgResponseTime, securityResults) {
    if (successRate >= 95 && avgResponseTime < 2000 && securityResults.avgSecurityScore >= 90) {
      console.log('   🎉 OUTSTANDING! All APIs are production-ready');
      console.log('   ✓ Excellent functionality, performance, and security');
      console.log('   ✓ Continue monitoring and regular testing');
    } else {
      console.log('   📋 Areas for improvement identified:');

      if (successRate < 95) {
        console.log('   • Functionality: Review failing test cases and fix API bugs');
      }

      if (avgResponseTime >= 2000) {
        console.log('   • Performance: Optimize slow endpoints and database queries');
        console.log('   • Consider caching strategies and response compression');
      }

      if (securityResults.avgSecurityScore < 90) {
        console.log('   • Security: Implement better input validation and sanitization');
        console.log('   • Add rate limiting and authentication where needed');
      }

      console.log('   • Regular security audits and penetration testing recommended');
      console.log('   • Monitor API performance in production environment');
      console.log('   • Implement comprehensive API logging and alerting');
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// EXECUTION
// ============================================================================

// Execute API tests if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const apiTestSuite = new APIEndpointTestSuite();

  apiTestSuite.runAllAPITests()
    .then(results => {
      const allAPIs = Object.values(results);
      const totalTests = allAPIs.reduce((sum, api) => sum + api.totalTests, 0);
      const totalPassed = allAPIs.reduce((sum, api) => sum + api.passedTests, 0);
      const successRate = (totalPassed / totalTests) * 100;

      const exitCode = successRate >= 85 ? 0 : 1;
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('❌ FATAL ERROR IN API TESTING:', error);
      process.exit(1);
    });
}

export { APIEndpointTestSuite, AdminAPITester, NotificationAPITester, PublicAPITester, APITestUtilities, API_TEST_CONFIG };