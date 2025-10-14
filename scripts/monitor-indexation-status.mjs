#!/usr/bin/env node

/**
 * GOOGLE INDEXATION STATUS MONITOR
 * ===============================
 *
 * This script monitors and tracks the indexation status of all site URLs.
 * It checks every hour and logs progress.
 *
 * Features:
 * - Fetches current indexation status from Google
 * - Tracks changes over time
 * - Sends alerts when indexation improves
 * - Generates status reports
 * - Supports continuous monitoring mode
 *
 * Usage:
 *   node scripts/monitor-indexation-status.mjs
 *   node scripts/monitor-indexation-status.mjs --once
 *   node scripts/monitor-indexation-status.mjs --interval=3600000
 */

import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://jchairstudios62.xyz';
const SERVICE_ACCOUNT_FILE = path.join(__dirname, '..', 'google-service-account.json');
const OAUTH_CREDENTIALS_FILE = path.join(__dirname, '..', 'google-oauth-credentials.json');
const TOKEN_FILE = path.join(__dirname, '..', 'google-oauth-token.json');
const LOG_DIR = path.join(__dirname, '..', 'logs');
const STATUS_FILE = path.join(LOG_DIR, 'indexation-status.json');
const LOG_FILE = path.join(LOG_DIR, `monitoring-${new Date().toISOString().split('T')[0]}.log`);

// Default monitoring interval: 1 hour
const DEFAULT_INTERVAL = 3600000;

class IndexationMonitor {
  constructor() {
    this.searchConsole = null;
    this.auth = null;
    this.previousStatus = null;
    this.currentStatus = {
      timestamp: new Date().toISOString(),
      indexed: 0,
      notIndexed: 0,
      errors: 0,
      urls: {}
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
    await this.log('Authenticating with Google...');

    // Try Service Account first
    try {
      const serviceAccountExists = await fs.access(SERVICE_ACCOUNT_FILE).then(() => true).catch(() => false);

      if (serviceAccountExists) {
        const serviceAccount = JSON.parse(await fs.readFile(SERVICE_ACCOUNT_FILE, 'utf8'));

        this.auth = new google.auth.GoogleAuth({
          credentials: serviceAccount,
          scopes: ['https://www.googleapis.com/auth/webmasters']
        });

        this.searchConsole = google.searchconsole({ version: 'v1', auth: this.auth });
        await this.log('Service Account authentication successful!');
        return true;
      }
    } catch (error) {
      await this.log(`Service Account auth failed: ${error.message}`, 'warn');
    }

    // Try OAuth2
    try {
      const oauthExists = await fs.access(OAUTH_CREDENTIALS_FILE).then(() => true).catch(() => false);

      if (oauthExists) {
        const credentials = JSON.parse(await fs.readFile(OAUTH_CREDENTIALS_FILE, 'utf8'));
        const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
        const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        const tokenExists = await fs.access(TOKEN_FILE).then(() => true).catch(() => false);

        if (tokenExists) {
          const token = JSON.parse(await fs.readFile(TOKEN_FILE, 'utf8'));
          oauth2Client.setCredentials(token);

          this.auth = oauth2Client;
          this.searchConsole = google.searchconsole({ version: 'v1', auth: oauth2Client });

          await this.log('OAuth2 authentication successful!');
          return true;
        }
      }
    } catch (error) {
      await this.log(`OAuth2 auth failed: ${error.message}`, 'error');
    }

    await this.log('Authentication failed!', 'error');
    return false;
  }

  async loadPreviousStatus() {
    try {
      const statusExists = await fs.access(STATUS_FILE).then(() => true).catch(() => false);

      if (statusExists) {
        this.previousStatus = JSON.parse(await fs.readFile(STATUS_FILE, 'utf8'));
        await this.log('Loaded previous status');
      }
    } catch (error) {
      await this.log(`Failed to load previous status: ${error.message}`, 'warn');
    }
  }

  async saveStatus() {
    try {
      await fs.writeFile(STATUS_FILE, JSON.stringify(this.currentStatus, null, 2));
      await this.log('Status saved successfully');
    } catch (error) {
      await this.log(`Failed to save status: ${error.message}`, 'error');
    }
  }

  async fetchSitemapUrls() {
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

  async checkUrlStatus(url) {
    try {
      const response = await this.searchConsole.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: url,
          siteUrl: SITE_URL
        }
      });

      const verdict = response.data?.inspectionResult?.indexStatusResult?.verdict;
      const coverage = response.data?.inspectionResult?.indexStatusResult?.coverageState;

      return {
        url,
        indexed: verdict === 'PASS' || coverage === 'SUBMITTED_AND_INDEXED',
        verdict,
        coverage,
        lastCrawled: response.data?.inspectionResult?.indexStatusResult?.lastCrawlTime
      };
    } catch (error) {
      await this.log(`Error checking ${url}: ${error.message}`, 'error');
      return {
        url,
        indexed: false,
        error: error.message
      };
    }
  }

  async checkAllUrls() {
    await this.log('Checking indexation status for all URLs...');

    const urls = await this.fetchSitemapUrls();

    if (urls.length === 0) {
      await this.log('No URLs to check', 'warn');
      return;
    }

    this.currentStatus = {
      timestamp: new Date().toISOString(),
      indexed: 0,
      notIndexed: 0,
      errors: 0,
      urls: {}
    };

    for (const url of urls) {
      const status = await this.checkUrlStatus(url);

      this.currentStatus.urls[url] = status;

      if (status.error) {
        this.currentStatus.errors++;
      } else if (status.indexed) {
        this.currentStatus.indexed++;
      } else {
        this.currentStatus.notIndexed++;
      }

      // Small delay between checks
      await this.sleep(200);
    }

    await this.saveStatus();
  }

  async compareWithPrevious() {
    if (!this.previousStatus) {
      await this.log('No previous status to compare');
      return;
    }

    await this.log('\n' + '='.repeat(60));
    await this.log('INDEXATION PROGRESS');
    await this.log('='.repeat(60));

    const previousIndexed = this.previousStatus.indexed;
    const currentIndexed = this.currentStatus.indexed;
    const improvement = currentIndexed - previousIndexed;

    await this.log(`Previous indexed: ${previousIndexed}`);
    await this.log(`Current indexed: ${currentIndexed}`);
    await this.log(`Change: ${improvement >= 0 ? '+' : ''}${improvement}`);

    if (improvement > 0) {
      await this.log(`Great! ${improvement} new pages indexed!`, 'success');

      // Find newly indexed pages
      const newlyIndexed = [];
      for (const [url, status] of Object.entries(this.currentStatus.urls)) {
        const wasIndexed = this.previousStatus.urls[url]?.indexed;
        if (status.indexed && !wasIndexed) {
          newlyIndexed.push(url);
        }
      }

      if (newlyIndexed.length > 0) {
        await this.log('\nNewly indexed pages:');
        newlyIndexed.forEach(url => this.log(`  - ${url}`));
      }
    } else if (improvement < 0) {
      await this.log(`Warning: ${Math.abs(improvement)} pages no longer indexed`, 'warn');
    } else {
      await this.log('No change in indexation status');
    }

    await this.log('='.repeat(60));
  }

  async generateReport() {
    await this.log('\n' + '='.repeat(60));
    await this.log('CURRENT INDEXATION STATUS');
    await this.log('='.repeat(60));
    await this.log(`Timestamp: ${this.currentStatus.timestamp}`);
    await this.log(`Total URLs: ${Object.keys(this.currentStatus.urls).length}`);
    await this.log(`Indexed: ${this.currentStatus.indexed}`);
    await this.log(`Not Indexed: ${this.currentStatus.notIndexed}`);
    await this.log(`Errors: ${this.currentStatus.errors}`);

    if (this.currentStatus.indexed + this.currentStatus.notIndexed > 0) {
      const percentage = (this.currentStatus.indexed / (this.currentStatus.indexed + this.currentStatus.notIndexed) * 100).toFixed(2);
      await this.log(`Indexation Rate: ${percentage}%`);
    }

    await this.log('='.repeat(60));

    // Save detailed report
    const reportFile = path.join(LOG_DIR, `status-report-${new Date().toISOString().split('T')[0]}.json`);
    await fs.writeFile(reportFile, JSON.stringify(this.currentStatus, null, 2));
    await this.log(`Detailed report saved to: ${reportFile}`);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const onceMode = args.includes('--once');
  const intervalArg = args.find(arg => arg.startsWith('--interval='));
  const interval = intervalArg ? parseInt(intervalArg.split('=')[1]) : DEFAULT_INTERVAL;

  const monitor = new IndexationMonitor();

  console.log('\n GOOGLE INDEXATION STATUS MONITOR');
  console.log('===================================\n');

  const authenticated = await monitor.authenticate();
  if (!authenticated) {
    console.error('\n Authentication failed. Exiting...\n');
    process.exit(1);
  }

  async function runCheck() {
    await monitor.loadPreviousStatus();
    await monitor.checkAllUrls();
    await monitor.compareWithPrevious();
    await monitor.generateReport();
  }

  if (onceMode) {
    // Run once and exit
    await runCheck();
    console.log('\n Monitoring check completed!\n');
  } else {
    // Continuous monitoring
    console.log(`Starting continuous monitoring (checking every ${interval / 1000}s)...`);
    console.log('Press Ctrl+C to stop\n');

    // Run first check immediately
    await runCheck();

    // Then run on interval
    setInterval(async () => {
      await runCheck();
    }, interval);
  }
}

// Run
main().catch(error => {
  console.error('\n Fatal error:', error);
  process.exit(1);
});
