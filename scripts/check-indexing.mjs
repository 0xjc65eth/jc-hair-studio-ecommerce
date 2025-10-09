#!/usr/bin/env node

/**
 * Check Indexing Status
 * Verify site indexing status via Search Console API
 */

import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${colors[color]}${message}${colors.reset}`);
}

/**
 * Initialize Search Console client
 */
function getSearchConsoleClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error('Google API credentials not configured. Run: npm run seo:setup');
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/webmasters',
    ],
  });

  return { auth, searchconsole: google.searchconsole({ version: 'v1', auth }) };
}

/**
 * Get sitemap status
 */
async function checkSitemaps(searchconsole, siteUrl) {
  try {
    log('\n📋 Checking sitemaps...', 'cyan');

    const response = await searchconsole.sitemaps.list({
      siteUrl,
    });

    const sitemaps = response.data.sitemap || [];

    if (sitemaps.length === 0) {
      log('⚠️  No sitemaps found', 'yellow');
      log('  Submit sitemap: npm run seo:submit', 'reset');
      return [];
    }

    log(`Found ${sitemaps.length} sitemap(s):`, 'green');

    sitemaps.forEach((sitemap) => {
      log(`\n  Sitemap: ${sitemap.path}`, 'bright');
      log(`    Type: ${sitemap.type || 'Unknown'}`, 'reset');
      log(`    Last Submitted: ${sitemap.lastSubmitted || 'Never'}`, 'reset');
      log(`    Last Downloaded: ${sitemap.lastDownloaded || 'Never'}`, 'reset');

      if (sitemap.contents) {
        sitemap.contents.forEach((content) => {
          log(`    ${content.type}: ${content.submitted || 0} submitted, ${content.indexed || 0} indexed`, 'reset');
        });
      }

      if (sitemap.errors) {
        log(`    ⚠️  Errors: ${sitemap.errors.length}`, 'red');
        sitemap.errors.forEach((error) => {
          log(`      - ${error.message}`, 'red');
        });
      }

      if (sitemap.warnings) {
        log(`    ⚠️  Warnings: ${sitemap.warnings.length}`, 'yellow');
      }
    });

    return sitemaps;
  } catch (error) {
    log(`Error checking sitemaps: ${error.message}`, 'red');
    return [];
  }
}

/**
 * Inspect specific URL
 */
async function inspectUrl(searchconsole, siteUrl, inspectionUrl) {
  try {
    log(`\n🔍 Inspecting URL: ${inspectionUrl}`, 'cyan');

    const response = await searchconsole.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl,
        siteUrl,
      },
    });

    const result = response.data.inspectionResult || {};
    const indexStatus = result.indexStatusResult || {};

    log('\nIndexing Status:', 'bright');
    log(`  Verdict: ${indexStatus.verdict || 'Unknown'}`,
      indexStatus.verdict === 'PASS' ? 'green' : 'yellow');
    log(`  Coverage State: ${indexStatus.coverageState || 'Unknown'}`, 'reset');
    log(`  Robots.txt State: ${indexStatus.robotsTxtState || 'Unknown'}`, 'reset');
    log(`  Indexing State: ${indexStatus.indexingState || 'Unknown'}`, 'reset');

    if (indexStatus.lastCrawlTime) {
      log(`  Last Crawled: ${indexStatus.lastCrawlTime}`, 'reset');
    }

    // Mobile usability
    const mobileUsability = result.mobileUsabilityResult || {};
    if (mobileUsability.verdict) {
      log('\nMobile Usability:', 'bright');
      log(`  Verdict: ${mobileUsability.verdict}`,
        mobileUsability.verdict === 'PASS' ? 'green' : 'red');

      if (mobileUsability.issues && mobileUsability.issues.length > 0) {
        log('  Issues:', 'red');
        mobileUsability.issues.forEach((issue) => {
          log(`    - ${issue.issueType}: ${issue.message}`, 'red');
        });
      }
    }

    return result;
  } catch (error) {
    log(`Error inspecting URL: ${error.message}`, 'red');
    return null;
  }
}

/**
 * Get important URLs to check
 */
function getImportantUrls(baseUrl) {
  return [
    baseUrl, // Homepage
    `${baseUrl}/pt/produtos`, // Products page
    `${baseUrl}/pt/mega-hair`, // Category page
    `${baseUrl}/pt/progressiva-brasileira`, // Category page
    `${baseUrl}/pt/sobre`, // About page
  ];
}

/**
 * Check overall indexing coverage
 */
async function checkIndexingCoverage(searchconsole, siteUrl) {
  try {
    log('\n📊 Indexing Coverage Summary:', 'cyan');

    // Note: This requires Search Console API v1
    // For detailed coverage, use Search Console web interface

    log('ℹ️  For detailed coverage report:', 'yellow');
    log('  Visit: https://search.google.com/search-console', 'reset');
    log('  Check: Coverage report', 'reset');

  } catch (error) {
    log(`Error checking coverage: ${error.message}`, 'red');
  }
}

/**
 * Main execution
 */
async function main() {
  log('🔍 Starting indexing status check...', 'bright');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jchairstudios62.xyz';

  try {
    const { auth, searchconsole } = getSearchConsoleClient();
    log('✅ Connected to Search Console API', 'green');

    // Check sitemaps
    await checkSitemaps(searchconsole, siteUrl);

    // Check important URLs
    const importantUrls = getImportantUrls(siteUrl);
    log(`\n🔍 Checking ${importantUrls.length} important URLs...`, 'cyan');

    for (const url of importantUrls) {
      await inspectUrl(searchconsole, siteUrl, url);
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Coverage summary
    await checkIndexingCoverage(searchconsole, siteUrl);

    log('\n✅ Indexing check complete!', 'green');

    // Recommendations
    log('\n💡 Recommendations:', 'cyan');
    log('  1. Submit sitemap regularly: npm run seo:submit', 'reset');
    log('  2. Monitor Search Console for indexing issues', 'reset');
    log('  3. Check robots.txt: /robots.txt', 'reset');
    log('  4. Verify canonical URLs are correct', 'reset');

  } catch (error) {
    log(`\n❌ Check failed: ${error.message}`, 'red');

    if (error.message.includes('credentials')) {
      log('\n💡 Setup Guide:', 'yellow');
      log('  Run: npm run seo:setup', 'reset');
      log('  Or check: /docs/SEO-MONITORING-SETUP.md', 'reset');
    }

    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { checkSitemaps, inspectUrl };
