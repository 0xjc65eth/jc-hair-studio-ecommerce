'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter, X, ShoppingCart, Heart, Eye, Star } from 'lucide-react';

// Estrutura de dados para os produtos
interface MegaHairProduct {
  id: number;
  name: string;
  type: 'liso' | 'ondulado' | 'cacheado' | 'crespo';
  color: 'loiro' | 'castanho' | 'preto' | 'ruivo' | 'colorido' | 'ombre';
  length: number; // em cm
  price: number;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  origin: string;
  weight: number; // em gramas
}

// Tabela de preços baseada no comprimento
const priceTable: Record<number, number> = {
  30: 60.00,
  40: 78.00,
  50: 101.40,
  60: 131.82,
  70: 171.37,
  80: 222.78,
  90: 289.61
};

// Gerar produtos com base nas imagens baixadas
const generateProducts = (): MegaHairProduct[] => {
  const types: Array<'liso' | 'ondulado' | 'cacheado' | 'crespo'> = ['liso', 'ondulado', 'cacheado', 'crespo'];
  const colors: Array<'loiro' | 'castanho' | 'preto' | 'ruivo' | 'colorido' | 'ombre'> = ['loiro', 'castanho', 'preto', 'ruivo', 'colorido', 'ombre'];
  const lengths = [30, 40, 50, 60, 70, 80, 90];
  const badges = ['MAIS VENDIDO', 'PREMIUM', 'EXCLUSIVO', 'NOVO', 'LUXO', ''];
  const origins = ['Brasil', 'Europa', 'Ásia', 'Índia'];

  const products: MegaHairProduct[] = [];

  for (let i = 1; i <= 76; i++) {
    const typeIndex = (i - 1) % types.length;
    const colorIndex = (i - 1) % colors.length;
    const lengthIndex = (i - 1) % lengths.length;
    const badgeIndex = (i - 1) % badges.length;
    const originIndex = (i - 1) % origins.length;

    const colorNames: Record<string, string[]> = {
      'loiro': ['Platinado', 'Dourado', 'Mel', 'Champagne', 'Acinzentado'],
      'castanho': ['Claro', 'Médio', 'Escuro', 'Chocolate', 'Caramelo'],
      'preto': ['Natural', 'Azulado', 'Intenso', 'Ébano', 'Profundo'],
      'ruivo': ['Acobreado', 'Cereja', 'Borgonha', 'Natural', 'Flamejante'],
      'colorido': ['Rosa', 'Azul', 'Roxo', 'Verde', 'Arco-íris'],
      'ombre': ['Loiro', 'Caramelo', 'Rose Gold', 'Cinza', 'Platinado']
    };

    const typeNames: Record<string, string> = {
      'liso': 'Liso',
      'ondulado': 'Ondulado',
      'cacheado': 'Cacheado',
      'crespo': 'Crespo'
    };

    const colorVariant = colorNames[colors[colorIndex]][(i - 1) % 5];
    const productName = `Mega Hair ${typeNames[types[typeIndex]]} ${colorVariant}`;

    products.push({
      id: i,
      name: productName,
      type: types[typeIndex],
      color: colors[colorIndex],
      length: lengths[lengthIndex],
      price: priceTable[lengths[lengthIndex]],
      image: `/images/mega-hair/mega-hair-${i}.jpg`,
      badge: badges[badgeIndex] || undefined,
      rating: 4 + Math.random(),
      reviews: Math.floor(Math.random() * 200) + 50,
      inStock: Math.random() > 0.1,
      origin: origins[originIndex],
      weight: 100
    });
  }

  return products;
};

export default function MegaHairCatalog() {
  const [products] = useState<MegaHairProduct[]>(generateProducts());
  const [filteredProducts, setFilteredProducts] = useState<MegaHairProduct[]>(products);
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'todos' as string,
    color: 'todos' as string,
    length: 'todos' as string,
    priceRange: 'todos' as string
  });
  const [showFilters, setShowFilters] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<MegaHairProduct | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);

  // Carousel images for hero section
  const carouselImages = [
    { src: '/images/mega-hair/mega-hair-1.jpg', title: 'MEGA HAIR PREMIUM', subtitle: 'Cabelos 100% Naturais Importados' },
    { src: '/images/mega-hair/mega-hair-2.jpg', title: 'QUALIDADE EUROPEIA', subtitle: 'Seleção Premium com Garantia de Origem' },
    { src: '/images/mega-hair/mega-hair-3.jpg', title: 'TODOS OS ESTILOS', subtitle: 'Liso, Ondulado, Cacheado - De 30cm a 90cm' }
  ];

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Filter products
  useEffect(() => {
    let filtered = [...products];

    if (selectedFilters.type !== 'todos') {
      filtered = filtered.filter(p => p.type === selectedFilters.type);
    }
    if (selectedFilters.color !== 'todos') {
      filtered = filtered.filter(p => p.color === selectedFilters.color);
    }
    if (selectedFilters.length !== 'todos') {
      filtered = filtered.filter(p => p.length === parseInt(selectedFilters.length));
    }
    if (selectedFilters.priceRange !== 'todos') {
      const [min, max] = selectedFilters.priceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        if (max) {
          return p.price >= min && p.price <= max;
        } else {
          return p.price >= min;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [selectedFilters, products]);

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product: MegaHairProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: product.id, quantity: 1 }];
    });

    // Visual feedback
    const button = document.querySelector(`#cart-btn-${product.id}`) as HTMLButtonElement;
    if (button) {
      button.textContent = 'Adicionado ✓';
      button.classList.add('bg-green-600');
      setTimeout(() => {
        button.textContent = 'Adicionar ao Carrinho';
        button.classList.remove('bg-green-600');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <div className="relative h-[70vh] overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={carouselImages[currentSlide].src}
              alt={carouselImages[currentSlide].title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-7xl font-thin tracking-widest mb-4"
                >
                  {carouselImages[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl font-light mb-8"
                >
                  {carouselImages[currentSlide].subtitle}
                </motion.p>
                <motion.button
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="px-12 py-4 bg-[#d4af37] text-white text-lg tracking-wider hover:bg-[#b8941f] transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                  EXPLORAR COLEÇÃO
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation */}
        <button
          onClick={() => setCurrentSlide(prev => (prev - 1 + carouselImages.length) % carouselImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 transition-colors rounded-full"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % carouselImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 transition-colors rounded-full"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 transition-all duration-300 ${
                index === currentSlide ? 'w-12 bg-[#d4af37]' : 'w-12 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light tracking-wider mb-4">COLEÇÃO MEGA HAIR</h2>
          <p className="text-gray-600 text-lg">Cabelos premium selecionados - Entrega em toda Europa</p>
        </div>

        {/* Filter Toggle */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-80 shrink-0"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                  <h3 className="text-xl font-semibold mb-6">Filtrar Produtos</h3>

                  {/* Type Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Textura</h4>
                    <div className="space-y-2">
                      {['todos', 'liso', 'ondulado', 'cacheado', 'crespo'].map(type => (
                        <button
                          key={type}
                          onClick={() => handleFilterChange('type', type)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                            selectedFilters.type === type
                              ? 'bg-[#d4af37] text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Cor</h4>
                    <div className="space-y-2">
                      {['todos', 'loiro', 'castanho', 'preto', 'ruivo', 'colorido', 'ombre'].map(color => (
                        <button
                          key={color}
                          onClick={() => handleFilterChange('color', color)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                            selectedFilters.color === color
                              ? 'bg-[#d4af37] text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Length Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Comprimento</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleFilterChange('length', 'todos')}
                        className={`px-3 py-2 rounded-lg transition-all ${
                          selectedFilters.length === 'todos'
                            ? 'bg-[#d4af37] text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        Todos
                      </button>
                      {[30, 40, 50, 60, 70, 80, 90].map(length => (
                        <button
                          key={length}
                          onClick={() => handleFilterChange('length', length.toString())}
                          className={`px-3 py-2 rounded-lg transition-all ${
                            selectedFilters.length === length.toString()
                              ? 'bg-[#d4af37] text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {length}cm
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Faixa de Preço</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'todos', label: 'Todos os Preços' },
                        { value: '60-100', label: '€60 - €100' },
                        { value: '100-200', label: '€100 - €200' },
                        { value: '200-300', label: '€200 - €300' },
                        { value: '300', label: 'Acima de €300' }
                      ].map(range => (
                        <button
                          key={range.value}
                          onClick={() => handleFilterChange('priceRange', range.value)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                            selectedFilters.priceRange === range.value
                              ? 'bg-[#d4af37] text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={() => setSelectedFilters({
                      type: 'todos',
                      color: 'todos',
                      length: 'todos',
                      priceRange: 'todos'
                    })}
                    className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">{filteredProducts.length} produtos encontrados</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} no carrinho
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {favorites.length} favoritos
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                >
                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden">
                    {product.badge && (
                      <span className="absolute top-3 right-3 z-10 px-3 py-1 bg-[#d4af37] text-white text-xs font-semibold rounded-full">
                        {product.badge}
                      </span>
                    )}
                    <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-gray-900/90 text-white text-sm rounded-full">
                      {product.length} cm
                    </span>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Quick Actions */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                      >
                        <Eye className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider mb-1">
                      {product.type} • {product.origin}
                    </div>
                    <h3 className="text-lg font-medium mb-2">{product.name}</h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? 'fill-current' : 'fill-none'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>

                    {/* Specs */}
                    <div className="flex gap-3 text-xs text-gray-600 mb-3">
                      <span>📏 {product.length}cm</span>
                      <span>⚖️ {product.weight}g</span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-2xl font-light text-[#d4af37]">€{product.price.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">Por 100g + Frete</div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      id={`cart-btn-${product.id}`}
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                        product.inStock
                          ? 'bg-gray-900 text-white hover:bg-[#d4af37] transform hover:-translate-y-0.5'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {product.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum produto encontrado com os filtros selecionados.</p>
                <button
                  onClick={() => setSelectedFilters({
                    type: 'todos',
                    color: 'todos',
                    length: 'todos',
                    priceRange: 'todos'
                  })}
                  className="mt-4 px-6 py-3 bg-[#d4af37] text-white rounded-lg hover:bg-[#b8941f] transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h2 className="text-2xl font-light">Detalhes do Produto</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                <div className="relative h-96 md:h-auto">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div>
                  <div className="text-sm text-[#d4af37] font-semibold uppercase tracking-wider mb-2">
                    {selectedProduct.type} • {selectedProduct.origin}
                  </div>
                  <h3 className="text-3xl font-light mb-4">{selectedProduct.name}</h3>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'fill-none'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">{selectedProduct.reviews} avaliações</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Comprimento</span>
                      <span className="font-medium">{selectedProduct.length} cm</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Peso</span>
                      <span className="font-medium">{selectedProduct.weight} gramas</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Origem</span>
                      <span className="font-medium">{selectedProduct.origin}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Disponibilidade</span>
                      <span className={`font-medium ${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedProduct.inStock ? 'Em estoque' : 'Indisponível'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-3xl font-light text-[#d4af37] mb-1">€{selectedProduct.price.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">Por 100g + Frete para toda Europa</div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      disabled={!selectedProduct.inStock}
                      className={`flex-1 py-4 rounded-lg font-medium transition-all duration-300 ${
                        selectedProduct.inStock
                          ? 'bg-[#d4af37] text-white hover:bg-[#b8941f]'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5 inline mr-2" />
                      {selectedProduct.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                    </button>
                    <button
                      onClick={() => toggleFavorite(selectedProduct.id)}
                      className="px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-[#d4af37] transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Informações de Entrega</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Entrega em toda Europa em 5-10 dias úteis</li>
                      <li>• Frete grátis para pedidos acima de €500</li>
                      <li>• Embalagem discreta e segura</li>
                      <li>• Garantia de qualidade de 30 dias</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}