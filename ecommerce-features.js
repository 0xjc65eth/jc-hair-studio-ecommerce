// Advanced E-commerce Features for Boca Rosa Product Page

// Product Recommendation Engine
class ProductRecommendations {
    constructor() {
        this.viewedProducts = this.getViewedProducts();
        this.userPreferences = this.getUserPreferences();
    }
    
    getViewedProducts() {
        return StorageManager.getItem('viewedProducts') || [];
    }
    
    getUserPreferences() {
        return StorageManager.getItem('userPreferences') || {
            skinTone: null,
            preferredBrands: [],
            priceRange: { min: 0, max: 1000 }
        };
    }
    
    trackProductView(productId, category, brand, price) {
        const viewData = {
            productId,
            category,
            brand,
            price,
            timestamp: Date.now()
        };
        
        this.viewedProducts.unshift(viewData);
        
        // Keep only last 20 viewed products
        if (this.viewedProducts.length > 20) {
            this.viewedProducts = this.viewedProducts.slice(0, 20);
        }
        
        StorageManager.setItem('viewedProducts', this.viewedProducts);
        
        // Update user preferences
        this.updateUserPreferences(category, brand, price);
    }
    
    updateUserPreferences(category, brand, price) {
        if (!this.userPreferences.preferredBrands.includes(brand)) {
            this.userPreferences.preferredBrands.push(brand);
        }
        
        // Update price range based on viewed products
        if (price > this.userPreferences.priceRange.max * 0.8) {
            this.userPreferences.priceRange.max = Math.max(this.userPreferences.priceRange.max, price * 1.2);
        }
        
        StorageManager.setItem('userPreferences', this.userPreferences);
    }
    
    getRecommendations() {
        // Simulate API call for product recommendations
        return [
            {
                id: 'batom-liquido-br',
                name: 'Batom Líquido Boca Rosa',
                price: 39.90,
                image: 'batom-liquido.jpg',
                rating: 4.8,
                match: 0.95
            },
            {
                id: 'paleta-sombras-br',
                name: 'Paleta de Sombras Boca Rosa',
                price: 89.90,
                image: 'paleta-sombras.jpg',
                rating: 4.6,
                match: 0.87
            },
            {
                id: 'blush-cremoso-br',
                name: 'Blush Cremoso Boca Rosa',
                price: 49.90,
                image: 'blush-cremoso.jpg',
                rating: 4.7,
                match: 0.92
            }
        ];
    }
}

// Virtual Try-On Feature
class VirtualTryOn {
    constructor() {
        this.isInitialized = false;
        this.currentFilter = null;
    }
    
    async initialize() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.warn('Camera access not supported');
            return false;
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            this.isInitialized = true;
            return true;
        } catch (error) {
            console.warn('Camera access denied:', error);
            return false;
        }
    }
    
    openVirtualTryOn() {
        if (!this.isInitialized) {
            this.showCameraPermissionDialog();
            return;
        }
        
        this.createTryOnModal();
    }
    
    showCameraPermissionDialog() {
        const modal = document.createElement('div');
        modal.className = 'virtual-tryon-permission-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Experimente virtualmente!</h3>
                <p>Para usar o provador virtual, precisamos acessar sua câmera.</p>
                <div class="modal-actions">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn-cancel">Cancelar</button>
                    <button onclick="virtualTryOn.requestCameraPermission()" class="btn-allow">Permitir Câmera</button>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        document.body.appendChild(modal);
    }
    
    async requestCameraPermission() {
        const success = await this.initialize();
        if (success) {
            document.querySelector('.virtual-tryon-permission-modal').remove();
            this.createTryOnModal();
        } else {
            alert('Não foi possível acessar a câmera. Verifique as permissões do seu navegador.');
        }
    }
    
    createTryOnModal() {
        const modal = document.createElement('div');
        modal.className = 'virtual-tryon-modal';
        modal.innerHTML = `
            <div class="tryon-modal-content">
                <div class="tryon-header">
                    <h3>Provador Virtual - Base Boca Rosa</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="close-tryon">×</button>
                </div>
                <div class="tryon-body">
                    <div class="camera-container">
                        <video id="tryonVideo" autoplay muted></video>
                        <canvas id="tryonCanvas" style="display: none;"></canvas>
                    </div>
                    <div class="tryon-controls">
                        <h4>Escolha um tom para testar:</h4>
                        <div class="tryon-colors" id="tryonColors">
                            <!-- Colors will be populated by JavaScript -->
                        </div>
                        <div class="tryon-actions">
                            <button onclick="virtualTryOn.capturePhoto()" class="btn-capture">📸 Capturar Foto</button>
                            <button onclick="virtualTryOn.shareResult()" class="btn-share">📱 Compartilhar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.startCamera();
        this.populateTryOnColors();
    }
    
    async startCamera() {
        try {
            const video = document.getElementById('tryonVideo');
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            video.srcObject = stream;
        } catch (error) {
            console.error('Error starting camera:', error);
        }
    }
    
    populateTryOnColors() {
        const tryonColors = document.getElementById('tryonColors');
        
        colorOptions.forEach((color, index) => {
            const colorBtn = document.createElement('button');
            colorBtn.className = 'tryon-color-btn';
            colorBtn.style.backgroundColor = color.color;
            colorBtn.title = color.name;
            colorBtn.onclick = () => this.applyColorFilter(color);
            
            tryonColors.appendChild(colorBtn);
        });
    }
    
    applyColorFilter(color) {
        // In a real implementation, this would apply AR filters
        console.log('Applying color filter:', color);
        this.currentFilter = color;
        
        // Visual feedback
        document.querySelectorAll('.tryon-color-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }
    
    capturePhoto() {
        const video = document.getElementById('tryonVideo');
        const canvas = document.getElementById('tryonCanvas');
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        // Convert to blob and download
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `boca-rosa-tryon-${Date.now()}.jpg`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }
    
    shareResult() {
        if (navigator.share) {
            navigator.share({
                title: 'Meu teste virtual - Base Boca Rosa',
                text: 'Testei virtualmente a Base Multifuncional Boca Rosa!',
                url: window.location.href
            });
        } else {
            // Fallback for browsers without Web Share API
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link copiado para a área de transferência!', 'success');
            });
        }
    }
}

// Skin Tone Analyzer
class SkinToneAnalyzer {
    constructor() {
        this.recommendations = {
            cool: ['BR01', 'BR04', 'BR07', 'BR10'],
            warm: ['BR03', 'BR06', 'BR09', 'BR12'],
            neutral: ['BR02', 'BR05', 'BR08', 'BR11']
        };
    }
    
    openAnalyzer() {
        const modal = document.createElement('div');
        modal.className = 'skin-tone-analyzer-modal';
        modal.innerHTML = `
            <div class="analyzer-modal-content">
                <div class="analyzer-header">
                    <h3>Analisador de Tom de Pele</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="close-analyzer">×</button>
                </div>
                <div class="analyzer-body">
                    <div class="analyzer-steps">
                        <div class="step active" id="step1">
                            <h4>Passo 1: Teste das veias</h4>
                            <p>Olhe para as veias do seu pulso em uma área bem iluminada:</p>
                            <div class="vein-options">
                                <button onclick="skinToneAnalyzer.selectVeinColor('green')" class="vein-btn">
                                    <span class="vein-color" style="background: #4CAF50;"></span>
                                    Verdes
                                </button>
                                <button onclick="skinToneAnalyzer.selectVeinColor('blue')" class="vein-btn">
                                    <span class="vein-color" style="background: #2196F3;"></span>
                                    Azuis
                                </button>
                                <button onclick="skinToneAnalyzer.selectVeinColor('mixed')" class="vein-btn">
                                    <span class="vein-color" style="background: linear-gradient(45deg, #4CAF50, #2196F3);"></span>
                                    Mistas
                                </button>
                            </div>
                        </div>
                        
                        <div class="step" id="step2">
                            <h4>Passo 2: Teste da joia</h4>
                            <p>Qual tipo de joia fica melhor em você?</p>
                            <div class="jewelry-options">
                                <button onclick="skinToneAnalyzer.selectJewelry('gold')" class="jewelry-btn">
                                    <span class="jewelry-color" style="background: #FFD700;"></span>
                                    Dourado
                                </button>
                                <button onclick="skinToneAnalyzer.selectJewelry('silver')" class="jewelry-btn">
                                    <span class="jewelry-color" style="background: #C0C0C0;"></span>
                                    Prateado
                                </button>
                                <button onclick="skinToneAnalyzer.selectJewelry('both')" class="jewelry-btn">
                                    <span class="jewelry-color" style="background: linear-gradient(45deg, #FFD700, #C0C0C0);"></span>
                                    Ambos
                                </button>
                            </div>
                        </div>
                        
                        <div class="step" id="step3">
                            <h4>Passo 3: Cores que favorecem</h4>
                            <p>Quais cores te deixam mais bonita?</p>
                            <div class="color-preference-options">
                                <button onclick="skinToneAnalyzer.selectColorPreference('cool')" class="color-pref-btn">
                                    Azuis, rosas, roxos
                                </button>
                                <button onclick="skinToneAnalyzer.selectColorPreference('warm')" class="color-pref-btn">
                                    Laranjas, amarelos, vermelhos
                                </button>
                                <button onclick="skinToneAnalyzer.selectColorPreference('neutral')" class="color-pref-btn">
                                    Todas as cores
                                </button>
                            </div>
                        </div>
                        
                        <div class="step" id="results" style="display: none;">
                            <h4>Seus tons recomendados:</h4>
                            <div id="recommendedShades"></div>
                            <button onclick="skinToneAnalyzer.applyRecommendations()" class="btn-apply-recommendations">
                                Aplicar Recomendações
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    selectVeinColor(color) {
        this.veinColor = color;
        this.nextStep(1);
    }
    
    selectJewelry(jewelry) {
        this.jewelry = jewelry;
        this.nextStep(2);
    }
    
    selectColorPreference(preference) {
        this.colorPreference = preference;
        this.analyzeResults();
    }
    
    nextStep(currentStep) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        document.getElementById(`step${currentStep + 1}`).classList.add('active');
    }
    
    analyzeResults() {
        let undertone = 'neutral';
        
        // Determine undertone based on answers
        if (this.veinColor === 'green' && this.jewelry === 'gold' && this.colorPreference === 'warm') {
            undertone = 'warm';
        } else if (this.veinColor === 'blue' && this.jewelry === 'silver' && this.colorPreference === 'cool') {
            undertone = 'cool';
        }
        
        const recommendedCodes = this.recommendations[undertone];
        const recommendedShades = colorOptions.filter(color => 
            recommendedCodes.includes(color.code)
        );
        
        this.showResults(undertone, recommendedShades);
    }
    
    showResults(undertone, shades) {
        document.getElementById('step3').classList.remove('active');
        document.getElementById('results').style.display = 'block';
        
        const resultsContainer = document.getElementById('recommendedShades');
        resultsContainer.innerHTML = `
            <p><strong>Subtom identificado:</strong> ${this.getUndertoneLabel(undertone)}</p>
            <div class="recommended-shades-grid">
                ${shades.map(shade => `
                    <div class="recommended-shade" data-code="${shade.code}">
                        <div class="shade-color" style="background: ${shade.color};"></div>
                        <div class="shade-info">
                            <div class="shade-name">${shade.name}</div>
                            <div class="shade-code">${shade.code}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        this.recommendedShades = shades;
    }
    
    getUndertoneLabel(undertone) {
        const labels = {
            cool: 'Frio (tons rosados)',
            warm: 'Quente (tons dourados)',
            neutral: 'Neutro (equilibrado)'
        };
        return labels[undertone];
    }
    
    applyRecommendations() {
        // Highlight recommended shades in the main color selector
        document.querySelectorAll('.color-option').forEach(option => {
            const code = option.getAttribute('data-color');
            if (this.recommendedShades.some(shade => shade.code === code)) {
                option.classList.add('recommended');
                option.style.boxShadow = '0 0 0 3px #FFD700';
            }
        });
        
        // Close analyzer
        document.querySelector('.skin-tone-analyzer-modal').remove();
        
        // Show success message
        showNotification('Tons recomendados destacados! Procure pelos tons com borda dourada.', 'success');
        
        // Scroll to color selection
        document.querySelector('.color-selection').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Price Alert System
class PriceAlert {
    constructor() {
        this.alerts = StorageManager.getItem('priceAlerts') || [];
    }
    
    showPriceAlertForm() {
        const modal = document.createElement('div');
        modal.className = 'price-alert-modal';
        modal.innerHTML = `
            <div class="price-alert-content">
                <h3>Alerta de Preço</h3>
                <p>Receba uma notificação quando este produto estiver com desconto!</p>
                <form id="priceAlertForm">
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" id="alertEmail" required placeholder="seu@email.com">
                    </div>
                    <div class="form-group">
                        <label>Preço desejado (R$):</label>
                        <input type="number" id="alertPrice" step="0.01" max="79.90" placeholder="60.00">
                        <small>Preço atual: R$ 79,90</small>
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="this.parentElement.parentElement.parentElement.parentElement.remove()">Cancelar</button>
                        <button type="submit">Criar Alerta</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('priceAlertForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createAlert();
        });
    }
    
    createAlert() {
        const email = document.getElementById('alertEmail').value;
        const targetPrice = parseFloat(document.getElementById('alertPrice').value);
        
        const alert = {
            id: Date.now(),
            productId: 'boca-rosa-stick-pele',
            productName: 'Base Multifuncional Boca Rosa - Stick Pele',
            email: email,
            targetPrice: targetPrice,
            currentPrice: 79.90,
            created: new Date().toISOString()
        };
        
        this.alerts.push(alert);
        StorageManager.setItem('priceAlerts', this.alerts);
        
        showNotification('Alerta de preço criado com sucesso!', 'success');
        document.querySelector('.price-alert-modal').remove();
    }
}

// Review System
class ReviewSystem {
    constructor() {
        this.reviews = this.loadReviews();
    }
    
    loadReviews() {
        // In a real application, this would come from an API
        return [
            {
                id: 1,
                userName: 'Ana Carolina',
                rating: 5,
                date: '2024-01-10',
                comment: 'Produto incrível! A cobertura é perfeita e realmente dura o dia todo. O tom combinou perfeitamente com minha pele.',
                verified: true,
                helpful: 24,
                images: []
            },
            {
                id: 2,
                userName: 'Mariana Silva',
                rating: 4,
                date: '2024-01-08',
                comment: 'Muito prático para usar no dia a dia. A aplicação é super fácil e o resultado fica natural.',
                verified: true,
                helpful: 18,
                images: []
            },
            {
                id: 3,
                userName: 'Juliana Santos',
                rating: 5,
                date: '2024-01-05',
                comment: 'Melhor base que já usei! Não resseca a pele e tem uma duração excelente. Recomendo muito!',
                verified: false,
                helpful: 31,
                images: ['review-image-1.jpg']
            }
        ];
    }
    
    showWriteReviewForm() {
        const modal = document.createElement('div');
        modal.className = 'write-review-modal';
        modal.innerHTML = `
            <div class="review-modal-content">
                <h3>Escrever Avaliação</h3>
                <form id="writeReviewForm">
                    <div class="form-group">
                        <label>Sua nota:</label>
                        <div class="rating-input" id="ratingInput">
                            ${[1,2,3,4,5].map(i => `
                                <button type="button" class="star-btn" data-rating="${i}">
                                    <i class="far fa-star"></i>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Título da avaliação:</label>
                        <input type="text" id="reviewTitle" maxlength="100" placeholder="Resuma sua experiência">
                    </div>
                    <div class="form-group">
                        <label>Sua avaliação:</label>
                        <textarea id="reviewComment" rows="5" maxlength="500" placeholder="Conte sobre sua experiência com o produto..."></textarea>
                        <small>0/500 caracteres</small>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="recommendProduct"> 
                            Eu recomendaria este produto
                        </label>
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="this.parentElement.parentElement.parentElement.parentElement.remove()">Cancelar</button>
                        <button type="submit">Publicar Avaliação</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupReviewForm();
    }
    
    setupReviewForm() {
        // Star rating interaction
        const starButtons = document.querySelectorAll('.star-btn');
        let selectedRating = 0;
        
        starButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                selectedRating = index + 1;
                this.updateStarDisplay(selectedRating);
            });
            
            btn.addEventListener('mouseenter', () => {
                this.updateStarDisplay(index + 1, true);
            });
        });
        
        document.getElementById('ratingInput').addEventListener('mouseleave', () => {
            this.updateStarDisplay(selectedRating);
        });
        
        // Character counter
        const textarea = document.getElementById('reviewComment');
        const counter = textarea.nextElementSibling;
        
        textarea.addEventListener('input', () => {
            counter.textContent = `${textarea.value.length}/500 caracteres`;
        });
        
        // Form submission
        document.getElementById('writeReviewForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReview(selectedRating);
        });
    }
    
    updateStarDisplay(rating, isHover = false) {
        const starButtons = document.querySelectorAll('.star-btn i');
        
        starButtons.forEach((star, index) => {
            if (index < rating) {
                star.className = 'fas fa-star';
                star.style.color = '#ffc107';
            } else {
                star.className = 'far fa-star';
                star.style.color = isHover ? '#ffc107' : '#ccc';
            }
        });
    }
    
    submitReview(rating) {
        const title = document.getElementById('reviewTitle').value;
        const comment = document.getElementById('reviewComment').value;
        const recommend = document.getElementById('recommendProduct').checked;
        
        if (rating === 0) {
            alert('Por favor, selecione uma nota de 1 a 5 estrelas.');
            return;
        }
        
        if (!comment.trim()) {
            alert('Por favor, escreva sua avaliação.');
            return;
        }
        
        const newReview = {
            id: Date.now(),
            userName: 'Usuário Anônimo', // In real app, would get from user session
            rating: rating,
            title: title,
            comment: comment,
            recommend: recommend,
            date: new Date().toISOString().split('T')[0],
            verified: false,
            helpful: 0,
            images: []
        };
        
        // Add to reviews (in real app, would send to API)
        this.reviews.unshift(newReview);
        
        showNotification('Avaliação enviada com sucesso! Obrigado pelo seu feedback.', 'success');
        document.querySelector('.write-review-modal').remove();
        
        // Refresh reviews display
        this.updateReviewsDisplay();
    }
    
    updateReviewsDisplay() {
        // Update reviews list in the tab
        const reviewsList = document.querySelector('.reviews-list');
        if (reviewsList) {
            reviewsList.innerHTML = this.generateReviewsHTML();
        }
    }
    
    generateReviewsHTML() {
        return this.reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-name">
                            ${review.userName}
                            ${review.verified ? '<span class="verified-badge">✓ Compra verificada</span>' : ''}
                        </div>
                        <div class="review-rating">
                            ${[1,2,3,4,5].map(i => `
                                <i class="fa${i <= review.rating ? 's' : 'r'} fa-star"></i>
                            `).join('')}
                        </div>
                    </div>
                    <div class="review-date">${this.formatDate(review.date)}</div>
                </div>
                ${review.title ? `<div class="review-title">${review.title}</div>` : ''}
                <div class="review-content">
                    <p>${review.comment}</p>
                    ${review.images && review.images.length > 0 ? `
                        <div class="review-images">
                            ${review.images.map(img => `<img src="${img}" alt="Foto da avaliação">`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="review-actions">
                    <button onclick="reviewSystem.markHelpful(${review.id})" class="helpful-btn">
                        👍 Útil (${review.helpful})
                    </button>
                    ${review.recommend ? '<span class="recommend-badge">👍 Recomenda</span>' : ''}
                </div>
            </div>
        `).join('');
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Ontem';
        if (diffDays < 7) return `Há ${diffDays} dias`;
        if (diffDays < 30) return `Há ${Math.ceil(diffDays / 7)} semanas`;
        
        return date.toLocaleDateString('pt-BR');
    }
    
    markHelpful(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.helpful++;
            this.updateReviewsDisplay();
            showNotification('Obrigado pelo feedback!', 'success');
        }
    }
}

// Initialize all advanced features
const productRecommendations = new ProductRecommendations();
const virtualTryOn = new VirtualTryOn();
const skinToneAnalyzer = new SkinToneAnalyzer();
const priceAlert = new PriceAlert();
const reviewSystem = new ReviewSystem();

// Track product view when page loads
document.addEventListener('DOMContentLoaded', function() {
    productRecommendations.trackProductView(
        'boca-rosa-stick-pele',
        'maquiagem',
        'Boca Rosa',
        79.90
    );
    
    // Add feature buttons to the product page
    addAdvancedFeatureButtons();
});

function addAdvancedFeatureButtons() {
    // Add Virtual Try-On button
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        const tryOnBtn = document.createElement('button');
        tryOnBtn.className = 'btn-virtual-tryon';
        tryOnBtn.innerHTML = '<i class="fas fa-camera"></i> Provador Virtual';
        tryOnBtn.onclick = () => virtualTryOn.openVirtualTryOn();
        tryOnBtn.style.cssText = `
            background: #9c27b0;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        actionButtons.appendChild(tryOnBtn);
    }
    
    // Add Skin Tone Analyzer button
    const colorSelection = document.querySelector('.color-selection');
    if (colorSelection) {
        const analyzerBtn = document.createElement('button');
        analyzerBtn.className = 'btn-skin-analyzer';
        analyzerBtn.innerHTML = '<i class="fas fa-magic"></i> Descobrir meu tom';
        analyzerBtn.onclick = () => skinToneAnalyzer.openAnalyzer();
        analyzerBtn.style.cssText = `
            background: #ff6b9d;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            margin-top: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        colorSelection.appendChild(analyzerBtn);
    }
    
    // Add Price Alert button
    const productPrice = document.querySelector('.product-price');
    if (productPrice) {
        const priceAlertBtn = document.createElement('button');
        priceAlertBtn.className = 'btn-price-alert';
        priceAlertBtn.innerHTML = '<i class="fas fa-bell"></i> Alerta de desconto';
        priceAlertBtn.onclick = () => priceAlert.showPriceAlertForm();
        priceAlertBtn.style.cssText = `
            background: transparent;
            color: #666;
            border: 1px solid #ddd;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            margin-top: 8px;
            display: flex;
            align-items: center;
            gap: 4px;
        `;
        productPrice.appendChild(priceAlertBtn);
    }
    
    // Add Write Review button
    const reviewsTab = document.getElementById('reviews');
    if (reviewsTab) {
        const writeReviewBtn = document.createElement('button');
        writeReviewBtn.className = 'btn-write-review';
        writeReviewBtn.innerHTML = '<i class="fas fa-edit"></i> Escrever Avaliação';
        writeReviewBtn.onclick = () => reviewSystem.showWriteReviewForm();
        writeReviewBtn.style.cssText = `
            background: #ff6b9d;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        const reviewsHeader = reviewsTab.querySelector('h3');
        reviewsHeader.insertAdjacentElement('afterend', writeReviewBtn);
    }
}