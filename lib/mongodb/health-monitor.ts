/**
 * MongoDB Health Monitoring System
 * JC Hair Studio's 62 E-commerce
 *
 * Comprehensive health monitoring, error tracking, and performance metrics
 * for MongoDB connections in serverless and traditional environments
 */

import mongoose from 'mongoose';
import { connectDB } from './connection';
import { IS_PRODUCTION, IS_SERVERLESS, getTimeoutConfig, getLoggingConfig } from './environment-config';

// Health monitoring state
interface HealthMetrics {
  totalConnections: number;
  successfulConnections: number;
  failedConnections: number;
  connectionErrors: Array<{
    timestamp: Date;
    error: string;
    type: string;
  }>;
  lastSuccessfulConnection: Date | null;
  lastFailedConnection: Date | null;
  averageConnectionTime: number;
  connectionTimes: number[];
  queryMetrics: {
    totalQueries: number;
    successfulQueries: number;
    failedQueries: number;
    averageQueryTime: number;
    slowQueries: Array<{
      timestamp: Date;
      duration: number;
      operation: string;
    }>;
  };
}

const healthMetrics: HealthMetrics = {
  totalConnections: 0,
  successfulConnections: 0,
  failedConnections: 0,
  connectionErrors: [],
  lastSuccessfulConnection: null,
  lastFailedConnection: null,
  averageConnectionTime: 0,
  connectionTimes: [],
  queryMetrics: {
    totalQueries: 0,
    successfulQueries: 0,
    failedQueries: 0,
    averageQueryTime: 0,
    slowQueries: [],
  },
};

const timeoutConfig = getTimeoutConfig();
const loggingConfig = getLoggingConfig();

/**
 * Record connection attempt
 */
export function recordConnectionAttempt(success: boolean, duration: number, error?: Error): void {
  healthMetrics.totalConnections++;
  healthMetrics.connectionTimes.push(duration);

  // Keep only last 100 connection times for average calculation
  if (healthMetrics.connectionTimes.length > 100) {
    healthMetrics.connectionTimes.shift();
  }

  healthMetrics.averageConnectionTime =
    healthMetrics.connectionTimes.reduce((a, b) => a + b, 0) / healthMetrics.connectionTimes.length;

  if (success) {
    healthMetrics.successfulConnections++;
    healthMetrics.lastSuccessfulConnection = new Date();
  } else {
    healthMetrics.failedConnections++;
    healthMetrics.lastFailedConnection = new Date();

    if (error) {
      healthMetrics.connectionErrors.push({
        timestamp: new Date(),
        error: error.message,
        type: getErrorType(error),
      });

      // Keep only last 50 errors
      if (healthMetrics.connectionErrors.length > 50) {
        healthMetrics.connectionErrors.shift();
      }
    }
  }
}

/**
 * Record query performance
 */
export function recordQueryMetrics(success: boolean, duration: number, operation: string): void {
  healthMetrics.queryMetrics.totalQueries++;

  if (success) {
    healthMetrics.queryMetrics.successfulQueries++;
  } else {
    healthMetrics.queryMetrics.failedQueries++;
  }

  // Track slow queries (threshold varies by environment)
  const slowQueryThreshold = IS_SERVERLESS ? 5000 : 10000; // 5s serverless, 10s traditional
  if (duration > slowQueryThreshold) {
    healthMetrics.queryMetrics.slowQueries.push({
      timestamp: new Date(),
      duration,
      operation,
    });

    // Keep only last 20 slow queries
    if (healthMetrics.queryMetrics.slowQueries.length > 20) {
      healthMetrics.queryMetrics.slowQueries.shift();
    }
  }

  // Update average (simple moving average of last 1000 queries)
  const totalQueries = healthMetrics.queryMetrics.totalQueries;
  const currentAvg = healthMetrics.queryMetrics.averageQueryTime;
  healthMetrics.queryMetrics.averageQueryTime =
    totalQueries === 1 ? duration : (currentAvg * 999 + duration) / 1000;
}

/**
 * Determine error type for categorization
 */
function getErrorType(error: Error): string {
  const message = error.message.toLowerCase();

  if (message.includes('authentication') || message.includes('auth')) {
    return 'authentication';
  }
  if (message.includes('network') || message.includes('enotfound') || message.includes('connection refused')) {
    return 'network';
  }
  if (message.includes('timeout')) {
    return 'timeout';
  }
  if (message.includes('pool') || message.includes('connection limit')) {
    return 'pool';
  }
  if (message.includes('validation')) {
    return 'validation';
  }
  if (message.includes('duplicate') || message.includes('e11000')) {
    return 'duplicate';
  }

  return 'unknown';
}

/**
 * Comprehensive health check with detailed metrics
 */
export async function performHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    connection: {
      status: 'pass' | 'fail';
      responseTime: number;
      error?: string;
    };
    database: {
      status: 'pass' | 'fail';
      responseTime: number;
      error?: string;
    };
    indexes: {
      status: 'pass' | 'fail';
      responseTime: number;
      error?: string;
    };
  };
  metrics: HealthMetrics;
  environment: {
    isProduction: boolean;
    isServerless: boolean;
    nodeEnv: string;
    platform: string;
  };
}> {
  const startTime = Date.now();
  const checks = {
    connection: { status: 'fail' as const, responseTime: 0, error: undefined as string | undefined },
    database: { status: 'fail' as const, responseTime: 0, error: undefined as string | undefined },
    indexes: { status: 'fail' as const, responseTime: 0, error: undefined as string | undefined },
  };

  try {
    // Test connection
    const connStart = Date.now();
    const connection = await Promise.race([
      connectDB(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), timeoutConfig.healthCheck)
      ),
    ]);
    checks.connection.responseTime = Date.now() - connStart;
    checks.connection.status = 'pass';

    // Test database operations
    const dbStart = Date.now();
    await Promise.race([
      connection.db.admin().ping(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Database ping timeout')), timeoutConfig.healthCheck)
      ),
    ]);
    checks.database.responseTime = Date.now() - dbStart;
    checks.database.status = 'pass';

    // Test index operations (light check)
    const indexStart = Date.now();
    try {
      const collections = await connection.db.listCollections().toArray();
      if (collections.length > 0) {
        const sampleCollection = collections[0];
        await connection.db.collection(sampleCollection.name).indexes();
      }
      checks.indexes.responseTime = Date.now() - indexStart;
      checks.indexes.status = 'pass';
    } catch (error) {
      checks.indexes.error = error instanceof Error ? error.message : 'Index check failed';
      checks.indexes.responseTime = Date.now() - indexStart;
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');

    if (checks.connection.status === 'fail') {
      checks.connection.error = err.message;
      checks.connection.responseTime = Date.now() - startTime;
    } else {
      checks.database.error = err.message;
      checks.database.responseTime = Date.now() - startTime;
    }
  }

  // Determine overall status
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  if (checks.connection.status === 'fail') {
    status = 'unhealthy';
  } else if (checks.database.status === 'fail' || checks.indexes.status === 'fail') {
    status = 'degraded';
  }

  // Consider performance metrics for status
  if (status === 'healthy') {
    const connectionSuccessRate = healthMetrics.totalConnections > 0
      ? healthMetrics.successfulConnections / healthMetrics.totalConnections
      : 1;

    const querySuccessRate = healthMetrics.queryMetrics.totalQueries > 0
      ? healthMetrics.queryMetrics.successfulQueries / healthMetrics.queryMetrics.totalQueries
      : 1;

    if (connectionSuccessRate < 0.9 || querySuccessRate < 0.95) {
      status = 'degraded';
    }
  }

  return {
    status,
    timestamp: new Date().toISOString(),
    checks,
    metrics: { ...healthMetrics },
    environment: {
      isProduction: IS_PRODUCTION,
      isServerless: IS_SERVERLESS,
      nodeEnv: process.env.NODE_ENV || 'development',
      platform: process.env.VERCEL ? 'vercel' : process.env.NETLIFY ? 'netlify' : 'other',
    },
  };
}

/**
 * Monitor query performance with automatic instrumentation
 */
export function instrumentQuery<T>(
  operation: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();

  return queryFn()
    .then((result) => {
      const duration = Date.now() - startTime;
      recordQueryMetrics(true, duration, operation);

      if (loggingConfig.logQueries && duration > 1000) {
        console.log(`🐌 Slow query detected: ${operation} took ${duration}ms`);
      }

      return result;
    })
    .catch((error) => {
      const duration = Date.now() - startTime;
      recordQueryMetrics(false, duration, operation);

      if (loggingConfig.logErrors) {
        console.error(`❌ Query failed: ${operation} after ${duration}ms:`, error.message);
      }

      throw error;
    });
}

/**
 * Get health summary for monitoring dashboards
 */
export function getHealthSummary(): {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  connectionSuccessRate: number;
  querySuccessRate: number;
  averageConnectionTime: number;
  averageQueryTime: number;
  totalErrors: number;
  lastError?: {
    timestamp: Date;
    message: string;
    type: string;
  };
} {
  const connectionSuccessRate = healthMetrics.totalConnections > 0
    ? healthMetrics.successfulConnections / healthMetrics.totalConnections
    : 1;

  const querySuccessRate = healthMetrics.queryMetrics.totalQueries > 0
    ? healthMetrics.queryMetrics.successfulQueries / healthMetrics.queryMetrics.totalQueries
    : 1;

  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  if (connectionSuccessRate < 0.7 || querySuccessRate < 0.8) {
    status = 'unhealthy';
  } else if (connectionSuccessRate < 0.9 || querySuccessRate < 0.95) {
    status = 'degraded';
  }

  const lastError = healthMetrics.connectionErrors.length > 0
    ? healthMetrics.connectionErrors[healthMetrics.connectionErrors.length - 1]
    : undefined;

  return {
    status,
    uptime: process.uptime(),
    connectionSuccessRate,
    querySuccessRate,
    averageConnectionTime: healthMetrics.averageConnectionTime,
    averageQueryTime: healthMetrics.queryMetrics.averageQueryTime,
    totalErrors: healthMetrics.connectionErrors.length,
    lastError: lastError ? {
      timestamp: lastError.timestamp,
      message: lastError.error,
      type: lastError.type,
    } : undefined,
  };
}

/**
 * Reset health metrics (useful for testing)
 */
export function resetHealthMetrics(): void {
  healthMetrics.totalConnections = 0;
  healthMetrics.successfulConnections = 0;
  healthMetrics.failedConnections = 0;
  healthMetrics.connectionErrors = [];
  healthMetrics.lastSuccessfulConnection = null;
  healthMetrics.lastFailedConnection = null;
  healthMetrics.averageConnectionTime = 0;
  healthMetrics.connectionTimes = [];
  healthMetrics.queryMetrics = {
    totalQueries: 0,
    successfulQueries: 0,
    failedQueries: 0,
    averageQueryTime: 0,
    slowQueries: [],
  };
}

/**
 * Start periodic health monitoring
 */
export function startHealthMonitoring(intervalMs: number = 300000): NodeJS.Timeout | null {
  if (IS_PRODUCTION && !IS_SERVERLESS) {
    // Only run periodic monitoring in non-serverless production environments
    return setInterval(async () => {
      try {
        const health = await performHealthCheck();
        if (health.status !== 'healthy') {
          console.warn('🏥 MongoDB health check failed:', health);
        }
      } catch (error) {
        console.error('❌ Health monitoring error:', error);
      }
    }, intervalMs);
  }
  return null;
}

export default {
  recordConnectionAttempt,
  recordQueryMetrics,
  performHealthCheck,
  instrumentQuery,
  getHealthSummary,
  resetHealthMetrics,
  startHealthMonitoring,
};