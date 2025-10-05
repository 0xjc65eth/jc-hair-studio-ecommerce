/**
 * Environment Configuration for MongoDB
 * JC Hair Studio's 62 E-commerce
 *
 * Centralized configuration management for different environments
 * with timeout, retry logic, and connection optimization
 */

// Environment detection
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  VERCEL: process.env.VERCEL === '1',
  VERCEL_ENV: process.env.VERCEL_ENV,
  NETLIFY: process.env.NETLIFY === 'true',
  IS_BUILD: process.env.NEXT_PHASE === 'phase-production-build',
  CI: process.env.CI === 'true',
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'jc-hair-studio-ecommerce',
} as const;

// Environment type detection
export const IS_PRODUCTION = ENV.NODE_ENV === 'production';
export const IS_DEVELOPMENT = ENV.NODE_ENV === 'development';
export const IS_SERVERLESS = ENV.VERCEL || ENV.NETLIFY;
export const IS_BUILD_TIME = ENV.IS_BUILD;

/**
 * Get environment-specific MongoDB connection options
 */
export function getConnectionConfig() {
  // Base configuration
  const baseConfig = {
    dbName: ENV.MONGODB_DB_NAME,
    bufferCommands: false, // Critical for serverless
    retryWrites: true,
    writeConcern: { w: 'majority' as const },
  };

  // Serverless environment (Vercel, Netlify)
  if (IS_SERVERLESS) {
    return {
      ...baseConfig,
      // Optimized for serverless functions
      maxPoolSize: 5, // Reduced for serverless
      minPoolSize: 0, // Allow scaling to zero
      maxIdleTimeMS: 30000, // 30 seconds
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // Match function timeout
      connectTimeoutMS: 10000, // Quick connection
      maxConnecting: 2, // Limit concurrent connections
      heartbeatFrequencyMS: 10000, // Less frequent heartbeats
      autoCreate: false, // Don't auto-create collections
      autoIndex: false, // Don't auto-create indexes
    };
  }

  // Production environment (non-serverless)
  if (IS_PRODUCTION) {
    return {
      ...baseConfig,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 60000, // 1 minute
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 120000, // 2 minutes
      connectTimeoutMS: 30000, // 30 seconds
      maxConnecting: 3,
      heartbeatFrequencyMS: 15000,
      autoCreate: false,
      autoIndex: false,
    };
  }

  // Development environment
  return {
    ...baseConfig,
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 60000,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 120000,
    connectTimeoutMS: 15000,
    autoCreate: true, // Allow auto-creation in dev
    autoIndex: true, // Allow auto-indexing in dev
  };
}

/**
 * Get retry configuration for different environments
 */
export function getRetryConfig() {
  if (IS_SERVERLESS) {
    return {
      maxAttempts: 3,
      baseDelay: 1000, // 1 second
      maxDelay: 5000, // 5 seconds
      backoffFactor: 2,
    };
  }

  if (IS_PRODUCTION) {
    return {
      maxAttempts: 5,
      baseDelay: 2000, // 2 seconds
      maxDelay: 30000, // 30 seconds
      backoffFactor: 2,
    };
  }

  // Development
  return {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 1.5,
  };
}

/**
 * Get timeout configuration for different operations
 */
export function getTimeoutConfig() {
  const base = {
    // Operation timeouts in milliseconds
    query: IS_SERVERLESS ? 25000 : 60000,
    insert: IS_SERVERLESS ? 15000 : 30000,
    update: IS_SERVERLESS ? 15000 : 30000,
    delete: IS_SERVERLESS ? 10000 : 20000,
    aggregate: IS_SERVERLESS ? 30000 : 120000,
    healthCheck: 5000,
    indexCreation: IS_SERVERLESS ? 30000 : 60000,
  };

  return base;
}

/**
 * Get logging configuration
 */
export function getLoggingConfig() {
  return {
    enabled: !IS_PRODUCTION || ENV.VERCEL_ENV === 'preview',
    level: IS_DEVELOPMENT ? 'debug' : 'info',
    includeStack: IS_DEVELOPMENT,
    logConnections: !IS_PRODUCTION,
    logQueries: IS_DEVELOPMENT,
    logErrors: true,
  };
}

/**
 * Get schema configuration
 */
export function getSchemaConfig() {
  return {
    autoIndex: IS_DEVELOPMENT,
    suppressReservedKeysWarning: true,
    bufferCommands: false,
    bufferMaxEntries: 0,
    strict: true,
    strictQuery: false, // More flexible querying
    runSettersOnQuery: true,
    runValidators: true,
  };
}

/**
 * Validate environment configuration
 */
export function validateEnvironment(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Critical validations
  if (!ENV.MONGODB_URI && !IS_BUILD_TIME) {
    errors.push('MONGODB_URI environment variable is required');
  }

  if (!ENV.MONGODB_DB_NAME) {
    warnings.push('MONGODB_DB_NAME not specified, using default database name');
  }

  // Environment-specific validations
  if (IS_SERVERLESS && ENV.MONGODB_URI?.includes('localhost')) {
    warnings.push('Using localhost MongoDB URI in serverless environment');
  }

  if (IS_PRODUCTION && !ENV.MONGODB_URI?.includes('mongodb+srv://')) {
    warnings.push('Production environment should use MongoDB Atlas (mongodb+srv://)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get environment summary for debugging
 */
export function getEnvironmentSummary() {
  return {
    environment: ENV.NODE_ENV,
    platform: IS_SERVERLESS ? 'serverless' : 'traditional',
    provider: ENV.VERCEL ? 'vercel' : ENV.NETLIFY ? 'netlify' : 'other',
    buildTime: IS_BUILD_TIME,
    hasMongoUri: !!ENV.MONGODB_URI,
    database: ENV.MONGODB_DB_NAME,
    config: {
      connection: getConnectionConfig(),
      retry: getRetryConfig(),
      timeouts: getTimeoutConfig(),
      logging: getLoggingConfig(),
      schema: getSchemaConfig(),
    },
  };
}

/**
 * Check if database operations should be skipped
 */
export function shouldSkipDatabaseOperation(): boolean {
  return IS_BUILD_TIME || !ENV.MONGODB_URI;
}

/**
 * Get connection string with optimizations
 */
export function getOptimizedConnectionString(): string | null {
  if (!ENV.MONGODB_URI) {
    return null;
  }

  let uri = ENV.MONGODB_URI;

  // Add serverless-specific connection options to URI
  if (IS_SERVERLESS && !uri.includes('maxPoolSize')) {
    const params = new URLSearchParams();
    params.set('maxPoolSize', '5');
    params.set('minPoolSize', '0');
    params.set('maxIdleTimeMS', '30000');
    params.set('serverSelectionTimeoutMS', '10000');
    params.set('socketTimeoutMS', '45000');
    params.set('connectTimeoutMS', '10000');

    const separator = uri.includes('?') ? '&' : '?';
    uri += separator + params.toString();
  }

  return uri;
}

export default {
  ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  IS_SERVERLESS,
  IS_BUILD_TIME,
  getConnectionConfig,
  getRetryConfig,
  getTimeoutConfig,
  getLoggingConfig,
  getSchemaConfig,
  validateEnvironment,
  getEnvironmentSummary,
  shouldSkipDatabaseOperation,
  getOptimizedConnectionString,
};