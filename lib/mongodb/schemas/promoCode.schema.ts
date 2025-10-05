import mongoose, { Schema, Document } from 'mongoose'

export enum PromoCodeType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING',
  BUY_X_GET_Y = 'BUY_X_GET_Y'
}

export enum PromoCodeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  EXHAUSTED = 'EXHAUSTED'
}

export interface IPromoCode extends Document {
  code: string
  type: PromoCodeType
  description: string

  // Discount values
  discountValue: number // percentage (0-100) or fixed amount in EUR
  maxDiscount?: number // max discount for percentage type
  minPurchase?: number // minimum purchase amount required

  // Free shipping
  freeShipping: boolean

  // Buy X Get Y
  buyQuantity?: number
  getQuantity?: number
  applicableProducts?: string[] // product IDs

  // Usage limits
  maxUses: number
  currentUses: number
  maxUsesPerUser: number

  // Validity
  validFrom: Date
  validTo: Date

  // Restrictions
  categories?: string[] // applicable categories
  excludedCategories?: string[]
  excludedProducts?: string[] // product IDs
  firstPurchaseOnly: boolean

  // Tracking
  createdBy: string // admin user ID
  isActive: boolean

  // Analytics
  totalRevenue: number
  totalOrders: number

  createdAt: Date
  updatedAt: Date
}

const PromoCodeSchema = new Schema<IPromoCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    type: {
      type: String,
      enum: Object.values(PromoCodeType),
      required: true,
      default: PromoCodeType.PERCENTAGE
    },
    description: {
      type: String,
      required: true
    },

    // Discount values
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    maxDiscount: {
      type: Number,
      min: 0
    },
    minPurchase: {
      type: Number,
      min: 0,
      default: 0
    },

    // Free shipping
    freeShipping: {
      type: Boolean,
      default: false
    },

    // Buy X Get Y
    buyQuantity: Number,
    getQuantity: Number,
    applicableProducts: [String],

    // Usage limits
    maxUses: {
      type: Number,
      required: true,
      default: -1 // -1 = unlimited
    },
    currentUses: {
      type: Number,
      default: 0
    },
    maxUsesPerUser: {
      type: Number,
      default: 1
    },

    // Validity
    validFrom: {
      type: Date,
      required: true,
      default: Date.now
    },
    validTo: {
      type: Date,
      required: true
    },

    // Restrictions
    categories: [String],
    excludedCategories: [String],
    excludedProducts: [String],
    firstPurchaseOnly: {
      type: Boolean,
      default: false
    },

    // Tracking
    createdBy: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },

    // Analytics
    totalRevenue: {
      type: Number,
      default: 0
    },
    totalOrders: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

// Indexes
PromoCodeSchema.index({ code: 1 })
PromoCodeSchema.index({ validFrom: 1, validTo: 1 })
PromoCodeSchema.index({ isActive: 1 })

// Methods
PromoCodeSchema.methods.isValid = function(): boolean {
  const now = new Date()

  // Check if active
  if (!this.isActive) return false

  // Check dates
  if (now < this.validFrom || now > this.validTo) return false

  // Check usage limit
  if (this.maxUses !== -1 && this.currentUses >= this.maxUses) return false

  return true
}

PromoCodeSchema.methods.getStatus = function(): PromoCodeStatus {
  const now = new Date()

  if (!this.isActive) return PromoCodeStatus.INACTIVE
  if (now > this.validTo) return PromoCodeStatus.EXPIRED
  if (this.maxUses !== -1 && this.currentUses >= this.maxUses) return PromoCodeStatus.EXHAUSTED

  return PromoCodeStatus.ACTIVE
}

export default mongoose.models.PromoCode || mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema)
