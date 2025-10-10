/**
 * SEO Dashboard API
 * Provides comprehensive SEO metrics and monitoring data
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import {
  getSearchAnalytics,
  getTopQueries,
  getTopPages,
} from '@/lib/seo/searchConsole';
import { get404Report, getRedirectReport } from '@/lib/seo/errorMonitoring';
import { getTrafficSummary } from '@/lib/seo/trafficAlerts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric');
    const startDate = searchParams.get('startDate') || getDateDaysAgo(7);
    const endDate = searchParams.get('endDate') || getDateToday();

    // Verify authentication
    // TODO: Implement proper admin authentication
    const isAdmin = true; // Replace with actual auth check

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await connectToDatabase();

    // Return specific metric if requested
    if (metric) {
      const data = await getMetricData(metric, startDate, endDate, db);
      return NextResponse.json({ success: true, data });
    }

    // Return complete dashboard data
    const dashboardData = await getDashboardData(startDate, endDate, db);

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error('Error fetching SEO dashboard data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Get complete dashboard data
 */
async function getDashboardData(startDate: string, endDate: string, db: any) {
  try {
    const searchConsoleConfig = {
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL || '',
      privateKey: process.env.GOOGLE_PRIVATE_KEY || '',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://jchairstudios62.xyz',
    };

    // Fetch all metrics in parallel
    const [
      topQueries,
      topPages,
      error404Report,
      redirectReport,
      trafficSummary,
      rankingData,
      indexingStatus,
    ] = await Promise.all([
      getTopQueries(searchConsoleConfig, startDate, endDate, 50).catch(() => null),
      getTopPages(searchConsoleConfig, startDate, endDate, 50).catch(() => null),
      get404Report(db, 7).catch(() => null),
      getRedirectReport(db, 30).catch(() => null),
      getTrafficSummary(db, 30).catch(() => null),
      getRankingData(db).catch(() => null),
      getIndexingStatus(db).catch(() => null),
    ]);

    // Calculate key metrics
    const keyMetrics = calculateKeyMetrics(topQueries, topPages);

    return {
      overview: {
        period: { startDate, endDate },
        keyMetrics,
      },
      searchConsole: {
        topQueries,
        topPages,
      },
      errors: {
        notFound: error404Report,
        redirects: redirectReport,
      },
      traffic: trafficSummary,
      rankings: rankingData,
      indexing: indexingStatus,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    throw error;
  }
}

/**
 * Get specific metric data
 */
async function getMetricData(
  metric: string,
  startDate: string,
  endDate: string,
  db: any
) {
  switch (metric) {
    case 'queries':
      const searchConsoleConfig = {
        clientEmail: process.env.GOOGLE_CLIENT_EMAIL || '',
        privateKey: process.env.GOOGLE_PRIVATE_KEY || '',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://jchairstudios62.xyz',
      };
      return getTopQueries(searchConsoleConfig, startDate, endDate, 100);

    case 'pages':
      return getTopPages(
        {
          clientEmail: process.env.GOOGLE_CLIENT_EMAIL || '',
          privateKey: process.env.GOOGLE_PRIVATE_KEY || '',
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://jchairstudios62.xyz',
        },
        startDate,
        endDate,
        100
      );

    case '404s':
      return get404Report(db, 30);

    case 'redirects':
      return getRedirectReport(db, 30);

    case 'traffic':
      return getTrafficSummary(db, 30);

    case 'rankings':
      return getRankingData(db);

    default:
      throw new Error(`Unknown metric: ${metric}`);
  }
}

/**
 * Calculate key metrics from Search Console data
 */
function calculateKeyMetrics(topQueries: any, topPages: any) {
  if (!topQueries || !topPages) {
    return {
      totalClicks: 0,
      totalImpressions: 0,
      avgCTR: 0,
      avgPosition: 0,
    };
  }

  const totalClicks = topQueries.rows?.reduce(
    (sum: number, row: any) => sum + (row.clicks || 0),
    0
  ) || 0;

  const totalImpressions = topQueries.rows?.reduce(
    (sum: number, row: any) => sum + (row.impressions || 0),
    0
  ) || 0;

  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  const avgPosition = topQueries.rows?.length > 0
    ? topQueries.rows.reduce(
        (sum: number, row: any) => sum + (row.position || 0),
        0
      ) / topQueries.rows.length
    : 0;

  return {
    totalClicks,
    totalImpressions,
    avgCTR: parseFloat(avgCTR.toFixed(2)),
    avgPosition: parseFloat(avgPosition.toFixed(2)),
  };
}

/**
 * Get ranking data from database
 */
async function getRankingData(db: any) {
  try {
    const collection = db.collection('seo_rankings');

    const latestRankings = await collection
      .aggregate([
        {
          $sort: { date: -1 },
        },
        {
          $group: {
            _id: '$keyword',
            position: { $first: '$position' },
            url: { $first: '$url' },
            date: { $first: '$date' },
          },
        },
        {
          $sort: { position: 1 },
        },
        {
          $limit: 50,
        },
      ])
      .toArray();

    return latestRankings.map((item) => ({
      keyword: item._id,
      position: item.position,
      url: item.url,
      date: item.date,
    }));
  } catch (error) {
    console.error('Error getting ranking data:', error);
    return [];
  }
}

/**
 * Get indexing status
 */
async function getIndexingStatus(db: any) {
  try {
    // This would typically come from Search Console API
    // For now, return placeholder data
    return {
      totalPages: 0,
      indexedPages: 0,
      notIndexedPages: 0,
      errors: [],
      warnings: [],
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting indexing status:', error);
    return null;
  }
}

/**
 * Helper: Get date N days ago in YYYY-MM-DD format
 */
function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

/**
 * Helper: Get today's date in YYYY-MM-DD format
 */
function getDateToday(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * POST endpoint to trigger manual updates
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Verify authentication
    const isAdmin = true; // Replace with actual auth check

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    switch (action) {
      case 'refresh-rankings':
        // Trigger ranking update
        return NextResponse.json({
          success: true,
          message: 'Ranking refresh initiated',
        });

      case 'check-indexing':
        // Trigger indexing check
        return NextResponse.json({
          success: true,
          message: 'Indexing check initiated',
        });

      case 'clear-404s':
        // Clear old 404 logs
        const db = await connectToDatabase();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 90);

        const result = await db
          .collection('seo_404_errors')
          .deleteMany({ timestamp: { $lt: cutoffDate } });

        return NextResponse.json({
          success: true,
          message: `Cleared ${result.deletedCount} old 404 logs`,
        });

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing SEO dashboard action:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
