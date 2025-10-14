/**
 * Advanced Carousel Class
 * Sistema de carrossel avançado para e-commerce com todas as funcionalidades modernas
 * 
 * Funcionalidades:
 * - Carrossel principal com zoom on hover
 * - Miniaturas navegáveis 
 * - Zoom modal em fullscreen
 * - Suporte a vídeos integrados
 * - Indicadores de navegação (dots, arrows)
 * - Touch/swipe para mobile
 * - Lazy loading das imagens
 * - Transições suaves
 * - Auto-play opcional
 * - Indicador de loading
 */

class AdvancedCarousel {
    constructor(container, options = {}) {
        // Validação do container
        if (!container) {
            throw new Error('Container é obrigatório para o AdvancedCarousel');
        }

        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container) {
            throw new Error('Container não encontrado');
        }

        // Configurações padrão
        this.options = {
            autoplay: false,
            autoplaySpeed: 3000,
            enableTouch: true,
            enableZoom: true,
            enableLazyLoad: true,
            enableFullscreen: true,
            enableKeyboard: true,
            transitionDuration: 300,
            preloadNext: 2,
            swipeThreshold: 50,
            zoomScale: 1.05,
            progressBar: true,
            ...options
        };

        // Estado do carrossel
        this.currentIndex = 0;
        this.isAutoplay = this.options.autoplay;
        this.autoplayInterval = null;
        this.progressInterval = null;
        this.autoplaySpeed = this.options.autoplaySpeed;
        this.speedOptions = [1000, 2000, 3000, 5000, 10000];
        this.currentSpeedIndex = this.speedOptions.indexOf(this.autoplaySpeed);
        
        // Touch/Swipe state
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.isDragging = false;
        this.isModalOpen = false;

        // Performance tracking
        this.loadedImages = new Set();
        this.observers = [];

        // Dados das mídias (podem ser passados via options ou definidos posteriormente)
        this.media = options.media || this.getDefaultMedia();

        // Elementos DOM
        this.elements = {};

        // Inicializar
        this.init();
    }

    /**
     * Dados de exemplo para demonstração
     */
    getDefaultMedia() {
        return [
            {
                type: 'image',
                src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop&q=80',
                alt: 'Produto de beleza premium 1',
                lazy: true,
                thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&h=100&fit=crop&q=80'
            },
            {
                type: 'image',
                src: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop&q=80',
                alt: 'Produto de beleza premium 2',
                lazy: true,
                thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop&q=80'
            },
            {
                type: 'image',
                src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop&q=80',
                alt: 'Produto de beleza premium 3',
                lazy: true,
                thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&q=80'
            },
            {
                type: 'video',
                src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                alt: 'Vídeo demonstrativo do produto',
                poster: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop&q=80',
                thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&h=100&fit=crop&q=80'
            },
            {
                type: 'image',
                src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=800&fit=crop&q=80',
                alt: 'Produto de beleza premium 4',
                lazy: true,
                thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&q=80'
            },
            {
                type: 'image',
                src: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&h=800&fit=crop&q=80',
                alt: 'Produto de beleza premium 5',
                lazy: true,
                thumbnail: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=100&h=100&fit=crop&q=80'
            }
        ];
    }

    /**
     * Inicialização do carrossel
     */
    init() {
        try {
            this.createStructure();
            this.cacheElements();
            this.createSlides();
            this.createThumbnails();
            this.createDots();
            this.bindEvents();
            this.updateCarousel();
            
            if (this.options.enableLazyLoad) {
                this.setupLazyLoading();
            }
            
            if (this.isAutoplay) {
                this.startAutoplay();
            }

            // Preload próximas imagens
            this.preloadImages();

            // Emitir evento de inicialização
            this.emit('carousel:init', { carousel: this });

        } catch (error) {
            console.error('Erro ao inicializar o carrossel:', error);
            this.showError('Erro ao carregar o carrossel');
        }
    }

    /**
     * Criar estrutura HTML do carrossel
     */
    createStructure() {
        this.container.innerHTML = `
            <div class="carousel-container">
                <div class="main-carousel" id="mainCarousel">
                    <!-- Loading Overlay -->
                    <div class="loading-overlay" id="loadingOverlay">
                        <div class="loading-spinner"></div>
                    </div>

                    <!-- Autoplay Controls -->
                    <div class="autoplay-controls">
                        <button class="autoplay-btn" id="autoplayBtn" title="Reprodução automática">
                            <span class="icon">▶️</span> Auto
                        </button>
                        <button class="autoplay-btn" id="speedBtn" title="Velocidade da reprodução">
                            ⚡ ${this.autoplaySpeed / 1000}s
                        </button>
                    </div>

                    <!-- Progress Bar -->
                    ${this.options.progressBar ? '<div class="progress-bar" id="progressBar"></div>' : ''}

                    <!-- Carousel Track -->
                    <div class="carousel-track" id="carouselTrack"></div>

                    <!-- Navigation Arrows -->
                    <button class="carousel-nav prev" id="prevBtn" aria-label="Imagem anterior">
                        <span aria-hidden="true">‹</span>
                    </button>
                    <button class="carousel-nav next" id="nextBtn" aria-label="Próxima imagem">
                        <span aria-hidden="true">›</span>
                    </button>

                    <!-- Dots Indicators -->
                    <div class="carousel-dots" id="carouselDots" role="tablist" aria-label="Seletor de imagens"></div>

                    <!-- Touch Indicator -->
                    <div class="touch-indicator" id="touchIndicator" aria-hidden="true">👆</div>
                </div>

                <!-- Thumbnails -->
                <div class="thumbnails-container">
                    <div class="thumbnails-track" id="thumbnailsTrack" role="tablist" aria-label="Miniaturas das imagens"></div>
                </div>
            </div>

            <!-- Fullscreen Modal -->
            <div class="modal" id="fullscreenModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
                <button class="modal-close" id="modalClose" aria-label="Fechar modal">✕</button>
                <button class="modal-nav prev" id="modalPrev" aria-label="Imagem anterior">‹</button>
                <button class="modal-nav next" id="modalNext" aria-label="Próxima imagem">›</button>
                <div class="modal-content" id="modalContent"></div>
                <h2 id="modalTitle" class="sr-only">Visualização em tela cheia</h2>
            </div>
        `;
    }

    /**
     * Cache dos elementos DOM
     */
    cacheElements() {
        const selectors = {
            mainCarousel: '#mainCarousel',
            carouselTrack: '#carouselTrack',
            loadingOverlay: '#loadingOverlay',
            autoplayBtn: '#autoplayBtn',
            speedBtn: '#speedBtn',
            progressBar: '#progressBar',
            prevBtn: '#prevBtn',
            nextBtn: '#nextBtn',
            carouselDots: '#carouselDots',
            touchIndicator: '#touchIndicator',
            thumbnailsTrack: '#thumbnailsTrack',
            fullscreenModal: '#fullscreenModal',
            modalClose: '#modalClose',
            modalPrev: '#modalPrev',
            modalNext: '#modalNext',
            modalContent: '#modalContent'
        };

        for (const [key, selector] of Object.entries(selectors)) {
            this.elements[key] = this.container.querySelector(selector);
        }
    }

    /**
     * Criar slides do carrossel principal
     */
    createSlides() {
        const track = this.elements.carouselTrack;
        track.innerHTML = '';

        this.media.forEach((item, index) => {
            const slide = this.createSlideElement(item, index);
            track.appendChild(slide);
        });
    }

    /**
     * Criar elemento de slide individual
     */
    createSlideElement(item, index) {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.setAttribute('data-index', index);
        slide.setAttribute('role', 'tabpanel');
        slide.setAttribute('aria-label', `${item.alt} - Slide ${index + 1} de ${this.media.length}`);

        if (item.type === 'image') {
            if (item.lazy && index > 2) {
                slide.innerHTML = `
                    <div class="lazy-placeholder" 
                         data-src="${item.src}" 
                         data-alt="${item.alt}"
                         data-index="${index}"></div>
                `;
            } else {
                slide.innerHTML = `
                    <img src="${item.src}" 
                         alt="${item.alt}" 
                         class="slide-image" 
                         loading="lazy"
                         draggable="false">
                `;
            }
        } else if (item.type === 'video') {
            slide.innerHTML = `
                <video class="slide-video" 
                       controls 
                       poster="${item.poster || ''}"
                       preload="metadata"
                       playsinline>
                    <source src="${item.src}" type="video/mp4">
                    <p>Seu navegador não suporta vídeos HTML5.</p>
                </video>
            `;
        }

        // Adicionar evento de clique para fullscreen
        if (this.options.enableFullscreen) {
            slide.addEventListener('click', (e) => {
                if (e.target.tagName !== 'VIDEO') {
                    this.openFullscreen(index);
                }
            });
        }

        return slide;
    }

    /**
     * Criar miniaturas
     */
    createThumbnails() {
        const track = this.elements.thumbnailsTrack;
        track.innerHTML = '';

        this.media.forEach((item, index) => {
            const thumbnail = this.createThumbnailElement(item, index);
            track.appendChild(thumbnail);
        });
    }

    /**
     * Criar elemento de miniatura individual
     */
    createThumbnailElement(item, index) {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        thumbnail.setAttribute('data-index', index);
        thumbnail.setAttribute('role', 'tab');
        thumbnail.setAttribute('aria-label', `Ir para ${item.alt}`);
        thumbnail.setAttribute('tabindex', index === 0 ? '0' : '-1');

        if (item.type === 'image') {
            thumbnail.innerHTML = `
                <img src="${item.thumbnail || item.src}" 
                     alt="${item.alt}" 
                     loading="lazy"
                     draggable="false">
            `;
        } else if (item.type === 'video') {
            thumbnail.innerHTML = `
                <img src="${item.thumbnail || item.poster}" 
                     alt="${item.alt}"
                     loading="lazy"
                     draggable="false">
                <div class="play-icon" aria-hidden="true">▶</div>
            `;
        }

        // Event listeners
        thumbnail.addEventListener('click', () => this.goToSlide(index));
        thumbnail.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.goToSlide(index);
            }
        });

        return thumbnail;
    }

    /**
     * Criar indicadores (dots)
     */
    createDots() {
        const dotsContainer = this.elements.carouselDots;
        dotsContainer.innerHTML = '';

        this.media.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('data-index', index);
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Ir para slide ${index + 1}`);
            dot.setAttribute('tabindex', index === 0 ? '0' : '-1');
            
            dot.addEventListener('click', () => this.goToSlide(index));
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToSlide(index);
                }
            });

            dotsContainer.appendChild(dot);
        });
    }

    /**
     * Vincular eventos
     */
    bindEvents() {
        // Navigation buttons
        this.elements.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.elements.nextBtn?.addEventListener('click', () => this.nextSlide());

        // Autoplay controls
        this.elements.autoplayBtn?.addEventListener('click', () => this.toggleAutoplay());
        this.elements.speedBtn?.addEventListener('click', () => this.changeSpeed());

        // Touch events
        if (this.options.enableTouch) {
            this.bindTouchEvents();
        }

        // Keyboard events
        if (this.options.enableKeyboard) {
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        }

        // Modal events
        this.elements.modalClose?.addEventListener('click', () => this.closeFullscreen());
        this.elements.modalPrev?.addEventListener('click', () => this.prevSlide(true));
        this.elements.modalNext?.addEventListener('click', () => this.nextSlide(true));
        
        // Close modal on click outside
        this.elements.fullscreenModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.fullscreenModal) {
                this.closeFullscreen();
            }
        });

        // Pause autoplay on hover
        this.elements.mainCarousel?.addEventListener('mouseenter', () => {
            if (this.isAutoplay) {
                this.pauseAutoplay();
            }
        });

        this.elements.mainCarousel?.addEventListener('mouseleave', () => {
            if (this.isAutoplay) {
                this.resumeAutoplay();
            }
        });

        // Visibility API para pausar quando a aba não está ativa
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isAutoplay) {
                this.pauseAutoplay();
            } else if (!document.hidden && this.isAutoplay) {
                this.resumeAutoplay();
            }
        });
    }

    /**
     * Vincular eventos de touch/swipe
     */
    bindTouchEvents() {
        const track = this.elements.carouselTrack;

        // Touch Start
        track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.isDragging = true;
            
            if (this.isAutoplay) {
                this.pauseAutoplay();
            }
        }, { passive: true });

        // Touch Move
        track.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;

            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const diffX = this.touchStartX - touchX;
            const diffY = this.touchStartY - touchY;

            // Verificar se é um swipe horizontal (não vertical)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
                e.preventDefault();
                this.showTouchIndicator(diffX > 0 ? 'next' : 'prev');
            }
        }, { passive: false });

        // Touch End
        track.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;

            this.touchEndX = e.changedTouches[0].clientX;
            const diffX = this.touchStartX - this.touchEndX;

            if (Math.abs(diffX) > this.options.swipeThreshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }

            this.isDragging = false;
            this.hideTouchIndicator();

            if (this.isAutoplay) {
                this.resumeAutoplay();
            }
        }, { passive: true });

        // Prevenir scroll durante o swipe
        track.addEventListener('touchforcechange', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    /**
     * Configurar lazy loading
     */
    setupLazyLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            rootMargin: '50px',
            threshold: 0.1
        });

        // Observar placeholders lazy
        const placeholders = this.container.querySelectorAll('.lazy-placeholder');
        placeholders.forEach(placeholder => {
            observer.observe(placeholder);
        });

        this.observers.push(observer);
    }

    /**
     * Carregar imagem lazy
     */
    loadImage(placeholder) {
        const src = placeholder.getAttribute('data-src');
        const alt = placeholder.getAttribute('data-alt');
        const index = placeholder.getAttribute('data-index');
        
        if (!src || this.loadedImages.has(src)) return;

        this.showLoading();

        const img = new Image();
        img.onload = () => {
            img.className = 'slide-image';
            img.alt = alt;
            img.draggable = false;
            placeholder.replaceWith(img);
            this.loadedImages.add(src);
            this.hideLoading();
            this.emit('image:loaded', { src, index });
        };

        img.onerror = () => {
            placeholder.innerHTML = `
                <div class="error-placeholder">
                    <span>❌</span>
                    <p>Erro ao carregar imagem</p>
                </div>
            `;
            this.hideLoading();
            this.emit('image:error', { src, index });
        };

        img.src = src;
    }

    /**
     * Mostrar indicador de touch
     */
    showTouchIndicator(direction) {
        const indicator = this.elements.touchIndicator;
        if (!indicator) return;

        indicator.textContent = direction === 'next' ? '👉' : '👈';
        indicator.classList.add('show');
    }

    /**
     * Esconder indicador de touch
     */
    hideTouchIndicator() {
        const indicator = this.elements.touchIndicator;
        if (!indicator) return;

        indicator.classList.remove('show');
    }

    /**
     * Manipular eventos de teclado
     */
    handleKeyboard(e) {
        // Verificar se o foco está no carrossel
        if (!this.container.contains(document.activeElement) && !this.isModalOpen) {
            return;
        }

        if (this.isModalOpen) {
            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    this.closeFullscreen();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide(true);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide(true);
                    break;
            }
        } else {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleAutoplay();
                    break;
                case 'Enter':
                    if (document.activeElement.classList.contains('thumbnail') || 
                        document.activeElement.classList.contains('carousel-dot')) {
                        e.preventDefault();
                        const index = parseInt(document.activeElement.getAttribute('data-index'));
                        this.goToSlide(index);
                    }
                    break;
            }
        }
    }

    /**
     * Ir para slide específico
     */
    goToSlide(index, isModal = false) {
        if (index < 0 || index >= this.media.length || index === this.currentIndex) {
            return;
        }

        const previousIndex = this.currentIndex;
        this.currentIndex = index;
        
        this.updateCarousel(isModal);
        
        if (!isModal) {
            this.scrollToThumbnail(index);
            this.updateAccessibility();
            
            if (this.isAutoplay) {
                this.resetAutoplay();
            }
            
            // Preload próximas imagens
            this.preloadImages();
        }

        this.emit('slide:change', { 
            previousIndex, 
            currentIndex: this.currentIndex,
            currentMedia: this.media[this.currentIndex]
        });
    }

    /**
     * Próximo slide
     */
    nextSlide(isModal = false) {
        const nextIndex = (this.currentIndex + 1) % this.media.length;
        this.goToSlide(nextIndex, isModal);
    }

    /**
     * Slide anterior
     */
    prevSlide(isModal = false) {
        const prevIndex = (this.currentIndex - 1 + this.media.length) % this.media.length;
        this.goToSlide(prevIndex, isModal);
    }

    /**
     * Atualizar carrossel
     */
    updateCarousel(isModal = false) {
        if (!isModal) {
            this.updateMainCarousel();
        } else {
            this.updateModal();
        }
    }

    /**
     * Atualizar carrossel principal
     */
    updateMainCarousel() {
        // Atualizar slides
        const slides = this.container.querySelectorAll('.carousel-slide');
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            slide.setAttribute('aria-hidden', 'true');
            
            if (index === this.currentIndex) {
                slide.classList.add('active');
                slide.setAttribute('aria-hidden', 'false');
            } else if (index < this.currentIndex) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });

        // Atualizar dots
        const dots = this.container.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
            dot.setAttribute('aria-selected', index === this.currentIndex ? 'true' : 'false');
            dot.setAttribute('tabindex', index === this.currentIndex ? '0' : '-1');
        });

        // Atualizar thumbnails
        const thumbnails = this.container.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === this.currentIndex);
            thumbnail.setAttribute('aria-selected', index === this.currentIndex ? 'true' : 'false');
            thumbnail.setAttribute('tabindex', index === this.currentIndex ? '0' : '-1');
        });
    }

    /**
     * Rolar para miniatura ativa
     */
    scrollToThumbnail(index) {
        const thumbnailsTrack = this.elements.thumbnailsTrack;
        const thumbnail = thumbnailsTrack?.children[index];
        
        if (!thumbnail || !thumbnailsTrack) return;

        const trackRect = thumbnailsTrack.getBoundingClientRect();
        const thumbRect = thumbnail.getBoundingClientRect();
        
        if (thumbRect.right > trackRect.right || thumbRect.left < trackRect.left) {
            thumbnail.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    /**
     * Atualizar acessibilidade
     */
    updateAccessibility() {
        // Atualizar ARIA labels
        const currentMedia = this.media[this.currentIndex];
        const mainCarousel = this.elements.mainCarousel;
        
        if (mainCarousel && currentMedia) {
            mainCarousel.setAttribute('aria-label', 
                `Slide ${this.currentIndex + 1} de ${this.media.length}: ${currentMedia.alt}`
            );
        }
    }

    /**
     * Toggle autoplay
     */
    toggleAutoplay() {
        this.isAutoplay = !this.isAutoplay;
        const btn = this.elements.autoplayBtn;
        
        if (this.isAutoplay) {
            this.startAutoplay();
            if (btn) {
                btn.innerHTML = '<span class="icon">⏸️</span> Auto';
                btn.classList.add('active');
                btn.setAttribute('aria-label', 'Pausar reprodução automática');
            }
        } else {
            this.stopAutoplay();
            if (btn) {
                btn.innerHTML = '<span class="icon">▶️</span> Auto';
                btn.classList.remove('active');
                btn.setAttribute('aria-label', 'Iniciar reprodução automática');
            }
        }

        this.emit('autoplay:toggle', { isAutoplay: this.isAutoplay });
    }

    /**
     * Alterar velocidade do autoplay
     */
    changeSpeed() {
        this.currentSpeedIndex = (this.currentSpeedIndex + 1) % this.speedOptions.length;
        this.autoplaySpeed = this.speedOptions[this.currentSpeedIndex];
        
        const btn = this.elements.speedBtn;
        if (btn) {
            btn.innerHTML = `⚡ ${this.autoplaySpeed / 1000}s`;
            btn.setAttribute('aria-label', `Velocidade: ${this.autoplaySpeed / 1000} segundos`);
        }
        
        if (this.isAutoplay) {
            this.resetAutoplay();
        }

        this.emit('speed:change', { speed: this.autoplaySpeed });
    }

    /**
     * Iniciar autoplay
     */
    startAutoplay() {
        if (this.autoplayInterval) return;
        
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplaySpeed);

        if (this.options.progressBar) {
            this.startProgressBar();
        }

        this.emit('autoplay:start');
    }

    /**
     * Parar autoplay
     */
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
        
        if (this.options.progressBar) {
            this.stopProgressBar();
        }

        this.emit('autoplay:stop');
    }

    /**
     * Pausar autoplay (temporário)
     */
    pauseAutoplay() {
        this.stopAutoplay();
        this.emit('autoplay:pause');
    }

    /**
     * Retomar autoplay
     */
    resumeAutoplay() {
        if (this.isAutoplay) {
            this.startAutoplay();
            this.emit('autoplay:resume');
        }
    }

    /**
     * Resetar autoplay
     */
    resetAutoplay() {
        if (this.isAutoplay) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    }

    /**
     * Iniciar barra de progresso
     */
    startProgressBar() {
        const progressBar = this.elements.progressBar;
        if (!progressBar) return;

        let progress = 0;
        const increment = 100 / (this.autoplaySpeed / 100);

        this.progressInterval = setInterval(() => {
            progress += increment;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
            
            if (progress >= 100) {
                progress = 0;
            }
        }, 100);
    }

    /**
     * Parar barra de progresso
     */
    stopProgressBar() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        
        const progressBar = this.elements.progressBar;
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    }

    /**
     * Abrir modal fullscreen
     */
    openFullscreen(index = this.currentIndex) {
        const modal = this.elements.fullscreenModal;
        if (!modal) return;

        this.isModalOpen = true;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        this.currentIndex = index;
        this.updateModal();

        // Focar no modal para acessibilidade
        modal.focus();

        this.emit('modal:open', { index });
    }

    /**
     * Fechar modal fullscreen
     */
    closeFullscreen() {
        const modal = this.elements.fullscreenModal;
        if (!modal) return;

        this.isModalOpen = false;
        modal.classList.remove('show');
        document.body.style.overflow = '';

        // Retornar foco para o elemento que abriu o modal
        const activeSlide = this.container.querySelector('.carousel-slide.active');
        if (activeSlide) {
            activeSlide.focus();
        }

        this.emit('modal:close');
    }

    /**
     * Atualizar conteúdo do modal
     */
    updateModal() {
        const modalContent = this.elements.modalContent;
        if (!modalContent) return;

        const currentMedia = this.media[this.currentIndex];
        
        if (currentMedia.type === 'image') {
            modalContent.innerHTML = `
                <img src="${currentMedia.src}" 
                     alt="${currentMedia.alt}" 
                     class="modal-image"
                     draggable="false">
            `;
        } else if (currentMedia.type === 'video') {
            modalContent.innerHTML = `
                <video class="modal-video" 
                       controls 
                       autoplay 
                       poster="${currentMedia.poster || ''}"
                       playsinline>
                    <source src="${currentMedia.src}" type="video/mp4">
                    <p>Seu navegador não suporta vídeos HTML5.</p>
                </video>
            `;
        }
    }

    /**
     * Precarregar próximas imagens
     */
    preloadImages() {
        const preloadCount = this.options.preloadNext;
        
        for (let i = 1; i <= preloadCount; i++) {
            const nextIndex = (this.currentIndex + i) % this.media.length;
            const media = this.media[nextIndex];
            
            if (media && media.type === 'image' && !this.loadedImages.has(media.src)) {
                const img = new Image();
                img.onload = () => {
                    this.loadedImages.add(media.src);
                };
                img.src = media.src;
            }
        }
    }

    /**
     * Mostrar indicador de loading
     */
    showLoading() {
        const overlay = this.elements.loadingOverlay;
        if (overlay) {
            overlay.classList.add('show');
        }
    }

    /**
     * Esconder indicador de loading
     */
    hideLoading() {
        const overlay = this.elements.loadingOverlay;
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    /**
     * Mostrar erro
     */
    showError(message) {
        console.error('AdvancedCarousel Error:', message);
        this.emit('error', { message });
    }

    /**
     * Sistema de eventos
     */
    emit(eventName, data = {}) {
        const event = new CustomEvent(`carousel:${eventName}`, {
            detail: { ...data, carousel: this }
        });
        this.container.dispatchEvent(event);
    }

    /**
     * Adicionar listener de evento
     */
    on(eventName, callback) {
        this.container.addEventListener(`carousel:${eventName}`, callback);
    }

    /**
     * Remover listener de evento
     */
    off(eventName, callback) {
        this.container.removeEventListener(`carousel:${eventName}`, callback);
    }

    /**
     * Métodos públicos da API
     */

    /**
     * Adicionar nova mídia
     */
    addMedia(mediaItem, index = -1) {
        if (index === -1) {
            this.media.push(mediaItem);
        } else {
            this.media.splice(index, 0, mediaItem);
        }
        
        this.refresh();
        this.emit('media:add', { mediaItem, index });
    }

    /**
     * Remover mídia
     */
    removeMedia(index) {
        if (index >= 0 && index < this.media.length) {
            const removedMedia = this.media.splice(index, 1)[0];
            
            if (this.currentIndex >= this.media.length) {
                this.currentIndex = Math.max(0, this.media.length - 1);
            }
            
            this.refresh();
            this.emit('media:remove', { removedMedia, index });
        }
    }

    /**
     * Atualizar mídia existente
     */
    updateMedia(index, mediaItem) {
        if (index >= 0 && index < this.media.length) {
            this.media[index] = { ...this.media[index], ...mediaItem };
            this.refresh();
            this.emit('media:update', { mediaItem, index });
        }
    }

    /**
     * Obter estado atual
     */
    getState() {
        return {
            currentIndex: this.currentIndex,
            totalSlides: this.media.length,
            isAutoplay: this.isAutoplay,
            autoplaySpeed: this.autoplaySpeed,
            currentMedia: this.media[this.currentIndex],
            isModalOpen: this.isModalOpen
        };
    }

    /**
     * Definir novas opções
     */
    setOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        
        // Aplicar mudanças que requerem reinicialização
        if (newOptions.media) {
            this.media = newOptions.media;
            this.refresh();
        }
        
        if (newOptions.autoplay !== undefined) {
            this.isAutoplay = newOptions.autoplay;
            if (this.isAutoplay) {
                this.startAutoplay();
            } else {
                this.stopAutoplay();
            }
        }
        
        if (newOptions.autoplaySpeed) {
            this.autoplaySpeed = newOptions.autoplaySpeed;
            if (this.isAutoplay) {
                this.resetAutoplay();
            }
        }

        this.emit('options:update', { options: this.options });
    }

    /**
     * Refresh completo do carrossel
     */
    refresh() {
        this.currentIndex = Math.min(this.currentIndex, this.media.length - 1);
        this.createSlides();
        this.createThumbnails();
        this.createDots();
        this.updateCarousel();
        
        if (this.options.enableLazyLoad) {
            this.setupLazyLoading();
        }
        
        this.preloadImages();
        this.emit('refresh');
    }

    /**
     * Destruir carrossel e limpar recursos
     */
    destroy() {
        // Parar autoplay
        this.stopAutoplay();

        // Limpar observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];

        // Remover event listeners
        // (Os listeners são adicionados aos elementos que serão removidos)

        // Limpar estado
        this.loadedImages.clear();

        // Restaurar body overflow se modal estiver aberto
        if (this.isModalOpen) {
            document.body.style.overflow = '';
        }

        // Limpar HTML
        this.container.innerHTML = '';

        this.emit('destroy');
    }
}

// Exportar para uso global
window.AdvancedCarousel = AdvancedCarousel;

// Auto-inicialização se existir elemento com data-carousel
document.addEventListener('DOMContentLoaded', () => {
    const carouselElements = document.querySelectorAll('[data-carousel]');
    
    carouselElements.forEach(element => {
        const options = element.dataset.carouselOptions ? 
            JSON.parse(element.dataset.carouselOptions) : {};
        
        new AdvancedCarousel(element, options);
    });
});