/**
 * Database Health Check API Endpoint
 * JC Hair Studio's 62 E-commerce
 *
 * Provides comprehensive MongoDB health monitoring for admin panel
 */

import { NextRequest, NextResponse } from 'next/server';
import { performHealthCheck, getHealthSummary, instrumentQuery } from '@/lib/mongodb/health-monitor';
import { getEnvironmentSummary } from '@/lib/mongodb/environment-config';
import { getIndexStats } from '@/lib/mongodb/schema-manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';

    if (detailed) {
      // Comprehensive health check with full details
      const [healthCheck, environmentSummary, indexStats] = await Promise.all([
        performHealthCheck(),
        Promise.resolve(getEnvironmentSummary()),
        Promise.resolve(getIndexStats()),
      ]);

      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        health: healthCheck,
        environment: environmentSummary,
        indexes: indexStats,
      });
    } else {
      // Quick health summary
      const healthSummary = getHealthSummary();

      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        status: healthSummary.status,
        uptime: healthSummary.uptime,
        connectionSuccessRate: healthSummary.connectionSuccessRate,
        querySuccessRate: healthSummary.querySuccessRate,
        averageConnectionTime: healthSummary.averageConnectionTime,
        averageQueryTime: healthSummary.averageQueryTime,
        totalErrors: healthSummary.totalErrors,
        lastError: healthSummary.lastError,
      });
    }
  } catch (error) {
    console.error('Health check API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    switch (action) {
      case 'test-connection':
        return instrumentQuery('health-test', async () => {
          const result = await performHealthCheck();
          return NextResponse.json({
            success: true,
            result,
          });
        });

      case 'reset-metrics':
        const { resetHealthMetrics } = await import('@/lib/mongodb/health-monitor');
        const { clearIndexState } = await import('@/lib/mongodb/schema-manager');

        resetHealthMetrics();
        clearIndexState();

        return NextResponse.json({
          success: true,
          message: 'Health metrics and index state reset successfully',
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Health check action error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}