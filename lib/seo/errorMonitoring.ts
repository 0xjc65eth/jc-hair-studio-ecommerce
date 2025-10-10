/**
 * SEO Error Monitoring System
 * Track 404s, redirects, and broken links
 */

import { sendEmail } from '@/lib/utils/email';

interface ErrorLog {
  url: string;
  statusCode: number;
  referrer?: string;
  userAgent?: string;
  timestamp: Date;
  ip?: string;
  country?: string;
}

interface RedirectLog {
  from: string;
  to: string;
  statusCode: number;
  timestamp: Date;
}

/**
 * Log 404 error
 */
export async function log404Error(
  errorData: ErrorLog,
  dbConnection: any
): Promise<void> {
  try {
    const collection = dbConnection.collection('seo_404_errors');

    await collection.insertOne({
      ...errorData,
      type: '404',
      createdAt: new Date(),
    });

    // Check if this URL has been reported multiple times
    const count = await collection.countDocuments({
      url: errorData.url,
      timestamp: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    });

    // Alert if URL has been hit more than 10 times in 24h
    if (count >= 10) {
      await sendErrorAlert('404', errorData, count);
    }
  } catch (error) {
    console.error('Error logging 404:', error);
  }
}

/**
 * Log redirect
 */
export async function logRedirect(
  redirectData: RedirectLog,
  dbConnection: any
): Promise<void> {
  try {
    const collection = dbConnection.collection('seo_redirects');

    await collection.insertOne({
      ...redirectData,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error logging redirect:', error);
  }
}

/**
 * Get 404 errors report
 */
export async function get404Report(
  dbConnection: any,
  days = 7
): Promise<{
  total: number;
  byUrl: Array<{ url: string; count: number; lastSeen: Date }>;
  byReferrer: Array<{ referrer: string; count: number }>;
}> {
  try {
    const collection = dbConnection.collection('seo_404_errors');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total 404s
    const total = await collection.countDocuments({
      timestamp: { $gte: startDate },
    });

    // Group by URL
    const byUrl = await collection
      .aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        {
          $group: {
            _id: '$url',
            count: { $sum: 1 },
            lastSeen: { $max: '$timestamp' },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 50 },
      ])
      .toArray();

    // Group by referrer
    const byReferrer = await collection
      .aggregate([
        {
          $match: {
            timestamp: { $gte: startDate },
            referrer: { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: '$referrer',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ])
      .toArray();

    return {
      total,
      byUrl: byUrl.map((item) => ({
        url: item._id,
        count: item.count,
        lastSeen: item.lastSeen,
      })),
      byReferrer: byReferrer.map((item) => ({
        referrer: item._id,
        count: item.count,
      })),
    };
  } catch (error) {
    console.error('Error getting 404 report:', error);
    throw error;
  }
}

/**
 * Get redirect report
 */
export async function getRedirectReport(
  dbConnection: any,
  days = 30
): Promise<{
  total: number;
  bySource: Array<{ from: string; to: string; count: number }>;
  redirectChains: Array<{ chain: string[]; count: number }>;
}> {
  try {
    const collection = dbConnection.collection('seo_redirects');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total redirects
    const total = await collection.countDocuments({
      timestamp: { $gte: startDate },
    });

    // Group by source
    const bySource = await collection
      .aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        {
          $group: {
            _id: { from: '$from', to: '$to' },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 50 },
      ])
      .toArray();

    return {
      total,
      bySource: bySource.map((item) => ({
        from: item._id.from,
        to: item._id.to,
        count: item.count,
      })),
      redirectChains: [], // TODO: Implement redirect chain detection
    };
  } catch (error) {
    console.error('Error getting redirect report:', error);
    throw error;
  }
}

/**
 * Find broken internal links
 */
export async function findBrokenInternalLinks(
  dbConnection: any
): Promise<Array<{ url: string; referrer: string; count: number }>> {
  try {
    const collection = dbConnection.collection('seo_404_errors');

    const brokenLinks = await collection
      .aggregate([
        {
          $match: {
            referrer: { $exists: true, $ne: null },
            // Filter for internal referrers only
            $expr: {
              $regexMatch: {
                input: '$referrer',
                regex: 'jchairstudios62.xyz',
              },
            },
          },
        },
        {
          $group: {
            _id: { url: '$url', referrer: '$referrer' },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 100 },
      ])
      .toArray();

    return brokenLinks.map((item) => ({
      url: item._id.url,
      referrer: item._id.referrer,
      count: item.count,
    }));
  } catch (error) {
    console.error('Error finding broken internal links:', error);
    throw error;
  }
}

/**
 * Send error alert email
 */
async function sendErrorAlert(
  errorType: string,
  errorData: ErrorLog,
  count: number
): Promise<void> {
  try {
    const subject = `[SEO Alert] ${errorType} Error: ${errorData.url}`;
    const html = `
      <h2>SEO Error Alert</h2>
      <p><strong>Error Type:</strong> ${errorType}</p>
      <p><strong>URL:</strong> ${errorData.url}</p>
      <p><strong>Occurrences (24h):</strong> ${count}</p>
      <p><strong>Last Referrer:</strong> ${errorData.referrer || 'Direct'}</p>
      <p><strong>User Agent:</strong> ${errorData.userAgent || 'Unknown'}</p>
      <p><strong>Country:</strong> ${errorData.country || 'Unknown'}</p>
      <hr />
      <p><small>This is an automated alert from your SEO monitoring system.</small></p>
    `;

    await sendEmail({
      to: process.env.ALERT_EMAIL || process.env.SUPPORT_EMAIL || 'admin@jchairstudios62.xyz',
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending error alert:', error);
  }
}

/**
 * Suggest redirects for common 404s
 */
export async function suggestRedirects(
  dbConnection: any
): Promise<Array<{ from: string; suggestedTo: string[]; score: number }>> {
  try {
    const collection = dbConnection.collection('seo_404_errors');

    // Get most common 404s from last 30 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const common404s = await collection
      .aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        {
          $group: {
            _id: '$url',
            count: { $sum: 1 },
          },
        },
        { $match: { count: { $gte: 5 } } },
        { $sort: { count: -1 } },
        { $limit: 50 },
      ])
      .toArray();

    // TODO: Implement smart redirect suggestions based on:
    // 1. URL similarity (Levenshtein distance)
    // 2. Content similarity (if original page was indexed)
    // 3. User behavior patterns

    return common404s.map((item) => ({
      from: item._id,
      suggestedTo: [], // Placeholder for actual suggestions
      score: item.count,
    }));
  } catch (error) {
    console.error('Error suggesting redirects:', error);
    throw error;
  }
}

/**
 * Export 404 report to CSV
 */
export function export404ToCSV(
  report: Awaited<ReturnType<typeof get404Report>>
): string {
  const headers = ['URL', 'Count', 'Last Seen'];

  const rows = report.byUrl.map((item) => [
    item.url,
    item.count.toString(),
    item.lastSeen.toISOString().split('T')[0],
  ]);

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

  return csv;
}

/**
 * Detect redirect chains (multiple redirects for same URL)
 */
export async function detectRedirectChains(
  dbConnection: any
): Promise<Array<{ chain: string[]; length: number }>> {
  try {
    const collection = dbConnection.collection('seo_redirects');

    const redirects = await collection
      .find({})
      .sort({ timestamp: 1 })
      .toArray();

    const chains: Map<string, string[]> = new Map();

    // Build redirect chains
    for (const redirect of redirects) {
      const from = redirect.from;
      const to = redirect.to;

      // Check if 'from' is the end of an existing chain
      for (const [start, chain] of chains.entries()) {
        if (chain[chain.length - 1] === from) {
          chain.push(to);
          break;
        }
      }

      // Start new chain
      if (!Array.from(chains.values()).some((chain) => chain.includes(from))) {
        chains.set(from, [from, to]);
      }
    }

    // Filter chains with length > 2 (problematic)
    const problematicChains = Array.from(chains.values())
      .filter((chain) => chain.length > 2)
      .map((chain) => ({
        chain,
        length: chain.length,
      }))
      .sort((a, b) => b.length - a.length);

    return problematicChains;
  } catch (error) {
    console.error('Error detecting redirect chains:', error);
    throw error;
  }
}

/**
 * Clean old error logs (keep last 90 days)
 */
export async function cleanOldErrorLogs(dbConnection: any): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);

    const result404 = await dbConnection
      .collection('seo_404_errors')
      .deleteMany({ timestamp: { $lt: cutoffDate } });

    const resultRedirects = await dbConnection
      .collection('seo_redirects')
      .deleteMany({ timestamp: { $lt: cutoffDate } });

    return result404.deletedCount + resultRedirects.deletedCount;
  } catch (error) {
    console.error('Error cleaning old error logs:', error);
    throw error;
  }
}
