#!/usr/bin/env node

/**
 * IndexNow Submission Script
 *
 * WHY: Notify search engines instantly about new/updated content
 * HOW: Submit URLs via IndexNow API (Bing, Yandex, etc.)
 *
 * @see https://www.indexnow.org/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://jchairstudios62.xyz';
const INDEXNOW_KEY = 'd4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8'; // Static key for IndexNow

/**
 * WHY: Extract URLs from sitemap
 * HOW: Parse XML and extract <loc> tags
 */
function extractUrlsFromSitemap() {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  const sitemap = fs.readFileSync(sitemapPath, 'utf-8');

  const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g) || [];
  return urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
}

/**
 * WHY: Submit URLs to IndexNow API
 * HOW: POST request with URL list
 */
async function submitToIndexNow(urls) {
  const payload = {
    host: 'jchairstudios62.xyz',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls
  };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    return {
      status: response.status,
      ok: response.ok,
      text: response.status === 200 ? 'Success' : await response.text()
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      text: error.message
    };
  }
}

/**
 * WHY: Submit individual URLs to Bing Webmaster
 * HOW: Use Bing URL submission API
 */
async function submitToBing(urls) {
  // Note: Requires API key from Bing Webmaster Tools
  // For now, use IndexNow which Bing supports
  console.log('ℹ️  Bing uses IndexNow protocol - submission included above');
  return { status: 'via_indexnow' };
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting SEO indexing automation...\n');

  // Step 1: Extract URLs
  const urls = extractUrlsFromSitemap();
  console.log(`✅ Extracted ${urls.length} URLs from sitemap.xml`);

  // Step 2: Create IndexNow key file
  const keyPath = path.join(process.cwd(), 'public', `${INDEXNOW_KEY}.txt`);
  fs.writeFileSync(keyPath, INDEXNOW_KEY, 'utf-8');
  console.log(`✅ Created IndexNow key file: public/${INDEXNOW_KEY}.txt`);

  // Step 3: Submit to IndexNow
  console.log('\n🔄 Submitting to IndexNow (Bing, Yandex, etc.)...');
  const indexNowResult = await submitToIndexNow(urls);

  if (indexNowResult.ok) {
    console.log(`✅ IndexNow submission successful!`);
    console.log(`   Status: ${indexNowResult.status}`);
  } else {
    console.log(`⚠️  IndexNow response: ${indexNowResult.status}`);
    console.log(`   Message: ${indexNowResult.text}`);
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70));
  console.log(`URLs submitted: ${urls.length}`);
  console.log(`IndexNow status: ${indexNowResult.ok ? '✅ Success' : '⚠️ Check manually'}`);
  console.log('\n📋 NEXT STEPS:\n');
  console.log('1. ✅ IndexNow - Already submitted (Bing, Yandex automatically notified)');
  console.log('2. 🔧 Google Search Console - Manual setup required:');
  console.log('   → Visit: https://search.google.com/search-console');
  console.log('   → Add property: https://jchairstudios62.xyz');
  console.log('   → Submit sitemap: https://jchairstudios62.xyz/sitemap.xml');
  console.log('\n3. 🔧 Bing Webmaster Tools - Quick import:');
  console.log('   → Visit: https://www.bing.com/webmasters');
  console.log('   → Click "Import from Google Search Console" (easiest!)');
  console.log('\n4. 🔧 Google Business Profile:');
  console.log('   → Visit: https://www.google.com/business/');
  console.log('   → Create profile for local SEO');
  console.log('\n⏱️  Expected indexing time:');
  console.log('   • IndexNow (Bing/Yandex): 1-3 days');
  console.log('   • Google: 3-7 days (after Search Console setup)');
  console.log('   • Full visibility: 2-4 weeks\n');
  console.log('💡 TIP: Run this script weekly to keep search engines updated:');
  console.log('   npm run seo:indexnow\n');
}

main().catch(console.error);
