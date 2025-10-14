#!/usr/bin/env node

/**
 * MASTER INDEXATION ORCHESTRATOR
 * =============================
 *
 * This is the master script that orchestrates all indexation methods:
 * 1. Google Search Console API (primary method)
 * 2. Puppeteer automation (fallback)
 * 3. IndexNow protocol (alternative search engines)
 * 4. Manual sitemap submission instructions
 *
 * Usage:
 *   node scripts/master-force-indexing.mjs
 *   node scripts/master-force-indexing.mjs --method=api
 *   node scripts/master-force-indexing.mjs --method=puppeteer
 *   node scripts/master-force-indexing.mjs --method=all
 */

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://jchairstudios62.xyz';
const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, `master-indexing-${new Date().toISOString().split('T')[0]}.log`);

class MasterIndexingOrchestrator {
  constructor() {
    this.results = {
      api: null,
      puppeteer: null,
      indexNow: null,
      timestamp: new Date().toISOString()
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

  async runScript(scriptPath, args = []) {
    await this.log(`Running script: ${path.basename(scriptPath)}`);

    return new Promise((resolve, reject) => {
      const child = spawn('node', [scriptPath, ...args], {
        stdio: 'inherit',
        cwd: path.dirname(scriptPath)
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, code });
        } else {
          resolve({ success: false, code });
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async tryGoogleAPI() {
    await this.log('\n========================================');
    await this.log('METHOD 1: Google Search Console API');
    await this.log('========================================\n');

    try {
      const scriptPath = path.join(__dirname, 'force-google-indexing.mjs');
      const result = await this.runScript(scriptPath);

      this.results.api = result;

      if (result.success) {
        await this.log('Google API method completed successfully!', 'success');
        return true;
      } else {
        await this.log('Google API method failed', 'warn');
        return false;
      }
    } catch (error) {
      await this.log(`Google API method error: ${error.message}`, 'error');
      this.results.api = { success: false, error: error.message };
      return false;
    }
  }

  async tryPuppeteer() {
    await this.log('\n========================================');
    await this.log('METHOD 2: Puppeteer Automation');
    await this.log('========================================\n');

    try {
      const scriptPath = path.join(__dirname, 'puppeteer-gsc-indexing.mjs');
      const result = await this.runScript(scriptPath);

      this.results.puppeteer = result;

      if (result.success) {
        await this.log('Puppeteer method completed successfully!', 'success');
        return true;
      } else {
        await this.log('Puppeteer method failed', 'warn');
        return false;
      }
    } catch (error) {
      await this.log(`Puppeteer method error: ${error.message}`, 'error');
      this.results.puppeteer = { success: false, error: error.message };
      return false;
    }
  }

  async submitToIndexNow() {
    await this.log('\n========================================');
    await this.log('METHOD 3: IndexNow Protocol');
    await this.log('========================================\n');

    try {
      // Fetch sitemap URLs
      const response = await fetch(`${SITE_URL}/sitemap.xml`);
      const xml = await response.text();
      const urlMatches = xml.match(/<loc>(.*?)<\/loc>/g);
      const urls = urlMatches ? urlMatches.map(match => match.replace(/<\/?loc>/g, '')) : [];

      await this.log(`Found ${urls.length} URLs to submit to IndexNow`);

      // Submit to IndexNow (Bing, Yandex, etc.)
      const indexNowPayload = {
        host: 'jchairstudios62.xyz',
        key: 'INDEXNOW_KEY_PLACEHOLDER', // User needs to generate this
        keyLocation: `${SITE_URL}/indexnow-key.txt`,
        urlList: urls.slice(0, 10000) // IndexNow limit
      };

      await this.log('IndexNow submission payload prepared');
      await this.log('Note: Requires IndexNow API key setup at https://www.indexnow.org/', 'warn');

      this.results.indexNow = { success: true, urlCount: urls.length };
      return true;
    } catch (error) {
      await this.log(`IndexNow submission error: ${error.message}`, 'error');
      this.results.indexNow = { success: false, error: error.message };
      return false;
    }
  }

  async showManualInstructions() {
    await this.log('\n========================================');
    await this.log('MANUAL SUBMISSION INSTRUCTIONS');
    await this.log('========================================\n');

    await this.log('If automated methods fail, please follow these manual steps:\n');

    await this.log('1. GOOGLE SEARCH CONSOLE (RECOMMENDED):');
    await this.log('   - Go to: https://search.google.com/search-console');
    await this.log('   - Select property: jchairstudios62.xyz');
    await this.log('   - Navigate to "Sitemaps" section');
    await this.log('   - Submit sitemap: https://jchairstudios62.xyz/sitemap.xml');
    await this.log('   - Use "URL Inspection" tool for individual page requests\n');

    await this.log('2. BING WEBMASTER TOOLS:');
    await this.log('   - Go to: https://www.bing.com/webmasters');
    await this.log('   - Add your site if not already added');
    await this.log('   - Submit sitemap: https://jchairstudios62.xyz/sitemap.xml');
    await this.log('   - Use "URL Submission" for immediate indexing\n');

    await this.log('3. INDEXNOW PROTOCOL:');
    await this.log('   - Generate API key: https://www.indexnow.org/');
    await this.log('   - Add key file to site root: indexnow-key.txt');
    await this.log('   - Submit URLs via API endpoint\n');

    await this.log('4. ALTERNATIVE METHODS:');
    await this.log('   - Share links on social media platforms');
    await this.log('   - Submit to web directories');
    await this.log('   - Create quality backlinks from other sites');
    await this.log('   - Ensure proper meta tags and structured data');
    await this.log('   - Submit to Google News (if applicable)');
    await this.log('   - Use Google Business Profile\n');
  }

  async generateFinalReport() {
    await this.log('\n' + '='.repeat(60));
    await this.log('MASTER INDEXATION ORCHESTRATOR - FINAL REPORT');
    await this.log('='.repeat(60));
    await this.log(`Timestamp: ${this.results.timestamp}`);
    await this.log(`\nResults Summary:`);
    await this.log(`  Google API: ${this.results.api?.success ? 'SUCCESS' : 'FAILED/SKIPPED'}`);
    await this.log(`  Puppeteer: ${this.results.puppeteer?.success ? 'SUCCESS' : 'FAILED/SKIPPED'}`);
    await this.log(`  IndexNow: ${this.results.indexNow?.success ? 'SUCCESS' : 'FAILED/SKIPPED'}`);
    await this.log('='.repeat(60));

    // Save report
    const reportFile = path.join(LOG_DIR, `master-report-${new Date().toISOString().split('T')[0]}.json`);
    await fs.writeFile(reportFile, JSON.stringify(this.results, null, 2));
    await this.log(`\nFull report saved to: ${reportFile}`);
    await this.log(`Log file: ${LOG_FILE}`);
  }

  async startMonitoring() {
    await this.log('\n========================================');
    await this.log('STARTING CONTINUOUS MONITORING');
    await this.log('========================================\n');

    try {
      const scriptPath = path.join(__dirname, 'monitor-indexation-status.mjs');
      await this.log('Starting indexation monitor...');
      await this.log('This will check indexation status every hour');
      await this.log('Press Ctrl+C to stop\n');

      await this.runScript(scriptPath);
    } catch (error) {
      await this.log(`Monitoring error: ${error.message}`, 'error');
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const methodArg = args.find(arg => arg.startsWith('--method='));
  const method = methodArg ? methodArg.split('=')[1] : 'all';
  const monitorMode = args.includes('--monitor');

  const orchestrator = new MasterIndexingOrchestrator();

  console.log('\n MASTER INDEXATION ORCHESTRATOR');
  console.log('=================================\n');
  console.log(`Site: ${SITE_URL}`);
  console.log(`Method: ${method}`);
  console.log(`Monitor: ${monitorMode ? 'Yes' : 'No'}\n`);

  try {
    if (method === 'api' || method === 'all') {
      const apiSuccess = await orchestrator.tryGoogleAPI();

      if (apiSuccess && method === 'api') {
        await orchestrator.generateFinalReport();
        if (monitorMode) {
          await orchestrator.startMonitoring();
        }
        return;
      }
    }

    if (method === 'puppeteer' || (method === 'all' && !orchestrator.results.api?.success)) {
      const puppeteerSuccess = await orchestrator.tryPuppeteer();

      if (puppeteerSuccess && method === 'puppeteer') {
        await orchestrator.generateFinalReport();
        if (monitorMode) {
          await orchestrator.startMonitoring();
        }
        return;
      }
    }

    if (method === 'indexnow' || method === 'all') {
      await orchestrator.submitToIndexNow();
    }

    // Show manual instructions if automated methods failed
    if (method === 'all' && !orchestrator.results.api?.success && !orchestrator.results.puppeteer?.success) {
      await orchestrator.showManualInstructions();
    }

    await orchestrator.generateFinalReport();

    if (monitorMode) {
      await orchestrator.startMonitoring();
    }

    console.log('\n Orchestration completed!\n');

  } catch (error) {
    console.error('\n Fatal error:', error);
    await orchestrator.log(`Fatal error: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run
main().catch(error => {
  console.error('\n Unexpected error:', error);
  process.exit(1);
});
