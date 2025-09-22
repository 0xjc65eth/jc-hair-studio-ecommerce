/**
 * Prisma Database Client Configuration
 * JC Hair Studio's 62 E-commerce
 *
 * Garante que apenas uma instância do PrismaClient exista em ambiente de
 * desenvolvimento (hot-reload do Next.js). Previne erro "@prisma/client did not initialize yet".
 */

import { PrismaClient } from './generated/prisma';

declare global {
  // eslint-disable-next-line no-var
  var __prismaInstance__: PrismaClient | undefined;
}

// Cria nova instância apenas se não existir
export const prisma =
  global.__prismaInstance__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? [] : ['query', 'warn', 'error'],
    errorFormat: 'pretty',
  });

// Salva a instância globalmente em dev para evitar múltiplas instâncias
if (process.env.NODE_ENV !== 'production') global.__prismaInstance__ = prisma;

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
    // MongoDB health check - usando findFirst em uma collection pequena
    await prisma.user.findFirst({ take: 1 });
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
  // MongoDB com Prisma - sem include, usar findMany separado
  return prisma.user.findUnique({
    where: { id: userId }
  });
}

export async function getProductWithDetails(productId: string) {
  // MongoDB com Prisma - sem include, usar findMany separado
  return prisma.product.findUnique({
    where: { id: productId }
  });
}

export async function getOrderWithItems(orderId: string) {
  // MongoDB com Prisma - sem include, usar findMany separado
  return prisma.order.findUnique({
    where: { id: orderId }
  });
}