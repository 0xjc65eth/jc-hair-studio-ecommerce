#!/usr/bin/env node

/**
 * RSS Feed Auto-Ping Script
 * Notifies search engines and feed aggregators of updated content
 * Run this after updating feeds to trigger immediate crawling
 */

import https from 'https';
import http from 'http';

const SITE_URL = 'https://jchairstudios62.xyz';
const FEEDS = [
  `${SITE_URL}/feed.xml`,
  `${SITE_URL}/product-feed.xml`,
  `${SITE_URL}/products-feed.xml`,
  `${SITE_URL}/sitemap.xml`
];

// Search Engine Ping Services
const PING_SERVICES = [
  {
    name: 'Google',
    url: 'https://www.google.com/ping?sitemap=',
    method: 'GET'
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com/ping?sitemap=',
    method: 'GET'
  },
  {
    name: 'Yandex',
    url: 'https://blogs.yandex.ru/pings/?status=success&url=',
    method: 'GET'
  }
];

// RSS Aggregators and Feed Readers
const RSS_AGGREGATORS = [
  {
    name: 'Feedburner',
    url: 'https://feedburner.google.com/fb/a/pingSubmit?bloglink=',
    method: 'GET'
  },
  {
    name: 'Ping-o-Matic',
    url: 'http://rpc.pingomatic.com/',
    method: 'POST',
    body: {
      title: 'JC Hair Studio - Produtos Brasileiros em Portugal',
      blogurl: SITE_URL,
      rssurl: `${SITE_URL}/feed.xml`
    }
  }
];

/**
 * Make HTTP/HTTPS request
 */
function makeRequest(url, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const options = {
      method,
      headers: {
        'User-Agent': 'JC Hair Studio Feed Ping Service/1.0',
        'Content-Type': 'application/json'
      }
    };

    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

/**
 * Ping a single service
 */
async function pingService(service, feedUrl) {
  try {
    const url = service.url + encodeURIComponent(feedUrl);
    console.log(`\n📡 Pinging ${service.name}...`);
    console.log(`   URL: ${feedUrl}`);

    const result = await makeRequest(url, service.method, service.body);

    if (result.status === 200 || result.status === 204) {
      console.log(`✅ ${service.name}: SUCCESS (${result.status})`);
      return true;
    } else {
      console.log(`⚠️  ${service.name}: ${result.status} - ${result.data}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${service.name}: ERROR - ${error.message}`);
    return false;
  }
}

/**
 * Ping all services for all feeds
 */
async function pingAllServices() {
  console.log('🚀 JC Hair Studio - RSS Feed Auto-Ping Service');
  console.log('='.repeat(60));
  console.log(`📅 Started: ${new Date().toISOString()}`);
  console.log('='.repeat(60));

  const results = {
    total: 0,
    success: 0,
    failed: 0
  };

  // Ping search engines with sitemap
  console.log('\n🔍 PINGING SEARCH ENGINES');
  console.log('-'.repeat(60));

  for (const service of PING_SERVICES) {
    for (const feed of FEEDS) {
      results.total++;
      const success = await pingService(service, feed);
      if (success) results.success++;
      else results.failed++;

      // Rate limit - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Ping RSS aggregators
  console.log('\n\n📰 PINGING RSS AGGREGATORS');
  console.log('-'.repeat(60));

  for (const service of RSS_AGGREGATORS) {
    results.total++;
    const success = await pingService(service, FEEDS[0]); // Main RSS feed
    if (success) results.success++;
    else results.failed++;

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Print summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 PING SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Pings:    ${results.total}`);
  console.log(`✅ Successful:  ${results.success}`);
  console.log(`❌ Failed:      ${results.failed}`);
  console.log(`📈 Success Rate: ${Math.round((results.success / results.total) * 100)}%`);
  console.log('='.repeat(60));
  console.log(`📅 Completed: ${new Date().toISOString()}`);
  console.log('\n💡 TIP: Run this script after every content update to trigger immediate crawling!');
  console.log('\n🔗 Your feeds:');
  FEEDS.forEach(feed => console.log(`   - ${feed}`));
  console.log('');
}

/**
 * Submit to Google Search Console (via API)
 */
async function submitToGoogleSearchConsole() {
  console.log('\n\n📌 GOOGLE SEARCH CONSOLE SUBMISSION');
  console.log('-'.repeat(60));
  console.log('⚠️  For Google Search Console, you need to:');
  console.log('   1. Visit: https://search.google.com/search-console');
  console.log('   2. Add property: ' + SITE_URL);
  console.log('   3. Submit sitemaps manually:');
  FEEDS.forEach(feed => {
    console.log(`      - ${feed.replace(SITE_URL, '')}`);
  });
  console.log('\n💡 Or use Google Indexing API for automated submission');
  console.log('   Documentation: https://developers.google.com/search/apis/indexing-api/v3/quickstart');
}

/**
 * Submit to Bing Webmaster Tools
 */
async function submitToBingWebmasterTools() {
  console.log('\n\n📌 BING WEBMASTER TOOLS SUBMISSION');
  console.log('-'.repeat(60));
  console.log('⚠️  For Bing Webmaster Tools, you need to:');
  console.log('   1. Visit: https://www.bing.com/webmasters');
  console.log('   2. Add site: ' + SITE_URL);
  console.log('   3. Submit sitemaps:');
  FEEDS.forEach(feed => {
    console.log(`      - ${feed.replace(SITE_URL, '')}`);
  });
  console.log('\n💡 Bing also indexes from Google Search Console if you link accounts');
}

/**
 * Main execution
 */
async function main() {
  try {
    await pingAllServices();
    await submitToGoogleSearchConsole();
    await submitToBingWebmasterTools();

    console.log('\n✨ Done! Your feeds have been pinged to major search engines.');
    console.log('🕒 Crawlers should index your content within 24-48 hours.\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
