import mongoose, { Schema, Document, Model } from 'mongoose';

// Referral Tiers Schema
export interface IReferralTier extends Document {
  id: string;
  name: string;
  description: string;
  minReferrals: number;
  minTotalSales: number;
  referrerRewardBonus: number; // Percentage bonus (e.g., 0.05 = 5%)
  refereeRewardBonus: number; // Percentage bonus for referee
  cashbackMultiplier: number; // Multiplier for cashback (e.g., 1.5 = 150%)
  freeShipping: boolean;
  prioritySupport: boolean;
  exclusiveProducts: boolean;
  badgeIcon: string;
  badgeColor: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const referralTierSchema = new Schema<IReferralTier>({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  minReferrals: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  minTotalSales: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  referrerRewardBonus: {
    type: Number,
    required: true,
    min: 0,
    max: 1, // Max 100%
    default: 0
  },
  refereeRewardBonus: {
    type: Number,
    required: true,
    min: 0,
    max: 1, // Max 100%
    default: 0
  },
  cashbackMultiplier: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Max 5x multiplier
    default: 1
  },
  freeShipping: {
    type: Boolean,
    required: true,
    default: false
  },
  prioritySupport: {
    type: Boolean,
    required: true,
    default: false
  },
  exclusiveProducts: {
    type: Boolean,
    required: true,
    default: false
  },
  badgeIcon: {
    type: String,
    required: true,
    trim: true
  },
  badgeColor: {
    type: String,
    required: true,
    match: /^#[0-9A-Fa-f]{6}$/,
    trim: true
  },
  displayOrder: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  collection: 'referral_tiers'
});

// Compound indexes
referralTierSchema.index({ isActive: 1, displayOrder: 1 });
referralTierSchema.index({ minReferrals: 1, minTotalSales: 1 });

export const ReferralTier: Model<IReferralTier> =
  mongoose.models.ReferralTier || mongoose.model<IReferralTier>('ReferralTier', referralTierSchema);

// Points System Schema
export interface IPointsTransaction extends Document {
  id: string;
  userId: string;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'BONUS' | 'REFERRAL';
  points: number;
  description: string;
  orderId?: string;
  referralId?: string;
  expiresAt?: Date;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const pointsTransactionSchema = new Schema<IPointsTransaction>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['EARNED', 'REDEEMED', 'EXPIRED', 'BONUS', 'REFERRAL'],
    required: true,
    index: true
  },
  points: {
    type: Number,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  orderId: {
    type: String,
    index: true
  },
  referralId: {
    type: String,
    index: true
  },
  expiresAt: {
    type: Date,
    index: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
    index: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'points_transactions'
});

// Compound indexes
pointsTransactionSchema.index({ userId: 1, type: 1 });
pointsTransactionSchema.index({ userId: 1, isActive: 1 });
pointsTransactionSchema.index({ userId: 1, createdAt: -1 });
pointsTransactionSchema.index({ expiresAt: 1, isActive: 1 });

export const PointsTransaction: Model<IPointsTransaction> =
  mongoose.models.PointsTransaction || mongoose.model<IPointsTransaction>('PointsTransaction', pointsTransactionSchema);

// Points Redemption Schema
export interface IPointsRedemption extends Document {
  id: string;
  userId: string;
  pointsUsed: number;
  rewardType: 'DISCOUNT' | 'FREE_PRODUCT' | 'FREE_SHIPPING' | 'CASHBACK';
  rewardValue: number;
  description: string;
  orderId?: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  validUntil?: Date;
  usedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const pointsRedemptionSchema = new Schema<IPointsRedemption>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  pointsUsed: {
    type: Number,
    required: true,
    min: 0
  },
  rewardType: {
    type: String,
    enum: ['DISCOUNT', 'FREE_PRODUCT', 'FREE_SHIPPING', 'CASHBACK'],
    required: true,
    index: true
  },
  rewardValue: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  orderId: {
    type: String,
    index: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'USED', 'EXPIRED', 'CANCELLED', 'PENDING'],
    required: true,
    default: 'ACTIVE',
    index: true
  },
  validUntil: {
    type: Date,
    index: true
  },
  usedAt: {
    type: Date,
    index: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'points_redemptions'
});

// Compound indexes
pointsRedemptionSchema.index({ userId: 1, status: 1 });
pointsRedemptionSchema.index({ status: 1, validUntil: 1 });

export const PointsRedemption: Model<IPointsRedemption> =
  mongoose.models.PointsRedemption || mongoose.model<IPointsRedemption>('PointsRedemption', pointsRedemptionSchema);