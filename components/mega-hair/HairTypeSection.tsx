'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Info, Sparkles } from 'lucide-react';
import OptimizedMegaHairImage from './OptimizedMegaHairImage';

interface MegaHairProduct {
  id: number;
  name: string;
  type: 'liso' | 'ondulado' | 'cacheado' | 'crespo';
  color: 'loiro' | 'castanho' | 'preto' | 'ruivo' | 'ombre' | 'grisalho';
  length: number | string;
  price: number;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  origin?: string;
  weight?: number;
}

interface HairTypeSectionProps {
  type: 'liso' | 'ondulado' | 'cacheado' | 'crespo';
  products: MegaHairProduct[];
  isExpanded: boolean;
  onToggle: () => void;
  onAddToCart: (product: MegaHairProduct) => void;
  onViewDetails: (product: MegaHairProduct) => void;
  isInCart: (productId: number) => boolean;
  formatPrice: (price: number) => string;
}

// Informações educativas sobre cada tipo de cabelo
const HAIR_TYPE_INFO = {
  liso: {
    title: 'Mega Hair Liso',
    subtitle: 'Tipos 1A - 2A',
    description: 'Cabelos lisos naturais sem ondulação. Ideais para looks clássicos e modernos.',
    characteristics: [
      'Escorrido e sem volume (1A)',
      'Liso com leve corpo (2A)',
      'Brilho natural intenso',
      'Fácil manutenção'
    ],
    icon: '━',
    bgColor: 'from-blue-50 to-indigo-100',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    applications: 'Perfeito para alongamento e volume. Ideal para cortes retos e asymétricos.'
  },
  ondulado: {
    title: 'Mega Hair Ondulado',
    subtitle: 'Tipos 2C - 3A',
    description: 'Ondas naturais marcantes com movimento fluido e textura definida.',
    characteristics: [
      'Ondas fortes quase cachos (2C)',
      'Ondas marcadas com tendência ao frizz (3A)',
      'Movimento natural dinâmico',
      'Volume médio balanceado'
    ],
    icon: '∼',
    bgColor: 'from-green-50 to-emerald-100',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    applications: 'Ideal para volume natural. Perfeito para looks praiais e românticos.'
  },
  cacheado: {
    title: 'Mega Hair Cacheado',
    subtitle: 'Tipo 3C',
    description: 'Cachos pequenos e bem fechados com definição perfeita e volume intenso.',
    characteristics: [
      'Cachos pequenos bem fechados',
      'Alta elasticidade natural',
      'Volume abundante',
      'Textura rica e definida'
    ],
    icon: '◯',
    bgColor: 'from-purple-50 to-violet-100',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    applications: 'Perfeito para volume dramático. Ideal para looks afro-brasileiros autênticos.'
  },
  crespo: {
    title: 'Mega Hair Crespo',
    subtitle: 'Tipos 4A - 4C',
    description: 'Texturas crespas autênticas com padrões únicos e volume máximo.',
    characteristics: [
      'Cachinhos em forma de molinha (4A)',
      'Curvatura em Z (4B)',
      'Extremamente crespo (4C)',
      'Volume máximo natural'
    ],
    icon: '※',
    bgColor: 'from-orange-50 to-amber-100',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-600',
    applications: 'Essencial para autenticidade afro. Ideal para transição capilar e volume total.'
  }
};

export default function HairTypeSection({
  type,
  products,
  isExpanded,
  onToggle,
  onAddToCart,
  onViewDetails,
  isInCart,
  formatPrice
}: HairTypeSectionProps) {
  const [showInfo, setShowInfo] = useState(false);
  const typeInfo = HAIR_TYPE_INFO[type];

  if (products.length === 0) return null;

  return (
    <div className={`border-2 ${typeInfo.borderColor} rounded-xl overflow-hidden bg-white shadow-sm`}>
      {/* Header da Seção */}
      <div className={`bg-gradient-to-r ${typeInfo.bgColor} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`text-3xl ${typeInfo.iconColor} font-bold`}>
              {typeInfo.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{typeInfo.title}</h2>
              <p className="text-sm text-gray-600">{typeInfo.subtitle}</p>
              <p className="text-sm text-gray-700 mt-1">{products.length} produtos disponíveis</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Botão de informações */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-lg border ${typeInfo.borderColor} bg-white/80 hover:bg-white transition-colors ${typeInfo.iconColor}`}
              title="Informações sobre este tipo"
            >
              <Info className="w-5 h-5" />
            </button>

            {/* Botão de expandir/colapsar */}
            <button
              onClick={onToggle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${typeInfo.borderColor} bg-white/80 hover:bg-white transition-colors`}
            >
              <span className="text-sm font-medium text-gray-700">
                {isExpanded ? 'Recolher' : 'Ver Produtos'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Descrição rápida */}
        <p className="text-gray-700 mt-3 text-sm">{typeInfo.description}</p>
      </div>

      {/* Painel de Informações Educativas */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 border-t border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Características</h3>
                  <ul className="space-y-2">
                    {typeInfo.characteristics.map((char, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Sparkles className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Aplicações Ideais</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {typeInfo.applications}
                  </p>

                  <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600">
                      💡 <strong>Dica Pro:</strong> Consulte sempre um profissional para aplicação
                      e escolha do tipo ideal para seu cabelo natural.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de Produtos */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    {/* Product Image */}
                    <Link href={`/produto/${product.id}`} className="block">
                      <div className="relative h-48 bg-gray-100">
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                            <span className="text-gray-600 text-sm">Esgotado</span>
                          </div>
                        )}

                        {/* Badge do comprimento */}
                        <span className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 text-xs rounded">
                          {product.length}cm
                        </span>

                        {/* Badge especial se houver */}
                        {product.badge && (
                          <span className="absolute top-2 right-2 bg-rose-500 text-white px-2 py-1 text-xs rounded">
                            {product.badge}
                          </span>
                        )}

                        <OptimizedMegaHairImage
                          src={product.image}
                          alt={product.name}
                          productName={product.name}
                          productType={product.type}
                          priority={index < 4}
                          className="w-full h-full"
                          showSkeleton={true}
                          lazy={index >= 4}
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="text-xs text-gray-500 mb-1">
                        {typeInfo.title} • {product.color.charAt(0).toUpperCase() + product.color.slice(1)}
                      </div>

                      <h3 className="text-sm font-medium mb-2 text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Especificações */}
                      <div className="text-xs text-gray-500 mb-3">
                        {product.length}cm • {product.weight}g
                        {product.origin && ` • ${product.origin}`}
                      </div>

                      {/* Avaliações */}
                      <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.floor(product.rating) ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.reviews})
                        </span>
                      </div>

                      {/* Preço */}
                      <div className="mb-3">
                        <div className="text-lg font-medium text-gray-900">
                          {formatPrice(product.price)}
                        </div>
                      </div>

                      {/* Botões de ação */}
                      <div className="space-y-2">
                        <button
                          onClick={() => onAddToCart(product)}
                          disabled={!product.inStock}
                          className={`w-full py-2 text-sm font-medium rounded-lg transition-colors ${
                            product.inStock
                              ? isInCart(product.id)
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {!product.inStock ? 'Esgotado' :
                           isInCart(product.id) ? 'No Carrinho' : 'Adicionar'}
                        </button>

                        <button
                          onClick={() => onViewDetails(product)}
                          className="w-full py-2 text-center text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 transition-colors rounded-lg"
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}