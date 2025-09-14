'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, ChevronDown, Star, Loader2, RotateCcw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterState {
  search: string;
  category: string[];
  brand: string[];
  priceRange: string[];
  rating: number[];
  condition: string[];
  availability: string[];
}

interface Product {
  id: string;
  nome: string;
  marca: string;
  categoria: string;
  subcategoria: string;
  preco_eur: number;
  preco_brl: number;
  badge?: string;
  estoque: boolean;
  rating?: number;
}

interface AdvancedFiltersProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

const PRICE_RANGES = [
  { label: 'Até €50', value: '0-50', min: 0, max: 50 },
  { label: '€50 - €100', value: '50-100', min: 50, max: 100 },
  { label: '€100 - €200', value: '100-200', min: 100, max: 200 },
  { label: '€200+', value: '200+', min: 200, max: Infinity }
];

const CONDITIONS = [
  { label: 'Novo', value: 'NOVO' },
  { label: 'Promoção', value: 'PROMOÇÃO' },
  { label: 'Destaque', value: 'BEST SELLER' },
  { label: 'Premium', value: 'PREMIUM' },
  { label: 'Exclusivo', value: 'EXCLUSIVO' }
];

const AVAILABILITY = [
  { label: 'Em estoque', value: 'in_stock' },
  { label: 'Pré-venda', value: 'pre_order' }
];

export default function AdvancedFilters({ products, onFilterChange, onLoadingChange }: AdvancedFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: [],
    brand: [],
    priceRange: [],
    rating: [],
    condition: [],
    availability: []
  });

  const [isOpen, setIsOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Extrair categorias, marcas e subcategorias únicas
  const categories = Array.from(new Set([
    ...products.map(p => p.categoria),
    ...products.map(p => p.subcategoria)
  ])).filter(Boolean).sort();

  const brands = Array.from(new Set(products.map(p => p.marca))).sort();

  // Carregar filtros da URL
  useEffect(() => {
    const urlFilters: FilterState = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category')?.split(',').filter(Boolean) || [],
      brand: searchParams.get('brand')?.split(',').filter(Boolean) || [],
      priceRange: searchParams.get('price')?.split(',').filter(Boolean) || [],
      rating: searchParams.get('rating')?.split(',').map(Number).filter(Boolean) || [],
      condition: searchParams.get('condition')?.split(',').filter(Boolean) || [],
      availability: searchParams.get('availability')?.split(',').filter(Boolean) || []
    };
    
    setFilters(urlFilters);
  }, [searchParams]);

  // Atualizar URL quando filtros mudarem
  const updateURL = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();
    
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.category.length) params.set('category', newFilters.category.join(','));
    if (newFilters.brand.length) params.set('brand', newFilters.brand.join(','));
    if (newFilters.priceRange.length) params.set('price', newFilters.priceRange.join(','));
    if (newFilters.rating.length) params.set('rating', newFilters.rating.join(','));
    if (newFilters.condition.length) params.set('condition', newFilters.condition.join(','));
    if (newFilters.availability.length) params.set('availability', newFilters.availability.join(','));

    const url = params.toString() ? `?${params.toString()}` : '';
    router.replace(url, { scroll: false });
  }, [router]);

  // Filtrar produtos
  const filterProducts = useCallback(async (currentFilters: FilterState) => {
    onLoadingChange(true);
    
    // Simular delay de loading para UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filtered = products.filter(product => {
      // Filtro de busca
      if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        const searchMatch = 
          product.nome.toLowerCase().includes(searchTerm) ||
          product.marca.toLowerCase().includes(searchTerm) ||
          product.categoria.toLowerCase().includes(searchTerm) ||
          product.subcategoria.toLowerCase().includes(searchTerm);
        
        if (!searchMatch) return false;
      }

      // Filtro de categoria
      if (currentFilters.category.length > 0) {
        const categoryMatch = currentFilters.category.some(cat => 
          product.categoria === cat || product.subcategoria === cat
        );
        if (!categoryMatch) return false;
      }

      // Filtro de marca
      if (currentFilters.brand.length > 0) {
        if (!currentFilters.brand.includes(product.marca)) return false;
      }

      // Filtro de preço
      if (currentFilters.priceRange.length > 0) {
        const priceMatch = currentFilters.priceRange.some(range => {
          const priceRangeObj = PRICE_RANGES.find(pr => pr.value === range);
          if (!priceRangeObj) return false;
          return product.preco_eur >= priceRangeObj.min && product.preco_eur <= priceRangeObj.max;
        });
        if (!priceMatch) return false;
      }

      // Filtro de avaliação
      if (currentFilters.rating.length > 0) {
        const productRating = product.rating || 4; // Rating padrão se não especificado
        const ratingMatch = currentFilters.rating.some(rating => productRating >= rating);
        if (!ratingMatch) return false;
      }

      // Filtro de condição
      if (currentFilters.condition.length > 0) {
        if (!product.badge || !currentFilters.condition.includes(product.badge)) return false;
      }

      // Filtro de disponibilidade
      if (currentFilters.availability.length > 0) {
        const inStock = product.estoque;
        const availabilityMatch = currentFilters.availability.some(avail => {
          if (avail === 'in_stock') return inStock;
          if (avail === 'pre_order') return !inStock;
          return true;
        });
        if (!availabilityMatch) return false;
      }

      return true;
    });

    onFilterChange(filtered);
    onLoadingChange(false);
  }, [products, onFilterChange, onLoadingChange]);

  // Aplicar filtros
  useEffect(() => {
    filterProducts(filters);
    updateURL(filters);
    
    // Contar filtros ativos
    const activeCount = 
      (filters.search ? 1 : 0) +
      filters.category.length +
      filters.brand.length +
      filters.priceRange.length +
      filters.rating.length +
      filters.condition.length +
      filters.availability.length;
    
    setActiveFilters(activeCount);
  }, [filters, filterProducts, updateURL]);

  // Autocomplete para busca
  useEffect(() => {
    if (filters.search.length >= 2) {
      const suggestions = Array.from(new Set([
        ...products.filter(p => 
          p.nome.toLowerCase().includes(filters.search.toLowerCase())
        ).map(p => p.nome),
        ...products.filter(p => 
          p.marca.toLowerCase().includes(filters.search.toLowerCase())
        ).map(p => p.marca),
      ])).slice(0, 5);
      
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [filters.search, products]);

  const toggleFilter = (type: keyof FilterState, value: string | number) => {
    setFilters(prev => {
      const currentArray = prev[type] as (string | number)[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return { ...prev, [type]: newArray };
    });
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      search: '',
      category: [],
      brand: [],
      priceRange: [],
      rating: [],
      condition: [],
      availability: []
    };
    setFilters(emptyFilters);
  };

  const removeFilter = (type: keyof FilterState, value?: string | number) => {
    if (type === 'search') {
      setFilters(prev => ({ ...prev, search: '' }));
    } else if (value !== undefined) {
      setFilters(prev => ({
        ...prev,
        [type]: (prev[type] as (string | number)[]).filter(item => item !== value)
      }));
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Header do filtro */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-semibold text-gray-900">Filtros Avançados</h2>
            {activeFilters > 0 && (
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                {activeFilters} {activeFilters === 1 ? 'filtro' : 'filtros'} ativo{activeFilters !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {activeFilters > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm font-medium">Limpar Tudo</span>
              </button>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium">Filtros</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Busca com autocomplete */}
        <div className="mt-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar produtos, marcas ou categorias..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
            {filters.search && (
              <button
                onClick={() => removeFilter('search')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Sugestões de autocomplete */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, search: suggestion }));
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-900">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filtros ativos */}
      {activeFilters > 0 && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                Busca: "{filters.search}"
                <button
                  onClick={() => removeFilter('search')}
                  className="ml-2 text-amber-600 hover:text-amber-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filters.category.map(cat => (
              <span key={cat} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {cat}
                <button
                  onClick={() => removeFilter('category', cat)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            {filters.brand.map(brand => (
              <span key={brand} className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {brand}
                <button
                  onClick={() => removeFilter('brand', brand)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            {filters.priceRange.map(range => (
              <span key={range} className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                {PRICE_RANGES.find(pr => pr.value === range)?.label}
                <button
                  onClick={() => removeFilter('priceRange', range)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            {filters.rating.map(rating => (
              <span key={rating} className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                {rating}+ ⭐
                <button
                  onClick={() => removeFilter('rating', rating)}
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            {filters.condition.map(condition => (
              <span key={condition} className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                {condition}
                <button
                  onClick={() => removeFilter('condition', condition)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            {filters.availability.map(avail => (
              <span key={avail} className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                {AVAILABILITY.find(a => a.value === avail)?.label}
                <button
                  onClick={() => removeFilter('availability', avail)}
                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Painel de filtros */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block transition-all duration-300`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 p-6">
          
          {/* Categorias */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Categorias
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map(category => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.category.includes(category)}
                    onChange={() => toggleFilter('category', category)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Marcas */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Marcas
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map(brand => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.brand.includes(brand)}
                    onChange={() => toggleFilter('brand', brand)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 transition-colors"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-green-600 transition-colors">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Preço e Avaliação */}
          <div className="space-y-6">
            {/* Preço */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                Faixa de Preço
              </h3>
              <div className="space-y-2">
                {PRICE_RANGES.map(range => (
                  <label key={range.value} className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.priceRange.includes(range.value)}
                      onChange={() => toggleFilter('priceRange', range.value)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 transition-colors"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Avaliação */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                Avaliação
              </h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.rating.includes(rating)}
                      onChange={() => toggleFilter('rating', rating)}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 transition-colors"
                    />
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm text-gray-700 group-hover:text-yellow-600 transition-colors">
                        {rating}+ estrelas
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Condição e Disponibilidade */}
          <div className="space-y-6">
            {/* Condição */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Condição
              </h3>
              <div className="space-y-2">
                {CONDITIONS.map(condition => (
                  <label key={condition.value} className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.condition.includes(condition.value)}
                      onChange={() => toggleFilter('condition', condition.value)}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 transition-colors"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-red-600 transition-colors">
                      {condition.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                Disponibilidade
              </h3>
              <div className="space-y-2">
                {AVAILABILITY.map(avail => (
                  <label key={avail.value} className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.availability.includes(avail.value)}
                      onChange={() => toggleFilter('availability', avail.value)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-colors"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                      {avail.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}