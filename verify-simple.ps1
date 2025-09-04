# ZIVAH International - Verificación Simple del Sistema de Loading
Write-Host "Verificando Sistema de Loading v1.0.3..." -ForegroundColor Green

# Verificar archivos principales
$files = @(
    "index.html",
    "css/loading.css", 
    "js/performance-config.js",
    "js/smooth-loading-lite.js",
    "js/main.js"
)

Write-Host "`nArchivos principales:" -ForegroundColor Yellow
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  OK: $file" -ForegroundColor Green
    } else {
        Write-Host "  FALTA: $file" -ForegroundColor Red
    }
}

# Verificar versiones
Write-Host "`nVersiones en HTML:" -ForegroundColor Yellow
if (Test-Path "index.html") {
    $content = Get-Content "index.html" -Raw
    
    if ($content -match "loading\.css\?v=1\.0\.3") {
        Write-Host "  OK: CSS loading v1.0.3" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: CSS loading version incorrecta" -ForegroundColor Red
    }
    
    if ($content -match "performance-config\.js\?v=1\.0\.3") {
        Write-Host "  OK: Performance config v1.0.3" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: Performance config version incorrecta" -ForegroundColor Red
    }
    
    if ($content -match "smooth-loading-lite\.js\?v=1\.0\.3") {
        Write-Host "  OK: Smooth loading lite v1.0.3" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: Smooth loading lite version incorrecta" -ForegroundColor Red
    }
}

# Verificar documentación
Write-Host "`nDocumentación:" -ForegroundColor Yellow
$docs = @(
    "SMOOTH-LOADING-GUIDE.md",
    "PERFORMANCE-ANALYSIS.md", 
    "CHANGELOG-v1.0.3.md"
)

foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "  OK: $doc" -ForegroundColor Green
    } else {
        Write-Host "  FALTA: $doc" -ForegroundColor Yellow
    }
}

# Verificar demo
Write-Host "`nDemo:" -ForegroundColor Yellow
if (Test-Path "demo-loading.html") {
    Write-Host "  OK: demo-loading.html" -ForegroundColor Green
} else {
    Write-Host "  FALTA: demo-loading.html" -ForegroundColor Yellow
}

Write-Host "`nSistema de Loading v1.0.3 verificado!" -ForegroundColor Cyan
Write-Host "Probar en navegador: index.html" -ForegroundColor White
Write-Host "Ver demo: demo-loading.html" -ForegroundColor White