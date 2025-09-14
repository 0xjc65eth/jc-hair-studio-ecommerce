/**
 * Sistema de Navegação e Roteamento Avançado
 * Suporte a SPA, SEO, e navegação fluida
 */

import App from '../core/app.js';

class NavigationManager {
  constructor() {
    this.routes = new Map();
    this.middleware = [];
    this.history = [];
    this.currentRoute = null;
    this.transitionDuration = 300;
    this.pageTitle = '';
    this.metaTags = new Map();
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupRoutes();
    this.handleInitialRoute();
  }

  setupEventListeners() {
    // Interceptar cliques em links
    document.addEventListener('click', this.handleLinkClick.bind(this));
    
    // Interceptar mudanças no histórico
    window.addEventListener('popstate', this.handlePopState.bind(this));
    
    // Interceptar submit de formulários
    document.addEventListener('submit', this.handleFormSubmit.bind(this));
  }

  setupRoutes() {
    // Definir todas as rotas da aplicação
    this.addRoute('/', {
      title: 'JC Hair Studio\'s 62 - Extensões Premium',
      component: 'HomePage',
      meta: {
        description: 'Extensões de cabelo premium com qualidade superior',
        keywords: 'extensões, mega hair, cabelo natural, portugal'
      }
    });

    this.addRoute('/produtos', {
      title: 'Produtos - JC Hair Studio\'s 62',
      component: 'ProductsPage',
      meta: {
        description: 'Catálogo completo de produtos capilares premium',
        keywords: 'produtos capilares, progressivas, tratamentos'
      }
    });

    this.addRoute('/produto/:slug', {
      title: 'Produto - JC Hair Studio\'s 62',
      component: 'ProductDetailPage',
      meta: {
        description: 'Detalhes do produto',
        keywords: 'produto, detalhes, comprar'
      },
      beforeEnter: this.validateProductRoute.bind(this)
    });

    this.addRoute('/categoria/:slug', {
      title: 'Categoria - JC Hair Studio\'s 62',
      component: 'CategoryPage',
      meta: {
        description: 'Produtos por categoria',
        keywords: 'categoria, produtos'
      }
    });

    this.addRoute('/carrinho', {
      title: 'Carrinho - JC Hair Studio\'s 62',
      component: 'CartPage',
      meta: {
        description: 'Seus produtos selecionados',
        keywords: 'carrinho, compras'
      }
    });

    this.addRoute('/checkout', {
      title: 'Finalizar Compra - JC Hair Studio\'s 62',
      component: 'CheckoutPage',
      meta: {
        description: 'Finalizar sua compra',
        keywords: 'checkout, pagamento'
      },
      requiresAuth: true
    });

    this.addRoute('/conta', {
      title: 'Minha Conta - JC Hair Studio\'s 62',
      component: 'AccountPage',
      meta: {
        description: 'Gerencie sua conta',
        keywords: 'conta, perfil, pedidos'
      },
      requiresAuth: true
    });

    this.addRoute('/busca', {
      title: 'Busca - JC Hair Studio\'s 62',
      component: 'SearchPage',
      meta: {
        description: 'Resultados da busca',
        keywords: 'busca, pesquisa, produtos'
      }
    });

    // Rota 404
    this.addRoute('*', {
      title: 'Página não encontrada - JC Hair Studio\'s 62',
      component: 'NotFoundPage',
      meta: {
        description: 'Página não encontrada',
        keywords: '404, erro'
      }
    });
  }

  addRoute(path, config) {
    this.routes.set(path, {
      path,
      title: config.title || '',
      component: config.component || null,
      meta: config.meta || {},
      beforeEnter: config.beforeEnter || null,
      requiresAuth: config.requiresAuth || false,
      preload: config.preload || [],
      ...config
    });
  }

  async navigate(path, options = {}) {
    const {
      replace = false,
      silent = false,
      transition = true,
      data = null
    } = options;

    try {
      // Verificar se a rota existe
      const route = this.findRoute(path);
      if (!route) {
        return this.navigate('/404', { replace: true });
      }

      // Executar middleware
      for (const middleware of this.middleware) {
        const result = await middleware(path, route);
        if (result === false) return false;
      }

      // Verificar autenticação
      if (route.requiresAuth && !this.isAuthenticated()) {
        this.saveIntendedRoute(path);
        return this.navigate('/login', { replace: true });
      }

      // Executar beforeEnter
      if (route.beforeEnter) {
        const result = await route.beforeEnter(path, route);
        if (result === false) return false;
      }

      // Iniciar transição
      if (transition && !silent) {
        await this.startPageTransition();
      }

      // Atualizar histórico
      if (!silent) {
        if (replace) {
          window.history.replaceState({ path, data }, '', path);
        } else {
          window.history.pushState({ path, data }, '', path);
        }
      }

      // Atualizar estado
      this.updateCurrentRoute(path, route, data);

      // Carregar página
      await this.loadPage(route, data);

      // Finalizar transição
      if (transition && !silent) {
        await this.endPageTransition();
      }

      // Emitir evento
      App.events.emit('navigation:changed', {
        path,
        route,
        data,
        previous: this.history[this.history.length - 2]
      });

      return true;

    } catch (error) {
      console.error('Erro na navegação:', error);
      App.events.emit('navigation:error', { path, error });
      return false;
    }
  }

  findRoute(path) {
    // Busca exata
    if (this.routes.has(path)) {
      return this.routes.get(path);
    }

    // Busca com parâmetros
    for (const [routePath, route] of this.routes) {
      const params = this.matchRoute(routePath, path);
      if (params !== null) {
        return { ...route, params };
      }
    }

    // Rota 404
    return this.routes.get('*');
  }

  matchRoute(routePath, actualPath) {
    if (routePath === '*') return {};

    const routeParts = routePath.split('/');
    const pathParts = actualPath.split('/');

    if (routeParts.length !== pathParts.length) {
      return null;
    }

    const params = {};
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];

      if (routePart.startsWith(':')) {
        params[routePart.slice(1)] = decodeURIComponent(pathPart);
      } else if (routePart !== pathPart) {
        return null;
      }
    }

    return params;
  }

  async validateProductRoute(path, route) {
    const params = route.params;
    if (!params.slug) return false;

    try {
      // Verificar se o produto existe
      const product = await App.api.get(`/products/slug/${params.slug}`);
      if (!product) return false;

      // Atualizar meta tags dinamicamente
      route.title = `${product.name} - JC Hair Studio's 62`;
      route.meta.description = product.shortDesc || product.description;
      route.meta.keywords = product.tags?.join(', ') || '';
      route.meta.image = product.images?.[0]?.url;

      return true;
    } catch (error) {
      console.error('Erro ao validar produto:', error);
      return false;
    }
  }

  updateCurrentRoute(path, route, data) {
    this.currentRoute = {
      path,
      route,
      data,
      timestamp: Date.now()
    };

    this.history.push(this.currentRoute);

    // Manter apenas os últimos 50 itens no histórico
    if (this.history.length > 50) {
      this.history = this.history.slice(-50);
    }

    // Atualizar estado global
    App.state.set('navigation.currentPath', path);
    App.state.set('navigation.currentRoute', route);
    App.state.set('navigation.routeData', data);
  }

  async loadPage(route, data) {
    try {
      // Atualizar título e meta tags
      this.updatePageMeta(route);

      // Preload de recursos
      if (route.preload && route.preload.length > 0) {
        await this.preloadResources(route.preload);
      }

      // Carregar componente
      if (route.component) {
        await this.loadComponent(route.component, route.params, data);
      }

      // Scroll para o topo (opcional)
      if (!data?.preserveScroll) {
        this.scrollToTop();
      }

      // Atualizar breadcrumbs
      this.updateBreadcrumbs(route);

    } catch (error) {
      console.error('Erro ao carregar página:', error);
      throw error;
    }
  }

  updatePageMeta(route) {
    // Atualizar título
    if (route.title) {
      document.title = route.title;
      this.pageTitle = route.title;
    }

    // Atualizar meta tags
    if (route.meta) {
      Object.entries(route.meta).forEach(([name, content]) => {
        this.updateMetaTag(name, content);
      });
    }

    // Atualizar Open Graph
    if (route.meta.image) {
      this.updateMetaTag('og:image', route.meta.image, 'property');
    }
    if (route.meta.description) {
      this.updateMetaTag('og:description', route.meta.description, 'property');
    }
    this.updateMetaTag('og:title', route.title, 'property');
    this.updateMetaTag('og:url', window.location.href, 'property');
  }

  updateMetaTag(name, content, attr = 'name') {
    let meta = document.querySelector(`meta[${attr}="${name}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
    this.metaTags.set(name, content);
  }

  async preloadResources(resources) {
    const promises = resources.map(resource => {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as || 'fetch';
        
        if (resource.crossorigin) {
          link.crossOrigin = resource.crossorigin;
        }
        
        link.onload = resolve;
        link.onerror = reject;
        
        document.head.appendChild(link);
      });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.warn('Erro no preload de recursos:', error);
    }
  }

  async loadComponent(componentName, params = {}, data = null) {
    try {
      // Simular carregamento de componente
      // Na implementação real, seria algo como:
      // const Component = await import(`../pages/${componentName}.js`);
      
      console.log(`Carregando componente: ${componentName}`, { params, data });
      
      // Emitir evento de componente carregado
      App.events.emit('component:loaded', {
        name: componentName,
        params,
        data
      });

    } catch (error) {
      console.error(`Erro ao carregar componente ${componentName}:`, error);
      throw error;
    }
  }

  async startPageTransition() {
    return new Promise(resolve => {
      const main = document.querySelector('main');
      if (main) {
        main.style.opacity = '0';
        main.style.transform = 'translateY(20px)';
        setTimeout(resolve, this.transitionDuration / 2);
      } else {
        resolve();
      }
    });
  }

  async endPageTransition() {
    return new Promise(resolve => {
      const main = document.querySelector('main');
      if (main) {
        main.style.transition = `opacity ${this.transitionDuration}ms ease, transform ${this.transitionDuration}ms ease`;
        main.style.opacity = '1';
        main.style.transform = 'translateY(0)';
        setTimeout(() => {
          main.style.transition = '';
          resolve();
        }, this.transitionDuration);
      } else {
        resolve();
      }
    });
  }

  updateBreadcrumbs(route) {
    const breadcrumbs = this.generateBreadcrumbs(route.path);
    App.state.set('navigation.breadcrumbs', breadcrumbs);
    
    // Emitir evento para atualizar UI
    App.events.emit('breadcrumbs:updated', breadcrumbs);
  }

  generateBreadcrumbs(path) {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Início', path: '/', active: false }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      breadcrumbs.push({
        label: this.formatBreadcrumbLabel(segment),
        path: currentPath,
        active: isLast
      });
    });

    return breadcrumbs;
  }

  formatBreadcrumbLabel(segment) {
    // Mapear segmentos conhecidos
    const labelMap = {
      'produtos': 'Produtos',
      'produto': 'Produto',
      'categoria': 'Categoria',
      'carrinho': 'Carrinho',
      'checkout': 'Finalizar Compra',
      'conta': 'Minha Conta',
      'busca': 'Busca'
    };

    return labelMap[segment] || segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  scrollToTop(smooth = true) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  handleLinkClick(event) {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    
    // Ignorar links externos
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    // Ignorar links com target="_blank"
    if (link.target === '_blank') {
      return;
    }

    // Ignorar se tem data-external
    if (link.hasAttribute('data-external')) {
      return;
    }

    event.preventDefault();
    this.navigate(href);
  }

  handlePopState(event) {
    const path = window.location.pathname;
    const data = event.state?.data || null;
    
    this.navigate(path, {
      silent: true,
      transition: true,
      data
    });
  }

  handleFormSubmit(event) {
    const form = event.target;
    const action = form.getAttribute('action');
    const method = form.getAttribute('method')?.toLowerCase() || 'get';

    // Apenas interceptar forms GET para busca
    if (method === 'get' && action && !action.startsWith('http')) {
      event.preventDefault();
      
      const formData = new FormData(form);
      const params = new URLSearchParams(formData);
      const url = `${action}?${params.toString()}`;
      
      this.navigate(url);
    }
  }

  handleInitialRoute() {
    const path = window.location.pathname + window.location.search;
    this.navigate(path, {
      silent: true,
      transition: false
    });
  }

  // Métodos utilitários

  addMiddleware(middleware) {
    this.middleware.push(middleware);
  }

  removeMiddleware(middleware) {
    const index = this.middleware.indexOf(middleware);
    if (index > -1) {
      this.middleware.splice(index, 1);
    }
  }

  isAuthenticated() {
    return App.state.get('user.isAuthenticated') || false;
  }

  saveIntendedRoute(path) {
    sessionStorage.setItem('intendedRoute', path);
  }

  getIntendedRoute() {
    const route = sessionStorage.getItem('intendedRoute');
    sessionStorage.removeItem('intendedRoute');
    return route;
  }

  back() {
    if (this.history.length > 1) {
      window.history.back();
    } else {
      this.navigate('/');
    }
  }

  forward() {
    window.history.forward();
  }

  replace(path, data = null) {
    this.navigate(path, { replace: true, data });
  }

  reload() {
    window.location.reload();
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  getHistory() {
    return [...this.history];
  }

  clearHistory() {
    this.history = [];
  }

  // Método para integração com analytics
  trackPageView(path, title) {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: title,
        page_location: window.location.href
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'PageView');
    }

    App.events.emit('analytics:pageview', { path, title });
  }

  // Método para prefetch de rotas
  async prefetch(path) {
    const route = this.findRoute(path);
    if (!route) return;

    if (route.preload && route.preload.length > 0) {
      await this.preloadResources(route.preload);
    }

    if (route.component) {
      // Prefetch do componente
      try {
        // await import(`../pages/${route.component}.js`);
        console.log(`Prefetched: ${route.component}`);
      } catch (error) {
        console.warn(`Erro no prefetch de ${route.component}:`, error);
      }
    }
  }

  destroy() {
    document.removeEventListener('click', this.handleLinkClick);
    window.removeEventListener('popstate', this.handlePopState);
    document.removeEventListener('submit', this.handleFormSubmit);
    
    this.routes.clear();
    this.middleware = [];
    this.history = [];
    this.currentRoute = null;
    this.metaTags.clear();
  }
}

export default NavigationManager;