/**
 * Gerenciador de Páginas de Produtos Individuais
 * Gallery, variantes, reviews, recomendações
 */

import App from '../core/app.js';

class ProductDetailManager {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!this.container) {
      throw new Error('Container do produto não encontrado');
    }

    this.options = {
      // Configurações da galeria
      gallery: {
        thumbnails: true,
        zoom: true,
        fullscreen: true,
        autoplay: false,
        loop: true
      },
      
      // Configurações de variantes
      variants: {
        autoSelect: true,
        showUnavailable: false,
        updateUrl: true
      },
      
      // Configurações de reviews
      reviews: {
        loadMore: true,
        pagination: 10,
        sortBy: 'newest'
      },
      
      // Configurações de recomendações
      recommendations: {
        related: true,
        crossSell: true,
        upsell: true,
        limit: 8
      },
      
      ...options
    };

    this.product = null;
    this.selectedVariant = null;
    this.currentImageIndex = 0;
    this.gallery = null;
    this.zoomLevel = 1;
    this.isZooming = false;
    
    this.init();
  }

  async init() {
    try {
      await this.loadProduct();
      this.setupStructure();
      this.setupEventListeners();
      this.initializeComponents();
      
      App.events.emit('product:detail:ready', {
        product: this.product,
        manager: this
      });
    } catch (error) {
      console.error('Erro ao inicializar produto:', error);
      this.showError(error);
    }
  }

  async loadProduct() {
    const productId = this.getProductId();
    if (!productId) {
      throw new Error('ID do produto não encontrado');
    }

    try {
      App.state.set('ui.isLoading', true);
      
      this.product = await App.api.get(`/products/${productId}`);
      
      if (!this.product) {
        throw new Error('Produto não encontrado');
      }

      // Selecionar variante padrão
      this.selectDefaultVariant();
      
      // Atualizar metadados da página
      this.updatePageMeta();
      
      App.state.set('product.current', this.product);
      App.events.emit('product:loaded', this.product);
      
    } catch (error) {
      throw new Error(`Erro ao carregar produto: ${error.message}`);
    } finally {
      App.state.set('ui.isLoading', false);
    }
  }

  getProductId() {
    // Tentar várias fontes para o ID do produto
    return this.container.dataset.productId ||
           this.options.productId ||
           this.getIdFromUrl();
  }

  getIdFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/\/produto\/([^\/]+)/);
    return match ? match[1] : null;
  }

  selectDefaultVariant() {
    if (!this.product.variants || this.product.variants.length === 0) {
      this.selectedVariant = null;
      return;
    }

    // Tentar selecionar variante da URL
    const urlParams = new URLSearchParams(window.location.search);
    const variantId = urlParams.get('variant');
    
    if (variantId) {
      const variant = this.product.variants.find(v => v.id === variantId);
      if (variant) {
        this.selectedVariant = variant;
        return;
      }
    }

    // Selecionar primeira variante disponível
    this.selectedVariant = this.product.variants.find(v => v.available) || 
                          this.product.variants[0];
  }

  updatePageMeta() {
    document.title = `${this.product.name} - JC Hair Studio's 62`;
    
    // Atualizar meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = this.product.description || this.product.shortDesc;
    }

    // Atualizar Open Graph
    this.updateMetaTag('og:title', this.product.name);
    this.updateMetaTag('og:description', this.product.description || this.product.shortDesc);
    this.updateMetaTag('og:image', this.product.images?.[0]?.url);
    this.updateMetaTag('og:url', window.location.href);
    this.updateMetaTag('og:type', 'product');
    
    // Product specific meta
    this.updateMetaTag('product:price:amount', this.getCurrentPrice());
    this.updateMetaTag('product:price:currency', 'EUR');
    this.updateMetaTag('product:availability', this.isInStock() ? 'in stock' : 'out of stock');
  }

  updateMetaTag(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  setupStructure() {
    this.container.innerHTML = this.generateProductHTML();
    this.bindElements();
  }

  generateProductHTML() {
    return `
      <div class="product-detail">
        <div class="product-gallery-section">
          ${this.generateGalleryHTML()}
        </div>
        
        <div class="product-info-section">
          ${this.generateInfoHTML()}
        </div>
      </div>
      
      <div class="product-tabs">
        ${this.generateTabsHTML()}
      </div>
      
      <div class="product-recommendations">
        ${this.generateRecommendationsHTML()}
      </div>
    `;
  }

  generateGalleryHTML() {
    const images = this.product.images || [];
    
    return `
      <div class="product-gallery">
        <div class="gallery-main">
          <div class="gallery-image-container">
            ${images.map((image, index) => `
              <div class="gallery-image ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img 
                  src="${image.url}" 
                  alt="${image.alt || this.product.name}"
                  data-zoom="${image.zoom || image.url}"
                />
                <button class="gallery-zoom-btn" aria-label="Ampliar imagem">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            `).join('')}
          </div>
          
          ${images.length > 1 ? `
            <div class="gallery-navigation">
              <button class="gallery-nav gallery-prev" aria-label="Imagem anterior">‹</button>
              <button class="gallery-nav gallery-next" aria-label="Próxima imagem">›</button>
            </div>
          ` : ''}
        </div>
        
        ${images.length > 1 ? `
          <div class="gallery-thumbnails">
            ${images.map((image, index) => `
              <button class="gallery-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img src="${image.thumbnail || image.url}" alt="${image.alt || this.product.name}" />
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  generateInfoHTML() {
    return `
      <div class="product-info">
        <div class="product-breadcrumb">
          ${this.generateBreadcrumbHTML()}
        </div>
        
        <h1 class="product-title">${this.product.name}</h1>
        
        <div class="product-rating">
          ${this.generateRatingHTML()}
        </div>
        
        <div class="product-price">
          ${this.generatePriceHTML()}
        </div>
        
        <div class="product-description">
          <p>${this.product.shortDesc || this.product.description}</p>
        </div>
        
        ${this.product.variants && this.product.variants.length > 0 ? `
          <div class="product-variants">
            ${this.generateVariantsHTML()}
          </div>
        ` : ''}
        
        <div class="product-actions">
          ${this.generateActionsHTML()}
        </div>
        
        <div class="product-features">
          ${this.generateFeaturesHTML()}
        </div>
        
        <div class="product-shipping">
          ${this.generateShippingHTML()}
        </div>
      </div>
    `;
  }

  generateBreadcrumbHTML() {
    const breadcrumbs = App.state.get('navigation.breadcrumbs') || [];
    return breadcrumbs.map(crumb => `
      <a href="${crumb.path}" class="breadcrumb-item ${crumb.active ? 'active' : ''}">${crumb.label}</a>
    `).join('<span class="breadcrumb-separator">›</span>');
  }

  generateRatingHTML() {
    const rating = this.product.rating || 0;
    const reviewCount = this.product.reviewCount || 0;
    
    return `
      <div class="rating-display">
        <div class="rating-stars">
          ${Array.from({ length: 5 }, (_, i) => {
            const filled = i < Math.floor(rating);
            const partial = i === Math.floor(rating) && rating % 1 !== 0;
            return `<span class="star ${filled ? 'filled' : ''} ${partial ? 'partial' : ''}"">★</span>`;
          }).join('')}
        </div>
        <span class="rating-value">${rating.toFixed(1)}</span>
        <span class="rating-count">(${reviewCount} avaliações)</span>
      </div>
    `;
  }

  generatePriceHTML() {
    const price = this.getCurrentPrice();
    const comparePrice = this.getCurrentComparePrice();
    const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
    
    return `
      <div class="price-display">
        <span class="price-current">€${price.toFixed(2)}</span>
        ${comparePrice ? `
          <span class="price-compare">€${comparePrice.toFixed(2)}</span>
          <span class="price-discount">-${discount}%</span>
        ` : ''}
      </div>
    `;
  }

  generateVariantsHTML() {
    if (!this.product.variants || this.product.variants.length === 0) return '';

    // Agrupar variantes por tipo (cor, tamanho, etc.)
    const variantGroups = this.groupVariants();
    
    return Object.entries(variantGroups).map(([type, options]) => `
      <div class="variant-group" data-variant-type="${type}">
        <label class="variant-label">${this.formatVariantLabel(type)}</label>
        <div class="variant-options">
          ${options.map(option => `
            <button 
              class="variant-option ${option.selected ? 'selected' : ''} ${!option.available ? 'unavailable' : ''}"
              data-variant-value="${option.value}"
              data-variant-type="${type}"
              ${!option.available ? 'disabled' : ''}
            >
              ${option.label}
            </button>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  generateActionsHTML() {
    const inStock = this.isInStock();
    const quantity = this.selectedVariant?.quantity || this.product.quantity || 0;
    
    return `
      <div class="product-quantity">
        <label for="quantity">Quantidade:</label>
        <div class="quantity-selector">
          <button class="quantity-btn quantity-decrease" aria-label="Diminuir quantidade">-</button>
          <input type="number" id="quantity" value="1" min="1" max="${quantity}" />
          <button class="quantity-btn quantity-increase" aria-label="Aumentar quantidade">+</button>
        </div>
        <span class="stock-info">${quantity} em estoque</span>
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-primary add-to-cart" ${!inStock ? 'disabled' : ''}>
          ${inStock ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
        </button>
        
        <button class="btn btn-secondary add-to-wishlist" aria-label="Adicionar aos favoritos">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" stroke="currentColor" stroke-width="2"/>
          </svg>
          Favoritar
        </button>
        
        <button class="btn btn-outline share-product" aria-label="Compartilhar produto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2"/>
            <circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" stroke-width="2"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" stroke-width="2"/>
          </svg>
          Compartilhar
        </button>
      </div>
    `;
  }

  generateFeaturesHTML() {
    const features = this.product.features || [];
    if (features.length === 0) return '';
    
    return `
      <div class="product-highlights">
        <h3>Características</h3>
        <ul class="features-list">
          ${features.map(feature => `
            <li class="feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              ${feature}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  generateShippingHTML() {
    return `
      <div class="shipping-info">
        <div class="shipping-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M16 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V8L16 3Z" stroke="currentColor" stroke-width="2"/>
            <polyline points="16,3 16,8 21,8" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>Frete grátis acima de €150</span>
        </div>
        
        <div class="shipping-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>Entrega em 3-5 dias úteis</span>
        </div>
        
        <div class="shipping-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2"/>
            <path d="M21 12C21 16.97 16.97 21 12 21S3 16.97 3 12S7.03 3 12 3S21 7.03 21 12Z" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>30 dias para trocas e devoluções</span>
        </div>
      </div>
    `;
  }

  generateTabsHTML() {
    return `
      <div class="tabs-container">
        <div class="tabs-nav">
          <button class="tab-btn active" data-tab="description">Descrição</button>
          <button class="tab-btn" data-tab="specifications">Especificações</button>
          <button class="tab-btn" data-tab="reviews">Avaliações</button>
          <button class="tab-btn" data-tab="shipping">Entrega</button>
        </div>
        
        <div class="tabs-content">
          <div class="tab-panel active" data-tab="description">
            ${this.generateDescriptionHTML()}
          </div>
          
          <div class="tab-panel" data-tab="specifications">
            ${this.generateSpecificationsHTML()}
          </div>
          
          <div class="tab-panel" data-tab="reviews">
            ${this.generateReviewsHTML()}
          </div>
          
          <div class="tab-panel" data-tab="shipping">
            ${this.generateShippingTabHTML()}
          </div>
        </div>
      </div>
    `;
  }

  generateDescriptionHTML() {
    return `
      <div class="product-full-description">
        ${this.product.description || this.product.shortDesc || 'Descrição não disponível.'}
      </div>
    `;
  }

  generateSpecificationsHTML() {
    const specs = this.product.specifications || {};
    
    if (Object.keys(specs).length === 0) {
      return '<p>Especificações não disponíveis.</p>';
    }
    
    return `
      <div class="specifications-table">
        ${Object.entries(specs).map(([key, value]) => `
          <div class="spec-row">
            <div class="spec-label">${this.formatSpecLabel(key)}</div>
            <div class="spec-value">${value}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  generateReviewsHTML() {
    return `
      <div class="reviews-section">
        <div class="reviews-summary">
          ${this.generateRatingHTML()}
        </div>
        
        <div class="reviews-list" id="reviews-list">
          <div class="loading-reviews">Carregando avaliações...</div>
        </div>
        
        <button class="btn btn-outline load-more-reviews">Ver mais avaliações</button>
      </div>
    `;
  }

  generateShippingTabHTML() {
    return `
      <div class="shipping-details">
        <h3>Informações de Entrega</h3>
        <p>Oferecemos várias opções de entrega para sua conveniência:</p>
        
        <div class="shipping-options">
          <div class="shipping-option">
            <h4>Entrega Padrão</h4>
            <p>3-5 dias úteis | €5.99</p>
            <p>Frete grátis para pedidos acima de €150</p>
          </div>
          
          <div class="shipping-option">
            <h4>Entrega Expressa</h4>
            <p>1-2 dias úteis | €12.99</p>
          </div>
        </div>
        
        <h3>Política de Devoluções</h3>
        <p>Você tem 30 dias para trocar ou devolver seu produto, sem perguntas.</p>
      </div>
    `;
  }

  generateRecommendationsHTML() {
    return `
      <div class="recommendations-container">
        <div class="related-products">
          <h2>Produtos Relacionados</h2>
          <div class="products-carousel" id="related-carousel">
            <div class="loading-products">Carregando produtos relacionados...</div>
          </div>
        </div>
      </div>
    `;
  }

  bindElements() {
    // Gallery elements
    this.galleryImages = this.container.querySelectorAll('.gallery-image');
    this.galleryThumbnails = this.container.querySelectorAll('.gallery-thumbnail');
    this.galleryPrev = this.container.querySelector('.gallery-prev');
    this.galleryNext = this.container.querySelector('.gallery-next');
    this.galleryZoomBtns = this.container.querySelectorAll('.gallery-zoom-btn');
    
    // Product elements
    this.quantityInput = this.container.querySelector('#quantity');
    this.quantityDecrease = this.container.querySelector('.quantity-decrease');
    this.quantityIncrease = this.container.querySelector('.quantity-increase');
    this.addToCartBtn = this.container.querySelector('.add-to-cart');
    this.addToWishlistBtn = this.container.querySelector('.add-to-wishlist');
    this.shareBtn = this.container.querySelector('.share-product');
    
    // Variant elements
    this.variantOptions = this.container.querySelectorAll('.variant-option');
    
    // Tab elements
    this.tabBtns = this.container.querySelectorAll('.tab-btn');
    this.tabPanels = this.container.querySelectorAll('.tab-panel');
  }

  setupEventListeners() {
    // Gallery navigation
    this.galleryThumbnails.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this.changeImage(index);
      });
    });

    if (this.galleryPrev) {
      this.galleryPrev.addEventListener('click', () => this.previousImage());
    }

    if (this.galleryNext) {
      this.galleryNext.addEventListener('click', () => this.nextImage());
    }

    // Zoom functionality
    this.galleryZoomBtns.forEach(btn => {
      btn.addEventListener('click', () => this.openImageZoom());
    });

    // Quantity controls
    if (this.quantityDecrease) {
      this.quantityDecrease.addEventListener('click', () => this.decreaseQuantity());
    }

    if (this.quantityIncrease) {
      this.quantityIncrease.addEventListener('click', () => this.increaseQuantity());
    }

    if (this.quantityInput) {
      this.quantityInput.addEventListener('change', () => this.validateQuantity());
    }

    // Product actions
    if (this.addToCartBtn) {
      this.addToCartBtn.addEventListener('click', () => this.addToCart());
    }

    if (this.addToWishlistBtn) {
      this.addToWishlistBtn.addEventListener('click', () => this.addToWishlist());
    }

    if (this.shareBtn) {
      this.shareBtn.addEventListener('click', () => this.shareProduct());
    }

    // Variant selection
    this.variantOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.variantType;
        const value = e.currentTarget.dataset.variantValue;
        this.selectVariant(type, value);
      });
    });

    // Tabs
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  initializeComponents() {
    // Load reviews
    this.loadReviews();
    
    // Load recommendations
    this.loadRecommendations();
    
    // Initialize gallery swipe on mobile
    this.initializeGallerySwipe();
  }

  // Gallery methods
  changeImage(index) {
    if (index < 0 || index >= this.product.images.length) return;
    
    // Update active image
    this.galleryImages.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    
    // Update active thumbnail
    this.galleryThumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
    
    this.currentImageIndex = index;
    
    App.events.emit('product:image:changed', {
      index,
      image: this.product.images[index]
    });
  }

  previousImage() {
    const newIndex = this.currentImageIndex === 0 
      ? this.product.images.length - 1 
      : this.currentImageIndex - 1;
    this.changeImage(newIndex);
  }

  nextImage() {
    const newIndex = this.currentImageIndex === this.product.images.length - 1 
      ? 0 
      : this.currentImageIndex + 1;
    this.changeImage(newIndex);
  }

  openImageZoom() {
    const currentImage = this.product.images[this.currentImageIndex];
    // Implementar modal de zoom/fullscreen
    App.events.emit('product:image:zoom', {
      image: currentImage,
      index: this.currentImageIndex
    });
  }

  initializeGallerySwipe() {
    // Implementar swipe para mobile usando touch events
    let startX = 0;
    let endX = 0;
    
    const galleryMain = this.container.querySelector('.gallery-main');
    if (!galleryMain) return;
    
    galleryMain.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    galleryMain.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextImage();
        } else {
          this.previousImage();
        }
      }
    });
  }

  // Quantity methods
  decreaseQuantity() {
    const current = parseInt(this.quantityInput.value);
    const min = parseInt(this.quantityInput.min) || 1;
    
    if (current > min) {
      this.quantityInput.value = current - 1;
      this.validateQuantity();
    }
  }

  increaseQuantity() {
    const current = parseInt(this.quantityInput.value);
    const max = parseInt(this.quantityInput.max) || Infinity;
    
    if (current < max) {
      this.quantityInput.value = current + 1;
      this.validateQuantity();
    }
  }

  validateQuantity() {
    const value = parseInt(this.quantityInput.value);
    const min = parseInt(this.quantityInput.min) || 1;
    const max = parseInt(this.quantityInput.max) || Infinity;
    
    if (value < min) {
      this.quantityInput.value = min;
    } else if (value > max) {
      this.quantityInput.value = max;
    }
  }

  // Product action methods
  async addToCart() {
    try {
      const quantity = parseInt(this.quantityInput.value);
      const variantId = this.selectedVariant?.id || null;
      
      const result = await App.addToCart(this.product.id, quantity, {
        variantId,
        variant: this.selectedVariant
      });
      
      if (result.success) {
        this.showSuccess('Produto adicionado ao carrinho!');
        App.events.emit('cart:item:added', {
          product: this.product,
          variant: this.selectedVariant,
          quantity
        });
      } else {
        this.showError(result.message || 'Erro ao adicionar ao carrinho');
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      this.showError('Erro ao adicionar ao carrinho');
    }
  }

  async addToWishlist() {
    try {
      const result = await App.addToWishlist(this.product.id);
      
      if (result.success) {
        this.showSuccess('Produto adicionado aos favoritos!');
        this.addToWishlistBtn.classList.add('added');
        App.events.emit('wishlist:item:added', {
          product: this.product
        });
      } else {
        this.showError(result.message || 'Erro ao adicionar aos favoritos');
      }
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      this.showError('Erro ao adicionar aos favoritos');
    }
  }

  async shareProduct() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: this.product.name,
          text: this.product.shortDesc,
          url: window.location.href
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          this.fallbackShare();
        }
      }
    } else {
      this.fallbackShare();
    }
  }

  fallbackShare() {
    // Copiar URL para clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.showSuccess('Link copiado para área de transferência!');
    }).catch(() => {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showSuccess('Link copiado!');
    });
  }

  // Variant methods
  selectVariant(type, value) {
    // Atualizar seleção visual
    this.variantOptions.forEach(option => {
      if (option.dataset.variantType === type) {
        option.classList.toggle('selected', option.dataset.variantValue === value);
      }
    });

    // Encontrar nova variante
    const selectedOptions = this.getSelectedVariantOptions();
    this.selectedVariant = this.findVariantByOptions(selectedOptions);
    
    // Atualizar UI
    this.updateVariantUI();
    
    // Atualizar URL se necessário
    if (this.options.variants.updateUrl) {
      this.updateVariantUrl();
    }

    App.events.emit('product:variant:changed', {
      variant: this.selectedVariant,
      options: selectedOptions
    });
  }

  getSelectedVariantOptions() {
    const options = {};
    this.variantOptions.forEach(option => {
      if (option.classList.contains('selected')) {
        options[option.dataset.variantType] = option.dataset.variantValue;
      }
    });
    return options;
  }

  findVariantByOptions(options) {
    return this.product.variants.find(variant => {
      return Object.entries(options).every(([type, value]) => {
        return variant.options[type] === value;
      });
    });
  }

  updateVariantUI() {
    // Atualizar preço
    const priceElement = this.container.querySelector('.price-display');
    if (priceElement) {
      priceElement.innerHTML = this.generatePriceHTML();
    }

    // Atualizar disponibilidade
    const addToCartBtn = this.addToCartBtn;
    const quantityInput = this.quantityInput;
    const stockInfo = this.container.querySelector('.stock-info');
    
    const inStock = this.isInStock();
    const quantity = this.selectedVariant?.quantity || this.product.quantity || 0;
    
    addToCartBtn.disabled = !inStock;
    addToCartBtn.textContent = inStock ? 'Adicionar ao Carrinho' : 'Fora de Estoque';
    quantityInput.max = quantity;
    
    if (stockInfo) {
      stockInfo.textContent = `${quantity} em estoque`;
    }

    // Atualizar imagens se a variante tiver imagens específicas
    if (this.selectedVariant?.images && this.selectedVariant.images.length > 0) {
      this.updateGalleryImages(this.selectedVariant.images);
    }
  }

  updateGalleryImages(images) {
    // Reconstruir galeria com novas imagens
    const gallerySection = this.container.querySelector('.product-gallery-section');
    gallerySection.innerHTML = this.generateGalleryHTML();
    this.bindGalleryElements();
  }

  updateVariantUrl() {
    const url = new URL(window.location);
    if (this.selectedVariant) {
      url.searchParams.set('variant', this.selectedVariant.id);
    } else {
      url.searchParams.delete('variant');
    }
    window.history.replaceState({}, '', url.toString());
  }

  // Tab methods
  switchTab(tabName) {
    // Update buttons
    this.tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update panels
    this.tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.tab === tabName);
    });

    // Load content if needed
    if (tabName === 'reviews' && !this.reviewsLoaded) {
      this.loadReviews();
    }

    App.events.emit('product:tab:changed', { tab: tabName });
  }

  // Content loading methods
  async loadReviews() {
    try {
      const reviewsList = this.container.querySelector('#reviews-list');
      if (!reviewsList) return;

      const reviews = await App.api.get(`/products/${this.product.id}/reviews`);
      
      reviewsList.innerHTML = reviews.map(review => this.generateReviewHTML(review)).join('');
      this.reviewsLoaded = true;
      
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      const reviewsList = this.container.querySelector('#reviews-list');
      if (reviewsList) {
        reviewsList.innerHTML = '<p>Erro ao carregar avaliações.</p>';
      }
    }
  }

  generateReviewHTML(review) {
    return `
      <div class="review-item">
        <div class="review-header">
          <div class="review-author">${review.author}</div>
          <div class="review-rating">
            ${Array.from({ length: 5 }, (_, i) => 
              `<span class="star ${i < review.rating ? 'filled' : ''}">★</span>`
            ).join('')}
          </div>
          <div class="review-date">${new Date(review.date).toLocaleDateString('pt-BR')}</div>
        </div>
        <div class="review-content">
          <p>${review.content}</p>
        </div>
      </div>
    `;
  }

  async loadRecommendations() {
    try {
      const carousel = this.container.querySelector('#related-carousel');
      if (!carousel) return;

      const related = await App.api.get(`/products/${this.product.id}/related`);
      
      // Usar ProductCarousel para exibir produtos relacionados
      const ProductCarousel = (await import('./ProductCarousel.js')).default;
      
      carousel.innerHTML = related.map(product => this.generateRelatedProductHTML(product)).join('');
      
      new ProductCarousel(carousel, {
        itemsPerView: 4,
        spaceBetween: 20,
        navigation: true,
        loop: false
      });
      
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
    }
  }

  generateRelatedProductHTML(product) {
    return `
      <div class="product-card" data-product-id="${product.id}">
        <a href="/produto/${product.slug}">
          <img src="${product.images[0]?.url}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p class="price">€${product.price.toFixed(2)}</p>
        </a>
      </div>
    `;
  }

  // Utility methods
  getCurrentPrice() {
    return this.selectedVariant?.price || this.product.price || 0;
  }

  getCurrentComparePrice() {
    return this.selectedVariant?.comparePrice || this.product.comparePrice || null;
  }

  isInStock() {
    if (this.selectedVariant) {
      return this.selectedVariant.available && (this.selectedVariant.quantity || 0) > 0;
    }
    return this.product.available && (this.product.quantity || 0) > 0;
  }

  groupVariants() {
    const groups = {};
    
    this.product.variants.forEach(variant => {
      Object.entries(variant.options || {}).forEach(([type, value]) => {
        if (!groups[type]) {
          groups[type] = [];
        }
        
        const existing = groups[type].find(option => option.value === value);
        if (!existing) {
          groups[type].push({
            value,
            label: value,
            available: variant.available,
            selected: this.selectedVariant && 
                     this.selectedVariant.options[type] === value
          });
        } else {
          existing.available = existing.available || variant.available;
        }
      });
    });
    
    return groups;
  }

  formatVariantLabel(type) {
    const labels = {
      'color': 'Cor',
      'size': 'Tamanho',
      'material': 'Material',
      'length': 'Comprimento'
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }

  formatSpecLabel(key) {
    const labels = {
      'brand': 'Marca',
      'material': 'Material',
      'weight': 'Peso',
      'dimensions': 'Dimensões',
      'origin': 'Origem'
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }

  handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowLeft':
        if (event.target.closest('.product-gallery')) {
          event.preventDefault();
          this.previousImage();
        }
        break;
      case 'ArrowRight':
        if (event.target.closest('.product-gallery')) {
          event.preventDefault();
          this.nextImage();
        }
        break;
    }
  }

  showSuccess(message) {
    App.showNotification({
      type: 'success',
      message,
      duration: 3000
    });
  }

  showError(message) {
    App.showNotification({
      type: 'error',
      message,
      duration: 5000
    });
  }

  destroy() {
    // Cleanup event listeners and observers
    // Remove any created elements
    // Clear timers
  }
}

export default ProductDetailManager;