import { NextRequest, NextResponse } from 'next/server';
import { PerformanceOptimizer } from '@/lib/database/PerformanceOptimizer';
import { cacheManager } from '@/lib/database/CacheManager';
import { connectDB } from '@/lib/mongodb';

/**
 * Database Performance Management API
 * Provides endpoints for monitoring and optimizing database performance
 */

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'metrics';

    switch (action) {
      case 'metrics':
        const metrics = await cacheManager.cacheAnalytics(
          'performance_metrics',
          () => PerformanceOptimizer.getPerformanceMetrics(),
          { ttl: 60 } // Cache for 1 minute
        );

        return NextResponse.json({
          success: true,
          data: metrics,
          timestamp: new Date().toISOString()
        });

      case 'health':
        const health = await PerformanceOptimizer.checkHealth();

        return NextResponse.json({
          success: true,
          data: health,
          timestamp: new Date().toISOString()
        });

      case 'indexes':
        const indexAnalysis = await cacheManager.cacheAnalytics(
          'index_analysis',
          () => PerformanceOptimizer.analyzeIndexes(),
          { ttl: 300 } // Cache for 5 minutes
        );

        return NextResponse.json({
          success: true,
          data: indexAnalysis,
          timestamp: new Date().toISOString()
        });

      case 'queries':
        const queryPerformance = await PerformanceOptimizer.analyzeQueryPerformance();

        return NextResponse.json({
          success: true,
          data: queryPerformance,
          timestamp: new Date().toISOString()
        });

      case 'cache-stats':
        const cacheStats = cacheManager.getStats();

        return NextResponse.json({
          success: true,
          data: cacheStats,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${action}`
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Performance API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get performance data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, options = {} } = body;

    switch (action) {
      case 'optimize-indexes':
        await PerformanceOptimizer.createOptimizedIndexes();

        // Clear relevant cache after optimization
        await cacheManager.clearByTags(['database', 'analytics']);

        return NextResponse.json({
          success: true,
          message: 'Database indexes optimized successfully',
          timestamp: new Date().toISOString()
        });

      case 'optimize-config':
        await PerformanceOptimizer.optimizeConfiguration();

        return NextResponse.json({
          success: true,
          message: 'Database configuration optimized',
          timestamp: new Date().toISOString()
        });

      case 'maintenance':
        await PerformanceOptimizer.performMaintenance();

        return NextResponse.json({
          success: true,
          message: 'Database maintenance completed',
          timestamp: new Date().toISOString()
        });

      case 'clear-cache':
        const { tags = [] } = options;

        if (tags.length > 0) {
          const cleared = await cacheManager.clearByTags(tags);
          return NextResponse.json({
            success: true,
            message: `Cleared ${cleared} cache entries with tags: ${tags.join(', ')}`,
            timestamp: new Date().toISOString()
          });
        } else {
          await cacheManager.clear();
          return NextResponse.json({
            success: true,
            message: 'All cache cleared',
            timestamp: new Date().toISOString()
          });
        }

      case 'warmup-cache':
        await cacheManager.warmUpCache();

        return NextResponse.json({
          success: true,
          message: 'Cache warm-up initiated',
          timestamp: new Date().toISOString()
        });

      case 'configure-cache':
        const { maxSize, defaultTTL } = options;
        cacheManager.configure({ maxSize, defaultTTL });

        return NextResponse.json({
          success: true,
          message: 'Cache configuration updated',
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${action}`
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Performance Action API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform database action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cacheKey = searchParams.get('key');
    const tags = searchParams.get('tags')?.split(',') || [];

    if (cacheKey) {
      const deleted = await cacheManager.delete(cacheKey);
      return NextResponse.json({
        success: deleted,
        message: deleted ? 'Cache key deleted' : 'Cache key not found',
        timestamp: new Date().toISOString()
      });
    }

    if (tags.length > 0) {
      const cleared = await cacheManager.clearByTags(tags);
      return NextResponse.json({
        success: true,
        message: `Cleared ${cleared} cache entries`,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Either key or tags parameter is required'
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('Performance DELETE API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete cache data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}