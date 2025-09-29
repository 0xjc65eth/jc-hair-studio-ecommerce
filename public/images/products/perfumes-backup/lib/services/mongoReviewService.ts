import { connectDB } from '@/lib/mongodb/connection';
import mongoose from 'mongoose';

// Review Schema
const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
ReviewSchema.index({ productId: 1, isPublished: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ isVerified: 1 });

// Model
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

export class MongoReviewService {
  static async getReviews(options: {
    page?: number;
    limit?: number;
    productId?: string;
    userId?: string;
    rating?: number;
    isVerified?: boolean;
    isPublished?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    await connectDB();

    const {
      page = 1,
      limit = 10,
      productId,
      userId,
      rating,
      isVerified,
      isPublished = true,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const query: any = {};

    if (productId) query.productId = productId;
    if (userId) query.userId = userId;
    if (rating) query.rating = rating;
    if (isVerified !== undefined) query.isVerified = isVerified;
    if (isPublished !== undefined) query.isPublished = isPublished;

    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('userId', 'name firstName lastName')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query)
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async getReviewById(id: string) {
    await connectDB();
    return await Review.findById(id)
      .populate('userId', 'name firstName lastName')
      .lean();
  }

  static async getUserReviewForProduct(userId: string, productId: string) {
    await connectDB();
    return await Review.findOne({ userId, productId }).lean();
  }

  static async createReview(data: {
    productId: string;
    userId: string;
    rating: number;
    title?: string;
    content: string;
    isVerified?: boolean;
    isPublished?: boolean;
    helpfulCount?: number;
  }) {
    await connectDB();

    const review = new Review({
      productId: data.productId,
      userId: data.userId,
      rating: data.rating,
      title: data.title?.trim() || '',
      content: data.content.trim(),
      isVerified: data.isVerified || false,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      helpfulCount: data.helpfulCount || 0
    });

    return await review.save();
  }

  static async updateReview(id: string, data: {
    rating?: number;
    title?: string;
    content?: string;
    isVerified?: boolean;
    isPublished?: boolean;
  }) {
    await connectDB();

    const updateData: any = {
      updatedAt: new Date()
    };

    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.content !== undefined) updateData.content = data.content.trim();
    if (data.isVerified !== undefined) updateData.isVerified = data.isVerified;
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;

    return await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean();
  }

  static async deleteReview(id: string) {
    await connectDB();

    const result = await Review.findByIdAndDelete(id);
    return !!result;
  }

  static async getProductRatingStats(productId: string) {
    await connectDB();

    const stats = await Review.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(productId),
          isPublished: true
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingCounts: {
            $push: '$rating'
          }
        }
      },
      {
        $project: {
          _id: 0,
          averageRating: { $round: ['$averageRating', 1] },
          totalReviews: 1,
          ratingDistribution: {
            1: { $size: { $filter: { input: '$ratingCounts', as: 'rating', cond: { $eq: ['$$rating', 1] } } } },
            2: { $size: { $filter: { input: '$ratingCounts', as: 'rating', cond: { $eq: ['$$rating', 2] } } } },
            3: { $size: { $filter: { input: '$ratingCounts', as: 'rating', cond: { $eq: ['$$rating', 3] } } } },
            4: { $size: { $filter: { input: '$ratingCounts', as: 'rating', cond: { $eq: ['$$rating', 4] } } } },
            5: { $size: { $filter: { input: '$ratingCounts', as: 'rating', cond: { $eq: ['$$rating', 5] } } } }
          }
        }
      }
    ]);

    return stats[0] || {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  static async updateProductRating(productId: string) {
    await connectDB();

    const stats = await this.getProductRatingStats(productId);

    // Aqui você atualizaria o produto com as novas estatísticas
    // Assumindo que há um ProductService ou similar
    try {
      const { MongoProductService } = await import('./mongoProductService');
      await MongoProductService.updateProductRating(productId, {
        averageRating: stats.averageRating,
        reviewCount: stats.totalReviews
      });
    } catch (error) {
      console.warn('Erro ao atualizar rating do produto:', error);
    }

    return stats;
  }

  static async incrementHelpfulCount(reviewId: string) {
    await connectDB();

    return await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
  }

  static async decrementHelpfulCount(reviewId: string) {
    await connectDB();

    return await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: -1 } },
      { new: true }
    );
  }

  static async reportReview(reviewId: string) {
    await connectDB();

    return await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { reportCount: 1 } },
      { new: true }
    );
  }

  static async getRecentReviews(limit: number = 10) {
    await connectDB();

    return await Review.find({ isPublished: true })
      .populate('userId', 'name firstName lastName')
      .populate('productId', 'name slug images')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  static async getUserReviews(userId: string, options: {
    page?: number;
    limit?: number;
  } = {}) {
    await connectDB();

    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ userId })
        .populate('productId', 'name slug images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments({ userId })
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}