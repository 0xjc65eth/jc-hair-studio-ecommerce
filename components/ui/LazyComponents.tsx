'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

// Loading components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
  </div>
)

const ProductModalSkeleton = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="flex space-x-4">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
    </div>
  </div>
)

const FilterSidebarSkeleton = () => (
  <div className="w-full p-4 space-y-4">
    <div className="animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2 mb-6">
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const CartDrawerSkeleton = () => (
  <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50">
    <div className="p-4 space-y-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-16 w-16 bg-gray-200 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Lazy loaded components with dynamic imports
export const LazyProductModal = dynamic(
  () => import('./ProductModal').then(mod => ({ default: mod.ProductModal })),
  {
    loading: ProductModalSkeleton,
    ssr: false
  }
)

export const LazyFilterSidebar = dynamic(
  () => import('./FilterSidebar').then(mod => ({ default: mod.FilterSidebar })),
  {
    loading: FilterSidebarSkeleton,
    ssr: false
  }
)

export const LazyCartDrawer = dynamic(
  () => import('../shared/CartDrawer').then(mod => ({ default: mod.CartDrawer })),
  {
    loading: CartDrawerSkeleton,
    ssr: false
  }
)

export const LazyCheckoutForm = dynamic(
  () => import('../checkout/CheckoutForm'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

export const LazyProductGallery = dynamic(
  () => import('./ProductGallery'),
  {
    loading: () => (
      <div className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
    ),
    ssr: false
  }
)

export const LazyReviewsSection = dynamic(
  () => import('../product/ReviewsSection'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

export const LazyWishlistButton = dynamic(
  () => import('../catalogo/WishlistButton'),
  {
    loading: () => <div className="h-10 w-10 bg-gray-200 animate-pulse rounded"></div>,
    ssr: false
  }
)

export const LazyCompareButton = dynamic(
  () => import('../catalogo/CompareButton'),
  {
    loading: () => <div className="h-10 w-10 bg-gray-200 animate-pulse rounded"></div>,
    ssr: false
  }
)


// HOC for lazy loading with intersection observer
export function withLazyLoading<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ComponentType
) {
  return function LazyLoadedComponent(props: T) {
    return (
      <Suspense fallback={fallback ? <fallback /> : <LoadingSpinner />}>
        <Component {...props} />
      </Suspense>
    )
  }
}