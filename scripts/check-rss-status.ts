/**
 * RSS Feed Status Checker
 * Verifies RSS feed is accessible and provides diagnostic information
 */

import https from 'https';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://jchairstudios62.xyz';
const FEED_URL = `${SITE_URL}/feed.xml`;
const LOCAL_FEED_PATH = path.join(process.cwd(), 'public', 'feed.xml');

interface FeedStatus {
  localExists: boolean;
  localSize: number;
  remoteAccessible: boolean;
  remoteStatus?: number;
  contentType?: string;
  lastModified?: string;
  etag?: string;
  feedValid: boolean;
  itemCount: number;
  errors: string[];
  warnings: string[];
}

async function checkRemoteFeed(): Promise<Partial<FeedStatus>> {
  return new Promise((resolve) => {
    const url = new URL(FEED_URL);

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'HEAD',
      timeout: 10000,
      headers: {
        'User-Agent': 'JC Hair Studio RSS Status Checker/1.0',
      },
    };

    const req = https.request(options, (res) => {
      resolve({
        remoteAccessible: res.statusCode === 200,
        remoteStatus: res.statusCode,
        contentType: res.headers['content-type'],
        lastModified: res.headers['last-modified'],
        etag: res.headers['etag'],
      });
    });

    req.on('error', (error) => {
      resolve({
        remoteAccessible: false,
        errors: [`Remote check error: ${error.message}`],
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        remoteAccessible: false,
        errors: ['Remote check timeout'],
      });
    });

    req.end();
  });
}

function checkLocalFeed(): Partial<FeedStatus> {
  const result: Partial<FeedStatus> = {
    errors: [],
    warnings: [],
  };

  if (!fs.existsSync(LOCAL_FEED_PATH)) {
    result.localExists = false;
    result.errors?.push('Local feed file not found');
    return result;
  }

  result.localExists = true;

  try {
    const stats = fs.statSync(LOCAL_FEED_PATH);
    result.localSize = stats.size;

    const content = fs.readFileSync(LOCAL_FEED_PATH, 'utf-8');

    // Basic XML validation
    if (!content.startsWith('<?xml')) {
      result.feedValid = false;
      result.errors?.push('Feed does not start with XML declaration');
    } else {
      result.feedValid = true;
    }

    // Count items
    const itemMatches = content.match(/<item>/g);
    result.itemCount = itemMatches ? itemMatches.length : 0;

    // Check for required elements
    if (!content.includes('<channel>')) {
      result.errors?.push('Missing <channel> element');
    }
    if (!content.includes('<title>')) {
      result.errors?.push('Missing <title> element');
    }
    if (!content.includes('<link>')) {
      result.errors?.push('Missing <link> element');
    }

    // Check for recommended elements
    if (!content.includes('<description>')) {
      result.warnings?.push('Missing <description> element');
    }
    if (!content.includes('<lastBuildDate>')) {
      result.warnings?.push('Missing <lastBuildDate> element');
    }

    // Check for media content
    const mediaMatches = content.match(/<media:content/g);
    const mediaCount = mediaMatches ? mediaMatches.length : 0;
    if (mediaCount === 0) {
      result.warnings?.push('No media content found in feed');
    }

    // Check file size
    if (stats.size > 1024 * 1024) { // > 1MB
      result.warnings?.push('Feed size is quite large (>1MB), consider reducing items');
    }

  } catch (error: any) {
    result.errors?.push(`Local feed check error: ${error.message}`);
  }

  return result;
}

async function main() {
  console.log('Checking RSS feed status...\n');

  const localStatus = checkLocalFeed();
  const remoteStatus = await checkRemoteFeed();

  const status: FeedStatus = {
    ...localStatus,
    ...remoteStatus,
    errors: [...(localStatus.errors || []), ...(remoteStatus.errors || [])],
    warnings: [...(localStatus.warnings || []), ...(remoteStatus.warnings || [])],
  } as FeedStatus;

  console.log('=== RSS Feed Status Report ===\n');

  // Local Status
  console.log('Local Feed:');
  if (status.localExists) {
    console.log(`  ✓ File exists at: ${LOCAL_FEED_PATH}`);
    console.log(`  ✓ Size: ${(status.localSize / 1024).toFixed(2)} KB`);
    console.log(`  ✓ Items: ${status.itemCount}`);
    if (status.feedValid) {
      console.log('  ✓ Valid XML structure');
    } else {
      console.log('  ✗ Invalid XML structure');
    }
  } else {
    console.log('  ✗ File not found');
  }
  console.log('');

  // Remote Status
  console.log('Remote Feed:');
  console.log(`  URL: ${FEED_URL}`);
  if (status.remoteAccessible) {
    console.log(`  ✓ Accessible (Status: ${status.remoteStatus})`);
    if (status.contentType) {
      console.log(`  ✓ Content-Type: ${status.contentType}`);
    }
    if (status.lastModified) {
      console.log(`  ✓ Last-Modified: ${status.lastModified}`);
    }
    if (status.etag) {
      console.log(`  ✓ ETag: ${status.etag}`);
    }
  } else {
    console.log(`  ✗ Not accessible${status.remoteStatus ? ` (Status: ${status.remoteStatus})` : ''}`);
  }
  console.log('');

  // Autodiscovery
  console.log('Autodiscovery:');
  console.log('  Check if feed is discoverable in HTML <head>:');
  console.log('  <link rel="alternate" type="application/rss+xml" href="/feed.xml" />');
  console.log('');

  // Errors
  if (status.errors.length > 0) {
    console.log('Errors:');
    status.errors.forEach((error) => {
      console.log(`  ✗ ${error}`);
    });
    console.log('');
  }

  // Warnings
  if (status.warnings.length > 0) {
    console.log('Warnings:');
    status.warnings.forEach((warning) => {
      console.log(`  ⚠ ${warning}`);
    });
    console.log('');
  }

  // Testing URLs
  console.log('Testing URLs:');
  console.log('  - W3C Validator: https://validator.w3.org/feed/#validate_by_uri+' + encodeURIComponent(FEED_URL));
  console.log('  - RSS Validator: https://www.feedvalidator.org/check.cgi?url=' + encodeURIComponent(FEED_URL));
  console.log('  - Direct Access: ' + FEED_URL);
  console.log('');

  // SEO Integration
  console.log('SEO Integration:');
  console.log('  - Google Search Console: Add as sitemap');
  console.log('  - Bing Webmaster: Submit RSS feed');
  console.log('  - PubSubHubbub: Automatically notified on updates');
  console.log('');

  // Final verdict
  const hasErrors = status.errors.length > 0;
  const hasWarnings = status.warnings.length > 0;

  if (!hasErrors && status.localExists && status.feedValid) {
    console.log('✓ RSS feed is healthy and ready!');
    if (status.remoteAccessible) {
      console.log('✓ Feed is accessible online');
    } else {
      console.log('⚠ Feed is not yet accessible online (deploy first)');
    }
    process.exit(0);
  } else if (!hasErrors && status.localExists) {
    console.log('⚠ RSS feed has warnings but is functional');
    process.exit(0);
  } else {
    console.log('✗ RSS feed has errors that need to be fixed');
    process.exit(1);
  }
}

main();
