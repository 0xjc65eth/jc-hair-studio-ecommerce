'use client';

import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp, X, Search } from 'lucide-react';
import { Button } from '../ui/Button';

interface FilterOptions {
  categories: {
    [key: string]: Array<{ key: string; name: string; count: number }>;
  };
  filters: {
    brands: string[];
    treatments: string[];
    hairTypes: string[];
    formulas: string[];
    priceRanges: Array<{ min: number; max: number; label: string }>;
  };
}

interface ProfessionalFiltersProps {
  filterOptions: FilterOptions;
  onFiltersChange?: (filters: any) => void;
  className?: string;
}

const ProfessionalFilters: React.FC<ProfessionalFiltersProps> = ({
  filterOptions,
  onFiltersChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({
    category: '',
    categoryType: '',
    brands: [],
    treatments: [],
    hairTypes: [],
    formulas: [],
    priceRange: null,
    searchTerm: ''
  });

  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    categoryType: true,
    brands: false,
    treatments: false,
    hairTypes: false,
    formulas: false,
    priceRange: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filterType: string, value: any, isMultiple = false) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };

      if (isMultiple) {
        const currentValues = newFilters[filterType] || [];
        if (currentValues.includes(value)) {
          newFilters[filterType] = currentValues.filter(v => v !== value);
        } else {
          newFilters[filterType] = [...currentValues, value];
        }
      } else {
        // Para radio buttons, se clicar no mesmo, desmarcar
        if (newFilters[filterType] === value) {
          newFilters[filterType] = '';
        } else {
          newFilters[filterType] = value;
        }
      }

      return newFilters;
    });
  };

  useEffect(() => {
    if (onFiltersChange && typeof onFiltersChange === 'function') {
      onFiltersChange(activeFilters);
    }
  }, [activeFilters, onFiltersChange]);

  const clearAllFilters = () => {
    setActiveFilters({
      category: '',
      categoryType: '',
      brands: [],
      treatments: [],
      hairTypes: [],
      formulas: [],
      priceRange: null,
      searchTerm: ''
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.category) count++;
    if (activeFilters.categoryType) count++;
    count += activeFilters.brands.length;
    count += activeFilters.treatments.length;
    count += activeFilters.hairTypes.length;
    count += activeFilters.formulas.length;
    if (activeFilters.priceRange) count++;
    if (activeFilters.searchTerm) count++;
    return count;
  };

  const FilterSection = ({
    title,
    items,
    filterType,
    icon,
    isMultiple = true
  }: {
    title: string;
    items: any[];
    filterType: string;
    icon?: string;
    isMultiple?: boolean;
  }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900 hover:text-pink-600 transition-colors"
        onClick={() => toggleSection(filterType)}
      >
        <span className="flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </span>
        {expandedSections[filterType] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expandedSections[filterType] && (
        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
          {items.map((item, index) => {
            const value = typeof item === 'string' ? item : item.key || item.label;
            const label = typeof item === 'string' ? item : item.name || item.label;
            const count = typeof item === 'object' && item.count ? ` (${item.count})` : '';

            const isActive = isMultiple
              ? activeFilters[filterType]?.includes(value)
              : activeFilters[filterType] === value;

            return (
              <label
                key={index}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <input
                  type={isMultiple ? "checkbox" : "radio"}
                  name={filterType}
                  checked={isActive}
                  onChange={() => handleFilterChange(filterType, value, isMultiple)}
                  className="rounded text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700">
                  {label}{count}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className={`bg-white ${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Filter size={16} />
          Filtros {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
        </Button>
      </div>

      {/* Filter Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Filter size={18} />
              Filtros Avançados
            </h3>
            {getActiveFilterCount() > 0 && (
              <Button
                onClick={clearAllFilters}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-600"
              >
                <X size={14} />
                Limpar
              </Button>
            )}
          </div>

          <div className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={activeFilters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            {/* Category Type */}
            {(() => {
              console.log('🔍 Categories available:', Object.keys(filterOptions.categories));
              return (
                <FilterSection
                  title="Tipo de Produto"
                  items={Object.keys(filterOptions.categories)}
                  filterType="categoryType"
                  icon="🎯"
                  isMultiple={false}
                />
              );
            })()}

            {/* Specific Categories */}
            {activeFilters.categoryType && (
              <FilterSection
                title="Categorias"
                items={filterOptions.categories[activeFilters.categoryType] || []}
                filterType="category"
                icon="📂"
                isMultiple={false}
              />
            )}

            {/* Treatments */}
            <FilterSection
              title="Tratamentos"
              items={filterOptions.filters.treatments}
              filterType="treatments"
              icon="💅"
            />

            {/* Hair Types */}
            <FilterSection
              title="Tipo de Cabelo"
              items={filterOptions.filters.hairTypes}
              filterType="hairTypes"
              icon="💇"
            />

            {/* Formulas */}
            <FilterSection
              title="Fórmulas Especiais"
              items={filterOptions.filters.formulas}
              filterType="formulas"
              icon="🧪"
            />

            {/* Brands */}
            <FilterSection
              title="Marcas"
              items={filterOptions.filters.brands}
              filterType="brands"
              icon="🏷️"
            />

            {/* Price Range */}
            <FilterSection
              title="Faixa de Preço"
              items={filterOptions.filters.priceRanges}
              filterType="priceRange"
              icon="💰"
              isMultiple={false}
            />
          </div>

          {/* Active Filters Summary */}
          {getActiveFilterCount() > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {Object.entries(activeFilters).map(([key, value]) => {
                  if (!value || (Array.isArray(value) && value.length === 0)) return null;

                  if (Array.isArray(value)) {
                    return value.map((v, index) => (
                      <span
                        key={`${key}-${index}`}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full"
                      >
                        {v}
                        <button
                          onClick={() => handleFilterChange(key, v, true)}
                          className="hover:text-pink-600"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ));
                  } else if (typeof value === 'string' && value !== '') {
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full"
                      >
                        {value}
                        <button
                          onClick={() => handleFilterChange(key, '', false)}
                          className="hover:text-pink-600"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalFilters;