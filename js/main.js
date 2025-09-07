// ZIVAH International S.A. - JavaScript Principal

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initTheme();
    initScrollEffects();
    initMobileMenu();
    initFormHandling();
    initSmoothScrolling();
    initLogoFallback();
    
    // Integrar con el sistema de smooth loading
    initSmoothLoadingIntegration();
    
    // Wait for smooth loader to be ready
    if (window.SmoothLoaderLite) {
        // Additional initialization after smooth loader
        setTimeout(initEnhancedAnimations, 100);
    }
});

// Enhanced animations initialization
function initEnhancedAnimations() {
    // Ensure all animation classes are properly set up
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .rotate-in, .section-transition');
    
    // Add intersection observer fallback if SmoothLoaderLite didn't handle it
    if (animatedElements.length > 0 && !document.querySelector('.fade-in.visible')) {
        const fallbackObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fallbackObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            if (!el.classList.contains('visible')) {
                fallbackObserver.observe(el);
            }
        });
    }
}

// Sistema de temas (Light/Dark)
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Obtener tema guardado o usar preferencia del sistema
    const savedTheme = localStorage.getItem('zivah-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Aplicar tema inicial
    setTheme(currentTheme);
    
    // Event listener para el botón de cambio de tema
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
    // Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('zivah-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function setTheme(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    
    // Aplicar tema al documento
    document.documentElement.setAttribute('data-theme', theme);
    
    // Actualizar icono
    if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeIcon.setAttribute('aria-label', 'Switch to light mode');
    } else {
        themeIcon.textContent = '🌙';
        themeIcon.setAttribute('aria-label', 'Switch to dark mode');
    }
    
    // Guardar preferencia
    localStorage.setItem('zivah-theme', theme);
    
    // Dispatch evento personalizado para otros componentes
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
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
        
        // Efecto parallax en hero
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Limitar el efecto parallax para evitar valores extremos
        const maxParallax = window.innerHeight; // Limitar al alto de la ventana
        const limitedRate = Math.max(rate, -maxParallax);
        
        if (hero) {
            hero.style.transform = `translateY(${limitedRate}px)`;
        }
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

// Hacer funciones disponibles globalmente
window.shareWebsite = shareWebsite;
window.copyWebsiteLink = copyWebsiteLink;