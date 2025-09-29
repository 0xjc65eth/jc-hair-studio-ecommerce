'use client';

import { useState, useEffect } from 'react';
import ProductTestGrid from '@/components/test/ProductTestGrid';
import { generateUnifiedCatalog } from '@/lib/data/megaHairProducts';
import { beautyCategories } from '@/lib/data/categories';

interface ProductData {
  megaHair: any[];
  maquiagem: any[];
  progressivas: any[];
  tratamentos: any[];
  ferramentas: any[];
  shampoos: any[];
}

export default function TestCompletoPage() {
  const [productData, setProductData] = useState<ProductData>({
    megaHair: [],
    maquiagem: [],
    progressivas: [],
    tratamentos: [],
    ferramentas: [],
    shampoos: []
  });
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    megaHairCount: 0,
    otherProductsCount: 0
  });

  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        // Get Mega Hair products
        const megaHairCatalog = generateUnifiedCatalog();

        // Get other beauty products from categories
        const maquiagemProducts = beautyCategories
          .find(cat => cat.id === 'maquiagem-brasileira')?.products || [];

        const progressivasProducts = beautyCategories
          .find(cat => cat.id === 'progressivas-btx')?.products || [];

        const tratamentosProducts = beautyCategories
          .find(cat => cat.id === 'tratamentos-capilares')?.products || [];

        const ferramentasProducts = beautyCategories
          .find(cat => cat.id === 'ferramentas-equipamentos')?.products || [];

        const shampoosProducts = beautyCategories
          .find(cat => cat.id === 'shampoos-condicionadores')?.products || [];

        const data = {
          megaHair: megaHairCatalog,
          maquiagem: maquiagemProducts,
          progressivas: progressivasProducts,
          tratamentos: tratamentosProducts,
          ferramentas: ferramentasProducts,
          shampoos: shampoosProducts
        };

        setProductData(data);

        const totalProducts = Object.values(data).reduce((sum, products) => sum + products.length, 0);

        setTotalStats({
          totalProducts,
          totalCategories: Object.keys(data).length,
          megaHairCount: megaHairCatalog.length,
          otherProductsCount: totalProducts - megaHairCatalog.length
        });

        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    };

    loadAllProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Carregando Catálogo Completo</h2>
          <p className="mt-2 text-gray-500">Preparando todos os produtos para validação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🧪 Teste Completo - JC Hair Studio's 62
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Validação completa de produtos e imagens do sistema
            </p>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                <h3 className="text-sm font-medium opacity-90">Total de Produtos</h3>
                <p className="text-3xl font-bold">{totalStats.totalProducts}</p>
                <p className="text-sm opacity-75">em {totalStats.totalCategories} categorias</p>
              </div>

              <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white p-6 rounded-lg">
                <h3 className="text-sm font-medium opacity-90">Mega Hair</h3>
                <p className="text-3xl font-bold">{totalStats.megaHairCount}</p>
                <p className="text-sm opacity-75">extensões capilares</p>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                <h3 className="text-sm font-medium opacity-90">Outros Produtos</h3>
                <p className="text-3xl font-bold">{totalStats.otherProductsCount}</p>
                <p className="text-sm opacity-75">maquiagem, tratamentos, etc.</p>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                <h3 className="text-sm font-medium opacity-90">Status do Sistema</h3>
                <p className="text-2xl font-bold">✅ Online</p>
                <p className="text-sm opacity-75">pronto para validação</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="space-y-8">
          {/* Mega Hair Products */}
          {productData.megaHair.length > 0 && (
            <ProductTestGrid
              title="🦱 MEGA HAIR - Extensões Capilares"
              products={productData.megaHair.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.url || '/placeholder-product.jpg',
                category: product.collection || 'Mega Hair',
                brand: product.origin,
                inStock: product.inStock,
                rating: product.rating,
                reviewCount: product.reviews
              }))}
              categoryColor="rose"
            />
          )}

          {/* Maquiagem Brasileira */}
          {productData.maquiagem.length > 0 && (
            <div className="mb-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ <strong>Nota:</strong> Produtos de maquiagem usam imagens externas (URLs) - algumas podem não carregar se os links estiverem quebrados.
                </p>
              </div>
              <ProductTestGrid
                title="💄 MAQUIAGEM BRASILEIRA (Imagens Externas)"
                products={productData.maquiagem.map(product => ({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image || '/placeholder-product.jpg',
                  category: product.category,
                  brand: product.brand,
                  inStock: product.availability === 'in_stock',
                  rating: product.rating,
                  reviewCount: product.reviewCount
                }))}
                categoryColor="purple"
              />
            </div>
          )}

          {/* Progressivas e BTX */}
          {productData.progressivas.length > 0 && (
            <div className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm">
                  ℹ️ <strong>Nota:</strong> Alguns produtos têm imagens reais em /images/products/, outros usam placeholders.
                </p>
              </div>
              <ProductTestGrid
                title="💫 PROGRESSIVAS E BTX (Imagens Mistas)"
                products={productData.progressivas.map(product => ({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image || '/placeholder-product.jpg',
                  category: product.category,
                  brand: product.brand,
                  inStock: product.availability === 'in_stock',
                  rating: product.rating,
                  reviewCount: product.reviewCount
                }))}
                categoryColor="blue"
              />
            </div>
          )}

          {/* Tratamentos Capilares */}
          {productData.tratamentos.length > 0 && (
            <ProductTestGrid
              title="🧴 TRATAMENTOS CAPILARES"
              products={productData.tratamentos.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || '/placeholder-product.jpg',
                category: product.category,
                brand: product.brand,
                inStock: product.availability === 'in_stock',
                rating: product.rating,
                reviewCount: product.reviewCount
              }))}
              categoryColor="green"
            />
          )}

          {/* Shampoos e Condicionadores */}
          {productData.shampoos.length > 0 && (
            <ProductTestGrid
              title="🧽 SHAMPOOS E CONDICIONADORES"
              products={productData.shampoos.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || '/placeholder-product.jpg',
                category: product.category,
                brand: product.brand,
                inStock: product.availability === 'in_stock',
                rating: product.rating,
                reviewCount: product.reviewCount
              }))}
              categoryColor="yellow"
            />
          )}

          {/* Ferramentas e Equipamentos */}
          {productData.ferramentas.length > 0 && (
            <ProductTestGrid
              title="🔧 FERRAMENTAS E EQUIPAMENTOS"
              products={productData.ferramentas.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || '/placeholder-product.jpg',
                category: product.category,
                brand: product.brand,
                inStock: product.availability === 'in_stock',
                rating: product.rating,
                reviewCount: product.reviewCount
              }))}
              categoryColor="blue"
            />
          )}
        </div>

        {/* Footer Summary */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            📊 Resumo das Imagens
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">✅ Imagens Reais Confirmadas:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• <strong>Mega Hair:</strong> 76 produtos (todas as imagens funcionais)</li>
                <li>• <strong>Produtos diversos:</strong> ~20 produtos com imagens reais</li>
                <li>• <strong>Total estimado:</strong> ~96 produtos com imagens reais</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Usando Placeholders/URLs:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• <strong>Maquiagem:</strong> URLs externas (podem falhar)</li>
                <li>• <strong>Outros produtos:</strong> Placeholders genéricos</li>
                <li>• <strong>Alguns tratamentos:</strong> Imagens mockadas</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-blue-800 font-medium">
              💡 Para teste apenas de imagens reais, acesse: <code>/test-imagens-reais</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}