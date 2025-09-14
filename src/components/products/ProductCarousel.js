/**
 * Carrossel de Produtos Avançado
 * Suporte a touch, lazy loading, e performance otimizada
 */

import App from '../core/app.js';

class ProductCarousel {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!this.container) {
      throw new Error('Container do carrossel não encontrado');
    }

    this.options = {
      // Configurações de layout
      itemsPerView: 4,
      itemsPerViewMobile: 1,
      itemsPerViewTablet: 2,
      spaceBetween: 20,
      centeredSlides: false,
      
      // Configurações de navegação
      navigation: true,
      pagination: true,
      scrollbar: false,
      
      // Configurações de comportamento
      loop: true,
      autoplay: false,
      autoplayDelay: 5000,
      pauseOnHover: true,
      
      // Configurações de touch
      touchEnabled: true,
      swipeThreshold: 50,
      
      // Configurações de performance
      lazyLoading: true,
      preloadImages: 2,
      virtualSlides: false,
      
      // Configurações de animação
      speed: 300,
      effect: 'slide', // slide, fade, cube, coverflow
      
      // Configurações de responsividade
      breakpoints: {
        576: { itemsPerView: 2, spaceBetween: 15 },
        768: { itemsPerView: 3, spaceBetween: 20 },
        992: { itemsPerView: 4, spaceBetween: 25 },
        1200: { itemsPerView: 5, spaceBetween: 30 }
      },
      
      // Callbacks
      onInit: null,
      onSlideChange: null,
      onTransitionEnd: null,
      onTouchStart: null,
      onTouchEnd: null,
      
      ...options
    };

    this.currentIndex = 0;
    this.slides = [];
    this.isTransitioning = false;
    this.autoplayTimer = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.dragDistance = 0;
    this.isTouch = false;
    
    this.observers = {
      resize: null,
      intersection: null,
      mutation: null
    };

    this.init();
  }

  init() {
    this.createStructure();
    this.loadSlides();
    this.setupEventListeners();
    this.setupObservers();
    this.updateLayout();
    
    if (this.options.autoplay) {
      this.startAutoplay();
    }

    if (this.options.onInit) {
      this.options.onInit(this);
    }

    App.events.emit('carousel:init', { carousel: this });
  }

  createStructure() {
    this.container.classList.add('product-carousel');
    
    // Wrapper principal
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'carousel-wrapper';
    
    // Container dos slides
    this.slidesContainer = document.createElement('div');
    this.slidesContainer.className = 'carousel-slides';
    
    // Mover conteúdo existente
    while (this.container.firstChild) {
      this.slidesContainer.appendChild(this.container.firstChild);
    }
    
    this.wrapper.appendChild(this.slidesContainer);
    this.container.appendChild(this.wrapper);

    // Criar navegação
    if (this.options.navigation) {
      this.createNavigation();
    }

    // Criar paginação
    if (this.options.pagination) {
      this.createPagination();
    }

    // Criar scrollbar
    if (this.options.scrollbar) {
      this.createScrollbar();
    }
  }

  createNavigation() {
    this.navigation = {
      prevButton: document.createElement('button'),
      nextButton: document.createElement('button')
    };

    this.navigation.prevButton.className = 'carousel-nav carousel-nav-prev';
    this.navigation.prevButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    this.navigation.prevButton.setAttribute('aria-label', 'Slide anterior');

    this.navigation.nextButton.className = 'carousel-nav carousel-nav-next';
    this.navigation.nextButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    this.navigation.nextButton.setAttribute('aria-label', 'Próximo slide');

    this.container.appendChild(this.navigation.prevButton);
    this.container.appendChild(this.navigation.nextButton);
  }

  createPagination() {
    this.paginationContainer = document.createElement('div');
    this.paginationContainer.className = 'carousel-pagination';
    this.container.appendChild(this.paginationContainer);
  }

  createScrollbar() {
    this.scrollbar = {
      container: document.createElement('div'),
      drag: document.createElement('div')
    };

    this.scrollbar.container.className = 'carousel-scrollbar';
    this.scrollbar.drag.className = 'carousel-scrollbar-drag';
    
    this.scrollbar.container.appendChild(this.scrollbar.drag);
    this.container.appendChild(this.scrollbar.container);
  }

  loadSlides() {
    this.slides = Array.from(this.slidesContainer.children).map((element, index) => {
      element.classList.add('carousel-slide');
      element.dataset.slideIndex = index;
      
      // Configurar lazy loading
      if (this.options.lazyLoading) {
        this.setupLazyLoading(element);
      }

      return {
        element,
        index,
        loaded: !this.options.lazyLoading,
        data: this.extractSlideData(element)
      };
    });

    this.updatePagination();
    this.updateNavigation();
  }

  extractSlideData(element) {
    // Extrair dados do produto do elemento
    const productCard = element.querySelector('[data-product-id]');
    if (productCard) {
      return {
        id: productCard.dataset.productId,
        name: productCard.querySelector('.product-name')?.textContent,
        price: productCard.querySelector('.product-price')?.textContent,
        image: productCard.querySelector('img')?.src
      };
    }
    return {};
  }

  setupLazyLoading(element) {
    const images = element.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.loading = 'lazy';
      img.classList.add('lazy-image');
      
      if (App.lazyLoad) {
        App.lazyLoad.observe(img, {
          type: 'image',
          src: img.dataset.src,
          srcset: img.dataset.srcset
        });
      }
    });
  }

  setupEventListeners() {
    // Navegação
    if (this.navigation) {
      this.navigation.prevButton.addEventListener('click', () => this.slidePrev());
      this.navigation.nextButton.addEventListener('click', () => this.slideNext());
    }

    // Touch events
    if (this.options.touchEnabled) {
      this.setupTouchEvents();
    }

    // Keyboard navigation
    this.container.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Mouse events
    if (this.options.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
      this.container.addEventListener('mouseleave', () => this.resumeAutoplay());
    }

    // Focus events para acessibilidade
    this.container.addEventListener('focusin', () => this.pauseAutoplay());
    this.container.addEventListener('focusout', () => this.resumeAutoplay());
  }

  setupTouchEvents() {
    const events = {
      start: ['touchstart', 'mousedown'],
      move: ['touchmove', 'mousemove'],
      end: ['touchend', 'mouseup']
    };

    events.start.forEach(event => {
      this.slidesContainer.addEventListener(event, this.handleTouchStart.bind(this), { passive: false });
    });

    events.move.forEach(event => {
      this.slidesContainer.addEventListener(event, this.handleTouchMove.bind(this), { passive: false });
    });

    events.end.forEach(event => {
      this.slidesContainer.addEventListener(event, this.handleTouchEnd.bind(this), { passive: true });
    });
  }

  setupObservers() {
    // Resize Observer
    if ('ResizeObserver' in window) {
      this.observers.resize = new ResizeObserver(() => {
        this.updateLayout();
      });
      this.observers.resize.observe(this.container);
    } else {
      window.addEventListener('resize', () => this.updateLayout());
    }

    // Intersection Observer para autoplay
    if ('IntersectionObserver' in window) {
      this.observers.intersection = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.resumeAutoplay();
          } else {
            this.pauseAutoplay();
          }
        });
      }, { threshold: 0.5 });
      
      this.observers.intersection.observe(this.container);
    }

    // Mutation Observer para slides dinâmicos
    if ('MutationObserver' in window) {
      this.observers.mutation = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.target === this.slidesContainer) {
            shouldUpdate = true;
          }
        });
        
        if (shouldUpdate) {
          this.loadSlides();
          this.updateLayout();
        }
      });
      
      this.observers.mutation.observe(this.slidesContainer, {
        childList: true,
        subtree: false
      });
    }
  }

  updateLayout() {
    const containerWidth = this.container.offsetWidth;
    const itemsPerView = this.getItemsPerView();
    const spaceBetween = this.options.spaceBetween;
    
    const slideWidth = (containerWidth - (spaceBetween * (itemsPerView - 1))) / itemsPerView;
    
    this.slides.forEach((slide, index) => {
      const element = slide.element;
      element.style.width = `${slideWidth}px`;
      element.style.marginRight = index < this.slides.length - 1 ? `${spaceBetween}px` : '0';
    });

    this.updateTransform();
    this.updateNavigation();
    this.updateScrollbar();
  }

  getItemsPerView() {
    const width = window.innerWidth;
    
    // Verificar breakpoints
    const breakpointKeys = Object.keys(this.options.breakpoints)
      .map(Number)
      .sort((a, b) => b - a);
    
    for (const breakpoint of breakpointKeys) {
      if (width >= breakpoint) {
        return this.options.breakpoints[breakpoint].itemsPerView || this.options.itemsPerView;
      }
    }
    
    return this.options.itemsPerView;
  }

  updateTransform() {
    if (this.isTransitioning) return;

    const containerWidth = this.container.offsetWidth;
    const itemsPerView = this.getItemsPerView();
    const slideWidth = containerWidth / itemsPerView;
    const offset = -this.currentIndex * slideWidth;

    this.slidesContainer.style.transform = `translateX(${offset}px)`;
    this.slidesContainer.style.transition = `transform ${this.options.speed}ms ease`;
  }

  updatePagination() {
    if (!this.paginationContainer) return;

    this.paginationContainer.innerHTML = '';
    
    const itemsPerView = this.getItemsPerView();
    const totalPages = Math.ceil(this.slides.length / itemsPerView);
    
    for (let i = 0; i < totalPages; i++) {
      const bullet = document.createElement('button');
      bullet.className = 'carousel-pagination-bullet';
      bullet.setAttribute('aria-label', `Ir para slide ${i + 1}`);
      
      if (i === Math.floor(this.currentIndex / itemsPerView)) {
        bullet.classList.add('active');
      }
      
      bullet.addEventListener('click', () => this.slideTo(i * itemsPerView));
      this.paginationContainer.appendChild(bullet);
    }
  }

  updateNavigation() {
    if (!this.navigation) return;

    const itemsPerView = this.getItemsPerView();
    const maxIndex = this.slides.length - itemsPerView;
    
    this.navigation.prevButton.disabled = this.currentIndex <= 0 && !this.options.loop;
    this.navigation.nextButton.disabled = this.currentIndex >= maxIndex && !this.options.loop;
    
    this.navigation.prevButton.classList.toggle('disabled', this.navigation.prevButton.disabled);
    this.navigation.nextButton.classList.toggle('disabled', this.navigation.nextButton.disabled);
  }

  updateScrollbar() {
    if (!this.scrollbar) return;

    const itemsPerView = this.getItemsPerView();
    const progress = this.currentIndex / (this.slides.length - itemsPerView);
    const dragWidth = (itemsPerView / this.slides.length) * 100;
    const dragOffset = progress * (100 - dragWidth);

    this.scrollbar.drag.style.width = `${dragWidth}%`;
    this.scrollbar.drag.style.transform = `translateX(${dragOffset}%)`;
  }

  // Métodos de navegação
  slideNext() {
    const itemsPerView = this.getItemsPerView();
    let nextIndex = this.currentIndex + itemsPerView;
    
    if (nextIndex >= this.slides.length) {
      nextIndex = this.options.loop ? 0 : this.slides.length - itemsPerView;
    }
    
    this.slideTo(nextIndex);
  }

  slidePrev() {
    const itemsPerView = this.getItemsPerView();
    let prevIndex = this.currentIndex - itemsPerView;
    
    if (prevIndex < 0) {
      prevIndex = this.options.loop ? this.slides.length - itemsPerView : 0;
    }
    
    this.slideTo(prevIndex);
  }

  slideTo(index, speed = this.options.speed) {
    if (this.isTransitioning || index === this.currentIndex) return;
    
    const itemsPerView = this.getItemsPerView();
    const maxIndex = this.slides.length - itemsPerView;
    
    // Garantir que o índice está dentro dos limites
    index = Math.max(0, Math.min(index, maxIndex));
    
    this.isTransitioning = true;
    this.currentIndex = index;
    
    // Preload slides próximos
    this.preloadSlides();
    
    this.updateTransform();
    this.updatePagination();
    this.updateNavigation();
    this.updateScrollbar();
    
    if (this.options.onSlideChange) {
      this.options.onSlideChange(this, index);
    }
    
    App.events.emit('carousel:slide', {
      carousel: this,
      index,
      slide: this.slides[index]
    });
    
    setTimeout(() => {
      this.isTransitioning = false;
      
      if (this.options.onTransitionEnd) {
        this.options.onTransitionEnd(this, index);
      }
      
      App.events.emit('carousel:transitionEnd', {
        carousel: this,
        index
      });
    }, speed);
  }

  preloadSlides() {
    const start = Math.max(0, this.currentIndex - this.options.preloadImages);
    const end = Math.min(this.slides.length - 1, this.currentIndex + this.getItemsPerView() + this.options.preloadImages);
    
    for (let i = start; i <= end; i++) {
      const slide = this.slides[i];
      if (slide && !slide.loaded) {
        this.loadSlide(slide);
      }
    }
  }

  loadSlide(slide) {
    const images = slide.element.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        img.removeAttribute('data-srcset');
      }
    });
    
    slide.loaded = true;
  }

  // Autoplay
  startAutoplay() {
    if (!this.options.autoplay) return;
    
    this.autoplayTimer = setInterval(() => {
      this.slideNext();
    }, this.options.autoplayDelay);
  }

  pauseAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  resumeAutoplay() {
    if (this.options.autoplay && !this.autoplayTimer) {
      this.startAutoplay();
    }
  }

  // Touch handling
  handleTouchStart(event) {
    if (this.isTransitioning) return;
    
    this.isTouch = true;
    this.touchStartX = this.getEventX(event);
    this.dragDistance = 0;
    
    this.pauseAutoplay();
    
    if (this.options.onTouchStart) {
      this.options.onTouchStart(event, this);
    }
  }

  handleTouchMove(event) {
    if (!this.isTouch) return;
    
    this.touchEndX = this.getEventX(event);
    this.dragDistance = this.touchEndX - this.touchStartX;
    
    // Aplicar resistência nas bordas
    if (!this.options.loop) {
      const itemsPerView = this.getItemsPerView();
      const maxIndex = this.slides.length - itemsPerView;
      
      if ((this.currentIndex <= 0 && this.dragDistance > 0) ||
          (this.currentIndex >= maxIndex && this.dragDistance < 0)) {
        this.dragDistance *= 0.3; // Resistência
      }
    }
    
    // Aplicar transformação em tempo real
    const containerWidth = this.container.offsetWidth;
    const itemsPerView = this.getItemsPerView();
    const slideWidth = containerWidth / itemsPerView;
    const offset = (-this.currentIndex * slideWidth) + this.dragDistance;
    
    this.slidesContainer.style.transform = `translateX(${offset}px)`;
    this.slidesContainer.style.transition = 'none';
    
    // Prevenir scroll da página em dispositivos móveis
    if (Math.abs(this.dragDistance) > 10) {
      event.preventDefault();
    }
  }

  handleTouchEnd(event) {
    if (!this.isTouch) return;
    
    this.isTouch = false;
    const threshold = this.options.swipeThreshold;
    
    if (Math.abs(this.dragDistance) > threshold) {
      if (this.dragDistance > 0) {
        this.slidePrev();
      } else {
        this.slideNext();
      }
    } else {
      // Voltar à posição original
      this.updateTransform();
    }
    
    this.resumeAutoplay();
    
    if (this.options.onTouchEnd) {
      this.options.onTouchEnd(event, this);
    }
  }

  getEventX(event) {
    return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
  }

  handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.slidePrev();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.slideNext();
        break;
      case 'Home':
        event.preventDefault();
        this.slideTo(0);
        break;
      case 'End':
        event.preventDefault();
        this.slideTo(this.slides.length - this.getItemsPerView());
        break;
    }
  }

  // Métodos públicos para gerenciamento
  addSlide(element, index = -1) {
    if (index >= 0 && index < this.slides.length) {
      this.slidesContainer.insertBefore(element, this.slides[index].element);
    } else {
      this.slidesContainer.appendChild(element);
    }
    // O MutationObserver cuidará da atualização
  }

  removeSlide(index) {
    if (index >= 0 && index < this.slides.length) {
      this.slides[index].element.remove();
      // O MutationObserver cuidará da atualização
    }
  }

  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    this.updateLayout();
    
    if (newOptions.autoplay !== undefined) {
      if (newOptions.autoplay) {
        this.startAutoplay();
      } else {
        this.pauseAutoplay();
      }
    }
  }

  getCurrentSlide() {
    return this.slides[this.currentIndex];
  }

  getSlideCount() {
    return this.slides.length;
  }

  // Cleanup
  destroy() {
    this.pauseAutoplay();
    
    // Remover event listeners
    if (this.navigation) {
      this.navigation.prevButton.removeEventListener('click', () => this.slidePrev());
      this.navigation.nextButton.removeEventListener('click', () => this.slideNext());
    }

    // Disconnect observers
    Object.values(this.observers).forEach(observer => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    });

    // Limpar estrutura
    this.container.innerHTML = '';
    this.container.classList.remove('product-carousel');
    
    App.events.emit('carousel:destroyed', { carousel: this });
  }
}

export default ProductCarousel;