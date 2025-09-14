// Global Variables
let currentImageIndex = 0;
let selectedColor = null;
let quantity = 1;
let isWishlisted = false;

// Color Options Data
const colorOptions = [
    { name: 'BR01 - Pele Clara Rosada', color: '#f4c2a1', code: 'BR01' },
    { name: 'BR02 - Pele Clara Neutra', color: '#f0b894', code: 'BR02' },
    { name: 'BR03 - Pele Clara Amarelada', color: '#e8a572', code: 'BR03' },
    { name: 'BR04 - Pele Média Rosada', color: '#d49c6b', code: 'BR04' },
    { name: 'BR05 - Pele Média Neutra', color: '#c8956b', code: 'BR05' },
    { name: 'BR06 - Pele Média Amarelada', color: '#bc8a5f', code: 'BR06' },
    { name: 'BR07 - Pele Morena Clara', color: '#a67c52', color: '#a67c52', code: 'BR07' },
    { name: 'BR08 - Pele Morena Média', color: '#967556', code: 'BR08' },
    { name: 'BR09 - Pele Morena Escura', color: '#8b6f47', code: 'BR09' },
    { name: 'BR10 - Pele Negra Clara', color: '#7a5f3a', code: 'BR10' },
    { name: 'BR11 - Pele Negra Média', color: '#6b5132', code: 'BR11' },
    { name: 'BR12 - Pele Negra Escura', color: '#5c452a', code: 'BR12' }
];

// Product Images
const productImages = [
    'boca-rosa-stick-main.jpg',
    'boca-rosa-stick-2.jpg',
    'boca-rosa-stick-3.jpg',
    'boca-rosa-stick-4.jpg',
    'boca-rosa-stick-5.jpg'
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeColorOptions();
    initializeThumbnails();
    initializeTabs();
    initializeQuantityControls();
    setupImageNavigation();
    setupZipcodeMask();
});

// Initialize Color Options
function initializeColorOptions() {
    const colorGrid = document.getElementById('colorGrid');
    
    colorOptions.forEach((colorOption, index) => {
        const colorElement = document.createElement('div');
        colorElement.className = 'color-option';
        colorElement.style.backgroundColor = colorOption.color;
        colorElement.setAttribute('data-color', colorOption.code);
        colorElement.setAttribute('data-name', colorOption.name);
        colorElement.title = colorOption.name;
        
        colorElement.addEventListener('click', () => selectColor(index));
        
        colorGrid.appendChild(colorElement);
    });
}

// Select Color Function
function selectColor(index) {
    // Remove previous selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked color
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions[index].classList.add('selected');
    
    // Update selected color info
    selectedColor = colorOptions[index].getAttribute('data-color');
    const colorName = colorOptions[index].getAttribute('data-name');
    document.getElementById('selectedColorName').textContent = colorName;
    
    // Enable add to cart button
    document.querySelector('.btn-add-cart').disabled = false;
}

// Initialize Thumbnails
function initializeThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            currentImageIndex = index;
            updateMainImage();
            updateActiveThumbnail();
        });
    });
}

// Update Main Image
function updateMainImage() {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (thumbnails[currentImageIndex]) {
        const newImageSrc = thumbnails[currentImageIndex].getAttribute('data-image');
        mainImage.src = newImageSrc;
        
        // Update zoomed image as well
        document.getElementById('zoomedImage').src = newImageSrc;
    }
}

// Update Active Thumbnail
function updateActiveThumbnail() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach((thumbnail, index) => {
        if (index === currentImageIndex) {
            thumbnail.classList.add('active');
        } else {
            thumbnail.classList.remove('active');
        }
    });
}

// Image Navigation
function setupImageNavigation() {
    // Previous/Next buttons for main image
    window.previousImage = function() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : thumbnails.length - 1;
        updateMainImage();
        updateActiveThumbnail();
    };
    
    window.nextImage = function() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        currentImageIndex = currentImageIndex < thumbnails.length - 1 ? currentImageIndex + 1 : 0;
        updateMainImage();
        updateActiveThumbnail();
    };
}

// Zoom Modal Functions
window.openZoom = function() {
    const modal = document.getElementById('zoomModal');
    const mainImage = document.getElementById('mainProductImage');
    const zoomedImage = document.getElementById('zoomedImage');
    
    zoomedImage.src = mainImage.src;
    modal.style.display = 'block';
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
};

window.closeZoom = function() {
    const modal = document.getElementById('zoomModal');
    modal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
};

window.previousZoomImage = function() {
    previousImage();
};

window.nextZoomImage = function() {
    nextImage();
};

// Close modal when clicking outside
document.getElementById('zoomModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeZoom();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeZoom();
    }
});

// Initialize Tabs
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Initialize Quantity Controls
function initializeQuantityControls() {
    window.changeQuantity = function(delta) {
        const quantityInput = document.getElementById('quantity');
        let newQuantity = parseInt(quantityInput.value) + delta;
        
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > 10) newQuantity = 10;
        
        quantityInput.value = newQuantity;
        quantity = newQuantity;
    };
}

// Add to Cart Function
window.addToCart = function() {
    if (!selectedColor) {
        alert('Por favor, selecione um tom antes de adicionar ao carrinho.');
        return;
    }
    
    // Simulate adding to cart
    const cartCount = document.querySelector('.cart-count');
    const currentCount = parseInt(cartCount.textContent);
    cartCount.textContent = currentCount + quantity;
    
    // Show success message
    showNotification('Produto adicionado ao carrinho!', 'success');
    
    // Animation for cart icon
    const cartIcon = document.querySelector('.cart');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
};

// Buy Now Function
window.buyNow = function() {
    if (!selectedColor) {
        alert('Por favor, selecione um tom antes de finalizar a compra.');
        return;
    }
    
    // Simulate redirect to checkout
    showNotification('Redirecionando para o checkout...', 'info');
    
    setTimeout(() => {
        // In a real application, this would redirect to checkout
        console.log('Redirecting to checkout with:', {
            product: 'Base Multifuncional Boca Rosa - Stick Pele',
            color: selectedColor,
            quantity: quantity,
            price: 79.90
        });
    }, 1000);
};

// Toggle Wishlist Function
window.toggleWishlist = function() {
    const wishlistBtn = document.querySelector('.btn-wishlist');
    const heartIcon = wishlistBtn.querySelector('i');
    
    isWishlisted = !isWishlisted;
    
    if (isWishlisted) {
        wishlistBtn.classList.add('active');
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        showNotification('Produto adicionado à lista de desejos!', 'success');
    } else {
        wishlistBtn.classList.remove('active');
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        showNotification('Produto removido da lista de desejos!', 'info');
    }
};

// Setup Zipcode Mask
function setupZipcodeMask() {
    const zipcodeInput = document.getElementById('zipcode');
    
    zipcodeInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 8) {
            if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        }
    });
}

// Calculate Shipping Function
window.calculateShipping = function() {
    const zipcodeInput = document.getElementById('zipcode');
    const zipcode = zipcodeInput.value.replace(/\D/g, '');
    const resultsContainer = document.getElementById('shippingResults');
    
    if (zipcode.length !== 8) {
        alert('Por favor, digite um CEP válido.');
        return;
    }
    
    // Show loading
    resultsContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Calculando frete...</div>';
    resultsContainer.classList.add('show');
    
    // Simulate API call
    setTimeout(() => {
        const shippingOptions = [
            {
                name: 'PAC',
                price: 'R$ 12,90',
                days: '5 a 7 dias úteis',
                icon: 'fas fa-truck'
            },
            {
                name: 'SEDEX',
                price: 'R$ 24,90',
                days: '1 a 2 dias úteis',
                icon: 'fas fa-shipping-fast'
            },
            {
                name: 'Expressa',
                price: 'R$ 35,90',
                days: 'Até 1 dia útil',
                icon: 'fas fa-bolt'
            }
        ];
        
        let html = '';
        shippingOptions.forEach(option => {
            html += `
                <div class="shipping-option">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="${option.icon}" style="color: #ff6b9d;"></i>
                        <div>
                            <div style="font-weight: 600;">${option.name}</div>
                            <div style="font-size: 12px; color: #666;">${option.days}</div>
                        </div>
                    </div>
                    <div style="font-weight: 600; color: #333;">${option.price}</div>
                </div>
            `;
        });
        
        resultsContainer.innerHTML = html;
    }, 1500);
};

// Show Notification Function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    `;
    
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Header Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.header-search input');
    const searchButton = document.querySelector('.header-search button');
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            showNotification(`Buscando por: "${query}"`, 'info');
            // In a real application, this would trigger a search
            console.log('Searching for:', query);
        }
    }
    
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Product image hover effect
document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.querySelector('.main-image img');
    
    if (mainImage) {
        mainImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        mainImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
});

// Sticky header effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
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
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
});

// Form validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            input.style.borderColor = '#e0e0e0';
        }
    });
    
    return isValid;
}

// Local storage for wishlist and cart
const StorageManager = {
    setItem: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('LocalStorage is not available');
        }
    },
    
    getItem: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn('Error reading from LocalStorage');
            return null;
        }
    },
    
    removeItem: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Error removing from LocalStorage');
        }
    }
};

// Initialize from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load cart count
    const savedCartCount = StorageManager.getItem('cartCount');
    if (savedCartCount) {
        document.querySelector('.cart-count').textContent = savedCartCount;
    }
    
    // Load wishlist status
    const savedWishlist = StorageManager.getItem('wishlist') || [];
    const productId = 'boca-rosa-stick-pele'; // This would come from the product data
    isWishlisted = savedWishlist.includes(productId);
    
    if (isWishlisted) {
        const wishlistBtn = document.querySelector('.btn-wishlist');
        const heartIcon = wishlistBtn.querySelector('i');
        wishlistBtn.classList.add('active');
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
    }
});

// Update localStorage when cart/wishlist changes
function updateCartStorage() {
    const cartCount = document.querySelector('.cart-count').textContent;
    StorageManager.setItem('cartCount', cartCount);
}

function updateWishlistStorage() {
    const savedWishlist = StorageManager.getItem('wishlist') || [];
    const productId = 'boca-rosa-stick-pele';
    
    if (isWishlisted && !savedWishlist.includes(productId)) {
        savedWishlist.push(productId);
    } else if (!isWishlisted && savedWishlist.includes(productId)) {
        const index = savedWishlist.indexOf(productId);
        savedWishlist.splice(index, 1);
    }
    
    StorageManager.setItem('wishlist', savedWishlist);
}

// Update the existing functions to use storage
const originalAddToCart = window.addToCart;
window.addToCart = function() {
    originalAddToCart();
    updateCartStorage();
};

const originalToggleWishlist = window.toggleWishlist;
window.toggleWishlist = function() {
    originalToggleWishlist();
    updateWishlistStorage();
};

// Analytics tracking (placeholder for real analytics)
function trackEvent(eventName, eventData) {
    console.log('Analytics Event:', eventName, eventData);
    
    // Example: Google Analytics 4
    // gtag('event', eventName, eventData);
    
    // Example: Facebook Pixel
    // fbq('track', eventName, eventData);
}