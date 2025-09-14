import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand?: string;
  inStock: boolean;
  stockQuantity?: number;
  rating?: number;
  reviewsCount?: number;
  tags?: string[];
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  stock?: number;
  image?: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariants?: { [key: string]: string };
  price: number;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isProProfessional?: boolean;
  discountPercentage?: number;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

// Store interfaces
interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: string) => number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
}

interface UserStore {
  user: User | null;
  addresses: Address[];
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  addAddress: (address: Address) => void;
  updateAddress: (addressId: string, address: Partial<Address>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  logout: () => void;
}

interface UIStore {
  // Navigation
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Search
  searchQuery: string;
  searchSuggestions: string[];
  setSearchQuery: (query: string) => void;
  setSearchSuggestions: (suggestions: string[]) => void;
  
  // Modals
  activeModal: string | null;
  modalData: any;
  openModal: (modal: string, data?: any) => void;
  closeModal: () => void;
  
  // Loading states
  isLoading: { [key: string]: boolean };
  setLoading: (key: string, loading: boolean) => void;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }>;
  addNotification: (notification: Omit<UIStore['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
}

interface ComparisonStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
  getTotalItems: () => number;
}

// Store implementations
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(i => i.productId === item.productId);
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: item.quantity || 1 }],
          };
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getItemQuantity: (productId) => {
        const item = get().items.find(item => item.productId === productId);
        return item?.quantity || 0;
      },
    }),
    {
      name: 'jc-hair-studio-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          if (state.items.some(item => item.productId === product.id)) {
            return state;
          }
          return {
            items: [...state.items, { 
              productId: product.id, 
              product, 
              addedAt: new Date().toISOString() 
            }],
          };
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId),
        }));
      },
      
      clearWishlist: () => set({ items: [] }),
      
      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId);
      },
      
      getTotalItems: () => get().items.length,
    }),
    {
      name: 'jc-hair-studio-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      addresses: [],
      isAuthenticated: false,
      
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
      
      addAddress: (address) => {
        set((state) => ({
          addresses: [...state.addresses, address],
        }));
      },
      
      updateAddress: (addressId, updatedAddress) => {
        set((state) => ({
          addresses: state.addresses.map(addr =>
            addr.id === addressId ? { ...addr, ...updatedAddress } : addr
          ),
        }));
      },
      
      removeAddress: (addressId) => {
        set((state) => ({
          addresses: state.addresses.filter(addr => addr.id !== addressId),
        }));
      },
      
      setDefaultAddress: (addressId) => {
        set((state) => ({
          addresses: state.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId,
          })),
        }));
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, addresses: [] });
      },
    }),
    {
      name: 'jc-hair-studio-user',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useUIStore = create<UIStore>((set, get) => ({
  // Navigation
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  
  // Search
  searchQuery: '',
  searchSuggestions: [],
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchSuggestions: (suggestions) => set({ searchSuggestions: suggestions }),
  
  // Modals
  activeModal: null,
  modalData: null,
  openModal: (modal, data) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
  
  // Loading states
  isLoading: {},
  setLoading: (key, loading) => {
    set((state) => ({
      isLoading: { ...state.isLoading, [key]: loading },
    }));
  },
  
  // Notifications
  notifications: [],
  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
    
    // Auto remove after duration (default 5 seconds)
    setTimeout(() => {
      get().removeNotification(id);
    }, notification.duration || 5000);
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },
}));

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          if (state.items.some(item => item.id === product.id)) {
            return state;
          }
          // Limit to 4 products for comparison
          const newItems = state.items.length >= 4 
            ? [...state.items.slice(1), product]
            : [...state.items, product];
          return { items: newItems };
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId),
        }));
      },
      
      clearComparison: () => set({ items: [] }),
      
      isInComparison: (productId) => {
        return get().items.some(item => item.id === productId);
      },
      
      getTotalItems: () => get().items.length,
    }),
    {
      name: 'jc-hair-studio-comparison',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Utility hooks
export const useIsClient = () => {
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
};

// Export all stores in a combined hook for easy access
export const useStores = () => ({
  cart: useCartStore(),
  wishlist: useWishlistStore(),
  user: useUserStore(),
  ui: useUIStore(),
  comparison: useComparisonStore(),
});