import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserReferralStats extends Document {
  id: string;
  userId: string;
  totalReferrals: number;
  successfulReferrals: number;
  totalReferralSales: number;
  totalEarnings: number;
  availableCashback: number;
  tierLevel: string;
  tierProgress: number;
  nextTierRequirements?: {
    minReferrals: number;
    minSales: number;
    currentReferrals: number;
    currentSales: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userReferralStatsSchema = new Schema<IUserReferralStats>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  totalReferrals: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  successfulReferrals: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  totalReferralSales: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  totalEarnings: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  availableCashback: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  tierLevel: {
    type: String,
    required: true,
    default: 'Iniciante',
    enum: ['Iniciante', 'Bronze', 'Prata', 'Ouro', 'Platina', 'Diamante']
  },
  tierProgress: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
    default: 0
  },
  nextTierRequirements: {
    minReferrals: { type: Number, default: 0 },
    minSales: { type: Number, default: 0 },
    currentReferrals: { type: Number, default: 0 },
    currentSales: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  collection: 'user_referral_stats'
});

// Indexes for better query performance
userReferralStatsSchema.index({ userId: 1 });
userReferralStatsSchema.index({ tierLevel: 1 });
userReferralStatsSchema.index({ totalEarnings: -1 });
userReferralStatsSchema.index({ availableCashback: -1 });

export const UserReferralStats: Model<IUserReferralStats> =
  mongoose.models.UserReferralStats || mongoose.model<IUserReferralStats>('UserReferralStats', userReferralStatsSchema);

// Referral Transaction Schema
export interface IReferral extends Document {
  id: string;
  referralCode: string;
  referrerId: string;
  refereeId: string;
  refereeEmail?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  clickedAt: Date;
  convertedAt?: Date;
  orderId?: string;
  orderValue?: number;
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<IReferral>({
  referralCode: {
    type: String,
    required: true,
    index: true,
    uppercase: true
  },
  referrerId: {
    type: String,
    required: true,
    index: true
  },
  refereeId: {
    type: String,
    required: true,
    index: true
  },
  refereeEmail: {
    type: String,
    index: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
    required: true,
    default: 'PENDING',
    index: true
  },
  clickedAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  convertedAt: {
    type: Date,
    index: true
  },
  orderId: {
    type: String,
    index: true
  },
  orderValue: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true,
  collection: 'referrals'
});

// Compound indexes for better query performance
referralSchema.index({ referrerId: 1, status: 1 });
referralSchema.index({ refereeId: 1, status: 1 });
referralSchema.index({ referralCode: 1, status: 1 });
referralSchema.index({ createdAt: -1, status: 1 });

export const Referral: Model<IReferral> =
  mongoose.models.Referral || mongoose.model<IReferral>('Referral', referralSchema);