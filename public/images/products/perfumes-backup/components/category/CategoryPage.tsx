'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ArrowUpDown, Grid, List } from 'lucide-react';
import { Category, Product, priceRanges, sortOptions } from '@/lib/data/categories';
import CategoryFilters from './CategoryFilters';
import ProductGrid from './ProductGrid';
import Pagination, { usePagination, ItemsPerPageSelector } from './Pagination';

interface FilterState {
  brands: string[];
  priceRange: string | null;
  minRating: number;
  sortBy: string;
  availability: string[];
}

interface CategoryPageProps {
  category: Category;
  className?: string;
}

export default function CategoryPage({ category, className = '' }: CategoryPageProps) {
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    priceRange: null,
    minRating: 0,
    sortBy: 'popularity',
    availability: ['in_stock']
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar produtos baseado nos filtros aplicados
  const filteredProducts = useMemo(() => {
    let filtered = [...category.products];

    // Filtro por marca
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => filters.brands.includes(product.brand));
    }

    // Filtro por faixa de preço
    if (filters.priceRange) {
      const range = priceRanges.find(r => r.id === filters.priceRange);
      if (range) {
        filtered = filtered.filter(product =>
          product.price >= range.min &&
          (range.max === Infinity ? true : product.price <= range.max)
        );
      }
    }

    // Filtro por avaliação mínima
    if (filters.minRating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.minRating);
    }

    // Filtro por disponibilidade
    if (filters.availability.length > 0) {
      filtered = filtered.filter(product => filters.availability.includes(product.availability));
    }

    return filtered;
  }, [category.products, filters]);

  // Ordenar produtos
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (filters.sortBy) {
      case 'popularity':
        return sorted.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return b.reviewCount - a.reviewCount;
        });
      
      case 'newest':
        return sorted.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
      
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
      default:
        return sorted;
    }
  }, [filteredProducts, filters.sortBy]);

  // Configuração da paginação
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
    handleItemsPerPageChange
  } = usePagination(sortedProducts.length, 12);

  // Produtos da página atual
  const currentPageProducts = sortedProducts.slice(startIndex, endIndex);

  // Simular loading quando filtros mudam
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header da Categoria */}
      <div className="bg-white border-b">
        <div className="container-custom py-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
              {category.name}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar com Filtros */}
          <CategoryFilters
            onFilterChange={handleFilterChange}
            productCount={sortedProducts.length}
            isLoading={isLoading}
          />

          {/* Área Principal */}
          <div className="flex-1 min-w-0">
            {/* Barra de Controles */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Info e Controles da Esquerda */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="text-sm text-gray-600">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                    ) : (
                      `${sortedProducts.length} de ${category.productCount} produtos`
                    )}
                  </div>
                  
                  <ItemsPerPageSelector
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    options={[12, 24, 36]}
                  />
                </div>

                {/* Controles da Direita */}
                <div className="flex items-center gap-4">
                  {/* Ordenação - apenas desktop */}
                  <div className="hidden sm:flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                      className="border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      {sortOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Toggle de visualização */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-white text-black shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="Visualização em grade"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-white text-black shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="Visualização em lista"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de Produtos */}
            <div className="mb-8">
              <ProductGrid
                products={currentPageProducts}
                isLoading={isLoading}
                className={
                  viewMode === 'list' 
                    ? 'grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2' 
                    : ''
                }
              />
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={sortedProducts.length}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}

            {/* Informações Adicionais da Categoria */}
            <div className="mt-12 bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-light text-gray-900 mb-6">
                Sobre {category.name}
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Descubra nossa seleção exclusiva de {category.name.toLowerCase()}. 
                  Cada produto é cuidadosamente selecionado para garantir a mais alta 
                  qualidade e resultados excepcionais.
                </p>
                
                {/* Vantagens da categoria */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">✨ Qualidade Premium</h3>
                    <p className="text-sm text-gray-600">
                      Produtos selecionados das melhores marcas do mercado
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">🚚 Entrega Rápida</h3>
                    <p className="text-sm text-gray-600">
                      Receba seus produtos em até 48h em toda a Europa
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">🛡️ Garantia Total</h3>
                    <p className="text-sm text-gray-600">
                      Satisfação garantida ou seu dinheiro de volta
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">🎓 Suporte Especializado</h3>
                    <p className="text-sm text-gray-600">
                      Consultoria gratuita com nossos especialistas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}