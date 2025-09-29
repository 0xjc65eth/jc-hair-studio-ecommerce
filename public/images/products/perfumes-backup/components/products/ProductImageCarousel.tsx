'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface ProductImage {
  url: string;
  alt: string;
  title?: string;
  isMain?: boolean;
}

interface ProductImageCarouselProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

export default function ProductImageCarousel({ images, productName, className = '' }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <Sparkles className="w-16 h-16 mx-auto mb-4" />
          <p className="text-sm font-medium">Imagem não disponível</p>
          <p className="text-xs text-gray-500 mt-1">{productName}</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageError = (url: string) => {
    setImageErrors(prev => ({ ...prev, [url]: true }));
  };

  if (images.length === 1) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {imageErrors[currentImage.url] ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Sparkles className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Imagem indisponível</p>
            </div>
          </div>
        ) : (
          <Image
            src={currentImage.url}
            alt={currentImage.alt || `${productName} - Imagem principal`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            onError={() => handleImageError(currentImage.url)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {/* Main Image */}
      <div className="relative w-full h-full">
        {imageErrors[currentImage.url] ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Sparkles className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Imagem indisponível</p>
            </div>
          </div>
        ) : (
          <Image
            src={currentImage.url}
            alt={currentImage.alt || `${productName} - Imagem ${currentIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={currentIndex === 0}
            onError={() => handleImageError(currentImage.url)}
          />
        )}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Imagem anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Próxima imagem"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-white'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ver imagem ${index + 1}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}