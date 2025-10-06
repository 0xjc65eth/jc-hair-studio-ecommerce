'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import ProductCard from '../../components/products/SimpleProductCard';
import { ShoppingBag, Search, Filter, Palette, Sparkles, Droplets, Brush } from 'lucide-react';
import { allTintasCapilares } from '../../lib/data/tintasCapilares';
import { allEsmaltesImpala } from '../../lib/data/esmaltesImpala';
import { allPerfumesWepink } from '../../lib/data/perfumesWepink';
import { allPerfumesOBoticario } from '../../lib/data/perfumesOBoticario';

// Dados dos produtos profissionalmente organizados
const tintasCapilares = allTintasCapilares;
const esmaltesImpala = allEsmaltesImpala;
const perfumesWepink = allPerfumesWepink;
const perfumesOBoticario = allPerfumesOBoticario;

// Todos os produtos organizados por categoria
const allProducts = {
  tintas: tintasCapilares,
  esmaltes: esmaltesImpala,
  perfumes: perfumesWepink,
  perfumesBoticario: perfumesOBoticario
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

const marcasPerfumesBoticario = [
  { value: 'O Boticário', label: 'O Boticário', count: 0 }
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

const categoriasPerfumesBoticario = [
  { value: 'perfumes-boticario', label: 'Eau de Toilette' },
  { value: 'perfumes-boticario', label: 'Eau de Parfum' },
  { value: 'perfumes-boticario', label: 'Body Splash' }
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

    setFilteredProducts(filtered);
  }, [activeSection, searchTerm, selectedBrand, selectedCategory, selectedColor, selectedPriceRange]);

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
      case 'perfumesBoticario':
        return marcasPerfumesBoticario;
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
      case 'perfumesBoticario':
        return categoriasPerfumesBoticario;
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
      case 'perfumesBoticario':
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
      case 'perfumesBoticario':
        return 'Perfumes O Boticário';
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
      case 'perfumesBoticario':
        return 'Perfumes autênticos O Boticário - as fragrâncias mais icônicas do Brasil';
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
      case 'perfumesBoticario':
        return Droplets;
      default:
        return Palette;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header da página */}
      <section className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-20 mt-16 lg:mt-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              {React.createElement(getSectionIcon(), { className: 'w-8 h-8 mr-3' })}
              <h1 className="text-4xl lg:text-6xl font-playfair font-bold mb-6">
                {getSectionTitle()}
              </h1>
            </div>
            <p className="text-xl lg:text-2xl text-purple-100 mb-8 max-w-2xl mx-auto">
              {getSectionDescription()}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                {filteredProducts.length} produtos disponíveis
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Imagens Reais dos Rótulos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Todas as marcas</option>
                  {getAvailableBrands().map(marca => (
                    <option key={marca.value} value={marca.value}>
                      {marca.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Mostrando {filteredProducts.length} de {allProducts[activeSection].length} produtos
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs - Três Categorias */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
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
            <button
              onClick={() => {
                setActiveSection('perfumesBoticario');
                clearAllFilters();
              }}
              className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
                activeSection === 'perfumesBoticario'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              💐 Perfumes O Boticário ({allProducts.perfumesBoticario.length})
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  nome={product.nome}
                  marca={product.marca}
                  descricao={product.descricao}
                  imagens={product.images ? product.images : [product.imagem]}
                  badge={product.badge}
                  pricing={product.pricing}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Tente ajustar os filtros ou termo de busca
              </p>
              <Button
                onClick={clearAllFilters}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Seção de benefícios */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
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
                <span className="text-2xl">💐</span>
              </div>
              <h3 className="font-semibold mb-2">Perfumes O Boticário</h3>
              <p className="text-sm text-gray-600">39 fragrâncias icônicas brasileiras</p>
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

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-playfair font-bold mb-4">
            Fique por dentro das novidades
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Cadastre-se para receber ofertas exclusivas e lançamentos em primeira mão
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full font-medium">
              Inscrever-se
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}