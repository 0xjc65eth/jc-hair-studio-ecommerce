#!/usr/bin/env node

/**
 * Track Keyword Rankings
 * Automatically track keyword positions across search engines
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${colors[color]}${message}${colors.reset}`);
}

// Priority keywords from rankingTracker.ts
const PRIORITY_KEYWORDS = [
  'mega hair brasileiro',
  'mega hair 100% humano',
  'extensão cabelo humano',
  'progressiva brasileira',
  'progressiva vogue',
  'botox capilar',
  'maquiagem brasileira',
  'produtos brasileiros portugal',
  'jc hair studio',
  'mega hair portugal',
];

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not configured');
  }

  const client = new MongoClient(uri);
  await client.connect();
  return client.db(process.env.MONGODB_DB_NAME || 'jc-hair-studio-ecommerce');
}

/**
 * Track keyword position (simplified version)
 * Note: For production, use Search Console API or paid services like SerpApi
 */
async function trackKeywordPosition(keyword, domain) {
  try {
    log(`Tracking: "${keyword}"...`, 'cyan');

    // Placeholder for actual tracking
    // In production, use:
    // 1. Search Console API (free, reliable)
    // 2. SerpApi (paid, comprehensive)
    // 3. DataForSEO (paid, accurate)

    const position = Math.floor(Math.random() * 100) + 1; // Mock data
    const url = position <= 50 ? `${domain}/produto/example` : null;

    return {
      keyword,
      position: position <= 100 ? position : null,
      url,
      searchEngine: 'google',
      country: 'pt',
      date: new Date(),
      tracked: true,
    };
  } catch (error) {
    log(`Error tracking "${keyword}": ${error.message}`, 'red');
    return {
      keyword,
      position: null,
      url: null,
      searchEngine: 'google',
      country: 'pt',
      date: new Date(),
      tracked: false,
      error: error.message,
    };
  }
}

/**
 * Save ranking to database
 */
async function saveRanking(db, ranking) {
  try {
    await db.collection('seo_rankings').insertOne({
      ...ranking,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ranking.position) {
      log(`  ✓ Position ${ranking.position} for "${ranking.keyword}"`, 'green');
    } else {
      log(`  ✗ Not found in top 100 for "${ranking.keyword}"`, 'yellow');
    }
  } catch (error) {
    log(`  ✗ Error saving ranking: ${error.message}`, 'red');
  }
}

/**
 * Calculate ranking changes
 */
async function calculateChanges(db, keyword) {
  try {
    const rankings = await db
      .collection('seo_rankings')
      .find({ keyword })
      .sort({ date: -1 })
      .limit(2)
      .toArray();

    if (rankings.length < 2) {
      return null;
    }

    const [current, previous] = rankings;

    if (!current.position || !previous.position) {
      return null;
    }

    const change = previous.position - current.position;

    return {
      keyword,
      currentPosition: current.position,
      previousPosition: previous.position,
      change,
      trend: change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable',
    };
  } catch (error) {
    log(`Error calculating changes for "${keyword}": ${error.message}`, 'red');
    return null;
  }
}

/**
 * Generate summary report
 */
async function generateSummary(db, rankings) {
  try {
    log('\n📊 Ranking Summary:', 'bright');

    const tracked = rankings.filter(r => r.position !== null).length;
    const total = rankings.length;
    const avgPosition = rankings
      .filter(r => r.position !== null)
      .reduce((sum, r) => sum + r.position, 0) / (tracked || 1);

    log(`Total keywords tracked: ${total}`, 'reset');
    log(`Keywords in top 100: ${tracked}`, tracked > 0 ? 'green' : 'yellow');
    log(`Average position: ${avgPosition.toFixed(1)}`, 'reset');

    // Count by position ranges
    const top10 = rankings.filter(r => r.position && r.position <= 10).length;
    const top20 = rankings.filter(r => r.position && r.position <= 20).length;
    const top50 = rankings.filter(r => r.position && r.position <= 50).length;

    log('\nPosition Distribution:', 'cyan');
    log(`  Top 10: ${top10}`, top10 > 0 ? 'green' : 'reset');
    log(`  Top 20: ${top20}`, top20 > 0 ? 'green' : 'reset');
    log(`  Top 50: ${top50}`, top50 > 0 ? 'green' : 'reset');

    // Check for changes
    log('\n📈 Notable Changes:', 'cyan');
    let changesFound = false;

    for (const ranking of rankings) {
      const change = await calculateChanges(db, ranking.keyword);
      if (change && Math.abs(change.change) >= 5) {
        changesFound = true;
        const symbol = change.change > 0 ? '↑' : '↓';
        const color = change.change > 0 ? 'green' : 'red';
        log(
          `  ${symbol} "${change.keyword}": ${change.previousPosition} → ${change.currentPosition} (${change.change > 0 ? '+' : ''}${change.change})`,
          color
        );
      }
    }

    if (!changesFound) {
      log('  No significant changes (±5 positions)', 'reset');
    }

  } catch (error) {
    log(`Error generating summary: ${error.message}`, 'red');
  }
}

/**
 * Main execution
 */
async function main() {
  log('🔍 Starting keyword ranking tracker...', 'bright');

  const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://jchairstudios62.xyz';

  let db;
  try {
    db = await connectToDatabase();
    log('✅ Connected to database', 'green');

    const rankings = [];

    // Track each keyword
    for (const keyword of PRIORITY_KEYWORDS) {
      const ranking = await trackKeywordPosition(keyword, domain);
      await saveRanking(db, ranking);
      rankings.push(ranking);

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Generate summary
    await generateSummary(db, rankings);

    log('\n✅ Ranking tracking complete!', 'green');
    log('\nℹ️  Note: This is using mock data. For production:', 'yellow');
    log('  1. Integrate Google Search Console API (recommended)', 'yellow');
    log('  2. Use paid service like SerpApi or DataForSEO', 'yellow');
    log('  3. Check /lib/seo/rankingTracker.ts for integration code', 'yellow');

  } catch (error) {
    log(`\n❌ Tracking failed: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    if (db) {
      await db.client.close();
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { trackKeywordPosition, calculateChanges };
