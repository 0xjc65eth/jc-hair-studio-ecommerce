/**
 * MongoDB Connection Configuration
 * JC Hair Studio's 62's 62 E-commerce
 * 
 * Features:
 * - Connection pooling optimization
 * - Automatic reconnection
 * - Error handling and logging
 * - Connection singleton pattern
 * - Health monitoring
 */

import mongoose, { Connection } from 'mongoose';

// Connection configuration
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_DB_NAME || 'jc-hair-studio-ecommerce';

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not found in environment variables. Database features will be disabled.');
}

// Connection pool configuration
const connectionOptions: mongoose.ConnectOptions = {
  // Database name
  dbName: DATABASE_NAME,
  
  // Connection pool settings - OTIMIZADO para produção
  maxPoolSize: 15, // Maximum number of connections (aumentado para admin panel)
  minPoolSize: 3,  // Minimum number of connections (aumentado para estabilidade)
  maxIdleTimeMS: 60000, // Close connections after 60 seconds of inactivity (aumentado)
  serverSelectionTimeoutMS: 30000, // How long to try selecting a server (CORRIGIDO: 30s)
  socketTimeoutMS: 120000, // How long a send or receive on a socket can take (CORRIGIDO: 2min)
  connectTimeoutMS: 30000, // How long to wait for initial connection (CORRIGIDO: 30s)
  
  // Buffer settings (mongoose specific)
  bufferCommands: false, // Disable mongoose buffering
  
  // Other options
  retryWrites: true, // Retry failed writes
  writeConcern: { w: 'majority' }, // Write concern
};

// Global connection cache
interface CachedConnection {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

const cached: CachedConnection = (global as any).mongoose || {
  conn: null,
  promise: null,
};

if (!cached) {
  (global as any).mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with singleton pattern
 */
export async function connectDB(): Promise<Connection> {
  // Check if MONGODB_URI is available
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not defined. Database connection unavailable.');
  }

  // Return existing connection if available
  if (cached.conn) {
    console.log('✅ Using existing MongoDB connection');
    return cached.conn;
  }

  // If no connection exists but promise is in progress, wait for it
  if (!cached.promise) {
    console.log('🔄 Establishing new MongoDB connection...');

    cached.promise = mongoose.connect(MONGODB_URI, connectionOptions).then((mongoose) => {
      console.log('✅ MongoDB connected successfully to database:', DATABASE_NAME);
      return mongoose.connection;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error);
      cached.promise = null; // Reset promise on failure
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
 * Disconnect from MongoDB
 */
export async function disconnectDB(): Promise<void> {
  try {
    if (cached.conn) {
      await mongoose.disconnect();
      cached.conn = null;
      cached.promise = null;
      console.log('✅ MongoDB disconnected successfully');
    }
  } catch (error) {
    console.error('❌ MongoDB disconnection failed:', error);
    throw error;
  }
}

/**
 * Check database health
 */
export async function checkDBHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  database: string;
  readyState: string;
  error?: string;
  timestamp: string;
}> {
  try {
    const connection = await connectDB();
    
    // Test basic connectivity
    await connection.db.admin().ping();
    
    const readyStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return {
      status: 'healthy',
      database: DATABASE_NAME,
      readyState: readyStates[connection.readyState as keyof typeof readyStates] || 'unknown',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      database: DATABASE_NAME,
      readyState: 'error',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Get connection statistics
 */
export async function getConnectionStats(): Promise<{
  totalConnections: number;
  activeConnections: number;
  availableConnections: number;
  database: string;
}> {
  try {
    const connection = await connectDB();
    const stats = await connection.db.admin().serverStatus();
    
    return {
      totalConnections: stats.connections?.totalCreated || 0,
      activeConnections: stats.connections?.current || 0,
      availableConnections: stats.connections?.available || 0,
      database: DATABASE_NAME,
    };
  } catch (error) {
    console.error('❌ Failed to get connection stats:', error);
    throw error;
  }
}

/**
 * Setup connection event listeners
 */
export function setupConnectionListeners(): void {
  mongoose.connection.on('connected', () => {
    console.log('🔗 MongoDB connected');
  });

  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('🔌 MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await disconnectDB();
    process.exit(0);
  });
}

// Export the mongoose instance for direct access if needed
export { mongoose };
export default connectDB;