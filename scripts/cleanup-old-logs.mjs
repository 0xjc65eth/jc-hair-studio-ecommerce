#!/usr/bin/env node

/**
 * Cleanup Old SEO Logs
 * Remove old data from monitoring collections to maintain performance
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
 * Cleanup configuration
 */
const CLEANUP_CONFIG = {
  seo_404_errors: {
    retentionDays: 90,
    name: '404 Errors',
    field: 'timestamp',
  },
  seo_redirects: {
    retentionDays: 90,
    name: 'Redirects',
    field: 'timestamp',
  },
  seo_traffic_alerts: {
    retentionDays: 180,
    name: 'Traffic Alerts',
    field: 'timestamp',
    keepUnresolved: true, // Don't delete unresolved alerts
  },
  seo_rankings: {
    retentionDays: 365,
    name: 'Keyword Rankings',
    field: 'date',
  },
  analytics_pageviews: {
    retentionDays: 90,
    name: 'Pageviews',
    field: 'timestamp',
  },
};

/**
 * Clean up a collection
 */
async function cleanupCollection(db, collectionName, config) {
  try {
    log(`\n🧹 Cleaning ${config.name}...`, 'cyan');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - config.retentionDays);

    const query = { [config.field]: { $lt: cutoffDate } };

    // For traffic alerts, keep unresolved ones
    if (config.keepUnresolved) {
      query.resolved = true;
    }

    // Check how many documents will be deleted
    const collection = db.collection(collectionName);
    const count = await collection.countDocuments(query);

    if (count === 0) {
      log(`  ✓ No old data to clean (retention: ${config.retentionDays} days)`, 'green');
      return 0;
    }

    log(`  Found ${count} old records (older than ${cutoffDate.toLocaleDateString()})`, 'yellow');

    // Delete old documents
    const result = await collection.deleteMany(query);

    log(`  ✓ Deleted ${result.deletedCount} records`, 'green');

    return result.deletedCount;
  } catch (error) {
    if (error.message.includes('ns not found')) {
      log(`  ℹ️  Collection "${collectionName}" doesn't exist yet`, 'yellow');
      return 0;
    }
    log(`  ✗ Error cleaning ${config.name}: ${error.message}`, 'red');
    return 0;
  }
}

/**
 * Get collection statistics
 */
async function getCollectionStats(db, collectionName) {
  try {
    const collection = db.collection(collectionName);
    const stats = await db.command({ collStats: collectionName });

    return {
      count: stats.count || 0,
      size: stats.size || 0,
      avgObjSize: stats.avgObjSize || 0,
      storageSize: stats.storageSize || 0,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Create indexes for better performance
 */
async function ensureIndexes(db) {
  try {
    log('\n🔍 Ensuring indexes for optimal performance...', 'cyan');

    const indexes = [
      {
        collection: 'seo_404_errors',
        indexes: [
          { timestamp: -1 },
          { url: 1, timestamp: -1 },
        ],
      },
      {
        collection: 'seo_redirects',
        indexes: [
          { timestamp: -1 },
          { from: 1, to: 1 },
        ],
      },
      {
        collection: 'seo_traffic_alerts',
        indexes: [
          { timestamp: -1 },
          { severity: 1, resolved: 1 },
        ],
      },
      {
        collection: 'seo_rankings',
        indexes: [
          { date: -1 },
          { keyword: 1, date: -1 },
        ],
      },
    ];

    for (const { collection, indexes: colIndexes } of indexes) {
      const col = db.collection(collection);

      for (const index of colIndexes) {
        try {
          await col.createIndex(index);
          log(`  ✓ Index created on ${collection}: ${JSON.stringify(index)}`, 'green');
        } catch (error) {
          if (!error.message.includes('already exists')) {
            log(`  ⚠️  Could not create index on ${collection}: ${error.message}`, 'yellow');
          }
        }
      }
    }

    log('  ✓ Index optimization complete', 'green');
  } catch (error) {
    log(`  ⚠️  Error ensuring indexes: ${error.message}`, 'yellow');
  }
}

/**
 * Main execution
 */
async function main() {
  log('🧹 Starting SEO data cleanup...', 'bright');

  const dryRun = process.argv.includes('--dry-run');
  if (dryRun) {
    log('⚠️  DRY RUN MODE - No data will be deleted', 'yellow');
  }

  let db;
  try {
    db = await connectToDatabase();
    log('✅ Connected to database', 'green');

    // Show current statistics
    log('\n📊 Current Database Statistics:', 'bright');
    let totalSize = 0;
    let totalCount = 0;

    for (const [collectionName, config] of Object.entries(CLEANUP_CONFIG)) {
      const stats = await getCollectionStats(db, collectionName);
      if (stats) {
        log(`\n${config.name}:`, 'cyan');
        log(`  Documents: ${stats.count.toLocaleString()}`, 'reset');
        log(`  Size: ${formatBytes(stats.size)}`, 'reset');
        log(`  Storage: ${formatBytes(stats.storageSize)}`, 'reset');

        totalSize += stats.size;
        totalCount += stats.count;
      }
    }

    log(`\n📦 Total:`, 'bright');
    log(`  Documents: ${totalCount.toLocaleString()}`, 'reset');
    log(`  Size: ${formatBytes(totalSize)}`, 'reset');

    if (!dryRun) {
      // Cleanup each collection
      log('\n🗑️  Starting cleanup...', 'bright');

      let totalDeleted = 0;
      for (const [collectionName, config] of Object.entries(CLEANUP_CONFIG)) {
        const deleted = await cleanupCollection(db, collectionName, config);
        totalDeleted += deleted;
      }

      log(`\n✅ Cleanup complete!`, 'green');
      log(`Total records deleted: ${totalDeleted.toLocaleString()}`, 'reset');

      // Optimize indexes
      await ensureIndexes(db);

      // Show new statistics
      log('\n📊 New Database Statistics:', 'bright');
      let newTotalSize = 0;
      let newTotalCount = 0;

      for (const [collectionName, config] of Object.entries(CLEANUP_CONFIG)) {
        const stats = await getCollectionStats(db, collectionName);
        if (stats) {
          newTotalSize += stats.size;
          newTotalCount += stats.count;
        }
      }

      const savedSpace = totalSize - newTotalSize;
      const savedCount = totalCount - newTotalCount;

      log(`  Documents: ${newTotalCount.toLocaleString()} (${savedCount > 0 ? '-' : ''}${savedCount.toLocaleString()})`, 'reset');
      log(`  Size: ${formatBytes(newTotalSize)} (freed ${formatBytes(savedSpace)})`, 'green');

      log('\n💡 Recommendations:', 'cyan');
      log('  • Run this cleanup monthly for optimal performance', 'reset');
      log('  • Schedule: 0 0 1 * * npm run seo:cleanup', 'reset');
      log('  • Monitor disk space in MongoDB Atlas/cluster', 'reset');
    } else {
      log('\n💡 To actually delete data, run without --dry-run flag', 'yellow');
    }

  } catch (error) {
    log(`\n❌ Cleanup failed: ${error.message}`, 'red');
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

export { cleanupCollection, ensureIndexes };
