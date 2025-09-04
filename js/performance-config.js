// ZIVAH International - Configuración Optimizada para SEO y Rendimiento

// Configuración de rendimiento basada en el dispositivo y conexión
window.ZIVAH_PERFORMANCE_CONFIG = {
    // Detección automática de capacidades
    device: {
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
        isDesktop: window.innerWidth > 1024,
        hasTouch: 'ontouchstart' in window,
        isLowEnd: navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2
    },
    
    // Configuración de conexión
    connection: {
        type: navigator.connection?.effectiveType || 'unknown',
        isSlowConnection: navigator.connection?.effectiveType === 'slow-2g' || 
                         navigator.connection?.effectiveType === '2g',
        isFastConnection: navigator.connection?.effectiveType === '4g',
        saveData: navigator.connection?.saveData || false
    },
    
    // Configuración de usuario
    user: {
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
        isBot: /bot|crawler|spider|crawling/i.test(navigator.userAgent.toLowerCase())
    },
    
    // Configuración adaptativa de loading
    loading: {
        // Tiempos adaptativos basados en conexión
        pageLoader: {
            enabled: true,
            minTime: 300,  // Reducido para mejor SEO
            maxTime: 1500, // Máximo 1.5s para no afectar métricas
            showProgress: false // Deshabilitado para mejor rendimiento
        },
        
        // Animaciones mínimas
        animations: {
            enabled: false, // Deshabilitado por defecto para mejor rendimiento
            duration: 200,  // Muy rápido
            threshold: 0.3, // Menos sensible
            staggerDelay: 50 // Mínimo delay
        },
        
        // Lazy loading optimizado
        lazyLoading: {
            enabled: true,
            rootMargin: '50px', // Reducido para mejor rendimiento
            threshold: 0.1,
            placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+'
        }
    },
    
    // Configuración SEO-friendly
    seo: {
        // No mostrar loader para bots
        skipLoaderForBots: true,
        
        // Preload crítico
        preloadCritical: [
            'assets/images/zivah-logo.svg'
        ],
        
        // Lazy load no crítico
        lazyLoadNonCritical: true,
        
        // Métricas Core Web Vitals
        coreWebVitals: {
            trackLCP: true,  // Largest Contentful Paint
            trackFID: true,  // First Input Delay
            trackCLS: true   // Cumulative Layout Shift
        }
    }
};

// Función para ajustar configuración basada en condiciones
function optimizeConfigForPerformance() {
    const config = window.ZIVAH_PERFORMANCE_CONFIG;
    
    // Ajustes para dispositivos de baja gama
    if (config.device.isLowEnd) {
        config.loading.animations.enabled = false;
        config.loading.pageLoader.maxTime = 1000;
        config.loading.lazyLoading.rootMargin = '20px';
    }
    
    // Ajustes para conexiones lentas
    if (config.connection.isSlowConnection || config.connection.saveData) {
        config.loading.animations.enabled = false;
        config.loading.pageLoader.enabled = false; // Sin loader en conexiones lentas
        config.loading.lazyLoading.rootMargin = '10px';
    }
    
    // Ajustes para móviles
    if (config.device.isMobile) {
        config.loading.animations.duration = 150;
        config.loading.pageLoader.maxTime = 1000;
    }
    
    // Ajustes para bots (SEO)
    if (config.user.isBot) {
        config.loading.pageLoader.enabled = false;
        config.loading.animations.enabled = false;
        config.loading.lazyLoading.enabled = false; // Cargar todo inmediatamente para bots
    }
    
    // Ajustes para reduced motion
    if (config.user.prefersReducedMotion) {
        config.loading.animations.enabled = false;
        config.loading.pageLoader.minTime = 0;
    }
}

// Aplicar optimizaciones
optimizeConfigForPerformance();

// Utilidades de rendimiento
window.ZIVAH_PERFORMANCE_UTILS = {
    // Medir Core Web Vitals
    measureCoreWebVitals() {
        if (!window.ZIVAH_PERFORMANCE_CONFIG.seo.coreWebVitals.trackLCP) return;
        
        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', Math.round(lastEntry.startTime), 'ms');
            
            // Enviar a analytics si está disponible
            if (typeof gtag !== 'undefined') {
                gtag('event', 'web_vitals', {
                    event_category: 'performance',
                    event_label: 'LCP',
                    value: Math.round(lastEntry.startTime)
                });
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', Math.round(entry.processingStart - entry.startTime), 'ms');
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'web_vitals', {
                        event_category: 'performance',
                        event_label: 'FID',
                        value: Math.round(entry.processingStart - entry.startTime)
                    });
                }
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            
            console.log('CLS:', clsValue.toFixed(4));
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'web_vitals', {
                    event_category: 'performance',
                    event_label: 'CLS',
                    value: Math.round(clsValue * 1000)
                });
            }
        }).observe({ entryTypes: ['layout-shift'] });
    },
    
    // Preload recursos críticos
    preloadCriticalResources() {
        const resources = window.ZIVAH_PERFORMANCE_CONFIG.seo.preloadCritical;
        
        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.includes('.css') ? 'style' : 'image';
            link.href = resource;
            document.head.appendChild(link);
        });
    },
    
    // Lazy load recursos no críticos
    lazyLoadNonCritical() {
        // Lazy load de scripts no críticos
        const nonCriticalScripts = [
            'js/seo-utils.js'
        ];
        
        // Cargar después del load event
        window.addEventListener('load', () => {
            setTimeout(() => {
                nonCriticalScripts.forEach(script => {
                    const scriptEl = document.createElement('script');
                    scriptEl.src = script;
                    scriptEl.async = true;
                    document.head.appendChild(scriptEl);
                });
            }, 1000);
        });
    },
    
    // Optimizar imágenes
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Añadir loading="lazy" si no está presente
            if (!img.hasAttribute('loading') && !img.closest('.hero')) {
                img.loading = 'lazy';
            }
            
            // Añadir decoding="async" para mejor rendimiento
            if (!img.hasAttribute('decoding')) {
                img.decoding = 'async';
            }
        });
    },
    
    // Throttle para eventos de scroll
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
    },
    
    // Debounce para resize
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
    },
    
    // Detectar si el elemento está en viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Inicialización automática de optimizaciones
document.addEventListener('DOMContentLoaded', () => {
    const utils = window.ZIVAH_PERFORMANCE_UTILS;
    
    // Solo en producción o si no es un bot
    if (!window.ZIVAH_PERFORMANCE_CONFIG.user.isBot) {
        // Preload recursos críticos
        utils.preloadCriticalResources();
        
        // Optimizar imágenes
        utils.optimizeImages();
        
        // Lazy load no críticos
        if (window.ZIVAH_PERFORMANCE_CONFIG.seo.lazyLoadNonCritical) {
            utils.lazyLoadNonCritical();
        }
        
        // Medir Core Web Vitals (solo en producción)
        if (window.location.hostname !== 'localhost') {
            utils.measureCoreWebVitals();
        }
    }
});

// Exportar configuración para otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ZIVAH_PERFORMANCE_CONFIG: window.ZIVAH_PERFORMANCE_CONFIG,
        ZIVAH_PERFORMANCE_UTILS: window.ZIVAH_PERFORMANCE_UTILS
    };
}

// Log de configuración aplicada (solo en desarrollo)
if (window.location.hostname === 'localhost') {
    console.log('🔧 ZIVAH Performance Config:', window.ZIVAH_PERFORMANCE_CONFIG);
}