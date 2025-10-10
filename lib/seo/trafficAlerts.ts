/**
 * Traffic Drop Alert System
 * Monitor traffic patterns and send alerts for significant changes
 */

import { sendEmail } from '@/lib/utils/email';

interface TrafficData {
  date: Date;
  sessions: number;
  pageviews: number;
  users: number;
  bounceRate: number;
  avgSessionDuration: number;
  source?: string;
}

interface TrafficAlert {
  type: 'drop' | 'spike' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  metric: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  message: string;
  timestamp: Date;
}

/**
 * Calculate traffic metrics
 */
export function calculateTrafficMetrics(
  current: TrafficData,
  previous: TrafficData
): {
  sessionsChange: number;
  pageviewsChange: number;
  usersChange: number;
  bounceRateChange: number;
} {
  return {
    sessionsChange:
      ((current.sessions - previous.sessions) / previous.sessions) * 100,
    pageviewsChange:
      ((current.pageviews - previous.pageviews) / previous.pageviews) * 100,
    usersChange: ((current.users - previous.users) / previous.users) * 100,
    bounceRateChange:
      ((current.bounceRate - previous.bounceRate) / previous.bounceRate) * 100,
  };
}

/**
 * Check for traffic anomalies
 */
export function detectTrafficAnomalies(
  currentData: TrafficData,
  historicalData: TrafficData[],
  thresholds = {
    sessionsDropPercent: -20,
    sessionsSpikePercent: 50,
    bounceRateIncreasePercent: 30,
  }
): TrafficAlert[] {
  const alerts: TrafficAlert[] = [];

  if (historicalData.length === 0) return alerts;

  // Calculate averages from historical data
  const avgSessions =
    historicalData.reduce((sum, data) => sum + data.sessions, 0) /
    historicalData.length;
  const avgPageviews =
    historicalData.reduce((sum, data) => sum + data.pageviews, 0) /
    historicalData.length;
  const avgUsers =
    historicalData.reduce((sum, data) => sum + data.users, 0) /
    historicalData.length;
  const avgBounceRate =
    historicalData.reduce((sum, data) => sum + data.bounceRate, 0) /
    historicalData.length;

  // Check sessions drop
  const sessionsChange =
    ((currentData.sessions - avgSessions) / avgSessions) * 100;
  if (sessionsChange <= thresholds.sessionsDropPercent) {
    alerts.push({
      type: 'drop',
      severity: sessionsChange <= -50 ? 'critical' : sessionsChange <= -30 ? 'high' : 'medium',
      metric: 'sessions',
      currentValue: currentData.sessions,
      previousValue: avgSessions,
      change: currentData.sessions - avgSessions,
      changePercent: sessionsChange,
      message: `Sessions dropped by ${Math.abs(sessionsChange).toFixed(1)}%`,
      timestamp: new Date(),
    });
  }

  // Check sessions spike
  if (sessionsChange >= thresholds.sessionsSpikePercent) {
    alerts.push({
      type: 'spike',
      severity: 'low',
      metric: 'sessions',
      currentValue: currentData.sessions,
      previousValue: avgSessions,
      change: currentData.sessions - avgSessions,
      changePercent: sessionsChange,
      message: `Sessions spiked by ${sessionsChange.toFixed(1)}%`,
      timestamp: new Date(),
    });
  }

  // Check bounce rate increase
  const bounceRateChange =
    ((currentData.bounceRate - avgBounceRate) / avgBounceRate) * 100;
  if (bounceRateChange >= thresholds.bounceRateIncreasePercent) {
    alerts.push({
      type: 'anomaly',
      severity: bounceRateChange >= 50 ? 'high' : 'medium',
      metric: 'bounce_rate',
      currentValue: currentData.bounceRate,
      previousValue: avgBounceRate,
      change: currentData.bounceRate - avgBounceRate,
      changePercent: bounceRateChange,
      message: `Bounce rate increased by ${bounceRateChange.toFixed(1)}%`,
      timestamp: new Date(),
    });
  }

  // Check pageviews drop
  const pageviewsChange =
    ((currentData.pageviews - avgPageviews) / avgPageviews) * 100;
  if (pageviewsChange <= thresholds.sessionsDropPercent) {
    alerts.push({
      type: 'drop',
      severity: pageviewsChange <= -50 ? 'critical' : pageviewsChange <= -30 ? 'high' : 'medium',
      metric: 'pageviews',
      currentValue: currentData.pageviews,
      previousValue: avgPageviews,
      change: currentData.pageviews - avgPageviews,
      changePercent: pageviewsChange,
      message: `Pageviews dropped by ${Math.abs(pageviewsChange).toFixed(1)}%`,
      timestamp: new Date(),
    });
  }

  return alerts;
}

/**
 * Send traffic alert email
 */
export async function sendTrafficAlert(alert: TrafficAlert): Promise<void> {
  try {
    const severityColors = {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#FF5722',
      critical: '#D32F2F',
    };

    const subject = `[SEO Alert ${alert.severity.toUpperCase()}] Traffic ${alert.type}: ${alert.metric}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: ${severityColors[alert.severity]}; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .metric { background-color: #f5f5f5; padding: 15px; margin: 10px 0; border-left: 4px solid ${severityColors[alert.severity]}; }
            .metric h3 { margin: 0 0 10px 0; }
            .value { font-size: 24px; font-weight: bold; }
            .change { font-size: 18px; color: ${alert.type === 'drop' ? '#D32F2F' : '#4CAF50'}; }
            .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            .recommendations { background-color: #E3F2FD; padding: 15px; margin: 20px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚨 Traffic Alert: ${alert.type.toUpperCase()}</h1>
            <p>Severity: ${alert.severity.toUpperCase()}</p>
          </div>

          <div class="content">
            <div class="metric">
              <h3>${alert.metric.replace('_', ' ').toUpperCase()}</h3>
              <div class="value">
                Current: ${alert.currentValue.toLocaleString()}
              </div>
              <div>
                Previous Average: ${alert.previousValue.toLocaleString()}
              </div>
              <div class="change">
                Change: ${alert.change > 0 ? '+' : ''}${alert.change.toLocaleString()} (${alert.changePercent > 0 ? '+' : ''}${alert.changePercent.toFixed(1)}%)
              </div>
            </div>

            <p><strong>Message:</strong> ${alert.message}</p>
            <p><strong>Detected at:</strong> ${alert.timestamp.toLocaleString()}</p>

            <div class="recommendations">
              <h3>📊 Recommended Actions:</h3>
              <ul>
                ${getRecommendations(alert).map((rec) => `<li>${rec}</li>`).join('')}
              </ul>
            </div>

            <div style="margin-top: 20px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/analytics"
                 style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Analytics Dashboard
              </a>
            </div>
          </div>

          <div class="footer">
            <p>This is an automated alert from your SEO monitoring system.</p>
            <p>JC Hair Studio's 62 - SEO Monitoring</p>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      to: process.env.ALERT_EMAIL || process.env.SUPPORT_EMAIL || 'admin@jchairstudios62.xyz',
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending traffic alert:', error);
  }
}

/**
 * Get recommendations based on alert type
 */
function getRecommendations(alert: TrafficAlert): string[] {
  const recommendations: string[] = [];

  switch (alert.metric) {
    case 'sessions':
      if (alert.type === 'drop') {
        recommendations.push(
          'Check Google Search Console for indexing issues',
          'Review recent algorithm updates',
          'Verify robots.txt and sitemap.xml are accessible',
          'Check for manual penalties in Search Console',
          'Review recent site changes or deployments',
          'Analyze competitor activity and rankings'
        );
      }
      break;

    case 'bounce_rate':
      if (alert.type === 'anomaly') {
        recommendations.push(
          'Check page load speed and Core Web Vitals',
          'Review recent content or design changes',
          'Verify mobile responsiveness',
          'Check for broken links or images',
          'Review landing page relevance to search queries',
          'Test cross-browser compatibility'
        );
      }
      break;

    case 'pageviews':
      if (alert.type === 'drop') {
        recommendations.push(
          'Review internal linking structure',
          'Check for broken navigation elements',
          'Analyze user journey and exit pages',
          'Verify tracking code is working correctly',
          'Review content engagement metrics'
        );
      }
      break;
  }

  return recommendations;
}

/**
 * Store alert in database
 */
export async function storeTrafficAlert(
  alert: TrafficAlert,
  dbConnection: any
): Promise<void> {
  try {
    const collection = dbConnection.collection('seo_traffic_alerts');

    await collection.insertOne({
      ...alert,
      resolved: false,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error storing traffic alert:', error);
  }
}

/**
 * Get unresolved alerts
 */
export async function getUnresolvedAlerts(
  dbConnection: any
): Promise<TrafficAlert[]> {
  try {
    const collection = dbConnection.collection('seo_traffic_alerts');

    const alerts = await collection
      .find({ resolved: false })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    return alerts as TrafficAlert[];
  } catch (error) {
    console.error('Error fetching unresolved alerts:', error);
    throw error;
  }
}

/**
 * Mark alert as resolved
 */
export async function resolveAlert(
  alertId: string,
  dbConnection: any
): Promise<void> {
  try {
    const collection = dbConnection.collection('seo_traffic_alerts');

    await collection.updateOne(
      { _id: alertId },
      {
        $set: {
          resolved: true,
          resolvedAt: new Date(),
        },
      }
    );
  } catch (error) {
    console.error('Error resolving alert:', error);
    throw error;
  }
}

/**
 * Monitor traffic continuously
 */
export async function monitorTraffic(
  getCurrentTraffic: () => Promise<TrafficData>,
  getHistoricalTraffic: (days: number) => Promise<TrafficData[]>,
  dbConnection: any
): Promise<TrafficAlert[]> {
  try {
    const currentData = await getCurrentTraffic();
    const historicalData = await getHistoricalTraffic(7); // Last 7 days

    const alerts = detectTrafficAnomalies(currentData, historicalData);

    // Store and send alerts
    for (const alert of alerts) {
      if (alert.severity === 'high' || alert.severity === 'critical') {
        await Promise.all([
          storeTrafficAlert(alert, dbConnection),
          sendTrafficAlert(alert),
        ]);
      } else {
        await storeTrafficAlert(alert, dbConnection);
      }
    }

    return alerts;
  } catch (error) {
    console.error('Error monitoring traffic:', error);
    throw error;
  }
}

/**
 * Get traffic summary
 */
export async function getTrafficSummary(
  dbConnection: any,
  days = 30
): Promise<{
  totalAlerts: number;
  alertsByType: Record<string, number>;
  alertsBySeverity: Record<string, number>;
  criticalAlerts: TrafficAlert[];
}> {
  try {
    const collection = dbConnection.collection('seo_traffic_alerts');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const alerts = await collection
      .find({ timestamp: { $gte: startDate } })
      .toArray();

    const alertsByType: Record<string, number> = {};
    const alertsBySeverity: Record<string, number> = {};

    for (const alert of alerts) {
      alertsByType[alert.type] = (alertsByType[alert.type] || 0) + 1;
      alertsBySeverity[alert.severity] =
        (alertsBySeverity[alert.severity] || 0) + 1;
    }

    const criticalAlerts = await collection
      .find({
        timestamp: { $gte: startDate },
        severity: { $in: ['high', 'critical'] },
        resolved: false,
      })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    return {
      totalAlerts: alerts.length,
      alertsByType,
      alertsBySeverity,
      criticalAlerts: criticalAlerts as TrafficAlert[],
    };
  } catch (error) {
    console.error('Error getting traffic summary:', error);
    throw error;
  }
}
