/**
 * Enhanced Google Analytics 4 Conversion Event Tracking
 * Tracks all major conversion events for e-commerce
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand?: string;
  variant?: string;
  price: number;
  quantity?: number;
}

export interface OrderData {
  orderId: string;
  total: number;
  tax?: number;
  shipping?: number;
  items: Product[];
  coupon?: string;
}

/**
 * Initialize GA4 tracking
 */
export function initializeGA4(measurementId: string) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: true,
    custom_map: {
      dimension1: 'product_category',
      dimension2: 'product_brand',
      dimension3: 'user_country',
      dimension4: 'traffic_source',
    },
  });
}

/**
 * Track page view
 */
export function trackPageView(url: string, title: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_title: title,
    page_location: url,
    page_path: new URL(url).pathname,
  });
}

/**
 * Track product view
 */
export function trackProductView(product: Product) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'view_item', {
    currency: 'EUR',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_variant: product.variant || 'default',
        item_brand: product.brand || 'Brazilian',
        price: product.price,
        quantity: 1,
      },
    ],
  });
}

/**
 * Track product list view
 */
export function trackProductList(products: Product[], listName: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'view_item_list', {
    item_list_name: listName,
    items: products.map((product, index) => ({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      item_variant: product.variant || 'default',
      item_brand: product.brand || 'Brazilian',
      price: product.price,
      index,
    })),
  });
}

/**
 * Track add to cart
 */
export function trackAddToCart(product: Product, quantity = 1) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'add_to_cart', {
    currency: 'EUR',
    value: product.price * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_variant: product.variant || 'default',
        item_brand: product.brand || 'Brazilian',
        price: product.price,
        quantity,
      },
    ],
  });
}

/**
 * Track remove from cart
 */
export function trackRemoveFromCart(product: Product, quantity = 1) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'remove_from_cart', {
    currency: 'EUR',
    value: product.price * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity,
      },
    ],
  });
}

/**
 * Track view cart
 */
export function trackViewCart(items: Product[], total: number) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'view_cart', {
    currency: 'EUR',
    value: total,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      item_variant: item.variant || 'default',
      item_brand: item.brand || 'Brazilian',
      price: item.price,
      quantity: item.quantity || 1,
    })),
  });
}

/**
 * Track begin checkout
 */
export function trackBeginCheckout(items: Product[], total: number, coupon?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'begin_checkout', {
    currency: 'EUR',
    value: total,
    coupon,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      item_variant: item.variant || 'default',
      item_brand: item.brand || 'Brazilian',
      price: item.price,
      quantity: item.quantity || 1,
    })),
  });
}

/**
 * Track checkout progress (shipping info, payment info)
 */
export function trackCheckoutProgress(step: number, stepName: string, items: Product[], total: number) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'checkout_progress', {
    checkout_step: step,
    checkout_step_name: stepName,
    currency: 'EUR',
    value: total,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity || 1,
    })),
  });
}

/**
 * Track add payment info
 */
export function trackAddPaymentInfo(paymentType: string, items: Product[], total: number) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'add_payment_info', {
    currency: 'EUR',
    value: total,
    payment_type: paymentType,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity || 1,
    })),
  });
}

/**
 * Track add shipping info
 */
export function trackAddShippingInfo(shippingTier: string, items: Product[], total: number) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'add_shipping_info', {
    currency: 'EUR',
    value: total,
    shipping_tier: shippingTier,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity || 1,
    })),
  });
}

/**
 * Track purchase (conversion)
 */
export function trackPurchase(orderData: OrderData) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'purchase', {
    transaction_id: orderData.orderId,
    affiliation: 'JC Hair Studio Online Store',
    value: orderData.total,
    tax: orderData.tax || 0,
    shipping: orderData.shipping || 0,
    currency: 'EUR',
    coupon: orderData.coupon,
    items: orderData.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      item_variant: item.variant || 'default',
      item_brand: item.brand || 'Brazilian',
      price: item.price,
      quantity: item.quantity || 1,
    })),
  });
}

/**
 * Track refund
 */
export function trackRefund(orderId: string, value: number, items?: Product[]) {
  if (typeof window === 'undefined' || !window.gtag) return;

  const refundData: any = {
    transaction_id: orderId,
    currency: 'EUR',
    value,
  };

  if (items) {
    refundData.items = items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      quantity: item.quantity || 1,
    }));
  }

  window.gtag('event', 'refund', refundData);
}

/**
 * Track search
 */
export function trackSearch(searchTerm: string, results = 0) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'search', {
    search_term: searchTerm,
    number_of_results: results,
  });
}

/**
 * Track newsletter signup
 */
export function trackNewsletterSignup(method = 'email') {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'newsletter_signup', {
    method,
  });
}

/**
 * Track user signup
 */
export function trackSignUp(method: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'sign_up', {
    method,
  });
}

/**
 * Track user login
 */
export function trackLogin(method: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'login', {
    method,
  });
}

/**
 * Track share
 */
export function trackShare(contentType: string, itemId: string, method: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'share', {
    content_type: contentType,
    item_id: itemId,
    method,
  });
}

/**
 * Track engagement - scroll depth
 */
export function trackScrollDepth(percentage: number) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'scroll', {
    event_category: 'Engagement',
    event_label: `${percentage}% Scroll`,
    value: percentage,
  });
}

/**
 * Track engagement - time on page
 */
export function trackTimeOnPage(seconds: number) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'timing_complete', {
    event_category: 'Engagement',
    event_label: `${seconds} Seconds`,
    value: seconds,
  });
}

/**
 * Track video engagement
 */
export function trackVideoPlay(videoTitle: string, videoDuration: number) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'video_start', {
    video_title: videoTitle,
    video_duration: videoDuration,
  });
}

/**
 * Track custom conversion event
 */
export function trackCustomConversion(eventName: string, data?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, data);
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('set', 'user_properties', properties);
}

/**
 * Track form submission
 */
export function trackFormSubmission(formName: string, formLocation: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'form_submit', {
    form_name: formName,
    form_location: formLocation,
  });
}

/**
 * Track CTA click
 */
export function trackCTAClick(ctaName: string, ctaLocation: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'cta_click', {
    cta_name: ctaName,
    cta_location: ctaLocation,
  });
}
