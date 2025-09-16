'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, Eye, ShoppingCart, Filter, Search, Grid, List, Palette, Sparkles } from 'lucide-react';

// Import the processed Google Drive URLs data
import cosmeticsUrls from '../../drive_urls_converted.json';
import { getWorkingImageUrl, handleImageError } from '../../lib/utils/imageUtils';

// Define cosmetics categories with their respective patterns
const cosmeticsCategories = [
  {
    id: 'batom',
    name: 'Batons',
    icon: '💋',
    color: 'bg-red-50 border-red-200 text-red-700',
    keywords: ['batom', 'lipstick', 'rouge', 'labial', 'boca'],
    description: 'Batons cremosos, matte e líquidos das melhores marcas'
  },
  {
    id: 'base',
    name: 'Bases & Corretivos',
    icon: '✨',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    keywords: ['base', 'foundation', 'corretivo', 'concealer', 'primer'],
    description: 'Bases líquidas, cremosas e corretivos para pele perfeita'
  },
  {
    id: 'sombra',
    name: 'Sombras & Paletas',
    icon: '🎨',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    keywords: ['sombra', 'eyeshadow', 'paleta', 'palette', 'olhos'],
    description: 'Paletas e sombras individuais para looks marcantes'
  },
  {
    id: 'esmalte',
    name: 'Esmaltes',
    icon: '💅',
    color: 'bg-pink-50 border-pink-200 text-pink-700',
    keywords: ['esmalte', 'nail', 'unhas', 'nail polish'],
    description: 'Esmaltes, base coat e top coat para unhas perfeitas'
  },
  {
    id: 'blush',
    name: 'Blushes & Contorno',
    icon: '🌸',
    color: 'bg-rose-50 border-rose-200 text-rose-700',
    keywords: ['blush', 'bronzeador', 'contorno', 'iluminador', 'highlighter'],
    description: 'Blushes, bronzeadores e iluminadores'
  },
  {
    id: 'pinceis',
    name: 'Pincéis & Acessórios',
    icon: '🖌️',
    color: 'bg-gray-50 border-gray-200 text-gray-700',
    keywords: ['pincel', 'brush', 'kit', 'acessorio', 'esponja'],
    description: 'Pincéis profissionais e acessórios de aplicação'
  }
];

// Mock product data using the processed images
const generateProductsFromImages = () => {
  const products = cosmeticsUrls.successful.slice(0, 120).map((imageData, index) => {
    const categoryIndex = index % cosmeticsCategories.length;
    const category = cosmeticsCategories[categoryIndex];

    return {
      id: `cosmetic-${index + 1}`,
      name: `${category.name.slice(0, -1)} Premium ${index + 1}`,
      brand: ['Vult', 'Boca Rosa Beauty', 'O Boticário Make B', 'Eudora', 'Natura'][index % 5],
      category: category.id,
      price: 15 + Math.floor(Math.random() * 50),
      originalPrice: Math.random() > 0.7 ? 25 + Math.floor(Math.random() * 60) : null,
      image: getWorkingImageUrl(imageData.direct_url, index),
      rating: 4 + Math.random(),
      reviewCount: 50 + Math.floor(Math.random() * 500),
      description: category.description,
      colors: category.id === 'batom' || category.id === 'esmalte' ?
        ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'][Math.floor(Math.random() * 5)] : null,
      isNew: Math.random() > 0.8,
      isBestSeller: Math.random() > 0.85,
      isOnSale: Math.random() > 0.7,
      slug: `cosmetic-${index + 1}`,
      tags: category.keywords
    };
  });

  return products;
};

interface CosmeticsCatalogProps {
  showCategories?: boolean;
  maxProducts?: number;
  layout?: 'grid' | 'list';
}

export default function CosmeticsCatalog({
  showCategories = true,
  maxProducts = 120,
  layout: defaultLayout = 'grid'
}: CosmeticsCatalogProps) {
  const [products] = useState(() => generateProductsFromImages());
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [layout, setLayout] = useState(defaultLayout);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState([0, 100]);

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Price filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return a.isNew ? -1 : 1;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered.slice(0, maxProducts));
  }, [selectedCategory, searchTerm, sortBy, priceRange, products, maxProducts]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const ProductCard = ({ product }: { product: any }) => (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Product Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            NOVO
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            MAIS VENDIDO
          </span>
        )}
        {product.isOnSale && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            OFERTA
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        onClick={() => toggleFavorite(product.id)}
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
      >
        <Heart
          className={`w-4 h-4 ${
            favorites.has(product.id)
              ? 'text-red-500 fill-current'
              : 'text-gray-400'
          }`}
        />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = handleImageError(parseInt(product.id.split('-')[1]) || 0);
          }}
        />

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Link
              href={`/produto/${product.slug}`}
              className="bg-white text-gray-900 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={`/produto/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Color Options (for applicable products) */}
        {product.colors && (
          <div className="flex gap-1 mb-3">
            <div
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: product.colors }}
            />
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            €{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              €{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Catálogo de Cosméticos Premium
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Descubra nossa coleção completa de produtos cosméticos das melhores marcas brasileiras
        </p>
      </div>

      {/* Categories */}
      {showCategories && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Explore por Categoria</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                selectedCategory === 'all'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">🌟</div>
              <h3 className="font-semibold text-sm">Todos</h3>
            </button>

            {cosmeticsCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  selectedCategory === category.id
                    ? category.color
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-sm">{category.name}</h3>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Ordenar por Nome</option>
            <option value="price-low">Menor Preço</option>
            <option value="price-high">Maior Preço</option>
            <option value="rating">Melhor Avaliação</option>
            <option value="newest">Mais Novos</option>
          </select>

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">€{priceRange[0]}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="flex-1"
            />
            <span className="text-sm text-gray-600">€{priceRange[1]}</span>
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLayout('grid')}
              className={`p-2 rounded-lg ${layout === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-2 rounded-lg ${layout === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Mostrando {filteredProducts.length} de {products.length} produtos
          {selectedCategory !== 'all' && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              {cosmeticsCategories.find(c => c.id === selectedCategory)?.name}
            </span>
          )}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className={`grid gap-6 ${
          layout === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            Tente ajustar os filtros ou termos de busca
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchTerm('');
              setPriceRange([0, 100]);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {/* Load More Button */}
      {filteredProducts.length === maxProducts && products.length > maxProducts && (
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
            Carregar Mais Produtos
          </button>
        </div>
      )}
    </div>
  );
}