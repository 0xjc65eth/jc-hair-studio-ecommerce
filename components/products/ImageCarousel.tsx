'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { handleImageError } from '../../lib/utils/imageUtils';

interface ImageCarouselProps {
  images: string[];
  productName: string;
  className?: string;
}

export default function ImageCarousel({ images, productName, className = '' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-sm">Sem imagem</p>
        </div>
      </div>
    );
  }

  // Se só tem uma imagem, não mostrar controles
  if (images.length === 1) {
    return (
      <div className={`relative ${className}`}>
        {!imageErrors[images[0]] ? (
          <Image
            src={images[0]}
            alt={productName}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = handleImageError(0);
              setImageErrors(prev => ({ ...prev, [images[0]]: true }));
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-sm">{productName}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Imagem principal */}
      <div className="relative w-full h-full overflow-hidden">
        {!imageErrors[images[currentIndex]] ? (
          <Image
            src={images[currentIndex]}
            alt={`${productName} - Imagem ${currentIndex + 1}`}
            fill
            className="object-cover transition-opacity duration-300"
            onError={() => setImageErrors(prev => ({ ...prev, [images[currentIndex]]: true }))}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-sm">{productName}</p>
            </div>
          </div>
        )}
      </div>

      {/* Botões de navegação */}
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70 z-10"
        aria-label="Imagem anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70 z-10"
        aria-label="Próxima imagem"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => goToSlide(index, e)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === currentIndex 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir para imagem ${index + 1}`}
          />
        ))}
      </div>

      {/* Contador de imagens */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {currentIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
}