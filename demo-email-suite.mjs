#!/usr/bin/env node

/**
 * 🎯 EMAIL TESTING SUITE DEMO
 * Demonstrates the complete email testing workflow
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Color utilities
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

function runScript(script, args = []) {
  return new Promise((resolve, reject) => {
    log(`\n🚀 Running: ${script} ${args.join(' ')}`, 'cyan');

    const child = spawn('node', [script, ...args], {
      cwd: __dirname,
      stdio: 'inherit'
    });

    child.on('close', (code) => {
      if (code === 0) {
        log(`✅ ${script} completed successfully`, 'green');
        resolve(code);
      } else {
        log(`❌ ${script} exited with code ${code}`, 'red');
        resolve(code); // Don't reject, continue with demo
      }
    });

    child.on('error', (error) => {
      log(`❌ Error running ${script}: ${error.message}`, 'red');
      resolve(1);
    });
  });
}

async function waitForInput(message) {
  log(message, 'yellow');
  return new Promise((resolve) => {
    process.stdin.once('data', () => resolve());
  });
}

async function demo() {
  log('\n🎯 EMAIL TESTING SUITE DEMONSTRATION', 'bright');
  log('JC Hair Studio\'s 62 - Comprehensive Email Testing', 'cyan');
  log('=' .repeat(60), 'cyan');

  log('\nThis demo will show you how to:', 'blue');
  log('1. ✅ Validate SendGrid configuration', 'blue');
  log('2. 🧪 Test email templates and sending', 'blue');
  log('3. 📡 Monitor email activity in real-time', 'blue');

  await waitForInput('\nPress Enter to start the demonstration...');

  // Step 1: Validate Configuration
  log('\n' + '='.repeat(60), 'cyan');
  log('STEP 1: VALIDATE SENDGRID CONFIGURATION', 'bright');
  log('=' .repeat(60), 'cyan');

  log('\nThis will check:', 'blue');
  log('• API key format and authentication', 'blue');
  log('• Domain authentication (SPF, DKIM)', 'blue');
  log('• Sender reputation and limits', 'blue');
  log('• Security configuration', 'blue');

  await waitForInput('\nPress Enter to run validation...');

  const validationResult = await runScript('validate-sendgrid.mjs', ['--verbose']);

  if (validationResult === 0) {
    log('\n🎉 Configuration validation passed!', 'green');
  } else {
    log('\n⚠️ Configuration has issues. Check the output above.', 'yellow');
    log('You can still continue with the demo in test mode.', 'yellow');
  }

  await waitForInput('\nPress Enter to continue to email testing...');

  // Step 2: Test Email System
  log('\n' + '='.repeat(60), 'cyan');
  log('STEP 2: TEST EMAIL SYSTEM', 'bright');
  log('=' .repeat(60), 'cyan');

  log('\nThis will test:', 'blue');
  log('• Contact form email template', 'blue');
  log('• Order confirmation template', 'blue');
  log('• Newsletter subscription template', 'blue');
  log('• Payment confirmation template', 'blue');
  log('\nNote: Running in SANDBOX mode (no real emails sent)', 'yellow');

  await waitForInput('\nPress Enter to run email tests...');

  const testResult = await runScript('test-email-system.mjs', ['--verbose']);

  if (testResult === 0) {
    log('\n🎉 All email templates tested successfully!', 'green');
  } else {
    log('\n⚠️ Some email tests failed. Check the output above.', 'yellow');
  }

  await waitForInput('\nPress Enter to continue to monitoring demo...');

  // Step 3: Monitor Email Activity
  log('\n' + '='.repeat(60), 'cyan');
  log('STEP 3: EMAIL MONITORING DEMONSTRATION', 'bright');
  log('=' .repeat(60), 'cyan');

  log('\nThis will show:', 'blue');
  log('• Real-time email monitoring dashboard', 'blue');
  log('• Success/failure rate tracking', 'blue');
  log('• Performance metrics', 'blue');
  log('• Test email traffic generation', 'blue');
  log('\nNote: Monitor will run for 30 seconds with test traffic', 'yellow');

  await waitForInput('\nPress Enter to start monitoring demo...');

  log('\n🚀 Starting monitoring with test traffic...', 'cyan');
  log('The monitor will generate test emails and show the dashboard.', 'blue');
  log('Watch the statistics update in real-time!', 'blue');
  log('\nNote: This will stop automatically after 30 seconds.', 'yellow');

  // Start monitoring with test mode
  const monitorPromise = runScript('monitor-emails.mjs', ['--test-mode', '--interval=3000']);

  // Stop monitoring after 30 seconds
  setTimeout(() => {
    log('\n\n🛑 Demo time limit reached. Stopping monitor...', 'yellow');
    // The monitor script handles SIGINT gracefully
    process.kill(process.pid, 'SIGINT');
  }, 30000);

  await monitorPromise;

  // Demo complete
  log('\n' + '='.repeat(60), 'cyan');
  log('🎉 EMAIL TESTING SUITE DEMO COMPLETE!', 'bright');
  log('=' .repeat(60), 'cyan');

  log('\n📋 What you\'ve learned:', 'green');
  log('✅ How to validate SendGrid configuration', 'green');
  log('✅ How to test email templates safely', 'green');
  log('✅ How to monitor email activity in real-time', 'green');

  log('\n🚀 Next Steps:', 'cyan');
  log('1. Configure your actual SendGrid API key', 'blue');
  log('2. Set up domain authentication (SPF/DKIM)', 'blue');
  log('3. Run real email tests with --force-real flag', 'blue');
  log('4. Set up production monitoring', 'blue');

  log('\n💡 Quick Commands:', 'cyan');
  log('• npm run email:validate        - Validate configuration', 'blue');
  log('• npm run email:test           - Test templates (sandbox)', 'blue');
  log('• npm run email:test:real      - Test with real emails', 'blue');
  log('• npm run email:monitor        - Start real-time monitoring', 'blue');
  log('• npm run email:suite          - Run full test suite', 'blue');

  log('\n📚 Documentation:', 'cyan');
  log('• README-EMAIL-TESTING.md      - Complete documentation', 'blue');
  log('• email-monitoring.log         - Real-time event log', 'blue');
  log('• reports/                     - Generated reports', 'blue');

  log('\n🎯 JC Hair Studio\'s 62 - Email Testing Suite v1.0', 'magenta');
  log('Ready for production email testing and monitoring!', 'green');

  process.exit(0);
}

// CLI help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🎯 Email Testing Suite Demo - JC Hair Studio's 62

USAGE:
  node demo-email-suite.mjs

DESCRIPTION:
  Interactive demonstration of the complete email testing workflow.

  This demo will guide you through:
  1. Validating SendGrid configuration
  2. Testing email templates in sandbox mode
  3. Monitoring email activity with test traffic

REQUIREMENTS:
  • Node.js environment
  • SendGrid API key (optional for demo)
  • Terminal with color support

SAFETY:
  • All tests run in sandbox mode by default
  • No real emails are sent during demo
  • Safe to run in any environment

DURATION:
  • Approximately 2-3 minutes
  • Interactive with user prompts
  • Can be stopped at any time with Ctrl+C

EXAMPLE:
  node demo-email-suite.mjs
  `);
  process.exit(0);
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  log('\n\n🛑 Demo stopped by user.', 'yellow');
  log('Thank you for trying the Email Testing Suite!', 'cyan');
  process.exit(0);
});

// Run demo
demo().catch(error => {
  log(`\n❌ Demo error: ${error.message}`, 'red');
  process.exit(1);
});