// Advanced search service for JC Hair Studio's 62 E-commerce
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface SearchFilters {
  query?: string;
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  hairType?: string[];
  hairTexture?: string[];
  hairColor?: string[];
  length?: number[];
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
  onSale?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: any[];
  categories: any[];
  suggestions: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    categories: Array<{ id: string; name: string; count: number }>;
    priceRange: { min: number; max: number };
    hairTypes: Array<{ value: string; count: number }>;
    hairTextures: Array<{ value: string; count: number }>;
    hairColors: Array<{ value: string; count: number }>;
    lengths: Array<{ value: number; count: number }>;
  };
  facets: Record<string, any>;
}

export class SearchService {
  /**
   * Advanced product search with filters and facets
   */
  static async searchProducts(filters: SearchFilters): Promise<SearchResult> {
    const {
      query,
      categories = [],
      priceMin,
      priceMax,
      hairType = [],
      hairTexture = [],
      hairColor = [],
      length = [],
      rating,
      inStock = false,
      featured = false,
      onSale = false,
      sortBy = 'relevance',
      page = 1,
      limit = 12
    } = filters;

    const offset = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
    };

    // Text search
    if (query && query.length >= 2) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { shortDesc: { contains: query, mode: 'insensitive' } },
        { hairColor: { contains: query, mode: 'insensitive' } },
        { keywords: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
        {
          categories: {
            some: {
              category: {
                name: { contains: query, mode: 'insensitive' }
              }
            }
          }
        }
      ];
    }

    // Category filter
    if (categories.length > 0) {
      where.categories = {
        some: {
          category: {
            OR: [
              { id: { in: categories } },
              { slug: { in: categories } }
            ]
          }
        }
      };
    }

    // Price range filter
    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = priceMin;
      if (priceMax !== undefined) where.price.lte = priceMax;
    }

    // Hair attributes filters
    if (hairType.length > 0) {
      where.hairType = { in: hairType as any };
    }

    if (hairTexture.length > 0) {
      where.hairTexture = { in: hairTexture as any };
    }

    if (hairColor.length > 0) {
      where.hairColor = { in: hairColor };
    }

    if (length.length > 0) {
      where.length = { in: length };
    }

    // Stock filter
    if (inStock) {
      where.quantity = { gt: 0 };
    }

    // Featured filter
    if (featured) {
      where.isFeatured = true;
    }

    // On sale filter
    if (onSale) {
      where.comparePrice = { not: null };
    }

    // Rating filter (requires aggregation)
    let ratingFilter: any = {};
    if (rating) {
      ratingFilter = {
        reviews: {
          some: {}
        }
      };
    }

    // Build order by clause
    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

    switch (sortBy) {
      case 'price_asc':
        orderBy = [{ price: 'asc' }];
        break;
      case 'price_desc':
        orderBy = [{ price: 'desc' }];
        break;
      case 'rating':
        // This would require a more complex query with aggregation
        orderBy = [{ createdAt: 'desc' }];
        break;
      case 'newest':
        orderBy = [{ createdAt: 'desc' }];
        break;
      case 'popular':
        // This would track view count or purchase count
        orderBy = [{ createdAt: 'desc' }];
        break;
      case 'relevance':
      default:
        if (query) {
          // Relevance scoring - prioritize exact matches
          orderBy = [
            { isFeatured: 'desc' },
            { createdAt: 'desc' }
          ];
        } else {
          orderBy = [{ displayOrder: 'asc' }, { createdAt: 'desc' }];
        }
        break;
    }

    // Execute main search query
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: { ...where, ...ratingFilter },
        include: {
          categories: {
            include: { category: true }
          },
          images: {
            where: { isMain: true },
            take: 1
          },
          variants: {
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
            take: 3
          },
          reviews: {
            select: {
              rating: true
            }
          },
          _count: {
            select: {
              reviews: true,
              wishlistItems: true
            }
          }
        },
        orderBy,
        skip: offset,
        take: limit
      }),
      prisma.product.count({
        where: { ...where, ...ratingFilter }
      })
    ]);

    // Calculate average ratings and format products
    const formattedProducts = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        shortDesc: product.shortDesc,
        price: product.price,
        comparePrice: product.comparePrice,
        sku: product.sku,
        hairType: product.hairType,
        hairTexture: product.hairTexture,
        hairColor: product.hairColor,
        length: product.length,
        quantity: product.quantity,
        isFeatured: product.isFeatured,
        categories: product.categories.map(pc => ({
          id: pc.category.id,
          name: pc.category.name,
          slug: pc.category.slug
        })),
        image: product.images[0]?.url || null,
        variants: product.variants.map(v => ({
          id: v.id,
          name: v.name,
          size: v.size,
          color: v.color,
          price: v.price || product.price
        })),
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: product._count.reviews,
        wishlistCount: product._count.wishlistItems,
        isOnSale: !!product.comparePrice,
        discount: product.comparePrice 
          ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
          : 0
      };
    });

    // Get facets and filters data
    const [facets, suggestions] = await Promise.all([
      this.getFacets(where),
      this.getSuggestions(query || '')
    ]);

    // Calculate pagination
    const totalPages = Math.ceil(totalCount / limit);

    return {
      products: formattedProducts,
      categories: [], // Will be filled by category search if needed
      suggestions,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: facets,
      facets: {}
    };
  }

  /**
   * Get autocomplete suggestions
   */
  static async getAutocompleteSuggestions(query: string, limit = 10): Promise<string[]> {
    if (!query || query.length < 2) return [];

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { hairColor: { contains: query, mode: 'insensitive' } },
            { keywords: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: { name: true, hairColor: true },
        take: limit
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
          name: { contains: query, mode: 'insensitive' }
        },
        select: { name: true },
        take: Math.floor(limit / 2)
      })
    ]);

    const suggestions = new Set<string>();

    // Add product names
    products.forEach(product => {
      if (product.name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(product.name);
      }
      if (product.hairColor && product.hairColor.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(product.hairColor);
      }
    });

    // Add category names
    categories.forEach(category => {
      suggestions.add(category.name);
    });

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Search categories
   */
  static async searchCategories(query: string, limit = 5): Promise<any[]> {
    if (!query || query.length < 2) return [];

    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' },
      take: limit
    });

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      productCount: category._count.products
    }));
  }

  /**
   * Get search facets for filtering
   */
  private static async getFacets(baseWhere: Prisma.ProductWhereInput) {
    // Get available categories
    const categoriesWithCounts = await prisma.category.findMany({
      where: {
        isActive: true,
        products: {
          some: {
            product: baseWhere
          }
        }
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: {
              where: {
                product: baseWhere
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Get price range
    const priceAgg = await prisma.product.aggregate({
      where: baseWhere,
      _min: { price: true },
      _max: { price: true }
    });

    // Get hair types with counts
    const hairTypes = await prisma.product.groupBy({
      by: ['hairType'],
      where: { ...baseWhere, hairType: { not: null } },
      _count: true,
      orderBy: { hairType: 'asc' }
    });

    // Get hair textures with counts
    const hairTextures = await prisma.product.groupBy({
      by: ['hairTexture'],
      where: { ...baseWhere, hairTexture: { not: null } },
      _count: true,
      orderBy: { hairTexture: 'asc' }
    });

    // Get hair colors with counts
    const hairColors = await prisma.product.groupBy({
      by: ['hairColor'],
      where: { ...baseWhere, hairColor: { not: null } },
      _count: true,
      orderBy: { hairColor: 'asc' }
    });

    // Get lengths with counts
    const lengths = await prisma.product.groupBy({
      by: ['length'],
      where: { ...baseWhere, length: { not: null } },
      _count: true,
      orderBy: { length: 'asc' }
    });

    return {
      categories: categoriesWithCounts.map(cat => ({
        id: cat.id,
        name: cat.name,
        count: cat._count.products
      })),
      priceRange: {
        min: Number(priceAgg._min.price || 0),
        max: Number(priceAgg._max.price || 1000)
      },
      hairTypes: hairTypes.map(ht => ({
        value: ht.hairType,
        count: ht._count
      })),
      hairTextures: hairTextures.map(ht => ({
        value: ht.hairTexture,
        count: ht._count
      })),
      hairColors: hairColors
        .filter(hc => hc.hairColor)
        .map(hc => ({
          value: hc.hairColor!,
          count: hc._count
        })),
      lengths: lengths
        .filter(l => l.length)
        .map(l => ({
          value: l.length!,
          count: l._count
        }))
    };
  }

  /**
   * Get search suggestions based on popular searches
   */
  private static async getSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) {
      // Return popular search terms
      return [
        'extensions',
        'curly hair',
        'straight hair',
        'long hair',
        'blonde',
        'brunette',
        '50cm',
        '60cm'
      ];
    }

    return this.getAutocompleteSuggestions(query, 5);
  }
}