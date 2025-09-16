'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Grid, List, Heart, ShoppingBag, Loader2, SortAsc } from 'lucide-react';
import Image from 'next/image';
import { products, categories } from '../../src/data/products';
import AdvancedFilters from '../../components/AdvancedFilters';

interface ProductCardProps {
  product: typeof products[0];
  viewMode: 'grid' | 'list';
}

function ProductCard({ product, viewMode }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'BEST SELLER':
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black';
      case 'PROMOÇÃO':
        return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
      case 'NOVO':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      case 'PREMIUM':
        return 'bg-gradient-to-r from-indigo-400 to-blue-600 text-white';
      case 'EXCLUSIVO':
        return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Rating simulado baseado no produto
  const getProductRating = (productId: string) => {
    const ratings: { [key: string]: number } = {
      'cadiveu_kit_001': 5,
      'forever_liss_btx_001': 4,
      'g_hair_001': 5,
      'honma_tokyo_001': 5,
      'mari_maria_base_001': 4,
      'boca_rosa_base_001': 5
    };
    return ratings[productId] || 4;
  };

  const rating = getProductRating(product.id);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex gap-6 animate-fade-in">
        <div className="relative w-48 h-48 flex-shrink-0">
          {product.badge && (
            <span className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold z-10 ${getBadgeColor(product.badge)}`}>
              {product.badge}
            </span>
          )}
          
          {!imageError && product.imagens && product.imagens[0] ? (
            <Image
              src={product.imagens[0]}
              alt={product.nome}
              width={192}
              height={192}
              className="w-full h-full object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="text-amber-600 text-sm uppercase tracking-wider font-semibold mb-2">
            {product.marca}
          </div>
          
          <Link href={`/produto/${product.id}`} className="group">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
              {product.nome}
            </h3>
          </Link>
          
          <p className="text-gray-600 mb-3 leading-relaxed">
            {product.descricao}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ⭐
              </div>
            ))}
            <span className="ml-2 text-sm text-gray-500">({rating}.0)</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-amber-600">
                €{product.preco_eur.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400">
                (R$ {product.preco_brl.toFixed(2)})
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium">
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in">
      <div className="relative">
        {product.badge && (
          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold z-10 ${getBadgeColor(product.badge)}`}>
            {product.badge}
          </span>
        )}
        
        <button className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all z-10">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>

        <div className="aspect-square bg-gray-50 overflow-hidden">
          {!imageError && product.imagens && product.imagens[0] ? (
            <Image
              src={product.imagens[0]}
              alt={product.nome}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">{product.marca}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="text-amber-600 text-xs uppercase tracking-wider font-semibold mb-2">
          {product.marca}
        </div>
        
        <Link href={`/produto/${product.id}`} className="group">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
            {product.nome}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">
          {product.descricao}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-300'} text-xs`}
            >
              ⭐
            </div>
          ))}
          <span className="ml-1 text-xs text-gray-500">({rating}.0)</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-amber-600">
            €{product.preco_eur.toFixed(2)}
          </span>
          <span className="text-xs text-gray-400">
            (R$ {product.preco_brl.toFixed(2)})
          </span>
        </div>
        
        <button className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-amber-600 transition-colors font-medium text-sm tracking-wide">
          ADICIONAR AO CARRINHO
        </button>
      </div>
    </div>
  );
}

// Componente de Loading
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center space-x-3">
        <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
        <span className="text-gray-600 font-medium">Aplicando filtros...</span>
      </div>
    </div>
  );
}

export default function ProdutosPageAdvanced() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(false);

  // Adicionar ratings aos produtos
  const productsWithRating = products.map(product => ({
    ...product,
    rating: ['cadiveu_kit_001', 'g_hair_001', 'honma_tokyo_001', 'boca_rosa_base_001'].includes(product.id) ? 5 : 4
  }));

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.preco_eur - b.preco_eur;
      case 'price-high':
        return b.preco_eur - a.preco_eur;
      case 'rating':
        const ratingA = ['cadiveu_kit_001', 'g_hair_001', 'honma_tokyo_001', 'boca_rosa_base_001'].includes(a.id) ? 5 : 4;
        const ratingB = ['cadiveu_kit_001', 'g_hair_001', 'honma_tokyo_001', 'boca_rosa_base_001'].includes(b.id) ? 5 : 4;
        return ratingB - ratingA;
      case 'name':
        return a.nome.localeCompare(b.nome);
      case 'newest':
        return ['vogue_progressiva_001', 'boca_rosa_base_001'].includes(b.id) ? 1 : -1;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-gray-900 mb-4">
              PRODUTOS BRASILEIROS AUTÊNTICOS
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descobra nossa coleção exclusiva de produtos de beleza premium importados diretamente do Brasil
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filtros Avançados */}
        <div className="mb-8">
          <AdvancedFilters
            products={productsWithRating as any}
            onFilterChange={setFilteredProducts as any}
            onLoadingChange={setIsLoading}
          />
        </div>

        {/* Controles de visualização e ordenação */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-gray-600 font-medium">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Filtrando...
                  </span>
                ) : (
                  <>
                    <span className="text-amber-600 font-bold">{sortedProducts.length}</span> 
                    {' '}produto{sortedProducts.length !== 1 ? 's' : ''} encontrado{sortedProducts.length !== 1 ? 's' : ''}
                  </>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                >
                  <option value="name">Nome A-Z</option>
                  <option value="price-low">Preço: Menor</option>
                  <option value="price-high">Preço: Maior</option>
                  <option value="rating">Mais Avaliados</option>
                  <option value="newest">Mais Recentes</option>
                </select>
              </div>
              
              <div className="flex border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600'} rounded-l-lg transition-colors`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600'} rounded-r-lg transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Products Grid/List */}
        {!isLoading && (
          <>
            {sortedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-500">Tente ajustar seus filtros para ver mais resultados</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
              }>
                {sortedProducts.map((product, index) => (
                  <div 
                    key={product.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard
                      product={product}
                      viewMode={viewMode}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Estatísticas dos filtros */}
        {!isLoading && sortedProducts.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-600">{sortedProducts.length}</div>
                <div className="text-sm text-gray-600">Produtos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {Array.from(new Set(sortedProducts.map(p => p.marca))).length}
                </div>
                <div className="text-sm text-gray-600">Marcas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {Array.from(new Set(sortedProducts.map(p => p.categoria))).length}
                </div>
                <div className="text-sm text-gray-600">Categorias</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  €{Math.min(...sortedProducts.map(p => p.preco_eur)).toFixed(0)} - €{Math.max(...sortedProducts.map(p => p.preco_eur)).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Faixa de Preço</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}