// Prisma Fallback Configuration - JC Hair Studio's 62
// This file provides fallback functionality when Prisma client generation fails

interface PrismaClientFallback {
  user: any;
  product: any;
  order: any;
  payment: any;
  category: any;
  review: any;
  cartItem: any;
  wishlistItem: any;
  coupon: any;
  address: any;
  setting: any;
  newsletterSubscriber: any;
  tag: any;
  page: any;
  blogPost: any;
  pointsTransaction: any;
  pointsReward: any;
  pointsRedemption: any;
  pageView: any;
  productView: any;
  account: any;
  session: any;
  verificationToken: any;
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
  $transaction: (fn: any) => Promise<any>;
}

// Mock Prisma client for when the real client fails to generate
const createFallbackPrismaClient = (): PrismaClientFallback => {
  const mockModel = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (data: any) => ({ id: 'mock-id', ...data.data }),
    update: async (data: any) => ({ id: data.where.id, ...data.data }),
    delete: async (data: any) => ({ id: data.where.id }),
    deleteMany: async () => ({ count: 0 }),
    updateMany: async () => ({ count: 0 }),
    count: async () => 0,
    aggregate: async () => ({}),
    groupBy: async () => [],
    createMany: async () => ({ count: 0 }),
    upsert: async (data: any) => ({ id: 'mock-id', ...data.create }),
  };

  return {
    user: mockModel,
    product: mockModel,
    order: mockModel,
    payment: mockModel,
    category: mockModel,
    review: mockModel,
    cartItem: mockModel,
    wishlistItem: mockModel,
    coupon: mockModel,
    address: mockModel,
    setting: mockModel,
    newsletterSubscriber: mockModel,
    tag: mockModel,
    page: mockModel,
    blogPost: mockModel,
    pointsTransaction: mockModel,
    pointsReward: mockModel,
    pointsRedemption: mockModel,
    pageView: mockModel,
    productView: mockModel,
    account: mockModel,
    session: mockModel,
    verificationToken: mockModel,
    $connect: async () => {
      console.warn('Using Prisma fallback client - database operations are mocked');
    },
    $disconnect: async () => {
      console.log('Disconnected from fallback Prisma client');
    },
    $transaction: async (fn: any) => {
      console.warn('Transaction using fallback Prisma client');
      return fn(createFallbackPrismaClient());
    },
  };
};

// Export the fallback client
export const PrismaClientFallback = createFallbackPrismaClient;

// Error-safe Prisma client getter
export const getPrismaClient = () => {
  try {
    // Try to import the generated Prisma client
    const { PrismaClient } = require('./generated/prisma');
    return new PrismaClient();
  } catch (error) {
    console.warn('Failed to load Prisma client, using fallback:', error.message);
    return createFallbackPrismaClient();
  }
};

export default getPrismaClient;