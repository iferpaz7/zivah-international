// ZIVAH International S.A. - JavaScript Principal

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initScrollEffects();
    initMobileMenu();
    initFormHandling();
    initSmoothScrolling();
});

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
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
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
    const requiredFields = ['nombre', 'email', 'empresa', 'producto', 'cantidad'];
    
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
    
    return true;
}

// Envío de formulario de cotización
function submitQuoteForm(data) {
    // Mostrar loading
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simular llamada API
    setTimeout(() => {
        // Aquí harías la llamada real a tu API
        console.log('Datos de cotización:', data);
        
        // Mostrar mensaje de éxito
        showMessage('¡Cotización enviada exitosamente! Nos contactaremos pronto.', 'success');
        
        // Resetear formulario
        document.getElementById('quote-form').reset();
        
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
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
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
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

// Utilidades adicionales
const Utils = {
    // Formatear números
    formatNumber: function(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    },
    
    // Detectar dispositivo móvil
    isMobile: function() {
        return window.innerWidth <= 768;
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

// Exportar funciones para uso global si es necesario
window.ZivahApp = {
    Utils,
    showMessage,
    trackQuoteSubmission
};