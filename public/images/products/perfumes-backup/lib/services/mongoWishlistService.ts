import { connectDB } from '@/lib/mongodb/connection';
import mongoose from 'mongoose';

// Wishlist Item Schema
const WishlistItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
WishlistItemSchema.index({ userId: 1, productId: 1 }, { unique: true });
WishlistItemSchema.index({ userId: 1, createdAt: -1 });
WishlistItemSchema.index({ productId: 1 });

// Model
const WishlistItem = mongoose.models.WishlistItem ||
  mongoose.model('WishlistItem', WishlistItemSchema);

export class MongoWishlistService {
  static async getUserWishlist(userId: string, options: {
    page?: number;
    limit?: number;
    includeProducts?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    await connectDB();

    const {
      page = 1,
      limit = 20,
      includeProducts = false,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const query = { userId };
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    let wishlistQuery = WishlistItem.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (includeProducts) {
      wishlistQuery = wishlistQuery.populate('productId',
        'name slug price comparePrice images brand inStock'
      );
    }

    const [items, total] = await Promise.all([
      wishlistQuery.lean(),
      WishlistItem.countDocuments(query)
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async addToWishlist(userId: string, productId: string) {
    await connectDB();

    const wishlistItem = new WishlistItem({
      userId,
      productId
    });

    return await wishlistItem.save();
  }

  static async removeFromWishlist(userId: string, productId: string) {
    await connectDB();

    const result = await WishlistItem.findOneAndDelete({
      userId,
      productId
    });

    return !!result;
  }

  static async removeWishlistItem(itemId: string, userId: string) {
    await connectDB();

    const result = await WishlistItem.findOneAndDelete({
      _id: itemId,
      userId
    });

    return !!result;
  }

  static async isInWishlist(userId: string, productId: string) {
    await connectDB();

    const item = await WishlistItem.findOne({
      userId,
      productId
    }).lean();

    return !!item;
  }

  static async getWishlistCount(userId: string) {
    await connectDB();

    return await WishlistItem.countDocuments({ userId });
  }

  static async clearWishlist(userId: string) {
    await connectDB();

    const result = await WishlistItem.deleteMany({ userId });
    return result.deletedCount;
  }

  static async moveToCart(userId: string, productId: string) {
    await connectDB();

    // Remove from wishlist
    const removed = await this.removeFromWishlist(userId, productId);

    if (!removed) {
      throw new Error('Item não encontrado na wishlist');
    }

    // Aqui você adicionaria ao carrinho usando CartService
    try {
      const { MongoCartService } = await import('./mongoCartService');
      await MongoCartService.addToCart(userId, {
        productId,
        quantity: 1
      });
    } catch (error) {
      console.warn('Erro ao mover para carrinho:', error);
      // Re-adicionar à wishlist se falhou ao adicionar ao carrinho
      await this.addToWishlist(userId, productId);
      throw error;
    }

    return true;
  }

  static async bulkAddToWishlist(userId: string, productIds: string[]) {
    await connectDB();

    const items = productIds.map(productId => ({
      userId,
      productId
    }));

    try {
      const result = await WishlistItem.insertMany(items, { ordered: false });
      return result.length;
    } catch (error: any) {
      // Se alguns items já existem, conta apenas os inseridos
      if (error.code === 11000) {
        return error.result?.insertedCount || 0;
      }
      throw error;
    }
  }

  static async bulkRemoveFromWishlist(userId: string, productIds: string[]) {
    await connectDB();

    const result = await WishlistItem.deleteMany({
      userId,
      productId: { $in: productIds }
    });

    return result.deletedCount;
  }

  static async getWishlistProductIds(userId: string) {
    await connectDB();

    const items = await WishlistItem.find({ userId })
      .select('productId')
      .lean();

    return items.map(item => item.productId.toString());
  }

  static async getPopularWishlistProducts(limit: number = 10) {
    await connectDB();

    const popularProducts = await WishlistItem.aggregate([
      {
        $group: {
          _id: '$productId',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          wishlistCount: '$count',
          product: {
            name: '$product.name',
            slug: '$product.slug',
            price: '$product.price',
            images: '$product.images'
          }
        }
      }
    ]);

    return popularProducts;
  }

  static async getUserWishlistStats(userId: string) {
    await connectDB();

    const [
      totalItems,
      recentItems,
      averagePrice
    ] = await Promise.all([
      WishlistItem.countDocuments({ userId }),
      WishlistItem.countDocuments({
        userId,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      WishlistItem.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: null,
            averagePrice: { $avg: '$product.price' }
          }
        }
      ])
    ]);

    return {
      totalItems,
      recentItems,
      averagePrice: averagePrice[0]?.averagePrice || 0
    };
  }

  static async shareWishlist(userId: string) {
    await connectDB();

    // Gerar um token único para compartilhamento
    const shareToken = `wishlist_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Aqui você salvaria o token em uma coleção de wishlist compartilhada
    // Por simplicidade, retornamos apenas o token
    return {
      shareToken,
      shareUrl: `/wishlist/shared/${shareToken}`
    };
  }
}