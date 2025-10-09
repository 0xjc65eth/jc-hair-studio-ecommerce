'use client';

import Script from 'next/script';

interface GoogleTagManagerProps {
  gtmId: string;
}

export default function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  return (
    <>
      {/* Google Tag Manager - Head */}
      <Script
        id="gtm-head"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />

      {/* GTM NoScript fallback - rendered in body */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}

// Helper function to push custom events to GTM dataLayer
export function pushToDataLayer(event: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event,
      ...data,
    });
  }
}

// E-commerce tracking helpers
export const gtmTrack = {
  // Product view
  viewItem: (product: any) => {
    pushToDataLayer('view_item', {
      ecommerce: {
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          item_variant: product.variant || 'default',
          item_brand: product.brand || 'Brazilian',
          price: product.price,
          currency: 'EUR',
        }],
      },
    });
  },

  // Add to cart
  addToCart: (product: any, quantity = 1) => {
    pushToDataLayer('add_to_cart', {
      ecommerce: {
        currency: 'EUR',
        value: product.price * quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          item_variant: product.variant || 'default',
          item_brand: product.brand || 'Brazilian',
          price: product.price,
          quantity,
        }],
      },
    });
  },

  // Remove from cart
  removeFromCart: (product: any, quantity = 1) => {
    pushToDataLayer('remove_from_cart', {
      ecommerce: {
        currency: 'EUR',
        value: product.price * quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity,
        }],
      },
    });
  },

  // Begin checkout
  beginCheckout: (items: any[], total: number) => {
    pushToDataLayer('begin_checkout', {
      ecommerce: {
        currency: 'EUR',
        value: total,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          item_variant: item.variant || 'default',
          item_brand: item.brand || 'Brazilian',
          price: item.price,
          quantity: item.quantity,
        })),
      },
    });
  },

  // Purchase complete
  purchase: (orderData: any) => {
    pushToDataLayer('purchase', {
      ecommerce: {
        transaction_id: orderData.orderId,
        affiliation: 'JC Hair Studio Online Store',
        value: orderData.total,
        tax: orderData.tax || 0,
        shipping: orderData.shipping || 0,
        currency: 'EUR',
        items: orderData.items.map((item: any) => ({
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          item_variant: item.variant || 'default',
          item_brand: item.brand || 'Brazilian',
          price: item.price,
          quantity: item.quantity,
        })),
      },
    });
  },

  // Search
  search: (searchTerm: string, results = 0) => {
    pushToDataLayer('search', {
      search_term: searchTerm,
      number_of_results: results,
    });
  },

  // Newsletter signup
  newsletterSignup: (email: string) => {
    pushToDataLayer('newsletter_signup', {
      method: 'email',
      email_provided: !!email,
    });
  },

  // User registration
  signUp: (method: string) => {
    pushToDataLayer('sign_up', {
      method,
    });
  },

  // User login
  login: (method: string) => {
    pushToDataLayer('login', {
      method,
    });
  },

  // Custom event
  customEvent: (eventName: string, data?: Record<string, any>) => {
    pushToDataLayer(eventName, data);
  },
};
