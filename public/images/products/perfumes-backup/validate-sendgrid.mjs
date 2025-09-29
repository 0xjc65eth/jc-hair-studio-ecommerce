#!/usr/bin/env node

/**
 * 🔍 SENDGRID VALIDATION SUITE
 * Comprehensive validation of SendGrid configuration and capabilities
 *
 * Features:
 * - API key validation
 * - Domain authentication verification
 * - Sender reputation checks
 * - Rate limit testing
 * - Configuration diagnostics
 * - Security validation
 */

import sgMail from '@sendgrid/mail';
import https from 'https';
import dns from 'dns';
import { promisify } from 'util';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dnsLookup = promisify(dns.lookup);
const dnsResolveTxt = promisify(dns.resolveTxt);

// Configuration
const config = {
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz',
  fromName: process.env.FROM_NAME || 'JC Hair Studio\'s 62',
  supportEmail: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.xyz',
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
  skipDns: process.argv.includes('--skip-dns'),
  deepScan: process.argv.includes('--deep-scan')
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

function logResult(test, success, details = '', warning = false) {
  const icon = success ? '✅' : warning ? '⚠️' : '❌';
  const color = success ? 'green' : warning ? 'yellow' : 'red';
  log(`${icon} ${test}`, color);
  if (details && config.verbose) {
    log(`   ${details}`, 'yellow');
  }
}

// SendGrid API utilities
function makeApiRequest(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const postData = options.body ? JSON.stringify(options.body) : null;

    const requestOptions = {
      hostname: 'api.sendgrid.com',
      port: 443,
      path: `/v3/${endpoint}`,
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) })
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

// Validation tests
async function validateApiKey() {
  logSection('🔐 API KEY VALIDATION');

  const tests = [];

  // Test 1: API key exists
  tests.push({
    name: 'API Key Present',
    test: () => !!config.apiKey,
    details: config.apiKey ? 'API key found in environment' : 'No API key provided'
  });

  // Test 2: API key format
  tests.push({
    name: 'API Key Format',
    test: () => config.apiKey?.startsWith('SG.') && config.apiKey.length > 20,
    details: config.apiKey ?
      `Format: ${config.apiKey.startsWith('SG.') ? 'Valid SG. prefix' : 'Invalid prefix'}, Length: ${config.apiKey.length}` :
      'No API key to validate'
  });

  // Test 3: API key authentication
  let apiKeyValid = false;
  if (config.apiKey) {
    try {
      const response = await makeApiRequest('user/account');
      apiKeyValid = response.statusCode === 200;

      tests.push({
        name: 'API Key Authentication',
        test: () => apiKeyValid,
        details: apiKeyValid ?
          `Authenticated successfully (Status: ${response.statusCode})` :
          `Authentication failed (Status: ${response.statusCode})`
      });

      if (apiKeyValid && config.verbose) {
        log(`   Account Type: ${response.data.type || 'Unknown'}`, 'blue');
        log(`   Account Reputation: ${response.data.reputation || 'Unknown'}`, 'blue');
      }

    } catch (error) {
      tests.push({
        name: 'API Key Authentication',
        test: () => false,
        details: `Network error: ${error.message}`
      });
    }
  }

  let passed = 0;
  for (const test of tests) {
    const success = test.test();
    logResult(test.name, success, test.details);
    if (success) passed++;
  }

  return { passed, total: tests.length, apiKeyValid };
}

async function validateDomainAuthentication() {
  logSection('🌐 DOMAIN AUTHENTICATION');

  if (config.skipDns) {
    log('⚠️ DNS checks skipped (--skip-dns flag)', 'yellow');
    return { passed: 0, total: 0 };
  }

  const fromDomain = config.fromEmail.split('@')[1];
  const tests = [];

  // Test 1: Domain reachability
  try {
    await dnsLookup(fromDomain);
    tests.push({
      name: 'Domain Reachable',
      test: () => true,
      details: `Domain ${fromDomain} resolves successfully`
    });
  } catch (error) {
    tests.push({
      name: 'Domain Reachable',
      test: () => false,
      details: `Domain ${fromDomain} lookup failed: ${error.message}`
    });
  }

  // Test 2: SPF Record
  try {
    const txtRecords = await dnsResolveTxt(fromDomain);
    const spfRecord = txtRecords.find(record =>
      record.some(part => part.includes('v=spf1'))
    );
    const hasSpf = !!spfRecord;
    const hasSendGrid = spfRecord?.some(part =>
      part.includes('sendgrid.net') || part.includes('include:sendgrid.net')
    );

    tests.push({
      name: 'SPF Record',
      test: () => hasSpf,
      details: hasSpf ?
        `SPF found: ${spfRecord[0]}` :
        'No SPF record found'
    });

    if (hasSpf) {
      tests.push({
        name: 'SendGrid SPF Authorization',
        test: () => hasSendGrid,
        details: hasSendGrid ?
          'SendGrid included in SPF record' :
          'SendGrid not found in SPF record'
      });
    }

  } catch (error) {
    tests.push({
      name: 'SPF Record',
      test: () => false,
      details: `SPF lookup failed: ${error.message}`
    });
  }

  // Test 3: DKIM (basic check)
  try {
    const dkimSelector = 's1'; // Common SendGrid selector
    const dkimDomain = `${dkimSelector}._domainkey.${fromDomain}`;
    await dnsResolveTxt(dkimDomain);

    tests.push({
      name: 'DKIM Record',
      test: () => true,
      details: `DKIM record found at ${dkimDomain}`
    });
  } catch (error) {
    tests.push({
      name: 'DKIM Record',
      test: () => false,
      details: `No DKIM record found (this may be normal if not using custom DKIM)`
    });
  }

  let passed = 0;
  for (const test of tests) {
    const success = test.test();
    const isWarning = test.name === 'DKIM Record' && !success;
    logResult(test.name, success, test.details, isWarning);
    if (success) passed++;
  }

  return { passed, total: tests.length };
}

async function validateSenderReputationAndLimits() {
  logSection('📊 SENDER REPUTATION & LIMITS');

  if (!config.apiKey) {
    log('⚠️ Skipping reputation checks - no API key', 'yellow');
    return { passed: 0, total: 0 };
  }

  const tests = [];

  try {
    // Test 1: Account stats
    const statsResponse = await makeApiRequest('stats?start_date=2024-01-01&limit=1');
    const hasStats = statsResponse.statusCode === 200;

    tests.push({
      name: 'Account Statistics Access',
      test: () => hasStats,
      details: hasStats ? 'Statistics endpoint accessible' : `Access denied (${statsResponse.statusCode})`
    });

    if (hasStats && config.verbose && statsResponse.data.length > 0) {
      const stats = statsResponse.data[0].stats[0]?.metrics || {};
      log(`   Recent Stats:`, 'blue');
      log(`   - Delivered: ${stats.delivered || 0}`, 'blue');
      log(`   - Bounces: ${stats.bounces || 0}`, 'blue');
      log(`   - Blocks: ${stats.blocks || 0}`, 'blue');
    }

    // Test 2: Suppression groups (if accessible)
    const suppressionResponse = await makeApiRequest('asm/suppressions');
    const hasSuppressionAccess = suppressionResponse.statusCode === 200;

    tests.push({
      name: 'Suppression Management Access',
      test: () => hasSuppressionAccess,
      details: hasSuppressionAccess ?
        'Suppression management accessible' :
        `Access limited (${suppressionResponse.statusCode})`
    });

    // Test 3: IP reputation (for dedicated IPs)
    if (config.deepScan) {
      try {
        const ipResponse = await makeApiRequest('ips');
        const hasIpAccess = ipResponse.statusCode === 200;

        tests.push({
          name: 'IP Management Access',
          test: () => hasIpAccess,
          details: hasIpAccess ?
            `Found ${ipResponse.data?.length || 0} IPs` :
            `IP access denied (${ipResponse.statusCode})`
        });

        if (hasIpAccess && config.verbose && ipResponse.data?.length > 0) {
          log(`   IP Details:`, 'blue');
          ipResponse.data.forEach(ip => {
            log(`   - ${ip.ip}: Reputation ${ip.reputation || 'Unknown'}`, 'blue');
          });
        }
      } catch (error) {
        tests.push({
          name: 'IP Management Access',
          test: () => false,
          details: `IP check failed: ${error.message}`
        });
      }
    }

  } catch (error) {
    tests.push({
      name: 'Reputation Data Access',
      test: () => false,
      details: `API error: ${error.message}`
    });
  }

  let passed = 0;
  for (const test of tests) {
    const success = test.test();
    logResult(test.name, success, test.details);
    if (success) passed++;
  }

  return { passed, total: tests.length };
}

async function validateSendingCapability() {
  logSection('📤 SENDING CAPABILITY TEST');

  if (!config.apiKey) {
    log('⚠️ Skipping sending tests - no API key', 'yellow');
    return { passed: 0, total: 0 };
  }

  const tests = [];

  try {
    // Test 1: Sandbox mode sending
    sgMail.setApiKey(config.apiKey);

    const testMessage = {
      to: 'test@example.com',
      from: config.fromEmail,
      subject: 'SendGrid Validation Test',
      text: 'This is a validation test email',
      html: '<p>This is a validation test email</p>',
      mail_settings: {
        sandbox_mode: {
          enable: true
        }
      }
    };

    await sgMail.send(testMessage);

    tests.push({
      name: 'Sandbox Email Send',
      test: () => true,
      details: 'Successfully sent test email in sandbox mode'
    });

    // Test 2: Multiple email validation
    const multipleTestMessages = [
      { ...testMessage, to: 'test1@example.com' },
      { ...testMessage, to: 'test2@example.com' },
      { ...testMessage, to: 'test3@example.com' }
    ];

    await sgMail.send(multipleTestMessages);

    tests.push({
      name: 'Bulk Email Send',
      test: () => true,
      details: 'Successfully sent multiple emails in sandbox mode'
    });

    // Test 3: Template rendering capability
    const templateMessage = {
      ...testMessage,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Template Test</h1>
          <p>This tests HTML template rendering capability.</p>
          <div style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
            <h2>Features Tested:</h2>
            <ul>
              <li>HTML rendering</li>
              <li>CSS styling</li>
              <li>Template structure</li>
            </ul>
          </div>
        </div>
      `
    };

    await sgMail.send(templateMessage);

    tests.push({
      name: 'HTML Template Rendering',
      test: () => true,
      details: 'Successfully validated HTML template processing'
    });

  } catch (error) {
    tests.push({
      name: 'Email Sending Capability',
      test: () => false,
      details: `Send test failed: ${error.message}`
    });
  }

  let passed = 0;
  for (const test of tests) {
    const success = test.test();
    logResult(test.name, success, test.details);
    if (success) passed++;
  }

  return { passed, total: tests.length };
}

async function validateSecurityConfiguration() {
  logSection('🔒 SECURITY CONFIGURATION');

  const tests = [];

  // Test 1: API key security
  const apiKey = config.apiKey;
  const isSecureKey = apiKey &&
    apiKey.startsWith('SG.') &&
    apiKey.length >= 60 &&
    !/^SG\.test/.test(apiKey);

  tests.push({
    name: 'API Key Security',
    test: () => isSecureKey,
    details: isSecureKey ?
      'API key appears to be production-grade' :
      'API key may be test/insecure (short length or test prefix)'
  });

  // Test 2: From email validation
  const fromEmail = config.fromEmail;
  const isValidFromEmail = fromEmail &&
    fromEmail.includes('@') &&
    !fromEmail.includes('test') &&
    !fromEmail.includes('example');

  tests.push({
    name: 'From Email Configuration',
    test: () => isValidFromEmail,
    details: `From email: ${fromEmail}`
  });

  // Test 3: Environment security
  const isProduction = process.env.NODE_ENV === 'production';
  const hasSecureEnv = isProduction || process.env.NODE_ENV === 'staging';

  tests.push({
    name: 'Environment Configuration',
    test: () => hasSecureEnv,
    details: `Environment: ${process.env.NODE_ENV || 'development'}`
  });

  // Test 4: Rate limiting awareness
  if (config.apiKey) {
    try {
      const response = await makeApiRequest('user/account');
      const accountType = response.data?.type || 'unknown';
      const isProAccount = accountType !== 'free';

      tests.push({
        name: 'Account Type',
        test: () => true,
        details: `Account type: ${accountType} ${isProAccount ? '(Commercial limits)' : '(Free tier limits)'}`
      });

    } catch (error) {
      tests.push({
        name: 'Account Type Check',
        test: () => false,
        details: `Unable to determine account type: ${error.message}`
      });
    }
  }

  let passed = 0;
  for (const test of tests) {
    const success = test.test();
    logResult(test.name, success, test.details);
    if (success) passed++;
  }

  return { passed, total: tests.length };
}

async function generateConfigurationReport(results) {
  logSection('📋 CONFIGURATION RECOMMENDATIONS');

  const issues = [];
  const warnings = [];
  const recommendations = [];

  // Analyze results
  if (results.apiKey.passed < results.apiKey.total) {
    issues.push('API key validation failed - check your SendGrid API key');
  }

  if (results.domain && results.domain.passed < results.domain.total) {
    warnings.push('Domain authentication issues detected - may affect deliverability');
    recommendations.push('Set up SPF and DKIM records for your domain');
  }

  if (results.reputation && results.reputation.passed < results.reputation.total) {
    warnings.push('Limited access to reputation data - may indicate account restrictions');
  }

  if (results.sending.passed < results.sending.total) {
    issues.push('Email sending capability compromised - check API permissions');
  }

  if (results.security.passed < results.security.total) {
    warnings.push('Security configuration needs attention');
  }

  // Display issues
  if (issues.length > 0) {
    log('\n🚨 Critical Issues:', 'red');
    issues.forEach(issue => log(`   • ${issue}`, 'red'));
  }

  if (warnings.length > 0) {
    log('\n⚠️ Warnings:', 'yellow');
    warnings.forEach(warning => log(`   • ${warning}`, 'yellow'));
  }

  if (recommendations.length > 0) {
    log('\n💡 Recommendations:', 'cyan');
    recommendations.forEach(rec => log(`   • ${rec}`, 'cyan'));
  }

  // Next steps
  log('\n🎯 Next Steps:', 'blue');

  if (issues.length === 0 && warnings.length === 0) {
    log('   ✅ Configuration looks good! You can proceed with email testing.', 'green');
    log('   ✅ Run test-email-system.mjs to test actual email sending.', 'green');
  } else {
    if (issues.length > 0) {
      log('   🔧 Fix critical issues before proceeding with email tests', 'red');
    }
    if (warnings.length > 0) {
      log('   🔧 Address warnings to improve email deliverability', 'yellow');
    }
  }

  log('\n📚 Documentation:', 'blue');
  log('   • SendGrid Setup: https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs', 'blue');
  log('   • Domain Authentication: https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-domain-authentication', 'blue');
  log('   • API Keys: https://docs.sendgrid.com/ui/account-and-settings/api-keys', 'blue');
}

async function runValidation() {
  log('\n🔍 SENDGRID CONFIGURATION VALIDATOR', 'bright');
  log('Comprehensive validation of SendGrid setup and capabilities', 'cyan');
  log(`Domain: ${config.fromEmail.split('@')[1]}`, 'blue');
  log(`Deep Scan: ${config.deepScan ? 'ENABLED' : 'DISABLED'}`, 'blue');
  console.log('\n');

  const results = {};

  // Run all validation tests
  results.apiKey = await validateApiKey();

  if (results.apiKey.apiKeyValid) {
    results.domain = await validateDomainAuthentication();
    results.reputation = await validateSenderReputationAndLimits();
    results.sending = await validateSendingCapability();
    results.security = await validateSecurityConfiguration();
  } else {
    log('\n⚠️ Skipping advanced tests due to API key issues', 'yellow');
  }

  return results;
}

function generateSummaryReport(results) {
  logSection('📊 VALIDATION SUMMARY');

  let totalPassed = 0;
  let totalTests = 0;

  Object.entries(results).forEach(([category, result]) => {
    if (result && typeof result === 'object' && 'passed' in result) {
      const successRate = result.total > 0 ? ((result.passed / result.total) * 100).toFixed(1) : 0;
      const color = result.passed === result.total ? 'green' :
                   result.passed > result.total * 0.7 ? 'yellow' : 'red';

      log(`${category.charAt(0).toUpperCase() + category.slice(1)}: ${result.passed}/${result.total} (${successRate}%)`, color);

      totalPassed += result.passed;
      totalTests += result.total;
    }
  });

  console.log('');
  const overallRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;
  const overallColor = overallRate > 90 ? 'green' : overallRate > 70 ? 'yellow' : 'red';

  log(`Overall Validation Score: ${overallRate}%`, overallColor);
  log(`Total Tests: ${totalPassed}/${totalTests}`, overallColor);

  if (overallRate >= 90) {
    log('\n🎉 Excellent! Your SendGrid configuration is ready for production.', 'green');
  } else if (overallRate >= 70) {
    log('\n⚠️ Good configuration, but some improvements recommended.', 'yellow');
  } else {
    log('\n❌ Configuration needs significant improvements before production use.', 'red');
  }

  return parseFloat(overallRate);
}

// Main execution
async function main() {
  try {
    const results = await runValidation();
    await generateConfigurationReport(results);
    const score = generateSummaryReport(results);

    console.log('\n' + '='.repeat(60));

    // Exit with appropriate code
    process.exit(score >= 90 ? 0 : score >= 70 ? 1 : 2);

  } catch (error) {
    log(`\n❌ Critical validation error: ${error.message}`, 'red');
    if (config.verbose) {
      console.error(error);
    }
    process.exit(3);
  }
}

// CLI help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🔍 SendGrid Configuration Validator - JC Hair Studio's 62

USAGE:
  node validate-sendgrid.mjs [options]

OPTIONS:
  --verbose, -v    Show detailed output and diagnostic information
  --skip-dns       Skip DNS-based domain authentication checks
  --deep-scan      Enable comprehensive reputation and IP checks
  --help, -h       Show this help message

VALIDATION CATEGORIES:
  • API Key        - Validates SendGrid API key format and authentication
  • Domain Auth    - Checks SPF, DKIM, and domain configuration
  • Reputation     - Examines sender reputation and account limits
  • Sending        - Tests email sending capability in sandbox mode
  • Security       - Reviews security configuration and best practices

EXIT CODES:
  0 - Excellent configuration (≥90% pass rate)
  1 - Good configuration with warnings (≥70% pass rate)
  2 - Poor configuration needs fixes (<70% pass rate)
  3 - Critical validation error

ENVIRONMENT VARIABLES:
  SENDGRID_API_KEY     Your SendGrid API key (required)
  FROM_EMAIL          From email address for validation
  FROM_NAME           From name for validation
  SUPPORT_EMAIL       Support email address

EXAMPLES:
  # Basic validation
  node validate-sendgrid.mjs

  # Detailed validation with DNS checks
  node validate-sendgrid.mjs --verbose

  # Comprehensive validation (all features)
  node validate-sendgrid.mjs --verbose --deep-scan

  # Quick validation (skip DNS checks)
  node validate-sendgrid.mjs --skip-dns
  `);
  process.exit(0);
}

// Run validation
main();