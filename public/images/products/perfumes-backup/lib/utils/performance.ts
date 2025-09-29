// Performance monitoring and optimization utilities

export interface WebVitalsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

// Track Core Web Vitals
export function reportWebVitals(metric: WebVitalsMetric) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Send to analytics service
    gtag('event', metric.name, {
      custom_parameter_1: metric.value,
      custom_parameter_2: metric.rating,
      custom_parameter_3: metric.id
    })

    // Send to performance monitoring service
    fetch('/api/analytics/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      })
    }).catch(console.error)
  }
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window !== 'undefined') {
    // Preload critical fonts
    const fontLinks = [
      '/fonts/inter-var.woff2',
      '/fonts/playfair-display-var.woff2'
    ]

    fontLinks.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      link.href = href
      document.head.appendChild(link)
    })

    // Preconnect to external domains
    const domains = [
      'https://i.ibb.co',
      'https://res.cloudinary.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]

    domains.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = href
      if (href.includes('fonts')) {
        link.crossOrigin = 'anonymous'
      }
      document.head.appendChild(link)
    })
  }
}

// Optimize images with intersection observer
export function createImageObserver(callback: (entry: IntersectionObserverEntry) => void) {
  if (typeof window === 'undefined') return null

  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback)
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1
    }
  )
}

// Debounce function for performance
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Measure performance
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  const start = performance.now()
  
  try {
    const result = fn()
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start
        console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`)
        
        // Report to analytics in production
        if (process.env.NODE_ENV === 'production') {
          gtag('event', 'custom_timing', {
            name,
            value: Math.round(duration)
          })
        }
      })
    } else {
      const duration = performance.now() - start
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`)
      
      if (process.env.NODE_ENV === 'production') {
        gtag('event', 'custom_timing', {
          name,
          value: Math.round(duration)
        })
      }
      
      return result
    }
  } catch (error) {
    const duration = performance.now() - start
    console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error)
    throw error
  }
}

// Critical CSS inlining utility
export function inlineCriticalCSS() {
  if (typeof window !== 'undefined') {
    const criticalCSS = `
      /* Critical CSS for above-the-fold content */
      .loading-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      .fade-in {
        animation: fadeIn 0.5s ease-in-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `

    const style = document.createElement('style')
    style.textContent = criticalCSS
    document.head.appendChild(style)
  }
}

// Resource hints for next navigation
export function prefetchRoute(href: string) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      document.head.appendChild(link)
    })
  }
}

// Service Worker registration with update handling
export async function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show update available notification
              if (window.confirm('Nova versão disponível! Recarregar?')) {
                window.location.reload()
              }
            }
          })
        }
      })
      
      console.log('✅ Service Worker registered successfully')
      return registration
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error)
    }
  }
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory
    
    const memoryInfo = {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
    }
    
    console.log('🧠 Memory usage:', memoryInfo)
    
    // Alert if memory usage is high
    if (memoryInfo.used / memoryInfo.limit > 0.8) {
      console.warn('⚠️ High memory usage detected!')
    }
    
    return memoryInfo
  }
  
  return null
}

// FCP optimization
export function optimizeFCP() {
  // Remove unused CSS
  const unusedCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])')
  unusedCSS.forEach(link => {
    if (link instanceof HTMLLinkElement) {
      link.media = 'print'
      link.onload = () => { link.media = 'all' }
    }
  })
}