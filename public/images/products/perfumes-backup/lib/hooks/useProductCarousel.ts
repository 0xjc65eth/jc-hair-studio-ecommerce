import { useState, useEffect } from 'react'
import carouselMapping from '../../hidratacao-carousel-mapping.json'

interface CarouselProduct {
  productId: string
  productName: string
  mainImage: string
  carouselImages: string[]
  imageCount: number
  description: string
}

interface CarouselData {
  carouselMapping: Record<string, CarouselProduct>
  carouselSettings: {
    autoplay: boolean
    autoplayDelay: number
    showDots: boolean
    showArrows: boolean
    infinite: boolean
    pauseOnHover: boolean
    slidesToShow: number
    slidesToScroll: number
    responsive: Array<{
      breakpoint: number
      settings: {
        showArrows?: boolean
        showDots?: boolean
      }
    }>
  }
  totalProducts: number
  totalImages: number
  duplicatesRemoved: number
  carouselReady: boolean
}

export function useProductCarousel(productId?: string) {
  const [carouselData, setCarouselData] = useState<CarouselData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setCarouselData(carouselMapping as CarouselData)
      setLoading(false)
    } catch (err) {
      setError('Erro ao carregar dados do carrossel')
      setLoading(false)
    }
  }, [])

  const getProductImages = (productId: string): string[] => {
    if (!carouselData?.carouselMapping[productId]) {
      return []
    }
    return carouselData.carouselMapping[productId].carouselImages
  }

  const getProductMainImage = (productId: string): string => {
    if (!carouselData?.carouselMapping[productId]) {
      return '/placeholder-product.jpg'
    }
    return carouselData.carouselMapping[productId].mainImage
  }

  const getProductCarouselData = (productId: string): CarouselProduct | null => {
    if (!carouselData?.carouselMapping[productId]) {
      return null
    }
    return carouselData.carouselMapping[productId]
  }

  const getAllProducts = (): CarouselProduct[] => {
    if (!carouselData) return []
    return Object.values(carouselData.carouselMapping)
  }

  const getCarouselSettings = () => {
    return carouselData?.carouselSettings || {
      autoplay: true,
      autoplayDelay: 3000,
      showDots: true,
      showArrows: true,
      infinite: true,
      pauseOnHover: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: []
    }
  }

  return {
    carouselData,
    loading,
    error,
    getProductImages,
    getProductMainImage,
    getProductCarouselData,
    getAllProducts,
    getCarouselSettings
  }
}

// Utility functions for carousel management
export function formatProductId(productName: string): string {
  return productName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export function validateCarouselImages(images: string[]): boolean {
  return images.length > 0 && images.every(img => img.startsWith('/images/'))
}

export function optimizeImageLoading(images: string[], currentIndex: number = 0) {
  return {
    priority: images[currentIndex], // Current image gets priority
    preload: images.slice(0, 3), // Preload first 3 images
    lazy: images.slice(3) // Lazy load the rest
  }
}