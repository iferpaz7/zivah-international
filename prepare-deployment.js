#!/usr/bin/env node

// Script de preparación para despliegue en cPanel
// ZIVAH International S.A.

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparando despliegue para cPanel...\n');

// Lista de archivos esenciales
const essentialFiles = [
    'index.html',
    '404.html',
    'sitemap.xml',
    'robots.txt',
    'site.webmanifest',
    'browserconfig.xml',
    '.htaccess',
    'css/styles.css',
    'js/main.js'
];

// Verificar archivos esenciales
console.log('📋 Verificando archivos esenciales:');
let allFilesExist = true;

essentialFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - FALTANTE`);
        allFilesExist = false;
    }
});

// Verificar estructura de carpetas
console.log('\n📁 Verificando estructura de carpetas:');
const requiredDirs = ['css', 'js'];

requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`✅ ${dir}/`);
    } else {
        console.log(`❌ ${dir}/ - FALTANTE`);
        allFilesExist = false;
    }
});

// Crear carpeta assets si no existe
if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets', { recursive: true });
    console.log('📁 Creada carpeta: assets/');
}

if (!fs.existsSync('assets/images')) {
    fs.mkdirSync('assets/images', { recursive: true });
    console.log('📁 Creada carpeta: assets/images/');
}

if (!fs.existsSync('assets/images/icons')) {
    fs.mkdirSync('assets/images/icons', { recursive: true });
    console.log('📁 Creada carpeta: assets/images/icons/');
}

// Verificar configuración de Google Analytics
console.log('\n🔍 Verificando configuraciones:');

const indexContent = fs.readFileSync('index.html', 'utf8');

if (indexContent.includes('GA_MEASUREMENT_ID')) {
    console.log('⚠️  Recuerda reemplazar GA_MEASUREMENT_ID con tu ID real de Google Analytics');
} else {
    console.log('✅ Google Analytics configurado');
}

// Verificar meta tags esenciales
const hasTitle = indexContent.includes('<title>');
const hasDescription = indexContent.includes('name="description"');
const hasOG = indexContent.includes('property="og:');
const hasSchema = indexContent.includes('application/ld+json');

console.log(`${hasTitle ? '✅' : '❌'} Meta title`);
console.log(`${hasDescription ? '✅' : '❌'} Meta description`);
console.log(`${hasOG ? '✅' : '❌'} Open Graph tags`);
console.log(`${hasSchema ? '✅' : '❌'} Schema.org structured data`);

// Verificar responsive.css
if (fs.existsSync('css/responsive.css')) {
    console.log('✅ CSS responsive encontrado');
} else {
    console.log('ℹ️  CSS responsive no encontrado (opcional)');
}

// Generar lista de archivos para subir
console.log('\n📦 Generando lista de archivos para subir...');

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Excluir carpetas innecesarias
            if (!['node_modules', '.git', '.kiro', 'dist'].includes(file)) {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            // Excluir archivos innecesarios
            if (!file.startsWith('.') || ['.htaccess'].includes(file)) {
                if (!['.md', '.json', '.js'].includes(path.extname(file)) || 
                    ['main.js'].includes(file)) {
                    arrayOfFiles.push(fullPath);
                }
            }
        }
    });

    return arrayOfFiles;
}

const allFiles = getAllFiles('.');
const deploymentList = allFiles.filter(file => 
    !file.includes('node_modules') && 
    !file.includes('.git') && 
    !file.includes('.kiro') &&
    !file.includes('package') &&
    !file.includes('deployment-guide') &&
    !file.includes('prepare-deployment')
);

console.log('\n📋 Archivos para subir a cPanel:');
deploymentList.forEach(file => {
    console.log(`   ${file}`);
});

// Crear archivo de lista para referencia
fs.writeFileSync('deployment-files.txt', deploymentList.join('\n'));
console.log('\n💾 Lista guardada en: deployment-files.txt');

// Resumen final
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
    console.log('🎉 ¡Todos los archivos esenciales están listos!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Comprimir archivos en ZIP (opcional)');
    console.log('2. Acceder a cPanel File Manager');
    console.log('3. Subir archivos a public_html/');
    console.log('4. Configurar SSL/HTTPS');
    console.log('5. Verificar funcionamiento');
    console.log('\n📖 Ver deployment-guide.md para instrucciones detalladas');
} else {
    console.log('❌ Faltan archivos esenciales. Revisa la lista anterior.');
}

console.log('='.repeat(50));

// Verificar tamaño total
let totalSize = 0;
deploymentList.forEach(file => {
    if (fs.existsSync(file)) {
        totalSize += fs.statSync(file).size;
    }
});

console.log(`📊 Tamaño total: ${(totalSize / 1024).toFixed(2)} KB`);

// Generar checklist final
const checklist = `
# ✅ Checklist de Despliegue - ZIVAH International

## Antes de subir a cPanel:
- [ ] Todos los archivos esenciales presentes
- [ ] Reemplazar GA_MEASUREMENT_ID con ID real
- [ ] Verificar información de contacto en HTML
- [ ] Comprimir imágenes si las hay
- [ ] Revisar URLs en sitemap.xml

## En cPanel:
- [ ] Subir archivos a public_html/
- [ ] Configurar permisos correctos
- [ ] Activar SSL/HTTPS
- [ ] Probar todas las funcionalidades
- [ ] Verificar formulario de cotización

## Post-despliegue:
- [ ] Registrar en Google Search Console
- [ ] Enviar sitemap a Google
- [ ] Configurar Google Analytics
- [ ] Probar en diferentes dispositivos
- [ ] Verificar velocidad con PageSpeed Insights

Fecha: ${new Date().toLocaleDateString()}
`;

fs.writeFileSync('deployment-checklist.md', checklist);
console.log('📝 Checklist creado: deployment-checklist.md');