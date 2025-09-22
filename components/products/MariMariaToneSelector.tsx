'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/stores/cartStore';
import { toast } from 'react-toastify';

interface ToneOption {
  id: string;
  name: string;
  toneName: string;
  hexColor: string;
  undertone: string;
  skinType: string;
  description: string;
  image: string;
  available: boolean;
}

interface MariMariaToneSelectorProps {
  onToneSelect: (tone: ToneOption) => void;
  selectedTone?: ToneOption | null;
  className?: string;
}

const toneOptions: ToneOption[] = [
  {
    id: 'amendoa',
    name: 'Amêndoa',
    toneName: 'Tom bege claro com subtom neutro-quente',
    hexColor: '#D4B5A0',
    undertone: 'Neutro-quente',
    skinType: 'Pele clara com subtom dourado',
    description: 'Perfeito para peles claras com subtom neutro a quente',
    image: '/images/products/mari-maria-bases/mari-maria-base-amndoa.png',
    available: true
  },
  {
    id: 'baunilha',
    name: 'Baunilha',
    toneName: 'Tom bege claro com subtom amarelado/dourado',
    hexColor: '#E6C2A6',
    undertone: 'Dourado',
    skinType: 'Pele clara com subtom amarelado',
    description: 'Ideal para peles claras com subtom dourado pronunciado',
    image: '/images/products/mari-maria-bases/mari-maria-base-baunilha.png',
    available: true
  },
  {
    id: 'bege-claro',
    name: 'Bege Claro',
    toneName: 'Tom bege claro neutro',
    hexColor: '#E0C4A8',
    undertone: 'Neutro',
    skinType: 'Pele clara neutra',
    description: 'Versátil para peles claras com subtom neutro',
    image: '/images/products/mari-maria-bases/mari-maria-base-bege-claro.png',
    available: true
  },
  {
    id: 'bege-claro-2',
    name: 'Bege Claro 2',
    toneName: 'Variação mais rosada do bege claro',
    hexColor: '#E2C5AA',
    undertone: 'Rosado',
    skinType: 'Pele clara com subtom rosado',
    description: 'Para peles claras com subtom levemente rosado',
    image: '/images/products/mari-maria-bases/mari-maria-base-bege-claro-2.png',
    available: true
  },
  {
    id: 'nude',
    name: 'Nude',
    toneName: 'Tom claro com subtom rosado',
    hexColor: '#DDB892',
    undertone: 'Rosado',
    skinType: 'Pele clara a média com subtom rosado',
    description: 'Tom nude natural para peles com subtom rosado',
    image: '/images/products/mari-maria-bases/mari-maria-base-nude.png',
    available: true
  },
  {
    id: 'bege-medio',
    name: 'Bege Médio',
    toneName: 'Tom intermediário neutro',
    hexColor: '#C9A876',
    undertone: 'Neutro',
    skinType: 'Pele média neutra',
    description: 'Equilibrado para peles de tom médio neutro',
    image: '/images/products/mari-maria-bases/mari-maria-base-bege-mdio.png',
    available: true
  },
  {
    id: 'caramelo',
    name: 'Caramelo',
    toneName: 'Tom médio com subtom dourado/caramelo',
    hexColor: '#B8956A',
    undertone: 'Dourado',
    skinType: 'Pele média com subtom dourado',
    description: 'Dourado caramelo para peles médias quentes',
    image: '/images/products/mari-maria-bases/mari-maria-base-caramelo.png',
    available: true
  },
  {
    id: 'canela',
    name: 'Canela',
    toneName: 'Tom médio com subtom avermelhado/canela',
    hexColor: '#B5845C',
    undertone: 'Avermelhado',
    skinType: 'Pele média com subtom avermelhado',
    description: 'Tom canela quente para peles com subtom vermelho',
    image: '/images/products/mari-maria-bases/mari-maria-base-canela.png',
    available: true
  },
  {
    id: 'bege-escuro',
    name: 'Bege Escuro',
    toneName: 'Tom médio com subtom marrom',
    hexColor: '#A67C52',
    undertone: 'Marrom',
    skinType: 'Pele média a escura neutra',
    description: 'Para peles médias a escuras com subtom neutro',
    image: '/images/products/mari-maria-bases/mari-maria-base-bege-escuro.png',
    available: true
  },
  {
    id: 'cacau',
    name: 'Cacau',
    toneName: 'Tom médio-escuro com subtom chocolate',
    hexColor: '#8B5A3C',
    undertone: 'Chocolate',
    skinType: 'Pele escura com subtom quente',
    description: 'Tom cacau rico para peles escuras quentes',
    image: '/images/products/mari-maria-bases/mari-maria-base-cacau.png',
    available: true
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    toneName: 'Tom escuro com subtom marrom intenso',
    hexColor: '#704233',
    undertone: 'Marrom intenso',
    skinType: 'Pele muito escura',
    description: 'Tom chocolate profundo para peles muito escuras',
    image: '/images/products/mari-maria-bases/mari-maria-base-chocolate.png',
    available: true
  }
];

export default function MariMariaToneSelector({
  onToneSelect,
  selectedTone,
  className = ''
}: MariMariaToneSelectorProps) {
  const [hoveredTone, setHoveredTone] = useState<ToneOption | null>(null);
  const { addItem } = useCart();

  const handleToneClick = (tone: ToneOption) => {
    if (tone.available) {
      onToneSelect(tone);
    }
  };

  const displayTone = hoveredTone || selectedTone || toneOptions[1]; // Default to Baunilha

  return (
    <div className={`mari-maria-tone-selector ${className}`}>
      {/* Product Display */}
      <div className="product-display mb-8">
        <div className="relative w-full max-w-md mx-auto">
          <Image
            src={displayTone.image}
            alt={`Mari Maria Base ${displayTone.name}`}
            width={400}
            height={600}
            className="w-full h-auto object-contain"
            priority
          />
          <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-3 rounded-lg">
            <h3 className="font-semibold text-lg">{displayTone.name}</h3>
            <p className="text-sm opacity-90">{displayTone.toneName}</p>
          </div>
        </div>
      </div>

      {/* Tone Information */}
      <div className="tone-info mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-1">Subtom</h4>
            <p className="text-sm">{displayTone.undertone}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-1">Tipo de Pele</h4>
            <p className="text-sm">{displayTone.skinType}</p>
          </div>
        </div>
        <div className="mt-3">
          <h4 className="font-semibold text-sm text-gray-700 mb-1">Descrição</h4>
          <p className="text-sm">{displayTone.description}</p>
        </div>
      </div>

      {/* Tone Grid */}
      <div className="tone-grid">
        <h3 className="text-lg font-semibold mb-4">Escolha seu tom ideal:</h3>
        <div className="grid grid-cols-6 gap-3 mb-6">
          {toneOptions.map((tone) => (
            <button
              key={tone.id}
              className={`tone-option relative group ${
                selectedTone?.id === tone.id ? 'selected' : ''
              } ${!tone.available ? 'unavailable' : ''}`}
              onClick={() => handleToneClick(tone)}
              onMouseEnter={() => setHoveredTone(tone)}
              onMouseLeave={() => setHoveredTone(null)}
              disabled={!tone.available}
            >
              <div
                className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                  selectedTone?.id === tone.id
                    ? 'border-orange-500 border-4 scale-110'
                    : 'border-gray-300 hover:border-orange-400'
                } ${!tone.available ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                style={{ backgroundColor: tone.hexColor }}
              />

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {tone.name}
              </div>

              {/* Selected indicator */}
              {selectedTone?.id === tone.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                </div>
              )}

              {/* Unavailable indicator */}
              {!tone.available && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0.5 h-8 bg-red-500 rotate-45"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tone Legend */}
      <div className="tone-legend mt-6 p-4 bg-orange-50 rounded-lg">
        <h4 className="font-semibold text-sm text-gray-800 mb-2">Guia de Subtons:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-300 rounded-full mr-2"></div>
            <span><strong>Dourado:</strong> Peles quentes</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-pink-300 rounded-full mr-2"></div>
            <span><strong>Rosado:</strong> Peles frias</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
            <span><strong>Neutro:</strong> Peles equilibradas</span>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      {selectedTone && (
        <div className="mt-6">
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
            onClick={async () => {
              try {
                addItem({
                  productId: `mari-maria-${selectedTone.id}`,
                  quantity: 1,
                  product: {
                    id: `mari-maria-${selectedTone.id}`,
                    name: `Mari Maria - ${selectedTone.name}`,
                    slug: `mari-maria-${selectedTone.name.toLowerCase().replace(/\s+/g, '-')}`,
                    price: 45.90, // Preço base Mari Maria
                    images: selectedTone.image ? [{
                      url: selectedTone.image,
                      alt: `Mari Maria ${selectedTone.name}`,
                      isMain: true
                    }] : [],
                    status: 'ACTIVE' as any,
                    quantity: 999,
                  },
                  variant: {
                    id: selectedTone.id,
                    name: selectedTone.toneName,
                    price: 45.90,
                    quantity: 999,
                  }
                });

                toast.success(`Mari Maria ${selectedTone.name} adicionado ao carrinho!`, {
                  position: 'top-right',
                  autoClose: 3000,
                });
              } catch (error) {
                console.error('Erro ao adicionar ao carrinho:', error);
                toast.error('Erro ao adicionar produto ao carrinho');
              }
            }}
          >
            Adicionar ao Carrinho - {selectedTone.name}
          </Button>
        </div>
      )}

      <style jsx>{`
        .tone-option.selected {
          transform: scale(1.1);
        }

        .tone-option:hover:not(.unavailable) {
          transform: scale(1.05);
        }

        .tone-option.unavailable {
          filter: grayscale(50%);
        }
      `}</style>
    </div>
  );
}