/**
 * Google Search Console API Integration
 * Monitor search performance, rankings, and indexing status
 */

import { google } from 'googleapis';

const searchconsole = google.searchconsole('v1');

interface SearchConsoleConfig {
  clientEmail: string;
  privateKey: string;
  siteUrl: string;
}

interface SearchAnalyticsQuery {
  startDate: string;
  endDate: string;
  dimensions?: string[];
  dimensionFilterGroups?: any[];
  rowLimit?: number;
  startRow?: number;
}

interface UrlInspectionResult {
  indexStatusResult?: {
    verdict?: string;
    coverageState?: string;
    robotsTxtState?: string;
    indexingState?: string;
    lastCrawlTime?: string;
  };
  mobileUsabilityResult?: {
    verdict?: string;
    issues?: Array<{
      issueType?: string;
      message?: string;
    }>;
  };
}

/**
 * Initialize Search Console API client
 */
export function getSearchConsoleClient(config: SearchConsoleConfig) {
  const auth = new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey.replace(/\\n/g, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/webmasters',
    ],
  });

  return { auth, siteUrl: config.siteUrl };
}

/**
 * Get search analytics data
 */
export async function getSearchAnalytics(
  config: SearchConsoleConfig,
  query: SearchAnalyticsQuery
) {
  try {
    const { auth, siteUrl } = getSearchConsoleClient(config);

    const response = await searchconsole.searchanalytics.query({
      auth,
      siteUrl,
      requestBody: {
        startDate: query.startDate,
        endDate: query.endDate,
        dimensions: query.dimensions || ['page', 'query'],
        dimensionFilterGroups: query.dimensionFilterGroups,
        rowLimit: query.rowLimit || 1000,
        startRow: query.startRow || 0,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching search analytics:', error);
    throw error;
  }
}

/**
 * Get top performing queries
 */
export async function getTopQueries(
  config: SearchConsoleConfig,
  startDate: string,
  endDate: string,
  limit = 100
) {
  return getSearchAnalytics(config, {
    startDate,
    endDate,
    dimensions: ['query'],
    rowLimit: limit,
  });
}

/**
 * Get top performing pages
 */
export async function getTopPages(
  config: SearchConsoleConfig,
  startDate: string,
  endDate: string,
  limit = 100
) {
  return getSearchAnalytics(config, {
    startDate,
    endDate,
    dimensions: ['page'],
    rowLimit: limit,
  });
}

/**
 * Get search performance for specific page
 */
export async function getPagePerformance(
  config: SearchConsoleConfig,
  pageUrl: string,
  startDate: string,
  endDate: string
) {
  return getSearchAnalytics(config, {
    startDate,
    endDate,
    dimensions: ['query'],
    dimensionFilterGroups: [
      {
        filters: [
          {
            dimension: 'page',
            expression: pageUrl,
            operator: 'equals',
          },
        ],
      },
    ],
  });
}

/**
 * Get search performance by device
 */
export async function getPerformanceByDevice(
  config: SearchConsoleConfig,
  startDate: string,
  endDate: string
) {
  return getSearchAnalytics(config, {
    startDate,
    endDate,
    dimensions: ['device'],
  });
}

/**
 * Get search performance by country
 */
export async function getPerformanceByCountry(
  config: SearchConsoleConfig,
  startDate: string,
  endDate: string
) {
  return getSearchAnalytics(config, {
    startDate,
    endDate,
    dimensions: ['country'],
  });
}

/**
 * Inspect URL indexing status
 */
export async function inspectUrl(
  config: SearchConsoleConfig,
  inspectionUrl: string
): Promise<UrlInspectionResult> {
  try {
    const { auth, siteUrl } = getSearchConsoleClient(config);

    const response = await searchconsole.urlInspection.index.inspect({
      auth,
      requestBody: {
        inspectionUrl,
        siteUrl,
      },
    });

    return response.data.inspectionResult || {};
  } catch (error) {
    console.error('Error inspecting URL:', error);
    throw error;
  }
}

/**
 * Get sitemap status
 */
export async function getSitemaps(config: SearchConsoleConfig) {
  try {
    const { auth, siteUrl } = getSearchConsoleClient(config);

    const response = await searchconsole.sitemaps.list({
      auth,
      siteUrl,
    });

    return response.data.sitemap || [];
  } catch (error) {
    console.error('Error fetching sitemaps:', error);
    throw error;
  }
}

/**
 * Submit sitemap
 */
export async function submitSitemap(
  config: SearchConsoleConfig,
  sitemapUrl: string
) {
  try {
    const { auth, siteUrl } = getSearchConsoleClient(config);

    await searchconsole.sitemaps.submit({
      auth,
      siteUrl,
      feedpath: sitemapUrl,
    });

    return { success: true, message: 'Sitemap submitted successfully' };
  } catch (error) {
    console.error('Error submitting sitemap:', error);
    throw error;
  }
}

/**
 * Delete sitemap
 */
export async function deleteSitemap(
  config: SearchConsoleConfig,
  sitemapUrl: string
) {
  try {
    const { auth, siteUrl } = getSearchConsoleClient(config);

    await searchconsole.sitemaps.delete({
      auth,
      siteUrl,
      feedpath: sitemapUrl,
    });

    return { success: true, message: 'Sitemap deleted successfully' };
  } catch (error) {
    console.error('Error deleting sitemap:', error);
    throw error;
  }
}

/**
 * Get mobile usability issues
 */
export async function getMobileUsabilityIssues(config: SearchConsoleConfig) {
  try {
    const { auth, siteUrl } = getSearchConsoleClient(config);

    // Note: This endpoint might be deprecated, check Google's latest API docs
    const response = await google
      .searchconsole('v1')
      .urlTestingTools.mobileFriendlyTest.run({
        auth,
        requestBody: {
          url: siteUrl,
        },
      });

    return response.data;
  } catch (error) {
    console.error('Error fetching mobile usability issues:', error);
    throw error;
  }
}

/**
 * Calculate ranking changes
 */
export async function getRankingChanges(
  config: SearchConsoleConfig,
  startDate1: string,
  endDate1: string,
  startDate2: string,
  endDate2: string
) {
  try {
    const [period1, period2] = await Promise.all([
      getSearchAnalytics(config, {
        startDate: startDate1,
        endDate: endDate1,
        dimensions: ['query'],
        rowLimit: 1000,
      }),
      getSearchAnalytics(config, {
        startDate: startDate2,
        endDate: endDate2,
        dimensions: ['query'],
        rowLimit: 1000,
      }),
    ]);

    const period1Map = new Map(
      period1.rows?.map((row: any) => [row.keys[0], row]) || []
    );
    const period2Map = new Map(
      period2.rows?.map((row: any) => [row.keys[0], row]) || []
    );

    const changes = [];

    for (const [query, data1] of period1Map) {
      const data2 = period2Map.get(query);
      if (data2) {
        const positionChange = (data2 as any).position - (data1 as any).position;
        const clicksChange = (data2 as any).clicks - (data1 as any).clicks;
        const impressionsChange =
          (data2 as any).impressions - (data1 as any).impressions;

        changes.push({
          query,
          period1: data1,
          period2: data2,
          positionChange,
          clicksChange,
          impressionsChange,
        });
      }
    }

    // Sort by absolute position change
    changes.sort((a, b) => Math.abs(b.positionChange) - Math.abs(a.positionChange));

    return changes;
  } catch (error) {
    console.error('Error calculating ranking changes:', error);
    throw error;
  }
}

/**
 * Monitor indexing issues
 */
export async function getIndexingIssues(config: SearchConsoleConfig) {
  try {
    const sitemaps = await getSitemaps(config);
    const issues = [];

    for (const sitemap of sitemaps) {
      if ((sitemap as any).errors && (sitemap as any).errors.length > 0) {
        issues.push({
          sitemap: (sitemap as any).path,
          errors: (sitemap as any).errors,
        });
      }

      if ((sitemap as any).warnings && (sitemap as any).warnings.length > 0) {
        issues.push({
          sitemap: (sitemap as any).path,
          warnings: (sitemap as any).warnings,
        });
      }
    }

    return issues;
  } catch (error) {
    console.error('Error fetching indexing issues:', error);
    throw error;
  }
}

/**
 * Get core web vitals data
 */
export async function getCoreWebVitals(
  config: SearchConsoleConfig,
  startDate: string,
  endDate: string
) {
  try {
    // This would require the PageSpeed Insights API
    // For now, we'll return a placeholder
    console.warn('Core Web Vitals tracking requires PageSpeed Insights API integration');
    return {
      message: 'Core Web Vitals tracking requires PageSpeed Insights API',
      recommendation: 'Integrate PageSpeed Insights API for detailed metrics',
    };
  } catch (error) {
    console.error('Error fetching core web vitals:', error);
    throw error;
  }
}
