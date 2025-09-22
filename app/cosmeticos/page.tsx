'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../../components/ui/Button';
import ProductCard from '../../components/products/ProductCard';
import { ShoppingBag, Search, Filter, Heart, Eye, Shuffle, Grid, List, Palette, Sparkles } from 'lucide-react';

// Função para gerar dados das tintas com numeração sequencial
const gerarTintasLOreal = () => {
  const tintasLOreal = [];
  for (let i = 1; i <= 22; i++) {
    tintasLOreal.push({
      id: `loreal-${i}`,
      nome: `L'Oréal Paris Excellence Creme ${i} - Tom Profissional`,
      marca: 'L\'ORÉAL PARIS',
      categoria: 'Coloração Permanente',
      cor: i <= 5 ? 'Preto/Castanho' : i <= 10 ? 'Castanho' : i <= 15 ? 'Louro Escuro' : 'Louro Claro',
      tom: `${i}`,
      descricao: 'Coloração permanente L\'Oréal com triplo cuidado e cobertura 100% dos brancos.',
      imagem: `/images/products/tinta_loreal/tinta_loreal_${i}.PNG`,
      pricing: {
        basePrice: 12.80,
        ourPrice: 19.20,
        discountPrice: 17.28,
        savings: 1.92,
        margin: '38%'
      },
      rating: 4.5 + ((i % 4) * 0.1),
      reviewsCount: 50 + (i * 7),
      inStock: true,
      tags: ['permanente', 'cobertura total', 'loreal'],
      badge: i <= 10 ? 'BESTSELLER' : 'PREMIUM'
    });
  }
  return tintasLOreal;
};

const gerarTintasBioColor = () => {
  const tintasBioColor = [];
  for (let i = 1; i <= 23; i++) {
    tintasBioColor.push({
      id: `biocolor-${i}`,
      nome: `BioColor Coloração Creme ${i} - Tom Natural`,
      marca: 'BIOCOLOR',
      categoria: 'Coloração Creme',
      cor: i <= 6 ? 'Preto/Castanho' : i <= 12 ? 'Castanho' : i <= 18 ? 'Louro Escuro' : 'Louro Claro',
      tom: `${i}`,
      descricao: 'Coloração creme BioColor com mais hidratação, pronta em 20 minutos.',
      imagem: `/images/products/tinta_biocolor/tinta_biocolor_${i}.PNG`,
      pricing: {
        basePrice: 6.50,
        ourPrice: 9.75,
        discountPrice: 8.78,
        savings: 0.97,
        margin: '28%'
      },
      rating: 4.4 + ((i % 4) * 0.1),
      reviewsCount: 30 + (i * 6),
      inStock: true,
      tags: ['hidratação', 'rápido', 'natural'],
      badge: 'NATURAL'
    });
  }
  return tintasBioColor;
};

const gerarTintasBeautyColor = () => {
  const tintasBeautyColor = [];
  // Apenas produtos com imagens reais validadas (removendo placeholder da posição 1)
  const produtosComImagensReais = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
    37, 38, 39, 40, 41, 42, 43, 44, 45, 46
  ]; // Removido: 1 (placeholder rosa), 11 (possível placeholder)

  produtosComImagensReais.forEach((i) => {
    tintasBeautyColor.push({
      id: `beautycolor-${i}`,
      nome: `Beauty Color Kit ${i} - Tom Especial`,
      marca: 'BEAUTY COLOR',
      categoria: 'Coloração Premium',
      cor: i <= 10 ? 'Preto/Castanho' : i <= 20 ? 'Castanho' : i <= 30 ? 'Louro Escuro' : i <= 40 ? 'Louro Claro' : 'Especiais',
      tom: `${i}`,
      descricao: 'Coloração Beauty Color com óleos nobres e tecnologia avançada.',
      imagem: `/images/products/tinta_beauty_color/tinta_beauty_color_${i}.PNG`,
      pricing: {
        basePrice: 8.90,
        ourPrice: 13.35,
        discountPrice: 12.02,
        savings: 1.33,
        margin: '32%'
      },
      rating: 4.3 + ((i % 5) * 0.1),
      reviewsCount: 40 + (i * 4),
      inStock: i % 20 !== 0, // 95% em estoque
      tags: ['premium', 'óleos nobres', 'beauty color'],
      badge: i % 3 === 0 ? 'PREMIUM' : i % 5 === 0 ? 'BESTSELLER' : 'NOVO'
    });
  });
  return tintasBeautyColor;
};

const gerarTintasAmend = () => {
  const tintasAmend = [];
  const tons = ['8.1', '7.0', '6.3', '5.4', '4.0', '9.1'];
  const cores = ['Louro Cinza Claro', 'Louro Médio', 'Louro Dourado', 'Castanho Médio', 'Castanho Natural', 'Louro Muito Claro'];

  for (let i = 1; i <= 6; i++) {
    tintasAmend.push({
      id: `amend-${i}`,
      nome: `Amend Magnific Color ${tons[i-1]} - ${cores[i-1]}`,
      marca: 'AMEND',
      categoria: 'Coloração Profissional',
      cor: cores[i-1],
      tom: tons[i-1],
      descricao: 'Coloração profissional Amend com keratina e proteção antifade.',
      imagem: `/images/products/tinta_amend/tinta_amend_${i}.PNG`,
      pricing: {
        basePrice: 15.20,
        ourPrice: 22.80,
        discountPrice: 20.52,
        savings: 2.28,
        margin: '35%'
      },
      rating: 4.7 + ((i % 3) * 0.1),
      reviewsCount: 60 + (i * 10),
      inStock: true,
      tags: ['keratina', 'antifade', 'profissional'],
      badge: 'PROFISSIONAL'
    });
  }
  return tintasAmend;
};

const gerarTintasNutrisse = () => {
  const tintasNutrisse = [];
  for (let i = 1; i <= 9; i++) {
    tintasNutrisse.push({
      id: `nutrisse-${i}`,
      nome: `Garnier Nutrisse Creme ${i} - Nutrição Intensa`,
      marca: 'GARNIER NUTRISSE',
      categoria: 'Coloração Nutritiva',
      cor: i <= 3 ? 'Preto/Castanho' : i <= 6 ? 'Castanho' : i <= 9 ? 'Louro Escuro' : 'Louro Claro',
      tom: `${i}`,
      descricao: 'Coloração nutritiva Garnier com 4 óleos e cobertura 100% dos brancos.',
      imagem: `/images/products/tinta_nutrisse/tinta_nutrisse_${i}.PNG`,
      pricing: {
        basePrice: 10.50,
        ourPrice: 15.75,
        discountPrice: 14.18,
        savings: 1.57,
        margin: '30%'
      },
      rating: 4.6 + ((i % 3) * 0.1),
      reviewsCount: 70 + (i * 8),
      inStock: true,
      tags: ['nutritiva', '4 óleos', 'garnier'],
      badge: 'NUTRITIVO'
    });
  }
  return tintasNutrisse;
};

const gerarTintasAltaModa = () => {
  const tintasAltaModa = [];
  for (let i = 1; i <= 29; i++) {
    tintasAltaModa.push({
      id: `altamoda-${i}`,
      nome: `Alfaparf Alta Moda ${i} - Pigmentos Micronizados`,
      marca: 'ALFAPARF',
      categoria: 'Coloração Italiana',
      cor: i <= 8 ? 'Preto/Castanho' : i <= 15 ? 'Castanho' : i <= 22 ? 'Louro Escuro' : 'Louro Claro',
      tom: `${i}`,
      descricao: 'Coloração italiana Alfaparf com pigmentos micronizados e máximo brilho.',
      imagem: `/images/products/tinta_alta_moda_/tinta_alta_moda__${i}.PNG`,
      pricing: {
        basePrice: 18.90,
        ourPrice: 28.35,
        discountPrice: 25.52,
        savings: 2.83,
        margin: '40%'
      },
      rating: 4.8 + ((i % 2) * 0.1),
      reviewsCount: 80 + (i * 5),
      inStock: true,
      tags: ['italiana', 'pigmentos micronizados', 'alfaparf'],
      badge: 'IMPORTADA'
    });
  }
  return tintasAltaModa;
};

// Dados das tintas com imagens reais validadas - CATÁLOGO COMPLETO
const tintasCapilares = [
  ...gerarTintasLOreal(),      // 22 produtos
  ...gerarTintasBioColor(),    // 23 produtos
  ...gerarTintasBeautyColor(), // 44 produtos (removidos 2 placeholders)
  ...gerarTintasAmend(),       // 6 produtos
  ...gerarTintasNutrisse(),    // 9 produtos
  ...gerarTintasAltaModa()     // 29 produtos
]; // Total: 133 produtos

// Filtros específicos para tintas
const marcasTintas = [
  { value: 'LOREAL', label: "L'Oréal Paris", count: 22 },
  { value: 'BIOCOLOR', label: 'BioColor', count: 23 },
  { value: 'BEAUTY COLOR', label: 'Beauty Color', count: 44 },
  { value: 'AMEND', label: 'Amend', count: 6 },
  { value: 'GARNIER', label: 'Garnier Nutrisse', count: 9 },
  { value: 'ALFAPARF', label: 'Alfaparf Alta Moda', count: 29 }
];

const categoriasTintas = [
  { value: 'permanente', label: 'Coloração Permanente' },
  { value: 'temporaria', label: 'Coloração Temporária' },
  { value: 'creme', label: 'Coloração Creme' },
  { value: 'premium', label: 'Coloração Premium' },
  { value: 'profissional', label: 'Coloração Profissional' },
  { value: 'nutritiva', label: 'Coloração Nutritiva' },
  { value: 'italiana', label: 'Coloração Italiana' }
];

const coresTintas = [
  { value: 'louro', label: 'Louro', color: '#F4E4BC' },
  { value: 'castanho', label: 'Castanho', color: '#8B4513' },
  { value: 'preto', label: 'Preto', color: '#000000' },
  { value: 'ruivo', label: 'Ruivo', color: '#CD5C5C' },
  { value: 'cinza', label: 'Cinza', color: '#808080' },
  { value: 'ameixa', label: 'Ameixa', color: '#673147' },
  { value: 'natural', label: 'Natural', color: '#DEB887' }
];

const faixasPreco = [
  { value: '5-10', label: '€5 - €10' },
  { value: '10-15', label: '€10 - €15' },
  { value: '15-20', label: '€15 - €20' },
  { value: '20-25', label: '€20 - €25' },
  { value: '25+', label: '€25+' }
];

// Componente principal
export default function TintasPage() {
  // Estados para filtros
  const [filteredProducts, setFilteredProducts] = useState(tintasCapilares);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [wishlistIds, setWishlistIds] = useState([]);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...tintasCapilares];

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.cor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tom.includes(searchTerm)
      );
    }

    // Filtro por marca
    if (selectedBrand) {
      filtered = filtered.filter(product =>
        product.marca.includes(selectedBrand)
      );
    }

    // Filtro por categoria
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.categoria.toLowerCase().includes(selectedCategory)
      );
    }

    // Filtro por cor
    if (selectedColor) {
      filtered = filtered.filter(product =>
        product.cor.toLowerCase().includes(selectedColor) ||
        product.tags.some(tag => tag.includes(selectedColor))
      );
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
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <Palette className="w-8 h-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Tintas Capilares
              </h1>
            </div>
            <p className="text-xl mb-8 opacity-90">
              Transforme seu visual com as melhores marcas de coloração
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span>{tintasCapilares.length} produtos disponíveis</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Imagens Reais Validadas</span>
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
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 sticky top-24 overflow-hidden">
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
                    {marcasTintas.map(marca => (
                      <option key={marca.value} value={marca.value}>
                        {marca.label} ({marca.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Coloração
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="">Todos os tipos</option>
                    {categoriasTintas.map(cat => (
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
                  <div className="grid grid-cols-2 gap-2">
                    {coresTintas.map(cor => (
                      <button
                        key={cor.value}
                        onClick={() => setSelectedColor(selectedColor === cor.value ? '' : cor.value)}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                          selectedColor === cor.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: cor.color }}
                        />
                        <span className="text-sm">{cor.label}</span>
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
                Mostrando {filteredProducts.length} de {tintasCapilares.length} produtos
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
                      <img
                        src={product.imagem}
                        alt={product.nome}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
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
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.nome}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Tom {product.tom}
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
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
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
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
                  Nenhuma tinta encontrada
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
              Por que escolher nossas tintas?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oferecemos apenas as melhores marcas com imagens reais e preços exclusivos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold mb-2">Cores Autênticas</h3>
              <p className="text-sm text-gray-600">Imagens reais validadas uma por uma</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold mb-2">6 Marcas Premium</h3>
              <p className="text-sm text-gray-600">L'Oréal, BioColor, Beauty Color, Amend, Garnier e Alfaparf</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold mb-2">Resultados Profissionais</h3>
              <p className="text-sm text-gray-600">Qualidade de salão em casa</p>
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