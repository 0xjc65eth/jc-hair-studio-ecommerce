'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';

// Importar dados do catálogo consolidado
import catalogData from '../../lib/data/complete-product-catalog-consolidated.json';

interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  features: string[];
  stock: number;
  rating: number;
  reviews: number;
}

interface Category {
  name: string;
  icon: string;
  products: Product[];
}

interface FilterState {
  search: string;
  category: string;
  brand: string;
  priceRange: [number, number];
  rating: number;
  sortBy: string;
  inStock: boolean;
}

export default function AdvancedProductCatalog() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    brand: '',
    priceRange: [0, 200],
    rating: 0,
    sortBy: 'name',
    inStock: false
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Extrair todos os produtos de todas as categorias
  const allProducts = useMemo(() => {
    const products: (Product & { category: string })[] = [];

    Object.entries(catalogData.categories).forEach(([categoryKey, category]: [string, any]) => {
      category.products.forEach((product: Product) => {
        products.push({
          ...product,
          category: categoryKey
        });
      });
    });

    return products;
  }, []);

  // Extrair marcas únicas
  const uniqueBrands = useMemo(() => {
    const brands = new Set(allProducts.map(p => p.brand));
    return Array.from(brands).sort();
  }, [allProducts]);

  // Extrair categorias
  const categories = useMemo(() => {
    return Object.entries(catalogData.categories).map(([key, cat]: [string, any]) => ({
      key,
      name: cat.name,
      icon: cat.icon
    }));
  }, []);

  // Filtrar e ordenar produtos
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Filtro de busca
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !product.brand.toLowerCase().includes(filters.search.toLowerCase()) &&
          !product.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Filtro de categoria
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Filtro de marca
      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }

      // Filtro de preço
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Filtro de rating
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }

      // Filtro de estoque
      if (filters.inStock && product.stock === 0) {
        return false;
      }

      return true;
    });

    // Ordenação
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'newest':
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [allProducts, filters, selectedCategory]);

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      priceRange: [0, 200],
      rating: 0,
      sortBy: 'name',
      inStock: false
    });
    setSelectedCategory('');
  };

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  const ProductCard = ({ product }: { product: Product & { category: string } }) => {
    const discount = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    if (viewMode === 'list') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex gap-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
              {discount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`p-1 rounded-full ${favorites.has(product.id) ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <Heart className="w-4 h-4" fill={favorites.has(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-400">({product.reviews})</span>
                <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  <ShoppingCart className="w-4 h-4 inline mr-1" />
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative aspect-square">
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          <button
            onClick={() => toggleFavorite(product.id)}
            className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors ${
              favorites.has(product.id) ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <Heart className="w-4 h-4" fill={favorites.has(product.id) ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.brand}</p>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-400">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.stock > 0 ? 'Em estoque' : 'Esgotado'}
            </span>
          </div>

          <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg transition-colors">
            <ShoppingCart className="w-4 h-4 inline mr-1" />
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com busca e filtros */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Barra de busca */}
          <div className="flex gap-4 items-center mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar produtos, marcas ou categorias..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filtros
            </button>
          </div>

          {/* Categorias rápidas */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === '' ? 'bg-pink-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors flex items-center gap-2 ${
                  selectedCategory === category.key ? 'bg-pink-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Painel de filtros expansível */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Filtro por marca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Todas as marcas</option>
                  {uniqueBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por faixa de preço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço: €{filters.priceRange[0]} - €{filters.priceRange[1]}
                </label>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                    }))}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                    }))}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Filtro por rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating mínimo</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="0">Qualquer rating</option>
                  <option value="4">4+ estrelas</option>
                  <option value="4.5">4.5+ estrelas</option>
                  <option value="4.8">4.8+ estrelas</option>
                </select>
              </div>

              {/* Outros filtros */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Apenas em estoque</span>
                </label>
                <button
                  onClick={clearFilters}
                  className="text-sm text-pink-500 hover:text-pink-600"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra de controles */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredProducts.length} produtos encontrados
          </div>

          <div className="flex items-center gap-4">
            {/* Ordenação */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
            >
              <option value="name">Ordem alfabética</option>
              <option value="price-low">Menor preço</option>
              <option value="price-high">Maior preço</option>
              <option value="rating">Melhor avaliado</option>
              <option value="popularity">Mais popular</option>
              <option value="newest">Mais recentes</option>
            </select>

            {/* Modo de visualização */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'text-gray-500'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'text-gray-500'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de produtos */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}