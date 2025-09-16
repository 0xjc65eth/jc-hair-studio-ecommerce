/**
 * Product Service
 * JC Hair Studio's 62's 62 E-commerce
 */

import { Prisma } from '../generated/prisma';
import prisma from '../prisma';
import { 
  ProductWithDetails, 
  ProductFilters, 
  ProductSearchResult, 
  CreateProductData, 
  UpdateProductData,
  ProductSortOption 
} from '../../types/product';

export class ProductService {
  /**
   * Get all products with filtering and pagination
   */
  static async getProducts(filters: ProductFilters = {}): Promise<ProductSearchResult> {
    const {
      category = [],
      priceMin,
      priceMax,
      hairType = [],
      hairTexture = [],
      length = [],
      color = [],
      inStock,
      featured,
      onSale,
      rating,
      search,
      sortBy = 'newest',
      page = 1,
      limit = 12
    } = filters;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
      ...(category.length > 0 && {
        categories: {
          some: {
            category: {
              slug: { in: category }
            }
          }
        }
      }),
      ...(priceMin !== undefined && { price: { gte: priceMin } }),
      ...(priceMax !== undefined && { price: { lte: priceMax } }),
      ...(hairType.length > 0 && { hairType: { in: hairType } }),
      ...(hairTexture.length > 0 && { hairTexture: { in: hairTexture } }),
      ...(length.length > 0 && { length: { in: length } }),
      ...(color.length > 0 && { hairColor: { in: color } }),
      ...(inStock && { quantity: { gt: 0 } }),
      ...(featured && { isFeatured: true }),
      ...(onSale && { comparePrice: { not: null } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { hairColor: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    // Build order clause
    const orderBy = this.getOrderBy(sortBy);

    // Calculate skip
    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            orderBy: { displayOrder: 'asc' }
          },
          variants: {
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' }
          },
          categories: {
            include: {
              category: true
            }
          },
          reviews: {
            where: { isPublished: true },
            include: {
              user: {
                select: {
                  name: true,
                  firstName: true,
                  lastName: true
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
          },
          _count: {
            select: { reviews: true }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    // Calculate pagination
    const totalPages = Math.ceil(total / limit);
    const pagination = {
      total,
      totalPages,
      currentPage: page,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };

    // Calculate average ratings for products
    const productsWithRatings = await this.addAverageRatings(products as ProductWithDetails[]);

    // Get filter aggregations
    const filterAggregations = await this.getFilterAggregations(where);

    return {
      products: productsWithRatings,
      pagination,
      filters: filterAggregations
    };
  }

  /**
   * Get single product by ID or slug
   */
  static async getProduct(identifier: string): Promise<ProductWithDetails | null> {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ],
        status: 'ACTIVE'
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        variants: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        options: {
          include: {
            values: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                name: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { reviews: true }
        }
      }
    });

    if (!product) return null;

    const [productWithRating] = await this.addAverageRatings([product as ProductWithDetails]);
    return productWithRating;
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit = 8): Promise<ProductWithDetails[]> {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        status: 'ACTIVE'
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        variants: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        options: {
          include: {
            values: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                name: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return this.addAverageRatings(products as ProductWithDetails[]);
  }

  /**
   * Get category by slug
   */
  static async getCategoryBySlug(slug: string) {
    return await prisma.category.findUnique({
      where: { slug }
    });
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(categorySlug: string, limit = 12): Promise<ProductWithDetails[]> {
    // First find the category by slug
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    });

    if (!category) {
      return [];
    }

    const products = await prisma.product.findMany({
      where: {
        categoryIds: {
          has: category.id
        },
        status: 'ACTIVE'
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        variants: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        tags: {
          include: {
            tag: true
          }
        },
        options: {
          include: {
            values: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                name: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return this.addAverageRatings(products as ProductWithDetails[]);
  }

  /**
   * Search products
   */
  static async searchProducts(query: string, limit = 20): Promise<ProductWithDetails[]> {
    if (!query.trim()) return [];

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { shortDesc: { contains: query, mode: 'insensitive' } },
          { hairColor: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } }
        ],
        status: 'ACTIVE'
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        variants: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        options: {
          include: {
            values: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                name: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: [
        {
          name: { 
            search: query,
            sort: 'desc'
          } as any
        }
      ],
      take: limit
    });

    return this.addAverageRatings(products as ProductWithDetails[]);
  }

  /**
   * Create new product
   */
  static async createProduct(data: CreateProductData): Promise<ProductWithDetails> {
    const { categories, images, variants, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        categories: {
          create: categories.map(categoryId => ({
            categoryId
          }))
        },
        images: {
          create: images.map((image, index) => ({
            ...image,
            displayOrder: index,
            isMain: index === 0 || image.isMain
          }))
        },
        variants: variants ? {
          create: variants.map((variant, index) => ({
            ...variant,
            displayOrder: index
          }))
        } : undefined
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        variants: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        options: {
          include: {
            values: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                name: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        _count: {
          select: { reviews: true }
        }
      }
    });

    const [productWithRating] = await this.addAverageRatings([product as ProductWithDetails]);
    return productWithRating;
  }

  /**
   * Update product
   */
  static async updateProduct(data: UpdateProductData): Promise<ProductWithDetails | null> {
    const { id, categories, images, variants, ...updateData } = data;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        ...(categories && {
          categories: {
            deleteMany: {},
            create: categories.map(categoryId => ({
              categoryId
            }))
          }
        }),
        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((image, index) => ({
              ...image,
              displayOrder: index,
              isMain: index === 0 || image.isMain
            }))
          }
        }),
        ...(variants && {
          variants: {
            deleteMany: {},
            create: variants.map((variant, index) => ({
              ...variant,
              displayOrder: index
            }))
          }
        })
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        variants: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        options: {
          include: {
            values: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                name: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        _count: {
          select: { reviews: true }
        }
      }
    });

    const [productWithRating] = await this.addAverageRatings([product as ProductWithDetails]);
    return productWithRating;
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: string): Promise<boolean> {
    try {
      await prisma.product.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  /**
   * Get products with professional pricing
   */
  static async getProductsWithProfessionalPricing(filters: ProductFilters = {}): Promise<ProductSearchResult> {
    const result = await this.getProducts(filters);
    
    // Transform products to show professional pricing when available
    const productsWithProfessionalPricing = result.products.map(product => ({
      ...product,
      originalPrice: product.price,
      price: product.professionalPrice || product.price,
      hasDiscountForProfessionals: !!product.professionalPrice
    }));

    return {
      ...result,
      products: productsWithProfessionalPricing as any
    };
  }

  /**
   * Get products by tags
   */
  static async getProductsByTags(tagSlugs: string[], limit = 12): Promise<ProductWithDetails[]> {
    const products = await prisma.product.findMany({
      where: {
        tags: {
          some: {
            tag: {
              slug: { in: tagSlugs }
            }
          }
        },
        status: 'ACTIVE'
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        variants: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        options: {
          include: {
            values: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                name: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return this.addAverageRatings(products as ProductWithDetails[]);
  }

  /**
   * Get products by brand
   */
  static async getProductsByBrand(brand: string, limit = 12): Promise<ProductWithDetails[]> {
    const products = await prisma.product.findMany({
      where: {
        brand: { equals: brand, mode: 'insensitive' },
        status: 'ACTIVE'
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        variants: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        options: {
          include: {
            values: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                name: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: [
        { name: 'asc' }
      ],
      take: limit
    });

    return this.addAverageRatings(products as ProductWithDetails[]);
  }

  /**
   * Get products on promotion
   */
  static async getProductsOnPromotion(limit = 12): Promise<ProductWithDetails[]> {
    const currentDate = new Date();
    
    const products = await prisma.product.findMany({
      where: {
        isOnPromotion: true,
        promoStartDate: { lte: currentDate },
        OR: [
          { promoEndDate: null },
          { promoEndDate: { gte: currentDate } }
        ],
        status: 'ACTIVE'
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        variants: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        options: {
          include: {
            values: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                name: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return this.addAverageRatings(products as ProductWithDetails[]);
  }

  /**
   * Get Brazilian brands products
   */
  static async getBrazilianBrandsProducts(limit = 20): Promise<ProductWithDetails[]> {
    const brazilianBrands = [
      'Cadiveu', 'Inoar', 'Sweet Hair', 'Forever Liss',
      'Risqué', 'Colorama', 'Dailus',
      'Quem Disse, Berenice?', 'Ruby Rose', 'Vult', 'Boca Rosa by Payot',
      'Taiff', 'Natura', 'O Boticário'
    ];

    const products = await prisma.product.findMany({
      where: {
        brand: { in: brazilianBrands },
        status: 'ACTIVE'
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        variants: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        options: {
          include: {
            values: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                name: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return this.addAverageRatings(products as ProductWithDetails[]);
  }

  /**
   * Get low stock products for inventory management
   */
  static async getLowStockProducts(): Promise<ProductWithDetails[]> {
    const products = await prisma.product.findMany({
      where: {
        trackQuantity: true,
        quantity: {
          lte: prisma.product.fields.lowStockAlert
        },
        status: 'ACTIVE'
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        variants: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        options: {
          include: {
            values: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                name: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: [
        { quantity: 'asc' }
      ]
    });

    return this.addAverageRatings(products as ProductWithDetails[]);
  }

  // Private helper methods

  private static getOrderBy(sortBy: ProductSortOption): Prisma.ProductOrderByWithRelationInput[] {
    switch (sortBy) {
      case 'newest':
        return [{ createdAt: 'desc' }];
      case 'oldest':
        return [{ createdAt: 'asc' }];
      case 'price-low-high':
        return [{ price: 'asc' }];
      case 'price-high-low':
        return [{ price: 'desc' }];
      case 'name-asc':
        return [{ name: 'asc' }];
      case 'name-desc':
        return [{ name: 'desc' }];
      case 'featured':
        return [{ isFeatured: 'desc' }, { displayOrder: 'asc' }];
      case 'popularity':
        return [{ orderItems: { _count: 'desc' } }];
      default:
        return [{ createdAt: 'desc' }];
    }
  }

  private static async addAverageRatings(products: ProductWithDetails[]): Promise<ProductWithDetails[]> {
    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        if (product.reviews.length > 0) {
          const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = Number((totalRating / product.reviews.length).toFixed(1));
          return { ...product, averageRating };
        }
        return { ...product, averageRating: 0 };
      })
    );

    return productsWithRatings;
  }

  private static async getFilterAggregations(where: Prisma.ProductWhereInput) {
    // This would be more complex in a real implementation
    // For now, returning basic structure
    return {
      categories: [],
      priceRange: { min: 0, max: 1000 },
      hairTypes: [],
      hairTextures: [],
      lengths: [],
      colors: []
    };
  }
}