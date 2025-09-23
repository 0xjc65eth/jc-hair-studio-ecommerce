import mongoose from 'mongoose';
import { Order } from '../models/Order';

/**
 * Database Performance Optimization System
 * Provides tools for monitoring, optimizing, and maintaining database performance
 */

export interface IndexAnalysis {
  collection: string;
  indexes: any[];
  missingIndexes: string[];
  unusedIndexes: string[];
  recommendations: string[];
}

export interface QueryPerformance {
  query: string;
  executionTime: number;
  documentsExamined: number;
  documentsReturned: number;
  indexUsed: boolean;
  recommendation: string;
}

export interface PerformanceMetrics {
  connectionStats: any;
  collectionStats: any;
  indexStats: IndexAnalysis[];
  slowQueries: QueryPerformance[];
  recommendations: string[];
}

export class PerformanceOptimizer {
  /**
   * Analyze and optimize database indexes
   */
  static async analyzeIndexes(): Promise<IndexAnalysis[]> {
    try {
      const collections = ['orders']; // Add more collections as needed
      const analyses: IndexAnalysis[] = [];

      for (const collectionName of collections) {
        const collection = mongoose.connection.db.collection(collectionName);

        // Get existing indexes
        const indexes = await collection.listIndexes().toArray();

        // Analyze query patterns to suggest missing indexes
        const missingIndexes = await this.findMissingIndexes(collectionName);

        // Find potentially unused indexes
        const unusedIndexes = await this.findUnusedIndexes(collectionName, indexes);

        // Generate recommendations
        const recommendations = this.generateIndexRecommendations(indexes, missingIndexes, unusedIndexes);

        analyses.push({
          collection: collectionName,
          indexes,
          missingIndexes,
          unusedIndexes,
          recommendations
        });
      }

      return analyses;

    } catch (error) {
      console.error('Error analyzing indexes:', error);
      throw new Error('Failed to analyze database indexes');
    }
  }

  /**
   * Create optimized indexes for Order collection
   */
  static async createOptimizedIndexes(): Promise<void> {
    try {
      const Order = mongoose.model('Order');

      // Remove existing indexes that might be suboptimal
      await this.dropSuboptimalIndexes();

      // Create optimized indexes
      const indexesToCreate = [
        // Core business queries
        { 'customer.email': 1, 'timestamps.createdAt': -1 },
        { 'payment.status': 1, 'shipping.status': 1, 'timestamps.createdAt': -1 },
        { 'orderNumber': 1 }, // Unique constraint
        { 'orderId': 1 }, // Unique constraint

        // Analytics queries
        { 'pricing.total': 1, 'payment.status': 1, 'timestamps.createdAt': -1 },
        { 'customer.type': 1, 'pricing.total': 1, 'timestamps.createdAt': -1 },
        { 'deliveryAddress.state': 1, 'deliveryAddress.city': 1, 'timestamps.createdAt': -1 },

        // Product analytics
        { 'products.category': 1, 'products.brand': 1, 'timestamps.createdAt': -1 },
        { 'products.productId': 1, 'payment.status': 1 },

        // Geographic analytics
        { 'deliveryAddress.zipCode': 1, 'timestamps.createdAt': -1 },

        // Payment and shipping tracking
        { 'payment.method': 1, 'payment.status': 1 },
        { 'shipping.method': 1, 'shipping.status': 1 },
        { 'shipping.trackingNumber': 1 },
        { 'stripePaymentIntentId': 1 },

        // Customer service queries
        { 'customer.phone': 1 },
        { 'customer.cpf': 1 },

        // Time-based queries
        { 'timestamps.createdAt': -1 },
        { 'timestamps.updatedAt': -1 },
        { 'payment.paymentDate': -1 },
        { 'shipping.actualDelivery': -1 },

        // Status tracking
        { 'statusHistory.timestamp': -1 },
        { 'tracking.events.timestamp': -1 },

        // Notification tracking
        { 'notifications.sent.sentAt': -1, 'notifications.sent.status': 1 },

        // Metadata for analytics
        { 'metadata.source': 1, 'metadata.utmSource': 1, 'timestamps.createdAt': -1 },
        { 'metadata.deviceType': 1, 'timestamps.createdAt': -1 },

        // Priority and tags
        { 'priority': 1, 'timestamps.createdAt': -1 },
        { 'tags': 1 },
        { 'isGift': 1, 'timestamps.createdAt': -1 },

        // Audit and compliance
        { 'auditLog.timestamp': -1, 'auditLog.action': 1 },
        { 'auditLog.performedBy': 1, 'auditLog.timestamp': -1 }
      ];

      for (const indexSpec of indexesToCreate) {
        try {
          await Order.collection.createIndex(indexSpec, {
            background: true,
            sparse: true // Use sparse indexes where appropriate
          });
          console.log(`Created index: ${JSON.stringify(indexSpec)}`);
        } catch (error) {
          console.warn(`Failed to create index ${JSON.stringify(indexSpec)}:`, error);
        }
      }

      // Create text indexes for search functionality
      await this.createTextIndexes();

      console.log('Optimized indexes created successfully');

    } catch (error) {
      console.error('Error creating optimized indexes:', error);
      throw new Error('Failed to create optimized indexes');
    }
  }

  /**
   * Create text indexes for search functionality
   */
  private static async createTextIndexes(): Promise<void> {
    try {
      const Order = mongoose.model('Order');

      // Create compound text index for order search
      await Order.collection.createIndex({
        'orderNumber': 'text',
        'customer.email': 'text',
        'customer.firstName': 'text',
        'customer.lastName': 'text',
        'products.name': 'text',
        'products.sku': 'text',
        'deliveryAddress.street': 'text',
        'deliveryAddress.city': 'text',
        'notes.customer': 'text',
        'notes.internal.note': 'text'
      }, {
        background: true,
        weights: {
          'orderNumber': 10,
          'customer.email': 8,
          'products.sku': 6,
          'customer.firstName': 4,
          'customer.lastName': 4,
          'products.name': 3,
          'deliveryAddress.city': 2,
          'deliveryAddress.street': 1,
          'notes.customer': 1,
          'notes.internal.note': 1
        },
        name: 'order_search_text_index'
      });

      console.log('Text indexes created successfully');

    } catch (error) {
      console.warn('Failed to create text indexes:', error);
    }
  }

  /**
   * Drop suboptimal indexes
   */
  private static async dropSuboptimalIndexes(): Promise<void> {
    try {
      const Order = mongoose.model('Order');
      const collection = Order.collection;

      // Get list of existing indexes
      const indexes = await collection.listIndexes().toArray();

      // Identify indexes to drop (single field indexes that are part of compound indexes)
      const indexesToDrop = indexes.filter(index => {
        const keys = Object.keys(index.key);
        return keys.length === 1 && !['_id', 'orderNumber', 'orderId'].includes(keys[0]);
      });

      for (const index of indexesToDrop) {
        try {
          await collection.dropIndex(index.name);
          console.log(`Dropped suboptimal index: ${index.name}`);
        } catch (error) {
          console.warn(`Failed to drop index ${index.name}:`, error);
        }
      }

    } catch (error) {
      console.warn('Error dropping suboptimal indexes:', error);
    }
  }

  /**
   * Find missing indexes based on query patterns
   */
  private static async findMissingIndexes(collectionName: string): Promise<string[]> {
    const missingIndexes: string[] = [];

    // Common query patterns that need indexes
    const commonPatterns = [
      'customer.email + timestamps.createdAt',
      'payment.status + shipping.status',
      'deliveryAddress.state + deliveryAddress.city',
      'products.category + timestamps.createdAt',
      'pricing.total + payment.status',
      'metadata.source + timestamps.createdAt'
    ];

    // Check if indexes exist for these patterns
    // This is a simplified check - in production, you'd analyze actual query logs
    return missingIndexes;
  }

  /**
   * Find potentially unused indexes
   */
  private static async findUnusedIndexes(collectionName: string, indexes: any[]): Promise<string[]> {
    const unusedIndexes: string[] = [];

    // This would require analyzing index usage statistics
    // MongoDB provides $indexStats aggregation for this
    try {
      const collection = mongoose.connection.db.collection(collectionName);
      const indexStats = await collection.aggregate([{ $indexStats: {} }]).toArray();

      for (const stat of indexStats) {
        if (stat.accesses.ops === 0 && stat.name !== '_id_') {
          unusedIndexes.push(stat.name);
        }
      }
    } catch (error) {
      console.warn('Could not get index usage stats:', error);
    }

    return unusedIndexes;
  }

  /**
   * Generate index recommendations
   */
  private static generateIndexRecommendations(
    indexes: any[],
    missingIndexes: string[],
    unusedIndexes: string[]
  ): string[] {
    const recommendations: string[] = [];

    if (missingIndexes.length > 0) {
      recommendations.push(`Consider creating indexes for: ${missingIndexes.join(', ')}`);
    }

    if (unusedIndexes.length > 0) {
      recommendations.push(`Consider dropping unused indexes: ${unusedIndexes.join(', ')}`);
    }

    if (indexes.length > 20) {
      recommendations.push('High number of indexes detected. Review for consolidation opportunities.');
    }

    return recommendations;
  }

  /**
   * Analyze query performance
   */
  static async analyzeQueryPerformance(): Promise<QueryPerformance[]> {
    try {
      // Enable profiling
      await mongoose.connection.db.admin().command({ profile: 2, slowms: 100 });

      // Get slow query data from system.profile collection
      const profileCollection = mongoose.connection.db.collection('system.profile');
      const slowQueries = await profileCollection
        .find({
          ns: { $regex: /orders$/ },
          millis: { $gte: 100 }
        })
        .sort({ ts: -1 })
        .limit(20)
        .toArray();

      const performanceData: QueryPerformance[] = slowQueries.map(query => ({
        query: JSON.stringify(query.command),
        executionTime: query.millis,
        documentsExamined: query.docsExamined || 0,
        documentsReturned: query.nreturned || 0,
        indexUsed: query.planSummary?.includes('IXSCAN') || false,
        recommendation: this.generateQueryRecommendation(query)
      }));

      // Disable profiling to avoid performance impact
      await mongoose.connection.db.admin().command({ profile: 0 });

      return performanceData;

    } catch (error) {
      console.error('Error analyzing query performance:', error);
      return [];
    }
  }

  /**
   * Generate query performance recommendation
   */
  private static generateQueryRecommendation(query: any): string {
    if (query.docsExamined > query.nreturned * 10) {
      return 'High document examination ratio - consider adding appropriate indexes';
    }

    if (query.millis > 1000) {
      return 'Very slow query - review query structure and indexing strategy';
    }

    if (!query.planSummary?.includes('IXSCAN')) {
      return 'Query not using indexes - consider adding appropriate indexes';
    }

    return 'Query performance is acceptable';
  }

  /**
   * Get comprehensive performance metrics
   */
  static async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      const [connectionStats, collectionStats, indexStats, slowQueries] = await Promise.all([
        this.getConnectionStats(),
        this.getCollectionStats(),
        this.analyzeIndexes(),
        this.analyzeQueryPerformance()
      ]);

      const recommendations = this.generatePerformanceRecommendations(
        connectionStats,
        collectionStats,
        indexStats,
        slowQueries
      );

      return {
        connectionStats,
        collectionStats,
        indexStats,
        slowQueries,
        recommendations
      };

    } catch (error) {
      console.error('Error getting performance metrics:', error);
      throw new Error('Failed to get performance metrics');
    }
  }

  /**
   * Get connection statistics
   */
  private static async getConnectionStats(): Promise<any> {
    try {
      const stats = await mongoose.connection.db.admin().command({ serverStatus: 1 });
      return {
        connections: stats.connections,
        opcounters: stats.opcounters,
        memory: stats.mem,
        uptime: stats.uptime
      };
    } catch (error) {
      console.warn('Could not get connection stats:', error);
      return {};
    }
  }

  /**
   * Get collection statistics
   */
  private static async getCollectionStats(): Promise<any> {
    try {
      const stats = await mongoose.connection.db.collection('orders').stats();
      return {
        documentCount: stats.count,
        totalIndexSize: stats.totalIndexSize,
        storageSize: stats.storageSize,
        avgObjSize: stats.avgObjSize
      };
    } catch (error) {
      console.warn('Could not get collection stats:', error);
      return {};
    }
  }

  /**
   * Generate performance recommendations
   */
  private static generatePerformanceRecommendations(
    connectionStats: any,
    collectionStats: any,
    indexStats: IndexAnalysis[],
    slowQueries: QueryPerformance[]
  ): string[] {
    const recommendations: string[] = [];

    // Connection recommendations
    if (connectionStats.connections?.current > 100) {
      recommendations.push('High connection count detected - consider connection pooling optimization');
    }

    // Collection size recommendations
    if (collectionStats.storageSize > 1000000000) { // 1GB
      recommendations.push('Large collection detected - consider data archiving strategy');
    }

    // Index recommendations
    const totalIndexes = indexStats.reduce((sum, stat) => sum + stat.indexes.length, 0);
    if (totalIndexes > 50) {
      recommendations.push('High number of indexes - review for consolidation opportunities');
    }

    // Query performance recommendations
    if (slowQueries.length > 10) {
      recommendations.push('Multiple slow queries detected - review query optimization');
    }

    const avgExecutionTime = slowQueries.reduce((sum, q) => sum + q.executionTime, 0) / slowQueries.length;
    if (avgExecutionTime > 500) {
      recommendations.push('High average query execution time - optimize slow queries');
    }

    return recommendations;
  }

  /**
   * Optimize database configuration
   */
  static async optimizeConfiguration(): Promise<void> {
    try {
      // Set read concern for better performance
      await mongoose.connection.db.admin().command({
        setDefaultRWConcern: 1,
        defaultReadConcern: { level: 'majority' },
        defaultWriteConcern: { w: 'majority', j: true }
      });

      console.log('Database configuration optimized');

    } catch (error) {
      console.warn('Could not optimize database configuration:', error);
    }
  }

  /**
   * Cleanup old data and optimize storage
   */
  static async performMaintenance(): Promise<void> {
    try {
      // Compact collections to reclaim space
      await mongoose.connection.db.admin().command({ compact: 'orders' });

      // Update statistics
      await mongoose.connection.db.collection('orders').reIndex();

      console.log('Database maintenance completed');

    } catch (error) {
      console.warn('Database maintenance failed:', error);
    }
  }

  /**
   * Monitor database health
   */
  static async checkHealth(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    metrics: any;
    issues: string[];
  }> {
    try {
      const metrics = await this.getPerformanceMetrics();
      const issues: string[] = [];
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';

      // Check for critical issues
      if (metrics.slowQueries.length > 20) {
        issues.push('High number of slow queries');
        status = 'critical';
      }

      if (metrics.connectionStats.connections?.current > 200) {
        issues.push('Very high connection count');
        status = 'critical';
      }

      // Check for warnings
      if (metrics.slowQueries.length > 5) {
        issues.push('Some slow queries detected');
        if (status === 'healthy') status = 'warning';
      }

      const totalIndexes = metrics.indexStats.reduce((sum, stat) => sum + stat.indexes.length, 0);
      if (totalIndexes > 30) {
        issues.push('High number of indexes');
        if (status === 'healthy') status = 'warning';
      }

      return {
        status,
        metrics,
        issues
      };

    } catch (error) {
      return {
        status: 'critical',
        metrics: {},
        issues: [`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }
}

export default PerformanceOptimizer;