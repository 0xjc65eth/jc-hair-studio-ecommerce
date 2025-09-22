import { useState, useMemo, useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  brand: string;
  price?: number;
  priceBRL?: number;
  price_brl?: number;
  category: string;
  description?: string;
  features?: string[];
  colors?: string[];
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  featured?: boolean;
  isNew?: boolean;
}

interface FilterState {
  category: string;
  categoryType: string;
  brands: string[];
  treatments: string[];
  hairTypes: string[];
  formulas: string[];
  priceRange: { min: number; max: number; label: string } | null;
  searchTerm: string;
  sortBy: 'name' | 'price' | 'rating' | 'newest' | 'brand';
  sortOrder: 'asc' | 'desc';
}

export const useProfessionalFilters = (products: Product[], filterOptions: any) => {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    categoryType: '',
    brands: [],
    treatments: [],
    hairTypes: [],
    formulas: [],
    priceRange: null,
    searchTerm: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [resultsPerPage, setResultsPerPage] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtragem inteligente dos produtos
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filtro por tipo de categoria
    if (filters.categoryType) {
      const categoryKeys = filterOptions.categories[filters.categoryType]?.map((cat: any) => cat.key) || [];
      filtered = filtered.filter(product => categoryKeys.includes(product.category));
    }

    // Filtro por categoria específica
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Filtro por marcas
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => filters.brands.includes(product.brand));
    }

    // Filtro por tratamentos (análise inteligente do nome e descrição)
    if (filters.treatments.length > 0) {
      filtered = filtered.filter(product => {
        const text = (product.name + ' ' + (product.description || '')).toLowerCase();
        return filters.treatments.some(treatment => {
          switch (treatment) {
            case 'Progressiva':
              return text.includes('progressiv') || text.includes('keratin');
            case 'Botox Capilar':
              return text.includes('botox');
            case 'Selagem':
              return text.includes('selagem');
            case 'Relaxamento':
              return text.includes('relaxament');
            case 'Hidratação':
              return text.includes('hidrat') || text.includes('moistur');
            case 'Reconstrução':
              return text.includes('reconstru') || text.includes('repair');
            default:
              return text.includes(treatment.toLowerCase());
          }
        });
      });
    }

    // Filtro por tipo de cabelo
    if (filters.hairTypes.length > 0) {
      filtered = filtered.filter(product => {
        const text = (product.name + ' ' + (product.description || '')).toLowerCase();
        return filters.hairTypes.some(hairType => {
          switch (hairType) {
            case 'Cacheado':
              return text.includes('cacheado') || text.includes('cachos') || text.includes('curly');
            case 'Liso':
              return text.includes('liso') || text.includes('straight');
            case 'Ondulado':
              return text.includes('ondulado') || text.includes('wavy');
            case 'Crespo':
              return text.includes('crespo') || text.includes('afro');
            case 'Todos os tipos':
              return text.includes('todos os tipos') || text.includes('all hair types');
            default:
              return text.includes(hairType.toLowerCase());
          }
        });
      });
    }

    // Filtro por fórmulas especiais
    if (filters.formulas.length > 0) {
      filtered = filtered.filter(product => {
        const text = (product.name + ' ' + (product.description || '') + ' ' + (product.features?.join(' ') || '')).toLowerCase();
        return filters.formulas.some(formula => {
          switch (formula) {
            case 'Livre de Formol':
              return text.includes('sem formol') || text.includes('0% formol') || text.includes('formol free');
            case 'Orgânico':
              return text.includes('orgânic') || text.includes('organic');
            case 'Vegano':
              return text.includes('vegan') || text.includes('vegano');
            case 'Natural':
              return text.includes('natural') || text.includes('extratos');
            case 'Profissional':
              return text.includes('profissional') || text.includes('professional');
            default:
              return text.includes(formula.toLowerCase());
          }
        });
      });
    }

    // Filtro por faixa de preço
    if (filters.priceRange) {
      filtered = filtered.filter(product => {
        const price = product.price || product.priceBRL || product.price_brl || 0;
        return price >= filters.priceRange!.min && (filters.priceRange!.max === Infinity || price <= filters.priceRange!.max);
      });
    }

    // Filtro por termo de busca
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(product => {
        const searchText = (
          product.name + ' ' +
          product.brand + ' ' +
          (product.description || '') + ' ' +
          (product.features?.join(' ') || '') + ' ' +
          product.category
        ).toLowerCase();
        return searchText.includes(searchTerm);
      });
    }

    return filtered;
  }, [products, filters, filterOptions]);

  // Ordenação dos produtos
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    sorted.sort((a, b) => {
      let compareValue = 0;

      switch (filters.sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'price':
          const priceA = a.price || a.priceBRL || a.price_brl || 0;
          const priceB = b.price || b.priceBRL || b.price_brl || 0;
          compareValue = priceA - priceB;
          break;
        case 'rating':
          compareValue = (b.rating || 0) - (a.rating || 0);
          break;
        case 'newest':
          compareValue = (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
          break;
        case 'brand':
          compareValue = a.brand.localeCompare(b.brand);
          break;
        default:
          compareValue = 0;
      }

      return filters.sortOrder === 'desc' ? -compareValue : compareValue;
    });

    return sorted;
  }, [filteredProducts, filters.sortBy, filters.sortOrder]);

  // Paginação
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, currentPage, resultsPerPage]);

  const totalPages = Math.ceil(sortedProducts.length / resultsPerPage);

  // Callbacks para atualização de filtros
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset para primeira página quando filtros mudam
  }, []);

  const updateSorting = useCallback((sortBy: FilterState['sortBy'], sortOrder?: FilterState['sortOrder']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: sortOrder || (prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc')
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      category: '',
      categoryType: '',
      brands: [],
      treatments: [],
      hairTypes: [],
      formulas: [],
      priceRange: null,
      searchTerm: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setCurrentPage(1);
  }, []);

  // Estatísticas dos resultados
  const filterStats = useMemo(() => {
    return {
      totalProducts: products.length,
      filteredCount: sortedProducts.length,
      currentPageStart: (currentPage - 1) * resultsPerPage + 1,
      currentPageEnd: Math.min(currentPage * resultsPerPage, sortedProducts.length),
      totalPages,
      currentPage,
      hasFilters: Object.values(filters).some(value =>
        Array.isArray(value) ? value.length > 0 : value !== '' && value !== null
      )
    };
  }, [products.length, sortedProducts.length, currentPage, resultsPerPage, totalPages, filters]);

  return {
    // Estado
    filters,
    viewMode,
    resultsPerPage,
    currentPage,

    // Produtos processados
    filteredProducts: paginatedProducts,
    allFilteredProducts: sortedProducts,

    // Ações principais
    handleFiltersChange: updateFilters,
    handleSortChange: updateSorting,
    handleViewModeChange: setViewMode,
    handleResultsPerPageChange: setResultsPerPage,

    // Ações auxiliares
    updateFilters,
    updateSorting,
    clearAllFilters,
    setViewMode,
    setResultsPerPage,
    setCurrentPage,

    // Estado atual
    currentViewMode: viewMode,
    currentSortBy: filters.sortBy,
    currentSortOrder: filters.sortOrder,

    // Estatísticas
    filterStats
  };
};