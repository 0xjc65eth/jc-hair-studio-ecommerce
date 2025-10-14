#!/usr/bin/env node

/**
 * PUPPETEER GOOGLE SEARCH CONSOLE AUTOMATION
 * =========================================
 *
 * This script automates the Google Search Console UI to request indexing
 * for URLs when the API is not available or has restrictions.
 *
 * Features:
 * - Automated login to Google Search Console
 * - URL inspection tool automation
 * - Request indexing for multiple URLs
 * - Rate limiting and error handling
 * - Session persistence
 * - Headless/headed mode support
 *
 * Usage:
 *   node scripts/puppeteer-gsc-indexing.mjs
 *   node scripts/puppeteer-gsc-indexing.mjs --headed
 *   node scripts/puppeteer-gsc-indexing.mjs --url=https://example.com/page
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://jchairstudios62.xyz';
const GSC_URL = 'https://search.google.com/search-console';
const PROPERTY_URL = `${GSC_URL}?resource_id=sc-domain:jchairstudios62.xyz`;
const SESSION_FILE = path.join(__dirname, '..', 'gsc-session.json');
const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, `puppeteer-indexing-${new Date().toISOString().split('T')[0]}.log`);

// Configuration
const DELAY_BETWEEN_REQUESTS = 5000; // 5 seconds between each URL request
const MAX_RETRIES = 3;
const TIMEOUT = 60000; // 60 seconds

class PuppeteerGSCIndexer {
  constructor(options = {}) {
    this.browser = null;
    this.page = null;
    this.headless = options.headless !== false;
    this.stats = {
      total: 0,
      success: 0,
      failed: 0,
      skipped: 0,
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

  async init() {
    await this.log('Initializing Puppeteer browser...');

    this.browser = await puppeteer.launch({
      headless: this.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080'
      ]
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await this.log('Browser initialized successfully');
  }

  async loadSession() {
    try {
      const sessionExists = await fs.access(SESSION_FILE).then(() => true).catch(() => false);

      if (sessionExists) {
        await this.log('Loading saved session...');
        const cookies = JSON.parse(await fs.readFile(SESSION_FILE, 'utf8'));
        await this.page.setCookie(...cookies);
        await this.log('Session loaded successfully');
        return true;
      }
    } catch (error) {
      await this.log(`Failed to load session: ${error.message}`, 'warn');
    }

    return false;
  }

  async saveSession() {
    try {
      const cookies = await this.page.cookies();
      await fs.writeFile(SESSION_FILE, JSON.stringify(cookies, null, 2));
      await this.log('Session saved successfully');
    } catch (error) {
      await this.log(`Failed to save session: ${error.message}`, 'error');
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login() {
    await this.log('Starting Google login process...');
    await this.log('IMPORTANT: You will need to manually complete the login process');
    await this.log('Please log in when the browser window appears...');

    try {
      // Navigate to GSC
      await this.page.goto(GSC_URL, { waitUntil: 'networkidle2', timeout: TIMEOUT });

      // Wait for either login page or GSC dashboard
      await this.sleep(3000);

      const currentUrl = this.page.url();

      if (currentUrl.includes('accounts.google.com')) {
        await this.log('Login required. Waiting for manual login...');
        await this.log('Please complete the login process in the browser window');

        // Wait for navigation away from login page (max 5 minutes)
        await this.page.waitForFunction(
          () => !window.location.href.includes('accounts.google.com'),
          { timeout: 300000 }
        );

        await this.log('Login detected! Continuing...');
      }

      // Save session for future use
      await this.saveSession();

      await this.log('Login successful!');
      return true;
    } catch (error) {
      await this.log(`Login failed: ${error.message}`, 'error');
      return false;
    }
  }

  async navigateToProperty() {
    await this.log('Navigating to property...');

    try {
      await this.page.goto(PROPERTY_URL, { waitUntil: 'networkidle2', timeout: TIMEOUT });
      await this.sleep(2000);
      await this.log('Property loaded successfully');
      return true;
    } catch (error) {
      await this.log(`Failed to navigate to property: ${error.message}`, 'error');
      return false;
    }
  }

  async requestIndexingForUrl(url, retryCount = 0) {
    try {
      await this.log(`Requesting indexing for: ${url}`);

      // Navigate to URL Inspection tool
      const inspectionUrl = `${GSC_URL}/inspect?resource_id=sc-domain:jchairstudios62.xyz&id=${encodeURIComponent(url)}`;
      await this.page.goto(inspectionUrl, { waitUntil: 'networkidle2', timeout: TIMEOUT });

      // Wait for page to load
      await this.sleep(5000);

      // Look for "Request Indexing" button
      const requestIndexingButton = await this.findRequestIndexingButton();

      if (requestIndexingButton) {
        await this.log('Found "Request Indexing" button, clicking...');
        await requestIndexingButton.click();
        await this.sleep(2000);

        // Confirm the request if there's a confirmation dialog
        try {
          const confirmButton = await this.page.$('button[jsname="LgbsSe"]');
          if (confirmButton) {
            await confirmButton.click();
            await this.sleep(2000);
          }
        } catch (err) {
          // No confirmation needed
        }

        this.stats.success++;
        await this.log(`Successfully requested indexing for: ${url}`, 'success');
        return { url, status: 'success' };

      } else {
        // Check if already indexed or in queue
        const pageText = await this.page.evaluate(() => document.body.innerText);

        if (pageText.includes('URL is on Google') || pageText.includes('indexed')) {
          await this.log(`URL already indexed: ${url}`, 'info');
          this.stats.skipped++;
          return { url, status: 'already_indexed' };
        }

        if (pageText.includes('Indexing requested') || pageText.includes('in queue')) {
          await this.log(`Indexing already requested: ${url}`, 'info');
          this.stats.skipped++;
          return { url, status: 'already_requested' };
        }

        throw new Error('Could not find request indexing button and URL not already indexed');
      }

    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        await this.log(`Retrying (${retryCount + 1}/${MAX_RETRIES})...`, 'warn');
        await this.sleep(3000);
        return this.requestIndexingForUrl(url, retryCount + 1);
      }

      this.stats.failed++;
      this.stats.errors.push({ url, error: error.message });
      await this.log(`Failed to request indexing for ${url}: ${error.message}`, 'error');
      return { url, status: 'error', error: error.message };
    }
  }

  async findRequestIndexingButton() {
    // Try multiple selectors for the request indexing button
    const selectors = [
      'button:has-text("Request indexing")',
      'button:has-text("REQUEST INDEXING")',
      'button[aria-label*="Request indexing"]',
      'text=Request indexing >> button'
    ];

    for (const selector of selectors) {
      try {
        const button = await this.page.$(selector);
        if (button) return button;
      } catch (err) {
        // Try next selector
      }
    }

    // Fallback: search by text content
    try {
      const buttons = await this.page.$$('button');
      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent);
        if (text && text.toLowerCase().includes('request indexing')) {
          return button;
        }
      }
    } catch (err) {
      // Button not found
    }

    return null;
  }

  async processUrls(urls) {
    await this.log(`Starting to process ${urls.length} URLs...`);
    this.stats.total = urls.length;

    const results = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];

      await this.log(`\nProcessing ${i + 1}/${urls.length}: ${url}`);

      const result = await this.requestIndexingForUrl(url);
      results.push(result);

      // Delay between requests to avoid rate limiting
      if (i < urls.length - 1) {
        await this.log(`Waiting ${DELAY_BETWEEN_REQUESTS / 1000}s before next request...`);
        await this.sleep(DELAY_BETWEEN_REQUESTS);
      }
    }

    return results;
  }

  async fetchSitemapUrls() {
    await this.log('Fetching URLs from sitemap...');

    try {
      const response = await fetch(`${SITE_URL}/sitemap.xml`);
      const xml = await response.text();

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

  async generateReport() {
    await this.log('\n' + '='.repeat(60));
    await this.log('PUPPETEER INDEXATION REPORT');
    await this.log('='.repeat(60));
    await this.log(`Total URLs processed: ${this.stats.total}`);
    await this.log(`Successful: ${this.stats.success}`);
    await this.log(`Skipped (already indexed): ${this.stats.skipped}`);
    await this.log(`Failed: ${this.stats.failed}`);

    if (this.stats.total > 0) {
      await this.log(`Success Rate: ${((this.stats.success / this.stats.total) * 100).toFixed(2)}%`);
    }

    if (this.stats.errors.length > 0) {
      await this.log('\nErrors encountered:');
      this.stats.errors.forEach(({ url, error }) => {
        this.log(`  - ${url}: ${error}`, 'error');
      });
    }

    await this.log('='.repeat(60));
    await this.log(`Full log saved to: ${LOG_FILE}`);

    // Save JSON report
    const reportFile = path.join(LOG_DIR, `puppeteer-report-${new Date().toISOString().split('T')[0]}.json`);
    await fs.writeFile(reportFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      stats: this.stats,
      siteUrl: SITE_URL
    }, null, 2));

    await this.log(`JSON report saved to: ${reportFile}`);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      await this.log('Browser closed');
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const headed = args.includes('--headed');
  const singleUrl = args.find(arg => arg.startsWith('--url='))?.split('=')[1];

  const indexer = new PuppeteerGSCIndexer({ headless: !headed });

  console.log('\n PUPPETEER GOOGLE SEARCH CONSOLE INDEXATION');
  console.log('=============================================\n');

  try {
    // Initialize browser
    await indexer.init();

    // Try to load saved session
    const sessionLoaded = await indexer.loadSession();

    if (!sessionLoaded) {
      // Manual login required
      const loginSuccess = await indexer.login();
      if (!loginSuccess) {
        throw new Error('Login failed');
      }
    } else {
      // Verify session is still valid
      await indexer.navigateToProperty();

      const currentUrl = indexer.page.url();
      if (currentUrl.includes('accounts.google.com')) {
        await indexer.log('Session expired, logging in again...', 'warn');
        const loginSuccess = await indexer.login();
        if (!loginSuccess) {
          throw new Error('Login failed');
        }
      }
    }

    // Single URL mode
    if (singleUrl) {
      await indexer.requestIndexingForUrl(singleUrl);
    } else {
      // Fetch all URLs from sitemap
      const urls = await indexer.fetchSitemapUrls();

      if (urls.length === 0) {
        throw new Error('No URLs found to process');
      }

      // Process all URLs
      await indexer.processUrls(urls);
    }

    // Generate report
    await indexer.generateReport();

    console.log('\n Indexation process completed!\n');

  } catch (error) {
    console.error('\n Fatal error:', error.message);
    await indexer.log(`Fatal error: ${error.message}`, 'error');
  } finally {
    await indexer.close();
  }
}

// Run
main().catch(error => {
  console.error('\n Unexpected error:', error);
  process.exit(1);
});
