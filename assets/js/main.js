// Main JavaScript for SpiritShop
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const productsGrid = document.getElementById('productsGrid');
    const productCards = document.querySelectorAll('.product-card');
    const noResults = document.getElementById('noResults');

    // Search functionality
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        productCards.forEach(card => {
            const title = card.getAttribute('data-title');
            const isVisible = title.includes(searchTerm);
            
            if (isVisible) {
                card.style.display = 'block';
                visibleCount++;
                
                // Add animation delay for staggered effect
                card.style.animationDelay = `${visibleCount * 0.1}s`;
                card.style.animation = 'fadeInUp 0.6s ease-out';
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide no results message
        if (visibleCount === 0 && searchTerm !== '') {
            noResults.classList.remove('d-none');
            productsGrid.style.display = 'none';
        } else {
            noResults.classList.add('d-none');
            productsGrid.style.display = 'flex';
        }

        // Update clear button visibility
        clearSearchBtn.style.display = searchTerm !== '' ? 'block' : 'none';
    }

    // Event listeners
    searchInput.addEventListener('input', filterProducts);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });

    clearSearchBtn.addEventListener('click', clearSearch);

    function clearSearch() {
        searchInput.value = '';
        filterProducts();
        searchInput.focus();
    }

    // Product card hover effects
    productCards.forEach(card => {
        const cardInner = card.querySelector('.product-card-inner');
        
        card.addEventListener('mouseenter', function() {
            cardInner.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            cardInner.style.transform = 'translateY(0)';
        });
    });

    // Smooth scrolling for anchor links
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

    // Add loading state to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('btn-outline-secondary')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });

    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Add keyboard navigation for search
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const firstVisibleCard = document.querySelector('.product-card[style*="display: block"]');
            if (firstVisibleCard) {
                const link = firstVisibleCard.querySelector('a[href*="product.php"]');
                if (link) {
                    link.click();
                }
            }
        }
    });

    // Add search suggestions (optional)
    const searchSuggestions = [
        'Whisky', 'Vodka', 'Rum', 'Gin', 'Tequila', 'Cognac',
        'Jack Daniel', 'Absolut', 'Havana Club', 'Bombay', 'Patrón', 'Hennessy'
    ];

    searchInput.addEventListener('focus', function() {
        if (this.value === '') {
            this.placeholder = 'Ex: Whisky, Vodka, Rum...';
        }
    });

    searchInput.addEventListener('blur', function() {
        this.placeholder = 'Buscar produtos...';
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe product cards for scroll animation
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add search history (localStorage)
    const searchHistory = JSON.parse(localStorage.getItem('spiritshop_search_history') || '[]');
    
    function addToSearchHistory(term) {
        if (term && !searchHistory.includes(term)) {
            searchHistory.unshift(term);
            if (searchHistory.length > 5) {
                searchHistory.pop();
            }
            localStorage.setItem('spiritshop_search_history', JSON.stringify(searchHistory));
        }
    }

    // Add search history to clear button
    if (searchHistory.length > 0) {
        const historyContainer = document.createElement('div');
        historyContainer.className = 'search-history mt-2';
        historyContainer.innerHTML = `
            <small class="text-muted">Pesquisas recentes: </small>
            ${searchHistory.map(term => 
                `<span class="badge bg-light text-dark me-1" style="cursor: pointer;">${term}</span>`
            ).join('')}
        `;
        
        searchInput.parentNode.parentNode.appendChild(historyContainer);
        
        // Add click handlers for history items
        historyContainer.querySelectorAll('.badge').forEach(badge => {
            badge.addEventListener('click', function() {
                searchInput.value = this.textContent;
                filterProducts();
                addToSearchHistory(this.textContent);
            });
        });
    }

    // Save search term when user types
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (this.value.trim()) {
                addToSearchHistory(this.value.trim());
            }
        }, 1000);
    });

    // Add product count display
    function updateProductCount() {
        const visibleProducts = document.querySelectorAll('.product-card[style*="display: block"]').length;
        const totalProducts = productCards.length;
        
        let countDisplay = document.getElementById('productCount');
        if (!countDisplay) {
            countDisplay = document.createElement('div');
            countDisplay.id = 'productCount';
            countDisplay.className = 'text-muted text-center mb-3';
            productsGrid.parentNode.insertBefore(countDisplay, productsGrid);
        }
        
        if (searchInput.value.trim()) {
            countDisplay.textContent = `${visibleProducts} de ${totalProducts} produtos encontrados`;
        } else {
            countDisplay.textContent = `${totalProducts} produtos disponíveis`;
        }
    }

    // Update count on search
    searchInput.addEventListener('input', updateProductCount);
    
    // Initial count
    updateProductCount();

    // Add error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE3Ny45MDkgMTUwIDE2MCAxNjcuOTA5IDE2MCAxOTBDMTYwIDIxMi4wOTEgMTc3LjkwOSAyMzAgMjAwIDIzMEMyMjIuMDkxIDIzMCAyNDAgMjEyLjA5MSAyNDAgMTkwQzI0MCAxNjcuOTA5IDIyMi4wOTEgMTUwIDIwMCAxNTBaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0yMDAgMjUwQzE1MC4wMDEgMjUwIDEwMCAyMDAgMTAwIDE1MEgxNTBDMTUwIDE3Ny42MTQgMTcyLjM4NiAyMDAgMjAwIDIwMEMyMjcuNjE0IDIwMCAyNTAgMTc3LjYxNCAyNTAgMTUwSDMwMEMzMDAgMjAwIDI1MCAyNTAgMjAwIDI1MFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+';
            this.alt = 'Imagem não disponível';
        });
    });

    console.log('SpiritShop - Main JavaScript loaded successfully!');
}); 