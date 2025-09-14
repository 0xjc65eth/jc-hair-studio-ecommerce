/**
 * Shopping Cart Store - Zustand
 * JC Hair Studio's 62 E-commerce
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Cart } from '../../types/product';

interface CartState extends Cart {
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getTaxAmount: (taxRate?: number) => number;
  getTotal: (taxRate?: number) => number;
  
  // Utils
  isInCart: (productId: string, variantId?: string) => boolean;
  getCartItem: (productId: string, variantId?: string) => CartItem | undefined;
}

const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const price = item.variant?.price || item.product.price;
    return total + (price * item.quantity);
  }, 0);
};

const generateCartItemId = (productId: string, variantId?: string): string => {
  return variantId ? `${productId}-${variantId}` : productId;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      subtotal: 0,
      itemsCount: 0,
      isEmpty: true,

      // Actions
      addItem: (newItem) => {
        const state = get();
        const itemId = generateCartItemId(newItem.productId, newItem.variantId);
        
        // Check if item already exists
        const existingItemIndex = state.items.findIndex(item => item.id === itemId);
        
        let updatedItems: CartItem[];
        
        if (existingItemIndex >= 0) {
          // Update quantity of existing item
          updatedItems = state.items.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        } else {
          // Add new item
          const cartItem: CartItem = {
            ...newItem,
            id: itemId,
          };
          updatedItems = [...state.items, cartItem];
        }

        const subtotal = calculateSubtotal(updatedItems);
        const itemsCount = updatedItems.reduce((count, item) => count + item.quantity, 0);

        set({
          items: updatedItems,
          subtotal,
          itemsCount,
          isEmpty: updatedItems.length === 0,
        });
      },

      removeItem: (itemId) => {
        const state = get();
        const updatedItems = state.items.filter(item => item.id !== itemId);
        const subtotal = calculateSubtotal(updatedItems);
        const itemsCount = updatedItems.reduce((count, item) => count + item.quantity, 0);

        set({
          items: updatedItems,
          subtotal,
          itemsCount,
          isEmpty: updatedItems.length === 0,
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const state = get();
        const updatedItems = state.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );

        const subtotal = calculateSubtotal(updatedItems);
        const itemsCount = updatedItems.reduce((count, item) => count + item.quantity, 0);

        set({
          items: updatedItems,
          subtotal,
          itemsCount,
          isEmpty: updatedItems.length === 0,
        });
      },

      clearCart: () => {
        set({
          items: [],
          subtotal: 0,
          itemsCount: 0,
          isEmpty: true,
        });
      },

      // Computed values
      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },

      getSubtotal: () => {
        const state = get();
        return calculateSubtotal(state.items);
      },

      getTaxAmount: (taxRate = 0.23) => { // 23% IVA padrão em Portugal
        const subtotal = get().getSubtotal();
        return subtotal * taxRate;
      },

      getTotal: (taxRate = 0.23) => {
        const subtotal = get().getSubtotal();
        const tax = get().getTaxAmount(taxRate);
        return subtotal + tax;
      },

      // Utils
      isInCart: (productId, variantId) => {
        const state = get();
        const itemId = generateCartItemId(productId, variantId);
        return state.items.some(item => item.id === itemId);
      },

      getCartItem: (productId, variantId) => {
        const state = get();
        const itemId = generateCartItemId(productId, variantId);
        return state.items.find(item => item.id === itemId);
      },
    }),
    {
      name: 'jc-cart-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        subtotal: state.subtotal,
        itemsCount: state.itemsCount,
        isEmpty: state.isEmpty,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recalculate values after rehydration
          const subtotal = calculateSubtotal(state.items);
          const itemsCount = state.items.reduce((count, item) => count + item.quantity, 0);
          
          state.subtotal = subtotal;
          state.itemsCount = itemsCount;
          state.isEmpty = state.items.length === 0;
        }
      },
    }
  )
);

// Utility hook for cart operations
export const useCart = () => {
  const store = useCartStore();
  
  return {
    // State
    items: store.items,
    subtotal: store.subtotal,
    itemsCount: store.itemsCount,
    isEmpty: store.isEmpty,
    
    // Actions
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    
    // Computed
    getItemCount: store.getItemCount,
    getSubtotal: store.getSubtotal,
    getTaxAmount: store.getTaxAmount,
    getTotal: store.getTotal,
    
    // Utils
    isInCart: store.isInCart,
    getCartItem: store.getCartItem,
  };
};