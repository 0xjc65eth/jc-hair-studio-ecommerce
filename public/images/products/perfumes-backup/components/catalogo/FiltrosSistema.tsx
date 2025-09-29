'use client';

import { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp,
  Heart,
  BarChart3,
  Star,
  Eye,
  Shuffle,
  SlidersHorizontal
} from 'lucide-react';
import { ProductFilters, HairTypeFilter } from '../../types/product';

interface FiltrosSistemaProps {
  onFiltersChange: (filters: ProductFilters) => void;
  onSortChange: (sort: string) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleComparison: (productId: string) => void;
  wishlistIds: string[];
  comparisonIds: string[];
  totalProducts: number;
  isLoading?: boolean;
}

interface FilterSection {
  id: string;
  title: string;
  isOpen: boolean;
}

const CATEGORIES = [
  { value: 'progressivas', label: 'Progressivas' },
  { value: 'tratamentos', label: 'Tratamentos' },
  { value: 'shampoos', label: 'Shampoos' },
  { value: 'maquiagem', label: 'Maquiagem' },
  { value: 'corpo', label: 'Corpo' }
];

const BRANDS = [
  { value: 'cadiveu', label: 'Cadiveu', country: 'BR' },
  { value: 'natura', label: 'Natura', country: 'BR' },
  { value: 'karseell', label: 'Karseell', country: 'BR' },
  { value: 'bio-extratus', label: 'Bio Extratus', country: 'BR' },
  { value: 'risque', label: 'Risqué', country: 'BR' },
  { value: 'o-boticario', label: 'O Boticário', country: 'BR' },
  { value: 'forever-liss', label: 'Forever Liss', country: 'BR' },
  { value: 'mari-maria', label: 'Mari Maria', country: 'BR' }
];

const PRICE_RANGES = [
  { value: '10-30', label: '€10 - €30' },
  { value: '30-50', label: '€30 - €50' },
  { value: '50-100', label: '€50 - €100' },
  { value: '100+', label: '€100+' }
];

const HAIR_TYPES: { value: HairTypeFilter; label: string }[] = [
  { value: 'LISO', label: 'Liso' },
  { value: 'ONDULADO', label: 'Ondulado' },
  { value: 'CACHEADO', label: 'Cacheado' },
  { value: 'TODOS', label: 'Todos' }
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Novidades', icon: Star },
  { value: 'price-low-high', label: 'Preço: Menor → Maior', icon: BarChart3 },
  { value: 'price-high-low', label: 'Preço: Maior → Menor', icon: BarChart3 },
  { value: 'popularity', label: 'Popularidade', icon: Eye },
  { value: 'rating-high', label: 'Melhor Avaliado', icon: Star }
];

export default function FiltrosSistema({
  onFiltersChange,
  onSortChange,
  onToggleWishlist,
  onToggleComparison,
  wishlistIds,
  comparisonIds,
  totalProducts,
  isLoading = false
}: FiltrosSistemaProps) {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    search: true,
    categories: true,
    brands: true,
    price: true,
    hairType: true
  });

  // Mobile filter panel
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Debounced search
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        const newFilters = { ...filters, search: searchTerm || undefined };
        setFilters(newFilters);
        onFiltersChange(newFilters);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, filters, onFiltersChange]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const updateFilters = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryChange = (categoryValue: string) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(categoryValue)
      ? currentCategories.filter(c => c !== categoryValue)
      : [...currentCategories, categoryValue];
    
    updateFilters('category', newCategories.length ? newCategories : undefined);
  };

  const handleBrandChange = (brandValue: string) => {
    const currentBrands = filters.brand || [];
    const newBrands = currentBrands.includes(brandValue)
      ? currentBrands.filter(b => b !== brandValue)
      : [...currentBrands, brandValue];
    
    updateFilters('brand', newBrands.length ? newBrands : undefined);
  };

  const handlePriceRangeChange = (range: string) => {
    updateFilters('priceRange', filters.priceRange === range ? undefined : range);
  };

  const handleHairTypeChange = (hairType: string) => {
    const currentTypes = filters.hairType || [];
    const newTypes = currentTypes.includes(hairType as any)
      ? currentTypes.filter(h => h !== hairType)
      : [...currentTypes, hairType as any];
    
    updateFilters('hairType', newTypes.length ? newTypes : undefined);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    onSortChange(newSort);
  };

  const clearAllFilters = () => {
    const clearedFilters = {};
    setFilters(clearedFilters);
    setSearchTerm('');
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category?.length) count += filters.category.length;
    if (filters.brand?.length) count += filters.brand.length;
    if (filters.priceRange) count += 1;
    if (filters.hairType?.length) count += filters.hairType.length;
    if (filters.search) count += 1;
    return count;
  };

  const FilterSection = ({ 
    id, 
    title, 
    children, 
    count 
  }: { 
    id: string; 
    title: string; 
    children: React.ReactNode;
    count?: number;
  }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between py-4 px-6 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{title}</span>
          {count && count > 0 && (
            <span className="bg-[#8B4513] text-white text-xs px-2 py-1 rounded-full">
              {count}
            </span>
          )}
        </div>
        {openSections[id] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      {openSections[id] && (
        <div className="px-6 pb-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filtros</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-[#8B4513] text-white text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Filters Sidebar */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#8B4513]" />
              <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
            </div>
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-[#8B4513] hover:text-[#6B3410] transition-colors"
              >
                Limpar Todos
              </button>
            )}
          </div>

          {/* Search */}
          <FilterSection id="search" title="Busca Inteligente">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busque por nome ou marca..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] transition-colors"
              />
            </div>
          </FilterSection>

          {/* Categories */}
          <FilterSection 
            id="categories" 
            title="Categoria" 
            count={filters.category?.length}
          >
            <div className="space-y-3">
              {CATEGORIES.map((category) => (
                <label key={category.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.category?.includes(category.value) || false}
                    onChange={() => handleCategoryChange(category.value)}
                    className="w-4 h-4 text-[#8B4513] border-gray-300 rounded focus:ring-[#8B4513]/20"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                    {category.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Brands */}
          <FilterSection 
            id="brands" 
            title="Marca" 
            count={filters.brand?.length}
          >
            <div className="space-y-3">
              {BRANDS.map((brand) => (
                <label key={brand.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.brand?.includes(brand.value) || false}
                    onChange={() => handleBrandChange(brand.value)}
                    className="w-4 h-4 text-[#8B4513] border-gray-300 rounded focus:ring-[#8B4513]/20"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                      {brand.label}
                    </span>
                    <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                      {brand.country}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection 
            id="price" 
            title="Preço" 
            count={filters.priceRange ? 1 : 0}
          >
            <div className="space-y-3">
              {PRICE_RANGES.map((range) => (
                <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === range.value}
                    onChange={() => handlePriceRangeChange(range.value)}
                    className="w-4 h-4 text-[#8B4513] border-gray-300 focus:ring-[#8B4513]/20"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Hair Type */}
          <FilterSection 
            id="hairType" 
            title="Tipo de Cabelo" 
            count={filters.hairType?.length}
          >
            <div className="space-y-3">
              {HAIR_TYPES.map((type) => (
                <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hairType?.includes(type.value as any) || false}
                    onChange={() => handleHairTypeChange(type.value)}
                    className="w-4 h-4 text-[#8B4513] border-gray-300 rounded focus:ring-[#8B4513]/20"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Results Counter */}
          <div className="p-6 bg-gray-50 rounded-b-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#8B4513] mb-1">
                {isLoading ? '...' : totalProducts}
              </div>
              <div className="text-sm text-gray-600">
                {totalProducts === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
          <div className="bg-white h-full w-full overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">Filtros</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Same filter content as desktop */}
            <div className="p-4">
              {/* Search */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Busca Inteligente</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Busque por nome ou marca..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513]"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Categoria</h3>
                <div className="space-y-3">
                  {CATEGORIES.map((category) => (
                    <label key={category.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.category?.includes(category.value) || false}
                        onChange={() => handleCategoryChange(category.value)}
                        className="w-4 h-4 text-[#8B4513] border-gray-300 rounded focus:ring-[#8B4513]/20"
                      />
                      <span className="text-gray-700">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Other filters follow same pattern... */}
            </div>

            {/* Mobile Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpar
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex-1 py-3 px-4 bg-[#8B4513] text-white rounded-lg hover:bg-[#6B3410] transition-colors"
                >
                  Ver {totalProducts} Produtos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sort & View Options */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-200">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] bg-white"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Heart className="w-4 h-4" />
            <span>{wishlistIds.length}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Shuffle className="w-4 h-4" />
            <span>{comparisonIds.length}/3</span>
          </div>
        </div>
      </div>
    </>
  );
}