import { QueryClient } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';

// Create axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('auth_token') 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    
    if (error.response?.status === 404) {
      // Not found
      console.error('Resource not found:', error.config?.url);
    }
    
    if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response?.status);
    }
    
    return Promise.reject(error);
  }
);

// API Query Keys
export const API_KEYS = {
  // Products
  products: ['products'] as const,
  productList: (params: any) => [...API_KEYS.products, 'list', params] as const,
  product: (id: string) => [...API_KEYS.products, 'detail', id] as const,
  productReviews: (id: string) => [...API_KEYS.products, 'reviews', id] as const,
  productRelated: (id: string) => [...API_KEYS.products, 'related', id] as const,
  
  // Categories
  categories: ['categories'] as const,
  categoryProducts: (slug: string, params: any) => 
    [...API_KEYS.categories, slug, 'products', params] as const,
  
  // Search
  search: (query: string, filters: any) => ['search', query, filters] as const,
  searchSuggestions: (query: string) => ['search', 'suggestions', query] as const,
  
  // User
  user: ['user'] as const,
  userProfile: ['user', 'profile'] as const,
  userOrders: ['user', 'orders'] as const,
  userAddresses: ['user', 'addresses'] as const,
  
  // Cart
  cart: ['cart'] as const,
  
  // Wishlist
  wishlist: ['wishlist'] as const,
  
  // Shipping
  shipping: (zipCode: string) => ['shipping', zipCode] as const,
  
  // Payment
  paymentMethods: ['payment', 'methods'] as const,
} as const;

// API Functions
export const productApi = {
  getProducts: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    filters?: Record<string, any>;
  } = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    return api.get(`/products?${searchParams.toString()}`);
  },
  
  getProduct: async (id: string) => {
    return api.get(`/products/${id}`);
  },
  
  getProductBySlug: async (slug: string) => {
    return api.get(`/products/slug/${slug}`);
  },
  
  getProductReviews: async (id: string, page: number = 1) => {
    return api.get(`/products/${id}/reviews?page=${page}`);
  },
  
  getRelatedProducts: async (id: string) => {
    return api.get(`/products/${id}/related`);
  },
  
  addReview: async (productId: string, review: {
    rating: number;
    comment: string;
    images?: File[];
  }) => {
    const formData = new FormData();
    formData.append('rating', review.rating.toString());
    formData.append('comment', review.comment);
    
    if (review.images) {
      review.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
    }
    
    return api.post(`/products/${productId}/reviews`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const categoryApi = {
  getCategories: async () => {
    return api.get('/categories');
  },
  
  getCategoryProducts: async (slug: string, params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    filters?: Record<string, any>;
  } = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    return api.get(`/categories/${slug}/products?${searchParams.toString()}`);
  },
};

export const searchApi = {
  search: async (query: string, filters: Record<string, any> = {}) => {
    return api.post('/search', { query, filters });
  },
  
  getSuggestions: async (query: string) => {
    return api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
  },
  
  getPopularSearches: async () => {
    return api.get('/search/popular');
  },
};

export const userApi = {
  getProfile: async () => {
    return api.get('/user/profile');
  },
  
  updateProfile: async (data: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: File;
  }) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    return api.put('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getOrders: async (page: number = 1) => {
    return api.get(`/user/orders?page=${page}`);
  },
  
  getOrder: async (id: string) => {
    return api.get(`/user/orders/${id}`);
  },
  
  getAddresses: async () => {
    return api.get('/user/addresses');
  },
  
  addAddress: async (address: {
    name: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }) => {
    return api.post('/user/addresses', address);
  },
  
  updateAddress: async (id: string, address: Partial<{
    name: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>) => {
    return api.put(`/user/addresses/${id}`, address);
  },
  
  deleteAddress: async (id: string) => {
    return api.delete(`/user/addresses/${id}`);
  },
};

export const cartApi = {
  getCart: async () => {
    return api.get('/cart');
  },
  
  addToCart: async (item: {
    productId: string;
    quantity: number;
    variants?: Record<string, string>;
  }) => {
    return api.post('/cart/items', item);
  },
  
  updateCartItem: async (itemId: string, quantity: number) => {
    return api.put(`/cart/items/${itemId}`, { quantity });
  },
  
  removeFromCart: async (itemId: string) => {
    return api.delete(`/cart/items/${itemId}`);
  },
  
  clearCart: async () => {
    return api.delete('/cart');
  },
};

export const orderApi = {
  createOrder: async (orderData: {
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      variants?: Record<string, string>;
    }>;
    shippingAddress: {
      name: string;
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    paymentMethod: string;
    paymentData: Record<string, any>;
    couponCode?: string;
  }) => {
    return api.post('/orders', orderData);
  },
  
  getPaymentMethods: async () => {
    return api.get('/payment/methods');
  },
};

export const shippingApi = {
  calculateShipping: async (zipCode: string, items: Array<{
    productId: string;
    quantity: number;
  }>) => {
    return api.post('/shipping/calculate', { zipCode, items });
  },
  
  getShippingOptions: async (zipCode: string) => {
    return api.get(`/shipping/options?zipCode=${zipCode}`);
  },
};

export const couponApi = {
  validateCoupon: async (code: string, cartTotal: number) => {
    return api.post('/coupons/validate', { code, cartTotal });
  },
};

// Error handling utility
export const handleApiError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return { message: data.message || 'Dados inválidos', type: 'error' };
      case 401:
        return { message: 'Não autorizado. Faça login novamente.', type: 'error' };
      case 403:
        return { message: 'Acesso negado.', type: 'error' };
      case 404:
        return { message: 'Recurso não encontrado.', type: 'error' };
      case 422:
        return { message: data.message || 'Dados de entrada inválidos.', type: 'error' };
      case 429:
        return { message: 'Muitas tentativas. Tente novamente mais tarde.', type: 'warning' };
      case 500:
        return { message: 'Erro interno do servidor. Tente novamente.', type: 'error' };
      default:
        return { message: 'Erro desconhecido. Tente novamente.', type: 'error' };
    }
  } else if (error.request) {
    // The request was made but no response was received
    return { message: 'Erro de conexão. Verifique sua internet.', type: 'error' };
  } else {
    // Something happened in setting up the request that triggered an Error
    return { message: 'Erro inesperado. Tente novamente.', type: 'error' };
  }
};

// Query client for server-side rendering
export const getQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });