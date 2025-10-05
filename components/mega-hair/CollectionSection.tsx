'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Crown, Star, Gem, Sparkles, Award } from 'lucide-react';
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
  collection?: string;
  qualityGrade?: string;
}

interface CollectionSectionProps {
  collection: 'CLASSIC' | 'PREMIUM' | 'GOLD' | 'RAPUNZEL' | 'PROFESSIONAL';
  products: MegaHairProduct[];
  isExpanded: boolean;
  onToggle: () => void;
  onAddToCart: (product: MegaHairProduct) => void;
  onViewDetails: (product: MegaHairProduct) => void;
  isInCart: (productId: number) => boolean;
  formatPrice: (price: number) => string;
}

// Informações sobre cada coleção
const COLLECTION_INFO = {
  CLASSIC: {
    title: 'Coleção Classic',
    subtitle: 'Qualidade Standard • AA',
    description: 'Nossa linha essencial com excelente custo-benefício. Ideal para o dia a dia.',
    features: [
      'Cabelo 100% humano',
      'Qualidade AA certificada',
      'Variedade de texturas',
      'Preço acessível'
    ],
    icon: Star,
    bgColor: 'from-gray-50 to-slate-100',
    borderColor: 'border-gray-300',
    iconColor: 'text-gray-600',
    badgeColor: 'bg-gray-100 text-gray-700',
    priceRange: '€60 - €120',
    target: 'Perfeito para iniciantes e uso cotidiano.'
  },
  PREMIUM: {
    title: 'Coleção Premium',
    subtitle: 'Alta Qualidade • AAA',
    description: 'Qualidade superior com acabamento refinado. Para resultados profissionais.',
    features: [
      'Cabelo Remy selecionado',
      'Qualidade AAA premium',
      'Cutículas alinhadas',
      'Brilho intenso natural'
    ],
    icon: Award,
    bgColor: 'from-blue-50 to-indigo-100',
    borderColor: 'border-blue-300',
    iconColor: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-700',
    priceRange: '€80 - €180',
    target: 'Ideal para transformações marcantes e eventos especiais.'
  },
  GOLD: {
    title: 'Coleção Gold',
    subtitle: 'Luxo Exclusivo • AAAA',
    description: 'Nossa linha de luxo com qualidade excepcional. Master Class exclusiva.',
    features: [
      'Seleção Master Class',
      'Qualidade AAAA exclusiva',
      'Tecnologia anti-quebra',
      'Comprimentos especiais'
    ],
    icon: Crown,
    bgColor: 'from-yellow-50 to-amber-100',
    borderColor: 'border-yellow-400',
    iconColor: 'text-yellow-600',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    priceRange: '€140 - €250',
    target: 'Para clientes exigentes que buscam o máximo em qualidade.'
  },
  RAPUNZEL: {
    title: 'Coleção Rapunzel',
    subtitle: 'Comprimento Extremo • AAAA',
    description: 'Comprimentos extremos únicos. Nossa peça mais exclusiva e impressionante.',
    features: [
      'Comprimentos 80-90cm',
      'Qualidade AAAA máxima',
      'Densidade balanceada',
      'Transformações dramáticas'
    ],
    icon: Gem,
    bgColor: 'from-purple-50 to-violet-100',
    borderColor: 'border-purple-400',
    iconColor: 'text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-800',
    priceRange: '€180 - €300',
    target: 'Para looks dramáticos e comprimentos impressionantes.'
  },
  PROFESSIONAL: {
    title: 'Coleção Professional',
    subtitle: 'Salão Especializado • AAA',
    description: 'Linha profissional para cabeleireiros e aplicadores especializados.',
    features: [
      'Texturas especializadas',
      'Aplicação profissional',
      'Cuidados específicos',
      'Resultado autêntico'
    ],
    icon: Sparkles,
    bgColor: 'from-rose-50 to-pink-100',
    borderColor: 'border-rose-300',
    iconColor: 'text-rose-600',
    badgeColor: 'bg-rose-100 text-rose-700',
    priceRange: '€70 - €150',
    target: 'Desenvolvido para profissionais especializados.'
  }
};

export default function CollectionSection({
  collection,
  products,
  isExpanded,
  onToggle,
  onAddToCart,
  onViewDetails,
  isInCart,
  formatPrice
}: CollectionSectionProps) {
  const [showDetails, setShowDetails] = useState(false);
  const collectionInfo = COLLECTION_INFO[collection];
  const IconComponent = collectionInfo.icon;

  if (products.length === 0) return null;

  return (
    <div className={`border-2 ${collectionInfo.borderColor} rounded-xl overflow-hidden bg-white shadow-sm`}>
      {/* Header da Coleção */}
      <div className={`bg-gradient-to-r ${collectionInfo.bgColor} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg bg-white/50 ${collectionInfo.iconColor}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{collectionInfo.title}</h2>
              <p className="text-sm text-gray-600">{collectionInfo.subtitle}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${collectionInfo.badgeColor} font-medium`}>
                  {products.length} produtos
                </span>
                <span className="text-xs text-gray-600">{collectionInfo.priceRange}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Botão de detalhes */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-2 rounded-lg border ${collectionInfo.borderColor} bg-white/80 hover:bg-white transition-colors ${collectionInfo.iconColor}`}
              title="Detalhes da coleção"
            >
              <Sparkles className="w-5 h-5" />
            </button>

            {/* Botão de expandir/colapsar */}
            <button
              onClick={onToggle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${collectionInfo.borderColor} bg-white/80 hover:bg-white transition-colors`}
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
        <p className="text-gray-700 mt-3 text-sm">{collectionInfo.description}</p>
      </div>

      {/* Painel de Detalhes da Coleção */}
      <AnimatePresence>
        {showDetails && (
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
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-rose-500" />
                    Características Exclusivas
                  </h3>
                  <ul className="space-y-2">
                    {collectionInfo.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-rose-500" />
                    Público Alvo
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {collectionInfo.target}
                  </p>

                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Faixa de Preço</span>
                      <span className="text-sm text-rose-600 font-semibold">{collectionInfo.priceRange}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Preços variam conforme comprimento e especificações
                    </div>
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

                        {/* Badge da coleção */}
                        <span className={`absolute top-2 left-2 ${collectionInfo.badgeColor} px-2 py-1 text-xs rounded font-medium`}>
                          {collection}
                        </span>

                        {/* Badge do comprimento */}
                        <span className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 text-xs rounded">
                          {product.length}cm
                        </span>

                        {/* Badge especial se houver */}
                        {product.badge && (
                          <span className="absolute bottom-2 left-2 bg-rose-500 text-white px-2 py-1 text-xs rounded">
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
                        {collectionInfo.title} • {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                      </div>

                      <h3 className="text-sm font-medium mb-2 text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Especificações */}
                      <div className="text-xs text-gray-500 mb-3">
                        {product.length}cm • {product.weight}g
                        {product.qualityGrade && ` • ${product.qualityGrade}`}
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
                        <div className="text-xs text-gray-500">
                          ou 3x de {formatPrice(product.price / 3)}
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