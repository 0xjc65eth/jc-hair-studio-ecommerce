#!/usr/bin/env node

/**
 * SEO Monitoring Cron Job
 * Run this script periodically to monitor SEO metrics
 * Recommended: Every hour via cron or scheduled task
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

async function monitorTraffic(db) {
  try {
    log('Monitoring traffic patterns...', 'cyan');

    // Get current hour traffic
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const currentHourTraffic = await db
      .collection('analytics_pageviews')
      .countDocuments({
        timestamp: { $gte: hourAgo, $lte: now },
      });

    // Compare with same hour yesterday
    const yesterdayStart = new Date(
      now.getTime() - 24 * 60 * 60 * 1000 - 60 * 60 * 1000
    );
    const yesterdayEnd = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const yesterdayTraffic = await db
      .collection('analytics_pageviews')
      .countDocuments({
        timestamp: { $gte: yesterdayStart, $lte: yesterdayEnd },
      });

    const changePercent =
      yesterdayTraffic > 0
        ? ((currentHourTraffic - yesterdayTraffic) / yesterdayTraffic) * 100
        : 0;

    log(
      `Current hour traffic: ${currentHourTraffic} (${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}% vs yesterday)`,
      changePercent < -20 ? 'red' : changePercent > 20 ? 'green' : 'reset'
    );

    // Alert if significant drop
    if (changePercent <= -30) {
      log('⚠️  Significant traffic drop detected!', 'red');
      // TODO: Send email alert
    }

    return { currentHourTraffic, yesterdayTraffic, changePercent };
  } catch (error) {
    log(`Error monitoring traffic: ${error.message}`, 'red');
    return null;
  }
}

async function check404s(db) {
  try {
    log('Checking 404 errors...', 'cyan');

    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const recent404s = await db
      .collection('seo_404_errors')
      .aggregate([
        {
          $match: {
            timestamp: { $gte: hourAgo },
          },
        },
        {
          $group: {
            _id: '$url',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ])
      .toArray();

    if (recent404s.length > 0) {
      log(`Found ${recent404s.length} unique 404 URLs in last hour`, 'yellow');
      recent404s.forEach((item) => {
        if (item.count > 5) {
          log(`  ⚠️  ${item._id} (${item.count} hits)`, 'red');
        }
      });
    } else {
      log('No 404 errors in last hour', 'green');
    }

    return recent404s;
  } catch (error) {
    log(`Error checking 404s: ${error.message}`, 'red');
    return [];
  }
}

async function checkIndexing(db) {
  try {
    log('Checking indexing status...', 'cyan');

    // This would require Search Console API integration
    // For now, just log a reminder
    log('ℹ️  Manual indexing check recommended', 'yellow');

    return { status: 'manual_check_needed' };
  } catch (error) {
    log(`Error checking indexing: ${error.message}`, 'red');
    return null;
  }
}

async function generateSummary(db) {
  try {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get daily summary
    const [totalPageviews, total404s, totalAlerts] = await Promise.all([
      db.collection('analytics_pageviews').countDocuments({
        timestamp: { $gte: dayAgo },
      }),
      db.collection('seo_404_errors').countDocuments({
        timestamp: { $gte: dayAgo },
      }),
      db.collection('seo_traffic_alerts').countDocuments({
        timestamp: { $gte: dayAgo },
        resolved: false,
      }),
    ]);

    log('\n📊 24-Hour Summary:', 'bright');
    log(`   Pageviews: ${totalPageviews}`, 'reset');
    log(`   404 Errors: ${total404s}`, total404s > 100 ? 'yellow' : 'reset');
    log(
      `   Active Alerts: ${totalAlerts}`,
      totalAlerts > 0 ? 'red' : 'green'
    );

    return { totalPageviews, total404s, totalAlerts };
  } catch (error) {
    log(`Error generating summary: ${error.message}`, 'red');
    return null;
  }
}

async function main() {
  log('🔍 Starting SEO monitoring check...', 'bright');

  let db;
  try {
    db = await connectToDatabase();
    log('✅ Connected to database', 'green');

    // Run monitoring tasks
    await monitorTraffic(db);
    await check404s(db);
    await checkIndexing(db);
    await generateSummary(db);

    log('\n✅ Monitoring check complete!', 'green');
  } catch (error) {
    log(`\n❌ Monitoring failed: ${error.message}`, 'red');
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

export { monitorTraffic, check404s, checkIndexing, generateSummary };
