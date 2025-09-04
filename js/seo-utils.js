// SEO and Performance Utilities for ZIVAH International

class SEOManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupIntersectionObserver();
        this.setupPerformanceTracking();
        this.setupSchemaUpdates();
    }

    // Lazy loading for images and content
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Track page sections for analytics
    setupIntersectionObserver() {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.id || entry.target.className;
                    this.trackSectionView(sectionName);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('section[id]').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Performance tracking
    setupPerformanceTracking() {
        // Core Web Vitals tracking
        if ('web-vital' in window) {
            import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(this.sendToAnalytics);
                getFID(this.sendToAnalytics);
                getFCP(this.sendToAnalytics);
                getLCP(this.sendToAnalytics);
                getTTFB(this.sendToAnalytics);
            });
        }

        // Page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.trackPerformance({
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                firstByte: perfData.responseStart - perfData.requestStart
            });
        });
    }

    // Dynamic schema updates
    setupSchemaUpdates() {
        // Update last modified dates
        const now = new Date().toISOString().split('T')[0];
        const schemas = document.querySelectorAll('script[type="application/ld+json"]');
        
        schemas.forEach(schema => {
            try {
                const data = JSON.parse(schema.textContent);
                if (data['@type'] === 'WebSite' || data['@type'] === 'Organization') {
                    data.dateModified = now;
                    schema.textContent = JSON.stringify(data);
                }
            } catch (e) {
                console.warn('Error updating schema:', e);
            }
        });
    }



    // Analytics tracking methods
    trackSectionView(sectionName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'section_view', {
                section_name: sectionName,
                page_title: document.title
            });
        }
    }

    trackPerformance(metrics) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_performance', {
                custom_map: {
                    metric_1: 'load_time',
                    metric_2: 'dom_content_loaded',
                    metric_3: 'first_byte'
                },
                metric_1: metrics.loadTime,
                metric_2: metrics.domContentLoaded,
                metric_3: metrics.firstByte
            });
        }
    }

    sendToAnalytics(metric) {
        if (typeof gtag !== 'undefined') {
            gtag('event', metric.name, {
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                event_category: 'Web Vitals',
                event_label: metric.id,
                non_interaction: true
            });
        }
    }

    // SEO optimization methods
    updatePageTitle(newTitle) {
        document.title = newTitle;
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', newTitle);
        document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', newTitle);
    }

    updatePageDescription(newDescription) {
        document.querySelector('meta[name="description"]')?.setAttribute('content', newDescription);
        document.querySelector('meta[property="og:description"]')?.setAttribute('content', newDescription);
        document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', newDescription);
    }

    // Generate breadcrumb schema
    generateBreadcrumbSchema(breadcrumbs) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name,
                "item": crumb.url
            }))
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    // Add FAQ schema for common questions
    addFAQSchema(faqs) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    // Generate sitemap dynamically
    generateSitemap() {
        const pages = [
            { url: '/', priority: '1.0', changefreq: 'weekly' },
            { url: '/#productos', priority: '0.9', changefreq: 'monthly' },
            { url: '/#todos-productos', priority: '0.8', changefreq: 'monthly' },
            { url: '/#calidad', priority: '0.8', changefreq: 'monthly' },
            { url: '/#cotizar', priority: '0.9', changefreq: 'weekly' },
            { url: '/#contacto', priority: '0.7', changefreq: 'monthly' }
        ];

        return pages;
    }
}

// Initialize SEO Manager
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.seoManager = new SEOManager();
        setupFAQs();
    });
} else {
    window.seoManager = new SEOManager();
    setupFAQs();
}

function setupFAQs() {
    // Add common FAQs
    const commonFAQs = [
        {
            question: "¿Qué productos ecuatorianos exporta ZIVAH International?",
            answer: "Exportamos una amplia gama de productos ecuatorianos premium incluyendo frutas tropicales (mango, aguacate, piña), camarón blanco del Pacífico, café arábica de altura, larvas de camarón para acuicultura, y productos del mar frescos."
        },
        {
            question: "¿Qué certificaciones tienen sus productos?",
            answer: "Nuestros productos cuentan con certificaciones internacionales como HACCP, BRC Global Standard, BAP (Best Aquaculture Practices), certificación orgánica, FDA approval, y GlobalGAP para garantizar la máxima calidad y seguridad."
        },
        {
            question: "¿A qué países exportan desde Miami?",
            answer: "Desde nuestra base en Miami, Florida, exportamos a más de 25 países incluyendo Estados Unidos, Canadá, España, Italia, Francia, Alemania, Reino Unido, Japón, Corea del Sur, y otros mercados internacionales."
        },
        {
            question: "¿Cómo puedo solicitar una cotización?",
            answer: "Puede solicitar una cotización completando nuestro formulario en línea, enviando un email a sales@zivahinternational.com, o contactándonos por teléfono. Nuestro equipo responde en menos de 24 horas con propuestas personalizadas."
        },
        {
            question: "¿Qué garantías ofrecen en sus productos?",
            answer: "Ofrecemos garantía de calidad del 99.8% en todos nuestros productos, trazabilidad completa desde la finca hasta el destino, cadena de frío garantizada, y certificaciones internacionales que respaldan la excelencia de nuestros productos ecuatorianos."
        }
    ];
    
    window.seoManager.addFAQSchema(commonFAQs);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOManager;
}