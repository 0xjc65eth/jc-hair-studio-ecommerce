'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react';
import { allBrands, priceRanges, sortOptions } from '@/lib/data/categories';

interface FilterState {
  brands: string[];
  priceRange: string | null;
  minRating: number;
  sortBy: string;
  availability: string[];
}

interface CategoryFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  productCount: number;
  isLoading?: boolean;
}

export default function CategoryFilters({ 
  onFilterChange, 
  productCount, 
  isLoading = false 
}: CategoryFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    priceRange: null,
    minRating: 0,
    sortBy: 'popularity',
    availability: ['in_stock']
  });

  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    price: true,
    rating: true,
    availability: true
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBrandChange = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handlePriceRangeChange = (rangeId: string) => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange === rangeId ? null : rangeId
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating
    }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy
    }));
  };

  const handleAvailabilityChange = (availability: string) => {
    setFilters(prev => ({
      ...prev,
      availability: prev.availability.includes(availability)
        ? prev.availability.filter(a => a !== availability)
        : [...prev.availability, availability]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      brands: [],
      priceRange: null,
      minRating: 0,
      sortBy: 'popularity',
      availability: ['in_stock']
    });
  };

  const getActiveFilterCount = () => {
    return filters.brands.length + 
           (filters.priceRange ? 1 : 0) + 
           (filters.minRating > 0 ? 1 : 0) + 
           (filters.availability.length > 1 ? filters.availability.length - 1 : 0);
  };

  const renderStars = (rating: number, filled: number) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= filled ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-600 ml-2">{rating}+ estrelas</span>
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Ordenação */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">Ordenar por</h3>
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        >
          {sortOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Marcas */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('brands')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-medium text-gray-900">Marcas</h3>
          {expandedSections.brands ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {expandedSections.brands && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {allBrands.map(brand => (
              <label key={brand} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Faixa de Preço */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-medium text-gray-900">Preço</h3>
          {expandedSections.price ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {expandedSections.price && (
          <div className="space-y-2">
            {priceRanges.map(range => (
              <label key={range.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceRange === range.id}
                  onChange={() => handlePriceRangeChange(range.id)}
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Avaliação */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-medium text-gray-900">Avaliação</h3>
          {expandedSections.rating ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {expandedSections.rating && (
          <div className="space-y-3">
            {[4, 3, 2, 1].map(rating => (
              <label 
                key={rating} 
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                />
                {renderStars(rating, rating)}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Disponibilidade */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-medium text-gray-900">Disponibilidade</h3>
          {expandedSections.availability ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {expandedSections.availability && (
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.availability.includes('in_stock')}
                onChange={() => handleAvailabilityChange('in_stock')}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-sm text-gray-700">Em estoque</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.availability.includes('pre_order')}
                onChange={() => handleAvailabilityChange('pre_order')}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-sm text-gray-700">Pré-venda</span>
            </label>
          </div>
        )}
      </div>

      {/* Limpar Filtros */}
      {getActiveFilterCount() > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full btn-secondary text-sm py-2"
        >
          Limpar Filtros ({getActiveFilterCount()})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Versão Mobile */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center space-x-2 btn-secondary text-sm py-2 px-4"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-black text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
          
          <div className="text-sm text-gray-600">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
            ) : (
              `${productCount} produtos`
            )}
          </div>
        </div>

        {/* Modal Mobile */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileFilterOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Filtros</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <FilterContent />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Versão Desktop */}
      <div className="hidden lg:block w-80 bg-white p-6 h-fit sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Filtros</h2>
          <div className="text-sm text-gray-600">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
            ) : (
              `${productCount} produtos`
            )}
          </div>
        </div>
        <FilterContent />
      </div>
    </>
  );
}