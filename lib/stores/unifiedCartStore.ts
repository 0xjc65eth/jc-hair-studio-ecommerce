/**
 * Unified Shopping Cart Store - Zustand
 * JC Hair Studio's 62's 62 E-commerce
 *
 * Combines functionality from both cartStore and enhancedCartStore
 * to provide a single, consistent cart experience across the app.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Enhanced types combining both store interfaces
interface ProductVariant {
  id?: string;
  size?: string;
  shade?: string;
  name?: string;
  price?: number;
  stock?: number;
  quantity?: number;
}

interface CartProduct {
  id: string;
  name: string;
  slug: string;
  brand?: string;
  price: number;
  comparePrice?: number;
  images?: { url: string; alt: string; isMain?: boolean }[];
  category?: string;
  weight?: number;
  status?: string;
}

interface CartItem {
  id: string;
  productId: string;
  product: CartProduct;
  quantity: number;
  variant?: ProductVariant;
  maxQuantity?: number;
  addedAt: Date;
}

interface CartSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  itemsCount: number;
  totalWeight: number;
}

interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  description: string;
}

interface UnifiedCartState {
  // Core state
  items: CartItem[];
  isOpen: boolean;
  appliedCoupon: Coupon | null;
  shippingMethod: 'standard' | 'express' | 'pickup';

  // Calculated values (kept in state for performance)
  subtotal: number;
  itemsCount: number;
  isEmpty: boolean;

  // Core actions - compatible with original cartStore
  addItem: (item: Omit<CartItem, 'id' | 'addedAt'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // UI actions from enhancedCartStore
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Coupon functionality
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;

  // Shipping
  setShippingMethod: (method: 'standard' | 'express' | 'pickup') => void;

  // Computed values - compatible with original cartStore
  getItemCount: () => number;
  getSubtotal: () => number;
  getTaxAmount: (taxRate?: number) => number;
  getTotal: (taxRate?: number) => number;
  getCartSummary: () => CartSummary;

  // Utility methods - compatible with both stores
  isInCart: (productId: string, variantId?: string) => boolean;
  getCartItem: (productId: string, variantId?: string) => CartItem | undefined;
  getItemById: (itemId: string) => CartItem | undefined;
  isItemInCart: (productId: string, variant?: ProductVariant) => boolean;

  // Wishlist integration
  moveToWishlist: (itemId: string) => void;
}

// Shipping configuration
const SHIPPING_RATES = {
  standard: { cost: 9.90, freeShippingMin: 199 },
  express: { cost: 19.90, freeShippingMin: 299 },
  pickup: { cost: 0, freeShippingMin: 0 }
};

// Utility functions
const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const price = item.variant?.price || item.product.price;
    return total + (price * item.quantity);
  }, 0);
};

const generateCartItemId = (productId: string, variantId?: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return variantId ? `${productId}-${variantId}-${timestamp}` : `${productId}-${timestamp}-${random}`;
};

const updateCalculatedValues = (items: CartItem[]) => {
  const subtotal = calculateSubtotal(items);
  const itemsCount = items.reduce((count, item) => count + item.quantity, 0);
  const isEmpty = items.length === 0;

  return { subtotal, itemsCount, isEmpty };
};

export const useUnifiedCartStore = create<UnifiedCartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,
      appliedCoupon: null,
      shippingMethod: 'standard',
      subtotal: 0,
      itemsCount: 0,
      isEmpty: true,

      // Core actions
      addItem: (newItem) => {
        const state = get();
        const itemId = generateCartItemId(newItem.productId, newItem.variant?.id);

        // Check if item already exists (same product and variant)
        const existingItemIndex = state.items.findIndex(item => {
          const sameProduct = item.productId === newItem.productId;
          const sameVariant = JSON.stringify(item.variant) === JSON.stringify(newItem.variant);
          return sameProduct && sameVariant;
        });

        let updatedItems: CartItem[];

        if (existingItemIndex >= 0) {
          // Update quantity of existing item
          const existingItem = state.items[existingItemIndex];
          const maxQuantity = newItem.maxQuantity || 99;
          const newQuantity = Math.min(
            existingItem.quantity + newItem.quantity,
            maxQuantity
          );

          updatedItems = state.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: newQuantity }
              : item
          );
        } else {
          // Add new item
          const cartItem: CartItem = {
            ...newItem,
            id: itemId,
            addedAt: new Date(),
            maxQuantity: newItem.maxQuantity || 99,
          };
          updatedItems = [...state.items, cartItem];
        }

        const calculatedValues = updateCalculatedValues(updatedItems);

        set({
          items: updatedItems,
          ...calculatedValues,
        });
      },

      removeItem: (itemId) => {
        const state = get();
        const updatedItems = state.items.filter(item => item.id !== itemId);
        const calculatedValues = updateCalculatedValues(updatedItems);

        set({
          items: updatedItems,
          ...calculatedValues,
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const state = get();
        const updatedItems = state.items.map(item => {
          if (item.id === itemId) {
            const maxQuantity = item.maxQuantity || 99;
            return {
              ...item,
              quantity: Math.min(quantity, maxQuantity)
            };
          }
          return item;
        });

        const calculatedValues = updateCalculatedValues(updatedItems);

        set({
          items: updatedItems,
          ...calculatedValues,
        });
      },

      clearCart: () => {
        set({
          items: [],
          subtotal: 0,
          itemsCount: 0,
          isEmpty: true,
          appliedCoupon: null,
        });
      },

      // UI actions
      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      // Coupon functionality
      applyCoupon: (coupon) => {
        set({ appliedCoupon: coupon });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      // Shipping
      setShippingMethod: (method) => {
        set({ shippingMethod: method });
      },

      // Computed values - maintaining backward compatibility
      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },

      getSubtotal: () => {
        const state = get();
        return calculateSubtotal(state.items);
      },

      getTaxAmount: (taxRate = 0.23) => {
        const subtotal = get().getSubtotal();
        return subtotal * taxRate;
      },

      getTotal: (taxRate = 0.23) => {
        const subtotal = get().getSubtotal();
        const tax = get().getTaxAmount(taxRate);
        return subtotal + tax;
      },

      getCartSummary: () => {
        const { items, appliedCoupon, shippingMethod } = get();

        const subtotal = calculateSubtotal(items);
        const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalWeight = items.reduce((sum, item) => {
          const weight = item.product.weight || 0;
          return sum + (weight * item.quantity);
        }, 0);

        // Calculate shipping
        const shippingRate = SHIPPING_RATES[shippingMethod];
        let shipping = 0;

        if (shippingMethod !== 'pickup') {
          shipping = subtotal >= shippingRate.freeShippingMin ? 0 : shippingRate.cost;
        }

        // Calculate discount
        let discount = 0;
        if (appliedCoupon) {
          if (appliedCoupon.minAmount && subtotal < appliedCoupon.minAmount) {
            // Coupon not applicable
          } else if (appliedCoupon.type === 'percentage') {
            discount = (subtotal * appliedCoupon.value) / 100;
            if (appliedCoupon.maxDiscount) {
              discount = Math.min(discount, appliedCoupon.maxDiscount);
            }
          } else {
            discount = appliedCoupon.value;
          }
        }

        // Calculate tax (23% IVA for Portugal)
        const tax = (subtotal - discount) * 0.23;
        const total = subtotal + shipping + tax - discount;

        return {
          subtotal,
          shipping,
          discount,
          tax,
          total: Math.max(0, total),
          itemsCount,
          totalWeight
        };
      },

      // Utils - backward compatible with both stores
      isInCart: (productId, variantId) => {
        const state = get();
        return state.items.some(item => {
          const sameProduct = item.productId === productId;
          const sameVariant = variantId ? item.variant?.id === variantId : true;
          return sameProduct && sameVariant;
        });
      },

      getCartItem: (productId, variantId) => {
        const state = get();
        return state.items.find(item => {
          const sameProduct = item.productId === productId;
          const sameVariant = variantId ? item.variant?.id === variantId : true;
          return sameProduct && sameVariant;
        });
      },

      getItemById: (itemId) => {
        return get().items.find(item => item.id === itemId);
      },

      isItemInCart: (productId, variant) => {
        const items = get().items;
        return items.some(item =>
          item.productId === productId &&
          JSON.stringify(item.variant) === JSON.stringify(variant)
        );
      },

      moveToWishlist: (itemId) => {
        // Future implementation with wishlist store integration
        // For now, just remove from cart
        get().removeItem(itemId);

        // TODO: Integrate with wishlist store
        // const item = get().getItemById(itemId);
        // if (item) {
        //   wishlistStore.addItem(item);
        //   get().removeItem(itemId);
        // }
      },
    }),
    {
      name: 'unified-cart-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
        shippingMethod: state.shippingMethod,
        subtotal: state.subtotal,
        itemsCount: state.itemsCount,
        isEmpty: state.isEmpty,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recalculate values after rehydration
          const calculatedValues = updateCalculatedValues(state.items);
          Object.assign(state, calculatedValues);
        }
      },
    }
  )
);

// Backward compatible hook - maintains same interface as original useCart
export const useCart = () => {
  const store = useUnifiedCartStore();

  return {
    // State - backward compatible
    items: store.items,
    subtotal: store.subtotal,
    itemsCount: store.itemsCount,
    isEmpty: store.isEmpty,
    isOpen: store.isOpen,

    // Actions - backward compatible
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,

    // UI actions
    toggleCart: store.toggleCart,
    openCart: store.openCart,
    closeCart: store.closeCart,

    // Computed - backward compatible
    getItemCount: store.getItemCount,
    getSubtotal: store.getSubtotal,
    getTaxAmount: store.getTaxAmount,
    getTotal: store.getTotal,
    getCartSummary: store.getCartSummary,

    // Utils - backward compatible
    isInCart: store.isInCart,
    getCartItem: store.getCartItem,

    // Enhanced features
    appliedCoupon: store.appliedCoupon,
    shippingMethod: store.shippingMethod,
    applyCoupon: store.applyCoupon,
    removeCoupon: store.removeCoupon,
    setShippingMethod: store.setShippingMethod,
    getItemById: store.getItemById,
    isItemInCart: store.isItemInCart,
    moveToWishlist: store.moveToWishlist,
  };
};

// Enhanced hook for components that need full enhanced features
export const useEnhancedCart = () => {
  return useUnifiedCartStore();
};