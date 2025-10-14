'use client';

/**
 * PERFORMANCE MONITORING DASHBOARD
 * =================================
 *
 * Real-time performance monitoring with:
 * 1. Core Web Vitals tracking
 * 2. Bundle size analysis
 * 3. Network performance metrics
 * 4. Resource loading times
 * 5. Memory usage tracking
 * 6. Render performance
 *
 * Features:
 * - Visual dashboard for development
 * - Automatic reporting to analytics
 * - Performance degradation alerts
 * - Optimization recommendations
 */

import { useEffect, useState } from 'react';
import CoreWebVitals, { useWebVitals } from './CoreWebVitals';

interface PerformanceMetrics {
  // Navigation timing
  dns?: number;
  tcp?: number;
  ttfb?: number;
  download?: number;
  domParse?: number;
  domReady?: number;
  pageLoad?: number;

  // Resource timing
  totalResources?: number;
  totalSize?: number;
  jsSize?: number;
  cssSize?: number;
  imageSize?: number;
  fontSize?: number;

  // Memory (if available)
  jsHeapSize?: number;
  jsHeapLimit?: number;

  // Connection info
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(false);
  const webVitals = useWebVitals();

  useEffect(() => {
    // Only show in development or when explicitly enabled
    const shouldShow =
      process.env.NODE_ENV === 'development' ||
      process.env.NEXT_PUBLIC_SHOW_PERFORMANCE_MONITOR === 'true';

    if (!shouldShow) return;

    collectMetrics();

    // Update metrics every 5 seconds
    const interval = setInterval(collectMetrics, 5000);

    // Keyboard shortcut to toggle visibility (Ctrl+Shift+P)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const collectMetrics = () => {
    if (typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    // Navigation timing
    if (navigation) {
      setMetrics((prev) => ({
        ...prev,
        dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
        tcp: Math.round(navigation.connectEnd - navigation.connectStart),
        ttfb: Math.round(navigation.responseStart - navigation.requestStart),
        download: Math.round(navigation.responseEnd - navigation.responseStart),
        domParse: Math.round(navigation.domInteractive - navigation.responseEnd),
        domReady: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
        pageLoad: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
      }));
    }

    // Resource timing
    if (resources.length > 0) {
      let totalSize = 0;
      let jsSize = 0;
      let cssSize = 0;
      let imageSize = 0;
      let fontSize = 0;

      resources.forEach((resource) => {
        const size = resource.encodedBodySize || resource.transferSize || 0;
        totalSize += size;

        if (resource.name.match(/\.js$/)) jsSize += size;
        else if (resource.name.match(/\.css$/)) cssSize += size;
        else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/)) imageSize += size;
        else if (resource.name.match(/\.(woff|woff2|ttf|otf)$/)) fontSize += size;
      });

      setMetrics((prev) => ({
        ...prev,
        totalResources: resources.length,
        totalSize: Math.round(totalSize / 1024), // KB
        jsSize: Math.round(jsSize / 1024),
        cssSize: Math.round(cssSize / 1024),
        imageSize: Math.round(imageSize / 1024),
        fontSize: Math.round(fontSize / 1024),
      }));
    }

    // Memory usage (Chrome only)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics((prev) => ({
        ...prev,
        jsHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
        jsHeapLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
      }));
    }

    // Network information
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setMetrics((prev) => ({
        ...prev,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      }));
    }
  };

  // Don't render in production unless explicitly enabled
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PUBLIC_SHOW_PERFORMANCE_MONITOR !== 'true'
  ) {
    return <CoreWebVitals />;
  }

  if (!isVisible) {
    return (
      <>
        <CoreWebVitals />
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 left-4 z-50 bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-mono hover:bg-black transition-colors"
          title="Show Performance Monitor (Ctrl+Shift+P)"
        >
          PERF
        </button>
      </>
    );
  }

  return (
    <>
      <CoreWebVitals />
      <div className="fixed bottom-4 left-4 z-50 bg-black/95 text-white p-4 rounded-lg shadow-2xl max-w-md font-mono text-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">Performance Monitor</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Navigation Timing */}
        <div className="mb-4">
          <h4 className="text-yellow-400 font-bold mb-2">Navigation Timing</h4>
          <div className="space-y-1">
            <MetricLine label="DNS" value={metrics.dns} unit="ms" />
            <MetricLine label="TCP" value={metrics.tcp} unit="ms" />
            <MetricLine label="TTFB" value={metrics.ttfb} unit="ms" threshold={600} />
            <MetricLine label="Download" value={metrics.download} unit="ms" />
            <MetricLine label="DOM Parse" value={metrics.domParse} unit="ms" />
            <MetricLine label="DOM Ready" value={metrics.domReady} unit="ms" />
            <MetricLine label="Page Load" value={metrics.pageLoad} unit="ms" threshold={3000} />
          </div>
        </div>

        {/* Resource Timing */}
        <div className="mb-4">
          <h4 className="text-green-400 font-bold mb-2">Resource Timing</h4>
          <div className="space-y-1">
            <MetricLine label="Total Resources" value={metrics.totalResources} unit="" />
            <MetricLine label="Total Size" value={metrics.totalSize} unit="KB" threshold={3000} />
            <MetricLine label="JavaScript" value={metrics.jsSize} unit="KB" threshold={500} />
            <MetricLine label="CSS" value={metrics.cssSize} unit="KB" threshold={100} />
            <MetricLine label="Images" value={metrics.imageSize} unit="KB" threshold={2000} />
            <MetricLine label="Fonts" value={metrics.fontSize} unit="KB" threshold={200} />
          </div>
        </div>

        {/* Memory Usage */}
        {metrics.jsHeapSize && (
          <div className="mb-4">
            <h4 className="text-blue-400 font-bold mb-2">Memory Usage</h4>
            <div className="space-y-1">
              <MetricLine label="JS Heap" value={metrics.jsHeapSize} unit="MB" threshold={50} />
              <MetricLine label="Heap Limit" value={metrics.jsHeapLimit} unit="MB" />
            </div>
          </div>
        )}

        {/* Network Info */}
        {metrics.effectiveType && (
          <div>
            <h4 className="text-purple-400 font-bold mb-2">Network Info</h4>
            <div className="space-y-1">
              <MetricLine label="Type" value={metrics.effectiveType} unit="" />
              <MetricLine label="Downlink" value={metrics.downlink} unit="Mbps" />
              <MetricLine label="RTT" value={metrics.rtt} unit="ms" threshold={100} />
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
          <p>Press Ctrl+Shift+P to toggle</p>
        </div>
      </div>
    </>
  );
}

function MetricLine({
  label,
  value,
  unit,
  threshold,
}: {
  label: string;
  value?: number | string;
  unit: string;
  threshold?: number;
}) {
  const isWarning = threshold && typeof value === 'number' && value > threshold;

  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400">{label}:</span>
      <span className={`font-bold ${isWarning ? 'text-red-400' : 'text-white'}`}>
        {value !== undefined ? `${value}${unit}` : '-'}
        {isWarning && ' ⚠️'}
      </span>
    </div>
  );
}

/**
 * Export performance data as JSON
 */
export function exportPerformanceData() {
  if (typeof window === 'undefined') return null;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  return {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    navigation: {
      dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
      tcp: Math.round(navigation.connectEnd - navigation.connectStart),
      ttfb: Math.round(navigation.responseStart - navigation.requestStart),
      download: Math.round(navigation.responseEnd - navigation.responseStart),
      domParse: Math.round(navigation.domInteractive - navigation.responseEnd),
      domReady: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
      pageLoad: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
    },
    resources: {
      count: resources.length,
      sizes: resources.map((r) => ({
        url: r.name,
        size: r.encodedBodySize || r.transferSize,
        duration: r.duration,
      })),
    },
  };
}
