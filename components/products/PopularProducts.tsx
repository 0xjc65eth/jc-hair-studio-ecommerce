'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, ArrowRight, Star, Flame } from 'lucide-react';

interface PopularProduct {
  id: string;
  name: string;
  slug?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  rating?: number;
  reviewCount?: number;
  salesCount?: number;
}

interface PopularProductsProps {
  products: PopularProduct[];
  title?: string;
  subtitle?: string;
  maxProducts?: number;
  className?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
}

export default function PopularProducts({
  products,
  title = 'Produtos Mais Vendidos',
  subtitle = 'Os favoritos dos nossos clientes',
  maxProducts = 6,
  className = '',
  showViewAll = true,
  viewAllLink = '/produtos'
}: PopularProductsProps) {
  const displayProducts = products.slice(0, maxProducts);

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 bg-gradient-to-br from-amber-50 to-orange-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flame className="w-6 h-6 text-orange-500" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {title}
            </h2>
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-gray-600 text-lg">{subtitle}</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {displayProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/produto/${product.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative"
              title={`Ver ${product.name}`}
            >
              {/* Ranking Badge */}
              {index < 3 && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                  {index + 1}
                </div>
              )}

              {/* Trending Badge */}
              <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                HOT
              </div>

              {/* Product Image */}
              <div className="aspect-square bg-gray-50 overflow-hidden relative">
                <Image
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Product Info */}
              <div className="p-5">
                <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider">
                  {product.category}
                </span>

                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors mt-1">
                  {product.name}
                </h3>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < product.rating!
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {product.reviewCount && (
                      <span className="text-xs text-gray-500">
                        ({product.reviewCount})
                      </span>
                    )}
                  </div>
                )}

                {/* Sales Count */}
                {product.salesCount && (
                  <div className="text-xs text-gray-500 mb-3">
                    {product.salesCount}+ vendidos
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ¬{product.comparePrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xl font-bold text-amber-600">
                    ¬{product.price.toFixed(2)}
                  </span>
                </div>

                {/* Savings Badge */}
                {product.comparePrice && product.comparePrice > product.price && (
                  <div className="mt-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      Economize ¬{(product.comparePrice - product.price).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center">
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              title="Ver todos os produtos"
            >
              Ver Todos os Produtos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// Compact variant for sidebars
export function PopularProductsCompact({
  products,
  title = 'Mais Vendidos',
  maxProducts = 5,
  className = ''
}: Omit<PopularProductsProps, 'subtitle' | 'showViewAll' | 'viewAllLink'>) {
  const displayProducts = products.slice(0, maxProducts);

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-amber-600" />
        <h3 className="text-lg font-bold text-gray-900">
          {title}
        </h3>
      </div>

      <div className="space-y-4">
        {displayProducts.map((product, index) => (
          <Link
            key={product.id}
            href={`/produto/${product.id}`}
            className="flex gap-3 group"
            title={`Ver ${product.name}`}
          >
            <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
              {/* Ranking */}
              <div className="absolute top-1 left-1 z-10 bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <Image
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="64px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                {product.name}
              </h4>
              <p className="text-sm font-bold text-amber-600 mt-1">
                ¬{product.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
