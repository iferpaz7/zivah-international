# ZIVAH International - Script de Verificación del Sistema de Loading
Write-Host "🔍 Verificando Sistema de Loading Optimizado..." -ForegroundColor Cyan

$errors = @()
$warnings = @()
$success = @()

# Verificar archivos principales
$requiredFiles = @(
    "index.html",
    "css/styles.css",
    "js/main.js"
)

Write-Host "`n📁 Verificando archivos principales..." -ForegroundColor Yellow
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        $success += "✅ $file existe"
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        $errors += "❌ $file no encontrado"
        Write-Host "  ❌ $file" -ForegroundColor Red
    }
}

# Verificar versiones en HTML
Write-Host "`n🔢 Verificando versiones..." -ForegroundColor Yellow
if (Test-Path "index.html") {
    $htmlContent = Get-Content "index.html" -Raw
    
    # Verificar CSS
    if ($htmlContent -match 'css/styles\.css\?v=') {
        $success += "✅ CSS styles version found"
        Write-Host "  ✅ CSS styles with versioning" -ForegroundColor Green
    } else {
        $warnings += "⚠️ CSS styles version not found"
        Write-Host "  ⚠️ CSS styles version missing" -ForegroundColor Yellow
    }
    
    # Verificar JS consolidado
    if ($htmlContent -match 'js/main\.js\?v=') {
        $success += "✅ JavaScript consolidated version correcta"
        Write-Host "  ✅ JavaScript main.js (consolidated) with versioning" -ForegroundColor Green
    } else {
        $warnings += "⚠️ JavaScript main.js version incorrecta"
        Write-Host "  ⚠️ JavaScript main.js version missing" -ForegroundColor Yellow
    }
    
    if ($htmlContent -match 'js/smooth-loading-lite\.js\?v=1\.0\.3') {
        $success += "✅ Smooth loading lite version correcta"
        Write-Host "  ✅ Smooth loading lite v1.0.3" -ForegroundColor Green
    } else {
        $warnings += "⚠️ Smooth loading lite version incorrecta"
        Write-Host "  ⚠️ Smooth loading lite version" -ForegroundColor Yellow
    }
}

# Verificar configuración SEO-friendly en main.js consolidado
Write-Host "`n🤖 Verificando configuración SEO..." -ForegroundColor Yellow
if (Test-Path "js/main.js") {
    $mainContent = Get-Content "js/main.js" -Raw
    
    if ($mainContent -match 'skipLoaderForBots.*true') {
        $success += "✅ Configuración SEO para bots habilitada (consolidada)"
        Write-Host "  ✅ Skip loader for bots: enabled (consolidated)" -ForegroundColor Green
    } else {
        $warnings += "⚠️ Configuración SEO para bots no encontrada"
        Write-Host "  ⚠️ Skip loader for bots: not found" -ForegroundColor Yellow
    }
    
    if ($mainContent -match 'isBot.*bot\|crawler\|spider') {
        $success += "✅ Detección de bots configurada (consolidada)"
        Write-Host "  ✅ Bot detection: configured (consolidated)" -ForegroundColor Green
    } else {
        $warnings += "⚠️ Detección de bots no encontrada"
        Write-Host "  ⚠️ Bot detection: not found" -ForegroundColor Yellow
    }
    
    # Verificar optimizaciones de rendimiento consolidadas
    Write-Host "`n⚡ Verificando optimizaciones de rendimiento..." -ForegroundColor Yellow
    
    if ($mainContent -match 'prefers-reduced-motion') {
        $success += "✅ Soporte para reduced motion (consolidado)"
        Write-Host "  ✅ Reduced motion support (consolidated)" -ForegroundColor Green
    } else {
        $warnings += "⚠️ Soporte para reduced motion no encontrado"
        Write-Host "  ⚠️ Reduced motion support: not found" -ForegroundColor Yellow
    }
    
    if ($mainContent -match 'requestIdleCallback') {
        $success += "✅ Optimización con requestIdleCallback (consolidado)"
        Write-Host "  ✅ RequestIdleCallback optimization (consolidated)" -ForegroundColor Green
    } else {
        $warnings += "⚠️ RequestIdleCallback no encontrado"
        Write-Host "  ⚠️ RequestIdleCallback: not found" -ForegroundColor Yellow
    }
}

# Verificar archivos de documentación
Write-Host "`n📚 Verificando documentación..." -ForegroundColor Yellow
$docFiles = @(
    "SMOOTH-LOADING-GUIDE.md",
    "PERFORMANCE-ANALYSIS.md",
    "CHANGELOG-v1.0.3.md"
)

foreach ($doc in $docFiles) {
    if (Test-Path $doc) {
        $success += "✅ $doc existe"
        Write-Host "  ✅ $doc" -ForegroundColor Green
    } else {
        $warnings += "⚠️ $doc no encontrado"
        Write-Host "  ⚠️ $doc" -ForegroundColor Yellow
    }
}

# Verificar demo
Write-Host "`n🎪 Verificando demo..." -ForegroundColor Yellow
if (Test-Path "demo-loading.html") {
    $success += "✅ Demo disponible"
    Write-Host "  ✅ demo-loading.html" -ForegroundColor Green
} else {
    $warnings += "⚠️ Demo no encontrado"
    Write-Host "  ⚠️ demo-loading.html" -ForegroundColor Yellow
}

# Verificar tamaños de archivo consolidado
Write-Host "`n📊 Verificando tamaños de archivo..." -ForegroundColor Yellow
$sizeChecks = @{
    "js/main.js" = 81920    # ~80KB máximo para el archivo consolidado
    "css/styles.css" = 8192  # ~8KB máximo
}

foreach ($file in $sizeChecks.Keys) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        $maxSize = $sizeChecks[$file]
        
        if ($size -le $maxSize) {
            $sizeKB = [math]::Round($size/1024, 1)
            $success += "✅ $file tamaño optimizado ($sizeKB KB)"
            Write-Host "  ✅ $file ($sizeKB KB)" -ForegroundColor Green
        } else {
            $sizeKB = [math]::Round($size/1024, 1)
            $warnings += "⚠️ $file tamaño grande ($sizeKB KB)"
            Write-Host "  ⚠️ $file ($sizeKB KB)" -ForegroundColor Yellow
        }
    } else {
        $errors += "❌ $file no encontrado"
        Write-Host "  ❌ $file no encontrado" -ForegroundColor Red
    }
}

# Resumen final
Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "📋 RESUMEN DE VERIFICACIÓN" -ForegroundColor Cyan
Write-Host "="*60 -ForegroundColor Cyan

Write-Host "`n✅ ÉXITOS ($($success.Count)):" -ForegroundColor Green
foreach ($s in $success) {
    Write-Host "  $s" -ForegroundColor Green
}

if ($warnings.Count -gt 0) {
    Write-Host "`n⚠️ ADVERTENCIAS ($($warnings.Count)):" -ForegroundColor Yellow
    foreach ($w in $warnings) {
        Write-Host "  $w" -ForegroundColor Yellow
    }
}

if ($errors.Count -gt 0) {
    Write-Host "`n❌ ERRORES ($($errors.Count)):" -ForegroundColor Red
    foreach ($e in $errors) {
        Write-Host "  $e" -ForegroundColor Red
    }
}

# Estado final
Write-Host "`n" + "="*60 -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    if ($warnings.Count -eq 0) {
        Write-Host "🎉 SISTEMA DE LOADING: PERFECTO" -ForegroundColor Green
        Write-Host "   Todo está configurado correctamente" -ForegroundColor Green
    } else {
        Write-Host "✅ SISTEMA DE LOADING: FUNCIONAL" -ForegroundColor Yellow
        Write-Host "   Funciona correctamente con advertencias menores" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ SISTEMA DE LOADING: PROBLEMAS" -ForegroundColor Red
    Write-Host "   Requiere correcciones antes del despliegue" -ForegroundColor Red
}

Write-Host "`n💡 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "   1. Probar en navegador: index.html" -ForegroundColor White
Write-Host "   2. Revisar demo: demo-loading.html" -ForegroundColor White
Write-Host "   3. Verificar métricas en DevTools" -ForegroundColor White
Write-Host "   4. Subir archivos al servidor" -ForegroundColor White
Write-Host "   5. Probar en producción" -ForegroundColor White

Write-Host "`n🚀 ZIVAH International - Sistema de Loading v1.0.3" -ForegroundColor Cyan