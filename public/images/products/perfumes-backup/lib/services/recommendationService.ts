// Recommendation service for JC Hair Studio's 62's 62 E-commerce
import { PrismaClient } from '@prisma/client';

// Lazy initialization of Prisma client
let prisma: PrismaClient | null = null;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export interface RecommendationOptions {
  userId?: string;
  productId?: string;
  limit?: number;
  excludeProductIds?: string[];
}

export interface ProductRecommendation {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image?: string;
  rating: number;
  reviewCount: number;
  isOnSale: boolean;
  discount: number;
  reason: string;
  score: number;
}

export class RecommendationService {
  /**
   * Get personalized recommendations for a user
   */
  static async getPersonalizedRecommendations(
    userId: string,
    options: RecommendationOptions = {}
  ): Promise<ProductRecommendation[]> {
    const { limit = 8, excludeProductIds = [] } = options;

    try {
      // Get user's order history
      const userOrders = await getPrismaClient().order.findMany({
        where: {
          userId,
          status: { in: ['DELIVERED', 'CONFIRMED'] }
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  categories: {
                    include: { category: true }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      // Get user's wishlist
      const wishlistItems = await getPrismaClient().wishlistItem.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              categories: {
                include: { category: true }
              }
            }
          }
        },
        take: 5
      });

      // Extract user preferences
      const preferences = this.extractUserPreferences(userOrders, wishlistItems);

      // Get recommendations based on preferences
      const recommendations = await this.getRecommendationsFromPreferences(
        preferences,
        excludeProductIds,
        limit
      );

      return recommendations;

    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      // Fallback to popular products
      return this.getPopularProducts({ limit, excludeProductIds });
    }
  }

  /**
   * Get similar products based on a specific product
   */
  static async getSimilarProducts(
    productId: string,
    options: RecommendationOptions = {}
  ): Promise<ProductRecommendation[]> {
    const { limit = 6, excludeProductIds = [] } = options;
    
    const baseProduct = await getPrismaClient().product.findUnique({
      where: { id: productId },
      include: {
        categories: { include: { category: true } },
        reviews: { select: { rating: true } }
      }
    });

    if (!baseProduct) {
      return [];
    }

    const categoryIds = baseProduct.categories.map(pc => pc.categoryId);

    // Find similar products
    const similarProducts = await getPrismaClient().product.findMany({
      where: {
        id: { not: productId, notIn: excludeProductIds },
        status: 'ACTIVE',
        OR: [
          // Same categories
          {
            categories: {
              some: {
                categoryId: { in: categoryIds }
              }
            }
          },
          // Similar hair attributes
          {
            AND: [
              baseProduct.hairType ? { hairType: baseProduct.hairType } : {},
              baseProduct.hairTexture ? { hairTexture: baseProduct.hairTexture } : {},
            ]
          },
          // Similar price range (±30%)
          {
            price: {
              gte: Number(baseProduct.price) * 0.7,
              lte: Number(baseProduct.price) * 1.3
            }
          }
        ]
      },
      include: {
        categories: { include: { category: true } },
        images: { where: { isMain: true }, take: 1 },
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true, orderItems: true } }
      },
      take: limit * 2 // Get more to allow for scoring
    });

    // Score and rank products
    const scoredProducts = similarProducts.map(product => {
      let score = 0;
      
      // Category similarity
      const commonCategories = product.categories.filter(pc => 
        categoryIds.includes(pc.categoryId)
      );
      score += commonCategories.length * 3;

      // Hair attribute similarity
      if (product.hairType === baseProduct.hairType) score += 2;
      if (product.hairTexture === baseProduct.hairTexture) score += 2;
      if (product.hairColor === baseProduct.hairColor) score += 1.5;
      if (product.length === baseProduct.length) score += 1;

      // Price similarity
      const priceDiff = Math.abs(Number(product.price) - Number(baseProduct.price));
      const maxPrice = Math.max(Number(product.price), Number(baseProduct.price));
      const priceScore = 1 - (priceDiff / maxPrice);
      score += priceScore;

      // Popularity boost
      score += Math.min(product._count.orderItems * 0.1, 2);

      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

      return {
        ...this.formatProductRecommendation(product),
        score,
        reason: this.getSimilarityReason(baseProduct, product),
      };
    });

    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get frequently bought together products
   */
  static async getFrequentlyBoughtTogether(
    productId: string,
    options: RecommendationOptions = {}
  ): Promise<ProductRecommendation[]> {
    const { limit = 4, excludeProductIds = [] } = options;

    // Find orders containing the base product
    const ordersWithProduct = await getPrismaClient().order.findMany({
      where: {
        items: {
          some: { productId }
        },
        status: { in: ['DELIVERED', 'CONFIRMED'] }
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isMain: true }, take: 1 },
                reviews: { select: { rating: true } },
                _count: { select: { reviews: true } }
              }
            }
          }
        }
      },
      take: 100 // Analyze recent orders
    });

    // Count frequency of co-purchased products
    const productFrequency = new Map<string, { product: any; count: number }>();

    ordersWithProduct.forEach(order => {
      order.items.forEach(item => {
        if (item.productId !== productId && !excludeProductIds.includes(item.productId)) {
          const existing = productFrequency.get(item.productId);
          if (existing) {
            existing.count++;
          } else {
            productFrequency.set(item.productId, {
              product: item.product,
              count: 1
            });
          }
        }
      });
    });

    // Sort by frequency and convert to recommendations
    const recommendations = Array.from(productFrequency.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, limit)
      .map(([, { product, count }]) => ({
        ...this.formatProductRecommendation(product),
        score: count,
        reason: `Frequently bought together (${count} customers)`
      }));

    return recommendations;
  }

  /**
   * Get related products by category
   */
  static async getRelatedByCategory(
    categoryId: string,
    options: RecommendationOptions = {}
  ): Promise<ProductRecommendation[]> {
    const { limit = 8, excludeProductIds = [] } = options;

    const products = await getPrismaClient().product.findMany({
      where: {
        id: { notIn: excludeProductIds },
        status: 'ACTIVE',
        categories: {
          some: { categoryId }
        }
      },
      include: {
        images: { where: { isMain: true }, take: 1 },
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true, orderItems: true } }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return products.map(product => ({
      ...this.formatProductRecommendation(product),
      score: product.isFeatured ? 10 : 5,
      reason: 'Related products in same category'
    }));
  }

  /**
   * Get popular products as fallback recommendations
   */
  static async getPopularProducts(
    options: RecommendationOptions = {}
  ): Promise<ProductRecommendation[]> {
    const { limit = 8, excludeProductIds = [] } = options;

    const products = await getPrismaClient().product.findMany({
      where: {
        id: { notIn: excludeProductIds },
        status: 'ACTIVE'
      },
      include: {
        images: { where: { isMain: true }, take: 1 },
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true, orderItems: true } }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return products.map(product => ({
      ...this.formatProductRecommendation(product),
      score: product._count.orderItems + (product.isFeatured ? 10 : 0),
      reason: product.isFeatured ? 'Featured product' : 'Popular choice'
    }));
  }

  /**
   * Extract user preferences from order history and wishlist
   */
  private static extractUserPreferences(orders: any[], wishlistItems: any[]) {
    const preferences = {
      categories: new Map<string, number>(),
      hairTypes: new Map<string, number>(),
      hairTextures: new Map<string, number>(),
      hairColors: new Map<string, number>(),
      priceRanges: [] as number[],
    };

    // Analyze orders (weighted more heavily)
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        const product = item.product;
        const weight = 2; // Orders are weighted more than wishlist

        // Categories
        product.categories.forEach((pc: any) => {
          const current = preferences.categories.get(pc.category.id) || 0;
          preferences.categories.set(pc.category.id, current + weight);
        });

        // Hair attributes
        if (product.hairType) {
          const current = preferences.hairTypes.get(product.hairType) || 0;
          preferences.hairTypes.set(product.hairType, current + weight);
        }

        if (product.hairTexture) {
          const current = preferences.hairTextures.get(product.hairTexture) || 0;
          preferences.hairTextures.set(product.hairTexture, current + weight);
        }

        if (product.hairColor) {
          const current = preferences.hairColors.get(product.hairColor) || 0;
          preferences.hairColors.set(product.hairColor, current + weight);
        }

        // Price range
        preferences.priceRanges.push(Number(product.price));
      });
    });

    // Analyze wishlist (lower weight)
    wishlistItems.forEach(item => {
      const product = item.product;
      const weight = 1;

      product.categories.forEach((pc: any) => {
        const current = preferences.categories.get(pc.category.id) || 0;
        preferences.categories.set(pc.category.id, current + weight);
      });

      if (product.hairType) {
        const current = preferences.hairTypes.get(product.hairType) || 0;
        preferences.hairTypes.set(product.hairType, current + weight);
      }

      preferences.priceRanges.push(Number(product.price));
    });

    return preferences;
  }

  /**
   * Get recommendations based on user preferences
   */
  private static async getRecommendationsFromPreferences(
    preferences: any,
    excludeProductIds: string[],
    limit: number
  ): Promise<ProductRecommendation[]> {
    // Get preferred categories
    const topCategories = Array.from(preferences.categories.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([categoryId]) => categoryId);

    // Calculate price range
    const prices = preferences.priceRanges;
    const avgPrice = prices.length > 0 ? prices.reduce((sum, p) => sum + p, 0) / prices.length : 50;
    const minPrice = avgPrice * 0.5;
    const maxPrice = avgPrice * 1.5;

    const where: any = {
      id: { notIn: excludeProductIds },
      status: 'ACTIVE',
      price: { gte: minPrice, lte: maxPrice }
    };

    if (topCategories.length > 0) {
      where.categories = {
        some: {
          categoryId: { in: topCategories }
        }
      };
    }

    const products = await getPrismaClient().product.findMany({
      where,
      include: {
        categories: { include: { category: true } },
        images: { where: { isMain: true }, take: 1 },
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true, orderItems: true } }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return products.map(product => ({
      ...this.formatProductRecommendation(product),
      score: this.calculatePreferenceScore(product, preferences),
      reason: 'Recommended for you'
    }));
  }

  /**
   * Calculate preference score for a product
   */
  private static calculatePreferenceScore(product: any, preferences: any): number {
    let score = 0;

    // Category score
    product.categories.forEach((pc: any) => {
      const categoryScore = preferences.categories.get(pc.categoryId) || 0;
      score += categoryScore * 2;
    });

    // Hair attribute scores
    if (product.hairType) {
      score += preferences.hairTypes.get(product.hairType) || 0;
    }

    if (product.hairTexture) {
      score += preferences.hairTextures.get(product.hairTexture) || 0;
    }

    if (product.hairColor) {
      score += preferences.hairColors.get(product.hairColor) || 0;
    }

    // Popularity boost
    score += Math.min(product._count.orderItems * 0.1, 3);

    return score;
  }

  /**
   * Format product for recommendation response
   */
  private static formatProductRecommendation(product: any): Omit<ProductRecommendation, 'reason' | 'score'> {
    const avgRating = product.reviews?.length > 0
      ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
      : 0;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
      image: product.images?.[0]?.url || null,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: product._count?.reviews || 0,
      isOnSale: !!product.comparePrice,
      discount: product.comparePrice 
        ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
        : 0
    };
  }

  /**
   * Generate similarity reason text
   */
  private static getSimilarityReason(baseProduct: any, similarProduct: any): string {
    const reasons = [];

    const baseCategoryIds = baseProduct.categories.map((pc: any) => pc.categoryId);
    const similarCategoryIds = similarProduct.categories.map((pc: any) => pc.categoryId);
    const commonCategories = baseCategoryIds.filter(id => similarCategoryIds.includes(id));

    if (commonCategories.length > 0) {
      reasons.push('same category');
    }

    if (similarProduct.hairType === baseProduct.hairType) {
      reasons.push('same hair type');
    }

    if (similarProduct.hairTexture === baseProduct.hairTexture) {
      reasons.push('same texture');
    }

    const priceDiff = Math.abs(Number(similarProduct.price) - Number(baseProduct.price));
    if (priceDiff <= Number(baseProduct.price) * 0.2) {
      reasons.push('similar price');
    }

    return reasons.length > 0 
      ? `Similar product (${reasons.join(', ')})`
      : 'You might also like this';
  }
}