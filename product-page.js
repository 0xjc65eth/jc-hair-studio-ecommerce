// Mari Maria Product Page JavaScript
// Comprehensive interactive functionality for e-commerce product page

class ProductPage {
    constructor() {
        this.currentImageIndex = 0;
        this.thumbnailStartIndex = 0;
        this.maxVisibleThumbnails = 5;
        this.quantity = 1;
        this.selectedColor = 'MM06N';
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCount();
        this.updateWishlistCount();
        this.setupImageGallery();
        this.setupTabs();
        this.setupColorSelection();
        this.setupQuantityControls();
        this.setupShippingCalculator();
        this.setupReviewFilters();
        this.setupCEPMask();
        this.setupScrollEffects();
        this.setupLazyLoading();
    }

    setupEventListeners() {
        // Search functionality
        const searchForm = document.querySelector('.search-form');
        const searchInput = document.querySelector('.search-input');
        
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performSearch(searchInput.value);
            });
        }

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Wishlist buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.wishlist-btn') || e.target.closest('.btn-wishlist')) {
                e.preventDefault();
                this.toggleWishlist();
            }
        });

        // Add to cart button
        const addToCartBtn = document.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', this.addToCart.bind(this));
        }

        // Buy now button
        const buyNowBtn = document.querySelector('.buy-now');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', this.buyNow.bind(this));
        }

        // Modal close functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || 
                e.target.closest('.modal-close')) {
                this.closeModals();
            }
            
            if (e.target.classList.contains('modal-zoom') || 
                e.target.classList.contains('modal-colors')) {
                this.closeModals();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });

        // Scroll to reviews
        const reviewsLink = document.querySelector('.reviews-link');
        if (reviewsLink) {
            reviewsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToReviews();
            });
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
        }

        // Helpful review buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.helpful-btn')) {
                this.handleHelpfulClick(e.target.closest('.helpful-btn'));
            }
        });

        // Load more reviews
        const loadMoreBtn = document.querySelector('.load-more-reviews');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', this.loadMoreReviews.bind(this));
        }
    }

    setupImageGallery() {
        const mainImage = document.querySelector('#main-product-image');
        const thumbnails = document.querySelectorAll('.thumbnail');
        const zoomBtn = document.querySelector('.zoom-btn');
        const prevBtn = document.querySelector('.thumbnail-nav.prev');
        const nextBtn = document.querySelector('.thumbnail-nav.next');

        // Thumbnail navigation
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                this.changeMainImage(index);
            });

            // Keyboard navigation for thumbnails
            thumbnail.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.changeMainImage(index);
                }
            });
        });

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevImage();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextImage();
            });
        }

        // Zoom functionality
        if (zoomBtn) {
            zoomBtn.addEventListener('click', () => {
                this.openImageZoom();
            });
        }

        // Main image click to zoom
        if (mainImage) {
            mainImage.addEventListener('click', () => {
                this.openImageZoom();
            });
        }

        // Keyboard navigation for image gallery
        document.addEventListener('keydown', (e) => {
            const modal = document.querySelector('.modal-zoom.active');
            if (!modal) return;

            if (e.key === 'ArrowLeft') {
                this.prevImage();
            } else if (e.key === 'ArrowRight') {
                this.nextImage();
            }
        });

        // Touch gestures for mobile
        this.setupTouchGestures();
    }

    setupTouchGestures() {
        const mainImageWrapper = document.querySelector('.main-image-wrapper');
        if (!mainImageWrapper) return;

        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        mainImageWrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        mainImageWrapper.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;

            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Check if swipe was horizontal and significant
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.prevImage();
                } else {
                    this.nextImage();
                }
            }
        });
    }

    changeMainImage(index) {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.querySelector('#main-product-image');

        if (!thumbnails[index] || !mainImage) return;

        // Update active thumbnail
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');

        // Change main image
        const newImageSrc = thumbnails[index].dataset.main || thumbnails[index].src;
        mainImage.src = newImageSrc;
        mainImage.alt = thumbnails[index].alt;

        // Add fade effect
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 150);

        this.currentImageIndex = index;
        this.updateThumbnailVisibility();
    }

    prevImage() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const newIndex = this.currentImageIndex > 0 ? 
            this.currentImageIndex - 1 : 
            thumbnails.length - 1;
        this.changeMainImage(newIndex);
    }

    nextImage() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const newIndex = this.currentImageIndex < thumbnails.length - 1 ? 
            this.currentImageIndex + 1 : 
            0;
        this.changeMainImage(newIndex);
    }

    updateThumbnailVisibility() {
        const thumbnailsContainer = document.querySelector('.thumbnails');
        const thumbnails = document.querySelectorAll('.thumbnail');
        
        if (!thumbnailsContainer || thumbnails.length <= this.maxVisibleThumbnails) return;

        const thumbnailWidth = 90; // 80px + 10px gap
        const offset = -this.thumbnailStartIndex * thumbnailWidth;
        thumbnailsContainer.style.transform = `translateX(${offset}px)`;
    }

    openImageZoom() {
        const modal = document.querySelector('.modal-zoom');
        const zoomedImage = document.querySelector('#zoomedImage');
        const mainImage = document.querySelector('#main-product-image');

        if (!modal || !zoomedImage || !mainImage) return;

        zoomedImage.src = mainImage.src;
        zoomedImage.alt = mainImage.alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus management for accessibility
        zoomedImage.focus();
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update active tab panel
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === targetTab) {
                        panel.classList.add('active');
                    }
                });

                // Smooth scroll to tabs section
                document.querySelector('.tabs-container').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });

            // Keyboard navigation for tabs
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const currentIndex = Array.from(tabBtns).indexOf(btn);
                    const nextIndex = e.key === 'ArrowRight' ? 
                        (currentIndex + 1) % tabBtns.length :
                        (currentIndex - 1 + tabBtns.length) % tabBtns.length;
                    
                    tabBtns[nextIndex].click();
                    tabBtns[nextIndex].focus();
                }
            });
        });
    }

    setupColorSelection() {
        const colorSwatches = document.querySelectorAll('.color-swatch');
        const selectedVariationSpan = document.querySelector('.selected-variation');
        const seeAllColorsBtn = document.querySelector('.see-all-colors');

        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                // Update active color
                colorSwatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');

                // Update selected variation text
                this.selectedColor = swatch.dataset.sku;
                if (selectedVariationSpan) {
                    selectedVariationSpan.textContent = swatch.dataset.name;
                }

                // Update product images if different colors have different images
                this.updateProductImagesForColor(this.selectedColor);

                // Update URL without reload
                this.updateURLWithColor(this.selectedColor);
            });

            // Keyboard navigation for color swatches
            swatch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    swatch.click();
                }
            });
        });

        // See all colors modal
        if (seeAllColorsBtn) {
            seeAllColorsBtn.addEventListener('click', () => {
                this.openAllColorsModal();
            });
        }
    }

    updateProductImagesForColor(colorSku) {
        // This would typically fetch different images for different colors
        // For now, we'll just add a subtle effect to show the change
        const mainImage = document.querySelector('#main-product-image');
        if (mainImage) {
            mainImage.style.transform = 'scale(0.98)';
            setTimeout(() => {
                mainImage.style.transform = 'scale(1)';
            }, 200);
        }
    }

    updateURLWithColor(colorSku) {
        const url = new URL(window.location);
        url.searchParams.set('cor', colorSku);
        window.history.replaceState({}, '', url);
    }

    openAllColorsModal() {
        const modal = document.querySelector('.modal-colors');
        if (!modal) return;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Setup color options in modal
        const colorOptions = modal.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                const sku = option.dataset.sku;
                this.selectColorFromModal(sku);
                this.closeModals();
            });
        });
    }

    selectColorFromModal(sku) {
        const colorSwatch = document.querySelector(`[data-sku="${sku}"]`);
        if (colorSwatch) {
            colorSwatch.click();
        }
    }

    setupQuantityControls() {
        const qtyInput = document.querySelector('.qty-input');
        const minusBtn = document.querySelector('.qty-btn.minus');
        const plusBtn = document.querySelector('.qty-btn.plus');

        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                this.updateQuantity(-1);
            });
        }

        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                this.updateQuantity(1);
            });
        }

        if (qtyInput) {
            qtyInput.addEventListener('change', () => {
                const newQty = parseInt(qtyInput.value);
                if (newQty >= 1 && newQty <= 10) {
                    this.quantity = newQty;
                } else {
                    qtyInput.value = this.quantity;
                }
            });

            qtyInput.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.updateQuantity(1);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.updateQuantity(-1);
                }
            });
        }
    }

    updateQuantity(change) {
        const qtyInput = document.querySelector('.qty-input');
        const newQty = this.quantity + change;
        
        if (newQty >= 1 && newQty <= 10) {
            this.quantity = newQty;
            if (qtyInput) {
                qtyInput.value = this.quantity;
            }
        }
    }

    setupShippingCalculator() {
        const cepInput = document.querySelector('.cep-input');
        const calculateBtn = document.querySelector('.calculate-btn');
        const shippingOptions = document.querySelector('.shipping-options');

        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.calculateShipping();
            });
        }

        if (cepInput) {
            cepInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.calculateShipping();
                }
            });
        }
    }

    setupCEPMask() {
        const cepInput = document.querySelector('.cep-input');
        if (!cepInput) return;

        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
        });
    }

    calculateShipping() {
        const cepInput = document.querySelector('.cep-input');
        const shippingOptions = document.querySelector('.shipping-options');
        const calculateBtn = document.querySelector('.calculate-btn');

        if (!cepInput || !shippingOptions || !calculateBtn) return;

        const cep = cepInput.value.replace(/\D/g, '');
        
        if (cep.length !== 8) {
            this.showToast('Por favor, insira um CEP válido', 'error');
            return;
        }

        // Add loading state
        calculateBtn.textContent = 'Calculando...';
        calculateBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.displayShippingOptions();
            shippingOptions.style.display = 'block';
            shippingOptions.classList.add('fade-in');
            
            calculateBtn.textContent = 'Calcular';
            calculateBtn.disabled = false;
        }, 1500);
    }

    displayShippingOptions() {
        // This would typically come from an API
        const options = [
            { name: 'PAC', time: 'até 8 dias úteis', price: 'R$ 12,90' },
            { name: 'SEDEX', time: 'até 3 dias úteis', price: 'R$ 24,90' }
        ];

        const shippingOptions = document.querySelector('.shipping-options');
        if (!shippingOptions) return;

        shippingOptions.innerHTML = options.map(option => `
            <div class="shipping-option">
                <span class="shipping-name">${option.name}</span>
                <span class="shipping-time">${option.time}</span>
                <span class="shipping-price">${option.price}</span>
            </div>
        `).join('');
    }

    setupReviewFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const reviewItems = document.querySelectorAll('.review-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update active filter button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter reviews
                this.filterReviews(filter);
            });
        });
    }

    filterReviews(filter) {
        const reviewItems = document.querySelectorAll('.review-item');
        
        reviewItems.forEach(item => {
            let shouldShow = true;
            
            if (filter === '5') {
                const stars = item.querySelectorAll('.review-rating .fas').length;
                shouldShow = stars === 5;
            } else if (filter === '4') {
                const stars = item.querySelectorAll('.review-rating .fas').length;
                shouldShow = stars === 4;
            } else if (filter === 'with-photos') {
                shouldShow = item.querySelector('.review-photos') !== null;
            }
            
            item.style.display = shouldShow ? 'block' : 'none';
        });
    }

    addToCart() {
        const product = {
            id: `mari-maria-${this.selectedColor}`,
            name: 'Base Cover Up Matte',
            brand: 'Mari Maria Makeup',
            color: this.selectedColor,
            price: 55.90,
            quantity: this.quantity,
            image: document.querySelector('#main-product-image').src
        };

        // Check if product already exists in cart
        const existingIndex = this.cartItems.findIndex(item => 
            item.id === product.id && item.color === product.color
        );

        if (existingIndex >= 0) {
            this.cartItems[existingIndex].quantity += this.quantity;
        } else {
            this.cartItems.push(product);
        }

        this.saveCartToStorage();
        this.updateCartCount();
        this.showToast('Produto adicionado ao carrinho!', 'success');

        // Add visual feedback
        this.animateAddToCart();
    }

    animateAddToCart() {
        const addToCartBtn = document.querySelector('.add-to-cart');
        const cartBtn = document.querySelector('.cart-btn');
        
        if (!addToCartBtn || !cartBtn) return;

        // Create floating animation
        const productImage = document.querySelector('#main-product-image');
        if (productImage) {
            const clone = productImage.cloneNode(true);
            clone.style.position = 'fixed';
            clone.style.width = '50px';
            clone.style.height = '50px';
            clone.style.zIndex = '10000';
            clone.style.pointerEvents = 'none';
            clone.style.borderRadius = '50%';
            clone.style.transition = 'all 0.8s ease-in-out';
            
            const imageRect = productImage.getBoundingClientRect();
            const cartRect = cartBtn.getBoundingClientRect();
            
            clone.style.left = imageRect.left + 'px';
            clone.style.top = imageRect.top + 'px';
            
            document.body.appendChild(clone);
            
            setTimeout(() => {
                clone.style.left = cartRect.left + 'px';
                clone.style.top = cartRect.top + 'px';
                clone.style.transform = 'scale(0)';
                clone.style.opacity = '0';
            }, 100);
            
            setTimeout(() => {
                document.body.removeChild(clone);
            }, 900);
        }

        // Button feedback
        addToCartBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            addToCartBtn.style.transform = 'scale(1)';
        }, 150);
    }

    buyNow() {
        this.addToCart();
        // Redirect to checkout
        setTimeout(() => {
            window.location.href = '/checkout';
        }, 500);
    }

    toggleWishlist() {
        const product = {
            id: `mari-maria-${this.selectedColor}`,
            name: 'Base Cover Up Matte',
            brand: 'Mari Maria Makeup',
            color: this.selectedColor,
            price: 55.90,
            image: document.querySelector('#main-product-image').src
        };

        const existingIndex = this.wishlistItems.findIndex(item => 
            item.id === product.id && item.color === product.color
        );

        const wishlistBtn = document.querySelector('.btn-wishlist i');
        
        if (existingIndex >= 0) {
            this.wishlistItems.splice(existingIndex, 1);
            if (wishlistBtn) {
                wishlistBtn.className = 'far fa-heart';
            }
            this.showToast('Produto removido da lista de desejos', 'info');
        } else {
            this.wishlistItems.push(product);
            if (wishlistBtn) {
                wishlistBtn.className = 'fas fa-heart';
            }
            this.showToast('Produto adicionado à lista de desejos!', 'success');
        }

        this.saveWishlistToStorage();
        this.updateWishlistCount();
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    updateWishlistCount() {
        const wishlistCount = document.querySelector('.wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlistItems.length;
        }
    }

    saveCartToStorage() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    saveWishlistToStorage() {
        localStorage.setItem('wishlistItems', JSON.stringify(this.wishlistItems));
    }

    closeModals() {
        const modals = document.querySelectorAll('.modal-zoom, .modal-colors');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    scrollToReviews() {
        const reviewsSection = document.querySelector('#reviews');
        if (reviewsSection) {
            reviewsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    performSearch(query) {
        if (!query.trim()) return;
        
        // Show loading state
        this.showToast('Pesquisando...', 'info');
        
        // Simulate search redirect
        setTimeout(() => {
            window.location.href = `/busca?q=${encodeURIComponent(query)}`;
        }, 500);
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        const emailInput = e.target.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!this.isValidEmail(email)) {
            this.showToast('Por favor, insira um e-mail válido', 'error');
            return;
        }
        
        // Simulate API call
        this.showToast('Cadastro realizado com sucesso!', 'success');
        emailInput.value = '';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleHelpfulClick(button) {
        const currentText = button.textContent;
        const isHelpful = !button.classList.contains('voted');
        
        button.classList.add('voted');
        button.disabled = true;
        
        if (isHelpful) {
            const match = currentText.match(/\((\d+)\)/);
            const currentCount = match ? parseInt(match[1]) : 0;
            button.textContent = currentText.replace(/\(\d+\)/, `(${currentCount + 1})`);
            this.showToast('Obrigado pela sua avaliação!', 'success');
        }
    }

    loadMoreReviews() {
        const button = document.querySelector('.load-more-reviews');
        if (!button) return;
        
        button.textContent = 'Carregando...';
        button.disabled = true;
        
        // Simulate loading more reviews
        setTimeout(() => {
            this.addMoreReviews();
            button.textContent = 'Carregar mais avaliações';
            button.disabled = false;
        }, 1500);
    }

    addMoreReviews() {
        const reviewsList = document.querySelector('.reviews-list');
        if (!reviewsList) return;
        
        // Sample additional reviews
        const newReviews = [
            {
                name: 'Julia R.',
                avatar: 'J',
                rating: 5,
                date: '28/02/2024',
                title: 'Produto incrível!',
                content: 'Superou minhas expectativas. A cobertura é perfeita e dura o dia inteiro.',
                helpful: 3
            },
            {
                name: 'Fernanda S.',
                avatar: 'F',
                rating: 4,
                date: '25/02/2024',
                title: 'Muito boa',
                content: 'Base de qualidade, apenas gostaria que tivesse mais tons escuros.',
                helpful: 1
            }
        ];
        
        newReviews.forEach(review => {
            const reviewHTML = this.createReviewHTML(review);
            reviewsList.insertAdjacentHTML('beforeend', reviewHTML);
        });
    }

    createReviewHTML(review) {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        return `
            <div class="review-item slide-up">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${review.avatar}</div>
                        <div class="reviewer-details">
                            <span class="reviewer-name">${review.name}</span>
                            <div class="review-rating">
                                ${stars.split('').map(star => 
                                    `<i class="fa${star === '★' ? 's' : 'r'} fa-star"></i>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-content">
                    <h4>${review.title}</h4>
                    <p>${review.content}</p>
                    <div class="review-helpful">
                        <button class="helpful-btn">👍 Útil (${review.helpful})</button>
                    </div>
                </div>
            </div>
        `;
    }

    setupScrollEffects() {
        // Sticky product images on desktop
        const productImages = document.querySelector('.product-images');
        if (productImages && window.innerWidth > 768) {
            this.setupStickyImages();
        }
        
        // Scroll to top button
        this.setupScrollToTop();
        
        // Header scroll effect
        this.setupHeaderScrollEffect();
        
        // Parallax effects
        this.setupParallaxEffects();
    }

    setupStickyImages() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateStickyImages();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
    }

    updateStickyImages() {
        const productImages = document.querySelector('.product-images');
        const productInfo = document.querySelector('.product-info');
        
        if (!productImages || !productInfo) return;
        
        const rect = productImages.getBoundingClientRect();
        const infoRect = productInfo.getBoundingClientRect();
        
        // Add parallax effect when scrolling
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.1;
        
        productImages.style.transform = `translateY(${parallax}px)`;
    }

    setupScrollToTop() {
        // Create scroll to top button
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Voltar ao topo');
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #e91e63;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
        `;
        
        document.body.appendChild(scrollBtn);
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.transform = 'translateY(0)';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.transform = 'translateY(20px)';
            }
        });
        
        // Click handler
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupHeaderScrollEffect() {
        let lastScrollTop = 0;
        const header = document.querySelector('.header');
        
        if (!header) return;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    setupParallaxEffects() {
        const elements = document.querySelectorAll('.product-card, .review-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('slide-up');
                }
            });
        }, {
            threshold: 0.1
        });
        
        elements.forEach(el => observer.observe(el));
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Toast styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
            max-width: 300px;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.toggle('mobile-open');
        }
    }

    // Performance optimization methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductPage();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.classList.add('paused');
    } else {
        document.body.classList.remove('paused');
    }
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Google Analytics integration (example)
function gtag() {
    dataLayer.push(arguments);
}

// Track product view
window.addEventListener('load', () => {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_item', {
            currency: 'BRL',
            value: 55.90,
            items: [{
                item_id: 'MM06N',
                item_name: 'Base Cover Up Matte MM06N',
                item_brand: 'Mari Maria Makeup',
                item_category: 'Maquiagem',
                item_category2: 'Base',
                price: 55.90,
                quantity: 1
            }]
        });
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
    // You could send this to an error tracking service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Skip links navigation
    if (e.key === 'Tab' && e.shiftKey) {
        // Implement skip link functionality
    }
    
    // Focus management for modal dialogs
    if (e.key === 'Tab') {
        const activeModal = document.querySelector('.modal-zoom.active, .modal-colors.active');
        if (activeModal) {
            // Trap focus within modal
            const focusableElements = activeModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length > 0) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }
});

// Touch device detection and optimization
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (isTouchDevice) {
    document.body.classList.add('touch-device');
}

// Dark mode support
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}

// Reduced motion support
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductPage;
}