'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { generateUnifiedCatalog } from '@/lib/data/megaHairProducts';

interface ProductTestStats {
  totalProducts: number;
  imagesLoaded: number;
  imagesFailed: number;
  categories: Record<string, number>;
}

export default function TestProdutosPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<ProductTestStats>({
    totalProducts: 0,
    imagesLoaded: 0,
    imagesFailed: 0,
    categories: {}
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const catalog = generateUnifiedCatalog();
    setProducts(catalog);

    const categories: Record<string, number> = {};
    catalog.forEach(product => {
      const category = product.collection || 'outros';
      categories[category] = (categories[category] || 0) + 1;
    });

    setStats({
      totalProducts: catalog.length,
      imagesLoaded: 0,
      imagesFailed: 0,
      categories
    });
    setLoading(false);
  }, []);

  const handleImageLoad = () => {
    setStats(prev => ({
      ...prev,
      imagesLoaded: prev.imagesLoaded + 1
    }));
  };

  const handleImageError = () => {
    setStats(prev => ({
      ...prev,
      imagesFailed: prev.imagesFailed + 1
    }));
  };

  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === 'all' || product.collection?.toLowerCase() === filter.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.hairColor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando catálogo de produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Teste de Produtos - JC Hair Studio's 62
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Total de Produtos</h3>
              <p className="text-2xl font-bold text-blue-900">{stats.totalProducts}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Imagens Carregadas</h3>
              <p className="text-2xl font-bold text-green-900">{stats.imagesLoaded}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-800">Imagens com Erro</h3>
              <p className="text-2xl font-bold text-red-900">{stats.imagesFailed}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800">Taxa de Sucesso</h3>
              <p className="text-2xl font-bold text-yellow-900">
                {stats.totalProducts > 0 ?
                  Math.round((stats.imagesLoaded / stats.totalProducts) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por nome, cor ou SKU..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Todas as Coleções</option>
              {Object.keys(stats.categories).map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({stats.categories[category]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].alt}
                    fill
                    className="object-cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-sm">Sem imagem</span>
                  </div>
                )}

                {/* Product badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isFeatured && (
                    <span className="px-2 py-1 bg-rose-500 text-white text-xs rounded">
                      DESTAQUE
                    </span>
                  )}
                  {product.isNew && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">
                      NOVO
                    </span>
                  )}
                  {product.badge && (
                    <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Price tag */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                  €{product.price.toFixed(2)}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">
                  SKU: {product.sku} • {product.collection}
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                  {product.name}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Tipo:</span>
                    <span className="font-medium">{product.hairType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comprimento:</span>
                    <span className="font-medium">{product.length}cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cor:</span>
                    <span className="font-medium">{product.hairColor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Origem:</span>
                    <span className="font-medium">{product.origin}</span>
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {product.reviews} reviews
                  </span>
                </div>

                {/* Stock status */}
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    product.inStock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? `Em estoque (${product.quantity})` : 'Fora de estoque'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4 text-center">
          <p className="text-gray-600">
            Exibindo <span className="font-semibold">{filteredProducts.length}</span> produtos
            {filter !== 'all' && ` na coleção ${filter}`}
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>
      </div>
    </div>
  );
}