'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  // SEO specific props
  product?: string;
  category?: string;
  brand?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Componente Image otimizado para SEO com:
 * - Alt text descritivo e contextual
 * - Lazy loading inteligente
 * - Placeholder para melhor UX
 * - Estrutura SEO-friendly
 * - Fallback para images quebradas
 */
export default function OptimizedImage({
  src,
  alt,
  title,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  product,
  category,
  brand,
  loading = 'lazy',
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Gerar alt text mais descritivo para SEO
  const optimizedAlt = generateOptimizedAltText(alt, { product, category, brand });

  // Gerar title se não fornecido
  const optimizedTitle = title || generateOptimizedTitle(alt, { product, category, brand });

  // Fallback image para produtos brasileiros
  const fallbackImage = '/images/placeholder-product-brasileiro.jpg';

  // Configurações responsivas padrão
  const defaultSizes = sizes || `
    (max-width: 768px) 100vw,
    (max-width: 1200px) 50vw,
    33vw
  `;

  if (imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="text-2xl mb-2">🖼️</div>
          <p className="text-gray-500 text-sm">Imagem não disponível</p>
          <p className="text-gray-400 text-xs">{optimizedAlt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">
              <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      <Image
        src={src}
        alt={optimizedAlt}
        title={optimizedTitle}
        width={width}
        height={height}
        fill={fill}
        sizes={fill ? defaultSizes : undefined}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        loading={loading}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          console.error('Image failed to load:', src);
          setImageError(true);
        }}
        {...props}
      />

      {/* Schema markup para imagens de produtos */}
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ImageObject',
              url: src.startsWith('http') ? src : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz'}${src}`,
              name: optimizedTitle,
              description: optimizedAlt,
              contentUrl: src.startsWith('http') ? src : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz'}${src}`,
              creator: {
                '@type': 'Organization',
                name: "JC Hair Studio's 62"
              },
              creditText: "JC Hair Studio's 62",
              copyrightNotice: "© JC Hair Studio's 62"
            })
          }}
        />
      )}
    </div>
  );
}

// Função para gerar alt text otimizado para SEO
function generateOptimizedAltText(
  baseAlt: string,
  context: { product?: string; category?: string; brand?: string }
): string {
  const { product, category, brand } = context;

  let optimizedAlt = baseAlt;

  // Adicionar contexto brasileiro se não estiver presente
  if (!baseAlt.toLowerCase().includes('brasil')) {
    optimizedAlt = `${baseAlt} Brasileiro Premium`;
  }

  // Adicionar categoria se fornecida
  if (category && !baseAlt.toLowerCase().includes(category.toLowerCase())) {
    optimizedAlt = `${category} ${optimizedAlt}`;
  }

  // Adicionar marca se fornecida
  if (brand && !baseAlt.toLowerCase().includes(brand.toLowerCase())) {
    optimizedAlt = `${brand} ${optimizedAlt}`;
  }

  // Adicionar contexto de qualidade se for produto
  if (product) {
    optimizedAlt += ' - JC Hair Studio\'s 62';
  }

  return optimizedAlt.trim();
}

// Função para gerar title otimizado
function generateOptimizedTitle(
  baseAlt: string,
  context: { product?: string; category?: string; brand?: string }
): string {
  const { product, category } = context;

  if (product) {
    return `${baseAlt} - Produto Brasileiro Premium | JC Hair Studio's 62`;
  }

  if (category) {
    return `${baseAlt} - ${category} Brasileiro Premium`;
  }

  return baseAlt;
}

// Componente específico para produtos brasileiros
export function ProductImage({
  src,
  productName,
  category,
  brand,
  price,
  className,
  ...props
}: OptimizedImageProps & {
  productName: string;
  price?: number;
}) {
  const optimizedAlt = `${productName} ${brand ? `- ${brand}` : ''} - ${category || 'Produto'} Brasileiro Premium${price ? ` - €${price}` : ''}`;

  return (
    <OptimizedImage
      src={src}
      alt={optimizedAlt}
      title={`${productName} | Produto Brasileiro Premium | JC Hair Studio's 62`}
      product={productName}
      category={category}
      brand={brand}
      className={className}
      quality={90}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      {...props}
    />
  );
}

// Componente para hero images com foco em performance
export function HeroImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={`${alt} - Produtos Capilares Brasileiros Premium | JC Hair Studio's 62`}
      title={`${alt} | Tradição Brasileira em Produtos Capilares`}
      className={className}
      priority={true}
      quality={95}
      loading="eager"
      sizes="100vw"
      {...props}
    />
  );
}