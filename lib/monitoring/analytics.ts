/**
 * Sistema de Analytics e Monitoramento - JC Hair Studio's 62
 * Centraliza coleta de métricas, eventos e monitoramento de performance
 */

import { env } from '@/lib/env';
import logger from '@/lib/logger';

// Tipos para eventos de analytics
export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  entries?: PerformanceEntry[];
  timestamp: string;
}

export interface ErrorEvent {
  message: string;
  stack?: string;
  url: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = env.NODE_ENV === 'production';
  }

  /**
   * Rastreia evento customizado
   */
  track(category: string, action: string, options?: {
    label?: string;
    value?: number;
    userId?: string;
    sessionId?: string;
    metadata?: Record<string, any>;
  }) {
    if (!this.isEnabled) {
      logger.debug('Analytics disabled in development');
      return;
    }

    const event: AnalyticsEvent = {
      category,
      action,
      label: options?.label,
      value: options?.value,
      userId: options?.userId,
      sessionId: options?.sessionId,
      timestamp: new Date().toISOString(),
      metadata: options?.metadata
    };

    this.events.push(event);
    this.sendEvent(event);

    logger.info('Analytics event tracked:', {
      category,
      action,
      label: options?.label
    });
  }

  /**
   * Rastreia eventos de e-commerce
   */
  trackEcommerce(action: 'view_item' | 'add_to_cart' | 'remove_from_cart' | 'purchase' | 'checkout', data: {
    productId?: string;
    productName?: string;
    category?: string;
    price?: number;
    quantity?: number;
    orderId?: string;
    userId?: string;
    sessionId?: string;
  }) {
    this.track('ecommerce', action, {
      label: data.productName || data.productId,
      value: data.price,
      userId: data.userId,
      sessionId: data.sessionId,
      metadata: data
    });
  }

  /**
   * Rastreia conversões importantes
   */
  trackConversion(type: 'signup' | 'purchase' | 'newsletter' | 'contact', value?: number, metadata?: Record<string, any>) {
    this.track('conversion', type, {
      value,
      metadata
    });
  }

  /**
   * Rastreia performance metrics (Web Vitals)
   */
  trackPerformance(metric: PerformanceMetric) {
    if (!this.isEnabled) return;

    logger.info('Performance metric:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating
    });

    this.track('performance', metric.name, {
      value: metric.value,
      metadata: {
        rating: metric.rating,
        delta: metric.delta
      }
    });
  }

  /**
   * Rastreia erros
   */
  trackError(error: ErrorEvent) {
    logger.error('Error tracked:', error);

    this.track('error', 'javascript_error', {
      label: error.message,
      metadata: {
        stack: error.stack,
        url: error.url,
        userAgent: error.userAgent,
        severity: error.severity
      }
    });
  }

  /**
   * Rastreia páginas visitadas
   */
  trackPageView(url: string, title?: string, userId?: string, sessionId?: string) {
    this.track('page', 'view', {
      label: url,
      userId,
      sessionId,
      metadata: {
        title,
        url,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined
      }
    });
  }

  /**
   * Envia evento para serviços externos
   */
  private async sendEvent(event: AnalyticsEvent) {
    try {
      // Google Analytics 4 (se configurado)
      if (typeof gtag !== 'undefined') {
        gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          custom_parameters: event.metadata
        });
      }

      // Enviar para API interna de analytics
      if (typeof fetch !== 'undefined') {
        fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }).catch(error => {
          logger.error('Failed to send analytics event:', error);
        });
      }

    } catch (error) {
      logger.error('Error sending analytics event:', error);
    }
  }

  /**
   * Obtém métricas em tempo real
   */
  getMetrics() {
    return {
      totalEvents: this.events.length,
      recentEvents: this.events.slice(-10),
      categories: this.events.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  /**
   * Limpa eventos armazenados
   */
  clearEvents() {
    this.events = [];
  }
}

// Instância singleton
export const analytics = new Analytics();

/**
 * Helper functions para uso mais fácil
 */
export const trackPageView = (url: string, title?: string) => {
  analytics.trackPageView(url, title);
};

export const trackAddToCart = (productId: string, productName: string, price: number) => {
  analytics.trackEcommerce('add_to_cart', {
    productId,
    productName,
    price,
    quantity: 1
  });
};

export const trackPurchase = (orderId: string, total: number, products: Array<{
  id: string;
  name: string;
  price: number;
  quantity: number;
}>) => {
  analytics.trackEcommerce('purchase', {
    orderId,
    price: total,
    metadata: {
      products,
      total
    }
  });
};

export const trackSignup = (method: 'email' | 'google' | 'twitter') => {
  analytics.trackConversion('signup', undefined, { method });
};

export const trackNewsletterSignup = (email: string) => {
  analytics.trackConversion('newsletter', undefined, {
    email: email.split('@')[1] // apenas domínio por privacidade
  });
};

export const trackContactForm = (subject: string) => {
  analytics.trackConversion('contact', undefined, { subject });
};

// Performance monitoring
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Core Web Vitals tracking
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS((metric) => {
      analytics.trackPerformance({
        name: 'CLS',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        timestamp: new Date().toISOString()
      });
    });

    onFID((metric) => {
      analytics.trackPerformance({
        name: 'FID',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        timestamp: new Date().toISOString()
      });
    });

    onFCP((metric) => {
      analytics.trackPerformance({
        name: 'FCP',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        timestamp: new Date().toISOString()
      });
    });

    onLCP((metric) => {
      analytics.trackPerformance({
        name: 'LCP',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        timestamp: new Date().toISOString()
      });
    });

    onTTFB((metric) => {
      analytics.trackPerformance({
        name: 'TTFB',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        timestamp: new Date().toISOString()
      });
    });
  }).catch(error => {
    logger.error('Failed to load web-vitals:', error);
  });
};

// Error tracking
export const trackError = (error: Error, context?: Record<string, any>) => {
  analytics.trackError({
    message: error.message,
    stack: error.stack,
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    timestamp: new Date().toISOString(),
    severity: 'medium'
  });
};

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    trackError(event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackError(new Error(event.reason), {
      type: 'unhandledrejection'
    });
  });
}

export default analytics;