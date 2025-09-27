'use client';

import { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    gtag: any;
    dataLayer: any[];
  }
}

interface GoogleAnalyticsProps {
  gaId: string;
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Page view tracking on route change
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', gaId, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [gaId]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${gaId}', {
              page_title: document.title,
              page_location: window.location.href,
              // Enhanced E-commerce settings
              custom_map: {
                'custom_parameter_1': 'product_category',
                'custom_parameter_2': 'product_brand',
                'custom_parameter_3': 'user_country'
              },
              send_page_view: true,
              // Brazilian products tracking
              custom_parameter_1: 'produtos_brasileiros',
              custom_parameter_2: 'jc_hair_studio_62',
              custom_parameter_3: 'europa'
            });

            // Enhanced E-commerce tracking functions
            window.gtagTrack = function(action, parameters) {
              if (window.gtag) {
                window.gtag('event', action, parameters);
              }
            };

            // Product view tracking
            window.trackProductView = function(product) {
              window.gtagTrack('view_item', {
                currency: 'EUR',
                value: product.price,
                items: [{
                  item_id: product.id,
                  item_name: product.name,
                  item_category: product.category,
                  item_variant: product.type || 'default',
                  item_brand: product.brand || 'Brazilian',
                  price: product.price,
                  quantity: 1
                }]
              });
            };

            // Add to cart tracking
            window.trackAddToCart = function(product, quantity = 1) {
              window.gtagTrack('add_to_cart', {
                currency: 'EUR',
                value: product.price * quantity,
                items: [{
                  item_id: product.id,
                  item_name: product.name,
                  item_category: product.category,
                  item_variant: product.type || 'default',
                  item_brand: product.brand || 'Brazilian',
                  price: product.price,
                  quantity: quantity
                }]
              });
            };

            // Remove from cart tracking
            window.trackRemoveFromCart = function(product, quantity = 1) {
              window.gtagTrack('remove_from_cart', {
                currency: 'EUR',
                value: product.price * quantity,
                items: [{
                  item_id: product.id,
                  item_name: product.name,
                  item_category: product.category,
                  price: product.price,
                  quantity: quantity
                }]
              });
            };

            // Begin checkout tracking
            window.trackBeginCheckout = function(items, total) {
              window.gtagTrack('begin_checkout', {
                currency: 'EUR',
                value: total,
                items: items.map(item => ({
                  item_id: item.id,
                  item_name: item.name,
                  item_category: item.category,
                  item_variant: item.type || 'default',
                  item_brand: item.brand || 'Brazilian',
                  price: item.price,
                  quantity: item.quantity
                }))
              });
            };

            // Purchase tracking
            window.trackPurchase = function(orderData) {
              window.gtagTrack('purchase', {
                transaction_id: orderData.orderId,
                value: orderData.total,
                currency: 'EUR',
                tax: orderData.tax || 0,
                shipping: orderData.shipping || 0,
                items: orderData.items.map(item => ({
                  item_id: item.id,
                  item_name: item.name,
                  item_category: item.category,
                  item_variant: item.type || 'default',
                  item_brand: item.brand || 'Brazilian',
                  price: item.price,
                  quantity: item.quantity
                }))
              });
            };

            // Search tracking
            window.trackSearch = function(searchTerm, results = 0) {
              window.gtagTrack('search', {
                search_term: searchTerm,
                number_of_items: results,
                content_category: 'Products'
              });
            };

            // Brazilian products interaction tracking
            window.trackBrazilianProduct = function(action, productData) {
              window.gtagTrack(action, {
                event_category: 'Brazilian Products',
                event_label: productData.name,
                value: productData.price,
                currency: 'EUR',
                custom_parameter_1: productData.category,
                custom_parameter_2: productData.brand || 'JC Hair Studio 62',
                items: [{
                  item_id: productData.id,
                  item_name: productData.name,
                  category: productData.category,
                  quantity: 1,
                  price: productData.price,
                  item_brand: productData.brand || 'Brasileiro',
                  item_variant: productData.type
                }]
              });
            };

            // Scroll depth tracking
            let scrollTracked25 = false;
            let scrollTracked50 = false;
            let scrollTracked75 = false;
            let scrollTracked100 = false;

            window.addEventListener('scroll', function() {
              const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);

              if (scrollPercent >= 25 && !scrollTracked25) {
                scrollTracked25 = true;
                window.gtagTrack('scroll', {
                  event_category: 'Engagement',
                  event_label: '25% Scroll',
                  value: 25
                });
              }
              if (scrollPercent >= 50 && !scrollTracked50) {
                scrollTracked50 = true;
                window.gtagTrack('scroll', {
                  event_category: 'Engagement',
                  event_label: '50% Scroll',
                  value: 50
                });
              }
              if (scrollPercent >= 75 && !scrollTracked75) {
                scrollTracked75 = true;
                window.gtagTrack('scroll', {
                  event_category: 'Engagement',
                  event_label: '75% Scroll',
                  value: 75
                });
              }
              if (scrollPercent >= 100 && !scrollTracked100) {
                scrollTracked100 = true;
                window.gtagTrack('scroll', {
                  event_category: 'Engagement',
                  event_label: '100% Scroll',
                  value: 100
                });
              }
            });

            // Time on page tracking
            let timeOnPage = 0;
            setInterval(function() {
              timeOnPage += 30;
              if (timeOnPage === 30) {
                window.gtagTrack('timing_complete', {
                  event_category: 'Engagement',
                  event_label: '30 Seconds',
                  value: 30
                });
              } else if (timeOnPage === 60) {
                window.gtagTrack('timing_complete', {
                  event_category: 'Engagement',
                  event_label: '1 Minute',
                  value: 60
                });
              } else if (timeOnPage === 180) {
                window.gtagTrack('timing_complete', {
                  event_category: 'Engagement',
                  event_label: '3 Minutes',
                  value: 180
                });
              }
            }, 30000);

            // Click tracking for important elements
            document.addEventListener('click', function(e) {
              const target = e.target;

              // Track CTA button clicks
              if (target.matches('button[class*="cta"], button[class*="buy"], button[class*="comprar"]')) {
                window.gtagTrack('click', {
                  event_category: 'CTA',
                  event_label: target.textContent?.substring(0, 50) || 'Unknown Button',
                  page_location: window.location.href
                });
              }

              // Track product clicks
              if (target.closest('[data-product-id]')) {
                const productElement = target.closest('[data-product-id]');
                const productId = productElement.getAttribute('data-product-id');
                window.gtagTrack('select_item', {
                  event_category: 'Product Interaction',
                  event_label: productId,
                  items: [{
                    item_id: productId,
                    item_name: productElement.getAttribute('data-product-name') || 'Unknown Product'
                  }]
                });
              }
            });
          `,
        }}
      />
    </>
  );
}