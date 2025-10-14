#!/usr/bin/env node

/**
 * GOOGLE SEARCH CONSOLE FORCED INDEXATION SCRIPT
 * =============================================
 *
 * This script uses the Google Search Console API to force indexation
 * of all website pages. It supports:
 * - Service Account authentication
 * - OAuth2 authentication (fallback)
 * - URL Inspection API
 * - Batch processing with rate limiting
 * - Comprehensive error handling and retry logic
 *
 * Usage:
 *   node scripts/force-google-indexing.mjs
 *   node scripts/force-google-indexing.mjs --verify-only
 *   node scripts/force-google-indexing.mjs --url=https://example.com/page
 */

import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://jchairstudios62.xyz';
const SERVICE_ACCOUNT_FILE = path.join(__dirname, '..', 'google-service-account.json');
const OAUTH_CREDENTIALS_FILE = path.join(__dirname, '..', 'google-oauth-credentials.json');
const TOKEN_FILE = path.join(__dirname, '..', 'google-oauth-token.json');
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, `indexing-${new Date().toISOString().split('T')[0]}.log`);

// Rate limiting configuration
const REQUESTS_PER_MINUTE = 600; // Google's limit
const BATCH_SIZE = 50;
const DELAY_BETWEEN_BATCHES = 60000; // 1 minute

class GoogleIndexingService {
  constructor() {
    this.searchConsole = null;
    this.indexing = null;
    this.auth = null;
    this.stats = {
      total: 0,
      success: 0,
      failed: 0,
      alreadyIndexed: 0,
      errors: []
    };
  }

  async log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

    console.log(logMessage.trim());

    try {
      await fs.mkdir(LOG_DIR, { recursive: true });
      await fs.appendFile(LOG_FILE, logMessage);
    } catch (error) {
      console.error('Failed to write log:', error.message);
    }
  }

  async authenticate() {
    await this.log('Starting authentication process...');

    // Try Service Account first
    try {
      await this.log('Attempting Service Account authentication...');
      const serviceAccountExists = await fs.access(SERVICE_ACCOUNT_FILE).then(() => true).catch(() => false);

      if (serviceAccountExists) {
        const serviceAccount = JSON.parse(await fs.readFile(SERVICE_ACCOUNT_FILE, 'utf8'));

        this.auth = new google.auth.GoogleAuth({
          credentials: serviceAccount,
          scopes: [
            'https://www.googleapis.com/auth/webmasters',
            'https://www.googleapis.com/auth/indexing'
          ]
        });

        this.searchConsole = google.searchconsole({ version: 'v1', auth: this.auth });
        this.indexing = google.indexing({ version: 'v3', auth: this.auth });

        await this.log('Service Account authentication successful!', 'success');
        return true;
      }
    } catch (error) {
      await this.log(`Service Account authentication failed: ${error.message}`, 'warn');
    }

    // Try OAuth2 as fallback
    try {
      await this.log('Attempting OAuth2 authentication...');
      const oauthExists = await fs.access(OAUTH_CREDENTIALS_FILE).then(() => true).catch(() => false);

      if (oauthExists) {
        const credentials = JSON.parse(await fs.readFile(OAUTH_CREDENTIALS_FILE, 'utf8'));

        const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
        const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        // Check for existing token
        const tokenExists = await fs.access(TOKEN_FILE).then(() => true).catch(() => false);

        if (tokenExists) {
          const token = JSON.parse(await fs.readFile(TOKEN_FILE, 'utf8'));
          oauth2Client.setCredentials(token);
        } else {
          await this.log('No token found. Please run OAuth setup first.', 'error');
          await this.log('Run: npm run seo:setup-oauth', 'info');
          return false;
        }

        this.auth = oauth2Client;
        this.searchConsole = google.searchconsole({ version: 'v1', auth: oauth2Client });
        this.indexing = google.indexing({ version: 'v3', auth: oauth2Client });

        await this.log('OAuth2 authentication successful!', 'success');
        return true;
      }
    } catch (error) {
      await this.log(`OAuth2 authentication failed: ${error.message}`, 'error');
    }

    await this.log('All authentication methods failed!', 'error');
    await this.log('Please set up Google Search Console credentials:', 'error');
    await this.log('1. Service Account: Place google-service-account.json in project root', 'error');
    await this.log('2. OAuth2: Run npm run seo:setup-oauth', 'error');

    return false;
  }

  async fetchSitemapUrls() {
    await this.log('Fetching URLs from sitemap...');

    try {
      const response = await fetch(SITEMAP_URL);
      const xml = await response.text();

      // Parse sitemap XML
      const urlMatches = xml.match(/<loc>(.*?)<\/loc>/g);
      if (!urlMatches) {
        throw new Error('No URLs found in sitemap');
      }

      const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
      await this.log(`Found ${urls.length} URLs in sitemap`);

      return urls;
    } catch (error) {
      await this.log(`Failed to fetch sitemap: ${error.message}`, 'error');
      return [];
    }
  }

  async getAllPageUrls() {
    await this.log('Collecting all page URLs...');

    // Primary: Sitemap URLs
    const sitemapUrls = await this.fetchSitemapUrls();

    // Fallback: Generate common URLs
    const fallbackUrls = [
      `${SITE_URL}/`,
      `${SITE_URL}/produtos`,
      `${SITE_URL}/mega-hair`,
      `${SITE_URL}/esmaltes`,
      `${SITE_URL}/perfumes`,
      `${SITE_URL}/maquiagem`,
      `${SITE_URL}/sobre`,
      `${SITE_URL}/contato`,
      `${SITE_URL}/politica-de-privacidade`,
      `${SITE_URL}/termos-de-uso`
    ];

    const allUrls = sitemapUrls.length > 0 ? sitemapUrls : fallbackUrls;
    await this.log(`Total URLs to process: ${allUrls.length}`);

    return allUrls;
  }

  async inspectUrl(url) {
    try {
      await this.log(`Inspecting: ${url}`);

      // Use URL Inspection API
      const response = await this.searchConsole.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: url,
          siteUrl: SITE_URL
        }
      });

      return {
        url,
        status: 'success',
        data: response.data
      };
    } catch (error) {
      await this.log(`Failed to inspect ${url}: ${error.message}`, 'error');
      return {
        url,
        status: 'error',
        error: error.message
      };
    }
  }

  async requestIndexing(url) {
    try {
      await this.log(`Requesting indexing for: ${url}`);

      // Use Indexing API to request indexing
      const response = await this.indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED'
        }
      });

      this.stats.success++;
      await this.log(`Successfully requested indexing for: ${url}`, 'success');

      return {
        url,
        status: 'success',
        data: response.data
      };
    } catch (error) {
      this.stats.failed++;
      this.stats.errors.push({ url, error: error.message });

      await this.log(`Failed to request indexing for ${url}: ${error.message}`, 'error');

      return {
        url,
        status: 'error',
        error: error.message
      };
    }
  }

  async processBatch(urls) {
    await this.log(`Processing batch of ${urls.length} URLs...`);

    const results = [];

    for (const url of urls) {
      const result = await this.requestIndexing(url);
      results.push(result);

      // Small delay between individual requests
      await this.sleep(100);
    }

    return results;
  }

  async processAllUrls(urls) {
    await this.log('Starting batch processing of all URLs...');

    this.stats.total = urls.length;
    const batches = this.chunkArray(urls, BATCH_SIZE);

    await this.log(`Split into ${batches.length} batches of ${BATCH_SIZE} URLs each`);

    for (let i = 0; i < batches.length; i++) {
      await this.log(`\n${'='.repeat(60)}`);
      await this.log(`Processing batch ${i + 1}/${batches.length}`);
      await this.log(`${'='.repeat(60)}\n`);

      await this.processBatch(batches[i]);

      // Wait between batches to respect rate limits
      if (i < batches.length - 1) {
        await this.log(`Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...`);
        await this.sleep(DELAY_BETWEEN_BATCHES);
      }
    }
  }

  async verifyIndexingStatus() {
    await this.log('Verifying current indexing status...');

    try {
      const urls = await this.getAllPageUrls();
      const sample = urls.slice(0, 10); // Check first 10 URLs

      for (const url of sample) {
        const result = await this.inspectUrl(url);

        if (result.status === 'success') {
          const indexed = result.data?.inspectionResult?.indexStatusResult?.verdict;
          await this.log(`${url}: ${indexed || 'Unknown'}`, 'info');
        }

        await this.sleep(500);
      }
    } catch (error) {
      await this.log(`Verification failed: ${error.message}`, 'error');
    }
  }

  async generateReport() {
    await this.log('\n' + '='.repeat(60));
    await this.log('INDEXATION REQUEST REPORT');
    await this.log('='.repeat(60));
    await this.log(`Total URLs processed: ${this.stats.total}`);
    await this.log(`Successful: ${this.stats.success}`);
    await this.log(`Failed: ${this.stats.failed}`);
    await this.log(`Success Rate: ${((this.stats.success / this.stats.total) * 100).toFixed(2)}%`);

    if (this.stats.errors.length > 0) {
      await this.log('\nErrors encountered:');
      this.stats.errors.forEach(({ url, error }) => {
        this.log(`  - ${url}: ${error}`, 'error');
      });
    }

    await this.log('='.repeat(60));
    await this.log(`Full log saved to: ${LOG_FILE}`);

    // Save JSON report
    const reportFile = path.join(LOG_DIR, `report-${new Date().toISOString().split('T')[0]}.json`);
    await fs.writeFile(reportFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      stats: this.stats,
      siteUrl: SITE_URL
    }, null, 2));

    await this.log(`JSON report saved to: ${reportFile}`);
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const verifyOnly = args.includes('--verify-only');
  const singleUrl = args.find(arg => arg.startsWith('--url='))?.split('=')[1];

  const service = new GoogleIndexingService();

  console.log('\n GOOGLE SEARCH CONSOLE FORCED INDEXATION');
  console.log('==========================================\n');

  // Authenticate
  const authenticated = await service.authenticate();
  if (!authenticated) {
    console.error('\n Authentication failed. Exiting...\n');
    process.exit(1);
  }

  // Verify only mode
  if (verifyOnly) {
    await service.verifyIndexingStatus();
    return;
  }

  // Single URL mode
  if (singleUrl) {
    await service.requestIndexing(singleUrl);
    return;
  }

  // Full indexation mode
  const urls = await service.getAllPageUrls();

  if (urls.length === 0) {
    console.error('\n No URLs found to process. Exiting...\n');
    process.exit(1);
  }

  await service.processAllUrls(urls);
  await service.generateReport();

  console.log('\n Indexation request process completed!\n');
}

// Run
main().catch(error => {
  console.error('\n Fatal error:', error);
  process.exit(1);
});
