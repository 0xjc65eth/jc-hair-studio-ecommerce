'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  RotateCcw,
  Star,
  Palette,
  Ruler,
  DollarSign,
  Package
} from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  color?: string;
}

interface PriceRange {
  min: number;
  max: number;
}

interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'color' | 'rating';
  options?: FilterOption[];
  range?: PriceRange;
  icon?: React.ReactNode;
}

interface FilterSidebarProps {
  filters: FilterGroup[];
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  isMobile?: boolean;
}

export function FilterSidebar({ 
  filters, 
  isOpen = true, 
  onClose,
  className = '',
  isMobile = false 
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(filters.map(f => f.id))
  );
  const [localFilters, setLocalFilters] = useState<Record<string, any>>({});
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 1000 });
  
  // Initialize filters from URL
  useEffect(() => {
    const urlFilters: Record<string, any> = {};
    
    searchParams.forEach((value, key) => {
      if (key.startsWith('filter_')) {
        const filterKey = key.replace('filter_', '');
        try {
          urlFilters[filterKey] = JSON.parse(value);
        } catch {
          urlFilters[filterKey] = value;
        }
      }
    });
    
    setLocalFilters(urlFilters);
    
    // Set price range from URL
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    if (minPrice || maxPrice) {
      setPriceRange({
        min: minPrice ? parseInt(minPrice) : 0,
        max: maxPrice ? parseInt(maxPrice) : 1000,
      });
    }
  }, [searchParams]);
  
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };
  
  const updateFilter = (groupId: string, value: any, type: 'checkbox' | 'radio') => {
    setLocalFilters(prev => {
      const currentValues = prev[groupId] || (type === 'checkbox' ? [] : null);
      
      if (type === 'checkbox') {
        const valueArray = Array.isArray(currentValues) ? currentValues : [];
        const newValues = valueArray.includes(value)
          ? valueArray.filter(v => v !== value)
          : [...valueArray, value];
        
        return {
          ...prev,
          [groupId]: newValues.length > 0 ? newValues : undefined,
        };
      } else {
        return {
          ...prev,
          [groupId]: currentValues === value ? undefined : value,
        };
      }
    });
  };
  
  const updatePriceRange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };
  
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    // Clear existing filter params
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('filter_') || key === 'min_price' || key === 'max_price') {
        params.delete(key);
      }
    });
    
    // Add new filter params
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(`filter_${key}`, JSON.stringify(value));
      }
    });
    
    // Add price range
    if (priceRange.min > 0) {
      params.set('min_price', priceRange.min.toString());
    }
    if (priceRange.max < 1000) {
      params.set('max_price', priceRange.max.toString());
    }
    
    // Reset to first page when filters change
    params.delete('page');
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const clearFilters = () => {
    setLocalFilters({});
    setPriceRange({ min: 0, max: 1000 });
    
    const params = new URLSearchParams(searchParams);
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('filter_') || key === 'min_price' || key === 'max_price') {
        params.delete(key);
      }
    });
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const hasActiveFilters = () => {
    return Object.keys(localFilters).length > 0 || 
           priceRange.min > 0 || 
           priceRange.max < 1000;
  };
  
  const renderFilterGroup = (group: FilterGroup) => {
    const isExpanded = expandedGroups.has(group.id);
    const currentValue = localFilters[group.id];
    
    return (
      <div key={group.id} className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleGroup(group.id)}
          className="flex items-center justify-between w-full py-2 text-left"
        >
          <div className="flex items-center space-x-2">
            {group.icon}
            <span className="font-medium text-gray-900">{group.label}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-2">
                {group.type === 'range' && group.id === 'price' && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => updatePriceRange(
                          parseInt(e.target.value) || 0,
                          priceRange.max
                        )}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="Min"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => updatePriceRange(
                          priceRange.min,
                          parseInt(e.target.value) || 1000
                        )}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="Max"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange.min}
                        onChange={(e) => updatePriceRange(
                          parseInt(e.target.value),
                          priceRange.max
                        )}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange.max}
                        onChange={(e) => updatePriceRange(
                          priceRange.min,
                          parseInt(e.target.value)
                        )}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatCurrency(priceRange.min)}</span>
                      <span>{formatCurrency(priceRange.max)}</span>
                    </div>
                  </div>
                )}
                
                {group.type === 'rating' && group.options && (
                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const rating = parseInt(option.id);
                      const isChecked = currentValue === option.id;
                      
                      return (
                        <label
                          key={option.id}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                        >
                          <input
                            type="radio"
                            checked={isChecked}
                            onChange={() => updateFilter(group.id, option.id, 'radio')}
                            className="sr-only"
                          />
                          <div className={`flex items-center space-x-1 ${
                            isChecked ? 'text-yellow-500' : 'text-gray-300'
                          }`}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < rating ? 'fill-current' : ''
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-700">
                            {rating === 5 ? '5 estrelas' : `${rating}+ estrelas`}
                          </span>
                          {option.count && (
                            <span className="text-xs text-gray-500">
                              ({option.count})
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
                
                {group.type === 'color' && group.options && (
                  <div className="grid grid-cols-6 gap-2">
                    {group.options.map((option) => {
                      const isChecked = Array.isArray(currentValue) 
                        ? currentValue.includes(option.id)
                        : false;
                      
                      return (
                        <button
                          key={option.id}
                          onClick={() => updateFilter(group.id, option.id, 'checkbox')}
                          className={`w-8 h-8 rounded-full border-2 relative ${
                            isChecked ? 'border-gray-900' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: option.color }}
                          title={option.label}
                        >
                          {isChecked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {(group.type === 'checkbox' || group.type === 'radio') && 
                 group.type !== 'rating' && 
                 group.type !== 'color' && 
                 group.options && (
                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const isChecked = group.type === 'checkbox'
                        ? Array.isArray(currentValue) && currentValue.includes(option.id)
                        : currentValue === option.id;
                      
                      return (
                        <label
                          key={option.id}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                        >
                          <input
                            type={group.type}
                            checked={isChecked}
                            onChange={() => updateFilter(group.id, option.id, group.type)}
                            className="rounded border-gray-300 text-black focus:ring-black"
                          />
                          <span className="text-sm text-gray-700">
                            {option.label}
                          </span>
                          {option.count && (
                            <span className="text-xs text-gray-500">
                              ({option.count})
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5" />
          <h3 className="font-semibold text-gray-900">Filtros</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
              title="Limpar filtros"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Limpar</span>
            </button>
          )}
          
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Filter Groups */}
      <div className="space-y-4">
        {filters.map(renderFilterGroup)}
      </div>
      
      {/* Apply Filters Button */}
      <div className="sticky bottom-0 bg-white pt-4 border-t">
        <button
          onClick={applyFilters}
          className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 
                   transition-colors font-medium"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
  
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto"
            >
              <div className="p-6">
                {sidebarContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
  
  // Desktop Sidebar
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {sidebarContent}
    </div>
  );
}

// Default filter configurations
export const defaultFilters: FilterGroup[] = [
  {
    id: 'price',
    label: 'Preço',
    type: 'range',
    range: { min: 0, max: 1000 },
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    id: 'category',
    label: 'Categoria',
    type: 'checkbox',
    icon: <Package className="w-4 h-4" />,
    options: [
      { id: 'mega-hair', label: 'Mega Hair', count: 45 },
      { id: 'extensoes-clip', label: 'Extensões Clip', count: 32 },
      { id: 'franjas', label: 'Franjas', count: 18 },
      { id: 'acessorios', label: 'Acessórios', count: 24 },
      { id: 'produtos-cuidado', label: 'Produtos de Cuidado', count: 15 },
    ],
  },
  {
    id: 'color',
    label: 'Cor',
    type: 'color',
    icon: <Palette className="w-4 h-4" />,
    options: [
      { id: 'black', label: 'Preto', color: '#000000', count: 28 },
      { id: 'brown', label: 'Castanho', color: '#8B4513', count: 35 },
      { id: 'blonde', label: 'Loiro', color: '#FFD700', count: 42 },
      { id: 'red', label: 'Ruivo', color: '#DC143C', count: 15 },
      { id: 'gray', label: 'Grisalho', color: '#808080', count: 8 },
      { id: 'white', label: 'Branco', color: '#FFFFFF', count: 5 },
    ],
  },
  {
    id: 'length',
    label: 'Comprimento',
    type: 'checkbox',
    icon: <Ruler className="w-4 h-4" />,
    options: [
      { id: '30cm', label: '30cm', count: 25 },
      { id: '40cm', label: '40cm', count: 38 },
      { id: '50cm', label: '50cm', count: 45 },
      { id: '60cm', label: '60cm', count: 32 },
      { id: '70cm', label: '70cm', count: 18 },
    ],
  },
  {
    id: 'rating',
    label: 'Avaliação',
    type: 'rating',
    icon: <Star className="w-4 h-4" />,
    options: [
      { id: '5', label: '5 estrelas', count: 45 },
      { id: '4', label: '4+ estrelas', count: 78 },
      { id: '3', label: '3+ estrelas', count: 95 },
      { id: '2', label: '2+ estrelas', count: 102 },
      { id: '1', label: '1+ estrelas', count: 108 },
    ],
  },
  {
    id: 'brand',
    label: 'Marca',
    type: 'checkbox',
    options: [
      { id: 'jc-hair', label: 'JC Hair Studio', count: 89 },
      { id: 'premium-line', label: 'Premium Line', count: 34 },
      { id: 'natural-beauty', label: 'Natural Beauty', count: 28 },
      { id: 'luxury-hair', label: 'Luxury Hair', count: 15 },
    ],
  },
  {
    id: 'availability',
    label: 'Disponibilidade',
    type: 'checkbox',
    options: [
      { id: 'in-stock', label: 'Em estoque', count: 156 },
      { id: 'on-sale', label: 'Em promoção', count: 23 },
      { id: 'new-arrival', label: 'Novidade', count: 12 },
    ],
  },
];