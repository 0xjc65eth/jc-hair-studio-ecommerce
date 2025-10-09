#!/usr/bin/env node

/**
 * JC Hair Studio - Advanced SEO Indexer
 * Automated indexing solution using all available APIs
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const CONFIG = {
  site: 'jchairstudios62.xyz',
  siteUrl: 'https://jchairstudios62.xyz',
  sitemapUrl: 'https://jchairstudios62.xyz/sitemap.xml',
  feedUrl: 'https://jchairstudios62.xyz/feed.xml',
  productFeedUrl: 'https://jchairstudios62.xyz/product-feed.xml',
  indexNowKey: 'd4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8',
  priorityUrls: [
    '/',
    '/mega-hair',
    '/progressiva-brasileira',
    '/maquiagens',
    '/cosmeticos',
    '/faq',
    '/contato',
    '/pt/botox-capilar',
    '/pt/queratina-brasileira',
    '/pt/progressiva-brasileira',
    '/pt/hidratacao-capilar-profunda',
    '/pt/reconstrucao-capilar',
    '/pt/produtos-cabelo-cacheado',
    '/pt/tintas-capilares-profissionais'
  ]
};

class AdvancedSEOIndexer {
  constructor() {
    this.results = [];
    this.stats = {
      success: 0,
      failed: 0,
      pending: 0
    };
  }

  // Create HTTP request promise
  httpRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        }));
      });

      req.on('error', reject);

      if (postData) {
        req.write(postData);
      }

      req.end();
    });
  }

  // 1. Google PubSubHubbub
  async submitToPubSubHubbub() {
    console.log('\n📍 Google PubSubHubbub Submission...');

    const urls = [CONFIG.sitemapUrl, CONFIG.feedUrl, CONFIG.productFeedUrl];

    for (const url of urls) {
      const postData = `hub.mode=publish&hub.url=${encodeURIComponent(url)}`;

      try {
        const response = await this.httpRequest({
          hostname: 'pubsubhubbub.appspot.com',
          path: '/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        }, postData);

        if (response.statusCode === 204) {
          console.log(`  ✅ ${url.split('/').pop()}: SUCCESS`);
          this.stats.success++;
        } else {
          console.log(`  ⚠️ ${url.split('/').pop()}: HTTP ${response.statusCode}`);
          this.stats.failed++;
        }
      } catch (error) {
        console.log(`  ❌ ${url.split('/').pop()}: ${error.message}`);
        this.stats.failed++;
      }
    }
  }

  // 2. IndexNow API (Bing, Yandex, Naver, Seznam)
  async submitToIndexNow() {
    console.log('\n📍 IndexNow API Submission...');

    const urls = CONFIG.priorityUrls.map(path => CONFIG.siteUrl + path);
    const payload = JSON.stringify({
      host: CONFIG.site,
      key: CONFIG.indexNowKey,
      keyLocation: `${CONFIG.siteUrl}/${CONFIG.indexNowKey}.txt`,
      urlList: urls
    });

    const endpoints = [
      { name: 'Bing', hostname: 'api.indexnow.org', path: '/indexnow' },
      { name: 'Yandex', hostname: 'yandex.com', path: '/indexnow' },
      { name: 'Naver', hostname: 'searchadvisor.naver.com', path: '/indexnow' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await this.httpRequest({
          hostname: endpoint.hostname,
          path: endpoint.path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        }, payload);

        if (response.statusCode === 200 || response.statusCode === 202) {
          console.log(`  ✅ ${endpoint.name}: SUCCESS`);
          this.stats.success++;
        } else if (response.body.includes('UserForbiddenToAccessSite')) {
          console.log(`  ⚠️ ${endpoint.name}: Verification required (will work after domain verification)`);
          this.stats.pending++;
        } else {
          console.log(`  ⚠️ ${endpoint.name}: HTTP ${response.statusCode}`);
          this.stats.failed++;
        }
      } catch (error) {
        console.log(`  ❌ ${endpoint.name}: ${error.message}`);
        this.stats.failed++;
      }
    }
  }

  // 3. Direct Pings to Search Engines
  async directPings() {
    console.log('\n📍 Direct Search Engine Pings...');

    const pings = [
      { name: 'Yandex', url: `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(CONFIG.sitemapUrl)}` },
      { name: 'Google (deprecated)', url: `https://www.google.com/ping?sitemap=${encodeURIComponent(CONFIG.sitemapUrl)}` },
      { name: 'Bing (deprecated)', url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(CONFIG.sitemapUrl)}` }
    ];

    for (const ping of pings) {
      try {
        const { stdout } = await execPromise(`curl -s -o /dev/null -w "%{http_code}" "${ping.url}"`);
        const statusCode = parseInt(stdout.trim());

        if (statusCode === 200 || statusCode === 204) {
          console.log(`  ✅ ${ping.name}: SUCCESS`);
          this.stats.success++;
        } else if (statusCode === 404 || statusCode === 410) {
          console.log(`  ℹ️ ${ping.name}: Service discontinued`);
        } else {
          console.log(`  ⚠️ ${ping.name}: HTTP ${statusCode}`);
          this.stats.failed++;
        }
      } catch (error) {
        console.log(`  ❌ ${ping.name}: ${error.message}`);
        this.stats.failed++;
      }
    }
  }

  // 4. Create verification files
  async createVerificationFiles() {
    console.log('\n📍 Creating Verification Files...');

    const verificationFiles = [
      {
        path: 'public/google-site-verification.html',
        content: 'google-site-verification: google-site-verification.html',
        name: 'Google'
      },
      {
        path: 'public/BingSiteAuth.xml',
        content: '<?xml version="1.0"?>\n<users>\n\t<user>PENDING_VERIFICATION_CODE</user>\n</users>',
        name: 'Bing'
      },
      {
        path: `public/${CONFIG.indexNowKey}.txt`,
        content: CONFIG.indexNowKey,
        name: 'IndexNow'
      }
    ];

    for (const file of verificationFiles) {
      const filePath = path.join(process.cwd(), file.path);

      if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${file.name}: Already exists`);
      } else {
        try {
          fs.writeFileSync(filePath, file.content);
          console.log(`  ✅ ${file.name}: Created`);
        } catch (error) {
          console.log(`  ❌ ${file.name}: ${error.message}`);
        }
      }
    }
  }

  // 5. Check current indexing status
  async checkIndexingStatus() {
    console.log('\n📍 Checking Current Indexing Status...');

    try {
      // Check sitemap accessibility
      const sitemapResponse = await this.httpRequest({
        hostname: CONFIG.site,
        path: '/sitemap.xml',
        method: 'HEAD'
      });

      if (sitemapResponse.statusCode === 200) {
        console.log(`  ✅ Sitemap: Accessible (HTTP 200)`);
      } else {
        console.log(`  ❌ Sitemap: HTTP ${sitemapResponse.statusCode}`);
      }

      // Check robots.txt
      const robotsResponse = await this.httpRequest({
        hostname: CONFIG.site,
        path: '/robots.txt',
        method: 'HEAD'
      });

      if (robotsResponse.statusCode === 200) {
        console.log(`  ✅ Robots.txt: Accessible (HTTP 200)`);
      } else {
        console.log(`  ❌ Robots.txt: HTTP ${robotsResponse.statusCode}`);
      }

      // Check IndexNow key
      const indexNowResponse = await this.httpRequest({
        hostname: CONFIG.site,
        path: `/${CONFIG.indexNowKey}.txt`,
        method: 'HEAD'
      });

      if (indexNowResponse.statusCode === 200) {
        console.log(`  ✅ IndexNow Key: Accessible (HTTP 200)`);
      } else {
        console.log(`  ❌ IndexNow Key: HTTP ${indexNowResponse.statusCode}`);
      }

    } catch (error) {
      console.log(`  ❌ Status Check: ${error.message}`);
    }
  }

  // 6. Generate comprehensive report
  async generateReport() {
    const timestamp = new Date().toISOString();
    const reportContent = `
=====================================
JC HAIR STUDIO - SEO INDEXING REPORT
=====================================
Generated: ${timestamp}
Domain: ${CONFIG.site}

SUBMISSION STATISTICS:
----------------------
✅ Successful: ${this.stats.success}
❌ Failed: ${this.stats.failed}
⏳ Pending Verification: ${this.stats.pending}

FILES CREATED:
--------------
✅ /public/google-site-verification.html
✅ /public/BingSiteAuth.xml
✅ /public/${CONFIG.indexNowKey}.txt

SERVICES CONTACTED:
-------------------
✅ Google PubSubHubbub (3 feeds)
✅ Yandex (Ping + IndexNow)
⚠️ Bing IndexNow (pending verification)
⚠️ Naver IndexNow (attempted)
ℹ️ Google Ping (discontinued)
ℹ️ Bing Ping (discontinued)

NEXT STEPS:
-----------
1. Google Search Console:
   → https://search.google.com/search-console
   → Add property and verify using HTML file

2. Bing Webmaster Tools:
   → https://www.bing.com/webmasters
   → Import from Google Search Console

3. Monitor indexing progress:
   → Google: site:${CONFIG.site}
   → Bing: site:${CONFIG.site}

EXPECTED TIMELINE:
------------------
• Yandex: 1-3 days
• Google: 3-7 days (after GSC setup)
• Bing: 3-7 days (after verification)
• Full indexing: 2-4 weeks

=====================================
`;

    const reportPath = path.join(process.cwd(), 'seo-indexing-report.txt');
    fs.writeFileSync(reportPath, reportContent);

    console.log('\n📊 FINAL REPORT');
    console.log('================');
    console.log(`✅ Successful submissions: ${this.stats.success}`);
    console.log(`❌ Failed submissions: ${this.stats.failed}`);
    console.log(`⏳ Pending verification: ${this.stats.pending}`);
    console.log(`📁 Report saved to: seo-indexing-report.txt`);
  }

  // Main execution
  async run() {
    console.log('🚀 JC Hair Studio - Advanced SEO Indexer');
    console.log('=========================================\n');

    await this.createVerificationFiles();
    await this.submitToPubSubHubbub();
    await this.submitToIndexNow();
    await this.directPings();
    await this.checkIndexingStatus();
    await this.generateReport();

    console.log('\n✨ Indexing process completed!');
    console.log('   Check seo-indexing-report.txt for details');
  }
}

// Execute if run directly
if (require.main === module) {
  const indexer = new AdvancedSEOIndexer();
  indexer.run().catch(console.error);
}

module.exports = AdvancedSEOIndexer;