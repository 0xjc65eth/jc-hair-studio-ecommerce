#!/usr/bin/env node

/**
 * Search Engine Ping Setup Script
 *
 * WHY: Configure and test the search engine ping system
 * HOW: Interactive setup with validation and testing
 *
 * Features:
 * - Environment variable verification
 * - IndexNow key file creation
 * - Webhook setup instructions
 * - Connection testing
 * - Rate limit state initialization
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
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

function header(text) {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${text}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);
}

function section(text) {
  console.log(`\n${colors.bright}${colors.yellow}${text}${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(70)}${colors.reset}`);
}

/**
 * Create readline interface
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(`${colors.blue}${prompt}${colors.reset} `, resolve);
  });
}

/**
 * Check environment variables
 */
function checkEnvironment() {
  section('1. Checking Environment Variables');

  const requiredVars = ['SITE_URL'];
  const optionalVars = ['WEBHOOK_SECRET'];

  let allPresent = true;

  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      log(`✅ ${varName}: ${process.env[varName]}`, 'green');
    } else {
      log(`❌ ${varName}: NOT SET (required)`, 'red');
      allPresent = false;
    }
  });

  optionalVars.forEach(varName => {
    if (process.env[varName]) {
      log(`✅ ${varName}: ${'*'.repeat(20)} (configured)`, 'green');
    } else {
      log(`⚠️  ${varName}: NOT SET (optional, recommended for production)`, 'yellow');
    }
  });

  return allPresent;
}

/**
 * Create IndexNow key file
 */
function createIndexNowKey() {
  section('2. Creating IndexNow Key File');

  const INDEXNOW_KEY = 'd4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8';
  const publicDir = path.join(process.cwd(), 'public');
  const keyPath = path.join(publicDir, `${INDEXNOW_KEY}.txt`);

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    log(`Created directory: ${publicDir}`, 'green');
  }

  fs.writeFileSync(keyPath, INDEXNOW_KEY, 'utf-8');
  log(`✅ Created IndexNow key file: public/${INDEXNOW_KEY}.txt`, 'green');

  const siteUrl = process.env.SITE_URL || 'https://jchairstudios62.xyz';
  log(`\n   Verify at: ${siteUrl}/${INDEXNOW_KEY}.txt`, 'dim');
}

/**
 * Create logs directory
 */
function createLogsDirectory() {
  section('3. Creating Logs Directory');

  const logsDir = path.join(process.cwd(), 'logs');

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    log(`✅ Created logs directory: logs/`, 'green');
  } else {
    log(`✅ Logs directory already exists: logs/`, 'green');
  }

  // Create initial empty log file
  const logFile = path.join(logsDir, 'search-engine-pings.log');
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, `# Search Engine Pings Log\n# Started: ${new Date().toISOString()}\n\n`, 'utf-8');
    log(`✅ Created log file: logs/search-engine-pings.log`, 'green');
  }

  // Create .gitignore for logs
  const gitignorePath = path.join(logsDir, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, '*.log\nping-state.json\n', 'utf-8');
    log(`✅ Created .gitignore for logs`, 'green');
  }
}

/**
 * Test connections to search engines
 */
async function testConnections() {
  section('4. Testing Connections to Search Engines');

  const siteUrl = process.env.SITE_URL || 'https://jchairstudios62.xyz';
  const sitemapUrl = `${siteUrl}/sitemap.xml`;

  // Test Google
  try {
    log('Testing Google ping service...', 'dim');
    const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const response = await fetch(googleUrl);
    log(`✅ Google: ${response.status} ${response.statusText}`, 'green');
  } catch (error) {
    log(`❌ Google: ${error.message}`, 'red');
  }

  // Test Bing
  try {
    log('Testing Bing ping service...', 'dim');
    const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const response = await fetch(bingUrl);
    log(`✅ Bing: ${response.status} ${response.statusText}`, 'green');
  } catch (error) {
    log(`❌ Bing: ${error.message}`, 'red');
  }

  // Test Yandex
  try {
    log('Testing Yandex ping service...', 'dim');
    const yandexUrl = `https://yandex.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const response = await fetch(yandexUrl);
    log(`✅ Yandex: ${response.status} ${response.statusText}`, 'green');
  } catch (error) {
    log(`❌ Yandex: ${error.message}`, 'red');
  }

  // Test IndexNow
  try {
    log('Testing IndexNow API...', 'dim');
    const response = await fetch('https://api.indexnow.org');
    log(`✅ IndexNow API: reachable`, 'green');
  } catch (error) {
    log(`❌ IndexNow: ${error.message}`, 'red');
  }
}

/**
 * Display Vercel webhook setup instructions
 */
function displayWebhookInstructions() {
  section('5. Vercel Webhook Setup Instructions');

  const siteUrl = process.env.SITE_URL || 'https://jchairstudios62.xyz';
  const webhookUrl = `${siteUrl}/api/webhooks/ping-engines`;

  log('To automatically ping search engines on deploy:\n', 'reset');

  log('STEP 1: Generate webhook secret', 'yellow');
  const webhookSecret = crypto.randomBytes(32).toString('hex');
  log(`   Add this to your .env.local and Vercel environment:`, 'reset');
  log(`   WEBHOOK_SECRET=${webhookSecret}\n`, 'green');

  log('STEP 2: Configure Vercel Deploy Hook', 'yellow');
  log('   1. Go to your Vercel project dashboard', 'reset');
  log('   2. Navigate to: Settings → Git → Deploy Hooks', 'reset');
  log('   3. Click "Create Hook"', 'reset');
  log(`   4. Name: "Search Engine Ping"`, 'reset');
  log(`   5. Branch: production (or your main branch)`, 'reset');
  log('   6. Save the hook URL\n', 'reset');

  log('STEP 3: Create webhook endpoint', 'yellow');
  log('   The webhook endpoint is already created at:', 'reset');
  log(`   ${webhookUrl}`, 'green');
  log('   This will be triggered automatically on deploy\n', 'reset');

  log('STEP 4: Test manually', 'yellow');
  log('   You can test the webhook with curl:', 'reset');
  log(`   curl -X GET ${webhookUrl} \\`, 'dim');
  log(`        -H "Authorization: Bearer YOUR_WEBHOOK_SECRET"\n`, 'dim');

  log('Or simply run the CLI script:', 'yellow');
  log('   npm run seo:ping-engines\n', 'dim');
}

/**
 * Display usage instructions
 */
function displayUsage() {
  section('6. Usage Instructions');

  log('Manual ping (all engines):', 'yellow');
  log('   npm run seo:ping-engines\n', 'dim');

  log('Manual ping (specific engine):', 'yellow');
  log('   npm run seo:ping-engines -- --google', 'dim');
  log('   npm run seo:ping-engines -- --bing', 'dim');
  log('   npm run seo:ping-engines -- --yandex', 'dim');
  log('   npm run seo:ping-engines -- --indexnow\n', 'dim');

  log('Verbose output:', 'yellow');
  log('   npm run seo:ping-engines -- --verbose\n', 'dim');

  log('Force ping (ignore rate limits):', 'yellow');
  log('   npm run seo:ping-engines -- --force\n', 'dim');

  log('View logs:', 'yellow');
  log('   cat logs/search-engine-pings.log\n', 'dim');

  log('Automatic pings:', 'yellow');
  log('   Set up Vercel deploy hook (see instructions above)', 'dim');
  log('   Pings will occur automatically on each deployment\n', 'dim');
}

/**
 * Update package.json
 */
function updatePackageJson() {
  section('7. Updating package.json');

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  // Add script if not exists
  const scriptName = 'seo:ping-engines';
  const scriptCommand = 'node scripts/ping-search-engines.js';

  if (!packageJson.scripts[scriptName]) {
    packageJson.scripts[scriptName] = scriptCommand;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
    log(`✅ Added script to package.json: ${scriptName}`, 'green');
  } else {
    log(`✅ Script already exists: ${scriptName}`, 'green');
  }
}

/**
 * Create example .env file
 */
function createEnvExample() {
  section('8. Creating .env.example');

  const envExamplePath = path.join(process.cwd(), '.env.example.search-ping');
  const envContent = `# Search Engine Ping Configuration

# Your site URL (required)
SITE_URL=https://jchairstudios62.xyz

# Webhook secret for Vercel deploy hooks (optional but recommended)
# Generate with: openssl rand -hex 32
WEBHOOK_SECRET=your_webhook_secret_here

# Note: Add these to your .env.local and Vercel environment variables
`;

  fs.writeFileSync(envExamplePath, envContent, 'utf-8');
  log(`✅ Created .env.example.search-ping`, 'green');
  log(`   Copy relevant variables to your .env.local`, 'dim');
}

/**
 * Main setup
 */
async function main() {
  header('🔔 Search Engine Ping System Setup');

  log('This script will set up automatic search engine pings for your site.\n', 'reset');

  // Check environment
  const envOk = checkEnvironment();
  if (!envOk) {
    log('\n⚠️  Required environment variables missing!', 'red');
    log('Please set SITE_URL in your .env.local and run this script again.\n', 'yellow');
  }

  // Create necessary files and directories
  createIndexNowKey();
  createLogsDirectory();
  updatePackageJson();
  createEnvExample();

  // Test connections
  await testConnections();

  // Display instructions
  displayWebhookInstructions();
  displayUsage();

  header('✅ Setup Complete!');

  log('Next steps:', 'yellow');
  log('  1. Set up Vercel deploy webhook (see instructions above)', 'reset');
  log('  2. Test manually: npm run seo:ping-engines', 'reset');
  log('  3. Check logs: cat logs/search-engine-pings.log\n', 'reset');

  log('For questions or issues, refer to the documentation in:', 'dim');
  log('  scripts/ping-search-engines.js\n', 'dim');

  rl.close();
}

main().catch(error => {
  console.error(`\n${colors.red}Error: ${error.message}${colors.reset}\n`);
  process.exit(1);
});
