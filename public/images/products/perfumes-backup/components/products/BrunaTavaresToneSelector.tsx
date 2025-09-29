'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check, Info } from 'lucide-react';
import brunaTavaresCatalog from '@/lib/data/bruna-tavares-bt-skin-catalog.json';

interface ToneShade {
  id: string;
  code: string;
  name: string;
  family: string;
  level: string;
  description: string;
  undertone: string;
  hex_color: string;
  image: string;
  best_match: string;
}

interface ToneFamily {
  name: string;
  description: string;
  undertone: string;
  best_for: string;
}

interface BrunaTavaresToneSelectorProps {
  onToneSelect: (shade: ToneShade) => void;
  selectedToneId?: string;
  className?: string;
}

export default function BrunaTavaresToneSelector({
  onToneSelect,
  selectedToneId,
  className = ''
}: BrunaTavaresToneSelectorProps) {
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [previewTone, setPreviewTone] = useState<ToneShade | null>(null);

  const { shades, tone_families } = brunaTavaresCatalog;
  const families = tone_families as Record<string, ToneFamily>;

  // Filter shades by selected family
  const filteredShades = selectedFamily === 'all'
    ? shades
    : shades.filter(shade => shade.family === families[selectedFamily]?.name);

  // Group shades by family for display
  const shadesByFamily = shades.reduce((acc, shade) => {
    const familyKey = Object.keys(families).find(key => families[key].name === shade.family);
    if (familyKey) {
      if (!acc[familyKey]) acc[familyKey] = [];
      acc[familyKey].push(shade);
    }
    return acc;
  }, {} as Record<string, ToneShade[]>);

  const handleToneClick = (shade: ToneShade) => {
    onToneSelect(shade);
    setPreviewTone(shade);
  };

  const formatPrice = (priceEUR: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR'
    }).format(priceEUR);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Seletor de Tons BT Skin
        </h3>
        <p className="text-gray-600">
          Escolha o tom perfeito para sua pele. 30 tons únicos desenvolvidos para a pele brasileira.
        </p>
        <div className="mt-3 text-sm text-purple-600 font-medium">
          Preço: {formatPrice(brunaTavaresCatalog.price_info.eur)} • Volume: {brunaTavaresCatalog.volume}
        </div>
      </div>

      {/* Family Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Filtrar por Família de Tons:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            onClick={() => setSelectedFamily('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedFamily === 'all'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {Object.entries(families).map(([key, family]) => (
            <button
              key={key}
              onClick={() => setSelectedFamily(key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                selectedFamily === key
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onMouseEnter={() => setShowInfo(key)}
              onMouseLeave={() => setShowInfo(null)}
            >
              {key.toUpperCase()}
              {showInfo === key && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                  <div className="bg-black text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                    <div className="font-semibold">{family.name}</div>
                    <div>{family.best_for}</div>
                    <div className="text-gray-300">{family.undertone}</div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Current Selection Preview */}
      {previewTone && (
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Image
                src={previewTone.image}
                alt={previewTone.name}
                width={80}
                height={80}
                className="rounded-lg shadow-md"
              />
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: previewTone.hex_color }}
              ></div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{previewTone.name}</h4>
              <p className="text-sm text-gray-600 mb-1">{previewTone.description}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                  {previewTone.family} {previewTone.level}
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {previewTone.undertone}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <strong>Ideal para:</strong> {previewTone.best_match}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Shade Grid */}
      <div className="space-y-6">
        {selectedFamily === 'all' ? (
          // Show by family groups
          Object.entries(shadesByFamily).map(([familyKey, familyShades]) => (
            <div key={familyKey}>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {familyKey.toUpperCase()}
                </span>
                <span className="text-sm text-gray-600">
                  {families[familyKey]?.name} - {families[familyKey]?.best_for}
                </span>
              </h4>
              <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-3">
                {familyShades.map((shade) => (
                  <div key={shade.id} className="text-center">
                    <button
                      onClick={() => handleToneClick(shade)}
                      className={`relative group block transition-all duration-200 hover:scale-105 ${
                        selectedToneId === shade.id ? 'ring-4 ring-purple-400 shadow-lg' : 'hover:shadow-md'
                      }`}
                      title={`${shade.name} - ${shade.best_match}`}
                    >
                      <div className="relative">
                        <Image
                          src={shade.image}
                          alt={shade.name}
                          width={60}
                          height={60}
                          className="rounded-lg"
                        />
                        {selectedToneId === shade.id && (
                          <div className="absolute inset-0 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Check className="w-6 h-6 text-white bg-purple-500 rounded-full p-1" />
                          </div>
                        )}
                        {/* Color swatch */}
                        <div
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: shade.hex_color }}
                        ></div>
                      </div>
                    </button>
                    <div className="mt-1 text-xs font-medium text-gray-700">
                      {shade.code}
                    </div>
                    <div className="text-xs text-gray-500">
                      {shade.level}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          // Show filtered shades
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
            {filteredShades.map((shade) => (
              <div key={shade.id} className="text-center">
                <button
                  onClick={() => handleToneClick(shade)}
                  className={`relative group block transition-all duration-200 hover:scale-105 ${
                    selectedToneId === shade.id ? 'ring-4 ring-purple-400 shadow-lg' : 'hover:shadow-md'
                  }`}
                  title={`${shade.name} - ${shade.best_match}`}
                >
                  <div className="relative">
                    <Image
                      src={shade.image}
                      alt={shade.name}
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                    {selectedToneId === shade.id && (
                      <div className="absolute inset-0 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Check className="w-6 h-6 text-white bg-purple-500 rounded-full p-1" />
                      </div>
                    )}
                    {/* Color swatch */}
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: shade.hex_color }}
                    ></div>
                  </div>
                </button>
                <div className="mt-2 text-sm font-medium text-gray-900">
                  {shade.code}
                </div>
                <div className="text-xs text-gray-600">
                  {shade.level}
                </div>
                <div className="text-xs text-gray-500">
                  {shade.undertone.split('/')[0]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Info Footer */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold text-blue-900 mb-1">
                Dicas para Escolha do Tom Perfeito:
              </div>
              <ul className="text-blue-800 space-y-1 text-xs">
                <li>• <strong>F (Fair):</strong> Peles claras com subtom frio/rosado</li>
                <li>• <strong>L (Light):</strong> Peles claras/médias com subtom neutro</li>
                <li>• <strong>M (Medium):</strong> Peles médias com subtom quente/dourado</li>
                <li>• <strong>T (Tan):</strong> Peles bronzeadas com subtom quente/acobreado</li>
                <li>• <strong>D (Deep):</strong> Peles escuras com subtom quente/dourado</li>
                <li>• O número indica a intensidade: 10 (mais claro) a 60 (mais escuro)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}