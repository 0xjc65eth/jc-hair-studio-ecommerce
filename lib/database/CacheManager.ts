/**
 * Cache Management System
 * Provides intelligent caching for database queries and analytics data
 */

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for selective invalidation
  serialize?: boolean; // Whether to serialize complex objects
  compress?: boolean; // Whether to compress cached data
}

export interface CacheEntry {
  key: string;
  value: any;
  expiresAt: number;
  tags: string[];
  createdAt: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheStats {
  totalKeys: number;
  hitRate: number;
  missRate: number;
  memoryUsage: number;
  evictions: number;
  oldestEntry: number;
  newestEntry: number;
}

export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry> = new Map();
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    sets: 0
  };
  private maxSize: number = 1000; // Maximum number of cache entries
  private defaultTTL: number = 300; // 5 minutes default TTL

  private constructor() {
    // Start cleanup interval
    setInterval(() => this.cleanup(), 60000); // Cleanup every minute
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Get value from cache
   */
  async get<T = any>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;

    return entry.value as T;
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: any, options: CacheOptions = {}): Promise<void> {
    const {
      ttl = this.defaultTTL,
      tags = [],
      serialize = false,
      compress = false
    } = options;

    // Handle cache size limit
    if (this.cache.size >= this.maxSize) {
      await this.evictLeastRecentlyUsed();
    }

    let processedValue = value;

    // Serialize if requested
    if (serialize && typeof value === 'object') {
      processedValue = JSON.stringify(value);
    }

    // TODO: Implement compression if requested
    if (compress) {
      // Would implement compression here
    }

    const entry: CacheEntry = {
      key,
      value: processedValue,
      expiresAt: Date.now() + (ttl * 1000),
      tags,
      createdAt: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now()
    };

    this.cache.set(key, entry);
    this.stats.sets++;
  }

  /**
   * Delete specific key from cache
   */
  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  /**
   * Clear cache by tags
   */
  async clearByTags(tags: string[]): Promise<number> {
    let cleared = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.some(tag => tags.includes(tag))) {
        this.cache.delete(key);
        cleared++;
      }
    }

    return cleared;
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.resetStats();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const totalRequests = this.stats.hits + this.stats.misses;

    return {
      totalKeys: this.cache.size,
      hitRate: totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0,
      missRate: totalRequests > 0 ? (this.stats.misses / totalRequests) * 100 : 0,
      memoryUsage: this.estimateMemoryUsage(),
      evictions: this.stats.evictions,
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.createdAt)) : 0,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.createdAt)) : 0
    };
  }

  /**
   * Cache wrapper for functions
   */
  async cached<T>(
    key: string,
    fn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = await fn();
    await this.set(key, result, options);

    return result;
  }

  /**
   * Cache database query results
   */
  async cacheQuery<T>(
    queryKey: string,
    queryFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cacheKey = `query:${queryKey}`;
    const defaultOptions: CacheOptions = {
      ttl: 300, // 5 minutes for queries
      tags: ['database', 'query'],
      ...options
    };

    return this.cached(cacheKey, queryFn, defaultOptions);
  }

  /**
   * Cache analytics data
   */
  async cacheAnalytics<T>(
    analyticsKey: string,
    analyticsFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cacheKey = `analytics:${analyticsKey}`;
    const defaultOptions: CacheOptions = {
      ttl: 600, // 10 minutes for analytics
      tags: ['analytics'],
      ...options
    };

    return this.cached(cacheKey, analyticsFn, defaultOptions);
  }

  /**
   * Cache dashboard metrics
   */
  async cacheDashboard<T>(
    dashboardKey: string,
    dashboardFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cacheKey = `dashboard:${dashboardKey}`;
    const defaultOptions: CacheOptions = {
      ttl: 300, // 5 minutes for dashboard
      tags: ['dashboard', 'metrics'],
      ...options
    };

    return this.cached(cacheKey, dashboardFn, defaultOptions);
  }

  /**
   * Cache report data
   */
  async cacheReport<T>(
    reportKey: string,
    reportFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cacheKey = `report:${reportKey}`;
    const defaultOptions: CacheOptions = {
      ttl: 1800, // 30 minutes for reports
      tags: ['reports'],
      ...options
    };

    return this.cached(cacheKey, reportFn, defaultOptions);
  }

  /**
   * Invalidate cache when orders are modified
   */
  async invalidateOrderCache(orderId?: string): Promise<void> {
    const tagsToInvalidate = ['database', 'query', 'analytics', 'dashboard', 'metrics'];

    if (orderId) {
      tagsToInvalidate.push(`order:${orderId}`);
    }

    await this.clearByTags(tagsToInvalidate);
  }

  /**
   * Invalidate analytics cache
   */
  async invalidateAnalyticsCache(): Promise<void> {
    await this.clearByTags(['analytics', 'dashboard', 'metrics', 'reports']);
  }

  /**
   * Warm up cache with frequently accessed data
   */
  async warmUpCache(): Promise<void> {
    try {
      // This would be implemented to pre-load frequently accessed data
      console.log('Cache warm-up started');

      // Example: Pre-load dashboard metrics for common periods
      const periods = ['today', '7d', '30d'];

      for (const period of periods) {
        const key = `dashboard_metrics_${period}`;
        // This would call the actual dashboard metrics function
        // await this.cacheDashboard(key, () => getDashboardMetrics(period));
      }

      console.log('Cache warm-up completed');

    } catch (error) {
      console.error('Cache warm-up failed:', error);
    }
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`Cache cleanup: removed ${cleaned} expired entries`);
    }
  }

  /**
   * Evict least recently used entry
   */
  private async evictLeastRecentlyUsed(): Promise<void> {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * Estimate memory usage
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0;

    for (const entry of this.cache.values()) {
      // Rough estimation of memory usage
      totalSize += JSON.stringify(entry).length * 2; // UTF-16 encoding
    }

    return totalSize;
  }

  /**
   * Reset statistics
   */
  private resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      sets: 0
    };
  }

  /**
   * Configure cache settings
   */
  configure(options: {
    maxSize?: number;
    defaultTTL?: number;
  }): void {
    if (options.maxSize !== undefined) {
      this.maxSize = options.maxSize;
    }

    if (options.defaultTTL !== undefined) {
      this.defaultTTL = options.defaultTTL;
    }
  }

  /**
   * Generate cache key from parameters
   */
  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|');

    return `${prefix}:${sortedParams}`;
  }

  /**
   * Create time-based cache key
   */
  static createTimeBasedKey(
    prefix: string,
    timeframe: 'hour' | 'day' | 'week' | 'month',
    params: Record<string, any> = {}
  ): string {
    const now = new Date();
    let timeKey: string;

    switch (timeframe) {
      case 'hour':
        timeKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
        break;
      case 'day':
        timeKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
        break;
      case 'week': {
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        timeKey = `${weekStart.getFullYear()}-W${Math.ceil(weekStart.getDate() / 7)}`;
        break;
      }
      case 'month':
        timeKey = `${now.getFullYear()}-${now.getMonth()}`;
        break;
    }

    return this.generateKey(`${prefix}:${timeKey}`, params);
  }
}

// Export singleton instance
export const cacheManager = CacheManager.getInstance();
export default CacheManager;