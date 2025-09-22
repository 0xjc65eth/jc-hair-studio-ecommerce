'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getLegacyCompatibleProducts } from '@/lib/data/megaHairProducts';
import { useCart } from '@/lib/stores/cartStore';

// Enhanced product data structure (mantém compatibilidade)
interface MegaHairProduct {
  id: number;
  name: string;
  type: 'liso' | 'ondulado' | 'cacheado' | 'crespo';
  color: 'loiro' | 'castanho' | 'preto' | 'ruivo' | 'ombre';
  length: number;
  price: number;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  origin: string;
  weight: number;
}

// Mapeamentos para compatibilidade
const hairTypes: Array<'liso' | 'ondulado' | 'cacheado' | 'crespo'> = ['liso', 'ondulado', 'cacheado', 'crespo'];
const hairColors: Array<'loiro' | 'castanho' | 'preto' | 'ruivo' | 'ombre'> = ['loiro', 'castanho', 'preto', 'ruivo', 'ombre'];
const lengths = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];

const typeNames: Record<string, string> = {
  'liso': 'Liso Natural',
  'ondulado': 'Ondulado Suave',
  'cacheado': 'Cacheado Definido',
  'crespo': 'Crespo Natural'
};

// Usar sistema unificado como fonte de dados
function generateProducts(): MegaHairProduct[] {
  return getLegacyCompatibleProducts();
}

// Filter interfaces
interface Filters {
  type: string;
  color: string;
  length: string;
  priceRange: string;
  inStock: boolean;
}

export default function MegaHairCatalog() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<MegaHairProduct | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const { addItem: addToCartStore, getItemCount, openCart, items } = useCart();
  const [isClient, setIsClient] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<Filters>({
    type: 'todos',
    color: 'todos',
    length: 'todos',
    priceRange: 'todos',
    inStock: false
  });

  // Generate products once usando sistema unificado
  const allProducts = useMemo(() => generateProducts(), []);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (filters.type !== 'todos') {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters.color !== 'todos') {
      filtered = filtered.filter(p => p.color === filters.color);
    }
    if (filters.length !== 'todos') {
      filtered = filtered.filter(p => p.length === parseInt(filters.length));
    }
    if (filters.priceRange !== 'todos') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        if (max) {
          return p.price >= min && p.price <= max;
        } else {
          return p.price >= min;
        }
      });
    }
    if (filters.inStock) {
      filtered = filtered.filter(p => p.inStock);
    }

    return filtered;
  }, [allProducts, filters]);

  // Client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cart is now managed by global store
  useEffect(() => {
    // Global cart store handles persistence automatically
  }, [isClient]);

  // Save cart to localStorage
  // Remove old cart localStorage logic
  useEffect(() => {
    // Cart is now managed by global store
  }, [isClient]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (filterType: keyof Filters, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      type: 'todos',
      color: 'todos',
      length: 'todos',
      priceRange: 'todos',
      inStock: false
    });
  };

  const addToCart = (product: MegaHairProduct) => {
    addToCartStore({
      productId: product.id.toString(),
      quantity: 1,
      product: {
        id: product.id.toString(),
        name: product.name,
        slug: `mega-hair-${product.id}`,
        price: product.price,
        images: [{ url: product.image, alt: product.name, isMain: true }],
        status: 'ACTIVE' as any,
        quantity: product.inStock ? 999 : 0,
      },
    });
    openCart();
  };

  const getCartItemCount = () => {
    return getItemCount();
  };

  const isInCart = (productId: number) => {
    return items.some(item => item.productId === productId.toString());
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Simple Header */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-thin mb-6 tracking-wide"
            >
              Catálogo <span className="font-light text-rose-400">Mega Hair</span>
            </motion.h1>
            <div className="w-32 h-1 bg-gradient-to-r from-rose-400 to-rose-600 mx-auto mb-8 rounded-full"></div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 font-light leading-relaxed mb-8"
            >
              {allProducts.length} produtos selecionados • Cabelos 100% naturais •
              Entrega em toda Europa
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-6 text-sm text-gray-400"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>{filteredProducts.filter(p => p.inStock).length} Disponíveis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>{getCartItemCount()} no Carrinho</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <span className="text-sm">🔍</span>
                <span className="text-sm font-medium">
                  {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                </span>
              </button>
              <div className="text-sm text-gray-600">
                {filteredProducts.length} de {allProducts.length} produtos
              </div>
            </div>

            {(filters.type !== 'todos' || filters.color !== 'todos' || filters.length !== 'todos' || filters.priceRange !== 'todos' || filters.inStock) && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-rose-600 hover:text-rose-800 font-medium"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-80 shrink-0"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32">
                  <h3 className="text-xl font-semibold mb-6 text-gray-900">Filtrar Produtos</h3>

                  {/* Type Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Textura</h4>
                    <div className="space-y-2">
                      {['todos', ...hairTypes].map(type => (
                        <button
                          key={type}
                          onClick={() => handleFilterChange('type', type)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                            filters.type === type
                              ? 'bg-rose-600 text-white shadow-lg transform scale-105'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {type === 'todos' ? 'Todos os Tipos' : typeNames[type] || type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Cor</h4>
                    <div className="space-y-2">
                      {['todos', ...hairColors].map(color => (
                        <button
                          key={color}
                          onClick={() => handleFilterChange('color', color)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                            filters.color === color
                              ? 'bg-rose-600 text-white shadow-lg transform scale-105'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {color === 'todos' ? 'Todas as Cores' : color.charAt(0).toUpperCase() + color.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Length Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Comprimento</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleFilterChange('length', 'todos')}
                        className={`px-3 py-2 rounded-lg transition-all text-sm ${
                          filters.length === 'todos'
                            ? 'bg-rose-600 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        Todos
                      </button>
                      {lengths.map(length => (
                        <button
                          key={length}
                          onClick={() => handleFilterChange('length', length.toString())}
                          className={`px-3 py-2 rounded-lg transition-all text-sm ${
                            filters.length === length.toString()
                              ? 'bg-rose-600 text-white'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {length}cm
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Faixa de Preço</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'todos', label: 'Todos os Preços' },
                        { value: '60-100', label: '€60 - €100' },
                        { value: '100-200', label: '€100 - €200' },
                        { value: '200-300', label: '€200 - €300' },
                        { value: '300', label: 'Acima de €300' }
                      ].map(range => (
                        <button
                          key={range.value}
                          onClick={() => handleFilterChange('priceRange', range.value)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm ${
                            filters.priceRange === range.value
                              ? 'bg-rose-600 text-white shadow-lg'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stock Filter */}
                  <div className="mb-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500"
                      />
                      <span className="text-sm text-gray-700">Apenas disponíveis</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-light text-gray-600 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-500 mb-6">
                  Tente ajustar os filtros ou limpar todas as seleções
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.02 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Product Image */}
                    <div className="relative h-64 overflow-hidden">
                      {product.badge && (
                        <span className="absolute top-3 right-3 z-10 px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-full">
                          {product.badge}
                        </span>
                      )}
                      <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-gray-900/90 text-white text-sm rounded-full">
                        {product.length} cm
                      </span>
                      <div className="relative w-full h-full">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Mega+Hair';
                          }}
                        />
                      </div>

                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-medium">Indisponível</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <div className="text-xs text-rose-600 font-semibold uppercase tracking-wider mb-1">
                        {typeNames[product.type]} • {product.origin}
                      </div>
                      <h3 className="text-lg font-medium mb-3 text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-sm">
                              {i < Math.floor(product.rating) ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>

                      {/* Specs */}
                      <div className="flex gap-4 text-xs text-gray-600 mb-4">
                        <span>📏 {product.length}cm</span>
                        <span>⚖️ {product.weight}g</span>
                        <span>🎨 Premium</span>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="text-2xl font-light text-rose-600">{formatPrice(product.price)}</div>
                        <div className="text-xs text-gray-500">Por 100g + Frete</div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                            product.inStock
                              ? isInCart(product.id)
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-900 text-white hover:bg-rose-600 transform hover:-translate-y-0.5'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {!product.inStock ? 'Indisponível' :
                           isInCart(product.id) ? 'No Carrinho ✓' : 'Adicionar ao Carrinho'}
                        </button>

                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-rose-600 hover:text-rose-600 transition-colors text-sm"
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-light text-gray-900 mb-2">
                      {selectedProduct.name}
                    </h2>
                    <div className="text-sm text-rose-600 font-medium">
                      {typeNames[selectedProduct.type]} • {selectedProduct.origin}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-400 hover:text-gray-600 text-3xl font-light"
                  >
                    ×
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative h-96 rounded-lg overflow-hidden">
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Especificações</h3>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between py-2 border-b">
                          <span>Comprimento:</span>
                          <span className="font-medium">{selectedProduct.length} cm</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span>Peso:</span>
                          <span className="font-medium">{selectedProduct.weight} gramas</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span>Textura:</span>
                          <span className="font-medium">{typeNames[selectedProduct.type]}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span>Cor:</span>
                          <span className="font-medium">{selectedProduct.color.charAt(0).toUpperCase() + selectedProduct.color.slice(1)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span>Origem:</span>
                          <span className="font-medium">{selectedProduct.origin}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span>Disponibilidade:</span>
                          <span className={`font-medium ${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedProduct.inStock ? 'Em estoque' : 'Indisponível'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Avaliações</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-lg">
                              {i < Math.floor(selectedProduct.rating) ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-600">
                          {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviews} avaliações)
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <div className="mb-6">
                        <div className="text-4xl font-light text-rose-600 mb-2">
                          {formatPrice(selectedProduct.price)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Por 100g + Frete para toda Europa
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                          setSelectedProduct(null);
                        }}
                        disabled={!selectedProduct.inStock}
                        className={`w-full py-4 rounded-lg font-medium text-lg transition-all ${
                          selectedProduct.inStock
                            ? 'bg-rose-600 text-white hover:bg-rose-700'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {selectedProduct.inStock ? 'Adicionar ao Carrinho' : 'Produto Indisponível'}
                      </button>

                      <div className="text-xs text-gray-500 text-center space-y-1 mt-4">
                        <p>• Entrega em 5-10 dias úteis para toda Europa</p>
                        <p>• Frete grátis para pedidos acima de €500</p>
                        <p>• Garantia de qualidade de 30 dias</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}