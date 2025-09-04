// ZIVAH International S.A. - Utilidades JavaScript

// Utilidades generales
export const Utils = {
  // Formatear números con separadores de miles
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

// Constantes de la aplicación
export const CONSTANTS = {
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

// Funciones de validación específicas
export const Validators = {
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

// Funciones de API (preparadas para futuro backend)
export const API = {
  // Configuración base
  baseURL: '/api',
  
  // Enviar cotización
  submitQuote: async function(data) {
    try {
      // Simular llamada API por ahora
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la llamada real:
      // const response = await fetch(`${this.baseURL}/quotes`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // return await response.json();
      
      return { success: true, message: 'Cotización enviada exitosamente' };
    } catch (error) {
      console.error('Error submitting quote:', error);
      return { success: false, message: 'Error al enviar la cotización' };
    }
  },
  
  // Enviar mensaje de contacto
  submitContact: async function(data) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, message: 'Mensaje enviado exitosamente' };
    } catch (error) {
      console.error('Error submitting contact:', error);
      return { success: false, message: 'Error al enviar el mensaje' };
    }
  }
};