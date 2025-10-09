#!/usr/bin/env node

/**
 * Test SEO Alert System
 * Verify all monitoring and alert functionality
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
 * Test database connection
 */
async function testDatabaseConnection(db) {
  try {
    log('\n🔌 Testing database connection...', 'cyan');

    await db.command({ ping: 1 });
    log('  ✓ Database connection successful', 'green');
    return true;
  } catch (error) {
    log(`  ✗ Database connection failed: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Test collection existence
 */
async function testCollections(db) {
  try {
    log('\n📦 Checking required collections...', 'cyan');

    const requiredCollections = [
      'seo_rankings',
      'seo_404_errors',
      'seo_redirects',
      'seo_traffic_alerts',
    ];

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    let allExist = true;
    for (const name of requiredCollections) {
      if (collectionNames.includes(name)) {
        const count = await db.collection(name).countDocuments();
        log(`  ✓ ${name} exists (${count} documents)`, 'green');
      } else {
        log(`  ⚠️  ${name} doesn't exist yet`, 'yellow');
        allExist = false;
      }
    }

    return allExist;
  } catch (error) {
    log(`  ✗ Error checking collections: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Test environment variables
 */
function testEnvironmentVariables() {
  log('\n🔐 Checking environment variables...', 'cyan');

  const required = {
    'MONGODB_URI': process.env.MONGODB_URI,
    'NEXT_PUBLIC_SITE_URL': process.env.NEXT_PUBLIC_SITE_URL,
  };

  const optional = {
    'NEXT_PUBLIC_GTM_ID': process.env.NEXT_PUBLIC_GTM_ID,
    'NEXT_PUBLIC_GA4_ID': process.env.NEXT_PUBLIC_GA4_ID,
    'GOOGLE_CLIENT_EMAIL': process.env.GOOGLE_CLIENT_EMAIL,
    'GOOGLE_PRIVATE_KEY': process.env.GOOGLE_PRIVATE_KEY,
    'ALERT_EMAIL': process.env.ALERT_EMAIL,
  };

  let allRequired = true;
  for (const [key, value] of Object.entries(required)) {
    if (value) {
      log(`  ✓ ${key} configured`, 'green');
    } else {
      log(`  ✗ ${key} not configured`, 'red');
      allRequired = false;
    }
  }

  log('\n  Optional variables:', 'cyan');
  for (const [key, value] of Object.entries(optional)) {
    if (value) {
      log(`  ✓ ${key} configured`, 'green');
    } else {
      log(`  ⚠️  ${key} not configured`, 'yellow');
    }
  }

  return allRequired;
}

/**
 * Test Search Console API
 */
async function testSearchConsoleAPI() {
  try {
    log('\n🔍 Testing Search Console API...', 'cyan');

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      log('  ⚠️  Search Console API credentials not configured', 'yellow');
      log('  ℹ️  Run: npm run seo:setup', 'reset');
      return false;
    }

    // Just check if credentials are formatted correctly
    if (clientEmail.includes('@') && privateKey.includes('BEGIN PRIVATE KEY')) {
      log('  ✓ Credentials format looks correct', 'green');
      log('  ℹ️  Full API test requires actual API call', 'yellow');
      return true;
    } else {
      log('  ✗ Credentials format appears incorrect', 'red');
      return false;
    }
  } catch (error) {
    log(`  ✗ Error testing Search Console API: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Test alert insertion
 */
async function testAlertInsertion(db) {
  try {
    log('\n🚨 Testing alert insertion...', 'cyan');

    const testAlert = {
      type: 'drop',
      severity: 'low',
      metric: 'sessions',
      currentValue: 100,
      previousValue: 150,
      change: -50,
      changePercent: -33.33,
      message: 'Test alert - can be safely ignored',
      timestamp: new Date(),
      resolved: true,
      testAlert: true, // Mark as test
    };

    await db.collection('seo_traffic_alerts').insertOne(testAlert);
    log('  ✓ Successfully inserted test alert', 'green');

    // Clean up test alert
    await db.collection('seo_traffic_alerts').deleteOne({ testAlert: true });
    log('  ✓ Cleaned up test alert', 'green');

    return true;
  } catch (error) {
    log(`  ✗ Error testing alert insertion: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Test 404 logging
 */
async function test404Logging(db) {
  try {
    log('\n❌ Testing 404 error logging...', 'cyan');

    const test404 = {
      url: '/test-404-path',
      statusCode: 404,
      referrer: 'http://test.com',
      userAgent: 'Test User Agent',
      timestamp: new Date(),
      ip: '127.0.0.1',
      country: 'Test',
      testError: true, // Mark as test
    };

    await db.collection('seo_404_errors').insertOne(test404);
    log('  ✓ Successfully logged test 404 error', 'green');

    // Clean up test error
    await db.collection('seo_404_errors').deleteOne({ testError: true });
    log('  ✓ Cleaned up test 404 error', 'green');

    return true;
  } catch (error) {
    log(`  ✗ Error testing 404 logging: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Test ranking storage
 */
async function testRankingStorage(db) {
  try {
    log('\n📈 Testing ranking storage...', 'cyan');

    const testRanking = {
      keyword: 'test keyword',
      position: 42,
      url: 'https://example.com',
      searchEngine: 'google',
      country: 'pt',
      date: new Date(),
      testRanking: true, // Mark as test
    };

    await db.collection('seo_rankings').insertOne(testRanking);
    log('  ✓ Successfully stored test ranking', 'green');

    // Clean up test ranking
    await db.collection('seo_rankings').deleteOne({ testRanking: true });
    log('  ✓ Cleaned up test ranking', 'green');

    return true;
  } catch (error) {
    log(`  ✗ Error testing ranking storage: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Generate test summary
 */
function generateSummary(results) {
  log('\n' + '═'.repeat(70), 'cyan');
  log('                        TEST SUMMARY', 'bright');
  log('═'.repeat(70), 'cyan');

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter((r) => r).length;
  const failed = total - passed;

  log(`\nTotal Tests: ${total}`, 'reset');
  log(`Passed: ${passed}`, passed === total ? 'green' : 'yellow');
  log(`Failed: ${failed}`, failed === 0 ? 'green' : 'red');

  log('\nDetailed Results:', 'cyan');
  for (const [test, result] of Object.entries(results)) {
    const status = result ? '✓' : '✗';
    const color = result ? 'green' : 'red';
    log(`  ${status} ${test}`, color);
  }

  log('\n' + '═'.repeat(70), 'cyan');

  if (passed === total) {
    log('\n🎉 All tests passed! SEO monitoring system is ready.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Review the errors above.', 'yellow');

    log('\n💡 Common fixes:', 'cyan');
    log('  1. Run setup: npm run seo:setup', 'reset');
    log('  2. Check .env.local configuration', 'reset');
    log('  3. Verify MongoDB connection', 'reset');
    log('  4. Review documentation: /docs/SEO-MONITORING-SETUP.md', 'reset');
  }

  return passed === total;
}

/**
 * Main execution
 */
async function main() {
  log('🧪 Starting SEO Alert System Tests...', 'bright');

  const results = {};

  // Test environment variables
  results['Environment Variables'] = testEnvironmentVariables();

  let db;
  try {
    db = await connectToDatabase();

    // Test database connection
    results['Database Connection'] = await testDatabaseConnection(db);

    if (results['Database Connection']) {
      // Test collections
      results['Collections Setup'] = await testCollections(db);

      // Test Search Console API
      results['Search Console API'] = await testSearchConsoleAPI();

      // Test data insertion
      results['Alert Insertion'] = await testAlertInsertion(db);
      results['404 Error Logging'] = await test404Logging(db);
      results['Ranking Storage'] = await testRankingStorage(db);
    }

  } catch (error) {
    log(`\n❌ Test suite failed: ${error.message}`, 'red');
    results['Overall Execution'] = false;
  } finally {
    if (db) {
      await db.client.close();
    }
  }

  // Generate summary
  const allPassed = generateSummary(results);

  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  testDatabaseConnection,
  testCollections,
  testEnvironmentVariables,
  testSearchConsoleAPI,
};
