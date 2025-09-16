'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Info,
  Crown,
  Sparkles,
  Zap,
  AlertCircle,
  Check,
  Package,
  Ruler,
  Palette,
  X
} from 'lucide-react';
import { HairColor, HairColorDifficulty } from '@/types/hairColor';
import { COLOR_INDEX_BY_CODE } from '@/lib/data/hairColors';
import { calculateMegaHairPrice, TechnicalComplexity, HairQuality, HairOrigin } from '@/lib/pricing';
import { useCart } from '@/lib/stores/unifiedCartStore';
import ColorSelector from './ColorSelector';
import { getWorkingImageUrl, handleImageError } from '@/lib/utils/imageUtils';

interface MegaHairProduct {
  id: number;
  sku: string;
  name: string;
  type: string;
  color: string;
  colorCode?: string;
  length: number;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  origin: string;
  weight: number;
  quality?: 'standard' | 'premium' | 'virgem' | 'virgem AAA+';
  collection?: 'CLASSIC' | 'PREMIUM' | 'GOLD' | 'RAPUNZEL' | 'PROFESSIONAL';
  description?: string;
  technicalSpecs?: {
    density: string;
    thermalResistance: string;
    cuticleDirection: string;
  };
}

interface EnhancedProductCardProps {
  product: MegaHairProduct;
  viewMode?: 'grid' | 'list';
  showColorSelector?: boolean;
  showTechnicalInfo?: boolean;
  onProductSelect?: (product: MegaHairProduct) => void;
  className?: string;
}

const difficultyIcons = {
  basic: <Star className="w-4 h-4 text-green-500" />,
  intermediate: <Zap className="w-4 h-4 text-yellow-500" />,
  advanced: <Crown className="w-4 h-4 text-orange-500" />,
  premium: <Sparkles className="w-4 h-4 text-purple-500" />
};

const qualityBadges = {
  standard: 'bg-gray-100 text-gray-800',
  premium: 'bg-blue-100 text-blue-800',
  virgem: 'bg-green-100 text-green-800',
  'virgem AAA+': 'bg-purple-100 text-purple-800'
};

const collectionStyles = {
  CLASSIC: 'bg-gray-900 text-white',
  PREMIUM: 'bg-blue-600 text-white',
  GOLD: 'bg-yellow-600 text-white',
  RAPUNZEL: 'bg-purple-600 text-white',
  PROFESSIONAL: 'bg-indigo-600 text-white'
};

export default function EnhancedProductCard({
  product,
  viewMode = 'grid',
  showColorSelector = false,
  showTechnicalInfo = false,
  onProductSelect,
  className = ''
}: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedColor, setSelectedColor] = useState<HairColor | null>(null);
  const [customPrice, setCustomPrice] = useState(product.price);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addItem } = useCart();

  // Get hair color information
  const hairColor = useMemo(() => {
    if (!product.colorCode) return null;
    return COLOR_INDEX_BY_CODE(product.colorCode);
  }, [product.colorCode]);

  // Calculate dynamic pricing based on selections
  const calculatedPrice = useMemo(() => {
    if (!selectedColor) return product.price;

    const complexityMap: Record<HairColorDifficulty, TechnicalComplexity> = {
      basic: TechnicalComplexity.BASIC,
      intermediate: TechnicalComplexity.INTERMEDIATE,
      advanced: TechnicalComplexity.ADVANCED,
      premium: TechnicalComplexity.PREMIUM
    };

    const qualityMap: Record<string, HairQuality> = {
      standard: HairQuality.STANDARD,
      premium: HairQuality.PREMIUM,
      virgem: HairQuality.VIRGEM,
      'virgem AAA+': HairQuality.VIRGEM_AAA
    };

    const originMap: Record<string, HairOrigin> = {
      brasileiro: HairOrigin.BRASILEIRO,
      europeu: HairOrigin.EUROPEU,
      'indiano remy': HairOrigin.INDIANO_REMY,
      'virgem aaa': HairOrigin.VIRGEM_AAA
    };

    return calculateMegaHairPrice({
      basePrice: product.price,
      weight: product.weight,
      length: product.length,
      complexity: complexityMap[selectedColor.difficulty] || TechnicalComplexity.BASIC,
      quality: qualityMap[product.quality || 'standard'] || HairQuality.STANDARD,
      origin: originMap[product.origin.toLowerCase()] || HairOrigin.BRASILEIRO
    }).finalPrice;
  }, [selectedColor, product]);

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id.toString(),
      product: {
        id: product.id.toString(),
        name: selectedColor ? `${product.name} - ${selectedColor.name}` : product.name,
        slug: product.sku.toLowerCase(),
        brand: 'JC Hair Studio',
        price: calculatedPrice,
        comparePrice: product.originalPrice || product.price,
        images: [{ url: product.image, alt: product.name, isMain: true }],
        category: 'mega-hair',
        weight: product.weight / 1000 // Convert to kg
      },
      quantity: 1,
      variant: selectedColor ? {
        id: selectedColor.code,
        name: selectedColor.name,
        price: calculatedPrice
      } : undefined,
      maxQuantity: product.inStock ? 10 : 0
    };

    addItem(cartItem);
  };

  const handleColorSelect = (color: HairColor) => {
    setSelectedColor(color);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - calculatedPrice) / product.originalPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <div className={`bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all p-6 ${className}`}>
        <div className="flex space-x-6">
          {/* Product Image */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <Image
              src={getWorkingImageUrl(product.image, product.id)}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = handleImageError(product.id);
              }}
            />
            {product.badge && (
              <span className={`absolute -top-2 -right-2 px-2 py-1 text-xs font-bold rounded-full ${
                collectionStyles[product.collection as keyof typeof collectionStyles] || 'bg-gray-600 text-white'
              }`}>
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  €{calculatedPrice.toFixed(2)}
                </div>
                {discountPercentage > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 line-through">
                      €{product.originalPrice?.toFixed(2)}
                    </span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      -{discountPercentage}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Ruler className="w-4 h-4 mr-1" />
                {product.length}cm
              </div>
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-1" />
                {product.weight}g
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                {product.rating} ({product.reviews})
              </div>
            </div>

            {product.quality && (
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                qualityBadges[product.quality]
              }`}>
                {product.quality.toUpperCase()}
              </span>
            )}

            {showColorSelector && (
              <div className="mt-4">
                <ColorSelector
                  selectedColor={selectedColor?.code}
                  onColorSelect={handleColorSelect}
                  showTechnicalInfo={false}
                  className="max-w-md"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2 w-32">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors text-sm font-medium flex items-center justify-center"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Adicionar
            </button>

            <button
              onClick={() => setShowDetails(true)}
              className="w-full px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              Detalhes
            </button>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-full px-4 py-2 border rounded-lg transition-colors text-sm flex items-center justify-center ${
                isWishlisted
                  ? 'border-red-200 bg-red-50 text-red-600'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 mr-1 ${isWishlisted ? 'fill-current' : ''}`} />
              {isWishlisted ? 'Salvo' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      layout
      className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl">
        <Image
          src={getWorkingImageUrl(product.image, product.id)}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = handleImageError(product.id);
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.badge && (
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
              collectionStyles[product.collection as keyof typeof collectionStyles] || 'bg-gray-600 text-white'
            }`}>
              {product.badge}
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-full">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-lg font-medium text-gray-900">
              Fora de Estoque
            </span>
          </div>
        )}

        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && product.inStock && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-3 left-3 right-3 flex space-x-2"
            >
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Adicionar
              </button>

              <button
                onClick={() => setShowDetails(true)}
                className="bg-white text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isWishlisted
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hair Color Indicator */}
        {hairColor && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1 shadow-sm">
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: hairColor.hexCode || '#8B4513' }}
              />
              <span className="text-xs font-medium text-gray-700">
                #{hairColor.code}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
          </div>

          {hairColor && difficultyIcons[hairColor.difficulty]}
        </div>

        {/* Technical Info */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
          <span>{product.length}cm</span>
          <span>{product.weight}g</span>
          <span className="capitalize">{product.origin}</span>
        </div>

        {/* Quality Badge */}
        {product.quality && (
          <div className="mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              qualityBadges[product.quality]
            }`}>
              {product.quality.toUpperCase()}
            </span>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-500 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-indigo-600">
              €{calculatedPrice.toFixed(2)}
            </div>
            {discountPercentage > 0 && (
              <div className="text-xs text-gray-500 line-through">
                €{product.originalPrice?.toFixed(2)}
              </div>
            )}
          </div>

          {selectedColor && (
            <div className="text-xs text-green-600 font-medium">
              Personalizado
            </div>
          )}
        </div>
      </div>

      {/* Color Selector Modal/Popup */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <Image
                      src={getWorkingImageUrl(product.image, product.id)}
                      alt={product.name}
                      width={400}
                      height={500}
                      className="w-full h-auto rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = handleImageError(product.id);
                      }}
                    />
                  </div>

                  <div>
                    <ColorSelector
                      selectedColor={selectedColor?.code}
                      onColorSelect={handleColorSelect}
                      showTechnicalInfo={true}
                      showCompatibility={true}
                    />

                    <div className="mt-6 flex space-x-4">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Adicionar ao Carrinho - €{calculatedPrice.toFixed(2)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}