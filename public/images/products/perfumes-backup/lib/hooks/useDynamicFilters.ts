import { useState, useEffect, useMemo } from 'react';

export interface DynamicProductFilters {
  search?: string;
  category?: string[];
  brand?: string[];
  priceRange?: string;
  productType?: string[];

  // Filtros específicos para TINTAS
  hairColor?: string[];
  colorFamily?: string[];
  coverage?: string[];
  ammonia?: boolean;

  // Filtros específicos para PRODUTOS QUÍMICOS
  concentration?: string[];
  volume?: string[];
  chemicalType?: string[];

  // Filtros específicos para TRATAMENTOS/HIDRATAÇÃO
  treatmentType?: string[];
  hairType?: string[];
  problemTarget?: string[];

  // Filtros específicos para PROGRESSIVAS/RELAXAMENTO
  straighteningLevel?: string[];
  formula?: string[];
  duration?: string[];

  // Filtros gerais
  isNew?: boolean;
  featured?: boolean;
  hasDiscount?: boolean;
  inStock?: boolean;
  rating?: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  originalPrice?: number;
  priceBRL?: number;
  images: string[];
  imageCarousel?: Array<{
    id: number;
    url: string;
    alt: string;
    size?: number;
    lastModified?: string;
  }>;
  features?: string[];
  specifications?: any;
  stock?: number;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  featured?: boolean;
  isNew?: boolean;
  hasDiscount?: boolean;
  tags?: string[];

  // Campos específicos para análise de filtros
  color_info?: {
    tone?: string;
    hex_color?: string;
    undertone?: string;
    skin_match?: string;
    rgb?: string;
  };
  colors?: string[];
}

export function useDynamicFilters(products: Product[], activeCategory: string) {
  const [filters, setFilters] = useState<DynamicProductFilters>({});
  const [sortBy, setSortBy] = useState('newest');

  // Reset filters when category changes
  useEffect(() => {
    setFilters({});
  }, [activeCategory]);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        (product.tags && product.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm)
        )) ||
        (product.features && product.features.some(feature =>
          feature.toLowerCase().includes(searchTerm)
        ))
      );
    }

    // Apply brand filter
    if (filters.brand && filters.brand.length > 0) {
      filtered = filtered.filter(product => {
        const brandSlug = product.brand.toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        return filters.brand!.some(filterBrand =>
          brandSlug.includes(filterBrand) ||
          product.brand.toLowerCase().includes(filterBrand) ||
          filterBrand.includes(brandSlug)
        );
      });
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max) {
        filtered = filtered.filter(product => product.price >= min && product.price <= max);
      } else {
        filtered = filtered.filter(product => product.price >= min);
      }
    }

    // Apply category-specific filters
    switch (activeCategory) {
      case 'tintas':
        filtered = applyTintaFilters(filtered, filters);
        break;
      case 'progressivas':
        filtered = applyProgressivaFilters(filtered, filters);
        break;
      case 'hidratacao':
        filtered = applyHidratacaoFilters(filtered, filters);
        break;
      case 'botox':
        filtered = applyBotoxFilters(filtered, filters);
        break;
      case 'quimicos':
        filtered = applyQuimicosFilters(filtered, filters);
        break;
    }

    // Apply general filters
    if (filters.isNew) {
      filtered = filtered.filter(product => product.isNew);
    }

    if (filters.featured) {
      filtered = filtered.filter(product => product.featured);
    }

    if (filters.hasDiscount) {
      filtered = filtered.filter(product => product.hasDiscount);
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock !== false);
    }

    if (filters.rating) {
      filtered = filtered.filter(product => (product.rating || 0) >= filters.rating!);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'rating-high':
          return (b.rating || 0) - (a.rating || 0);
        case 'popularity':
          return (b.reviews || 0) - (a.reviews || 0);
        case 'newest':
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return a.name.localeCompare(b.name);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, filters, sortBy, activeCategory]);

  // Update filters
  const updateFilters = (newFilters: Partial<DynamicProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof DynamicProductFilters];
      if (Array.isArray(value) && value.length > 0) count += value.length;
      else if (typeof value === 'boolean' && value) count += 1;
      else if (typeof value === 'string' && value) count += 1;
      else if (typeof value === 'number' && value > 0) count += 1;
    });
    return count;
  };

  return {
    filters,
    filteredProducts,
    sortBy,
    updateFilters,
    clearFilters,
    setSortBy,
    getActiveFiltersCount
  };
}

// Helper functions for category-specific filtering

function applyTintaFilters(products: Product[], filters: DynamicProductFilters): Product[] {
  let filtered = products;

  if (filters.hairColor && filters.hairColor.length > 0) {
    filtered = filtered.filter(product =>
      filters.hairColor!.some(color =>
        product.name.toLowerCase().includes(color) ||
        (product.color_info?.tone && product.color_info.tone.toLowerCase().includes(color)) ||
        (product.colors && product.colors.some(c => c.toLowerCase().includes(color))) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(color)))
      )
    );
  }

  if (filters.colorFamily && filters.colorFamily.length > 0) {
    filtered = filtered.filter(product => {
      const productName = product.name.toLowerCase();
      const productDescription = product.description.toLowerCase();

      return filters.colorFamily!.some(family => {
        switch (family) {
          case 'claros':
            return productName.includes('loiro') || productName.includes('platinado') ||
                   productName.includes('claro') || productDescription.includes('claro');
          case 'medios':
            return productName.includes('castanho') || productName.includes('médio') ||
                   productDescription.includes('médio');
          case 'escuros':
            return productName.includes('preto') || productName.includes('chocolate') ||
                   productName.includes('escuro') || productDescription.includes('escuro');
          case 'especiais':
            return productName.includes('ruivo') || productName.includes('cinza') ||
                   productName.includes('mogno') || productName.includes('especial');
          default:
            return false;
        }
      });
    });
  }

  if (filters.coverage && filters.coverage.length > 0) {
    filtered = filtered.filter(product =>
      filters.coverage!.some(coverage => {
        const productFeatures = product.features?.join(' ').toLowerCase() || '';
        const productDescription = product.description.toLowerCase();

        switch (coverage) {
          case 'cobertura-total':
            return productFeatures.includes('cobertura 100%') ||
                   productFeatures.includes('cobertura total') ||
                   productDescription.includes('cobertura total');
          case 'cobertura-parcial':
            return productFeatures.includes('cobertura parcial') ||
                   productDescription.includes('cobertura parcial');
          case 'tonalizante':
            return productFeatures.includes('tonalizante') ||
                   productDescription.includes('tonalizante');
          case 'reflexos':
            return productFeatures.includes('reflexos') ||
                   productDescription.includes('reflexos');
          default:
            return false;
        }
      })
    );
  }

  if (filters.ammonia === true) {
    filtered = filtered.filter(product => {
      const productFeatures = product.features?.join(' ').toLowerCase() || '';
      const productDescription = product.description.toLowerCase();
      return productFeatures.includes('sem amônia') ||
             productFeatures.includes('sem ammonia') ||
             productDescription.includes('sem amônia') ||
             productDescription.includes('sem ammonia');
    });
  }

  return filtered;
}

function applyProgressivaFilters(products: Product[], filters: DynamicProductFilters): Product[] {
  let filtered = products;

  if (filters.straighteningLevel && filters.straighteningLevel.length > 0) {
    filtered = filtered.filter(product =>
      filters.straighteningLevel!.some(level => {
        const productName = product.name.toLowerCase();
        const productDescription = product.description.toLowerCase();

        switch (level) {
          case 'liso-total':
            return productName.includes('liso total') || productDescription.includes('liso total');
          case 'liso-natural':
            return productName.includes('liso natural') || productDescription.includes('liso natural');
          case 'reduz-volume':
            return productName.includes('reduz volume') || productDescription.includes('reduz volume');
          case 'define-cachos':
            return productName.includes('define cachos') || productDescription.includes('define cachos');
          default:
            return false;
        }
      })
    );
  }

  if (filters.formula && filters.formula.length > 0) {
    filtered = filtered.filter(product =>
      filters.formula!.some(formula => {
        const productFeatures = product.features?.join(' ').toLowerCase() || '';
        const productDescription = product.description.toLowerCase();
        const productName = product.name.toLowerCase();

        switch (formula) {
          case 'sem-formol':
            return productFeatures.includes('sem formol') ||
                   productFeatures.includes('livre de formol') ||
                   productDescription.includes('sem formol') ||
                   productName.includes('sem formol');
          case 'queratina':
            return productFeatures.includes('queratina') ||
                   productDescription.includes('queratina') ||
                   productName.includes('queratina');
          case 'chocolate':
            return productName.includes('chocolate') ||
                   productDescription.includes('chocolate');
          case 'ouro':
            return productName.includes('ouro') || productName.includes('gold') ||
                   productDescription.includes('ouro') || productDescription.includes('24k');
          default:
            return productFeatures.includes(formula) ||
                   productDescription.includes(formula) ||
                   productName.includes(formula);
        }
      })
    );
  }

  return filtered;
}

function applyHidratacaoFilters(products: Product[], filters: DynamicProductFilters): Product[] {
  let filtered = products;

  if (filters.treatmentType && filters.treatmentType.length > 0) {
    filtered = filtered.filter(product =>
      filters.treatmentType!.some(type => {
        const productName = product.name.toLowerCase();
        const productCategory = product.category.toLowerCase();
        const productSubcategory = product.subcategory?.toLowerCase() || '';

        switch (type) {
          case 'mascara':
            return productName.includes('máscara') || productName.includes('mascara') ||
                   productCategory.includes('máscara');
          case 'leave-in':
            return productName.includes('leave-in') || productName.includes('leave in');
          case 'creme-pentear':
            return productName.includes('creme para pentear') ||
                   productName.includes('creme de pentear');
          case 'oleo':
            return productName.includes('óleo') || productName.includes('oleo');
          case 'serum':
            return productName.includes('sérum') || productName.includes('serum');
          case 'ampola':
            return productName.includes('ampola');
          default:
            return false;
        }
      })
    );
  }

  if (filters.hairType && filters.hairType.length > 0) {
    filtered = filtered.filter(product =>
      filters.hairType!.some(hairType => {
        const productDescription = product.description.toLowerCase();
        const productFeatures = product.features?.join(' ').toLowerCase() || '';

        return productDescription.includes(hairType) ||
               productFeatures.includes(hairType);
      })
    );
  }

  if (filters.problemTarget && filters.problemTarget.length > 0) {
    filtered = filtered.filter(product =>
      filters.problemTarget!.some(problem => {
        const productFeatures = product.features?.join(' ').toLowerCase() || '';
        const productDescription = product.description.toLowerCase();
        const productName = product.name.toLowerCase();

        switch (problem) {
          case 'frizz':
            return productFeatures.includes('antifrizz') || productFeatures.includes('anti-frizz') ||
                   productName.includes('antifrizz') || productDescription.includes('antifrizz');
          case 'volume':
            return productFeatures.includes('volume') || productName.includes('volume') ||
                   productDescription.includes('volume');
          case 'brilho':
            return productFeatures.includes('brilho') || productName.includes('brilho') ||
                   productDescription.includes('brilho');
          case 'pontas-duplas':
            return productFeatures.includes('pontas duplas') ||
                   productDescription.includes('pontas duplas');
          case 'porosidade':
            return productFeatures.includes('antiporosidade') ||
                   productDescription.includes('antiporosidade');
          default:
            return productFeatures.includes(problem) ||
                   productDescription.includes(problem);
        }
      })
    );
  }

  return filtered;
}

function applyBotoxFilters(products: Product[], filters: DynamicProductFilters): Product[] {
  let filtered = products;

  if (filters.treatmentType && filters.treatmentType.length > 0) {
    filtered = filtered.filter(product =>
      filters.treatmentType!.some(type => {
        const productName = product.name.toLowerCase();

        switch (type) {
          case 'btx-traditional':
            return productName.includes('btx') || productName.includes('botox');
          case 'btx-organic':
            return productName.includes('orgânico') || productName.includes('organic');
          case 'btx-zero':
            return productName.includes('zero') || productName.includes('0%');
          case 'btx-premium':
            return productName.includes('premium');
          default:
            return false;
        }
      })
    );
  }

  if (filters.formula && filters.formula.length > 0) {
    filtered = filtered.filter(product =>
      filters.formula!.some(formula => {
        const productFeatures = product.features?.join(' ').toLowerCase() || '';
        const productDescription = product.description.toLowerCase();

        switch (formula) {
          case 'sem-formol':
            return productFeatures.includes('0% formol') ||
                   productFeatures.includes('sem formol') ||
                   productDescription.includes('livre de formol');
          case 'argan':
            return productFeatures.includes('argan') || productDescription.includes('argan');
          default:
            return productFeatures.includes(formula) || productDescription.includes(formula);
        }
      })
    );
  }

  return filtered;
}

function applyQuimicosFilters(products: Product[], filters: DynamicProductFilters): Product[] {
  let filtered = products;

  if (filters.chemicalType && filters.chemicalType.length > 0) {
    filtered = filtered.filter(product =>
      filters.chemicalType!.some(type => {
        const productName = product.name.toLowerCase();
        const productCategory = product.category.toLowerCase();

        switch (type) {
          case 'descolorante':
            return productName.includes('descolorante') ||
                   productCategory.includes('descolorante');
          case 'oxigenada':
            return productName.includes('oxigenada') || productName.includes('água oxigenada');
          case 'revelador':
            return productName.includes('revelador');
          case 'neutralizante':
            return productName.includes('neutralizante');
          default:
            return false;
        }
      })
    );
  }

  if (filters.concentration && filters.concentration.length > 0) {
    filtered = filtered.filter(product =>
      filters.concentration!.some(conc => {
        const productName = product.name.toLowerCase();
        const productDescription = product.description.toLowerCase();

        return productName.includes(conc.replace('-', ' ')) ||
               productDescription.includes(conc.replace('-', ' '));
      })
    );
  }

  if (filters.volume && filters.volume.length > 0) {
    filtered = filtered.filter(product =>
      filters.volume!.some(vol => {
        const productName = product.name.toLowerCase();
        const productDescription = product.description.toLowerCase();
        const specifications = JSON.stringify(product.specifications || {}).toLowerCase();

        return productName.includes(vol) ||
               productDescription.includes(vol) ||
               specifications.includes(vol);
      })
    );
  }

  return filtered;
}