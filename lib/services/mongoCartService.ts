// MongoDB Cart service for JC Hair Studio's 62 E-commerce
// Simplified implementation without Prisma dependency

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

// In-memory cart storage for development
const cartStorage = new Map<string, CartItem[]>();

export class CartService {
  /**
   * Get cart summary (main method for API)
   */
  static async getCartSummary(userOrSessionId: string): Promise<CartSummary> {
    const items = cartStorage.get(userOrSessionId) || [];

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
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      shippingCost: Math.round(shippingCost * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
      appliedCoupons: [],
      availableShipping: shippingOptions
    };
  }

  /**
   * Add item to cart
   */
  static async addToCart(data: {
    userId: string | null;
    sessionId: string;
    productId: string;
    variantId?: string;
    quantity: number;
    customization?: any;
  }): Promise<{ success: boolean; message: string; item?: CartItem }> {
    try {
      const cartKey = data.userId || data.sessionId;
      const items = cartStorage.get(cartKey) || [];

      // Mock product data (in production, fetch from database)
      const mockProduct = {
        id: data.productId,
        name: "Sample Product",
        slug: "sample-product",
        price: 29.99,
        comparePrice: 39.99,
        image: "/images/sample.jpg",
        sku: "SKU-001",
        quantity: 100,
        status: "ACTIVE",
      };

      // Check if item already exists
      const existingItemIndex = items.findIndex(
        item => item.productId === data.productId && item.variantId === data.variantId
      );

      let cartItem: CartItem;

      if (existingItemIndex >= 0) {
        // Update quantity
        items[existingItemIndex].quantity += data.quantity;
        items[existingItemIndex].subtotal = items[existingItemIndex].quantity * mockProduct.price;
        cartItem = items[existingItemIndex];
      } else {
        // Add new item
        cartItem = {
          id: `cart-item-${Date.now()}`,
          productId: data.productId,
          variantId: data.variantId,
          quantity: data.quantity,
          product: mockProduct,
          variant: undefined,
          subtotal: data.quantity * mockProduct.price
        };
        items.push(cartItem);
      }

      // Save updated cart
      cartStorage.set(cartKey, items);

      return {
        success: true,
        message: 'Item added to cart successfully',
        item: cartItem
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to add item to cart'
      };
    }
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(
    userOrSessionId: string,
    productId: string,
    variantId?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const items = cartStorage.get(userOrSessionId) || [];
      const filteredItems = items.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      );

      cartStorage.set(userOrSessionId, filteredItems);

      return {
        success: true,
        message: 'Item removed from cart'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to remove item'
      };
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItemQuantity(
    userOrSessionId: string,
    productId: string,
    quantity: number,
    variantId?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const items = cartStorage.get(userOrSessionId) || [];
      const itemIndex = items.findIndex(
        item => item.productId === productId && item.variantId === variantId
      );

      if (itemIndex < 0) {
        throw new Error('Cart item not found');
      }

      if (quantity === 0) {
        // Remove item
        items.splice(itemIndex, 1);
      } else {
        // Update quantity
        items[itemIndex].quantity = quantity;
        items[itemIndex].subtotal = quantity * items[itemIndex].product.price;
      }

      cartStorage.set(userOrSessionId, items);

      return {
        success: true,
        message: 'Cart item updated'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to update cart item'
      };
    }
  }

  /**
   * Clear entire cart
   */
  static async clearCart(userOrSessionId: string): Promise<{ success: boolean; message: string }> {
    try {
      cartStorage.delete(userOrSessionId);

      return {
        success: true,
        message: 'Cart cleared successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to clear cart'
      };
    }
  }

  /**
   * Get available shipping options
   */
  static async getShippingOptions(cartSubtotal: number): Promise<ShippingOption[]> {
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