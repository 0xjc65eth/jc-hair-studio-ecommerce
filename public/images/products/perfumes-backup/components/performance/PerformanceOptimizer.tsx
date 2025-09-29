'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  loadTime: number;
  domReady: number;
}

export default function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  const router = useRouter();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Performance monitoring and optimization
    const initializePerformanceOptimizations = () => {
      // 1. Preload critical resources
      preloadCriticalResources();

      // 2. Optimize images with WebP and AVIF
      optimizeImages();

      // 3. Enable service worker for caching
      registerServiceWorker();

      // 4. Prefetch next pages based on user behavior
      enableIntelligentPrefetching();

      // 5. Monitor performance metrics
      measureCoreWebVitals();

      // 6. Optimize third-party scripts
      optimizeThirdPartyScripts();

      setIsLoading(false);
    };

    // Run optimizations after DOM is ready
    if (document.readyState === 'complete') {
      initializePerformanceOptimizations();
    } else {
      window.addEventListener('load', initializePerformanceOptimizations);
      return () => window.removeEventListener('load', initializePerformanceOptimizations);
    }
  }, []);

  const preloadCriticalResources = () => {
    const currentPath = window.location.pathname;

    // Always preload fonts as they're used across all pages
    const criticalResources = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;500;600&display=swap'
    ];

    // Only preload logo on pages that actually display it (most pages)
    if (currentPath === '/' || currentPath.includes('/produtos') || currentPath.includes('/sobre')) {
      criticalResources.push('/logo-icon.svg');
    }

    // Only preload popular products API on homepage and product pages
    if (currentPath === '/' || currentPath.includes('/produtos') || currentPath.includes('/categoria')) {
      criticalResources.push('/api/products/popular');
    }

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      if (resource.includes('/api/')) {
        link.rel = 'prefetch';
      } else if (resource.includes('fonts.googleapis')) {
        link.rel = 'preconnect';
        link.crossOrigin = 'anonymous';
      } else {
        link.rel = 'preload';
        if (resource.includes('.jpg') || resource.includes('.webp') || resource.includes('.png')) {
          link.as = 'image';
        } else if (resource.includes('.svg')) {
          link.as = 'image';
        } else if (resource.includes('.css')) {
          link.as = 'style';
        } else if (resource.includes('.js')) {
          link.as = 'script';
        }
      }
      link.href = resource;
      document.head.appendChild(link);
    });
  };

  const optimizeImages = () => {
    // Convert images to WebP format on-the-fly
    const images = document.querySelectorAll('img[src]');
    images.forEach((img: Element) => {
      const image = img as HTMLImageElement;
      const originalSrc = image.src;

      // Check if browser supports WebP
      const supportsWebP = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      };

      if (supportsWebP() && !originalSrc.includes('.webp')) {
        // Try to load WebP version
        const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        const testImg = new Image();
        testImg.onload = () => {
          image.src = webpSrc;
        };
        testImg.src = webpSrc;
      }

      // Lazy loading for images below the fold
      if ('loading' in HTMLImageElement.prototype) {
        image.loading = 'lazy';
      } else {
        // Fallback for browsers that don't support native lazy loading
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.src = img.dataset.src || img.src;
              imageObserver.unobserve(img);
            }
          });
        });
        imageObserver.observe(image);
      }
    });
  };

  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  };

  const enableIntelligentPrefetching = () => {
    // Track user interactions to predict next pages
    const linkElements = document.querySelectorAll('a[href^="/"]');
    const prefetchedUrls = new Set<string>();

    const prefetchUrl = (url: string) => {
      if (!prefetchedUrls.has(url)) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
        prefetchedUrls.add(url);
      }
    };

    // Prefetch on hover (desktop) or touch start (mobile)
    linkElements.forEach(link => {
      const href = (link as HTMLAnchorElement).href;

      link.addEventListener('mouseenter', () => {
        setTimeout(() => prefetchUrl(href), 200); // Small delay to avoid prefetching accidental hovers
      }, { passive: true });

      link.addEventListener('touchstart', () => {
        prefetchUrl(href);
      }, { passive: true });
    });

    // Prefetch popular pages after 3 seconds
    setTimeout(() => {
      const popularPages = ['/produtos', '/mega-hair', '/cosmeticos', '/maquiagens'];
      popularPages.forEach(page => {
        if (!prefetchedUrls.has(page)) {
          prefetchUrl(page);
        }
      });
    }, 3000);
  };

  const measureCoreWebVitals = () => {
    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');

        const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint');
        const metrics: PerformanceMetrics = {
          fcp: fcpEntry ? fcpEntry.startTime : 0,
          lcp: 0, // Will be measured by Web Vitals library
          fid: 0, // Will be measured by Web Vitals library
          cls: 0, // Will be measured by Web Vitals library
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domReady: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
        };

        setMetrics(metrics);

        // Send metrics to analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'performance_metrics', {
            event_category: 'Performance',
            custom_map: {
              metric_1: 'first_contentful_paint',
              metric_2: 'load_time',
              metric_3: 'dom_ready'
            },
            metric_1: Math.round(metrics.fcp),
            metric_2: Math.round(metrics.loadTime),
            metric_3: Math.round(metrics.domReady)
          });
        }
      }
    };

    // Measure after page is fully loaded
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }
  };

  const optimizeThirdPartyScripts = () => {
    // Delay non-critical third-party scripts
    const delayScripts = () => {
      // Delay Google Analytics until user interaction
      let gaLoaded = false;
      const loadGA = () => {
        if (!gaLoaded && process.env.NEXT_PUBLIC_GA_ID) {
          const script = document.createElement('script');
          script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
          script.async = true;
          document.head.appendChild(script);
          gaLoaded = true;
        }
      };

      // Load on first user interaction
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      const loadOnInteraction = () => {
        loadGA();
        events.forEach(event => {
          document.removeEventListener(event, loadOnInteraction);
        });
      };

      events.forEach(event => {
        document.addEventListener(event, loadOnInteraction, { passive: true });
      });

      // Fallback: load after 10 seconds
      setTimeout(loadGA, 10000);
    };

    // Run after page load
    setTimeout(delayScripts, 1000);
  };

  // Resource hints for better performance
  useEffect(() => {
    // DNS prefetch for external domains
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ];

    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }, []);

  // Critical CSS inlining for above-the-fold content
  useEffect(() => {
    const criticalCSS = `
      .hero-section { min-height: 60vh; }
      .container-custom { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
      .btn-primary { background: linear-gradient(45deg, #d97706, #f59e0b); }
      .loading-spinner { animation: spin 1s linear infinite; }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `;

    const style = document.createElement('style');
    style.innerHTML = criticalCSS;
    document.head.appendChild(style);
  }, []);

  // Performance-aware component rendering
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {children}

      {/* Performance metrics display (development only) */}
      {process.env.NODE_ENV === 'development' && metrics && (
        <div className="fixed bottom-4 left-4 bg-black text-white p-3 rounded text-xs font-mono z-50">
          <div>FCP: {Math.round(metrics.fcp)}ms</div>
          <div>Load: {Math.round(metrics.loadTime)}ms</div>
          <div>DOM: {Math.round(metrics.domReady)}ms</div>
        </div>
      )}
    </>
  );
}