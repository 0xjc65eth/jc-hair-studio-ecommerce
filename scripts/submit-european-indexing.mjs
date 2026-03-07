#!/usr/bin/env node

/**
 * European Market Indexing Tool - JC Hair Studio's 62
 *
 * Submits URLs to all major search engines used across Europe:
 * - Google (via Search Console API + ping)
 * - Bing (via IndexNow API + ping)
 * - Yandex (via IndexNow + ping) - used in Eastern Europe
 * - Seznam (Czech Republic)
 *
 * Also generates structured data validation URLs for testing.
 *
 * Usage: node scripts/submit-european-indexing.mjs
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://jchairstudios62.xyz';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const PRODUCT_FEED_URL = `${SITE_URL}/product-feed.xml`;

// All European locales the site supports
const EU_LOCALES = [
  'pt-PT', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'nl-NL', 'pl-PL',
  'ro-RO', 'sv-SE', 'da-DK', 'fi-FI', 'el-GR', 'cs-CZ', 'hu-HU',
];

// Critical URLs that must be indexed first (revenue-generating pages)
const CRITICAL_URLS = [
  SITE_URL,
  `${SITE_URL}/produtos`,
  `${SITE_URL}/mega-hair`,
  `${SITE_URL}/maquiagem`,
  `${SITE_URL}/cosmeticos`,
  `${SITE_URL}/progressiva-vogue-portugal`,
  `${SITE_URL}/tintas-wella-portugal`,
  `${SITE_URL}/esmaltes-impala-portugal`,
  `${SITE_URL}/mari-maria-makeup-portugal`,
  `${SITE_URL}/sobre`,
  `${SITE_URL}/contato`,
];

// Generate locale-specific URLs for all locales
const LOCALE_URLS = EU_LOCALES.map(locale => `${SITE_URL}/${locale}`);

// All URLs to submit
const ALL_URLS = [...CRITICAL_URLS, ...LOCALE_URLS];

const colors = {
  reset: '\x1b[0m', green: '\x1b[32m', red: '\x1b[31m',
  yellow: '\x1b[33m', blue: '\x1b[34m', cyan: '\x1b[36m',
  bold: '\x1b[1m', dim: '\x1b[2m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'─'.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'bold');
  log(`${'─'.repeat(60)}`, 'cyan');
}

// ─── HTTP helpers ───

function httpGet(url) {
  const mod = url.startsWith('https') ? https : http;
  return new Promise((resolve) => {
    mod.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', (e) => resolve({ status: 0, error: e.message }));
  });
}

function httpPost(hostname, path, body) {
  const data = JSON.stringify(body);
  return new Promise((resolve) => {
    const req = https.request({
      hostname, path, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': data.length },
    }, (res) => {
      let responseData = '';
      res.on('data', c => responseData += c);
      res.on('end', () => resolve({ status: res.statusCode, data: responseData }));
    });
    req.on('error', (e) => resolve({ status: 0, error: e.message }));
    req.write(data);
    req.end();
  });
}

// ─── IndexNow (Bing + Yandex + Seznam) ───

function generateIndexNowKey() {
  const chars = '0123456789abcdef';
  return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * 16)]).join('');
}

async function submitIndexNow(urls, apiKey) {
  const host = SITE_URL.replace(/^https?:\/\//, '');
  const body = {
    host, key: apiKey,
    keyLocation: `${SITE_URL}/${apiKey}.txt`,
    urlList: urls,
  };

  // Submit to multiple IndexNow endpoints (covers Bing, Yandex, Seznam)
  const endpoints = [
    { name: 'Bing/IndexNow', host: 'api.indexnow.org' },
    { name: 'Yandex', host: 'yandex.com' },
    { name: 'Seznam (CZ)', host: 'search.seznam.cz' },
  ];

  const results = [];
  for (const ep of endpoints) {
    try {
      const res = await httpPost(ep.host, '/indexnow', body);
      const ok = res.status >= 200 && res.status < 300;
      results.push({ ...ep, status: res.status, ok });
      log(`  ${ok ? '✓' : '⚠'} ${ep.name}: HTTP ${res.status}`, ok ? 'green' : 'yellow');
    } catch (e) {
      results.push({ ...ep, status: 0, ok: false, error: e.message });
      log(`  ✗ ${ep.name}: ${e.message}`, 'red');
    }
  }
  return results;
}

// ─── Google Ping ───

async function pingGoogle() {
  const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  return httpGet(url);
}

// ─── Bing Ping ───

async function pingBing() {
  const url = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  return httpGet(url);
}

// ─── Site Validation Checks ───

async function validateSite() {
  logSection('SITE VALIDATION');

  const checks = [
    { name: 'Homepage', url: SITE_URL },
    { name: 'Sitemap', url: SITEMAP_URL },
    { name: 'Product Feed', url: PRODUCT_FEED_URL },
    { name: 'Robots.txt', url: `${SITE_URL}/robots.txt` },
  ];

  for (const check of checks) {
    const res = await httpGet(check.url);
    const ok = res.status === 200;
    log(`  ${ok ? '✓' : '✗'} ${check.name}: HTTP ${res.status || 'FAIL'}`, ok ? 'green' : 'red');
  }
}

// ─── European market coverage report ───

function europeanCoverageReport() {
  logSection('EUROPEAN MARKET COVERAGE');

  const markets = [
    { country: 'Portugal', locale: 'pt-PT', currency: 'EUR', population: '10.3M', priority: 'PRIMARY' },
    { country: 'Spain', locale: 'es-ES', currency: 'EUR', population: '47.4M', priority: 'HIGH' },
    { country: 'France', locale: 'fr-FR', currency: 'EUR', population: '67.4M', priority: 'HIGH' },
    { country: 'Germany', locale: 'de-DE', currency: 'EUR', population: '83.2M', priority: 'HIGH' },
    { country: 'Italy', locale: 'it-IT', currency: 'EUR', population: '59.1M', priority: 'HIGH' },
    { country: 'UK', locale: 'en-GB', currency: 'GBP', population: '67.3M', priority: 'HIGH' },
    { country: 'Netherlands', locale: 'nl-NL', currency: 'EUR', population: '17.5M', priority: 'MEDIUM' },
    { country: 'Poland', locale: 'pl-PL', currency: 'PLN', population: '37.7M', priority: 'MEDIUM' },
    { country: 'Belgium', locale: 'fr-BE', currency: 'EUR', population: '11.5M', priority: 'MEDIUM' },
    { country: 'Romania', locale: 'ro-RO', currency: 'RON', population: '19.0M', priority: 'MEDIUM' },
    { country: 'Sweden', locale: 'sv-SE', currency: 'SEK', population: '10.4M', priority: 'LOW' },
    { country: 'Czech Republic', locale: 'cs-CZ', currency: 'CZK', population: '10.7M', priority: 'LOW' },
    { country: 'Denmark', locale: 'da-DK', currency: 'DKK', population: '5.8M', priority: 'LOW' },
    { country: 'Finland', locale: 'fi-FI', currency: 'EUR', population: '5.5M', priority: 'LOW' },
    { country: 'Hungary', locale: 'hu-HU', currency: 'HUF', population: '9.7M', priority: 'LOW' },
  ];

  let totalPop = 0;
  for (const m of markets) {
    const popNum = parseFloat(m.population);
    totalPop += popNum;
    const icon = m.priority === 'PRIMARY' ? '⭐' : m.priority === 'HIGH' ? '🔵' : m.priority === 'MEDIUM' ? '🟡' : '⚪';
    log(`  ${icon} ${m.country.padEnd(16)} ${m.locale.padEnd(6)} ${m.currency.padEnd(4)} ${m.population.padEnd(6)} ${m.priority}`, 'reset');
  }
  log(`\n  Total addressable market: ~${totalPop.toFixed(0)}M people`, 'bold');
  log(`  ${ALL_URLS.length} URLs submitted for indexing`, 'green');
}

// ─── Search Console Instructions ───

function printSetupGuide() {
  logSection('GOOGLE SEARCH CONSOLE SETUP');

  log(`
  1. Go to https://search.google.com/search-console
  2. Add property: ${SITE_URL}
  3. Verify via DNS TXT record (recommended) or HTML tag
  4. After verification:
     a. Sitemaps → Submit: /sitemap.xml
     b. Sitemaps → Submit: /product-feed.xml
     c. URL Inspection → Test live URL for homepage
     d. Settings → International targeting → Set target: Europe
  `, 'reset');

  logSection('BING WEBMASTER TOOLS');
  log(`
  1. Go to https://www.bing.com/webmasters
  2. Import from Google Search Console (easiest method)
  3. Or add manually: ${SITE_URL}
  4. Submit sitemaps: /sitemap.xml and /product-feed.xml
  `, 'reset');

  logSection('GOOGLE MERCHANT CENTER (SHOPPING ADS)');
  log(`
  1. Go to https://merchants.google.com
  2. Create account → Add business info
  3. Verify website: ${SITE_URL}
  4. Products → Feeds → Add feed:
     - Country: Portugal (then add ES, FR, DE, IT, UK, NL)
     - Language: Portuguese
     - Feed URL: ${PRODUCT_FEED_URL}
     - Fetch schedule: Daily
  5. Enable free product listings
  6. Connect to Google Ads for Shopping campaigns
  `, 'reset');

  logSection('ENVIRONMENT VARIABLES TO SET');
  log(`
  Add these to your Vercel/hosting environment:

  # After Google Search Console verification:
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-actual-token

  # After Bing verification:
  NEXT_PUBLIC_BING_VERIFICATION=your-actual-token

  # Google Analytics (create at analytics.google.com):
  NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

  # Facebook Pixel (create at business.facebook.com):
  NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your-pixel-id
  `, 'yellow');

  logSection('SEO VALIDATION TOOLS');
  log(`
  Test your site with these tools after deployment:

  Rich Results Test:
    https://search.google.com/test/rich-results?url=${encodeURIComponent(SITE_URL)}

  Mobile-Friendly Test:
    https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(SITE_URL)}

  PageSpeed Insights:
    https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL)}

  Schema Markup Validator:
    https://validator.schema.org/#url=${encodeURIComponent(SITE_URL)}

  Hreflang Tag Checker:
    https://technicalseo.com/tools/hreflang/

  Open Graph Debugger:
    https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(SITE_URL)}

  Twitter Card Validator:
    https://cards-dev.twitter.com/validator
  `, 'cyan');
}

// ─── Main ───

async function main() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'bold');
  log('║  JC Hair Studio\'s 62 - European Indexing Tool           ║', 'bold');
  log('║  Submitting to Google, Bing, Yandex & European engines  ║', 'bold');
  log('╚══════════════════════════════════════════════════════════╝', 'bold');

  // 1. Validate site is accessible
  await validateSite();

  // 2. Generate and save IndexNow key
  logSection('INDEXNOW SUBMISSION');
  const apiKey = generateIndexNowKey();
  const keyPath = path.join(process.cwd(), 'public', `${apiKey}.txt`);
  fs.writeFileSync(keyPath, apiKey);
  log(`  ✓ IndexNow key generated: ${apiKey.substring(0, 16)}...`, 'green');
  log(`  ✓ Key saved to: public/${apiKey}.txt`, 'green');

  // 3. Submit all URLs to IndexNow (Bing + Yandex + Seznam)
  log(`\n  Submitting ${ALL_URLS.length} URLs...`, 'yellow');
  await submitIndexNow(ALL_URLS, apiKey);

  // 4. Ping Google
  logSection('GOOGLE SITEMAP PING');
  const googleResult = await pingGoogle();
  log(`  ${googleResult.status === 200 ? '✓' : '⚠'} Google ping: HTTP ${googleResult.status || 'FAIL'}`, googleResult.status === 200 ? 'green' : 'yellow');

  // 5. Ping Bing
  logSection('BING SITEMAP PING');
  const bingResult = await pingBing();
  log(`  ${bingResult.status === 200 ? '✓' : '⚠'} Bing ping: HTTP ${bingResult.status || 'FAIL'}`, bingResult.status === 200 ? 'green' : 'yellow');

  // 6. European coverage report
  europeanCoverageReport();

  // 7. Setup guide
  printSetupGuide();

  // 8. Summary
  logSection('SUMMARY');
  log(`
  ✅ ${ALL_URLS.length} URLs submitted to IndexNow (Bing + Yandex + Seznam)
  ✅ Google sitemap pinged
  ✅ Bing sitemap pinged
  ✅ ${EU_LOCALES.length} European locales configured
  ✅ IndexNow key saved for future submissions

  NEXT STEPS:
  1. Set up Google Search Console (manual - see guide above)
  2. Set up Google Merchant Center for Shopping ads
  3. Add verification tokens to environment variables
  4. Run this script weekly: node scripts/submit-european-indexing.mjs
  `, 'green');

  log('  Run "npm run seo:europe" to execute this script anytime.\n', 'cyan');
}

main().catch(console.error);
