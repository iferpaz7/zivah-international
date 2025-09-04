# Guía de Despliegue - ZIVAH International en cPanel

## 📋 Preparación para Despliegue

### Archivos Necesarios para Subir
```
📁 Sitio Web ZIVAH/
├── 📄 index.html (archivo principal)
├── 📄 404.html (página de error)
├── 📄 sitemap.xml (mapa del sitio)
├── 📄 robots.txt (instrucciones para bots)
├── 📄 site.webmanifest (configuración PWA)
├── 📄 browserconfig.xml (configuración Microsoft)
├── 📄 .htaccess (configuración Apache)
├── 📁 css/
│   ├── styles.css
│   └── responsive.css (si existe)
├── 📁 js/
│   ├── main.js
│   └── seo-utils.js
└── 📁 assets/ (crear esta carpeta)
    ├── 📁 images/
    │   ├── 📁 icons/ (iconos PWA)
    │   └── 📁 screenshots/ (capturas PWA)
    └── 📁 fonts/ (si tienes fuentes personalizadas)
```

## 🚀 Pasos para Despliegue en cPanel

### 1. Acceso a cPanel
- Ingresa a tu cPanel: `https://tudominio.com/cpanel` o `https://tudominio.com:2083`
- Usuario y contraseña proporcionados por tu hosting

### 2. Administrador de Archivos
- Busca "File Manager" o "Administrador de Archivos"
- Navega a la carpeta `public_html/` (carpeta raíz del sitio web)

### 3. Limpieza Inicial
- Elimina archivos por defecto como `index.html` existente
- Mantén solo archivos necesarios como `.htaccess` si ya existe

### 4. Subida de Archivos
**Opción A - Subir archivo por archivo:**
- Usa "Upload" para subir `index.html`, `404.html`, etc.
- Crea carpetas `css/`, `js/`, `assets/` usando "New Folder"
- Sube archivos a sus respectivas carpetas

**Opción B - Subir como ZIP (Recomendado):**
- Comprime todos los archivos en un ZIP
- Sube el ZIP a `public_html/`
- Usa "Extract" para descomprimir
- Elimina el archivo ZIP después

### 5. Configuración de Permisos
- Archivos: 644 (lectura/escritura propietario, solo lectura otros)
- Carpetas: 755 (ejecución para propietario, lectura/ejecución otros)
- `.htaccess`: 644

### 6. Verificación DNS
- Asegúrate que el dominio apunte a tu hosting
- Verifica registros A y CNAME si es necesario

## ⚙️ Configuraciones Adicionales en cPanel

### SSL/TLS (Certificado HTTPS)
1. Busca "SSL/TLS" en cPanel
2. Activa "Let's Encrypt" gratuito o sube certificado propio
3. Fuerza HTTPS en "Force HTTPS Redirect"

### Subdominios (Opcional)
- Si quieres `www.zivahinternational.com`
- Crea subdominio en "Subdomains"
- Configura redirección en `.htaccess`

### Email Profesional
- Crea cuentas como `sales@zivahinternational.com`
- Usa "Email Accounts" en cPanel

### Backup Automático
- Configura backups en "Backup Wizard"
- Programa backups semanales/mensuales

## 🔧 Configuraciones Post-Despliegue

### Google Search Console
1. Ve a `https://search.google.com/search-console`
2. Agrega tu dominio
3. Verifica propiedad (archivo HTML o DNS)
4. Envía sitemap: `https://tudominio.com/sitemap.xml`

### Google Analytics
1. Reemplaza `GA_MEASUREMENT_ID` en `index.html`
2. Con tu ID real de Google Analytics 4

### Verificación de Funcionamiento
- [ ] Sitio carga correctamente
- [ ] Tema claro/oscuro funciona
- [ ] Formulario de cotización funciona
- [ ] Todas las secciones son accesibles
- [ ] Sitemap accesible: `/sitemap.xml`
- [ ] Robots.txt accesible: `/robots.txt`
- [ ] SSL activo (candado verde)

## 📱 Optimizaciones Adicionales

### Compresión de Imágenes
- Usa herramientas como TinyPNG antes de subir
- Convierte a WebP para mejor rendimiento

### CDN (Opcional)
- Considera Cloudflare gratuito
- Mejora velocidad global del sitio

### Monitoreo
- Google PageSpeed Insights
- GTmetrix para análisis de rendimiento
- Uptime monitoring

## 🚨 Solución de Problemas Comunes

### Error 500
- Revisa permisos de `.htaccess`
- Verifica sintaxis en `.htaccess`

### Sitio no carga
- Verifica DNS del dominio
- Confirma archivos en `public_html/`

### CSS/JS no cargan
- Revisa rutas en `index.html`
- Verifica permisos de carpetas

### Formulario no funciona
- Necesitarás PHP backend para procesar formularios
- O usar servicios como Formspree, Netlify Forms

## 📞 Contacto de Soporte
- Hosting provider para problemas técnicos
- Documentación de cPanel específica de tu proveedor