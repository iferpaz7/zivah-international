// ZIVAH International S.A. - Configuración del Proyecto

export const PROJECT_CONFIG = {
  // Información del proyecto
  name: 'ZIVAH International Website',
  version: '1.0.0',
  description: 'Sitio web corporativo para exportadores premium de productos ecuatorianos',
  
  // Configuración de desarrollo
  development: {
    port: 8000,
    host: 'localhost',
    openBrowser: true,
    liveReload: true
  },
  
  // Configuración de producción
  production: {
    minify: true,
    compress: true,
    optimizeImages: true,
    generateSitemap: true
  },
  
  // Rutas del proyecto
  paths: {
    src: './',
    dist: './dist',
    assets: './assets',
    css: './css',
    js: './js',
    images: './assets/images'
  },
  
  // Configuración SEO
  seo: {
    title: 'ZIVAH International S.A. - Exportadores de Productos Ecuatorianos Premium',
    description: 'Exportadores líderes de productos ecuatorianos premium desde Miami. Frutas tropicales, mariscos, café, camarón y larvas de acuicultura.',
    keywords: 'exportacion ecuador, frutas tropicales, camarón ecuatoriano, larvas acuicultura, cafe arabica, productos marinos, miami exportadores',
    author: 'ZIVAH International S.A.',
    language: 'es',
    robots: 'index, follow',
    canonical: 'https://zivahinternational.com'
  },
  
  // Configuración de frameworks para migración
  frameworks: {
    astro: {
      template: '@astrojs/create-astro',
      features: ['react', 'tailwind', 'sitemap', 'robots-txt']
    },
    nextjs: {
      template: 'create-next-app@latest',
      features: ['typescript', 'tailwind', 'eslint', 'app-router']
    },
    nuxt: {
      template: 'create-nuxt-app',
      features: ['typescript', 'tailwind', 'pwa', 'content']
    }
  },
  
  // Configuración de optimización
  optimization: {
    images: {
      formats: ['webp', 'avif', 'jpg', 'png'],
      quality: 85,
      sizes: [320, 640, 768, 1024, 1280, 1920]
    },
    css: {
      purge: true,
      minify: true,
      autoprefixer: true
    },
    js: {
      minify: true,
      treeshake: true,
      moduleFormat: 'es6'
    }
  },
  
  // Configuración de analytics
  analytics: {
    googleAnalytics: 'GA_MEASUREMENT_ID',
    facebookPixel: 'FB_PIXEL_ID',
    hotjar: 'HOTJAR_ID'
  },
  
  // Configuración de API (para futuro backend)
  api: {
    baseURL: process.env.NODE_ENV === 'production' 
      ? 'https://api.zivahinternational.com' 
      : 'http://localhost:3001',
    endpoints: {
      quotes: '/api/quotes',
      contact: '/api/contact',
      products: '/api/products',
      newsletter: '/api/newsletter'
    }
  }
};

// Configuración específica por entorno
export const getConfig = (env = 'development') => {
  const baseConfig = PROJECT_CONFIG;
  
  if (env === 'production') {
    return {
      ...baseConfig,
      ...baseConfig.production
    };
  }
  
  return {
    ...baseConfig,
    ...baseConfig.development
  };
};

export default PROJECT_CONFIG;