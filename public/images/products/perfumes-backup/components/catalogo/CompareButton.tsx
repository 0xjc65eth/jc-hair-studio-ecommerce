'use client';

import { useState } from 'react';
import { Shuffle, X } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface CompareButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function CompareButton({
  productId,
  className = '',
  size = 'md',
  showLabel = false
}: CompareButtonProps) {
  const [compareList, setCompareList] = useLocalStorage<string[]>('jc-compare', []);
  const [isAnimating, setIsAnimating] = useState(false);

  const isInComparison = compareList.includes(productId);
  const isMaxReached = compareList.length >= 3 && !isInComparison;

  const toggleComparison = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isMaxReached) {
      return; // Don't add more than 3 items
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (isInComparison) {
      setCompareList(compareList.filter(id => id !== productId));
    } else {
      setCompareList([...compareList, productId]);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-10 h-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  const getButtonState = () => {
    if (isMaxReached) {
      return {
        bg: 'bg-gray-100 border-gray-200 cursor-not-allowed',
        text: 'text-gray-400',
        title: 'Máximo de 3 produtos para comparação'
      };
    }
    
    if (isInComparison) {
      return {
        bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
        text: 'text-blue-500',
        title: 'Remover da comparação'
      };
    }
    
    return {
      bg: 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50',
      text: 'text-gray-400 hover:text-blue-500',
      title: 'Adicionar para comparação'
    };
  };

  const buttonState = getButtonState();

  return (
    <button
      onClick={toggleComparison}
      disabled={isMaxReached}
      className={`
        ${getSizeClasses()}
        flex items-center justify-center
        rounded-full border-2 transition-all duration-200
        ${buttonState.bg}
        ${isAnimating ? 'scale-110' : 'hover:scale-105'}
        ${className}
      `}
      title={buttonState.title}
    >
      <Shuffle
        className={`
          ${getIconSize()}
          transition-colors duration-200
          ${buttonState.text}
        `}
      />
      {showLabel && (
        <span className={`ml-2 text-sm font-medium ${
          isInComparison ? 'text-blue-600' : 
          isMaxReached ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {isInComparison ? 'Comparando' : 
           isMaxReached ? 'Máx. 3' : 'Comparar'}
        </span>
      )}
    </button>
  );
}

// Floating Compare Bar Component
export function CompareBar() {
  const [compareList, setCompareList] = useLocalStorage<string[]>('jc-compare', []);

  if (compareList.length === 0) {
    return null;
  }

  const removeFromComparison = (productId: string) => {
    setCompareList(compareList.filter(id => id !== productId));
  };

  const clearComparison = () => {
    setCompareList([]);
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 z-40 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Shuffle className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Comparar Produtos ({compareList.length}/3)
              </h3>
              <p className="text-sm text-gray-600">
                Adicione até 3 produtos para comparação
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open('/comparar', '_blank')}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Comparar Agora
            </button>
            <button
              onClick={clearComparison}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Limpar comparação"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mini product list */}
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {compareList.map((productId) => (
            <div key={productId} className="flex-shrink-0 relative">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500">#{productId.slice(-4)}</span>
              </div>
              <button
                onClick={() => removeFromComparison(productId)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}