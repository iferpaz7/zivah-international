// ZIVAH International - Sistema de Loading Optimizado para SEO y Rendimiento
class SmoothLoaderLite {
    constructor() {
        this.config = {
            // Configuración mínima para máximo rendimiento
            pageLoader: {
                enabled: true,
                maxTime: 2000, // Máximo 2 segundos
                minTime: 500   // Mínimo 0.5 segundos
            },
            animations: {
                enabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                duration: 400, // Más rápido para mejor rendimiento
                threshold: 0.2 // Menos sensible para reducir cálculos
            },
            lazyLoading: {
                enabled: true,
                rootMargin: '100px' // Cargar antes para mejor UX
            }
        };
        
        this.observers = new Map();
        this.loadStartTime = performance.now();
        
        // Solo inicializar si es necesario
        if (this.shouldInitialize()) {
            this.init();
        }
    }

    shouldInitialize() {
        // No inicializar en bots de SEO
        const userAgent = navigator.userAgent.toLowerCase();
        const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
        
        // No inicializar si prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // No inicializar en conexiones muy lentas
        const isSlowConnection = navigator.connection && 
            (navigator.connection.effectiveType === 'slow-2g' || 
             navigator.connection.effectiveType === '2g');
        
        return !isBot && !prefersReducedMotion && !isSlowConnection;
    }

    init() {
        // Usar requestIdleCallback para no bloquear el hilo principal
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => this.setupCore());
        } else {
            setTimeout(() => this.setupCore(), 0);
        }
    }

    setupCore() {
        // Solo funcionalidades esenciales
        this.setupPageLoader();
        this.setupLazyLoading();
        this.setupMinimalAnimations();
        
        // Cleanup automático después de la carga
        window.addEventListener('load', () => {
            setTimeout(() => this.cleanup(), 3000);
        });
    }

    setupPageLoader() {
        // Loader mínimo y rápido
        const loader = document.createElement('div');
        loader.className = 'page-loader-lite';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo">
                    <img src="assets/images/icons/favicon-96x96.png" alt="ZIVAH">
                </div>
                <div class="loader-bar"></div>
            </div>
        `;
        
        // Estilos inline para evitar FOUC
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #ff6347, #16a085);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(loader);
        
        // Auto-hide con timeout de seguridad
        const hideLoader = () => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        };
        
        // Hide cuando todo esté listo
        if (document.readyState === 'complete') {
            setTimeout(hideLoader, this.config.pageLoader.minTime);
        } else {
            window.addEventListener('load', () => {
                setTimeout(hideLoader, this.config.pageLoader.minTime);
            });
        }
        
        // Timeout de seguridad
        setTimeout(hideLoader, this.config.pageLoader.maxTime);
    }

    setupLazyLoading() {
        if (!('IntersectionObserver' in window)) return;
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: this.config.lazyLoading.rootMargin,
            threshold: 0.1
        });

        // Observar imágenes lazy
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            imageObserver.observe(img);
        });

        this.observers.set('images', imageObserver);
    }

    setupMinimalAnimations() {
        if (!this.config.animations.enabled) return;
        
        // Animation observer for entrance effects
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: this.config.animations.threshold,
            rootMargin: '50px 0px -100px 0px'
        });

        // Stagger observer for grouped elements
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
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.observers.set('animation', animationObserver);
        this.observers.set('stagger', staggerObserver);

        // Start observing
        requestIdleCallback(() => this.startObserving(), { timeout: 2000 });
        
        // Setup smooth scrolling
        this.setupSmoothScrolling();
    }

    startObserving() {
        const animationObserver = this.observers.get('animation');
        const staggerObserver = this.observers.get('stagger');

        if (!animationObserver || !staggerObserver) return;

        // Observe animated elements
        const animatedElements = document.querySelectorAll(
            '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .rotate-in, .section-transition'
        );
        
        animatedElements.forEach(el => {
            if (!el.classList.contains('visible')) {
                animationObserver.observe(el);
            }
        });

        // Observe stagger containers
        const staggerContainers = document.querySelectorAll(
            '.products-grid, .products-showcase, .hero-stats'
        );
        
        staggerContainers.forEach(container => {
            staggerObserver.observe(container);
        });
    }

    setupSmoothScrolling() {
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
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        this.animateScroll(targetPosition, 800);
    }

    animateScroll(targetPosition, duration = 800) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    // Métodos públicos mínimos
    showFormLoader(form) {
        if (!form) return;
        const btn = form.querySelector('button[type="submit"], .btn-submit');
        if (btn) {
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';
            btn.dataset.originalText = btn.textContent;
            btn.textContent = 'Enviando...';
        }
    }

    hideFormLoader(form) {
        if (!form) return;
        const btn = form.querySelector('button[type="submit"], .btn-submit');
        if (btn && btn.dataset.originalText) {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            btn.textContent = btn.dataset.originalText;
            delete btn.dataset.originalText;
        }
    }

    // Cleanup para liberar memoria
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Remover event listeners innecesarios
        const unusedElements = document.querySelectorAll('.page-loader-lite');
        unusedElements.forEach(el => el.remove());
        
        // Log de rendimiento (solo en desarrollo)
        if (window.location.hostname === 'localhost') {
            const loadTime = performance.now() - this.loadStartTime;
            console.log(`🚀 ZIVAH Loading completado en ${Math.round(loadTime)}ms`);
        }
    }
}

// CSS crítico inline para evitar FOUC
const criticalCSS = `
<style>
.page-loader-lite .loader-content {
    text-align: center;
    color: white;
}
.page-loader-lite .loader-logo img {
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
    filter: brightness(1.2);
}
.page-loader-lite .loader-bar {
    width: 200px;
    height: 3px;
    background: rgba(255,255,255,0.3);
    border-radius: 2px;
    overflow: hidden;
    margin: 0 auto;
}
.page-loader-lite .loader-bar::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 2px;
    animation: loadingBar 2s ease-in-out infinite;
}
@keyframes loadingBar {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(0%); }
    100% { transform: translateX(100%); }
}
img[data-src] {
    background: #f0f0f0;
    min-height: 100px;
}
@media (prefers-reduced-motion: reduce) {
    .page-loader-lite .loader-bar::after {
        animation: none;
        transform: none;
    }
}
</style>
`;

// Inyectar CSS crítico solo si es necesario
if (!document.querySelector('#zivah-critical-css')) {
    const style = document.createElement('style');
    style.id = 'zivah-critical-css';
    style.innerHTML = criticalCSS.replace(/<\/?style>/g, '');
    document.head.appendChild(style);
}

// Inicialización condicional
let smoothLoaderLite = null;

// Solo inicializar si no es un bot y el DOM está listo
if (!/bot|crawler|spider/i.test(navigator.userAgent)) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            smoothLoaderLite = new SmoothLoaderLite();
        });
    } else {
        smoothLoaderLite = new SmoothLoaderLite();
    }
}

// Exportar versión lite
window.SmoothLoaderLite = smoothLoaderLite;

// Funciones globales mínimas
window.showFormLoader = (form) => smoothLoaderLite?.showFormLoader(form);
window.hideFormLoader = (form) => smoothLoaderLite?.hideFormLoader(form);

// Métricas de rendimiento para desarrollo
if (window.location.hostname === 'localhost' && 'performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('📊 ZIVAH Performance Metrics:', {
                'DOM Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart) + 'ms',
                'Load Complete': Math.round(perfData.loadEventEnd - perfData.loadEventStart) + 'ms',
                'First Paint': Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0) + 'ms'
            });
        }, 1000);
    });
}