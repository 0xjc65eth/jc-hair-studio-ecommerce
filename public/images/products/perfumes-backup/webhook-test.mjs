#!/usr/bin/env node

/**
 * Stripe Webhook Testing Script
 *
 * This script tests the webhook functionality without requiring Stripe signatures,
 * allowing you to test the webhook handling logic independently.
 *
 * Usage:
 *   node webhook-test.mjs                        # Run all tests
 *   node webhook-test.mjs --test payment_success # Run specific test
 *   node webhook-test.mjs --local                # Test against localhost
 */

import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const DEFAULT_BASE_URL = 'https://jchairstudios62.xyz';
const LOCAL_BASE_URL = 'http://localhost:3000';

class WebhookTester {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.testResults = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const emoji = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      test: '🧪'
    }[type] || '📋';

    console.log(`${emoji} [${timestamp}] ${message}`);
  }

  async testWebhookEndpoint(testType) {
    this.log(`Testing webhook endpoint: ${testType}`, 'test');

    try {
      const url = `${this.baseUrl}/api/webhooks/stripe?test=${testType}`;
      this.log(`Making request to: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'WebhookTester/1.0'
        },
        timeout: 30000
      });

      const responseText = await response.text();
      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        responseData = { rawResponse: responseText };
      }

      const result = {
        testType,
        status: response.status,
        success: response.ok,
        responseData,
        timestamp: new Date().toISOString()
      };

      this.testResults.push(result);

      if (response.ok) {
        this.log(`Test ${testType} passed: ${response.status}`, 'success');
        this.log(`Response: ${JSON.stringify(responseData, null, 2)}`);
      } else {
        this.log(`Test ${testType} failed: ${response.status}`, 'error');
        this.log(`Error: ${responseText}`, 'error');
      }

      return result;

    } catch (error) {
      this.log(`Test ${testType} failed with exception: ${error.message}`, 'error');

      const result = {
        testType,
        status: 0,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };

      this.testResults.push(result);
      return result;
    }
  }

  async testPostWebhook(eventType, eventData) {
    this.log(`Testing POST webhook with event: ${eventType}`, 'test');

    try {
      const url = `${this.baseUrl}/api/webhooks/stripe`;

      const mockEvent = {
        id: `evt_test_${Date.now()}`,
        object: 'event',
        api_version: '2023-10-16',
        created: Math.floor(Date.now() / 1000),
        type: eventType,
        data: {
          object: eventData
        },
        livemode: false,
        pending_webhooks: 1,
        request: {
          id: `req_test_${Date.now()}`,
          idempotency_key: null
        }
      };

      this.log(`Sending mock event: ${JSON.stringify(mockEvent, null, 2)}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'WebhookTester/1.0',
          // No stripe-signature header to test fallback parsing
        },
        body: JSON.stringify(mockEvent),
        timeout: 30000
      });

      const responseText = await response.text();
      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        responseData = { rawResponse: responseText };
      }

      const result = {
        testType: `POST_${eventType}`,
        status: response.status,
        success: response.ok,
        responseData,
        sentData: mockEvent,
        timestamp: new Date().toISOString()
      };

      this.testResults.push(result);

      if (response.ok) {
        this.log(`POST test ${eventType} passed: ${response.status}`, 'success');
        this.log(`Response: ${JSON.stringify(responseData, null, 2)}`);
      } else {
        this.log(`POST test ${eventType} failed: ${response.status}`, 'error');
        this.log(`Error: ${responseText}`, 'error');
      }

      return result;

    } catch (error) {
      this.log(`POST test ${eventType} failed with exception: ${error.message}`, 'error');

      const result = {
        testType: `POST_${eventType}`,
        status: 0,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };

      this.testResults.push(result);
      return result;
    }
  }

  async runAllTests() {
    this.log('Starting comprehensive webhook testing', 'info');
    this.log(`Base URL: ${this.baseUrl}`, 'info');

    // Test GET endpoints (built-in test functions)
    const getTests = [
      'payment_success',
      'payment_failed',
      'dispute_created',
      'email_test'
    ];

    for (const testType of getTests) {
      await this.testWebhookEndpoint(testType);
      await this.delay(1000); // Wait 1 second between tests
    }

    // Test POST endpoints with mock Stripe events
    const postTests = [
      {
        type: 'payment_intent.succeeded',
        data: {
          id: 'pi_test_webhook_12345',
          object: 'payment_intent',
          amount: 5000,
          currency: 'eur',
          status: 'succeeded',
          metadata: {
            customerEmail: 'test@example.com',
            customerName: 'Test Customer',
            itemsCount: '2',
            items: JSON.stringify([
              { name: 'Test Product 1', quantity: 1, price: 25.00 },
              { name: 'Test Product 2', quantity: 1, price: 25.00 }
            ])
          }
        }
      },
      {
        type: 'payment_intent.payment_failed',
        data: {
          id: 'pi_test_failed_12345',
          object: 'payment_intent',
          amount: 3000,
          currency: 'eur',
          status: 'requires_payment_method',
          metadata: {
            customerEmail: 'test@example.com',
            customerName: 'Test Customer'
          }
        }
      },
      {
        type: 'charge.dispute.created',
        data: {
          id: 'dp_test_12345',
          object: 'dispute',
          amount: 5000,
          currency: 'eur',
          reason: 'fraudulent',
          status: 'warning_needs_response',
          created: Math.floor(Date.now() / 1000)
        }
      }
    ];

    for (const test of postTests) {
      await this.testPostWebhook(test.type, test.data);
      await this.delay(1000); // Wait 1 second between tests
    }

    this.generateReport();
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateReport() {
    this.log('='.repeat(60), 'info');
    this.log('WEBHOOK TEST REPORT', 'info');
    this.log('='.repeat(60), 'info');

    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;

    this.log(`Total Tests: ${totalTests}`, 'info');
    this.log(`Passed: ${passedTests}`, passedTests === totalTests ? 'success' : 'info');

    if (failedTests > 0) {
      this.log(`Failed: ${failedTests}`, 'error');
    }

    this.log('', 'info');
    this.log('Test Details:', 'info');
    this.log('-'.repeat(40), 'info');

    this.testResults.forEach(result => {
      const status = result.success ? 'PASS' : 'FAIL';
      const emoji = result.success ? '✅' : '❌';

      this.log(`${emoji} ${result.testType}: ${status} (${result.status})`,
               result.success ? 'success' : 'error');

      if (!result.success && result.error) {
        this.log(`   Error: ${result.error}`, 'error');
      }
    });

    this.log('', 'info');

    if (failedTests === 0) {
      this.log('🎉 All tests passed! Webhook system is working correctly.', 'success');
    } else {
      this.log(`⚠️ ${failedTests} test(s) failed. Check the webhook configuration.`, 'warning');
      this.log('Common issues to check:', 'info');
      this.log('- Webhook endpoint is accessible', 'info');
      this.log('- Environment variables are set correctly', 'info');
      this.log('- Email configuration (SendGrid) is working', 'info');
      this.log('- Database connection is available', 'info');
    }

    this.log('='.repeat(60), 'info');

    // Save detailed report to file
    this.saveReportToFile();
  }

  saveReportToFile() {
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      summary: {
        total: this.testResults.length,
        passed: this.testResults.filter(r => r.success).length,
        failed: this.testResults.filter(r => !r.success).length
      },
      results: this.testResults
    };

    try {
      import('fs').then(fs => {
        const filename = `webhook-test-report-${Date.now()}.json`;
        fs.writeFileSync(filename, JSON.stringify(report, null, 2));
        this.log(`Detailed report saved to: ${filename}`, 'info');
      });
    } catch (error) {
      this.log(`Could not save report file: ${error.message}`, 'warning');
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);

  let baseUrl = DEFAULT_BASE_URL;
  let specificTest = null;

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--local') {
      baseUrl = LOCAL_BASE_URL;
    } else if (arg === '--test' && i + 1 < args.length) {
      specificTest = args[i + 1];
      i++; // Skip next argument as it's the test name
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Stripe Webhook Testing Script

Usage:
  node webhook-test.mjs                        # Run all tests against production
  node webhook-test.mjs --local                # Run all tests against localhost
  node webhook-test.mjs --test payment_success # Run specific test
  node webhook-test.mjs --local --test email_test # Run specific test locally

Available Tests:
  - payment_success   : Test successful payment processing
  - payment_failed    : Test failed payment handling
  - dispute_created   : Test dispute notification
  - email_test        : Test email sending functionality

Options:
  --local             : Test against localhost:3000 instead of production
  --test <name>       : Run only the specified test
  --help, -h          : Show this help message
      `);
      process.exit(0);
    }
  }

  const tester = new WebhookTester(baseUrl);

  if (specificTest) {
    console.log(`Running specific test: ${specificTest}`);
    await tester.testWebhookEndpoint(specificTest);
    tester.generateReport();
  } else {
    await tester.runAllTests();
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

export { WebhookTester };