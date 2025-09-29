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
  SlidersHorizontal,
  Palette,
  Sparkles
} from 'lucide-react';

interface CosmeticFilters {
  search?: string;
  category?: string[];
  brand?: string[];
  priceRange?: string;
  color?: string[];
  skinType?: string[];
  productType?: string[];
  isNew?: boolean;
  featured?: boolean;
  hasDiscount?: boolean;
  inStock?: boolean;
  rating?: number;
}

interface CosmeticFiltersProps {
  onFiltersChange: (filters: CosmeticFilters) => void;
  onSortChange: (sort: string) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleComparison: (productId: string) => void;
  wishlistIds: string[];
  comparisonIds: string[];
  totalProducts: number;
  isLoading?: boolean;
}

const COSMETIC_CATEGORIES = [
  { value: 'maquiagem', label: 'Maquiagem' },
  { value: 'base', label: 'Base' },
  { value: 'corretivo', label: 'Corretivo' },
  { value: 'pó', label: 'Pó' },
  { value: 'blush', label: 'Blush' },
  { value: 'batom', label: 'Batom' },
  { value: 'gloss', label: 'Gloss' },
  { value: 'delineador', label: 'Delineador' },
  { value: 'máscara', label: 'Máscara' },
  { value: 'sombra', label: 'Sombra' },
  { value: 'primer', label: 'Primer' },
  { value: 'iluminador', label: 'Iluminador' },
  { value: 'contorno', label: 'Contorno' }
];

const COSMETIC_BRANDS = [
  { value: 'mari-maria', label: 'Mari Maria', country: 'BR' },
  { value: 'boca-rosa', label: 'Boca Rosa', country: 'BR' },
  { value: 'bruna-tavares', label: 'Bruna Tavares', country: 'BR' },
  { value: 'vult', label: 'Vult', country: 'BR' },
  { value: 'ruby-rose', label: 'Ruby Rose', country: 'BR' },
  { value: 'zanphy', label: 'Zanphy', country: 'BR' },
  { value: 'eudora', label: 'Eudora', country: 'BR' },
  { value: 'yes-cosmeticos', label: 'Yes! Cosméticos', country: 'BR' },
  { value: 'maybelline', label: 'Maybelline', country: 'US' },
  { value: 'revlon', label: 'Revlon', country: 'US' },
  { value: 'loreal', label: "L'Oréal", country: 'FR' }
];

const PRICE_RANGES = [
  { value: '5-15', label: '€5 - €15' },
  { value: '15-30', label: '€15 - €30' },
  { value: '30-50', label: '€30 - €50' },
  { value: '50-80', label: '€50 - €80' },
  { value: '80+', label: '€80+' }
];

const SKIN_TYPES = [
  { value: 'oleosa', label: 'Oleosa' },
  { value: 'seca', label: 'Seca' },
  { value: 'mista', label: 'Mista' },
  { value: 'sensivel', label: 'Sensível' },
  { value: 'normal', label: 'Normal' },
  { value: 'todos', label: 'Todos os tipos' }
];

const COMMON_COLORS = [
  { value: 'nude', label: 'Nude', color: '#D4B5A0' },
  { value: 'rosa', label: 'Rosa', color: '#FFC0CB' },
  { value: 'vermelho', label: 'Vermelho', color: '#FF0000' },
  { value: 'coral', label: 'Coral', color: '#FF7F50' },
  { value: 'marrom', label: 'Marrom', color: '#8B4513' },
  { value: 'vinho', label: 'Vinho', color: '#722F37' },
  { value: 'roxo', label: 'Roxo', color: '#800080' },
  { value: 'laranja', label: 'Laranja', color: '#FFA500' },
  { value: 'dourado', label: 'Dourado', color: '#FFD700' },
  { value: 'prateado', label: 'Prateado', color: '#C0C0C0' },
  { value: 'preto', label: 'Preto', color: '#000000' }
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Novidades', icon: Star },
  { value: 'price-low-high', label: 'Preço: Menor → Maior', icon: BarChart3 },
  { value: 'price-high-low', label: 'Preço: Maior → Menor', icon: BarChart3 },
  { value: 'popularity', label: 'Mais Populares', icon: Eye },
  { value: 'rating-high', label: 'Melhor Avaliados', icon: Star },
  { value: 'name', label: 'Nome A-Z', icon: Filter }
];

export default function CosmeticFilters({
  onFiltersChange,
  onSortChange,
  onToggleWishlist,
  onToggleComparison,
  wishlistIds,
  comparisonIds,
  totalProducts,
  isLoading = false
}: CosmeticFiltersProps) {
  const [filters, setFilters] = useState<CosmeticFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    search: true,
    categories: true,
    brands: true,
    price: true,
    colors: false,
    skinType: false,
    advanced: false
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

  const updateFilters = (key: keyof CosmeticFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayFilterChange = (key: keyof CosmeticFilters, value: string) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    updateFilters(key, newValues.length ? newValues : undefined);
  };

  const handlePriceRangeChange = (range: string) => {
    updateFilters('priceRange', filters.priceRange === range ? undefined : range);
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
    if (filters.color?.length) count += filters.color.length;
    if (filters.skinType?.length) count += filters.skinType.length;
    if (filters.priceRange) count += 1;
    if (filters.search) count += 1;
    if (filters.isNew) count += 1;
    if (filters.featured) count += 1;
    if (filters.hasDiscount) count += 1;
    if (filters.inStock) count += 1;
    return count;
  };

  const FilterSection = ({
    id,
    title,
    children,
    count,
    icon: Icon
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
    count?: number;
    icon?: any;
  }) => (
    <div className="border-b border-pink-100 last:border-b-0">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between py-4 px-6 text-left hover:bg-pink-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-4 h-4 text-pink-500" />}
          <span className="font-medium text-gray-900">{title}</span>
          {count && count > 0 && (
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-full">
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
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors shadow-sm"
        >
          <SlidersHorizontal className="w-5 h-5 text-pink-500" />
          <span className="font-medium">Filtros</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Filters Sidebar */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 sticky top-24 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-pink-500" />
              <h2 className="text-lg font-semibold text-gray-900">Filtros de Cosméticos</h2>
            </div>
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-pink-600 hover:text-pink-700 transition-colors font-medium"
              >
                Limpar Todos
              </button>
            )}
          </div>

          {/* Search */}
          <FilterSection id="search" title="Busca Inteligente" icon={Search}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busque por nome, marca..."
                className="w-full pl-10 pr-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-colors"
              />
            </div>
          </FilterSection>

          {/* Categories */}
          <FilterSection
            id="categories"
            title="Categoria"
            count={filters.category?.length}
            icon={Palette}
          >
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {COSMETIC_CATEGORIES.map((category) => (
                <label key={category.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.category?.includes(category.value) || false}
                    onChange={() => handleArrayFilterChange('category', category.value)}
                    className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
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
            icon={Star}
          >
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {COSMETIC_BRANDS.map((brand) => (
                <label key={brand.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.brand?.includes(brand.value) || false}
                    onChange={() => handleArrayFilterChange('brand', brand.value)}
                    className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                      {brand.label}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      brand.country === 'BR'
                        ? 'text-green-600 bg-green-50'
                        : 'text-blue-600 bg-blue-50'
                    }`}>
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
            icon={BarChart3}
          >
            <div className="space-y-3">
              {PRICE_RANGES.map((range) => (
                <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === range.value}
                    onChange={() => handlePriceRangeChange(range.value)}
                    className="w-4 h-4 text-pink-500 border-pink-300 focus:ring-pink-300"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Colors */}
          <FilterSection
            id="colors"
            title="Cor"
            count={filters.color?.length}
            icon={Palette}
          >
            <div className="grid grid-cols-2 gap-3">
              {COMMON_COLORS.map((color) => (
                <label key={color.value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.color?.includes(color.value) || false}
                    onChange={() => handleArrayFilterChange('color', color.value)}
                    className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                    style={{ backgroundColor: color.color }}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    {color.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Skin Type */}
          <FilterSection
            id="skinType"
            title="Tipo de Pele"
            count={filters.skinType?.length}
            icon={Sparkles}
          >
            <div className="space-y-3">
              {SKIN_TYPES.map((type) => (
                <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.skinType?.includes(type.value) || false}
                    onChange={() => handleArrayFilterChange('skinType', type.value)}
                    className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Advanced Filters */}
          <FilterSection
            id="advanced"
            title="Filtros Avançados"
            icon={SlidersHorizontal}
          >
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.isNew || false}
                  onChange={(e) => updateFilters('isNew', e.target.checked || undefined)}
                  className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  Novidades
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.featured || false}
                  onChange={(e) => updateFilters('featured', e.target.checked || undefined)}
                  className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  Destaques
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.hasDiscount || false}
                  onChange={(e) => updateFilters('hasDiscount', e.target.checked || undefined)}
                  className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  Com Desconto
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.inStock || false}
                  onChange={(e) => updateFilters('inStock', e.target.checked || undefined)}
                  className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  Em Estoque
                </span>
              </label>
            </div>
          </FilterSection>

          {/* Results Counter */}
          <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-b-2xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600 mb-1">
                {isLoading ? '...' : totalProducts.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {totalProducts === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </div>
              {getActiveFiltersCount() > 0 && (
                <div className="text-xs text-pink-500 mt-1">
                  {getActiveFiltersCount()} filtro{getActiveFiltersCount() > 1 ? 's' : ''} ativo{getActiveFiltersCount() > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sort & View Options */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg border border-pink-100 shadow-sm">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white text-gray-700"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Heart className="w-4 h-4 text-pink-400" />
            <span>{wishlistIds.length} favoritos</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Shuffle className="w-4 h-4 text-pink-400" />
            <span>{comparisonIds.length}/3 comparar</span>
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
          <div className="bg-white h-full w-full overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-pink-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Filtros de Cosméticos</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Same filter content as desktop - simplified for mobile */}
            <div className="p-4 space-y-6">
              {/* Search */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Busca</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Busque produtos..."
                    className="w-full pl-10 pr-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              {/* Quick actions for mobile */}
              <div className="grid grid-cols-2 gap-3">
                {COSMETIC_CATEGORIES.slice(0, 6).map((category) => (
                  <label key={category.value} className="flex items-center gap-2 p-3 border border-pink-200 rounded-lg cursor-pointer hover:bg-pink-50">
                    <input
                      type="checkbox"
                      checked={filters.category?.includes(category.value) || false}
                      onChange={() => handleArrayFilterChange('category', category.value)}
                      className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                    />
                    <span className="text-sm text-gray-700">{category.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="sticky bottom-0 bg-white border-t border-pink-200 p-4">
              <div className="flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 px-4 border border-pink-300 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors font-medium"
                >
                  Limpar
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors font-medium"
                >
                  Ver {totalProducts} Produtos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}