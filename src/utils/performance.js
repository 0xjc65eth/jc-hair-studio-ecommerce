/**
 * Otimizações Avançadas de Performance
 * Lazy loading, preloading, service worker, e otimizações críticas
 */

// =====================================
// LAZY LOADING AVANÇADO
// =====================================

class AdvancedLazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px 0px',
      threshold: 0.1,
      enableVirtualScrolling: true,
      preloadDistance: 2,
      imagePlaceholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA4VjE2TTggMTJIMTYiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+',
      ...options
    };

    this.observers = new Map();
    this.loadedElements = new WeakSet();
    this.pendingElements = new Set();
    this.virtualScrollContainers = new Map();
    
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.createObservers();
    } else {
      this.fallbackToImmediate();
    }

    this.setupImageErrorHandling();
    this.setupPerformanceMonitoring();
  }

  createObservers() {
    // Observer principal para elementos
    this.observers.set('main', new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      }
    ));

    // Observer para preload (mais distante)
    this.observers.set('preload', new IntersectionObserver(
      this.handlePreloadIntersection.bind(this),
      {
        rootMargin: '200px 0px',
        threshold: 0.01
      }
    ));

    // Observer para virtual scrolling
    if (this.options.enableVirtualScrolling) {
      this.observers.set('virtual', new IntersectionObserver(
        this.handleVirtualScrolling.bind(this),
        {
          rootMargin: '300px 0px',
          threshold: 0
        }
      ));
    }
  }

  observeElement(element, type = 'image') {
    if (this.loadedElements.has(element)) return;

    const config = this.getElementConfig(element, type);
    element.dataset.lazyType = type;
    element.dataset.lazyConfig = JSON.stringify(config);

    // Aplicar placeholder se for imagem
    if (type === 'image' && !element.src) {
      element.src = this.options.imagePlaceholder;
      element.classList.add('lazy-placeholder');
    }

    // Observar com observer apropriado
    const observer = this.observers.get('main');
    if (observer) {
      observer.observe(element);
      this.pendingElements.add(element);
    } else {
      // Fallback
      this.loadElement(element, config);
    }
  }

  getElementConfig(element, type) {
    const config = { type };

    switch (type) {
      case 'image':
        config.src = element.dataset.src || element.getAttribute('data-lazy-src');
        config.srcset = element.dataset.srcset;
        config.sizes = element.dataset.sizes;
        config.webp = element.dataset.webp;
        config.avif = element.dataset.avif;
        break;

      case 'iframe':
        config.src = element.dataset.src;
        break;

      case 'component':
        config.module = element.dataset.module;
        config.props = element.dataset.props ? JSON.parse(element.dataset.props) : {};
        break;

      case 'script':
        config.src = element.dataset.src;
        config.async = element.dataset.async === 'true';
        config.defer = element.dataset.defer === 'true';
        break;

      case 'css':
        config.href = element.dataset.href;
        config.media = element.dataset.media || 'all';
        break;
    }

    return config;
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const config = JSON.parse(element.dataset.lazyConfig || '{}');
        
        this.loadElement(element, config);
        this.observers.get('main').unobserve(element);
        this.pendingElements.delete(element);
      }
    });
  }

  handlePreloadIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        this.preloadElement(element);
      }
    });
  }

  async loadElement(element, config) {
    if (this.loadedElements.has(element)) return;

    try {
      element.classList.add('lazy-loading');

      switch (config.type) {
        case 'image':
          await this.loadImage(element, config);
          break;
        case 'iframe':
          await this.loadIframe(element, config);
          break;
        case 'component':
          await this.loadComponent(element, config);
          break;
        case 'script':
          await this.loadScript(element, config);
          break;
        case 'css':
          await this.loadCSS(element, config);
          break;
      }

      this.loadedElements.add(element);
      element.classList.remove('lazy-loading', 'lazy-placeholder');
      element.classList.add('lazy-loaded');

      // Trigger reflow para animações
      this.triggerAnimation(element);

      App.events.emit('lazy:loaded', { element, config });

    } catch (error) {
      console.error('Erro no lazy loading:', error);
      element.classList.remove('lazy-loading');
      element.classList.add('lazy-error');
      
      App.events.emit('lazy:error', { element, config, error });
    }
  }

  async loadImage(element, config) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Configurar evento de load
      img.onload = () => {
        // Suporte a formatos modernos
        if (this.supportsWebP() && config.webp) {
          element.src = config.webp;
        } else if (this.supportsAVIF() && config.avif) {
          element.src = config.avif;
        } else {
          element.src = config.src;
        }
        
        if (config.srcset) element.srcset = config.srcset;
        if (config.sizes) element.sizes = config.sizes;
        
        // Fade in animation
        element.style.opacity = '0';
        element.offsetHeight; // Force reflow
        element.style.transition = 'opacity 0.3s ease';
        element.style.opacity = '1';
        
        resolve();
      };

      img.onerror = () => {
        reject(new Error('Falha ao carregar imagem'));
      };

      // Iniciar carregamento
      img.src = config.src;
    });
  }

  async loadIframe(element, config) {
    element.src = config.src;
    
    return new Promise((resolve) => {
      element.onload = resolve;
      // Timeout para evitar travamento
      setTimeout(resolve, 5000);
    });
  }

  async loadComponent(element, config) {
    try {
      const module = await import(config.module);
      const Component = module.default || module[config.export || 'default'];
      
      if (typeof Component === 'function') {
        const instance = new Component(element, config.props);
        
        if (instance.render) {
          await instance.render();
        }
      } else if (typeof Component === 'object' && Component.render) {
        await Component.render(element, config.props);
      }
      
    } catch (error) {
      throw new Error(`Falha ao carregar componente: ${error.message}`);
    }
  }

  async loadScript(element, config) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = config.src;
      
      if (config.async) script.async = true;
      if (config.defer) script.defer = true;
      
      script.onload = resolve;
      script.onerror = () => reject(new Error('Falha ao carregar script'));
      
      document.head.appendChild(script);
    });
  }

  async loadCSS(element, config) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = config.href;
      link.media = config.media;
      
      link.onload = resolve;
      link.onerror = () => reject(new Error('Falha ao carregar CSS'));
      
      document.head.appendChild(link);
    });
  }

  preloadElement(element) {
    const config = JSON.parse(element.dataset.lazyConfig || '{}');
    
    if (config.type === 'image' && config.src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = config.src;
      document.head.appendChild(link);
    }
  }

  triggerAnimation(element) {
    // Animação de entrada
    element.style.transform = 'translateY(20px)';
    element.style.opacity = '0';
    element.offsetHeight; // Force reflow
    
    element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    element.style.transform = 'translateY(0)';
    element.style.opacity = '1';
    
    // Limpar estilos após animação
    setTimeout(() => {
      element.style.transition = '';
      element.style.transform = '';
    }, 300);
  }

  setupImageErrorHandling() {
    document.addEventListener('error', (event) => {
      if (event.target.tagName === 'IMG' && event.target.classList.contains('lazy-loaded')) {
        const img = event.target;
        
        // Tentar fallback
        if (img.dataset.fallback) {
          img.src = img.dataset.fallback;
        } else {
          // Placeholder de erro
          img.src = this.options.imagePlaceholder;
          img.classList.add('lazy-error');
        }
      }
    }, true);
  }

  setupPerformanceMonitoring() {
    let loadCount = 0;
    let errorCount = 0;
    
    App.events.on('lazy:loaded', () => {
      loadCount++;
      this.reportPerformance('loaded', loadCount);
    });
    
    App.events.on('lazy:error', () => {
      errorCount++;
      this.reportPerformance('error', errorCount);
    });
  }

  reportPerformance(type, count) {
    if (count % 10 === 0) {
      console.log(`Lazy Loading - ${type}: ${count} elementos`);
    }
  }

  // Virtual Scrolling
  setupVirtualScrolling(container, itemHeight, totalItems) {
    if (!this.options.enableVirtualScrolling) return;

    const virtualContainer = {
      element: container,
      itemHeight,
      totalItems,
      visibleItems: Math.ceil(container.offsetHeight / itemHeight) + 2,
      scrollTop: 0,
      startIndex: 0,
      endIndex: 0
    };

    this.virtualScrollContainers.set(container, virtualContainer);
    
    container.addEventListener('scroll', 
      this.throttle(() => this.updateVirtualScrolling(container), 16)
    );

    this.updateVirtualScrolling(container);
  }

  updateVirtualScrolling(container) {
    const virtual = this.virtualScrollContainers.get(container);
    if (!virtual) return;

    virtual.scrollTop = container.scrollTop;
    virtual.startIndex = Math.floor(virtual.scrollTop / virtual.itemHeight);
    virtual.endIndex = Math.min(
      virtual.startIndex + virtual.visibleItems,
      virtual.totalItems
    );

    // Atualizar DOM
    this.renderVirtualItems(virtual);
  }

  renderVirtualItems(virtual) {
    const { element, startIndex, endIndex, itemHeight, totalItems } = virtual;
    
    // Limpar itens existentes
    element.innerHTML = '';
    
    // Criar espaçador superior
    if (startIndex > 0) {
      const topSpacer = document.createElement('div');
      topSpacer.style.height = `${startIndex * itemHeight}px`;
      element.appendChild(topSpacer);
    }
    
    // Renderizar itens visíveis
    for (let i = startIndex; i < endIndex; i++) {
      const item = this.createVirtualItem(i);
      element.appendChild(item);
    }
    
    // Criar espaçador inferior
    if (endIndex < totalItems) {
      const bottomSpacer = document.createElement('div');
      bottomSpacer.style.height = `${(totalItems - endIndex) * itemHeight}px`;
      element.appendChild(bottomSpacer);
    }
  }

  createVirtualItem(index) {
    const item = document.createElement('div');
    item.className = 'virtual-item';
    item.dataset.index = index;
    item.style.height = `${this.virtualScrollContainers.get(item.parentElement)?.itemHeight || 200}px`;
    
    // Lazy load do conteúdo
    this.observeElement(item, 'component');
    
    return item;
  }

  // Utility methods
  supportsWebP() {
    if (this._webpSupport !== undefined) return this._webpSupport;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    this._webpSupport = canvas.toDataURL('image/webp').startsWith('data:image/webp');
    
    return this._webpSupport;
  }

  supportsAVIF() {
    if (this._avifSupport !== undefined) return this._avifSupport;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    try {
      this._avifSupport = canvas.toDataURL('image/avif').startsWith('data:image/avif');
    } catch {
      this._avifSupport = false;
    }
    
    return this._avifSupport;
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  fallbackToImmediate() {
    // Para navegadores sem IntersectionObserver
    console.warn('IntersectionObserver não suportado, carregamento imediato');
    
    document.addEventListener('DOMContentLoaded', () => {
      const lazyElements = document.querySelectorAll('[data-src], [data-lazy-src]');
      lazyElements.forEach(element => {
        const config = this.getElementConfig(element, 'image');
        this.loadElement(element, config);
      });
    });
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.pendingElements.clear();
    this.virtualScrollContainers.clear();
  }
}

// =====================================
// PRELOADING INTELIGENTE
// =====================================

class IntelligentPreloader {
  constructor() {
    this.preloadQueue = [];
    this.preloadedResources = new Set();
    this.userBehavior = {
      scrollSpeed: 0,
      clickPattern: [],
      preferedCategories: [],
      deviceType: this.detectDeviceType(),
      connectionType: this.detectConnectionType()
    };
    
    this.init();
  }

  init() {
    this.setupBehaviorTracking();
    this.setupNetworkAwarePreloading();
    this.setupHoverPreloading();
    this.setupPredictivePreloading();
  }

  setupBehaviorTracking() {
    let lastScrollY = window.scrollY;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      this.userBehavior.scrollSpeed = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.userBehavior.scrollSpeed = 0;
      }, 100);
    });

    document.addEventListener('click', (event) => {
      const target = event.target.closest('a, button');
      if (target) {
        this.userBehavior.clickPattern.push({
          element: target.tagName,
          href: target.href || target.dataset.href,
          timestamp: Date.now()
        });
        
        // Manter apenas os últimos 20 cliques
        if (this.userBehavior.clickPattern.length > 20) {
          this.userBehavior.clickPattern.shift();
        }
      }
    });
  }

  setupNetworkAwarePreloading() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      const updateConnectionType = () => {
        this.userBehavior.connectionType = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          saveData: connection.saveData
        };
        
        this.adjustPreloadingStrategy();
      };
      
      connection.addEventListener('change', updateConnectionType);
      updateConnectionType();
    }
  }

  setupHoverPreloading() {
    let hoverTimeout;
    
    document.addEventListener('mouseover', (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        this.preloadUrl(link.href, 'hover');
      }, 100); // Preload após 100ms de hover
    });
    
    document.addEventListener('mouseout', () => {
      clearTimeout(hoverTimeout);
    });
  }

  setupPredictivePreloading() {
    // Preload baseado em padrões de comportamento
    setInterval(() => {
      this.predictAndPreload();
    }, 5000);
  }

  async preloadUrl(url, trigger = 'manual') {
    if (this.preloadedResources.has(url)) return;
    
    // Verificar se devemos preload baseado na conexão
    if (!this.shouldPreload(trigger)) return;
    
    try {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
      
      this.preloadedResources.add(url);
      
      App.events.emit('preload:url', { url, trigger });
      
    } catch (error) {
      console.error('Erro no preload:', error);
    }
  }

  async preloadImage(src, priority = 'low') {
    if (this.preloadedResources.has(src)) return;
    
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      
      if (priority === 'high') {
        link.fetchPriority = 'high';
      }
      
      link.onload = () => {
        this.preloadedResources.add(src);
        resolve();
      };
      
      link.onerror = reject;
      
      document.head.appendChild(link);
    });
  }

  async preloadScript(src) {
    if (this.preloadedResources.has(src)) return;
    
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = src;
    
    document.head.appendChild(link);
    this.preloadedResources.add(src);
  }

  shouldPreload(trigger) {
    const connection = this.userBehavior.connectionType;
    
    // Não preload em conexões lentas ou save-data
    if (connection?.saveData || connection?.effectiveType === 'slow-2g') {
      return false;
    }
    
    // Preload mais agressivo em conexões rápidas
    if (connection?.effectiveType === '4g' && trigger === 'hover') {
      return true;
    }
    
    // Estratégia conservadora por padrão
    return trigger === 'manual' || trigger === 'predictive';
  }

  predictAndPreload() {
    // Analisar padrões de clique
    const recentClicks = this.userBehavior.clickPattern
      .filter(click => Date.now() - click.timestamp < 30000); // Últimos 30s
    
    if (recentClicks.length < 2) return;
    
    // Encontrar padrões
    const patterns = this.findClickPatterns(recentClicks);
    
    patterns.forEach(pattern => {
      if (pattern.confidence > 0.7) {
        this.preloadUrl(pattern.nextUrl, 'predictive');
      }
    });
  }

  findClickPatterns(clicks) {
    // Implementação simplificada de detecção de padrões
    const patterns = [];
    
    // Padrão: navegação sequencial em produtos
    const productClicks = clicks.filter(click => 
      click.href && click.href.includes('/produto/')
    );
    
    if (productClicks.length >= 2) {
      const lastProduct = productClicks[productClicks.length - 1];
      const productId = this.extractProductId(lastProduct.href);
      
      if (productId) {
        patterns.push({
          type: 'sequential_product',
          nextUrl: `/produto/${productId + 1}`, // Próximo produto
          confidence: 0.8
        });
      }
    }
    
    return patterns;
  }

  extractProductId(url) {
    const match = url.match(/\/produto\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  adjustPreloadingStrategy() {
    const connection = this.userBehavior.connectionType;
    
    if (connection?.saveData) {
      // Modo conservativo
      this.preloadQueue = [];
    } else if (connection?.effectiveType === '4g') {
      // Modo agressivo
      this.preloadVisibleImages();
      this.preloadCriticalResources();
    }
  }

  preloadVisibleImages() {
    const images = document.querySelectorAll('img[data-src]');
    const viewportHeight = window.innerHeight;
    
    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      
      // Preload se estiver próximo da viewport
      if (rect.top < viewportHeight * 2) {
        this.preloadImage(img.dataset.src);
      }
    });
  }

  preloadCriticalResources() {
    // Preload de recursos críticos da próxima página provável
    const criticalResources = [
      '/api/products/featured',
      '/css/critical.css',
      '/js/product-detail.js'
    ];
    
    criticalResources.forEach(resource => {
      if (resource.endsWith('.js')) {
        this.preloadScript(resource);
      } else if (resource.endsWith('.css')) {
        this.preloadCSS(resource);
      }
    });
  }

  preloadCSS(href) {
    if (this.preloadedResources.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    
    document.head.appendChild(link);
    this.preloadedResources.add(href);
  }

  detectDeviceType() {
    const userAgent = navigator.userAgent;
    
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    } else {
      return 'desktop';
    }
  }

  detectConnectionType() {
    if ('connection' in navigator) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        saveData: navigator.connection.saveData
      };
    }
    
    return { effectiveType: 'unknown' };
  }
}

// =====================================
// SERVICE WORKER MANAGER
// =====================================

class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.updateAvailable = false;
    
    this.init();
  }

  async init() {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        });
        
        this.setupUpdateHandling();
        this.setupMessageHandling();
        
        console.log('Service Worker registrado');
        
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
      }
    }
  }

  setupUpdateHandling() {
    if (!this.registration) return;
    
    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration.installing;
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this.updateAvailable = true;
          this.showUpdateNotification();
        }
      });
    });
  }

  setupMessageHandling() {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data;
      
      switch (type) {
        case 'CACHE_UPDATED':
          console.log('Cache atualizado:', data);
          break;
        case 'OFFLINE_READY':
          this.showOfflineNotification();
          break;
        case 'UPDATE_AVAILABLE':
          this.updateAvailable = true;
          this.showUpdateNotification();
          break;
      }
    });
  }

  showUpdateNotification() {
    App.showNotification({
      type: 'info',
      message: 'Nova versão disponível',
      duration: 0,
      actions: [
        {
          text: 'Atualizar',
          action: () => this.applyUpdate()
        },
        {
          text: 'Depois',
          action: () => {}
        }
      ]
    });
  }

  showOfflineNotification() {
    App.showNotification({
      type: 'info',
      message: 'Aplicação pronta para uso offline',
      duration: 3000
    });
  }

  async applyUpdate() {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  async cacheResource(url, cacheName = 'dynamic-cache') {
    if ('serviceWorker' in navigator && this.registration) {
      this.registration.active?.postMessage({
        type: 'CACHE_RESOURCE',
        url,
        cacheName
      });
    }
  }

  async clearCache(cacheName) {
    if ('serviceWorker' in navigator && this.registration) {
      this.registration.active?.postMessage({
        type: 'CLEAR_CACHE',
        cacheName
      });
    }
  }
}

// =====================================
// RESOURCE HINTS MANAGER
// =====================================

class ResourceHintsManager {
  constructor() {
    this.hints = new Set();
    this.criticalResources = new Set();
    
    this.init();
  }

  init() {
    this.setupCriticalResourcePreload();
    this.setupDNSPrefetch();
    this.setupPreconnect();
  }

  setupCriticalResourcePreload() {
    // Preload de recursos críticos
    const criticalResources = [
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      { href: '/fonts/playfair-display.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      { href: '/css/critical.css', as: 'style' },
      { href: '/js/app.js', as: 'script' }
    ];
    
    criticalResources.forEach(resource => {
      this.preload(resource);
    });
  }

  setupDNSPrefetch() {
    // DNS prefetch para domínios externos
    const domains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'api.stripe.com',
      'www.google-analytics.com',
      'cdn.jsdelivr.net'
    ];
    
    domains.forEach(domain => {
      this.dnsPrefetch(domain);
    });
  }

  setupPreconnect() {
    // Preconnect para recursos críticos externos
    const connections = [
      { href: 'https://fonts.googleapis.com', crossorigin: true },
      { href: 'https://api.stripe.com' }
    ];
    
    connections.forEach(connection => {
      this.preconnect(connection.href, connection.crossorigin);
    });
  }

  preload(resource) {
    const key = `preload-${resource.href}`;
    if (this.hints.has(key)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
    if (resource.media) link.media = resource.media;
    
    document.head.appendChild(link);
    this.hints.add(key);
  }

  prefetch(href) {
    const key = `prefetch-${href}`;
    if (this.hints.has(key)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    
    document.head.appendChild(link);
    this.hints.add(key);
  }

  dnsPrefetch(domain) {
    const key = `dns-prefetch-${domain}`;
    if (this.hints.has(key)) return;
    
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    
    document.head.appendChild(link);
    this.hints.add(key);
  }

  preconnect(href, crossorigin = false) {
    const key = `preconnect-${href}`;
    if (this.hints.has(key)) return;
    
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    
    if (crossorigin) link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
    this.hints.add(key);
  }

  modulePreload(href) {
    const key = `modulepreload-${href}`;
    if (this.hints.has(key)) return;
    
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = href;
    
    document.head.appendChild(link);
    this.hints.add(key);
  }
}

// =====================================
// PERFORMANCE MONITOR
// =====================================

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
    this.thresholds = {
      LCP: 2500,
      FID: 100,
      CLS: 0.1,
      FCP: 1800,
      TTFB: 800
    };
    
    this.init();
  }

  init() {
    this.observeWebVitals();
    this.observeResourceTiming();
    this.observeUserTiming();
    this.setupReporting();
  }

  observeWebVitals() {
    // Largest Contentful Paint
    this.observeMetric('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('LCP', lastEntry.startTime);
    });

    // First Input Delay
    this.observeMetric('first-input', (entries) => {
      entries.forEach(entry => {
        const delay = entry.processingStart - entry.startTime;
        this.recordMetric('FID', delay);
      });
    });

    // Cumulative Layout Shift
    let clsValue = 0;
    this.observeMetric('layout-shift', (entries) => {
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.recordMetric('CLS', clsValue);
        }
      });
    });

    // First Contentful Paint
    this.observeMetric('paint', (entries) => {
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('FCP', entry.startTime);
        }
      });
    });
  }

  observeResourceTiming() {
    this.observeMetric('resource', (entries) => {
      entries.forEach(entry => {
        this.analyzeResourceTiming(entry);
      });
    });
  }

  observeUserTiming() {
    this.observeMetric('measure', (entries) => {
      entries.forEach(entry => {
        this.recordMetric(`custom.${entry.name}`, entry.duration);
      });
    });
  }

  observeMetric(entryType, callback) {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          callback(list.getEntries());
        });
        
        observer.observe({ entryTypes: [entryType] });
        this.observers.push(observer);
        
      } catch (error) {
        console.warn(`Não foi possível observar ${entryType}:`, error);
      }
    }
  }

  recordMetric(name, value) {
    this.metrics.set(name, {
      value,
      timestamp: Date.now(),
      good: this.isGoodMetric(name, value)
    });

    // Emitir evento
    App.events.emit('performance:metric', { name, value });

    // Log se estiver acima do threshold
    if (!this.isGoodMetric(name, value)) {
      console.warn(`Performance Alert: ${name} = ${value}ms (threshold: ${this.thresholds[name]}ms)`);
    }
  }

  isGoodMetric(name, value) {
    const threshold = this.thresholds[name];
    return threshold ? value <= threshold : true;
  }

  analyzeResourceTiming(entry) {
    const duration = entry.responseEnd - entry.startTime;
    const resourceType = this.getResourceType(entry.name);
    
    // Analisar recursos lentos
    if (duration > 1000) {
      console.warn(`Slow resource: ${entry.name} (${duration}ms)`);
      
      App.events.emit('performance:slow_resource', {
        url: entry.name,
        duration,
        type: resourceType,
        size: entry.transferSize
      });
    }

    // Analisar bloqueio de renderização
    if (resourceType === 'css' && duration > 500) {
      console.warn(`Render-blocking CSS: ${entry.name}`);
    }
  }

  getResourceType(url) {
    if (url.includes('.css')) return 'css';
    if (url.includes('.js')) return 'js';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
    return 'other';
  }

  setupReporting() {
    // Relatório a cada 30 segundos
    setInterval(() => {
      this.generateReport();
    }, 30000);

    // Relatório quando a página for ocultada
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.generateReport();
      }
    });

    // Relatório antes de sair da página
    window.addEventListener('beforeunload', () => {
      this.generateReport();
    });
  }

  generateReport() {
    const report = {
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo(),
      metrics: Object.fromEntries(this.metrics),
      resourceStats: this.getResourceStats()
    };

    // Enviar para analytics
    this.sendToAnalytics(report);
    
    // Log local para debug
    console.log('Performance Report:', report);
  }

  getConnectionInfo() {
    if ('connection' in navigator) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
    }
    return null;
  }

  getResourceStats() {
    const resources = performance.getEntriesByType('resource');
    const stats = {
      total: resources.length,
      types: {},
      totalSize: 0,
      totalDuration: 0
    };

    resources.forEach(resource => {
      const type = this.getResourceType(resource.name);
      
      if (!stats.types[type]) {
        stats.types[type] = { count: 0, size: 0, duration: 0 };
      }
      
      stats.types[type].count++;
      stats.types[type].size += resource.transferSize || 0;
      stats.types[type].duration += resource.duration;
      
      stats.totalSize += resource.transferSize || 0;
      stats.totalDuration += resource.duration;
    });

    return stats;
  }

  sendToAnalytics(report) {
    // Enviar para Google Analytics, se disponível
    if (typeof gtag !== 'undefined') {
      Object.entries(report.metrics).forEach(([name, data]) => {
        if (data.value > 0) {
          gtag('event', 'timing_complete', {
            name: name,
            value: Math.round(data.value)
          });
        }
      });
    }

    // Enviar para endpoint personalizado
    if (App.api) {
      App.api.post('/analytics/performance', report).catch(error => {
        console.warn('Erro ao enviar dados de performance:', error);
      });
    }
  }

  // API pública
  mark(name) {
    performance.mark(name);
  }

  measure(name, startMark, endMark) {
    performance.measure(name, startMark, endMark);
  }

  getMetric(name) {
    return this.metrics.get(name);
  }

  getAllMetrics() {
    return Object.fromEntries(this.metrics);
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// =====================================
// EXPORTS
// =====================================

export {
  AdvancedLazyLoader,
  IntelligentPreloader,
  ServiceWorkerManager,
  ResourceHintsManager,
  PerformanceMonitor
};