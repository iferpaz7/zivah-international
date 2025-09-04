# 🎛️ Configuración de cPanel InterServer para ZIVAH International

## 📋 Pasos Específicos para InterServer cPanel

### 1. Acceso a cPanel
- **URL**: `https://tudominio.com/cpanel`
- **Usuario**: Tu usuario de InterServer
- **Contraseña**: Tu contraseña de InterServer

### 2. File Manager - Subir Archivos
1. **Abrir File Manager**
2. **Navegar a public_html** (o la carpeta raíz de tu sitio)
3. **Subir archivos en este orden**:
   ```
   📁 public_html/
   ├── .htaccess                    ← PRIMERO
   ├── index.html                   ← SEGUNDO
   ├── css/
   │   ├── styles.css
   │   └── responsive.css
   ├── js/
   │   ├── main.js
   │   ├── seo-utils.js
   │   └── utils.js
   └── assets/
       └── images/
   ```

### 3. Configurar Permisos de Archivos
```bash
# En File Manager, hacer clic derecho → Change Permissions:
📄 Archivos: 644 (rw-r--r--)
📁 Carpetas: 755 (rwxr-xr-x)
🔒 .htaccess: 644 (muy importante)
```

### 4. Optimize Website (InterServer)
1. **Buscar "Optimize Website"** en cPanel
2. **Habilitar compresión GZIP**
3. **Configurar caché del servidor**
4. **Habilitar headers de seguridad**

### 5. Verificar Configuración
```bash
# En File Manager, verificar que existan:
✅ .htaccess en la raíz
✅ index.html con parámetros de versión
✅ Todas las carpetas css/, js/, assets/
✅ Permisos correctos en todos los archivos
```

## 🔧 Configuración Avanzada de InterServer

### 1. Error Logs
- **Ubicación**: cPanel → Error Logs
- **Función**: Ver errores de configuración
- **Importante**: Revisar después de subir .htaccess

### 2. MultiPHP Manager
- **Ubicación**: cPanel → MultiPHP Manager
- **Configuración**: PHP 8.1 o superior
- **Extensiones**: Habilitar mod_headers

### 3. Security Headers
- **Ubicación**: cPanel → Security
- **Configurar**: Headers de seguridad adicionales
- **Verificar**: Que no entren en conflicto con .htaccess

## 🚨 Solución de Problemas Específicos de InterServer

### Problema: Error 500 después de subir .htaccess
**Solución InterServer**:
1. **Acceder a Error Logs** en cPanel
2. **Verificar sintaxis** del archivo .htaccess
3. **Contactar soporte** si persiste el error
4. **Temporalmente renombrar** .htaccess a .htaccess.bak

### Problema: Archivos no se actualizan
**Solución InterServer**:
1. **Verificar caché del servidor** en cPanel
2. **Limpiar caché** desde Optimize Website
3. **Verificar permisos** de archivos
4. **Subir archivos nuevamente**

### Problema: Lento acceso a archivos
**Solución InterServer**:
1. **Habilitar compresión GZIP**
2. **Configurar caché del navegador**
3. **Optimizar imágenes** antes de subir
4. **Verificar configuración de CDN** (si aplica)

## 📞 Soporte InterServer

### Contacto Directo
- **Teléfono**: +1-888-262-4674
- **Chat en vivo**: Disponible 24/7
- **Ticket system**: Desde cPanel

### Información Necesaria
- **Dominio**: tudominio.com
- **Usuario cPanel**: Tu usuario
- **Descripción del problema**: Demora en actualización de cambios
- **Archivos modificados**: .htaccess, index.html, CSS, JS

## ✅ Checklist de Verificación

### Antes de Subir Archivos
- [ ] Hacer backup del sitio actual
- [ ] Verificar que .htaccess esté correcto
- [ ] Actualizar versiones con PowerShell script
- [ ] Comprobar que todos los archivos estén listos

### Después de Subir Archivos
- [ ] Verificar que .htaccess esté en la raíz
- [ ] Comprobar permisos de archivos (644/755)
- [ ] Probar acceso al sitio web
- [ ] Verificar cambios en navegador (Ctrl+Shift+R)
- [ ] Revisar Error Logs si hay problemas

### Verificación Final
- [ ] Sitio carga correctamente
- [ ] Cambios se ven inmediatamente
- [ ] No hay errores en consola del navegador
- [ ] Archivos CSS/JS se descargan con nueva versión

## 🎯 Comandos Útiles para Verificación

### Verificar Headers HTTP
```bash
# Usar herramientas de desarrollador del navegador:
# Network tab → Verificar headers de archivos CSS/JS
# Deberían mostrar: Cache-Control: no-cache, no-store, must-revalidate
```

### Verificar Parámetros de Versión
```html
<!-- En el código fuente de la página: -->
<link rel="stylesheet" href="css/styles.css?v=1.0.2" />
<script src="js/main.js?v=1.0.2"></script>
```

### Verificar Funcionamiento
```javascript
// En consola del navegador:
console.log('ZIVAH International - Versión:', '1.0.2');
console.log('Última actualización:', new Date().toISOString());
```

---

**Configuración específica para**: InterServer cPanel
**Última verificación**: $(Get-Date -Format "yyyy-MM-dd")
**Estado**: ✅ Configurado para evitar problemas de caché
