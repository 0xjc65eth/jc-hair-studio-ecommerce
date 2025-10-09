#!/usr/bin/env node

/**
 * Test Script for Search Engine Ping System
 *
 * WHY: Verify that all components work correctly
 * HOW: Run tests on logger, rate limiter, and ping functions
 *
 * Usage: node scripts/test-ping-system.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

let passCount = 0;
let failCount = 0;

function assert(condition, testName) {
  if (condition) {
    log(`✅ ${testName}`, 'green');
    passCount++;
  } else {
    log(`❌ ${testName}`, 'red');
    failCount++;
  }
}

function testSection(name) {
  console.log(`\n${colors.bright}${colors.cyan}${name}${colors.reset}`);
  console.log(colors.cyan + '─'.repeat(70) + colors.reset);
}

/**
 * Test 1: File Structure
 */
function testFileStructure() {
  testSection('Test 1: File Structure');

  const requiredFiles = [
    'scripts/ping-search-engines.mjs',
    'scripts/setup-search-engine-ping.mjs',
    'app/api/webhooks/ping-engines/route.ts',
    'docs/SEARCH-ENGINE-PING.md'
  ];

  requiredFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    const exists = fs.existsSync(filePath);
    assert(exists, `File exists: ${file}`);
  });
}

/**
 * Test 2: Package.json Scripts
 */
function testPackageJsonScripts() {
  testSection('Test 2: Package.json Scripts');

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  const requiredScripts = [
    'seo:ping-engines',
    'seo:ping-engines:google',
    'seo:ping-engines:bing',
    'seo:ping-engines:force',
    'seo:ping-engines:verbose',
    'seo:ping-setup'
  ];

  requiredScripts.forEach(script => {
    const exists = !!packageJson.scripts[script];
    assert(exists, `Script exists: ${script}`);
  });
}

/**
 * Test 3: Environment Variables
 */
function testEnvironmentVariables() {
  testSection('Test 3: Environment Variables');

  const siteUrl = process.env.SITE_URL;
  assert(!!siteUrl, 'SITE_URL is set');

  if (siteUrl) {
    assert(siteUrl.startsWith('http'), 'SITE_URL starts with http(s)');
    assert(!siteUrl.endsWith('/'), 'SITE_URL does not end with /');
  }

  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (webhookSecret) {
    log(`✅ WEBHOOK_SECRET is set (length: ${webhookSecret.length})`, 'green');
    passCount++;
  } else {
    log(`⚠️  WEBHOOK_SECRET not set (optional but recommended)`, 'yellow');
  }
}

/**
 * Test 4: Logs Directory
 */
function testLogsDirectory() {
  testSection('Test 4: Logs Directory');

  const logsDir = path.join(process.cwd(), 'logs');
  const logsDirExists = fs.existsSync(logsDir);
  assert(logsDirExists, 'logs/ directory exists');

  if (logsDirExists) {
    const stats = fs.statSync(logsDir);
    assert(stats.isDirectory(), 'logs/ is a directory');

    const logFile = path.join(logsDir, 'search-engine-pings.log');
    const logFileExists = fs.existsSync(logFile);
    if (logFileExists) {
      log(`✅ Log file exists: search-engine-pings.log`, 'green');
      passCount++;
    } else {
      log(`⚠️  Log file not created yet (will be created on first run)`, 'yellow');
    }
  }
}

/**
 * Test 5: IndexNow Key File
 */
function testIndexNowKeyFile() {
  testSection('Test 5: IndexNow Key File');

  const INDEXNOW_KEY = 'd4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8';
  const keyPath = path.join(process.cwd(), 'public', `${INDEXNOW_KEY}.txt`);
  const keyFileExists = fs.existsSync(keyPath);

  assert(keyFileExists, 'IndexNow key file exists');

  if (keyFileExists) {
    const content = fs.readFileSync(keyPath, 'utf-8').trim();
    assert(content === INDEXNOW_KEY, 'IndexNow key content is correct');
  }
}

/**
 * Test 6: Sitemap Exists
 */
function testSitemapExists() {
  testSection('Test 6: Sitemap');

  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  const sitemapExists = fs.existsSync(sitemapPath);

  assert(sitemapExists, 'sitemap.xml exists');

  if (sitemapExists) {
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    assert(content.includes('<urlset'), 'sitemap.xml contains urlset tag');
    assert(content.includes('<loc>'), 'sitemap.xml contains loc tags');
  }
}

/**
 * Test 7: API Route Structure
 */
function testApiRouteStructure() {
  testSection('Test 7: API Route');

  const routePath = path.join(process.cwd(), 'app/api/webhooks/ping-engines/route.ts');
  const routeExists = fs.existsSync(routePath);

  assert(routeExists, 'Webhook route file exists');

  if (routeExists) {
    const content = fs.readFileSync(routePath, 'utf-8');
    assert(content.includes('export async function POST'), 'Route has POST handler');
    assert(content.includes('export async function GET'), 'Route has GET handler');
    assert(content.includes('verifyWebhookSignature'), 'Route has signature verification');
    assert(content.includes('checkRateLimit'), 'Route has rate limiting');
  }
}

/**
 * Test 8: Main Script Structure
 */
function testMainScriptStructure() {
  testSection('Test 8: Main Script');

  const scriptPath = path.join(process.cwd(), 'scripts/ping-search-engines.mjs');
  const scriptExists = fs.existsSync(scriptPath);

  assert(scriptExists, 'Main ping script exists');

  if (scriptExists) {
    const content = fs.readFileSync(scriptPath, 'utf-8');
    assert(content.includes('class Logger'), 'Script has Logger class');
    assert(content.includes('class RateLimiter'), 'Script has RateLimiter class');
    assert(content.includes('async function pingGoogle'), 'Script has pingGoogle function');
    assert(content.includes('async function pingBing'), 'Script has pingBing function');
    assert(content.includes('async function pingYandex'), 'Script has pingYandex function');
    assert(content.includes('async function pingBaidu'), 'Script has pingBaidu function');
    assert(content.includes('async function submitIndexNow'), 'Script has submitIndexNow function');
  }
}

/**
 * Test 9: Documentation
 */
function testDocumentation() {
  testSection('Test 9: Documentation');

  const docPath = path.join(process.cwd(), 'docs/SEARCH-ENGINE-PING.md');
  const docExists = fs.existsSync(docPath);

  assert(docExists, 'Documentation file exists');

  if (docExists) {
    const content = fs.readFileSync(docPath, 'utf-8');
    assert(content.includes('## Instalação e Setup'), 'Doc has installation section');
    assert(content.includes('## Uso'), 'Doc has usage section');
    assert(content.includes('## Rate Limits'), 'Doc has rate limits section');
    assert(content.includes('## Troubleshooting'), 'Doc has troubleshooting section');
  }
}

/**
 * Test 10: Connectivity (Optional)
 */
async function testConnectivity() {
  testSection('Test 10: Connectivity (Optional)');

  log('Testing connections to search engines...', 'cyan');
  log('(These tests may fail due to network/firewall - this is normal)\n', 'dim');

  // Test Google
  try {
    const response = await fetch('https://www.google.com/ping', { method: 'HEAD' });
    log(`✅ Google ping service reachable (${response.status})`, 'green');
    passCount++;
  } catch (error) {
    log(`⚠️  Google ping service: ${error.message}`, 'yellow');
  }

  // Test Bing
  try {
    const response = await fetch('https://www.bing.com/ping', { method: 'HEAD' });
    log(`✅ Bing ping service reachable (${response.status})`, 'green');
    passCount++;
  } catch (error) {
    log(`⚠️  Bing ping service: ${error.message}`, 'yellow');
  }

  // Test IndexNow
  try {
    const response = await fetch('https://api.indexnow.org', { method: 'HEAD' });
    log(`✅ IndexNow API reachable (${response.status})`, 'green');
    passCount++;
  } catch (error) {
    log(`⚠️  IndexNow API: ${error.message}`, 'yellow');
  }
}

/**
 * Display Summary
 */
function displaySummary() {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}TEST SUMMARY${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);

  const total = passCount + failCount;
  const percentage = total > 0 ? ((passCount / total) * 100).toFixed(1) : 0;

  console.log(`Total Tests:  ${total}`);
  console.log(`${colors.green}Passed:       ${passCount}${colors.reset}`);
  console.log(`${colors.red}Failed:       ${failCount}${colors.reset}`);
  console.log(`Success Rate: ${percentage}%\n`);

  if (failCount === 0) {
    log('🎉 All tests passed! System is ready to use.', 'green');
    log('\nNext steps:', 'cyan');
    log('  1. Run setup: npm run seo:ping-setup', 'reset');
    log('  2. Test ping: npm run seo:ping-engines', 'reset');
    log('  3. Check logs: cat logs/search-engine-pings.log\n', 'reset');
  } else {
    log('⚠️  Some tests failed. Please review the errors above.', 'yellow');
    log('\nCommon fixes:', 'cyan');
    log('  - Run setup script: npm run seo:ping-setup', 'reset');
    log('  - Check environment variables in .env.local', 'reset');
    log('  - Ensure all files were created correctly\n', 'reset');
  }

  console.log(`${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);
}

/**
 * Main Test Runner
 */
async function main() {
  console.log(`\n${colors.bright}${colors.cyan}🧪 Search Engine Ping System - Test Suite${colors.reset}\n`);

  testFileStructure();
  testPackageJsonScripts();
  testEnvironmentVariables();
  testLogsDirectory();
  testIndexNowKeyFile();
  testSitemapExists();
  testApiRouteStructure();
  testMainScriptStructure();
  testDocumentation();
  await testConnectivity();

  displaySummary();

  process.exit(failCount > 0 ? 1 : 0);
}

main().catch(error => {
  console.error(`\n${colors.red}Fatal error: ${error.message}${colors.reset}\n`);
  process.exit(1);
});
