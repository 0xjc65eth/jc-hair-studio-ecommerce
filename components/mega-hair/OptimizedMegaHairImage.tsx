'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Sparkles, Scissors } from 'lucide-react';

interface OptimizedMegaHairImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  productName?: string;
  productType?: 'liso' | 'ondulado' | 'cacheado' | 'crespo';
  showSkeleton?: boolean;
  lazy?: boolean;
}

export default function OptimizedMegaHairImage({
  src,
  alt,
  className = '',
  priority = false,
  fill = true,
  width,
  height,
  productName,
  productType = 'liso',
  showSkeleton = true,
  lazy = true
}: OptimizedMegaHairImageProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Sistema de fallback em cascata
  const fallbackSources = [
    src, // Fonte original
    `/images/mega-hair-real/placeholder-${productType}.jpg`, // Placeholder específico do tipo
    '/images/placeholder-product.jpg', // Placeholder genérico
    '/images/mega-hair/default-mega-hair.jpg' // Último recurso
  ];

  const [fallbackIndex, setFallbackIndex] = useState(0);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px' // Começar carregamento 50px antes de entrar na viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, isInView]);

  // Preload para imagens prioritárias
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [priority, src]);

  const handleImageError = () => {
    console.warn(`Falha ao carregar imagem: ${currentSrc}`);

    const nextIndex = fallbackIndex + 1;
    if (nextIndex < fallbackSources.length) {
      setFallbackIndex(nextIndex);
      setCurrentSrc(fallbackSources[nextIndex]);
      setImageState('loading');
    } else {
      setImageState('error');
    }
  };

  const handleImageLoad = () => {
    setImageState('loaded');
  };

  // Skeleton loading component
  const SkeletonLoader = () => (
    <div className={`animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 ${className}`}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Scissors className="w-8 h-8 mx-auto mb-2 animate-pulse" />
          <div className="w-20 h-3 bg-gray-300 rounded mx-auto mb-1"></div>
          <div className="w-16 h-2 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );

  // Error fallback component
  const ErrorFallback = () => (
    <div className={`bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center ${className}`}>
      <div className="text-center text-rose-400">
        <Sparkles className="w-12 h-12 mx-auto mb-3" />
        <p className="text-sm font-medium text-rose-600">Imagem indisponível</p>
        {productName && (
          <p className="text-xs text-rose-500 mt-1 px-2">{productName}</p>
        )}
        <div className="mt-2 text-xs text-rose-400">
          Mega Hair {productType.charAt(0).toUpperCase() + productType.slice(1)}
        </div>
      </div>
    </div>
  );

  // Não renderizar imagem se não estiver na viewport (lazy loading)
  if (!isInView) {
    return (
      <div ref={imgRef} className={className}>
        {showSkeleton && <SkeletonLoader />}
      </div>
    );
  }

  // Mostrar erro se todas as opções de fallback falharam
  if (imageState === 'error') {
    return <ErrorFallback />;
  }

  // Mostrar skeleton enquanto carrega
  if (imageState === 'loading' && showSkeleton) {
    return (
      <div ref={imgRef} className={`relative ${className}`}>
        <SkeletonLoader />
        {isInView && (
          <Image
            src={currentSrc}
            alt={alt}
            fill={fill}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            className="absolute inset-0 object-cover opacity-0"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={handleImageLoad}
            onError={handleImageError}
            quality={85}
          />
        )}
      </div>
    );
  }

  // Renderizar imagem normal quando carregada
  return (
    <div ref={imgRef} className={`relative ${className}`}>
      <Image
        src={currentSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`object-cover transition-opacity duration-300 ${
          imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={handleImageLoad}
        onError={handleImageError}
        quality={85}
      />

      {/* Badge de qualidade da imagem */}
      {imageState === 'loaded' && fallbackIndex === 0 && (
        <div className="absolute top-2 right-2 bg-green-500/20 text-green-700 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          Original
        </div>
      )}

      {fallbackIndex > 0 && imageState === 'loaded' && (
        <div className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-700 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          Backup
        </div>
      )}
    </div>
  );
}

// Hook personalizado para preload de imagens
export function useMegaHairImagePreload(images: string[], threshold = 3) {
  useEffect(() => {
    // Preload apenas as primeiras imagens críticas
    const imagesToPreload = images.slice(0, threshold);

    imagesToPreload.forEach(src => {
      if (src) {
        const img = new window.Image();
        img.src = src;
      }
    });
  }, [images, threshold]);
}

// Componente para placeholder específico por tipo de cabelo
export function HairTypePlaceholder({
  type,
  className = ''
}: {
  type: 'liso' | 'ondulado' | 'cacheado' | 'crespo';
  className?: string;
}) {
  const typeConfig = {
    liso: { color: 'from-blue-100 to-blue-200', icon: '━', name: 'Liso' },
    ondulado: { color: 'from-green-100 to-green-200', icon: '∼', name: 'Ondulado' },
    cacheado: { color: 'from-purple-100 to-purple-200', icon: '◯', name: 'Cacheado' },
    crespo: { color: 'from-orange-100 to-orange-200', icon: '※', name: 'Crespo' }
  };

  const config = typeConfig[type];

  return (
    <div className={`bg-gradient-to-br ${config.color} flex items-center justify-center ${className}`}>
      <div className="text-center text-gray-600">
        <div className="text-3xl mb-2">{config.icon}</div>
        <p className="text-sm font-medium">Mega Hair {config.name}</p>
        <p className="text-xs opacity-75">Carregando...</p>
      </div>
    </div>
  );
}