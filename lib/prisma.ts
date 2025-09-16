/**
 * Prisma Database Client Configuration
 * JC Hair Studio's 62's 62 E-commerce
 */

import { PrismaClient } from './generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

// Database connection helper
export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Disconnect helper
export async function disconnectDB() {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
    throw error;
  }
}

// Health check helper
export async function checkDBHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: 'unhealthy', error: error?.toString(), timestamp: new Date().toISOString() };
  }
}

// Utility types for better TypeScript support
export type UserWithAddresses = Awaited<ReturnType<typeof getUserWithAddresses>>;
export type ProductWithDetails = Awaited<ReturnType<typeof getProductWithDetails>>;
export type OrderWithItems = Awaited<ReturnType<typeof getOrderWithItems>>;

// Common query helpers
export async function getUserWithAddresses(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: {
        where: { isActive: true },
        orderBy: { isDefault: 'desc' },
      },
    },
  });
}

export async function getProductWithDetails(productId: string) {
  return prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: {
        orderBy: { displayOrder: 'asc' },
      },
      variants: {
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      },
      categories: {
        include: {
          category: true,
        },
      },
      reviews: {
        where: { isPublished: true },
        include: {
          user: {
            select: {
              name: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function getOrderWithItems(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              images: {
                where: { isMain: true },
                take: 1,
              },
            },
          },
        },
      },
      shippingAddress: true,
      user: {
        select: {
          email: true,
          name: true,
          firstName: true,
          lastName: true,
        },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}