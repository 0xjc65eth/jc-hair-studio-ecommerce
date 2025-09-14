import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProductVariant {
  size?: string;
  shade?: string;
  price?: number;
  stock: number;
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  comparePrice?: number;
  image: string;
  quantity: number;
  variant?: ProductVariant;
  maxQuantity: number;
  weight: number;
  category: string;
}

interface CartSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  itemsCount: number;
  weight: number;
}

interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  description: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedCoupon: Coupon | null;
  shippingMethod: 'standard' | 'express' | 'pickup';
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Coupon actions
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  
  // Shipping
  setShippingMethod: (method: 'standard' | 'express' | 'pickup') => void;
  
  // Calculations
  getCartSummary: () => CartSummary;
  getItemById: (itemId: string) => CartItem | undefined;
  isItemInCart: (productId: string, variant?: ProductVariant) => boolean;
  
  // Wishlist integration
  moveToWishlist: (itemId: string) => void;
}

const SHIPPING_RATES = {
  standard: { cost: 9.90, freeShippingMin: 199 },
  express: { cost: 19.90, freeShippingMin: 299 },
  pickup: { cost: 0, freeShippingMin: 0 }
};

export const useEnhancedCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,
      shippingMethod: 'standard',

      addItem: (newItem) => {
        const items = get().items;
        
        // Check if item already exists (same product and variant)
        const existingItemIndex = items.findIndex(item => 
          item.productId === newItem.productId && 
          JSON.stringify(item.variant) === JSON.stringify(newItem.variant)
        );

        if (existingItemIndex !== -1) {
          // Update quantity of existing item
          const existingItem = items[existingItemIndex];
          const newQuantity = Math.min(
            existingItem.quantity + newItem.quantity,
            existingItem.maxQuantity
          );
          
          set(state => ({
            items: state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: newQuantity }
                : item
            )
          }));
        } else {
          // Add new item
          const cartItem: CartItem = {
            id: `${newItem.productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...newItem
          };
          
          set(state => ({
            items: [...state.items, cartItem]
          }));
        }
      },

      removeItem: (itemId) => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId)
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set(state => ({
          items: state.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                quantity: Math.min(quantity, item.maxQuantity)
              };
            }
            return item;
          })
        }));
      },

      clearCart: () => {
        set({
          items: [],
          appliedCoupon: null
        });
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      applyCoupon: (coupon) => {
        set({ appliedCoupon: coupon });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      setShippingMethod: (method) => {
        set({ shippingMethod: method });
      },

      getCartSummary: () => {
        const { items, appliedCoupon, shippingMethod } = get();
        
        const subtotal = items.reduce((sum, item) => {
          const itemPrice = item.variant?.price || item.price;
          return sum + (itemPrice * item.quantity);
        }, 0);

        const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
        const weight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);

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

        const total = subtotal + shipping - discount;

        return {
          subtotal,
          shipping,
          discount,
          total: Math.max(0, total),
          itemsCount,
          weight
        };
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
        // This would integrate with a wishlist store
        // For now, just remove from cart
        get().removeItem(itemId);
        
        // In a real implementation, you would:
        // const item = get().getItemById(itemId);
        // if (item) {
        //   wishlistStore.addItem(item);
        //   get().removeItem(itemId);
        // }
      }
    }),
    {
      name: 'enhanced-cart-storage',
      version: 1
    }
  )
);