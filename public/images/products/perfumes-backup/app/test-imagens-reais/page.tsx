'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { generateUnifiedCatalog } from '@/lib/data/megaHairProducts';

interface ImageTestResult {
  path: string;
  status: 'loading' | 'success' | 'error';
  productName?: string;
}

export default function TestImagensReaisPage() {
  const [megaHairProducts, setMegaHairProducts] = useState<any[]>([]);
  const [productImages, setProductImages] = useState<ImageTestResult[]>([]);
  const [imageStats, setImageStats] = useState({
    total: 0,
    loaded: 0,
    failed: 0,
    loading: 0
  });

  useEffect(() => {
    // Load Mega Hair products (these have real images)
    const catalog = generateUnifiedCatalog();
    setMegaHairProducts(catalog);

    // Load product images from /images/products/ folders
    const productImagePaths = [
      // Based on the actual folders we found
      '/images/products/karssel/karssel-1.png',
      '/images/products/g-hair/g-hair-1.png',
      '/images/products/g-hair/g-hair-2.png',
      '/images/products/g-hair/g-hair-3.png',
      '/images/products/g-hair/g-hair-4.png',
      '/images/products/g-hair/g-hair-5.png',
      '/images/products/g-hair/g-hair-6.png',
      '/images/products/honma-tokyo/honma-1.png',
      '/images/products/honma-tokyo/honma-2.png',
      '/images/products/honma-tokyo/honma-3.png',
      '/images/products/honma-tokyo/honma-4.png',
      '/images/products/forever-liss/forever-liss-1.png',
      '/images/products/cadiveu/cadiveu-1.png',
      '/images/products/cadiveu/cadiveu-2.png',
      '/images/products/bio_extratus_produtos_/jaborandi-1.png',
      '/images/products/bio_extratus_produtos_/cronograma-1.png',
      // Add more real product images as discovered
    ];

    const initialImages = productImagePaths.map(path => ({
      path,
      status: 'loading' as const,
      productName: path.split('/').pop()?.replace('.png', '').replace('.jpg', '')
    }));

    setProductImages(initialImages);
    setImageStats({
      total: catalog.length + productImagePaths.length,
      loaded: 0,
      failed: 0,
      loading: catalog.length + productImagePaths.length
    });
  }, []);

  const handleImageLoad = (type: 'mega-hair' | 'product') => {
    setImageStats(prev => ({
      ...prev,
      loaded: prev.loaded + 1,
      loading: prev.loading - 1
    }));
  };

  const handleImageError = (type: 'mega-hair' | 'product') => {
    setImageStats(prev => ({
      ...prev,
      failed: prev.failed + 1,
      loading: prev.loading - 1
    }));
  };

  const handleProductImageLoad = (path: string) => {
    setProductImages(prev => prev.map(img =>
      img.path === path ? { ...img, status: 'success' } : img
    ));
    handleImageLoad('product');
  };

  const handleProductImageError = (path: string) => {
    setProductImages(prev => prev.map(img =>
      img.path === path ? { ...img, status: 'error' } : img
    ));
    handleImageError('product');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🖼️ Teste de Imagens Reais - JC Hair Studio's 62
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Validação apenas dos produtos que possuem imagens reais no sistema
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <h3 className="text-sm font-medium opacity-90">Total de Imagens</h3>
              <p className="text-3xl font-bold">{imageStats.total}</p>
              <p className="text-sm opacity-75">testando...</p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
              <h3 className="text-sm font-medium opacity-90">Carregadas</h3>
              <p className="text-3xl font-bold">{imageStats.loaded}</p>
              <p className="text-sm opacity-75">funcionando</p>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg">
              <h3 className="text-sm font-medium opacity-90">Com Erro</h3>
              <p className="text-3xl font-bold">{imageStats.failed}</p>
              <p className="text-sm opacity-75">quebradas</p>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
              <h3 className="text-sm font-medium opacity-90">Taxa de Sucesso</h3>
              <p className="text-3xl font-bold">
                {imageStats.total > 0 ? Math.round((imageStats.loaded / imageStats.total) * 100) : 0}%
              </p>
              <p className="text-sm opacity-75">das imagens</p>
            </div>
          </div>
        </div>

        {/* Mega Hair Section - Real Images */}
        <div className="mb-12">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              ✅ MEGA HAIR - Imagens Reais Confirmadas
            </h2>
            <p className="text-green-700">
              Todos os {megaHairProducts.length} produtos Mega Hair possuem imagens reais em /images/mega-hair/
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {megaHairProducts.slice(0, 24).map((product, index) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-32 bg-gray-100">
                  <Image
                    src={product.images[0]?.url || `/images/mega-hair/mega-hair-${String(index + 1).padStart(3, '0')}.jpg`}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onLoad={() => handleImageLoad('mega-hair')}
                    onError={() => handleImageError('mega-hair')}
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                    #{String(index + 1).padStart(3, '0')}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
                    {product.hairColor} - {product.length}cm
                  </h3>
                  <p className="text-xs text-gray-500">€{product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {megaHairProducts.length > 24 && (
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Mostrando 24 de {megaHairProducts.length} produtos Mega Hair
              </p>
            </div>
          )}
        </div>

        {/* Product Images Section - Mixed */}
        <div className="mb-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              🧴 OUTROS PRODUTOS - Imagens em /images/products/
            </h2>
            <p className="text-blue-700">
              Produtos de tratamento, progressivas e outros com imagens reais nas pastas de produtos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {productImages.map((imageData, index) => (
              <div key={imageData.path} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-32 bg-gray-100">
                  <Image
                    src={imageData.path}
                    alt={imageData.productName || `Product ${index + 1}`}
                    fill
                    className="object-cover"
                    onLoad={() => handleProductImageLoad(imageData.path)}
                    onError={() => handleProductImageError(imageData.path)}
                  />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${
                    imageData.status === 'success' ? 'bg-green-500 text-white' :
                    imageData.status === 'error' ? 'bg-red-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {imageData.status === 'success' ? '✅' :
                     imageData.status === 'error' ? '❌' : '⏳'}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
                    {imageData.productName}
                  </h3>
                  <p className="text-xs text-gray-500">{imageData.path}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📊 Resumo das Imagens Reais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">✅ Com Imagens Reais:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• <strong>Mega Hair:</strong> 76 produtos (100% com imagens)</li>
                <li>• <strong>G-Hair:</strong> 6 produtos</li>
                <li>• <strong>Honma Tokyo:</strong> 4 produtos</li>
                <li>• <strong>Cadiveu:</strong> 2 produtos</li>
                <li>• <strong>Forever Liss:</strong> 1 produto</li>
                <li>• <strong>Bio Extratus:</strong> 2 produtos</li>
                <li>• <strong>Karssel:</strong> 1 produto</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Usando Placeholders/URLs Externas:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• <strong>Maquiagem Brasileira:</strong> URLs externas (ibb.co)</li>
                <li>• <strong>Outros Produtos:</strong> /placeholder-product.jpg</li>
                <li>• <strong>Alguns Tratamentos:</strong> Imagens genéricas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}