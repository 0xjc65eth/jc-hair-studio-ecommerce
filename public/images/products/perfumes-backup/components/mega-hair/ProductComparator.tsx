'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlusIcon, ScaleIcon } from '@heroicons/react/24/outline';

interface MegaHairProduct {
  id: number;
  name: string;
  type: 'liso' | 'ondulado' | 'cacheado' | 'crespo';
  color: 'loiro' | 'castanho' | 'preto' | 'ruivo' | 'ombre';
  length: number;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  weight: number;
  origin: string;
}

interface ProductComparatorProps {
  products: MegaHairProduct[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductComparator({ products, isOpen, onClose }: ProductComparatorProps) {
  const [compareProducts, setCompareProducts] = useState<MegaHairProduct[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const addToCompare = (product: MegaHairProduct) => {
    if (compareProducts.length < 3 && !compareProducts.find(p => p.id === product.id)) {
      setCompareProducts([...compareProducts, product]);
    }
    setShowAddProduct(false);
  };

  const removeFromCompare = (productId: number) => {
    setCompareProducts(compareProducts.filter(p => p.id !== productId));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const typeNames: Record<string, string> = {
    'liso': 'Liso Natural',
    'ondulado': 'Ondulado Suave',
    'cacheado': 'Cacheado Definido',
    'crespo': 'Crespo Natural'
  };

  const availableProducts = products.filter(p => !compareProducts.find(cp => cp.id === p.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <ScaleIcon className="w-6 h-6 text-rose-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Comparar Produtos</h2>
                <span className="bg-rose-100 text-rose-600 text-sm px-2 py-1 rounded-full">
                  {compareProducts.length}/3
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {compareProducts.length === 0 ? (
                <div className="text-center py-12">
                  <ScaleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">
                    Nenhum produto para comparar
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Adicione até 3 produtos para comparar suas características
                  </p>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Adicionar Produto
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Add Product Button */}
                  {compareProducts.length < 3 && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowAddProduct(true)}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        <PlusIcon className="w-5 h-5" />
                        Adicionar Produto
                      </button>
                    </div>
                  )}

                  {/* Comparison Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <td className="w-48 py-4"></td>
                          {compareProducts.map(product => (
                            <td key={product.id} className="px-4 py-4 text-center min-w-64">
                              <div className="relative">
                                <button
                                  onClick={() => removeFromCompare(product.id)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors z-10"
                                >
                                  ×
                                </button>
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                  <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/200x150/f3f4f6/9ca3af?text=Mega+Hair';
                                      }}
                                    />
                                  </div>
                                  <h3 className="font-medium text-sm line-clamp-2">
                                    {product.name}
                                  </h3>
                                </div>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {/* Preço */}
                        <tr>
                          <td className="py-4 font-medium text-gray-900">Preço</td>
                          {compareProducts.map(product => (
                            <td key={product.id} className="px-4 py-4 text-center">
                              <span className="text-xl font-bold text-rose-600">
                                {formatPrice(product.price)}
                              </span>
                            </td>
                          ))}
                        </tr>

                        {/* Tipo */}
                        <tr className="bg-gray-50">
                          <td className="py-4 font-medium text-gray-900">Tipo</td>
                          {compareProducts.map(product => (
                            <td key={product.id} className="px-4 py-4 text-center">
                              {typeNames[product.type]}
                            </td>
                          ))}
                        </tr>

                        {/* Comprimento */}
                        <tr>
                          <td className="py-4 font-medium text-gray-900">Comprimento</td>
                          {compareProducts.map(product => (
                            <td key={product.id} className="px-4 py-4 text-center">
                              <span className="text-lg font-semibold">{product.length}cm</span>
                            </td>
                          ))}
                        </tr>

                        {/* Peso */}
                        <tr className="bg-gray-50">
                          <td className="py-4 font-medium text-gray-900">Peso</td>
                          {compareProducts.map(product => (
                            <td key={product.id} className="px-4 py-4 text-center">
                              {product.weight}g
                            </td>
                          ))}
                        </tr>

                        {/* Cor */}
                        <tr>
                          <td className="py-4 font-medium text-gray-900">Cor</td>
                          {compareProducts.map(product => (
                            <td key={product.id} className="px-4 py-4 text-center">
                              {product.color.charAt(0).toUpperCase() + product.color.slice(1)}
                            </td>
                          ))}
                        </tr>

                        {/* Origem */}
                        <tr className="bg-gray-50">
                          <td className="py-4 font-medium text-gray-900">Origem</td>
                          {compareProducts.map(product => (
                            <td key={product.id} className="px-4 py-4 text-center">
                              {product.origin}
                            </td>
                          ))}
                        </tr>

                        {/* Avaliação */}
                        <tr>
                          <td className="py-4 font-medium text-gray-900">Avaliação</td>
                          {compareProducts.map(product => (
                            <td key={product.id} className="px-4 py-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-sm">
                                      {i < Math.floor(product.rating) ? '★' : '☆'}
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">
                                  ({product.reviews})
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>

                        {/* Preço por grama */}
                        <tr className="bg-gray-50">
                          <td className="py-4 font-medium text-gray-900">Preço por grama</td>
                          {compareProducts.map(product => (
                            <td key={product.id} className="px-4 py-4 text-center">
                              {formatPrice(product.price / product.weight)}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                      {compareProducts.map(product => (
                        <button
                          key={product.id}
                          className="bg-rose-600 text-white py-3 px-6 rounded-lg hover:bg-rose-700 transition-colors font-medium"
                        >
                          Adicionar ao Carrinho
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Add Product Modal */}
              {showAddProduct && (
                <div className="fixed inset-0 bg-black/50 z-10 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-auto">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Selecionar Produto</h3>
                        <button
                          onClick={() => setShowAddProduct(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {availableProducts.slice(0, 8).map(product => (
                        <button
                          key={product.id}
                          onClick={() => addToCompare(product)}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-rose-300 hover:bg-rose-50 transition-colors text-left"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=MH';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2">
                              {product.name}
                            </h4>
                            <p className="text-sm text-rose-600 font-medium">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}