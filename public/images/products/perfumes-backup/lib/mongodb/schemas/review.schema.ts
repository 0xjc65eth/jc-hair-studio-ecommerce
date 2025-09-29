/**
 * Review Schema - MongoDB with Zod validation
 * JC Hair Studio's 62's 62 E-commerce
 */

import { Schema, model, models, Document } from 'mongoose';
import { z } from 'zod';

// Zod validation schemas
export const ReviewPhotoZodSchema = z.object({
  url: z.string().url('URL da foto inválida'),
  alt: z.string().min(1, 'Texto alternativo obrigatório'),
  isApproved: z.boolean().default(false),
  moderatedAt: z.date().optional(),
  moderatedBy: z.string().optional(),
});

export const ReviewZodSchema = z.object({
  // Identificação
  userId: z.string().min(1, 'ID do usuário obrigatório'),
  productId: z.string().min(1, 'ID do produto obrigatório'),
  orderId: z.string().min(1, 'ID do pedido obrigatório'),
  
  // Avaliação
  rating: z.number().int().min(1).max(5, 'Avaliação deve ser entre 1 e 5'),
  title: z.string().min(1, 'Título obrigatório').max(100, 'Título muito longo'),
  comment: z.string().min(10, 'Comentário deve ter pelo menos 10 caracteres').max(2000, 'Comentário muito longo'),
  
  // Fotos
  photos: z.array(ReviewPhotoZodSchema).default([]),
  
  // Informações do comprador
  buyerInfo: z.object({
    name: z.string().min(1, 'Nome do comprador obrigatório'),
    isVerifiedPurchase: z.boolean().default(false),
    purchaseDate: z.date(),
    variant: z.object({
      type: z.string(),
      value: z.string(),
    }).optional(),
  }),
  
  // Aspectos específicos (opcionais)
  aspects: z.object({
    quality: z.number().int().min(1).max(5).optional(),
    value: z.number().int().min(1).max(5).optional(),
    shipping: z.number().int().min(1).max(5).optional(),
    service: z.number().int().min(1).max(5).optional(),
  }).default({}),
  
  // Status e moderação
  status: z.enum(['pending', 'approved', 'rejected', 'flagged']).default('pending'),
  isPublished: z.boolean().default(false),
  moderationNotes: z.string().max(500, 'Notas de moderação muito longas').optional(),
  moderatedAt: z.date().optional(),
  moderatedBy: z.string().optional(),
  
  // Interações
  helpfulVotes: z.array(z.string()).default([]), // User IDs who found it helpful
  unhelpfulVotes: z.array(z.string()).default([]), // User IDs who found it unhelpful
  reportedBy: z.array(z.string()).default([]), // User IDs who reported
  
  // Resposta do vendedor
  merchantReply: z.object({
    message: z.string().min(1, 'Mensagem obrigatória').max(1000, 'Mensagem muito longa'),
    repliedAt: z.date(),
    repliedBy: z.string(),
  }).optional(),
  
  // Métricas
  helpfulCount: z.number().int().min(0).default(0),
  unhelpfulCount: z.number().int().min(0).default(0),
  reportCount: z.number().int().min(0).default(0),
  viewCount: z.number().int().min(0).default(0),
});

// TypeScript interfaces
export interface IReviewPhoto {
  url: string;
  alt: string;
  isApproved: boolean;
  moderatedAt?: Date;
  moderatedBy?: string;
}

export interface IBuyerInfo {
  name: string;
  isVerifiedPurchase: boolean;
  purchaseDate: Date;
  variant?: {
    type: string;
    value: string;
  };
}

export interface IReviewAspects {
  quality?: number;
  value?: number;
  shipping?: number;
  service?: number;
}

export interface IMerchantReply {
  message: string;
  repliedAt: Date;
  repliedBy: string;
}

export interface IReview extends Document {
  // Identificação
  userId: string;
  productId: string;
  orderId: string;
  
  // Avaliação
  rating: number;
  title: string;
  comment: string;
  
  // Fotos
  photos: IReviewPhoto[];
  
  // Informações do comprador
  buyerInfo: IBuyerInfo;
  
  // Aspectos específicos
  aspects: IReviewAspects;
  
  // Status e moderação
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  isPublished: boolean;
  moderationNotes?: string;
  moderatedAt?: Date;
  moderatedBy?: string;
  
  // Interações
  helpfulVotes: string[];
  unhelpfulVotes: string[];
  reportedBy: string[];
  
  // Resposta do vendedor
  merchantReply?: IMerchantReply;
  
  // Métricas
  helpfulCount: number;
  unhelpfulCount: number;
  reportCount: number;
  viewCount: number;
  
  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual properties
  averageAspectRating?: number;
  helpfulnessRatio: number;
  daysSinceReview: number;
  
  // Instance methods
  addHelpfulVote(userId: string): void;
  removeHelpfulVote(userId: string): void;
  addUnhelpfulVote(userId: string): void;
  removeUnhelpfulVote(userId: string): void;
  reportReview(userId: string): void;
  approve(moderatorId: string, notes?: string): void;
  reject(moderatorId: string, notes: string): void;
  flag(moderatorId: string, notes: string): void;
  addMerchantReply(message: string, repliedBy: string): void;
}

// MongoDB Schemas
const ReviewPhotoSchema = new Schema<IReviewPhoto>({
  url: { type: String, required: true },
  alt: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  moderatedAt: { type: Date },
  moderatedBy: { type: String },
});

const BuyerInfoSchema = new Schema<IBuyerInfo>({
  name: { type: String, required: true },
  isVerifiedPurchase: { type: Boolean, default: false },
  purchaseDate: { type: Date, required: true },
  variant: {
    type: { type: String },
    value: { type: String },
  },
});

const ReviewAspectsSchema = new Schema<IReviewAspects>({
  quality: { type: Number, min: 1, max: 5 },
  value: { type: Number, min: 1, max: 5 },
  shipping: { type: Number, min: 1, max: 5 },
  service: { type: Number, min: 1, max: 5 },
});

const MerchantReplySchema = new Schema<IMerchantReply>({
  message: { type: String, required: true, maxlength: 1000 },
  repliedAt: { type: Date, required: true },
  repliedBy: { type: String, required: true },
});

const ReviewSchema = new Schema<IReview>({
  // Identificação
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  orderId: { type: String, required: true },
  
  // Avaliação
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, maxlength: 100 },
  comment: { type: String, required: true, minlength: 10, maxlength: 2000 },
  
  // Fotos
  photos: [ReviewPhotoSchema],
  
  // Informações do comprador
  buyerInfo: BuyerInfoSchema,
  
  // Aspectos específicos
  aspects: { type: ReviewAspectsSchema, default: {} },
  
  // Status e moderação
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'approved', 'rejected', 'flagged']
  },
  isPublished: { type: Boolean, default: false },
  moderationNotes: { type: String, maxlength: 500 },
  moderatedAt: { type: Date },
  moderatedBy: { type: String },
  
  // Interações
  helpfulVotes: [{ type: String }],
  unhelpfulVotes: [{ type: String }],
  reportedBy: [{ type: String }],
  
  // Resposta do vendedor
  merchantReply: MerchantReplySchema,
  
  // Métricas
  helpfulCount: { type: Number, default: 0, min: 0 },
  unhelpfulCount: { type: Number, default: 0, min: 0 },
  reportCount: { type: Number, default: 0, min: 0 },
  viewCount: { type: Number, default: 0, min: 0 },
}, { 
  timestamps: true,
  collection: 'reviews'
});

// Compound indexes for better query performance
ReviewSchema.index({ productId: 1, status: 1, isPublished: 1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });
ReviewSchema.index({ rating: 1, isPublished: 1 });
ReviewSchema.index({ 'buyerInfo.isVerifiedPurchase': 1, isPublished: 1 });

// Unique constraint to prevent duplicate reviews
ReviewSchema.index({ userId: 1, productId: 1, orderId: 1 }, { unique: true });

// Virtual properties
ReviewSchema.virtual('averageAspectRating').get(function() {
  const aspects = this.aspects;
  if (!aspects) return undefined;
  
  const ratings = Object.values(aspects).filter(rating => typeof rating === 'number');
  if (ratings.length === 0) return undefined;
  
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
});

ReviewSchema.virtual('helpfulnessRatio').get(function() {
  const total = this.helpfulCount + this.unhelpfulCount;
  if (total === 0) return 0;
  return this.helpfulCount / total;
});

ReviewSchema.virtual('daysSinceReview').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Ensure virtual fields are included in JSON
ReviewSchema.set('toJSON', { virtuals: true });
ReviewSchema.set('toObject', { virtuals: true });

// Pre-save middleware to update counters
ReviewSchema.pre('save', function(next) {
  this.helpfulCount = this.helpfulVotes.length;
  this.unhelpfulCount = this.unhelpfulVotes.length;
  this.reportCount = this.reportedBy.length;
  next();
});

// Instance methods
ReviewSchema.methods.addHelpfulVote = function(userId: string): void {
  if (!this.helpfulVotes.includes(userId)) {
    this.helpfulVotes.push(userId);
    // Remove from unhelpful votes if exists
    this.unhelpfulVotes = this.unhelpfulVotes.filter((id: string) => id !== userId);
  }
};

ReviewSchema.methods.removeHelpfulVote = function(userId: string): void {
  this.helpfulVotes = this.helpfulVotes.filter((id: string) => id !== userId);
};

ReviewSchema.methods.addUnhelpfulVote = function(userId: string): void {
  if (!this.unhelpfulVotes.includes(userId)) {
    this.unhelpfulVotes.push(userId);
    // Remove from helpful votes if exists
    this.helpfulVotes = this.helpfulVotes.filter((id: string) => id !== userId);
  }
};

ReviewSchema.methods.removeUnhelpfulVote = function(userId: string): void {
  this.unhelpfulVotes = this.unhelpfulVotes.filter((id: string) => id !== userId);
};

ReviewSchema.methods.reportReview = function(userId: string): void {
  if (!this.reportedBy.includes(userId)) {
    this.reportedBy.push(userId);
    if (this.reportedBy.length >= 3) {
      this.status = 'flagged';
      this.isPublished = false;
    }
  }
};

ReviewSchema.methods.approve = function(moderatorId: string, notes?: string): void {
  this.status = 'approved';
  this.isPublished = true;
  this.moderatedAt = new Date();
  this.moderatedBy = moderatorId;
  if (notes) {
    this.moderationNotes = notes;
  }
};

ReviewSchema.methods.reject = function(moderatorId: string, notes: string): void {
  this.status = 'rejected';
  this.isPublished = false;
  this.moderatedAt = new Date();
  this.moderatedBy = moderatorId;
  this.moderationNotes = notes;
};

ReviewSchema.methods.flag = function(moderatorId: string, notes: string): void {
  this.status = 'flagged';
  this.isPublished = false;
  this.moderatedAt = new Date();
  this.moderatedBy = moderatorId;
  this.moderationNotes = notes;
};

ReviewSchema.methods.addMerchantReply = function(message: string, repliedBy: string): void {
  this.merchantReply = {
    message,
    repliedAt: new Date(),
    repliedBy,
  };
};

// Static methods
ReviewSchema.statics.findByProduct = function(productId: string, options: any = {}) {
  const query = { 
    productId, 
    isPublished: true, 
    status: 'approved' 
  };
  
  let queryBuilder = this.find(query);
  
  if (options.rating) {
    queryBuilder = queryBuilder.where('rating').equals(options.rating);
  }
  
  if (options.verified) {
    queryBuilder = queryBuilder.where('buyerInfo.isVerifiedPurchase').equals(true);
  }
  
  if (options.withPhotos) {
    queryBuilder = queryBuilder.where('photos.0').exists();
  }
  
  return queryBuilder
    .sort({ helpfulCount: -1, createdAt: -1 })
    .limit(options.limit || 10)
    .skip(options.skip || 0);
};

ReviewSchema.statics.findByUser = function(userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

ReviewSchema.statics.getProductStats = function(productId: string) {
  return this.aggregate([
    {
      $match: { 
        productId, 
        isPublished: true, 
        status: 'approved' 
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    },
    {
      $project: {
        _id: 0,
        averageRating: { $round: ['$averageRating', 2] },
        totalReviews: 1,
        ratingDistribution: {
          1: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 1] } } } },
          2: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 2] } } } },
          3: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 3] } } } },
          4: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 4] } } } },
          5: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 5] } } } }
        }
      }
    }
  ]);
};

ReviewSchema.statics.getPendingModeration = function() {
  return this.find({ status: 'pending' }).sort({ createdAt: 1 });
};

ReviewSchema.statics.getFlagged = function() {
  return this.find({ status: 'flagged' }).sort({ reportCount: -1, createdAt: 1 });
};

// Create and export the model
export const Review = models.Review || model<IReview>('Review', ReviewSchema);
export default Review;