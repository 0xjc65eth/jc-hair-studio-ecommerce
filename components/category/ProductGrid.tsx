'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Eye, Zap, Gift } from 'lucide-react';
import { Product } from '@/lib/data/categories';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  className?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
}

function ProductCard({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  onQuickView 
}: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({product.reviewCount})</span>
      </div>
    );
  };

  return (
    <div
      className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/produto/${product.id}`} className="block">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Novo
            </span>
          )}
          {product.isPopular && (
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Popular
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
              <Gift className="w-3 h-3 mr-1" />
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3 z-10">
          {product.availability === 'out_of_stock' && (
            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Esgotado
            </span>
          )}
          {product.availability === 'pre_order' && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Pré-venda
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            onLoadingComplete={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
        
          {/* Overlay com ações */}
          <div className={`
            absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center
            transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView?.(product.id);
                }}
                className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Visualização rápida"
              >
                <Eye className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToWishlist?.(product.id);
                }}
                className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Adicionar aos favoritos"
              >
                <Heart className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
        {/* Brand */}
        <div className="text-sm text-gray-500 font-medium">
          {product.brand}
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center justify-between">
          {renderStars(product.rating)}
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">
            €{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              €{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="text-xs text-gray-600">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
              {product.features.length > 2 && (
                <span className="text-gray-500">
                  +{product.features.length - 2} mais
                </span>
              )}
            </div>
          </div>
        )}
        </div>
      </Link>

      {/* Add to Cart Button - Outside Link */}
      <div className="px-4 pb-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart?.(product.id);
          }}
          disabled={product.availability === 'out_of_stock'}
          className={`
            w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200
            flex items-center justify-center space-x-2
            ${product.availability === 'out_of_stock'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
            }
          `}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>
            {product.availability === 'out_of_stock'
              ? 'Indisponível'
              : product.availability === 'pre_order'
              ? 'Pré-encomendar'
              : 'Adicionar ao carrinho'
            }
          </span>
        </button>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function ProductGrid({ 
  products, 
  isLoading = false,
  className = ''
}: ProductGridProps) {
  const handleAddToCart = (productId: string) => {
    // Implementar lógica do carrinho
    console.log('Adicionar ao carrinho:', productId);
  };

  const handleAddToWishlist = (productId: string) => {
    // Implementar lógica de favoritos
    console.log('Adicionar aos favoritos:', productId);
  };

  const handleQuickView = (productId: string) => {
    // Implementar visualização rápida
    console.log('Visualização rápida:', productId);
  };

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingCart className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum produto encontrado
        </h3>
        <p className="text-gray-500">
          Tente ajustar os filtros ou fazer uma nova busca.
        </p>
      </div>
    );
  }

  return (
    <div 
      id="product-list"
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onQuickView={handleQuickView}
        />
      ))}
    </div>
  );
}