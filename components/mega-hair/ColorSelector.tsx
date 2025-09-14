'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Info,
  AlertCircle,
  Check,
  Star,
  Zap,
  Crown,
  Sparkles
} from 'lucide-react';
import {
  HairColor,
  HairColorCategory,
  TechnicalDifficulty,
  Undertone
} from '@/types/hairColor';
import {
  PROFESSIONAL_HAIR_COLORS,
  getColorsByCategory,
  getCompatibleColors,
  getColorByCode,
  calculateComplexityMultiplier
} from '@/lib/data/hairColors';
import {
  findColorByDescription,
  suggestColorsForSkinTone,
  validateColorTransition,
  generateColorFormulation
} from '@/lib/utils/hairColorUtils';

interface ColorSelectorProps {
  selectedColor?: string;
  onColorSelect: (color: HairColor) => void;
  showTechnicalInfo?: boolean;
  showCompatibility?: boolean;
  className?: string;
  currentHairColor?: string;
  skinTone?: 'cool' | 'warm' | 'neutral';
}

const difficultyIcons = {
  basic: <Star className="w-4 h-4 text-green-500" />,
  intermediate: <Zap className="w-4 h-4 text-yellow-500" />,
  advanced: <Crown className="w-4 h-4 text-orange-500" />,
  premium: <Sparkles className="w-4 h-4 text-purple-500" />
};

const difficultyColors = {
  basic: 'border-green-200 bg-green-50',
  intermediate: 'border-yellow-200 bg-yellow-50',
  advanced: 'border-orange-200 bg-orange-50',
  premium: 'border-purple-200 bg-purple-50'
};

const undertoneColors = {
  cool: 'bg-blue-100 text-blue-800',
  warm: 'bg-orange-100 text-orange-800',
  neutral: 'bg-gray-100 text-gray-800'
};

export default function ColorSelector({
  selectedColor,
  onColorSelect,
  showTechnicalInfo = true,
  showCompatibility = false,
  className = '',
  currentHairColor,
  skinTone,
}: ColorSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<HairColorCategory>('natural');
  const [selectedColorObj, setSelectedColorObj] = useState<HairColor | null>(null);
  const [showFormulation, setShowFormulation] = useState(false);

  // Organize colors by category
  const colorsByCategory = useMemo(() => {
    return {
      natural: getColorsByCategory('natural'),
      loiro: getColorsByCategory('loiro'),
      fashion: getColorsByCategory('fashion')
    };
  }, []);

  // Get compatible colors for current selection
  const compatibleColors = useMemo(() => {
    if (!selectedColorObj) return [];
    return getCompatibleColors(selectedColorObj.code);
  }, [selectedColorObj]);

  // Get suggested colors for skin tone
  const suggestedColors = useMemo(() => {
    if (!skinTone) return [];
    return suggestColorsForSkinTone(skinTone);
  }, [skinTone]);

  // Validate color transition
  const transitionInfo = useMemo(() => {
    if (!selectedColorObj || !currentHairColor) return null;
    return validateColorTransition(currentHairColor, selectedColorObj.code);
  }, [selectedColorObj, currentHairColor]);

  useEffect(() => {
    if (selectedColor) {
      const color = getColorByCode(selectedColor);
      setSelectedColorObj(color || null);
    }
  }, [selectedColor]);

  const handleColorSelect = (color: HairColor) => {
    setSelectedColorObj(color);
    onColorSelect(color);
  };

  const getFormulation = () => {
    if (!selectedColorObj || !currentHairColor) return null;
    return generateColorFormulation(currentHairColor, selectedColorObj.code);
  };

  const categoryLabels = {
    natural: 'Cores Naturais',
    loiro: 'Tons Loiros',
    fashion: 'Cores Especiais'
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <Palette className="w-6 h-6 text-indigo-600 mr-3" />
        <h3 className="text-xl font-bold text-gray-900">
          Seleção de Cor Profissional
        </h3>
      </div>

      {/* Skin Tone Suggestions */}
      {skinTone && suggestedColors.length > 0 && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-xl">
          <h4 className="text-sm font-medium text-indigo-900 mb-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Recomendado para seu tom de pele ({skinTone})
          </h4>
          <div className="flex flex-wrap gap-2">
            {suggestedColors.map(color => (
              <button
                key={color.code}
                onClick={() => handleColorSelect(color)}
                className="px-3 py-1 text-xs bg-indigo-100 hover:bg-indigo-200 rounded-full transition-colors"
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key as HairColorCategory)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeCategory === key
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {colorsByCategory[activeCategory]?.map((color) => {
          const isSelected = selectedColorObj?.code === color.code;
          const multiplier = calculateComplexityMultiplier(color.difficulty);

          return (
            <motion.div
              key={color.code}
              layoutId={`color-${color.code}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50'
                  : `${difficultyColors[color.difficulty]} hover:shadow-md`
              }`}
              onClick={() => handleColorSelect(color)}
            >
              {/* Color Visual */}
              <div
                className="w-full h-16 rounded-lg mb-3 shadow-inner"
                style={{ backgroundColor: color.hexCode || '#8B4513' }}
              />

              {/* Color Info */}
              <div className="text-center">
                <div className="font-bold text-sm text-gray-900 mb-1">
                  #{color.code}
                </div>
                <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {color.name}
                </div>

                {/* Technical Info */}
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {difficultyIcons[color.difficulty]}
                  <span className={`text-xs px-2 py-1 rounded-full ${undertoneColors[color.undertone]}`}>
                    {color.undertone}
                  </span>
                </div>

                {/* Price Multiplier */}
                <div className="text-xs font-medium text-indigo-600">
                  +{Math.round((multiplier - 1) * 100)}% preço
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Selected Color Details */}
      <AnimatePresence>
        {selectedColorObj && showTechnicalInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t pt-6"
          >
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 text-indigo-600 mr-2" />
              Informações Técnicas
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Color Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Código:</span>
                  <span className="font-medium">#{selectedColorObj.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nome técnico:</span>
                  <span className="font-medium">{selectedColorObj.technicalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Categoria:</span>
                  <span className="font-medium capitalize">{selectedColorObj.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Dificuldade:</span>
                  <span className="flex items-center">
                    {difficultyIcons[selectedColorObj.difficulty]}
                    <span className="ml-1 capitalize">{selectedColorObj.difficulty}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tempo de processo:</span>
                  <span className="font-medium">{selectedColorObj.processingTime}</span>
                </div>
              </div>

              {/* Compatibility & Warnings */}
              <div className="space-y-3">
                {/* Transition Warning */}
                {transitionInfo && !transitionInfo.safe && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                      <span className="text-sm font-medium text-red-800">Atenção!</span>
                    </div>
                    <p className="text-xs text-red-700">{transitionInfo.warning}</p>
                  </div>
                )}

                {/* Care Instructions */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Cuidados:</h5>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {selectedColorObj.careInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Compatible Colors */}
            {showCompatibility && compatibleColors.length > 0 && (
              <div className="mt-6">
                <h5 className="text-sm font-medium text-gray-900 mb-3">
                  Cores compatíveis para harmonização:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {compatibleColors.slice(0, 6).map(color => (
                    <button
                      key={color.code}
                      onClick={() => handleColorSelect(color)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      #{color.code} {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Formulation Button */}
            {currentHairColor && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowFormulation(!showFormulation)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  {showFormulation ? 'Ocultar' : 'Ver'} Formulação Profissional
                </button>
              </div>
            )}

            {/* Formulation Details */}
            <AnimatePresence>
              {showFormulation && getFormulation() && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 p-4 bg-gray-50 rounded-lg"
                >
                  <h5 className="font-medium text-gray-900 mb-3">Formulação Técnica:</h5>
                  <div className="text-sm text-gray-700 space-y-2">
                    {Object.entries(getFormulation()!).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}