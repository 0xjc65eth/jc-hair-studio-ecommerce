'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import ProductCard from '../../components/products/ProductCard';
import { useCart } from '../../lib/stores/cartStore';
import { ShoppingBag, Search, Filter, Heart, Eye, Shuffle, Grid, List, Sparkles, Palette } from 'lucide-react';
// Esmaltes removidos - página vazia conforme solicitado
const allProducts = [];

// Filtros específicos para esmaltes - removidos
const marcasEsmaltes = [];

const categoriasEsmaltes = [
  { value: 'cremoso', label: 'Cremoso' },
  { value: 'metalico', label: 'Metálico' },
  { value: 'perolado', label: 'Perolado' },
  { value: 'glitter', label: 'Glitter' },
  { value: 'matte', label: 'Fosco' }
];

const coresEsmaltes = [
  { value: 'vermelho', label: 'Vermelho', color: '#DC2626' },
  { value: 'rosa', label: 'Rosa', color: '#EC4899' },
  { value: 'nude', label: 'Nude', color: '#D4A574' },
  { value: 'azul', label: 'Azul', color: '#2563EB' },
  { value: 'verde', label: 'Verde', color: '#16A34A' },
  { value: 'roxo', label: 'Roxo', color: '#9333EA' },
  { value: 'laranja', label: 'Laranja', color: '#EA580C' },
  { value: 'preto', label: 'Preto', color: '#000000' },
  { value: 'branco', label: 'Branco', color: '#FFFFFF' }
];

const faixasPreco = [
  { value: '5-10', label: '€5 - €10' },
  { value: '10-15', label: '€10 - €15' },
  { value: '15-20', label: '€15 - €20' },
  { value: '20+', label: '€20+' }
];

export default function EsmaltesPage() {
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [wishlistIds, setWishlistIds] = useState([]);

  const { addItem, openCart } = useCart();

  const handleAddToCart = (product) => {
    const cartItem = {
      productId: product.id,
      product: {
        id: product.id,
        name: product.nome,
        price: product.pricing.discountPrice,
        images: [
          {
            url: product.imagem,
            alt: product.nome,
            isMain: true
          }
        ],
        category: product.categoria,
        description: product.descricao
      },
      quantity: 1,
      variant: null
    };

    addItem(cartItem);
    openCart();
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...allProducts];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.cor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tom.includes(searchTerm)
      );
    }

    if (selectedBrand) {
      filtered = filtered.filter(product =>
        product.marca.includes(selectedBrand)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.tags.some(tag => tag.toLowerCase().includes(selectedCategory))
      );
    }

    if (selectedColor) {
      filtered = filtered.filter(product =>
        product.cor.toLowerCase().includes(selectedColor) ||
        product.tags.some(tag => tag.includes(selectedColor)) ||
        product.nome.toLowerCase().includes(selectedColor)
      );
    }

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        const price = product.pricing.discountPrice;
        return max ? price >= min && price <= max : price >= min;
      });
    }

    // Ordenação
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
  }, [searchTerm, selectedBrand, selectedCategory, selectedColor, selectedPriceRange, sortBy]);

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
    setSelectedCategory('');
    setSelectedColor('');
    setSelectedPriceRange('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página */}
      <section className="bg-gradient-to-r from-pink-500 to-rose-500 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Esmaltes IMPALA
              </h1>
            </div>
            <p className="text-xl mb-8 opacity-90">
              Coleção completa de esmaltes IMPALA com cores vibrantes e acabamentos únicos
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span>{allProducts.length} esmaltes disponíveis</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                <span>Marca Oficial IMPALA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Sidebar com filtros */}
          <div className="lg:w-80 flex-shrink-0 mb-8 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg border border-pink-100 sticky top-4 overflow-hidden">
              {/* Header dos filtros */}
              <div className="flex items-center justify-between p-6 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-pink-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                </div>
                {(searchTerm || selectedBrand || selectedCategory || selectedColor || selectedPriceRange) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-pink-600 hover:text-pink-700 transition-colors font-medium"
                  >
                    Limpar
                  </button>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Busca */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nome, cor, código..."
                      className="w-full pl-10 pr-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                </div>

                {/* Marca */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    <option value="">Todas as marcas</option>
                    {marcasEsmaltes.map(marca => (
                      <option key={marca.value} value={marca.value}>
                        {marca.label} ({marca.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acabamento
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    <option value="">Todos os acabamentos</option>
                    {categoriasEsmaltes.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cores */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cor
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {coresEsmaltes.map(cor => (
                      <button
                        key={cor.value}
                        onClick={() => setSelectedColor(selectedColor === cor.value ? '' : cor.value)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${
                          selectedColor === cor.value
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                          style={{
                            backgroundColor: cor.color,
                            border: cor.value === 'branco' ? '2px solid #e5e7eb' : `2px solid ${cor.color}`
                          }}
                        />
                        <span className="text-xs font-medium">{cor.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faixa de Preço
                  </label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
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

              {/* Contador de resultados */}
              <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-b-2xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600 mb-1">
                    {filteredProducts.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {filteredProducts.length === 1 ? 'esmalte encontrado' : 'esmaltes encontrados'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Área principal de produtos */}
          <div className="flex-1">
            {/* Controles de ordenação */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600">
                Mostrando {filteredProducts.length} de {allProducts.length} esmaltes
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Ordenar:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
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
                        ? 'bg-pink-100 text-pink-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-pink-100 text-pink-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid de produtos */}
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <div className="relative">
                      <img
                        src={product.imagem}
                        alt={product.nome}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {product.badge && (
                        <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                          {product.badge}
                        </span>
                      )}
                      <button
                        onClick={() => handleToggleWishlist(product.id)}
                        className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                          wishlistIds.includes(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="text-xs text-pink-600 font-medium mb-1">
                        {product.marca}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.nome}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {product.tom}
                        </span>
                        <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded">
                          {product.cor}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </div>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.reviewsCount})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-pink-600">
                            €{product.pricing.discountPrice.toFixed(2)}
                          </div>
                          {product.pricing.savings > 0 && (
                            <div className="text-xs text-gray-500 line-through">
                              €{product.pricing.ourPrice.toFixed(2)}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            Comprar
                          </span>
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
                  Nenhum esmalte encontrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Tente ajustar os filtros para encontrar o que procura
                </p>
                <Button
                  onClick={clearAllFilters}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção de benefícios */}
      <section className="py-16 bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher esmaltes IMPALA?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A marca preferida dos profissionais com qualidade superior e cores incríveis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💅</span>
              </div>
              <h3 className="font-semibold mb-2">Cores Vibrantes</h3>
              <p className="text-sm text-gray-600">Mais de 50 cores diferentes para todos os gostos</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold mb-2">Marca Original</h3>
              <p className="text-sm text-gray-600">Produtos IMPALA 100% originais e autênticos</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold mb-2">Longa Duração</h3>
              <p className="text-sm text-gray-600">Fórmula que garante fixação e brilho duradouros</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold mb-2">Preços Especiais</h3>
              <p className="text-sm text-gray-600">Melhores preços com descontos exclusivos</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}