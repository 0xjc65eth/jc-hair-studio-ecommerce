'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import ProductCard from '../../components/products/ProductCard';
import { useCart } from '../../lib/stores/cartStore'; // Import cart store for shopping cart functionality
import { ShoppingBag, Search, Filter, Heart, Eye, Shuffle, Grid, List, Palette, Sparkles, Droplets, Brush } from 'lucide-react';
import { allTintasCapilares } from '../../lib/data/tintasCapilares';
import { allEsmaltesImpala } from '../../lib/data/esmaltesImpala';
import { allPerfumesWepink } from '../../lib/data/perfumesWepink';

// Dados dos produtos profissionalmente organizados
const tintasCapilares = allTintasCapilares;
const esmaltesImpala = allEsmaltesImpala;
const perfumesWepink = allPerfumesWepink;

// Todos os produtos organizados por categoria
const allProducts = {
  tintas: tintasCapilares,
  esmaltes: esmaltesImpala,
  perfumes: perfumesWepink
};

// Marcas por categoria
const marcasTintas = [
  { value: 'Biocolor', label: 'Biocolor', count: 0 },
  { value: 'Wella', label: 'Wella', count: 0 },
  { value: 'Alfaparf', label: 'Alfaparf', count: 0 }
];

const marcasEsmaltes = [
  { value: 'IMPALA', label: 'IMPALA', count: 0 }
];

const marcasPerfumes = [
  { value: 'WEPINK', label: 'WEPINK', count: 0 }
];

// Categorias por seção
const categoriasTintas = [
  { value: 'coloracao-permanente', label: 'Coloração Permanente' },
  { value: 'coloracao-sem-amonia', label: 'Sem Amônia' },
  { value: 'coloracao-profissional', label: 'Profissional' },
  { value: 'coloracao-premium', label: 'Premium' }
];

const categoriasEsmaltes = [
  { value: 'esmalte-cremoso', label: 'Cremoso' },
  { value: 'esmalte-perolado', label: 'Perolado' },
  { value: 'esmalte-glitter', label: 'Glitter' },
  { value: 'base-tratamento', label: 'Base e Tratamento' }
];

const categoriasPerfumes = [
  { value: 'desodorante-colonia', label: 'Desodorante Colônia' },
  { value: 'colonia-infantil', label: 'Colônia Infantil' }
];

// Filtros específicos por categoria
const familiasCorEsmaltes = [
  { value: 'Rosa', label: 'Rosa', color: '#FFB6C1' },
  { value: 'Vermelho', label: 'Vermelho', color: '#DC143C' },
  { value: 'Azul', label: 'Azul', color: '#4169E1' },
  { value: 'Neutro', label: 'Neutro', color: '#D3D3D3' },
  { value: 'Marrom', label: 'Marrom', color: '#8B4513' },
  { value: 'Roxo', label: 'Roxo', color: '#8B008B' },
  { value: 'Verde', label: 'Verde', color: '#32CD32' },
  { value: 'Clássico', label: 'Clássico', color: '#000000' }
];

const publicosPerfumes = [
  { value: 'Feminino', label: 'Feminino' },
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Unissex', label: 'Unissex' },
  { value: 'Infantil', label: 'Infantil' }
];

const faixasPreco = [
  { value: '20-30', label: '€20 - €30' },
  { value: '30-50', label: '€30 - €50' },
  { value: '50-70', label: '€50 - €70' },
  { value: '70+', label: '€70+' }
];

// Componente principal
export default function CosmeticosPage() {
  // Estados para filtros - três categorias
  const [activeSection, setActiveSection] = useState('tintas');
  const [filteredProducts, setFilteredProducts] = useState(allProducts.tintas);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [wishlistIds, setWishlistIds] = useState([]);

  // Cart functionality - Initialize cart store and actions
  const { addItem, openCart } = useCart();

  /**
   * Add product to shopping cart
   * Converts the product data format to match cart item structure
   * Opens cart drawer after successful addition for immediate user feedback
   * @param {Object} product - Product object from any category
   */
  const handleAddToCart = (product) => {
    // Convert product format to cart item format
    const cartItem = {
      productId: product.id,
      product: {
        id: product.id,
        name: product.nome,
        price: product.pricing.discountPrice, // Use discounted price
        images: [
          {
            url: product.images ? product.images[0] : product.imagem || '/placeholder-product.jpg',
            alt: product.nome,
            isMain: true
          }
        ],
        category: product.categoria,
        description: product.descricao
      },
      quantity: 1, // Default quantity for new items
      variant: null // No variants for cosmetic products
    };

    // Add item to cart store (automatically saves to localStorage)
    addItem(cartItem);

    // Open cart drawer to provide immediate visual feedback
    openCart();
  };

  // Aplicar filtros
  useEffect(() => {
    // Selecionar produtos baseado na seção ativa
    let baseProducts = [...allProducts[activeSection]];

    let filtered = baseProducts;

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(product => {
        const searchFields = [
          product.nome,
          product.marca,
          product.cor,
          product.tom || '',
          product.familiaCorr || '',
          product.publico || ''
        ];
        return searchFields.some(field =>
          field.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filtro por marca
    if (selectedBrand) {
      filtered = filtered.filter(product =>
        product.marca === selectedBrand
      );
    }

    // Filtro por categoria
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.subcategoria === selectedCategory
      );
    }

    // Filtro por cor (específico para cada tipo)
    if (selectedColor) {
      filtered = filtered.filter(product => {
        if (activeSection === 'esmaltes') {
          return product.familiaCorr === selectedColor;
        } else if (activeSection === 'perfumes') {
          return product.publico === selectedColor;
        } else {
          return product.cor.toLowerCase().includes(selectedColor.toLowerCase());
        }
      });
    }

    // Filtro por preço
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
        filtered.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        break;
      case 'brand':
        filtered.sort((a, b) => a.marca.localeCompare(b.marca));
        break;
      default:
        filtered.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    setFilteredProducts(filtered);
  }, [activeSection, searchTerm, selectedBrand, selectedCategory, selectedColor, selectedPriceRange, sortBy]);

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

  // Obter marcas baseado na seção ativa
  const getAvailableBrands = () => {
    switch (activeSection) {
      case 'esmaltes':
        return marcasEsmaltes;
      case 'perfumes':
        return marcasPerfumes;
      default:
        return marcasTintas;
    }
  };

  // Obter categorias baseado na seção ativa
  const getAvailableCategories = () => {
    switch (activeSection) {
      case 'esmaltes':
        return categoriasEsmaltes;
      case 'perfumes':
        return categoriasPerfumes;
      default:
        return categoriasTintas;
    }
  };

  // Obter filtros de cor baseado na seção ativa
  const getColorFilters = () => {
    switch (activeSection) {
      case 'esmaltes':
        return familiasCorEsmaltes;
      case 'perfumes':
        return publicosPerfumes;
      default:
        return [];
    }
  };

  // Obter título da seção
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'esmaltes':
        return 'Esmaltes IMPALA';
      case 'perfumes':
        return 'Perfumes WEPINK';
      default:
        return 'Tintas Capilares';
    }
  };

  // Obter descrição da seção
  const getSectionDescription = () => {
    switch (activeSection) {
      case 'esmaltes':
        return 'Coleção completa de esmaltes IMPALA brasileiros com cores autênticas';
      case 'perfumes':
        return 'Perfumes brasileiros WEPINK para todos os públicos e ocasiões';
      default:
        return 'Tintas capilares profissionais das melhores marcas';
    }
  };

  // Obter ícone da seção
  const getSectionIcon = () => {
    switch (activeSection) {
      case 'esmaltes':
        return Brush;
      case 'perfumes':
        return Droplets;
      default:
        return Palette;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              {React.createElement(getSectionIcon(), { className: 'w-8 h-8 mr-3' })}
              <h1 className="text-4xl md:text-5xl font-bold">
                {getSectionTitle()}
              </h1>
            </div>
            <p className="text-xl mb-8 opacity-90">
              {getSectionDescription()}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span>{filteredProducts.length} produtos disponíveis</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Imagens Reais dos Rótulos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs - Três Categorias */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 py-4 overflow-x-auto">
            <button
              onClick={() => {
                setActiveSection('tintas');
                clearAllFilters();
              }}
              className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
                activeSection === 'tintas'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              🎨 Tintas Capilares ({allProducts.tintas.length})
            </button>
            <button
              onClick={() => {
                setActiveSection('esmaltes');
                clearAllFilters();
              }}
              className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
                activeSection === 'esmaltes'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              💅 Esmaltes IMPALA ({allProducts.esmaltes.length})
            </button>
            <button
              onClick={() => {
                setActiveSection('perfumes');
                clearAllFilters();
              }}
              className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
                activeSection === 'perfumes'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              🌸 Perfumes WEPINK ({allProducts.perfumes.length})
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Sidebar com filtros */}
          <div className="lg:w-80 flex-shrink-0 mb-8 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 sticky top-4 overflow-hidden">
              {/* Header dos filtros */}
              <div className="flex items-center justify-between p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                </div>
                {(searchTerm || selectedBrand || selectedCategory || selectedColor || selectedPriceRange) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-purple-600 hover:text-purple-700 transition-colors font-medium"
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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nome, marca, tom..."
                      className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
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

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeSection === 'tintas' ? 'Tipo de Coloração' :
                     activeSection === 'esmaltes' ? 'Acabamento' : 'Tipo'}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="">Todos os tipos</option>
                    {getAvailableCategories().map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cores/Filtros específicos */}
                {getColorFilters().length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {activeSection === 'esmaltes' ? 'Família de Cor' : 'Público-Alvo'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {getColorFilters().map(item => (
                        <button
                          key={item.value}
                          onClick={() => setSelectedColor(selectedColor === item.value ? '' : item.value)}
                          className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                            selectedColor === item.value
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          {item.color && (
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.color }}
                            />
                          )}
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preço */}
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

              {/* Contador de resultados */}
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

          {/* Área principal de produtos */}
          <div className="flex-1">
            {/* Controles de ordenação */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600">
                Mostrando {filteredProducts.length} de {allProducts[activeSection].length} produtos
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
                      <Link href={`/produto/${product.id}`}>
                        <img
                          src={product.images ? product.images[0] : product.imagem || '/placeholder-product.jpg'}
                          alt={product.nome}
                          className="w-full h-48 object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </Link>
                      {product.badge && (
                        <span className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
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
                      <div className="text-xs text-purple-600 font-medium mb-1">
                        {product.marca}
                      </div>
                      <Link href={`/produto/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition-colors cursor-pointer">
                          {product.nome}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-2">
                        {product.tom && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            Tom {product.tom}
                          </span>
                        )}
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                          {product.cor}
                        </span>
                        {product.volume && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            {product.volume}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating || 4.5)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </div>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.reviewsCount || 127})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-purple-600">
                            €{product.pricing.discountPrice.toFixed(2)}
                          </div>
                          {product.pricing.savings > 0 && (
                            <div className="text-xs text-gray-500 line-through">
                              €{product.pricing.ourPrice.toFixed(2)}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => handleAddToCart(product)} // Add product to cart when clicked
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm"
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

      {/* Seção de benefícios */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher nossos cosméticos?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Organizamos profissionalmente cada categoria com produtos autênticos e preços exclusivos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold mb-2">Tintas Profissionais</h3>
              <p className="text-sm text-gray-600">Biocolor, Wella e Alfaparf com alta cobertura</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💅</span>
              </div>
              <h3 className="font-semibold mb-2">Esmaltes IMPALA</h3>
              <p className="text-sm text-gray-600">54+ cores brasileiras organizadas por família</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌸</span>
              </div>
              <h3 className="font-semibold mb-2">Perfumes WEPINK</h3>
              <p className="text-sm text-gray-600">33 fragrâncias para todos os públicos</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-semibold mb-2">Separação Profissional</h3>
              <p className="text-sm text-gray-600">Cada categoria totalmente organizada</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}