/**
 * MongoDB Product Service
 * JC Hair Studio's 62 E-commerce
 */

import { connectDB } from '../mongodb/connection';
import { Product, IProduct } from '../mongodb/schemas/product.schema';
import { Category } from '../mongodb/schemas/category.schema';

interface ProductFilters {
  featured?: boolean;
  category?: string[];
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  hairType?: string[];
  hairTexture?: string[];
  inStock?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'name' | 'featured';
}

interface ProductResponse {
  products: IProduct[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class MongoProductService {
  /**
   * Get products with filters and pagination
   */
  static async getProducts(filters: ProductFilters = {}): Promise<ProductResponse> {
    await connectDB();

    const {
      featured,
      category = [],
      search,
      minPrice,
      maxPrice,
      hairType = [],
      hairTexture = [],
      inStock,
      isActive = true,
      page = 1,
      limit = 12,
      sortBy = 'newest'
    } = filters;

    // Build MongoDB query
    const query: any = {};
    
    if (isActive !== undefined) {
      query.isActive = isActive;
    }
    
    if (featured !== undefined) {
      query.isFeatured = featured;
    }
    
    if (category.length > 0) {
      query.categoryIds = { $in: category };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { 'seo.keywords': { $in: [new RegExp(search, 'i')] } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }
    
    if (hairType.length > 0) {
      query['characteristics.hairType'] = { $in: hairType };
    }
    
    if (hairTexture.length > 0) {
      query['characteristics.hairTexture'] = { $in: hairTexture };
    }
    
    if (inStock) {
      query.stock = { $gt: 0 };
    }

    // Build sort
    const sort: any = {};
    switch (sortBy) {
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'oldest':
        sort.createdAt = 1;
        break;
      case 'price-low':
        sort.price = 1;
        break;
      case 'price-high':
        sort.price = -1;
        break;
      case 'name':
        sort.name = 1;
        break;
      case 'featured':
        sort.isFeatured = -1;
        sort.createdAt = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      Product.countDocuments(query).exec()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      products,
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }

  /**
   * Get single product by ID or slug
   */
  static async getProduct(identifier: string): Promise<IProduct | null> {
    await connectDB();

    return Product.findOne({
      $or: [
        { _id: identifier },
        { 'seo.slug': identifier }
      ],
      isActive: true,
      isVisible: true
    }).exec();
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit: number = 8): Promise<IProduct[]> {
    await connectDB();

    return Product.find({
      isFeatured: true,
      isActive: true,
      isVisible: true
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(categorySlug: string, limit: number = 12): Promise<IProduct[]> {
    await connectDB();

    // First find the category
    const category = await Category.findOne({ 
      'seo.slug': categorySlug,
      isActive: true 
    }).exec();

    if (!category) return [];

    return Product.find({
      categoryIds: category._id.toString(),
      isActive: true,
      isVisible: true
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
  }

  /**
   * Search products
   */
  static async searchProducts(searchQuery: string, limit: number = 20): Promise<IProduct[]> {
    await connectDB();

    if (!searchQuery.trim()) return [];

    return Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { shortDescription: { $regex: searchQuery, $options: 'i' } },
        { 'seo.keywords': { $in: [new RegExp(searchQuery, 'i')] } },
        { tags: { $in: [new RegExp(searchQuery, 'i')] } }
      ],
      isActive: true,
      isVisible: true
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
  }

  /**
   * Create new product
   */
  static async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    await connectDB();

    const product = new Product({
      ...data,
      publishedAt: data.isActive ? new Date() : undefined
    });

    return product.save();
  }

  /**
   * Update product
   */
  static async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    await connectDB();

    return Product.findByIdAndUpdate(
      id,
      {
        ...data,
        publishedAt: data.isActive ? new Date() : undefined
      },
      { new: true }
    ).exec();
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: string): Promise<boolean> {
    await connectDB();

    const result = await Product.findByIdAndDelete(id).exec();
    return !!result;
  }

  /**
   * Get products with low stock
   */
  static async getLowStockProducts(): Promise<IProduct[]> {
    await connectDB();

    return Product.find({
      trackStock: true,
      $expr: { $lte: ['$stock', '$minStock'] },
      isActive: true
    })
    .sort({ stock: 1 })
    .exec();
  }

  /**
   * Get products on promotion
   */
  static async getPromotionProducts(limit: number = 12): Promise<IProduct[]> {
    await connectDB();

    const currentDate = new Date();

    return Product.find({
      isOnSale: true,
      $or: [
        { saleStartDate: { $lte: currentDate } },
        { saleStartDate: { $exists: false } }
      ],
      $or: [
        { saleEndDate: { $gte: currentDate } },
        { saleEndDate: { $exists: false } }
      ],
      isActive: true,
      isVisible: true
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
  }

  /**
   * Update product view count
   */
  static async incrementViewCount(id: string): Promise<void> {
    await connectDB();

    await Product.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } }
    ).exec();
  }

  /**
   * Update product purchase count
   */
  static async incrementPurchaseCount(id: string, quantity: number = 1): Promise<void> {
    await connectDB();

    await Product.findByIdAndUpdate(
      id,
      { 
        $inc: { 
          purchaseCount: quantity,
          stock: -quantity
        }
      }
    ).exec();
  }

  /**
   * Add product to wishlist (increment wishlist count)
   */
  static async incrementWishlistCount(id: string): Promise<void> {
    await connectDB();

    await Product.findByIdAndUpdate(
      id,
      { $inc: { wishlistCount: 1 } }
    ).exec();
  }

  /**
   * Remove product from wishlist (decrement wishlist count)
   */
  static async decrementWishlistCount(id: string): Promise<void> {
    await connectDB();

    await Product.findByIdAndUpdate(
      id,
      { $inc: { wishlistCount: -1 } }
    ).exec();
  }

  /**
   * Update product average rating
   */
  static async updateAverageRating(id: string): Promise<void> {
    await connectDB();

    const product = await Product.findById(id).exec();
    if (!product) return;

    const publishedReviews = product.reviews.filter(review => review.isPublished);
    const totalRating = publishedReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = publishedReviews.length > 0 ? totalRating / publishedReviews.length : 0;

    await Product.findByIdAndUpdate(
      id,
      {
        averageRating: Number(averageRating.toFixed(1)),
        reviewCount: publishedReviews.length
      }
    ).exec();
  }
}