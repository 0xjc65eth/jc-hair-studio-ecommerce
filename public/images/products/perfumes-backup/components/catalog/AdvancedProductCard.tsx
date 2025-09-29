'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Heart, 
  Eye, 
  Star, 
  StarHalf,
  Zap,
  Gift,
  Tag,
  Flame,
  Crown,
  Leaf,
  Check,
  Plus,
  Minus
} from 'lucide-react';

interface ProductVariant {
  size?: string;
  shade?: string;
  price?: number;
  stock: number;
}

interface ProductLabel {
  text: string;
  type: 'novo' | 'destaque' | 'oferta' | 'premium' | 'best-seller' | 'eco' | 'professional';
}

interface AdvancedProductCardProps {
  id: string;
  name: string;
  slug: string;
  brand: string;
  shortDesc: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  category: string;
  subcategory?: string;
  tags: string[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockQuantity: number;
  weight: number;
  labels: string[];
  images: Array<{
    url: string;
    alt: string;
    isMain: boolean;
  }>;
  variants?: ProductVariant[];
  onAddToCart?: (productId: string, quantity: number, variant?: ProductVariant) => void;
  onToggleWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  isInWishlist?: boolean;
  viewMode?: 'grid' | 'list';
  showQuickActions?: boolean;
}

export default function AdvancedProductCard({
  id,
  name,
  slug,
  brand,
  shortDesc,
  description,
  price,
  comparePrice,
  sku,
  category,
  subcategory,
  tags,
  rating,
  reviewsCount,
  inStock,
  stockQuantity,
  weight,
  labels,
  images,
  variants,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  isInWishlist = false,
  viewMode = 'grid',
  showQuickActions = true
}: AdvancedProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(variants?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate discount percentage
  const discountPercentage = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  // Get label styling
  const getLabelStyling = (label: string) => {
    const labelLower = label.toLowerCase();
    
    const labelStyles = {
      'novo': { 
        bg: 'bg-gradient-to-r from-green-500 to-emerald-600', 
        text: 'text-white',
        icon: <Zap className="w-3 h-3" />
      },
      'destaque': { 
        bg: 'bg-gradient-to-r from-yellow-400 to-orange-500', 
        text: 'text-black',
        icon: <Star className="w-3 h-3" />
      },
      'oferta': { 
        bg: 'bg-gradient-to-r from-red-500 to-pink-600', 
        text: 'text-white',
        icon: <Tag className="w-3 h-3" />
      },
      'premium': { 
        bg: 'bg-gradient-to-r from-purple-600 to-indigo-700', 
        text: 'text-white',
        icon: <Crown className="w-3 h-3" />
      },
      'best seller': { 
        bg: 'bg-gradient-to-r from-amber-500 to-yellow-600', 
        text: 'text-black',
        icon: <Flame className="w-3 h-3" />
      },
      'eco': { 
        bg: 'bg-gradient-to-r from-green-600 to-teal-700', 
        text: 'text-white',
        icon: <Leaf className="w-3 h-3" />
      },
      'profissional': { 
        bg: 'bg-gradient-to-r from-gray-800 to-black', 
        text: 'text-white',
        icon: <Gift className="w-3 h-3" />
      }
    };

    return labelStyles[labelLower as keyof typeof labelStyles] || {
      bg: 'bg-gray-500',
      text: 'text-white',
      icon: <Tag className="w-3 h-3" />
    };
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (onAddToCart && inStock) {
      onAddToCart(id, quantity, selectedVariant);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase' && quantity < stockQuantity) {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const currentPrice = selectedVariant?.price || price;
  const mainImage = images.find(img => img.isMain) || images[0];

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex gap-6 border border-gray-100">
        {/* Image Section */}
        <div className="relative w-64 h-64 flex-shrink-0 group">
          {/* Labels */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
            {labels.slice(0, 2).map((label, index) => {
              const styling = getLabelStyling(label);
              return (
                <span
                  key={index}
                  className={`${styling.bg} ${styling.text} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg`}
                >
                  {styling.icon}
                  {label}
                </span>
              );
            })}
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          {showQuickActions && (
            <button
              onClick={() => onToggleWishlist?.(id)}
              className="absolute top-3 right-3 z-20 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
                }`}
              />
            </button>
          )}

          {/* Product Image */}
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-50">
            <Image
              src={mainImage?.url || '/placeholder-product.jpg'}
              alt={mainImage?.alt || name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onLoad={() => setIsImageLoading(false)}
            />
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </div>

          {/* Quick View Overlay */}
          {showQuickActions && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={() => onQuickView?.(id)}
                className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Visualização Rápida
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          {/* Brand and Category */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-wide">
              {brand}
            </span>
            <span className="text-gray-400 text-sm">•</span>
            <span className="text-gray-500 text-sm">{category}</span>
          </div>

          {/* Product Name */}
          <Link href={`/produto/${slug}`} className="group">
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {renderStarRating(rating)}
            </div>
            <span className="text-sm text-gray-600">
              {rating.toFixed(1)} ({reviewsCount} avaliações)
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Price and Actions */}
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-amber-600">
                  €{(currentPrice * 0.159).toFixed(2)}
                </span>
                {comparePrice && (
                  <span className="text-lg text-gray-400 line-through">
                    €{(comparePrice * 0.159).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-3">
                {inStock && (
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-2 min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= stockQuantity}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    inStock
                      ? 'bg-amber-600 hover:bg-amber-700 text-white hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {inStock ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
                </button>
              </div>
            </div>

            {/* Stock Status */}
            {inStock && stockQuantity <= 5 && (
              <p className="text-orange-600 text-sm mt-2 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Últimas {stockQuantity} unidades!
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {/* Labels */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {labels.slice(0, 2).map((label, index) => {
            const styling = getLabelStyling(label);
            return (
              <span
                key={index}
                className={`${styling.bg} ${styling.text} px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg`}
              >
                {styling.icon}
                {label}
              </span>
            );
          })}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        {showQuickActions && (
          <button
            onClick={() => onToggleWishlist?.(id)}
            className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            />
          </button>
        )}

        {/* Product Image */}
        <Image
          src={mainImage?.url || '/placeholder-product.jpg'}
          alt={mainImage?.alt || name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onLoad={() => setIsImageLoading(false)}
        />
        
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Quick Actions Overlay */}
        {showQuickActions && (
          <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={() => onQuickView?.(id)}
              className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <Eye className="w-4 h-4" />
              Visualização Rápida
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Brand */}
        <div className="text-amber-600 text-xs uppercase tracking-wider font-semibold mb-2">
          {brand}
        </div>

        {/* Product Name */}
        <Link href={`/produto/${slug}`} className="group">
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors min-h-[3rem]">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {renderStarRating(rating)}
          </div>
          <span className="text-xs text-gray-500">
            ({reviewsCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-amber-600">
            €{(currentPrice * 0.159).toFixed(2)}
          </span>
          {comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              €{(comparePrice * 0.159).toFixed(2)}
            </span>
          )}
        </div>

        {/* Variants */}
        {variants && variants.length > 1 && (
          <div className="mb-4">
            <div className="text-xs text-gray-600 mb-2">
              {variants[0].size ? 'Tamanho:' : 'Cor:'}
            </div>
            <div className="flex flex-wrap gap-1">
              {variants.slice(0, 4).map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-2 py-1 text-xs rounded border transition-colors ${
                    selectedVariant === variant
                      ? 'border-amber-600 bg-amber-50 text-amber-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {variant.size || variant.shade}
                </button>
              ))}
              {variants.length > 4 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{variants.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            inStock
              ? 'bg-gray-900 hover:bg-amber-600 text-white hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {inStock ? (
            <>
              <ShoppingCart className="w-4 h-4" />
              ADICIONAR AO CARRINHO
            </>
          ) : (
            'FORA DE ESTOQUE'
          )}
        </button>

        {/* Stock Status */}
        {inStock && stockQuantity <= 5 && (
          <p className="text-orange-600 text-xs mt-2 text-center flex items-center justify-center gap-1">
            <Zap className="w-3 h-3" />
            Apenas {stockQuantity} restantes!
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}