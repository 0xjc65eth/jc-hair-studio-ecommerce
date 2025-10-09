#!/usr/bin/env node

/**
 * SEO Monitoring Setup Script
 * Guides user through setting up complete SEO monitoring system
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`  ${title}`, 'bright');
  log('='.repeat(60) + '\n', 'cyan');
}

async function main() {
  log('\n🚀 SEO Monitoring System Setup', 'bright');
  log('Configure complete SEO monitoring for JC Hair Studio\n', 'cyan');

  const config = {
    gtmId: '',
    ga4Id: '',
    googleClientEmail: '',
    googlePrivateKey: '',
    siteUrl: '',
    alertEmail: '',
  };

  // Step 1: Google Tag Manager
  logSection('1. Google Tag Manager Setup');
  log('📋 Instructions:', 'yellow');
  log('1. Go to https://tagmanager.google.com/', 'reset');
  log('2. Create a new account and container', 'reset');
  log('3. Copy your GTM ID (format: GTM-XXXXXXX)\n', 'reset');

  config.gtmId = await question('Enter your GTM ID (or press Enter to skip): ');

  // Step 2: Google Analytics 4
  logSection('2. Google Analytics 4 Setup');
  log('📋 Instructions:', 'yellow');
  log('1. Go to https://analytics.google.com/', 'reset');
  log('2. Create a GA4 property', 'reset');
  log('3. Copy your Measurement ID (format: G-XXXXXXXXXX)\n', 'reset');

  config.ga4Id = await question('Enter your GA4 Measurement ID: ');

  // Step 3: Google Search Console API
  logSection('3. Google Search Console API Setup');
  log('📋 Instructions:', 'yellow');
  log('1. Go to https://console.cloud.google.com/', 'reset');
  log('2. Create a new project or select existing', 'reset');
  log('3. Enable Search Console API', 'reset');
  log('4. Create a Service Account', 'reset');
  log('5. Download the JSON key file', 'reset');
  log('6. In Search Console, add the service account email as a user\n', 'reset');

  const useServiceAccount = await question(
    'Do you have a service account set up? (y/n): '
  );

  if (useServiceAccount.toLowerCase() === 'y') {
    config.googleClientEmail = await question('Enter service account email: ');
    log(
      '\nPaste your private key (press Enter twice when done):',
      'yellow'
    );
    const keyLines = [];
    let line;
    while ((line = await question('')) !== '') {
      keyLines.push(line);
    }
    config.googlePrivateKey = keyLines.join('\\n');
  }

  // Step 4: Site Configuration
  logSection('4. Site Configuration');
  config.siteUrl =
    (await question(
      'Enter your site URL (https://jchairstudios62.xyz): '
    )) || 'https://jchairstudios62.xyz';
  config.alertEmail =
    (await question('Enter email for SEO alerts: ')) ||
    'admin@jchairstudios62.xyz';

  // Step 5: Update .env.local
  logSection('5. Updating Environment Variables');

  const envPath = path.join(__dirname, '..', '.env.local');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }

  const envUpdates = {
    NEXT_PUBLIC_GTM_ID: config.gtmId,
    NEXT_PUBLIC_GA4_ID: config.ga4Id,
    GOOGLE_CLIENT_EMAIL: config.googleClientEmail,
    GOOGLE_PRIVATE_KEY: config.googlePrivateKey,
    GOOGLE_SEARCH_CONSOLE_SITE_URL: config.siteUrl,
    ALERT_EMAIL: config.alertEmail,
  };

  Object.entries(envUpdates).forEach(([key, value]) => {
    if (value) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}="${value}"`);
      } else {
        envContent += `\n${key}="${value}"`;
      }
    }
  });

  fs.writeFileSync(envPath, envContent);
  log('✅ Environment variables updated!', 'green');

  // Step 6: MongoDB Collections Setup
  logSection('6. Database Setup');
  log('Creating MongoDB collections for SEO monitoring...', 'yellow');

  const collections = [
    'seo_rankings',
    'seo_404_errors',
    'seo_redirects',
    'seo_traffic_alerts',
  ];

  log('\nRequired MongoDB collections:', 'cyan');
  collections.forEach((col) => log(`  - ${col}`, 'reset'));

  log(
    '\n⚠️  Make sure these collections exist in your MongoDB database',
    'yellow'
  );

  // Step 7: Next Steps
  logSection('7. Next Steps');

  log('✅ SEO Monitoring setup complete!\n', 'green');

  log('📝 To complete the setup:', 'bright');
  log('\n1. Google Tag Manager Configuration:', 'yellow');
  log('   - Add Google Analytics 4 tag in GTM', 'reset');
  log('   - Configure e-commerce events', 'reset');
  log('   - Add Facebook Pixel (optional)', 'reset');
  log('   - Publish your GTM container\n', 'reset');

  log('2. Search Console Verification:', 'yellow');
  log('   - Verify your site ownership', 'reset');
  log('   - Submit sitemap.xml', 'reset');
  log('   - Add service account as user\n', 'reset');

  log('3. Start Monitoring:', 'yellow');
  log('   - Run: npm run dev', 'reset');
  log('   - Visit: http://localhost:3001/admin/seo', 'reset');
  log('   - Set up cron jobs for automated tracking\n', 'reset');

  log('4. Recommended Cron Jobs:', 'yellow');
  log('   - Daily: npm run seo:track-rankings', 'reset');
  log('   - Hourly: npm run seo:monitor-traffic', 'reset');
  log('   - Weekly: npm run seo:generate-reports\n', 'reset');

  log('📚 Documentation:', 'cyan');
  log('   - Google Tag Manager: https://tagmanager.google.com/\n', 'reset');
  log('   - GA4: https://analytics.google.com/', 'reset');
  log(
    '   - Search Console API: https://developers.google.com/webmaster-tools\n',
    'reset'
  );

  log('\n🎉 Happy monitoring!', 'green');

  rl.close();
}

main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});
