'use client';

import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import ProductCard from '../../components/products/SimpleProductCard';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { getAllAvailableProducts } from '../../lib/services/productResolver';

// Get all products from resolver
const allProducts = getAllAvailableProducts();

// Filter products by category
const progressivasProducts = allProducts.filter(p =>
  p.category === 'Progressivas & BTX' ||
  p.category === 'progressivas' ||
  (p.name && (p.name.toLowerCase().includes('progressiva') ||
              p.name.toLowerCase().includes('keratin') ||
              p.name.toLowerCase().includes('alisamento')))
);

const tratamentosProducts = allProducts.filter(p =>
  p.category === 'Botox Capilar' ||
  p.category === 'Tratamento Capilar' ||
  p.category === 'tratamentos' ||
  (p.name && (p.name.toLowerCase().includes('botox') ||
              p.name.toLowerCase().includes('hidrata') ||
              p.name.toLowerCase().includes('máscara') ||
              p.name.toLowerCase().includes('tratamento')))
);

export default function ProdutosPage() {
  const [activeTab, setActiveTab] = useState('progressivas');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentProducts = activeTab === 'progressivas'
    ? progressivasProducts
    : tratamentosProducts;

  const filteredProducts = currentProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-20 mt-16 lg:mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-6">
              Produtos Capilares
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Progressivas, Tratamentos e Alisamentos Profissionais para Transformação Capilar
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('progressivas')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'progressivas'
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-600 hover:text-amber-600'
                }`}
              >
                ✨ Progressivas ({progressivasProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('tratamentos')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'tratamentos'
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-600 hover:text-amber-600'
                }`}
              >
                🌊 Tratamentos ({tratamentosProducts.length})
              </button>
            </div>

            {/* Search and View Controls */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 border rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {activeTab === 'progressivas'
              ? 'Progressivas Profissionais'
              : 'Tratamentos Capilares'
            }
          </h2>
          <p className="text-gray-600">
            {activeTab === 'progressivas'
              ? 'Transforme seus cabelos com nossas progressivas de alta qualidade'
              : 'Tratamentos intensivos para hidratação, nutrição e reconstrução capilar'
            }
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
          }>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                nome={product.name || product.nome}
                marca={product.brand || product.marca}
                descricao={product.description || product.descricao}
                imagens={product.images || product.imagens}
                badge={product.badge}
                pricing={product.pricing}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-600">Tente ajustar sua busca ou filtros</p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-4">🔬</div>
              <h3 className="text-lg font-semibold mb-2">Tecnologia Avançada</h3>
              <p className="text-gray-600">Produtos desenvolvidos com as mais modernas tecnologias capilares</p>
            </div>
            <div>
              <div className="text-3xl mb-4">✅</div>
              <h3 className="text-lg font-semibold mb-2">Resultados Garantidos</h3>
              <p className="text-gray-600">Transformação visível e duradoura para todos os tipos de cabelo</p>
            </div>
            <div>
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-lg font-semibold mb-2">Segurança Total</h3>
              <p className="text-gray-600">Fórmulas testadas e aprovadas por profissionais especializados</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
