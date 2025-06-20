document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper for product gallery
    const productSwiper = new Swiper('.product-swiper', {
        loop: true,
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });

    // Initialize thumbnail swiper
    const thumbsSwiper = new Swiper('.product-thumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: {
            320: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 4,
            },
            1024: {
                slidesPerView: 5,
            }
        }
    });

    // Connect main swiper with thumbnails
    productSwiper.controller.control = thumbsSwiper;
    thumbsSwiper.controller.control = productSwiper;

    // Quantity controls
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQuantity');
    const increaseBtn = document.getElementById('increaseQuantity');

    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                updateTotalPrice();
            }
        });

        increaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue < 99) {
                quantityInput.value = currentValue + 1;
                updateTotalPrice();
            }
        });

        quantityInput.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 99) {
                this.value = 99;
            }
            updateTotalPrice();
        });
    }

    // Add to cart functionality
    const addToCartBtn = document.getElementById('addToCart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(quantityInput.value) || 1;
            const productTitle = document.querySelector('.product-details h1').textContent;
            const productPrice = document.querySelector('.price-section .h3').textContent;
            
            // Show success message
            showNotification(`${quantity}x ${productTitle} adicionado ao carrinho!`, 'success');
            
            // Add loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Adicionando...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-cart me-2"></i>Adicionar ao Carrinho';
                this.disabled = false;
            }, 2000);

            // Store in localStorage (simple cart implementation)
            addToCart(productTitle, quantity, productPrice);
        });
    }

    // Image zoom functionality
    const productImages = document.querySelectorAll('.product-swiper img');
    productImages.forEach(img => {
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });

    // Keyboard navigation for swiper
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            productSwiper.slidePrev();
        } else if (e.key === 'ArrowRight') {
            productSwiper.slideNext();
        }
    });

    // Touch gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                productSwiper.slideNext();
            } else {
                productSwiper.slidePrev();
            }
        }
    }

    // Product Reviews System
    class ProductReviewSystem {
        constructor() {
            this.productId = this.getProductId();
            this.storageKey = `spiritshop_reviews_${this.productId}`;
            this.currentRating = 0;
            this.reviews = this.loadReviews();
            
            this.init();
        }

        getProductId() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('id') || 'default';
        }

        init() {
            this.initStarRating();
            this.initReviewForm();
            this.displayReviews();
            this.updateRatingDisplay();
        }

        initStarRating() {
            const starInputs = document.querySelectorAll('.star-input');
            const ratingText = document.querySelector('.rating-text');
            const submitBtn = document.getElementById('submitReview');

            starInputs.forEach((star, index) => {
                // Hover effects
                star.addEventListener('mouseenter', () => {
                    this.highlightStars(index);
                    this.updateRatingText(index + 1);
                });

                star.addEventListener('mouseleave', () => {
                    this.resetStarHighlight();
                    this.updateRatingText(this.currentRating);
                });

                // Click to select rating
                star.addEventListener('click', () => {
                    this.currentRating = index + 1;
                    this.selectStars(index);
                    this.updateRatingText(this.currentRating);
                    this.updateSubmitButton();
                });
            });
        }

        highlightStars(index) {
            const starInputs = document.querySelectorAll('.star-input');
            starInputs.forEach((star, i) => {
                star.classList.remove('active', 'selected');
                if (i <= index) {
                    star.classList.add('active');
                }
            });
        }

        resetStarHighlight() {
            const starInputs = document.querySelectorAll('.star-input');
            starInputs.forEach((star, i) => {
                star.classList.remove('active');
                if (i < this.currentRating) {
                    star.classList.add('selected');
                }
            });
        }

        selectStars(index) {
            const starInputs = document.querySelectorAll('.star-input');
            starInputs.forEach((star, i) => {
                star.classList.remove('active', 'selected');
                if (i <= index) {
                    star.classList.add('selected');
                }
            });
        }

        updateRatingText(rating) {
            const ratingText = document.querySelector('.rating-text');
            const ratingMessages = {
                0: 'Clique nas estrelas para avaliar',
                1: 'Péssimo',
                2: 'Ruim',
                3: 'Regular',
                4: 'Bom',
                5: 'Excelente'
            };
            ratingText.textContent = ratingMessages[rating] || 'Clique nas estrelas para avaliar';
        }

        updateSubmitButton() {
            const submitBtn = document.getElementById('submitReview');
            if (this.currentRating > 0) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-secondary');
                submitBtn.classList.add('btn-primary');
            } else {
                submitBtn.disabled = true;
                submitBtn.classList.remove('btn-primary');
                submitBtn.classList.add('btn-secondary');
            }
        }

        initReviewForm() {
            const submitBtn = document.getElementById('submitReview');
            const commentTextarea = document.getElementById('reviewComment');

            submitBtn.addEventListener('click', () => {
                this.submitReview();
            });

            // Enable submit on Enter key in textarea
            commentTextarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.submitReview();
                }
            });
        }

        submitReview() {
            if (this.currentRating === 0) {
                showNotification('Por favor, selecione uma avaliação', 'warning');
                return;
            }

            const comment = document.getElementById('reviewComment').value.trim();
            
            const review = {
                id: Date.now(),
                rating: this.currentRating,
                comment: comment,
                date: new Date().toISOString(),
                reviewer: this.generateReviewerName()
            };

            this.reviews.push(review);
            this.saveReviews();
            this.displayReviews();
            this.updateRatingDisplay();
            this.resetForm();
            
            showNotification('Avaliação enviada com sucesso!', 'success');
        }

        generateReviewerName() {
            const names = [
                'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira',
                'Lucia Rodrigues', 'Fernando Alves', 'Patricia Lima', 'Roberto Gomes', 'Juliana Martins',
                'Marcos Pereira', 'Cristina Souza', 'Ricardo Barbosa', 'Amanda Carvalho', 'Diego Santos'
            ];
            return names[Math.floor(Math.random() * names.length)];
        }

        resetForm() {
            this.currentRating = 0;
            this.selectStars(-1);
            this.updateRatingText(0);
            this.updateSubmitButton();
            document.getElementById('reviewComment').value = '';
        }

        loadReviews() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                return stored ? JSON.parse(stored) : [];
            } catch (error) {
                console.error('Error loading reviews:', error);
                return [];
            }
        }

        saveReviews() {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.reviews));
            } catch (error) {
                console.error('Error saving reviews:', error);
            }
        }

        displayReviews() {
            const container = document.getElementById('reviewsContainer');
            
            if (this.reviews.length === 0) {
                container.innerHTML = `
                    <div class="no-reviews">
                        <i class="fas fa-comments"></i>
                        <p>Nenhuma avaliação ainda. Seja o primeiro a avaliar este produto!</p>
                    </div>
                `;
                return;
            }

            // Sort reviews by date (newest first)
            const sortedReviews = [...this.reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

            container.innerHTML = sortedReviews.map(review => this.createReviewHTML(review)).join('');
        }

        createReviewHTML(review) {
            const date = new Date(review.date).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const stars = this.createStarsHTML(review.rating);
            const reviewerInitial = review.reviewer.charAt(0);

            return `
                <div class="review-item" data-review-id="${review.id}">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">${reviewerInitial}</div>
                            <div>
                                <div class="reviewer-name">${review.reviewer}</div>
                                <div class="review-date">${date}</div>
                            </div>
                        </div>
                        <div class="review-rating">
                            ${stars}
                        </div>
                    </div>
                    ${review.comment ? `<div class="review-content">${this.escapeHtml(review.comment)}</div>` : ''}
                </div>
            `;
        }

        createStarsHTML(rating) {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                const starClass = i <= rating ? 'text-warning' : 'text-muted';
                stars += `<i class="fas fa-star ${starClass}"></i>`;
            }
            return stars;
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        updateRatingDisplay() {
            const reviewCount = this.reviews.length;
            const averageRating = this.calculateAverageRating();
            
            // Update review count
            const reviewCountElement = document.querySelector('.review-count');
            if (reviewCountElement) {
                reviewCountElement.textContent = reviewCount;
            }

            // Update average rating display
            const averageRatingElement = document.querySelector('.average-rating');
            if (averageRatingElement) {
                averageRatingElement.textContent = averageRating.toFixed(1);
            }

            // Update stars display
            const starsDisplay = document.querySelector('.stars-display');
            if (starsDisplay) {
                starsDisplay.innerHTML = this.createStarsHTML(Math.round(averageRating));
            }
        }

        calculateAverageRating() {
            if (this.reviews.length === 0) {
                // Return original product rating if no reviews
                const originalRating = parseFloat(document.querySelector('.average-rating').textContent) || 0;
                return originalRating;
            }

            const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
            return totalRating / this.reviews.length;
        }
    }

    // Initialize the review system
    const reviewSystem = new ProductReviewSystem();

    // Share functionality
    function addShareButtons() {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'share-buttons mt-3';
        shareContainer.innerHTML = `
            <h6>Compartilhar:</h6>
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-primary btn-sm" onclick="shareOnWhatsApp()">
                    <i class="fab fa-whatsapp"></i>
                </button>
                <button type="button" class="btn btn-outline-primary btn-sm" onclick="shareOnFacebook()">
                    <i class="fab fa-facebook"></i>
                </button>
                <button type="button" class="btn btn-outline-primary btn-sm" onclick="shareOnTwitter()">
                    <i class="fab fa-twitter"></i>
                </button>
                <button type="button" class="btn btn-outline-primary btn-sm" onclick="copyLink()">
                    <i class="fas fa-link"></i>
                </button>
            </div>
        `;
        
        const productActions = document.querySelector('.product-actions');
        if (productActions) {
            productActions.appendChild(shareContainer);
        }
    }

    // Add share buttons to page
    addShareButtons();

    // Utility functions
    function updateTotalPrice() {
        const priceElement = document.querySelector('.price-section .h3');
        const quantity = parseInt(quantityInput.value) || 1;
        
        if (priceElement) {
            const basePrice = parseFloat(priceElement.textContent.replace('R$ ', '').replace(',', '.'));
            const totalPrice = basePrice * quantity;
            
            // Show total price in a tooltip or small element
            let totalElement = document.getElementById('totalPrice');
            if (!totalElement) {
                totalElement = document.createElement('small');
                totalElement.id = 'totalPrice';
                totalElement.className = 'text-muted d-block mt-2';
                priceElement.parentNode.appendChild(totalElement);
            }
            
            if (quantity > 1) {
                totalElement.textContent = `Total: R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
                totalElement.style.display = 'block';
            } else {
                totalElement.style.display = 'none';
            }
        }
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    function addToCart(title, quantity, price) {
        const cart = JSON.parse(localStorage.getItem('spiritshop_cart') || '[]');
        const existingItem = cart.find(item => item.title === title);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                title: title,
                quantity: quantity,
                price: price,
                addedAt: new Date().toISOString()
            });
        }
        
        localStorage.setItem('spiritshop_cart', JSON.stringify(cart));
        
        // Update cart count if it exists
        updateCartCount();
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('spiritshop_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update cart count in navbar if it exists
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    }

    function openImageModal(src, alt) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${alt}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${src}" class="img-fluid" alt="${alt}">
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        
        modal.addEventListener('hidden.bs.modal', function() {
            modal.remove();
        });
    }

    // Share functions (global scope)
    window.shareOnWhatsApp = function() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(document.title);
        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    };

    window.shareOnFacebook = function() {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    };

    window.shareOnTwitter = function() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(document.title);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };

    window.copyLink = function() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Link copiado para a área de transferência!', 'success');
        });
    };

    // Initialize tooltips
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Add smooth scrolling
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

    // Add loading states
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('btn-outline-secondary') && !this.classList.contains('btn-close')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });

    // Error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE3Ny45MDkgMTUwIDE2MCAxNjcuOTA5IDE2MCAxOTBDMTYwIDIxMi4wOTEgMTc3LjkwOSAyMzAgMjAwIDIzMEMyMjIuMDkxIDIzMCAyNDAgMjEyLjA5MSAyNDAgMTkwQzI0MCAxNjcuOTA5IDIyMi4wOTEgMTUwIDIwMCAxNTBaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0yMDAgMjUwQzE1MC4wMDEgMjUwIDEwMCAyMDAgMTAwIDE1MEgxNTBDMTUwIDE3Ny42MTQgMTcyLjM4NiAyMDAgMjAwIDIwMEMyMjcuNjE0IDIwMCAyNTAgMTc3LjYxNCAyNTAgMTUwSDMwMEMzMDAgMjAwIDI1MCAyNTAgMjAwIDI1MFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+';
            this.alt = 'Imagem não disponível';
        });
    });

    // Initialize page
    updateCartCount();
    updateTotalPrice();

    console.log('SpiritShop - Product JavaScript loaded successfully!');
}); 