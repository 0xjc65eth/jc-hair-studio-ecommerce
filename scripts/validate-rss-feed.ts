/**
 * RSS Feed Validator
 * Validates the generated RSS feed against RSS 2.0 specification
 */

import fs from 'fs';
import path from 'path';
import { parseString } from 'xml2js';

const FEED_PATH = path.join(process.cwd(), 'public', 'feed.xml');

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    items: number;
    categories: number;
    imagesWithMedia: number;
    itemsWithPrices: number;
  };
}

function validateRSSFeed(): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      stats: {
        items: 0,
        categories: 0,
        imagesWithMedia: 0,
        itemsWithPrices: 0,
      },
    };

    // Check if file exists
    if (!fs.existsSync(FEED_PATH)) {
      result.valid = false;
      result.errors.push('RSS feed file not found at public/feed.xml');
      resolve(result);
      return;
    }

    // Read and parse XML
    const xmlContent = fs.readFileSync(FEED_PATH, 'utf-8');

    parseString(xmlContent, (err, data) => {
      if (err) {
        result.valid = false;
        result.errors.push(`XML parsing error: ${err.message}`);
        resolve(result);
        return;
      }

      try {
        // Validate RSS structure
        if (!data.rss) {
          result.errors.push('Missing <rss> root element');
          result.valid = false;
        }

        if (!data.rss.channel) {
          result.errors.push('Missing <channel> element');
          result.valid = false;
        }

        const channel = data.rss?.channel?.[0];

        if (!channel) {
          result.errors.push('Channel element is empty');
          result.valid = false;
          resolve(result);
          return;
        }

        // Validate required channel elements
        const requiredChannelElements = ['title', 'link', 'description'];
        requiredChannelElements.forEach((element) => {
          if (!channel[element]) {
            result.errors.push(`Missing required channel element: <${element}>`);
            result.valid = false;
          }
        });

        // Validate recommended channel elements
        const recommendedChannelElements = ['language', 'lastBuildDate', 'pubDate'];
        recommendedChannelElements.forEach((element) => {
          if (!channel[element]) {
            result.warnings.push(`Missing recommended channel element: <${element}>`);
          }
        });

        // Validate namespaces
        const requiredNamespaces = ['atom', 'dc', 'media', 'g'];
        const rssAttributes = data.rss.$;
        requiredNamespaces.forEach((ns) => {
          const nsKey = `xmlns:${ns}`;
          if (!rssAttributes || !rssAttributes[nsKey]) {
            result.warnings.push(`Missing recommended namespace: ${ns}`);
          }
        });

        // Validate items
        const items = channel.item || [];
        result.stats.items = items.length;

        if (items.length === 0) {
          result.errors.push('Feed contains no items');
          result.valid = false;
        }

        if (items.length > 50) {
          result.warnings.push(`Feed contains ${items.length} items (recommended max: 50)`);
        }

        // Validate each item
        items.forEach((item: any, index: number) => {
          const requiredItemElements = ['title', 'link', 'description'];
          requiredItemElements.forEach((element) => {
            if (!item[element]) {
              result.errors.push(`Item ${index + 1}: Missing required element <${element}>`);
              result.valid = false;
            }
          });

          // Check for GUID
          if (!item.guid) {
            result.warnings.push(`Item ${index + 1}: Missing <guid> element`);
          }

          // Check for pubDate
          if (!item.pubDate) {
            result.warnings.push(`Item ${index + 1}: Missing <pubDate> element`);
          }

          // Check for category
          if (!item.category) {
            result.warnings.push(`Item ${index + 1}: Missing <category> element`);
          } else {
            result.stats.categories++;
          }

          // Check for media content
          if (item['media:content']) {
            result.stats.imagesWithMedia++;
          }

          // Check for price information
          if (item['g:price']) {
            result.stats.itemsWithPrices++;
          }
        });

        resolve(result);
      } catch (error: any) {
        result.valid = false;
        result.errors.push(`Validation error: ${error.message}`);
        resolve(result);
      }
    });
  });
}

async function main() {
  console.log('Validating RSS feed...\n');

  const result = await validateRSSFeed();

  console.log('=== RSS Feed Validation Report ===\n');

  // Print stats
  console.log('Statistics:');
  console.log(`  - Total items: ${result.stats.items}`);
  console.log(`  - Items with categories: ${result.stats.categories}`);
  console.log(`  - Items with media content: ${result.stats.imagesWithMedia}`);
  console.log(`  - Items with prices: ${result.stats.itemsWithPrices}`);
  console.log('');

  // Print errors
  if (result.errors.length > 0) {
    console.log('Errors:');
    result.errors.forEach((error) => {
      console.log(`  ✗ ${error}`);
    });
    console.log('');
  }

  // Print warnings
  if (result.warnings.length > 0) {
    console.log('Warnings:');
    result.warnings.forEach((warning) => {
      console.log(`  ⚠ ${warning}`);
    });
    console.log('');
  }

  // Final verdict
  if (result.valid && result.errors.length === 0) {
    console.log('✓ RSS feed is valid and ready for production!');
    console.log('\nFeed URL: https://jchairstudios62.xyz/feed.xml');
    console.log('\nYou can test it with:');
    console.log('  - W3C Feed Validator: https://validator.w3.org/feed/');
    console.log('  - RSS Feed Validator: https://www.feedvalidator.org/');
    process.exit(0);
  } else {
    console.log('✗ RSS feed validation failed!');
    console.log('Please fix the errors above before using the feed.');
    process.exit(1);
  }
}

main();
