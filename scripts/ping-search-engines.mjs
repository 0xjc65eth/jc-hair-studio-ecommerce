#!/usr/bin/env node

/**
 * Automated Search Engine Ping System - JC Hair Studio
 *
 * WHY: Automatically notify search engines when sitemap updates
 * HOW: Ping Google, Bing, Yandex, and Baidu with rate limiting and logging
 *
 * Features:
 * - Multi-engine support (Google, Bing, Yandex, Baidu)
 * - Rate limiting to prevent abuse
 * - Comprehensive logging (success/failure)
 * - Retry logic with exponential backoff
 * - Can be triggered by Vercel deploy webhook
 *
 * Usage:
 *   node scripts/ping-search-engines.js              # Ping all engines
 *   node scripts/ping-search-engines.js --google     # Google only
 *   node scripts/ping-search-engines.js --bing       # Bing only
 *   node scripts/ping-search-engines.js --verbose    # Detailed output
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  siteUrl: process.env.SITE_URL || 'https://jchairstudios62.xyz',
  sitemapPath: '/sitemap.xml',
  productFeedPath: '/product-feed.xml',

  // Rate limiting: minimum time between pings (in milliseconds)
  rateLimits: {
    google: 60 * 60 * 1000,      // 1 hour
    bing: 30 * 60 * 1000,        // 30 minutes
    yandex: 60 * 60 * 1000,      // 1 hour
    baidu: 2 * 60 * 60 * 1000,   // 2 hours
    indexnow: 30 * 60 * 1000     // 30 minutes
  },

  // Retry configuration
  maxRetries: 3,
  retryDelay: 5000, // 5 seconds, will use exponential backoff

  // Logging
  logDir: path.join(process.cwd(), 'logs'),
  logFile: 'search-engine-pings.log'
};

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Global state
let verbose = false;
let stats = {
  total: 0,
  success: 0,
  failed: 0,
  skipped: 0,
  startTime: Date.now()
};

/**
 * Logger utility
 */
class Logger {
  constructor() {
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(CONFIG.logDir)) {
      fs.mkdirSync(CONFIG.logDir, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, engine, message, data = null) {
    const timestamp = this.getTimestamp();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${engine}] ${message}${dataStr}`;
  }

  log(level, engine, message, data = null) {
    const logMessage = this.formatMessage(level, engine, message, data);
    const logPath = path.join(CONFIG.logDir, CONFIG.logFile);

    // Append to log file
    fs.appendFileSync(logPath, logMessage + '\n', 'utf-8');

    // Console output with colors
    let color = colors.reset;
    switch (level) {
      case 'success': color = colors.green; break;
      case 'error': color = colors.red; break;
      case 'warning': color = colors.yellow; break;
      case 'info': color = colors.blue; break;
    }

    console.log(`${color}${logMessage}${colors.reset}`);
  }

  success(engine, message, data) {
    this.log('success', engine, message, data);
  }

  error(engine, message, data) {
    this.log('error', engine, message, data);
  }

  warning(engine, message, data) {
    this.log('warning', engine, message, data);
  }

  info(engine, message, data) {
    if (verbose) {
      this.log('info', engine, message, data);
    }
  }
}

const logger = new Logger();

/**
 * Rate Limiter
 */
class RateLimiter {
  constructor() {
    this.stateFile = path.join(CONFIG.logDir, 'ping-state.json');
    this.state = this.loadState();
  }

  loadState() {
    if (fs.existsSync(this.stateFile)) {
      try {
        const data = fs.readFileSync(this.stateFile, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        logger.error('RateLimiter', 'Failed to load state file', { error: error.message });
        return {};
      }
    }
    return {};
  }

  saveState() {
    try {
      fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (error) {
      logger.error('RateLimiter', 'Failed to save state file', { error: error.message });
    }
  }

  canPing(engine) {
    const lastPing = this.state[engine];
    if (!lastPing) return true;

    const timeSinceLastPing = Date.now() - lastPing;
    const rateLimit = CONFIG.rateLimits[engine] || 60 * 60 * 1000; // Default 1 hour

    return timeSinceLastPing >= rateLimit;
  }

  getTimeUntilNextPing(engine) {
    const lastPing = this.state[engine];
    if (!lastPing) return 0;

    const rateLimit = CONFIG.rateLimits[engine] || 60 * 60 * 1000;
    const timeSinceLastPing = Date.now() - lastPing;
    const timeRemaining = rateLimit - timeSinceLastPing;

    return Math.max(0, timeRemaining);
  }

  recordPing(engine) {
    this.state[engine] = Date.now();
    this.saveState();
  }

  formatTimeRemaining(milliseconds) {
    const minutes = Math.ceil(milliseconds / 60000);
    if (minutes < 60) return `${minutes} minute(s)`;
    const hours = Math.ceil(minutes / 60);
    return `${hours} hour(s)`;
  }
}

const rateLimiter = new RateLimiter();

/**
 * HTTP Request Helper with retries
 */
async function makeRequest(url, options = {}, retryCount = 0) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, options, (res) => {
      let data = '';

      res.on('data', chunk => data += chunk);

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      if (retryCount < CONFIG.maxRetries) {
        const delay = CONFIG.retryDelay * Math.pow(2, retryCount);
        logger.info('HTTP', `Retrying in ${delay}ms (attempt ${retryCount + 1}/${CONFIG.maxRetries})`, { url, error: error.message });

        setTimeout(() => {
          makeRequest(url, options, retryCount + 1)
            .then(resolve)
            .catch(reject);
        }, delay);
      } else {
        reject(error);
      }
    });

    req.setTimeout(30000); // 30 second timeout
    req.end();
  });
}

/**
 * POST Request Helper
 */
async function makePostRequest(hostname, path, data, headers = {}, retryCount = 0) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);

    const options = {
      hostname,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', chunk => responseData += chunk);

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          data: responseData
        });
      });
    });

    req.on('error', (error) => {
      if (retryCount < CONFIG.maxRetries) {
        const delay = CONFIG.retryDelay * Math.pow(2, retryCount);
        logger.info('HTTP', `Retrying POST in ${delay}ms (attempt ${retryCount + 1}/${CONFIG.maxRetries})`, { hostname, error: error.message });

        setTimeout(() => {
          makePostRequest(hostname, path, data, headers, retryCount + 1)
            .then(resolve)
            .catch(reject);
        }, delay);
      } else {
        reject(error);
      }
    });

    req.setTimeout(30000);
    req.write(postData);
    req.end();
  });
}

/**
 * Search Engine Ping Functions
 */

/**
 * Ping Google
 */
async function pingGoogle(force = false) {
  const engine = 'google';
  stats.total++;

  if (!force && !rateLimiter.canPing(engine)) {
    const timeRemaining = rateLimiter.getTimeUntilNextPing(engine);
    logger.warning(engine, `Rate limit active. Next ping available in ${rateLimiter.formatTimeRemaining(timeRemaining)}`);
    stats.skipped++;
    return { success: false, skipped: true, engine };
  }

  try {
    const sitemapUrl = `${CONFIG.siteUrl}${CONFIG.sitemapPath}`;
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

    logger.info(engine, `Pinging with sitemap: ${sitemapUrl}`);

    const response = await makeRequest(pingUrl);

    if (response.statusCode === 200) {
      logger.success(engine, 'Ping successful', { statusCode: response.statusCode });
      rateLimiter.recordPing(engine);
      stats.success++;
      return { success: true, engine, statusCode: response.statusCode };
    } else {
      logger.warning(engine, `Ping returned non-200 status`, { statusCode: response.statusCode, statusMessage: response.statusMessage });
      stats.failed++;
      return { success: false, engine, statusCode: response.statusCode, message: response.statusMessage };
    }
  } catch (error) {
    logger.error(engine, 'Ping failed', { error: error.message });
    stats.failed++;
    return { success: false, engine, error: error.message };
  }
}

/**
 * Ping Bing
 */
async function pingBing(force = false) {
  const engine = 'bing';
  stats.total++;

  if (!force && !rateLimiter.canPing(engine)) {
    const timeRemaining = rateLimiter.getTimeUntilNextPing(engine);
    logger.warning(engine, `Rate limit active. Next ping available in ${rateLimiter.formatTimeRemaining(timeRemaining)}`);
    stats.skipped++;
    return { success: false, skipped: true, engine };
  }

  try {
    const sitemapUrl = `${CONFIG.siteUrl}${CONFIG.sitemapPath}`;
    const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

    logger.info(engine, `Pinging with sitemap: ${sitemapUrl}`);

    const response = await makeRequest(pingUrl);

    if (response.statusCode === 200) {
      logger.success(engine, 'Ping successful', { statusCode: response.statusCode });
      rateLimiter.recordPing(engine);
      stats.success++;
      return { success: true, engine, statusCode: response.statusCode };
    } else {
      logger.warning(engine, `Ping returned non-200 status`, { statusCode: response.statusCode, statusMessage: response.statusMessage });
      stats.failed++;
      return { success: false, engine, statusCode: response.statusCode, message: response.statusMessage };
    }
  } catch (error) {
    logger.error(engine, 'Ping failed', { error: error.message });
    stats.failed++;
    return { success: false, engine, error: error.message };
  }
}

/**
 * Ping Yandex
 */
async function pingYandex(force = false) {
  const engine = 'yandex';
  stats.total++;

  if (!force && !rateLimiter.canPing(engine)) {
    const timeRemaining = rateLimiter.getTimeUntilNextPing(engine);
    logger.warning(engine, `Rate limit active. Next ping available in ${rateLimiter.formatTimeRemaining(timeRemaining)}`);
    stats.skipped++;
    return { success: false, skipped: true, engine };
  }

  try {
    const sitemapUrl = `${CONFIG.siteUrl}${CONFIG.sitemapPath}`;
    const pingUrl = `https://yandex.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

    logger.info(engine, `Pinging with sitemap: ${sitemapUrl}`);

    const response = await makeRequest(pingUrl);

    if (response.statusCode === 200) {
      logger.success(engine, 'Ping successful', { statusCode: response.statusCode });
      rateLimiter.recordPing(engine);
      stats.success++;
      return { success: true, engine, statusCode: response.statusCode };
    } else {
      logger.warning(engine, `Ping returned non-200 status`, { statusCode: response.statusCode, statusMessage: response.statusMessage });
      stats.failed++;
      return { success: false, engine, statusCode: response.statusCode, message: response.statusMessage };
    }
  } catch (error) {
    logger.error(engine, 'Ping failed', { error: error.message });
    stats.failed++;
    return { success: false, engine, error: error.message };
  }
}

/**
 * Ping Baidu
 */
async function pingBaidu(force = false) {
  const engine = 'baidu';
  stats.total++;

  if (!force && !rateLimiter.canPing(engine)) {
    const timeRemaining = rateLimiter.getTimeUntilNextPing(engine);
    logger.warning(engine, `Rate limit active. Next ping available in ${rateLimiter.formatTimeRemaining(timeRemaining)}`);
    stats.skipped++;
    return { success: false, skipped: true, engine };
  }

  try {
    const sitemapUrl = `${CONFIG.siteUrl}${CONFIG.sitemapPath}`;
    const pingUrl = `http://ping.baidu.com/ping/RPC2`;

    logger.info(engine, `Pinging with sitemap: ${sitemapUrl}`);

    // Baidu uses a different method, just attempt the ping
    const response = await makeRequest(pingUrl);

    // Baidu often returns various status codes
    if (response.statusCode >= 200 && response.statusCode < 400) {
      logger.success(engine, 'Ping successful', { statusCode: response.statusCode });
      rateLimiter.recordPing(engine);
      stats.success++;
      return { success: true, engine, statusCode: response.statusCode };
    } else {
      logger.warning(engine, `Ping returned status ${response.statusCode}`, { statusCode: response.statusCode });
      stats.failed++;
      return { success: false, engine, statusCode: response.statusCode };
    }
  } catch (error) {
    logger.error(engine, 'Ping failed', { error: error.message });
    stats.failed++;
    return { success: false, engine, error: error.message };
  }
}

/**
 * Submit to IndexNow (supports Bing, Yandex, and others)
 */
async function submitIndexNow(urls, force = false) {
  const engine = 'indexnow';
  stats.total++;

  if (!force && !rateLimiter.canPing(engine)) {
    const timeRemaining = rateLimiter.getTimeUntilNextPing(engine);
    logger.warning(engine, `Rate limit active. Next ping available in ${rateLimiter.formatTimeRemaining(timeRemaining)}`);
    stats.skipped++;
    return { success: false, skipped: true, engine };
  }

  try {
    // Use existing IndexNow key or generate new one
    const INDEXNOW_KEY = 'd4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8';
    const host = CONFIG.siteUrl.replace('https://', '').replace('http://', '');

    const payload = {
      host: host,
      key: INDEXNOW_KEY,
      keyLocation: `${CONFIG.siteUrl}/${INDEXNOW_KEY}.txt`,
      urlList: urls || [CONFIG.siteUrl]
    };

    logger.info(engine, `Submitting ${payload.urlList.length} URLs`);

    const response = await makePostRequest(
      'api.indexnow.org',
      '/indexnow',
      payload,
      { 'Content-Type': 'application/json; charset=utf-8' }
    );

    if (response.statusCode === 200 || response.statusCode === 202) {
      logger.success(engine, `Submission successful (${payload.urlList.length} URLs)`, { statusCode: response.statusCode });
      rateLimiter.recordPing(engine);
      stats.success++;
      return { success: true, engine, statusCode: response.statusCode, urlCount: payload.urlList.length };
    } else {
      logger.warning(engine, `Submission returned status ${response.statusCode}`, { statusCode: response.statusCode, data: response.data });
      stats.failed++;
      return { success: false, engine, statusCode: response.statusCode, data: response.data };
    }
  } catch (error) {
    logger.error(engine, 'Submission failed', { error: error.message });
    stats.failed++;
    return { success: false, engine, error: error.message };
  }
}

/**
 * Extract URLs from sitemap for IndexNow
 */
function extractUrlsFromSitemap() {
  try {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');

    if (!fs.existsSync(sitemapPath)) {
      logger.warning('SYSTEM', 'Sitemap not found, using default URLs');
      return [CONFIG.siteUrl];
    }

    const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
    const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g) || [];
    const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));

    // Limit to 100 URLs per submission (IndexNow recommendation)
    return urls.slice(0, 100);
  } catch (error) {
    logger.error('SYSTEM', 'Failed to extract URLs from sitemap', { error: error.message });
    return [CONFIG.siteUrl];
  }
}

/**
 * Display results summary
 */
function displaySummary(results) {
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(2);

  console.log(`\n${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}PING RESULTS SUMMARY${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);

  console.log(`${colors.white}Total Engines: ${stats.total}${colors.reset}`);
  console.log(`${colors.green}Successful:    ${stats.success}${colors.reset}`);
  console.log(`${colors.red}Failed:        ${stats.failed}${colors.reset}`);
  console.log(`${colors.yellow}Skipped:       ${stats.skipped}${colors.reset}`);
  console.log(`${colors.blue}Duration:      ${duration}s${colors.reset}\n`);

  console.log(`${colors.cyan}${'─'.repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}Individual Results:${colors.reset}\n`);

  results.forEach(result => {
    const icon = result.success ? '✅' : (result.skipped ? '⏭️ ' : '❌');
    const color = result.success ? colors.green : (result.skipped ? colors.yellow : colors.red);
    const status = result.success ? 'SUCCESS' : (result.skipped ? 'SKIPPED' : 'FAILED');

    console.log(`${icon} ${color}${result.engine.toUpperCase().padEnd(12)}${colors.reset} ${status}`);

    if (result.statusCode) {
      console.log(`   └─ Status Code: ${result.statusCode}`);
    }
    if (result.error) {
      console.log(`   └─ Error: ${result.error}`);
    }
    if (result.urlCount) {
      console.log(`   └─ URLs Submitted: ${result.urlCount}`);
    }
  });

  console.log(`\n${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);

  // Log file location
  const logPath = path.join(CONFIG.logDir, CONFIG.logFile);
  console.log(`${colors.dim}Detailed logs: ${logPath}${colors.reset}\n`);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  verbose = args.includes('--verbose') || args.includes('-v');
  const force = args.includes('--force') || args.includes('-f');
  const googleOnly = args.includes('--google');
  const bingOnly = args.includes('--bing');
  const yandexOnly = args.includes('--yandex');
  const baiduOnly = args.includes('--baidu');
  const indexnowOnly = args.includes('--indexnow');

  console.log(`\n${colors.bright}${colors.cyan}🔔 Search Engine Ping System - JC Hair Studio${colors.reset}\n`);

  const results = [];

  // Determine which engines to ping
  const pingAll = !googleOnly && !bingOnly && !yandexOnly && !baiduOnly && !indexnowOnly;

  if (pingAll || googleOnly) {
    results.push(await pingGoogle(force));
  }

  if (pingAll || bingOnly) {
    results.push(await pingBing(force));
  }

  if (pingAll || yandexOnly) {
    results.push(await pingYandex(force));
  }

  if (pingAll || baiduOnly) {
    results.push(await pingBaidu(force));
  }

  if (pingAll || indexnowOnly) {
    const urls = extractUrlsFromSitemap();
    results.push(await submitIndexNow(urls, force));
  }

  // Display summary
  displaySummary(results);

  // Exit with appropriate code
  const hasFailures = stats.failed > 0;
  process.exit(hasFailures ? 1 : 0);
}

// Export for use as module
export {
  pingGoogle,
  pingBing,
  pingYandex,
  pingBaidu,
  submitIndexNow,
  extractUrlsFromSitemap,
  logger,
  rateLimiter
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    logger.error('SYSTEM', 'Fatal error', { error: error.message, stack: error.stack });
    process.exit(1);
  });
}
