'use client';

import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  stock: {
    available: number;
  };
  featured: boolean;
}

interface ProductsData {
  products?: Product[];
  summary?: {
    totalProducts: number;
    totalCategories: number;
  };
  productsByCategory?: Array<{ _id: string; count: number }>;
  topBrands?: Array<{ _id: string; count: number }>;
}

export default function AdminProdutos() {
  const [data, setData] = useState<ProductsData>({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'summary' | 'all' | 'category'>('summary');
  const [selectedCategory, setSelectedCategory] = useState('maquiagem');

  const fetchData = async (action: string, params = '') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products?action=${action}${params}`);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData('summary');
  }, []);

  const handleViewChange = (newView: 'summary' | 'all' | 'category') => {
    setView(newView);
    if (newView === 'summary') {
      fetchData('summary');
    } else if (newView === 'all') {
      fetchData('all', '&limit=100');
    } else if (newView === 'category') {
      fetchData('category', `&category=${selectedCategory}`);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchData('category', `&category=${category}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              📦 Gestão de Produtos MongoDB
            </h1>
            <p className="mt-2 text-gray-600">
              Visualize e gerencie seus {data.summary?.totalProducts || 0} produtos
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => handleViewChange('summary')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'summary'
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            📊 Resumo
          </button>
          <button
            onClick={() => handleViewChange('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'all'
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            📦 Todos os Produtos
          </button>
          <button
            onClick={() => handleViewChange('category')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'category'
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            📂 Por Categoria
          </button>
        </div>

        {/* Category Filter */}
        {view === 'category' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Categoria:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="maquiagem">💄 Maquiagem</option>
              <option value="tratamento_capilar">💇‍♀️ Tratamentos Capilares</option>
              <option value="cuidados_diarios">🧴 Cuidados Diários</option>
            </select>
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {/* Summary View */}
          {view === 'summary' && data.summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Products */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-pink-600 text-lg">📦</span>
                    </div>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total de Produtos</p>
                    <p className="text-2xl font-bold text-gray-900">{data.summary.totalProducts}</p>
                  </div>
                </div>
              </div>

              {/* Total Categories */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-lg">📂</span>
                    </div>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total de Categorias</p>
                    <p className="text-2xl font-bold text-gray-900">{data.summary.totalCategories}</p>
                  </div>
                </div>
              </div>

              {/* Products by Category */}
              <div className="bg-white rounded-lg shadow p-6 md:col-span-2 lg:col-span-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Por Categoria</h3>
                <div className="space-y-3">
                  {data.productsByCategory?.map((cat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">
                        {cat._id.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Brands */}
              <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">🏷️ Top Marcas</h3>
                <div className="grid grid-cols-2 gap-4">
                  {data.topBrands?.map((brand, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{brand._id}</span>
                      <span className="text-sm font-medium text-gray-900">{brand.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products List */}
          {(view === 'all' || view === 'category') && data.products && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {view === 'all' ? '📦 Todos os Produtos' : `📂 Categoria: ${selectedCategory}`}
                  <span className="ml-2 text-sm text-gray-500">({data.products.length} produtos)</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Marca
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estoque
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                            {product.sku}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex items-center">
                              {product.featured && <span className="mr-2">⭐</span>}
                              {product.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.brand}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category}/{product.subcategory}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stock?.available || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              (product.stock?.available || 0) > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {(product.stock?.available || 0) > 0 ? 'Em Estoque' : 'Sem Estoque'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}