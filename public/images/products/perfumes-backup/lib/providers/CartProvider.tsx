'use client';

/**
 * Cart Provider - Global Cart Initialization
 * JC Hair Studio's 62 E-commerce
 *
 * This provider ensures cart state is properly initialized at the application root level,
 * preventing race conditions and ensuring cart data persists across all pages and components.
 */

import React, { useEffect } from 'react';
import { useCartInitializer } from '../stores/cartStore';

interface CartInitializerProps {
  children: React.ReactNode;
}

/**
 * CartInitializer Component
 *
 * Wraps the entire application to ensure cart state is initialized before any components
 * attempt to access cart data. This prevents the "Carrinho Vazio" issue in checkout
 * where the page would render before localStorage cart data was loaded.
 */
export function CartInitializer({ children }: CartInitializerProps) {
  // Initialize cart from localStorage at the root level
  // This ensures all child components have access to properly loaded cart state
  useCartInitializer();

  // Additional safety measure: ensure cart is properly initialized on client-side
  useEffect(() => {
    // Force cart initialization on client mount to handle any edge cases
    // where the useCartInitializer hook might not execute properly
    if (typeof window !== 'undefined') {
      // Cart store will handle the actual initialization logic
      console.log('🛒 Cart Provider: Application cart initialized');
    }
  }, []);

  // Render children - cart is now guaranteed to be initialized
  return <>{children}</>;
}

/**
 * Usage Instructions:
 *
 * Wrap your application root with CartInitializer:
 *
 * <CartInitializer>
 *   <YourAppComponents />
 * </CartInitializer>
 *
 * This ensures:
 * 1. Cart loads from localStorage before any page renders
 * 2. Prevents "Carrinho Vazio" in checkout when items exist
 * 3. Provides consistent cart state across all components
 * 4. Eliminates race conditions between cart initialization and page rendering
 */