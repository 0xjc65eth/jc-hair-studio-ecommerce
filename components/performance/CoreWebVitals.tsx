'use client';

/**
 * CORE WEB VITALS MONITORING & OPTIMIZATION
 * ==========================================
 *
 * This component monitors and optimizes:
 * 1. LCP (Largest Contentful Paint) - Target: < 2.5s
 * 2. FID (First Input Delay) - Target: < 100ms
 * 3. CLS (Cumulative Layout Shift) - Target: < 0.1
 * 4. FCP (First Contentful Paint) - Target: < 1.8s
 * 5. TTFB (Time to First Byte) - Target: < 600ms
 *
 * Features:
 * - Real-time monitoring
 * - Automatic reporting to analytics
 * - Performance hints and warnings
 * - Optimization recommendations
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

interface VitalsReport {
  lcp?: WebVitalsMetric;
  fid?: WebVitalsMetric;
  cls?: WebVitalsMetric;
  fcp?: WebVitalsMetric;
  ttfb?: WebVitalsMetric;
  inp?: WebVitalsMetric; // Interaction to Next Paint
}

/**
 * Core Web Vitals Monitor Component
 */
export default function CoreWebVitals() {
  const pathname = usePathname();
  const [vitals, setVitals] = useState<VitalsReport>({});
  const [isMonitoring, setIsMonitoring] = useState(false);
  const reportedMetrics = useRef(new Set<string>());

  useEffect(() => {
    // Only monitor in production or when explicitly enabled
    const shouldMonitor =
      process.env.NODE_ENV === 'production' ||
      process.env.NEXT_PUBLIC_MONITOR_WEB_VITALS === 'true';

    if (!shouldMonitor) return;

    setIsMonitoring(true);

    // Import web-vitals library dynamically
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      // Monitor CLS
      onCLS((metric) => {
        handleMetric(metric as any);
      });

      // Monitor FID
      onFID((metric) => {
        handleMetric(metric as any);
      });

      // Monitor FCP
      onFCP((metric) => {
        handleMetric(metric as any);
      });

      // Monitor LCP
      onLCP((metric) => {
        handleMetric(metric as any);
      });

      // Monitor TTFB
      onTTFB((metric) => {
        handleMetric(metric as any);
      });

      // Monitor INP (new metric replacing FID)
      onINP?.((metric) => {
        handleMetric(metric as any);
      });
    }).catch((error) => {
      console.error('Failed to load web-vitals:', error);
    });
  }, [pathname]);

  /**
   * Handle metric reporting
   */
  const handleMetric = (metric: WebVitalsMetric) => {
    // Prevent duplicate reports
    const metricKey = `${metric.name}-${metric.id}`;
    if (reportedMetrics.current.has(metricKey)) return;
    reportedMetrics.current.add(metricKey);

    // Update state
    setVitals((prev) => ({
      ...prev,
      [metric.name.toLowerCase()]: metric,
    }));

    // Send to analytics
    sendToAnalytics(metric);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Web Vital:', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        path: pathname,
      });
    }
  };

  /**
   * Send metrics to analytics
   */
  const sendToAnalytics = (metric: WebVitalsMetric) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        metric_rating: metric.rating,
        metric_value: metric.value,
        metric_delta: metric.delta,
        page_path: pathname,
        non_interaction: true,
      });
    }

    // Custom analytics endpoint
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          path: pathname,
          timestamp: Date.now(),
        }),
        keepalive: true,
      }).catch((error) => {
        console.error('Failed to send metric:', error);
      });
    }
  };

  // Don't render anything in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // Development dashboard
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white p-4 rounded-lg shadow-2xl max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">Core Web Vitals</h3>
        <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-500'}`} />
      </div>

      <div className="space-y-2 text-xs">
        {/* LCP */}
        <MetricRow
          name="LCP"
          value={vitals.lcp?.value}
          rating={vitals.lcp?.rating}
          threshold={{ good: 2500, poor: 4000 }}
          unit="ms"
        />

        {/* FID */}
        <MetricRow
          name="FID"
          value={vitals.fid?.value}
          rating={vitals.fid?.rating}
          threshold={{ good: 100, poor: 300 }}
          unit="ms"
        />

        {/* INP */}
        <MetricRow
          name="INP"
          value={vitals.inp?.value}
          rating={vitals.inp?.rating}
          threshold={{ good: 200, poor: 500 }}
          unit="ms"
        />

        {/* CLS */}
        <MetricRow
          name="CLS"
          value={vitals.cls?.value}
          rating={vitals.cls?.rating}
          threshold={{ good: 0.1, poor: 0.25 }}
          unit=""
        />

        {/* FCP */}
        <MetricRow
          name="FCP"
          value={vitals.fcp?.value}
          rating={vitals.fcp?.rating}
          threshold={{ good: 1800, poor: 3000 }}
          unit="ms"
        />

        {/* TTFB */}
        <MetricRow
          name="TTFB"
          value={vitals.ttfb?.value}
          rating={vitals.ttfb?.rating}
          threshold={{ good: 600, poor: 1800 }}
          unit="ms"
        />
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400">
        <p>Page: {pathname}</p>
      </div>
    </div>
  );
}

/**
 * Metric row component
 */
function MetricRow({
  name,
  value,
  rating,
  threshold,
  unit,
}: {
  name: string;
  value?: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; poor: number };
  unit: string;
}) {
  const getRatingColor = () => {
    if (!rating) return 'text-gray-500';
    if (rating === 'good') return 'text-green-500';
    if (rating === 'needs-improvement') return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatValue = (val?: number) => {
    if (val === undefined) return '-';
    if (name === 'CLS') return val.toFixed(3);
    return Math.round(val) + unit;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-mono font-bold">{name}</span>
        <span className="text-gray-500 text-xs">
          (target: {threshold.good}{unit})
        </span>
      </div>
      <span className={`font-mono font-bold ${getRatingColor()}`}>
        {formatValue(value)}
      </span>
    </div>
  );
}

/**
 * Performance monitoring hook
 */
export function useWebVitals() {
  const [metrics, setMetrics] = useState<VitalsReport>({});

  useEffect(() => {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      const handler = (metric: any) => {
        setMetrics((prev) => ({
          ...prev,
          [metric.name.toLowerCase()]: metric,
        }));
      };

      onCLS(handler);
      onFID(handler);
      onFCP(handler);
      onLCP(handler);
      onTTFB(handler);
    });
  }, []);

  return metrics;
}

/**
 * Report Web Vitals to external service
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    // Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Vercel Analytics
    if ((window as any).va) {
      (window as any).va('event', {
        name: metric.name,
        data: {
          value: metric.value,
          rating: metric.rating,
        },
      });
    }
  }
}
