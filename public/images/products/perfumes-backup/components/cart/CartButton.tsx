'use client';

import { useCart } from '@/lib/stores/cartStore';
import { ShoppingCart } from 'lucide-react';

export function CartButton() {
  const { toggleCart, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="Abrir carrinho"
    >
      <ShoppingCart size={24} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}