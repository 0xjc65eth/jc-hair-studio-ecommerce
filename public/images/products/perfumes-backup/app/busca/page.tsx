'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, Grid, List, ChevronDown, X, Heart, ShoppingCart, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from '@/components/ui/SearchBar';
// import { ProductCard } from '@/components/products/ProductCard';
// import { FilterSidebar } from '@/components/ui/FilterSidebar';
import { categories } from '@/lib/data/categories';
import { staticProducts } from '@/lib/data/staticProducts';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  nome: string;
  preco: number;
  precoOriginal?: number;
  descricao?: string;
  categoria?: string;
  marca?: string;
  imagens: string[];
  cores?: string[];
  tamanhos?: string[];
  tags?: string[];
}

interface SearchFilters {
  categoria: string[];
  precoMin: number | null;
  precoMax: number | null;
  marca: string[];
  cores: string[];
  tamanhos: string[];
}

const SORT_OPTIONS = [
  { value: 'relevancia', label: 'Relevância' },
  { value: 'preco_menor', label: 'Menor preço' },
  { value: 'preco_maior', label: 'Maior preço' },
  { value: 'nome_az', label: 'A-Z' },
  { value: 'nome_za', label: 'Z-A' },
];

// Simple ProductCard component for search results
const SearchProductCard = ({ product, variant = 'vertical' }: { product: Product; variant?: 'vertical' | 'horizontal' }) => {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (variant === 'horizontal') {
    return (
      <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex p-4">
          {/* Image */}
          <div className="w-32 h-32 flex-shrink-0 mr-4">
            <img
              src={imageError ? '/placeholder-product.jpg' : (product.imagens[0] || '/placeholder-product.jpg')}
              alt={product.nome}
              className="w-full h-full object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {product.categoria && (
                  <p className="text-sm text-gray-500 mb-1">{product.categoria}</p>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.nome}
                </h3>
                {product.marca && (
                  <p className="text-sm text-gray-600 mb-2">{product.marca}</p>
                )}
                {product.descricao && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.descricao}</p>
                )}
              </div>

              <div className="text-right ml-4">
                <div className="flex flex-col items-end">
                  {product.precoOriginal && product.precoOriginal > product.preco && (
                    <span className="text-sm text-gray-500 line-through mb-1">
                      {formatPrice(product.precoOriginal)}
                    </span>
                  )}
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(product.preco)}
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300 group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <img
          src={imageError ? '/placeholder-product.jpg' : (product.imagens[0] || '/placeholder-product.jpg')}
          alt={product.nome}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
        />

        {/* Wishlist button */}
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-4 h-4" />
        </button>

        {/* Sale badge */}
        {product.precoOriginal && product.precoOriginal > product.preco && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            -{Math.round(((product.precoOriginal - product.preco) / product.precoOriginal) * 100)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {product.categoria && (
          <p className="text-sm text-gray-500 mb-1">{product.categoria}</p>
        )}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
          {product.nome}
        </h3>
        {product.marca && (
          <p className="text-sm text-gray-600 mb-2">{product.marca}</p>
        )}

        {/* Price */}
        <div className="flex flex-col mb-3">
          {product.precoOriginal && product.precoOriginal > product.preco && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.precoOriginal)}
            </span>
          )}
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.preco)}
          </span>
        </div>

        {/* Add to Cart */}
        <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm">
          <ShoppingCart className="w-4 h-4" />
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default function BuscaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [localQuery, setLocalQuery] = useState(query);
  const [sortBy, setSortBy] = useState('relevancia');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    categoria: [],
    precoMin: null,
    precoMax: null,
    marca: [],
    cores: [],
    tamanhos: []
  });

  // Collect all products from categories and static products
  const allProducts: Product[] = useMemo(() => {
    const products: Product[] = [];

    // Get products from categories
    categories.forEach(category => {
      if (category.produtos) {
        category.produtos.forEach(produto => {
          products.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            precoOriginal: produto.precoOriginal,
            descricao: produto.descricao,
            categoria: category.nome,
            marca: produto.marca,
            imagens: produto.imagens,
            cores: produto.cores,
            tamanhos: produto.tamanhos,
            tags: produto.tags
          });
        });
      }
    });

    // Get products from staticProducts
    if (staticProducts && Array.isArray(staticProducts)) {
      staticProducts.forEach(produto => {
        if (!products.find(p => p.id === produto.id)) {
          products.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            precoOriginal: produto.precoOriginal,
            descricao: produto.descricao,
            categoria: produto.categoria || 'Produtos',
            marca: produto.marca,
            imagens: produto.imagens,
            cores: produto.cores,
            tamanhos: produto.tamanhos,
            tags: produto.tags
          });
        }
      });
    }

    return products;
  }, []);

  // Search and filter products
  const searchResults = useMemo(() => {
    let results = allProducts;

    // Text search
    if (localQuery.trim()) {
      const searchTerm = localQuery.toLowerCase().trim();
      results = results.filter(product => {
        return (
          product.nome.toLowerCase().includes(searchTerm) ||
          product.descricao?.toLowerCase().includes(searchTerm) ||
          product.categoria?.toLowerCase().includes(searchTerm) ||
          product.marca?.toLowerCase().includes(searchTerm) ||
          product.cores?.some(cor => cor.toLowerCase().includes(searchTerm)) ||
          product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      });
    }

    // Apply filters
    if (filters.categoria.length > 0) {
      results = results.filter(product =>
        filters.categoria.includes(product.categoria || '')
      );
    }

    if (filters.marca.length > 0) {
      results = results.filter(product =>
        product.marca && filters.marca.includes(product.marca)
      );
    }

    if (filters.cores.length > 0) {
      results = results.filter(product =>
        product.cores?.some(cor => filters.cores.includes(cor))
      );
    }

    if (filters.tamanhos.length > 0) {
      results = results.filter(product =>
        product.tamanhos?.some(tamanho => filters.tamanhos.includes(tamanho))
      );
    }

    if (filters.precoMin !== null) {
      results = results.filter(product => product.preco >= filters.precoMin!);
    }

    if (filters.precoMax !== null) {
      results = results.filter(product => product.preco <= filters.precoMax!);
    }

    // Sort results
    switch (sortBy) {
      case 'preco_menor':
        results.sort((a, b) => a.preco - b.preco);
        break;
      case 'preco_maior':
        results.sort((a, b) => b.preco - a.preco);
        break;
      case 'nome_az':
        results.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'nome_za':
        results.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case 'relevancia':
      default:
        // Keep original order or add relevance logic
        if (localQuery.trim()) {
          results.sort((a, b) => {
            const aRelevance = a.nome.toLowerCase().includes(localQuery.toLowerCase()) ? 1 : 0;
            const bRelevance = b.nome.toLowerCase().includes(localQuery.toLowerCase()) ? 1 : 0;
            return bRelevance - aRelevance;
          });
        }
        break;
    }

    return results;
  }, [allProducts, localQuery, filters, sortBy]);

  // Get available filter options
  const filterOptions = useMemo(() => {
    const categorias = Array.from(new Set(allProducts.map(p => p.categoria).filter(Boolean)));
    const marcas = Array.from(new Set(allProducts.map(p => p.marca).filter(Boolean)));
    const cores = Array.from(new Set(allProducts.flatMap(p => p.cores || []).filter(Boolean)));
    const tamanhos = Array.from(new Set(allProducts.flatMap(p => p.tamanhos || []).filter(Boolean)));
    const precos = allProducts.map(p => p.preco);

    return {
      categorias: categorias.sort(),
      marcas: marcas.sort(),
      cores: cores.sort(),
      tamanhos: tamanhos.sort(),
      precoMin: Math.min(...precos),
      precoMax: Math.max(...precos)
    };
  }, [allProducts]);

  // Update URL when query changes
  useEffect(() => {
    if (localQuery !== query) {
      const newUrl = localQuery.trim()
        ? `/busca?q=${encodeURIComponent(localQuery.trim())}`
        : '/busca';

      router.replace(newUrl);
    }
  }, [localQuery, query, router]);

  const handleClearFilters = () => {
    setFilters({
      categoria: [],
      precoMin: null,
      precoMax: null,
      marca: [],
      cores: [],
      tamanhos: []
    });
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    Array.isArray(value) ? value.length > 0 : value !== null
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-2xl">
              <SearchBar
                placeholder="Buscar produtos..."
                onSearch={setLocalQuery}
                className="w-full"
              />
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filtros
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={cn(
            "w-80 flex-shrink-0",
            "lg:block",
            showFilters ? "block" : "hidden"
          )}>
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filtros</h3>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Limpar
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Categories */}
                {filterOptions.categorias.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Categoria</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {filterOptions.categorias.map(categoria => (
                        <label key={categoria} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.categoria.includes(categoria)}
                            onChange={(e) => {
                              setFilters(prev => ({
                                ...prev,
                                categoria: e.target.checked
                                  ? [...prev.categoria, categoria]
                                  : prev.categoria.filter(c => c !== categoria)
                              }));
                            }}
                            className="mr-2 rounded border-gray-300 text-black focus:ring-black"
                          />
                          <span className="text-sm text-gray-600">{categoria}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Preço</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      min={filterOptions.precoMin}
                      max={filterOptions.precoMax}
                      value={filters.precoMin || ''}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        precoMin: e.target.value ? Number(e.target.value) : null
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      min={filterOptions.precoMin}
                      max={filterOptions.precoMax}
                      value={filters.precoMax || ''}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        precoMax: e.target.value ? Number(e.target.value) : null
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>

                {/* Brands */}
                {filterOptions.marcas.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Marca</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {filterOptions.marcas.map(marca => (
                        <label key={marca} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.marca.includes(marca)}
                            onChange={(e) => {
                              setFilters(prev => ({
                                ...prev,
                                marca: e.target.checked
                                  ? [...prev.marca, marca]
                                  : prev.marca.filter(m => m !== marca)
                              }));
                            }}
                            className="mr-2 rounded border-gray-300 text-black focus:ring-black"
                          />
                          <span className="text-sm text-gray-600">{marca}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {localQuery ? `Resultados para "${localQuery}"` : 'Todos os produtos'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {searchResults.length} produto{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2',
                      viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600'
                    )}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2',
                      viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-gray-600'
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {searchResults.length > 0 ? (
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid'
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              )}>
                {searchResults.map(product => (
                  <SearchProductCard
                    key={product.id}
                    product={product}
                    variant={viewMode === 'list' ? 'horizontal' : 'vertical'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  {localQuery
                    ? `Não encontramos produtos para "${localQuery}". Tente outros termos de busca.`
                    : 'Tente ajustar os filtros para ver mais produtos.'
                  }
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}