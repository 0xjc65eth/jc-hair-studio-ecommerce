// Service Worker for aggressive caching and performance optimization
const CACHE_NAME = 'jc-hair-studio-v1';
const STATIC_CACHE = 'jc-static-v1';
const DYNAMIC_CACHE = 'jc-dynamic-v1';
const IMAGE_CACHE = 'jc-images-v1';

// Critical assets to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  '/logo-icon.svg',
  '/_next/static/css/',
  '/_next/static/js/',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;500;600&display=swap'
];

// Pages to cache for offline access
const PAGES_TO_CACHE = [
  '/',
  '/produtos',
  '/mega-hair',
  '/cosmeticos',
  '/maquiagens',
  '/sobre',
  '/contato'
];

// API routes to cache
const API_CACHE_PATTERNS = [
  '/api/products',
  '/api/categories',
  '/api/popular'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');

  event.waitUntil(
    Promise.all([
      // Cache critical static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS.filter(url => !url.includes('_next')));
      }),

      // Cache important pages
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('[SW] Caching important pages');
        return cache.addAll(PAGES_TO_CACHE);
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);

  try {
    // Strategy 1: Cache First for static assets (CSS, JS, fonts)
    if (isStaticAsset(url)) {
      return await cacheFirst(request, STATIC_CACHE);
    }

    // Strategy 2: Stale While Revalidate for images
    if (isImage(url)) {
      return await staleWhileRevalidate(request, IMAGE_CACHE);
    }

    // Strategy 3: Network First for API calls
    if (isApiCall(url)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }

    // Strategy 4: Stale While Revalidate for pages
    if (isPage(url)) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    }

    // Default: Network First
    return await networkFirst(request, DYNAMIC_CACHE);

  } catch (error) {
    console.error('[SW] Fetch error:', error);
    return await handleOffline(request);
  }
}

// Cache strategies
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    // Only cache complete responses (not partial 206 responses)
    if (response.ok && response.status !== 206) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('[SW] Cache first failed:', error);
    throw error;
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    // Only cache complete responses (not partial 206 responses)
    if (response.ok && response.status !== 206) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('[SW] Network first failed, trying cache:', error);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    // Only cache complete responses (not partial 206 responses)
    if (response.ok && response.status !== 206) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(error => {
    console.warn('[SW] Stale while revalidate fetch failed:', error);
  });

  return cached || await fetchPromise;
}

// Helper functions
function isStaticAsset(url) {
  return url.pathname.match(/\.(css|js|woff|woff2|ttf|eot)$/) ||
         url.pathname.startsWith('/_next/static/') ||
         url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com';
}

function isImage(url) {
  return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/);
}

function isApiCall(url) {
  return url.pathname.startsWith('/api/') ||
         API_CACHE_PATTERNS.some(pattern => url.pathname.startsWith(pattern));
}

function isPage(url) {
  return url.origin === self.location.origin &&
         !url.pathname.startsWith('/api/') &&
         !isStaticAsset(url) &&
         !isImage(url);
}

async function handleOffline(request) {
  const url = new URL(request.url);

  // Return offline page for navigation requests
  if (request.destination === 'document') {
    const cache = await caches.open(DYNAMIC_CACHE);
    return await cache.match('/offline') || new Response(
      '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>Você está offline</h1><p>Verifique sua conexão com a internet.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  // Return placeholder for images
  if (isImage(url)) {
    return new Response(
      '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Imagem indisponível</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }

  throw new Error('No offline fallback available');
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Retry failed network requests
      retryFailedRequests()
    );
  }
});

async function retryFailedRequests() {
  // Implementation for retrying failed requests
  console.log('[SW] Retrying failed requests...');
}

// Push notifications (for future cart abandonment)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: data.tag || 'default',
    data: data.url ? { url: data.url } : {},
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
    // Store performance metrics for analysis
    console.log('[SW] Performance metrics received:', event.data.metrics);
  }
});

console.log('[SW] Service Worker registered successfully');