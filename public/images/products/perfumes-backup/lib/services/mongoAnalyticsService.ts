import { connectDB } from '@/lib/mongodb/connection';
import mongoose from 'mongoose';

// Page View Schema
const PageViewSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  ip: {
    type: String
  },
  referer: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 90 // 90 days TTL
  }
});

// Product View Schema
const ProductViewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 90 // 90 days TTL
  }
});

// Search Event Schema
const SearchEventSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true
  },
  results: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 90 // 90 days TTL
  }
});

// Cart Event Schema
const CartEventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['add', 'remove', 'update'],
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 90 // 90 days TTL
  }
});

// Indexes
PageViewSchema.index({ path: 1, createdAt: -1 });
PageViewSchema.index({ userId: 1, createdAt: -1 });
PageViewSchema.index({ sessionId: 1 });
PageViewSchema.index({ createdAt: -1 });

ProductViewSchema.index({ productId: 1, createdAt: -1 });
ProductViewSchema.index({ userId: 1, createdAt: -1 });
ProductViewSchema.index({ sessionId: 1 });

SearchEventSchema.index({ query: 1, createdAt: -1 });
SearchEventSchema.index({ createdAt: -1 });

CartEventSchema.index({ productId: 1, createdAt: -1 });
CartEventSchema.index({ type: 1, createdAt: -1 });
CartEventSchema.index({ userId: 1, createdAt: -1 });

// Models
const PageView = mongoose.models.PageView || mongoose.model('PageView', PageViewSchema);
const ProductView = mongoose.models.ProductView || mongoose.model('ProductView', ProductViewSchema);
const SearchEvent = mongoose.models.SearchEvent || mongoose.model('SearchEvent', SearchEventSchema);
const CartEvent = mongoose.models.CartEvent || mongoose.model('CartEvent', CartEventSchema);

export class MongoAnalyticsService {
  // Page Views
  static async trackPageView(data: {
    path: string;
    userId?: string | null;
    sessionId: string;
    userAgent?: string;
    ip?: string;
    referer?: string;
  }) {
    await connectDB();

    const pageView = new PageView({
      path: data.path,
      userId: data.userId || null,
      sessionId: data.sessionId,
      userAgent: data.userAgent,
      ip: data.ip,
      referer: data.referer
    });

    return await pageView.save();
  }

  static async getPageViews(options: {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    path?: string;
  } = {}) {
    await connectDB();

    const {
      page = 1,
      limit = 100,
      startDate,
      endDate,
      path
    } = options;

    const query: any = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    if (path) query.path = path;

    const skip = (page - 1) * limit;

    const [views, total] = await Promise.all([
      PageView.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PageView.countDocuments(query)
    ]);

    return {
      views,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Product Views
  static async trackProductView(data: {
    productId: string;
    userId?: string | null;
    sessionId: string;
  }) {
    await connectDB();

    const productView = new ProductView({
      productId: data.productId,
      userId: data.userId || null,
      sessionId: data.sessionId
    });

    return await productView.save();
  }

  static async getProductViews(options: {
    page?: number;
    limit?: number;
    productId?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    await connectDB();

    const {
      page = 1,
      limit = 100,
      productId,
      startDate,
      endDate
    } = options;

    const query: any = {};

    if (productId) query.productId = productId;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    const skip = (page - 1) * limit;

    const [views, total] = await Promise.all([
      ProductView.find(query)
        .populate('productId', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ProductView.countDocuments(query)
    ]);

    return {
      views,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Search Tracking
  static async trackSearch(data: {
    query: string;
    results: number;
    userId?: string | null;
    sessionId: string;
  }) {
    await connectDB();

    const searchEvent = new SearchEvent({
      query: data.query,
      results: data.results,
      userId: data.userId || null,
      sessionId: data.sessionId
    });

    return await searchEvent.save();
  }

  // Cart Events
  static async trackAddToCart(data: {
    productId: string;
    quantity: number;
    price: number;
    userId?: string | null;
    sessionId: string;
  }) {
    await connectDB();

    const cartEvent = new CartEvent({
      type: 'add',
      productId: data.productId,
      quantity: data.quantity,
      price: data.price,
      userId: data.userId || null,
      sessionId: data.sessionId
    });

    return await cartEvent.save();
  }

  // Analytics Queries
  static async getPopularProducts(options: {
    limit?: number;
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    await connectDB();

    const { limit = 10, startDate, endDate } = options;

    const matchStage: any = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$productId',
          views: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $addFields: {
          uniqueUserCount: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { views: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          views: 1,
          uniqueUserCount: 1,
          product: {
            name: '$product.name',
            slug: '$product.slug',
            price: '$product.price',
            images: '$product.images'
          }
        }
      }
    ];

    return await ProductView.aggregate(pipeline);
  }

  static async getTrafficSources(options: {
    limit?: number;
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    await connectDB();

    const { limit = 10, startDate, endDate } = options;

    const matchStage: any = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $addFields: {
          source: {
            $cond: {
              if: { $eq: ['$referer', ''] },
              then: 'Direct',
              else: {
                $cond: {
                  if: { $regexMatch: { input: '$referer', regex: /google/ } },
                  then: 'Google',
                  else: {
                    $cond: {
                      if: { $regexMatch: { input: '$referer', regex: /facebook/ } },
                      then: 'Facebook',
                      else: 'Other'
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $addFields: {
          uniqueUserCount: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ];

    return await PageView.aggregate(pipeline);
  }

  static async getDashboardStats(options: {
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    await connectDB();

    const { startDate, endDate } = options;

    const matchStage: any = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }

    const [
      pageViewStats,
      productViewStats,
      searchStats,
      cartStats
    ] = await Promise.all([
      PageView.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalViews: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' },
            uniqueSessions: { $addToSet: '$sessionId' }
          }
        },
        {
          $project: {
            _id: 0,
            totalViews: 1,
            uniqueUsers: { $size: '$uniqueUsers' },
            uniqueSessions: { $size: '$uniqueSessions' }
          }
        }
      ]),
      ProductView.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalProductViews: { $sum: 1 },
            uniqueProducts: { $addToSet: '$productId' }
          }
        },
        {
          $project: {
            _id: 0,
            totalProductViews: 1,
            uniqueProducts: { $size: '$uniqueProducts' }
          }
        }
      ]),
      SearchEvent.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalSearches: { $sum: 1 },
            uniqueQueries: { $addToSet: '$query' }
          }
        },
        {
          $project: {
            _id: 0,
            totalSearches: 1,
            uniqueQueries: { $size: '$uniqueQueries' }
          }
        }
      ]),
      CartEvent.aggregate([
        { $match: { ...matchStage, type: 'add' } },
        {
          $group: {
            _id: null,
            totalAddToCart: { $sum: 1 },
            totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } }
          }
        }
      ])
    ]);

    return {
      pageViews: pageViewStats[0] || { totalViews: 0, uniqueUsers: 0, uniqueSessions: 0 },
      productViews: productViewStats[0] || { totalProductViews: 0, uniqueProducts: 0 },
      searches: searchStats[0] || { totalSearches: 0, uniqueQueries: 0 },
      cart: cartStats[0] || { totalAddToCart: 0, totalRevenue: 0 }
    };
  }

  static async incrementProductViewCount(productId: string) {
    await connectDB();

    // Aqui você atualizaria o contador no produto
    try {
      const { MongoProductService } = await import('./mongoProductService');
      await MongoProductService.incrementViewCount(productId);
    } catch (error) {
      console.warn('Erro ao incrementar view count do produto:', error);
    }
  }
}