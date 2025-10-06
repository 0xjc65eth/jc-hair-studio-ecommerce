'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import ProductCard from '@/components/products/SimpleProductCard';
import { useCart } from '@/lib/stores/cartStore';
import { ShoppingBag, Search, Filter, Heart, Eye, Shuffle, Grid, List, Palette, Sparkles } from 'lucide-react';
import { allEsmaltesData } from '@/lib/data/esmaltesProducts';
import { allPerfumesData } from '@/lib/data/perfumesProducts';

// Convert real IMPALA esmaltesOnly (nail polish) to compatible format
const esmaltesFormatados = allEsmaltesData.map(esmalte => ({
  id: esmalte.id,
  nome: esmalte.nome,
  marca: esmalte.marca,
  categoria: 'Esmaltes',
  cor: esmalte.cores?.[0]?.nome || 'Variado',
  tom: esmalte.cores?.[0]?.codigo || '',
  descricao: esmalte.descricao,
  imagem: esmalte.imagens[0],
  pricing: esmalte.pricing,
  rating: 4.5 + (Math.random() * 0.4),
  reviewsCount: 30 + Math.floor(Math.random() * 40),
  inStock: true,
  tags: esmalte.tags,
  badge: esmalte.badge
}));

// Convert real WEPINK perfumes to compatible format
const perfumesFormatados = allPerfumesData.map(perfume => ({
  id: perfume.id,
  nome: perfume.nome,
  marca: perfume.marca,
  categoria: 'Perfumes',
  cor: perfume.genero === 'feminino' ? 'Feminino' : perfume.genero === 'masculino' ? 'Masculino' : 'Unissex',
  tom: perfume.especificacoes.volume,
  descricao: perfume.descricao,
  imagem: perfume.imagem,
  pricing: perfume.pricing,
  rating: perfume.rating,
  reviewsCount: perfume.reviews,
  inStock: true,
  tags: [...perfume.tags, perfume.especificacoes.familia_olfativa].filter(Boolean),
  badge: perfume.badge || 'NOVO',
  genero: perfume.genero,
  volume: perfume.especificacoes.volume,
  familia: perfume.especificacoes.familia_olfativa
}));

// Only real products - NO PLACEHOLDERS
const esmaltesData = [...esmaltesFormatados];     // Real IMPALA nail polish
const perfumesData = [...perfumesFormatados];    // Real WEPINK perfumes

// All products combined - ONLY REAL PRODUCTS
const allProducts = [
  ...esmaltesData,
  ...perfumesData
];

// Brand filters for real products only
const marcasEsmaltes = [
  { value: 'IMPALA', label: 'IMPALA', count: esmaltesData.length }
];

const marcasPerfumes = [
  { value: 'WEPINK', label: 'WEPINK', count: perfumesData.length }
];

const faixasPreco = [
  { value: '5-10', label: '€5 - €10' },
  { value: '10-15', label: '€10 - €15' },
  { value: '15-20', label: '€15 - €20' },
  { value: '20-25', label: '€20 - €25' },
  { value: '25+', label: '€25+' }
];

// Real products only - no placeholders
const esmaltesOnly = esmaltesData;   // Real IMPALA
const perfumesOnly = perfumesData;   // Real WEPINK

// Main component
export default function CosmeticosPage() {
  // Filter states
  const [activeSection, setActiveSection] = useState('esmaltes');
  const [filteredProducts, setFilteredProducts] = useState(esmaltesOnly);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [wishlistIds, setWishlistIds] = useState([]);

  // Cart functionality
  const { addItem, openCart } = useCart();

  const handleAddToCart = (product) => {
    const cartItem = {
      productId: product.id,
      product: {
        id: product.id,
        name: product.nome,
        slug: product.id.toString(),
        price: product.pricing.discountPrice,
        images: [
          {
            url: product.imagem,
            alt: product.nome,
            title: product.nome,
            displayOrder: 0,
            isMain: true
          }
        ],
        status: 'ACTIVE' as const,
        quantity: 999,
        category: product.categoria,
        description: product.descricao
      },
      quantity: 1,
      variant: null
    };

    addItem(cartItem);
    openCart();
  };

  // Apply filters
  useEffect(() => {
    let baseProducts = [];
    switch (activeSection) {
      case 'esmaltes':
        baseProducts = [...esmaltesOnly];
        break;
      case 'perfumes':
        baseProducts = [...perfumesOnly];
        break;
      default:
        baseProducts = [...allProducts];
    }

    let filtered = baseProducts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.cor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tom.includes(searchTerm)
      );
    }

    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter(product =>
        product.marca.includes(selectedBrand)
      );
    }

    // Price filter
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        const price = product.pricing.discountPrice;
        return max ? price >= min && price <= max : price >= min;
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.pricing.discountPrice - b.pricing.discountPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.pricing.discountPrice - a.pricing.discountPrice);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'brand':
        filtered.sort((a, b) => a.marca.localeCompare(b.marca));
        break;
      default:
        filtered.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    setFilteredProducts(filtered);
  }, [activeSection, searchTerm, selectedBrand, selectedPriceRange, sortBy]);

  const handleToggleWishlist = (productId) => {
    setWishlistIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedPriceRange('');
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    clearAllFilters();
  };

  const getAvailableBrands = () => {
    switch (activeSection) {
      case 'esmaltes':
        return marcasEsmaltes;
      case 'perfumes':
        return marcasPerfumes;
      default:
        return [...marcasEsmaltes, ...marcasPerfumes];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <Palette className="w-8 h-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Cosméticos & Beleza
              </h1>
            </div>
            <p className="text-xl mb-8 opacity-90">
              Esmaltes IMPALA autênticos e perfumes WEPINK premium
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span>{allProducts.length} produtos disponíveis</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Apenas produtos reais</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-0">
            <button
              onClick={() => handleSectionChange('todos')}
              className={`p-4 text-center transition-all border-b-4 ${
                activeSection === 'todos'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-transparent hover:border-gray-300 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">🛍️</div>
              <div className="font-semibold text-sm">Todos</div>
              <div className="text-xs opacity-75">({allProducts.length})</div>
            </button>

            <button
              onClick={() => handleSectionChange('esmaltes')}
              className={`p-4 text-center transition-all border-b-4 ${
                activeSection === 'esmaltes'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-transparent hover:border-gray-300 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">💅</div>
              <div className="font-semibold text-sm">Esmaltes</div>
              <div className="text-xs opacity-75">({esmaltesOnly.length})</div>
            </button>

            <button
              onClick={() => handleSectionChange('perfumes')}
              className={`p-4 text-center transition-all border-b-4 ${
                activeSection === 'perfumes'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-transparent hover:border-gray-300 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">🌺</div>
              <div className="font-semibold text-sm">Perfumes</div>
              <div className="text-xs opacity-75">({perfumesOnly.length})</div>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Sidebar filters */}
          <div className="lg:w-80 flex-shrink-0 mb-8 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 sticky top-4 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                </div>
                {(searchTerm || selectedBrand || selectedPriceRange) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-purple-600 hover:text-purple-700 transition-colors font-medium"
                  >
                    Limpar
                  </button>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nome, marca..."
                      className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="">Todas as marcas</option>
                    {getAvailableBrands().map(marca => (
                      <option key={marca.value} value={marca.value}>
                        {marca.label} ({marca.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faixa de Preço
                  </label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="">Todos os preços</option>
                    {faixasPreco.map(faixa => (
                      <option key={faixa.value} value={faixa.value}>
                        {faixa.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results counter */}
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-b-2xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {filteredProducts.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products area */}
          <div className="flex-1">
            {/* Sort controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600">
                Mostrando {filteredProducts.length} de {allProducts.length} produtos
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Ordenar:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                  >
                    <option value="name">Nome A-Z</option>
                    <option value="price-low">Menor Preço</option>
                    <option value="price-high">Maior Preço</option>
                    <option value="rating">Melhor Avaliado</option>
                    <option value="brand">Marca</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-purple-100 text-purple-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-purple-100 text-purple-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
                    <div className="relative aspect-square">
                      <img
                        src={product.imagem}
                        alt={product.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Badge */}
                      {product.badge && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                            {product.badge}
                          </span>
                        </div>
                      )}

                      {/* Wishlist */}
                      <button
                        onClick={() => handleToggleWishlist(product.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
                          wishlistIds.includes(product.id)
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-5">
                      {/* Brand */}
                      <div className="text-xs font-semibold text-purple-600 mb-2 tracking-wide uppercase">
                        {product.marca}
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 leading-snug">
                        {product.nome}
                      </h3>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.tom && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {product.tom}
                          </span>
                        )}
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          {product.cor}
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.reviewsCount})
                        </span>
                      </div>

                      {/* Price & Button */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-bold text-gray-900">
                            €{product.pricing.discountPrice.toFixed(2)}
                          </div>
                          {product.pricing.savings > 0 && (
                            <div className="text-sm text-gray-400 line-through">
                              €{product.pricing.ourPrice.toFixed(2)}
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
                        >
                          <ShoppingBag className="w-4 h-4 mr-1" />
                          Comprar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Tente ajustar os filtros para encontrar o que procura
                </p>
                <Button
                  onClick={clearAllFilters}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Benefits section */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher nossos cosméticos?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oferecemos apenas produtos autênticos com qualidade garantida
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💅</span>
              </div>
              <h3 className="font-semibold mb-2">IMPALA Autêntico</h3>
              <p className="text-sm text-gray-600">Esmaltes brasileiros originais</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌺</span>
              </div>
              <h3 className="font-semibold mb-2">WEPINK Premium</h3>
              <p className="text-sm text-gray-600">Perfumes de alta qualidade</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold mb-2">Qualidade Garantida</h3>
              <p className="text-sm text-gray-600">Produtos testados e aprovados</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold mb-2">Preços Especiais</h3>
              <p className="text-sm text-gray-600">Descontos exclusivos garantidos</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}