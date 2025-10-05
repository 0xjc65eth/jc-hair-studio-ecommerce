import mongoose, { Schema, Document, Model } from 'mongoose';

export type ReferralRewardType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'POINTS' | 'FREE_SHIPPING';

export interface IReferralCode extends Document {
  id: string;
  code: string;
  referrerId: string;
  referrerRewardType: ReferralRewardType;
  referrerRewardValue: number;
  refereeRewardType: ReferralRewardType;
  refereeRewardValue: number;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  validFrom?: Date;
  validTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const referralCodeSchema = new Schema<IReferralCode>({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
    trim: true
  },
  referrerId: {
    type: String,
    required: true,
    index: true
  },
  referrerRewardType: {
    type: String,
    enum: ['PERCENTAGE', 'FIXED_AMOUNT', 'POINTS', 'FREE_SHIPPING'],
    required: true,
    default: 'PERCENTAGE'
  },
  referrerRewardValue: {
    type: Number,
    required: true,
    min: 0,
    default: 0.05
  },
  refereeRewardType: {
    type: String,
    enum: ['PERCENTAGE', 'FIXED_AMOUNT', 'POINTS', 'FREE_SHIPPING'],
    required: true,
    default: 'PERCENTAGE'
  },
  refereeRewardValue: {
    type: Number,
    required: true,
    min: 0,
    default: 0.10
  },
  maxUses: {
    type: Number,
    required: true,
    min: 1,
    default: 100
  },
  currentUses: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
    index: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validTo: {
    type: Date,
    index: true
  }
}, {
  timestamps: true,
  collection: 'referral_codes'
});

// Indexes for better query performance
referralCodeSchema.index({ code: 1, isActive: 1 });
referralCodeSchema.index({ referrerId: 1, isActive: 1 });
referralCodeSchema.index({ validTo: 1, isActive: 1 });

export const ReferralCode: Model<IReferralCode> =
  mongoose.models.ReferralCode || mongoose.model<IReferralCode>('ReferralCode', referralCodeSchema);