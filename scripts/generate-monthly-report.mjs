#!/usr/bin/env node

/**
 * Generate Monthly SEO Report
 * Comprehensive monthly summary with trends and insights
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
 * Get monthly ranking trends
 */
async function getMonthlyRankings(db) {
  try {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const rankings = await db
      .collection('seo_rankings')
      .find({ date: { $gte: monthAgo } })
      .toArray();

    // Group by keyword
    const byKeyword = {};
    rankings.forEach((r) => {
      if (!byKeyword[r.keyword]) {
        byKeyword[r.keyword] = [];
      }
      byKeyword[r.keyword].push(r);
    });

    // Calculate statistics
    const stats = {
      total: Object.keys(byKeyword).length,
      improved: 0,
      declined: 0,
      stable: 0,
      avgImprovement: 0,
      avgDecline: 0,
      topPerformers: [],
      needsAttention: [],
    };

    let totalImprovement = 0;
    let totalDecline = 0;
    let improvedCount = 0;
    let declinedCount = 0;

    Object.entries(byKeyword).forEach(([keyword, data]) => {
      if (data.length < 2) {
        stats.stable++;
        return;
      }

      data.sort((a, b) => new Date(a.date) - new Date(b.date));
      const oldest = data[0];
      const newest = data[data.length - 1];

      if (oldest.position && newest.position) {
        const change = oldest.position - newest.position;

        if (change > 0) {
          stats.improved++;
          totalImprovement += change;
          improvedCount++;
          stats.topPerformers.push({
            keyword,
            from: oldest.position,
            to: newest.position,
            change,
          });
        } else if (change < 0) {
          stats.declined++;
          totalDecline += Math.abs(change);
          declinedCount++;
          stats.needsAttention.push({
            keyword,
            from: oldest.position,
            to: newest.position,
            change,
          });
        } else {
          stats.stable++;
        }
      }
    });

    stats.avgImprovement = improvedCount > 0 ? totalImprovement / improvedCount : 0;
    stats.avgDecline = declinedCount > 0 ? totalDecline / declinedCount : 0;

    stats.topPerformers.sort((a, b) => b.change - a.change);
    stats.needsAttention.sort((a, b) => a.change - b.change);

    return stats;
  } catch (error) {
    log(`Error getting monthly rankings: ${error.message}`, 'red');
    return null;
  }
}

/**
 * Get monthly error summary
 */
async function getMonthlyErrors(db) {
  try {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const total404s = await db
      .collection('seo_404_errors')
      .countDocuments({ timestamp: { $gte: monthAgo } });

    const totalRedirects = await db
      .collection('seo_redirects')
      .countDocuments({ timestamp: { $gte: monthAgo } });

    const top404s = await db
      .collection('seo_404_errors')
      .aggregate([
        { $match: { timestamp: { $gte: monthAgo } } },
        {
          $group: {
            _id: '$url',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    return {
      total404s,
      totalRedirects,
      top404s: top404s.map((e) => ({
        url: e._id,
        count: e.count,
      })),
      avg404sPerDay: Math.round(total404s / 30),
    };
  } catch (error) {
    log(`Error getting monthly errors: ${error.message}`, 'red');
    return null;
  }
}

/**
 * Get monthly alert summary
 */
async function getMonthlyAlerts(db) {
  try {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const alerts = await db
      .collection('seo_traffic_alerts')
      .find({ timestamp: { $gte: monthAgo } })
      .toArray();

    const summary = {
      total: alerts.length,
      bySeverity: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      },
      byType: {
        drop: 0,
        spike: 0,
        anomaly: 0,
      },
      resolved: alerts.filter((a) => a.resolved).length,
      unresolved: alerts.filter((a) => !a.resolved).length,
    };

    alerts.forEach((alert) => {
      summary.bySeverity[alert.severity]++;
      summary.byType[alert.type]++;
    });

    return summary;
  } catch (error) {
    log(`Error getting monthly alerts: ${error.message}`, 'red');
    return null;
  }
}

/**
 * Generate comprehensive report
 */
function generateMonthlyReport(data) {
  const { rankings, errors, alerts } = data;
  const now = new Date();
  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  let report = `
╔═══════════════════════════════════════════════════════════════════╗
║                   MONTHLY SEO REPORT                              ║
║                  ${monthName.padStart(28)}                        ║
║                  JC Hair Studio's 62                              ║
╚═══════════════════════════════════════════════════════════════════╝

📅 Period: ${monthAgo.toLocaleDateString()} - ${now.toLocaleDateString()}
📊 Generated: ${now.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 EXECUTIVE SUMMARY

RANKINGS:
• Total Keywords: ${rankings.total}
• Improved: ${rankings.improved} (${((rankings.improved / rankings.total) * 100).toFixed(1)}%)
• Declined: ${rankings.declined} (${((rankings.declined / rankings.total) * 100).toFixed(1)}%)
• Stable: ${rankings.stable} (${((rankings.stable / rankings.total) * 100).toFixed(1)}%)
• Avg Improvement: ${rankings.avgImprovement.toFixed(1)} positions
• Avg Decline: ${rankings.avgDecline.toFixed(1)} positions

ERRORS:
• Total 404 Errors: ${errors.total404s}
• Avg 404s/Day: ${errors.avg404sPerDay}
• Total Redirects: ${errors.totalRedirects}

ALERTS:
• Total Alerts: ${alerts.total}
• Critical: ${alerts.bySeverity.critical}
• High: ${alerts.bySeverity.high}
• Unresolved: ${alerts.unresolved}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏆 TOP PERFORMING KEYWORDS

`;

  if (rankings.topPerformers.length > 0) {
    rankings.topPerformers.slice(0, 10).forEach((r, index) => {
      report += `${index + 1}. "${r.keyword}"
   Position: ${r.from} → ${r.to} (↑ ${r.change} positions)

`;
    });
  } else {
    report += `No significant improvements this month.\n`;
  }

  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  KEYWORDS NEEDING ATTENTION

`;

  if (rankings.needsAttention.length > 0) {
    rankings.needsAttention.slice(0, 10).forEach((r, index) => {
      report += `${index + 1}. "${r.keyword}"
   Position: ${r.from} → ${r.to} (↓ ${Math.abs(r.change)} positions)

`;
    });
  } else {
    report += `No keywords in decline this month! 🎉\n`;
  }

  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ TOP 404 ERRORS

`;

  if (errors.top404s.length > 0) {
    errors.top404s.slice(0, 10).forEach((e, index) => {
      report += `${index + 1}. ${e.url}
   Occurrences: ${e.count}

`;
    });
  } else {
    report += `No 404 errors this month! 🎉\n`;
  }

  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 ALERT SUMMARY

Traffic Drops: ${alerts.byType.drop}
Traffic Spikes: ${alerts.byType.spike}
Anomalies: ${alerts.byType.anomaly}

By Severity:
• Critical: ${alerts.bySeverity.critical}
• High: ${alerts.bySeverity.high}
• Medium: ${alerts.bySeverity.medium}
• Low: ${alerts.bySeverity.low}

Resolution Rate: ${((alerts.resolved / alerts.total) * 100).toFixed(1)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 STRATEGIC RECOMMENDATIONS

`;

  const recommendations = [];

  if (rankings.declined > rankings.improved) {
    recommendations.push(`
🔴 CRITICAL: More keywords declining than improving
   Action: Review content strategy and competitor activity
   Priority: HIGH
`);
  }

  if (rankings.improved > rankings.declined) {
    recommendations.push(`
✅ POSITIVE: SEO improvements showing results
   Action: Continue current optimization efforts
   Priority: MAINTAIN
`);
  }

  if (errors.avg404sPerDay > 10) {
    recommendations.push(`
⚠️  HIGH: ${errors.avg404sPerDay} 404 errors per day
   Action: Implement 301 redirects for most common errors
   Priority: HIGH
`);
  }

  if (alerts.bySeverity.critical > 0 || alerts.bySeverity.high > 0) {
    recommendations.push(`
🚨 URGENT: ${alerts.bySeverity.critical + alerts.bySeverity.high} critical/high alerts
   Action: Review and resolve immediately
   Priority: CRITICAL
`);
  }

  if (alerts.unresolved > alerts.total * 0.3) {
    recommendations.push(`
⚠️  ${alerts.unresolved} unresolved alerts (${((alerts.unresolved / alerts.total) * 100).toFixed(1)}%)
   Action: Review alert resolution process
   Priority: MEDIUM
`);
  }

  if (recommendations.length === 0) {
    recommendations.push(`
✅ EXCELLENT: All metrics within acceptable ranges
   Action: Maintain current practices
   Priority: MONITOR
`);
  }

  recommendations.forEach((r) => (report += r));

  report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 NEXT MONTH GOALS

1. Improve ${Math.min(5, rankings.needsAttention.length)} declining keywords
2. Reduce 404 errors by 25%
3. Resolve all critical/high priority alerts
4. Maintain top 10 rankings for priority keywords
5. Continue monitoring and optimization

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 RESOURCES

• Dashboard: https://jchairstudios62.xyz/admin/seo
• Search Console: https://search.google.com/search-console
• Analytics: https://analytics.google.com
• Documentation: /docs/SEO-MONITORING-SETUP.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated by JC Hair Studio SEO Monitoring System
Report Period: ${monthName}
`;

  return report;
}

/**
 * Save report
 */
function saveReport(report) {
  try {
    const reportsDir = path.join(__dirname, '..', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const date = new Date();
    const monthYear = date.toISOString().slice(0, 7); // YYYY-MM
    const filename = `monthly-seo-report-${monthYear}.txt`;
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
  log('📊 Generating monthly SEO report...', 'bright');

  let db;
  try {
    db = await connectToDatabase();
    log('✅ Connected to database', 'green');

    log('Analyzing monthly rankings...', 'cyan');
    const rankings = await getMonthlyRankings(db);

    log('Analyzing monthly errors...', 'cyan');
    const errors = await getMonthlyErrors(db);

    log('Analyzing monthly alerts...', 'cyan');
    const alerts = await getMonthlyAlerts(db);

    log('Generating comprehensive report...', 'cyan');
    const report = generateMonthlyReport({ rankings, errors, alerts });

    console.log('\n' + report);

    const filepath = saveReport(report);

    log('\n✅ Monthly report generated!', 'green');

    if (filepath) {
      log(`\n📧 To email this report:`, 'cyan');
      log(`   cat "${filepath}" | mail -s "Monthly SEO Report" your@email.com`, 'reset');
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

export { generateMonthlyReport, getMonthlyRankings, getMonthlyErrors, getMonthlyAlerts };
