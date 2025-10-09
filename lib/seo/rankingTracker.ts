/**
 * SEO Ranking Tracker
 * Track keyword rankings across search engines
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

interface KeywordRanking {
  keyword: string;
  position: number | null;
  url: string | null;
  searchEngine: 'google' | 'bing' | 'yahoo';
  country: string;
  date: Date;
}

interface RankingHistory {
  keyword: string;
  history: Array<{
    date: Date;
    position: number | null;
    url: string | null;
  }>;
}

/**
 * Track keyword ranking on Google
 */
export async function trackGoogleRanking(
  keyword: string,
  domain: string,
  country = 'pt',
  language = 'pt'
): Promise<KeywordRanking> {
  try {
    // Note: This is a basic implementation. For production, use:
    // 1. Google Custom Search API (free tier available)
    // 2. SerpApi (paid service)
    // 3. DataForSEO (paid service)

    const encodedKeyword = encodeURIComponent(keyword);
    const url = `https://www.google.com/search?q=${encodedKeyword}&gl=${country}&hl=${language}&num=100`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    let position = null;
    let foundUrl = null;

    // Parse Google search results
    $('.g').each((index, element) => {
      const resultUrl = $(element).find('a').first().attr('href');
      if (resultUrl && resultUrl.includes(domain)) {
        position = index + 1;
        foundUrl = resultUrl;
        return false; // Break the loop
      }
    });

    return {
      keyword,
      position,
      url: foundUrl,
      searchEngine: 'google',
      country,
      date: new Date(),
    };
  } catch (error) {
    console.error(`Error tracking Google ranking for "${keyword}":`, error);
    return {
      keyword,
      position: null,
      url: null,
      searchEngine: 'google',
      country,
      date: new Date(),
    };
  }
}

/**
 * Track keyword ranking on Bing
 */
export async function trackBingRanking(
  keyword: string,
  domain: string,
  country = 'pt'
): Promise<KeywordRanking> {
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `https://www.bing.com/search?q=${encodedKeyword}&cc=${country}&count=100`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    let position = null;
    let foundUrl = null;

    // Parse Bing search results
    $('.b_algo').each((index, element) => {
      const resultUrl = $(element).find('a').first().attr('href');
      if (resultUrl && resultUrl.includes(domain)) {
        position = index + 1;
        foundUrl = resultUrl;
        return false; // Break the loop
      }
    });

    return {
      keyword,
      position,
      url: foundUrl,
      searchEngine: 'bing',
      country,
      date: new Date(),
    };
  } catch (error) {
    console.error(`Error tracking Bing ranking for "${keyword}":`, error);
    return {
      keyword,
      position: null,
      url: null,
      searchEngine: 'bing',
      country,
      date: new Date(),
    };
  }
}

/**
 * Track multiple keywords
 */
export async function trackMultipleKeywords(
  keywords: string[],
  domain: string,
  searchEngine: 'google' | 'bing' = 'google',
  country = 'pt'
): Promise<KeywordRanking[]> {
  const results: KeywordRanking[] = [];

  for (const keyword of keywords) {
    try {
      const ranking =
        searchEngine === 'google'
          ? await trackGoogleRanking(keyword, domain, country)
          : await trackBingRanking(keyword, domain, country);

      results.push(ranking);

      // Add delay to avoid being blocked
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error tracking keyword "${keyword}":`, error);
      results.push({
        keyword,
        position: null,
        url: null,
        searchEngine,
        country,
        date: new Date(),
      });
    }
  }

  return results;
}

/**
 * Save ranking data to database
 */
export async function saveRankingData(
  ranking: KeywordRanking,
  dbConnection: any
) {
  try {
    const collection = dbConnection.collection('seo_rankings');

    await collection.insertOne({
      ...ranking,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving ranking data:', error);
    throw error;
  }
}

/**
 * Get ranking history
 */
export async function getRankingHistory(
  keyword: string,
  days = 30,
  dbConnection: any
): Promise<RankingHistory> {
  try {
    const collection = dbConnection.collection('seo_rankings');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const rankings = await collection
      .find({
        keyword,
        date: { $gte: startDate },
      })
      .sort({ date: 1 })
      .toArray();

    return {
      keyword,
      history: rankings.map((r: any) => ({
        date: r.date,
        position: r.position,
        url: r.url,
      })),
    };
  } catch (error) {
    console.error('Error fetching ranking history:', error);
    throw error;
  }
}

/**
 * Calculate ranking changes
 */
export function calculateRankingChanges(history: RankingHistory) {
  if (history.history.length < 2) {
    return {
      keyword: history.keyword,
      change: 0,
      trend: 'stable' as const,
      currentPosition: history.history[0]?.position || null,
      previousPosition: null,
    };
  }

  const current = history.history[history.history.length - 1];
  const previous = history.history[history.history.length - 2];

  if (!current.position || !previous.position) {
    return {
      keyword: history.keyword,
      change: 0,
      trend: 'no_data' as const,
      currentPosition: current.position,
      previousPosition: previous.position,
    };
  }

  const change = previous.position - current.position;
  let trend: 'improving' | 'declining' | 'stable' = 'stable';

  if (change > 0) {
    trend = 'improving';
  } else if (change < 0) {
    trend = 'declining';
  }

  return {
    keyword: history.keyword,
    change,
    trend,
    currentPosition: current.position,
    previousPosition: previous.position,
  };
}

/**
 * Get competitor rankings
 */
export async function getCompetitorRankings(
  keyword: string,
  competitors: string[],
  searchEngine: 'google' | 'bing' = 'google',
  country = 'pt'
) {
  const rankings = [];

  for (const competitor of competitors) {
    const ranking =
      searchEngine === 'google'
        ? await trackGoogleRanking(keyword, competitor, country)
        : await trackBingRanking(keyword, competitor, country);

    rankings.push({
      domain: competitor,
      ...ranking,
    });

    // Add delay to avoid being blocked
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return rankings;
}

/**
 * Get suggested keywords based on Search Console data
 */
export async function getSuggestedKeywords(
  searchConsoleData: any[]
): string[] {
  // Get queries with impressions but low clicks (opportunity keywords)
  const opportunityKeywords = searchConsoleData
    .filter((row: any) => {
      const ctr = row.clicks / row.impressions;
      return row.impressions > 100 && ctr < 0.02; // CTR less than 2%
    })
    .sort((a: any, b: any) => b.impressions - a.impressions)
    .slice(0, 50)
    .map((row: any) => row.keys[0]);

  return opportunityKeywords;
}

/**
 * Monitor ranking alerts
 */
export function checkRankingAlerts(
  changes: ReturnType<typeof calculateRankingChanges>[],
  thresholds = {
    significantDrop: -5,
    significantGain: 5,
  }
) {
  const alerts = [];

  for (const change of changes) {
    if (change.change <= thresholds.significantDrop) {
      alerts.push({
        type: 'significant_drop' as const,
        keyword: change.keyword,
        change: change.change,
        currentPosition: change.currentPosition,
        previousPosition: change.previousPosition,
        severity: 'high' as const,
      });
    } else if (change.change >= thresholds.significantGain) {
      alerts.push({
        type: 'significant_gain' as const,
        keyword: change.keyword,
        change: change.change,
        currentPosition: change.currentPosition,
        previousPosition: change.previousPosition,
        severity: 'low' as const,
      });
    }
  }

  return alerts;
}

/**
 * Export ranking data to CSV
 */
export function exportRankingsToCSV(rankings: KeywordRanking[]): string {
  const headers = [
    'Keyword',
    'Position',
    'URL',
    'Search Engine',
    'Country',
    'Date',
  ];

  const rows = rankings.map((r) => [
    r.keyword,
    r.position || 'Not Found',
    r.url || 'N/A',
    r.searchEngine,
    r.country,
    r.date.toISOString().split('T')[0],
  ]);

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

  return csv;
}

/**
 * Priority keywords for tracking (Brazilian products focused)
 */
export const PRIORITY_KEYWORDS = [
  // Mega Hair
  'mega hair brasileiro',
  'mega hair 100% humano',
  'extensão cabelo humano',
  'mega hair natural',
  'mega hair portugal',
  'mega hair lisboa',

  // Progressivas
  'progressiva brasileira',
  'progressiva vogue',
  'progressiva original',
  'btx capilar',
  'botox capilar',
  'alisamento brasileiro',

  // Maquiagem
  'maquiagem brasileira',
  'cosméticos brasil',
  'produtos beleza brasil',
  'maquiagem brasil portugal',

  // Generic
  'produtos brasileiros portugal',
  'loja brasileira online',
  'jc hair studio',
];
