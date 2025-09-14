/**
 * Sistema Completo de Carrinho e Wishlist
 * Persistência, sincronização e otimizações avançadas
 */

import App from '../core/app.js';

class CartManager {
  constructor() {
    this.cart = {
      id: null,
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      currency: 'EUR',
      coupon: null,
      lastUpdated: null
    };

    this.wishlist = {
      items: [],
      lastUpdated: null
    };

    this.settings = {
      persistence: true,
      syncWithServer: true,
      autoSave: true,
      mergeOnLogin: true,
      maxItems: 100,
      storageKey: 'jc_cart',
      wishlistKey: 'jc_wishlist'
    };

    this.isLoading = false;
    this.isSyncing = false;
    this.syncTimer = null;
    this.saveTimer = null;

    this.init();
  }

  async init() {
    try {
      // Carregar dados persistidos
      await this.loadFromStorage();
      
      // Sincronizar com servidor se logado
      if (this.isUserLoggedIn()) {
        await this.syncWithServer();
      }

      // Configurar auto-save
      this.setupAutoSave();
      
      // Configurar event listeners
      this.setupEventListeners();
      
      // Atualizar estado global
      this.updateGlobalState();
      
      App.events.emit('cart:ready', {
        cart: this.cart,
        wishlist: this.wishlist
      });
      
    } catch (error) {
      console.error('Erro ao inicializar carrinho:', error);
      App.events.emit('cart:error', error);
    }
  }

  setupEventListeners() {
    // Listener para login/logout
    App.events.on('user:login', this.handleUserLogin.bind(this));
    App.events.on('user:logout', this.handleUserLogout.bind(this));
    
    // Listener para sincronização de tabs
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // Listener para online/offline
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Listener para visibilidade da página
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  // =====================================
  // CART MANAGEMENT
  // =====================================

  async addItem(productId, quantity = 1, options = {}) {
    try {
      const {
        variantId = null,
        variant = null,
        customization = {},
        force = false
      } = options;

      // Validar produto
      const product = await this.validateProduct(productId, variantId);
      if (!product) {
        throw new Error('Produto não encontrado');
      }

      // Verificar disponibilidade
      if (!force && !this.checkAvailability(product, quantity)) {
        throw new Error('Produto fora de estoque');
      }

      // Verificar se já existe no carrinho
      const existingItemIndex = this.findExistingItem(productId, variantId, customization);
      
      if (existingItemIndex !== -1) {
        // Atualizar quantidade do item existente
        const existingItem = this.cart.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        return await this.updateItemQuantity(existingItemIndex, newQuantity);
      } else {
        // Adicionar novo item
        const cartItem = this.createCartItem(product, quantity, {
          variantId,
          variant,
          customization
        });

        this.cart.items.push(cartItem);
        await this.recalculate();
        
        App.events.emit('cart:item:added', {
          item: cartItem,
          cart: this.cart
        });

        return {
          success: true,
          item: cartItem,
          message: 'Produto adicionado ao carrinho'
        };
      }
      
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      
      App.events.emit('cart:item:add_failed', {
        productId,
        quantity,
        error: error.message
      });

      return {
        success: false,
        message: error.message
      };
    }
  }

  async removeItem(index) {
    try {
      if (index < 0 || index >= this.cart.items.length) {
        throw new Error('Item não encontrado');
      }

      const removedItem = this.cart.items.splice(index, 1)[0];
      await this.recalculate();
      
      App.events.emit('cart:item:removed', {
        item: removedItem,
        cart: this.cart
      });

      return {
        success: true,
        item: removedItem,
        message: 'Item removido do carrinho'
      };
      
    } catch (error) {
      console.error('Erro ao remover item:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async updateItemQuantity(index, quantity) {
    try {
      if (index < 0 || index >= this.cart.items.length) {
        throw new Error('Item não encontrado');
      }

      if (quantity <= 0) {
        return await this.removeItem(index);
      }

      const item = this.cart.items[index];
      
      // Verificar disponibilidade
      if (!this.checkAvailability(item.product, quantity)) {
        throw new Error('Quantidade não disponível');
      }

      const oldQuantity = item.quantity;
      item.quantity = quantity;
      item.total = item.price * quantity;
      
      await this.recalculate();
      
      App.events.emit('cart:item:updated', {
        item,
        oldQuantity,
        newQuantity: quantity,
        cart: this.cart
      });

      return {
        success: true,
        item,
        message: 'Quantidade atualizada'
      };
      
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async clearCart() {
    try {
      const oldItems = [...this.cart.items];
      this.cart.items = [];
      this.cart.coupon = null;
      
      await this.recalculate();
      
      App.events.emit('cart:cleared', {
        oldItems,
        cart: this.cart
      });

      return {
        success: true,
        message: 'Carrinho limpo'
      };
      
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async applyCoupon(couponCode) {
    try {
      this.isLoading = true;
      
      const coupon = await App.api.post('/cart/coupon', {
        code: couponCode,
        cartTotal: this.cart.subtotal,
        items: this.cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      });

      this.cart.coupon = coupon;
      await this.recalculate();
      
      App.events.emit('cart:coupon:applied', {
        coupon,
        cart: this.cart
      });

      return {
        success: true,
        coupon,
        message: `Cupom aplicado! Desconto de ${coupon.discountType === 'percentage' ? `${coupon.value}%` : `€${coupon.value}`}`
      };
      
    } catch (error) {
      console.error('Erro ao aplicar cupom:', error);
      
      App.events.emit('cart:coupon:failed', {
        code: couponCode,
        error: error.message
      });

      return {
        success: false,
        message: error.message || 'Cupom inválido'
      };
    } finally {
      this.isLoading = false;
    }
  }

  async removeCoupon() {
    try {
      const oldCoupon = this.cart.coupon;
      this.cart.coupon = null;
      
      await this.recalculate();
      
      App.events.emit('cart:coupon:removed', {
        oldCoupon,
        cart: this.cart
      });

      return {
        success: true,
        message: 'Cupom removido'
      };
      
    } catch (error) {
      console.error('Erro ao remover cupom:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // =====================================
  // WISHLIST MANAGEMENT
  // =====================================

  async addToWishlist(productId, options = {}) {
    try {
      // Verificar se já existe
      const existingIndex = this.wishlist.items.findIndex(
        item => item.productId === productId
      );
      
      if (existingIndex !== -1) {
        return {
          success: false,
          message: 'Produto já está nos favoritos'
        };
      }

      // Buscar dados do produto
      const product = await App.api.get(`/products/${productId}`);
      if (!product) {
        throw new Error('Produto não encontrado');
      }

      const wishlistItem = {
        id: this.generateId(),
        productId,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          comparePrice: product.comparePrice,
          image: product.images?.[0]?.url,
          available: product.available
        },
        addedAt: new Date().toISOString(),
        ...options
      };

      this.wishlist.items.push(wishlistItem);
      this.wishlist.lastUpdated = new Date().toISOString();
      
      await this.saveToStorage();
      
      if (this.isUserLoggedIn()) {
        await this.syncWishlistWithServer();
      }
      
      App.events.emit('wishlist:item:added', {
        item: wishlistItem,
        wishlist: this.wishlist
      });

      return {
        success: true,
        item: wishlistItem,
        message: 'Produto adicionado aos favoritos'
      };
      
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      
      App.events.emit('wishlist:item:add_failed', {
        productId,
        error: error.message
      });

      return {
        success: false,
        message: error.message
      };
    }
  }

  async removeFromWishlist(productId) {
    try {
      const index = this.wishlist.items.findIndex(
        item => item.productId === productId
      );
      
      if (index === -1) {
        throw new Error('Item não encontrado nos favoritos');
      }

      const removedItem = this.wishlist.items.splice(index, 1)[0];
      this.wishlist.lastUpdated = new Date().toISOString();
      
      await this.saveToStorage();
      
      if (this.isUserLoggedIn()) {
        await this.syncWishlistWithServer();
      }
      
      App.events.emit('wishlist:item:removed', {
        item: removedItem,
        wishlist: this.wishlist
      });

      return {
        success: true,
        item: removedItem,
        message: 'Item removido dos favoritos'
      };
      
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async moveToCart(productId, quantity = 1) {
    try {
      // Remover da wishlist
      const removeResult = await this.removeFromWishlist(productId);
      if (!removeResult.success) {
        throw new Error(removeResult.message);
      }

      // Adicionar ao carrinho
      const addResult = await this.addItem(productId, quantity);
      if (!addResult.success) {
        // Se falhou, readicionar à wishlist
        await this.addToWishlist(productId);
        throw new Error(addResult.message);
      }

      App.events.emit('wishlist:moved_to_cart', {
        productId,
        quantity,
        cartItem: addResult.item
      });

      return {
        success: true,
        cartItem: addResult.item,
        message: 'Item movido para o carrinho'
      };
      
    } catch (error) {
      console.error('Erro ao mover para carrinho:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // =====================================
  // CALCULATIONS
  // =====================================

  async recalculate() {
    try {
      // Calcular subtotal
      this.cart.subtotal = this.cart.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      // Calcular desconto do cupom
      this.cart.discount = this.calculateCouponDiscount();

      // Calcular impostos
      this.cart.tax = await this.calculateTax();

      // Calcular frete
      this.cart.shipping = await this.calculateShipping();

      // Calcular total
      this.cart.total = Math.max(0, 
        this.cart.subtotal - this.cart.discount + this.cart.tax + this.cart.shipping
      );

      this.cart.lastUpdated = new Date().toISOString();
      
      // Auto-save
      if (this.settings.autoSave) {
        await this.saveToStorage();
      }

      // Sync se logado
      if (this.isUserLoggedIn() && this.settings.syncWithServer) {
        this.scheduleSync();
      }

      this.updateGlobalState();
      
      App.events.emit('cart:recalculated', {
        cart: this.cart
      });
      
    } catch (error) {
      console.error('Erro ao recalcular carrinho:', error);
      App.events.emit('cart:calculation_error', error);
    }
  }

  calculateCouponDiscount() {
    if (!this.cart.coupon) return 0;

    const coupon = this.cart.coupon;
    
    if (coupon.discountType === 'percentage') {
      const discount = (this.cart.subtotal * coupon.value) / 100;
      return Math.min(discount, coupon.maxDiscount || discount);
    } else if (coupon.discountType === 'fixed') {
      return Math.min(coupon.value, this.cart.subtotal);
    }
    
    return 0;
  }

  async calculateTax() {
    // Implementar cálculo de impostos baseado na localização
    try {
      if (this.cart.subtotal === 0) return 0;
      
      const taxInfo = await App.api.get('/cart/tax', {
        params: {
          subtotal: this.cart.subtotal,
          items: this.cart.items.map(item => ({
            productId: item.productId,
            price: item.price,
            quantity: item.quantity
          }))
        }
      });
      
      return taxInfo.amount || 0;
      
    } catch (error) {
      console.warn('Erro ao calcular impostos:', error);
      return 0;
    }
  }

  async calculateShipping() {
    try {
      if (this.cart.subtotal === 0) return 0;
      
      // Frete grátis acima de €150
      if (this.cart.subtotal >= 150) return 0;
      
      const shippingInfo = await App.api.get('/cart/shipping', {
        params: {
          subtotal: this.cart.subtotal,
          items: this.cart.items.map(item => ({
            productId: item.productId,
            weight: item.product.weight || 0,
            quantity: item.quantity
          }))
        }
      });
      
      return shippingInfo.amount || 5.99;
      
    } catch (error) {
      console.warn('Erro ao calcular frete:', error);
      return 5.99; // Frete padrão
    }
  }

  // =====================================
  // PERSISTENCE & SYNC
  // =====================================

  async loadFromStorage() {
    if (!this.settings.persistence) return;

    try {
      // Carregar carrinho
      const cartData = localStorage.getItem(this.settings.storageKey);
      if (cartData) {
        const parsed = JSON.parse(cartData);
        this.cart = { ...this.cart, ...parsed };
      }

      // Carregar wishlist
      const wishlistData = localStorage.getItem(this.settings.wishlistKey);
      if (wishlistData) {
        const parsed = JSON.parse(wishlistData);
        this.wishlist = { ...this.wishlist, ...parsed };
      }

      // Validar items (verificar se produtos ainda existem)
      await this.validateCartItems();
      
    } catch (error) {
      console.error('Erro ao carregar do storage:', error);
      this.resetToDefaults();
    }
  }

  async saveToStorage() {
    if (!this.settings.persistence) return;

    try {
      localStorage.setItem(this.settings.storageKey, JSON.stringify(this.cart));
      localStorage.setItem(this.settings.wishlistKey, JSON.stringify(this.wishlist));
      
      App.events.emit('cart:saved_to_storage', {
        cart: this.cart,
        wishlist: this.wishlist
      });
      
    } catch (error) {
      console.error('Erro ao salvar no storage:', error);
      App.events.emit('cart:save_error', error);
    }
  }

  async syncWithServer() {
    if (!this.isUserLoggedIn() || this.isSyncing) return;

    try {
      this.isSyncing = true;
      
      // Buscar carrinho do servidor
      const serverCart = await App.api.get('/cart');
      const serverWishlist = await App.api.get('/wishlist');
      
      // Fazer merge se necessário
      if (this.settings.mergeOnLogin) {
        await this.mergeWithServerData(serverCart, serverWishlist);
      } else {
        this.cart = { ...this.cart, ...serverCart };
        this.wishlist = { ...this.wishlist, ...serverWishlist };
      }
      
      await this.recalculate();
      await this.saveToStorage();
      
      App.events.emit('cart:synced', {
        cart: this.cart,
        wishlist: this.wishlist
      });
      
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      App.events.emit('cart:sync_error', error);
    } finally {
      this.isSyncing = false;
    }
  }

  async syncCartWithServer() {
    if (!this.isUserLoggedIn()) return;

    try {
      await App.api.put('/cart', {
        items: this.cart.items,
        coupon: this.cart.coupon
      });
      
    } catch (error) {
      console.error('Erro ao sincronizar carrinho:', error);
    }
  }

  async syncWishlistWithServer() {
    if (!this.isUserLoggedIn()) return;

    try {
      await App.api.put('/wishlist', {
        items: this.wishlist.items
      });
      
    } catch (error) {
      console.error('Erro ao sincronizar favoritos:', error);
    }
  }

  async mergeWithServerData(serverCart, serverWishlist) {
    // Merge carrinho
    if (serverCart && serverCart.items) {
      const mergedItems = [...this.cart.items];
      
      serverCart.items.forEach(serverItem => {
        const localIndex = mergedItems.findIndex(localItem => 
          localItem.productId === serverItem.productId &&
          localItem.variantId === serverItem.variantId
        );
        
        if (localIndex !== -1) {
          // Usar maior quantidade
          mergedItems[localIndex].quantity = Math.max(
            mergedItems[localIndex].quantity,
            serverItem.quantity
          );
        } else {
          mergedItems.push(serverItem);
        }
      });
      
      this.cart.items = mergedItems;
    }

    // Merge wishlist
    if (serverWishlist && serverWishlist.items) {
      const mergedWishlist = [...this.wishlist.items];
      
      serverWishlist.items.forEach(serverItem => {
        const exists = mergedWishlist.some(localItem => 
          localItem.productId === serverItem.productId
        );
        
        if (!exists) {
          mergedWishlist.push(serverItem);
        }
      });
      
      this.wishlist.items = mergedWishlist;
    }
  }

  scheduleSync() {
    clearTimeout(this.syncTimer);
    this.syncTimer = setTimeout(() => {
      this.syncCartWithServer();
    }, 2000); // Debounce de 2 segundos
  }

  setupAutoSave() {
    if (!this.settings.autoSave) return;

    // Auto-save a cada 30 segundos se houver mudanças
    setInterval(() => {
      if (this.hasUnsavedChanges()) {
        this.saveToStorage();
      }
    }, 30000);
  }

  // =====================================
  // UTILITY METHODS
  // =====================================

  createCartItem(product, quantity, options = {}) {
    const {
      variantId = null,
      variant = null,
      customization = {}
    } = options;

    const price = variant?.price || product.price;
    const comparePrice = variant?.comparePrice || product.comparePrice;

    return {
      id: this.generateId(),
      productId: product.id,
      variantId,
      quantity,
      price,
      comparePrice,
      total: price * quantity,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0]?.url,
        weight: product.weight || 0
      },
      variant: variant ? {
        id: variant.id,
        options: variant.options,
        sku: variant.sku
      } : null,
      customization,
      addedAt: new Date().toISOString()
    };
  }

  async validateProduct(productId, variantId = null) {
    try {
      const product = await App.api.get(`/products/${productId}`);
      
      if (!product) return null;
      
      if (variantId) {
        const variant = product.variants?.find(v => v.id === variantId);
        if (!variant) return null;
        return { ...product, selectedVariant: variant };
      }
      
      return product;
      
    } catch (error) {
      console.error('Erro ao validar produto:', error);
      return null;
    }
  }

  checkAvailability(product, quantity) {
    if (!product.available) return false;
    
    const stock = product.selectedVariant?.quantity || product.quantity || 0;
    return stock >= quantity;
  }

  findExistingItem(productId, variantId = null, customization = {}) {
    return this.cart.items.findIndex(item => {
      const sameProduct = item.productId === productId;
      const sameVariant = item.variantId === variantId;
      const sameCustomization = JSON.stringify(item.customization) === JSON.stringify(customization);
      
      return sameProduct && sameVariant && sameCustomization;
    });
  }

  async validateCartItems() {
    const validItems = [];
    
    for (const item of this.cart.items) {
      const product = await this.validateProduct(item.productId, item.variantId);
      
      if (product && this.checkAvailability(product, item.quantity)) {
        validItems.push(item);
      } else {
        App.events.emit('cart:item:unavailable', { item });
      }
    }
    
    if (validItems.length !== this.cart.items.length) {
      this.cart.items = validItems;
      await this.recalculate();
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  isUserLoggedIn() {
    return App.state.get('user.isLoggedIn') || false;
  }

  hasUnsavedChanges() {
    // Implementar lógica para detectar mudanças não salvas
    return true; // Placeholder
  }

  updateGlobalState() {
    const itemsCount = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = this.wishlist.items.length;
    
    App.state.set('cart.items', this.cart.items);
    App.state.set('cart.total', this.cart.total);
    App.state.set('cart.itemsCount', itemsCount);
    App.state.set('wishlist.items', this.wishlist.items);
    App.state.set('wishlist.count', wishlistCount);
  }

  resetToDefaults() {
    this.cart = {
      id: null,
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      currency: 'EUR',
      coupon: null,
      lastUpdated: null
    };

    this.wishlist = {
      items: [],
      lastUpdated: null
    };
  }

  // =====================================
  // EVENT HANDLERS
  // =====================================

  async handleUserLogin() {
    if (this.settings.syncWithServer) {
      await this.syncWithServer();
    }
  }

  async handleUserLogout() {
    // Manter dados localmente, mas parar sincronização
    clearTimeout(this.syncTimer);
  }

  handleStorageChange(event) {
    if (event.key === this.settings.storageKey || event.key === this.settings.wishlistKey) {
      // Outro tab atualizou o carrinho
      this.loadFromStorage();
      this.updateGlobalState();
      
      App.events.emit('cart:external_update', {
        key: event.key,
        oldValue: event.oldValue,
        newValue: event.newValue
      });
    }
  }

  handleOnline() {
    if (this.isUserLoggedIn()) {
      this.syncWithServer();
    }
  }

  handleOffline() {
    clearTimeout(this.syncTimer);
  }

  handleVisibilityChange() {
    if (!document.hidden && this.isUserLoggedIn()) {
      // Página ficou visível, sincronizar
      this.syncWithServer();
    }
  }

  // =====================================
  // PUBLIC API
  // =====================================

  getCart() {
    return { ...this.cart };
  }

  getWishlist() {
    return { ...this.wishlist };
  }

  getItemsCount() {
    return this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getWishlistCount() {
    return this.wishlist.items.length;
  }

  isInCart(productId, variantId = null) {
    return this.findExistingItem(productId, variantId) !== -1;
  }

  isInWishlist(productId) {
    return this.wishlist.items.some(item => item.productId === productId);
  }

  getCartSummary() {
    return {
      itemsCount: this.getItemsCount(),
      subtotal: this.cart.subtotal,
      discount: this.cart.discount,
      tax: this.cart.tax,
      shipping: this.cart.shipping,
      total: this.cart.total,
      currency: this.cart.currency,
      hasItems: this.cart.items.length > 0,
      hasCoupon: !!this.cart.coupon
    };
  }

  // Cleanup
  destroy() {
    clearTimeout(this.syncTimer);
    clearTimeout(this.saveTimer);
    
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}

export default CartManager;