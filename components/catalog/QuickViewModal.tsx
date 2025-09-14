'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Star, 
  StarHalf, 
  ShoppingCart, 
  Heart, 
  Plus, 
  Minus, 
  Truck, 
  Shield, 
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ProductVariant {
  size?: string;
  shade?: string;
  price?: number;
  stock: number;
}

interface ProductImage {
  url: string;
  alt: string;
  isMain: boolean;
}

interface QuickViewProduct {
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
  images: ProductImage[];
  variants?: ProductVariant[];
}

interface QuickViewModalProps {
  product: QuickViewProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (productId: string, quantity: number, variant?: ProductVariant) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false
}: QuickViewModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0]);
      setQuantity(1);
      setCurrentImageIndex(0);
      setIsImageLoading(true);
    }
  }, [product]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const currentPrice = selectedVariant?.price || product.price;
  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - currentPrice) / product.comparePrice) * 100) 
    : 0;

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

  // Handle quantity change
  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase' && quantity < product.stockQuantity) {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (onAddToCart && product.inStock) {
      onAddToCart(product.id, quantity, selectedVariant);
      onClose();
    }
  };

  // Navigate images
  const navigateImage = (direction: 'prev' | 'next') => {
    const totalImages = product.images.length;
    if (direction === 'prev') {
      setCurrentImageIndex(prev => (prev - 1 + totalImages) % totalImages);
    } else {
      setCurrentImageIndex(prev => (prev + 1) % totalImages);
    }
  };

  const currentImage = product.images[currentImageIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col lg:flex-row max-h-[90vh] overflow-y-auto">
          {/* Image Section */}
          <div className="lg:w-1/2 relative">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50">
              <Image
                src={currentImage?.url || '/placeholder-product.jpg'}
                alt={currentImage?.alt || product.name}
                fill
                className="object-cover"
                onLoad={() => setIsImageLoading(false)}
              />
              
              {isImageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Labels */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.labels.slice(0, 2).map((label, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                  >
                    {label}
                  </span>
                ))}
                {discountPercentage > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      currentImageIndex === index 
                        ? 'border-amber-500 scale-105' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-6 lg:p-8">
            {/* Brand and Category */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-amber-600 text-sm font-semibold uppercase tracking-wide">
                {product.brand}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 text-sm">{product.category}</span>
            </div>

            {/* Product Name */}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                {renderStarRating(product.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating.toFixed(1)} ({product.reviewsCount} avaliações)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-amber-600">
                R$ {currentPrice.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-gray-400 line-through">
                  R$ {product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {product.variants[0].size ? 'Tamanho' : 'Cor'}:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                        selectedVariant === variant
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {variant.size || variant.shade}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantidade:</h3>
              <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-3 min-w-[4rem] text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={quantity >= product.stockQuantity}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Stock Status */}
                {product.inStock && product.stockQuantity <= 10 && (
                  <span className="text-orange-600 text-sm">
                    Apenas {product.stockQuantity} em estoque
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  product.inStock
                    ? 'bg-amber-600 hover:bg-amber-700 text-white hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.inStock ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
              </button>

              <button
                onClick={() => onToggleWishlist?.(product.id)}
                className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </button>
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-green-600" />
                <span>Frete grátis para compras acima de R$ 199</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Compra 100% segura e protegida</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw className="w-5 h-5 text-purple-600" />
                <span>7 dias para troca e devolução</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}