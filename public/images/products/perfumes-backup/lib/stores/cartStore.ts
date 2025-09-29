/**
 * Shopping Cart Store - Zustand
 * JC Hair Studio's 62 E-commerce
 */

import { useEffect } from 'react';
import { create } from 'zustand';
import { CartItem, Cart } from '../../types/product';

interface CartState extends Cart {
  // UI State
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getTaxAmount: (taxRate?: number) => number;
  getTotal: (taxRate?: number) => number;
  getTotalItems: () => number;

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

// LocalStorage helpers
const CART_STORAGE_KEY = 'jc-cart-storage-manual';

const saveToStorage = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('Failed to save cart:', error);
    }
  }
};

const loadFromStorage = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load cart:', error);
    }
  }
  return [];
};

export const useCartStore = create<CartState>((set, get) => ({
  // Initial state
  items: [],
  subtotal: 0,
  itemsCount: 0,
  isEmpty: true,
  isOpen: false,

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

    // Save to localStorage
    saveToStorage(updatedItems);

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

    // Save to localStorage
    saveToStorage(updatedItems);

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

    // Save to localStorage
    saveToStorage(updatedItems);

    set({
      items: updatedItems,
      subtotal,
      itemsCount,
      isEmpty: updatedItems.length === 0,
    });
  },

  clearCart: () => {
    // Save to localStorage
    saveToStorage([]);

    set({
      items: [],
      subtotal: 0,
      itemsCount: 0,
      isEmpty: true,
    });
  },

  openCart: () => {
    set({ isOpen: true });
  },

  closeCart: () => {
    set({ isOpen: false });
  },

  toggleCart: () => {
    const state = get();
    set({ isOpen: !state.isOpen });
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

  getTotalItems: () => {
    const state = get();
    return state.items.reduce((count, item) => count + item.quantity, 0);
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
}));

// Global flag to prevent multiple initializations
let cartInitialized = false;

// Hook to initialize cart from localStorage
export const useCartInitializer = () => {
  const { items } = useCartStore();

  // Load from localStorage on first render - use useEffect for proper timing
  useEffect(() => {
    // Prevent multiple initializations
    if (cartInitialized || typeof window === 'undefined') {
      return;
    }

    const savedItems = loadFromStorage();
    console.log('🔍 CART INITIALIZER DEBUG:', {
      savedItemsLength: savedItems.length,
      savedItems
    });

    if (savedItems.length > 0) {
      const subtotal = calculateSubtotal(savedItems);
      const itemsCount = savedItems.reduce((count, item) => count + item.quantity, 0);

      // Only update if current items are empty to avoid overwriting
      const currentItems = useCartStore.getState().items;
      console.log('🔄 UPDATING CART STATE:', {
        currentItemsLength: currentItems.length,
        newItemsLength: savedItems.length,
        newSubtotal: subtotal,
        newItemsCount: itemsCount
      });

      if (currentItems.length === 0) {
        useCartStore.setState({
          items: savedItems,
          subtotal,
          itemsCount,
          isEmpty: false,
        });
        console.log('✅ CART STATE UPDATED FROM LOCALSTORAGE');
      } else {
        console.log('⚠️ CART ALREADY HAS ITEMS, SKIPPING UPDATE');
      }
    } else {
      console.log('📭 NO SAVED ITEMS IN LOCALSTORAGE');
    }

    // Mark as initialized
    cartInitialized = true;
  }, []); // Run only once on mount
};

// Utility hook for cart operations
export const useCart = () => {
  const store = useCartStore();

  // Don't initialize here since CartProvider already does it
  // This prevents double initialization and race conditions

  return {
    // State
    items: store.items,
    subtotal: store.subtotal,
    itemsCount: store.itemsCount,
    isEmpty: store.isEmpty,
    isOpen: store.isOpen,

    // Actions
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,

    // Computed
    getItemCount: store.getItemCount,
    getSubtotal: store.getSubtotal,
    getTaxAmount: store.getTaxAmount,
    getTotal: store.getTotal,
    getTotalItems: store.getTotalItems,

    // Utils
    isInCart: store.isInCart,
    getCartItem: store.getCartItem,
  };
};