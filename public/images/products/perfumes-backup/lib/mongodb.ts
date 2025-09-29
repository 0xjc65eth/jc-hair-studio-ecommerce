/**
 * MongoDB Service Layer
 * JC Hair Studio's 62's 62 E-commerce
 * 
 * Complete MongoDB integration replacing Prisma
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
  setupConnectionListeners
} from './mongodb/connection';

// Legacy export removed (duplicate resolved)

// Create a prisma-compatible interface for easier migration
export const prisma = {
  async $connect() {
    const { connectDB } = await import('./mongodb/connection');
    return connectDB();
  },
  
  async $disconnect() {
    const { disconnectDB } = await import('./mongodb/connection');
    return disconnectDB();
  },
  
  product: {
    async findMany(options: any) {
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
    },
    
    async findFirst(options: any) {
      const { Product } = await import('./mongodb/schemas/product.schema');
      return Product.findOne(options?.where || {}).exec();
    },
    
    async count(options: any) {
      const { Product } = await import('./mongodb/schemas/product.schema');
      return Product.countDocuments(options?.where || {}).exec();
    },
    
    async create(options: any) {
      const { Product } = await import('./mongodb/schemas/product.schema');
      return Product.create(options.data);
    },
    
    async update(options: any) {
      const { Product } = await import('./mongodb/schemas/product.schema');
      return Product.findOneAndUpdate(
        { _id: options.where.id },
        options.data,
        { new: true }
      ).exec();
    },
    
    async delete(options: any) {
      const { Product } = await import('./mongodb/schemas/product.schema');
      return Product.findByIdAndDelete(options.where.id).exec();
    }
  },
  
  category: {
    async findMany(options: any) {
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
    },
    
    async findFirst(options: any) {
      const { Category } = await import('./mongodb/schemas/category.schema');
      return Category.findOne(options?.where || {}).exec();
    },
    
    async count(options: any) {
      const { Category } = await import('./mongodb/schemas/category.schema');
      return Category.countDocuments(options?.where || {}).exec();
    },
    
    async create(options: any) {
      const { Category } = await import('./mongodb/schemas/category.schema');
      return Category.create(options.data);
    },
    
    async update(options: any) {
      const { Category } = await import('./mongodb/schemas/category.schema');
      return Category.findOneAndUpdate(
        { _id: options.where.id },
        options.data,
        { new: true }
      ).exec();
    },
    
    async delete(options: any) {
      const { Category } = await import('./mongodb/schemas/category.schema');
      return Category.findByIdAndDelete(options.where.id).exec();
    }
  }
};

export default prisma;