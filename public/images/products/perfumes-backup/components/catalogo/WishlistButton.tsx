'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function WishlistButton({
  productId,
  className = '',
  size = 'md',
  showLabel = false
}: WishlistButtonProps) {
  const [wishlist, setWishlist] = useLocalStorage<string[]>('jc-wishlist', []);
  const [isAnimating, setIsAnimating] = useState(false);

  const isInWishlist = wishlist.includes(productId);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (isInWishlist) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-10 h-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className={`
        ${getSizeClasses()}
        flex items-center justify-center
        rounded-full border-2 transition-all duration-200
        ${isInWishlist 
          ? 'bg-red-50 border-red-200 hover:bg-red-100' 
          : 'bg-white border-gray-200 hover:border-red-200 hover:bg-red-50'
        }
        ${isAnimating ? 'scale-110' : 'hover:scale-105'}
        ${className}
      `}
      title={isInWishlist ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        className={`
          ${getIconSize()}
          transition-colors duration-200
          ${isInWishlist 
            ? 'text-red-500 fill-current' 
            : 'text-gray-400 hover:text-red-500'
          }
        `}
      />
      {showLabel && (
        <span className={`ml-2 text-sm font-medium ${
          isInWishlist ? 'text-red-600' : 'text-gray-600'
        }`}>
          {isInWishlist ? 'Favoritado' : 'Favoritar'}
        </span>
      )}
    </button>
  );
}