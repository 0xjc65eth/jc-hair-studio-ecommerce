// Sistema de Tracking de Conversões para JC Hair Studio
// Integra Google Analytics 4, Meta Pixel, Google Ads e outras plataformas

export interface ConversionEvent {
  eventName: string;
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  value?: number;
  currency?: string;
  productId?: string;
  productName?: string;
  productCategory?: string;
  customParameters?: Record<string, any>;
}

export interface EcommerceEvent {
  eventName: string;
  transactionId?: string;
  value: number;
  currency: string;
  items: EcommerceItem[];
  coupon?: string;
  shippingCost?: number;
  tax?: number;
}

export interface EcommerceItem {
  itemId: string;
  itemName: string;
  itemCategory: string;
  itemCategory2?: string;
  itemBrand?: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface TrackingPixels {
  metaPixelId: string;
  googleAnalyticsId: string;
  googleAdsConversionId: string;
  tiktokPixelId?: string;
  pinterestTagId?: string;
}

export class ConversionTracker {
  private pixels: TrackingPixels;
  private isInitialized = false;

  constructor(pixels: TrackingPixels) {
    this.pixels = pixels;
    this.initializeTracking();
  }

  // Inicializa todos os pixels de tracking
  private async initializeTracking(): Promise<void> {
    try {
      await Promise.all([
        this.initializeGoogleAnalytics(),
        this.initializeMetaPixel(),
        this.initializeGoogleAds(),
        this.initializeTikTokPixel(),
        this.initializePinterestTag()
      ]);

      this.isInitialized = true;
      console.log('Tracking de conversões inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar tracking:', error);
    }
  }

  // Google Analytics 4
  private async initializeGoogleAnalytics(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Carrega Google Tag Manager
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.pixels.googleAnalyticsId}`;
    document.head.appendChild(script);

    // Inicializa gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.pixels.googleAnalyticsId, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true,
      currency: 'EUR',
      country: 'PT'
    });

    // Configurações de e-commerce aprimorado
    gtag('config', this.pixels.googleAnalyticsId, {
      custom_map: {
        custom_parameter_1: 'user_type',
        custom_parameter_2: 'product_interest'
      }
    });
  }

  // Meta Pixel (Facebook/Instagram)
  private async initializeMetaPixel(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Facebook Pixel Code
    !(function(f: any, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    (window as any).fbq('init', this.pixels.metaPixelId);
    (window as any).fbq('track', 'PageView');

    // Configurações avançadas do Meta Pixel
    (window as any).fbq('set', 'agent', 'plshopify1.2', this.pixels.metaPixelId);
    (window as any).fbq('track', 'PageView', {}, { eventID: this.generateEventId() });
  }

  // Google Ads Conversion Tracking
  private async initializeGoogleAds(): Promise<void> {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.pixels.googleAdsConversionId}`;
    document.head.appendChild(script);

    const gtag = (window as any).gtag;
    if (gtag) {
      gtag('config', this.pixels.googleAdsConversionId);
    }
  }

  // TikTok Pixel
  private async initializeTikTokPixel(): Promise<void> {
    if (typeof window === 'undefined' || !this.pixels.tiktokPixelId) return;

    !(function (w: any, d, t) {
      w.TiktokAnalyticsObject = t;
      const ttq = w[t] = w[t] || [];
      ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
      ttq.setAndDefer = function (t: any, e: any) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
        }
      };
      for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t: any) {
        for (let e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
        return e
      };
      ttq.load = function (e: any, n: any) {
        const i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = i;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date;
        ttq._o = ttq._o || {};
        ttq._o[e] = n || {};
        const o = document.createElement('script');
        o.type = 'text/javascript';
        o.async = !0;
        o.src = i + '?sdkid=' + e + '&lib=' + t;
        const a = document.getElementsByTagName('script')[0];
        a.parentNode!.insertBefore(o, a)
      };
      ttq.load(this.pixels.tiktokPixelId);
      ttq.page();
    })(window, document, 'ttq');
  }

  // Pinterest Tag
  private async initializePinterestTag(): Promise<void> {
    if (typeof window === 'undefined' || !this.pixels.pinterestTagId) return;

    !(function (e: any) {
      if (!window.pintrk) {
        window.pintrk = function () {
          window.pintrk.queue.push(Array.prototype.slice.call(arguments))
        };
        const n = window.pintrk;
        n.queue = [];
        n.version = '3.0';
        const t = document.createElement('script');
        t.async = !0;
        t.src = e;
        const r = document.getElementsByTagName('script')[0];
        r.parentNode!.insertBefore(t, r)
      }
    })('https://s.pinimg.com/ct/core.js');

    (window as any).pintrk('load', this.pixels.pinterestTagId, { em: '<user_email_address>' });
    (window as any).pintrk('page');
  }

  // Tracking de Visualização de Produto
  trackProductView(productId: string, productName: string, category: string, price: number): void {
    if (!this.isInitialized) return;

    const eventData = {
      content_type: 'product',
      content_ids: [productId],
      content_name: productName,
      content_category: category,
      value: price,
      currency: 'EUR'
    };

    // Google Analytics 4
    this.sendGA4Event('view_item', {
      currency: 'EUR',
      value: price,
      items: [{
        item_id: productId,
        item_name: productName,
        item_category: category,
        price: price,
        quantity: 1
      }]
    });

    // Meta Pixel
    this.sendMetaEvent('ViewContent', eventData);

    // TikTok Pixel
    this.sendTikTokEvent('ViewContent', eventData);

    // Pinterest Tag
    this.sendPinterestEvent('ViewCategory', eventData);
  }

  // Tracking de Adição ao Carrinho
  trackAddToCart(productId: string, productName: string, category: string, price: number, quantity: number = 1): void {
    if (!this.isInitialized) return;

    const eventData = {
      content_type: 'product',
      content_ids: [productId],
      content_name: productName,
      content_category: category,
      value: price * quantity,
      currency: 'EUR',
      num_items: quantity
    };

    // Google Analytics 4
    this.sendGA4Event('add_to_cart', {
      currency: 'EUR',
      value: price * quantity,
      items: [{
        item_id: productId,
        item_name: productName,
        item_category: category,
        price: price,
        quantity: quantity
      }]
    });

    // Meta Pixel
    this.sendMetaEvent('AddToCart', eventData);

    // TikTok Pixel
    this.sendTikTokEvent('AddToCart', eventData);

    // Google Ads
    this.sendGoogleAdsEvent('add_to_cart', { value: price * quantity, currency: 'EUR' });
  }

  // Tracking de Início do Checkout
  trackBeginCheckout(items: EcommerceItem[], value: number): void {
    if (!this.isInitialized) return;

    const contentIds = items.map(item => item.itemId);
    const eventData = {
      content_type: 'product',
      content_ids: contentIds,
      value: value,
      currency: 'EUR',
      num_items: items.length
    };

    // Google Analytics 4
    this.sendGA4Event('begin_checkout', {
      currency: 'EUR',
      value: value,
      items: items.map(item => ({
        item_id: item.itemId,
        item_name: item.itemName,
        item_category: item.itemCategory,
        price: item.price,
        quantity: item.quantity
      }))
    });

    // Meta Pixel
    this.sendMetaEvent('InitiateCheckout', eventData);

    // TikTok Pixel
    this.sendTikTokEvent('InitiateCheckout', eventData);
  }

  // Tracking de Compra Concluída
  trackPurchase(transactionId: string, items: EcommerceItem[], value: number, tax?: number, shipping?: number): void {
    if (!this.isInitialized) return;

    const contentIds = items.map(item => item.itemId);
    const eventData = {
      content_type: 'product',
      content_ids: contentIds,
      value: value,
      currency: 'EUR',
      transaction_id: transactionId,
      num_items: items.length
    };

    // Google Analytics 4
    this.sendGA4Event('purchase', {
      transaction_id: transactionId,
      currency: 'EUR',
      value: value,
      tax: tax,
      shipping: shipping,
      items: items.map(item => ({
        item_id: item.itemId,
        item_name: item.itemName,
        item_category: item.itemCategory,
        item_brand: item.itemBrand,
        price: item.price,
        quantity: item.quantity
      }))
    });

    // Meta Pixel
    this.sendMetaEvent('Purchase', eventData);

    // TikTok Pixel
    this.sendTikTokEvent('CompletePayment', eventData);

    // Google Ads Conversion
    this.sendGoogleAdsConversion('purchase', value, transactionId);

    // Pinterest Tag
    this.sendPinterestEvent('Checkout', eventData);
  }

  // Tracking de Eventos Customizados
  trackCustomEvent(eventName: string, eventData: Record<string, any>): void {
    if (!this.isInitialized) return;

    // Google Analytics 4
    this.sendGA4Event(eventName, eventData);

    // Meta Pixel (se aplicável)
    if (eventData.value) {
      this.sendMetaEvent('CustomEvent', {
        custom_event_name: eventName,
        ...eventData
      });
    }
  }

  // Métodos auxiliares para envio de eventos
  private sendGA4Event(eventName: string, eventData: any): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, eventData);
    }
  }

  private sendMetaEvent(eventName: string, eventData: any): void {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', eventName, eventData, { eventID: this.generateEventId() });
    }
  }

  private sendTikTokEvent(eventName: string, eventData: any): void {
    if (typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.track(eventName, eventData);
    }
  }

  private sendPinterestEvent(eventName: string, eventData: any): void {
    if (typeof window !== 'undefined' && (window as any).pintrk) {
      (window as any).pintrk('track', eventName, eventData);
    }
  }

  private sendGoogleAdsEvent(eventName: string, eventData: any): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        send_to: this.pixels.googleAdsConversionId,
        ...eventData
      });
    }
  }

  private sendGoogleAdsConversion(action: string, value: number, transactionId: string): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: `${this.pixels.googleAdsConversionId}/${action}`,
        value: value,
        currency: 'EUR',
        transaction_id: transactionId
      });
    }
  }

  private generateEventId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Método para teste de pixels
  testAllPixels(): void {
    console.log('Testando todos os pixels...');

    this.trackCustomEvent('test_pixel', {
      test_parameter: 'pixel_test',
      timestamp: new Date().toISOString()
    });

    // Simula um evento de teste para cada pixel
    this.trackProductView('test-product', 'Produto Teste', 'teste', 1.00);
  }
}

// Hook React para uso em componentes
export function useConversionTracking(pixels: TrackingPixels) {
  const tracker = new ConversionTracker(pixels);

  return {
    trackProductView: (productId: string, productName: string, category: string, price: number) =>
      tracker.trackProductView(productId, productName, category, price),

    trackAddToCart: (productId: string, productName: string, category: string, price: number, quantity?: number) =>
      tracker.trackAddToCart(productId, productName, category, price, quantity),

    trackBeginCheckout: (items: EcommerceItem[], value: number) =>
      tracker.trackBeginCheckout(items, value),

    trackPurchase: (transactionId: string, items: EcommerceItem[], value: number, tax?: number, shipping?: number) =>
      tracker.trackPurchase(transactionId, items, value, tax, shipping),

    trackCustomEvent: (eventName: string, eventData: Record<string, any>) =>
      tracker.trackCustomEvent(eventName, eventData),

    testPixels: () => tracker.testAllPixels()
  };
}

// Configuração padrão para JC Hair Studio
export const defaultPixelConfig: TrackingPixels = {
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  googleAdsConversionId: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || '',
  tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '',
  pinterestTagId: process.env.NEXT_PUBLIC_PINTEREST_TAG_ID || ''
};