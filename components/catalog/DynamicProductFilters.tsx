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
  Sparkles,
  Droplets,
  Scissors,
  Beaker,
  Brush,
  Zap
} from 'lucide-react';

interface DynamicProductFilters {
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

  // Filtros específicos para RELAXAMENTOS
  relaxamentTypes?: string[];
  intensity?: string[];
  ingredients?: string[];

  // Filtros específicos para PROGRESSIVAS
  formolContent?: string[];
  activeIngredients?: string[];

  // Filtros específicos para BOTOX/SELAGEM
  botoxTreatmentTypes?: string[];
  botoxFormolContent?: string[];
  botoxActiveIngredients?: string[];

  // Filtros específicos para BIO EXTRATUS
  bioProductTypes?: string[];
  bioTreatmentTypes?: string[];
  bioActiveIngredients?: string[];

  // Filtros específicos para HIDRATAÇÃO
  hydrationProductTypes?: string[];
  benefits?: string[];
  hydrationActiveIngredients?: string[];

  // Filtros específicos para TRATAMENTOS/HIDRATAÇÃO (genérico)
  treatmentType?: string[];
  hairType?: string[];
  problemTarget?: string[];
  duration?: string[];

  // Filtros gerais
  isNew?: boolean;
  featured?: boolean;
  hasDiscount?: boolean;
  inStock?: boolean;
  rating?: number;
}

interface DynamicProductFiltersProps {
  activeCategory: string;
  onFiltersChange: (filters: DynamicProductFilters) => void;
  onSortChange: (sort: string) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleComparison: (productId: string) => void;
  wishlistIds: string[];
  comparisonIds: string[];
  totalProducts: number;
  isLoading?: boolean;
}

// Configurações específicas por categoria de produto
const CATEGORY_CONFIGS = {
  tintas: {
    name: 'Coloração Capilar',
    icon: Palette,
    brands: [
      { value: 'loreal', label: "L'Oréal Paris", country: 'FR' },
      { value: 'wella', label: 'Wella', country: 'DE' },
      { value: 'beauty-color', label: 'Beauty Color', country: 'BR' },
      { value: 'biocolor', label: 'BioColor', country: 'BR' },
      { value: 'amend', label: 'Amend', country: 'BR' },
      { value: 'alta-moda', label: 'Alta Moda', country: 'BR' },
      { value: 'nutrisse', label: 'Nutrisse', country: 'FR' },
      { value: 'excllusiv', label: 'Excllusiv', country: 'BR' }
    ],
    hairColors: [
      { value: 'loiro', label: 'Loiro', family: 'claros' },
      { value: 'castanho', label: 'Castanho', family: 'medios' },
      { value: 'preto', label: 'Preto', family: 'escuros' },
      { value: 'ruivo', label: 'Ruivo', family: 'especiais' },
      { value: 'cinza', label: 'Cinza', family: 'especiais' },
      { value: 'platinado', label: 'Platinado', family: 'claros' },
      { value: 'chocolate', label: 'Chocolate', family: 'escuros' },
      { value: 'mogno', label: 'Mogno', family: 'especiais' }
    ],
    colorFamilies: [
      { value: 'claros', label: 'Tons Claros' },
      { value: 'medios', label: 'Tons Médios' },
      { value: 'escuros', label: 'Tons Escuros' },
      { value: 'especiais', label: 'Tons Especiais' }
    ],
    coverageTypes: [
      { value: 'cobertura-total', label: 'Cobertura Total (100%)' },
      { value: 'cobertura-parcial', label: 'Cobertura Parcial' },
      { value: 'tonalizante', label: 'Tonalizante' },
      { value: 'reflexos', label: 'Reflexos' }
    ]
  },

  progressivas: {
    name: 'Progressivas & Alisamentos',
    icon: Zap,
    brands: [
      { value: 'cocochoco', label: 'CocoCHOCO', country: 'BR' },
      { value: 'tzaha', label: "T'ZAHA", country: 'BR' },
      { value: 'brazilicious', label: 'Brazilicious', country: 'BR' },
      { value: 'cadiveu', label: 'Cadiveu', country: 'BR' },
      { value: 'inoar', label: 'Inoar', country: 'BR' }
    ],
    straighteningLevels: [
      { value: 'liso-total', label: 'Liso Total' },
      { value: 'liso-natural', label: 'Liso Natural' },
      { value: 'reduz-volume', label: 'Redução de Volume' },
      { value: 'define-cachos', label: 'Define Cachos' }
    ],
    formulas: [
      { value: 'sem-formol', label: 'Sem Formol' },
      { value: 'queratina', label: 'Queratina' },
      { value: 'acido-glicolico', label: 'Ácido Glicólico' },
      { value: 'tanino', label: 'Tanino' },
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'ouro', label: 'Ouro 24k' }
    ],
    durations: [
      { value: '3-4-meses', label: '3-4 Meses' },
      { value: '4-6-meses', label: '4-6 Meses' },
      { value: '6-8-meses', label: '6-8 Meses' },
      { value: '8-12-meses', label: '8-12 Meses' }
    ]
  },

  hidratacao: {
    name: 'Produtos de Hidratação',
    icon: Droplets,
    brands: [
      { value: 'novex', label: 'Novex', country: 'BR' },
      { value: 'forever-liss', label: 'Forever Liss', country: 'BR' },
      { value: 'skala', label: 'Skala', country: 'BR' },
      { value: 'salon-line', label: 'Salon Line', country: 'BR' }
    ],
    treatmentTypes: [
      { value: 'mascara', label: 'Máscara' },
      { value: 'leave-in', label: 'Leave-in' },
      { value: 'creme-pentear', label: 'Creme para Pentear' },
      { value: 'oleo', label: 'Óleo' },
      { value: 'serum', label: 'Sérum' },
      { value: 'ampola', label: 'Ampola' }
    ],
    hairTypes: [
      { value: 'ressecado', label: 'Cabelo Ressecado' },
      { value: 'danificado', label: 'Cabelo Danificado' },
      { value: 'cacheado', label: 'Cabelo Cacheado' },
      { value: 'crespo', label: 'Cabelo Crespo' },
      { value: 'liso', label: 'Cabelo Liso' },
      { value: 'misto', label: 'Cabelo Misto' }
    ],
    problemTargets: [
      { value: 'frizz', label: 'Anti-Frizz' },
      { value: 'volume', label: 'Controle de Volume' },
      { value: 'brilho', label: 'Brilho Intenso' },
      { value: 'maciez', label: 'Maciez' },
      { value: 'pontas-duplas', label: 'Pontas Duplas' },
      { value: 'porosidade', label: 'Antiporosidade' }
    ]
  },

  botox: {
    name: 'Botox Capilar',
    icon: Sparkles,
    brands: [
      { value: 'topvip', label: 'TopVip', country: 'BR' },
      { value: 'forever-liss', label: 'Forever Liss', country: 'BR' },
      { value: 'hobety', label: 'Hobety', country: 'BR' },
      { value: 'leads-care', label: 'Leads Care', country: 'BR' }
    ],
    treatmentTypes: [
      { value: 'btx-traditional', label: 'BTX Tradicional' },
      { value: 'btx-organic', label: 'BTX Orgânico' },
      { value: 'btx-zero', label: 'BTX Zero Formol' },
      { value: 'btx-premium', label: 'BTX Premium' }
    ],
    formulas: [
      { value: 'sem-formol', label: '0% Formol' },
      { value: 'queratina', label: 'Com Queratina' },
      { value: 'argan', label: 'Óleo de Argan' },
      { value: 'colageno', label: 'Colágeno' },
      { value: 'aminoacidos', label: 'Aminoácidos' }
    ]
  },

  quimicos: {
    name: 'Produtos Químicos',
    icon: Beaker,
    brands: [
      { value: 'wella', label: 'Wella', country: 'DE' },
      { value: 'loreal', label: "L'Oréal", country: 'FR' },
      { value: 'matrix', label: 'Matrix', country: 'US' },
      { value: 'schwarzkopf', label: 'Schwarzkopf', country: 'DE' }
    ],
    chemicalTypes: [
      { value: 'descolorante', label: 'Descolorante' },
      { value: 'oxigenada', label: 'Água Oxigenada' },
      { value: 'revelador', label: 'Revelador' },
      { value: 'neutralizante', label: 'Neutralizante' }
    ],
    concentrations: [
      { value: '10-vol', label: '10 Volumes' },
      { value: '20-vol', label: '20 Volumes' },
      { value: '30-vol', label: '30 Volumes' },
      { value: '40-vol', label: '40 Volumes' }
    ],
    volumes: [
      { value: '90ml', label: '90ml' },
      { value: '900ml', label: '900ml' },
      { value: '1000ml', label: '1L' },
      { value: '5000ml', label: '5L' }
    ]
  },

  relaxamentos: {
    name: 'Relaxamentos Capilares',
    icon: Zap,
    brands: [
      { value: 'embelleze', label: 'Embelleze', country: 'BR' },
      { value: 'hairlife', label: 'HairLife', country: 'BR' },
      { value: 'natulatte', label: 'Natulatte', country: 'BR' },
      { value: 'avon', label: 'Avon', country: 'US' }
    ],
    relaxamentTypes: [
      { value: 'cachos-naturais', label: 'Cachos Naturais' },
      { value: 'liso-natural', label: 'Liso Natural' },
      { value: 'liso-perfeito', label: 'Liso Perfeito' },
      { value: 'ondulado', label: 'Ondulado' }
    ],
    intensity: [
      { value: 'suave', label: 'Suave' },
      { value: 'medio', label: 'Médio' },
      { value: 'forte', label: 'Forte' },
      { value: 'super', label: 'Super Forte' }
    ],
    hairTypes: [
      { value: 'cacheado', label: 'Cabelo Cacheado' },
      { value: 'ondulado', label: 'Cabelo Ondulado' },
      { value: 'crespo', label: 'Cabelo Crespo' },
      { value: 'liso', label: 'Cabelo Liso' }
    ],
    ingredients: [
      { value: 'tioglicolato', label: 'Com Tioglicolato' },
      { value: 'oleo-coco', label: 'Óleo de Coco' },
      { value: 'oleo-argan', label: 'Óleo de Argan' },
      { value: 'karite', label: 'Manteiga de Karité' }
    ]
  },

  progressivas: {
    name: 'Progressivas & Alisamentos',
    icon: Scissors,
    brands: [
      { value: 'cocochoco', label: 'CocoCHOCO', country: 'BR' },
      { value: 'tzaha', label: "T'ZAHA", country: 'BR' },
      { value: 'brazilicious', label: 'Brazilicious', country: 'BR' },
      { value: 'honma-tokyo', label: 'Honma Tokyo', country: 'JP' }
    ],
    treatmentTypes: [
      { value: 'queratina', label: 'Queratina' },
      { value: 'botox-capilar', label: 'Botox Capilar' },
      { value: 'alisamento', label: 'Alisamento' },
      { value: 'therapy-3d', label: 'Terapia 3D' }
    ],
    formolContent: [
      { value: 'sem-formol', label: 'Sem Formol (0%)' },
      { value: 'baixo-formol', label: 'Baixo Formol' },
      { value: 'formol-controlado', label: 'Formol Controlado' }
    ],
    duration: [
      { value: '8-semanas', label: '8 Semanas' },
      { value: '10-semanas', label: '10 Semanas' },
      { value: '12-semanas', label: '12 Semanas' },
      { value: '16-semanas', label: '16+ Semanas' }
    ],
    activeIngredients: [
      { value: 'queratina-brasileira', label: 'Queratina Brasileira' },
      { value: 'ouro-24k', label: 'Ouro 24k' },
      { value: 'mel', label: 'Mel' },
      { value: 'chocolate', label: 'Chocolate' }
    ]
  },

  botox: {
    name: 'Botox & Selagem',
    icon: Sparkles,
    brands: [
      { value: 'topvip', label: 'TopVip', country: 'BR' },
      { value: 'btox', label: 'BTox', country: 'BR' },
      { value: 'plastica-capilar', label: 'Plástica Capilar', country: 'BR' },
      { value: 'inoar', label: 'Inoar', country: 'BR' }
    ],
    treatmentTypes: [
      { value: 'botox-capilar', label: 'Botox Capilar' },
      { value: 'selagem', label: 'Selagem' },
      { value: 'reconstrucao', label: 'Reconstrução' },
      { value: 'hidratacao-intensiva', label: 'Hidratação Intensiva' }
    ],
    formolContent: [
      { value: '0-formol', label: '0% Formol' },
      { value: 'livre-formol', label: 'Livre de Formol' },
      { value: 'formol-controlado', label: 'Formol Controlado' }
    ],
    duration: [
      { value: '6-semanas', label: '6 Semanas' },
      { value: '8-semanas', label: '8 Semanas' },
      { value: '10-semanas', label: '10 Semanas' },
      { value: '12-semanas', label: '12+ Semanas' }
    ],
    activeIngredients: [
      { value: 'dpantenol', label: "D'pantenol" },
      { value: 'oleo-argan', label: 'Óleo de Argan' },
      { value: 'aminoacidos', label: 'Aminoácidos' },
      { value: 'colageno', label: 'Colágeno' }
    ]
  },

  bioextratus: {
    name: 'Bio Extratus',
    icon: Brush,
    brands: [
      { value: 'bio-extratus', label: 'Bio Extratus', country: 'BR' }
    ],
    productTypes: [
      { value: 'coloracao', label: 'Coloração' },
      { value: 'tratamento', label: 'Tratamento Capilar' },
      { value: 'hidratacao', label: 'Hidratação' },
      { value: 'reconstrucao', label: 'Reconstrução' }
    ],
    hairTypes: [
      { value: 'danificado', label: 'Cabelo Danificado' },
      { value: 'ressecado', label: 'Cabelo Ressecado' },
      { value: 'quimicamente-tratado', label: 'Quimicamente Tratado' },
      { value: 'natural', label: 'Cabelo Natural' }
    ],
    activeIngredients: [
      { value: 'extratos-naturais', label: 'Extratos Naturais' },
      { value: 'proteinas', label: 'Proteínas' },
      { value: 'vitaminas', label: 'Vitaminas' },
      { value: 'oleos-vegetais', label: 'Óleos Vegetais' }
    ],
    treatmentTypes: [
      { value: 'hidratacao-intensiva', label: 'Hidratação Intensiva' },
      { value: 'reparacao', label: 'Reparação' },
      { value: 'nutricao', label: 'Nutrição' },
      { value: 'reconstrucao', label: 'Reconstrução' }
    ]
  },

  hidratacao: {
    name: 'Produtos de Hidratação',
    icon: Droplets,
    brands: [
      { value: 'novex', label: 'Novex', country: 'BR' },
      { value: 'skala', label: 'Skala', country: 'BR' },
      { value: 'tresemme', label: 'TRESemmé', country: 'US' },
      { value: 'seda', label: 'Seda', country: 'BR' }
    ],
    productTypes: [
      { value: 'creme-pentear', label: 'Creme para Pentear' },
      { value: 'mascara-hidratante', label: 'Máscara Hidratante' },
      { value: 'leave-in', label: 'Leave-in' },
      { value: 'oleo-capilar', label: 'Óleo Capilar' }
    ],
    hairTypes: [
      { value: 'ressecado', label: 'Cabelo Ressecado' },
      { value: 'danificado', label: 'Cabelo Danificado' },
      { value: 'cacheado', label: 'Cabelo Cacheado' },
      { value: 'liso', label: 'Cabelo Liso' }
    ],
    benefits: [
      { value: 'antiporosidade', label: 'Antiporosidade' },
      { value: 'volume', label: 'Volume' },
      { value: 'definicao-cachos', label: 'Definição de Cachos' },
      { value: 'brilho', label: 'Brilho Intenso' }
    ],
    activeIngredients: [
      { value: 'oleo-coco', label: 'Óleo de Coco' },
      { value: 'argan', label: 'Óleo de Argan' },
      { value: 'karite', label: 'Manteiga de Karité' },
      { value: 'queratina', label: 'Queratina' }
    ]
  }
};

const PRICE_RANGES = [
  { value: '5-15', label: '€5 - €15' },
  { value: '15-30', label: '€15 - €30' },
  { value: '30-50', label: '€30 - €50' },
  { value: '50-100', label: '€50 - €100' },
  { value: '100+', label: '€100+' }
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Novidades', icon: Star },
  { value: 'price-low-high', label: 'Preço: Menor → Maior', icon: BarChart3 },
  { value: 'price-high-low', label: 'Preço: Maior → Menor', icon: BarChart3 },
  { value: 'popularity', label: 'Mais Populares', icon: Eye },
  { value: 'rating-high', label: 'Melhor Avaliados', icon: Star },
  { value: 'name', label: 'Nome A-Z', icon: Filter }
];

export default function DynamicProductFilters({
  activeCategory,
  onFiltersChange,
  onSortChange,
  onToggleWishlist,
  onToggleComparison,
  wishlistIds,
  comparisonIds,
  totalProducts,
  isLoading = false
}: DynamicProductFiltersProps) {
  const [filters, setFilters] = useState<DynamicProductFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    search: true,
    brands: true,
    price: true,
    specific: true,
    advanced: false
  });

  // Mobile filter panel
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Get current category config
  const categoryConfig = CATEGORY_CONFIGS[activeCategory as keyof typeof CATEGORY_CONFIGS] || CATEGORY_CONFIGS.tintas;

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

  const updateFilters = (key: keyof DynamicProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayFilterChange = (key: keyof DynamicProductFilters, value: string) => {
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
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof DynamicProductFilters];
      if (Array.isArray(value) && value.length > 0) count += value.length;
      else if (typeof value === 'boolean' && value) count += 1;
      else if (typeof value === 'string' && value) count += 1;
      else if (typeof value === 'number' && value > 0) count += 1;
    });
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

  // Renderizar filtros específicos baseados na categoria
  const renderSpecificFilters = () => {
    const CategoryIcon = categoryConfig.icon;

    return (
      <FilterSection
        id="specific"
        title={`Filtros de ${categoryConfig.name}`}
        icon={CategoryIcon}
      >
        <div className="space-y-6">
          {/* Filtros específicos para TINTAS */}
          {activeCategory === 'tintas' && (
            <>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Cor do Cabelo</h4>
                <div className="grid grid-cols-2 gap-2">
                  {categoryConfig.hairColors?.map((color) => (
                    <label key={color.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hairColor?.includes(color.value) || false}
                        onChange={() => handleArrayFilterChange('hairColor', color.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-sm text-gray-700">{color.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Família de Cores</h4>
                <div className="space-y-2">
                  {categoryConfig.colorFamilies?.map((family) => (
                    <label key={family.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.colorFamily?.includes(family.value) || false}
                        onChange={() => handleArrayFilterChange('colorFamily', family.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{family.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de Cobertura</h4>
                <div className="space-y-2">
                  {categoryConfig.coverageTypes?.map((coverage) => (
                    <label key={coverage.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.coverage?.includes(coverage.value) || false}
                        onChange={() => handleArrayFilterChange('coverage', coverage.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{coverage.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.ammonia || false}
                    onChange={(e) => updateFilters('ammonia', e.target.checked || undefined)}
                    className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                  />
                  <span className="text-gray-700">Sem Amônia</span>
                </label>
              </div>
            </>
          )}

          {/* Filtros específicos para PROGRESSIVAS */}
          {activeCategory === 'progressivas' && (
            <>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de Tratamento</h4>
                <div className="space-y-2">
                  {categoryConfig.treatmentTypes?.map((type) => (
                    <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.treatmentType?.includes(type.value) || false}
                        onChange={() => handleArrayFilterChange('treatmentType', type.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Conteúdo de Formol</h4>
                <div className="space-y-2">
                  {categoryConfig.formolContent?.map((formol) => (
                    <label key={formol.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.formolContent?.includes(formol.value) || false}
                        onChange={() => handleArrayFilterChange('formolContent', formol.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{formol.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Duração do Efeito</h4>
                <div className="space-y-2">
                  {categoryConfig.duration?.map((duration) => (
                    <label key={duration.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.duration?.includes(duration.value) || false}
                        onChange={() => handleArrayFilterChange('duration', duration.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{duration.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Ingredientes Ativos</h4>
                <div className="space-y-2">
                  {categoryConfig.activeIngredients?.map((ingredient) => (
                    <label key={ingredient.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.activeIngredients?.includes(ingredient.value) || false}
                        onChange={() => handleArrayFilterChange('activeIngredients', ingredient.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{ingredient.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}


          {/* Filtros específicos para PRODUTOS QUÍMICOS */}
          {activeCategory === 'quimicos' && (
            <>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de Produto</h4>
                <div className="space-y-2">
                  {categoryConfig.chemicalTypes?.map((type) => (
                    <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.chemicalType?.includes(type.value) || false}
                        onChange={() => handleArrayFilterChange('chemicalType', type.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Concentração</h4>
                <div className="space-y-2">
                  {categoryConfig.concentrations?.map((conc) => (
                    <label key={conc.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.concentration?.includes(conc.value) || false}
                        onChange={() => handleArrayFilterChange('concentration', conc.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{conc.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Volume</h4>
                <div className="space-y-2">
                  {categoryConfig.volumes?.map((vol) => (
                    <label key={vol.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.volume?.includes(vol.value) || false}
                        onChange={() => handleArrayFilterChange('volume', vol.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{vol.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Filtros específicos para RELAXAMENTOS */}
          {activeCategory === 'relaxamentos' && (
            <>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de Relaxamento</h4>
                <div className="space-y-2">
                  {categoryConfig.relaxamentTypes?.map((type) => (
                    <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.relaxamentTypes?.includes(type.value) || false}
                        onChange={() => handleArrayFilterChange('relaxamentTypes', type.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Intensidade</h4>
                <div className="space-y-2">
                  {categoryConfig.intensity?.map((level) => (
                    <label key={level.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.intensity?.includes(level.value) || false}
                        onChange={() => handleArrayFilterChange('intensity', level.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Ingredientes Principais</h4>
                <div className="space-y-2">
                  {categoryConfig.ingredients?.map((ingredient) => (
                    <label key={ingredient.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.ingredients?.includes(ingredient.value) || false}
                        onChange={() => handleArrayFilterChange('ingredients', ingredient.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{ingredient.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Filtros específicos para BOTOX & SELAGEM */}
          {activeCategory === 'botox' && (
            <>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de Tratamento</h4>
                <div className="space-y-2">
                  {categoryConfig.treatmentTypes?.map((type) => (
                    <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.botoxTreatmentTypes?.includes(type.value) || false}
                        onChange={() => handleArrayFilterChange('botoxTreatmentTypes', type.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Conteúdo de Formol</h4>
                <div className="space-y-2">
                  {categoryConfig.formolContent?.map((formol) => (
                    <label key={formol.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.botoxFormolContent?.includes(formol.value) || false}
                        onChange={() => handleArrayFilterChange('botoxFormolContent', formol.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{formol.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Ingredientes Ativos</h4>
                <div className="space-y-2">
                  {categoryConfig.activeIngredients?.map((ingredient) => (
                    <label key={ingredient.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.botoxActiveIngredients?.includes(ingredient.value) || false}
                        onChange={() => handleArrayFilterChange('botoxActiveIngredients', ingredient.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{ingredient.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Duração do Efeito</h4>
                <div className="space-y-2">
                  {categoryConfig.duration?.map((duration) => (
                    <label key={duration.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.duration?.includes(duration.value) || false}
                        onChange={() => handleArrayFilterChange('duration', duration.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{duration.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Filtros específicos para BIO EXTRATUS */}
          {activeCategory === 'bioextratus' && (
            <>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de Produto</h4>
                <div className="space-y-2">
                  {categoryConfig.productTypes?.map((type) => (
                    <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.bioProductTypes?.includes(type.value) || false}
                        onChange={() => handleArrayFilterChange('bioProductTypes', type.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de Cabelo</h4>
                <div className="space-y-2">
                  {categoryConfig.hairTypes?.map((hairType) => (
                    <label key={hairType.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hairType?.includes(hairType.value) || false}
                        onChange={() => handleArrayFilterChange('hairType', hairType.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{hairType.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Ingredientes Ativos</h4>
                <div className="space-y-2">
                  {categoryConfig.activeIngredients?.map((ingredient) => (
                    <label key={ingredient.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.bioActiveIngredients?.includes(ingredient.value) || false}
                        onChange={() => handleArrayFilterChange('bioActiveIngredients', ingredient.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{ingredient.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de Tratamento</h4>
                <div className="space-y-2">
                  {categoryConfig.treatmentTypes?.map((treatment) => (
                    <label key={treatment.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.bioTreatmentTypes?.includes(treatment.value) || false}
                        onChange={() => handleArrayFilterChange('bioTreatmentTypes', treatment.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{treatment.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Filtros específicos para HIDRATAÇÃO (atualizado) */}
          {activeCategory === 'hidratacao' && (
            <>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de Produto</h4>
                <div className="space-y-2">
                  {categoryConfig.productTypes?.map((type) => (
                    <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hydrationProductTypes?.includes(type.value) || false}
                        onChange={() => handleArrayFilterChange('hydrationProductTypes', type.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Benefícios</h4>
                <div className="space-y-2">
                  {categoryConfig.benefits?.map((benefit) => (
                    <label key={benefit.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.benefits?.includes(benefit.value) || false}
                        onChange={() => handleArrayFilterChange('benefits', benefit.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{benefit.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Ingredientes Ativos</h4>
                <div className="space-y-2">
                  {categoryConfig.activeIngredients?.map((ingredient) => (
                    <label key={ingredient.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hydrationActiveIngredients?.includes(ingredient.value) || false}
                        onChange={() => handleArrayFilterChange('hydrationActiveIngredients', ingredient.value)}
                        className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                      />
                      <span className="text-gray-700">{ingredient.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </FilterSection>
    );
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors shadow-sm"
        >
          <SlidersHorizontal className="w-5 h-5 text-pink-500" />
          <span className="font-medium">Filtros de {categoryConfig.name}</span>
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
              <h2 className="text-lg font-semibold text-gray-900">Filtros de {categoryConfig.name}</h2>
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
                placeholder={`Busque ${categoryConfig.name.toLowerCase()}...`}
                className="w-full pl-10 pr-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-colors"
              />
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
              {categoryConfig.brands.map((brand) => (
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

          {/* Category-specific filters */}
          {renderSpecificFilters()}

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
              <h2 className="text-lg font-semibold text-gray-900">Filtros de {categoryConfig.name}</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Mobile filter content - simplified */}
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
                    placeholder={`Busque ${categoryConfig.name.toLowerCase()}...`}
                    className="w-full pl-10 pr-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              {/* Quick brand filters for mobile */}
              <div className="grid grid-cols-2 gap-3">
                {categoryConfig.brands.slice(0, 6).map((brand) => (
                  <label key={brand.value} className="flex items-center gap-2 p-3 border border-pink-200 rounded-lg cursor-pointer hover:bg-pink-50">
                    <input
                      type="checkbox"
                      checked={filters.brand?.includes(brand.value) || false}
                      onChange={() => handleArrayFilterChange('brand', brand.value)}
                      className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-300"
                    />
                    <span className="text-sm text-gray-700">{brand.label}</span>
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