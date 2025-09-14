/**
 * JC Hair Studio's 62 - Sistema de Integração Completo
 * Arquitetura modular HTML/CSS/JS para e-commerce
 * 
 * @author JC Hair Studio's 62
 * @version 1.0.0
 */

// Configuração global da aplicação
const AppConfig = {
  name: "JC Hair Studio's 62",
  version: "1.0.0",
  api: {
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://jchairstudios62.xyz/api' 
      : 'http://localhost:3000/api',
    timeout: 10000
  },
  features: {
    lazyLoading: true,
    virtualScrolling: true,
    offlineMode: false,
    analytics: true,
    optimization: true
  },
  responsive: {
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400
    }
  }
};

// Sistema de Observadores e Eventos
class EventManager {
  constructor() {
    this.events = new Map();
    this.onceEvents = new Set();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
  }

  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
    this.onceEvents.add(wrapper);
  }

  off(event, callback) {
    if (this.events.has(event)) {
      const callbacks = this.events.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Erro no evento ${event}:`, error);
        }
      });
    }
  }

  clear() {
    this.events.clear();
    this.onceEvents.clear();
  }
}

// Sistema de Estado Global
class StateManager {
  constructor() {
    this.state = new Proxy({}, {
      set: (target, property, value) => {
        const oldValue = target[property];
        target[property] = value;
        
        // Emitir evento de mudança de estado
        App.events.emit('stateChange', {
          property,
          oldValue,
          newValue: value
        });
        
        return true;
      }
    });
    
    this.init();
  }

  init() {
    // Estado inicial da aplicação
    this.state = {
      // UI State
      ui: {
        isMobileMenuOpen: false,
        isSearchOpen: false,
        isFilterOpen: false,
        isCartOpen: false,
        isLoading: false,
        currentView: 'home',
        scrollPosition: 0,
        theme: 'light'
      },
      
      // Navigation State
      navigation: {
        currentPage: '/',
        previousPage: null,
        breadcrumbs: [],
        history: []
      },
      
      // User State
      user: {
        isLoggedIn: false,
        preferences: {
          language: 'pt',
          currency: 'EUR',
          notifications: true
        },
        cart: {
          items: [],
          total: 0,
          count: 0
        },
        wishlist: {
          items: [],
          count: 0
        }
      },
      
      // Product State
      products: {
        featured: [],
        categories: [],
        filters: {
          category: null,
          priceRange: [0, 1000],
          brand: null,
          inStock: true,
          sortBy: 'featured'
        },
        searchQuery: '',
        searchResults: []
      },
      
      // Performance State
      performance: {
        loadTime: 0,
        apiCalls: 0,
        cacheHits: 0,
        errors: []
      }
    };
  }

  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.state);
  }

  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (!obj[key]) obj[key] = {};
      return obj[key];
    }, this.state);
    
    target[lastKey] = value;
  }

  update(path, updater) {
    const currentValue = this.get(path);
    const newValue = typeof updater === 'function' 
      ? updater(currentValue) 
      : updater;
    this.set(path, newValue);
  }

  reset() {
    this.init();
  }
}

// Sistema de Cache
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutos
  }

  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttl);
    
    // Auto-limpeza
    setTimeout(() => {
      this.delete(key);
    }, ttl);
  }

  get(key) {
    if (this.has(key)) {
      App.state.update('performance.cacheHits', hits => hits + 1);
      return this.cache.get(key);
    }
    return null;
  }

  has(key) {
    if (!this.cache.has(key)) return false;
    
    const expiry = this.ttl.get(key);
    if (Date.now() > expiry) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }

  clear() {
    this.cache.clear();
    this.ttl.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Sistema de API
class ApiManager {
  constructor() {
    this.baseUrl = AppConfig.api.baseUrl;
    this.timeout = AppConfig.api.timeout;
    this.interceptors = [];
  }

  addInterceptor(interceptor) {
    this.interceptors.push(interceptor);
  }

  async request(url, options = {}) {
    const startTime = performance.now();
    
    try {
      // Aplicar interceptors
      let config = { url, ...options };
      for (const interceptor of this.interceptors) {
        config = await interceptor.request(config);
      }

      // Verificar cache
      const cacheKey = `${config.method || 'GET'}:${url}`;
      if ((config.method || 'GET') === 'GET') {
        const cached = App.cache.get(cacheKey);
        if (cached) return cached;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}${url}`, {
        ...config,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache GET requests
      if ((config.method || 'GET') === 'GET') {
        App.cache.set(cacheKey, data);
      }

      // Aplicar interceptors de resposta
      let result = data;
      for (const interceptor of this.interceptors) {
        if (interceptor.response) {
          result = await interceptor.response(result);
        }
      }

      App.state.update('performance.apiCalls', calls => calls + 1);
      App.state.update('performance.loadTime', Date.now() - startTime);

      return result;

    } catch (error) {
      const errorInfo = {
        url,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      
      App.state.update('performance.errors', errors => [...errors, errorInfo]);
      App.events.emit('api:error', errorInfo);
      
      throw error;
    }
  }

  // Métodos de conveniência
  get(url, config = {}) {
    return this.request(url, { ...config, method: 'GET' });
  }

  post(url, data, config = {}) {
    return this.request(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(url, data, config = {}) {
    return this.request(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete(url, config = {}) {
    return this.request(url, { ...config, method: 'DELETE' });
  }
}

// Sistema de Router
class RouterManager {
  constructor() {
    this.routes = new Map();
    this.middlewares = [];
    this.currentRoute = null;
    this.history = [];
    
    this.init();
  }

  init() {
    // Interceptar navegação do navegador
    window.addEventListener('popstate', (event) => {
      this.handleRoute(window.location.pathname, false);
    });

    // Interceptar cliques em links
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (link && this.isInternalLink(link.href)) {
        event.preventDefault();
        this.navigate(link.href);
      }
    });

    // Rota inicial
    this.handleRoute(window.location.pathname, false);
  }

  isInternalLink(href) {
    try {
      const url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch {
      return true; // Assume que é interno se não conseguir parsear
    }
  }

  addRoute(path, handler, middleware = []) {
    this.routes.set(path, { handler, middleware });
  }

  addMiddleware(middleware) {
    this.middlewares.push(middleware);
  }

  async navigate(path, pushState = true) {
    if (pushState) {
      window.history.pushState({}, '', path);
    }
    
    await this.handleRoute(path, pushState);
  }

  async handleRoute(path, pushState = true) {
    try {
      // Aplicar middlewares globais
      for (const middleware of this.middlewares) {
        const result = await middleware(path);
        if (result === false) return; // Middleware bloqueou a navegação
      }

      // Encontrar rota
      let route = this.routes.get(path);
      if (!route) {
        // Tentar rotas com parâmetros
        for (const [pattern, routeConfig] of this.routes) {
          const match = this.matchRoute(pattern, path);
          if (match) {
            route = { ...routeConfig, params: match.params };
            break;
          }
        }
      }

      if (!route) {
        route = this.routes.get('*') || { handler: this.handle404 };
      }

      // Aplicar middlewares da rota
      if (route.middleware) {
        for (const middleware of route.middleware) {
          const result = await middleware(path, route.params);
          if (result === false) return;
        }
      }

      // Executar handler da rota
      App.state.set('navigation.previousPage', this.currentRoute?.path);
      App.state.set('navigation.currentPage', path);
      
      this.currentRoute = { path, ...route };
      this.history.push(path);

      App.events.emit('route:change', {
        path,
        params: route.params,
        previousPath: App.state.get('navigation.previousPage')
      });

      await route.handler(route.params || {});

    } catch (error) {
      console.error('Erro na navegação:', error);
      App.events.emit('route:error', { path, error });
    }
  }

  matchRoute(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart.startsWith(':')) {
        params[patternPart.slice(1)] = pathPart;
      } else if (patternPart !== pathPart) {
        return null;
      }
    }

    return { params };
  }

  handle404() {
    console.warn('Página não encontrada:', window.location.pathname);
    App.events.emit('route:404', window.location.pathname);
  }

  back() {
    window.history.back();
  }

  forward() {
    window.history.forward();
  }

  replace(path) {
    window.history.replaceState({}, '', path);
    this.handleRoute(path, false);
  }
}

// Sistema de Lazy Loading
class LazyLoadManager {
  constructor() {
    this.observer = null;
    this.elements = new WeakMap();
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      );
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const config = this.elements.get(element);
        
        if (config) {
          this.loadElement(element, config);
          this.observer.unobserve(element);
          this.elements.delete(element);
        }
      }
    });
  }

  async loadElement(element, config) {
    try {
      element.classList.add('lazy-loading');

      if (config.type === 'image') {
        await this.loadImage(element, config);
      } else if (config.type === 'component') {
        await this.loadComponent(element, config);
      } else if (config.type === 'script') {
        await this.loadScript(element, config);
      }

      element.classList.remove('lazy-loading');
      element.classList.add('lazy-loaded');
      
      App.events.emit('lazy:loaded', { element, config });

    } catch (error) {
      element.classList.remove('lazy-loading');
      element.classList.add('lazy-error');
      console.error('Erro no lazy loading:', error);
    }
  }

  loadImage(element, config) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        element.src = config.src;
        if (config.srcset) element.srcset = config.srcset;
        resolve();
      };
      img.onerror = reject;
      img.src = config.src;
    });
  }

  async loadComponent(element, config) {
    const module = await import(config.src);
    const Component = module.default || module[config.export];
    
    if (typeof Component === 'function') {
      const instance = new Component(element, config.props);
      if (instance.render) {
        instance.render();
      }
    }
  }

  loadScript(element, config) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = config.src;
      script.onload = resolve;
      script.onerror = reject;
      
      if (config.async) script.async = true;
      if (config.defer) script.defer = true;
      
      document.head.appendChild(script);
    });
  }

  observe(element, config) {
    if (this.observer) {
      this.elements.set(element, config);
      this.observer.observe(element);
    } else {
      // Fallback para navegadores sem IntersectionObserver
      setTimeout(() => this.loadElement(element, config), 100);
    }
  }

  unobserve(element) {
    if (this.observer) {
      this.observer.unobserve(element);
    }
    this.elements.delete(element);
  }
}

// Sistema de Performance
class PerformanceManager {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
    this.init();
  }

  init() {
    // Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    
    // Custom metrics
    this.observeCustom();
  }

  observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.set('LCP', lastEntry.startTime);
        App.events.emit('performance:lcp', lastEntry.startTime);
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('LCP observation not supported');
      }
    }
  }

  observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.metrics.set('FID', entry.processingStart - entry.startTime);
          App.events.emit('performance:fid', entry.processingStart - entry.startTime);
        });
      });

      try {
        observer.observe({ entryTypes: ['first-input'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('FID observation not supported');
      }
    }
  }

  observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.set('CLS', clsValue);
            App.events.emit('performance:cls', clsValue);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('CLS observation not supported');
      }
    }
  }

  observeCustom() {
    // Observar recursos
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'resource') {
            this.trackResource(entry);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['resource'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('Resource observation not supported');
      }
    }
  }

  trackResource(entry) {
    const resourceType = this.getResourceType(entry.name);
    const loadTime = entry.responseEnd - entry.startTime;
    
    if (!this.metrics.has('resources')) {
      this.metrics.set('resources', {});
    }
    
    const resources = this.metrics.get('resources');
    if (!resources[resourceType]) {
      resources[resourceType] = [];
    }
    
    resources[resourceType].push({
      name: entry.name,
      loadTime,
      size: entry.transferSize,
      timestamp: Date.now()
    });

    App.events.emit('performance:resource', {
      type: resourceType,
      name: entry.name,
      loadTime,
      size: entry.transferSize
    });
  }

  getResourceType(url) {
    if (url.includes('.css')) return 'css';
    if (url.includes('.js')) return 'js';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
    return 'other';
  }

  mark(name) {
    if ('performance' in window && performance.mark) {
      performance.mark(name);
    }
  }

  measure(name, startMark, endMark) {
    if ('performance' in window && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name, 'measure')[0];
        this.metrics.set(name, measure.duration);
        App.events.emit('performance:measure', {
          name,
          duration: measure.duration
        });
        return measure.duration;
      } catch (e) {
        console.warn(`Could not measure ${name}:`, e);
      }
    }
    return 0;
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  reportMetrics() {
    const metrics = this.getMetrics();
    console.group('Performance Metrics');
    console.table(metrics);
    console.groupEnd();
    return metrics;
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// Classe Principal da Aplicação
class Application {
  constructor() {
    this.config = AppConfig;
    this.events = new EventManager();
    this.state = new StateManager();
    this.cache = new CacheManager();
    this.api = new ApiManager();
    this.router = new RouterManager();
    this.lazyLoad = new LazyLoadManager();
    this.performance = new PerformanceManager();
    
    this.modules = new Map();
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      this.performance.mark('app-init-start');
      
      console.log(`🚀 Inicializando ${this.config.name} v${this.config.version}`);

      // Configurar interceptors da API
      this.setupApiInterceptors();
      
      // Configurar rotas
      this.setupRoutes();
      
      // Configurar event listeners globais
      this.setupEventListeners();
      
      // Inicializar módulos principais
      await this.initModules();
      
      // Configurar PWA
      this.setupPWA();
      
      this.performance.mark('app-init-end');
      this.performance.measure('app-init', 'app-init-start', 'app-init-end');
      
      this.initialized = true;
      this.events.emit('app:ready');
      
      console.log(`✅ ${this.config.name} inicializado com sucesso`);

    } catch (error) {
      console.error('❌ Erro na inicialização:', error);
      this.events.emit('app:error', error);
    }
  }

  setupApiInterceptors() {
    // Interceptor de autenticação
    this.api.addInterceptor({
      request: async (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`
          };
        }
        return config;
      },
      response: async (data) => {
        // Log para debug
        if (this.config.features.analytics) {
          console.log('API Response:', data);
        }
        return data;
      }
    });

    // Interceptor de rate limiting
    this.api.addInterceptor({
      request: async (config) => {
        const now = Date.now();
        const lastRequest = this.cache.get('lastApiRequest') || 0;
        const minInterval = 100; // 100ms entre requests

        if (now - lastRequest < minInterval) {
          await new Promise(resolve => setTimeout(resolve, minInterval));
        }

        this.cache.set('lastApiRequest', Date.now());
        return config;
      }
    });
  }

  setupRoutes() {
    // Middleware de autenticação
    const authMiddleware = async (path) => {
      const protectedPaths = ['/conta', '/favoritos', '/pedidos'];
      if (protectedPaths.some(p => path.startsWith(p))) {
        const isLoggedIn = this.state.get('user.isLoggedIn');
        if (!isLoggedIn) {
          this.router.navigate('/login');
          return false;
        }
      }
      return true;
    };

    // Middleware de loading
    const loadingMiddleware = async (path) => {
      this.state.set('ui.isLoading', true);
      return true;
    };

    this.router.addMiddleware(authMiddleware);
    this.router.addMiddleware(loadingMiddleware);

    // Definir rotas
    this.router.addRoute('/', this.handleHomePage.bind(this));
    this.router.addRoute('/produtos', this.handleProductsPage.bind(this));
    this.router.addRoute('/produto/:id', this.handleProductPage.bind(this));
    this.router.addRoute('/categoria/:slug', this.handleCategoryPage.bind(this));
    this.router.addRoute('/carrinho', this.handleCartPage.bind(this));
    this.router.addRoute('/checkout', this.handleCheckoutPage.bind(this));
    this.router.addRoute('/conta', this.handleAccountPage.bind(this));
    this.router.addRoute('*', this.handleNotFound.bind(this));
  }

  setupEventListeners() {
    // Listener de mudanças de estado
    this.events.on('stateChange', (change) => {
      if (change.property === 'ui.isLoading') {
        this.toggleGlobalLoading(change.newValue);
      }
    });

    // Listener de erros da API
    this.events.on('api:error', (error) => {
      this.showNotification({
        type: 'error',
        message: 'Erro de conexão. Tente novamente.',
        duration: 5000
      });
    });

    // Listener de mudanças de rota
    this.events.on('route:change', (routeInfo) => {
      this.state.set('ui.isLoading', false);
      this.updateBreadcrumbs(routeInfo.path);
    });

    // Listener de performance
    this.events.on('performance:lcp', (value) => {
      if (value > 2500) {
        console.warn('⚠️ LCP alto detectado:', value);
      }
    });

    // Listener de erros globais
    window.addEventListener('error', (event) => {
      console.error('Erro global:', event.error);
      this.state.update('performance.errors', errors => [
        ...errors,
        {
          message: event.error.message,
          stack: event.error.stack,
          timestamp: new Date().toISOString()
        }
      ]);
    });

    // Listener de offline/online
    window.addEventListener('online', () => {
      this.showNotification({
        type: 'success',
        message: 'Conexão restaurada',
        duration: 3000
      });
    });

    window.addEventListener('offline', () => {
      this.showNotification({
        type: 'warning',
        message: 'Você está offline',
        duration: 5000
      });
    });
  }

  async initModules() {
    const moduleList = [
      'ProductManager',
      'CartManager', 
      'SearchManager',
      'FilterManager',
      'WishlistManager',
      'NotificationManager'
    ];

    for (const moduleName of moduleList) {
      try {
        const module = await this.loadModule(moduleName);
        this.modules.set(moduleName, module);
        console.log(`📦 Módulo ${moduleName} carregado`);
      } catch (error) {
        console.warn(`⚠️ Falha ao carregar módulo ${moduleName}:`, error);
      }
    }
  }

  async loadModule(name) {
    // Simulação de carregamento dinâmico de módulos
    // Na implementação real, seria: await import(`./modules/${name}.js`)
    return {
      name,
      init: () => console.log(`Módulo ${name} inicializado`),
      destroy: () => console.log(`Módulo ${name} destruído`)
    };
  }

  setupPWA() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registrado:', registration);
        })
        .catch(error => {
          console.log('SW falhou:', error);
        });
    }
  }

  // Handlers de Rota
  async handleHomePage() {
    console.log('📄 Carregando página inicial');
    this.state.set('ui.currentView', 'home');
    
    // Carregar produtos em destaque
    try {
      const featured = await this.api.get('/products/featured');
      this.state.set('products.featured', featured);
    } catch (error) {
      console.error('Erro ao carregar produtos em destaque:', error);
    }
  }

  async handleProductsPage() {
    console.log('📄 Carregando página de produtos');
    this.state.set('ui.currentView', 'products');
    
    try {
      const products = await this.api.get('/products');
      this.state.set('products.list', products);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }

  async handleProductPage(params) {
    console.log('📄 Carregando produto:', params.id);
    this.state.set('ui.currentView', 'product');
    
    try {
      const product = await this.api.get(`/products/${params.id}`);
      this.state.set('products.current', product);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
    }
  }

  async handleCategoryPage(params) {
    console.log('📄 Carregando categoria:', params.slug);
    this.state.set('ui.currentView', 'category');
    this.state.set('products.filters.category', params.slug);
    
    try {
      const products = await this.api.get(`/products?category=${params.slug}`);
      this.state.set('products.list', products);
    } catch (error) {
      console.error('Erro ao carregar categoria:', error);
    }
  }

  async handleCartPage() {
    console.log('📄 Carregando carrinho');
    this.state.set('ui.currentView', 'cart');
  }

  async handleCheckoutPage() {
    console.log('📄 Carregando checkout');
    this.state.set('ui.currentView', 'checkout');
  }

  async handleAccountPage() {
    console.log('📄 Carregando conta');
    this.state.set('ui.currentView', 'account');
  }

  async handleNotFound() {
    console.log('📄 Página não encontrada');
    this.state.set('ui.currentView', '404');
  }

  // Métodos utilitários
  toggleGlobalLoading(show) {
    const loader = document.getElementById('global-loading');
    if (loader) {
      loader.classList.toggle('hidden', !show);
    }
  }

  showNotification({ type, message, duration = 3000 }) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    container.appendChild(notification);

    // Auto-remove
    setTimeout(() => {
      notification.remove();
    }, duration);

    // Remove on click
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });
  }

  updateBreadcrumbs(path) {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs = segments.map((segment, index) => ({
      label: this.formatBreadcrumbLabel(segment),
      path: '/' + segments.slice(0, index + 1).join('/')
    }));
    
    this.state.set('navigation.breadcrumbs', breadcrumbs);
  }

  formatBreadcrumbLabel(segment) {
    return segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  // Métodos públicos para integração
  getModule(name) {
    return this.modules.get(name);
  }

  async addToCart(productId, quantity = 1, options = {}) {
    const cartManager = this.getModule('CartManager');
    if (cartManager) {
      return cartManager.addItem(productId, quantity, options);
    }
  }

  async addToWishlist(productId) {
    const wishlistManager = this.getModule('WishlistManager');
    if (wishlistManager) {
      return wishlistManager.addItem(productId);
    }
  }

  async search(query, filters = {}) {
    const searchManager = this.getModule('SearchManager');
    if (searchManager) {
      return searchManager.search(query, filters);
    }
  }

  destroy() {
    console.log('🔄 Destruindo aplicação');
    
    this.modules.forEach(module => {
      if (module.destroy) module.destroy();
    });
    
    this.performance.destroy();
    this.events.clear();
    this.cache.clear();
    
    this.initialized = false;
  }
}

// Instância global da aplicação
const App = new Application();

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

// Export para uso em módulos
export default App;