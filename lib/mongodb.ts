/**
 * MongoDB Service Layer
 * JC Hair Studio's 62's 62 E-commerce
 *
 * Complete MongoDB integration replacing Prisma
 * Optimized for Vercel serverless environment with:
 * - Build-time safety checks
 * - Connection pooling optimization
 * - Error handling and retry logic
 * - Schema index management
 */

// Main exports
export { Product } from './mongodb/schemas/product.schema';
export { Category } from './mongodb/schemas/category.schema';
export { User } from './mongodb/schemas/user.schema';
export { Order } from './mongodb/schemas/order.schema';
export { Review } from './mongodb/schemas/review.schema';

// Re-export connection utilities
export {
  connectDB,
  connectDB as connectToDatabase,  // Alias for compatibility
  disconnectDB,
  checkDBHealth,
  getConnectionStats,
  setupConnectionListeners,
  safeDbOperation,
  initializeConnection
} from './mongodb/connection';

// Build-time safety wrapper
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

// Safe database operation wrapper
function wrapDbOperation<T>(operation: () => Promise<T>): () => Promise<T | null> {
  return async () => {
    if (isBuild) {
      console.warn('Database operation skipped during build');
      return null;
    }
    try {
      return await operation();
    } catch (error) {
      console.error('Database operation failed:', error);
      throw error;
    }
  };
}

// Create a prisma-compatible interface for easier migration
export const prisma = {
  async $connect() {
    if (isBuild) {
      console.warn('Database connection skipped during build');
      return null;
    }
    const { connectDB } = await import('./mongodb/connection');
    return connectDB();
  },

  async $disconnect() {
    if (isBuild) {
      return null;
    }
    const { disconnectDB } = await import('./mongodb/connection');
    return disconnectDB();
  },

  // Points and Referral System Models
  pointsTransaction: {
    async findMany(options: any) {
      return wrapDbOperation(async () => {
        const { PointsTransaction } = await import('./mongodb/schemas/referralTiers.schema');
        const query = PointsTransaction.find(options?.where || {});
        if (options?.skip) query.skip(options.skip);
        if (options?.take) query.limit(options.take);
        if (options?.orderBy) {
          const orderBy: any = {};
          Object.keys(options.orderBy).forEach(key => {
            orderBy[key] = options.orderBy[key] === 'asc' ? 1 : -1;
          });
          query.sort(orderBy);
        }
        return query.exec();
      })();
    },
    async create(options: any) {
      return wrapDbOperation(async () => {
        const { PointsTransaction } = await import('./mongodb/schemas/referralTiers.schema');
        return PointsTransaction.create(options.data);
      })();
    },
    async findFirst(options: any) {
      return wrapDbOperation(async () => {
        const { PointsTransaction } = await import('./mongodb/schemas/referralTiers.schema');
        return PointsTransaction.findOne(options?.where || {}).exec();
      })();
    }
  },

  pointsRedemption: {
    async findMany(options: any) {
      return wrapDbOperation(async () => {
        const { PointsRedemption } = await import('./mongodb/schemas/referralTiers.schema');
        const query = PointsRedemption.find(options?.where || {});
        if (options?.skip) query.skip(options.skip);
        if (options?.take) query.limit(options.take);
        if (options?.orderBy) {
          const orderBy: any = {};
          Object.keys(options.orderBy).forEach(key => {
            orderBy[key] = options.orderBy[key] === 'asc' ? 1 : -1;
          });
          query.sort(orderBy);
        }
        return query.exec();
      })();
    },
    async create(options: any) {
      return wrapDbOperation(async () => {
        const { PointsRedemption } = await import('./mongodb/schemas/referralTiers.schema');
        return PointsRedemption.create(options.data);
      })();
    },
    async findFirst(options: any) {
      return wrapDbOperation(async () => {
        const { PointsRedemption } = await import('./mongodb/schemas/referralTiers.schema');
        return PointsRedemption.findOne(options?.where || {}).exec();
      })();
    }
  },

  referralCode: {
    async findUnique(options: any) {
      return wrapDbOperation(async () => {
        const { ReferralCode } = await import('./mongodb/schemas/referralCode.schema');
        const whereCondition = options.where;
        if (whereCondition.code) {
          return ReferralCode.findOne({ code: whereCondition.code }).exec();
        }
        return ReferralCode.findById(whereCondition.id).exec();
      })();
    },
    async findMany(options: any) {
      const { ReferralCode } = await import('./mongodb/schemas/referralCode.schema');
      const query = ReferralCode.find(options?.where || {});
      if (options?.skip) query.skip(options.skip);
      if (options?.take) query.limit(options.take);
      if (options?.orderBy) {
        const orderBy: any = {};
        Object.keys(options.orderBy).forEach(key => {
          orderBy[key] = options.orderBy[key] === 'asc' ? 1 : -1;
        });
        query.sort(orderBy);
      }
      return query.exec();
    },
    async create(options: any) {
      const { ReferralCode } = await import('./mongodb/schemas/referralCode.schema');
      return ReferralCode.create(options.data);
    },
    async update(options: any) {
      const { ReferralCode } = await import('./mongodb/schemas/referralCode.schema');
      return ReferralCode.findByIdAndUpdate(options.where.id, options.data, { new: true }).exec();
    }
  },

  referral: {
    async findMany(options: any) {
      const { Referral } = await import('./mongodb/schemas/referralStats.schema');
      const query = Referral.find(options?.where || {});
      if (options?.skip) query.skip(options.skip);
      if (options?.take) query.limit(options.take);
      if (options?.orderBy) {
        const orderBy: any = {};
        Object.keys(options.orderBy).forEach(key => {
          orderBy[key] = options.orderBy[key] === 'asc' ? 1 : -1;
        });
        query.sort(orderBy);
      }
      return query.exec();
    },
    async create(options: any) {
      const { Referral } = await import('./mongodb/schemas/referralStats.schema');
      return Referral.create(options.data);
    },
    async count(options: any) {
      const { Referral } = await import('./mongodb/schemas/referralStats.schema');
      return Referral.countDocuments(options?.where || {}).exec();
    }
  },

  referralReward: {
    async findMany(options: any) {
      const { ReferralReward } = await import('./mongodb/schemas/referralRewards.schema');
      const query = ReferralReward.find(options?.where || {});
      if (options?.skip) query.skip(options.skip);
      if (options?.take) query.limit(options.take);
      if (options?.orderBy) {
        const orderBy: any = {};
        Object.keys(options.orderBy).forEach(key => {
          orderBy[key] = options.orderBy[key] === 'asc' ? 1 : -1;
        });
        query.sort(orderBy);
      }
      return query.exec();
    },
    async create(options: any) {
      const { ReferralReward } = await import('./mongodb/schemas/referralRewards.schema');
      return ReferralReward.create(options.data);
    }
  },

  referralCashback: {
    async findMany(options: any) {
      const { ReferralCashback } = await import('./mongodb/schemas/referralRewards.schema');
      const query = ReferralCashback.find(options?.where || {});
      if (options?.skip) query.skip(options.skip);
      if (options?.take) query.limit(options.take);
      if (options?.orderBy) {
        const orderBy: any = {};
        Object.keys(options.orderBy).forEach(key => {
          orderBy[key] = options.orderBy[key] === 'asc' ? 1 : -1;
        });
        query.sort(orderBy);
      }
      return query.exec();
    },
    async create(options: any) {
      const { ReferralCashback } = await import('./mongodb/schemas/referralRewards.schema');
      return ReferralCashback.create(options.data);
    },
    async aggregate(options: any) {
      const { ReferralCashback } = await import('./mongodb/schemas/referralRewards.schema');
      const result = await ReferralCashback.aggregate([
        { $match: options?.where || {} },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      return { _sum: { amount: result[0]?.sum || 0 } };
    }
  },

  cashbackPayout: {
    async findMany(options: any) {
      const { CashbackPayout } = await import('./mongodb/schemas/referralRewards.schema');
      const query = CashbackPayout.find(options?.where || {});
      if (options?.skip) query.skip(options.skip);
      if (options?.take) query.limit(options.take);
      if (options?.orderBy) {
        const orderBy: any = {};
        Object.keys(options.orderBy).forEach(key => {
          orderBy[key] = options.orderBy[key] === 'asc' ? 1 : -1;
        });
        query.sort(orderBy);
      }
      return query.exec();
    },
    async create(options: any) {
      const { CashbackPayout } = await import('./mongodb/schemas/referralRewards.schema');
      return CashbackPayout.create(options.data);
    }
  },

  referralTier: {
    async findMany(options: any) {
      const { ReferralTier } = await import('./mongodb/schemas/referralTiers.schema');
      const query = ReferralTier.find(options?.where || {});
      if (options?.skip) query.skip(options.skip);
      if (options?.take) query.limit(options.take);
      if (options?.orderBy) {
        const orderBy: any = {};
        Object.keys(options.orderBy).forEach(key => {
          orderBy[key] = options.orderBy[key] === 'asc' ? 1 : -1;
        });
        query.sort(orderBy);
      }
      return query.exec();
    },
    async findFirst(options: any) {
      const { ReferralTier } = await import('./mongodb/schemas/referralTiers.schema');
      return ReferralTier.findOne(options?.where || {}).exec();
    }
  },

  userReferralStats: {
    async findUnique(options: any) {
      const { UserReferralStats } = await import('./mongodb/schemas/referralStats.schema');
      const whereCondition = options.where;
      if (whereCondition.userId) {
        return UserReferralStats.findOne({ userId: whereCondition.userId }).exec();
      }
      return UserReferralStats.findById(whereCondition.id).exec();
    },
    async create(options: any) {
      const { UserReferralStats } = await import('./mongodb/schemas/referralStats.schema');
      return UserReferralStats.create(options.data);
    },
    async update(options: any) {
      const { UserReferralStats } = await import('./mongodb/schemas/referralStats.schema');
      return UserReferralStats.findOneAndUpdate(
        { userId: options.where.userId },
        options.data,
        { new: true }
      ).exec();
    },
    async upsert(options: any) {
      const { UserReferralStats } = await import('./mongodb/schemas/referralStats.schema');
      return UserReferralStats.findOneAndUpdate(
        options.where,
        { $setOnInsert: options.create, $set: options.update },
        { new: true, upsert: true }
      ).exec();
    }
  },

  product: {
    async findMany(options: any) {
      return wrapDbOperation(async () => {
        const { Product } = await import('./mongodb/schemas/product.schema');
        const query = Product.find(options?.where || {});

        if (options?.skip) query.skip(options.skip);
        if (options?.take) query.limit(options.take);
        if (options?.orderBy) {
          const orderBy: any = {};
          if (Array.isArray(options.orderBy)) {
            options.orderBy.forEach((order: any) => {
              Object.keys(order).forEach(key => {
                orderBy[key] = order[key] === 'asc' ? 1 : -1;
              });
            });
          } else {
            Object.keys(options.orderBy).forEach(key => {
              orderBy[key] = options.orderBy[key] === 'asc' ? 1 : -1;
            });
          }
          query.sort(orderBy);
        }

        return query.exec();
      })();
    },
    
    async findFirst(options: any) {
      return wrapDbOperation(async () => {
        const { Product } = await import('./mongodb/schemas/product.schema');
        return Product.findOne(options?.where || {}).exec();
      })();
    },

    async count(options: any) {
      return wrapDbOperation(async () => {
        const { Product } = await import('./mongodb/schemas/product.schema');
        return Product.countDocuments(options?.where || {}).exec();
      })();
    },

    async create(options: any) {
      return wrapDbOperation(async () => {
        const { Product } = await import('./mongodb/schemas/product.schema');
        return Product.create(options.data);
      })();
    },

    async update(options: any) {
      return wrapDbOperation(async () => {
        const { Product } = await import('./mongodb/schemas/product.schema');
        return Product.findOneAndUpdate(
          { _id: options.where.id },
          options.data,
          { new: true }
        ).exec();
      })();
    },

    async delete(options: any) {
      return wrapDbOperation(async () => {
        const { Product } = await import('./mongodb/schemas/product.schema');
        return Product.findByIdAndDelete(options.where.id).exec();
      })();
    }
  },
  
  category: {
    async findMany(options: any) {
      return wrapDbOperation(async () => {
        const { Category } = await import('./mongodb/schemas/category.schema');
        const query = Category.find(options?.where || {});

        if (options?.skip) query.skip(options.skip);
        if (options?.take) query.limit(options.take);
        if (options?.orderBy) {
          const orderBy: any = {};
          if (Array.isArray(options.orderBy)) {
            options.orderBy.forEach((order: any) => {
              Object.keys(order).forEach(key => {
                orderBy[key] = order[key] === 'asc' ? 1 : -1;
              });
            });
          }
          query.sort(orderBy);
        }

        return query.exec();
      })();
    },

    async findFirst(options: any) {
      return wrapDbOperation(async () => {
        const { Category } = await import('./mongodb/schemas/category.schema');
        return Category.findOne(options?.where || {}).exec();
      })();
    },

    async count(options: any) {
      return wrapDbOperation(async () => {
        const { Category } = await import('./mongodb/schemas/category.schema');
        return Category.countDocuments(options?.where || {}).exec();
      })();
    },

    async create(options: any) {
      return wrapDbOperation(async () => {
        const { Category } = await import('./mongodb/schemas/category.schema');
        return Category.create(options.data);
      })();
    },

    async update(options: any) {
      return wrapDbOperation(async () => {
        const { Category } = await import('./mongodb/schemas/category.schema');
        return Category.findOneAndUpdate(
          { _id: options.where.id },
          options.data,
          { new: true }
        ).exec();
      })();
    },

    async delete(options: any) {
      return wrapDbOperation(async () => {
        const { Category } = await import('./mongodb/schemas/category.schema');
        return Category.findByIdAndDelete(options.where.id).exec();
      })();
    }
  }
};

// Initialize connection monitoring for production
if (typeof window === 'undefined' && !isBuild) {
  // Server-side initialization
  const initializeMonitoring = async () => {
    try {
      const { initializeConnection } = await import('./mongodb/connection');
      await initializeConnection();
    } catch (error) {
      console.error('Failed to initialize MongoDB monitoring:', error);
    }
  };

  // Delay initialization to allow environment setup
  setTimeout(initializeMonitoring, 1000);
}

export default prisma;