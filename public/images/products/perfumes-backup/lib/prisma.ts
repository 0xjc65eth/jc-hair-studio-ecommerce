/**
 * Prisma Database Client Configuration
 * JC Hair Studio's 62 E-commerce
 *
 * Garante que apenas uma instância do PrismaClient exista em ambiente de
 * desenvolvimento (hot-reload do Next.js). Previne erro "@prisma/client did not initialize yet".
 */

// Fallback to MongoDB directly when Prisma is not available
import { connectDB, prisma } from './mongodb';

// Export the MongoDB prisma client directly
export { prisma };
export default prisma;

// Re-export connection helpers from mongodb module
export { connectDB, disconnectDB, checkDBHealth } from './mongodb';

// Utility types for better TypeScript support
export type UserWithAddresses = Awaited<ReturnType<typeof getUserWithAddresses>>;
export type ProductWithDetails = Awaited<ReturnType<typeof getProductWithDetails>>;
export type OrderWithItems = Awaited<ReturnType<typeof getOrderWithItems>>;

// Common query helpers using MongoDB schemas
export async function getUserWithAddresses(userId: string) {
  const { User } = await import('./mongodb/schemas/user.schema');
  return User.findById(userId).exec();
}

export async function getProductWithDetails(productId: string) {
  const { Product } = await import('./mongodb/schemas/product.schema');
  return Product.findById(productId).exec();
}

export async function getOrderWithItems(orderId: string) {
  const { Order } = await import('./mongodb/schemas/order.schema');
  return Order.findById(orderId).exec();
}