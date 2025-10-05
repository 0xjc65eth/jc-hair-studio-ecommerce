import mongoose, { Schema, Document, Model } from 'mongoose';

export type RewardType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'POINTS' | 'FREE_SHIPPING';
export type RewardStatus = 'PENDING' | 'PROCESSED' | 'PAID' | 'CANCELLED';
export type PayoutMethod = 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE' | 'CREDIT_BALANCE';

// Referral Rewards Schema
export interface IReferralReward extends Document {
  id: string;
  referralId: string;
  userId: string;
  userType: 'REFERRER' | 'REFEREE';
  rewardType: RewardType;
  rewardValue: number;
  calculatedAmount: number;
  currency: string;
  status: RewardStatus;
  orderId?: string;
  orderValue?: number;
  processedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const referralRewardSchema = new Schema<IReferralReward>({
  referralId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  userType: {
    type: String,
    enum: ['REFERRER', 'REFEREE'],
    required: true,
    index: true
  },
  rewardType: {
    type: String,
    enum: ['PERCENTAGE', 'FIXED_AMOUNT', 'POINTS', 'FREE_SHIPPING'],
    required: true
  },
  rewardValue: {
    type: Number,
    required: true,
    min: 0
  },
  calculatedAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'EUR',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSED', 'PAID', 'CANCELLED'],
    required: true,
    default: 'PENDING',
    index: true
  },
  orderId: {
    type: String,
    index: true
  },
  orderValue: {
    type: Number,
    min: 0
  },
  processedAt: {
    type: Date,
    index: true
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true,
  collection: 'referral_rewards'
});

// Compound indexes
referralRewardSchema.index({ userId: 1, status: 1 });
referralRewardSchema.index({ userType: 1, status: 1 });
referralRewardSchema.index({ createdAt: -1, status: 1 });

export const ReferralReward: Model<IReferralReward> =
  mongoose.models.ReferralReward || mongoose.model<IReferralReward>('ReferralReward', referralRewardSchema);

// Referral Cashback Schema
export interface IReferralCashback extends Document {
  id: string;
  userId: string;
  referralId: string;
  amount: number;
  currency: string;
  status: 'AVAILABLE' | 'REQUESTED' | 'PAID' | 'EXPIRED';
  earnedAt: Date;
  expiresAt?: Date;
  requestedAt?: Date;
  paidAt?: Date;
  payoutId?: string;
  multiplier?: number;
  tierBonus?: number;
  createdAt: Date;
  updatedAt: Date;
}

const referralCashbackSchema = new Schema<IReferralCashback>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  referralId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'EUR',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'REQUESTED', 'PAID', 'EXPIRED'],
    required: true,
    default: 'AVAILABLE',
    index: true
  },
  earnedAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  expiresAt: {
    type: Date,
    index: true
  },
  requestedAt: {
    type: Date,
    index: true
  },
  paidAt: {
    type: Date,
    index: true
  },
  payoutId: {
    type: String,
    index: true
  },
  multiplier: {
    type: Number,
    min: 1,
    default: 1
  },
  tierBonus: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'referral_cashback'
});

// Compound indexes
referralCashbackSchema.index({ userId: 1, status: 1 });
referralCashbackSchema.index({ status: 1, expiresAt: 1 });

export const ReferralCashback: Model<IReferralCashback> =
  mongoose.models.ReferralCashback || mongoose.model<IReferralCashback>('ReferralCashback', referralCashbackSchema);

// Cashback Payout Schema
export interface ICashbackPayout extends Document {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: PayoutMethod;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  bankDetails?: {
    accountHolder?: string;
    accountNumber?: string;
    bankName?: string;
    iban?: string;
    swift?: string;
  };
  paypalEmail?: string;
  stripeAccountId?: string;
  transactionId?: string;
  failureReason?: string;
  requestedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const cashbackPayoutSchema = new Schema<ICashbackPayout>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'EUR',
    uppercase: true
  },
  method: {
    type: String,
    enum: ['BANK_TRANSFER', 'PAYPAL', 'STRIPE', 'CREDIT_BALANCE'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    required: true,
    default: 'PENDING',
    index: true
  },
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    bankName: String,
    iban: String,
    swift: String
  },
  paypalEmail: String,
  stripeAccountId: String,
  transactionId: String,
  failureReason: String,
  requestedAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  processedAt: Date,
  completedAt: Date,
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true,
  collection: 'cashback_payouts'
});

// Indexes
cashbackPayoutSchema.index({ userId: 1, status: 1 });
cashbackPayoutSchema.index({ status: 1, requestedAt: -1 });

export const CashbackPayout: Model<ICashbackPayout> =
  mongoose.models.CashbackPayout || mongoose.model<ICashbackPayout>('CashbackPayout', cashbackPayoutSchema);