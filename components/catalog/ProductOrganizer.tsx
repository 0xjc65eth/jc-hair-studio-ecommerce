'use client';

import React from 'react';
import { Grid, List, ChevronDown, ArrowUpDown, Eye, Star, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';

interface ProductOrganizerProps {
  filterStats: {
    totalProducts: number;
    filteredCount: number;
    currentPageStart: number;
    currentPageEnd: number;
    totalPages: number;
    currentPage: number;
    hasFilters: boolean;
  };
  viewMode: 'grid' | 'list';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  resultsPerPage: number;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortChange: (sortBy: string, sortOrder?: 'asc' | 'desc') => void;
  onResultsPerPageChange: (count: number) => void;
  className?: string;
}

const ProductOrganizer: React.FC<ProductOrganizerProps> = ({
  filterStats,
  viewMode,
  sortBy,
  sortOrder,
  resultsPerPage,
  onViewModeChange,
  onSortChange,
  onResultsPerPageChange,
  className = ''
}) => {
  const sortOptions = [
    { value: 'name', label: 'Nome', icon: '🔤' },
    { value: 'price', label: 'Preço', icon: '💰' },
    { value: 'rating', label: 'Avaliação', icon: '⭐' },
    { value: 'newest', label: 'Mais Recentes', icon: '🆕' },
    { value: 'brand', label: 'Marca', icon: '🏷️' }
  ];

  const resultsPerPageOptions = [12, 24, 48, 96];

  const getSortIcon = (option: string) => {
    if (sortBy !== option) return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortOrder === 'asc' ?
      <ArrowUpDown size={14} className="text-pink-600 rotate-180" /> :
      <ArrowUpDown size={14} className="text-pink-600" />;
  };

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? `${option.icon} ${option.label}` : 'Ordenar';
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Results Summary */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="font-medium">
              {filterStats.hasFilters ? (
                <>
                  Mostrando {filterStats.currentPageStart}-{filterStats.currentPageEnd} de{' '}
                  <span className="text-pink-600 font-semibold">{filterStats.filteredCount}</span> produtos
                  <span className="text-gray-400 ml-1">
                    (filtrados de {filterStats.totalProducts} total)
                  </span>
                </>
              ) : (
                <>
                  Mostrando {filterStats.currentPageStart}-{filterStats.currentPageEnd} de{' '}
                  <span className="text-pink-600 font-semibold">{filterStats.totalProducts}</span> produtos
                </>
              )}
            </span>

            {filterStats.hasFilters && (
              <div className="flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                <Eye size={12} />
                Filtros ativos
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs">
            <TrendingUp size={12} />
            Página {filterStats.currentPage} de {filterStats.totalPages}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Side - View Mode */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Visualização:</span>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Visualização em grade"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Visualização em lista"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Right Side - Sort and Results per page */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Results per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Mostrar:</span>
              <select
                value={resultsPerPage}
                onChange={(e) => onResultsPerPageChange(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                {resultsPerPageOptions.map(count => (
                  <option key={count} value={count}>
                    {count} produtos
                  </option>
                ))}
              </select>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [string, 'asc' | 'desc'];
                  onSortChange(newSortBy, newSortOrder);
                }}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 min-w-[180px]"
              >
                <optgroup label="Ordenar por:">
                  {sortOptions.map(option => (
                    <React.Fragment key={option.value}>
                      <option value={`${option.value}-asc`}>
                        {option.icon} {option.label} (A-Z)
                      </option>
                      <option value={`${option.value}-desc`}>
                        {option.icon} {option.label} (Z-A)
                      </option>
                    </React.Fragment>
                  ))}
                </optgroup>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Quick Sort Buttons (Mobile friendly) */}
        <div className="mt-4 lg:hidden">
          <div className="flex flex-wrap gap-2">
            {sortOptions.slice(0, 3).map(option => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => onSortChange(option.value)}
                className="text-xs"
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
                {sortBy === option.value && getSortIcon(option.value)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      {filterStats.filteredCount > 0 && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Sistema otimizado
            </div>
            <div className="flex items-center gap-1">
              <Star size={12} />
              {filterStats.filteredCount} resultados encontrados
            </div>
            {filterStats.hasFilters && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Filtros aplicados
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductOrganizer;