/**
 * Sistema Avançado de Filtros e Categorização
 * Filtros inteligentes, busca facetada e categorização dinâmica
 */

import App from '../core/app.js';

class FilterManager {
  constructor() {
    this.filters = new Map();
    this.activeFilters = new Map();
    this.searchQuery = '';
    this.sortBy = 'relevance';
    this.sortOrder = 'desc';
    this.categories = new Map();
    this.brands = new Set();
    this.priceRange = { min: 0, max: 1000 };
    this.availableFilters = new Map();
    this.facets = new Map();
    
    this.debounceTime = 300;
    this.searchTimeout = null;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadFilterDefinitions();
    this.initializeState();
  }

  setupEventListeners() {
    // Listener para mudanças de estado
    App.events.on('stateChange', this.handleStateChange.bind(this));
    
    // Listener para mudanças de rota
    App.events.on('navigation:changed', this.handleRouteChange.bind(this));
    
    // Listener para produtos carregados
    App.events.on('products:loaded', this.updateAvailableFilters.bind(this));
  }

  loadFilterDefinitions() {
    // Definir tipos de filtros disponíveis
    this.registerFilter('category', {
      type: 'select',
      label: 'Categoria',
      multiple: false,
      options: [],
      priority: 1,
      icon: 'folder'
    });

    this.registerFilter('brand', {
      type: 'checkbox',
      label: 'Marca',
      multiple: true,
      options: [],
      priority: 2,
      icon: 'tag'
    });

    this.registerFilter('price', {
      type: 'range',
      label: 'Preço',
      multiple: false,
      min: 0,
      max: 1000,
      step: 10,
      unit: '€',
      priority: 3,
      icon: 'euro'
    });

    this.registerFilter('color', {
      type: 'color',
      label: 'Cor',
      multiple: true,
      options: [],
      priority: 4,
      icon: 'palette'
    });

    this.registerFilter('size', {
      type: 'checkbox',
      label: 'Tamanho',
      multiple: true,
      options: [],
      priority: 5,
      icon: 'rulers'
    });

    this.registerFilter('material', {
      type: 'checkbox',
      label: 'Material',
      multiple: true,
      options: [],
      priority: 6,
      icon: 'layers'
    });

    this.registerFilter('rating', {
      type: 'rating',
      label: 'Avaliação',
      multiple: false,
      min: 1,
      max: 5,
      priority: 7,
      icon: 'star'
    });

    this.registerFilter('availability', {
      type: 'toggle',
      label: 'Disponibilidade',
      multiple: false,
      options: [
        { value: 'in_stock', label: 'Em estoque' },
        { value: 'pre_order', label: 'Pré-venda' },
        { value: 'out_of_stock', label: 'Fora de estoque' }
      ],
      priority: 8,
      icon: 'package'
    });

    this.registerFilter('features', {
      type: 'checkbox',
      label: 'Características',
      multiple: true,
      options: [],
      priority: 9,
      icon: 'check-circle'
    });

    this.registerFilter('discount', {
      type: 'toggle',
      label: 'Promoção',
      multiple: false,
      options: [
        { value: 'on_sale', label: 'Em promoção' },
        { value: 'clearance', label: 'Liquidação' }
      ],
      priority: 10,
      icon: 'percent'
    });
  }

  initializeState() {
    // Inicializar estado dos filtros
    App.state.set('filters.active', {});
    App.state.set('filters.available', {});
    App.state.set('filters.facets', {});
    App.state.set('search.query', '');
    App.state.set('search.results', []);
    App.state.set('search.suggestions', []);
    App.state.set('sort.by', 'relevance');
    App.state.set('sort.order', 'desc');
  }

  registerFilter(key, config) {
    this.filters.set(key, {
      key,
      ...config,
      enabled: true,
      visible: true
    });
  }

  async applyFilters(filters = null, options = {}) {
    const {
      updateUrl = true,
      silent = false,
      debounce = true
    } = options;

    try {
      // Usar filtros fornecidos ou ativos
      const activeFilters = filters || this.getActiveFilters();
      
      // Debounce para evitar muitas requisições
      if (debounce) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this._executeFiltering(activeFilters, { updateUrl, silent });
        }, this.debounceTime);
        return;
      }

      await this._executeFiltering(activeFilters, { updateUrl, silent });

    } catch (error) {
      console.error('Erro ao aplicar filtros:', error);
      App.events.emit('filters:error', error);
    }
  }

  async _executeFiltering(filters, options = {}) {
    const { updateUrl = true, silent = false } = options;

    try {
      if (!silent) {
        App.state.set('ui.isLoading', true);
      }

      // Construir query para API
      const query = this.buildApiQuery(filters);
      
      // Fazer requisição
      const response = await App.api.get('/products/search', {
        params: query
      });

      const {
        products = [],
        facets = {},
        total = 0,
        pagination = {}
      } = response;

      // Atualizar estado
      App.state.set('products.filtered', products);
      App.state.set('products.total', total);
      App.state.set('products.pagination', pagination);
      App.state.set('filters.facets', facets);
      App.state.set('filters.active', filters);

      // Atualizar filtros disponíveis baseado nos resultados
      this.updateAvailableFilters({ products, facets });

      // Atualizar URL
      if (updateUrl) {
        this.updateUrl(filters);
      }

      // Emitir eventos
      App.events.emit('filters:applied', {
        filters,
        products,
        total,
        facets
      });

      App.events.emit('products:filtered', {
        products,
        total,
        pagination
      });

    } catch (error) {
      console.error('Erro na filtragem:', error);
      App.events.emit('filters:error', error);
    } finally {
      if (!options.silent) {
        App.state.set('ui.isLoading', false);
      }
    }
  }

  buildApiQuery(filters) {
    const query = {};

    // Adicionar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          query[key] = value.join(',');
        } else if (typeof value === 'object' && value.min !== undefined) {
          // Range filter
          query[`${key}_min`] = value.min;
          query[`${key}_max`] = value.max;
        } else {
          query[key] = value;
        }
      }
    });

    // Adicionar busca
    if (this.searchQuery) {
      query.q = this.searchQuery;
    }

    // Adicionar ordenação
    query.sort_by = this.sortBy;
    query.sort_order = this.sortOrder;

    // Adicionar paginação
    const currentPage = App.state.get('products.pagination.currentPage') || 1;
    const itemsPerPage = App.state.get('products.pagination.itemsPerPage') || 24;
    
    query.page = currentPage;
    query.per_page = itemsPerPage;

    return query;
  }

  updateAvailableFilters({ products = [], facets = {} }) {
    // Atualizar opções baseadas nos facets da API
    Object.entries(facets).forEach(([filterKey, facetData]) => {
      const filter = this.filters.get(filterKey);
      if (filter && facetData.options) {
        filter.options = facetData.options.map(option => ({
          value: option.value,
          label: option.label,
          count: option.count,
          enabled: option.count > 0
        }));
      }
    });

    // Atualizar range de preços
    if (facets.price) {
      const priceFilter = this.filters.get('price');
      if (priceFilter) {
        priceFilter.min = facets.price.min || 0;
        priceFilter.max = facets.price.max || 1000;
      }
    }

    // Emitir evento de atualização
    App.events.emit('filters:updated', {
      filters: Object.fromEntries(this.filters),
      facets
    });
  }

  setFilter(key, value, options = {}) {
    const { apply = true } = options;
    
    this.activeFilters.set(key, value);
    
    if (apply) {
      this.applyFilters();
    }

    App.events.emit('filter:changed', { key, value });
  }

  removeFilter(key, options = {}) {
    const { apply = true } = options;
    
    this.activeFilters.delete(key);
    
    if (apply) {
      this.applyFilters();
    }

    App.events.emit('filter:removed', { key });
  }

  clearFilters(options = {}) {
    const { apply = true } = options;
    
    this.activeFilters.clear();
    this.searchQuery = '';
    
    if (apply) {
      this.applyFilters();
    }

    App.events.emit('filters:cleared');
  }

  getActiveFilters() {
    return Object.fromEntries(this.activeFilters);
  }

  getFilter(key) {
    return this.filters.get(key);
  }

  getAllFilters() {
    return Array.from(this.filters.values())
      .sort((a, b) => a.priority - b.priority);
  }

  getVisibleFilters() {
    return this.getAllFilters().filter(filter => filter.visible);
  }

  // Sistema de busca
  async search(query, options = {}) {
    const {
      instant = false,
      suggestions = false,
      filters = null
    } = options;

    this.searchQuery = query;
    App.state.set('search.query', query);

    if (suggestions && query.length >= 2) {
      await this.getSuggestions(query);
    }

    if (instant || query.length >= 3) {
      await this.applyFilters(filters, { debounce: !instant });
    }

    App.events.emit('search:query', { query, options });
  }

  async getSuggestions(query) {
    try {
      const suggestions = await App.api.get('/search/suggestions', {
        params: { q: query, limit: 8 }
      });

      App.state.set('search.suggestions', suggestions);
      App.events.emit('search:suggestions', suggestions);

      return suggestions;
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      return [];
    }
  }

  async getAutoComplete(query) {
    try {
      const results = await App.api.get('/search/autocomplete', {
        params: { q: query, limit: 5 }
      });

      App.events.emit('search:autocomplete', results);
      return results;
    } catch (error) {
      console.error('Erro no autocomplete:', error);
      return [];
    }
  }

  // Sistema de ordenação
  setSorting(sortBy, sortOrder = 'desc', options = {}) {
    const { apply = true } = options;
    
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;

    App.state.set('sort.by', sortBy);
    App.state.set('sort.order', sortOrder);

    if (apply) {
      this.applyFilters();
    }

    App.events.emit('sort:changed', { sortBy, sortOrder });
  }

  getSortOptions() {
    return [
      { value: 'relevance', label: 'Relevância', default: true },
      { value: 'name', label: 'Nome A-Z' },
      { value: 'name', label: 'Nome Z-A', order: 'desc' },
      { value: 'price', label: 'Menor preço' },
      { value: 'price', label: 'Maior preço', order: 'desc' },
      { value: 'rating', label: 'Melhor avaliado', order: 'desc' },
      { value: 'popularity', label: 'Mais popular', order: 'desc' },
      { value: 'newest', label: 'Mais recente', order: 'desc' },
      { value: 'discount', label: 'Maior desconto', order: 'desc' }
    ];
  }

  // Sistema de categorias
  async loadCategories() {
    try {
      const categories = await App.api.get('/categories');
      
      categories.forEach(category => {
        this.categories.set(category.id, category);
      });

      // Atualizar filtro de categorias
      const categoryFilter = this.filters.get('category');
      if (categoryFilter) {
        categoryFilter.options = categories.map(cat => ({
          value: cat.slug,
          label: cat.name,
          count: cat.product_count || 0,
          children: cat.children || []
        }));
      }

      App.state.set('categories.list', categories);
      App.events.emit('categories:loaded', categories);

      return categories;
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      return [];
    }
  }

  getCategoryHierarchy() {
    const categories = Array.from(this.categories.values());
    const hierarchy = [];
    const categoryMap = new Map();

    // Primeiro passo: criar mapa de categorias
    categories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Segundo passo: construir hierarquia
    categories.forEach(cat => {
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        categoryMap.get(cat.parent_id).children.push(categoryMap.get(cat.id));
      } else {
        hierarchy.push(categoryMap.get(cat.id));
      }
    });

    return hierarchy;
  }

  // Filtros salvos
  saveFilterPreset(name, filters = null) {
    const filtersToSave = filters || this.getActiveFilters();
    const preset = {
      name,
      filters: filtersToSave,
      search: this.searchQuery,
      sort: {
        by: this.sortBy,
        order: this.sortOrder
      },
      created: new Date().toISOString()
    };

    const savedPresets = this.getSavedPresets();
    savedPresets[name] = preset;
    
    localStorage.setItem('filterPresets', JSON.stringify(savedPresets));
    
    App.events.emit('filter:preset:saved', preset);
    return preset;
  }

  loadFilterPreset(name) {
    const presets = this.getSavedPresets();
    const preset = presets[name];
    
    if (preset) {
      // Aplicar filtros
      this.activeFilters.clear();
      Object.entries(preset.filters).forEach(([key, value]) => {
        this.activeFilters.set(key, value);
      });
      
      // Aplicar busca
      this.searchQuery = preset.search || '';
      
      // Aplicar ordenação
      this.setSorting(preset.sort.by, preset.sort.order, { apply: false });
      
      // Aplicar filtros
      this.applyFilters();
      
      App.events.emit('filter:preset:loaded', preset);
      return preset;
    }
    
    return null;
  }

  getSavedPresets() {
    try {
      const presets = localStorage.getItem('filterPresets');
      return presets ? JSON.parse(presets) : {};
    } catch (error) {
      console.error('Erro ao carregar presets:', error);
      return {};
    }
  }

  deleteFilterPreset(name) {
    const presets = this.getSavedPresets();
    delete presets[name];
    localStorage.setItem('filterPresets', JSON.stringify(presets));
    
    App.events.emit('filter:preset:deleted', name);
  }

  // URL management
  updateUrl(filters) {
    const url = new URL(window.location);
    const params = url.searchParams;
    
    // Limpar parâmetros existentes
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('filter_') || key === 'q' || key === 'sort' || key === 'page') {
        params.delete(key);
      }
    });

    // Adicionar filtros ativos
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          params.set(`filter_${key}`, value.join(','));
        } else if (typeof value === 'object' && value.min !== undefined) {
          params.set(`filter_${key}`, `${value.min}-${value.max}`);
        } else {
          params.set(`filter_${key}`, value);
        }
      }
    });

    // Adicionar busca
    if (this.searchQuery) {
      params.set('q', this.searchQuery);
    }

    // Adicionar ordenação
    if (this.sortBy !== 'relevance') {
      params.set('sort', `${this.sortBy}-${this.sortOrder}`);
    }

    // Atualizar URL sem recarregar
    window.history.replaceState({}, '', url.toString());
  }

  loadFromUrl() {
    const url = new URL(window.location);
    const params = url.searchParams;

    // Carregar busca
    const query = params.get('q');
    if (query) {
      this.searchQuery = query;
      App.state.set('search.query', query);
    }

    // Carregar ordenação
    const sort = params.get('sort');
    if (sort) {
      const [sortBy, sortOrder] = sort.split('-');
      this.setSorting(sortBy, sortOrder, { apply: false });
    }

    // Carregar filtros
    this.activeFilters.clear();
    Array.from(params.entries()).forEach(([key, value]) => {
      if (key.startsWith('filter_')) {
        const filterKey = key.replace('filter_', '');
        
        if (value.includes('-') && filterKey === 'price') {
          const [min, max] = value.split('-').map(Number);
          this.activeFilters.set(filterKey, { min, max });
        } else if (value.includes(',')) {
          this.activeFilters.set(filterKey, value.split(','));
        } else {
          this.activeFilters.set(filterKey, value);
        }
      }
    });

    // Aplicar filtros
    this.applyFilters(null, { updateUrl: false });
  }

  // Event handlers
  handleStateChange(change) {
    if (change.property === 'products.pagination.currentPage') {
      this.applyFilters();
    }
  }

  handleRouteChange(routeInfo) {
    // Carregar filtros da URL quando a rota mudar
    if (routeInfo.path.includes('/produtos') || routeInfo.path.includes('/busca')) {
      this.loadFromUrl();
    }
  }

  // Métodos utilitários
  getFilterCount() {
    return this.activeFilters.size + (this.searchQuery ? 1 : 0);
  }

  hasActiveFilters() {
    return this.getFilterCount() > 0;
  }

  getFilterSummary() {
    const summary = [];
    
    if (this.searchQuery) {
      summary.push(`Busca: "${this.searchQuery}"`);
    }

    this.activeFilters.forEach((value, key) => {
      const filter = this.filters.get(key);
      if (filter) {
        if (Array.isArray(value)) {
          summary.push(`${filter.label}: ${value.join(', ')}`);
        } else if (typeof value === 'object' && value.min !== undefined) {
          summary.push(`${filter.label}: ${filter.unit || ''}${value.min} - ${filter.unit || ''}${value.max}`);
        } else {
          summary.push(`${filter.label}: ${value}`);
        }
      }
    });

    return summary;
  }

  destroy() {
    clearTimeout(this.searchTimeout);
    this.filters.clear();
    this.activeFilters.clear();
    this.categories.clear();
    this.brands.clear();
    this.facets.clear();
  }
}

export default FilterManager;