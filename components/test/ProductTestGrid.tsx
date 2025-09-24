'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  brand?: string;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
}

interface ProductTestGridProps {
  title: string;
  products: Product[];
  categoryColor?: string;
}

export default function ProductTestGrid({ title, products, categoryColor = "blue" }: ProductTestGridProps) {
  const [imageStats, setImageStats] = useState({
    loaded: 0,
    failed: 0,
    total: products.length
  });

  const handleImageLoad = () => {
    setImageStats(prev => ({
      ...prev,
      loaded: prev.loaded + 1
    }));
  };

  const handleImageError = () => {
    setImageStats(prev => ({
      ...prev,
      failed: prev.failed + 1
    }));
  };

  const successRate = imageStats.total > 0
    ? Math.round((imageStats.loaded / imageStats.total) * 100)
    : 0;

  const colorClasses = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    purple: "bg-purple-500 text-white",
    rose: "bg-rose-500 text-white",
    yellow: "bg-yellow-500 text-white"
  };

  return (
    <div className="mb-8">
      {/* Category Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold px-4 py-2 rounded-lg ${colorClasses[categoryColor as keyof typeof colorClasses] || colorClasses.blue}`}>
            {title} ({products.length} produtos)
          </h2>
          <div className="text-right">
            <div className="text-sm text-gray-600">Taxa de sucesso das imagens</div>
            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
            <div className="text-xs text-gray-500">
              {imageStats.loaded} ok • {imageStats.failed} erro
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product, index) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="relative h-32 bg-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />

              {/* Price badge */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                €{product.price?.toFixed(2) || '0.00'}
              </div>

              {/* Stock status */}
              {product.inStock !== undefined && (
                <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs ${
                  product.inStock
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {product.inStock ? 'Em estoque' : 'Fora de estoque'}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-3">
              <div className="text-xs text-gray-500 mb-1">
                {product.brand} • {product.category}
              </div>

              <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                {product.name}
              </h3>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-gray-500">
                    {product.rating?.toFixed(1)} ({product.reviewCount})
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">Nenhum produto encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
}