// ZIVAH International - Configuración del Sistema de Loading

// Configuración global del smooth loading
window.ZIVAH_LOADING_CONFIG = {
    // Configuración del loader principal
    pageLoader: {
        enabled: true,
        minDisplayTime: 1000, // Tiempo mínimo de visualización en ms
        maxDisplayTime: 5000, // Tiempo máximo antes de forzar ocultación
        showProgress: true,
        messages: [
            'Cargando productos ecuatorianos premium...',
            'Conectando Ecuador con el mundo...',
            'Preparando la mejor experiencia...',
            'Cargando calidad ZIVAH...'
        ]
    },
    
    // Configuración de animaciones
    animations: {
        enabled: true,
        duration: 800, // Duración base de animaciones en ms
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Función de easing
        staggerDelay: 100, // Delay entre elementos en animaciones escalonadas
        reducedMotion: false // Se detecta automáticamente
    },
    
    // Configuración de lazy loading
    lazyLoading: {
        enabled: true,
        rootMargin: '50px', // Margen para cargar antes de que sea visible
        threshold: 0.1, // Porcentaje de visibilidad para activar carga
        placeholder: 'assets/images/icons/android-icon-144x144.png',
        fadeInDuration: 500
    },
    
    // Configuración de skeleton loaders
    skeletons: {
        enabled: true,
        showFor: ['products', 'contact', 'stats'],
        animationDuration: 1500,
        removeDelay: 2000
    },
    
    // Configuración de intersection observers
    observers: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        trackVisibility: true
    },
    
    // Configuración específica por sección
    sections: {
        hero: {
            animationType: 'fade-in',
            delay: 0,
            duration: 1000
        },
        products: {
            animationType: 'stagger',
            delay: 200,
            duration: 800
        },
        stats: {
            animationType: 'scale-in',
            delay: 300,
            duration: 600,
            countAnimation: true
        },
        contact: {
            animationType: 'slide-in-left',
            delay: 100,
            duration: 700
        }
    },
    
    // Configuración de rendimiento
    performance: {
        enableRAF: true, // Usar requestAnimationFrame
        enableGPU: true, // Usar aceleración por GPU
        batchUpdates: true, // Agrupar actualizaciones DOM
        debounceScroll: 16, // Debounce para eventos de scroll
        preloadCritical: true
    },
    
    // Configuración de debugging
    debug: {
        enabled: false, // Cambiar a true para debugging
        logAnimations: false,
        logPerformance: false,
        showTimings: false
    }
};

// Detectar preferencias del usuario
(function detectUserPreferences() {
    // Detectar reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.ZIVAH_LOADING_CONFIG.animations.enabled = false;
        window.ZIVAH_LOADING_CONFIG.animations.reducedMotion = true;
        window.ZIVAH_LOADING_CONFIG.pageLoader.minDisplayTime = 500;
    }
    
    // Detectar conexión lenta
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            window.ZIVAH_LOADING_CONFIG.lazyLoading.rootMargin = '20px';
            window.ZIVAH_LOADING_CONFIG.animations.duration = 400;
            window.ZIVAH_LOADING_CONFIG.skeletons.removeDelay = 1000;
        }
    }
    
    // Detectar dispositivo móvil
    if (window.innerWidth <= 768) {
        window.ZIVAH_LOADING_CONFIG.animations.duration = 600;
        window.ZIVAH_LOADING_CONFIG.animations.staggerDelay = 50;
        window.ZIVAH_LOADING_CONFIG.pageLoader.minDisplayTime = 800;
    }
    
    // Detectar batería baja (si está disponible)
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            if (battery.level < 0.2) {
                window.ZIVAH_LOADING_CONFIG.animations.enabled = false;
                window.ZIVAH_LOADING_CONFIG.performance.enableGPU = false;
            }
        });
    }
})();

// Utilidades para el sistema de loading
window.ZIVAH_LOADING_UTILS = {
    // Generar mensaje aleatorio del loader
    getRandomLoaderMessage() {
        const messages = window.ZIVAH_LOADING_CONFIG.pageLoader.messages;
        return messages[Math.floor(Math.random() * messages.length)];
    },
    
    // Verificar si las animaciones están habilitadas
    areAnimationsEnabled() {
        return window.ZIVAH_LOADING_CONFIG.animations.enabled && 
               !window.ZIVAH_LOADING_CONFIG.animations.reducedMotion;
    },
    
    // Obtener duración de animación ajustada
    getAnimationDuration(multiplier = 1) {
        const baseDuration = window.ZIVAH_LOADING_CONFIG.animations.duration;
        return this.areAnimationsEnabled() ? baseDuration * multiplier : 0;
    },
    
    // Crear elemento skeleton
    createSkeleton(type = 'card') {
        const skeleton = document.createElement('div');
        skeleton.className = `skeleton-${type}`;
        
        switch (type) {
            case 'card':
                skeleton.innerHTML = `
                    <div class="skeleton skeleton-image"></div>
                    <div class="skeleton skeleton-text large"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text small"></div>
                `;
                break;
            case 'text':
                skeleton.innerHTML = `
                    <div class="skeleton skeleton-text"></div>
                `;
                break;
            case 'image':
                skeleton.innerHTML = `
                    <div class="skeleton skeleton-image"></div>
                `;
                break;
        }
        
        return skeleton;
    },
    
    // Log de debugging
    log(message, type = 'info') {
        if (window.ZIVAH_LOADING_CONFIG.debug.enabled) {
            const timestamp = new Date().toISOString();
            console.log(`[ZIVAH Loading ${type.toUpperCase()}] ${timestamp}: ${message}`);
        }
    },
    
    // Medir rendimiento
    measurePerformance(name, fn) {
        if (window.ZIVAH_LOADING_CONFIG.debug.logPerformance) {
            const start = performance.now();
            const result = fn();
            const end = performance.now();
            this.log(`${name} took ${(end - start).toFixed(2)}ms`, 'performance');
            return result;
        }
        return fn();
    },
    
    // Throttle para eventos
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
    
    // Debounce para eventos
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
};

// Configuración específica para ZIVAH International
window.ZIVAH_BRAND_CONFIG = {
    colors: {
        primary: '#ff6347',
        secondary: '#16a085',
        accent: '#26d0ce'
    },
    
    animations: {
        brandEntrance: 'logoFloat',
        productReveal: 'fadeInUp',
        statsCounter: 'countUp'
    },
    
    messages: {
        loading: 'Cargando excelencia ecuatoriana...',
        success: '¡Bienvenido a ZIVAH International!',
        error: 'Error al cargar. Reintentando...'
    }
};

// Exportar configuración para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ZIVAH_LOADING_CONFIG: window.ZIVAH_LOADING_CONFIG,
        ZIVAH_LOADING_UTILS: window.ZIVAH_LOADING_UTILS,
        ZIVAH_BRAND_CONFIG: window.ZIVAH_BRAND_CONFIG
    };
}