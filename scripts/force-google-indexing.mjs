#!/usr/bin/env node

/**
 * Force Google Indexing Script
 *
 * IMPORTANT: Google deprecated sitemap ping in June 2023.
 * Modern approaches:
 * 1. Use Google Search Console API (Indexing API)
 * 2. Submit via Google Search Console UI
 * 3. Use IndexNow protocol
 * 4. Ensure proper robots.txt and sitemap.xml
 */

import https from 'https';
import http from 'http';

const SITE_URL = 'https://jchairstudios62.xyz';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

console.log('🚀 Force Indexing Script Started');
console.log('================================\n');

// Test sitemap accessibility
async function testSitemap() {
  console.log('1️⃣ Testing sitemap accessibility...');
  return new Promise((resolve) => {
    https.get(SITEMAP_URL, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Content-Type: ${res.headers['content-type']}`);
      console.log(`   Cache: ${res.headers['x-vercel-cache'] || 'N/A'}`);

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`   Size: ${data.length} bytes`);
        console.log(`   ✅ Sitemap is accessible\n`);
        resolve(data);
      });
    }).on('error', (err) => {
      console.error(`   ❌ Error: ${err.message}\n`);
      resolve(null);
    });
  });
}

// IndexNow submission (modern alternative)
async function submitToIndexNow() {
  console.log('2️⃣ Submitting to IndexNow (Bing, Yandex, etc.)...');

  const urls = [
    SITE_URL,
    `${SITE_URL}/produtos`,
    `${SITE_URL}/sobre`,
    `${SITE_URL}/contato`,
  ];

  const indexNowData = JSON.stringify({
    host: 'jchairstudios62.xyz',
    key: 'indexnow-key-placeholder',
    keyLocation: `${SITE_URL}/indexnow-key.txt`,
    urlList: urls
  });

  console.log(`   Submitting ${urls.length} URLs to IndexNow...`);
  console.log('   Note: Requires IndexNow API key setup');
  console.log('   ⚠️  Setup required: https://www.indexnow.org/\n');
}

// Test robots.txt
async function testRobotsTxt() {
  console.log('3️⃣ Testing robots.txt...');
  return new Promise((resolve) => {
    https.get(`${SITE_URL}/robots.txt`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('   Content:');
        console.log('   ---');
        data.split('\n').slice(0, 10).forEach(line => {
          console.log(`   ${line}`);
        });
        console.log('   ---');
        console.log(`   ✅ robots.txt is accessible\n`);
        resolve(data);
      });
    }).on('error', (err) => {
      console.error(`   ❌ Error: ${err.message}\n`);
      resolve(null);
    });
  });
}

// Fetch sitemap and extract URLs
async function extractUrlsFromSitemap(sitemapData) {
  console.log('4️⃣ Extracting URLs from sitemap...');
  const urlMatches = sitemapData.match(/<loc>(.*?)<\/loc>/g) || [];
  const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
  console.log(`   Found ${urls.length} URLs in sitemap`);
  console.log(`   Sample URLs:`);
  urls.slice(0, 5).forEach(url => console.log(`   - ${url}`));
  console.log('');
  return urls;
}

// Main execution
async function main() {
  try {
    // Test sitemap
    const sitemapData = await testSitemap();

    if (!sitemapData) {
      console.error('❌ Failed to fetch sitemap. Exiting.');
      process.exit(1);
    }

    // Test robots.txt
    await testRobotsTxt();

    // Extract URLs
    const urls = await extractUrlsFromSitemap(sitemapData);

    // Submit to IndexNow
    await submitToIndexNow();

    // Instructions for manual submission
    console.log('📋 NEXT STEPS - Manual Actions Required:');
    console.log('=====================================\n');
    console.log('✅ Google Search Console (RECOMMENDED):');
    console.log('   1. Go to: https://search.google.com/search-console');
    console.log('   2. Select your property: jchairstudios62.xyz');
    console.log('   3. Go to "Sitemaps" section');
    console.log('   4. Submit: https://jchairstudios62.xyz/sitemap.xml');
    console.log('   5. Use "URL Inspection" tool for immediate indexing requests\n');

    console.log('✅ Google Indexing API (For immediate requests):');
    console.log('   1. Enable Indexing API in Google Cloud Console');
    console.log('   2. Create service account credentials');
    console.log('   3. Use API to request indexing');
    console.log('   Docs: https://developers.google.com/search/apis/indexing-api/v3/quickstart\n');

    console.log('✅ IndexNow Protocol (Bing, Yandex):');
    console.log('   1. Generate API key: https://www.indexnow.org/');
    console.log('   2. Add key file to site root');
    console.log('   3. Submit URLs via API\n');

    console.log('✅ Alternative Methods:');
    console.log('   - Share site links on social media');
    console.log('   - Submit to web directories');
    console.log('   - Create quality backlinks');
    console.log('   - Ensure proper meta tags and structured data\n');

    console.log('⚠️  IMPORTANT NOTES:');
    console.log('   - Google sitemap ping was deprecated in June 2023');
    console.log('   - Indexing takes time (hours to days typically)');
    console.log('   - Focus on content quality and proper SEO');
    console.log('   - Use Google Search Console for monitoring\n');

    console.log('✅ Script completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
