'use client';

import { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    fbq: any;
  }
}

interface FacebookPixelProps {
  pixelId: string;
}

export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      // Track page view
      window.fbq('track', 'PageView');
    }
  }, []);

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '${pixelId}');
            fbq('track', 'PageView');

            // Enhanced E-commerce Events
            window.fbqTrack = function(event, params) {
              if (window.fbq) {
                window.fbq('track', event, params);
              }
            };

            // Custom events for our e-commerce
            window.trackAddToCart = function(product) {
              window.fbqTrack('AddToCart', {
                content_ids: [product.id],
                content_name: product.name,
                content_category: product.category,
                content_type: 'product',
                value: product.price,
                currency: 'EUR'
              });
            };

            window.trackInitiateCheckout = function(items, total) {
              window.fbqTrack('InitiateCheckout', {
                content_ids: items.map(item => item.id),
                contents: items.map(item => ({
                  id: item.id,
                  quantity: item.quantity,
                  item_price: item.price
                })),
                value: total,
                currency: 'EUR',
                num_items: items.length
              });
            };

            window.trackPurchase = function(orderData) {
              window.fbqTrack('Purchase', {
                content_ids: orderData.items.map(item => item.id),
                contents: orderData.items.map(item => ({
                  id: item.id,
                  quantity: item.quantity,
                  item_price: item.price
                })),
                value: orderData.total,
                currency: 'EUR',
                transaction_id: orderData.orderId
              });
            };

            window.trackViewContent = function(product) {
              window.fbqTrack('ViewContent', {
                content_ids: [product.id],
                content_name: product.name,
                content_category: product.category,
                content_type: 'product',
                value: product.price,
                currency: 'EUR'
              });
            };

            window.trackSearch = function(searchTerm) {
              window.fbqTrack('Search', {
                search_string: searchTerm,
                content_category: 'Products'
              });
            };

            window.trackCompleteRegistration = function() {
              window.fbqTrack('CompleteRegistration', {
                status: 'completed'
              });
            };

            // Brazilian products specific tracking
            window.trackBrazilianProductInterest = function(product) {
              window.fbqTrack('AddToWishlist', {
                content_ids: [product.id],
                content_name: product.name,
                content_category: 'Brazilian Products',
                value: product.price,
                currency: 'EUR'
              });
            };
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}