'use client';

import React, { useState, useEffect } from 'react';
import { Star, Heart, ShoppingCart, Filter, Grid, List, Search, X, ChevronLeft, ChevronRight, Package, Truck, Shield, Award, Eye, Plus, Minus } from 'lucide-react';
import catalogData from '../../lib/data/complete-product-catalog.json';
import OptimizedImage from '../ui/OptimizedImage';

interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  features: string[];
  stock: number;
  rating: number;
  reviews: number;
}

interface Category {
  name: string;
  icon: string;
  products: Product[];
}

const CompleteCatalogWithCarousel = () => {
  // Load categories data first
  const categories = catalogData.categories as Record<string, Category>;

  // Função para encontrar a chave da categoria de um produto
  const findCategoryKeyForProduct = (productId: string): string => {
    for (const [categoryKey, category] of Object.entries(categories)) {
      if (category.products.some(p => p.id === productId)) {
        return categoryKey;
      }
    }
    return 'hidratacao'; // fallback
  };

  // Função para mapear categoria correta baseada na nova organização solicitada
  const getCategoryForProduct = (categoryKey: string, productName: string): string => {
    const categoryMap: { [key: string]: string } = {
      // Produtos Capilares: hidratação e tratamentos
      'hidratacao': 'hidratacao',

      // Progressiva: alisamentos e químicos
      'progressivas': 'progressivas',

      // Cosméticos: tintas + relaxamentos + maquiagem
      'tintas-loreal': 'cosmeticos',
      'tintas-amend': 'cosmeticos',
      'tintas-beauty-color': 'cosmeticos',
      'tintas-biocolor': 'cosmeticos',
      'tintas-wella': 'cosmeticos',
      'tintas-nutrisse': 'cosmeticos',
      'relaxamentos': 'cosmeticos'
    };

    if (categoryMap[categoryKey]) {
      return categoryMap[categoryKey];
    }

    // Fallback inteligente baseado no nome do produto para nova organização
    const productLower = productName.toLowerCase();

    // Cosméticos: tintas, relaxamentos, maquiagem
    if (productLower.includes('tinta') || productLower.includes('coloração') || productLower.includes('color') ||
        productLower.includes('relaxamento') || productLower.includes('relaxador') ||
        productLower.includes('maquiagem') || productLower.includes('batom') || productLower.includes('base')) {
      return 'cosmeticos';
    }

    // Progressiva: alisamentos, químicos
    if (productLower.includes('progressiva') || productLower.includes('alisamento') ||
        productLower.includes('botox') || productLower.includes('plastica')) {
      return 'progressivas';
    }

    // Produtos Capilares: hidratação, tratamentos (fallback)
    return 'hidratacao';
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<Array<Product & { quantity: number }>>([]);
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Get all products
  const getAllProducts = (): Product[] => {
    return Object.values(categories).flatMap(category => category.products);
  };

  // Get all unique brands
  const getAllBrands = (): string[] => {
    const brands = new Set(getAllProducts().map(product => product.brand));
    return Array.from(brands).sort();
  };

  // Filter products
  const getFilteredProducts = (): Product[] => {
    let products = getAllProducts();

    // Filter by category
    if (selectedCategory !== 'all') {
      products = categories[selectedCategory]?.products || [];
    }

    // Filter by brand
    if (selectedBrand !== 'all') {
      products = products.filter(product => product.brand === selectedBrand);
    }

    // Filter by search term
    if (searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by price range
    if (priceRange !== 'all') {
      products = products.filter(product => {
        if (priceRange === 'low') return product.price <= 25;
        if (priceRange === 'medium') return product.price > 25 && product.price <= 50;
        if (priceRange === 'high') return product.price > 50;
        return true;
      });
    }

    return products;
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  // Carousel Component
  const ProductCarousel = ({ images, productName, categoryKey }: { images: string[]; productName: string; categoryKey: string }) => {
    const productCategory = getCategoryForProduct(categoryKey, productName);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
      setCurrentIndex(index);
    };

    if (images.length === 1) {
      return (
        <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl overflow-hidden">
          <OptimizedImage
            src={images[0]}
            alt={productName}
            className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
            productName={productName}
            category={productCategory}
            width={400}
            height={300}
          />
        </div>
      );
    }

    return (
      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl overflow-hidden group">
        <div className="relative w-full h-full">
          <OptimizedImage
            src={images[currentIndex]}
            alt={`${productName} - Image ${currentIndex + 1}`}
            className="w-full h-full object-contain p-4 transition-all duration-500"
            productName={productName}
            category={productCategory}
            width={400}
            height={300}
          />

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            disabled={currentIndex === images.length - 1}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Image Counter */}
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
          {currentIndex + 1}/{images.length}
        </div>
      </div>
    );
  };

  // Product Card Component
  const ProductCard = ({ product }: { product: Product }) => {
    const categoryKey = findCategoryKeyForProduct(product.id);
    const productCategory = getCategoryForProduct(categoryKey, product.name);
    const discount = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
        <ProductCarousel images={product.images} productName={product.name} categoryKey={categoryKey} />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
            -{discount}%
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors z-10"
        >
          <Heart
            size={18}
            className={favorites.includes(product.id) ? "text-red-500 fill-current" : "text-gray-400"}
          />
        </button>

        {/* Quick View Button */}
        <div
          className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100 z-10"
          onClick={() => setSelectedProduct(product)}
        >
          <button className="bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg transform transition-transform hover:scale-105 flex items-center gap-2">
            <Eye size={16} />
            Ver Detalhes
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              {product.brand}
            </span>
            <span className="text-xs text-gray-500">
              {product.stock} em estoque
            </span>
          </div>

          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 min-h-[48px]">
            {product.name}
          </h3>

          <div className="flex items-center mb-3">
            {renderStars(product.rating)}
            <span className="text-xs text-gray-500 ml-2">
              {product.rating.toFixed(1)} ({product.reviews})
            </span>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.features.slice(0, 2).map((feature, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
            {product.features.length > 2 && (
              <span className="text-xs text-gray-500">+{product.features.length - 2}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through mr-2">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
              <div className="font-bold text-xl text-gray-900">
                R$ {product.price.toFixed(2)}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Product Modal Component
  const ProductModal = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!selectedProduct) return null;

    const categoryKey = findCategoryKeyForProduct(selectedProduct.id);
    const productCategory = getCategoryForProduct(categoryKey, selectedProduct.name);

    const nextModalImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.images.length);
    };

    const prevModalImage = () => {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-purple-600">
                {selectedProduct.brand}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{selectedProduct.name}</h2>
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div>
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden mb-4">
                  <OptimizedImage
                    src={selectedProduct.images[currentImageIndex]}
                    alt={selectedProduct.name}
                    className="w-full h-96 object-contain p-8"
                    productName={selectedProduct.name}
                    category={productCategory}
                    width={600}
                    height={400}
                  />

                  {selectedProduct.images.length > 1 && (
                    <>
                      <button
                        onClick={prevModalImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextModalImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {selectedProduct.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {selectedProduct.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? 'border-purple-500 ring-2 ring-purple-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <OptimizedImage
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                          productName={selectedProduct.name}
                          category={productCategory}
                          width={80}
                          height={80}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div>
                <div className="flex items-center mb-4">
                  {renderStars(selectedProduct.rating)}
                  <span className="ml-2 text-gray-600">
                    {selectedProduct.rating.toFixed(1)} • {selectedProduct.reviews} avaliações
                  </span>
                </div>

                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Características</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200"
                      >
                        <Shield size={14} className="inline mr-1" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    {selectedProduct.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">
                        R$ {selectedProduct.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-gray-900">
                      R$ {selectedProduct.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Em até 12x de R$ {(selectedProduct.price / 12).toFixed(2)} sem juros
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Adicionar ao Carrinho
                  </button>
                  <button
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Heart
                      size={20}
                      className={favorites.includes(selectedProduct.id) ? "text-red-500 fill-current" : "text-gray-400"}
                    />
                  </button>
                </div>

                {/* Stock Info */}
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Package size={16} />
                    <span>{selectedProduct.stock} unidades em estoque</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredProducts = getFilteredProducts();
  const allBrands = getAllBrands();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white py-8 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">JC Hair Studio - Catálogo Completo</h1>
          <p className="text-lg opacity-90">Produtos de Qualidade Premium para Profissionais</p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Package size={20} />
              <span className="text-sm">{getAllProducts().length} Produtos</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={20} />
              <span className="text-sm">{Object.keys(categories).length} Categorias</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={20} />
              <span className="text-sm">Entrega Rápida</span>
            </div>
            {cart.length > 0 && (
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <ShoppingCart size={20} />
                <span className="text-sm font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} itens no carrinho
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-0 bg-white shadow-md z-40 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar produtos, marcas, características..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3 border-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  showFilters
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'border-gray-200 hover:border-purple-500 hover:text-purple-500'
                }`}
              >
                <Filter size={18} />
                Filtros
              </button>

              <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 bg-gray-50 p-6 rounded-xl border-2 border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                    Categoria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="all">Todas as categorias</option>
                    {Object.entries(categories).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                    Marca
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="all">Todas as marcas</option>
                    {allBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                    Faixa de Preço
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value as any)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="all">Todas as faixas</option>
                    <option value="low">Até R$ 25,00</option>
                    <option value="medium">R$ 25,00 - R$ 50,00</option>
                    <option value="high">Acima de R$ 50,00</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedBrand('all');
                      setPriceRange('all');
                      setSearchTerm('');
                    }}
                    className="w-full px-4 py-3 text-sm text-purple-600 hover:text-purple-700 font-medium border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Mostrando <span className="font-bold text-gray-900">{filteredProducts.length}</span> de {getAllProducts().length} produtos
          </p>
        </div>

        {/* Products Grid */}
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
              <Package size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou fazer uma nova busca</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBrand('all');
                setPriceRange('all');
                setSearchTerm('');
              }}
              className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && <ProductModal />}
    </div>
  );
};

export default CompleteCatalogWithCarousel;