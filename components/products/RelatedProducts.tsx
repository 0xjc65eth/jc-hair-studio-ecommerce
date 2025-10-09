'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';

interface RelatedProduct {
  id: string;
  name: string;
  slug?: string;
  price: number;
  images: string[];
  category?: string;
  rating?: number;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  title?: string;
  currentProductId?: string;
  maxProducts?: number;
  className?: string;
}

export default function RelatedProducts({
  products,
  title = 'Produtos Relacionados',
  currentProductId,
  maxProducts = 4,
  className = ''
}: RelatedProductsProps) {
  const filteredProducts = products
    .filter(p => p.id !== currentProductId)
    .slice(0, maxProducts);

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {title}
          </h2>
          <Link
            href="/produtos"
            className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2 group"
            title="Ver todos os produtos"
          >
            Ver todos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/produto/${product.id}`}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              title={`Ver ${product.name}`}
            >
              <div className="aspect-square bg-gray-50 overflow-hidden relative">
                <Image
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              
              <div className="p-4">
                {product.category && (
                  <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider">
                    {product.category}
                  </span>
                )}
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                  {product.name}
                </h3>
                
                {product.rating && (
                  <div className="flex items-center gap-1 mb-2">
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
                )}
                
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-amber-600">
                    €{product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Variant for sidebar display
export function RelatedProductsSidebar({
  products,
  title = 'Você também pode gostar',
  currentProductId,
  maxProducts = 3,
  className = ''
}: RelatedProductsProps) {
  const filteredProducts = products
    .filter(p => p.id !== currentProductId)
    .slice(0, maxProducts);

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <aside className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {title}
      </h3>
      
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/produto/${product.id}`}
            className="flex gap-3 group"
            title={`Ver ${product.name}`}
          >
            <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="80px"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                {product.name}
              </h4>
              <p className="text-sm font-bold text-amber-600 mt-1">
                €{product.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
