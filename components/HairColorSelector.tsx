/**
 * Componente de Seleção de Cores de Mega Hair
 * Interface React para o sistema profissional de cores
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  HairColor,
  HairColorFilter,
  HairColorCategory,
  HairColorUndertone,
  HairColorDifficulty,
} from '@/types/hairColor';
import {
  searchHairColors,
  getColorByCode,
  getCompatibleColors,
  generateColorHarmonization,
  calculateColorTransformationCost,
  validateColorTransformation,
  ColorFilterUtils,
} from '@/lib/utils/hairColorUtils';

interface HairColorSelectorProps {
  onColorSelect?: (color: HairColor) => void;
  selectedColorCode?: string;
  showCompatibleColors?: boolean;
  showPricing?: boolean;
  maxColors?: number;
  categories?: HairColorCategory[];
  difficulties?: HairColorDifficulty[];
  basePrice?: number;
  currentHairColor?: string;
}

export function HairColorSelector({
  onColorSelect,
  selectedColorCode,
  showCompatibleColors = false,
  showPricing = false,
  maxColors = 50,
  categories,
  difficulties,
  basePrice = 100,
  currentHairColor,
}: HairColorSelectorProps) {
  const [filters, setFilters] = useState<HairColorFilter>({
    category: categories,
    difficulty: difficulties,
    isAvailable: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColor, setSelectedColor] = useState<HairColor | null>(null);
  const [compatibleColors, setCompatibleColors] = useState<HairColor[]>([]);
  const [transformationCost, setTransformationCost] = useState<number>(0);

  // Buscar cores baseado nos filtros
  const searchResults = useMemo(() => {
    const results = searchHairColors(filters);

    // Filtrar por termo de busca se fornecido
    let filteredColors = results.colors;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredColors = filteredColors.filter(
        color =>
          color.commercialName.toLowerCase().includes(term) ||
          color.technicalName.toLowerCase().includes(term) ||
          color.code.toLowerCase().includes(term) ||
          color.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return {
      ...results,
      colors: filteredColors.slice(0, maxColors),
    };
  }, [filters, searchTerm, maxColors]);

  // Atualizar cor selecionada
  useEffect(() => {
    if (selectedColorCode) {
      const color = getColorByCode(selectedColorCode);
      setSelectedColor(color || null);
    }
  }, [selectedColorCode]);

  // Atualizar cores compatíveis
  useEffect(() => {
    if (selectedColor && showCompatibleColors) {
      const compatible = getCompatibleColors(selectedColor.code);
      setCompatibleColors(compatible);
    } else {
      setCompatibleColors([]);
    }
  }, [selectedColor, showCompatibleColors]);

  // Calcular custo de transformação
  useEffect(() => {
    if (selectedColor && currentHairColor && showPricing) {
      const cost = calculateColorTransformationCost(currentHairColor, selectedColor.code);
      setTransformationCost(cost);
    }
  }, [selectedColor, currentHairColor, showPricing]);

  const handleColorSelect = (color: HairColor) => {
    setSelectedColor(color);
    onColorSelect?.(color);
  };

  const handleFilterChange = (key: keyof HairColorFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const getValidationForTransformation = () => {
    if (!selectedColor || !currentHairColor) return null;
    return validateColorTransformation(currentHairColor, selectedColor.code);
  };

  const validation = getValidationForTransformation();

  return (
    <div className="hair-color-selector p-6 bg-white rounded-lg shadow-lg">
      {/* Filtros */}
      <div className="filters mb-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Busca por texto */}
          <div>
            <label className="block text-sm font-medium mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Nome, código ou característica..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium mb-2">Categoria</label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              {ColorFilterUtils.categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Undertone */}
          <div>
            <label className="block text-sm font-medium mb-2">Tom</label>
            <select
              value={filters.undertone || ''}
              onChange={(e) => handleFilterChange('undertone', e.target.value || undefined)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {ColorFilterUtils.undertoneOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dificuldade */}
          <div>
            <label className="block text-sm font-medium mb-2">Dificuldade</label>
            <select
              value={filters.difficulty || ''}
              onChange={(e) => handleFilterChange('difficulty', e.target.value || undefined)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              {ColorFilterUtils.difficultyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtros adicionais */}
        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isPremium || false}
              onChange={(e) => handleFilterChange('isPremium', e.target.checked || undefined)}
              className="mr-2"
            />
            Apenas Premium
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isAvailable !== false}
              onChange={(e) => handleFilterChange('isAvailable', e.target.checked)}
              className="mr-2"
            />
            Apenas Disponíveis
          </label>
        </div>
      </div>

      {/* Resultados */}
      <div className="results">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Cores Encontradas ({searchResults.colors.length})
          </h3>
          {searchResults.colors.length === maxColors && (
            <span className="text-sm text-gray-500">
              Mostrando primeiros {maxColors} resultados
            </span>
          )}
        </div>

        {/* Grid de cores */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
          {searchResults.colors.map(color => (
            <div
              key={color.code}
              onClick={() => handleColorSelect(color)}
              className={`
                color-card p-3 border-2 rounded-lg cursor-pointer transition-all
                ${selectedColor?.code === color.code
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-400'
                }
              `}
            >
              {/* Swatch de cor */}
              <div
                className="w-full h-16 rounded-md mb-2 border border-gray-300"
                style={{ backgroundColor: color.hexColor }}
                title={color.hexColor}
              />

              {/* Informações da cor */}
              <div className="text-sm">
                <div className="font-semibold">{color.code}</div>
                <div className="text-gray-700">{color.commercialName}</div>
                <div className="text-xs text-gray-500 capitalize">
                  {color.category} • {color.undertone} • Nível {color.level}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {color.isPremium && (
                    <span className="px-2 py-1 bg-gold-100 text-gold-800 text-xs rounded">
                      Premium
                    </span>
                  )}
                  <span className={`
                    px-2 py-1 text-xs rounded
                    ${color.difficulty === 'basic' ? 'bg-green-100 text-green-800' : ''}
                    ${color.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${color.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' : ''}
                    ${color.difficulty === 'premium' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {color.difficulty}
                  </span>
                </div>

                {/* Preço */}
                {showPricing && (
                  <div className="mt-2 font-semibold text-green-600">
                    R$ {Math.round(basePrice * color.priceMultiplier)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {searchResults.colors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma cor encontrada com os filtros aplicados
          </div>
        )}
      </div>

      {/* Informações da cor selecionada */}
      {selectedColor && (
        <div className="selected-color-info bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Cor Selecionada</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Detalhes</h5>
              <div className="text-sm space-y-1">
                <p><strong>Código:</strong> {selectedColor.code}</p>
                <p><strong>Nome Comercial:</strong> {selectedColor.commercialName}</p>
                <p><strong>Nome Técnico:</strong> {selectedColor.technicalName}</p>
                <p><strong>Descrição:</strong> {selectedColor.description}</p>
                <p><strong>Nível:</strong> {selectedColor.level}/10</p>
                <p><strong>Tom:</strong> {selectedColor.undertone}</p>
                <p><strong>Dificuldade:</strong> {selectedColor.difficulty}</p>
              </div>
            </div>

            {selectedColor.technicalInfo && (
              <div>
                <h5 className="font-medium mb-2">Informações Técnicas</h5>
                <div className="text-sm space-y-1">
                  {selectedColor.technicalInfo.processingTime && (
                    <p><strong>Tempo:</strong> {selectedColor.technicalInfo.processingTime}</p>
                  )}
                  {selectedColor.technicalInfo.developerVolume && (
                    <p><strong>Volume:</strong> {selectedColor.technicalInfo.developerVolume}</p>
                  )}
                  {selectedColor.technicalInfo.technicalNotes && (
                    <p><strong>Observações:</strong> {selectedColor.technicalInfo.technicalNotes}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Validação de transformação */}
          {validation && (
            <div className="mt-4">
              <h5 className="font-medium mb-2">Análise da Transformação</h5>
              <div className={`
                p-3 rounded-md text-sm
                ${validation.isValid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
              `}>
                {validation.isValid ? 'Transformação segura' : 'Atenção necessária'}
                {validation.warnings.length > 0 && (
                  <div className="mt-2">
                    <strong>Avisos:</strong>
                    <ul className="list-disc list-inside">
                      {validation.warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {validation.recommendations.length > 0 && (
                  <div className="mt-2">
                    <strong>Recomendações:</strong>
                    <ul className="list-disc list-inside">
                      {validation.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Custo de transformação */}
          {showPricing && transformationCost > 0 && (
            <div className="mt-4">
              <h5 className="font-medium mb-2">Custo Estimado da Transformação</h5>
              <div className="text-2xl font-bold text-green-600">
                R$ {transformationCost}
              </div>
              <p className="text-sm text-gray-600">
                Inclui processo completo e produtos necessários
              </p>
            </div>
          )}
        </div>
      )}

      {/* Cores compatíveis */}
      {showCompatibleColors && compatibleColors.length > 0 && (
        <div className="compatible-colors mt-6">
          <h4 className="font-semibold mb-3">Cores Compatíveis</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {compatibleColors.slice(0, 8).map(color => (
              <div
                key={color.code}
                onClick={() => handleColorSelect(color)}
                className="color-swatch cursor-pointer p-2 border border-gray-200 rounded-md hover:border-gray-400 transition-colors"
                title={`${color.code} - ${color.commercialName}`}
              >
                <div
                  className="w-full h-8 rounded-sm mb-1"
                  style={{ backgroundColor: color.hexColor }}
                />
                <div className="text-xs text-center">{color.code}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}