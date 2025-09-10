// ZIVAH International S.A. - JavaScript Principal - Consolidated
// =============================================================================
// This file consolidates all JavaScript functionality from the following files:
// - countries-data.js (234 lines) - Country and product data
// - enhanced-dropdown.js (185 lines) - Enhanced dropdown functionality  
// - form-enhancements.js (215 lines) - Form validation and enhancements
// - performance-config.js (296 lines) - Performance optimization config
// - smooth-loading-lite.js (400 lines) - Smooth loading system
// - main.js (907 lines) - Core application functionality
// 
// Total consolidated: ~2070 lines for better performance and maintenance
// =============================================================================

// ============================================================================
// COUNTRIES DATA - Consolidated from countries-data.js
// ============================================================================

// Países de exportación de Ecuador - Principales destinos comerciales
const ECUADOR_EXPORT_COUNTRIES = [
  // América del Norte
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', region: 'América del Norte' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦', region: 'América del Norte' },
  { code: 'MX', name: 'México', flag: '🇲🇽', region: 'América del Norte' },

  // América del Sur
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', region: 'América del Sur' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'América del Sur' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'América del Sur' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'América del Sur' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪', region: 'América del Sur' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', region: 'América del Sur' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', region: 'América del Sur' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', region: 'América del Sur' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', region: 'América del Sur' },

  // Europa
  { code: 'ES', name: 'España', flag: '🇪🇸', region: 'Europa' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹', region: 'Europa' },
  { code: 'FR', name: 'Francia', flag: '🇫🇷', region: 'Europa' },
  { code: 'DE', name: 'Alemania', flag: '🇩🇪', region: 'Europa' },
  { code: 'NL', name: 'Países Bajos', flag: '🇳🇱', region: 'Europa' },
  { code: 'BE', name: 'Bélgica', flag: '🇧🇪', region: 'Europa' },
  { code: 'UK', name: 'Reino Unido', flag: '🇬🇧', region: 'Europa' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'Europa' },
  { code: 'SE', name: 'Suecia', flag: '🇸🇪', region: 'Europa' },
  { code: 'NO', name: 'Noruega', flag: '🇳🇴', region: 'Europa' },
  { code: 'DK', name: 'Dinamarca', flag: '🇩🇰', region: 'Europa' },
  { code: 'FI', name: 'Finlandia', flag: '🇫🇮', region: 'Europa' },
  { code: 'CH', name: 'Suiza', flag: '🇨🇭', region: 'Europa' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'Europa' },

  // Asia
  { code: 'JP', name: 'Japón', flag: '🇯🇵', region: 'Asia' },
  { code: 'KR', name: 'Corea del Sur', flag: '🇰🇷', region: 'Asia' },
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia' },
  { code: 'SG', name: 'Singapur', flag: '🇸🇬', region: 'Asia' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', region: 'Asia' },
  { code: 'TW', name: 'Taiwán', flag: '🇹🇼', region: 'Asia' },
  { code: 'TH', name: 'Tailandia', flag: '🇹🇭', region: 'Asia' },
  { code: 'MY', name: 'Malasia', flag: '🇲🇾', region: 'Asia' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'Asia' },
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'Asia' },
  { code: 'PH', name: 'Filipinas', flag: '🇵🇭', region: 'Asia' },

  // Medio Oriente
  { code: 'AE', name: 'Emiratos Árabes Unidos', flag: '🇦🇪', region: 'Medio Oriente' },
  { code: 'SA', name: 'Arabia Saudita', flag: '🇸🇦', region: 'Medio Oriente' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', region: 'Medio Oriente' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', region: 'Medio Oriente' },
  { code: 'BH', name: 'Bahréin', flag: '🇧🇭', region: 'Medio Oriente' },
  { code: 'OM', name: 'Omán', flag: '🇴🇲', region: 'Medio Oriente' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', region: 'Medio Oriente' },
  { code: 'TR', name: 'Turquía', flag: '🇹🇷', region: 'Medio Oriente' },

  // África
  { code: 'ZA', name: 'Sudáfrica', flag: '🇿🇦', region: 'África' },
  { code: 'EG', name: 'Egipto', flag: '🇪🇬', region: 'África' },
  { code: 'MA', name: 'Marruecos', flag: '🇲🇦', region: 'África' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'África' },
  { code: 'KE', name: 'Kenia', flag: '🇰🇪', region: 'África' },

  // Oceanía
  { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Oceanía' },
  { code: 'NZ', name: 'Nueva Zelanda', flag: '🇳🇿', region: 'Oceanía' },

  // Centroamérica y Caribe
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', region: 'Centroamérica' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', region: 'Centroamérica' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦', region: 'Centroamérica' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', region: 'Centroamérica' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', region: 'Centroamérica' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', region: 'Centroamérica' },
  { code: 'BZ', name: 'Belice', flag: '🇧🇿', region: 'Centroamérica' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', region: 'Caribe' },
  { code: 'TT', name: 'Trinidad y Tobago', flag: '🇹🇹', region: 'Caribe' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧', region: 'Caribe' },
  { code: 'DO', name: 'República Dominicana', flag: '🇩🇴', region: 'Caribe' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', region: 'Caribe' }
];

// Productos de exportación de Ecuador organizados por categorías
const ECUADOR_EXPORT_PRODUCTS = [
  {
    category: 'Frutas Tropicales',
    icon: '🥭',
    products: [
      { value: 'aguacate', name: 'Aguacate Hass', icon: '🥑', description: 'Premium export quality' },
      { value: 'mango', name: 'Mango Premium', icon: '🥭', description: 'Tommy Atkins y Kent' },
      { value: 'papaya', name: 'Papaya Hawaiana', icon: '🧡', description: 'Dulzura natural' },
      { value: 'pina', name: 'Piña Golden MD2', icon: '🍍', description: 'Máxima calidad' },
      { value: 'platano', name: 'Plátano Verde', icon: '🍌', description: 'Para exportación' },
      { value: 'coco', name: 'Coco Tropical', icon: '🥥', description: 'Costa ecuatoriana' },
      { value: 'pitahaya', name: 'Pitahaya', icon: '🐉', description: 'Fruta del dragón' }
    ]
  },
  {
    category: 'Productos del Mar',
    icon: '🦐',
    products: [
      { value: 'camaron', name: 'Camarón Blanco Premium', icon: '🦐', description: 'Vannamei certificado' },
      { value: 'atun', name: 'Atún Fresco', icon: '🐟', description: 'Captura sustentable' },
      { value: 'mahi-mahi', name: 'Mahi-Mahi', icon: '🐠', description: 'Dorado del Pacífico' },
      { value: 'pescado-blanco', name: 'Pescado Blanco', icon: '🐟', description: 'Variedades selectas' }
    ]
  },
  {
    category: 'Café y Especias',
    icon: '☕',
    products: [
      { value: 'cafe', name: 'Café Arábica de Altura', icon: '☕', description: 'Montañas andinas' },
      { value: 'curcuma', name: 'Cúrcuma', icon: '🟡', description: 'Propiedades medicinales' },
      { value: 'jengibre', name: 'Jengibre Fresco', icon: '🫚', description: 'Calidad exportación' },
      { value: 'canela', name: 'Canela', icon: '🟤', description: 'Aroma intenso' }
    ]
  },
  {
    category: 'Tubérculos y Vegetales',
    icon: '🍠',
    products: [
      { value: 'yuca', name: 'Yuca Premium', icon: '🍠', description: 'Procesamiento industrial' },
      { value: 'camote', name: 'Camote Dulce', icon: '🍠', description: 'Rica en nutrientes' },
      { value: 'name', name: 'Ñame Tropical', icon: '🍠', description: 'Variedades autóctonas' },
      { value: 'nampi', name: 'Ñampí', icon: '🍠', description: 'Tubérculo andino' },
      { value: 'calabaza', name: 'Calabaza Premium', icon: '🎃', description: 'Cultivo orgánico' },
      { value: 'cebolla', name: 'Cebolla Premium', icon: '🧅', description: 'Variedades selectas' },
      { value: 'chayote', name: 'Chayote Orgánico', icon: '🥒', description: 'Certificado internacional' }
    ]
  },
  {
    category: 'Acuicultura y Biotecnología',
    icon: '🧬',
    products: [
      { value: 'larvas', name: 'Larvas de Camarón', icon: '🧬', description: 'Laboratorio certificado' },
      { value: 'reproductores', name: 'Reproductores de Camarón', icon: '🦐', description: 'Genética superior' },
      { value: 'alimento-balanceado', name: 'Alimento Balanceado Acuícola', icon: '🌾', description: 'Nutrición acuícola' }
    ]
  },
  {
    category: 'Árboles y Plantas',
    icon: '🌳',
    products: [
      { value: 'arboles-mango', name: 'Árboles de Mango', icon: '🥭', description: 'Variedades tropicales' },
      { value: 'arboles-aguacate', name: 'Árboles de Aguacate', icon: '🥑', description: 'Hass y criollos' },
      { value: 'arboles-citricos', name: 'Árboles Cítricos', icon: '🍊', description: 'Naranja, limón, mandarina' },
      { value: 'arboles-cacao', name: 'Árboles de Cacao', icon: '🍫', description: 'Fino de aroma' },
      { value: 'palmito', name: 'Palmito Orgánico', icon: '🌴', description: 'Sustentable certificado' }
    ]
  },
  {
    category: 'Nueces y Frutos Secos',
    icon: '🥜',
    products: [
      { value: 'macadamia', name: 'Nueces de Macadamia', icon: '🥜', description: 'Cultivo especializado' },
      { value: 'pecanas', name: 'Nueces Pecanas', icon: '🥜', description: 'Adaptadas al trópico' },
      { value: 'almendras', name: 'Almendras Tropicales', icon: '🥜', description: 'Variedades ecuatorianas' }
    ]
  },
  {
    category: 'Cereales y Otros',
    icon: '🌾',
    products: [
      { value: 'cana-azucar', name: 'Caña de Azúcar', icon: '🎋', description: 'Procesamiento natural' },
      { value: 'quinoa', name: 'Quinoa Andina', icon: '🌾', description: 'Superfood certificado' },
      { value: 'cacao-grano', name: 'Cacao Fino de Aroma', icon: '🍫', description: 'Calidad premium' },
      { value: 'otro', name: 'Otro producto', icon: '📦', description: 'Producto específico' },
      { value: 'multiple', name: 'Múltiples Productos', icon: '📦', description: 'Combinación personalizada' }
    ]
  }
];

// Función para obtener países por región
function getCountriesByRegion() {
  const regions = {};
  ECUADOR_EXPORT_COUNTRIES.forEach(country => {
    if (!regions[country.region]) {
      regions[country.region] = [];
    }
    regions[country.region].push(country);
  });
  return regions;
}

// Función para buscar países
function searchCountries(query) {
  return ECUADOR_EXPORT_COUNTRIES.filter(country => 
    country.name.toLowerCase().includes(query.toLowerCase()) ||
    country.code.toLowerCase().includes(query.toLowerCase())
  );
}

// Función para obtener productos por categoría
function getProductsByCategory() {
  return ECUADOR_EXPORT_PRODUCTS;
}

// Función para buscar productos
function searchProducts(query) {
  const results = [];
  ECUADOR_EXPORT_PRODUCTS.forEach(category => {
    const matchingProducts = category.products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.value.toLowerCase().includes(query.toLowerCase()) ||
      category.category.toLowerCase().includes(query.toLowerCase())
    );
    
    if (matchingProducts.length > 0) {
      results.push({
        ...category,
        products: matchingProducts
      });
    }
  });
  return results;
}

// ============================================================================
// PERFORMANCE CONFIG - Consolidated from performance-config.js
// ============================================================================

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
            'assets/images/icons/favicon-96x96.png'
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

// ============================================================================
// SMOOTH LOADER LITE - Consolidated from smooth-loading-lite.js
// ============================================================================

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
                enabled: false, // Animations disabled for performance
                duration: 0,
                threshold: 0
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

// ============================================================================
// ENHANCED DROPDOWN - Consolidated from enhanced-dropdown.js
// ============================================================================

// Enhanced Country Dropdown with Search and Better Styling
class EnhancedCountryDropdown {
  constructor(selectElement) {
    this.originalSelect = selectElement;
    this.isOpen = false;
    this.selectedCountry = null;
    this.filteredCountries = [...ECUADOR_EXPORT_COUNTRIES];
    
    this.init();
  }

  init() {
    this.createCustomDropdown();
    this.bindEvents();
    this.populateOriginalSelect();
  }

  createCustomDropdown() {
    // Crear contenedor principal
    this.container = document.createElement('div');
    this.container.className = 'enhanced-dropdown-container';
    
    // Crear el botón principal
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.className = 'enhanced-dropdown-button';
    this.button.innerHTML = `
      <span class="dropdown-text">Selecciona país</span>
      <span class="dropdown-arrow">▼</span>
    `;
    
    // Crear el panel desplegable
    this.panel = document.createElement('div');
    this.panel.className = 'enhanced-dropdown-panel';
    
    // Crear campo de búsqueda
    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.className = 'dropdown-search';
    this.searchInput.placeholder = 'Buscar país...';
    
    // Crear lista de opciones
    this.optionsList = document.createElement('div');
    this.optionsList.className = 'dropdown-options';
    
    // Ensamblar el panel
    this.panel.appendChild(this.searchInput);
    this.panel.appendChild(this.optionsList);
    
    // Ensamblar el contenedor
    this.container.appendChild(this.button);
    this.container.appendChild(this.panel);
    
    // Reemplazar el select original
    this.originalSelect.style.display = 'none';
    this.originalSelect.parentNode.insertBefore(this.container, this.originalSelect);
    
    this.renderOptions();
  }

  renderOptions() {
    this.optionsList.innerHTML = '';
    
    // Agrupar por región
    const regions = getCountriesByRegion();
    
    Object.keys(regions).forEach(regionName => {
      const regionCountries = regions[regionName].filter(country => 
        this.filteredCountries.includes(country)
      );
      
      if (regionCountries.length === 0) return;
      
      // Crear encabezado de región
      const regionHeader = document.createElement('div');
      regionHeader.className = 'dropdown-region-header';
      regionHeader.textContent = regionName;
      this.optionsList.appendChild(regionHeader);
      
      // Crear opciones de países
      regionCountries.forEach(country => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.dataset.value = country.code;
        option.innerHTML = `
          <span class="country-flag">${country.flag}</span>
          <span class="country-name">${country.name}</span>
          <span class="country-code">${country.code}</span>
        `;
        
        option.addEventListener('click', () => this.selectCountry(country));
        this.optionsList.appendChild(option);
      });
    });
  }

  bindEvents() {
    // Toggle dropdown
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });
    
    // Búsqueda
    this.searchInput.addEventListener('input', (e) => {
      this.filterCountries(e.target.value);
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.close();
      }
    });
    
    // Navegación con teclado
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  filterCountries(query) {
    if (!query.trim()) {
      this.filteredCountries = [...ECUADOR_EXPORT_COUNTRIES];
    } else {
      this.filteredCountries = searchCountries(query);
    }
    this.renderOptions();
  }

  selectCountry(country) {
    this.selectedCountry = country;
    this.button.querySelector('.dropdown-text').innerHTML = `
      <span class="selected-flag">${country.flag}</span>
      <span class="selected-name">${country.name}</span>
    `;
    
    // Actualizar select original
    this.originalSelect.value = country.code;
    
    // Disparar evento change
    const event = new Event('change', { bubbles: true });
    this.originalSelect.dispatchEvent(event);
    
    this.close();
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.container.classList.add('open');
    this.searchInput.focus();
    this.searchInput.value = '';
    this.filteredCountries = [...ECUADOR_EXPORT_COUNTRIES];
    this.renderOptions();
  }

  close() {
    this.isOpen = false;
    this.container.classList.remove('open');
  }

  populateOriginalSelect() {
    // No sobrescribir las opciones existentes, solo mejorar la funcionalidad
    // Las opciones ya están definidas en el HTML
    console.log('Enhanced dropdown initialized with existing options');
  }
}

// ============================================================================
// FORM ENHANCEMENTS - Consolidated from form-enhancements.js
// ============================================================================

// Enhanced form validation and animations
function initFormEnhancements() {
    // Mejorar validación del formulario
    const form = document.getElementById('quote-form');
    if (form) {
        enhanceFormValidation(form);
    }

    // Agregar animaciones a los campos del formulario
    enhanceFormAnimations();

    // Mejorar la experiencia del dropdown de productos
    enhanceProductDropdown();

    // Formateo automático del teléfono
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            formatPhoneNumber(this);
        });
    }
}

function enhanceFormValidation(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
        // Validación en tiempo real
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Validación al enviar
    form.addEventListener('submit', function (e) {
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
            showFormError('Por favor, completa todos los campos requeridos correctamente.');
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';

    // Limpiar errores previos
    clearFieldError(field);

    // Validar campos requeridos
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es requerido';
    }

    // Validaciones específicas
    if (value && fieldType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
        }
    }

    if (value && fieldType === 'tel') {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Ingresa un teléfono válido';
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');

    // Crear o actualizar mensaje de error
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function showFormError(message) {
    // Crear notificación de error
    const notification = document.createElement('div');
    notification.className = 'form-notification error';
    notification.innerHTML = `
    <span class="notification-icon">⚠️</span>
    <span class="notification-message">${message}</span>
    <button class="notification-close" onclick="this.parentNode.remove()">×</button>
  `;

    // Insertar al inicio del formulario
    const form = document.getElementById('quote-form');
    form.insertBefore(notification, form.firstChild);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function enhanceFormAnimations() {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach((group, index) => {
        // Animación de entrada escalonada
        group.style.animationDelay = `${index * 0.1}s`;
        group.classList.add('animate-in');

        const input = group.querySelector('input, select, textarea');
        if (input) {
            // Efecto de enfoque mejorado
            input.addEventListener('focus', function () {
                group.classList.add('focused');
            });

            input.addEventListener('blur', function () {
                group.classList.remove('focused');
            });
        }
    });
}

function enhanceProductDropdown() {
    const productSelect = document.getElementById('product');
    if (!productSelect) return;

    // Los productos ya están definidos en el HTML con optgroups
    // Solo agregar funcionalidad adicional si es necesario
    console.log('Product dropdown enhanced with existing options');

    // Agregar evento para logging (opcional)
    productSelect.addEventListener('change', function () {
        if (this.value) {
            console.log('Producto seleccionado:', this.value);
        }
    });
}

// Función para mostrar notificación de éxito
function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'form-notification success';
    notification.innerHTML = `
    <span class="notification-icon">✅</span>
    <span class="notification-message">${message}</span>
    <button class="notification-close" onclick="this.parentNode.remove()">×</button>
  `;

    document.body.appendChild(notification);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Función para formatear número de teléfono
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 10) {
        if (value.startsWith('1')) {
            value = value.substring(1);
        }
        value = value.substring(0, 10);
        value = `+1 (${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
    }

    input.value = value;
}

// ============================================================================
// PERFORMANCE UTILITIES - From performance-config.js
// ============================================================================

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
        // Esta función está disponible para futuros scripts no críticos
        // Actualmente no hay scripts no críticos para cargar de forma lazy
        
        // Cargar después del load event si se agregan scripts futuros
        window.addEventListener('load', () => {
            // Placeholder para futuros scripts no críticos
            console.log('✅ ZIVAH Performance: All critical resources loaded');
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
        return function () {
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

// Inicialización de utilidades de rendimiento
function initPerformanceUtils() {
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
}

// ============================================================================
// SMOOTH LOADER INITIALIZATION
// ============================================================================

// CSS crítico inline para evitar FOUC
const criticalCSS = `
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
`;

// Inicialización condicional del smooth loader
function initSmoothLoader() {
    // Inyectar CSS crítico solo si es necesario
    if (!document.querySelector('#zivah-critical-css')) {
        const style = document.createElement('style');
        style.id = 'zivah-critical-css';
        style.innerHTML = criticalCSS;
        document.head.appendChild(style);
    }

    // Solo inicializar si no es un bot
    if (!/bot|crawler|spider/i.test(navigator.userAgent)) {
        window.SmoothLoaderLite = new SmoothLoaderLite();
    }
}

// Enhanced dropdown initialization
function initEnhancedDropdown() {
    const countrySelect = document.getElementById('country');
    if (countrySelect) {
        new EnhancedCountryDropdown(countrySelect);
    }
}

// ============================================================================
// MAIN APPLICATION - Original main.js functionality
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initTheme();
    initScrollEffects();
    initMobileMenu();
    initFormHandling();
    initSmoothScrolling();
    initLogoFallback();
    
    // Inicializar componentes consolidados
    initEnhancedDropdown();
    initFormEnhancements();
    initSmoothLoader();
    initPerformanceUtils();
    
    // Animation system disabled for performance optimization
    disableProblematicAnimations();
    
    // Smooth loading integration disabled
    // Performance mode enabled
});

// Enhanced animations removed for better performance
function initEnhancedAnimations() {
    // Animation system disabled for performance optimization
}

// Function to disable problematic animations
function disableProblematicAnimations() {
    // Add performance class to body to disable animations
    document.body.classList.add('performance-mode');
    
    // Force all animated elements to be visible immediately
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .rotate-in, .section-transition');
    animatedElements.forEach(el => {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
    
    // Disable smooth scroll
    document.documentElement.style.scrollBehavior = 'auto';
}

// Sistema de temas (Light/Dark) - Enhanced
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) {
        console.warn('Theme toggle button not found');
        return;
    }
    
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Enhanced theme detection with fallbacks
    let currentTheme = 'light'; // Default fallback
    
    try {
        const savedTheme = localStorage.getItem('zivah-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        
        if (savedTheme && ['dark', 'light'].includes(savedTheme)) {
            currentTheme = savedTheme;
        } else if (systemPrefersDark) {
            currentTheme = 'dark';
        } else if (systemPrefersLight) {
            currentTheme = 'light';
        }
    } catch (e) {
        console.warn('Error detecting theme preference:', e);
    }
    
    // Aplicar tema inicial con performance optimization
    setTheme(currentTheme);
    
    // Enhanced event listener with debouncing
    let themeToggleTimeout;
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Prevent rapid clicking
        if (themeToggleTimeout) return;
        
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add visual feedback
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 150);
        
        setTheme(newTheme);
        
        // Debounce to prevent rapid toggling
        themeToggleTimeout = setTimeout(() => {
            themeToggleTimeout = null;
        }, 300);
    });
    
    // Enhanced system preference listener with error handling
    try {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const lightModeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        
        function handleSystemThemeChange(e) {
            // Only auto-change if user hasn't set a preference
            const hasUserPreference = localStorage.getItem('zivah-theme');
            if (!hasUserPreference) {
                setTheme(e.matches ? 'dark' : 'light');
                
                // Dispatch system change event
                window.dispatchEvent(new CustomEvent('themeChanged', { 
                    detail: { 
                        theme: e.matches ? 'dark' : 'light', 
                        source: 'system_preference',
                        timestamp: Date.now()
                    } 
                }));
            }
        }
        
        // Listen to both dark and light mode changes
        darkModeMediaQuery.addEventListener('change', (e) => {
            if (e.matches) handleSystemThemeChange(e);
        });
        
        lightModeMediaQuery.addEventListener('change', (e) => {
            if (e.matches) handleSystemThemeChange({ matches: false });
        });
        
    } catch (e) {
        console.warn('Error setting up system theme listeners:', e);
    }
    
    // Keyboard accessibility
    themeToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    // Listen for custom theme change events (from other components)
    window.addEventListener('themeChanged', function(e) {
        const { theme, source } = e.detail;
        
        // Update other UI elements that might need theme-specific changes
        updateThemeDependentElements(theme);
        
        // Log for debugging (remove in production)
        console.log(`Theme changed to ${theme} from ${source}`);
    });
}

// Helper function to update theme-dependent elements
function updateThemeDependentElements(theme) {
    // Update any charts, maps, or third-party components that need theme updates
    const charts = document.querySelectorAll('.chart, .map, .graph');
    charts.forEach(chart => {
        if (chart.updateTheme && typeof chart.updateTheme === 'function') {
            chart.updateTheme(theme);
        }
    });
    
    // Update favicon based on theme (if you have dark/light versions)
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon && theme === 'dark') {
        // You could switch to a dark favicon here
        // favicon.href = '/assets/images/icons/favicon-dark.ico';
    }
    
    // Update any embedded content that supports theming
    const embeds = document.querySelectorAll('iframe[data-theme-aware]');
    embeds.forEach(embed => {
        try {
            embed.contentWindow.postMessage({ type: 'theme-change', theme }, '*');
        } catch (e) {
            // Cross-origin iframe, can't communicate
        }
    });
}

function setTheme(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    const themeToggle = document.getElementById('themeToggle');
    
    // Performance optimization: batch DOM updates
    requestAnimationFrame(() => {
        // Aplicar tema al documento con transición suave
        document.documentElement.style.transition = 'none';
        document.documentElement.setAttribute('data-theme', theme);
        
        // Force reflow and re-enable transitions
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 50);
        
        // Actualizar icono y accesibilidad
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeIcon.setAttribute('aria-label', 'Switch to light mode');
            themeToggle.setAttribute('title', 'Cambiar a modo claro');
            themeToggle.setAttribute('aria-pressed', 'true');
            
            // Update meta theme-color for dark mode
            let metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (!metaThemeColor) {
                metaThemeColor = document.createElement('meta');
                metaThemeColor.name = 'theme-color';
                document.head.appendChild(metaThemeColor);
            }
            metaThemeColor.content = '#0f1419';
        } else {
            themeIcon.textContent = '🌙';
            themeIcon.setAttribute('aria-label', 'Switch to dark mode');
            themeToggle.setAttribute('title', 'Cambiar a modo oscuro');
            themeToggle.setAttribute('aria-pressed', 'false');
            
            // Update meta theme-color for light mode
            let metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (!metaThemeColor) {
                metaThemeColor = document.createElement('meta');
                metaThemeColor.name = 'theme-color';
                document.head.appendChild(metaThemeColor);
            }
            metaThemeColor.content = '#ffffff';
        }
        
        // Guardar preferencia con better error handling
        try {
            localStorage.setItem('zivah-theme', theme);
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }
        
        // Update body class for better targeting
        document.body.classList.toggle('theme-dark', theme === 'dark');
        document.body.classList.toggle('theme-light', theme === 'light');
        
        // Dispatch evento personalizado para otros componentes
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { 
                theme, 
                timestamp: Date.now(),
                source: 'user_action'
            } 
        }));
        
        // Analytics tracking (if implemented)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                'theme_mode': theme,
                'event_category': 'UI',
                'event_label': 'Theme Toggle'
            });
        }
    });
}

// Efectos de scroll
function initScrollEffects() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    window.addEventListener('scroll', function() {
        // Mostrar/ocultar botón de scroll to top
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
        
        // Parallax effect removed for better performance
    });
    
    // Click en botón scroll to top
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Menú móvil
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Cambiar icono del menú
            if (navMenu.classList.contains('active')) {
                mobileMenuBtn.innerHTML = '✕';
            } else {
                mobileMenuBtn.innerHTML = '☰';
            }
        });
        
        // Cerrar menú al hacer click en un enlace
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '☰';
            });
        });
    }
}

// Manejo de formularios
function initFormHandling() {
    const quoteForm = document.getElementById('quote-form');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(quoteForm);
            const data = Object.fromEntries(formData);
            
            // Validar campos requeridos
            if (!validateForm(data)) {
                showMessage('Por favor, complete todos los campos requeridos.', 'error');
                return;
            }
            
            // Simular envío (aquí conectarías con tu backend)
            submitQuoteForm(data);
        });
    }
}

// Validación de formulario
function validateForm(data) {
    const requiredFields = ['company', 'contact', 'email', 'country', 'product'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            return false;
        }
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }
    
    // Validar teléfono si se proporciona
    if (data.phone && data.phone.trim() !== '') {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
            return false;
        }
    }
    
    return true;
}

// Envío de formulario de cotización
function submitQuoteForm(data) {
    const form = document.getElementById('quote-form');
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    
    // Usar el sistema de smooth loading lite
    if (window.SmoothLoaderLite) {
        window.SmoothLoaderLite.showFormLoader(form);
    } else {
        // Fallback si smooth loading no está disponible
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
    }
    
    // Simular llamada API
    setTimeout(() => {
        // Aquí harías la llamada real a tu API
        console.log('Datos de cotización:', data);
        
        // Ocultar loading
        if (window.SmoothLoaderLite) {
            window.SmoothLoaderLite.hideFormLoader(form);
        } else {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
        
        // Mostrar mensaje de éxito con animación
        showMessage('¡Cotización enviada exitosamente! Nos contactaremos pronto.', 'success');
        
        // Resetear formulario
        document.getElementById('quote-form').reset();
        
        // Opcional: enviar a Google Analytics o similar
        trackQuoteSubmission(data);
        
    }, 2000);
}

// Mostrar mensajes
function showMessage(message, type) {
    const messageDiv = document.querySelector('.success-message') || createMessageDiv();
    
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Crear div de mensaje si no existe
function createMessageDiv() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const form = document.getElementById('quote-form');
    form.parentNode.insertBefore(messageDiv, form);
    
    return messageDiv;
}

// Scroll suave para enlaces internos
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetSection.offsetTop - headerHeight - 20; // Extra padding
                
                // Use custom smooth scroll with easing for better performance
                smoothScrollTo(targetPosition, 800);
            }
        });
    });
}

// Custom smooth scroll function with easing
function smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
        
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animation);
}

// Tracking de eventos (para analytics)
function trackQuoteSubmission(data) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'quote_submission', {
            'event_category': 'engagement',
            'event_label': data.producto,
            'value': 1
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: data.producto,
            content_category: 'quote_request'
        });
    }
}

// Utilidades adicionales - Consolidadas desde utils.js
const Utils = {
    // Formatear números
    formatNumber: function(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    },
    
    // Formatear moneda
    formatCurrency: function(amount, currency = 'USD') {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    // Detectar dispositivo móvil
    isMobile: function() {
        return window.innerWidth <= 768;
    },
    
    // Detectar tablet
    isTablet: function() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    },
    
    // Debounce para optimizar eventos
    debounce: function(func, wait) {
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
    
    // Throttle para eventos de scroll
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },
    
    // Validar email
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validar teléfono
    isValidPhone: function(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    },
    
    // Generar ID único
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Scroll suave a elemento
    scrollToElement: function(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    },
    
    // Obtener parámetros de URL
    getUrlParams: function() {
        const params = {};
        const urlSearchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlSearchParams) {
            params[key] = value;
        }
        return params;
    },
    
    // Almacenamiento local
    storage: {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                return false;
            }
        },
        
        get: function(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return null;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Error removing from localStorage:', e);
                return false;
            }
        }
    }
};

// Constantes de la aplicación consolidadas
const CONSTANTS = {
    COMPANY_NAME: 'ZIVAH International S.A.',
    COMPANY_EMAIL: 'sales@zivahinternational.com',
    COMPANY_PHONE: '+1 (305) XXX-XXXX',
    COMPANY_WHATSAPP: '+593 9X XXX XXXX',
    COMPANY_ADDRESS: 'Miami, Florida, USA',
    
    // Productos principales
    MAIN_PRODUCTS: [
        'Frutas Tropicales',
        'Productos del Mar',
        'Café Arábica',
        'Camarón Premium',
        'Larvas de Camarón'
    ],
    
    // Países de destino
    TARGET_COUNTRIES: [
        'Estados Unidos', 'Canadá', 'México', 'España', 'Francia',
        'Italia', 'Alemania', 'Reino Unido', 'Japón', 'Corea del Sur',
        'China', 'Australia', 'Brasil', 'Argentina', 'Chile'
    ],
    
    // Certificaciones
    CERTIFICATIONS: [
        'HACCP', 'BRC', 'BAP', 'ASC', 'Orgánico USDA', 'GlobalGAP'
    ]
};

// Funciones de validación específicas consolidadas
const Validators = {
    // Validar formulario de cotización
    validateQuoteForm: function(data) {
        const errors = [];
        
        if (!data.nombre || data.nombre.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }
        
        if (!Utils.isValidEmail(data.email)) {
            errors.push('El email no es válido');
        }
        
        if (!data.empresa || data.empresa.trim().length < 2) {
            errors.push('El nombre de la empresa es requerido');
        }
        
        if (!data.producto) {
            errors.push('Debe seleccionar un producto');
        }
        
        if (!data.cantidad || isNaN(data.cantidad) || data.cantidad <= 0) {
            errors.push('La cantidad debe ser un número mayor a 0');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },
    
    // Validar formulario de contacto
    validateContactForm: function(data) {
        const errors = [];
        
        if (!data.nombre || data.nombre.trim().length < 2) {
            errors.push('El nombre es requerido');
        }
        
        if (!Utils.isValidEmail(data.email)) {
            errors.push('El email no es válido');
        }
        
        if (!data.mensaje || data.mensaje.trim().length < 10) {
            errors.push('El mensaje debe tener al menos 10 caracteres');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
};

// Animaciones de entrada para elementos
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que queremos animar
    const animateElements = document.querySelectorAll('.product-card, .global-stat, .contact-item');
    animateElements.forEach(el => observer.observe(el));
}

// Inicializar animaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Logo fallback system
function initLogoFallback() {
    const logoImage = document.querySelector('.logo-image');
    
    if (logoImage) {
        logoImage.addEventListener('error', function() {
            // Fallback to PNG if SVG fails to load
            this.src = 'assets/images/icons/android-icon-144x144.png';
            this.style.filter = 'brightness(1.2) contrast(1.2)';
        });
    }
}

// Función global para scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Exportar funciones para uso global si es necesario
window.ZivahApp = {
    Utils,
    CONSTANTS,
    Validators,
    showMessage,
    trackQuoteSubmission,
    initLogoFallback,
    scrollToTop
};

// Hacer scrollToTop disponible globalmente
window.scrollToTop = scrollToTop;

// Integración con el sistema de smooth loading
function initSmoothLoadingIntegration() {
    // Escuchar cuando la carga suave esté completa
    document.addEventListener('smoothLoadComplete', function() {
        console.log('🎉 ZIVAH International - Sistema de loading suave completado');
        
        // Inicializar funcionalidades que dependen de la carga completa
        initAdvancedAnimations();
        initPerformanceOptimizations();
    });
    
    // Ensure smooth scrolling is properly initialized
    // This provides fallback if smooth-loading-lite doesn't handle it
    if (!window.SmoothLoaderLite || !window.SmoothLoaderLite.smoothScrollTo) {
        initBackupSmoothScrolling();
    }
    
    // Configurar lazy loading para imágenes que no tienen data-src
    setupLazyLoadingFallback();
}

// Backup smooth scrolling in case SmoothLoaderLite fails
function initBackupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        // Remove any existing listeners first
        link.removeEventListener('click', handleSmoothScroll);
        link.addEventListener('click', handleSmoothScroll);
    });
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        smoothScrollTo(targetPosition, 800);
    }
}

// Animaciones avanzadas después de la carga
function initAdvancedAnimations() {
    // Animación de aparición progresiva para elementos de productos
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            requestAnimationFrame(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        }, index * 50);
    });
    
    // Efecto de escritura para títulos principales
    animateTypewriter();
}

// Efecto de escritura para títulos
function animateTypewriter() {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle && !heroTitle.classList.contains('typewriter-animated')) {
        heroTitle.classList.add('typewriter-animated');
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 500);
    }
}

// Optimizaciones de rendimiento
function initPerformanceOptimizations() {
    // Lazy loading para elementos pesados
    const heavyElements = document.querySelectorAll('.hero-visual, .products-showcase');
    heavyElements.forEach(element => {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('loaded');
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(element);
        }
    });
    
    // Preload de recursos críticos
    preloadCriticalResources();
}

// Preload de recursos críticos
function preloadCriticalResources() {
    const criticalImages = [
        'assets/images/icons/favicon-96x96.png',
        'assets/images/icons/android-icon-144x144.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Fallback para lazy loading si el sistema principal no está disponible
function setupLazyLoadingFallback() {
    if (!window.SmoothLoaderLite) {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores sin IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            });
        }
    }
}

// Funciones de compartir
function shareWebsite() {
    const shareData = {
        title: 'ZIVAH International S.A. - Exportadores de Productos Ecuatorianos Premium',
        text: 'Descubre los mejores productos ecuatorianos premium para mercados internacionales. Desde frutas tropicales hasta camarón y café de altura.',
        url: window.location.href
    };

    // Intentar usar Web Share API si está disponible
    if (navigator.share && navigator.canShare(shareData)) {
        navigator.share(shareData)
            .then(() => {
                showShareSuccess('¡Sitio web compartido exitosamente!');
            })
            .catch((error) => {
                console.log('Error al compartir:', error);
                fallbackShare();
            });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    // Fallback para navegadores que no soportan Web Share API
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('ZIVAH International S.A. - Exportadores de Productos Ecuatorianos Premium');
    const text = encodeURIComponent('Descubre los mejores productos ecuatorianos premium para mercados internacionales.');
    
    // Crear enlaces de compartir para redes sociales
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        whatsapp: `https://wa.me/?text=${text}%20${url}`
    };
    
    // Mostrar modal de opciones de compartir
    showShareModal(shareUrls);
}

function showShareModal(shareUrls) {
    // Crear modal de compartir
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-content">
            <div class="share-modal-header">
                <h3>Compartir Sitio Web</h3>
                <button class="share-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="share-modal-body">
                <div class="share-options">
                    <a href="${shareUrls.facebook}" target="_blank" class="share-option facebook">
                        <span class="share-option-icon">📘</span>
                        Facebook
                    </a>
                    <a href="${shareUrls.twitter}" target="_blank" class="share-option twitter">
                        <span class="share-option-icon">🐦</span>
                        Twitter
                    </a>
                    <a href="${shareUrls.linkedin}" target="_blank" class="share-option linkedin">
                        <span class="share-option-icon">💼</span>
                        LinkedIn
                    </a>
                    <a href="${shareUrls.whatsapp}" target="_blank" class="share-option whatsapp">
                        <span class="share-option-icon">💬</span>
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Agregar estilos al modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function copyWebsiteLink() {
    const url = window.location.href;
    
    // Intentar usar Clipboard API moderna
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showShareSuccess('¡Enlace copiado al portapapeles!');
            })
            .catch(() => {
                fallbackCopy(url);
            });
    } else {
        fallbackCopy(url);
    }
}

function fallbackCopy(url) {
    // Fallback para navegadores más antiguos
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showShareSuccess('¡Enlace copiado al portapapeles!');
    } catch (err) {
        console.error('Error al copiar:', err);
        showShareSuccess('Error al copiar el enlace');
    }
    
    document.body.removeChild(textArea);
}

function showShareSuccess(message) {
    // Crear o reutilizar elemento de mensaje de éxito
    let successElement = document.querySelector('.share-success');
    
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.className = 'share-success';
        document.body.appendChild(successElement);
    }
    
    successElement.textContent = message;
    successElement.classList.add('show');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        successElement.classList.remove('show');
    }, 3000);
}

// Funciones globales mínimas del smooth loader
window.showFormLoader = (form) => window.SmoothLoaderLite?.showFormLoader(form);
window.hideFormLoader = (form) => window.SmoothLoaderLite?.hideFormLoader(form);

// Hacer funciones disponibles globalmente
window.shareWebsite = shareWebsite;
window.copyWebsiteLink = copyWebsiteLink;

// Exportar para uso en módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    ECUADOR_EXPORT_COUNTRIES, 
    getCountriesByRegion, 
    searchCountries,
    ECUADOR_EXPORT_PRODUCTS,
    getProductsByCategory,
    searchProducts,
    ZIVAH_PERFORMANCE_CONFIG: window.ZIVAH_PERFORMANCE_CONFIG,
    ZIVAH_PERFORMANCE_UTILS: window.ZIVAH_PERFORMANCE_UTILS
  };
}

// Log de configuración aplicada (solo en desarrollo)
if (window.location.hostname === 'localhost') {
    console.log('🔧 ZIVAH Performance Config:', window.ZIVAH_PERFORMANCE_CONFIG);
    
    // Métricas de rendimiento para desarrollo
    if ('performance' in window) {
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
}