// ZIVAH International - Sistema de Loading Suave
class SmoothLoader {
    constructor() {
        this.isLoading = true;
        this.loadedResources = 0;
        this.totalResources = 0;
        this.observers = new Map();
        this.loadingQueue = [];
        
        this.init();
    }

    init() {
        // Mostrar loader inicial
        this.showPageLoader();
        
        // Configurar observadores
        this.setupIntersectionObservers();
        
        // Inicializar lazy loading
        this.initLazyLoading();
        
        // Configurar loading de recursos
        this.setupResourceLoading();
        
        // Configurar skeleton loaders
        this.setupSkeletonLoaders();
        
        // Inicializar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    showPageLoader() {
        // Crear loader si no existe
        if (!document.querySelector('.page-loader')) {
            const loader = document.createElement('div');
            loader.className = 'page-loader';
            loader.innerHTML = `
                <div class="loader-logo">
                    <img src="assets/images/icons/favicon-96x96.png" alt="ZIVAH Loading">
                </div>
                <div class="loader-spinner"></div>
                <div class="loader-text">Cargando productos ecuatorianos premium...</div>
                <div class="loader-progress">
                    <div class="loader-progress-bar"></div>
                </div>
            `;
            document.body.appendChild(loader);
        }
    }

    hidePageLoader() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.remove();
                this.isLoading = false;
                this.triggerLoadComplete();
            }, 500);
        }
    }

    updateProgress(percentage) {
        const progressBar = document.querySelector('.loader-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }

    setupIntersectionObservers() {
        // Observer para animaciones de entrada
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Opcional: dejar de observar después de la animación
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observer para elementos staggered
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const staggerItems = entry.target.querySelectorAll('.stagger-item');
                    staggerItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100);
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        this.observers.set('animation', animationObserver);
        this.observers.set('stagger', staggerObserver);
    }

    initLazyLoading() {
        // Lazy loading para imágenes
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        this.observers.set('images', imageObserver);
    }

    loadImage(img) {
        return new Promise((resolve, reject) => {
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
                img.src = imageLoader.src;
                img.classList.add('loaded');
                resolve(img);
            };
            
            imageLoader.onerror = () => {
                // Fallback image
                img.src = 'assets/images/icons/android-icon-144x144.png';
                img.classList.add('loaded', 'error');
                resolve(img);
            };
            
            imageLoader.src = img.dataset.src || img.src;
        });
    }

    setupResourceLoading() {
        // Contar recursos a cargar
        const images = document.querySelectorAll('img[data-src], img[src]');
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        const scripts = document.querySelectorAll('script[src]');
        
        this.totalResources = images.length + stylesheets.length + scripts.length;
        
        // Monitorear carga de recursos
        this.monitorResourceLoading();
    }

    monitorResourceLoading() {
        let loadedCount = 0;
        
        const updateProgress = () => {
            loadedCount++;
            const percentage = Math.min((loadedCount / this.totalResources) * 100, 100);
            this.updateProgress(percentage);
            
            if (loadedCount >= this.totalResources) {
                setTimeout(() => this.hidePageLoader(), 500);
            }
        };

        // Monitorear imágenes
        document.querySelectorAll('img').forEach(img => {
            if (img.complete) {
                updateProgress();
            } else {
                img.addEventListener('load', updateProgress);
                img.addEventListener('error', updateProgress);
            }
        });

        // Monitorear stylesheets
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            if (link.sheet) {
                updateProgress();
            } else {
                link.addEventListener('load', updateProgress);
                link.addEventListener('error', updateProgress);
            }
        });

        // Timeout de seguridad
        setTimeout(() => {
            if (this.isLoading) {
                this.hidePageLoader();
            }
        }, 5000);
    }

    setupSkeletonLoaders() {
        // Crear skeleton loaders para contenido dinámico
        this.createProductSkeletons();
        this.createContactSkeletons();
    }

    createProductSkeletons() {
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid && productsGrid.children.length === 0) {
            for (let i = 0; i < 5; i++) {
                const skeleton = document.createElement('div');
                skeleton.className = 'skeleton-card';
                skeleton.innerHTML = `
                    <div class="skeleton skeleton-image"></div>
                    <div class="skeleton skeleton-text large"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text small"></div>
                `;
                productsGrid.appendChild(skeleton);
            }
            
            // Remover skeletons después de cargar contenido real
            setTimeout(() => {
                this.removeSkeletons('.skeleton-card');
            }, 2000);
        }
    }

    createContactSkeletons() {
        const contactGrid = document.querySelector('.contact-grid');
        if (contactGrid && contactGrid.children.length === 0) {
            for (let i = 0; i < 3; i++) {
                const skeleton = document.createElement('div');
                skeleton.className = 'skeleton-card';
                skeleton.innerHTML = `
                    <div class="skeleton skeleton-text large"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text small"></div>
                `;
                contactGrid.appendChild(skeleton);
            }
            
            setTimeout(() => {
                this.removeSkeletons('.contact-grid .skeleton-card');
            }, 1500);
        }
    }

    removeSkeletons(selector) {
        const skeletons = document.querySelectorAll(selector);
        skeletons.forEach((skeleton, index) => {
            setTimeout(() => {
                skeleton.style.opacity = '0';
                setTimeout(() => skeleton.remove(), 300);
            }, index * 100);
        });
    }

    onDOMReady() {
        // Aplicar clases de animación a elementos
        this.applyAnimationClasses();
        
        // Configurar lazy loading para imágenes
        this.setupLazyImages();
        
        // Inicializar observadores
        this.startObserving();
        
        // Configurar smooth scrolling mejorado
        this.setupSmoothScrolling();
    }

    applyAnimationClasses() {
        // Hero section
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('fade-in');
        }

        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.classList.add('slide-in-right');
        }

        // Products
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            card.classList.add('stagger-item');
            card.style.transitionDelay = `${index * 0.1}s`;
        });

        // Sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('section-transition');
        });

        // Stats
        const stats = document.querySelectorAll('.stat, .global-stat');
        stats.forEach(stat => {
            stat.classList.add('scale-in');
        });

        // Contact items
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            item.classList.add('fade-in');
        });
    }

    setupLazyImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = this.observers.get('images');
        
        images.forEach(img => {
            img.classList.add('lazy-image');
            imageObserver.observe(img);
        });
    }

    startObserving() {
        const animationObserver = this.observers.get('animation');
        const staggerObserver = this.observers.get('stagger');

        // Observar elementos con animaciones
        const animatedElements = document.querySelectorAll(
            '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .rotate-in, .section-transition'
        );
        
        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });

        // Observar contenedores con elementos staggered
        const staggerContainers = document.querySelectorAll(
            '.products-grid, .global-stats, .contact-grid, .products-showcase'
        );
        
        staggerContainers.forEach(container => {
            staggerObserver.observe(container);
        });
    }

    setupSmoothScrolling() {
        // Mejorar el smooth scrolling nativo
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });
    }

    smoothScrollTo(target) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight;
        
        // Usar requestAnimationFrame para scroll más suave
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    triggerLoadComplete() {
        // Disparar evento personalizado cuando la carga esté completa
        const event = new CustomEvent('smoothLoadComplete', {
            detail: { timestamp: Date.now() }
        });
        document.dispatchEvent(event);
        
        // Inicializar funcionalidades que dependen de la carga completa
        this.initPostLoadFeatures();
    }

    initPostLoadFeatures() {
        // Animaciones de números (counters)
        this.animateCounters();
        
        // Efectos de hover mejorados
        this.enhanceHoverEffects();
        
        // Preload de recursos adicionales
        this.preloadAdditionalResources();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number, .global-stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = counter.textContent.replace(/^\d+/, target);
                }
            };
            
            // Iniciar animación cuando el elemento sea visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    enhanceHoverEffects() {
        // Mejorar efectos de hover con transiciones suaves
        const cards = document.querySelectorAll('.product-card, .contact-item, .product-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    preloadAdditionalResources() {
        // Precargar recursos que se usarán más tarde
        const preloadImages = [
            'assets/images/zivah-og-image.jpg',
            'assets/images/zivah-twitter-image.jpg'
        ];
        
        preloadImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Métodos públicos para uso externo
    showComponentLoader(element) {
        element.classList.add('component-loading');
    }

    hideComponentLoader(element) {
        element.classList.remove('component-loading');
    }

    showFormLoader(form) {
        form.classList.add('form-loading');
    }

    hideFormLoader(form) {
        form.classList.remove('form-loading');
    }

    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// Inicializar el sistema de loading
const smoothLoader = new SmoothLoader();

// Hacer disponible globalmente
window.SmoothLoader = smoothLoader;

// Funciones de utilidad para uso externo
window.showLoader = (element) => smoothLoader.showComponentLoader(element);
window.hideLoader = (element) => smoothLoader.hideComponentLoader(element);
window.showFormLoader = (form) => smoothLoader.showFormLoader(form);
window.hideFormLoader = (form) => smoothLoader.hideFormLoader(form);

// Event listeners para funcionalidades adicionales
document.addEventListener('smoothLoadComplete', () => {
    console.log('🚀 ZIVAH International - Carga completa con animaciones suaves');
    
    // Opcional: Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_load_complete', {
            'event_category': 'performance',
            'event_label': 'smooth_loading',
            'value': Date.now()
        });
    }
});

// Manejo de errores de carga
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'assets/images/icons/android-icon-144x144.png';
        e.target.classList.add('loaded', 'error');
    }
});

// Optimización para dispositivos móviles
if (window.innerWidth <= 768) {
    // Reducir animaciones en móviles para mejor rendimiento
    document.documentElement.style.setProperty('--animation-duration', '0.4s');
}

// Soporte para prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduced-motion');
}