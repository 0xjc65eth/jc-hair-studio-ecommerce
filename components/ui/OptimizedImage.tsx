'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  quality?: number
  placeholder?: 'blur' | 'empty'
  sizes?: string
  onLoad?: () => void
}

// Base64 blur placeholder - imagem 1x1 pixel cinza
const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAhEQACAQIEBwAAAAAAAAAAAAABAgMABAUREiEiMUFRkf/aAAwDAQACEQMRAD8A0XGMHAxjB5554zg8DHKaM8fEwOJ2I6HvIw'

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  objectFit = 'cover',
  quality = 85,
  placeholder = 'blur',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onLoad
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  if (hasError) {
    // Fallback para placeholder se imagem falhar
    return (
      <Image
        src="/placeholder-product.jpg"
        alt={alt}
        width={width}
        height={height}
        className={`${objectFit === 'cover' ? 'object-cover' : `object-${objectFit}`} opacity-75 ${className}`}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onError={() => {
          // Se até o placeholder falhar, mostrar div cinza
          return (
            <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
              <div className="text-gray-400 text-sm">Imagem indisponível</div>
            </div>
          )
        }}
      />
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton loader */}
      {!isLoaded && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear'
          }}
        />
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={`${objectFit === 'cover' ? 'object-cover' : `object-${objectFit}`} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? blurDataURL : undefined}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: width ? 'auto' : '100%',
          height: height ? 'auto' : '100%',
        }}
      />

      {/* Fade-in animation */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {!isLoaded && (
          <div className="w-full h-full bg-gray-100 animate-pulse" />
        )}
      </motion.div>
    </div>
  )
}