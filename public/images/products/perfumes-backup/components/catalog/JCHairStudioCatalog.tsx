'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Star, Heart, ShoppingCart, Filter, Grid, List, Search,
  ChevronDown, ChevronLeft, ChevronRight, X, Eye,
  Package, Truck, Shield, Clock, AlertCircle, Euro
} from 'lucide-react';
import CategoryNavigation from '@/components/navigation/CategoryNavigation';
import productsData from '@/lib/data/products-reorganized.json';

// Types
interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  shortDesc: string;
  description: string;
  price_brl: number;
  price_eur: number;
  comparePrice_eur?: number;
  sku: string;
  category: string;
  subcategory: string;
  tags: string[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockQuantity: number;
  weight: number;
  volume?: string;
  duration?: string;
  labels: string[];
  images: Array<{
    url: string;
    alt: string;
    isMain: boolean;
  }>;
  variants?: Array<{
    color?: string;
    shade?: string;
    type?: string;
    size?: string;
    hex?: string;
    price_eur: number;
    stock: number;
  }>;
  characteristics: string[];
  hair_types?: string[];
  active_ingredients?: string[];
}

interface CartItem {
  productId: string;
  name: string;
  brand: string;
  price_eur: number;
  image: string;
  quantity: number;
  variant?: any;
}

/**
 * JC Hair Studio Catalog Component
 * Features: 3-category navigation, image carousel, EUR pricing, advanced filtering
 */
const JCHairStudioCatalog: React.FC = () => {
  // State management
  const [activeCategory, setActiveCategory] = useState('hidratacao');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{[key: string]: number}>({});

  // Filters
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [] as string[],
    priceRange: { min: 0, max: 200 },
    characteristics: [] as string[],
    inStockOnly: false
  });

  // Get all products and organize by category
  const allProducts = useMemo(() => {
    const products: Product[] = [];
    if (productsData?.categories) {
      Object.entries(productsData.categories).forEach(([categoryKey, category]) => {
        if (category?.products) {
          category.products.forEach(product => {
            products.push({
              ...product as Product,
              category: category.name,
              subcategory: category.name
            });
          });
        }
      });
    }
    return products;
  }, []);

  // Convert categories object to array for compatibility
  const categoriesArray = useMemo(() => {
    if (!productsData.categories) {
      return [];
    }
    return Object.entries(productsData.categories).map(([key, category]) => ({
      id: key,
      name: category.name,
      icon: category.icon || '📦',
      subcategories: [] // No subcategories in this structure
    }));
  }, []);

  // Filter products based on active category and filters
  const filteredProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) {
      return [];
    }

    let products = allProducts.filter(product => {
      if (!product) return false;

      const categoryMatch = product.category?.toLowerCase() ===
        categoriesArray.find(c => c.id === activeCategory)?.name?.toLowerCase();

      const subcategoryMatch = !activeSubcategory ||
        product.subcategory?.toLowerCase() === activeSubcategory.toLowerCase();

      return categoryMatch && subcategoryMatch;
    });

    // Apply search filter
    if (searchTerm) {
      products = products.filter(product =>
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.tags?.some(tag => tag?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply other filters
    if (selectedFilters.brands.length > 0) {
      products = products.filter(product =>
        product?.brand && selectedFilters.brands.includes(product.brand)
      );
    }

    if (selectedFilters.priceRange) {
      products = products.filter(product =>
        product?.price_eur &&
        product.price_eur >= selectedFilters.priceRange.min &&
        product.price_eur <= selectedFilters.priceRange.max
      );
    }

    if (selectedFilters.characteristics.length > 0) {
      products = products.filter(product =>
        product?.characteristics && selectedFilters.characteristics.some(char =>
          product.characteristics.some(pChar =>
            pChar?.toLowerCase().includes(char.toLowerCase())
          )
        )
      );
    }

    if (selectedFilters.inStockOnly) {
      products = products.filter(product => product.inStock && product.stockQuantity > 0);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price_eur - b.price_eur);
        break;
      case 'price-high':
        products.sort((a, b) => b.price_eur - a.price_eur);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.sort((a, b) => b.stockQuantity - a.stockQuantity);
        break;
      case 'brand':
        products.sort((a, b) => a.brand.localeCompare(b.brand));
        break;
      default:
        // Keep original order for featured
        break;
    }

    return products;
  }, [allProducts, activeCategory, activeSubcategory, searchTerm, selectedFilters, sortBy]);

  // Initialize image carousel indexes
  useEffect(() => {
    const indexes: {[key: string]: number} = {};
    allProducts.forEach(product => {
      if (product.images && product.images.length > 1) {
        indexes[product.id] = 0;
      }
    });
    setCurrentImageIndexes(indexes);
  }, [allProducts]);

  // Image carousel navigation
  const handleImageChange = (productId: string, direction: 'next' | 'prev') => {
    const product = allProducts.find(p => p.id === productId);
    if (!product || !product.images || product.images.length <= 1) return;

    const currentIndex = currentImageIndexes[productId] || 0;
    const maxIndex = product.images.length - 1;

    let newIndex;
    if (direction === 'next') {
      newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    }

    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: newIndex
    }));
  };

  // Cart management
  const addToCart = (product: Product, variant?: any) => {
    const price = variant?.price_eur || product.price_eur;
    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price_eur: price,
      image: product.images[0]?.url || '/placeholder.jpg',
      quantity: 1,
      variant
    };

    setCart(prev => {
      const existing = prev.find(item =>
        item.productId === product.id &&
        JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      if (existing) {
        return prev.map(item =>
          item.productId === product.id &&
          JSON.stringify(item.variant) === JSON.stringify(variant)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, cartItem];
    });
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price_eur * item.quantity), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Get unique brands for filters
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    filteredProducts.forEach(product => brands.add(product.brand));
    return Array.from(brands).sort();
  }, [filteredProducts]);

  /**
   * Product Card Component with Enhanced Carousel
   */
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const [selectedVariant, setSelectedVariant] = useState(0);
    const isFavorite = favorites.includes(product.id);
    const currentImageIndex = currentImageIndexes[product.id] || 0;
    const hasMultipleImages = product.images && product.images.length > 1;
    const isLowStock = product.stockQuantity < 10;

    const currentImage = product.images?.[currentImageIndex];
    const currentVariantData = product.variants?.[selectedVariant];
    const displayPrice = currentVariantData?.price_eur || product.price_eur;

    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group relative border border-gray-100">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {product.labels.map((label, idx) => (
            <span
              key={idx}
              className={`px-2 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                label === 'NOVO' ? 'bg-green-500' :
                label === 'DESTAQUE' ? 'bg-amber-500' :
                label === 'PREMIUM' ? 'bg-purple-600' :
                label === 'VEGANO' ? 'bg-emerald-500' :
                label === 'EU COMPLIANT' ? 'bg-blue-600' :
                'bg-gray-600'
              }`}
            >
              {label}
            </span>
          ))}
          {isLowStock && (
            <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
              Últimas {product.stockQuantity}!
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(product.id)}
          className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
        >
          <Heart
            size={18}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}
          />
        </button>

        {/* Image Container with Carousel */}
        <div className="relative h-72 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {currentImage ? (
            <>
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.jpg';
                }}
              />

              {/* Carousel Controls */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={() => handleImageChange(product.id, 'prev')}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => handleImageChange(product.id, 'next')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <ChevronRight size={16} />
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndexes(prev => ({
                          ...prev,
                          [product.id]: index
                        }))}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package size={48} />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Brand */}
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">
            {product.brand}
          </p>

          {/* Product Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.shortDesc}
          </p>

          {/* Variants Selection */}
          {product.variants && product.variants.length > 1 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">
                {product.variants[0].color ? 'Cores:' :
                 product.variants[0].shade ? 'Tons:' :
                 product.variants[0].size ? 'Tamanhos:' : 'Variações:'}
              </p>
              <div className="flex flex-wrap gap-1">
                {product.variants.slice(0, 4).map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariant(idx)}
                    className={`text-xs px-2 py-1 rounded-md border transition-all ${
                      selectedVariant === idx
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {variant.color || variant.shade || variant.size || variant.type}
                  </button>
                ))}
                {product.variants.length > 4 && (
                  <span className="text-xs text-gray-400 px-2 py-1">
                    +{product.variants.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {product.rating} ({product.reviewsCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Euro size={16} className="text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">
                  {displayPrice.toFixed(2)}
                </span>
              </div>
              {product.comparePrice_eur && (
                <span className="text-sm text-gray-500 line-through">
                  €{product.comparePrice_eur.toFixed(2)}
                </span>
              )}
              <p className="text-xs text-gray-500 mt-1">
              </p>
            </div>
            {product.stockQuantity <= 20 && (
              <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                {product.stockQuantity} em estoque
              </span>
            )}
          </div>

          {/* Key Characteristics */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {product.characteristics.slice(0, 3).map((char, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full"
                >
                  {char}
                </span>
              ))}
              {product.characteristics.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{product.characteristics.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => addToCart(product, currentVariantData)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ShoppingCart size={16} />
              Adicionar
            </button>
            <button
              onClick={() => setSelectedProduct(product)}
              className="p-3 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
            >
              <Eye size={16} className="text-gray-600 group-hover:text-purple-600" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">JC Hair Studio</h1>
              <p className="text-purple-100">Cosméticos Premium Europeus</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-all">
                <Heart size={20} />
                <span className="font-medium">{favorites.length}</span>
              </button>
              <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-all">
                <ShoppingCart size={20} />
                <span className="font-medium">{cartCount} (€{cartTotal.toFixed(2)})</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Buscar produtos, marcas, características..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 rounded-2xl text-gray-800 placeholder-gray-400 shadow-lg border-0 focus:ring-4 focus:ring-white/20 focus:outline-none"
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <CategoryNavigation
        categories={categoriesArray}
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        onCategoryChange={setActiveCategory}
        onSubcategoryChange={setActiveSubcategory}
        showSubcategories={true}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200"
            >
              <Filter size={20} />
              Filtros
              {(selectedFilters.brands.length > 0 || selectedFilters.characteristics.length > 0) && (
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                  {selectedFilters.brands.length + selectedFilters.characteristics.length}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white rounded-xl shadow-md border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="featured">Destaques</option>
              <option value="price-low">Menor Preço</option>
              <option value="price-high">Maior Preço</option>
              <option value="rating">Melhor Avaliação</option>
              <option value="brand">Marca A-Z</option>
              <option value="newest">Mais Recente</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white border border-gray-200 hover:border-purple-300'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white border border-gray-200 hover:border-purple-300'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600 font-medium">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''} em{' '}
            <span className="font-bold text-purple-600">
              {categoriesArray.find(c => c.id === activeCategory)?.name}
            </span>
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              <X size={16} />
              Limpar busca
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8'
            : 'space-y-6'
          }>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <AlertCircle size={64} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Tente ajustar os filtros ou buscar por outros termos para encontrar o que procura.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedFilters({
                  brands: [],
                  priceRange: { min: 0, max: 200 },
                  characteristics: [],
                  inStockOnly: false
                });
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>

      {/* Statistics Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {productsData.metadata.totalProducts}+
              </div>
              <div className="text-gray-600">Produtos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {availableBrands.length}+
              </div>
              <div className="text-gray-600">Marcas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                3-5
              </div>
              <div className="text-gray-600">Dias de Entrega</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                100%
              </div>
              <div className="text-gray-600">Produtos Originais</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JCHairStudioCatalog;