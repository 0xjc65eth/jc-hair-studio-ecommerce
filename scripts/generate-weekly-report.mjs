#!/usr/bin/env node

/**
 * Generate Weekly SEO Report
 * Comprehensive weekly summary of SEO metrics
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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
 * Get weekly ranking stats
 */
async function getWeeklyRankings(db) {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const rankings = await db
      .collection('seo_rankings')
      .find({ date: { $gte: weekAgo } })
      .toArray();

    const byKeyword = {};
    rankings.forEach((r) => {
      if (!byKeyword[r.keyword]) {
        byKeyword[r.keyword] = [];
      }
      byKeyword[r.keyword].push(r);
    });

    const improvements = [];
    const declines = [];

    Object.entries(byKeyword).forEach(([keyword, data]) => {
      if (data.length < 2) return;

      data.sort((a, b) => new Date(a.date) - new Date(b.date));
      const oldest = data[0];
      const newest = data[data.length - 1];

      if (oldest.position && newest.position) {
        const change = oldest.position - newest.position;

        if (change > 0) {
          improvements.push({ keyword, from: oldest.position, to: newest.position, change });
        } else if (change < 0) {
          declines.push({ keyword, from: oldest.position, to: newest.position, change });
        }
      }
    });

    return {
      total: Object.keys(byKeyword).length,
      improvements: improvements.sort((a, b) => b.change - a.change),
      declines: declines.sort((a, b) => a.change - b.change),
    };
  } catch (error) {
    log(`Error getting rankings: ${error.message}`, 'red');
    return { total: 0, improvements: [], declines: [] };
  }
}

/**
 * Get weekly 404 errors
 */
async function getWeekly404s(db) {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const errors = await db
      .collection('seo_404_errors')
      .aggregate([
        { $match: { timestamp: { $gte: weekAgo } } },
        {
          $group: {
            _id: '$url',
            count: { $sum: 1 },
            lastSeen: { $max: '$timestamp' },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    const total = await db
      .collection('seo_404_errors')
      .countDocuments({ timestamp: { $gte: weekAgo } });

    return {
      total,
      topErrors: errors.map((e) => ({
        url: e._id,
        count: e.count,
        lastSeen: e.lastSeen,
      })),
    };
  } catch (error) {
    log(`Error getting 404s: ${error.message}`, 'red');
    return { total: 0, topErrors: [] };
  }
}

/**
 * Get weekly traffic alerts
 */
async function getWeeklyAlerts(db) {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const alerts = await db
      .collection('seo_traffic_alerts')
      .find({ timestamp: { $gte: weekAgo } })
      .sort({ timestamp: -1 })
      .toArray();

    const bySeverity = {
      critical: alerts.filter((a) => a.severity === 'critical').length,
      high: alerts.filter((a) => a.severity === 'high').length,
      medium: alerts.filter((a) => a.severity === 'medium').length,
      low: alerts.filter((a) => a.severity === 'low').length,
    };

    return {
      total: alerts.length,
      bySeverity,
      criticalAlerts: alerts
        .filter((a) => a.severity === 'critical' || a.severity === 'high')
        .slice(0, 5),
    };
  } catch (error) {
    log(`Error getting alerts: ${error.message}`, 'red');
    return { total: 0, bySeverity: {}, criticalAlerts: [] };
  }
}

/**
 * Generate report text
 */
function generateReportText(data) {
  const { rankings, errors404, alerts } = data;
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let report = `
╔═══════════════════════════════════════════════════════════════════╗
║                    WEEKLY SEO REPORT                              ║
║                  JC Hair Studio's 62                              ║
╚═══════════════════════════════════════════════════════════════════╝

📅 Period: ${weekAgo.toLocaleDateString()} - ${now.toLocaleDateString()}
📊 Generated: ${now.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 KEYWORD RANKINGS

Total Keywords Tracked: ${rankings.total}
Improvements: ${rankings.improvements.length}
Declines: ${rankings.declines.length}
Stable: ${rankings.total - rankings.improvements.length - rankings.declines.length}

`;

  if (rankings.improvements.length > 0) {
    report += `\n✅ TOP IMPROVEMENTS:\n`;
    rankings.improvements.slice(0, 5).forEach((r) => {
      report += `   ↑ "${r.keyword}": ${r.from} → ${r.to} (+${r.change} positions)\n`;
    });
  }

  if (rankings.declines.length > 0) {
    report += `\n⚠️  TOP DECLINES:\n`;
    rankings.declines.slice(0, 5).forEach((r) => {
      report += `   ↓ "${r.keyword}": ${r.from} → ${r.to} (${r.change} positions)\n`;
    });
  }

  report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ 404 ERRORS

Total Errors: ${errors404.total}
Unique URLs: ${errors404.topErrors.length}

`;

  if (errors404.topErrors.length > 0) {
    report += `\nMOST FREQUENT:\n`;
    errors404.topErrors.slice(0, 5).forEach((e) => {
      report += `   ${e.count}x - ${e.url}\n`;
    });
  } else {
    report += `✅ No 404 errors this week!\n`;
  }

  report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 TRAFFIC ALERTS

Total Alerts: ${alerts.total}
Critical: ${alerts.bySeverity.critical || 0}
High: ${alerts.bySeverity.high || 0}
Medium: ${alerts.bySeverity.medium || 0}
Low: ${alerts.bySeverity.low || 0}

`;

  if (alerts.criticalAlerts.length > 0) {
    report += `\n⚠️  CRITICAL ALERTS:\n`;
    alerts.criticalAlerts.forEach((a) => {
      report += `   ${a.type.toUpperCase()}: ${a.message}\n`;
      report += `   Detected: ${new Date(a.timestamp).toLocaleString()}\n\n`;
    });
  } else {
    report += `✅ No critical alerts this week!\n`;
  }

  report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 RECOMMENDATIONS

`;

  const recommendations = [];

  if (rankings.declines.length > 5) {
    recommendations.push('• Multiple keywords declining - review content strategy');
  }

  if (errors404.total > 50) {
    recommendations.push('• High number of 404 errors - implement redirects');
  }

  if (alerts.bySeverity.critical > 0 || alerts.bySeverity.high > 0) {
    recommendations.push('• Critical alerts detected - immediate action required');
  }

  if (rankings.improvements.length > 0) {
    recommendations.push('• Continue current optimization efforts - showing positive results');
  }

  if (recommendations.length === 0) {
    recommendations.push('• Maintain current SEO practices');
    recommendations.push('• Continue monitoring metrics regularly');
  }

  recommendations.forEach((r) => (report += `${r}\n`));

  report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Next Steps:

1. Review full dashboard: https://jchairstudios62.xyz/admin/seo
2. Check Search Console: https://search.google.com/search-console
3. Monitor rankings: npm run seo:track-rankings
4. Fix 404 errors: Review dashboard error tab

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated by JC Hair Studio SEO Monitoring System
`;

  return report;
}

/**
 * Save report to file
 */
function saveReport(report) {
  try {
    const reportsDir = path.join(__dirname, '..', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const date = new Date();
    const filename = `weekly-seo-report-${date.toISOString().split('T')[0]}.txt`;
    const filepath = path.join(reportsDir, filename);

    fs.writeFileSync(filepath, report);

    log(`📄 Report saved: ${filepath}`, 'green');
    return filepath;
  } catch (error) {
    log(`Error saving report: ${error.message}`, 'red');
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  log('📊 Generating weekly SEO report...', 'bright');

  let db;
  try {
    db = await connectToDatabase();
    log('✅ Connected to database', 'green');

    // Collect data
    log('Collecting ranking data...', 'cyan');
    const rankings = await getWeeklyRankings(db);

    log('Collecting 404 errors...', 'cyan');
    const errors404 = await getWeekly404s(db);

    log('Collecting traffic alerts...', 'cyan');
    const alerts = await getWeeklyAlerts(db);

    // Generate report
    log('Generating report...', 'cyan');
    const report = generateReportText({ rankings, errors404, alerts });

    // Output to console
    console.log('\n' + report);

    // Save to file
    const filepath = saveReport(report);

    log('\n✅ Weekly report generated!', 'green');

    if (filepath) {
      log(`\n📧 To email this report, use:`, 'cyan');
      log(`   cat ${filepath} | mail -s "Weekly SEO Report" your@email.com`, 'reset');
    }

  } catch (error) {
    log(`\n❌ Report generation failed: ${error.message}`, 'red');
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

export { generateReportText, getWeeklyRankings, getWeekly404s, getWeeklyAlerts };
