#!/usr/bin/env node

/**
 * 🧪 COMPREHENSIVE EMAIL TESTING SUITE
 * Tests SendGrid API directly bypassing all application logic
 *
 * Features:
 * - Direct SendGrid API testing
 * - Multiple email template validation
 * - Real email sending capability
 * - Error handling and diagnostics
 * - Performance monitoring
 */

import sgMail from '@sendgrid/mail';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const config = {
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz',
  fromName: process.env.FROM_NAME || 'JC Hair Studio\'s 62',
  supportEmail: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.xyz',
  testEmail: process.env.TEST_EMAIL || 'test@jchairstudios62.xyz',
  forceRealEmail: process.env.FORCE_REAL_EMAIL === 'true' || process.argv.includes('--force-real'),
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v')
};

// Color logging utilities
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(`  ${title}`, 'cyan');
  console.log('='.repeat(60));
}

function logResult(test, success, details = '') {
  const icon = success ? '✅' : '❌';
  const color = success ? 'green' : 'red';
  log(`${icon} ${test}`, color);
  if (details && config.verbose) {
    log(`   ${details}`, 'yellow');
  }
}

// Email Templates
const emailTemplates = {
  contact: {
    name: 'Contact Form Email',
    subject: '🧪 [TEST] Contact Form - SendGrid Direct API Test',
    generateHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
        <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🧪 EMAIL TEST - JC Hair Studio's 62</h1>
          <p style="color: white; margin: 5px 0;">Direct SendGrid API Test</p>
        </div>

        <div style="padding: 30px; background: white;">
          <h2 style="color: #374151;">Contact Form Test Email</h2>
          <p><strong>Test Type:</strong> Contact Form Template</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>API Key Used:</strong> ${config.apiKey?.substring(0, 10)}...</p>

          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3>Test Message Details:</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong> ${data.message}</p>
          </div>

          <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0; color: #065f46;">
              ✅ If you received this email, SendGrid API is working correctly!
            </p>
          </div>
        </div>

        <div style="background: #374151; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">Email System Test - ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `
  },

  orderConfirmation: {
    name: 'Order Confirmation Email',
    subject: '🧪 [TEST] Order Confirmation - SendGrid Direct API Test',
    generateHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🧪 ORDER TEST - JC Hair Studio's 62</h1>
          <p style="color: white; margin: 5px 0;">Direct SendGrid API Test</p>
        </div>

        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151;">Order Confirmation Test Email</h2>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h3>Test Order Details:</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Customer:</strong> ${data.customerName}</p>
            <p><strong>Total:</strong> €${data.total}</p>
            <p><strong>Items:</strong> ${data.items.length} produtos</p>
            <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
          </div>

          <div style="background: white; border-radius: 12px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="padding: 15px; text-align: left;">Produto</th>
                  <th style="padding: 15px; text-align: center;">Qtd</th>
                  <th style="padding: 15px; text-align: right;">Preço</th>
                </tr>
              </thead>
              <tbody>
                ${data.items.map(item => `
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 15px;">${item.name}</td>
                    <td style="padding: 15px; text-align: center;">${item.quantity}</td>
                    <td style="padding: 15px; text-align: right;">€${item.price}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0; color: #065f46;">
              ✅ Order confirmation template test successful!
            </p>
          </div>
        </div>
      </div>
    `
  },

  newsletter: {
    name: 'Newsletter Subscription Email',
    subject: '🧪 [TEST] Newsletter Welcome - SendGrid Direct API Test',
    generateHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🧪 NEWSLETTER TEST - JC Hair Studio's 62</h1>
          <p style="color: white; margin: 5px 0;">Direct SendGrid API Test</p>
        </div>

        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151;">Newsletter Welcome Test</h2>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h3>Welcome Message:</h3>
            <p>Olá, ${data.name}!</p>
            <p>This is a test of the newsletter welcome email template.</p>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>🎁 Test Discount Code:</strong> TEST10</p>
              <p>Use this code for 10% off your first purchase!</p>
            </div>
          </div>

          <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0; color: #065f46;">
              ✅ Newsletter template test successful!
            </p>
          </div>
        </div>
      </div>
    `
  },

  paymentConfirmation: {
    name: 'Payment Confirmation Email',
    subject: '🧪 [TEST] Payment Confirmed - SendGrid Direct API Test',
    generateHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🧪 PAYMENT TEST - JC Hair Studio's 62</h1>
          <p style="color: white; margin: 5px 0;">Direct SendGrid API Test</p>
        </div>

        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151;">Payment Confirmation Test</h2>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h3>Payment Details:</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Amount:</strong> €${data.total}</p>
            <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
            <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
            <p><strong>Status:</strong> ✅ Confirmed</p>
          </div>

          <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0; color: #065f46;">
              ✅ Payment confirmation template test successful!
            </p>
          </div>
        </div>
      </div>
    `
  }
};

// Test data generators
function generateTestData() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  return {
    contact: {
      name: 'Test User',
      email: config.testEmail,
      subject: 'Test Contact Form Submission',
      message: `This is a test message generated at ${new Date().toLocaleString()}. Testing SendGrid API direct integration.`
    },

    order: {
      orderId: `TEST-${timestamp}`,
      customerName: 'Test Customer',
      customerEmail: config.testEmail,
      total: 129.99,
      paymentMethod: 'Cartão de Crédito',
      items: [
        { name: 'Mega Hair Liso Premium', quantity: 1, price: 89.99 },
        { name: 'Shampoo Hidratante Professional', quantity: 2, price: 19.99 }
      ]
    },

    newsletter: {
      name: 'Test Subscriber',
      email: config.testEmail
    },

    payment: {
      orderId: `PAY-${timestamp}`,
      total: 129.99,
      paymentMethod: 'Cartão de Crédito',
      transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`
    }
  };
}

// Test functions
async function testSendGridConfiguration() {
  logSection('🔧 SENDGRID CONFIGURATION TEST');

  const tests = [
    {
      name: 'API Key exists',
      test: () => !!config.apiKey,
      details: config.apiKey ? `Key: ${config.apiKey.substring(0, 10)}...` : 'Missing API key'
    },
    {
      name: 'API Key format valid',
      test: () => config.apiKey?.startsWith('SG.'),
      details: config.apiKey ? 'Correct SG. prefix' : 'Invalid format'
    },
    {
      name: 'From email configured',
      test: () => !!config.fromEmail,
      details: config.fromEmail || 'Missing from email'
    },
    {
      name: 'Support email configured',
      test: () => !!config.supportEmail,
      details: config.supportEmail || 'Missing support email'
    }
  ];

  let passed = 0;
  for (const test of tests) {
    const success = test.test();
    logResult(test.name, success, test.details);
    if (success) passed++;
  }

  return { passed, total: tests.length };
}

async function testSendGridAPIConnection() {
  logSection('🌐 SENDGRID API CONNECTION TEST');

  if (!config.apiKey) {
    logResult('API Connection', false, 'No API key provided');
    return { passed: 0, total: 1 };
  }

  try {
    sgMail.setApiKey(config.apiKey);

    // Test API connection without sending email
    const testMessage = {
      to: 'test@example.com',
      from: config.fromEmail,
      subject: 'Connection Test',
      text: 'This is a connection test',
      mail_settings: {
        sandbox_mode: {
          enable: true
        }
      }
    };

    await sgMail.send(testMessage);
    logResult('API Connection', true, 'Successfully connected to SendGrid API');
    return { passed: 1, total: 1 };

  } catch (error) {
    logResult('API Connection', false, error.message);
    return { passed: 0, total: 1 };
  }
}

async function testEmailTemplate(templateName, template, testData) {
  logSection(`📧 TESTING ${template.name.toUpperCase()}`);

  const startTime = Date.now();

  try {
    const emailData = {
      to: config.testEmail,
      from: `${config.fromName} <${config.fromEmail}>`,
      subject: template.subject,
      html: template.generateHtml(testData),
      text: `Test email for ${template.name} - Generated at ${new Date().toLocaleString()}`
    };

    // Always test template generation
    logResult('Template Generation', true, 'HTML template generated successfully');

    if (config.forceRealEmail) {
      log('🚀 Sending real email...', 'yellow');
      await sgMail.send(emailData);
      const duration = Date.now() - startTime;
      logResult('Real Email Sent', true, `Delivered in ${duration}ms to ${config.testEmail}`);
      return { passed: 2, total: 2, sent: true };
    } else {
      // Sandbox mode test
      emailData.mail_settings = {
        sandbox_mode: {
          enable: true
        }
      };

      await sgMail.send(emailData);
      const duration = Date.now() - startTime;
      logResult('Sandbox Email Test', true, `Validated in ${duration}ms (sandbox mode)`);
      return { passed: 2, total: 2, sent: false };
    }

  } catch (error) {
    logResult('Template Test', false, error.message);
    return { passed: 0, total: 2, sent: false };
  }
}

async function runComprehensiveEmailTest() {
  log('\n🧪 COMPREHENSIVE EMAIL TESTING SUITE', 'bright');
  log('Testing SendGrid API directly (bypassing application logic)', 'cyan');
  log(`Real Email Mode: ${config.forceRealEmail ? 'ENABLED' : 'DISABLED (sandbox)'}`, 'yellow');
  log(`Test Email: ${config.testEmail}`, 'blue');
  console.log('\n');

  const results = {
    configuration: { passed: 0, total: 0 },
    connection: { passed: 0, total: 0 },
    templates: { passed: 0, total: 0, details: {} },
    totalEmailsSent: 0
  };

  // Test 1: Configuration
  results.configuration = await testSendGridConfiguration();

  // Test 2: API Connection
  if (results.configuration.passed === results.configuration.total) {
    results.connection = await testSendGridAPIConnection();
  } else {
    log('\n⚠️ Skipping API tests due to configuration issues', 'yellow');
  }

  // Test 3: Email Templates
  if (results.connection.passed === results.connection.total) {
    const testData = generateTestData();

    for (const [templateName, template] of Object.entries(emailTemplates)) {
      const templateResult = await testEmailTemplate(
        templateName,
        template,
        testData[templateName.replace('Confirmation', '').toLowerCase()] || testData.contact
      );

      results.templates.passed += templateResult.passed;
      results.templates.total += templateResult.total;
      results.templates.details[templateName] = templateResult;

      if (templateResult.sent) {
        results.totalEmailsSent++;
      }
    }
  } else {
    log('\n⚠️ Skipping template tests due to API connection issues', 'yellow');
  }

  return results;
}

function generateTestReport(results) {
  logSection('📊 TEST RESULTS SUMMARY');

  const totalPassed = results.configuration.passed + results.connection.passed + results.templates.passed;
  const totalTests = results.configuration.total + results.connection.total + results.templates.total;
  const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;

  log(`Configuration Tests: ${results.configuration.passed}/${results.configuration.total}`,
      results.configuration.passed === results.configuration.total ? 'green' : 'red');

  log(`Connection Tests: ${results.connection.passed}/${results.connection.total}`,
      results.connection.passed === results.connection.total ? 'green' : 'red');

  log(`Template Tests: ${results.templates.passed}/${results.templates.total}`,
      results.templates.passed === results.templates.total ? 'green' : 'red');

  console.log('');
  log(`Overall Success Rate: ${successRate}%`, successRate > 90 ? 'green' : successRate > 70 ? 'yellow' : 'red');
  log(`Total Emails Sent: ${results.totalEmailsSent}`, results.totalEmailsSent > 0 ? 'green' : 'yellow');

  console.log('\n' + '='.repeat(60));

  if (successRate === 100) {
    log('🎉 ALL TESTS PASSED! Email system is fully functional.', 'green');
  } else if (successRate > 70) {
    log('⚠️ Most tests passed, but some issues need attention.', 'yellow');
  } else {
    log('❌ Significant issues detected. Email system needs fixes.', 'red');
  }

  if (config.forceRealEmail && results.totalEmailsSent > 0) {
    log(`\n📬 Check your inbox at ${config.testEmail} for ${results.totalEmailsSent} test emails!`, 'cyan');
  }

  return successRate;
}

// Performance monitoring
function performanceMonitor() {
  const startTime = Date.now();
  const memStart = process.memoryUsage();

  return {
    end: () => {
      const duration = Date.now() - startTime;
      const memEnd = process.memoryUsage();
      const memUsed = Math.round((memEnd.heapUsed - memStart.heapUsed) / 1024 / 1024 * 100) / 100;

      logSection('⚡ PERFORMANCE METRICS');
      log(`Total Execution Time: ${duration}ms`, 'cyan');
      log(`Memory Usage: ${memUsed}MB`, 'cyan');
      log(`Average Test Time: ${Math.round(duration / 4)}ms per template`, 'cyan');
    }
  };
}

// Main execution
async function main() {
  const monitor = performanceMonitor();

  try {
    const results = await runComprehensiveEmailTest();
    const successRate = generateTestReport(results);

    monitor.end();

    // Exit with proper code
    process.exit(successRate === 100 ? 0 : 1);

  } catch (error) {
    log(`\n❌ Critical error during testing: ${error.message}`, 'red');
    if (config.verbose) {
      console.error(error);
    }
    process.exit(1);
  }
}

// CLI argument handling
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🧪 Email System Testing Suite - JC Hair Studio's 62

USAGE:
  node test-email-system.mjs [options]

OPTIONS:
  --force-real     Send real emails instead of sandbox mode
  --verbose, -v    Show detailed output and errors
  --help, -h       Show this help message

ENVIRONMENT VARIABLES:
  SENDGRID_API_KEY     Your SendGrid API key (required)
  TEST_EMAIL          Email address to send test emails to
  FORCE_REAL_EMAIL    Set to 'true' to force real email sending
  FROM_EMAIL          From email address (default: orders@jchairstudios62.xyz)
  FROM_NAME           From name (default: JC Hair Studio's 62)

EXAMPLES:
  # Test in sandbox mode (safe, no real emails)
  node test-email-system.mjs

  # Send real test emails
  node test-email-system.mjs --force-real

  # Verbose output with real emails
  node test-email-system.mjs --force-real --verbose

  # Using environment variable
  FORCE_REAL_EMAIL=true node test-email-system.mjs
  `);
  process.exit(0);
}

// Run the tests
main();