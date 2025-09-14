/**
 * MongoDB Category Service
 * JC Hair Studio's 62 E-commerce
 */

import { connectDB } from '../mongodb/connection';
import { Category, ICategory } from '../mongodb/schemas/category.schema';

interface CategoryFilters {
  featured?: boolean;
  parentId?: string | null;
  isActive?: boolean;
  showInMenu?: boolean;
  showInFooter?: boolean;
}

export class MongoCategoryService {
  /**
   * Get all categories with filters
   */
  static async getCategories(filters: CategoryFilters = {}): Promise<ICategory[]> {
    await connectDB();

    const query: any = {};
    
    if (filters.featured !== undefined) {
      query.isFeatured = filters.featured;
    }
    
    if (filters.parentId !== undefined) {
      query.parentId = filters.parentId;
    }
    
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    
    if (filters.showInMenu !== undefined) {
      query.showInMenu = filters.showInMenu;
    }
    
    if (filters.showInFooter !== undefined) {
      query.showInFooter = filters.showInFooter;
    }

    return Category.find(query)
      .sort({ displayOrder: 1, name: 1 })
      .exec();
  }

  /**
   * Get category by ID or slug
   */
  static async getCategory(identifier: string): Promise<ICategory | null> {
    await connectDB();

    return Category.findOne({
      $or: [
        { _id: identifier },
        { slug: identifier }
      ],
      isActive: true
    }).exec();
  }

  /**
   * Get featured categories
   */
  static async getFeaturedCategories(): Promise<ICategory[]> {
    await connectDB();

    return Category.find({
      isFeatured: true,
      isActive: true,
      isVisible: true
    })
    .sort({ displayOrder: 1 })
    .exec();
  }

  /**
   * Get root categories (parent categories)
   */
  static async getRootCategories(): Promise<ICategory[]> {
    await connectDB();

    return Category.find({
      parentId: null,
      isActive: true,
      isVisible: true
    })
    .sort({ displayOrder: 1 })
    .exec();
  }

  /**
   * Get categories for menu
   */
  static async getMenuCategories(): Promise<ICategory[]> {
    await connectDB();

    return Category.find({
      showInMenu: true,
      isActive: true,
      isVisible: true,
      level: { $lte: 2 } // Limit menu depth to 2 levels
    })
    .sort({ level: 1, displayOrder: 1 })
    .exec();
  }

  /**
   * Get categories for footer
   */
  static async getFooterCategories(): Promise<ICategory[]> {
    await connectDB();

    return Category.find({
      showInFooter: true,
      isActive: true,
      isVisible: true
    })
    .sort({ displayOrder: 1 })
    .limit(10) // Limit footer categories
    .exec();
  }

  /**
   * Get category tree structure
   */
  static async getCategoryTree(): Promise<ICategory[]> {
    await connectDB();

    const categories = await Category.find({
      isActive: true,
      isVisible: true
    })
    .sort({ level: 1, displayOrder: 1 })
    .exec();

    // Build tree structure
    const categoryMap = new Map();
    const roots: any[] = [];

    // First pass: create map
    categories.forEach((cat: any) => {
      categoryMap.set(cat._id.toString(), {
        ...cat.toObject(),
        children: []
      });
    });

    // Second pass: build tree
    categories.forEach((cat: any) => {
      const category = categoryMap.get(cat._id.toString());
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId.toString());
        if (parent) {
          parent.children.push(category);
        }
      } else {
        roots.push(category);
      }
    });

    return roots;
  }

  /**
   * Get child categories
   */
  static async getChildCategories(parentId: string): Promise<ICategory[]> {
    await connectDB();

    return Category.find({
      parentId,
      isActive: true,
      isVisible: true
    })
    .sort({ displayOrder: 1 })
    .exec();
  }

  /**
   * Get category breadcrumb
   */
  static async getCategoryBreadcrumb(categoryId: string): Promise<ICategory[]> {
    await connectDB();

    const category = await Category.findById(categoryId).exec();
    if (!category) return [];

    const breadcrumb = [category];
    let currentParentId = category.parentId;

    while (currentParentId) {
      const parent = await Category.findById(currentParentId).exec();
      if (parent) {
        breadcrumb.unshift(parent);
        currentParentId = parent.parentId;
      } else {
        break;
      }
    }

    return breadcrumb;
  }

  /**
   * Create new category
   */
  static async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    await connectDB();

    const category = new Category(data);
    return category.save();
  }

  /**
   * Update category
   */
  static async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    await connectDB();

    return Category.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: string): Promise<boolean> {
    await connectDB();

    // Check if category has children
    const hasChildren = await Category.countDocuments({ parentId: id });
    if (hasChildren > 0) {
      throw new Error('Cannot delete category with child categories');
    }

    const result = await Category.findByIdAndDelete(id).exec();
    return !!result;
  }

  /**
   * Update category product count
   */
  static async updateProductCount(categoryId: string): Promise<void> {
    await connectDB();

    const { Product } = await import('../mongodb/schemas/product.schema');
    
    const productCount = await Product.countDocuments({
      categoryIds: categoryId,
      isActive: true
    });

    await Category.findByIdAndUpdate(categoryId, { productCount }).exec();
  }

  /**
   * Update all category product counts
   */
  static async updateAllProductCounts(): Promise<void> {
    await connectDB();

    const { Product } = await import('../mongodb/schemas/product.schema');
    const categories = await Category.find({}).exec();

    for (const category of categories) {
      const productCount = await Product.countDocuments({
        categoryIds: category._id.toString(),
        isActive: true
      });

      category.productCount = productCount;
      await category.save();
    }
  }

  /**
   * Search categories
   */
  static async searchCategories(query: string): Promise<ICategory[]> {
    await connectDB();

    if (!query.trim()) return [];

    return Category.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'seo.keywords': { $in: [new RegExp(query, 'i')] } }
      ],
      isActive: true,
      isVisible: true
    })
    .sort({ name: 1 })
    .limit(20)
    .exec();
  }

  /**
   * Get category by slug
   */
  static async getCategoryBySlug(slug: string): Promise<ICategory | null> {
    await connectDB();

    return Category.findOne({
      slug,
      isActive: true,
      isVisible: true
    }).exec();
  }

  /**
   * Increment category view count
   */
  static async incrementViewCount(id: string): Promise<void> {
    await connectDB();

    await Category.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } }
    ).exec();
  }
}