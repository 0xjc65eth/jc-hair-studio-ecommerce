import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for combining classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency for Brazilian/Portuguese market
export function formatCurrency(
  value: number,
  currency: string = 'EUR',
  locale: string = 'pt-PT'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Format percentage
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

// Format date
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  locale: string = 'pt-PT'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

// Format relative time (e.g., "há 2 horas")
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'agora mesmo';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `há ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `há ${hours} hora${hours !== 1 ? 's' : ''}`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `há ${days} dia${days !== 1 ? 's' : ''}`;
  } else {
    return formatDate(past, { day: 'numeric', month: 'short', year: 'numeric' });
  }
}

// Slugify function for URLs
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Generate excerpt from text
export function generateExcerpt(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  return lastSpaceIndex > 0 
    ? truncated.slice(0, lastSpaceIndex) + '...'
    : truncated + '...';
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate Brazilian phone number
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+55\s?)?\(?[1-9]{2}\)?\s?9?[6-9]\d{3}-?\d{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Validate Portuguese postal code
export function isValidPostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^\d{4}-\d{3}$/;
  return postalCodeRegex.test(postalCode);
}

// Format phone number
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}

// Format postal code
export function formatPostalCode(postalCode: string): string {
  const cleaned = postalCode.replace(/\D/g, '');
  
  if (cleaned.length === 7) {
    return cleaned.replace(/(\d{4})(\d{3})/, '$1-$2');
  }
  
  return postalCode;
}

// Calculate discount percentage
export function calculateDiscountPercentage(
  originalPrice: number,
  discountedPrice: number
): number {
  if (originalPrice <= 0 || discountedPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

// Calculate professional discount
export function calculateProfessionalPrice(
  price: number,
  discountPercentage: number = 15
): number {
  return price * (1 - discountPercentage / 100);
}

// Generate random ID
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  
  return (...args: Parameters<T>) => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// Get image URL with transformations
export function getImageUrl(
  src: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  }
): string {
  if (!src) return '';
  
  // If it's a relative path, return as is
  if (src.startsWith('/')) return src;
  
  // If it's already a full URL, return as is
  if (src.startsWith('http')) return src;
  
  // For Cloudinary or other CDN URLs, add transformations
  if (src.includes('cloudinary.com') || src.includes('res.cloudinary.com')) {
    const url = new URL(src);
    const pathParts = url.pathname.split('/');
    
    if (transformations) {
      const transforms = [];
      
      if (transformations.width) transforms.push(`w_${transformations.width}`);
      if (transformations.height) transforms.push(`h_${transformations.height}`);
      if (transformations.quality) transforms.push(`q_${transformations.quality}`);
      if (transformations.format) transforms.push(`f_${transformations.format}`);
      if (transformations.fit) transforms.push(`c_${transformations.fit}`);
      
      if (transforms.length > 0) {
        pathParts.splice(-1, 0, transforms.join(','));
        url.pathname = pathParts.join('/');
      }
    }
    
    return url.toString();
  }
  
  return src;
}

// Check if device is mobile
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.innerWidth < 768;
}

// Check if device supports touch
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Get device type
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';
      
      document.body.prepend(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        return true;
      } catch (error) {
        console.error('Failed to copy:', error);
        return false;
      } finally {
        textArea.remove();
      }
    }
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}

// Share content (Web Share API with fallback)
export async function shareContent(data: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    if (navigator.share && isTouchDevice()) {
      await navigator.share(data);
      return true;
    } else {
      // Fallback: copy URL to clipboard
      if (data.url) {
        await copyToClipboard(data.url);
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error('Failed to share:', error);
    return false;
  }
}

// Local storage helpers with error handling
export const storage = {
  get: (key: string, defaultValue: any = null) => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key: string, value: any): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Failed to set localStorage:', error);
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  },
  
  clear: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  },
};

// Session storage helpers
export const sessionStorage = {
  get: (key: string, defaultValue: any = null) => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to get from sessionStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key: string, value: any): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Failed to set sessionStorage:', error);
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from sessionStorage:', error);
      return false;
    }
  },
};

// SEO helpers
export function generateMetaTags(data: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';
  const defaultImage = `${baseUrl}/og-image.jpg`;
  
  return {
    title: data.title || "JC Hair Studio's 62 - Extensões de Cabelo Premium",
    description: data.description || 'E-commerce especializado em extensões de cabelo de alta qualidade.',
    keywords: data.keywords?.join(', ') || 'extensões de cabelo, mega hair, progressiva vogue',
    openGraph: {
      type: data.type || 'website',
      title: data.title || "JC Hair Studio's 62",
      description: data.description || 'Extensões de cabelo de alta qualidade',
      url: data.url || baseUrl,
      images: [
        {
          url: data.image || defaultImage,
          width: 1200,
          height: 630,
          alt: data.title || "JC Hair Studio's 62",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title || "JC Hair Studio's 62",
      description: data.description || 'Extensões de cabelo de alta qualidade',
      images: [data.image || defaultImage],
    },
  };
}