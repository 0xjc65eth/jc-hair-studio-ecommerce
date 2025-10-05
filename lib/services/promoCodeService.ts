import PromoCode, { PromoCodeType, IPromoCode } from '@/lib/mongodb/schemas/promoCode.schema'
import PromoCodeUsage from '@/lib/mongodb/schemas/promoCodeUsage.schema'
import { connectDB } from '@/lib/mongodb'

export interface CreatePromoCodeData {
  code: string
  type: PromoCodeType
  description: string
  discountValue: number
  maxDiscount?: number
  minPurchase?: number
  freeShipping?: boolean
  maxUses?: number
  maxUsesPerUser?: number
  validFrom?: Date
  validTo: Date
  categories?: string[]
  excludedCategories?: string[]
  excludedProducts?: string[]
  firstPurchaseOnly?: boolean
  createdBy: string
}

export interface ValidatePromoCodeData {
  code: string
  userId: string
  cartTotal: number
  cartItems: Array<{
    productId: string
    category?: string
    quantity: number
    price: number
  }>
}

export interface ApplyPromoCodeResult {
  valid: boolean
  discount: number
  freeShipping: boolean
  message?: string
  promoCodeId?: string
}

export class PromoCodeService {

  /**
   * Create a new promo code
   */
  async createPromoCode(data: CreatePromoCodeData): Promise<IPromoCode> {
    await connectDB()

    // Check if code already exists
    const existing = await PromoCode.findOne({ code: data.code.toUpperCase() })
    if (existing) {
      throw new Error('Código promocional já existe')
    }

    // Validate discount value
    if (data.type === PromoCodeType.PERCENTAGE && (data.discountValue < 0 || data.discountValue > 100)) {
      throw new Error('Desconto percentual deve estar entre 0 e 100')
    }

    if (data.type === PromoCodeType.FIXED_AMOUNT && data.discountValue < 0) {
      throw new Error('Valor de desconto não pode ser negativo')
    }

    const promoCode = await PromoCode.create({
      code: data.code.toUpperCase(),
      type: data.type,
      description: data.description,
      discountValue: data.discountValue,
      maxDiscount: data.maxDiscount,
      minPurchase: data.minPurchase || 0,
      freeShipping: data.freeShipping || false,
      maxUses: data.maxUses || -1,
      currentUses: 0,
      maxUsesPerUser: data.maxUsesPerUser || 1,
      validFrom: data.validFrom || new Date(),
      validTo: data.validTo,
      categories: data.categories,
      excludedCategories: data.excludedCategories,
      excludedProducts: data.excludedProducts,
      firstPurchaseOnly: data.firstPurchaseOnly || false,
      createdBy: data.createdBy,
      isActive: true,
      totalRevenue: 0,
      totalOrders: 0
    })

    return promoCode
  }

  /**
   * Validate and calculate discount for a promo code
   */
  async validatePromoCode(data: ValidatePromoCodeData): Promise<ApplyPromoCodeResult> {
    await connectDB()

    // Find promo code
    const promoCode = await PromoCode.findOne({
      code: data.code.toUpperCase(),
      isActive: true
    })

    if (!promoCode) {
      return {
        valid: false,
        discount: 0,
        freeShipping: false,
        message: 'Código promocional inválido'
      }
    }

    // Check if valid
    if (!promoCode.isValid()) {
      const status = promoCode.getStatus()
      let message = 'Código promocional inválido'

      if (status === 'EXPIRED') {
        message = 'Código promocional expirado'
      } else if (status === 'EXHAUSTED') {
        message = 'Código promocional esgotado'
      } else if (status === 'INACTIVE') {
        message = 'Código promocional inativo'
      }

      return {
        valid: false,
        discount: 0,
        freeShipping: false,
        message
      }
    }

    // Check minimum purchase
    if (promoCode.minPurchase && data.cartTotal < promoCode.minPurchase) {
      return {
        valid: false,
        discount: 0,
        freeShipping: false,
        message: `Compra mínima de €${promoCode.minPurchase.toFixed(2)} necessária`
      }
    }

    // Check user usage limit
    const userUsageCount = await PromoCodeUsage.countDocuments({
      promoCodeId: promoCode._id.toString(),
      userId: data.userId
    })

    if (userUsageCount >= promoCode.maxUsesPerUser) {
      return {
        valid: false,
        discount: 0,
        freeShipping: false,
        message: 'Você já utilizou este código o número máximo de vezes'
      }
    }

    // Check category restrictions
    if (promoCode.categories && promoCode.categories.length > 0) {
      const hasValidCategory = data.cartItems.some(item =>
        item.category && promoCode.categories!.includes(item.category)
      )

      if (!hasValidCategory) {
        return {
          valid: false,
          discount: 0,
          freeShipping: false,
          message: 'Código não aplicável aos produtos no carrinho'
        }
      }
    }

    // Check excluded categories
    if (promoCode.excludedCategories && promoCode.excludedCategories.length > 0) {
      const hasExcludedCategory = data.cartItems.some(item =>
        item.category && promoCode.excludedCategories!.includes(item.category)
      )

      if (hasExcludedCategory) {
        return {
          valid: false,
          discount: 0,
          freeShipping: false,
          message: 'Código não aplicável a alguns produtos no carrinho'
        }
      }
    }

    // Check excluded products
    if (promoCode.excludedProducts && promoCode.excludedProducts.length > 0) {
      const hasExcludedProduct = data.cartItems.some(item =>
        promoCode.excludedProducts!.includes(item.productId)
      )

      if (hasExcludedProduct) {
        return {
          valid: false,
          discount: 0,
          freeShipping: false,
          message: 'Código não aplicável a alguns produtos no carrinho'
        }
      }
    }

    // Calculate discount
    let discount = 0

    switch (promoCode.type) {
      case PromoCodeType.PERCENTAGE:
        discount = data.cartTotal * (promoCode.discountValue / 100)
        if (promoCode.maxDiscount && discount > promoCode.maxDiscount) {
          discount = promoCode.maxDiscount
        }
        break

      case PromoCodeType.FIXED_AMOUNT:
        discount = Math.min(promoCode.discountValue, data.cartTotal)
        break

      case PromoCodeType.FREE_SHIPPING:
        discount = 0 // Shipping cost will be handled separately
        break

      case PromoCodeType.BUY_X_GET_Y:
        // TODO: Implement buy X get Y logic
        discount = 0
        break
    }

    return {
      valid: true,
      discount: Math.round(discount * 100) / 100,
      freeShipping: promoCode.freeShipping || promoCode.type === PromoCodeType.FREE_SHIPPING,
      message: `Desconto de €${discount.toFixed(2)} aplicado`,
      promoCodeId: promoCode._id.toString()
    }
  }

  /**
   * Record promo code usage
   */
  async recordUsage(
    promoCodeId: string,
    userId: string,
    orderId: string,
    discountApplied: number,
    orderTotal: number,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await connectDB()

    // Create usage record
    await PromoCodeUsage.create({
      promoCodeId,
      userId,
      orderId,
      discountApplied,
      orderTotal,
      ipAddress,
      userAgent
    })

    // Update promo code stats
    await PromoCode.findByIdAndUpdate(promoCodeId, {
      $inc: {
        currentUses: 1,
        totalOrders: 1,
        totalRevenue: orderTotal
      }
    })
  }

  /**
   * Get promo code by code
   */
  async getPromoCode(code: string): Promise<IPromoCode | null> {
    await connectDB()
    return await PromoCode.findOne({ code: code.toUpperCase() })
  }

  /**
   * List all promo codes (admin)
   */
  async listPromoCodes(filter?: {
    isActive?: boolean
    type?: PromoCodeType
  }): Promise<IPromoCode[]> {
    await connectDB()

    const query: any = {}
    if (filter?.isActive !== undefined) {
      query.isActive = filter.isActive
    }
    if (filter?.type) {
      query.type = filter.type
    }

    return await PromoCode.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
  }

  /**
   * Update promo code
   */
  async updatePromoCode(
    code: string,
    updates: Partial<CreatePromoCodeData>
  ): Promise<IPromoCode | null> {
    await connectDB()

    const promoCode = await PromoCode.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $set: updates },
      { new: true }
    )

    return promoCode
  }

  /**
   * Deactivate promo code
   */
  async deactivatePromoCode(code: string): Promise<void> {
    await connectDB()

    await PromoCode.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $set: { isActive: false } }
    )
  }

  /**
   * Get promo code usage stats
   */
  async getUsageStats(code: string) {
    await connectDB()

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() })
    if (!promoCode) {
      throw new Error('Código não encontrado')
    }

    const usages = await PromoCodeUsage.find({
      promoCodeId: promoCode._id.toString()
    }).sort({ createdAt: -1 }).limit(50)

    const uniqueUsers = await PromoCodeUsage.distinct('userId', {
      promoCodeId: promoCode._id.toString()
    })

    return {
      promoCode,
      totalUsages: promoCode.currentUses,
      uniqueUsers: uniqueUsers.length,
      totalRevenue: promoCode.totalRevenue,
      totalOrders: promoCode.totalOrders,
      recentUsages: usages,
      status: promoCode.getStatus()
    }
  }
}

export const promoCodeService = new PromoCodeService()
