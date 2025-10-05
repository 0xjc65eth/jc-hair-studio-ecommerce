import mongoose, { Schema, Document } from 'mongoose'

export interface IPromoCodeUsage extends Document {
  promoCodeId: string
  userId: string
  orderId?: string

  discountApplied: number
  orderTotal: number

  ipAddress?: string
  userAgent?: string

  createdAt: Date
}

const PromoCodeUsageSchema = new Schema<IPromoCodeUsage>(
  {
    promoCodeId: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: String,
      required: true,
      index: true
    },
    orderId: {
      type: String,
      index: true
    },

    discountApplied: {
      type: Number,
      required: true
    },
    orderTotal: {
      type: Number,
      required: true
    },

    ipAddress: String,
    userAgent: String
  },
  {
    timestamps: true
  }
)

// Indexes
PromoCodeUsageSchema.index({ promoCodeId: 1, userId: 1 })
PromoCodeUsageSchema.index({ createdAt: -1 })

export default mongoose.models.PromoCodeUsage || mongoose.model<IPromoCodeUsage>('PromoCodeUsage', PromoCodeUsageSchema)
