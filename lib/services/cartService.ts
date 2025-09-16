// Cart service for JC Hair Studio's 62's 62 E-commerce
import { PrismaClient } from '@prisma/client';

// Lazy initialization of Prisma client
let prisma: PrismaClient | null = null;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    image?: string;
    sku: string;
    quantity: number;
    status: string;
    hairType?: string;
    hairColor?: string;
    length?: number;
  };
  variant?: {
    id: string;
    name: string;
    sku: string;
    price?: number;
    size?: string;
    color?: string;
    quantity: number;
  };
  subtotal: number;
}

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  appliedCoupons: string[];
  availableShipping: ShippingOption[];
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  isActive: boolean;
}

export interface AddToCartData {
  productId: string;
  variantId?: string;
  quantity: number;
}

export class CartService {
  /**
   * Get user's cart with all items and calculations
   */
  static async getCart(userId?: string, sessionId?: string): Promise<CartSummary> {
    if (!userId && !sessionId) {
      throw new Error('Either userId or sessionId is required');
    }

    const cartItems = await getPrismaClient().cartItem.findMany({
      where: {
        OR: [
          userId ? { userId } : {},
          sessionId ? { sessionId } : {}
        ].filter(Boolean)
      },
      include: {
        product: {
          include: {
            images: {
              where: { isMain: true },
              take: 1
            },
            variants: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const items: CartItem[] = cartItems.map(item => {
      const variant = item.variantId 
        ? item.product.variants.find(v => v.id === item.variantId)
        : undefined;

      const price = variant?.price ? Number(variant.price) : Number(item.product.price);
      const subtotal = price * item.quantity;

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId || undefined,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          price: Number(item.product.price),
          comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : undefined,
          image: item.product.images[0]?.url,
          sku: item.product.sku,
          quantity: item.product.quantity,
          status: item.product.status,
          hairType: item.product.hairType || undefined,
          hairColor: item.product.hairColor || undefined,
          length: item.product.length || undefined,
        },
        variant: variant ? {
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          price: variant.price ? Number(variant.price) : undefined,
          size: variant.size || undefined,
          color: variant.color || undefined,
          quantity: variant.quantity,
        } : undefined,
        subtotal
      };
    });

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Get available shipping options
    const shippingOptions = await this.getShippingOptions(subtotal);
    const defaultShipping = shippingOptions.find(s => s.isActive) || shippingOptions[0];
    
    const taxRate = 0.23; // 23% VAT in Portugal
    const taxAmount = subtotal * taxRate;
    const shippingCost = defaultShipping?.price || 0;
    const discountAmount = 0; // Will be calculated if coupons are applied
    const total = subtotal + taxAmount + shippingCost - discountAmount;

    return {
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      taxAmount,
      shippingCost,
      discountAmount,
      total,
      appliedCoupons: [],
      availableShipping: shippingOptions
    };
  }

  /**
   * Add item to cart
   */
  static async addToCart(
    data: AddToCartData,
    userId?: string,
    sessionId?: string
  ): Promise<CartItem> {
    if (!userId && !sessionId) {
      throw new Error('Either userId or sessionId is required');
    }

    const { productId, variantId, quantity } = data;

    // Verify product exists and is available
    const product = await getPrismaClient().product.findUnique({
      where: { id: productId },
      include: {
        variants: {
          where: { isActive: true }
        },
        images: {
          where: { isMain: true },
          take: 1
        }
      }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.status !== 'ACTIVE') {
      throw new Error('Product is not available');
    }

    // Check variant if specified
    let variant = null;
    if (variantId) {
      variant = product.variants.find(v => v.id === variantId);
      if (!variant) {
        throw new Error('Product variant not found');
      }
      if (!variant.isActive) {
        throw new Error('Product variant is not available');
      }
    }

    // Check stock availability
    const availableStock = variant ? variant.quantity : product.quantity;
    if (product.trackQuantity && availableStock < quantity) {
      throw new Error(`Only ${availableStock} items available`);
    }

    // Check if item already exists in cart
    const existingItem = await getPrismaClient().cartItem.findFirst({
      where: {
        AND: [
          { productId },
          variantId ? { variantId } : { variantId: null },
          userId ? { userId } : { sessionId }
        ]
      }
    });

    let cartItem;

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.trackQuantity && availableStock < newQuantity) {
        throw new Error(`Only ${availableStock} items available (you have ${existingItem.quantity} in cart)`);
      }

      cartItem = await getPrismaClient().cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              images: { where: { isMain: true }, take: 1 },
              variants: { where: { isActive: true } }
            }
          }
        }
      });
    } else {
      // Create new cart item
      cartItem = await getPrismaClient().cartItem.create({
        data: {
          productId,
          variantId,
          quantity,
          userId,
          sessionId
        },
        include: {
          product: {
            include: {
              images: { where: { isMain: true }, take: 1 },
              variants: { where: { isActive: true } }
            }
          }
        }
      });
    }

    // Format response
    const selectedVariant = variantId 
      ? cartItem.product.variants.find(v => v.id === variantId)
      : undefined;

    const price = selectedVariant?.price ? Number(selectedVariant.price) : Number(cartItem.product.price);
    const subtotal = price * cartItem.quantity;

    return {
      id: cartItem.id,
      productId: cartItem.productId,
      variantId: cartItem.variantId || undefined,
      quantity: cartItem.quantity,
      product: {
        id: cartItem.product.id,
        name: cartItem.product.name,
        slug: cartItem.product.slug,
        price: Number(cartItem.product.price),
        comparePrice: cartItem.product.comparePrice ? Number(cartItem.product.comparePrice) : undefined,
        image: cartItem.product.images[0]?.url,
        sku: cartItem.product.sku,
        quantity: cartItem.product.quantity,
        status: cartItem.product.status,
        hairType: cartItem.product.hairType || undefined,
        hairColor: cartItem.product.hairColor || undefined,
        length: cartItem.product.length || undefined,
      },
      variant: selectedVariant ? {
        id: selectedVariant.id,
        name: selectedVariant.name,
        sku: selectedVariant.sku,
        price: selectedVariant.price ? Number(selectedVariant.price) : undefined,
        size: selectedVariant.size || undefined,
        color: selectedVariant.color || undefined,
        quantity: selectedVariant.quantity,
      } : undefined,
      subtotal
    };
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItem(
    cartItemId: string,
    quantity: number,
    userId?: string,
    sessionId?: string
  ): Promise<CartItem> {
    if (!userId && !sessionId) {
      throw new Error('Either userId or sessionId is required');
    }

    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    // Find cart item
    const cartItem = await getPrismaClient().cartItem.findFirst({
      where: {
        id: cartItemId,
        OR: [
          userId ? { userId } : {},
          sessionId ? { sessionId } : {}
        ].filter(Boolean)
      },
      include: {
        product: {
          include: {
            images: { where: { isMain: true }, take: 1 },
            variants: { where: { isActive: true } }
          }
        }
      }
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    if (quantity === 0) {
      // Remove item from cart
      await getPrismaClient().cartItem.delete({
        where: { id: cartItemId }
      });
      
      // Return empty item to indicate deletion
      return null as any;
    }

    // Check stock availability
    const variant = cartItem.variantId 
      ? cartItem.product.variants.find(v => v.id === cartItem.variantId)
      : null;
    
    const availableStock = variant ? variant.quantity : cartItem.product.quantity;
    if (cartItem.product.trackQuantity && availableStock < quantity) {
      throw new Error(`Only ${availableStock} items available`);
    }

    // Update quantity
    const updatedItem = await getPrismaClient().cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: {
          include: {
            images: { where: { isMain: true }, take: 1 },
            variants: { where: { isActive: true } }
          }
        }
      }
    });

    // Format response
    const selectedVariant = cartItem.variantId 
      ? updatedItem.product.variants.find(v => v.id === cartItem.variantId)
      : undefined;

    const price = selectedVariant?.price ? Number(selectedVariant.price) : Number(updatedItem.product.price);
    const subtotal = price * updatedItem.quantity;

    return {
      id: updatedItem.id,
      productId: updatedItem.productId,
      variantId: updatedItem.variantId || undefined,
      quantity: updatedItem.quantity,
      product: {
        id: updatedItem.product.id,
        name: updatedItem.product.name,
        slug: updatedItem.product.slug,
        price: Number(updatedItem.product.price),
        comparePrice: updatedItem.product.comparePrice ? Number(updatedItem.product.comparePrice) : undefined,
        image: updatedItem.product.images[0]?.url,
        sku: updatedItem.product.sku,
        quantity: updatedItem.product.quantity,
        status: updatedItem.product.status,
        hairType: updatedItem.product.hairType || undefined,
        hairColor: updatedItem.product.hairColor || undefined,
        length: updatedItem.product.length || undefined,
      },
      variant: selectedVariant ? {
        id: selectedVariant.id,
        name: selectedVariant.name,
        sku: selectedVariant.sku,
        price: selectedVariant.price ? Number(selectedVariant.price) : undefined,
        size: selectedVariant.size || undefined,
        color: selectedVariant.color || undefined,
        quantity: selectedVariant.quantity,
      } : undefined,
      subtotal
    };
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(
    cartItemId: string,
    userId?: string,
    sessionId?: string
  ): Promise<void> {
    if (!userId && !sessionId) {
      throw new Error('Either userId or sessionId is required');
    }

    const deleted = await getPrismaClient().cartItem.deleteMany({
      where: {
        id: cartItemId,
        OR: [
          userId ? { userId } : {},
          sessionId ? { sessionId } : {}
        ].filter(Boolean)
      }
    });

    if (deleted.count === 0) {
      throw new Error('Cart item not found');
    }
  }

  /**
   * Clear entire cart
   */
  static async clearCart(userId?: string, sessionId?: string): Promise<void> {
    if (!userId && !sessionId) {
      throw new Error('Either userId or sessionId is required');
    }

    await getPrismaClient().cartItem.deleteMany({
      where: {
        OR: [
          userId ? { userId } : {},
          sessionId ? { sessionId } : {}
        ].filter(Boolean)
      }
    });
  }

  /**
   * Merge guest cart with user cart on login
   */
  static async mergeCart(userId: string, sessionId: string): Promise<CartSummary> {
    // Get guest cart items
    const guestItems = await getPrismaClient().cartItem.findMany({
      where: { sessionId },
      include: { product: true }
    });

    // Get user cart items
    const userItems = await getPrismaClient().cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    // Merge logic: for each guest item, check if user already has it
    for (const guestItem of guestItems) {
      const existingUserItem = userItems.find(
        userItem => 
          userItem.productId === guestItem.productId && 
          userItem.variantId === guestItem.variantId
      );

      if (existingUserItem) {
        // Update quantity
        await getPrismaClient().cartItem.update({
          where: { id: existingUserItem.id },
          data: { 
            quantity: existingUserItem.quantity + guestItem.quantity
          }
        });
      } else {
        // Transfer guest item to user
        await getPrismaClient().cartItem.update({
          where: { id: guestItem.id },
          data: { 
            userId,
            sessionId: null
          }
        });
      }
    }

    // Delete any remaining guest items
    await getPrismaClient().cartItem.deleteMany({
      where: { sessionId }
    });

    // Return merged cart
    return this.getCart(userId);
  }

  /**
   * Apply coupon to cart
   */
  static async applyCoupon(
    couponCode: string,
    userId?: string,
    sessionId?: string
  ): Promise<{ discount: number; message: string }> {
    // Find coupon
    const coupon = await getPrismaClient().coupon.findUnique({
      where: { code: couponCode.toUpperCase() }
    });

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    if (!coupon.isActive) {
      throw new Error('Coupon is not active');
    }

    // Check validity dates
    const now = new Date();
    if (coupon.validFrom > now) {
      throw new Error('Coupon is not yet valid');
    }

    if (coupon.validTo && coupon.validTo < now) {
      throw new Error('Coupon has expired');
    }

    // Check usage limits
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new Error('Coupon usage limit reached');
    }

    // Get cart to calculate discount
    const cart = await this.getCart(userId, sessionId);

    // Check minimum order value
    if (coupon.minOrderValue && cart.subtotal < Number(coupon.minOrderValue)) {
      throw new Error(`Minimum order value of ${coupon.minOrderValue} required`);
    }

    // Calculate discount
    let discount = 0;
    switch (coupon.type) {
      case 'PERCENTAGE':
        discount = (cart.subtotal * Number(coupon.value)) / 100;
        break;
      case 'FIXED_AMOUNT':
        discount = Math.min(Number(coupon.value), cart.subtotal);
        break;
      case 'FREE_SHIPPING':
        discount = cart.shippingCost;
        break;
    }

    return {
      discount: Math.round(discount * 100) / 100,
      message: `Coupon "${coupon.name}" applied successfully`
    };
  }

  /**
   * Get available shipping options
   */
  static async getShippingOptions(cartSubtotal: number): Promise<ShippingOption[]> {
    // This would typically come from a shipping service or database
    // For now, returning static options
    const options: ShippingOption[] = [
      {
        id: 'standard',
        name: 'Standard Delivery',
        description: 'Free delivery for orders over €50',
        price: cartSubtotal >= 50 ? 0 : 5.99,
        estimatedDays: '3-5 business days',
        isActive: true
      },
      {
        id: 'express',
        name: 'Express Delivery',
        description: 'Next day delivery',
        price: 14.99,
        estimatedDays: '1 business day',
        isActive: true
      },
      {
        id: 'pickup',
        name: 'Store Pickup',
        description: 'Collect from our store',
        price: 0,
        estimatedDays: 'Same day',
        isActive: true
      }
    ];

    return options;
  }
}