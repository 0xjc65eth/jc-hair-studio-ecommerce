/**
 * MongoDB Connection Configuration
 * JC Hair Studio's 62's 62 E-commerce
 *
 * Optimized for Vercel Serverless Environment:
 * - Serverless-optimized connection pooling
 * - Build-time vs runtime connection handling
 * - Connection caching and reuse
 * - Error handling and logging
 * - Health monitoring
 * - Environment-specific configurations
 */

import mongoose, { Connection } from 'mongoose';
import {
  ENV,
  IS_PRODUCTION,
  IS_SERVERLESS,
  IS_BUILD_TIME,
  getConnectionConfig,
  getRetryConfig,
  getTimeoutConfig,
  getLoggingConfig,
  validateEnvironment,
  shouldSkipDatabaseOperation,
  getOptimizedConnectionString
} from './environment-config';
import { recordConnectionAttempt, startHealthMonitoring } from './health-monitor';

// Validate environment on import
const envValidation = validateEnvironment();
if (!envValidation.isValid && !IS_BUILD_TIME) {
  console.error('\u274c Environment validation failed:', envValidation.errors);
}
if (envValidation.warnings.length > 0) {
  console.warn('\u26a0\ufe0f Environment warnings:', envValidation.warnings);
}

// Serverless-optimized connection pool configuration
const getConnectionOptions = (): mongoose.ConnectOptions => {
  // Base configuration
  const baseOptions: mongoose.ConnectOptions = {
    dbName: DATABASE_NAME,
    bufferCommands: false, // Critical for serverless
    retryWrites: true,
    writeConcern: { w: 'majority' },
  };

  if (isVercel || isProduction) {
    // Vercel/Production optimizations
    return {
      ...baseOptions,
      // Serverless-optimized pool settings
      maxPoolSize: 5, // Reduced for serverless functions
      minPoolSize: 0, // Allow scaling to zero
      maxIdleTimeMS: 30000, // Faster cleanup for serverless
      serverSelectionTimeoutMS: 10000, // Faster timeout for serverless
      socketTimeoutMS: 45000, // Match Vercel function timeout
      connectTimeoutMS: 10000, // Quick connection for cold starts

      // Serverless-specific optimizations
      maxConnecting: 2, // Limit concurrent connections
      heartbeatFrequencyMS: 10000, // Less frequent heartbeats

      // Error handling for serverless
      autoCreate: false, // Don't auto-create collections
      autoIndex: false, // Don't auto-create indexes
    };
  } else {
    // Development optimizations
    return {
      ...baseOptions,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 60000,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 120000,
      connectTimeoutMS: 15000,

      // Development-friendly settings
      autoCreate: true,
      autoIndex: true,
    };
  }
};

// Enhanced global connection cache with error tracking
interface CachedConnection {
  conn: Connection | null;
  promise: Promise<Connection> | null;
  lastError: Error | null;
  connectionAttempts: number;
  lastAttempt: number;
}

// Ensure global cache exists
if (typeof global === 'undefined') {
  (globalThis as any).global = globalThis;
}

const cached: CachedConnection = (global as any).mongoose || {
  conn: null,
  promise: null,
  lastError: null,
  connectionAttempts: 0,
  lastAttempt: 0,
};

if (!(global as any).mongoose) {
  (global as any).mongoose = cached;
}

/**
 * Connect to MongoDB with enhanced serverless-optimized singleton pattern
 */
export async function connectDB(): Promise<Connection> {
  // Build-time protection
  if (IS_BUILD_TIME) {
    throw new Error('Database connection attempted during build. Use environment checks.');
  }

  // Check if MONGODB_URI is available
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not defined. Database connection unavailable.');
  }

  // Return existing healthy connection
  if (cached.conn && cached.conn.readyState === 1) {
    if (!isProduction) {
      console.log('✅ Using existing MongoDB connection');
    }
    return cached.conn;
  }

  // Clean up stale connections
  if (cached.conn && cached.conn.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  // Rate limiting for failed connections
  const now = Date.now();
  if (cached.lastError && cached.connectionAttempts > 3 && (now - cached.lastAttempt) < 30000) {
    throw new Error(`Connection rate limited. Last error: ${cached.lastError.message}`);
  }

  // If no connection exists but promise is in progress, wait for it
  if (!cached.promise) {
    if (!isProduction) {
      console.log('🔄 Establishing new MongoDB connection...');
    }

    cached.connectionAttempts++;
    cached.lastAttempt = now;

    const connectionOptions = getConnectionOptions();

    cached.promise = mongoose.connect(MONGODB_URI, connectionOptions).then((mongooseInstance) => {
      const connection = mongooseInstance.connection;

      // Reset error tracking on success
      cached.lastError = null;
      cached.connectionAttempts = 0;

      if (!isProduction) {
        console.log('✅ MongoDB connected successfully to database:', DATABASE_NAME);
        console.log(`📊 Connection ready state: ${connection.readyState}`);
      }

      return connection;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);

      // Track error for rate limiting
      cached.lastError = error;
      cached.promise = null; // Reset promise on failure

      // Enhanced error handling
      if (error.message.includes('authentication failed')) {
        throw new Error('MongoDB authentication failed. Check credentials.');
      }
      if (error.message.includes('network')) {
        throw new Error('MongoDB network error. Check connection string and network.');
      }

      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null; // Reset promise on failure
    throw error;
  }
}

/**
 * Disconnect from MongoDB with proper cleanup
 */
export async function disconnectDB(): Promise<void> {
  try {
    if (cached.conn || mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();

      // Reset cache
      cached.conn = null;
      cached.promise = null;
      cached.lastError = null;
      cached.connectionAttempts = 0;

      if (!isProduction) {
        console.log('✅ MongoDB disconnected successfully');
      }
    }
  } catch (error) {
    console.error('❌ MongoDB disconnection failed:', error);
    // Reset cache even on error
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
}

/**
 * Check database health with enhanced monitoring
 */
export async function checkDBHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  database: string;
  readyState: string;
  error?: string;
  timestamp: string;
  connectionInfo?: {
    isVercel: boolean;
    isProduction: boolean;
    connectionAttempts: number;
    lastError?: string;
  };
}> {
  try {
    // Build-time protection
    if (IS_BUILD_TIME) {
      return {
        status: 'unhealthy',
        database: ENV.MONGODB_DB_NAME,
        readyState: 'build-time',
        error: 'Database health check attempted during build',
        timestamp: new Date().toISOString(),
      };
    }

    const connection = await connectDB();

    // Test basic connectivity with timeout
    const pingPromise = connection.db.admin().ping();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Health check timeout')), 5000)
    );

    await Promise.race([pingPromise, timeoutPromise]);

    const readyStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return {
      status: 'healthy',
      database: ENV.MONGODB_DB_NAME,
      readyState: readyStates[connection.readyState as keyof typeof readyStates] || 'unknown',
      timestamp: new Date().toISOString(),
      connectionInfo: {
        isVercel,
        isProduction,
        connectionAttempts: cached.connectionAttempts,
        lastError: cached.lastError?.message,
      },
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      database: ENV.MONGODB_DB_NAME,
      readyState: 'error',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      connectionInfo: {
        isVercel,
        isProduction,
        connectionAttempts: cached.connectionAttempts,
        lastError: cached.lastError?.message,
      },
    };
  }
}

/**
 * Get connection statistics with enhanced serverless metrics
 */
export async function getConnectionStats(): Promise<{
  totalConnections: number;
  activeConnections: number;
  availableConnections: number;
  database: string;
  serverlessInfo?: {
    cached: boolean;
    connectionAttempts: number;
    lastError?: string;
    environment: string;
  };
}> {
  try {
    const connection = await connectDB();

    // Get server stats with timeout for serverless
    const statsPromise = connection.db.admin().serverStatus();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Stats timeout')), 3000)
    );

    const stats = await Promise.race([statsPromise, timeoutPromise]) as any;

    return {
      totalConnections: stats.connections?.totalCreated || 0,
      activeConnections: stats.connections?.current || 0,
      availableConnections: stats.connections?.available || 0,
      database: ENV.MONGODB_DB_NAME,
      serverlessInfo: {
        cached: !!cached.conn,
        connectionAttempts: cached.connectionAttempts,
        lastError: cached.lastError?.message,
        environment: isVercel ? 'vercel' : isProduction ? 'production' : 'development',
      },
    };
  } catch (error) {
    console.error('❌ Failed to get connection stats:', error);
    throw error;
  }
}

/**
 * Setup connection event listeners with serverless optimization
 */
export function setupConnectionListeners(): void {
  // Only setup detailed logging in development
  if (!isProduction) {
    mongoose.connection.on('connected', () => {
      console.log('🔗 MongoDB connected');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
  }

  // Always monitor errors
  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error.message);
    cached.lastError = error;

    // Clear stale connections on error
    if (cached.conn && cached.conn.readyState !== 1) {
      cached.conn = null;
      cached.promise = null;
    }
  });

  // Graceful shutdown (not needed in serverless but useful for local dev)
  if (!isVercel) {
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Closing MongoDB connection...`);
      try {
        await disconnectDB();
        process.exit(0);
      } catch (error) {
        console.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // nodemon restart
  }
}

/**
 * Safe database operation wrapper for build-time protection
 */
export async function safeDbOperation<T>(operation: () => Promise<T>): Promise<T | null> {
  if (IS_BUILD_TIME) {
    console.warn('Database operation skipped during build');
    return null;
  }

  try {
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
}

/**
 * Initialize connection with proper error handling
 */
export async function initializeConnection(): Promise<void> {
  if (IS_BUILD_TIME || !MONGODB_URI) {
    return;
  }

  try {
    setupConnectionListeners();
    await connectDB();
  } catch (error) {
    console.error('Failed to initialize MongoDB connection:', error);
    // Don't throw in initialization to prevent app crashes
  }
}

// Export the mongoose instance for direct access if needed
export { mongoose };
export default connectDB;

// Auto-initialize in non-build environments
if (!IS_BUILD_TIME && typeof window === 'undefined') {
  // Only auto-initialize on server side
  setTimeout(() => {
    initializeConnection().catch(console.error);
  }, 0);
}