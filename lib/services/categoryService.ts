/**
 * Category Service
 * JC Hair Studio's 62 E-commerce
 */

import { Category } from '../generated/prisma';
import prisma from '../prisma';
import { CategoryWithProducts } from '../../types/product';

export class CategoryService {
  /**
   * Get all categories with hierarchy
   */
  static async getAllCategories(): Promise<CategoryWithProducts[]> {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true },
          include: {
            _count: {
              select: { products: true }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    return categories as CategoryWithProducts[];
  }

  /**
   * Get root categories (no parent)
   */
  static async getRootCategories(): Promise<CategoryWithProducts[]> {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true
      },
      include: {
        children: {
          where: { isActive: true },
          include: {
            _count: {
              select: { products: true }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    return categories as CategoryWithProducts[];
  }

  /**
   * Get category by ID or slug
   */
  static async getCategory(identifier: string): Promise<CategoryWithProducts | null> {
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ],
        isActive: true
      },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          include: {
            _count: {
              select: { products: true }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        products: {
          include: {
            product: {
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
                  take: 3
                },
                _count: {
                  select: { reviews: true }
                }
              }
            }
          },
          where: {
            product: {
              status: 'ACTIVE'
            }
          }
        },
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) return null;

    return category as unknown as CategoryWithProducts;
  }

  /**
   * Get featured categories
   */
  static async getFeaturedCategories(): Promise<CategoryWithProducts[]> {
    const categories = await prisma.category.findMany({
      where: {
        isFeatured: true,
        isActive: true
      },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    return categories as CategoryWithProducts[];
  }

  /**
   * Get category breadcrumb path
   */
  static async getCategoryBreadcrumb(categoryId: string): Promise<Category[]> {
    const breadcrumb: Category[] = [];
    
    let currentCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { parent: true }
    });

    while (currentCategory) {
      breadcrumb.unshift(currentCategory);
      currentCategory = currentCategory.parent as any;
    }

    return breadcrumb;
  }

  /**
   * Create new category
   */
  static async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    image?: string;
    banner?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    displayOrder?: number;
    isFeatured?: boolean;
  }): Promise<CategoryWithProducts> {
    const category = await prisma.category.create({
      data: {
        ...data,
        displayOrder: data.displayOrder ?? 0
      },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        },
        _count: {
          select: { products: true }
        }
      }
    });

    return category as unknown as CategoryWithProducts;
  }

  /**
   * Update category
   */
  static async updateCategory(
    id: string, 
    data: Partial<{
      name: string;
      slug: string;
      description?: string;
      parentId?: string;
      image?: string;
      banner?: string;
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string;
      displayOrder?: number;
      isFeatured?: boolean;
      isActive?: boolean;
    }>
  ): Promise<CategoryWithProducts | null> {
    try {
      const category = await prisma.category.update({
        where: { id },
        data,
        include: {
          parent: true,
          children: {
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' }
          },
          _count: {
            select: { products: true }
          }
        }
      });

      return category as unknown as CategoryWithProducts;
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: string): Promise<boolean> {
    try {
      // Check if category has children or products
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          children: true,
          products: true
        }
      });

      if (!category) return false;

      if (category.children.length > 0) {
        throw new Error('Cannot delete category with child categories');
      }

      if (category.products.length > 0) {
        throw new Error('Cannot delete category with products');
      }

      await prisma.category.delete({
        where: { id }
      });

      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  /**
   * Get category tree for navigation
   */
  static async getCategoryTree(): Promise<CategoryWithProducts[]> {
    const categories = await prisma.category.findMany({
      where: { 
        isActive: true,
        parentId: null 
      },
      include: {
        children: {
          where: { isActive: true },
          include: {
            children: {
              where: { isActive: true },
              include: {
                _count: {
                  select: { products: true }
                }
              },
              orderBy: { displayOrder: 'asc' }
            },
            _count: {
              select: { products: true }
            }
          },
          orderBy: { displayOrder: 'asc' }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    return categories as CategoryWithProducts[];
  }

  /**
   * Search categories
   */
  static async searchCategories(query: string): Promise<CategoryWithProducts[]> {
    if (!query.trim()) return [];

    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ],
        isActive: true
      },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' },
      take: 10
    });

    return categories as CategoryWithProducts[];
  }
}