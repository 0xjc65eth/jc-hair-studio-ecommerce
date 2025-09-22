'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Star, 
  Scale, 
  Share2,
  Zap
} from 'lucide-react';
import { ProductWithDetails as Product } from '@/types/product';
import {
  useWishlistStore,
  useComparisonStore,
  useUserStore,
  useUIStore
} from '@/lib/store';
import { useCart } from '@/lib/stores/cartStore';
import { 
  formatCurrency, 
  calculateDiscountPercentage,
  calculateProfessionalPrice,
  getImageUrl 
} from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  showQuickActions?: boolean;
  showProfessionalPrice?: boolean;
  className?: string;
}

export function ProductCard({ 
  product, 
  variant = 'default',
  showQuickActions = true,
  showProfessionalPrice = true,
  className = '' 
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToComparison, isInComparison } = useComparisonStore();
  const { user } = useUserStore();
  const { openModal, addNotification } = useUIStore();
  
  const isInWishlistState = isInWishlist(product.id);
  const isInComparisonState = isInComparison(product.id);
  const isProfessional = user?.isProProfessional;
  
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        images: product.images?.map(img => ({ url: img, alt: product.name, isMain: true })) || [],
        category: product.category,
        weight: 0.1
      },
      quantity: 1,
      maxQuantity: product.stockQuantity || 99
    });

    addNotification({
      type: 'success',
      title: 'Produto adicionado!',
      message: `${product.name} foi adicionado ao carrinho.`,
    });
  };
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlistState) {
      removeFromWishlist(product.id);
      addNotification({
        type: 'info',
        title: 'Removido da wishlist',
        message: `${product.name} foi removido da sua wishlist.`,
      });
    } else {
      addToWishlist(product);
      addNotification({
        type: 'success',
        title: 'Adicionado à wishlist!',
        message: `${product.name} foi adicionado à sua wishlist.`,
      });
    }
  };
  
  const handleComparisonToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToComparison(product);
    addNotification({
      type: 'success',
      title: 'Adicionado à comparação!',
      message: `${product.name} foi adicionado à comparação.`,
    });
  };
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    openModal('quickView', { product });
  };
  
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: product.name,
      text: `Confira este produto: ${product.name}`,
      url: `${window.location.origin}/produto/${product.slug}`,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        addNotification({
          type: 'success',
          title: 'Link copiado!',
          message: 'O link do produto foi copiado para a área de transferência.',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const cardVariants = {
    default: 'group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300',
    compact: 'group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300',
    featured: 'group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300',
  };
  
  const imageVariants = {
    default: 'aspect-[4/5] relative overflow-hidden rounded-t-lg',
    compact: 'aspect-square relative overflow-hidden rounded-t-lg',
    featured: 'aspect-[4/5] relative overflow-hidden rounded-t-xl',
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`${cardVariants[variant]} ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/produto/${product.slug}`}>
        <div className={imageVariants[variant]}>
          {/* Main Product Image */}
          <Image
            src={getImageUrl(
              // DEFENSIVE VALIDATION: Ensure images array exists and has at least one item
              (product.images && product.images.length > 0)
                ? (product.images[currentImageIndex] || product.images[0])
                : '/placeholder-product.jpg', // Fallback image
              {
                width: 400,
                height: variant === 'compact' ? 400 : 500,
                quality: 85,
                format: 'webp'
              }
            )}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Additional Images on Hover */}
          {/* DEFENSIVE VALIDATION: Check if images array exists and has multiple items */}
          {(product.images && product.images.length > 1) && (
            <div className="absolute bottom-2 left-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {product.images.slice(0, 4).map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex
                      ? 'bg-white'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {!product.inStock && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                Esgotado
              </span>
            )}
            {isProfessional && (
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>PRO</span>
              </span>
            )}
          </div>
          
          {/* Quick Actions */}
          {showQuickActions && (
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-2 right-2 flex flex-col space-y-1"
                >
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-2 rounded-full transition-colors ${
                      isInWishlistState
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 hover:bg-white text-gray-700'
                    }`}
                    title={isInWishlistState ? 'Remover da wishlist' : 'Adicionar à wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlistState ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={handleComparisonToggle}
                    className={`p-2 rounded-full transition-colors ${
                      isInComparisonState
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/80 hover:bg-white text-gray-700'
                    }`}
                    title="Comparar produto"
                  >
                    <Scale className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={handleQuickView}
                    className="p-2 bg-white/80 hover:bg-white text-gray-700 rounded-full transition-colors"
                    title="Visualização rápida"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="p-2 bg-white/80 hover:bg-white text-gray-700 rounded-full transition-colors"
                    title="Compartilhar"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          
          {/* Quick Add to Cart */}
          <AnimatePresence>
            {isHovered && product.inStock && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={handleAddToCart}
                className="absolute bottom-2 right-2 bg-black text-white px-3 py-2 rounded-full 
                         hover:bg-gray-800 transition-colors flex items-center space-x-1"
                title="Adicionar ao carrinho"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-sm">Adicionar</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {product.category}
            </p>
          )}
          
          {/* Title */}
          <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 ${
            variant === 'compact' ? 'text-sm' : 'text-base'
          }`}>
            {product.name}
          </h3>
          
          {/* Rating */}
          {product.rating && product.reviewsCount && (
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < product.rating! 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewsCount})
              </span>
            </div>
          )}
          
          {/* Stock Status */}
          <div className="flex items-center justify-end">
            {!product.inStock && (
              <span className="text-xs text-red-500 font-medium">
                Esgotado
              </span>
            )}
          </div>
          
          {/* Tags */}
          {product.tags && product.tags.length > 0 && variant !== 'compact' && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// Loading skeleton component
export function ProductCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' | 'featured' }) {
  const cardClass = {
    default: 'bg-white rounded-lg shadow-md',
    compact: 'bg-white rounded-lg shadow-sm',
    featured: 'bg-white rounded-xl shadow-lg',
  };
  
  const imageClass = {
    default: 'aspect-[4/5] bg-gray-200 animate-pulse rounded-t-lg',
    compact: 'aspect-square bg-gray-200 animate-pulse rounded-t-lg',
    featured: 'aspect-[4/5] bg-gray-200 animate-pulse rounded-t-xl',
  };
  
  return (
    <div className={cardClass[variant]}>
      <div className={imageClass[variant]} />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 animate-pulse rounded w-1/3" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
        <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2" />
      </div>
    </div>
  );
}