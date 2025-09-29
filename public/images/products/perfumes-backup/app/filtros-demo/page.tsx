'use client';

import { useState, useEffect } from 'react';
import { Grid, List, Heart, Star, Eye, Palette, Zap, Droplets, Sparkles, Beaker } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../../components/ui/Button';
import DynamicProductFilters from '../../components/catalog/DynamicProductFilters';
import { useDynamicFilters, Product } from '../../lib/hooks/useDynamicFilters';

// Dados de exemplo para demonstração
const DEMO_PRODUCTS: Product[] = [
  // TINTAS
  {
    id: 'tinta-loreal-001',
    name: "L'Oréal Paris Coloração Capilar Loiro Claro",
    brand: "L'Oréal Paris",
    category: 'Coloração Capilar',
    subcategory: 'Tintas',
    description: 'Coloração com cobertura total de fios brancos. Fórmula sem amônia com proteção UV.',
    price: 17.84,
    originalPrice: 21.41,
    priceBRL: 74.8,
    images: ['/images/products/tinta_loreal/tinta_loreal_1.PNG'],
    features: ['Cobertura 100%', 'Sem Amônia', 'Proteção UV', 'Nutrição + Cor'],
    stock: 26,
    rating: 4.5,
    reviews: 127,
    inStock: true,
    featured: true,
    isNew: true,
    hasDiscount: false,
    tags: ['tinta', 'loiro', 'sem-amonia', 'cobertura-total'],
    color_info: {
      tone: 'Loiro Claro',
      hex_color: '#F5E6A3',
      undertone: 'Dourado',
      skin_match: 'Pele clara'
    },
    colors: ['loiro claro', 'dourado']
  },
  {
    id: 'tinta-wella-002',
    name: 'Wella Koleston Perfect Castanho Escuro',
    brand: 'Wella',
    category: 'Coloração Capilar',
    subcategory: 'Tintas',
    description: 'Coloração profissional com tecnologia ME+ para redução de alergias. Cobertura uniforme.',
    price: 23.50,
    originalPrice: 28.90,
    priceBRL: 95.20,
    images: ['/images/products/tinta_wella/tinta_wella_1.PNG'],
    features: ['Tecnologia ME+', 'Cobertura Uniforme', 'Longa Duração', 'Brilho Intenso'],
    stock: 18,
    rating: 4.7,
    reviews: 89,
    inStock: true,
    featured: false,
    isNew: false,
    hasDiscount: true,
    tags: ['tinta', 'castanho', 'profissional'],
    colors: ['castanho escuro', 'marrom']
  },

  // PROGRESSIVAS
  {
    id: 'progressiva-cocochoco-001',
    name: 'CocoCHOCO Professional Original Premium Keratin Treatment',
    brand: 'CocoCHOCO',
    category: 'Progressiva',
    subcategory: 'Alisamentos',
    description: 'Tratamento premium de queratina brasileira com chocolate. Fórmula livre de formaldeído.',
    price: 61.32,
    priceBRL: 320.00,
    images: ['/images/products/progressivas_diversas/progressivas_diversas_1.JPG'],
    features: ['Queratina Brasileira', 'Premium Treatment', 'Livre de Formaldeído', 'Resultado Profissional'],
    stock: 15,
    rating: 4.9,
    reviews: 347,
    inStock: true,
    featured: true,
    isNew: false,
    hasDiscount: false,
    tags: ['progressiva', 'queratina', 'sem-formol', 'chocolate'],
    colors: ['Marrom']
  },
  {
    id: 'progressiva-tzaha-001',
    name: "T'ZAHA Diamante Total Liss Therapy 3D",
    brand: "T'ZAHA",
    category: 'Progressiva',
    subcategory: 'Alisamentos',
    description: 'Kit completo de terapia capilar 3D com shampoo e gloss. Tratamento sem formol com tecnologia Diamante.',
    price: 35.64,
    priceBRL: 180.50,
    images: ['/images/products/progressivas_diversas/progressivas_diversas_3.JPG'],
    features: ['Therapy 3D', 'Kit Shampoo + Gloss', 'Sem Formol', 'Tecnologia Diamante'],
    stock: 28,
    rating: 4.7,
    reviews: 156,
    inStock: true,
    featured: false,
    isNew: true,
    hasDiscount: false,
    tags: ['progressiva', 'sem-formol', 'kit-completo'],
    colors: ['Preto/Dourado']
  },

  // HIDRATAÇÃO
  {
    id: 'hidratacao-novex-001',
    name: 'Novex Creme para Pentear Antiporosidade 72H - Cachos Mega Volume',
    brand: 'Novex',
    category: 'Hidratação',
    subcategory: 'Cremes',
    description: 'Creme para pentear com fórmula antiporosidade que proporciona volume e definição para cabelos ressecados.',
    price: 10.59,
    priceBRL: 42.90,
    images: ['/images/products/produtos_de_hidratacao/produtos_de_hidratacao_1.WEBP'],
    features: ['Antiporosidade 72H', 'Mega Volume', 'Para Cabelos Ressecados', 'Definição de Cachos'],
    stock: 32,
    rating: 4.6,
    reviews: 187,
    inStock: true,
    featured: false,
    isNew: false,
    hasDiscount: false,
    tags: ['hidratacao', 'creme-pentear', 'antiporosidade', 'cachos'],
    colors: ['Rosa']
  },
  {
    id: 'hidratacao-novex-002',
    name: 'Novex Salon Blindagem Leave-in Impermeabilizante',
    brand: 'Novex',
    category: 'Hidratação',
    subcategory: 'Leave-in',
    description: 'Leave-in com proteção absoluta antifrizz, anti pontas duplas e brilho extremo. Proteção para altas temperaturas até 232°C.',
    price: 9.16,
    priceBRL: 35.50,
    images: ['/images/products/produtos_de_hidratacao/produtos_de_hidratacao_2.WEBP'],
    features: ['Proteção Absoluta', 'Antifrizz', 'Anti Pontas Duplas', 'Brilho Extremo', 'Proteção até 232°C'],
    stock: 28,
    rating: 4.8,
    reviews: 143,
    inStock: true,
    featured: true,
    isNew: false,
    hasDiscount: false,
    tags: ['hidratacao', 'leave-in', 'antifrizz', 'protecao-termica'],
    colors: ['Cinza/Dourado']
  },

  // BOTOX
  {
    id: 'botox-topvip-001',
    name: 'TopVip BTX Topterapia Formula 0%',
    brand: 'TopVip',
    category: 'Botox Capilar',
    subcategory: 'Tratamentos',
    description: 'Botox capilar livre de formol com ação hidratante e alisante. Contém D\'pantenol, óleo de argan e aminoácidos.',
    price: 9.66,
    priceBRL: 38.80,
    images: ['/images/products/botox/botox_1.png'],
    features: ['0% Formol', 'Com D\'pantenol', 'Óleo de Argan', 'Aminoácidos', 'Uso Profissional'],
    stock: 25,
    rating: 4.7,
    reviews: 143,
    inStock: true,
    featured: false,
    isNew: false,
    hasDiscount: false,
    tags: ['botox', 'sem-formol', 'hidratante', 'argan'],
    colors: ['Amarelo']
  },
  {
    id: 'botox-forever-liss-001',
    name: 'Forever Liss BTOX Zero Máscara Ultra Hidratante',
    brand: 'Forever Liss',
    category: 'Botox Capilar',
    subcategory: 'Máscaras',
    description: 'Máscara ultra hidratante com fórmula orgânica antifrizz. Rica em óleo de argan, óleo de coco e manteiga de karité.',
    price: 12.60,
    priceBRL: 53.49,
    images: ['/images/products/botox/botox_2.png'],
    features: ['Máscara Ultra Hidratante', 'Óleo de Argan', 'Óleo de Coco', 'Manteiga de Karité', 'Antifrizz'],
    stock: 38,
    rating: 4.6,
    reviews: 87,
    inStock: true,
    featured: false,
    isNew: true,
    hasDiscount: false,
    tags: ['botox', 'mascara', 'hidratante', 'organico'],
    colors: ['Azul/Branco']
  }
];

const CATEGORY_TABS = [
  { id: 'tintas', name: 'Tintas', icon: Palette, count: 2 },
  { id: 'progressivas', name: 'Progressivas', icon: Zap, count: 2 },
  { id: 'hidratacao', name: 'Hidratação', icon: Droplets, count: 2 },
  { id: 'botox', name: 'Botox', icon: Sparkles, count: 2 },
  { id: 'quimicos', name: 'Químicos', icon: Beaker, count: 0 }
];

export default function FiltrosDemoPage() {
  const [activeCategory, setActiveCategory] = useState('tintas');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);

  // Filter products by category
  const categoryProducts = DEMO_PRODUCTS.filter(product => {
    switch (activeCategory) {
      case 'tintas':
        return product.category === 'Coloração Capilar';
      case 'progressivas':
        return product.category === 'Progressiva';
      case 'hidratacao':
        return product.category === 'Hidratação';
      case 'botox':
        return product.category === 'Botox Capilar';
      case 'quimicos':
        return product.category === 'Produtos Químicos';
      default:
        return false;
    }
  });

  // Use dynamic filters hook
  const {
    filters,
    filteredProducts,
    sortBy,
    updateFilters,
    clearFilters,
    setSortBy,
    getActiveFiltersCount
  } = useDynamicFilters(categoryProducts, activeCategory);

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleToggleComparison = (productId: string) => {
    setComparisonIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], productId];
      }
      return [...prev, productId];
    });
  };

  const formatPrice = (price: number, currency: 'EUR' | 'BRL' = 'EUR') => {
    if (currency === 'BRL') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price);
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDualPrice = (priceEUR: number, priceBRL?: number) => {
    if (priceBRL) {
      return `${formatPrice(priceEUR, 'EUR')} (${formatPrice(priceBRL, 'BRL')})`;
    }
    return formatPrice(priceEUR, 'EUR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 text-white py-20 mt-16 lg:mt-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-playfair font-bold mb-6">
              Filtros Dinâmicos
            </h1>
            <p className="text-xl lg:text-2xl text-pink-100 mb-8 max-w-2xl mx-auto">
              Sistema avançado de filtros adaptativos por categoria. Cada tipo de produto tem seus filtros específicos para uma busca precisa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm">🎨 Filtros por Cor</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm">⚡ Filtros por Fórmula</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm">💧 Filtros por Tratamento</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm">🔬 Filtros Químicos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-b border-pink-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {CATEGORY_TABS.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all ${
                    activeCategory === tab.id
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-pink-200 hover:border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeCategory === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-pink-100 text-pink-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content with Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <DynamicProductFilters
                activeCategory={activeCategory}
                onFiltersChange={updateFilters}
                onSortChange={setSortBy}
                onToggleWishlist={handleToggleWishlist}
                onToggleComparison={handleToggleComparison}
                wishlistIds={wishlistIds}
                comparisonIds={comparisonIds}
                totalProducts={filteredProducts.length}
                isLoading={false}
              />
            </div>

            {/* Main Products Area */}
            <div className="flex-1 min-w-0">
              {/* View Mode Controls */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {filteredProducts.length.toLocaleString()} produtos encontrados
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Categoria: {CATEGORY_TABS.find(tab => tab.id === activeCategory)?.name}
                    {getActiveFiltersCount() > 0 && (
                      <span className="ml-2 text-pink-600">
                        • {getActiveFiltersCount()} filtro{getActiveFiltersCount() > 1 ? 's' : ''} ativo{getActiveFiltersCount() > 1 ? 's' : ''}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-pink-500 text-white'
                        : 'bg-white text-gray-700 border border-pink-200 hover:bg-pink-50'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-pink-500 text-white'
                        : 'bg-white text-gray-700 border border-pink-200 hover:bg-pink-50'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Products Grid/List */}
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-100 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
                      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                        <div className="text-pink-300 text-4xl">
                          {activeCategory === 'tintas' && '🎨'}
                          {activeCategory === 'progressivas' && '⚡'}
                          {activeCategory === 'hidratacao' && '💧'}
                          {activeCategory === 'botox' && '✨'}
                          {activeCategory === 'quimicos' && '🧪'}
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.isNew && (
                          <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                            NOVO
                          </span>
                        )}
                        {product.featured && (
                          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                            DESTAQUE
                          </span>
                        )}
                        {product.hasDiscount && (
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                            OFERTA
                          </span>
                        )}
                        {product.stock && product.stock < 10 && (
                          <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                            ÚLTIMAS {product.stock}
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => handleToggleWishlist(product.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full hover:bg-white transition-colors ${
                          wishlistIds.includes(product.id)
                            ? 'bg-pink-500 text-white'
                            : 'bg-white/80 text-pink-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${wishlistIds.includes(product.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="mb-2">
                        <p className="text-sm text-pink-600 font-medium">{product.brand}</p>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                      </div>

                      {/* Features as chips */}
                      {product.features && product.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.features.slice(0, 3).map((feature, index) => (
                            <span
                              key={index}
                              className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                          {product.features.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                              +{product.features.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex flex-col gap-1 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-pink-600">
                            {formatDualPrice(product.price, product.priceBRL)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        {product.priceBRL && (
                          <span className="text-xs text-gray-500">
                            Preço válido para pagamento à vista
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                        >
                          Adicionar ao Carrinho
                        </Button>
                        <button
                          onClick={() => handleToggleComparison(product.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            comparisonIds.includes(product.id)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Comparar produto"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Nenhum produto encontrado
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Tente ajustar os filtros ou selecionar outra categoria.
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Sistema de Filtros Inteligente
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-lg border border-pink-100 bg-pink-50">
                <Palette className="w-8 h-8 text-pink-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Tintas</h3>
                <p className="text-sm text-gray-600">
                  Filtros por cor, família de cores, cobertura e fórmula (com/sem amônia)
                </p>
              </div>

              <div className="p-6 rounded-lg border border-pink-100 bg-pink-50">
                <Zap className="w-8 h-8 text-pink-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Progressivas</h3>
                <p className="text-sm text-gray-600">
                  Filtros por nível de alisamento, fórmula (queratina, sem formol) e duração
                </p>
              </div>

              <div className="p-6 rounded-lg border border-pink-100 bg-pink-50">
                <Droplets className="w-8 h-8 text-pink-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Hidratação</h3>
                <p className="text-sm text-gray-600">
                  Filtros por tipo de tratamento, tipo de cabelo e problema alvo
                </p>
              </div>

              <div className="p-6 rounded-lg border border-pink-100 bg-pink-50">
                <Sparkles className="w-8 h-8 text-pink-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Botox</h3>
                <p className="text-sm text-gray-600">
                  Filtros por tipo de BTX, fórmula e componentes específicos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}